//# features/v91-room-timer.js — Giới hạn thời gian ở Phòng thay đồ (v9.1)
//# Tự chứa trong một hàm bọc — chạy độc lập, không cần build.
/* ===== features/v91-room-timer.js =====
   Mỗi ngày bé được ở Phòng thay đồ (phòng Tí và phòng Luna) một số phút (mặc định 5).
   Hết giờ: app tự chuyển sang Bản đồ bài học. Làm xong một bài luyện tập (từ 3 câu) được thưởng thêm phút.
   Cấu hình ở cuối file du-lieu/thoi-gian.js (window.PHONG_THAY_DO). Qua ngày mới thì tính lại từ đầu. */
(function () {
  "use strict";
  var G = window, T = G.T4.T, Store = G.Store, SC = G.SC;
  var CFG = G.PHONG_THAY_DO || {};
  if (CFG.bat === false) return;
  var BASE = (CFG.phut > 0 ? CFG.phut : 5) * 60, BONUS = (CFG.thuong >= 0 ? CFG.thuong : 2) * 60, ONLY_PASS = !!CFG.chiKhiDat;

  var today = function () { var d = new Date(); return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(); };
  function st() {
    var d = Store.d.roomT;
    if (!d || d.day !== today()) d = Store.d.roomT = { day: today(), used: 0, bonus: 0 };
    return d;
  }
  var left = function () { var d = st(); return Math.max(0, BASE + d.bonus - d.used); };
  var mmss = function (s) { return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); };
  var onHome = function () { var s = G.UI.stack[G.UI.stack.length - 1]; return !!s && s.n === "home"; };
  var outMsg = function () {
    return BONUS ? T("Hết giờ thay đồ rồi! Làm xong một bài luyện tập để được thêm " + BONUS / 60 + " phút nhé.", "Dress-up time is over! Finish a practice set to earn " + BONUS / 60 + " more minutes.")
      : T("Hết giờ thay đồ hôm nay rồi! Mình cùng học bài nhé.", "Dress-up time is over for today! Let's learn.");
  };

  function chip() {
    var c = document.getElementById("roomClock"), s = left();
    if (!onHome()) { c && c.remove(); return; }
    if (!c) {   /* nằm ngay dưới thanh tiêu đề của phòng, không che nội dung khác */
      c = document.createElement("div"); c.id = "roomClock"; c.setAttribute("aria-live", "off");
      var top = document.querySelector("#app .wtop");
      top ? top.insertAdjacentElement("afterend", c) : document.body.appendChild(c);
    }
    c.className = s <= 60 ? "low" : "";
    c.textContent = "⏳ " + T("Giờ thay đồ còn ", "Dress-up time left ") + mmss(s);
  }
  function toLessons() {
    G.UI.stack = [{ n: "map" }];
    G.render();
    G.toast(outMsg());
  }

  /* Vào phòng khi đã hết giờ: chuyển thẳng sang bản đồ bài học */
  var prevHome = SC.home;
  SC.home = function () {
    if (left() <= 0) { chip(); return toLessons(); }
    var r = prevHome.apply(this, arguments);
    chip();
    return r;
  };

  /* Rời phòng thì cất đồng hồ ngay (ONRENDER chạy đầu mỗi lần vẽ màn hình; SC.home sẽ gắn lại) */
  var prevOnRender = G.ONRENDER;
  G.ONRENDER = function () { var c = document.getElementById("roomClock"); c && c.remove(); return prevOnRender && prevOnRender.apply(this, arguments); };

  /* Đếm giờ: chỉ tính khi đang mở phòng và app đang hiển thị */
  var n = 0;
  setInterval(function () {
    if (!onHome()) { chip(); return; }
    if (document.visibilityState !== "visible") return;
    var d = st();
    d.used++;
    if (++n % 10 === 0) Store.save();
    if (left() <= 0) { Store.save(); toLessons(); } else chip();
  }, 1000);

  /* Thưởng thêm phút khi làm xong một bài luyện tập (mỗi kết quả chỉ thưởng một lần) */
  var prevResult = SC.result;
  SC.result = function (r) {
    var out = prevResult.apply(this, arguments);
    if (BONUS && r && !r._roomBonus && r.kind !== "known" && r.kind !== "quick" && (r.count || 0) >= 3 && (!ONLY_PASS || r.pass)) {
      r._roomBonus = 1;
      st().bonus += BONUS; Store.save();
      var box = document.querySelector("#app main") || document.getElementById("app"), p = document.createElement("div");
      p.className = "fb ok roombonus";
      p.textContent = T("⏳ Con được thêm " + BONUS / 60 + " phút ở Phòng thay đồ! Hôm nay còn " + mmss(left()) + ".", "⏳ You earned " + BONUS / 60 + " more minutes in the dress-up room! " + mmss(left()) + " left today.");
      var first = box.querySelector(".btn");
      first ? first.parentNode.insertBefore(p, first) : box.appendChild(p);
    }
    return out;
  };

  G.T4.roomTimer = { left: left, state: st };
})();
