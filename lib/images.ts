// Must stay in sync with images.remotePatterns in next.config.ts.
const OPTIMIZED_HOSTS = ["res.cloudinary.com"];
const OPTIMIZED_HOST_SUFFIXES = [".digitaloceanspaces.com"];

export function isOptimizable(src: string) {
  if (src.startsWith("/")) return true;
  try {
    const { hostname } = new URL(src);
    return OPTIMIZED_HOSTS.includes(hostname) || OPTIMIZED_HOST_SUFFIXES.some((suffix) => hostname.endsWith(suffix));
  } catch {
    return false;
  }
}
