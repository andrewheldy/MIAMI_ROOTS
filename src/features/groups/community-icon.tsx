import type { CommunityIcon as CommunityIconName } from "@/features/groups/content";

interface CommunityIconProps {
  name: CommunityIconName;
  className?: string;
}

export function CommunityIcon({ name, className }: CommunityIconProps) {
  const common = {
    className,
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.45,
    viewBox: "0 0 48 48",
    "aria-hidden": true,
  };

  if (name === "chat") {
    return (
      <svg {...common}>
        <path d="M8 10.5h32v23H23l-9 6v-6H8z" />
        <path d="M15 18h18M15 25h12" />
      </svg>
    );
  }

  if (name === "connections") {
    return (
      <svg {...common}>
        <circle cx="12" cy="13" r="4" />
        <circle cx="36" cy="13" r="4" />
        <circle cx="24" cy="34" r="4" />
        <path d="m15.5 15 6 15m11-15-6 15M16 13h16" />
      </svg>
    );
  }

  if (name === "nightlife") {
    return (
      <svg {...common}>
        <path d="M10 11h28L26 25v11h8M14 36h20M14 15h20" />
        <path d="m29 8-6 13" />
      </svg>
    );
  }

  if (name === "daytime") {
    return (
      <svg {...common}>
        <path d="M8 30h32M12 30a12 12 0 0 1 24 0" />
        <path d="M24 7v5M9 14l4 4M39 14l-4 4M4 26h5M39 26h5" />
      </svg>
    );
  }

  if (name === "organizing") {
    return (
      <svg {...common}>
        <path d="M8 25c5-5 10-5 15 0s10 5 17 0" />
        <path d="M8 17c5-5 10-5 15 0s10 5 17 0" />
        <path d="M16 33c4-4 8-4 12 0s7 4 12 0" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M17 8h14l2 6v23H15V14z" />
      <path d="M17 14h14M15 31h18" />
      <circle cx="24" cy="22" r="4" />
    </svg>
  );
}
