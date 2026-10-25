//# features/quick-methods.js — Bài "Tính chất phép tính, tính nhanh": 10 PHƯƠNG PHÁP TÍNH NHANH =====
//# Tự chứa trong một hàm bọc — chạy độc lập, không cần build.
/* ===== features/quick-methods.js – Bài "Tính chất phép tính, tính nhanh": 10 PHƯƠNG PHÁP TÍNH NHANH =====
   Cách dạy chung cho mọi phương pháp: 3 bước TÌM → GOM → TÍNH, và TÔ MÀU cố định:
     ⦃cam⦄  = số giống nhau (số chung) hoặc cặp nhân "vàng"     ⦅xanh dương⦆ = các số còn lại
     ⟪xanh lá⟫ = cặp cộng ra số tròn, hoặc số 1 "ẩn"
   Ký hiệu ⦃ ⦄ ⦅ ⦆ ⟪ ⟫ dùng trong chữ lời giải; module tự đổi thành chữ màu khi hiện lên màn hình.
   Gồm: 12 trang lý thuyết (thêm sau 7 trang có sẵn) + bộ sinh bài tập vận dụng cho từng phương pháp (3 mức). */
(function () {
  "use strict";
  var TH = window.TH, LT = window.LT, LESSONS = window.LESSONS, T4 = window.T4, T = T4.T, G = T4.G;
  var COL = { o: ["#C2410C", "#FFD9B5"], b: ["#1D5FD1", "#D3E4FF"], g: ["#15803D", "#C9F2D6"] };
  var RX = /⦃(.+?)⦄|⦅(.+?)⦆|⟪(.+?)⟫/g;
  function segs(s) {
    var out = [], last = 0, m; RX.lastIndex = 0;
    while ((m = RX.exec(s))) { if (m.index > last) out.push([s.slice(last, m.index), null]); out.push([m[1] || m[2] || m[3], m[1] ? "o" : m[2] ? "b" : "g"]); last = RX.lastIndex; }
    if (last < s.length) out.push([s.slice(last), null]); return out;
  }
  var escx = function (s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;"); };
  var bare = function (s) { return s.replace(RX, "$1$2$3"); };
  /* một dòng biểu thức có tô màu, tự thu cỡ chữ cho vừa bề rộng */
  function line(x, y, s, maxW) {
    var n = bare(s).length, sz = Math.max(14, Math.min(23, Math.floor((maxW || 285) / (n * 0.56))));
    var h = '<text x="' + x + '" y="' + y + '" font-size="' + sz + '" fill="#1F2A44" text-anchor="middle" font-weight="800">';
    segs(s).forEach(function (p) {
      if (!p[1]) h += "<tspan>" + escx(p[0]) + "</tspan>";
      else { var c = COL[p[1]]; h += '<tspan fill="' + c[0] + '" stroke="' + c[1] + '" stroke-width="' + Math.round(sz * 0.32) + '" stroke-linejoin="round" paint-order="stroke" font-weight="900">' + escx(p[0]) + "</tspan>"; }
    });
    return h + "</text>";
  }
  var TAG = { tim: ["#8A5CF0", T("TÌM", "FIND")], gom: ["#F08A24", T("GOM", "GROUP")], tinh: ["#22A06B", T("TÍNH", "SOLVE")], b1: ["#2F86E8", T("BƯỚC 1", "STEP 1")], b2: ["#2F86E8", T("BƯỚC 2", "STEP 2")], viet: ["#0EA5B7", T("VIẾT", "WRITE")], doi: ["#0EA5B7", T("ĐỔI", "SWAP")] };
  function tag(y, k) { var t = TAG[k]; return TH.r(6, y - 21, 60, 30, t[0], { rx: 15 }) + TH.t(36, y - 1, t[1], { s: 12, c: "#fff" }); }
  /* trang: tiêu đề + các dòng [nhãn, biểu thức]; extra = chuỗi SVG thêm */
  function page(title, rows, extra, formula) {
    return function () {
      var s = TH.r(40, 4, 280, 30, "#1F2A44", { rx: 15 }) + TH.t(180, 25, title, { s: 15, c: "#FFD23F" }), top = 0;
      if (formula) {            /* ô CÔNG THỨC CHUNG */
        var fl = [].concat(formula); top = 26 + fl.length * 30;
        s += TH.r(10, 42, 340, top - 6, "#FFF8E1", { rx: 12 }) + TH.r(10, 42, 340, top - 6, "none", { rx: 12, stroke: "#F5B800", sw: 2 });
        s += TH.t(24, 60, T("CÔNG THỨC", "FORMULA"), { s: 11, c: "#B07800", a: "start" });
        fl.forEach(function (f, i) { s += line(180, 84 + i * 30, f, 320); });
      }
      rows.forEach(function (r, i) { var y = 76 + top + i * 46; if (r[0]) s += tag(y, r[0]); s += line(r[0] ? 212 : 180, y, r[1], r[0] ? 285 : 330); });
      var h = 56 + top + rows.length * 46 + (extra ? extra.h : 0);
      if (extra) s += extra.svg(56 + top + rows.length * 46);
      return TH.svg(h, s);
    };
  }
  function notes(arr, bg) {   /* các dòng ghi chú ở cuối trang, mỗi dòng 30 px */
    return { h: arr.length * 30 + 14, svg: function (y) {
      var s = bg ? TH.r(14, y + 4, 332, arr.length * 30 + 6, bg, { rx: 12 }) : "";
      arr.forEach(function (t, i) { s += line(180, y + 28 + i * 30, t, 320); }); return s; } };
  }
  /* CÔNG THỨC CHUNG (chữ a, b, c tô cùng màu với ví dụ số) */
  var F = {
    pp1: "⟪a⟫ + b + ⟪c⟫ = (⟪a⟫ + ⟪c⟫) + b",
    pp2: "a − ⟪b⟫ − ⟪c⟫ = a − (⟪b⟫ + ⟪c⟫)",
    pp3: "⦃a⦄ × b × ⦃c⦄ = (⦃a⦄ × ⦃c⦄) × b",
    pp4: "⦃a⦄ × ⦅b⦆ + ⦃a⦄ × ⦅c⦆ = ⦃a⦄ × (⦅b⦆ + ⦅c⦆)",
    pp5: "⦃a⦄ × ⦅b⦆ − ⦃a⦄ × ⦅c⦆ = ⦃a⦄ × (⦅b⦆ − ⦅c⦆)",
    pp6: "⦃a⦄ × ⦅b⦆ + ⦃a⦄ = ⦃a⦄ × (⦅b⦆ + ⟪1⟫)",
    pp6m: "⦃a⦄ × ⦅b⦆ − ⦃a⦄ = ⦃a⦄ × (⦅b⦆ − ⟪1⟫)",
    pp7: "⦃a⦄ × ⦅b⦆ + ⦅c⦆ × ⦃a⦄ = ⦃a⦄ × (⦅b⦆ + ⦅c⦆)",
    pp8: "⦃a⦄ × 99 = ⦃a⦄ × ⟪100⟫ − ⦃a⦄",
    pp8p: "⦃a⦄ × 11 = ⦃a⦄ × ⟪10⟫ + ⦃a⦄",
    pp9: "⦅a⦆ : ⦃c⦄ + ⦅b⦆ : ⦃c⦄ = (⦅a⦆ + ⦅b⦆) : ⦃c⦄",
    pp9m: "⦅a⦆ : ⦃c⦄ − ⦅b⦆ : ⦃c⦄ = (⦅a⦆ − ⦅b⦆) : ⦃c⦄",
    pp10: "⦃a⦄ × ⦅b⦆ + ⦃a⦄ × ⦅c⦆ + ⦃a⦄ × ⦅d⦆ = ⦃a⦄ × (⦅b⦆ + ⦅c⦆ + ⦅d⦆)",
    pp10b: T("cặp vàng tạo số chung ⦃P⦄ → ⦃P⦄ × ⦅x⦆ + ⦃P⦄ × ⦅y⦆ = ⦃P⦄ × (⦅x⦆ + ⦅y⦆)", "golden pair makes ⦃P⦄ → ⦃P⦄ × ⦅x⦆ + ⦃P⦄ × ⦅y⦆ = ⦃P⦄ × (⦅x⦆ + ⦅y⦆)")
  };
  var P = [];
  /* 0. mở đầu: 3 bước + bảng màu */
  P.push({ svg: function () {
      var s = TH.r(40, 4, 280, 30, "#1F2A44", { rx: 15 }) + TH.t(180, 25, T("TÍNH NHANH = 3 BƯỚC", "QUICK MATHS = 3 STEPS"), { s: 15, c: "#FFD23F" });
      [["tim", T("Tìm số giống nhau / cặp số đẹp", "Find equal numbers / nice pairs")], ["gom", T("Gom vào ngoặc", "Group them in brackets")], ["tinh", T("Tính ngoặc trước (ra số tròn)", "Work out the bracket first")]].forEach(function (r, i) {
        var y = 72 + i * 40; s += tag(y, r[0]) + TH.t(72, y - 1, r[1], { s: 15, a: "start" });
      });
      s += TH.r(14, 192, 332, 104, "#F4F7FF", { rx: 12 });
      [T("⦃36⦄ cam: số giống nhau, cặp nhân vàng", "⦃36⦄ orange: same number, golden pair"), T("⦅7⦆ xanh dương: các số còn lại", "⦅7⦆ blue: the other numbers"), T("⟪25⟫ xanh lá: cặp cộng tròn, số 1 ẩn", "⟪25⟫ green: round pair, hidden 1")].forEach(function (t, i) { s += line(180, 220 + i * 30, t, 300); });
      return TH.svg(304, s);
    },
    say: T("Muốn **tính nhanh**, con làm 3 bước: **TÌM** số giống nhau hoặc cặp “đẹp”, **GOM** vào ngoặc, **TÍNH** ngoặc trước. Màu giúp con: **cam** là số giống nhau, **xanh dương** là số còn lại, **xanh lá** là cặp cộng tròn.", "To calculate **quickly**, do 3 steps: **FIND** equal numbers or a nice pair, **GROUP** them in brackets, **SOLVE** the bracket first. Colours help: **orange** = same number, **blue** = other numbers, **green** = a pair that adds to a round number.") });
  /* 1. ghép cặp cộng tròn */
  P.push({ svg: page(T("PP1 · Ghép cặp cộng tròn", "M1 · Round pairs (adding)"), [["tim", "⟪25⟫ + 37 + ⟪75⟫"], ["gom", "(⟪25⟫ + ⟪75⟫) + 37"], ["tinh", "100 + 37 = 137"]], null, F.pp1),
    say: T("**Dấu hiệu:** hai số cộng lại **tròn chục, tròn trăm**. **Cách làm:** tô cùng màu, ghép cạnh nhau, tính trước.\nThử: 46 + 128 + 54, ghép cặp nào?", "**Sign:** two numbers add up to a **round ten or hundred**. **How:** colour the pair, put them side by side, add them first.\nTry: 46 + 128 + 54, which pair?"),
    ask: { opts: [T("46 và 54", "46 and 54"), T("46 và 128", "46 and 128"), T("128 và 54", "128 and 54")], ans: T("46 và 54", "46 and 54"), good: T("Đúng! 46 + 54 = 100, rồi 100 + 128 = 228.", "Right! 46 + 54 = 100, then 100 + 128 = 228.") } });
  /* 2. trừ một tổng */
  P.push({ svg: page(T("PP2 · Trừ liên tiếp = trừ một tổng", "M2 · Subtract a sum"), [["tim", "186 − ⟪65⟫ − ⟪35⟫"], ["gom", "186 − (⟪65⟫ + ⟪35⟫)"], ["tinh", "186 − 100 = 86"]], null, F.pp2),
    say: T("**Dấu hiệu:** trừ **liên tiếp** hai số mà hai số đó cộng lại **tròn**. **Cách làm:** a − b − c = a − (b + c).\nThử: 540 − 73 − 27 = 540 − (…)", "**Sign:** two numbers taken away **one after another** that add up to a **round** number. **How:** a − b − c = a − (b + c).\nTry: 540 − 73 − 27 = 540 − (…)"),
    ask: { opts: [T("73 + 27", "73 + 27"), T("73 − 27", "73 − 27"), T("540 − 73", "540 − 73")], ans: T("73 + 27", "73 + 27"), good: T("Đúng! 540 − 100 = 440.", "Right! 540 − 100 = 440.") } });
  /* 3. cặp nhân vàng */
  P.push({ svg: page(T("PP3 · Ghép cặp nhân vàng", "M3 · Golden multiplying pairs"), [["tim", "⦃4⦄ × 7 × ⦃25⦄"], ["gom", "(⦃4⦄ × ⦃25⦄) × 7"], ["tinh", "100 × 7 = 700"]],
      notes([T("Cặp vàng: ⦃2⦄ × ⦃5⦄ = 10   ⦃4⦄ × ⦃25⦄ = 100", "Golden: ⦃2⦄ × ⦃5⦄ = 10   ⦃4⦄ × ⦃25⦄ = 100"), "⦃2⦄ × ⦃50⦄ = 100   ⦃8⦄ × ⦃125⦄ = 1 000"], "#FFF4C7"), F.pp3),
    say: T("**Dấu hiệu:** có **cặp vàng** (nhân ra 10, 100, 1 000): 2×5, 4×25, 2×50, 8×125. **Cách làm:** nhân cặp vàng trước.\nThử: 2 × 39 × 50, ghép cặp nào?", "**Sign:** a **golden pair** (makes 10, 100, 1,000): 2×5, 4×25, 2×50, 8×125. **How:** multiply the golden pair first.\nTry: 2 × 39 × 50, which pair?"),
    ask: { opts: [T("2 và 50", "2 and 50"), T("2 và 39", "2 and 39"), T("39 và 50", "39 and 50")], ans: T("2 và 50", "2 and 50"), good: T("Đúng! 2 × 50 = 100, 100 × 39 = 3 900.", "Right! 2 × 50 = 100, 100 × 39 = 3,900.") } });
  /* 4. thừa số chung với phép cộng */
  P.push({ svg: page(T("PP4 · Đặt số chung ra ngoài (+)", "M4 · Take out the common number (+)"), [["tim", "⦃36⦄ × ⦅7⦆ + ⦃36⦄ × ⦅3⦆"], ["gom", "⦃36⦄ × (⦅7⦆ + ⦅3⦆)"], ["tinh", "⦃36⦄ × 10 = 360"]], null, F.pp4),
    say: T("**Dấu hiệu:** hai phép nhân có **cùng một số** (màu cam). **Cách làm:** viết số cam **một lần** ngoài ngoặc, cộng các số xanh trong ngoặc.\nThử: 45 × 6 + 45 × 4 = 45 × (…)", "**Sign:** two products share **the same number** (orange). **How:** write it **once** outside the bracket, add the blue numbers inside.\nTry: 45 × 6 + 45 × 4 = 45 × (…)"),
    ask: { opts: [T("6 + 4", "6 + 4"), T("6 × 4", "6 × 4"), T("45 + 4", "45 + 4")], ans: T("6 + 4", "6 + 4"), good: T("Đúng! 45 × 10 = 450.", "Right! 45 × 10 = 450.") } });
  /* 5. thừa số chung với phép trừ */
  P.push({ svg: page(T("PP5 · Đặt số chung ra ngoài (−)", "M5 · Take out the common number (−)"), [["tim", "⦃36⦄ × ⦅18⦆ − ⦃36⦄ × ⦅8⦆"], ["gom", "⦃36⦄ × (⦅18⦆ − ⦅8⦆)"], ["tinh", "⦃36⦄ × 10 = 360"]], null, F.pp5),
    say: T("**Dấu hiệu:** như PP4 nhưng giữa hai tích là dấu **trừ**. **Cách làm:** số cam ra ngoài, trong ngoặc lấy các số xanh **trừ** nhau.\nThử: 57 × 15 − 57 × 5 = ?", "**Sign:** like M4 but with a **minus** between the products. **How:** orange number outside, **subtract** the blue numbers inside.\nTry: 57 × 15 − 57 × 5 = ?"),
    ask: { opts: [G(570), G(5700), T("57", "57")], ans: G(570), good: T("Đúng! 57 × (15 − 5) = 57 × 10 = 570.", "Right! 57 × (15 − 5) = 57 × 10 = 570.") } });
  /* 6. số 1 ẩn */
  P.push({ svg: page(T("PP6 · Số chung \"ẩn\": a = a × 1", "M6 · Hidden one: a = a × 1"), [["tim", "⦃47⦄ × ⦅9⦆ + ⦃47⦄"], ["viet", "⦃47⦄ × ⦅9⦆ + ⦃47⦄ × ⟪1⟫"], ["gom", "⦃47⦄ × (⦅9⦆ + ⟪1⟫)"], ["tinh", "⦃47⦄ × 10 = 470"]], null, [F.pp6, F.pp6m]),
    say: T("**Dấu hiệu:** số cam đứng **một mình**. **Cách làm:** số nào cũng bằng chính nó **× 1**, rồi làm như PP4.\nThử: 83 × 99 + 83 = 83 × (99 + …)", "**Sign:** the orange number stands **alone**. **How:** any number equals itself **× 1**, then use M4.\nTry: 83 × 99 + 83 = 83 × (99 + …)"),
    ask: { opts: [T("1", "1"), T("0", "0"), T("83", "83")], ans: T("1", "1"), good: T("Đúng! 83 × 100 = 8 300.", "Right! 83 × 100 = 8,300.") } });
  /* 7. đổi chỗ để thấy số chung */
  P.push({ svg: page(T("PP7 · Đổi chỗ cho số chung đứng trước", "M7 · Swap so the common number is first"), [["tim", "⦃31⦄ × ⦅78⦆ + ⦅22⦆ × ⦃31⦄"], ["doi", "⦃31⦄ × ⦅78⦆ + ⦃31⦄ × ⦅22⦆"], ["gom", "⦃31⦄ × (⦅78⦆ + ⦅22⦆)"], ["tinh", "⦃31⦄ × 100 = 3 100"]], null, F.pp7),
    say: T("**Dấu hiệu:** số giống nhau nằm ở **hai vị trí khác nhau**. **Cách làm:** **đổi chỗ** 22 × 31 thành 31 × 22, rồi làm như PP4.\nThử: 64 × 25 + 75 × 64, số chung là số nào?", "**Sign:** the same number sits in **different places**. **How:** **swap** 22 × 31 into 31 × 22, then use M4.\nTry: in 64 × 25 + 75 × 64, which is the common number?"),
    ask: { opts: [T("64", "64"), T("25", "25"), T("75", "75")], ans: T("64", "64"), good: T("Đúng! 64 × (25 + 75) = 6 400.", "Right! 64 × (25 + 75) = 6,400.") } });
  /* 8. nhân với 9, 99, 11, 101 */
  P.push({ svg: page(T("PP8 · Nhân với 9, 99, 11, 101", "M8 · Times 9, 99, 11, 101"), [["tim", "⦃35⦄ × 99 = ⦃35⦄ × (⟪100⟫ − ⦅1⦆)"], ["gom", "⦃35⦄ × ⟪100⟫ − ⦃35⦄ × ⦅1⦆"], ["tinh", "3 500 − 35 = 3 465"]],
      notes(["9 = ⟪10⟫ − ⦅1⦆  ·  99 = ⟪100⟫ − ⦅1⦆", "11 = ⟪10⟫ + ⦅1⦆  ·  101 = ⟪100⟫ + ⦅1⦆"], "#EFFAF2"), [F.pp8, F.pp8p]),
    say: T("**Dấu hiệu:** nhân với số **gần số tròn** (9, 99, 11, 101). **Cách làm:** tách thành số tròn ± 1 rồi nhân từng phần.\nThử: 24 × 11 = 24 × (10 + 1) = ?", "**Sign:** multiplying by a number **close to a round one** (9, 99, 11, 101). **How:** split it into round ± 1, multiply each part.\nTry: 24 × 11 = 24 × (10 + 1) = ?"),
    ask: { opts: [G(264), G(244), G(2640)], ans: G(264), good: T("Đúng! 240 + 24 = 264.", "Right! 240 + 24 = 264.") } });
  /* 9. chia cùng số chia */
  P.push({ svg: page(T("PP9 · Chia cùng một số chia", "M9 · Same divisor"), [["tim", "⦅72⦆ : ⦃8⦄ + ⦅48⦆ : ⦃8⦄"], ["gom", "(⦅72⦆ + ⦅48⦆) : ⦃8⦄"], ["tinh", "120 : ⦃8⦄ = 15"]],
      notes([T("Phép trừ cũng vậy:", "Subtraction works too:"), "⦅96⦆ : ⦃4⦄ − ⦅56⦆ : ⦃4⦄ = (⦅96⦆ − ⦅56⦆) : ⦃4⦄"], "#F4F7FF"), [F.pp9, F.pp9m]),
    say: T("**Dấu hiệu:** hai phép chia **cùng số chia** (màu cam). **Cách làm:** cộng (hoặc trừ) các số bị chia trước, rồi **chia một lần**.\nThử: 96 : 4 − 56 : 4 = ?", "**Sign:** two divisions with **the same divisor** (orange). **How:** add (or subtract) the dividends first, then **divide once**.\nTry: 96 : 4 − 56 : 4 = ?"),
    ask: { opts: [T("10", "10"), T("40", "40"), T("24", "24")], ans: T("10", "10"), good: T("Đúng! (96 − 56) : 4 = 40 : 4 = 10.", "Right! (96 − 56) : 4 = 40 : 4 = 10.") } });
  /* 10a. nhiều tích cùng số chung */
  P.push({ svg: page(T("PP10 · Nhiều tích cùng số chung", "M10 · Many products, one common number"), [["tim", "⦃25⦄ × ⦅13⦆ + ⦃25⦄ × ⦅80⦆ + ⦃25⦄ × ⦅7⦆"], ["gom", "⦃25⦄ × (⦅13⦆ + ⦅80⦆ + ⦅7⦆)"], ["tinh", "⦃25⦄ × 100 = 2 500"]], null, ["⦃a⦄ × ⦅b⦆ + ⦃a⦄ × ⦅c⦆ + ⦃a⦄ × ⦅d⦆", "= ⦃a⦄ × (⦅b⦆ + ⦅c⦆ + ⦅d⦆)"]),
    say: T("**Dấu hiệu:** **ba tích trở lên** cùng một số cam. **Cách làm:** như PP4, trong ngoặc có nhiều số xanh hơn; dấu trừ giữ nguyên.", "**Sign:** **three or more** products share the orange number. **How:** like M4, with more blue numbers in the bracket; keep any minus signs.") });
  /* 10b. hai bước */
  P.push({ svg: page(T("PP10 · Nhiều phép tính: làm từng bước", "M10 · Several steps"), [["b1", "⦃4⦄ × 17 × ⦃25⦄ = 100 × 17"], ["b2", "⦃100⦄ × ⦅17⦆ + ⦃100⦄ × ⦅83⦆"], ["gom", "⦃100⦄ × (⦅17⦆ + ⦅83⦆)"], ["tinh", "⦃100⦄ × 100 = 10 000"]], null, [T("Bước 1: cặp vàng tạo ra số chung ⦃P⦄", "Step 1: a golden pair makes ⦃P⦄"), "⦃P⦄ × ⦅x⦆ + ⦃P⦄ × ⦅y⦆ = ⦃P⦄ × (⦅x⦆ + ⦅y⦆)"]),
    say: T("**Dấu hiệu:** biểu thức dài, **nhiều cặp, nhiều phép tính**. **Cách làm:** đừng tính từ trái sang! **Bước 1:** cặp vàng tạo số chung. **Bước 2:** đặt số chung ra ngoài.\nThử: 8 × 23 × 125 + 1 000 × 77 = ?", "**Sign:** a long expression, **many pairs and operations**. **How:** do not go left to right! **Step 1:** a golden pair makes a common number. **Step 2:** take it out.\nTry: 8 × 23 × 125 + 1,000 × 77 = ?"),
    ask: { opts: [G(100000), G(10000), G(1000000)], ans: G(100000), good: T("Đúng! 1 000 × 23 + 1 000 × 77 = 1 000 × 100 = 100 000.", "Right! 1,000 × 23 + 1,000 × 77 = 1,000 × 100 = 100,000.") } });
  T4.pushTheoryPages("quick", P);
  (function () {   /* khung Ghi nhớ: bổ sung công thức còn thiếu */
    var L = LESSONS.filter(function (l) { return l.id === "quick"; })[0];
    if (L && L.rule && L.rule.items) L.rule.items.push(
      T("**Trừ một tổng**: a − b − c = a − (b + c).", "**Subtract a sum**: a − b − c = a − (b + c)."),
      T("**Cặp nhân vàng**: 2 × 5 = 10; 4 × 25 = 100; 2 × 50 = 100; 8 × 125 = 1 000.", "**Golden pairs**: 2 × 5 = 10; 4 × 25 = 100; 2 × 50 = 100; 8 × 125 = 1,000."),
      T("**Nhân với 9, 99, 11, 101**: a × 99 = a × 100 − a; a × 11 = a × 10 + a.", "**Times 9, 99, 11, 101**: a × 99 = a × 100 − a; a × 11 = a × 10 + a."),
      T("**Chia cùng số chia**: a : c + b : c = (a + b) : c; a : c − b : c = (a − b) : c.", "**Same divisor**: a : c + b : c = (a + b) : c; a : c − b : c = (a − b) : c."),
      T("**Nhiều tích cùng số chung**: a × b + a × c + a × d = a × (b + c + d).", "**Many products**: a × b + a × c + a × d = a × (b + c + d)."));
  })();

  /* ================= BÀI TẬP VẬN DỤNG ================= */
  var nr = function (r, a, b) { var x; do { x = r.int(a, b); } while (x % 10 === 0); return x; };   /* số không tròn chục */
  var Q = function (expr, ans, method, steps, tip, formula) {
    var st = [{ t: T("Phương pháp: **", "Method: **") + method + "**", v: null }];
    if (formula) st.push({ t: T("Công thức: ", "Formula: ") + formula, v: null });
    st = st.concat(steps.map(function (s) { return { t: s, v: null }; }));
    st[st.length - 1].v = ans;
    return { q: T("Tính nhanh: ", "Quick: ") + bare(expr), parts: [{ lab: "", ans: ans, unit: "", kind: "num" }], steps: st, tip: tip, method: method };
  };
  var M = T, GEN = {};
  GEN.cap_cong = function (tier, r) {
    var k = tier >= 2 ? r.pick([200, 1000]) : r.pick([100, 100, 200]), a = k === 1000 ? nr(r, 101, 899) : nr(r, 11, k - 11), b = k - a, c;
    do { c = nr(r, 12, 98); } while ((a + c) % 10 === 0 || (b + c) % 10 === 0);   /* chỉ đúng MỘT cặp cộng ra số tròn */
    var e = "⟪" + G(a) + "⟫ + " + G(c) + " + ⟪" + G(b) + "⟫";
    return Q(e, k + c, M("Ghép cặp cộng tròn (PP1)", "Round pairs (M1)"),
      [M("Tìm: ", "Find: ") + e + M(" – cặp xanh lá cộng lại tròn: ", " – the green pair makes ") + "⟪" + G(a) + "⟫ + ⟪" + G(b) + "⟫ = " + G(k),
       M("Gom: ", "Group: ") + "(⟪" + G(a) + "⟫ + ⟪" + G(b) + "⟫) + " + G(c), M("Tính: ", "Solve: ") + G(k) + " + " + G(c) + " = " + G(k + c)],
      M("Tìm hai số có chữ số hàng đơn vị cộng lại bằng 10.", "Find two numbers whose ones digits add to 10."), F.pp1);
  };
  GEN.tru_tong = function (tier, r) {
    var s = r.pick(tier >= 2 ? [100, 200, 1000] : [100, 100, 200]), b = nr(r, 11, s - 11), c = s - b, A;
    do { A = r.int(s + 50, s < 1000 ? 999 : 9999); } while ((A - b) % 10 === 0);
    var e = G(A) + " − ⟪" + G(b) + "⟫ − ⟪" + G(c) + "⟫";
    return Q(e, A - s, M("Trừ một tổng (PP2)", "Subtract a sum (M2)"),
      [M("Tìm: hai số trừ cộng lại tròn: ", "Find: the two numbers taken away make ") + "⟪" + G(b) + "⟫ + ⟪" + G(c) + "⟫ = " + G(s),
       M("Gom: ", "Group: ") + G(A) + " − (⟪" + G(b) + "⟫ + ⟪" + G(c) + "⟫)", M("Tính: ", "Solve: ") + G(A) + " − " + G(s) + " = " + G(A - s)],
      M("Trừ lần lượt hai số = trừ một lần tổng của chúng.", "Taking away two numbers = taking away their sum."), F.pp2);
  };
  var GOLD = [[2, 5, 10], [4, 25, 100], [2, 50, 100], [5, 20, 100], [8, 125, 1000]];
  GEN.cap_nhan = function (tier, r) {
    var g = r.pick(tier >= 2 ? GOLD.slice(1) : GOLD.slice(0, 4)), x = nr(r, 3, 99), y = tier >= 2 ? r.int(2, 9) : 0;
    var e = "⦃" + g[0] + "⦄ × " + x + (y ? " × " + y : "") + " × ⦃" + G(g[1]) + "⦄", ans = g[2] * x * (y || 1);
    var rest = x + (y ? " × " + y : "");
    return Q(e, ans, M("Ghép cặp nhân vàng (PP3)", "Golden pairs (M3)"),
      [M("Tìm cặp vàng: ", "Find the golden pair: ") + "⦃" + g[0] + "⦄ × ⦃" + G(g[1]) + "⦄ = " + G(g[2]),
       M("Gom: ", "Group: ") + "(⦃" + g[0] + "⦄ × ⦃" + G(g[1]) + "⦄) × " + rest, M("Tính: ", "Solve: ") + G(g[2]) + " × " + (y ? G(x * y) : x) + " = " + G(ans)],
      M("Cặp vàng: 2 × 5, 4 × 25, 2 × 50, 5 × 20, 8 × 125.", "Golden pairs: 2 × 5, 4 × 25, 2 × 50, 5 × 20, 8 × 125."), F.pp3);
  };
  GEN.chung_cong = function (tier, r, swap) {
    var a = nr(r, 12, 99), k = r.pick([10, 100]), b = k === 10 ? r.int(2, 8) : nr(r, 11, 89), c = k - b;
    var e = swap ? "⦃" + a + "⦄ × ⦅" + b + "⦆ + ⦅" + c + "⦆ × ⦃" + a + "⦄" : "⦃" + a + "⦄ × ⦅" + b + "⦆ + ⦃" + a + "⦄ × ⦅" + c + "⦆";
    var st = [M("Tìm số giống nhau: ", "Find the same number: ") + e];
    if (swap) st.push(M("Đổi chỗ: ", "Swap: ") + "⦅" + c + "⦆ × ⦃" + a + "⦄ = ⦃" + a + "⦄ × ⦅" + c + "⦆");
    st.push(M("Gom: ", "Group: ") + "⦃" + a + "⦄ × (⦅" + b + "⦆ + ⦅" + c + "⦆)", M("Tính: ", "Solve: ") + "⦃" + a + "⦄ × " + k + " = " + G(a * k));
    return Q(e, a * k, swap ? M("Đổi chỗ rồi đặt số chung (PP7)", "Swap, then take out (M7)") : M("Đặt số chung ra ngoài (PP4)", "Take out the common number (M4)"), st,
      M("Số giống nhau (màu cam) viết một lần ra ngoài ngoặc.", "Write the same number once, outside the bracket."), swap ? F.pp7 : F.pp4);
  };
  GEN.chung_tru = function (tier, r) {
    var a = nr(r, 12, 99), k = r.pick([10, 100]), c = k === 10 ? r.int(2, 9) : nr(r, 11, 89), b = c + k;
    var e = "⦃" + a + "⦄ × ⦅" + b + "⦆ − ⦃" + a + "⦄ × ⦅" + c + "⦆";
    return Q(e, a * k, M("Đặt số chung ra ngoài, phép trừ (PP5)", "Common number with minus (M5)"),
      [M("Tìm số giống nhau: ", "Find the same number: ") + e, M("Gom: ", "Group: ") + "⦃" + a + "⦄ × (⦅" + b + "⦆ − ⦅" + c + "⦆)", M("Tính: ", "Solve: ") + "⦃" + a + "⦄ × " + k + " = " + G(a * k)],
      M("Trong ngoặc: số xanh trước trừ số xanh sau.", "In the bracket: first blue number minus second."), F.pp5);
  };
  GEN.so1 = function (tier, r) {
    var a = nr(r, 12, 99), plus = r.chance(0.65), b = plus ? r.pick([9, 99, 999]) : r.pick([11, 101]), k = plus ? b + 1 : b - 1;
    var e = "⦃" + a + "⦄ × ⦅" + b + "⦆ " + (plus ? "+" : "−") + " ⦃" + a + "⦄";
    return Q(e, a * k, M("Số chung ẩn: a = a × 1 (PP6)", "Hidden one: a = a × 1 (M6)"),
      [M("Tìm: số ", "Find: ") + "⦃" + a + "⦄" + M(" đứng một mình = ", " alone = ") + "⦃" + a + "⦄ × ⟪1⟫",
       M("Gom: ", "Group: ") + "⦃" + a + "⦄ × (⦅" + b + "⦆ " + (plus ? "+" : "−") + " ⟪1⟫)", M("Tính: ", "Solve: ") + "⦃" + a + "⦄ × " + G(k) + " = " + G(a * k)],
      M("Số nào cũng bằng chính nó nhân 1.", "Any number equals itself times 1."), plus ? F.pp6 : F.pp6m);
  };
  GEN.nhan_gan_tron = function (tier, r) {
    var a = nr(r, 12, 99), m = r.pick(tier >= 3 ? [99, 101, 999, 11] : [9, 99, 11]), R = { 9: 10, 99: 100, 999: 1000, 11: 10, 101: 100 }[m], plus = m > R, ans = a * m;
    var e = "⦃" + a + "⦄ × " + m;
    return Q(e, ans, M("Tách thành số tròn (PP8)", "Split into a round number (M8)"),
      [M("Tìm: ", "Find: ") + m + " = ⟪" + G(R) + "⟫ " + (plus ? "+" : "−") + " ⦅1⦆",
       M("Gom: ", "Group: ") + "⦃" + a + "⦄ × ⟪" + G(R) + "⟫ " + (plus ? "+" : "−") + " ⦃" + a + "⦄ × ⦅1⦆",
       M("Tính: ", "Solve: ") + G(a * R) + " " + (plus ? "+" : "−") + " " + a + " = " + G(ans)],
      M("9 = 10 − 1; 99 = 100 − 1; 11 = 10 + 1; 101 = 100 + 1.", "9 = 10 − 1; 99 = 100 − 1; 11 = 10 + 1; 101 = 100 + 1."), plus ? F.pp8p : F.pp8);
  };
  GEN.chia_chung = function (tier, r) {
    var d = r.int(3, 9), plus = tier < 3 ? r.chance(0.7) : r.chance(0.4), q1, q2;
    if (plus) { var tot = r.int(10, 30); q1 = r.int(3, tot - 3); q2 = tot - q1; } else { q2 = r.int(3, 20); q1 = q2 + r.int(5, 20); }
    var x = d * q1, y = d * q2, ans = plus ? q1 + q2 : q1 - q2;
    var e = "⦅" + x + "⦆ : ⦃" + d + "⦄ " + (plus ? "+" : "−") + " ⦅" + y + "⦆ : ⦃" + d + "⦄";
    return Q(e, ans, M("Chia cùng một số chia (PP9)", "Same divisor (M9)"),
      [M("Tìm: hai phép chia cùng số chia ", "Find: both divide by ") + "⦃" + d + "⦄", M("Gom: ", "Group: ") + "(⦅" + x + "⦆ " + (plus ? "+" : "−") + " ⦅" + y + "⦆) : ⦃" + d + "⦄",
       M("Tính: ", "Solve: ") + G(plus ? x + y : x - y) + " : ⦃" + d + "⦄ = " + G(ans)],
      M("Cộng (trừ) các số bị chia trước, rồi chia một lần.", "Add (subtract) the numbers first, then divide once."), plus ? F.pp9 : F.pp9m);
  };
  GEN.nhieu_tich = function (tier, r) {
    var a = nr(r, 12, 99), b = nr(r, 11, 55), c = nr(r, 11, 89 - b), d = 100 - b - c;
    if (d % 10 === 0 || d < 2) { d += 1; c -= 1; }
    var e = "⦃" + a + "⦄ × ⦅" + b + "⦆ + ⦃" + a + "⦄ × ⦅" + c + "⦆ + ⦃" + a + "⦄ × ⦅" + d + "⦆";
    return Q(e, a * 100, M("Nhiều tích cùng số chung (PP10)", "Many products, one common number (M10)"),
      [M("Tìm: ba tích cùng số ", "Find: three products share ") + "⦃" + a + "⦄", M("Gom: ", "Group: ") + "⦃" + a + "⦄ × (⦅" + b + "⦆ + ⦅" + c + "⦆ + ⦅" + d + "⦆)",
       M("Tính: ", "Solve: ") + "⦃" + a + "⦄ × 100 = " + G(a * 100)],
      M("Có bao nhiêu tích cùng số cam thì gom hết vào một ngoặc.", "Put every product with the orange number into one bracket."), F.pp10);
  };
  GEN.hai_buoc = function (tier, r) {
    var g = r.pick(GOLD.slice(1)), x = nr(r, 11, 89), y = 100 - x;
    var e = "⦃" + g[0] + "⦄ × " + x + " × ⦃" + G(g[1]) + "⦄ + " + G(g[2]) + " × " + y, P2 = g[2];
    return Q(e, P2 * 100, M("Ghép cặp vàng rồi đặt số chung (PP10)", "Golden pair, then take out (M10)"),
      [M("Bước 1 – cặp vàng: ", "Step 1 – golden pair: ") + "⦃" + g[0] + "⦄ × ⦃" + G(g[1]) + "⦄ = " + G(P2) + M(", nên ", ", so ") + g[0] + " × " + x + " × " + G(g[1]) + " = " + G(P2) + " × " + x,
       M("Bước 2 – số chung: ", "Step 2 – common number: ") + "⦃" + G(P2) + "⦄ × ⦅" + x + "⦆ + ⦃" + G(P2) + "⦄ × ⦅" + y + "⦆ = ⦃" + G(P2) + "⦄ × (⦅" + x + "⦆ + ⦅" + y + "⦆)",
       M("Tính: ", "Solve: ") + "⦃" + G(P2) + "⦄ × 100 = " + G(P2 * 100)],
      M("Biểu thức dài: ghép cặp vàng trước để tạo ra số chung.", "Long expression: use a golden pair first to make a common number."), F.pp10b);
  };
  GEN.doi_cho = function (tier, r) { return GEN.chung_cong(tier, r, true); };
  var POOL = { 1: ["cap_cong", "tru_tong", "cap_nhan", "orig"],
    2: ["cap_nhan", "chung_cong", "chung_tru", "so1", "nhan_gan_tron", "chia_chung", "orig"],
    3: ["doi_cho", "nhieu_tich", "hai_buoc", "nhan_gan_tron", "chia_chung", "tru_tong", "orig"] };
  var QL = LESSONS.filter(function (l) { return l.id === "quick"; })[0], og = QL.gen;
  QL.gen = function (tier, r) {
    var f = window.__qforce, k = f || r.pick(POOL[tier] || POOL[3]);
    if (k === "orig") return og.apply(this, arguments);
    return GEN[k](tier, r);
  };

  /* ---- tô màu chữ trong lời giải, gợi ý, ghi nhớ ---- */
  var RXT = /[⦃⦅⟪]/;
  function paint(root) {
    if (!root) return;
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) { var p = n.parentNode && n.parentNode.nodeName; return p === "SCRIPT" || p === "STYLE" || p === "TEXTAREA" ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT; } }), list = [], n;
    while ((n = w.nextNode())) if (RXT.test(n.nodeValue)) list.push(n);
    list.forEach(function (t) {
      var sg = segs(t.nodeValue); if (!sg.some(function (p) { return p[1]; })) return;   /* chỉ thay khi thật sự có đoạn màu → không lặp vô hạn */
      var f = document.createDocumentFragment();
      sg.forEach(function (p) {
        if (!p[1]) f.appendChild(document.createTextNode(p[0]));
        else { var s = document.createElement("span"); s.className = "qm-" + p[1]; s.textContent = p[0]; f.appendChild(s); }
      });
      t.parentNode.replaceChild(f, t);
    });
  }
  var queued = false;
  new MutationObserver(function () { if (queued) return; queued = true; Promise.resolve().then(function () { queued = false; paint(document.getElementById("app")); }); })
    .observe(document.getElementById("app") || document.body, { childList: true, subtree: true });
  window.T4.quick = { GEN: GEN, POOL: POOL, bare: bare };
})();
