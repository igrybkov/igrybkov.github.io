---
title: "Docker Layer Caching Done Right"
date: 2025-02-13
description: "How to structure Dockerfiles for faster builds by leveraging layer caching effectively."
summary: "Small Dockerfile changes that cut build times dramatically — a practical guide to layer caching."
tags: ["docker", "devops", "performance"]
author: "Illia Grybkov"
draft: true
---

If your Docker builds take forever, there's a good chance your Dockerfile isn't taking advantage of layer caching. Here's a quick refresher on how to fix that.

## How layer caching works

Docker caches each layer (instruction) in your Dockerfile. If a layer hasn't changed, Docker reuses the cached version. But here's the catch: **once a layer is invalidated, all subsequent layers are rebuilt too**.

This means order matters.

## The classic mistake

```dockerfile
# Bad: copying everything first invalidates cache on ANY file change
COPY . /app
RUN npm install
RUN npm run build
```

Every time you change a single source file, `npm install` runs again. That's minutes wasted on every build.

## The fix

```dockerfile
# Good: copy dependency files first, install, then copy source
COPY package.json package-lock.json /app/
RUN npm install

COPY . /app
RUN npm run build
```

Now `npm install` only re-runs when `package.json` or `package-lock.json` actually change. Source code changes only trigger the build step.

## Multi-stage builds

For production images, combine this with multi-stage builds to keep the final image small:

```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
```

Your production image only contains the built assets and nginx — no node_modules, no source code, no build tools.

## Quick checklist

- Put rarely-changing instructions (base image, system deps) at the top
- Copy dependency manifests before source code
- Use `.dockerignore` to exclude unnecessary files
- Use `npm ci` instead of `npm install` in CI for reproducible builds
- Use multi-stage builds for smaller production images

Small changes, big impact on build times.
