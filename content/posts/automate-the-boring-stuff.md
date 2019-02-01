---
title: "Automate the Boring Stuff (For Real)"
date: 2025-02-10
description: "Practical automation tips for software engineers who want to spend less time on repetitive tasks."
summary: "Three patterns I use to eliminate repetitive work — and when automation isn't worth it."
tags: ["automation", "productivity", "engineering"]
author: "Illia Grybkov"
draft: true
---

Every engineer has that one task they do over and over. The deploy script you run manually. The log file you grep through every morning. The Jira ticket you update after every PR merge.

Here are three patterns I keep coming back to when automating repetitive work.

## 1. Git hooks for consistency

Pre-commit hooks are underrated. A simple hook that runs linting and formatting saves more time than you'd think — not from the check itself, but from avoiding the "fix lint" follow-up commits.

```bash
#!/bin/sh
# .git/hooks/pre-commit
npm run lint --quiet
if [ $? -ne 0 ]; then
  echo "Lint failed. Fix errors before committing."
  exit 1
fi
```

## 2. Makefile as documentation

I use `Makefile` targets as a living index of project commands. New team members don't need to hunt through READMEs — they just run `make help`.

```makefile
.PHONY: help
help: ## Show available commands
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

.PHONY: dev
dev: ## Start development server
	hugo server -D

.PHONY: build
build: ## Build for production
	hugo --minify
```

## 3. Shell aliases with guardrails

Aliases are great, but dangerous without guardrails. I wrap destructive commands with confirmation prompts:

```bash
alias gpf='echo "Force pushing to $(git branch --show-current). Continue? [y/N]" && read ans && [ "$ans" = "y" ] && git push --force-with-lease'
```

`--force-with-lease` instead of `--force` is a small thing, but it's saved me more than once.

## When not to automate

Not everything is worth automating. My rule of thumb: if you'll do it fewer than five times, just do it manually. The time spent writing, testing, and maintaining automation has a cost too.

The best automation is the kind you set up once and forget about.
