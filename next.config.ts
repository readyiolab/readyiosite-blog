import type { NextConfig } from "next"

const isDev = process.env.NODE_ENV !== "production"

const contentSecurityPolicy = [
  "default-src 'self' https: data: blob: 'unsafe-inline' 'unsafe-eval'",
  `connect-src 'self' https: wss:${isDev ? " http://localhost:* ws://localhost:*" : ""}`,
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  `img-src 'self' data: https: blob:${isDev ? " http://localhost:*" : ""}`,
  "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://player.vimeo.com https://www.googletagmanager.com",
].join("; ")

const nextConfig: NextConfig = {
  images: {
    qualities: [75],
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "**.digitaloceanspaces.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
        ],
      },
    ]
  },
}

export default nextConfig
