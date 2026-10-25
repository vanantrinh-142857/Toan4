//# features/v9-memory.js — v9: HỘP NHỚ (ôn giãn cách), KHỞI ĐỘNG, KẾ HOẠCH HÔM NAY, CHÀO MỪNG TRỞ LẠI, NHẬT KÝ HỌC =====
//# Tự chứa trong một hàm bọc — chạy độc lập, không cần build.
/* Dữ liệu riêng của v9 nằm trong Store.d.v9 (mỗi hồ sơ một bản):
     mem   { mãBài: {box 1..5, due "YYYY-MM-DD"} }   – hộp nhớ; ôn lại sau 1 · 3 · 7 · 14 · 30 ngày
     log   { ngày: {q, ok1, hint, ms, sets, err{loại:n}, mist{bài:n}} } – nhật ký cho Báo cáo tuần
     plan  { date, tell }  – bước "Kể lại cho bố mẹ" của Kế hoạch hôm nay
     seen  ngày mở app gần nhất · lastStudy ngày học gần nhất · why {n} huy hiệu Hiểu bài · notify {…} cài đặt nhắc học
   Đúng ngay (không gợi ý) → lên hộp; đúng nhờ gợi ý → giữ hộp, hỏi lại ngày mai; sai → về Hộp 1. */
