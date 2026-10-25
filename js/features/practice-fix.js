//# features/practice-fix.js — Màn luyện tập: phản hồi KHÔNG bị bàn phím che =====
//# Tự chứa trong một hàm bọc — chạy độc lập, không cần build.
/* ===== features/practice-fix.js – Màn luyện tập: phản hồi KHÔNG bị bàn phím che =====
   Trước: khi trả lời SAI hoặc bấm Gợi ý, khung phản hồi nằm dưới bàn phím số nên bé không đọc được.
   Nay: bàn phím gập xuống, phản hồi hiện đầy đủ, một nút lớn "Thử lại / Nhập đáp án" mở bàn phím lại.
   (Khi đúng, app đã thay bàn phím bằng cách giải + nút Tiếp, giữ nguyên.) */
(function () {
  "use strict";
  var G = window, T = G.T4.T, reopened = null;
  function keyOf(fb) { return (G.UI && G.UI.prac ? G.UI.prac.i : "") + "|" + fb.className + "|" + fb.textContent.slice(0, 60); }
  function update() {
    var ans = document.getElementById("ans"); if (!ans) { reopened = null; return; }
    var pad = ans.querySelector(".pad"), fb = ans.querySelector(".fb:not(.ok)");
    if (!pad || !fb) { if (!fb) reopened = null; return; }
    if (pad.classList.contains("pad-fold") || reopened === keyOf(fb)) return;
    pad.classList.add("pad-fold");
    if (!ans.querySelector(".pf-retry")) {
      var hint = fb.classList.contains("info"), b = document.createElement("button");
      b.className = "btn pri block pf-retry"; b.setAttribute("data-pf", "retry");
      b.textContent = hint ? "✏️ " + T("Nhập đáp án", "Enter answer") : "↻ " + T("Thử lại", "Try again");
      pad.parentNode.insertBefore(b, pad);
    }
    /* cuộn để khung phản hồi nằm ngay dưới thanh trên cùng, thấy trọn lời giải thích + nút Thử lại */
    requestAnimationFrame(function () { try { fb.scrollIntoView({ block: "start" }); window.scrollBy(0, -78); } catch (e) { } });
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-pf=retry]"); if (!b) return;
    e.stopPropagation();
    var ans = document.getElementById("ans"), fb = ans && ans.querySelector(".fb:not(.ok)"), pad = ans && ans.querySelector(".pad");
    if (fb) reopened = keyOf(fb);
    if (pad) pad.classList.remove("pad-fold");
    b.remove();
  }, true);
  var q = false;
  new MutationObserver(function () { if (q) return; q = true; Promise.resolve().then(function () { q = false; update(); }); })
    .observe(document.getElementById("app") || document.body, { childList: true, subtree: true });
})();
