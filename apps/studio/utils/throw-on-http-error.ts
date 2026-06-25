/**
 * Guard for `fetch()` calls: when the response is not ok, parses a
 * human-readable message from the body and throws. Agnostic of any particular
 * API, so it can guard any async call that must succeed (external publishing,
 * webhooks, etc.).
 *
 *   const res = await fetch(url)
 *   await throwOnHttpError(res, 'Dev.to')
 *
 * @param response The fetch Response to check.
 * @param context  Optional label prefixed to the error message (e.g. the API name).
 */
const parseErrorMessage = async (response: Response): Promise<string> => {
  try {
    const body = await response.json()
    return (
      body?.errors?.error ||
      body?.error ||
      body?.message ||
      `Request failed with status ${response.status}.`
    )
  } catch {
    return `Request failed with status ${response.status}.`
  }
}

export const throwOnHttpError = async (
  response: Response,
  context?: string
): Promise<void> => {
  if (response.ok) return
  const message = await parseErrorMessage(response)
  throw new Error(context ? `${context}: ${message}` : message)
}

export default throwOnHttpError
