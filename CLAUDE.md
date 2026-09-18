# CLAUDE.md

Personal website of Pablo García-Guzmán (pablogguz.github.io) — a static site built with [Eleventy](https://www.11ty.dev/) on hand-written templates and a single stylesheet. No theme, no CSS framework, no build step beyond Eleventy itself.

> Before September 2026 this site ran on Zola with a heavily customised fork of the *serene* theme. That version is tagged `zola-final` if you ever need to look something up; nothing in the current tree depends on it.

## Commands

```bash
npm install
npm run dev          # http://localhost:8090, live reload (drafts hidden)
npm run dev:drafts   # same, with src/blog/drafts/ included
npm run build        # production build into _site/
npm run preview      # build, then serve _site/ on :8091
```

Deployment is automatic: every push to `main` triggers `.github/workflows/build.yml`, which runs `npm ci && npm run build` and publishes `_site/` to the `gh-pages` branch. `_site/` is generated output — gitignored, never edit it by hand.

## Drafts

Unpublished writing must never reach the public repo. Drafts live in `src/blog/drafts/`, which is **gitignored** (local-only); keep `draft: true` in their front matter as a second safety net, since the build drops anything with that flag unless `DRAFTS=1` is set.

- `npm run dev` — public view, no drafts. `npm run dev:drafts` — drafts appear at `/blog/drafts/<slug>/`.
- `./scripts/new-draft.sh "post title"` scaffolds a draft with front matter prefilled (`--note` for a note).
- `./scripts/publish-draft.sh <slug>` moves it into `src/blog/posts/`, stamps today's date, and drops the draft flag; then commit + push to deploy.

Note: `eleventy.config.js` calls `setUseGitIgnore(false)` on purpose. Eleventy ignores gitignored files by default, which would otherwise hide the drafts folder even from `npm run dev:drafts`.

## Architecture

- `eleventy.config.js` — the whole build. Markdown pipeline (KaTeX, footnotes, heading anchors, container shortcodes), collections, filters, passthrough copies. Read this first.
- `src/_data/site.js` — site config: title, nav, social links, giscus credentials, coffee-modal text, footer, per-post defaults (`toc`, `comment`, `cite`, outdate alert).
- `src/_data/projects.toml` — **data-driven projects page**. `[[active]]` entries are apps, `[[packages]]` are R packages; each has `name`, `desc`, `icon`, plus URL fields (`shiny_url`, `r_url`, `github_url`, `pdf_url`) and a `links` array of `{ name, url }` rendered as the "in the press" strip.
- `src/_data/policy.toml` — same pattern for the policy-writing page, under `[[project]]`.
- `src/_includes/` — `base.njk` (head, meta, OG/JSON-LD, theme boot), `home.njk`, `post.njk`, and `partials/` (header, footer, coffee modal, post-extras).
- `src/blog/posts/*.md` — posts, YAML front matter. `src/blog/index.njk` is the listing.
- `src/index.md` — homepage bio text (rendered by `home.njk`).
- `src/assets/css/site.css` — **the design system**, one file, sectioned and commented. All tokens (colours, fonts, measure, motion) live in section 1 at the top; everything else derives from them. Change `--accent` and the whole site re-skins.
- `src/assets/js/site.js` — theme toggle, coffee modal, code copy buttons, copy-link, TOC scroll indicator, reading progress, sidenotes, outdate alert. Dependency-free, one IIFE.
- `src/img/` — post images, copied to `/img/` at build time, so every historical `/img/...` URL still resolves.
- `src/assets/fonts/` — self-hosted variable fonts (Newsreader, JetBrains Mono), latin + latin-ext subsets.

## Design

"Quiet editorial": warm paper, one ink accent, hairline rules, generous whitespace, a 41rem measure.

- **Type**: Newsreader (variable serif, optical sizing on) for everything you read; JetBrains Mono for nav, metadata, labels and code. The mono voice is applied via one shared selector list in section 3 of the stylesheet.
- **Colour**: ultramarine ink `#2340a8` on warm paper `#fbfaf7`; in dark mode `#93a9f5` on `#161613`. Alert callouts keep a red of their own so warnings never read as links.
- **Motion**: restrained. Cards enter with a pure-CSS staggered animation using `backwards` fill — do **not** reintroduce a JS-driven reveal class, because adding one after paint makes cards flash, and an inline `transition-delay` left behind will slow every later hover. The theme toggle cross-fades the page with the View Transitions API, with a lockstep per-element fallback. Everything animated has a `prefers-reduced-motion` path.
- **Favicon**: a bevelled pixel square in the accent colour (`src/assets/favicon.svg` plus PNG and Apple touch fallbacks).

## Conventions

- The site uses a lowercase aesthetic (nav, labels, page titles) — keep new copy lowercase unless it's a proper noun or a publication title.
- Post front matter: `title`, `date`, `description`, `tags`, `kind: note`, `series`, `featured`, `math`, `cover_image`, `toc`/`comment`/`cite` (set false to opt out), `outdate_alert` + `outdate_alert_days`, `reading_time` (manual override), `draft`.
- **Notes vs posts**: `kind: note` lists the entry under a separate "notes" group on `/blog/`, shows a "note" chip, and skips the cite box.
- **Series**: `series: "name"` groups posts; the series box appears once two or more share a name.
- Posts contain **no template syntax**. Callouts, quotes and figures are markdown containers, which matters because the maths-heavy posts would otherwise fight the template engine:

  ```md
  ::: note Optional header
  Body **markdown**.
  :::

  ::: quote cite="Robert F. Kennedy"
  *GDP measures everything…*
  :::

  ::: chart src="/img/x.png" title="…" subtitle="…" source="…" note="…"
  :::
  ```

  Kinds: `note` `tip` `warning` `alert` `important` `question` `quote` `figure` `chart`. Chart figures number themselves and are linkable as `#figure-N`.
- **Maths** is `$…$` and `$$…$$`, rendered by KaTeX at build time; the stylesheet only loads on posts with `math: true`. A custom rule also renders `$…$` inside raw HTML blocks, which posts use for table captions.
- **Headings** in posts start at `#` and are demoted one level at render time, since the layout already supplies the `<h1>`.
- **Sidenotes**: footnotes move into the left margin above 1180px, automatically. No front-matter needed.
- **Comments**: giscus (GitHub Discussions), credentials in `src/_data/site.js`; its light/dark iframe themes are `src/assets/giscus-{light,dark}.css` — keep them in sync with the colour tokens.
- Atom feeds: `/feed.xml` (site) and `/blog/feed.xml` (blog).
- New publication or app: append an entry to the relevant `src/_data/*.toml`. Press coverage goes in its `links` array.
- To restyle, change tokens in section 1 of `src/assets/css/site.css` rather than adding scattered rules.
