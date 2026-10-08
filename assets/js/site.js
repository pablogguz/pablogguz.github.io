/* pablogguz.github.io — small, dependency-free.
   theme toggle · coffee modal · copy buttons · copy link · toc indicator
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
