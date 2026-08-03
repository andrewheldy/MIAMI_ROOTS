import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import ConnectorsPage from "@/app/(site)/connectors/page";

/**
 * The public `/connectors` page, with particular attention to the one branch
 * that could mislead a visitor: whether a nomination form is shown at all.
 *
 * The rule under test is the honesty rule — a form is only ever rendered where
 * a submission can actually be stored. Everywhere else the page says so
 * plainly and offers a route that works today.
 */

const CAPTURE_ENV = {
  NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key-placeholder",
  SUPABASE_SERVICE_ROLE_KEY: "service-key-placeholder",
} as const;

const originalEnv = { ...process.env };

beforeEach(() => {
  for (const key of Object.keys(CAPTURE_ENV)) {
    delete process.env[key];
  }
});

afterEach(() => {
  process.env = { ...originalEnv };
});

describe("/connectors — program copy", () => {
  it("explains what a Founding Connector is, and what it is not", () => {
    const html = renderToStaticMarkup(<ConnectorsPage />);
    expect(html).toContain("Miami Roots Founding Connectors");
    expect(html).toMatch(/a connector, not an ambassador/i);
    expect(html).toMatch(/not a job/i);
    expect(html).toMatch(/not permanent/i);
  });

  it("states that admission is selective and never guaranteed", () => {
    const html = renderToStaticMarkup(<ConnectorsPage />);
    expect(html).toMatch(/admission is never guaranteed/i);
  });

  it("explains the card, the tracked link, and what is measured", () => {
    const html = renderToStaticMarkup(<ConnectorsPage />);
    expect(html).toMatch(/tap or scan/i);
    expect(html).toMatch(/we count taps, not people/i);
  });

  it("sets out expectations, prohibited behavior, and the revocability rule", () => {
    const html = renderToStaticMarkup(<ConnectorsPage />);
    expect(html).toMatch(/mass-post the link/i);
    expect(html).toMatch(/sell access to the community/i);
    expect(html).toMatch(/pause or retire any card/i);
    expect(html).toMatch(/aren&#x27;t employees/i);
  });

  it("promises no equity, employment, commission, or revenue share", () => {
    const html = renderToStaticMarkup(<ConnectorsPage />);
    expect(html).toMatch(/equity, employment, commissions, revenue share/i);
  });

  it("never names a connector — nobody in the registry has consented", () => {
    const html = renderToStaticMarkup(<ConnectorsPage />);
    expect(html).not.toContain("Pilot Card");
  });
});

describe("/connectors — nomination availability", () => {
  it("offers a direct route instead of a form when nothing can be stored", () => {
    const html = renderToStaticMarkup(<ConnectorsPage />);
    expect(html).toMatch(/nominations aren&#x27;t open on this site yet/i);
    expect(html).not.toContain("<form");
  });

  it("renders the real form once a write path exists", () => {
    Object.assign(process.env, CAPTURE_ENV);
    const html = renderToStaticMarkup(<ConnectorsPage />);
    expect(html).toContain("<form");
    expect(html).not.toMatch(/nominations aren&#x27;t open/i);
    // Every field the program design collects, and nothing beyond it.
    for (const field of [
      'name="kind"',
      'name="nomineeName"',
      'name="contactMethod"',
      'name="contactValue"',
      'name="instagram"',
      'name="neighborhood"',
      'name="communityRole"',
      'name="why"',
      'name="referralSource"',
      'name="consentToContact"',
    ]) {
      expect(html, field).toContain(field);
    }
    // Consent is not optional, and the honeypot is present but hidden.
    expect(html).toMatch(
      /name="consentToContact"[^>]*required|required[^>]*name="consentToContact"/,
    );
    expect(html).toContain('name="website"');
  });
});
