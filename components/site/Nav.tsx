"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { NAV_LINKS, SITE } from "@/lib/site";
import { Logo } from "./Logo";

type NavLink = (typeof NAV_LINKS)[number];

function NavAnchor({
  link,
  className,
  onClick,
  children,
}: {
  link: NavLink;
  className: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  if ("blog" in link) {
    return (
      <Link href={link.href} className={className} onClick={onClick}>
        {children}
      </Link>
    );
  }
  return (
    <a href={link.href} className={className} onClick={onClick}>
      {children}
    </a>
  );
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-border/60 bg-background/80 backdrop-blur-md py-3 shadow-xs"
            : "bg-transparent py-5"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between container-p">
          <Logo />

          <div className="flex items-center gap-8">
            <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
              {NAV_LINKS.map((l) => {
                const active = "blog" in l;
                return (
                  <NavAnchor
                    key={l.href}
                    link={l}
                    className={`relative px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                      active ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {l.label}
                    {active && <span className="absolute inset-x-3 bottom-1 h-0.5 rounded-full bg-primary" />}
                  </NavAnchor>
                );
              })}
            </nav>
            <div className="flex items-center gap-2">
              <a
                href={SITE.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Discuss Your Project via Calendly"
                className="group hidden items-center gap-1.5 rounded-full bg-[#111827] px-5 py-2.5 text-xs font-semibold text-white transition-all hover:bg-[#6C5CE7] md:inline-flex"
              >
                Discuss Your Project
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </a>
              <button
                type="button"
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
                className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card text-foreground md:hidden"
              >
                {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
            />
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-background shadow-2xl md:hidden"
            >
              <div className="flex items-center justify-between border-b border-border p-5">
                <Logo />
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                  className="grid h-10 w-10 place-items-center rounded-full border border-border text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto p-6" aria-label="Mobile navigation">
                <div className="flex flex-col gap-2">
                  {NAV_LINKS.map((l, i) => {
                    const active = "blog" in l;
                    return (
                      <motion.div
                        key={l.href}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0, transition: { delay: 0.1 + i * 0.05, duration: 0.3 } }}
                      >
                        <NavAnchor
                          link={l}
                          onClick={() => setOpen(false)}
                          className={`flex items-center justify-between rounded-2xl px-5 py-4 text-base font-semibold transition-colors ${
                            active ? "bg-primary/10 text-primary font-bold" : "text-foreground hover:bg-accent"
                          }`}
                        >
                          {l.label}
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </NavAnchor>
                      </motion.div>
                    );
                  })}
                </div>
              </nav>

              <motion.div
                className="relative border-t border-border p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.4, duration: 0.4 } }}
              >
                <a
                  href={SITE.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Discuss Your Project via Calendly"
                  className="group flex items-center justify-center gap-2 rounded-full bg-[#111827] px-6 py-4 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#6C5CE7]"
                >
                  Discuss Your Project
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
                <p className="mt-4 text-center text-xs text-muted-foreground">
                  Free initial consultation · Response within one business day
                </p>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
