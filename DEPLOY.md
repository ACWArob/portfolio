# Adam Abid: Portfolio (React + Vite)

A single-page React portfolio. The build inlines everything into one self-contained `index.html`, so it opens by double-click and hosts anywhere.

## 1. Add your photo (30 seconds)
Save your headshot as **`profile.jpg`** (square, ~600×600 or larger):
- into **`public/profile.jpg`** (so future rebuilds include it), and
- into **`dist/`** next to `index.html` (so the *current* build shows it).

Until you add it, the hero shows a placeholder silhouette.

## 2. Run it locally
```bash
npm install
npm run dev      # http://localhost:5173  (live-reload preview)
npm run build    # outputs the self-contained site to dist/
```

## 3. Deploy FREE right now (no account, ~30s)
1. Go to **https://app.netlify.com/drop**
2. Drag the whole **`dist/`** folder onto the page.
3. You get a live URL instantly (e.g. `your-site.netlify.app`). Free signup keeps it + lets you rename the subdomain.

Equally easy free alternatives (connect a GitHub repo → auto-deploy on every push):
- **Vercel** (vercel.com) · **Cloudflare Pages** · **GitHub Pages**

## 4. Move to AWS later (what you wanted)
- **Easiest, AWS Amplify Hosting:** push this project to GitHub, then in the Amplify console "Host web app" → connect the repo. Amplify builds (`npm run build`, output dir `dist`) and serves it over HTTPS on the free tier.
- **Classic, S3 + CloudFront:**
  ```bash
  aws s3 sync dist/ s3://YOUR_BUCKET --delete
  ```
  Enable static website hosting on the bucket, put a CloudFront distribution in front (HTTPS + global CDN), and point a Route 53 domain at it.

## 5. Custom domain (optional, ~$12/yr)
Buy `adamabid.com` (Route 53 / Namecheap), then point DNS at your host. The free `*.netlify.app` / `*.amplifyapp.com` / `*.cloudfront.net` URLs cost nothing to start.

---
**Note:** I couldn't push this to a live URL from the build environment, since that needs your hosting login, and I don't create accounts or handle credentials. The drag-and-drop in step 3 makes it live in under a minute.

## Structure
```
portfolio/
├─ index.html          # Vite entry (mounts React)
├─ src/App.jsx         # the whole site (edit content here)
├─ src/index.css       # all styles / theme colors
├─ public/             # profile.jpg + Adam_Abid_Master.pdf (served as-is)
└─ dist/               # built, deployable site (after npm run build)
```
Edit copy/experiences in `src/App.jsx`; change colors at the top of `src/index.css` (`--sea`, `--tan`, `--ink`, …).
