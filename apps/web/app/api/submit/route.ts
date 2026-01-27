const MAIL_APP_ENDPOINT = process.env.MAIL_APP_ENDPOINT
const RECAPTCHA_VERIFY_ENDPOINT =
  'https://www.google.com/recaptcha/api/siteverify'
const RECAPTCHA_EXPECTED_ACTION = 'contact_form'
const RECAPTCHA_MIN_SCORE = 0.6

const toStringValue = (value: unknown): string => {
  if (typeof value === 'string') return value
  if (typeof value === 'boolean') return value ? 'yes' : 'no'
  if (typeof value === 'number') return String(value)
  if (value == null) return ''
  return JSON.stringify(value)
}

export async function POST(request: Request) {
  let payload: unknown

  try {
    payload = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON payload.' }, { status: 400 })
  }

  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return Response.json({ error: 'Invalid payload.' }, { status: 400 })
  }

  if (!MAIL_APP_ENDPOINT) {
    return Response.json(
      { error: 'Mail endpoint not configured.' },
      { status: 500 }
    )
  }

  const submissionSecret = process.env.SUBMISSION_SECRET
  if (!submissionSecret) {
    return Response.json(
      { error: 'Submission secret not configured.' },
      { status: 500 }
    )
  }

  const formValues = { ...(payload as Record<string, unknown>) }
  const recaptchaToken =
    typeof formValues.recaptchaToken === 'string'
      ? formValues.recaptchaToken.trim()
      : ''
  delete formValues.recaptchaToken

  const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY
  if (!recaptchaSecret) {
    return Response.json(
      { error: 'reCAPTCHA is not configured.' },
      { status: 500 }
    )
  }

  if (!recaptchaToken) {
    return Response.json(
      { error: 'Missing reCAPTCHA token.' },
      { status: 400 }
    )
  }

  const verificationResponse = await fetch(RECAPTCHA_VERIFY_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      secret: recaptchaSecret,
      response: recaptchaToken,
    }).toString(),
  })

  const verificationData = await verificationResponse
    .json()
    .catch(() => null)

  if (!verificationResponse.ok || !verificationData?.success) {
    return Response.json(
      { error: 'reCAPTCHA verification failed.' },
      { status: 400 }
    )
  }

  if (verificationData.action !== RECAPTCHA_EXPECTED_ACTION) {
    return Response.json(
      { error: 'reCAPTCHA action mismatch.' },
      { status: 400 }
    )
  }

  if (
    typeof verificationData.score === 'number' &&
    verificationData.score < RECAPTCHA_MIN_SCORE
  ) {
    return Response.json(
      { error: 'reCAPTCHA score too low.' },
      { status: 400 }
    )
  }

  const normalized: Record<string, string | string[]> = {}
  for (const [key, value] of Object.entries(formValues)) {
    normalized[key] = Array.isArray(value)
      ? value.map(toStringValue)
      : toStringValue(value)
  }

  // TODO: Add optional metadata (page, form id) once available from CMS.

  const upstreamResponse = await fetch(MAIL_APP_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-submit-token': submissionSecret,
    },
    body: JSON.stringify(normalized),
  })

  const contentType = upstreamResponse.headers.get('content-type') ?? ''
  const upstreamBody = contentType.includes('application/json')
    ? await upstreamResponse.json().catch(() => null)
    : await upstreamResponse.text().catch(() => null)

  if (!upstreamResponse.ok) {
    const message =
      typeof upstreamBody === 'string'
        ? upstreamBody
        : upstreamBody?.error || 'Submission failed.'

    return Response.json(
      { error: message },
      { status: upstreamResponse.status }
    )
  }

  return Response.json(
    { ok: true, data: upstreamBody },
    { status: upstreamResponse.status }
  )
}
