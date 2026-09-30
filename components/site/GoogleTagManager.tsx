"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function GoogleTagManager({ gtmId }: { gtmId: string }) {
  useEffect(() => {
    // 1. Initialize dataLayer non-blockingly
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });

    let loaded = false;
    const loadGtm = () => {
      if (loaded || document.getElementById("gtm-script")) return;
      loaded = true;
      const script = document.createElement("script");
      script.id = "gtm-script";
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;
      document.head.appendChild(script);
    };

    // 2. Load on user interaction (scroll, click, touch, keydown)
    const events = ["scroll", "pointerdown", "keydown", "touchstart"];
    const trigger = () => {
      loadGtm();
      events.forEach((e) => window.removeEventListener(e, trigger));
    };

    events.forEach((e) => window.addEventListener(e, trigger, { once: true, passive: true }));

    // 3. Fallback: load after browser becomes idle (or 3.5s timeout)
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const handle = (window as unknown as { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback(loadGtm, {
        timeout: 3500,
      });
      return () => {
        events.forEach((e) => window.removeEventListener(e, trigger));
        (window as unknown as { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(handle);
      };
    } else {
      const timer = setTimeout(loadGtm, 3000);
      return () => {
        events.forEach((e) => window.removeEventListener(e, trigger));
        clearTimeout(timer);
      };
    }
  }, [gtmId]);

  return null;
}
