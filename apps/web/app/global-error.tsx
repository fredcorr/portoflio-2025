'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-4 py-12 text-center text-neutral-800">
          <h2 className="text-3xl font-semibold sm:text-4xl">
            Something went wrong!
          </h2>
          <button
            onClick={() => reset()}
            className="rounded-md bg-neutral-800 px-4 py-2 text-white hover:bg-neutral-700 transition-colors"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
