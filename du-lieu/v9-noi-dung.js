/* ============================================================
   NỘI DUNG MỚI CỦA v9 – Toán 4 Phiêu Lưu (sửa được, không cần build)
   1. VI_SAO      – câu hỏi "Con đã làm thế nào?" sau khi bé làm đúng (mức Vừa, Khó)
   2. LOI_NHAC    – lời nhắc học (thông báo) và lời chào khi bé quay lại
   3. GOI_Y_O_NHA – hoạt động 10 phút cùng con ở nhà (trong Báo cáo tuần)
   Chữ {ten} được thay bằng tên bé, {cu} bằng tên Cú (Cú Tí / Cú Mi).
   ============================================================ */

/* 1. VÌ SAO – mỗi mục: m = [mẫu nhận dạng đề tiếng Việt, tiếng Anh], x = mẫu loại trừ (tuỳ chọn),
      r = lí do đúng [vi, en], w = 2 lí do sai [[vi, en], [vi, en]]. Chỉ hỏi khi đề khớp mẫu. */
window.VI_SAO = {
  sumdiff: [{
    m: [/(tất cả|[Tt]ổng)[\s\S]*(hơn|bằng nhau)/, /(in all|sum|total)[\s\S]*(more|older|equal)/i], x: /Thử thách|Challenge|chu vi|perimeter|liên tiếp|consecutive/i,
    r: ['Lấy tổng trừ hiệu, rồi chia 2 để ra số bé', 'Sum minus difference, then divide by 2 to get the smaller number'],
    w: [['Lấy tổng chia 2 là ra luôn số bé', 'Sum divided by 2 gives the smaller number straight away'], ['Lấy tổng cộng hiệu, rồi chia 2 để ra số bé', 'Sum plus difference, then divide by 2 to get the smaller number']]
  }],
  avg: [{
    m: [/Trung bình cộng của \d+ số là[\s\S]*Tìm số thứ/, /average of \d+ numbers is[\s\S]*Find the/i],
    r: ['Lấy trung bình cộng nhân với số các số để ra tổng, rồi trừ đi các số đã biết', 'Average × how many numbers = total, then subtract the numbers you know'],
    w: [['Lấy trung bình cộng trừ đi các số đã biết', 'Subtract the known numbers from the average'], ['Cộng các số đã biết rồi chia cho số các số', 'Add the known numbers and divide by how many there are']]
  }],
  unit: [{
    m: [/như nhau/, /\b(same|identical)\b/i],
    r: ['Tìm giá trị của 1 phần trước (phép chia), rồi dùng nó để tính tiếp', 'First find the value of 1 unit (divide), then use it'],
    w: [['Nhân hai số trong đề với nhau', 'Multiply the two numbers in the problem'], ['Cộng các số trong đề lại', 'Add the numbers in the problem']]
  }],
  x10: [{
    m: [/Tính nhẩm:[^:]*×/, /Mental math:[^÷]*×/i],
    r: ['Nhân với 10, 100, 1 000: viết thêm 1, 2, 3 chữ số 0 vào bên phải', '× 10, 100, 1,000: add 1, 2 or 3 zeros on the right'],
    w: [['Viết thêm chữ số 0 vào bên trái số', 'Add zeros on the left of the number'], ['Cộng thêm 10, 100 hoặc 1 000', 'Add 10, 100 or 1,000']]
  }, {
    m: [/Tính nhẩm:[^×]*:/, /Mental math:[^×]*÷/i],
    r: ['Chia cho 10, 100, 1 000: bớt đi 1, 2, 3 chữ số 0 ở bên phải', '÷ 10, 100, 1,000: remove 1, 2 or 3 zeros from the right'],
    w: [['Bớt đi các chữ số ở bên trái', 'Remove digits from the left'], ['Trừ đi 10, 100 hoặc 1 000', 'Subtract 10, 100 or 1,000']]
  }],
  round: [{
    m: [/Làm tròn số [\d\s\u00a0\u202f]+ đến hàng/, /Round [\d,\s]+ to the nearest/i],
    r: ['Nhìn chữ số ngay sau hàng cần làm tròn: từ 5 trở lên thì làm tròn lên, dưới 5 thì làm tròn xuống', 'Look at the digit just after that place: 5 or more rounds up, less than 5 rounds down'],
    w: [['Lúc nào cũng làm tròn lên', 'Always round up'], ['Chỉ cần xoá hết các chữ số phía sau', 'Just delete all the digits after it']]
  }],
  fracof: [{
    m: [/(Tìm \{\d+\/\d+\} của|\{\d+\/\d+\} (số|sợi|quãng))/, /(Find \{\d+\/\d+\} of|\{\d+\/\d+\} of the)/i], x: /còn lại|left|Thử thách|Challenge/i,
    r: ['Lấy số đó chia cho mẫu số, rồi nhân với tử số', 'Divide the number by the denominator, then multiply by the numerator'],
    w: [['Lấy số đó nhân mẫu số, rồi chia cho tử số', 'Multiply by the denominator, then divide by the numerator'], ['Lấy số đó trừ đi tử số', 'Subtract the numerator from the number']]
  }],
  simplify: [{
    m: [/Rút gọn phân số/, /Simplify/i],
    r: ['Chia cả tử số và mẫu số cho cùng một số (lớn hơn 1) đến khi không chia được nữa', 'Divide both numerator and denominator by the same number (more than 1) until you can\'t any more'],
    w: [['Chỉ chia tử số cho một số', 'Divide only the numerator'], ['Trừ cả tử số và mẫu số cho cùng một số', 'Subtract the same number from top and bottom']]
  }],
  fraccmp: [{
    m: [/(Hai cái bánh như nhau|Chọn dấu thích hợp)[\s\S]*\{\d+\/\d+\}[\s\S]*\{\d+\/\d+\}/, /(Two identical cakes|Choose the right sign)[\s\S]*\{\d+\/\d+\}/i], x: /Thử thách|Challenge/i,
    r: ['Quy đồng mẫu số rồi so sánh tử số', 'Make the denominators the same, then compare the numerators'],
    w: [['Phân số nào có mẫu số lớn hơn thì lớn hơn', 'The fraction with the bigger denominator is bigger'], ['So sánh tử số luôn, không cần quy đồng', 'Just compare the numerators, no need to match denominators']]
  }],
  fraddsub: [{
    m: [/Tính: \{\d+\/\d+\} [+−] \{\d+\/\d+\}$/, /Calculate: \{\d+\/\d+\} [+−] \{\d+\/\d+\}$/i],
    r: ['Quy đồng mẫu số (nếu khác mẫu), rồi cộng hoặc trừ tử số, giữ nguyên mẫu số', 'Match the denominators (if different), then add or subtract the numerators and keep the denominator'],
    w: [['Cộng (trừ) tử với tử, mẫu với mẫu', 'Add (subtract) top with top and bottom with bottom'], ['Giữ nguyên tử số, cộng hai mẫu số', 'Keep the numerator and add the denominators']]
  }],
  fracmul: [{
    m: [/Tính: \{\d+\/\d+\} : \{\d+\/\d+\}$/, /Calculate: \{\d+\/\d+\} ÷ \{\d+\/\d+\}$/i],
    r: ['Lấy phân số thứ nhất nhân với phân số thứ hai đảo ngược', 'Multiply the first fraction by the second fraction turned upside down'],
    w: [['Đảo ngược phân số thứ nhất rồi nhân', 'Turn the first fraction upside down, then multiply'], ['Nhân tử với tử, mẫu với mẫu', 'Multiply top by top and bottom by bottom']]
  }],
  area: [{
    m: [/(m²|dm²|cm²|mm²)[^=]*= \?/, /(m²|dm²|cm²|mm²)[^=]*= \?/],
    r: ['Hai đơn vị đo diện tích liền nhau gấp (kém) nhau 100 lần', 'Neighbouring area units are 100 times apart'],
    w: [['Hai đơn vị liền nhau gấp nhau 10 lần', 'Neighbouring units are 10 times apart'], ['Hai đơn vị liền nhau gấp nhau 1 000 lần', 'Neighbouring units are 1,000 times apart']]
  }],
  mass: [{
    m: [/(tấn|tạ|yến)[^=]*= \?/, /(tonne|quintal|ten kilograms)[^=]*= \?/i],
    r: ['1 tấn = 10 tạ = 100 yến = 1 000 kg', '1 tonne = 10 quintals = 100 × 10 kg = 1,000 kg'],
    w: [['1 tấn = 100 kg', '1 tonne = 100 kg'], ['1 tạ = 1 000 kg', '1 quintal = 1,000 kg']]
  }],
  time: [{
    m: [/thuộc thế kỉ nào\?$/, /which century/i],
    r: ['Lấy số trăm của năm rồi cộng 1 (năm tròn trăm thì giữ nguyên số trăm)', 'Take the hundreds and add 1 (a year ending in 00 keeps its hundreds)'],
    w: [['Lấy hai chữ số đầu của năm là ra thế kỉ', 'The first two digits are the century'], ['Lấy hai chữ số cuối của năm', 'Take the last two digits of the year']]
  }, {
    m: [/\d+ phút \d+ giây = \? giây/, /\d+ min(ute)?s? \d+ sec(ond)?s? = \? sec/i],
    r: ['1 phút = 60 giây: nhân số phút với 60 rồi cộng số giây', '1 minute = 60 seconds: minutes × 60, then add the seconds'],
    w: [['1 phút = 100 giây', '1 minute = 100 seconds'], ['Cộng số phút với số giây', 'Add the minutes and the seconds']]
  }],
  trees: [{
    m: [/[Qq]uanh/, /around/i],
    r: ['Trồng quanh một vòng khép kín: số cây = số khoảng', 'All the way around a closed loop: trees = gaps'],
    w: [['Số cây = số khoảng + 1', 'Trees = gaps + 1'], ['Số cây = số khoảng − 1', 'Trees = gaps − 1']]
  }]
};

