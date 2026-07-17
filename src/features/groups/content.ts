export type CommunityIcon =
  "chat" | "connections" | "nightlife" | "daytime" | "organizing" | "sober";

export interface CommunityGroup {
  name: string;
  shortName: string;
  slug: string;
  eyebrow: string;
  shortDescription: string;
  fullDescription: string;
  purpose: string;
  whoItsFor: readonly string[];
  rules: readonly string[];
  eventPreview?: {
    date: string;
    title: string;
    location: string;
  };
  logo?: string;
  icon: CommunityIcon;
  tone: "mint" | "sun" | "coral" | "sky" | "lime" | "lavender";
}

export const communityGroups: readonly CommunityGroup[] = [
  {
    name: "General Chat",
    shortName: "General",
    slug: "general-chat",
    eyebrow: "Everyday connection",
    shortDescription:
      "The open table for quick questions, local recommendations, and everyday conversation.",
    fullDescription:
      "General Chat is the central gathering place for Miami Roots: a welcoming space for everyday conversation, community updates, quick questions, and the small moments that turn unfamiliar faces into familiar ones.",
    purpose:
      "Make it easier to ask, share, and stay connected to what is happening across the community.",
    whoItsFor: [
      "People who are new to Miami",
      "Longtime locals ready to meet new people",
      "Anyone looking for a friendly place to start",
    ],
    rules: [
      "Be genuine and welcoming.",
      "Share and contribute; do not use the group only to promote yourself.",
      "No spam, cold pitching, or mass direct messages.",
    ],
    icon: "chat",
    tone: "mint",
  },
  {
    name: "Business & Connections",
    shortName: "Business",
    slug: "business-and-connections",
    eyebrow: "Build together",
    shortDescription:
      "A place to share projects, find collaborators, and help good local ideas move forward.",
    fullDescription:
      "Business & Connections brings together founders, creatives, operators, and curious people who believe opportunity grows when it is shared. It is built for useful introductions, thoughtful collaboration, and people helping people.",
    purpose:
      "Help members exchange opportunities and grow together without turning relationships into transactions.",
    whoItsFor: [
      "People building a project or business",
      "Collaborators, creatives, and local operators",
      "Members who have an opportunity to share",
    ],
    rules: [
      "Lead with how you can help, not what you can extract.",
      "Keep promotion relevant and useful to the group.",
      "No unsolicited mass outreach or transactional networking behavior.",
    ],
    icon: "connections",
    tone: "sun",
  },
  {
    name: "Nightlife & Event Marketing",
    shortName: "Nightlife",
    slug: "nightlife-and-event-marketing",
    eyebrow: "Make the night happen",
    shortDescription:
      "For promoters and organizers sharing events, guest lists, and creative collaborations.",
    fullDescription:
      "Nightlife & Event Marketing is where Miami's promoters and event organizers can share flyers, guest lists, upcoming nights, and opportunities to collaborate. It is about making better experiences together—not reselling access to them.",
    purpose:
      "Connect the people creating Miami's nights so they can share what is happening and collaborate well.",
    whoItsFor: [
      "Event organizers and promoters",
      "People working across Miami nightlife",
      "Members looking for relevant event information",
    ],
    rules: [
      "No ticket reselling. Ticket resale does not belong in this group.",
      "Share clear, relevant event details.",
      "Respect members' inboxes—no unsolicited mass direct messages.",
    ],
    logo: "/group-logos/nightlife-and-event-marketing-logo.png",
    icon: "nightlife",
    tone: "coral",
  },
  {
    name: "Daytime Events",
    shortName: "Daytime",
    slug: "daytime-events",
    eyebrow: "Move, meet, recharge",
    shortDescription:
      "Wellness, movement, and outdoor gatherings for meeting people in the Miami sun.",
    fullDescription:
      "Daytime Events is for the gatherings that help people move, recharge, and meet each other outside the usual nightlife rhythm—from yoga and run clubs to Pilates, outdoor activities, and other wellness-oriented experiences.",
    purpose:
      "Create easy, energizing ways to spend time together and restore balance.",
    whoItsFor: [
      "People looking for active ways to connect",
      "Wellness and outdoor communities",
      "Anyone who prefers daytime plans",
    ],
    rules: [
      "Share events that fit the group's wellness and daytime focus.",
      "Be honest about costs, hosts, and what participants should expect.",
      "Welcome every experience level.",
    ],
    logo: "/group-logos/daytime-events-logo.png",
    icon: "daytime",
    tone: "sky",
  },
  {
    name: "Community Organizing",
    shortName: "Organizing",
    slug: "community-organizing",
    eyebrow: "Turn care into action",
    shortDescription:
      "Volunteering, cleanups, local projects, hobbies, and good ideas worth doing together.",
    fullDescription:
      "Community Organizing is where care becomes action. Members can find or shape beach cleanups, dog-adoption days, volunteering, hobby activities, group outings, and neighborhood projects that make Miami stronger.",
    purpose:
      "Give people a place to turn good intentions into shared, local action.",
    whoItsFor: [
      "Volunteers ready to contribute",
      "People with a local project or idea",
      "Members looking for purpose-driven friendships",
    ],
    rules: [
      "Be clear about the organizer, goal, and commitment involved.",
      "Keep projects safe, lawful, and community-minded.",
      "Give credit, share responsibility, and welcome new contributors.",
    ],
    icon: "organizing",
    tone: "lime",
  },
  {
    name: "Sober Social",
    shortName: "Sober Social",
    slug: "sober-social",
    eyebrow: "Clear-headed connection",
    shortDescription:
      "Vibrant, genuinely social Miami experiences for people who choose to stay sober.",
    fullDescription:
      "Sober Social is for people who want Miami's energy, friendship, and memorable experiences without alcohol. It is a peer social space built around clear-headed fun and mutual support—not a treatment or clinical recovery service.",
    purpose:
      "Make sober socializing feel expansive, connected, and fully part of Miami life.",
    whoItsFor: [
      "Sober and sober-curious adults",
      "People looking for alcohol-free plans",
      "Friends who value clear-headed social experiences",
    ],
    rules: [
      "Respect every person's relationship with sobriety.",
      "Keep the space social and peer-led; it is not a treatment service.",
      "Never pressure anyone to drink or explain their choice.",
    ],
    logo: "/group-logos/sober-social-logo.png",
    icon: "sober",
    tone: "lavender",
  },
] as const;

export function getCommunityGroup(slug: string) {
  return communityGroups.find((group) => group.slug === slug);
}
