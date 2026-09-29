import { revalidatePath, revalidateTag } from "next/cache"
import type { NextRequest } from "next/server"

import { ARTICLES_TAG } from "@/lib/cms"

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET
  if (!secret || request.headers.get("x-revalidate-secret") !== secret) {
    return Response.json({ revalidated: false, message: "Invalid secret" }, { status: 401 })
  }

  const body = (await request.json().catch(() => ({}))) as { slug?: unknown; oldSlug?: unknown }
  const slugs = [body.slug, body.oldSlug].filter(
    (value): value is string => typeof value === "string" && SLUG_PATTERN.test(value),
  )

  revalidateTag(ARTICLES_TAG, { expire: 0 })
  revalidatePath("/")
  revalidatePath("/category/[slug]", "page")
  revalidatePath("/sitemap.xml")
  revalidatePath("/feed.xml")
  for (const slug of new Set(slugs)) revalidatePath(`/${slug}`)

  return Response.json({ revalidated: true, paths: slugs, now: Date.now() })
}
