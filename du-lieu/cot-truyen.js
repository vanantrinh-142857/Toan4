/* ============================================================
   CỐT TRUYỆN – Toán 4 Phiêu Lưu
   Sửa bằng Notepad (lưu UTF-8). Mỗi dòng: Mã | Thế giới (trai/gai) | Nội dung
   Trong lời dẫn bài học có thể dùng {qua} (tên món quà của bài) và {ten} (tên bé).
   Mã:
     ten-the-gioi, cu (tên bạn cú), phong (tên phòng nhân vật)
     mo1, mo2, mo3          = 3 khung truyện mở đầu
     vung:<vùng>:ten/phu/vao = tên vùng / phân môn / lời dẫn khi vào vùng   (vùng: so, toan, ps, hinh)
     vung:<vùng>:trum        = tên trùm,  vung:<vùng>:trumloi = lời trùm thách đố,  vung:<vùng>:xong = khi thắng trùm
     bai:<mã bài>            = câu dẫn của từng bài
     ket                     = đoạn kết khi thắng cả 4 trùm
   ============================================================ */
window.BANG_COT_TRUYEN = `
# ================= THẾ GIỚI KHÁM PHÁ – "Phi thuyền Tri Thức" =================
ten-the-gioi | trai | Thế giới Khám Phá
cu           | trai | Cú Tí
phong        | trai | Khoang phi thuyền
mo1 | trai | {ten} và Cú Tí lái Phi thuyền Tri Thức, chở Viên Ngọc Con Số về Lâu Đài Ánh Sáng.
mo2 | trai | Bỗng Mây Lộn Xộn ập tới, thổi tung mọi con số! Phi thuyền phải hạ cánh khẩn cấp, hành trang rơi khắp 4 vùng đất.
mo3 | trai | Cú Tí: "Đừng lo! Mỗi bài toán con làm đúng sẽ tìm lại một món đồ. Chọn món con thích trong khoang phi thuyền rồi cùng đi lấy nhé!"
vung:so:ten     | trai | Đảo Kho Báu
vung:so:phu     | trai | Số và phép tính
vung:so:vao     | trai | Rương kho báu bị khoá bằng những con số lớn. Đọc đúng số, tính đúng phép là mở được rương!
vung:so:trum    | trai | Cua Giữ Rương
vung:so:trumloi | trai | Cua Giữ Rương giơ hai càng: "Muốn lấy động cơ thì giải hết câu đố của ta!"
vung:so:xong    | trai | Cua Giữ Rương hết rối, trả lại Động cơ phi thuyền cho con!
vung:toan:ten     | trai | Rừng Thám Hiểm
vung:toan:phu     | trai | Giải toán có lời văn
vung:toan:vao     | trai | Sương mù phủ kín khu rừng. Các biển chỉ đường đều viết bằng bài toán: đọc kĩ đề như đọc bản đồ để tìm lối ra!
vung:toan:trum    | trai | Cáo Đố Chữ
vung:toan:trumloi | trai | Cáo Đố Chữ nheo mắt: "Đọc kĩ từng chữ nhé, ta hay giấu bẫy trong đề bài đấy!"
vung:toan:xong    | trai | Cáo Đố Chữ chịu thua. Bạn Bin Sa Mạc xin đi cùng đội thám hiểm!
vung:ps:ten     | trai | Trạm Đại Dương
vung:ps:phu     | trai | Phân số
vung:ps:vao     | trai | Trạm dưới biển sắp hết bình khí. Phải chia thật đều cho mọi người – đó chính là phân số!
vung:ps:trum    | trai | Bạch Tuộc Tám Phần
vung:ps:trumloi | trai | Bạch Tuộc Tám Phần vung tám xúc tu: "Chia phần cho đều thì ta mới nhường đường!"
vung:ps:xong    | trai | Bạch Tuộc vui vẻ trở lại. Chú chó robot Bíp nhảy ra theo con!
vung:hinh:ten     | trai | Xưởng Robot
vung:hinh:phu     | trai | Hình học, đo lường và biểu đồ
vung:hinh:vao     | trai | Lắp lại phi thuyền cần đúng góc, đúng cân nặng, đúng thời gian. Cùng đo thật chuẩn nào!
vung:hinh:trum    | trai | Robot Lộn Xộn
vung:hinh:trumloi | trai | Robot Lộn Xộn kêu bíp bíp: "Ốc vít của ta bị lẫn hết rồi, đo giúp ta với!"
vung:hinh:xong    | trai | Robot Lộn Xộn chạy êm ru. Bạn Kai Lửa Đỏ gia nhập đội!
bai:place    | trai | Mũ phi công bị khoá trong rương số. Đọc đúng hàng và lớp là mở được!
bai:round    | trai | La bàn vàng chỉ hiện ra khi con làm tròn số thật chuẩn.
bai:addsub   | trai | Kính bay bị rơi giữa hai cột số. Cộng, trừ cho đúng để nhặt lại nhé!
bai:mul      | trai | Huy hiệu sao nằm sau cánh cửa phép nhân.
bai:quick    | trai | Bin gửi tấm ảnh trong một câu đố tính nhanh.
bai:div      | trai | Bản đồ điện tử chỉ bật lên khi chia đúng.
bai:avg      | trai | Mũ thám hiểm treo trên cây – tìm số trung bình cộng để với tới!
bai:unit     | trai | Bộ đồ thám hiểm cất trong kho. Rút về đơn vị để biết cần bao nhiêu nhé.
bai:sumdiff  | trai | Tũn nhắn: "Tìm được hai số bí mật thì mình gửi ảnh cho bạn!"
bai:trees    | trai | Toán vui: đếm cây ven đường để tìm Vòng cổ cún.
bai:chick    | trai | Toán vui: giúp bác nông dân đếm gà và thỏ để nhận Mũ cún xanh.
bai:frac     | trai | Mũ phi hành gia trôi dưới biển. Hiểu phân số là bơi tới được!
bai:simplify | trai | Ba lô phản lực bị nặng quá – rút gọn phân số cho nhẹ đi!
bai:fraccmp  | trai | Bo đang so sánh các bình khí. Giúp Bo nhé!
bai:fraddsub | trai | Cánh pha lê ghép từ nhiều mảnh phân số.
bai:fracmul  | trai | Cú Mi bị kẹt trong bong bóng phân số. Nhân, chia đúng để cứu bạn!
bai:angle    | trai | Cánh robot cần lắp đúng góc.
bai:lines    | trai | Bộ đồ phi hành gia may từ những đường thẳng song song và vuông góc.
bai:hbh      | trai | Mũ phù thủy sao giấu trong hình bình hành.
bai:mass     | trai | Vương miện sao nặng bao nhiêu? Đổi đúng yến, tạ, tấn nhé!
bai:area     | trai | Sói Con cần lát sàn xưởng. Tính diện tích giúp bạn ấy!
bai:time     | trai | Kai hẹn giờ phóng tên lửa – đổi đúng giây, phút, thế kỉ nào!
bai:chart    | trai | Tũn vẽ biểu đồ số ốc vít. Đọc đúng biểu đồ để Tũn nhập đội!
bai:cmpnum   | trai | Hai rương kho báu ghi số rất lớn. So sánh đúng để mở rương có {qua}!
bai:x10      | trai | Máy đếm vàng nhân, chia với 10, 100, 1 000 thật nhanh. Tính nhẩm đúng là nhận {qua}!
bai:fracdiv  | trai | Chia đều lương thực cho cả đội – mỗi bạn được một phân số. Làm đúng để nhận {qua}!
bai:fracprop | trai | Hai tấm bản đồ ghi phân số khác nhau nhưng chỉ cùng một chỗ. Tìm phân số bằng nhau để lấy {qua}!
bai:fracof   | trai | Kho báu chia theo phần. Tìm đúng phân số của một số để nhận {qua}!
bai:protract | trai | Cánh cửa chỉ mở khi đo góc thật chuẩn bằng thước đo góc. {qua} ở ngay sau cửa!
bai:datalist | trai | Nhật ký thám hiểm ghi đầy số liệu. Đọc đúng dãy số liệu để tìm {qua}!
bai:freq     | trai | Đồng xu thần tung mãi không ngừng. Kiểm đếm đúng số lần để nhận {qua}!
ket | trai | Phi thuyền Tri Thức đã sửa xong! {ten}, Cú Tí và các bạn cất cánh về Lâu Đài Ánh Sáng. Mây Lộn Xộn xin lỗi, hoá thành mây trắng và xin học Toán cùng con. Con là nhà thám hiểm Toán học tài ba!
# ================= THẾ GIỚI KỲ DIỆU – "Dạ hội Ánh Sao" =================
ten-the-gioi | gai | Thế giới Kỳ Diệu
cu           | gai | Cú Mi
phong | gai | Phòng thay đồ của Luna
mo1 | gai | {ten} và Cú Mi đang chuẩn bị Dạ hội Ánh Sao ở Lâu Đài Kỳ Diệu. Cô bạn Luna sẽ mặc đồ cùng con!
mo2 | gai | Bỗng Mây Lộn Xộn bay qua, trộn tung mọi con số! Phép màu tắt ngấm, tủ đồ dạ hội biến mất khắp 4 vùng đất.
mo3 | gai | Cú Mi: "Mỗi bài toán con làm đúng sẽ thắp lại một chút phép màu và trả về một món đồ cho Luna. Chọn món con thích rồi cùng đi lấy nhé!"
vung:so:ten     | gai | Lâu Đài Con Số
vung:so:phu     | gai | Số và phép tính
vung:so:vao     | gai | Cánh cổng lâu đài có ổ khoá số. Đọc đúng, tính đúng là cổng mở!
vung:so:trum    | gai | Gương Thần Đảo Số
vung:so:trumloi | gai | Gương Thần Đảo Số lấp lánh: "Ta đảo hết các con số rồi, con sắp lại được không?"
vung:so:xong | gai | Gương Thần sáng trở lại. Một bộ váy mới hiện ra trong tủ đồ của Luna!
vung:toan:ten     | gai | Khu Rừng Phép Thuật
vung:toan:phu     | gai | Giải toán có lời văn
vung:toan:vao     | gai | Bạn Kỳ Lân gửi những câu đố bằng lời. Giải xong, cầu vồng sẽ hiện ra!
vung:toan:trum    | gai | Kỳ Lân Đố Vui
vung:toan:trumloi | gai | Kỳ Lân Đố Vui lắc bờm: "Đọc kĩ đề nhé, câu đố của ta nhiều bước lắm!"
vung:toan:xong | gai | Cầu vồng hiện ra! Một bộ váy mới bay về tủ đồ của Luna.
vung:ps:ten     | gai | Tiệm Bánh Kỳ Diệu
vung:ps:phu     | gai | Phân số
vung:ps:vao     | gai | Bánh cho khách dạ hội phải chia thật đều – đó chính là phân số!
vung:ps:trum    | gai | Bánh Kem Khổng Lồ
vung:ps:trumloi | gai | Bánh Kem Khổng Lồ rung rinh: "Chia ta cho đều thì mới được ăn!"
vung:ps:xong | gai | Bánh đã chia đều. Một bộ váy mới đến chung vui với Luna!
vung:hinh:ten     | gai | Xưởng Thiết Kế
vung:hinh:phu     | gai | Hình học, đo lường và biểu đồ
vung:hinh:vao     | gai | May váy dạ hội cần đo thật chuẩn, cắt thật đúng hình. Cùng làm nhà thiết kế nhí nhé!
vung:hinh:trum    | gai | Máy May Lộn Xộn
vung:hinh:trumloi | gai | Máy May Lộn Xộn kêu tạch tạch: "Chỉ của ta rối hết rồi, đo giúp ta với!"
vung:hinh:xong | gai | Máy May chạy êm. Bộ váy cuối đã may xong cho Luna!
bai:place | gai | Một món trang sức đang kẹt trên cổng số. Đọc đúng hàng và lớp để gỡ xuống cho Luna nhé!
bai:round | gai | Món đồ sáng lấp lánh khi con làm tròn số thật chuẩn.
bai:addsub | gai | Món đồ xinh nở ra khi con cộng, trừ đúng.
bai:mul | gai | Món đồ quý cất sau cánh cửa phép nhân.
bai:quick | gai | Một món đồ nhỏ đang đợi sau câu đố tính nhanh.
bai:div | gai | Món đồ được chia đều cho các bạn – chia đúng là nhận được!
bai:avg | gai | Món đồ hiện ra khi con tìm đúng số trung bình cộng.
bai:unit | gai | Váy dạ hội đang may dở. Rút về đơn vị để biết cần bao nhiêu vải nhé.
bai:sumdiff | gai | Món đồ giấu hai số bí mật. Tìm ra hai số là mở được.
bai:trees | gai | Toán vui: trồng hoa ven đường để tìm món đồ ẩn.
bai:chick | gai | Toán vui: đếm gà và thỏ trong vườn để nhận món đồ.
bai:frac | gai | Món đồ nằm trong túi những miếng bánh phân số.
bai:simplify | gai | Món đồ sáng hơn khi phân số gọn gàng.
bai:fraccmp | gai | Hai món đồ đang tranh nhau. So sánh phân số để biết món nào về với Luna.
bai:fraddsub | gai | Chuông ngân lên khi cộng, trừ phân số đúng, món đồ sẽ hiện ra.
bai:fracmul | gai | Món đồ bị kẹt trong hộp bánh. Nhân, chia phân số để mở hộp!
bai:angle | gai | Món đồ may theo góc. Đo góc đúng để nhận nhé!
bai:lines | gai | Món đồ may từ những đường song song và vuông góc.
bai:hbh | gai | Chìa khoá vàng có hình bình hành. Mở khoá là có món đồ mới.
bai:mass | gai | Cân vải dạ hội cho đúng. Đổi đúng yến, tạ, tấn là nhận món đồ!
bai:area | gai | Tính diện tích tấm thảm đúng để lấy món đồ trên đó nhé!
bai:time | gai | Dạ hội bắt đầu đúng giờ. Xem đồng hồ chuẩn để nhận món đồ!
bai:chart | gai | Món đồ dành cho ai đọc đúng biểu đồ.
bai:cmpnum   | gai | Hai hộp trang sức ghi số rất lớn. So sánh đúng để mở hộp có món đồ cho Luna!
bai:x10      | gai | Tiệm vải nhân, chia với 10, 100, 1 000. Tính nhẩm đúng để nhận món đồ mới!
bai:fracdiv  | gai | Chia đều bánh cho các bạn dự dạ hội – mỗi bạn được một phân số. Làm đúng là có quà!
bai:fracprop | gai | Hai công thức bánh ghi phân số khác nhau mà bằng nhau. Tìm ra để nhận món đồ!
bai:fracof   | gai | Món đồ nằm trong phần vải được cắt ra. Tìm phân số của một số để nhận nhé!
bai:protract | gai | Thợ may cần đo góc chiếc váy thật chuẩn. Đo đúng để nhận món đồ!
bai:datalist | gai | Sổ ghi chép của Luna đầy số liệu. Đọc đúng dãy số liệu để tìm món đồ!
bai:freq     | gai | Vòng quay may mắn của dạ hội! Kiểm đếm đúng số lần để nhận món đồ!
ket | gai | Phép màu đã trở lại Lâu Đài Kỳ Diệu! Dạ hội Ánh Sao bắt đầu, {ten} mặc bộ đồ con tự chọn. Mây Lộn Xộn cũng được mời, nó hứa không trộn số nữa. Con là công chúa Toán học giỏi nhất!
`;
