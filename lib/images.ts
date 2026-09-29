// Must stay in sync with images.remotePatterns in next.config.ts.
const OPTIMIZED_HOSTS = ["res.cloudinary.com"];

export function isOptimizable(src: string) {
  if (src.startsWith("/")) return true;
  try {
    return OPTIMIZED_HOSTS.includes(new URL(src).hostname);
  } catch {
    return false;
  }
}
