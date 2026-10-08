import { describe, expect, it } from "vitest";

import { assertReleaseIntegrity } from "./release-integrity";

const release = (slug: string, version: string) => ({
  data: { slug, version },
});

describe("release content integrity", () => {
  it("accepts unique release identities", () => {
    expect(() =>
      assertReleaseIntegrity([
        release("one-zero-zero", "1.0.0"),
        release("one-one-zero", "1.1.0"),
      ]),
    ).not.toThrow();
  });

  it("rejects duplicate slugs", () => {
    expect(() =>
      assertReleaseIntegrity([
        release("one-zero-zero", "1.0.0"),
        release("one-zero-zero", "1.0.1"),
      ]),
    ).toThrow(/slug/);
  });

  it("rejects duplicate versions", () => {
    expect(() =>
      assertReleaseIntegrity([
        release("stable", "1.0.0"),
        release("stable-again", "1.0.0"),
      ]),
    ).toThrow(/version/);
  });
});
