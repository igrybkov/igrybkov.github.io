.PHONY: update-theme watch watch-published build serve test test-visual test-update-screenshots test-install

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
