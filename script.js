// ───── Copy email to clipboard ─────
function copyEmail(e) {
  e.preventDefault();
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText('team@soqono.com').catch(function() {
      window.location.href = 'mailto:team@soqono.com';
    });
  } else {
    window.location.href = 'mailto:team@soqono.com';
  }
  var toast = document.getElementById('copyToast');
  if (!toast) return;
  var x = e.clientX, y = e.clientY;
  toast.style.left = x + 'px';
  toast.style.top  = (y - 36) + 'px';
  toast.style.transform = 'translateX(-50%)';
  toast.classList.add('visible');
  clearTimeout(toast._t);
  toast._t = setTimeout(function() { toast.classList.remove('visible'); }, 2000);
}

// ───── Theme switcher ─────
// Cycles through 9 color themes on click of the colored dot next to "Soqono".
const THEMES = [
  'atomic',    // yellow / red / cyan on black — bold graphic
  'aurora',    // teal / blue / violet — cool & atmospheric
  'solar',     // amber / red / magenta — warm & urgent
  'mono',      // grayscale + oxblood red — restrained, brutalist
  'embedding', // purple / magenta / teal — frontier-tech feel
  'plasma',    // magenta / violet / pink — vibrant
  'forest',    // moss / olive / amber — earthy
  'coral',     // salmon / peach / pink — soft warm
  'midnight',  // navy / silver / steel — sophisticated
];
const _saved = localStorage.getItem('sqTheme');
let ti = (_saved && THEMES.includes(_saved)) ? THEMES.indexOf(_saved) : 0;
if (ti !== 0) document.body.setAttribute('data-theme', THEMES[ti]);

document.getElementById('themeSwitch').addEventListener('click', function () {
  ti = (ti + 1) % THEMES.length;
  document.body.setAttribute('data-theme', THEMES[ti]);
  localStorage.setItem('sqTheme', THEMES[ti]);
  _updateFavicon();
});

