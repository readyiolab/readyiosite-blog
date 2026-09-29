import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

export const pageHref = (basePath: string, page: number) => (page <= 1 ? basePath : `${basePath}?page=${page}`);

export function Pagination({
  basePath,
  page,
  totalPages,
}: {
  basePath: string;
  page: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  const pill =
    "grid h-10 min-w-10 place-items-center rounded-full px-3 text-sm font-semibold transition-colors";
  const idle = "border border-border bg-card text-muted-foreground hover:text-foreground";

  return (
    <nav className="mt-12 flex flex-wrap items-center justify-center gap-2" aria-label="Blog pagination">
      {page > 1 && (
        <Link href={pageHref(basePath, page - 1)} rel="prev" aria-label="Previous page" className={`${pill} ${idle}`}>
          <ArrowLeft className="h-4 w-4" />
        </Link>
      )}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
        <Link
          key={n}
          href={pageHref(basePath, n)}
          aria-current={n === page ? "page" : undefined}
          className={`${pill} ${n === page ? "bg-foreground text-background" : idle}`}
        >
          {n}
        </Link>
      ))}
      {page < totalPages && (
        <Link href={pageHref(basePath, page + 1)} rel="next" aria-label="Next page" className={`${pill} ${idle}`}>
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </nav>
  );
}
