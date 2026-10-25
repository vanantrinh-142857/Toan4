//# features/support-qr.js — ỦNG HỘ TÁC GIẢ bằng mã QR (chỉ ở phía phụ huynh) =====
/* ===== features/support-qr.js – ỦNG HỘ TÁC GIẢ =====
   Chỉ xuất hiện ở khu vực phụ huynh: (1) thẻ ở ĐẦU màn Cài đặt, hiện sẵn mã QR;
   (2) nút ở cuối "Báo cáo cho phụ huynh". Không chen vào luồng học/chơi của bé.
   Ảnh QR: anh/ung-ho-qr.png. Muốn tắt: đặt SUPPORT_ON = false. */
(function () {
  "use strict";
  var G = window, T4 = G.T4, T = T4.T, SC = G.SC, SUPPORT_ON = true, IMG = "anh/ung-ho-qr.png";
  if (!SUPPORT_ON) { T4.supportBtn = function () { return ""; }; return; }

  function sheet() {
    var h = '<h2 class="disp" style="font-size:1.4rem;margin:0 0 6px;text-align:center">💝 ' + T("Ủng hộ tác giả", "Support the author") + "</h2>" +
      '<p class="muted" style="text-align:center;margin:0 0 4px">' + T("Nếu thấy app có ích cho bé, phụ huynh có thể mời tác giả một ly cà phê ☕. App vẫn hoàn toàn miễn phí, ủng hộ là tuỳ tâm.",
        "If this app helps your child, you can buy the author a coffee ☕. The app stays completely free; support is optional.") + "</p>" +
      '<img class="sup-img" src="' + IMG + '" alt="QR Techcombank - TRINH VAN AN">' +
      '<p class="muted sup-note">' + T("Mở app ngân hàng, quét mã QR (VietQR) để chuyển khoản. Cảm ơn phụ huynh rất nhiều!", "Open your banking app and scan the VietQR code. Thank you!") + "</p>";
    G.sheet(h + '<button class="btn block" data-k="c" style="margin-top:10px">' + T("Đóng", "Close") + "</button>", function (bg, close) { bg.querySelector("[data-k=c]").onclick = close; });
  }
  /* nút nhỏ dùng ở cuối báo cáo phụ huynh */
  T4.supportBtn = function () { return '<div class="sup-link" data-sup="open">💝 ' + T("Thấy app có ích? Ủng hộ tác giả", "Find it useful? Support the author") + "</div>"; };

  function card() {
    var main = document.querySelector("main");
    if (!main || document.getElementById("supportCard")) return;
    var s = document.createElement("section"); s.className = "card flat sup-card"; s.id = "supportCard";
    s.innerHTML = '<h2 class="disp" style="font-size:1.25rem;margin:0 0 4px;text-align:center">💝 ' + T("Ủng hộ tác giả", "Support the author") + "</h2>" +
      '<p class="muted" style="font-size:.92rem;text-align:center">' + T("App hoàn toàn miễn phí. Nếu thấy có ích cho bé, phụ huynh có thể mời tác giả một ly cà phê ☕", "Completely free. If it helps your child, you can buy the author a coffee ☕") + "</p>" +
      '<img class="sup-img" data-sup="open" src="' + IMG + '" alt="QR Techcombank - TRINH VAN AN">' +
      '<p class="muted sup-note">' + T("Quét bằng app ngân hàng (VietQR). Bấm vào mã để phóng to.", "Scan with your banking app (VietQR). Tap the code to enlarge.") + "</p>";
    main.insertBefore(s, main.firstChild);
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-sup=open]"); if (!b) return;
    e.stopPropagation(); sheet();
  });
  var prev = SC.settings;
  SC.settings = function () { var r = prev.apply(this, arguments); card(); return r; };
  T4.support = { open: sheet };
})();
