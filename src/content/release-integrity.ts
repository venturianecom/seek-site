interface ReleaseIdentity {
  data: {
    slug: string;
    version: string;
  };
}

export function assertReleaseIntegrity(releases: ReleaseIdentity[]) {
  const slugs = new Set<string>();
  const versions = new Set<string>();

  for (const release of releases) {
    if (slugs.has(release.data.slug)) {
      throw new Error(`Duplicate release slug: ${release.data.slug}`);
    }
    if (versions.has(release.data.version)) {
      throw new Error(`Duplicate release version: ${release.data.version}`);
    }
    slugs.add(release.data.slug);
    versions.add(release.data.version);
  }
}
