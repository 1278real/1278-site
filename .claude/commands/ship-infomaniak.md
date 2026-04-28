Commit all staged and unstaged changes, push to GitHub, then trigger the "Build & Deploy" GitHub Actions workflow and wait for it to complete before confirming.

Steps:
1. Run `git status` to see what will be committed
2. Run `git diff HEAD` to understand what changed
3. Based on the diff, generate a concise commit message in French following conventional commits format (feat/fix/chore/style). Do NOT ask the user — infer it from the changes.
4. Run `git add -A`
5. Commit with the generated message, always appending this trailer:
   Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
6. Run `git push`
7. Run `gh workflow run deploy.yml --repo 1278real/1278-site`
8. Wait 6 seconds, then get the run ID: `gh run list --repo 1278real/1278-site --workflow=deploy.yml --limit=1 --json databaseId -q '.[0].databaseId'`
9. Watch the build: `gh run watch <RUN_ID> --repo 1278real/1278-site --exit-status`
10. When the build finishes successfully, tell the user: "✓ C'est en ligne ! https://1-2-7-8.tv/aZeRtYuIoP/test/"
    If it fails, report the error and show the Actions URL.
