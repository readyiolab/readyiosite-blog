import type { Metadata, Viewport } from "next"

import "./globals.css"
import { Footer } from "@/components/site/Footer"
import { GoogleTagManager } from "@/components/site/GoogleTagManager"
import { JsonLd } from "@/components/site/JsonLd"
import { Nav } from "@/components/site/Nav"
import { Toaster } from "@/components/site/Toaster"
import { BLOG_URL, SITE, SITE_URL } from "@/lib/site"
import { DEFAULT_OG_IMAGE, RSS_ALTERNATE } from "@/lib/metadata"

const GTM_ID = "GTM-MGCXVKMP"
const DEFAULT_TITLE = "Zuvigo Blog — Product, AI, CRM & Engineering Insights"

export const metadata: Metadata = {
  metadataBase: new URL(BLOG_URL),
  title: { default: DEFAULT_TITLE, template: "%s | Zuvigo Blog" },
  description: SITE.description,
  applicationName: SITE.blogName,
  authors: [{ name: "Zuvigo", url: SITE_URL }],
  publisher: "Zuvigo",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: { types: RSS_ALTERNATE },
  openGraph: {
    siteName: SITE.blogName,
    type: "website",
    title: DEFAULT_TITLE,
    description: SITE.description,
    url: "/",
    images: [{ ...DEFAULT_OG_IMAGE, type: "image/jpeg", alt: DEFAULT_TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: SITE.description,
    images: [{ url: DEFAULT_OG_IMAGE.url, alt: DEFAULT_TITLE }],
  },
  icons: {
    icon: [{ url: "/favicon.ico", type: "image/x-icon" }],
  },
}

export const viewport: Viewport = {
  themeColor: "#2563EB",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE.name,
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.ico`,
  email: SITE.email,
  sameAs: [SITE.social.linkedin, SITE.social.instagram],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link rel="dns-prefetch" href="https://cms-api.zuvigo.com" />
        <link rel="preconnect" href="https://cms-api.zuvigo.com" />
        <link rel="dns-prefetch" href="https://igrowbig.blr1.digitaloceanspaces.com" />
        <link rel="preconnect" href="https://igrowbig.blr1.digitaloceanspaces.com" crossOrigin="" />
      </head>
      <body>
        <JsonLd data={organizationJsonLd} />
        <div className="relative min-h-dvh bg-background text-foreground antialiased">
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
          >
            Skip to content
          </a>
          <Nav />
          <main id="main">{children}</main>
          <Footer />
          <Toaster />
        </div>
        <GoogleTagManager gtmId={GTM_ID} />
      </body>
    </html>
  )
}
