# NguyenWare prototypes (Echo, Lasso, Fuse)

Web prototypes playtested through the hub at https://playtest.nguyenwarestudios.com (repo nguyenware/playtest-admin). The integration contract is that repo's `docs/game-integration.md`; follow it.

## Rules
- Edit `src/` and `manifests/`, then `npm run build`. Never hand-edit `<id>/public/index.html`, `style.css`, `fonts/` or `playtest.json`.
- Every `window.Playtest` call is optional-chained; the games run the same without the hub. Use `track()` (core-top.js) for game events, named `<id>.something`, and list each one in the game's manifest `events`.
- Core events come from the shell: `level_start`, `level_complete`, `level_fail` (cause is a short code), `quit` (Pause > Quit to menu). The shell calls `Playtest.survey()` at a run end only after 3 minutes of play.
- No ads, analytics or third-party scripts or fonts. Revive and ad-break buttons are labeled stand-ins with no SDK.
- Accessibility baseline v1: text in rem and never under 12px; the Text M/L/XL button scales page and canvas text (`F()` for canvas fonts); 44px tap targets; reduced motion turns off particles, shake, jitter and pulsing; no flashing.
- The hub's Feedback button sits bottom-left; keep that corner clear.

## Working preferences (Tim)
- Check current docs for any Cloudflare API before using it.
- Ask one clarifying question if a request is ambiguous.
- Commit in logical steps.
