function enableThemeToggle() {
  const themeToggle = document.querySelector('#theme-toggle');
  if (!themeToggle) return; // e.g. the 404 page has no toggle; _base.html already applied the stored theme
  const hlLink = document.querySelector('link#hl');
  const preferDark = window.matchMedia("(prefers-color-scheme: dark)");
  function toggleTheme(theme) {
    if (theme == "dark") document.body.classList.add('dark'); else document.body.classList.remove('dark');
    if (hlLink) hlLink.href = `/hl-${theme}.css`;
    themeToggle.innerHTML = theme == "dark" ? themeToggle.dataset.sunIcon : themeToggle.dataset.moonIcon;
    localStorage.setItem("theme", theme);
    toggleGiscusTheme(theme);
  }
  function toggleGiscusTheme(theme) {
    const iframe = document.querySelector('iframe.giscus-frame');
    if (iframe) iframe.contentWindow.postMessage({ giscus: { setConfig: { theme: `${location.origin}/giscus_${theme}.css` } } }, 'https://giscus.app');
  }
  function initGiscusTheme(evt) {
    if (evt.origin !== 'https://giscus.app') return;
    if (!(typeof evt.data === 'object' && evt.data.giscus)) return;
    toggleGiscusTheme(localStorage.getItem("theme") || (preferDark.matches ? "dark" : "light"));
    window.removeEventListener('message', initGiscusTheme);
  }
  window.addEventListener('message', initGiscusTheme);
  themeToggle.addEventListener('click', () => {
    document.body.classList.add('theme-transition');
    toggleTheme(localStorage.getItem("theme") == "dark" ? "light" : "dark");
    setTimeout(() => document.body.classList.remove('theme-transition'), 400);
  });
  preferDark.addEventListener("change", e => {
    document.body.classList.add('theme-transition');
    toggleTheme(e.matches ? "dark" : "light");
    setTimeout(() => document.body.classList.remove('theme-transition'), 400);
  });
  if (!localStorage.getItem("theme") && preferDark.matches) toggleTheme("dark");
  if (localStorage.getItem("theme") == "dark") toggleTheme("dark");
}

function enablePrerender() {
  const prerender = (a) => {
    if (!a.classList.contains('instant')) return;
    const script = document.createElement('script');
    script.type = 'speculationrules';
    script.textContent = JSON.stringify({ prerender: [{ source: 'list', urls: [a.href] }] });
    document.body.append(script);
    a.classList.remove('instant');
  }
  const prefetch = (a) => {
    if (!a.classList.contains('instant')) return;
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = a.href;
    document.head.append(link);
    a.classList.remove('instant');
  }
  const support = HTMLScriptElement.supports && HTMLScriptElement.supports('speculationrules');
  const handle = support ? prerender : prefetch;
  document.querySelectorAll('a.instant').forEach(a => {
    if (a.href.endsWith(window.location.pathname)) return;
    let timer;
    a.addEventListener('mouseenter', () => {
      timer = setTimeout(() => handle(a), 50);
    });
    a.addEventListener('mouseleave', () => clearTimeout(timer));
    a.addEventListener('touchstart', () => handle(a), { passive: true });
  });
}

function enableNavFold() {
  const nav = document.querySelector('header nav');
  if (!nav) return;
  const toggler = nav.querySelector('#toggler');
  if (!toggler) return;
  const foldItems = nav.querySelectorAll('.fold');
  toggler.addEventListener('click', () => {
    if (window.innerWidth < 768 && [...foldItems].every(item => !item.classList.contains('shown'))) return;
    foldItems.forEach(item => item.classList.toggle('shown'));
  });  
}

