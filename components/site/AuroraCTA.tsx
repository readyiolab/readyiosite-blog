"use client";

import React from "react";
import Link from "next/link";
import { Reveal } from "@/components/site/Reveal";

export interface AuroraCTAProps {
  /**
   * Main heading. Can be string or JSX (e.g. with line breaks)
   */
  heading: React.ReactNode;
  /**
   * Descriptive subtext below the heading
   */
  subtitle: string;
  /**
   * Primary button label
   */
  buttonText: string;
  /**
   * Primary button link / URL
   */
  buttonHref: string;
  /**
   * Whether link is external (opens in new tab)
   */
  isExternal?: boolean;
  /**
   * Optional small badge / eyebrow tag above heading
   */
  eyebrow?: string;
  /**
   * Optional section id for anchoring
   */
  id?: string;
  /**
   * Optional container className
   */
  className?: string;
}

export function AuroraCTA({
  heading,
  subtitle,
  buttonText,
  buttonHref,
  isExternal,
  eyebrow,
  id,
  className = "",
}: AuroraCTAProps) {
  const isExt = isExternal ?? (buttonHref.startsWith("http") || buttonHref.startsWith("mailto:"));

  return (
    <section id={id} className={`py-16 md:py-24 ${className}`}>
      <div className="mx-auto max-w-7xl container-p">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] bg-[#0A0C10] p-8 sm:p-12 md:p-16 lg:p-20 text-white shadow-2xl border border-white/10">
            {/* Ambient Aurora Gradient Background matching the reference */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
            >
              {/* Solid dark base */}
              <div className="absolute inset-0 bg-[#0A0C10]" />

              {/* Top-Right Emerald / Forest Green Glow */}
              <div
                className="absolute -top-24 -right-10 h-[420px] w-[460px] sm:h-[500px] sm:w-[560px] rounded-full opacity-75 blur-[85px] sm:blur-[105px]"
                style={{
                  background:
                    "radial-gradient(circle, rgba(34, 197, 94, 0.8) 0%, rgba(21, 128, 61, 0.5) 45%, transparent 70%)",
                }}
              />

              {/* Bottom-Right Radiant Magenta / Hot Pink Glow */}
              <div
                className="absolute -bottom-24 right-2 sm:right-12 h-[440px] w-[480px] sm:h-[540px] sm:w-[600px] rounded-full opacity-85 blur-[95px] sm:blur-[115px]"
                style={{
                  background:
                    "radial-gradient(circle, rgba(236, 72, 153, 0.85) 0%, rgba(217, 70, 239, 0.6) 40%, rgba(147, 51, 234, 0.35) 65%, transparent 80%)",
                }}
              />

              {/* Center-Right Subtle Violet Bridge Glow */}
              <div
                className="absolute top-1/2 right-1/4 -translate-y-1/2 h-[340px] w-[380px] rounded-full opacity-55 blur-[90px]"
                style={{
                  background:
                    "radial-gradient(circle, rgba(168, 85, 247, 0.55) 0%, rgba(126, 34, 206, 0.3) 50%, transparent 75%)",
                }}
              />

              {/* Left Vignette to maintain pristine pitch dark backdrop for maximum typography contrast */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to right, #0A0C10 0%, #0A0C10 38%, rgba(10, 12, 16, 0.82) 58%, transparent 100%)",
                }}
              />
            </div>

            {/* Left Content Area */}
            <div className="relative z-10 max-w-2xl">
              {eyebrow && (
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-pink-200 backdrop-blur-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {eyebrow}
                </div>
              )}

              <h2 className="font-heading text-3xl font-extrabold leading-[1.12] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-[3.25rem]">
                {heading}
              </h2>

              <p className="mt-4 sm:mt-5 max-w-xl text-sm leading-relaxed text-gray-300 sm:text-base md:text-lg font-normal">
                {subtitle}
              </p>

              <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-4">
                {isExt ? (
                  <a
                    href={buttonHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full bg-white px-7 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base font-bold text-gray-950 shadow-xl shadow-black/30 transition-all duration-300 hover:bg-gray-100 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span>{buttonText}</span>
                  </a>
                ) : (
                  <Link
                    href={buttonHref}
                    className="inline-flex items-center justify-center rounded-full bg-white px-7 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base font-bold text-gray-950 shadow-xl shadow-black/30 transition-all duration-300 hover:bg-gray-100 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span>{buttonText}</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
