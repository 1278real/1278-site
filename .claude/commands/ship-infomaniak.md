Commit all staged and unstaged changes, push to GitHub, then trigger the "Build & Deploy" GitHub Actions workflow to deploy to Infomaniak.

Steps:
1. Run `git status` to see what will be committed
2. Run `git add -A` to stage everything
3. Ask the user for a commit message if $ARGUMENTS is empty, otherwise use $ARGUMENTS as the commit message
4. Commit with that message (include Co-Authored-By trailer)
5. Run `git push`
6. Run `gh workflow run deploy.yml --repo 1278real/1278-site` to trigger the build
7. Confirm success and show the Actions URL: https://github.com/1278real/1278-site/actions
