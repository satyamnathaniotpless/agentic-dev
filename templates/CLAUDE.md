# CLAUDE.md — Project Constitution
# Copy this file to your project root and fill in every section.
# Every agent reads this file at startup. Incomplete sections cause inconsistency.

Version: 1.0.0
Updated: [date]

## Tech Stack
# Replace these placeholders with exact versions.
Backend:  [language + framework + version, e.g. Java 21 + Spring Boot 3.3.5]
Frontend: [framework + version, e.g. React 18 + TypeScript 5.x]
Database: [database + migration tool, e.g. PostgreSQL 15 + Flyway 10]
Testing:  [backend: e.g. JUnit 5 + Mockito] + [frontend: e.g. Vitest + Testing Library]
Infra:    [cloud + container + CI/CD, e.g. AWS EKS + Docker + GitHub Actions]

## Non-Negotiable Rules
# These rules produce a CRITICAL finding in Code Review if violated.
1. No raw SQL — use the ORM or query builder
2. No untyped variables — enforce strict typing
3. Minimum 80% test coverage on all new and modified code
4. No secrets in source code — environment variables only
5. Every public method has error handling — no silent catch blocks
6. Every API endpoint has an authorization check
7. All user input is validated before use
[Add your domain-specific rules below this line]

## Performance Budget
# Code Review Agent and Performance Test Agent enforce these.
Authenticated endpoints:  p95 < 200ms
Public endpoints:         p95 < 100ms
Background jobs:          no budget (async)

## Confidence Protocol
Threshold: 70%
If confidence on any decision drops below 70%:
  1. STOP — do not proceed
  2. Post a needs-pm comment with specific options and consequences
  3. Apply the needs-pm label
  4. Wait for a human response
  5. Resume only after a human posts a decision

## Issue Tracker (Linear)
Team name: [your team name]
Team key:  [your team key, e.g. ENG]
MCP URL:   https://mcp.linear.app/mcp

Status workflow (exact names, in order):
  Triage → Planning → Developing → In Progress → In Review → In Testing → Done

Only the Orchestrator changes issue status. No other agent may call save_issue(state: ...).

Sub-issue naming: [TEAM-NN] [Layer]: [description]
Layers: Backend | Frontend | DB | Tests | Infrastructure | Docs

Label taxonomy:
  Signal:    agent-generated, needs-pm, spec-incomplete
  Phase:     prd-approved, architecture-review, security-reviewed, performance-reviewed
             deployed-staging, deployed-production, incident, retrospective
  Work type: backend, frontend, db, tests, infrastructure, docs
  Type:      Feature, Bug, Maintenance

## Projects
# Map keywords to Linear projects so the Orchestrator assigns issues correctly.
# Format: "keywords" → "Project Name"
[auth, login, security, permission] → [Your Auth Project]
[billing, payment, invoice]         → [Your Billing Project]
[all others]                        → [Default Project]

## Git Conventions
Branch format:   [type]/[TEAM-NN]-[short-description]
Commit format:   [type]([scope]): [description]
Types:           feat | fix | test | docs | refactor | chore | db | infra
Protected:       main | master | production | staging

## Codebase Map
# Agents use this to navigate the project. Be precise about paths.
Backend services:  [path, e.g. src/main/java/com/company/]
Frontend app:      [path, e.g. src/frontend/]
Database:          [path, e.g. src/main/resources/db/migration/]
Tests:             [path, e.g. src/test/]
Infrastructure:    [path, e.g. infra/]
Documentation:     [path, e.g. docs/]
