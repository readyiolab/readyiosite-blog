import Image from "next/image";
import Link from "next/link";

export function Logo({
  className = "",
  variant = "full",
}: {
  className?: string;
  variant?: "full" | "icon";
}) {
  if (variant === "icon") {
    return (
      <Link
        href="/"
        className={`inline-flex items-center justify-center ${className}`}
        aria-label="Readyio Home"
      >
        <Image
          src="/logo.webp"
          alt="Readyio"
          width={150}
          height={48}
          loading="eager"
          className="h-11 w-auto object-contain sm:h-12"
        />
      </Link>
    );
  }

  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-2 ${className}`}
      aria-label="Readyio Home"
    >
      <Image
        src="/logo.webp"
        alt="Readyio"
        width={150}
        height={48}
        loading="eager"
        className="h-11 w-auto max-h-12 object-contain transition-transform duration-300 group-hover:scale-105 sm:h-12 sm:max-h-14"
      />
    </Link>
  );
}
