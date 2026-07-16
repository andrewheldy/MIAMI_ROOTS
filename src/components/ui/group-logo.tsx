import Image from "next/image";

import { cn } from "@/lib/cn";
import type { CommunityGroup } from "@/content/groups";

const sizeClasses = {
  md: "h-14 w-14",
  lg: "h-20 w-20",
} as const;

interface GroupLogoProps {
  group: CommunityGroup;
  size?: keyof typeof sizeClasses;
  className?: string;
}

/**
 * Square group avatar with a designed fallback. When a group has an approved
 * logo asset it renders that (with the file's intrinsic dimensions passed to
 * `next/image` so the box never shifts). When it doesn't — three MVP groups have
 * no mark yet — it renders a brand-tinted monogram tile instead of a broken
 * image, per `docs/04-design/asset-implementation-plan.md`.
 *
 * The container is a fixed square either way, so swapping a real logo in later
 * causes no layout change. Server Component.
 */
export function GroupLogo({ group, size = "md", className }: GroupLogoProps) {
  const box = cn(
    "relative shrink-0 overflow-hidden rounded-xl",
    sizeClasses[size],
    className,
  );

  if (group.logo) {
    return (
      <Image
        src={group.logo.src}
        alt={`${group.name} logo`}
        width={group.logo.width}
        height={group.logo.height}
        sizes="80px"
        className={cn(box, "object-cover")}
      />
    );
  }

  // Fallback: brand tile + monogram. Decorative, so hidden from assistive tech —
  // the adjacent group name carries the meaning.
  const monogram = group.name.trim().charAt(0).toUpperCase();
  return (
    <div
      aria-hidden="true"
      className={cn(
        box,
        "bg-mint-100 text-forest flex items-center justify-center font-bold",
        size === "lg" ? "text-3xl" : "text-2xl",
      )}
    >
      {monogram}
    </div>
  );
}
