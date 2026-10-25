//# features/v9-skills.js — v9: CÂY KỸ NĂNG (trang Thành tích) và BÁO CÁO TUẦN (khu phụ huynh) =====
//# Tự chứa trong một hàm bọc — chạy độc lập, không cần build.
/* 4 mức của mỗi bài: 🌱 Đang học · ⭐ Thành thạo (qua mức Vừa hoặc "Bé đã biết") · 💎 Vững (thành thạo và đã lên Hộp nhớ 4,
   tức vẫn đúng sau 1 tuần) · 🔁 Đến hạn ôn. Báo cáo tuần lấy từ nhật ký Store.d.v9.log (v9-memory.js). */
(function () {
  "use strict";
  var G = window, T = G.T4.T, Store = G.Store, SC = G.SC, X = G.T4.v9, esc = X.esc;
  var RANK = { lock: 0, new: 0, learn: 1, star: 2, gem: 3 }, BADGE = { gem: "💎", star: "⭐", learn: "🌱", new: "🌱", lock: "🔒" };
  function level(l) {
    var s = Store.lesson(l.id), m = X.V().mem[l.id], t = X.today();
    var prog = ((s.theory ? 1 : 0) + (s.taught ? 1 : 0) + (s.quick ? 1 : 0) + (s.pass[0] ? 1 : 0) + (s.pass[1] ? 1 : 0) + (s.pass[2] ? 1 : 0)) / 6;
    if (s.known) prog = Math.max(prog, 0.84);
    var star = !!(s.pass[1] || s.known), gem = star && m && m.box >= 4;
    var lv = gem ? "gem" : star ? "star" : prog > 0 ? "learn" : G.unlocked(l) ? "new" : "lock";
    return { lv: lv, due: !!(m && m.due <= t), prog: Math.round(prog * 100) };
  }
  function mainLessons() { return (G.ORDER || []).map(G.byId).filter(function (l) { return l && !l.optional; }); }
  function skillsHtml() {
    var ls = mainLessons(), c = { star: 0, gem: 0, learn: 0, due: 0 };
    ls.forEach(function (l) { var v = level(l); if (c[v.lv] != null) c[v.lv]++; if (v.due && v.lv !== "lock") c.due++; });
    var h = '<section class="card flat v9-skills"><h2 class="disp">🌳 ' + T("Cây kỹ năng của ", "Skill tree of ") + esc(Store.d.name || T("bé", "you")) + "</h2>" +
      '<div class="v9-kpi"><div><b>' + c.star + "</b><small>⭐ " + T("thành thạo", "mastered") + "</small></div><div><b>" + c.gem + "</b><small>💎 " + T("vững", "solid") + "</small></div><div><b>" + c.learn +
      "</b><small>🌱 " + T("đang học", "learning") + '</small></div><div class="due"><b>' + c.due + "</b><small>🔁 " + T("cần ôn", "to review") + "</small></div></div>" +
      '<div class="v9-legend">🌱 ' + T("Đang học", "Learning") + " · ⭐ " + T("Thành thạo", "Mastered") + " · 💎 " + T("Vững (vẫn đúng sau 1 tuần)", "Solid (still right after a week)") + " · 🔁 " + T("Đến hạn ôn", "Due") + " · ✨ " + T("Huy hiệu Hiểu bài: ", "Understanding badges: ") + (X.V().why.n || 0) + "</div>";
    (G.REGIONS || []).forEach(function (rg) {
      var rl = ls.filter(function (l) { return l.reg === rg.id; }); if (!rl.length) return;
      h += '<h3 class="v9-rg">' + esc(rg.name) + '</h3><div class="v9-grid">' + rl.map(function (l) {
        var v = level(l), b = v.due && v.lv !== "lock" ? "🔁" : BADGE[v.lv];
        return '<button class="v9-sk lv-' + v.lv + (v.due && v.lv !== "lock" ? " due" : "") + '" data-act="lesson" data-id="' + l.id + '"><span class="bd">' + b + '</span><img src="' + G.assetUrl("assets/lessons/" + l.id + ".webp") +
          '" alt="" onerror="this.style.visibility=\'hidden\'"><b>' + esc(l.short || l.title) + '</b><span class="pg"><i style="width:' + v.prog + '%"></i></span></button>';
      }).join("") + "</div>";
    });
    var bc = X.boxCounts();
    h += '<h3 class="v9-rg">📦 ' + T("Hộp nhớ", "Memory boxes") + '</h3><div class="v9boxes">' + bc.map(function (n, i) {
      return '<div class="b' + (i + 1) + '"><b>' + n + "</b><small>" + T("Hộp ", "Box ") + (i + 1) + "<br>" + [T("mỗi ngày", "daily"), T("3 ngày", "3 days"), T("1 tuần", "1 week"), T("2 tuần", "2 weeks"), T("1 tháng", "1 month")][i] + "</small></div>";
    }).join("") + "</div></section>";
    return h;
  }
  var prevStats = SC.stats;
  SC.stats = function () {
    var r = prevStats.apply(this, arguments);
    try {
      var main = document.querySelector("#app main"); if (main && !main.querySelector(".v9-skills")) {
        var d = document.createElement("div"); d.innerHTML = skillsHtml(); main.insertBefore(d.firstChild, main.children[1] || null);
        [].slice.call(main.querySelectorAll("section")).forEach(function (s) {
          var h2 = s.querySelector("h2"); if (!h2 || !/Các bài đã học|Lessons/.test(h2.textContent) || s.closest("details")) return;
          var det = document.createElement("details"); det.className = "v9-old"; det.innerHTML = "<summary>📋 " + T("Bảng chi tiết từng bài", "Detailed lesson table") + "</summary>";
          s.parentNode.insertBefore(det, s); det.appendChild(s);
        });
      }
    } catch (e) { G.T4.logErr && G.T4.logErr("v9 stats: " + e.message); }
    return r;
  };

  /* ---------- Báo cáo tuần ---------- */
  function weekStart() { var d = new Date(), dow = (d.getDay() + 6) % 7; return X.addDays(X.today(), -dow); }
  function ensureSnap() {
    var v = X.V(), ws = weekStart();
    if (!v.snap || v.snap.wk !== ws) { var lv = {}; mainLessons().forEach(function (l) { lv[l.id] = level(l).lv; }); v.snap = { wk: ws, lv: lv }; Store.save(); }
  }
  var prevHome = SC.home;
  SC.home = function () { var r = prevHome.apply(this, arguments); try { ensureSnap(); } catch (e) { } return r; };
  function report() {
    ensureSnap();
    var v = X.V(), ws = weekStart(), days = [], i;
    for (i = 0; i < 7; i++) days.push(X.addDays(ws, i));
    var tot = { act: 0, ms: 0, q: 0, ok1: 0, err: {}, mist: {} };
    days.forEach(function (d) {
      var L = v.log[d]; if (!L || !L.q) return;
      tot.act++; tot.ms += L.ms || 0; tot.q += L.q; tot.ok1 += L.ok1 || 0;
      Object.keys(L.err || {}).forEach(function (k) { tot.err[k] = (tot.err[k] || 0) + L.err[k]; });
      Object.keys(L.mist || {}).forEach(function (k) { tot.mist[k] = (tot.mist[k] || 0) + L.mist[k]; });
    });
    var fmtD = function (s) { var a = s.split("-"); return +a[2] + "/" + +a[1]; };
    var prog = mainLessons().map(function (l) { var a = v.snap.lv[l.id] || "lock", b = level(l).lv; return RANK[b] > RANK[a] ? "<li>" + esc(l.short || l.title) + ": " + BADGE[a] + " → <b>" + BADGE[b] + "</b></li>" : ""; }).join("");
    var errs = Object.keys(tot.err).filter(function (k) { return G.KIND_NAME && G.KIND_NAME[k]; }).sort(function (a, b) { return tot.err[b] - tot.err[a]; }).slice(0, 3);
    var mists = Object.keys(tot.mist).filter(G.byId).sort(function (a, b) { return tot.mist[b] - tot.mist[a]; });
    var nx = G.nextLesson(), focus = mists[0] || (nx && nx.id), GY = G.GOI_Y_O_NHA || {}, act = X.L2(GY[focus] || GY._);
    var soon = Object.keys(v.mem).filter(function (id) { return G.byId(id) && v.mem[id].due <= X.addDays(X.today(), 7); }).sort(function (a, b) { return v.mem[a].due < v.mem[b].due ? -1 : 1; });
    var plan = [];
    if (soon[0]) plan.push(T("ôn ", "review ") + G.byId(soon[0]).title);
    if (mists[0]) plan.push(T("luyện thêm ", "practise ") + G.byId(mists[0]).title);
    if (nx) plan.push(T("học tiếp ", "continue with ") + nx.title);
    var h = '<div class="v9-rep"><h2 class="disp">📅 ' + T("Báo cáo tuần của ", "Weekly report for ") + esc(Store.d.name || T("bé", "your child")) + "</h2><div class=\"muted\">" + fmtD(days[0]) + " – " + fmtD(days[6]) + "</div>" +
      '<div class="v9-kpi"><div><b>' + tot.act + "</b><small>" + T("ngày học", "days") + "</small></div><div><b>" + Math.round(tot.ms / 60000) + "’</b><small>" + T("thời gian", "time") + "</small></div><div><b>" + tot.q +
      "</b><small>" + T("câu đã làm", "questions") + "</small></div><div><b>" + (tot.q ? Math.round(tot.ok1 / tot.q * 100) : 0) + "%</b><small>" + T("đúng lần 1", "first try") + "</small></div></div>" +
      "<h3>📈 " + T("Tiến bộ trong tuần", "Progress this week") + "</h3>" + (prog ? "<ul>" + prog + "</ul>" : '<p class="muted">' + T("Chưa có bài lên mức mới trong tuần này.", "No new levels reached this week yet.") + "</p>") +
      "<h3>🔎 " + T("Lỗi hay gặp", "Common mistakes") + "</h3>" + (errs.length ? "<ol>" + errs.map(function (k) { return "<li>" + esc(G.KIND_NAME[k]) + ' <span class="v9-badge">' + tot.err[k] + T(" lần", "×") + "</span></li>"; }).join("") + "</ol>" : '<p class="muted">' + T("Tuần này chưa ghi nhận lỗi nào.", "No mistakes recorded this week.") + "</p>") +
      '<div class="v9-tipbox">🏠 <b>' + T("10 phút cùng con:", "10 minutes together:") + "</b> " + esc(act) + "</div>" +
      (plan.length ? '<p class="muted">' + T("Tuần tới app sẽ gợi ý: ", "Next week the app will suggest: ") + esc(plan.join("; ")) + ".</p>" : "") +
      '<button class="btn block" data-k="c">' + T("Đóng", "Close") + "</button></div>";
    G.sheet(h, function (bg, close) { bg.querySelector("[data-k=c]").onclick = close; });
  }
  G.T4.v9.weekReport = report; G.T4.v9.level = level;
  var prevSet = SC.settings;
  SC.settings = function () {
    var r = prevSet.apply(this, arguments);
    try {
      var tools = document.querySelector("#parentArea .pa-body .parts");
      if (tools && !tools.querySelector("[data-v9r]")) tools.insertAdjacentHTML("afterbegin", '<button class="btn sm block" data-v9r="week">📅 ' + T("Báo cáo tuần", "Weekly report") + "</button>");
    } catch (e) { }
    return r;
  };
  document.addEventListener("click", function (e) { var b = e.target.closest && e.target.closest("[data-v9r]"); if (!b) return; e.stopPropagation(); report(); });
})();