function enableRssMask() {
  const rssBtn = document.querySelector('#rss-btn');
  const mask = document.querySelector('#rss-mask');
  const copyBtn = document.querySelector('#rss-mask button');
  if (!rssBtn || !mask) return;
  rssBtn.addEventListener('click', (e) => {
    e.preventDefault();
    mask.showModal();
  });
  const close = (e) => {
    if (e.target == mask) mask.close();
  };
  mask.addEventListener('click', close);
  const copy = () => {
    navigator.clipboard.writeText(copyBtn.dataset.link).then(() => {
      copyBtn.innerHTML = copyBtn.dataset.checkIcon;
      copyBtn.classList.add('copied');
      copyBtn.removeEventListener('click', copy);
      setTimeout(() => {
        mask.close();
        copyBtn.innerHTML = copyBtn.dataset.copyIcon;
        copyBtn.classList.remove('copied');
        copyBtn.addEventListener('click', copy);
      }, 400);
    });
  }
  copyBtn.addEventListener('click', copy);
}

function enableOutdateAlert() {
  const alert = document.querySelector('#outdate_alert');
  if (!alert) return;
  const publish = document.querySelector('#publish');
  const updated = document.querySelector('#updated');
  const updateDate = new Date(updated ? updated.textContent : publish.textContent);
  const intervalDays = Math.floor((Date.now() - updateDate.getTime()) / (24 * 60 * 60 * 1000));
  const alertDays = parseInt(alert.dataset.days);
  if (intervalDays >= alertDays) {
    const msg = alert.dataset.alertTextBefore + intervalDays + alert.dataset.alertTextAfter;
    alert.querySelector('.content').textContent = msg;
    alert.classList.remove('hidden');
  }
}

function enableTocToggle() {
  const tocToggle = document.querySelector('#toc-toggle');
  if (!tocToggle) return;
  const header = document.querySelector('header');
  const blurred = header.classList.contains('blur');
  const aside = document.querySelector('aside');
  const anchors = aside.querySelectorAll('a');
  const toggle = () => {
    tocToggle.classList.toggle('active');
    aside.classList.toggle('shown');
    if (blurred) header.classList.toggle('blur');
  };
  tocToggle.addEventListener('click', toggle);
  anchors.forEach(header => header.addEventListener('click', toggle));
}

function enableTocIndicate() {
  const toc = document.querySelector('aside nav');
  if (!toc) return;
  const headers = document.querySelectorAll('h2, h3');
  const tocMap = new Map();
  headers.forEach(header => tocMap.set(header, toc.querySelector(`a[href="#${header.id}"]`)));
  let activated = null;
  const observer = new IntersectionObserver((entries) => entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = tocMap.get(entry.target);
      if (target == activated) return;
      if (activated) activated.classList.remove('active');
      target.classList.add('active');
      activated = target;
    }
  }), { rootMargin: '-9% 0px -90% 0px' });
  headers.forEach(header => observer.observe(header));
}

function enableTocTooltip() {
  const anchors = document.querySelectorAll('aside nav a');
  if (anchors.length == 0) return;
  const toggleTooltip = () => {
    anchors.forEach(anchor => {
      if (anchor.offsetWidth < anchor.scrollWidth) {
        anchor.setAttribute('title', anchor.textContent);
      } else {
        anchor.removeAttribute('title');
      }
    });
  };
  window.addEventListener('resize', toggleTooltip);
  toggleTooltip();
}

function addCopyBtns() {
  const cfg = document.querySelector('#copy-cfg');
  if (!cfg) return;
  const copyIcon = cfg.dataset.copyIcon;
  const checkIcon = cfg.dataset.checkIcon;
  document.querySelectorAll('pre').forEach(block => {
    if (block.classList.contains('mermaid')) return;
    const wrapper = document.createElement('div');
    wrapper.className = 'codeblock';
    const btn = document.createElement('button');
    btn.className = 'copy';
    btn.ariaLabel = 'copy';
    btn.innerHTML = copyIcon;
    const copy = () => {
      navigator.clipboard.writeText(block.textContent).then(() => {
        btn.innerHTML = checkIcon;
        btn.classList.add('copied');
        btn.removeEventListener('click', copy);
        setTimeout(() => {
          btn.innerHTML = copyIcon;
          btn.classList.remove('copied');
          btn.addEventListener('click', copy);
        }, 1500);
      });
    };
    btn.addEventListener('click', copy);
    wrapper.appendChild(block.cloneNode(true));
    wrapper.appendChild(btn);
    block.replaceWith(wrapper);
  });
}

