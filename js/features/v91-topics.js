//# features/v91-topics.js — Mục "Chuyên đề nâng cao" trên bản đồ (v9.1)
//# Tự chứa trong một hàm bọc — chạy độc lập, không cần build.
/* ===== features/v91-topics.js =====
   Gom các bài toán khó theo chuyên đề (du-lieu/chuyen-de.js). Mỗi bài trong chuyên đề có 3 việc theo thứ tự:
   1. Cách làm (lý thuyết của bài)  2. Ví dụ mẫu (bài trong ngân hàng nâng cao, mở từng bước)  3. Luyện tập (vào trang bài học).
   Không đổi nội dung bài học, không đổi cách mở mức: chỉ thêm lối vào theo chuyên đề. */
(function () {
  "use strict";
  var G = window, T = G.T4.T, SC = G.SC, Store = G.Store, esc = G.esc, rich = G.rich;
  var LIST = G.CHUYEN_DE || [];
  if (!LIST.length) return;
  var L = function () { return G.LANG === "en" ? 1 : 0; };
  var lang = function () { return G.LANG === "en" ? "en" : "vi"; };
  var bank = function (id) { return (G.NANG_CAO || {})[id] || []; };
  var lessonsOf = function (t) { return t.bai.map(G.byId).filter(Boolean); };
  var topicById = function (id) { return LIST.filter(function (t) { return t.id === id; })[0]; };
  var open = false;

  /* ---------- Chương "Chuyên đề nâng cao" trên bản đồ ---------- */
  var prevMap = SC.map;
  SC.map = function () {
    prevMap.apply(this, arguments);
    var all = document.querySelector(".mapflat .mapall"); if (!all) return;
    var h = '<div class="chap cd' + (open ? " open" : "") + '" data-ch="cd"><button class="chap-h" data-act="cdchap" aria-expanded="' + open + '"><span class="ci">⭐</span><b>' + T("Chuyên đề nâng cao", "Advanced topics") + '</b><span class="cn">' + LIST.length + '</span><span class="chev">▾</span></button><div class="chap-b">';
    LIST.forEach(function (t, i) {
      var n = t.bai.reduce(function (a, id) { return a + bank(id).length; }, 0);
      h += '<button class="lrow cdrow" data-act="cdtopic" data-id="' + t.id + '"><span class="bn">' + T("CĐ " + (i + 1), "T" + (i + 1)) + '</span><span class="tx"><b>' + t.icon + " " + esc(t.ten[L()]) + '</b><small class="st9">' + (n ? n + T(" bài toán khó", " hard problems") : T("Luyện theo mức Khó", "Practice at Hard level")) + '</small></span><span class="go">▶</span></button>';
    });
    all.insertAdjacentHTML("beforebegin", h + "</div></div>");
  };
  G.ACT.cdchap = function (el) {
    var c = el.closest(".chap"); open = c.classList.toggle("open"); el.setAttribute("aria-expanded", open); G.Sfx && G.Sfx.tap && G.Sfx.tap();
  };
  G.ACT.cdtopic = function (el) { G.Sfx && G.Sfx.tap && G.Sfx.tap(); open = true; G.go("topic", { id: el.dataset.id }); };

  /* ---------- Trang một chuyên đề ---------- */
  SC.topic = function (p) {
    var t = topicById(p.id) || LIST[0];
    var h = G.topbar(t.icon + " " + t.ten[L()], T("Chuyên đề nâng cao", "Advanced topic"), { back: 1 }) + '<main class="cdpage">' +
      '<section class="card flat cdintro"><b>' + T("Các dạng hay gặp", "Common problem types") + '</b><ul>' +
      t.dang[L()].split(" · ").map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>" +
      '<p class="muted">' + T("Mỗi bài đi theo 3 bước: xem cách làm, xem ví dụ mẫu, rồi tự luyện tập.", "Each lesson has 3 steps: learn the method, study a worked example, then practice.") + "</p></section>";
    lessonsOf(t).forEach(function (l) {
      var s = Store.lesson(l.id), n = bank(l.id).length, pc = s.pass.filter(Boolean).length, hasTh = !!(G.LY_THUYET && G.LY_THUYET[l.id]) || !!l.teach;
      h += '<section class="card flat cdcard"><h3>' + esc(l.title) + "</h3>" + (l.blurb ? '<p class="muted">' + esc(l.blurb) + "</p>" : "") + '<div class="cdsteps">' +
        (hasTh ? '<button class="stp" data-act="theory" data-id="' + l.id + '"><span class="n" style="background:#D9C8FF">1</span><span class="grow"><b>' + T("Cách làm", "The method") + "</b><small>" + T("Xem lý thuyết và mẹo", "Theory and tips") + "</small></span></button>" : "") +
        (n ? '<button class="stp" data-act="cdex" data-id="' + l.id + '" data-k="0"><span class="n" style="background:#FFE08A">2</span><span class="grow"><b>' + T("Ví dụ mẫu", "Worked examples") + "</b><small>" + T("Mở lời giải từng bước", "Reveal the solution step by step") + "</small></span></button>" : "") +
        '<button class="stp" data-act="lesson" data-id="' + l.id + '"><span class="n" style="background:#B8F0D2">3</span><span class="grow"><b>' + T("Luyện tập", "Practice") + "</b><small>" + T("Đã qua " + pc + "/3 mức", pc + "/3 levels passed") + (n ? T(" · " + n + " bài nâng cao", " · " + n + " advanced") : "") + "</small></span></button></div></section>";
    });
    G.app ? (G.app.innerHTML = h + "</main>") : (document.getElementById("app").innerHTML = h + "</main>");
  };

  /* ---------- Ví dụ mẫu: 3 bài (dễ → khó) lấy từ ngân hàng nâng cao, mở từng bước ---------- */
  function examples(id) {
    var b = bank(id), out = [];
    [1, 2, 3].forEach(function (k) { var x = b.filter(function (q) { return q.rank === k && (q.steps || []).length; })[0]; x && out.push(x); });
    if (!out.length) out = b.filter(function (q) { return (q.steps || []).length; }).slice(0, 3);
    return out;
  }
  function ansText(q) {
    var lg = lang();
    return q.parts.map(function (p) {
      var lab = p.lab && p.lab[lg] ? p.lab[lg] + ": " : "";
      if (p.kind === "frac") return lab + "{" + p.ans[0] + "/" + p.ans[1] + "}";
      if (p.kind === "choice") return lab + p.opts[lg][p.ans];
      return lab + G.fmt(p.ans) + (p.unit && p.unit[lg] ? " " + p.unit[lg] : "");
    }).join("; ");
  }
  G.ACT.cdex = function (el) {
    var id = el.dataset.id, ex = examples(id), k = +el.dataset.k || 0, q = ex[k]; if (!q) return;
    var lg = lang(), shown = 0, steps = q.steps || [];
    G.Sfx && G.Sfx.tap && G.Sfx.tap();
    G.sheet('<div class="cdex"><small class="muted">' + T("Ví dụ mẫu " + (k + 1) + "/" + ex.length, "Example " + (k + 1) + " of " + ex.length) + '</small><div class="cdq">' + rich(q.q[lg]) + '</div>' +
      '<p class="muted cdhint">' + T("Con thử nghĩ cách làm trước, rồi mới mở từng bước nhé.", "Think about how you would solve it first, then reveal each step.") + '</p><ol class="cdlist"></ol><div class="cdans" hidden></div>' +
      '<button class="btn pri block" data-k="n">' + T("Mở bước 1", "Show step 1") + '</button>' +
      (ex.length > 1 ? '<button class="btn block" data-k="o" style="margin-top:8px">' + T("Ví dụ khác", "Another example") + "</button>" : "") +
      '<button class="btn block" data-k="c" style="margin-top:8px">' + T("Đóng", "Close") + "</button></div>",
      function (bg, close) {
        var nb = bg.querySelector("[data-k=n]"), ol = bg.querySelector(".cdlist"), an = bg.querySelector(".cdans");
        nb.onclick = function () {
          if (shown < steps.length) {
            var li = document.createElement("li"); li.innerHTML = rich(steps[shown][lg]); ol.appendChild(li); shown++;
            nb.textContent = shown < steps.length ? T("Mở bước " + (shown + 1), "Show step " + (shown + 1)) : T("Xem đáp số", "Show the answer");
          } else {
            an.hidden = false; an.innerHTML = "<b>" + T("Đáp số: ", "Answer: ") + "</b>" + rich(ansText(q)) + (q.tip && q.tip[lg] ? '<div class="muted" style="margin-top:4px">💡 ' + rich(q.tip[lg]) + "</div>" : "");
            nb.remove();
          }
          li && li.scrollIntoView && li.scrollIntoView({ block: "nearest" });
        };
        var ob = bg.querySelector("[data-k=o]");
        ob && (ob.onclick = function () { close(); G.ACT.cdex({ dataset: { id: id, k: (k + 1) % ex.length } }); });
        bg.querySelector("[data-k=c]").onclick = close;
      });
  };
})();
