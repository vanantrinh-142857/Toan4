/* BÀI TOÁN THỰC TẾ – Toán 4 Phiêu Lưu v9.2 (đã duyệt 19/11/2026). Sinh tự động, sửa bằng Notepad cũng được (lưu UTF-8).
   items: 66 bài thực tế (nhóm A–F) + 36 bài hình học theo 12 chuỗi Dễ → Vừa → Khó.
   tier = mức Dễ/Vừa/Khó trong luyện tập; rank = mức trong ngân hàng Nâng cao (adv). */
window.BAI_THUC_TE = {
"groups": [
{
"id": "A",
"icon": "🏯",
"ten": {
"vi": "Lịch sử – văn hóa",
"en": "History and culture"
}
},
{
"id": "B",
"icon": "🔬",
"ten": {
"vi": "Khoa học tự nhiên",
"en": "Nature and science"
}
},
{
"id": "C",
"icon": "🚀",
"ten": {
"vi": "Kỹ thuật – công nghệ",
"en": "Engineering and technology"
}
},
{
"id": "D",
"icon": "🏠",
"ten": {
"vi": "Đời sống hằng ngày",
"en": "Everyday life"
}
},
{
"id": "E",
"icon": "🗺️",
"ten": {
"vi": "Bản đồ, số liệu, đo lường",
"en": "Maps, data and measuring"
}
},
{
"id": "F",
"icon": "⭐",
"ten": {
"vi": "Nâng cao",
"en": "Challenge"
}
}
],
"chains": [
{
"id": "H1",
"ten": {
"vi": "Lát gạch phòng",
"en": "Tiling a room"
},
"bai": [
"H1a",
"H1b",
"H1c"
]
},
{
"id": "H2",
"ten": {
"vi": "Rào vườn",
"en": "Fencing a garden"
},
"bai": [
"H2a",
"H2b",
"H2c"
]
},
{
"id": "H3",
"ten": {
"vi": "Khung ảnh",
"en": "A photo frame"
},
"bai": [
"H3a",
"H3b",
"H3c"
]
},
{
"id": "H4",
"ten": {
"vi": "Chạy quanh sân trường",
"en": "Running round the playground"
},
"bai": [
"H4a",
"H4b",
"H4c"
]
},
{
"id": "H5",
"ten": {
"vi": "Góc trên mặt đồng hồ",
"en": "Angles on a clock"
},
"bai": [
"H5a",
"H5b",
"H5c"
]
},
{
"id": "H6",
"ten": {
"vi": "Song cửa sổ",
"en": "Window bars"
},
"bai": [
"H6a",
"H6b",
"H6c"
]
},
{
"id": "H7",
"ten": {
"vi": "Gấp hộp giấy",
"en": "Folding a paper box"
},
"bai": [
"H7a",
"H7b",
"H7c"
]
},
{
"id": "H8",
"ten": {
"vi": "Cửa kính",
"en": "Glass windows"
},
"bai": [
"H8a",
"H8b",
"H8c"
]
},
{
"id": "H9",
"ten": {
"vi": "Phòng khách và bếp",
"en": "Living room and kitchen"
},
"bai": [
"H9a",
"H9b",
"H9c"
]
},
{
"id": "H10",
"ten": {
"vi": "Từ chu vi tìm diện tích",
"en": "From perimeter to area"
},
"bai": [
"H10a",
"H10b",
"H10c"
]
},
{
"id": "H11",
"ten": {
"vi": "Hình thoi trên khăn trải bàn",
"en": "Rhombuses on a tablecloth"
},
"bai": [
"H11a",
"H11b",
"H11c"
]
},
{
"id": "H12",
"ten": {
"vi": "Lối đi trong vườn rau",
"en": "Paths in a vegetable garden"
},
"bai": [
"H12a",
"H12b",
"H12c"
]
}
],
"items": [
{
"id": "A1",
"group": "A",
"lesson": "time",
"tier": 1,
"adv": false,
"q": {
"vi": "Năm 938, Ngô Quyền đánh tan quân Nam Hán trên sông Bạch Đằng. Năm 938 thuộc thế kỉ thứ mấy?",
"en": "In 938, Ngô Quyền defeated the Southern Han army on the Bạch Đằng River. Which century is 938 in?"
},
"parts": [
{
"kind": "choice",
"opts": {
"vi": [
"Thế kỉ IX",
"Thế kỉ X",
"Thế kỉ XI"
],
"en": [
"9th century",
"10th century",
"11th century"
]
},
"ans": 1,
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "Thế kỉ X gồm các năm từ 901 đến 1000.",
"en": "The 10th century runs from 901 to 1000."
},
{
"vi": "938 nằm trong khoảng đó nên thuộc thế kỉ X.",
"en": "938 is in that range, so it is in the 10th century."
}
],
"tip": {
"vi": "Thế kỉ thứ n gồm các năm từ (n − 1) × 100 + 1 đến n × 100.",
"en": "Century n runs from year (n − 1) × 100 + 1 to year n × 100."
}
},
{
"id": "A2",
"group": "A",
"lesson": "addsub",
"tier": 1,
"adv": false,
"q": {
"vi": "Năm 1010, Lý Thái Tổ dời đô về Thăng Long. Năm 2010 cả nước kỉ niệm bao nhiêu năm Thăng Long – Hà Nội?",
"en": "In 1010, King Lý Thái Tổ moved the capital to Thăng Long. In 2010 the country celebrated how many years of Thăng Long – Hà Nội?"
},
"parts": [
{
"kind": "num",
"ans": 1000,
"unit": {
"vi": "năm",
"en": "years"
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "2010 − 1010 = 1000",
"en": "2010 − 1010 = 1000"
}
],
"tip": {
"vi": "Khoảng cách giữa hai năm = năm sau − năm trước.",
"en": "Years between = later year − earlier year."
}
},
{
"id": "A3",
"group": "A",
"lesson": "time",
"tier": 2,
"adv": false,
"q": {
"vi": "Năm 1010, Lý Thái Tổ dời đô về Thăng Long. Tính đến năm 2026, Thăng Long – Hà Nội đã trải qua bao nhiêu năm? Năm dời đô thuộc thế kỉ nào?",
"en": "In 1010 the capital moved to Thăng Long. By 2026, how many years has Thăng Long – Hà Nội existed? Which century is 1010 in?"
},
"parts": [
{
"kind": "num",
"ans": 1016,
"unit": {
"vi": "năm",
"en": "years"
},
"lab": {
"vi": "Số năm",
"en": "Years"
}
},
{
"kind": "choice",
"opts": {
"vi": [
"Thế kỉ X",
"Thế kỉ XI",
"Thế kỉ XX"
],
"en": [
"10th century",
"11th century",
"20th century"
]
},
"ans": 1,
"lab": {
"vi": "Thế kỉ",
"en": "Century"
}
}
],
"steps": [
{
"vi": "2026 − 1010 = 1016",
"en": "2026 − 1010 = 1016"
},
{
"vi": "Năm 1010 nằm trong khoảng 1001 đến 1100 nên thuộc thế kỉ XI.",
"en": "1010 is between 1001 and 1100, so it is in the 11th century."
}
],
"tip": {
"vi": "Thế kỉ thứ n gồm các năm từ (n − 1) × 100 + 1 đến n × 100.",
"en": "Century n runs from year (n − 1) × 100 + 1 to year n × 100."
}
},
{
"id": "A4",
"group": "A",
"lesson": "addsub",
"tier": 1,
"adv": false,
"q": {
"vi": "Văn Miếu được xây năm 1070. Quốc Tử Giám, trường đại học đầu tiên của nước ta, được lập năm 1076. Hai năm đó cách nhau bao nhiêu năm?",
"en": "The Temple of Literature was built in 1070. The Imperial Academy, Vietnam's first university, was founded in 1076. How many years apart are they?"
},
"parts": [
{
"kind": "num",
"ans": 6,
"unit": {
"vi": "năm",
"en": "years"
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "1076 − 1070 = 6",
"en": "1076 − 1070 = 6"
}
],
"tip": {
"vi": "Khoảng cách giữa hai năm = năm sau − năm trước.",
"en": "Years between = later year − earlier year."
}
},
{
"id": "A5",
"group": "A",
"lesson": "div",
"tier": 2,
"adv": false,
"q": {
"vi": "Văn Miếu có 82 tấm bia tiến sĩ đặt trên lưng rùa đá. Nếu chia đều sang hai bên giếng Thiên Quang thì mỗi bên có bao nhiêu tấm?",
"en": "The Temple of Literature has 82 doctoral steles on stone turtles. If they are shared equally between the two sides of the Thiên Quang well, how many are on each side?"
},
"parts": [
{
"kind": "num",
"ans": 41,
"unit": {
"vi": "tấm",
"en": "steles"
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "82 : 2 = 41",
"en": "82 : 2 = 41"
}
],
"tip": {
"vi": "Chia đều thành 2 phần thì lấy tổng chia cho 2.",
"en": "Sharing equally in 2 means dividing by 2."
}
},
{
"id": "A6",
"group": "A",
"lesson": "addsub",
"tier": 2,
"adv": false,
"q": {
"vi": "Quân dân nhà Trần ba lần đánh thắng quân Mông – Nguyên vào các năm 1258, 1285 và 1288. Từ lần thứ nhất đến lần thứ ba cách nhau bao nhiêu năm?",
"en": "The Trần dynasty defeated the Mongol–Yuan armies three times: in 1258, 1285 and 1288. How many years passed from the first victory to the third?"
},
"parts": [
{
"kind": "num",
"ans": 30,
"unit": {
"vi": "năm",
"en": "years"
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "Lần thứ nhất năm 1258, lần thứ ba năm 1288.",
"en": "First in 1258, third in 1288."
},
{
"vi": "1288 − 1258 = 30",
"en": "1288 − 1258 = 30"
}
],
"tip": {
"vi": "Khoảng cách giữa hai năm = năm sau − năm trước.",
"en": "Years between = later year − earlier year."
}
},
{
"id": "A7",
"group": "A",
"lesson": "div",
"tier": 3,
"adv": false,
"q": {
"vi": "Truyện Kiều của Nguyễn Du có 3 254 câu thơ. Mỗi ngày đọc 50 câu thì cần ít nhất bao nhiêu ngày để đọc hết?",
"en": "Nguyễn Du's Tale of Kiều has 3,254 lines of verse. Reading 50 lines a day, how many days at least are needed to finish it?"
},
"parts": [
{
"kind": "num",
"ans": 66,
"unit": {
"vi": "ngày",
"en": "days"
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "3254 : 50 = 65 (dư 4)",
"en": "3254 : 50 = 65 (remainder 4)"
},
{
"vi": "Còn 4 câu nữa nên cần thêm 1 ngày: 65 + 1 = 66",
"en": "4 lines are left, so 1 more day: 65 + 1 = 66"
}
],
"tip": {
"vi": "Phép chia còn dư thì phải thêm 1 ngày cho phần dư.",
"en": "If there is a remainder, add one more day for it."
}
},
{
"id": "A8",
"group": "A",
"lesson": "time",
"tier": 2,
"adv": false,
"q": {
"vi": "Chiến dịch Điện Biên Phủ kéo dài 56 ngày đêm, thắng lợi ngày 7/5/1954. Chiến dịch kéo dài bao nhiêu tuần? Năm 2024 là kỉ niệm bao nhiêu năm chiến thắng?",
"en": "The Điện Biên Phủ campaign lasted 56 days and nights and was won on 7 May 1954. How many weeks did it last? Which anniversary was celebrated in 2024?"
},
"parts": [
{
"kind": "num",
"ans": 8,
"unit": {
"vi": "tuần",
"en": "weeks"
},
"lab": {
"vi": "Số tuần",
"en": "Weeks"
}
},
{
"kind": "num",
"ans": 70,
"unit": {
"vi": "năm",
"en": "years"
},
"lab": {
"vi": "Kỉ niệm",
"en": "Anniversary"
}
}
],
"steps": [
{
"vi": "1 tuần có 7 ngày: 56 : 7 = 8",
"en": "A week has 7 days: 56 : 7 = 8"
},
{
"vi": "2024 − 1954 = 70",
"en": "2024 − 1954 = 70"
}
],
"tip": {
"vi": "1 tuần = 7 ngày.",
"en": "1 week = 7 days."
}
},
{
"id": "A9",
"group": "A",
"lesson": "time",
"tier": 1,
"adv": false,
"q": {
"vi": "Ngày 2/9/1945, Bác Hồ đọc Tuyên ngôn Độc lập. Năm 1945 thuộc thế kỉ nào? Năm 2025 là kỉ niệm bao nhiêu năm Quốc khánh?",
"en": "On 2 September 1945, President Hồ Chí Minh read the Declaration of Independence. Which century is 1945 in? Which anniversary was 2025?"
},
"parts": [
{
"kind": "choice",
"opts": {
"vi": [
"Thế kỉ XIX",
"Thế kỉ XX",
"Thế kỉ XXI"
],
"en": [
"19th century",
"20th century",
"21st century"
]
},
"ans": 1,
"lab": {
"vi": "Thế kỉ",
"en": "Century"
}
},
{
"kind": "num",
"ans": 80,
"unit": {
"vi": "năm",
"en": "years"
},
"lab": {
"vi": "Kỉ niệm",
"en": "Anniversary"
}
}
],
"steps": [
{
"vi": "Thế kỉ XX gồm các năm từ 1901 đến 2000.",
"en": "The 20th century runs from 1901 to 2000."
},
{
"vi": "2025 − 1945 = 80",
"en": "2025 − 1945 = 80"
}
],
"tip": {
"vi": "Thế kỉ thứ n gồm các năm từ (n − 1) × 100 + 1 đến n × 100.",
"en": "Century n runs from year (n − 1) × 100 + 1 to year n × 100."
}
},
{
"id": "A10",
"group": "A",
"lesson": "addsub",
"tier": 2,
"adv": false,
"q": {
"vi": "Hai Bà Trưng khởi nghĩa năm 40. Ngô Quyền thắng trận Bạch Đằng năm 938. Hai sự kiện cách nhau bao nhiêu năm?",
"en": "The Trưng Sisters rose up in the year 40. Ngô Quyền won at Bạch Đằng in 938. How many years apart are the two events?"
},
"parts": [
{
"kind": "num",
"ans": 898,
"unit": {
"vi": "năm",
"en": "years"
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "938 − 40 = 898",
"en": "938 − 40 = 898"
}
],
"tip": {
"vi": "Khoảng cách giữa hai năm = năm sau − năm trước.",
"en": "Years between = later year − earlier year."
}
},
{
"id": "A11",
"group": "A",
"lesson": "cmpnum",
"tier": 3,
"adv": false,
"q": {
"vi": "Sắp xếp theo thứ tự thời gian từ sớm đến muộn: xây Chùa Một Cột (1049), dời đô về Thăng Long (1010), xây Văn Miếu (1070), Quang Trung đại phá quân Thanh (1789).",
"en": "Put in order from earliest to latest: One Pillar Pagoda built (1049), capital moved to Thăng Long (1010), Temple of Literature built (1070), Quang Trung defeats the Qing army (1789)."
},
"parts": [
{
"kind": "choice",
"opts": {
"vi": [
"1010 → 1049 → 1070 → 1789",
"1049 → 1010 → 1070 → 1789",
"1010 → 1070 → 1049 → 1789",
"1789 → 1070 → 1049 → 1010"
],
"en": [
"1010 → 1049 → 1070 → 1789",
"1049 → 1010 → 1070 → 1789",
"1010 → 1070 → 1049 → 1789",
"1789 → 1070 → 1049 → 1010"
]
},
"ans": 0,
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "So sánh các số năm như so sánh số có bốn chữ số: 1010 < 1049 < 1070 < 1789.",
"en": "Compare the years like 4-digit numbers: 1010 < 1049 < 1070 < 1789."
}
],
"tip": {
"vi": "So sánh từ hàng nghìn, rồi hàng trăm, hàng chục.",
"en": "Compare thousands first, then hundreds, then tens."
}
},
{
"id": "A12",
"group": "A",
"lesson": "addsub",
"tier": 2,
"adv": false,
"q": {
"vi": "Trước năm 2025 nước ta có 63 tỉnh, thành phố. Từ ngày 1/7/2025, sau khi sắp xếp, còn 34 tỉnh, thành phố. Số tỉnh, thành phố giảm đi bao nhiêu?",
"en": "Before 2025 Vietnam had 63 provinces and cities. From 1 July 2025, after reorganising, there are 34. By how many did the number go down?"
},
"parts": [
{
"kind": "num",
"ans": 29,
"unit": {
"vi": "",
"en": ""
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "63 − 34 = 29",
"en": "63 − 34 = 29"
}
],
"tip": {
"vi": "Giảm đi bao nhiêu thì lấy số cũ trừ số mới.",
"en": "Decrease = old number − new number."
}
},
{
"id": "A13",
"group": "A",
"lesson": "time",
"tier": 1,
"adv": false,
"q": {
"vi": "Mùa xuân năm 1789, vua Quang Trung đại phá quân Thanh. Năm 1789 thuộc thế kỉ nào?",
"en": "In spring 1789, Emperor Quang Trung defeated the Qing army. Which century is 1789 in?"
},
"parts": [
{
"kind": "choice",
"opts": {
"vi": [
"Thế kỉ XVIII",
"Thế kỉ XIX",
"Thế kỉ XX"
],
"en": [
"18th century",
"19th century",
"20th century"
]
},
"ans": 0,
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "Thế kỉ XVIII gồm các năm từ 1701 đến 1800.",
"en": "The 18th century runs from 1701 to 1800."
},
{
"vi": "1789 nằm trong khoảng đó.",
"en": "1789 is in that range."
}
],
"tip": {
"vi": "Thế kỉ thứ n gồm các năm từ (n − 1) × 100 + 1 đến n × 100.",
"en": "Century n runs from year (n − 1) × 100 + 1 to year n × 100."
}
},
{
"id": "A14",
"group": "A",
"lesson": "area",
"tier": 1,
"adv": false,
"q": {
"vi": "Bánh chưng ngày Tết hình vuông cạnh 20 cm. Tính chu vi và diện tích mặt bánh.",
"en": "A square Tết rice cake (bánh chưng) has sides of 20 cm. Find the perimeter and the area of its top."
},
"parts": [
{
"kind": "num",
"ans": 80,
"unit": {
"vi": "cm",
"en": "cm"
},
"lab": {
"vi": "Chu vi",
"en": "Perimeter"
}
},
{
"kind": "num",
"ans": 400,
"unit": {
"vi": "cm²",
"en": "cm²"
},
"lab": {
"vi": "Diện tích",
"en": "Area"
}
}
],
"steps": [
{
"vi": "Chu vi: 20 × 4 = 80",
"en": "Perimeter: 20 × 4 = 80"
},
{
"vi": "Diện tích: 20 × 20 = 400",
"en": "Area: 20 × 20 = 400"
}
],
"tip": {
"vi": "Hình vuông: chu vi = cạnh × 4, diện tích = cạnh × cạnh.",
"en": "Square: perimeter = side × 4, area = side × side."
}
},
{
"id": "A15",
"group": "A",
"lesson": "mul",
"tier": 2,
"adv": false,
"q": {
"vi": "Mỗi chiếc bánh chưng gói bằng 4 lá dong. Nhà Bân gói 12 chiếc và đã mua 50 lá. Hỏi còn thừa bao nhiêu lá?",
"en": "Each bánh chưng is wrapped in 4 dong leaves. Bân's family wraps 12 cakes and bought 50 leaves. How many leaves are left over?"
},
"parts": [
{
"kind": "num",
"ans": 2,
"unit": {
"vi": "lá",
"en": "leaves"
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "Số lá cần dùng: 4 × 12 = 48",
"en": "Leaves needed: 4 × 12 = 48"
},
{
"vi": "Số lá thừa: 50 − 48 = 2",
"en": "Left over: 50 − 48 = 2"
}
],
"tip": {
"vi": "",
"en": ""
}
},
{
"id": "B1",
"group": "B",
"lesson": "mul",
"tier": 3,
"adv": false,
"q": {
"vi": "Ánh sáng đi được khoảng 300 000 km mỗi giây. Ánh sáng Mặt Trời đi tới Trái Đất mất khoảng 8 phút 20 giây. Hỏi Mặt Trời cách Trái Đất khoảng bao nhiêu ki-lô-mét?",
"en": "Light travels about 300,000 km every second. Sunlight takes about 8 minutes 20 seconds to reach Earth. About how many kilometres away is the Sun?"
},
"parts": [
{
"kind": "num",
"ans": 150000000,
"unit": {
"vi": "km",
"en": "km"
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "8 phút 20 giây = 8 × 60 + 20 = 500 giây",
"en": "8 min 20 s = 8 × 60 + 20 = 500 seconds"
},
{
"vi": "300000 × 500 = 150000000",
"en": "300000 × 500 = 150000000"
}
],
"tip": {
"vi": "Đổi hết ra giây rồi nhân với quãng đường đi được trong 1 giây.",
"en": "Change everything to seconds, then multiply by the distance per second."
}
},
{
"id": "B2",
"group": "B",
"lesson": "mul",
"tier": 2,
"adv": false,
"q": {
"vi": "Âm thanh đi trong không khí khoảng 340 m mỗi giây. Thấy tia chớp, 3 giây sau mới nghe tiếng sấm. Chỗ sét đánh cách bé khoảng bao nhiêu mét?",
"en": "Sound travels about 340 m every second in air. You see lightning and hear the thunder 3 seconds later. About how far away was the lightning?"
},
"parts": [
{
"kind": "num",
"ans": 1020,
"unit": {
"vi": "m",
"en": "m"
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "Ánh sáng tới gần như ngay lập tức, tiếng sấm đi mất 3 giây.",
"en": "The light arrives almost at once; the sound takes 3 seconds."
},
{
"vi": "340 × 3 = 1020",
"en": "340 × 3 = 1020"
}
],
"tip": {
"vi": "",
"en": ""
}
},
{
"id": "B3",
"group": "B",
"lesson": "divis",
"tier": 1,
"adv": false,
"q": {
"vi": "Năm nhuận có 366 ngày, tháng Hai có 29 ngày. Các năm nhuận gần đây đều có số năm chia hết cho 4. Trong các năm sau, năm nào là năm nhuận?",
"en": "A leap year has 366 days and February has 29 days. Recent leap years are all divisible by 4. Which of these years is a leap year?"
},
"parts": [
{
"kind": "choice",
"opts": {
"vi": [
"2026",
"2027",
"2028",
"2030"
],
"en": [
"2026",
"2027",
"2028",
"2030"
]
},
"ans": 2,
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "2028 : 4 = 507, chia hết.",
"en": "2028 : 4 = 507, divisible."
},
{
"vi": "2026, 2027, 2030 chia cho 4 đều có dư.",
"en": "2026, 2027 and 2030 leave a remainder."
}
],
"tip": {
"vi": "Số chia hết cho 4 khi hai chữ số cuối tạo thành số chia hết cho 4.",
"en": "A number divides by 4 if its last two digits do."
}
},
{
"id": "B4",
"group": "B",
"lesson": "mul",
"tier": 2,
"adv": false,
"q": {
"vi": "Tim người lớn khi nghỉ ngơi đập khoảng 70 lần mỗi phút. Trong 1 giờ tim đập khoảng bao nhiêu lần?",
"en": "An adult's heart beats about 70 times a minute at rest. About how many times does it beat in 1 hour?"
},
"parts": [
{
"kind": "num",
"ans": 4200,
"unit": {
"vi": "lần",
"en": "times"
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "1 giờ = 60 phút",
"en": "1 hour = 60 minutes"
},
{
"vi": "70 × 60 = 4200",
"en": "70 × 60 = 4200"
}
],
"tip": {
"vi": "",
"en": ""
}
},
{
"id": "B5",
"group": "B",
"lesson": "div",
"tier": 1,
"adv": false,
"q": {
"vi": "Bộ xương người lớn có 206 chiếc xương, riêng hai bàn tay đã có 54 chiếc. Mỗi bàn tay có bao nhiêu chiếc xương? Phần còn lại của cơ thể có bao nhiêu chiếc?",
"en": "An adult skeleton has 206 bones, and the two hands alone have 54. How many bones are in each hand? How many are in the rest of the body?"
},
"parts": [
{
"kind": "num",
"ans": 27,
"unit": {
"vi": "chiếc",
"en": "bones"
},
"lab": {
"vi": "Mỗi bàn tay",
"en": "Each hand"
}
},
{
"kind": "num",
"ans": 152,
"unit": {
"vi": "chiếc",
"en": "bones"
},
"lab": {
"vi": "Phần còn lại",
"en": "Rest of body"
}
}
],
"steps": [
{
"vi": "54 : 2 = 27",
"en": "54 : 2 = 27"
},
{
"vi": "206 − 54 = 152",
"en": "206 − 54 = 152"
}
],
"tip": {
"vi": "",
"en": ""
}
},
{
"id": "B6",
"group": "B",
"lesson": "mass",
"tier": 2,
"adv": false,
"q": {
"vi": "Một chú voi ăn khoảng 150 kg thức ăn mỗi ngày. Trong 1 tuần voi ăn bao nhiêu? Viết kết quả dưới dạng … tấn … kg.",
"en": "An elephant eats about 150 kg of food a day. How much does it eat in 1 week? Write it as … tonnes … kg."
},
"parts": [
{
"kind": "num",
"ans": 1,
"unit": {
"vi": "tấn",
"en": "tonne"
},
"lab": {
"vi": "",
"en": ""
}
},
{
"kind": "num",
"ans": 50,
"unit": {
"vi": "kg",
"en": "kg"
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "150 × 7 = 1050 (kg)",
"en": "150 × 7 = 1050 (kg)"
},
{
"vi": "1050 kg = 1000 kg + 50 kg = 1 tấn 50 kg",
"en": "1050 kg = 1000 kg + 50 kg = 1 tonne 50 kg"
}
],
"tip": {
"vi": "1 tấn = 1000 kg.",
"en": "1 tonne = 1000 kg."
}
},
{
"id": "B7",
"group": "B",
"lesson": "mul",
"tier": 1,
"adv": false,
"q": {
"vi": "Mỗi ô trong tổ ong là một hình 6 cạnh bằng nhau, mỗi cạnh dài 3 mm. Tính chu vi một ô.",
"en": "Each cell of a honeycomb is a shape with 6 equal sides, each 3 mm long. Find the perimeter of one cell."
},
"parts": [
{
"kind": "num",
"ans": 18,
"unit": {
"vi": "mm",
"en": "mm"
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "Chu vi = tổng độ dài 6 cạnh: 3 × 6 = 18",
"en": "Perimeter = 6 sides: 3 × 6 = 18"
}
],
"tip": {
"vi": "Các cạnh bằng nhau: chu vi = độ dài một cạnh × số cạnh.",
"en": "Equal sides: perimeter = one side × number of sides."
}
},
{
"id": "B8",
"group": "B",
"lesson": "addsub",
"tier": 1,
"adv": false,
"q": {
"vi": "Nước sôi ở 100 độ C. Nồi nước đang ở 25 độ C. Cần tăng thêm bao nhiêu độ thì nước sôi?",
"en": "Water boils at 100 °C. A pot of water is at 25 °C. How many more degrees until it boils?"
},
"parts": [
{
"kind": "num",
"ans": 75,
"unit": {
"vi": "độ C",
"en": "°C"
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "100 − 25 = 75",
"en": "100 − 25 = 75"
}
],
"tip": {
"vi": "",
"en": ""
}
},
{
"id": "B9",
"group": "B",
"lesson": "fraddsub",
"tier": 2,
"adv": false,
"q": {
"vi": "Khoảng {7/10} bề mặt Trái Đất được nước bao phủ, phần còn lại là đất liền. Đất liền chiếm khoảng bao nhiêu phần bề mặt Trái Đất?",
"en": "About {7/10} of Earth's surface is covered by water and the rest is land. About what fraction of the surface is land?"
},
"parts": [
{
"kind": "frac",
"ans": [
3,
10
],
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "Cả bề mặt là {10/10}.",
"en": "The whole surface is {10/10}."
},
{
"vi": "{10/10} − {7/10} = {3/10}",
"en": "{10/10} − {7/10} = {3/10}"
}
],
"tip": {
"vi": "Cả phần là 1 = {10/10}.",
"en": "The whole is 1 = {10/10}."
}
},
{
"id": "B10",
"group": "B",
"lesson": "addsub",
"tier": 1,
"adv": false,
"q": {
"vi": "Hệ Mặt Trời có 8 hành tinh. Tính từ Mặt Trời ra, Trái Đất đứng thứ 3. Có bao nhiêu hành tinh ở xa Mặt Trời hơn Trái Đất?",
"en": "The Solar System has 8 planets. Counting out from the Sun, Earth is 3rd. How many planets are farther from the Sun than Earth?"
},
"parts": [
{
"kind": "num",
"ans": 5,
"unit": {
"vi": "hành tinh",
"en": "planets"
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "8 − 3 = 5",
"en": "8 − 3 = 5"
}
],
"tip": {
"vi": "",
"en": ""
}
},
{
"id": "C1",
"group": "C",
"lesson": "addsub",
"tier": 1,
"adv": false,
"q": {
"vi": "Năm 1903, anh em nhà Wright bay chiếc máy bay đầu tiên. Năm 1969, con người đặt chân lên Mặt Trăng. Hai sự kiện cách nhau bao nhiêu năm?",
"en": "In 1903 the Wright brothers flew the first aeroplane. In 1969 people walked on the Moon. How many years apart are the two events?"
},
"parts": [
{
"kind": "num",
"ans": 66,
"unit": {
"vi": "năm",
"en": "years"
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "1969 − 1903 = 66",
"en": "1969 − 1903 = 66"
}
],
"tip": {
"vi": "Khoảng cách giữa hai năm = năm sau − năm trước.",
"en": "Years between = later year − earlier year."
}
},
{
"id": "C2",
"group": "C",
"lesson": "addsub",
"tier": 1,
"adv": false,
"q": {
"vi": "Năm 1961, Gagarin là người đầu tiên bay vào vũ trụ. Năm 1980, Phạm Tuân trở thành người Việt Nam và người châu Á đầu tiên bay vào vũ trụ. Hai năm cách nhau bao nhiêu năm?",
"en": "In 1961 Gagarin became the first person in space. In 1980 Phạm Tuân became the first Vietnamese and first Asian in space. How many years apart?"
},
"parts": [
{
"kind": "num",
"ans": 19,
"unit": {
"vi": "năm",
"en": "years"
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "1980 − 1961 = 19",
"en": "1980 − 1961 = 19"
}
],
"tip": {
"vi": "Khoảng cách giữa hai năm = năm sau − năm trước.",
"en": "Years between = later year − earlier year."
}
},
{
"id": "C3",
"group": "C",
"lesson": "addsub",
"tier": 2,
"adv": false,
"q": {
"vi": "Đường sắt Bắc – Nam từ Hà Nội đến TP Hồ Chí Minh dài 1 726 km. Đoàn tàu đã chạy được 958 km. Hỏi còn bao nhiêu ki-lô-mét nữa?",
"en": "The North–South railway from Hà Nội to Hồ Chí Minh City is 1,726 km long. A train has gone 958 km. How many kilometres are left?"
},
"parts": [
{
"kind": "num",
"ans": 768,
"unit": {
"vi": "km",
"en": "km"
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "1726 − 958 = 768",
"en": "1726 − 958 = 768"
}
],
"tip": {
"vi": "",
"en": ""
}
},
{
"id": "C4",
"group": "C",
"lesson": "addsub",
"tier": 1,
"adv": false,
"q": {
"vi": "Vệ tinh VINASAT-1 của Việt Nam được phóng lên vũ trụ năm 2008. Đến năm 2026 là bao nhiêu năm?",
"en": "Vietnam's VINASAT-1 satellite was launched in 2008. How many years is it until 2026?"
},
"parts": [
{
"kind": "num",
"ans": 18,
"unit": {
"vi": "năm",
"en": "years"
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "2026 − 2008 = 18",
"en": "2026 − 2008 = 18"
}
],
"tip": {
"vi": "Khoảng cách giữa hai năm = năm sau − năm trước.",
"en": "Years between = later year − earlier year."
}
},
{
"id": "C5",
"group": "C",
"lesson": "mul",
"tier": 2,
"adv": false,
"q": {
"vi": "Mỗi tấm pin mặt trời tạo ra 2 số điện mỗi ngày. Nhà Bân lắp 6 tấm. Trong một tháng 30 ngày, các tấm pin tạo ra bao nhiêu số điện?",
"en": "Each solar panel makes 2 units of electricity a day. Bân's family has 6 panels. How many units do they make in a 30-day month?"
},
"parts": [
{
"kind": "num",
"ans": 360,
"unit": {
"vi": "số",
"en": "units"
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "Mỗi ngày: 2 × 6 = 12",
"en": "Each day: 2 × 6 = 12"
},
{
"vi": "Một tháng: 12 × 30 = 360",
"en": "A month: 12 × 30 = 360"
}
],
"tip": {
"vi": "",
"en": ""
}
},
{
"id": "C6",
"group": "C",
"lesson": "time",
"tier": 2,
"adv": false,
"q": {
"vi": "Máy in 3D in một mô hình hết 45 phút. In liên tục 8 mô hình thì hết bao nhiêu giờ?",
"en": "A 3D printer takes 45 minutes to print one model. How many hours does it take to print 8 models in a row?"
},
"parts": [
{
"kind": "num",
"ans": 6,
"unit": {
"vi": "giờ",
"en": "hours"
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "45 × 8 = 360 (phút)",
"en": "45 × 8 = 360 (minutes)"
},
{
"vi": "360 : 60 = 6",
"en": "360 : 60 = 6"
}
],
"tip": {
"vi": "1 giờ = 60 phút.",
"en": "1 hour = 60 minutes."
}
},
{
"id": "C7",
"group": "C",
"lesson": "div",
"tier": 3,
"adv": false,
"q": {
"vi": "Ô tô điện sạc đầy đi được 300 km. Xe xuất phát với pin đầy và cần đi 1 050 km. Hỏi dọc đường phải sạc ít nhất mấy lần?",
"en": "An electric car goes 300 km on a full charge. It starts full and must travel 1,050 km. At least how many times must it charge on the way?"
},
"parts": [
{
"kind": "num",
"ans": 3,
"unit": {
"vi": "lần",
"en": "times"
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "1050 : 300 = 3 (dư 150): cần 4 lần pin đầy mới đi hết.",
"en": "1050 : 300 = 3 (remainder 150): it needs 4 full batteries."
},
{
"vi": "Lần đầu đã đầy sẵn nên chỉ phải sạc: 4 − 1 = 3",
"en": "The first is already full, so charge: 4 − 1 = 3"
}
],
"tip": {
"vi": "Nhớ trừ lần pin đầy lúc xuất phát.",
"en": "Don't count the full battery at the start."
}
},
{
"id": "C8",
"group": "C",
"lesson": "addsub",
"tier": 1,
"adv": false,
"q": {
"vi": "Cầu Long Biên bắc qua sông Hồng khánh thành năm 1902. Đến năm 2026 cầu bao nhiêu tuổi?",
"en": "Long Biên Bridge over the Red River opened in 1902. How old is it in 2026?"
},
"parts": [
{
"kind": "num",
"ans": 124,
"unit": {
"vi": "tuổi",
"en": "years"
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "2026 − 1902 = 124",
"en": "2026 − 1902 = 124"
}
],
"tip": {
"vi": "Khoảng cách giữa hai năm = năm sau − năm trước.",
"en": "Years between = later year − earlier year."
}
},
{
"id": "D1",
"group": "D",
"lesson": "mul",
"tier": 2,
"adv": false,
"q": {
"vi": "Tháng này nhà Bân dùng 15 khối nước, mỗi khối giá 6 000 đồng. Tiền nước tháng này là bao nhiêu?",
"en": "This month Bân's family used 15 units of water at 6,000 dong per unit. How much is the water bill?"
},
"parts": [
{
"kind": "num",
"ans": 90000,
"unit": {
"vi": "đồng",
"en": "dong"
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "6000 × 15 = 90000",
"en": "6000 × 15 = 90000"
}
],
"tip": {
"vi": "",
"en": ""
}
},
{
"id": "D2",
"group": "D",
"lesson": "mul",
"tier": 2,
"adv": false,
"q": {
"vi": "Một vòi nước bị rỉ làm phí 2 lít nước mỗi giờ. Nếu không sửa thì 1 tuần phí bao nhiêu lít nước?",
"en": "A leaky tap wastes 2 litres of water an hour. If it isn't fixed, how many litres are wasted in 1 week?"
},
"parts": [
{
"kind": "num",
"ans": 336,
"unit": {
"vi": "lít",
"en": "litres"
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "Mỗi ngày: 2 × 24 = 48",
"en": "Each day: 2 × 24 = 48"
},
{
"vi": "1 tuần: 48 × 7 = 336",
"en": "1 week: 48 × 7 = 336"
}
],
"tip": {
"vi": "1 ngày = 24 giờ, 1 tuần = 7 ngày.",
"en": "1 day = 24 hours, 1 week = 7 days."
}
},
{
"id": "D3",
"group": "D",
"lesson": "mul",
"tier": 2,
"adv": false,
"q": {
"vi": "Mẹ mua 3 kg táo, mỗi ki-lô-gam 45 000 đồng, và đưa cô bán hàng 200 000 đồng. Cô trả lại bao nhiêu tiền?",
"en": "Mum buys 3 kg of apples at 45,000 dong per kg and pays with 200,000 dong. How much change does she get?"
},
"parts": [
{
"kind": "num",
"ans": 65000,
"unit": {
"vi": "đồng",
"en": "dong"
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "Tiền táo: 45000 × 3 = 135000",
"en": "Apples: 45000 × 3 = 135000"
},
{
"vi": "Tiền trả lại: 200000 − 135000 = 65000",
"en": "Change: 200000 − 135000 = 65000"
}
],
"tip": {
"vi": "",
"en": ""
}
},
{
"id": "D4",
"group": "D",
"lesson": "area",
"tier": 2,
"adv": false,
"q": {
"vi": "Phòng của bé dài 5 m, rộng 4 m. Lát nền bằng gạch vuông cạnh 50 cm, cứ 4 viên lát được 1 m². Cần bao nhiêu viên gạch?",
"en": "A bedroom is 5 m long and 4 m wide. It is tiled with 50 cm square tiles; 4 tiles cover 1 m². How many tiles are needed?"
},
"parts": [
{
"kind": "num",
"ans": 80,
"unit": {
"vi": "viên",
"en": "tiles"
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "Diện tích phòng: 5 × 4 = 20 (m²)",
"en": "Room area: 5 × 4 = 20 (m²)"
},
{
"vi": "Số gạch: 20 × 4 = 80",
"en": "Tiles: 20 × 4 = 80"
}
],
"tip": {
"vi": "",
"en": ""
}
},
{
"id": "D5",
"group": "D",
"lesson": "time",
"tier": 3,
"adv": false,
"q": {
"vi": "Buổi sáng có 5 tiết học, mỗi tiết 35 phút; giữa các tiết nghỉ 4 lần, mỗi lần 5 phút. Vào học lúc 7 giờ. Hỏi mấy giờ tan học?",
"en": "There are 5 lessons in the morning, 35 minutes each, with 4 breaks of 5 minutes between them. School starts at 7 o'clock. What time does it finish?"
},
"parts": [
{
"kind": "num",
"ans": 10,
"unit": {
"vi": "giờ",
"en": "h"
},
"lab": {
"vi": "",
"en": ""
}
},
{
"kind": "num",
"ans": 15,
"unit": {
"vi": "phút",
"en": "min"
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "Thời gian học: 35 × 5 = 175 (phút)",
"en": "Lessons: 35 × 5 = 175 (min)"
},
{
"vi": "Thời gian nghỉ: 5 × 4 = 20 (phút)",
"en": "Breaks: 5 × 4 = 20 (min)"
},
{
"vi": "175 + 20 = 195 phút = 3 giờ 15 phút",
"en": "175 + 20 = 195 min = 3 h 15 min"
},
{
"vi": "7 giờ + 3 giờ 15 phút = 10 giờ 15 phút",
"en": "7:00 + 3 h 15 min = 10:15"
}
],
"tip": {
"vi": "5 tiết thì chỉ có 4 lần nghỉ xen giữa.",
"en": "5 lessons have only 4 breaks between them."
}
},
{
"id": "D6",
"group": "D",
"lesson": "avg",
"tier": 2,
"adv": false,
"q": {
"vi": "Nhiệt độ buổi trưa 7 ngày trong tuần là: 24, 26, 25, 27, 23, 26, 24 độ C. Tính nhiệt độ trung bình của tuần.",
"en": "The noon temperatures for 7 days were 24, 26, 25, 27, 23, 26 and 24 °C. Find the average temperature for the week."
},
"parts": [
{
"kind": "num",
"ans": 25,
"unit": {
"vi": "độ C",
"en": "°C"
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "Tổng: 24 + 26 + 25 + 27 + 23 + 26 + 24 = 175",
"en": "Sum: 24 + 26 + 25 + 27 + 23 + 26 + 24 = 175"
},
{
"vi": "175 : 7 = 25",
"en": "175 : 7 = 25"
}
],
"tip": {
"vi": "Trung bình cộng = tổng : số các số.",
"en": "Average = sum ÷ how many."
}
},
{
"id": "D7",
"group": "D",
"lesson": "fracof",
"tier": 2,
"adv": false,
"q": {
"vi": "Vườn nhà bà rộng 60 m². Bà trồng rau cải trên {1/3} vườn, trồng hành trên {1/4} vườn. Phần còn lại rộng bao nhiêu mét vuông?",
"en": "Grandma's garden is 60 m². She plants greens on {1/3} of it and onions on {1/4} of it. How many square metres are left?"
},
"parts": [
{
"kind": "num",
"ans": 25,
"unit": {
"vi": "m²",
"en": "m²"
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "Rau cải: 60 : 3 = 20 (m²)",
"en": "Greens: 60 : 3 = 20 (m²)"
},
{
"vi": "Hành: 60 : 4 = 15 (m²)",
"en": "Onions: 60 : 4 = 15 (m²)"
},
{
"vi": "Còn lại: 60 − 20 − 15 = 25",
"en": "Left: 60 − 20 − 15 = 25"
}
],
"tip": {
"vi": "",
"en": ""
}
},
{
"id": "D8",
"group": "D",
"lesson": "mul",
"tier": 3,
"adv": false,
"q": {
"vi": "Vé xe buýt lượt giá 7 000 đồng. Bé đi học mỗi ngày 2 lượt, một tháng đi 22 ngày. Vé tháng giá 200 000 đồng. Mua vé tháng tiết kiệm được bao nhiêu tiền?",
"en": "A single bus ticket costs 7,000 dong. A child takes 2 rides a day for 22 school days a month. A monthly pass costs 200,000 dong. How much does the pass save?"
},
"parts": [
{
"kind": "num",
"ans": 108000,
"unit": {
"vi": "đồng",
"en": "dong"
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "Mỗi ngày: 7000 × 2 = 14000",
"en": "Each day: 7000 × 2 = 14000"
},
{
"vi": "Một tháng mua vé lượt: 14000 × 22 = 308000",
"en": "A month of single tickets: 14000 × 22 = 308000"
},
{
"vi": "Tiết kiệm: 308000 − 200000 = 108000",
"en": "Saving: 308000 − 200000 = 108000"
}
],
"tip": {
"vi": "",
"en": ""
}
},
{
"id": "E1",
"group": "E",
"lesson": "mul",
"tier": 2,
"adv": false,
"q": {
"vi": "Trên bản đồ, cứ 1 cm ứng với 10 km ngoài thực tế. Khoảng cách giữa hai thành phố trên bản đồ đo được 12 cm. Khoảng cách thật là bao nhiêu ki-lô-mét?",
"en": "On a map, 1 cm stands for 10 km in real life. Two cities are 12 cm apart on the map. How far apart are they really?"
},
"parts": [
{
"kind": "num",
"ans": 120,
"unit": {
"vi": "km",
"en": "km"
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "12 × 10 = 120",
"en": "12 × 10 = 120"
}
],
"tip": {
"vi": "Mỗi xăng-ti-mét trên bản đồ ứng với 10 km thật.",
"en": "Each centimetre on the map is 10 real kilometres."
}
},
{
"id": "E2",
"group": "E",
"lesson": "div",
"tier": 2,
"adv": false,
"q": {
"vi": "Trên sơ đồ trường học, cứ 1 cm ứng với 5 m ngoài thực tế. Sân trường dài 60 m thì trên sơ đồ dài bao nhiêu xăng-ti-mét?",
"en": "On a school plan, 1 cm stands for 5 m in real life. The playground is 60 m long. How long is it on the plan?"
},
"parts": [
{
"kind": "num",
"ans": 12,
"unit": {
"vi": "cm",
"en": "cm"
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "60 : 5 = 12",
"en": "60 : 5 = 12"
}
],
"tip": {
"vi": "Từ thực tế ra sơ đồ thì chia.",
"en": "From real life to the plan, divide."
}
},
{
"id": "E3",
"group": "E",
"lesson": "chart",
"tier": 1,
"adv": false,
"q": {
"vi": "Lớp 4A trồng cây trong 4 ngày đầu tuần: Thứ Hai 12 cây, Thứ Ba 15 cây, Thứ Tư 9 cây, Thứ Năm 14 cây. Bốn ngày trồng được bao nhiêu cây? Ngày nhiều nhất hơn ngày ít nhất bao nhiêu cây?",
"en": "Class 4A planted trees on the first 4 days of the week: Monday 12, Tuesday 15, Wednesday 9, Thursday 14. How many in the 4 days? How many more on the best day than the worst?"
},
"parts": [
{
"kind": "num",
"ans": 50,
"unit": {
"vi": "cây",
"en": "trees"
},
"lab": {
"vi": "Cả 4 ngày",
"en": "4 days"
}
},
{
"kind": "num",
"ans": 6,
"unit": {
"vi": "cây",
"en": "trees"
},
"lab": {
"vi": "Hơn",
"en": "More by"
}
}
],
"steps": [
{
"vi": "12 + 15 + 9 + 14 = 50",
"en": "12 + 15 + 9 + 14 = 50"
},
{
"vi": "Nhiều nhất 15 (Thứ Ba), ít nhất 9 (Thứ Tư): 15 − 9 = 6",
"en": "Most 15 (Tue), least 9 (Wed): 15 − 9 = 6"
}
],
"tip": {
"vi": "",
"en": ""
}
},
{
"id": "E4",
"group": "E",
"lesson": "chart",
"tier": 3,
"adv": false,
"q": {
"vi": "Biểu đồ lượng mưa: tháng 7 là 300 mm, tháng 8 là 270 mm, tháng 9 là 240 mm. Tính lượng mưa trung bình mỗi tháng. Tháng nào có lượng mưa bằng đúng trung bình?",
"en": "A rainfall chart shows July 300 mm, August 270 mm, September 240 mm. Find the average per month. Which month equals the average?"
},
"parts": [
{
"kind": "num",
"ans": 270,
"unit": {
"vi": "mm",
"en": "mm"
},
"lab": {
"vi": "Trung bình",
"en": "Average"
}
},
{
"kind": "choice",
"opts": {
"vi": [
"Tháng 7",
"Tháng 8",
"Tháng 9"
],
"en": [
"July",
"August",
"September"
]
},
"ans": 1,
"lab": {
"vi": "Tháng",
"en": "Month"
}
}
],
"steps": [
{
"vi": "300 + 270 + 240 = 810",
"en": "300 + 270 + 240 = 810"
},
{
"vi": "810 : 3 = 270, bằng lượng mưa tháng 8.",
"en": "810 : 3 = 270, the same as August."
}
],
"tip": {
"vi": "",
"en": ""
}
},
{
"id": "E5",
"group": "E",
"lesson": "mul",
"tier": 1,
"adv": false,
"q": {
"vi": "Bố đạp xe mỗi giờ được 12 km. Đạp trong 3 giờ thì đi được bao nhiêu ki-lô-mét?",
"en": "Dad cycles 12 km every hour. How far does he go in 3 hours?"
},
"parts": [
{
"kind": "num",
"ans": 36,
"unit": {
"vi": "km",
"en": "km"
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "12 × 3 = 36",
"en": "12 × 3 = 36"
}
],
"tip": {
"vi": "",
"en": ""
}
},
{
"id": "E6",
"group": "E",
"lesson": "div",
"tier": 1,
"adv": false,
"q": {
"vi": "Bé đi bộ từ nhà đến trường dài 600 m hết 10 phút. Mỗi phút bé đi được bao nhiêu mét?",
"en": "A child walks 600 m to school in 10 minutes. How many metres per minute is that?"
},
"parts": [
{
"kind": "num",
"ans": 60,
"unit": {
"vi": "m",
"en": "m"
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "600 : 10 = 60",
"en": "600 : 10 = 60"
}
],
"tip": {
"vi": "",
"en": ""
}
},
{
"id": "E7",
"group": "E",
"lesson": "div",
"tier": 2,
"adv": false,
"q": {
"vi": "Mỗi cốc nước 250 ml. Một bình 2 lít rót được bao nhiêu cốc đầy?",
"en": "Each glass holds 250 ml. How many full glasses can be poured from a 2-litre jug?"
},
"parts": [
{
"kind": "num",
"ans": 8,
"unit": {
"vi": "cốc",
"en": "glasses"
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "2 lít = 2000 ml",
"en": "2 litres = 2000 ml"
},
{
"vi": "2000 : 250 = 8",
"en": "2000 : 250 = 8"
}
],
"tip": {
"vi": "1 lít = 1000 ml.",
"en": "1 litre = 1000 ml."
}
},
{
"id": "E8",
"group": "E",
"lesson": "mass",
"tier": 2,
"adv": false,
"q": {
"vi": "Cửa hàng có 1 tạ 2 yến gạo, đóng vào các túi 5 kg. Được bao nhiêu túi?",
"en": "A shop has 1 tạ 2 yến of rice (1 tạ = 100 kg, 1 yến = 10 kg) and fills 5 kg bags. How many bags?"
},
"parts": [
{
"kind": "num",
"ans": 24,
"unit": {
"vi": "túi",
"en": "bags"
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "1 tạ 2 yến = 100 kg + 20 kg = 120 kg",
"en": "1 tạ 2 yến = 100 kg + 20 kg = 120 kg"
},
{
"vi": "120 : 5 = 24",
"en": "120 : 5 = 24"
}
],
"tip": {
"vi": "",
"en": ""
}
},
{
"id": "E9",
"group": "E",
"lesson": "angle",
"tier": 1,
"adv": false,
"q": {
"vi": "Lúc 3 giờ đúng, kim giờ và kim phút tạo thành góc gì? Lúc 6 giờ đúng thì sao?",
"en": "At exactly 3 o'clock, what kind of angle do the hands make? What about at 6 o'clock?"
},
"parts": [
{
"kind": "choice",
"opts": {
"vi": [
"Góc nhọn",
"Góc vuông",
"Góc tù",
"Góc bẹt"
],
"en": [
"Acute",
"Right",
"Obtuse",
"Straight"
]
},
"ans": 1,
"lab": {
"vi": "3 giờ",
"en": "3:00"
}
},
{
"kind": "choice",
"opts": {
"vi": [
"Góc nhọn",
"Góc vuông",
"Góc tù",
"Góc bẹt"
],
"en": [
"Acute",
"Right",
"Obtuse",
"Straight"
]
},
"ans": 3,
"lab": {
"vi": "6 giờ",
"en": "6:00"
}
}
],
"steps": [
{
"vi": "3 giờ: kim phút chỉ số 12, kim giờ chỉ số 3, hai kim vuông góc (90°).",
"en": "3:00: one hand at 12, one at 3, a right angle (90°)."
},
{
"vi": "6 giờ: hai kim thẳng hàng, ngược chiều nhau (180°).",
"en": "6:00: the hands make a straight line (180°)."
}
],
"tip": {
"vi": "",
"en": ""
}
},
{
"id": "E10",
"group": "E",
"lesson": "div",
"tier": 2,
"adv": false,
"q": {
"vi": "Bé bỏ ống heo 5 000 đồng mỗi ngày để mua bộ sách giá 120 000 đồng. Cần bao nhiêu ngày?",
"en": "A child saves 5,000 dong a day for a book set costing 120,000 dong. How many days are needed?"
},
"parts": [
{
"kind": "num",
"ans": 24,
"unit": {
"vi": "ngày",
"en": "days"
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "120000 : 5000 = 24",
"en": "120000 : 5000 = 24"
}
],
"tip": {
"vi": "",
"en": ""
}
},
{
"id": "F1",
"group": "F",
"lesson": "sumdiff",
"rank": 3,
"adv": true,
"q": {
"vi": "Hai lớp 4A và 4B có tất cả 70 bạn đi tham quan Văn Miếu. Số bạn lớp 4A bằng {3/4} số bạn lớp 4B. Mỗi lớp có bao nhiêu bạn đi?",
"en": "Classes 4A and 4B send 70 pupils in total to the Temple of Literature. 4A sends {3/4} as many as 4B. How many from each class?"
},
"parts": [
{
"kind": "num",
"ans": 30,
"unit": {
"vi": "bạn",
"en": "pupils"
},
"lab": {
"vi": "4A",
"en": "4A"
}
},
{
"kind": "num",
"ans": 40,
"unit": {
"vi": "bạn",
"en": "pupils"
},
"lab": {
"vi": "4B",
"en": "4B"
}
}
],
"steps": [
{
"vi": "Coi 4A là 3 phần, 4B là 4 phần bằng nhau. Tổng số phần: 3 + 4 = 7",
"en": "4A is 3 parts, 4B is 4 equal parts. Total parts: 3 + 4 = 7"
},
{
"vi": "Một phần: 70 : 7 = 10",
"en": "One part: 70 : 7 = 10"
},
{
"vi": "4A: 10 × 3 = 30; 4B: 10 × 4 = 40",
"en": "4A: 10 × 3 = 30; 4B: 10 × 4 = 40"
}
],
"tip": {
"vi": "Kiến thức mở rộng (tổng – tỉ). Tổng : tổng số phần = một phần.",
"en": "Extension (sum and ratio). Sum ÷ total parts = one part."
}
},
{
"id": "F2",
"group": "F",
"lesson": "sumdiff",
"rank": 3,
"adv": true,
"q": {
"vi": "Ngày Tết, cành đào đắt gấp 3 lần cây quất và đắt hơn cây quất 400 000 đồng. Mỗi thứ giá bao nhiêu?",
"en": "At Tết, a peach branch costs 3 times as much as a kumquat tree and 400,000 dong more. What does each cost?"
},
"parts": [
{
"kind": "num",
"ans": 200000,
"unit": {
"vi": "đồng",
"en": "dong"
},
"lab": {
"vi": "Cây quất",
"en": "Kumquat"
}
},
{
"kind": "num",
"ans": 600000,
"unit": {
"vi": "đồng",
"en": "dong"
},
"lab": {
"vi": "Cành đào",
"en": "Peach"
}
}
],
"steps": [
{
"vi": "Quất 1 phần, đào 3 phần. Hiệu số phần: 3 − 1 = 2",
"en": "Kumquat 1 part, peach 3 parts. Difference: 3 − 1 = 2"
},
{
"vi": "Quất: 400000 : 2 = 200000",
"en": "Kumquat: 400000 : 2 = 200000"
},
{
"vi": "Đào: 200000 × 3 = 600000",
"en": "Peach: 200000 × 3 = 600000"
}
],
"tip": {
"vi": "Kiến thức mở rộng (hiệu – tỉ). Hiệu : hiệu số phần = một phần.",
"en": "Extension (difference and ratio). Difference ÷ difference in parts = one part."
}
},
{
"id": "F3",
"group": "F",
"lesson": "sumdiff",
"rank": 3,
"adv": true,
"q": {
"vi": "Năm nay ông 66 tuổi, cháu 10 tuổi. Sau mấy năm nữa tuổi ông gấp 5 lần tuổi cháu?",
"en": "Grandpa is 66 and his grandchild is 10. In how many years will Grandpa be 5 times as old?"
},
"parts": [
{
"kind": "num",
"ans": 4,
"unit": {
"vi": "năm",
"en": "years"
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "Hiệu số tuổi không đổi: 66 − 10 = 56",
"en": "The age gap never changes: 66 − 10 = 56"
},
{
"vi": "Lúc đó cháu 1 phần, ông 5 phần; hiệu 4 phần: 56 : 4 = 14 (tuổi cháu lúc đó)",
"en": "Then: child 1 part, Grandpa 5 parts; gap 4 parts: 56 : 4 = 14 (child's age then)"
},
{
"vi": "14 − 10 = 4",
"en": "14 − 10 = 4"
}
],
"tip": {
"vi": "Hiệu số tuổi của hai người không bao giờ thay đổi.",
"en": "The age gap never changes."
}
},
{
"id": "F4",
"group": "F",
"lesson": "findx",
"rank": 2,
"adv": true,
"q": {
"vi": "Đi bảo tàng, Lan tiêu một nửa số tiền để mua vé, rồi tiêu thêm 10 000 đồng mua nước thì còn 15 000 đồng. Lúc đầu Lan có bao nhiêu tiền?",
"en": "At the museum, Lan spends half her money on a ticket, then 10,000 dong on a drink, and has 15,000 dong left. How much did she start with?"
},
"parts": [
{
"kind": "num",
"ans": 50000,
"unit": {
"vi": "đồng",
"en": "dong"
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "Tính ngược từ cuối. Trước khi mua nước: 15000 + 10000 = 25000",
"en": "Work backwards. Before the drink: 15000 + 10000 = 25000"
},
{
"vi": "Đó là một nửa số tiền, nên lúc đầu: 25000 × 2 = 50000",
"en": "That is half, so at the start: 25000 × 2 = 50000"
}
],
"tip": {
"vi": "Làm ngược từng bước: tiêu thì cộng lại, một nửa thì nhân 2.",
"en": "Undo each step: add back what was spent, double the half."
}
},
{
"id": "F5",
"group": "F",
"lesson": "trees",
"tier": 3,
"adv": false,
"q": {
"vi": "Con đường vào đền dài 200 m. Người ta trồng cây ở cả hai bên đường, cây nọ cách cây kia 5 m, cả hai đầu đường đều có cây. Cần bao nhiêu cây?",
"en": "The road to a temple is 200 m long. Trees are planted on both sides, 5 m apart, with a tree at both ends. How many trees are needed?"
},
"parts": [
{
"kind": "num",
"ans": 82,
"unit": {
"vi": "cây",
"en": "trees"
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "Mỗi bên có 200 : 5 = 40 khoảng",
"en": "Each side has 200 : 5 = 40 gaps"
},
{
"vi": "Mỗi bên: 40 + 1 = 41 cây",
"en": "Each side: 40 + 1 = 41 trees"
},
{
"vi": "Hai bên: 41 × 2 = 82",
"en": "Both sides: 41 × 2 = 82"
}
],
"tip": {
"vi": "Trồng cả hai đầu: số cây = số khoảng + 1.",
"en": "Trees at both ends: trees = gaps + 1."
}
},
{
"id": "F6",
"group": "F",
"lesson": "chick",
"tier": 3,
"adv": false,
"q": {
"vi": "Khu vườn thú có đà điểu và hươu, tất cả 20 con với 56 cái chân. Có bao nhiêu con mỗi loại?",
"en": "A zoo area has ostriches and deer: 20 animals with 56 legs. How many of each?"
},
"parts": [
{
"kind": "num",
"ans": 8,
"unit": {
"vi": "con",
"en": ""
},
"lab": {
"vi": "Hươu",
"en": "Deer"
}
},
{
"kind": "num",
"ans": 12,
"unit": {
"vi": "con",
"en": ""
},
"lab": {
"vi": "Đà điểu",
"en": "Ostriches"
}
}
],
"steps": [
{
"vi": "Giả sử cả 20 con đều có 2 chân: 20 × 2 = 40",
"en": "Suppose all 20 have 2 legs: 20 × 2 = 40"
},
{
"vi": "Thiếu: 56 − 40 = 16 (chân)",
"en": "Missing: 56 − 40 = 16 (legs)"
},
{
"vi": "Mỗi con hươu nhiều hơn 2 chân, số hươu: 16 : 2 = 8",
"en": "Each deer has 2 more legs, deer: 16 : 2 = 8"
},
{
"vi": "Đà điểu: 20 − 8 = 12",
"en": "Ostriches: 20 − 8 = 12"
}
],
"tip": {
"vi": "Giả thiết tạm: coi tất cả là một loại rồi tính phần thiếu.",
"en": "Assume they are all one kind, then fix the difference."
}
},
{
"id": "F7",
"group": "F",
"lesson": "time",
"tier": 3,
"adv": false,
"q": {
"vi": "Ngày Quốc khánh 2/9/2025 là Thứ Ba. Ngày 2/10/2025 là thứ mấy? (Tháng 9 có 30 ngày.)",
"en": "National Day, 2 September 2025, was a Tuesday. What day of the week was 2 October 2025? (September has 30 days.)"
},
"parts": [
{
"kind": "choice",
"opts": {
"vi": [
"Thứ Ba",
"Thứ Tư",
"Thứ Năm",
"Thứ Sáu"
],
"en": [
"Tuesday",
"Wednesday",
"Thursday",
"Friday"
]
},
"ans": 2,
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "Từ 2/9 đến 2/10 là 30 ngày.",
"en": "From 2 Sep to 2 Oct is 30 days."
},
{
"vi": "30 ngày = 4 tuần và 2 ngày (vì 7 × 4 = 28).",
"en": "30 days = 4 weeks and 2 days (since 7 × 4 = 28)."
},
{
"vi": "Thứ Ba đếm thêm 2 ngày là Thứ Năm.",
"en": "Two days after Tuesday is Thursday."
}
],
"tip": {
"vi": "Mỗi 7 ngày thì thứ lặp lại.",
"en": "The weekday repeats every 7 days."
}
},
{
"id": "F8",
"group": "F",
"lesson": "digits",
"rank": 2,
"adv": true,
"q": {
"vi": "Cuốn sách \"Lịch sử Việt Nam cho thiếu nhi\" dày 120 trang. Để đánh số trang cần bao nhiêu chữ số?",
"en": "A children's history book has 120 pages. How many digits are needed to number the pages?"
},
"parts": [
{
"kind": "num",
"ans": 252,
"unit": {
"vi": "chữ số",
"en": "digits"
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "Trang 1 đến 9: 9 chữ số",
"en": "Pages 1–9: 9 digits"
},
{
"vi": "Trang 10 đến 99: 90 × 2 = 180",
"en": "Pages 10–99: 90 × 2 = 180"
},
{
"vi": "Trang 100 đến 120: 21 × 3 = 63",
"en": "Pages 100–120: 21 × 3 = 63"
},
{
"vi": "9 + 180 + 63 = 252",
"en": "9 + 180 + 63 = 252"
}
],
"tip": {
"vi": "Đếm riêng số trang có 1, 2, 3 chữ số.",
"en": "Count 1-, 2- and 3-digit page numbers separately."
}
},
{
"id": "F9",
"group": "F",
"lesson": "seq",
"rank": 2,
"adv": true,
"q": {
"vi": "Nếu cứ đúng 76 năm sao chổi Halley lại quay lại gần Trái Đất một lần, và lần gần nhất là năm 1986, thì lần trước đó và lần sau đó là năm nào? (Thực tế các nhà thiên văn tính được lần tới là năm 2061.)",
"en": "If Halley's Comet came back exactly every 76 years and was last seen in 1986, which years were the visit before and the visit after? (Astronomers actually predict 2061 for the next one.)"
},
"parts": [
{
"kind": "num",
"ans": 1910,
"unit": {
"vi": "",
"en": ""
},
"lab": {
"vi": "Lần trước",
"en": "Before"
}
},
{
"kind": "num",
"ans": 2062,
"unit": {
"vi": "",
"en": ""
},
"lab": {
"vi": "Lần sau",
"en": "After"
}
}
],
"steps": [
{
"vi": "1986 − 76 = 1910",
"en": "1986 − 76 = 1910"
},
{
"vi": "1986 + 76 = 2062",
"en": "1986 + 76 = 2062"
}
],
"tip": {
"vi": "Dãy cách đều: cộng hoặc trừ khoảng cách.",
"en": "Evenly spaced: add or subtract the gap."
}
},
{
"id": "F10",
"group": "F",
"lesson": "div",
"rank": 3,
"adv": true,
"q": {
"vi": "Hai bạn ở hai đầu quãng đường dài 60 km, cùng lúc đạp xe đi về phía nhau. Một bạn đi được 12 km mỗi giờ, bạn kia 18 km mỗi giờ. Sau mấy giờ hai bạn gặp nhau?",
"en": "Two friends at the ends of a 60 km road cycle towards each other at the same time, one at 12 km an hour, the other at 18 km an hour. After how many hours do they meet?"
},
"parts": [
{
"kind": "num",
"ans": 2,
"unit": {
"vi": "giờ",
"en": "hours"
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "Mỗi giờ hai bạn lại gần nhau thêm: 12 + 18 = 30 (km)",
"en": "Each hour they get closer by: 12 + 18 = 30 (km)"
},
{
"vi": "60 : 30 = 2",
"en": "60 : 30 = 2"
}
],
"tip": {
"vi": "Đi ngược chiều: mỗi giờ khoảng cách giảm bằng tổng hai quãng đường.",
"en": "Towards each other: the gap shrinks by both distances each hour."
}
},
{
"id": "F11",
"group": "F",
"lesson": "area",
"tier": 3,
"adv": false,
"q": {
"vi": "Khoảng sân hình chữ nhật dài 30 m, rộng 20 m, ở giữa có một hồ nước hình vuông cạnh 10 m. Phần sân còn lại rộng bao nhiêu mét vuông?",
"en": "A rectangular courtyard is 30 m by 20 m with a square pond of side 10 m in the middle. How many square metres of courtyard are left?"
},
"parts": [
{
"kind": "num",
"ans": 500,
"unit": {
"vi": "m²",
"en": "m²"
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "Cả sân: 30 × 20 = 600",
"en": "Courtyard: 30 × 20 = 600"
},
{
"vi": "Hồ: 10 × 10 = 100",
"en": "Pond: 10 × 10 = 100"
},
{
"vi": "Còn lại: 600 − 100 = 500",
"en": "Left: 600 − 100 = 500"
}
],
"tip": {
"vi": "",
"en": ""
}
},
{
"id": "F12",
"group": "F",
"lesson": "area",
"tier": 3,
"adv": false,
"q": {
"vi": "Vườn hoa hình chữ nhật dài 20 m, rộng 12 m. Người ta làm lối đi rộng 1 m chạy sát quanh bên trong vườn. Tính diện tích lối đi.",
"en": "A flower garden is 20 m by 12 m. A path 1 m wide runs all the way round just inside the edge. Find the area of the path."
},
"parts": [
{
"kind": "num",
"ans": 60,
"unit": {
"vi": "m²",
"en": "m²"
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "Phần trồng hoa: (20 − 2) × (12 − 2) = 18 × 10 = 180",
"en": "Flower bed: (20 − 2) × (12 − 2) = 18 × 10 = 180"
},
{
"vi": "Cả vườn: 20 × 12 = 240",
"en": "Whole garden: 20 × 12 = 240"
},
{
"vi": "Lối đi: 240 − 180 = 60",
"en": "Path: 240 − 180 = 60"
}
],
"tip": {
"vi": "Lối đi ở cả hai phía nên mỗi chiều bớt 2 m.",
"en": "The path is on both sides, so each length loses 2 m."
}
},
{
"id": "F13",
"group": "F",
"lesson": "avg",
"rank": 2,
"adv": true,
"q": {
"vi": "Ba bài kiểm tra Khoa học của bé được 8, 7 và 7 điểm. Bài thứ tư phải được bao nhiêu điểm để trung bình cộng bốn bài là 8 điểm?",
"en": "A child scored 8, 7 and 7 on three science tests. What must the fourth score be for the average of all four to be 8?"
},
"parts": [
{
"kind": "num",
"ans": 10,
"unit": {
"vi": "điểm",
"en": "points"
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "Bốn bài cần tổng: 8 × 4 = 32",
"en": "Four tests need a total of: 8 × 4 = 32"
},
{
"vi": "Ba bài đã có: 8 + 7 + 7 = 22",
"en": "Three tests have: 8 + 7 + 7 = 22"
},
{
"vi": "Bài thứ tư: 32 − 22 = 10",
"en": "Fourth test: 32 − 22 = 10"
}
],
"tip": {
"vi": "Tổng = trung bình cộng × số các số.",
"en": "Total = average × how many."
}
},
{
"id": "F14",
"group": "F",
"lesson": "count",
"rank": 1,
"adv": true,
"q": {
"vi": "An, Bình, Chi mỗi bạn thích một môn khác nhau: Lịch sử, Khoa học, Toán. Bình thích Lịch sử. An không thích Toán. Chi thích môn gì?",
"en": "An, Bình and Chi each like a different subject: History, Science, Maths. Bình likes History. An does not like Maths. Which subject does Chi like?"
},
"parts": [
{
"kind": "choice",
"opts": {
"vi": [
"Lịch sử",
"Khoa học",
"Toán"
],
"en": [
"History",
"Science",
"Maths"
]
},
"ans": 2,
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "Bình thích Lịch sử, nên An và Chi chia nhau Khoa học và Toán.",
"en": "Bình has History, so An and Chi share Science and Maths."
},
{
"vi": "An không thích Toán nên An thích Khoa học; còn lại Chi thích Toán.",
"en": "An doesn't like Maths, so An likes Science and Chi likes Maths."
}
],
"tip": {
"vi": "Loại trừ dần từng khả năng.",
"en": "Rule out possibilities one by one."
}
},
{
"id": "F15",
"group": "F",
"lesson": "divis",
"rank": 2,
"adv": true,
"q": {
"vi": "Một năm của thế kỉ XX viết dạng 19a8 và chia hết cho 9. Chữ số a có thể là những số nào?",
"en": "A year in the 20th century is written 19a8 and divides by 9. Which digits can a be?"
},
"parts": [
{
"kind": "choice",
"opts": {
"vi": [
"0 hoặc 9",
"1 hoặc 8",
"chỉ 9",
"chỉ 0"
],
"en": [
"0 or 9",
"1 or 8",
"only 9",
"only 0"
]
},
"ans": 0,
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "Tổng các chữ số: 1 + 9 + a + 8 = 18 + a",
"en": "Digit sum: 1 + 9 + a + 8 = 18 + a"
},
{
"vi": "18 + a chia hết cho 9 khi a = 0 hoặc a = 9 (năm 1908 hoặc 1998).",
"en": "18 + a divides by 9 when a = 0 or a = 9 (1908 or 1998)."
}
],
"tip": {
"vi": "Số chia hết cho 9 khi tổng các chữ số chia hết cho 9.",
"en": "A number divides by 9 when its digit sum does."
}
},
{
"id": "H1a",
"group": "H",
"lesson": "area",
"tier": 1,
"adv": false,
"q": {
"vi": "Viên gạch lát nền hình vuông cạnh 40 cm. Tính diện tích một viên gạch.",
"en": "A square floor tile has sides of 40 cm. Find the area of one tile."
},
"parts": [
{
"kind": "num",
"ans": 1600,
"unit": {
"vi": "cm²",
"en": "cm²"
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "40 × 40 = 1600",
"en": "40 × 40 = 1600"
}
],
"tip": {
"vi": "Diện tích hình vuông = cạnh × cạnh.",
"en": "Square area = side × side."
}
},
{
"id": "H1b",
"group": "H",
"lesson": "area",
"tier": 2,
"adv": false,
"q": {
"vi": "Phòng khách dài 6 m, rộng 4 m, lát bằng gạch vuông cạnh 40 cm. Cần bao nhiêu viên gạch?",
"en": "A living room is 6 m by 4 m and is tiled with 40 cm square tiles. How many tiles are needed?"
},
"parts": [
{
"kind": "num",
"ans": 150,
"unit": {
"vi": "viên",
"en": "tiles"
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "6 m = 600 cm; 4 m = 400 cm",
"en": "6 m = 600 cm; 4 m = 400 cm"
},
{
"vi": "Theo chiều dài: 600 : 40 = 15 viên; theo chiều rộng: 400 : 40 = 10 viên",
"en": "Along the length: 600 : 40 = 15; along the width: 400 : 40 = 10"
},
{
"vi": "15 × 10 = 150",
"en": "15 × 10 = 150"
}
],
"tip": {
"vi": "Đổi cùng đơn vị rồi xếp gạch theo hàng.",
"en": "Use the same units, then count tiles in rows."
}
},
{
"id": "H1c",
"group": "H",
"lesson": "area",
"tier": 3,
"adv": false,
"q": {
"vi": "Phòng dài 6 m, rộng 4 m lát gạch vuông cạnh 40 cm. Góc tủ âm tường dài 2 m, rộng 80 cm không cần lát. Gạch bán theo hộp 10 viên, mỗi hộp 300 000 đồng. Mua gạch hết bao nhiêu tiền?",
"en": "A 6 m by 4 m room is tiled with 40 cm square tiles, except a built-in cupboard area 2 m by 80 cm. Tiles come in boxes of 10 at 300,000 dong a box. How much do the tiles cost?"
},
"parts": [
{
"kind": "num",
"ans": 4200000,
"unit": {
"vi": "đồng",
"en": "dong"
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "Cả phòng: (600 : 40) × (400 : 40) = 15 × 10 = 150 viên",
"en": "Whole room: (600 : 40) × (400 : 40) = 15 × 10 = 150 tiles"
},
{
"vi": "Góc tủ: (200 : 40) × (80 : 40) = 5 × 2 = 10 viên",
"en": "Cupboard: (200 : 40) × (80 : 40) = 5 × 2 = 10 tiles"
},
{
"vi": "Cần lát: 150 − 10 = 140 viên = 14 hộp",
"en": "To lay: 150 − 10 = 140 tiles = 14 boxes"
},
{
"vi": "300000 × 14 = 4200000",
"en": "300000 × 14 = 4200000"
}
],
"tip": {
"vi": "Bớt phần không lát rồi mới tính số hộp.",
"en": "Remove the untiled part before counting boxes."
}
},
{
"id": "H2a",
"group": "H",
"lesson": "area",
"tier": 1,
"adv": false,
"q": {
"vi": "Mảnh vườn hình chữ nhật dài 15 m, rộng 8 m. Tính chu vi mảnh vườn.",
"en": "A rectangular garden is 15 m by 8 m. Find its perimeter."
},
"parts": [
{
"kind": "num",
"ans": 46,
"unit": {
"vi": "m",
"en": "m"
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "(15 + 8) × 2 = 46",
"en": "(15 + 8) × 2 = 46"
}
],
"tip": {
"vi": "Chu vi hình chữ nhật = (dài + rộng) × 2.",
"en": "Rectangle perimeter = (length + width) × 2."
}
},
{
"id": "H2b",
"group": "H",
"lesson": "area",
"tier": 2,
"adv": false,
"q": {
"vi": "Bác Ba rào quanh mảnh vườn hình chữ nhật dài 15 m, rộng 8 m, chừa một lối vào rộng 2 m. Hàng rào dài bao nhiêu mét?",
"en": "Uncle Ba fences a 15 m by 8 m garden, leaving a 2 m gateway. How long is the fence?"
},
"parts": [
{
"kind": "num",
"ans": 44,
"unit": {
"vi": "m",
"en": "m"
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "Chu vi: (15 + 8) × 2 = 46",
"en": "Perimeter: (15 + 8) × 2 = 46"
},
{
"vi": "Bớt lối vào: 46 − 2 = 44",
"en": "Minus the gateway: 46 − 2 = 44"
}
],
"tip": {
"vi": "Hàng rào = chu vi − lối vào.",
"en": "Fence = perimeter − gateway."
}
},
{
"id": "H2c",
"group": "H",
"lesson": "area",
"tier": 3,
"adv": false,
"q": {
"vi": "Hàng rào quanh vườn dài 44 m (đã chừa lối vào). Dọc hàng rào cứ 2 m đóng một cọc, hai bên lối vào đều có cọc. Cần bao nhiêu cọc?",
"en": "A fence 44 m long (with a gateway left open) has a post every 2 m and a post on each side of the gateway. How many posts?"
},
"parts": [
{
"kind": "num",
"ans": 23,
"unit": {
"vi": "cọc",
"en": "posts"
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "Hàng rào là một đường không khép kín, có cọc ở hai đầu.",
"en": "The fence is an open line with a post at each end."
},
{
"vi": "Số khoảng: 44 : 2 = 22",
"en": "Gaps: 44 : 2 = 22"
},
{
"vi": "Số cọc: 22 + 1 = 23",
"en": "Posts: 22 + 1 = 23"
}
],
"tip": {
"vi": "Như trồng cây hai đầu: số cọc = số khoảng + 1.",
"en": "Like trees at both ends: posts = gaps + 1."
}
},
{
"id": "H3a",
"group": "H",
"lesson": "area",
"tier": 1,
"adv": false,
"q": {
"vi": "Bức ảnh gia đình hình chữ nhật dài 20 cm, rộng 15 cm. Tính diện tích bức ảnh.",
"en": "A family photo is 20 cm by 15 cm. Find its area."
},
"parts": [
{
"kind": "num",
"ans": 300,
"unit": {
"vi": "cm²",
"en": "cm²"
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "20 × 15 = 300",
"en": "20 × 15 = 300"
}
],
"tip": {
"vi": "Diện tích hình chữ nhật = dài × rộng (cùng đơn vị).",
"en": "Rectangle area = length × width (same units)."
}
},
{
"id": "H3b",
"group": "H",
"lesson": "area",
"tier": 2,
"adv": false,
"q": {
"vi": "Bức ảnh dài 20 cm, rộng 15 cm được lồng vào khung có viền rộng 2 cm ở mọi phía. Khung bên ngoài dài, rộng bao nhiêu? Chu vi bên ngoài là bao nhiêu?",
"en": "A 20 cm by 15 cm photo is put in a frame with a 2 cm border on every side. What are the outer length and width, and the outer perimeter?"
},
"parts": [
{
"kind": "num",
"ans": 24,
"unit": {
"vi": "cm",
"en": "cm"
},
"lab": {
"vi": "Dài",
"en": "Length"
}
},
{
"kind": "num",
"ans": 19,
"unit": {
"vi": "cm",
"en": "cm"
},
"lab": {
"vi": "Rộng",
"en": "Width"
}
},
{
"kind": "num",
"ans": 86,
"unit": {
"vi": "cm",
"en": "cm"
},
"lab": {
"vi": "Chu vi",
"en": "Perimeter"
}
}
],
"steps": [
{
"vi": "Mỗi chiều thêm 2 cm ở hai phía: 20 + 4 = 24; 15 + 4 = 19",
"en": "Each side adds 2 cm twice: 20 + 4 = 24; 15 + 4 = 19"
},
{
"vi": "(24 + 19) × 2 = 86",
"en": "(24 + 19) × 2 = 86"
}
],
"tip": {
"vi": "Viền ở cả hai phía nên cộng 2 lần.",
"en": "The border is on both sides, so add it twice."
}
},
{
"id": "H3c",
"group": "H",
"lesson": "area",
"tier": 3,
"adv": false,
"q": {
"vi": "Bức ảnh dài 20 cm, rộng 15 cm lồng trong khung viền rộng 2 cm mọi phía (khung ngoài 24 cm × 19 cm). Tính diện tích phần viền khung.",
"en": "A 20 cm by 15 cm photo sits in a frame with a 2 cm border (outside 24 cm by 19 cm). Find the area of the border."
},
"parts": [
{
"kind": "num",
"ans": 156,
"unit": {
"vi": "cm²",
"en": "cm²"
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "Cả khung: 24 × 19 = 456",
"en": "Whole frame: 24 × 19 = 456"
},
{
"vi": "Ảnh: 20 × 15 = 300",
"en": "Photo: 20 × 15 = 300"
},
{
"vi": "Viền: 456 − 300 = 156",
"en": "Border: 456 − 300 = 156"
}
],
"tip": {
"vi": "Diện tích viền = hình ngoài − hình trong.",
"en": "Border = outer area − inner area."
}
},
{
"id": "H4a",
"group": "H",
"lesson": "area",
"tier": 1,
"adv": false,
"q": {
"vi": "Sân trường hình vuông cạnh 30 m. Tính chu vi sân.",
"en": "A square playground has sides of 30 m. Find its perimeter."
},
"parts": [
{
"kind": "num",
"ans": 120,
"unit": {
"vi": "m",
"en": "m"
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "30 × 4 = 120",
"en": "30 × 4 = 120"
}
],
"tip": {
"vi": "Chu vi hình vuông = cạnh × 4.",
"en": "Square perimeter = side × 4."
}
},
{
"id": "H4b",
"group": "H",
"lesson": "area",
"tier": 2,
"adv": false,
"q": {
"vi": "Sân trường hình vuông cạnh 30 m. Giờ thể dục, bé chạy 5 vòng quanh sân. Bé chạy được bao nhiêu mét?",
"en": "A playground is a square of side 30 m. A child runs 5 laps round it. How many metres is that?"
},
"parts": [
{
"kind": "num",
"ans": 600,
"unit": {
"vi": "m",
"en": "m"
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "Một vòng: 30 × 4 = 120",
"en": "One lap: 30 × 4 = 120"
},
{
"vi": "5 vòng: 120 × 5 = 600",
"en": "5 laps: 120 × 5 = 600"
}
],
"tip": {
"vi": "Một vòng bằng chu vi sân.",
"en": "One lap = the perimeter."
}
},
{
"id": "H4c",
"group": "H",
"lesson": "area",
"tier": 3,
"adv": false,
"q": {
"vi": "Sân trường hình vuông cạnh 30 m. Bé muốn chạy được ít nhất 1 km. Bé phải chạy ít nhất bao nhiêu vòng sân?",
"en": "A playground is a square of side 30 m. A child wants to run at least 1 km. At least how many laps must she run?"
},
"parts": [
{
"kind": "num",
"ans": 9,
"unit": {
"vi": "vòng",
"en": "laps"
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "Một vòng: 30 × 4 = 120 (m); 1 km = 1000 m",
"en": "One lap: 30 × 4 = 120 (m); 1 km = 1000 m"
},
{
"vi": "1000 : 120 = 8 (dư 40)",
"en": "1000 : 120 = 8 (remainder 40)"
},
{
"vi": "8 vòng chưa đủ nên cần 8 + 1 = 9",
"en": "8 laps are not enough, so 8 + 1 = 9"
}
],
"tip": {
"vi": "Còn dư thì phải chạy thêm một vòng.",
"en": "With a remainder, one more lap is needed."
}
},
{
"id": "H5a",
"group": "H",
"lesson": "angle",
"tier": 1,
"adv": false,
"q": {
"vi": "Lúc 9 giờ đúng, kim giờ và kim phút tạo thành góc gì?",
"en": "At exactly 9 o'clock, what kind of angle do the hands make?"
},
"parts": [
{
"kind": "choice",
"opts": {
"vi": [
"Góc nhọn",
"Góc vuông",
"Góc tù",
"Góc bẹt"
],
"en": [
"Acute",
"Right",
"Obtuse",
"Straight"
]
},
"ans": 1,
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "Kim phút chỉ số 12, kim giờ chỉ số 9: hai kim vuông góc.",
"en": "Minute hand at 12, hour hand at 9: they are perpendicular."
}
],
"tip": {
"vi": "Góc vuông bằng 90°.",
"en": "A right angle is 90°."
}
},
{
"id": "H5b",
"group": "H",
"lesson": "angle",
"tier": 2,
"adv": false,
"q": {
"vi": "Mặt đồng hồ chia thành 12 khoảng bằng nhau, cả vòng là 360°. Góc giữa hai số liền nhau (ví dụ số 12 và số 1) là bao nhiêu độ?",
"en": "A clock face has 12 equal spaces and a full turn is 360°. What is the angle between two neighbouring numbers (for example 12 and 1)?"
},
"parts": [
{
"kind": "num",
"ans": 30,
"unit": {
"vi": "°",
"en": "°"
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "360 : 12 = 30",
"en": "360 : 12 = 30"
},
{
"vi": "Kiểm tra lúc 9 giờ: từ 9 đến 12 có 3 khoảng, 30 × 3 = 90",
"en": "Check 9 o'clock: 3 spaces from 9 to 12, 30 × 3 = 90"
}
],
"tip": {
"vi": "Cả vòng 360° chia đều cho 12 khoảng.",
"en": "Share 360° equally among 12 spaces."
}
},
{
"id": "H5c",
"group": "H",
"lesson": "angle",
"tier": 3,
"adv": false,
"q": {
"vi": "Mỗi khoảng giữa hai số liền nhau trên mặt đồng hồ là 30°. Lúc 4 giờ đúng hai kim tạo góc bao nhiêu độ, và đó là góc gì?",
"en": "Each space between neighbouring numbers on a clock is 30°. At exactly 4 o'clock, what angle do the hands make, and what kind of angle is it?"
},
"parts": [
{
"kind": "num",
"ans": 120,
"unit": {
"vi": "°",
"en": "°"
},
"lab": {
"vi": "Số đo",
"en": "Size"
}
},
{
"kind": "choice",
"opts": {
"vi": [
"Góc nhọn",
"Góc vuông",
"Góc tù",
"Góc bẹt"
],
"en": [
"Acute",
"Right",
"Obtuse",
"Straight"
]
},
"ans": 2,
"lab": {
"vi": "Loại góc",
"en": "Kind"
}
}
],
"steps": [
{
"vi": "Từ số 12 đến số 4 có 4 khoảng: 30 × 4 = 120",
"en": "From 12 to 4 there are 4 spaces: 30 × 4 = 120"
},
{
"vi": "120° lớn hơn 90° và bé hơn 180° nên là góc tù.",
"en": "120° is between 90° and 180°, so it is obtuse."
}
],
"tip": {
"vi": "Đếm số khoảng rồi nhân với 30°.",
"en": "Count the spaces and multiply by 30°."
}
},
{
"id": "H6a",
"group": "H",
"lesson": "lines",
"tier": 1,
"adv": false,
"q": {
"vi": "Khung cửa sổ hình chữ nhật có mấy cặp cạnh song song?",
"en": "How many pairs of parallel sides does a rectangular window frame have?"
},
"parts": [
{
"kind": "num",
"ans": 2,
"unit": {
"vi": "cặp",
"en": "pairs"
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "Hai cạnh dài song song với nhau, hai cạnh ngắn song song với nhau: 1 + 1 = 2",
"en": "The two long sides are parallel and the two short sides are parallel: 1 + 1 = 2"
}
],
"tip": {
"vi": "Hình chữ nhật có 2 cặp cạnh song song và 4 góc vuông.",
"en": "A rectangle has 2 pairs of parallel sides and 4 right angles."
}
},
{
"id": "H6b",
"group": "H",
"lesson": "lines",
"tier": 2,
"adv": false,
"q": {
"vi": "Cửa sổ hình chữ nhật được chia bởi một thanh dọc (song song với hai cạnh bên) thành 2 ô. Trên cửa sổ có tất cả bao nhiêu hình chữ nhật?",
"en": "A rectangular window is split by one vertical bar into 2 panes. How many rectangles can you see in total?"
},
"parts": [
{
"kind": "num",
"ans": 3,
"unit": {
"vi": "hình",
"en": "rectangles"
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "2 ô nhỏ và 1 hình ghép cả hai ô: 2 + 1 = 3",
"en": "2 small panes plus 1 made of both: 2 + 1 = 3"
}
],
"tip": {
"vi": "Đếm cả hình đơn và hình ghép.",
"en": "Count single panes and combined ones."
}
},
{
"id": "H6c",
"group": "H",
"lesson": "lines",
"tier": 3,
"adv": false,
"q": {
"vi": "Cửa sổ hình chữ nhật có 2 thanh dọc và 1 thanh ngang (vuông góc với các thanh dọc), chia thành 3 cột, 2 hàng ô. Có tất cả bao nhiêu hình chữ nhật?",
"en": "A window has 2 vertical bars and 1 horizontal bar (perpendicular to them), making 3 columns and 2 rows of panes. How many rectangles are there in total?"
},
"parts": [
{
"kind": "num",
"ans": 18,
"unit": {
"vi": "hình",
"en": "rectangles"
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "Theo chiều ngang chọn được: 3 + 2 + 1 = 6 kiểu",
"en": "Across: 3 + 2 + 1 = 6 choices"
},
{
"vi": "Theo chiều dọc chọn được: 2 + 1 = 3 kiểu",
"en": "Down: 2 + 1 = 3 choices"
},
{
"vi": "6 × 3 = 18",
"en": "6 × 3 = 18"
}
],
"tip": {
"vi": "Quy tắc nhân: số kiểu theo hàng × số kiểu theo cột.",
"en": "Multiply the choices across by the choices down."
}
},
{
"id": "H7a",
"group": "H",
"lesson": "area",
"tier": 1,
"adv": false,
"q": {
"vi": "Tấm bìa hình chữ nhật dài 12 cm, rộng 8 cm. Tính diện tích tấm bìa.",
"en": "A card is 12 cm by 8 cm. Find its area."
},
"parts": [
{
"kind": "num",
"ans": 96,
"unit": {
"vi": "cm²",
"en": "cm²"
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "12 × 8 = 96",
"en": "12 × 8 = 96"
}
],
"tip": {
"vi": "Diện tích hình chữ nhật = dài × rộng (cùng đơn vị).",
"en": "Rectangle area = length × width (same units)."
}
},
{
"id": "H7b",
"group": "H",
"lesson": "area",
"tier": 2,
"adv": false,
"q": {
"vi": "Tấm bìa hình chữ nhật dài 12 cm, rộng 8 cm. Cắt ở 4 góc 4 hình vuông cạnh 2 cm. Diện tích phần bìa còn lại là bao nhiêu?",
"en": "From a 12 cm by 8 cm card, a 2 cm square is cut from each of the 4 corners. What area is left?"
},
"parts": [
{
"kind": "num",
"ans": 80,
"unit": {
"vi": "cm²",
"en": "cm²"
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "Tấm bìa: 12 × 8 = 96",
"en": "Card: 12 × 8 = 96"
},
{
"vi": "4 hình vuông: 2 × 2 × 4 = 16",
"en": "4 squares: 2 × 2 × 4 = 16"
},
{
"vi": "Còn lại: 96 − 16 = 80",
"en": "Left: 96 − 16 = 80"
}
],
"tip": {
"vi": "Trừ tất cả các phần bị cắt.",
"en": "Subtract every piece that is cut."
}
},
{
"id": "H7c",
"group": "H",
"lesson": "area",
"tier": 3,
"adv": false,
"q": {
"vi": "Tấm bìa 12 cm × 8 cm bị cắt 4 hình vuông cạnh 2 cm ở 4 góc (còn 80 cm²), rồi gấp mép lên thành hộp không nắp cao 2 cm. Tính diện tích đáy hộp và tổng diện tích 4 mặt xung quanh.",
"en": "A 12 cm by 8 cm card has 2 cm squares cut from its corners (80 cm² left), then its edges fold up into an open box 2 cm high. Find the area of the base and of the 4 sides together."
},
"parts": [
{
"kind": "num",
"ans": 32,
"unit": {
"vi": "cm²",
"en": "cm²"
},
"lab": {
"vi": "Đáy",
"en": "Base"
}
},
{
"kind": "num",
"ans": 48,
"unit": {
"vi": "cm²",
"en": "cm²"
},
"lab": {
"vi": "Xung quanh",
"en": "Sides"
}
}
],
"steps": [
{
"vi": "Đáy dài 12 − 4 = 8, rộng 8 − 4 = 4",
"en": "Base length 12 − 4 = 8, width 8 − 4 = 4"
},
{
"vi": "Đáy: 8 × 4 = 32",
"en": "Base: 8 × 4 = 32"
},
{
"vi": "Xung quanh: 80 − 32 = 48",
"en": "Sides: 80 − 32 = 48"
}
],
"tip": {
"vi": "Phần bìa còn lại = đáy + các mặt xung quanh.",
"en": "The card left = base + sides."
}
},
{
"id": "H8a",
"group": "H",
"lesson": "area",
"tier": 1,
"adv": false,
"q": {
"vi": "3 m² bằng bao nhiêu đề-xi-mét vuông?",
"en": "How many square decimetres are in 3 m²?"
},
"parts": [
{
"kind": "num",
"ans": 300,
"unit": {
"vi": "dm²",
"en": "dm²"
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "1 m² = 100 dm²; 3 × 100 = 300",
"en": "1 m² = 100 dm²; 3 × 100 = 300"
}
],
"tip": {
"vi": "1 m² = 100 dm².",
"en": "1 m² = 100 dm²."
}
},
{
"id": "H8b",
"group": "H",
"lesson": "area",
"tier": 2,
"adv": false,
"q": {
"vi": "Một tấm kính cửa hình chữ nhật dài 8 dm, rộng 5 dm. Diện tích tấm kính bao nhiêu đề-xi-mét vuông?",
"en": "A glass pane is 8 dm by 5 dm. What is its area in dm²?"
},
"parts": [
{
"kind": "num",
"ans": 40,
"unit": {
"vi": "dm²",
"en": "dm²"
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "8 × 5 = 40",
"en": "8 × 5 = 40"
}
],
"tip": {
"vi": "Diện tích hình chữ nhật = dài × rộng (cùng đơn vị).",
"en": "Rectangle area = length × width (same units)."
}
},
{
"id": "H8c",
"group": "H",
"lesson": "area",
"tier": 3,
"adv": false,
"q": {
"vi": "Cửa kính nhà Bân gồm 6 tấm, mỗi tấm dài 8 dm, rộng 5 dm. Tổng diện tích kính là bao nhiêu? Viết dưới dạng … m² … dm².",
"en": "Bân's window has 6 panes, each 8 dm by 5 dm. What is the total glass area? Write it as … m² … dm²."
},
"parts": [
{
"kind": "num",
"ans": 2,
"unit": {
"vi": "m²",
"en": "m²"
},
"lab": {
"vi": "",
"en": ""
}
},
{
"kind": "num",
"ans": 40,
"unit": {
"vi": "dm²",
"en": "dm²"
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "Một tấm: 8 × 5 = 40 (dm²)",
"en": "One pane: 8 × 5 = 40 (dm²)"
},
{
"vi": "6 tấm: 40 × 6 = 240 (dm²)",
"en": "6 panes: 40 × 6 = 240 (dm²)"
},
{
"vi": "240 dm² = 200 dm² + 40 dm² = 2 m² 40 dm²",
"en": "240 dm² = 200 dm² + 40 dm² = 2 m² 40 dm²"
}
],
"tip": {
"vi": "100 dm² = 1 m².",
"en": "100 dm² = 1 m²."
}
},
{
"id": "H9a",
"group": "H",
"lesson": "area",
"tier": 1,
"adv": false,
"q": {
"vi": "Phòng khách hình chữ nhật dài 5 m, rộng 4 m. Tính diện tích phòng.",
"en": "A living room is 5 m by 4 m. Find its area."
},
"parts": [
{
"kind": "num",
"ans": 20,
"unit": {
"vi": "m²",
"en": "m²"
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "5 × 4 = 20",
"en": "5 × 4 = 20"
}
],
"tip": {
"vi": "Diện tích hình chữ nhật = dài × rộng (cùng đơn vị).",
"en": "Rectangle area = length × width (same units)."
}
},
{
"id": "H9b",
"group": "H",
"lesson": "area",
"tier": 2,
"adv": false,
"q": {
"vi": "Phòng khách dài 5 m, rộng 4 m được nối với bếp dài 3 m, rộng 4 m (chung bức tường 4 m) thành một phòng hình chữ nhật lớn. Tính diện tích và chu vi phòng mới.",
"en": "A 5 m by 4 m living room is joined to a 3 m by 4 m kitchen along their shared 4 m wall to make one big rectangle. Find its area and perimeter."
},
"parts": [
{
"kind": "num",
"ans": 32,
"unit": {
"vi": "m²",
"en": "m²"
},
"lab": {
"vi": "Diện tích",
"en": "Area"
}
},
{
"kind": "num",
"ans": 24,
"unit": {
"vi": "m",
"en": "m"
},
"lab": {
"vi": "Chu vi",
"en": "Perimeter"
}
}
],
"steps": [
{
"vi": "Chiều dài mới: 5 + 3 = 8",
"en": "New length: 5 + 3 = 8"
},
{
"vi": "Diện tích: 8 × 4 = 32",
"en": "Area: 8 × 4 = 32"
},
{
"vi": "Chu vi: (8 + 4) × 2 = 24",
"en": "Perimeter: (8 + 4) × 2 = 24"
}
],
"tip": {
"vi": "Ghép hai hình chữ nhật cùng chiều rộng thành một.",
"en": "Join two rectangles with the same width into one."
}
},
{
"id": "H9c",
"group": "H",
"lesson": "area",
"tier": 3,
"adv": false,
"q": {
"vi": "Phòng khách dài 5 m, rộng 4 m. Bếp dài 3 m, rộng 2 m nối vào cạnh 4 m, đặt sát một góc, tạo thành phòng hình chữ L. Tính diện tích và chu vi phòng chữ L.",
"en": "A 5 m by 4 m living room has a 3 m by 2 m kitchen joined to its 4 m wall at one corner, making an L shape. Find the area and perimeter of the L."
},
"parts": [
{
"kind": "num",
"ans": 26,
"unit": {
"vi": "m²",
"en": "m²"
},
"lab": {
"vi": "Diện tích",
"en": "Area"
}
},
{
"kind": "num",
"ans": 24,
"unit": {
"vi": "m",
"en": "m"
},
"lab": {
"vi": "Chu vi",
"en": "Perimeter"
}
}
],
"steps": [
{
"vi": "Diện tích: 5 × 4 + 3 × 2 = 20 + 6 = 26",
"en": "Area: 5 × 4 + 3 × 2 = 20 + 6 = 26"
},
{
"vi": "Đẩy hai cạnh của chỗ lõm ra ngoài thì được hình chữ nhật 8 m × 4 m, chu vi không đổi.",
"en": "Push the two edges of the notch outwards to get an 8 m by 4 m rectangle; the perimeter stays the same."
},
{
"vi": "(8 + 4) × 2 = 24",
"en": "(8 + 4) × 2 = 24"
}
],
"tip": {
"vi": "Hình chữ L có chu vi bằng hình chữ nhật bao ngoài.",
"en": "An L shape has the same perimeter as the rectangle around it."
}
},
{
"id": "H10a",
"group": "H",
"lesson": "area",
"tier": 1,
"adv": false,
"q": {
"vi": "Khung tranh hình vuông có chu vi 36 cm. Cạnh khung dài bao nhiêu?",
"en": "A square picture frame has a perimeter of 36 cm. How long is each side?"
},
"parts": [
{
"kind": "num",
"ans": 9,
"unit": {
"vi": "cm",
"en": "cm"
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "36 : 4 = 9",
"en": "36 : 4 = 9"
}
],
"tip": {
"vi": "Cạnh hình vuông = chu vi : 4.",
"en": "Square side = perimeter ÷ 4."
}
},
{
"id": "H10b",
"group": "H",
"lesson": "area",
"tier": 2,
"adv": false,
"q": {
"vi": "Khung tranh hình vuông có chu vi 36 cm. Tính diện tích khung tranh.",
"en": "A square frame has a perimeter of 36 cm. Find its area."
},
"parts": [
{
"kind": "num",
"ans": 81,
"unit": {
"vi": "cm²",
"en": "cm²"
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "Cạnh: 36 : 4 = 9",
"en": "Side: 36 : 4 = 9"
},
{
"vi": "Diện tích: 9 × 9 = 81",
"en": "Area: 9 × 9 = 81"
}
],
"tip": {
"vi": "Tìm cạnh trước, rồi tính diện tích.",
"en": "Find the side first, then the area."
}
},
{
"id": "H10c",
"group": "H",
"lesson": "area",
"tier": 3,
"adv": false,
"q": {
"vi": "Sợi dây dài 36 cm uốn thành hình vuông thì được diện tích 81 cm². Uốn sợi dây đó thành hình chữ nhật có chiều dài gấp đôi chiều rộng thì diện tích bao nhiêu? Bé hơn hình vuông bao nhiêu?",
"en": "A 36 cm wire bent into a square encloses 81 cm². If it is bent into a rectangle twice as long as it is wide, what is the area, and how much smaller than the square is it?"
},
"parts": [
{
"kind": "num",
"ans": 72,
"unit": {
"vi": "cm²",
"en": "cm²"
},
"lab": {
"vi": "Diện tích",
"en": "Area"
}
},
{
"kind": "num",
"ans": 9,
"unit": {
"vi": "cm²",
"en": "cm²"
},
"lab": {
"vi": "Bé hơn",
"en": "Smaller by"
}
}
],
"steps": [
{
"vi": "Nửa chu vi: 36 : 2 = 18, gồm 3 phần bằng nhau (rộng 1 phần, dài 2 phần)",
"en": "Half the perimeter: 36 : 2 = 18, which is 3 equal parts (width 1, length 2)"
},
{
"vi": "Rộng: 18 : 3 = 6; dài: 6 × 2 = 12",
"en": "Width: 18 : 3 = 6; length: 6 × 2 = 12"
},
{
"vi": "Diện tích: 12 × 6 = 72; 81 − 72 = 9",
"en": "Area: 12 × 6 = 72; 81 − 72 = 9"
}
],
"tip": {
"vi": "Cùng chu vi chưa chắc cùng diện tích.",
"en": "The same perimeter can give different areas."
}
},
{
"id": "H11a",
"group": "H",
"lesson": "hbh",
"tier": 1,
"adv": false,
"q": {
"vi": "Hoa văn trên khăn trải bàn là các hình thoi. Hình thoi có mấy cặp cạnh song song?",
"en": "A tablecloth pattern is made of rhombuses. How many pairs of parallel sides does a rhombus have?"
},
"parts": [
{
"kind": "num",
"ans": 2,
"unit": {
"vi": "cặp",
"en": "pairs"
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "Hình thoi là hình bình hành có 4 cạnh bằng nhau, nên có 2 cặp cạnh song song.",
"en": "A rhombus is a parallelogram with 4 equal sides, so it has 2 pairs of parallel sides."
}
],
"tip": {
"vi": "Hình thoi: 2 cặp cạnh song song, 4 cạnh bằng nhau.",
"en": "Rhombus: 2 pairs of parallel sides, 4 equal sides."
}
},
{
"id": "H11b",
"group": "H",
"lesson": "hbh",
"tier": 2,
"adv": false,
"q": {
"vi": "Mỗi hình thoi trên khăn có cạnh 6 cm. Tính chu vi một hình thoi.",
"en": "Each rhombus on the cloth has sides of 6 cm. Find its perimeter."
},
"parts": [
{
"kind": "num",
"ans": 24,
"unit": {
"vi": "cm",
"en": "cm"
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "4 cạnh bằng nhau: 6 × 4 = 24",
"en": "4 equal sides: 6 × 4 = 24"
}
],
"tip": {
"vi": "Chu vi hình thoi = cạnh × 4.",
"en": "Rhombus perimeter = side × 4."
}
},
{
"id": "H11c",
"group": "H",
"lesson": "hbh",
"tier": 3,
"adv": false,
"q": {
"vi": "Hai hình thoi cạnh 6 cm ghép sát nhau chung một cạnh. Tính chu vi hình mới.",
"en": "Two rhombuses with sides of 6 cm are joined along one side. Find the perimeter of the new shape."
},
"parts": [
{
"kind": "num",
"ans": 36,
"unit": {
"vi": "cm",
"en": "cm"
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "Hai hình có 4 × 2 = 8 cạnh; cạnh chung nằm bên trong, mất 2 cạnh: 8 − 2 = 6",
"en": "Two shapes have 4 × 2 = 8 sides; the shared side is inside, losing 2: 8 − 2 = 6"
},
{
"vi": "Chu vi: 6 × 6 = 36",
"en": "Perimeter: 6 × 6 = 36"
}
],
"tip": {
"vi": "Cạnh chung không thuộc chu vi.",
"en": "A shared side is not part of the perimeter."
}
},
{
"id": "H12a",
"group": "H",
"lesson": "area",
"tier": 1,
"adv": false,
"q": {
"vi": "Vườn rau hình chữ nhật dài 10 m, rộng 6 m. Tính diện tích vườn.",
"en": "A vegetable garden is 10 m by 6 m. Find its area."
},
"parts": [
{
"kind": "num",
"ans": 60,
"unit": {
"vi": "m²",
"en": "m²"
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "10 × 6 = 60",
"en": "10 × 6 = 60"
}
],
"tip": {
"vi": "Diện tích hình chữ nhật = dài × rộng (cùng đơn vị).",
"en": "Rectangle area = length × width (same units)."
}
},
{
"id": "H12b",
"group": "H",
"lesson": "area",
"tier": 2,
"adv": false,
"q": {
"vi": "Vườn rau dài 10 m, rộng 6 m. Người ta làm một lối đi rộng 1 m cắt ngang vườn, song song với chiều rộng (lối đi dài 6 m). Diện tích còn lại để trồng rau là bao nhiêu?",
"en": "A 10 m by 6 m garden has a 1 m wide path across it, parallel to the width (6 m long). What area is left for vegetables?"
},
"parts": [
{
"kind": "num",
"ans": 54,
"unit": {
"vi": "m²",
"en": "m²"
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "Vườn: 10 × 6 = 60",
"en": "Garden: 10 × 6 = 60"
},
{
"vi": "Lối đi: 6 × 1 = 6",
"en": "Path: 6 × 1 = 6"
},
{
"vi": "Còn lại: 60 − 6 = 54",
"en": "Left: 60 − 6 = 54"
}
],
"tip": {
"vi": "Diện tích trồng = cả vườn − lối đi.",
"en": "Growing area = garden − path."
}
},
{
"id": "H12c",
"group": "H",
"lesson": "area",
"tier": 3,
"adv": false,
"q": {
"vi": "Vườn rau dài 10 m, rộng 6 m có hai lối đi rộng 1 m vuông góc với nhau: một lối song song chiều rộng, một lối song song chiều dài. Diện tích trồng rau còn bao nhiêu?",
"en": "A 10 m by 6 m garden has two 1 m wide paths crossing at right angles, one parallel to each side. What area is left for vegetables?"
},
"parts": [
{
"kind": "num",
"ans": 45,
"unit": {
"vi": "m²",
"en": "m²"
},
"lab": {
"vi": "",
"en": ""
}
}
],
"steps": [
{
"vi": "Dồn hai lối đi sát mép vườn, phần trồng rau thành hình chữ nhật: (10 − 1) × (6 − 1) = 9 × 5 = 45",
"en": "Slide both paths to the edge; the beds form a rectangle: (10 − 1) × (6 − 1) = 9 × 5 = 45"
},
{
"vi": "Kiểm tra: 60 − 6 − 10 + 1 = 45 (ô giao nhau bị trừ hai lần)",
"en": "Check: 60 − 6 − 10 + 1 = 45 (the crossing square was subtracted twice)"
}
],
"tip": {
"vi": "Chỗ hai lối đi giao nhau chỉ tính một lần.",
"en": "Count the crossing square only once."
}
}
]
};
