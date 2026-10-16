# Handoff: Echo, Lasso and Fuse in the playtest hub

State on 2026-10-16: launched. The three games are live, the hub serves them to everyone, and new testers need admin approval before they can play.

## Done
- **Game Workers deployed** from `main` with `npx wrangler deploy` in `echo/`, `lasso/` and `fuse/`. Each loads at `https://<id>.summer-sky-afc1.workers.dev/`, and `/playtest.json` returns the manifest with build 0.1.0.
- **Hub database (production D1 `playtest`)** has migrations 0001–0023 applied and recorded in `d1_migrations`. That includes this repo's games (0022), the Spelled Out rename (0021, which had never been applied) and tester approval (0023). They were applied through the Cloudflare connector, not `d1 migrations apply`.
- **Open to everyone:** the games were added as invite-only and set to public (Everyone) the same day. They're on the hub's landing page and promo pages (`/games/echo`, `/games/lasso`, `/games/fuse`). `/play/<id>/` asks signed-out visitors to sign in.
- **Hub changes merged** in nguyenware/playtest-admin PR #50 (the games and their service bindings) and PR #51:
  - New public sign-ups wait in an "Awaiting approval" queue on `/admin/testers`, where they can be approved or declined. Existing testers were all approved automatically.
  - `/admin/games` now fetches manifests it hasn't cached yet, so the game cards show their hero images.

## Open
1. **Rounds (Tim, in the hub admin):** open a round per game on `/admin/rounds`. The shared default survey (fun, clarity, replay) applies. Cohort access isn't needed now that the games are public.
2. **Ongoing deploys:** `.github/workflows/deploy.yml` deploys on pushes to `main` once the repo has the secrets `CLOUDFLARE_API_TOKEN` (Workers Scripts: Edit) and `CLOUDFLARE_ACCOUNT_ID`. Neither is set yet, so until then redeploy by hand with `npx wrangler deploy` in each game folder after `npm run build`. Or ask Tim whether he'd rather use Workers Builds and remove the workflow.
3. **Expiry for sign-ups awaiting approval (hub):** sign-ups nobody approves are meant to be deleted after 30 days. That switches on once the policy in site-nguyenwarestudios `src/privacy/policy.ts` lists the limit and playtest-admin's `src/privacy/retention.json` gets `"awaitingApproval": 30`. Until then, the inactive-account limit covers them.
4. **One-off migration helpers:** `tools/hub/` and `.github/workflows/hub-migration.yml` were only for applying 0022, which is done. Remove them when convenient.
