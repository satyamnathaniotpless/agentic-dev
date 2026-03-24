# Task Spec: [TEAM-NN] [Layer]: [Description]

**Parent:** [TEAM-NN]
**Worker:** Backend | Frontend | DB | Tests | Infrastructure | Docs
**Covers ACs:** AC-1, AC-2
**Depends on:** [sub-issue ID] | none

## Target Files
CREATE: path/to/NewFile.ext
MODIFY: path/to/ExistingFile.ext  [what changes]

## Implementation Spec

### MethodOrComponentName(params): ReturnType

**Validation:**
  - param: @NotNull, max 255 chars

**Happy path:**
  [2-3 sentence description of correct execution]

**Error cases:**
  - [condition] → XxxException (HTTP 404, code: "NOT_FOUND")
  - [condition] → XxxException (HTTP 400, code: "VALIDATION_ERROR")

## Pattern References
Read before implementing: path/to/PatternFile.ext
Follow specifically: ClassName.methodName

## Completeness Checklist
- [ ] All target paths verified as real files
- [ ] All signatures/props complete — no vague descriptions
- [ ] All error cases specified
- [ ] All ACs mapped
- [ ] Pattern references verified as real files
- [ ] Dependencies correctly sequenced
