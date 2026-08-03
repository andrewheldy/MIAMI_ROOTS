import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import HomePage from "@/app/(site)/page";
import { ShareSection } from "@/features/share/share-section";

describe("ShareSection (homepage share prompt)", () => {
  const html = renderToStaticMarkup(<ShareSection />);

  it("renders the specified eyebrow, headline, and body copy", () => {
    expect(html).toMatch(/grow the roots/i);
    expect(html).toContain("Miami is better when your people are here.");
    expect(html).toContain(
      "Know someone who should be part of Miami Roots? Save your personal share card, post it to your story, or let someone scan your screen.",
    );
  });

  it("offers the primary and secondary share CTAs", () => {
    expect(html).toContain("Get Your Share Card");
    expect(html).toContain("Show My QR Code");
  });

  it("is a labelled landmark section", () => {
    expect(html).toContain('aria-labelledby="share-heading"');
    expect(html).toContain('id="share-heading"');
  });
});

describe("HomePage integration", () => {
  const html = renderToStaticMarkup(<HomePage />);

  it("adds the share section without removing the existing journey", () => {
    // New share prompt is present…
    expect(html).toContain("Miami is better when your people are here.");
    expect(html).toContain("Get Your Share Card");
    // …and the existing hero, trust, and closing CTA journey still stand.
    // The closing CTA labels read "Join the community chats" / "Explore the
    // groups" since the navigation & motion pass unified them with the hero.
    expect(html).toContain("A community rooted in Miami");
    expect(html).toContain("Ready to find your people?");
    expect(html).toContain("Join the community chats");
    expect(html).toContain("Explore the groups");
  });

  it("keeps the small 'Share Miami Roots' action near the closing CTA", () => {
    expect(html).toContain("Share Miami Roots");
  });

  it("still renders exactly one h1", () => {
    expect(html.match(/<h1/g)?.length).toBe(1);
  });
});
