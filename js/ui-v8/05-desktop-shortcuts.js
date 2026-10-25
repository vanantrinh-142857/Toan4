//# Phím tắt bàn phím khi dùng trên máy tính
//# Tự chứa trong một hàm bọc — chạy độc lập, không cần build.



/* ===== v8.5: dùng trên máy tính – phím tắt bàn phím ===== */
(function () {
  var G = globalThis, SC = G.SC, desk = function () { return window.innerWidth >= 900 && window.matchMedia && matchMedia("(hover:hover) and (pointer:fine)").matches; };
  var $1 = function (sel, root) { return (root || document).querySelector(sel); };
  var click = function (el) { if (!el || el.disabled) return false; el.click(); return true; };
  var told = 0;
  function tip() {
    if (told || !desk()) return; told = 1;
    try { if (sessionStorage.getItem("t4kb")) return; sessionStorage.setItem("t4kb", "1"); } catch (e) {}
    G.toast && G.toast(LT("💻 Mẹo: gõ số bằng bàn phím, Enter để kiểm tra, H xem gợi ý, Esc để thoát.", "💻 Tip: type numbers with the keyboard, Enter to check, H for a hint, Esc to exit."));
  }
  function onKey(e) {
    if (e.ctrlKey || e.metaKey || e.altKey || e.isComposing) return;
    var t = e.target, k = e.key;
    if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t && t.isContentEditable) { if (k === "Escape") t.blur(); return; }
    var sh = document.querySelector(".sheet-bg:last-of-type");
    if (sh) {
      if (k === "Escape") { var n = $1("[data-k=n]", sh) || $1(".x,[data-act=close]", sh); n ? click(n) : sh.remove(); e.preventDefault(); }
      else if (k === "Enter") { click($1(".btn.pri,[data-k=y],button", sh)); e.preventDefault(); }
      return;
    }
    if (document.querySelector(".overlay.open,.inkov,#inkov")) return;
    var prac = $1("main.tprac"), teach = $1("main.tteach");
    if (prac) {
      if (/^[0-9]$/.test(k)) {
        var kb = $1('.pad [data-act=key][data-k="' + k + '"]');
        if (kb) { click(kb); e.preventDefault(); tip(); return; }
        var o = document.querySelectorAll("#ans .opt"); if (o[+k - 1]) { click(o[+k - 1]); e.preventDefault(); }
        return;
      }
      if (/^[a-dA-D]$/.test(k) && !e.shiftKey) { var oo = document.querySelectorAll("#ans .opt"), i = k.toLowerCase().charCodeAt(0) - 97; if (oo[i]) { click(oo[i]); e.preventDefault(); } return; }
      if (k === "Backspace") { click($1('.pad [data-k=del]')); e.preventDefault(); return; }
      if (k === "Tab" || k === "ArrowRight") { var nx = $1('.pad [data-k=nx]'); if (nx) { click(nx); e.preventDefault(); } return; }
      if (k === "Enter" || k === " ") { if (!click($1("[data-act=next]"))) click($1("[data-act=check]")); e.preventDefault(); return; }
      if (k === "h" || k === "H") { click($1("[data-act=hint]")); return; }
      if (k === "s" || k === "S") { click($1("[data-act=sayq]")); return; }
      if (k === "Escape") { click($1("[data-act=leave]")); e.preventDefault(); return; }
      return;
    }
    if (teach) {
      if (/^[1-9]$/.test(k)) { var a = document.querySelectorAll("[data-act=tans]"); if (a[+k - 1]) { click(a[+k - 1]); e.preventDefault(); } return; }
      if (k === "ArrowRight" || k === "Enter" || k === " ") { if (!click($1("[data-act=tnext]"))) click($1("[data-act=tdone],[data-act=tprac],.btn.pri[data-act]")); e.preventDefault(); return; }
      if (k === "ArrowLeft") { click($1("[data-act=tprev]")); e.preventDefault(); return; }
      if (k === "s" || k === "S") { click($1("[data-act=say]")); return; }
      if (k === "Escape") { click($1("[data-act=back],[data-act=leave]")); e.preventDefault(); return; }
      return;
    }
    if ($1(".rx-cabs")) {
      if (k === "ArrowLeft" || k === "ArrowRight") { click($1("[data-act=v8arw][data-d='" + (k === "ArrowLeft" ? -1 : 1) + "']")); e.preventDefault(); return; }
      if (/^[1-9]$/.test(k)) { var c = document.querySelectorAll(".rx-cabs .cab"); if (c[+k - 1]) { click(c[+k - 1]); e.preventDefault(); } return; }
      if (k === "Escape") { click($1(".rx-dh .x")); return; }
    }
    if (k === "Escape" || k === "Backspace") { if (click($1("main [data-act=back],.wtop [data-act=back],.top [data-act=back]"))) { e.preventDefault(); return; } }
    if (k === "Enter") { var b = $1("main .btn.pri.block[data-act],main .btn.grn.block[data-act]"); if (b) { click(b); e.preventDefault(); return; } }
    var tabs = { r: "home", m: "map", a: "stats", s: "settings" }, key = String(k).toLowerCase();
    if (tabs[key] && !e.shiftKey) { var nb = document.querySelector('nav.bar4 [data-act=tab][data-t="' + tabs[key] + '"]'); if (nb) { click(nb); e.preventDefault(); } }
  }
  document.addEventListener("keydown", onKey);
  /* thẻ "Phím tắt" trong Cài đặt (chỉ hiện trên máy tính) */
  if (SC && SC.settings) {
    var os = SC.settings;
    SC.settings = function () {
      os.apply(this, arguments);
      var main = document.querySelector("main") || document.querySelector(".v8in"); if (!main) return;
      var c = document.createElement("section"); c.className = "card flat kb-only";
      c.innerHTML = '<h2 class="disp" style="font-size:1.25rem;margin-bottom:8px">⌨️ ' + LT("Phím tắt trên máy tính", "Keyboard shortcuts") + '</h2><p class="muted" style="font-size:.95rem;margin:0;line-height:1.6">' +
        LT("<b>0–9</b>: nhập số · <b>Backspace</b>: xóa · <b>Enter</b>: kiểm tra / câu tiếp · <b>A–D</b>: chọn đáp án · <b>H</b>: gợi ý · <b>S</b>: đọc đề · <b>Esc</b>: thoát / quay lại<br><b>←/→</b>: đổi nhân vật, lùi/tiến bài giảng · <b>R M A S</b>: Phòng, Bản đồ, Thành tích, Cài đặt", "<b>0–9</b>: type numbers · <b>Backspace</b>: delete · <b>Enter</b>: check / next · <b>A–D</b>: pick an answer · <b>H</b>: hint · <b>S</b>: read aloud · <b>Esc</b>: exit / back<br><b>←/→</b>: switch hero, previous/next lesson step · <b>R M A S</b>: Room, Map, Awards, Settings") + "</p>";
      main.appendChild(c);
    };
  }
})();
