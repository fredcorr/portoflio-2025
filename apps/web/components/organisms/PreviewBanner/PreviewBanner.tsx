import Link from 'next/link'

const PreviewBanner = () => {
  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
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
