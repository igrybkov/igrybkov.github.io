import { test, expect } from "@playwright/test";

const pages = [
  "/",
  "/posts/",
  "/posts/hello-world/",
  "/projects/",
  "/about/",
  "/tags/",
  "/archives/",
  "/search/",
];

const menuItems = [
  { name: "Posts", url: "/posts/" },
  { name: "Projects", url: "/projects/" },
  { name: "Tags", url: "/tags/" },
  { name: "Archives", url: "/archives/" },
  { name: "About", url: "/about/" },
  { name: "Search", url: "/search/" },
];

test.describe("internal links", () => {
  for (const path of pages) {
    test(`all internal links on ${path} resolve`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState("networkidle");

      const links = page.locator('a[href^="/"]');
      const count = await links.count();
      const checked = new Set<string>();

      for (let i = 0; i < count; i++) {
        const href = await links.nth(i).getAttribute("href");
        if (!href || checked.has(href)) continue;
        checked.add(href);

        const response = await page.request.get(href);
        expect(
          response.ok(),
          `Link ${href} on ${path} returned ${response.status()}`
        ).toBe(true);
      }
    });
  }
});

test.describe("navigation menu", () => {
  for (const { name, url } of menuItems) {
    test(`menu item "${name}" resolves`, async ({ page }) => {
      await page.goto("/");
      const response = await page.request.get(url);
      expect(
        response.ok(),
        `Menu item "${name}" (${url}) returned ${response.status()}`
      ).toBe(true);
    });
  }
});

test("RSS feed returns valid XML", async ({ page }) => {
  const response = await page.request.get("/index.xml");
  expect(response.ok()).toBe(true);

  const contentType = response.headers()["content-type"];
  expect(contentType).toContain("xml");

  const body = await response.text();
  expect(body).toContain("<rss");
  expect(body).toContain("<channel>");
});

test.describe("external links", () => {
  test("social links have correct hrefs", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const socialLinks = page.locator(".social-icons a");
    const count = await socialLinks.count();
    const hrefs: string[] = [];

    for (let i = 0; i < count; i++) {
      const href = await socialLinks.nth(i).getAttribute("href");
      if (href) hrefs.push(href);
    }

    expect(hrefs).toContain("https://github.com/igrybkov");
    expect(hrefs).toContain("https://linkedin.com/in/igrybkov");
  });
});
