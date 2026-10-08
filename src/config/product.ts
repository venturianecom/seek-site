export interface ProductConfig {
  name: string;
  minimumMacOS: string;
  downloadUrl: string | null;
  latestVersion: string | null;
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
  supportEmail: "hello@venturiane.com",
};

assertProductConfig(product);
