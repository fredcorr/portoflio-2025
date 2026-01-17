export const getSiteUrl = () => {
  const envUrl = process.env.SITE_URL
  if (envUrl) {
    return envUrl.replace(/\/$/, '')
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  return 'http://localhost:3000'
}
