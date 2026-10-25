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
# ---------- THẾ GIỚI KỲ DIỆU (bé gái): phòng thay đồ Luna ----------
# Chỗ đặt luôn là 'luna'. Mã món PHẢI trùng mã trong phòng Luna (approved-1..9 là váy; các mã khác là phụ kiện).
# File ảnh nằm trong anh\luna\ . Muốn đổi điều kiện nhận quà, sửa cột Điều kiện.
approved-7 | gai | luna | Váy Denim xinh | luna/thumb7.webp | cosan | Bộ váy mới đã vào tủ đồ của con!
bow-denim | gai | luna | Nơ tóc Denim | luna/n7_hairbow.webp | cosan | Phụ kiện đi cùng váy Denim xinh.
necklace-denim | gai | luna | Vòng cổ Denim | luna/n7_choker.webp | cosan | Phụ kiện đi cùng váy Denim xinh.
earring-denim | gai | luna | Bông tai Denim | luna/n7_earring1.webp | cosan | Phụ kiện đi cùng váy Denim xinh.
approved-5 | gai | luna | Váy Xanh lá kem | luna/thumb5.webp | trum:so | Bộ váy mới đã vào tủ đồ của con!
bow-kem | gai | luna | Nơ tóc Xanh lá kem | luna/n9_hairbow.webp | trum:so | Phụ kiện đi cùng váy Xanh lá kem.
necklace-kem | gai | luna | Vòng cổ Xanh lá kem | luna/n9_choker.webp | trum:so | Phụ kiện đi cùng váy Xanh lá kem.
earring-kem | gai | luna | Bông tai Xanh lá kem | luna/n9_earring1.webp | trum:so | Phụ kiện đi cùng váy Xanh lá kem.
brooch-kem | gai | luna | Trâm cài Xanh lá kem | luna/n9_brooch.webp | trum:so | Phụ kiện đi cùng váy Xanh lá kem.
approved-8 | gai | luna | Váy Tím lavender | luna/thumb8.webp | trum:toan | Bộ váy mới đã vào tủ đồ của con!
bow-lavender | gai | luna | Nơ tóc Tím lavender | luna/n10_hairbow.webp | trum:toan | Phụ kiện đi cùng váy Tím lavender.
necklace-lavender | gai | luna | Vòng cổ Tím lavender | luna/n10_choker.webp | trum:toan | Phụ kiện đi cùng váy Tím lavender.
earring-lavender | gai | luna | Bông tai Tím lavender | luna/n10_earring1.webp | trum:toan | Phụ kiện đi cùng váy Tím lavender.
approved-9 | gai | luna | Váy Hồng tweed | luna/thumb9.webp | trum:ps | Bộ váy mới đã vào tủ đồ của con!
bow-tweed | gai | luna | Nơ tóc Hồng tweed | luna/n11_hairbow.webp | trum:ps | Phụ kiện đi cùng váy Hồng tweed.
necklace-tweed | gai | luna | Vòng cổ Hồng tweed | luna/n11_choker.webp | trum:ps | Phụ kiện đi cùng váy Hồng tweed.
earring-tweed | gai | luna | Bông tai Hồng tweed | luna/n11_earring1.webp | trum:ps | Phụ kiện đi cùng váy Hồng tweed.
approved-3 | gai | luna | Váy Bầu trời sao | luna/thumb3.webp | trum:hinh | Bộ váy mới đã vào tủ đồ của con!
approved-6 | gai | luna | Váy Sóng ngọc trai | luna/thumb6.webp | sao:40 | Bộ váy mới đã vào tủ đồ của con!
approved-1 | gai | luna | Váy Hồng corset đen | luna/thumb1.webp | sao:80 | Bộ váy mới đã vào tủ đồ của con!
bow-corset | gai | luna | Nơ tóc Corset đen | luna/n8_hairbow.webp | sao:80 | Phụ kiện đi cùng váy Hồng corset đen.
necklace-corset | gai | luna | Vòng cổ Corset đen | luna/n8_choker.webp | sao:80 | Phụ kiện đi cùng váy Hồng corset đen.
earring-corset | gai | luna | Bông tai Corset đen | luna/n8_earring1.webp | sao:80 | Phụ kiện đi cùng váy Hồng corset đen.
brooch-corset | gai | luna | Trâm cài Corset đen | luna/n8_brooch.webp | sao:80 | Phụ kiện đi cùng váy Hồng corset đen.
approved-2 | gai | luna | Váy Bướm tím pha lê | luna/thumb2.webp | sao:120 | Bộ váy mới đã vào tủ đồ của con!
approved-4 | gai | luna | Váy Vàng kim rực rỡ | luna/thumb4.webp | thi:tong:8 | Bộ váy mới đã vào tủ đồ của con!
# ---------- Phụ kiện nhận theo từng bài ----------
earring-ruby_drop | gai | luna | Bông tai hồng ruby | luna/earring_ruby_drop.webp | bai:place:de | 
newbow | gai | luna | Nơ xanh ngọc | luna/bow.webp | bai:round:de | 
brooch-ruby | gai | luna | Trâm hồng ruby | luna/brooch_ruby.webp | bai:addsub:de | 
newneck | gai | luna | Vòng cổ cầu vồng | luna/necklace.webp | bai:mul:de | 
newshoes | gai | luna | Giày tím đính ngọc | luna/shoes.webp | bai:quick:de | 
newcrown | gai | luna | Vương miện bướm | luna/crown.webp | bai:div:de | 
earring-ruby_cluster | gai | luna | Bông tai hoa hồng | luna/earring_ruby_cluster.webp | bai:avg:de | 
pinkbow | gai | luna | Nơ pha lê | luna/oldbow.webp | bai:unit:de | 
brooch-amethyst | gai | luna | Trâm thạch anh tím | luna/brooch_amethyst.webp | bai:sumdiff:de | 
pinkneck | gai | luna | Pha lê hồng | luna/oldneck.webp | bai:trees:de | 
pinkshoes | gai | luna | Giày hồng | luna/oldshoes.webp | bai:chick:de | 
mooncrown | gai | luna | Vương miện trăng | luna/oldcrown.webp | bai:frac:de | 
earring-amethyst_long | gai | luna | Bông tai tím dài | luna/earring_amethyst_long.webp | bai:simplify:de | 
purplebow | gai | luna | Nơ tím | luna/bow_purple.webp | bai:fraccmp:de | 
brooch-frost | gai | luna | Trâm tuyết băng | luna/brooch_frost.webp | bai:fraddsub:de | 
blueneck | gai | luna | Pha lê xanh | luna/neck_blue.webp | bai:fracmul:de | 
lilacshoes | gai | luna | Giày tím | luna/shoes_lilac.webp | bai:angle:de | 
pinkcrown | gai | luna | Vương miện hồng | luna/crown_pink.webp | bai:lines:de | 
earring-amethyst_drop | gai | luna | Bông tai tím giọt | luna/earring_amethyst_drop.webp | bai:hbh:de | 
bluebow | gai | luna | Nơ xanh | luna/bow_blue.webp | bai:mass:de | 
brooch-gold | gai | luna | Trâm vàng kim | luna/brooch_gold.webp | bai:area:de | 
goldneck | gai | luna | Nắng lấp lánh | luna/neck_gold.webp | bai:time:de | 
goldshoes | gai | luna | Giày ánh vàng | luna/shoes_gold.webp | bai:chart:de | 
silvercrown | gai | luna | Vương miện bạc | luna/crown_silver.webp | bai:cmpnum:de | 
earring-frost_long | gai | luna | Bông tai tuyết dài | luna/earring_frost_long.webp | bai:x10:de | 
brooch-emerald | gai | luna | Trâm ngọc lục bảo | luna/brooch_emerald.webp | bai:fracdiv:de | 
earring-frost_star | gai | luna | Bông tai sao tuyết | luna/earring_frost_star.webp | bai:fracprop:de | 
brooch-pearl | gai | luna | Trâm ngọc trai | luna/brooch_pearl.webp | bai:fracof:de | 
earring-gold_drop | gai | luna | Bông tai vàng giọt | luna/earring_gold_drop.webp | bai:protract:de | 
earring-gold_diamond | gai | luna | Bông tai kim cương | luna/earring_gold_diamond.webp | bai:datalist:de | 
earring-emerald_star | gai | luna | Bông tai ngọc lục sao | luna/earring_emerald_star.webp | bai:freq:de | 
earring-emerald_small | gai | luna | Bông tai ngọc lục nhỏ | luna/earring_emerald_small.webp | bai:sumdiff:vua | 
earring-pearl_drop | gai | luna | Bông tai ngọc trai dài | luna/earring_pearl_drop.webp | bai:trees:vua | 
earring-pearl_pair | gai | luna | Bông tai ngọc trai xanh | luna/earring_pearl_pair.webp | bai:chick:vua | 
`;
