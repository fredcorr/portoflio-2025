import type { Metadata } from 'next'
import { Play } from 'next/font/google'
import './globals.css'
import { ThemeToggle } from '@/components/atoms/ThemeToggle/ThemeToggle'
import { Navigation } from '@/components/organisms'
import getNavigation from '@/utils/get-navigation'

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
  const navigation = await getNavigation()
  const items = navigation?.items ?? []
  const shouldRenderNavigation = items.length > 0

  return (
    <html lang="en">
      <body
        className={`${play.variable} min-h-screen bg-background text-foreground antialiased transition-colors duration-150`}
      >
        {shouldRenderNavigation && (
          <Navigation items={items} projectCount={navigation?.projectCount} />
        )}
        <main
          id="main-content"
          className="min-h-screen w-full xl:mx-auto xl:max-w-8xl"
        >
          {children}
        </main>
        <ThemeToggle />
      </body>
    </html>
  )
}
