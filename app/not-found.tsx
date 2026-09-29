import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Article not found",
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-6 pt-40 pb-24 text-center">
      <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-accent/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
        404
      </div>
      <h1 className="font-heading text-4xl font-bold">Article not found</h1>
      <p className="mt-4 text-sm text-muted-foreground">
        The article you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <Link href="/" className="mt-6 inline-flex items-center gap-2 text-primary">
        <ArrowLeft className="h-4 w-4" /> Back to blog
      </Link>
    </div>
  )
}
