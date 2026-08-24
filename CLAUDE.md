# CLAUDE.md

Personal website of Pablo García-Guzmán (pablogguz.github.io) — a static site built with [Zola](https://www.getzola.org/) on a heavily customized fork of the [serene](https://github.com/isunjn/serene) theme.

## Commands

```bash
zola serve            # dev server with live reload at http://127.0.0.1:1111
zola build            # production build into public/
zola check            # validate internal/external links
```

Deployment is automatic: every push to `main` triggers `.github/workflows/build.yml`, which builds the site with `zola-deploy-action` and publishes to the `gh-pages` branch. The `public/` directory is generated output — gitignored, never edit it by hand.

## Drafts

Unpublished essays must never reach the public repo. They live in `content/blog/drafts/`, which is **gitignored** (local-only); keep `draft = true` in their front matter as a second safety net so CI could never render one even if force-added.

- `zola serve` — public view, no drafts. `zola serve --drafts` — drafts appear in the blog list and render under `/blog/drafts/<slug>/`.
- `./scripts/new-draft.sh "essay title"` scaffolds a draft with front matter prefilled.
- `./scripts/publish-draft.sh <slug>` moves it into `content/blog/`, stamps today's date, and drops the draft flag; then commit + push to deploy.

## Architecture

- `config.toml` — site config. The `[extra]` block controls nav sections, social links, footer text, and the "coffee modal" guidelines.
- `content/` — all content:
  - `content/_index.md` — homepage bio text (rendered by `home.html`).
  - `content/blog/*.md` — blog posts. TOML front matter with `[taxonomies] tags` and `[extra]` flags (`toc`, `math`, `reading_time`, `outdate_alert`, `featured`, ...).
  - `content/policy/data.toml` — **data-driven policy page**. Each `[[project]]` entry has `name`, `desc`, `tags`, `pdf_url`, and `links` (an array of `{ name, url }` used for the "media coverage" strip). The page template iterates this file; no markdown editing needed to add a publication.
  - `content/projects/data.toml` — same pattern for the data-projects page, with `[[active]]` and `[[packages]]` arrays and extra URL fields (`r_url`, `shiny_url`, `github_url`).
  - `content/dataviz/data.toml` — chart-dump page data (section currently disabled in nav).
- `templates/` — root-level templates **override** the ones in `themes/serene/templates/`. All of them have been copied here and customized; edit these, not the theme.
- `themes/serene/sass/main.scss` — base structural CSS. It consumes CSS variables but defines almost no colors/fonts itself.
- `templates/_custom_css.html` — **the design system** ("carbon editorial"). All design tokens (accent color, fonts, radii, motion speeds, light/dark palettes) live in one commented block at the top; everything else derives from them via `color-mix()`. It is included *after* `main.css` in `_base.html`, so it wins the cascade without `!important`.
- `templates/_custom_font.html` — font loading (IBM Plex Sans / Mono / Serif from Google Fonts). Keep in sync with the `--font-*` tokens in `_custom_css.html`.
- `static/js/main.js` — theme toggle, link prefetching, scroll-reveal animations (`enableReveal`), and the post reading-progress bar (`enableScrollProgress`).

## Conventions

- The whole site uses a lowercase aesthetic (headings, nav, labels) — keep new copy lowercase unless it's a proper noun or publication title.
- Blog posts get an "essay tools" block (`templates/_post_extras.html`: share row, "cite this essay" plain-text + BibTeX box, older/newer nav) and a giscus comment section by default. Per-post opt-out via `cite = false` / `comment = false` in `[extra]`. giscus credentials live in `[extra.giscus]` in `config.toml`; its light/dark iframe themes are `static/giscus_light.css` / `static/giscus_dark.css` (keep in sync with the design tokens).
- Post front matter: `description` (shown under the title on the blog list and used for meta/OG description), `cover_image` (absolute URL, used for twitter/OG cards). `reading_time` is computed by Zola automatically; a manual `reading_time` in `[extra]` overrides it.
- With `sort_by = "date"`, `page.lower` is the *newer* neighbouring post and `page.higher` the *older* one (used in `_post_extras.html`).
- Atom feeds: `/feed.xml` (site) and `/blog/feed.xml` (blog); the rss button in the header and the `<link rel="alternate">` tags in `_head_extend.html` point at them.
- To restyle the site, change tokens in section 1 of `_custom_css.html` (e.g. `--accent`) rather than adding scattered rules.
- Callout boxes (`note`, `warning`, `alert`, ...) are `<blockquote class="callout ...">` produced by `templates/shortcodes/*.html` — plain blockquotes and callouts are styled separately.
- New policy publication: append a `[[project]]` block to `content/policy/data.toml`. Media coverage goes in its `links` array and renders under the "media coverage" label on the card.
- Animations must respect `prefers-reduced-motion` (see section 15 of `_custom_css.html` and the early return in `enableReveal`).
