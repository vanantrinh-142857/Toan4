/* ============================================================
   CHUYÊN ĐỀ NÂNG CAO – Toán 4 Phiêu Lưu v9.1 (sửa bằng Notepad, lưu UTF-8)
   Mỗi chuyên đề: icon, ten [tiếng Việt, tiếng Anh], dang = các dạng bài hay gặp [vi, en],
   bai = mã các bài học thuộc chuyên đề (bài toán khó lấy từ du-lieu/nang-cao.js theo mã bài).
   Thêm chuyên đề mới: chép một khối { ... } rồi sửa lại.
   ============================================================ */
window.CHUYEN_DE = [
  { id: "so", icon: "🔢", ten: ["Số và chữ số", "Numbers and digits"],
    dang: ["Viết số theo điều kiện · Thêm, xoá, đổi chỗ chữ số · Đếm chữ số khi đánh số trang", "Numbers by rules · Adding, removing, swapping digits · Counting digits in page numbers"],
    bai: ["cond", "struct", "digits"] },
  { id: "day", icon: "🪜", ten: ["Dãy số có quy luật", "Number patterns"],
    dang: ["Tìm quy luật · Tìm số hạng thứ n · Đếm số số hạng · Tính tổng dãy cách đều", "Find the rule · The nth term · How many terms · Sum of an evenly spaced list"],
    bai: ["seq"] },
  { id: "nhanh", icon: "⚡", ten: ["Tính nhanh và tìm x", "Quick math and finding x"],
    dang: ["Ghép cặp tròn chục, tròn trăm · Đặt thừa số chung · Tìm x trong biểu thức hai phép tính", "Round-number pairs · Common factor · Finding x with two operations"],
    bai: ["quick", "findx"] },
  { id: "chia", icon: "🔍", ten: ["Chia hết và phép chia", "Divisibility and division"],
    dang: ["Dấu hiệu chia hết cho 2, 3, 5, 9 · Tìm chữ số chưa biết · Phép chia có dư", "Rules for 2, 3, 5, 9 · Missing digits · Division with remainders"],
    bai: ["divis", "div"] },
  { id: "dem", icon: "🎲", ten: ["Lập số và đếm", "Making numbers and counting"],
    dang: ["Quy tắc nhân, quy tắc cộng · Lập số từ các chữ số cho trước · Chữ số 0 không đứng đầu", "Multiply or add rules · Numbers from given digits · Zero cannot lead"],
    bai: ["count"] },
  { id: "tbc", icon: "⚖️", ten: ["Trung bình cộng", "Averages"],
    dang: ["Tìm số còn thiếu khi biết trung bình · Thêm, bớt một số · Trung bình của dãy cách đều", "Missing number from an average · Adding or removing a number · Average of an evenly spaced list"],
    bai: ["avg"] },
  { id: "tonghieu", icon: "🧩", ten: ["Tổng – hiệu", "Sum and difference"],
    dang: ["Hiệu bị ẩn (chuyển, cho, bớt) · Tổng bị ẩn (chu vi, trung bình) · Ba số", "Hidden difference (moving, giving) · Hidden sum (perimeter, average) · Three numbers"],
    bai: ["sumdiff"] },
  { id: "giathiet", icon: "🐔", ten: ["Giả thiết tạm và trồng cây", "Assume-all and tree planting"],
    dang: ["Gà và thỏ, vé hai loại giá · Trồng cây hai đầu, một đầu, khép kín · Cắt dây, cưa gỗ", "Chickens and rabbits, two ticket prices · Trees at both ends, one end, closed loop · Cutting rope"],
    bai: ["chick", "trees"] },
  { id: "phanso", icon: "🍕", ten: ["Phân số nâng cao", "Advanced fractions"],
    dang: ["So sánh không quy đồng (phần bù, phân số trung gian) · Tính nhanh dãy phân số · Tìm phân số theo điều kiện", "Comparing without common denominators · Quick sums of fractions · Fractions by rules"],
    bai: ["fracprop", "fraccmp", "fraddsub", "fracmul"] }
];
