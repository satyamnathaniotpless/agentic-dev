# agentic-dev

> Full product development lifecycle as autonomous AI agents.  
> 31 agents · 7 skills · 6 slash commands · 2 hooks · MCP server with 6 tools

---

## What it does

Say `/agentic-dev:run-pipeline ENG-42`. A 7-phase autonomous pipeline runs:

```
1. Business Analysis   → Business Analyst + Stakeholder Clarifier + Feasibility Assessor
2. Discovery           → 5 Research Agents (parallel)
3. Design & Planning   → PM Agent + PRD Reviewer + UX Spec + Architecture Reviewer
4. Decomposition       → Lead Engineer + Database Architect + API Contract Agent
5. Implementation      → 6 Workers in isolated git worktrees (parallel)
6. Validation          → Code Review + Security Review + QA + Performance Test
7. Release & Ops       → Release Manager + Deployment + Smoke Test + Rollback
```

Every phase posts a structured comment to Linear. The issue thread is the complete
audit trail from business requirement to deployed feature.

---

## Prerequisites

1. **Claude Code** v1.0.33+ — `claude --version`
2. **Node.js** v18+ (for the MCP server)
3. **CLAUDE.md** in your project root — copy from `templates/CLAUDE.md` and fill in every section
4. **Linear** configured — team key, all statuses, all required labels (see README section below)

---

## Installation

### Test locally (development)
```bash
claude --plugin-dir ./plugins/agentic-dev
```

### Add the marketplace (one-time per machine)
```bash
# In Claude Code:
/plugin marketplace add your-org/agentic-dev
```

### Install the plugin
```bash
/plugin install agentic-dev@agentic-dev
```

### For teams — add to your project's `.claude/settings.json`
```json
{
  "extraKnownMarketplaces": {
    "agentic-dev": {
      "source": {
        "source": "github",
        "repo": "your-org/agentic-dev"
      }
    }
  },
  "enabledPlugins": {
    "agentic-dev@agentic-dev": true
  }
}
```
Team members are prompted to install when they trust the project folder.

See `docs/team-settings-example.json` for the full settings template.

---

## Validation

Before use, validate the plugin structure:
```bash
# From the repo root:
claude plugin validate .

# Or from within Claude Code:
/plugin validate .
```

---

## Slash Commands

| Command | Description |
|---|---|
| `/agentic-dev:run-pipeline [ISSUE-ID]` | Run the full pipeline on a Linear issue |
| `/agentic-dev:write-spec [ISSUE-ID]` | Write a complete 7-section Feature Spec |
| `/agentic-dev:decompose-issue [ISSUE-ID]` | Decompose an issue into Task Spec sub-issues |
| `/agentic-dev:review-pr [PR]` | Run code + security review on a pull request |
| `/agentic-dev:validate-spec [ISSUE-ID]` | Validate a Feature or Task Spec |
| `/agentic-dev:run-retrospective [period]` | Run sprint retrospective analysis |

---

## Skills (auto-invoked by Claude)

| Skill | Activates When |
|---|---|
| `agentic-dev:confidence-protocol` | Agent confidence drops below 70% |
| `agentic-dev:feature-spec` | Writing or reviewing a Feature Spec |
| `agentic-dev:task-spec` | Creating or reviewing Task Spec sub-issues |
| `agentic-dev:ac-validator` | Writing or checking acceptance criteria |
| `agentic-dev:codebase-patterns` | Any worker begins implementation |
| `agentic-dev:git-workflow` | Any worker creates a branch or commits |
| `agentic-dev:linear-comment-format` | Any agent posts a Linear comment |

---

## 31 Agents

| Phase | Agents |
|---|---|
| Business Analysis | orchestrator, business-analyst, stakeholder-clarifier, feasibility-assessor |
| Discovery | requirements-researcher, codebase-researcher, external-api-researcher, competitive-researcher, tech-spike-agent |
| Design | pm-agent, prd-reviewer, ux-specification-agent, architecture-reviewer |
| Decomposition | lead-engineer-decompose, database-architect, api-contract-agent |
| Implementation | backend-worker, frontend-worker, database-worker, test-worker, infrastructure-worker, documentation-worker |
| Validation | lead-engineer-integrate, code-review-agent, security-review-agent, qa-agent, performance-test-agent |
| Release & Ops | release-manager, deployment-agent, smoke-test-agent, rollback-agent, retrospective-agent |

---

## MCP Tools

| Tool | Purpose |
|---|---|
| `validate_feature_spec` | Checks all 7 sections, AC language testability |
| `check_ac_coverage` | Verifies AC union across all Task Specs (Gate 4) |
| `scaffold_feature_spec` | Generates blank 7-section template |
| `scaffold_task_spec` | Generates blank Task Spec for a worker type |
| `validate_task_spec` | Checks all required fields are complete |
| `log_pipeline_event` | Writes telemetry to `.agentic-dev/telemetry/` |

---

## Hooks

**PreToolUse → security-gate.sh:** Blocks force pushes, direct pushes to protected branches,
`rm -rf` on source dirs, writes to `.env` files, `DROP TABLE` on non-test databases.

**PostToolUse → auto-format.sh:** Auto-runs Prettier/ESLint (TS/JS), google-java-format (Java),
ruff/black (Python), gofmt (Go) after every file write.

---

## Required Linear Labels

Create all of these before running the pipeline:

**Signal:** `agent-generated`, `needs-pm`, `spec-incomplete`  
**Phase:** `prd-approved`, `architecture-review`, `security-reviewed`, `performance-reviewed`, `deployed-staging`, `deployed-production`, `incident`, `retrospective`  
**Work type:** `backend`, `frontend`, `db`, `tests`, `infrastructure`, `docs`  
**Issue type:** `Feature`, `Bug`, `Maintenance`

---

## Repository Structure

```
agentic-dev/                           ← Marketplace root (GitHub repo)
├── .claude-plugin/
│   ├── plugin.json                    ← Standalone plugin manifest
│   └── marketplace.json               ← Marketplace catalog
│
├── plugins/
│   └── agentic-dev/                   ← The installable plugin (pluginRoot: "./plugins")
│       ├── .claude-plugin/
│       │   └── plugin.json            ← Plugin manifest (no version — set in marketplace.json)
│       ├── .mcp.json                  ← MCP server registration
│       ├── agents/                    ← 31 agent definitions
│       ├── commands/                  ← 6 slash commands
│       ├── skills/                    ← 7 Agent Skills
│       ├── hooks/
│       │   ├── hooks.json
│       │   └── scripts/
│       ├── server/
│       │   └── index.js               ← MCP server (6 tools)
│       └── templates/
│           ├── CLAUDE.md
│           ├── FEATURE_SPEC.md
│           └── TASK_SPEC.md
│
├── docs/
│   └── team-settings-example.json     ← Copy to project .claude/settings.json
├── README.md
└── setup-repo.sh
```

---

## Submit to Anthropic Marketplace

- **Claude.ai:** [claude.ai/settings/plugins/submit](https://claude.ai/settings/plugins/submit)
- **Console:** [platform.claude.com/plugins/submit](https://platform.claude.com/plugins/submit)

---

## License

MIT
