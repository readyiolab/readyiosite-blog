import type { Metadata } from "next";
import { SITE } from "./site";

export const DEFAULT_OG_IMAGE = { url: "/og-image.jpg", width: 1200, height: 630 };
export const RSS_ALTERNATE = { "application/rss+xml": [{ url: "/feed.xml", title: SITE.blogName }] };

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
};

export function pageMetadata({ title, description, path, noindex }: PageMetadataInput): Metadata {
  const image = { ...DEFAULT_OG_IMAGE, alt: title };
  return {
    title,
    description,
    alternates: { canonical: path, types: RSS_ALTERNATE },
    robots: noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: "website",
      siteName: SITE.blogName,
      title,
      description,
      url: path,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: image.url, alt: image.alt }],
    },
  };
}
