# grybkov.com

[![Hugo](https://img.shields.io/badge/Hugo-FF4088?logo=hugo&logoColor=white)](https://gohugo.io/)
[![Deploy](https://github.com/igrybkov/grybkov.com/actions/workflows/hugo.yml/badge.svg)](https://github.com/igrybkov/grybkov.com/actions/workflows/hugo.yml)

Source for my personal site and blog at **[grybkov.com](https://grybkov.com)**.

I write about developer experience, lessons learned the hard way, cool automations, and whatever else catches my eye in tech and beyond. Built with [Hugo](https://gohugo.io/) and the [PaperMod](https://github.com/adityatelange/hugo-PaperMod) theme.

## Running Locally

You'll need [mise](https://mise.jdx.dev/) installed — it picks up the right Hugo version automatically from `mise.toml`.

```sh
# Dev server with live reload (drafts included)
make watch

# Same thing, but only published posts
make watch-published
```

## Project Structure

```
content/        Posts and pages (Markdown)
layouts/        Template overrides on top of PaperMod
static/         Images, favicons, and other static assets
hugo.yaml       Site configuration
Makefile        Build/dev/theme commands
```

## Deployment

Every push to `main` triggers a [GitHub Actions workflow](.github/workflows/hugo.yml) that builds the site and deploys it to GitHub Pages. Nothing to do manually.

## Other Commands

```sh
make build          # Production build → ./public
make update-theme   # Pull the latest PaperMod
```

## License

Content and code in this repo are my own. The [PaperMod](https://github.com/adityatelange/hugo-PaperMod) theme is MIT-licensed.
