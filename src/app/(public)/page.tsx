import type { Metadata } from "next";

import { HomePage } from "@/features/home/home-page";

export const metadata: Metadata = {
  title: "Find your people",
  description:
    "Find community, build genuine friendships, and make Miami feel like home with Miami Roots.",
};

export default function Page() {
  return <HomePage />;
}
