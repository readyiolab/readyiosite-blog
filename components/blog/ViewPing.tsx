"use client";

import { useEffect } from "react";

const CMS_PUBLIC_URL = (process.env.NEXT_PUBLIC_CMS_API_URL || "https://api.readyio.com/api").replace(/\/$/, "");

export function ViewPing({ slug }: { slug: string }) {
  useEffect(() => {
    fetch(`${CMS_PUBLIC_URL}/articles/slug/${encodeURIComponent(slug)}/view`, {
      method: "POST",
      keepalive: true,
    }).catch(() => {});
  }, [slug]);

  return null;
}
