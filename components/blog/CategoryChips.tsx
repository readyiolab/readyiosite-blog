import Link from "next/link";
import type { Category } from "@/lib/cms";

export function CategoryChips({ categories, active }: { categories: Category[]; active?: string }) {
  const chips = [
    { href: "/", label: "All", slug: undefined },
    ...categories.map((c) => ({ href: `/category/${c.slug}`, label: c.category_name, slug: c.slug })),
  ];

  return (
    <nav aria-label="Blog categories" className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => {
        const isActive = chip.slug === active;
        return (
          <Link
            key={chip.href}
            href={chip.href}
            aria-current={isActive ? "page" : undefined}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
              isActive
                ? "bg-foreground text-background"
                : "border border-border bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            {chip.label}
          </Link>
        );
      })}
    </nav>
  );
}
