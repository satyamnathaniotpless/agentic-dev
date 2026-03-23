# agentic-dev — Claude Code Plugin

A complete autonomous product development pipeline as a Claude Code plugin.
Install once. Every project gets 31 specialized agents that mirror your existing
team lifecycle — from business analysis through production deployment — with
review gates at every step and Linear as the backbone.

---

## What This Does

When you drop a Linear issue ID into Claude Code and say "run the pipeline",
this plugin kicks off a 7-phase autonomous development process:

```
1. Business Analysis   → Business Analyst + Stakeholder Clarifier + Feasibility Assessor
2. Discovery           → 5 Research Agents running in parallel
3. Design & Planning   → PM Agent + PRD Reviewer + Architecture Reviewer
4. Decomposition       → Lead Engineer + Database Architect + API Contract Agent
5. Implementation      → 6 parallel Workers in isolated git worktrees
6. Validation          → Code Review + Security Review + QA + Performance Test
7. Release & Ops       → Release Manager + Deployment + Smoke Test + Rollback
```

Every phase posts structured comments to Linear. The comment thread of a single
issue is the complete audit trail from business requirement to deployed feature.

---

## Prerequisites

Before installing, set up the foundations:

**1. Create CLAUDE.md in your project root**
```bash
cp .claude-plugin/  # after installing, find the template at:
# [plugin root]/templates/CLAUDE.md
# Copy it to your project root and fill in every section.
```

**2. Configure Linear completely**
- Create your team with a short key (e.g. ENG, ACME)
- Confirm status names: Triage, Planning, Developing, In Progress, In Review, In Testing, Done
- Create all required labels (see Label Taxonomy below)
- Add the Linear MCP server to your project's `.mcp.json`:
```json
{
  "mcpServers": {
    "linear": {
      "url": "https://mcp.linear.app/mcp"
    }
  }
}
```

**3. Verify git worktrees work**
```bash
git worktree add ../test-worktree HEAD
git worktree remove ../test-worktree
```

---

## Installation

### Install to project (shared with team via .claude/settings.json)
```bash
claude plugin install agentic-dev@your-org --scope project
```

### Install from GitHub
```bash
# In Claude Code, type /plugins then add:
https://github.com/your-org/agentic-dev
```

### Install globally (all your projects)
```bash
claude plugin install agentic-dev@your-org --scope user
```

---

## Usage

### Run the full pipeline on a Linear issue
```
Run the agentic pipeline on ENG-42
```

### Run a specific phase only
```
Run business analysis on ENG-42
Write the feature spec for ENG-42
Review the PRD for ENG-42
Decompose ENG-42 into sub-issues
Run code review on PR #14
Run the retrospective for the last sprint
```

### Use individual agents directly
```
Run the security review on PR #22
Run QA validation on ENG-42
Check AC coverage for ENG-42
Scaffold a feature spec for a user authentication feature
```

---

## Plugin Structure

```
agentic-dev/
├── .claude-plugin/
│   └── plugin.json              ← Plugin manifest
│
├── agents/                      ← 31 specialized agent definitions
│   ├── orchestrator.md          ← Controls the entire pipeline
│   ├── business-analyst.md
│   ├── stakeholder-clarifier.md
│   ├── feasibility-assessor.md
│   ├── requirements-researcher.md
│   ├── codebase-researcher.md
│   ├── external-api-researcher.md
│   ├── pm-agent.md
│   ├── prd-reviewer.md
│   ├── architecture-reviewer.md
│   ├── lead-engineer-decompose.md
│   ├── backend-worker.md
│   ├── frontend-worker.md
│   ├── database-worker.md
│   ├── test-worker.md
│   ├── lead-engineer-integrate.md
│   ├── code-review-agent.md
│   ├── security-review-agent.md
│   ├── qa-agent.md
│   └── retrospective-agent.md
│
├── skills/                      ← Reusable competency modules
│   ├── confidence-protocol/     ← Universal 70% threshold + escalation steps
│   ├── feature-spec/            ← 7-section Feature Spec template + validation
│   ├── task-spec/               ← Task Spec template + completeness checklist
│   ├── ac-validator/            ← AC testability rules + coverage union check
│   ├── codebase-patterns/       ← Read-before-write discipline
│   ├── git-workflow/            ← Branch naming, commit format, merge order
│   └── linear-comment-format/  ← Standardised audit trail comments
│
├── hooks/
│   ├── hooks.json               ← Pre-execute (security) + post-write (format)
│   └── scripts/
│       ├── security-gate.sh     ← Blocks force pushes, DROP SQL, env file writes
│       └── auto-format.sh       ← Runs Prettier/ESLint/Black/gofmt after writes
│
├── server/
│   └── index.js                 ← MCP server: spec validation + AC coverage tools
│
├── .mcp.json                    ← Registers the MCP server
│
└── templates/
    ├── CLAUDE.md                ← Constitution template — copy to project root
    ├── FEATURE_SPEC.md          ← L2 Feature Spec template
    └── TASK_SPEC.md             ← L3 Task Spec template
```

---

## The 12 Pipeline Gates

Every phase transition is a gate. The Orchestrator evaluates it.
No gate can be bypassed. No override exists.

