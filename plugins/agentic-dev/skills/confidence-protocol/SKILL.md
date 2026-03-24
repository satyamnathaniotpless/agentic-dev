---
name: confidence-protocol
description: >
  The universal escalation protocol. Auto-activates whenever any agent's
  confidence on a specific decision drops below 70%. Ensures agents stop
  and ask rather than guess and proceed.
---

# Confidence Protocol

When your confidence on ANY specific decision drops below 70%, follow this exact protocol.
No exceptions. No partial compliance.

## The Four Steps

**Step 1 — STOP**
Do not proceed with the uncertain decision. Do not write code. Do not create sub-issues.
Do not advance to the next step in your workflow.

**Step 2 — COMMUNICATE**
Post a structured comment on the Linear issue:

```
[AgentName] NEEDS DECISION — confidence below threshold

Decision needed: [one sentence describing the specific decision]

Option A: [description]
  Consequence: [what happens downstream if A is chosen]

Option B: [description]
  Consequence: [what happens downstream if B is chosen]

[Option C if applicable]

Recommended: [your recommendation if you have one, or "no clear recommendation"]
```

**Step 3 — WAIT**
Apply the `needs-pm` label to the issue via save_issue.
Return control to the Orchestrator.
Do not continue any part of your workflow.

**Step 4 — RESUME**
Resume ONLY after a human posts a decision in the Linear comment thread.
Resume from the exact decision point — re-read all context before continuing.

## What Triggers This Protocol

- Any architectural decision with two meaningfully different implementations
- Any product decision that affects user behaviour
- Any ambiguity in the spec that has two valid interpretations
- Any external constraint (API rate limit, third-party behaviour) that is unclear
- Any situation where the correct path requires knowledge not available in the issue

## What Does NOT Trigger This Protocol

- Technical implementation details with a single correct answer
- Following an established pattern from a pattern reference file
- Choices that are purely stylistic with no functional difference
- Decisions explicitly delegated to you in your agent definition

## The Cost Comparison

False escalation: One human decision, under 30 seconds.
Incorrect assumption: Rework across all downstream agents, potentially one sprint.

The threshold is set at 70% because the costs are asymmetric by an order of magnitude.
