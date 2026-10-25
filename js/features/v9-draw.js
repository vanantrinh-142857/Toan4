//# features/v9-draw.js — v9: KÉO VẼ SƠ ĐỒ ĐOẠN THẲNG (tổng – hiệu) và HỌC BẰNG TAY (tô hình phân số) =====
//# Tự chứa trong một hàm bọc — chạy độc lập, không cần build.
/* 1. Nút "📐 Vẽ sơ đồ": trước các câu hỏi dựng sơ đồ (lõi, Work.bars), bé tự KÉO đầu đoạn số lớn cho dài hơn đoạn số bé
      đúng một khúc bằng hiệu — như kẻ trong vở. Thả gần đúng thì tự khớp.
   2. Bài Phân số: chặng Học có thêm "✋ Học bằng tay": chạm tô các phần của thanh/bánh, phân số tự hiện; rồi đọc phân số từ hình.
   3. Bài Phân số mức Dễ: một nửa số câu có hình (viết phân số chỉ phần đã tô) — đi từ hình vẽ tới kí hiệu. */
(function () {
  "use strict";
  var G = window, T = G.T4.T, Store = G.Store, X = G.T4.v9, esc = X.esc;
  var PEN = "#1E3A8A", ORG = "#E8590C", RED = "#D6336C";
  function paper(w, h) {
    var s = '<rect x="0" y="0" width="' + w + '" height="' + h + '" rx="10" fill="#FFFEF6"/>', y, x;
    for (y = 9; y < h; y += 9) s += '<line x1="0" y1="' + y + '" x2="' + w + '" y2="' + y + '" stroke="' + (y % 36 ? "#E6EEF9" : "#C9D9F0") + '" stroke-width="1"/>';
    for (x = 36; x < w; x += 36) s += '<line x1="' + x + '" y1="0" x2="' + x + '" y2="' + h + '" stroke="#E6EEF9" stroke-width="1"/>';
    return s;
  }
  function chips(cur) {
    return '<div class="v9-chips">' + [T("1 Số bé", "1 Smaller"), T("2 Số lớn", "2 Larger"), T("3 Ngoặc tổng", "3 Sum brace"), T("4 Bớt phần hơn", "4 Take away")].map(function (t, i) {
      return '<span class="' + (i < cur ? "ok" : i === cur ? "on" : "") + '">' + (i < cur ? "✓ " : "") + t + "</span>";
    }).join("") + "</div>";
  }
  /* ---------- 1. kéo vẽ đoạn số lớn ---------- */
  function dragStep(q, next) {
    var w = q.work, S = w.S, D = w.D, b = w.b, labs = (w.labs || [T("Lớn", "Larger"), T("Bé", "Smaller")]).map(function (l) { return G.LANG === "en" ? l : l === "Lớn" ? "Số lớn" : l === "Bé" ? "Số bé" : l; });
    var x0 = G.LANG === "en" ? 100 : 92, L = 200, ws = L * b / (b + D), unit = ws / b, tgt = L * D / (b + D), maxE = 352 - (x0 + ws) - 6, ext = Math.min(maxE, Math.max(10, tgt * 0.35)), val = 0, done = false;
    var yL = 62, yB = 122;
    function svg() {
      var xe = x0 + ws, xd = xe + ext, c = done ? ORG : ORG, s = '<svg viewBox="0 0 360 170" class="v9-dragsvg" style="touch-action:none">' + paper(360, 170);
      s += '<text x="' + (x0 - 10) + '" y="' + (yB + 6) + '" font-size="17" text-anchor="end" fill="' + PEN + '" font-weight="700">' + esc(labs[1]) + ':</text>';
      s += '<line x1="' + x0 + '" y1="' + yB + '" x2="' + xe + '" y2="' + yB + '" stroke="' + PEN + '" stroke-width="2.8" stroke-linecap="round"/>';
      s += '<line x1="' + x0 + '" y1="' + (yB - 8) + '" x2="' + x0 + '" y2="' + (yB + 8) + '" stroke="' + PEN + '" stroke-width="2.6"/><line x1="' + xe + '" y1="' + (yB - 8) + '" x2="' + xe + '" y2="' + (yB + 8) + '" stroke="' + PEN + '" stroke-width="2.6"/>';
      s += '<text x="' + (x0 - 10) + '" y="' + (yL + 6) + '" font-size="17" text-anchor="end" fill="' + PEN + '" font-weight="700">' + esc(labs[0]) + ':</text>';
      s += '<line x1="' + x0 + '" y1="' + yL + '" x2="' + xe + '" y2="' + yL + '" stroke="' + PEN + '" stroke-width="2.8" stroke-linecap="round"/>';
      s += '<line x1="' + x0 + '" y1="' + (yL - 8) + '" x2="' + x0 + '" y2="' + (yL + 8) + '" stroke="' + PEN + '" stroke-width="2.6"/><line x1="' + xe + '" y1="' + (yL - 8) + '" x2="' + xe + '" y2="' + (yL + 8) + '" stroke="' + PEN + '" stroke-width="2.6"/>';
      s += '<line x1="' + xe + '" y1="' + (yL + 9) + '" x2="' + xe + '" y2="' + (yB - 9) + '" stroke="' + PEN + '" stroke-width="1.6" stroke-dasharray="4 4"/>';
      s += '<line x1="' + xe + '" y1="' + yL + '" x2="' + xd + '" y2="' + yL + '" stroke="' + c + '" stroke-width="3.4" stroke-linecap="round"/>';
      if (done) s += '<line x1="' + xd + '" y1="' + (yL - 8) + '" x2="' + xd + '" y2="' + (yL + 8) + '" stroke="' + ORG + '" stroke-width="2.6"/>';
      s += '<text x="' + ((xe + xd) / 2) + '" y="' + (yL + 30) + '" font-size="17" text-anchor="middle" fill="' + ORG + '" font-weight="800">' + (val > 0 ? "+" + val : "") + (done ? " ✓" : "") + "</text>";
      if (!done) s += '<circle data-h="1" cx="' + xd + '" cy="' + yL + '" r="13" fill="#FFD23F" stroke="' + PEN + '" stroke-width="2.5"/><text x="' + (xd + 18) + '" y="' + (yL - 14) + '" font-size="14" fill="' + ORG + '" font-weight="800">' + T("kéo →", "drag →") + "</text>";
      return s + "</svg>";
    }
    G.sheet('<div class="v9-drag"><h2 class="disp">📐 ' + T("Vẽ sơ đồ đoạn thẳng", "Draw the line diagram") + '</h2><div class="q v9-q">' + G.rich(q.q) + "</div>" + chips(1) +
      '<div class="v9-figbox" data-r="f"></div><div class="v9-fbx"><img src="' + X.mimg("think") + '" alt=""><div data-r="m"></div></div>' +
      '<button class="btn pri block" data-k="ok" disabled>' + T("Xong bước này ▶", "Done with this step ▶") + '</button><button class="btn block" data-k="skip" style="margin-top:8px">' + T("Bỏ qua bước kéo", "Skip dragging") + "</button></div>",
      function (bg, close) {
        var f = bg.querySelector("[data-r=f]"), m = bg.querySelector("[data-r=m]"), ok = bg.querySelector("[data-k=ok]"), drag = false;
        function msg() {
          m.innerHTML = done ? T("Đúng rồi! Đoạn số lớn dài hơn đoạn số bé đúng một khúc <b>" + D + "</b> — đó là <b>hiệu</b>.", "Yes! The larger segment is longer by exactly <b>" + D + "</b> — the <b>difference</b>.") :
            T("Con <b>kéo chấm vàng</b> sang phải cho đoạn số lớn dài hơn đoạn số bé một khúc <b>bằng hiệu (" + D + ")</b>.", "<b>Drag the yellow dot</b> so the larger segment is longer by <b>the difference (" + D + ")</b>.");
        }
        function draw() { f.innerHTML = svg(); msg(); ok.disabled = !done; }
        function toX(e) { var s = f.querySelector("svg"), p = s.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; return p.matrixTransform(s.getScreenCTM().inverse()).x; }
        function move(e) {
          if (!drag || done) return;
          ext = Math.max(4, Math.min(maxE, toX(e) - (x0 + ws))); val = Math.max(1, Math.round(ext / unit));
          if (Math.abs(val - D) <= Math.max(1, Math.round(D * 0.12))) { ext = tgt; val = D; done = true; drag = false; G.Sfx.ok && G.Sfx.ok(); }
          draw();
        }
        f.addEventListener("pointerdown", function (e) { if (done) return; drag = true; try { f.setPointerCapture(e.pointerId); } catch (x) { } move(e); });
        f.addEventListener("pointermove", move);
        f.addEventListener("pointerup", function () { drag = false; });
        bg.querySelector("[data-k=ok]").onclick = function () { close(); next(); };
        bg.querySelector("[data-k=skip]").onclick = function () { close(); next(); };
        draw();
      });
  }
  var oldBars = G.Work.bars;
  G.Work.bars = function (q, done) {
    var self = this, args = arguments;
    if (!q || !q.work || q.work.S == null || q.work.D == null || q.work.b == null) return oldBars.apply(self, args);
    dragStep(q, function () { oldBars.apply(self, args); });
  };

  /* ---------- 2. Học bằng tay: tô hình phân số ---------- */
  function shapeSvg(shape, n, shaded, live) {
    var s = '<svg viewBox="0 0 360 170" class="v9-shape">', i;
    if (shape === "pie") {
      var cx = 180, cy = 85, r = 72;
      for (i = 0; i < n; i++) {
        var a0 = -Math.PI / 2 + i * 2 * Math.PI / n, a1 = a0 + 2 * Math.PI / n;
        var d = "M" + cx + " " + cy + " L" + (cx + r * Math.cos(a0)).toFixed(1) + " " + (cy + r * Math.sin(a0)).toFixed(1) + " A" + r + " " + r + " 0 0 1 " + (cx + r * Math.cos(a1)).toFixed(1) + " " + (cy + r * Math.sin(a1)).toFixed(1) + " Z";
        s += '<path ' + (live ? 'data-part="' + i + '" ' : "") + 'd="' + d + '" fill="' + (shaded[i] ? "#FF8A3D" : "#fff") + '" stroke="#1F2A44" stroke-width="3" stroke-linejoin="round"/>';
      }
    } else {
      var W = 300, x0 = 30, w = W / n;
      for (i = 0; i < n; i++) s += '<rect ' + (live ? 'data-part="' + i + '" ' : "") + 'x="' + (x0 + i * w).toFixed(1) + '" y="45" width="' + w.toFixed(1) + '" height="80" fill="' + (shaded[i] ? "#FF8A3D" : "#fff") + '" stroke="#1F2A44" stroke-width="3"/>';
    }
    return s + "</svg>";
  }
  function fracHtml(a, b, ca) { return '<span class="v9-fr"><i' + (ca ? ' style="color:' + RED + '"' : "") + ">" + a + "</i><i>" + b + "</i></span>"; }
  var TASKS = [{ sh: "bar", n: 5, k: 3 }, { sh: "bar", n: 5, k: 2 }, { sh: "pie", n: 4, k: 1 }, { sh: "bar", n: 8, k: 3 }, { sh: "pie", n: 6, k: 5, rev: 1 }, { sh: "bar", n: 3, k: 2, rev: 1 }];
  function hands() {
    var ti = 0, shaded = [], picked = -1;
    G.Sfx.tap && G.Sfx.tap();
    G.sheet('<div class="v9-hands"><div class="v9-chips"><span class="ok">✋ ' + T("Đồ vật", "Objects") + '</span><span class="on">🖼️ ' + T("Hình vẽ", "Pictures") + "</span><span>🔢 " + T("Kí hiệu", "Symbols") + '</span></div><div data-r="b"></div><button class="btn block" data-k="x" style="margin-top:8px">' + T("Đóng", "Close") + "</button></div>",
      function (bg, close) {
        var box = bg.querySelector("[data-r=b]");
        bg.querySelector("[data-k=x]").onclick = close;
        function draw(msg, mc) {
          var t = TASKS[ti], cnt = shaded.filter(Boolean).length, h = '<div class="v9-prog">' + T("Thử thách ", "Task ") + (ti + 1) + "/" + TASKS.length + "</div>";
          if (!t.rev) {
            h += '<div class="v9-fbx"><img src="' + X.mimg("teach") + '" alt=""><div>' + T((t.sh === "pie" ? "Cái bánh" : "Thanh sô-cô-la") + " chia <b>" + t.n + " phần bằng nhau</b>. Con <b>chạm để tô " + t.k + " phần</b>.", "The " + (t.sh === "pie" ? "cake" : "chocolate bar") + " has <b>" + t.n + " equal parts</b>. <b>Tap to shade " + t.k + "</b>.") + "</div></div>";
            h += '<div class="v9-figbox live">' + shapeSvg(t.sh, t.n, shaded, true) + "</div>";
            h += '<div class="v9-live">' + T("Con đã tô: ", "Shaded: ") + fracHtml(cnt, t.n, true) + '<small>' + T("tử số = số phần đã tô · mẫu số = số phần bằng nhau", "numerator = shaded parts · denominator = equal parts") + "</small></div>";
            h += '<div class="v9-msg ' + (mc || "") + '">' + (msg || "") + '</div><div class="row"><button class="btn grow" data-k="clr">↺ ' + T("Xoá tô", "Clear") + '</button><button class="btn pri grow" data-k="chk">' + T("Kiểm tra", "Check") + "</button></div>";
          } else {
            var full = []; for (var i = 0; i < t.n; i++) full.push(i < t.k);
            var opts = [[t.k, t.n], [t.n - t.k, t.n], [t.n, t.k]];
            h += '<div class="v9-fbx"><img src="' + X.mimg("think") + '" alt=""><div>' + T("Bây giờ ngược lại: phần <b>đã tô</b> là phân số nào?", "Now the other way: which fraction is <b>shaded</b>?") + "</div></div>";
            h += '<div class="v9-figbox">' + shapeSvg(t.sh, t.n, full, false) + '</div><div class="v9-opts">' + opts.map(function (o, j) { return '<button data-o="' + j + '" class="' + (picked === j ? (j === 0 ? "ok" : "no") : "") + '">' + fracHtml(o[0], o[1]) + "</button>"; }).join("") + "</div>";
            h += '<div class="v9-msg ' + (mc || "") + '">' + (msg || "") + "</div>";
          }
          box.innerHTML = h;
        }
        function nextTask() {
          ti++; shaded = []; picked = -1;
          if (ti >= TASKS.length) {
            var s = Store.lesson("frac"); s.hands = 1; Store.save();
            box.innerHTML = '<div class="v9-fbx"><img src="' + X.mimg("cheer") + '" alt=""><div><b>' + T("Tuyệt vời! Con đã hiểu phân số bằng tay rồi.", "Brilliant! You understand fractions with your hands now.") + "</b><br>" + T("Giờ mình sang kí hiệu: viết phân số nhé.", "Now on to symbols: writing fractions.") + '</div></div><button class="btn pri block" data-k="go">' + T("Học tiếp ▶", "Continue ▶") + "</button>";
            box.querySelector("[data-k=go]").onclick = function () { close(); };
            return;
          }
          draw();
        }
        box.addEventListener("click", function (e) {
          var t = TASKS[ti]; if (!t) return;
          var p = e.target.closest("[data-part]"), b = e.target.closest("button");
          if (p) { var i = +p.getAttribute("data-part"); shaded[i] = !shaded[i]; G.Sfx.pop && G.Sfx.pop(); draw(); return; }
          if (!b) return;
          if (b.dataset.k === "clr") { shaded = []; draw(); }
          else if (b.dataset.k === "chk") {
            var cnt = shaded.filter(Boolean).length;
            if (cnt === t.k) { G.Sfx.ok && G.Sfx.ok(); draw("✓ " + T("Đúng! Tô " + t.k + " trong " + t.n + " phần là ", "Right! " + t.k + " of " + t.n + " parts is ") + fracHtml(t.k, t.n), "ok"); setTimeout(nextTask, 1500); }
            else { G.Sfx.bad && G.Sfx.bad(); draw(cnt < t.k ? T("Con tô thêm " + (t.k - cnt) + " phần nữa nhé.", "Shade " + (t.k - cnt) + " more.") : T("Nhiều quá rồi, bỏ bớt " + (cnt - t.k) + " phần nhé.", "Too many — unshade " + (cnt - t.k) + "."), "no"); }
          } else if (b.dataset.o != null && picked !== 0) {
            picked = +b.dataset.o;
            if (picked === 0) { G.Sfx.ok && G.Sfx.ok(); draw("✓ " + T("Đúng! Mẫu số " + t.n + " là số phần bằng nhau, tử số " + t.k + " là số phần đã tô.", "Right! Denominator " + t.n + " = equal parts, numerator " + t.k + " = shaded parts."), "ok"); setTimeout(nextTask, 1800); }
            else { G.Sfx.bad && G.Sfx.bad(); draw(picked === 1 ? T("Đó là phần CHƯA tô. Con đếm phần đã tô nhé.", "That's the UNshaded part. Count the shaded parts.") : T("Con đổi chỗ tử số và mẫu số rồi. Mẫu số là số phần bằng nhau.", "You swapped them. The denominator is the number of equal parts."), "no"); }
          }
        });
        draw();
      });
  }
  document.addEventListener("click", function (e) { var b = e.target.closest && e.target.closest("[data-v9h]"); if (!b) return; e.preventDefault(); e.stopPropagation(); hands(); }, true);
  var prevLesson = G.SC.lesson;
  G.SC.lesson = function (p) {
    var r = prevLesson.apply(this, arguments);
    try {
      var body = document.querySelector(".stage .stage-b"), th = body && body.querySelector("[data-act=theory]");
      if (p && p.id === "frac" && th && !body.querySelector("[data-v9h]")) {
        th.insertAdjacentHTML("afterend", '<button class="stp" data-v9h="1"><span class="n" style="background:var(--o-soft)">' + (Store.lesson("frac").hands ? "✓" : "✋") + '</span><span class="grow"><b>' + T("Học bằng tay: tô hình", "Hands-on: shade the shapes") + "</b><small>" + T("Chạm tô thanh, bánh — phân số tự hiện ra", "Tap to shade — the fraction appears") + '</small></span><span class="chev">▶</span></button>');
      }
    } catch (e) { }
    return r;
  };

  /* ---------- 3. Phân số mức Dễ: câu có hình ---------- */
  var lf = G.byId && G.byId("frac");
  if (lf) {
    var og = lf.gen;
    lf.gen = function (t, r) {
      if (t !== 1 || r.int(0, 9) >= 5) return og.apply(this, arguments);
      var sh = r.pick(["bar", "pie"]), n = r.pick([3, 4, 5, 6, 8]), k = r.int(1, n - 1), sd = [], i;
      for (i = 0; i < n; i++) sd.push(i < k);
      if (sh === "bar") sd = r.shuffle(sd);
      var svg = shapeSvg(sh, n, sd, false);
      return {
        q: T("Viết phân số chỉ phần **đã tô màu** của hình.", "Write the fraction for the **shaded** part of the shape."),
        parts: [{ lab: "", ans: [k, n], kind: "frac", exact: true }],
        steps: [{ t: T("Hình được chia thành " + n + " phần bằng nhau, nên mẫu số là " + n, "The shape has " + n + " equal parts, so the denominator is " + n), v: n },
                { t: T("Đã tô màu " + k + " phần, nên tử số là " + k, k + " parts are shaded, so the numerator is " + k), v: k }],
        tip: T("Mẫu số: hình chia mấy phần bằng nhau. Tử số: đã tô mấy phần.", "Denominator: how many equal parts. Numerator: how many are shaded."),
        fig: { fb: { raw: true, vb: [360, 170], frames: [function () { return svg; }] }, f: 0 }
      };
    };
  }
})();
