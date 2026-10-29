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
- `src/_data/projects.toml` — **data-driven projects page**. `[[active]]` entries are apps, `[[packages]]` are R packages; each has `name`, `desc`, `icon` (the app's own icon, from `src/img/favicons/`; optionally `icon_dark`, shown instead while the dark theme is on, for an icon that would vanish on the dark page), plus URL fields (`shiny_url`, `r_url`, `github_url`, `pdf_url`) and a `links` array of `{ name, url }` rendered as the "in the press" strip.
- `src/_data/policy.toml` — same pattern for the policy-writing page, under `[[project]]`.
- `src/_includes/` — `base.njk` (head, meta, OG/JSON-LD, theme boot, the Geist fonts), `home.njk`, `post.njk`, and `partials/` (header, footer, coffee modal, post-extras, `entry.njk` for the projects/policy index, `apps-dock.njk` + `app-tile.njk` for the homepage apps panel).
- `src/blog/posts/*.md` — posts, YAML front matter. `src/blog/index.njk` is the listing; `src/blog/search.njk` builds `/blog/search.json` (title, blurb and plain text of every published post, via the `searchText` filter) for the blog search.
- `src/index.md` — homepage bio text (rendered by `home.njk`). It is split at its `<!-- apps -->` marker: the greeting and first paragraph come before the apps panel, the rest after it. Keep the marker.
- `src/assets/css/site.css` — **the design system**, one file, sectioned and commented. All tokens (colours, fonts, measure, motion) live in section 1 at the top; everything else derives from them. Change `--accent` and the whole site re-skins.
- `src/assets/js/site.js` — theme toggle, coffee modal, blog search, code copy buttons, copy-link, TOC scroll indicator, reading progress, sidenotes, outdate alert. Dependency-free, one IIFE. The apps panel's small script lives in `partials/apps-dock.njk`.
- `src/assets/js/window-light.js` — the old homepage background. Not loaded since the studio redesign (October 2026); `.bg-stage` in the stylesheet still gives it a stage if it comes back.
- `src/img/` — post images, copied to `/img/` at build time, so every historical `/img/...` URL still resolves.
- Fonts: Geist and Geist Mono, loaded from Google Fonts in `base.njk` (and named in the giscus themes). To self-host them, add the woff2 files under `src/assets/fonts/` with `@font-face` rules in section 2 of the stylesheet, and drop the Google Fonts link.

## Design

"Studio" (October 2026): cool white, near-black ink, one cobalt; hairline rules, 10–16px radii, a 40rem measure, nothing louder than a 1px line.

- **Type**: Geist for everything you read, Geist Mono for the small voice (metadata, labels, dates, code). The mono voice is applied via one shared selector list in section 3 of the stylesheet. Weights do the hierarchy; sizes stay modest.
- **Colour**: cobalt `#2b50ff` on `#fbfbfa`, ink `#0b0b0c`; in dark mode `#8098ff` on `#0b0b0c`. Links are ink with a grey hairline and take the accent on hover. Small grey text (`--ink-3`) is kept at 4.5:1 against the paper in both themes. Alert callouts keep a red of their own so warnings never read as links.
- **Header**: sticky, frosted paper. The brand is "pablo **garcía-guzmán**" (regular first name, bold surname, split from `site.handle`) after a small accent square, the same square as the favicon. On phones the nav takes its own line. Because the header is sticky, anchors clear it with `scroll-padding-top` (more on phones), and the reading-progress bar and sticky contents list sit above/below it.
- **Motion**: restrained. Entries enter with a pure-CSS staggered animation using `backwards` fill — do **not** reintroduce a JS-driven reveal class, because adding one after paint makes cards flash, and an inline `transition-delay` left behind will slow every later hover. The theme toggle cross-fades the page with the View Transitions API, with a lockstep per-element fallback. Everything animated has a `prefers-reduced-motion` path.
- **Favicon**: a bevelled pixel square (`src/assets/favicon.svg` plus PNG and Apple touch fallbacks).
- **Homepage**: a round avatar with a hairline ring; "hey! i'm pablo." on one line in ink, then the first bio paragraph; then the **apps panel**; then the rest of the bio and the links as pills; then recent writing. The apps panel (`partials/apps-dock.njk`) is one bordered panel: every app's icon on a hairline tile in a row, and below it a caption with the name, description and press of the app under the pointer or focus (the first by default). The selected tile lifts and gets an accent dot; with a mouse a tile opens its app, on touch the first tap selects and the second opens; ← → move along the row. On phones the row wraps to two lines of five.
- **Projects and policy** are a numbered index at the reading measure (`partials/entry.njk`), not cards. An app sits on the same hairline tile as on the homepage, in full colour; its links are small pills, its press a mono line. On hover or focus the entry's rule redraws in the accent from the left, the title's underline writes itself, a ↗ slides in and the tile lifts. The whole row links to the entry. A policy name of the form `Title (Source)` shows the source as a mono kicker (`splitSource` filter); entries without an icon (the policy reports) get no tile.
- **Blog list** (`/blog/`): no lead and no "latest" tag — the newest is simply first. Essays are grouped by year (a mono year and a hairline), each a row with the post's opening picture on a small rounded tile, the title, two lines of blurb, and the date ("oct 09", `dateShort`) and reading time in mono on the right. The picture is the post's first `<img>` (else `cover_image`), found by the `heroImage` filter; years come from `byYear`. Notes follow in their own group, without pictures.
- **Blog search**: one field under the lede (hidden without JS). It filters the rows as you type across the full text of every post (`/blog/search.json`, fetched on first use), ignoring case and accents, marks the matches, and shows a snippet when a post matches only in its body. "/" focuses it, escape clears it, `?q=` in the URL runs a search on load. Year groups with no matches hide, and an empty search says so.
- **Post page**: an "essay"/"note" kicker, the title, and a byline (avatar, name, date, reading time) above a hairline. A post's opening image is framed at the full measure. Top-level `##` sections open on a hairline with a mono number (`01`, `02`…), and the contents list carries the same numbers. The end of a post has an author card (`site.bio`), the share row, the citation box (one copy button per format) and newer/older links.
- **Coffee modal**: a `<dialog>` in `partials/coffee.njk`, opened by `#coffee-btn` in the bio. Actions are "email me" (mailto built from `site.email` + `site.coffee.subject`), linkedin, and copy-address (writes to the clipboard and confirms with the shared toast). Closes via the ×, Escape, or a click outside the panel.

## Conventions

- The site uses a lowercase aesthetic (nav, labels, page titles) — keep new copy lowercase unless it's a proper noun or a publication title.
- Post front matter: `title`, `date`, `description`, `tags`, `kind: note`, `series`, `featured`, `math`, `cover_image`, `toc`/`comment`/`cite` (set false to opt out), `outdate_alert` + `outdate_alert_days`, `draft`.
- **Tags are not displayed.** There are no tag pages and no tag chips; `tags` in front matter survives only as `article:tag` / JSON-LD metadata. Don't reintroduce tag UI without being asked.
- **Reading time and blurbs are automatic.** `/blog/` computes minutes from the rendered body, and shows `description` if a post sets one, otherwise an auto-excerpt (the `excerpt` filter strips headings, quotes, figures, code and tables, then trims to a whole word).
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
- Atom feeds: `/feed.xml` (site) and `/blog/feed.xml` (blog). There are deliberately no visible RSS links; feed readers find both through the `<link rel="alternate">` tags in `base.njk`.
- **Citations** name the source as `site.author` ("Pablo García-Guzmán"), never `site.title`, which is the lowercase brand.
- New publication or app: append an entry to the relevant `src/_data/*.toml`. Press coverage goes in its `links` array.
- To restyle, change tokens in section 1 of `src/assets/css/site.css` rather than adding scattered rules.
