import Image from "next/image";
import Link from "next/link";

import { ArrowUpRightIcon } from "@/components/ui/icons";
import { CommunityIcon } from "@/features/groups/community-icon";
import type { CommunityGroup } from "@/features/groups/content";
import { cn } from "@/lib/cn";

interface CommunityCardProps {
  group: CommunityGroup;
  featured?: boolean;
}

export function CommunityCard({ group, featured = false }: CommunityCardProps) {
  return (
    <Link
      href={`/groups/${group.slug}`}
      className={cn(
        "community-card group relative flex min-h-[28rem] overflow-hidden rounded-[2rem] p-6 transition duration-500 hover:-translate-y-1 sm:p-8",
        `community-card--${group.tone}`,
        featured && "md:col-span-2",
      )}
      aria-label={`Explore ${group.name}`}
    >
      <div className="relative z-10 flex w-full flex-col">
        <div className="flex items-start justify-between gap-6">
          <p className="text-forest/65 text-xs font-semibold tracking-[0.18em] uppercase">
            {group.eyebrow}
          </p>
          <span className="border-forest/15 bg-cream/50 text-forest grid h-11 w-11 shrink-0 place-items-center rounded-full border transition duration-300 group-hover:scale-105 group-hover:rotate-6">
            <ArrowUpRightIcon className="h-5 w-5" />
          </span>
        </div>

        <div className="mt-auto pt-12">
          {group.logo ? (
            <div className="mb-7 overflow-hidden rounded-2xl shadow-[0_16px_40px_rgba(0,63,44,0.12)]">
              <Image
                src={group.logo}
                alt={`${group.name} community mark`}
                width={180}
                height={180}
                sizes="180px"
                className="h-28 w-28 object-cover sm:h-32 sm:w-32"
              />
            </div>
          ) : (
            <div className="border-forest/15 bg-cream/40 text-forest mb-7 grid h-28 w-28 place-items-center rounded-2xl border backdrop-blur-sm sm:h-32 sm:w-32">
              <CommunityIcon name={group.icon} className="h-14 w-14" />
            </div>
          )}

          <h3 className="font-display text-forest max-w-xl text-4xl leading-[0.96] font-semibold tracking-[-0.045em] sm:text-5xl">
            {group.name}
          </h3>
          <p className="text-forest/75 mt-5 max-w-xl text-base leading-relaxed sm:text-lg">
            {group.shortDescription}
          </p>
          <div className="community-card__event border-forest/15 mt-7 border-t pt-4">
            <div className="text-forest/60 flex items-center justify-between gap-4 text-[0.68rem] font-semibold tracking-[0.14em] uppercase">
              <span>What&apos;s happening</span>
              <span>{group.eventPreview?.date ?? "Dates soon"}</span>
            </div>
            <div className="community-card__event-detail">
              <p className="text-forest mt-3 text-sm font-semibold">
                {group.eventPreview?.title ?? "No public event listed yet"}
              </p>
              <p className="text-forest/65 mt-1 text-sm leading-relaxed">
                {group.eventPreview?.location ??
                  "Confirmed community plans will appear here—never invented filler."}
              </p>
            </div>
          </div>
        </div>
      </div>
      <CommunityIcon
        name={group.icon}
        className="text-forest/5 absolute -right-12 -bottom-12 h-64 w-64 transition duration-700 group-hover:scale-105 group-hover:-rotate-3"
      />
    </Link>
  );
}
