export interface ProductConfig {
  name: string;
  minimumMacOS: string;
  downloadUrl: string | null;
  latestVersion: string | null;
  experimental: {
    version: string;
    build: string;
    downloadUrl: string;
    sha256: string;
    notarized: false;
  } | null;
  supportEmail: string;
}

export function assertProductConfig(config: ProductConfig) {
  if (Boolean(config.downloadUrl) !== Boolean(config.latestVersion)) {
    throw new Error(
      "downloadUrl and latestVersion must be configured together",
    );
  }
  if (config.downloadUrl && new URL(config.downloadUrl).protocol !== "https:") {
    throw new Error("downloadUrl must use HTTPS");
  }
  if (
    config.experimental &&
    new URL(config.experimental.downloadUrl).protocol !== "https:"
  ) {
    throw new Error("experimental downloadUrl must use HTTPS");
  }
  if (
    config.experimental &&
    !/^[0-9a-f]{64}$/.test(config.experimental.sha256)
  ) {
    throw new Error(
      "experimental sha256 must contain 64 hexadecimal characters",
    );
  }
  if (
    config.latestVersion &&
    !/^\d+\.\d+\.\d+(?:-[a-z0-9.-]+)?$/.test(config.latestVersion)
  ) {
    throw new Error("latestVersion must use semantic versioning");
  }
  if (!/^\d+(?:\.\d+)?$/.test(config.minimumMacOS)) {
    throw new Error("minimumMacOS must be a numeric macOS version");
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(config.supportEmail)) {
    throw new Error("supportEmail must be a valid email address");
  }
}

export const product: ProductConfig = {
  name: "Seek",
  minimumMacOS: "14",
  downloadUrl: null as string | null,
  latestVersion: null as string | null,
  experimental: {
    version: "1.0.0",
    build: "57",
    downloadUrl:
      "https://downloads.seek.venturiane.com/experimental/Seek-ExperimentalPre1.0.0Build57.dmg",
    sha256: "217e6d18281ad7848aff833d42e8278d52144cb3374bdbf4a6dca511f0324768",
    notarized: false,
  },
  supportEmail: "hello@venturiane.com",
};

assertProductConfig(product);
