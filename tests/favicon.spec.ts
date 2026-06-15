import { test, expect } from "@playwright/test";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const staticDir = join(__dirname, "..", "static");

const sha256 = (buf: Buffer) => createHash("sha256").update(buf).digest("hex");

// Favicon links rendered into <head>: from PaperMod's head.html plus the
// SVG icon added by layouts/partials/extend_head.html. `file` is the source
// asset in static/ that Hugo copies verbatim — the served bytes must match it.
const icons = [
  { selector: 'link[rel="icon"][type="image/svg+xml"]', href: "/icon.svg", file: "icon.svg", type: "image/svg+xml" },
  { selector: 'link[rel="icon"]:not([type="image/svg+xml"]):not([sizes])', href: "/favicon.ico", file: "favicon.ico", type: "image/" },
  { selector: 'link[rel="icon"][sizes="16x16"]', href: "/favicon-16x16.png", file: "favicon-16x16.png", type: "image/png" },
  { selector: 'link[rel="icon"][sizes="32x32"]', href: "/favicon-32x32.png", file: "favicon-32x32.png", type: "image/png" },
  { selector: 'link[rel="apple-touch-icon"]', href: "/apple-touch-icon.png", file: "apple-touch-icon.png", type: "image/png" },
  { selector: 'link[rel="mask-icon"]', href: "/safari-pinned-tab.svg", file: "safari-pinned-tab.svg", type: "image/svg+xml" },
];

test.describe("favicons", () => {
  for (const { selector, href, file, type } of icons) {
    test(`<link> for ${href} is present and serves the source file`, async ({ page }) => {
      await page.goto("/");

      const link = page.locator(selector);
      await expect(link, `expected a <link> matching ${selector}`).toHaveCount(1);

      const linkHref = await link.getAttribute("href");
      expect(linkHref, `href for ${selector}`).toBeTruthy();
      // href is rendered with absURL, so assert it ends with the expected path.
      expect(linkHref!).toContain(href);

      const response = await page.request.get(linkHref!);
      expect(
        response.ok(),
        `${href} returned ${response.status()}`
      ).toBe(true);
      expect(
        response.headers()["content-type"],
        `content-type for ${href}`
      ).toContain(type);

      // No drift: the bytes served must equal the committed source asset.
      // Hugo copies static/ verbatim, so this is byte-for-byte.
      const served = await response.body();
      const source = readFileSync(join(staticDir, file));
      expect(
        sha256(served),
        `served ${href} (${served.length}B) differs from static/${file} (${source.length}B)`
      ).toBe(sha256(source));
    });
  }
});
