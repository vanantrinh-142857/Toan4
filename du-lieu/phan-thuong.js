/* ============================================================
   BẢNG PHẦN THƯỞNG – Toán 4 Phiêu Lưu
   Sửa bằng Notepad, khi lưu chọn mã UTF-8. Mỗi dòng là 1 món, các cột cách nhau bằng dấu |
   Dòng bắt đầu bằng # là ghi chú (app bỏ qua). Không xoá hai dấu ` ở đầu và cuối bảng.

   Cột 1  Mã         : viết liền không dấu, không trùng nhau trong cùng thế giới.
   Cột 2  Thế giới   : trai | gai | ca2 (cả hai)
   Cột 3  Chỗ đặt    : dau (đội đầu) | lung (đeo lưng) | tay (cầm tay) | nguoi (bộ đồ thay cả người, chỉ nhân vật chính)
                       ke (kệ trưng bày) | thucung | anhdd (ảnh đại diện) | nhanvat (nhân vật mới)
                       luna (đồ trong phòng thay đồ của bé gái: váy, nơ, vòng cổ, vương miện, bông tai, trâm, giày)
   Cột 4  Tên món
   Cột 5  File ảnh   : đường dẫn trong thư mục "anh". Chưa có ảnh thì app hiện khung "Sắp có".
   Cột 6  Điều kiện  : cosan                    = có sẵn từ đầu
                       bai:<mã bài>:de|vua|kho  = qua mức Dễ / Vừa / Khó của bài
                       trum:<vùng>              = thắng bài trùm của vùng (so, toan, ps, hinh)
                       sao:<số>                 = có đủ số sao
                       thi:<vùng>:<điểm>        = đạt từ <điểm> ở Phòng thi vùng (so, toan, ps, hinh)
                       thi:tong:<điểm>          = đạt từ <điểm> ở Bài thi tổng hợp
   Cột 7  Lời chúc   : hiện khi bé nhận quà (có thể để trống)

   Mã bài:  Vùng 1 (so):   place cmpnum round addsub mul quick div x10
            Vùng 2 (toan): avg unit sumdiff trees chick      (trees, chick là Toán vui – tuỳ chọn)
            Vùng 3 (ps):   frac fracdiv fracprop simplify fraccmp fraddsub fracmul fracof
            Vùng 4 (hinh): angle protract lines hbh mass area time chart datalist freq
   ============================================================ */
