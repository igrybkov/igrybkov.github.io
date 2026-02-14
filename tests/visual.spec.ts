import { test, expect, type Page } from "@playwright/test";

type StabilizeFn = (page: Page) => Promise<void>;

async function stabilizeListPage(page: Page) {
  await page.evaluate(() => {
    document.querySelectorAll(".entry-header h2").forEach((el, i) => {
      el.textContent = `Post Title ${i + 1}`;
    });
    document.querySelectorAll(".entry-content p").forEach((el) => {
      el.textContent = "A short summary of this blog post.";
    });
    document.querySelectorAll(".entry-footer").forEach((el) => {
      el.textContent = "January 1, 2025 · 2 min · Author";
    });
  });
}

async function stabilizeArchivePage(page: Page) {
  await page.evaluate(() => {
    document.querySelectorAll(".archive-entry-title").forEach((el, i) => {
      el.textContent = `Post Title ${i + 1}`;
    });
    document.querySelectorAll(".archive-meta").forEach((el) => {
      el.textContent = "January 1, 2025 · 2 min · Author";
    });
    document.querySelectorAll(".archive-count").forEach((el) => {
      el.textContent = "\u00a03";
    });
  });
}

async function stabilizePostMeta(page: Page) {
  await page.evaluate(() => {
    document.querySelectorAll(".post-meta").forEach((el) => {
      el.textContent = "January 1, 2025 · 2 min · Author";
    });
  });
}

const pages: { name: string; path: string; stabilize?: StabilizeFn }[] = [
  { name: "home", path: "/", stabilize: stabilizeListPage },
  { name: "posts", path: "/posts/", stabilize: stabilizeListPage },
  { name: "post-hello-world", path: "/posts/hello-world/", stabilize: stabilizePostMeta },
  { name: "projects", path: "/projects/" },
  { name: "about", path: "/about/" },
  { name: "tags", path: "/tags/", stabilize: stabilizeListPage },
  { name: "archives", path: "/archives/", stabilize: stabilizeArchivePage },
  { name: "search", path: "/search/" },
];

async function waitForPageReady(page: Page) {
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

for (const { name, path, stabilize } of pages) {
  test(`${name} page matches screenshot`, async ({ page }) => {
    await page.goto(path);
    await waitForPageReady(page);
    await stabilize?.(page);

    await expect(page).toHaveScreenshot(`${name}.png`, {
      fullPage: true,
      animations: "disabled",
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

  await stabilizeListPage(page);

  await expect(page).toHaveScreenshot("home-dark.png", {
    fullPage: true,
    animations: "disabled",
  });
});
