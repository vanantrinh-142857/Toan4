//# features/lesson-stages.js — Trang bài: 3 CHẶNG thay cho danh sách 11 hàng =====
//# Tự chứa trong một hàm bọc — chạy độc lập, không cần build.
/* ===== features/lesson-stages.js – Trang bài: 3 CHẶNG thay cho danh sách 11 hàng =====
   📖 Học (lý thuyết, cách làm, "Bé đã biết")  →  ✏️ Luyện tập (thử nhanh, Dễ, Vừa, Khó)  →  🏆 Thử thách (ôn nâng cao, bài nâng cao).
   Nút lớn "Tiếp tục" (đã có sẵn ở đầu trang) luôn dẫn bé tới việc tiếp theo; chỉ chặng đang làm được mở sẵn.
   Mọi hàng cũ vẫn còn nguyên bên trong từng chặng (bé và phụ huynh vẫn chọn tự do). */
(function () {
  "use strict";
  var G = window, SC = G.SC, Store = G.Store, T = G.T4.T, ids = G.T4.ADV_IDS || {};
  var STAGES = [['📖', T('Học', 'Learn')], ['✏️', T('Luyện tập', 'Practice')], ['🏆', T('Thử thách', 'Challenge')]];
  var prev = SC.lesson;
  SC.lesson = function () {
    var r = prev.apply(this, arguments);
    try { stage(); } catch (e) { }
    return r;
  };
  function stage() {
    var st = document.querySelector(".steps"); if (!st || st.dataset.staged) return;
    var id = (st.querySelector("[data-id]") || {}).dataset && st.querySelector("[data-act=theory]") ? st.querySelector("[data-act=theory]").dataset.id : null;
    var rows = [].slice.call(st.children), groups = [[], [], []];
    rows.forEach(function (r) {
      var a = r.dataset.act, t = r.dataset.t;
      if (a === "theory" || a === "teach" || a === "known") groups[0].push(r);
      else if (a === "prac" && +t <= 3) groups[1].push(r);
      else groups[2].push(r);
    });
    if (!groups[1].length) return;   /* trang bài lạ (đề thi…) → để nguyên */
    var s = id ? Store.lesson(id) : { theory: 0, taught: 0, quick: 0, pass: [0, 0, 0, 0], best: [0, 0, 0, 0] };
    var advRows = groups[2].filter(function (r) { return r.dataset.act === "lesson"; });
    var advDone = advRows.filter(function (r) { return G.lessonPassed && G.lessonPassed(r.dataset.id, 1); }).length;
    var stat = [
      [(s.theory ? 1 : 0) + (s.taught ? 1 : 0), 2],
      [(s.quick ? 1 : 0) + (s.pass[0] ? 1 : 0) + (s.pass[1] ? 1 : 0) + (s.pass[2] ? 1 : 0), 4],
      [((s.best[3] || s.pass[3]) ? 1 : 0) + advDone, 1 + advRows.length]
    ];
    var cta = document.querySelector(".lcta"), a = cta && cta.dataset.act, t = cta && +cta.dataset.t;
    var cur = a === "theory" || a === "teach" ? 0 : a === "prac" && t <= 3 ? 1 : a ? 2 : 1;
    st.innerHTML = ""; st.dataset.staged = 1; st.classList.add("stages");
    groups.forEach(function (g, i) {
      if (!g.length) return;
      var box = document.createElement("div"); box.className = "stage" + (i === cur ? " open" : "") + (stat[i][0] >= stat[i][1] ? " full" : "");
      var h = document.createElement("button"); h.className = "stage-h"; h.setAttribute("data-act", "stg"); h.setAttribute("aria-expanded", i === cur);
      h.innerHTML = '<span class="si">' + STAGES[i][0] + "</span><b>" + (i + 1) + ". " + STAGES[i][1] + '</b><span class="sn">' + (stat[i][0] >= stat[i][1] ? "✓ " : "") + stat[i][0] + "/" + stat[i][1] + '</span><span class="chev">▾</span>';
      var body = document.createElement("div"); body.className = "stage-b"; g.forEach(function (r) { body.appendChild(r); });
      box.appendChild(h); box.appendChild(body); st.appendChild(box);
    });
  }
  G.ACT.stg = function (el) { var b = el.closest(".stage"); if (!b) return; var o = b.classList.toggle("open"); el.setAttribute("aria-expanded", o); G.Sfx && G.Sfx.tap && G.Sfx.tap(); };
})();
