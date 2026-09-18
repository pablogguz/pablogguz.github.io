// local-only drafts: this folder is gitignored (except this file).
// build/serve them with `npm run dev:drafts`; `npm run publish -- <slug>` moves one into posts/.
export default {
  layout: "post.njk",
  templateEngineOverride: "md",
  permalink: "/blog/drafts/{{ page.fileSlug }}/",
  draft: true,
};
