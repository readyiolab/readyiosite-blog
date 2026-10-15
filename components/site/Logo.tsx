import Link from "next/link";

export function Logo({
  className = "",
  variant = "full",
}: {
  className?: string;
  variant?: "full" | "icon";
}) {
  return (
    <Link
      href="https://zuvigo.com"
      className={`group inline-flex items-center gap-2 font-bold tracking-tight text-xl sm:text-2xl text-foreground transition-opacity hover:opacity-90 ${className}`}
      aria-label="Zuvigo Home"
    >
      <span className="font-heading font-extrabold tracking-tight text-[#111827] dark:text-white">
        zuvigo
      </span>
      <span className="rounded-md bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-blue-600 dark:text-blue-400 uppercase">
        Blog
      </span>
    </Link>
  );
}
