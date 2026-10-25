//# features/ti-poses.js — Tí toàn thân đổi dáng theo tình huống =====
//# Tự chứa trong một hàm bọc — chạy độc lập, không cần build.
/* ===== features/ti-poses.js – Tí toàn thân đổi dáng theo tình huống =====
   Khi bé đang dùng nhân vật "Tí" ở thế giới bé trai, các chỗ app vẫn hiện hình Cú theo tâm trạng
   được thay bằng Tí đúng dáng:
     trả lời ĐÚNG ........... Tí nháy mắt, hai ngón tay chỉ      (khung phản hồi xanh)
     trả lời SAI / thử lại .. Tí nắm tay quyết tâm "cố lên"       (khung phản hồi đỏ)
     bấm 💡 GỢI Ý ........... Tí giơ ngón trỏ                       (khung phản hồi xanh ngọc)
     QUA BÀI ................ Tí cười to, giơ nắm tay ăn mừng     (màn kết quả)
     HOÀN HẢO (3 sao) ....... Tí mắt tròn "wow"                     (màn kết quả)
     CHƯA QUA BÀI ........... Tí quyết tâm                          (màn kết quả)
   Bé dùng nhân vật khác (Bin, Tũn, Kai) hoặc thế giới bé gái: giữ nguyên Cú.
   Muốn đổi dáng: sửa bảng POSE bên dưới. Ảnh làm bằng tools/make_pose.py. */
(function () {
  "use strict";
  var POSE = {
    ok:      "anh/nhan-vat/ti-dang/ti-dung.webp",     /* đúng */
    retry:   "anh/nhan-vat/ti-dang/ti-co-len.webp",   /* sai, thử lại, chưa qua bài */
    hint:    "anh/nhan-vat/ti-dang/ti-goi-y.webp",    /* gợi ý */
    pass:    "anh/nhan-vat/ti-dang/ti-mung.webp",     /* qua bài */
    perfect: "anh/nhan-vat/ti-dang/ti-wow.webp"       /* 3 sao */
  };
  var G = window;
  function active() {
    try { return G.themeMode() === "boy" && G.Store.d.v8 && G.Store.d.v8.boy && G.Store.d.v8.boy.nhanvat === "ti"; }
    catch (e) { return false; }
  }
  function swap(img, kind) {
    img.setAttribute("data-ti", kind);
    img.src = G.assetUrl(POSE[kind]);
    img.classList.add("ti-pose");
    if (kind === "pass" || kind === "perfect" || kind === "retry") { var p = img.parentElement; if (p && p.closest(".resc")) p.style.width = "150px"; }
  }
  function apply() {
    if (!active()) return;
    document.querySelectorAll(".fb .mascot-img:not([data-ti])").forEach(function (img) {
      var fb = img.closest(".fb"), k = fb.classList.contains("ok") ? "ok" : fb.classList.contains("no") ? "retry" : img.classList.contains("m-think") ? "hint" : null;
      if (k) swap(img, k);
    });
    document.querySelectorAll(".resc .mascot-img:not([data-ti])").forEach(function (img) {
      swap(img, img.classList.contains("m-wow") ? "perfect" : img.classList.contains("m-cheer") ? "pass" : "retry");
    });
  }
  var queued = false;
  new MutationObserver(function () {
    if (queued) return; queued = true;
    Promise.resolve().then(function () { queued = false; apply(); });   /* trước khi vẽ lên màn hình → không bị nháy hình Cú */
  }).observe(document.body, { childList: true, subtree: true });
  apply();
  window.T4 = window.T4 || {}; window.T4.tiPoses = { POSE: POSE, active: active, apply: apply };
})();
