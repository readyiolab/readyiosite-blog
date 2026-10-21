import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "center" | "left";
  as?: "h1" | "h2";
}) {
  const alignCls =
    align === "center" ? "text-center mx-auto" : "text-left";
  const isHero = Tag === "h1";
  return (
    <div className={`${alignCls} max-w-3xl`}>
      {eyebrow && (
        <Reveal eager={isHero}>
          <div
            className={`inline-flex items-center gap-2 rounded-full border border-border bg-accent/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            {eyebrow}
          </div>
        </Reveal>
      )}
      <Reveal eager={isHero} delay={0.05}>
        <Tag className="mt-5 font-heading text-3xl font-bold leading-[1.1] tracking-tight text-foreground md:text-5xl">
          {title}
        </Tag>
      </Reveal>
      {subtitle && (
        <Reveal eager={isHero} delay={0.15}>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
            {subtitle}
          </p>
        </Reveal>
      )}
    </div>
  );
}
