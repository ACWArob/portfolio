# Adam Abid — Portfolio

Personal portfolio site. React + Vite, single page, deployed on Netlify.

**Live:** https://acwa-portfolio.netlify.app

## Develop
```bash
npm install
npm run dev      # http://localhost:5173
```

## Build
```bash
npm run build    # outputs the static site to dist/
```

## Where things live
- `src/App.jsx` — all content and components (edit copy here)
- `src/index.css` — styles and theme colors (`--sea`, `--tan`, `--ink`, ...)
- `public/` — served as-is: `profile.jpg`, `about.jpg`, `Adam_Abid_Master.pdf`
- `public/images/` — journey, experience, and interest photos (see `README.txt` there for filenames)

## Deploy
Netlify is configured via `netlify.toml` (build `npm run build`, publish `dist`). Once the repo is connected to Netlify, every push to `main` auto-builds and publishes.
