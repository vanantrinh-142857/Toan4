//# features/room-tidy.js — Phòng nhân vật (thế giới bé trai) gọn hơn, nút tủ dạng 3D =====
//# Tự chứa trong một hàm bọc — chạy độc lập, không cần build.
/* ===== features/room-tidy.js – Phòng nhân vật (thế giới bé trai) gọn hơn, nút tủ dạng 3D =====
   1) Bỏ dải "kệ" (mỗi món đã giành là một ô vuông) đang đè lên nhân vật; món trên kệ vẫn xem trong tủ "Kệ".
   2) Mỗi nút tủ là ô 3D bóng, bên trong là ẢNH MÓN THẬT thay cho emoji:
        Nhân vật → ảnh đại diện đang dùng · Mũ / Đeo lưng / Cầm tay / Thú cưng → món đang dùng (chưa mặc thì món mẫu)
        Bộ đồ → bộ đồ đang mặc hoặc áo khoác · Kệ → cúp vàng + số món đã giành.
   Màu từng ô và kích thước: styles/92-room-tidy.css. */
(function () {
  "use strict";
  var G = window, V8 = G.V8 || {};
  var MAU = {   /* nếu chưa mặc gì: ảnh mẫu cho từng tủ */
    dau: "do/mu-phi-cong.webp", nguoi: "do/ao-khoac.webp", lung: "do/ba-lo-phan-luc.webp",
    tay: "do/la-ban.webp", thucung: "thu-cung/cu-ti.webp", ke: "do/cup-vang.webp", nv: "anh-dai-dien/ti-1.webp"
  };
  function rw(id) { return (V8.RW || []).filter(function (r) { return r.id === id && r.mode === "boy"; })[0]; }
  function iconFor(c, o) {
    var r = null;
    if (c === "nv") r = rw(o.anhdd);
    else if (c === "dau" || c === "lung" || c === "tay" || c === "thucung" || c === "nguoi") r = o[c] ? rw(o[c]) : null;
    if (c === "nguoi") return MAU.nguoi;   /* ảnh bộ đồ là cả người → quá nhỏ trong ô; dùng áo khoác làm biểu tượng */
    return r ? r.img : MAU[c];
  }
  function tidy() {
    if (G.themeMode() !== "boy") return;
    var st = document.querySelector(".rx .rm-stage"); if (!st) return;
    var o = G.Store.d.v8 && G.Store.d.v8.boy || {};
    var sh = st.querySelector(".shelf"), nKe = sh ? sh.children.length : 0;
    if (sh) sh.remove();
    document.querySelectorAll(".rx .cab").forEach(function (b) {
      var c = b.getAttribute("data-c"), dr = b.querySelector(".dr"); if (!dr || dr.querySelector("img")) return;
      b.classList.add("cab3d", "c-" + c);
      dr.innerHTML = '<img src="' + G.assetUrl("anh/" + iconFor(c, o)) + '" alt="">';
      if (c === "ke" && nKe) dr.insertAdjacentHTML("beforeend", '<i class="cnt">' + nKe + "</i>");
    });
  }
  var prev = G.SC.home;
  G.SC.home = function () { var r = prev.apply(this, arguments); tidy(); return r; };
  window.T4 = window.T4 || {}; window.T4.roomTidy = { tidy: tidy, MAU: MAU };
})();
