/* window light — the homepage background. Dependency-free, one IIFE.
   By day, only shade: the soft shadow of a branch outside the window falls
   across the page in two layers (a near branch, sharper and darker; a far
   one, larger and very soft), each shoot swaying from its base and every
   leaf fluttering on its own, drifting slowly as the sun moves. By night
   (dark theme), a lamp across the street shines through a blind: the slats
   ripple in a breeze, the near branch cuts the light, and dust glints only
   inside the lit slats; moving the pointer stirs it. Morning light falls
   from the left, afternoon light from the right.
   The shade and the lamplight are painted off-screen at reduced resolution
   (a quarter on desktop, more on phones so the leaves stay legible), then
   softened into the visible canvas by averaging a ring of offset copies;
   the browser's upscale does the rest. No CSS filter: a filter re-blurs
   the whole screen every frame, which halves the frame rate on a phone.
   Layers are painted as full-strength white masks, softened, then tinted
   with their colour; how faint they are is the canvas's CSS opacity. (At
   10% alpha, 8-bit channels cannot survive being split into thirteen
   copies: they round unevenly and the shade turns blue.)
   On phones the address bar comes and goes as you scroll, which fires
   resize events. The stage is sized to the large viewport (100lvh) so it
   does not change, and resizes that only move the address bar are ignored;
   a real resize (rotation) repaints in the same frame, so nothing blinks.
   Colours come from --shade and --lamp in site.css. */
