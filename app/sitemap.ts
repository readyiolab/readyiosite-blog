import type { MetadataRoute } from "next"

import { getCategories, getSlugs } from "@/lib/cms"
import { BLOG_URL, categoryUrl, postUrl } from "@/lib/site"

export const revalidate = 300

const toDate = (value: string | null) => (value ? new Date(value) : undefined)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [slugs, categories] = await Promise.all([getSlugs(), getCategories()])
  const latest = slugs.map((s) => toDate(s.updated_at ?? s.published_at)).find(Boolean)

  return [
    { url: `${BLOG_URL}/`, lastModified: latest, changeFrequency: "daily", priority: 1 },
    ...categories.map((c) => {
      const newest = slugs.find((s) => s.category_slug === c.slug)
      return {
        url: categoryUrl(c.slug),
        lastModified: newest ? toDate(newest.updated_at ?? newest.published_at) : undefined,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }
    }),
    ...slugs.map((s) => ({
      url: postUrl(s.slug),
      lastModified: toDate(s.updated_at ?? s.published_at),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ]
}
