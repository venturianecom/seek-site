import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("homepage exposes the release navigation and interactive preview", async ({
  page,
  isMobile,
}) => {
  await page.goto("/");

  const header = page.locator(".site-header");
  if (isMobile) await header.locator(".mobile-menu summary").click();
  const navigation = isMobile
    ? header.getByRole("navigation", { name: "Mobile navigation" })
    : header;
  await expect(
    navigation.getByRole("link", { name: /^Download/ }),
  ).toBeVisible();
  await expect(
    navigation.getByRole("link", { name: /^Release notes/ }),
  ).toBeVisible();
  await expect(
    navigation.getByRole("link", { name: /^Support/ }),
  ).toBeVisible();

  const search = page.getByLabel("Try the interactive Seek preview");
  await search.fill("window");
  await expect(page.locator(".seek-row")).toHaveCount(2);
  await search.fill("1280 * 0.21");
  await expect(page.locator(".seek-row").first()).toContainText("268.8");
});

test("release pages are reachable and internally consistent", async ({
  page,
}) => {
  for (const route of [
    "/download/",
    "/release-notes/",
    "/support/",
    "/privacy/",
  ]) {
    const response = await page.goto(route);
    expect(response?.ok()).toBe(true);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator(".site-footer")).toBeVisible();
  }
});

test("support offers direct help and feature requests", async ({ page }) => {
  await page.goto("/support/");

  await expect(
    page.getByRole("link", { name: "Email support", exact: true }),
  ).toHaveAttribute("href", /subject=Seek%20support/);
  await expect(
    page.getByRole("link", { name: "Request a feature", exact: true }).first(),
  ).toHaveAttribute("href", /subject=Seek%20feature%20request/);

  const footer = page.getByRole("contentinfo");
  await expect(
    footer.getByRole("link", { name: "Request a feature", exact: true }),
  ).toBeVisible();
  await expect(
    footer.getByRole("link", { name: "Privacy Policy", exact: true }),
  ).toHaveAttribute("href", "/privacy/");
  await expect(
    footer.getByRole("link", { name: "Contact", exact: true }),
  ).toHaveCount(0);
});

test("mobile navigation contains every release route without overflow", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "Mobile-only navigation check");
  await page.goto("/");
  await page.locator(".mobile-menu summary").click();

  const navigation = page.getByRole("navigation", {
    name: "Mobile navigation",
  });
  for (const label of [
    "Features",
    "Live preview",
    "Download",
    "Release notes",
    "Support",
    "Privacy",
  ]) {
    await expect(
      navigation.getByRole("link", { name: new RegExp(label, "i") }),
    ).toBeVisible();
  }

  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(dimensions.scrollWidth).toBe(dimensions.clientWidth);
});

test("core pages have no serious accessibility violations", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });

  for (const route of [
    "/",
    "/download/",
    "/release-notes/",
    "/support/",
    "/privacy/",
  ]) {
    await page.goto(route);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(
      results.violations.filter((violation) =>
        ["serious", "critical"].includes(violation.impact ?? ""),
      ),
    ).toEqual([]);
  }
});
