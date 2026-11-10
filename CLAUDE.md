# CLAUDE.md — acwa-portfolio (software)

Adam Abid's personal portfolio site, live at https://acwa-portfolio.vercel.app. Recruiters and collaborators read it.
Stack: JavaScript (JSX), React 18, Vite 5 + vite-plugin-singlefile (one inlined `dist/index.html`). No backend, no DB. Default branch: `main`.

## Commands
```bash
npm install --include=dev     # this Mac's npm skips devDeps by default; without the flag `vite` is missing
npm run dev                   # http://localhost:5173
npm run build                 # → dist/index.html (single file)  ← the main correctness check
npm run preview -- --port 4173  # serve the built site to eyeball it before pushing
node scripts/letterboxd-count.mjs --dry-run   # hits letterboxd.com live; prints the parsed count, writes nothing
```
No test suite, linter or typecheck is configured.

## Layout
- `src/App.jsx` — the whole home page: hero, journey timeline (`MS`), experience + project cards, Off the Clock, footer; hash router at the bottom
- `src/AutoGrasp.jsx`, `src/HamsSimulation.jsx` — case-study pages at `#/projects/autograsp`, `#/projects/hams-simulation`
- `src/index.css` — all styles; theme tokens on `:root` (`--sea`, `--sea-glow`, `--tan`, `--ink`, `--disp`/`--body`/`--mono`)
- `public/` — served as-is: `images/`, `Adam_Abid_Master.pdf`, `preview.png` (og:image), `letterboxd.json`
- `scripts/letterboxd-count.mjs` + `.github/workflows/letterboxd.yml` — nightly film-count refresh
- `index.html` — og/twitter meta tags (must point at the live domain)
- `netlify.toml` — legacy; the site moved to Vercel on 2026-11-05

## Project rules
- **Never fabricate numbers.** Every figure must come from the cheat sheet in `../HANDOFF_Portfolio_Brand.md` §6 or the user. Unknown → leave it out.
- **No em dashes** in any copy. Commas or periods.
- Keep the theme: sea green / black / tan via the CSS tokens; fonts Space Grotesk (display), Inter (body), JetBrains Mono (labels). No new colors or fonts without asking.
- Credit the Correll Lab on lab work (AutoGrasp, HAMS, GOLEM); say which part was Adam's.
- New case-study page = new `src/<Name>.jsx` + one `route.startsWith('#/projects/<slug>')` line in `App()`, plus a `feature` card linking to it.
- Anything in `public/` is publicly served even if nothing links to it. Removing a photo means moving it out of `public/`, not just unlinking it.

## Conventions
- Match the surrounding code style (dense one-line JSX cards, `Metric`/`Img` helpers); don't introduce new patterns without asking.
- No new dependencies without asking (name, why, size).
- Respect `prefers-reduced-motion` for any animation; existing effects already check it.
- No dead code or commented-out blocks.

## Done means
`npm run build` passes, the change was checked in `npm run preview` or a browser, and after a push the live site at acwa-portfolio.vercel.app actually shows it (curl it or look; a push alone proves nothing).

## Deploy
Push to `main` → Vercel builds and publishes automatically (project `acwa-portfolio`). The old acwa-portfolio.netlify.app 301-redirects every path to Vercel (deployed 2026-11-10 from ../_netlify_redirect; Netlify auto-builds are stopped).

## Git (only when I ask)
Small commits straight to `main` (it deploys). Message: what + why.

## Lessons
<!-- date — what broke — the rule. Newest at top. Prune past ~25 lines. -->
- 2026-11-05 — Vercel took hours to pick up the first pushes after the GitHub app permission update — check the live site after a push before saying it's live.
- 2026-11-05 — Netlify free credits ran out and every deploy since Aug 4 was skipped while git push looked fine — verify the deploy, not the push.
- 2026-11-05 — grepping the built/live HTML for card text proves nothing; content renders client-side from inlined JS. Check in a browser.
