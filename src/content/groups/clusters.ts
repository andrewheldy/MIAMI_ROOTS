import type { RoomCluster } from "./types";

/**
 * How the seven rooms are grouped when the site explains them.
 *
 * This is an editorial device, not a WhatsApp construct and not a second
 * taxonomy: `category` still labels an individual group, while a cluster
 * answers "which part of your life is this for?" for someone reading the list
 * cold. Seven undifferentiated rows read as a directory; three named clusters
 * read as a map, which is the point (owner direction 2026-08-16: help people
 * find their people).
 *
 * Every published group must appear in exactly one cluster. `tests/unit/
 * groups.test.ts` enforces that, so adding a group without placing it is a
 * failing test rather than a room quietly missing from the site.
 */
export const roomClusters: readonly RoomCluster[] = [
  {
    id: "start",
    title: "Where everybody lands",
    blurb:
      "If you only ever open one room, open this one. It is the room the whole community shares.",
    slugs: ["general-chat"],
  },
  {
    id: "plans",
    title: "Rooms for your week",
    blurb:
      "Mornings that get you outside, nights worth going to, the ticket you need by 8pm, and a full social life without a drink in your hand.",
    slugs: [
      "daytime-events",
      "nightlife-and-event-marketing",
      "ticket-exchange",
      "sober-social",
    ],
  },
  {
    id: "build",
    title: "Rooms for what you are building",
    blurb:
      "For the people making things happen, whether that is a business or a Saturday morning cleanup.",
    slugs: ["business-and-connections", "community-organizing"],
  },
];
