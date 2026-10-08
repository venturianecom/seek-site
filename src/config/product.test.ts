import { describe, expect, it } from "vitest";

import { assertProductConfig, product, type ProductConfig } from "./product";

function configured(overrides: Partial<ProductConfig> = {}): ProductConfig {
  return { ...product, ...overrides };
}

describe("product configuration", () => {
  it("accepts the checked-in pre-release configuration", () => {
    expect(() => assertProductConfig(product)).not.toThrow();
  });

  it("requires a version and download URL together", () => {
    expect(() =>
      assertProductConfig(configured({ latestVersion: "1.0.0" })),
    ).toThrow(/configured together/);
    expect(() =>
      assertProductConfig(
        configured({ downloadUrl: "https://example.com/Seek.dmg" }),
      ),
    ).toThrow(/configured together/);
  });

  it("requires a secure download URL and semantic version", () => {
    expect(() =>
      assertProductConfig(
        configured({
          downloadUrl: "http://example.com/Seek.dmg",
          latestVersion: "1.0.0",
        }),
      ),
    ).toThrow(/HTTPS/);
    expect(() =>
      assertProductConfig(
        configured({
          downloadUrl: "https://example.com/Seek.dmg",
          latestVersion: "release-one",
        }),
      ),
    ).toThrow(/semantic/);
  });
});
