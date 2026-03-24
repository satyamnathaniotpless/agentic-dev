---
description: Validate a Feature Spec or Task Spec for completeness and correctness
---

# Validate Specification

Validate the specification for: **$ARGUMENTS**

If this is a Linear issue ID — validate the Feature Spec in the issue description:
- Check all 7 sections are present and complete
- Validate every AC: observable outcome, singular Then clause, no subjective language
- Check the API Contract has all status codes specified
- Check the UI State Specification covers loading, empty, error, and success states
- Report BLOCKER / GAP / SUGGESTION findings

If this is a sub-issue ID — validate the Task Spec in the sub-issue description:
- Check all required fields: Target Files, Implementation Spec, Pattern References, Covers ACs, Depends On
- Verify no placeholder text remains
- Verify the Completeness Checklist has all items checked
- Report any blocking issues

Post findings as a structured Linear comment on the issue.
