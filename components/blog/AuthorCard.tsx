import Image from "next/image";
import { Globe } from "lucide-react";
import { Linkedin, Twitter } from "@/components/site/brand-icons";
import type { Post } from "@/lib/cms";
import { isOptimizable } from "@/lib/images";

const socialLink =
  "grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary";

export function AuthorAvatar({ post, size }: { post: Post; size: number }) {
  if (post.author_image) {
    return (
      <Image
        src={post.author_image}
        unoptimized={!isOptimizable(post.author_image)}
        alt={post.author_name}
        width={size}
        height={size}
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span
      aria-hidden
      className="grid place-items-center rounded-full bg-primary/10 font-heading font-bold text-primary"
      style={{ width: size, height: size }}
    >
      {post.author_name.charAt(0).toUpperCase()}
    </span>
  );
}

export function AuthorCard({ post }: { post: Post }) {
  const links = [
    post.twitter_url && { href: post.twitter_url, label: "X / Twitter", Icon: Twitter },
    post.linkedin_url && { href: post.linkedin_url, label: "LinkedIn", Icon: Linkedin },
    post.website_url && { href: post.website_url, label: "Website", Icon: Globe },
  ].filter(Boolean) as { href: string; label: string; Icon: typeof Globe }[];

  return (
    <section aria-label="About the author" className="mt-12 rounded-3xl border border-border bg-card p-6 md:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <AuthorAvatar post={post} size={64} />
        <div className="flex-1">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Written by</div>
          <div className="mt-1 font-heading text-lg font-bold text-foreground">{post.author_name}</div>
          {post.author_title && <div className="text-sm text-muted-foreground">{post.author_title}</div>}
          {post.author_bio && (
            <p className="mt-3 text-sm leading-relaxed text-foreground/80">{post.author_bio}</p>
          )}
          {links.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {links.map(({ href, label, Icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer author"
                  aria-label={`${post.author_name} on ${label}`}
                  className={socialLink}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