function addBackToTopBtn() {
  const backBtn = document.querySelector('#back-to-top');
  if (!backBtn) return;
  const toTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const toggle = () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    if (scrollTop > 200 && !backBtn.classList.contains('shown')) {
      backBtn.classList.add('shown');
      backBtn.addEventListener('click', toTop);
    } else if (scrollTop <= 200 && backBtn.classList.contains('shown')) {
      backBtn.classList.remove('shown');
      backBtn.removeEventListener('click', toTop);
    }
  };
  window.addEventListener('scroll', toggle);
  toggle();
}

function addFootnoteBacklink() {
  const backlinkIcon = document.querySelector('.prose').dataset.backlinkIcon;
  const footnotes = document.querySelectorAll('.footnote-definition');
  footnotes.forEach(footnote => {
    const backlink = document.createElement('button');
    backlink.className = 'backlink';
    backlink.ariaLabel = 'backlink';
    backlink.innerHTML = backlinkIcon;
    backlink.addEventListener('click', () => window.scrollTo({
      top: document.querySelector(`.footnote-reference a[href="#${footnote.id}"]`).getBoundingClientRect().top + window.scrollY - 50,
    }));
    footnote.appendChild(backlink);
  });
}

function enableSidenotes() {
  const article = document.querySelector('article.prose');
  if (!article) return;
  const defs = article.querySelectorAll('.footnote-definition');
  if (!defs.length) return;
  const wide = window.matchMedia('(min-width: 1280px)');
  const notes = new Map();
  const layout = () => {
    article.classList.toggle('sidenotes-active', wide.matches);
    if (!wide.matches) return;
    let prevBottom = -Infinity;
    const articleTop = article.getBoundingClientRect().top;
    defs.forEach(def => {
      const ref = article.querySelector(`.footnote-reference a[href="#${def.id}"]`);
      if (!ref) return;
      let note = notes.get(def);
      if (!note) {
        note = document.createElement('aside');
        note.className = 'sidenote';
        note.innerHTML = `<span class="sidenote-num">${ref.textContent}</span>` + def.innerHTML;
        const label = note.querySelector('sup.footnote-definition-label');
        if (label) label.remove();
        note.querySelectorAll('button.backlink').forEach(b => b.remove());
        article.appendChild(note);
        notes.set(def, note);
        ref.addEventListener('click', (e) => {
          if (!wide.matches) return;
          e.preventDefault();
          note.classList.add('flash');
          setTimeout(() => note.classList.remove('flash'), 1200);
        });
      }
      const top = Math.max(ref.getBoundingClientRect().top - articleTop, prevBottom + 12);
      note.style.top = `${top}px`;
      prevBottom = top + note.offsetHeight;
    });
  };
  let timer;
  const relayout = () => { clearTimeout(timer); timer = setTimeout(layout, 150); };
  window.addEventListener('resize', relayout);
  window.addEventListener('load', layout);
  wide.addEventListener('change', layout);
  layout();
}

function enableCopyLink() {
  const btn = document.querySelector('#copy-link-btn');
  if (!btn) return;
  const original = btn.textContent;
  btn.addEventListener('click', () => {
    navigator.clipboard.writeText(btn.dataset.link).then(() => {
      btn.textContent = 'copied!';
      setTimeout(() => { btn.textContent = original; }, 1500);
    });
  });
}

function enableImgLightense() {
  window.addEventListener("load", () => Lightense(".prose img", { background: 'rgba(43, 43, 43, 0.19)' }));
}

/* Function for clickable description buttons */
// document.querySelectorAll('.desc-button').forEach(button => {
//   button.addEventListener('click', () => {
//     const desc = button.nextElementSibling;
//     desc.style.display = desc.style.display === 'none' ? 'block' : 'none';
//     button.classList.toggle('collapsed');
//   });
// });

function enableReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;
  const targets = document.querySelectorAll('.project-card, .viz-card, .layout-list .post, .section-title');
  if (!targets.length) return;
  targets.forEach(el => el.classList.add('will-reveal'));
  let batch = 0;
  let lastTime = 0;
  const observer = new IntersectionObserver((entries) => {
    const now = performance.now();
    if (now - lastTime > 150) batch = 0;
    lastTime = now;
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.style.transitionDelay = `${Math.min(batch++ * 55, 440)}ms`;
      entry.target.classList.add('revealed');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -4% 0px' });
  targets.forEach(el => observer.observe(el));
}

function enableScrollProgress() {
  if (!document.body.classList.contains('post')) return;
  const bar = document.createElement('div');
  bar.id = 'scroll-progress';
  document.body.appendChild(bar);
  const update = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    const scrolled = doc.scrollTop || document.body.scrollTop;
    bar.style.transform = `scaleX(${max > 0 ? scrolled / max : 0})`;
  };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}


/* ---------- notebook extras: stats count-up, read stamps, toast, konami ---------- */

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// per-visitor list of finished essays — lives only in this browser
const READ_KEY = 'pgg:read';
function getRead() {
  try {
    const raw = localStorage.getItem(READ_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch (e) { return []; }
}
function addRead(id) {
  const arr = getRead();
  if (arr.includes(id)) return false;
  arr.push(id);
  try { localStorage.setItem(READ_KEY, JSON.stringify(arr)); } catch (e) { /* private mode etc. */ }
  return true;
}

function showToast(kicker, msg, ms = 3200) {
  let toast = document.querySelector('#toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.setAttribute('role', 'status');
    toast.innerHTML = '<span class="toast-kicker"></span><span class="toast-msg"></span>';
    document.body.appendChild(toast);
  }
  toast.querySelector('.toast-kicker').textContent = kicker;
  toast.querySelector('.toast-msg').textContent = msg;
  clearTimeout(toast._timer);
  requestAnimationFrame(() => toast.classList.add('show'));
  toast._timer = setTimeout(() => toast.classList.remove('show'), ms);
}

// homepage player card: numbers count up from 0
function enableCountUp() {
  const nums = document.querySelectorAll('#player-card .stat-n');
  if (!nums.length) return;
  nums.forEach((el, i) => {
    const target = parseInt(el.textContent, 10);
    if (!Number.isFinite(target) || reducedMotion()) return;
    const duration = 900, delay = 700 + i * 90, start = performance.now() + delay;
    el.textContent = '0';
    const tick = (now) => {
      const t = Math.min(1, Math.max(0, (now - start) / duration));
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = String(Math.round(target * eased));
      if (t < 1) requestAnimationFrame(tick); else el.textContent = String(target);
    };
    requestAnimationFrame(tick);
  });
}

function enableReadTracker() {
  const read = getRead();

  // post page: reaching the tombstone marks the essay as read
  const article = document.querySelector('article.prose[data-post-id]');
  const end = document.querySelector('#essay-end');
  if (article && end) {
    const id = article.dataset.postId;
    const kind = article.dataset.kind === 'note' ? 'note' : 'post';
    const label = end.querySelector('.essay-end-label');
    const finish = (fresh) => {
      end.classList.add('done');
      if (label) label.textContent = `${kind} complete ✓`;
      if (fresh) showToast('achievement', `${kind} complete · +1`);
    };
    if (read.includes(id)) {
      finish(false);
    } else if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver((entries) => {
        if (!entries.some(e => e.isIntersecting)) return;
        obs.disconnect();
        finish(addRead(id));
      }, { threshold: 0.5 });
      obs.observe(end);
    }
  }

  // list pages: stamp finished essays, fill the progress bar
  const posts = document.querySelectorAll('.layout-list .post[data-post-id]');
  posts.forEach(a => { if (read.includes(a.dataset.postId)) a.classList.add('is-read'); });
  const progress = document.querySelector('.read-progress');
  if (progress) {
    const total = parseInt(progress.dataset.total, 10) || 0;
    const done = document.querySelectorAll('.post-list.essays .post.is-read').length;
    const b = progress.querySelector('b');
    const bar = progress.querySelector('.read-progress-bar i');
    if (b) b.textContent = String(done);
    if (total > 0 && done >= total) {
      progress.classList.add('complete');
      const lbl = progress.querySelector('.read-progress-label');
      if (lbl) lbl.innerHTML = `all ${total} read ✓`;
    }
    if (bar) requestAnimationFrame(() => { bar.style.width = `${total ? Math.round(100 * done / total) : 0}%`; });
  }

  // homepage: "you have read x of n essays"
  const xp = document.querySelector('#reader-xp');
  if (xp) {
    const essays = (xp.dataset.essays || '').split(',').filter(Boolean);
    const done = essays.filter(slug => read.includes(slug)).length;
    if (done > 0) {
      const b = xp.querySelector('b');
      if (b) b.textContent = String(done);
      if (done >= essays.length) {
        const link = xp.querySelector('a');
        if (link) link.textContent = 'all of them. thank you ♥';
      }
      xp.hidden = false;
    }
  }
}

// ↑ ↑ ↓ ↓ ← → ← → b a — a shower of data points
function enableKonami() {
  const seq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let pos = 0;
  window.addEventListener('keydown', (e) => {
    if (e.target && ['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    pos = key === seq[pos] ? pos + 1 : (key === seq[0] ? 1 : 0);
    if (pos !== seq.length) return;
    pos = 0;
    showToast('achievement unlocked', 'konami · significant at the 1% level', 4200);
    if (!reducedMotion()) confetti();
  });
}

function confetti() {
  if (document.querySelector('#confetti')) return;
  const canvas = document.createElement('canvas');
  canvas.id = 'confetti';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const resize = () => {
    canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr;
    canvas.style.width = innerWidth + 'px'; canvas.style.height = innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  const styles = getComputedStyle(document.body);
  const colors = [styles.getPropertyValue('--accent').trim(), styles.getPropertyValue('--accent-2').trim(), styles.getPropertyValue('--live').trim()];
  const parts = Array.from({ length: 140 }, () => ({
    x: Math.random() * innerWidth,
    y: -20 - Math.random() * innerHeight * 0.5,
    r: 2 + Math.random() * 3.5,
    vx: (Math.random() - 0.5) * 1.6,
    vy: 2 + Math.random() * 3.5,
    rot: Math.random() * Math.PI,
    vr: (Math.random() - 0.5) * 0.2,
    bar: Math.random() < 0.35,
    c: colors[Math.floor(Math.random() * colors.length)],
  }));
  const t0 = performance.now();
  const frame = (now) => {
    const t = (now - t0) / 1000;
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    parts.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.vy += 0.03; p.rot += p.vr;
      ctx.fillStyle = p.c;
      ctx.globalAlpha = Math.max(0, Math.min(1, 3.6 - t));
      if (p.bar) {
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.fillRect(-p.r, -p.r * 2.2, p.r * 2, p.r * 4.4); ctx.restore();
      } else {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
    });
    if (t < 3.8) requestAnimationFrame(frame); else canvas.remove();
  };
  requestAnimationFrame(frame);
}

function enable404() {
  const el = document.querySelector('#na-path');
  if (el) el.textContent = location.pathname;
}

//--------------------------------------------

enableThemeToggle();
enableReveal();
enableScrollProgress();
enablePrerender();
enableNavFold();
enableRssMask();
if (document.body.classList.contains('post')) {
  enableOutdateAlert();
  enableTocToggle();
  enableTocIndicate();
  addBackToTopBtn();
  enableTocTooltip();
  enableCopyLink();
}
if (document.querySelector('.prose')) {
  addCopyBtns();
  addFootnoteBacklink();
  enableImgLightense();
}
if (document.body.classList.contains('post')) {
  enableSidenotes();
}
enableCountUp();
enableReadTracker();
enableKonami();
enable404();