/* 2. LỜI NHẮC – fun: hài hước, soft: nhẹ nhàng; 1, 2, 3 = ngày nghỉ thứ mấy. back: lời chào khi bé quay lại.
      Nguyên tắc: không dọa, không trách, không nhắc tới mất sao hay mất chuỗi. */
window.LOI_NHAC = {
  title: ['{cu} nhắn {ten} 🦉', '{cu} has a message for {ten} 🦉'],
  fun: {
    1: [
      ['{cu} đếm ngón tay chờ {ten}… đếm tới 10 là hết ngón luôn! Vào học 5 phút cho {cu} khỏi phải đếm ngón chân nhé 😆', '{cu} counted on its fingers waiting for {ten}… and ran out at 10! Come play 5 minutes so {cu} doesn\'t have to use toes 😆'],
      ['Phân số 1/2 than: “Thiếu {ten}, hôm nay mình chỉ vui được một nửa thôi!” 🍕', 'The fraction 1/2 sighs: “Without {ten}, today is only half as fun!” 🍕'],
      ['Số 7 đi trốn kỹ quá, {cu} tìm cả ngày không ra. {ten} vào tìm giúp {cu} với! 🔍', 'Number 7 is hiding so well that {cu} can\'t find it. Come help, {ten}! 🔍']
    ],
    2: [
      ['Tin khẩn từ Đảo Kho Báu: Cướp biển Số Không đang trộm sao! Chỉ {ten} mới đuổi được 🏴‍☠️', 'Urgent news from Treasure Island: Pirate Zero is stealing stars! Only {ten} can chase him away 🏴‍☠️'],
      ['Rương báu hôm nay chưa ai mở. {cu} nghe bên trong có tiếng gọi “{ten} ơi…” 🎁', 'Nobody opened the treasure chest today. {cu} hears a tiny voice inside: “{ten}…” 🎁'],
      ['Thước đo góc hỏi {cu}: “{ten} đâu rồi? Mình nằm chờ 90 độ… à nhầm, 90 phút rồi!” 📐', 'The protractor asks {cu}: “Where\'s {ten}? I\'ve waited 90 degrees… oops, 90 minutes!” 📐']
    ],
    3: [
      ['{cu} nhớ {ten} tới mức ôm bảng cửu chương ngủ quên luôn 😴 Mai mình học cùng nhau nhé!', '{cu} missed {ten} so much it fell asleep hugging the times table 😴 Let\'s learn together tomorrow!'],
      ['{cu} đã tập xong 100 cái vỗ cánh để chào {ten}. Chỉ cần {ten} mở app là {cu} biểu diễn! 🎉', '{cu} practised 100 wing flaps to greet {ten}. Just open the app and {cu} will perform! 🎉']
    ]
  },
  soft: {
    1: [['Hôm nay mình học 5 phút nhé {ten}? {cu} đã chuẩn bị 3 câu dễ thương.', 'Shall we learn for 5 minutes today, {ten}? {cu} has 3 friendly questions ready.']],
    2: [['{cu} vẫn ở đây chờ {ten}. Chỉ 3 câu khởi động thôi nhé.', '{cu} is still here for {ten}. Just 3 warm-up questions.']],
    3: [['Khi nào rảnh {ten} quay lại học cùng {cu} nhé. {cu} luôn chờ!', 'Come back whenever you\'re free, {ten}. {cu} will be waiting!']]
  },
  back: [
    ['A! {ten} đây rồi! {cu} cứ tưởng {ten} bị các con số bắt cóc 😆 {cu} nhớ {ten} lắm luôn!', 'Ah, there you are {ten}! {cu} thought the numbers had kidnapped you 😆 {cu} missed you!'],
    ['{ten} về rồi! Các con số xếp hàng chào mừng nè: 1, 2, 3… hoan hô! 🎉', '{ten} is back! The numbers lined up to cheer: 1, 2, 3… hooray! 🎉'],
    ['{cu} vừa lau sạch bảng để chờ {ten} đó. Mình làm nóng nhẹ 3 câu nhé! ✨', '{cu} just cleaned the board for {ten}. Let\'s warm up with 3 questions! ✨']
  ]
};

