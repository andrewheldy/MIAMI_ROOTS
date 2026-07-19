import type { CommunityGroup } from "./types";

/**
 * The seven community groups, in display order.
 *
 * Provenance & rules (see `docs/00-context/community-groups.md`):
 *   - The original six were the MVP set. Ticket Exchange was later approved as a
 *     first-class seventh community (decision log 2026-07-19), superseding its
 *     earlier out-of-scope status; it sits in the event cluster (after Nightlife)
 *     and carries a concise peer-to-peer safety treatment (`safety`).
 *   - Three groups (General Chat, Business & Connections, Community Organizing)
 *     have no dedicated logo asset yet → `logo: null` → parent-mark fallback.
 *   - Two logos display a wordmark ("Daytime Roots", "Nightlife Roots") that
 *     differs from the group's operating name (open question #10). Those names
 *     are marked `displayNameProvisional` until the owner reconciles them.
 *
 * Copy status: PROVISIONAL. It is grounded in the documented group purposes and
 * the voice guide (`docs/04-design/content-and-voice.md`), but has not had an
 * owner voice pass. It contains no private community information.
 */
export const communityGroups: readonly CommunityGroup[] = [
  {
    slug: "general-chat",
    name: "General Chat",
    shortDescription:
      "The community's front porch: everyday conversation, quick questions, and the updates that keep Miami Roots connected.",
    fullDescription:
      "General Chat is where the whole community comes together — the central room for everyday conversation, quick questions, and the small updates that keep everyone in the loop. If you're new, this is the easiest place to say hello and get a feel for how Miami Roots works.",
    category: "everyday",
    status: "active",
    logo: null,
    access: "managed-by-admins",
    order: 1,
    belongs: [
      "Introductions and hellos, especially if you're new",
      "Everyday conversation and quick questions",
      "Community news and general updates",
      "Pointing people toward the more specific groups when it fits",
    ],
    doesNotBelong: [
      "Spam, cold pitches, or mass-DMing members",
      "Repeated self-promotion better suited to Business & Connections",
    ],
    etiquette: [
      "Be a real participant, not just a lurker looking to extract value",
      "Welcome newcomers in — the community grows by opening the door",
    ],
    related: ["business-and-connections", "community-organizing"],
    metadata: {
      title: "General Chat",
      description:
        "The central Miami Roots group for everyday conversation, quick questions, and community updates.",
    },
  },
  {
    slug: "business-and-connections",
    name: "Business & Connections",
    shortDescription:
      "Share what you're building, find collaborators, and trade real opportunities — the network working for the people in it.",
    fullDescription:
      "Business & Connections is for the builders: share your projects and businesses, find collaborators, and pass along opportunities so members grow together. The goal is genuine help between people, not transactional networking — real relationships tend to be the ones that actually move things forward.",
    category: "business",
    status: "active",
    logo: null,
    access: "managed-by-admins",
    order: 2,
    belongs: [
      "Projects and businesses you're working on",
      "Requests for collaborators, skills, or introductions",
      "Opportunities, leads, and useful local resources",
    ],
    doesNotBelong: [
      "Cold pitching, spam, or mass-DMing members",
      "Multi-level marketing recruitment",
      "Treating other members as leads rather than people",
    ],
    etiquette: [
      "Give before you take — contribute opportunities, don't only collect them",
      "Help other members grow rather than treating them as competition",
    ],
    related: ["general-chat", "nightlife-and-event-marketing"],
    metadata: {
      title: "Business & Connections",
      description:
        "Share projects, find collaborators, and trade real opportunities with the Miami Roots community.",
    },
  },
  {
    slug: "daytime-events",
    name: "Daytime Events",
    displayNameProvisional: true,
    shortDescription:
      "Yoga, run clubs, Pilates, and outdoor mornings — daytime ways to move, meet people, and recharge across the city.",
    fullDescription:
      "Daytime Events is the wellness side of Miami Roots: yoga, run clubs, Pilates, beach mornings, and other outdoor activities that help members recharge, meet people, and restore a little balance. It's an easy, low-pressure way to build real friendships while doing something good for yourself.",
    category: "wellness",
    status: "active",
    logo: {
      src: "/group-logos/daytime-events-logo.png",
      width: 1024,
      height: 1024,
      wordmark: "Daytime Roots",
    },
    access: "managed-by-admins",
    order: 3,
    belongs: [
      "Wellness and movement meetups — yoga, run clubs, Pilates, and similar",
      "Outdoor and daytime activities around Miami",
      "Plans that help members recharge and connect",
    ],
    doesNotBelong: [
      "Nightlife promotion (that lives in Nightlife & Event Marketing)",
      "Spam or unrelated self-promotion",
    ],
    etiquette: [
      "Keep plans welcoming to newcomers and all fitness levels",
      "Show up when you say you will — small commitments build trust",
    ],
    related: ["sober-social", "community-organizing"],
    metadata: {
      title: "Daytime Events",
      description:
        "Wellness-oriented daytime meetups — yoga, run clubs, Pilates, and outdoor activities with the Miami Roots community.",
    },
  },
  {
    slug: "nightlife-and-event-marketing",
    name: "Nightlife & Event Marketing",
    displayNameProvisional: true,
    shortDescription:
      "For promoters and organizers: flyers, guest lists, and event collaborations. Built for promotion, not ticket resale.",
    fullDescription:
      "Nightlife & Event Marketing is where promoters and event organizers share flyers, guest lists, and nightlife happenings, and find people to collaborate with. It's built for promotion and partnerships — one clear rule keeps it useful: no ticket reselling here.",
    category: "nightlife",
    status: "active",
    logo: {
      src: "/group-logos/nightlife-and-event-marketing-logo.png",
      width: 1024,
      height: 1024,
      wordmark: "Nightlife Roots",
    },
    access: "managed-by-admins",
    order: 4,
    belongs: [
      "Flyers, guest lists, and event announcements",
      "Nightlife happenings and promoter collaborations",
      "Partnership and cross-promotion opportunities",
    ],
    doesNotBelong: [
      "Ticket reselling — it is not allowed in this group",
      "Spam or unrelated promotion",
    ],
    etiquette: [
      "Promote your events, but leave room for other organizers too",
      "Keep it collaborative — the scene is bigger when people share",
    ],
    notices: [
      {
        title: "A note on tickets",
        tone: "caution",
        body: [
          "This group is for promotion, not resale — ticket reselling is not allowed here.",
          "If you buy or sell tickets anywhere in the wider community, treat it like any other transaction with someone you don't know yet: confirm the ticket is legitimate, and confirm who you're dealing with when it matters.",
          "Be extra careful with events where the venue requires ID that matches the ticket, and be skeptical of unknown or anonymous business profiles.",
          "Miami Roots is a community, not a marketplace — it doesn't vet sellers or guarantee any transaction.",
        ],
      },
    ],
    related: ["ticket-exchange", "business-and-connections", "general-chat"],
    metadata: {
      title: "Nightlife & Event Marketing",
      description:
        "Promoters and organizers share flyers, guest lists, and nightlife events. Promotion, not ticket resale.",
    },
  },
  {
    slug: "ticket-exchange",
    name: "Ticket Exchange",
    shortDescription:
      "Buy, sell, and exchange event tickets with other Miami Roots members. Verify everything before sending payment.",
    fullDescription:
      "Ticket Exchange is a trusted peer-to-peer space for members to buy, sell, and swap tickets to Miami events — catch a last-minute ticket, pass along one you can't use, and connect with people heading to the same shows. Miami Roots is the community that introduces you, not a party to the sale: every deal is directly between members, so verify the ticket and the person before any money moves.",
    category: "events",
    status: "active",
    logo: {
      src: "/group-logos/ticket-exchange-logo.png",
      width: 1122,
      height: 1402,
    },
    access: "managed-by-admins",
    order: 5,
    belongs: [
      "Tickets you're selling because plans changed",
      "Requests for last-minute tickets to local events",
      "Face-value and fair member-to-member exchanges",
      "Finding others heading to the same event",
    ],
    doesNotBelong: [
      "Large-scale scalping or professional resale operations",
      "Unverifiable tickets or requests for deposits up front",
      "Spam, off-topic promotion, or pressure tactics",
    ],
    etiquette: [
      "Be upfront about the event, seat, price, and transfer method",
      "Verify before you pay, and never share passwords or codes",
      "Deal in good faith — this only works if members can trust each other",
    ],
    safety: {
      badge: "Buy & sell safely",
      summary:
        "Peer-to-peer trades between members. Verify the seller and the ticket before sending payment.",
      points: [
        "Verify the seller's identity before you commit",
        "Verify ticket ownership and ask for proof of purchase with sensitive details hidden",
        "Confirm the ticket can be transferred through the original platform",
        "Use a payment method with buyer protection where possible",
        "Never share passwords or verification codes",
        "Avoid deposits for tickets you can't independently verify",
        "Report suspicious activity to Miami Roots admins",
      ],
      disclaimer:
        "Miami Roots does not guarantee tickets, buyers, sellers, or transactions, and is not a broker, escrow, or payment processor. Every exchange is directly between members.",
    },
    related: [
      "nightlife-and-event-marketing",
      "daytime-events",
      "general-chat",
    ],
    metadata: {
      title: "Ticket Exchange",
      description:
        "Buy, sell, and exchange event tickets with other Miami Roots members. A trusted peer-to-peer community — verify everything before sending payment.",
    },
  },
  {
    slug: "community-organizing",
    name: "Community Organizing",
    shortDescription:
      "Beach cleanups, dog-adoption days, volunteering, and group outings — hands-on ways to give back and bring people together.",
    fullDescription:
      "Community Organizing is Miami Roots rolling up its sleeves: beach cleanups, dog-adoption days, volunteering, hobby meetups, and group outings that strengthen the city and the friendships in it. If you like doing good things alongside good people, this is your group.",
    category: "community",
    status: "active",
    logo: null,
    access: "managed-by-admins",
    order: 6,
    belongs: [
      "Volunteering, cleanups, and give-back projects",
      "Hobby activities and group outings",
      "Causes and events that bring members together",
    ],
    doesNotBelong: [
      "Partisan campaigning or divisive politics",
      "Spam or unrelated self-promotion",
    ],
    etiquette: [
      "Collaboration over isolation — organize with people, not at them",
      "Follow through on plans so volunteers and hosts can count on each other",
    ],
    related: ["daytime-events", "general-chat"],
    metadata: {
      title: "Community Organizing",
      description:
        "Beach cleanups, volunteering, dog-adoption days, and group outings with the Miami Roots community.",
    },
  },
  {
    slug: "sober-social",
    name: "Sober Social",
    shortDescription:
      "Miami's social life, clear-headed. Friendship, mutual support, and vibrant plans for people who go out sober.",
    fullDescription:
      "Sober Social is for people who love Miami's social life and want to enjoy it sober. The focus is friendship, mutual support, and genuinely fun, clear-headed experiences. It's a peer social space — a group of people making great plans together — not a treatment or recovery program.",
    category: "wellness",
    status: "active",
    logo: {
      src: "/group-logos/sober-social-logo.png",
      width: 1024,
      height: 1024,
      wordmark: "Sober Social / Miami Roots",
    },
    access: "managed-by-admins",
    order: 7,
    belongs: [
      "Sober-friendly plans, hangouts, and events",
      "Encouragement and mutual support between members",
      "Ideas for enjoying Miami's social life clear-headed",
    ],
    doesNotBelong: [
      "Anything that frames the group as treatment, therapy, or clinical recovery",
      "Pressure, judgment, or spam",
    ],
    etiquette: [
      "Keep it social and supportive — this is friendship, not a program",
      "Respect that people are here for connection and good plans, first and foremost",
    ],
    notices: [
      {
        title: "What this group is",
        tone: "info",
        body: [
          "Sober Social is a peer social space for enjoying Miami's social life sober.",
          "It is not a treatment, therapy, or clinical recovery service, and isn't run as one.",
        ],
      },
    ],
    related: ["daytime-events", "general-chat"],
    metadata: {
      title: "Sober Social",
      description:
        "A peer social space for enjoying Miami's social life sober — friendship, support, and clear-headed fun.",
    },
  },
];
