---
description: Run the full agentic development pipeline on a Linear issue
---

# Run Agentic Pipeline

Run the full agentic development pipeline on the Linear issue: **$ARGUMENTS**

1. Read CLAUDE.md from the project root — halt with instructions if it does not exist
2. Classify the issue as Feature, Bug, or Maintenance by reading its description and labels
3. Select the appropriate pipeline:
   - Feature → full 7-phase pipeline (Business Analysis → Discovery → Design → Decomposition → Implementation → Validation → Release)
   - Bug / Maintenance → abbreviated pipeline (Decomposition → Implementation → Validation → Release)
4. Spawn the Orchestrator agent to manage all phases and gate transitions

Post your first Linear comment immediately to confirm the pipeline has started.
