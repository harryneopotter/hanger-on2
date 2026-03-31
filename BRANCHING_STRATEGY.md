# Branch Management Strategy (Solo Developer)

This repository is maintained by a single developer. The strategy below optimizes for a clean, linear history and fast integration to main while keeping rollback safety.

## Branch Roles
- main: The source of truth. Always deployable. Keep history clean.
- temp-supabase: Active development branch (current work).
- backup/original-main: Remote backup of the current origin/main before any history changes. Use this to roll back if needed.

## Current Situation and Decision
- The two lines of work (main and temp-supabase) have unrelated histories. Attempting rebase or merge produced pervasive add/add conflicts and a refusal to merge unrelated histories.
- To proceed quickly and cleanly, we:
  1) Created and pushed a safety backup branch: backup/original-main (points to origin/main).
  2) Replace main with temp-supabase by force-updating origin/main.

This preserves full rollback while giving a single clean history going forward.

## Commands Already Executed
- Create remote backup of origin/main
  git checkout -b backup/original-main origin/main
  git push -u origin backup/original-main

## Next Commands To Execute (Finalize the Switch)
- Update origin/main to point to temp-supabase (history rewrite on main)
  git push origin temp-supabase:main --force-with-lease

- (Optional but recommended) Update local main to the new remote main
  git checkout main
  git fetch origin
  git reset --hard origin/main

## Rollback Plan
If you ever need to restore the previous main:
- Locally
  git checkout main
  git reset --hard origin/backup/original-main
  git push origin main --force-with-lease

- Or from any branch
  git push origin origin/backup/original-main:main --force-with-lease

## Day-to-Day Workflow (Simple)
- For small changes: commit directly on main.
- For larger work: create a feature branch from main, then squash merge or fast-forward back to main.
- Keep main always green: run lint/tests/build before pushing.

## Pull Request Completion Checklist
Use this checklist when reviewing the current open PR list or deciding whether a branch is ready to merge.

- PR is no longer in draft and clearly states what changed, why, and how it was validated.
- PR targets the correct base branch and does not depend on unmerged work unless that dependency is called out explicitly.
- Branch is mergeable without conflicts (`mergeable_state` is clean) before requesting final review.
- Required validation is green before merge: at minimum lint, tests, and build locally or in CI.
- Automated review comments and failing deployment checks are resolved, or the PR description explains why they are safe to defer.
- Large, stale, or multi-purpose PRs should be split, rebased, or closed instead of merged as-is.

Suggested commands
- Update and verify
  git fetch origin
  npm ci
  npm run lint
  npm test
  npm run build

- Optional dev server
  npm run dev

## Post-Switch Cleanup (Optional)
- After verifying main is good, delete temp-supabase
  git branch -d temp-supabase
  git push origin --delete temp-supabase

- Remove stale branches (e.g., copilot/fix-*) if no longer needed
  git push origin --delete <branch-name>

## Notes
- All destructive operations are protected with backups and the use of --force-with-lease.
- Keep .env values up to date locally to run build/dev. See .env.example for required keys.
