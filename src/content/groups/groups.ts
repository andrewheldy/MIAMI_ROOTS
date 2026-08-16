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
 * Copy status: PROVISIONAL, rewritten 2026-08-16 for the community-first pass.
 * It is grounded in the documented group purposes and the voice guide
 * (`docs/04-design/content-and-voice.md`), and it now leads with why each room
 * exists and who it is for, because the site explains rooms rather than selling
 * chat links (owner direction, decision log 2026-08-16). Two constraints hold
 * every string here: it contains no private community information, and it
 * contains no em-dashes (`docs/DESIGN_INTELLIGENCE.md` §7 scope note). It has
 * not had an owner voice pass.
 */
export const communityGroups: readonly CommunityGroup[] = [
  {
    slug: "general-chat",
    name: "General Chat",
    shortDescription:
      "The front porch. Introductions, quick questions, and the updates that keep everyone in the loop.",
    fullDescription:
      "General Chat is where the whole community overlaps. It is the room for saying hello, asking the question you would otherwise google badly, and catching the updates that matter. If you are new, start here and let people point you toward the rooms you actually want.",
    forYouIf:
      "You are new, or you just want to be in the room where the day happens.",
    whyItExists:
      "Every community needs a front porch. This is where introductions land, where a question gets a real answer in minutes, and where somebody sends you to the room you were looking for without knowing it.",
    category: "everyday",
    status: "active",
    logo: null,
    access: "managed-by-admins",
    order: 1,
    belongs: [
      "Introductions and hellos, especially if you are new",
      "Everyday conversation and quick questions",
      "Community news and general updates",
      "Pointing people toward the more specific rooms when it fits",
    ],
    doesNotBelong: [
      "Spam, cold pitches, or mass-DMing members",
      "Repeated self-promotion better suited to Business & Connections",
    ],
    etiquette: [
      "Be a real participant, not a lurker looking to extract value",
      "Welcome newcomers in. The community grows by opening the door",
    ],
    related: ["business-and-connections", "community-organizing"],
    metadata: {
      title: "General Chat",
      description:
        "The central Miami Roots room for everyday conversation, quick questions, and community updates.",
    },
  },
  {
    slug: "business-and-connections",
    name: "Business & Connections",
    shortDescription:
      "Say what you are building, find collaborators, and pass on the opportunities you cannot use.",
    fullDescription:
      "Business & Connections is for the builders. Share the project, ask for the skill you are missing, hand over the lead that is not yours to take. The point is genuine help between people who will run into each other again, which is a different thing from collecting contacts.",
    forYouIf:
      "You are building something and you would rather know people than cold email them.",
    whyItExists:
      "The useful version of networking is a room where people already vouch for each other. This one exists so a Miami founder can find a Miami designer without paying a platform to introduce them.",
    category: "business",
    status: "active",
    logo: null,
    access: "managed-by-admins",
    order: 2,
    belongs: [
      "Projects and businesses you are working on",
      "Requests for collaborators, skills, or introductions",
      "Opportunities, leads, and useful local resources",
    ],
    doesNotBelong: [
      "Cold pitching, spam, or mass-DMing members",
      "Multi-level marketing recruitment",
      "Treating other members as leads rather than people",
    ],
    etiquette: [
      "Give before you take. Contribute opportunities, do not only collect them",
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
      "Yoga, run clubs, Pilates, and 7am beach mornings. Daytime plans that get made out loud.",
    fullDescription:
      "Daytime Events is the wellness side of Miami Roots. Yoga, run clubs, Pilates, beach mornings, and whatever else gets people outside before the heat. Low pressure, all paces welcome, and an easy way to end up with actual friends rather than a workout streak.",
    forYouIf:
      "Your best hours are before noon and you would rather not run alone.",
    whyItExists:
      "Miami is at its best early, and most people miss it because nobody made the plan. This room turns a vague intention into a time, a place, and three other people waiting for you.",
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
      "Wellness and movement meetups: yoga, run clubs, Pilates, and similar",
      "Outdoor and daytime activities around Miami",
      "Plans that help members recharge and connect",
    ],
    doesNotBelong: [
      "Nightlife promotion, which lives in Nightlife & Event Marketing",
      "Spam or unrelated self-promotion",
    ],
    etiquette: [
      "Keep plans welcoming to newcomers and all fitness levels",
      "Show up when you say you will. Small commitments build trust",
    ],
    related: ["sober-social", "community-organizing"],
    metadata: {
      title: "Daytime Events",
      description:
        "Wellness-oriented daytime meetups: yoga, run clubs, Pilates, and outdoor activities with the Miami Roots community.",
    },
  },
  {
    slug: "nightlife-and-event-marketing",
    name: "Nightlife & Event Marketing",
    displayNameProvisional: true,
    shortDescription:
      "Flyers, guest lists, and collaborations between the people who actually run Miami's nights.",
    fullDescription:
      "Nightlife & Event Marketing is where promoters and organizers put the flyer, share the guest list, and find the person to co-host with. It is built for promotion and partnerships. One rule keeps it useful: ticket reselling belongs in Ticket Exchange, not here.",
    forYouIf:
      "You throw events, promote them, or want to hear about the good ones first.",
    whyItExists:
      "Miami's promoters were all working alone and competing for the same Tuesday. Put them in one room and the collaborations, the cross-promotions, and the better nights follow.",
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
      "Ticket reselling, which is not allowed in this room",
      "Spam or unrelated promotion",
    ],
    etiquette: [
      "Promote your events, but leave room for other organizers too",
      "Keep it collaborative. The scene is bigger when people share",
    ],
    notices: [
      {
        title: "A note on tickets",
        tone: "caution",
        body: [
          "This room is for promotion, not resale. Ticket reselling is not allowed here.",
          "If you buy or sell tickets anywhere in the wider community, treat it like any other transaction with someone you have not met: confirm the ticket is legitimate, and confirm who you are dealing with when it matters.",
          "Be extra careful with events where the venue requires ID that matches the ticket, and be skeptical of unknown or anonymous business profiles.",
          "Miami Roots is a community, not a marketplace. It does not vet sellers or guarantee any transaction.",
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
      "The seat you cannot use, and the one somebody needs by 8pm. Verify everything before you pay.",
    fullDescription:
      "Ticket Exchange is a peer-to-peer room for buying, selling, and swapping tickets to Miami events. Catch a last-minute seat, pass on the one your plans killed, and find people heading to the same show. Miami Roots introduces you and nothing more: every deal is directly between members, so check the ticket and the person before any money moves.",
    forYouIf: "You have a ticket you cannot use, or you need one for tonight.",
    whyItExists:
      "Plans change late, and somebody in this community is always looking for exactly the seat you are stuck with. The room exists so that trade happens between neighbors instead of at a 40 percent markup.",
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
      "Tickets you are selling because plans changed",
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
      "Deal in good faith. This only works if members can trust each other",
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
        "Avoid deposits for tickets you cannot independently verify",
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
        "Buy, sell, and exchange event tickets with other Miami Roots members. A trusted peer-to-peer community. Verify everything before sending payment.",
    },
  },
  {
    slug: "community-organizing",
    name: "Community Organizing",
    shortDescription:
      "Beach cleanups, dog adoption days, volunteering, and outings. Doing good things alongside good people.",
    fullDescription:
      "Community Organizing is Miami Roots with its sleeves rolled up. Beach cleanups, dog adoption days, volunteering, hobby meetups, and the group outings that turn acquaintances into friends. If you like being useful and you like company while you do it, this is your room.",
    forYouIf: "You want to spend a Saturday on something that helps.",
    whyItExists:
      "Most people mean it when they say they would help with something local. What is missing is the date, the place, and someone else going. This room supplies all three.",
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
      "Collaboration over isolation. Organize with people, not at them",
      "Follow through on plans so volunteers and hosts can count on each other",
    ],
    related: ["daytime-events", "general-chat"],
    metadata: {
      title: "Community Organizing",
      description:
        "Beach cleanups, volunteering, dog adoption days, and group outings with the Miami Roots community.",
    },
  },
  {
    slug: "sober-social",
    name: "Sober Social",
    shortDescription:
      "Miami's social life, clear-headed. Friendship, support, and plans worth leaving the house for.",
    fullDescription:
      "Sober Social is for people who love Miami's social life and want to enjoy it sober. The focus is friendship, mutual support, and plans that are genuinely fun without a drink in your hand. It is a peer social space, a group of people making good plans together, and it is not a treatment or recovery program.",
    forYouIf:
      "You go out sober, or you are taking a break, and you still want a full social life.",
    whyItExists:
      "This city assumes a drink in your hand. Plenty of people here are enjoying the same nights without one, and they were doing it alone until there was a room for it.",
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
      "Anything that frames the room as treatment, therapy, or clinical recovery",
      "Pressure, judgment, or spam",
    ],
    etiquette: [
      "Keep it social and supportive. This is friendship, not a program",
      "Respect that people are here for connection and good plans, first of all",
    ],
    notices: [
      {
        title: "What this room is",
        tone: "info",
        body: [
          "Sober Social is a peer social space for enjoying Miami's social life sober.",
          "It is not a treatment, therapy, or clinical recovery service, and is not run as one.",
        ],
      },
    ],
    related: ["daytime-events", "general-chat"],
    metadata: {
      title: "Sober Social",
      description:
        "A peer social space for enjoying Miami's social life sober: friendship, support, and clear-headed fun.",
    },
  },
];
