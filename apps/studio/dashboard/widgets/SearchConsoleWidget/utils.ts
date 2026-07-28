import { SignJWT, importPKCS8 } from 'jose'
import type { GSCApiRow, GSCData } from './types'

// Baked in at Vite build time via SANITY_STUDIO_* env vars
export const GSC_EMAIL = process.env.SANITY_STUDIO_GSC_SERVICE_ACCOUNT_EMAIL ?? ''
export const GSC_PRIVATE_KEY = process.env.SANITY_STUDIO_GSC_PRIVATE_KEY ?? ''
export const GSC_SITE_URL = process.env.SANITY_STUDIO_GSC_SITE_URL ?? ''

const CACHE_TTL_MS = 60 * 60 * 1000 // 1 hour

let tokenCache: { token: string; expiresAt: number } | null = null
let dataCache: { data: GSCData; expiresAt: number } | null = null

export const getDateRange = (): { startDate: string; endDate: string } => {
  const end = new Date()
  end.setDate(end.getDate() - 3) // GSC has a ~2-3 day data lag
  const start = new Date(end)
  start.setDate(start.getDate() - 27) // 28-day window
  const fmt = (d: Date) => d.toISOString().slice(0, 10)
  return { startDate: fmt(start), endDate: fmt(end) }
}

const getAccessToken = async (): Promise<string> => {
  if (tokenCache && Date.now() < tokenCache.expiresAt) {
    return tokenCache.token
  }

  // PEM keys stored in env vars use literal \n — convert back to real newlines
  const pem = GSC_PRIVATE_KEY.replace(/\\n/g, '\n')
  const key = await importPKCS8(pem, 'RS256')
  const now = Math.floor(Date.now() / 1000)

  const jwt = await new SignJWT({
    iss: GSC_EMAIL,
    scope: 'https://www.googleapis.com/auth/webmasters.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  })
    .setProtectedHeader({ alg: 'RS256' })
    .sign(key)

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  })

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error_description?: string }
    throw new Error(body.error_description ?? `Token exchange failed (${res.status})`)
  }

  const { access_token } = (await res.json()) as { access_token: string }
  // Cache for slightly under the token's 1-hour lifetime
  tokenCache = { token: access_token, expiresAt: Date.now() + 55 * 60 * 1000 }
  return access_token
}

export const fetchGSCData = async (): Promise<GSCData> => {
  if (dataCache && Date.now() < dataCache.expiresAt) {
    return dataCache.data
  }

  const token = await getAccessToken()
  const { startDate, endDate } = getDateRange()
  const endpoint = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(GSC_SITE_URL)}/searchAnalytics/query`
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }

  const [totalsRes, queriesRes, trendRes] = await Promise.all([
    fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({ startDate, endDate }),
    }),
    fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({ startDate, endDate, dimensions: ['query'], rowLimit: 10 }),
    }),
    fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({ startDate, endDate, dimensions: ['date'], rowLimit: 31 }),
    }),
  ])

  const [totalsBody, queriesBody, trendBody] = (await Promise.all([
    totalsRes.json(),
    queriesRes.json(),
    trendRes.json(),
  ])) as [
    { rows?: GSCApiRow[]; error?: { message?: string } },
    { rows?: GSCApiRow[]; error?: { message?: string } },
    { rows?: GSCApiRow[]; error?: { message?: string } },
  ]

  if (!totalsRes.ok || !queriesRes.ok || !trendRes.ok) {
    const err = totalsBody.error ?? queriesBody.error ?? trendBody.error
    throw new Error(
      err?.message ??
        `GSC API error (${[totalsRes.status, queriesRes.status, trendRes.status].join('/')}) — check that SANITY_STUDIO_GSC_SITE_URL exactly matches a verified property in Search Console.`,
    )
  }

  const t = totalsBody.rows?.[0]

  const data: GSCData = {
    period: { startDate, endDate },
    totals: {
      clicks: t?.clicks ?? 0,
      impressions: t?.impressions ?? 0,
      ctr: t?.ctr ?? 0,
      position: t?.position ?? 0,
    },
    topQueries: (queriesBody.rows ?? []).map(row => ({
      query: row.keys?.[0] ?? '',
      clicks: row.clicks ?? 0,
      impressions: row.impressions ?? 0,
      ctr: row.ctr ?? 0,
      position: row.position ?? 0,
    })),
    clickTrend: (trendBody.rows ?? []).map(row => ({
      date: row.keys?.[0] ?? '',
      clicks: row.clicks ?? 0,
    })),
  }

  dataCache = { data, expiresAt: Date.now() + CACHE_TTL_MS }
  return data
}
