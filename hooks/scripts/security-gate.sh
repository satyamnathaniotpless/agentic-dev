#!/bin/bash
# Security gate — blocks dangerous operations before they execute.
# Exit code 2 = hard block. Exit code 0 = allow.

# Read the command from stdin (Claude Code passes tool input as JSON)
INPUT=$(cat)
CMD=$(echo "$INPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('command',''))" 2>/dev/null || echo "")

if [ -z "$CMD" ]; then
  exit 0
fi

# --- BLOCKED PATTERNS ---

# Direct push to protected branches
if echo "$CMD" | grep -qE "git push[^|]*\b(main|master|production|staging|develop)\b"; then
  echo "BLOCKED by agentic-dev security gate: Direct push to protected branch." >&2
  echo "Use a feature branch and open a PR instead." >&2
  exit 2
fi

# Force push
if echo "$CMD" | grep -qE "git push.*(-f|--force|--force-with-lease)"; then
  echo "BLOCKED by agentic-dev security gate: Force push is prohibited." >&2
  exit 2
fi

# Recursive deletion of source directories
if echo "$CMD" | grep -qE "rm -rf.*(src|lib|app|backend|frontend|server|api)/"; then
  echo "BLOCKED by agentic-dev security gate: Recursive deletion of source directories." >&2
  exit 2
fi

# Writing to environment files
if echo "$CMD" | grep -qE "(>|>>|tee).*(\.env|\.env\.|env\.production|env\.staging)"; then
  echo "BLOCKED by agentic-dev security gate: Writing to environment files." >&2
  echo "Environment variables must be managed manually or through your secrets manager." >&2
  exit 2
fi

# Destructive database commands against non-test databases
if echo "$CMD" | grep -qiE "(DROP TABLE|DROP DATABASE|TRUNCATE TABLE)" && ! echo "$CMD" | grep -qi "test\|_test\|test_"; then
  echo "BLOCKED by agentic-dev security gate: Destructive SQL on non-test database." >&2
  echo "Destructive migrations require explicit human approval via Database Architect." >&2
  exit 2
fi

# Curl/wget posting to external URLs with sensitive data patterns
if echo "$CMD" | grep -qE "(curl|wget).*(-d|--data).*password|secret|token|key" 2>/dev/null; then
  echo "BLOCKED by agentic-dev security gate: Potential secret exfiltration detected." >&2
  exit 2
fi

exit 0
