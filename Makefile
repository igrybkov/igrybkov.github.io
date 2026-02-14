PLAYWRIGHT_VERSION := $(shell node -e "console.log(require('@playwright/test/package.json').version)" 2>/dev/null || echo "1.58.2")
HUGO_VERSION := $(shell mise exec -- hugo version 2>/dev/null | grep -oE 'v[0-9]+\.[0-9]+\.[0-9]+' | head -1 | sed 's/^v//' || echo "0.155.3")
HUGO_ARCH := $(if $(filter arm64 aarch64,$(shell uname -m)),arm64,amd64)

.PHONY: update-theme watch watch-published build serve test test-visual test-update-screenshots test-update-screenshots-linux test-install

## Install/update PaperMod Hugo theme
update-theme:
	rm -rf themes/PaperMod && mkdir -p themes/PaperMod
	curl -sL https://github.com/adityatelange/hugo-PaperMod/archive/refs/heads/master.zip | bsdtar -xf - --strip-components=1 -C themes/PaperMod

## Start Hugo dev server with live reload
watch:
	mise exec -- hugo server --disableFastRender --watch --openBrowser --buildDrafts

## Start Hugo dev server showing only published posts
watch-published:
	mise exec -- hugo server --disableFastRender --watch --openBrowser

## Build the site for production
build:
	mise exec -- hugo --gc --minify $(HUGO_ARGS)

## Start Hugo server for tests (headless, no browser)
serve:
	mise exec -- hugo server --disableFastRender --buildDrafts --port 1313

## Run all Playwright tests
test:
	npm test

## Run visual regression tests only
test-visual:
	npm run test:visual

## Regenerate screenshot baselines
test-update-screenshots:
	npm run test:update

## Install test dependencies and Chromium
test-install:
	npm install
	npx playwright install chromium

## Regenerate Linux screenshot baselines via Docker (for CI)
test-update-screenshots-linux:
	docker run --rm -v "$(PWD):/work" -w /work \
		mcr.microsoft.com/playwright:v$(PLAYWRIGHT_VERSION)-noble \
		bash -c '\
			curl -sL "https://github.com/gohugoio/hugo/releases/download/v$(HUGO_VERSION)/hugo_extended_$(HUGO_VERSION)_linux-$(HUGO_ARCH).tar.gz" \
				| tar xz -C /usr/local/bin hugo \
			&& npm ci \
			&& PW_SERVER_CMD="hugo server --disableFastRender --buildDrafts --port 1313" \
				npx playwright test tests/visual.spec.ts --update-snapshots'
