import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { BlogIndex, parsePageParam } from "@/components/blog/BlogIndex"
import { pageHref } from "@/components/blog/Pagination"
import { JsonLd } from "@/components/site/JsonLd"
import { PAGE_SIZE, getCategories, getPostPage } from "@/lib/cms"
import { pageMetadata } from "@/lib/metadata"
import { BLOG_URL, SITE, SITE_URL, categoryUrl, postUrl } from "@/lib/site"

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string | string[] }>
}

async function findCategory(slug: string) {
  const categories = await getCategories()
  return { categories, category: categories.find((c) => c.slug === slug) }
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const [{ slug }, { page: pageParam }] = await Promise.all([params, searchParams])
  const { category } = await findCategory(slug)
  if (!category) return { title: "Category not found", robots: { index: false, follow: true } }

  const page = parsePageParam(pageParam)
  const name = category.category_name
  return pageMetadata({
    title: page > 1 ? `${name} articles — page ${page}` : `${name} articles`,
    description:
      category.description ||
      `Readyio articles on ${name.toLowerCase()}: practical notes on building websites, apps, CRM/ERP and AI systems.`,
    path: pageHref(`/category/${slug}`, page),
  })
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const [{ slug }, { page: pageParam }] = await Promise.all([params, searchParams])
  const page = parsePageParam(pageParam)
  const [{ categories, category }, result] = await Promise.all([findCategory(slug), getPostPage(page, slug)])

  if (!category) notFound()
  if (page > 1 && page > result.totalPages) notFound()

  const url = categoryUrl(slug)
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: `${category.category_name} — ${SITE.blogName}`,
      url,
      isPartOf: { "@id": `${BLOG_URL}/#blog` },
      mainEntity: {
        "@type": "ItemList",
        itemListElement: result.posts.map((p, i) => ({
          "@type": "ListItem",
          position: (page - 1) * PAGE_SIZE + i + 1,
          url: postUrl(p.slug),
          name: p.title,
        })),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Readyio", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${BLOG_URL}/` },
        { "@type": "ListItem", position: 3, name: category.category_name, item: url },
      ],
    },
  ]

  return (
    <>
      <JsonLd data={jsonLd} />
      <BlogIndex
        eyebrow="Category"
        title={<span className="text-gradient">{category.category_name}</span>}
        subtitle={
          category.description ||
          `${result.total} article${result.total === 1 ? "" : "s"} on ${category.category_name.toLowerCase()} from the Readyio team.`
        }
        categories={categories}
        activeCategory={slug}
        result={result}
        basePath={`/category/${slug}`}
      />
    </>
  )
}