// ───── Smooth scroll for nav anchor links ─────
document.querySelectorAll('nav a[href^="#"]').forEach(function(link) {
  link.addEventListener('click', function(e) {
    var target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    var start = window.scrollY;
    var end = target.getBoundingClientRect().top + window.scrollY;
    var duration = 680;
    var t0 = null;
    function easeInOutCubic(t) { return t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2; }
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / duration, 1);
      window.scrollTo(0, start + (end - start) * easeInOutCubic(p));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
});

// ───── Nav color tracks the section currently behind it ─────
// Each section carries data-nav="light"|"dark". On scroll, find the last
// section whose top edge has passed the nav bar, and flip accordingly.
const _nav = document.querySelector('nav');
const _navSections = document.querySelectorAll('[data-nav]');

function onScroll() {
  var navH = _nav.offsetHeight;
  var active = null;
  _navSections.forEach(function(s) {
    if (s.getBoundingClientRect().top <= navH) active = s;
  });
  var isDark = active ? active.dataset.nav === 'dark' : false;
  document.body.classList.toggle('nav-dark', isDark);
  _nav.classList.toggle('scrolled', window.scrollY > 0);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ───── Rotating word ─────
// Soft defocus + accent tint: word picks up the theme's accent-2 color
// during a 6px blur, swaps, and rebuilds back to white. ~600ms total.
const words = ['Research', 'Program', 'Strategy', 'Product'];
const rotor = document.getElementById('rotor');
let wi = 0;
if (rotor) setInterval(function () {
  rotor.classList.add('soft');
  setTimeout(function () {
    wi = (wi + 1) % words.length;
    rotor.textContent = words[wi];
    rotor.classList.remove('soft');
  }, 500);
}, 2700);

// ───── Hero canvas — blobs + ribbons at 5 fps ─────
// Replaces 8 separate filter:blur() / mix-blend-mode divs (~1.5 GB GPU).
// CSS blur on the canvas is cheap: the browser caches the blurred frame
// between redraws, so the re-blur cost is paid only 5× per second, not 60×.
var _c  = document.getElementById('heroCanvas');
if (_c) { // ─── main-page canvas + map + programs only ───
var _x  = _c.getContext('2d');

// ╔══════════════════════════════════════════════════════════════════════╗
// ║  VISUAL TUNING — edit these values to adjust the blob background    ║
// ╚══════════════════════════════════════════════════════════════════════╝

// ── Canvas resolution ────────────────────────────────────────────────────
// Internal draw size. The CSS blur (set in style.css) hides fine detail,
// so 1000×750 is plenty. Increasing this sharpens gradients before blur.
// All blob radii and positions below are in these canvas pixel units.
var CW = 1000, CH = 750;

// ── Gradient shape ───────────────────────────────────────────────────────
// Peak opacity at the blob centre (0.0–1.0).
// 1.0 = full colour at centre → visible bright hot-spot.
// 0.5–0.7 = softer centre, no hot-spot, cloud-like.
var BLOB_OPACITY = .9;

// The gradient uses four stops to approximate a bell-curve falloff,
// avoiding the linear-peak that causes bright centre dots.
// You don't normally need to change these; adjust BLOB_OPACITY above instead.

// ── Blobs ────────────────────────────────────────────────────────────────
// Each blob is a soft radial gradient circle drawn on the canvas.
//
//  x, y   — centre position as a fraction of canvas width/height.
//            0.0 = left/top edge.  1.0 = right/bottom edge.
//            Values outside 0–1 place the centre off-canvas so only the
//            blob's halo bleeds in from that edge (used for b2, b4).
//
//  r      — radius in canvas pixels. Larger = bigger blob footprint.
//            At CW=1000: ~230 is "large", ~190 is "medium", ~145 is "small".
//
//  tx, ty — how far the blob drifts during its animation, as a fraction
//            of CW/CH. Positive = drifts right/down. 0.1 ≈ subtle drift.
//
//  dur    — animation cycle length in milliseconds. Longer = slower drift.
//            These are already very slow (64–110 seconds per cycle).
//
//  cv     — CSS custom property that holds the blob colour.
//            Colours are defined per-theme at the top of style.css.
var _blobs = [
  // red top left
  { x:0.16, y:0.24, r:200, dur: 52000, tx: 0.1, ty: 0.15, cv:'--blob1' },
  // yellow right
  { x:0.892, y:.4, r:200, dur: 47000, tx:-0.2, ty: 0.12, cv:'--blob2' },
  // blue bottom left
  { x:0.3, y:.740, r:120, dur: 61000, tx: 0.14, ty:-0.1, cv:'--blob3' },
  // blue bottom right
  { x:0.75, y:0.82, r:150, dur: 44000, tx:-0.1, ty:-0.15, cv:'--blob4' },
  // yellow center
  { x:0.5, y:0.5, r:172, dur: 67000, tx: .08, ty: 0.14, cv:'--blob5' },
  // red center right
  { x:0.6, y:0.70, r:146, dur: 55000, tx:-0.12, ty: 0.07, cv:'--blob6' },
];

// ── Ribbons ──────────────────────────────────────────────────────────────
// Soft horizontal colour bands layered behind the blobs.
//
//  y   — vertical centre as a fraction of CH (0 = top, 1 = bottom)
//  h   — band height as a fraction of CH. 0.4 = covers 40% of canvas height.
//  ty  — vertical drift in canvas pixels (small value; ribbons barely move)
//  dur — animation cycle in ms
//  cv  — CSS custom property for the ribbon colour (rgba, semi-transparent)
var _ribbons = [
  { y:0.30, h:0.40, dur:57000, ty:0, cv:'--ribbon1' },
  { y:0.612, h:0.40, dur:43000, ty:0, cv:'--ribbon2' },
];

// ╔══════════════════════════════════════════════════════════════════════╗
// ║  CSS BLUR — also in style.css: #heroCanvas { filter: blur(Xpx) }   ║
// ║  This is the main softness control. Raise for more atmospheric      ║
// ║  diffusion, lower to see blob shapes more distinctly.               ║
// ╚══════════════════════════════════════════════════════════════════════╝
_c.width = CW; _c.height = CH;

function _wave(t, dur) {
  return (1 - Math.cos(2 * Math.PI * (t % dur) / dur)) / 2;
}

function _cssVar(name) {
  return getComputedStyle(document.body).getPropertyValue(name).trim();
}

// Same hue, zero alpha — fringe-free transparent end for gradients.
function _fade(color) {
  if (color[0] === '#') {
    var n = parseInt(color.slice(1), 16);
    return 'rgba(' + (n >> 16 & 255) + ',' + (n >> 8 & 255) + ',' + (n & 255) + ',0)';
  }
  return color.replace(/,\s*[\d.]+\)$/, ',0)').replace(/^rgb\(/, 'rgba(');
}

// Same hue, given alpha — used to soften gradient centres.
function _alpha(color, a) {
  if (color[0] === '#') {
    var n = parseInt(color.slice(1), 16);
    return 'rgba(' + (n >> 16 & 255) + ',' + (n >> 8 & 255) + ',' + (n & 255) + ',' + a + ')';
  }
  return color.replace(/,\s*[\d.]+\)$/, ',' + a + ')').replace(/^rgb\(/, 'rgba(');
}

function _draw() {
  if (document.hidden) return;
  var now = Date.now();
  _x.clearRect(0, 0, CW, CH);
  _x.globalCompositeOperation = 'screen';

  _ribbons.forEach(function(r) {
    var cy   = r.y * CH + _wave(now, r.dur) * r.ty;
    var half = r.h * CH * 0.5;
    var col  = _cssVar(r.cv);
    var g    = _x.createLinearGradient(0, cy - half, 0, cy + half);
    g.addColorStop(0,   'rgba(0,0,0,0)');
    g.addColorStop(0.5, col);
    g.addColorStop(1,   'rgba(0,0,0,0)');
    _x.fillStyle = g;
    _x.fillRect(0, cy - half, CW, half * 2);
  });

  _blobs.forEach(function(b) {
    var f   = _wave(now, b.dur);
    var cx  = (b.x + f * b.tx) * CW;
    var cy  = (b.y + f * b.ty) * CH;
    var col = _cssVar(b.cv);
    var g   = _x.createRadialGradient(cx, cy, 0, cx, cy, b.r);
    // Bell-curve falloff: reduces bright centre hot-spot, smooth fade to edge.
    g.addColorStop(0,    _alpha(col, BLOB_OPACITY));
    g.addColorStop(0.3,  _alpha(col, BLOB_OPACITY * 0.75));
    g.addColorStop(0.6,  _alpha(col, BLOB_OPACITY * 0.35));
    g.addColorStop(1,    _fade(col));
    _x.fillStyle = g;
    _x.beginPath();
    _x.arc(cx, cy, b.r, 0, Math.PI * 2);
    _x.fill();
  });
}

setInterval(_draw, 200); // 5 fps — motion is imperceptible at this speed
_draw();

document.addEventListener('visibilitychange', function () {
  document.body.classList.toggle('tab-hidden', document.hidden);
  if (!document.hidden) _draw(); // repaint immediately on tab re-focus
});

// ───── World map ─────
// k: dot color key — 0 = --accent, 1 = --accent-2, 2 = --blob3
// Change k on any city to color-code it for functional grouping.
var MAP_LOCS = [
  { n:'Amsterdam',        lat:52.37,  lon:4.89,    c:3, k:2 },
  { n:'Anchorage',        lat:61.22,  lon:-149.9,  c:3, k:2 },
  { n:'Atlanta',          lat:33.75,  lon:-84.39,  c:3, k:2 },
  { n:'Bangkok',          lat:13.75,  lon:100.52,  c:3, k:2 },
  { n:'Boston',           lat:42.36,  lon:-71.06,  c:1, k:0 },
  { n:'Brussels',         lat:50.85,  lon:4.35,    c:1, k:0 },
  { n:'Buffalo',          lat:42.89,  lon:-78.88,  c:1, k:0 },
  { n:'Chiang Mai',       lat:18.79,  lon:98.98,   c:1, k:0 },
  { n:'Chicago',          lat:41.88,  lon:-87.63,  c:1, k:0 },
  { n:'Copenhagen',       lat:55.68,  lon:12.57,   c:1, k:0 },
  { n:'Cusco',            lat:-13.53, lon:-71.97,  c:1, k:0 },
  { n:'Denver',           lat:39.74,  lon:-104.99, c:1, k:0 },
  { n:'Detroit',          lat:42.33,  lon:-83.05,  c:1, k:0 },
  { n:'Dubai',            lat:25.20,  lon:55.27,   c:3, k:2 },
  { n:'Fairbanks',        lat:64.84,  lon:-147.72, c:1, k:0 },
  { n:'Frankfurt',        lat:50.11,  lon:8.68,    c:1, k:0 },
  { n:'Ho Chi Minh City', lat:10.82,  lon:106.63,  c:1, k:0 },
  { n:'Honolulu',         lat:21.31,  lon:-157.82, c:3, k:2 },
  { n:'Istanbul',         lat:41.01,  lon:28.98,   c:1, k:0 },
  { n:'Johannesburg',     lat:-26.20, lon:28.04,   c:3, k:2 },
  { n:'Kyoto',            lat:35.01,  lon:135.77,  c:1, k:0 },
  { n:'London',           lat:51.51,  lon:0.13,    c:3, k:2 },
  { n:'Los Angeles',      lat:34.05,  lon:-118.24, c:4, k:1 },
  { n:'Madrid',           lat:40.42,  lon:-3.70,   c:1, k:0 },
  { n:'Miami',            lat:25.77,  lon:-80.19,  c:1, k:0 },
  { n:'Milan',            lat:45.46,  lon:9.19,    c:1, k:0 },
  { n:'Montréal',         lat:45.50,  lon:-73.57,  c:1, k:0 },
  { n:'Mumbai',           lat:19.08,  lon:72.88,   c:3, k:2 },
  { n:'New Delhi',        lat:28.61,  lon:77.21,   c:3, k:2 },
  { n:'New York',         lat:40.71,  lon:-74.01,  c:4, k:1 },
  { n:'Paris',            lat:48.85,  lon:2.35,    c:1, k:0 },
  { n:'Philadelphia',     lat:39.95,  lon:-75.17,  c:3, k:2 },
  { n:'Phoenix',          lat:33.45,  lon:-112.07, c:1, k:0 },
  { n:'Portland',         lat:45.52,  lon:-122.68, c:1, k:0 },
  { n:'Quito',            lat:-0.23,  lon:-78.52,  c:1, k:0 },
  { n:'San Diego',        lat:32.72,  lon:-117.16, c:1, k:0 },
  { n:'San Francisco',    lat:37.77,  lon:-122.42, c:3, k:2 },
  { n:'San Juan',         lat:18.47,  lon:-66.12,  c:1, k:0 },
  { n:'Seattle',          lat:47.61,  lon:-122.33, c:1, k:0 },
  { n:'Stockholm',        lat:59.33,  lon:18.07,   c:1, k:0 },
  { n:'Taipei',           lat:25.03,  lon:121.56,  c:3, k:2 },
  { n:'Tokyo',            lat:35.69,  lon:139.69,  c:3, k:2 },
  { n:'Zürich',           lat:47.38,  lon:8.54,    c:1, k:0 },
];

var _mapTopo = null;

// ── Style 1: organic line art — Catmull-Rom smooth strokes, no fill ──────────
// Tuning constants:
var MAP_STROKE_W       = 1.2;   // coastline line weight
var MAP_OPACITY        = .3;  // stroke opacity
var MAP_SUBSAMPLE      = 8;     // take every Nth arc point (higher = simpler curves)
var MAP_SOUTH_CLIP_LAT = -62;   // clip below this latitude (removes Antarctica; covers Tierra del Fuego at ~−55°S)
var MAP_SEAM_LON       = -169;  // longitude at left/right edge — set between Russia (~168°E) and Alaska (~168°W)
var MAP_DOT_BASE       = 10;     // dot base size in px
var MAP_DOT_MULT       = 5;     // extra px per project-count unit

function _drawMapLand() {
  var canvas = document.getElementById('mapCanvas');
  if (!canvas || !_mapTopo) return;
  var ctx = canvas.getContext('2d');
  var W = canvas.width, H = canvas.height;

  ctx.clearRect(0, 0, W, H); // transparent ocean — section bg shows through

  var clipY = (90 - MAP_SOUTH_CLIP_LAT) / 180 * H;
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, W, clipY);
  ctx.clip();

  var t = _mapTopo.transform, sc = t.scale, tr = t.translate;

  function toPx(bx, by) {
    var lon = bx * sc[0] + tr[0];
    var x = ((lon - MAP_SEAM_LON + 360) % 360) / 360 * W;
    var y = (90 - (by * sc[1] + tr[1])) / 180 * H;
    return [x, y];
  }

  function getArcPts(arcIdx) {
    var fwd = arcIdx >= 0;
    var arc = _mapTopo.arcs[fwd ? arcIdx : ~arcIdx];
    var pts = [], bx = 0, by = 0;
    for (var k = 0; k < arc.length; k++) {
      bx += arc[k][0]; by += arc[k][1];
      if (k % MAP_SUBSAMPLE === 0) pts.push(toPx(bx, by));
    }
    if (!fwd) pts.reverse();
    return pts;
  }

  function catmull(pts) {
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[Math.max(0, i - 1)];
      var p1 = pts[i];
      var p2 = pts[i + 1];
      var p3 = pts[Math.min(pts.length - 1, i + 2)];
      ctx.bezierCurveTo(
        p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6,
        p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6,
        p2[0], p2[1]
      );
    }
  }

  function addRing(ringArcs) {
    var all = [];
    for (var a = 0; a < ringArcs.length; a++) all = all.concat(getArcPts(ringArcs[a]));
    if (!all.length) return;
    // Split at antimeridian crossings — large horizontal jump = arc wraps the globe
    var segs = [[all[0]]];
    for (var p = 1; p < all.length; p++) {
      if (Math.abs(all[p][0] - all[p - 1][0]) > W * 0.5) {
        segs.push([all[p]]);
      } else {
        segs[segs.length - 1].push(all[p]);
      }
    }
    segs.forEach(function(seg) { if (seg.length >= 2) catmull(seg); });
    if (segs.length === 1) ctx.closePath();
  }

  ctx.beginPath();
  var geoms = _mapTopo.objects.land.geometries;
  for (var i = 0; i < geoms.length; i++) {
    var g = geoms[i];
    if (g.type === 'Polygon') {
      for (var r = 0; r < g.arcs.length; r++) addRing(g.arcs[r]);
    } else if (g.type === 'MultiPolygon') {
      for (var j = 0; j < g.arcs.length; j++)
        for (var r = 0; r < g.arcs[j].length; r++) addRing(g.arcs[j][r]);
    }
  }

  // Auto-adapt stroke color to light or dark section background
  var _whereBg = getComputedStyle(canvas.closest ? canvas.closest('.where-band') || document.documentElement : document.documentElement).backgroundColor;
  var _rgb = _whereBg.match(/\d+/g);
  var _lum = _rgb && _rgb.length >= 3 ? (0.299 * _rgb[0] + 0.587 * _rgb[1] + 0.114 * _rgb[2]) / 255 : 0;
  ctx.strokeStyle = _lum > 0.5
    ? 'rgba(0,0,0,' + MAP_OPACITY + ')'
    : 'rgba(255,255,255,' + MAP_OPACITY + ')';
  ctx.lineWidth   = window.innerWidth <= 540 ? MAP_STROKE_W * 6 : MAP_STROKE_W;
  ctx.lineJoin    = 'round';
  ctx.lineCap     = 'round';
  ctx.stroke();
  ctx.restore();
}

// Push overlapping dots apart until they touch tangentially, using iterative
// collision resolution in real display-pixel space. Each dot only moves the
// minimum amount needed, so geographic positions are preserved as much as possible.
// Larger dots move less (force is split inversely proportional to radius).
var MAP_DOT_PAD   = 1;    // px gap added on top of the visual radius threshold
var MAP_GRAD_FADE = 0.95; // solid dots — visible edge is at full element radius
var MAP_SEP_ITERS = 150;  // simulation iterations (exits early once stable)

function _separateDots(locs) {
  var canvas = document.getElementById('mapCanvas');
  var W = (canvas && canvas.offsetWidth)  || 1200;
  var H = (canvas && canvas.offsetHeight) || 600;

  var _isMob2  = window.innerWidth <= 540;
  var _dotBase = _isMob2 ? 5 : MAP_DOT_BASE;
  var _dotMult = _isMob2 ? 3 : MAP_DOT_MULT;
  var pos = locs.map(function(loc) {
    var size = _dotBase + loc.c * _dotMult;
    return {
      x: ((loc.lon - MAP_SEAM_LON + 360) % 360) / 360 * W,
      y: (90 - loc.lat) / 180 * H,
      r: size / 2
    };
  });

  for (var iter = 0; iter < MAP_SEP_ITERS; iter++) {
    var anyOverlap = false;
    for (var i = 0; i < pos.length; i++) {
      for (var j = i + 1; j < pos.length; j++) {
        var dx = pos[j].x - pos[i].x;
        var dy = pos[j].y - pos[i].y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        // minDist: center of smaller dot sits at the visual edge of the larger dot.
        // The gradient fades to transparent at MAP_GRAD_FADE of the element radius,
        // so that's where the visible circle ends.
        var minDist = Math.max(pos[i].r, pos[j].r) * MAP_GRAD_FADE + MAP_DOT_PAD;
        if (dist >= minDist) continue;

        anyOverlap = true;
        // Coincident dots: nudge in a random direction
        if (dist < 0.001) { dx = Math.random() - 0.5; dy = Math.random() - 0.5; dist = Math.sqrt(dx*dx + dy*dy); }
        var overlap = minDist - dist;
        var nx = dx / dist, ny = dy / dist;
        var totalR = pos[i].r + pos[j].r;
        // Each dot takes a share of the push proportional to the OTHER dot's radius
        // (larger dot moves less)
        pos[i].x -= nx * overlap * (pos[j].r / totalR);
        pos[i].y -= ny * overlap * (pos[j].r / totalR);
        pos[j].x += nx * overlap * (pos[i].r / totalR);
        pos[j].y += ny * overlap * (pos[i].r / totalR);
      }
    }
    if (!anyOverlap) break;
  }

  return pos.map(function(p) {
    return { px: p.x / W * 100, py: p.y / H * 100 };
  });
}

function _renderMapDots() {
  var wrap = document.getElementById('mapDots');
  if (!wrap) return;
  wrap.innerHTML = ''; // clear for re-renders on theme change
  var cs = getComputedStyle(document.body);
  var colors = [
    cs.getPropertyValue('--accent').trim(),   // k:0
    cs.getPropertyValue('--accent-2').trim(), // k:1
    cs.getPropertyValue('--blob3').trim(),    // k:2
  ];
  var positions = _separateDots(MAP_LOCS);

  // Smaller dots on mobile — map canvas is much smaller so default sizes crowd
  var isMob  = window.innerWidth <= 540;
  var dotBase = isMob ? 5  : MAP_DOT_BASE;
  var dotMult = isMob ? 3  : MAP_DOT_MULT;

  // Sort largest-first, then assign ascending z-index so large dots are always
  // behind small dots regardless of browser paint order.
  var dots = MAP_LOCS.map(function(loc, idx) {
    var size = Math.round(dotBase + loc.c * dotMult);
    var pos  = positions[idx];
    var col  = colors[2]; // all dots use blob3 (cyan)
    return { loc: loc, pos: pos, size: size, col: col };
  });
  dots.sort(function(a, b) { return b.size - a.size; }); // largest first → lowest z

  dots.forEach(function(d, rank) {
    var dot = document.createElement('div');
    dot.className = 'map-dot';
    dot.setAttribute('data-label', d.loc.n);
    dot.style.left    = d.pos.px.toFixed(3) + '%';
    dot.style.top     = d.pos.py.toFixed(3) + '%';
    dot.style.width   = d.size + 'px';
    dot.style.height  = d.size + 'px';
    dot.style.zIndex  = rank + 1; // rank 0 (largest) gets z-index 1, smallest gets highest
    dot.style.setProperty('--dot-color', d.col);
    wrap.appendChild(dot);
  });
}

(function initMap() {
  fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json')
    .then(function(r) { return r.json(); })
    .then(function(topo) {
      _mapTopo = topo;
      _drawMapLand();
      _renderMapDots();
    })
    .catch(function() {});
})();

// Re-draw map + dots on theme change after CSS transition settles
document.getElementById('themeSwitch').addEventListener('click', function() {
  setTimeout(function() { _drawMapLand(); _renderMapDots(); }, 580);
});

// ───── Program cards ─────
var PROGRAMS = [
  { domain:'Consumer HW',     title:'Prototype smart glasses and camera-enabled audio wearable evaluation across custom indoor and outdoor environments.',        stat:'500',     unit:'participants' },
  { domain:'Health Wearables',title:'Smartwatch health sensor validation conducted with permanent residents at extreme altitude.',                                stat:'10,000+', unit:'feet' },
  { domain:'AV / Robotics',   title:'Ground-up PMO build for a multi-party autonomous vehicle fleet operation, from program design to live operations.',         stat:'0 to 1',  unit:'depot launch' },
  { domain:'AR / VR',         title:'High-fidelity 3D interior capture of luxury residences for a next-gen VR system.',                                          stat:'24hr',    unit:'per-location capture window' },
  { domain:'Biometrics',      title:'Fingerprint data collection across diverse skin conditions. Domestic operations during COVID.',                              stat:'4',       unit:'unique environments' },
  { domain:'Consumer HW',     title:'High-fidelity audio and video capture program for an unannounced consumer product.',                                        stat:'4,000',   unit:'participants' },
  { domain:'Consumer HW',     title:'Global biometric dataset across demographics and conditions for a facial recognition algorithm.',                            stat:'10',      unit:'global locations' },
  { domain:'Multimodal AI',   title:'Multilingual personal data collection with encrypted pipelines for a global AI rollout.',                                   stat:'25',      unit:'languages and dialects' },
  { domain:'AV / Robotics',   title:'Mileage data throughput overhaul for a next-gen autonomous vehicle platform.',                                              stat:'50x',     unit:'mileage increase · 6 weeks' },
  { domain:'AR / VR',         title:'Global public-space spatial data collection for early-stage AR prototype development.',                                     stat:'6',       unit:'markets · 4 continents' },
  { domain:'Consumer HW',     title:'Low-light photography ground truth dataset collected with professional photographers across global markets.',                stat:'7',       unit:'markets · 2 continents' },
  { domain:'Micromobility',   title:'Real-world final validation of a new micromobility product using pre-production hardware across markets.',                  stat:'2,000',   unit:'public miles' },
];

function _shuffle(arr) {
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}

(function renderPrograms() {
  var grid = document.getElementById('progGrid');
  if (!grid) return;
  var isMobile = window.innerWidth <= 540;
  var SHOW_INITIAL = 6;
  _shuffle(PROGRAMS).forEach(function (p, idx) {
    var card = document.createElement('div');
    card.className = 'prog-card' + (isMobile && idx >= SHOW_INITIAL ? ' prog-hidden' : '');
    var statHtml = p.stat === 'NDA'
      ? '<div class="prog-stat">NDA</div>'
      : '<div class="prog-stat">' + p.stat + '<span class="prog-unit">' + p.unit + '</span></div>';
    card.innerHTML =
      '<div class="prog-meta">' + p.domain + '</div>' +
      '<h4>' + p.title + '</h4>' +
      statHtml;
    grid.appendChild(card);
  });
  if (isMobile && PROGRAMS.length > SHOW_INITIAL) {
    var btn = document.createElement('button');
    btn.className = 'prog-expand-btn';
    btn.innerHTML = 'Show more programs →';
    btn.addEventListener('click', function () {
      grid.querySelectorAll('.prog-hidden').forEach(function (c) {
        c.classList.remove('prog-hidden');
      });
      btn.parentNode.removeChild(btn);
    });
    grid.insertAdjacentElement('afterend', btn);
  }
})();
} // ─── end main-page only ───

