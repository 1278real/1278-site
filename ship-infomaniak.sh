#!/bin/bash
set -e

MSG="${1:-chore: ship}"

echo "→ commit..."
git add -A
git commit -m "$MSG

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"

echo "→ push..."
git push

echo "→ déclenchement Build & Deploy sur GitHub Actions..."
gh workflow run deploy.yml --repo 1278real/1278-site

echo ""
echo "✓ En route. Suivi : https://github.com/1278real/1278-site/actions"