/* 3. HOẠT ĐỘNG Ở NHÀ – theo bài; "_" là mặc định */
window.GOI_Y_O_NHA = {
  _: ['Cho con tự đặt một bài toán từ đồ vật trong nhà (đũa, bát, kẹo) rồi đố bố mẹ giải.', 'Let your child make up a problem using things at home (chopsticks, bowls, sweets) and quiz you.'],
  frac: ['Bẻ một thanh sô-cô-la 8 miếng, cho con ăn 3 miếng rồi hỏi: “Con đã ăn mấy phần của thanh?”', 'Break a chocolate bar into 8 pieces, let your child eat 3, then ask: “What fraction did you eat?”'],
  fracprop: ['Cắt 2 cái bánh giống nhau: một cái 2 miếng, một cái 4 miếng. Hỏi con: 1/2 và 2/4 có bằng nhau không?', 'Cut two identical cakes into 2 and 4 pieces. Ask: are 1/2 and 2/4 the same?'],
  fraccmp: ['Rót nước vào 2 cốc giống nhau: 1/2 cốc và 3/4 cốc. Cho con đoán cốc nào nhiều hơn rồi kiểm tra.', 'Fill two identical cups to 1/2 and 3/4. Let your child guess which has more, then check.'],
  fracof: ['Có 12 cái kẹo, nhờ con lấy 2/3 số kẹo cho bố mẹ. Con chia 3 phần rồi lấy 2 phần.', 'With 12 sweets, ask your child to give you 2/3 of them: split into 3 groups, take 2.'],
  sumdiff: ['Đố con: “Bố và con có tất cả 50 cái kẹo, bố hơn con 10 cái.” Cho con vẽ sơ đồ đoạn thẳng vào vở rồi giải.', 'Puzzle: “Dad and you have 50 sweets in all; Dad has 10 more.” Let your child draw the line diagram and solve.'],
  avg: ['Ghi số bước chân 3 ngày của bố mẹ, nhờ con tính trung bình mỗi ngày đi bao nhiêu bước.', 'Record your steps for 3 days and ask your child to find the daily average.'],
  unit: ['Đi chợ: “3 quả trứng giá 9 000 đồng, vậy 5 quả giá bao nhiêu?” Cho con tính giá 1 quả trước.', 'At the market: “3 eggs cost 9,000 đồng; how much for 5?” Find the price of 1 first.'],
  mul: ['Đố nhanh bảng cửu chương khi đi xe hoặc lúc nấu cơm, mỗi lần 5 câu.', 'Quick times-table quiz in the car or while cooking, 5 questions at a time.'],
  div: ['Chia đều một gói kẹo cho cả nhà, hỏi con mỗi người được mấy cái và còn dư mấy cái.', 'Share a bag of sweets equally among the family: how many each, and how many left over?'],
  round: ['Xem hoá đơn siêu thị, nhờ con làm tròn tổng tiền đến hàng nghìn.', 'Look at a shopping receipt and ask your child to round the total to the nearest thousand.'],
  time: ['Hỏi con năm sinh của ông bà thuộc thế kỉ nào, và từ đó đến nay bao nhiêu năm.', 'Ask which century grandparents were born in, and how many years ago that was.'],
  mass: ['Đọc khối lượng trên bao gạo, túi đường; nhờ con đổi ra yến, tạ hoặc kg.', 'Read the weight on a rice or sugar bag and convert it to other units together.'],
  area: ['Đo mặt bàn học bằng thước, nhờ con tính diện tích theo dm² và cm².', 'Measure the desk and work out its area in dm² and cm².'],
  angle: ['Tìm trong nhà 3 góc vuông, 1 góc nhọn, 1 góc tù (góc sách, kéo mở, cánh cửa).', 'Find 3 right angles, 1 acute and 1 obtuse angle at home (book corner, scissors, door).'],
  place: ['Đọc số dân của một tỉnh thành trên báo, nhờ con nêu hàng và lớp của từng chữ số.', 'Read a city population from the news and name the place of each digit.'],
  trees: ['Đếm cột đèn hoặc cây trên một đoạn đường quen thuộc, so số cây với số khoảng cách.', 'Count the lamp posts or trees along a familiar street and compare with the number of gaps.']
};
