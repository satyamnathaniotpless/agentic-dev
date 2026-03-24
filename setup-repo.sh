#!/bin/bash
# Run this once after creating the GitHub repo.
# Usage: bash setup-repo.sh https://github.com/YOUR-ORG/agentic-dev

REPO_URL=${1:-"https://github.com/YOUR-ORG/agentic-dev"}

cd "$(dirname "$0")"

git init
git add .
git commit -m "feat: initial release — agentic-dev Claude Code plugin v1.0.0

Full product development lifecycle as autonomous AI agents.
31 agents, 7 skills, 2 hooks, MCP server with 6 tools.

Covers: business analysis → discovery → design → decomposition
        → implementation → validation → release & operations

Includes:
- 31 specialized agent definitions (agents/)
- 7 reusable skills (skills/)  
- Security gate + auto-format hooks (hooks/)
- MCP server: validate_feature_spec, check_ac_coverage, scaffold_* (server/)
- CLAUDE.md, FEATURE_SPEC.md, TASK_SPEC.md templates (templates/)
- Complete README with installation and usage instructions"

git branch -M main
git remote add origin "$REPO_URL"
git push -u origin main

echo ""
echo "Done! Your plugin is live at: $REPO_URL"
echo ""
echo "Users can install it with:"
echo "  claude plugin install agentic-dev@$(echo $REPO_URL | sed 's|https://github.com/||')"
echo ""
echo "Or via /plugins in Claude Code by adding:"
echo "  $REPO_URL"
