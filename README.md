# agentic-dev

> Full product development lifecycle as autonomous AI agents.  
> 31 specialized agents · 7 skills · 6 slash commands · 2 hooks · MCP server

---

## What it does

Drop a Linear issue ID and say `run-pipeline ENG-42`. The plugin kicks off a
7-phase autonomous pipeline that mirrors your existing team process:

```
1. Business Analysis   → Business Analyst + Stakeholder Clarifier + Feasibility Assessor
2. Discovery           → 5 Research Agents (parallel)
3. Design & Planning   → PM Agent + PRD Reviewer + UX Spec Agent + Architecture Reviewer
4. Decomposition       → Lead Engineer + Database Architect + API Contract Agent
5. Implementation      → 6 Workers in isolated git worktrees (parallel)
6. Validation          → Code Review + Security Review + QA + Performance Test
7. Release & Ops       → Release Manager + Deployment + Smoke Test + Rollback
```

Every phase transition posts a structured comment to Linear. The thread of a single
issue is the complete audit trail from business requirement to deployed feature.

---

## Prerequisites

1. **Claude Code** v1.0.33 or later — `claude --version`
2. **Node.js** v18 or later (for the MCP server)
3. **CLAUDE.md** in your project root — copy from `templates/CLAUDE.md` and fill in every section
4. **Linear** configured — team, statuses, all required labels (see `templates/CLAUDE.md` for full list)

---

## Installation

### Local development / testing
```bash
claude --plugin-dir ./agentic-dev
```

### Install to project (shared with team via .claude/settings.json)
```bash
# After pushing to GitHub:
/plugin install agentic-dev@your-org
```

### Install with scope
```bash
claude plugin install agentic-dev@your-org --scope project   # team-shared
claude plugin install agentic-dev@your-org --scope user      # personal, all projects
```

---

## Slash Commands

| Command | Description |
|---|---|
| `/agentic-dev:run-pipeline [ISSUE-ID]` | Run the full pipeline on a Linear issue |
| `/agentic-dev:write-spec [ISSUE-ID]` | Write a complete 7-section Feature Spec |
| `/agentic-dev:decompose-issue [ISSUE-ID]` | Decompose an issue into Task Spec sub-issues |
| `/agentic-dev:review-pr [PR-URL or #N]` | Run code + security review on a PR |
| `/agentic-dev:validate-spec [ISSUE-ID]` | Validate a Feature or Task Spec |
| `/agentic-dev:run-retrospective [period]` | Run sprint retrospective analysis |

---

## Skills (auto-activated by Claude)

| Skill | Activates When |
|---|---|
| `agentic-dev:confidence-protocol` | Any agent's confidence drops below 70% |
| `agentic-dev:feature-spec` | Writing, reviewing, or validating a Feature Spec |
| `agentic-dev:task-spec` | Creating or reviewing Task Spec sub-issues |
| `agentic-dev:ac-validator` | Writing or checking acceptance criteria |
| `agentic-dev:codebase-patterns` | Any worker begins implementation |
| `agentic-dev:git-workflow` | Any worker creates a branch or commits |
| `agentic-dev:linear-comment-format` | Any agent posts a Linear comment |

---

## Agents (31 total)

**Business Analysis:** orchestrator, business-analyst, stakeholder-clarifier, feasibility-assessor  
**Discovery:** requirements-researcher, codebase-researcher, external-api-researcher, competitive-researcher, tech-spike-agent  
**Design:** pm-agent, prd-reviewer, ux-specification-agent, architecture-reviewer  
**Decomposition:** lead-engineer-decompose, database-architect, api-contract-agent  
**Implementation:** backend-worker, frontend-worker, database-worker, test-worker, infrastructure-worker, documentation-worker  
**Validation:** lead-engineer-integrate, code-review-agent, security-review-agent, qa-agent  
**Release & Ops:** release-manager, deployment-agent, smoke-test-agent, rollback-agent, retrospective-agent

---

## MCP Tools (agentic-dev-tools server)

| Tool | Called By |
|---|---|
| `validate_feature_spec` | PRD Reviewer — checks all 7 sections, AC language |
| `check_ac_coverage` | Orchestrator (Gate 4) — AC union check |
| `scaffold_feature_spec` | PM Agent — generates blank 7-section template |
| `scaffold_task_spec` | Lead Engineer — generates blank Task Spec |
| `validate_task_spec` | Lead Engineer — checks all required fields |
| `log_pipeline_event` | All agents — writes telemetry to `.agentic-dev/telemetry/` |

---

## Hooks

**PreToolUse → security-gate.sh** — Blocks before execution:
- Direct pushes to protected branches (main, master, production, staging)
- Force pushes
- `rm -rf` on source directories
- Writes to `.env` files
- `DROP TABLE` / `TRUNCATE` against non-test databases

**PostToolUse → auto-format.sh** — Runs after every file write:
- TypeScript/JS: Prettier + ESLint
- Java: google-java-format (if installed)
- Python: ruff or black
- Go: gofmt
- JSON/Markdown: Prettier

---

## First-run checklist

- [ ] Copy `templates/CLAUDE.md` to your project root — fill in **every** section
- [ ] Configure Linear: team key, all statuses (exact names), all labels
- [ ] Verify Linear MCP connection is working
- [ ] Run `claude --plugin-dir ./agentic-dev` and try `/agentic-dev:validate-spec ENG-1`
- [ ] Run a test issue through the full pipeline before using on production work

---

## Plugin structure

```
agentic-dev/
├── .claude-plugin/
│   └── plugin.json          ← Plugin manifest
├── commands/                ← Slash commands (/agentic-dev:run-pipeline etc.)
│   ├── run-pipeline.md
│   ├── write-spec.md
│   ├── decompose-issue.md
│   ├── review-pr.md
│   ├── validate-spec.md
│   └── run-retrospective.md
├── agents/                  ← 31 agent definitions (auto-discovered)
│   └── *.md
├── skills/                  ← 7 Agent Skills with SKILL.md (auto-invoked)
│   ├── confidence-protocol/
│   ├── feature-spec/
│   ├── task-spec/
│   ├── ac-validator/
│   ├── codebase-patterns/
│   ├── git-workflow/
│   └── linear-comment-format/
├── hooks/
│   ├── hooks.json           ← Hook configuration
│   └── scripts/
│       ├── security-gate.sh
│       └── auto-format.sh
├── server/
│   └── index.js             ← MCP server (6 tools)
├── .mcp.json                ← Registers the MCP server
└── templates/
    ├── CLAUDE.md            ← Constitution template — copy to project root
    ├── FEATURE_SPEC.md      ← L2 Feature Spec template
    └── TASK_SPEC.md         ← L3 Task Spec template
```

---

## Submit to Anthropic marketplace

Once the plugin is published to a public GitHub repo:

- **Claude.ai**: [claude.ai/settings/plugins/submit](https://claude.ai/settings/plugins/submit)
- **Console**: [platform.claude.com/plugins/submit](https://platform.claude.com/plugins/submit)

---

## License

MIT
