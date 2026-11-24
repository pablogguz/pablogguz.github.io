/* pablogguz.github.io — small, dependency-free.
   theme toggle · coffee modal · blog search · copy buttons · copy link · toc indicator
   reading progress · sidenotes · outdate alert · image zoom */
(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduceMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------- toast */
  let toastTimer;
  function toast(msg) {
    let el = $("#toast");
    if (!el) { el = document.createElement("div"); el.id = "toast"; el.setAttribute("role", "status"); document.body.appendChild(el); }
    el.textContent = msg;
    clearTimeout(toastTimer);
    requestAnimationFrame(() => el.classList.add("show"));
    toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
  }

  /* ---------------------------------------------------------- theme */
  const root = document.documentElement;
  const giscusTheme = (dark) => {
    const f = $("iframe.giscus-frame");
    if (f) f.contentWindow.postMessage({ giscus: { setConfig: { theme: `${location.origin}/assets/giscus-${dark ? "dark" : "light"}.css` } } }, "https://giscus.app");
  };
  const applyTheme = (dark) => {
    root.classList.toggle("dark", dark);
    try { localStorage.setItem("theme", dark ? "dark" : "light"); } catch (e) {}
    giscusTheme(dark);
  };
  const switchTheme = (dark) => {
    if (reduceMotion()) return applyTheme(dark);
    if (typeof document.startViewTransition === "function") return document.startViewTransition(() => applyTheme(dark));
    root.classList.add("theme-transition");
    applyTheme(dark);
    setTimeout(() => root.classList.remove("theme-transition"), 350);
  };
  $("#theme-toggle")?.addEventListener("click", () => switchTheme(!root.classList.contains("dark")));
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    let stored = null;
    try { stored = localStorage.getItem("theme"); } catch (err) {}
    if (!stored) switchTheme(e.matches);
  });
  window.addEventListener("message", function onGiscus(e) {
    if (e.origin !== "https://giscus.app" || !(e.data && e.data.giscus)) return;
    giscusTheme(root.classList.contains("dark"));
    window.removeEventListener("message", onGiscus);
  });

  /* ---------------------------------------------------------- coffee modal */
  const modal = $("#coffee-modal");
  if (modal) {
    $("#coffee-btn")?.addEventListener("click", (e) => { e.preventDefault(); modal.showModal(); });
    $(".modal-close", modal)?.addEventListener("click", () => modal.close());
    // click outside the panel closes it (the dialog element itself fills the
    // viewport, so compare against its content box rather than the target)
    modal.addEventListener("click", (e) => {
      const r = modal.getBoundingClientRect();
      const outside = e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
      if (outside) modal.close();
    });
    $("#copy-email", modal)?.addEventListener("click", (e) => {
      navigator.clipboard.writeText(e.currentTarget.dataset.email).then(() => toast("email address copied"));
    });
  }

  /* ---------------------------------------------------------- blog search */
  // /blog/: filter the rows across the full text of every post. The index
  // (/blog/search.json) is fetched the first time the field is used.
  const search = $("#blog-search");
  if (search) {
    const input = $("input", search), hint = $(".blog-search-hint", search), empty = $("#search-empty");
    const fold = (s) => String(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const escHTML = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const rows = $$(".post-list--rich .post-item").map((li) => {
      const name = $(".post-name", li), desc = $(".post-desc", li);
      return { li, url: $(".post-link", li).getAttribute("href"), name, desc, nameText: name.textContent, descText: desc ? desc.textContent : "" };
    });
    const groups = $$(".year-label").map((h) => ({ h, list: h.nextElementSibling }));
    let index = null, loading = null;
    const load = () => loading || (loading = fetch("/blog/search.json")
      .then((r) => r.json())
      .then((d) => { index = new Map(d.map((p) => [p.url, { text: p.text, f: fold(p.title + " " + p.desc + " " + p.text) }])); })
      .catch(() => { index = new Map(); }));
    // wrap every occurrence of the terms in <mark>, matching without accents or case
    const mark = (text, terms) => {
      const f = fold(text), ranges = [];
      terms.forEach((t) => { for (let k = f.indexOf(t); k >= 0; k = f.indexOf(t, k + t.length)) ranges.push([k, k + t.length]); });
      if (!ranges.length) return escHTML(text);
      ranges.sort((a, b) => a[0] - b[0]);
      let out = "", at = 0;
      for (const [s, e] of ranges) { if (s < at) continue; out += escHTML(text.slice(at, s)) + "<mark>" + escHTML(text.slice(s, e)) + "</mark>"; at = e; }
      return out + escHTML(text.slice(at));
    };
    // a few words either side of the first match in the body
    const snippet = (text, terms) => {
      const f = fold(text), k = Math.min(...terms.map((t) => f.indexOf(t)).filter((i) => i >= 0));
      let s = Math.max(0, k - 70), e = Math.min(text.length, k + 150);
      if (s > 0) s = text.indexOf(" ", s) + 1;
      if (e < text.length) e = text.lastIndexOf(" ", e);
      return (s > 0 ? "… " : "") + text.slice(s, e) + (e < text.length ? " …" : "");
    };
    const run = () => {
      const raw = input.value.trim(), terms = fold(raw).split(/\s+/).filter(Boolean);
      let shown = 0;
      rows.forEach((r) => {
        if (!terms.length) { r.li.hidden = false; r.name.textContent = r.nameText; if (r.desc) r.desc.textContent = r.descText; return; }
        const p = index && index.get(r.url);
        const hay = p ? p.f : fold(r.nameText + " " + r.descText);
        const hit = terms.every((t) => hay.includes(t));
        r.li.hidden = !hit;
        if (!hit) { r.name.textContent = r.nameText; if (r.desc) r.desc.textContent = r.descText; return; }
        shown++;
        r.name.innerHTML = mark(r.nameText, terms);
        if (!r.desc) return;
        const inBlurb = terms.some((t) => fold(r.nameText + " " + r.descText).includes(t));
        r.desc.innerHTML = mark(inBlurb || !p ? r.descText : snippet(p.text, terms), terms);
      });
      groups.forEach((g) => { g.h.hidden = g.list.hidden = !$$(".post-item", g.list).some((li) => !li.hidden); });
      empty.hidden = !terms.length || shown > 0;
      if (terms.length && !shown) empty.textContent = `nothing matches “${raw}”.`;
      hint.innerHTML = terms.length ? `${shown} of ${rows.length}` : "<kbd>/</kbd>";
      const u = new URL(location.href);
      if (raw) u.searchParams.set("q", raw); else u.searchParams.delete("q");
      history.replaceState(null, "", u);
    };
    search.hidden = false;
    input.addEventListener("focus", load, { once: true });
    input.addEventListener("input", () => { run(); if (!index) load().then(run); });
    input.addEventListener("keydown", (e) => { if (e.key === "Escape") { input.value = ""; run(); input.blur(); } });
    addEventListener("keydown", (e) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      if (/^(input|textarea|select)$/i.test(document.activeElement?.tagName || "") || document.activeElement?.isContentEditable) return;
      e.preventDefault(); input.focus();
    });
    // ?q= opens the page with a search already run (and keeps it on reload)
    const q0 = new URLSearchParams(location.search).get("q");
    if (q0) { input.value = q0; load().then(run); }
  }

  /* ---------------------------------------------------------- code copy */
  $$(".prose pre").forEach((pre) => {
    if (pre.closest(".codeblock")) return;
    const wrap = document.createElement("div");
    wrap.className = "codeblock";
    pre.replaceWith(wrap);
    wrap.appendChild(pre);
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "copy";
    btn.textContent = "copy";
    btn.addEventListener("click", () => {
      navigator.clipboard.writeText(pre.innerText).then(() => {
        btn.textContent = "copied";
        btn.classList.add("copied");
        setTimeout(() => { btn.textContent = "copy"; btn.classList.remove("copied"); }, 1500);
      });
    });
    wrap.appendChild(btn);
  });

  /* ---------------------------------------------------------- copy link */
  $("#copy-link")?.addEventListener("click", (e) => {
    navigator.clipboard.writeText(e.currentTarget.dataset.link).then(() => toast("link copied"));
  });
  /* each citation format has its own copy button */
  $$(".cite-copy").forEach((btn) => btn.addEventListener("click", () => {
    const text = btn.closest(".cite-block")?.querySelector(".cite-text")?.innerText;
    if (text) navigator.clipboard.writeText(text).then(() => toast("citation copied"));
  }));

  /* ---------------------------------------------------------- post page bits */
  const article = $(".post-article");
  if (article) {
    // reading progress
    const bar = document.createElement("div");
    bar.id = "progress";
    document.body.appendChild(bar);
    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      bar.style.transform = `scaleX(${max > 0 ? (doc.scrollTop || document.body.scrollTop) / max : 0})`;
    };
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", update);
    update();

    // toc active indicator
    const toc = $("#toc");
    if (toc && "IntersectionObserver" in window) {
      const links = new Map($$("a", toc).map((a) => [decodeURIComponent(a.hash.slice(1)), a]));
      let active = null;
      const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          const a = links.get(en.target.id);
          if (!a || a === active) return;
          active?.classList.remove("active");
          a.classList.add("active");
          active = a;
        });
      }, { rootMargin: "-8% 0px -85% 0px" });
      $$(".prose h2[id], .prose h3[id]").forEach((h) => io.observe(h));
    }

    // outdate alert
    const alert = $("#outdate-alert");
    if (alert) {
      const days = Math.floor((Date.now() - new Date(alert.dataset.date).getTime()) / 864e5);
      if (days >= Number(alert.dataset.days)) {
        $("p", alert).textContent = `This post was last updated ${days} days ago and may be out of date.`;
        alert.hidden = false;
      }
    }

    // sidenotes: footnotes float in the left margin on wide screens
    const defs = $$(".footnotes .footnote-item", article);
    if (defs.length) {
      const wide = matchMedia("(min-width: 1180px)");
      const notes = new Map();
      const layout = () => {
        article.classList.toggle("sidenotes-active", wide.matches);
        if (!wide.matches) return;
        let prevBottom = -Infinity;
        const top0 = article.getBoundingClientRect().top;
        defs.forEach((def) => {
          const ref = article.querySelector(`.footnote-ref a[href="#${def.id}"]`);
          if (!ref) return;
          let note = notes.get(def);
          if (!note) {
            note = document.createElement("aside");
            note.className = "sidenote";
            note.innerHTML = `<span class="sidenote-num">${ref.textContent}</span>` + def.innerHTML;
            $$(".footnote-backref", note).forEach((b) => b.remove());
            article.appendChild(note);
            notes.set(def, note);
            ref.addEventListener("click", (e) => {
              if (!wide.matches) return;
              e.preventDefault();
              note.classList.add("flash");
              setTimeout(() => note.classList.remove("flash"), 1200);
            });
          }
          const top = Math.max(ref.getBoundingClientRect().top - top0, prevBottom + 12);
          note.style.top = `${top}px`;
          prevBottom = top + note.offsetHeight;
        });
      };
      let t;
      const relayout = () => { clearTimeout(t); t = setTimeout(layout, 120); };
      addEventListener("resize", relayout);
      addEventListener("load", layout);
      wide.addEventListener("change", layout);
      layout();
    }
  }

  /* ---------------------------------------------------------- image zoom */
  if (window.Lightense) {
    addEventListener("load", () => Lightense(".prose img", { background: "rgba(20, 18, 14, 0.6)" }));
  }

})();