// ───── Shared footer ─────
// Edit this string to update the footer on all three pages at once.
(function() {
  var el = document.querySelector('footer .frame');
  if (!el) return;
  el.innerHTML = '<div>© 2026 Soqono'
    + ' <span class="sep">|</span> <a href="terms.html">Terms</a>'
    + ' <span class="sep">|</span> <a href="privacy.html">Privacy</a>'
    + '</div>';
})();

// ───── Dynamic favicon ─────
// Draws the theme-switch dot (glowing circle in --accent-2) onto a canvas
// and sets it as the page favicon. Re-runs on every theme change.
function _updateFavicon() {
  var sz = 64;
  var cv = document.createElement('canvas');
  cv.width = sz; cv.height = sz;
  var ctx = cv.getContext('2d');

  var st  = getComputedStyle(document.body);
  var c1  = st.getPropertyValue('--blob3').trim()    || '#00d4d4'; // cyan ring
  var c2  = st.getPropertyValue('--accent').trim()   || '#ff3838'; // accent ring
  var c3  = st.getPropertyValue('--accent-2').trim() || '#ffd700'; // accent-2 ring

  // Three rings — same positions as the SVG theme-switch button
  var rings = [
    { cx: 32,    cy: 30.17, col: c1 },
    { cx: 34.89, cy: 35.17, col: c2 },
    { cx: 29.11, cy: 35.17, col: c3 },
  ];
  var r = 20;

  // Screen compositing so overlapping rings brighten each other
  ctx.globalCompositeOperation = 'screen';

  rings.forEach(function(ring) {
    var x = ring.cx, y = ring.cy, col = ring.col;

    // Thick outer glow
    ctx.globalAlpha = 0.10;
    ctx.lineWidth   = 12;
    ctx.strokeStyle = col;
    ctx.shadowColor = col; ctx.shadowBlur = 8;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke();

    // Mid glow
    ctx.globalAlpha = 0.30;
    ctx.lineWidth   = 4.5;
    ctx.shadowBlur  = 3;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke();

    // Crisp thin ring
    ctx.globalAlpha = 1;
    ctx.lineWidth   = 1.5;
    ctx.shadowBlur  = 0;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke();
  });

  var link = document.querySelector('link[rel="icon"]');
  if (!link) { link = document.createElement('link'); link.rel = 'icon'; document.head.appendChild(link); }
  link.type = 'image/png';
  link.href = cv.toDataURL();
}
_updateFavicon();

// ───── Cookie banner ─────
(function() {
  var KEY = 'sqCookieConsent';
  if (localStorage.getItem(KEY)) return;
  var banner = document.getElementById('cookieBanner');
  if (!banner) return;
  setTimeout(function() { banner.classList.add('visible'); }, 900);
  document.getElementById('cookieAccept').addEventListener('click', function() {
    localStorage.setItem(KEY, 'accepted');
    banner.classList.remove('visible');
  });
  document.getElementById('cookieDecline').addEventListener('click', function() {
    localStorage.setItem(KEY, 'declined');
    banner.classList.remove('visible');
  });
})();


