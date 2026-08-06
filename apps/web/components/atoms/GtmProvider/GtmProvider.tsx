import { GoogleTagManager } from '@next/third-parties/google'
import Script from 'next/script'
import WebVitals from '@/components/atoms/WebVitals/WebVitals'

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID

export default function GtmProvider() {
  if (!GTM_ID) return null

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-before-interactive-script-outside-document */}
      <Script
        id="gtm-consent-default"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('consent','default',{analytics_storage:'denied'})`,
        }}
      />
      <GoogleTagManager gtmId={GTM_ID} />
      <WebVitals />
    </>
  )
}
