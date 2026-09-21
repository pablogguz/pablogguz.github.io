import { readFileSync } from "node:fs";
import rssPlugin from "@11ty/eleventy-plugin-rss";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import markdownIt from "markdown-it";
import anchor from "markdown-it-anchor";
import footnote from "markdown-it-footnote";
import container from "markdown-it-container";
import katex from "katex";
import { parse as parseToml } from "smol-toml";

/* ------------------------------------------------------------------ helpers */

const slugify = (s) =>
  String(s)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const icon = (name) => {
  try { return readFileSync(`src/assets/icons/${name}.svg`, "utf8").trim(); } catch { return ""; }
};

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** `key="value" key2="v2"` → object; a bare string becomes { header } */
function parseParams(rest) {
  const attrs = {};
  const re = /(\w+)\s*=\s*"((?:[^"\\]|\\.)*)"/g;
  let m, any = false;
  while ((m = re.exec(rest))) { attrs[m[1]] = m[2].replace(/\\"/g, '"'); any = true; }
  if (!any && rest.trim()) attrs.header = rest.trim();
  return attrs;
}

/* ------------------------------------------------------------- math plugin */
/* $…$ and $$…$$ rendered with KaTeX at build time. The raw source gets the
   same backslash-unescaping CommonMark would apply, so posts written for the
   old site (`\\{` meaning `\{`) render identically. */

const unescapeMath = (s) => s.replace(/\\([!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])/g, "$1");
const render = (src, display) => katex.renderToString(unescapeMath(src), { displayMode: display, throwOnError: false, strict: "ignore" });

function mathPlugin(md) {
  md.inline.ruler.after("escape", "math_inline", (state, silent) => {
    const src = state.src, start = state.pos;
    if (src.charCodeAt(start) !== 0x24) return false;
    // $$ … $$ inline → display block
    if (src.charCodeAt(start + 1) === 0x24) {
      const end = src.indexOf("$$", start + 2);
      if (end < 0) return false;
      if (!silent) { const t = state.push("math_block", "math", 0); t.content = src.slice(start + 2, end); t.block = true; }
      state.pos = end + 2;
      return true;
    }
    const next = src.charCodeAt(start + 1);
    if (next === 0x20 || next === 0x09 || next === 0x0a) return false;
    let end = start + 1;
    for (;;) {
      end = src.indexOf("$", end);
      if (end < 0) return false;
      const prev = src.charCodeAt(end - 1);
      if (prev !== 0x5c && prev !== 0x20) break;
      end++;
    }
    if (end === start + 1) return false;
    const after = src.charCodeAt(end + 1);
    if (after >= 0x30 && after <= 0x39) return false;
    if (!silent) { const t = state.push("math_inline", "math", 0); t.content = src.slice(start + 1, end); }
    state.pos = end + 1;
    return true;
  });

  md.block.ruler.before("fence", "math_block", (state, startLine, endLine, silent) => {
    let pos = state.bMarks[startLine] + state.tShift[startLine];
    let max = state.eMarks[startLine];
    if (pos + 2 > max || state.src.slice(pos, pos + 2) !== "$$") return false;
    pos += 2;
    let firstLine = state.src.slice(pos, max), lastLine = "", found = false, nextLine = startLine;
    if (firstLine.trim().endsWith("$$")) { firstLine = firstLine.trim().slice(0, -2); found = true; }
    while (!found) {
      nextLine++;
      if (nextLine >= endLine) break;
      pos = state.bMarks[nextLine] + state.tShift[nextLine];
      max = state.eMarks[nextLine];
      if (pos < max && state.tShift[nextLine] < state.blkIndent) break;
      const line = state.src.slice(pos, max);
      if (line.trim().endsWith("$$")) {
        lastLine = line.trim().slice(0, -2);
        found = true;
      }
    }
    if (!found) return false;
    if (silent) return true;
    const body = nextLine > startLine ? state.getLines(startLine + 1, nextLine, state.tShift[startLine], true) : "";
    const t = state.push("math_block", "math", 0);
    t.block = true;
    t.content = (firstLine ? firstLine + "\n" : "") + body + lastLine;
    t.map = [startLine, nextLine + 1];
    state.line = nextLine + 1;
    return true;
  }, { alt: ["paragraph", "reference", "blockquote", "list"] });

  // $…$ inside raw HTML blocks (markdown does not parse those), e.g. a note under a table
  md.core.ruler.after("block", "math_in_html", (state) => {
    for (const t of state.tokens) {
      if (t.type !== "html_block" || /<(pre|code|script|style)\b/i.test(t.content)) continue;
      t.content = t.content.replace(/\$(?!\s)([^$\n]+?)(?<!\s)\$(?!\d)/g, (_, src) => render(src, false));
    }
  });

  md.renderer.rules.math_inline = (tokens, i) => render(tokens[i].content, false);
  md.renderer.rules.math_block = (tokens, i) => `<div class="math-display">${render(tokens[i].content, true)}</div>\n`;
}

/* ---------------------------------------------- headings: demote + collect */
/* posts use `#` for sections; the layout already has the title as <h1>, so
   shift everything one level down (h1→h2 …) for sane document outline. */
function demoteHeadings(md) {
  md.core.ruler.after("block", "demote_headings", (state) => {
    const heads = state.tokens.filter((t) => t.type === "heading_open" || t.type === "heading_close");
    if (!heads.some((t) => t.tag === "h1")) return;
    for (const t of heads) {
      const lvl = Math.min(6, Number(t.tag[1]) + 1);
      t.tag = `h${lvl}`;
    }
  });
}

/* -------------------------------------------------------------- containers */
const CALLOUTS = ["note", "tip", "warning", "alert", "important", "question"];

function containers(md) {
  for (const name of CALLOUTS) {
    md.use(container, name, {
      render(tokens, idx) {
        const t = tokens[idx];
        if (t.nesting === 1) {
          const a = parseParams(t.info.trim().slice(name.length));
          return `<aside class="callout callout-${name}"><div class="callout-icon">${icon(name)}</div><div class="callout-body">` +
            (a.header ? `<p class="callout-header">${esc(a.header)}</p>\n` : "");
        }
        return "</div></aside>\n";
      },
    });
  }
  md.use(container, "quote", {
    render(tokens, idx, _o, env) {
      const t = tokens[idx];
      if (t.nesting === 1) {
        env.__cite = parseParams(t.info.trim().slice(5)).cite || parseParams(t.info.trim().slice(5)).header;
        return `<blockquote class="quote">`;
      }
      const cite = env.__cite ? `<footer class="quote-cite">— ${md.renderInline(env.__cite)}</footer>` : "";
      env.__cite = null;
      return `${cite}</blockquote>\n`;
    },
  });
  md.use(container, "figure", {
    render(tokens, idx) {
      const t = tokens[idx];
      if (t.nesting === 1) {
        const a = parseParams(t.info.trim().slice(6));
        const cap = a.via ? `<a href="${esc(a.via)}">via</a>` : esc(a.caption || "");
        return `<figure><img src="${esc(a.src)}" alt="${esc(a.alt || a.caption || "")}" loading="lazy" decoding="async">` +
          (cap ? `<figcaption>${cap}</figcaption>` : "");
      }
      return "</figure>\n";
    },
  });
  md.use(container, "chart", {
    render(tokens, idx, _o, env) {
      const t = tokens[idx];
      if (t.nesting === 1) {
        env.__fig = (env.__fig || 0) + 1;
        const n = env.__fig;
        const a = parseParams(t.info.trim().slice(5));
        const foot = (a.note || a.source)
          ? `<figcaption class="chart-foot">${a.note ? `<span>${esc(a.note)}</span>` : ""}${a.source ? `<span>source: ${esc(a.source)}</span>` : ""}</figcaption>`
          : "";
        env.__chartFoot = foot;
        return `<figure class="chart" id="figure-${n}"><div class="chart-head"><a class="chart-anchor" href="#figure-${n}">figure ${n}</a>` +
          (a.title ? `<span class="chart-title">${esc(a.title)}</span>` : "") +
          (a.subtitle ? `<span class="chart-subtitle">${esc(a.subtitle)}</span>` : "") +
          `</div><img src="${esc(a.src)}" alt="${esc(a.alt || a.title || "chart")}" loading="lazy" decoding="async">`;
      }
      const foot = env.__chartFoot || "";
      env.__chartFoot = "";
      return `${foot}</figure>\n`;
    },
  });
}

/* ---------------------------------------------------------------- markdown */
const md = markdownIt({ html: true, linkify: false, typographer: false })
  .use(footnote)
  .use(mathPlugin)
  .use(demoteHeadings)
  .use(containers)
  .use(anchor, {
    slugify,
    level: [1, 2, 3, 4],
    permalink: anchor.permalink.linkInsideHeader({ symbol: "#", placement: "after", class: "heading-anchor", ariaHidden: true }),
  });

// footnote markup: plain numbers, no brackets
md.renderer.rules.footnote_caption = (tokens, idx) => {
  let n = Number(tokens[idx].meta.id + 1).toString();
  if (tokens[idx].meta.subId > 0) n += ":" + tokens[idx].meta.subId;
  return n;
};

/* ------------------------------------------------------------------ config */
export default function (eleventyConfig) {
  eleventyConfig.setLibrary("md", md);
  eleventyConfig.addDataExtension("toml", (contents) => parseToml(contents));
  eleventyConfig.addPlugin(rssPlugin);
  eleventyConfig.addPlugin(syntaxHighlight, { preAttributes: { tabindex: 0 } });

  // Eleventy ignores gitignored files by default, which would hide the
  // (gitignored) drafts folder even from `npm run dev:drafts`. Input is src/
  // only, so turning that off is safe.
  eleventyConfig.setUseGitIgnore(false);

  // drafts never build unless DRAFTS=1 (npm run dev:drafts)
  eleventyConfig.addPreprocessor("drafts", "*", (data) => {
    if (data.draft && !process.env.DRAFTS) return false;
  });

  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/img": "img" });
  eleventyConfig.addPassthroughCopy({ "node_modules/katex/dist/katex.min.css": "assets/katex/katex.min.css" });
  eleventyConfig.addPassthroughCopy({ "node_modules/katex/dist/fonts": "assets/katex/fonts" });
  eleventyConfig.addWatchTarget("src/assets/");

  eleventyConfig.addCollection("posts", (api) =>
    api.getFilteredByGlob(["src/blog/posts/*.md", "src/blog/drafts/*.md"]).sort((a, b) => b.date - a.date)
  );

  eleventyConfig.addShortcode("icon", icon);
  eleventyConfig.addShortcode("year", () => String(new Date().getFullYear()));

  eleventyConfig.addFilter("dateDisplay", (d) => (d instanceof Date ? d : new Date(d)).toISOString().slice(0, 10));
  eleventyConfig.addFilter("dateYear", (d) => (d instanceof Date ? d : new Date(d)).getUTCFullYear());
  eleventyConfig.addFilter("dateMonth", (d) => String((d instanceof Date ? d : new Date(d)).getUTCMonth() + 1).padStart(2, "0"));
  eleventyConfig.addFilter("head", (arr, n) => (arr || []).slice(0, n));
  eleventyConfig.addFilter("wordCount", (html) => String(html || "").replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length);
  eleventyConfig.addFilter("readingTime", (html) => {
    const text = String(html || "")
      .replace(/<span class="katex-mathml">[\s\S]*?<\/span><\/span>/g, " ")  // katex emits mathml + html; count once
      .replace(/<[^>]+>/g, " ");
    const words = text.split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
  });
  // first sentences of the post body, trimmed to a whole word. Used as the
  // automatic blurb on /blog/ for posts without an explicit description.
  eleventyConfig.addFilter("excerpt", (html, n = 165) => {
    let src = String(html || "");
    const i = src.indexOf('<div class="prose">');   // on post pages, skip the header block
    if (i >= 0) src = src.slice(i);
    const text = src
      // drop whole blocks that are not running prose
      .replace(/<aside[\s\S]*?<\/aside>/g, " ")
      .replace(/<figure[\s\S]*?<\/figure>/g, " ")
      .replace(/<blockquote[\s\S]*?<\/blockquote>/g, " ")
      .replace(/<(pre|table)[\s\S]*?<\/\1>/g, " ")
      .replace(/<h[1-6][\s\S]*?<\/h[1-6]>/g, " ")
      // block boundaries become spaces, inline tags vanish so words stay joined
      .replace(/<\/(p|div|li|ul|ol|section)>/g, " ")
      .replace(/<br\s*\/?>/g, " ")
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&#39;|&rsquo;|&lsquo;/g, "\u2019")
      .replace(/&quot;|&ldquo;|&rdquo;/g, '"')
      .replace(/&[a-z]+;/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (text.length <= n) return text;
    const cut = text.slice(0, n);
    return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:.\u2013\u2014-]+$/, "") + "\u2026";
  });

  eleventyConfig.addFilter("toc", (html) => {
    const items = [];
    const re = /<h([23]) id="([^"]+)"[^>]*>([\s\S]*?)<\/h\1>/g;
    let m;
    while ((m = re.exec(html))) {
      const text = m[3].replace(/<a class="heading-anchor"[\s\S]*?<\/a>/, "").replace(/<[^>]+>/g, "").trim();
      items.push({ level: Number(m[1]), id: m[2], text });
    }
    const tree = [];
    for (const it of items) {
      if (it.level === 2 || tree.length === 0) tree.push({ ...it, children: [] });
      else tree[tree.length - 1].children.push(it);
    }
    return tree;
  });
  eleventyConfig.addFilter("whereSeries", (posts, name) => (posts || []).filter((p) => p.data.series === name).sort((a, b) => a.date - b.date));
  eleventyConfig.addFilter("bibKey", (slug, year) => `garciaguzman${year}${String(slug).replace(/-/g, "")}`);

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
