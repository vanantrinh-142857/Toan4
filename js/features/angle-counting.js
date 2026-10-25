//# features/angle-counting.js — Bài "Các loại góc": hình, bài tập đếm góc (vuông/nhọn/tù/bẹt), hướng dẫn đếm từng bước
//# Tự chứa trong một hàm bọc — chạy độc lập, không cần build.
/* ===== features/angle-counting.js – Bài "Các loại góc": hình, bài tập đếm góc (vuông/nhọn/tù/bẹt), hướng dẫn đếm từng bước ===== */
(function () {
  "use strict";
  var TH = window.TH, LT = window.LT, LESSONS = window.LESSONS, SC = window.SC, Store = window.Store;
  var T4 = window.T4, T = T4.T, G = T4.G, C = T4.C;
  var INK = C.INK, BLUE = C.BLUE, ORANGE = C.ORANGE, GREEN = C.GREEN, RED = C.RED, PINK = C.PINK, GREY = C.GREY;

  /* ================= HÌNH HỌC ================= */
  function polar(o, deg, len) { var a = deg * Math.PI / 180; return [o[0] + len * Math.cos(a), o[1] - len * Math.sin(a)]; }
  function dirA(p, q) { var a = Math.atan2(-(q[1] - p[1]), q[0] - p[0]) * 180 / Math.PI; a %= 360; if (a < 0) a += 360; return a; }
  function adiff(a, b) { var d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d; }
  function dist(p, q) { return Math.hypot(p[0] - q[0], p[1] - q[1]); }
  function inside(P, U, V) {
    var L = dist(U, V), cr = Math.abs((V[0] - U[0]) * (P[1] - U[1]) - (V[1] - U[1]) * (P[0] - U[0])) / L;
    var t = ((P[0] - U[0]) * (V[0] - U[0]) + (P[1] - U[1]) * (V[1] - U[1])) / (L * L);
    return cr < 0.8 && t > 0.002 && t < 0.998;
  }
  function isect(p1, p2, p3, p4) {
    var d = (p1[0] - p2[0]) * (p3[1] - p4[1]) - (p1[1] - p2[1]) * (p3[0] - p4[0]);
    var a = p1[0] * p2[1] - p1[1] * p2[0], b = p3[0] * p4[1] - p3[1] * p4[0];
    return [(a * (p3[0] - p4[0]) - (p1[0] - p2[0]) * b) / d, (a * (p3[1] - p4[1]) - (p1[1] - p2[1]) * b) / d];
  }

  /* Phân tích hình: ở mỗi đỉnh liệt kê các cạnh theo MỘT CHIỀU (kim đồng hồ), ghép đôi → các góc */
  function analyze(F) {
    var names = F.order || Object.keys(F.pts), out = { verts: [], total: 0, right: [], acute: [], obtuse: [], straight: 0, sl: [] };
    names.forEach(function (P) {
      var pp = F.pts[P], dirs = [];
      function add(Q) {
        var a = dirA(pp, F.pts[Q]);
        for (var i = 0; i < dirs.length; i++) if (adiff(dirs[i].a, a) < 1.2) return;
        dirs.push({ a: a });
      }
      F.segs.forEach(function (s) {
        var U = F.pts[s[0]], V = F.pts[s[1]];
        if (s[0] === P) add(s[1]); else if (s[1] === P) add(s[0]);
        else if (inside(pp, U, V)) { add(s[0]); add(s[1]); }
      });
      dirs.forEach(function (d) {
        var best = null, bd = 1e9;
        names.forEach(function (Q) { if (Q === P) return; var q = F.pts[Q]; if (adiff(dirA(pp, q), d.a) < 1.2) { var dd = dist(pp, q); if (dd < bd) { bd = dd; best = Q; } } });
        d.n = best;
      });
      dirs.sort(function (x, y) { return x.a - y.a; });
      var n = dirs.length;
      if (n >= 2) {
        var gi = 0, gm = -1;
        for (var i = 0; i < n; i++) {
          var g = (i === n - 1) ? (dirs[0].a + 360 - dirs[i].a) : (dirs[i + 1].a - dirs[i].a);
          if (g > gm) { gm = g; gi = i; }
        }
        var s0 = (gi + 1) % n; dirs = dirs.slice(s0).concat(dirs.slice(0, s0));
        /* đọc theo một chiều từ TRÁI sang PHẢI cho khớp lời dạy */
        if (Math.cos(dirs[n - 1].a * Math.PI / 180) < Math.cos(dirs[0].a * Math.PI / 180) - 1e-6) dirs.reverse();
      }
      var angs = [], str = 0;
      for (var i = 0; i < n; i++) for (var j = i + 1; j < n; j++) {
        var d = adiff(dirs[i].a, dirs[j].a);
        var type = Math.abs(d - 180) < 1.5 ? 'straight' : Math.abs(d - 90) < 1.5 ? 'right' : d < 90 ? 'acute' : 'obtuse';
        if (type === 'straight') str++;
        var rec = { name: dirs[i].n + P + dirs[j].n, deg: d, type: type, v: P, a1: dirs[i].a, a2: dirs[j].a };
        angs.push(rec); if (type !== 'straight') out[type].push(rec); else out.sl.push(rec);
      }
      out.total += angs.length; out.straight += str;
      out.verts.push({ v: P, rays: dirs.map(function (d) { return P + d.n; }), angles: angs, straight: str });
    });
    return out;
  }

  var FIG = {};
  (function () {
    var O, F;
    O = [110, 172];
    FIG.S1 = { h: 190, order: ['O', 'A', 'B', 'C'], pts: { O: O, A: polar(O, 0, 170), B: polar(O, 48, 150), C: polar(O, 105, 135) },
      segs: [['O', 'A'], ['O', 'B'], ['O', 'C']], lab: { O: [-10, 20], A: [14, 6], B: [12, -4], C: [-4, -10] } };
    O = [100, 172];
    FIG.S2 = { h: 190, order: ['O', 'A', 'B', 'C', 'D'], pts: { O: O, A: polar(O, 0, 190), B: polar(O, 25, 170), C: polar(O, 65, 160), D: polar(O, 125, 150) },
      segs: [['O', 'A'], ['O', 'B'], ['O', 'C'], ['O', 'D']], lab: { O: [-10, 20], A: [14, 6], B: [14, -2], C: [8, -10], D: [-8, -8] } };
    O = [105, 182];
    FIG.S3 = { h: 208, order: ['O', 'A', 'B', 'C', 'D', 'E'], pts: { O: O, A: polar(O, 0, 200), B: polar(O, 24, 170), C: polar(O, 52, 150), D: polar(O, 78, 135), E: polar(O, 124, 125) },
      segs: [['O', 'A'], ['O', 'B'], ['O', 'C'], ['O', 'D'], ['O', 'E']], lab: { O: [-10, 20], A: [14, 6], B: [14, -2], C: [12, -6], D: [4, -10], E: [-10, -6] } };
    /* Hình 1 (ảnh con gửi): tam giác GHK, GI vuông góc HK, góc G vuông */
    F = { h: 200, order: ['G', 'H', 'K', 'I'], pts: { G: [150, 38], H: [65, 162], K: [150 + 122 * 122 / 85, 162], I: [150, 162] },
      segs: [['G', 'H'], ['G', 'K'], ['H', 'K'], ['G', 'I']], fill: ['G', 'H', 'K'],
      right: [['G', 'H', 'K'], ['I', 'G', 'K']], lab: { G: [0, -10], H: [-12, 20], K: [12, 20], I: [0, 24] } };
    FIG.F1 = F;
    /* Hình 2 (ảnh con gửi): hình thang ABCD, G trên DC, H trên BC */
    FIG.F2 = { h: 206, order: ['A', 'B', 'C', 'D', 'G', 'H'], pts: { A: [85, 35], B: [240, 35], C: [305, 165], D: [40, 165], G: [190, 165], H: [262.75, 80.5] },
      segs: [['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'A'], ['A', 'G'], ['G', 'H']], fill: ['A', 'B', 'C', 'D'],
      lab: { A: [-12, -8], B: [12, -8], C: [14, 20], D: [-12, 20], G: [0, 24], H: [18, 4] } };
    /* Hình 3 (ảnh con gửi): tam giác ABC, AD vuông góc BC, E trên BC */
    FIG.F3 = { h: 210, order: ['A', 'B', 'C', 'D', 'E'], pts: { A: [140, 28], B: [40, 168], C: [250, 168], D: [140, 168], E: [190, 168] },
      segs: [['A', 'B'], ['A', 'C'], ['B', 'C'], ['A', 'D'], ['A', 'E']], fill: ['A', 'B', 'C'],
      right: [['D', 'A', 'B']], lab: { A: [0, -10], B: [-12, 20], C: [12, 20], D: [-6, 24], E: [10, 24] } };
    /* Hình khó 1: chiếc quạt (một điểm, 6 cạnh) */
    O = [180, 168];
    FIG.F4 = { h: 212, order: ['X', 'Q', 'P', 'N', 'M', 'Y', 'O'], pts: { O: O, X: [28, 168], Y: [332, 168], M: polar(O, 25, 125), N: polar(O, 62, 128), P: polar(O, 90, 125), Q: polar(O, 128, 125) },
      segs: [['X', 'Y'], ['O', 'M'], ['O', 'N'], ['O', 'P'], ['O', 'Q']],
      right: [['O', 'Y', 'P']], lab: { X: [-4, 24], Y: [4, 24], O: [0, 26], M: [16, -2], N: [12, -8], P: [0, -10], Q: [-14, -4] } };
    /* Hình khó 2: hình chữ nhật có hai đường chéo */
    FIG.F5 = { h: 200, order: ['A', 'B', 'C', 'D', 'O'], pts: { A: [70, 38], B: [290, 38], C: [290, 158], D: [70, 158], O: [180, 98] },
      segs: [['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'A'], ['A', 'C'], ['B', 'D']], fill: ['A', 'B', 'C', 'D'],
      right: [['A', 'B', 'D'], ['B', 'A', 'C'], ['C', 'B', 'D'], ['D', 'A', 'C']], lab: { A: [-12, -6], B: [12, -6], C: [12, 22], D: [-12, 22], O: [0, 26] } };
    /* Hình khó 3: hai đoạn AD, BE cắt nhau tại F */
    var A = [100, 22], B = [38, 172], C = [322, 172], D = [236, 172], E = [211, 97];
    FIG.F6 = { h: 216, order: ['A', 'B', 'C', 'D', 'E', 'F'], pts: { A: A, B: B, C: C, D: D, E: E, F: isect(A, D, B, E) },
      segs: [['A', 'B'], ['B', 'C'], ['C', 'A'], ['A', 'D'], ['B', 'E']], fill: ['A', 'B', 'C'],
      lab: { A: [0, -10], B: [-12, 20], C: [12, 20], D: [0, 26], E: [16, -2], F: [-2, 24] } };
    /* Hình bình hành có một đường chéo */
    FIG.F7 = { h: 206, order: ['A', 'B', 'C', 'D'], pts: { A: [95, 38], B: [300, 38], C: [265, 168], D: [60, 168] },
      segs: [['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'A'], ['A', 'C']], fill: ['A', 'B', 'C', 'D'],
      lab: { A: [-12, -6], B: [12, -6], C: [14, 20], D: [-12, 20] } };
    /* Hình thoi có hai đường chéo */
    FIG.F8 = { h: 214, order: ['A', 'B', 'C', 'D', 'O'], pts: { A: [180, 22], B: [292, 108], C: [180, 194], D: [68, 108], O: [180, 108] },
      segs: [['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'A'], ['A', 'C'], ['B', 'D']], fill: ['A', 'B', 'C', 'D'],
      right: [['O', 'A', 'B']], lab: { A: [0, -10], B: [16, 6], C: [0, 26], D: [-16, 6], O: [-14, -8] } };
    /* Hình thang vuông có một đường chéo */
    FIG.F9 = { h: 210, order: ['A', 'B', 'C', 'D'], pts: { A: [70, 40], B: [200, 40], C: [290, 172], D: [70, 172] },
      segs: [['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'A'], ['B', 'D']], fill: ['A', 'B', 'C', 'D'],
      right: [['A', 'B', 'D'], ['D', 'A', 'C']], lab: { A: [-12, -6], B: [12, -6], C: [14, 20], D: [-12, 20] } };
    /* Tam giác có D trên BC, E trên AB, nối AD và DE */
    FIG.F10 = { h: 212, order: ['A', 'B', 'C', 'D', 'E'], pts: { A: [190, 45], B: [85, 175], C: [300, 175], D: [265, 175], E: [137.5, 110] },
      segs: [['A', 'B'], ['B', 'C'], ['C', 'A'], ['A', 'D'], ['D', 'E']], fill: ['A', 'B', 'C'],
      lab: { A: [0, -10], B: [-12, 20], C: [12, 20], D: [4, 26], E: [-16, -2] } };
    /* Hai đường thẳng vuông góc cắt nhau, thêm hai tia */
    O = [180, 118];
    FIG.F11 = { h: 214, order: ['A', 'B', 'C', 'D', 'O', 'E', 'F'], pts: { O: O, A: [36, 118], B: [324, 118], C: [180, 22], D: [180, 205], E: polar(O, 35, 105), F: polar(O, 150, 105) },
      segs: [['A', 'B'], ['C', 'D'], ['O', 'E'], ['O', 'F']], right: [['O', 'B', 'C']],
      lab: { A: [-12, 6], B: [12, 6], C: [0, -10], D: [0, 22], O: [14, 22], E: [14, -2], F: [-14, -2] } };
    /* Ngũ giác có hai đường chéo từ A */
    FIG.F12 = { h: 226, order: ['A', 'B', 'C', 'D', 'E'], pts: { A: [177, 20], B: [304, 108], C: [275, 192], D: [120, 192], E: [33, 51] },
      segs: [['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'E'], ['E', 'A'], ['A', 'C'], ['A', 'D']], fill: ['A', 'B', 'C', 'D', 'E'],
      lab: { A: [0, -10], B: [16, 4], C: [14, 20], D: [-14, 20], E: [-16, -4] } };
  })();
  var AN = {}; Object.keys(FIG).forEach(function (k) { AN[k] = analyze(FIG[k]); });

  /* vẽ hình → danh sách nét vẽ trung gian */
  function arcD(V, a1, a2, r, wedge) {
    var p1 = polar(V, a1, r), p2 = polar(V, a2, r), d = ((a2 - a1 + 540) % 360) - 180, sw = d > 0 ? 0 : 1;
    return (wedge ? 'M' + V[0].toFixed(1) + ' ' + V[1].toFixed(1) + ' L' : 'M') + p1[0].toFixed(1) + ' ' + p1[1].toFixed(1) + ' A' + r + ' ' + r + ' 0 0 ' + sw + ' ' + p2[0].toFixed(1) + ' ' + p2[1].toFixed(1) + (wedge ? ' Z' : '');
  }
  function rightD(V, a1, a2, s) {
    var u = polar([0, 0], a1, s), w = polar([0, 0], a2, s);
    return 'M' + V[0].toFixed(1) + ' ' + V[1].toFixed(1) + ' L' + (V[0] + u[0]).toFixed(1) + ' ' + (V[1] + u[1]).toFixed(1) + ' L' + (V[0] + u[0] + w[0]).toFixed(1) + ' ' + (V[1] + u[1] + w[1]).toFixed(1) + ' L' + (V[0] + w[0]).toFixed(1) + ' ' + (V[1] + w[1]).toFixed(1) + ' Z';
  }
  function prims(F, o) {
    o = o || {}; var P = [], pts = F.pts, n = 0;
    if (F.fill) P.push({ t: 'poly', pts: F.fill.map(function (k) { return pts[k][0].toFixed(1) + ',' + pts[k][1].toFixed(1); }).join(' '), fill: '#EEF6FF' });
    (o.wedges || []).forEach(function (w) {
      var V = pts[w.v], a1 = dirA(V, pts[w.p1]), a2 = dirA(V, pts[w.p2]);
      P.push({ t: 'path', d: arcD(V, a1, a2, w.r, true), fill: w.c, op: .22, stroke: 'none', w: 0 });
    });
    F.segs.forEach(function (s) { P.push({ t: 'line', a: pts[s[0]], b: pts[s[1]], c: INK, w: 3.2 }); });
    (F.right || []).forEach(function (r) {
      var V = pts[r[0]]; P.push({ t: 'path', d: rightD(V, dirA(V, pts[r[1]]), dirA(V, pts[r[2]]), 15), fill: '#FFD9DC', stroke: RED, w: 2.6 });
    });
    (o.arcs || []).forEach(function (w) {
      var V = pts[w.v], a1 = dirA(V, pts[w.p1]), a2 = dirA(V, pts[w.p2]);
      P.push({ t: 'path', d: arcD(V, a1, a2, w.r, false), fill: 'none', stroke: w.c, w: w.w || 3.4 });
    });
    (F.order || Object.keys(pts)).forEach(function (k) {
      var p = pts[k], l = (F.lab && F.lab[k]) || [0, -10];
      P.push({ t: 'dot', x: p[0], y: p[1] });
      P.push({ t: 'text', x: p[0] + l[0], y: p[1] + l[1] + 7, s: 21, txt: k, c: INK });
    });
    (o.extra || []).forEach(function (e) { P.push(e); });
    return P;
  }
  function toSvg(P, h) {
    var s = '';
    P.forEach(function (e) {
      if (e.t === 'poly') s += TH.poly(e.pts, e.fill, { stroke: 'none', sw: 0 });
      else if (e.t === 'line') s += TH.l(e.a[0], e.a[1], e.b[0], e.b[1], { c: e.c, w: e.w });
      else if (e.t === 'path') s += e.op != null ? '<path d="' + e.d + '" fill="' + e.fill + '" opacity="' + e.op + '"/>' : TH.path(e.d, e.fill || 'none', { stroke: e.stroke, sw: e.w });
      else if (e.t === 'dot') s += TH.c(e.x, e.y, 3.6, INK, { stroke: INK, sw: 1 });
      else if (e.t === 'text') s += TH.t(e.x, e.y, e.txt, { s: e.s, c: e.c });
      else if (e.t === 'circle') s += TH.c(e.x, e.y, e.r, e.fill || 'none', { stroke: e.stroke, sw: e.w });
      else if (e.t === 'raw') s += e.svg;
    });
    return TH.svg(h, s);
  }
  function toElems(P, tag) {
    var out = [], i = 0;
    P.forEach(function (e) {
      var k = tag + (i++);
      if (e.t === 'poly') out.push({ k: k, t: 'polygon', a: { points: e.pts, 'stroke-width': 0, 'stroke-linejoin': 'round', 'stroke-dasharray': 'none' }, c: { fill: e.fill, stroke: 'none', opacity: 1 } });
      else if (e.t === 'line') out.push({ k: k, t: 'line', a: { x1: e.a[0], y1: e.a[1], x2: e.b[0], y2: e.b[1], 'stroke-width': e.w, 'stroke-linecap': 'round', 'stroke-dasharray': 'none' }, c: { stroke: e.c, opacity: 1 } });
      else if (e.t === 'path') out.push({ k: k, t: 'path', a: { d: e.d, 'stroke-width': e.w || 0, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', 'stroke-dasharray': 'none' }, c: { fill: e.fill || 'none', stroke: e.stroke || 'none', opacity: e.op != null ? e.op : 1 } });
      else if (e.t === 'dot') out.push({ k: k, t: 'circle', geo: { cx: e.x, cy: e.y, r: 3.6 }, c: { fill: INK, stroke: INK, opacity: 1 }, a: { 'stroke-width': 1, 'stroke-dasharray': 'none' } });
      else if (e.t === 'text') out.push({ k: k, t: 'text', m: [e.x, e.y, 0, 1], txt: e.txt, c: { fill: e.c, opacity: 1 }, a: { 'font-size': e.s, 'text-anchor': 'middle' } });
    });
    return out;
  }
  function figSvg(key, h, o) { var F = FIG[key]; return toSvg(prims(F, o), h || F.h); }

  /* ---------- Bài tập đếm góc ---------- */
  var T = function (vi, en) { return LT(vi, en); };
  var TYPE_VI = { right: 'vuông', acute: 'nhọn', obtuse: 'tù', straight: 'bẹt' }, TYPE_EN = { right: 'right', acute: 'acute', obtuse: 'obtuse', straight: 'straight' };
  function listNames(arr) { return arr.map(function (a) { return a.name + (a.type === 'straight' ? T(' (góc bẹt)', ' (straight angle)') : ''); }).join(', '); }

  function mkCount(key, kind, vert) {
    var no0 = /0$/.test(kind); if (no0) kind = kind.slice(0, -1);
    var F = FIG[key], A = AN[key], q, ans, steps = [], tip, parts = null;
    var stepV = [];
    A.verts.forEach(function (v) {
      if (!v.angles.length) return;
      var rays = v.rays.join(', ');
      stepV.push({ v: v, t: T('Đỉnh **' + v.v + '**: ' + v.rays.length + ' cạnh (' + rays + ') → ' + v.angles.length + ' góc: ' + listNames(v.angles) + (v.straight ? ', trong đó có ' + v.straight + ' **góc bẹt**' : '') + '.',
        'Vertex **' + v.v + '**: ' + v.rays.length + ' sides (' + rays + ') → ' + v.angles.length + ' angles: ' + listNames(v.angles) + (v.straight ? ', including ' + v.straight + ' **straight angle**' : '') + '.') });
    });
    tip = T('Đếm **từng đỉnh một**. Ở mỗi đỉnh, đi **một chiều**: cạnh 1 ghép với các cạnh sau, rồi cạnh 2, rồi cạnh 3… Hai cạnh thẳng hàng tạo **góc bẹt**: vẫn đếm và phải gọi rõ là góc bẹt.',
      'Count **one vertex at a time**. At each vertex go **one way round**: side 1 with every later side, then side 2, then side 3… Two sides in a line make a **straight angle**: still count it and name it as a straight angle.');
    if (kind === 'total') {
      ans = A.total;
      q = T('Hình bên có tất cả bao nhiêu góc? (Tính cả góc bẹt.)', 'How many angles are there in the picture in total? (Count straight angles too.)');
      stepV.forEach(function (s) { steps.push({ t: s.t, v: null }); });
      steps.push({ t: T('Cộng lại: ' + stepV.map(function (s) { return s.v.angles.length; }).join(' + ') + ' = **' + A.total + '** góc' + (A.straight ? ' (trong đó có ' + A.straight + ' góc bẹt)' : '') + '.', 'Add up: ' + stepV.map(function (s) { return s.v.angles.length; }).join(' + ') + ' = **' + A.total + '** angles' + (A.straight ? ' (including ' + A.straight + ' straight)' : '') + '.'), v: A.total });
      if (A.straight) steps.push({ t: T('Nếu **không tính góc bẹt**: ' + A.total + ' − ' + A.straight + ' = **' + (A.total - A.straight) + '** góc.', 'If straight angles are **not counted**: ' + A.total + ' − ' + A.straight + ' = **' + (A.total - A.straight) + '** angles.'), v: A.total - A.straight });
      if (no0) { ans = A.total - A.straight; q = T('Hình bên có tất cả bao nhiêu góc? (**Không** tính góc bẹt.)', 'How many angles are there in the picture in total? (Do **not** count straight angles.)'); }
    } else if (kind === 'vertex') {
      var v = A.verts.filter(function (x) { return x.v === vert; })[0];
      ans = no0 ? v.angles.length - v.straight : v.angles.length;
      q = T('Có bao nhiêu góc có đỉnh là **' + vert + '**? (Tính cả góc bẹt.)', 'How many angles have vertex **' + vert + '**? (Count straight angles too.)');
      steps.push({ t: T('Các cạnh xuất phát từ ' + vert + ' (theo một chiều): ' + v.rays.join(', ') + '.', 'Sides from ' + vert + ' (one way round): ' + v.rays.join(', ') + '.'), v: null });
      var cnt = [], n = v.rays.length; for (var i = n - 1; i >= 1; i--) cnt.push(i);
      steps.push({ t: T(cnt.join(' + ') + ' = **' + v.angles.length + '** góc' + (v.straight ? ' (có ' + v.straight + ' góc bẹt)' : '') + ': ' + listNames(v.angles) + '.', cnt.join(' + ') + ' = **' + v.angles.length + '** angles' + (v.straight ? ' (' + v.straight + ' straight)' : '') + ': ' + listNames(v.angles) + '.'), v: v.angles.length });
      if (v.straight) steps.push({ t: T('Nếu **không tính góc bẹt**: ' + v.angles.length + ' − ' + v.straight + ' = **' + (v.angles.length - v.straight) + '** góc (mỗi cặp cạnh thẳng hàng bớt 1 góc).', 'If straight angles are **not counted**: ' + v.angles.length + ' − ' + v.straight + ' = **' + (v.angles.length - v.straight) + '** angles (each pair of sides in a line takes away 1).'), v: v.angles.length - v.straight });
      if (no0) q = T('Có bao nhiêu góc có đỉnh là **' + vert + '**? (**Không** tính góc bẹt.)', 'How many angles have vertex **' + vert + '**? (Do **not** count straight angles.)');
    } else {
      var ks = kind === 'all3' ? ['right', 'acute', 'obtuse'] : kind === 'all4' ? ['right', 'acute', 'obtuse', 'straight'] : [kind];
      var lst = function (k) { return k === 'straight' ? A.sl : A[k]; };
      var nameOf = function (k) { return T('góc ' + TYPE_VI[k], TYPE_EN[k] + ' angles'); };
      if (ks.length === 1) q = T('Hình bên có bao nhiêu góc **' + TYPE_VI[kind] + '**?', 'How many **' + TYPE_EN[kind] + '** angles are there in the picture?');
      else q = T('Đếm số góc ' + ks.map(function (k) { return '**' + TYPE_VI[k] + '**'; }).join(', ') + '. Điền vào từng ô.', 'Count the ' + ks.map(function (k) { return '**' + TYPE_EN[k] + '**'; }).join(', ') + ' angles. Fill in each box.');
      parts = ks.map(function (k) { return { lab: ks.length === 1 ? '' : T('Góc ' + TYPE_VI[k], TYPE_EN[k][0].toUpperCase() + TYPE_EN[k].slice(1)), ans: lst(k).length, unit: T('góc', 'angles'), kind: 'num' }; });
      ans = parts[0].ans;
      steps.push({ t: T('So sánh từng góc với **góc vuông** (□): bé hơn là góc nhọn, lớn hơn là góc tù; hai cạnh thẳng hàng là góc bẹt.', 'Compare each angle with a **right angle** (□): smaller is acute, bigger is obtuse; two sides in a line make a straight angle.'), v: null });
      ks.forEach(function (k, ix) {
        var arr = lst(k);
        steps.push({ t: arr.length ? T('Góc ' + TYPE_VI[k] + ': ' + listNames(arr) + ' → **' + arr.length + '** góc.', TYPE_EN[k].charAt(0).toUpperCase() + TYPE_EN[k].slice(1) + ' angles: ' + listNames(arr) + ' → **' + arr.length + '**.') : T('Góc ' + TYPE_VI[k] + ': không có → **0** góc.', TYPE_EN[k].charAt(0).toUpperCase() + TYPE_EN[k].slice(1) + ' angles: none → **0**.'), v: parts[ix].ans });
      });
      tip = T('Đi **từng đỉnh một** và xét từng góc: nhọn bé hơn góc vuông, tù lớn hơn góc vuông nhưng bé hơn góc bẹt. Góc kề bù với góc vuông cũng là góc vuông.', 'Go **one vertex at a time** and check each angle: acute is smaller than a right angle, obtuse is bigger but less than a straight angle. An angle next to a right angle on a line is also a right angle.');
    }
    var elems = toElems(prims(F), 'g');
    return { q: q, fig: { fb: { frames: [elems], vb: [360, F.h] }, f: 0 }, parts: parts || [{ lab: '', ans: ans, unit: T('góc', 'angles'), kind: 'num' }], steps: steps, tip: tip, parts_n: 1 };
  }
  var BANK = {
    1: [['S1', 'total'], ['S2', 'total']],
    2: [['F3', 'vertex0', 'D'], ['F10', 'vertex0', 'D'], ['F1', 'right'], ['F1', 'acute'], ['F3', 'vertex', 'A'], ['F3', 'right'], ['F7', 'obtuse'], ['F7', 'acute'], ['F8', 'right'], ['F9', 'right'], ['F9', 'acute'], ['F11', 'right'], ['F10', 'vertex', 'D'], ['S2', 'obtuse'], ['F12', 'obtuse']],
    3: [['F1', 'all4'], ['F2', 'all4'], ['F3', 'all4'], ['F4', 'all4'], ['F5', 'all3'], ['F6', 'all4'], ['F7', 'all3'], ['F8', 'all4'], ['F9', 'all3'], ['F10', 'all4'], ['F11', 'all4'], ['F12', 'all3'],
      ['F2', 'obtuse'], ['F6', 'acute'], ['F8', 'obtuse'], ['F12', 'acute'], ['F6', 'total'], ['F5', 'total'], ['F6', 'vertex0', 'F'], ['F4', 'vertex0', 'O'], ['F3', 'total0'], ['F5', 'total0']]
  };
  function countQ(tier, r) {
    var f = window.__force, c = f ? [f.fig, f.kind, f.vert] : r.pick(BANK[tier] || BANK[3]);
    return mkCount(c[0], c[1], c[2]);
  }
  var AL = LESSONS.filter(function (l) { return l.id === 'angle'; })[0], og = AL.gen;
  AL.gen = function (tier, r) {
    if (window.__force) return countQ(tier, r);
    var p = tier === 1 ? .0 : tier === 2 ? .4 : .45;
    if (tier >= 2 && r.chance(p)) return countQ(tier, r);
    return og.apply(this, arguments);
  };

  /* ---------- Lý thuyết: cách đếm góc ---------- */
  function F3x(o) { return figSvg('F3', 215, o); }
  var badge = function (x, y, n, c) { return { t: 'circle', x: x, y: y, r: 12, fill: c, stroke: INK, w: 2 }; };
  var rowTxt = function (x, y, txt, s, c) { return { t: 'text', x: x, y: y, s: s || 16, txt: txt, c: c || INK }; };
  var ptAt = function (key, from, to, f) { var a = FIG[key].pts[from], b = FIG[key].pts[to]; return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]; };
  var AP = [];
  /* ---- Hướng dẫn từng bước: tô đỉnh đang đếm, hiện từng cạnh, tô từng góc ---- */
  var RC = [BLUE, ORANGE, GREEN, PINK];
  function pg(key, vertex, st) {
    var F = FIG[key], V = F.pts[vertex], vt = AN[key].verts.filter(function (x) { return x.v === vertex; })[0];
    var rays = st.order || vt.rays.map(function (r) { return r.charAt(1); }), ex = [], wedges = [], arcs = [];
    if (st.glow) ex.push({ t: 'circle', x: V[0], y: V[1], r: 19, fill: 'none', stroke: '#F5B800', w: 5 });
    (st.show || []).forEach(function (k) {
      var P = F.pts[rays[k]];
      ex.push({ t: 'raw', svg: TH.l(V[0], V[1], P[0], P[1], { c: RC[k], w: st.hot && st.hot.indexOf(k) < 0 ? 4 : 7 }) });
    });
    (st.show || []).forEach(function (k) {
      var P = F.pts[rays[k]], q = [V[0] + (P[0] - V[0]) * .5 + (k < rays.length / 2 ? -15 : 15), V[1] + (P[1] - V[1]) * .5];
      ex.push({ t: 'circle', x: q[0], y: q[1], r: 11, fill: RC[k], stroke: INK, w: 2 });
      ex.push({ t: 'text', x: q[0], y: q[1] + 5.5, s: 15, txt: String(k + 1), c: '#fff' });
    });
    (st.pairs || []).forEach(function (pr) {
      var a1 = dirA(V, F.pts[rays[pr[0]]]), a2 = dirA(V, F.pts[rays[pr[1]]]), R = pr[2] || 38, col = RC[pr[0]];
      var d = adiff(a1, a2), dd;
      if (Math.abs(d - 180) < 1.5) {
        var third = st.third != null ? dirA(V, F.pts[rays[st.third]]) : a1 + 90;
        var m1 = a1 + 90, m2 = a1 - 90, sw = adiff(m1, third) < adiff(m2, third) ? 0 : 1;
        var p1 = polar(V, a1, R), p2 = polar(V, a2, R);
        dd = 'M' + p1[0].toFixed(1) + ' ' + p1[1].toFixed(1) + ' A' + R + ' ' + R + ' 0 0 ' + sw + ' ' + p2[0].toFixed(1) + ' ' + p2[1].toFixed(1);
        arcs.push({ d: dd, c: RED });
      } else {
        wedges.push({ d: arcD(V, a1, a2, R, true), c: col });
        arcs.push({ d: arcD(V, a1, a2, R, false), c: col });
      }
    });
    var extra = [];
    wedges.forEach(function (w) { extra.push({ t: 'path', d: w.d, fill: w.c, op: .4, stroke: 'none', w: 0 }); });
    arcs.forEach(function (w) { extra.push({ t: 'path', d: w.d, fill: 'none', stroke: w.c, w: 4 }); });
    extra = extra.concat(ex);
    if (st.counter) extra.push({ t: 'text', x: 180, y: 244, s: 15, txt: st.counter, c: INK });
    (st.more || []).forEach(function (m) { extra.push(m); });
    return figSvg(key, 256, { extra: extra });
  }
  var anA = AN.F3.verts.filter(function (x) { return x.v === 'A'; })[0], nmA = anA.angles.map(function (a) { return a.name; });
  var counter = function (n) { return T('Đã đếm: ', 'Counted: ') + nmA.slice(0, n).join(' · ') + '  (' + n + ')'; };
  /* 1: đỉnh A */
  AP.push({ svg: function () { return pg('F3', 'A', { glow: 1 }); },
    say: T('Muốn đếm góc **không sót, không trùng**, con hãy đếm **từng đỉnh một**. Vòng vàng chỉ **đỉnh con đang đếm**. Ta bắt đầu ở đỉnh **A**.', 'To count angles **without missing or repeating**, count **one vertex at a time**. The yellow ring shows the **vertex we are counting**. Let us start at vertex **A**.') });
  /* 2-5: từng cạnh */
  var sideSay = [
    T('Đứng ở A, đếm các cạnh **theo một chiều** (từ trái sang phải). Cạnh **①** là **AB** (cạnh đang đếm được tô đậm).', 'Standing at A, count the sides **one way round** (left to right). Side **①** is **AB** (the side being counted is thick).'),
    T('Bấm Tiếp, cạnh kế tiếp hiện ra: cạnh **②** là **AD**.', 'Press Next and the next side appears: side **②** is **AD**.'),
    T('Cạnh **③** là **AE**.', 'Side **③** is **AE**.'),
    T('Cạnh **④** là **AC**. Ở đỉnh A có **4 cạnh**: AB, AD, AE, AC.', 'Side **④** is **AC**. Vertex A has **4 sides**: AB, AD, AE, AC.')];
  [0, 1, 2, 3].forEach(function (k) {
    AP.push({ svg: function () { var sh = []; for (var i = 0; i <= k; i++) sh.push(i); return pg('F3', 'A', { glow: 1, show: sh, hot: [k] }); }, say: sideSay[k] });
  });
  /* 6-11: từng góc (cạnh 1 với 2,3,4; cạnh 2 với 3,4; cạnh 3 với 4) */
  var prs = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]], rn = ['', '', '', ''];
  var ord = ['①', '②', '③', '④'];
  prs.forEach(function (pr, n) {
    var lead = n === 3 ? T('Xong cạnh ①. Sang **cạnh ②**: ', 'Side ① is done. Move to **side ②**: ') : n === 5 ? T('Xong cạnh ②. Sang **cạnh ③**: ', 'Side ② is done. Move to **side ③**: ') : '';
    AP.push({ svg: function () { return pg('F3', 'A', { glow: 1, show: [0, 1, 2, 3], hot: [pr[0], pr[1]], pairs: [[pr[0], pr[1], 58]], counter: counter(n + 1) }); },
      say: lead + T('Cạnh **' + ord[pr[0]] + '** ghép với cạnh **' + ord[pr[1]] + '**: góc **' + nmA[n] + '**. Đã đếm **' + (n + 1) + '** góc' + (n === 5 ? ' ở đỉnh A (3 + 2 + 1 = 6).' : '.'),
        'Side **' + ord[pr[0]] + '** with side **' + ord[pr[1]] + '**: angle **' + nmA[n] + '**. Counted **' + (n + 1) + '** angle' + (n ? 's' : '') + (n === 5 ? ' at A (3 + 2 + 1 = 6).' : '.')) });
  });
  /* 12-15: đỉnh D (có góc bẹt) */
  var dOrd = ['B', 'A', 'E'], dNm = ['BDA', 'BDE', 'ADE'], dPr = [[0, 1], [0, 2], [1, 2]];
  var dCnt = function (n) { return T('Đã đếm: ', 'Counted: ') + dNm.slice(0, n).map(function (x) { return x + (x === 'BDE' ? T(' (góc bẹt)', ' (straight)') : ''); }).join(' · ') + '  (' + n + ')'; };
  AP.push({ svg: function () { return pg('F3', 'D', { glow: 1, order: dOrd, show: [0, 1, 2] }); },
    say: T('Sang đỉnh **D** (vòng vàng). Có 3 cạnh, đếm từ trái sang phải: **①** DB, **②** DA, **③** DE.', 'Now vertex **D** (yellow ring). It has 3 sides, counted left to right: **①** DB, **②** DA, **③** DE.') });
  var dSay = [
    T('Cạnh **①** ghép với cạnh **②**: góc **BDA** (góc vuông). Đã đếm **1** góc.', 'Side **①** with side **②**: angle **BDA** (a right angle). Counted **1** angle.'),
    T('Cạnh **①** ghép với cạnh **③**: DB và DE **thẳng hàng** nên tạo **góc bẹt BDE** (nét đỏ). Ta **vẫn đếm** và gọi rõ là **góc bẹt**. Đã đếm **2** góc.', 'Side **①** with side **③**: DB and DE are **in a line**, so they make the **straight angle BDE** (red line). We **still count it** and call it a **straight angle**. Counted **2** angles.'),
    T('Xong cạnh ①. Sang cạnh **②** ghép với cạnh **③**: góc **ADE** (góc vuông). Đỉnh D có **3** góc, trong đó có **1 góc bẹt**.', 'Side ① is done. Side **②** with side **③**: angle **ADE** (a right angle). Vertex D has **3** angles, including **1 straight angle**.')];
  dPr.forEach(function (pr, n) {
    AP.push({ svg: function () { return pg('F3', 'D', { glow: 1, order: dOrd, show: [0, 1, 2], hot: [pr[0], pr[1]], pairs: [[pr[0], pr[1], n === 1 ? 62 : 36]], third: 1, counter: dCnt(n + 1) }); }, say: dSay[n] });
  });
  /* 13: B, C, E */
  AP.push({ svg: function () { return figSvg('F3', 215, { extra: ['B', 'C', 'E'].map(function (k) { var p = FIG.F3.pts[k]; return { t: 'circle', x: p[0], y: p[1], r: 17, fill: 'none', stroke: '#F5B800', w: 5 }; }) }); },
    say: T('Làm tương tự ở các đỉnh còn lại: đỉnh **B** có 1 góc, đỉnh **C** có 1 góc, đỉnh **E** có 3 góc (trong đó có 1 **góc bẹt**).', 'Do the same at the other vertices: vertex **B** has 1 angle, **C** has 1 angle, **E** has 3 angles (including 1 **straight angle**).') });
  /* 5. các đỉnh còn lại */
  AP.push({ svg: function () {
      var bx = function (x, y, a, b, note, f) { return TH.r(x, y, 104, 50, f, { rx: 12 }) + TH.t(x + 52, y + 24, a + ': ' + b + ' ' + T('góc', b === 1 ? 'angle' : 'angles'), { s: 14 }) + (note ? TH.t(x + 52, y + 42, note, { s: 12, c: RED }) : ''); };
      var nb = T('có 1 góc bẹt', 'incl. 1 straight');
      var s = bx(12, 8, T('Đỉnh A', 'A'), 6, '', 'sun') + bx(128, 8, T('Đỉnh B', 'B'), 1, '', 'sky') + bx(244, 8, T('Đỉnh C', 'C'), 1, '', 'sky') +
        bx(70, 66, T('Đỉnh D', 'D'), 3, nb, 'mint') + bx(186, 66, T('Đỉnh E', 'E'), 3, nb, 'mint') +
        TH.r(30, 128, 300, 56, 'lilac', { rx: 14 }) + TH.t(180, 154, '6 + 1 + 1 + 3 + 3 = 14', { s: 24 }) + TH.t(180, 174, T('trong đó có 2 góc bẹt', 'including 2 straight angles'), { s: 13, c: RED });
      return TH.svg(192, s);
    },
    say: T('Cộng các đỉnh lại: 6 + 1 + 1 + 3 + 3 = **14 góc**, trong đó có **2 góc bẹt** (một ở đỉnh D, một ở đỉnh E).', 'Add up the vertices: 6 + 1 + 1 + 3 + 3 = **14 angles**, including **2 straight angles** (one at D, one at E).') });
  /* ---- Không tính góc bẹt ở một đỉnh: đếm như thường rồi trừ số góc bẹt ---- */
  var nb = function (y, txt) { return { t: 'raw', svg: TH.r(70, y - 24, 220, 34, 'sun', { rx: 10 }) + TH.t(180, y, txt, { s: 18 }) }; };
  AP.push({ svg: function () { return pg('F3', 'D', { glow: 1, order: dOrd, show: [0, 1, 2], pairs: [[0, 2, 56]], third: 1, more: [nb(246, T('3 góc − 1 góc bẹt = 2 góc', '3 − 1 straight = 2'))] }); },
    say: T('Nếu đề bài ghi **không tính góc bẹt** thì sao? Vẫn đếm như cũ, rồi **trừ đi số góc bẹt**. Đỉnh D có 3 góc, trong đó DB và DE **thẳng hàng** tạo 1 góc bẹt (nét đỏ). Không tính góc bẹt: 3 − 1 = **2 góc** (BDA và ADE).', 'What if the problem says **do not count straight angles**? Count as usual, then **subtract the straight angles**. Vertex D has 3 angles, and DB, DE are **in a line**, making 1 straight angle (red). Without straight angles: 3 − 1 = **2 angles** (BDA and ADE).') });
  var vF = AN.F6.verts.filter(function (x) { return x.v === 'F'; })[0], rF = vF.rays.map(function (r) { return r.charAt(1); });
  var iF = function (c) { return rF.indexOf(c); };
  AP.push({ svg: function () { return pg('F6', 'F', { glow: 1, show: [0, 1, 2, 3], pairs: [[iF('A'), iF('D'), 30], [iF('B'), iF('E'), 46]], third: iF('B'), more: [nb(246, T('6 góc − 2 góc bẹt = 4 góc', '6 − 2 straight = 4'))] }); },
    say: T('Đỉnh **F**: 4 cạnh → 3 + 2 + 1 = **6 góc**. Có **2 cặp cạnh thẳng hàng** (FA với FD, FB với FE) nên có **2 góc bẹt**. Không tính góc bẹt: 6 − 2 = **4 góc**.', 'Vertex **F**: 4 sides → 3 + 2 + 1 = **6 angles**. There are **2 pairs of sides in a line** (FA with FD, FB with FE), so **2 straight angles**. Without straight angles: 6 − 2 = **4 angles**.') });
  AP.push({ svg: function () { return figSvg('F4', 212, {}); },
    say: T('Mẹo nhớ: **số góc không tính bẹt = số góc − số cặp cạnh thẳng hàng**. Ở hình quạt, điểm O có 6 cạnh (6 cạnh → 15 góc), OX và OY thẳng hàng. Không tính góc bẹt thì có bao nhiêu góc?', 'Tip: **angles without straight = all angles − pairs of sides in a line**. In this fan, point O has 6 sides (6 sides → 15 angles), and OX, OY are in a line. Without straight angles, how many angles are there?'),
    ask: { opts: [T('14', '14'), T('15', '15'), T('13', '13')], ans: T('14', '14'), good: T('Đúng! 15 − 1 = 14 góc.', 'Right! 15 − 1 = 14 angles.') } });
  /* 6. bảng mẹo */
  AP.push({ svg: function () {
      var s = '', d = [[2, 1, '1'], [3, 3, '1 + 2'], [4, 6, '1 + 2 + 3'], [5, 10, '1 + 2 + 3 + 4']];
      d.forEach(function (r, i) {
        var y = 8 + i * 48, f = ['sky', 'mint', 'sun', 'lilac'][i];
        s += TH.r(14, y, 332, 40, f, { rx: 12 }) + TH.t(90, y + 27, T(r[0] + ' cạnh', r[0] + ' sides'), { s: 18 }) + TH.t(220, y + 27, r[0] === 2 ? '1' : r[2] + ' = ' + r[1], { s: 18 }) + TH.t(318, y + 27, T('góc', 'angles'), { s: 14, c: GREY, a: 'end' });
      });
      return TH.svg(206, s);
    },
    say: T('Mẹo nhớ: ở một đỉnh có **n cạnh**, số góc là (n − 1) + (n − 2) + … + 1 (kể cả **góc bẹt** nếu có hai cạnh thẳng hàng). Có 2 cạnh → 1 góc; 3 cạnh → 3 góc; 4 cạnh → 6 góc; 5 cạnh → 10 góc.', 'Tip: at a vertex with **n sides**, the number of angles is (n − 1) + (n − 2) + … + 1. 2 sides → 1 angle; 3 → 3; 4 → 6; 5 → 10.') });
  /* 7. hỏi */
  AP.push({ svg: function () { return figSvg('S3', 208, {}); },
    say: T('Thử tài! Từ điểm O có **5 cạnh** xuất phát (OA, OB, OC, OD, OE). Đếm theo cách vừa học: 4 + 3 + 2 + 1. Có bao nhiêu góc?', 'Your turn! From point O there are **5 sides** (OA, OB, OC, OD, OE). Count the way we learned: 4 + 3 + 2 + 1. How many angles?'),
    ask: { opts: [T('10', '10'), T('5', '5'), T('15', '15')], ans: T('10', '10'), good: T('Đúng! 4 + 3 + 2 + 1 = 10 góc.', 'Right! 4 + 3 + 2 + 1 = 10 angles.') } });
  T4.pushTheoryPages('angle', AP);

  /* móc cho kiểm thử tự động (tests/) */
  T4.angle = { FIG: FIG, AN: AN, analyze: analyze, mkCount: mkCount };
  window.__dg = T4.angle;
})();
