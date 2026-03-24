---
name: codebase-patterns
description: >
  Ensures agents read existing code before writing new code, follow established
  patterns, and do not create inconsistencies. Auto-activates when any worker
  agent begins implementation or when the Codebase Researcher maps impact.
---

# Codebase Patterns Skill

Read before you write. The most common cause of inconsistency in agent-generated code
is an agent that implemented from the spec without reading the existing codebase.

## Mandatory Pattern Reading

Before writing any code, read the pattern reference files in your Task Spec.
Read them completely — not just the method you are copying.

When reading, note:
1. **Naming conventions**: class names, method names, variable names, constant names
2. **Annotation style**: how annotations are ordered, which are required
3. **Error handling pattern**: how exceptions are created, named, and thrown
4. **Import organisation**: how imports are ordered and grouped
5. **Test structure**: how test classes are named, how mocks are set up, how assertions are written

## The Mirror Test

After writing your code, do the mirror test:
Place your new file and the pattern reference file side by side (mentally).
- Do they use the same naming style?
- Do they use the same annotation style?
- Do they handle errors the same way?
- Would a reviewer who knows the codebase recognise your file as belonging to this project?

If the answer to any question is "no", align your code with the pattern before committing.

## What "Follow the Pattern" Means

"Follow the pattern" does NOT mean copy the logic.
"Follow the pattern" DOES mean:
- Use the same class structure and constructor injection approach
- Use the same annotation ordering
- Use the same error envelope format
- Use the same test class naming convention (XxxTest vs XxxSpec vs TestXxx)
- Use the same mock framework and setup style

## Pattern Reference Files

If your Task Spec lists pattern references, they were chosen deliberately.
Do not substitute different files.
If a pattern reference does not exist, post needs-pm — do not invent an alternative.

## New Patterns

If your Task Spec creates a new pattern (a type of file that does not exist yet),
you may not have a pattern reference. In that case:
1. Check if a similar type of file exists in a different module
2. If yes, follow it
3. If no, note in your completion comment that this is a new pattern
   and flag it for the Architecture Reviewer to evaluate
