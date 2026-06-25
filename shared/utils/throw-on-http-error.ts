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
