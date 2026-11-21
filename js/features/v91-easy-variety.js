//# features/v91-easy-variety.js — Thêm kiểu đề cho mức Dễ của 5 bài còn ít kiểu (v9.1)
//# Tự chứa trong một hàm bọc — chạy độc lập, không cần build.
/* ===== features/v91-easy-variety.js =====
   Mức Dễ của các bài: Các loại góc, Yến tạ tấn, Giây thế kỉ, Gà và thỏ, Trồng cây trước đây chỉ có 1–4 kiểu đề.
   Module này thêm kiểu đề mới cùng độ khó; khoảng một nửa số câu mức Dễ lấy từ đây, còn lại giữ đề cũ.
   Không đụng tới mức Vừa, Khó và nội dung bài học. */
(function () {
  "use strict";
  var G = window, T = G.T4.T;
  var num = function (lab, ans, unit) { return { lab: lab || "", ans: ans, unit: unit || "", kind: "num" }; };
  var chp = function (opts, ans, lab) { return { lab: lab || "", ans: ans, opts: opts, kind: "choice" }; };
  var st = function (t, v) { return { t: t, v: v == null ? null : v }; };
  var Q = function (q, parts, steps, tip) { return { q: q, parts: parts, steps: steps, tip: tip || "" }; };
  function extend(id, gens) {
    var l = G.byId(id); if (!l) return;
    var old = l.gen;
    l.gen = function (tier, r) { return tier === 1 && r.chance(0.5) ? r.pick(gens).call(l, r) : old.call(l, tier, r); };
  }

  /* ---------- Các loại góc ---------- */
  var KIND = function () { return { nhon: T("góc nhọn", "an acute angle"), vuong: T("góc vuông", "a right angle"), tu: T("góc tù", "an obtuse angle"), bet: T("góc bẹt", "a straight angle") }; };
  var deg = function (r, k) { return k === "nhon" ? r.int(2, 17) * 5 : k === "vuong" ? 90 : k === "tu" ? r.int(19, 35) * 5 : 180; };
  var RULE = function () { return T("Góc nhọn bé hơn 90°; góc vuông bằng 90°; góc tù lớn hơn 90° và bé hơn 180°; góc bẹt bằng 180°.", "An acute angle is less than 90°; a right angle is 90°; an obtuse angle is more than 90° and less than 180°; a straight angle is 180°."); };
  extend("angle", [
    function (r) {   /* chọn số đo ứng với một loại góc */
      var K = KIND(), ks = r.shuffle(["nhon", "vuong", "tu", "bet"]), want = ks[0], d = {};
      ks.forEach(function (k) { d[k] = deg(r, k) + "°"; });
      var opts = r.shuffle(ks.map(function (k) { return d[k]; }));
      return Q(T("Trong các số đo sau, số đo nào là của **" + K[want] + "**?", "Which of these measures belongs to **" + K[want] + "**?"),
        [chp(opts, d[want])], [st(RULE()), st(T("Vậy " + d[want] + " là số đo của " + K[want] + ".", "So " + d[want] + " is the measure of " + K[want] + "."))],
        T("So sánh số đo với 90° và 180°.", "Compare the measure with 90° and 180°."));
    },
    function (r) {   /* số đo góc vuông, góc bẹt */
      var right = r.chance(0.5), v = right ? 90 : 180;
      return Q(right ? T("**Góc vuông** bằng bao nhiêu độ?", "How many degrees is a **right angle**?") : T("**Góc bẹt** bằng bao nhiêu độ?", "How many degrees is a **straight angle**?"),
        [num("", v, "°")], [st(right ? T("Góc vuông bằng 90°.", "A right angle is 90°.") : T("Góc bẹt bằng hai góc vuông: 90 + 90 = 180.", "A straight angle equals two right angles: 90 + 90 = 180."), v)],
        T("Góc vuông 90°, góc bẹt 180°.", "Right angle 90°, straight angle 180°."));
    },
    function (r) {   /* so với góc vuông */
      var small = r.chance(0.5), a = deg(r, "nhon") + "°", b = deg(r, "tu") + "°", opts = r.shuffle([a, b]);
      return Q(small ? T("Góc nào **bé hơn góc vuông**?", "Which angle is **smaller than a right angle**?") : T("Góc nào **lớn hơn góc vuông**?", "Which angle is **larger than a right angle**?"),
        [chp(opts, small ? a : b)], [st(T("Góc vuông bằng 90°.", "A right angle is 90°.")), st(small ? T(a + " bé hơn 90° nên bé hơn góc vuông (góc nhọn).", a + " is less than 90°, so it is smaller than a right angle (acute).") : T(b + " lớn hơn 90° nên lớn hơn góc vuông (góc tù).", b + " is more than 90°, so it is larger than a right angle (obtuse)."))],
        T("So sánh số đo với 90°.", "Compare the measure with 90°."));
    }
  ]);

  /* ---------- Yến, tạ, tấn ---------- */
  var U = function () { return { kg: "kg", yen: T("yến", "yến"), ta: T("tạ", "tạ"), tan: T("tấn", "metric tons") }; };
  var conv = function (r, big, small, k) {   /* 1 big = k small */
    var u = U(), down = r.chance(0.5), n = r.int(2, 9) * (k === 10 && r.chance(0.3) ? 10 : 1);
    return down
      ? Q(n + " " + u[big] + " = ? " + u[small], [num("", n * k, u[small])], [st("1 " + u[big] + " = " + G.fmt(k) + " " + u[small] + " → " + n + " × " + G.fmt(k) + " = " + G.fmt(n * k), n * k)], T("Đổi sang đơn vị bé hơn thì nhân.", "To change to a smaller unit, multiply."))
      : Q(G.fmt(n * k) + " " + u[small] + " = ? " + u[big], [num("", n, u[big])], [st(G.fmt(k) + " " + u[small] + " = 1 " + u[big] + " → " + G.fmt(n * k) + " : " + G.fmt(k) + " = " + n, n)], T("Đổi sang đơn vị lớn hơn thì chia.", "To change to a larger unit, divide."));
  };
  extend("mass", [
    function (r) { return conv(r, "tan", "ta", 10); },
    function (r) { return conv(r, "ta", "kg", 100); },
    function (r) { return conv(r, "tan", "kg", 1000); }
  ]);

  /* ---------- Giây, thế kỉ ---------- */
  extend("time", [
    function (r) {
      var c = r.int(2, 21);
      return Q(T(G.fmt(c * 100) + " năm = ? thế kỉ", G.fmt(c * 100) + " years = ? centuries"), [num("", c, T("thế kỉ", "centuries"))],
        [st(T("100 năm = 1 thế kỉ → " + G.fmt(c * 100) + " : 100 = " + c, "100 years = 1 century → " + G.fmt(c * 100) + " ÷ 100 = " + c), c)], T("Đổi năm ra thế kỉ: chia 100.", "Years to centuries: divide by 100."));
    },
    function (r) {
      var h = r.int(2, 9);
      return Q(T(h * 60 + " phút = ? giờ", h * 60 + " minutes = ? hours"), [num("", h, T("giờ", "hours"))],
        [st(T("60 phút = 1 giờ → " + h * 60 + " : 60 = " + h, "60 minutes = 1 hour → " + h * 60 + " ÷ 60 = " + h), h)], T("Đổi phút ra giờ: chia 60.", "Minutes to hours: divide by 60."));
    }
  ]);

  /* ---------- Gà và thỏ: cùng cách giải, đổi tình huống ---------- */
  var CTX = function () {
    return [
      { two: T("xe đạp", "bicycles"), four: T("ô tô", "cars"), unit: T("bánh xe", "wheels"), cnt: T("xe", "vehicles"), per: T("bánh", "wheels"),
        q: function (n, f) { return T("Bãi gửi xe có cả xe đạp và ô tô, tất cả **" + n + " xe** và **" + f + " bánh xe**. Hỏi có bao nhiêu xe đạp, bao nhiêu ô tô?", "A parking lot has bicycles and cars: **" + n + " vehicles** and **" + f + " wheels** in all. How many bicycles and how many cars are there?"); } },
      { two: T("vịt", "ducks"), four: T("bò", "cows"), unit: T("chân", "legs"), cnt: T("con", "animals"), per: T("chân", "legs"),
        q: function (n, f) { return T("Trang trại có cả vịt và bò, tất cả **" + n + " con** và **" + f + " chân**. Hỏi có bao nhiêu con vịt, bao nhiêu con bò?", "A farm has ducks and cows: **" + n + " animals** and **" + f + " legs** in all. How many ducks and how many cows are there?"); } },
      { two: T("gà", "chickens"), four: T("chó", "dogs"), unit: T("chân", "legs"), cnt: T("con", "animals"), per: T("chân", "legs"),
        q: function (n, f) { return T("Trong sân có cả gà và chó, tất cả **" + n + " con** và **" + f + " chân**. Hỏi có bao nhiêu con gà, bao nhiêu con chó?", "In the yard there are chickens and dogs: **" + n + " animals** and **" + f + " legs** in all. How many chickens and how many dogs are there?"); } }
    ];
  };
  var cap = function (s) { return s.charAt(0).toUpperCase() + s.slice(1); };
  extend("chick", [function (r) {
    var c = r.pick(CTX()), n = r.int(6, 15), b = r.int(1, n - 1), a = n - b, f = a * 2 + b * 4, lack = f - n * 2;
    return Q(c.q(n, f), [num(cap(c.two), a, c.cnt), num(cap(c.four), b, c.cnt)], [
      st(T("Giả sử cả " + n + " " + c.cnt + " đều là " + c.two + ": " + n + " × 2 = " + n * 2 + " (" + c.unit + ")", "Suppose all " + n + " are " + c.two + ": " + n + " × 2 = " + n * 2 + " (" + c.unit + ")"), n * 2),
      st(T("So với đề bài còn thiếu: " + f + " − " + n * 2 + " = " + lack + " (" + c.unit + ")", "Compared with the problem, we are short: " + f + " − " + n * 2 + " = " + lack + " (" + c.unit + ")"), lack),
      st(T("Mỗi lần thay 1 " + c.two + " bằng 1 " + c.four + ", số " + c.per + " tăng thêm: 4 − 2 = 2", "Each time 1 of the " + c.two + " is swapped for 1 of the " + c.four + ", the " + c.per + " go up by: 4 − 2 = 2"), 2),
      st(T("Số " + c.four + ": " + lack + " : 2 = " + b, "Number of " + c.four + ": " + lack + " ÷ 2 = " + b), b),
      st(T("Số " + c.two + ": " + n + " − " + b + " = " + a, "Number of " + c.two + ": " + n + " − " + b + " = " + a), a)],
      T("Giả sử tất cả là loại 2 " + c.per + ", rồi đổi dần sang loại 4 " + c.per + ".", "Suppose all are the kind with 2 " + c.per + ", then swap to the kind with 4 " + c.per + "."));
  }]);

  /* ---------- Trồng cây: hai đầu đều có, đổi vật ---------- */
  var THING = function () {
    return [
      { u: T("cột đèn", "lamp posts"), k: 5, q: function (L, s) { return T("Người ta dựng cột đèn dọc một bên đường dài **" + L + " m**, hai đầu đường đều có cột đèn, hai cột liền nhau cách nhau **" + s + " m**. Hỏi cần bao nhiêu cột đèn?", "Lamp posts are put up along one side of a road that is **" + L + " m** long. There is a lamp post at each end, and two neighboring posts are **" + s + " m** apart. How many lamp posts are needed?"); } },
      { u: T("cọc", "posts"), q: function (L, s) { return T("Bác Tư đóng cọc làm hàng rào dài **" + L + " m**, hai đầu hàng rào đều có cọc, hai cọc liền nhau cách nhau **" + s + " m**. Hỏi bác cần bao nhiêu cái cọc?", "Mr. Tư builds a fence that is **" + L + " m** long. There is a post at each end, and two neighboring posts are **" + s + " m** apart. How many posts does he need?"); } },
      { u: T("lá cờ", "flags"), q: function (L, s) { return T("Nhà trường cắm cờ dọc lối đi dài **" + L + " m**, hai đầu lối đi đều có cờ, hai lá cờ liền nhau cách nhau **" + s + " m**. Hỏi cần bao nhiêu lá cờ?", "The school puts flags along a path that is **" + L + " m** long. There is a flag at each end, and two neighboring flags are **" + s + " m** apart. How many flags are needed?"); } }
    ];
  };
  extend("trees", [function (r) {
    var th = r.pick(THING()), s = r.int(2, 6) * (th.k || 1), c = r.int(4, 12), L = s * c;   /* cột đèn cách nhau 10–30 m cho giống thật */
    return Q(th.q(L, s), [num("", c + 1, th.u)], [
      st(T("Số khoảng: " + L + " : " + s + " = " + c + " (khoảng)", "Number of gaps: " + L + " ÷ " + s + " = " + c + " (gaps)"), c),
      st(T("Hai đầu đều có: số " + th.u + " = số khoảng + 1 = " + c + " + 1 = " + (c + 1), "Both ends have one: number of " + th.u + " = gaps + 1 = " + c + " + 1 = " + (c + 1)), c + 1)],
      T("Hai đầu đều có thì số vật = số khoảng + 1.", "With one at both ends, the count = gaps + 1."));
  }]);
})();