window.BANG_PHAN_THUONG = `
# Mã      | Thế giới | Chỗ đặt | Tên món              | File ảnh                        | Điều kiện          | Lời chúc
# ---------- THẾ GIỚI KHÁM PHÁ (bé trai) ----------
ti        | trai | nhanvat | Tí Phi Công          | nhan-vat/ti.webp                | cosan              |
# (v9.0.2: thế giới bé trai chỉ còn Tí) bin       | trai | nhanvat | Bin Sa Mạc           | nhan-vat/bin.webp               | trum:toan          | Bin xin đi cùng con trên phi thuyền!
# (v9.0.2: thế giới bé trai chỉ còn Tí) tun       | trai | nhanvat | Tũn Rừng Xanh        | nhan-vat/tun.webp               | bai:chart:de       | Tũn muốn làm bạn đồng hành của con!
# (v9.0.2: thế giới bé trai chỉ còn Tí) kai       | trai | nhanvat | Kai Lửa Đỏ           | nhan-vat/kai.webp               | trum:hinh          | Kai gia nhập đội thám hiểm!
ti1       | trai | anhdd   | Tí vui vẻ            | anh-dai-dien/ti-1.webp          | cosan              |
ti2       | trai | anhdd   | Tí nháy mắt          | anh-dai-dien/ti-2.webp          | cosan              |
ti3       | trai | anhdd   | Tí cười to           | anh-dai-dien/ti-3.webp          | cosan              |
ti4       | trai | anhdd   | Tí ngạc nhiên        | anh-dai-dien/ti-4.webp          | cosan              |
ti5       | trai | anhdd   | Tí quyết tâm         | anh-dai-dien/ti-5.webp          | cosan              |
ti6       | trai | anhdd   | Tí số một            | anh-dai-dien/ti-6.webp          | cosan              |
adbin     | trai | anhdd   | Ảnh Bin              | anh-dai-dien/ban-trai-2.webp    | bai:quick:de       | Con có thêm ảnh đại diện mới!
adtun     | trai | anhdd   | Ảnh Tũn              | anh-dai-dien/ban-trai-3.webp    | bai:sumdiff:de     |
adbo      | trai | anhdd   | Ảnh Bo               | anh-dai-dien/ban-trai-4.webp    | bai:fraccmp:de     |
adsoi     | trai | anhdd   | Ảnh Sói Con          | anh-dai-dien/ban-trai-5.webp    | bai:area:de        |
adkai     | trai | anhdd   | Ảnh Kai              | anh-dai-dien/ban-trai-6.webp    | bai:time:de        |
mupc      | trai | dau     | Mũ phi công          | do/mu-phi-cong.webp             | bai:place:de       | Con đọc số lớn giỏi lắm!
kinhbay   | trai | dau     | Kính bay             | do/kinh-bay.webp                | bai:addsub:de      | Cộng trừ chuẩn như phi công!
muth      | trai | dau     | Mũ thám hiểm         | do/mu-tham-hiem.webp            | bai:avg:de         |
mucun     | trai | dau     | Mũ cún xanh          | do/mu-cun-xanh.webp             | bai:chick:de       |
muphg     | trai | dau     | Mũ phi hành gia      | do/mu-phi-hanh-gia.webp         | bai:frac:de        |
mupt      | trai | dau     | Mũ phù thủy sao      | do/mu-phu-thuy.webp             | bai:hbh:de         |
# (v9.0.2: tạm ẩn – chưa có ảnh Tí mới) vmsao     | trai | dau     | Vương miện sao       | do/vuong-mien-sao.webp          | bai:mass:de        |
botham    | trai | nguoi   | Bộ đồ thám hiểm      | nhan-vat/ti-tham-hiem.webp      | bai:unit:de        | Sẵn sàng vào rừng!
bophg     | trai | nguoi   | Bộ đồ phi hành gia   | nhan-vat/ti-phi-hanh-gia.webp   | bai:lines:de       |
balo      | trai | lung    | Ba lô phản lực       | do/ba-lo-phan-luc.webp          | bai:simplify:de    |
canhpl    | trai | lung    | Cánh pha lê          | do/canh-pha-le.webp             | bai:fraddsub:de    |
canhrb    | trai | lung    | Cánh robot           | do/canh-robot.webp              | bai:angle:de       |
laban     | trai | tay     | La bàn vàng          | do/la-ban.webp                  | bai:round:de       | Làm tròn chuẩn ghê!
bando     | trai | tay     | Bản đồ điện tử       | do/ban-do-dien-tu.webp          | bai:div:de         |
huyhieu   | trai | ke      | Huy hiệu sao         | do/huy-hieu-sao.webp            | bai:mul:de         |
vongco    | trai | ke      | Vòng cổ cún          | do/vong-co-cun.webp             | bai:trees:de       |
dongco    | trai | ke      | Động cơ phi thuyền   | do/dong-co.webp                 | trum:so            | Phi thuyền đã có lại động cơ!
# --- Quà cho 8 bài mới (đợt 2) ---
chiakhoa  | trai | ke      | Chìa khoá vàng       | do/chia-khoa.webp               | bai:cmpnum:de |
kimcuong  | trai | ke      | Kim cương            | do/kim-cuong.webp               | bai:x10:de |
chuong    | trai | ke      | Chuông vàng          | do/chuong-vang.webp             | bai:fracdiv:de |
trangk    | trai | ke      | Trăng khuyết         | do/trang-khuyet.webp            | bai:fracprop:de |
binhpm    | trai | ke      | Bình phép màu        | do/binh-phep-mau.webp           | bai:fracof:de |
aokhoac   | trai | ke      | Áo khoác thám hiểm   | do/ao-khoac.webp                | bai:protract:de |
hongngoc  | trai | ke      | Hồng ngọc            | do/hong-ngoc.webp               | bai:datalist:de |
cobonla   | trai | ke      | Cỏ bốn lá            | do/co-bon-la.webp               | bai:freq:de |
# --- Phần thưởng lớn: Bài thi tổng hợp (thi:tong:8 = đạt từ 8 điểm) ---
cupvang   | trai | ke      | Cúp vàng Vô địch     | do/cup-vang.webp                | thi:tong:8 | Con là nhà vô địch Toán lớp 4!
# (v9.0.2: tạm ẩn – chưa có ảnh Tí mới) botruong  | trai | nguoi   | Bộ đồ Thuyền trưởng  | nhan-vat/ti-thuyen-truong.webp  | thi:tong:8 | Tí Thuyền trưởng sẵn sàng chỉ huy phi thuyền!
cuti      | trai | thucung | Cú Tí                | thu-cung/cu-ti.webp             | cosan              |
cumi      | trai | thucung | Cú Mi                | thu-cung/cu-mi.webp             | bai:fracmul:de     |
bip       | trai | thucung | Chó robot Bíp        | thu-cung/cho-robot.webp         | trum:ps            | Bíp vẫy đuôi chào con!
# ---------- THẾ GIỚI KỲ DIỆU (bé gái): phòng Luna (v9.3.0: 4 bộ đồ, mỗi bộ 6 món lấy theo thứ tự) ----------
# Chỗ đặt luôn là 'luna'. Mã món: luna-<số bộ 01..04>-<loại>. Thứ tự BẮT BUỘC trong từng bộ (dòng nào đứng trước thì phải có trước):
#   1 dress (váy) → 2 shoes (giày) → 3 necklace (vòng cổ) → 4 earrings (bông tai) → 5 bow (nơ) → 6 crown (vương miện) | flower (cài hoa) | bag (túi xách)
# Món sau chỉ mở khi đã có món trước, dù bé đã đủ điều kiện của nó. Mỗi món nhận thêm thì Luna đổi sang hình tương ứng (luna\bo\<bộ>-<bước>.webp).
# Điều kiện :nc = qua mức Nâng cao của bài. File ảnh nhỏ nằm trong anh\luna\ . Muốn đổi điều kiện, sửa cột Điều kiện (giữ nguyên thứ tự các dòng).
# --- Bộ 01: Công chúa hoa hồng ---
luna-01-dress | gai | luna | Váy Công chúa hoa hồng | luna/01-dress.webp | cosan | 
luna-01-shoes | gai | luna | Giày Công chúa hoa hồng | luna/01-shoes.webp | bai:place:de | Luna có thêm giày cho bộ Công chúa hoa hồng. Còn 4 món nữa!
luna-01-necklace | gai | luna | Vòng cổ Công chúa hoa hồng | luna/01-necklace.webp | bai:cmpnum:de | Luna có thêm vòng cổ cho bộ Công chúa hoa hồng. Còn 3 món nữa!
luna-01-earrings | gai | luna | Bông tai Công chúa hoa hồng | luna/01-earrings.webp | bai:round:de | Luna có thêm bông tai cho bộ Công chúa hoa hồng. Còn 2 món nữa!
luna-01-bow | gai | luna | Nơ Công chúa hoa hồng | luna/01-bow.webp | bai:addsub:de | Luna có thêm nơ cho bộ Công chúa hoa hồng. Còn 1 món nữa!
luna-01-crown | gai | luna | Vương miện Công chúa hoa hồng | luna/01-crown.webp | bai:mul:de | Món cuối của bộ Công chúa hoa hồng! Luna mặc đủ bộ rồi!
# --- Bộ 02: Dạ tiệc Sapphire ---
luna-02-dress | gai | luna | Váy Dạ tiệc Sapphire | luna/02-dress.webp | trum:so | Bộ Dạ tiệc Sapphire đã sẵn sàng! Gom thêm 5 món nữa để Luna mặc đủ bộ.
luna-02-shoes | gai | luna | Giày Dạ tiệc Sapphire | luna/02-shoes.webp | bai:avg:de | Luna có thêm giày cho bộ Dạ tiệc Sapphire. Còn 4 món nữa!
luna-02-necklace | gai | luna | Vòng cổ Dạ tiệc Sapphire | luna/02-necklace.webp | bai:unit:de | Luna có thêm vòng cổ cho bộ Dạ tiệc Sapphire. Còn 3 món nữa!
luna-02-earrings | gai | luna | Bông tai Dạ tiệc Sapphire | luna/02-earrings.webp | bai:sumdiff:de | Luna có thêm bông tai cho bộ Dạ tiệc Sapphire. Còn 2 món nữa!
luna-02-bow | gai | luna | Nơ Dạ tiệc Sapphire | luna/02-bow.webp | bai:trees:de | Luna có thêm nơ cho bộ Dạ tiệc Sapphire. Còn 1 món nữa!
luna-02-crown | gai | luna | Vương miện Dạ tiệc Sapphire | luna/02-crown.webp | bai:chick:de | Món cuối của bộ Dạ tiệc Sapphire! Luna mặc đủ bộ rồi!
# --- Bộ 03: Nàng thơ ngọc lục bảo ---
luna-03-dress | gai | luna | Váy Nàng thơ ngọc lục bảo | luna/03-dress.webp | trum:toan | Bộ Nàng thơ ngọc lục bảo đã sẵn sàng! Gom thêm 5 món nữa để Luna mặc đủ bộ.
luna-03-shoes | gai | luna | Giày Nàng thơ ngọc lục bảo | luna/03-shoes.webp | bai:frac:de | Luna có thêm giày cho bộ Nàng thơ ngọc lục bảo. Còn 4 món nữa!
luna-03-necklace | gai | luna | Vòng cổ Nàng thơ ngọc lục bảo | luna/03-necklace.webp | bai:fracdiv:de | Luna có thêm vòng cổ cho bộ Nàng thơ ngọc lục bảo. Còn 3 món nữa!
luna-03-earrings | gai | luna | Bông tai Nàng thơ ngọc lục bảo | luna/03-earrings.webp | bai:fracprop:de | Luna có thêm bông tai cho bộ Nàng thơ ngọc lục bảo. Còn 2 món nữa!
luna-03-bow | gai | luna | Nơ Nàng thơ ngọc lục bảo | luna/03-bow.webp | bai:simplify:de | Luna có thêm nơ cho bộ Nàng thơ ngọc lục bảo. Còn 1 món nữa!
luna-03-flower | gai | luna | Cài hoa Nàng thơ ngọc lục bảo | luna/03-flower.webp | bai:fraccmp:de | Món cuối của bộ Nàng thơ ngọc lục bảo! Luna mặc đủ bộ rồi!
# --- Bộ 04: Tiểu thư Lavender ---
luna-04-dress | gai | luna | Váy Tiểu thư Lavender | luna/04-dress.webp | trum:ps | Bộ Tiểu thư Lavender đã sẵn sàng! Gom thêm 5 món nữa để Luna mặc đủ bộ.
luna-04-shoes | gai | luna | Giày Tiểu thư Lavender | luna/04-shoes.webp | bai:angle:de | Luna có thêm giày cho bộ Tiểu thư Lavender. Còn 4 món nữa!
luna-04-necklace | gai | luna | Vòng cổ Tiểu thư Lavender | luna/04-necklace.webp | bai:protract:de | Luna có thêm vòng cổ cho bộ Tiểu thư Lavender. Còn 3 món nữa!
luna-04-earrings | gai | luna | Bông tai Tiểu thư Lavender | luna/04-earrings.webp | bai:lines:de | Luna có thêm bông tai cho bộ Tiểu thư Lavender. Còn 2 món nữa!
luna-04-bow | gai | luna | Nơ Tiểu thư Lavender | luna/04-bow.webp | bai:hbh:de | Luna có thêm nơ cho bộ Tiểu thư Lavender. Còn 1 món nữa!
luna-04-bag | gai | luna | Túi xách Tiểu thư Lavender | luna/04-bag.webp | bai:fraddsub:nc | Món cuối của bộ Tiểu thư Lavender! Luna mặc đủ bộ rồi!
`;
