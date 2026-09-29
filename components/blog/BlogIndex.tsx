import type { ReactNode } from "react";
import { SectionHeading } from "@/components/site/SectionHeading";
import type { Category, PostPage, PostSummary } from "@/lib/cms";
import { CategoryChips } from "./CategoryChips";
import { FeaturedPost } from "./FeaturedPost";
import { Pagination } from "./Pagination";
import { EmptyState, PostGrid } from "./PostGrid";

export function BlogIndex({
  eyebrow,
  title,
  subtitle,
  featured,
  categories,
  activeCategory,
  result,
  basePath,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle: ReactNode;
  featured?: PostSummary | null;
  categories: Category[];
  activeCategory?: string;
  result: PostPage;
  basePath: string;
}) {
  return (
    <>
      <section className="relative overflow-hidden pt-36 pb-12 md:pt-44">
        <div aria-hidden className="absolute inset-0 -z-10 mesh-bg opacity-50" />
        <div className="mx-auto max-w-4xl container-p text-center">
          <SectionHeading eyebrow={eyebrow} as="h1" title={title} subtitle={subtitle} />
        </div>
      </section>

      {featured && <FeaturedPost post={featured} />}

      {categories.length > 0 && (
        <section className="pb-8">
          <div className="mx-auto max-w-7xl container-p">
            <CategoryChips categories={categories} active={activeCategory} />
          </div>
        </section>
      )}

      <section className="pb-28 md:pb-36">
        <div className="mx-auto max-w-7xl container-p">
          {result.posts.length === 0 ? (
            <EmptyState>New articles are on the way. Check back soon.</EmptyState>
          ) : (
            <PostGrid posts={result.posts} />
          )}
          <Pagination basePath={basePath} page={result.page} totalPages={result.totalPages} />
        </div>
      </section>
    </>
  );
}

export function parsePageParam(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  const page = Number.parseInt(raw ?? "1", 10);
  return Number.isFinite(page) && page > 0 ? page : 1;
}
