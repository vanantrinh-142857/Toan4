//# features/theory-sections.js — Lý thuyết dài được CHIA PHẦN, mỗi phần có thanh tiến độ riêng =====
//# Tự chứa trong một hàm bọc — chạy độc lập, không cần build.
/* ===== features/theory-sections.js – Lý thuyết dài được CHIA PHẦN, mỗi phần có thanh tiến độ riêng =====
   Bài Góc 29 trang → 4 phần; Tính nhanh 19 trang → 3 phần; Phép nhân 11 trang → 2 phần.
   Bé thấy: các ô phần (✓ xong · ● đang học), tên phần hiện tại, "trang a/b" và dải chấm chỉ của phần đó. */
(function () {
  "use strict";
  var G = window, T = G.T4.T;
  var SEC = {
    angle: [[0, T("Các loại góc", "Kinds of angles")], [7, T("Đếm góc ở một đỉnh", "Counting at one vertex")], [18, T("Góc bẹt và cả hình", "Straight angles and the whole shape")], [24, T("Mẹo và thử tài", "Tips and a challenge")]],
    quick: [[0, T("Các tính chất", "The properties")], [7, T("Mẹo cộng, trừ, nhân", "Add, subtract, multiply")], [13, T("Mẹo nâng cao", "Advanced tricks")]],
    mul: [[0, T("Nhân nhiều chữ số", "Multi-digit products")], [7, T("Tính chất phép nhân", "Properties of multiplication")], [11, T("Mẹo tính nhẩm", "Mental math tricks")]],
    div: [[0, T("Cách chia", "How to divide")], [7, T("Mẹo tính nhẩm", "Mental math tricks")]]
  };
  function currentId() { var s = G.UI && G.UI.stack && G.UI.stack[G.UI.stack.length - 1]; return s && s.p && s.p.id; }
  function apply() {
    var U = G.UI && G.UI.teach; if (!U || !U.th) return;
    var id = currentId(), secs = SEC[id], dots = document.getElementById("tdots"); if (!secs || !dots) return;
    var key = id + "|" + U.i; if (dots.dataset.sec === key) return;
    var kids = [].slice.call(dots.children), total = kids.length; if (total < secs[secs.length - 1][0] + 1) return;   /* chưa vẽ xong */
    var cur = 0; secs.forEach(function (s, k) { if (U.i >= s[0]) cur = k; });
    var from = secs[cur][0], to = (secs[cur + 1] ? secs[cur + 1][0] : total) - 1;
    dots.innerHTML = kids.slice(from, to + 1).map(function (c) { return c.outerHTML; }).join("");
    dots.dataset.sec = key;
    var old = document.getElementById("secbar"); if (old) old.remove();
    var bar = document.createElement("div"); bar.id = "secbar"; bar.className = "secbar";
    bar.innerHTML = '<div class="secchips">' + secs.map(function (s, k) {
      return '<span class="sec' + (k < cur ? " done" : k === cur ? " cur" : "") + '">' + (k < cur ? "✓ " : "") + (k + 1) + (k === cur ? " · " + G.esc(s[1]) : "") + "</span>";
    }).join("") + '</div><div class="secnote">' + T("Phần ", "Part ") + (cur + 1) + "/" + secs.length + " · " + T("trang ", "page ") + (U.i - from + 1) + "/" + (to - from + 1) + "</div>";
    dots.parentNode.insertBefore(bar, dots);
  }
  var q = false;
  new MutationObserver(function () { if (q) return; q = true; Promise.resolve().then(function () { q = false; apply(); }); })
    .observe(document.getElementById("app") || document.body, { childList: true, subtree: true });
})();
