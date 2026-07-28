'use client'

import { DashboardWidgetContainer } from '@sanity/dashboard'
import { Box, Button, Card, Flex, Spinner, Stack, Text } from '@sanity/ui'
import { RefreshIcon } from '@sanity/icons'
import { SignJWT, importPKCS8 } from 'jose'
import { type CSSProperties, useCallback, useEffect, useState } from 'react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface GSCTotals {
  clicks: number
  impressions: number
  ctr: number
  position: number
}

interface GSCQueryRow {
  query: string
  clicks: number
  impressions: number
  ctr: number
  position: number
}

interface GSCTrendPoint {
  date: string
  clicks: number
}

interface GSCData {
  period: { startDate: string; endDate: string }
  totals: GSCTotals
  topQueries: GSCQueryRow[]
  clickTrend: GSCTrendPoint[]
}

type FetchState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: GSCData }
  | { status: 'error'; message: string }

// ---------------------------------------------------------------------------
// Config (baked in at Vite build time via SANITY_STUDIO_* env vars)
// ---------------------------------------------------------------------------

const GSC_EMAIL = process.env.SANITY_STUDIO_GSC_SERVICE_ACCOUNT_EMAIL ?? ''
const GSC_PRIVATE_KEY = process.env.SANITY_STUDIO_GSC_PRIVATE_KEY ?? ''
const GSC_SITE_URL = process.env.SANITY_STUDIO_GSC_SITE_URL ?? ''

// ---------------------------------------------------------------------------
// Data fetching
// ---------------------------------------------------------------------------

function getDateRange(): { startDate: string; endDate: string } {
  const end = new Date()
  end.setDate(end.getDate() - 3) // GSC data has a ~2-3 day lag
  const start = new Date(end)
  start.setDate(start.getDate() - 27) // 28-day window
  const fmt = (d: Date) => d.toISOString().slice(0, 10)
  return { startDate: fmt(start), endDate: fmt(end) }
}

async function getAccessToken(): Promise<string> {
  // PEM keys in env vars use literal \n — convert back to real newlines
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
  return access_token
}

interface GSCApiRow {
  keys?: string[]
  clicks?: number
  impressions?: number
  ctr?: number
  position?: number
}

async function fetchGSCData(): Promise<GSCData> {
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
      body: JSON.stringify({ startDate, endDate, dimensions: [] }),
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
  ])) as [{ rows?: GSCApiRow[] }, { rows?: GSCApiRow[] }, { rows?: GSCApiRow[] }]

  const t = totalsBody.rows?.[0]

  return {
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
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card border radius={2} padding={3} flex={1}>
      <Stack space={2}>
        <Text size={1} muted weight="semibold">
          {label}
        </Text>
        <Text size={3} weight="bold">
          {value}
        </Text>
      </Stack>
    </Card>
  )
}

function Sparkline({ points }: { points: GSCTrendPoint[] }) {
  if (points.length < 2) return null

  const W = 480
  const H = 56
  const values = points.map(p => p.clicks)
  const max = Math.max(...values, 1)

  const pathD = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * W
      const y = H - (v / max) * (H - 4)
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')

  return (
    <Box>
      <Text size={1} muted style={{ display: 'block', marginBottom: 6 }}>
        Click trend (28 days)
      </Text>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        height={H}
        aria-hidden="true"
        style={{ display: 'block' }}
      >
        <path
          d={pathD}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Box>
  )
}

function QueryTable({ rows }: { rows: GSCQueryRow[] }) {
  type Col = { label: string; key: keyof GSCQueryRow; align: 'left' | 'right' }

  const cols: Col[] = [
    { label: 'Query', key: 'query', align: 'left' },
    { label: 'Clicks', key: 'clicks', align: 'right' },
    { label: 'Impressions', key: 'impressions', align: 'right' },
    { label: 'CTR', key: 'ctr', align: 'right' },
    { label: 'Pos', key: 'position', align: 'right' },
  ]

  function fmt(key: keyof GSCQueryRow, v: string | number): string {
    if (key === 'ctr') return `${((v as number) * 100).toFixed(1)}%`
    if (key === 'position') return (v as number).toFixed(1)
    if (typeof v === 'number') return v.toLocaleString()
    return v
  }

  const cellStyle = (key: keyof GSCQueryRow): CSSProperties => ({
    padding: '4px 8px',
    borderBottom: '1px solid var(--card-border-color)',
    textAlign: key === 'query' ? 'left' : 'right',
    ...(key === 'query'
      ? { maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }
      : {}),
  })

  return (
    <Box style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {cols.map(c => (
              <th key={c.key} style={cellStyle(c.key)}>
                <Text size={1} muted weight="semibold">
                  {c.label}
                </Text>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.query}>
              {cols.map(c => (
                <td key={c.key} style={cellStyle(c.key)}>
                  <Text size={1}>{fmt(c.key, row[c.key])}</Text>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  )
}

// ---------------------------------------------------------------------------
// Widget
// ---------------------------------------------------------------------------

export function SearchConsoleWidget() {
  const [state, setState] = useState<FetchState>({ status: 'idle' })

  const load = useCallback(() => {
    if (!GSC_EMAIL || !GSC_PRIVATE_KEY || !GSC_SITE_URL) {
      setState({
        status: 'error',
        message:
          'Set SANITY_STUDIO_GSC_SERVICE_ACCOUNT_EMAIL, SANITY_STUDIO_GSC_PRIVATE_KEY and SANITY_STUDIO_GSC_SITE_URL in your studio .env file.',
      })
      return
    }
    setState({ status: 'loading' })
    fetchGSCData()
      .then(data => setState({ status: 'success', data }))
      .catch((err: unknown) =>
        setState({
          status: 'error',
          message: err instanceof Error ? err.message : 'Unknown error',
        }),
      )
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const period =
    state.status === 'success'
      ? ` — ${state.data.period.startDate} to ${state.data.period.endDate}`
      : ''

  return (
    <DashboardWidgetContainer
      header={`Search Console${period}`}
      footer={
        <Flex justify="flex-end" padding={2}>
          <Button
            fontSize={1}
            icon={RefreshIcon}
            mode="ghost"
            onClick={load}
            padding={2}
            text="Refresh"
          />
        </Flex>
      }
    >
      {(state.status === 'idle' || state.status === 'loading') && (
        <Flex align="center" justify="center" padding={6}>
          <Spinner />
        </Flex>
      )}
      {state.status === 'error' && (
        <Box padding={4}>
          <Text size={1} muted>
            {state.message}
          </Text>
        </Box>
      )}
      {state.status === 'success' && (
        <Stack space={4} padding={3}>
          <Flex gap={2}>
            <StatCard label="Clicks" value={state.data.totals.clicks.toLocaleString()} />
            <StatCard
              label="Impressions"
              value={state.data.totals.impressions.toLocaleString()}
            />
            <StatCard
              label="CTR"
              value={`${(state.data.totals.ctr * 100).toFixed(1)}%`}
            />
            <StatCard
              label="Avg Position"
              value={state.data.totals.position.toFixed(1)}
            />
          </Flex>
          <Sparkline points={state.data.clickTrend} />
          <QueryTable rows={state.data.topQueries} />
        </Stack>
      )}
    </DashboardWidgetContainer>
  )
}
