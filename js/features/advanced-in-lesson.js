//# features/advanced-in-lesson.js — Gộp các bài Nâng cao vào trang bài học chính (trên "Bé đã biết"), ẩn khỏi bản đồ
//# Tự chứa trong một hàm bọc — chạy độc lập, không cần build.
/* ===== features/advanced-in-lesson.js – Gộp các bài Nâng cao vào trang bài học chính (trên "Bé đã biết"), ẩn khỏi bản đồ ===== */
(function () {
  "use strict";
  var TH = window.TH, LT = window.LT, LESSONS = window.LESSONS, SC = window.SC, Store = window.Store;
  var T4 = window.T4, T = T4.T, G = T4.G, C = T4.C;
  var INK = C.INK, BLUE = C.BLUE, ORANGE = C.ORANGE, GREEN = C.GREEN, RED = C.RED, PINK = C.PINK, GREY = C.GREY;

  var ADV_MAP = T4.ADV_MAP, advIds = T4.ADV_IDS;
  var prevLesson = SC.lesson;
  SC.lesson = function (p) {
    prevLesson.apply(this, arguments);
    var kids = ADV_MAP[p.id]; if (!kids) return;
    var steps = document.querySelector('.steps'); if (!steps) return;
    var html = '<div style="font-weight:900;margin:10px 4px 2px;color:#6B4FC7">' + T('⭐ Nâng cao', '⭐ Advanced') + '</div>';
    kids.forEach(function (id) {
      var l = LESSONS.filter(function (x) { return x.id === id; })[0]; if (!l) return;
      var pc = Store.lesson(id).pass.filter(Boolean).length, open = window.unlocked(l);
      html += '<button class="stp' + (open ? '' : ' lock') + '" data-act="lesson" data-id="' + id + '"><span class="n" style="background:#B79CFF">' + (open ? '★' : '🔒') + '</span><span class="grow"><b>' + window.esc(l.title) + '</b><small>' + window.esc(l.blurb) + '</small></span><span class="st" style="display:flex">' +
        [0, 1, 2].map(function (i) { return window.starSvg(i < pc).replace('<svg', '<svg width="22" height="22"'); }).join('') + '</span></button>';
    });
    var known = steps.querySelector('.stp.known');
    if (known) known.insertAdjacentHTML('beforebegin', html); else steps.insertAdjacentHTML('beforeend', html);
  };
  var prevZone = SC.zone;
  SC.zone = function () {
    prevZone.apply(this, arguments);
    Object.keys(advIds).forEach(function (id) { var e = document.querySelector('.lrow[data-id="' + id + '"]'); if (e) e.remove(); });
  };
})();
