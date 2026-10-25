//# features/00-shared.js — features/00-shared.js =====
//# Tự chứa trong một hàm bọc — chạy độc lập, không cần build.
/* ===== features/00-shared.js =====
   Dùng chung cho mọi module trong thư mục features/: màu, hàm song ngữ T(vi, en),
   đăng ký thêm trang lý thuyết, bảng gán bài Nâng cao vào bài học chính.
   Các module khác lấy qua window.T4. */
(function () {
  "use strict";
  var LT = window.LT;
  var gs = function (n, sep) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, sep); };
  var T4 = window.T4 = {
    /* chữ song ngữ: T('tiếng Việt', 'English') */
    T: function (vi, en) { return LT(vi, en); },
    /* số có dấu cách nghìn (vi) hoặc dấu phẩy (en) */
    G: function (n) { return LT(gs(n, ' '), gs(n, ',')); },
    C: { INK: '#1F2A44', BLUE: '#2F86E8', ORANGE: '#F08A24', GREEN: '#22A06B', RED: '#E5484D', PINK: '#E8528A', GREY: '#5a6480' },
    /* thêm trang vào phần lý thuyết của một bài: T4.pushTheoryPages('mul', [{svg, say, ask}, ...]) */
    pushTheoryPages: function (id, pages) {
      var th = window.LY_THUYET[id];
      pages.forEach(function (p) { th.pages.push({ svg: p.svg, say: p.say, ask: p.ask }); });
    },
    /* bài Nâng cao nào nằm trong bài học chính nào (hiện ở mục "⭐ Nâng cao", ẩn khỏi bản đồ) */
    ADV_MAP: { place: ['cond', 'struct', 'digits'], addsub: ['seq'], mul: ['findx', 'count'], div: ['divis'] },
    ADV_IDS: {}
  };
  Object.keys(T4.ADV_MAP).forEach(function (k) { T4.ADV_MAP[k].forEach(function (i) { T4.ADV_IDS[i] = 1; }); });
})();
