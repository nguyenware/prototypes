# Handoff: launch Echo, Lasso and Fuse in the playtest hub

State on 2026-10-16: the games are built and on `main` here; the hub change is open as nguyenware/playtest-admin PR #50 (branch `add-echo-lasso-fuse`, tests pass). Nothing is deployed and the production database is unchanged. Order matters: the hub's service bindings need the game Workers to exist before the hub deploys.

## 1. Deploy the three game Workers
From this repo, for each of `echo`, `lasso`, `fuse`:
```sh
cd <id> && npx wrangler deploy
```
Each is an assets-only Worker (`<id>/wrangler.jsonc`, assets in `<id>/public`). Check that `https://<id>.summer-sky-afc1.workers.dev/` loads and `/playtest.json` returns the manifest with `"id": "<id>"`. If the account's workers.dev subdomain is not `summer-sky-afc1`, stop and tell Tim: migration 0022 hard-codes those URLs.

Ongoing deploys: `.github/workflows/deploy.yml` deploys on pushes to `main` once the repo has the secrets `CLOUDFLARE_API_TOKEN` (Workers Scripts: Edit, D1: Edit) and `CLOUDFLARE_ACCOUNT_ID`. Its first run (from the commit that added it) failed for lack of those secrets; that's expected. Add the secrets, or ask Tim whether he'd rather use Workers Builds and remove the workflow.

## 2. Apply hub migration 0022 to production D1
From nguyenware/playtest-admin on the PR branch (or use `tools/hub/` here, which has a copy of the SQL and a config pointing at the same database):
```sh
npx wrangler d1 execute playtest --remote --command "SELECT id, name FROM d1_migrations ORDER BY id"
```
If `0022_prototypes.sql` isn't listed:
```sh
npx wrangler d1 execute playtest --remote --file migrations/0022_prototypes.sql
npx wrangler d1 execute playtest --remote --command "INSERT INTO d1_migrations (name) VALUES ('0022_prototypes.sql')"
npx wrangler d1 execute playtest --remote --command "SELECT id, status, visibility, app_origin FROM games WHERE id IN ('echo','lasso','fuse')"
```
Don't use `d1 migrations apply`: if `0021_spelled_out.sql` isn't recorded it would run that too. Report what the first query showed for 0021. `.github/workflows/hub-migration.yml` here does the same steps if you'd rather run it from Actions.

## 3. Merge PR #50
Ask Tim before merging. Merging deploys the hub through Workers Builds. Then check:
- `https://playtest.nguyenwarestudios.com/play/echo/` redirects a signed-out visitor to sign-in.
- `https://playtest.nguyenwarestudios.com/games/echo` is a 404 for someone without access (invite-only).
- In `/admin/games`, the three games show their manifest (name, build 0.1.0, hero image).

## 4. Left for Tim, in the hub admin
- `/admin/games`: Give access to the Friends and Family cohorts for each game.
- `/admin/rounds`: open a round per game. The shared default survey (fun, clarity, replay) applies.
