import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, Tag } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import type { PostSummary } from "@/lib/cms";
import { isOptimizable } from "@/lib/images";
import { DEFAULT_OG_IMAGE } from "@/lib/metadata";

export function FeaturedPost({ post }: { post: PostSummary }) {
  return (
    <section className="pb-16">
      <div className="mx-auto max-w-7xl container-p">
        <Reveal>
          <Link
            href={`/${post.slug}`}
            className="group relative grid overflow-hidden rounded-3xl border border-border bg-card md:grid-cols-2"
          >
            <div className="relative aspect-[16/10] overflow-hidden md:aspect-auto md:min-h-[360px]">
              <Image
                src={post.featured_image || DEFAULT_OG_IMAGE.url}
                unoptimized={!isOptimizable(post.featured_image || DEFAULT_OG_IMAGE.url)}
                alt={post.featured_image_alt || post.title}
                fill
                preload
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary-foreground">
                Featured
              </div>
            </div>
            <div className="flex flex-col justify-center p-8 md:p-12">
              <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                <Tag className="h-3.5 w-3.5" /> {post.category_name}
                {post.reading_time ? (
                  <>
                    <span className="text-muted-foreground">·</span>
                    <Clock className="h-3.5 w-3.5" /> {post.reading_time} min
                  </>
                ) : null}
              </div>
              <h2 className="mt-4 font-heading text-2xl font-bold leading-tight tracking-tight md:text-4xl">
                {post.title}
              </h2>
              {post.excerpt && (
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">{post.excerpt}</p>
              )}
              <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary">
                Read article <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
