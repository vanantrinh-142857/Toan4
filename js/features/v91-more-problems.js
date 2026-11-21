//# features/v91-more-problems.js — Thêm nhiều dạng bài toán mới vào các bài hiện có (v9.1)
//# Tự chứa trong một hàm bọc — chạy độc lập, không cần build.
/* ===== features/v91-more-problems.js =====
   Bổ sung các dạng còn thiếu của Toán 4, gắn vào bài đã có (không thêm bài mới, không đổi lý thuyết):
   - Biểu thức có chữ, công thức chu vi/diện tích, ước lượng bằng làm tròn, thương có chữ số 0 (SGK còn thiếu)
   - Toán lời văn ba bước, tính ngược từ cuối, tổng–tỉ, hiệu–tỉ, tính tuổi
   - Lịch (thứ – ngày), tuần lễ; hình ghép (chữ L, cắt góc), chu vi hình ghép
   - Suy luận: cân thăng bằng, bắt tay, đếm cách mặc đồ, dãy có quy luật bậc hai, số chẵn lẻ, ốc sên leo giếng
   Mỗi dạng chỉ dùng ở mức được ghi (t:[...]); khoảng một nửa số câu của mức đó lấy từ module này, phần còn lại giữ nguyên đề cũ. */
(function () {
  "use strict";
  var G = window, T = G.T4.T, fmt = function (n) { return G.fmt(n); };
  var num = function (lab, ans, unit) { return { lab: lab || "", ans: ans, unit: unit || "", kind: "num" }; };
  var chp = function (opts, ans, lab) { return { lab: lab || "", ans: ans, opts: opts, kind: "choice" }; };
  var st = function (t, v) { return { t: t, v: v == null ? null : v }; };
  var Q = function (q, parts, steps, tip) { return { q: q, parts: parts, steps: steps, tip: tip || "" }; };
  var NAMES = ["Lan", "Nam", "Mai", "Hùng", "Minh", "An", "Hoa", "Tú"];
  var F = function (a, b) { return "{" + a + "/" + b + "}"; };

  /* t: các mức dùng (1 Dễ, 2 Vừa, 3 Khó); f: hàm sinh đề */
  function extend(id, specs, p) {
    var l = G.byId(id); if (!l) return;
    var old = l.gen;
    l.gen = function (tier, r) {
      var ok = specs.filter(function (s) { return s.t.indexOf(tier) >= 0; });
      return ok.length && r.chance(p || 0.5) ? r.pick(ok).f.call(l, r) : old.call(l, tier, r);
    };
  }

  /* ================= TỔNG – HIỆU – TỈ – TUỔI (bài sumdiff) ================= */
  var RATIOS = [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [2, 5], [3, 5], [1, 5], [4, 5]];
  extend("sumdiff", [
    { t: [2, 3], f: function (r) {   /* tổng – tỉ */
      var rt = r.pick(RATIOS), a = rt[0], b = rt[1], u = r.int(2, 12), s = (a + b) * u, ctx = r.int(0, 1), nm = r.shuffle(NAMES);
      var q = ctx ? T(nm[0] + " và " + nm[1] + " có tất cả " + s + " viên bi. Số bi của " + nm[0] + " bằng " + F(a, b) + " số bi của " + nm[1] + ". Mỗi bạn có bao nhiêu viên bi?",
                      nm[0] + " and " + nm[1] + " have " + s + " marbles altogether. " + nm[0] + " has " + F(a, b) + " as many as " + nm[1] + ". How many marbles does each have?")
                  : T("Tổng của hai số là " + s + ". Số bé bằng " + F(a, b) + " số lớn. Tìm hai số đó.", "The sum of two numbers is " + s + ". The smaller is " + F(a, b) + " of the larger. Find them.");
      return Q(q, [num(ctx ? nm[0] : T("Số bé", "Smaller"), a * u), num(ctx ? nm[1] : T("Số lớn", "Larger"), b * u)],
        [st(T("Vẽ sơ đồ: số bé " + a + " phần, số lớn " + b + " phần bằng nhau.", "Draw a bar model: the smaller has " + a + " equal parts, the larger " + b + ".")),
         st(T("Tổng số phần bằng nhau: " + a + " + " + b + " = " + (a + b) + " (phần)", "Total parts: " + a + " + " + b + " = " + (a + b)), a + b),
         st(T("Giá trị một phần: " + s + " : " + (a + b) + " = " + u, "One part: " + s + " : " + (a + b) + " = " + u), u),
         st(T("Số bé: " + u + " × " + a + " = " + (a * u), "Smaller: " + u + " × " + a + " = " + (a * u)), a * u),
         st(T("Số lớn: " + u + " × " + b + " = " + (b * u), "Larger: " + u + " × " + b + " = " + (b * u)), b * u)],
        T("Tổng ÷ số phần = giá trị một phần.", "Sum ÷ number of parts = one part."));
    } },
    { t: [2, 3], f: function (r) {   /* hiệu – tỉ */
      var k = r.int(2, 5), u = r.int(3, 15), d = (k - 1) * u, ctx = r.int(0, 1);
      var q = ctx ? T("Một thùng dầu lớn đựng nhiều hơn thùng nhỏ " + d + " lít. Thùng lớn đựng gấp " + k + " lần thùng nhỏ. Mỗi thùng đựng bao nhiêu lít?", "A big drum holds " + d + " litres more than a small drum, and " + k + " times as much. How many litres does each hold?")
                  : T("Hiệu của hai số là " + d + ". Số lớn gấp " + k + " lần số bé. Tìm hai số đó.", "The difference of two numbers is " + d + ". The larger is " + k + " times the smaller. Find them.");
      return Q(q, [num(ctx ? T("Thùng nhỏ", "Small") : T("Số bé", "Smaller"), u), num(ctx ? T("Thùng lớn", "Big") : T("Số lớn", "Larger"), k * u)],
        [st(T("Sơ đồ: số bé 1 phần, số lớn " + k + " phần bằng nhau.", "Bar model: smaller 1 part, larger " + k + " equal parts.")),
         st(T("Hiệu số phần bằng nhau: " + k + " − 1 = " + (k - 1) + " (phần)", "Difference in parts: " + k + " − 1 = " + (k - 1)), k - 1),
         st(T("Giá trị một phần (số bé): " + d + " : " + (k - 1) + " = " + u, "One part (smaller): " + d + " : " + (k - 1) + " = " + u), u),
         st(T("Số lớn: " + u + " × " + k + " = " + (k * u), "Larger: " + u + " × " + k + " = " + (k * u)), k * u)],
        T("Hiệu ÷ hiệu số phần = giá trị một phần.", "Difference ÷ difference in parts = one part."));
    } },
    { t: [2, 3], f: function (r) {   /* tuổi: hiệu – tỉ */
      var k = r.int(3, 5), c = r.int(5, 11), d = (k - 1) * c, who = r.pick([["Mẹ", "Mother"], ["Bố", "Father"]]);
      return Q(T(who[0] + " hơn con " + d + " tuổi. Tuổi " + who[0].toLowerCase() + " gấp " + k + " lần tuổi con. Hỏi con mấy tuổi, " + who[0].toLowerCase() + " mấy tuổi?", who[1] + " is " + d + " years older than the child, and " + k + " times as old. How old is each?"),
        [num(T("Con", "Child"), c, T("tuổi", "yrs")), num(who[0], k * c, T("tuổi", "yrs"))],
        [st(T("Hiệu tuổi không đổi: " + d + " tuổi. Con 1 phần, " + who[0].toLowerCase() + " " + k + " phần.", "The age gap stays " + d + ". Child 1 part, parent " + k + " parts.")),
         st(T("Hiệu số phần: " + k + " − 1 = " + (k - 1), "Parts difference: " + k + " − 1 = " + (k - 1)), k - 1),
         st(T("Tuổi con: " + d + " : " + (k - 1) + " = " + c, "Child: " + d + " : " + (k - 1) + " = " + c), c),
         st(T("Tuổi " + who[0].toLowerCase() + ": " + c + " × " + k + " = " + (k * c), "Parent: " + c + " × " + k + " = " + (k * c)), k * c)],
        T("Hiệu số tuổi của hai người không bao giờ thay đổi.", "The age gap never changes."));
    } },
    { t: [3], f: function (r) {   /* tuổi: tổng – tỉ */
      var k = r.int(3, 5), c = r.int(5, 11), s = (k + 1) * c, who = r.pick([["Mẹ", "Mother"], ["Bố", "Father"]]);
      return Q(T("Tổng số tuổi của " + who[0].toLowerCase() + " và con là " + s + " tuổi. Tuổi " + who[0].toLowerCase() + " gấp " + k + " lần tuổi con. Tính tuổi mỗi người.", "The ages of the parent and child add up to " + s + ". The parent is " + k + " times as old. Find each age."),
        [num(T("Con", "Child"), c, T("tuổi", "yrs")), num(who[0], k * c, T("tuổi", "yrs"))],
        [st(T("Con 1 phần, " + who[0].toLowerCase() + " " + k + " phần bằng nhau.", "Child 1 part, parent " + k + " equal parts.")),
         st(T("Tổng số phần: 1 + " + k + " = " + (k + 1), "Total parts: 1 + " + k + " = " + (k + 1)), k + 1),
         st(T("Tuổi con: " + s + " : " + (k + 1) + " = " + c, "Child: " + s + " : " + (k + 1) + " = " + c), c),
         st(T("Tuổi " + who[0].toLowerCase() + ": " + c + " × " + k + " = " + (k * c), "Parent: " + c + " × " + k + " = " + (k * c)), k * c)],
        T("Tổng ÷ số phần = giá trị một phần.", "Sum ÷ number of parts = one part."));
    } }
  ], 0.45);

  /* ================= TÍNH NGƯỢC TỪ CUỐI (bài addsub) ================= */
  extend("addsub", [
    { t: [2, 3], f: function (r) {   /* nghĩ một số */
      var x = r.int(4, 40), m = r.int(2, 6), a = r.int(3, 30), b = x * m + a, add = r.chance(0.5);
      return add
        ? Q(T("Nghĩ một số, nhân với " + m + " rồi cộng " + a + " thì được " + b + ". Số đã nghĩ là số nào?", "I think of a number, multiply by " + m + " and add " + a + " to get " + b + ". What was my number?"),
            [num("", x)], [st(T("Tính ngược từ cuối: bỏ phép cộng " + a + ": " + b + " − " + a + " = " + (b - a), "Work backwards: undo adding " + a + ": " + b + " − " + a + " = " + (b - a)), b - a),
                           st(T("Bỏ phép nhân " + m + ": " + (b - a) + " : " + m + " = " + x, "Undo multiplying by " + m + ": " + (b - a) + " : " + m + " = " + x), x)],
            T("Làm ngược lại từng bước: cộng thì trừ, nhân thì chia.", "Undo each step: add ↔ subtract, multiply ↔ divide."))
        : (function () {
            var m2 = m + 1, x2 = x + 5, a2 = r.int(2, 9), b2 = x2 * m2 - a2;
            return Q(T("Nghĩ một số, nhân với " + m2 + " rồi trừ đi " + a2 + " thì được " + b2 + ". Số đã nghĩ là số nào?", "I think of a number, multiply by " + m2 + " and subtract " + a2 + " to get " + b2 + ". What was my number?"),
              [num("", x2)], [st(T("Tính ngược: bỏ phép trừ " + a2 + ": " + b2 + " + " + a2 + " = " + (b2 + a2), "Work backwards: undo subtracting " + a2 + ": " + b2 + " + " + a2 + " = " + (b2 + a2)), b2 + a2),
                              st(T("Bỏ phép nhân " + m2 + ": " + (b2 + a2) + " : " + m2 + " = " + x2, "Undo multiplying by " + m2 + ": " + (b2 + a2) + " : " + m2 + " = " + x2), x2)],
              T("Làm ngược lại từng bước: trừ thì cộng, nhân thì chia.", "Undo each step: subtract ↔ add, multiply ↔ divide."));
          })();
    } },
    { t: [2, 3], f: function (r) {   /* cho nửa rồi cho thêm */
      var f = r.int(2, 10), c = r.int(1, 4), nm = r.shuffle(NAMES), x = 2 * (f + c);
      return Q(T(nm[0] + " có một số kẹo. " + nm[0] + " cho " + nm[1] + " một nửa số kẹo, rồi cho thêm " + c + " viên nữa thì còn " + f + " viên. Lúc đầu " + nm[0] + " có bao nhiêu viên kẹo?", nm[0] + " had some sweets. " + nm[0] + " gave " + nm[1] + " half of them, then " + c + " more, and has " + f + " left. How many did " + nm[0] + " start with?"),
        [num("", x, T("viên", ""))],
        [st(T("Tính ngược từ cuối. Trước khi cho thêm " + c + " viên: " + f + " + " + c + " = " + (f + c) + " (viên)", "Work backwards. Before the extra " + c + ": " + f + " + " + c + " = " + (f + c)), f + c),
         st(T("Số này là một nửa lúc đầu, nên lúc đầu: " + (f + c) + " × 2 = " + x, "That is half of the start, so the start: " + (f + c) + " × 2 = " + x), x)],
        T("Bài toán cho biết cuối cùng → làm ngược từng bước về đầu.", "Start from the end and undo each step."));
    } }
  ], 0.45);

  /* ================= LỊCH, TUẦN LỄ (bài time) ================= */
  var WD = function () { return [T("Thứ Hai", "Monday"), T("Thứ Ba", "Tuesday"), T("Thứ Tư", "Wednesday"), T("Thứ Năm", "Thursday"), T("Thứ Sáu", "Friday"), T("Thứ Bảy", "Saturday"), T("Chủ nhật", "Sunday")]; };
  var MD = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  extend("time", [
    { t: [1, 2, 3], f: function (r) {   /* thứ của một ngày */
      var m = r.pick([1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]), dm = MD[m - 1], d1 = r.int(1, 9), d2 = r.int(d1 + 1, Math.min(dm, d1 + 20)), w = r.int(0, 6), W = WD();
      var ans = (w + (d2 - d1)) % 7, opts = [ans]; r.shuffle([0, 1, 2, 3, 4, 5, 6]).forEach(function (i) { opts.length < 4 && i !== ans && opts.push(i); });
      var diff = d2 - d1, wk = Math.floor(diff / 7), rem = diff % 7;
      return Q(T("Ngày " + d1 + " tháng " + m + " là " + W[w] + ". Hỏi ngày " + d2 + " tháng " + m + " là thứ mấy?", "Day " + d1 + " of month " + m + " is a " + W[w] + ". What day of the week is day " + d2 + " of that month?"),
        [chp(r.shuffle(opts).map(function (i) { return W[i]; }), W[ans])],
        [st(T("Từ ngày " + d1 + " đến ngày " + d2 + " cách nhau " + d2 + " − " + d1 + " = " + diff + " (ngày)", "From day " + d1 + " to day " + d2 + ": " + d2 + " − " + d1 + " = " + diff + " days"), diff),
         st(T("Một tuần có 7 ngày. " + diff + " ngày = " + wk + " tuần và " + rem + " ngày, tuần nào cũng quay về cùng thứ nên chỉ cần đếm thêm " + rem + " ngày.", "A week has 7 days. " + diff + " days = " + wk + " weeks and " + rem + " days; only the extra " + rem + " days change the weekday.")),
         st(T("Đếm tiếp " + rem + " ngày sau " + W[w] + " được " + W[ans] + ".", "Counting " + rem + " days on from " + W[w] + " gives " + W[ans] + "."))],
        T("Mỗi 7 ngày thì thứ lặp lại.", "The weekday repeats every 7 days."));
    } },
    { t: [1, 2], f: function (r) {   /* số ngày kì nghỉ */
      var m = r.pick([1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]), d1 = r.int(1, 15), d2 = r.int(d1 + 2, Math.min(MD[m - 1], d1 + 20)), n = d2 - d1 + 1;
      return Q(T("Kì nghỉ hè của lớp bắt đầu từ ngày " + d1 + " đến hết ngày " + d2 + " tháng " + m + ". Kì nghỉ kéo dài bao nhiêu ngày (tính cả ngày đầu và ngày cuối)?", "A school break runs from day " + d1 + " to the end of day " + d2 + " of month " + m + ". How many days is it, counting both the first and last day?"),
        [num("", n, T("ngày", "days"))],
        [st(T("Hiệu hai ngày: " + d2 + " − " + d1 + " = " + (d2 - d1), "Difference: " + d2 + " − " + d1 + " = " + (d2 - d1)), d2 - d1),
         st(T("Tính cả ngày đầu nên cộng thêm 1: " + (d2 - d1) + " + 1 = " + n, "Count the first day too, add 1: " + (d2 - d1) + " + 1 = " + n), n)],
        T("Đếm cả hai đầu thì phải cộng thêm 1.", "Counting both ends means adding 1."));
    } },
    { t: [1, 2], f: function (r) {   /* tuần lễ */
      var n = r.int(2, 9), m = r.int(1, 6), tot = 7 * n + m;
      return Q(T(n + " tuần lễ và " + m + " ngày là bao nhiêu ngày?", n + " weeks and " + m + " days is how many days?"), [num("", tot, T("ngày", "days"))],
        [st(T("1 tuần lễ có 7 ngày. " + n + " tuần: 7 × " + n + " = " + (7 * n), "1 week = 7 days. " + n + " weeks: 7 × " + n + " = " + (7 * n)), 7 * n),
         st(T("Cộng thêm " + m + " ngày: " + (7 * n) + " + " + m + " = " + tot, "Add " + m + " days: " + (7 * n) + " + " + m + " = " + tot), tot)],
        T("1 tuần lễ = 7 ngày.", "1 week = 7 days."));
    } }
  ], 0.45);

  /* ================= HÌNH GHÉP (bài area) ================= */
  extend("area", [
    { t: [2, 3], f: function (r) {   /* chữ L = 2 hình chữ nhật */
      var a = r.int(6, 15), b = r.int(3, 8), c = r.int(3, 9), d = r.int(3, 9), s1 = a * b, s2 = c * d;
      return Q(T("Mảnh vườn hình chữ L gồm hai hình chữ nhật ghép lại (không chồng lên nhau): hình thứ nhất dài " + a + " m, rộng " + b + " m; hình thứ hai dài " + c + " m, rộng " + d + " m. Tính diện tích mảnh vườn.", "An L-shaped garden is made of two rectangles that do not overlap: the first is " + a + " m by " + b + " m, the second " + c + " m by " + d + " m. Find the area."),
        [num("", s1 + s2, "m²")],
        [st(T("Chia hình chữ L thành hai hình chữ nhật.", "Split the L into two rectangles.")),
         st(T("Hình thứ nhất: " + a + " × " + b + " = " + s1 + " (m²)", "First: " + a + " × " + b + " = " + s1), s1),
         st(T("Hình thứ hai: " + c + " × " + d + " = " + s2 + " (m²)", "Second: " + c + " × " + d + " = " + s2), s2),
         st(T("Diện tích cả mảnh vườn: " + s1 + " + " + s2 + " = " + (s1 + s2) + " (m²)", "Whole area: " + s1 + " + " + s2 + " = " + (s1 + s2)), s1 + s2)],
        T("Hình phức tạp → chia thành các hình đơn giản.", "Split a complex shape into simple shapes."));
    } },
    { t: [2, 3], f: function (r) {   /* cắt bỏ góc */
      var A = r.int(8, 15), B = r.int(6, 12), c = r.int(2, 4), whole = A * B, cut = c * c;
      return Q(T("Từ một tấm bìa hình chữ nhật dài " + A + " cm, rộng " + B + " cm, người ta cắt bỏ một hình vuông cạnh " + c + " cm ở một góc. Tính diện tích phần bìa còn lại.", "From a " + A + " cm by " + B + " cm card, a " + c + " cm square is cut from one corner. Find the area left."),
        [num("", whole - cut, "cm²")],
        [st(T("Diện tích tấm bìa: " + A + " × " + B + " = " + whole + " (cm²)", "Card: " + A + " × " + B + " = " + whole), whole),
         st(T("Diện tích hình vuông bị cắt: " + c + " × " + c + " = " + cut + " (cm²)", "Cut square: " + c + " × " + c + " = " + cut), cut),
         st(T("Phần còn lại: " + whole + " − " + cut + " = " + (whole - cut) + " (cm²)", "Left: " + whole + " − " + cut + " = " + (whole - cut)), whole - cut)],
        T("Diện tích còn lại = diện tích cả − phần bị cắt.", "Left = whole − cut part."));
    } },
    { t: [3], f: function (r) {   /* chu vi sau khi cắt góc */
      var A = r.int(8, 15), B = r.int(6, 12), c = r.int(2, 4), P = 2 * (A + B);
      return Q(T("Cắt bỏ một hình vuông cạnh " + c + " cm ở một góc của tấm bìa hình chữ nhật dài " + A + " cm, rộng " + B + " cm. Chu vi phần bìa còn lại là bao nhiêu xăng-ti-mét? (Gợi ý: kéo các cạnh ra ngoài cho thẳng.)", "A " + c + " cm square is cut from a corner of a " + A + " cm by " + B + " cm card. What is the perimeter of the remaining piece? (Hint: slide the edges outwards.)"),
        [num("", P, "cm")],
        [st(T("Hai cạnh mới tạo ra dài bằng đúng phần cạnh cũ bị cắt đi, nên chu vi không đổi.", "The two new edges add up to the two cut edges, so the perimeter does not change.")),
         st(T("Chu vi bằng chu vi hình chữ nhật: (" + A + " + " + B + ") × 2 = " + P + " (cm)", "Same as the rectangle: (" + A + " + " + B + ") × 2 = " + P), P)],
        T("Cắt góc vuông không làm đổi chu vi.", "Cutting a square corner keeps the perimeter."));
    } },
    { t: [2, 3], f: function (r) {   /* ghép n hình vuông */
      var a = r.int(2, 9), n = r.int(2, 4), L = n * a, P = (L + a) * 2;
      return Q(T("Ghép " + n + " hình vuông cạnh " + a + " cm thành một hình chữ nhật (xếp thành một hàng). Chu vi hình chữ nhật đó là bao nhiêu xăng-ti-mét?", "Put " + n + " squares of side " + a + " cm in a row to make a rectangle. What is its perimeter in cm?"),
        [num("", P, "cm")],
        [st(T("Chiều dài: " + n + " × " + a + " = " + L + " (cm)", "Length: " + n + " × " + a + " = " + L), L),
         st(T("Chiều rộng bằng cạnh hình vuông: " + a + " cm.", "Width = side of a square: " + a + " cm.")),
         st(T("Chu vi: (" + L + " + " + a + ") × 2 = " + P + " (cm)", "Perimeter: (" + L + " + " + a + ") × 2 = " + P), P)],
        T("Chu vi = (dài + rộng) × 2.", "Perimeter = (length + width) × 2."));
    } }
  ], 0.45);

  /* ================= CÂN THĂNG BẰNG (bài mass) ================= */
  extend("mass", [
    { t: [2, 3], f: function (r) {
      var n1 = r.int(2, 4), m = r.int(2, 4), n2 = n1 * m, w = r.pick([100, 150, 200, 250]), tot = n2 * w, o = tot / n1;
      return Q(T("Cân thăng bằng: " + n1 + " quả cam nặng bằng " + n2 + " quả táo. Mỗi quả táo nặng " + w + " g. Hỏi mỗi quả cam nặng bao nhiêu gam?", "A balance is level: " + n1 + " oranges weigh the same as " + n2 + " apples. Each apple weighs " + w + " g. How much does one orange weigh?"),
        [num("", o, "g")],
        [st(T(n2 + " quả táo nặng: " + n2 + " × " + w + " = " + tot + " (g)", n2 + " apples weigh: " + n2 + " × " + w + " = " + tot), tot),
         st(T("Cân thăng bằng nên " + n1 + " quả cam cũng nặng " + tot + " g.", "The scale is level, so " + n1 + " oranges also weigh " + tot + " g.")),
         st(T("Một quả cam: " + tot + " : " + n1 + " = " + o + " (g)", "One orange: " + tot + " : " + n1 + " = " + o), o)],
        T("Hai bên cân bằng thì nặng bằng nhau.", "Level pans weigh the same."));
    } }
  ], 0.4);

  /* ================= ĐẾM: bắt tay, cách mặc đồ (bài count) ================= */
  extend("count", [
    { t: [2, 3], f: function (r) {
      var n = r.int(3, 8), x = n * (n - 1), ans = x / 2, kind = r.int(0, 1);
      return Q(kind ? T(n + " đội bóng thi đấu vòng tròn một lượt (hai đội bất kì gặp nhau đúng một trận). Có tất cả bao nhiêu trận đấu?", n + " teams play each other once. How many matches are there in total?")
                    : T(n + " bạn gặp nhau, hai bạn bất kì bắt tay đúng một lần. Có tất cả bao nhiêu cái bắt tay?", n + " friends meet and every two of them shake hands once. How many handshakes are there?"),
        [num("", ans)],
        [st(T("Mỗi bạn (đội) gặp " + (n - 1) + " bạn (đội) còn lại: " + n + " × " + (n - 1) + " = " + x, "Each one meets the other " + (n - 1) + ": " + n + " × " + (n - 1) + " = " + x), x),
         st(T("Mỗi cặp bị đếm 2 lần nên chia đôi: " + x + " : 2 = " + ans, "Each pair is counted twice, so halve it: " + x + " : 2 = " + ans), ans)],
        T("Mỗi cặp được đếm hai lần.", "Each pair is counted twice."));
    } },
    { t: [1, 2], f: function (r) {
      var a = r.int(2, 6), b = r.int(2, 5), c = r.chance(0.5) ? 0 : r.int(2, 3), ans = c ? a * b * c : a * b;
      return Q(c ? T("Bé có " + a + " cái áo, " + b + " cái quần và " + c + " đôi giày. Hỏi bé có bao nhiêu cách mặc một bộ gồm áo, quần và giày?", "A child has " + a + " shirts, " + b + " pairs of trousers and " + c + " pairs of shoes. How many different outfits (shirt, trousers, shoes) are possible?")
                 : T("Bé có " + a + " cái áo và " + b + " cái quần. Hỏi bé có bao nhiêu cách mặc một bộ gồm một áo và một quần?", "A child has " + a + " shirts and " + b + " pairs of trousers. How many different outfits are possible?"),
        [num("", ans)],
        [st(c ? T("Mỗi áo ghép với " + b + " quần, mỗi cặp áo-quần ghép với " + c + " đôi giày: " + a + " × " + b + " × " + c + " = " + ans, "Multiply the choices: " + a + " × " + b + " × " + c + " = " + ans) : T("Mỗi áo ghép được với " + b + " quần: " + a + " × " + b + " = " + ans, "Each shirt goes with " + b + " trousers: " + a + " × " + b + " = " + ans), ans)],
        T("Quy tắc nhân: nhân số lựa chọn ở mỗi bước.", "Multiplication rule: multiply the choices at each step."));
    } }
  ], 0.4);

  /* ================= DÃY CÓ QUY LUẬT, CHẴN LẺ (bài seq) ================= */
  extend("seq", [
    { t: [2, 3], f: function (r) {   /* hiệu tăng dần */
      var t0 = r.int(1, 9), d = r.int(1, 4), e = r.int(1, 3), t = [t0], i;
      for (i = 0; i < 5; i++) t.push(t[i] + d + e * i);
      var diffs = []; for (i = 0; i < 4; i++) diffs.push(t[i + 1] - t[i]);
      var nextd = d + e * 4;
      return Q(T("Tìm số tiếp theo của dãy: " + t.slice(0, 5).join(", ") + ", ...", "Find the next number: " + t.slice(0, 5).join(", ") + ", ..."), [num("", t[5])],
        [st(T("Tính hiệu hai số liền nhau: " + diffs.join(", ") + " (mỗi lần tăng thêm " + e + ").", "Differences: " + diffs.join(", ") + " (each is " + e + " more).")),
         st(T("Hiệu tiếp theo là " + diffs[3] + " + " + e + " = " + nextd, "The next difference is " + diffs[3] + " + " + e + " = " + nextd), nextd),
         st(T("Số tiếp theo: " + t[4] + " + " + nextd + " = " + t[5], "Next number: " + t[4] + " + " + nextd + " = " + t[5]), t[5])],
        T("Khi các số không cách đều, hãy xét hiệu của các hiệu.", "If the gaps are uneven, look at how the gaps change."));
    } },
    { t: [3], f: function (r) {   /* mỗi số bằng tổng hai số trước */
      var a = r.int(1, 4), b = r.int(a + 1, 6), t = [a, b], i; for (i = 2; i < 7; i++) t.push(t[i - 1] + t[i - 2]);
      return Q(T("Tìm số tiếp theo của dãy: " + t.slice(0, 6).join(", ") + ", ...", "Find the next number: " + t.slice(0, 6).join(", ") + ", ..."), [num("", t[6])],
        [st(T("Thử: " + t[0] + " + " + t[1] + " = " + t[2] + ", " + t[1] + " + " + t[2] + " = " + t[3] + ". Mỗi số bằng tổng hai số đứng ngay trước nó.", "Test: " + t[0] + " + " + t[1] + " = " + t[2] + ", " + t[1] + " + " + t[2] + " = " + t[3] + ". Each number is the sum of the two before it.")),
         st(T("Số tiếp theo: " + t[4] + " + " + t[5] + " = " + t[6], "Next: " + t[4] + " + " + t[5] + " = " + t[6]), t[6])],
        T("Thử xem mỗi số có phải tổng của hai số trước không.", "Check whether each number is the sum of the two before."));
    } },
    { t: [2, 3], f: function (r) {   /* đếm số chẵn / lẻ */
      var even = r.chance(0.5), a = r.int(1, 20) * 2 + (even ? 0 : 1), n = r.int(8, 40), b = a + (n - 1) * 2;
      return Q(even ? T("Có bao nhiêu số chẵn từ " + a + " đến " + b + " (kể cả hai số đó)?", "How many even numbers are there from " + a + " to " + b + " (including both)?")
                    : T("Có bao nhiêu số lẻ từ " + a + " đến " + b + " (kể cả hai số đó)?", "How many odd numbers are there from " + a + " to " + b + " (including both)?"),
        [num("", n)],
        [st(T("Hai số chẵn (lẻ) liền nhau hơn kém nhau 2 đơn vị.", "Consecutive " + (even ? "even" : "odd") + " numbers differ by 2.")),
         st(T("Khoảng cách: " + b + " − " + a + " = " + (b - a), "Distance: " + b + " − " + a + " = " + (b - a)), b - a),
         st(T("Số khoảng: " + (b - a) + " : 2 = " + (n - 1) + ". Số số hạng = số khoảng + 1 = " + n, "Gaps: " + (b - a) + " : 2 = " + (n - 1) + ". Terms = gaps + 1 = " + n), n)],
        T("Số số hạng = (số lớn − số bé) : khoảng cách + 1.", "Terms = (largest − smallest) : gap + 1."));
    } },
    { t: [1, 2], f: function (r) {   /* chẵn lẻ */
      var op = r.int(0, 3), A = [T("số chẵn", "an even number"), T("số lẻ", "an odd number")];
      var cases = [[T("Tổng của hai số lẻ", "The sum of two odd numbers"), 0], [T("Tổng của một số chẵn và một số lẻ", "The sum of an even and an odd number"), 1], [T("Tích của một số lẻ và một số chẵn", "The product of an odd and an even number"), 0], [T("Tích của hai số lẻ", "The product of two odd numbers"), 1]];
      var c = cases[op];
      return Q(T(c[0] + " là số chẵn hay số lẻ?", c[0] + " is even or odd?"), [chp(r.shuffle([A[0], A[1]]), A[c[1]])],
        [st(T("Thử một ví dụ: " + [("3 + 5 = 8"), ("2 + 3 = 5"), ("3 × 4 = 12"), ("3 × 5 = 15")][op] + ".", "Try an example: " + [("3 + 5 = 8"), ("2 + 3 = 5"), ("3 × 4 = 12"), ("3 × 5 = 15")][op] + ".")), st(T("Vậy kết quả luôn là " + A[c[1]] + ".", "So the result is always " + A[c[1]] + "."))],
        T("Số chẵn chia hết cho 2, số lẻ thì không.", "Even numbers divide by 2, odd numbers do not."));
    } }
  ], 0.4);

  /* ================= ỐC SÊN LEO GIẾNG, THƯƠNG CÓ CHỮ SỐ 0 (bài div) ================= */
  extend("div", [
    { t: [3], f: function (r) {
      var a = r.int(3, 5), b = r.int(1, a - 1), n = a - b, H = r.int(a + n + 1, a + n * 7), x = H - a, c = Math.ceil(x / n), days = c + 1;
      return Q(T("Một chú ốc sên bò lên khỏi giếng sâu " + H + " m. Ban ngày ốc leo lên " + a + " m, ban đêm tụt xuống " + b + " m. Hỏi sau mấy ngày thì ốc lên tới miệng giếng?", "A snail climbs out of a " + H + " m well. By day it climbs " + a + " m, by night it slips back " + b + " m. After how many days does it reach the top?"),
        [num("", days, T("ngày", "days"))],
        [st(T("Ngày cuối ốc leo lên là tới miệng giếng, đêm đó không tụt nữa. Trước ngày cuối ốc cần leo: " + H + " − " + a + " = " + x + " (m)", "On the last day it reaches the top and does not slip. Before that it must climb: " + H + " − " + a + " = " + x), x),
         st(T("Mỗi ngày đêm ốc tiến thêm: " + a + " − " + b + " = " + n + " (m)", "Each day and night it gains: " + a + " − " + b + " = " + n), n),
         st(T("Cần " + c + " ngày như vậy (chia " + x + " cho " + n + ", lấy tròn lên), cộng thêm ngày cuối: " + c + " + 1 = " + days + " (ngày)", "That takes " + c + " days (divide " + x + " by " + n + ", round up), plus the last day: " + c + " + 1 = " + days), days)],
        T("Ngày cuối cùng không bị tụt xuống.", "No slipping on the last day."));
    } },
    { t: [1, 2], f: function (r) {   /* thương có chữ số 0 */
      var k = r.int(2, 9), q = r.pick([function () { return r.int(1, 9) * 100 + r.int(1, 9); }, function () { return r.int(1, 9) * 1000 + r.int(1, 9); }, function () { return r.int(1, 9) * 100 + r.int(1, 9) * 10; }])(), n = k * q;
      return Q(fmt(n) + " : " + k + " = ?", [num("", q)],
        [st(T("Chia lần lượt từng hàng. Hàng nào không đủ chia thì thương ở hàng đó là 0 – vẫn phải viết chữ số 0.", "Divide digit by digit. If a place is too small to divide, write 0 in the quotient.")),
         st(T("Kết quả: " + fmt(n) + " : " + k + " = " + fmt(q) + ". Kiểm tra: " + fmt(q) + " × " + k + " = " + fmt(n), "Result: " + fmt(n) + " : " + k + " = " + fmt(q) + ". Check: " + fmt(q) + " × " + k + " = " + fmt(n)), q)],
        T("Đừng bỏ sót chữ số 0 ở thương.", "Do not drop a 0 in the quotient."));
    } }
  ], 0.4);

  /* ================= SỐ CHIA HẾT (bài divis) ================= */
  extend("divis", [
    { t: [1, 2, 3], f: function (r) {
      var k = r.pick([2, 3, 4, 5, 6, 7, 8, 9]), small = r.chance(0.5), v = small ? Math.ceil(100 / k) * k : Math.floor(999 / k) * k;
      return Q(small ? T("Số bé nhất có ba chữ số chia hết cho " + k + " là số nào?", "What is the smallest 3-digit number divisible by " + k + "?") : T("Số lớn nhất có ba chữ số chia hết cho " + k + " là số nào?", "What is the largest 3-digit number divisible by " + k + "?"),
        [num("", v)],
        [st(small ? T("Số bé nhất có ba chữ số là 100. Chia 100 cho " + k + " được " + Math.floor(100 / k) + " dư " + (100 % k) + (100 % k ? ", nên phải lấy thương lớn lên một đơn vị." : ", chia hết luôn.")) : T("Số lớn nhất có ba chữ số là 999. Chia 999 cho " + k + " được " + Math.floor(999 / k) + " dư " + (999 % k) + (999 % k ? ", nên phải bớt phần dư." : ", chia hết luôn.")),
           small ? "100 : " + k + " ≈ " + Math.floor(100 / k) : "999 : " + k + " ≈ " + Math.floor(999 / k)),
         st(T("Số cần tìm: " + (v / k) + " × " + k + " = " + v, "The number: " + (v / k) + " × " + k + " = " + v), v)],
        T("Dùng phép chia có dư để tìm số chia hết gần nhất.", "Use division with remainder to find the nearest multiple."));
    } },
    { t: [2, 3], f: function (r) {   /* đếm bội */
      var k = r.int(3, 9), n = r.int(6, 40), N = k * n;
      return Q(T("Từ 1 đến " + N + " có bao nhiêu số chia hết cho " + k + "?", "How many numbers from 1 to " + N + " are divisible by " + k + "?"), [num("", n)],
        [st(T("Các số chia hết cho " + k + " là " + k + ", " + 2 * k + ", " + 3 * k + ", ... , " + N + ".", "The multiples of " + k + " are " + k + ", " + 2 * k + ", " + 3 * k + ", ... , " + N + ".")),
         st(T("Số các số: " + N + " : " + k + " = " + n, "How many: " + N + " : " + k + " = " + n), n)],
        T("Số bội = số lớn nhất : " + k + ".", "Count = largest : " + k + "."));
    } }
  ], 0.4);

  /* ================= BIỂU THỨC CÓ CHỮ, CÔNG THỨC, BA BƯỚC (bài mul) ================= */
  extend("mul", [
    { t: [1, 2], f: function (r) {   /* biểu thức có chứa chữ */
      var L = r.pick(["a", "b", "m", "n", "x"]), a = r.int(2, 9), b = r.int(1, 20), v = r.int(2, 9), op = r.int(0, 2), val, ex;
      if (op === 0) { val = a * v + b; ex = a + " × " + L + " + " + b; } else if (op === 1) { val = b + a * v; ex = b + " + " + a + " × " + L; } else { val = a * v * 2; ex = a + " × " + L + " × 2"; }
      return Q(T("Tính giá trị của biểu thức **" + ex + "** với " + L + " = " + v + ".", "Find the value of **" + ex + "** when " + L + " = " + v + "."), [num("", val)],
        [st(T("Thay " + L + " = " + v + " vào biểu thức: " + ex.replace(L, String(v)), "Replace " + L + " by " + v + ": " + ex.replace(L, String(v)))),
         st(T("Nhân trước, cộng sau: " + (op === 2 ? a + " × " + v + " × 2 = " + val : a + " × " + v + " = " + (a * v) + "; rồi " + (op === 0 ? (a * v) + " + " + b : b + " + " + (a * v)) + " = " + val), (op === 2 ? a + " × " + v + " × 2 = " + val : a + " × " + v + " = " + (a * v) + "; then " + (op === 0 ? (a * v) + " + " + b : b + " + " + (a * v)) + " = " + val)), val)],
        T("Thay chữ bằng số rồi tính (nhân chia trước, cộng trừ sau).", "Replace the letter by the number (multiply first, then add)."));
    } },
    { t: [1, 2], f: function (r) {   /* công thức chu vi, diện tích */
      var a = r.int(3, 20), b = r.int(2, 15), per = r.chance(0.5);
      return per ? Q(T("Chu vi hình chữ nhật tính theo công thức **P = (a + b) × 2**. Tính P khi a = " + a + " cm, b = " + b + " cm.", "The perimeter of a rectangle is **P = (a + b) × 2**. Find P when a = " + a + " cm and b = " + b + " cm."), [num("", (a + b) * 2, "cm")],
                [st(T("Thay số: P = (" + a + " + " + b + ") × 2", "Substitute: P = (" + a + " + " + b + ") × 2")), st(T("(" + a + " + " + b + ") × 2 = " + (a + b) * 2 + " (cm)", "(" + a + " + " + b + ") × 2 = " + (a + b) * 2), (a + b) * 2)], T("Tính trong ngoặc trước.", "Brackets first."))
                : Q(T("Diện tích hình chữ nhật tính theo công thức **S = a × b**. Tính S khi a = " + a + " cm, b = " + b + " cm.", "The area of a rectangle is **S = a × b**. Find S when a = " + a + " cm and b = " + b + " cm."), [num("", a * b, "cm²")],
                [st(T("Thay số: S = " + a + " × " + b, "Substitute: S = " + a + " × " + b)), st(T(a + " × " + b + " = " + a * b + " (cm²)", a + " × " + b + " = " + a * b), a * b)], T("Diện tích = dài × rộng.", "Area = length × width."));
    } },
    { t: [2, 3], f: function (r) {   /* ba bước: bán hàng */
      var A = r.int(6, 14), k = r.int(15, 30), tot = A * k, m = r.int(20, Math.floor(tot / 3)), n = r.int(15, Math.floor(tot / 3)), sold = m + n;
      return Q(T("Cửa hàng có " + A + " thùng bánh, mỗi thùng " + k + " cái. Buổi sáng bán " + m + " cái, buổi chiều bán " + n + " cái. Hỏi cửa hàng còn lại bao nhiêu cái bánh?", "A shop has " + A + " boxes of cakes, " + k + " cakes in each. It sells " + m + " in the morning and " + n + " in the afternoon. How many cakes are left?"),
        [num("", tot - sold, T("cái", ""))],
        [st(T("Số bánh có tất cả: " + A + " × " + k + " = " + tot + " (cái)", "Cakes in all: " + A + " × " + k + " = " + tot), tot),
         st(T("Số bánh đã bán: " + m + " + " + n + " = " + sold + " (cái)", "Cakes sold: " + m + " + " + n + " = " + sold), sold),
         st(T("Số bánh còn lại: " + tot + " − " + sold + " = " + (tot - sold) + " (cái)", "Left: " + tot + " − " + sold + " = " + (tot - sold)), tot - sold)],
        T("Bài ba bước: tìm tổng, tìm số đã bán, rồi trừ.", "Three steps: total, sold, then subtract."));
    } },
    { t: [2, 3], f: function (r) {   /* ba bước: mua hàng, tiền thừa */
      var a = r.int(2, 8), p = r.int(3, 12) * 1000, b = r.int(2, 6), q = r.int(2, 9) * 1000, tot = a * p + b * q, pay = (Math.floor(tot / 10000) + 1) * 10000, ch = pay - tot;
      return Q(T("Mai mua " + a + " quyển vở, mỗi quyển " + fmt(p) + " đồng, và " + b + " cái bút, mỗi cái " + fmt(q) + " đồng. Mai đưa cô bán hàng " + fmt(pay) + " đồng. Hỏi cô trả lại Mai bao nhiêu đồng?", "Mai buys " + a + " notebooks at " + fmt(p) + " dong each and " + b + " pens at " + fmt(q) + " dong each, and pays " + fmt(pay) + " dong. How much change does she get?"),
        [num("", ch, T("đồng", "dong"))],
        [st(T("Tiền vở: " + a + " × " + fmt(p) + " = " + fmt(a * p) + " (đồng)", "Notebooks: " + a + " × " + fmt(p) + " = " + fmt(a * p)), a * p),
         st(T("Tiền bút: " + b + " × " + fmt(q) + " = " + fmt(b * q) + " (đồng)", "Pens: " + b + " × " + fmt(q) + " = " + fmt(b * q)), b * q),
         st(T("Tổng tiền: " + fmt(a * p) + " + " + fmt(b * q) + " = " + fmt(tot) + " (đồng)", "Total: " + fmt(a * p) + " + " + fmt(b * q) + " = " + fmt(tot)), tot),
         st(T("Tiền trả lại: " + fmt(pay) + " − " + fmt(tot) + " = " + fmt(ch) + " (đồng)", "Change: " + fmt(pay) + " − " + fmt(tot) + " = " + fmt(ch)), ch)],
        T("Tính tiền từng loại, cộng lại, rồi lấy tiền đưa trừ đi.", "Cost of each, add, then subtract from the money paid."));
    } }
  ], 0.45);

  /* ================= ƯỚC LƯỢNG BẰNG LÀM TRÒN (bài round) ================= */
  extend("round", [
    { t: [1, 2, 3], f: function (r) {
      var mk = function () { var d = r.pick([-40, -30, -20, -10, 10, 20, 30, 40]); return r.int(2, 9) * 100 + d; };
      var a = mk(), b = mk(), ra = Math.round(a / 100) * 100, rb = Math.round(b / 100) * 100, add = r.chance(0.5);
      if (!add && ra < rb) { var t = a; a = b; b = t; t = ra; ra = rb; rb = t; }
      var ans = add ? ra + rb : ra - rb;
      return Q(T("Ước lượng kết quả của **" + a + (add ? " + " : " − ") + b + "** bằng cách làm tròn mỗi số đến hàng trăm.", "Estimate **" + a + (add ? " + " : " − ") + b + "** by rounding each number to the nearest hundred."), [num("", ans)],
        [st(T(a + " làm tròn thành " + ra + "; " + b + " làm tròn thành " + rb + ".", a + " rounds to " + ra + "; " + b + " rounds to " + rb + ".")),
         st(T("Ước lượng: " + ra + (add ? " + " : " − ") + rb + " = " + ans, "Estimate: " + ra + (add ? " + " : " − ") + rb + " = " + ans), ans)],
        T("Chữ số hàng chục từ 5 trở lên thì làm tròn lên.", "Tens digit 5 or more rounds up."));
    } }
  ], 0.4);

  G.T4 = G.T4 || {}; G.T4.moreProblems = 1;
})();
