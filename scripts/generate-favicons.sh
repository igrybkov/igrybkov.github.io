#!/usr/bin/env bash
#
# generate-favicons.sh — regenerate the site favicon set from the "{G}" mark.
#
# The mark is the text "{G}" (bold, slightly tightened) knocked out in white on a
# teal rounded-square tile. The glyph is rendered from SF Pro Display, then traced
# to vector paths with potrace so the shipped SVGs do NOT depend on any font being
# installed on a visitor's machine. All raster sizes are derived from those paths.
#
# Outputs (written to static/):
#   favicon.ico            16/32/48 multi-size ICO
#   favicon-16x16.png      browser tab (standard DPI)
#   favicon-32x32.png      browser tab (retina)
#   apple-touch-icon.png   180px, full-bleed square (iOS applies its own rounding)
#   icon.svg               scalable favicon (teal tile + white glyph), font-independent
#   icon-512.png           large raster (PWA / social fallback)
#   safari-pinned-tab.svg  monochrome glyph mask for Safari pinned tabs
#
# Requirements: rsvg-convert (librsvg), potrace, ImageMagick (magick), python3,
#               and the "SF Pro Display" font (macOS; download from Apple otherwise).
#
# Usage:  ./scripts/generate-favicons.sh
#
set -euo pipefail

# ---- design knobs ----------------------------------------------------------
MARK_TEXT="{G}"        # the glyph rendered on the tile
TILE_COLOR="#0F9AA6"   # teal brand color
FONT_FAMILY="SF Pro Display"
FONT_WEIGHT="bold"     # bold reads best at 16px; heavy/black close up the G counter
LETTER_SPACING="-8"    # tighten braces toward the G (units are SVG user units at 512 box)
FONT_SIZE="300"        # within the 512x512 design box
# ---------------------------------------------------------------------------

# Resolve repo root regardless of where the script is invoked from.
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEST="$ROOT/static"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

for bin in rsvg-convert potrace magick python3; do
  command -v "$bin" >/dev/null 2>&1 || { echo "error: '$bin' not found on PATH" >&2; exit 1; }
done

echo "Rendering $MARK_TEXT glyph and tracing to vector paths..."

# 1) Render the glyph alone (black on white) at high res for a clean trace.
cat > "$TMP/glyph.svg" <<EOF
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#ffffff"/>
  <text x="256" y="262" text-anchor="middle" dominant-baseline="central"
        font-family="$FONT_FAMILY" font-weight="$FONT_WEIGHT" letter-spacing="$LETTER_SPACING"
        font-size="$FONT_SIZE" fill="#000000">$MARK_TEXT</text>
</svg>
EOF
rsvg-convert -w 2048 -h 2048 "$TMP/glyph.svg" -o "$TMP/glyph.png"
magick "$TMP/glyph.png" -alpha remove -threshold 60% "$TMP/glyph.pbm"
potrace "$TMP/glyph.pbm" -s --flat -o "$TMP/trace.svg"

# 2) Compose the three SVGs (tiled favicon, full-bleed apple, monochrome mask)
#    from the traced <g> group — all font-independent from here on.
TILE_COLOR="$TILE_COLOR" TMP="$TMP" python3 - <<'PY'
import os, re
tmp  = os.environ["TMP"]
tile = os.environ["TILE_COLOR"]
g = re.search(r'<g transform.*?</g>', open(f"{tmp}/trace.svg").read(), re.S).group(0)

def svg(body):
    return ('<svg xmlns="http://www.w3.org/2000/svg" width="2048" height="2048" '
            'viewBox="0 0 2048 2048">\n' + body + '\n</svg>\n')

white = g.replace('fill="#000000"', 'fill="#ffffff"')
open(f"{tmp}/icon.svg", "w").write(
    svg(f'  <rect width="2048" height="2048" rx="448" ry="448" fill="{tile}"/>\n  ' + white))
open(f"{tmp}/icon_apple.svg", "w").write(
    svg(f'  <rect width="2048" height="2048" fill="{tile}"/>\n  ' + white))
open(f"{tmp}/safari-pinned-tab.svg", "w").write(svg("  " + g))
PY

echo "Rasterizing all sizes..."
mkdir -p "$DEST"
rsvg-convert -w 16  -h 16  "$TMP/icon.svg"       -o "$DEST/favicon-16x16.png"
rsvg-convert -w 32  -h 32  "$TMP/icon.svg"       -o "$DEST/favicon-32x32.png"
rsvg-convert -w 48  -h 48  "$TMP/icon.svg"       -o "$TMP/favicon-48.png"
rsvg-convert -w 180 -h 180 "$TMP/icon_apple.svg" -o "$DEST/apple-touch-icon.png"
rsvg-convert -w 512 -h 512 "$TMP/icon.svg"       -o "$DEST/icon-512.png"
magick "$DEST/favicon-16x16.png" "$DEST/favicon-32x32.png" "$TMP/favicon-48.png" "$DEST/favicon.ico"
cp "$TMP/icon.svg" "$TMP/safari-pinned-tab.svg" "$DEST/"

echo "Done. Wrote favicon assets to $DEST/"
ls -1 "$DEST"/favicon.ico "$DEST"/favicon-16x16.png "$DEST"/favicon-32x32.png \
      "$DEST"/apple-touch-icon.png "$DEST"/icon.svg "$DEST"/icon-512.png "$DEST"/safari-pinned-tab.svg
