# grybkov.com

Personal website and blog — [grybkov.com](https://grybkov.com)

Built with [Hugo](https://gohugo.io/) and the [PaperMod](https://github.com/adityatelange/hugo-PaperMod) theme, deployed to GitHub Pages.

## Prerequisites

- [mise](https://mise.jdx.dev/) — manages the Hugo version automatically via `mise.toml`

## Local Development

Start a dev server with live reload (includes drafts):

```sh
make watch
```

To preview only published posts:

```sh
make watch-published
```

## Build

```sh
make build
```

Output goes to `./public`.

## Deploy

Pushing to the `main` branch triggers the GitHub Actions workflow (`.github/workflows/hugo.yml`) which builds the site and deploys it to GitHub Pages.

## Update Theme

```sh
make update-theme
```
