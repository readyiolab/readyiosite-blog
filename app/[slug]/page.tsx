import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound, permanentRedirect } from "next/navigation"
import { ArrowLeft, ArrowRight, Clock } from "lucide-react"

import { AuthorAvatar, AuthorCard } from "@/components/blog/AuthorCard"
import { PostGrid } from "@/components/blog/PostGrid"
import { ShareButtons } from "@/components/blog/ShareButtons"
import { ViewPing } from "@/components/blog/ViewPing"
import { JsonLd } from "@/components/site/JsonLd"
import { SectionHeading } from "@/components/site/SectionHeading"
import { AuroraCTA } from "@/components/site/AuroraCTA"
import { formatDate, getPost, getSlugs, parseFaq, type Post } from "@/lib/cms"
import { isOptimizable } from "@/lib/images"
import { DEFAULT_OG_IMAGE, RSS_ALTERNATE } from "@/lib/metadata"
import { sanitizeArticleHtml } from "@/lib/sanitize"
import { BLOG_URL, SITE, SITE_URL, categoryUrl, postUrl } from "@/lib/site"

export const revalidate = 300

type Props = { params: Promise<{ slug: string }> }

const SCHEMA_TYPES = new Set(["BlogPosting", "Article", "NewsArticle", "TechArticle"])

export async function generateStaticParams() {
  const slugs = await getSlugs()
  return slugs.map(({ slug }) => ({ slug }))
}

async function loadPost(slug: string): Promise<Post> {
  const result = await getPost(slug)
  if (result.kind === "moved") permanentRedirect(`/${result.slug}`)
  if (result.kind === "missing") notFound()
  if (result.kind === "error") throw new Error(`Could not load article "${slug}" from the CMS`)
  return result.post
}

const canonicalFor = (post: Post) => post.canonical_url || postUrl(post.slug)

const toIso = (value: string | null) => (value ? new Date(value).toISOString() : undefined)

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await loadPost((await params).slug)
  const title = post.meta_title || post.title
  const description = post.meta_description || post.excerpt || SITE.description
  const image = post.featured_image
    ? { url: post.featured_image, alt: post.featured_image_alt || post.title }
    : { ...DEFAULT_OG_IMAGE, alt: post.title }

  return {
    title,
    description,
    keywords: post.meta_keywords || post.tags.map((t) => t.name).join(", ") || undefined,
    authors: [{ name: post.author_name }],
    alternates: { canonical: canonicalFor(post), types: RSS_ALTERNATE },
    openGraph: {
      type: "article",
      siteName: SITE.blogName,
      title,
      description,
      url: postUrl(post.slug),
      images: [image],
      publishedTime: toIso(post.published_at),
      modifiedTime: toIso(post.updated_at),
      authors: [post.author_name],
      section: post.category_name,
      tags: post.tags.map((t) => t.name),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: image.url, alt: image.alt }],
    },
  }
}