(() => {
  "use strict";
  const stage = document.querySelector(".bg-stage");
  if (!stage) return;
  const root = document.documentElement;
  const near = stage.querySelector(".bg-near"), far = stage.querySelector(".bg-far"), dust = stage.querySelector(".bg-dust");
  const nearSrc = document.createElement("canvas"), farSrc = document.createElement("canvas");
  const nctx = nearSrc.getContext("2d"), fctx = farSrc.getContext("2d"), dctx = dust.getContext("2d");
  const nvis = near.getContext("2d"), fvis = far.getContext("2d");
  const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const TAU = Math.PI * 2;
  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  const lerp = (a, b, t) => a + (b - a) * t;
  const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
  const hexRGB = (h) => { h = h.trim().replace("#", ""); if (h.length === 3) h = [...h].map((c) => c + c).join(""); const n = parseInt(h, 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
  function rng(seed) {
    let s = seed >>> 0 || 1;
    return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
  }

  /* ---------------------------------------------------------- 3D simplex noise (after Gustavson), seeded */
  const noise = (() => {
    const g3 = [1,1,0, -1,1,0, 1,-1,0, -1,-1,0, 1,0,1, -1,0,1, 1,0,-1, -1,0,-1, 0,1,1, 0,-1,1, 0,1,-1, 0,-1,-1];
    const r = rng(1917), p = new Uint8Array(256);
    for (let i = 0; i < 256; i++) p[i] = i;
    for (let i = 255; i > 0; i--) { const j = Math.floor(r() * (i + 1)); const t = p[i]; p[i] = p[j]; p[j] = t; }
    const perm = new Uint8Array(512), pm = new Uint8Array(512);
    for (let i = 0; i < 512; i++) { perm[i] = p[i & 255]; pm[i] = perm[i] % 12; }
    const F = 1 / 3, G = 1 / 6;
    const corner = (gi, x, y, z) => {
      let t = 0.6 - x * x - y * y - z * z;
      if (t < 0) return 0;
      t *= t; gi *= 3;
      return t * t * (g3[gi] * x + g3[gi + 1] * y + g3[gi + 2] * z);
    };
    return (x, y, z) => {
      const s = (x + y + z) * F;
      const i = Math.floor(x + s), j = Math.floor(y + s), k = Math.floor(z + s);
      const t = (i + j + k) * G;
      const x0 = x - i + t, y0 = y - j + t, z0 = z - k + t;
      let i1, j1, k1, i2, j2, k2;
      if (x0 >= y0) {
        if (y0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
        else if (x0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1; }
        else { i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1; }
      } else {
        if (y0 < z0) { i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1; }
        else if (x0 < z0) { i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1; }
        else { i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
      }
      const ii = i & 255, jj = j & 255, kk = k & 255;
      return 32 * (
        corner(pm[ii + perm[jj + perm[kk]]], x0, y0, z0) +
        corner(pm[ii + i1 + perm[jj + j1 + perm[kk + k1]]], x0 - i1 + G, y0 - j1 + G, z0 - k1 + G) +
        corner(pm[ii + i2 + perm[jj + j2 + perm[kk + k2]]], x0 - i2 + 2 * G, y0 - j2 + 2 * G, z0 - k2 + 2 * G) +
        corner(pm[ii + 1 + perm[jj + 1 + perm[kk + 1]]], x0 - 1 + 3 * G, y0 - 1 + 3 * G, z0 - 1 + 3 * G)
      );
    };
  })();

  /* ---------------------------------------------------------- the branch */
  /* a seeded branch: a curved stem with alternating leaves and a few side
     shoots, each shoot swaying on its own */
  function grow(r, len, depth, rootLen) {
    const seg = { len, bend: (r() - 0.5) * len * 0.3, ang: 0, w: Math.max(1.2, len * 0.012), leaves: [], kids: [],
      sw: (0.018 + r() * 0.02) * (1 + depth * 0.7), sf: 0.55 + r() * 0.5, ph: r() * TAU };
    const n = Math.max(3, Math.round(len / 24));
    for (let i = 0; i < n; i++) {
      const s = 0.16 + 0.8 * i / (n - 1);
      seg.leaves.push({ s, side: i % 2 ? 1 : -1, size: lerp(0.105, 0.06, s) * rootLen * (0.8 + r() * 0.35) * (depth ? 0.9 : 1), ph: r() * TAU });
    }
    seg.leaves.push({ s: 1, side: 0, size: 0.07 * rootLen, ph: r() * TAU });
    if (depth < 2) {
      const kn = depth === 0 ? 3 : 1;
      for (let k = 0; k < kn; k++) {
        const kid = grow(r, len * (0.42 + r() * 0.16), depth + 1, rootLen);
        kid.ang = (k % 2 ? 1 : -1) * (0.5 + r() * 0.35);
        seg.kids.push({ s: 0.28 + 0.55 * (k + r() * 0.5) / kn, seg: kid });
      }
    }
    return seg;
  }
  /* add a branch to the context's current path. Canvas transforms points as
     they are added, so the whole tree becomes one path and one fill. */
  function addBranch(c, seg, t, gust) {
    c.save();
    c.rotate(seg.ang + seg.sw * (0.35 + gust) * Math.sin(t * seg.sf + seg.ph));
    const L = seg.len, B = seg.bend, w0 = seg.w, w1 = seg.w * 0.35;
    c.moveTo(0, -w0); c.quadraticCurveTo(L / 2, B - (w0 + w1) / 2, L, -w1);
    c.lineTo(L, w1); c.quadraticCurveTo(L / 2, B + (w0 + w1) / 2, 0, w0); c.closePath();
    for (const f of seg.leaves) {
      const s = f.s, tan = Math.atan2(2 * B * (1 - 2 * s), L);
      const flutter = 0.22 * Math.sin(t * 2.6 + f.ph) * (0.3 + gust);
      c.save();
      c.translate(L * s, 2 * (1 - s) * s * B);
      c.rotate(tan + (f.side ? f.side * (0.62 + flutter) : flutter * 0.6));
      const l = f.size, w = l * 0.24;
      c.moveTo(0, 0); c.quadraticCurveTo(l * 0.45, -w, l, 0); c.quadraticCurveTo(l * 0.45, w, 0, 0);
      c.restore();
    }
    for (const k of seg.kids) {
      const s = k.s;
      c.save();
      c.translate(L * s, 2 * (1 - s) * s * B); c.rotate(Math.atan2(2 * B * (1 - 2 * s), L));
      addBranch(c, k.seg, t, gust);
      c.restore();
    }
    c.restore();
  }

  /* ---------------------------------------------------------- state */
  const side = new Date().getHours() < 13 ? -1 : 1;
  const pointer = { x: 0, y: 0, mx: 0, my: 0, vx: 0, vy: 0, speed: 0, on: false };
  let W = 0, H = 0, S = 0.25, SF = 0.1, dpr = 1, g, pal, motes = [], treeNear, treeFar;
  let cloud = 1, gust = 0.5, drift = [0, 0];

  function palette() {
    const cs = getComputedStyle(root), dark = root.classList.contains("dark");
    pal = dark
      ? { night: true, lit: hexRGB(cs.getPropertyValue("--lamp")), a: 0.2, reach: 0.8, bloom: 0.45, mote: hexRGB(cs.getPropertyValue("--lamp")), moteA: 0.85, floor: 0.035 }
      : { night: false, shade: hexRGB(cs.getPropertyValue("--shade")), nearA: 0.1, farA: 0.055 };
    near.style.opacity = pal.night ? pal.a : pal.nearA;
    far.style.opacity = pal.night ? 0 : pal.farA;
    dctx.setTransform(1, 0, 0, 1, 0, 0);
    dctx.clearRect(0, 0, dust.width, dust.height);
    dctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function measure() {
    const r = stage.getBoundingClientRect();
    return [Math.round(r.width) || innerWidth, Math.round(r.height) || innerHeight];
  }
  function build() {
    const ow = W, oh = H;
    [W, H] = measure();
    dpr = Math.min(devicePixelRatio || 1, 2);
    S = clamp(360 / W, 0.25, 0.6); SF = S * 0.4; /* the far layer is softer still */
    for (const [c, s] of [[near, S], [nearSrc, S], [far, SF], [farSrc, SF]]) { c.width = Math.max(2, Math.round(W * s)); c.height = Math.max(2, Math.round(H * s)); }
    dust.width = Math.round(W * dpr); dust.height = Math.round(H * dpr);
    dctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const ww = clamp(W * 0.46, 320, 820), wh = H * 1.3;
    g = { ww, wh, cx: W / 2 + side * Math.min(W * 0.3, W / 2 - 30), cy: H * 0.46,
      rot: -side * 4 * Math.PI / 180, sk: Math.tan(-side * 20 * Math.PI / 180),
      period: clamp(H / 13, 42, 80), mull: Math.max(12, ww * 0.03) };
    g.pane = (ww - g.mull) / 2; g.cos = Math.cos(g.rot); g.sin = Math.sin(g.rot);
    const L = clamp(H * 0.5, 260, 520);
    treeNear = grow(rng(12), L, 0, L);
    treeFar = grow(rng(31), L * 1.35, 0, L * 1.35);
    /* dust is seeded once; a resize only rescales where it is */
    if (motes.length) { for (const m of motes) { m.x *= W / ow; m.y *= H / oh; } return; }
    const r = rng(5), nm = Math.round(clamp(W * H / 7000, 80, 210));
    for (let i = 0; i < nm; i++) motes.push({ x: r() * W, y: r() * H, vx: 0, vy: 0, z: r(), ph: r() * TAU });
  }
  const open = (k, t) => clamp(0.56 + (0.11 * Math.sin(t * 0.8 - k * 0.5) + 0.05 * Math.sin(t * 2.1 - k * 1.3)) * (0.35 + gust), 0.18, 0.86);

  /* ---------------------------------------------------------- painting */
  function tree(c, seg, x, y, ang, t, fill) {
    c.beginPath();
    c.save(); c.translate(x, y); c.rotate(ang); addBranch(c, seg, t, gust); c.restore();
    c.fillStyle = fill; c.fill();
  }
  function clear(c, cv, s) { c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, cv.width, cv.height); c.setTransform(s, 0, 0, s, 0, 0); }
  /* blur without a filter: the average of the layer and a ring of offset
     copies ("lighter" adds, so the alphas average exactly). r in canvas px. */
  const RING = [[0, 0]];
  for (let k = 0; k < 8; k++) RING.push([Math.cos(k * TAU / 8), Math.sin(k * TAU / 8)]);
  for (let k = 0; k < 4; k++) RING.push([0.5 * Math.cos(k * TAU / 4 + TAU / 8), 0.5 * Math.sin(k * TAU / 4 + TAU / 8)]);
  function soften(c, cv, src, r, rgb) {
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.clearRect(0, 0, cv.width, cv.height);
    c.globalCompositeOperation = "lighter";
    c.globalAlpha = 1 / RING.length;
    for (const [x, y] of RING) c.drawImage(src, x * r, y * r);
    c.globalAlpha = 1;
    /* tint the softened mask: keep its alpha, take the colour */
    c.globalCompositeOperation = "source-in";
    c.fillStyle = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
    c.fillRect(0, 0, cv.width, cv.height);
    c.globalCompositeOperation = "source-over";
  }
  const MASK = "#fff";

  function paintDay(t) {
    clear(fctx, farSrc, SF); clear(nctx, nearSrc, S);
    tree(fctx, treeFar, W / 2 + side * W * 0.3 + drift[0] * 1.4, -70 + drift[1], Math.PI / 2 + side * 0.62, t * 0.8, MASK);
    tree(nctx, treeNear, W / 2 + side * W * 0.41 + drift[0], -40 + drift[1], Math.PI / 2 + side * 0.45, t, MASK);
    soften(fvis, far, farSrc, 1.2, pal.shade);
    soften(nvis, near, nearSrc, 3 * S, pal.shade);
  }
  function paintNight(t) {
    const { ww, wh, period, pane, mull } = g;
    clear(nctx, nearSrc, S); clear(fvis, far, 1);
    const gx = g.cx + drift[0], gy = g.cy + drift[1];
    const bloom = nctx.createRadialGradient(gx, gy, 0, gx, gy, ww * 0.95);
    bloom.addColorStop(0, `rgba(255,255,255,${pal.bloom})`);
    bloom.addColorStop(1, "rgba(255,255,255,0)");
    nctx.fillStyle = bloom; nctx.fillRect(0, 0, W, H);
    nctx.save();
    nctx.translate(gx, gy); nctx.rotate(g.rot); nctx.transform(1, 0, g.sk, 1, 0, 0); nctx.translate(-ww / 2, -wh / 2);
    /* a lamp, not the sun: the light falls off from the middle of the window */
    const pool = nctx.createRadialGradient(ww / 2, wh / 2, 0, ww / 2, wh / 2, ww * pal.reach);
    pool.addColorStop(0, "rgba(255,255,255,1)");
    pool.addColorStop(0.55, "rgba(255,255,255,0.5)");
    pool.addColorStop(1, "rgba(255,255,255,0)");
    nctx.fillStyle = pool;
    for (let k = 0, y = 0; y < wh; k++, y += period) {
      const h = period * open(k, t), sw = 4 * Math.sin(t * 0.9 - k * 0.35) * (0.3 + gust);
      nctx.fillRect(sw, y, pane, h);
      nctx.fillRect(pane + mull + sw, y, pane, h);
    }
    nctx.restore();
    /* the branch is shade: it removes light */
    nctx.globalCompositeOperation = "destination-out";
    tree(nctx, treeNear, g.cx - side * ww * 0.12 + drift[0], -40 + drift[1], Math.PI / 2 + side * 0.45, t, "rgba(0,0,0,0.9)");
    nctx.globalCompositeOperation = "source-over";
    soften(nvis, near, nearSrc, 5 * S, pal.lit);
    near.style.opacity = (pal.a * cloud).toFixed(3); /* a passing cloud dims the lamp */
  }
  /* how lit is this screen point? the inverse of the blind's transform */
  function lightAt(X, Y, t) {
    const px = X - g.cx - drift[0], py = Y - g.cy - drift[1];
    const qx = px * g.cos + py * g.sin, qy = -px * g.sin + py * g.cos;
    const lx = qx - g.sk * qy + g.ww / 2, ly = qy + g.wh / 2;
    if (lx < 0 || lx > g.ww || ly < 0 || ly > g.wh) return 0;
    const k = Math.floor(ly / g.period), f = ly - k * g.period, h = g.period * open(k, t);
    if (f > h) return 0;
    const m = Math.abs(lx - g.ww / 2) - g.mull / 2;
    if (m < 0) return 0;
    const fall = clamp(1 - Math.hypot(lx - g.ww / 2, ly - g.wh / 2) / (g.ww * pal.reach), 0, 1);
    return fall * clamp(Math.min(f, h - f) / 6, 0, 1) * clamp(m / 6, 0, 1);
  }
  function motesStep(t, dt) {
    const R = 170;
    for (const m of motes) {
      const n1 = noise(m.x * 0.003, m.y * 0.003, t * 0.06), n2 = noise(m.x * 0.003 + 17, m.y * 0.003, t * 0.06);
      m.vx += (n1 * 12 - side * 2 - m.vx) * dt * 0.6;
      m.vy += (n2 * 9 - 4 - m.vy) * dt * 0.6;
      if (pointer.on && pointer.speed > 20) {
        const dx = m.x - pointer.x, dy = m.y - pointer.y, d = Math.hypot(dx, dy);
        if (d < R) {
          const f = (1 - d / R) ** 2 * dt * 1.8;
          m.vx += pointer.vx * f + (-dy / (d + 1)) * pointer.speed * f * 0.4;
          m.vy += pointer.vy * f + (dx / (d + 1)) * pointer.speed * f * 0.4;
        }
      }
      const sp = Math.hypot(m.vx, m.vy);
      if (sp > 160) { m.vx *= 160 / sp; m.vy *= 160 / sp; }
      m.x += m.vx * dt; m.y += m.vy * dt;
      if (m.x < -20) m.x += W + 40; else if (m.x > W + 20) m.x -= W + 40;
      if (m.y < -20) m.y += H + 40; else if (m.y > H + 20) m.y -= H + 40;
    }
  }
  function motesDraw(t) {
    dctx.clearRect(0, 0, W, H);
    for (const m of motes) {
      const a = (pal.floor + lightAt(m.x, m.y, t) * cloud * pal.moteA) * (0.72 + 0.28 * Math.sin(t * 2.7 + m.ph));
      if (a < 0.02) continue;
      const s = 0.55 + m.z * 1.5;
      if (m.z > 0.82) { dctx.fillStyle = rgba(pal.mote, a * 0.22); dctx.beginPath(); dctx.arc(m.x, m.y, s * 2.6, 0, TAU); dctx.fill(); }
      dctx.fillStyle = rgba(pal.mote, a);
      dctx.beginPath(); dctx.arc(m.x, m.y, s * 0.7, 0, TAU); dctx.fill();
    }
  }
  function pose(t) {
    drift = [W * 0.018 * Math.sin(t * TAU / 150), 8 * Math.sin(t * TAU / 53)];
    cloud = clamp(0.98 + 0.6 * noise(t * 0.04, 3.3, 0.7), 0.45, 1);
    gust = clamp(0.5 + 0.7 * noise(t * 0.12, 5.5, 2.2), 0, 1);
  }
  function render(t, dt) {
    pose(t);
    if (pal.night) { motesStep(t, dt); paintNight(t); motesDraw(t); }
    else paintDay(t);
  }
  function still() {
    pose(6);
    if (pal.night) { for (let i = 0; i < 60; i++) motesStep(i / 30, 1 / 30); paintNight(6); motesDraw(6); }
    else paintDay(6);
  }

  /* ---------------------------------------------------------- the loop */
  /* by day the shade is soft enough that 30 fps reads the same and costs half */
  let raf = 0, last = 0, clock = 0, acc = 0;
  function frame(now) {
    raf = 0;
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
    last = now; clock += dt; acc += dt;
    const vx = pointer.mx / dt, vy = pointer.my / dt;
    pointer.mx = pointer.my = 0;
    pointer.vx = lerp(pointer.vx, vx, 0.25); pointer.vy = lerp(pointer.vy, vy, 0.25);
    pointer.speed = Math.hypot(pointer.vx, pointer.vy);
    if (pal.night || acc >= 1 / 31) { render(clock, pal.night ? dt : acc); acc = 0; }
    schedule();
  }
  function schedule() { if (!raf && !REDUCED && !document.hidden) raf = requestAnimationFrame(frame); }
  document.addEventListener("visibilitychange", () => { last = 0; schedule(); });

  addEventListener("pointermove", (e) => {
    if (e.pointerType === "touch") return;
    if (pointer.on) { pointer.mx += e.clientX - pointer.x; pointer.my += e.clientY - pointer.y; }
    pointer.x = e.clientX; pointer.y = e.clientY; pointer.on = true;
  }, { passive: true });
  root.addEventListener("mouseleave", () => { pointer.on = false; });

  /* the backdrop settles back as you read on */
  let scrollPending = false;
  const fade = () => { stage.style.opacity = String(1 - 0.5 * clamp(scrollY / (H * 0.9), 0, 1)); };
  addEventListener("scroll", () => {
    if (scrollPending) return;
    scrollPending = true;
    requestAnimationFrame(() => { scrollPending = false; fade(); });
  }, { passive: true });

  /* canvases clear when resized, so a rebuild repaints before the frame ends */
  let resizePending = false;
  addEventListener("resize", () => {
    if (resizePending) return;
    resizePending = true;
    requestAnimationFrame(() => {
      resizePending = false;
      const [w, h] = measure();
      if (w === W && Math.abs(h - H) < H * 0.25) return; /* just the address bar */
      build(); palette();
      if (REDUCED) still(); else render(clock, 0);
      fade();
    });
  });

  /* follow the site's theme switch; repaint at once so the view transition
     captures the new scene rather than the old one */
  new MutationObserver(() => {
    const was = pal.night;
    palette();
    if (REDUCED || was !== pal.night) { if (REDUCED) still(); else render(clock, 0); }
  }).observe(root, { attributes: true, attributeFilter: ["class"] });

  build(); palette(); fade();
  if (REDUCED) still(); else schedule();
})();
