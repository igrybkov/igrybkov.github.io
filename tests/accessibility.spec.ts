import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const pages = [
  { name: "home", path: "/" },
  { name: "posts", path: "/posts/" },
  { name: "post-hello-world", path: "/posts/hello-world/" },
  { name: "projects", path: "/projects/" },
  { name: "about", path: "/about/" },
  { name: "tags", path: "/tags/" },
  { name: "archives", path: "/archives/" },
  { name: "search", path: "/search/" },
];

for (const { name, path } of pages) {
  test(`${name} page passes WCAG2AA`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState("networkidle");

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test(`${name} page has single h1`, async ({ page }) => {
    await page.goto(path);
    const h1Count = await page.locator("h1").count();
    expect(h1Count).toBe(1);
  });

  test(`${name} page images have alt attributes`, async ({ page }) => {
    await page.goto(path);
    const images = page.locator("img");
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute("alt");
      expect(alt, `Image ${i} missing alt attribute`).not.toBeNull();
    }
  });
}
