#!/bin/bash
set -e

MSG="${1:-chore: ship}"

echo "→ commit..."
git add -A
git commit -m "$MSG

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"

echo "→ push..."
git push

echo "→ déclenchement Build & Deploy..."
gh workflow run deploy.yml --repo 1278real/1278-site

echo "→ attente du démarrage..."
sleep 6
RUN_ID=$(gh run list --repo 1278real/1278-site --workflow=deploy.yml --limit=1 --json databaseId -q '.[0].databaseId')

gh run watch "$RUN_ID" --repo 1278real/1278-site --exit-status

echo ""
echo "✓ C'est en ligne ! https://1-2-7-8.tv/aZeRtYuIoP/test/"
