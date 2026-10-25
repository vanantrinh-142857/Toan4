//# Đồng hồ làm bài (bảng du-lieu/thoi-gian.js), thống kê thời gian
//# Tự chứa trong một hàm bọc — chạy độc lập, không cần build.


/* ===== Toán 4 Phiêu Lưu – đồng hồ làm bài (bảng du-lieu/thoi-gian.js) ===== */
(function () {
  var G = globalThis, Store = G.Store, UI = G.UI, SC = G.SC;
  var TT = {}, EXAM_MIN = 40;
  String(window.BANG_THOI_GIAN || "").split(/\r?\n/).forEach(function (l) {
    l = l.trim(); if (!l || l.charAt(0) === "#" || l.indexOf("|") < 0) return;
    var c = l.split("|").map(function (x) { return x.trim(); });
    if (c[0] === "thi-tong") { EXAM_MIN = +c[1] || 40; return; }
    TT[c[0]] = [+c[1] || 60, +c[2] || +c[1] || 60, +c[3] || +c[2] || 90];
  });
  var DEF = { so: [60, 90, 150], toan: [120, 150, 200], ps: [90, 120, 160], hinh: [60, 90, 130] };
  function secOf(lid, tier) {
    var l = G.byId(lid), t = TT[lid] || (l && DEF[l.reg]) || [60, 90, 120];
    return t[Math.max(0, Math.min(2, (tier || 1) - 1))];
  }
  function budget(P) {
    if (P.cfg.limit) return P.cfg.limit;
    return P.qs.filter(function (q) { return !q.bonus; }).reduce(function (a, q) { return a + secOf(q.lesson || P.l.id, q.tier || P.t || 1); }, 0);
  }
  var mode = function () { return (Store.d.set && Store.d.set.timer) || "soft"; };
  var fmtT = function (s) { s = Math.max(0, Math.round(s)); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); };
  function tm(P) {
    if (!P._tm) P._tm = { t0: Date.now(), used: 0, last: Date.now(), budget: budget(P), paused: false, qi: -1, qt: Date.now(), done: false };
    return P._tm;
  }
  function onPrac() { var s = UI.stack[UI.stack.length - 1]; return s && s.n === "prac" && UI.prac; }
  function tick() {
    var P = UI.prac, now = Date.now();
    if (!onPrac()) { if (P && P._tm) P._tm.last = now; var old = document.getElementById("tmr"); old && old.remove(); return; }
    var T = tm(P);
    if (T.done) return;
    if (!T.paused && !document.hidden) T.used += now - T.last;
    T.last = now;
    /* thời gian từng câu */
    if (T.qi !== P.i) { var pq = P.qs[T.qi]; pq && (pq._ms = (pq._ms || 0) + (now - T.qt)); T.qi = P.i; T.qt = now; }
    var exam = !!P.cfg.exam, M = exam ? "hard" : mode();
    var top = document.querySelector(".top");
    var el = document.getElementById("tmr");
    if (M === "off") { el && el.remove(); return; }
    if (!el && top) {
      el = document.createElement("button");
      el.id = "tmr"; el.className = "tmr"; el.setAttribute("aria-label", LT("Đồng hồ – chạm để tạm dừng", "Timer – tap to pause"));
      el.onclick = function () { if (exam) return; T.paused = !T.paused; pauseOverlay(T); };
      var sq = top.querySelector('[data-act=sayq]'); sq ? top.insertBefore(el, sq) : top.appendChild(el);
    }
    if (!el) return;
    var left = T.budget - T.used / 1000, frac = Math.max(0, left) / T.budget;
    el.className = "tmr" + (left <= 0 ? " over" : frac < .1 ? " red" : frac < .3 ? " yel" : "");
    el.innerHTML = '<svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="15" class="bg"/><circle cx="18" cy="18" r="15" class="fg" style="stroke-dasharray:' + (94.2 * frac).toFixed(1) + ' 94.2"/></svg><b>' + (left >= 0 ? fmtT(left) : "+" + fmtT(-left)) + "</b>";
    if (left <= 0 && M === "hard" && !T.done) {
      T.done = true;
      G.toast(exam ? LT("Hết giờ! Bài thi được nộp.", "Time's up! Your exam has been submitted.") : LT("Hết giờ rồi! Mình xem kết quả nhé.", "Time's up! Let's look at the results."));
      P.qs.forEach(function (q) { if (!q.bonus && q.w == null) q.w = 0; });
      setTimeout(function () { G.finishPrac(); }, 600);
    }
  }
  function pauseOverlay(T) {
    var o = document.getElementById("tmrp");
    if (!T.paused) { o && o.remove(); return; }
    o = document.createElement("div"); o.id = "tmrp"; o.className = "tmrp";
    o.innerHTML = '<div><div style="font-size:3rem">⏸</div><h2 class="disp">' + LT('Tạm dừng', 'Paused') + '</h2><p>' + LT('Đồng hồ đang dừng. Chạm để làm tiếp nhé!', 'The timer is stopped. Tap to keep going!') + '</p></div>';
    o.onclick = function () { T.paused = false; o.remove(); };
    document.body.appendChild(o);
  }
  setInterval(tick, 250);
  document.addEventListener("visibilitychange", function () { var P = UI.prac; P && P._tm && (P._tm.last = Date.now()); });
  /* kết quả: thời gian + ⚡ + thống kê */
  function record(P) {
    var T = P._tm; if (!T || T.rec) return; T.rec = 1; T.done = true;
    var pq = P.qs[T.qi]; pq && (pq._ms = (pq._ms || 0) + (Date.now() - T.qt));
    P.qs.forEach(function (q) {
      if (q.bonus || !q.lesson || !q._ms || !G.byId(q.lesson)) return;
      var L = Store.lesson(q.lesson); L.tm = L.tm || [0, 0]; L.tm[0] += Math.min(q._ms / 1000, 900); L.tm[1]++;
    });
    Store.save();
  }
  var origRes = SC.result;
  SC.result = function (r) {
    origRes(r);
    var P = UI.prac; if (!P || !P._tm) return;
    record(P);
    var T = P._tm, used = T.used / 1000, fast = used <= T.budget && r.pass && mode() !== "off";
    if (fast && !T.fastSaved) { T.fastSaved = 1; Store.d.fast = (Store.d.fast || 0) + 1; Store.save(); }
    var card = app.querySelector(".resc");
    if (!card || mode() === "off") return;
    var d = document.createElement("div");
    d.className = "tmres" + (fast ? " ok" : "");
    d.innerHTML = LT("⏱ Thời gian: <b>" + fmtT(used) + "</b> / " + fmtT(T.budget) + (fast ? ' · <span class="zap">⚡ Nhanh như chớp!</span>' : used > T.budget ? " · lần sau nhanh hơn chút nhé" : ""), "⏱ Time: <b>" + fmtT(used) + "</b> / " + fmtT(T.budget) + (fast ? ' · <span class="zap">⚡ Lightning fast!</span>' : used > T.budget ? " · a little faster next time!" : ""));
    card.appendChild(d);
  };
  G.TIMER = { secOf: secOf, examMin: function () { return EXAM_MIN; }, record: record, fmt: fmtT, budget: budget };
  /* Thống kê thời gian trong Thành tích */
  var origStats = SC.stats;
  SC.stats = function (p) {
    origStats(p);
    var main = app.querySelector("main"); if (!main) return;
    var rows = G.LESSONS.map(function (l) { var t = Store.lesson(l.id).tm; return t && t[1] ? [l, t[0] / t[1], t[1]] : null; }).filter(Boolean);
    var sec = document.createElement("section"); sec.className = "card flat";
    sec.innerHTML = LT('<h2 class="disp" style="font-size:1.2rem;margin-bottom:6px">⏱ Thời gian trung bình mỗi câu</h2>', '<h2 class="disp" style="font-size:1.2rem;margin-bottom:6px">⏱ Average time per question</h2>') + (Store.d.fast ? LT('<div class="muted" style="margin-bottom:6px">⚡ Nhanh như chớp: <b>' + Store.d.fast + "</b> lần</div>", '<div class="muted" style="margin-bottom:6px">⚡ Lightning fast: <b>' + Store.d.fast + "</b> " + (Store.d.fast === 1 ? "time" : "times") + "</div>") : "") +
      (rows.length ? '<div class="tmlist">' + rows.map(function (x) { var g = secOf(x[0].id, 1); return "<div><span>" + G.esc(x[0].title) + '</span><b class="' + (x[1] <= g ? "ok" : "") + '">' + fmtT(x[1]) + LT("</b><small>" + x[2] + " câu</small></div>", "</b><small>" + x[2] + (x[2] === 1 ? " question" : " questions") + "</small></div>"); }).join("") + "</div>" : LT('<div class="muted">Làm bài luyện tập để xem thời gian ở đây nhé.</div>', '<div class="muted">Do some practice to see your times here.</div>'));
    main.appendChild(sec);
  };
  /* nút chọn chế độ đồng hồ trong Cài đặt */
  var origSet = SC.settings;
  SC.settings = function (p) {
    origSet(p);
    var main = app.querySelector("main"); if (!main) return;
    var M = mode(), L = { soft: LT("Mềm – hết giờ vẫn làm tiếp", "Soft – keep going after time's up"), hard: LT("Cứng – hết giờ tự nộp bài", "Hard – auto-submit when time's up"), off: LT("Tắt", "Off") };
    var sec = document.createElement("section"); sec.className = "card flat";
    sec.innerHTML = LT('<h2 class="disp" style="font-size:1.2rem;margin-bottom:8px">⏱ Đồng hồ khi luyện tập</h2><div class="parts">', '<h2 class="disp" style="font-size:1.2rem;margin-bottom:8px">⏱ Timer during practice</h2><div class="parts">') + ["soft", "hard", "off"].map(function (k) {
      return '<button class="btn sm block' + (k === M ? " pri" : "") + '" data-act="tmrmode" data-m="' + k + '">' + (k === M ? "✓ " : "") + L[k] + "</button>"; }).join("") +
      LT('</div><p class="muted" style="font-size:.9rem;margin:8px 0 0">Phòng thi luôn tính giờ.</p>', '</div><p class="muted" style="font-size:.9rem;margin:8px 0 0">Exam rooms are always timed.</p>');
    main.insertBefore(sec, main.children[2] || null);
  };
  G.ACT.tmrmode = function (el) { Store.d.set.timer = el.dataset.m; Store.save(); G.Sfx.tap(); G.replace("settings"); };
})();