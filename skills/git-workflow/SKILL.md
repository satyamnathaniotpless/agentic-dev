---
name: git-workflow
description: >
  Branch naming, commit format, and merge order conventions for all worker agents.
  Auto-activates when any worker agent creates a branch, commits, or pushes code.
---

# Git Workflow Skill

All worker agents follow the same git conventions.
These conventions are read from CLAUDE.md at startup — this skill provides the defaults
that apply when CLAUDE.md does not specify otherwise.

## Branch Naming

Format: `[type]/[TEAM-NN]-[short-description]`

Types:
- `feat/` — new feature sub-issue
- `fix/` — bug fix sub-issue
- `test/` — test-only sub-issue
- `db/` — database migration sub-issue
- `docs/` — documentation sub-issue
- `infra/` — infrastructure sub-issue

Examples:
- `feat/ENG-42-backend-block-contact-endpoints`
- `db/ENG-42-v18-blocked-contacts-migration`
- `test/ENG-42-block-contact-tests`

## Commit Format

Format: `[type]([scope]): [description]`

Types: feat, fix, test, docs, refactor, chore, db
Scope: the module or layer (e.g., auth, contacts, billing)
Description: present tense, lowercase, under 72 chars

Examples:
- `feat(contacts): add block/unblock contact endpoints`
- `db(contacts): add V18 blocked_contacts migration`
- `test(contacts): add AC-mapped tests for block contact`

## Before Committing

1. Run the linter/formatter (the post-write hook runs this automatically)
2. Run the test command for your domain
3. Verify the build passes
4. Confirm no sensitive files are staged (no .env, no secrets)

## Pushing

Push to your feature branch only. Never push to:
- main / master
- develop / staging
- Any branch you did not create for this sub-issue

The pre-execution hook blocks direct pushes to protected branches.
If it triggers, do not attempt to bypass it — post needs-pm.

## Merge Order (Lead Engineer only)

When integrating: DB → Backend → Frontend → Tests → Infrastructure → Documentation

This order reflects dependency relationships:
- DB must exist before any code that uses the schema
- Backend must exist before frontend can use the APIs
- Tests run after all implementation branches are merged
- Infrastructure and docs are independent and go last

## Conflict Resolution

On merge conflict:
1. Read both versions of the conflicted section carefully
2. Apply the correct resolution based on the Task Specs of both workers
3. If the conflict is a genuine ambiguity (both versions could be correct), post needs-pm
4. Never arbitrarily pick one side — understand the conflict first