export default async function ArticlePage({ params }: Props) {
  const post = await loadPost((await params).slug)
  const url = postUrl(post.slug)
  const html = sanitizeArticleHtml(post.content || "")
  const faq = parseFaq(post.faq_json)
  const publishedDate = formatDate(post.published_at)
  const image = post.featured_image || `${BLOG_URL}${DEFAULT_OG_IMAGE.url}`

  const jsonLd: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": SCHEMA_TYPES.has(post.schema_type ?? "") ? post.schema_type : "BlogPosting",
      headline: post.title,
      description: post.meta_description || post.excerpt || undefined,
      image: [image],
      datePublished: toIso(post.published_at),
      dateModified: toIso(post.updated_at) ?? toIso(post.published_at),
      author: {
        "@type": "Person",
        name: post.author_name,
        jobTitle: post.author_title ?? undefined,
        url: post.website_url || post.linkedin_url || post.twitter_url || undefined,
      },
      publisher: {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE.name,
        url: SITE_URL,
        logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.webp` },
      },
      mainEntityOfPage: { "@type": "WebPage", "@id": canonicalFor(post) },
      isPartOf: { "@id": `${BLOG_URL}/#blog` },
      articleSection: post.category_name,
      keywords: post.tags.map((t) => t.name).join(", ") || undefined,
      wordCount: html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Readyio", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${BLOG_URL}/` },
        { "@type": "ListItem", position: 3, name: post.category_name, item: categoryUrl(post.category_slug) },
        { "@type": "ListItem", position: 4, name: post.title, item: url },
      ],
    },
  ]

  if (faq.length > 0) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    })
  }

  return (
    <article>
      <JsonLd data={jsonLd} />
      <ViewPing slug={post.slug} />

      <section className="relative overflow-hidden pt-36 pb-10 md:pt-40">
        <div aria-hidden className="absolute inset-0 -z-10 mesh-bg opacity-40" />
        <div className="mx-auto max-w-3xl container-p">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider">
            <Link href="/" className="inline-flex items-center gap-1.5 text-primary hover:text-primary-hover">
              <ArrowLeft className="h-3.5 w-3.5" /> All articles
            </Link>
          </nav>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            <Link href={`/category/${post.category_slug}`} className="hover:text-primary-hover">
              {post.category_name}
            </Link>
            {post.reading_time ? (
              <>
                <span className="text-muted-foreground">·</span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" /> {post.reading_time} min read
                </span>
              </>
            ) : null}
            {publishedDate && post.published_at && (
              <>
                <span className="text-muted-foreground">·</span>
                <time dateTime={toIso(post.published_at)} className="text-muted-foreground">
                  {publishedDate}
                </time>
              </>
            )}
          </div>
          <h1 className="mt-5 font-heading text-4xl font-bold leading-[1.1] tracking-tight md:text-6xl">{post.title}</h1>
          {post.excerpt && (
            <p className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">{post.excerpt}</p>
          )}
          <div className="mt-8 flex items-center gap-3">
            <AuthorAvatar post={post} size={48} />
            <div className="text-sm">
              <div className="font-semibold text-foreground">{post.author_name}</div>
              {post.author_title && <div className="text-muted-foreground">{post.author_title}</div>}
            </div>
          </div>
        </div>
      </section>

      {post.featured_image && (
        <section className="pb-16">
          <div className="mx-auto max-w-5xl container-p">
            <div className="glass overflow-hidden rounded-3xl p-2 shadow-[var(--shadow-elevated)]">
              <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
                <Image
                  src={post.featured_image}
                  unoptimized={!isOptimizable(post.featured_image)}
                  alt={post.featured_image_alt || post.title}
                  fill
                  preload
                  sizes="(min-width: 1024px) 1024px, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="pb-16">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 container-p lg:grid-cols-[1fr_240px]">
          <div className="mx-auto w-full max-w-3xl">
            <div className="article-body" dangerouslySetInnerHTML={{ __html: html }} />

            {faq.length > 0 && (
              <section aria-labelledby="faq-heading" className="mt-14">
                <h2 id="faq-heading" className="font-heading text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                  Frequently asked questions
                </h2>
                <div className="mt-6 space-y-3">
                  {faq.map((item) => (
                    <details key={item.question} className="group rounded-2xl border border-border bg-card p-5">
                      <summary className="cursor-pointer list-none font-heading text-base font-semibold text-foreground marker:hidden">
                        {item.question}
                      </summary>
                      <p className="mt-3 text-sm leading-relaxed text-foreground/80 md:text-base">{item.answer}</p>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {post.tags.length > 0 && (
              <div className="mt-12 flex flex-wrap gap-2">
                {post.tags.map((t) => (
                  <span
                    key={t.slug}
                    className="rounded-full border border-border bg-accent/60 px-3 py-1 text-xs font-medium text-primary"
                  >
                    #{t.name}
                  </span>
                ))}
              </div>
            )}

            <AuthorCard post={post} />
          </div>

          <aside className="lg:sticky lg:top-32 lg:h-fit">
            <ShareButtons url={url} title={post.title} />
          </aside>
        </div>
      </section>

      {(post.prev || post.next) && (
        <section className="pb-16">
          <nav aria-label="More articles" className="mx-auto grid max-w-5xl grid-cols-1 gap-4 container-p md:grid-cols-2">
            {post.prev ? (
              <Link
                href={`/${post.prev.slug}`}
                rel="prev"
                className="group rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-primary/40"
              >
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <ArrowLeft className="h-3.5 w-3.5" /> Previous
                </div>
                <div className="mt-2 font-heading text-base font-semibold group-hover:text-primary">{post.prev.title}</div>
              </Link>
            ) : (
              <div />
            )}
            {post.next ? (
              <Link
                href={`/${post.next.slug}`}
                rel="next"
                className="group rounded-2xl border border-border bg-card p-6 text-right transition-all hover:-translate-y-0.5 hover:border-primary/40"
              >
                <div className="flex items-center justify-end gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Next <ArrowRight className="h-3.5 w-3.5" />
                </div>
                <div className="mt-2 font-heading text-base font-semibold group-hover:text-primary">{post.next.title}</div>
              </Link>
            ) : (
              <div />
            )}
          </nav>
        </section>
      )}

      {post.related.length > 0 && (
        <section className="border-t border-border bg-accent/30 py-24">
          <div className="mx-auto max-w-7xl container-p">
            <SectionHeading eyebrow="Keep Reading" title="Related articles" />
            <div className="mt-12">
              <PostGrid posts={post.related} />
            </div>
          </div>
        </section>
      )}

      {/* Article CTA matching reference design */}
      <AuroraCTA
        id="article-cta"
        eyebrow="ENGINEERING & PRODUCT PARTNERSHIP"
        heading={
          <>
            Have a Technical Project <br className="hidden sm:inline" />
            Ready to Ship?
          </>
        }
        subtitle="From high-converting web apps to custom internal tooling and autonomous AI agents — partner with our engineering team to ship faster and smarter."
        buttonText="Discuss Your Project"
        buttonHref="https://readyio.com/contact"
      />
    </article>
  )
}
