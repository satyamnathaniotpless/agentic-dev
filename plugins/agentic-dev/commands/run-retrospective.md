---
description: Run the sprint retrospective to analyse pipeline quality and propose improvements
---

# Run Sprint Retrospective

Analyse the last sprint's pipeline runs and propose evidence-backed improvements.

Analysis window: **$ARGUMENTS** (e.g. "last 2 weeks" or "2026-03-01 to 2026-03-14")

1. Query Linear for all agent-generated issues updated in the analysis window
2. Extract signals from comment threads:
   - Gate failure events (gate N BLOCKED comments)
   - Escalation events (needs-pm applications and resolutions)
   - Code review CRITICAL finding categories
   - Security BLOCKER events
   - QA AC failure patterns
3. Compare current period vs prior period metrics
4. For each regression with 3+ supporting issue IDs: propose a specific amendment
5. For each hypothesis with <3 data points: propose an A/B experiment
6. Create a retrospective issue in Linear and post the full report as a comment

You may ONLY propose amendments. Never apply changes without explicit human approval.
