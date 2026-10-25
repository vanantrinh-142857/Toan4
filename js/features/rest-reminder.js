//# features/rest-reminder.js — Nhắc nghỉ mắt MỀM sau 20 phút học liên tục =====
//# Tự chứa trong một hàm bọc — chạy độc lập, không cần build.
/* ===== features/rest-reminder.js – Nhắc nghỉ mắt MỀM sau 20 phút học liên tục =====
   Chỉ tính lúc app đang mở VÀ bé có chạm/gõ trong 60 giây gần nhất. Không ngắt giữa lúc làm bài/thi:
   chờ bé thoát màn luyện tập mới hiện. Phụ huynh tắt/bật trong Khu vực phụ huynh. */
(function () {
  "use strict";
  var G = window, T = G.T4.T, Store = G.Store, LIMIT = 20 * 60, active = 0, lastTouch = Date.now(), snoozed = 0;
  ["pointerdown", "keydown", "touchstart"].forEach(function (ev) { document.addEventListener(ev, function () { lastTouch = Date.now(); }, true); });
  var enabled = function () { return Store.d.set.rest !== false; };
  var busy = function () { return !!document.getElementById("ans") || !!document.querySelector(".sheet-bg") || (G.UI && G.UI.stack && /^(prac|exam)/.test((G.UI.stack[G.UI.stack.length - 1] || {}).n || "")); };
  function show() {
    active = 0;
    G.sheet('<div style="text-align:center"><div style="font-size:3rem">👀</div><h2 class="disp" style="font-size:1.5rem;margin:4px 0">' + T("Nghỉ mắt một chút nhé!", "Time for an eye break!") + '</h2>' +
      '<p style="margin:0 0 12px;font-weight:700">' + T("Con học 20 phút rồi. Nhìn ra xa 2 phút, uống ngụm nước, rồi mình học tiếp.", "You have studied for 20 minutes. Look far away for 2 minutes and have some water.") + '</p>' +
      '<button class="btn pri block" data-k="r">' + T("Con nghỉ rồi", "I rested") + '</button><button class="btn block" data-k="l" style="margin-top:8px">' + T("Học thêm 10 phút", "10 more minutes") + "</button></div>",
      function (bg, close) { bg.querySelector("[data-k=r]").onclick = close; bg.querySelector("[data-k=l]").onclick = function () { active = LIMIT - 600; close(); }; });
  }
  function tick(sec) {
    if (document.visibilityState !== "visible" || Date.now() - lastTouch > 60000) return;
    active += sec;
    if (active >= LIMIT && enabled() && !busy()) show();
  }
  setInterval(function () { tick(5); }, 5000);
  var prev = G.SC.settings;
  G.SC.settings = function () {
    var r = prev.apply(this, arguments);
    var body = document.querySelector("#parentArea .pa-body");
    if (body && !body.querySelector("[data-set=rest]")) {
      var sec = document.createElement("section"); sec.className = "card flat pa-sub";
      sec.innerHTML = '<label class="sw"><input type="checkbox" data-set="rest"' + (enabled() ? " checked" : "") + '><span><b>' + T("Nhắc nghỉ mắt sau 20 phút", "Eye-break reminder after 20 minutes") + '</b><br><small class="muted">' + T("Hiện lời nhắc nhẹ khi bé học liên tục, không ngắt giữa lúc đang làm bài.", "A gentle reminder, never in the middle of a question.") + "</small></span></label>";
      body.appendChild(sec);
    }
    return r;
  };
  G.T4.rest = { tick: tick, show: show, force: function (s) { active = s; lastTouch = Date.now(); } };
})();
