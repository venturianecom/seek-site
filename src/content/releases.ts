import { getCollection } from "astro:content";

import { assertReleaseIntegrity } from "./release-integrity";

export async function getPublishedReleases() {
  const releases = await getCollection("releases", ({ data }) => !data.draft);
  assertReleaseIntegrity(releases);

  return releases.sort(
    (first, second) =>
      second.data.pubDate.valueOf() - first.data.pubDate.valueOf(),
  );
}
