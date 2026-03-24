#!/bin/bash
# Auto-format hook — runs after every file write.
# Ensures agent-written code is indistinguishable in style from human-written code.

INPUT=$(cat)
FILE=$(echo "$INPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('file_path',''))" 2>/dev/null || echo "")

if [ -z "$FILE" ] || [ ! -f "$FILE" ]; then
  exit 0
fi

EXT="${FILE##*.}"

case "$EXT" in
  ts|tsx|js|jsx|mjs|cjs)
    # TypeScript / JavaScript — Prettier then ESLint
    if command -v prettier &>/dev/null; then
      prettier --write "$FILE" --log-level warn 2>/dev/null
    fi
    if command -v eslint &>/dev/null; then
      eslint --fix "$FILE" 2>/dev/null
    fi
    ;;
  
  java)
    # Java — google-java-format if available, otherwise skip
    if command -v google-java-format &>/dev/null; then
      google-java-format --replace "$FILE" 2>/dev/null
    fi
    ;;
  
  py)
    # Python — ruff format
    if command -v ruff &>/dev/null; then
      ruff format "$FILE" 2>/dev/null
    elif command -v black &>/dev/null; then
      black "$FILE" --quiet 2>/dev/null
    fi
    ;;
  
  go)
    # Go — gofmt
    if command -v gofmt &>/dev/null; then
      gofmt -w "$FILE" 2>/dev/null
    fi
    ;;
  
  json)
    # JSON — Prettier
    if command -v prettier &>/dev/null; then
      prettier --write "$FILE" --log-level warn 2>/dev/null
    fi
    ;;
  
  md|mdx)
    # Markdown — Prettier
    if command -v prettier &>/dev/null; then
      prettier --write "$FILE" --prose-wrap always --log-level warn 2>/dev/null
    fi
    ;;
  
  sql)
    # SQL — skip (migrations are sensitive; no auto-format)
    ;;
  
  *)
    # Unknown extension — skip
    ;;
esac

exit 0
