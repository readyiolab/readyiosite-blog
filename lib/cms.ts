// Server-side reads from the Readyio CMS API.

const CMS_API_URL = (process.env.CMS_API_URL || "http://localhost:4000/api").replace(/\/$/, "");

export const ARTICLES_TAG = "articles";
export const REVALIDATE_SECONDS = 300;
export const PAGE_SIZE = 9;

export type Tag = { name: string; slug: string };

export type PostSummary = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image: string | null;
  featured_image_alt: string | null;
  reading_time: number | null;
  is_featured: boolean;
  published_at: string | null;
  updated_at: string | null;
  category_name: string;
  category_slug: string;
  author_name: string;
  author_image: string | null;
  author_title: string | null;
  tags: Tag[];
};

export type FaqItem = { question: string; answer: string };

export type Post = PostSummary & {
  content: string;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  canonical_url: string | null;
  faq_json: unknown;
  schema_type: string | null;
  author_bio: string | null;
  twitter_url: string | null;
  linkedin_url: string | null;
  website_url: string | null;
  related: PostSummary[];
  prev: { title: string; slug: string } | null;
  next: { title: string; slug: string } | null;
};

export type Category = {
  id: number;
  category_name: string;
  slug: string;
  description: string | null;
  article_count: number;
};

export type SlugEntry = {
  slug: string;
  updated_at: string | null;
  published_at: string | null;
  category_slug: string;
};

export type PostPage = {
  posts: PostSummary[];
  page: number;
  totalPages: number;
  total: number;
};

type Envelope<T> = {
  success: boolean;
  data: T;
  movedTo?: string;
  pagination?: { currentPage: number; totalPages: number; totalRecords: number };
};

type CmsResult<T> = { status: number; body: Envelope<T> | null };

async function cmsFetch<T>(path: string): Promise<CmsResult<T>> {
  try {
    const res = await fetch(`${CMS_API_URL}${path}`, {
      next: { revalidate: REVALIDATE_SECONDS, tags: [ARTICLES_TAG] },
    });
    if (!res.ok) {
      if (res.status !== 404) console.error(`[blog] CMS request ${path} failed with ${res.status}`);
      return { status: res.status, body: null };
    }
    return { status: res.status, body: (await res.json()) as Envelope<T> };
  } catch (error) {
    console.error(`[blog] CMS request ${path} failed:`, error instanceof Error ? error.message : error);
    return { status: 0, body: null };
  }
}

export async function getPostPage(page: number, category?: string): Promise<PostPage> {
  const params = new URLSearchParams({ limit: String(PAGE_SIZE), page: String(page) });
  if (category) params.set("category", category);
  const { body } = await cmsFetch<PostSummary[]>(`/articles?${params}`);
  if (!body?.success) return { posts: [], page, totalPages: 0, total: 0 };
  return {
    posts: body.data,
    page,
    totalPages: body.pagination?.totalPages ?? 1,
    total: body.pagination?.totalRecords ?? body.data.length,
  };
}

export async function getLatestPosts(limit: number): Promise<PostSummary[]> {
  const { body } = await cmsFetch<PostSummary[]>(`/articles?limit=${limit}&page=1`);
  return body?.success ? body.data : [];
}

export type PostLookup =
  | { kind: "found"; post: Post }
  | { kind: "moved"; slug: string }
  | { kind: "missing" }
  | { kind: "error" };

export async function getPost(slug: string): Promise<PostLookup> {
  const { status, body } = await cmsFetch<Post>(`/articles/slug/${encodeURIComponent(slug)}`);
  if (status === 404) return { kind: "missing" };
  if (!body?.success) return { kind: "error" };
  if (body.movedTo) return { kind: "moved", slug: body.movedTo };
  return { kind: "found", post: body.data };
}

export async function getCategories(): Promise<Category[]> {
  const { body } = await cmsFetch<Category[]>("/categories");
  return body?.success ? body.data.filter((c) => Number(c.article_count) > 0) : [];
}

export async function getSlugs(): Promise<SlugEntry[]> {
  const { body } = await cmsFetch<SlugEntry[]>("/articles/slugs");
  return body?.success ? body.data : [];
}

export async function getFeaturedPost(): Promise<PostSummary | null> {
  const { body } = await cmsFetch<PostSummary[]>("/articles/featured");
  return body?.success && body.data.length > 0 ? body.data[0] : null;
}

export function parseFaq(value: unknown): FaqItem[] {
  let raw = value;
  if (typeof raw === "string") {
    try {
      raw = JSON.parse(raw);
    } catch {
      return [];
    }
  }
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const record = item as Record<string, unknown>;
    const question = record.question ?? record.q;
    const answer = record.answer ?? record.a;
    return typeof question === "string" && typeof answer === "string" && question && answer
      ? [{ question, answer }]
      : [];
  });
}

export function formatDate(value: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
}
