Commit all staged and unstaged changes, push to GitHub, then trigger the "Build & Deploy" GitHub Actions workflow to deploy to Infomaniak.

Steps:
1. Run `git status` to see what will be committed
2. Run `git diff HEAD` (and `git diff` for unstaged) to understand what changed
3. Based on the diff, generate a concise commit message in French following conventional commits format (feat/fix/chore/style). Do NOT ask the user — infer it from the changes.
4. Run `git add -A` to stage everything
5. Commit with the generated message, always appending this trailer:
   Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
6. Run `git push`
7. Run `gh workflow run deploy.yml --repo 1278real/1278-site` to trigger the build
8. Confirm success and show the Actions URL: https://github.com/1278real/1278-site/actions
