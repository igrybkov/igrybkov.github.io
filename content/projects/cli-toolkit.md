---
title: "CLI Toolkit"
date: 2024-11-20
description: "A collection of Go CLI tools for everyday dev workflows"
summary: "A set of small, fast CLI tools written in Go for automating repetitive dev tasks — log parsing, JSON wrangling, and bulk file operations."
tags: ["golang", "cli", "developer-tools"]
author: "Illia Grybkov"
draft: true
---

## What It Does

A growing collection of small CLI utilities that solve annoyances I kept running into:

- **logfmt** — Parse and filter structured logs
- **jqx** — Interactive JSON explorer for the terminal
- **bulkr** — Batch rename/move files with regex patterns

## Why Go?

Single binary, no runtime dependencies, cross-compiles easily. Perfect for tools that need to just work everywhere.
