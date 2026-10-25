//# features/v9-why.js — v9: HỎI "CON ĐÃ LÀM THẾ NÀO?" sau khi bé làm đúng (mức Vừa, Khó, Khởi động) =====
//# Tự chứa trong một hàm bọc — chạy độc lập, không cần build. Nội dung: du-lieu/v9-noi-dung.js (VI_SAO).
/* Khoảng 1/3 số câu khớp mẫu đề được hỏi thêm lí do. Đúng lí do → +1 "Huy hiệu Hiểu bài". Chọn sai hoặc
   "Con đoán thử" không bị trừ gì, Cú chỉ giải thích lại cách đúng. Không chặn nút "Câu tiếp". */
(function () {
  "use strict";
  var G = window, T = G.T4.T, Store = G.Store, X = G.T4.v9;
  function hash(s) { var h = 7; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); }
  function pick(q) {
    var arr = (G.VI_SAO || {})[q.lesson]; if (!arr) return null;
    var en = G.LANG === "en";
    for (var i = 0; i < arr.length; i++) { var e = arr[i], re = e.m[en ? 1 : 0]; if (re && re.test(q.q) && !(e.x && e.x.test(q.q))) return e; }
    return null;
  }
  function eligible(q) {
    var P = G.UI.prac;
    if (!P || P.cfg.exam || !q || q.bonus || !q.st || !q.st.done || !q.st.res || !q.st.res.every(Boolean)) return false;
    if ((q.tier || 1) < 2 && !P.cfg.warm) return false;
    if (q.why == null) { var e = pick(q), h = hash(q.q); q.why = e && h % 3 === 0 ? { e: e, sel: -1, ord: h % 2 ? [0, 1, 2] : h % 5 > 2 ? [1, 0, 2] : [2, 1, 0] } : 0; }
    return !!q.why;
  }
  function card(q) {
    var w = q.why, e = w.e, base = [{ t: X.L2(e.r), ok: 1 }, { t: X.L2(e.w[0]) }, { t: X.L2(e.w[1]) }],
      opts = w.ord.map(function (i) { return base[i]; }).concat([{ t: T("Con đoán thử", "I guessed"), g: 1 }]),
      h = '<div class="v9-why"><b class="hd">🤔 ' + T("Con đã làm thế nào?", "How did you solve it?") + '</b>';
    opts.forEach(function (o, i) {
      var cls = w.sel < 0 ? "" : o.ok ? " right" : i === w.sel ? " wrong" : " dim";
      h += '<button data-v9w="' + i + '" class="' + cls + '"' + (w.sel >= 0 ? " disabled" : "") + ">" + String.fromCharCode(65 + i) + ". " + X.esc(o.t) + "</button>";
    });
    if (w.sel >= 0) {
      var o = opts[w.sel];
      h += '<div class="v9-msg ' + (o.ok ? "ok" : "info") + '">' + (o.ok ? "✨ " + T("Đúng lí do! +1 Huy hiệu Hiểu bài (" + X.V().why.n + ")", "Right reason! +1 Understanding badge (" + X.V().why.n + ")") :
        (o.g ? T("Không sao! ", "That's fine! ") : T("Chưa đúng lí do. ", "Not quite the reason. ")) + T("Cách làm là: ", "The method is: ") + "<b>" + X.esc(X.L2(e.r)) + "</b>") + "</div>";
    } else h += '<div class="v9-note">' + T("Chọn đúng lí do được ✨ Huy hiệu Hiểu bài. Chọn “đoán thử” không bị trừ gì.", "Pick the right reason for a ✨ badge. Guessing costs nothing.") + "</div>";
    return h + "</div>";
  }
  function ensure() {
    var s = G.UI && G.UI.stack && G.UI.stack[G.UI.stack.length - 1];
    if (!s || s.n !== "prac" || !G.UI.prac) return;
    var q = G.curQ(); if (!eligible(q)) return;
    var ans = document.getElementById("ans"); if (!ans || ans.querySelector(".v9-why")) return;
    var d = document.createElement("div"); d.innerHTML = card(q);
    var nb = ans.querySelector("[data-act=next],[data-act=twin]");
    nb ? nb.parentNode.insertBefore(d.firstChild, nb) : ans.appendChild(d.firstChild);
  }
  var busy = false;
  new MutationObserver(function () { if (busy) return; busy = true; Promise.resolve().then(function () { busy = false; try { ensure(); } catch (e) { } }); })
    .observe(document.getElementById("app") || document.body, { childList: true, subtree: true });
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-v9w]"); if (!b) return;
    e.stopPropagation();
    var q = G.curQ(); if (!q || !q.why || q.why.sel >= 0) return;
    q.why.sel = +b.getAttribute("data-v9w");
    var ok = q.why.ord.indexOf(0) === q.why.sel;
    if (ok) { X.V().why.n++; Store.save(); G.Sfx.ok && G.Sfx.ok(); } else G.Sfx.pop && G.Sfx.pop();
    var c = b.closest(".v9-why"), d = document.createElement("div"); d.innerHTML = card(q); c.parentNode.replaceChild(d.firstChild, c);
  }, true);
})();
