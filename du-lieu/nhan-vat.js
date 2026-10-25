/* ============================================================
   NHÂN VẬT VÀ VỊ TRÍ MẶC ĐỒ – Toán 4 Phiêu Lưu
   Mỗi dòng 1 nhân vật (mã phải trùng mã "nhanvat" trong phan-thuong.js). Các cột cách nhau bằng |
   Vị trí ghi 3 số "ngang, dọc, rộng" tính theo % khung ảnh nhân vật:
     ngang = tâm món đồ cách mép trái bao nhiêu % chiều rộng ảnh
     dọc   = tâm món đồ cách mép trên bao nhiêu % chiều cao ảnh
     rộng  = món đồ rộng bằng bao nhiêu % chiều rộng ảnh
   Cách dễ nhất: vào Cài đặt → "Căn chỉnh đồ (phụ huynh)", kéo món đồ vào đúng chỗ,
   app hiện sẵn dòng số để chép vào đây.
   Cột "Chính": ghi x cho nhân vật chính (mặc được bộ đồ "nguoi").
   ============================================================ */
window.BANG_NHAN_VAT = `
# Mã        | Thế giới | Đầu (ngang,dọc,rộng) | Lưng (ngang,dọc,rộng) | Tay (ngang,dọc,rộng) | Chính
ti          | trai     | 50,50,300           | 50,50,300             | 50,50,300            | x
bin         | trai     | 56,7,80              | 50,47,140             | 72,47,34             |
tun         | trai     | 52,7,84              | 50,47,140             | 86,46,34             |
kai         | trai     | 52,7,84              | 50,47,140             | 20,71,34             |
na          | gai      | 52,5,46              | 50,42,120             | 9,53,22              | x
bongtuyet   | gai      | 50,6,84              | 50,45,140             | 10,47,34             |
maytim      | gai      | 50,7,70              | 50,45,110             | 11,45,30             |
hongdao     | gai      | 50,7,80              | 50,45,130             | 10,62,34             |
`;
