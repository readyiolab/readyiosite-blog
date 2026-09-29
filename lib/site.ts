export const SITE = {
  name: "Readyio",
  blogName: "Readyio Blog",
  url: "https://readyio.com",
  description:
    "Practical writing from the Readyio team on product, AI, CRM/ERP, and the craft of shipping systems that last.",
  email: "hello@readyio.com",
  bookingUrl: "https://calendly.com/jhanviraywork/30min",
  social: {
    linkedin: "https://linkedin.com/company/zuvigo",
    instagram: "https://www.instagram.com/zuvigofficial?igsh=MWx0NG9rYXI0ajl4cQ==",
  },
};

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || SITE.url).replace(/\/$/, "");
export const BLOG_URL = (process.env.NEXT_PUBLIC_BLOG_URL || "https://blog.readyio.com").replace(/\/$/, "");

export const siteUrl = (path: string) => `${SITE_URL}${path}`;
export const postUrl = (slug: string) => `${BLOG_URL}/${slug}`;
export const categoryUrl = (slug: string) => `${BLOG_URL}/category/${slug}`;

export const NAV_LINKS = [
  { href: siteUrl("/services"), label: "Services" },
  { href: siteUrl("/for-founders"), label: "For Founders" },
  { href: siteUrl("/#work"), label: "Our Work" },
  { href: siteUrl("/#about"), label: "About" },
  { href: "/", label: "Blog", blog: true },
  { href: siteUrl("/contact"), label: "Contact" },
] as const;
