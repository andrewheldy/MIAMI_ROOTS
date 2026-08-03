import { afterEach, describe, expect, it } from "vitest";

import {
  isConnectorTelemetryConfigured,
  recordConnectorScan,
} from "@/lib/connectors/scan-events";
import { isNominationCaptureConfigured } from "@/lib/connectors/nomination-store";

/**
 * The "is there really a backend?" checks.
 *
 * These guard the honesty rule that runs through the whole feature: no scan is
 * claimed as recorded and no nomination is claimed as stored unless a real
 * write path exists. Both checks must also be safe to call during a render —
 * i.e. they answer false rather than throwing, unlike `readServiceRoleKey()`.
 */

const COMPLETE = {
  NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key-placeholder",
  SUPABASE_SERVICE_ROLE_KEY: "service-key-placeholder",
};

const originalEnv = { ...process.env };

afterEach(() => {
  process.env = { ...originalEnv };
});

describe.each([
  ["connector telemetry", isConnectorTelemetryConfigured],
  ["nomination capture", isNominationCaptureConfigured],
])("%s configuration check", (_label, isConfigured) => {
  it("is true only when every required variable is present", () => {
    expect(isConfigured(COMPLETE)).toBe(true);
  });

  it("is false when any one of them is missing or blank", () => {
    for (const key of Object.keys(COMPLETE)) {
      expect(isConfigured({ ...COMPLETE, [key]: undefined }), key).toBe(false);
      expect(isConfigured({ ...COMPLETE, [key]: "   " }), key).toBe(false);
    }
    expect(isConfigured({})).toBe(false);
  });

  it("answers rather than throwing, so a render can safely ask", () => {
    expect(() => isConfigured({})).not.toThrow();
  });
});

describe("recordConnectorScan", () => {
  it("no-ops instead of failing when no database is configured", async () => {
    for (const key of Object.keys(COMPLETE)) {
      delete process.env[key];
    }
    await expect(
      recordConnectorScan({ code: "fc001", source: "nfc", credited: true }),
    ).resolves.toBe("skipped_unconfigured");
  });

  it("never rejects, even pointed at a database that does not exist", async () => {
    Object.assign(process.env, COMPLETE, {
      NEXT_PUBLIC_SUPABASE_URL: "https://127.0.0.1:1",
    });
    // A redirect must not fail because telemetry did.
    await expect(
      recordConnectorScan({ code: "fc001", source: "qr", credited: false }),
    ).resolves.toBe("failed");
  });
});
