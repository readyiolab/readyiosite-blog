import { getLatestPosts } from "@/lib/cms"
import { BLOG_URL, SITE, postUrl } from "@/lib/site"

export const revalidate = 300

const FEED_SIZE = 30

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")

const rfc822 = (value: string | null) => (value ? new Date(value).toUTCString() : undefined)

export async function GET() {
  const posts = await getLatestPosts(FEED_SIZE)

  const items = posts
    .map((p) => {
      const url = postUrl(p.slug)
      const pubDate = rfc822(p.published_at)
      return [
        "    <item>",
        `      <title>${escapeXml(p.title)}</title>`,
        `      <link>${escapeXml(url)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(url)}</guid>`,
        p.excerpt ? `      <description>${escapeXml(p.excerpt)}</description>` : "",
        `      <category>${escapeXml(p.category_name)}</category>`,
        `      <dc:creator>${escapeXml(p.author_name)}</dc:creator>`,
        pubDate ? `      <pubDate>${pubDate}</pubDate>` : "",
        p.featured_image ? `      <media:content url="${escapeXml(p.featured_image)}" medium="image" />` : "",
        "    </item>",
      ]
        .filter(Boolean)
        .join("\n")
    })
    .join("\n")

  const lastBuild = rfc822(posts[0]?.updated_at ?? posts[0]?.published_at ?? null) ?? new Date(0).toUTCString()

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${escapeXml(SITE.blogName)}</title>
    <link>${BLOG_URL}/</link>
    <description>${escapeXml(SITE.description)}</description>
    <language>en</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${BLOG_URL}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  })
}