| Gate | Transition | Block Action |
|------|-----------|-------------|
| 0 | Business Analysis → Discovery | needs-pm if blocking questions |
| 1 | Discovery → Design | Halt if feasibility BLOCKED |
| 2 | Research complete | Re-run failing research agent |
| 3 | Design → Decomposition | Loop PM/Architecture until zero blockers |
| 4 | Decompose → Implement | Lead Engineer revises incomplete specs |
| 5 | DB Worker → Parallel start | DB Worker re-runs |
| 6 | Implement → Integrate | Return sub-issue to failing worker |
| 7 | Integrate → Validate | Lead Engineer fixes PR |
| 8 | Code+Security → QA | Worker fixes CRITICAL/BLOCKER findings |
| 9 | QA → Release | Bug sub-issues created; back to In Progress |
| 10 | Performance (if triggered) | Worker optimises |
| 11 | Release → Deploy | Release Manager holds |
| 12 | Deploy → Done | Rollback Agent if smoke tests fail |

---

## Label Taxonomy

Create ALL of these in Linear before running the pipeline:

**Signal labels** (control pipeline flow)
- `agent-generated` — every issue/sub-issue created by the pipeline
- `needs-pm` — confidence protocol trigger; halts pipeline
- `spec-incomplete` — PRD returned for revision

**Phase labels** (track quality gates)
- `prd-approved` — Feature Spec has zero BLOCKERs
- `architecture-review` — architectural guidance provided
- `security-reviewed` — security review APPROVED
- `performance-reviewed` — load testing completed
- `deployed-staging` — staging deploy succeeded
- `deployed-production` — production deploy succeeded
- `incident` — deployment was rolled back
- `retrospective` — retrospective analysis issue

**Work-type labels** (sub-issue routing)
- `backend`, `frontend`, `db`, `tests`, `infrastructure`, `docs`

**Issue-type labels** (pipeline selection)
- `Feature` — full 7-phase pipeline
- `Bug` — abbreviated pipeline (skip Phases 1–3)
- `Maintenance` — abbreviated pipeline (skip Phases 1–3)

---

## MCP Tools (agentic-dev-tools server)

The plugin exposes 6 tools agents call during the pipeline:

| Tool | Used By | What It Does |
|------|---------|-------------|
| `validate_feature_spec` | PRD Reviewer | Checks all 7 sections, finds TBDs, validates AC language |
| `check_ac_coverage` | Orchestrator (Gate 4) | Verifies AC union across all Task Specs |
| `scaffold_feature_spec` | PM Agent | Generates blank template with correct sections |
| `scaffold_task_spec` | Lead Engineer | Generates blank Task Spec for a specific worker type |
| `validate_task_spec` | Lead Engineer, Orchestrator | Checks all required fields are complete |
| `log_pipeline_event` | All agents | Writes telemetry events for Retrospective Agent |

---

## Security Hooks

Two hooks run automatically — outside any agent's control:

**Pre-execution (security-gate.sh)**
Blocks before running:
- Direct pushes to protected branches (main, master, production, staging)
- Force pushes
- `rm -rf` on source directories
- Writes to `.env` files
- `DROP TABLE` / `TRUNCATE` against non-test databases

**Post-write (auto-format.sh)**
Runs after every file write:
- TypeScript/JS: Prettier + ESLint
- Java: google-java-format (if installed)
- Python: ruff or black
- Go: gofmt
- JSON/Markdown: Prettier

---

## Customisation

### Adapt the confidence threshold
Edit `skills/confidence-protocol/SKILL.md` and change the 70% threshold.
Higher = fewer escalations but more autonomous risk.
Lower = more escalations but catches more edge cases.

### Add domain-specific agents
Create a new `.md` file in `agents/` with the standard frontmatter.
Reference it in the Orchestrator's pipeline sequence.

### Add custom rules to CLAUDE.md
Every rule you add to the Non-Negotiable Rules section becomes a CRITICAL
finding in Code Review if violated. Add rules for your domain.

### Disable optional agents
Remove the agent from the Orchestrator's spawn sequence.
The UX Specification Agent, Competitive Researcher, Infrastructure Worker,
and Documentation Worker are conditionally triggered — they can be removed
without breaking the core pipeline.

---

## Telemetry

Pipeline events are logged to `.agentic-dev/telemetry/YYYY-MM-DD.jsonl`
in the project root. The Retrospective Agent reads these files each sprint.

To view recent events:
```bash
cat .agentic-dev/telemetry/$(date +%Y-%m-%d).jsonl | jq .
```

Add `.agentic-dev/` to your `.gitignore` or commit it — your choice.
Committing it gives the Retrospective Agent historical data across machines.

---

## Troubleshooting

**Pipeline halts with needs-pm immediately**
→ A blocking question exists. Read the Linear comment thread to find it.
   Answer in the comment thread, then ask Claude: "Resume the pipeline on [ISSUE-ID]"

**Gate 4 fails with "AC coverage incomplete"**
→ Some ACs in the Feature Spec are not referenced in any Task Spec.
   Ask: "Check AC coverage for [ISSUE-ID]" to see which ACs are missing.

**Worker halts with "spec gap"**
→ The Task Spec is missing a required detail. Read the sub-issue comment.
   Add the missing detail to the Task Spec, then ask: "Resume [SUB-ISSUE-ID]"

**Security hook blocking a command**
→ The command matches a blocked pattern. This is intentional.
   If it should not be blocked, edit `hooks/scripts/security-gate.sh`.
   Never disable the hook entirely.

**MCP server not responding**
→ Check Node.js is installed: `node --version` (requires v18+)
   Check the server path: `node [plugin-root]/server/index.js`

---

## License

MIT
