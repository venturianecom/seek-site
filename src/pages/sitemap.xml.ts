import { getPublishedReleases } from "../content/releases";

const site = "https://seek.venturiane.com";

function url(
  path: string,
  lastmod: string,
  changefreq: "weekly" | "monthly" | "yearly",
) {
  return `<url><loc>${site}${path}</loc><lastmod>${lastmod}</lastmod><changefreq>${changefreq}</changefreq></url>`;
}

export async function GET() {
  const releases = await getPublishedReleases();
  const staticUrls = [
    url("/", "2026-10-08", "monthly"),
    url("/download/", "2026-10-08", "weekly"),
    url("/release-notes/", "2026-10-08", "weekly"),
    url("/support/", "2026-10-08", "monthly"),
    url("/privacy/", "2026-10-08", "yearly"),
  ];
  const releaseUrls = releases.map((release) =>
    url(
      `/release-notes/${release.data.slug}/`,
      release.data.pubDate.toISOString().slice(0, 10),
      "monthly",
    ),
  );
  const body = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${[...staticUrls, ...releaseUrls].join("")}</urlset>`;

  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
