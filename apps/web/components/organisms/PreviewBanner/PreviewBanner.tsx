import Link from 'next/link'

const PreviewBanner = () => {
  return (
    <div className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-[520px] -translate-x-1/2 rounded-lg border-l-4 border-yellow-500 bg-yellow-100 p-4 text-yellow-700 shadow-lg">
      <p className="font-bold">Draft Mode</p>
      <p>
        You are viewing draft content.{' '}
        <Link
          href="/api/disable-draft"
          className="underline hover:text-yellow-800"
        >
          Exit draft mode
        </Link>
      </p>
    </div>
  )
}

export default PreviewBanner
