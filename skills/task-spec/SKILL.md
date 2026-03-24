---
name: task-spec
description: >
  The Task Spec template for sub-issues. Auto-activates when the Lead Engineer
  creates sub-issues or when any agent reviews a Task Spec for completeness.
---

# Task Spec (L3) Skill

The Task Spec is the complete implementation contract for a worker agent.
A worker must be able to implement their sub-issue without asking any questions.
If they have a question, the Task Spec is incomplete.

## Required Fields — All Mandatory

### 1. Target Files
Every file the worker will touch.
```
CREATE: exact/path/to/NewFile.ext
MODIFY: exact/path/to/ExistingFile.ext  [reason: what changes]
```
- Paths must be exact and real — verify before including
- Do not use wildcards or directory names

### 2. Implementation Spec
For backend: every method that will be created or modified.
```
MethodName(ParamType param, ParamType param2): ReturnType
  Validation:
    param: @NotNull | max 255 chars | must belong to current tenant
  Happy path:
    [2-3 sentence description of correct execution flow]
  Error cases:
    [condition] → throw XxxException (HTTP 404, code: "NOT_FOUND_CODE")
    [condition] → throw XxxException (HTTP 400, code: "VALIDATION_ERROR")
    [condition] → throw ExternalApiException (HTTP 502, retryable: true)
```

For frontend: every component/hook that will be created or modified.
```
ComponentName({ prop: PropType, prop2: PropType2 }): ReactNode
  States: [list states component handles]
  Props: prop — [description, required/optional]
  Behaviour: [description of what it renders and how it responds to interaction]
```

### 3. Pattern References
2-3 files that exemplify exactly the pattern the worker should follow.
```
Read before implementing: exact/path/to/PatternFile.ext
Specifically follow: ClassName.methodName for [aspect]
```
- These must be real files that exist in the repository
- Be specific about WHAT to follow from each file

### 4. Covers ACs
```
Covers: AC-1, AC-3
```
Every AC number this sub-issue is responsible for implementing.

### 5. Depends On
```
Depends on: [TEAM-NN] (DB sub-issue — must be Done first)
```
Or: `Depends on: none`

## Completeness Checklist

Before creating the sub-issue, verify:
- [ ] All target file paths are real (checked against actual repository)
- [ ] All method signatures are complete (no "etc." or "similar to X")
- [ ] All error cases are specified (every failure path named)
- [ ] All validation rules are explicit (no "validate the input")
- [ ] All AC numbers are listed
- [ ] Pattern references resolve to real files
- [ ] Dependencies are correctly sequenced

## Complete Template

```markdown
# Task Spec: [TEAM-NN] [Layer]: [Description]

**Parent:** [TEAM-NN]  
**Worker:** Backend | Frontend | DB | Tests | Infrastructure | Docs  
**Covers ACs:** AC-1, AC-2  
**Depends on:** [TEAM-NN] | none

## Target Files
CREATE: path/to/NewFile.ext
MODIFY: path/to/ExistingFile.ext  [what changes]

## Implementation Spec

### MethodOrComponentName(params): ReturnType
**Validation:**
  - field: @NotNull, max 255 chars

**Happy path:**
  [Description]

**Error cases:**
  - [condition] → XxxException (HTTP 404, code: "NOT_FOUND")
  - [condition] → XxxException (HTTP 400, code: "ALREADY_EXISTS")

## Pattern References
Read before implementing: path/to/PatternFile.ext
Follow specifically: ClassName.methodName

## Completeness Checklist
- [ ] All target paths verified as real
- [ ] All signatures complete
- [ ] All error cases specified
- [ ] All ACs mapped
- [ ] Pattern references verified
```
