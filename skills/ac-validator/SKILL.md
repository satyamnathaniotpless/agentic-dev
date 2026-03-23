---
description: >
  Validates that acceptance criteria meet the testability standard.
  Auto-activates when PM Agent writes ACs, when PRD Reviewer reviews ACs,
  and when QA Agent validates test assertions against ACs.
---

# AC Validator Skill

Every acceptance criterion must pass all four checks before it can advance.

## The Four Checks

### Check 1: Observable Outcome
The Then clause must describe something verifiable without interpretation.

PASS examples:
- "Then the response body contains { blocked: true, contactId: '...' }"
- "Then the contact card displays a 'Blocked' badge"
- "Then no new conversation entry appears in the agent inbox"
- "Then the database has exactly one row in blocked_contacts for this (phoneNumberId, contactId) pair"

FAIL examples (→ BLOCKER):
- "Then the feature works correctly" — not observable
- "Then the user experience is improved" — subjective
- "Then the system handles the error" — vague
- "Then performance is acceptable" — not measurable
- "Then the cache is invalidated" — internal implementation detail

### Check 2: Singular Outcome
The Then clause must have exactly one outcome.

PASS: "Then the response status is 200 and the body contains the blocked contact"
Wait — this has two outcomes. Split it:
- AC-1: Then the response status is 200
- AC-2: Then the response body contains { blocked: true, contactId: '...' }

FAIL: "Then the contact is blocked and the UI shows a badge and the inbound message is rejected"
(Three outcomes — must be three separate ACs)

### Check 3: No Implementation References
The Then clause must not reference implementation details.

FAIL examples (→ BLOCKER):
- "Then the BlockContactService.blockContact() method is called"
- "Then the blocked_contacts row is inserted via the repository"
- "Then the React state updates to { isBlocked: true }"
- "Then the cache key is invalidated in Redis"

These are HOW the feature works, not WHAT it does. Tests should validate behaviour, not implementation.

### Check 4: No Subjective Language
FAIL keywords that always trigger BLOCKER: quickly, fast, slow, good, bad, better, improved,
acceptable, reasonable, appropriate, correctly, properly, efficiently, seamlessly.

Replace with measurable terms: "within 500ms", "in under 3 seconds", "returns 200".

## Validation Output

For each AC, output:
```
AC-N: PASS / FAIL
  [If FAIL]: Check [N] failed: [specific issue]
  Suggested fix: [rewritten AC that would pass]
```

## AC Coverage Check

The union of ACs across all Task Specs must equal the full AC set in the Feature Spec.

Given Feature Spec ACs: AC-1, AC-2, AC-3, AC-4, AC-5
Sub-issue Task Specs reference: AC-1, AC-2, AC-3, AC-5

Result: AC-4 is uncovered → Gate 4 FAILS.

Run this check before finalising decomposition.
