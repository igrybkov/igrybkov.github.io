import { test, expect } from "@playwright/test";

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

async function waitForPageReady(page: import("@playwright/test").Page) {
  await page.waitForLoadState("networkidle");
  // Wait for all images to finish loading
  await page.evaluate(() =>
    Promise.all(
      Array.from(document.images)
        .filter((img) => !img.complete)
        .map(
          (img) =>
            new Promise((resolve) => {
              img.onload = resolve;
              img.onerror = resolve;
            })
        )
    )
  );
}

for (const { name, path } of pages) {
  test(`${name} page matches screenshot`, async ({ page }) => {
    await page.goto(path);
    await waitForPageReady(page);

    await expect(page).toHaveScreenshot(`${name}.png`, {
      fullPage: true,
      animations: "disabled",
      mask: [page.locator(".post-meta")],
    });
  });
}

test("home dark mode matches screenshot", async ({ page }) => {
  await page.goto("/");
  await waitForPageReady(page);

  // Toggle to dark mode
  const themeToggle = page.locator("#theme-toggle");
  await themeToggle.click();

  // Wait for theme transition
  await page.waitForTimeout(300);

  await expect(page).toHaveScreenshot("home-dark.png", {
    fullPage: true,
    animations: "disabled",
    mask: [page.locator(".post-meta")],
  });
});
