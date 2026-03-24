# Feature Spec: [Feature Name]
**Linear Issue:** [TEAM-NN]
**Version:** 1.0
**Status:** Draft

## 1. Problem Statement
[One paragraph. User perspective only. No solution references. No technical details.]

## 2. User Stories
- US-1: As a [role], I want [goal] so that [benefit].

## 3. Acceptance Criteria

**AC-1** (covers US-1):
  Given [precondition]
  When [action]
  Then [single observable outcome — no "and", no subjective language]

## 4. Out of Scope
- [Explicitly excluded item]: [reason]

## 5. API Contract
[METHOD] [/path]
Auth: [Bearer / public] | Rate limit: [N req/min]

Request:
  field: Type (required/optional, constraints)

Response 200: { field: Type }
Response 400: { error: "CODE", message: "...", field: "name|null" }
Response 401: { error: "UNAUTHORIZED" }
Response 404: { error: "NOT_FOUND" }

## 6. UI State Specification

**Loading:** [what user sees]
**Empty:** [what user sees + available actions]
**Error:** [exact error message text + recovery action]
**Success:** [what user sees]

## 7. Data Model Changes
Table: [name]  Operation: CREATE / ALTER
  column: TYPE NOT NULL
  index: INDEX ON (column)
Migration: additive
Rollback: [reverse SQL]
