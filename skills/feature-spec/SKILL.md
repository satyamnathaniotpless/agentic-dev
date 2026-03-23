---
description: >
  The 7-section Feature Spec template with validation rules for each section.
  Auto-activates when the PM Agent writes a PRD or when a user asks to write
  a feature spec, PRD, or acceptance criteria.
---

# Feature Spec (L2) Skill

The Feature Spec is the contract between planning and implementation.
Every section must be complete before the PRD Reviewer runs.

## The 7 Mandatory Sections

### Section 1: Problem Statement
- One paragraph
- User perspective only — "users cannot..." not "the system should..."
- Zero solution references
- Zero technical implementation details
- A non-technical stakeholder must understand the 'why' from this alone

### Section 2: User Stories
Format: `As a [role], I want [goal] so that [benefit].`
- Each story is independently testable
- No implementation details (no endpoint names, field names, component names)
- 1-5 stories per feature

### Section 3: Acceptance Criteria
Format:
```
AC-N (covers US-N):
  Given [precondition]
  When [action]
  Then [single observable outcome]
```
Rules:
- **One outcome per Then** — never use "and" to connect two outcomes
- **Observable**: verifiable by reading a response body, checking DB state, or observing UI
- **No subjective language**: "loads quickly", "performs well", "looks good" → BLOCKER
- **No internal references**: "the cache is invalidated", "the service calls X" → BLOCKER
- **Traceable**: every AC maps to one User Story and one named test method
- Minimum 3 ACs, maximum 8

### Section 4: Out of Scope
- Explicit list of what this feature intentionally does NOT do
- Include only things a reasonable person might expect to be in scope
- "None" is not acceptable if the feature has natural adjacencies

### Section 5: API Contract
Required for features that introduce or modify API endpoints.
```
[METHOD] [/path]
Auth: [Bearer token / public]
Rate limit: [N req/min per tenant/user/IP]

Request:
  field_name: Type (required/optional, constraints)

Response 200:
  field_name: Type — description

Response 400: { error: "ERROR_CODE", message: "...", field: "field_name|null" }
Response 401: { error: "UNAUTHORIZED" }
Response 403: { error: "FORBIDDEN" }
Response 404: { error: "NOT_FOUND_CODE" }
Response 500: { error: "INTERNAL_ERROR" }
```

### Section 6: UI State Specification
Required for features with UI components.
For EACH state (loading, empty, error, success, and feature-specific states):
```
State: [name]
Trigger: [what causes this state]
Visible: [what the user sees — be specific]
Available actions: [what the user can do]
Transitions to: [state → on what action]
```
Mandatory states: loading, empty, error, success

### Section 7: Data Model Changes
Required for features that modify the database schema.
```
Table: [name]  Operation: CREATE / ALTER
  column_name: TYPE NOT NULL / NULLABLE [DEFAULT value]
  [index name]: INDEX ON (columns) [UNIQUE]

Migration strategy: additive / with-data-migration / destructive + [justification]
Rollback: [reverse SQL or steps]
```

## Complete Template

```markdown
# Feature Spec: [Feature Name]
**Linear Issue:** [TEAM-NN]  
**Version:** 1.0  
**Status:** Draft

## 1. Problem Statement
[One paragraph. User perspective. No solutions.]

## 2. User Stories
- US-1: As a [role], I want [goal] so that [benefit].

## 3. Acceptance Criteria
**AC-1** (covers US-1):
  Given [precondition]
  When [action]
  Then [single observable outcome]

## 4. Out of Scope
- [Item]: [reason it is excluded]

## 5. API Contract
[METHOD] [/path]
Auth: [type] | Rate limit: [N req/min]

Request: { field: Type (required) }
Response 200: { field: Type }
Response 400: { error: "CODE", message: "...", field: null }
Response 401: { error: "UNAUTHORIZED" }
Response 404: { error: "NOT_FOUND" }

## 6. UI State Specification
**Loading**: [what user sees]
**Empty**: [what user sees + available actions]
**Error**: [error message text + recovery action]
**Success**: [what user sees]

## 7. Data Model Changes
Table: [name] — [CREATE/ALTER]
  [column]: [TYPE] [constraints]
  [index]: INDEX ON ([cols])
Migration: additive
Rollback: [steps]
```
