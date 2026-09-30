import sanitizeHtml from "sanitize-html";

const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    ...sanitizeHtml.defaults.allowedTags,
    "img",
    "figure",
    "figcaption",
    "iframe",
    "u",
    "s",
    "del",
    "ins",
    "sub",
    "sup",
    "mark",
  ],
  allowedAttributes: {
    a: ["href", "name", "target", "rel", "title", "aria-label"],
    img: ["src", "alt", "title", "width", "height", "loading", "decoding"],
    iframe: ["src", "title", "width", "height", "allow", "allowfullscreen", "frameborder"],
    th: ["colspan", "rowspan", "scope"],
    td: ["colspan", "rowspan"],
    ol: ["start", "type"],
    "*": ["id"],
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  allowedSchemesByTag: { img: ["https", "http", "data"] },
  allowedIframeHostnames: ["www.youtube.com", "www.youtube-nocookie.com", "player.vimeo.com"],
  transformTags: {
    a: (tagName, attribs) => {
      const href = attribs.href ?? "";
      const external = /^https?:\/\//i.test(href);
      const isContact = /\/contact\/?$/i.test(href);
      const isHome = /(?:readyio\.com\/?$|\/$)/i.test(href);
      const ariaLabel = attribs["aria-label"] || (
        isContact
          ? "Contact Readyio"
          : isHome
          ? "Readyio Home"
          : undefined
      );

      return {
        tagName,
        attribs: {
          ...attribs,
          ...(ariaLabel ? { "aria-label": ariaLabel } : {}),
          ...(external ? { target: "_blank", rel: "noopener noreferrer" } : {}),
        },
      };
    },
    img: (tagName, attribs) => ({
      tagName,
      attribs: { ...attribs, loading: "lazy", decoding: "async" },
    }),
  },
};

export function sanitizeArticleHtml(html: string) {
  let normalized = html;
  const firstH2 = normalized.search(/<h2[\s>]/i);
  const firstH3 = normalized.search(/<h3[\s>]/i);
  // If an h3 appears before any h2 (e.g. <h3>Key Takeaways</h3>), promote it to h2
  // so the document structure follows sequentially descending order (h1 -> h2).
  if (firstH3 !== -1 && (firstH2 === -1 || firstH3 < firstH2)) {
    normalized = normalized.replace(/<h3([\s>])/i, "<h2$1").replace(/<\/h3>/i, "</h2>");
  }
  return sanitizeHtml(normalized, OPTIONS);
}
