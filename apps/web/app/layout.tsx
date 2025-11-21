import type { Metadata } from 'next'
import './globals.css'
import { ThemeToggle } from '@/components/atoms/ThemeToggle/ThemeToggle'

export const metadata: Metadata = {
  title: 'Portfolio 2025',
  description: 'Portfolio website built with Next.js and Sanity',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased transition-colors duration-150">
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
