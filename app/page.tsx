import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { BlogIndex, parsePageParam } from "@/components/blog/BlogIndex"
import { pageHref } from "@/components/blog/Pagination"
import { JsonLd } from "@/components/site/JsonLd"
import { AuroraCTA } from "@/components/site/AuroraCTA"
import { getCategories, getFeaturedPost, getPostPage } from "@/lib/cms"
import { pageMetadata } from "@/lib/metadata"
import { BLOG_URL, SITE, SITE_URL, postUrl } from "@/lib/site"

type Props = { searchParams: Promise<{ page?: string | string[] }> }

const TITLE = "Readyio Blog — Product, AI, CRM & Engineering Insights"

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const page = parsePageParam((await searchParams).page)
  const meta = pageMetadata({
    title: page > 1 ? `Articles — page ${page}` : TITLE,
    description: SITE.description,
    path: pageHref("/", page),
  })
  return page > 1 ? meta : { ...meta, title: { absolute: TITLE } }
}

export default async function BlogHome({ searchParams }: Props) {
  const page = parsePageParam((await searchParams).page)
  const [result, categories, featured] = await Promise.all([
    getPostPage(page),
    getCategories(),
    page === 1 ? getFeaturedPost() : Promise.resolve(null),
  ])

  if (page > 1 && page > result.totalPages) notFound()

  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${BLOG_URL}/#blog`,
    name: SITE.blogName,
    description: SITE.description,
    url: `${BLOG_URL}/`,
    publisher: { "@id": `${SITE_URL}/#organization` },
    blogPost: result.posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: postUrl(p.slug),
      datePublished: p.published_at ?? undefined,
      dateModified: p.updated_at ?? undefined,
      author: { "@type": "Person", name: p.author_name },
      image: p.featured_image ?? undefined,
    })),
  }

  return (
    <>
      <JsonLd data={blogJsonLd} />
      <BlogIndex
        eyebrow="Readyio Journal"
        title={
          <>
            Ideas on <span className="text-gradient">shipping systems</span> that last.
          </>
        }
        subtitle="Field notes from building websites, apps, CRM/ERP and AI systems for founders and operators."
        featured={featured}
        categories={categories}
        result={result}
        basePath="/"
      />
      <AuroraCTA
        id="blog-home-cta"
        eyebrow="READYIO LABS"
        heading={
          <>
            Ready to Turn Ideas <br className="hidden sm:inline" />
            Into Production?
          </>
        }
        subtitle="Turn engineering insights into real products. Partner with Readyio to build high-converting websites, bespoke web applications, and automated workflows."
        buttonText="Discuss Your Project"
        buttonHref="https://readyio.com/contact"
      />
    </>
  )
}
