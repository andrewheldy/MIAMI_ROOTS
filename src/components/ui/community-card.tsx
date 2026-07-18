import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { GroupLogo } from "@/components/ui/group-logo";
import { categoryLabels, type CommunityGroup } from "@/content/groups";

interface CommunityCardProps {
  group: CommunityGroup;
}

/**
 * Directory card for one community group. The whole card is a single link to the
 * group's detail page — one keyboard tab stop, a clear focus ring, and a hover
 * affordance. Server Component; no client-side state.
 */
export function CommunityCard({ group }: CommunityCardProps) {
  return (
    <Link
      href={`/groups/${group.slug}`}
      className="border-border bg-background hover:border-forest/40 focus-visible:border-forest group flex h-full flex-col rounded-xl border p-5 transition-colors"
    >
      <div className="flex items-center gap-4">
        <GroupLogo group={group} />
        <div className="min-w-0">
          <h3 className="text-forest group-hover:text-forest-600 text-lg font-semibold text-balance">
            {group.name}
          </h3>
          <Badge tone="neutral" className="mt-1">
            {categoryLabels[group.category]}
          </Badge>
        </div>
      </div>
      <p className="text-muted mt-4 text-sm leading-relaxed">
        {group.shortDescription}
      </p>
      <span className="text-forest-600 mt-4 inline-flex items-center gap-1 text-sm font-medium">
        Explore the community
        <span
          aria-hidden="true"
          className="transition-transform group-hover:translate-x-0.5"
        >
          →
        </span>
      </span>
    </Link>
  );
}
