---
description: Decompose a Linear issue into Task Spec sub-issues ready for implementation
---

# Decompose Issue

Decompose the Linear issue **$ARGUMENTS** into implementation-ready Task Spec sub-issues.

1. Read the Feature Spec in the issue description
2. Read the Architecture Review findings in the comments
3. Read the research briefs (Codebase Researcher, Requirements Researcher) in the comments
4. Create one sub-issue per worker domain needed: Backend, Frontend, DB, Tests, Infrastructure, Docs
5. Each sub-issue description must be a complete Task Spec with:
   - Target files (exact paths), method signatures, validation rules, error cases,
     AC coverage mapping, pattern references, and dependencies
6. Run the AC coverage check: union of all sub-issue ACs must equal the Feature Spec AC set
7. Post a completion comment listing all sub-issues and the AC coverage map

Do not create sub-issues until the AC coverage check passes.
