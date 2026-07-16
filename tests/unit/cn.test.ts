import { describe, expect, it } from "vitest";

import { cn } from "@/lib/cn";

describe("cn", () => {
  it("joins truthy class fragments with a single space", () => {
    expect(cn("p-2", "text-forest")).toBe("p-2 text-forest");
  });

  it("drops falsy fragments so conditional classes compose cleanly", () => {
    const isActive = false;
    const isDisabled = true;
    expect(cn("base", isActive && "active", isDisabled && "disabled")).toBe(
      "base disabled",
    );
  });

  it("returns an empty string when nothing is truthy", () => {
    expect(cn(undefined, null, false)).toBe("");
  });
});
