const DEFAULT_CONTACT_EMAIL = 'hello@joey.co'

export const getContactEmail = (): string => {
  const envEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL

  if (typeof envEmail === 'string' && envEmail.trim()) {
    return envEmail.trim()
  }

  return DEFAULT_CONTACT_EMAIL
}

export { DEFAULT_CONTACT_EMAIL }
