.PHONY: update-theme watch watch-published build

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
