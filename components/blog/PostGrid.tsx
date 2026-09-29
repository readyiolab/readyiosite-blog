import { StaggerGroup, StaggerItem } from "@/components/site/Reveal";
import type { PostSummary } from "@/lib/cms";
import { PostCard } from "./PostCard";

export function PostGrid({ posts }: { posts: PostSummary[] }) {
  return (
    <StaggerGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <StaggerItem key={post.slug} as="article">
          <PostCard post={post} />
        </StaggerItem>
      ))}
    </StaggerGroup>
  );
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-12 text-center text-muted-foreground">{children}</div>
  );
}
