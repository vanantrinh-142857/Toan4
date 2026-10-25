//# features/parent-area.js — KHU VỰC PHỤ HUYNH (có cổng phép tính) =====
//# Tự chứa trong một hàm bọc — chạy độc lập, không cần build.
/* ===== features/parent-area.js – KHU VỰC PHỤ HUYNH (có cổng phép tính) =====
   Bé tự bấm được: ngôn ngữ, giọng đọc, hiệu ứng, hồ sơ, đổi thế giới.
   Sau cổng phép tính người lớn (vd. 37 × 6): sao lưu/khôi phục, đồng hồ luyện tập, mở khoá tất cả bài,
   căn chỉnh đồ, xoá tiến độ/hồ sơ, báo cáo cho phụ huynh, bản sao lưu tự động, nhật ký lỗi.
   Cổng mở 5 phút rồi tự khoá. Chặn thêm ở cấp sự kiện cho các nút nhạy cảm dù nằm ở đâu. */
(function () {
  "use strict";
  var G = window, T4 = G.T4, T = T4.T, SC = G.SC, Store = G.Store, openUntil = 0;
  var isOpen = function () { return Date.now() < openUntil; };
  var esc = function (s) { return G.esc ? G.esc(s) : String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var GATED = '[data-act=bkCode],[data-act=bkFile],[data-act=bkRestore],[data-act=tmrmode],[data-act=reset],[data-act=profDel],[data-act=v8align],[data-pa-need]';

  /* ---------- nhật ký lỗi cục bộ (50 dòng cuối) ---------- */
  function logErr(m) {
    try {
      var a = JSON.parse(localStorage.getItem("toan4pl_log") || "[]");
      a.push({ t: new Date().toISOString().slice(0, 19).replace("T", " "), m: String(m).slice(0, 220), v: (G.CONFIG && G.CONFIG.version) || "" });
      localStorage.setItem("toan4pl_log", JSON.stringify(a.slice(-50)));
    } catch (e) { }
  }
  function readLog() { try { return JSON.parse(localStorage.getItem("toan4pl_log") || "[]"); } catch (e) { return []; } }
  /* mở cho lõi ghi lỗi lưu trữ (src-core/runtime/01-store-sound.js: slog); lấy các lỗi đã xếp hàng từ lúc khởi động */
  T4.logErr = logErr; (G.__logQ || []).forEach(logErr); G.__logQ = [];
  window.addEventListener("error", function (e) { logErr((e.message || "lỗi") + " @" + String(e.filename || "").split("/").pop() + ":" + (e.lineno || 0)); });
  window.addEventListener("unhandledrejection", function (e) { logErr("promise: " + ((e.reason && e.reason.message) || e.reason)); });

  /* ---------- cổng phép tính ---------- */
  function rnd(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function gate(cb) {
    var a, b, val = "";
    function fresh() { do { a = rnd(13, 49); } while (a % 10 === 0); b = rnd(3, 9); val = ""; }
    fresh();
    function draw(bg) {
      bg.querySelector(".pg-q").innerHTML = a + " × " + b + " = <span class=\"pg-v\">" + (val || "?") + "</span>";
    }
    var keys = ["7", "8", "9", "del", "4", "5", "6", "x", "1", "2", "3", "0"];
    var html = '<h2 class="disp" style="text-align:center;font-size:1.5rem;margin:0">🔒 ' + T("Dành cho phụ huynh", "For parents") + '</h2>' +
      '<p class="muted" style="text-align:center;margin:4px 0 10px">' + T("Để tiếp tục, hãy giải phép tính:", "To continue, solve this sum:") + '</p>' +
      '<div class="pg-q"></div><div class="pg-msg"></div><div class="pg-keys">' +
      keys.map(function (k) { return '<button class="pg-k' + (k === "del" ? " del" : "") + '" data-pg="' + k + '">' + (k === "del" ? "⌫" : k === "x" ? T("Huỷ", "Cancel") : k) + "</button>"; }).join("") +
      '</div><button class="btn pri block pg-ok" data-pg="ok" style="margin-top:10px">' + T("Mở khoá", "Unlock") + "</button>";
    G.sheet(html, function (bg, close) {
      draw(bg);
      bg.addEventListener("click", function (e) {
        var k = e.target.closest && e.target.closest("[data-pg]"); if (!k) return; e.stopPropagation();
        var c = k.getAttribute("data-pg");
        if (c === "x") return close();
        if (c === "del") val = val.slice(0, -1);
        else if (c === "ok") {
          if (+val === a * b) { openUntil = Date.now() + 5 * 60 * 1000; close(); cb && cb(); return; }
          bg.querySelector(".pg-msg").textContent = T("Chưa đúng, thử phép tính mới nhé.", "Not right, here is a new sum."); fresh();
        } else if (val.length < 4) val += c;
        draw(bg);
      });
    });
  }
  T4.parentGate = gate; T4.parentOpen = isOpen;

  /* chặn mọi nút nhạy cảm khi chưa mở cổng (pha capture, chạy trước bộ xử lý của app) */
  document.addEventListener("click", function (e) {
    var el = e.target.closest ? e.target.closest(GATED + ',input[data-set=unlockAll],label.sw:has(input[data-set=unlockAll])') : null;
    if (!el || isOpen() || el.closest(".sheet-bg")) return;
    e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
    gate(function () { G.toast && G.toast(T("Đã mở khoá, bấm lại nhé.", "Unlocked. Tap again.")); });
  }, true);

  /* ---------- gom các mục nhạy cảm vào một thẻ có khoá ---------- */
  function lessonTitle(id) { var l = G.LESSONS.filter(function (x) { return x.id === id; })[0]; return l ? l.title : id; }
  function report() {
    var d = Store.d, L = G.LESSONS, started = 0, done = 0;
    L.forEach(function (l) { var s = Store.lesson(l.id); if (s.best.slice(0, 3).some(function (x) { return x > 0; })) started++; if (s.best.slice(0, 3).every(function (x) { return x > 0; })) done++; });
    var acc = d.stat.q ? Math.round(d.stat.ok / d.stat.q * 100) : 0;
    var weak = Object.keys(d.mist || {}).filter(function (k) { return d.mist[k] > 0 && L.some(function (l) { return l.id === k; }); }).sort(function (a, b) { return d.mist[b] - d.mist[a]; }).slice(0, 5);
    var errs = Object.keys(d.err || {}).filter(function (k) { return G.KIND_NAME && G.KIND_NAME[k]; }).sort(function (a, b) { return d.err[b] - d.err[a]; }).slice(0, 3);
    var h = '<h2 class="disp" style="font-size:1.4rem;margin:0 0 6px">📊 ' + T("Báo cáo cho phụ huynh", "Parent report") + " · " + esc(d.name || T("bé", "child")) + "</h2>" +
      '<div class="pa-kv"><span>⭐ ' + T("Tổng sao", "Stars") + "</span><b>" + (d.stars || 0) + "</b></div>" +
      '<div class="pa-kv"><span>🔥 ' + T("Chuỗi ngày học", "Day streak") + "</span><b>" + (d.streak.n || 0) + "</b></div>" +
      '<div class="pa-kv"><span>✅ ' + T("Làm đúng", "Correct") + "</span><b>" + acc + "% (" + d.stat.ok + "/" + d.stat.q + ")</b></div>" +
      '<div class="pa-kv"><span>📚 ' + T("Bài đã qua cả 3 mức", "Lessons cleared (3 levels)") + "</span><b>" + done + " / " + L.length + "</b></div>" +
      '<div class="pa-kv"><span>▶ ' + T("Bài đã bắt đầu", "Lessons started") + "</span><b>" + started + "</b></div>";
    h += "<h3 style=\"margin:12px 0 4px\">" + T("Bài cần luyện thêm", "Needs more practice") + "</h3>" +
      (weak.length ? "<ol style=\"margin:0 0 0 20px;padding:0\">" + weak.map(function (k) { return "<li>" + esc(lessonTitle(k)) + " <span class=\"muted\">(" + T("sai ", "missed ") + d.mist[k] + ")</span></li>"; }).join("") + "</ol>" : '<p class="muted" style="margin:0">' + T("Chưa có bài nào sai nhiều.", "No lesson with many mistakes yet.") + "</p>");
    h += "<h3 style=\"margin:12px 0 4px\">" + T("Dạng lỗi hay gặp", "Common kinds of mistakes") + "</h3>" +
      (errs.length ? "<ul style=\"margin:0 0 0 18px;padding:0\">" + errs.map(function (k) { return "<li>" + esc(G.KIND_NAME[k]) + " <span class=\"muted\">(" + d.err[k] + ")</span></li>"; }).join("") + "</ul>" : '<p class="muted" style="margin:0">' + T("Chưa ghi nhận.", "Nothing recorded yet.") + "</p>");
    h += T4.supportBtn ? T4.supportBtn() : "";
    G.sheet(h + '<button class="btn block" data-k="c" style="margin-top:12px">' + T("Đóng", "Close") + "</button>", function (bg, close) { bg.querySelector("[data-k=c]").onclick = close; });
  }
  function backupsSheet() {
    var list = Store.backups();
    var h = '<h2 class="disp" style="font-size:1.4rem;margin:0 0 4px">💾 ' + T("Bản sao lưu tự động", "Automatic backups") + "</h2>" +
      '<p class="muted" style="margin:0 0 8px">' + T("App tự lưu một bản mỗi ngày và giữ 3 bản gần nhất ngay trong máy. Dùng khi dữ liệu bị mất hoặc hỏng.", "The app saves one copy a day and keeps the latest 3 on this device.") + "</p>";
    h += list.length ? list.map(function (b) {
      return '<div class="pa-bk"><div><b>' + b.at.slice(0, 10) + "</b> " + b.at.slice(11, 16) + '<br><span class="muted">' + esc(b.names.join(", ") || "—") + " · ⭐ " + b.stars + '</span></div><button class="btn sm" data-bk="' + b.slot + '">' + T("Khôi phục", "Restore") + "</button></div>";
    }).join("") : '<p class="muted">' + T("Chưa có bản nào (sẽ có sau lần học đầu tiên).", "None yet (made after the first lesson).") + "</p>";
    G.sheet(h + '<button class="btn block" data-k="c" style="margin-top:10px">' + T("Đóng", "Close") + "</button>", function (bg, close) {
      bg.querySelector("[data-k=c]").onclick = close;
      [].forEach.call(bg.querySelectorAll("[data-bk]"), function (b) {
        b.onclick = function () {
          var slot = +b.getAttribute("data-bk");
          close(); G.ask(T("Khôi phục bản sao lưu này? Tiến độ hiện tại sẽ bị thay.", "Restore this backup? Current progress will be replaced."), function () {
            try { Store.restoreBackup(slot); G.toast(T("Đã khôi phục", "Restored")); G.UI.stack = [{ n: "home" }]; G.render(); } catch (e) { G.toast(String(e.message || e)); }
          }, T("Khôi phục", "Restore"));
        };
      });
    });
  }
  function logSheet() {
    var a = readLog().slice().reverse();
    var h = '<h2 class="disp" style="font-size:1.4rem;margin:0 0 6px">🛠 ' + T("Nhật ký lỗi", "Error log") + " (" + a.length + ")</h2>" +
      '<p class="muted" style="margin:0 0 6px">' + T("Chỉ lưu trong máy. Nếu app chạy không đúng, chụp màn hình này gửi cho người phát triển.", "Stored on this device only.") + "</p>" +
      (a.length ? '<div class="pa-log">' + a.map(function (x) { return "<div><b>" + esc(x.t) + "</b> v" + esc(x.v) + "<br>" + esc(x.m) + "</div>"; }).join("") + "</div>" : '<p>' + T("Chưa có lỗi nào. 👍", "No errors. 👍") + "</p>");
    G.sheet(h + '<div class="row" style="margin-top:10px"><button class="btn grow" data-k="c">' + T("Đóng", "Close") + '</button><button class="btn grow" data-k="x">' + T("Xoá nhật ký", "Clear") + "</button></div>", function (bg, close) {
      bg.querySelector("[data-k=c]").onclick = close;
      bg.querySelector("[data-k=x]").onclick = function () { localStorage.removeItem("toan4pl_log"); close(); G.toast(T("Đã xoá", "Cleared")); };
    });
  }

  function build() {
    var main = document.querySelector("main"); if (!main || document.getElementById("parentArea")) return;
    var secs = [].slice.call(main.children), find = function (sel) { return secs.filter(function (s) { return s.querySelector(sel); })[0]; };
    var box = document.createElement("section"); box.className = "card flat pa"; box.id = "parentArea";
    box.innerHTML = '<h2 class="disp" style="font-size:1.25rem;margin:0 0 4px">🔒 ' + T("Khu vực phụ huynh", "Parent area") + "</h2>" +
      '<p class="muted pa-hint" style="margin:0 0 8px;font-size:.92rem">' + T("Cần giải một phép tính người lớn để mở.", "Solve a grown-up sum to open.") + "</p>" +
      '<ul class="pa-list">' + [T("Sao lưu và khôi phục tiến độ", "Back up and restore progress"), T("Đồng hồ khi luyện tập", "Practice timer"), T("Báo cáo điểm yếu của bé", "Report on weak spots"), T("Bản sao lưu tự động, nhật ký lỗi", "Auto backups, error log"), T("Mở khoá tất cả bài, căn chỉnh đồ", "Unlock all lessons, align items"), T("Xoá toàn bộ tiến độ", "Delete all progress")].map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ul>" +
      '<button class="btn pri block pa-toggle" data-pa="toggle">🔓 ' + T("Mở khu vực phụ huynh", "Open parent area") + "</button>" +
      '<div class="pa-body" hidden></div>';
    var body = box.querySelector(".pa-body");
    var tools = '<div class="parts" style="margin-bottom:10px"><button class="btn sm block" data-pa="report">📊 ' + T("Báo cáo cho phụ huynh", "Parent report") + "</button>" +
      '<button class="btn sm block" data-pa="backups">💾 ' + T("Bản sao lưu tự động", "Automatic backups") + "</button>" +
      '<button class="btn sm block" data-pa="log">🛠 ' + T("Nhật ký lỗi", "Error log") + " (" + readLog().length + ")</button></div>";
    body.insertAdjacentHTML("beforeend", tools);
    var al = main.querySelector("[data-act=v8align]"); if (al) { al.parentNode.removeChild(al); body.appendChild(al); al.style.marginBottom = "10px"; }
    ["[data-act=bkCode]", "[data-act=tmrmode]"].forEach(function (sel) { var s = find(sel); if (s) { body.appendChild(s); s.classList.add("pa-sub"); } });
    var ul = main.querySelector("input[data-set=unlockAll]"), ulab = ul && ul.closest("label.sw");
    if (ulab) { var w = document.createElement("section"); w.className = "card flat pa-sub"; ulab.parentNode.removeChild(ulab); w.appendChild(ulab); body.appendChild(w); }
    var rs = find("[data-act=reset]"); if (rs) { body.appendChild(rs); rs.classList.add("pa-sub"); }
    var anchor = main.querySelector(".kb-only"); main.insertBefore(box, anchor || null);
  }
  function toggle(open) {
    var box = document.getElementById("parentArea"); if (!box) return;
    var body = box.querySelector(".pa-body"), btn = box.querySelector(".pa-toggle");
    if (open) { body.hidden = false; box.querySelector(".pa-list").hidden = true; box.querySelector(".pa-hint").hidden = true; btn.setAttribute("data-pa", "lock"); btn.textContent = "🔒 " + T("Khoá lại", "Lock again"); }
    else { body.hidden = true; box.querySelector(".pa-list").hidden = false; box.querySelector(".pa-hint").hidden = false; btn.setAttribute("data-pa", "toggle"); btn.innerHTML = "🔓 " + T("Mở khu vực phụ huynh", "Open parent area"); openUntil = 0; }
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-pa]"); if (!b) return;
    var k = b.getAttribute("data-pa");
    if (k === "toggle") { e.stopPropagation(); isOpen() ? toggle(true) : gate(function () { toggle(true); }); }
    else if (k === "lock") { e.stopPropagation(); toggle(false); }
    else if (k === "report") { e.stopPropagation(); report(); }
    else if (k === "backups") { e.stopPropagation(); backupsSheet(); }
    else if (k === "log") { e.stopPropagation(); logSheet(); }
  });
  var prev = SC.settings;
  SC.settings = function () { var r = prev.apply(this, arguments); build(); if (isOpen()) toggle(true); return r; };
  T4.parent = { gate: gate, report: report, logErr: logErr, readLog: readLog };
})();
