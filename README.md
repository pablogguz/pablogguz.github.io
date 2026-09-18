# pablogguz.github.io

Personal site of Pablo García-Guzmán: [Eleventy](https://www.11ty.dev/), hand-written templates, one stylesheet. No theme.

```bash
npm install
npm run dev          # http://localhost:8090, live reload (drafts hidden)
npm run dev:drafts   # same, with src/blog/drafts/ included
npm run build        # production build into _site/
npm run preview      # build, then serve _site/ on :8091
```

## layout

```
src/
  _data/site.js          site config: name, nav, social links, giscus, coffee modal, post defaults
  _data/projects.toml    data-projects page (apps + r packages), same schema as before
  _data/policy.toml      policy-writing page
  _includes/             layouts (base, home, post) and partials (header, footer, coffee, post-extras)
  assets/                css/site.css · js/site.js · fonts · icons · favicon · giscus themes
  blog/posts/*.md        posts  (yaml front matter)
  blog/drafts/*.md       local-only drafts (gitignored)
  index.md               homepage bio
  img/                   post images, served at /img/
  projects.njk policy.njk tags.njk 404.njk feed.njk
eleventy.config.js       markdown pipeline (katex, footnotes, callouts, anchors), collections, filters
scripts/                 new-draft.sh · publish-draft.sh
```

## writing

Front matter keys: `title`, `date`, `description`, `tags`, `kind: note`, `series`, `featured`, `math`, `cover_image`, `toc`/`comment`/`cite` (false to opt out), `outdate_alert` + `outdate_alert_days`, `reading_time` (override), `draft`.

Callouts and figures are plain markdown containers, no template syntax inside posts:

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

Kinds: `note` `tip` `warning` `alert` `important` `question` `quote` `figure` `chart`. Math is `$…$` / `$$…$$`, rendered at build time.

Images live in `src/img/` and are copied to `/img/` at build time, so historical image URLs keep working.

## deploying

Automatic. Every push to `main` runs `.github/workflows/build.yml`, which does `npm ci && npm run build` and publishes `_site/` to the `gh-pages` branch.

The previous Zola version of this site is tagged `zola-final`.
