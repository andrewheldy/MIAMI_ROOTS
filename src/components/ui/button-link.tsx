import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: "solid" | "outline" | "light";
}

export function ButtonLink({
  href,
  children,
  className,
  variant = "solid",
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex min-h-12 items-center justify-center gap-3 rounded-full px-6 text-sm font-semibold transition duration-300 focus-visible:outline-offset-4",
        variant === "solid" &&
          "bg-forest text-cream hover:bg-forest-600 hover:-translate-y-0.5",
        variant === "outline" &&
          "border-forest/20 text-forest hover:bg-forest hover:text-cream border hover:-translate-y-0.5",
        variant === "light" &&
          "bg-cream text-forest hover:-translate-y-0.5 hover:bg-white",
        className,
      )}
    >
      {children}
    </Link>
  );
}
