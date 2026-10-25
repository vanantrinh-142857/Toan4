//# features/mul-properties.js — Bài "Phép nhân": tính chất giao hoán, kết hợp, nhân với 1 và 0, phân phối
//# Tự chứa trong một hàm bọc — chạy độc lập, không cần build.
/* ===== features/mul-properties.js – Bài "Phép nhân": tính chất giao hoán, kết hợp, nhân với 1 và 0, phân phối ===== */
(function () {
  "use strict";
  var TH = window.TH, LT = window.LT, LESSONS = window.LESSONS, SC = window.SC, Store = window.Store;
  var T4 = window.T4, T = T4.T, G = T4.G, C = T4.C;
  var INK = C.INK, BLUE = C.BLUE, ORANGE = C.ORANGE, GREEN = C.GREEN, RED = C.RED, PINK = C.PINK, GREY = C.GREY;

  /* ================= TÍNH CHẤT PHÉP NHÂN ================= */
  var MP = [];
  MP.push({ svg: function () {
      return TH.svg(190, TH.dots(12, 46, 34, { perRow: 4, r: 9, gap: 24, color: 'blue' }) + TH.t(82, 128, '3 × 4 = 12', { s: 20 }) +
        TH.t(170, 66, '=', { s: 34 }) + TH.dots(12, 232, 28, { perRow: 3, r: 9, gap: 24, color: 'orange' }) + TH.t(256, 142, '4 × 3 = 12', { s: 20 }) +
        TH.r(60, 152, 240, 32, 'sun', { rx: 12 }) + TH.t(180, 176, 'a × b = b × a', { s: 21 }));
    },
    say: T('**Tính chất giao hoán**: đổi chỗ hai thừa số thì tích **không thay đổi**. 3 hàng, mỗi hàng 4 chấm, xoay lại thành 4 hàng, mỗi hàng 3 chấm: **3 × 4 = 4 × 3 = 12**.', '**Commutative property**: swapping the two factors does **not change** the product. 3 rows of 4 dots, turned round, is 4 rows of 3 dots: **3 × 4 = 4 × 3 = 12**.'),
    ask: { opts: [G(200), G(33), G(160)], ans: G(200), good: T('Đúng! 8 × 25 = 25 × 8 = 200.', 'Right! 8 × 25 = 25 × 8 = 200.') }, askq: null });
  MP[0].say = T('**Tính chất giao hoán**: đổi chỗ hai thừa số thì tích **không thay đổi**: **3 × 4 = 4 × 3 = 12**.\nBiết 25 × 8 = 200. Vậy 8 × 25 bằng bao nhiêu?', '**Commutative property**: swapping the two factors does **not change** the product: **3 × 4 = 4 × 3 = 12**.\nIf 25 × 8 = 200, what is 8 × 25?');
  MP.push({ svg: function () {
      return TH.svg(200, TH.r(12, 12, 166, 118, 'sky', { rx: 14 }) + TH.t(95, 46, '(2 × 3) × 4', { s: 21 }) + TH.t(95, 82, '= 6 × 4', { s: 21 }) + TH.t(95, 118, '= 24', { s: 24, c: GREEN }) +
        TH.r(182, 12, 166, 118, 'sun', { rx: 14 }) + TH.t(265, 46, '2 × (3 × 4)', { s: 21 }) + TH.t(265, 82, '= 2 × 12', { s: 21 }) + TH.t(265, 118, '= 24', { s: 24, c: GREEN }) +
        TH.t(180, 160, '(a × b) × c = a × (b × c)', { s: 21 }) + TH.t(180, 188, T('Nhóm hai số nào trước cũng được!', 'Group either pair first!'), { s: 15, c: GREY }));
    },
    say: T('**Tính chất kết hợp**: nhân ba số, nhóm hai số đầu hay hai số sau thì kết quả **như nhau**. Dùng để tính nhanh: **5 × 17 × 2**, nhóm hai số nào cho dễ?', '**Associative property**: with three numbers, grouping the first two or the last two gives the **same** result. Use it to calculate fast: **5 × 17 × 2** – which two numbers should we group?'),
    ask: { opts: [T('5 và 2', '5 and 2'), T('5 và 17', '5 and 17'), T('17 và 2', '17 and 2')], ans: T('5 và 2', '5 and 2'), good: T('Đúng! 5 × 2 = 10, rồi 10 × 17 = 170.', 'Right! 5 × 2 = 10, then 10 × 17 = 170.') } });
  MP.push({ svg: function () {
      return TH.svg(180, TH.r(14, 14, 160, 110, 'mint', { rx: 16 }) + TH.t(94, 52, 'a × 1 = a', { s: 24 }) + TH.t(94, 86, '1 × a = a', { s: 24 }) + TH.t(94, 114, T('VD: 7 × 1 = 7', 'e.g. 7 × 1 = 7'), { s: 15, c: GREY }) +
        TH.r(186, 14, 160, 110, 'rose', { rx: 16 }) + TH.t(266, 52, 'a × 0 = 0', { s: 24 }) + TH.t(266, 86, '0 × a = 0', { s: 24 }) + TH.t(266, 114, T('VD: 125 × 0 = 0', 'e.g. 125 × 0 = 0'), { s: 15, c: GREY }) +
        TH.t(180, 158, T('Nhân với 1 giữ nguyên · nhân với 0 ra 0', 'Times 1 stays the same · times 0 gives 0'), { s: 15, c: GREY }));
    },
    say: T('**Nhân với 1 và với 0**: số nào nhân với **1** cũng bằng chính nó; số nào nhân với **0** cũng bằng **0**.\n2 026 × 0 bằng bao nhiêu?', '**Times 1 and times 0**: any number times **1** is itself; any number times **0** is **0**.\nWhat is 2 026 × 0?'),
    ask: { opts: [T('0', '0'), G(2026), T('1', '1')], ans: T('0', '0'), good: T('Đúng! Số nào nhân với 0 cũng bằng 0.', 'Right! Any number times 0 is 0.') } });
      MP.push({ svg: function () {
      var r = function (y, f, a, b) { return TH.r(12, y, 336, 40, f, { rx: 12 }) + TH.t(180, y + 26, a + b, { s: 16 }); };
      return TH.svg(210, r(6, 'sky', T('Giao hoán:  ', 'Commutative:  '), 'a × b = b × a') + r(52, 'sun', T('Kết hợp:  ', 'Associative:  '), '(a × b) × c = a × (b × c)') +
        r(98, 'mint', T('Nhân với 1, với 0:  ', 'Times 1 and 0:  '), 'a × 1 = a;  a × 0 = 0') + TH.r(12, 148, 336, 50, 'lilac', { rx: 12 }) + TH.t(180, 170, T('Còn phép nhân với một tổng, một hiệu:', 'Multiplying by a sum or difference:'), { s: 13 }) + TH.t(180, 188, T('học tiếp ở bài Tính chất phép tính', 'comes next in the Properties lesson'), { s: 13 }));
    },
    say: T('Tóm lại, phép nhân có ba tính chất: **giao hoán**, **kết hợp**, **nhân với 1 và 0**. Còn nhân một số với một tổng (hiệu), con học tiếp ở bài Tính chất phép tính.', 'To sum up, multiplication has three properties: **commutative**, **associative**, **times 1 and 0**. Multiplying by a sum (difference) comes next in the Properties lesson.') });
  T4.pushTheoryPages('mul', MP);

  /* ===== BÀI TẬP MINI cho 3 tính chất (xen vào mức Dễ 30%, mức Vừa 22%) ===== */
  var G = T4.G, MINI = {};
  var mq = function (q, ans, prop, steps, tip) {
    var st = [{ t: T('Tính chất: **', 'Property: **') + prop + '**', v: null }].concat(steps.map(function (x) { return { t: x, v: null }; })); st[st.length - 1].v = ans;
    return { q: q, parts: [{ lab: '', ans: ans, unit: '', kind: 'num' }], steps: st, tip: tip, mini: prop };
  };
  MINI.comm = function (r) {
    var a = r.int(3, 19), b; do { b = r.int(3, 19); } while (b === a);
    return mq(T('Điền số: ', 'Fill in: ') + a + ' × ' + b + ' = ' + b + ' × …', a, T('giao hoán', 'commutative'),
      [T('Đổi chỗ hai thừa số thì tích không đổi: ', 'Swapping the factors keeps the product: ') + a + ' × ' + b + ' = ' + b + ' × ' + a, T('Số cần điền: ', 'Missing number: ') + a],
      T('Hai thừa số đổi chỗ cho nhau.', 'The two factors swap places.'));
  };
  MINI.assoc = function (r) {
    var a = r.int(2, 9), b = r.int(2, 9), c = r.int(2, 9);
    return mq(T('Điền số: ', 'Fill in: ') + '(' + a + ' × ' + b + ') × ' + c + ' = ' + a + ' × (… × ' + c + ')', b, T('kết hợp', 'associative'),
      [T('Nhóm hai số sau lại: ', 'Group the last two: ') + '(' + a + ' × ' + b + ') × ' + c + ' = ' + a + ' × (' + b + ' × ' + c + ')', T('Số cần điền: ', 'Missing number: ') + b],
      T('Ba số giữ nguyên thứ tự, chỉ đổi cách nhóm.', 'Same order, just different grouping.'));
  };
  MINI.one = function (r) {
    var a = r.pick([r.int(12, 99), r.int(101, 999), r.int(1001, 9999)]);
    return mq(T('Tính: ', 'Compute: ') + G(a) + ' × 1 = …', a, T('nhân với 1', 'times 1'), [T('Số nào nhân với 1 cũng bằng chính nó: ', 'Any number times 1 is itself: ') + G(a) + ' × 1 = ' + G(a)], T('Nhân với 1 thì số không đổi.', 'Times 1 leaves the number unchanged.'));
  };
  MINI.zero = function (r) {
    var a = r.pick([r.int(12, 99), r.int(101, 999), r.int(1001, 9999)]);
    return mq(T('Tính: ', 'Compute: ') + '0 × ' + G(a) + ' = …', 0, T('nhân với 0', 'times 0'), [T('Số nào nhân với 0 cũng bằng 0: ', 'Any number times 0 is 0: ') + '0 × ' + G(a) + ' = 0'], T('Nhân với 0 thì tích bằng 0.', 'Times 0 gives 0.'));
  };
  var ML = LESSONS.filter(function (l) { return l.id === 'mul'; })[0], mulGen = ML.gen;
  ML.gen = function (tier, r) {
    var f = window.__mforce, p = tier === 1 ? 0.3 : tier === 2 ? 0.22 : 0;
    if (!f && !(p && r.chance(p))) return mulGen.apply(this, arguments);
    return MINI[f || r.pick(['comm', 'assoc', 'one', 'zero'])](r);
  };
  T4.mulMini = MINI;
})();