(function () {
  "use strict";
  var G = window, T = G.T4.T, Store = G.Store, SC = G.SC;
  var INT = [1, 3, 7, 14, 30];
  var p2 = function (n) { return (n < 10 ? "0" : "") + n; };
  function dstr(d) { return d.getFullYear() + "-" + p2(d.getMonth() + 1) + "-" + p2(d.getDate()); }
  function today() { return dstr(new Date()); }
  function addDays(s, n) { var a = s.split("-").map(Number); return dstr(new Date(a[0], a[1] - 1, a[2] + n)); }
  function dayNum(s) { var a = String(s).split("-").map(Number); return Math.round(Date.UTC(a[0], a[1] - 1, a[2]) / 864e5); }
  function esc(s) { return G.esc(String(s == null ? "" : s)); }
  function fill(s, extra) {
    return String(s).replace(/\{ten\}/g, Store.d.name || T("con", "you")).replace(/\{cu\}/g, owl()).replace(/\{(\w+)\}/g, function (m, k) { return extra && extra[k] != null ? extra[k] : m; });
  }
  function L2(pair) { return pair ? T(pair[0], pair[1]) : ""; }
  function owl() { var m = (G.MODES || []).filter(function (x) { return x.id === G.themeMode(); })[0]; return (m && m.owl) || "Cú Tí"; }
  function mimg(k) { return G.assetUrl(G.mascotPath(G.themeMode(), k)); }

  /* ---------- dữ liệu ---------- */
  function V() {
    var d = Store.d, v = d.v9 || (d.v9 = {});
    v.mem = v.mem || {}; v.log = v.log || {}; v.plan = v.plan || {}; v.why = v.why || { n: 0 }; v.notify = v.notify || {};
    if (!v.seeded) {   /* dữ liệu cũ (v8.x): bài đã qua mức Dễ được xếp vào hộp, dàn ra 3 ngày để không dồn ôn một lúc */
      v.seeded = 1; var k = 0;
      (G.LESSONS || []).forEach(function (l) {
        var s = Store.lesson(l.id);
        if (s.pass[0] && !v.mem[l.id]) v.mem[l.id] = { box: s.pass[1] ? 2 : 1, due: addDays(today(), k++ % 3) };
      });
    }
    var keys = Object.keys(v.log).sort(); if (keys.length > 60) keys.slice(0, keys.length - 60).forEach(function (x) { delete v.log[x]; });
    return v;
  }
  function memAdd(id, box, inDays) { var v = V(); if (!v.mem[id]) v.mem[id] = { box: box || 1, due: addDays(today(), inDays == null ? 1 : inDays) }; }
  function memUpd(id, ok, hinted) {
    var m = V().mem[id]; if (!m) return;
    if (ok && !hinted) { m.box = Math.min(5, m.box + 1); m.due = addDays(today(), INT[m.box - 1]); }
    else if (ok) m.due = addDays(today(), 1);
    else { m.box = 1; m.due = addDays(today(), 1); }
  }
  function dueList() {
    var v = V(), t = today();
    return Object.keys(v.mem).filter(function (id) { return G.byId(id) && v.mem[id].due <= t; })
      .sort(function (a, b) { var A = v.mem[a], B = v.mem[b]; return A.due < B.due ? -1 : A.due > B.due ? 1 : A.box - B.box; });
  }
  function boxCounts() { var v = V(), c = [0, 0, 0, 0, 0]; Object.keys(v.mem).forEach(function (id) { if (G.byId(id)) c[v.mem[id].box - 1]++; }); return c; }

  /* ---------- Khởi động: 3 câu của bài đến hạn ---------- */
  function startWarm() {
    var ids = dueList().slice(0, 3), d = G.daily();
    if (!ids.length) {
      d.rev = 1; Store.save(); G.toast(T("Hôm nay chưa có bài nào đến hạn ôn 🎉", "Nothing is due for review today 🎉"));
      try { if (G.dailyCheck) G.dailyCheck(); } catch (e) { }
      G.render(); return;
    }
    var r = G.mkRng(Date.now() % 2147483647), qs = [];
    for (var i = 0; i < 3; i++) {
      var id = ids[i % ids.length], l = G.byId(id), s = Store.lesson(id), t = s.pass[1] ? 2 : 1, q = null, g = 0;
      do { q = l.gen(t, r); g++; } while (g < 25 && qs.some(function (x) { return x.q === q.q; }));
      q.lesson = id; q.tier = t; q.warm = 1; qs.push(q);
    }
    var cfg = { n: 2, name: T("Khởi động", "Warm-up"), tag: "t2", count: qs.length, need: qs.length - 1, warm: 1 };
    G.begin(cfg, { id: "warm", title: T("Khởi động", "Warm-up"), links: [], review: !0 }, qs);
  }
  var oldReview = G.ACT.review;
  G.ACT.review = function () { if (dueList().length) { G.Sfx.tap(); startWarm(); } else oldReview.apply(this, arguments); };

  /* ---------- màn luyện tập: ảnh chụp lỗi lúc bắt đầu, nhãn "Ôn lại" cho câu khởi động ---------- */
  var prevPrac = SC.prac;
  SC.prac = function () {
    var P = G.UI.prac;
    if (P && !P._err0) P._err0 = JSON.parse(JSON.stringify(Store.d.err || {}));
    var r = prevPrac.apply(this, arguments);
    try {
      if (P && P.cfg && P.cfg.warm) {
        var q = G.curQ(), l = G.byId(q.lesson), s = Store.lesson(q.lesson), main = document.querySelector("#app main");
        var days = s.last ? Math.max(0, Math.round((Date.now() - s.last) / 864e5)) : 0;
        if (main && l) {
          var c = document.createElement("div"); c.className = "v9-src";
          c.innerHTML = "🔁 " + T("Ôn lại bài ", "Review: ") + "<b>" + esc(l.title) + "</b>" + (days > 0 ? T(" · học " + days + " ngày trước", " · studied " + days + " days ago") : "");
          main.insertBefore(c, main.firstChild);
        }
      }
    } catch (e) { }
    return r;
  };

  /* ---------- sau mỗi bộ câu: ghi nhật ký, cập nhật hộp nhớ ---------- */
  var studyHooks = [];
  function onResult(r) {
    var P = G.UI.prac; if (!P || P._v9) return; P._v9 = 1;
    var v = V(), t = today(), L = v.log[t] || (v.log[t] = { q: 0, ok1: 0, hint: 0, ms: 0, sets: 0, err: {}, mist: {} });
    L.sets++;
    var per = {};   /* gộp theo bài: một bài chỉ lên/xuống hộp MỘT lần mỗi bộ câu */
    P.qs.filter(function (q) { return !q.bonus; }).forEach(function (q) {
      var ok1 = q.w === 1 && !q.hinted, okAny = q.w > 0;
      L.q++; if (q.w === 1) L.ok1++; if (q.hinted) L.hint++; L.ms += Math.min(q._ms || 45000, 600000);
      if (!okAny && q.lesson) L.mist[q.lesson] = (L.mist[q.lesson] || 0) + 1;
      if (!q.lesson) return;
      var g = per[q.lesson] || (per[q.lesson] = { ok1: true, okAny: true });
      g.ok1 = g.ok1 && ok1; g.okAny = g.okAny && okAny;
    });
    Object.keys(per).forEach(function (id) {
      var g = per[id];
      if (P.cfg.warm) memUpd(id, g.okAny, g.okAny && !g.ok1);
      else if (v.mem[id] && !g.ok1 && v.mem[id].due > addDays(t, 1)) v.mem[id].due = addDays(t, 1);   /* sai hoặc nhờ gợi ý → mai hỏi lại */
    });
    var e0 = P._err0 || {}, e1 = Store.d.err || {};
    Object.keys(e1).forEach(function (k) { var dl = (e1[k] || 0) - (e0[k] || 0); if (dl > 0) L.err[k] = (L.err[k] || 0) + dl; });
    if (r && r.l && r.l.id && r.pass) {
      if (r.kind === "lesson" && r.t === 1) memAdd(r.l.id, 1, 1);
      if (r.kind === "known") v.mem[r.l.id] = { box: 2, due: addDays(t, 3) };   /* "Bé đã biết": hỏi lại sau 3 ngày */
    }
    v.lastStudy = t; Store.save();
    studyHooks.forEach(function (f) { try { f(t); } catch (e) { } });
  }
  var prevRes = SC.result;
  SC.result = function (r) {
    try { onResult(r); } catch (e) { G.T4.logErr && G.T4.logErr("v9 result: " + e.message); }
    return prevRes.apply(this, arguments);
  };

  /* ---------- Kế hoạch hôm nay (trên trang Phòng) ---------- */
  function lastLesson() {
    var best = null, bt = 0;
    (G.LESSONS || []).forEach(function (l) { var s = Store.lesson(l.id); if (s.last && s.last > bt) { bt = s.last; best = l; } });
    return best;
  }
  function tellPrompt(l) {
    if (!l) return T("Hôm nay con học được gì?", "What did you learn today?");
    var th = (G.LY_THUYET || {})[l.id], memo = th && th.memo;
    return memo ? "“" + memo + "”" : T("Bài “" + l.title + "” nói gì?", "What is “" + l.title + "” about?");
  }
  function planSteps() {
    var d = G.daily(), v = V(), t = today();
    if (v.plan.date !== t) v.plan = { date: t, tell: 0 };
    var nx = G.nextLesson(), due = dueList().length, cur = lastLesson() || nx;
    return [
      { k: "warm", done: !!d.rev, ic: "🔁", t: T("Khởi động: ôn bài đến hạn", "Warm-up: due reviews"), s: due ? T(due + " bài đến hạn · khoảng 2 phút", due + " due · about 2 min") : T("Hôm nay không có bài đến hạn", "Nothing due today") },
      { k: "new", done: !!d.nw, ic: "📖", t: T("Học mới: ", "New: ") + (nx ? nx.title : T("ôn bài cũ", "review")), s: T("Qua mức Dễ của một bài mới", "Pass Easy on a new lesson") },
      { k: "ch", done: !!d.ch, ic: "🏆", t: T("Thử thách: mức Khó hoặc Bài trùm", "Challenge: Hard level or Boss"), s: T("Một bộ câu khó của bài đang học", "One hard set of the current lesson") },
      { k: "tell", done: !!v.plan.tell, ic: "🗣️", t: T("Kể lại cho bố mẹ nghe", "Tell a parent"), s: tellPrompt(cur) }
    ];
  }
  function planHtml() {
    var st = planSteps(), n = st.filter(function (x) { return x.done; }).length, nxt = st.filter(function (x) { return !x.done; })[0];
    var c = boxCounts(), labs = [T("mỗi ngày", "daily"), T("3 ngày", "3 days"), T("1 tuần", "1 week"), T("2 tuần", "2 weeks"), T("1 tháng", "1 month")];
    return '<details class="v9plan"><summary><span class="v9dots">' + st.map(function (x) { return '<i class="' + (x.done ? "on" : "") + '">' + (x.done ? "✓" : "") + "</i>"; }).join("") +
      '</span><b>' + (n === 4 ? T("🎉 Xong kế hoạch hôm nay!", "🎉 Today's plan is done!") : T("Hôm nay: ", "Today: ") + n + "/4") + '</b>' +
      (nxt ? '<span class="v9go" data-v9p="' + nxt.k + '">' + nxt.ic + " " + T("Tiếp", "Next") + " ▶</span>" : "") + '</summary><div class="v9rows">' +
      st.map(function (x, i) {
        return '<div class="v9row' + (x.done ? " done" : x === nxt ? " cur" : "") + '"><span class="n">' + (x.done ? "✓" : i + 1) + '</span><span class="grow"><b>' + x.ic + " " + esc(x.t) + "</b><small>" + esc(x.s) + "</small></span>" +
          (x.done ? "" : '<button class="v9btn" data-v9p="' + x.k + '">' + (x.k === "tell" ? T("Kể ✓", "Done ✓") : T("Làm ▶", "Go ▶")) + "</button>") + "</div>";
      }).join("") + '<div class="v9note">' + T("Xong 3 bước đầu được thưởng +2 ⭐.", "Finish the first 3 steps for +2 ⭐.") + "</div>" +
      '<div class="v9h">📦 ' + T("Hộp nhớ", "Memory boxes") + '</div><div class="v9boxes">' + c.map(function (n, i) { return '<div class="b' + (i + 1) + '"><b>' + n + "</b><small>" + T("Hộp ", "Box ") + (i + 1) + "<br>" + labs[i] + "</small></div>"; }).join("") +
      '</div><div class="v9note">' + T("Nhớ tốt → lên hộp cao, ôn thưa dần. Sai → về Hộp 1.", "Remembered → higher box, reviewed less often. Missed → back to Box 1.") + "</div></div></details>";
  }
  function planAct(k) {
    var st = planSteps(), nx = G.nextLesson(), cur = lastLesson() || nx;
    if (k === "warm") { G.Sfx.tap(); startWarm(); }
    else if (k === "new") { if (nx) G.ACT.lesson({ dataset: { id: nx.id } }); else startWarm(); }
    else if (k === "ch") { if (cur) G.ACT.lesson({ dataset: { id: cur.id } }); }
    else if (k === "tell") {
      var s = st[3];
      G.sheet('<div class="v9-tell"><img src="' + mimg("teach") + '" alt=""><h2 class="disp">' + T("Kể cho bố mẹ nghe nhé!", "Tell a parent!") + "</h2><p>" + esc(T("Con giải thích bằng lời của con: ", "Explain in your own words: ")) + "<b>" + esc(s.s) + "</b></p><p class=\"muted\">" +
        T("Nói to cho bố mẹ nghe, rồi bấm nút bên dưới.", "Say it out loud to a parent, then tap below.") + '</p><button class="btn pri block" data-k="ok">' + T("Con đã kể xong ✓", "I told them ✓") + '</button><button class="btn block" data-k="x" style="margin-top:8px">' + T("Để sau", "Later") + "</button></div>",
        function (bg, close) {
          bg.querySelector("[data-k=x]").onclick = close;
          bg.querySelector("[data-k=ok]").onclick = function () { V().plan.tell = 1; Store.save(); close(); G.Sfx.ok && G.Sfx.ok(); G.toast(T("Giỏi quá! Nói lại được là hiểu bài thật đó 🌟", "Great! Explaining it means you really get it 🌟")); G.render(); };
        });
    }
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-v9p]"); if (!b) return;
    e.preventDefault(); e.stopPropagation(); planAct(b.getAttribute("data-v9p"));
  }, true);

  /* ---------- Chào mừng trở lại (nghỉ từ 1 ngày trở lên) ---------- */
  function welcomeBack(gap) {
    var lines = (G.LOI_NHAC && G.LOI_NHAC.back) || [], line = lines.length ? fill(L2(lines[Math.floor(Math.random() * lines.length)])) : "";
    var sk = Store.d.streak || {}, wk = Math.floor((dayNum(today()) + 3) / 7), keep = gap === 2 && sk.n > 0 && sk.freeze !== wk;
    var due = dueList().length;
    G.sheet('<div class="v9-back"><img src="' + mimg("wow") + '" alt=""><div class="v9-bub">' + esc(line) + "</div>" +
      '<div class="v9-card"><b>' + (keep ? T("🔥 Chuỗi " + sk.n + " ngày vẫn giữ", "🔥 Your " + sk.n + "-day streak is safe") : T("🔥 Bắt đầu chuỗi mới nào!", "🔥 Let's start a new streak!")) + "</b><small>" +
      T("Mỗi tuần được nghỉ 1 ngày mà không mất chuỗi. Không ai bị trừ sao vì nghỉ học.", "You can skip 1 day a week without losing the streak. No stars are ever taken away.") + "</small></div>" +
      '<div class="v9-card"><b>' + (due ? T("Làm nóng nhẹ: 3 câu khởi động", "Gentle warm-up: 3 questions") : T("Học tiếp bài đang dở nhé", "Let's continue your lesson")) + "</b><small>" + T("Chỉ khoảng 2 phút thôi.", "Only about 2 minutes.") + "</small></div>" +
      '<button class="btn pri block" data-k="go">' + T("Bắt đầu ▶", "Start ▶") + '</button><button class="btn block" data-k="x" style="margin-top:8px">' + T("Để sau", "Later") + "</button></div>",
      function (bg, close) {
        bg.querySelector("[data-k=x]").onclick = close;
        bg.querySelector("[data-k=go]").onclick = function () { close(); if (due) startWarm(); else planAct("new"); };
      });
  }
  var prevHome = SC.home;
  SC.home = function () {
    var r = prevHome.apply(this, arguments);
    try {
      var v = V(), t = today();
      if (!document.querySelector(".v9plan")) {
        var host = document.querySelector(".v8in .hint"), wrap = document.createElement("div");
        wrap.innerHTML = planHtml();
        var el = wrap.firstChild;
        if (host && host.parentNode) host.parentNode.insertBefore(el, host.nextSibling);
        else { var m = document.querySelector("#app main") || document.getElementById("app"); m.insertBefore(el, m.firstChild); }
      }
      if (v.seen && v.seen !== t && v.backShown !== t) {
        var gap = dayNum(t) - dayNum(v.seen);
        if (gap >= 2) { v.backShown = t; setTimeout(function () { welcomeBack(gap); }, 450); }
      }
      if (v.seen !== t) { v.seen = t; Store.save(); }
    } catch (e) { G.T4.logErr && G.T4.logErr("v9 home: " + e.message); }
    return r;
  };

  /* mở từ thông báo Android (vỏ gọi window.onReminderOpen) */
  G.onReminderOpen = function () { G.UI.stack = [{ n: "home" }]; G.render(); setTimeout(function () { if (dueList().length) startWarm(); }, 300); };

  G.T4.v9 = { V: V, today: today, addDays: addDays, dayNum: dayNum, dueList: dueList, boxCounts: boxCounts, startWarm: startWarm, memAdd: memAdd,
    owl: owl, mimg: mimg, fill: fill, L2: L2, esc: esc, onStudy: function (f) { studyHooks.push(f); }, INT: INT };
})();
