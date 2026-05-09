#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
PORT="${1:-8000}"

if [ ! -f "$PROJECT_DIR/index.html" ]; then
  echo "Error: index.html not found in $PROJECT_DIR" >&2
  exit 1
fi

echo "Serving: $PROJECT_DIR"
echo "URL: http://127.0.0.1:${PORT}/index.html"
python3 -m http.server "$PORT" --directory "$PROJECT_DIR"
