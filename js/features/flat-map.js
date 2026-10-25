//# features/flat-map.js — Bản đồ GỌN: thẻ "Học tiếp" + 4 chương thu gọn (chỉ mở chương đang học) =====
//# Tự chứa trong một hàm bọc — chạy độc lập, không cần build.
/* ===== features/flat-map.js – Bản đồ GỌN: thẻ "Học tiếp" + 4 chương thu gọn (chỉ mở chương đang học) =====
   Bỏ 4 vùng đặt tên chung chung; bài hiện thẳng theo nội dung. Bé chỉ thấy: 1 thẻ "Học tiếp", 4 tiêu đề chương
   (có tiến độ), và danh sách bài của chương đang mở. "Xem tất cả bài" mở hết. Sao hiển thị thống nhất: ⭐ n/9 mỗi bài. */
(function () {
  "use strict";
  var G = window, LESSONS = G.LESSONS, SC = G.SC, Store = G.Store, T4 = G.T4, T = T4.T, advIds = T4.ADV_IDS;
  var SECT = [['so', '🧮', T('Số và phép tính', 'Numbers and operations')], ['toan', '📝', T('Toán có lời văn', 'Word problems')],
    ['ps', '🍕', T('Phân số', 'Fractions')], ['hinh', '📐', T('Hình học và đo lường', 'Geometry and measurement')]];
  var opened = null;   /* các chương đang mở (giữ trong phiên) */
  var lessonStars = function (l) { var b = Store.lesson(l.id).best; return (b[0] || 0) + (b[1] || 0) + (b[2] || 0); };
  var prevMap = SC.map;
  SC.map = function () {
    prevMap.apply(this, arguments);
    var wm = document.querySelector('.wmap'); if (!wm) return;
    document.querySelectorAll('.v8in small, .v8in div').forEach(function (e) { if (!e.children.length && /vùng đất|lands/.test(e.textContent)) e.textContent = T('Chọn bài để học', 'Pick a lesson to learn'); });
    var nx = null; try { nx = G.nextLesson(); } catch (e) { }
    if (!opened) { opened = {}; var first = nx && SECT.filter(function (s) { return s[0] === nx.reg; })[0]; opened[(first || SECT[0])[0]] = 1; }
    var h = '';
    if (nx) {
      var s = Store.lesson(nx.id), nt = !s.theory && !s.taught ? T('Học lý thuyết', 'Start with the theory') : s.pass[2] ? T('Thử thách', 'Challenge') : s.pass[1] ? T('Luyện tập mức Khó', 'Practice: Hard') : s.pass[0] ? T('Luyện tập mức Vừa', 'Practice: Medium') : T('Luyện tập mức Dễ', 'Practice: Easy');
      h += '<button class="lrow nextcard" data-act="lesson" data-id="' + nx.id + '"><span class="bn">' + T('Học tiếp', 'Continue') + '</span><span class="tx"><b>' + G.esc(nx.title) + '</b><small>' + nt + '</small></span><span class="go">▶</span></button>';
    }
    h += '<div class="mapflat">';
    SECT.forEach(function (sec) {
      var ls = LESSONS.filter(function (l) { return l.reg === sec[0] && !advIds[l.id]; }), k = 0, done = ls.filter(function (l) { return G.lessonPassed(l.id, 1); }).length,
        pct = ls.length ? Math.round(done / ls.length * 100) : 0, isOpen = !!opened[sec[0]];
      h += '<div class="chap' + (isOpen ? ' open' : '') + '" data-ch="' + sec[0] + '"><button class="chap-h" data-act="mapchap" data-id="' + sec[0] + '" aria-expanded="' + isOpen + '"><span class="ci">' + sec[1] + '</span><b>' + sec[2] + '</b><span class="cbar"><i style="width:' + pct + '%"></i></span><span class="cn">' + done + '/' + ls.length + '</span><span class="chev">▾</span></button><div class="chap-b">';
      ls.forEach(function (l) {
        var un = G.unlocked(l), pc = Store.lesson(l.id).pass.filter(Boolean).length, st = lessonStars(l);
        h += '<button class="lrow' + (un ? '' : ' lock') + (l.optional ? ' opt' : '') + '" data-act="lesson" data-id="' + l.id + '"><span class="bn">' + (l.optional ? T('Toán vui', 'Fun Math') : T('Bài ' + (++k), 'Lesson ' + k)) + '</span><span class="tx"><b>' + G.esc(l.title) + '</b><small class="st9">⭐ ' + st + '/9</small></span><span class="go">' + (un ? (pc >= 3 ? '✓' : '▶') : '🔒') + '</span></button>';
      });
      var open = G.bossOpen(sec[0]), b = Store.d.boss[sec[0]] || 0;
      h += '<button class="lrow boss' + (open ? '' : ' lock') + '" data-act="v8boss" data-id="' + sec[0] + '"><span class="bn">' + T('Trùm', 'Boss') + '</span><span class="tx"><b>' + T('Thử thách trùm', 'Boss Challenge') + '</b><small class="st9">⭐ ' + b + '/3</small></span><span class="go">' + (open ? '⚔️' : '🔒') + '</span></button></div></div>';
    });
    h += '<button class="btn sm block mapall" data-act="mapall">' + T('Xem tất cả bài', 'Show all lessons') + '</button></div>';
    wm.outerHTML = h;
  };
  G.ACT.mapchap = function (el) {
    var c = el.closest('.chap'), id = el.dataset.id; if (!c) return;
    var o = c.classList.toggle('open'); opened = opened || {}; if (o) opened[id] = 1; else delete opened[id];
    el.setAttribute('aria-expanded', o); G.Sfx && G.Sfx.tap && G.Sfx.tap();
  };
  G.ACT.mapall = function (el) {
    var all = document.querySelectorAll('.chap'), anyClosed = [].some.call(all, function (c) { return !c.classList.contains('open'); });
    opened = opened || {};
    [].forEach.call(all, function (c) { c.classList.toggle('open', anyClosed); c.querySelector('.chap-h').setAttribute('aria-expanded', anyClosed); if (anyClosed) opened[c.dataset.ch] = 1; else delete opened[c.dataset.ch]; });
    el.textContent = anyClosed ? T('Thu gọn', 'Collapse all') : T('Xem tất cả bài', 'Show all lessons');
  };
})();
