//# features/v9-notify.js — v9: THÔNG BÁO NHẮC HỌC kiểu hài hước (phụ huynh bật/tắt) =====
//# Tự chứa trong một hàm bọc — chạy độc lập, không cần build. Lời nhắc: du-lieu/v9-noi-dung.js (LOI_NHAC).
/* Mặc định TẮT. Phụ huynh bật trong Khu phụ huynh: giờ nhắc, ngày nhắc, kiểu lời nhắc, bỏ chọn câu không thích, tự viết câu.
   Gửi thông báo khi app đang đóng là việc của VỎ ANDROID (tools/android/): JS gửi cài đặt qua cầu nối window.AndroidReminder
   (setReminder(json), markStudied(ngày), requestPermission(), testNow(json)). Không có cầu nối (Windows, trình duyệt):
   cài đặt vẫn lưu, nút "Gửi thử" hiện thông báo mẫu ngay trong app, và lời chào vui hiện khi bé mở app lại. */
(function () {
  "use strict";
  var G = window, T = G.T4.T, Store = G.Store, SC = G.SC, X = G.T4.v9, esc = X.esc;
  var DAYS = [["T2", "Mo"], ["T3", "Tu"], ["T4", "We"], ["T5", "Th"], ["T6", "Fr"], ["T7", "Sa"], ["CN", "Su"]];
  function S() {
    var n = X.V().notify;
    if (n.on == null) { n.on = false; n.time = "19:30"; n.days = [1, 1, 1, 1, 1, 1, 0]; n.style = "fun"; n.stop3 = true; n.off = {}; n.custom = ""; }
    n.off = n.off || {}; return n;
  }
  function bridge() { return G.AndroidReminder || null; }
  function lib() { var n = S(), LN = G.LOI_NHAC || {}; return LN[n.style] || {}; }
  function msgs() {
    var n = S(), src = lib(), LN = G.LOI_NHAC || {}, title = X.fill(X.L2(LN.title)), out = [];
    [1, 2, 3].forEach(function (d) {
      (src[d] || []).forEach(function (p, i) { if (!n.off[n.style + d + "_" + i]) out.push({ day: d, title: title, body: X.fill(X.L2(p)) }); });
      if (n.custom) out.push({ day: d, title: title, body: n.custom });
    });
    return out;
  }
  function sync() {
    var n = S(), b = bridge(), p = { on: !!n.on, time: n.time, days: n.days, stop3: !!n.stop3, maxPerDay: 1, lastStudy: X.V().lastStudy || "", name: Store.d.name || "", msgs: msgs() };
    try { if (b && b.setReminder) b.setReminder(JSON.stringify(p)); } catch (e) { G.T4.logErr && G.T4.logErr("reminder: " + e.message); }
    return p;
  }
  X.onStudy(function (t) { try { var b = bridge(); if (b && b.markStudied) b.markStudied(t); } catch (e) { } });
  setTimeout(sync, 1500);
  function preview() {
    var m = msgs(); if (!m.length) { G.toast(T("Chưa chọn lời nhắc nào", "No messages selected")); return; }
    var x = m[Math.floor(Math.random() * m.length)], b = bridge();
    if (b && b.testNow) { try { b.testNow(JSON.stringify(x)); G.toast(T("Đã gửi thử — xem thanh thông báo của máy", "Sent — check the notification shade")); return; } catch (e) { } }
    var old = document.querySelector(".v9-ntf"); old && old.remove();
    var el = document.createElement("div"); el.className = "v9-ntf";
    el.innerHTML = '<div class="hd"><img src="anh/ui/logo.webp" alt="">Toán 4 Phiêu Lưu · ' + T("bây giờ", "now") + '</div><div class="bd"><div><b>' + esc(x.title) + "</b><p>" + esc(x.body) + '</p></div><img src="' + X.mimg("happy") + '" alt=""></div><div class="ac"><span>▶ ' + T("Học 5 phút", "Learn 5 min") + "</span><span>" + T("Để mai nhé", "Tomorrow") + "</span></div>";
    document.body.appendChild(el); el.onclick = function () { el.remove(); };
    setTimeout(function () { el.remove(); }, 7000);
  }
  function panel() {
    var n = S(), src = lib(), h = "";
    h += '<h2 class="disp">🔔 ' + T("Thông báo nhắc học", "Study reminders") + "</h2>";
    h += '<label class="v9-sw"><span><b>' + T("Nhắc " + esc(Store.d.name || "bé") + " khi cả ngày chưa học", "Remind " + esc(Store.d.name || "my child") + " if no study all day") + "</b><small>" + T("Mặc định tắt. Chỉ bố mẹ bật được.", "Off by default. Parents only.") + '</small></span><input type="checkbox" data-v9s="on"' + (n.on ? " checked" : "") + "></label>";
    h += '<div class="v9-row2"><span><b>' + T("Giờ nhắc", "Time") + "</b><small>" + T("Chỉ gửi nếu tới giờ này bé chưa làm câu nào", "Only if no question was done by then") + '</small></span><input type="time" data-v9s="time" value="' + esc(n.time) + '"></div>';
    h += '<div class="v9-row2 col"><b>' + T("Ngày nhắc", "Days") + '</b><div class="v9-days">' + DAYS.map(function (d, i) { return '<button data-v9d="' + i + '" class="' + (n.days[i] ? "on" : "") + '">' + T(d[0], d[1]) + "</button>"; }).join("") + "</div></div>";
    h += '<div class="v9-row2 col"><b>' + T("Kiểu lời nhắc", "Style") + '</b><div class="v9-seg"><button data-v9st="fun" class="' + (n.style === "fun" ? "on" : "") + '">😆 ' + T("Hài hước", "Funny") + '</button><button data-v9st="soft" class="' + (n.style === "soft" ? "on" : "") + '">🙂 ' + T("Nhẹ nhàng", "Gentle") + "</button></div></div>";
    h += '<label class="v9-sw"><span><b>' + T("Nghỉ 3 ngày liền thì thôi nhắc", "Stop after 3 missed days") + "</b><small>" + T("Chờ bé tự quay lại, không làm phiền. Tối đa 1 thông báo mỗi ngày.", "Wait for your child to come back. At most 1 per day.") + '</small></span><input type="checkbox" data-v9s="stop3"' + (n.stop3 ? " checked" : "") + "></label>";
    h += '<h3>' + T("Lời nhắc của ", "Messages from ") + esc(X.owl()) + "</h3>";
    [1, 2, 3].forEach(function (d) {
      h += '<div class="v9-mg"><b>' + [T("Ngày đầu chưa học", "First missed day"), T("Ngày thứ hai", "Second day"), T("Ngày thứ ba (lần cuối)", "Third day (last)")][d - 1] + "</b>";
      (src[d] || []).forEach(function (p, i) { var id = n.style + d + "_" + i; h += '<label class="v9-msgi"><input type="checkbox" data-v9m="' + id + '"' + (n.off[id] ? "" : " checked") + "><span>" + esc(X.fill(X.L2(p))) + "</span></label>"; });
      h += "</div>";
    });
    h += '<label class="v9-row2 col"><b>✍️ ' + T("Bố mẹ tự viết (thêm vào cả 3 ngày)", "Your own message (used on all 3 days)") + '</b><textarea data-v9s="custom" rows="2" maxlength="160" placeholder="' + T("VD: Bố đố con: 7 × 8 bằng mấy? Vào app trả lời rồi khoe bố nhé!", "e.g. Quick quiz: what is 7 × 8? Answer in the app!") + '">' + esc(n.custom) + "</textarea></label>";
    h += '<button class="btn blu block" data-v9t="1">🔔 ' + T("Gửi thử 1 thông báo", "Send a test") + "</button>";
    h += '<p class="muted" style="font-size:.85rem">' + (bridge() ? T("Lần đầu bật, điện thoại sẽ hỏi quyền gửi thông báo — bố mẹ chọn Cho phép.", "The phone will ask for notification permission once — choose Allow.") :
      T("Máy này chưa hỗ trợ thông báo khi app đóng (bản Windows / trình duyệt). Cài đặt vẫn được lưu; khi bé mở app lại, " + X.owl() + " sẽ chào vui.", "This device can't notify while the app is closed (Windows / browser). Settings are saved; " + X.owl() + " will greet your child when the app opens.")) + "</p>";
    h += '<button class="btn block" data-k="c">' + T("Xong", "Done") + "</button>";
    return h;
  }
  function open() {
    G.sheet('<div class="v9-set"></div>', function (bg, close) {
      var box = bg.querySelector(".v9-set"), draw = function () { box.innerHTML = panel(); box.querySelector("[data-k=c]").onclick = close; };
      var save = function () { Store.save(); sync(); };
      draw();
      box.addEventListener("change", function (e) {
        var t = e.target, n = S();
        if (t.dataset.v9s === "on") { n.on = t.checked; if (n.on) { var b = bridge(); try { b && b.requestPermission && b.requestPermission(); } catch (x) { } } }
        else if (t.dataset.v9s === "stop3") n.stop3 = t.checked;
        else if (t.dataset.v9s === "time" && t.value) n.time = t.value;
        else if (t.dataset.v9s === "custom") n.custom = t.value.trim().slice(0, 160);
        else if (t.dataset.v9m) { if (t.checked) delete n.off[t.dataset.v9m]; else n.off[t.dataset.v9m] = 1; }
        save();
      });
      box.addEventListener("click", function (e) {
        var b = e.target.closest("button"); if (!b) return; var n = S();
        if (b.dataset.v9d != null) { var i = +b.dataset.v9d; n.days[i] = n.days[i] ? 0 : 1; save(); draw(); }
        else if (b.dataset.v9st) { n.style = b.dataset.v9st; save(); draw(); }
        else if (b.dataset.v9t) preview();
      });
    });
  }
  G.T4.v9.reminder = { open: open, sync: sync, msgs: msgs };
  var prevSet = SC.settings;
  SC.settings = function () {
    var r = prevSet.apply(this, arguments);
    try {
      var tools = document.querySelector("#parentArea .pa-body .parts");
      if (tools && !tools.querySelector("[data-v9n]")) tools.insertAdjacentHTML("afterbegin", '<button class="btn sm block" data-v9n="1">🔔 ' + T("Thông báo nhắc học", "Study reminders") + (S().on ? " · " + T("đang bật", "on") : "") + "</button>");
    } catch (e) { }
    return r;
  };
  document.addEventListener("click", function (e) { var b = e.target.closest && e.target.closest("[data-v9n]"); if (!b) return; e.stopPropagation(); open(); });
})();
