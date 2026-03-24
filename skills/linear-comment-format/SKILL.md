---
name: linear-comment-format
description: >
  Standardised Linear comment format used by all agents. Auto-activates whenever
  any agent posts a completion comment or status update to a Linear issue. Ensures
  consistent, parseable audit trails.
---

# Linear Comment Format

Every agent comment follows the same format. This makes the comment thread
machine-readable for the Retrospective Agent and human-readable for the team.

## Standard Format

```
[AgentName] [Status summary — one line]
  Key: value | Key: value | Key: value
  
  [Detail lines, 2-space indent]
  [Each distinct piece of information on its own line]
```

## The First Line Rule

The first line must contain:
1. `[AgentName]` — the exact agent name in square brackets
2. A status summary — one line, past tense, describes what was done or decided

Good: `[Backend Worker] OTP-102 Done`
Good: `[PRD Reviewer] APPROVED — 0 BLOCKERs`
Good: `[Orchestrator] Gate 3 passed | Status → Developing`
Bad: `Backend Worker has completed the implementation task`
Bad: `Done with the work`

## Status Transitions in Comments

When the Orchestrator changes a status, it must always post:
```
[Orchestrator] Gate [N] [passed / BLOCKED]
  [reason if blocked]
  Status → [new status]
```

## Finding Comments

For agents that issue findings (PRD Reviewer, Architecture Reviewer, Code Review, Security Review):
```
[AgentName] [APPROVED / CHANGES REQUESTED / BLOCKER FOUND]
  [FindingType]s: [N] | [FindingType]s: [N]

[FINDING-TYPE-N] [location if applicable]: [specific issue]
  [detail]
```

## Completion Indicators

Approved: post `APPROVED` in first line
Blocked: post `BLOCKED` or `NEEDS DECISION` in first line
Done: post `Done` in first line
Halted: post `HALTED` in first line

## Rules

- Never post a comment that does not start with `[AgentName]`
- Never combine multiple phase completions into one comment
- Keep the first line under 100 characters
- Use `|` to separate key-value pairs on a single line
- Use new lines (2-space indent) for list items and extended detail
