//# Viết số: nhận dạng chữ số viết tay ngay trên máy, học chữ của bé (Dạy máy chữ)
//# Tự chứa trong một hàm bọc — chạy độc lập, không cần build.


/* ===== Toán 4 Phiêu Lưu – Viết số: nhận dạng chữ số viết tay ngay trên máy ===== */
(function () {
  var G = globalThis, Store = G.Store, UI = G.UI, ACT = G.ACT, SC = G.SC;
  var esc = G.esc;
  /* ---------- 1. mô hình CNN (giải nén trọng số int8) ---------- */
  var M = window.INK_MODEL, W = {};
  function dec(o) {
    var b = atob(o.q || o.f), n = b.length, a;
    if (o.q) { a = new Float32Array(n); for (var i = 0; i < n; i++) { var v = b.charCodeAt(i); a[i] = (v > 127 ? v - 256 : v) * o.k; } return a; }
    var u = new Uint8Array(n); for (var j = 0; j < n; j++) u[j] = b.charCodeAt(j); return new Float32Array(u.buffer);
  }
  if (M) Object.keys(M).forEach(function (k) { W[k] = dec(M[k]); });
  function conv(inp, H, Wd, C, w, b, O) {
    var out = new Float32Array(H * Wd * O);
    for (var y = 0; y < H; y++) for (var x = 0; x < Wd; x++) for (var o = 0; o < O; o++) {
      var s = b[o];
      for (var ky = 0; ky < 3; ky++) { var iy = y + ky - 1; if (iy < 0 || iy >= H) continue;
        for (var kx = 0; kx < 3; kx++) { var ix = x + kx - 1; if (ix < 0 || ix >= Wd) continue;
          var ib = (iy * Wd + ix) * C, wb = (ky * 3 + kx) * C * O + o;
          for (var c = 0; c < C; c++) s += inp[ib + c] * w[wb + c * O]; } }
      out[(y * Wd + x) * O + o] = s > 0 ? s : 0;
    }
    return out;
  }
  function pool(inp, H, Wd, C) {
    var h = H >> 1, w = Wd >> 1, out = new Float32Array(h * w * C);
    for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) for (var c = 0; c < C; c++) {
      var m = -1e9;
      for (var dy = 0; dy < 2; dy++) for (var dx = 0; dx < 2; dx++) { var v = inp[((2 * y + dy) * Wd + 2 * x + dx) * C + c]; if (v > m) m = v; }
      out[(y * w + x) * C + c] = m;
    }
    return out;
  }
  function dense(x, w, b, I, O, relu) {
    var out = new Float32Array(O);
    for (var o = 0; o < O; o++) { var s = b[o]; for (var i = 0; i < I; i++) s += x[i] * w[i * O + o]; out[o] = relu && s < 0 ? 0 : s; }
    return out;
  }
  function run(x28) {
    var a = pool(conv(x28, 28, 28, 1, W.c1, W.b1, 16), 28, 28, 16);
    a = pool(conv(a, 14, 14, 16, W.c2, W.b2, 32), 14, 14, 32);
    var e = dense(a, W.d1, W.e1, 1568, 64, true), l = dense(e, W.d2, W.e2, 64, 10, false);
    var mx = Math.max.apply(null, l), ex = l.map ? Array.prototype.map.call(l, function (v) { return Math.exp(v - mx); }) : [], sum = ex.reduce(function (a2, b2) { return a2 + b2; }, 0);
    return { p: ex.map(function (v) { return v / sum; }), emb: e };
  }
  /* ---------- 2. chuẩn hoá nét viết thành ảnh 28×28 (giống MNIST) ---------- */
  var cvs = document.createElement("canvas"); cvs.width = cvs.height = 112;
  var c56 = document.createElement("canvas"); c56.width = c56.height = 56;
  var c28 = document.createElement("canvas"); c28.width = c28.height = 28;
  function raster(strokes) {
    var x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    strokes.forEach(function (s) { s.forEach(function (p) { x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); }); });
    var w = x1 - x0, h = y1 - y0, size = Math.max(w, h, 1), lw = 9, sc = (80 - lw) / size;
    var ox = 56 - (w * sc) / 2, oy = 56 - (h * sc) / 2;
    var g = cvs.getContext("2d"); g.fillStyle = "#000"; g.fillRect(0, 0, 112, 112);
    g.strokeStyle = g.fillStyle = "#fff"; g.lineWidth = lw; g.lineCap = g.lineJoin = "round";
    strokes.forEach(function (s) {
      g.beginPath();
      s.forEach(function (p, i) { var X = ox + (p[0] - x0) * sc, Y = oy + (p[1] - y0) * sc; i ? g.lineTo(X, Y) : g.moveTo(X, Y); });
      if (s.length === 1) { var X = ox + (s[0][0] - x0) * sc, Y = oy + (s[0][1] - y0) * sc; g.arc(X, Y, lw / 2, 0, 7); g.fill(); } else g.stroke();
    });
    var g2 = c56.getContext("2d"); g2.imageSmoothingEnabled = true; g2.imageSmoothingQuality = "high"; g2.drawImage(cvs, 0, 0, 56, 56);
    var g3 = c28.getContext("2d"); g3.imageSmoothingEnabled = true; g3.imageSmoothingQuality = "high"; g3.drawImage(c56, 0, 0, 28, 28);
    var d = g3.getImageData(0, 0, 28, 28).data, img = new Float32Array(784), sx = 0, sy = 0, tot = 0;
    for (var i = 0; i < 784; i++) { var v = d[i * 4] / 255; img[i] = v; tot += v; sx += v * (i % 28); sy += v * Math.floor(i / 28); }
    if (tot <= 0) return img;
    var dx = Math.round(14 - sx / tot), dy = Math.round(14 - sy / tot), out = new Float32Array(784);
    for (var yy = 0; yy < 28; yy++) for (var xx = 0; xx < 28; xx++) { var tx = xx + dx, ty = yy + dy; if (tx >= 0 && tx < 28 && ty >= 0 && ty < 28) out[ty * 28 + tx] = img[yy * 28 + xx]; }
    return out;
  }
  /* ---------- 3. học chữ của bé ---------- */
  var LK = "toan4pl_inkme_v1";
  function mine() { try { var a = JSON.parse(localStorage.getItem(LK) || "[]"); return Array.isArray(a) ? a : []; } catch (e) { return []; } }
  function saveMine(a) { try { localStorage.setItem(LK, JSON.stringify(a.slice(-300))); } catch (e) {} }
  function addSample(label, emb) { var a = mine(); a.push({ l: label, e: Array.prototype.map.call(emb, function (v) { return Math.round(v * 1000) / 1000; }) }); saveMine(a); }
  function cos(a, b) { var s = 0, na = 0, nb = 0; for (var i = 0; i < a.length; i++) { s += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i]; } return s / (Math.sqrt(na * nb) || 1); }
  function classify(strokes) {
    var x = raster(strokes), r = run(x), p = r.p.slice(), S = mine();
    if (S.length) {
      var sims = S.map(function (s) { return [cos(r.emb, s.e), s.l]; }).sort(function (a, b) { return b[0] - a[0]; }).slice(0, 3);
      sims.forEach(function (z, k) { if (z[0] > 0.86) p[z[1]] += (z[0] - 0.86) * (k === 0 ? 6 : 3); });
      var t = p.reduce(function (a, b) { return a + b; }, 0); p = p.map(function (v) { return v / t; });
    }
    var order = p.map(function (v, i) { return [v, i]; }).sort(function (a, b) { return b[0] - a[0]; });
    return { d: order[0][1], conf: order[0][0], alts: order.slice(0, 3).map(function (o) { return o[1]; }), emb: r.emb };
  }
  /* ---------- 4. tách các chữ số theo nét ---------- */
  function segment(strokes, H) {
    var bx = strokes.map(function (s, i) { var x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9; s.forEach(function (p) { x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); }); return { i: i, x0: x0, x1: x1, y0: y0, y1: y1 }; });
    bx.sort(function (a, b) { return (a.x0 + a.x1) - (b.x0 + b.x1); });
    var groups = [];
    bx.forEach(function (b) {
      var g = groups[groups.length - 1], tiny = (b.x1 - b.x0) < H * 0.06 && (b.y1 - b.y0) < H * 0.06;
      if (g) {
        var gh = Math.max(g.y1 - g.y0, b.y1 - b.y0, H * 0.2);
        var ov = Math.min(g.x1, b.x1) - Math.max(g.x0, b.x0), mw = Math.max(4, Math.min(g.x1 - g.x0, b.x1 - b.x0));
        var cx = (b.x0 + b.x1) / 2, cw = Math.max(g.x1, b.x1) - Math.min(g.x0, b.x0);
        var touch = ov > -0.06 * gh && cw < 0.85 * gh && Math.min(g.y1, b.y1) - Math.max(g.y0, b.y0) > -0.1 * gh;
        if (ov > mw * 0.35 || (cx > g.x0 && cx < g.x1) || touch || (tiny && b.x0 - g.x1 < H * 0.15)) { g.s.push(b.i); g.x0 = Math.min(g.x0, b.x0); g.x1 = Math.max(g.x1, b.x1); g.y0 = Math.min(g.y0, b.y0); g.y1 = Math.max(g.y1, b.y1); return; }
      }
      groups.push({ s: [b.i], x0: b.x0, x1: b.x1, y0: b.y0, y1: b.y1 });
    });
    return groups;
  }
  /* ---------- 5. bảng Viết số ---------- */
  var InkNum = {
    open: function (o) {
      var strokes = [], groups = [], res = [], over = {}, alt = -1, cur = null;
      var root = document.createElement("div"); root.className = "inknum";
      root.innerHTML = LT('<div class="inbox"><div class="inh"><b>🔢 Viết số</b><span class="intg">', '<div class="inbox"><div class="inh"><b>🔢 Write Number</b><span class="intg">') + esc(o.label || "") + LT('</span><button class="btn sm" data-n="draft">✏️ Nháp</button><button class="ibtn" data-n="x" aria-label="Đóng">✕</button></div>', '</span><button class="btn sm" data-n="draft">✏️ Scratch</button><button class="ibtn" data-n="x" aria-label="Close">✕</button></div>') +
        (o.q ? '<div class="inq">' + o.q + "</div>" : "") +
        LT('<div class="inread"><span>Máy đọc:</span><div class="inchips"></div></div><div class="inalts"></div>', '<div class="inread"><span>Machine reads:</span><div class="inchips"></div></div><div class="inalts"></div>') +
        '<div class="inpad"><canvas></canvas><div class="inguide"></div></div>' +
        LT('<div class="inhint">Viết từng chữ số từ trái sang phải, chữ to, cách nhau một chút. Chạm vào chữ số máy đọc để sửa.</div>', '<div class="inhint">Write each digit from left to right, big, with a little space between them. Tap a digit the machine read to fix it.</div>') +
        LT('<div class="inbtns"><button class="btn sm" data-n="undo">↶ Xoá nét</button><button class="btn sm" data-n="clear">🗑 Xoá hết</button><button class="btn pri" data-n="ok" disabled>✓ Điền vào ô</button></div></div>', '<div class="inbtns"><button class="btn sm" data-n="undo">↶ Undo stroke</button><button class="btn sm" data-n="clear">🗑 Clear all</button><button class="btn pri" data-n="ok" disabled>✓ Fill in box</button></div></div>');
      document.body.appendChild(root);
      var pad = root.querySelector(".inpad"), cv = root.querySelector("canvas"), ctx = cv.getContext("2d"), dpr = Math.min(2, window.devicePixelRatio || 1), Wd = 0, Hd = 0;
      function size() { Wd = pad.clientWidth; Hd = pad.clientHeight; cv.width = Wd * dpr; cv.height = Hd * dpr; cv.style.width = Wd + "px"; cv.style.height = Hd + "px"; draw(); }
      function draw() {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, Wd, Hd);
        groups.forEach(function (g, k) {
          if (alt === k) { ctx.fillStyle = "rgba(255,210,63,.25)"; ctx.fillRect(g.x0 - 8, 6, g.x1 - g.x0 + 16, Hd - 12); }
        });
        ctx.strokeStyle = "#1F2A44"; ctx.lineWidth = Math.max(5, Hd * 0.035); ctx.lineCap = ctx.lineJoin = "round";
        strokes.forEach(function (s) { ctx.beginPath(); s.forEach(function (p, i) { i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); }); if (s.length === 1) { ctx.arc(s[0][0], s[0][1], 2, 0, 7); } ctx.stroke(); });
      }
      var tm = 0;
      function recog() {
        groups = segment(strokes, Hd).slice(0, 12);
        res = groups.map(function (g) { return classify(g.s.map(function (i) { return strokes[i]; })); });
        var keep = {}; groups.forEach(function (g, k) { var key = g.s.join(","); if (over[key] != null) keep[key] = over[key]; }); over = keep;
        if (alt >= groups.length) alt = -1;
        chips();
      }
      function digitAt(k) { var key = groups[k].s.join(","); return over[key] != null ? over[key] : res[k].d; }
      function value() { return groups.map(function (g, k) { return digitAt(k); }).join(""); }
      function chips() {
        var box = root.querySelector(".inchips");
        box.innerHTML = groups.length ? groups.map(function (g, k) {
          var r = res[k], fixed = over[g.s.join(",")] != null, low = !fixed && r.conf < 0.6;
          return '<button class="inchip' + (low ? " low" : "") + (fixed ? " fix" : "") + (alt === k ? " sel" : "") + '" data-c="' + k + '">' + digitAt(k) + (low ? "<i>?</i>" : "") + "</button>";
        }).join("") : LT('<span class="muted">(chưa có chữ số)</span>', '<span class="muted">(no digits yet)</span>');
        var ok = root.querySelector('[data-n=ok]'); ok.disabled = !groups.length;
        ok.textContent = groups.length ? LT("✓ Điền " + G.fmt(value()), "✓ Fill in " + G.fmt(value())) : LT("✓ Điền vào ô", "✓ Fill in box");
        var A = root.querySelector(".inalts");
        if (alt >= 0 && res[alt]) {
          A.innerHTML = LT('<span>Chữ số này là:</span>', '<span>This digit is:</span>') + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (d) { var top = res[alt].alts.indexOf(d) >= 0; return '<button class="inalt' + (top ? " top" : "") + (digitAt(alt) === d ? " on" : "") + '" data-d="' + d + '">' + d + "</button>"; }).join("") + LT('<button class="inalt del" data-d="del">Xoá chữ này</button>', '<button class="inalt del" data-d="del">Delete this digit</button>');
        } else A.innerHTML = "";
        draw();
      }
      function pt(e) { var r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; }
      cv.addEventListener("pointerdown", function (e) { try { cv.setPointerCapture(e.pointerId); } catch (x) {} cur = [pt(e)]; strokes.push(cur); alt = -1; clearTimeout(tm); draw(); e.preventDefault(); });
      cv.addEventListener("pointermove", function (e) { if (!cur) return; var p = pt(e), l = cur[cur.length - 1]; if (Math.hypot(p[0] - l[0], p[1] - l[1]) > 1.5) { cur.push(p); draw(); } e.preventDefault(); });
      var up = function () { if (!cur) return; cur = null; clearTimeout(tm); tm = setTimeout(recog, 250); };
      cv.addEventListener("pointerup", up); cv.addEventListener("pointercancel", up);
      function close() { window.removeEventListener("resize", size); root.remove(); InkNum.cur = null; }
      root.addEventListener("click", function (e) {
        var b = e.target.closest("[data-n],[data-c],[data-d]"); if (!b) return;
        G.Sfx && G.Sfx.tap && G.Sfx.tap();
        if (b.dataset.c != null) { var k = +b.dataset.c; alt = alt === k ? -1 : k; chips(); return; }
        if (b.dataset.d != null) {
          if (b.dataset.d === "del") { var gi = groups[alt].s; strokes = strokes.filter(function (s, i) { return gi.indexOf(i) < 0; }); alt = -1; recog(); return; }
          var d = +b.dataset.d, key = groups[alt].s.join(","); over[key] = d;
          if (d !== res[alt].d) addSample(d, res[alt].emb);
          alt = -1; chips(); return;
        }
        var n = b.dataset.n;
        if (n === "x") { close(); return; }
        if (n === "undo") { strokes.pop(); recog(); return; }
        if (n === "clear") { strokes = []; over = {}; alt = -1; recog(); return; }
        if (n === "draft") { close(); o.onDraft && o.onDraft(); return; }
        if (n === "ok" && groups.length) {
          /* chữ số máy đọc chắc chắn → lưu nhẹ để học thêm chữ của bé */
          res.forEach(function (r, k) { if (over[groups[k].s.join(",")] == null && r.conf > 0.97 && Math.random() < 0.25) addSample(r.d, r.emb); });
          var v = value(); close(); o.onDone && o.onDone(v);
        }
      });
      window.addEventListener("resize", size);
      size();
      InkNum.cur = { close: close, strokes: function () { return strokes; }, recog: recog };
    },
    classify: classify, raster: raster, run: run, segment: segment, mine: mine, addSample: addSample,
    clearMine: function () { saveMine([]); }
  };
  window.InkNum = InkNum;
  /* ---------- 6. nối vào bài luyện tập ---------- */
  function target() {
    var q = G.curQ(), s = q.st, pi = s.act || 0;
    var p = q.parts[pi];
    if (!p || p.kind === "choice") { pi = q.parts.findIndex(function (x) { return x.kind !== "choice"; }); p = q.parts[pi]; }
    if (!p) return null;
    var v = s.vals[pi];
    return { q: q, s: s, pi: pi, p: p, v: v, label: LT("Điền vào: " + (p.lab || "ô đáp án") + (p.kind === "frac" ? (v.f === "d" ? " – mẫu số" : " – tử số") : ""), "Fill in: " + (p.lab || "answer box") + (p.kind === "frac" ? (v.f === "d" ? " – denominator" : " – numerator") : "")) };
  }
  ACT.inknum = function () {
    var t = target(); if (!t) { G.toast(LT("Câu này chọn đáp án, không cần viết số", "This one is multiple choice, so there's no need to write a number")); return; }
    if (t.s.done) return;
    InkNum.open({
      label: t.label, q: G.rich(t.q.q),
      onDone: function (val) {
        var tt = target(); if (!tt) return;
        if (tt.p.kind === "frac") { var f = tt.v.f === "d" ? "d" : "n"; tt.v[f] = val; if (f === "n") tt.v.f = "d"; }
        else {
          tt.v.v = val;
          var nx = tt.q.parts.findIndex(function (p, i) { return i > tt.pi && p.kind !== "choice" && !(tt.s.vals[i].v || tt.s.vals[i].n); });
          nx >= 0 && (tt.s.act = nx);
        }
        G.ansRender();
      },
      onDraft: function () { ACT.ink && ACT.ink(); }
    });
  };
  /* ---------- 7. Dạy máy chữ của con (phụ huynh mở cho bé) ---------- */
  SC.inktrain = function (p) {
    var k = (p && p.k) || 0, round = Math.floor(k / 10) + 1, d = k % 10, n = mine().length;
    app.innerHTML = G.topbar(LT("Dạy máy chữ của con", "Teach the machine your handwriting"), LT("Viết số", "Write Number"), { back: !0 }) + LT('<main><section class="card flat" style="text-align:center"><p style="margin:0 0 6px">Con viết chữ số <b>giống như con vẫn viết</b> vào ô bên dưới. Máy sẽ nhớ nét chữ của con để đọc đúng hơn.</p>', '<main><section class="card flat" style="text-align:center"><p style="margin:0 0 6px">Write each digit <b>just the way you usually write it</b> in the box below. The machine will remember your handwriting so it can read it better.</p>') +
      LT('<div class="itd">Viết số <b>' + d + '</b></div><div class="muted">Lượt ' + round + "/3 · chữ số " + (d + 1) + "/10 · máy đã nhớ " + n + ' mẫu</div><div class="itpad"><canvas width="240" height="240"></canvas></div>', '<div class="itd">Write the number <b>' + d + '</b></div><div class="muted">Round ' + round + "/3 · digit " + (d + 1) + "/10 · the machine has remembered " + n + (n === 1 ? ' sample' : ' samples') + '</div><div class="itpad"><canvas width="240" height="240"></canvas></div>') +
      LT('<div class="row" style="justify-content:center;gap:8px"><button class="btn sm" id="itc">🗑 Viết lại</button><button class="btn pri" id="its">Lưu ▶</button></div>', '<div class="row" style="justify-content:center;gap:8px"><button class="btn sm" id="itc">🗑 Write again</button><button class="btn pri" id="its">Save ▶</button></div>') +
      '<p class="muted" style="margin-top:10px;font-size:.9rem">' + (k >= 30 ? LT("🎉 Xong 3 lượt! Con có thể dạy thêm hoặc quay lại học.", "🎉 All 3 rounds done! You can teach it more or go back to learning.") : "") + LT('</p><button class="btn sm" id="itx" style="margin-top:6px">Xoá hết chữ máy đã học</button></section></main>', '</p><button class="btn sm" id="itx" style="margin-top:6px">Erase everything the machine learned</button></section></main>');
    var cv = app.querySelector(".itpad canvas"), ctx = cv.getContext("2d"), strokes = [], cur = null;
    var r2 = function () { ctx.clearRect(0, 0, 240, 240); ctx.strokeStyle = "#1F2A44"; ctx.lineWidth = 9; ctx.lineCap = ctx.lineJoin = "round"; strokes.forEach(function (s) { ctx.beginPath(); s.forEach(function (q, i) { i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); }); ctx.stroke(); }); };
    var pt = function (e) { var r = cv.getBoundingClientRect(); return [(e.clientX - r.left) * 240 / r.width, (e.clientY - r.top) * 240 / r.height]; };
    cv.addEventListener("pointerdown", function (e) { try { cv.setPointerCapture(e.pointerId); } catch (x) {} cur = [pt(e)]; strokes.push(cur); r2(); e.preventDefault(); });
    cv.addEventListener("pointermove", function (e) { if (cur) { cur.push(pt(e)); r2(); } });
    cv.addEventListener("pointerup", function () { cur = null; });
    app.querySelector("#itc").onclick = function () { strokes = []; r2(); };
    app.querySelector("#its").onclick = function () {
      if (!strokes.length) { G.toast(LT("Con viết số " + d + " vào ô nhé", "Write the number " + d + " in the box")); return; }
      var r = classify(strokes); addSample(d, r.emb); G.Sfx.ok && G.Sfx.ok();
      G.replace("inktrain", { k: k + 1 });
    };
    app.querySelector("#itx").onclick = function () { G.ask(LT("Xoá hết mẫu chữ máy đã học?", "Erase all the handwriting samples the machine learned?"), function () { InkNum.clearMine(); G.replace("inktrain", { k: 0 }); }, LT("Xoá", "Erase"), LT("Thôi", "Never mind")); };
  };
  ACT.inktrain = function () { G.Sfx.tap(); G.go("inktrain", { k: 0 }); };
  var os = SC.settings;
  SC.settings = function (p) {
    os(p);
    var main = app.querySelector("main"); if (!main) return;
    var sec = document.createElement("section"); sec.className = "card flat";
    sec.innerHTML = LT('<h2 class="disp" style="font-size:1.2rem;margin-bottom:8px">✍️ Viết số bằng tay</h2><p class="muted" style="margin:0 0 8px;font-size:.92rem">Trong bài luyện tập, bấm <b>🔢 Viết số</b> để viết đáp án, máy đọc rồi điền vào ô. Máy đang nhớ <b>' + mine().length + "</b> mẫu chữ của bé.</p>", '<h2 class="disp" style="font-size:1.2rem;margin-bottom:8px">✍️ Write numbers by hand</h2><p class="muted" style="margin:0 0 8px;font-size:.92rem">During practice, tap <b>🔢 Write Number</b> to write your answer. The machine reads it and fills in the box. It has remembered <b>' + mine().length + "</b> of your handwriting samples.</p>") +
      LT('<button class="btn sm block" data-act="inktrain">✍️ Dạy máy chữ của con (10 chữ số × 3 lượt)</button>', '<button class="btn sm block" data-act="inktrain">✍️ Teach the machine your handwriting (10 digits × 3 rounds)</button>');
    main.insertBefore(sec, main.children[3] || null);
  };
})();