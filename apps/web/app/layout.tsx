import type { Metadata } from 'next'
import { Play } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'
import { ThemeToggle } from '@/components/atoms/ThemeToggle/ThemeToggle'
import { Footer, Navigation } from '@/components/organisms'
import SettingsProvider from '@/context/settings-context'
import getSettings from '@/utils/get-settings'

export const metadata: Metadata = {
  title: 'Portfolio 2025',
  description: 'Portfolio website built with Next.js and Sanity',
}

const play = Play({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-play',
  display: 'swap',
})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { settings, projectCount } = await getSettings()
  const items = settings?.navigationItems ?? []

  return (
    <html lang="en">
      <body
        className={`${play.variable} min-h-screen bg-background text-foreground antialiased transition-colors duration-150`}
        suppressHydrationWarning
      >
        <SettingsProvider initialSettings={settings}>
          <Navigation items={items} projectCount={projectCount} />
          <main
            id="main-content"
            className="mx-auto min-h-screen w-full bg-background pt-20 md:pt-24 xl:mx-auto xl:max-w-8xl"
          >
            {children}
          </main>
          <Footer email={settings?.email} socialLinks={settings?.socialLinks} />
          <ThemeToggle />
          <Analytics />
          <SpeedInsights />
        </SettingsProvider>
      </body>
    </html>
  )
}
