import type { MetadataRoute } from "next"

import { BLOG_URL } from "@/lib/site"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: `${BLOG_URL}/sitemap.xml`,
    host: BLOG_URL,
  }
}
