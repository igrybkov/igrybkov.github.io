---
title: "Home Lab"
date: 2025-01-15
description: "Self-hosted infrastructure running on a Proxmox cluster"
summary: "A Proxmox-based home lab running Pi-hole, Gitea, media servers, and monitoring — all managed with Ansible."
tags: ["homelab", "infrastructure", "ansible"]
author: "Illia Grybkov"
draft: true
---

## Overview

My home lab setup running on a small Proxmox cluster. Everything is provisioned with Ansible and version-controlled.

## Stack

- **Proxmox VE** — Hypervisor
- **Pi-hole** — DNS & ad blocking
- **Gitea** — Self-hosted Git
- **Grafana + Prometheus** — Monitoring
- **Traefik** — Reverse proxy with automatic TLS

## Lessons Learned

The biggest takeaway: treat your home lab like production. IaC from day one saves hours of debugging later.
