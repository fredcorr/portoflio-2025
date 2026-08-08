import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const size = {
  width: 1200,
  height: 630,
}

const SITE_NAME = 'Federico Corradi'
const TITLE_MAX_LENGTH = 120

/**
 * Satori renders inline styles only — it cannot resolve Tailwind classes or the
 * CSS custom properties in `globals.css`, so the usual "tokens, never raw
 * values" rule cannot apply here. These mirror the `.dark` token values and
 * must be updated alongside them.
 */
const CARD_COLORS = {
  /** --color-background */
  background: '#000000',
  /** --color-foreground */
  foreground: '#f5f5f5',
  /** --color-primary-500 */
  muted: '#bcbce0',
} as const

/**
 * Fallback social card, used only when a page has no `seoImage` and no hero
 * image. `generateMetadata` decides when to point at this route — the
 * `opengraph-image` file convention is deliberately not used, because
 * file-based metadata overrides `generateMetadata` and would replace the
 * editor-chosen image on every page.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const rawTitle = searchParams.get('title')?.trim()
  const title = rawTitle ? rawTitle.slice(0, TITLE_MAX_LENGTH) : SITE_NAME

  // process.cwd() is the Next.js project directory (apps/web). These are the
  // same files next/font/local uses for the site, so the card matches it.
  const [playRegular, playBold] = await Promise.all([
    readFile(join(process.cwd(), 'assets/fonts/Play-Regular.ttf')),
    readFile(join(process.cwd(), 'assets/fonts/Play-Bold.ttf')),
  ])

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: CARD_COLORS.background,
        color: CARD_COLORS.foreground,
        fontFamily: 'Play',
        padding: '80px',
      }}
    >
      <div
        style={{
          display: 'flex',
          fontSize: 28,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: CARD_COLORS.muted,
        }}
      >
        {SITE_NAME}
      </div>

      <div
        style={{
          display: 'flex',
          fontSize: title.length > 60 ? 68 : 88,
          fontWeight: 700,
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
        }}
      >
        {title}
      </div>

      <div
        style={{
          display: 'flex',
          height: '8px',
          width: '160px',
          backgroundColor: CARD_COLORS.foreground,
        }}
      />
    </div>,
    {
      ...size,
      fonts: [
        {
          name: 'Play',
          data: playRegular,
          style: 'normal',
          weight: 400,
        },
        {
          name: 'Play',
          data: playBold,
          style: 'normal',
          weight: 700,
        },
      ],
    }
  )
}
