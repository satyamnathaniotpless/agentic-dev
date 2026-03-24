---
description: Run a full code + security review on a pull request
---

# Review Pull Request

Run a complete code and security review on: **$ARGUMENTS**

Perform both reviews in parallel:

**Code Review** — Read every changed file in full (not just the diff):
- Check all CLAUDE.md non-negotiable rules
- Verify authorisation on all new endpoints
- Check input validation on all user-controlled fields
- Verify spec-code sync: implementation matches the linked Feature Spec
- Issue CRITICAL (blocks merge) / WARNING / SUGGESTION findings

**Security Review** — Focus exclusively on security surface area:
- Authentication bypass paths
- Authorisation logic errors
- Injection vulnerabilities
- Data leakage in error responses
- Rate limiting on sensitive operations
- Issue BLOCKER / WARNING / NOTED findings

Post a structured comment with all findings. CRITICAL and BLOCKER findings must be fixed before merge.
