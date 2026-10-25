/* ============================================================
   TỦ ĐỒ CỦA TÍ – ẢNH TRỌN BỘ (v9.0.2)
   Thế giới bé trai chỉ có Tí. Mỗi món là MỘT ẢNH Tí đang đội/đeo/cầm món đó (AI vẽ liền khối, cắt theo biên dạng).
   Cấu trúc: TU_DO_TI[bộ đồ][mã món] = [ảnh dáng 1, ảnh dáng 2, ...]   (đường dẫn tính từ thư mục anh/)
     - bộ đồ: "" = áo phi công mặc định, "botham" = thám hiểm, "bophg" = phi hành gia (mã trong phan-thuong.js)
     - mã món "" = không đội/cầm gì
   Thiếu ảnh cho bộ đồ đang mặc thì dùng ảnh của áo phi công. Bé chạm vào Tí để đổi dáng.
   Mỗi lúc Tí chỉ mang MỘT món (mũ, đồ đeo lưng hoặc đồ cầm tay).
   Thêm ảnh: cắt nền trong suốt, cao 560 px, chân cách đáy 10 px, thân ở giữa khung; thêm đường dẫn vào đây.
   ============================================================ */
window.TU_DO_TI = {
  "": {   // Áo phi công (mặc định)
    "": ["nhan-vat/ti.webp"],
    "mupc": ["nhan-vat/ti-bo/six_a_1.webp", "nhan-vat/ti-bo/cheer_1.webp"],
    "mupt": ["nhan-vat/ti-bo/six_a_2.webp", "nhan-vat/ti-bo/cheer_2.webp"],
    "muth": ["nhan-vat/ti-bo/six_a_3.webp"],
    "laban": ["nhan-vat/ti-bo/cheer_5.webp"],
    "mucun": ["nhan-vat/ti-bo/cheer_3.webp"],
    "balo": ["nhan-vat/ti-bo/six_a_5.webp"],
    "kinhbay": ["nhan-vat/ti-bo/cheer_6.webp"],
    "canhrb": ["nhan-vat/ti-bo/six_a_6.webp"],
    "canhpl": ["nhan-vat/ti-bo/cheer_4.webp"],
    "muphg": ["nhan-vat/ti-bo/adven_6.webp", "nhan-vat/ti-bo/chibi_5.webp"],
    "bando": ["nhan-vat/ti-bo/chibi_9.webp"],
  },
  "botham": {   // Bộ đồ thám hiểm
    "": ["nhan-vat/ti-tham-hiem.webp"],
    "mupc": ["nhan-vat/ti-bo/adven_1.webp", "nhan-vat/ti-bo/chibi_1.webp"],
    "mupt": ["nhan-vat/ti-bo/adven_2.webp", "nhan-vat/ti-bo/chibi_2.webp"],
    "muth": ["nhan-vat/ti-bo/adven_3.webp"],
    "laban": ["nhan-vat/ti-bo/chibi_3.webp"],
    "mucun": ["nhan-vat/ti-bo/adven_4.webp", "nhan-vat/ti-bo/chibi_4.webp"],
    "balo": ["nhan-vat/ti-bo/adven_5.webp", "nhan-vat/ti-bo/chibi_6.webp"],
    "canhpl": ["nhan-vat/ti-bo/adven_7.webp", "nhan-vat/ti-bo/chibi_8.webp"],
    "canhrb": ["nhan-vat/ti-bo/chibi_7.webp"],
    "bando": ["nhan-vat/ti-bo/chibi_9.webp"],
  },
  "bophg": {   // Bộ đồ phi hành gia
    "": ["nhan-vat/ti-phi-hanh-gia.webp"],
    "muphg": ["nhan-vat/ti-bo/adven_6.webp", "nhan-vat/ti-bo/chibi_5.webp"],
  },
};
