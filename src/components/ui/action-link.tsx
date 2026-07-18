import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

interface ActionLinkProps {
  href: string;
  children: ReactNode;
  /** `primary` = filled brand; `secondary` = outlined. */
  variant?: "primary" | "secondary";
  className?: string;
}

/**
 * A single, consistent call-to-action link. It is always a real navigation
 * target — there are no dead buttons in this gateway. External destinations
 * (WhatsApp, socials) don't exist yet, so honest static states are rendered as
 * plain text elsewhere, not as this link. Server Component.
 */
export function ActionLink({
  href,
  children,
  variant = "primary",
  className,
}: ActionLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center rounded-md px-5 py-2.5 text-sm font-medium transition-colors",
        variant === "primary" &&
          "bg-forest text-background hover:bg-forest-600",
        variant === "secondary" &&
          "border-border text-forest hover:border-forest/40 hover:bg-surface border",
        className,
      )}
    >
      {children}
    </Link>
  );
}
