import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        black: 'var(--color-black)',
        gray: {
          50: 'var(--color-gray-50)',
          100: 'var(--color-gray-100)',
          200: 'var(--color-gray-200)',
        },
        primary: {
          DEFAULT: 'var(--color-primary-500)',
          50: 'var(--color-primary-50)',
          75: 'var(--color-primary-75)',
          100: 'var(--color-primary-100)',
          200: 'var(--color-primary-200)',
          300: 'var(--color-primary-300)',
          400: 'var(--color-primary-400)',
          500: 'var(--color-primary-500)',
          600: 'var(--color-primary-600)',
          700: 'var(--color-primary-700)',
        },
        status: {
          success: 'var(--color-status-success)',
          warning: 'var(--color-status-warning)',
          error: 'var(--color-status-error)',
        },
        accent: {
          orange: 'var(--color-accent-orange)',
          lavender: 'var(--color-accent-lavender)',
          sussie: 'var(--color-accent-sussie)',
          'blue-jeans': 'var(--color-accent-blue-jeans)',
        },
      },
      fontFamily: {
        heading: ['"Labil Grotesk"', 'Inter', 'sans-serif'],
        display: ['"Labil Grotesk"', 'Inter', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Roboto', 'Inter', 'system-ui', 'sans-serif'],
        accent: ['Acworth', 'Inter', 'sans-serif'],
      },
      fontSize: {
        'display-2xl': [
          'clamp(3.5rem, 12vw, 14.1875rem)',
          { lineHeight: '0.9' },
        ],
        'display-xl': ['clamp(3rem, 9vw, 8.75rem)', { lineHeight: '1.1' }],
        'display-lg': ['clamp(2.5rem, 7vw, 5.25rem)', { lineHeight: '1.3' }],
        'heading-1': ['clamp(2.25rem, 5vw, 4rem)', { lineHeight: '1.1' }],
        'heading-2': ['clamp(2rem, 4vw, 3rem)', { lineHeight: '1.2' }],
        'heading-3': ['clamp(1.5rem, 3vw, 2rem)', { lineHeight: '1.3' }],
        'heading-4': ['clamp(1.25rem, 2.5vw, 1.5rem)', { lineHeight: '1.3' }],
        'heading-5': ['clamp(1.125rem, 2vw, 1.25rem)', { lineHeight: '1.4' }],
        'heading-6': [
          'clamp(2.5rem, 4vw, 3rem)',
          { lineHeight: '1.3', letterSpacing: '-0.01em' },
        ],
        'body-xl': ['clamp(1.125rem, 2vw, 1.25rem)', { lineHeight: '1.4' }],
        'body-lg': ['clamp(1rem, 1.75vw, 1.125rem)', { lineHeight: '1.6' }],
        'body-md': [
          'clamp(0.8125rem, 1.2vw, 0.875rem)',
          { lineHeight: '24px' },
        ],
      },
    },
  },
  plugins: [],
}
export default config
