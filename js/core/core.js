'use strict';
 (() => {
  var CONFIG = {
   version: "9.0.2",
   schema: 4,
   curriculumNote: LT("theo SGK Kết nối tri thức Toán 4", "based on the Vietnamese Grade 4 math textbook (Kết nối tri thức)"),
   tiers: [{
    n: 0,
    name: LT("Thử nhanh", "Quick try"),
    tag: "t1",
    count: 1,
    need: 1,
    desc: LT("Một câu để kiểm tra", "One question to check")
   }, {
    n: 1,
    name: LT("Dễ", "Easy"),
    tag: "t1",
    count: 5,
    need: 4,
    desc: LT("Khởi động", "Warm-up")
   }, {
    n: 2,
    name: LT("Vừa", "Medium"),
    tag: "t2",
    count: 5,
    need: 4,
    desc: LT("Nâng cao một chút", "A little harder")
   }, {
    n: 3,
    name: LT("Khó", "Hard"),
    tag: "t3",
    count: 3,
    need: 2,
    desc: LT("Bài toán thử thách", "Challenge problems")
   }, {
    n: 4,
    name: LT("Nâng cao", "Advanced"),
    tag: "t3",
    count: 5,
    need: 3,
    desc: LT("Bài toán chọn lọc", "Selected problems")
   }],
   boss: {
    n: 2,
    name: LT("Bài trùm", "Boss Challenge"),
    tag: "t3",
    count: 5,
    need: 4
   },
   review: {
    n: 2,
    name: LT("Ôn tập", "Review"),
    tag: "t2",
    count: 4,
    need: 3
   },
   score: {
    firstTry: 1,
    secondTry: .5
   },
   starsPerItem: 4,
   dailyBonusStars: 2
  };
  var $ = (s, r = document) => r.querySelector(s),
   $$ = (s, r = document) => Array.prototype.slice.call(r.querySelectorAll(s));

  function mulberry32(a) {
   return function() {
    a |= 0, a = a + 1831565813 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    return t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t, ((t ^ t >>> 14) >>> 0) / 4294967296
   }
  }

  function mkRng(seed) {
   let f = mulberry32(seed >>> 0);
   return {
    f,
    int: (a, b) => a + Math.floor(f() * (b - a + 1)),
    pick: a => a[Math.floor(f() * a.length)],
    shuffle: a => {
     let b = a.slice();
     for (let i = b.length - 1; i > 0; i--) {
      let j = Math.floor(f() * (i + 1)),
       t = b[i];
      b[i] = b[j], b[j] = t
     }
     return b
    },
    chance: p => f() < p
   }
  }
  var NB = LANG === "en" ? "," : "\u00a0",
   fmt = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, NB),
   gcd = (a, b) => {
    for (a = Math.abs(a), b = Math.abs(b); b;) {
     let t = b;
     b = a % b, a = t
    }
    return a || 1
   };

  function esc(s) {
   return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  }

  function rich(s) {
   return s = esc(s ?? ""), s = s.replace(/\{([\w?]+)\/([\w?]+)\}/g, '<span class="fr"><i>$1</i><i>$2</i></span>'), s = s.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/\[\[(.+?)\]\]/g, "<mark>$1</mark>").replace(/\n/g, "<br>"), s = s.replace(/(\d) (?=\d{3}(?!\d))/g, "$1\u00a0").replace(/(\d) (?=\d{3}(?!\d))/g, "$1\u00a0").replace(/ ([:×+−=÷]) (?=[\d(])/g, " $1\u00a0"), s
  }

  function plain(s) {
   s = String(s ?? "");
   for (let k = 0; k < 3; k++) s = s.replace(/(\d)[\u00a0\u202f,](?=\d{3}(?!\d))/g, "$1");
   s = s.replace(/\{([\w?]+)\/([\w?]+)\}/g, LT("$1 phần $2", "$1 over $2")).replace(/\*\*|\[\[|\]\]/g, "");
   s = s.replace(/≥/g, LT(" lớn hơn hoặc bằng ", " greater than or equal to ")).replace(/≤/g, LT(" bé hơn hoặc bằng ", " less than or equal to ")).replace(/≈/g, LT(" xấp xỉ ", " is about ")).replace(/−/g, LT(" trừ ", " minus ")).replace(/×/g, LT(" nhân ", " times ")).replace(/÷/g, LT(" chia ", " divided by ")).replace(/\+/g, LT(" cộng ", " plus "));
   s = s.replace(/(?<=[\d)])\s*:\s*(?=[\d(])/g, LT(" chia ", " divided by ")).replace(/:/g, ",");
   s = s.replace(/=/g, LT(" bằng ", " equals ")).replace(/>/g, LT(" lớn hơn ", " greater than ")).replace(/</g, LT(" bé hơn ", " less than "));
   s = s.replace(/\bmm²/g, LT("mi-li-mét vuông", "square millimeters")).replace(/\bcm²/g, LT("xăng-ti-mét vuông", "square centimeters")).replace(/\bdm²/g, LT("đề-xi-mét vuông", "square decimeters")).replace(/\bm²/g, LT("mét vuông", "square meters"));
   s = s.replace(/°/g, LT(" độ", " degrees")).replace(/…|\.\.\./g, " ");
   return s.replace(/\s+/g, " ")
  }
  var todayStr = () => {
   let d = new Date;
   return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0")
  };
  var LESSONS = [],
   byId = id => LESSONS.find(l => l.id === id),
   NAMES = ["An", "Bình", "Lan", "Hà", "Minh", "Nam", "Mai", "Hùng", "Linh", "Khoa"],
   fr = (n, d) => "{" + n + "/" + d + "}",
   num = (lab, ans, unit) => ({
    lab: lab || "",
    ans,
    unit: unit || "",
    kind: "num"
   }),
   frp = (n, d, lab) => ({
    lab: lab || "",
    ans: [n, d],
    kind: "frac"
   }),
   chp = (opts, ans, lab) => ({
    lab: lab || "",
    ans,
    opts,
    kind: "choice"
   }),
   st = (t, v) => ({
    t,
    v
   });

  function QQ(o) {
   return Object.assign({
    parts: [],
    steps: [],
    tip: ""
   }, o)
  }

  function LESSON(o) {
   return o.links = o.links || [], LESSONS.push(o), o
  }
  var rd = (r, a, b) => r.int(a, b),
   TIERS = CONFIG.tiers;

  function seedOf(id, tier, k) {
   let h = 2166136261,
    s = id + "|" + tier + "|" + k;
   for (let i = 0; i < s.length; i++) h ^= s.charCodeAt(i), h = Math.imul(h, 16777619);
   return h >>> 0
  }

  function advQ(b) {
   let L = window.LANG === "en" ? "en" : "vi",
    parts = b.parts.map(p => {
     let lab = p.lab ? p.lab[L] : "";
     if (p.kind === "frac") return frp(p.ans[0], p.ans[1], lab);
     if (p.kind === "choice") {
      let o = p.opts[L];
      return chp(o, o[p.ans], lab)
     }
     return num(lab, p.ans, p.unit ? p.unit[L] : "")
    });
   return QQ({
    q: b.q[L],
    parts,
    steps: (b.steps || []).map(x => ({
     t: x[L],
     v: null
    })),
    tip: b.tip ? b.tip[L] : "",
    adv: 1,
    src: b.src
   })
  }

  function advCount(id) {
   return ((window.NANG_CAO || {})[id] || []).length
  }

  function makeAdv(lesson, salt) {
   let bank = (window.NANG_CAO || {})[lesson.id] || [],
    r = mkRng(seedOf(lesson.id, 4, salt)),
    want = [1, 2, 2],
    pick = [],
    left = [];
   for (let k = 1; k <= 3; k++) {
    let g = r.shuffle(bank.filter(b => b.rank === k)),
     n = want[k - 1];
    pick.push(...g.slice(0, n)), left.push(...g.slice(n))
   }
   if (pick.length < 5) pick.push(...r.shuffle(left).slice(0, 5 - pick.length));
   return pick.sort((a, b) => a.rank - b.rank).map(b => {
    let q = advQ(b);
    return q.lesson = lesson.id, q.tier = 4, q
   })
  }

  function makeSet(lesson, tier, salt) {
   if (tier === 4) return makeAdv(lesson, salt);
   let r = mkRng(seedOf(lesson.id, tier, salt)),
    T = TIERS[tier],
    out = [],
    seen = {},
    guard = 0;
   for (; out.length < T.count && guard++ < 60;) {
    let q = lesson.gen(tier, r),
     key = q.q + JSON.stringify(q.parts);
    seen[key] || (seen[key] = 1, q.lesson = lesson.id, q.tier = tier, out.push(q))
   }
   return out
  }

  function normNum(s) {
   return String(s ?? "").replace(/[\s .,]/g, "")
  }

  function checkPart(p, val) {
   if (p.kind === "frac") {
    if (!val || !val.n || !val.d) return !1;
    let n = +val.n,
     d = +val.d;
    return !isFinite(n) || !isFinite(d) || d === 0 ? !1 : p.exact ? n === p.ans[0] && d === p.ans[1] : n * p.ans[1] === d * p.ans[0]
   }
   return p.kind === "choice" ? val === p.ans : normNum(val) !== "" && +normNum(val) == +p.ans
  }

  function ansText(p) {
   return p.kind === "frac" ? fr(p.ans[0], p.ans[1]) : p.kind === "choice" ? p.ans : fmt(p.ans) + (p.unit ? " " + p.unit : "")
  }

  function extendTier(id, tier, gens, keepOld) {
   let l = byId(id),
    old = l.gen;
   l.gen = function(t, r) {
    if (t !== tier) return old.call(l, t, r);
    let n = gens.length + (keepOld ? 1 : 0),
     k = r.int(0, n - 1);
    return k < gens.length ? gens[k].call(l, r) : old.call(l, t, r)
   }
  }

  function addAsks(id, asks) {
   let l = byId(id);
   l && asks.slice().sort((a, b) => b.after - a.after).forEach(a => {
    let src = l.teach[a.after];
    l.teach.splice(a.after + 1, 0, {
     key: src.key,
     f: a.f != null ? a.f : src.f,
     theta: src.theta,
     say: a.say,
     ask: {
      opts: a.opts,
      ans: a.ans,
      good: a.good
     }
    })
   })
  }
  var NS = "http://www.w3.org/2000/svg",
   P = {
    ink: "#1F2A44",
    yellow: "#FFD23F",
    orange: "#FF8A3D",
    green: "#5CC98B",
    blue: "#4DA3FF",
    pink: "#FF6F91",
    purple: "#A78BFA",
    teal: "#2EC4B6",
    white: "#FFFFFF",
    peach: "#FFC9A3",
    mint: "#BFEBD3",
    sky: "#BFDDFF",
    rose: "#FFC2D1",
    sun: "#FFF0A8",
    gray: "#EDE7D8",
    red: "#E5484D",
    dark: "#4A5368",
    lav: "#DCD0FF",
    none: "none",
    okc: "#2E9E5B"
   },
   colr = c => P[c] || c,
   stroke_ = s => s === void 0 ? P.ink : s ? colr(s) : "none",
   E = {
    rect: (k, x, y, w, h, fill, o) => (o = o || {}, {
     k,
     t: "rect",
     geo: {
      x,
      y,
      width: w,
      height: h,
      rx: o.rx == null ? 7 : o.rx
     },
     c: {
      fill: colr(fill || "none"),
      stroke: stroke_(o.stroke),
      opacity: o.op == null ? 1 : o.op
     },
     a: {
      "stroke-width": o.sw || 2.5,
      "stroke-dasharray": o.dash || "none"
     },
     from: o.from
    }),
    circ: (k, cx, cy, r, fill, o) => (o = o || {}, {
     k,
     t: "circle",
     geo: {
      cx,
      cy,
      r
     },
     c: {
      fill: colr(fill || "none"),
      stroke: stroke_(o.stroke),
      opacity: o.op == null ? 1 : o.op
     },
     a: {
      "stroke-width": o.sw || 2.5,
      "stroke-dasharray": o.dash || "none"
     },
     from: o.from
    }),
    text: (k, x, y, txt, size, fill, o) => (o = o || {}, {
     k,
     t: "text",
     m: [x, y, o.rot || 0, o.scale == null ? 1 : o.scale],
     txt,
     c: {
      fill: colr(fill || "ink"),
      opacity: o.op == null ? 1 : o.op
     },
     a: {
      "font-size": size || 18,
      "text-anchor": o.anchor || "middle"
     },
     from: o.from
    }),
    line: (k, x1, y1, x2, y2, stroke, o) => (o = o || {}, {
     k,
     t: "line",
     a: {
      x1,
      y1,
      x2,
      y2,
      "stroke-width": o.sw || 2.5,
      "stroke-linecap": "round",
      "stroke-dasharray": o.dash || "none"
     },
     c: {
      stroke: colr(stroke || "ink"),
      opacity: o.op == null ? 1 : o.op
     },
     from: o.from
    }),
    path: (k, d, fill, stroke, o) => (o = o || {}, {
     k,
     t: "path",
     a: {
      d,
      "stroke-width": o.sw || 2.5,
      "stroke-linejoin": "round",
      "stroke-linecap": "round",
      "stroke-dasharray": o.dash || "none"
     },
     c: {
      fill: colr(fill || "none"),
      stroke: stroke_(stroke),
      opacity: o.op == null ? 1 : o.op
     },
     m: o.m,
     from: o.from
    }),
    poly: (k, pts, fill, o) => (o = o || {}, {
     k,
     t: "polygon",
     a: {
      points: pts,
      "stroke-width": o.sw || 2.5,
      "stroke-linejoin": "round",
      "stroke-dasharray": o.dash || "none"
     },
     c: {
      fill: colr(fill || "none"),
      stroke: stroke_(o.stroke),
      opacity: o.op == null ? 1 : o.op
     },
     m: o.m,
     from: o.from
    }),
    frac: (k, x, y, n, d, size, fill) => {
     size = size || 20;
     let w = Math.max(String(n).length, String(d).length) * size * .62 + 8;
     return [E.text(k + "n", x, y - 5, n, size, fill), E.line(k + "l", x - w / 2, y, x + w / 2, y, fill || "ink", {
      sw: 2.5
     }), E.text(k + "d", x, y + size * .92, d, size, fill)]
    }
   };

  function applyEl(n, e) {
   if (e.geo)
    for (let k in e.geo) n.style.setProperty(k, e.geo[k] + "px");
   if (e.c)
    for (let k in e.c) {
     let v = e.c[k];
     v != null && n.style.setProperty(k, v)
    }
   if (e.m) {
    let m = e.m;
    n.style.transform = "translate(" + m[0] + "px," + m[1] + "px)" + (m[2] ? " rotate(" + m[2] + "deg)" : "") + (m[3] != null && m[3] !== 1 ? " scale(" + m[3] + ")" : "")
   }
   if (e.a)
    for (let k in e.a) {
     let v = e.a[k];
     v == null ? n.removeAttribute(k) : n.setAttribute(k, v)
    }
   e.txt != null && n.textContent !== String(e.txt) && (n.textContent = e.txt)
  }

  function paint(svg, els, instant) {
   svg._m || (svg._m = new Map);
   let seen = new Set;
   for (let e of els) {
    seen.add(e.k);
    let n = svg._m.get(e.k);
    n ? applyEl(n, e) : (n = document.createElementNS(NS, e.t), svg.appendChild(n), svg._m.set(e.k, n), n.style.transition = "none", applyEl(n, e), instant ? n.style.transition = "" : (n.style.opacity = "0", e.from && applyEl(n, {
     geo: e.from.geo,
     c: e.from.c,
     m: e.from.m
    }), n.getBoundingClientRect(), n.style.transition = "", applyEl(n, e), e.from && e.from.c && e.from.c.opacity != null, n.style.opacity = e.c && e.c.opacity != null ? e.c.opacity : 1)), n.parentNode && n.parentNode.lastChild !== n && e._front && svg.appendChild(n)
   }
   svg._m.forEach((n, k) => {
    if (!seen.has(k)) {
     if (svg._m.delete(k), instant) {
      n.remove();
      return
     }
     n.style.opacity = "0", setTimeout(() => {
      n.parentNode && n.remove()
     }, 500)
    }
   });
   let prev = null;
   for (let e of els) {
    let n = svg._m.get(e.k);
    n && (prev ? prev.nextSibling !== n && svg.insertBefore(n, prev.nextSibling) : svg.firstChild !== n && svg.insertBefore(n, svg.firstChild), prev = n)
   }
   fitTexts(svg, els)
  }

  /* Tự co/dời chữ trong hình SVG khi vượt khung (bản Anh có chữ dài hơn) */
  function fitTexts(svg, els) {
   try {
    let vb = svg.viewBox && svg.viewBox.baseVal, W = vb && vb.width;
    if (!W || !svg.getBoundingClientRect().width) return;
    for (let e of els) {
     if (e.t !== "text" || (e.m && e.m[2])) continue;
     let n = svg._m.get(e.k);
     if (!n || !n.textContent || n.style.opacity === "0") continue;
     let m = e.m, sc = m[3] == null ? 1 : m[3], bb = n.getBBox();
     if (!bb.width) continue;
     let l = m[0] + bb.x * sc, r = l + bb.width * sc, pad = 3;
     if (l >= pad && r <= W - pad) continue;
     if (bb.width * sc > W - 2 * pad) {
      let k = (W - 2 * pad) / (bb.width * sc), fs = +n.getAttribute("font-size") || 18;
      n.setAttribute("font-size", Math.max(9, fs * k).toFixed(1));
      bb = n.getBBox(); l = m[0] + bb.x * sc; r = l + bb.width * sc
     }
     let dx = l < pad ? pad - l : r > W - pad ? W - pad - r : 0;
     if (dx) n.style.transform = "translate(" + (m[0] + dx) + "px," + m[1] + "px)" + (sc !== 1 ? " scale(" + sc + ")" : "")
    }
   } catch (err) {}
  }

  function mkSvg(vb, cls) {
   let s = document.createElementNS(NS, "svg");
   return s.setAttribute("viewBox", "0 0 " + vb[0] + " " + vb[1]), s.setAttribute("preserveAspectRatio", "xMidYMid meet"), s.setAttribute("role", "img"), s.setAttribute("class", cls || ""), s
  }
  var FB = {};
  /* hình thô cho bài học mới: frames = mảng chuỗi SVG (đầy đủ <svg>) hoặc hàm trả chuỗi */
  function RAWFIG(frames) { return {raw: true, vb: [360, 200], frames: frames.map(x => typeof x === "function" ? x : (() => x))}; }
  FB.bars = function(scenes, o) {
   o = o || {};
   let W = 360,
    left = o.left != null ? o.left : 60,
    hasBr = scenes.some(s => s.br && s.br.length),
    right = o.right != null ? o.right : hasBr ? 66 : 16,
    top = o.top != null ? o.top : 34,
    rowH = o.rowH || 38,
    gap = o.gap != null ? o.gap : 28,
    mx = 1,
    nr = 0;
   scenes.forEach(s => {
    nr = Math.max(nr, s.rows.length), s.rows.forEach(r => {
     mx = Math.max(mx, r.segs.reduce((a, g) => a + g.u, 0))
    })
   });
   let sc = (W - left - right) / mx,
    H = top + nr * (rowH + gap) - gap + (o.bottom != null ? o.bottom : 34);
   return {
    frames: scenes.map(s => {
     let els = [];
     return s.rows.forEach((r, i) => {
      let y = top + i * (rowH + gap),
       x = left;
      els.push(E.text("lab" + i, left - 8, y + rowH / 2 + 7, r.lab || "", 19, "ink", {
       anchor: "end"
      })), r.segs.forEach((g, j) => {
       let id = g.id != null ? g.id : j,
        w = g.u * sc;
       els.push(E.rect("s" + i + "_" + id, x, y, w, rowH, g.c || "blue", {
        dash: g.dash ? "7 4" : null,
        op: g.faded ? .4 : 1,
        from: {
         geo: {
          width: 0
         }
        }
       })), g.t != null && g.t !== "" && els.push(E.text("t" + i + "_" + id, x + w / 2, y + rowH / 2 + 7, g.t, 19, "ink")), g.over != null && els.push(E.text("o" + i + "_" + id, x + w / 2, y - 8, g.over, 18, g.oc || "ink")), x += w
      }), r._end = x
     }), (s.br || []).forEach((b, i) => {
      let ex = 0;
      for (let q = b.r1; q <= b.r2; q++) ex = Math.max(ex, s.rows[q]._end);
      let y1 = top + b.r1 * (rowH + gap),
       y2 = top + b.r2 * (rowH + gap) + rowH,
       x = ex + 8;
      els.push(E.path("br" + i, "M" + x + " " + y1 + " h10 V" + y2 + " h-10", "none", "ink")), els.push(E.text("brt" + i, x + 16, (y1 + y2) / 2 + 7, b.t, 20, b.c || "ink", {
       anchor: "start"
      }))
     }), (s.notes || []).forEach((n, i) => els.push(E.text("nt" + i, 180, n.y != null ? n.y : H - 10, n.t, n.s || 18, n.c || "ink"))), els
    }),
    vb: [W, H]
   }
  };
  /* v9: sơ đồ ĐOẠN THẲNG kiểu vở ô li — cùng cấu trúc cảnh như FB.bars (rows/segs/br/notes), dùng cho dạng tổng – hiệu.
     Đoạn thẳng có vạch ở hai mút; phần hơn (c:"yellow") nét cam; phần bị bớt (faded) nét đứt xám;
     dấu "?" của cả đoạn ghi bằng ngoặc nhọn trên (hàng đầu) hoặc dưới (hàng sau); tổng là ngoặc nhọn đứng bên phải. */
  var SEGC = {pen: "#1E3A8A", org: "#E8590C", red: "#D6336C", gr: "#8C96A8"},
   r1_ = v => Math.round(v * 10) / 10;
  function hBrace(x1, x2, y, h, up) {
   let s = up ? -1 : 1, q = h / 2, m = r1_((x1 + x2) / 2);
   if (x2 - x1 < 4 * q) q = Math.max(1.5, (x2 - x1) / 4);
   q = r1_(q);
   return "M" + r1_(x1) + " " + y + " q0 " + s * q + " " + q + " " + s * q + " H" + r1_(m - q) + " q" + q + " 0 " + q + " " + s * q + " q0 " + -s * q + " " + q + " " + -s * q + " H" + r1_(x2 - q) + " q" + q + " 0 " + q + " " + -s * q
  }
  function vBrace(x, y1, y2, w) {
   let q = w / 2, m = (y1 + y2) / 2;
   return "M" + x + " " + y1 + " q" + q + " 0 " + q + " " + q + " V" + r1_(m - q) + " q0 " + q + " " + q + " " + q + " q" + -q + " 0 " + -q + " " + q + " V" + r1_(y2 - q) + " q0 " + q + " " + -q + " " + q
  }
  FB.segs = function(scenes, o) {
   o = o || {};
   let W = 360, C = SEGC,
    nameOf = l => LANG === "en" ? l : l === "Lớn" ? "Số lớn" : l === "Bé" ? "Số bé" : l,
    left = Math.max(o.left != null ? o.left : 60, LANG === "en" ? 86 : 64) + 14,
    hasBr = scenes.some(s => s.br && s.br.length),
    right = hasBr ? 64 : 18,
    top = 54, pitch = 66, mx = 1, nr = 0,
    hasNotes = scenes.some(s => s.notes && s.notes.length);
   scenes.forEach(s => {
    nr = Math.max(nr, s.rows.length), s.rows.forEach(r => { mx = Math.max(mx, r.segs.reduce((a, g) => a + g.u, 0)) })
   });
   let sc = (W - left - right) / mx,
    H = top + (nr - 1) * pitch + 54 + (hasNotes ? 30 : 0),
    thin = "", thick = "", vert = "";
   for (let y = 9; y < H; y += 9) y % 36 ? thin += "M0 " + y + "H" + W : thick += "M0 " + y + "H" + W;
   for (let x = 36; x < W; x += 36) vert += "M" + x + " 0V" + H;
   let paper = [E.rect("pg0", 0, 0, W, H, "#FFFEF6", {stroke: "", rx: 10}), E.path("pg1", thin || "M0 0", "none", "#E6EEF9", {sw: 1}), E.path("pg2", vert || "M0 0", "none", "#E6EEF9", {sw: 1}), E.path("pg3", thick || "M0 0", "none", "#C9D9F0", {sw: 1})];
   return {
    frames: scenes.map(s => {
     let els = paper.slice();
     s.rows.forEach((r, i) => {
      let y = top + i * pitch, x = left, mainEnd = left, mainT = null;
      els.push(E.text("lab" + i, left - 12, y + 6, r.lab ? nameOf(r.lab) + ":" : "", 17, C.pen, {anchor: "end"}));
      els.push(E.line("k" + i + "_s", x, y - 8, x, y + 8, C.pen, {sw: 2.6}));
      r.segs.forEach((g, j) => {
       let id = g.id != null ? g.id : j, w = g.u * sc, diff = g.c === "yellow" && !g.faded, col = g.faded ? C.gr : diff ? C.org : C.pen;
       els.push(E.line("s" + i + "_" + id, r1_(x), y, r1_(x + w), y, col, {sw: diff ? 3.4 : 2.8, dash: g.dash || g.faded ? "6 5" : null}));
       els.push(E.line("k" + i + "_" + id, r1_(x + w), y - 8, r1_(x + w), y + 8, col, {sw: 2.6}));
       if (g.faded || diff) {
        g.t != null && g.t !== "" && (els.push(E.path("db" + i + "_" + id, hBrace(x + 2, x + w - 2, y + 12, 10, !1), "none", col, {sw: 2})), els.push(E.text("dt" + i + "_" + id, r1_(x + w / 2), y + 40, g.t, 16, g.faded ? C.gr : C.org)))
       } else mainT == null && g.t != null && g.t !== "" && (mainT = g.t);
       g.faded || (mainEnd = x + w);
       g.over != null && els.push(E.text("o" + i + "_" + id, r1_(x + w / 2), y - 12, g.over, 16, g.oc || C.pen));
       x += w
      });
      r._end = x;
      if (mainT != null) {
       let up = i === 0;
       els.push(E.path("mb" + i, hBrace(left + 1, mainEnd - 1, up ? y - 12 : y + 12, 12, up), "none", C.pen, {sw: 2}));
       els.push(E.text("mt" + i, r1_((left + mainEnd) / 2), up ? y - 30 : y + 44, mainT, 18, C.pen))
      }
     });
     (s.br || []).forEach((b, k) => {
      let ex = 0;
      for (let q = b.r1; q <= b.r2; q++) ex = Math.max(ex, s.rows[q]._end);
      let ya = top + b.r1 * pitch - 10, yb = top + b.r2 * pitch + 10, bx = r1_(ex + 12), col = !b.c || b.c === "red" ? C.red : colr(b.c);
      els.push(E.path("br" + k, vBrace(bx, ya, yb, 14), "none", col, {sw: 2.2}));
      els.push(E.text("brt" + k, bx + 20, (ya + yb) / 2 + 7, b.t, 20, col, {anchor: "start"}))
     });
     (s.notes || []).forEach((n, k) => els.push(E.text("nt" + k, 180, n.y != null ? n.y : H - 10, n.t, n.s || 16, n.c || C.pen)));
     return els
    }),
    vb: [W, H]
   }
  };
  FB.place = function(str, specs) {
   let n = str.length,
    W = 360,
    cw = Math.min(52, Math.floor((LANG === "en" ? 350 : 330) / n)),
    hsz = LANG === "en" ? n <= 6 ? 10.5 : n === 7 ? 10 : 9 : 14,
    x0 = (W - cw * n) / 2,
    hang = [LT("đơn vị", "ones"), LT("chục", "tens"), LT("trăm", "hundreds"), LT("nghìn", "thousands"), LT("chục nghìn", "ten thousands"), LT("trăm nghìn", "hundred thousands"), LT("triệu", "millions"), LT("chục triệu", "ten millions"), LT("trăm triệu", "hundred millions")],
    lop = [LT("Lớp đơn vị", "Ones period"), LT("Lớp nghìn", "Thousands period"), LT("Lớp triệu", "Millions period"), LT("Lớp tỉ", "Billions period")];
   return {
    frames: specs.map(sp => {
     let els = [];
     for (let g = 0; g * 3 < n; g++) {
      let hiR = n - g * 3,
       lo = Math.max(0, n - g * 3 - 3),
       xs = x0 + lo * cw,
       w = (hiR - lo) * cw;
      els.push(E.rect("cls" + g, xs + 2, 8, w - 4, 34, ["sun", "sky", "mint", "rose"][g % 4], {
       rx: 9
      })), els.push(E.text("clt" + g, xs + w / 2, 32, w > cw * 2 ? lop[g] : [LT("ĐV", "Ones"), LT("Nghìn", "Thou."), LT("Triệu", "Mill."), LT("Tỉ", "Bill.")][g], w > cw * 2 ? 17 : 15, "ink"))
     }
     for (let i = 0; i < n; i++) {
      let pos = n - 1 - i,
       x = x0 + i * cw,
       hi = (sp.hi || []).indexOf(i) >= 0;
      els.push(E.rect("c" + i, x + 2, 50, cw - 4, 62, hi ? "yellow" : "white", {
       rx: 9
      })), els.push(E.text("d" + i, x + cw / 2, 95, str[i], 36, "ink")), hang[pos].split(" ").forEach((w, l) => els.push(E.text("h" + i + "_" + l, x + cw / 2, 132 + l * 16, w, hsz, "dark")))
     }
     return sp.note && els.push(E.text("note", 180, 182, sp.note, 21, "ink")), sp.note2 && els.push(E.text("note2", 180, 208, sp.note2, 18, "dark")), els
    }),
    vb: [W, 222]
   }
  };

  function arrowHead(k, x, y, ang, sz, fill) {
   let a = ang * Math.PI / 180,
    p = (dx, dy) => (x + dx * Math.cos(a) - dy * Math.sin(a)).toFixed(1) + "," + (y + dx * Math.sin(a) + dy * Math.cos(a)).toFixed(1);
   return E.poly(k, p(0, 0) + " " + p(-sz, -sz * .55) + " " + p(-sz, sz * .55), fill || "ink", {
    sw: 1.5
   })
  }
  FB.hop = function(k, x1, x2, y, t, color, h) {
   h = h || 46;
   let mx = (x1 + x2) / 2;
   return [E.path(k + "p", "M" + x1 + " " + y + " Q" + mx + " " + (y - h * 1.6) + " " + x2 + " " + y, "none", color || "ink", {
    sw: 2.5
   }), arrowHead(k + "h", x2, y, (x2 > x1 ? 60 : 120) * (x2 > x1, 1), 9, color || "ink"), E.text(k + "t", mx, y - h * .8 - 6, t, 18, color || "ink")]
  };
  FB.nline = function(spec, frames) {
   let x0 = spec.x0 || 26,
    x1 = spec.x1 || 334,
    y = 104,
    W = 360,
    sc = (x1 - x0) / (spec.max - spec.min),
    X = v => x0 + (v - spec.min) * sc;
   return {
    frames: frames.map(f => {
     let els = [E.line("axis", x0 - 10, y, x1 + 10, y, "ink", {
      sw: 4
     })];
     for (let v = spec.min, i = 0; v <= spec.max + 1e-9 && i < 200; v += spec.tick, i++) {
      let big = Math.abs((v - spec.min) / (spec.tick * (spec.big || 5)) % 1) < 1e-9 || i === 0;
      els.push(E.line("tk" + i, X(v), y - (big ? 13 : 7), X(v), y + (big ? 13 : 7), "ink", {
       sw: big ? 3.5 : 2.5
      }))
     }
     return (f.labels || []).forEach((l, i) => els.push(E.text("lb" + i + "_" + l.v, X(l.v), y + 38, l.t, l.s || 17, l.c || "ink"))), (f.zone || []).forEach((z, i) => els.push(E.rect("zn" + i, X(z.a), y - 9, X(z.b) - X(z.a), 18, z.c || "sun", {
      rx: 4,
      stroke: null,
      op: .7
     }))), (f.marks || []).forEach((m, i) => {
      els.push(E.circ("m" + (m.id || i), X(m.v), y, m.r || 10, m.c || "orange")), m.t && els.push(E.text("ml" + (m.id || i), X(m.v), m.below ? y + 62 : y - 24, m.t, m.s || 19, m.tc || "ink"))
     }), (f.hops || []).forEach((h, i) => {
      FB.hop("hp" + i, X(h.a), X(h.b), y - 16, h.t || "", h.c || "blue", h.h || 42).forEach(e => els.push(e))
     }), f.note && els.push(E.text("note", 180, spec.noteY || 162, f.note, 20, "ink")), els
    }),
    vb: [W, spec.h || 176]
   }
  };
  FB.expr = function(frames, o) {
   o = o || {};
   let W = 360;
   return {
    frames: frames.map(f => {
     let els = [],
      pos = {},
      fsz = o.fs || 28;
     return (f.lines || []).forEach(ln => {
      let fs = ln.fs || fsz,
       cw = fs * .6,
       ws = ln.toks.map(t => Math.max(String(t.t).length * cw * (t.sz || 1), fs * .5) + (t.gap != null ? t.gap : 14)),
       tot = ws.reduce((a, b) => a + b, 0),
       x = ln.x != null ? ln.x : (W - tot) / 2;
      ln.toks.forEach((t, i) => {
       let w = ws[i];
       pos[t.k] = {
        cx: x + w / 2,
        w,
        y: ln.y,
        fs
       }, t._p = pos[t.k], x += w
      })
     }), (f.bg || []).forEach((b, i) => {
      let a = pos[b.from],
       z = pos[b.to || b.from];
      if (!a || !z) return;
      let x1 = a.cx - a.w / 2 + 4,
       x2 = z.cx + z.w / 2 - 4,
       fs = a.fs;
      els.push(E.rect("bgr" + (b.id || i), x1, a.y - fs * .88, x2 - x1, fs * 1.3, b.c || "sun", {
       rx: 10,
       stroke: b.stroke === void 0 ? "ink" : b.stroke,
       op: b.op == null ? 1 : b.op
      })), b.t && els.push(E.text("bgt" + (b.id || i), (x1 + x2) / 2, a.y + fs * 1.05 + 8, b.t, b.s || 17, b.tc || "ink"))
     }), (f.lines || []).forEach(ln => ln.toks.forEach(t => {
      let p = t._p;
      t.box && els.push(E.rect("bx" + t.k, p.cx - p.w / 2 + 4, p.y - p.fs * .88, p.w - 8, p.fs * 1.3, t.box, {
       rx: 8
      })), els.push(E.text(t.k, p.cx, p.y, t.t, p.fs * (t.sz || 1), t.c || "ink"))
     })), (f.extra || []).forEach(e => {
      (typeof e == "function" ? e(pos) : [e]).forEach(x => els.push(x))
     }), (f.notes || []).forEach((n, i) => els.push(E.text("nt" + i, 180, n.y, n.t, n.s || 19, n.c || "ink"))), els
    }),
    vb: [W, o.h || 200]
   }
  };

  function digitsOf(n, len) {
   return String(n).padStart(len, " ").split("")
  }
  FB.col = function(a, b, op) {
   let res = op === "+" ? a + b : a - b,
    n = Math.max(String(a).length, String(b).length, String(res).length),
    W = 360,
    cw = Math.min(44, Math.floor(300 / (n + 1.4))),
    x0 = (W - cw * (n + 1)) / 2 + cw,
    cx = i => x0 + i * cw + cw / 2,
    Y = {
     c: 36,
     a: 84,
     b: 128,
     l: 146,
     r: 192
    },
    A = digitsOf(a, n),
    B = digitsOf(b, n),
    R = digitsOf(res, n),
    info = [],
    carry = 0;
   for (let i = n - 1; i >= 0; i--) {
    let da = A[i] === " " ? 0 : +A[i],
     db = B[i] === " " ? 0 : +B[i];
    if (op === "+") {
     let s = da + db + carry;
     info[i] = {
      da,
      db,
      cin: carry,
      v: s,
      dr: s % 10,
      cout: Math.floor(s / 10)
     }, carry = Math.floor(s / 10)
    } else {
     let t = db + carry,
      cur = da,
      bor = 0;
     da < t && (cur = da + 10, bor = 1), info[i] = {
      da,
      db,
      cin: carry,
      v: cur - t,
      dr: cur - t,
      cout: bor,
      cur,
      t
     }, carry = bor
    }
   }
   let base = upto => {
     let els = [];
     for (let i = 0; i < n; i++) A[i] !== " " && els.push(E.text("a" + i, cx(i + 1), Y.a, A[i], 36, "ink")), B[i] !== " " && els.push(E.text("b" + i, cx(i + 1), Y.b, B[i], 36, "ink"));
     return els.push(E.text("op", cx(0) + 2, Y.b, op, 36, "orange")), els.push(E.line("ln", cx(0) - cw / 2 + 6, Y.l, cx(n) + cw / 2, Y.l, "ink", {
      sw: 3.5
     })), els
    },
    frames = [base()];
   for (let step = 0; step < n; step++) {
    let i = n - 1 - step,
     els = [];
    els.push(E.rect("hl", cx(i + 1) - cw / 2 + 2, Y.c - 20, cw - 4, Y.r - Y.c + 34, "sun", {
     rx: 10,
     stroke: null,
     op: .8
    })), base().forEach(e => els.push(e));
    for (let j = n - 1; j >= i; j--) els.push(E.text("r" + j, cx(j + 1), Y.r, R[j], 36, j === i ? "okc" : "ink")), info[j].cout > 0 && j > 0 && els.push(E.text("cy" + j, cx(j), Y.c + 4, "1", 22, "orange"));
    frames.push(els)
   }
   return {
    frames,
    vb: [W, 222],
    info,
    n,
    res
   }
  };
  FB.mul1 = function(a, m) {
   let res = a * m,
    n = Math.max(String(a).length, String(res).length),
    W = 360,
    cw = Math.min(44, Math.floor(300 / (n + 1.4))),
    x0 = (W - cw * (n + 1)) / 2 + cw,
    cx = i => x0 + i * cw + cw / 2,
    Y = {
     c: 36,
     a: 84,
     b: 128,
     l: 146,
     r: 192
    },
    A = digitsOf(a, n),
    R = digitsOf(res, n),
    info = [],
    carry = 0;
   for (let i = n - 1; i >= 0; i--) {
    let da = A[i] === " " ? 0 : +A[i],
     v = da * m + carry;
    info[i] = {
     da,
     cin: carry,
     v,
     dr: v % 10,
     cout: Math.floor(v / 10)
    }, carry = Math.floor(v / 10)
   }
   let base = () => {
     let els = [];
     for (let i = 0; i < n; i++) A[i] !== " " && els.push(E.text("a" + i, cx(i + 1), Y.a, A[i], 36, "ink"));
     return els.push(E.text("mb", cx(n), Y.b, String(m), 36, "ink")), els.push(E.text("op", cx(0) + 2, Y.b, "×", 36, "orange")), els.push(E.line("ln", cx(0) - cw / 2 + 6, Y.l, cx(n) + cw / 2, Y.l, "ink", {
      sw: 3.5
     })), els
    },
    frames = [base()];
   for (let step = 0; step < n; step++) {
    let i = n - 1 - step,
     els = [];
    if (info[i].da === 0 && A[i] === " " && info[i].cin === 0) break;
    els.push(E.rect("hl", cx(i + 1) - cw / 2 + 2, Y.c - 20, cw - 4, Y.r - Y.c + 34, "sun", {
     rx: 10,
     stroke: null,
     op: .8
    })), base().forEach(e => els.push(e));
    for (let j = n - 1; j >= i; j--) R[j] !== " " && els.push(E.text("r" + j, cx(j + 1), Y.r, R[j], 36, j === i ? "okc" : "ink")), info[j].cout > 0 && j > 0 && els.push(E.text("cy" + j, cx(j), Y.c, String(info[j].cout), 22, "orange"));
    frames.push(els)
   }
   return {
    frames,
    vb: [W, 222],
    info,
    n,
    res
   }
  };
  FB.mul2 = function(a, m) {
   let t = m % 10,
    u = Math.floor(m / 10),
    p1 = a * t,
    p2 = a * u,
    res = a * m,
    n = String(res).length,
    W = 360,
    cw = Math.min(40, Math.floor(300 / (n + 1.4))),
    x0 = (W - cw * (n + 1)) / 2 + cw,
    cx = i => x0 + i * cw + cw / 2,
    Y = {
     a: 40,
     b: 82,
     l: 98,
     p1: 138,
     p2: 178,
     l2: 194,
     r: 234
    },
    rowTxt = (k, val, y, shift, color) => {
     let s = String(val),
      els = [];
     for (let i = 0; i < s.length; i++) els.push(E.text(k + i, cx(n - s.length + i - shift + 1), y, s[i], 34, color || "ink"));
     return els
    },
    base = () => {
     let els = [];
     return els.push(...rowTxt("a", a, Y.a, 0)), els.push(...rowTxt("m", m, Y.b, 0)), els.push(E.text("op", cx(0) + 2, Y.b, "×", 34, "orange")), els.push(E.line("ln", cx(0) - cw / 2 + 6, Y.l, cx(n) + cw / 2, Y.l, "ink", {
      sw: 3.5
     })), els
    },
    f0 = base(),
    f1 = base().concat(rowTxt("p", p1, Y.p1, 0, "blue")),
    f2 = f1.concat(rowTxt("q", p2, Y.p2, 1, "pink"));
   f2.push(E.text("sh", cx(n) + cw * .1, Y.p2, "", 1, "ink"));
   let f3 = f2.concat([E.line("ln2", cx(0) - cw / 2 + 6, Y.l2, cx(n) + cw / 2, Y.l2, "ink", {
    sw: 3.5
   })], rowTxt("r", res, Y.r, 0, "okc"));
   return {
    frames: [f0, f1, f2, f3],
    vb: [W, 252],
    p1,
    p2,
    res,
    t,
    u
   }
  };
  FB.div = function(n, d) {
   let D = String(n).split("").map(Number),
    m = D.length,
    cw = 34,
    ch = 38,
    x0 = 14,
    top = 34,
    W = 360,
    start = 0,
    cur = 0;
   for (let i = 0; i < m; i++) {
    if (cur = cur * 10 + D[i], cur >= d) {
     start = i;
     break
    }
    i === m - 1 && (start = i)
   }
   let rem = D.slice(0, start).reduce((a, x) => a * 10 + x, 0),
    st2 = [];
   for (let i = start; i < m; i++) {
    let c = rem * 10 + D[i],
     q = Math.floor(c / d),
     prod = q * d,
     r2 = c - prod;
    st2.push({
     i,
     cur: c,
     q,
     prod,
     rem: r2
    }), rem = r2
   }
   let H = top + ch * (2 * st2.length + 1) + 16,
    xb = x0 + m * cw + 6,
    xq = xb + 14,
    cxd = i => x0 + i * cw + cw / 2,
    base = () => {
     let els = [];
     return D.forEach((x, i) => els.push(E.text("D" + i, cxd(i), top, String(x), 32, "ink"))), els.push(E.line("vb", xb, top - 30, xb, top + ch * .45, "ink", {
      sw: 3.5
     })), els.push(E.line("hb", xb, top + ch * .45, xb + String(d).length * 22 + 30, top + ch * .45, "ink", {
      sw: 3.5
     })), els.push(E.text("dv", xq + String(d).length * 10, top, String(d), 32, "blue")), els
    },
    frames = [base()];
   for (let k = 0; k < st2.length; k++) {
    let s = st2[k],
     els = [],
     lo = k === 0 ? 0 : s.i;
    els.push(E.rect("hl", cxd(lo) - cw / 2 + 2, top - 28, (s.i - lo + 1) * cw - 4, 36, "sun", {
     rx: 8,
     stroke: null,
     op: .9
    })), base().forEach(e => els.push(e));
    for (let j = 0; j <= k; j++) {
     let t = st2[j],
      ps = String(t.prod),
      rs = String(t.rem),
      yp = top + ch * (1 + 2 * j),
      yr = top + ch * (2 + 2 * j);
     els.push(E.text("q" + j, xq + String(d).length * 10 + 0 + j * 20 - (st2.length - 1) * 0 - String(d).length * 10 + String(d).length * 10 - String(d).length * 10 + String(d).length * 10, top + ch * .45 + 30, String(t.q), 32, "okc"));
     for (let z = 0; z < ps.length; z++) els.push(E.text("p" + j + "_" + z, cxd(t.i - ps.length + 1 + z), yp, ps[z], 32, "orange"));
     els.push(E.line("pl" + j, cxd(t.i - ps.length) + cw * .15, yp + ch * .45, cxd(t.i) + cw * .5, yp + ch * .45, "ink", {
      sw: 3
     }));
     for (let z = 0; z < rs.length; z++) els.push(E.text("rm" + j + "_" + z, cxd(t.i - rs.length + 1 + z), yr, rs[z], 32, "ink"));
     j === k && t.i + 1 < m && els.push(E.text("dn" + j, cxd(t.i + 1), yr, String(D[t.i + 1]), 32, "pink", {
      from: {
       m: [cxd(t.i + 1), yr - ch * (2 * k + 1) + 0]
      }
     }))
    }
    frames.push(els)
   }
   return {
    frames,
    vb: [W, H],
    st: st2,
    q: Math.floor(n / d),
    r: n % d
   }
  };
  FB.pie = function(k, cx, cy, r, den, num2, color, hiAll) {
   let els = [];
   if (den === 1) return els.push(E.circ(k + "_c", cx, cy, r, num2 >= 1 ? color : "white")), els;
   for (let j = 0; j < den; j++) {
    let a0 = (-90 + j * 360 / den) * Math.PI / 180,
     a1 = (-90 + (j + 1) * 360 / den) * Math.PI / 180,
     x0 = cx + r * Math.cos(a0),
     y0 = cy + r * Math.sin(a0),
     x1 = cx + r * Math.cos(a1),
     y1 = cy + r * Math.sin(a1),
     large = 360 / den > 180 ? 1 : 0;
    els.push(E.path(k + "_" + den + "_" + j, "M" + cx + " " + cy + " L" + x0.toFixed(2) + " " + y0.toFixed(2) + " A" + r + " " + r + " 0 " + large + " 1 " + x1.toFixed(2) + " " + y1.toFixed(2) + " Z", j < num2 ? color : "white", "ink", {
     sw: 2.5
    }))
   }
   return els
  };
  FB.fbar = function(k, x, y, w, h, den, num2, color) {
   let els = [],
    cw = w / den;
   for (let j = 0; j < den; j++) els.push(E.rect(k + "_" + den + "_" + j, x + j * cw, y, cw, h, j < num2 ? color : "white", {
    rx: j === 0 || j === den - 1 ? 7 : 0,
    sw: 2.5
   }));
   return els
  };
  FB.frac = function(scenes, o) {
   return o = o || {}, {
    frames: scenes.map(s => {
     let els = [];
     return (s.pies || []).forEach((p, i) => FB.pie("pie" + i, p.cx, p.cy, p.r || 60, p.den, p.num, p.c || "pink").forEach(e => els.push(e))), (s.bars || []).forEach((b, i) => {
      FB.fbar("bar" + i, b.x != null ? b.x : 76, b.y, b.w != null ? b.w : 262, b.h || 36, b.den, b.num, b.c || "pink").forEach(e => els.push(e)), b.lab && E.frac("bl" + i, 40, b.y + b.h / 2 - 2 || b.y + 16, b.lab[0], b.lab[1], 22, b.lc || "ink").forEach(e => els.push(e)), b.txt && els.push(E.text("btx" + i, b.x != null ? b.x : 76, b.y - 7, b.txt, 17, "dark", {
       anchor: "start"
      }))
     }), (s.fr || []).forEach((f, i) => E.frac("f" + i, f.x, f.y, f.n, f.d, f.s || 26, f.c || "ink").forEach(e => els.push(e))), (s.tx || []).forEach((t, i) => els.push(E.text("x" + i, t.x, t.y, t.t, t.s || 20, t.c || "ink", {
      anchor: t.a || "middle"
     }))), (s.extra || []).forEach(e => els.push(e)), els
    }),
    vb: [360, o.h || 220]
   }
  };
  FB.ladder = function(units, fac, frames, o) {
   o = o || {};
   let n = units.length,
    W = 360,
    bw = n > 4 ? 58 : 66,
    gap = (W - 24 - bw * n) / (n - 1),
    x0 = 12;
   return {
    frames: frames.map(f => {
     let els = [];
     return units.forEach((u, i) => {
      let x = x0 + i * (bw + gap),
       hi = f.hi && f.hi.indexOf(i) >= 0;
      if (els.push(E.rect("u" + i, x, 58, bw, 58, hi ? "yellow" : "white", {
        rx: 10
       })), els.push(E.text("un" + i, x + bw / 2, 96, u.n, n > 4 ? 20 : 24, "ink")), u.s && els.push(E.text("us" + i, x + bw / 2, 136, u.s, 15, "dark")), i < n - 1) {
       let mid = x + bw + gap / 2,
        on = f.path && f.path.indexOf(i) >= 0;
       els.push(E.text("ar" + i, mid, 44, "×" + fac, 16, on ? "orange" : "dark")), els.push(E.path("ah" + i, "M" + (mid - 12) + " 50 h24 m-7 -6 l7 6 l-7 6", "none", on ? "orange" : "ink", {
        sw: 3
       })), els.push(E.text("dr" + i, mid, 144, "÷" + fac, 16, on ? "blue" : "dark"))
      }
     }), f.note && els.push(E.text("note", 180, o.noteY || 182, f.note, 22, "ink")), f.note2 && els.push(E.text("note2", 180, (o.noteY || 182) + 28, f.note2, 18, "dark")), els
    }),
    vb: [W, o.h || 228]
   }
  };
  FB.hbh = function(a, h, sh) {
   let scx = Math.min(200 / a, 150 / h),
    S = Math.min(scx, 16),
    A = a * S,
    Hh = h * S,
    SH = sh * S,
    x0 = (360 - (A + SH)) / 2,
    y1 = 170,
    y0 = y1 - Hh,
    P1 = [x0, y1],
    P2 = [x0 + A, y1],
    P3 = [x0 + SH + A, y0],
    P4 = [x0 + SH, y0],
    pts = arr => arr.map(p => p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" "),
    hline = E.line("hh", x0 + SH, y0, x0 + SH, y1, "red", {
     sw: 3,
     dash: "6 5"
    }),
    mark = E.path("rt", "M" + (x0 + SH) + " " + (y1 - 12) + " h12 v12", "none", "red", {
     sw: 2
    }),
    fitIn = SH + 8 + (7 + String(h).length) * 10 + 8 < A + SH / 2,
    lbA = E.text("lba", x0 + SH / 2 + A / 2, y1 + 26, "a = " + a + " cm", 19, "ink"),
    lbH = E.text("lbh", fitIn ? x0 + SH + 8 : x0 + SH / 2 - 8, (y0 + y1) / 2 + 7, "h = " + h + " cm", 19, "red", {
     anchor: fitIn ? "start" : "end"
    }),
    f0 = [E.poly("para", pts([P1, P2, P3, P4]), "sky"), lbA],
    rest = pts([
     [x0 + SH, y1], P2, P3, P4
    ]),
    tri = pts([P1, [x0 + SH, y1],
     [x0 + SH, y0]
    ]),
    f1 = [E.poly("rest", rest, "sky"), E.poly("tri", tri, "orange"), hline, mark, lbA, lbH],
    f2 = [E.poly("rest", rest, "sky"), Object.assign(E.poly("tri", tri, "orange"), {
     m: [A, 0]
    }), hline, mark, lbA, lbH],
    f3 = [E.poly("rest", rest, "sky"), Object.assign(E.poly("tri", tri, "orange"), {
     m: [A, 0]
    }), E.rect("rc", x0 + SH, y0, A, Hh, "none", {
     rx: 0,
     dash: "7 5",
     sw: 3
    }), hline, mark, lbA, lbH, E.text("area", 180, y1 + 56, "S = a × h = " + a + " × " + h + " = " + a * h + " cm²", 21, "ink")];
   return {
    frames: [f0, f1, f2, f3],
    vb: [360, y1 + 70]
   }
  };
  FB.rhombus = function(d1, d2) {
   let S = Math.min(200 / d1, 120 / d2, 26),
    A = d1 * S,
    B = d2 * S,
    cx = 180,
    cy = 104,
    pts = [
     [cx - A / 2, cy],
     [cx, cy - B / 2],
     [cx + A / 2, cy],
     [cx, cy + B / 2]
    ].map(p => p[0] + "," + p[1]).join(" "),
    f0 = [E.poly("rh", pts, "rose")],
    f1 = f0.concat([E.line("d1", cx - A / 2, cy, cx + A / 2, cy, "blue", {
     sw: 3
    }), E.line("d2", cx, cy - B / 2, cx, cy + B / 2, "orange", {
     sw: 3
    }), E.text("t1", cx + A / 2 + 8, cy + 6, "d₁ = " + d1, 18, "blue", {
     anchor: "start"
    }), E.text("t2", cx + 10, cy - B / 2 - 8, "d₂ = " + d2, 18, "orange", {
     anchor: "start"
    })]),
    f2 = f1.concat([E.rect("rr", cx - A / 2, cy - B / 2, A, B, "none", {
     rx: 0,
     dash: "7 5",
     sw: 3
    }), E.text("ar", 180, cy + B / 2 + 34, "S = (d₁ × d₂) : 2 = " + d1 * d2 / 2 + " cm²", 20, "ink")]);
   return {
    frames: [f0, f1, f2],
    vb: [360, cy + B / 2 + 50]
   }
  };
  FB.water = function(vals, labels, unit) {
   let n = vals.length,
    W = 360,
    top = 30,
    H = 130,
    mx = Math.max.apply(null, vals) * 1.15,
    avg = vals.reduce((a, b) => a + b, 0) / n,
    cw = Math.min(70, Math.floor(320 / n) - 12),
    gp = (W - cw * n) / (n + 1),
    yOf = v => top + H - v / mx * H,
    build = (lv, showAvg, note) => {
     let els = [];
     for (let i = 0; i < n; i++) {
      let x = gp + i * (cw + gp),
       y = yOf(lv[i]);
      els.push(E.rect("w" + i, x, y, cw, top + H - y, "blue", {
       rx: 0,
       sw: 0,
       stroke: null,
       op: .85
      })), els.push(E.rect("g" + i, x, top, cw, H, "none", {
       rx: 6
      })), els.push(E.text("v" + i, x + cw / 2, y - 8, String(Math.round(lv[i] * 100) / 100), 19, "ink")), els.push(E.text("n" + i, x + cw / 2, top + H + 24, labels[i], 17, "ink"))
     }
     return showAvg && els.push(E.line("avg", gp - 6, yOf(avg), W - gp + 6, yOf(avg), "red", {
      sw: 3,
      dash: "8 5"
     })), note && els.push(E.text("note", 180, top + H + 54, note, 20, "ink")), els
    },
    sum = vals.reduce((a, b) => a + b, 0);
   return {
    frames: [build(vals, !1), build(vals, !1, LT("Tổng = " + sum + (unit ? " " + unit : ""), "Sum = " + sum + (unit ? " " + unit : ""))), build(vals.map(() => avg), !0, sum + LT(" : ", " ÷ ") + n + " = " + Math.round(avg * 100) / 100)],
    vb: [W, top + H + 66]
   }
  };
  FB.chart = function(labels, vals, o) {
   o = o || {};
   let n = vals.length,
    W = 360,
    top = 40,
    H = 150,
    left = 44,
    mx = o.max || Math.ceil(Math.max.apply(null, vals) / (o.step || 5)) * (o.step || 5),
    step = o.step || 5,
    bw = Math.min(52, (W - left - 16) / n * .7),
    gp = (W - left - 16 - bw * n) / (n + 1),
    yOf = v => top + H - v / mx * H,
    mk = (hi, vis) => {
     let els = [];
     for (let v = 0; v <= mx + 1e-9; v += step) els.push(E.line("gl" + v, left, yOf(v), W - 12, yOf(v), "gray", {
      sw: 2
     })), els.push(E.text("gv" + v, left - 8, yOf(v) + 6, String(v), 15, "dark", {
      anchor: "end"
     }));
     els.push(E.line("ax", left, top, left, top + H, "ink", {
      sw: 3
     }), E.line("ay", left, top + H, W - 12, top + H, "ink", {
      sw: 3
     }));
     for (let i = 0; i < n; i++) {
      let x = left + gp + i * (bw + gp),
       h = vals[i] / mx * H,
       on = hi.indexOf(i) >= 0;
      els.push(E.rect("b" + i, x, yOf(vals[i]), bw, h, on ? "orange" : o.colors ? o.colors[i % o.colors.length] : "blue", {
       rx: 4,
       from: {
        geo: {
         y: top + H,
         height: 0
        }
       }
      })), els.push(E.text("bl" + i, x + bw / 2, top + H + 23, labels[i], 17, "ink")), (vis === !0 || on) && els.push(E.text("bv" + i, x + bw / 2, yOf(vals[i]) - 7, String(vals[i]), 18, "ink"))
     }
     return o.unit && els.push(E.text("un", left - 34, 16, o.unit, 15, "dark", {
      anchor: "start"
     })), els
    },
    fr2 = [mk([], !1)];
   return (o.hl || []).forEach(h => fr2.push(mk(h, !1))), fr2.push(mk([], !0)), {
    frames: fr2,
    vb: [W, top + H + 36]
   }
  };
  FB.trees = function(len, step, mode, unit) {
   unit = unit || "m";
   let cnt = Math.round(len / step),
    W = 360,
    x0 = 22,
    x1 = 338,
    sc = (x1 - x0) / len,
    y = 120,
    both = mode === "2",
    one = mode === "1",
    n = both ? cnt + 1 : one ? cnt : cnt - 1,
    first = both || one ? 0 : 1,
    tree = (i, x) => [E.rect("tr" + i, x - 3, y - 30, 6, 30, "#8B5A2B", {
     rx: 2,
     sw: 2
    }), E.circ("tc" + i, x, y - 40, 15, "green", {
     sw: 2.5
    })],
    road = ly => [E.rect("road", x0 - 6, y, x1 - x0 + 12, 12, "gray", {
     rx: 6
    }), E.text("rl", 180, ly || y + 40, LT("Đường dài " + len + " " + unit, "Path length: " + len + " " + unit), 19, "ink")],
    xs = [];
   for (let i = 0; i < n; i++) xs.push(x0 + (first + i) * step * sc);
   let f0 = road(),
    f1 = road(y - 60);
   for (let i = 0; i < cnt; i++) {
    let a = x0 + i * step * sc,
     b = x0 + (i + 1) * step * sc;
    f1.push(E.path("iv" + i, "M" + a + " " + (y + 20) + " q" + (b - a) / 2 + " 16 " + (b - a) + " 0", "none", "blue", {
     sw: 2.5
    })), (cnt <= 9 || i === 0 || i === cnt - 1 || (i + 1) % 5 === 0) && f1.push(E.text("ivn" + i, (a + b) / 2, y + (cnt > 8 ? 50 : 52), String(i + 1), 16, "blue"))
   }
   f1.push(E.text("ivt", 180, y + 68, LT(cnt + " khoảng cách (mỗi khoảng " + step + " " + unit + ")", cnt + (cnt === 1 ? " gap" : " gaps") + " (each gap is " + step + " " + unit + ")"), 18, "blue"));
   xs.forEach((x, i) => f1.push(E.circ("tdot" + i, x, y - 9, 5, "green", {
    sw: 2
   })));
   let f2 = road();
   xs.forEach((x, i) => tree(i, x).forEach(e => f2.push(e)));
   let f3 = f2.slice();
   return f3.push(E.text("res", 180, y - 82, LT("Có " + n + " cây", n + (n === 1 ? " tree" : " trees")), 24, "okc")), {
    frames: [f0, f1, f2, f3],
    vb: [W, 200],
    n,
    cnt
   }
  };
  FB.animals = function(n, rabbits, legsTotal) {
   let cols = Math.min(n, 6),
    rows = Math.ceil(n / cols),
    cw = Math.min(54, 320 / cols),
    x0 = (360 - cw * cols) / 2,
    mk = (r, note) => {
     let els = [];
     for (let i = 0; i < n; i++) {
      let cx = x0 + i % cols * cw + cw / 2,
       cy = 34 + Math.floor(i / cols) * 54,
       rab = i < r;
      els.push(E.text("e" + i, cx, cy + 11, rab ? "🐰" : "🐔", 30, "ink")), els.push(E.line("l1" + i, cx - 6, cy + 18, cx - 6, cy + 32, "ink", {
       sw: 3.5
      })), els.push(E.line("l2" + i, cx + 6, cy + 18, cx + 6, cy + 32, "ink", {
       sw: 3.5
      })), rab && (els.push(E.line("l3" + i, cx - 14, cy + 14, cx - 18, cy + 30, "orange", {
       sw: 3.5,
       from: {
        c: {
         opacity: 0
        }
       }
      })), els.push(E.line("l4" + i, cx + 14, cy + 14, cx + 18, cy + 30, "orange", {
       sw: 3.5
      })))
     }
     let H2 = 34 + rows * 54 + 18;
     return note && els.push(E.text("note", 180, H2 + 8, note, 20, "ink")), els
    },
    H = 34 + rows * 54 + 52;
   return {
    make: mk,
    vb: [360, H]
   }
  };
  FB.clock = function(h, mm) {
   mm = mm || 0;
   let cx = 180,
    cy = 104,
    R = 86,
    els = [E.circ("face", cx, cy, R, "white", {
     sw: 4
    })];
   for (let i = 1; i <= 12; i++) {
    let a = (i * 30 - 90) * Math.PI / 180;
    els.push(E.text("n" + i, cx + (R - 18) * Math.cos(a), cy + (R - 18) * Math.sin(a) + 7, String(i), 19, "ink"))
   }
   let ha = (h % 12 * 30 + mm * .5 - 90) * Math.PI / 180,
    ma = (mm * 6 - 90) * Math.PI / 180;
   return els.push(E.line("hh", cx, cy, cx + 46 * Math.cos(ha), cy + 46 * Math.sin(ha), "ink", {
    sw: 7
   })), els.push(E.line("mh", cx, cy, cx + 70 * Math.cos(ma), cy + 70 * Math.sin(ma), "orange", {
    sw: 5
   })), els.push(E.circ("ctr", cx, cy, 6, "ink")), {
    frames: [els],
    vb: [360, 206]
   }
  };
  var V = (vals, i) => +normNum(vals[i].v),
   isP10 = x => x >= 10 && Math.abs(Math.log10(x) % 1) < 1e-9,
   KIND_NAME = {
    nho: LT("Quên số nhớ khi cộng", "Forgot to carry when adding"),
    muon: LT("Quên mượn / lấy số bé trừ số lớn", "Forgot to regroup (borrow) / subtracted the smaller digit from the larger"),
    nham: LT("Nhầm số lớn và số bé", "Mixed up the larger and smaller numbers"),
    chia2: LT("Quên chia 2", "Forgot to divide by 2"),
    quen_chia: LT("Quên bước chia hoặc bước trừ", "Forgot the dividing or subtracting step"),
    lech1: LT("Lệch 1 (số cây, số khoảng)", "Off by 1 (trees vs. gaps)"),
    cong_mau: LT("Cộng cả mẫu số", "Added the denominators too"),
    chua_toi_gian: LT("Chưa rút gọn hết", "Did not simplify all the way"),
    gia_tri: LT("Nhầm giá trị chữ số", "Mixed up a digit value"),
    huong_doi: LT("Đổi đơn vị nhầm hướng", "Converted units the wrong way"),
    quen_nhan: LT("Quên nhân với tử số", "Forgot to multiply by the numerator")
   },
   DG = {
    col(a, b, op) {
     return (vals, q) => {
      let e = V(vals, 0),
       ans = q.parts[0].ans;
      if (!isFinite(e) || e === ans) return null;
      let n = Math.max(String(a).length, String(b).length),
       A = String(a).padStart(n, "0"),
       B = String(b).padStart(n, "0"),
       s = "";
      for (let i = 0; i < n; i++) {
       let x = +A[i],
        y = +B[i];
       s += op === "+" ? (x + y) % 10 : Math.abs(x - y)
      }
      return op === "+" && +s === e ? {
       kind: "nho",
       msg: LT("Có vẻ con quên cộng số nhớ ở một hàng. Tổng của một hàng từ 10 trở lên thì viết chữ số hàng đơn vị và nhớ 1 sang hàng bên trái.", "It looks like you forgot to add a carried digit in one place. When a place adds up to 10 or more, write the ones digit and carry 1 to the next place on the left.")
      } : op === "-" && +s === e ? {
       kind: "muon",
       msg: LT("Có hàng con lấy số bé trừ số lớn. Số trên bé hơn số dưới thì phải mượn 1 ở hàng bên trái (thành 10).", "In one place you subtracted the smaller digit from the larger one. When the top digit is smaller than the bottom digit, borrow 1 from the place on the left (it becomes 10).")
      } : isP10(Math.abs(e - ans)) ? {
       kind: op === "+" ? "nho" : "muon",
       msg: LT("Gần đúng rồi, chỉ lệch đúng một hàng. Kiểm tra lại số " + (op === "+" ? "nhớ" : "mượn") + " ở từng hàng.", "Almost right, just off by one place. Check the " + (op === "+" ? "carried" : "borrowed") + " digit in each place.")
      } : null
     }
    },
    mul(a, m) {
     return (vals, q) => {
      let e = V(vals, 0),
       ans = q.parts[0].ans;
      return !isFinite(e) || e === ans ? null : +String(a).split("").map(x => +x * m % 10).join("") === e ? {
       kind: "nho",
       msg: LT("Có vẻ con quên cộng số nhớ khi nhân. Tích của một hàng từ 10 trở lên thì nhớ chữ số hàng chục sang hàng bên trái.", "It looks like you forgot to add the carried digit when multiplying. When a place gives 10 or more, carry the tens digit to the next place on the left.")
      } : isP10(Math.abs(e - ans)) ? {
       kind: "nho",
       msg: LT("Gần đúng rồi, chỉ lệch đúng một hàng. Kiểm tra số nhớ.", "Almost right, just off by one place. Check the carried digit.")
      } : null
     }
    },
    sd(S, D, a, b) {
     return (vals, q) => {
      let e0 = V(vals, 0),
       e1 = V(vals, 1);
      return e0 === a && e1 === b ? null : e0 === b && e1 === a ? {
       kind: "nham",
       msg: LT("Con nhầm số lớn và số bé rồi. Số lớn là số có thêm phần hơn (hiệu) ở sơ đồ.", "You mixed up the larger and smaller numbers. The larger number is the one with the extra part (the difference) in the diagram.")
      } : e0 === S - D || e1 === S - D || e0 === S + D || e1 === S + D ? {
       kind: "chia2",
       msg: LT("Bớt phần hơn đi thì còn hai phần bằng nhau. Con nhớ chia cho 2 để tìm một phần nhé.", "Take away the extra part and two equal parts are left. Remember to divide by 2 to find one part.")
      } : null
     }
    },
    off1: (vals, q) => {
     let e = V(vals, 0),
      ans = q.parts[0].ans;
     return Math.abs(e - ans) === 1 ? {
      kind: "lech1",
      msg: LT("Lệch 1 cây! Hãy xem trồng ở mấy đầu đường: hai đầu thì số cây = số khoảng + 1, một đầu thì bằng số khoảng, không trồng hai đầu thì bớt 1.", "Off by 1 tree! Check how many ends of the road get a tree: both ends means trees = gaps + 1, one end means trees = gaps, and no trees at either end means trees = gaps - 1.")
     } : null
    },
    chick(n, L, rb) {
     return (vals, q) => {
      let e0 = V(vals, 0),
       e1 = V(vals, 1);
      return rb !== n - rb && e0 === rb && e1 === n - rb ? {
       kind: "nham",
       msg: LT("Con ghi ngược gà và thỏ rồi. Số chân còn thiếu là do thỏ (thỏ nhiều chân hơn).", "You swapped the chickens and the rabbits. The missing legs come from the rabbits (rabbits have more legs).")
      } : e1 === L - 2 * n ? {
       kind: "chia2",
       msg: LT("Số chân còn thiếu chưa phải số thỏ. Mỗi lần thay 1 con gà bằng 1 con thỏ thì tăng 2 chân, nên phải chia số chân còn thiếu cho 2.", "The number of missing legs is not the number of rabbits yet. Each time you swap 1 chicken for 1 rabbit, you add 2 legs, so divide the missing legs by 2.")
      } : null
     }
    },
    avg(sum, msg) {
     return (vals, q) => V(vals, 0) === sum ? {
      kind: "quen_chia",
      msg
     } : null
    },
    fracOf(k) {
     return (vals, q) => {
      let e = V(vals, 0);
      return e === k && e !== q.parts[0].ans ? {
       kind: "quen_nhan",
       msg: LT("Con mới tìm một phần. Còn phải nhân với tử số nữa.", "You only found one part. You still need to multiply by the numerator.")
      } : null
     }
    },
    fracAdd(a, b) {
     return (vals, q) => {
      let v = vals[0],
       ans = q.parts[0].ans;
      return +v.n === ans[0] && +v.d === 2 * ans[1] ? {
       kind: "cong_mau",
       msg: LT("Cùng mẫu số thì giữ nguyên mẫu số, chỉ cộng tử số. Hai miếng bánh cùng cỡ ghép lại không đổi cỡ.", "With the same denominator, keep the denominator and only add the numerators. Two pieces of the same size put together do not change the size of the pieces.")
      } : null
     }
    },
    simp(n, d) {
     return (vals, q) => {
      let v = vals[0],
       ans = q.parts[0].ans;
      return +v.n * ans[1] === +v.d * ans[0] && !(+v.n === ans[0] && +v.d === ans[1]) ? {
       kind: "chua_toi_gian",
       msg: LT("Giá trị bằng nhau rồi, nhưng chưa tối giản. Con rút gọn tiếp nhé.", "The value is equal, but it is not in simplest form yet. Keep simplifying.")
      } : null
     }
    },
    place(d) {
     return (vals, q) => V(vals, 0) === d && q.parts[0].ans !== d ? {
      kind: "gia_tri",
      msg: LT("Con ghi chữ số rồi. Giá trị = chữ số × giá trị của hàng (ví dụ hàng nghìn là 1 000).", "You wrote the digit. The value = the digit × the value of its place (for example, the thousands place is 1,000).")
     } : null
    },
    mass: (vals, q) => {
     let e = V(vals, 0),
      ans = q.parts[0].ans;
     return e && ans && (e * 10 === ans || ans * 10 === e || e * 100 === ans || ans * 100 === e || e * 1000 === ans || ans * 1000 === e) ? {
      kind: "huong_doi",
      msg: LT("Con kiểm tra lại hệ số đổi nhé: 1 yến = 10 kg, 1 tạ = 100 kg, 1 tấn = 1 000 kg. Sang đơn vị bé hơn thì nhân, sang đơn vị lớn hơn thì chia.", "Check the conversion factor again: 1 yến = 10 kg, 1 tạ = 100 kg, 1 metric ton = 1,000 kg. Going to a smaller unit, multiply; going to a larger unit, divide.")
     } : null
    }
   };
  Object.assign(KIND_NAME, {
   mot_buoc: LT("Dừng ở bước giữa, chưa làm hết các bước", "Stopped at a middle step"),
   lam_tron: LT("Làm tròn nhầm lên/xuống", "Rounded the wrong way (up/down)"),
   so_du: LT("Quên phần dư (cần thêm 1)", "Forgot the remainder (needs 1 more)"),
   chia_ps: LT("Chia phân số mà không đảo ngược", "Divided fractions without flipping"),
   dt100: LT("Đổi đơn vị diện tích theo 10 thay vì 100", "Converted area units by 10 instead of 100"),
   the_ki: LT("Tính thế kỉ lệch 1", "Century off by 1"),
   thu_tu: LT("Sai thứ tự thực hiện phép tính", "Wrong order of operations"),
   quy_dong: LT("Quy đồng chỉ nhân mẫu số", "Only multiplied the denominator for a common denominator"),
   chuyen: LT("Chuyển qua lại: quên hiệu gấp đôi", "Moving between groups: forgot the difference is doubled"),
   nua_cv: LT("Quên lấy nửa chu vi / quên nhân 2", "Forgot half the perimeter / forgot to multiply by 2"),
   hai_ben: LT("Quên trồng cả hai bên đường", "Forgot to plant on both sides of the road"),
   thieu0: LT("Thiếu chữ số 0 ở hàng trống", "Missing 0 in an empty place")
  });
  Object.assign(DG, {
   step(vs, msg, kind) {
    return (vals, q) => {
     let e = V(vals, 0);
     return e === q.parts[0].ans ? null : vs.indexOf(e) >= 0 ? {
      kind: kind || "mot_buoc",
      msg: msg || LT("Con mới làm xong một bước. Đọc lại câu hỏi xem đề hỏi gì nhé.", "You only finished one step. Read the question again to see what it asks.")
     } : null
    }
   },
   zero(ans) {
    return (vals, q) => {
     let e = V(vals, 0);
     return isFinite(e) && String(e).length < String(ans).length ? {
      kind: "thieu0",
      msg: LT("Số của con ít chữ số hơn. Hàng nào đề không nhắc đến thì phải viết chữ số 0.", "Your number has fewer digits. Write a 0 in any place the problem does not mention.")
     } : null
    }
   },
   round(lo, hi) {
    return (vals, q) => {
     let e = V(vals, 0),
      ans = q.parts[0].ans;
     return e !== ans && (e === lo || e === hi) ? {
      kind: "lam_tron",
      msg: LT("Nhìn chữ số ngay bên phải hàng cần làm tròn: bé hơn 5 thì làm tròn xuống, từ 5 trở lên thì làm tròn lên.", "Look at the digit right next to the place you are rounding to: if it is less than 5, round down; if it is 5 or more, round up.")
     } : null
    }
   },
   ceil(fl) {
    return (vals, q) => V(vals, 0) === fl ? {
     kind: "so_du",
     msg: LT("Phép chia còn dư, phần dư vẫn cần thêm 1 xe nữa đấy.", "The division has a remainder, and the leftover students still need 1 more bus.")
    } : null
   },
   dt100() {
    return (vals, q) => {
     let e = V(vals, 0),
      ans = q.parts[0].ans;
     return e && ans && (e * 10 === ans || ans * 10 === e) ? {
      kind: "dt100",
      msg: LT("Đơn vị diện tích hơn kém nhau 100 lần (không phải 10 như đơn vị độ dài).", "Area units differ by a factor of 100 (not 10 like length units).")
     } : e && ans && (e * 100 === ans || ans * 100 === e) ? {
      kind: "chua_doi",
      msg: LT("Con mới chép lại số ban đầu. Hãy đổi sang đơn vị mới: hai đơn vị diện tích liền nhau hơn kém nhau 100 lần.", "You copied the original number. Change it to the new unit: two neighboring area units differ by 100 times.")
     } : null
    }
   },
   chuyen(S, k, a, b) {
    return (vals, q) => {
     let e0 = V(vals, 0),
      e1 = V(vals, 1);
     return e0 === a && e1 === b ? null : e0 + e1 === S && Math.abs(e0 - e1) === k ? {
      kind: "chuyen",
      msg: LT("Chuyển " + k + " từ bên này sang bên kia thì bên này bớt " + k + ", bên kia thêm " + k + ". Vậy lúc đầu hai bên hơn kém nhau " + k + " × 2.", "Moving " + k + " from one side to the other takes " + k + " away from this side and adds " + k + " to the other. So at the start the two sides differed by " + k + " × 2.")
     } : DG.sd(S, 2 * k, a, b)(vals, q)
    }
   },
   thuTu(wrong) {
    return (vals, q) => V(vals, 0) === wrong ? {
     kind: "thu_tu",
     msg: LT("Trong biểu thức có cả cộng và nhân: làm phép nhân trước, phép cộng sau.", "When an expression has both addition and multiplication, multiply first, then add.")
    } : null
   },
   chiaPS(n, d) {
    return (vals, q) => {
     let v = vals[0];
     return +v.n * d === +v.d * n ? {
      kind: "chia_ps",
      msg: LT("Con đã nhân thẳng hai phân số. Muốn chia thì nhân với phân số thứ hai đảo ngược (đổi chỗ tử và mẫu).", "You multiplied the two fractions directly. To divide, multiply by the second fraction flipped upside down (swap the numerator and denominator).")
     } : null
    }
   },
   quyDong(a) {
    return (vals, q) => {
     let v = vals[0],
      ans = q.parts[0].ans;
     return +v.d === ans[1] && +v.n === a ? {
      kind: "quy_dong",
      msg: LT("Quy đồng phải nhân cả tử số và mẫu số với cùng một số.", "To get a common denominator, multiply both the numerator and the denominator by the same number.")
     } : null
    }
   },
   theKi(i, wrongs, msg) {
    return (vals, q) => {
     let v = vals[i].v;
     return wrongs.indexOf(v) >= 0 ? {
      kind: "the_ki",
      msg: msg || LT("Năm 1801 đến 1900 là thế kỉ XIX. Mẹo: bỏ hai chữ số cuối của năm rồi cộng thêm 1 (năm tròn trăm thì không cộng).", "The years 1801 to 1900 are the 19th century (written XIX in Roman numerals). Tip: drop the last two digits of the year and add 1 (if the year ends in 00, do not add 1).")
     } : null
    }
   },
   any() {
    let fs = [].slice.call(arguments);
    return (vals, q) => {
     for (let f of fs) {
      if (!f) continue;
      let r = f(vals, q);
      if (r) return r
     }
     return null
    }
   }
  });
  Object.assign(KIND_NAME, {
   dau0: LT("Đặt chữ số 0 đứng đầu số", "Put 0 at the front of the number"),
   sai_pt: LT("Chọn sai phép tính khi tìm x", "Chose the wrong operation when finding x"),
   nham_cv: LT("Nhầm diện tích với chu vi", "Mixed up area and perimeter")
  });
  var HANG = [LT("đơn vị", "ones"), LT("chục", "tens"), LT("trăm", "hundreds"), LT("nghìn", "thousands"), LT("chục nghìn", "ten-thousands"), LT("trăm nghìn", "hundred-thousands"), LT("triệu", "millions")],
   capF = x => x.charAt(0).toUpperCase() + x.slice(1),
   NUMW = (() => {
    let dv = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"],
     o1 = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"],
     te = ["ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"],
     tn = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"],
     g3v = (h, t, u) => dv[h] + " trăm" + (t === 0 ? u > 0 ? " linh " + dv[u] : "" : t === 1 ? " mười" + (u === 0 ? "" : u === 5 ? " lăm" : " " + dv[u]) : " " + dv[t] + " mươi" + (u === 0 ? "" : u === 1 ? " mốt" : u === 5 ? " lăm" : " " + dv[u])),
     g3e = (h, t, u) => o1[h] + " hundred" + (t === 0 && u === 0 ? "" : " " + (t === 0 ? o1[u] : t === 1 ? te[u] : tn[t] + (u ? "-" + o1[u] : "")));
    return {
     vi: (m, h1, t1, u1, h2, t2, u2) => dv[m] + " triệu " + g3v(h1, t1, u1) + " nghìn " + g3v(h2, t2, u2),
     en: (m, h1, t1, u1, h2, t2, u2) => o1[m] + " million " + g3e(h1, t1, u1) + " thousand " + g3e(h2, t2, u2),
     vg: g3v,
     eg: g3e,
     e1: o1
    }
   })(),
   placeLopQ = r => {
    let n = rd(r, 6, 7),
     ds = r.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, n),
     pos = rd(r, 0, n - 1),
     s = ds.join(""),
     d = ds[pos],
     k = n - 1 - pos,
     g = Math.floor(k / 3),
     lop = [LT("lớp đơn vị", "ones period"), LT("lớp nghìn", "thousands period"), LT("lớp triệu", "millions period")],
     hi = [];
    for (let i = 0; i < n; i++) Math.floor((n - 1 - i) / 3) === g && hi.push(i);
    return QQ({
     q: LT("Trong số **" + fmt(s) + "**, chữ số **" + d + "** thuộc lớp nào?", "In the number **" + fmt(s) + "**, which period is the digit **" + d + "** in?"),
     parts: [chp(lop.slice(), lop[g])],
     steps: [st(LT("Cứ 3 hàng thành một lớp, tính từ phải sang trái: lớp đơn vị (đơn vị, chục, trăm), lớp nghìn (nghìn, chục nghìn, trăm nghìn), lớp triệu (triệu, ...).", "Every 3 places make one period, counting from the right: the ones period (ones, tens, hundreds), the thousands period (thousands, ten-thousands, hundred-thousands), the millions period (millions, ...).")), st(LT("Chữ số " + d + " ở hàng " + HANG[k] + ", thuộc **" + lop[g] + "**.", "The digit " + d + " is in the " + HANG[k] + " place, which belongs to the **" + lop[g] + "**."))],
     tip: LT("Cứ 3 hàng từ phải sang trái là một lớp: đơn vị, nghìn, triệu.", "Every 3 places from the right make one period: ones, thousands, millions."),
     hintFig: {
      fb: FB.place(s, [{
       hi
      }]),
      f: 0
     }
    })
   },
   placeReadQ = r => {
    let m = rd(r, 1, 9),
     g, h1, t1, u1, h2, t2, u2;
    for (let z = 0; z < 100; z++) {
     h1 = rd(r, 1, 9), t1 = rd(r, 0, 9), u1 = rd(r, 0, 9), h2 = rd(r, 1, 9), t2 = rd(r, 0, 9), u2 = rd(r, 0, 9);
     if (t1 === 0 || u1 === 0 || t2 === 0 || u2 === 0) break
    }
    let g1 = h1 * 100 + t1 * 10 + u1,
     g2 = h2 * 100 + t2 * 10 + u2,
     v = m * 1e6 + g1 * 1e3 + g2,
     wv = NUMW.vi(m, h1, t1, u1, h2, t2, u2),
     we = NUMW.en(m, h1, t1, u1, h2, t2, u2),
     pad = x => String(x);
    return QQ({
     q: LT("Viết số: **" + wv + "**.", "Write the number: **" + we + "**."),
     parts: [num("", v)],
     steps: [st(LT("Lớp triệu: " + dv0(m) + " triệu → " + m + ". Lớp nghìn: " + NUMW.vg(h1, t1, u1) + " nghìn → " + pad(g1) + ". Lớp đơn vị: " + NUMW.vg(h2, t2, u2) + " → " + pad(g2) + ".", "Millions period: " + NUMW.e1[m] + " million → " + m + ". Thousands period: " + NUMW.eg(h1, t1, u1) + " thousand → " + pad(g1) + ". Ones period: " + NUMW.eg(h2, t2, u2) + " → " + pad(g2) + ".")), st(LT("Ghép các lớp (mỗi lớp sau lớp triệu đủ 3 chữ số, hàng không được đọc là chữ số 0): " + fmt(v), "Put the periods together (each period after the millions has 3 digits, and a place that is not read aloud is a 0): " + fmt(v)), v)],
     diag: (vals, q) => {
      let e = V(vals, 0);
      return isFinite(e) && e > 0 && String(e).length < 7 ? {
       kind: "thieu0",
       msg: LT("Số của con ít chữ số hơn. Mỗi lớp sau lớp triệu có đủ 3 chữ số; hàng nào không được đọc ra thì là chữ số 0.", "Your number has fewer digits. Each period after the millions has 3 digits; a place that is not read aloud is a 0.")
      } : null
     },
     tip: LT("Viết từng lớp rồi ghép lại. Chữ \"linh\" hay hàng không được đọc nghĩa là chữ số 0.", "Write each period, then put them together. A place that is not read aloud is a 0 (for example, five hundred six thousand has 0 in the ten-thousands place).")
    })
   },
   dv0 = x => ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"][x];
  LESSON({
   id: "place",
   reg: "so",
   title: LT("Hàng và lớp", "Places and periods"),
   emoji: "🏠",
   blurb: LT("Đọc, viết số lớn đến hàng triệu", "Read and write big numbers up to the millions"),
   links: [],
   rule: {
    h: LT("Nhớ nhé", "Remember"),
    items: [LT("Cứ **3 hàng** thành một **lớp**: lớp đơn vị, lớp nghìn, lớp triệu.", "Every **3 places** make one **period**: the ones period, the thousands period, the millions period."), LT("Giá trị chữ số = chữ số × giá trị của hàng. Ví dụ 6 ở hàng nghìn là **6 000**.", "The value of a digit = the digit × the value of its place. For example, a 6 in the thousands place is **6,000**.")]
   },
   figs: {
    a: () => FB.place("4506321", [{}, {
     hi: [0],
     note: LT("4 ở hàng triệu → 4 000 000", "4 in the millions place → 4,000,000")
    }, {
     hi: [1, 2, 3],
     note: LT("Lớp nghìn: 506 → 506 nghìn", "Thousands period: 506")
    }, {
     hi: [4, 5, 6],
     note: LT("Lớp đơn vị: 321", "Ones period: 321")
    }, {
     hi: [3],
     note: LT("6 ở hàng nghìn → 6 000", "6 in the thousands place → 6,000"),
     note2: LT("0 ở hàng chục nghìn → 0", "0 in the ten-thousands place → 0")
    }])
   },
   teach: [{
    key: "a",
    f: 0,
    say: LT("Đây là số **4 506 321**. Mỗi chữ số đứng trong một **hàng**. Các hàng xếp từ phải sang trái: đơn vị, chục, trăm, nghìn, chục nghìn, trăm nghìn, triệu.", "This is the number **4,506,321**. Each digit sits in a **place**. The places go from right to left: ones, tens, hundreds, thousands, ten-thousands, hundred-thousands, millions.")
   }, {
    key: "a",
    f: 1,
    say: LT("Chữ số **4** đứng ở **hàng triệu**, nên giá trị của nó là 4 triệu = 4 000 000.", "The digit **4** is in the **millions place**, so its value is 4 million = 4,000,000.")
   }, {
    key: "a",
    f: 2,
    say: LT("Ba hàng nghìn, chục nghìn, trăm nghìn hợp thành **lớp nghìn**: 5 trăm nghìn, 0 chục nghìn, 6 nghìn. Ta đọc là **năm trăm linh sáu nghìn**.", "The thousands, ten-thousands, and hundred-thousands places make the **thousands period**: 5 hundred-thousands, 0 ten-thousands, 6 thousands. We read it as **five hundred six thousand**.")
   }, {
    key: "a",
    f: 3,
    say: LT("Ba hàng cuối là **lớp đơn vị**: ba trăm hai mươi mốt.", "The last three places are the **ones period**: three hundred twenty-one.")
   }, {
    key: "a",
    f: 4,
    say: LT("Chữ số **6** ở hàng nghìn, nên giá trị là **6 000**. Chữ số 0 ở hàng chục nghìn có giá trị 0.", "The digit **6** is in the thousands place, so its value is **6,000**. The digit 0 in the ten-thousands place has a value of 0.")
   }, {
    key: "a",
    f: 0,
    say: LT("Đọc trọn cả số: **4 506 321** đọc là: **Bốn triệu năm trăm linh sáu nghìn ba trăm hai mươi mốt**.", "Reading the whole number: **4,506,321** is read as: **Four million five hundred six thousand three hundred twenty-one**.")
   }],
   gen(tier, r) {
    if (tier === 1) {
     let ds = r.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 5),
      pos = rd(r, 0, 4),
      s = ds.join(""),
      d = ds[pos],
      hang = HANG[4 - pos],
      o = [hang];
     return r.shuffle(HANG.slice(0, 5)).forEach(h => {
      o.indexOf(h) < 0 && o.length < 4 && o.push(h)
     }), o = r.shuffle(o), QQ({
      q: LT("Trong số **" + fmt(s) + "**, chữ số **" + d + "** ở hàng nào?", "In the number **" + fmt(s) + "**, which place is the digit **" + d + "** in?"),
      parts: [chp(o, hang)],
      tip: LT("Đếm các hàng từ phải sang trái: đơn vị, chục, trăm, nghìn, chục nghìn.", "Count the places from right to left: ones, tens, hundreds, thousands, ten-thousands."),
      steps: [st(LT("Các hàng từ phải sang trái: đơn vị, chục, trăm, nghìn, chục nghìn. Chữ số " + d + " ở hàng **" + hang + "**.", "The places from right to left are: ones, tens, hundreds, thousands, ten-thousands. The digit " + d + " is in the **" + hang + "** place."))],
      hintFig: {
       fb: FB.place(s, [{
        hi: [pos]
       }]),
       f: 0
      }
     })
    }
    if (tier === 2) {
     if (r.chance(.34)) return placeLopQ(r);
     let n = rd(r, 5, 6),
      ds = r.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, n),
      pos = rd(r, 0, n - 1),
      s = ds.join(""),
      d = ds[pos],
      v2 = d * Math.pow(10, n - 1 - pos);
     return QQ({
      q: LT("Trong số **" + fmt(s) + "**, chữ số **" + d + "** có giá trị là bao nhiêu?", "In the number **" + fmt(s) + "**, what is the value of the digit **" + d + "**?"),
      parts: [num("", v2)],
      steps: [st(LT("Chữ số " + d + " ở hàng " + HANG[n - 1 - pos] + ".", "The digit " + d + " is in the " + HANG[n - 1 - pos] + " place.")), st(d + " × " + fmt(Math.pow(10, n - 1 - pos)) + " = " + fmt(v2), v2)],
      diag: DG.place(d),
      tip: LT("Giá trị của chữ số = chữ số × giá trị của hàng (hàng nghìn là 1 000, hàng chục nghìn là 10 000...).", "The value of a digit = the digit × the value of its place (thousands is 1,000, ten-thousands is 10,000, and so on)."),
      hintFig: {
       fb: FB.place(s, [{
        hi: [pos]
       }]),
       f: 0
      }
     })
    }
    let a = rd(r, 1, 9),
     b = rd(r, 1, 9),
     c = rd(r, 1, 9),
     dd = rd(r, 1, 9),
     e = rd(r, 1, 9),
     v = a * 1e6 + b * 1e5 + c * 1e3 + dd * 10 + e;
    return QQ({
     q: LT("Viết số gồm: **" + a + " triệu, " + b + " trăm nghìn, " + c + " nghìn, " + dd + " chục, " + e + " đơn vị**.", "Write the number with **" + a + " in the millions place, " + b + " in the hundred-thousands place, " + c + " in the thousands place, " + dd + " in the tens place, and " + e + " in the ones place**."),
     parts: [num("", v)],
     steps: [st(LT(a + " triệu = " + fmt(a * 1e6) + "; " + b + " trăm nghìn = " + fmt(b * 1e5), "The " + a + " in the millions place is worth " + fmt(a * 1e6) + ", and the " + b + " in the hundred-thousands place is worth " + fmt(b * 1e5)), a * 1e6 + b * 1e5), st(LT("Cộng " + c + " nghìn: " + fmt(a * 1e6 + b * 1e5 + c * 1e3), "Add the " + c + " in the thousands place (" + fmt(c * 1e3) + "): " + fmt(a * 1e6 + b * 1e5 + c * 1e3)), a * 1e6 + b * 1e5 + c * 1e3), st(LT("Còn lại " + dd + " chục và " + e + " đơn vị → số " + fmt(v), "Then the " + dd + " in the tens place and the " + e + " in the ones place → the number " + fmt(v)), v)],
     tip: LT("Hàng nào đề không nhắc đến thì viết số 0 vào hàng đó.", "Write a 0 in any place the problem does not mention.")
    })
   }
  });
  addAsks("place", [{
   after: 2,
   f: 0,
   say: LT("Cùng làm nhé: trong số **4 506 321**, chữ số **3** đứng ở hàng nào?", "Let's try it: in the number **4,506,321**, which place is the digit **3** in?"),
   opts: [LT("chục", "tens"), LT("trăm", "hundreds"), LT("nghìn", "thousands"), LT("trăm nghìn", "hundred-thousands")],
   ans: LT("trăm", "hundreds"),
   good: LT("Đúng! 3 ở hàng trăm, giá trị 300.", "Correct! The 3 is in the hundreds place, and its value is 300.")
  }]);
  extendTier("place", 3, [r => {
   let a = rd(r, 1, 9),
    b = rd(r, 1, 9),
    c = rd(r, 1, 9),
    v = a * 1e6 + b * 1e4 + c;
   return QQ({
    q: LT("Viết số gồm: **" + a + " triệu, " + b + " chục nghìn và " + c + " đơn vị**.", "Write the number with **" + a + " in the millions place, " + b + " in the ten-thousands place, and " + c + " in the ones place**."),
    parts: [num("", v)],
    steps: [st(LT(a + " triệu = " + fmt(a * 1e6), "The " + a + " in the millions place is worth " + fmt(a * 1e6)), a * 1e6), st(LT("Thêm " + b + " chục nghìn: " + fmt(a * 1e6 + b * 1e4), "Add the " + b + " in the ten-thousands place (" + fmt(b * 1e4) + "): " + fmt(a * 1e6 + b * 1e4)), a * 1e6 + b * 1e4), st(LT("Thêm " + c + " đơn vị: " + fmt(v) + " (các hàng trống viết 0)", "Add the " + c + " in the ones place: " + fmt(v) + " (write 0 in the empty places)"), v)],
    diag: DG.zero(v),
    tip: LT("Viết đủ 7 chữ số, hàng nào không có thì viết 0.", "Write all 7 digits, and put a 0 in any empty place.")
   })
  }, r => placeReadQ(r), r => {
   let ds = r.shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 6),
    big = r.chance(.5);
   ds.indexOf(0) < 0 && (ds[0] = 0);
   let s = ds.slice().sort((a, b) => big ? b - a : a - b);
   if (!big && s[0] === 0) {
    let i = s.findIndex(x => x > 0);
    s[0] = s[i], s[i] = 0
   }
   let v = +s.join("");
   return QQ({
    q: LT("Dùng cả sáu chữ số **" + ds.join("; ") + "** (mỗi chữ số một lần), viết số " + (big ? "**lớn nhất**" : "**bé nhất**") + " có sáu chữ số.", "Use all six digits **" + ds.join("; ") + "** (each digit once) to write the " + (big ? "**largest**" : "**smallest**") + " six-digit number."),
    parts: [num("", v)],
    steps: [st(big ? LT("Xếp các chữ số từ lớn đến bé", "Arrange the digits from largest to smallest") : LT("Xếp các chữ số từ bé đến lớn, nhưng chữ số 0 không được đứng đầu", "Arrange the digits from smallest to largest, but 0 cannot go first")), st(LT("Được số " + fmt(v), "The number is " + fmt(v)), v)],
    diag: (vals, q) => {
     let e = V(vals, 0);
     return isFinite(e) && e > 0 && String(e).length < 6 ? {
      kind: "dau0",
      msg: LT("Số có sáu chữ số thì chữ số 0 không được đứng đầu, và con phải dùng đủ cả sáu chữ số.", "A six-digit number cannot start with 0, and you must use all six digits.")
     } : null
    },
    tip: big ? LT("Chữ số lớn nhất đứng ở hàng cao nhất.", "Put the biggest digit in the highest place.") : LT("Số không được bắt đầu bằng 0: đưa chữ số khác 0 bé nhất lên đầu.", "A number cannot start with 0: move the smallest nonzero digit to the front.")
   })
  }], !0);
  (function() {
   let l = byId("place"),
    old = l.gen;
   l.gen = function(t, r) {
    let q = old.call(l, t, r);
    return t === 3 && !q.diag && (q.diag = DG.zero(q.parts[0].ans)), q
   }
  })();
  var rt = (n, p) => Math.round(n / p) * p,
   PLACE_NAME = {
    1e3: LT("hàng nghìn", "thousands place"),
    1e4: LT("hàng chục nghìn", "ten-thousands place"),
    1e5: LT("hàng trăm nghìn", "hundred-thousands place")
   },
   NEAR = {
    1e3: "thousand",
    1e4: "ten thousand",
    1e5: "hundred thousand"
   };

  function roundWhy(lab, d, labEn) {
   labEn = labEn || ({
    "Chữ số hàng chục nghìn": "The ten-thousands digit"
   })[lab] || lab;
   return LT(lab + " là " + d + ", " + d + (d >= 5 ? " ≥ 5 nên làm tròn lên" : " < 5 nên làm tròn xuống"), labEn + " is " + d + ", and " + d + (d >= 5 ? " ≥ 5, so we round up" : " < 5, so we round down"))
  }

  function roundLine(n, p) {
   let lo = Math.floor(n / p) * p,
    hi = lo + p;
   return {
    fb: FB.nline({
     min: lo,
     max: hi,
     tick: p / 10,
     big: 5,
     h: 176,
     noteY: 160,
     x0: 62,
     x1: 298
    }, [{
     labels: [{
      v: lo,
      t: fmt(lo),
      s: 16
     }, {
      v: hi,
      t: fmt(hi),
      s: 16
     }, {
      v: lo + p / 2,
      t: fmt(lo + p / 2),
      s: 13,
      c: "dark"
     }],
     marks: [{
      v: n,
      t: fmt(n),
      c: "orange",
      s: 17
     }],
     note: LT("Số này gần đầu nào hơn?", "Which end is it closer to?")
    }]),
    f: 0
   }
  }
  LESSON({
   id: "round",
   reg: "so",
   title: LT("Làm tròn số", "Rounding numbers"),
   emoji: "🎯",
   blurb: LT("Làm tròn đến hàng trăm nghìn", "Round to the hundred-thousands place"),
   links: ["place"],
   rule: {
    h: LT("Quy tắc", "The rule"),
    items: [LT("Nhìn chữ số **ngay bên phải** hàng cần làm tròn.", "Look at the digit **right next to** the place you are rounding to."), LT("Chữ số đó **bé hơn 5**: làm tròn **xuống** (giữ hàng đó, các hàng sau thành 0).", "If that digit is **less than 5**, round **down** (keep that place and make the places after it 0)."), LT("Chữ số đó **từ 5 trở lên**: làm tròn **lên** (hàng đó thêm 1, các hàng sau thành 0).", "If that digit is **5 or more**, round **up** (add 1 to that place and make the places after it 0).")]
   },
   figs: {
    a: () => FB.nline({
     min: 3e5,
     max: 4e5,
     tick: 1e4,
     big: 5,
     h: 176,
     noteY: 160,
     x0: 52,
     x1: 308
    }, [{
     labels: [{
      v: 3e5,
      t: LT("300 000", fmt(300000)),
      s: 16
     }, {
      v: 4e5,
      t: LT("400 000", fmt(400000)),
      s: 16
     }],
     marks: [{
      v: 372e3,
      t: LT("372 000", fmt(372000)),
      c: "orange",
      s: 18
     }]
    }, {
     labels: [{
      v: 3e5,
      t: LT("300 000", fmt(300000)),
      s: 16
     }, {
      v: 4e5,
      t: LT("400 000", fmt(400000)),
      s: 16
     }, {
      v: 35e4,
      t: LT("350 000", fmt(350000)),
      s: 14,
      c: "dark"
     }],
     zone: [{
      a: 35e4,
      b: 4e5,
      c: "mint"
     }],
     marks: [{
      v: 372e3,
      t: LT("372 000", fmt(372000)),
      c: "orange",
      s: 18
     }],
     note: LT("Ở bên phải điểm giữa", "To the right of the midpoint")
    }, {
     labels: [{
      v: 3e5,
      t: LT("300 000", fmt(300000)),
      s: 16
     }, {
      v: 4e5,
      t: LT("400 000", fmt(400000)),
      s: 16
     }, {
      v: 35e4,
      t: LT("350 000", fmt(350000)),
      s: 14,
      c: "dark"
     }],
     zone: [{
      a: 35e4,
      b: 4e5,
      c: "mint"
     }],
     marks: [{
      v: 372e3,
      t: LT("372 000", fmt(372000)),
      c: "orange",
      s: 18
     }],
     hops: [{
      a: 372e3,
      b: 4e5,
      t: "",
      c: "green",
      h: 30
     }],
     note: LT("372 000 ≈ 400 000", fmt(372000) + " ≈ " + fmt(400000))
    }]),
    b: () => {
     let NL = (lo, hi, v, up, note) => FB.nline({
       min: lo,
       max: hi,
       tick: 1e4,
       big: 5,
       h: 176,
       noteY: 160,
       x0: 52,
       x1: 308
      }, [{
       labels: [{
        v: lo,
        t: fmt(lo),
        s: 16
       }, {
        v: hi,
        t: fmt(hi),
        s: 16
       }, {
        v: (lo + hi) / 2,
        t: fmt((lo + hi) / 2),
        s: 14,
        c: "dark"
       }],
       zone: [{
        a: (lo + hi) / 2,
        b: hi,
        c: "mint"
       }],
       marks: [{
        v,
        t: fmt(v),
        c: "orange",
        s: 18
       }],
       hops: [{
        a: v,
        b: up ? hi : lo,
        t: "",
        c: "green",
        h: 30
       }],
       note
      }]).frames[0],
      B0 = FB.nline({
     min: 4e5,
     max: 5e5,
     tick: 1e4,
     big: 5,
     h: 176,
     noteY: 160,
     x0: 52,
     x1: 308
    }, [{
     labels: [{
      v: 4e5,
      t: LT("400 000", fmt(400000)),
      s: 16
     }, {
      v: 5e5,
      t: LT("500 000", fmt(500000)),
      s: 16
     }, {
      v: 45e4,
      t: LT("450 000", fmt(450000)),
      s: 14,
      c: "dark"
     }],
     zone: [{
      a: 4e5,
      b: 45e4,
      c: "sun"
     }],
     marks: [{
      v: 431500,
      t: LT("431 500", fmt(431500)),
      c: "orange",
      s: 18
     }],
     hops: [{
      a: 431500,
      b: 4e5,
      t: "",
      c: "blue",
      h: 30
     }],
     note: LT("431 500 ≈ 400 000", fmt(431500) + " ≈ " + fmt(400000))
    }]);
     return {
      frames: B0.frames.concat([NL(9e5, 1e6, 96e4, 1, LT("960 000 ≈ 1 000 000", fmt(960000) + " ≈ " + fmt(1000000))), NL(6e5, 7e5, 65e4, 1, LT("650 000 ≈ 700 000", fmt(650000) + " ≈ " + fmt(700000)))]),
      vb: B0.vb
     }
    }
   },
   teach: [{
    key: "a",
    f: 0,
    say: LT("Số **372 000** nằm giữa **300 000** và **400 000** trên tia số. Nó gần số nào hơn?", "The number **372,000** is between **300,000** and **400,000** on the number line. Which one is it closer to?")
   }, {
    key: "a",
    f: 1,
    say: LT("Điểm giữa là **350 000**. Số 372 000 ở **bên phải** điểm giữa, nên gần **400 000** hơn.", "The midpoint is **350,000**. The number 372,000 is to the **right** of the midpoint, so it is closer to **400,000**.")
   }, {
    key: "a",
    f: 1,
    say: LT("Cùng làm: 372 000 gần số nào hơn?", "Let's try it: which number is 372,000 closer to?"),
    ask: {
     opts: [LT("300 000", fmt(300000)), LT("400 000", fmt(400000))],
     ans: LT("400 000", fmt(400000)),
     good: LT("Đúng! Gần 400 000 hơn.", "Correct! It is closer to 400,000.")
    }
   }, {
    key: "a",
    f: 2,
    say: LT("Làm tròn 372 000 đến **hàng trăm nghìn** được **400 000**. Mẹo: nhìn chữ số ngay sau hàng trăm nghìn (hàng chục nghìn là **7**). 7 ≥ 5 nên **làm tròn lên**: 3 trăm nghìn thêm 1 thành 4 trăm nghìn.", "Rounding 372,000 to the **hundred-thousands place** gives **400,000**. Tip: look at the digit right after the hundred-thousands place (the ten-thousands digit is **7**). Since 7 ≥ 5, we **round up**: 3 hundred thousands plus 1 becomes 4 hundred thousands.")
   }, {
    key: "b",
    f: 0,
    say: LT("Số **431 500**: chữ số hàng chục nghìn là **3**, 3 < 5 nên **làm tròn xuống**: giữ 4 trăm nghìn, các hàng sau thành 0, được **400 000**.", "For the number **431,500**: the ten-thousands digit is **3**. Since 3 < 5, we **round down**: keep 4 hundred thousands and make the places after it 0, which gives **400,000**.")
   }, {
    key: "b",
    f: 1,
    say: LT("**960 000** làm tròn đến hàng trăm nghìn: chữ số hàng chục nghìn là **6** ≥ 5 nên làm tròn lên; 9 trăm nghìn thêm 1 thành 10 trăm nghìn, được **1 000 000**.", "Rounding **960,000** to the hundred-thousands place: the ten-thousands digit is **6**. Since 6 ≥ 5, we round up; 9 hundred thousands plus 1 becomes 10 hundred thousands, which gives **1,000,000**.")
   }, {
    key: "b",
    f: 2,
    say: LT("Chữ số đúng bằng **5** thì cũng **làm tròn lên**. Ví dụ **650 000** làm tròn đến hàng trăm nghìn: chữ số hàng chục nghìn là 5, 5 ≥ 5 nên làm tròn lên, được **700 000**.", "A digit that is exactly **5** also means we **round up**. For example, rounding **650,000** to the hundred-thousands place: the ten-thousands digit is 5. Since 5 ≥ 5, we round up, which gives **700,000**.")
   }],
   gen(tier, r) {
    if (tier === 1) {
     let H = rd(r, 1, 8),
      rest = rd(r, 1, 99) * 1e3 + rd(r, 0, 9) * 100;
     if (rest === 5e4) return byId("round").gen(1, r);
     let n2 = H * 1e5 + rest,
      ans2 = rt(n2, 1e5),
      o = r.shuffle([fmt(H * 1e5), fmt(H * 1e5 + 1e5), fmt(H * 1e5 + rest - rest % 1e4), fmt(H * 1e5 + 5e4)].filter((x, i, a) => a.indexOf(x) === i));
     return QQ({
      q: LT("Làm tròn số **" + fmt(n2) + "** đến hàng trăm nghìn ta được số nào?", "Round **" + fmt(n2) + "** to the nearest hundred thousand. What number do we get?"),
      parts: [chp(o, fmt(ans2))],
      steps: [st(roundWhy("Chữ số hàng chục nghìn", Math.floor(rest / 1e4))), st(LT("Kết quả: " + fmt(ans2), "Result: " + fmt(ans2)))],
      hintFig: roundLine(n2, 1e5),
      tip: LT("Nhìn chữ số hàng chục nghìn.", "Look at the ten-thousands digit.")
     })
    }
    if (tier === 2) {
     let p = r.pick([1e3, 1e4, 1e5]),
      n2 = rd(r, 12, 98) * 1e5 + rd(r, 1, 99999);
     if (n2 % p === p / 2) return byId("round").gen(2, r);
     let ans2 = rt(n2, p),
      lo2 = Math.floor(n2 / p) * p,
      dg = Math.floor(n2 % p / (p / 10));
     return QQ({
      q: LT("Làm tròn số **" + fmt(n2) + "** đến **" + PLACE_NAME[p] + "**.", "Round **" + fmt(n2) + "** to the nearest **" + NEAR[p] + "**."),
      parts: [num("", ans2)],
      steps: [st(roundWhy("Chữ số ngay sau " + PLACE_NAME[p], dg, "The digit right after the " + PLACE_NAME[p])), st(LT("Kết quả: " + fmt(ans2), "Result: " + fmt(ans2)), ans2)],
      diag: DG.round(lo2, lo2 + p),
      tip: LT("Nhìn chữ số ngay sau hàng cần làm tròn: từ 5 trở lên thì làm tròn lên, bé hơn 5 thì làm tròn xuống.", "Look at the digit right after the place you are rounding to: 5 or more rounds up, less than 5 rounds down."),
      hintFig: roundLine(n2, p)
     })
    }
    let k3 = r.int(0, 5);
    if (k3 <= 1) {
     let p = r.pick([1e3, 1e4, 1e3, 1e4, 1e5]),
      big = r.chance(.5),
      X = p === 1e5 ? rd(r, 2, 9) * 1e5 : p === 1e4 ? rd(r, 11, 98) * 1e4 : rd(r, 101, 989) * 1e3,
      ans2 = big ? X + p / 2 - 1 : X - p / 2,
      hq = HANG[Math.round(Math.log10(p)) - 1];
     return QQ({
      q: LT("Tìm số " + (big ? "**lớn nhất**" : "**bé nhất**") + " có sáu chữ số mà khi làm tròn đến " + PLACE_NAME[p] + " được **" + fmt(X) + "**.", "Find the " + (big ? "**largest**" : "**smallest**") + " six-digit number that rounds to **" + fmt(X) + "** when rounded to the nearest " + NEAR[p] + "."),
      parts: [num("", ans2)],
      steps: [st(big ? LT("Số lớn nhất còn làm tròn xuống về " + fmt(X) + " phải có chữ số hàng " + hq + " là 4, các hàng sau đều là 9", "The largest number that still rounds down to " + fmt(X) + " must have 4 in the " + hq + " place and 9 in all the places after it") : p === 1e5 ? LT("Số bé nhất được làm tròn lên thành " + fmt(X) + ": hàng trăm nghìn là " + (X / 1e5 - 1) + ", hàng chục nghìn là 5, các hàng sau là 0", "The smallest number that rounds up to " + fmt(X) + " has " + (X / 1e5 - 1) + " in the hundred-thousands place, 5 in the ten-thousands place, and 0 in the places after it") : LT("Số bé nhất được làm tròn lên thành " + fmt(X) + ": chữ số hàng " + hq + " là 5, các hàng sau là 0, tức là " + fmt(X) + " − " + fmt(p / 2), "The smallest number that rounds up to " + fmt(X) + " has 5 in the " + hq + " place and 0 in the places after it, which is " + fmt(X) + " − " + fmt(p / 2))), st(LT("Đáp số: " + fmt(ans2), "Answer: " + fmt(ans2)), ans2)],
      tip: LT("Từ 5 trở lên thì làm tròn lên, bé hơn 5 thì làm tròn xuống.", "If it is 5 or more, round up; if it is less than 5, round down."),
      hintFig: {
       fb: FB.nline({
        min: X - p,
        max: X + p,
        tick: p / 2,
        big: 2,
        h: 176,
        noteY: 160,
        x0: 52,
        x1: 308
       }, [{
        labels: [{
         v: X - p,
         t: fmt(X - p),
         s: 14
        }, {
         v: X,
         t: fmt(X),
         s: 14
        }, {
         v: X + p,
         t: fmt(X + p),
         s: 14
        }],
        zone: [{
         a: X - p / 2,
         b: X + p / 2,
         c: "mint"
        }],
        note: LT("Vùng xanh làm tròn được " + fmt(X), "The green zone rounds to " + fmt(X))
       }]),
       f: 0
      }
     })
    }
    if (k3 <= 3) {
     let p = r.pick([1e4, 1e5]),
      plus = r.chance(.5),
      A, B;
     for (let g = 0; g < 200; g++) {
      A = rd(r, 12, 98) * 1e5 + rd(r, 1, 99999), B = rd(r, 12, 98) * 1e5 + rd(r, 1, 99999);
      if (A % p === p / 2 || B % p === p / 2) continue;
      if (plus || rt(A, p) !== rt(B, p)) break
     }
     let ra = rt(A, p),
      rb = rt(B, p),
      ans2 = plus ? ra + rb : Math.abs(ra - rb),
      exact = plus ? A + B : Math.abs(A - B),
      cx = r.int(0, 2),
      pa = Math.floor(A % p / (p / 10)),
      pb = Math.floor(B % p / (p / 10)),
      ctx = [LT("Dân số tỉnh A là **" + fmt(A) + "** người, dân số tỉnh B là **" + fmt(B) + "** người.", "Province A has a population of **" + fmt(A) + "**, and Province B has a population of **" + fmt(B) + "**."), LT("Năm nay khu du lịch A đón **" + fmt(A) + "** lượt khách, khu du lịch B đón **" + fmt(B) + "** lượt khách.", "This year, Tourist Area A had **" + fmt(A) + "** visitors, and Tourist Area B had **" + fmt(B) + "** visitors."), LT("Trận bóng đá thứ nhất có **" + fmt(A) + "** người xem trên mạng, trận thứ hai có **" + fmt(B) + "** người xem.", "The first soccer game had **" + fmt(A) + "** online viewers, and the second had **" + fmt(B) + "** viewers.")][cx],
      dir = (x, d) => LT("Chữ số ngay sau " + PLACE_NAME[p] + " của " + fmt(x) + " là " + d + (d >= 5 ? ", từ 5 trở lên nên làm tròn lên" : ", bé hơn 5 nên làm tròn xuống") + ": " + fmt(x) + " ≈ " + fmt(rt(x, p)), "The digit right after the " + PLACE_NAME[p] + " in " + fmt(x) + " is " + d + (d >= 5 ? ", which is 5 or more, so we round up" : ", which is less than 5, so we round down") + ": " + fmt(x) + " ≈ " + fmt(rt(x, p)));
     return QQ({
      q: LT(ctx + " Làm tròn mỗi số đến " + PLACE_NAME[p] + " rồi tính " + (plus ? "tổng" : "hiệu (số lớn trừ số bé)") + " của hai số đã làm tròn.", ctx + " Round each number to the nearest " + NEAR[p] + ", then find the " + (plus ? "sum" : "difference (larger minus smaller)") + " of the two rounded numbers."),
      parts: [num("", ans2)],
      steps: [st(dir(A, pa), ra), st(dir(B, pb), rb), st(plus ? fmt(ra) + " + " + fmt(rb) + " = " + fmt(ans2) : fmt(Math.max(ra, rb)) + " − " + fmt(Math.min(ra, rb)) + " = " + fmt(ans2), ans2)],
      diag: DG.step([exact], LT("Con đã tính trên các số chưa làm tròn. Hãy làm tròn từng số trước, rồi mới " + (plus ? "cộng" : "trừ") + ".", "You used the original numbers. Round each number first, then " + (plus ? "add" : "subtract") + ".")),
      tip: LT("Làm tròn từng số trước, rồi mới " + (plus ? "cộng" : "trừ") + ".", "Round each number first, then " + (plus ? "add" : "subtract") + ".")
     })
    }
    let p = r.pick([1e3, 1e4]),
     h = p / 2,
     T = p === 1e4 ? rd(r, 120, 980) * 1e4 : rd(r, 1200, 9800) * 1e3,
     good = T + rd(r, 1, h - 1) * (r.chance(.5) ? 1 : -1),
     cand = [T - h - rd(r, 1, h / 5), T + h + rd(r, 0, h / 5 - 1), T + (r.chance(.5) ? 1 : -1) * p + rd(r, 1, h - 1) * (r.chance(.5) ? 1 : -1)];
    cand = cand.filter((x, i, a) => rt(x, p) !== T && a.indexOf(x) === i && x !== good);
    for (; cand.length < 3;) {
     let x = T + (r.chance(.5) ? 1 : -1) * (h + rd(r, 0, h - 1));
     x !== good && cand.indexOf(x) < 0 && rt(x, p) !== T && cand.push(x)
    }
    let opts = r.shuffle([good].concat(cand.slice(0, 3)).map(fmt));
    return QQ({
     q: LT("Số nào dưới đây khi làm tròn đến " + PLACE_NAME[p] + " thì được **" + fmt(T) + "**?", "Which of these numbers rounds to **" + fmt(T) + "** when rounded to the nearest " + NEAR[p] + "?"),
     parts: [chp(opts, fmt(good))],
     steps: [st(LT("Làm tròn từng số đến " + PLACE_NAME[p] + ": chỉ cần nhìn chữ số ngay sau hàng đó.", "Round each number to the nearest " + NEAR[p] + ": just look at the digit right after that place.")), st(LT("Các số làm tròn được " + fmt(T) + " nằm từ " + fmt(T - h) + " đến " + fmt(T + h - 1) + ". Chỉ có " + fmt(good) + " nằm trong khoảng đó.", "The numbers that round to " + fmt(T) + " are from " + fmt(T - h) + " to " + fmt(T + h - 1) + ". Only " + fmt(good) + " is in that range."))],
     tip: LT("Làm tròn từng số xem số nào được " + fmt(T) + ".", "Round each number to see which one gives " + fmt(T) + ".")
    })
   }
  });
  var colSteps = (a, b, op, res) => {
   let F = FB.col(a, b, op),
    info = F.info,
    n = F.n,
    la = String(a).length,
    lb = String(b).length,
    plus = op === "+",
    lr = String(res).length,
    out = [st(plus ? LT("Đặt thẳng cột, cộng từ phải sang trái.", "Line up the columns and add from right to left.") : LT("Đặt thẳng cột, trừ từ phải sang trái.", "Line up the columns and subtract from right to left."))];
   for (let k = 0; k < n; k++) {
    let f = info[n - 1 - k],
     hv = HANG[k],
     lab = LT("Hàng " + hv + ": ", capF(hv) + " place: "),
     ha = k < la,
     hb = k < lb,
     tx;
    if (plus) {
     if (!ha && !hb) {
      if (f.cin === 0) break;
      tx = LT(lab + "hạ số nhớ " + f.cin + " xuống, viết " + f.v + ".", lab + "bring down the carried " + f.cin + " and write " + f.v + ".")
     } else {
      let tv = [],
       te = [];
      ha && (tv.push(f.da), te.push(f.da)), hb && (tv.push(f.db), te.push(f.db));
      let ex = te.join(" + ") + (f.cin ? " + " + f.cin + LT(" (nhớ)", " (carried)") : "") + " = " + f.v;
      tx = LT(lab + ex + ", viết " + f.dr + (f.cout ? ", nhớ 1." : "."), lab + ex + ", write " + f.dr + (f.cout ? " and carry 1." : "."))
     }
    } else {
     let t = f.t,
      pre = f.cin ? LT("số trừ " + f.db + " thêm 1 (trả) bằng " + t + "; ", "the bottom digit " + f.db + " plus 1 (paid back) is " + t + "; ") : "",
      lead = k >= lr ? LT(" (số 0 ở đầu không cần viết)", " (a 0 at the front is not written)") : "";
     tx = f.cout ? LT(lab + pre + f.da + " không trừ được " + t + ", mượn 1 thành " + f.cur + "; " + f.cur + " − " + t + " = " + f.dr + ", viết " + f.dr + ", nhớ 1" + lead + ".", lab + pre + f.da + " is too small to subtract " + t + ", so borrow 1 to make " + f.cur + "; " + f.cur + " − " + t + " = " + f.dr + ", write " + f.dr + " and remember to pay back 1" + lead + ".") : LT(lab + pre + f.da + " − " + t + " = " + f.dr + ", viết " + f.dr + lead + ".", lab + pre + f.da + " − " + t + " = " + f.dr + ", write " + f.dr + lead + ".")
    }
    out.push(st(tx))
   }
   return out.push(st(fmt(a) + (plus ? " + " : " − ") + fmt(b) + " = " + fmt(res), res)), out
  };
  LESSON({
   id: "addsub",
   reg: "so",
   title: LT("Cộng và trừ", "Add and Subtract"),
   emoji: "➕",
   blurb: LT("Cộng, trừ số có nhiều chữ số (có nhớ)", "Add and subtract multi-digit numbers (with carrying)"),
   links: ["place"],
   rule: {
    h: LT("Quy tắc", "Rule"),
    items: [LT("Viết các chữ số **thẳng cột**, tính từ **phải sang trái**.", "Write the digits **lined up in columns** and work **from right to left**."), LT("Cộng: được 10 trở lên thì viết chữ số hàng đơn vị, **nhớ 1** sang hàng bên trái.", "Adding: if you get 10 or more, write the ones digit and **carry 1** to the place on the left."), LT("Trừ: chữ số trên bé hơn thì **mượn 1 ở hàng bên trái** (thêm 10) để trừ, rồi **trả 1**: cộng thêm 1 vào chữ số số trừ ở hàng bên trái.", "Subtracting: if the top digit is smaller, **borrow 1 from the place on the left** (that adds 10 to the top digit) so you can subtract, then **pay it back**: add 1 to the bottom number's digit in the place on the left.")]
   },
   figs: {
    a: () => FB.col(4786, 2539, "+"),
    b: () => FB.col(7325, 2539, "-")
   },
   teach: [{
    key: "a",
    f: 0,
    say: LT("Tính **4 786 + 2 539**. Viết số thứ hai dưới số thứ nhất, các chữ số **thẳng cột**.", "Work out **4,786 + 2,539**. Write the second number under the first, with the digits **lined up in columns**.")
   }, {
    key: "a",
    f: 1,
    say: LT("Hàng đơn vị: 6 + 9 = 15, được 10 trở lên nên viết **5**, nhớ **1** sang hàng chục.", "Ones place: 6 + 9 = 15. That is 10 or more, so write **5** and carry **1** to the tens place.")
   }, {
    key: "a",
    f: 2,
    say: LT("Hàng chục: 8 + 3 + 1 (nhớ) = 12. Viết **2**, nhớ **1**.", "Tens place: 8 + 3 + 1 (carried) = 12. Write **2** and carry **1**.")
   }, {
    key: "a",
    f: 3,
    say: LT("Hàng trăm: 7 + 5 + 1 = 13. Viết **3**, nhớ **1**.", "Hundreds place: 7 + 5 + 1 = 13. Write **3** and carry **1**.")
   }, {
    key: "a",
    f: 4,
    say: LT("Hàng nghìn: 4 + 2 + 1 = 7. Vậy **4 786 + 2 539 = 7 325**.", "Thousands place: 4 + 2 + 1 = 7. So **4,786 + 2,539 = 7,325**.")
   }, {
    key: "b",
    f: 0,
    say: LT("Phép trừ là phép ngược lại: **7 325 − 2 539**. Cũng đặt thẳng cột.", "Subtraction is the opposite operation: **7,325 − 2,539**. Line up the columns again.")
   }, {
    key: "b",
    f: 1,
    say: LT("Hàng đơn vị: 5 không trừ được 9, **mượn 1 chục** thành 15; 15 − 9 = 6, viết **6**. Mượn thì phải trả: **nhớ 1** sang hàng chục (thêm 1 vào số trừ ở hàng chục).", "Ones place: 5 can't subtract 9, so **borrow 1 ten** to make 15; 15 − 9 = 6, write **6**. When you borrow, you pay it back: **remember 1** and add it to the bottom number's tens digit.")
   }, {
    key: "b",
    f: 2,
    say: LT("Hàng chục: 3 thêm 1 bằng 4; 2 chục không trừ được 4 chục, mượn 1 trăm (bằng 10 chục) thành 12 chục; 12 − 4 = 8, viết **8**, nhớ 1.", "Tens place: 3 plus 1 is 4; 2 tens can't subtract 4 tens, so borrow 1 hundred (that is 10 tens) to make 12 tens; 12 − 4 = 8, write **8**, and remember to pay back 1.")
   }, {
    key: "b",
    f: 3,
    say: LT("Hàng trăm: 5 thêm 1 bằng 6; 3 trăm không trừ được 6 trăm, mượn 1 nghìn (bằng 10 trăm) thành 13 trăm; 13 − 6 = 7, viết **7**, nhớ 1.", "Hundreds place: 5 plus 1 is 6; 3 hundreds can't subtract 6 hundreds, so borrow 1 thousand (that is 10 hundreds) to make 13 hundreds; 13 − 6 = 7, write **7**, and remember to pay back 1.")
   }, {
    key: "b",
    f: 4,
    say: LT("Hàng nghìn: 2 thêm 1 bằng 3; 7 − 3 = 4, viết **4**. Vậy **7 325 − 2 539 = 4 786**.", "Thousands place: 2 plus 1 is 3; 7 − 3 = 4, write **4**. So **7,325 − 2,539 = 4,786**.")
   }, {
    key: "b",
    f: 4,
    say: LT("Thử lại: 4 786 + 2 539 = 7 325. Đúng rồi! Cộng và trừ kiểm tra được cho nhau.", "Check: 4,786 + 2,539 = 7,325. Correct! Addition and subtraction check each other.")
   }],
   gen(tier, r) {
    if (tier < 3) {
     let dig = tier === 1 ? 4 : rd(r, 5, 6),
      lo = Math.pow(10, dig - 1),
      hi = Math.pow(10, dig) - 1,
      a = rd(r, lo, hi),
      b = rd(r, lo, hi),
      plus = r.chance(.5);
     if (!plus && a < b) {
      let t = a;
      a = b, b = t
     }
     let res = plus ? a + b : a - b;
     return QQ({
      q: LT("Đặt tính rồi tính: **" + fmt(a) + (plus ? " + " : " − ") + fmt(b) + "**", "Set up the problem and solve: **" + fmt(a) + (plus ? " + " : " − ") + fmt(b) + "**"),
      parts: [num("", res)],
      steps: colSteps(a, b, plus ? "+" : "-", res),
      tip: LT("Kiểm tra lại bằng phép tính ngược.", "Check your answer with the opposite operation."),
      work: {
       type: "col",
       a,
       b,
       op: plus ? "+" : "-"
      },
      diag: DG.col(a, b, plus ? "+" : "-"),
      hintFig: {
       fb: FB.col(a, b, plus ? "+" : "-"),
       f: 1
      }
     })
    }
    let nr3 = () => rd(r, 1, 9) * 100 + rd(r, 1, 9) * 10 + rd(r, 1, 9),
     X = rd(r, 400, 900) * 1e3 + nr3(),
     A = rd(r, 100, 300) * 1e3 + nr3(),
     B = rd(r, 50, 250) * 1e3 + nr3(),
     v1 = X - A,
     v2 = v1 + B;
    return QQ({
     q: LT("Kho có **" + fmt(X) + " kg** gạo. Sáng bán đi **" + fmt(A) + " kg**, chiều nhập thêm **" + fmt(B) + " kg**. Hỏi cuối ngày kho có bao nhiêu ki-lô-gam gạo?", "The warehouse has **" + fmt(X) + " kg** of rice. In the morning, **" + fmt(A) + " kg** are sold, and in the afternoon, **" + fmt(B) + " kg** more come in. How many kilograms of rice are in the warehouse at the end of the day?"),
     parts: [num("", v2, "kg")],
     steps: [st(LT("Sau khi bán: " + fmt(X) + " − " + fmt(A) + " = " + fmt(v1) + " (kg)", "After selling: " + fmt(X) + " − " + fmt(A) + " = " + fmt(v1) + " (kg)"), v1), st(LT("Sau khi nhập: " + fmt(v1) + " + " + fmt(B) + " = " + fmt(v2) + " (kg)", "After new stock comes in: " + fmt(v1) + " + " + fmt(B) + " = " + fmt(v2) + " (kg)"), v2)],
     tip: LT("Bài có hai bước: bán (trừ) rồi nhập (cộng).", "This problem has two steps: selling (subtract), then new stock (add).")
    })
   }
  });
  addAsks("addsub", [{
   after: 1,
   say: LT("Cùng làm: hàng chục tính 8 + 3 + 1 (nhớ) = ?", "Let's do it together: in the tens place, 8 + 3 + 1 (carried) = ?"),
   opts: ["11", "12", "13"],
   ans: "12",
   good: LT("Đúng! 12: viết 2, nhớ 1.", "Right! 12: write 2, carry 1.")
  }, {
   after: 6,
   f: 2,
   say: LT("Cùng làm: hàng chục, số trừ 3 thêm 1 (trả) bằng 4; 2 chục không trừ được 4 chục, mượn 1 trăm (bằng 10 chục) thành 12 chục. 12 − 4 = ?", "Let's do it together: in the tens place, the bottom digit 3 plus 1 (paid back) is 4; 2 tens can't subtract 4 tens, so borrow 1 hundred (10 tens) to make 12 tens. 12 − 4 = ?"),
   opts: ["7", "8", "9"],
   ans: "8",
   good: LT("Đúng! 12 − 4 = 8, viết 8, nhớ 1 sang hàng trăm.", "Right! 12 − 4 = 8. Write 8 and remember to pay back 1 in the hundreds place.")
  }]);
  extendTier("addsub", 3, [r => {
   let nz = v => v % 100 === 0 ? v + rd(r, 1, 99) : v,
    k = r.int(0, 2),
    x = nz(rd(r, 120000, 699999)),
    a = nz(rd(r, 110000, 399999)),
    d = nz(rd(r, 21000, 99999)),
    e = nz(rd(r, 21000, 99999));
   if (k === 0) {
    let tot = x + a,
     c = tot + d;
    return QQ({
     q: LT("Tìm x, biết: **x + " + fmt(a) + " = " + fmt(c) + " − " + fmt(d) + "**", "Find x: **x + " + fmt(a) + " = " + fmt(c) + " − " + fmt(d) + "**"),
     parts: [num("x", x)],
     steps: [st(LT("Tính vế phải: " + fmt(c) + " − " + fmt(d) + " = " + fmt(tot), "Work out the right side: " + fmt(c) + " − " + fmt(d) + " = " + fmt(tot)), tot), st(LT("x là số hạng chưa biết: lấy tổng trừ số hạng đã biết", "x is the unknown addend: subtract the known addend from the sum")), st("x = " + fmt(tot) + " − " + fmt(a) + " = " + fmt(x), x)],
     diag: DG.any(DG.step([tot], LT("Con mới tính xong vế phải. Còn phải tìm x nữa nhé.", "You only worked out the right side. You still have to find x.")), DG.step([tot + a, Math.abs(a - tot)].filter(v => v !== x), LT("Muốn tìm số hạng chưa biết, lấy tổng trừ đi số hạng kia.", "To find an unknown addend, subtract the other addend from the sum."), "sai_pt")),
     tip: LT("Tính vế phải trước. x + a = tổng thì x = tổng − a.", "Work out the right side first. If x + a = the sum, then x = the sum − a.")
    })
   }
   if (k === 1) {
    let tot = d + e,
     xx = tot + a;
    return QQ({
     q: LT("Tìm x, biết: **x − " + fmt(a) + " = " + fmt(d) + " + " + fmt(e) + "**", "Find x: **x − " + fmt(a) + " = " + fmt(d) + " + " + fmt(e) + "**"),
     parts: [num("x", xx)],
     steps: [st(LT("Tính vế phải: " + fmt(d) + " + " + fmt(e) + " = " + fmt(tot), "Work out the right side: " + fmt(d) + " + " + fmt(e) + " = " + fmt(tot)), tot), st(LT("x là số bị trừ: lấy hiệu cộng số trừ", "x is the minuend (the number being subtracted from): add the difference and the subtrahend")), st("x = " + fmt(tot) + " + " + fmt(a) + " = " + fmt(xx), xx)],
     diag: DG.any(DG.step([tot], LT("Con mới tính xong vế phải. Còn phải tìm x nữa nhé.", "You only worked out the right side. You still have to find x.")), DG.step([Math.abs(tot - a)], LT("Muốn tìm số bị trừ, lấy hiệu cộng với số trừ.", "To find the minuend, add the difference to the subtrahend."), "sai_pt")),
     tip: LT("Tính vế phải trước. x − a = hiệu thì x = hiệu + a.", "Work out the right side first. If x − a = the difference, then x = the difference + a.")
    })
   }
   let tot = d + e,
    c = tot + x;
   return QQ({
    q: LT("Tìm x, biết: **" + fmt(c) + " − x = " + fmt(d) + " + " + fmt(e) + "**", "Find x: **" + fmt(c) + " − x = " + fmt(d) + " + " + fmt(e) + "**"),
    parts: [num("x", x)],
    steps: [st(LT("Tính vế phải: " + fmt(d) + " + " + fmt(e) + " = " + fmt(tot), "Work out the right side: " + fmt(d) + " + " + fmt(e) + " = " + fmt(tot)), tot), st(LT("x là số trừ: lấy số bị trừ trừ đi hiệu", "x is the subtrahend: subtract the difference from the minuend")), st("x = " + fmt(c) + " − " + fmt(tot) + " = " + fmt(x), x)],
    diag: DG.any(DG.step([tot], LT("Con mới tính xong vế phải. Còn phải tìm x nữa nhé.", "You only worked out the right side. You still have to find x.")), DG.step([c + tot], LT("Muốn tìm số trừ, lấy số bị trừ trừ đi hiệu.", "To find the subtrahend, subtract the difference from the minuend."), "sai_pt")),
    tip: LT("Tính vế phải trước. a − x = hiệu thì x = a − hiệu.", "Work out the right side first. If a − x = the difference, then x = a − the difference.")
   })
  }, r => {
   let nz = v => v % 10 === 0 ? v + rd(r, 1, 9) : v,
    X = nz(rd(r, 150000, 499999)),
    A = nz(rd(r, 14000, 55000)),
    B = nz(rd(r, 3000, 30000)),
    v1 = A + B,
    v2 = A + v1,
    v3 = X - v2;
   return QQ({
    q: LT("Thư viện thành phố có **" + fmt(X) + " quyển sách**. Trường A mượn **" + fmt(A) + " quyển**, trường B mượn nhiều hơn trường A **" + fmt(B) + " quyển**. Hỏi thư viện còn lại bao nhiêu quyển sách?", "The city library has **" + fmt(X) + " books**. School A borrows **" + fmt(A) + " books**, and School B borrows **" + fmt(B) + " more books** than School A. How many books are left in the library?"),
    parts: [num("", v3, LT("quyển", "books"))],
    steps: [st(LT("Trường B mượn: " + fmt(A) + " + " + fmt(B) + " = " + fmt(v1) + " (quyển)", "School B borrows: " + fmt(A) + " + " + fmt(B) + " = " + fmt(v1) + " (books)"), v1), st(LT("Hai trường mượn: " + fmt(A) + " + " + fmt(v1) + " = " + fmt(v2) + " (quyển)", "Both schools borrow: " + fmt(A) + " + " + fmt(v1) + " = " + fmt(v2) + " (books)"), v2), st(LT("Còn lại: " + fmt(X) + " − " + fmt(v2) + " = " + fmt(v3) + " (quyển)", "Left: " + fmt(X) + " − " + fmt(v2) + " = " + fmt(v3) + " (books)"), v3)],
    diag: DG.step([v1, v2, X - A - B, X - v1], LT("Bài có ba bước: tìm số sách trường B mượn, rồi cả hai trường, rồi số còn lại.", "This problem has three steps: find how many books School B borrowed, then how many both schools borrowed, then how many are left.")),
    tip: LT("Bài toán có ba bước tính.", "This is a three-step problem.")
   })
  }], !0);
  (function() {
   let l = byId("addsub"),
    old = l.gen;
   l.gen = function(t, r) {
    let q = old.call(l, t, r);
    return t === 3 && !q.diag && q.steps.length > 1 && q.parts.length === 1 && (q.diag = DG.step([q.steps[0].v])), q
   }
  })();
  var exprLn = (y, arr, o) => ({
   y,
   toks: arr.map((t, i) => Object.assign({
    k: (o && o.p || "t") + y + "_" + i,
    t: String(t)
   }, o && o.box && o.box.indexOf(i) >= 0 ? {
    box: "sun"
   } : {}))
  });
  LESSON({
   id: "quick",
   reg: "so",
   title: LT("Tính chất phép tính, tính nhanh", "Operation Properties and Quick Math"),
   short: LT("Tính nhanh", "Quick Math"),
   emoji: "⚡",
   blurb: LT("Giao hoán, kết hợp, phân phối; biểu thức chứa chữ", "Commutative, associative, distributive; expressions with letters"),
   links: ["addsub", "mul"],
   rule: {
    h: LT("Ghi nhớ", "Remember"),
    items: [LT("**Giao hoán**: a + b = b + a; a × b = b × a.", "**Commutative**: a + b = b + a; a × b = b × a."), LT("**Kết hợp**: (a + b) + c = a + (b + c); (a × b) × c = a × (b × c).", "**Associative**: (a + b) + c = a + (b + c); (a × b) × c = a × (b × c)."), LT("**Nhân một số với một tổng**: a × (b + c) = a × b + a × c, nên a × b + a × c = a × (b + c).", "**Multiplying a number by a sum**: a × (b + c) = a × b + a × c, so a × b + a × c = a × (b + c)."), LT("**Nhân một số với một hiệu**: a × b − a × c = a × (b − c).", "**Multiplying a number by a difference**: a × b − a × c = a × (b − c)."), "a × b + a = a × b + a × 1 = a × (b + 1).", LT("Biểu thức có cả cộng/trừ và nhân/chia: **nhân, chia trước**; cộng, trừ sau.", "An expression with both add/subtract and multiply/divide: **multiply and divide first**; add and subtract after."), LT("**Biểu thức chứa chữ**: thay chữ bằng số rồi tính, được một giá trị của biểu thức.", "**Expressions with letters**: replace the letters with numbers, then calculate to get a value of the expression.")]
   },
   figs: {
    a: () => FB.expr([{
     lines: [exprLn(60, [25, "+", 37, "+", 75])]
    }, {
     lines: [exprLn(60, [25, "+", 37, "+", 75], {
      box: [0, 4]
     }), exprLn(126, ["=", 37, "+", "(25", "+", "75)"], {
      p: "u"
     })],
     bg: [{
      from: "u126_3",
      to: "u126_5",
      c: "sun",
      stroke: null,
      op: .8
     }]
    }, {
     lines: [exprLn(60, [25, "+", 37, "+", 75], {
      box: [0, 4]
     }), exprLn(126, ["=", 37, "+", "(25", "+", "75)"], {
      p: "u"
     }), exprLn(186, ["=", 37, "+", 100, "=", 137], {
      p: "w"
     })]
    }], {
     h: 210
    }),
    b: () => FB.expr([{
     lines: [exprLn(60, [4, "×", 7, "×", 25])]
    }, {
     lines: [exprLn(60, [4, "×", 7, "×", 25], {
      box: [0, 4]
     }), exprLn(126, ["=", 7, "×", "(4", "×", "25)"], {
      p: "u"
     })]
    }, {
     lines: [exprLn(60, [4, "×", 7, "×", 25], {
      box: [0, 4]
     }), exprLn(126, ["=", 7, "×", "(4", "×", "25)"], {
      p: "u"
     }), exprLn(186, ["=", 7, "×", 100, "=", 700], {
      p: "w"
     })]
    }], {
     h: 210
    }),
    c: () => FB.expr([{
     lines: [exprLn(60, [36, "×", 7, "+", 36, "×", 3], {
      box: [0, 4]
     })]
    }, {
     lines: [exprLn(60, [36, "×", 7, "+", 36, "×", 3], {
      box: [0, 4]
     }), exprLn(126, ["=", 36, "×", "(7", "+", "3)"], {
      p: "u"
     })]
    }, {
     lines: [exprLn(60, [36, "×", 7, "+", 36, "×", 3], {
      box: [0, 4]
     }), exprLn(126, ["=", 36, "×", "(7", "+", "3)"], {
      p: "u"
     }), exprLn(186, ["=", 36, "×", 10, "=", 360], {
      p: "w"
     })]
    }, {
     lines: [exprLn(60, [36, "×", "(7", "+", "3)"]), exprLn(126, ["=", 36, "×", 7, "+", 36, "×", 3], {
      p: "u",
      box: [1, 5]
     })],
     notes: [{
      y: 190,
      t: LT("36 nhóm 7 và 36 nhóm 3", "36 groups of 7 and 36 groups of 3"),
      c: "dark"
     }]
    }, {
     lines: [exprLn(60, [36, "×", 18, "−", 36, "×", 8], {
      box: [0, 4]
     }), exprLn(126, ["=", 36, "×", "(18", "−", "8)"], {
      p: "u"
     }), exprLn(186, ["=", 36, "×", 10, "=", 360], {
      p: "w"
     })]
    }, {
     lines: [exprLn(60, [47, "×", 9, "+", 47], {
      box: [0, 4]
     }), exprLn(126, ["=", 47, "×", 9, "+", 47, "×", 1], {
      p: "u"
     }), exprLn(186, ["=", 47, "×", "(9", "+", "1)", "=", 470], {
      p: "w"
     })]
    }, {
     lines: [exprLn(50, ["a", "+", "b", "×", "c"]), exprLn(140, ["=", 5, "+", 4, "×", 3], {
      p: "u"
     }), exprLn(196, ["=", 5, "+", 12, "=", 17], {
      p: "w"
     })],
     notes: [{
      y: 92,
      t: LT("với a = 5, b = 4, c = 3", "with a = 5, b = 4, c = 3"),
      c: "dark"
     }]
    }], {
     h: 210
    })
   },
   teach: [{
    key: "a",
    f: 0,
    say: LT("Tính nhanh **25 + 37 + 75**. Hãy tìm hai số cộng lại được **số tròn trăm**.", "Let's calculate **25 + 37 + 75** the easy way. Look for two numbers that add up to a **round hundred**.")
   }, {
    key: "a",
    f: 1,
    say: LT("25 + 75 = 100. Nhờ tính chất **giao hoán** và **kết hợp**, ta đổi chỗ rồi nhóm hai số đó lại.", "25 + 75 = 100. Thanks to the **commutative** and **associative** properties, we can swap the order and group those two numbers together.")
   }, {
    key: "a",
    f: 2,
    say: LT("Vậy 25 + 37 + 75 = 37 + (25 + 75) = 37 + 100 = **137**. Nhẩm nhanh hơn nhiều!", "So 25 + 37 + 75 = 37 + (25 + 75) = 37 + 100 = **137**. Much faster in your head!")
   }, {
    key: "b",
    f: 0,
    say: LT("Phép nhân cũng vậy: **4 × 7 × 25**.", "Multiplication works the same way: **4 × 7 × 25**.")
   }, {
    key: "b",
    f: 1,
    say: LT("Cùng làm: nhóm hai số nào trước thì dễ nhất?", "Let's do it together: which two numbers are easiest to group first?"),
    ask: {
     opts: [LT("4 và 25", "4 and 25"), LT("4 và 7", "4 and 7"), LT("7 và 25", "7 and 25")],
     ans: LT("4 và 25", "4 and 25"),
     good: LT("Đúng! 4 × 25 = 100.", "Right! 4 × 25 = 100.")
    }
   }, {
    key: "b",
    f: 2,
    say: LT("Vậy 4 × 7 × 25 = 7 × (4 × 25) = 7 × 100 = **700**.", "So 4 × 7 × 25 = 7 × (4 × 25) = 7 × 100 = **700**.")
   }, {
    key: "c",
    f: 3,
    say: LT("**Nhân một số với một tổng**: 36 × (7 + 3) là 36 nhóm 7 và 36 nhóm 3, nên **36 × (7 + 3) = 36 × 7 + 36 × 3**.", "**Multiplying a number by a sum**: 36 × (7 + 3) is 36 groups of 7 and 36 groups of 3, so **36 × (7 + 3) = 36 × 7 + 36 × 3**.")
   }, {
    key: "c",
    f: 0,
    say: LT("Đọc theo chiều ngược lại: **36 × 7 + 36 × 3**, hai tích có chung thừa số **36**.", "Reading it backward: **36 × 7 + 36 × 3**, two products that share the factor **36**.")
   }, {
    key: "c",
    f: 1,
    say: LT("Gom lại: a × b + a × c = a × (b + c), được **36 × (7 + 3)**.", "Put them together: a × b + a × c = a × (b + c), which gives **36 × (7 + 3)**.")
   }, {
    key: "c",
    f: 2,
    say: LT("Vậy 36 × 7 + 36 × 3 = 36 × (7 + 3) = 36 × 10 = **360**.", "So 36 × 7 + 36 × 3 = 36 × (7 + 3) = 36 × 10 = **360**.")
   }, {
    key: "c",
    f: 4,
    say: LT("Với phép trừ cũng vậy: **a × b − a × c = a × (b − c)**. Ví dụ 36 × 18 − 36 × 8 = 36 × (18 − 8) = 36 × 10 = **360**.", "It works for subtraction too: **a × b − a × c = a × (b − c)**. For example, 36 × 18 − 36 × 8 = 36 × (18 − 8) = 36 × 10 = **360**.")
   }, {
    key: "c",
    f: 5,
    say: LT("Mẹo: số a chính là a × 1, nên **a × b + a = a × b + a × 1 = a × (b + 1)**. Ví dụ 47 × 9 + 47 = 47 × (9 + 1) = 47 × 10 = **470**.", "Trick: the number a is the same as a × 1, so **a × b + a = a × b + a × 1 = a × (b + 1)**. For example, 47 × 9 + 47 = 47 × (9 + 1) = 47 × 10 = **470**.")
   }, {
    key: "c",
    f: 6,
    say: LT("**Biểu thức chứa chữ**: a + b × c. Với a = 5, b = 4, c = 3 thì a + b × c = 5 + 4 × 3 = 5 + 12 = **17**. 17 là một **giá trị của biểu thức** a + b × c (thay chữ bằng số, nhân trước cộng sau).", "**Expressions with letters**: a + b × c. With a = 5, b = 4, c = 3, a + b × c = 5 + 4 × 3 = 5 + 12 = **17**. 17 is a **value of the expression** a + b × c (replace the letters with numbers, multiply first, then add).")
   }],
   gen(tier, r) {
    if (tier === 1) {
     let k2 = r.pick([100, 100, 200, 1e3]),
      a2 = k2 === 1e3 ? rd(r, 101, 899) : rd(r, 11, k2 - 11),
      c = k2 - a2,
      b = rd(r, 12, 98),
      x = r.shuffle([0, 1])[0] ? [a2, b, c] : [c, b, a2];
     return QQ({
      q: LT("Tính bằng cách thuận tiện: **" + x[0] + " + " + x[1] + " + " + x[2] + "**", "Calculate the easy way: **" + x[0] + " + " + x[1] + " + " + x[2] + "**"),
      parts: [num("", k2 + b)],
      steps: [st(x[0] + " + " + x[1] + " + " + x[2] + " = " + b + " + (" + x[0] + " + " + x[2] + ")"), st("= " + b + " + " + fmt(k2) + " = " + fmt(k2 + b), k2 + b)],
      tip: LT("Tìm hai số cộng lại được số tròn trăm (tròn nghìn).", "Find two numbers that add up to a round hundred (or round thousand).")
     })
    }
    if (tier === 2) {
     if (r.chance(.5)) {
      let pr = r.pick([
        [2, 5],
        [4, 25],
        [2, 50],
        [5, 20],
        [25, 8],
        [125, 8]
       ]),
       m = rd(r, 3, 49),
       p = pr[0] * pr[1],
       ord = r.int(0, 2),
       xs = ord === 0 ? [pr[0], m, pr[1]] : ord === 1 ? [m, pr[0], pr[1]] : [pr[1], m, pr[0]];
      return QQ({
       q: LT("Tính bằng cách thuận tiện: **" + xs.join(" × ") + "**", "Calculate the easy way: **" + xs.join(" × ") + "**"),
       parts: [num("", p * m)],
       steps: [st(xs.join(" × ") + " = " + m + " × (" + pr[0] + " × " + pr[1] + ")"), st("= " + m + " × " + fmt(p) + " = " + fmt(p * m), p * m)],
       tip: LT("Tìm hai thừa số nhân với nhau được số tròn chục, tròn trăm hoặc tròn nghìn (ví dụ 25 × 4 = 100, 25 × 8 = 200).", "Find two factors that multiply to a round number like 10, 100, 200, or 1,000 (for example 25 × 4 = 100, 25 × 8 = 200).")
      })
     }
     let a2 = rd(r, 10, 90),
      b = rd(r, 3, 25),
      c = rd(r, 2, 9),
      ans = a2 + b * c;
     return QQ({
      q: LT("Tính giá trị của biểu thức **a + b × c** với a = " + a2 + ", b = " + b + ", c = " + c + ".", "Find the value of the expression **a + b × c** when a = " + a2 + ", b = " + b + ", c = " + c + "."),
      parts: [num("", ans)],
      steps: [st(LT("Thay chữ bằng số: " + a2 + " + " + b + " × " + c, "Replace the letters with numbers: " + a2 + " + " + b + " × " + c)), st(LT("Nhân trước: " + b + " × " + c + " = " + b * c, "Multiply first: " + b + " × " + c + " = " + b * c), b * c), st(LT("Cộng sau: " + a2 + " + " + b * c + " = " + ans, "Then add: " + a2 + " + " + b * c + " = " + ans), ans)],
      diag: (v, q) => DG.thuTu((a2 + b) * c)(v, q) || DG.step([b * c])(v, q),
      tip: LT("Nhân, chia trước; cộng, trừ sau.", "Multiply and divide first; add and subtract after.")
     })
    }
    let k = r.int(0, 5),
     a = rd(r, 12, 99);
    if (k === 0) {
     let s = r.pick([10, 100]),
      b = rd(r, 1, s - 1),
      c = s - b;
     return QQ({
      q: LT("Tính bằng cách thuận tiện: **" + a + " × " + b + " + " + a + " × " + c + "**", "Calculate the easy way: **" + a + " × " + b + " + " + a + " × " + c + "**"),
      parts: [num("", a * s)],
      steps: [st(LT("Có thừa số chung " + a + ": " + a + " × " + b + " + " + a + " × " + c + " = " + a + " × (" + b + " + " + c + ")", "Common factor " + a + ": " + a + " × " + b + " + " + a + " × " + c + " = " + a + " × (" + b + " + " + c + ")")), st("= " + a + " × " + s + " = " + fmt(a * s), a * s)],
      tip: LT("Hai tích có chung một thừa số: gom lại thành a × (b + c).", "The two products share a factor: put them together as a × (b + c).")
     })
    }
    if (k === 1) {
     let s = r.pick([10, 100]),
      c = rd(r, 2, 40),
      b = c + s;
     return QQ({
      q: LT("Tính bằng cách thuận tiện: **" + a + " × " + b + " − " + a + " × " + c + "**", "Calculate the easy way: **" + a + " × " + b + " − " + a + " × " + c + "**"),
      parts: [num("", a * s)],
      steps: [st(LT("Có thừa số chung " + a + ": " + a + " × " + b + " − " + a + " × " + c + " = " + a + " × (" + b + " − " + c + ")", "Common factor " + a + ": " + a + " × " + b + " − " + a + " × " + c + " = " + a + " × (" + b + " − " + c + ")")), st("= " + a + " × " + s + " = " + fmt(a * s), a * s)],
      tip: LT("Hai tích có chung một thừa số: gom lại thành a × (b − c).", "The two products share a factor: put them together as a × (b − c).")
     })
    }
    if (k === 2) {
     let n = r.pick([9, 99]);
     return QQ({
      q: LT("Tính bằng cách thuận tiện: **" + a + " × " + n + " + " + a + "**", "Calculate the easy way: **" + a + " × " + n + " + " + a + "**"),
      parts: [num("", a * (n + 1))],
      steps: [st(a + " × " + n + " + " + a + " = " + a + " × " + n + " + " + a + " × 1 = " + a + " × (" + n + " + 1)"), st("= " + a + " × " + (n + 1) + " = " + fmt(a * (n + 1)), a * (n + 1))],
      tip: LT("Số " + a + " chính là " + a + " × 1.", "The number " + a + " is the same as " + a + " × 1.")
     })
    }
    if (k === 3) {
     let f = r.pick([
       [25, 4],
       [25, 8],
       [125, 8]
      ]),
      g = rd(r, f[1] === 4 ? 3 : 2, 9),
      x = r.chance(.5) ? f[0] : f[1],
      y = (x === f[0] ? f[1] : f[0]) * g,
      o = x === f[0] ? f[1] : f[0],
      ans = x * y;
     return QQ({
      q: LT("Tính bằng cách thuận tiện: **" + x + " × " + fmt(y) + "**", "Calculate the easy way: **" + x + " × " + fmt(y) + "**"),
      parts: [num("", ans)],
      steps: [st(LT("Tách " + fmt(y) + " = " + o + " × " + g + ", vì " + x + " × " + o + " = " + fmt(x * o), "Split " + fmt(y) + " = " + o + " × " + g + ", because " + x + " × " + o + " = " + fmt(x * o))), st(x + " × " + fmt(y) + " = " + x + " × (" + o + " × " + g + ") = (" + x + " × " + o + ") × " + g), st("= " + fmt(x * o) + " × " + g + " = " + fmt(ans), ans)],
      tip: LT("Tách một thừa số để ghép được cặp nhân ra số tròn trăm (ví dụ 25 × 4 = 100, 125 × 8 = 1 000).", "Split one factor so you can make a pair that multiplies to a round number (for example 25 × 4 = 100, 125 × 8 = 1,000).")
     })
    }
    if (k === 4) {
     let s = r.pick([10, 100]),
      b = rd(r, 2, s - 2),
      c = s - b,
      sw = r.pick([[1, 0], [0, 1], [1, 1]]),
      t1 = sw[0] ? b + " × " + a : a + " × " + b,
      t2 = sw[1] ? c + " × " + a : a + " × " + c;
     return QQ({
      q: LT("Tính bằng cách thuận tiện: **" + t1 + " + " + t2 + "**", "Calculate the easy way: **" + t1 + " + " + t2 + "**"),
      parts: [num("", a * s)],
      steps: [st(LT("Đổi chỗ thừa số cho có thừa số chung " + a + ": " + t1 + " + " + t2 + " = " + a + " × " + b + " + " + a + " × " + c, "Swap the factors to get the common factor " + a + ": " + t1 + " + " + t2 + " = " + a + " × " + b + " + " + a + " × " + c)), st("= " + a + " × (" + b + " + " + c + ") = " + a + " × " + s + " = " + fmt(a * s), a * s)],
      tip: LT("Dùng tính chất giao hoán đưa thừa số chung " + a + " về cùng một vị trí.", "Use the commutative property to move the common factor " + a + " to the same position.")
     })
    }
    let s = r.pick([10, 100]),
     b = rd(r, 2, s - 2),
     c = s - b,
     cx = r.pick([
      [LT("hộp", "box"), LT("hộp", "boxes"), LT("cái bút", "pens")],
      [LT("thùng", "crate"), LT("thùng", "crates"), LT("quả cam", "oranges")],
      [LT("kệ", "shelf"), LT("kệ", "shelves"), LT("quyển sách", "books")]
     ]);
    return QQ({
     q: LT("Mỗi " + cx[0] + " có **" + a + " " + cx[2] + "**. Buổi sáng xếp **" + b + " " + cx[0] + "**, buổi chiều xếp **" + c + " " + cx[0] + "**. Hỏi cả hai buổi xếp được bao nhiêu " + cx[2] + "? (Tính bằng cách thuận tiện)", "Each " + cx[0] + " has **" + a + " " + cx[2] + "**. In the morning, **" + b + " " + cx[1] + "** are filled, and in the afternoon, **" + c + " " + cx[1] + "** are filled. How many " + cx[2] + " are there in all? (Use the easy way.)"),
     parts: [num("", a * s, cx[2])],
     steps: [st(LT("Số " + cx[0] + " cả hai buổi: " + b + " + " + c + " = " + s + " (" + cx[0] + ")", "Number of " + cx[1] + " in both parts of the day: " + b + " + " + c + " = " + s + " (" + cx[1] + ")"), s), st(LT("Số " + cx[2] + ": " + a + " × " + s + " = " + fmt(a * s) + " (" + cx[2] + ")", "Number of " + cx[2] + ": " + a + " × " + s + " = " + fmt(a * s) + " (" + cx[2] + ")"), a * s)],
     tip: LT("Gộp số " + cx[0] + " hai buổi lại trước, rồi nhân: a × b + a × c = a × (b + c).", "Add the number of " + cx[1] + " from both parts of the day first, then multiply: a × b + a × c = a × (b + c)."),
     diag: DG.step([s], LT("Con mới tìm tổng số " + cx[0] + ". Còn phải nhân với số " + cx[2] + " trong mỗi " + cx[0] + ".", "You only found the total number of " + cx[1] + ". You still need to multiply by the number of " + cx[2] + " in each " + cx[0] + "."))
    })
   }
  });
  var mulSteps = (a, m) => {
   let F = FB.mul1(a, m),
    info = F.info,
    n = F.n,
    la = String(a).length,
    out = [];
   for (let k = 0; k < n; k++) {
    let f = info[n - 1 - k],
     hv = HANG[k],
     lab = LT("Hàng " + hv + ": ", capF(hv) + " place: ");
    if (k >= la) {
     if (f.cin === 0) break;
     out.push(st(LT(lab + "hạ số nhớ " + f.cin + " xuống, viết " + f.v + ".", lab + "bring down the carried " + f.cin + " and write " + f.v + ".")));
     continue
    }
    let ex = f.da + " × " + m + " = " + f.da * m,
     tail = ", viết " + f.dr + (f.cout ? ", nhớ " + f.cout : "") + ".",
     tailE = ", write " + f.dr + (f.cout ? ", carry " + f.cout : "") + ".";
    out.push(st(LT(lab + ex + (f.cin ? ", thêm " + f.cin + " nhớ = " + f.v : "") + tail, lab + ex + (f.cin ? ", plus the " + f.cin + " carried = " + f.v : "") + tailE)))
   }
   return out.push(st(fmt(a) + " × " + m + " = " + fmt(a * m), a * m)), out
  };
  LESSON({
   id: "mul",
   reg: "so",
   title: LT("Phép nhân", "Multiplication"),
   emoji: "✖️",
   blurb: LT("Nhân với số có một, hai chữ số", "Multiply by one- and two-digit numbers"),
   links: ["addsub"],
   rule: {
    h: LT("Quy tắc", "Rule"),
    items: [LT("Nhân lần lượt từng chữ số của số thứ nhất với số thứ hai, **từ phải sang trái**; được từ 10 trở lên thì viết chữ số hàng đơn vị, **nhớ** số chục sang hàng bên trái.", "Multiply each digit of the first number by the second number, one at a time, **from right to left**; if the result is 10 or more, write the ones digit and **carry** the tens digit to the place on the left."), LT("Nhân số có hai chữ số: có **hai tích riêng**; tích riêng thứ hai **lùi sang trái một cột**.", "Multiplying by a two-digit number: there are **two partial products**; the second partial product is **shifted one column to the left**.")]
   },
   figs: {
    a: () => FB.mul1(1234, 3),
    b: () => FB.mul2(236, 24)
   },
   teach: [{
    key: "a",
    f: 0,
    say: LT("Tính **1 234 × 3**. Nhân số 3 lần lượt với từng chữ số, bắt đầu từ hàng đơn vị.", "Work out **1,234 × 3**. Multiply 3 by each digit in turn, starting at the ones place.")
   }, {
    key: "a",
    f: 1,
    say: LT("Hàng đơn vị: 4 × 3 = 12. Viết **2**, nhớ **1**.", "Ones place: 4 × 3 = 12. Write **2**, carry **1**.")
   }, {
    key: "a",
    f: 2,
    say: LT("Hàng chục: 3 × 3 = 9, thêm 1 nhớ = 10. Viết **0**, nhớ **1**.", "Tens place: 3 × 3 = 9, plus the 1 carried = 10. Write **0**, carry **1**.")
   }, {
    key: "a",
    f: 3,
    say: LT("Hàng trăm: 2 × 3 = 6, thêm 1 nhớ = 7. Viết **7**.", "Hundreds place: 2 × 3 = 6, plus the 1 carried = 7. Write **7**.")
   }, {
    key: "a",
    f: 4,
    say: LT("Hàng nghìn: 1 × 3 = 3. Viết **3**. Vậy **1 234 × 3 = 3 702**. Ước lượng: 1 234 gần 1 200, 1 200 × 3 = 3 600 nên 3 702 là hợp lí.", "Thousands place: 1 × 3 = 3. Write **3**. So **1,234 × 3 = 3,702**. Estimate: 1,234 is close to 1,200, and 1,200 × 3 = 3,600, so 3,702 makes sense.")
   }, {
    key: "b",
    f: 0,
    say: LT("Nhân với số có hai chữ số: **236 × 24**. Ta tách 24 = 20 + 4.", "Multiplying by a two-digit number: **236 × 24**. Split 24 = 20 + 4.")
   }, {
    key: "b",
    f: 1,
    say: LT("Tích riêng thứ nhất: 236 × **4** = 944.", "First partial product: 236 × **4** = 944.")
   }, {
    key: "b",
    f: 2,
    say: LT("Tích riêng thứ hai: 236 × **2** = 472; vì là 2 chục nên tích riêng thứ hai viết **lùi sang trái một cột** (thực chất là 4 720).", "Second partial product: 236 × **2** = 472; since it is 2 tens, the second partial product is written **one column to the left** (it is really 4,720).")
   }, {
    key: "b",
    f: 3,
    say: LT("Cộng hai tích riêng: 944 + 4 720 = **5 664**.", "Add the two partial products: 944 + 4,720 = **5,664**.")
   }],
   gen(tier, r) {
    if (tier === 1) {
     let a2 = rd(r, 100, 999),
      m = rd(r, 2, 9);
     return QQ({
      q: LT("Tính: **" + fmt(a2) + " × " + m + "**", "Calculate: **" + fmt(a2) + " × " + m + "**"),
      parts: [num("", a2 * m)],
      steps: mulSteps(a2, m),
      tip: LT("Nhân từ phải sang trái. Được từ 10 trở lên thì viết chữ số hàng đơn vị, nhớ số chục sang hàng bên trái (có thể nhớ 2, 3…).", "Multiply from right to left. If the result is 10 or more, write the ones digit and carry the tens digit to the place on the left (you might carry 2, 3, and so on)."),
      work: {
       type: "col",
       a: a2,
       b: m,
       op: "×"
      },
      diag: DG.mul(a2, m),
      hintFig: {
       fb: FB.mul1(a2, m),
       f: 1
      }
     })
    }
    if (tier === 2) {
     let a2 = rd(r, 100, 499),
      m = rd(r, 12, 59);
     m % 10 === 0 && (m += r.int(1, 9));
     return QQ({
      q: LT("Đặt tính rồi tính: **" + fmt(a2) + " × " + m + "**", "Set up the problem and solve: **" + fmt(a2) + " × " + m + "**"),
      parts: [num("", a2 * m)],
      steps: [st(LT("Tích riêng thứ nhất: " + fmt(a2) + " × " + m % 10 + " = " + fmt(a2 * (m % 10)), "First partial product: " + fmt(a2) + " × " + m % 10 + " = " + fmt(a2 * (m % 10))), a2 * (m % 10)), st(LT("Tích riêng thứ hai: " + fmt(a2) + " × " + Math.floor(m / 10) + " = " + fmt(a2 * Math.floor(m / 10)) + ", viết lùi sang trái một cột (thực chất là " + fmt(a2 * Math.floor(m / 10) * 10) + ")", "Second partial product: " + fmt(a2) + " × " + Math.floor(m / 10) + " = " + fmt(a2 * Math.floor(m / 10)) + ", written one column to the left (it is really " + fmt(a2 * Math.floor(m / 10) * 10) + ")"), a2 * Math.floor(m / 10) * 10), st(LT("Cộng hai tích riêng: " + fmt(a2 * (m % 10)) + " + " + fmt(a2 * Math.floor(m / 10) * 10) + " = " + fmt(a2 * m), "Add the two partial products: " + fmt(a2 * (m % 10)) + " + " + fmt(a2 * Math.floor(m / 10) * 10) + " = " + fmt(a2 * m)), a2 * m)],
      tip: LT("Tích riêng thứ hai lùi sang trái một cột.", "Shift the second partial product one column to the left."),
      hintFig: {
       fb: FB.mul2(a2, m),
       f: 1
      }
     })
    }
    let a = rd(r, 36, 95),
     b = rd(r, 18, 48),
     c = rd(r, 4, 9);
    return QQ({
     q: LT("Mỗi hộp có **" + a + "** cái bánh. Mỗi thùng có **" + b + "** hộp. Cửa hàng có **" + c + " thùng**. Hỏi cửa hàng có tất cả bao nhiêu cái bánh?", "Each box has **" + a + "** cookies. Each crate has **" + b + "** boxes. The store has **" + c + " crates**. How many cookies does the store have in all?"),
     parts: [num("", a * b * c, LT("cái", "cookies"))],
     steps: [st(LT("Một thùng có: " + a + " × " + b + " = " + fmt(a * b) + " (cái)", "One crate has: " + a + " × " + b + " = " + fmt(a * b) + " (cookies)"), a * b), st(LT("Tất cả: " + fmt(a * b) + " × " + c + " = " + fmt(a * b * c) + " (cái)", "In all: " + fmt(a * b) + " × " + c + " = " + fmt(a * b * c) + " (cookies)"), a * b * c)],
     tip: LT("Tìm số bánh trong một thùng trước.", "First find the number of cookies in one crate.")
    })
   }
  });
  addAsks("mul", [{
   after: 1,
   say: LT("Cùng làm: hàng chục tính 3 × 3 = 9, thêm 1 nhớ. Được mấy?", "Let's do it together: in the tens place, 3 × 3 = 9, plus the 1 carried. What do you get?"),
   opts: ["9", "10", "11"],
   ans: "10",
   good: LT("Đúng! 10: viết 0, nhớ 1.", "Right! 10: write 0, carry 1.")
  }, {
   after: 6,
   say: LT("Cùng làm: 236 × 2 = ?", "Let's do it together: 236 × 2 = ?"),
   opts: ["452", "472", LT("4 720", "4,720")],
   ans: "472",
   good: LT("Đúng! 236 × 2 = 472; vì là 2 chục nên tích riêng thứ hai viết lùi sang trái một cột (thực chất là 4 720).", "Right! 236 × 2 = 472; since it is 2 tens, the second partial product is written one column to the left (it is really 4,720).")
  }]);
  extendTier("mul", 3, [r => {
   let p = (x => x % 1000 === 0 ? x + 250 : x)(rd(r, 12, 48) * 250),
    n = rd(r, 23, 64),
    q2 = rd(r, 16, 119) * 250,
    v1 = p * n,
    v2 = v1 + q2;
   return QQ({
    q: LT("Mỗi quyển vở giá **" + fmt(p) + " đồng**. Mẹ mua **" + n + " quyển vở** và một hộp bút giá **" + fmt(q2) + " đồng**. Hỏi mẹ phải trả tất cả bao nhiêu tiền?", "Each notebook costs **" + fmt(p) + " dong**. Mom buys **" + n + " notebooks** and a box of pens that costs **" + fmt(q2) + " dong**. How much money does Mom have to pay in all?"),
    parts: [num("", v2, LT("đồng", "dong"))],
    steps: [st(LT("Tiền vở: " + fmt(p) + " × " + n + " = " + fmt(v1) + " (đồng)", "Cost of notebooks: " + fmt(p) + " × " + n + " = " + fmt(v1) + " (dong)"), v1), st(LT("Tất cả: " + fmt(v1) + " + " + fmt(q2) + " = " + fmt(v2) + " (đồng)", "In all: " + fmt(v1) + " + " + fmt(q2) + " = " + fmt(v2) + " (dong)"), v2)],
    diag: DG.step([v1], LT("Còn tiền hộp bút nữa con nhé.", "Don't forget the cost of the box of pens too!")),
    tip: LT("Tính tiền vở trước, rồi cộng tiền hộp bút.", "Find the cost of the notebooks first, then add the cost of the box of pens.")
   })
  }, r => {
   let a = rd(r, 24, 75),
    k = rd(r, 3, 9),
    L = a * k,
    S = a * L;
   return QQ({
    q: LT("Một mảnh đất hình chữ nhật có chiều rộng **" + a + " m**, chiều dài gấp **" + k + " lần** chiều rộng. Tính diện tích mảnh đất.", "A rectangular plot of land has a width of **" + a + " m**, and its length is **" + k + " times** its width. Find the area of the plot."),
    parts: [num("", S, "m²")],
    steps: [st(LT("Chiều dài: " + a + " × " + k + " = " + L + " (m)", "Length: " + a + " × " + k + " = " + L + " (m)"), L), st(LT("Diện tích: " + L + " × " + a + " = " + fmt(S) + " (m²)", "Area: " + L + " × " + a + " = " + fmt(S) + " (m²)"), S)],
    diag: DG.any(DG.step([L], LT("Đó mới là chiều dài. Diện tích = dài × rộng.", "That is only the length. Area = length × width.")), DG.step([2 * (a + L)], LT("Con tính chu vi rồi. Diện tích là dài × rộng, không phải cộng các cạnh.", "You found the perimeter. Area is length × width, not the sum of the sides."), "nham_cv")),
    tip: LT("Tìm chiều dài trước, rồi diện tích = dài × rộng.", "Find the length first, then area = length × width.")
   })
  }], !0);
  (function() {
   let l = byId("mul"),
    old = l.gen;
   l.gen = function(t, r) {
    let q = old.call(l, t, r);
    if (t === 3 && !q.diag && q.steps.length > 1 && q.parts.length === 1 && (q.diag = DG.step([q.steps[0].v])), t === 2 && !q.work) {
     let m = q.q.match(/\*\*([^*]+) × (\d+)\*\*/);
     if (m) {
      let a = +m[1].replace(/\D/g, ""),
       mm = +m[2];
      mm >= 10 && mm < 100 && (q.work = {
       type: "mul2",
       a,
       m: mm
      })
     }
    }
    return q
   }
  })();
  function divSteps(n, d) {
   let ds = String(n).split("").map(Number),
    cur = 0,
    started = !1,
    out = [];
   ds.forEach((dg, i) => {
    cur = cur * 10 + dg;
    if (!started && cur < d) return;
    started = !0;
    let qd = Math.floor(cur / d),
     rm = cur - qd * d,
     more = i < ds.length - 1,
     nx = rm * 10 + ds[i + 1];
    out.push(st(LT(cur + " : " + d + " được " + qd + " (" + qd + " × " + d + " = " + qd * d + "; " + cur + " − " + qd * d + " = " + rm + ")" + (more ? ", hạ " + ds[i + 1] + " được " + nx : ""), cur + " ÷ " + d + " goes " + qd + (qd === 1 ? " time" : " times") + " (" + qd + " × " + d + " = " + qd * d + "; " + cur + " − " + qd * d + " = " + rm + ")" + (more ? ", bring down " + ds[i + 1] + " to make " + nx : ""))));
    cur = rm
   });
   return out
  }
  LESSON({
   id: "div",
   reg: "so",
   title: LT("Phép chia", "Division"),
   emoji: "➗",
   blurb: LT("Chia cho số có một, hai chữ số", "Divide by one- and two-digit numbers"),
   links: ["mul"],
   rule: {
    h: LT("Quy tắc", "Rule"),
    items: [LT("Chia từ **trái sang phải**: lấy một hay nhiều chữ số đầu sao cho chia được, rồi hạ lần lượt từng chữ số xuống.", "Divide **from left to right**: take the first digit or digits that can be divided, then bring down the remaining digits one at a time."), LT("Mỗi lượt: **chia → nhân → trừ → hạ**.", "Each round: **divide, multiply, subtract, bring down**."), LT("Số dư luôn **bé hơn số chia**.", "The remainder is always **smaller than the divisor**.")]
   },
   figs: {
    a: () => FB.div(756, 3),
    b: () => FB.div(1596, 38)
   },
   teach: [{
    key: "a",
    f: 0,
    say: LT("Tính **756 : 3**. Ta chia từ trái sang phải.", "Work out **756 ÷ 3**. We divide from left to right.")
   }, {
    key: "a",
    f: 1,
    say: LT("7 chia 3 được **2**, viết 2. Nhân: 2 × 3 = 6; trừ: 7 − 6 = 1. Hạ 5 được 15.", "7 divided by 3 is **2**, so write 2. Multiply: 2 × 3 = 6; subtract: 7 − 6 = 1. Bring down 5 to make 15.")
   }, {
    key: "a",
    f: 2,
    say: LT("15 chia 3 được **5**, viết 5. Nhân: 5 × 3 = 15; trừ: 15 − 15 = 0. Hạ 6 được 6.", "15 divided by 3 is **5**, so write 5. Multiply: 5 × 3 = 15; subtract: 15 − 15 = 0. Bring down 6 to make 6.")
   }, {
    key: "a",
    f: 3,
    say: LT("6 chia 3 được **2**, viết 2. Nhân: 2 × 3 = 6; trừ: 6 − 6 = 0. Vậy **756 : 3 = 252**, không dư.", "6 divided by 3 is **2**, so write 2. Multiply: 2 × 3 = 6; subtract: 6 − 6 = 0. So **756 ÷ 3 = 252**, with no remainder.")
   }, {
    key: "b",
    f: 0,
    say: LT("Chia cho số có hai chữ số: **1 596 : 38**. Cách làm giống hệt, chỉ cần nhẩm kĩ hơn.", "Dividing by a two-digit number: **1,596 ÷ 38**. It works exactly the same way, you just have to estimate more carefully.")
   }, {
    key: "b",
    f: 1,
    say: LT("1 và 15 đều bé hơn 38 nên lấy 159. Ước lượng: 38 gần 40, 159 gần 160, 160 : 40 = 4. Thử 4 × 38 = 152, không quá 159 (5 × 38 = 190 thì quá). Viết **4**; 159 trừ 152 bằng 7, hạ 6 được 76.", "1 and 15 are both smaller than 38, so we take 159. Estimate: 38 is close to 40, 159 is close to 160, and 160 ÷ 40 = 4. Try 4 × 38 = 152, which does not go over 159 (5 × 38 = 190 would be too big). Write **4**; 159 minus 152 is 7. Bring down 6 to make 76.")
   }, {
    key: "b",
    f: 2,
    say: LT("76 chia 38: ước lượng 80 : 40 = 2. Thử 2 × 38 = 76, viết **2**; 76 trừ 76 bằng 0. Vậy **1 596 : 38 = 42**.", "76 divided by 38: estimate 80 ÷ 40 = 2. Try 2 × 38 = 76, so write **2**; 76 minus 76 is 0. So **1,596 ÷ 38 = 42**.")
   }],
   gen(tier, r) {
    if (tier === 1) {
     let d2 = rd(r, 2, 9),
      q = rd(r, 100, 999);
     return QQ({
      q: LT("Đặt tính rồi tính: **" + fmt(d2 * q) + " : " + d2 + "**", "Use long division to solve: **" + fmt(d2 * q) + " ÷ " + d2 + "**"),
      parts: [num("", q)],
      steps: divSteps(d2 * q, d2).concat([st(LT(fmt(d2 * q) + " : " + d2 + " = " + q, fmt(d2 * q) + " ÷ " + d2 + " = " + q), q)]),
      tip: LT("Chia từ trái sang phải, nhớ chia – nhân – trừ – hạ.", "Divide from left to right, and remember: divide, multiply, subtract, bring down."),
      hintFig: {
       fb: FB.div(d2 * q, d2),
       f: 1
      }
     })
    }
    if (tier === 2) {
     let d2 = rd(r, 12, 45),
      q = rd(r, 20, 300),
      rem = rd(r, 0, d2 - 1),
      n = d2 * q + rem;
     return QQ({
      q: LT("Đặt tính rồi tính: **" + fmt(n) + " : " + d2 + "**" + (rem ? " (có số dư)" : ""), "Use long division to solve: **" + fmt(n) + " ÷ " + d2 + "**" + (rem ? " (with a remainder)" : "")),
      parts: rem ? [num(LT("Thương", "Quotient"), q), num(LT("Số dư", "Remainder"), rem)] : [num("", q)],
      steps: divSteps(n, d2).concat([st(LT(fmt(n) + " : " + d2 + " = " + q + (rem ? " (dư " + rem + ")" : ""), fmt(n) + " ÷ " + d2 + " = " + q + (rem ? " (remainder " + rem + ")" : "")), q)]),
      tip: LT("Mỗi lượt thử nhân số chia với 2, 3, 4... xem tích nào gần số đang chia ở lượt đó nhất mà không vượt quá.", "In each round, try multiplying the divisor by 2, 3, 4... and find the product closest to the number you are dividing in that round without going over.")
     })
    }
    let d = rd(r, 12, 30),
     v1 = rd(r, 12, 60),
     A = d * v1,
     k = rd(r, 2, d - 2),
     v2 = (d - k) * v1;
    return QQ({
     q: LT("Cửa hàng có **" + fmt(A) + " kg** gạo, đóng đều vào **" + d + " bao**. Đã bán **" + k + " bao**. Hỏi còn lại bao nhiêu ki-lô-gam gạo?", "The store has **" + fmt(A) + " kg** of rice, packed evenly into **" + d + " bags**. **" + k + " bags** have been sold. How many kilograms of rice are left?"),
     parts: [num("", v2, "kg")],
     steps: [st(LT("Mỗi bao có: " + fmt(A) + " : " + d + " = " + fmt(v1) + " (kg)", "Each bag has: " + fmt(A) + " ÷ " + d + " = " + fmt(v1) + " (kg)"), v1), st(LT("Còn " + (d - k) + " bao: " + fmt(v1) + " × " + (d - k) + " = " + fmt(v2) + " (kg)", (d - k) + " bags left: " + fmt(v1) + " × " + (d - k) + " = " + fmt(v2) + " (kg)"), v2)],
     tip: LT("Tìm số kg trong mỗi bao trước.", "First find how many kg are in each bag.")
    })
   }
  });
  addAsks("div", [{
   after: 1,
   say: LT("Cùng làm: hạ 5 xuống được 15. 15 : 3 = ?", "Let's do it together: bring down 5 to make 15. 15 ÷ 3 = ?"),
   opts: ["4", "5", "6"],
   ans: "5",
   good: LT("Đúng! 5 × 3 = 15, vừa đủ.", "Right! 5 × 3 = 15, exactly.")
  }]);
  extendTier("div", 3, [r => {
   let k = rd(r, 12, 45),
    N = k * rd(r, 100, 280) + rd(r, 1, k - 1),
    fl = Math.floor(N / k);
   return QQ({
    q: LT("Có **" + fmt(N) + " học sinh** đi tham quan. Mỗi xe chở được **" + k + " học sinh**. Hỏi cần ít nhất bao nhiêu xe?", "**" + fmt(N) + " students** are going on a field trip. Each bus can carry **" + k + " students**. What is the fewest number of buses needed?"),
    parts: [num("", fl + 1, LT("xe", "buses"))],
    steps: [st(LT(fmt(N) + " : " + k + " = " + fl + " (dư " + N % k + ")", fmt(N) + " ÷ " + k + " = " + fl + " (remainder " + N % k + ")"), fl), st(LT("Còn " + N % k + " học sinh cần thêm 1 xe: " + fl + " + 1 = " + (fl + 1) + " (xe)", (N % k === 1 ? "1 student is left and needs" : N % k + " students are left and need") + " 1 more bus: " + fl + " + 1 = " + (fl + 1) + " (buses)"), fl + 1)],
    diag: DG.ceil(fl),
    tip: LT("Phép chia có dư: số học sinh còn lại vẫn cần một xe.", "Division with a remainder: the students left over still need a bus.")
   })
  }, r => {
   let k = rd(r, 12, 45),
    qq = rd(r, 60, 280),
    rem = rd(r, 1, k - 1),
    N = k * qq + rem;
   return QQ({
    q: LT("Có **" + fmt(N) + " quyển vở** xếp vào các hộp, mỗi hộp **" + k + " quyển**. Hỏi xếp được nhiều nhất bao nhiêu hộp và còn thừa mấy quyển?", "There are **" + fmt(N) + " notebooks** to pack into boxes, with **" + k + " notebooks** in each box. What is the greatest number of boxes that can be packed, and how many notebooks are left over?"),
    parts: [num(LT("Số hộp", "Boxes"), qq, LT("hộp", "boxes")), num(LT("Thừa", "Left over"), rem, LT("quyển", "notebooks"))],
    steps: [st(LT(fmt(N) + " : " + k + " = " + qq + " (dư " + rem + ")", fmt(N) + " ÷ " + k + " = " + qq + " (remainder " + rem + ")"), qq), st(LT("Được " + qq + " hộp, thừa " + rem + " quyển", "That makes " + qq + " boxes with " + rem + (rem === 1 ? " notebook" : " notebooks") + " left over"), rem)],
    tip: LT("Đặt tính chia, số dư là số quyển thừa.", "Set up the long division; the remainder is the number of notebooks left over."),
    work: {
     type: "div",
     n: N,
     d: k
    }
   })
  }], !0);
  (function() {
   let l = byId("div"),
    old = l.gen;
   l.gen = function(t, r) {
    let q = old.call(l, t, r);
    if (t === 3 && !q.diag && q.steps.length > 1 && q.parts.length === 1 && (q.diag = DG.step([q.steps[0].v])), (t === 1 || t === 2) && !q.work) {
     let m = q.q.match(/\*\*([^*]+) [:÷] (\d+)\*\*/);
     m && (q.work = {
      type: "div",
      n: +m[1].replace(/\D/g, ""),
      d: +m[2]
     })
    }
    return q
   }
  })();

  function SDscenes(S, D, b, labs) {
   let L = labs || [LT("Lớn", "Larger"), LT("Bé", "Smaller")],
    uD = Math.max(D, (b + D) * .14),
    A = extra => ({
     lab: L[0],
     segs: [{
      id: 0,
      u: b,
      c: "orange",
      t: "?"
     }].concat(extra || [])
    }),
    B = extra => ({
     lab: L[1],
     segs: [{
      id: 0,
      u: b,
      c: "blue",
      t: "?"
     }].concat(extra || [])
    }),
    br = [{
     r1: 0,
     r2: 1,
     t: String(S),
     c: "red"
    }],
    yel = t => ({
     id: 1,
     u: uD,
     c: "yellow",
     t: t ?? String(D)
    });
   return [{
    rows: [A(), B()]
   }, {
    rows: [A(), B()],
    br
   }, {
    rows: [A([yel()]), B()],
    br
   }, {
    rows: [A([yel()]), B([{
     id: 1,
     u: uD,
     c: "yellow",
     dash: 1,
     faded: 1,
     t: String(D)
    }])],
    br,
    notes: [{
     t: LT("Cắt khúc hiệu → hai đoạn bằng nhau", "Two equal parts are left")
    }]
   }, {
    rows: [A([yel()]), B()],
    br,
    notes: [{
     t: LT("Hai đoạn bằng nhau: mỗi đoạn là số bé", "Each part = the smaller number")
    }]
   }]
  }

  function SDfig(S, D, a, b, k) {
   return FB.segs([SDscenes(S, D, b)[k]], {
    left: LT(60, 86)
   })
  }
  var TT = LT("⭐ Thử thách: ", "⭐ Challenge: "),
   AVG_HARD = [{
   q: TT + LT("Trung bình cộng của 3 số là 35. Số thứ nhất gấp đôi số thứ hai, số thứ hai gấp đôi số thứ ba. Tìm số thứ ba.", "The average of 3 numbers is 35. The first number is twice the second number, and the second number is twice the third number. Find the third number."),
   parts: [num(LT("Số thứ ba", "Third number"), 15)],
   steps: [st(LT("Tổng ba số: 35 × 3 = 105", "Sum of the three numbers: 35 × 3 = 105"), 105), st(LT("Coi số thứ ba là 1 phần thì số thứ hai là 2 phần, số thứ nhất là 4 phần: tất cả 1 + 2 + 4 = 7 (phần)", "Let the third number be 1 part. Then the second number is 2 parts and the first number is 4 parts: altogether 1 + 2 + 4 = 7 (parts)"), 7), st(LT("Số thứ ba: 105 : 7 = 15", "Third number: 105 ÷ 7 = 15"), 15)],
   tip: LT("Biết trung bình cộng thì tìm tổng trước, rồi chia tổng thành các phần.", "If you know the average, find the sum first, then split the sum into parts.")
  }, {
   q: TT + LT("An có 18 viên bi, Bình có 16 viên bi. Hùng có nhiều hơn số trung bình cộng số bi của An và Bình 6 viên. Dũng có số bi bằng số trung bình cộng số bi của cả 4 bạn. Hỏi Dũng có bao nhiêu viên bi?", "An has 18 marbles, Bình has 16 marbles. Hùng has 6 more marbles than the average of An's and Bình's marbles. Dũng has the same number of marbles as the average of all 4 friends. How many marbles does Dũng have?"),
   parts: [num("Dũng", 19, LT("viên", "marbles"))],
   steps: [st(LT("Số trung bình cộng số bi của An và Bình: (18 + 16) : 2 = 17 (viên)", "Average of An's and Bình's marbles: (18 + 16) ÷ 2 = 17 (marbles)"), 17), st(LT("Hùng có: 17 + 6 = 23 (viên)", "Hùng has: 17 + 6 = 23 (marbles)"), 23), st(LT("Ba bạn An, Bình, Hùng có: 18 + 16 + 23 = 57 (viên)", "An, Bình, and Hùng together have: 18 + 16 + 23 = 57 (marbles)"), 57), st(LT("Dũng bằng số trung bình cộng của 4 bạn nên tổng 4 bạn gấp 4 lần số bi của Dũng, vậy 3 bạn còn lại có số bi gấp 3 lần số bi của Dũng. Dũng có: 57 : 3 = 19 (viên)", "Dũng's number equals the average of the 4 friends, so the total of the 4 friends is 4 times Dũng's marbles, which means the other 3 friends have 3 times as many marbles as Dũng. Dũng has: 57 ÷ 3 = 19 (marbles)"), 19)],
   tip: LT("Số bằng trung bình cộng của cả nhóm (có chính nó) thì cũng bằng trung bình cộng của các số còn lại.", "A number equal to the average of the whole group (including itself) is also equal to the average of the other numbers.")
  }, {
   q: TT + LT("Lân có 20 viên bi. Long có số bi bằng một nửa số bi của Lân. Quý có nhiều hơn số trung bình cộng số bi của cả ba bạn 6 viên. Hỏi Quý có bao nhiêu viên bi?", "Lân has 20 marbles. Long has half as many marbles as Lân. Quý has 6 more marbles than the average of all three friends' marbles. How many marbles does Quý have?"),
   parts: [num("Quý", 24, LT("viên", "marbles"))],
   steps: [st(LT("Long có: 20 : 2 = 10 (viên); Lân và Long có: 20 + 10 = 30 (viên)", "Long has: 20 ÷ 2 = 10 (marbles); Lân and Long together have: 20 + 10 = 30 (marbles)"), 30), st(LT("Tổng số bi của 3 bạn gấp 3 lần số trung bình cộng, mà Quý = số trung bình cộng + 6. Nên 30 + (số trung bình cộng + 6) = 3 lần số trung bình cộng, suy ra 2 lần số trung bình cộng = 30 + 6 = 36", "The total of the 3 friends' marbles is 3 times the average, and Quý = the average + 6. So 30 + (the average + 6) = 3 times the average, which means 2 times the average = 30 + 6 = 36"), 36), st(LT("Số trung bình cộng: 36 : 2 = 18 (viên)", "Average: 36 ÷ 2 = 18 (marbles)"), 18), st(LT("Quý có: 18 + 6 = 24 (viên)", "Quý has: 18 + 6 = 24 (marbles)"), 24)],
   tip: LT("Viết tổng của 3 bạn theo số trung bình cộng.", "Write the total of the 3 friends in terms of the average.")
  }, {
   q: TT + LT("Trung bình cộng của 3 số bằng 24. Trung bình cộng của số thứ nhất và số thứ hai là 21, của số thứ hai và số thứ ba là 26. Tìm số lớn nhất.", "The average of 3 numbers is 24. The average of the first and second numbers is 21, and the average of the second and third numbers is 26. Find the largest number."),
   parts: [num(LT("Số lớn nhất", "Largest number"), 30)],
   steps: [st(LT("Tổng ba số: 24 × 3 = 72", "Sum of the three numbers: 24 × 3 = 72"), 72), st(LT("Tổng số thứ nhất và số thứ hai: 21 × 2 = 42; số thứ ba: 72 − 42 = 30", "Sum of the first and second numbers: 21 × 2 = 42; third number: 72 − 42 = 30"), 30), st(LT("Tổng số thứ hai và số thứ ba: 26 × 2 = 52; số thứ nhất: 72 − 52 = 20", "Sum of the second and third numbers: 26 × 2 = 52; first number: 72 − 52 = 20"), 20), st(LT("Số thứ hai: 42 − 20 = 22. Số lớn nhất là 30", "Second number: 42 − 20 = 22. The largest number is 30"), 30)],
   tip: LT("Biết trung bình cộng của hai số thì tìm tổng của hai số đó.", "If you know the average of two numbers, find the sum of those two numbers.")
  }, {
   q: TT + LT("Trung bình cộng của hai số là 57. Nếu gấp số thứ hai lên 3 lần thì trung bình cộng của chúng là 105. Tìm hai số.", "The average of two numbers is 57. If the second number is tripled, the average of the two numbers becomes 105. Find the two numbers."),
   parts: [num(LT("Số thứ nhất", "First number"), 66), num(LT("Số thứ hai", "Second number"), 48)],
   steps: [st(LT("Tổng ban đầu: 57 × 2 = 114", "Original sum: 57 × 2 = 114"), 114), st(LT("Tổng mới: 105 × 2 = 210", "New sum: 105 × 2 = 210"), 210), st(LT("Gấp số thứ hai lên 3 lần tức là thêm 2 lần số thứ hai: 210 − 114 = 96; số thứ hai: 96 : 2 = 48", "Tripling the second number means adding 2 more times the second number: 210 − 114 = 96; second number: 96 ÷ 2 = 48"), 48), st(LT("Số thứ nhất: 114 − 48 = 66", "First number: 114 − 48 = 66"), 66)],
   tip: LT("So sánh tổng cũ và tổng mới để biết số thứ hai được thêm bao nhiêu.", "Compare the old sum and the new sum to see how much was added to the second number.")
  }];
  LESSON({
   id: "avg",
   reg: "toan",
   title: LT("Trung bình cộng", "Average (Mean)"),
   emoji: "⚖️",
   blurb: LT("San đều để tìm số trung bình", "Leveling out to find the average"),
   links: ["div"],
   rule: {
    h: LT("Quy tắc", "Rule"),
    items: [LT("Muốn tìm **số trung bình cộng** của nhiều số, ta tính tổng các số đó rồi **chia cho số các số hạng**.", "To find the **average (mean)** of several numbers, add them all up and then **divide by how many numbers there are**."), LT("Biết số trung bình cộng thì **tổng = số trung bình cộng × số các số hạng**.", "If you know the average, then **total = average × how many numbers**.")]
   },
   figs: {
    a: () => FB.water([6, 2, 4], ["An", "Bình", "Chi"], LT("quả", "oranges"))
   },
   teach: [{
    key: "a",
    f: 0,
    say: LT("An có 6 quả cam, Bình có 2, Chi có 4. Nếu chia đều thì mỗi bạn được bao nhiêu quả?", "An has 6 oranges, Bình has 2, and Chi has 4. If they share equally, how many does each friend get?")
   }, {
    key: "a",
    f: 1,
    say: LT("Gộp lại trước: 6 + 2 + 4 = **12 quả**.", "Combine them first: 6 + 2 + 4 = **12 oranges**.")
   }, {
    key: "a",
    f: 2,
    say: LT("Rồi chia đều cho 3 bạn: 12 : 3 = **4 quả**. Số 4 là **số trung bình cộng** của 6; 2 và 4: lấy tổng chia cho số các số hạng (3). Giống như nước ở các cột tự san bằng nhau!", "Then share equally among 3 friends: 12 ÷ 3 = **4 oranges**. The number 4 is the **average (mean)** of 6, 2, and 4: add them up and divide by how many numbers there are (3). It is like the water in the columns leveling out!")
   }, {
    key: "a",
    f: 2,
    say: LT("Chiều ngược lại: số trung bình cộng của 3 bạn là 4 quả → cả 3 bạn có **4 × 3 = 12 quả**.", "Going the other way: if the average of 3 friends is 4 oranges, then together they have **4 × 3 = 12 oranges**.")
   }],
   gen(tier, r) {
    if (tier === 1) {
     let m = rd(r, 10, 60), a, b, c, g1 = 0;
     do { a = rd(r, m - 8, m + 8); b = rd(r, m - 8, m + 8); c = 3 * m - a - b; g1++; } while ((c < 1 || c < m - 8 || c > m + 8 || c === a || c === b || a === b) && g1 < 60);
     return QQ({
      q: LT("Tìm số trung bình cộng của các số: **" + a + "; " + b + "; " + c + "**", "Find the average (mean) of these numbers: **" + a + "; " + b + "; " + c + "**"),
      parts: [num("", m)],
      steps: [st(LT("Tổng: " + a + " + " + b + " + " + c + " = " + 3 * m, "Sum: " + a + " + " + b + " + " + c + " = " + 3 * m), 3 * m), st(LT("Chia cho số các số hạng: " + 3 * m + " : 3 = " + m, "Divide by how many numbers there are: " + 3 * m + " ÷ 3 = " + m), m)],
      diag: DG.avg(3 * m, LT("Con mới tính tổng. Trung bình cộng còn phải chia tổng cho số các số (ở đây là 3).", "You only found the sum. To get the average, you still need to divide the sum by how many numbers there are (here, 3).")),
      tip: LT("Cộng các số lại, rồi chia tổng cho số các số.", "Add the numbers up, then divide the sum by how many numbers there are."),
      hintFig: {
       fb: FB.water([a, b, c], [LT("Số 1", "Number 1"), LT("Số 2", "Number 2"), LT("Số 3", "Number 3")], ""),
       f: 1
      }
     })
    }
    if (tier === 2) {
     let m = rd(r, 20, 80),
      a = rd(r, m - 10, m + 10),
      b = rd(r, m - 10, m + 10),
      c = rd(r, m - 10, m + 10),
      x = 4 * m - a - b - c;
     return x < 1 ? AVG_RETRY(r) : QQ({
      q: LT("Trung bình cộng của 4 số là **" + m + "**. Ba số đầu là **" + a + "; " + b + "; " + c + "**. Tìm số thứ tư.", "The average of 4 numbers is **" + m + "**. The first three numbers are **" + a + "; " + b + "; " + c + "**. Find the fourth number."),
      parts: [num(LT("Số thứ tư", "Fourth number"), x)],
      steps: [st(LT("Tổng 4 số: " + m + " × 4 = " + 4 * m, "Sum of the 4 numbers: " + m + " × 4 = " + 4 * m), 4 * m), st(LT("Số thứ tư: " + 4 * m + " − " + a + " − " + b + " − " + c + " = " + x, "Fourth number: " + 4 * m + " − " + a + " − " + b + " − " + c + " = " + x), x)],
      tip: LT("Biết trung bình thì tìm tổng trước.", "If you know the average, find the sum first."),
      diag: DG.avg(4 * m, LT("Đó là tổng của cả 4 số. Số thứ tư = tổng − ba số đã biết.", "That is the sum of all 4 numbers. Fourth number = sum − the three known numbers."))
     })
    }
    return QQ(r.pick(AVG_HARD))
   }
  });
  addAsks("avg", [{
   after: 0,
   say: LT("Cùng làm: gộp ba bạn lại, 6 + 2 + 4 = ?", "Let's try it: put the three friends' oranges together, 6 + 2 + 4 = ?"),
   opts: ["11", "12", "13"],
   ans: "12",
   good: LT("Đúng! Tổng là 12 quả.", "Correct! The sum is 12 oranges.")
  }, {
   after: 1,
   say: LT("Cùng làm: chia đều 12 quả cho 3 bạn, mỗi bạn được?", "Let's try it: share 12 oranges equally among 3 friends. How many does each friend get?"),
   opts: ["3", "4", "6"],
   ans: "4",
   good: LT("Đúng! Trung bình cộng là 4.", "Correct! The average is 4.")
  }]);

  function AVG_RETRY(r) {
   return QQ({
    q: LT("Trung bình cộng của 4 số là **40**. Ba số đầu là **38; 44; 41**. Tìm số thứ tư.", "The average of 4 numbers is **40**. The first three numbers are **38; 44; 41**. Find the fourth number."),
    parts: [num(LT("Số thứ tư", "Fourth number"), 37)],
    steps: [st(LT("Tổng 4 số: 40 × 4 = 160", "Sum of the 4 numbers: 40 × 4 = 160"), 160), st(LT("Số thứ tư: 160 − 38 − 44 − 41 = 37", "Fourth number: 160 − 38 − 44 − 41 = 37"), 37)],
    tip: LT("Biết trung bình thì tìm tổng trước.", "If you know the average, find the sum first."),
    diag: DG.avg(160, LT("Đó là tổng của cả 4 số. Số thứ tư = tổng − ba số đã biết.", "That is the sum of all 4 numbers. Fourth number = sum − the three known numbers."))
   })
  }
  AVG_HARD.push({
   q: TT + LT("Tìm số trung bình cộng của các số: 1; 2; 3; 4; 5; ...; 2 014; 2 015.", "Find the average of these numbers: 1; 2; 3; 4; 5; ...; 2,014; 2,015."),
   parts: [num("", 1008)],
   steps: [st(LT("Các số cách đều nhau: số trung bình cộng = (số đầu + số cuối) : 2 (cặp số đầu và số cuối, cặp số thứ hai và số kề cuối... đều có tổng bằng nhau, nên trung bình cộng bằng tổng một cặp chia 2)", "The numbers are evenly spaced: average = (first number + last number) ÷ 2 (the first and last numbers, the second and second-to-last numbers, and so on all have the same sum, so the average is the sum of one pair divided by 2)")), st(LT("(1 + 2 015) : 2 = 2 016 : 2 = 1 008", "(1 + 2,015) ÷ 2 = 2,016 ÷ 2 = 1,008"), 1008)],
   tip: LT('Số đầu và số cuối "san" cho nhau.', 'The first and last numbers "even out" each other.')
  }, {
   q: TT + LT("Tìm số trung bình cộng của các số: 5; 10; 15; 20; ...; 2 000; 2 005.", "Find the average of these numbers: 5; 10; 15; 20; ...; 2,000; 2,005."),
   parts: [num("", 1005)],
   steps: [st(LT("Các số cách đều nhau: số trung bình cộng = (số đầu + số cuối) : 2 (cặp số đầu và số cuối, cặp số thứ hai và số kề cuối... đều có tổng bằng nhau, nên trung bình cộng bằng tổng một cặp chia 2)", "The numbers are evenly spaced: average = (first number + last number) ÷ 2 (the first and last numbers, the second and second-to-last numbers, and so on all have the same sum, so the average is the sum of one pair divided by 2)")), st(LT("(5 + 2 005) : 2 = 2 010 : 2 = 1 005", "(5 + 2,005) ÷ 2 = 2,010 ÷ 2 = 1,005"), 1005)],
   tip: LT('Số đầu và số cuối "san" cho nhau.', 'The first and last numbers "even out" each other.')
  });
  extendTier("avg", 3, [r => {
   let n = rd(r, 25, 35),
    s = rd(r, 9, 10),
    A = s + 1,
    T = A + n;
   return QQ({
    q: LT("Tuổi trung bình của **" + n + " học sinh** lớp 4 là **" + s + " tuổi**. Nếu tính cả cô giáo thì tuổi trung bình là **" + A + " tuổi**. Hỏi cô giáo bao nhiêu tuổi?", "The average age of **" + n + " students** in a fourth-grade class is **" + s + " years old**. If we count the teacher too, the average age is **" + A + " years old**. How old is the teacher?"),
    parts: [num(LT("Tuổi cô", "Teacher's age"), T, LT("tuổi", "years"))],
    steps: [st(LT("Tổng số tuổi của " + (n + 1) + " người: " + A + " × " + (n + 1) + " = " + A * (n + 1) + " (tuổi)", "Total age of " + (n + 1) + " people: " + A + " × " + (n + 1) + " = " + A * (n + 1) + " (years)"), A * (n + 1)), st(LT("Tổng số tuổi của " + n + " học sinh: " + s + " × " + n + " = " + s * n + " (tuổi)", "Total age of " + n + " students: " + s + " × " + n + " = " + s * n + " (years)"), s * n), st(LT("Tuổi cô: " + A * (n + 1) + " − " + s * n + " = " + T + " (tuổi)", "Teacher's age: " + A * (n + 1) + " − " + s * n + " = " + T + " (years)"), T)],
    diag: DG.step([A * (n + 1), s * n], LT("Còn một bước: lấy tổng tuổi cả lớp có cô trừ tổng tuổi học sinh.", "One step left: subtract the students' total age from the total age of the class with the teacher.")),
    tip: LT("Tổng số tuổi = tuổi trung bình × số người. Tính tổng hai lần rồi trừ.", "Total age = average age × number of people. Find the total twice, then subtract.")
   })
  }, r => {
   let f = rd(r, 1, 25),
    d = rd(r, 2, 9),
    c = rd(r, 6, 16);
   if (d * (c - 1) % 2) return byId("avg").gen(3, r);
   let last = f + d * (c - 1),
    ans = (f + last) / 2;
   return QQ({
    q: TT + LT("Tìm số trung bình cộng của dãy số cách đều: **" + f + "; " + (f + d) + "; " + (f + 2 * d) + "; …; " + last + "** (có " + c + " số).", "Find the average of this evenly spaced list of numbers: **" + f + "; " + (f + d) + "; " + (f + 2 * d) + "; …; " + last + "** (" + c + " numbers in all)."),
    parts: [num("", ans)],
    steps: [st(LT("Dãy cách đều: số trung bình cộng = (số đầu + số cuối) : 2 (các cặp số đầu – số cuối, số thứ hai – số kề cuối... đều có tổng bằng nhau)", "Evenly spaced list: average = (first number + last number) ÷ 2 (the first and last numbers, the second and second-to-last numbers, and so on all have the same sum)")), st(LT("(" + f + " + " + last + ") : 2 = " + (f + last) + " : 2 = " + ans, "(" + f + " + " + last + ") ÷ 2 = " + (f + last) + " ÷ 2 = " + ans), ans)],
    diag: DG.avg(f + last, LT("Đó là tổng số đầu và số cuối. Còn phải chia 2.", "That is the sum of the first and last numbers. You still need to divide by 2.")),
    tip: LT('Số đầu và số cuối "san" cho nhau.', 'The first and last numbers "even out" each other.')
   })
  }, r => {
   let m = rd(r, 20, 90),
    D = 2 * rd(r, 2, Math.min(20, m - 5)),
    a = m + D / 2,
    b = m - D / 2;
   return QQ({
    q: LT("Trung bình cộng của hai số là **" + m + "**. Số lớn hơn số bé **" + D + "** đơn vị. Tìm hai số.", "The average of two numbers is **" + m + "**. The larger number is **" + D + "** more than the smaller number. Find the two numbers."),
    parts: [num(LT("Số lớn", "Larger number"), a), num(LT("Số bé", "Smaller number"), b)],
    steps: [st(LT("Tổng hai số: " + m + " × 2 = " + 2 * m, "Sum of the two numbers: " + m + " × 2 = " + 2 * m), 2 * m), st(LT("Số lớn: (" + 2 * m + " + " + D + ") : 2 = " + a, "Larger number: (" + 2 * m + " + " + D + ") ÷ 2 = " + a), a), st(LT("Số bé: " + 2 * m + " − " + a + " = " + b, "Smaller number: " + 2 * m + " − " + a + " = " + b), b)],
    diag: DG.sd(2 * m, D, a, b),
    hintFig: {
     fb: SDfig(2 * m, D, a, b, 3),
     f: 0
    },
    tip: LT("Từ trung bình cộng tìm tổng, rồi giải bài tổng – hiệu.", "Use the average to find the sum, then solve it as a sum-and-difference problem.")
   })
  }, r => {
   let a, b, c, g = 0;
   do {
    a = rd(r, 12, 60), b = rd(r, 12, 60), c = rd(r, 12, 60), g++
   } while ((((a + b + c) % 3 || (a + b) % 2 || (b + c) % 2 || a === b || b === c || a === c || Math.max(a, b, c) === Math.min(a, b, c))) && g < 400);
   if ((a + b + c) % 3 || (a + b) % 2 || (b + c) % 2) a = 30, b = 22, c = 20;
   let m = (a + b + c) / 3,
    sab = (a + b) / 2,
    sbc = (b + c) / 2,
    top = Math.max(a, b, c);
   return QQ({
    q: TT + LT("Trung bình cộng của 3 số bằng " + m + ". Trung bình cộng của số thứ nhất và số thứ hai là " + sab + ", của số thứ hai và số thứ ba là " + sbc + ". Tìm số lớn nhất.", "The average of 3 numbers is " + m + ". The average of the first and second numbers is " + sab + ", and the average of the second and third numbers is " + sbc + ". Find the largest number."),
    parts: [num(LT("Số lớn nhất", "Largest number"), top)],
    steps: [st(LT("Tổng ba số: " + m + " × 3 = " + 3 * m, "Sum of the three numbers: " + m + " × 3 = " + 3 * m), 3 * m), st(LT("Tổng số thứ nhất và số thứ hai: " + sab + " × 2 = " + 2 * sab + "; số thứ ba: " + 3 * m + " − " + 2 * sab + " = " + c, "Sum of the first and second numbers: " + sab + " × 2 = " + 2 * sab + "; third number: " + 3 * m + " − " + 2 * sab + " = " + c), c), st(LT("Tổng số thứ hai và số thứ ba: " + sbc + " × 2 = " + 2 * sbc + "; số thứ nhất: " + 3 * m + " − " + 2 * sbc + " = " + a, "Sum of the second and third numbers: " + sbc + " × 2 = " + 2 * sbc + "; first number: " + 3 * m + " − " + 2 * sbc + " = " + a), a), st(LT("Số thứ hai: " + 2 * sab + " − " + a + " = " + b + ". Số lớn nhất là " + top, "Second number: " + 2 * sab + " − " + a + " = " + b + ". The largest number is " + top), top)],
    tip: LT("Biết trung bình cộng của hai số thì tìm tổng của hai số đó.", "If you know the average of two numbers, find the sum of those two numbers.")
   })
  }, r => {
   let x = rd(r, 12, 40),
    y = x + 2 * rd(r, 1, 8),
    s2 = (x + y) / 2,
    d = 3 * rd(r, 1, 5),
    C = s2 + d,
    D = s2 + d / 3,
    nm = r.pick([["An", "Bình", "Hùng", "Dũng"], ["Lân", "Long", "Quý", "Hà"]]);
   return QQ({
    q: TT + LT(nm[0] + " có " + x + " viên bi, " + nm[1] + " có " + y + " viên bi. " + nm[2] + " có nhiều hơn số trung bình cộng số bi của " + nm[0] + " và " + nm[1] + " " + d + " viên bi. " + nm[3] + " có số bi bằng số trung bình cộng số bi của cả 4 bạn. Hỏi " + nm[3] + " có bao nhiêu viên bi?", nm[0] + " has " + x + " marbles, " + nm[1] + " has " + y + " marbles. " + nm[2] + " has " + d + " more marbles than the average of " + nm[0] + "'s and " + nm[1] + "'s marbles. " + nm[3] + " has the same number of marbles as the average of all 4 friends. How many marbles does " + nm[3] + " have?"),
    parts: [num(nm[3], D, LT("viên", "marbles"))],
    steps: [st(LT("Số trung bình cộng số bi của " + nm[0] + " và " + nm[1] + ": (" + x + " + " + y + ") : 2 = " + s2 + " (viên)", "Average of " + nm[0] + "'s and " + nm[1] + "'s marbles: (" + x + " + " + y + ") ÷ 2 = " + s2 + " (marbles)"), s2), st(LT(nm[2] + " có: " + s2 + " + " + d + " = " + C + " (viên)", nm[2] + " has: " + s2 + " + " + d + " = " + C + " (marbles)"), C), st(LT("Ba bạn " + nm[0] + ", " + nm[1] + ", " + nm[2] + " có: " + x + " + " + y + " + " + C + " = " + (x + y + C) + " (viên)", nm[0] + ", " + nm[1] + ", and " + nm[2] + " together have: " + x + " + " + y + " + " + C + " = " + (x + y + C) + " (marbles)"), x + y + C), st(LT(nm[3] + " bằng số trung bình cộng của 4 bạn nên 3 bạn còn lại có số bi gấp 3 lần số bi của " + nm[3] + ". " + nm[3] + " có: " + (x + y + C) + " : 3 = " + D + " (viên)", nm[3] + "'s number equals the average of the 4 friends, so the other 3 friends have 3 times as many marbles as " + nm[3] + ". " + nm[3] + " has: " + (x + y + C) + " ÷ 3 = " + D + " (marbles)"), D)],
    tip: LT("Số bằng trung bình cộng của cả nhóm (có chính nó) thì cũng bằng trung bình cộng của các số còn lại.", "A number equal to the average of the whole group (including itself) is also equal to the average of the other numbers.")
   })
  }], !0);

  function unitFig(n, per, m, T, it, hide) {
   it = it || LT("phần", "parts");
   let mx = Math.max(n, m),
    sw = (360 - 134 - 94) / mx,
    lab = v => hide ? sw < 18 ? "" : "?" : sw < String(v).length * 11 + 8 ? "" : fmt(v),
    row = (k, c, v) => Array.from({
     length: k
    }, () => ({
     u: 1,
     c,
     t: v
    })),
    r0q = {
     lab: n + " " + it,
     segs: row(n, "blue", sw < 18 ? "" : "?")
    },
    r0 = hide ? r0q : {
     lab: n + " " + it,
     segs: row(n, "blue", lab(per))
    },
    r1 = {
     lab: m + " " + it,
     segs: row(m, "green", lab(per))
    },
    b0 = {
     r1: 0,
     r2: 0,
     t: fmt(T),
     c: "red"
    };
   return FB.bars([{
    rows: [r0q],
    br: [b0]
   }, {
    rows: [r0],
    br: [b0]
   }, {
    rows: [r0, r1],
    br: [b0, {
     r1: 1,
     r2: 1,
     t: "?",
     c: "red"
    }]
   }, {
    rows: [r0, r1],
    br: [b0, {
     r1: 1,
     r2: 1,
     t: fmt(per * m),
     c: "okc"
    }]
   }], {
    left: 134,
    right: 94
   })
  }
  var UNIT_CTX4 = [{
   it: LT("hộp", "boxes"), one: LT("hộp", "box"),
   full: LT("hộp bút", "pen boxes"),
   th: LT("cái bút", "pens"),
   thq: LT("cái bút", "pens"),
   u: LT("cái", "pens"),
   v: LT("có tất cả", "hold"),
   dv: LT("thì xếp được bao nhiêu hộp như thế", "how many such boxes can be filled"),
   p: [
    [10, 12, 1],
    [10, 12, 1],
    [10, 12, 1]
   ]
  }, {
   it: LT("bao", "bags"), one: LT("bao", "bag"),
   full: LT("bao gạo", "rice bags"),
   th: LT("kg gạo", "kg of rice"),
   thq: LT("ki-lô-gam gạo", "kilograms of rice"),
   u: LT("kg", "kg"),
   v: LT("chứa", "hold"),
   dv: LT("thì đóng được bao nhiêu bao như thế", "how many such bags can be filled"),
   p: [
    [5, 12, 1],
    [12, 50, 1],
    [25, 50, 1]
   ]
  }, {
   it: LT("can", "cans"), one: LT("can", "can"),
   full: LT("can dầu", "oil cans"),
   th: LT("l dầu", "liters of oil"),
   thq: LT("lít dầu", "liters of oil"),
   u: LT("l", "L"),
   v: LT("chứa", "hold"),
   dv: LT("thì đổ đầy được bao nhiêu can như thế", "how many such cans can be filled"),
   p: [
    [2, 10, 1],
    [5, 20, 1],
    [10, 20, 1]
   ]
  }, {
   it: LT("thùng phuy", "drums"), one: LT("thùng phuy", "drum"),
   full: LT("thùng phuy", "oil drums"),
   th: LT("l dầu", "liters of oil"),
   thq: LT("lít dầu", "liters of oil"),
   u: LT("l", "L"),
   v: LT("chứa", "hold"),
   dv: LT("thì đổ đầy được bao nhiêu thùng phuy như thế", "how many such drums can be filled"),
   p: [null, [15, 22, 10],
    [18, 22, 10]
   ]
  }, {
   it: LT("xe", "trucks"), one: LT("xe", "truck"),
   full: LT("xe tải", "trucks"),
   th: LT("viên gạch", "bricks"),
   thq: LT("viên gạch", "bricks"),
   u: LT("viên", "bricks"),
   v: LT("chở được", "carry"),
   dv: LT("thì cần bao nhiêu xe như thế để chở hết", "how many such trucks are needed to carry them all"),
   p: [null, [3, 15, 100],
    [12, 30, 100]
   ]
  }, {
   it: LT("giỏ", "baskets"), one: LT("giỏ", "basket"),
   full: LT("giỏ cam", "orange baskets"),
   th: LT("quả cam", "oranges"),
   thq: LT("quả cam", "oranges"),
   u: LT("quả", "oranges"),
   v: LT("có tất cả", "hold"),
   dv: LT("thì xếp được bao nhiêu giỏ như thế", "how many such baskets can be filled"),
   p: [
    [5, 12, 1],
    [12, 30, 1],
    [15, 40, 1]
   ]
  }, {
   it: LT("túi", "bags"), one: LT("túi", "bag"),
   full: LT("túi kẹo", "candy bags"),
   th: LT("cái kẹo", "candies"),
   thq: LT("cái kẹo", "candies"),
   u: LT("cái", "candies"),
   v: LT("có tất cả", "hold"),
   dv: LT("thì đóng được bao nhiêu túi như thế", "how many such bags can be filled"),
   p: [
    [5, 12, 1],
    [12, 40, 1],
    [20, 50, 1]
   ]
  }, {
   it: LT("thùng", "crates"), one: LT("thùng", "crate"),
   full: LT("thùng nước", "water crates"),
   th: LT("chai nước", "bottles of water"),
   thq: LT("chai nước", "bottles of water"),
   u: LT("chai", "bottles"),
   v: LT("có tất cả", "hold"),
   dv: LT("thì xếp được bao nhiêu thùng như thế", "how many such crates can be filled"),
   p: [
    [6, 12, 1],
    [1, 2, 12],
    [24, 24, 1]
   ]
  }];

  function unitPer(r, c, tier) {
   let p = c.p[tier - 1];
   return rd(r, p[0], p[1]) * p[2]
  }

  function unitMul(r, tier, nr, mr) {
   let c = r.pick(UNIT_CTX4.filter(x => x.p[tier - 1])),
    per = unitPer(r, c, tier),
    n = rd(r, nr[0], nr[1]),
    m = rd(r, mr[0], mr[1]);
   m === n && m++;
   let T = n * per;
   return QQ({
    q: LT("**" + n + " " + c.full + "** như nhau " + c.v + " **" + fmt(T) + " " + c.th + "**. Hỏi **" + m + " " + c.it + "** như thế " + c.v + " bao nhiêu " + c.thq + "?", "**" + n + " identical " + c.full + "** " + c.v + " **" + fmt(T) + " " + c.th + "** in all. How many " + c.thq + " do **" + m + " such " + c.it + "** " + c.v + "?"),
    parts: [num("", per * m, c.u)],
    steps: [st(LT("Mỗi " + c.it + ": " + fmt(T) + " : " + n + " = " + fmt(per) + " (" + c.u + ")", "Each " + c.one + ": " + fmt(T) + " ÷ " + n + " = " + fmt(per) + " (" + c.u + ")"), per), st(m + " " + c.it + ": " + fmt(per) + " × " + m + " = " + fmt(per * m) + " (" + c.u + ")", per * m)],
    diag: DG.step([per], LT("Con mới tìm được một " + c.it + ". Bước 2: nhân với số " + c.it + " đề hỏi.", "You only found the amount in one " + c.one + ". Step 2: multiply by the number of " + c.it + " in the question.")),
    hintFig: {
     fb: unitFig(n, per, m, T, c.it, !0),
     f: 2
    },
    tip: LT("Tìm một " + c.it + " trước (phép chia), rồi tìm " + m + " " + c.it + " (phép nhân).", "First find one " + c.one + " (division), then find " + m + " " + c.it + " (multiplication).")
   })
  }

  function cancelZ(Y, per, L) {
   let z = 0,
    a = Y,
    b = per;
   for (; b % 10 === 0 && a % 10 === 0;) a /= 10, b /= 10, z++;
   return z ? L === "vi" ? " = " + fmt(a) + " : " + fmt(b) + " (cùng bớt " + z + " chữ số 0)" : " = " + fmt(a) + " ÷ " + fmt(b) + " (remove " + z + (z === 1 ? " zero" : " zeros") + " from both)" : ""
  }

  function unitDiv(r, tier, nr, mr) {
   let c = r.pick(UNIT_CTX4.filter(x => x.p[tier - 1])),
    per = unitPer(r, c, tier),
    n = rd(r, nr[0], nr[1]),
    m = rd(r, mr[0], mr[1]);
   m === n && m++;
   let T = n * per,
    Y = per * m;
   return QQ({
    q: LT("**" + n + " " + c.full + "** như nhau " + c.v + " **" + fmt(T) + " " + c.th + "**. Có **" + fmt(Y) + " " + c.th + "** " + c.dv + "?", "**" + n + " identical " + c.full + "** " + c.v + " **" + fmt(T) + " " + c.th + "** in all. If there are **" + fmt(Y) + " " + c.th + "**, " + c.dv + "?"),
    parts: [num("", m, c.it)],
    steps: [st(LT("Mỗi " + c.it + ": " + fmt(T) + " : " + n + " = " + fmt(per) + " (" + c.u + ")", "Each " + c.one + ": " + fmt(T) + " ÷ " + n + " = " + fmt(per) + " (" + c.u + ")"), per), st(LT("Số " + c.it + ": " + fmt(Y) + " : " + fmt(per) + cancelZ(Y, per, "vi") + " = " + m + " (" + c.it + ")", "Number of " + c.it + ": " + fmt(Y) + " ÷ " + fmt(per) + cancelZ(Y, per, "en") + " = " + m + " (" + c.it + ")"), m)],
    diag: DG.step([per], LT("Con mới tìm được một " + c.it + ". Bước 2: lấy " + fmt(Y) + " chia cho số " + c.u + " trong một " + c.it + ".", "You only found the amount in one " + c.one + ". Step 2: divide " + fmt(Y) + " by the amount in one " + c.one + ".")),
    tip: LT("Bước 2 lần này là phép chia: tìm xem " + fmt(Y) + " gồm mấy lần số trong một " + c.it + ".", "Step 2 this time is division: find how many times the amount in one " + c.one + " fits into " + fmt(Y) + ".")
   })
  }
  LESSON({
   id: "unit",
   reg: "toan",
   title: LT("Rút về đơn vị", "Find the Unit Value"),
   emoji: "📦",
   blurb: LT("Tìm một phần trước, rồi nhiều phần", "Find one part first, then many parts"),
   links: ["div"],
   rule: {
    h: LT("Hai bước", "Two steps"),
    items: [LT("Bước 1 – **rút về đơn vị**: tìm giá trị của **một phần** (phép chia).", "Step 1 – **find the unit value**: find the value of **one part** (division)."), LT("Bước 2: tìm giá trị của **nhiều phần** (phép nhân), hoặc tìm **số phần** (phép chia).", "Step 2: find the value of **several parts** (multiplication), or find **how many parts** (division).")]
   },
   figs: {
    a: () => unitFig(4, 6, 7, 24, LT("hộp", "boxes")),
    b: () => unitFig(4, 27, 6, 108, LT("bao", "bags"))
   },
   teach: [{
    key: "a",
    f: 0,
    say: LT("**4 hộp bút** như nhau có tất cả **24** cái bút. Hỏi **7 hộp** như thế có bao nhiêu cái bút?", "**4 identical pen boxes** hold **24** pens in all. How many pens do **7 such boxes** hold?")
   }, {
    key: "a",
    f: 1,
    say: LT("Bước 1 – **rút về đơn vị**: tìm số bút trong **một hộp**: 24 : 4 = **6** (cái).", "Step 1 – **find the unit value**: find the number of pens in **one box**: 24 ÷ 4 = **6** (pens).")
   }, {
    key: "a",
    f: 2,
    say: LT("Cùng làm: 7 hộp, mỗi hộp 6 cái. Có tất cả bao nhiêu cái?", "Let's try it: 7 boxes, 6 pens in each box. How many pens are there in all?"),
    ask: {
     opts: ["13", "42", "28"],
     ans: "42",
     good: LT("Đúng! 6 × 7 = 42.", "Correct! 6 × 7 = 42.")
    }
   }, {
    key: "a",
    f: 3,
    say: LT("Bước 2: 7 hộp có 6 × 7 = **42** (cái bút). Luôn tìm **một phần** trước nhé!", "Step 2: 7 boxes have 6 × 7 = **42** (pens). Always find **one part** first!")
   }, {
    key: "b",
    f: 1,
    say: LT("**Dạng 2**: 4 bao gạo như nhau chứa **108 kg** gạo. Có **162 kg** gạo thì đóng được bao nhiêu bao như thế? Bước 1 vẫn là rút về đơn vị: mỗi bao 108 : 4 = **27** (kg).", "**Type 2**: 4 identical bags of rice hold **108 kg** of rice. If there are **162 kg** of rice, how many such bags can be filled? Step 1 is still finding the unit value: each bag holds 108 ÷ 4 = **27** (kg).")
   }, {
    key: "b",
    f: 3,
    say: LT("Bước 2 lần này là **phép chia**: mỗi bao 27 kg; có 162 kg thì đóng được 162 : 27 = **6** (bao).", "Step 2 this time is **division**: each bag holds 27 kg, so 162 kg fills 162 ÷ 27 = **6** (bags).")
   }],
   gen(tier, r) {
    if (tier === 1) return unitMul(r, 1, [2, 6], [2, 9]);
    if (tier === 2) return r.chance(.6) ? unitMul(r, 2, [3, 9], [4, 12]) : unitDiv(r, 2, [3, 9], [4, 12]);
    let k = r.int(0, 4);
    if (k === 0) return unitMul(r, 3, [4, 9], [11, 25]);
    if (k === 1) return unitDiv(r, 3, [4, 9], [11, 25]);
    if (k === 2) {
     let n = rd(r, 3, 8),
      pr = rd(r, 6, 15) * 1e3,
      m = rd(r, 9, 20);
     m === n && m++;
     let T2 = n * pr;
     return r.chance(.5) ? QQ({
      q: LT("Mua **" + n + " quyển vở** như nhau hết **" + fmt(T2) + " đồng**. Hỏi mua **" + m + " quyển vở** như thế hết bao nhiêu tiền?", "Buying **" + n + " identical notebooks** costs **" + fmt(T2) + " dong** in all. How much does it cost to buy **" + m + " such notebooks**?"),
      parts: [num("", pr * m, LT("đồng", "dong"))],
      steps: [st(LT("Mỗi quyển: " + fmt(T2) + " : " + n + " = " + fmt(pr) + " (đồng)", "Each notebook: " + fmt(T2) + " ÷ " + n + " = " + fmt(pr) + " (dong)"), pr), st(LT(m + " quyển: " + fmt(pr) + " × " + m + " = " + fmt(pr * m) + " (đồng)", m + " notebooks: " + fmt(pr) + " × " + m + " = " + fmt(pr * m) + " (dong)"), pr * m)],
      diag: DG.step([pr]),
      tip: LT("Tìm giá tiền một quyển vở trước.", "First find the price of one notebook.")
     }) : QQ({
      q: LT("Mua **" + n + " quyển vở** như nhau hết **" + fmt(T2) + " đồng**. Hỏi có **" + fmt(pr * m) + " đồng** thì mua được bao nhiêu quyển vở như thế?", "Buying **" + n + " identical notebooks** costs **" + fmt(T2) + " dong** in all. If you have **" + fmt(pr * m) + " dong**, how many such notebooks can you buy?"),
      parts: [num("", m, LT("quyển", "notebooks"))],
      steps: [st(LT("Mỗi quyển: " + fmt(T2) + " : " + n + " = " + fmt(pr) + " (đồng)", "Each notebook: " + fmt(T2) + " ÷ " + n + " = " + fmt(pr) + " (dong)"), pr), st(LT("Số quyển: " + fmt(pr * m) + " : " + fmt(pr) + cancelZ(pr * m, pr, "vi") + " = " + m + " (quyển)", "Number of notebooks: " + fmt(pr * m) + " ÷ " + fmt(pr) + cancelZ(pr * m, pr, "en") + " = " + m + " (notebooks)"), m)],
      diag: DG.step([pr]),
      tip: LT("Tìm giá tiền một quyển vở trước, rồi chia.", "First find the price of one notebook, then divide.")
     })
    }
    if (k === 3) {
     let w = rd(r, 3, 8),
      d = rd(r, 2, 6),
      per = rd(r, 8, 25),
      sameW = r.chance(.5),
      W = sameW ? w : rd(r, 3, 9),
      D = sameW ? rd(r, 3, 9) : d;
     sameW && D === d && D++;
     !sameW && W === w && W++;
     let T = w * d * per;
     if (sameW) return QQ({
      q: LT("**" + w + " người thợ** làm trong **" + d + " ngày** được **" + fmt(T) + " sản phẩm**. Hỏi cũng **" + w + " người** đó làm trong **" + D + " ngày** được bao nhiêu sản phẩm? (mỗi ngày làm được số sản phẩm như nhau)", "**" + w + " workers** work for **" + d + " days** and make **" + fmt(T) + " products**. How many products can the same **" + w + " workers** make in **" + D + " days**? (They make the same number of products each day.)"),
      parts: [num("", w * per * D, LT("sản phẩm", "products"))],
      steps: [st(LT("Một ngày " + w + " người làm được: " + fmt(T) + " : " + d + " = " + fmt(w * per) + " (sản phẩm)", "In one day, " + w + " workers make: " + fmt(T) + " ÷ " + d + " = " + fmt(w * per) + " (products)"), w * per), st(LT(D + " ngày: " + fmt(w * per) + " × " + D + " = " + fmt(w * per * D) + " (sản phẩm)", D + " days: " + fmt(w * per) + " × " + D + " = " + fmt(w * per * D) + " (products)"), w * per * D)],
      diag: DG.step([w * per]),
      tip: LT("Số người không đổi: chỉ cần rút về một ngày.", "The number of workers stays the same, so just find the amount for one day.")
     });
     return QQ({
      q: LT("**" + w + " người thợ** cùng làm trong **" + d + " ngày** được **" + fmt(T) + " sản phẩm**. Hỏi **" + W + " người** cũng làm trong **" + d + " ngày** được bao nhiêu sản phẩm? (mỗi người làm được số sản phẩm như nhau)", "**" + w + " workers** work together for **" + d + " days** and make **" + fmt(T) + " products**. How many products can **" + W + " workers** make in **" + d + " days**? (Each worker makes the same number of products.)"),
      parts: [num("", W * per * d, LT("sản phẩm", "products"))],
      steps: [st(LT("Một người làm trong " + d + " ngày: " + fmt(T) + " : " + w + " = " + fmt(d * per) + " (sản phẩm)", "One worker in " + d + " days: " + fmt(T) + " ÷ " + w + " = " + fmt(d * per) + " (products)"), d * per), st(LT(W + " người: " + fmt(d * per) + " × " + W + " = " + fmt(W * d * per) + " (sản phẩm)", W + " workers: " + fmt(d * per) + " × " + W + " = " + fmt(W * d * per) + " (products)"), W * d * per)],
      diag: DG.step([d * per]),
      tip: LT("Số ngày không đổi: chỉ cần rút về một người.", "The number of days stays the same, so just find the amount for one worker.")
     })
    }
    let w = rd(r, 2, 5),
     d = rd(r, 2, 6),
     per = rd(r, 3, 9),
     W = rd(r, 3, 8),
     D = rd(r, 3, 9);
    W === w && W++;
    D === d && D++;
    let T = w * d * per;
    return QQ({
     q: LT("⭐ Thử thách: **" + w + " người thợ** làm trong **" + d + " ngày** được **" + T + " sản phẩm**. Hỏi **" + W + " người** làm trong **" + D + " ngày** được bao nhiêu sản phẩm? (mỗi người mỗi ngày làm được số sản phẩm như nhau)", "⭐ Challenge: **" + w + " workers** work for **" + d + " days** and make **" + T + " products**. How many products can **" + W + " workers** make in **" + D + " days**? (Each worker makes the same number of products each day.)"),
     parts: [num("", per * W * D, LT("sản phẩm", "products"))],
     steps: [st(LT("Một người làm trong " + d + " ngày: " + T + " : " + w + " = " + d * per + " (sản phẩm)", "One worker in " + d + " days: " + T + " ÷ " + w + " = " + d * per + " (products)"), d * per), st(LT("Một người làm trong một ngày: " + d * per + " : " + d + " = " + per + " (sản phẩm)", "One worker in one day: " + d * per + " ÷ " + d + " = " + per + " (products)"), per), st(LT(W + " người làm trong một ngày: " + per + " × " + W + " = " + per * W + " (sản phẩm)", W + " workers in one day: " + per + " × " + W + " = " + per * W + " (products)"), per * W), st(LT(W + " người làm trong " + D + " ngày: " + per * W + " × " + D + " = " + per * W * D + " (sản phẩm)", W + " workers in " + D + " days: " + per * W + " × " + D + " = " + per * W * D + " (products)"), per * W * D)],
     diag: DG.step([per, d * per, per * W, per * D]),
     tip: LT("Rút về một người, rồi một ngày.", "Find the amount for one worker, then for one day.")
    })
   }
  });
  addAsks("unit", [{
   after: 4,
   say: LT("Cùng làm: mỗi bao 27 kg. Có 162 kg gạo thì đóng được mấy bao?", "Let's try it: each bag holds 27 kg. If there are 162 kg of rice, how many bags can be filled?"),
   opts: ["6", "5", "7"],
   ans: "6",
   good: LT("Đúng! 162 : 27 = 6 (bao).", "Correct! 162 ÷ 27 = 6 (bags).")
  }]);
  var SD_HARD = [{
   q: LT("⭐ Thử thách: Hai bao gạo cân nặng tổng cộng 147 kg. Nếu lấy ra 5 kg gạo ở bao thứ nhất và 22 kg gạo ở bao thứ hai thì số gạo còn lại ở hai bao bằng nhau. Hỏi lúc đầu mỗi bao có bao nhiêu ki-lô-gam gạo?", "⭐ Challenge: Two bags of rice weigh 147 kg in all. If you take 5 kg of rice out of the first bag and 22 kg out of the second bag, the two bags have the same amount of rice left. How many kilograms of rice did each bag have at first?"),
   parts: [num(LT("Bao thứ nhất", "First bag"), 65, "kg"), num(LT("Bao thứ hai", "Second bag"), 82, "kg")],
   steps: [st(LT("Lấy ra ở bao thứ hai nhiều hơn 22 − 5 = 17 (kg) mà còn lại bằng nhau, nên bao thứ hai nhiều hơn bao thứ nhất 17 kg", "You take out 22 − 5 = 17 (kg) more from the second bag, yet the amounts left are equal, so the second bag had 17 kg more than the first bag"), 17), st(LT("Bao thứ hai: (147 + 17) : 2 = 82 (kg)", "Second bag: (147 + 17) ÷ 2 = 82 (kg)"), 82), st(LT("Bao thứ nhất: 147 − 82 = 65 (kg)", "First bag: 147 − 82 = 65 (kg)"), 65)],
   tip: LT("Tìm hiệu trước: bao nào bị lấy ra nhiều hơn thì lúc đầu nhiều hơn bấy nhiêu.", "Find the difference first: the bag that had more taken out must have had that much more at the start.")
  }, {
   q: LT("⭐ Thử thách: An và Bình có tất cả 120 viên bi. Nếu Bình cho An 25 viên thì Bình vẫn nhiều hơn An 10 viên. Hỏi lúc đầu mỗi bạn có bao nhiêu viên bi?", "⭐ Challenge: An and Bình have 120 marbles in all. If Bình gives An 25 marbles, Bình still has 10 more marbles than An. How many marbles did each friend have at first?"),
   parts: [num("An", 30, LT("viên", "marbles")), num("Bình", 90, LT("viên", "marbles"))],
   steps: [st(LT("Bình cho An 25 viên thì Bình bớt 25 viên, An thêm 25 viên. Lúc đầu Bình nhiều hơn An: 10 + 25 + 25 = 60 (viên)", "Bình gives An 25 marbles, so Bình loses 25 marbles and An gains 25 marbles. At first Bình had more than An by: 10 + 25 + 25 = 60 (marbles)"), 60), st(LT("Bình: (120 + 60) : 2 = 90 (viên)", "Bình: (120 + 60) ÷ 2 = 90 (marbles)"), 90), st(LT("An: 120 − 90 = 30 (viên)", "An: 120 − 90 = 30 (marbles)"), 30)],
   tip: LT("Cho đi 25 viên thì khoảng cách giữa hai bạn thay đổi 25 + 25 viên.", "Giving away 25 marbles changes the gap between the two friends by 25 + 25 marbles.")
  }, {
   q: LT("⭐ Thử thách: Hai thư viện có tất cả 2 995 quyển sách. Thư viện thứ nhất chuyển 125 quyển sang thư viện thứ hai, sau đó thư viện thứ hai chuyển 48 quyển sang thư viện thứ nhất. Lúc này thư viện thứ nhất nhiều hơn thư viện thứ hai 341 quyển. Hỏi lúc đầu mỗi thư viện có bao nhiêu quyển sách?", "⭐ Challenge: Two libraries have 2,995 books in all. The first library moves 125 books to the second library, and then the second library moves 48 books to the first library. Now the first library has 341 more books than the second library. How many books did each library have at first?"),
   parts: [num(LT("Thư viện thứ nhất", "First library"), 1745, LT("quyển", "books")), num(LT("Thư viện thứ hai", "Second library"), 1250, LT("quyển", "books"))],
   steps: [st(LT("Sau hai lần chuyển, thư viện thứ nhất bớt đi 125 − 48 = 77 (quyển), thư viện thứ hai thêm 77 quyển", "After the two moves, the first library has 125 − 48 = 77 (books) fewer, and the second library has 77 more books"), 77), st(LT("Lúc đầu thư viện thứ nhất nhiều hơn thư viện thứ hai: 341 + 77 + 77 = 495 (quyển)", "At first the first library had more books than the second library by: 341 + 77 + 77 = 495 (books)"), 495), st(LT("Thư viện thứ nhất: (2 995 + 495) : 2 = 1 745 (quyển)", "First library: (2,995 + 495) ÷ 2 = 1,745 (books)"), 1745), st(LT("Thư viện thứ hai: 2 995 − 1 745 = 1 250 (quyển)", "Second library: 2,995 − 1,745 = 1,250 (books)"), 1250)],
   tip: LT("Gộp hai lần chuyển lại: thư viện thứ nhất thực sự chỉ bớt đi 125 − 48 quyển.", "Combine the two moves: the first library really only loses 125 − 48 books.")
  }, {
   q: LT("⭐ Thử thách: Một số có hai chữ số, tổng hai chữ số bằng 11. Nếu đổi chỗ hai chữ số cho nhau thì được số mới lớn hơn số cũ 27 đơn vị. Tìm số đó.", "⭐ Challenge: A number has two digits, and the sum of its digits is 11. If you swap the two digits, the new number is 27 more than the old number. Find the number."),
   parts: [num(LT("Số cần tìm", "The number"), 47)],
   steps: [st(LT("Thử: 12 đổi chỗ thành 21, lớn hơn 9; 13 thành 31, lớn hơn 18. Cứ chữ số hàng đơn vị hơn chữ số hàng chục 1 thì số mới lớn hơn số cũ 9", "Try: swapping 12 gives 21, which is 9 more; swapping 13 gives 31, which is 18 more. Each time the ones digit is 1 more than the tens digit, the new number is 9 more than the old number")), st(LT("Chữ số hàng đơn vị hơn chữ số hàng chục: 27 : 9 = 3", "The ones digit is more than the tens digit by: 27 ÷ 9 = 3"), 3), st(LT("Chữ số hàng đơn vị: (11 + 3) : 2 = 7", "Ones digit: (11 + 3) ÷ 2 = 7"), 7), st(LT("Chữ số hàng chục: 11 − 7 = 4", "Tens digit: 11 − 7 = 4"), 4), st(LT("Số cần tìm là 47. Thử lại: 74 − 47 = 27", "The number is 47. Check: 74 − 47 = 27"), 47)],
   tip: LT("Đổi chỗ mà số tăng lên thì chữ số hàng đơn vị lớn hơn. Mỗi 1 đơn vị chênh lệch giữa hai chữ số làm số tăng 9.", "If swapping makes the number bigger, the ones digit is the bigger one. Every 1 of difference between the two digits makes the number go up by 9.")
  }];
  LESSON({
   id: "sumdiff",
   reg: "toan",
   title: LT("Tìm hai số khi biết tổng và hiệu", "Find Two Numbers from Their Sum and Difference"),
   short: LT("Tổng – Hiệu", "Sum – Difference"),
   emoji: "🧩",
   blurb: LT("Vẽ sơ đồ đoạn thẳng để giải", "Draw a bar model to solve"),
   links: ["addsub"],
   rule: {
    h: LT("Cách giải", "How to solve"),
    items: [LT("**Số bé** = (Tổng − Hiệu) : 2", "**Smaller number** = (Sum − Difference) ÷ 2"), LT("**Số lớn** = (Tổng + Hiệu) : 2", "**Larger number** = (Sum + Difference) ÷ 2"), LT("Tìm được một số thì số kia = Tổng − số vừa tìm.", "Once you find one number, the other = Sum − the number you just found."), LT("Thử lại: cộng hai số được tổng, trừ hai số được hiệu.", "Check: adding the two numbers gives the sum, subtracting them gives the difference.")]
   },
   figs: {
    a: () => FB.segs([{
     rows: [{
      lab: "An",
      segs: [{
       u: 1,
       c: "orange",
       t: "?"
      }]
     }, {
      lab: "Bình",
      segs: [{
       u: 1,
       c: "blue",
       t: "?"
      }]
     }],
     br: [{
      r1: 0,
      r2: 1,
      t: "70",
      c: "red"
     }]
    }, {
     rows: [{
      lab: "An",
      segs: [{
       id: 0,
       u: 1,
       c: "orange",
       t: "?"
      }, {
       id: 1,
       u: .34,
       c: "yellow",
       t: "16"
      }]
     }, {
      lab: "Bình",
      segs: [{
       id: 0,
       u: 1,
       c: "blue",
       t: "?"
      }]
     }],
     br: [{
      r1: 0,
      r2: 1,
      t: "70",
      c: "red"
     }]
    }, {
     rows: [{
      lab: "An",
      segs: [{
       id: 0,
       u: 1,
       c: "orange",
       t: "?"
      }, {
       id: 1,
       u: .34,
       c: "yellow",
       dash: 1,
       faded: 1,
       t: "16"
      }]
     }, {
      lab: "Bình",
      segs: [{
       id: 0,
       u: 1,
       c: "blue",
       t: "?"
      }]
     }],
     br: [{
      r1: 0,
      r2: 1,
      t: "70 − 16",
      c: "red"
     }],
     notes: [{
      t: LT("Bớt khúc 16 → hai đoạn bằng nhau", "Remove the 16 piece → two equal bars"),
      y: 176
     }]
    }, {
     rows: [{
      lab: "An",
      segs: [{
       id: 0,
       u: 1,
       c: "orange",
       t: "27"
      }, {
       id: 1,
       u: .34,
       c: "yellow",
       t: "16"
      }]
     }, {
      lab: "Bình",
      segs: [{
       id: 0,
       u: 1,
       c: "blue",
       t: "27"
      }]
     }],
     br: [{
      r1: 0,
      r2: 1,
      t: "70",
      c: "red"
     }],
     notes: [{
      t: LT("Bình = (70 − 16) : 2 = 27", "Bình = (70 − 16) ÷ 2 = 27"),
      y: 164
     }, {
      t: "An = 27 + 16 = 43",
      y: 190
     }]
    }, {
     rows: [{
      lab: "An",
      segs: [{
       id: 0,
       u: 1,
       c: "orange",
       t: "27"
      }, {
       id: 1,
       u: .34,
       c: "yellow",
       t: "16"
      }]
     }, {
      lab: "Bình",
      segs: [{
       id: 0,
       u: 1,
       c: "blue",
       t: "27"
      }, {
       id: 1,
       u: .34,
       c: "green",
       dash: 1,
       t: "16"
      }]
     }],
     br: [{
      r1: 0,
      r2: 1,
      t: "70 + 16",
      c: "red"
     }],
     notes: [{
      t: LT("An = (70 + 16) : 2 = 43", "An = (70 + 16) ÷ 2 = 43"),
      y: 164
     }, {
      t: "Bình = 43 − 16 = 27",
      y: 190
     }]
    }], {
     bottom: 60
    })
   },
   teach: [{
    key: "a",
    f: 0,
    say: LT("An và Bình có tất cả **70** viên bi. An có nhiều hơn Bình **16** viên. Hỏi mỗi bạn có bao nhiêu viên bi? Ta vẽ **sơ đồ đoạn thẳng**: một đoạn là số bi của An, một đoạn là số bi của Bình, cả hai đoạn là 70.", "An and Bình have **70** marbles in all. An has **16** more marbles than Bình. How many marbles does each friend have? Let's draw a **bar model**: one bar is An's marbles, one bar is Bình's marbles, and both bars together make 70.")
   }, {
    key: "a",
    f: 1,
    say: LT("An có nhiều hơn Bình 16 viên, nên đoạn của An dài hơn đoạn của Bình một khúc **16** (đó là **hiệu**).", "An has 16 more marbles than Bình, so An's bar is longer than Bình's bar by a piece of **16** (that is the **difference**).")
   }, {
    key: "a",
    f: 2,
    say: LT("**Cách 1**: bớt khúc 16 ở đoạn của An. Khi đó hai đoạn **bằng nhau**, mỗi đoạn bằng số bi của Bình (số bé), và tổng chỉ còn 70 − 16.", "**Method 1**: take away the piece of 16 from An's bar. Now the two bars are **equal**, each one equal to Bình's marbles (the smaller number), and the sum is just 70 − 16.")
   }, {
    key: "a",
    f: 2,
    say: LT("Tổng còn 54 là của **hai đoạn bằng nhau**. Muốn tìm một đoạn (số bi của Bình), ta chia 54 cho 2.", "The remaining sum, 54, belongs to **two equal bars**. To find one bar (Bình's marbles), we divide 54 by 2.")
   }, {
    key: "a",
    f: 3,
    say: LT("Bình: (70 − 16) : 2 = **27** (viên). An: 27 + 16 = **43** (viên). Thử lại: 43 + 27 = 70 và 43 − 27 = 16. Đúng!", "Bình: (70 − 16) ÷ 2 = **27** (marbles). An: 27 + 16 = **43** (marbles). Check: 43 + 27 = 70 and 43 − 27 = 16. Correct!")
   }, {
    key: "a",
    f: 4,
    say: LT("**Cách 2**: thêm 16 vào số của Bình thì hai bạn bằng nhau, tổng thành 70 + 16. Mỗi đoạn là số bi của An: (70 + 16) : 2 = **43** (số lớn). Bình: 43 − 16 = **27**.", "**Method 2**: add 16 to Bình's number and the two friends are equal, so the sum becomes 70 + 16. Each bar is An's marbles: (70 + 16) ÷ 2 = **43** (the larger number). Bình: 43 − 16 = **27**.")
   }, {
    key: "a",
    f: 4,
    say: LT("Ghi nhớ: **Số bé = (Tổng − Hiệu) : 2**; **Số lớn = (Tổng + Hiệu) : 2**.", "Remember: **Smaller number = (Sum − Difference) ÷ 2**; **Larger number = (Sum + Difference) ÷ 2**.")
   }],
   gen(tier, r) {
    if (tier === 1) {
     let D = rd(r, 2, 20),
      b = rd(r, 10, 50),
      a = b + D,
      S = a + b;
     return QQ({
      q: LT("Hai số có tổng bằng **" + S + "** và hiệu bằng **" + D + "**. Tìm hai số đó.", "Two numbers have a sum of **" + S + "** and a difference of **" + D + "**. Find the two numbers."),
      parts: [num(LT("Số lớn", "Larger number"), a), num(LT("Số bé", "Smaller number"), b)],
      steps: [st(LT("Số bé: (" + S + " − " + D + ") : 2 = " + b, "Smaller number: (" + S + " − " + D + ") ÷ 2 = " + b), b), st(LT("Số lớn: " + b + " + " + D + " = " + a, "Larger number: " + b + " + " + D + " = " + a), a)],
      tip: LT("Số bé = (Tổng − Hiệu) : 2; Số lớn = (Tổng + Hiệu) : 2.", "Smaller number = (Sum − Difference) ÷ 2; Larger number = (Sum + Difference) ÷ 2."),
      work: {
       type: "bars",
       S,
       D,
       a,
       b,
       labs: [LT("Lớn", "Larger"), LT("Bé", "Smaller")]
      },
      diag: DG.sd(S, D, a, b),
      hintFig: {
       fb: SDfig(S, D, a, b, 3),
       f: 0
      }
     })
    }
    if (tier === 2) {
     let g = r.int(0, 4);
     if (g === 0) {
      let n = r.shuffle(NAMES).slice(0, 2),
       k = rd(r, 3, 18),
       b = rd(r, 15, 60),
       a = b + k,
       S = a + b;
      return QQ({
       q: LT(n[0] + " và " + n[1] + " có tất cả **" + S + " viên bi**. Nếu " + n[1] + " có thêm **" + k + " viên** thì hai bạn có số bi bằng nhau. Hỏi mỗi bạn có bao nhiêu viên bi?", n[0] + " and " + n[1] + " have **" + S + " marbles** in all. If " + n[1] + " gets **" + k + " more marbles**, the two friends will have the same number of marbles. How many marbles does each friend have?"),
       parts: [num(n[0], a, LT("viên", "marbles")), num(n[1], b, LT("viên", "marbles"))],
       steps: [st(LT(n[1] + " thêm " + k + " viên thì bằng " + n[0] + ", nên " + n[0] + " nhiều hơn " + n[1] + " " + k + " viên", "If " + n[1] + " gets " + k + " more marbles, " + n[1] + " will equal " + n[0] + ", so " + n[0] + " has " + k + " more marbles than " + n[1]), k), st(LT(n[1] + ": (" + S + " − " + k + ") : 2 = " + b + " (viên)", n[1] + ": (" + S + " − " + k + ") ÷ 2 = " + b + " (marbles)"), b), st(LT(n[0] + ": " + b + " + " + k + " = " + a + " (viên)", n[0] + ": " + b + " + " + k + " = " + a + " (marbles)"), a)],
       tip: LT('Câu "thêm… thì bằng nhau" cho biết hiệu của hai số.', 'The clue "gets more… to be equal" tells you the difference of the two numbers.'),
       work: {
        type: "bars",
        S,
        D: k,
        a,
        b,
        labs: [n[0], n[1]]
       },
       diag: DG.sd(S, k, a, b),
       hintFig: {
        fb: SDfig(S, k, a, b, 3),
        f: 0
       }
      })
     }
     if (g === 1) {
      let b = rd(r, 6, 14),
       D = rd(r, 24, 36),
       a = b + D,
       S = a + b,
       w = r.pick([LT("Bố", "Dad"), LT("Mẹ", "Mom")]);
      return QQ({
       q: LT("Tổng số tuổi của " + w.toLowerCase() + " và con là **" + S + " tuổi**. " + w + " hơn con **" + D + " tuổi**. Hỏi mỗi người bao nhiêu tuổi?", w + " and the child are **" + S + " years** old in total. " + w + " is **" + D + " years** older than the child. How old is each person?"),
       parts: [num(w, a, LT("tuổi", "years old")), num(LT("Con", "Child"), b, LT("tuổi", "years old"))],
       steps: [st(LT("Tuổi con: (" + S + " − " + D + ") : 2 = " + b + " (tuổi)", "Child's age: (" + S + " − " + D + ") ÷ 2 = " + b + " (years)"), b), st(LT("Tuổi " + w.toLowerCase() + ": " + b + " + " + D + " = " + a + " (tuổi)", w + "'s age: " + b + " + " + D + " = " + a + " (years)"), a)],
       diag: DG.sd(S, D, a, b),
       hintFig: {
        fb: SDfig(S, D, a, b, 3),
        f: 0
       },
       tip: LT("Tuổi con là số bé.", "The child's age is the smaller number.")
      })
     }
     if (g === 2) {
      let b = rd(r, 20, 60),
       D = rd(r, 4, 20),
       a = b + D,
       S = a + b;
      return QQ({
       q: LT("Hai lớp 4A và 4B trồng được **" + S + " cây**. Lớp 4A trồng được **ít hơn** lớp 4B **" + D + " cây**. Hỏi mỗi lớp trồng được bao nhiêu cây?", "Classes 4A and 4B planted **" + S + " trees** in all. Class 4A planted **fewer** trees than class 4B, by **" + D + " trees**. How many trees did each class plant?"),
       parts: [num(LT("Lớp 4A", "Class 4A"), b, LT("cây", "trees")), num(LT("Lớp 4B", "Class 4B"), a, LT("cây", "trees"))],
       steps: [st(LT("Lớp 4A (số bé): (" + S + " − " + D + ") : 2 = " + b + " (cây)", "Class 4A (smaller number): (" + S + " − " + D + ") ÷ 2 = " + b + " (trees)"), b), st(LT("Lớp 4B: " + b + " + " + D + " = " + a + " (cây)", "Class 4B: " + b + " + " + D + " = " + a + " (trees)"), a)],
       diag: (vals, q) => {
        let e0 = V(vals, 0),
         e1 = V(vals, 1);
        return e0 === a && e1 === b ? {
         kind: "nham",
         msg: LT("Lớp 4A trồng ÍT hơn, nên 4A là số bé.", "Class 4A planted FEWER, so 4A is the smaller number.")
        } : DG.sd(S, D, b, a)(vals, q)
       },
       hintFig: {
        fb: FB.segs([SDscenes(S, D, b, ["4B", "4A"])[2]], {}),
        f: 0
       },
       tip: LT("Lớp trồng ít hơn là số bé.", "The class that planted fewer is the smaller number.")
      })
     }
     if (g === 3) {
      let b = rd(r, 80, 300) * 10,
       D = rd(r, 10, 90) * 10,
       a = b + D,
       S = a + b;
      return QQ({
       q: LT("Hai thư viện có tất cả **" + fmt(S) + " quyển sách**. Thư viện thứ nhất có nhiều hơn thư viện thứ hai **" + fmt(D) + " quyển**. Hỏi mỗi thư viện có bao nhiêu quyển sách?", "Two libraries have **" + fmt(S) + " books** in all. The first library has **" + fmt(D) + " more books** than the second library. How many books does each library have?"),
       parts: [num(LT("Thư viện thứ nhất", "Library 1"), a, LT("quyển", "books")), num(LT("Thư viện thứ hai", "Library 2"), b, LT("quyển", "books"))],
       steps: [st(LT("Thư viện thứ nhất (số lớn): (" + fmt(S) + " + " + fmt(D) + ") : 2 = " + fmt(a) + " (quyển)", "First library (larger number): (" + fmt(S) + " + " + fmt(D) + ") ÷ 2 = " + fmt(a) + " (books)"), a), st(LT("Thư viện thứ hai: " + fmt(S) + " − " + fmt(a) + " = " + fmt(b) + " (quyển)", "Second library: " + fmt(S) + " − " + fmt(a) + " = " + fmt(b) + " (books)"), b)],
       diag: DG.sd(S, D, a, b),
       tip: LT("Số lớn = (Tổng + Hiệu) : 2.", "Larger number = (Sum + Difference) ÷ 2.")
      })
     }
     let b = rd(r, 30, 90) * 10,
      D = rd(r, 4, 20) * 10,
      a = b + D,
      S = a + b;
     return QQ({
      q: LT("Hai thửa ruộng thu hoạch được tất cả **" + fmt(S) + " kg thóc**. Thửa thứ hai thu được ít hơn thửa thứ nhất **" + D + " kg**. Hỏi mỗi thửa ruộng thu hoạch được bao nhiêu ki-lô-gam thóc?", "Two fields produced **" + fmt(S) + " kg of rice** in all. The second field produced **" + D + " kg** less than the first field. How many kilograms of rice did each field produce?"),
      parts: [num(LT("Thửa thứ nhất", "First field"), a, "kg"), num(LT("Thửa thứ hai", "Second field"), b, "kg")],
      steps: [st(LT("Thửa thứ hai (số bé): (" + fmt(S) + " − " + D + ") : 2 = " + b + " (kg)", "Second field (smaller number): (" + fmt(S) + " − " + D + ") ÷ 2 = " + b + " (kg)"), b), st(LT("Thửa thứ nhất: " + b + " + " + D + " = " + fmt(a) + " (kg)", "First field: " + b + " + " + D + " = " + fmt(a) + " (kg)"), a)],
      diag: DG.sd(S, D, a, b),
      tip: LT("Thửa thu được ít hơn là số bé.", "The field that produced less is the smaller number.")
     })
    }
    let h = r.pick(SD_HARD);
    return QQ(h.tip ? h : Object.assign({
     tip: /liên tiếp|consecutive/.test(h.q) ? LT("Hai số lẻ (hoặc chẵn) liên tiếp hơn kém nhau 2.", "Two consecutive odd (or even) numbers differ by 2.") : LT("Mỗi số ở giữa làm hai số cách xa thêm 2. Tìm hiệu trước.", "Each number in between adds 2 to the gap. Find the difference first.")
    }, h))
   }
  });
  addAsks("sumdiff", [{
   after: 2,
   say: LT("Cùng làm: bớt khúc hiệu 16 khỏi tổng 70, còn lại bao nhiêu?", "Let's do it together: take the difference piece of 16 away from the sum of 70. What is left?"),
   opts: ["54", "86", "64"],
   ans: "54",
   good: LT("Đúng! 70 − 16 = 54.", "Correct! 70 − 16 = 54.")
  }, {
   after: 3,
   say: LT("Cùng làm: hai đoạn bằng nhau, tổng là 54. Mỗi đoạn là?", "Let's do it together: two equal bars, and the sum is 54. How much is each bar?"),
   opts: ["27", "54", "35"],
   ans: "27",
   good: LT("Đúng! 54 : 2 = 27.", "Correct! 54 ÷ 2 = 27.")
  }]);
  SD_HARD.push({
   q: LT("⭐ Thử thách: Tìm hai số lẻ liên tiếp có tổng bằng 4 020.", "⭐ Challenge: Find two consecutive odd numbers with a sum of 4,020."),
   parts: [num(LT("Số bé", "Smaller number"), 2009), num(LT("Số lớn", "Larger number"), 2011)],
   steps: [st(LT("Hai số lẻ liên tiếp (ví dụ 1; 3 hoặc 7; 9) hơn kém nhau 2", "Two consecutive odd numbers (for example 1 and 3, or 7 and 9) differ by 2"), 2), st(LT("Số bé: (4 020 − 2) : 2 = 2 009", "Smaller number: (4,020 − 2) ÷ 2 = 2,009"), 2009), st(LT("Số lớn: 2 009 + 2 = 2 011", "Larger number: 2,009 + 2 = 2,011"), 2011)]
  }, {
   q: LT("⭐ Thử thách: Tìm hai số chẵn có tổng bằng 1 000, biết giữa chúng có đúng 2 số lẻ.", "⭐ Challenge: Find two even numbers with a sum of 1,000, given that there are exactly 2 odd numbers between them."),
   parts: [num(LT("Số bé", "Smaller number"), 498), num(LT("Số lớn", "Larger number"), 502)],
   steps: [st(LT("Ví dụ: giữa 2 và 6 có đúng 2 số lẻ là 3; 5, và 6 − 2 = 4. Vậy hai số hơn kém nhau 4", "For example: between 2 and 6 there are exactly 2 odd numbers, 3 and 5, and 6 − 2 = 4. So the two numbers differ by 4"), 4), st(LT("Số bé: (1 000 − 4) : 2 = 498", "Smaller number: (1,000 − 4) ÷ 2 = 498"), 498), st(LT("Số lớn: 498 + 4 = 502", "Larger number: 498 + 4 = 502"), 502)]
  }, {
   q: LT("⭐ Thử thách: Tổng hai số chẵn bằng 480. Tìm hai số đó, biết giữa chúng có 6 số lẻ.", "⭐ Challenge: The sum of two even numbers is 480. Find the two numbers, given that there are 6 odd numbers between them."),
   parts: [num(LT("Số bé", "Smaller number"), 234), num(LT("Số lớn", "Larger number"), 246)],
   steps: [st(LT("Mỗi số lẻ ở giữa làm hai số chẵn cách xa thêm 2 (giữa 2 và 6 có 2 số lẻ, 6 − 2 = 4). Có 6 số lẻ nên hai số hơn kém nhau 6 × 2 = 12", "Each odd number in between pushes the two even numbers 2 farther apart (between 2 and 6 there are 2 odd numbers, and 6 − 2 = 4). There are 6 odd numbers, so the two numbers differ by 6 × 2 = 12"), 12), st(LT("Số bé: (480 − 12) : 2 = 234", "Smaller number: (480 − 12) ÷ 2 = 234"), 234), st(LT("Số lớn: 234 + 12 = 246", "Larger number: 234 + 12 = 246"), 246)]
  }, {
   q: LT("⭐ Thử thách: Tìm hai số lẻ có tổng bằng 2 010, biết giữa chúng có đúng 10 số chẵn.", "⭐ Challenge: Find two odd numbers with a sum of 2,010, given that there are exactly 10 even numbers between them."),
   parts: [num(LT("Số bé", "Smaller number"), 995), num(LT("Số lớn", "Larger number"), 1015)],
   steps: [st(LT("Ví dụ: giữa 1 và 5 có 2 số chẵn là 2; 4, và 5 − 1 = 4 = 2 × 2. Có 10 số chẵn nên hai số hơn kém nhau 10 × 2 = 20", "For example: between 1 and 5 there are 2 even numbers, 2 and 4, and 5 − 1 = 4 = 2 × 2. There are 10 even numbers, so the two numbers differ by 10 × 2 = 20"), 20), st(LT("Số bé: (2 010 − 20) : 2 = 995", "Smaller number: (2,010 − 20) ÷ 2 = 995"), 995), st(LT("Số lớn: 995 + 20 = 1 015", "Larger number: 995 + 20 = 1,015"), 1015)]
  });
  extendTier("sumdiff", 3, [r => {
   let c = r.pick([
     [LT("thùng", "tank"), LT("l dầu", "L of oil"), LT("l", "L"), LT("lít dầu", "liters of oil"), LT("lượng dầu", "the amount of oil"), LT("", "tanks"), LT("", "How much oil")],
     [LT("giỏ", "basket"), LT("quả cam", "oranges"), LT("quả", "oranges"), LT("quả cam", "oranges"), LT("số cam", "the number of oranges"), LT("", "baskets"), LT("", "How many oranges")],
     [LT("kệ", "bookshelf"), LT("quyển sách", "books"), LT("quyển", "books"), LT("quyển sách", "books"), LT("số sách", "the number of books"), LT("", "bookshelves"), LT("", "How many books")],
     [LT("bể", "tub"), LT("l nước", "L of water"), LT("l", "L"), LT("lít nước", "liters of water"), LT("lượng nước", "the amount of water"), LT("", "tubs"), LT("", "How much water")]
    ]),
    b = rd(r, 15, 90),
    k = rd(r, 3, 25),
    a = b + 2 * k,
    S = a + b,
    C = c[0].charAt(0).toUpperCase() + c[0].slice(1);
   return QQ({
    q: LT("⭐ Thử thách: Hai " + c[0] + " có tất cả **" + S + " " + c[1] + "**. Nếu chuyển **" + k + " " + c[2] + "** từ " + c[0] + " thứ nhất sang " + c[0] + " thứ hai thì " + c[4] + " ở hai " + c[0] + " bằng nhau. Hỏi lúc đầu mỗi " + c[0] + " có bao nhiêu " + c[3] + "?", "⭐ Challenge: Two " + c[5] + " have **" + S + " " + c[1] + "** in all. If **" + k + " " + c[2] + "** are moved from the first " + c[0] + " to the second " + c[0] + ", " + c[4] + " in the two " + c[5] + " will be equal. " + c[6] + " did each " + c[0] + " have at first?"),
    parts: [num(LT(C + " thứ nhất", "First " + c[0]), a, c[2]), num(LT(C + " thứ hai", "Second " + c[0]), b, c[2])],
    steps: [st(LT("Chuyển " + k + " " + c[2] + " thì " + c[0] + " thứ nhất bớt " + k + ", " + c[0] + " thứ hai thêm " + k + " mới bằng nhau. Vậy lúc đầu " + c[0] + " thứ nhất nhiều hơn: " + k + " × 2 = " + 2 * k + " (" + c[2] + ")", "Moving " + k + " " + c[2] + " takes " + k + " from the first " + c[0] + " and gives " + k + " to the second " + c[0] + ", and then they are equal. So at first the first " + c[0] + " had " + k + " × 2 = " + 2 * k + " (" + c[2] + ") more"), 2 * k), st(LT(C + " thứ nhất: (" + S + " + " + 2 * k + ") : 2 = " + a + " (" + c[2] + ")", "First " + c[0] + ": (" + S + " + " + 2 * k + ") ÷ 2 = " + a + " (" + c[2] + ")"), a), st(LT(C + " thứ hai: " + S + " − " + a + " = " + b + " (" + c[2] + ")", "Second " + c[0] + ": " + S + " − " + a + " = " + b + " (" + c[2] + ")"), b)],
    diag: DG.chuyen(S, k, a, b),
    hintFig: {
     fb: SDfig(S, 2 * k, a, b, 3),
     f: 0
    },
    tip: LT("Chuyển đi " + k + " thì một bên bớt " + k + ", một bên thêm " + k + ".", "Moving " + k + " away takes " + k + " from one side and adds " + k + " to the other.")
   })
  }, r => {
   let w = rd(r, 5, 30),
    D = rd(r, 2, 16),
    l = w + D,
    P2 = 2 * (l + w),
    S = l * w;
   return QQ({
    q: LT("Một hình chữ nhật có chu vi **" + P2 + " m**, chiều dài hơn chiều rộng **" + D + " m**. Tính diện tích hình chữ nhật.", "A rectangle has a perimeter of **" + P2 + " m**, and its length is **" + D + " m** more than its width. Find the area of the rectangle."),
    parts: [num("", S, "m²")],
    steps: [st(LT("Nửa chu vi (dài + rộng): " + P2 + " : 2 = " + (l + w) + " (m)", "Half the perimeter (length + width): " + P2 + " ÷ 2 = " + (l + w) + " (m)"), l + w), st(LT("Chiều dài: (" + (l + w) + " + " + D + ") : 2 = " + l + " (m)", "Length: (" + (l + w) + " + " + D + ") ÷ 2 = " + l + " (m)"), l), st(LT("Chiều rộng: " + (l + w) + " − " + l + " = " + w + " (m)", "Width: " + (l + w) + " − " + l + " = " + w + " (m)"), w), st(LT("Diện tích: " + l + " × " + w + " = " + fmt(S) + " (m²)", "Area: " + l + " × " + w + " = " + fmt(S) + " (m²)"), S)],
    diag: DG.any(DG.step([l, w, l + w], LT("Đó mới là một bước. Đề hỏi diện tích = dài × rộng.", "That is only one step. The question asks for area = length × width.")), (vals, q) => {
     let e = V(vals, 0),
      L2 = (P2 + D) / 2,
      W2 = (P2 - D) / 2;
     return Number.isInteger(L2) && e === L2 * W2 ? {
      kind: "nua_cv",
      msg: LT("Dài + rộng chỉ bằng NỬA chu vi. Chia chu vi cho 2 trước.", "Length + width is only HALF the perimeter. Divide the perimeter by 2 first.")
     } : null
    }),
    hintFig: {
     fb: FB.segs([SDscenes(l + w, D, w, [LT("Dài", "Length"), LT("Rộng", "Width")])[2]], {}),
     f: 0
    },
    tip: LT("Tổng của chiều dài và chiều rộng là nửa chu vi.", "The sum of the length and the width is half the perimeter.")
   })
  }, r => {
   let odd = r.chance(.5),
    b = odd ? 2 * rd(r, 50, 2e3) + 1 : 2 * rd(r, 50, 2e3),
    S = 2 * b + 2,
    kind = odd ? LT("lẻ", "odd") : LT("chẵn", "even");
   return QQ({
    q: LT("⭐ Thử thách: Tìm hai số **" + kind + " liên tiếp** có tổng bằng **" + fmt(S) + "**.", "⭐ Challenge: Find two consecutive **" + kind + "** numbers with a sum of **" + fmt(S) + "**."),
    parts: [num(LT("Số bé", "Smaller number"), b), num(LT("Số lớn", "Larger number"), b + 2)],
    steps: [st(LT("Hai số " + kind + " liên tiếp (ví dụ " + (odd ? "5; 7" : "6; 8") + ") hơn kém nhau 2", "Two consecutive " + kind + " numbers (for example " + (odd ? "5 and 7" : "6 and 8") + ") differ by 2"), 2), st(LT("Số bé: (" + fmt(S) + " − 2) : 2 = " + fmt(b), "Smaller number: (" + fmt(S) + " − 2) ÷ 2 = " + fmt(b)), b), st(LT("Số lớn: " + fmt(b) + " + 2 = " + fmt(b + 2), "Larger number: " + fmt(b) + " + 2 = " + fmt(b + 2)), b + 2)],
    diag: (vals, q) => {
     let e0 = V(vals, 0),
      e1 = V(vals, 1);
     return e0 === b + 2 && e1 === b ? {
      kind: "nham",
      msg: LT("Con ghi ngược số bé và số lớn rồi.", "You wrote the smaller and larger numbers backward.")
     } : e0 + e1 === S && Math.abs(e0 - e1) === 1 ? {
      kind: "chia2",
      msg: LT("Hai số " + kind + " liên tiếp hơn kém nhau 2 (không phải 1).", "Two consecutive " + kind + " numbers differ by 2 (not 1).")
     } : null
    }
,
    tip: LT("Hai số " + kind + " liên tiếp hơn kém nhau 2.", "Two consecutive " + kind + " numbers differ by 2.")
   })
  }, r => {
   let b = rd(r, 5, 15),
    D = rd(r, 20, 32),
    a = b + D,
    k = rd(r, 2, 8),
    S = a + b,
    T = S + 2 * k;
   return QQ({
    q: LT("⭐ Thử thách: Hiện nay mẹ hơn con **" + D + " tuổi**. Sau **" + k + " năm** nữa, tổng số tuổi của hai mẹ con là **" + T + " tuổi**. Hỏi hiện nay mỗi người bao nhiêu tuổi?", "⭐ Challenge: Right now Mom is **" + D + " years** older than her child. In **" + k + " years**, the sum of their ages will be **" + T + "**. How old is each of them right now?"),
    parts: [num(LT("Mẹ", "Mom"), a, LT("tuổi", "years old")), num(LT("Con", "Child"), b, LT("tuổi", "years old"))],
    steps: [st(LT("Sau " + k + " năm, mỗi người thêm " + k + " tuổi nên tổng thêm " + k + " × 2 = " + 2 * k + " (tuổi). Tổng số tuổi hiện nay: " + T + " − " + 2 * k + " = " + S + " (tuổi)", "In " + k + " years each person is " + k + " years older, so the sum goes up by " + k + " × 2 = " + 2 * k + " (years). The sum of their ages now: " + T + " − " + 2 * k + " = " + S + " (years)"), S), st(LT("Tuổi con: (" + S + " − " + D + ") : 2 = " + b + " (tuổi)", "Child's age: (" + S + " − " + D + ") ÷ 2 = " + b + " (years)"), b), st(LT("Tuổi mẹ: " + b + " + " + D + " = " + a + " (tuổi)", "Mom's age: " + b + " + " + D + " = " + a + " (years)"), a)],
    diag: DG.any((vals, q) => V(vals, 0) + V(vals, 1) === T && (V(vals, 0) !== a || V(vals, 1) !== b) ? {
     kind: "chua_lui_tuoi",
     msg: LT("Con đang tìm tuổi sau " + k + " năm. Đề hỏi tuổi hiện nay: bớt " + k + " tuổi của mỗi người.", "You found the ages in " + k + " years. The question asks for their ages right now: take " + k + " years off each person.")
    } : null, DG.sd(S, D, a, b)),
    tip: LT("Tìm tổng số tuổi hiện nay trước: mỗi người bớt " + k + " tuổi.", "Find the sum of their ages right now first: take " + k + " years off each person.")
   })
  }, r => {
   let odd = r.chance(.5),
    m = rd(r, 2, 12),
    b = odd ? 2 * rd(r, 50, 400) + 1 : 2 * rd(r, 50, 400),
    a = b + 2 * m,
    S = a + b,
    kind = odd ? LT("lẻ", "odd") : LT("chẵn", "even"),
    other = odd ? LT("chẵn", "even") : LT("lẻ", "odd");
   return QQ({
    q: LT("⭐ Thử thách: Tìm hai số " + kind + " có tổng bằng **" + fmt(S) + "**, biết giữa chúng có đúng **" + m + " số " + other + "**.", "⭐ Challenge: Find two " + kind + " numbers with a sum of **" + fmt(S) + "**, given that there are exactly **" + m + " " + other + " numbers** between them."),
    parts: [num(LT("Số bé", "Smaller number"), b), num(LT("Số lớn", "Larger number"), a)],
    steps: [st(LT("Mỗi số " + other + " ở giữa làm hai số " + kind + " cách xa thêm 2. Có " + m + " số " + other + " nên hai số hơn kém nhau " + m + " × 2 = " + 2 * m, "Each " + other + " number in between pushes the two " + kind + " numbers 2 farther apart. There are " + m + " " + other + " numbers, so the two numbers differ by " + m + " × 2 = " + 2 * m), 2 * m), st(LT("Số bé: (" + fmt(S) + " − " + 2 * m + ") : 2 = " + fmt(b), "Smaller number: (" + fmt(S) + " − " + 2 * m + ") ÷ 2 = " + fmt(b)), b), st(LT("Số lớn: " + fmt(b) + " + " + 2 * m + " = " + fmt(a), "Larger number: " + fmt(b) + " + " + 2 * m + " = " + fmt(a)), a)],
    diag: DG.any((vals, q) => V(vals, 0) === a && V(vals, 1) === b ? {
     kind: "nham",
     msg: LT("Con ghi ngược số bé và số lớn rồi.", "You wrote the smaller and larger numbers backward.")
    } : null, (vals, q) => V(vals, 0) + V(vals, 1) === S && Math.abs(V(vals, 0) - V(vals, 1)) === m ? {
     kind: "sai_hieu",
     msg: LT("Hai số " + kind + " hơn kém nhau " + 2 * m + " (mỗi số " + other + " ở giữa thêm 2), không phải " + m + ".", "The two numbers differ by " + 2 * m + " (each " + other + " number in between adds 2), not " + m + ".")
    } : null),
    tip: LT("Tìm hiệu của hai số trước: mỗi số " + other + " ở giữa thêm 2.", "Find the difference of the two numbers first: each " + other + " number in between adds 2.")
   })
  }], !0);
  LESSON({
   id: "trees",
   reg: "toan",
   title: LT("Trồng cây trên đường", "Planting Trees Along a Road"),
   short: LT("Trồng cây", "Planting trees"),
   emoji: "🌳",
   blurb: LT("Toán vui: số cây và số khoảng cách", "Fun math: number of trees and number of gaps"),
   optional: !0,
   links: ["div"],
   rule: {
    h: LT("Số cây và số khoảng", "Number of trees and number of gaps"),
    items: [LT("Số khoảng = độ dài đường : khoảng cách giữa hai cây liền nhau.", "Number of gaps = length of the road ÷ distance between two neighboring trees."), LT("Hai đầu đều trồng: **số cây = số khoảng + 1**.", "Trees at both ends: **number of trees = number of gaps + 1**."), LT("Chỉ trồng một đầu: **số cây = số khoảng**.", "Tree at only one end: **number of trees = number of gaps**."), LT("Hai đầu không trồng: **số cây = số khoảng − 1**.", "No trees at either end: **number of trees = number of gaps − 1**."), LT("Quanh hồ, quanh vườn (đường khép kín): **số cây = số khoảng**.", "Around a lake or a garden (a closed path): **number of trees = number of gaps**.")]
   },
   figs: {
    a: () => FB.trees(40, 10, "2"),
    b: () => FB.trees(40, 10, "1"),
    c: () => FB.trees(40, 10, "0")
   },
   teach: [{
    key: "a",
    f: 0,
    say: LT("Người ta trồng cây dọc một bên đường dài **40 m**, hai đầu đường đều có cây, hai cây liền nhau cách nhau **10 m**. Cần bao nhiêu cây?", "Trees are planted along one side of a road that is **40 m** long. There are trees at both ends of the road, and two neighboring trees are **10 m** apart. How many trees are needed?")
   }, {
    key: "a",
    f: 1,
    say: LT("Đầu tiên đếm các **khoảng cách** giữa hai cây liền nhau: số khoảng = độ dài đường : khoảng cách.", "First, count the **gaps** between neighboring trees: number of gaps = length of the road ÷ distance between trees.")
   }, {
    key: "a",
    f: 2,
    say: LT("Có 40 : 10 = **4** (khoảng). Đặt cây vào: một cây ở đầu đường, rồi cứ hết một khoảng lại có một cây. Con đếm thử: số cây nhiều hơn số khoảng 1.", "There are 40 ÷ 10 = **4** (gaps). Now place the trees: one tree at the start of the road, then one more tree after each gap. Try counting: there is 1 more tree than gaps.")
   }, {
    key: "a",
    f: 3,
    say: LT("Vậy cần 4 + 1 = **5** (cây). Hai đầu đều trồng: **số cây = số khoảng + 1**.", "So we need 4 + 1 = **5** (trees). Trees at both ends: **number of trees = number of gaps + 1**.")
   }, {
    key: "b",
    f: 3,
    say: LT("Nếu **chỉ trồng một đầu** đường: bớt cây ở một đầu, còn **4** cây. **Số cây = số khoảng**.", "If we plant a tree at **only one end** of the road: remove the tree at one end, leaving **4** trees. **Number of trees = number of gaps**.")
   }, {
    key: "c",
    f: 3,
    say: LT("Nếu **hai đầu đường không trồng cây**: bớt cả hai cây ở hai đầu, còn 4 − 1 = **3** (cây). **Số cây = số khoảng − 1**.", "If **no trees are planted at either end** of the road: remove the trees at both ends, leaving 4 − 1 = **3** (trees). **Number of trees = number of gaps − 1**.")
   }, {
    key: "b",
    f: 3,
    say: LT("Trồng **quanh hồ, quanh vườn** (đường khép kín): đi hết một vòng thì cây cuối trùng cây đầu, nên **số cây = số khoảng**.", "When planting **around a lake or a garden** (a closed path): after going all the way around, the last tree lands on the first tree, so **number of trees = number of gaps**.")
   }],
   gen(tier, r) {
    let step = r.pick([2, 3, 4, 5, 6, 8, 10]),
     cnt = rd(r, 5, tier === 1 ? 12 : 25),
     len = cnt * step;
    if (tier === 1) return QQ({
     q: LT("Người ta trồng cây dọc một bên đường dài **" + len + " m**, hai đầu đường đều có cây, hai cây liền nhau cách nhau **" + step + " m**. Hỏi cần bao nhiêu cây?", "Trees are planted along one side of a road that is **" + len + " m** long. There are trees at both ends of the road, and two neighboring trees are **" + step + " m** apart. How many trees are needed?"),
     parts: [num("", cnt + 1, LT("cây", "trees"))],
     steps: [st(LT("Số khoảng: " + len + " : " + step + " = " + cnt + " (khoảng)", "Number of gaps: " + len + " ÷ " + step + " = " + cnt + " (gaps)"), cnt), st(LT("Số cây: " + cnt + " + 1 = " + (cnt + 1) + " (cây)", "Number of trees: " + cnt + " + 1 = " + (cnt + 1) + " (trees)"), cnt + 1)],
     tip: LT("Hai đầu đều trồng: số cây = số khoảng + 1.", "Trees at both ends: number of trees = number of gaps + 1."),
     diag: DG.off1,
     hintFig: {
      fb: FB.trees(len, step, "2"),
      f: 1
     }
    });
    if (tier === 2) {
     let m = r.pick(["1", "0", "2", "k"]);
     if (m === "k") return QQ({
      q: LT("Quanh một cái hồ có chu vi **" + len + " m**, người ta trồng cây, hai cây liền nhau cách nhau **" + step + " m**. Hỏi trồng được bao nhiêu cây?", "Trees are planted around a lake with a perimeter of **" + len + " m**, and two neighboring trees are **" + step + " m** apart. How many trees can be planted?"),
      parts: [num("", cnt, LT("cây", "trees"))],
      steps: [st(LT("Số khoảng: " + len + " : " + step + " = " + cnt + " (khoảng)", "Number of gaps: " + len + " ÷ " + step + " = " + cnt + " (gaps)"), cnt), st(LT("Đường khép kín: số cây = số khoảng = " + cnt + " (cây)", "Closed path: number of trees = number of gaps = " + cnt + " (trees)"), cnt)],
      diag: (vals, q) => Math.abs(V(vals, 0) - cnt) === 1 ? {
       kind: "lech1",
       msg: LT("Đường quanh hồ là đường khép kín: cây cuối trùng cây đầu, nên số cây = số khoảng.", "The path around a lake is closed: the last tree lands on the first tree, so number of trees = number of gaps.")
      } : null,
      tip: LT("Đường khép kín thì số cây bằng số khoảng.", "On a closed path, the number of trees equals the number of gaps.")
     });
     let txt = {
       2: LT("hai đầu đường đều có cây", "There are trees at both ends of the road"),
       1: LT("chỉ trồng ở một đầu đường", "A tree is planted at only one end of the road"),
       0: LT("hai đầu đường không trồng cây", "There are no trees at either end of the road")
      } [m],
      n2 = m === "2" ? cnt + 1 : m === "1" ? cnt : cnt - 1,
      s2 = LT(m === "2" ? "Số cây: " + cnt + " + 1 = " + n2 + " (cây)" : m === "1" ? "Trồng một đầu: số cây = số khoảng = " + n2 + " (cây)" : "Số cây: " + cnt + " − 1 = " + n2 + " (cây)", m === "2" ? "Number of trees: " + cnt + " + 1 = " + n2 + " (trees)" : m === "1" ? "One end planted: number of trees = number of gaps = " + n2 + " (trees)" : "Number of trees: " + cnt + " − 1 = " + n2 + " (trees)");
     return QQ({
      q: LT("Người ta trồng cây dọc một bên đường dài **" + len + " m**, " + txt + ", hai cây liền nhau cách nhau **" + step + " m**. Hỏi cần bao nhiêu cây?", "Trees are planted along one side of a road that is **" + len + " m** long. " + txt + ", and two neighboring trees are **" + step + " m** apart. How many trees are needed?"),
      parts: [num("", n2, LT("cây", "trees"))],
      steps: [st(LT("Số khoảng: " + len + " : " + step + " = " + cnt + " (khoảng)", "Number of gaps: " + len + " ÷ " + step + " = " + cnt + " (gaps)"), cnt), st(s2, n2)],
      tip: LT("Xem hai đầu đường có trồng cây không rồi áp dụng quy tắc.", "Check whether the ends of the road have trees, then use the rule."),
      diag: DG.off1,
      hintFig: {
       fb: FB.trees(len, step, m),
       f: 1
      }
     })
    }
    let n = cnt + 1,
     L = cnt * step;
    return QQ({
     q: LT("⭐ Thử thách: Người ta trồng **" + n + " cây** dọc một bên đường, hai đầu đường đều có cây, hai cây liền nhau cách nhau **" + step + " m**. Hỏi con đường dài bao nhiêu mét?", "⭐ Challenge: **" + n + " trees** are planted along one side of a road. There are trees at both ends of the road, and two neighboring trees are **" + step + " m** apart. How many meters long is the road?"),
     parts: [num("", L, "m")],
     steps: [st(LT("Số khoảng: " + n + " − 1 = " + cnt + " (khoảng)", "Number of gaps: " + n + " − 1 = " + cnt + " (gaps)"), cnt), st(LT("Độ dài: " + cnt + " × " + step + " = " + L + " (m)", "Length: " + cnt + " × " + step + " = " + L + " (m)"), L)],
     tip: LT("Làm ngược: hai đầu đều trồng nên số khoảng = số cây − 1.", "Work backward: trees at both ends means number of gaps = number of trees − 1.")
    })
   }
  });
  addAsks("trees", [{
   after: 1,
   say: LT("Cùng làm: đường dài 40 m, cứ 10 m có một cây. Có mấy khoảng cách?", "Let's do it together: the road is 40 m long, with a tree every 10 m. How many gaps are there?"),
   opts: ["3", "4", "5"],
   ans: "4",
   good: LT("Đúng! 40 : 10 = 4 (khoảng).", "Correct! 40 ÷ 10 = 4 (gaps).")
  }, {
   after: 2,
   say: LT("Có 4 khoảng, hai đầu đường đều có cây. Có mấy cây?", "There are 4 gaps, and there are trees at both ends of the road. How many trees are there?"),
   opts: ["4", "5", "3"],
   ans: "5",
   good: LT("Đúng! Hai đầu đều trồng thì số cây nhiều hơn số khoảng 1.", "Correct! With trees at both ends, there is 1 more tree than gaps.")
  }, {
   after: 6,
   say: LT("Cùng làm: quanh hồ có chu vi 40 m, hai cây liền nhau cách nhau 10 m. Trồng được mấy cây?", "Let's do it together: a lake has a perimeter of 40 m, and two neighboring trees are 10 m apart. How many trees can be planted?"),
   opts: ["4", "5", "3"],
   ans: "4",
   good: LT("Đúng! Đường khép kín: số cây = số khoảng = 40 : 10 = 4.", "Correct! Closed path: number of trees = number of gaps = 40 ÷ 10 = 4.")
  }]);
  extendTier("trees", 3, [r => {
   let s = r.pick([2, 3, 4, 5, 6, 8, 10]),
    c = rd(r, 6, 30),
    L = c * s;
   return QQ({
    q: LT("Người ta trồng cây ở **hai bên** một con đường dài **" + L + " m**. Ở mỗi bên, hai đầu đường đều có cây và hai cây liền nhau cách nhau **" + s + " m**. Hỏi cả hai bên trồng bao nhiêu cây?", "Trees are planted on **both sides** of a road that is **" + L + " m** long. On each side, there are trees at both ends of the road, and two neighboring trees are **" + s + " m** apart. How many trees are planted on both sides in all?"),
    parts: [num("", 2 * (c + 1), LT("cây", "trees"))],
    steps: [st(LT("Số khoảng mỗi bên: " + L + " : " + s + " = " + c + " (khoảng)", "Number of gaps on each side: " + L + " ÷ " + s + " = " + c + " (gaps)"), c), st(LT("Mỗi bên: " + c + " + 1 = " + (c + 1) + " (cây)", "Each side: " + c + " + 1 = " + (c + 1) + " (trees)"), c + 1), st(LT("Hai bên: " + (c + 1) + " × 2 = " + 2 * (c + 1) + " (cây)", "Both sides: " + (c + 1) + " × 2 = " + 2 * (c + 1) + " (trees)"), 2 * (c + 1))],
    diag: DG.any((vals, q) => V(vals, 0) === c + 1 ? {
     kind: "hai_ben",
     msg: LT("Đó là số cây một bên. Đề nói trồng hai bên đường.", "That is the number of trees on one side. The problem says trees are planted on both sides of the road.")
    } : null, (vals, q) => Math.abs(V(vals, 0) - 2 * (c + 1)) === 2 ? {
     kind: "lech1",
     msg: LT("Mỗi bên hai đầu đều trồng: số cây mỗi bên = số khoảng + 1.", "Trees at both ends on each side: trees on each side = number of gaps + 1.")
    } : null),
    tip: LT("Tính số cây một bên trước, rồi nhân 2.", "Find the number of trees on one side first, then double it."),
    hintFig: {
     fb: FB.trees(L, s, "2"),
     f: 1
    }
   })
  }, r => {
   let A = rd(r, 30, 120),
    B = rd(r, 20, A - 5),
    P = 2 * (A + B),
    s = r.pick([2, 4, 5, 10].filter(x => P % x === 0)),
    c = P / s;
   return QQ({
    q: LT("Một khu vườn hình chữ nhật dài **" + A + " m**, rộng **" + B + " m**. Người ta trồng cây quanh vườn, hai cây liền nhau cách nhau **" + s + " m**. Hỏi trồng được bao nhiêu cây?", "A rectangular garden is **" + A + " m** long and **" + B + " m** wide. Trees are planted around the garden, and two neighboring trees are **" + s + " m** apart. How many trees can be planted?"),
    parts: [num("", c, LT("cây", "trees"))],
    steps: [st(LT("Chu vi vườn: (" + A + " + " + B + ") × 2 = " + P + " (m)", "Perimeter of the garden: (" + A + " + " + B + ") × 2 = " + P + " (m)"), P), st(LT("Số khoảng: " + P + " : " + s + " = " + c + " (khoảng)", "Number of gaps: " + P + " ÷ " + s + " = " + c + " (gaps)"), c), st(LT("Đường khép kín: số cây = số khoảng = " + c + " (cây)", "Closed path: number of trees = number of gaps = " + c + " (trees)"), c)],
    diag: DG.any(DG.step([P, A + B]), (vals, q) => Math.abs(V(vals, 0) - c) === 1 ? {
     kind: "lech1",
     msg: LT("Đường quanh vườn là đường khép kín: cây cuối trùng cây đầu, nên số cây = số khoảng.", "The path around a garden is closed: the last tree lands on the first tree, so number of trees = number of gaps.")
    } : null),
    tip: LT("Tính chu vi trước. Đường khép kín thì không cộng 1.", "Find the perimeter first. On a closed path, do not add 1.")
   })
  }, r => {
   let s = r.pick([4, 5, 6, 8, 10]),
    n2 = rd(r, 25, 60),
    m = r.pick(["1", "0"]),
    c = m === "1" ? n2 : n2 + 1,
    L = c * s;
   return QQ({
    q: LT("⭐ Thử thách: Người ta trồng **" + n2 + " cây** dọc một bên đường, " + (m === "1" ? "chỉ trồng ở một đầu đường" : "hai đầu đường không trồng cây") + ", hai cây liền nhau cách nhau **" + s + " m**. Hỏi con đường dài bao nhiêu mét?", "⭐ Challenge: **" + n2 + " trees** are planted along one side of a road. " + (m === "1" ? "A tree is planted at only one end of the road" : "There are no trees at either end of the road") + ", and two neighboring trees are **" + s + " m** apart. How many meters long is the road?"),
    parts: [num("", L, "m")],
    steps: [st(LT(m === "1" ? "Trồng một đầu: số khoảng = số cây = " + c + " (khoảng)" : "Hai đầu không trồng: số khoảng = số cây + 1 = " + n2 + " + 1 = " + c + " (khoảng)", m === "1" ? "One end planted: number of gaps = number of trees = " + c + " (gaps)" : "No trees at the ends: number of gaps = number of trees + 1 = " + n2 + " + 1 = " + c + " (gaps)"), c), st(LT("Độ dài: " + c + " × " + s + " = " + L + " (m)", "Length: " + c + " × " + s + " = " + L + " (m)"), L)],
    diag: (vals, q) => {
     let e = V(vals, 0);
     return e !== L && (e === (c - 1) * s || e === (c + 1) * s) ? {
      kind: "lech1",
      msg: LT("Xem lại: số khoảng hơn hay kém số cây bao nhiêu khi đầu đường " + (m === "1" ? "chỉ trồng một đầu" : "không trồng cây") + "?", "Look again: how does the number of gaps compare with the number of trees when " + (m === "1" ? "only one end has a tree" : "there are no trees at the ends") + "?")
     } : null
    },
    tip: LT("Làm ngược: tìm số khoảng trước, rồi nhân với khoảng cách.", "Work backward: find the number of gaps first, then multiply by the distance.")
   })
  }, r => {
   let s = r.pick([5, 8, 10, 12, 15, 20, 25]),
    c = rd(r, 3, 20),
    L = c * s;
   return QQ({
    q: LT("⭐ Thử thách: Một sợi dây dài **" + L + " cm** được cắt thành các đoạn dài **" + s + " cm**, mỗi lần cắt một chỗ. Hỏi phải cắt bao nhiêu lần?", "⭐ Challenge: A piece of rope that is **" + L + " cm** long is cut into pieces that are **" + s + " cm** long each, with one cut at a time. How many cuts are needed?"),
    parts: [num("", c - 1, LT("lần", "cuts"))],
    steps: [st(LT("Số đoạn: " + L + " : " + s + " = " + c + " (đoạn)", "Number of pieces: " + L + " ÷ " + s + " = " + c + " (pieces)"), c), st(LT("Số lần cắt ít hơn số đoạn 1: " + c + " − 1 = " + (c - 1) + " (lần)", "The number of cuts is 1 less than the number of pieces: " + c + " − 1 = " + (c - 1) + " (cuts)"), c - 1)],
    diag: (vals, q) => V(vals, 0) === c ? {
     kind: "lech1",
     msg: LT("Đó là số đoạn. Cắt " + (c - 1) + " lần đã được " + c + " đoạn (giống trồng cây mà hai đầu không trồng).", "That is the number of pieces. " + (c - 1) + " cuts already make " + c + " pieces (just like planting trees with no trees at the ends).")
    } : null,
    tip: LT("Giống trồng cây mà hai đầu không trồng: chỗ cắt nằm giữa các đoạn.", "Just like planting trees with no trees at the ends: the cuts go between the pieces.")
   })
  }], !0);

  function chickFig(n, rb, L) {
   if (n > 12) return;
   let a = FB.animals(n, 0);
   return {
    fb: {
     frames: [a.make(0, LT("Cả " + n + " con là gà: " + n + " × 2 = " + 2 * n + " chân", "All chickens: " + n + " × 2 = " + 2 * n + " legs"))],
     vb: a.vb
    },
    f: 0
   }
  }
  LESSON({
   id: "chick",
   reg: "toan",
   title: LT("Gà và thỏ", "Chickens and Rabbits"),
   emoji: "🐔",
   blurb: LT("Toán vui: phương pháp giả thiết tạm", "Fun math: the suppose-and-adjust method"),
   optional: !0,
   links: ["mul", "div"],
   rule: {
    h: LT("Giả thiết tạm", "Suppose and adjust"),
    items: [LT("Giả sử **tất cả đều là loại ít chân**, tính số chân.", "Suppose **all of them are the kind with fewer legs**, and work out the number of legs."), LT("Số chân còn thiếu = **số chân đề bài cho** − số chân khi giả sử.", "Missing legs = **legs given in the problem** − legs in the supposed case."), LT("Mỗi lần thay 1 con ít chân bằng 1 con nhiều chân thì số chân tăng thêm bằng hiệu số chân của hai con. Số con loại nhiều chân = số chân còn thiếu : hiệu đó.", "Each time we swap 1 animal with fewer legs for 1 animal with more legs, the number of legs goes up by the difference in legs between the two animals. Number of animals with more legs = missing legs ÷ that difference."), LT("Số con loại kia = tổng số con − số con vừa tìm.", "Number of the other kind of animal = total number of animals − the number just found.")]
   },
   figs: {
    a: () => {
     let a = FB.animals(5, 0);
     return {
      frames: [a.make(0, ""), a.make(0, LT("Cả 5 con là gà: 5 × 2 = 10 chân", "All chickens: 5 × 2 = 10 legs")), a.make(2, LT("Thiếu 14 − 10 = 4 chân → 2 thỏ, 3 gà", "4 legs short → 2 rabbits, 3 chickens"))],
      vb: a.vb
     }
    }
   },
   teach: [{
    key: "a",
    f: 0,
    say: LT("Có **5 con** vừa gà vừa thỏ, tất cả **14 chân**. Gà 2 chân, thỏ 4 chân. Mỗi loại bao nhiêu con?", "There are **5 animals**, some chickens and some rabbits, with **14 legs** in all. A chicken has 2 legs and a rabbit has 4 legs. How many of each are there?")
   }, {
    key: "a",
    f: 0,
    say: LT("Ta **giả sử tạm** cả 5 con đều là gà. Mỗi con gà có 2 chân.", "Let's **suppose** all 5 animals are chickens. Each chicken has 2 legs.")
   }, {
    key: "a",
    f: 1,
    say: LT("5 con gà có 5 × 2 = **10** chân. So với đề bài còn thiếu 14 − 10 = **4** chân. Mỗi lần thay 1 con gà bằng 1 con thỏ thì số chân tăng thêm 4 − 2 = **2** chân.", "5 chickens have 5 × 2 = **10** legs. Compared with the problem, we are missing 14 − 10 = **4** legs. Each time we swap 1 chicken for 1 rabbit, the number of legs goes up by 4 − 2 = **2** legs.")
   }, {
    key: "a",
    f: 2,
    say: LT("Phải thay 4 : 2 = **2** lần, nên có **2 con thỏ**. Số gà là 5 − 2 = **3** (con). Thử lại: 3 × 2 + 2 × 4 = 14. Đúng!", "We must swap 4 ÷ 2 = **2** times, so there are **2 rabbits**. The number of chickens is 5 − 2 = **3**. Check: 3 × 2 + 2 × 4 = 14. Correct!")
   }],
   gen(tier, r) {
    if (tier < 3) {
     let n2 = tier === 1 ? rd(r, 5, 10) : rd(r, 15, 40),
      rb = rd(r, 1, n2 - 1),
      L = 4 * rb + 2 * (n2 - rb);
     return QQ({
      q: LT("Vừa gà vừa thỏ có **" + n2 + " con** và **" + L + " chân**. Hỏi có bao nhiêu con gà, bao nhiêu con thỏ?", "There are **" + n2 + " animals**, chickens and rabbits, with **" + L + " legs** in all. How many chickens and how many rabbits are there?"),
      parts: [num(LT("Gà", "Chickens"), n2 - rb, LT("con", "")), num(LT("Thỏ", "Rabbits"), rb, LT("con", ""))],
      steps: [st(LT("Giả sử cả " + n2 + " con đều là gà: " + n2 + " × 2 = " + 2 * n2 + " (chân)", "Suppose all " + n2 + " animals are chickens: " + n2 + " × 2 = " + 2 * n2 + " (legs)"), 2 * n2), st(LT("So với đề bài còn thiếu: " + L + " − " + 2 * n2 + " = " + (L - 2 * n2) + " (chân)", "Compared with the problem, we are missing: " + L + " − " + 2 * n2 + " = " + (L - 2 * n2) + " (legs)"), L - 2 * n2), st(LT("Mỗi lần thay 1 gà bằng 1 thỏ, số chân tăng thêm: 4 − 2 = 2 (chân)", "Each time we swap 1 chicken for 1 rabbit, the legs go up by: 4 − 2 = 2 (legs)"), 2), st(LT("Số thỏ: " + (L - 2 * n2) + " : 2 = " + rb + " (con)", "Number of rabbits: " + (L - 2 * n2) + " ÷ 2 = " + rb + " (rabbits)"), rb), st(LT("Số gà: " + n2 + " − " + rb + " = " + (n2 - rb) + " (con)", "Number of chickens: " + n2 + " − " + rb + " = " + (n2 - rb) + " (chickens)"), n2 - rb)],
      tip: LT("Mỗi lần thay 1 con gà bằng 1 con thỏ thì số chân tăng thêm 2.", "Each time we swap 1 chicken for 1 rabbit, the number of legs goes up by 2."),
      diag: chickG(n2, 4, 2, L, LT("thỏ", "rabbits"), LT("gà", "chickens"), LT("chân", "legs")),
      hintFig: chickFig(n2, rb, L)
     })
    }
    let n = rd(r, 30, 60),
     t = rd(r, 2, n - 2),
     W = 3 * t + 2 * (n - t);
    return QQ({
     q: LT("Cửa hàng có xe đạp (2 bánh) và xe ba bánh, tất cả **" + n + " xe** với **" + W + " bánh**. Hỏi có bao nhiêu xe đạp, bao nhiêu xe ba bánh?", "A store has bicycles (2 wheels) and tricycles (3 wheels), **" + n + " vehicles** in all with **" + W + " wheels**. How many bicycles and how many tricycles are there?"),
     parts: [num(LT("Xe đạp", "Bicycles"), n - t, LT("xe", "")), num(LT("Xe ba bánh", "Tricycles"), t, LT("xe", ""))],
     steps: [st(LT("Giả sử tất cả là xe đạp: " + n + " × 2 = " + 2 * n + " (bánh)", "Suppose all are bicycles: " + n + " × 2 = " + 2 * n + " (wheels)"), 2 * n), st(LT("So với đề bài còn thiếu: " + W + " − " + 2 * n + " = " + (W - 2 * n) + " (bánh)", "Compared with the problem, we are missing: " + W + " − " + 2 * n + " = " + (W - 2 * n) + " (wheels)"), W - 2 * n), st(LT("Mỗi xe ba bánh nhiều hơn xe đạp 3 − 2 = 1 (bánh)", "Each tricycle has 1 more wheel than a bicycle: 3 − 2 = 1 (wheel)"), 1), st(LT("Số xe ba bánh: " + (W - 2 * n) + " : 1 = " + t + " (xe)", "Number of tricycles: " + (W - 2 * n) + " ÷ 1 = " + t + " (tricycles)"), t), st(LT("Số xe đạp: " + n + " − " + t + " = " + (n - t) + " (xe)", "Number of bicycles: " + n + " − " + t + " = " + (n - t) + " (bicycles)"), n - t)],
     tip: LT("Lần này mỗi lần thay 1 xe đạp bằng 1 xe ba bánh chỉ tăng thêm 1 bánh.", "This time, each swap of 1 bicycle for 1 tricycle adds only 1 wheel.")
    })
   }
  });
  addAsks("chick", [{
   after: 1,
   say: LT("Cùng làm: giả sử cả 5 con là gà thì có bao nhiêu chân?", "Let's do it together: if we suppose all 5 animals are chickens, how many legs are there?"),
   opts: ["10", "14", "20"],
   ans: "10",
   good: LT("Đúng! 5 × 2 = 10 chân.", "Correct! 5 × 2 = 10 legs.")
  }, {
   after: 2,
   say: LT("Cùng làm: còn thiếu 4 chân, mỗi lần thay gà bằng thỏ tăng thêm 2 chân. Có mấy con thỏ?", "Let's do it together: we are missing 4 legs, and each time we swap a chicken for a rabbit, the legs go up by 2. How many rabbits are there?"),
   opts: ["2", "4", "1"],
   ans: "2",
   good: LT("Đúng! 4 : 2 = 2 (con thỏ).", "Correct! 4 ÷ 2 = 2 (rabbits).")
  }]);

  function chickG(n, big, lo, L, nb, nl, u) {
   let dd = big - lo,
    x = (L - lo * n) / dd;
   return (vals, q) => {
    let e0 = V(vals, 0),
     e1 = V(vals, 1);
    return x !== n - x && e0 === x && e1 === n - x ? {
     kind: "nham",
     msg: LT("Con ghi ngược rồi. Phần " + u + " còn thiếu được bù bằng " + nb + " (" + big + " " + u + ").", "You wrote them backward. The missing " + u + " are made up by " + nb + " (" + big + " " + u + " each).")
    } : e1 === L - lo * n && dd > 1 ? {
     kind: "chia2",
     msg: LT("Số " + u + " còn thiếu chưa phải số " + nb + ". Mỗi lần thay bằng 1 " + nb + " chỉ tăng thêm " + dd + " " + u + ", nên phải chia cho " + dd + ".", "The missing " + u + " is not the number of " + nb + " yet. Each swap adds only " + dd + " " + u + ", so you must divide by " + dd + ".")
    } : null
   }
  }
  extendTier("chick", 3, (g => g.concat([g[1]]))([r => {
   let sp = r.pick([
     [LT("chó", "dogs"), LT("vịt", "ducks"), 4, 2, LT("chân", "legs"), LT("con", "animals")],
     [LT("ô tô", "cars"), LT("xe máy", "motorcycles"), 4, 2, LT("bánh", "wheels"), LT("xe", "vehicles")],
     [LT("nhện", "spiders"), LT("bọ cánh cứng", "beetles"), 8, 6, LT("chân", "legs"), LT("con", "animals")]
    ]),
    n = rd(r, 25, 50),
    x = rd(r, 1, n - 1),
    L = sp[2] * x + sp[3] * (n - x),
    dd = sp[2] - sp[3];
   return QQ({
    q: LT("Có tất cả **" + n + " " + sp[5] + "** gồm " + sp[0] + " (" + sp[2] + " " + sp[4] + ") và " + sp[1] + " (" + sp[3] + " " + sp[4] + "), đếm được **" + L + " " + sp[4] + "**. Hỏi có bao nhiêu " + sp[1] + ", bao nhiêu " + sp[0] + "?", "There are **" + n + " " + sp[5] + "** in all, made up of " + sp[0] + " (" + sp[2] + " " + sp[4] + " each) and " + sp[1] + " (" + sp[3] + " " + sp[4] + " each), with **" + L + " " + sp[4] + "** counted. How many " + sp[1] + " and how many " + sp[0] + " are there?"),
    parts: [num(sp[1].charAt(0).toUpperCase() + sp[1].slice(1), n - x, LT(sp[5], "")), num(sp[0].charAt(0).toUpperCase() + sp[0].slice(1), x, LT(sp[5], ""))],
    steps: [st(LT("Giả sử tất cả là " + sp[1] + ": " + n + " × " + sp[3] + " = " + n * sp[3] + " (" + sp[4] + ")", "Suppose all are " + sp[1] + ": " + n + " × " + sp[3] + " = " + n * sp[3] + " (" + sp[4] + ")"), n * sp[3]), st(LT("So với đề bài còn thiếu: " + L + " − " + n * sp[3] + " = " + (L - n * sp[3]) + " (" + sp[4] + ")", "Compared with the problem, we are missing: " + L + " − " + n * sp[3] + " = " + (L - n * sp[3]) + " (" + sp[4] + ")"), L - n * sp[3]), st(LT("Mỗi " + sp[0] + " nhiều hơn " + sp[1] + " " + sp[2] + " − " + sp[3] + " = " + dd + " (" + sp[4] + ")", "Swapping one of the " + sp[1] + " for one of the " + sp[0] + " adds " + sp[2] + " − " + sp[3] + " = " + dd + " (" + sp[4] + ")"), dd), st(LT("Số " + sp[0] + ": " + (L - n * sp[3]) + " : " + dd + " = " + x + " (" + sp[5] + ")", "Number of " + sp[0] + ": " + (L - n * sp[3]) + " ÷ " + dd + " = " + x + " (" + sp[5] + ")"), x), st(LT("Số " + sp[1] + ": " + n + " − " + x + " = " + (n - x) + " (" + sp[5] + ")", "Number of " + sp[1] + ": " + n + " − " + x + " = " + (n - x) + " (" + sp[5] + ")"), n - x)],
    diag: chickG(n, sp[2], sp[3], L, sp[0], sp[1], sp[4]),
    tip: LT("Giả sử tất cả là loại ít " + sp[4] + " hơn.", "Suppose all are the kind with fewer " + sp[4] + ".")
   })
  }, r => {
   let pr = r.pick([
     [50, 40],
     [50, 30],
     [60, 40],
     [80, 50],
     [100, 60],
     [100, 70]
    ]),
    pa = pr[0],
    pc = pr[1],
    n = rd(r, 8, 30) * 10,
    x = rd(r, Math.round(n / 5), Math.round(n * 3 / 5)),
    T = pa * x + pc * (n - x),
    dd = pa - pc;
   return QQ({
    q: LT("Một rạp xiếc bán được **" + n + " vé** gồm vé người lớn giá **" + fmt(pa * 1e3) + " đồng** và vé trẻ em giá **" + fmt(pc * 1e3) + " đồng**, thu được **" + fmt(T * 1e3) + " đồng**. Hỏi bán được bao nhiêu vé mỗi loại?", "A circus sold **" + n + " tickets**, made up of adult tickets at **" + fmt(pa * 1e3) + " dong** each and children's tickets at **" + fmt(pc * 1e3) + " dong** each, and collected **" + fmt(T * 1e3) + " dong**. How many tickets of each kind were sold?"),
    parts: [num(LT("Trẻ em", "Children"), n - x, LT("vé", "tickets")), num(LT("Người lớn", "Adults"), x, LT("vé", "tickets"))],
    steps: [st(LT("Tính theo nghìn đồng: vé người lớn " + pa + ", vé trẻ em " + pc + ", tổng tiền " + fmt(T) + " (nghìn đồng)", "Work in thousands of dong: adult ticket " + pa + ", children's ticket " + pc + ", total money " + fmt(T) + " (thousand dong)")), st(LT("Giả sử tất cả là vé trẻ em: " + n + " × " + pc + " = " + fmt(n * pc) + " (nghìn đồng)", "Suppose all are children's tickets: " + n + " × " + pc + " = " + fmt(n * pc) + " (thousand dong)"), n * pc), st(LT("So với số tiền thu được còn thiếu: " + fmt(T) + " − " + fmt(n * pc) + " = " + fmt(T - n * pc) + " (nghìn đồng)", "Compared with the money collected, we are missing: " + fmt(T) + " − " + fmt(n * pc) + " = " + fmt(T - n * pc) + " (thousand dong)"), T - n * pc), st(LT("Mỗi vé người lớn đắt hơn vé trẻ em: " + pa + " − " + pc + " = " + dd + " (nghìn đồng)", "Each adult ticket costs more than a children's ticket by: " + pa + " − " + pc + " = " + dd + " (thousand dong)"), dd), st(LT("Số vé người lớn: " + fmt(T - n * pc) + " : " + dd + " = " + x + " (vé)", "Number of adult tickets: " + fmt(T - n * pc) + " ÷ " + dd + " = " + x + " (tickets)"), x), st(LT("Số vé trẻ em: " + n + " − " + x + " = " + (n - x) + " (vé)", "Number of children's tickets: " + n + " − " + x + " = " + (n - x) + " (tickets)"), n - x)],
    diag: chickG(n, pa, pc, T, LT("vé người lớn", "adult tickets"), LT("vé trẻ em", "children's tickets"), LT("nghìn đồng", "thousand dong")),
    tip: LT("Giống bài gà và thỏ: giả sử tất cả là vé rẻ. Tính theo nghìn đồng cho gọn.", "Just like the chickens and rabbits problem: suppose all are the cheaper tickets. Work in thousands of dong to keep it short.")
   })
  }]), !0);
  function psRed(n, d) {
   let g = gcd(n, d);
   return [n / g, d / g]
  }

  function psTxt(n, d) {
   let p = psRed(n, d);
   return p[1] === 1 ? String(p[0]) : fr(p[0], p[1])
  }

  function psAns(n, d, unit) {
   let p = psRed(n, d);
   return p[1] === 1 ? num("", p[0], unit) : frp(p[0], p[1])
  }

  function psRS(n, d) {
   let g = gcd(n, d),
    p = psRed(n, d);
   if (p[1] === 1) return [st(LT("Kết quả: " + fr(n, d) + " = " + (d === 1 ? "" : n + " : " + d + " = ") + p[0], "Result: " + fr(n, d) + " = " + (d === 1 ? "" : n + " ÷ " + d + " = ") + p[0]), p[0])];
   return g === 1 ? [] : [st(LT("Rút gọn: chia cả tử và mẫu cho " + g + ": " + fr(n, d) + " = " + fr(p[0], p[1]), "Simplify: divide both the numerator and the denominator by " + g + ": " + fr(n, d) + " = " + fr(p[0], p[1])))]
  }
  var PSW = [LT("không", "zero"), LT("một", "one"), LT("hai", "two"), LT("ba", "three"), LT("bốn", "four"), LT("năm", "five"), LT("sáu", "six"), LT("bảy", "seven"), LT("tám", "eight"), LT("chín", "nine"), LT("mười", "ten")],
   psRead = (n, d) => LT(PSW[n] + " phần " + (d === 4 ? "tư" : PSW[d]), PSW[n] + " " + (d === 2 ? (n === 1 ? "half" : "halves") : ["", "", "", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth"][d] + (n === 1 ? "" : "s")));
  Object.assign(KIND_NAME, {
   sai_hieu: LT("Tính sai hiệu của hai số", "Found the wrong difference between the two numbers"),
   chua_lui_tuoi: LT("Chưa lùi về tuổi hiện nay", "Did not go back to the ages right now"),
   dung_dang: LT("Giá trị bằng nhưng không đúng dạng đề hỏi", "Equal value, but not the form the question asks for")
  });
  var exDg = (vals, q) => {
   let v = vals[0],
    a = q.parts[0].ans;
   return v && +v.d !== 0 && +v.n * a[1] === +v.d * a[0] && !(+v.n === a[0] && +v.d === a[1]) ? {
    kind: "dung_dang",
    msg: LT("Giá trị bằng nhau rồi, nhưng đề hỏi đúng phân số theo hình hoặc đề bài. Con đừng rút gọn hay đổi dạng nhé.", "The value is equal, but the question asks for exactly the fraction in the picture or the problem. Do not simplify or change its form.")
   } : null
  };
  LESSON({
   id: "frac",
   reg: "ps",
   title: LT("Phân số", "Fractions"),
   emoji: "🍕",
   blurb: LT("Đọc, viết, so sánh phân số", "Read, write, and compare fractions"),
   links: ["div"],
   rule: {
    h: LT("Nhớ nhé", "Remember"),
    items: [LT("Phân số {a/b}: **tử số** a viết trên gạch ngang, **mẫu số** b viết dưới gạch ngang.", "In the fraction {a/b}, the **numerator** a goes above the fraction bar and the **denominator** b goes below it."), LT("Mẫu số cho biết hình được chia thành mấy phần bằng nhau; tử số cho biết đã tô màu mấy phần.", "The denominator tells how many equal parts the shape is split into; the numerator tells how many parts are colored in."), LT("Cùng mẫu số: phân số nào có **tử số lớn hơn** thì lớn hơn.", "Same denominator: the fraction with the **bigger numerator** is bigger.")]
   },
   figs: {
    a: () => FB.frac([{
     pies: [{
      cx: 110,
      cy: 90,
      r: 66,
      den: 4,
      num: 0
     }],
     fr: [{
      x: 270,
      y: 92,
      n: "?",
      d: "?",
      s: 44
     }]
    }, {
     pies: [{
      cx: 110,
      cy: 90,
      r: 66,
      den: 4,
      num: 1
     }],
     fr: [{
      x: 270,
      y: 92,
      n: 1,
      d: 4,
      s: 44
     }],
     tx: [{
      x: 270,
      y: 172,
      t: LT("tô 1 trong 4 phần", "1 of 4 parts colored"),
      s: 17,
      c: "dark"
     }]
    }, {
     pies: [{
      cx: 110,
      cy: 90,
      r: 66,
      den: 4,
      num: 3
     }],
     fr: [{
      x: 270,
      y: 92,
      n: 3,
      d: 4,
      s: 44
     }],
     tx: [{
      x: 270,
      y: 172,
      t: LT("tô 3 trong 4 phần", "3 of 4 parts colored"),
      s: 17,
      c: "dark"
     }]
    }, {
     bars: [{
      y: 30,
      den: 4,
      num: 3,
      c: "pink",
      lab: [3, 4]
     }, {
      y: 100,
      den: 8,
      num: 6,
      c: "orange",
      lab: [6, 8]
     }],
     tx: [{
      x: 180,
      y: 180,
      t: LT("3/4 = 6/8: phần tô màu bằng nhau", "3/4 = 6/8: the colored parts are equal"),
      s: 19
     }]
    }], {
     h: 200
    })
   },
   teach: [{
    key: "a",
    f: 0,
    say: LT("Chia hình tròn thành **4 phần bằng nhau**. Số 4 này gọi là **mẫu số**.", "Split the circle into **4 equal parts**. This number 4 is called the **denominator**.")
   }, {
    key: "a",
    f: 1,
    say: LT("Tô màu **1 phần**. Số phần tô màu là **tử số**. Ta viết phân số {1/4}, đọc là **một phần tư**.", "Color in **1 part**. The number of colored parts is the **numerator**. We write the fraction {1/4}, and read it as **one fourth**.")
   }, {
    key: "a",
    f: 2,
    say: LT("Tô màu 3 phần thì viết {3/4}, đọc là **ba phần tư**. **Tử số** 3 viết **trên** gạch ngang, **mẫu số** 4 viết **dưới** gạch ngang.", "Color in 3 parts and we write {3/4}, read as **three fourths**. The **numerator** 3 goes **above** the fraction bar, and the **denominator** 4 goes **below** it.")
   }, {
    key: "a",
    f: 2,
    say: LT("Mẫu số cho biết hình được chia thành mấy phần bằng nhau, tử số cho biết đã tô màu mấy phần. Cùng mẫu số 4: 3 > 1 nên {3/4} > {1/4}.", "The denominator tells how many equal parts the shape is split into, and the numerator tells how many parts are colored. Same denominator 4: 3 > 1, so {3/4} > {1/4}.")
   }, {
    key: "a",
    f: 3,
    say: LT("Chia thanh thành 8 phần bằng nhau và tô màu 6 phần thì được {6/8}. Phần tô màu bằng đúng phần tô màu của {3/4}, nên {6/8} = {3/4}.", "Split the bar into 8 equal parts and color in 6 parts, and we get {6/8}. The colored part is exactly the same as the colored part of {3/4}, so {6/8} = {3/4}.")
   }, {
    key: "a",
    f: 3,
    say: LT("Vì sao? **Chia cả tử và mẫu cho 2**: 6 : 2 = 3 và 8 : 2 = 4, ta được {3/4}.", "Why? **Divide both the numerator and the denominator by 2**: 6 ÷ 2 = 3 and 8 ÷ 2 = 4, so we get {3/4}.")
   }],
   gen(tier, r) {
    if (tier === 1) {
     let k = r.f();
     if (k < .4) {
      let d2 = rd(r, 2, 8),
       n2 = rd(r, 1, d2 - 1);
      return QQ({
       q: LT("Hình tròn chia thành các phần bằng nhau. Viết phân số chỉ **phần tô màu**.", "The circle is split into equal parts. Write the fraction for the **colored part**."),
       fig: {
        fb: FB.frac([{
         pies: [{
          cx: 180,
          cy: 80,
          r: 62,
          den: d2,
          num: n2
         }]
        }], {
         h: 160
        }),
        f: 0
       },
       parts: [Object.assign(frp(n2, d2), {
        exact: !0
       })],
       diag: exDg,
       steps: [st(LT("Hình chia thành " + d2 + " phần bằng nhau → mẫu số là " + d2, "The shape is split into " + d2 + " equal parts → the denominator is " + d2)), st(LT("Tô màu " + n2 + " phần → tử số là " + n2 + ". Phân số " + fr(n2, d2), "Color in " + n2 + (n2 === 1 ? " part" : " parts") + " → the numerator is " + n2 + ". The fraction is " + fr(n2, d2)))],
       tip: LT("Đếm tổng số phần (mẫu số) và số phần tô màu (tử số).", "Count the total number of parts (denominator) and the number of colored parts (numerator).")
      })
     }
     let d = rd(r, 2, 10),
      n = rd(r, 1, d - 1);
     if (k < .6) {
      let isT = r.chance(.5);
      return QQ({
       q: LT("Phân số " + fr(n, d) + " có **" + (isT ? "tử số" : "mẫu số") + "** là số nào?", "What is the **" + (isT ? "numerator" : "denominator") + "** of the fraction " + fr(n, d) + "?"),
       parts: [chp(r.shuffle([String(n), String(d), String(n + d)]), String(isT ? n : d))],
       steps: [st(LT("Tử số viết trên gạch ngang: " + n + "; mẫu số viết dưới gạch ngang: " + d, "The numerator goes above the fraction bar: " + n + "; the denominator goes below the fraction bar: " + d))],
       tip: LT("Tử số ở trên, mẫu số ở dưới.", "The numerator is on top, the denominator is on the bottom.")
      })
     }
     if (k < .8) {
      let right = psRead(n, d),
       o = [right, n === 1 ? psRead(2, d) : psRead(d, n), psRead(n, d === 10 ? 9 : d + 1)];
      return QQ({
       q: LT("Phân số " + fr(n, d) + " đọc là:", "The fraction " + fr(n, d) + " is read as:"),
       parts: [chp(r.shuffle(o), right)],
       steps: [st(LT("Đọc tử số trước, rồi đọc \"phần\", rồi đọc mẫu số: " + right, "Read the numerator first, then the denominator: " + right))],
       tip: LT("Đọc tử số – \"phần\" – mẫu số.", "Read the numerator, then the denominator.")
      })
     }
     return QQ({
      q: LT("Viết phân số: **" + psRead(n, d) + "**.", "Write the fraction: **" + psRead(n, d) + "**."),
      parts: [Object.assign(frp(n, d), {
       exact: !0
      })],
      diag: exDg,
      steps: [st(LT("Tử số là " + n + " (viết trên gạch ngang), mẫu số là " + d + " (viết dưới gạch ngang): " + fr(n, d), "The numerator is " + n + " (above the fraction bar) and the denominator is " + d + " (below the fraction bar): " + fr(n, d)))],
      tip: LT("Số đọc trước là tử số, số đọc sau chữ \"phần\" là mẫu số.", "The number you say first is the numerator, and the number you say after it is the denominator.")
     })
    }
    if (tier === 2) {
     let k = r.f();
     if (k < .2) {
      let d3 = rd(r, 4, 10),
       n3 = rd(r, 2, d3 - 2);
      return QQ({
       q: LT("Băng giấy chia thành các phần bằng nhau, một số phần được tô màu. Viết phân số chỉ **phần tô màu** và phân số chỉ **phần không tô màu**.", "The paper strip is split into equal parts, and some parts are colored. Write the fraction for the **colored part** and the fraction for the **part that is not colored**."),
       fig: {
        fb: FB.frac([{
         bars: [{
          y: 40,
          h: 44,
          den: d3,
          num: n3
         }]
        }], {
         h: 130
        }),
        f: 0
       },
       parts: [Object.assign(frp(n3, d3, LT("Tô màu", "Colored")), {
        exact: !0
       }), Object.assign(frp(d3 - n3, d3, LT("Không tô", "Not colored")), {
        exact: !0
       })],
       steps: [st(LT("Băng giấy chia thành " + d3 + " phần bằng nhau, tô màu " + n3 + " phần → " + fr(n3, d3), "The strip is split into " + d3 + " equal parts, and " + n3 + " parts are colored → " + fr(n3, d3))), st(LT("Phần không tô màu: " + d3 + " − " + n3 + " = " + (d3 - n3) + " phần → " + fr(d3 - n3, d3), "Part not colored: " + d3 + " − " + n3 + " = " + (d3 - n3) + " parts → " + fr(d3 - n3, d3)))],
       tip: LT("Hai phân số có cùng mẫu số; tử số cộng lại bằng mẫu số.", "The two fractions have the same denominator, and the numerators add up to the denominator.")
      })
     }
     if (k < .45) {
      let d2 = rd(r, 3, 10),
       n2 = rd(r, 1, d2 - 1);
      return QQ({
       q: LT("Hình tròn chia thành các phần bằng nhau. Viết phân số chỉ **phần không tô màu**.", "The circle is split into equal parts. Write the fraction for the **part that is not colored**."),
       fig: {
        fb: FB.frac([{
         pies: [{
          cx: 180,
          cy: 80,
          r: 62,
          den: d2,
          num: n2
         }]
        }], {
         h: 160
        }),
        f: 0
       },
       parts: [Object.assign(frp(d2 - n2, d2), {
        exact: !0
       })],
       diag: exDg,
       steps: [st(LT("Hình chia thành " + d2 + " phần bằng nhau → mẫu số là " + d2, "The shape is split into " + d2 + " equal parts → the denominator is " + d2)), st(LT("Không tô màu: " + d2 + " − " + n2 + " = " + (d2 - n2) + " phần → " + fr(d2 - n2, d2), "Not colored: " + d2 + " − " + n2 + " = " + (d2 - n2) + ((d2 - n2) === 1 ? " part" : " parts") + " → " + fr(d2 - n2, d2)), d2 - n2)],
       tip: LT("Đề hỏi phần **không** tô màu.", "The question asks for the part that is **not** colored.")
      })
     }
     let d2 = rd(r, 5, 12),
      n1 = rd(r, 1, d2 - 1),
      n2 = rd(r, 1, d2 - 1);
     for (; n2 === n1;) n2 = rd(r, 1, d2 - 1);
     if (k < .7) {
      let o = r.shuffle([fr(n1, d2), fr(n2, d2)]),
       big = Math.max(n1, n2),
       sm = Math.min(n1, n2);
      return QQ({
       q: LT("Phân số nào **lớn hơn**?", "Which fraction is **bigger**?"),
       parts: [chp(o, fr(big, d2))],
       steps: [st(LT("Cùng mẫu số " + d2 + ": so sánh tử số, " + big + " > " + sm, "Same denominator " + d2 + ": compare the numerators, " + big + " > " + sm)), st(LT("Nên " + fr(big, d2) + " > " + fr(sm, d2), "So " + fr(big, d2) + " > " + fr(sm, d2)))],
       tip: LT("Cùng mẫu số: tử số lớn hơn thì phân số lớn hơn.", "Same denominator: the bigger numerator means the bigger fraction.")
      })
     }
     let sg = n1 > n2 ? ">" : "<";
     return QQ({
      q: LT(`Chọn dấu thích hợp:
` + fr(n1, d2) + "  **?**  " + fr(n2, d2), `Choose the correct sign:\n` + fr(n1, d2) + "  **?**  " + fr(n2, d2)),
      parts: [chp(["<", "=", ">"], sg)],
      steps: [st(LT("Cùng mẫu số " + d2 + ": so sánh tử số " + n1 + " " + sg + " " + n2, "Same denominator " + d2 + ": compare the numerators " + n1 + " " + sg + " " + n2)), st(LT("Nên " + fr(n1, d2) + " " + sg + " " + fr(n2, d2), "So " + fr(n1, d2) + " " + sg + " " + fr(n2, d2)))],
      tip: LT("Cùng mẫu số: so sánh tử số.", "Same denominator: compare the numerators.")
     })
    }
    let d = rd(r, 3, 9),
     n = rd(r, 2, d - 1);
    for (; gcd(n, d) > 1;) n = rd(r, 1, d - 1);
    let k = rd(r, 3, 12),
     N = d * k;
    return QQ({
     q: LT("Tìm " + fr(n, d) + " của **" + N + "**.", "Find " + fr(n, d) + " of **" + N + "**."),
     parts: [num("", n * k)],
     steps: [st(LT(N + " : " + d + " = " + k + " (một phần)", N + " ÷ " + d + " = " + k + " (one part)"), k), st(k + " × " + n + " = " + n * k, n * k)],
     tip: LT("Chia cho mẫu số, rồi nhân với tử số.", "Divide by the denominator, then multiply by the numerator."),
     diag: DG.fracOf(k)
    })
   }
  });
  addAsks("frac", [{
   after: 1,
   f: 2,
   say: LT("Cùng làm: nhìn hình, phần tô màu là phân số nào?", "Let's do it together: look at the picture. Which fraction is colored?"),
   opts: ["{3/4}", "{4/3}", "{1/4}"],
   ans: "{3/4}",
   good: LT("Đúng! Tô màu 3 trong 4 phần.", "Correct! 3 of the 4 parts are colored.")
  }]);
  extendTier("frac", 3, [r => {
   let d = r.pick([3, 4, 5, 6, 7, 8]),
    nn = rd(r, 1, d - 1),
    k = rd(r, 3, 8),
    N = d * k,
    g = nn * k,
    ans = N - g;
   return QQ({
    q: LT("Lớp 4A có **" + N + " học sinh**, trong đó {" + nn + "/" + d + "} số học sinh là học sinh nữ. Hỏi lớp có bao nhiêu học sinh **nam**?", "Class 4A has **" + N + " students**. {" + nn + "/" + d + "} of the students are girls. How many **boys** are in the class?"),
    parts: [num("", ans, LT("học sinh", "students"))],
    steps: [st(LT("Số học sinh nữ: " + N + " : " + d + " × " + nn + " = " + g, "Number of girls: " + N + " ÷ " + d + " × " + nn + " = " + g), g), st(LT("Số học sinh nam: " + N + " − " + g + " = " + ans, "Number of boys: " + N + " − " + g + " = " + ans), ans)],
    diag: DG.any(DG.step([g], LT("Đó là số bạn nữ. Đề hỏi số bạn nam.", "That is the number of girls. The question asks for the number of boys.")), DG.fracOf(k)),
    tip: LT("Tìm số bạn nữ trước.", "Find the number of girls first.")
   })
  }, r => {
   let d = r.pick([3, 4, 5, 6, 8, 10]),
    nn = rd(r, 1, d - 1),
    k = rd(r, 4, 15),
    N = d * k,
    u = nn * k;
   return QQ({
    q: LT("Một tấm vải dài **" + N + " m**. Người ta đã bán {" + nn + "/" + d + "} tấm vải. Hỏi còn lại bao nhiêu mét vải?", "A piece of cloth is **" + N + " m** long. {" + nn + "/" + d + "} of the cloth has been sold. How many meters of cloth are left?"),
    parts: [num("", N - u, "m")],
    steps: [st(LT("Đã bán: " + N + " : " + d + " × " + nn + " = " + u + " (m)", "Sold: " + N + " ÷ " + d + " × " + nn + " = " + u + " (m)"), u), st(LT("Còn lại: " + N + " − " + u + " = " + (N - u) + " (m)", "Left: " + N + " − " + u + " = " + (N - u) + " (m)"), N - u)],
    diag: DG.any(DG.step([u]), DG.fracOf(k)),
    tip: LT("Tìm phần đã bán trước, rồi lấy cả tấm vải trừ đi.", "Find the sold part first, then subtract it from the whole piece.")
   })
  }], !0);
  LESSON({
   id: "simplify",
   reg: "ps",
   title: LT("Rút gọn phân số", "Simplifying Fractions"),
   short: LT("Rút gọn PS", "Simplify"),
   emoji: "✂️",
   blurb: LT("Chia tử và mẫu cho cùng một số", "Divide the numerator and denominator by the same number"),
   links: ["frac", "div"],
   rule: {
    h: LT("Quy tắc", "Rule"),
    items: [LT("Nếu tử số và mẫu số **cùng chia hết** cho một số lớn hơn 1 thì chia cả hai cho số đó.", "If the numerator and denominator are **both divisible** by a number greater than 1, divide both by that number."), LT("Làm đến khi không chia được nữa: đó là **phân số tối giản**.", "Keep going until you can't divide anymore: that is the **simplest form** of the fraction."), LT("Hãy thử chia cho 2, 3, 5, 10.", "Try dividing by 2, 3, 5, or 10.")]
   },
   figs: {
    a: () => {
     let mk = (n1, d1, n2, d2, k, t) => ({
      fr: [{
       x: 100,
       y: 80,
       n: n1,
       d: d1,
       s: 50
      }, {
       x: 260,
       y: 80,
       n: n2,
       d: d2,
       s: 50
      }],
      tx: [{
       x: 180,
       y: 44,
       t: LT(": ", "÷ ") + k,
       s: 24,
       c: "orange"
      }, {
       x: 180,
       y: 116,
       t: LT(": ", "÷ ") + k,
       s: 24,
       c: "orange"
      }, {
       x: 180,
       y: 84,
       t: "⟶",
       s: 34,
       c: "orange"
      }, {
       x: 180,
       y: 170,
       t: t,
       s: 18
      }]
     });
     return FB.frac([{
      fr: [{
       x: 120,
       y: 80,
       n: 12,
       d: 18,
       s: 50
      }],
      tx: [{
       x: 180,
       y: 170,
       t: LT("12 và 18 cùng chia hết cho 2", "12 and 18 are both divisible by 2"),
       s: 19
      }]
     }, mk(12, 18, 6, 9, 2, "12/18 = 6/9"), mk(6, 9, 2, 3, 3, LT("6/9 = 2/3, không rút gọn được nữa", "6/9 = 2/3, can't simplify any more")), mk(12, 18, 2, 3, 6, LT("Chia luôn cho 6: 12/18 = 2/3", "Divide by 6 right away: 12/18 = 2/3"))], {
      h: 200
     })
    }
   },
   teach: [{
    key: "a",
    f: 0,
    say: LT("Rút gọn {12/18}. 12 và 18 cùng chia hết cho số nào? Cả hai đều là số chẵn nên **cùng chia hết cho 2**.", "Simplify {12/18}. What number can both 12 and 18 be divided by? Both are even numbers, so they are **both divisible by 2**.")
   }, {
    key: "a",
    f: 1,
    say: LT("Chia cả tử và mẫu cho 2: 12 : 2 = 6 và 18 : 2 = 9. Ta được {12/18} = {6/9}.", "Divide both the numerator and the denominator by 2: 12 ÷ 2 = 6 and 18 ÷ 2 = 9. We get {12/18} = {6/9}.")
   }, {
    key: "a",
    f: 2,
    say: LT("6 và 9 **cùng chia hết cho 3**: 6 : 3 = 2 và 9 : 3 = 3. Ta được {6/9} = {2/3}.", "6 and 9 are **both divisible by 3**: 6 ÷ 3 = 2 and 9 ÷ 3 = 3. We get {6/9} = {2/3}.")
   }, {
    key: "a",
    f: 2,
    say: LT("2 và 3 không còn cùng chia hết cho số nào lớn hơn 1: {2/3} là **phân số tối giản**. Vậy {12/18} = {6/9} = {2/3}.", "2 and 3 have no common divisor greater than 1: {2/3} is in **simplest form**. So {12/18} = {6/9} = {2/3}.")
   }, {
    key: "a",
    f: 3,
    say: LT("Nhận xét: 12 và 18 **cùng chia hết cho 6**, nên có thể chia luôn cả tử và mẫu cho 6: {12/18} = {2/3}. Cách nào cũng ra cùng kết quả.", "Note: 12 and 18 are **both divisible by 6**, so we can divide both the numerator and the denominator by 6 right away: {12/18} = {2/3}. Either way gives the same result.")
   }],
   gen(tier, r) {
    let pr = [
      [1, 2],
      [1, 3],
      [2, 3],
      [3, 4],
      [2, 5],
      [3, 5],
      [4, 5],
      [5, 6],
      [5, 7],
      [3, 7],
      [4, 7],
      [5, 8],
      [7, 8],
      [4, 9],
      [7, 10],
      [3, 8]
     ],
     fs = r.pick(tier === 1 ? [
      [2],
      [3],
      [5],
      [2, 2],
      [10]
     ] : tier === 2 ? [
      [2, 2],
      [2, 3],
      [3, 3],
      [2, 5],
      [10, 2],
      [2, 2, 2],
      [3, 5],
      [2, 7],
      [2, 5, 2]
     ] : [
      [2, 2, 3],
      [2, 3, 3],
      [2, 2, 5],
      [10, 3],
      [2, 2, 2, 2],
      [2, 2, 3, 3],
      [5, 5],
      [3, 7],
      [2, 2, 7],
      [2, 2, 2, 3]
     ]),
     p = r.pick(pr),
     K = fs.reduce((a, b) => a * b, 1),
     n = p[0] * K,
     d = p[1] * K,
     a = n,
     b = d,
     steps = [];
    for (let f of fs) steps.push(st(LT(a + " và " + b + " cùng chia hết cho " + f + ": " + fr(a, b) + " = " + fr(a / f, b / f), a + " and " + b + " are both divisible by " + f + ": " + fr(a, b) + " = " + fr(a / f, b / f)))), a /= f, b /= f;
    steps.push(st(LT(p[0] + " và " + p[1] + " không cùng chia hết cho số nào lớn hơn 1 → " + fr(p[0], p[1]) + " là phân số tối giản", p[0] + " and " + p[1] + " have no common divisor greater than 1 → " + fr(p[0], p[1]) + " is in simplest form")));
    fs.length > 1 && steps.push(st(LT("Cách nhanh: " + n + " và " + d + " cùng chia hết cho " + K + ", chia luôn cho " + K + " cũng được " + fr(p[0], p[1]), "Shortcut: " + n + " and " + d + " are both divisible by " + K + ", so dividing by " + K + " right away also gives " + fr(p[0], p[1]))));
    return QQ({
     q: LT("Rút gọn phân số " + fr(n, d) + " thành phân số tối giản.", "Simplify the fraction " + fr(n, d) + " to its simplest form."),
     parts: [Object.assign(frp(p[0], p[1]), {
      exact: !0
     })],
     steps,
     tip: LT("Thử chia cả tử và mẫu cho 2, 3, 5, 10... Làm đến khi không chia được nữa.", "Try dividing both the numerator and the denominator by 2, 3, 5, 10... Keep going until you can't divide anymore."),
     diag: DG.simp(n, d)
    })
   }
  });
  addAsks("simplify", [{
   after: 3,
   say: LT("Cùng làm: 12 và 18 cùng chia hết cho số nào dưới đây?", "Let's do it together: which of these numbers can both 12 and 18 be divided by?"),
   opts: ["4", "5", "6"],
   ans: "6",
   good: LT("Đúng! 12 : 6 = 2 và 18 : 6 = 3.", "Correct! 12 ÷ 6 = 2 and 18 ÷ 6 = 3.")
  }]);
  LESSON({
   id: "fraccmp",
   reg: "ps",
   title: LT("Quy đồng, so sánh phân số", "Common Denominators & Comparing"),
   short: LT("Quy đồng", "Common denominator"),
   emoji: "⚖️",
   blurb: LT("Đưa về cùng mẫu số rồi so sánh", "Rewrite with the same denominator, then compare"),
   links: ["simplify"],
   rule: {
    h: LT("Cách làm", "How to do it"),
    items: [LT("**Quy đồng mẫu số**: nhân cả tử số và mẫu số của phân số đó với cùng một số để được **mẫu số chung**.", "**Common denominator**: multiply both the numerator and the denominator of a fraction by the same number to get a **common denominator**."), LT("Nếu mẫu số này chia hết cho mẫu số kia: lấy luôn mẫu số lớn làm mẫu số chung.", "If one denominator is divisible by the other, just use the bigger denominator as the common denominator."), LT("Nếu không chia hết: lấy **tích hai mẫu số** làm mẫu số chung.", "If not divisible: use the **product of the two denominators** as the common denominator."), LT("Cùng mẫu số: phân số nào có **tử số lớn hơn** thì lớn hơn.", "Same denominator: the fraction with the **bigger numerator** is bigger."), LT("Mẹo: cùng tử số thì phân số nào có **mẫu số bé hơn** thì lớn hơn.", "Tip: same numerator: the fraction with the **smaller denominator** is bigger.")]
   },
   figs: {
    a: () => FB.frac([{
     bars: [{
      y: 20,
      den: 3,
      num: 2,
      c: "pink",
      lab: [2, 3]
     }, {
      y: 90,
      den: 4,
      num: 3,
      c: "blue",
      lab: [3, 4]
     }],
     tx: [{
      x: 180,
      y: 170,
      t: LT("4 không chia hết cho 3", "4 is not divisible by 3"),
      s: 18
     }]
    }, {
     bars: [{
      y: 20,
      den: 12,
      num: 8,
      c: "pink",
      lab: [8, 12]
     }, {
      y: 90,
      den: 12,
      num: 9,
      c: "blue",
      lab: [9, 12]
     }],
     tx: [{
      x: 180,
      y: 170,
      t: LT("Cùng chia 12 phần: 8 < 9", "Both split into 12 parts: 8 < 9"),
      s: 19
     }]
    }], {
     h: 200
    }),
    b: () => FB.frac([{
     bars: [{
      y: 20,
      den: 6,
      num: 5,
      c: "pink",
      lab: [5, 6]
     }, {
      y: 90,
      den: 12,
      num: 7,
      c: "blue",
      lab: [7, 12]
     }],
     tx: [{
      x: 180,
      y: 170,
      t: LT("Khác mẫu số: phần to, phần nhỏ", "Different bottoms: big parts, small parts"),
      s: LT(18, 16)
     }]
    }, {
     bars: [{
      y: 20,
      den: 12,
      num: 10,
      c: "pink",
      lab: [10, 12]
     }, {
      y: 90,
      den: 12,
      num: 7,
      c: "blue",
      lab: [7, 12]
     }],
     tx: [{
      x: 180,
      y: 170,
      t: LT("Cùng chia 12 phần: 10 > 7", "Both split into 12 parts: 10 > 7"),
      s: 19
     }]
    }], {
     h: 200
    }),
    c: () => FB.frac([{
     bars: [{
      y: 20,
      den: 3,
      num: 2,
      c: "pink",
      lab: [2, 3]
     }, {
      y: 90,
      den: 5,
      num: 2,
      c: "blue",
      lab: [2, 5]
     }],
     tx: [{
      x: 180,
      y: 170,
      t: LT("Cùng tử số 2: mẫu bé hơn, phần to hơn", "Same top 2: smaller bottom, bigger parts"),
      s: LT(18, 16)
     }]
    }], {
     h: 200
    })
   },
   teach: [{
    key: "b",
    f: 0,
    say: LT("So sánh {5/6} và {7/12}. Hai thanh chia số phần **khác nhau** nên chưa so sánh ngay được.", "Compare {5/6} and {7/12}. The two bars are split into a **different** number of parts, so we can't compare them yet.")
   }, {
    key: "b",
    f: 0,
    say: LT("Ta thấy 12 : 6 = 2, tức là mẫu số 12 **chia hết** cho mẫu số 6. Lấy luôn **12 làm mẫu số chung**.", "We see that 12 ÷ 6 = 2, which means the denominator 12 is **divisible** by the denominator 6. So we use **12 as the common denominator**.")
   }, {
    key: "b",
    f: 1,
    say: LT("Vì 6 × 2 = 12 nên nhân cả tử và mẫu của {5/6} với 2: {5/6} = {10/12}. Mỗi phần sáu chia đôi thành 2 phần mười hai, nên số phần cũng gấp đôi. Giữ nguyên {7/12}.", "Since 6 × 2 = 12, multiply both the numerator and the denominator of {5/6} by 2: {5/6} = {10/12}. Each sixth splits in half into 2 twelfths, so the number of parts doubles too. Keep {7/12} the same.")
   }, {
    key: "b",
    f: 1,
    say: LT("Cùng làm: {10/12} và {7/12}, phân số nào lớn hơn?", "Let's do it together: {10/12} and {7/12}, which fraction is bigger?"),
    ask: {
     opts: ["{10/12}", "{7/12}"],
     ans: "{10/12}",
     good: LT("Đúng! Cùng mẫu số, tử 10 > 7. Vậy {5/6} > {7/12}.", "Correct! Same denominator, and the numerator 10 > 7. So {5/6} > {7/12}.")
    }
   }, {
    key: "a",
    f: 0,
    say: LT("Còn {2/3} và {3/4}: 4 không chia hết cho 3. Khi đó lấy mẫu số chung là tích hai mẫu số: 3 × 4 = **12**.", "Now {2/3} and {3/4}: 4 is not divisible by 3. In that case, we use the product of the two denominators as the common denominator: 3 × 4 = **12**.")
   }, {
    key: "a",
    f: 1,
    say: LT("{2/3} = {8/12} (nhân cả tử và mẫu với 4), {3/4} = {9/12} (nhân cả tử và mẫu với 3). Vì 8 < 9 nên {2/3} < {3/4}.", "{2/3} = {8/12} (multiply both the numerator and the denominator by 4), {3/4} = {9/12} (multiply both by 3). Since 8 < 9, {2/3} < {3/4}.")
   }, {
    key: "c",
    f: 0,
    say: LT("Mẹo: {2/3} và {2/5} **cùng tử số**. Phần ba to hơn phần năm, nên phân số nào có **mẫu số bé hơn** thì lớn hơn: {2/3} > {2/5}.", "Tip: {2/3} and {2/5} have the **same numerator**. A third is bigger than a fifth, so the fraction with the **smaller denominator** is bigger: {2/3} > {2/5}.")
   }],
   gen(tier, r) {
    let rp = d => {
      let n = rd(r, 1, d - 1);
      for (; gcd(n, d) > 1;) n = rd(r, 1, d - 1);
      return n
     },
     ord = (Ds, star) => {
      let D = r.pick(Ds),
       ds = [];
      for (let x = 2; x <= D; x++) D % x === 0 && ds.push(x);
      let fsr = [],
       g = 0;
      for (; fsr.length < 3 && g++ < 80;) {
       let d = fsr.length === 0 ? D : r.pick(ds),
        n = rp(d),
        v = n * D / d;
       fsr.some(f => f[2] === v) || fsr.push([n, d, v])
      }
      if (fsr.length < 3 || fsr.every(f => f[1] === D)) return ord(Ds, star);
      fsr = r.shuffle(fsr);
      let asc = fsr.slice().sort((p, q) => p[2] - q[2]),
       txt = a => a.map(f => fr(f[0], f[1])).join(" ; "),
       right = txt(asc),
       opts = [right, txt([asc[1], asc[0], asc[2]]), txt([asc[2], asc[1], asc[0]])],
       oth = fsr.filter(f => f[1] !== D);
      return QQ({
       q: LT("Xếp các phân số " + txt(fsr) + " theo thứ tự **từ bé đến lớn**.", "Put the fractions " + txt(fsr) + " in order **from least to greatest**."),
       parts: [chp(r.shuffle(opts), right)],
       steps: [st(LT(D + " chia hết cho các mẫu số còn lại → mẫu số chung là " + D, D + " is divisible by the other denominators → the common denominator is " + D)), st(LT("Quy đồng: " + oth.map(f => fr(f[0], f[1]) + " = " + fr(f[2], D) + " (nhân cả tử và mẫu với " + D / f[1] + ")").join("; "), "Common denominator: " + oth.map(f => fr(f[0], f[1]) + " = " + fr(f[2], D) + " (multiply the numerator and denominator by " + D / f[1] + ")").join("; "))), st(LT("So sánh tử số: " + asc.map(f => f[2]).join(" < ") + " → " + right, "Compare the numerators: " + asc.map(f => f[2]).join(" < ") + " → " + right))],
       tip: LT("Tìm mẫu số chia hết cho các mẫu số còn lại.", "Find a denominator that is divisible by the other denominators.")
      })
     };
    if (tier === 1) {
     let d = rd(r, 2, 6),
      k = rd(r, 2, 5),
      D2 = d * k,
      a = rp(d);
     if (r.chance(.25)) {
      let D = d * r.pick([2, 3]),
       b = rp(D),
       right = String(D),
       o = [right, String(d * D), String(d)];
      return QQ({
       q: LT("Quy đồng mẫu số hai phân số " + fr(a, d) + " và " + fr(b, D) + ". Chọn **mẫu số chung nhỏ nhất**.", "Find a common denominator for the fractions " + fr(a, d) + " and " + fr(b, D) + ". Choose the **least common denominator**."),
       parts: [chp(r.shuffle(o), right)],
       steps: [st(LT(D + " : " + d + " = " + D / d + ", tức là " + D + " chia hết cho " + d, D + " ÷ " + d + " = " + D / d + ", which means " + D + " is divisible by " + d)), st(LT("Lấy luôn " + D + " làm mẫu số chung", "Use " + D + " as the common denominator"))],
       tip: LT("Xem mẫu số lớn có chia hết cho mẫu số bé không.", "Check whether the bigger denominator is divisible by the smaller one.")
      })
     }
     return QQ({
      q: LT("Viết phân số bằng " + fr(a, d) + " có mẫu số là **" + D2 + "**.", "Write a fraction equal to " + fr(a, d) + " with the denominator **" + D2 + "**."),
      parts: [Object.assign(frp(a * k, D2), {
       exact: !0
      })],
      steps: [st(LT(D2 + " : " + d + " = " + k + " → nhân cả tử và mẫu với " + k, D2 + " ÷ " + d + " = " + k + " → multiply both the numerator and the denominator by " + k), k), st(a + " × " + k + " = " + a * k + "; " + d + " × " + k + " = " + D2 + " → " + fr(a, d) + " = " + fr(a * k, D2))],
      diag: DG.quyDong(a),
      hintFig: {
       fb: FB.frac([{
        bars: [{
         y: 20,
         den: d,
         num: a,
         c: "pink",
         lab: [a, d]
        }, {
         y: 90,
         den: D2,
         num: a * k,
         c: "blue",
         lab: [a * k, D2]
        }]
       }], {
        h: 150
       }),
       f: 0
      },
      tip: LT("Nhân cả tử số và mẫu số với cùng một số.", "Multiply both the numerator and the denominator by the same number.")
     })
    }
    if (tier === 2) {
     let kk = r.f();
     if (kk < .5) {
      let d = rd(r, 2, 6),
       k = rd(r, 2, 4),
       D2 = d * k,
       a = rp(d),
       b = rp(D2);
      r.chance(.15) && (b = a * k);
      let L = a * k,
       o = r.chance(.5),
       A = o ? fr(a, d) : fr(b, D2),
       B = o ? fr(b, D2) : fr(a, d),
       lx = o ? L : b,
       rx = o ? b : L,
       ans = lx > rx ? ">" : lx < rx ? "<" : "=";
      return QQ({
       q: LT(`Chọn dấu thích hợp:
` + A + "  **?**  " + B, `Choose the correct sign:\n` + A + "  **?**  " + B),
       parts: [chp(["<", "=", ">"], ans)],
       steps: [st(LT(D2 + " : " + d + " = " + k + " → mẫu số chung là " + D2, D2 + " ÷ " + d + " = " + k + " → the common denominator is " + D2)), st(LT("Nhân cả tử và mẫu của " + fr(a, d) + " với " + k + ": " + fr(a, d) + " = " + fr(L, D2), "Multiply both the numerator and the denominator of " + fr(a, d) + " by " + k + ": " + fr(a, d) + " = " + fr(L, D2))), st(LT("So sánh " + fr(lx, D2) + " và " + fr(rx, D2) + ": " + lx + " " + ans + " " + rx + ", nên " + A + " " + ans + " " + B, "Compare " + fr(lx, D2) + " and " + fr(rx, D2) + ": " + lx + " " + ans + " " + rx + ", so " + A + " " + ans + " " + B))],
       hintFig: D2 <= 24 ? {
        fb: FB.frac([{
         bars: [{
          y: 20,
          den: D2,
          num: L,
          c: "pink",
          lab: [a, d]
         }, {
          y: 90,
          den: D2,
          num: b,
          c: "blue",
          lab: [b, D2]
         }]
        }], {
         h: 150
        }),
        f: 0
       } : void 0,
       tip: LT("Đưa về cùng mẫu số " + D2 + ".", "Rewrite them with the same denominator " + D2 + ".")
      })
     }
     if (kk < .75) {
      let n = rd(r, 1, 5),
       d1 = rd(r, n + 1, 12),
       d2 = rd(r, n + 1, 12);
      for (; d2 === d1;) d2 = rd(r, n + 1, 12);
      let sg = d1 < d2 ? ">" : "<";
      return QQ({
       q: LT(`Chọn dấu thích hợp:
` + fr(n, d1) + "  **?**  " + fr(n, d2), `Choose the correct sign:\n` + fr(n, d1) + "  **?**  " + fr(n, d2)),
       parts: [chp(["<", "=", ">"], sg)],
       steps: [st(LT("Hai phân số cùng tử số " + n + ": phân số nào có mẫu số bé hơn thì lớn hơn", "Both fractions have the same numerator " + n + ": the fraction with the smaller denominator is bigger")), st(LT(d1 + (d1 < d2 ? " < " : " > ") + d2 + " nên " + fr(n, d1) + " " + sg + " " + fr(n, d2), d1 + (d1 < d2 ? " < " : " > ") + d2 + ", so " + fr(n, d1) + " " + sg + " " + fr(n, d2)))],
       tip: LT("Cùng tử số: mẫu số bé hơn thì phân số lớn hơn.", "Same numerator: the smaller denominator means the bigger fraction.")
      })
     }
     return ord([4, 6, 8, 10, 12])
    }
    let k3 = r.f(),
     kk = k3 < .3 ? 0 : k3 < .5 ? 1 : k3 < .75 ? 3 : 2;
    if (kk === 0) {
     let d1 = rd(r, 2, 7),
      d2 = rd(r, 2, 9);
     for (; d2 === d1 || gcd(d1, d2) > 1;) d2 = rd(r, 2, 9);
     let a = rp(d1),
      b = rp(d2),
      x = a * d2,
      y = b * d1,
      D = d1 * d2;
     if (x === y) return byId("fraccmp").gen(3, r);
     let sg = x > y ? ">" : "<";
     return QQ({
      q: LT(`⭐ Thử thách: Chọn dấu thích hợp:
` + fr(a, d1) + "  **?**  " + fr(b, d2), `⭐ Challenge: Choose the correct sign:\n` + fr(a, d1) + "  **?**  " + fr(b, d2)),
      parts: [chp(["<", "=", ">"], sg)],
      steps: [st(LT(Math.max(d1, d2) + " không chia hết cho " + Math.min(d1, d2) + " → mẫu số chung là " + d1 + " × " + d2 + " = " + D, Math.max(d1, d2) + " is not divisible by " + Math.min(d1, d2) + " → the common denominator is " + d1 + " × " + d2 + " = " + D)), st(LT(fr(a, d1) + " = " + fr(x, D) + " (nhân với " + d2 + "); " + fr(b, d2) + " = " + fr(y, D) + " (nhân với " + d1 + ")", fr(a, d1) + " = " + fr(x, D) + " (multiply by " + d2 + "); " + fr(b, d2) + " = " + fr(y, D) + " (multiply by " + d1 + ")")), st(LT(x + " " + sg + " " + y + " nên " + fr(a, d1) + " " + sg + " " + fr(b, d2), x + " " + sg + " " + y + ", so " + fr(a, d1) + " " + sg + " " + fr(b, d2)))],
      tip: LT("Mẫu số chung có thể lấy bằng tích hai mẫu số.", "The common denominator can be the product of the two denominators.")
     })
    }
    if (kk === 3) {
     for (let g = 0; g < 300; g++) {
      let D = r.pick([12, 18, 20, 24, 30]),
       ds = [];
      for (let t = 2; t <= D / 2; t++) D % t === 0 && ds.push(t);
      let d1 = r.pick(ds),
       d2 = r.pick(ds);
      if (d1 === d2) continue;
      let a = rd(r, 1, d1 - 1),
       b = rd(r, 1, d2 - 1);
      if (gcd(a, d1) > 1 || gcd(b, d2) > 1) continue;
      let A = a * D / d1,
       B = b * D / d2;
      if (B - A !== 2) continue;
      return QQ({
       q: LT("⭐ Thử thách: Tìm số tự nhiên **x** biết: " + fr(a, d1) + " < {x/" + D + "} < " + fr(b, d2), "⭐ Challenge: Find the whole number **x** such that " + fr(a, d1) + " < {x/" + D + "} < " + fr(b, d2)),
       parts: [num("x", A + 1)],
       steps: [st(LT("Quy đồng về mẫu số " + D + ": " + fr(a, d1) + " = " + fr(A, D) + "; " + fr(b, d2) + " = " + fr(B, D), "Rewrite with denominator " + D + ": " + fr(a, d1) + " = " + fr(A, D) + "; " + fr(b, d2) + " = " + fr(B, D))), st(LT(fr(A, D) + " < {x/" + D + "} < " + fr(B, D) + " nên " + A + " < x < " + B + ", vậy x = " + (A + 1), fr(A, D) + " < {x/" + D + "} < " + fr(B, D) + ", so " + A + " < x < " + B + " and x = " + (A + 1)), A + 1)],
       tip: LT("Quy đồng mẫu số rồi so sánh các tử số.", "Find a common denominator, then compare the numerators.")
      })
     }
     return ord([12, 16, 18, 20, 24])
    }
    if (kk === 1) return ord([12, 16, 18, 20, 24]);
    let d = rd(r, 2, 6),
     k = rd(r, 2, 4),
     D = d * k,
     a = rp(d),
     b = rp(D);
    let nm = r.shuffle(NAMES.slice(0, 6)),
     A = nm[0],
     B = nm[1],
     x = a * k,
     right = x > b ? A : B;
    return QQ({
     q: LT("Hai cái bánh như nhau. " + A + " ăn " + fr(a, d) + " cái bánh thứ nhất, " + B + " ăn " + fr(b, D) + " cái bánh thứ hai. Hỏi bạn nào ăn **nhiều hơn**?", "Two cakes are exactly the same. " + A + " ate " + fr(a, d) + " of the first cake, and " + B + " ate " + fr(b, D) + " of the second cake. Who ate **more**?"),
     parts: [chp([A, B], right)],
     steps: [st(LT(D + " : " + d + " = " + k + " → mẫu số chung là " + D + ": " + fr(a, d) + " = " + fr(x, D), D + " ÷ " + d + " = " + k + " → the common denominator is " + D + ": " + fr(a, d) + " = " + fr(x, D))), st(LT("So sánh " + fr(x, D) + " và " + fr(b, D) + ": " + x + (x > b ? " > " : " < ") + b + " → " + right + " ăn nhiều hơn", "Compare " + fr(x, D) + " and " + fr(b, D) + ": " + x + (x > b ? " > " : " < ") + b + " → " + right + " ate more"))],
     tip: LT("Quy đồng mẫu số rồi so sánh.", "Find a common denominator, then compare.")
    })
   }
  });
  LESSON({
   id: "fraddsub",
   reg: "ps",
   title: LT("Cộng, trừ phân số", "Adding and Subtracting Fractions"),
   short: LT("Cộng, trừ PS", "Add, subtract"),
   emoji: "🍰",
   blurb: LT("Cùng mẫu số, rồi khác mẫu số", "Same denominator first, then different denominators"),
   links: ["frac", "fraccmp", "addsub"],
   rule: {
    h: LT("Quy tắc", "Rule"),
    items: [LT("**Cùng mẫu số**: cộng (trừ) hai tử số, giữ nguyên mẫu số.", "**Same denominator**: add (subtract) the two numerators and keep the denominator."), LT("**Khác mẫu số**: quy đồng về cùng mẫu số, rồi cộng (trừ).", "**Different denominators**: rewrite them with a common denominator, then add (subtract)."), LT("Rút gọn kết quả nếu có thể.", "Simplify the result if you can.")]
   },
   figs: {
    a: () => FB.frac([{
     bars: [{
      y: 20,
      den: 8,
      num: 3,
      c: "pink",
      lab: [3, 8]
     }, {
      y: 90,
      den: 8,
      num: 2,
      c: "blue",
      lab: [2, 8]
     }],
     tx: [{
      x: 180,
      y: 170,
      t: LT("Hai thanh cùng chia 8 phần", "Both bars are split into 8 parts"),
      s: 18
     }]
    }, {
     bars: [{
      y: 20,
      den: 8,
      num: 3,
      c: "pink",
      lab: [3, 8]
     }, {
      y: 90,
      den: 8,
      num: 5,
      c: "purple",
      lab: [5, 8]
     }],
     tx: [{
      x: 180,
      y: 170,
      t: LT("3 phần + 2 phần = 5 phần", "3 parts + 2 parts = 5 parts"),
      s: 19
     }]
    }], {
     h: 200
    }),
    b: () => FB.frac([{
     bars: [{
      y: 20,
      den: 2,
      num: 1,
      c: "pink",
      lab: [1, 2]
     }, {
      y: 90,
      den: 8,
      num: 3,
      c: "blue",
      lab: [3, 8]
     }],
     tx: [{
      x: 180,
      y: 170,
      t: LT("Khác mẫu số: chưa cộng ngay được", "Different denominators: can't add yet"),
      s: 18
     }]
    }, {
     bars: [{
      y: 20,
      den: 8,
      num: 4,
      c: "pink",
      lab: [4, 8]
     }, {
      y: 90,
      den: 8,
      num: 3,
      c: "blue",
      lab: [3, 8]
     }],
     tx: [{
      x: 180,
      y: 170,
      t: "1/2 = 4/8 → 4/8 + 3/8 = 7/8",
      s: 19
     }]
    }, {
     bars: [{
      y: 20,
      den: 8,
      num: 4,
      c: "pink",
      lab: [4, 8]
     }, {
      y: 90,
      den: 8,
      num: 1,
      c: "purple",
      lab: [1, 8]
     }],
     tx: [{
      x: 180,
      y: 170,
      t: "4/8 − 3/8 = 1/8",
      s: 19
     }]
    }], {
     h: 200
    })
   },
   teach: [{
    key: "a",
    f: 0,
    say: LT("Tính {3/8} + {2/8}. Hai thanh đều chia thành **8 phần bằng nhau**, các phần có cùng kích cỡ.", "Find {3/8} + {2/8}. Both bars are split into **8 equal parts**, so the parts are the same size.")
   }, {
    key: "a",
    f: 1,
    say: LT("Cộng số phần: 3 + 2 = 5 phần. Vậy {3/8} + {2/8} = {5/8}. **Mẫu số giữ nguyên**, chỉ cộng tử số!", "Add the parts: 3 + 2 = 5 parts. So {3/8} + {2/8} = {5/8}. **Keep the denominator the same** and only add the numerators!")
   }, {
    key: "b",
    f: 0,
    say: LT("Còn {1/2} + {3/8}: hai phần này có kích cỡ khác nhau, ta chưa cộng được.", "Now {1/2} + {3/8}: these two parts are different sizes, so we can't add them yet.")
   }, {
    key: "b",
    f: 1,
    say: LT("Vì 8 : 2 = 4 nên lấy 8 làm mẫu số chung và nhân cả tử và mẫu của {1/2} với 4: {1/2} = {4/8}. Giờ cùng mẫu: {4/8} + {3/8} = **{7/8}**.", "Since 8 ÷ 2 = 4, we use 8 as the common denominator and multiply both the numerator and the denominator of {1/2} by 4: {1/2} = {4/8}. Now they have the same denominator: {4/8} + {3/8} = **{7/8}**.")
   }, {
    key: "b",
    f: 2,
    say: LT("Phép trừ cũng làm như vậy: {1/2} − {3/8} = {4/8} − {3/8} = **{1/8}**.", "Subtraction works the same way: {1/2} − {3/8} = {4/8} − {3/8} = **{1/8}**.")
   }, {
    key: "b",
    f: 2,
    say: LT("Nhớ rút gọn kết quả nếu được. Ví dụ: {3/8} + {1/8} = {4/8} = {1/2} (chia cả tử và mẫu cho 4).", "Remember to simplify the result if you can. For example: {3/8} + {1/8} = {4/8} = {1/2} (divide both the numerator and the denominator by 4).")
   }],
   gen(tier, r) {
    let rp = d => {
      let n = rd(r, 1, d - 1);
      for (; gcd(n, d) > 1;) n = rd(r, 1, d - 1);
      return n
     },
     mixed = small => {
      for (let g = 0; g < 50; g++) {
       let d = rd(r, 2, small ? 5 : 6),
        k = rd(r, 2, small ? 3 : 4),
        D = d * k,
        a = rp(d),
        x = a * k,
        plus = r.chance(.6),
        b = plus ? rp(D) : rd(r, 1, x - 1);
       if (!plus && x < 2 || gcd(b, D) > 1) continue;
       let n = plus ? x + b : x - b;
       if (n <= 0 || n % D === 0 || small && n > D) continue;
       return {
        d, k, D, a, x, b, plus, n
       }
      }
      return {
       d: 2,
       k: 4,
       D: 8,
       a: 1,
       x: 4,
       b: 3,
       plus: !0,
       n: 7
      }
     };
    if (tier === 1) {
     let d2 = rd(r, 5, 12),
      a2 = rd(r, 1, d2 - 2),
      b2 = rd(r, 1, d2 - 1 - a2);
     if (r.chance(.6)) {
      let n = a2 + b2;
      return QQ({
       q: LT("Tính: " + fr(a2, d2) + " + " + fr(b2, d2), "Calculate: " + fr(a2, d2) + " + " + fr(b2, d2)),
       parts: [psAns(n, d2)],
       steps: [st(LT("Cùng mẫu số " + d2 + ": cộng tử số " + a2 + " + " + b2 + " = " + n + ", giữ nguyên mẫu số → " + fr(n, d2), "Same denominator " + d2 + ": add the numerators " + a2 + " + " + b2 + " = " + n + ", keep the denominator → " + fr(n, d2)))].concat(psRS(n, d2)),
       diag: (vals, q) => {
        let v = vals[0];
        return v && +v.n === n && +v.d === 2 * d2 ? {
         kind: "cong_mau",
         msg: LT("Cùng mẫu số thì giữ nguyên mẫu số, chỉ cộng tử số. Hai miếng bánh cùng cỡ ghép lại không đổi cỡ.", "With the same denominator, keep the denominator and only add the numerators. Putting together two pieces of the same size doesn't change the size of the pieces.")
        } : null
       },
       hintFig: {
        fb: FB.frac([{
         bars: [{
          y: 20,
          den: d2,
          num: a2,
          c: "pink",
          lab: [a2, d2]
         }, {
          y: 90,
          den: d2,
          num: b2,
          c: "blue",
          lab: [b2, d2]
         }]
        }], {
         h: 170
        }),
        f: 0
       },
       tip: LT("Cộng tử số, giữ nguyên mẫu số.", "Add the numerators, keep the denominator.")
      })
     }
     return QQ({
      q: LT("Tính: " + fr(a2 + b2, d2) + " − " + fr(a2, d2), "Calculate: " + fr(a2 + b2, d2) + " − " + fr(a2, d2)),
      parts: [psAns(b2, d2)],
      steps: [st(LT("Cùng mẫu số " + d2 + ": trừ tử số " + (a2 + b2) + " − " + a2 + " = " + b2 + ", giữ nguyên mẫu số → " + fr(b2, d2), "Same denominator " + d2 + ": subtract the numerators " + (a2 + b2) + " − " + a2 + " = " + b2 + ", keep the denominator → " + fr(b2, d2)))].concat(psRS(b2, d2)),
      tip: LT("Trừ tử số, giữ nguyên mẫu số.", "Subtract the numerators, keep the denominator.")
     })
    }
    if (tier === 2) {
     let m = mixed(!0),
      sw = m.plus && r.chance(.5),
      q = sw ? fr(m.b, m.D) + " + " + fr(m.a, m.d) : fr(m.a, m.d) + (m.plus ? " + " : " − ") + fr(m.b, m.D),
      q2 = sw ? fr(m.b, m.D) + " + " + fr(m.x, m.D) : fr(m.x, m.D) + (m.plus ? " + " : " − ") + fr(m.b, m.D);
     return QQ({
      q: LT("Tính: " + q, "Calculate: " + q),
      parts: [psAns(m.n, m.D)],
      steps: [st(LT(m.D + " : " + m.d + " = " + m.k + " → mẫu số chung là " + m.D, m.D + " ÷ " + m.d + " = " + m.k + " → the common denominator is " + m.D)), st(LT("Nhân cả tử và mẫu của " + fr(m.a, m.d) + " với " + m.k + ": " + fr(m.a, m.d) + " = " + fr(m.x, m.D), "Multiply both the numerator and the denominator of " + fr(m.a, m.d) + " by " + m.k + ": " + fr(m.a, m.d) + " = " + fr(m.x, m.D))), st(q + " = " + q2 + " = " + fr(m.n, m.D))].concat(psRS(m.n, m.D)),
      diag: (vals, qq) => {
       let v = vals[0];
       return v && m.plus && +v.n === m.a + m.b && +v.d === m.d + m.D ? {
        kind: "cong_mau",
        msg: LT("Không được cộng tử với tử, mẫu với mẫu. Phải quy đồng mẫu số trước.", "Don't add numerator to numerator and denominator to denominator. You must find a common denominator first.")
       } : null
      },
      hintFig: m.D <= 24 ? {
       fb: FB.frac([{
        bars: [{
         y: 20,
         den: m.D,
         num: m.x,
         c: "pink",
         lab: [m.a, m.d]
        }, {
         y: 90,
         den: m.D,
         num: m.b,
         c: "blue",
         lab: [m.b, m.D]
        }]
       }], {
        h: 150
       }),
       f: 0
      } : void 0,
      tip: LT("Mẫu số này chia hết cho mẫu số kia: chỉ cần quy đồng một phân số.", "One denominator is divisible by the other: you only need to rewrite one fraction.")
     })
    }
    let kk = r.chance(.5) ? 0 : r.int(1, 3);
    if (kk === 0) {
     let d1 = rd(r, 2, 5),
      d2 = rd(r, 2, 7);
     for (; d2 === d1 || gcd(d1, d2) > 1;) d2 = rd(r, 2, 7);
     let a = rp(d1),
      b = rp(d2),
      D = d1 * d2,
      x = a * d2,
      y = b * d1,
      plus = x + y < D && r.chance(.6);
     if (!plus && x < y) {
      [a, b] = [b, a];
      [d1, d2] = [d2, d1];
      [x, y] = [y, x]
     }
     let n = plus ? x + y : x - y,
      q = fr(a, d1) + (plus ? " + " : " − ") + fr(b, d2);
     return QQ({
      q: LT("⭐ Thử thách: Tính: " + q, "⭐ Challenge: Calculate: " + q),
      parts: [psAns(n, D)],
      steps: [st(LT(Math.max(d1, d2) + " không chia hết cho " + Math.min(d1, d2) + " → mẫu số chung là " + d1 + " × " + d2 + " = " + D, Math.max(d1, d2) + " is not divisible by " + Math.min(d1, d2) + " → the common denominator is " + d1 + " × " + d2 + " = " + D)), st(fr(a, d1) + " = " + fr(x, D) + "; " + fr(b, d2) + " = " + fr(y, D)), st(q + " = " + fr(x, D) + (plus ? " + " : " − ") + fr(y, D) + " = " + fr(n, D))].concat(psRS(n, D)),
      diag: (vals, qq) => {
       let v = vals[0];
       return v && plus && +v.n === a + b && +v.d === d1 + d2 ? {
        kind: "cong_mau",
        msg: LT("Không được cộng tử với tử, mẫu với mẫu. Phải quy đồng mẫu số trước.", "Don't add numerator to numerator and denominator to denominator. You must find a common denominator first.")
       } : null
      },
      tip: LT("Mẫu số chung có thể lấy bằng tích hai mẫu số.", "The common denominator can be the product of the two denominators.")
     })
    }
    let m;
    for (let g = 0; g < 50; g++)
     if (m = mixed(), m.plus && m.n < m.D) break;
    m.plus || (m = {
     d: 2,
     k: 4,
     D: 8,
     a: 1,
     x: 4,
     b: 3,
     plus: !0,
     n: 7
    });
    let A = fr(m.a, m.d),
     B = fr(m.b, m.D),
     conv = st(m.D + LT(" : ", " ÷ ") + m.d + " = " + m.k + " → " + A + " = " + fr(m.x, m.D));
    if (kk === 1) {
     let left = m.D - m.n;
     return QQ({
      q: LT("Ngày thứ nhất, đội công nhân sơn được " + A + " bức tường. Ngày thứ hai sơn được " + B + " bức tường. Hỏi còn lại bao nhiêu phần bức tường chưa sơn?", "On the first day, a crew of workers painted " + A + " of a wall. On the second day, they painted " + B + " of the wall. What fraction of the wall is still not painted?"),
      parts: [psAns(left, m.D)],
      steps: [conv, st(LT("Hai ngày sơn được: " + A + " + " + B + " = " + fr(m.x, m.D) + " + " + B + " = " + fr(m.n, m.D), "In two days they painted: " + A + " + " + B + " = " + fr(m.x, m.D) + " + " + B + " = " + fr(m.n, m.D))), st(LT("Cả bức tường là " + fr(m.D, m.D) + ": còn lại " + fr(m.D, m.D) + " − " + fr(m.n, m.D) + " = " + fr(left, m.D), "The whole wall is " + fr(m.D, m.D) + ": what is left is " + fr(m.D, m.D) + " − " + fr(m.n, m.D) + " = " + fr(left, m.D)))].concat(psRS(left, m.D)),
      diag: (vals, q) => {
       let v = vals[0];
       return v && m.n !== left && +v.n * m.D === +v.d * m.n ? {
        kind: "mot_buoc",
        msg: LT("Đó là phần đã sơn. Đề hỏi phần còn lại: lấy cả bức tường (bằng 1) trừ đi.", "That is the part already painted. The question asks for the part that is left: subtract it from the whole wall (equal to 1).")
       } : null
      },
      tip: LT("Cả bức tường coi là 1 = " + fr(m.D, m.D) + ".", "Think of the whole wall as 1 = " + fr(m.D, m.D) + ".")
     })
    }
    if (kk === 2) return QQ({
     q: LT("Một vòi nước giờ thứ nhất chảy được " + A + " bể, giờ thứ hai chảy được " + B + " bể. Hỏi sau hai giờ vòi chảy được bao nhiêu phần của bể?", "A faucet fills " + A + " of a tank in the first hour and " + B + " of the tank in the second hour. What fraction of the tank does the faucet fill after two hours?"),
     parts: [psAns(m.n, m.D)],
     steps: [conv, st(LT("Hai giờ chảy được: " + A + " + " + B + " = " + fr(m.x, m.D) + " + " + B + " = " + fr(m.n, m.D) + " (bể)", "In two hours it fills: " + A + " + " + B + " = " + fr(m.x, m.D) + " + " + B + " = " + fr(m.n, m.D) + " (of the tank)"))].concat(psRS(m.n, m.D)),
     tip: LT("Quy đồng mẫu số rồi cộng.", "Find a common denominator, then add.")
    });
    let x = m.x,
     b = m.b;
    if (x < 2) return byId("fraddsub").gen(3, r);
    for (; b >= x || gcd(b, m.D) > 1;) b = rd(r, 1, x - 1);
    let n = x - b,
     nm = r.shuffle(NAMES.slice(0, 6));
    return QQ({
     q: LT("Trên cùng một quãng đường, " + nm[0] + " đã đi được " + A + " quãng đường, " + nm[1] + " đã đi được " + fr(b, m.D) + " quãng đường. Hỏi " + nm[0] + " đi được nhiều hơn " + nm[1] + " bao nhiêu phần quãng đường?", "On the same route, " + nm[0] + " has covered " + A + " of the route, and " + nm[1] + " has covered " + fr(b, m.D) + " of the route. How much more of the route has " + nm[0] + " covered than " + nm[1] + "?"),
     parts: [psAns(n, m.D)],
     steps: [conv, st(LT("Nhiều hơn: " + A + " − " + fr(b, m.D) + " = " + fr(x, m.D) + " − " + fr(b, m.D) + " = " + fr(n, m.D), "How much more: " + A + " − " + fr(b, m.D) + " = " + fr(x, m.D) + " − " + fr(b, m.D) + " = " + fr(n, m.D)))].concat(psRS(n, m.D)),
     tip: LT("\"Nhiều hơn bao nhiêu\" thì làm phép trừ.", "\"How much more\" means subtract.")
    })
   }
  });
  addAsks("fraddsub", [{
   after: 0,
   say: LT("Cùng làm: cùng chia 8 phần, 3 phần cộng 2 phần là mấy phần?", "Let's do it together: both are split into 8 parts. 3 parts plus 2 parts is how many parts?"),
   opts: ["4", "5", "6"],
   ans: "5",
   good: LT("Đúng! 5 phần, vẫn là phần tám.", "Correct! 5 parts, still eighths.")
  }]);
  FB.areaModel = function(n1, d1, n2, d2) {
   let cw = 220 / d2,
    ch = 140 / d1,
    mk = st2 => {
     let els = [];
     for (let i = 0; i < d1; i++)
      for (let j = 0; j < d2; j++) {
       let inC = j < n2,
        inR = i < n1,
        c = "white";
       st2 >= 1 && inC && (c = "sky"), st2 >= 2 && inC && inR && (c = "purple"), els.push(E.rect("c" + i + "_" + j, 70 + j * cw, 58 + i * ch, cw, ch, c, {
        rx: 0,
        sw: 2
       }))
      }
     return els.push(E.rect("out", 70, 58, 220, 140, "none", {
      rx: 0,
      sw: 4
     })), st2 >= 1 && E.frac("top", 70 + n2 * cw / 2, 30, n2, d2, 18, "blue").forEach(e => els.push(e)), st2 >= 2 && E.frac("lf", 44, 58 + n1 * ch / 2 - 6, n1, d1, 18, "purple").forEach(e => els.push(e)), st2 >= 2 && els.push(E.text("nt", 180, 230, LT(n1 * n2 + " ô tô đậm trên " + d1 * d2 + " ô", n1 * n2 + (n1 * n2 === 1 ? " shaded square out of " : " shaded squares out of ") + d1 * d2 + " squares"), 20, "ink")), els
    };
   return {
    frames: [mk(0), mk(1), mk(2)],
    vb: [360, 244]
   }
  };
  Object.assign(KIND_NAME, {
   nhan_thay_chia: LT("Nhân thay vì chia khi tìm thừa số chưa biết", "Multiplied instead of dividing to find an unknown factor")
  });
  LESSON({
   id: "fracmul",
   reg: "ps",
   title: LT("Nhân, chia phân số", "Multiplying and Dividing Fractions"),
   short: LT("Nhân, chia PS", "Multiply, divide"),
   emoji: "🧁",
   blurb: LT("Tử nhân tử, mẫu nhân mẫu; chia là nhân đảo ngược", "Multiply tops and bottoms; divide by flipping"),
   links: ["fraddsub"],
   rule: {
    h: LT("Quy tắc", "Rule"),
    items: [LT("Nhân: **tử nhân tử, mẫu nhân mẫu**.", "Multiply: **numerator times numerator, denominator times denominator**."), LT("**Phân số đảo ngược**: đổi chỗ tử số và mẫu số ({2/5} → {5/2}).", "**Reciprocal**: swap the numerator and the denominator ({2/5} → {5/2})."), LT("Chia: giữ phân số thứ nhất, **nhân với phân số thứ hai đảo ngược**.", "Divide: keep the first fraction and **multiply by the reciprocal of the second fraction**."), LT("Số tự nhiên viết thành phân số có mẫu số 1: 6 = {6/1}.", "A whole number can be written as a fraction with denominator 1: 6 = {6/1}."), LT("Rút gọn kết quả nếu được.", "Simplify the result if you can.")]
   },
   figs: {
    a: () => FB.areaModel(2, 3, 4, 5),
    b: () => FB.frac([{
     fr: [{
      x: 120,
      y: 70,
      n: 3,
      d: 4,
      s: 32
     }, {
      x: 220,
      y: 70,
      n: 2,
      d: 5,
      s: 32
     }],
     tx: [{
      x: 170,
      y: 84,
      t: ":",
      s: 34
     }]
    }, {
     fr: [{
      x: 120,
      y: 70,
      n: 3,
      d: 4,
      s: 32
     }, {
      x: 220,
      y: 70,
      n: 2,
      d: 5,
      s: 32
     }, {
      x: 110,
      y: 160,
      n: 3,
      d: 4,
      s: 32
     }, {
      x: 190,
      y: 160,
      n: 5,
      d: 2,
      s: 32,
      c: "orange"
     }],
     tx: [{
      x: 170,
      y: 84,
      t: ":",
      s: 34
     }, {
      x: 66,
      y: 174,
      t: "=",
      s: 32
     }, {
      x: 150,
      y: 174,
      t: "×",
      s: 32
     }]
    }, {
     fr: [{
      x: 120,
      y: 70,
      n: 3,
      d: 4,
      s: 32
     }, {
      x: 220,
      y: 70,
      n: 2,
      d: 5,
      s: 32
     }, {
      x: 110,
      y: 160,
      n: 3,
      d: 4,
      s: 32
     }, {
      x: 190,
      y: 160,
      n: 5,
      d: 2,
      s: 32,
      c: "orange"
     }, {
      x: 282,
      y: 160,
      n: 15,
      d: 8,
      s: 32,
      c: "okc"
     }],
     tx: [{
      x: 170,
      y: 84,
      t: ":",
      s: 34
     }, {
      x: 66,
      y: 174,
      t: "=",
      s: 32
     }, {
      x: 150,
      y: 174,
      t: "×",
      s: 32
     }, {
      x: 236,
      y: 174,
      t: "=",
      s: 32
     }]
    }], {
     h: 220
    })
   },
   teach: [{
    key: "a",
    f: 0,
    say: LT("Tính {2/3} × {4/5}. Coi tấm bánh là một hình chữ nhật.", "Find {2/3} × {4/5}. Think of the cake as a rectangle.")
   }, {
    key: "a",
    f: 1,
    say: LT("Tô {4/5} tấm bánh: **4 trong 5 cột**.", "Color in {4/5} of the cake: **4 of the 5 columns**.")
   }, {
    key: "a",
    f: 2,
    say: LT("Lấy {2/3} của phần đó: **2 trong 3 hàng**. Phần tô đậm có 2 × 4 = **8** ô, cả tấm có 3 × 5 = **15** ô.", "Take {2/3} of that part: **2 of the 3 rows**. The dark part has 2 × 4 = **8** squares, and the whole cake has 3 × 5 = **15** squares.")
   }, {
    key: "a",
    f: 2,
    say: LT("Cùng làm: vậy {2/3} × {4/5} bằng phân số nào?", "Let's do it together: so which fraction is {2/3} × {4/5}?"),
    ask: {
     opts: ["{8/15}", "{6/8}", "{6/15}"],
     ans: "{8/15}",
     good: LT("Đúng! Tử nhân tử, mẫu nhân mẫu.", "Correct! Numerator times numerator, denominator times denominator.")
    }
   }, {
    key: "b",
    f: 0,
    say: LT("Chia phân số: {3/4} : {2/5}.", "Dividing fractions: {3/4} ÷ {2/5}.")
   }, {
    key: "b",
    f: 1,
    say: LT("**Phân số đảo ngược** của {2/5} là {5/2}: ta **đổi chỗ tử số và mẫu số**. Muốn chia cho {2/5}, ta **nhân với phân số đảo ngược** {5/2}.", "The **reciprocal** of {2/5} is {5/2}: we **swap the numerator and the denominator**. To divide by {2/5}, we **multiply by the reciprocal** {5/2}.")
   }, {
    key: "b",
    f: 2,
    say: LT("{3/4} : {2/5} = {3/4} × {5/2} = {15/8}.", "{3/4} ÷ {2/5} = {3/4} × {5/2} = {15/8}.")
   }, {
    key: "b",
    f: 2,
    say: LT("Số tự nhiên viết được thành phân số có **mẫu số 1**: 6 = {6/1}. Ví dụ: {2/3} × 6 = {2/3} × {6/1} = {12/3} = 4.", "A whole number can be written as a fraction with **denominator 1**: 6 = {6/1}. For example: {2/3} × 6 = {2/3} × {6/1} = {12/3} = 4.")
   }],
   gen(tier, r) {
    let f = (lo, hi) => {
     let d = rd(r, lo || 2, hi || 9),
      n = rd(r, 1, d - 1);
     for (; gcd(n, d) > 1;) n = rd(r, 1, d - 1);
     return [n, d]
    };
    if (tier === 1) {
     if (r.chance(.35)) {
      let p = f(),
       n = rd(r, 2, 6),
       t = p[0] * n;
      return QQ({
       q: LT("Tính: " + fr(p[0], p[1]) + " × " + n, "Calculate: " + fr(p[0], p[1]) + " × " + n),
       parts: [psAns(t, p[1])],
       steps: [st(LT("Nhân tử số với " + n + ", giữ nguyên mẫu số: " + p[0] + " × " + n + " = " + t, "Multiply the numerator by " + n + ", keep the denominator: " + p[0] + " × " + n + " = " + t)), st(fr(p[0], p[1]) + " × " + n + " = " + fr(t, p[1]))].concat(psRS(t, p[1])),
       tip: LT("Viết " + n + " = " + fr(n, 1) + " rồi nhân tử với tử, mẫu với mẫu.", "Write " + n + " = " + fr(n, 1) + ", then multiply numerator by numerator and denominator by denominator.")
      })
     }
     let a2 = f(),
      b = f(),
      tn = a2[0] * b[0],
      td = a2[1] * b[1];
     return QQ({
      q: LT("Tính: " + fr(a2[0], a2[1]) + " × " + fr(b[0], b[1]), "Calculate: " + fr(a2[0], a2[1]) + " × " + fr(b[0], b[1])),
      parts: [psAns(tn, td)],
      steps: [st(LT("Tử nhân tử: " + a2[0] + " × " + b[0] + " = " + tn, "Numerator times numerator: " + a2[0] + " × " + b[0] + " = " + tn)), st(LT("Mẫu nhân mẫu: " + a2[1] + " × " + b[1] + " = " + td + " → " + fr(tn, td), "Denominator times denominator: " + a2[1] + " × " + b[1] + " = " + td + " → " + fr(tn, td)))].concat(psRS(tn, td)),
      hintFig: {
       fb: FB.areaModel(a2[0], a2[1], b[0], b[1]),
       f: 2
      },
      tip: LT("Tử nhân tử, mẫu nhân mẫu.", "Numerator times numerator, denominator times denominator.")
     })
    }
    if (tier === 2) {
     if (r.chance(.3)) {
      let n = rd(r, 2, 9),
       b2 = f(),
       tn = n * b2[1];
      return QQ({
       q: LT("Tính: " + n + " : " + fr(b2[0], b2[1]), "Calculate: " + n + " ÷ " + fr(b2[0], b2[1])),
       parts: [psAns(tn, b2[0])],
       steps: [st(LT("Viết " + n + " = " + fr(n, 1) + "; phân số đảo ngược của " + fr(b2[0], b2[1]) + " là " + fr(b2[1], b2[0]), "Write " + n + " = " + fr(n, 1) + "; the reciprocal of " + fr(b2[0], b2[1]) + " is " + fr(b2[1], b2[0]))), st(n + LT(" : ", " ÷ ") + fr(b2[0], b2[1]) + " = " + fr(n, 1) + " × " + fr(b2[1], b2[0]) + " = " + fr(tn, b2[0]))].concat(psRS(tn, b2[0])),
       tip: LT("Chia = nhân với phân số đảo ngược.", "Dividing = multiplying by the reciprocal.")
      })
     }
     let a2 = f(),
      b = f(),
      tn = a2[0] * b[1],
      td = a2[1] * b[0],
      A = fr(a2[0], a2[1]),
      B = fr(b[0], b[1]);
     return QQ({
      q: LT("Tính: " + A + " : " + B, "Calculate: " + A + " ÷ " + B),
      parts: [psAns(tn, td)],
      steps: [st(LT("Phân số đảo ngược của " + B + " là " + fr(b[1], b[0]), "The reciprocal of " + B + " is " + fr(b[1], b[0]))), st(A + LT(" : ", " ÷ ") + B + " = " + A + " × " + fr(b[1], b[0]) + " = " + fr(tn, td))].concat(psRS(tn, td)),
      diag: DG.chiaPS(a2[0] * b[0], a2[1] * b[1]),
      tip: LT("Chia = nhân với phân số đảo ngược.", "Dividing = multiplying by the reciprocal.")
     })
    }
    let k4 = r.f(),
     k = k4 < .25 ? 0 : k4 < .4 ? 1 : k4 < .55 ? 2 : k4 < .8 ? 3 : 4;
    if (k === 0) {
     let d = rd(r, 3, 9),
      a = rd(r, 2, d - 1);
     for (; gcd(a, d) > 1;) a = rd(r, 2, d - 1);
     let c = rd(r, 1, a - 1);
     for (; gcd(c, d) > 1;) c = rd(r, 1, a - 1);
     let w = a - c,
      tn = a * w,
      td = d * d,
      obj = r.pick([LT("tấm bìa", "piece of cardboard"), LT("tấm kính", "glass panel")]);
     return QQ({
      q: LT("Một " + obj + " hình chữ nhật có chiều dài " + fr(a, d) + " m, chiều rộng ngắn hơn chiều dài " + fr(c, d) + " m. Tính diện tích " + obj + " đó (m²).", "A rectangular " + obj + " is " + fr(a, d) + " m long, and its width is " + fr(c, d) + " m shorter than its length. Find the area of the " + obj + " (m²)."),
      parts: [psAns(tn, td)],
      steps: [st(LT("Chiều rộng: " + fr(a, d) + " − " + fr(c, d) + " = " + fr(w, d) + " (m)", "Width: " + fr(a, d) + " − " + fr(c, d) + " = " + fr(w, d) + " (m)")), st(LT("Diện tích = chiều dài × chiều rộng = " + fr(a, d) + " × " + fr(w, d) + " = " + fr(tn, td) + " (m²)", "Area = length × width = " + fr(a, d) + " × " + fr(w, d) + " = " + fr(tn, td) + " (m²)"))].concat(psRS(tn, td)),
      diag: (vals, q) => {
       let v = vals[0];
       return v && +v.n * td === +v.d * a * c ? {
        kind: "mot_buoc",
        msg: LT("Chiều rộng chưa phải là " + fr(c, d) + " m. Tìm chiều rộng trước: lấy chiều dài trừ " + fr(c, d) + " m.", "The width is not " + fr(c, d) + " m. Find the width first: subtract " + fr(c, d) + " m from the length.")
       } : null
      },
      hintFig: {
       fb: FB.areaModel(w, d, a, d),
       f: 2
      },
      tip: LT("Tìm chiều rộng trước, rồi lấy chiều dài × chiều rộng.", "Find the width first, then multiply length × width.")
     })
    }
    if (k === 1) {
     let c = r.pick([
       [1, 2],
       [1, 3],
       [1, 4],
       [2, 3],
       [3, 4],
       [1, 5],
       [2, 5],
       [1, 6]
      ]),
      m = rd(r, 2, 9),
      g = gcd(c[0] * m, c[1]),
      Ln = c[0] * m / g,
      Ld = c[1] / g,
      Ltxt = Ld === 1 ? Ln + " m" : fr(Ln, Ld) + " m",
      Lexp = Ld === 1 ? String(Ln) : fr(Ln, Ld),
      tn = Ln * c[1],
      td = Ld * c[0];
     return QQ({
      q: LT("Một sợi dây dài " + Ltxt + " được cắt thành các đoạn bằng nhau, mỗi đoạn dài " + fr(c[0], c[1]) + " m. Hỏi cắt được bao nhiêu đoạn?", "A rope is " + Ltxt + " long. It is cut into equal pieces, each " + fr(c[0], c[1]) + " m long. How many pieces can be cut?"),
      parts: [num("", m, LT("đoạn", "pieces"))],
      steps: [st(LT("Số đoạn = " + Lexp + " : " + fr(c[0], c[1]) + " = " + Lexp + " × " + fr(c[1], c[0]), "Number of pieces = " + Lexp + " ÷ " + fr(c[0], c[1]) + " = " + Lexp + " × " + fr(c[1], c[0]))), st(LT("= " + fr(tn, td) + " = " + m + " (đoạn)", "= " + fr(tn, td) + " = " + m + " (pieces)"), m)],
      tip: LT("Muốn biết có mấy đoạn thì làm phép chia.", "To find how many pieces, divide.")
     })
    }
    if (k === 2) {
     let a = f(3, 9),
      W = rd(r, 2, 9) * a[1],
      u = W / a[1] * a[0],
      left = W - u;
     return QQ({
      q: LT("Một bao gạo nặng **" + W + " kg**. Người ta đã dùng " + fr(a[0], a[1]) + " bao gạo. Hỏi bao gạo **còn lại** bao nhiêu ki-lô-gam?", "A bag of rice weighs **" + W + " kg**. " + fr(a[0], a[1]) + " of the bag of rice has been used. How many kilograms of rice are **left**?"),
      parts: [num("", left, "kg")],
      steps: [st(LT("Đã dùng: " + W + " × " + fr(a[0], a[1]) + " = " + fr(W * a[0], a[1]) + " = " + u + " (kg)", "Used: " + W + " × " + fr(a[0], a[1]) + " = " + fr(W * a[0], a[1]) + " = " + u + " (kg)"), u), st(LT("Còn lại: " + W + " − " + u + " = " + left + " (kg)", "Left: " + W + " − " + u + " = " + left + " (kg)"), left)],
      diag: DG.any(DG.step([u], LT("Đó là số gạo đã dùng. Đề hỏi số gạo còn lại.", "That is the amount of rice used. The question asks how much rice is left."), "tru_con_lai"), DG.fracOf(W / a[1])),
      tip: LT("Tìm số gạo đã dùng trước, rồi lấy cả bao trừ đi.", "Find the amount used first, then subtract it from the whole bag.")
     })
    }
    if (k === 4) {
     let c = f(3, 9),
      m = rd(r, 2, 9),
      R = c[0] * m,
      X = c[1] * m;
     return QQ({
      q: LT("Một số nhân với " + fr(c[0], c[1]) + " thì được **" + R + "**. Tìm số đó.", "A number multiplied by " + fr(c[0], c[1]) + " gives **" + R + "**. Find that number."),
      parts: [num("", X)],
      steps: [st(LT("Số cần tìm = tích : thừa số đã biết = " + R + " : " + fr(c[0], c[1]), "The number = product ÷ known factor = " + R + " ÷ " + fr(c[0], c[1]))), st(LT("= " + R + " × " + fr(c[1], c[0]) + " = " + fr(R * c[1], c[0]) + " = " + X, "= " + R + " × " + fr(c[1], c[0]) + " = " + fr(R * c[1], c[0]) + " = " + X), X)],
      diag: (vals, q) => Math.abs(V(vals, 0) - R * c[0] / c[1]) < 1e-9 && R * c[0] / c[1] !== X ? {
       kind: "nhan_thay_chia",
       msg: LT("Con đã nhân " + R + " với " + fr(c[0], c[1]) + ". Muốn tìm thừa số chưa biết thì phải **chia** " + R + " cho " + fr(c[0], c[1]) + ".", "You multiplied " + R + " by " + fr(c[0], c[1]) + ". To find the unknown factor, you have to **divide** " + R + " by " + fr(c[0], c[1]) + ".")
      } : null,
      tip: LT("Tìm thừa số chưa biết: lấy tích chia cho thừa số đã biết.", "To find an unknown factor, divide the product by the known factor.")
     })
    }
    let b1 = r.pick([2, 3, 4, 5]),
     kk = rd(r, 2, 3),
     D = b1 * kk,
     x = rd(r, 1, b1 - 1);
    for (; gcd(x, b1) > 1;) x = rd(r, 1, b1 - 1);
    let y = rd(r, 1, D - 1 - x * kk);
    for (; gcd(y, D) > 1;) y = rd(r, 1, D - 1 - x * kk);
    let p = f(),
     sn = x * kk + y,
     tn = sn * p[0],
     td = D * p[1];
    return QQ({
     q: LT("Tính: (" + fr(x, b1) + " + " + fr(y, D) + ") × " + fr(p[0], p[1]), "Calculate: (" + fr(x, b1) + " + " + fr(y, D) + ") × " + fr(p[0], p[1])),
     parts: [psAns(tn, td)],
     steps: [st(LT("Trong ngoặc trước, quy đồng: " + fr(x, b1) + " = " + fr(x * kk, D), "Parentheses first, common denominator: " + fr(x, b1) + " = " + fr(x * kk, D))), st(fr(x * kk, D) + " + " + fr(y, D) + " = " + fr(sn, D)), st(fr(sn, D) + " × " + fr(p[0], p[1]) + " = " + fr(tn, td))].concat(psRS(tn, td)),
     tip: LT("Làm trong ngoặc trước: quy đồng mẫu số rồi cộng.", "Do the parentheses first: find a common denominator, then add.")
    })
   }
  });
  LESSON({
   id: "angle",
   reg: "hinh",
   title: LT("Các loại góc", "Types of Angles"),
   emoji: "📐",
   blurb: LT("Kéo thước đo góc để khám phá", "Drag the protractor to explore"),
   links: ["addsub"],
   rule: {
    h: LT("Nhớ nhé", "Remember"),
    items: [LT("Đơn vị đo góc là **độ**, kí hiệu **°** (30° đọc là ba mươi độ).", "The unit for measuring angles is the **degree**, written **°** (30° is read as thirty degrees)."), LT("Đo góc: đặt **tâm thước đo góc trùng đỉnh góc**, một cạnh trùng **vạch 0**, đọc số ở vạch mà cạnh kia đi qua.", "To measure an angle: put the **center of the protractor on the vertex of the angle**, line up one side with the **0 mark**, and read the number where the other side crosses."), LT("Góc **nhọn** bé hơn 90°. Góc **vuông** bằng 90°.", "An **acute** angle is less than 90°. A **right** angle is exactly 90°."), LT("Góc **tù** lớn hơn 90° và bé hơn 180°. Góc **bẹt** bằng 180°.", "An **obtuse** angle is greater than 90° and less than 180°. A **straight** angle is exactly 180°.")]
   },
   figs: {
    a: () => ({
     angle: !0,
     start: 30
    })
   },
   teach: [{
    key: "a",
    theta: 30,
    say: LT("Đây là một góc trên thước đo góc. Cạnh xanh nằm yên, **cạnh cam** quay được (đầu cạnh cam có chấm tròn vàng). Góc **30°** mở hẹp, gọi là góc **nhọn**.", "This is an angle on a protractor. The blue side stays still, and the **orange side** can turn (it has a yellow dot at its end). The **30°** angle is narrow, so it is called an **acute** angle.")
   }, {
    key: "a",
    theta: 30,
    say: LT("Đơn vị đo góc là **độ**, kí hiệu **°**. **30°** đọc là **ba mươi độ**.", "The unit for measuring angles is the **degree**, written **°**. **30°** is read as **thirty degrees**.")
   }, {
    key: "a",
    theta: 60,
    say: LT("Cách đo góc bằng **thước đo góc**: đặt **tâm thước trùng đỉnh góc**, một cạnh của góc trùng **vạch 0**, rồi đọc số ở vạch mà **cạnh kia** đi qua. Ở đây cạnh cam đi qua vạch **60** nên góc này là **60°**.", "Here is how to measure an angle with a **protractor**: put the **center of the protractor on the vertex**, line up one side of the angle with the **0 mark**, then read the number where the **other side** crosses. Here the orange side crosses the **60** mark, so this angle is **60°**.")
   }, {
    key: "a",
    theta: 90,
    say: LT("Kéo cạnh cam ra thành **90°**: góc **vuông**, như góc của quyển vở.", "Pull the orange side out to **90°**: a **right** angle, like the corner of a notebook.")
   }, {
    key: "a",
    theta: 135,
    say: LT("Mở cạnh cam rộng hơn nữa: **135°** là góc **tù** (lớn hơn góc vuông, chưa đến góc bẹt).", "Open the orange side even wider: **135°** is an **obtuse** angle (bigger than a right angle, but not yet a straight angle).")
   }, {
    key: "a",
    theta: 180,
    say: LT("Mở thẳng ra là **180°**: góc **bẹt**. Giờ con hãy tự kéo chấm tròn vàng ở đầu cạnh cam để thử nhé!", "Open it all the way to **180°**: a **straight** angle. Now try dragging the yellow dot at the end of the orange side yourself!"),
    free: !0
   }],
   gen(tier, r) {
    if (tier === 1) {
     let c = r.pick([LT("Góc nhọn", "Acute angle"), LT("Góc vuông", "Right angle"), LT("Góc tù", "Obtuse angle"), LT("Góc bẹt", "Straight angle")]),
      x = c === LT("Góc nhọn", "Acute angle") ? r.pick([20, 30, 35, 45, 60, 75, 89]) : c === LT("Góc vuông", "Right angle") ? 90 : c === LT("Góc tù", "Obtuse angle") ? r.pick([91, 100, 120, 135, 150, 170]) : 180;
     return QQ({
      q: LT("Góc **" + x + "°** là góc gì?", "What kind of angle is **" + x + "°**?"),
      parts: [chp([LT("Góc nhọn", "Acute angle"), LT("Góc vuông", "Right angle"), LT("Góc tù", "Obtuse angle"), LT("Góc bẹt", "Straight angle")], c)],
      steps: [st(LT("So sánh với 90° và 180°: " + x + "° → " + c, "Compare with 90° and 180°: " + x + "° → " + c))],
      tip: LT("Bé hơn 90° là nhọn; bằng 90° là vuông; giữa 90° và 180° là tù; bằng 180° là bẹt.", "Less than 90° is acute; exactly 90° is right; between 90° and 180° is obtuse; exactly 180° is straight.")
     })
    }
    if (tier === 2) {
     if (r.chance(.45)) {
      let t = r.pick([
        [90, LT("vuông", "right"), 2],
        [90, LT("vuông", "right"), 3],
        [180, LT("bẹt", "straight"), 2],
        [180, LT("bẹt", "straight"), 3],
        [180, LT("bẹt", "straight"), 4]
       ]),
       each = t[0] / t[2],
       cls = each < 90 ? LT("góc nhọn", "acute angle") : each === 90 ? LT("góc vuông", "right angle") : LT("góc tù", "obtuse angle");
      return QQ({
       q: LT("Góc " + t[1] + " được chia thành **" + t[2] + " góc bằng nhau**. Mỗi góc bao nhiêu độ?", "A " + t[1] + " angle is split into **" + t[2] + " equal angles**. How many degrees is each angle?"),
       parts: [num("", each, "°")],
       steps: [st(LT("Góc " + t[1] + " bằng " + t[0] + "°", "A " + t[1] + " angle equals " + t[0] + "°"), t[0]), st(LT("Mỗi góc: " + t[0] + " : " + t[2] + " = " + each + "° (là " + cls + ")", "Each angle: " + t[0] + " ÷ " + t[2] + " = " + each + "° (" + cls + ")"), each)],
       tip: LT("Góc vuông = 90°, góc bẹt = 180°.", "Right angle = 90°, straight angle = 180°.")
      })
     }
     let tot = r.pick([
       [180, LT("bẹt", "straight")],
       [90, LT("vuông", "right")]
      ]),
      a = tot[0] === 180 ? rd(r, 20, 160) : rd(r, 15, 75);
     return QQ({
      q: LT("Góc " + tot[1] + " (**" + tot[0] + "°**) được chia thành hai góc. Một góc là **" + a + "°**. Góc còn lại bao nhiêu độ?", "A " + tot[1] + " angle (**" + tot[0] + "°**) is split into two angles. One angle is **" + a + "°**. How many degrees is the other angle?"),
      parts: [num("", tot[0] - a, "°")],
      steps: [st(tot[0] + " − " + a + " = " + (tot[0] - a), tot[0] - a)],
      tip: LT("Góc vuông 90°, góc bẹt 180°: lấy cả góc trừ đi góc đã biết.", "A right angle is 90° and a straight angle is 180°: take the whole angle and subtract the angle you already know.")
     })
    }
    let t = r.pick([
      [180, 2],
      [180, 3],
      [180, 5],
      [180, 8],
      [90, 2],
      [90, 5],
      [90, 8]
     ]),
     small = t[0] / (t[1] + 1);
    return QQ({
     q: LT("⭐ Thử thách: Chia một góc " + (t[0] === 180 ? "bẹt (180°)" : "vuông (90°)") + " thành hai góc, góc lớn **gấp " + t[1] + " lần** góc bé. Tính góc bé.", "⭐ Challenge: Split a " + (t[0] === 180 ? "straight (180°)" : "right (90°)") + " angle into two angles. The larger angle is **" + t[1] + " times** the smaller angle. Find the smaller angle."),
     parts: [num(LT("Góc bé", "Smaller angle"), small, "°")],
     steps: [st(LT("Góc bé là 1 phần thì góc lớn là " + t[1] + " phần: tất cả " + (t[1] + 1) + " phần", "The smaller angle is 1 part, so the larger angle is " + t[1] + " parts: " + (t[1] + 1) + " parts in all"), t[1] + 1), st(LT("Góc bé: " + t[0] + " : " + (t[1] + 1) + " = " + small, "Smaller angle: " + t[0] + " ÷ " + (t[1] + 1) + " = " + small), small)],
     tip: LT("Vẽ sơ đồ đoạn thẳng: góc bé 1 đoạn, góc lớn nhiều đoạn.", "Draw a segment diagram: 1 segment for the smaller angle, several segments for the larger angle.")
    })
   }
  });
  addAsks("angle", [{
   after: 3,
   say: LT("Cùng làm: góc đang là 90°. Đó là góc gì?", "Let's do it together: the angle is 90° now. What kind of angle is it?"),
   opts: [LT("Góc nhọn", "Acute angle"), LT("Góc vuông", "Right angle"), LT("Góc tù", "Obtuse angle")],
   ans: LT("Góc vuông", "Right angle"),
   good: LT("Đúng! 90° là góc vuông.", "Correct! 90° is a right angle.")
  }, {
   after: 4,
   say: LT("Cùng làm: góc 135° là góc gì?", "Let's do it together: what kind of angle is 135°?"),
   opts: [LT("Góc nhọn", "Acute angle"), LT("Góc vuông", "Right angle"), LT("Góc tù", "Obtuse angle")],
   ans: LT("Góc tù", "Obtuse angle"),
   good: LT("Đúng! Lớn hơn 90° nhưng bé hơn 180°.", "Correct! It is greater than 90° but less than 180°.")
  }]);
  extendTier("angle", 3, [r => {
   let D = 2 * rd(r, 5, 60),
    b = (180 - D) / 2,
    a = b + D;
   return QQ({
    q: LT("Một góc bẹt được chia thành hai góc. Góc lớn hơn góc bé **" + D + "°**. Tính số đo mỗi góc.", "A straight angle is split into two angles. The larger angle is **" + D + "°** more than the smaller angle. Find the measure of each angle."),
    parts: [num(LT("Góc lớn", "Larger angle"), a, "°"), num(LT("Góc bé", "Smaller angle"), b, "°")],
    steps: [st(LT("Góc bẹt = 180°: tổng hai góc là 180°", "Straight angle = 180°: the two angles add up to 180°"), 180), st(LT("Góc lớn: (180 + " + D + ") : 2 = " + a, "Larger angle: (180 + " + D + ") ÷ 2 = " + a), a), st(LT("Góc bé: 180 − " + a + " = " + b, "Smaller angle: 180 − " + a + " = " + b), b)],
    diag: (vals, q) => {
     let e0 = V(vals, 0),
      e1 = V(vals, 1);
     return e0 !== a && e1 !== a && (e0 === 180 + D || e1 === 180 + D) ? {
      kind: "chia2",
      msg: LT("Con đã cộng thêm phần hơn, được 2 lần số lớn. Hãy chia cho 2 để tìm góc lớn.", "You added the extra part, which gives 2 times the larger angle. Divide by 2 to find the larger angle.")
     } : DG.sd(180, D, a, b)(vals, q)
    },
    hintFig: {
     fb: SDfig(180, D, a, b, 3),
     f: 0
    },
    tip: LT("Bài toán tổng – hiệu với tổng 180°.", "A sum and difference problem with a sum of 180°.")
   })
  }, r => {
   let h = rd(r, 1, 11),
    k = Math.min(h, 12 - h),
    deg = k * 30,
    cls = deg < 90 ? LT("Góc nhọn", "Acute angle") : deg === 90 ? LT("Góc vuông", "Right angle") : deg < 180 ? LT("Góc tù", "Obtuse angle") : LT("Góc bẹt", "Straight angle");
   return QQ({
    q: LT("⭐ Thử thách: Lúc **" + h + " giờ đúng**, kim giờ và kim phút tạo thành góc bao nhiêu độ? Đó là góc gì? (Lấy góc không lớn hơn 180°.)", "⭐ Challenge: At **" + h + " o'clock sharp**, the hour hand and the minute hand make an angle. How many degrees is it? What kind of angle is it? (Use the angle that is not greater than 180°.)"),
    fig: {
     fb: FB.clock(h, 0),
     f: 0
    },
    parts: [num(LT("Số đo", "Measure"), deg, "°"), chp([LT("Góc nhọn", "Acute angle"), LT("Góc vuông", "Right angle"), LT("Góc tù", "Obtuse angle"), LT("Góc bẹt", "Straight angle")], cls, LT("Loại góc", "Angle type"))],
    steps: [st(LT("Từ số 12 đến số 6 là góc bẹt 180°, gồm 6 khoảng, mỗi khoảng 180 : 6 = 30°", "From the 12 to the 6 is a straight angle of 180°, made of 6 intervals, each 180 ÷ 6 = 30°"), 30), st(LT("Hai kim cách nhau " + k + " khoảng: " + k + " × 30 = " + deg + "°", "The two hands are " + k + (k === 1 ? " interval" : " intervals") + " apart: " + k + " × 30 = " + deg + "°"), deg), st("→ " + cls)],
    tip: LT("Từ số 12 đến số 6 là góc bẹt 180°, chia thành 6 khoảng bằng nhau.", "From the 12 to the 6 is a straight angle of 180°, split into 6 equal intervals.")
   })
  }, r => {
   let a = rd(r, 15, 40),
    b = rd(r, 15, 40);
   if (a + b >= 85) return byId("angle").gen(3, r);
   let c = 90 - a - b;
   return QQ({
    q: LT("Một góc vuông được chia thành ba góc. Hai góc đầu là **" + a + "°** và **" + b + "°**. Tính góc còn lại.", "A right angle is split into three angles. The first two angles are **" + a + "°** and **" + b + "°**. Find the remaining angle."),
    parts: [num("", c, "°")],
    steps: [st(LT("Góc vuông = 90°", "Right angle = 90°"), 90), st(LT("Góc còn lại: 90 − " + a + " − " + b + " = " + c, "Remaining angle: 90 − " + a + " − " + b + " = " + c), c)],
    diag: DG.step([180 - a - b], LT("Góc vuông là 90° (180° là góc bẹt).", "A right angle is 90° (180° is a straight angle).")),
    tip: LT("Góc vuông 90°: lấy 90° trừ lần lượt hai góc đã biết.", "A right angle is 90°: subtract the two known angles from 90° one at a time.")
   })
  }], !0);
  var R4 = [
   ["A", "B", "C", "D"],
   ["M", "N", "P", "Q"],
   ["E", "G", "H", "I"],
   ["K", "L", "M", "N"],
   ["P", "Q", "R", "S"]
  ];
  var LN = [
   ["A", "B"],
   ["C", "D"],
   ["M", "N"],
   ["P", "Q"],
   ["E", "G"],
   ["H", "K"],
   ["R", "S"],
   ["X", "Y"]
  ];
  FB.lines2 = function(rel, theta, names, o) {
   o = o || {};
   let cx = 180,
    cy = 112,
    L = 86,
    rad = d => d * Math.PI / 180,
    seg = (k, ang, ox, oy, nm, col) => {
     let dx = L * Math.cos(rad(ang)),
      dy = -L * Math.sin(rad(ang)),
      a = [cx + ox - dx, cy + oy - dy],
      b = [cx + ox + dx, cy + oy + dy];
     return [E.line(k, a[0], a[1], b[0], b[1], col, {
      sw: 4.5
     }), E.text(k + "a", a[0] - dx * .16, a[1] - dy * .16 + 7, nm[0], 20, "ink"), E.text(k + "b", b[0] + dx * .16, b[1] + dy * .16 + 7, nm[1], 20, "ink")]
    },
    els = seg("l1", theta, 0, 0, names[0], "blue");
   if (rel === "vg") {
    if (els = els.concat(seg("l2", theta + 90, 0, 0, names[1], "orange")), o.mark) {
     let u = [Math.cos(rad(theta)), -Math.sin(rad(theta))],
      v = [Math.cos(rad(theta + 90)), -Math.sin(rad(theta + 90))],
      s = 16;
     els.push(E.path("rt", "M" + (cx + u[0] * s) + " " + (cy + u[1] * s) + " L" + (cx + u[0] * s + v[0] * s) + " " + (cy + u[1] * s + v[1] * s) + " L" + (cx + v[0] * s) + " " + (cy + v[1] * s), "none", "red", {
      sw: 3
     }))
    }
   } else if (rel === "ss") {
    let n = [Math.cos(rad(theta + 90)) * 34, -Math.sin(rad(theta + 90)) * 34];
    if (els = seg("l1", theta, n[0], n[1], names[0], "blue").concat(seg("l2", theta, -n[0], -n[1], names[1], "orange")), o.mark)
     for (let i = -1; i <= 1; i++) {
      let p = [cx + Math.cos(rad(theta)) * i * 50, cy - Math.sin(rad(theta)) * i * 50];
      els.push(E.line("dd" + i, p[0] + n[0], p[1] + n[1], p[0] - n[0], p[1] - n[1], "red", {
       sw: 2.5,
       dash: "5 4"
      }))
     }
   } else els = els.concat(seg("l2", theta + (o.cut || 55), 0, 0, names[1], "orange"));
   return o.note && els.push(E.text("note", 180, 236, o.note, 19, "ink")), {
    frames: [els],
    vb: [360, o.note ? 250 : 226]
   }
  };
  FB.rect4 = function(nm, frames, o) {
   o = o || {};
   let sq = o.square,
    x0 = sq ? 115 : 70,
    y0 = 34,
    w = sq ? 130 : 220,
    h = sq ? 130 : 120,
    P2 = [
     [x0, y0],
     [x0 + w, y0],
     [x0 + w, y0 + h],
     [x0, y0 + h]
    ],
    off = [
     [-14, -8],
     [14, -8],
     [14, 22],
     [-14, 22]
    ];
   return {
    frames: frames.map(f => {
     let els = [E.poly("rc", P2.map(p => p.join(",")).join(" "), sq ? "mint" : "sky")];
     if ((f.hi || []).forEach((e, k) => {
       let a = P2[e[0]],
        b = P2[e[1]];
       els.push(E.line("hi" + e[0] + e[1], a[0], a[1], b[0], b[1], e[2] || "orange", {
        sw: 7
       }))
      }), f.dg && els.push(E.line("dg", P2[f.dg[0]][0], P2[f.dg[0]][1], P2[f.dg[1]][0], P2[f.dg[1]][1], "dark", {
       sw: 2.5,
       dash: "7 5"
      })), o.mn) {
      let xm = x0 + w * o.mn.r;
      els.push(E.line("mn", xm, y0, xm, y0 + h, f.mnc || "purple", {
       sw: f.mnc ? 6 : 3.5
      })), els.push(E.text("mt", xm, y0 - 10, o.mn.t, 20, "ink")), els.push(E.text("mb", xm, y0 + h + 24, o.mn.b, 20, "ink"))
     }
     return (f.ra || []).forEach(i => {
      let p = P2[i],
       sx = i === 1 || i === 2 ? -1 : 1,
       sy = i >= 2 ? -1 : 1,
       s = 15;
      els.push(E.path("ra" + i, "M" + (p[0] + sx * s) + " " + p[1] + " v" + sy * s + " h" + -sx * s, "none", "red", {
       sw: 3
      }))
     }), nm.forEach((n, i) => els.push(E.text("v" + i, P2[i][0] + off[i][0], P2[i][1] + off[i][1], n, 21, "ink"))), f.note && els.push(E.text("note", 180, y0 + h + (o.mn ? 56 : 44), f.note, 19, "ink")), els
    }),
    vb: [360, y0 + h + (o.mn ? 70 : 58)]
   }
  };
  LESSON({
   id: "lines",
   reg: "hinh",
   title: LT("Vuông góc, song song", "Perpendicular and Parallel Lines"),
   short: LT("Vuông góc", "Perpendicular"),
   emoji: "📏",
   blurb: LT("Hai đường thẳng vuông góc, song song", "Perpendicular and parallel lines"),
   links: ["angle"],
   rule: {
    h: LT("Nhớ nhé", "Remember"),
    items: [LT("Hai đường thẳng **vuông góc** cắt nhau tạo thành **4 góc vuông**.", "Two **perpendicular** lines cross to make **4 right angles**."), LT("Hai đường thẳng **song song** kéo dài mãi **không bao giờ cắt nhau**.", "Two **parallel** lines go on forever and **never cross**."), LT("Hình chữ nhật: hai cạnh đối diện **song song**, hai cạnh kề nhau (chung một đỉnh) **vuông góc**.", "Rectangle: opposite sides are **parallel**, and two sides next to each other (sharing a vertex) are **perpendicular**.")]
   },
   figs: {
    a: () => {
     let f = FB.lines2("vg", 0, [
       ["A", "B"],
       ["C", "D"]
      ]),
      g = FB.lines2("vg", 0, [
       ["A", "B"],
       ["C", "D"]
      ], {
       mark: 1
      });
     return {
      frames: [f.frames[0], g.frames[0]],
      vb: g.vb
     }
    },
    b: () => {
     let f = FB.lines2("ss", 0, [
       ["M", "N"],
       ["P", "Q"]
      ]),
      g = FB.lines2("ss", 0, [
       ["M", "N"],
       ["P", "Q"]
      ], {
       mark: 1
      });
     return {
      frames: [f.frames[0], g.frames[0]],
      vb: g.vb
     }
    },
    c: () => FB.rect4(["A", "B", "C", "D"], [{}, {
     hi: [
      [0, 1, "orange"],
      [3, 2, "orange"]
     ],
     note: LT("AB song song với DC", "AB is parallel to DC")
    }, {
     hi: [
      [0, 1, "blue"],
      [0, 3, "blue"]
     ],
     ra: [0],
     note: LT("AB vuông góc với AD", "AB is perpendicular to AD")
    }])
   },
   teach: [{
    key: "a",
    f: 0,
    say: LT("Hai đường thẳng **AB** và **CD** cắt nhau tạo thành **4 góc vuông**.", "Lines **AB** and **CD** cross to make **4 right angles**.")
   }, {
    key: "a",
    f: 1,
    say: LT("Ta nói **AB vuông góc với CD**. Kiểm tra bằng **ê-ke**: đặt góc vuông của ê-ke vào chỗ hai đường cắt nhau.", "We say **AB is perpendicular to CD**. Check with a **set square (drafting triangle)**: place the right-angle corner of the set square where the two lines cross.")
   }, {
    key: "b",
    f: 0,
    say: LT("Hai đường thẳng **MN** và **PQ** kéo dài mãi về hai phía mà **không bao giờ cắt nhau**: đó là hai đường thẳng **song song**.", "Lines **MN** and **PQ** go on forever in both directions and **never cross**: they are **parallel** lines.")
   }, {
    key: "b",
    f: 1,
    say: LT("Khoảng cách giữa hai đường thẳng song song ở chỗ nào cũng **bằng nhau** (các nét đỏ dài bằng nhau).", "The distance between two parallel lines is the **same** everywhere (the red dashes are all the same length).")
   }, {
    key: "c",
    f: 0,
    say: LT("Trong hình chữ nhật **ABCD**, hãy tìm các cạnh song song và vuông góc.", "In rectangle **ABCD**, find the parallel sides and the perpendicular sides.")
   }, {
    key: "c",
    f: 1,
    say: LT("Cạnh **AB** song song với cạnh **DC**. Cạnh AD song song với cạnh BC.", "Side **AB** is parallel to side **DC**. Side AD is parallel to side BC.")
   }, {
    key: "c",
    f: 2,
    say: LT("Cùng làm: cạnh AB vuông góc với cạnh nào?", "Let's do it together: which side is AB perpendicular to?"),
    ask: {
     opts: ["AD", "DC", "AC"],
     ans: "AD",
     good: LT("Đúng! Góc A là góc vuông nên AB vuông góc với AD (và cả BC).", "Correct! Angle A is a right angle, so AB is perpendicular to AD (and to BC too).")
    }
   }],
   gen(tier, r) {
    if (tier === 1) {
     let nm2 = r.shuffle(LN).slice(0, 2),
      th = r.pick([0, 15, 30, 45, 60, 75, 90, 105, 120, 150]),
      rel = ["vg", "ss", "cat"][r.int(0, 2)],
      lab = {
       vg: LT("Vuông góc", "Perpendicular"),
       ss: LT("Song song", "Parallel"),
       cat: LT("Cắt nhau, không vuông góc", "Intersect, but not perpendicular")
      } [rel];
     return QQ({
      q: LT("Hai đường thẳng **" + nm2[0].join("") + "** và **" + nm2[1].join("") + "** trong hình như thế nào với nhau?", "How are lines **" + nm2[0].join("") + "** and **" + nm2[1].join("") + "** in the picture related to each other?"),
      fig: {
       fb: FB.lines2(rel, th, nm2, {
        cut: r.pick([40, 55, 130, 140])
       }),
       f: 0
      },
      parts: [chp([LT("Vuông góc", "Perpendicular"), LT("Song song", "Parallel"), LT("Cắt nhau, không vuông góc", "Intersect, but not perpendicular")], lab)],
      steps: [st(rel === "ss" ? LT("Hai đường không cắt nhau, cách đều nhau → song song", "The two lines never cross and stay the same distance apart → parallel") : rel === "vg" ? LT("Hai đường cắt nhau tạo thành góc vuông → vuông góc", "The two lines cross and make a right angle → perpendicular") : LT("Hai đường cắt nhau nhưng góc tạo thành không phải góc vuông", "The two lines cross, but the angle they make is not a right angle"))],
      tip: LT("Kéo dài hai đường thẳng: nếu mãi không cắt nhau thì song song; nếu cắt nhau thì dùng ê-ke kiểm tra góc vuông.", "Extend both lines: if they never cross, they are parallel; if they cross, use a set square (drafting triangle) to check for a right angle.")
     })
    }
    let nm = r.pick(R4),
     sq = r.chance(.3),
     shape = sq ? LT("hình vuông", "square") : LT("hình chữ nhật", "rectangle"),
     S = (i, j) => nm[i] + nm[j];
    if (tier === 2) {
     let k2 = r.int(0, 4),
      sides = [
       [0, 1],
       [1, 2],
       [3, 2],
       [0, 3]
      ],
      par = {
       0: 2,
       2: 0,
       1: 3,
       3: 1
      },
      si = r.int(0, 3),
      sd = sides[si],
      nmS = S(sd[0], sd[1]),
      pp = sides[par[si]],
      perp = sides[(si + 1) % 4],
      perp2 = sides[(si + 3) % 4];
     if (k2 <= 1) {
      let ans = S(pp[0], pp[1]),
       opts = r.shuffle([ans, S(perp[0], perp[1]), S(0, 2)]);
      return QQ({
       q: LT("Trong " + shape + " **" + nm.join("") + "**, cạnh **" + nmS + "** song song với cạnh nào?", "In the " + shape + " **" + nm.join("") + "**, which side is **" + nmS + "** parallel to?"),
       fig: {
        fb: FB.rect4(nm, [{
         dg: [0, 2]
        }], {
         square: sq
        }),
        f: 0
       },
       parts: [chp(opts, ans)],
       steps: [st(LT("Cạnh đối diện với " + nmS + " là " + ans + " → song song", "The side opposite " + nmS + " is " + ans + " → parallel"))],
       tip: LT("Trong hình chữ nhật, cạnh song song với một cạnh là cạnh đối diện của nó.", "In a rectangle, the side parallel to a given side is the side opposite it.")
      })
     }
     if (k2 <= 3) {
      let ans = S(perp[0], perp[1]),
       opts = r.shuffle([ans, S(pp[0], pp[1]), S(0, 2)]);
      return QQ({
       q: LT("Trong " + shape + " **" + nm.join("") + "**, cạnh **" + nmS + "** vuông góc với cạnh nào?", "In the " + shape + " **" + nm.join("") + "**, which side is **" + nmS + "** perpendicular to?"),
       fig: {
        fb: FB.rect4(nm, [{
         dg: [0, 2]
        }], {
         square: sq
        }),
        f: 0
       },
       parts: [chp(opts, ans)],
       steps: [st(LT("Cạnh " + nmS + " và cạnh " + ans + " gặp nhau tại một góc vuông → vuông góc (cạnh " + S(perp2[0], perp2[1]) + " cũng vậy)", "Sides " + nmS + " and " + ans + " meet at a right angle → perpendicular (side " + S(perp2[0], perp2[1]) + " too)"))],
       tip: LT("Đường chéo không vuông góc với cạnh.", "A diagonal is not perpendicular to the sides.")
      })
     }
     let wh = r.chance(.5);
     return QQ({
      q: LT(shape.charAt(0).toUpperCase() + shape.slice(1) + " **" + nm.join("") + "** có bao nhiêu cặp cạnh " + (wh ? "**song song**" : "**vuông góc**") + " với nhau?", "How many pairs of " + (wh ? "**parallel**" : "**perpendicular**") + " sides does the " + shape + " **" + nm.join("") + "** have?"),
      fig: {
       fb: FB.rect4(nm, [{}], {
        square: sq
       }),
       f: 0
      },
      parts: [num("", wh ? 2 : 4, LT("cặp", "pairs"))],
      tip: LT("Hình chữ nhật có 2 cặp cạnh song song; mỗi góc vuông cho một cặp cạnh vuông góc.", "A rectangle has 2 pairs of parallel sides; each right angle gives one pair of perpendicular sides."),
      steps: [st(LT(wh ? "Các cặp song song: " + S(0, 1) + " và " + S(3, 2) + "; " + S(0, 3) + " và " + S(1, 2) : "Mỗi góc vuông là một cặp cạnh vuông góc, có 4 góc vuông", wh ? "The parallel pairs: " + S(0, 1) + " and " + S(3, 2) + "; " + S(0, 3) + " and " + S(1, 2) : "Each right angle gives one pair of perpendicular sides, and there are 4 right angles")), st(LT("Có " + (wh ? 2 : 4) + " cặp", "There are " + (wh ? 2 : 4) + " pairs"), wh ? 2 : 4)]
     })
    }
    let q0 = r.int(0, 19),
     k = q0 < 5 ? 0 : q0 < 10 ? 1 : q0 < 13 ? 2 : 3;
    if (k === 2) {
     let h = r.pick([3, 9, 6, 12, 2, 4, 10, 8]),
      dg = Math.min(h, 12 - h) % 12 * 30,
      ans = dg === 90 ? LT("Vuông góc", "Perpendicular") : dg === 180 ? LT("Thẳng hàng (góc bẹt)", "In a straight line (straight angle)") : dg === 0 ? LT("Trùng nhau", "On top of each other") : dg < 90 ? LT("Tạo thành góc nhọn", "They form an acute angle") : LT("Tạo thành góc tù", "They form an obtuse angle"),
      opts = [LT("Vuông góc", "Perpendicular"), LT("Tạo thành góc nhọn", "They form an acute angle"), LT("Tạo thành góc tù", "They form an obtuse angle"), LT("Thẳng hàng (góc bẹt)", "In a straight line (straight angle)"), LT("Trùng nhau", "On top of each other")];
     return QQ({
      q: LT("Lúc **" + h + " giờ đúng**, kim giờ và kim phút của đồng hồ như thế nào với nhau? (Xét góc không lớn hơn 180°.)", "At **" + h + " o'clock sharp**, how are the hour hand and the minute hand of the clock related to each other? (Use the angle that is not greater than 180°.)"),
      fig: {
       fb: FB.clock(h, 0),
       f: 0
      },
      parts: [chp(opts, ans)],
      steps: [st(LT(dg === 0 ? "Lúc 12 giờ, hai kim cùng chỉ vào số 12" : "Lúc " + h + " giờ, hai kim cách nhau " + Math.min(h, 12 - h) + " khoảng trên mặt đồng hồ, tạo thành góc " + dg + "°", dg === 0 ? "At 12 o'clock, both hands point to the 12" : "At " + h + " o'clock, the two hands are " + Math.min(h, 12 - h) + " intervals apart on the clock face, making an angle of " + dg + "°")), st("→ " + ans)],
      tip: LT("So sánh góc giữa hai kim với góc vuông (lúc 3 giờ hai kim vuông góc).", "Compare the angle between the two hands with a right angle (at 3 o'clock the two hands are perpendicular).")
     })
    }
    let mT = r.pick(["M", "E", "I", "H"]),
     mB = r.pick(["N", "G", "K", "O"]);
    if (nm.indexOf(mT) >= 0 || nm.indexOf(mB) >= 0 || mT === mB) return byId("lines").gen(3, r);
    let fig = {
     fb: FB.rect4(nm, [{}], {
      mn: {
       r: r.pick([.35, .45, .6]),
       t: mT,
       b: mB
      }
     }),
     f: 0
    };
    if (k === 3) {
     let wh = q0 < 17,
      cnt = wh ? 4 : 6,
      lst = wh ? [S(0, 1) + " ∥ " + S(3, 2), S(0, 3) + " ∥ " + S(1, 2), S(0, 3) + " ∥ " + mT + mB, S(1, 2) + " ∥ " + mT + mB] : [S(0, 1) + " ⊥ " + S(0, 3), S(0, 1) + " ⊥ " + S(1, 2), S(3, 2) + " ⊥ " + S(0, 3), S(3, 2) + " ⊥ " + S(1, 2), S(0, 1) + " ⊥ " + mT + mB, S(3, 2) + " ⊥ " + mT + mB],
      segs = S(0, 1) + ", " + S(1, 2) + ", " + S(3, 2) + ", " + S(0, 3) + ", " + mT + mB;
     return QQ({
      q: LT("Cho hình chữ nhật **" + nm.join("") + "** và đoạn thẳng **" + mT + mB + "** vuông góc với hai cạnh " + S(0, 1) + " và " + S(3, 2) + " (như hình). Trong năm đoạn thẳng " + segs + ", có bao nhiêu cặp đoạn thẳng " + (wh ? "**song song**" : "**vuông góc**") + " với nhau?", "Rectangle **" + nm.join("") + "** and segment **" + mT + mB + "** are shown. The segment is perpendicular to sides " + S(0, 1) + " and " + S(3, 2) + " (as in the picture). Among the five segments " + segs + ", how many pairs of segments are " + (wh ? "**parallel**" : "**perpendicular**") + " to each other?"),
      fig,
      parts: [num("", cnt, LT("cặp", "pairs"))],
      steps: [st(LT("Các cặp " + (wh ? "song song" : "vuông góc") + ": " + lst.join("; "), "The " + (wh ? "parallel" : "perpendicular") + " pairs: " + lst.join("; "))), st(LT("Có " + cnt + " cặp", "There are " + cnt + " pairs"), cnt)],
      diag: DG.step(wh ? [2] : [4], LT("Con mới đếm các cặp cạnh của hình chữ nhật. Đừng quên các cặp có đoạn " + mT + mB + ".", "You only counted the pairs of sides of the rectangle. Don't forget the pairs that include segment " + mT + mB + ".")),
      tip: LT("Đoạn " + mT + mB + " song song với " + S(0, 3) + " và " + S(1, 2) + ", vuông góc với " + S(0, 1) + " và " + S(3, 2) + ". Liệt kê từng cặp rồi đếm.", "Segment " + mT + mB + " is parallel to " + S(0, 3) + " and " + S(1, 2) + ", and perpendicular to " + S(0, 1) + " and " + S(3, 2) + ". List each pair, then count.")
     })
    }
    if (k === 0) {
     let ans = LT(S(0, 3) + " và " + S(1, 2), S(0, 3) + " and " + S(1, 2));
     return QQ({
      q: LT("Cho hình chữ nhật **" + nm.join("") + "**. Đoạn thẳng **" + mT + mB + "** nối một điểm trên cạnh " + S(0, 1) + " với một điểm trên cạnh " + S(3, 2) + " và vuông góc với " + S(3, 2) + ". Đoạn " + mT + mB + " song song với những cạnh nào?", "Rectangle **" + nm.join("") + "** is given. Segment **" + mT + mB + "** joins a point on side " + S(0, 1) + " to a point on side " + S(3, 2) + " and is perpendicular to " + S(3, 2) + ". Which sides is segment " + mT + mB + " parallel to?"),
      fig,
      parts: [chp(r.shuffle([ans, LT(S(0, 1) + " và " + S(3, 2), S(0, 1) + " and " + S(3, 2)), LT(S(0, 1) + " và " + S(0, 3), S(0, 1) + " and " + S(0, 3))]), ans)],
      steps: [st(LT(mT + mB + " vuông góc với " + S(3, 2) + ", giống như hai cạnh " + S(0, 3) + " và " + S(1, 2), mT + mB + " is perpendicular to " + S(3, 2) + ", just like the two sides " + S(0, 3) + " and " + S(1, 2))), st(LT("Nên " + mT + mB + " song song với " + ans, "So " + mT + mB + " is parallel to " + ans))],
      tip: LT("Hai đoạn cùng vuông góc với một đường thì song song với nhau.", "Two segments that are both perpendicular to the same line are parallel to each other.")
     })
    }
    return QQ({
     q: LT("Cho hình chữ nhật **" + nm.join("") + "** và đoạn thẳng **" + mT + mB + "** vuông góc với hai cạnh " + S(0, 1) + " và " + S(3, 2) + " (như hình). Trong hình có tất cả bao nhiêu góc vuông?", "Rectangle **" + nm.join("") + "** and segment **" + mT + mB + "** are shown. The segment is perpendicular to sides " + S(0, 1) + " and " + S(3, 2) + " (as in the picture). How many right angles are there in all in the picture?"),
     fig,
     parts: [num("", 8, LT("góc", "angles"))],
     steps: [st(LT("4 góc vuông ở 4 đỉnh hình chữ nhật", "4 right angles at the 4 vertices of the rectangle"), 4), st(LT("Tại " + mT + " có 2 góc vuông, tại " + mB + " có 2 góc vuông", "At " + mT + " there are 2 right angles, and at " + mB + " there are 2 right angles"), 4), st(LT("Tất cả: 4 + 4 = 8", "In all: 4 + 4 = 8"), 8)],
     diag: DG.step([4, 6], LT("Đừng quên các góc vuông tại hai điểm " + mT + " và " + mB + " (mỗi điểm có 2 góc vuông).", "Don't forget the right angles at the two points " + mT + " and " + mB + " (each point has 2 right angles).")),
     tip: LT("Đếm 4 góc vuông ở các đỉnh hình chữ nhật, rồi đếm thêm các góc vuông tại hai điểm " + mT + " và " + mB + ".", "Count the 4 right angles at the corners of the rectangle, then count the right angles at the two points " + mT + " and " + mB + ".")
    })
   }
  });
  FB.quad = function(kind, nm, frames) {
   let P2 = kind === "thoi" ? [
    [180, 34],
    [282, 116],
    [180, 198],
    [78, 116]
   ] : [
    [118, 40],
    [312, 40],
    [252, 160],
    [58, 160]
   ];
   return {
    frames: frames.map(f => {
     let els = [E.poly("q", P2.map(p => p.join(",")).join(" "), kind === "thoi" ? "rose" : "sky")];
     if ((f.hi || []).forEach(e => {
       let a = P2[e[0]],
        b = P2[(e[0] + 1) % 4];
       els.push(E.line("h" + e[0], a[0], a[1], b[0], b[1], e[1] || "orange", {
        sw: 7
       }))
      }), f.tick)
      for (let i = 0; i < 4; i++) {
       let a = P2[i],
        b = P2[(i + 1) % 4],
        m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2],
        dx = b[0] - a[0],
        dy = b[1] - a[1],
        l = Math.hypot(dx, dy),
        n = [-dy / l * 9, dx / l * 9];
       els.push(E.line("tk" + i, m[0] - n[0], m[1] - n[1], m[0] + n[0], m[1] + n[1], "red", {
        sw: 3
       }))
      }
     let c = [(P2[0][0] + P2[2][0]) / 2, (P2[0][1] + P2[2][1]) / 2];
     return nm.forEach((n, i) => {
      let d = [P2[i][0] - c[0], P2[i][1] - c[1]],
       l = Math.hypot(d[0], d[1]);
      els.push(E.text("v" + i, P2[i][0] + d[0] / l * 20, P2[i][1] + d[1] / l * 20 + 7, n, 21, "ink"))
     }), f.note && els.push(E.text("note", 180, kind === "thoi" ? 240 : 198, f.note, 19, "ink")), els
    }),
    vb: [360, kind === "thoi" ? 252 : 210]
   }
  };
  Object.assign(KIND_NAME, {
   cv_thoi: LT("Nhầm cách tính chu vi hình thoi (cạnh × 4)", "Mixed up how to find the perimeter of a rhombus (side × 4)"),
   nhan_canh: LT("Nhân hai cạnh (diện tích) thay vì tính chu vi", "Multiplied the two sides (area) instead of finding the perimeter")
  });
  LESSON({
   id: "hbh",
   reg: "hinh",
   title: LT("Hình bình hành, hình thoi", "Parallelograms and Rhombuses"),
   short: LT("Hình bình hành", "Parallelogram"),
   emoji: "🔷",
   blurb: LT("Nhận biết, tính chu vi", "Recognize them and find the perimeter"),
   links: ["lines", "mul"],
   rule: {
    h: LT("Nhớ nhé", "Remember"),
    items: [LT("**Hình bình hành**: hai cặp cạnh đối diện **song song** và **bằng nhau**.", "**Parallelogram**: two pairs of opposite sides that are **parallel** and **equal**."), LT("**Hình thoi**: hai cặp cạnh đối diện **song song** và **bốn cạnh bằng nhau**.", "**Rhombus**: two pairs of opposite sides that are **parallel**, and **all four sides are equal**."), LT("Chu vi hình bình hành = (cạnh dài + cạnh ngắn) × 2. Chu vi hình thoi = cạnh × 4.", "Perimeter of a parallelogram = (long side + short side) × 2. Perimeter of a rhombus = side × 4."), LT("⭐ Mở rộng (tùy chọn, SGK lớp 4 chưa học, không dùng trong bài tập): diện tích hình bình hành = đáy × chiều cao; hình thoi = (đường chéo thứ nhất × đường chéo thứ hai) : 2.", "⭐ Extension (optional, not in the grade 4 textbook, not used in the exercises): area of a parallelogram = base × height; rhombus = (first diagonal × second diagonal) ÷ 2.")]
   },
   figs: {
    q: () => FB.quad("hbh", ["A", "B", "C", "D"], [{}, {
     hi: [
      [0, "orange"],
      [2, "orange"]
     ],
     note: LT("AB ∥ DC và AB = DC", "AB ∥ DC and AB = DC")
    }, {
     hi: [
      [1, "blue"],
      [3, "blue"]
     ],
     note: LT("AD ∥ BC và AD = BC", "AD ∥ BC and AD = BC")
    }]),
    t: () => FB.quad("thoi", ["M", "N", "P", "Q"], [{}, {
     tick: 1,
     note: LT("Bốn cạnh bằng nhau", "All four sides are equal")
    }]),
    a: () => FB.hbh(8, 5, 3),
    b: () => FB.rhombus(8, 6)
   },
   teach: [{
    key: "q",
    f: 0,
    say: LT('Đây là **hình bình hành ABCD**. Nó trông như hình chữ nhật bị "đẩy nghiêng".', "This is **parallelogram ABCD**. It looks like a rectangle that has been pushed to the side.")
   }, {
    key: "q",
    f: 1,
    say: LT("Cạnh **AB song song** và **bằng** cạnh **DC**.", "Side **AB is parallel** and **equal** to side **DC**.")
   }, {
    key: "q",
    f: 2,
    say: LT("Cạnh **AD song song** và **bằng** cạnh **BC**. Vậy hình bình hành có **hai cặp cạnh đối diện song song và bằng nhau**.", "Side **AD is parallel** and **equal** to side **BC**. So a parallelogram has **two pairs of opposite sides that are parallel and equal**.")
   }, {
    key: "q",
    f: 2,
    say: LT("Chu vi hình bình hành: cộng cạnh dài với cạnh ngắn rồi nhân 2. Ví dụ AB = 6 cm, AD = 4 cm thì chu vi là (6 + 4) × 2 = **20 cm**.", "Perimeter of a parallelogram: add the long side and the short side, then multiply by 2. For example, if AB = 6 cm and AD = 4 cm, the perimeter is (6 + 4) × 2 = **20 cm**.")
   }, {
    key: "t",
    f: 0,
    say: LT("Đây là **hình thoi MNPQ**.", "This is **rhombus MNPQ**.")
   }, {
    key: "t",
    f: 1,
    say: LT("Hình thoi có **hai cặp cạnh đối diện song song** và **bốn cạnh bằng nhau**.", "A rhombus has **two pairs of opposite sides that are parallel** and **four equal sides**.")
   }, {
    key: "t",
    f: 1,
    say: LT("Cùng làm: hình thoi cạnh 5 cm có chu vi bao nhiêu?", "Let's do it together: what is the perimeter of a rhombus with sides of 5 cm?"),
    ask: {
     opts: ["10 cm", "20 cm", "25 cm"],
     ans: "20 cm",
     good: LT("Đúng! Hình thoi có bốn cạnh bằng nhau: 5 × 4 = 20 cm.", "Correct! A rhombus has four equal sides: 5 × 4 = 20 cm.")
    }
   }, {
    key: "a",
    f: 0,
    say: LT("(⭐ Thử thách – học kĩ ở lớp trên) Tính **diện tích** hình bình hành bằng cách cắt ghép. Hình bình hành này có đáy **8 cm**.", "(⭐ Challenge – you will study this more in later grades) Let's find the **area** of a parallelogram by cutting and rearranging. This parallelogram has a base of **8 cm**.")
   }, {
    key: "a",
    f: 1,
    say: LT("(⭐ Thử thách) Kẻ **chiều cao** (nét đứt đỏ) vuông góc với đáy: chiều cao dài **5 cm**. Phần tam giác cam ở bên trái có thể cắt ra.", "(⭐ Challenge) Draw the **height** (red dashed line) perpendicular to the base: the height is **5 cm**. The orange triangle on the left can be cut off.")
   }, {
    key: "a",
    f: 2,
    say: LT("(⭐ Thử thách) Dịch tam giác sang bên phải... hình bình hành biến thành một **hình chữ nhật** dài 8 cm, rộng 5 cm!", "(⭐ Challenge) Slide the triangle to the right... and the parallelogram turns into a **rectangle** 8 cm long and 5 cm wide!")
   }, {
    key: "a",
    f: 2,
    say: LT("Cùng làm: hình chữ nhật dài 8 cm, rộng 5 cm có diện tích bao nhiêu xăng-ti-mét vuông?", "Let's do it together: what is the area of a rectangle 8 cm long and 5 cm wide, in square centimeters?"),
    ask: {
     opts: ["13", "40", "45"],
     ans: "40",
     good: LT("Đúng! 8 × 5 = 40 cm².", "Correct! 8 × 5 = 40 cm².")
    }
   }, {
    key: "a",
    f: 3,
    say: LT("(⭐ Thử thách) Hình chữ nhật 8 × 5 = 40 cm². Vậy diện tích hình bình hành = **đáy × chiều cao**.", "(⭐ Challenge) The rectangle is 8 × 5 = 40 cm². So the area of a parallelogram = **base × height**.")
   }, {
    key: "b",
    f: 1,
    say: LT("(⭐ Thử thách) Hình thoi có hai đường chéo vuông góc với nhau, dài **8 cm** và **6 cm**.", "(⭐ Challenge) The two diagonals of a rhombus are perpendicular to each other, and they are **8 cm** and **6 cm** long.")
   }, {
    key: "b",
    f: 2,
    say: LT("(⭐ Thử thách) Hình thoi bằng **một nửa** hình chữ nhật 8 × 6. Nên diện tích = (8 × 6) : 2 = **24 cm²**.", "(⭐ Challenge) The rhombus is **half** of an 8 × 6 rectangle. So its area = (8 × 6) ÷ 2 = **24 cm²**.")
   }],
   gen(t, r) {
    let l = this;
    if (t === 1) {
     let k = r.int(0, 2),
      nm = r.pick(R4),
      thoi = r.chance(.5),
      kind = thoi ? "thoi" : "hbh",
      nmS = (i, j) => nm[i] + nm[j];
     if (k === 0) {
      let ans = LT(thoi ? "Hai cặp cạnh đối diện song song và bốn cạnh bằng nhau" : "Hai cặp cạnh đối diện song song và bằng nhau", thoi ? "Two pairs of opposite sides are parallel and all four sides are equal" : "Two pairs of opposite sides are parallel and equal");
      return QQ({
       q: LT("Hình " + (thoi ? "thoi" : "bình hành") + " **" + nm.join("") + "** có đặc điểm nào?", "Which of these is true about " + (thoi ? "rhombus" : "parallelogram") + " **" + nm.join("") + "**?"),
       fig: {
        fb: FB.quad(kind, nm, [{}]),
        f: 0
       },
       parts: [chp(r.shuffle([ans, thoi ? LT("Bốn góc đều là góc vuông", "All four angles are right angles") : LT("Bốn cạnh bằng nhau và bốn góc vuông", "All four sides are equal and all four angles are right angles"), LT("Chỉ có một cặp cạnh song song", "Only one pair of sides is parallel")]), ans)],
       steps: [st(LT("Hình " + (thoi ? "thoi" : "bình hành") + ": " + ans.toLowerCase(), "A " + (thoi ? "rhombus" : "parallelogram") + ": " + ans.toLowerCase()))],
       tip: LT("Hình bình hành: các cạnh đối song song và bằng nhau. Hình thoi: có thêm bốn cạnh bằng nhau. Không có góc vuông.", "Parallelogram: opposite sides are parallel and equal. Rhombus: all four sides are also equal. Neither needs right angles.")
      })
     }
     let sides = [
       [0, 1],
       [1, 2],
       [3, 2],
       [0, 3]
      ],
      par = {
       0: 2,
       2: 0,
       1: 3,
       3: 1
      },
      si = r.int(0, 3),
      sd = sides[si],
      pp = sides[par[si]],
      adj = sides[(si + 1) % 4];
     if (k === 1) {
      let ans = nmS(pp[0], pp[1]);
      return QQ({
       q: LT("Trong hình " + (thoi ? "thoi" : "bình hành") + " **" + nm.join("") + "**, cạnh **" + nmS(sd[0], sd[1]) + "** song song với cạnh nào?", "In " + (thoi ? "rhombus" : "parallelogram") + " **" + nm.join("") + "**, which side is **" + nmS(sd[0], sd[1]) + "** parallel to?"),
       fig: {
        fb: FB.quad(kind, nm, [{
         hi: [
          [si === 2 ? 2 : si === 3 ? 3 : si, "orange"]
         ]
        }]),
        f: 0
       },
       parts: [chp(r.shuffle([ans, nmS(adj[0], adj[1]), nmS(0, 2)]), ans)],
       steps: [st(LT("Cạnh đối diện với " + nmS(sd[0], sd[1]) + " là " + ans + " → song song", "The side opposite " + nmS(sd[0], sd[1]) + " is " + ans + " → parallel"))],
       tip: LT("Cạnh song song với một cạnh là cạnh đối diện của nó, không phải cạnh liền nhau hay đường chéo.", "The side parallel to a given side is the side opposite it, not a neighboring side or a diagonal.")
      })
     }
     let a = rd(r, 3, 15),
      ask = thoi ? adj : pp;
     return QQ({
      q: LT("Hình " + (thoi ? "thoi" : "bình hành") + " **" + nm.join("") + "** có cạnh **" + nmS(sd[0], sd[1]) + " = " + a + " cm**. Cạnh **" + nmS(ask[0], ask[1]) + "** dài bao nhiêu xăng-ti-mét?", "In " + (thoi ? "rhombus" : "parallelogram") + " **" + nm.join("") + "**, side **" + nmS(sd[0], sd[1]) + " = " + a + " cm**. How many centimeters long is side **" + nmS(ask[0], ask[1]) + "**?"),
      fig: {
       fb: FB.quad(kind, nm, [thoi ? {
        tick: 1
       } : {}]),
       f: 0
      },
      parts: [num("", a, "cm")],
      steps: [st(LT(thoi ? "Hình thoi có bốn cạnh bằng nhau nên " + nmS(ask[0], ask[1]) + " = " + nmS(sd[0], sd[1]) + " = " + a + " cm" : nmS(ask[0], ask[1]) + " là cạnh đối diện với " + nmS(sd[0], sd[1]) + "; hình bình hành có các cạnh đối diện bằng nhau nên " + nmS(ask[0], ask[1]) + " = " + a + " cm", thoi ? "A rhombus has four equal sides, so " + nmS(ask[0], ask[1]) + " = " + nmS(sd[0], sd[1]) + " = " + a + " cm" : nmS(ask[0], ask[1]) + " is the side opposite " + nmS(sd[0], sd[1]) + "; a parallelogram has equal opposite sides, so " + nmS(ask[0], ask[1]) + " = " + a + " cm"), a)],
      tip: thoi ? LT("Hình thoi có bốn cạnh bằng nhau.", "A rhombus has four equal sides.") : LT("Hình bình hành có các cạnh đối diện bằng nhau.", "A parallelogram has equal opposite sides.")
     })
    }
    if (t === 2) {
     let k = r.int(0, 2);
     if (k === 0) {
      let a2 = rd(r, 3, 25);
      return QQ({
       q: LT("Một hình thoi có cạnh dài **" + a2 + " cm**. Tính chu vi hình thoi.", "A rhombus has sides **" + a2 + " cm** long. Find the perimeter of the rhombus."),
       fig: {
        fb: FB.quad("thoi", r.pick(R4), [{
         tick: 1
        }]),
        f: 0
       },
       parts: [num("", 4 * a2, "cm")],
       steps: [st(LT("Hình thoi có bốn cạnh bằng nhau: " + a2 + " × 4 = " + 4 * a2, "A rhombus has four equal sides: " + a2 + " × 4 = " + 4 * a2), 4 * a2)],
       diag: DG.step([2 * a2, a2 * a2], LT("Hình thoi có 4 cạnh bằng nhau: chu vi = cạnh × 4.", "A rhombus has 4 equal sides: perimeter = side × 4."), "cv_thoi"),
       tip: LT("Chu vi hình thoi = cạnh × 4.", "Perimeter of a rhombus = side × 4.")
      })
     }
     if (k === 1) {
      let a2 = rd(r, 6, 25),
       b = rd(r, 3, a2 - 1);
      return QQ({
       q: LT("Hình bình hành có hai cạnh liền nhau dài **" + a2 + " cm** và **" + b + " cm**. Tính chu vi.", "A parallelogram has two neighboring sides that are **" + a2 + " cm** and **" + b + " cm** long. Find the perimeter."),
       fig: {
        fb: FB.quad("hbh", r.pick(R4), [{}]),
        f: 0
       },
       parts: [num("", 2 * (a2 + b), "cm")],
       steps: [st(LT("Nửa chu vi: " + a2 + " + " + b + " = " + (a2 + b), "Half the perimeter: " + a2 + " + " + b + " = " + (a2 + b)), a2 + b), st(LT("Chu vi: " + (a2 + b) + " × 2 = " + 2 * (a2 + b), "Perimeter: " + (a2 + b) + " × 2 = " + 2 * (a2 + b)), 2 * (a2 + b))],
       diag: DG.any((vals, q2) => V(vals, 0) === a2 + b ? {
        kind: "nua_cv",
        msg: LT("Đó mới là nửa chu vi. Hình bình hành có hai cặp cạnh bằng nhau: nhân 2.", "That is only half the perimeter. A parallelogram has two pairs of equal sides: multiply by 2.")
       } : null, DG.step([a2 * b], LT("Nhân hai cạnh là tính diện tích. Chu vi là tổng độ dài các cạnh: (cạnh dài + cạnh ngắn) × 2.", "Multiplying the two sides gives an area. The perimeter is the sum of all the sides: (long side + short side) × 2."), "nhan_canh")),
       tip: LT("Chu vi hình bình hành = (cạnh dài + cạnh ngắn) × 2.", "Perimeter of a parallelogram = (long side + short side) × 2.")
      })
     }
     let a = rd(r, 3, 30);
     return QQ({
      q: LT("Một hình thoi có chu vi **" + 4 * a + " cm**. Tính độ dài một cạnh.", "A rhombus has a perimeter of **" + 4 * a + " cm**. Find the length of one side."),
      parts: [num("", a, "cm")],
      steps: [st(LT("Hình thoi có bốn cạnh bằng nhau: " + 4 * a + " : 4 = " + a, "A rhombus has four equal sides: " + 4 * a + " ÷ 4 = " + a), a)],
      diag: DG.step([2 * a], LT("Hình thoi có 4 cạnh bằng nhau: chia chu vi cho 4.", "A rhombus has 4 equal sides: divide the perimeter by 4."), "cv_thoi"),
      tip: LT("Chu vi hình thoi = cạnh × 4, nên cạnh = chu vi : 4.", "Perimeter of a rhombus = side × 4, so side = perimeter ÷ 4.")
     })
    }
    let k = r.int(0, 4);
    if (k === 0) {
     let a = rd(r, 8, 30),
      b = rd(r, 3, a - 1),
      P = 2 * (a + b);
     return QQ({
      q: LT("Hình bình hành có chu vi **" + P + " cm**, một cạnh dài **" + a + " cm**. Tính độ dài cạnh liền kề với nó.", "A parallelogram has a perimeter of **" + P + " cm**, and one side is **" + a + " cm** long. Find the length of the side next to it."),
      fig: {
       fb: FB.quad("hbh", r.pick(R4), [{}]),
       f: 0
      },
      parts: [num("", b, "cm")],
      steps: [st(LT("Nửa chu vi (tổng hai cạnh liền nhau): " + P + " : 2 = " + (a + b), "Half the perimeter (sum of two neighboring sides): " + P + " ÷ 2 = " + (a + b)), a + b), st(LT("Cạnh kia: " + (a + b) + " − " + a + " = " + b, "The other side: " + (a + b) + " − " + a + " = " + b), b)],
      diag: DG.any(DG.step([a + b], LT("Đó mới là nửa chu vi (tổng hai cạnh liền nhau). Còn phải trừ cạnh đã biết.", "That is only half the perimeter (the sum of two neighboring sides). You still need to subtract the known side.")), DG.step([P - a], LT("Chu vi gồm hai cặp cạnh: chia 2 để được tổng hai cạnh liền nhau, rồi trừ cạnh đã biết.", "The perimeter is made of two pairs of sides: divide by 2 to get the sum of two neighboring sides, then subtract the known side."), "quen_chia")),
      tip: LT("Chu vi : 2 = cạnh dài + cạnh ngắn.", "Perimeter ÷ 2 = long side + short side.")
     })
    }
    if (k === 1) {
     let a = rd(r, 6, 30),
      b = rd(r, 3, a - 1);
     if ((a + b) % 2) a += 1;
     let P = 2 * (a + b),
      c = P / 4;
     return QQ({
      q: LT("Một hình bình hành có hai cạnh liền nhau dài **" + a + " cm** và **" + b + " cm**. Một hình thoi có chu vi bằng chu vi hình bình hành đó. Tính cạnh hình thoi.", "A parallelogram has two neighboring sides that are **" + a + " cm** and **" + b + " cm** long. A rhombus has the same perimeter as that parallelogram. Find the side of the rhombus."),
      parts: [num(LT("Cạnh hình thoi", "Rhombus side"), c, "cm")],
      steps: [st(LT("Chu vi hình bình hành: (" + a + " + " + b + ") × 2 = " + P, "Perimeter of the parallelogram: (" + a + " + " + b + ") × 2 = " + P), P), st(LT("Cạnh hình thoi: " + P + " : 4 = " + c, "Rhombus side: " + P + " ÷ 4 = " + c), c)],
      diag: DG.step([P, a + b], LT("Tìm chu vi trước, rồi chia 4 vì hình thoi có bốn cạnh bằng nhau.", "Find the perimeter first, then divide by 4 because a rhombus has four equal sides.")),
      tip: LT("Tính chu vi hình bình hành trước, rồi chia 4.", "Find the perimeter of the parallelogram first, then divide by 4.")
     })
    }
    if (k === 2) {
     let b = rd(r, 3, 20),
      d = rd(r, 2, 10),
      a = b + d,
      P = 2 * (a + b),
      S = a + b;
     return QQ({
      q: LT("Hình bình hành có chu vi **" + P + " cm**. Cạnh dài hơn cạnh ngắn **" + d + " cm**. Tính độ dài cạnh dài.", "A parallelogram has a perimeter of **" + P + " cm**. The long side is **" + d + " cm** longer than the short side. Find the length of the long side."),
      fig: {
       fb: FB.quad("hbh", r.pick(R4), [{}]),
       f: 0
      },
      parts: [num(LT("Cạnh dài", "Long side"), a, "cm")],
      steps: [st(LT("Nửa chu vi (tổng cạnh dài và cạnh ngắn): " + P + " : 2 = " + S, "Half the perimeter (long side + short side): " + P + " ÷ 2 = " + S), S), st(LT("Cạnh dài: (" + S + " + " + d + ") : 2 = " + a, "Long side: (" + S + " + " + d + ") ÷ 2 = " + a), a)],
      diag: DG.any(DG.step([S], LT("Đó mới là tổng cạnh dài và cạnh ngắn. Đây là bài tổng – hiệu.", "That is only the sum of the long and short sides. This is a sum and difference problem.")), DG.step([b], LT("Đó là cạnh ngắn. Đề hỏi cạnh dài.", "That is the short side. The question asks for the long side."))),
      tip: LT("Nửa chu vi là tổng hai cạnh, cạnh dài hơn cạnh ngắn " + d + " cm: bài toán tổng – hiệu.", "Half the perimeter is the sum of the two sides, and the long side is " + d + " cm longer: a sum and difference problem.")
     })
    }
    if (k === 3) {
     let m = r.pick([2, 3, 4]),
      b = rd(r, 3, 14),
      P = 2 * b * (m + 1);
     return QQ({
      q: LT("Hình bình hành có chu vi **" + P + " cm**. Cạnh dài gấp **" + m + " lần** cạnh ngắn. Tính độ dài cạnh ngắn.", "A parallelogram has a perimeter of **" + P + " cm**. The long side is **" + m + " times** as long as the short side. Find the length of the short side."),
      fig: {
       fb: FB.quad("hbh", r.pick(R4), [{}]),
       f: 0
      },
      parts: [num(LT("Cạnh ngắn", "Short side"), b, "cm")],
      steps: [st(LT("Nửa chu vi (tổng cạnh dài và cạnh ngắn): " + P + " : 2 = " + P / 2, "Half the perimeter (long side + short side): " + P + " ÷ 2 = " + P / 2), P / 2), st(LT("Cạnh ngắn là 1 phần, cạnh dài là " + m + " phần: tất cả " + (m + 1) + " phần", "The short side is 1 part and the long side is " + m + " parts: " + (m + 1) + " parts in all"), m + 1), st(LT("Cạnh ngắn: " + P / 2 + " : " + (m + 1) + " = " + b, "Short side: " + P / 2 + " ÷ " + (m + 1) + " = " + b), b)],
      diag: DG.any(DG.step([P / 2], LT("Đó mới là tổng cạnh dài và cạnh ngắn. Chia cho số phần để tìm cạnh ngắn.", "That is only the sum of the long and short sides. Divide by the number of parts to find the short side.")), DG.step([b * m], LT("Đó là cạnh dài. Đề hỏi cạnh ngắn.", "That is the long side. The question asks for the short side."))),
      tip: LT("Nửa chu vi là tổng cạnh dài và cạnh ngắn. Vẽ sơ đồ: cạnh ngắn 1 phần, cạnh dài " + m + " phần.", "Half the perimeter is the long side plus the short side. Draw a diagram: 1 part for the short side, " + m + " parts for the long side.")
     })
    }
    let a = rd(r, 8, 25),
     b = rd(r, 4, a - 1),
     c = rd(r, 3, Math.ceil((a + b) / 2) - 1),
     P1 = 2 * (a + b),
     P2 = 4 * c;
    return QQ({
     q: LT("Một hình bình hành có hai cạnh liền nhau dài **" + a + " cm** và **" + b + " cm**. Một hình thoi có cạnh dài **" + c + " cm**. Chu vi hình bình hành hơn chu vi hình thoi bao nhiêu xăng-ti-mét?", "A parallelogram has two neighboring sides that are **" + a + " cm** and **" + b + " cm** long. A rhombus has sides **" + c + " cm** long. How many centimeters greater is the perimeter of the parallelogram than the perimeter of the rhombus?"),
     parts: [num("", P1 - P2, "cm")],
     steps: [st(LT("Chu vi hình bình hành: (" + a + " + " + b + ") × 2 = " + P1, "Perimeter of the parallelogram: (" + a + " + " + b + ") × 2 = " + P1), P1), st(LT("Chu vi hình thoi: " + c + " × 4 = " + P2, "Perimeter of the rhombus: " + c + " × 4 = " + P2), P2), st(LT("Hơn nhau: " + P1 + " − " + P2 + " = " + (P1 - P2), "Difference: " + P1 + " − " + P2 + " = " + (P1 - P2)), P1 - P2)],
     diag: DG.any(DG.step([P1, P2], LT("Đó mới là chu vi của một hình. Đề hỏi hai chu vi hơn nhau bao nhiêu: lấy số lớn trừ số bé.", "That is only the perimeter of one shape. The question asks how much greater one perimeter is: subtract the smaller from the larger.")), DG.step([a + b], LT("Đó mới là nửa chu vi hình bình hành. Nhân 2 rồi so với chu vi hình thoi.", "That is only half the perimeter of the parallelogram. Multiply by 2, then compare with the perimeter of the rhombus."))),
     tip: LT("Tính chu vi từng hình rồi trừ: hình bình hành (cạnh dài + cạnh ngắn) × 2, hình thoi cạnh × 4.", "Find each perimeter, then subtract: parallelogram (long side + short side) × 2, rhombus side × 4.")
    })
   }
  });
  Object.assign(KIND_NAME, {
   he_so_60: LT("Dùng sai hệ số đổi (100 hoặc 10 thay vì 60)", "Used the wrong conversion factor (100 or 10 instead of 60)"),
   chua_doi: LT("Chưa đổi đơn vị (chép lại số cũ)", "Did not change the unit (copied the old number)")
  });
  LESSON({
   id: "mass",
   reg: "hinh",
   title: LT("Yến, tạ, tấn", "Yến, tạ, metric tons"),
   emoji: "⚖️",
   blurb: LT("Đơn vị đo khối lượng", "Units of mass"),
   links: ["addsub"],
   rule: {
    h: LT("Bảng đơn vị", "Unit table"),
    items: [LT("1 tấn = 10 tạ = 100 yến = 1 000 kg", "1 metric ton = 10 tạ = 100 yến = 1,000 kg"), LT("1 tạ = 10 yến = 100 kg", "1 tạ = 10 yến = 100 kg"), LT("1 yến = 10 kg", "1 yến = 10 kg"), LT("Đổi sang đơn vị bé hơn: **nhân**. Sang đơn vị lớn hơn: **chia**.", "To change to a smaller unit, **multiply**. To change to a larger unit, **divide**."), LT("So sánh hai khối lượng: đổi về **cùng một đơn vị** rồi so sánh.", "To compare two masses, change them to **the same unit** first, then compare.")]
   },
   figs: {
    a: () => FB.ladder([{
     n: LT("tấn", "ton"),
     s: LT(fmt(1000) + " kg", fmt(1000) + " kg")
    }, {
     n: LT("tạ", "tạ"),
     s: "100 kg"
    }, {
     n: LT("yến", "yến"),
     s: "10 kg"
    }, {
     n: "kg",
     s: "1 kg"
    }], 10, [{}, {
     hi: [1, 3],
     path: [1, 2],
     note: LT("1 tạ = 10 yến = 100 kg", "1 tạ = 10 yến = 100 kg")
    }, {
     hi: [0, 1],
     path: [0],
     note: LT("1 tấn = 10 tạ", "1 metric ton = 10 tạ"),
     note2: LT("Sang phải ×10, sang trái :10", "Going right: ×10. Going left: ÷10")
    }], {
     h: 236
    })
   },
   teach: [{
    key: "a",
    f: 0,
    say: LT("Bốn đơn vị khối lượng xếp thành bậc thang: **tấn, tạ, yến, ki-lô-gam**. Mỗi bậc hơn kém nhau **10 lần**.", "The four units of mass make a ladder: **metric ton, tạ, yến, kilogram**. (A tạ is 100 kg and a yến is 10 kg. The picture shortens metric ton to ton.) Each step is **10 times** the next.")
   }, {
    key: "a",
    f: 1,
    say: LT("Đi xuống một bậc thì **nhân 10**: 1 tạ = 10 yến, 1 yến = 10 kg, nên 1 tạ = **100 kg**.", "Going down one step, **multiply by 10**: 1 tạ = 10 yến and 1 yến = 10 kg, so 1 tạ = **100 kg**.")
   }, {
    key: "a",
    f: 2,
    say: LT("Đi lên một bậc thì **chia 10**. Ví dụ: 30 yến = 30 : 10 = **3 tạ**; 5 000 kg = **5 tấn** (vì 1 000 kg = 1 tấn).", "Going up one step, **divide by 10**. For example: 30 yến = 30 ÷ 10 = **3 tạ**; 5,000 kg = **5 metric tons** (because 1,000 kg = 1 metric ton).")
   }, {
    key: "a",
    f: 2,
    say: LT("Đổi số lẻ: 2 500 kg = 2 000 kg + 500 kg = **2 tấn 5 tạ**. So sánh **2 tấn 5 tạ** với **2 050 kg**: 2 tấn 5 tạ = 2 500 kg, mà 2 500 > 2 050, nên 2 tấn 5 tạ **>** 2 050 kg.", "Mixed amounts: 2,500 kg = 2,000 kg + 500 kg = **2 metric tons 5 tạ**. Compare **2 metric tons 5 tạ** with **2,050 kg**: 2 metric tons 5 tạ = 2,500 kg, and 2,500 > 2,050, so 2 metric tons 5 tạ **>** 2,050 kg.")
   }],
   gen(tier, r) {
    if (tier === 1) {
     let a2 = rd(r, 2, 9),
      k1 = r.int(0, 3);
     return k1 === 0 ? QQ({
      q: LT(a2 + " yến = ? kg", a2 + " yến = ? kg"),
      parts: [num("", a2 * 10, "kg")],
      steps: [st(LT("1 yến = 10 kg → " + a2 + " × 10 = " + a2 * 10, "1 yến = 10 kg → " + a2 + " × 10 = " + a2 * 10), a2 * 10)]
     }) : k1 === 1 ? QQ({
      q: LT(a2 * 10 + " kg = ? yến", a2 * 10 + " kg = ? yến"),
      parts: [num("", a2, LT("yến", "yến"))],
      steps: [st(LT("10 kg = 1 yến → " + a2 * 10 + " : 10 = " + a2, "10 kg = 1 yến → " + a2 * 10 + " ÷ 10 = " + a2), a2)]
     }) : k1 === 2 ? QQ({
      q: LT(a2 + " tạ = ? yến", a2 + " tạ = ? yến"),
      parts: [num("", a2 * 10, LT("yến", "yến"))],
      steps: [st(LT("1 tạ = 10 yến → " + a2 + " × 10 = " + a2 * 10, "1 tạ = 10 yến → " + a2 + " × 10 = " + a2 * 10), a2 * 10)]
     }) : QQ({
      q: LT(a2 * 10 + " yến = ? tạ", a2 * 10 + " yến = ? tạ"),
      parts: [num("", a2, LT("tạ", "tạ"))],
      steps: [st(LT("10 yến = 1 tạ → " + a2 * 10 + " : 10 = " + a2, "10 yến = 1 tạ → " + a2 * 10 + " ÷ 10 = " + a2), a2)]
     })
    }
    if (tier === 2) {
     let a2 = rd(r, 2, 9),
      b2 = rd(r, 1, 9),
      k = r.int(0, 4);
     return k === 0 ? QQ({
      q: LT(a2 + " tạ = ? kg", a2 + " tạ = ? kg"),
      parts: [num("", a2 * 100, "kg")],
      steps: [st(LT("1 tạ = 100 kg → " + a2 + " × 100 = " + a2 * 100, "1 tạ = 100 kg → " + a2 + " × 100 = " + a2 * 100), a2 * 100)]
     }) : k === 1 ? QQ({
      q: LT(a2 + " tấn " + b2 + " tạ = ? tạ", a2 + " metric tons " + b2 + " tạ = ? tạ"),
      parts: [num("", a2 * 10 + b2, LT("tạ", "tạ"))],
      steps: [st(LT(a2 + " tấn = " + a2 * 10 + " tạ", a2 + " metric tons = " + a2 * 10 + " tạ"), a2 * 10), st(a2 * 10 + " + " + b2 + " = " + (a2 * 10 + b2), a2 * 10 + b2)]
     }) : k === 2 ? QQ({
      q: LT(a2 + " tấn = ? kg", a2 + " metric tons = ? kg"),
      parts: [num("", a2 * 1e3, "kg")],
      steps: [st(LT("1 tấn = 1 000 kg → " + a2 + " × 1 000 = " + fmt(a2 * 1e3), "1 metric ton = 1,000 kg → " + a2 + " × 1,000 = " + fmt(a2 * 1e3)), a2 * 1e3)]
     }) : k === 3 ? QQ({
      q: LT(fmt(a2 * 1e3 + b2 * 100) + " kg = ? tấn ? tạ", fmt(a2 * 1e3 + b2 * 100) + " kg = ? metric tons ? tạ"),
      parts: [num("", a2, LT("tấn", "metric tons")), num("", b2, LT("tạ", "tạ"))],
      steps: [st(fmt(a2 * 1e3 + b2 * 100) + " kg = " + fmt(a2 * 1e3) + " kg + " + b2 * 100 + " kg"), st(LT(fmt(a2 * 1e3) + " kg = " + a2 + " tấn; " + b2 * 100 + " kg = " + b2 + " tạ", fmt(a2 * 1e3) + " kg = " + a2 + " metric tons; " + b2 * 100 + " kg = " + b2 + " tạ"), a2), st(LT("Viết: " + a2 + " tấn " + b2 + " tạ", "Write: " + a2 + " metric tons " + b2 + " tạ"), b2)],
      tip: LT("1 000 kg = 1 tấn; 100 kg = 1 tạ.", "1,000 kg = 1 metric ton; 100 kg = 1 tạ.")
     }) : QQ({
      q: LT(a2 * 10 + " tạ = ? tấn", a2 * 10 + " tạ = ? metric tons"),
      parts: [num("", a2, LT("tấn", "metric tons"))],
      steps: [st(LT("10 tạ = 1 tấn → " + a2 * 10 + " : 10 = " + a2, "10 tạ = 1 metric ton → " + a2 * 10 + " ÷ 10 = " + a2), a2)]
     })
    }
    let k = r.int(0, 3);
    if (k === 3) {
     let a = rd(r, 3, 9),
      b = rd(r, 1, 9),
      c = rd(r, 1, a * 10 - 1),
      L = a * 1e3 + b * 100,
      D = c * 10,
      ans = L - D;
     if (ans <= 0) return byId("mass").gen(3, r);
     return QQ({
      q: LT("Kho có **" + a + " tấn " + b + " tạ** gạo. Người ta xuất đi **" + c + " yến** gạo. Hỏi trong kho còn lại bao nhiêu ki-lô-gam gạo?", "A warehouse has **" + a + " metric tons " + b + " tạ** of rice. **" + c + " yến** of rice is taken out. How many kilograms of rice are left in the warehouse?"),
      parts: [num("", ans, "kg")],
      steps: [st(LT(a + " tấn " + b + " tạ = " + fmt(L) + " kg", a + " metric tons " + b + " tạ = " + fmt(L) + " kg"), L), st(LT(c + " yến = " + fmt(D) + " kg", c + " yến = " + fmt(D) + " kg"), D), st(LT("Còn lại: " + fmt(L) + " − " + fmt(D) + " = " + fmt(ans), "Left: " + fmt(L) + " − " + fmt(D) + " = " + fmt(ans)), ans)],
      tip: LT("Đổi tất cả về ki-lô-gam rồi mới trừ.", "Change everything to kilograms before subtracting.")
     })
    }
    if (k === 1) {
     let a = rd(r, 1, 9),
      b = rd(r, 1, 9),
      L = a * 1e3 + b * 100,
      R = r.pick([a * 1e3 + b * 10, a * 1e3 + b * 100, a * 1e3 + (b + r.pick([-1, 1])) * 100, a * 1e3 + b * 100 + rd(r, 1, 9) * 10]);
     if (R <= a * 1e3) R = a * 1e3 + b * 100 + 50;
     let s = L > R ? ">" : L < R ? "<" : "=";
     return QQ({
      q: LT("Điền dấu thích hợp: **" + a + " tấn " + b + " tạ … " + fmt(R) + " kg**", "Fill in the blank with >, <, or =: **" + a + (a === 1 ? " metric ton " : " metric tons ") + b + " tạ … " + fmt(R) + " kg**"),
      parts: [chp([">", "<", "="], s)],
      steps: [st(LT(a + " tấn = " + fmt(a * 1e3) + " kg; " + b + " tạ = " + b * 100 + " kg", a + (a === 1 ? " metric ton = " : " metric tons = ") + fmt(a * 1e3) + " kg; " + b + " tạ = " + b * 100 + " kg"), a * 1e3), st(LT(a + " tấn " + b + " tạ = " + fmt(L) + " kg", a + (a === 1 ? " metric ton " : " metric tons ") + b + " tạ = " + fmt(L) + " kg"), L), st(LT("So sánh " + fmt(L) + " và " + fmt(R) + " → " + s, "Compare " + fmt(L) + " and " + fmt(R) + " → " + s))],
      tip: LT("Đổi về cùng đơn vị ki-lô-gam rồi so sánh.", "Change both to kilograms, then compare.")
     })
    }
    if (k === 2) {
     let a = rd(r, 2, 9),
      c = rd(r, 1, 9) * 10,
      N = a * 1e3 + c;
     return QQ({
      q: LT(fmt(N) + " kg = ? tấn ? kg", fmt(N) + " kg = ? metric tons ? kg"),
      parts: [num("", a, LT("tấn", "metric tons")), num("", c, "kg")],
      steps: [st(fmt(N) + " kg = " + fmt(a * 1e3) + " kg + " + c + " kg"), st(LT(fmt(a * 1e3) + " kg = " + a + " tấn → " + a + " tấn " + c + " kg", fmt(a * 1e3) + " kg = " + a + " metric tons → " + a + " metric tons " + c + " kg"), a)],
      tip: LT("1 000 kg = 1 tấn. Chú ý chữ số 0 ở hàng trăm.", "1,000 kg = 1 metric ton. Watch the 0 in the hundreds place.")
     })
    }
    let a = rd(r, 2, 9),
     b = rd(r, 1, 9),
     c = rd(r, 1, 4),
     T = a * 100 + b * 10 + c * 1e3;
    return QQ({
     q: LT("Xe thứ nhất chở **" + a + " tạ** gạo, xe thứ hai chở **" + b + " yến** ngô, xe thứ ba chở **" + c + " tấn** khoai. Hỏi ba xe chở tất cả bao nhiêu ki-lô-gam?", "The first truck carries **" + a + " tạ** of rice, the second truck carries **" + b + " yến** of corn, and the third truck carries **" + c + (c === 1 ? " metric ton" : " metric tons") + "** of potatoes. How many kilograms do the three trucks carry in all?"),
     parts: [num("", T, "kg")],
     steps: [st(LT(a + " tạ = " + a * 100 + " kg", a + " tạ = " + a * 100 + " kg"), a * 100), st(LT(b + " yến = " + b * 10 + " kg", b + " yến = " + b * 10 + " kg"), b * 10), st(LT(c + " tấn = " + fmt(c * 1e3) + " kg", c + (c === 1 ? " metric ton = " : " metric tons = ") + fmt(c * 1e3) + " kg"), c * 1e3), st(LT("Cộng lại: " + a * 100 + " + " + b * 10 + " + " + fmt(c * 1e3) + " = " + fmt(T), "Add them up: " + a * 100 + " + " + b * 10 + " + " + fmt(c * 1e3) + " = " + fmt(T)), T)],
     tip: LT("Đổi tất cả về cùng đơn vị ki-lô-gam trước khi cộng.", "Change everything to kilograms before adding.")
    })
   }
  });
  addAsks("mass", [{
   after: 0,
   say: LT("Cùng làm: 1 tạ bằng bao nhiêu yến?", "Let's try: how many yến are in 1 tạ?"),
   opts: ["10", "100", "1"],
   ans: "10",
   good: LT("Đúng! Hơn kém nhau 10 lần.", "Right! Each step is 10 times the next.")
  }, {
   after: 1,
   say: LT("Cùng làm: 1 tấn bằng bao nhiêu ki-lô-gam?", "Let's try: how many kilograms are in 1 metric ton?"),
   opts: ["100", LT("1 000", "1,000"), LT("10 000", "10,000")],
   ans: LT("1 000", "1,000"),
   good: LT("Đúng! 1 tấn = 1 000 kg.", "Right! 1 metric ton = 1,000 kg.")
  }]);
  (function() {
   let l = byId("mass"),
    old = l.gen;
   l.gen = (t, r) => {
    let q = old(t, r);
    return q.diag || q.parts[0].kind !== "num" || (q.diag = DG.mass), q
   }
  })();
  FB.grid100 = function() {
   let base = () => [E.rect("sq", 105, 24, 150, 150, "sun", {
     rx: 0,
     sw: 4
    }), E.text("sd", 180, 200, "1 dm = 10 cm", 18, "ink"), E.text("ss", 95, 105, "1 dm", 18, "ink", {
     anchor: "end"
    })],
    f0 = base(),
    f1 = base();
   for (let i = 1; i < 10; i++) f1.push(E.line("gv" + i, 105 + i * 15, 24, 105 + i * 15, 174, "dark", {
    sw: 1.2
   })), f1.push(E.line("gh" + i, 105, 24 + i * 15, 255, 24 + i * 15, "dark", {
    sw: 1.2
   }));
   let f2 = f1.concat([E.rect("one", 105, 24, 15, 15, "orange", {
    rx: 0,
    sw: 2
   }), E.text("ol", 265, 38, "← 1 cm²", 18, "orange", {
    anchor: "start"
   }), E.text("nt", 180, 228, LT("10 × 10 = 100 ô: 1 dm² = 100 cm²", "10 × 10 = 100 squares: 1 dm² = 100 cm²"), 20, "ink")]);
   return {
    frames: [f0, f1, f2],
    vb: [360, 242]
   }
  };
  LESSON({
   id: "area",
   reg: "hinh",
   title: "dm², m², mm²",
   emoji: "🟩",
   blurb: LT("Đề-xi-mét vuông, mét vuông, mi-li-mét vuông", "Square decimeters, square meters, square millimeters"),
   links: ["mul"],
   rule: {
    h: LT("Bảng đơn vị diện tích", "Area unit table"),
    items: [LT("1 m² là diện tích hình vuông cạnh 1 m; 1 mm² là diện tích hình vuông cạnh 1 mm.", "1 m² is the area of a square with sides of 1 m; 1 mm² is the area of a square with sides of 1 mm."), "1 m² = 100 dm²", "1 dm² = 100 cm²", "1 cm² = 100 mm²", LT("Hai đơn vị liền nhau hơn kém nhau **100 lần** (10 hàng × 10 ô = 100 ô).", "Two neighboring units differ by **100 times** (10 rows × 10 squares = 100 squares).")]
   },
   figs: {
    a: () => FB.grid100(),
    b: () => FB.ladder([{
     n: "m²"
    }, {
     n: "dm²"
    }, {
     n: "cm²"
    }, {
     n: "mm²"
    }], 100, [{}, {
     hi: [0, 1],
     path: [0],
     note: "1 m² = 100 dm²"
    }, {
     hi: [1, 2, 3],
     path: [1, 2],
     note: LT("1 dm² = 100 cm² = 10 000 mm²", "1 dm² = 100 cm² = 10,000 mm²"),
     note2: LT("Sang phải ×100, sang trái :100", "Going right: ×100. Going left: ÷100")
    }], {
     h: 236
    })
   },
   teach: [{
    key: "a",
    f: 0,
    say: LT("Hình vuông cạnh **1 dm** có diện tích **1 đề-xi-mét vuông**, viết là **1 dm²**.", "A square with sides of **1 dm** has an area of **1 square decimeter**, written **1 dm²**.")
   }, {
    key: "a",
    f: 1,
    say: LT("Cạnh 1 dm = 10 cm, nên chia được thành 10 hàng, mỗi hàng 10 ô vuông **1 cm²**.", "The side 1 dm = 10 cm, so the square splits into 10 rows, with 10 squares of **1 cm²** in each row.")
   }, {
    key: "a",
    f: 2,
    say: LT("Cùng làm: 10 hàng × 10 ô là bao nhiêu ô?", "Let's try: how many squares are in 10 rows of 10?"),
    ask: {
     opts: ["20", "100", LT("1 000", "1,000")],
     ans: "100",
     good: LT("Đúng! 1 dm² = 100 cm².", "Right! 1 dm² = 100 cm².")
    }
   }, {
    key: "b",
    f: 0,
    say: LT("Các đơn vị diện tích xếp thành bậc thang: **m², dm², cm², mm²**.", "The units of area make a ladder: **m², dm², cm², mm²**.")
   }, {
    key: "b",
    f: 1,
    say: LT("**Mét vuông** là diện tích hình vuông cạnh **1 m**, viết là **1 m²**. Cạnh 1 m = 10 dm, nên hình vuông đó chia được 10 hàng, mỗi hàng 10 ô vuông 1 dm²: 10 × 10 = 100 ô. Vậy **1 m² = 100 dm²**.", "A **square meter** is the area of a square with sides of **1 m**, written **1 m²**. The side 1 m = 10 dm, so that square splits into 10 rows, with 10 squares of 1 dm² in each row: 10 × 10 = 100 squares. So **1 m² = 100 dm²**.")
   }, {
    key: "b",
    f: 2,
    say: LT("**Mi-li-mét vuông** là diện tích hình vuông cạnh **1 mm**, viết là **1 mm²**. Hình vuông cạnh 1 cm = 10 mm chia được 10 × 10 = 100 ô vuông 1 mm². Vậy **1 cm² = 100 mm²**.", "A **square millimeter** is the area of a square with sides of **1 mm**, written **1 mm²**. A square with sides of 1 cm = 10 mm splits into 10 × 10 = 100 squares of 1 mm². So **1 cm² = 100 mm²**.")
   }, {
    key: "b",
    f: 2,
    say: LT("Mỗi bậc hơn kém nhau **100 lần**, không phải 10 lần như đơn vị độ dài! Đổi sang đơn vị bé hơn thì **nhân 100**, sang đơn vị lớn hơn thì **chia 100**.", "Each step is **100 times** the next, not 10 times like the units of length! To change to a smaller unit, **multiply by 100**. To change to a larger unit, **divide by 100**.")
   }],
   gen(tier, r) {
    let U = ["m²", "dm²", "cm²", "mm²"];
    if (tier === 1) {
     let i = r.int(0, 2),
      a2 = rd(r, 2, 40);
     return r.chance(.6) ? QQ({
      q: a2 + " " + U[i] + " = ? " + U[i + 1],
      parts: [num("", a2 * 100, U[i + 1])],
      steps: [st("1 " + U[i] + " = 100 " + U[i + 1] + " → " + a2 + " × 100 = " + fmt(a2 * 100), a2 * 100)],
      diag: DG.dt100()
     }) : QQ({
      q: fmt(a2 * 100) + " " + U[i + 1] + " = ? " + U[i],
      parts: [num("", a2, U[i])],
      steps: [st(LT("100 " + U[i + 1] + " = 1 " + U[i] + " → " + fmt(a2 * 100) + " : 100 = " + a2, "100 " + U[i + 1] + " = 1 " + U[i] + " → " + fmt(a2 * 100) + " ÷ 100 = " + a2), a2)],
      diag: DG.dt100()
     })
    }
    if (tier === 2) {
     let k = r.int(0, 2),
      i = r.int(0, 2),
      a2 = rd(r, 2, 30),
      b2 = rd(r, 1, 99);
     if (k === 0) return QQ({
      q: a2 + " " + U[i] + " " + b2 + " " + U[i + 1] + " = ? " + U[i + 1],
      parts: [num("", a2 * 100 + b2, U[i + 1])],
      steps: [st(a2 + " " + U[i] + " = " + fmt(a2 * 100) + " " + U[i + 1], a2 * 100), st(fmt(a2 * 100) + " + " + b2 + " = " + fmt(a2 * 100 + b2), a2 * 100 + b2)],
      diag: DG.any(DG.dt100(), (vals, q) => V(vals, 0) === a2 * 10 + b2 ? {
       kind: "dt100",
       msg: LT("1 " + U[i] + " = 100 " + U[i + 1] + ", không phải 10.", "1 " + U[i] + " = 100 " + U[i + 1] + ", not 10.")
      } : null)
     });
     if (k === 1) return QQ({
      q: fmt(a2 * 100 + b2) + " " + U[i + 1] + " = ? " + U[i] + " ? " + U[i + 1],
      parts: [num("", a2, U[i]), num("", b2, U[i + 1])],
      steps: [st(fmt(a2 * 100 + b2) + " " + U[i + 1] + " = " + fmt(a2 * 100) + " " + U[i + 1] + " + " + b2 + " " + U[i + 1], a2 * 100), st(LT("= " + a2 + " " + U[i] + " " + b2 + " " + U[i + 1] + " (vì 100 " + U[i + 1] + " = 1 " + U[i] + ")", "= " + a2 + " " + U[i] + " " + b2 + " " + U[i + 1] + " (because 100 " + U[i + 1] + " = 1 " + U[i] + ")"), a2)]
     });
     let x = rd(r, 3, 9),
      y = rd(r, 2, x - 1);
     return QQ({
      q: LT("Một tấm bìa hình chữ nhật dài **" + x * 10 + " cm**, rộng **" + y * 10 + " cm**. Diện tích tấm bìa bằng bao nhiêu đề-xi-mét vuông?", "A rectangular piece of cardboard is **" + x * 10 + " cm** long and **" + y * 10 + " cm** wide. What is the area of the cardboard in square decimeters?"),
      parts: [num("", x * y, "dm²")],
      steps: [st(LT("Diện tích: " + x * 10 + " × " + y * 10 + " = " + fmt(x * y * 100) + " cm²", "Area: " + x * 10 + " × " + y * 10 + " = " + fmt(x * y * 100) + " cm²"), x * y * 100), st(LT(fmt(x * y * 100) + " cm² = " + fmt(x * y * 100) + " : 100 = " + x * y + " dm²", fmt(x * y * 100) + " cm² = " + fmt(x * y * 100) + " ÷ 100 = " + x * y + " dm²"), x * y)],
      diag: DG.any(DG.step([x * y * 100], LT("Đề hỏi theo đề-xi-mét vuông: đổi cm² ra dm² (chia 100).", "The question asks for square decimeters: change cm² to dm² (divide by 100).")), DG.dt100()),
      tip: "100 cm² = 1 dm²."
     })
    }
    let k = r.int(0, 2);
    if (k === 0) {
     let s = r.pick([2, 4, 5]),
      L = rd(r, 3, 9),
      W = rd(r, 2, L - 1);
     if (L * 10 % s || W * 10 % s) return byId("area").gen(3, r);
     let pL = L * 10 / s,
      pW = W * 10 / s,
      n = pL * pW;
     return QQ({
      q: LT("Nền một căn phòng hình chữ nhật dài **" + L + " m**, rộng **" + W + " m**. Người ta lát kín nền bằng gạch hình vuông cạnh **" + s + " dm**. Hỏi cần bao nhiêu viên gạch? (mạch vữa không đáng kể)", "The floor of a rectangular room is **" + L + " m** long and **" + W + " m** wide. It is completely covered with square tiles with sides of **" + s + " dm**. How many tiles are needed? (Ignore the gaps between the tiles.)"),
      parts: [num("", n, LT("viên", "tiles"))],
      steps: [st(LT("Đổi: " + L + " m = " + L * 10 + " dm; " + W + " m = " + W * 10 + " dm", "Change: " + L + " m = " + L * 10 + " dm; " + W + " m = " + W * 10 + " dm"), L * 10), st(LT("Mỗi hàng theo chiều dài lát được: " + L * 10 + " : " + s + " = " + pL + " viên", "Each row along the length holds: " + L * 10 + " ÷ " + s + " = " + pL + " tiles"), pL), st(LT("Số hàng theo chiều rộng: " + W * 10 + " : " + s + " = " + pW + " hàng", "Number of rows along the width: " + W * 10 + " ÷ " + s + " = " + pW + " rows"), pW), st(LT("Số viên gạch: " + pL + " × " + pW + " = " + fmt(n), "Number of tiles: " + pL + " × " + pW + " = " + fmt(n)), n)],
      diag: DG.any((vals, q) => V(vals, 0) * 100 === n ? {
       kind: "dt100",
       msg: LT("Phải đổi chiều dài, chiều rộng từ mét sang đề-xi-mét (1 m = 10 dm) trước.", "First change the length and width from meters to decimeters (1 m = 10 dm).")
      } : null, DG.step([pL, pW, L * W])),
      tip: LT("Đổi m ra dm, rồi tính mỗi hàng có mấy viên và có mấy hàng.", "Change m to dm, then work out how many tiles are in each row and how many rows there are.")
     })
    }
    if (k === 1) {
     let j = r.int(0, 1),
      a2 = rd(r, 2, 9);
     return QQ({
      q: a2 + " " + U[j] + " = ? " + U[j + 2],
      parts: [num("", a2 * 1e4, U[j + 2])],
      steps: [st(a2 + " " + U[j] + " = " + a2 + " × 100 = " + fmt(a2 * 100) + " " + U[j + 1], a2 * 100), st(fmt(a2 * 100) + " " + U[j + 1] + " = " + fmt(a2 * 100) + " × 100 = " + fmt(a2 * 1e4) + " " + U[j + 2], a2 * 1e4)],
      diag: DG.any(DG.step([a2 * 100], LT("Mới xuống một bậc thôi: phải nhân 100 thêm một lần nữa.", "You only went down one step: multiply by 100 one more time.")), DG.dt100()),
      tip: LT("Xuống hai bậc: nhân 100 rồi nhân 100 nữa (tức là nhân 10 000).", "Going down two steps: multiply by 100, then by 100 again (that is, multiply by 10,000).")
     })
    }
    let a = rd(r, 2, 9),
     b = rd(r, 12, Math.min(60, a * 10 - 1));
    return QQ({
     q: LT("Một tấm bìa hình chữ nhật dài **" + a + " dm**, rộng **" + b + " cm**. Tính diện tích tấm bìa theo xăng-ti-mét vuông.", "A rectangular piece of cardboard is **" + a + " dm** long and **" + b + " cm** wide. Find the area of the cardboard in square centimeters."),
     parts: [num("", a * 10 * b, "cm²")],
     steps: [st(a + " dm = " + a * 10 + " cm", a * 10), st(LT("Diện tích: " + a * 10 + " × " + b + " = " + fmt(a * 10 * b) + " cm²", "Area: " + a * 10 + " × " + b + " = " + fmt(a * 10 * b) + " cm²"), a * 10 * b)],
     diag: DG.step([a * b], LT("Hai cạnh phải cùng đơn vị: đổi " + a + " dm ra cm trước.", "Both sides must use the same unit: change " + a + " dm to cm first.")),
     tip: LT("Đổi dm ra cm (độ dài: × 10).", "Change dm to cm (length: × 10).")
    })
   }
  });
  var ROMAN = n => {
    let m = [
      [1e3, "M"],
      [900, "CM"],
      [500, "D"],
      [400, "CD"],
      [100, "C"],
      [90, "XC"],
      [50, "L"],
      [40, "XL"],
      [10, "X"],
      [9, "IX"],
      [5, "V"],
      [4, "IV"],
      [1, "I"]
     ],
     s = "";
    return m.forEach(x => {
     for (; n >= x[0];) s += x[1], n -= x[0]
    }), s
   },
   centuryOf = y => Math.ceil(y / 100);
  FB.century = function(hl, mark) {
   let X = v => 24 + (v - 1700) * 312 / 400,
    cs = [18, 19, 20, 21],
    mk = (h, mk2) => {
     let els = [E.line("ax", 18, 96, 342, 96, "ink", {
      sw: 4
     })];
     cs.forEach((c, i) => {
      let s = (c - 1) * 100,
       e = c * 100;
      h === c && els.push(E.rect("z", X(s) + 2, 86, X(e) - X(s) - 4, 20, "sun", {
       rx: 4,
       stroke: null
      })), els.push(E.text("r" + c, (X(s) + X(e)) / 2, 72, ROMAN(c), h === c ? 22 : 18, h === c ? "orange" : "dark"))
     });
     for (let v = 1700; v <= 2100; v += 100) els.push(E.line("t" + v, X(v), 84, X(v), 108, "ink", {
      sw: 3
     })), els.push(E.text("y" + v, X(v), 132, String(v), 15, "dark"));
     return mk2 && (els.push(E.circ("m", X(mk2), 96, 9, "orange")), els.push(E.text("mt", X(mk2), 158, String(mk2), 19, "orange"))), els
    };
   return {
    frames: [mk(0, 0), mk(hl, 0), mk(hl, mark)],
    vb: [360, 170]
   }
  };
  var EVENTS = [
   [LT("Ngô Quyền đánh tan quân Nam Hán trên sông Bạch Đằng", "Ngô Quyền defeated the Southern Han army on the Bạch Đằng River"), 938],
   [LT("Lý Thái Tổ dời đô về Thăng Long", "Emperor Lý Thái Tổ moved the capital to Thăng Long"), 1010],
   [LT("Lê Lợi dựng cờ khởi nghĩa Lam Sơn", "Lê Lợi raised the banner of the Lam Sơn uprising"), 1418],
   [LT("vua Quang Trung đại phá quân Thanh", "King Quang Trung crushed the Qing army"), 1789],
   [LT("Bác Hồ ra đời", "President Hồ Chí Minh was born"), 1890],
   [LT("quân dân ta giành chiến thắng Điện Biên Phủ", "Vietnamese forces won the victory at Điện Biên Phủ"), 1954]
  ];
  LESSON({
   id: "time",
   reg: "hinh",
   title: LT("Giây, thế kỉ", "Seconds and centuries"),
   emoji: "⏱️",
   blurb: LT("Đổi phút – giây, năm – thế kỉ", "Changing minutes and seconds, years and centuries"),
   links: ["mul"],
   rule: {
    h: LT("Nhớ nhé", "Remember"),
    items: [LT("1 phút = 60 giây; 1 giờ = 60 phút", "1 minute = 60 seconds; 1 hour = 60 minutes"), LT("Đổi giây ra phút: **chia 60** (120 giây = 2 phút).", "To change seconds to minutes: **divide by 60** (120 seconds = 2 minutes)."), LT("1 thế kỉ = 100 năm", "1 century = 100 years"), LT("Năm 1 – 100 là thế kỉ I; năm 1801 – 1900 là thế kỉ XIX; năm 1901 – 2000 là thế kỉ XX; năm 2001 – 2100 là thế kỉ XXI.", "Years 1–100 are the 1st century (I); years 1801–1900 are the 19th century (XIX); years 1901–2000 are the 20th century (XX); years 2001–2100 are the 21st century (XXI).")]
   },
   figs: {
    a: () => FB.ladder([{
     n: LT("giờ", "hour")
    }, {
     n: LT("phút", "minute")
    }, {
     n: LT("giây", "second")
    }], 60, [{}, {
     hi: [1, 2],
     path: [1],
     note: LT("1 phút = 60 giây", "1 minute = 60 seconds"),
     note2: LT("3 phút = 3 × 60 = 180 giây", "3 minutes = 3 × 60 = 180 seconds")
    }], {
     h: 236
    }),
    b: () => FB.century(19, 1890)
   },
   teach: [{
    key: "a",
    f: 0,
    say: LT("**1 giờ = 60 phút**, **1 phút = 60 giây**. Lần này mỗi bậc hơn kém nhau **60 lần**.", "**1 hour = 60 minutes**, **1 minute = 60 seconds**. This time each step is **60 times** the next.")
   }, {
    key: "a",
    f: 1,
    say: LT("Đổi từ đơn vị lớn sang bé thì **nhân 60**: 3 phút = 3 × 60 = **180 giây**.", "To change from a larger unit to a smaller one, **multiply by 60**: 3 minutes = 3 × 60 = **180 seconds**.")
   }, {
    key: "a",
    f: 1,
    say: LT("Cùng làm: 2 phút bằng bao nhiêu giây?", "Let's try: how many seconds are in 2 minutes?"),
    ask: {
     opts: ["120", "200", "60"],
     ans: "120",
     good: LT("Đúng! 2 × 60 = 120 giây.", "Right! 2 × 60 = 120 seconds.")
    }
   }, {
    key: "a",
    f: 1,
    say: LT("Ngược lại, đổi giây ra phút thì **chia 60**: **120 giây = 2 phút** vì 60 giây = 1 phút (120 : 60 = 2).", "Going the other way, to change seconds to minutes, **divide by 60**: **120 seconds = 2 minutes** because 60 seconds = 1 minute (120 ÷ 60 = 2).")
   }, {
    key: "a",
    f: 1,
    say: LT("Nếu chia còn dư: 475 giây = ? phút ? giây. Nhẩm 7 × 60 = 420 (còn 8 × 60 = 480 lớn hơn 475); 475 − 420 = 55. Vậy 475 giây = **7 phút 55 giây**.", "If there is a remainder: 475 seconds = ? minutes ? seconds. Think: 7 × 60 = 420 (and 8 × 60 = 480 is more than 475); 475 − 420 = 55. So 475 seconds = **7 minutes 55 seconds**.")
   }, {
    key: "b",
    f: 0,
    say: LT("**1 thế kỉ = 100 năm**. Thế kỉ được viết bằng **chữ số La Mã**.", "**1 century = 100 years**. Centuries are written with **Roman numerals**.")
   }, {
    key: "b",
    f: 1,
    say: LT("Từ năm **1801 đến năm 1900** là **thế kỉ XIX** (mười chín).", "The years **1801 to 1900** make up the **19th century (XIX)**.")
   }, {
    key: "b",
    f: 2,
    say: LT("Bác Hồ sinh năm **1890**, thuộc thế kỉ XIX. Mẹo: bỏ hai chữ số cuối (18) rồi **cộng 1** = 19. Năm tròn trăm thì không cộng: 1900 thuộc thế kỉ XIX, 2000 thuộc thế kỉ XX, còn 2001 thuộc thế kỉ XXI.", "President Hồ Chí Minh was born in **1890**, which is in the 19th century (XIX). Trick: drop the last two digits (18), then **add 1** = 19. For a round hundred year, don't add: 1900 is in the 19th century, 2000 is in the 20th century, but 2001 is in the 21st century (XXI).")
   }],
   gen(tier, r) {
    if (tier === 1) {
     let k = r.int(0, 3),
      a2 = rd(r, 2, 12);
     if (k === 0) return QQ({
      q: LT(a2 + " phút = ? giây", a2 + " minutes = ? seconds"),
      parts: [num("", a2 * 60, LT("giây", "seconds"))],
      steps: [st(LT("1 phút = 60 giây → " + a2 + " × 60 = " + a2 * 60, "1 minute = 60 seconds → " + a2 + " × 60 = " + a2 * 60), a2 * 60)],
      diag: DG.step([a2 * 100, a2 * 10], LT("1 phút = 60 giây, nên nhân với 60.", "1 minute = 60 seconds, so multiply by 60."), "he_so_60")
     });
     if (k === 1) return QQ({
      q: LT(a2 + " giờ = ? phút", a2 + " hours = ? minutes"),
      parts: [num("", a2 * 60, LT("phút", "minutes"))],
      steps: [st(LT("1 giờ = 60 phút → " + a2 + " × 60 = " + a2 * 60, "1 hour = 60 minutes → " + a2 + " × 60 = " + a2 * 60), a2 * 60)],
      diag: DG.step([a2 * 100, a2 * 10], LT("1 giờ = 60 phút, nên nhân với 60.", "1 hour = 60 minutes, so multiply by 60."), "he_so_60")
     });
     if (k === 2) return QQ({
      q: LT(a2 * 60 + " giây = ? phút", a2 * 60 + " seconds = ? minutes"),
      parts: [num("", a2, LT("phút", "minutes"))],
      steps: [st(LT("60 giây = 1 phút → " + a2 * 60 + " : 60 = " + a2, "60 seconds = 1 minute → " + a2 * 60 + " ÷ 60 = " + a2), a2)],
      diag: DG.step([a2 * 6, a2 * 600], LT("60 giây = 1 phút, nên chia cho 60.", "60 seconds = 1 minute, so divide by 60."), "he_so_60")
     });
     let c = rd(r, 2, 9);
     return QQ({
      q: LT(c + " thế kỉ = ? năm", c + " centuries = ? years"),
      parts: [num("", c * 100, LT("năm", "years"))],
      steps: [st(LT("1 thế kỉ = 100 năm → " + c + " × 100 = " + c * 100, "1 century = 100 years → " + c + " × 100 = " + c * 100), c * 100)]
     })
    }
    let NOW = 2026,
     yearQ = (y, ctx, extra) => {
      let c = centuryOf(y),
       opts = r.shuffle([ROMAN(c), ROMAN(c - 1), ROMAN(c + 1)]);
      return QQ({
       q: LT((ctx ? "Năm " + y + ", " + ctx + ". " : "") + "Năm **" + y + "** thuộc thế kỉ nào?" + (extra ? extra.q : ""), (ctx ? "In the year " + y + ", " + ctx + ". " : "") + "Which century does the year **" + y + "** belong to?" + (extra ? extra.q : "")),
       parts: [chp(opts, ROMAN(c), extra ? LT("Thế kỉ", "Century") : "")].concat(extra ? [extra.p] : []),
       steps: [st(LT("Bỏ hai chữ số cuối: " + Math.floor(y / 100) + (y % 100 ? ", cộng 1 = " + c : " (năm tròn trăm, không cộng)") + " → thế kỉ " + ROMAN(c), "Drop the last two digits: " + Math.floor(y / 100) + (y % 100 ? ", add 1 = " + c : " (a round hundred year, so don't add)") + " → century " + ROMAN(c)))].concat(extra ? extra.s : []),
       diag: y % 100 === 0 ? DG.theKi(0, [ROMAN(c + 1)], LT("Năm tròn trăm thì không cộng 1: năm " + y + " thuộc thế kỉ " + ROMAN(c) + ".", "For a round hundred year, don't add 1: the year " + y + " is in century " + ROMAN(c) + ".")) : DG.theKi(0, [ROMAN(c - 1)]),
       hintFig: y >= 1701 && y <= 2100 ? {
        fb: FB.century(c, y),
        f: 2
       } : void 0
      })
     };
    if (tier === 2) {
     let k = r.int(0, 2);
     if (k === 0) {
      let a2 = rd(r, 1, 9),
       b2 = rd(r, 5, 55);
      return QQ({
       q: LT(a2 + " phút " + b2 + " giây = ? giây", a2 + (a2 === 1 ? " minute " : " minutes ") + b2 + " seconds = ? seconds"),
       parts: [num("", a2 * 60 + b2, LT("giây", "seconds"))],
       steps: [st(LT(a2 + " phút = " + a2 * 60 + " giây", a2 + (a2 === 1 ? " minute = " : " minutes = ") + a2 * 60 + " seconds"), a2 * 60), st(a2 * 60 + " + " + b2 + " = " + (a2 * 60 + b2), a2 * 60 + b2)],
       diag: DG.any(DG.step([a2 * 100 + b2, a2 * 100, a2 * 10 + b2], LT("1 phút = 60 giây: đổi phút ra giây rồi cộng thêm số giây.", "1 minute = 60 seconds: change the minutes to seconds, then add the extra seconds."), "he_so_60"), DG.step([a2 * 60], LT("1 phút = 60 giây: đổi phút ra giây rồi cộng thêm số giây.", "1 minute = 60 seconds: change the minutes to seconds, then add the extra seconds.")))
      })
     }
     if (k === 1) {
      let a2 = rd(r, 1, 9),
       b2 = rd(r, 1, 59),
       N = a2 * 60 + b2;
      return QQ({
       q: LT(N + " giây = ? phút ? giây", N + " seconds = ? minutes ? seconds"),
       parts: [num("", a2, LT("phút", a2 === 1 ? "minute" : "minutes")), num("", b2, LT("giây", b2 === 1 ? "second" : "seconds"))],
       steps: [st(LT("Nhẩm: " + a2 + " × 60 = " + a2 * 60 + " (còn " + (a2 + 1) + " × 60 = " + (a2 + 1) * 60 + " lớn hơn " + N + ")", "Think: " + a2 + " × 60 = " + a2 * 60 + " (and " + (a2 + 1) + " × 60 = " + (a2 + 1) * 60 + " is more than " + N + ")"), a2 * 60), st(N + " − " + a2 * 60 + " = " + b2, b2), st(LT("Viết: " + a2 + " phút " + b2 + " giây", "Write: " + a2 + (a2 === 1 ? " minute " : " minutes ") + b2 + (b2 === 1 ? " second" : " seconds")), a2)]
      })
     }
     let kind = r.int(0, 3),
      y = kind === 0 ? rd(r, 101, 999) : kind === 1 ? rd(r, 1001, NOW) : kind === 2 ? 100 * rd(r, 10, 20) : 100 * rd(r, 10, 20) + 1;
     return yearQ(y)
    }
    let kt = r.f();
    if (kt >= .7) {
     let a = rd(r, 2, 4),
      b = rd(r, 12, 55),
      t = rd(r, 3, 5),
      one = a * 60 + b,
      tot = one * t;
     return QQ({
      q: LT("Một bản nhạc dài **" + a + " phút " + b + " giây**. Bạn Nam nghe liên tục **" + t + " lần** bản nhạc đó. Hỏi Nam nghe tất cả bao nhiêu giây?", "A song lasts **" + a + " minutes " + b + " seconds**. Nam listens to the song **" + t + " times** in a row. How many seconds does Nam listen in all?"),
      parts: [num("", tot, LT("giây", "seconds"))],
      steps: [st(LT(a + " phút " + b + " giây = " + a * 60 + " + " + b + " = " + one + " giây", a + " minutes " + b + " seconds = " + a * 60 + " + " + b + " = " + one + " seconds"), one), st(LT("Nghe " + t + " lần: " + one + " × " + t + " = " + fmt(tot) + " giây", "Listening " + t + " times: " + one + " × " + t + " = " + fmt(tot) + " seconds"), tot)],
      diag: DG.any(DG.step([one], LT("Đó mới là thời gian nghe một lần. Đề hỏi nghe " + t + " lần.", "That is only one listen. The question asks for " + t + " times.")), DG.step([a * 100 + b, a * 100 + b * t], LT("1 phút = 60 giây: đổi ra giây trước rồi mới nhân.", "1 minute = 60 seconds: change to seconds first, then multiply."), "he_so_60")),
      tip: LT("Đổi một lần nghe ra giây, rồi nhân với số lần.", "Change one listen to seconds, then multiply by the number of times.")
     })
    }
    if (kt < .4) {
     let ev = r.pick(EVENTS);
     return yearQ(ev[1], ev[0], {
      q: LT(" Từ năm **" + ev[1] + "** đến năm **" + NOW + "** là bao nhiêu năm?", " How many years is it from the year **" + ev[1] + "** to the year **" + NOW + "**?"),
      p: num(LT("Số năm", "Number of years"), NOW - ev[1], LT("năm", "years")),
      s: [st(NOW + " − " + ev[1] + " = " + fmt(NOW - ev[1]), NOW - ev[1])]
     })
    }
    let nA = r.pick(NAMES),
     nB = r.pick(NAMES.filter(x => x !== nA)),
     a = rd(r, 1, 2),
     b = rd(r, 5, 55),
     tA = a * 60 + b,
     tB = tA + r.pick([-1, 1]) * rd(r, 3, 25),
     win = tA < tB ? nA : nB;
    return QQ({
     q: LT("Trong cuộc thi chạy 400 m, " + nA + " chạy hết **" + a + " phút " + b + " giây**, " + nB + " chạy hết **" + tB + " giây**. Ai chạy **nhanh hơn**, và nhanh hơn bao nhiêu giây?", "In a 400 m race, " + nA + " ran it in **" + a + (a === 1 ? " minute " : " minutes ") + b + " seconds**, and " + nB + " ran it in **" + tB + " seconds**. Who ran **faster**, and by how many seconds?"),
     parts: [chp([nA, nB], win, LT("Nhanh hơn", "Faster")), num(LT("Hơn", "Faster by"), Math.abs(tA - tB), LT("giây", "seconds"))],
     steps: [st(LT(a + " phút " + b + " giây = " + a * 60 + " + " + b + " = " + tA + " giây", a + (a === 1 ? " minute " : " minutes ") + b + " seconds = " + a * 60 + " + " + b + " = " + tA + " seconds"), tA), st(LT("So sánh " + tA + " và " + tB + ": ai chạy hết ít thời gian hơn thì nhanh hơn → " + win, "Compare " + tA + " and " + tB + ": whoever takes less time is faster → " + win)), st(LT("Hơn: " + Math.max(tA, tB) + " − " + Math.min(tA, tB) + " = " + Math.abs(tA - tB) + " giây", "Faster by: " + Math.max(tA, tB) + " − " + Math.min(tA, tB) + " = " + Math.abs(tA - tB) + " seconds"), Math.abs(tA - tB))],
     tip: LT("Đổi ra cùng đơn vị giây. Chạy ít thời gian hơn là nhanh hơn.", "Change both to seconds. Taking less time means being faster.")
    })
   }
  });
  LESSON({
   id: "chart",
   reg: "hinh",
   title: LT("Biểu đồ cột", "Bar charts"),
   emoji: "📊",
   blurb: LT("Đọc số liệu và so sánh", "Reading data and comparing"),
   links: ["avg", "addsub"],
   rule: {
    h: LT("Cách đọc", "How to read it"),
    items: [LT("Đọc **tên biểu đồ** để biết biểu đồ nói về điều gì.", "Read the **title of the chart** to see what it is about."), LT("**Trục ngang** ghi tên các cột; **trục dọc** ghi số liệu.", "The **horizontal axis** names the bars; the **vertical axis** shows the data."), LT("Nhìn **đỉnh cột**, dóng sang trục dọc để biết giá trị.", "Look at the **top of a bar** and follow across to the vertical axis to find its value."), LT("So sánh: cột cao hơn thì nhiều hơn; trừ hai giá trị để biết hơn bao nhiêu. Tổng: cộng tất cả các cột.", "Comparing: a taller bar means more; subtract the two values to find how many more. Total: add up all the bars."), LT("Trung bình cộng: tổng các cột : số cột.", "Average (mean): the total of all the bars ÷ the number of bars.")]
   },
   figs: {
    a: () => {
     let f = FB.chart([LT("Thứ Hai", "Mon"), LT("Thứ Ba", "Tue"), LT("Thứ Tư", "Wed"), LT("Thứ Năm", "Thu")], [20, 35, 15, 30], {
       step: 5,
       unit: LT("Số trang", "Number of pages"),
       hl: [
        [1]
       ]
      }),
      ttl = () => E.text("ttl", 180, 248, LT("Số trang sách Mai đọc trong bốn ngày", "Number of pages Mai read in four days"), 17, "ink"),
      base = f.frames[0],
      fx = base.concat([E.line("hx", 44, 190, 348, 190, "orange", {
       sw: 7
      })]),
      fy = base.concat([E.line("hy", 44, 40, 44, 190, "orange", {
       sw: 7
      })]),
      fr = [base, fx, fy].concat(f.frames.slice(1));
     return {
      frames: fr.map(els => els.concat([ttl()])),
      vb: [360, 262]
     }
    }
   },
   teach: [{
    key: "a",
    f: 0,
    say: LT("Đây là **biểu đồ cột**. Trước hết đọc **tên biểu đồ** (dòng chữ dưới hình): **Số trang sách Mai đọc trong bốn ngày**.", "This is a **bar chart**. First, read the **title of the chart** (the words below the picture): **Number of pages Mai read in four days**.")
   }, {
    key: "a",
    f: 1,
    say: LT("**Trục ngang** ghi tên các ngày: Thứ Hai, Thứ Ba, Thứ Tư, Thứ Năm. Mỗi cột ứng với một ngày.", "The **horizontal axis** shows the days: Mon, Tue, Wed, Thu (Monday to Thursday). Each bar matches one day.")
   }, {
    key: "a",
    f: 2,
    say: LT("**Trục dọc** ghi số trang: 0, 5, 10, 15, … (mỗi vạch hơn nhau 5 trang). **Chiều cao cột** cho biết số trang đọc được.", "The **vertical axis** shows the number of pages: 0, 5, 10, 15, … (each mark is 5 pages more than the one before). The **height of a bar** tells how many pages were read.")
   }, {
    key: "a",
    f: 3,
    say: LT("Cột của ngày Thứ Ba (cột cam) cao tới vạch **35**. Vậy Thứ Ba Mai đọc 35 trang.", "The bar for Tuesday (the orange bar) reaches the mark **35**. So Mai read 35 pages on Tuesday.")
   }, {
    key: "a",
    f: 4,
    say: LT("Các giá trị: 20, 35, 15, 30. Cột cao nhất là Thứ Ba, thấp nhất là Thứ Tư. Tổng = 100 trang. Trung bình mỗi ngày: 100 : 4 = **25 trang**.", "The values: 20, 35, 15, 30. The tallest bar is Tuesday and the shortest is Wednesday. Total = 100 pages. Average per day: 100 ÷ 4 = **25 pages**.")
   }],
   gen(tier, r) {
    let labs = ["4A", "4B", "4C", "4D", "4E"].slice(0, tier === 1 ? 4 : 5),
     n = labs.length,
     vals = r.shuffle([2, 3, 4, 5, 6, 7, 8, 9]).slice(0, n).map(x => 5 * x),
     i = rd(r, 0, n - 1),
     ctx = LT("Biểu đồ cho biết số cây các lớp khối Bốn trồng được. ", "The chart shows how many trees each fourth-grade class planted. "),
     mkF = v => {
      let fb = FB.chart(labs, v, {
       step: 5,
       unit: LT("Số cây", "Number of trees")
      });
      return {
       fb,
       f: 0
      }
     },
     fg = mkF(vals),
     S = vals.reduce((a, b) => a + b, 0),
     mx = Math.max.apply(null, vals),
     mn = Math.min.apply(null, vals),
     L = v => labs[vals.indexOf(v)];
    if (tier === 1) {
     if (r.chance(.35)) {
      let most = r.chance(.5),
       ans = LT("Lớp " + L(most ? mx : mn), "Class " + L(most ? mx : mn));
      return QQ({
       q: LT(ctx + "Lớp nào trồng được **" + (most ? "nhiều" : "ít") + " cây nhất**?", ctx + "Which class planted the **" + (most ? "most" : "fewest") + " trees**?"),
       fig: fg,
       parts: [chp(labs.map(x => LT("Lớp " + x, "Class " + x)), ans)],
       steps: [st(LT("Cột " + (most ? "cao" : "thấp") + " nhất là cột của lớp " + L(most ? mx : mn) + " (" + (most ? mx : mn) + " cây) → " + ans, "The " + (most ? "tallest" : "shortest") + " bar is the bar for class " + L(most ? mx : mn) + " (" + (most ? mx : mn) + " trees) → " + ans))],
       tip: LT("Cột càng cao thì số cây càng nhiều.", "The taller the bar, the more trees.")
      })
     }
     return QQ({
      q: LT(ctx + "Lớp **" + labs[i] + "** trồng được bao nhiêu cây?", ctx + "How many trees did class **" + labs[i] + "** plant?"),
      fig: fg,
      parts: [num("", vals[i], LT("cây", "trees"))],
      steps: [st(LT("Nhìn đỉnh cột của lớp " + labs[i] + ", dóng sang trục dọc: " + vals[i], "Look at the top of the bar for class " + labs[i] + " and follow across to the vertical axis: " + vals[i]), vals[i])],
      tip: LT("Dóng từ đỉnh cột sang trục dọc.", "Follow across from the top of the bar to the vertical axis.")
     })
    }
    if (tier === 2) {
     let k = r.int(0, 2);
     if (k === 0) return QQ({
      q: LT(ctx + "Cả " + n + " lớp trồng được tất cả bao nhiêu cây?", ctx + "How many trees did all " + n + " classes plant altogether?"),
      fig: fg,
      parts: [num("", S, LT("cây", "trees"))],
      steps: [st(LT("Cộng các cột: " + vals.join(" + ") + " = " + S, "Add the bars: " + vals.join(" + ") + " = " + S), S)]
     });
     if (k === 1) {
      let j = rd(r, 0, n - 2);
      j >= i && j++;
      let big = vals[i] > vals[j] ? i : j,
       sm = big === i ? j : i,
       d = vals[big] - vals[sm];
      return QQ({
       q: LT(ctx + "Lớp " + labs[i] + " và lớp " + labs[j] + ", lớp nào trồng được nhiều cây hơn và nhiều hơn bao nhiêu cây?", ctx + "Class " + labs[i] + " and class " + labs[j] + ": which class planted more trees, and how many more?"),
       fig: fg,
       parts: [chp([LT("Lớp " + labs[i], "Class " + labs[i]), LT("Lớp " + labs[j], "Class " + labs[j])], LT("Lớp " + labs[big], "Class " + labs[big]), LT("Nhiều hơn", "Which has more")), num(LT("Hơn", "How many more"), d, LT("cây", "trees"))],
       steps: [st(LT("Lớp " + labs[i] + ": " + vals[i] + " cây; lớp " + labs[j] + ": " + vals[j] + " cây", "Class " + labs[i] + ": " + vals[i] + " trees; class " + labs[j] + ": " + vals[j] + " trees")), st(LT("Cột của lớp " + labs[big] + " cao hơn → lớp " + labs[big], "The bar for class " + labs[big] + " is taller → class " + labs[big])), st(vals[big] + " − " + vals[sm] + " = " + d, d)]
      })
     }
     let ord = labs.slice().sort((a, b) => vals[labs.indexOf(b)] - vals[labs.indexOf(a)]),
      three = r.shuffle([0, 1, 2, 3, 4]).slice(0, 3).sort((a, b) => a - b).map(x => ord[x]),
      right = three.join(", "),
      w1 = three.slice().reverse().join(", "),
      w2 = [three[1], three[0], three[2]].join(", "),
      w3 = [three[0], three[2], three[1]].join(", ");
     return QQ({
      q: LT(ctx + "Xếp các lớp " + labs.filter(x => three.indexOf(x) >= 0).join(", ") + " theo thứ tự số cây **từ nhiều đến ít**.", ctx + "Arrange classes " + labs.filter(x => three.indexOf(x) >= 0).join(", ") + " by the number of trees, **from most to fewest**."),
      fig: fg,
      parts: [chp(r.shuffle([right, w1, w2, w3]), right)],
      steps: [st(three.map(x => x + ": " + vals[labs.indexOf(x)]).join("; ")), st(LT("Từ nhiều đến ít: " + right, "From most to fewest: " + right))],
      tip: LT("Cột cao nhất đứng đầu, cột thấp nhất đứng cuối.", "The tallest bar comes first and the shortest bar comes last.")
     })
    }
    if (S % n === 0 && r.chance(.6)) return QQ({
     q: LT(ctx + "Trung bình mỗi lớp trồng được bao nhiêu cây?", ctx + "On average, how many trees did each class plant?"),
     fig: fg,
     parts: [num("", S / n, LT("cây", "trees"))],
     steps: [st(LT("Tổng: " + vals.join(" + ") + " = " + S, "Total: " + vals.join(" + ") + " = " + S), S), st(LT(S + " : " + n + " = " + S / n, S + " ÷ " + n + " = " + S / n), S / n)]
    });
    if (r.chance(.5)) return QQ({
     q: LT(ctx + "Lớp trồng nhiều nhất hơn lớp trồng ít nhất bao nhiêu cây?", ctx + "How many more trees did the class that planted the most plant than the class that planted the fewest?"),
     fig: fg,
     parts: [num("", mx - mn, LT("cây", "trees"))],
     steps: [st(LT("Nhiều nhất: lớp " + L(mx) + " (" + mx + " cây); ít nhất: lớp " + L(mn) + " (" + mn + " cây)", "Most: class " + L(mx) + " (" + mx + " trees); fewest: class " + L(mn) + " (" + mn + " trees)"), null), st(mx + " − " + mn + " = " + (mx - mn), mx - mn)]
    });
    let goal = Math.ceil((S + 1) / 50) * 50,
     need = goal - S;
    return QQ({
     q: ctx + LT("Khối Bốn đặt mục tiêu trồng **" + goal + " cây**. Cả khối còn phải trồng thêm bao nhiêu cây nữa?", "Grade 4 sets a goal of planting **" + goal + " trees**. How many more trees does the whole grade still need to plant?"),
     fig: fg,
     parts: [num("", need, LT("cây", "trees"))],
     steps: [st(LT("Đã trồng: " + vals.join(" + ") + " = " + S, "Planted so far: " + vals.join(" + ") + " = " + S), S), st(LT("Còn thiếu: " + goal + " − " + S + " = " + need, "Still needed: " + goal + " − " + S + " = " + need), need)],
     diag: DG.step([S], LT("Đó là số cây đã trồng. Lấy mục tiêu trừ đi số đó.", "That is the number of trees already planted. Subtract it from the goal."))
    })
   }
  });
  addAsks("chart", [{
   after: 2,
   say: LT("Cùng làm: cột của ngày Thứ Tư (cột thấp nhất) cao tới vạch nào?", "Let's work it out: how high does the Wednesday bar (the shortest bar) go?"),
   opts: ["10", "15", "20"],
   ans: "15",
   good: LT("Đúng! Cột của ngày Thứ Tư cao tới vạch 15: Thứ Tư Mai đọc 15 trang.", "Correct! The Wednesday bar goes up to 15: on Wednesday, Mai read 15 pages.")
  }]);
(function() {
 /* ================= Hình vẽ riêng cho 3 bài: protract, datalist, freq ================= */
 var rad = d => d * Math.PI / 180;
 var BALL = {
  "đỏ": "#E5484D",
  "vàng": "#FFD23F",
  "xanh": "#4DA3FF",
  "tím": "#A78BFA"
 };
 var BALLK = {
  "đỏ": LT("Đ", "R"),
  "vàng": LT("V", "Y"),
  "xanh": LT("X", "B"),
  "tím": LT("T", "P")
 };

 /* Thước đo góc: frames[i] = {prot, rot, sh, rays:[{p,n,c,dash}], vname, arc:[p1,p2], hl:{center,zero,rd:[pos,'o'|'i'],scale}, note, note2} ; p = góc (độ) tính từ tia nằm ngang bên phải, ngược chiều kim đồng hồ */
 FB.proto = function(frames, o) {
  o = o || {};
  var cx = 180,
   cy = 192,
   R = 148,
   RL = 158,
   H = o.h || (o.notes ? 272 : 228);
  var P = (c, pos, r) => [c[0] + r * Math.cos(rad(pos)), c[1] - r * Math.sin(rad(pos))];
  var f2 = n => Math.round(n * 10) / 10;
  var build = function(f) {
   var els = [],
    pc = [cx + (f.sh ? f.sh[0] : 0), cy + (f.sh ? f.sh[1] : 0)],
    rot = f.rot || 0,
    hl = f.hl || {};
   if (f.prot) {
    var op = f.prot === "ghost" ? .35 : .92,
     a = P(pc, rot + 180, R),
     b = P(pc, rot, R);
    els.push(E.path("half", "M" + f2(a[0]) + " " + f2(a[1]) + " A" + R + " " + R + " 0 0 1 " + f2(b[0]) + " " + f2(b[1]) + " Z", "#EAF4FF", "ink", {
     sw: 2.5,
     op: op
    }));
    var i1 = P(pc, rot + 180, 40),
     i2 = P(pc, rot, 40);
    els.push(E.path("inner", "M" + f2(i1[0]) + " " + f2(i1[1]) + " A40 40 0 0 1 " + f2(i2[0]) + " " + f2(i2[1]), "none", "#9AA5BD", {
     sw: 1.5,
     op: op
    }));
    if (hl.scale) {
     var rr = hl.scale === "o" ? R - 22 : R - 42,
      s1 = P(pc, rot, rr),
      s2 = P(pc, rot + 180, rr);
     els.push(E.path("band", "M" + f2(s1[0]) + " " + f2(s1[1]) + " A" + rr + " " + rr + " 0 0 0 " + f2(s2[0]) + " " + f2(s2[1]), "none", "yellow", {
      sw: 20,
      op: .75
     }));
    }
    for (var d = 0; d <= 180; d += 5) {
     var big = d % 10 === 0,
      t1 = P(pc, rot + d, R),
      t2 = P(pc, rot + d, R - (big ? 12 : 7));
     els.push(E.line("t" + d, t1[0], t1[1], t2[0], t2[1], "ink", {
      sw: big ? 2 : 1.2,
      op: op
     }));
     if (big) {
      var lo = P(pc, rot + d, R - 23),
       li = P(pc, rot + d, R - 43);
      var dy = d === 0 || d === 180 ? -3 : 4;
      els.push(E.text("lo" + d, lo[0], lo[1] + dy, String(d), 12, "ink", {
       op: op
      }));
      els.push(E.text("li" + d, li[0], li[1] + (d === 0 || d === 180 ? -5 : 4), String(180 - d), 11, "#7C3AED", {
       op: op
      }));
     }
    }
    els.push(E.line("dia", a[0], a[1], b[0], b[1], "ink", {
     sw: 1.5,
     op: op
    }));
    els.push(E.circ("pcc", pc[0], pc[1], 4, "ink", {
     op: op
    }));
    if (hl.zero != null) {
     var z1 = P(pc, hl.zero + rot, R + 12);
     els.push(E.line("hz", pc[0], pc[1], z1[0], z1[1], "yellow", {
      sw: 14,
      op: .75
     }));
    }
   }
   (f.rays || []).forEach(function(ry, i) {
    var e = P([cx, cy], ry.p, RL),
     lb = P([cx, cy], ry.p, RL + 13);
    els.push(E.line("ry" + i, cx, cy, e[0], e[1], ry.c || (i === 0 ? "blue" : "orange"), {
     sw: 5,
     dash: ry.dash ? "8 6" : null
    }));
    els.push(E.text("rn" + i, lb[0], lb[1] + 7, ry.n || "", 19, "ink"));
   });
   if (f.arc) {
    var q1 = P([cx, cy], f.arc[0], 56),
     q2 = P([cx, cy], f.arc[1], 56);
    els.push(E.path("arc", "M" + f2(q1[0]) + " " + f2(q1[1]) + " A56 56 0 0 " + (f.arc[1] > f.arc[0] ? 0 : 1) + " " + f2(q2[0]) + " " + f2(q2[1]), "none", "pink", {
     sw: 5
    }));
   }
   els.push(E.circ("vx", cx, cy, 5.5, "red"));
   els.push(E.text("vn", cx, cy + 24, f.vname || "O", 19, "ink"));
   if (hl.center) els.push(E.circ("hlc", cx, cy, 15, "none", {
    stroke: "red",
    sw: 4
   }));
   if (hl.rd) {
    var rp = P(pc, hl.rd[0] + rot, hl.rd[1] === "o" ? R - 23 : R - 43);
    els.push(E.circ("hlr", rp[0], rp[1], 12, "none", {
     stroke: "red",
     sw: 3.5
    }));
   }
   if (f.note) els.push(E.text("note", 180, cy + 46, f.note, 19, "ink"));
   if (f.note2) els.push(E.text("note2", 180, cy + 68, f.note2, 16, "dark"));
   return els;
  };
  return {
   frames: frames.map(build),
   vb: [360, H]
  };
 };

 /* Bảng kiểm đếm: frames[i] = {rows:[{lab,n,c,t}], note} */
 FB.tally = function(frames, o) {
  o = o || {};
  var nr = Math.max.apply(null, frames.map(f => f.rows.length)),
   top = 30,
   rh = 40,
   hasNote = frames.some(f => f.note),
   H = top + nr * rh + 10 + (hasNote ? 34 : 0),
   lx = 106,
   gw = 32,
   gap = 6;
  return {
   frames: frames.map(function(f) {
    var els = [];
    els.push(E.rect("tb", 6, 4, 348, top - 4 + f.rows.length * rh, "white", {
     rx: 8,
     sw: 2.5
    }));
    els.push(E.text("h1", 56, 24, o.h1 || LT("Sự kiện", "Event"), 15, "dark"));
    els.push(E.text("h2", lx + 120, 24, LT("Kiểm đếm", "Tally"), 15, "dark"));
    els.push(E.line("hl", 6, top, 354, top, "ink", {
     sw: 2
    }));
    els.push(E.line("vl", lx - 4, 4, lx - 4, top + f.rows.length * rh, "ink", {
     sw: 2
    }));
    f.rows.forEach(function(r, i) {
     var y = top + i * rh;
     if (i > 0) els.push(E.line("sp" + i, 6, y, 354, y, "gray", {
      sw: 2
     }));
     els.push(E.text("rl" + i, 56, y + rh / 2 + 6, r.lab, 16, r.hi ? "red" : "ink"));
     var x = lx,
      left = r.n,
      g = 0,
      col = r.c || "ink";
     while (left > 0) {
      var m = Math.min(5, left),
       y1 = y + 8,
       y2 = y + rh - 8,
       k = Math.min(m, 4);
      for (var j = 0; j < k; j++) els.push(E.line("r" + i + "g" + g + "s" + j, x + 3 + j * 8.5, y1, x + 3 + j * 8.5, y2, col, {
       sw: 3
      }));
      if (m === 5) els.push(E.line("r" + i + "g" + g + "d", x - 1, y2 - 3, x + gw + 1, y1 + 3, col, {
       sw: 3
      }));
      x += gw + gap;
      g++;
      left -= m;
     }
     if (r.t != null) els.push(E.text("rt" + i, Math.min(x + 8, 330), y + rh / 2 + 7, "= " + r.t, 18, "red", {
      anchor: "start"
     }));
    });
    if (f.note) els.push(E.text("note", 180, top + f.rows.length * rh + 28, f.note, 18, "ink"));
    return els;
   }),
   vb: [360, H]
  };
 };

 /* Dãy số liệu: frames[i] = {vals, names, hi:{idx:màu}, idx(bool), note, fills:[màu theo ô]} */
 FB.dseq = function(frames, o) {
  o = o || {};
  var hasNames = frames.some(f => f.names),
   hasIdx = frames.some(f => f.idx),
   hasNote = frames.some(f => f.note),
   n = Math.max.apply(null, frames.map(f => f.vals.length)),
   per = n <= 8 ? n : Math.ceil(n / 2),
   nrow = Math.ceil(n / per),
   bw = Math.min(42, Math.floor(330 / per) - 4),
   bh = 40,
   rowH = bh + (hasNames ? 20 : 0) + (hasIdx ? 18 : 0) + 12,
   H = 10 + nrow * rowH + (hasNote ? 34 : 4);
  return {
   frames: frames.map(function(f) {
    var els = [],
     np = Math.min(per, f.vals.length),
     tw = per * (bw + 4) - 4,
     x0 = (360 - tw) / 2;
    f.vals.forEach(function(v, i) {
     var rw = Math.floor(i / per),
      cI = i % per,
      x = x0 + cI * (bw + 4),
      y = 10 + rw * rowH + (hasNames ? 20 : 0),
      fill = (f.hi && f.hi[i]) || (f.fills && f.fills[i]) || "white";
     if (f.names) els.push(E.text("nm" + i, x + bw / 2, y - 6, f.names[i], 15, "dark"));
     els.push(E.rect("c" + i, x, y, bw, bh, fill, {
      rx: 8,
      sw: 2.5
     }));
     els.push(E.text("v" + i, x + bw / 2, y + bh / 2 + 8, String(v), String(v).length > 2 ? 17 : 23, "ink"));
     if (f.idx) els.push(E.text("ix" + i, x + bw / 2, y + bh + 15, String(i + 1), 14, "dark"));
    });
    if (f.note) els.push(E.text("note", 180, H - 12, f.note, 18, "ink"));
    return els;
   }),
   vb: [360, H]
  };
 };

 /* Hộp bóng / tấm bìa quay số: spec {box:[{c,n}]} hoặc {spin:[{t,c}]} */
 FB.event = function(frames, o) {
  o = o || {};
  var H = o.h || 200;
  return {
   frames: frames.map(function(f) {
    var els = [];
    if (f.box) {
     var balls = [];
     f.box.forEach(b => {
      for (var i = 0; i < b.n; i++) balls.push(b.c);
     });
     var per = Math.min(8, Math.max(4, Math.ceil(balls.length / 2))),
      nrow = Math.ceil(balls.length / per),
      bwid = per * 36 + 24,
      bx = (360 - bwid) / 2,
      by = 34,
      bhh = nrow * 36 + 26;
     els.push(E.rect("bx", bx, by, bwid, bhh, "peach", {
      rx: 12,
      sw: 3
     }));
     els.push(E.text("bt", 180, 24, LT("Hộp bóng", "Ball box"), 16, "dark"));
     balls.forEach(function(c, i) {
      var rw = Math.floor(i / per),
       cI = i % per,
       inRow = Math.min(per, balls.length - rw * per),
       sx = (360 - inRow * 36) / 2;
      els.push(E.circ("bl" + i, sx + cI * 36 + 18, by + 30 + rw * 36, 14, BALL[c], {
       sw: 2.5
      }));
     });
    } else if (f.spin) {
     var k = f.spin.length,
      cx = 180,
      cy = 102,
      r = 78;
     f.spin.forEach(function(s, i) {
      var a0 = -90 + i * 360 / k,
       a1 = a0 + 360 / k,
       p0 = [cx + r * Math.cos(rad(a0)), cy + r * Math.sin(rad(a0))],
       p1 = [cx + r * Math.cos(rad(a1)), cy + r * Math.sin(rad(a1))],
       am = rad((a0 + a1) / 2);
      if (k === 1) els.push(E.circ("sc" + i, cx, cy, r, s.c || "sun", {
       sw: 3
      }));
      else els.push(E.path("sc" + i, "M" + cx + " " + cy + " L" + p0[0].toFixed(1) + " " + p0[1].toFixed(1) + " A" + r + " " + r + " 0 " + (360 / k > 180 ? 1 : 0) + " 1 " + p1[0].toFixed(1) + " " + p1[1].toFixed(1) + " Z", s.c || "sun", "ink", {
       sw: 3
      }));
      els.push(E.text("st" + i, cx + r * .6 * Math.cos(am), cy + r * .6 * Math.sin(am) + 9, String(s.t), 26, "ink"));
     });
     els.push(E.poly("ptr", "180,12 170,0 190,0", "red", {
      sw: 1.5
     }));
     els.push(E.circ("hub", cx, cy, 6, "ink"));
    }
    if (f.note) els.push(E.text("note", 180, H - 10, f.note, 18, "ink"));
    return els;
   }),
   vb: [360, H]
  };
 };

 var pickNames = (r, k) => r.shuffle(["An", "Bình", "Lan", "Hà", "Minh", "Nam", "Mai", "Hùng", "Linh", "Khoa", "Vy", "Tú", "Dũng", "Hoa"]).slice(0, k);
 var kind = t => t === 90 ? LT("Góc vuông", "Right angle") : t === 180 ? LT("Góc bẹt", "Straight angle") : t < 90 ? LT("Góc nhọn", "Acute angle") : LT("Góc tù", "Obtuse angle");
 var KINDS = [LT("Góc nhọn", "Acute angle"), LT("Góc vuông", "Right angle"), LT("Góc tù", "Obtuse angle"), LT("Góc bẹt", "Straight angle")];
 var RN = [
  ["A", "B"],
  ["M", "N"],
  ["P", "Q"],
  ["D", "E"],
  ["X", "Y"],
  ["H", "K"]
 ];

 /* ============================ BÀI 1: protract ============================ */
 var PF = (rays, extra) => ({
  fb: FB.proto([Object.assign({
   prot: 1,
   rays
  }, extra || {})], {}),
  f: 0
 });
 var posOf = (base, th) => base === "R" ? th : 180 - th;
 LESSON({
  id: "protract",
  reg: "hinh",
  title: LT("Đo góc bằng thước đo góc", "Measuring angles with a protractor"),
  short: LT("Đo góc", "Measure angles"),
  emoji: "📏",
  blurb: LT("Đặt thước, đọc số đo góc", "Place the protractor and read the angle"),
  links: ["angle"],
  rule: {
   h: LT("Nhớ nhé", "Remember"),
   items: [LT("Đặt **tâm thước** trùng **đỉnh góc**; một cạnh của góc nằm trên **vạch 0** của thước.", "Place the **center of the protractor** on the **vertex** of the angle; one side of the angle lies along the **0 mark** of the protractor."), LT("Cạnh còn lại đi qua vạch nào thì số ở vạch đó là **số đo góc** (đơn vị **độ**, kí hiệu **°**).", "The number where the other side crosses the scale is the **measure of the angle** (the unit is the **degree**, written **°**)."), LT("Thước có **hai hàng số**: đọc hàng số có **vạch 0 nằm trên cạnh** đã đặt.", "The protractor has **two rows of numbers**: read the row whose **0 mark lies on the side** you placed."), LT("Nhìn số đo để biết loại góc: bé hơn 90° là **nhọn**, bằng 90° là **vuông**, giữa 90° và 180° là **tù**, bằng 180° là **bẹt**.", "Use the measure to tell the type of angle: less than 90° is **acute**, exactly 90° is **right**, between 90° and 180° is **obtuse**, and exactly 180° is **straight**.")]
  },
  figs: {
   p: () => FB.proto([{
    rays: [{
     p: 0,
     n: "A"
    }, {
     p: 50,
     n: "B"
    }],
    arc: [0, 50],
    note: LT("Góc đỉnh O, cạnh OA và OB", "Angle with vertex O and sides OA and OB"),
    note2: LT("Gọi là góc AOB", "It is called angle AOB")
   }, {
    prot: 1,
    rays: [{
     p: 0,
     n: "A"
    }, {
     p: 50,
     n: "B"
    }],
    hl: {
     center: 1
    },
    note: LT("Tâm thước trùng đỉnh O", "Protractor center on vertex O")
   }, {
    prot: 1,
    rays: [{
     p: 0,
     n: "A"
    }, {
     p: 50,
     n: "B"
    }],
    hl: {
     center: 1,
     zero: 0
    },
    note: LT("Cạnh OA nằm trên vạch 0", "Side OA is on the 0 mark")
   }, {
    prot: 1,
    rays: [{
     p: 0,
     n: "A"
    }, {
     p: 50,
     n: "B"
    }],
    hl: {
     scale: "o",
     rd: [50, "o"]
    },
    note: LT("OB đi qua vạch 50: góc AOB = 50°", "OB crosses the 50 mark: angle AOB = 50°")
   }], {
    notes: 1
   }),
   q: () => FB.proto([{
    prot: 1,
    rays: [{
     p: 180,
     n: "A"
    }, {
     p: 120,
     n: "B"
    }],
    hl: {
     center: 1,
     zero: 180
    },
    note: LT("OA bên trái: vạch 0 ở bên trái", "OA is on the left: the 0 mark is on the left")
   }, {
    prot: 1,
    rays: [{
     p: 180,
     n: "A"
    }, {
     p: 120,
     n: "B"
    }],
    hl: {
     scale: "i",
     rd: [120, "i"]
    },
    note: LT("Đọc hàng số tím", "Read the purple row"),
    note2: LT("Vạch 0 nằm trên cạnh OA", "The 0 mark is on side OA")
   }], {
    notes: 1
   }),
   a: () => ({
    angle: !0,
    start: 20
   })
  },
  teach: [{
   key: "p",
   f: 0,
   say: LT("Góc **AOB** có **đỉnh O**, hai cạnh **OA** và **OB**. Muốn biết góc mở rộng bao nhiêu **độ**, ta dùng **thước đo góc**.", "Angle **AOB** has **vertex O** and two sides, **OA** and **OB**. To find how wide the angle opens in **degrees**, we use a **protractor**.")
  }, {
   key: "p",
   f: 1,
   say: LT("Bước 1: đặt thước sao cho **tâm thước** (điểm giữa cạnh thẳng của thước) **trùng với đỉnh O** của góc.", "Step 1: Place the protractor so its **center** (the middle of its straight edge) is **right on vertex O** of the angle.")
  }, {
   key: "p",
   f: 2,
   say: LT("Bước 2: xoay thước cho **một cạnh của góc (OA) nằm đúng trên vạch 0** của thước.", "Step 2: Turn the protractor so **one side of the angle (OA) lies exactly on the 0 mark**.")
  }, {
   key: "p",
   f: 3,
   say: LT("Bước 3: nhìn cạnh còn lại **OB** đi qua vạch nào. Ở đây OB đi qua vạch **50**, nên góc AOB là **50°**. Con hãy so sánh 50° với 90° nhé!", "Step 3: See which mark the other side, **OB**, crosses. Here OB crosses the **50** mark, so angle AOB is **50°**. Now compare 50° with 90°!"),
   ask: { q: LT("Góc 50° là góc gì?", "What kind of angle is 50°?"),
    opts: [LT("Góc nhọn", "Acute angle"), LT("Góc vuông", "Right angle"), LT("Góc tù", "Obtuse angle")],
    ans: LT("Góc nhọn", "Acute angle"),
    good: LT("Đúng! 50° bé hơn 90° nên là góc nhọn.", "Correct! 50° is less than 90°, so it is an acute angle.")
   }
  }, {
   key: "q",
   f: 0,
   say: LT("Thước có **hai hàng số**. Bây giờ cạnh **OA nằm bên trái**, nên vạch **0 ở bên trái**. Ta phải đọc hàng số có **0 ở bên trái** (hàng số màu tím).", "The protractor has **two rows of numbers**. Now side **OA is on the left**, so the **0 mark is on the left**. We must read the row with **0 on the left** (the purple row).")
  }, {
   key: "q",
   f: 1,
   say: LT("Nhìn hình: vạch **0** nằm trên cạnh **OA**, nên ta đọc **hàng số tím**. Đọc nhầm sang hàng số kia sẽ ra kết quả sai. Nhớ: vạch **0 ở cạnh nào** thì đọc hàng số bắt đầu từ 0 ở cạnh đó.", "Look at the picture: the **0** mark is on side **OA**, so we read the **purple row**. Reading the other row gives a wrong answer. Remember: read the row whose **0 is on the side** you lined up."),
   ask: { q: LT("Cạnh OB đi qua vạch nào? Góc AOB bằng bao nhiêu độ?", "Which mark does OB cross? How many degrees is angle AOB?"),
    opts: ["60°", "120°"],
    ans: "60°",
    good: LT("Đúng! Đọc hàng số có vạch 0 nằm trên OA.", "Correct! Read the row whose 0 mark is on OA.")
   }
  }, {
   key: "a",
   theta: 20,
   say: LT("Muốn **vẽ góc có số đo cho trước**, ta làm ngược lại: vẽ cạnh OA nằm trên vạch 0, rồi đánh dấu ở vạch cần vẽ và nối với O. Con thử **kéo chấm vàng** ở đầu cạnh cam tới đúng **60°** nhé!", "To **draw an angle with a given measure**, we do the opposite: draw side OA on the 0 mark, then make a dot at the mark you need and connect it to O. Try **dragging the yellow dot** at the end of the orange side to exactly **60°**!"),
   free: !0
  }, {
   key: "a",
   theta: 60,
   say: LT("Đây là góc **60°**: góc nhọn. Cạnh cam đi qua vạch **60**. Con có thể kéo chấm vàng để thử các góc khác: 90° (vuông), 135° (tù), 180° (bẹt).", "This is a **60°** angle: an acute angle. The orange side crosses the **60** mark. You can drag the yellow dot to try other angles: 90° (right), 135° (obtuse), 180° (straight)."),
   free: !0
  }],
  gen(tier, r) {
   var nm = r.pick(RN);
   var A = nm[0],
    B = nm[1];
   var rd2 = (th, b) => PF([{
    p: b === "R" ? 0 : 180,
    n: A
   }, {
    p: posOf(b, th),
    n: B
   }]);
   var step0 = b => LT("Vạch 0 của thước nằm trên cạnh O" + A + (b === "R" ? " ở bên phải, nên đọc hàng số ngoài (số đen)" : " ở bên trái, nên đọc hàng số trong (số tím)"), "The protractor's 0 mark is on side O" + A + (b === "R" ? " (on the right), so read the outer row (black numbers)" : " (on the left), so read the inner row (purple numbers)"));
   if (tier === 1) {
    var k = r.f();
    if (k < .45) {
     var th = 10 * rd(r, 1, 17);
     return QQ({
      q: LT("Thước đo góc được đặt như hình (vạch 0 trùng cạnh O" + A + "). Số đo góc **" + A + "O" + B + "** là bao nhiêu độ?", "The protractor is placed as shown (the 0 mark is on side O" + A + "). What is the measure of angle **" + A + "O" + B + "** in degrees?"),
      fig: rd2(th, "R"),
      parts: [num("", th, "°")],
      steps: [st(LT("Cạnh OA nằm ở bên phải trên vạch 0, đọc hàng số đen từ 0", "Side OA is on the right on the 0 mark, so read the black row starting from 0")), st(LT("Cạnh O" + B + " đi qua vạch " + th + " → góc " + A + "O" + B + " = " + th + "°", "Side O" + B + " crosses the " + th + " mark → angle " + A + "O" + B + " = " + th + "°"), th)],
      tip: LT("Nhìn cạnh O" + B + " đi qua vạch số nào trên thước.", "Look at which mark side O" + B + " crosses on the protractor.")
     });
    }
    if (k < .8) {
     var th2 = r.pick([20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160]),
      cl = kind(th2);
     return QQ({
      q: LT("Đo góc **" + A + "O" + B + "** trên hình (vạch 0 trùng cạnh O" + A + "). Cho biết số đo và loại góc.", "Measure angle **" + A + "O" + B + "** in the figure (the 0 mark is on side O" + A + "). Give the measure and the type of angle."),
      fig: rd2(th2, "R"),
      parts: [num(LT("Số đo", "Measure"), th2, "°"), chp([LT("Góc nhọn", "Acute angle"), LT("Góc vuông", "Right angle"), LT("Góc tù", "Obtuse angle")], cl, LT("Loại góc", "Type of angle"))],
      steps: [st(LT("Cạnh O" + B + " đi qua vạch " + th2 + ", nên góc là " + th2 + "°", "Side O" + B + " crosses the " + th2 + " mark, so the angle is " + th2 + "°"), th2), st(LT("So với 90°: " + th2 + "° → " + cl.toLowerCase(), "Compared with 90°: " + th2 + "° → " + cl.toLowerCase()))],
      tip: LT("Bé hơn 90° là nhọn; bằng 90° là vuông; lớn hơn 90° là tù.", "Less than 90° is acute; exactly 90° is right; more than 90° is obtuse.")
     });
    }
    var cs = [
     [LT("Để đo góc " + A + "O" + B + ", **tâm thước** phải đặt trùng với điểm nào?", "To measure angle " + A + "O" + B + ", which point must the **center of the protractor** be placed on?"), [LT("Đỉnh O của góc", "Vertex O of the angle"), LT("Điểm " + A, "Point " + A), LT("Điểm " + B, "Point " + B)], LT("Đỉnh O của góc", "Vertex O of the angle"), LT("Tâm thước trùng với đỉnh của góc.", "The center of the protractor goes on the vertex of the angle.")],
     [LT("Khi đo góc " + A + "O" + B + ", **vạch 0** của thước phải nằm trên đâu?", "When measuring angle " + A + "O" + B + ", where must the **0 mark** of the protractor be?"), [LT("Một cạnh của góc (O" + A + " hoặc O" + B + ")", "One side of the angle (O" + A + " or O" + B + ")"), LT("Đỉnh O", "Vertex O"), LT("Bên ngoài góc", "Outside the angle")], LT("Một cạnh của góc (O" + A + " hoặc O" + B + ")", "One side of the angle (O" + A + " or O" + B + ")"), LT("Một cạnh của góc phải nằm trên vạch 0.", "One side of the angle must lie on the 0 mark.")],
     [LT("Đơn vị đo góc là gì?", "What is the unit for measuring angles?"), [LT("độ (°)", "degree (°)"), LT("xăng-ti-mét (cm)", "centimeter (cm)"), LT("ki-lô-gam (kg)", "kilogram (kg)")], LT("độ (°)", "degree (°)"), LT("Đo góc bằng thước đo góc, đơn vị là độ.", "Angles are measured with a protractor, and the unit is the degree.")]
    ];
    var c = r.pick(cs);
    return QQ({
     q: c[0],
     parts: [chp(c[1], c[2])],
     steps: [st(c[3])],
     tip: c[3]
    });
   }
   if (tier === 2) {
    var k2 = r.f();
    if (k2 < .25) {
     var t5 = 5 * rd(r, 2, 34);
     return QQ({
      q: LT("Thước đo góc được đặt như hình, vạch 0 trùng cạnh O" + A + ". Số đo góc **" + A + "O" + B + "** là bao nhiêu độ?", "The protractor is placed as shown, with the 0 mark on side O" + A + ". What is the measure of angle **" + A + "O" + B + "** in degrees?"),
      fig: rd2(t5, "R"),
      parts: [num("", t5, "°")],
      steps: [st(step0("R")), st(LT("Cạnh O" + B + " đi qua vạch " + t5 + " → góc " + A + "O" + B + " = " + t5 + "°", "Side O" + B + " crosses the " + t5 + " mark → angle " + A + "O" + B + " = " + t5 + "°"), t5)],
      tip: LT("Mỗi vạch nhỏ là 5°, đếm từ vạch lớn gần nhất.", "Each small mark is 5°. Count from the nearest big mark.")
     });
    }
    if (k2 < .5) {
     var tl = 5 * rd(r, 2, 34);
     return QQ({
      q: LT("Thước đo góc được đặt như hình: cạnh O" + A + " nằm bên trái và trùng vạch 0. Số đo góc **" + A + "O" + B + "** là bao nhiêu độ?", "The protractor is placed as shown: side O" + A + " is on the left and lines up with the 0 mark. What is the measure of angle **" + A + "O" + B + "** in degrees?"),
      fig: rd2(tl, "L"),
      parts: [num("", tl, "°")],
      steps: [st(step0("L")), st(LT("Cạnh O" + B + " đi qua vạch " + tl + " của hàng số tím → góc = " + tl + "°", "Side O" + B + " crosses the " + tl + " mark on the purple row → angle = " + tl + "°"), tl)],
      tip: LT("Chú ý: cạnh O" + A + " ở bên trái nên đọc hàng số có vạch 0 ở bên trái, tránh đọc nhầm hàng kia.", "Careful: side O" + A + " is on the left, so read the row with its 0 mark on the left, and do not read the other row by mistake.")
     });
    }
    if (k2 < .68) {
     var th3 = 5 * rd(r, 3, 33),
      b3 = r.chance(.4) ? "L" : "R",
      mode = r.pick(["c", "z", "ok"]),
      ex = {};
     if (mode === "c") ex.sh = [r.pick([-1, 1]) * rd(r, 22, 30), 0];
     if (mode === "z") ex.rot = r.pick([-1, 1]) * rd(r, 12, 22);
     var right = mode === "c" ? LT("Tâm thước chưa trùng đỉnh O", "The protractor's center is not on vertex O") : mode === "z" ? LT("Vạch 0 chưa nằm trên cạnh O" + A, "The 0 mark is not on side O" + A) : LT("Thước đặt đúng", "The protractor is placed correctly");
     var why = mode === "c" ? LT("Tâm thước (chấm đen) lệch khỏi đỉnh O (chấm đỏ)", "The protractor's center (black dot) is away from vertex O (red dot)") : mode === "z" ? LT("Cạnh O" + A + " không nằm trên vạch 0 của thước", "Side O" + A + " is not on the protractor's 0 mark") : LT("Tâm thước trùng đỉnh O và cạnh O" + A + " nằm trên vạch 0", "The protractor's center is on vertex O and side O" + A + " is on the 0 mark");
     return QQ({
      q: LT("Bạn Nam đặt thước đo góc như hình để đo góc **" + A + "O" + B + "**. Cách đặt thước thế nào?", "Nam places the protractor as shown to measure angle **" + A + "O" + B + "**. How is the protractor placed?"),
      fig: PF([{
       p: b3 === "R" ? 0 : 180,
       n: A
      }, {
       p: posOf(b3, th3),
       n: B
      }], ex),
      parts: [chp(r.shuffle([LT("Tâm thước chưa trùng đỉnh O", "The protractor's center is not on vertex O"), LT("Vạch 0 chưa nằm trên cạnh O" + A, "The 0 mark is not on side O" + A), LT("Thước đặt đúng", "The protractor is placed correctly")]), right)],
      steps: [st(LT("Xem chấm đen (tâm thước) có trùng chấm đỏ (đỉnh O) không, và cạnh O" + A + " có nằm trên vạch 0 không", "Check whether the black dot (protractor center) is on the red dot (vertex O), and whether side O" + A + " is on the 0 mark")), st(why + " → " + right)],
      tip: LT("Kiểm tra hai điều: tâm thước trùng đỉnh góc; một cạnh góc nằm trên vạch 0.", "Check two things: the center is on the vertex of the angle, and one side of the angle is on the 0 mark.")
     });
    }
    if (k2 < .8) {
     var te = r.pick([30, 45, 60, 90, 120, 135, 150]),
      ph = rd(r, 0, 180 - te),
      pool = [20, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165].filter(x => Math.abs(x - te) >= 30);
     var wrongs = r.shuffle(pool).slice(0, 3),
      ops = r.shuffle([te].concat(wrongs)).map(x => x + "°");
     return QQ({
      q: LT("**Ước lượng** (nhìn bằng mắt, chưa dùng thước): góc " + A + "O" + B + " trên hình gần bằng số đo nào?", "**Estimate** (by eye, without a protractor): which measure is angle " + A + "O" + B + " in the figure closest to?"),
      fig: {
       fb: FB.proto([{
        rays: [{
         p: ph,
         n: A
        }, {
         p: ph + te,
         n: B
        }]
       }], {}),
       f: 0
      },
      parts: [chp(ops, te + "°")],
      steps: [st(LT("So sánh với góc vuông 90° và góc bẹt 180°", "Compare with a right angle (90°) and a straight angle (180°)")), st(LT("Góc " + A + "O" + B + " là " + te + "° (" + kind(te).toLowerCase() + ")", "Angle " + A + "O" + B + " is " + te + "° (" + kind(te).toLowerCase() + ")"))],
      tip: LT("Góc vuông là 90°. Góc bé hơn góc vuông thì nhỏ hơn 90°, rộng hơn thì lớn hơn 90°.", "A right angle is 90°. An angle smaller than a right angle is less than 90°, and a wider one is more than 90°.")
     });
    }
    if (k2 < .9) {
     var isTu = r.chance(.5),
      good = isTu ? rd(r, 91, 175) : rd(r, 10, 89),
      bads = [];
     var cand = isTu ? [rd(r, 10, 89), rd(r, 10, 89), 90, 180, rd(r, 10, 89), rd(r, 10, 89)] : [90, 180, rd(r, 91, 175), rd(r, 91, 175), rd(r, 91, 175)];
     r.shuffle(cand).forEach(x => {
      if (bads.length < 3 && x !== good && bads.indexOf(x) < 0) bads.push(x);
     });
     if (bads.length < 3) return byId("protract").gen(tier, r);
     return QQ({
      q: LT("Số đo nào dưới đây có thể là số đo của một góc **" + (isTu ? "tù" : "nhọn") + "**?", "Which of these measures could be the measure of an **" + (isTu ? "obtuse" : "acute") + "** angle?"),
      parts: [chp(r.shuffle([good].concat(bads)).map(x => x + "°"), good + "°")],
      steps: [st((isTu ? LT("Góc tù: lớn hơn 90° và bé hơn 180°", "Obtuse angle: more than 90° and less than 180°") : LT("Góc nhọn: bé hơn 90°", "Acute angle: less than 90°")) + " → " + good + "°")],
      tip: isTu ? LT("Góc tù lớn hơn 90° nhưng bé hơn 180°.", "An obtuse angle is more than 90° but less than 180°.") : LT("Góc nhọn bé hơn 90°.", "An acute angle is less than 90°.")
     });
    }
    var thd = 5 * rd(r, 4, 32),
     bd = r.pick(["R", "L"]),
     p0 = posOf(bd, thd),
     dec = bd === "R" ? 180 - thd : thd;
    var oth = [];
    for (var tryi = 0; tryi < 40 && oth.length < 1; tryi++) {
     var cand2 = 5 * rd(r, 2, 34);
     var pp = posOf(bd, cand2);
     if (Math.abs(cand2 - thd) >= 20 && Math.abs(pp - dec) >= 20 && Math.abs(pp - p0) >= 20 && cand2 !== thd) oth.push(pp);
    }
    if (Math.abs(dec - p0) < 20 || !oth.length) return byId("protract").gen(tier, r);
    var rayPos = r.shuffle([p0, dec, oth[0]]),
     lets = ["M", "N", "P"],
     rays = [{
      p: bd === "R" ? 0 : 180,
      n: "A"
     }].concat(rayPos.map((p, i) => ({
      p,
      n: lets[i],
      c: "orange"
     })));
    return QQ({
     q: LT("Vẽ góc **" + thd + "°** có đỉnh O, cạnh O" + "A" + " (vạch 0 của thước trùng OA). Ba bạn vẽ cạnh còn lại là tia **OM, ON, OP** như hình. Bạn nào vẽ **đúng**?", "Draw an angle of **" + thd + "°** with vertex O and side OA (the 0 mark of the protractor is on OA). Three students drew the other side as rays **OM, ON, OP** as shown. Who drew it **correctly**?"),
     fig: {
      fb: FB.proto([{
       prot: 1,
       rays
      }], {}),
      f: 0
     },
     parts: [chp(["OM", "ON", "OP"], "O" + lets[rayPos.indexOf(p0)])],
     steps: [st(LT("Cạnh OA nằm " + (bd === "R" ? "bên phải" : "bên trái") + " trên vạch 0, nên đọc hàng số " + (bd === "R" ? "đen" : "tím") + " bắt đầu từ 0 ở OA", "Side OA is on the " + (bd === "R" ? "right" : "left") + " on the 0 mark, so read the " + (bd === "R" ? "black" : "purple") + " row that starts at 0 on OA")), st(LT("Tia đi qua vạch " + thd + " của hàng số đó là tia O" + lets[rayPos.indexOf(p0)], "The ray that crosses the " + thd + " mark on that row is ray O" + lets[rayPos.indexOf(p0)]))],
     tip: LT("Tìm vạch " + thd + " trên đúng hàng số (có vạch 0 nằm trên OA), tia nào đi qua vạch đó là tia đúng.", "Find the " + thd + " mark on the correct row (the one whose 0 mark is on OA). The ray crossing that mark is the right one.")
    });
   }
   // tier 3
   var k3 = r.f(),
    bs = r.pick(["R", "L"]);
   if (k3 < .4) {
    var b = 5 * rd(r, 2, 16),
     c = b + 5 * rd(r, 3, 12);
    if (c > 170) c = 170;
    var ps = bs === "R" ? [0, b, c] : [180, 180 - b, 180 - c];
    return QQ({
     q: LT("Thước đo góc đặt như hình, vạch 0 trùng cạnh OA. Đọc số đo góc **AOB** và góc **AOC**, rồi tính số đo góc **BOC**.", "The protractor is placed as shown, with the 0 mark on side OA. Read the measures of angle **AOB** and angle **AOC**, then find the measure of angle **BOC**."),
     fig: PF([{
      p: ps[0],
      n: "A"
     }, {
      p: ps[1],
      n: "B"
     }, {
      p: ps[2],
      n: "C",
      c: "green"
     }]),
     parts: [num(LT("Góc AOB", "Angle AOB"), b, "°"), num(LT("Góc AOC", "Angle AOC"), c, "°"), num(LT("Góc BOC", "Angle BOC"), c - b, "°")],
     steps: [st(LT("Đọc hàng số có vạch 0 nằm trên OA: OB qua vạch " + b + ", OC qua vạch " + c, "Read the row whose 0 mark is on OA: OB crosses the " + b + " mark and OC crosses the " + c + " mark")), st(LT("Góc BOC = góc AOC − góc AOB = " + c + " − " + b + " = " + (c - b), "Angle BOC = angle AOC − angle AOB = " + c + " − " + b + " = " + (c - b)), c - b)],
     tip: LT("Góc BOC là phần của góc AOC sau khi bỏ góc AOB.", "Angle BOC is the part of angle AOC left after removing angle AOB.")
    });
   }
   if (k3 < .7) {
    var pb = 5 * rd(r, 3, 33);
    return QQ({
     q: LT("A, O, C thẳng hàng (góc **AOC** là góc bẹt). Đọc số đo góc **AOB** trên hình rồi tính số đo góc **BOC**.", "A, O, and C are in a straight line (angle **AOC** is a straight angle). Read the measure of angle **AOB** in the figure, then find the measure of angle **BOC**."),
     fig: PF([{
      p: 0,
      n: "A"
     }, {
      p: pb,
      n: "B"
     }, {
      p: 180,
      n: "C",
      c: "blue"
     }]),
     parts: [num(LT("Góc AOB", "Angle AOB"), pb, "°"), num(LT("Góc BOC", "Angle BOC"), 180 - pb, "°")],
     steps: [st(LT("Cạnh OA trên vạch 0, OB đi qua vạch " + pb + " nên góc AOB = " + pb + "°", "Side OA is on the 0 mark and OB crosses the " + pb + " mark, so angle AOB = " + pb + "°"), pb), st(LT("Góc bẹt = 180° nên góc BOC = 180 − " + pb + " = " + (180 - pb), "A straight angle is 180°, so angle BOC = 180 − " + pb + " = " + (180 - pb)), 180 - pb)],
     tip: LT("Góc bẹt AOC bằng 180°, gồm hai góc AOB và BOC.", "Straight angle AOC is 180°. It is made of angles AOB and BOC.")
    });
   }
   var m = 5 * rd(r, 1, 17);
   return QQ({
    q: LT("⭐ Thử thách: Tia OM chia góc **AOB** thành hai góc bằng nhau (chưa vẽ tia OM). Đọc số đo góc AOB trên hình, rồi tính số đo góc **AOM**.", "⭐ Challenge: Ray OM divides angle **AOB** into two equal angles (ray OM is not drawn). Read the measure of angle AOB in the figure, then find the measure of angle **AOM**."),
    fig: PF([{
     p: bs === "R" ? 0 : 180,
     n: "A"
    }, {
     p: posOf(bs, 2 * m),
     n: "B"
    }]),
    parts: [num(LT("Góc AOB", "Angle AOB"), 2 * m, "°"), num(LT("Góc AOM", "Angle AOM"), m, "°")],
    steps: [st(LT("Đọc hàng số có vạch 0 trên OA: góc AOB = " + 2 * m + "°", "Read the row whose 0 mark is on OA: angle AOB = " + 2 * m + "°"), 2 * m), st(LT("Góc AOM = " + 2 * m + " : 2 = " + m + "°", "Angle AOM = " + 2 * m + " ÷ 2 = " + m + "°"), m)],
    tip: LT("Chia đôi số đo góc AOB.", "Cut the measure of angle AOB in half.")
   });
  }
 });

 /* ============================ BÀI 2: datalist ============================ */
 var DCTX = [{
  seq: LT("Số cuốn sách mỗi bạn trong tổ đã đọc được ghi lại thành dãy số liệu", "The number of books each student in the group has read is recorded as a data sequence"),
  tab: LT("Bảng số liệu cho biết số cuốn sách mỗi bạn đã đọc", "The table shows the number of books each student has read"),
  unit: LT("cuốn sách", "books"),
  u1: LT("cuốn sách", "book"),
  verb: LT("đọc được", "read"),
  lo: 3,
  hi: 12,
  more: LT("đọc nhiều hơn", "read more")
 }, {
  seq: LT("Số ngôi sao giấy mỗi bạn trong tổ gấp được ghi lại thành dãy số liệu", "The number of paper stars each student in the group has folded is recorded as a data sequence"),
  tab: LT("Bảng số liệu cho biết số ngôi sao giấy mỗi bạn gấp được", "The table shows the number of paper stars each student has folded"),
  unit: LT("ngôi sao", "paper stars"),
  u1: LT("ngôi sao", "paper star"),
  verb: LT("gấp được", "folded"),
  lo: 4,
  hi: 15,
  more: LT("gấp nhiều hơn", "folded more")
 }, {
  seq: LT("Số điểm mười mỗi bạn trong tổ đạt được ghi lại thành dãy số liệu", "The number of perfect scores (10s) each student in the group has earned is recorded as a data sequence"),
  tab: LT("Bảng số liệu cho biết số điểm mười mỗi bạn đạt được", "The table shows the number of perfect scores (10s) each student has earned"),
  unit: LT("điểm mười", "perfect scores"),
  u1: LT("điểm mười", "perfect score"),
  verb: LT("đạt được", "earned"),
  lo: 2,
  hi: 10,
  more: LT("đạt nhiều hơn", "earned more")
 }, {
  seq: LT("Số bức tranh mỗi bạn trong tổ vẽ được ghi lại thành dãy số liệu", "The number of pictures each student in the group has drawn is recorded as a data sequence"),
  tab: LT("Bảng số liệu cho biết số bức tranh mỗi bạn vẽ được", "The table shows the number of pictures each student has drawn"),
  unit: LT("bức tranh", "pictures"),
  u1: LT("bức tranh", "picture"),
  verb: LT("vẽ được", "drawn"),
  lo: 2,
  hi: 9,
  more: LT("vẽ nhiều hơn", "drawn more")
 }];
 var cntOf = v => {
  var c = {};
  v.forEach(x => c[x] = (c[x] || 0) + 1);
  return c;
 };
 var maxOf = a => Math.max.apply(null, a),
  minOf = a => Math.min.apply(null, a),
  sumOf = a => a.reduce((x, y) => x + y, 0);
 var asc = v => v.slice().sort((a, b) => a - b);

 function genVals(r, n, lo, hi, o) {
  o = o || {};
  for (var g = 0; g < 300; g++) {
   var v = [];
   for (var i = 0; i < n; i++) v.push(r.int(lo, hi));
   var c = cntOf(v),
    cs = Object.keys(c).map(k => c[k]),
    mx = maxOf(v),
    mn = minOf(v);
   if (mx === mn) continue;
   if (o.dup && !cs.some(x => x >= 2)) continue;
   if (o.um && (c[mx] > 1 || c[mn] > 1)) continue;
   if (o.maxc && maxOf(cs) > o.maxc) continue;
   return v;
  }
  var w = [];
  for (var j = 0; j < n; j++) w.push(lo + j);
  return w;
 }
 var DF = (vals, names, hi, o) => ({
  fb: FB.dseq([Object.assign({
   vals,
   names,
   hi: hi || {}
  }, o || {})], {}),
  f: 0
 });

 LESSON({
  id: "datalist",
  reg: "hinh",
  title: LT("Dãy số liệu thống kê", "Statistical data sequences"),
  short: LT("Dãy số liệu", "Data sequence"),
  emoji: "🔢",
  blurb: LT("Đọc, sắp xếp và so sánh số liệu", "Read, sort, and compare data"),
  links: ["chart"],
  rule: {
   h: LT("Nhớ nhé", "Remember"),
   items: [LT("Các số thu thập được xếp thành một **dãy số liệu**. Mỗi số là một **số liệu**.", "The numbers we collect are lined up as a **data sequence**. Each number is a **data value**."), LT("Đếm xem có **bao nhiêu số liệu** trong dãy; một số có thể xuất hiện **nhiều lần**.", "Count **how many data values** are in the sequence; a number can appear **more than once**."), LT("So sánh để tìm số **lớn nhất** và số **bé nhất**.", "Compare to find the **greatest** and the **least** number."), LT("**Sắp xếp từ bé đến lớn**: số bé đứng trước, số lớn đứng sau.", "**Sort from least to greatest**: small numbers come first, big numbers come after."), LT("**Hiệu** = số lớn nhất − số bé nhất. **Tổng** = cộng tất cả các số liệu.", "**Difference** = greatest number − least number. **Sum** = add up all the data values.")]
  },
  figs: {
   d: () => FB.dseq([{
    vals: [5, 8, 6, 5, 9, 7],
    names: ["An", "Bình", "Lan", "Hà", "Minh", "Nam"],
    note: LT("Số cuốn sách mỗi bạn đọc", "Number of books each student read")
   }, {
    vals: [5, 8, 6, 5, 9, 7],
    idx: 1,
    note: LT("Dãy số liệu: 5; 8; 6; 5; 9; 7", "Data sequence: 5; 8; 6; 5; 9; 7")
   }, {
    vals: [5, 8, 6, 5, 9, 7],
    idx: 1,
    hi: {
     4: "orange",
     0: "sky",
     3: "sky"
    },
    note: LT("Lớn nhất: 9 · Bé nhất: 5", "Greatest: 9 · Least: 5")
   }, {
    vals: [5, 5, 6, 7, 8, 9],
    idx: 1,
    hi: {
     0: "sky",
     1: "sky"
    },
    note: LT("Từ bé đến lớn: 5; 5; 6; 7; 8; 9", "Least to greatest: 5; 5; 6; 7; 8; 9")
   }, {
    vals: [5, 5, 6, 7, 8, 9],
    hi: {
     0: "sky",
     5: "orange"
    },
    note: LT("9 − 5 = 4  ·  Tổng = 40", "9 − 5 = 4  ·  Sum = 40")
   }], {})
  },
  teach: [{
   key: "d",
   f: 0,
   say: LT("Cô giáo hỏi 6 bạn trong tổ xem mỗi bạn đã đọc mấy cuốn sách và ghi vào **bảng số liệu**: An 5, Bình 8, Lan 6, Hà 5, Minh 9, Nam 7.", "The teacher asked 6 students in the group how many books each had read and wrote the answers in a **table**: An 5, Bình 8, Lan 6, Hà 5, Minh 9, Nam 7.")
  }, {
   key: "d",
   f: 1,
   say: LT("Viết các số ra thành một hàng, ta có **dãy số liệu**: **5; 8; 6; 5; 9; 7**. Mỗi số là một **số liệu**. Đếm: dãy này có **6 số liệu**.", "Writing the numbers in a row gives a **data sequence**: **5; 8; 6; 5; 9; 7**. Each number is a **data value**. Count: this sequence has **6 data values**.")
  }, {
   key: "d",
   f: 1,
   say: LT("Muốn tìm số **lớn nhất**, ta so sánh tất cả các số trong dãy. Con thử tìm nhé!", "To find the **greatest** number, we compare all the numbers in the sequence. Give it a try!"),
   ask: { q: LT("Số lớn nhất trong dãy 5; 8; 6; 5; 9; 7 là số nào?", "What is the greatest number in the sequence 5; 8; 6; 5; 9; 7?"),
    opts: ["5", "9", "8"],
    ans: "9",
    good: LT("Đúng! 9 là số lớn nhất.", "Correct! 9 is the greatest number.")
   }
  }, {
   key: "d",
   f: 2,
   say: LT("Số **lớn nhất** là **9** (ô cam). Số **bé nhất** là **5** (ô xanh). Chú ý số 5 xuất hiện ở hai ô.", "The **greatest** number is **9** (orange box). The **least** number is **5** (blue boxes). Notice that 5 appears in two boxes.")
  }, {
   key: "d",
   f: 1,
   say: LT("Đếm xem một giá trị **xuất hiện mấy lần**: trong dãy 5; 8; 6; 5; 9; 7, số 5 xuất hiện mấy lần?", "Let's count **how many times** a value appears: in the sequence 5; 8; 6; 5; 9; 7, how many times does 5 appear?"),
   ask: {
    opts: ["1", "2", "3"],
    ans: "2",
    good: LT("Đúng! Số 5 xuất hiện 2 lần.", "Correct! The number 5 appears 2 times.")
   }
  }, {
   key: "d",
   f: 3,
   say: LT("**Sắp xếp từ bé đến lớn**: 5; 5; 6; 7; 8; 9. Hai số 5 đứng cạnh nhau ở đầu dãy, số 9 lớn nhất đứng cuối.", "**Sort from least to greatest**: 5; 5; 6; 7; 8; 9. The two 5s sit side by side at the start, and 9, the greatest, comes last.")
  }, {
   key: "d",
   f: 4,
   say: LT("Hiệu giữa số lớn nhất và số bé nhất: 9 − 5 = **4**. Tổng các số liệu: 5 + 8 + 6 + 5 + 9 + 7 = **40** cuốn sách.", "The difference between the greatest and the least number: 9 − 5 = **4**. The sum of the data values: 5 + 8 + 6 + 5 + 9 + 7 = **40** books.")
  }],
  gen(tier, r) {
   var C = r.pick(DCTX),
    k = r.f();
   var seqQ = (vals, tail) => C.seq + ": **" + vals.join("; ") + "**. " + tail;
   var tabQ = (names, vals, tail) => C.tab + ": " + names.map((x, i) => x + " " + vals[i]).join(", ") + ". " + tail;
   if (tier === 1) {
    if (k < .25) {
     var v = genVals(r, 6, C.lo, C.hi, {
       um: 0
      }),
      big = r.chance(.5),
      a = big ? maxOf(v) : minOf(v);
     return QQ({
      q: seqQ(v, LT("Số liệu **" + (big ? "lớn" : "bé") + " nhất** là số nào?", "Which number is the **" + (big ? "greatest" : "least") + "** data value?")),
      fig: DF(v),
      parts: [num("", a)],
      steps: [st(LT("So sánh các số trong dãy", "Compare the numbers in the sequence")), st(LT("Số " + (big ? "lớn" : "bé") + " nhất là " + a, "The " + (big ? "greatest" : "least") + " number is " + a), a)],
      tip: LT("So sánh lần lượt từng số liệu với nhau.", "Compare the data values one by one.")
     });
    }
    if (k < .4) {
     var n = rd(r, 5, 8),
      v2 = genVals(r, n, C.lo, C.hi);
     return QQ({
      q: seqQ(v2, LT("Dãy số liệu này có **bao nhiêu số liệu**?", "How many **data values** are in this sequence?")),
      fig: DF(v2, null, {}, {
       idx: 0
      }),
      parts: [num("", n, LT("số liệu", "data values"))],
      steps: [st(LT("Đếm từng số trong dãy, không bỏ sót, không đếm trùng", "Count each number in the sequence without skipping or counting twice")), st(LT("Dãy có " + n + " số liệu", "The sequence has " + n + " data values"), n)],
      tip: LT("Đếm lần lượt từ trái sang phải.", "Count in order from left to right.")
     });
    }
    if (k < .7) {
     var v3 = genVals(r, 7, C.lo, C.hi, {
       dup: 1,
       maxc: 3
      }),
      c3 = cntOf(v3),
      cand = Object.keys(c3).filter(x => c3[x] >= 2),
      t = +r.pick(cand),
      hi3 = {};
     v3.forEach((x, i) => {
      if (x === t) hi3[i] = "sun";
     });
     return QQ({
      q: seqQ(v3, LT("Số **" + t + "** xuất hiện bao nhiêu lần trong dãy?", "How many times does the number **" + t + "** appear in the sequence?")),
      fig: DF(v3),
      parts: [num("", c3[t], LT("lần", "times"))],
      steps: [st(LT("Đếm các số bằng " + t + " trong dãy", "Count the numbers equal to " + t + " in the sequence")), st(LT("Số " + t + " xuất hiện " + c3[t] + " lần", "The number " + t + " appears " + c3[t] + " times"), c3[t])],
      tip: LT("Chỉ đếm những số đúng bằng " + t + ".", "Only count the numbers that are exactly " + t + ".")
     });
    }
    var nm = pickNames(r, 6),
     v4 = genVals(r, 6, C.lo, C.hi),
     j = rd(r, 0, 5);
    return QQ({
     q: tabQ(nm, v4, LT("Bạn **" + nm[j] + "** " + C.verb + " bao nhiêu " + C.unit + "?", "How many " + C.unit + " has **" + nm[j] + "** " + C.verb + "?")),
     fig: DF(v4, nm),
     parts: [num("", v4[j], C.unit)],
     steps: [st(LT("Tìm tên " + nm[j] + " trong bảng", "Find the name " + nm[j] + " in the table")), st(LT("Số liệu của " + nm[j] + " là " + v4[j], "The data value for " + nm[j] + " is " + v4[j]), v4[j])],
     tip: LT("Tìm đúng tên bạn, rồi đọc số ngay dưới tên.", "Find the right name, then read the number right below it.")
    });
   }
   if (tier === 2) {
    if (k < .3) {
     var n5 = rd(r, 6, 7),
      v5 = genVals(r, n5, C.lo, C.hi, {
       dup: 1
      }),
      up = r.chance(.6),
      sa = asc(v5),
      ok = (up ? sa : sa.slice().reverse()).join(", ");
     var wr = [(up ? sa.slice().reverse() : sa).join(", "), v5.join(", ")];
     var sw = sa.slice();
     for (var ii = 0; ii < sw.length - 1; ii++)
      if (sw[ii] !== sw[ii + 1]) {
       var tm = sw[ii];
       sw[ii] = sw[ii + 1];
       sw[ii + 1] = tm;
       break;
      }
     var sw2 = up ? sw : sw.slice().reverse();
     wr.push(sw2.join(", "));
     var uniq = [ok];
     wr.forEach(x => {
      if (uniq.indexOf(x) < 0) uniq.push(x);
     });
     if (uniq.length < 4) {
      var sh = r.shuffle(v5).join(", ");
      if (uniq.indexOf(sh) < 0) uniq.push(sh);
     }
     if (uniq.length < 3) return byId("datalist").gen(tier, r);
     return QQ({
      q: seqQ(v5, LT("Dãy nào dưới đây là dãy số liệu trên sau khi sắp xếp **từ " + (up ? "bé đến lớn" : "lớn đến bé") + "**?", "Which sequence below is the sequence above sorted **from " + (up ? "least to greatest" : "greatest to least") + "**?")),
      fig: DF(v5),
      parts: [chp(r.shuffle(uniq), ok)],
      steps: [st(LT("Tìm số " + (up ? "bé" : "lớn") + " nhất đặt đầu dãy, rồi lần lượt các số tiếp theo", "Find the " + (up ? "least" : "greatest") + " number and put it first, then the following numbers in order")), st(LT("Dãy đúng: " + ok, "Correct sequence: " + ok))],
      tip: LT("Kiểm tra: dãy phải có đủ " + n5 + " số, giống số liệu ban đầu.", "Check: the sequence must have all " + n5 + " numbers, the same as the original data.")
     });
    }
    if (k < .55) {
     var nm2 = pickNames(r, 6),
      v6 = genVals(r, 6, C.lo, C.hi, {
       um: 1
      }),
      most = r.chance(.5),
      ex = most ? maxOf(v6) : minOf(v6),
      ix = v6.indexOf(ex),
      pool = nm2.filter((x, i) => i !== ix),
      ops = r.shuffle([nm2[ix]].concat(r.shuffle(pool).slice(0, 3)));
     return QQ({
      q: tabQ(nm2, v6, LT("Bạn nào " + C.verb + " **" + (most ? "nhiều" : "ít") + " nhất**? Bạn đó " + C.verb + " bao nhiêu " + C.unit + "?", "Who has " + C.verb + " the **" + (most ? "most" : "fewest") + "**? How many " + C.unit + " has that student " + C.verb + "?")),
      fig: DF(v6, nm2),
      parts: [chp(ops, nm2[ix], LT("Bạn", "Student")), num(LT("Số " + C.unit, "Number of " + C.unit), ex)],
      steps: [st(LT("So sánh các số liệu trong bảng", "Compare the data values in the table")), st(LT("Số " + (most ? "lớn" : "bé") + " nhất là " + ex + ", của bạn " + nm2[ix], "The " + (most ? "greatest" : "least") + " number is " + ex + ", for " + nm2[ix]), ex)],
      tip: LT("Tìm số " + (most ? "lớn" : "bé") + " nhất trong bảng rồi xem tên bạn ở trên.", "Find the " + (most ? "greatest" : "least") + " number in the table, then look at the name above it.")
     });
    }
    if (k < .75) {
     var n7 = rd(r, 7, 8),
      v7 = genVals(r, n7, C.lo, C.hi),
      sset = Object.keys(cntOf(v7)).map(Number).sort((a, b) => a - b),
      thr = r.pick(sset.slice(0, sset.length - 1)),
      ct = v7.filter(x => x > thr).length;
     return QQ({
      q: seqQ(v7, LT("Có bao nhiêu số liệu **lớn hơn " + thr + "**?", "How many data values are **greater than " + thr + "**?")),
      fig: DF(v7),
      parts: [num("", ct, LT("số liệu", ct === 1 ? "data value" : "data values"))],
      steps: [st(LT("Xét từng số, đánh dấu số lớn hơn " + thr + " (không tính số bằng " + thr + ")", "Check each number and mark the ones greater than " + thr + " (do not count numbers equal to " + thr + ")")), st(LT("Có " + ct + " số liệu lớn hơn " + thr, (ct === 1 ? "There is 1 data value greater than " + thr : "There are " + ct + " data values greater than " + thr)), ct)],
      tip: LT("Lớn hơn " + thr + " nghĩa là không tính số bằng " + thr + ".", "Greater than " + thr + " means we do not count numbers equal to " + thr + ".")
     });
    }
    var nm3 = pickNames(r, 6),
     v8 = genVals(r, 6, C.lo, C.hi),
     i1 = rd(r, 0, 5),
     i2 = rd(r, 0, 4);
    if (i2 >= i1) i2++;
    if (v8[i1] === v8[i2]) return byId("datalist").gen(tier, r);
    var bg = v8[i1] > v8[i2] ? i1 : i2,
     sm = bg === i1 ? i2 : i1,
     dd = v8[bg] - v8[sm];
    return QQ({
     q: tabQ(nm3, v8, LT("Bạn **" + nm3[i1] + "** và bạn **" + nm3[i2] + "**, bạn nào " + C.verb + " nhiều hơn và nhiều hơn bao nhiêu " + C.unit + "?", "Who has " + C.verb + " more, **" + nm3[i1] + "** or **" + nm3[i2] + "**, and how many more " + C.unit + "?")),
     fig: DF(v8, nm3),
     parts: [chp([nm3[i1], nm3[i2]], nm3[bg], LT("Bạn nhiều hơn", "Who has more")), num(LT("Hơn", "More by"), dd, dd === 1 ? C.u1 : C.unit)],
     steps: [st(nm3[i1] + ": " + v8[i1] + "; " + nm3[i2] + ": " + v8[i2]), st(v8[bg] + " − " + v8[sm] + " = " + dd, dd)],
     tip: LT("Lấy số lớn trừ số bé.", "Subtract the smaller number from the larger number.")
    });
   }
   // tier 3
   if (k < .22) {
    var n9 = rd(r, 7, 8),
     v9 = genVals(r, n9, C.lo, C.hi, {
      um: 1
     }),
     m1 = maxOf(v9),
     m2 = minOf(v9);
    return QQ({
     q: seqQ(v9, LT("Tìm số liệu lớn nhất, số liệu bé nhất và **hiệu** của chúng.", "Find the greatest data value, the least data value, and their **difference**.")),
     fig: DF(v9),
     parts: [num(LT("Lớn nhất", "Greatest"), m1), num(LT("Bé nhất", "Least"), m2), num(LT("Hiệu", "Difference"), m1 - m2)],
     steps: [st(LT("So sánh các số: lớn nhất là " + m1 + ", bé nhất là " + m2, "Compare the numbers: the greatest is " + m1 + " and the least is " + m2), null), st(LT("Hiệu: " + m1 + " − " + m2 + " = " + (m1 - m2), "Difference: " + m1 + " − " + m2 + " = " + (m1 - m2)), m1 - m2)],
     tip: LT("Hiệu = số lớn nhất − số bé nhất.", "Difference = greatest number − least number.")
    });
   }
   if (k < .42) {
    var n10 = rd(r, 6, 8),
     v10 = genVals(r, n10, C.lo, C.hi),
     sum = sumOf(v10),
     useN = r.chance(.5),
     nm4 = pickNames(r, n10);
    return QQ({
     q: useN ? tabQ(nm4, v10, LT("Cả tổ " + C.verb + " tất cả bao nhiêu " + C.unit + "?", "How many " + C.unit + " has the whole group " + C.verb + " in all?")) : seqQ(v10, LT("Cả tổ có tất cả bao nhiêu " + C.unit + "? (tính **tổng** các số liệu)", "How many " + C.unit + " does the whole group have in all? (find the **sum** of the data values)")),
     fig: DF(v10, useN ? nm4 : null),
     parts: [num("", sum, C.unit)],
     steps: [st(LT("Cộng tất cả các số liệu: " + v10.join(" + "), "Add up all the data values: " + v10.join(" + "))), st(v10.join(" + ") + " = " + sum, sum)],
     tip: LT("Cộng lần lượt từng số, có thể ghép các số tròn chục trước.", "Add the numbers one at a time; you can first pair numbers that make a round ten.")
    });
   }
   if (k < .62) {
    var nm5 = pickNames(r, 6),
     v13 = genVals(r, 6, C.lo, C.hi),
     d13 = v13.slice().sort((a, b) => b - a);
    if (d13[2] === d13[3]) return byId("datalist").gen(tier, r);
    var top3 = d13[0] + d13[1] + d13[2];
    return QQ({
     q: tabQ(nm5, v13, LT("Tính tổng số " + C.unit + " của **3 bạn " + C.verb + " nhiều nhất**.", "Find the total number of " + C.unit + " for the **3 students who have " + C.verb + " the most**.")),
     fig: DF(v13, nm5),
     parts: [num("", top3, C.unit)],
     steps: [st(LT("Sắp xếp từ lớn đến bé: " + d13.join("; ") + ". Ba số lớn nhất: " + d13[0] + ", " + d13[1] + ", " + d13[2], "Sort from greatest to least: " + d13.join("; ") + ". The three greatest: " + d13[0] + ", " + d13[1] + ", " + d13[2]), null), st(d13[0] + " + " + d13[1] + " + " + d13[2] + " = " + top3, top3)],
     tip: LT("Tìm ba số lớn nhất trước, rồi mới cộng.", "Find the three greatest numbers first, then add them.")
    });
   }
   if (k < .82) {
    var n11 = rd(r, 5, 7),
     v11 = genVals(r, n11, C.lo, C.hi),
     pos = rd(r, 2, n11 - 1),
     sorted = asc(v11);
    return QQ({
     q: seqQ(v11, LT("Sắp xếp dãy số liệu **từ bé đến lớn**. Số liệu ở **vị trí thứ " + pos + "** là số nào?", "Sort the data sequence **from least to greatest**. Which number is in **position " + pos + "**?")),
     fig: DF(v11),
     parts: [num("", sorted[pos - 1])],
     steps: [st(LT("Sắp xếp từ bé đến lớn: " + sorted.join("; "), "Sort from least to greatest: " + sorted.join("; "))), st(LT("Số ở vị trí thứ " + pos + " là " + sorted[pos - 1], "The number in position " + pos + " is " + sorted[pos - 1]), sorted[pos - 1])],
     tip: LT("Viết lại dãy từ bé đến lớn rồi đếm vị trí từ trái sang phải.", "Rewrite the sequence from least to greatest, then count the positions from left to right.")
    });
   }
   var mode = rd(r, C.lo, C.hi),
    mc = rd(r, 3, 4),
    others = [],
    pool2 = [];
   for (var q2 = C.lo; q2 <= C.hi; q2++)
    if (q2 !== mode) pool2.push(q2);
   pool2 = r.shuffle(pool2);
   var tot = mc + rd(r, 3, 4);
   for (var z = 0; others.length < tot - mc; z++) others.push(pool2[Math.floor(z / 2) % pool2.length]);
   // z/2: mỗi số khác tối đa 2 lần
   var v12 = r.shuffle(Array(mc).fill(mode).concat(others)),
    c12 = cntOf(v12);
   if (Object.keys(c12).some(x => +x !== mode && c12[x] >= mc)) return byId("datalist").gen(tier, r);
   return QQ({
    q: LT("⭐ Thử thách: " + seqQ(v12, "Số liệu nào xuất hiện **nhiều lần nhất**? Số đó xuất hiện bao nhiêu lần?"), "⭐ Challenge: " + seqQ(v12, "Which data value appears **the most times**? How many times does it appear?")),
    fig: DF(v12),
    parts: [num(LT("Số liệu", "Data value"), mode), num(LT("Số lần", "Number of times"), mc, LT("lần", "times"))],
    steps: [st(LT("Đếm số lần xuất hiện của từng số liệu", "Count how many times each data value appears")), st(LT("Số " + mode + " xuất hiện nhiều nhất: " + mc + " lần", "The number " + mode + " appears the most: " + mc + " times"), mc)],
    tip: LT("Đếm từng giá trị, ghi bên cạnh số lần xuất hiện.", "Count each value and write the number of times next to it.")
   });
  }
 });

 /* ============================ BÀI 3: freq ============================ */
 var cap = s => s.charAt(0).toUpperCase() + s.slice(1);
 var PLN = (n, one, many) => n + " " + (n === 1 ? one : many);
 var COLS = ["đỏ", "vàng", "xanh", "tím"]; /*EN-LOGIC*/ var COLEN = { /*EN-LOGIC*/ "đỏ": "red", "vàng": "yellow", "xanh": "blue", "tím": "purple" }, CEN = c => LT(c, COLEN[c]);

 function mkCtx(r, nOut, kindWanted) {
  var kd = kindWanted || (nOut === 2 ? r.pick(["coin", "ball", "spin"]) : r.pick(["ball", "spin"]));
  if (kd === "coin") return {
   kd,
   outs: [{
    k: LT("N", "H"),
    tl: LT("Mặt ngửa", "Heads"),
    ev: LT("mặt ngửa", "heads"),
    fill: "sun"
   }, {
    k: LT("S", "T"),
    tl: LT("Mặt sấp", "Tails"),
    ev: LT("mặt sấp", "tails"),
    fill: "sky"
   }],
   intro: n => LT("Bạn Lan tung một đồng xu **" + n + " lần** và ghi lại kết quả (N: mặt ngửa, S: mặt sấp)", "Lan flips a coin **" + n + " times** and records the results (H: heads, T: tails)"),
   short: LT("tung đồng xu", "flipping a coin")
  };
  if (kd === "ball") {
   var cs = r.shuffle(COLS).slice(0, nOut);
   return {
    kd,
    cols: cs,
    outs: cs.map(c => ({
     k: BALLK[c],
     tl: LT("Bóng " + c, cap(CEN(c)) + " ball"),
     ev: LT("bóng " + c, CEN(c) + " ball"),
     fill: BALL[c],
     c
    })),
    intro: n => LT("Trong hộp có bóng " + cs.join(", ") + ". Bạn Nam lấy ngẫu nhiên một quả, ghi màu rồi trả lại, làm **" + n + " lần** (" + cs.map(c => BALLK[c] + ": " + c).join(", ") + ")", "The box has balls in these colors: " + cs.map(c => CEN(c)).join(", ") + ". Nam picks one ball at random, writes down its color, and puts it back. He does this **" + n + " times** (" + cs.map(c => BALLK[c] + ": " + CEN(c)).join(", ") + ")"),
    short: LT("lấy bóng", "picking balls")
   };
  }
  var nums = r.shuffle([1, 2, 3, 4]).slice(0, nOut).sort((a, b) => a - b);
  return {
   kd,
   nums,
   outs: nums.map(x => ({
    k: String(x),
    tl: LT("Số " + x, "Number " + x),
    ev: LT("số " + x, "number " + x),
    fill: "white"
   })),
   intro: n => LT("Bạn Mai quay một tấm bìa có các số " + (nums.length > 1 ? nums.slice(0, -1).join(", ") + " và " + nums[nums.length - 1] : nums[0]) + ". Bạn quay **" + n + " lần** và ghi lại số mà mũi tên chỉ vào", "Mai spins a spinner with the numbers " + (nums.length > 1 ? nums.slice(0, -1).join(", ") + " and " + nums[nums.length - 1] : nums[0]) + ". She spins it **" + n + " times** and records the number the arrow points to"),
   short: LT("quay số", "spinning the spinner")
  };
 }

 function genCounts(r, nOut, n, o) {
  o = o || {};
  for (var g = 0; g < 300; g++) {
   var c = [],
    left = n;
   for (var i = 0; i < nOut - 1; i++) {
    var x = r.int(o.lo || 2, Math.max(o.lo || 2, left - (nOut - 1 - i) * (o.lo || 2)));
    c.push(x);
    left -= x;
   }
   c.push(left);
   if (left < (o.lo || 2) || left > (o.hi || 99)) continue;
   if (c.some(x => x > (o.hi || 99))) continue;
   var mx = maxOf(c),
    mn = minOf(c);
   if (o.uniq && (c.filter(x => x === mx).length > 1 || c.filter(x => x === mn).length > 1)) continue;
   if (o.ne && mx === mn) continue;
   return r.shuffle(c);
  }
  return null;
 }

 function seqFrom(r, counts, outs) {
  var seq = [];
  counts.forEach((c, i) => {
   for (var j = 0; j < c; j++) seq.push(i);
  });
  return r.shuffle(seq);
 }
 var chipFig = (seq, outs) => ({
  fb: FB.dseq([{
   vals: seq.map(i => outs[i].k),
   fills: seq.map(i => outs[i].fill)
  }], {}),
  f: 0
 });
 var tallyFig = (rows, h1) => ({
  fb: FB.tally([{
   rows: rows.map(x => ({
    lab: x.lab,
    n: x.n,
    c: "ink"
   }))
  }], {
   h1: h1 || LT("Sự kiện", "Event")
  }),
  f: 0
 });
 var EVF = f => ({
  fb: FB.event([f], {}),
  f: 0
 });
 var CERT = [LT("Chắc chắn", "Certain"), LT("Có thể", "Possible"), LT("Không thể", "Impossible")];

 LESSON({
  id: "freq",
  reg: "hinh",
  title: LT("Số lần xuất hiện của một sự kiện", "How many times an event happens"),
  short: LT("Số lần xuất hiện", "Number of times"),
  emoji: "🎲",
  blurb: LT("Kiểm đếm, đọc bảng, so sánh số lần", "Tally, read tables, compare counts"),
  links: ["datalist", "sumdiff"],
  rule: {
   h: LT("Nhớ nhé", "Remember"),
   items: [LT("Mỗi lần thực hiện (tung đồng xu, lấy bóng, quay số…) ta ghi lại **kết quả**.", "Each time we do the activity (flip a coin, pick a ball, spin a spinner…), we write down the **result**."), LT("**Kiểm đếm**: mỗi lần xuất hiện ghi **một vạch**; cứ 4 vạch thẳng, vạch thứ 5 **gạch chéo** thành một nhóm 5.", "**Tally**: each time it happens, make **one mark**; after 4 straight marks, the 5th mark **crosses them out diagonally** to make a group of 5."), LT("Đếm vạch để biết sự kiện xuất hiện **bao nhiêu lần**. Tổng số lần của các sự kiện bằng **số lần đã thực hiện**.", "Count the marks to find out **how many times** an event happened. The total of all the events equals **the number of times we did the activity**."), LT("Sự kiện nào xuất hiện nhiều lần hơn thì có số vạch nhiều hơn; trừ hai số lần để biết **hơn bao nhiêu lần**.", "The event that happens more often has more marks; subtract the two counts to find **how many more times**."), LT("Sự kiện có thể **chắc chắn** xảy ra, **có thể** xảy ra, hoặc **không thể** xảy ra.", "An event can be **certain** to happen, **possible**, or **impossible**.")]
  },
  figs: {
   s: () => FB.dseq([{
    vals: ["N", "S", "N", "N", "S", "N", "S", "N", "N", "N"].map(v => LT(v, v === "N" ? "H" : "T")),
    fills: ["sun", "sky", "sun", "sun", "sky", "sun", "sky", "sun", "sun", "sun"],
    idx: 1,
    note: LT("10 lần tung: N ngửa, S sấp", "10 flips: H is heads, T is tails")
   }], {}),
   t: () => FB.tally([{
    rows: [{
     lab: LT("Mặt ngửa", "Heads"),
     n: 4
    }, {
     lab: LT("Mặt sấp", "Tails"),
     n: 2
    }],
    note: LT("Mỗi lần xuất hiện: 1 vạch", "Each time it happens: 1 mark")
   }, {
    rows: [{
     lab: LT("Mặt ngửa", "Heads"),
     n: 5
    }, {
     lab: LT("Mặt sấp", "Tails"),
     n: 3
    }],
    note: LT("Vạch thứ 5 gạch chéo: nhóm 5", "The 5th mark crosses out: a group of 5")
   }, {
    rows: [{
     lab: LT("Mặt ngửa", "Heads"),
     n: 7
    }, {
     lab: LT("Mặt sấp", "Tails"),
     n: 3
    }],
    note: LT("Bảng kiểm đếm đủ 10 lần tung", "The tally chart for all 10 flips")
   }, {
    rows: [{
     lab: LT("Mặt ngửa", "Heads"),
     n: 7,
     t: 7
    }, {
     lab: LT("Mặt sấp", "Tails"),
     n: 3,
     t: 3
    }],
    note: LT("7 + 3 = 10 lần tung", "7 + 3 = 10 flips")
   }], {}),
   b: () => FB.event([{
    box: [{
     c: "đỏ", /*EN-LOGIC*/
     n: 3
    }, {
     c: "xanh", /*EN-LOGIC*/
     n: 2
    }],
    note: LT("Lấy 1 quả từ hộp", "Pick 1 ball from the box")
   }, {
    box: [{
     c: "đỏ", /*EN-LOGIC*/
     n: 3
    }, {
     c: "xanh", /*EN-LOGIC*/
     n: 2
    }],
    note: LT("Không có bóng vàng: không thể", "No yellow balls: impossible")
   }, {
    box: [{
     c: "đỏ", /*EN-LOGIC*/
     n: 5
    }],
    note: LT("Toàn bóng đỏ: chắc chắn lấy được đỏ", "All red balls: you are certain to get red")
   }], {
    h: 190
   })
  },
  teach: [{
   key: "s",
   f: 0,
   say: LT("Bạn Lan **tung một đồng xu 10 lần**, mỗi lần ghi kết quả: **N** là **mặt ngửa**, **S** là **mặt sấp**. Ta được dãy kết quả như hình.", "Lan **flips a coin 10 times** and writes down each result: **H** is **heads** and **T** is **tails**. We get the row of results shown.")
  }, {
   key: "t",
   f: 0,
   say: LT("Để đếm cho dễ, ta lập **bảng kiểm đếm**: mỗi lần mặt ngửa xuất hiện, ta ghi **một vạch** vào hàng \"Mặt ngửa\". Mặt sấp cũng vậy.", "To make counting easy, we make a **tally chart**: each time heads shows up, we make **one mark** in the \"Heads\" row. Tails works the same way.")
  }, {
   key: "t",
   f: 1,
   say: LT("Cứ **4 vạch thẳng**, vạch thứ **5 gạch chéo** qua bốn vạch đó thành **một nhóm 5**. Nhờ vậy dễ đếm hơn: đếm theo nhóm 5.", "After every **4 straight marks**, the **5th mark crosses out** those four to make **one group of 5**. That makes counting easier: count by groups of 5.")
  }, {
   key: "t",
   f: 2,
   say: LT("Đây là bảng kiểm đếm đủ 10 lần tung. Hàng \"Mặt ngửa\" có **1 nhóm 5 và 2 vạch lẻ**. Con đếm xem mặt ngửa xuất hiện mấy lần nhé!", "Here is the tally chart for all 10 flips. The \"Heads\" row has **1 group of 5 and 2 single marks**. Count how many times heads showed up!"),
   ask: { q: LT("Mặt ngửa xuất hiện mấy lần?", "How many times did heads show up?"),
    opts: ["5", "7", "10"],
    ans: "7",
    good: LT("Đúng! 5 + 2 = 7, mặt ngửa xuất hiện 7 lần.", "Correct! 5 + 2 = 7, so heads showed up 7 times.")
   }
  }, {
   key: "t",
   f: 3,
   say: LT("Mặt ngửa xuất hiện **7 lần**, mặt sấp xuất hiện **3 lần**. Mặt ngửa xuất hiện **nhiều hơn** mặt sấp 7 − 3 = **4 lần**. Tổng số lần: 7 + 3 = **10 lần**, đúng bằng số lần tung.", "Heads showed up **7 times** and tails showed up **3 times**. Heads showed up **more** than tails: 7 − 3 = **4 more times**. Total: 7 + 3 = **10 times**, exactly the number of flips.")
  }, {
   key: "b",
   f: 0,
   say: LT("Trong hộp có 3 bóng đỏ và 2 bóng xanh. Lấy ngẫu nhiên 1 quả. Sự kiện \"lấy được bóng đỏ\" **có thể** xảy ra (nhưng chưa chắc chắn).", "The box has 3 red balls and 2 blue balls. Pick 1 ball at random. The event \"getting a red ball\" is **possible** (but not certain)."),
   ask: { q: LT("Cùng hộp đó, sự kiện \"lấy được bóng xanh\" là:", "From the same box, the event \"getting a blue ball\" is:"),
    opts: [LT("Chắc chắn", "Certain"), LT("Có thể", "Possible"), LT("Không thể", "Impossible")],
    ans: LT("Có thể", "Possible"),
    good: LT("Đúng! Có thể lấy được bóng đỏ, cũng có thể lấy được bóng xanh.", "Correct! You could get a red ball, or you could get a blue ball.")
   }
  }, {
   key: "b",
   f: 1,
   say: LT("Trong hộp **không có bóng vàng**, nên sự kiện \"lấy được bóng vàng\" **không thể** xảy ra.", "The box has **no yellow balls**, so the event \"getting a yellow ball\" is **impossible**.")
  }, {
   key: "b",
   f: 2,
   say: LT("Nếu hộp **toàn bóng đỏ**, lấy ra 1 quả thì **chắc chắn** là bóng đỏ. Vậy có ba mức: **chắc chắn**, **có thể**, **không thể**.", "If the box has **only red balls**, the ball you take out is **certain** to be red. So there are three levels: **certain**, **possible**, **impossible**.")
  }],
  gen(tier, r) {
   var k = r.f();
   var Q = (ctx, n, tail) => ctx.intro(n) + ". " + tail;
   var qual = (r2) => {
    var kd = r2.pick(["boxA", "boxB", "spin"]);
    if (kd === "spin") {
     var nu = r2.shuffle([1, 2, 3, 4, 5, 6]).slice(0, 3).sort((a, b) => a - b),
      same = r2.chance(.3),
      secs = same ? [nu[0], nu[0], nu[0], nu[0]] : [nu[0], nu[1], nu[2]];
     var ev = r2.chance(.5) ? nu[0] : nu[1],
      nonex = [1, 2, 3, 4, 5, 6].filter(x => nu.indexOf(x) < 0);
     var type = r2.pick(["in", "out"]),
      tx = type === "in" ? ev : r2.pick(nonex);
     if (same && type === "in") tx = nu[0];
     var ans = type === "out" ? LT("Không thể", "Impossible") : same ? LT("Chắc chắn", "Certain") : LT("Có thể", "Possible");
     if (same && type === "out") tx = r2.pick(nonex);
     return {
      fig: EVF({
       spin: secs.map(x => ({
        t: x,
        c: "sun"
       })),
       note: LT("Tấm bìa quay số", "Number spinner")
      }),
      q: LT("Quay tấm bìa như hình, mũi tên dừng lại ở một ô. Sự kiện \"**mũi tên chỉ vào số " + tx + "**\" là:", "Spin the spinner shown. The arrow stops on one section. The event \"**the arrow points to the number " + tx + "**\" is:"),
      ans,
      why: same ? LT("Tất cả các ô đều là số " + nu[0], "All the sections show the number " + nu[0]) : type === "in" ? LT("Có ô ghi số " + tx + " nhưng cũng có ô ghi số khác", "One section shows the number " + tx + ", but other sections show different numbers") : LT("Không có ô nào ghi số " + tx, "No section shows the number " + tx)
     };
    }
    var cs = r2.shuffle(COLS);
    var box = kd === "boxA" ? [{
      c: cs[0],
      n: rd(r2, 2, 4)
     }, {
      c: cs[1],
      n: rd(r2, 2, 4)
     }] : [{
      c: cs[0],
      n: rd(r2, 4, 6)
     }],
     inBox = box.map(b => b.c),
     type2 = r2.pick(["in", "out"]),
     col = type2 === "in" ? r2.pick(inBox) : r2.pick(cs.filter(c => inBox.indexOf(c) < 0));
    var ans2 = type2 === "out" ? LT("Không thể", "Impossible") : inBox.length === 1 ? LT("Chắc chắn", "Certain") : LT("Có thể", "Possible");
    return {
     fig: EVF({
      box
     }),
     q: LT("Trong hộp có các quả bóng như hình. Lấy ngẫu nhiên 1 quả. Sự kiện \"**lấy được bóng " + col + "**\" là:", "The box has balls as shown. Pick 1 ball at random. The event \"**getting a " + CEN(col) + " ball**\" is:"),
     ans: ans2,
     why: type2 === "out" ? LT("Trong hộp không có bóng " + col, "The box has no " + CEN(col) + " balls") : inBox.length === 1 ? LT("Trong hộp chỉ có bóng " + col, "The box has only " + CEN(col) + " balls") : LT("Trong hộp có bóng " + col + " nhưng cũng có bóng màu khác", "The box has " + CEN(col) + " balls, but also balls of other colors")
    };
   };
   if (tier === 1) {
    if (k < .4) {
     var C = mkCtx(r, 2),
      n = 10,
      cn = genCounts(r, 2, n, {
       lo: 2,
       hi: 8,
       ne: 1
      }),
      seq = seqFrom(r, cn, C.outs),
      t = rd(r, 0, 1);
     return QQ({
      q: Q(C, n, LT("Kết quả: **" + seq.map(i => C.outs[i].k).join(" ") + "**. Sự kiện **" + C.outs[t].ev + "** xuất hiện bao nhiêu lần?", "Results: **" + seq.map(i => C.outs[i].k).join(" ") + "**. How many times did the event **" + C.outs[t].ev + "** happen?")),
      fig: chipFig(seq, C.outs),
      parts: [num("", cn[t], LT("lần", "times"))],
      steps: [st(LT("Đếm các kết quả " + C.outs[t].k + " trong dãy, đánh dấu từng lần", "Count the " + C.outs[t].k + " results in the row, marking each one")), st(LT(cap(C.outs[t].ev) + " xuất hiện " + cn[t] + " lần", cap(C.outs[t].ev) + " showed up " + cn[t] + " times"), cn[t])],
      tip: LT("Đếm lần lượt từ trái sang phải, không bỏ sót.", "Count one by one from left to right and do not skip any.")
     });
    }
    if (k < .7) {
     var C2 = mkCtx(r, r.pick([2, 3])),
      cn2 = genCounts(r, C2.outs.length, rd(r, 8, 20), {
       lo: 2,
       hi: 12
      }),
      t2 = rd(r, 0, C2.outs.length - 1);
     if (!cn2) return byId("freq").gen(tier, r);
     return QQ({
      q: LT("Bảng kiểm đếm ghi lại kết quả " + C2.short + ". Sự kiện **" + C2.outs[t2].ev + "** xuất hiện bao nhiêu lần?", "The tally chart shows the results of " + C2.short + ". How many times did the event **" + C2.outs[t2].ev + "** happen?"),
      fig: tallyFig(C2.outs.map((o, i) => ({
       lab: o.tl,
       n: cn2[i]
      }))),
      parts: [num("", cn2[t2], LT("lần", "times"))],
      steps: [st(LT("Mỗi nhóm 5 là 5 lần (4 vạch thẳng và 1 vạch chéo), cộng thêm các vạch lẻ", "Each group of 5 means 5 times (4 straight marks and 1 diagonal mark), plus the single marks")), st(LT("Hàng \"" + C2.outs[t2].tl + "\": " + Math.floor(cn2[t2] / 5) + " nhóm 5 và " + cn2[t2] % 5 + " vạch lẻ → " + cn2[t2] + " lần", "The \"" + C2.outs[t2].tl + "\" row: " + PLN(Math.floor(cn2[t2] / 5), "group", "groups") + " of 5 and " + PLN(cn2[t2] % 5, "single mark", "single marks") + " → " + cn2[t2] + " times"), cn2[t2])],
      tip: LT("Đếm theo nhóm 5: 5, 10, 15, … rồi cộng các vạch lẻ.", "Count by groups of 5: 5, 10, 15, … then add the single marks.")
     });
    }
    var Qq = qual(r);
    return QQ({
     q: Qq.q,
     fig: Qq.fig,
     parts: [chp(CERT, Qq.ans)],
     steps: [st(Qq.why + " → " + Qq.ans.toLowerCase())],
     tip: LT("Chắc chắn: luôn xảy ra. Có thể: có khả năng xảy ra. Không thể: không bao giờ xảy ra.", "Certain: always happens. Possible: might happen. Impossible: never happens.")
    });
   }
   if (tier === 2) {
    if (k < .28) {
     var C3 = mkCtx(r, 3),
      cn3 = genCounts(r, 3, rd(r, 12, 24), {
       lo: 2,
       hi: 14,
       uniq: 1
      });
     if (!cn3) return byId("freq").gen(tier, r);
     var most = r.chance(.5),
      ex = most ? maxOf(cn3) : minOf(cn3),
      ix = cn3.indexOf(ex);
     return QQ({
      q: LT("Bảng kiểm đếm ghi lại kết quả " + C3.short + ". Sự kiện nào xuất hiện **" + (most ? "nhiều" : "ít") + " nhất**?", "The tally chart shows the results of " + C3.short + ". Which event showed up **the " + (most ? "most" : "fewest") + " times**?"),
      fig: tallyFig(C3.outs.map((o, i) => ({
       lab: o.tl,
       n: cn3[i]
      }))),
      parts: [chp(C3.outs.map(o => cap(o.ev)), cap(C3.outs[ix].ev))],
      steps: [st(LT("Đếm số lần của từng hàng: " + C3.outs.map((o, i) => o.tl.toLowerCase() + " " + cn3[i]).join("; "), "Count the times in each row: " + C3.outs.map((o, i) => o.tl.toLowerCase() + " " + cn3[i]).join("; ")), null), st(LT(cap(C3.outs[ix].ev) + " có " + ex + " lần, " + (most ? "nhiều" : "ít") + " nhất", cap(C3.outs[ix].ev) + " showed up " + ex + " times, the " + (most ? "most" : "fewest")))],
      tip: most ? LT("Hàng có nhiều vạch nhất là sự kiện xuất hiện nhiều nhất.", "The row with the most marks is the event that showed up the most.") : LT("Hàng có ít vạch nhất là sự kiện xuất hiện ít nhất.", "The row with the fewest marks is the event that showed up the fewest times.")
     });
    }
    if (k < .6) {
     var nO = r.pick([2, 2, 3]),
      C4 = mkCtx(r, nO),
      n4 = rd(r, 12, 16),
      cn4 = genCounts(r, nO, n4, {
       lo: 2,
       hi: 10,
       ne: 1
      });
     if (!cn4) return byId("freq").gen(tier, r);
     var seq4 = seqFrom(r, cn4, C4.outs);
     return QQ({
      q: Q(C4, n4, LT("Kết quả: **" + seq4.map(i => C4.outs[i].k).join(" ") + "**. Hãy đếm số lần xuất hiện của từng sự kiện.", "Results: **" + seq4.map(i => C4.outs[i].k).join(" ") + "**. Count how many times each event showed up.")),
      fig: chipFig(seq4, C4.outs),
      parts: C4.outs.map((o, i) => num(cap(o.ev), cn4[i], LT("lần", "times"))),
      steps: [st(LT("Đếm lần lượt từng loại kết quả, nên gạch từng ô đã đếm", "Count each kind of result one at a time, and cross out each one you count")), st(LT(C4.outs.map((o, i) => o.ev + ": " + cn4[i]).join("; ") + " (tổng " + n4 + " lần)", C4.outs.map((o, i) => o.ev + ": " + cn4[i]).join("; ") + " (total " + n4 + " times)"), null)],
      tip: LT("Kiểm tra lại: tổng số lần các sự kiện phải bằng " + n4 + ".", "Check again: the counts of all the events must add up to " + n4 + ".")
     });
    }
    if (k < .8) {
     var C5 = mkCtx(r, 2),
      cn5 = genCounts(r, 2, rd(r, 10, 26), {
       lo: 3,
       hi: 20,
       ne: 1
      });
     if (!cn5) return byId("freq").gen(tier, r);
     var bg = cn5[0] > cn5[1] ? 0 : 1,
      df = Math.abs(cn5[0] - cn5[1]);
     return QQ({
      q: LT("Bảng kiểm đếm ghi lại kết quả " + C5.short + ". Sự kiện nào xuất hiện nhiều hơn và nhiều hơn bao nhiêu lần?", "The tally chart shows the results of " + C5.short + ". Which event showed up more often, and how many more times?"),
      fig: tallyFig(C5.outs.map((o, i) => ({
       lab: o.tl,
       n: cn5[i]
      }))),
      parts: [chp(C5.outs.map(o => cap(o.ev)), cap(C5.outs[bg].ev), LT("Nhiều hơn", "More often")), num(LT("Hơn", "How many more"), df, LT("lần", df === 1 ? "time" : "times"))],
      steps: [st(LT("Đếm: " + C5.outs[0].ev + " " + cn5[0] + " lần; " + C5.outs[1].ev + " " + cn5[1] + " lần", "Count: " + C5.outs[0].ev + " " + cn5[0] + " times; " + C5.outs[1].ev + " " + cn5[1] + " times")), st(cn5[bg] + " − " + cn5[1 - bg] + " = " + df, df)],
      tip: LT("Lấy số lần nhiều trừ số lần ít.", "Subtract the smaller count from the larger count.")
     });
    }
    var kd = r.pick(["box", "spin"]),
     askC = r.chance(.5);
    if (kd === "spin") {
     var nu = r.shuffle([1, 2, 3, 4, 5, 6]).slice(0, 3).sort((a, b) => a - b),
      miss = [1, 2, 3, 4, 5, 6].filter(x => nu.indexOf(x) < 0)[0];
     var opts = [LT("Mũi tên chỉ vào số " + nu[0], "The arrow points to the number " + nu[0]), LT("Mũi tên chỉ vào số " + miss, "The arrow points to the number " + miss), LT("Mũi tên chỉ vào một trong các số " + nu.join(", "), "The arrow points to one of the numbers " + nu.join(", "))],
      ans = askC ? opts[2] : opts[1];
     return QQ({
      q: LT("Quay tấm bìa như hình. Sự kiện nào **" + (askC ? "chắc chắn" : "không thể") + "** xảy ra?", "Spin the spinner shown. Which event is **" + (askC ? "certain" : "impossible") + "** to happen?"),
      fig: EVF({
       spin: nu.map(x => ({
        t: x,
        c: "sun"
       })),
       note: LT("Tấm bìa quay số", "Number spinner")
      }),
      parts: [chp(r.shuffle(opts), ans)],
      steps: [st(LT("Xem trên tấm bìa có những số nào", "Look at which numbers are on the spinner")), st(LT(ans + " → " + (askC ? "chắc chắn" : "không thể"), ans + " → " + (askC ? "certain" : "impossible")))],
      tip: LT("Chắc chắn: lúc nào cũng xảy ra. Không thể: không có ô nào ghi số đó.", "Certain: it always happens. Impossible: no section shows that number.")
     });
    }
    var cs = r.shuffle(COLS),
     bx = [{
      c: cs[0],
      n: rd(r, 2, 4)
     }, {
      c: cs[1],
      n: rd(r, 2, 4)
     }];
    var opts2 = [LT("Lấy được bóng " + cs[0], "Getting a " + CEN(cs[0]) + " ball"), LT("Lấy được bóng " + cs[2], "Getting a " + CEN(cs[2]) + " ball"), LT("Lấy được bóng " + cs[0] + " hoặc bóng " + cs[1], "Getting a " + CEN(cs[0]) + " ball or a " + CEN(cs[1]) + " ball")],
     ans3 = askC ? opts2[2] : opts2[1];
    return QQ({
     q: LT("Trong hộp có các quả bóng như hình. Lấy ngẫu nhiên 1 quả. Sự kiện nào **" + (askC ? "chắc chắn" : "không thể") + "** xảy ra?", "The box has balls as shown. Pick 1 ball at random. Which event is **" + (askC ? "certain" : "impossible") + "** to happen?"),
     fig: EVF({
      box: bx
     }),
     parts: [chp(r.shuffle(opts2), ans3)],
     steps: [st(LT("Xem trong hộp có những màu bóng nào: " + cs[0] + " và " + cs[1], "Look at which colors of balls are in the box: " + CEN(cs[0]) + " and " + CEN(cs[1]))), st(LT(ans3 + " → " + (askC ? "chắc chắn" : "không thể"), ans3 + " → " + (askC ? "certain" : "impossible")))],
     tip: LT("Chắc chắn: lúc nào cũng xảy ra. Không thể: trong hộp không có màu đó.", "Certain: it always happens. Impossible: the box has no balls of that color.")
    });
   }
   // tier 3
   if (k < .35) {
    var C6 = mkCtx(r, 3),
     cn6 = genCounts(r, 3, rd(r, 14, 26), {
      lo: 2,
      hi: 14,
      ne: 1
     });
    if (!cn6) return byId("freq").gen(tier, r);
    var tt = sumOf(cn6),
     d6 = maxOf(cn6) - minOf(cn6);
    return QQ({
     q: LT("Bảng kiểm đếm ghi lại kết quả " + C6.short + ". Hỏi đã thực hiện tất cả bao nhiêu lần? Sự kiện nhiều nhất hơn sự kiện ít nhất bao nhiêu lần?", "The tally chart shows the results of " + C6.short + ". How many times was it done in all? How many more times did the event that showed up the most happen than the event that showed up the least?"),
     fig: tallyFig(C6.outs.map((o, i) => ({
      lab: o.tl,
      n: cn6[i]
     }))),
     parts: [num(LT("Tổng số lần", "Total number of times"), tt, LT("lần", "times")), num(LT("Nhiều nhất hơn ít nhất", "Difference (most − least)"), d6, LT("lần", d6 === 1 ? "time" : "times"))],
     steps: [st(LT("Đếm từng hàng: " + C6.outs.map((o, i) => cn6[i]).join(", "), "Count each row: " + C6.outs.map((o, i) => cn6[i]).join(", ")), null), st(LT("Tổng: " + cn6.join(" + ") + " = " + tt + "; hiệu: " + maxOf(cn6) + " − " + minOf(cn6) + " = " + d6, "Total: " + cn6.join(" + ") + " = " + tt + "; difference: " + maxOf(cn6) + " − " + minOf(cn6) + " = " + d6), tt)],
     tip: LT("Tổng số lần thực hiện bằng tổng số lần của các sự kiện.", "The total number of times done equals the sum of the counts of all the events.")
    });
   }
   if (k < .7) {
    var nO3 = r.pick([2, 3]),
     C7 = mkCtx(r, nO3),
     n7 = rd(r, 18, 30),
     cn7 = genCounts(r, nO3, n7, {
      lo: 3,
      hi: 18
     });
    if (!cn7) return byId("freq").gen(tier, r);
    var sh = C7.outs.slice(0, nO3 - 1).map((o, i) => ({
      lab: o.tl,
      n: cn7[i]
     })),
     rest = cn7[nO3 - 1];
    return QQ({
     q: LT(C7.intro(n7) + ". Bảng kiểm đếm chỉ ghi " + (nO3 === 2 ? "một sự kiện" : "hai sự kiện") + ". Sự kiện **" + C7.outs[nO3 - 1].ev + "** xuất hiện bao nhiêu lần?", C7.intro(n7) + ". The tally chart shows only " + (nO3 === 2 ? "one event" : "two events") + ". How many times did the event **" + C7.outs[nO3 - 1].ev + "** show up?"),
     fig: tallyFig(sh),
     parts: [num("", rest, LT("lần", "times"))],
     steps: [st(sh.length === 1 ? LT("Số lần đã ghi trong bảng: " + sh[0].n, "Times recorded in the table: " + sh[0].n) : LT("Đếm số lần đã ghi trong bảng: " + sh.map(x => x.n).join(" + ") + " = " + sumOf(sh.map(x => x.n)), "Count the times recorded in the table: " + sh.map(x => x.n).join(" + ") + " = " + sumOf(sh.map(x => x.n))), null), st(LT("Số lần còn lại: " + n7 + " − " + sumOf(sh.map(x => x.n)) + " = " + rest, "Times left over: " + n7 + " − " + sumOf(sh.map(x => x.n)) + " = " + rest), rest)],
     tip: LT("Tổng số lần của các sự kiện bằng số lần thực hiện (" + n7 + " lần).", "The counts of all the events add up to the number of times done (" + n7 + " times).")
    });
   }
   var C8 = mkCtx(r, 2);
   if (r.chance(.5)) {
    var kk = 2,
     s8 = rd(r, 3, 8),
     n8 = (kk + 1) * s8;
    return QQ({
     q: LT("⭐ Thử thách: " + C8.intro(n8) + ". Số lần **" + C8.outs[0].ev + "** xuất hiện **gấp " + kk + " lần** số lần **" + C8.outs[1].ev + "**. Tính số lần mỗi sự kiện xuất hiện. (Gợi ý: vẽ sơ đồ đoạn thẳng.)", "⭐ Challenge: " + C8.intro(n8) + ". The number of times **" + C8.outs[0].ev + "** showed up is **" + kk + " times as many** as the number of times **" + C8.outs[1].ev + "** showed up. Find how many times each event showed up. (Hint: draw a bar model.)"),
     parts: [num(cap(C8.outs[1].ev), s8, LT("lần", "times")), num(cap(C8.outs[0].ev), kk * s8, LT("lần", "times"))],
     steps: [st(LT(cap(C8.outs[1].ev) + " là 1 phần thì " + C8.outs[0].ev + " là " + kk + " phần: tất cả " + (kk + 1) + " phần", "If " + C8.outs[1].ev + " is 1 part, then " + C8.outs[0].ev + " is " + kk + " parts: " + (kk + 1) + " parts in all"), kk + 1), st(LT(cap(C8.outs[1].ev) + ": " + n8 + " : " + (kk + 1) + " = " + s8 + " lần; " + C8.outs[0].ev + ": " + s8 + " × " + kk + " = " + kk * s8 + " lần", cap(C8.outs[1].ev) + ": " + n8 + " ÷ " + (kk + 1) + " = " + s8 + " times; " + C8.outs[0].ev + ": " + s8 + " × " + kk + " = " + kk * s8 + " times"), s8)],
     tip: LT("Vẽ sơ đồ đoạn thẳng: một sự kiện 1 phần, sự kiện kia " + kk + " phần.", "Draw a bar model: one event is 1 part, the other event is " + kk + " parts.")
    });
   }
   var d8 = 2 * rd(r, 1, 5),
    h8 = rd(r, 4, 12),
    n9 = 2 * h8 + d8;
   return QQ({
    q: LT("⭐ Thử thách: " + C8.intro(n9) + ". Số lần **" + C8.outs[0].ev + "** xuất hiện **nhiều hơn** số lần **" + C8.outs[1].ev + "** là **" + d8 + " lần**. Tính số lần mỗi sự kiện xuất hiện.", "⭐ Challenge: " + C8.intro(n9) + ". **" + cap(C8.outs[0].ev) + "** showed up **" + d8 + " more times** than **" + C8.outs[1].ev + "**. Find how many times each event showed up."),
    parts: [num(cap(C8.outs[0].ev), h8 + d8, LT("lần", "times")), num(cap(C8.outs[1].ev), h8, LT("lần", "times"))],
    steps: [st(LT("Đây là bài toán tổng – hiệu: tổng " + n9 + " lần, hiệu " + d8 + " lần", "This is a sum and difference problem: the sum is " + n9 + " times and the difference is " + d8 + " times")), st(LT(cap(C8.outs[0].ev) + ": (" + n9 + " + " + d8 + ") : 2 = " + (h8 + d8) + " lần; " + C8.outs[1].ev + ": " + n9 + " − " + (h8 + d8) + " = " + h8 + " lần", cap(C8.outs[0].ev) + ": (" + n9 + " + " + d8 + ") ÷ 2 = " + (h8 + d8) + " times; " + C8.outs[1].ev + ": " + n9 + " − " + (h8 + d8) + " = " + h8 + " times"), h8 + d8)],
    tip: LT("Số lớn = (tổng + hiệu) : 2; số bé = tổng − số lớn.", "Larger number = (sum + difference) ÷ 2; smaller number = sum − larger number.")
   });
  }
 });
})();
  /* ===== new_ps.js: fracdiv, fracprop, fracof ===== */
  Object.assign(KIND_NAME, {
   dao_tu_mau: LT("Viết ngược tử số và mẫu số", "Wrote the numerator and denominator backwards"),
   chi_mot_ve: LT("Chỉ biến đổi tử số hoặc mẫu số, không đổi cả hai", "Changed only the numerator or only the denominator, not both"),
   cong_cung: LT("Cộng cùng một số thay vì nhân/chia", "Added the same number instead of multiplying/dividing"),
   tru_con_lai: LT("Chưa tìm phần còn lại", "Did not find the remaining part")
  });
  var fdPies = (n, b, num2, col) => {
   let sp = 360 / (n + 1),
    r = Math.min(46, sp * .42);
   return Array.from({
    length: n
   }, (_, i) => ({
    cx: Math.round(sp * (i + 1)),
    cy: 66,
    r,
    den: b,
    num: num2,
    c: col
   }))
  };

  function fdHint(a, b) {
   return {
    fb: FB.frac([{
     pies: fdPies(a, b, 1, "pink"),
     tx: [{
      x: 180,
      y: 150,
      t: LT("Mỗi bạn lấy phần tô màu ở mỗi cái bánh", "Each friend takes the shaded parts"),
      s: 17,
      c: "dark"
     }]
    }], {
     h: 170
    }),
    f: 0
   }
  }
  var fdDiag = (a, b) => (vals, q) => {
   let v = vals[0];
   return v && +v.n === b && +v.d === a && a !== b ? {
    kind: "dao_tu_mau",
    msg: LT("Con viết ngược rồi. Số bị chia (" + a + ") là tử số, số chia (" + b + ") là mẫu số.", "You wrote it backwards. The dividend (" + a + ") is the numerator, and the divisor (" + b + ") is the denominator.")
   } : null
  };
  LESSON({
   id: "fracdiv",
   reg: "ps",
   title: LT("Phân số và phép chia số tự nhiên", "Fractions and Dividing Whole Numbers"),
   short: LT("PS và phép chia", "Fractions and Division"),
   emoji: "🍰",
   blurb: LT("Thương của phép chia viết thành phân số", "Write the quotient of a division as a fraction"),
   links: ["frac", "div"],
   rule: {
    h: LT("Nhớ nhé", "Remember"),
    items: [LT("Thương của phép chia số tự nhiên cho số tự nhiên (khác 0) viết được thành **phân số**: a : b = {a/b}.", "The quotient of dividing one whole number by another whole number (not 0) can be written as a **fraction**: a ÷ b = {a/b}."), LT("Số bị chia là **tử số**, số chia là **mẫu số**: 3 : 4 = {3/4}; 7 : 2 = {7/2}.", "The dividend is the **numerator** and the divisor is the **denominator**: 3 ÷ 4 = {3/4}; 7 ÷ 2 = {7/2}."), LT("Số tự nhiên viết thành phân số có **mẫu số là 1**: 5 = {5/1}.", "A whole number can be written as a fraction with **denominator 1**: 5 = {5/1}."), LT("Tử số bé hơn mẫu số: phân số **bé hơn 1**. Tử số bằng mẫu số: **bằng 1**. Tử số lớn hơn mẫu số: **lớn hơn 1**.", "Numerator smaller than denominator: the fraction is **less than 1**. Numerator equal to denominator: **equal to 1**. Numerator larger than denominator: **greater than 1**.")]
   },
   figs: {
    a: () => FB.frac([{
     pies: fdPies(3, 1, 1, "orange"),
     tx: [{
      x: 180,
      y: 150,
      t: LT("3 cái bánh", "3 cakes"),
      s: 22
     }, {
      x: 180,
      y: 182,
      t: LT("chia đều cho 4 bạn", "shared equally by 4 friends"),
      s: 19,
      c: "dark"
     }]
    }, {
     pies: fdPies(3, 4, 4, "peach"),
     tx: [{
      x: 180,
      y: 150,
      t: LT("Chia mỗi cái bánh thành", "Cut each cake into"),
      s: 20
     }, {
      x: 180,
      y: 182,
      t: LT("4 phần bằng nhau", "4 equal parts"),
      s: 20
     }]
    }, {
     pies: fdPies(3, 4, 1, "pink"),
     tx: [{
      x: 180,
      y: 150,
      t: LT("Mỗi bạn lấy 1 phần", "Each friend takes 1 part"),
      s: 20
     }, {
      x: 180,
      y: 182,
      t: LT("ở mỗi cái bánh", "from each cake"),
      s: 20
     }]
    }, {
     pies: fdPies(3, 4, 1, "pink"),
     tx: [{
      x: 140,
      y: 190,
      t: LT("3 : 4 =", "3 ÷ 4 ="),
      s: 30,
      a: "end"
     }],
     fr: [{
      x: 190,
      y: 184,
      n: 3,
      d: 4,
      s: 32,
      c: "okc"
     }]
    }], {
     h: 215
    }),
    b: () => FB.frac([{
     bars: [{
      y: 22,
      den: 5,
      num: 5,
      c: "orange"
     }],
     tx: [{
      x: 70,
      y: 130,
      t: LT("5 : 5 =", "5 ÷ 5 ="),
      s: 28
     }, {
      x: 215,
      y: 130,
      t: "= 1",
      s: 28
     }],
     fr: [{
      x: 142,
      y: 122,
      n: 5,
      d: 5,
      s: 30
     }]
    }, {
     pies: [{
      cx: 52,
      cy: 56,
      r: 38,
      den: 2,
      num: 2,
      c: "pink"
     }, {
      cx: 140,
      cy: 56,
      r: 38,
      den: 2,
      num: 2,
      c: "pink"
     }, {
      cx: 228,
      cy: 56,
      r: 38,
      den: 2,
      num: 2,
      c: "pink"
     }, {
      cx: 316,
      cy: 56,
      r: 38,
      den: 2,
      num: 1,
      c: "pink"
     }],
     tx: [{
      x: 70,
      y: 160,
      t: LT("7 : 2 =", "7 ÷ 2 ="),
      s: 28
     }, {
      x: 215,
      y: 160,
      t: LT("(lớn hơn 1)", "(greater than 1)"),
      s: 19,
      c: "dark"
     }],
     fr: [{
      x: 142,
      y: 152,
      n: 7,
      d: 2,
      s: 30
     }]
    }, {
     tx: [{
      x: 180,
      y: 60,
      t: LT("Số tự nhiên viết thành phân số", "A whole number written as a fraction"),
      s: 20
     }, {
      x: 180,
      y: 92,
      t: LT("có mẫu số là 1", "has denominator 1"),
      s: 20
     }, {
      x: 90,
      y: 160,
      t: "6 =",
      s: 32
     }, {
      x: 250,
      y: 160,
      t: "5 =",
      s: 32
     }],
     fr: [{
      x: 140,
      y: 152,
      n: 6,
      d: 1,
      s: 32,
      c: "okc"
     }, {
      x: 300,
      y: 152,
      n: 5,
      d: 1,
      s: 32,
      c: "okc"
     }]
    }, {
     fr: [{
      x: 62,
      y: 62,
      n: 3,
      d: 4,
      s: 32
     }, {
      x: 180,
      y: 62,
      n: 4,
      d: 4,
      s: 32
     }, {
      x: 298,
      y: 62,
      n: 7,
      d: 4,
      s: 32
     }],
     tx: [{
      x: 62,
      y: 130,
      t: LT("tử < mẫu", "num < denom"),
      s: 16,
      c: "dark"
     }, {
      x: 62,
      y: 156,
      t: LT("bé hơn 1", "less than 1"),
      s: 19,
      c: "blue"
     }, {
      x: 180,
      y: 130,
      t: LT("tử = mẫu", "num = denom"),
      s: 16,
      c: "dark"
     }, {
      x: 180,
      y: 156,
      t: LT("bằng 1", "equal to 1"),
      s: 19,
      c: "okc"
     }, {
      x: 298,
      y: 130,
      t: LT("tử > mẫu", "num > denom"),
      s: 16,
      c: "dark"
     }, {
      x: 298,
      y: 156,
      t: LT("lớn hơn 1", "greater than 1"),
      s: 19,
      c: "orange"
     }]
    }], {
     h: 200
    })
   },
   teach: [{
    key: "a",
    f: 0,
    say: LT("Có **3 cái bánh** giống nhau, chia đều cho **4 bạn**. Mỗi bạn được bao nhiêu phần của cái bánh?", "There are **3 cakes** that are the same, shared equally by **4 friends**. How much of a cake does each friend get?")
   }, {
    key: "a",
    f: 1,
    say: LT("Ta chia **mỗi cái bánh** thành **4 phần bằng nhau**, vì có 4 bạn.", "We cut **each cake** into **4 equal parts**, because there are 4 friends.")
   }, {
    key: "a",
    f: 2,
    say: LT("Mỗi bạn lấy **1 phần** ở mỗi cái bánh. Có 3 cái bánh nên mỗi bạn lấy **3 phần**, mỗi phần là {1/4} cái bánh.", "Each friend takes **1 part** from each cake. There are 3 cakes, so each friend takes **3 parts**, and each part is {1/4} of a cake.")
   }, {
    key: "a",
    f: 3,
    say: LT("Vậy mỗi bạn được {3/4} cái bánh. Ta viết: 3 : 4 = {3/4}. **Số bị chia là tử số, số chia là mẫu số.**", "So each friend gets {3/4} of a cake. We write: 3 ÷ 4 = {3/4}. **The dividend is the numerator, and the divisor is the denominator.**")
   }, {
    key: "a",
    f: 3,
    say: LT("Cùng làm: chia đều **5 cái bánh** cho **6 bạn**. Mỗi bạn được bao nhiêu cái bánh?", "Let's do one together: share **5 cakes** equally among **6 friends**. How much cake does each friend get?"),
    ask: {
     opts: ["{5/6}", "{6/5}", "{1/6}"],
     ans: "{5/6}",
     good: LT("Đúng! 5 : 6 = {5/6}.", "Correct! 5 ÷ 6 = {5/6}.")
    }
   }, {
    key: "b",
    f: 0,
    say: LT("Chia 5 cái bánh cho 5 bạn: mỗi bạn được 1 cái. Ta có 5 : 5 = {5/5} = **1**. Phân số có tử số bằng mẫu số thì **bằng 1**.", "Share 5 cakes among 5 friends: each friend gets 1 cake. So 5 ÷ 5 = {5/5} = **1**. A fraction whose numerator equals its denominator is **equal to 1**.")
   }, {
    key: "b",
    f: 1,
    say: LT("Chia 7 cái bánh cho 2 bạn: 7 : 2 = {7/2}. Mỗi bạn được nhiều hơn 1 cái, nên {7/2} **lớn hơn 1**.", "Share 7 cakes among 2 friends: 7 ÷ 2 = {7/2}. Each friend gets more than 1 cake, so {7/2} is **greater than 1**.")
   }, {
    key: "b",
    f: 2,
    say: LT("Mọi **số tự nhiên** đều viết được thành phân số có **mẫu số là 1**: 6 = 6 : 1 = {6/1}.", "Every **whole number** can be written as a fraction with **denominator 1**: 6 = 6 ÷ 1 = {6/1}.")
   }, {
    key: "b",
    f: 3,
    say: LT("Tử số **bé hơn** mẫu số: phân số **bé hơn 1**. Tử số **bằng** mẫu số: **bằng 1**. Tử số **lớn hơn** mẫu số: **lớn hơn 1**.", "Numerator **smaller than** denominator: the fraction is **less than 1**. Numerator **equal to** denominator: **equal to 1**. Numerator **greater than** denominator: **greater than 1**.")
   }, {
    key: "b",
    f: 3,
    say: LT("Cùng làm: phân số {9/4} so với 1 thì thế nào?", "Let's do one together: how does the fraction {9/4} compare to 1?"),
    ask: {
     opts: [LT("Lớn hơn 1", "Greater than 1"), LT("Bé hơn 1", "Less than 1"), LT("Bằng 1", "Equal to 1")],
     ans: LT("Lớn hơn 1", "Greater than 1"),
     good: LT("Đúng! Tử số 9 lớn hơn mẫu số 4.", "Correct! The numerator 9 is greater than the denominator 4.")
    }
   }],
   gen(tier, r) {
    let ST = (a, b) => [st(LT("Số bị chia " + a + " là tử số, số chia " + b + " là mẫu số", "The dividend " + a + " is the numerator, and the divisor " + b + " is the denominator")), st(LT(a + " : " + b + " = " + fr(a, b), a + " ÷ " + b + " = " + fr(a, b)))];
    if (tier === 1) {
     let k = r.f();
     if (k < .25) {
      let b = rd(r, 3, 9),
       a = rd(r, 1, b - 1);
      return QQ({
       q: LT("Viết thương của phép chia sau dưới dạng phân số: **" + a + "\u00a0:\u00a0" + b + "**", "Write the quotient of this division as a fraction: **" + a + "\u00a0÷\u00a0" + b + "**"),
       parts: [frp(a, b)],
       steps: ST(a, b),
       diag: fdDiag(a, b),
       tip: LT("a : b = {a/b}: số bị chia làm tử số, số chia làm mẫu số.", "a ÷ b = {a/b}: the dividend is the numerator and the divisor is the denominator.")
      })
     }
     if (k < .5) {
      let b = rd(r, 3, 6),
       a = rd(r, 2, b - 1),
       who = r.pick(["bạn", "người"]), /*EN-LOGIC*/
       what = r.pick(["cái bánh", "quả bưởi", "cái pizza"]), /*EN-LOGIC*/ whoS = who === "bạn" ? "friend" : "person", whoP = who === "bạn" ? "friends" : "people", whatS = what === "cái bánh" ? "cake" : what === "quả bưởi" ? "pomelo" : "pizza";
      return QQ({
       q: LT("Chia đều **" + a + " " + what + "** cho **" + b + " " + who + "**. Mỗi " + who + " được bao nhiêu phần " + what + "? (viết phân số)", "Share **" + a + " " + whatS + "s** equally among **" + b + " " + whoP + "**. How much of a " + whatS + " does each " + whoS + " get? (write a fraction)"),
       parts: [frp(a, b)],
       steps: [st(LT("Mỗi " + what + " chia thành " + b + " phần bằng nhau, mỗi " + who + " lấy " + a + " phần", "Cut each " + whatS + " into " + b + " equal parts; each " + whoS + " takes " + a + " parts")), st(LT(a + " : " + b + " = " + fr(a, b), a + " ÷ " + b + " = " + fr(a, b)))],
       hintFig: fdHint(a, b),
       diag: fdDiag(a, b),
       tip: LT("Phép chia " + a + " : " + b + " viết thành phân số.", "The division " + a + " ÷ " + b + " can be written as a fraction.")
      })
     }
     if (k < .65) {
      let n = rd(r, 2, 12);
      return QQ({
       q: LT("Viết số tự nhiên **" + n + "** dưới dạng phân số có **mẫu số là 1**.", "Write the whole number **" + n + "** as a fraction with **denominator 1**."),
       parts: [Object.assign(frp(n, 1), {
        exact: !0
       })],
       diag: exDg,
       steps: [st(LT("Số tự nhiên viết thành phân số: tử số là chính số đó, mẫu số là 1", "A whole number as a fraction: the numerator is the number itself and the denominator is 1")), st(n + " = " + fr(n, 1))],
       tip: LT("Mẫu số là 1.", "The denominator is 1.")
      })
     }
     if (k < .85) {
      let b = rd(r, 3, 9),
       a = rd(r, 1, b - 1),
       o = r.shuffle([fr(a, b), fr(b, a), fr(a, a + b)]);
      return QQ({
       q: LT("Thương của phép chia **" + a + " : " + b + "** viết thành phân số là:", "The quotient of the division **" + a + " ÷ " + b + "** written as a fraction is:"),
       parts: [chp(o, fr(a, b))],
       steps: [st(LT("Tử số là số bị chia " + a + ", mẫu số là số chia " + b, "The numerator is the dividend " + a + " and the denominator is the divisor " + b)), st(LT(a + " : " + b + " = " + fr(a, b), a + " ÷ " + b + " = " + fr(a, b)))],
       tip: LT("Số bị chia làm tử số.", "The dividend is the numerator.")
      })
     }
     let b = rd(r, 3, 9),
      a = rd(r, 2, b - 1);
     return QQ({
      q: LT("Số thích hợp để điền vào chỗ **?** là:\n" + a + " : " + b + " = {" + a + "/?}", "The number that goes in the blank **?** is:\n" + a + " ÷ " + b + " = {" + a + "/?}"),
      parts: [num("", b)],
      steps: [st(LT("Số chia là mẫu số: ? = " + b, "The divisor is the denominator: ? = " + b))],
      tip: LT("Mẫu số là số chia.", "The denominator is the divisor.")
     })
    }
    if (tier === 2) {
     let k = r.f();
     if (k < .3) {
      let b = rd(r, 2, 9),
       a = rd(r, b + 1, 19);
      for (; a % b === 0;) a = rd(r, b + 1, 19);
      return QQ({
       q: LT("Viết thương của phép chia sau dưới dạng phân số: **" + a + "\u00a0:\u00a0" + b + "**", "Write the quotient of this division as a fraction: **" + a + "\u00a0÷\u00a0" + b + "**"),
       parts: [frp(a, b)],
       steps: ST(a, b).concat([st(LT("Phân số lớn hơn 1 vì tử số lớn hơn mẫu số", "The fraction is greater than 1 because the numerator is greater than the denominator"))]),
       diag: fdDiag(a, b),
       tip: LT("a : b = {a/b}, dù a lớn hơn b.", "a ÷ b = {a/b}, even when a is greater than b.")
      })
     }
     if (k < .55) {
      let b = rd(r, 3, 9),
       a = rd(r, 2, 19);
      for (; a === b || a % b === 0 || a % 2 === 0 && b % 2 === 0;) a = rd(r, 2, 19);
      let t = r.pick([
       [LT("lít nước mắm", "liters of fish sauce"), LT("chai", "bottles"), LT("lít", "liters")],
       [LT("kg đường", "kg of sugar"), LT("túi", "bags"), "kg"],
       [LT("m vải", "meters of fabric"), LT("bộ quần áo", "outfits"), "m", "meters"],
       [LT("kg gạo", "kg of rice"), LT("bao", "sacks"), "kg"]
      ]);
      return QQ({
       q: LT("Chia đều **" + a + " " + t[0] + "** cho **" + b + " " + t[1] + "**. Mỗi " + t[1] + " có bao nhiêu " + t[2] + "? (viết phân số)", "Divide **" + a + " " + t[0] + "** equally into **" + b + " " + t[1] + "**. How many " + (t[3] || t[2]) + " does each one get? (write a fraction)"),
       parts: [frp(a, b)],
       steps: [st(LT("Mỗi " + t[1] + " có: " + a + " : " + b, "Each one gets: " + a + " ÷ " + b)), st(LT(a + " : " + b + " = " + fr(a, b) + " (" + t[2] + ")", a + " ÷ " + b + " = " + fr(a, b) + " (" + t[2] + ")"))],
       diag: fdDiag(a, b),
       tip: LT("Chia đều là phép chia: " + a + " : " + b + ".", "Sharing equally means dividing: " + a + " ÷ " + b + ".")
      })
     }
     if (k < .7) {
      let a = rd(r, 3, 12);
      return QQ({
       q: LT("Viết thương **" + a + " : " + a + "** dưới dạng phân số, rồi cho biết phân số đó bằng số tự nhiên nào.", "Write the quotient **" + a + " ÷ " + a + "** as a fraction, then tell which whole number that fraction equals."),
       parts: [Object.assign(frp(a, a, LT("Phân số", "Fraction")), {
        exact: !0
       }), num(LT("Bằng số", "Equals the number"), 1)],
       diag: exDg,
       steps: [st(LT(a + " : " + a + " = " + fr(a, a), a + " ÷ " + a + " = " + fr(a, a))), st(LT("Tử số bằng mẫu số nên phân số bằng 1", "The numerator equals the denominator, so the fraction equals 1"), 1)],
       tip: LT("Một số chia cho chính nó thì bằng 1.", "Any number divided by itself equals 1.")
      })
     }
     if (k < .85) {
      let b = rd(r, 2, 9),
       a = rd(r, 2, 19);
      for (; a === b;) a = rd(r, 2, 19);
      return QQ({
       q: LT("Viết phân số " + fr(a, b) + " dưới dạng phép chia hai số tự nhiên: " + fr(a, b) + " = **? : ?**", "Write the fraction " + fr(a, b) + " as a division of two whole numbers: " + fr(a, b) + " = **? ÷ ?**"),
       parts: [num(LT("Số bị chia", "Dividend"), a), num(LT("Số chia", "Divisor"), b)],
       diag: (vals, q) => V(vals, 0) * b === V(vals, 1) * a && !(V(vals, 0) === a && V(vals, 1) === b) ? {
        kind: "dung_dang",
        msg: LT("Giá trị bằng nhau rồi, nhưng đề hỏi đúng tử số và mẫu số của phân số đã cho. Con đừng rút gọn nhé.", "The value is equal, but the question asks for exactly the numerator and denominator of the given fraction. Do not simplify.")
       } : null,
       steps: [st(LT("Tử số là số bị chia: " + a, "The numerator is the dividend: " + a), a), st(LT("Mẫu số là số chia: " + b, "The denominator is the divisor: " + b), b)],
       tip: LT("Tử số là số bị chia, mẫu số là số chia.", "The numerator is the dividend and the denominator is the divisor.")
      })
     }
     let m = rd(r, 3, 8),
      kind = r.pick(["lớn hơn 1", "bé hơn 1", "bằng 1"]) /*EN-LOGIC*/,
      eq = fr(m, m),
      big = fr(m + rd(r, 1, 4), m),
      sm = fr(rd(r, 1, m - 1), m),
      rt = kind === "bằng 1" ? eq : kind === "lớn hơn 1" ? big : sm,
      pool = kind === "bằng 1" ? [eq, sm, big] : kind === "lớn hơn 1" ? [big, sm, eq] : [sm, eq, big];
     return QQ({
      q: LT("Phân số nào **" + kind + "**?", "Which fraction is **" + (kind === "bằng 1" ? "equal to 1" : kind === "lớn hơn 1" ? "greater than 1" : "less than 1") + "**?"),
      parts: [chp(r.shuffle(pool), rt)],
      steps: [st(LT("So sánh tử số với mẫu số: bé hơn 1 khi tử < mẫu, bằng 1 khi tử = mẫu, lớn hơn 1 khi tử > mẫu", "Compare the numerator with the denominator: less than 1 when numerator < denominator, equal to 1 when numerator = denominator, greater than 1 when numerator > denominator")), st(LT("Phân số " + kind + " là " + rt, "The fraction that is " + (kind === "bằng 1" ? "equal to 1" : kind === "lớn hơn 1" ? "greater than 1" : "less than 1") + " is " + rt))],
      tip: LT("So sánh tử số với mẫu số.", "Compare the numerator with the denominator.")
     })
    }
    let k = r.int(0, 3);
    if (k === 0) {
     let b1 = rd(r, 3, 6),
      b2 = rd(r, b1 + 1, 9),
      m = rd(r, 2, 3),
      sw = r.chance(.5),
      A = sw ? b2 : b1,
      B = sw ? b1 : b2;
     return QQ({
      q: LT("⭐ Thử thách: Nhóm A có **" + A + " bạn** chia đều **" + m + " cái bánh**. Nhóm B có **" + B + " bạn** chia đều **" + m + " cái bánh** (bánh giống nhau). Mỗi bạn ở nhóm nào được **nhiều bánh hơn**?", "⭐ Challenge: Group A has **" + A + " kids** sharing **" + m + " cakes** equally. Group B has **" + B + " kids** sharing **" + m + " cakes** equally (the cakes are the same). Which group's kids each get **more cake**?"),
      parts: [chp([LT("Nhóm A", "Group A"), LT("Nhóm B", "Group B"), LT("Bằng nhau", "Equal")], A < B ? LT("Nhóm A", "Group A") : LT("Nhóm B", "Group B"))],
      steps: [st(LT("Mỗi bạn nhóm A được " + fr(m, A) + " cái, mỗi bạn nhóm B được " + fr(m, B) + " cái", "Each kid in group A gets " + fr(m, A) + " of a cake, and each kid in group B gets " + fr(m, B) + " of a cake")), st(LT("Cùng tử số " + m + ": mẫu số càng bé thì phân số càng lớn. Nhóm ít bạn hơn được nhiều hơn", "Same numerator " + m + ": the smaller the denominator, the greater the fraction. The group with fewer kids gets more"))],
      tip: LT("Viết số bánh mỗi bạn nhận được thành phân số rồi so sánh.", "Write the amount of cake each kid gets as a fraction, then compare.")
     })
    }
    if (k === 1) {
     let b = rd(r, 3, 9),
      a = rd(r, b + 1, 2 * b - 1);
     return QQ({
      q: LT("⭐ Thử thách: Chia đều **" + a + " cái bánh** cho **" + b + " bạn**. Mỗi bạn nhận được **1 cái bánh** và thêm một phần của cái bánh nữa. Viết phân số chỉ phần bánh **thêm** đó.", "⭐ Challenge: Share **" + a + " cakes** equally among **" + b + " kids**. Each kid gets **1 whole cake** plus a part of another cake. Write the fraction for that **extra** part."),
      parts: [frp(a - b, b)],
      steps: [st(LT("Mỗi bạn được " + a + " : " + b + " = " + fr(a, b) + " cái bánh", "Each kid gets " + a + " ÷ " + b + " = " + fr(a, b) + " cakes")), st(LT("Cho mỗi bạn 1 cái bánh nguyên (" + b + " cái cho " + b + " bạn), còn lại " + a + " − " + b + " = " + (a - b) + " cái bánh. Chia " + (a - b) + " cái cho " + b + " bạn, mỗi bạn được thêm " + fr(a - b, b) + " cái", "Give each kid 1 whole cake (" + b + " cakes for " + b + " kids), which leaves " + a + " − " + b + " = " + (a - b) + ((a - b) === 1 ? " cake" : " cakes") + ". Share " + (a - b) + ((a - b) === 1 ? " cake" : " cakes") + " among " + b + " kids, so each kid gets " + fr(a - b, b) + " of a cake more"))],
      tip: LT("Đưa ra 1 cái bánh nguyên cho mỗi bạn trước, còn bao nhiêu cái bánh thì chia tiếp.", "Give each kid 1 whole cake first, then share the cakes that are left.")
     })
    }
    if (k === 2) {
     let a = rd(r, 2, 9),
      b = rd(r, 2, 4),
      c = rd(r, 2, 3),
      u = r.pick([[LT("kg gạo", "kg of rice"), LT("túi", "bags"), LT("hộp", "boxes"), "kg"], [LT("l nước mắm", "L of fish sauce"), LT("chai", "bottles"), LT("lọ", "jars"), "L"], [LT("m vải", "m of fabric"), LT("tấm", "pieces"), LT("mảnh", "strips"), "m"]]);
     return QQ({
      q: LT("⭐ Thử thách: Chia đều **" + a + " " + u[0] + "** vào **" + b + " " + u[1] + "**. Sau đó mỗi " + u[1] + " lại được chia đều vào **" + c + " " + u[2] + "** nhỏ. Hỏi mỗi " + u[2] + " nhỏ có bao nhiêu " + u[3] + "? (viết phân số)", "⭐ Challenge: Share **" + a + " " + u[0] + "** equally among **" + b + " " + u[1] + "**. Then each of those is shared equally among **" + c + " " + u[2] + "**. How many " + u[3] + " are in each of the small " + u[2] + "? (write a fraction)"),
      parts: [frp(a, b * c)],
      steps: [st(LT("Mỗi " + u[1] + " có: " + a + " : " + b + " = " + fr(a, b) + " (" + u[3] + ")", "Each of the " + u[1] + " has: " + a + " ÷ " + b + " = " + fr(a, b) + " (" + u[3] + ")")), st(LT("Mỗi " + u[2] + " nhỏ có: " + fr(a, b) + " : " + c + " = " + fr(a, b * c) + " (" + u[3] + ")", "Each small " + u[2] + " has: " + fr(a, b) + " ÷ " + c + " = " + fr(a, b * c) + " (" + u[3] + ")"))],
      diag: DG.any((vals, q) => vals[0] && +vals[0].n === a && +vals[0].d === b ? {
       kind: "mot_buoc",
       msg: LT("Đó mới là phần của mỗi " + u[1] + ". Còn phải chia tiếp cho " + c + ".", "That is only each of the " + u[1] + ". It still has to be shared among " + c + ".")
      } : null, exDg),
      tip: LT("Chia từng bước: chia cho " + b + " trước, rồi chia tiếp cho " + c + ".", "Divide step by step: divide by " + b + " first, then by " + c + ".")
     })
    }
    let b = rd(r, 4, 12);
    return QQ({
     q: LT("Có bao nhiêu phân số dạng {?/" + b + "} **bé hơn 1**, biết tử số là số tự nhiên **khác 0**?", "How many fractions of the form {?/" + b + "} are **less than 1**, if the numerator is a whole number **other than 0**?"),
     parts: [num("", b - 1, LT("phân số", "fractions"))],
     steps: [st(LT("Phân số bé hơn 1 khi tử số bé hơn mẫu số " + b, "A fraction is less than 1 when its numerator is less than the denominator " + b)), st(LT("Tử số có thể là 1, 2, …, " + (b - 1) + ": có " + (b - 1) + " phân số", "The numerator can be 1, 2, …, " + (b - 1) + ": that makes " + (b - 1) + " fractions"), b - 1)],
     tip: LT("Tử số phải bé hơn " + b + " và khác 0.", "The numerator must be less than " + b + " and not 0.")
    })
   }
  });
  /* ---------- fracprop ---------- */
  function fpPair(r, big) {
   let b = rd(r, 2, big ? 9 : 6),
    a = rd(r, 1, b - 1);
   for (; gcd(a, b) > 1;) a = rd(r, 1, b - 1);
   return [a, b]
  }
  var fpDiag = (a, b, c) => (vals, q) => {
   let v = V(vals, 0);
   return v === a ? {
    kind: "chi_mot_ve",
    msg: LT("Con mới đổi mẫu số mà giữ nguyên tử số. Phải đổi **cả tử số và mẫu số** với cùng một số.", "You changed only the denominator and kept the numerator. You have to change **both the numerator and the denominator** by the same number.")
   } : v === a + (c - b) ? {
    kind: "cong_cung",
    msg: LT("Con đang cộng cùng một số vào tử và mẫu. Tính chất cơ bản là **nhân** (hoặc chia) cả tử và mẫu, không phải cộng.", "You are adding the same number to the numerator and the denominator. The basic property is to **multiply** (or divide) both, not add.")
   } : null
  };
  LESSON({
   id: "fracprop",
   reg: "ps",
   title: LT("Tính chất cơ bản của phân số", "Basic Property of Fractions"),
   short: LT("Tính chất PS", "Fraction Property"),
   emoji: "🧩",
   blurb: LT("Nhân, chia cả tử và mẫu để được phân số bằng nhau", "Multiply or divide the numerator and denominator to get equal fractions"),
   links: ["frac"],
   rule: {
    h: LT("Tính chất cơ bản", "Basic Property"),
    items: [LT("**Nhân** cả tử số và mẫu số với **cùng một số tự nhiên khác 0** thì được một phân số **bằng** phân số đã cho: {2/3} = (2 × 4) / (3 × 4) = {8/12}.", "**Multiply** both the numerator and the denominator by **the same whole number other than 0**, and you get a fraction **equal** to the original one: {2/3} = (2 × 4) / (3 × 4) = {8/12}."), LT("**Chia** cả tử số và mẫu số cho **cùng một số tự nhiên khác 0** (nếu chia hết) thì được phân số **bằng** phân số đã cho: {12/18} = (12 : 6) / (18 : 6) = {2/3}.", "**Divide** both the numerator and the denominator by **the same whole number other than 0** (if they divide evenly), and you get a fraction **equal** to the original one: {12/18} = (12 ÷ 6) / (18 ÷ 6) = {2/3}."), LT("Phải làm với **cả tử số và mẫu số**, không chỉ một số.", "You must do it to **both the numerator and the denominator**, not just one of them.")]
   },
   figs: {
    a: () => FB.frac([{
     bars: [{
      y: 22,
      den: 3,
      num: 2,
      c: "pink",
      lab: [2, 3]
     }],
     tx: [{
      x: 180,
      y: 100,
      t: LT("Chia thanh thành 3 phần, tô màu 2 phần", "Split the bar into 3 parts, shade 2 parts"),
      s: 17,
      c: "dark"
     }]
    }, {
     bars: [{
      y: 22,
      den: 3,
      num: 2,
      c: "pink",
      lab: [2, 3]
     }, {
      y: 82,
      den: 6,
      num: 4,
      c: "orange",
      lab: [4, 6]
     }],
     tx: [{
      x: 180,
      y: 160,
      t: LT("Chia mỗi phần làm 2: tô màu 4 phần trong 6 phần", "Split each part in 2: shade 4 of the 6 parts"),
      s: LT(16, 14),
      c: "dark"
     }]
    }, {
     bars: [{
      y: 22,
      den: 3,
      num: 2,
      c: "pink",
      lab: [2, 3]
     }, {
      y: 82,
      den: 6,
      num: 4,
      c: "orange",
      lab: [4, 6]
     }, {
      y: 142,
      den: 12,
      num: 8,
      c: "teal",
      lab: [8, 12]
     }],
     tx: [{
      x: 180,
      y: 214,
      t: LT("Phần tô màu như nhau: 2/3 = 4/6 = 8/12", "Same amount shaded: 2/3 = 4/6 = 8/12"),
      s: LT(18, 16)
     }]
    }], {
     h: 230
    }),
    b: () => FB.frac([{
     fr: [{
      x: 100,
      y: 100,
      n: 2,
      d: 3,
      s: 36
     }, {
      x: 260,
      y: 100,
      n: 8,
      d: 12,
      s: 36,
      c: "okc"
     }],
     tx: [{
      x: 180,
      y: 108,
      t: "=",
      s: 36
     }, {
      x: 180,
      y: 52,
      t: "× 4",
      s: 24,
      c: "orange"
     }, {
      x: 180,
      y: 168,
      t: "× 4",
      s: 24,
      c: "orange"
     }, {
      x: 180,
      y: 205,
      t: LT("nhân cả tử và mẫu với 4", "multiply top and bottom by 4"),
      s: 17,
      c: "dark"
     }]
    }, {
     fr: [{
      x: 100,
      y: 100,
      n: 12,
      d: 18,
      s: 36
     }, {
      x: 260,
      y: 100,
      n: 2,
      d: 3,
      s: 36,
      c: "okc"
     }],
     tx: [{
      x: 180,
      y: 108,
      t: "=",
      s: 36
     }, {
      x: 180,
      y: 52,
      t: LT(": 6", "÷ 6"),
      s: 24,
      c: "blue"
     }, {
      x: 180,
      y: 168,
      t: LT(": 6", "÷ 6"),
      s: 24,
      c: "blue"
     }, {
      x: 180,
      y: 205,
      t: LT("chia cả tử và mẫu cho 6", "divide top and bottom by 6"),
      s: 17,
      c: "dark"
     }]
    }, {
     fr: [{
      x: 100,
      y: 100,
      n: 2,
      d: 3,
      s: 36
     }, {
      x: 260,
      y: 100,
      n: "?",
      d: 12,
      s: 36,
      c: "orange"
     }],
     tx: [{
      x: 180,
      y: 108,
      t: "=",
      s: 36
     }, {
      x: 180,
      y: 52,
      t: "× 4",
      s: 24,
      c: "orange"
     }, {
      x: 180,
      y: 168,
      t: LT("12 : 3 = 4", "12 ÷ 3 = 4"),
      s: 20,
      c: "blue"
     }, {
      x: 180,
      y: 205,
      t: "? = 2 × 4 = 8",
      s: 20
     }]
    }, {
     fr: [{
      x: 100,
      y: 100,
      n: 2,
      d: 3,
      s: 36
     }, {
      x: 260,
      y: 100,
      n: 8,
      d: 3,
      s: 36,
      c: "red"
     }],
     tx: [{
      x: 180,
      y: 108,
      t: "≠",
      s: 36,
      c: "red"
     }, {
      x: 180,
      y: 52,
      t: "× 4",
      s: 24,
      c: "orange"
     }, {
      x: 180,
      y: 168,
      t: LT("giữ nguyên", "unchanged"),
      s: 24,
      c: "red"
     }, {
      x: 180,
      y: 205,
      t: LT("Phải nhân CẢ tử và mẫu!", "Multiply BOTH top and bottom!"),
      s: 18,
      c: "red"
     }]
    }], {
     h: 225
    })
   },
   teach: [{
    key: "a",
    f: 0,
    say: LT("Một thanh chia thành **3 phần bằng nhau**, tô màu **2 phần**: ta có phân số {2/3}.", "A bar is split into **3 equal parts**, and **2 parts** are shaded: that gives the fraction {2/3}.")
   }, {
    key: "a",
    f: 1,
    say: LT("Chia **mỗi phần** thành 2 phần nhỏ. Bây giờ có **6 phần**, tô màu **4 phần**: {4/6}. Phần tô màu **không thay đổi**, nên {2/3} = {4/6}.", "Split **each part** into 2 smaller parts. Now there are **6 parts**, and **4 parts** are shaded: {4/6}. The shaded amount **has not changed**, so {2/3} = {4/6}.")
   }, {
    key: "a",
    f: 2,
    say: LT("Chia mỗi phần ban đầu thành 4 phần nhỏ: {8/12}. Vẫn là cùng một phần của thanh: {2/3} = {4/6} = {8/12}.", "Split each original part into 4 smaller parts: {8/12}. It is still the same part of the bar: {2/3} = {4/6} = {8/12}.")
   }, {
    key: "b",
    f: 0,
    say: LT("Ta thấy: 2 × 4 = 8 và 3 × 4 = 12. **Nhân cả tử số và mẫu số với cùng một số tự nhiên khác 0** thì được phân số **bằng** phân số đã cho.", "We see: 2 × 4 = 8 and 3 × 4 = 12. **Multiply both the numerator and the denominator by the same whole number other than 0**, and you get a fraction **equal** to the original one.")
   }, {
    key: "b",
    f: 0,
    say: LT("Cùng làm: nhân cả tử và mẫu của {3/4} với 3, ta được phân số nào?", "Let's try: multiply both the numerator and the denominator of {3/4} by 3. Which fraction do we get?"),
    ask: {
     opts: ["{9/12}", "{6/7}", "{9/4}"],
     ans: "{9/12}",
     good: LT("Đúng! 3 × 3 = 9 và 4 × 3 = 12.", "Correct! 3 × 3 = 9 and 4 × 3 = 12.")
    }
   }, {
    key: "b",
    f: 1,
    say: LT("Ngược lại, **chia cả tử số và mẫu số cho cùng một số tự nhiên khác 0** (chia hết) cũng được phân số **bằng** phân số đã cho: {12/18} = {2/3}.", "In reverse, **dividing both the numerator and the denominator by the same whole number other than 0** (evenly) also gives a fraction **equal** to the original one: {12/18} = {2/3}.")
   }, {
    key: "b",
    f: 1,
    say: LT("Cùng làm: chia cả tử và mẫu của {10/15} cho 5, ta được phân số nào?", "Let's try: divide both the numerator and the denominator of {10/15} by 5. Which fraction do we get?"),
    ask: {
     opts: ["{2/3}", "{5/10}", "{2/15}"],
     ans: "{2/3}",
     good: LT("Đúng! 10 : 5 = 2 và 15 : 5 = 3.", "Correct! 10 ÷ 5 = 2 and 15 ÷ 5 = 3.")
    }
   }, {
    key: "b",
    f: 2,
    say: LT("Tìm số **?** để {2/3} = {?/12}: mẫu số 3 thành 12, tức là nhân với 12 : 3 = **4**. Tử số cũng nhân với 4: ? = 2 × 4 = **8**.", "Find the number **?** so that {2/3} = {?/12}: the denominator 3 becomes 12, so it was multiplied by 12 ÷ 3 = **4**. Multiply the numerator by 4 too: ? = 2 × 4 = **8**.")
   }, {
    key: "b",
    f: 3,
    say: LT("**Chú ý:** phải làm với **cả tử số và mẫu số**. Nếu chỉ nhân tử số thì ta được phân số **khác**: {8/3} lớn hơn {2/3}.", "**Note:** you must do it to **both the numerator and the denominator**. If you multiply only the numerator, you get a **different** fraction: {8/3} is greater than {2/3}.")
   }],
   gen(tier, r) {
    if (tier === 1) {
     let k = r.f(),
      p = fpPair(r, 0),
      a = p[0],
      b = p[1],
      m = rd(r, 2, 5);
     if (k < .25) return QQ({
      q: LT("Nhân cả tử số và mẫu số của " + fr(a, b) + " với **" + m + "**, được phân số nào?", "Multiply both the numerator and the denominator of " + fr(a, b) + " by **" + m + "**. Which fraction do you get?"),
      parts: [Object.assign(frp(a * m, b * m), {
       exact: !0
      })],
      steps: [st(LT("Tử số: " + a + " × " + m + " = " + a * m + "; mẫu số: " + b + " × " + m + " = " + b * m, "Numerator: " + a + " × " + m + " = " + a * m + "; denominator: " + b + " × " + m + " = " + b * m)), st(fr(a, b) + " = " + fr(a * m, b * m))],
      tip: LT("Nhân cả tử số và mẫu số với " + m + ".", "Multiply both the numerator and the denominator by " + m + ".")
     });
     if (k < .5) return QQ({
      q: LT("Số thích hợp điền vào chỗ **?** là:\n" + fr(a, b) + " = {?/" + b * m + "}", "The number that fits in the **?** is:\n" + fr(a, b) + " = {?/" + b * m + "}"),
      parts: [num("", a * m)],
      steps: [st(LT("Mẫu số: " + b * m + " : " + b + " = " + m + ", nên mẫu số đã được nhân với " + m, "Denominator: " + b * m + " ÷ " + b + " = " + m + ", so the denominator was multiplied by " + m)), st(LT("Tử số cũng nhân với " + m + ": ? = " + a + " × " + m + " = " + a * m, "The numerator is multiplied by " + m + " too: ? = " + a + " × " + m + " = " + a * m), a * m)],
      diag: fpDiag(a, b, b * m),
      tip: LT("Xem mẫu số đã nhân với mấy, tử số cũng nhân với số đó.", "See what the denominator was multiplied by, and multiply the numerator by the same number.")
     });
     if (k < .7) return QQ({
      q: LT("Số thích hợp điền vào chỗ **?** là:\n" + fr(a, b) + " = {" + a * m + "/?}", "The number that fits in the **?** is:\n" + fr(a, b) + " = {" + a * m + "/?}"),
      parts: [num("", b * m)],
      steps: [st(LT("Tử số đã nhân với " + a * m + " : " + a + " = " + m, "The numerator was multiplied by " + a * m + " ÷ " + a + " = " + m)), st(LT("Mẫu số cũng nhân với " + m + ": ? = " + b + " × " + m + " = " + b * m, "The denominator is multiplied by " + m + " too: ? = " + b + " × " + m + " = " + b * m), b * m)],
      tip: LT("Xem tử số đã nhân với mấy, mẫu số cũng nhân với số đó.", "See what the numerator was multiplied by, and multiply the denominator by the same number.")
     });
     if (k < .85) {
      let rt = fr(a * m, b * m),
       o = r.shuffle([rt, fr(a * m, b), fr(a + m, b + m)]);
      return QQ({
       q: LT("Phân số nào **bằng** " + fr(a, b) + "?", "Which fraction is **equal** to " + fr(a, b) + "?"),
       parts: [chp(o, rt)],
       steps: [st(LT("Nhân cả tử và mẫu với cùng số " + m + ": " + fr(a, b) + " = " + fr(a * m, b * m), "Multiply both the numerator and the denominator by the same number " + m + ": " + fr(a, b) + " = " + fr(a * m, b * m)))],
       tip: LT("Cả tử số và mẫu số đều phải nhân với cùng một số.", "Both the numerator and the denominator must be multiplied by the same number.")
      })
     }
     return QQ({
      q: LT("Chia cả tử số và mẫu số của " + fr(a * m, b * m) + " cho **" + m + "**, được phân số nào?", "Divide both the numerator and the denominator of " + fr(a * m, b * m) + " by **" + m + "**. Which fraction do you get?"),
      parts: [Object.assign(frp(a, b), {
       exact: !0
      })],
      steps: [st(LT("Tử số: " + a * m + " : " + m + " = " + a + "; mẫu số: " + b * m + " : " + m + " = " + b, "Numerator: " + a * m + " ÷ " + m + " = " + a + "; denominator: " + b * m + " ÷ " + m + " = " + b)), st(fr(a * m, b * m) + " = " + fr(a, b))],
      tip: LT("Chia cả tử và mẫu cho " + m + ".", "Divide both the numerator and the denominator by " + m + ".")
     })
    }
    if (tier === 2) {
     let k = r.f(),
      p = fpPair(r, 1),
      a = p[0],
      b = p[1],
      m = rd(r, 3, 9);
     if (k < .3) {
      let c = b * m;
      return QQ({
       q: LT("Tìm số **?** thích hợp:\n" + fr(a, b) + " = {?/" + c + "}", "Find the number **?** that fits:\n" + fr(a, b) + " = {?/" + c + "}"),
       parts: [num("", a * m)],
       steps: [st(LT("Mẫu số: " + c + " : " + b + " = " + m + ", nên cả tử và mẫu nhân với " + m, "Denominator: " + c + " ÷ " + b + " = " + m + ", so both the numerator and the denominator are multiplied by " + m)), st("? = " + a + " × " + m + " = " + a * m, a * m)],
       diag: fpDiag(a, b, c),
       tip: LT("Tìm xem mẫu số nhân với mấy thì được " + c + ".", "Find what the denominator was multiplied by to get " + c + ".")
      })
     }
     if (k < .5) return QQ({
      q: LT("Tìm số **?** thích hợp:\n" + fr(a * m, b * m) + " = {" + a + "/?}", "Find the number **?** that fits:\n" + fr(a * m, b * m) + " = {" + a + "/?}"),
      parts: [num("", b)],
      steps: [st(LT("Tử số: " + a * m + " : " + a + " = " + m + ", nên cả tử và mẫu chia cho " + m, "Numerator: " + a * m + " ÷ " + a + " = " + m + ", so both the numerator and the denominator are divided by " + m)), st(LT("? = " + b * m + " : " + m + " = " + b, "? = " + b * m + " ÷ " + m + " = " + b), b)],
      tip: LT("Tìm xem tử số đã chia cho mấy.", "Find what the numerator was divided by.")
     });
     if (k < .68) {
      let c = b * m;
      return QQ({
       q: LT("Viết phân số bằng " + fr(a, b) + " và có **mẫu số là " + c + "**.", "Write a fraction equal to " + fr(a, b) + " that has **denominator " + c + "**."),
       parts: [Object.assign(frp(a * m, c), {
        exact: !0
       })],
       steps: [st(LT("Mẫu số: " + c + " : " + b + " = " + m + ", cả tử và mẫu nhân với " + m, "Denominator: " + c + " ÷ " + b + " = " + m + ", so both the numerator and the denominator are multiplied by " + m)), st(fr(a, b) + " = " + fr(a * m, c))],
       tip: LT("Tìm số cần nhân với mẫu số, rồi nhân tử số với số đó.", "Find the number to multiply the denominator by, then multiply the numerator by that number.")
      })
     }
     if (k < .84) {
      let m1 = rd(r, 2, 4),
       m2 = rd(r, m1 + 1, 6);
      return QQ({
       q: LT("Điền số thích hợp vào các chỗ **?**:\n" + fr(a, b) + " = {?/" + b * m1 + "} = {?/" + b * m2 + "}", "Fill in the numbers that fit in the **?** spots:\n" + fr(a, b) + " = {?/" + b * m1 + "} = {?/" + b * m2 + "}"),
       parts: [num(LT("Chỗ ? thứ nhất", "First ?"), a * m1), num(LT("Chỗ ? thứ hai", "Second ?"), a * m2)],
       steps: [st(LT(b * m1 + " : " + b + " = " + m1 + ", nên ? = " + a + " × " + m1 + " = " + a * m1, b * m1 + " ÷ " + b + " = " + m1 + ", so ? = " + a + " × " + m1 + " = " + a * m1), a * m1), st(LT(b * m2 + " : " + b + " = " + m2 + ", nên ? = " + a + " × " + m2 + " = " + a * m2, b * m2 + " ÷ " + b + " = " + m2 + ", so ? = " + a + " × " + m2 + " = " + a * m2), a * m2)],
       tip: LT("Làm từng phân số một: mẫu số nhân với mấy?", "Do one fraction at a time: what was the denominator multiplied by?")
      })
     }
     let m2 = m === 2 ? 3 : 2,
      right = [fr(a * m, b * m), fr(a * m2, b * m2)],
      wrong = fr(a * m, b * m + 1),
      o = r.shuffle(right.concat([wrong]));
     return QQ({
      q: LT("Phân số nào **không bằng** " + fr(a, b) + "?", "Which fraction is **not equal** to " + fr(a, b) + "?"),
      parts: [chp(o, wrong)],
      steps: [st(LT("Phân số bằng " + fr(a, b) + " phải có tử và mẫu cùng nhân với một số: tử số " + a + " × " + m + " = " + a * m + " thì mẫu số phải là " + b + " × " + m + " = " + b * m, "A fraction equal to " + fr(a, b) + " must have its numerator and denominator multiplied by the same number: numerator " + a + " × " + m + " = " + a * m + ", so the denominator must be " + b + " × " + m + " = " + b * m)), st(LT(fr(a * m, b * m + 1) + " có mẫu số là " + (b * m + 1) + ", không phải " + b * m + ", nên không bằng " + fr(a, b), fr(a * m, b * m + 1) + " has denominator " + (b * m + 1) + ", not " + b * m + ", so it is not equal to " + fr(a, b)))],
      tip: LT("Kiểm tra xem tử số và mẫu số nhân với cùng một số chưa.", "Check whether the numerator and the denominator were multiplied by the same number.")
     })
    }
    let k3 = r.f(),
     k = k3 < .15 ? 0 : k3 < .3 ? 1 : k3 < .65 ? 2 : 3,
     p = fpPair(r, 1),
     a = p[0],
     b = p[1];
    if (k === 0) {
     let m = rd(r, 4, 9),
      d = b * m;
     return QQ({
      q: LT("Tìm số **?** thích hợp:\n" + fr(a * m, d) + " = {" + a + "/?} = {?/" + b * 2 + "}", "Find the number **?** that fits:\n" + fr(a * m, d) + " = {" + a + "/?} = {?/" + b * 2 + "}"),
      parts: [num(LT("Chỗ ? thứ nhất", "First ?"), b), num(LT("Chỗ ? thứ hai", "Second ?"), a * 2)],
      steps: [st(LT("Chia cả tử và mẫu cho " + m + ": " + fr(a * m, d) + " = " + fr(a, b), "Divide both the numerator and the denominator by " + m + ": " + fr(a * m, d) + " = " + fr(a, b)), b), st(LT("Nhân cả tử và mẫu với 2: " + fr(a, b) + " = " + fr(a * 2, b * 2), "Multiply both the numerator and the denominator by 2: " + fr(a, b) + " = " + fr(a * 2, b * 2)), a * 2)],
      tip: LT("Chia trước để về phân số đơn giản, rồi nhân.", "Divide first to get the simpler fraction, then multiply.")
     })
    }
    if (k === 1) {
     let m = rd(r, 3, 6),
      pie = r.pick([LT("cái bánh", "cake"), LT("thanh sô-cô-la", "chocolate bar"), LT("quả dưa hấu", "watermelon")]);
     return QQ({
      q: LT("Bình ăn " + fr(a, b) + " " + pie + ". Nam có một " + pie + " cùng loại nhưng được chia thành **" + b * m + " phần bằng nhau**. Hỏi Nam phải ăn bao nhiêu phần (trong " + b * m + " phần đó) để ăn **bằng** Bình?", "Bình ate " + fr(a, b) + " of a " + pie + ". Nam has another " + pie + " of the same kind, but it is cut into **" + b * m + " equal parts**. How many of those " + b * m + " parts must Nam eat to eat **the same amount** as Bình?"),
      parts: [num("", a * m, LT("phần", "parts"))],
      steps: [st(LT("Cần phân số bằng " + fr(a, b) + " có mẫu số " + b * m + ": cả tử và mẫu nhân với " + m, "We need a fraction equal to " + fr(a, b) + " with denominator " + b * m + ": multiply both the numerator and the denominator by " + m)), st(LT("Tử số: " + a + " × " + m + " = " + a * m + " (phần)", "Numerator: " + a + " × " + m + " = " + a * m + " (parts)"), a * m)],
      diag: fpDiag(a, b, b * m),
      tip: LT("Tìm phân số bằng " + fr(a, b) + " có mẫu số " + b * m + ".", "Find a fraction equal to " + fr(a, b) + " with denominator " + b * m + ".")
     })
    }
    if (k === 2) {
     let m = rd(r, 3, 8),
      S = (a + b) * m;
     return QQ({
      q: LT("⭐ Thử thách: Tìm phân số bằng " + fr(a, b) + ", biết **tổng của tử số và mẫu số** là **" + S + "**.", "⭐ Challenge: Find a fraction equal to " + fr(a, b) + ", given that **the sum of the numerator and the denominator** is **" + S + "**."),
      parts: [Object.assign(frp(a * m, b * m), {
       exact: !0
      })],
      steps: [st(LT("Nếu nhân cả tử và mẫu với cùng một số thì tổng cũng gấp lên bấy nhiêu lần. Tổng ban đầu là " + a + " + " + b + " = " + (a + b) + ", tổng mới là " + S + " nên gấp " + S + " : " + (a + b) + " = " + m + " lần", "If we multiply both the numerator and the denominator by the same number, the sum gets that many times bigger. The original sum is " + a + " + " + b + " = " + (a + b) + " and the new sum is " + S + ", so it is " + S + " ÷ " + (a + b) + " = " + m + " times bigger")), st(LT("Phân số là " + fr(a * m, b * m), "The fraction is " + fr(a * m, b * m)))],
      tip: LT("Nếu nhân cả tử và mẫu với cùng một số thì tổng cũng gấp lên bấy nhiêu lần.", "If we multiply both the numerator and the denominator by the same number, the sum gets that many times bigger.")
     })
    }
    let m = rd(r, 3, 8),
     D = (b - a) * m;
    return QQ({
     q: LT("⭐ Thử thách: Tìm phân số bằng " + fr(a, b) + ", biết mẫu số **hơn** tử số **" + D + " đơn vị**.", "⭐ Challenge: Find a fraction equal to " + fr(a, b) + ", given that the denominator is **" + D + " more** than the numerator."),
     parts: [Object.assign(frp(a * m, b * m), {
      exact: !0
     })],
     steps: [st(LT("Ở " + fr(a, b) + " mẫu hơn tử " + (b - a) + ". Nhân cả tử và mẫu với cùng một số thì hiệu cũng gấp lên bấy nhiêu lần. Hiệu mới là " + D + " nên gấp " + D + " : " + (b - a) + " = " + m + " lần", "For " + fr(a, b) + ", the denominator is " + (b - a) + " more than the numerator. Multiply both by the same number and the difference gets that many times bigger. The new difference is " + D + ", so it is " + D + " ÷ " + (b - a) + " = " + m + " times bigger")), st(LT("Phân số là " + fr(a * m, b * m), "The fraction is " + fr(a * m, b * m)))],
     tip: LT("Nếu nhân cả tử và mẫu với cùng một số thì hiệu của chúng cũng gấp lên bấy nhiêu lần.", "If we multiply both the numerator and the denominator by the same number, their difference gets that many times bigger.")
    })
   }
  });
  /* ---------- fracof ---------- */
  function foBar(den, num2, N, unit) {
   let k = N / den,
    mk = w => ({
     rows: [{
      lab: "",
      segs: Array.from({
       length: den
      }, (_, i) => ({
       u: 1,
       c: i < num2 ? "orange" : "sky",
       t: w ? String(k) : ""
      }))
     }],
     notes: [{
      t: LT("Cả đoạn: " + N + (unit ? " " + unit : ""), "Whole segment: " + N + (unit ? " " + unit : ""))
     }]
    });
   return FB.bars([mk(0), mk(1)], {
    left: 16,
    right: 16,
    top: 20,
    rowH: 46,
    bottom: 36
   })
  }
  var FO_CTX = [
   (N, a, b, r) => { let c = r.pick(["4A", "4B", "4C"]); return [LT("Lớp " + c + " có **" + N + " học sinh**, trong đó " + fr(a, b) + " số học sinh là học sinh nữ. Hỏi lớp có bao nhiêu học sinh nữ?", "Class " + c + " has **" + N + " students**, and " + fr(a, b) + " of the students are girls. How many girls are in the class?"), LT("học sinh", "students"), LT("Bạn nữ", "Girls")] },
   (N, a, b) => [LT("Một cửa hàng có **" + N + " kg** gạo. Cửa hàng đã bán " + fr(a, b) + " số gạo đó. Hỏi cửa hàng đã bán bao nhiêu ki-lô-gam gạo?", "A store has **" + N + " kg** of rice. The store sold " + fr(a, b) + " of that rice. How many kilograms of rice did the store sell?"), "kg", LT("Gạo đã bán", "Rice sold")],
   (N, a, b) => [LT("Một sợi dây dài **" + N + " m**. Người ta cắt lấy " + fr(a, b) + " sợi dây. Hỏi đoạn dây cắt ra dài bao nhiêu mét?", "A rope is **" + N + " m** long. Someone cuts off " + fr(a, b) + " of the rope. How many meters long is the piece that was cut off?"), "m", LT("Đoạn dây cắt", "Piece cut off")],
   (N, a, b) => [LT("Trong vườn có **" + N + " cây** ăn quả, " + fr(a, b) + " số cây là cây cam. Hỏi vườn có bao nhiêu cây cam?", "A garden has **" + N + " fruit trees**, and " + fr(a, b) + " of the trees are orange trees. How many orange trees are in the garden?"), LT("cây", "trees"), LT("Cây cam", "Orange trees")],
   (N, a, b) => [LT("Mẹ mua **" + N + " quả trứng** và dùng " + fr(a, b) + " số trứng để làm bánh. Hỏi mẹ dùng bao nhiêu quả trứng?", "Mom buys **" + N + " eggs** and uses " + fr(a, b) + " of the eggs to bake a cake. How many eggs does Mom use?"), LT("quả", "eggs"), LT("Trứng đã dùng", "Eggs used")],
   (N, a, b) => [LT("Một bể có sức chứa **" + N + " lít**. Hiện nay trong bể có " + fr(a, b) + " sức chứa. Hỏi trong bể có bao nhiêu lít nước?", "A tank can hold **" + N + " liters**. Right now the tank is " + fr(a, b) + " full. How many liters of water are in the tank?"), LT("lít", "liters"), LT("Nước", "Water")],
   (N, a, b) => [LT("Lan có **" + N + " viên bi** và cho bạn " + fr(a, b) + " số bi. Hỏi Lan cho bạn bao nhiêu viên bi?", "Lan has **" + N + " marbles** and gives a friend " + fr(a, b) + " of them. How many marbles does Lan give to her friend?"), LT("viên", "marbles"), LT("Bi cho bạn", "Marbles given")],
   (N, a, b) => [LT("Quãng đường từ nhà đến chợ dài **" + N + " km**. Nam đã đi được " + fr(a, b) + " quãng đường. Hỏi Nam đã đi bao nhiêu ki-lô-mét?", "The distance from home to the market is **" + N + " km**. Nam has walked " + fr(a, b) + " of the distance. How many kilometers has Nam walked?"), "km", LT("Quãng đường đã đi", "Distance walked")]
  ];
  var FO_LEFT = [
   (N, a, b, r) => [LT("Một cửa hàng có **" + N + " kg** gạo. Buổi sáng đã bán " + fr(a, b) + " số gạo đó. Hỏi cửa hàng **còn lại** bao nhiêu ki-lô-gam gạo?", "A store has **" + N + " kg** of rice. In the morning it sold " + fr(a, b) + " of that rice. How many kilograms of rice are **left**?"), "kg"],
   (N, a, b) => [LT("Một tấm vải dài **" + N + " m**. Người ta đã dùng " + fr(a, b) + " tấm vải để may áo. Hỏi tấm vải **còn lại** bao nhiêu mét?", "A piece of fabric is **" + N + " m** long. " + fr(a, b) + " of the fabric was used to make a shirt. How many meters of fabric are **left**?"), "m"],
   (N, a, b) => [LT("Một rổ có **" + N + " quả** cam. Mẹ đã biếu bà " + fr(a, b) + " số cam. Hỏi trong rổ **còn lại** bao nhiêu quả cam?", "A basket has **" + N + " oranges**. Mom gave Grandma " + fr(a, b) + " of the oranges. How many oranges are **left** in the basket?"), LT("quả", "oranges")],
   (N, a, b) => [LT("Một bể có **" + N + " lít** nước. Người ta đã dùng " + fr(a, b) + " lượng nước trong bể. Hỏi trong bể **còn lại** bao nhiêu lít nước?", "A tank has **" + N + " liters** of water. " + fr(a, b) + " of the water in the tank was used. How many liters of water are **left** in the tank?"), LT("lít", "liters")],
   (N, a, b) => [LT("Trang có **" + N + " tờ** giấy màu. Trang đã dùng " + fr(a, b) + " số giấy để làm thiệp. Hỏi Trang **còn lại** bao nhiêu tờ giấy?", "Trang has **" + N + " sheets** of colored paper. Trang used " + fr(a, b) + " of the paper to make cards. How many sheets of paper does Trang have **left**?"), LT("tờ", "sheets")]
  ];

  function foAB(r, bs, amax) {
   let b = r.pick(bs),
    a = rd(r, 1, Math.min(b - 1, amax || 99));
   for (; gcd(a, b) > 1;) a = rd(r, 1, b - 1);
   return [a, b]
  }
  var foDiag = (k, N) => (vals, q) => {
   let e = V(vals, 0),
    ans = q.parts[0].ans;
   return e === k && e !== ans ? {
    kind: "quen_nhan",
    msg: LT("Con mới tìm một phần (chia cho mẫu số). Còn phải **nhân với tử số** nữa.", "You only found one part (dividing by the denominator). You still need to **multiply by the numerator**.")
   } : e === N - ans && N - ans > 0 && e !== ans ? {
    kind: "tru_con_lai",
    msg: LT("Con đã tìm phần còn lại. Đề hỏi phần **được lấy ra**, không phải phần còn lại.", "You found the part that is left. The question asks for the part that is **taken out**, not the part that is left.")
   } : null
  };
  LESSON({
   id: "fracof",
   reg: "ps",
   title: LT("Tìm phân số của một số", "Finding a Fraction of a Number"),
   short: LT("PS của một số", "Fraction of a number"),
   emoji: "🎯",
   blurb: LT("Tìm a/b của N: chia cho mẫu số rồi nhân với tử số", "Find a/b of N: divide by the denominator, then multiply by the numerator"),
   links: ["frac", "mul"],
   rule: {
    h: LT("Quy tắc", "Rule"),
    items: [LT("Muốn tìm {a/b} của số N, ta lấy N **chia cho mẫu số b** rồi **nhân với tử số a**: N : b × a.", "To find {a/b} of a number N, take N **divided by the denominator b**, then **multiply by the numerator a**: N ÷ b × a."), LT("Ví dụ: {2/5} của 30 là 30 : 5 × 2 = 12.", "Example: {2/5} of 30 is 30 ÷ 5 × 2 = 12."), LT("Tìm phần còn lại: lấy cả số **trừ** đi phần đã biết.", "To find the part that is left: take the whole number and **subtract** the part you already know.")]
   },
   figs: {
    a: () => FB.bars([{
     rows: [{
      lab: "",
      segs: [0, 1, 2, 3, 4].map(i => ({
       u: 1,
       c: "sky",
       t: ""
      }))
     }],
     notes: [{
      t: LT("Cả lớp: 30 học sinh", "Whole class: 30 students")
     }]
    }, {
     rows: [{
      lab: "",
      segs: [0, 1, 2, 3, 4].map(i => ({
       u: 1,
       c: "sky",
       t: "6"
      }))
     }],
     notes: [{
      t: LT("30 : 5 = 6 (học sinh mỗi phần)", "30 ÷ 5 = 6 (students in each part)")
     }]
    }, {
     rows: [{
      lab: "",
      segs: [0, 1, 2, 3, 4].map(i => ({
       u: 1,
       c: i < 2 ? "orange" : "sky",
       t: "6",
       over: i < 2 ? LT("nữ", "girls") : ""
      }))
     }],
     notes: [{
      t: LT("Nữ: 6 × 2 = 12 học sinh", "Girls: 6 × 2 = 12 students")
     }]
    }], {
     left: 16,
     right: 16,
     top: 34,
     rowH: 52,
     bottom: 38
    }),
    b: () => FB.frac([{
     tx: [{
      x: 62,
      y: 60,
      t: LT("Tìm", "Find"),
      s: 22
     }, {
      x: 238,
      y: 60,
      t: LT("của 24", "of 24"),
      s: 22
     }, {
      x: 180,
      y: 130,
      t: LT("24 : 8 × 3", "24 ÷ 8 × 3"),
      s: 34,
      c: "orange"
     }, {
      x: 180,
      y: 172,
      t: LT("chia cho mẫu số, nhân với tử số", "divide by the denominator, multiply by the numerator"),
      s: 17,
      c: "dark"
     }],
     fr: [{
      x: 140,
      y: 52,
      n: 3,
      d: 8,
      s: 30
     }]
    }, {
     tx: [{
      x: 180,
      y: 40,
      t: LT("3/8 của 24 kg gạo", "3/8 of 24 kg of rice"),
      s: 22
     }, {
      x: 180,
      y: 84,
      t: LT("24 : 8 = 3 (kg)", "24 ÷ 8 = 3 (kg)"),
      s: 26,
      c: "blue"
     }, {
      x: 180,
      y: 126,
      t: "3 × 3 = 9 (kg)",
      s: 26,
      c: "orange"
     }, {
      x: 180,
      y: 172,
      t: LT("Đáp số: 9 kg", "Answer: 9 kg"),
      s: 22,
      c: "okc"
     }]
    }], {
     h: 190
    }),
    c: () => FB.bars([{
     rows: [{
      lab: "",
      segs: [0, 1, 2, 3, 4].map(i => ({
       u: 1,
       c: i < 2 ? "orange" : "blue",
       t: "6",
       over: i === 0 ? LT("nữ", "girls") : i === 2 ? LT("nam", "boys") : ""
      }))
     }],
     notes: [{
      t: LT("Nữ: 12. Nam: 30 − 12 = 18 (học sinh)", "Girls: 12. Boys: 30 − 12 = 18 (students)")
     }]
    }, {
     rows: [{
      lab: "",
      segs: [0, 1, 2, 3, 4].map(i => ({
       u: 1,
       c: i < 2 ? "orange" : "blue",
       t: "6",
       over: i === 0 ? LT("nữ", "girls") : i === 2 ? LT("nam", "boys") : ""
      }))
     }],
     notes: [{
      t: LT("Nam: 3 phần → 6 × 3 = 18 (học sinh)", "Boys: 3 parts → 6 × 3 = 18 (students)")
     }]
    }], {
     left: 16,
     right: 16,
     top: 34,
     rowH: 52,
     bottom: 38
    })
   },
   teach: [{
    key: "a",
    f: 0,
    say: LT("Lớp 4A có **30 học sinh**, trong đó {2/5} số học sinh là nữ. Hỏi có bao nhiêu bạn nữ? Ta vẽ **sơ đồ đoạn thẳng** biểu thị cả lớp.", "Class 4A has **30 students**, and {2/5} of the students are girls. How many girls are there? We draw a **segment diagram** to show the whole class.")
   }, {
    key: "a",
    f: 1,
    say: LT("Mẫu số là 5: chia cả lớp thành **5 phần bằng nhau**. Mỗi phần có 30 : 5 = **6** học sinh.", "The denominator is 5: split the whole class into **5 equal parts**. Each part has 30 ÷ 5 = **6** students.")
   }, {
    key: "a",
    f: 2,
    say: LT("Tử số là 2: số nữ là **2 phần**. Vậy số bạn nữ là 6 × 2 = **12** học sinh.", "The numerator is 2: the girls are **2 parts**. So the number of girls is 6 × 2 = **12** students.")
   }, {
    key: "a",
    f: 2,
    say: LT("Cùng làm: muốn tìm {2/5} của 30, ta tính thế nào?", "Let's try: how do we find {2/5} of 30?"),
    ask: {
     opts: [LT("30 : 5 × 2", "30 ÷ 5 × 2"), LT("30 : 2 × 5", "30 ÷ 2 × 5"), "30 × 5 × 2"],
     ans: LT("30 : 5 × 2", "30 ÷ 5 × 2"),
     good: LT("Đúng! Chia cho mẫu số 5 rồi nhân với tử số 2.", "Correct! Divide by the denominator 5, then multiply by the numerator 2.")
    }
   }, {
    key: "b",
    f: 0,
    say: LT("**Muốn tìm {a/b} của N**: lấy N **chia cho mẫu số b** (tìm một phần), rồi **nhân với tử số a**.", "**To find {a/b} of N**: take N **divided by the denominator b** (to find one part), then **multiply by the numerator a**.")
   }, {
    key: "b",
    f: 1,
    say: LT("Ví dụ: cửa hàng có 24 kg gạo, bán {3/8} số gạo. Bán được 24 : 8 × 3 = 3 × 3 = **9 kg**.", "Example: a store has 24 kg of rice and sells {3/8} of it. It sells 24 ÷ 8 × 3 = 3 × 3 = **9 kg**.")
   }, {
    key: "c",
    f: 0,
    say: LT("Lớp có 12 bạn nữ. Hỏi có bao nhiêu bạn **nam**? Cách 1: lấy cả lớp **trừ** số nữ: 30 − 12 = **18** học sinh.", "The class has 12 girls. How many **boys** are there? Method 1: take the whole class and **subtract** the girls: 30 − 12 = **18** students.")
   }, {
    key: "c",
    f: 1,
    say: LT("Cách 2: số nam là 5 − 2 = 3 phần, tức {3/5} số học sinh: 30 : 5 × 3 = **18** học sinh. Hai cách cho cùng kết quả.", "Method 2: the boys are 5 − 2 = 3 parts, which is {3/5} of the students: 30 ÷ 5 × 3 = **18** students. Both ways give the same result.")
   }, {
    key: "c",
    f: 1,
    say: LT("Cùng làm: nếu {1/4} của 20 kg là 5 kg thì phần còn lại là bao nhiêu kg?", "Let's try: if {1/4} of 20 kg is 5 kg, how many kg are left?"),
    ask: {
     opts: ["15 kg", "5 kg", "25 kg"],
     ans: "15 kg",
     good: LT("Đúng! 20 − 5 = 15 (kg).", "Correct! 20 − 5 = 15 (kg).")
    }
   }],
   gen(tier, r) {
    if (tier === 1) {
     let k = r.f(),
      ab = foAB(r, [2, 3, 4, 5, 6], 5),
      a = ab[0],
      b = ab[1],
      u = rd(r, 2, 9),
      N = b * u;
     if (k < .3) {
      let o = rd(r, 1, 4) === 1 ? 1 : a;
      if (o === 1) {
       return QQ({
        q: LT("Tìm " + fr(1, b) + " của **" + N + "**.", "Find " + fr(1, b) + " of **" + N + "**."),
        parts: [num("", u)],
        steps: [st(LT("Tìm một phần: " + N + " : " + b + " = " + u, "Find one part: " + N + " ÷ " + b + " = " + u), u)],
        hintFig: {
         fb: foBar(b, 1, N, ""),
         f: 1
        },
        tip: LT("Chia " + N + " cho mẫu số " + b + ".", "Divide " + N + " by the denominator " + b + ".")
       })
      }
     }
     if (k < .55) return QQ({
      q: LT("Tìm " + fr(a, b) + " của **" + N + "**.", "Find " + fr(a, b) + " of **" + N + "**."),
      parts: [num("", u * a)],
      steps: [st(LT(N + " : " + b + " = " + u + " (một phần)", N + " ÷ " + b + " = " + u + " (one part)"), u), st(u + " × " + a + " = " + u * a, u * a)],
      hintFig: {
       fb: foBar(b, a, N, ""),
       f: 1
      },
      diag: DG.fracOf(u),
      tip: LT("Chia cho mẫu số, rồi nhân với tử số.", "Divide by the denominator, then multiply by the numerator.")
     });
     if (k < .85) {
      let c = r.pick(FO_CTX),
       t = c(N, a, b, r);
      return QQ({
       q: t[0],
       fig: {
        fb: foBar(b, a, N, t[1]),
        f: 0
       },
       parts: [num("", u * a, t[1])],
       steps: [st(LT("Chia thành " + b + " phần bằng nhau: " + N + " : " + b + " = " + u + " (" + t[1] + ")", "Split into " + b + " equal parts: " + N + " ÷ " + b + " = " + u + " (" + t[1] + ")"), u), st(t[2] + ": " + u + " × " + a + " = " + u * a + " (" + t[1] + ")", u * a)],
       diag: foDiag(u, N),
       tip: LT("Chia cho mẫu số " + b + " rồi nhân với tử số " + a + ".", "Divide by the denominator " + b + ", then multiply by the numerator " + a + ".")
      })
     }
     let D = LT(" : ", " ÷ "),
      ok = N + D + b + " × " + a,
      o = r.shuffle([ok, N + D + a + " × " + b, N + " × " + a + " × " + b]);
     return QQ({
      q: LT("Muốn tìm " + fr(a, b) + " của **" + N + "**, ta tính:", "To find " + fr(a, b) + " of **" + N + "**, we calculate:"),
      parts: [chp(o, ok)],
      steps: [st(LT("Chia cho mẫu số " + b + ", rồi nhân với tử số " + a + ": " + ok, "Divide by the denominator " + b + ", then multiply by the numerator " + a + ": " + ok))],
      tip: LT("Chia cho mẫu số, nhân với tử số.", "Divide by the denominator, multiply by the numerator.")
     })
    }
    if (tier === 2) {
     let k = r.f(),
      ab = foAB(r, [3, 4, 5, 6, 7, 8, 9, 10], 9),
      a = ab[0],
      b = ab[1],
      u = rd(r, 3, 12),
      N = b * u;
     if (k < .3) return QQ({
      q: LT("Tìm " + fr(a, b) + " của **" + N + "**.", "Find " + fr(a, b) + " of **" + N + "**."),
      parts: [num("", u * a)],
      steps: [st(LT(N + " : " + b + " = " + u + " (một phần)", N + " ÷ " + b + " = " + u + " (one part)"), u), st(u + " × " + a + " = " + u * a, u * a)],
      diag: foDiag(u, N),
      tip: LT("Chia cho mẫu số, rồi nhân với tử số.", "Divide by the denominator, then multiply by the numerator.")
     });
     if (k < .85) {
      let c = r.pick(FO_CTX),
       t = c(N, a, b, r);
      return QQ({
       q: t[0],
       fig: {
        fb: foBar(b, a, N, t[1]),
        f: 0
       },
       parts: [num("", u * a, t[1])],
       steps: [st(LT(N + " : " + b + " = " + u + " (" + t[1] + ")", N + " ÷ " + b + " = " + u + " (" + t[1] + ")"), u), st(u + " × " + a + " = " + u * a + " (" + t[1] + ")", u * a)],
       diag: foDiag(u, N),
       tip: LT("Chia cho mẫu số " + b + " rồi nhân với tử số " + a + ".", "Divide by the denominator " + b + ", then multiply by the numerator " + a + ".")
      })
     }
     let a2 = rd(r, 2, 4),
      b2 = a2 + rd(r, 1, 3),
      un = rd(r, 3, 10),
      N2 = b2 * un;
     for (; gcd(a2, b2) > 1;) b2++, N2 = b2 * un;
     return QQ({
      q: LT("Một thùng chứa **" + N2 + " lít** dầu. Người ta lấy ra " + fr(a2, b2) + " số dầu. Hỏi đã lấy ra bao nhiêu lít dầu?", "A drum holds **" + N2 + " liters** of oil. " + fr(a2, b2) + " of the oil is taken out. How many liters of oil were taken out?"),
      fig: {
       fb: foBar(b2, a2, N2, LT("lít", "liters")),
       f: 0
      },
      parts: [num("", un * a2, LT("lít", "liters"))],
      steps: [st(LT(N2 + " : " + b2 + " = " + un + " (lít)", N2 + " ÷ " + b2 + " = " + un + " (liters)"), un), st(LT(un + " × " + a2 + " = " + un * a2 + " (lít)", un + " × " + a2 + " = " + un * a2 + " (liters)"), un * a2)],
      diag: foDiag(un, N2),
      tip: LT("Chia cho mẫu số rồi nhân với tử số.", "Divide by the denominator, then multiply by the numerator.")
     })
    }
    let k = r.int(0, 4);
    if (k <= 1) {
     let ab = foAB(r, [3, 4, 5, 6, 8, 10], 9),
      a = ab[0],
      b = ab[1],
      u = rd(r, 3, 12),
      N = b * u,
      c = r.pick(FO_LEFT),
      t = c(N, a, b, r),
      g = u * a;
     return QQ({
      q: t[0],
      fig: {
       fb: foBar(b, a, N, t[1]),
       f: 0
      },
      parts: [num("", N - g, t[1])],
      steps: [st(LT("Phần đã lấy: " + N + " : " + b + " × " + a + " = " + g + " (" + t[1] + ")", "Part taken: " + N + " ÷ " + b + " × " + a + " = " + g + " (" + t[1] + ")"), g), st(LT("Còn lại: " + N + " − " + g + " = " + (N - g) + " (" + t[1] + ")", "Left over: " + N + " − " + g + " = " + (N - g) + " (" + t[1] + ")"), N - g)],
      diag: DG.any(DG.step([g], LT("Đó là phần đã lấy. Đề hỏi phần còn lại.", "That is the part taken. The question asks for the part left.")), DG.fracOf(u)),
      tip: LT("Tìm phần đã lấy trước, rồi lấy cả số trừ đi.", "Find the part taken first, then subtract it from the whole.")
     })
    }
    if (k === 2) {
     let b = r.pick([3, 4, 5]),
      d = r.pick([2, 3, 4]),
      a = rd(r, 1, b - 1),
      c = rd(r, 1, d - 1),
      mu = rd(r, 2, 4),
      N = b * d * mu;
     for (; gcd(a, b) > 1;) a = rd(r, 1, b - 1);
     for (; gcd(c, d) > 1;) c = rd(r, 1, d - 1);
     let n1 = N / b * a,
      n2 = n1 / d * c;
     return QQ({
      q: LT("Lớp 4A có **" + N + " học sinh**, trong đó " + fr(a, b) + " số học sinh là nữ. Trong số học sinh nữ, có " + fr(c, d) + " số bạn nữ đeo kính. Hỏi lớp có bao nhiêu bạn nữ **đeo kính**?", "Class 4A has **" + N + " students**, and " + fr(a, b) + " of the students are girls. Of the girls, " + fr(c, d) + " wear glasses. How many girls **wear glasses**?"),
      parts: [num("", n2, LT("học sinh", "students"))],
      steps: [st(LT("Số bạn nữ: " + N + " : " + b + " × " + a + " = " + n1 + " (học sinh)", "Number of girls: " + N + " ÷ " + b + " × " + a + " = " + n1 + " (students)"), n1), st(LT("Số bạn nữ đeo kính: " + n1 + " : " + d + " × " + c + " = " + n2 + " (học sinh)", "Number of girls with glasses: " + n1 + " ÷ " + d + " × " + c + " = " + n2 + " (students)"), n2)],
      diag: DG.any(DG.step([n1], LT("Đó là số bạn nữ. Đề hỏi số bạn nữ đeo kính, tìm tiếp " + fr(c, d) + " của số nữ.", "That is the number of girls. The question asks for the girls who wear glasses, so next find " + fr(c, d) + " of the girls."))),
      tip: LT("Tìm số bạn nữ trước, rồi tìm " + fr(c, d) + " của số bạn nữ.", "Find the number of girls first, then find " + fr(c, d) + " of the number of girls.")
     })
    }
    if (k === 3) {
     let pr = r.pick([
       [1, 2, 1, 4],
       [1, 3, 1, 4],
       [1, 2, 1, 3],
       [2, 5, 1, 4],
       [3, 8, 1, 4],
       [1, 3, 2, 5],
       [2, 3, 1, 6]
      ]),
      L = pr[1] * pr[3] / gcd(pr[1], pr[3]),
      N = L * rd(r, 1, 4),
      x = N / pr[1] * pr[0],
      y = N / pr[3] * pr[2];
     return QQ({
      q: LT("Quãng đường dài **" + N + " km**. Buổi sáng một người đi được " + fr(pr[0], pr[1]) + " quãng đường, buổi chiều đi được " + fr(pr[2], pr[3]) + " quãng đường. Hỏi người đó còn phải đi bao nhiêu ki-lô-mét nữa?", "The trip is **" + N + " km** long. In the morning, a person travels " + fr(pr[0], pr[1]) + " of the trip, and in the afternoon, the person travels " + fr(pr[2], pr[3]) + " of the trip. How many more kilometers does the person still have to travel?"),
      parts: [num("", N - x - y, "km")],
      steps: [st(LT("Buổi sáng: " + N + " : " + pr[1] + " × " + pr[0] + " = " + x + " (km)", "Morning: " + N + " ÷ " + pr[1] + " × " + pr[0] + " = " + x + " (km)"), x), st(LT("Buổi chiều: " + N + " : " + pr[3] + " × " + pr[2] + " = " + y + " (km)", "Afternoon: " + N + " ÷ " + pr[3] + " × " + pr[2] + " = " + y + " (km)"), y), st(LT("Còn lại: " + N + " − " + x + " − " + y + " = " + (N - x - y) + " (km)", "Left: " + N + " − " + x + " − " + y + " = " + (N - x - y) + " (km)"), N - x - y)],
      diag: DG.any(DG.step([x + y], LT("Đó là quãng đường đã đi. Đề hỏi quãng đường còn lại.", "That is the distance already traveled. The question asks for the distance left."))),
      tip: LT("Tìm quãng đường mỗi buổi, rồi lấy cả quãng đường trừ đi.", "Find the distance for each part of the day, then subtract from the whole trip.")
     })
    }
    let b = r.pick([3, 4, 5, 6]),
     d = r.pick([2, 3, 4]),
     a = rd(r, 1, b - 1),
     c = rd(r, 1, d - 1),
     mu = rd(r, 1, 3);
    for (; gcd(a, b) > 1;) a = rd(r, 1, b - 1);
    for (; gcd(c, d) > 1;) c = rd(r, 1, d - 1);
    let N = b * d * mu * rd(r, 2, 4),
     x = N / b * a,
     rest = N - x,
     y = rest / d * c,
     left = rest - y;
    return QQ({
     q: LT("⭐ Thử thách: Một cửa hàng có **" + N + " kg** gạo. Ngày đầu bán " + fr(a, b) + " số gạo. Ngày thứ hai bán " + fr(c, d) + " số gạo **còn lại**. Hỏi cửa hàng còn lại bao nhiêu ki-lô-gam gạo?", "⭐ Challenge: A store has **" + N + " kg** of rice. On the first day it sold " + fr(a, b) + " of the rice. On the second day it sold " + fr(c, d) + " of the rice **that was left**. How many kilograms of rice does the store have left?"),
     parts: [num("", left, "kg")],
     steps: [st(LT("Ngày đầu bán: " + N + " : " + b + " × " + a + " = " + x + " (kg)", "First day: " + N + " ÷ " + b + " × " + a + " = " + x + " (kg)"), x), st(LT("Sau ngày đầu còn: " + N + " − " + x + " = " + rest + " (kg)", "Left after the first day: " + N + " − " + x + " = " + rest + " (kg)"), rest), st(LT("Ngày thứ hai bán: " + rest + " : " + d + " × " + c + " = " + y + " (kg)", "Second day: " + rest + " ÷ " + d + " × " + c + " = " + y + " (kg)"), y), st(LT("Còn lại: " + rest + " − " + y + " = " + left + " (kg)", "Left: " + rest + " − " + y + " = " + left + " (kg)"), left)],
     diag: DG.any(DG.step([x], LT("Đó là số gạo bán ngày đầu. Đề hỏi số gạo còn lại sau hai ngày.", "That is the rice sold on the first day. The question asks for the rice left after two days.")), DG.step([rest], LT("Đó là số gạo còn lại sau ngày đầu. Ngày thứ hai còn bán thêm.", "That is the rice left after the first day. More is sold on the second day.")), DG.step([N - x - N / d * c], LT(fr(c, d) + " là của số gạo **còn lại** sau ngày đầu, không phải của cả " + N + " kg.", fr(c, d) + " is of the rice **left** after the first day, not of the whole " + N + " kg."))),
     tip: LT("Tìm số gạo còn lại sau ngày đầu trước, rồi mới tìm " + fr(c, d) + " của số đó.", "Find the rice left after the first day first, then find " + fr(c, d) + " of that amount.")
    })
   }
  });
  /* ===== new_so.js: bài "cmpnum" và "x10" (vùng so) ===== */
  KIND_NAME.so0 = LT("Nhầm số chữ số 0 khi nhân, chia với 10, 100, 1 000", "Mixing up the number of zeros when multiplying or dividing by 10, 100, 1,000");
  KIND_NAME.nguoc = LT("Xếp ngược thứ tự", "Putting the order backwards");
  var SO_TT = LT("⭐ Thử thách: ", "⭐ Challenge: "),
   fmtS = s => String(s).replace(/\s/g, "").split("").reverse().join("").replace(/(.{3})(?=.)/g, "$1" + (window.LANG === "en" ? "," : NB)).split("").reverse().join("");
  FB.cmpx = function(a, b, specs) {
   let sa = String(a),
    sb = String(b),
    n = Math.max(sa.length, sb.length),
    cw = Math.min(38, Math.floor(270 / n)),
    bw = cw * n + 50,
    x0 = (360 - bw) / 2 + 50;
   return {
    frames: specs.map(sp => {
     let els = [];
     return [sa, sb].forEach((s, ri) => {
      let y = ri ? 112 : 44;
      for (let i = 0; i < n; i++) {
       let di = i - (n - s.length),
        x = x0 + i * cw,
        hi = (sp.hi || []).indexOf(i) >= 0,
        eq = (sp.eq || []).indexOf(i) >= 0,
        fill = hi ? "yellow" : eq ? "mint" : "white";
       di < 0 ? els.push(E.rect("r" + ri + "c" + i, x + 2, y, cw - 4, 54, hi ? "yellow" : "none", {
        rx: 8,
        dash: "5 4",
        stroke: "dark",
        op: .6
       })) : (els.push(E.rect("r" + ri + "c" + i, x + 2, y, cw - 4, 54, fill, {
        rx: 8
       })), els.push(E.text("r" + ri + "d" + i, x + cw / 2, y + 38, s[di], 30, "ink")))
      }
     }), sp.sign && els.push(E.text("sg", x0 - 26, 120, sp.sign, 40, "orange")), sp.note && els.push(E.text("note", 180, 198, sp.note, 21, "ink")), sp.note2 && els.push(E.text("note2", 180, 224, sp.note2, 18, "dark")), els
    }),
    vb: [360, 238]
   }
  };
  FB.x10 = function(n, k, op) {
   let sn = String(n),
    len = sn.length,
    tot = op === "mul" ? len + k : len,
    cw = Math.min(44, Math.floor(320 / tot)),
    x0 = (360 - cw * tot) / 2,
    p = Math.pow(10, k),
    title = fmt(n) + (op === "mul" ? " × " : LT(" : ", " ÷ ")) + fmt(p),
    res = op === "mul" ? n * p : n / p,
    frames = [];
   for (let j = 0; j <= k; j++) {
    let els = [E.text("ttl", 180, 32, title, 24, "blue")];
    for (let i = 0; i < tot; i++) {
     let x = x0 + i * cw,
      isAdd = op === "mul" && i >= len,
      z = i - len;
     if (op === "mul") {
      isAdd ? z < j ? (els.push(E.rect("b" + i, x + 2, 52, cw - 4, 52, "sun", {
       rx: 8
      })), els.push(E.text("d" + i, x + cw / 2, 90, "0", 32, "orange"))) : els.push(E.rect("b" + i, x + 2, 52, cw - 4, 52, "none", {
       rx: 8,
       dash: "5 4",
       stroke: "dark",
       op: .5
      })) : (els.push(E.rect("b" + i, x + 2, 52, cw - 4, 52, "white", {
       rx: 8
      })), els.push(E.text("d" + i, x + cw / 2, 90, sn[i], 32, "ink")))
     } else {
      let cut = i >= len - j;
      els.push(E.rect("b" + i, x + 2, 52, cw - 4, 52, cut ? "rose" : "white", {
       rx: 8,
       op: cut ? .6 : 1
      })), els.push(E.text("d" + i, x + cw / 2, 90, sn[i], 32, cut ? "red" : "ink", {
       op: cut ? .8 : 1
      })), cut && els.push(E.line("x" + i, x + 6, 98, x + cw - 6, 58, "red", {
       sw: 3
      }))
     }
    }
    els.push(E.text("note", 180, 138, LT(j === 0 ? "Số ban đầu" : (op === "mul" ? "Thêm " : "Bỏ bớt ") + j + " chữ số 0", j === 0 ? "Starting number" : (op === "mul" ? "Add " : "Remove ") + j + (j === 1 ? " zero" : " zeros")), 21, "ink")), j === k && els.push(E.text("res", 180, 172, title + " = " + fmt(res), 22, "okc")), frames.push(els)
   }
   return {
    frames,
    vb: [360, 188]
   }
  };
  FB.x10rule = function() {
   let els = [E.text("h", 180, 30, LT("Số chữ số 0 của 10, 100, 1 000", "Number of zeros in 10, 100, 1,000"), 20, "blue")];
   [
    ["10", LT("1 chữ số 0", "1 zero"), "blue"],
    ["100", LT("2 chữ số 0", "2 zeros"), "pink"],
    [LT("1 000", "1,000"), LT("3 chữ số 0", "3 zeros"), "green"]
   ].forEach((r, i) => {
    let y = 76 + i * 44;
    els.push(E.rect("rb" + i, 40, y - 28, 280, 38, "white", {
     rx: 10
    })), els.push(E.text("rl" + i, 120, y, r[0], 24, r[2], {
     anchor: "end"
    })), els.push(E.text("ra" + i, 134, y, "→", 24, "ink")), els.push(E.text("rr" + i, 160, y, r[1], 22, "ink", {
     anchor: "start"
    }))
   });
   return els.push(E.text("n1", 180, 206, LT("Nhân: thêm bấy nhiêu chữ số 0", "Multiply: add that many zeros"), 20, "orange")), els.push(E.text("n2", 180, 234, LT("Chia: bỏ bớt bấy nhiêu chữ số 0", "Divide: remove that many zeros"), 20, "red")), {
    frames: [els],
    vb: [360, 248]
   }
  };

  /* ---------- helpers cmpnum ---------- */
  var cmpS = (a, b) => a > b ? ">" : a < b ? "<" : "=",
   cmpOpts = () => [">", "<", "="],
   firstDiff = (A, B) => {
    for (let i = 0; i < A.length; i++)
     if (A[i] !== B[i]) return i;
    return -1
   },
   genDigits = (r, n, first) => {
    if (n <= 0) return "";
    let s = "" + (first === 0 ? rd(r, 0, 9) : first || rd(r, 1, 9));
    for (; s.length < n;) s += rd(r, 0, 9);
    return s
   },
   cmpMakeQ = (a, b) => {
    let A = String(a),
     B = String(b),
     sg = cmpS(a, b),
     st_ = [],
     spec;
    if (A.length !== B.length) {
     let big = A.length > B.length ? a : b;
     st_.push(st(LT("Số " + fmt(a) + " có " + A.length + " chữ số, số " + fmt(b) + " có " + B.length + " chữ số.", "The number " + fmt(a) + " has " + A.length + " digits, and the number " + fmt(b) + " has " + B.length + " digits."))), st_.push(st(LT("Số nào có nhiều chữ số hơn thì lớn hơn, nên " + fmt(a) + " " + sg + " " + fmt(b) + ".", "The number with more digits is greater, so " + fmt(a) + " " + sg + " " + fmt(b) + ".")));
     let n = Math.max(A.length, B.length);
     spec = {
      hi: [0],
      note: LT("Hai số có số chữ số khác nhau", "Different number of digits")
     }
    } else if (A === B) {
     let n = A.length;
     st_.push(st(LT("Hai số cùng có " + n + " chữ số, ta so từng hàng từ trái sang phải.", "The two numbers both have " + n + " digits, so we compare place by place from left to right."))), st_.push(st(LT("Mọi hàng đều giống nhau, nên hai số bằng nhau: " + fmt(a) + " = " + fmt(b) + ".", "Every place is the same, so the two numbers are equal: " + fmt(a) + " = " + fmt(b) + "."))), spec = {
      eq: A.split("").map((_, z) => z),
      note: LT("Mọi hàng đều giống nhau", "Every place is the same")
     }
    } else {
     let i = firstDiff(A, B),
      n = A.length,
      h = HANG[n - 1 - i],
      eqc = [];
     for (let z = 0; z < i; z++) eqc.push(z);
     st_.push(st(LT("Hai số cùng có " + n + " chữ số, ta so từng hàng từ trái sang phải.", "The two numbers both have " + n + " digits, so we compare place by place from left to right."))), st_.push(st(i === 0 ? LT("Hai chữ số ở hàng " + HANG[n - 1] + " là " + A[0] + " và " + B[0] + ", khác nhau.", "The digits in the " + HANG[n - 1] + " place are " + A[0] + " and " + B[0] + ", which are different.") : LT("Các hàng đầu giống nhau. Đến hàng " + h + ": " + A[i] + " và " + B[i] + ", khác nhau.", "The first places are the same. In the " + h + " place, the digits are " + A[i] + " and " + B[i] + ", which are different."))), st_.push(st(LT(A[i] + (A[i] > B[i] ? " > " : " < ") + B[i] + " nên " + fmt(a) + " " + sg + " " + fmt(b) + ".", A[i] + (A[i] > B[i] ? " > " : " < ") + B[i] + ", so " + fmt(a) + " " + sg + " " + fmt(b) + "."))), spec = {
      eq: eqc,
      hi: [i],
      note: LT("So từng hàng từ trái sang phải", "Compare left to right")
     }
    }
    return QQ({
     q: LT("Điền dấu >, <, = vào chỗ chấm: **" + fmt(a) + " … " + fmt(b) + "**", "Fill in the blank with >, <, or =: **" + fmt(a) + " … " + fmt(b) + "**"),
     parts: [chp(cmpOpts(), sg)],
     steps: st_,
     tip: LT("Đếm số chữ số trước. Nếu bằng nhau thì so từng hàng từ trái sang phải.", "Count the digits first. If the numbers have the same number of digits, compare place by place from left to right."),
     hintFig: {
      fb: FB.cmpx(a, b, [spec]),
      f: 0
     }
    })
   },
   distinctNums = (r, cnt, mk) => {
    let o = [],
     g = 0;
    for (; o.length < cnt && g++ < 200;) {
     let v = mk();
     o.indexOf(v) < 0 && o.push(v)
    }
    return o
   },
   ordQ = (r, nums, asc, ctx) => {
    let s = nums.slice().sort((x, y) => asc ? x - y : y - x),
     names = asc ? [LT("Số bé nhất", "Smallest"), LT("Số thứ hai", "Second"), LT("Số thứ ba", "Third"), LT("Số lớn nhất", "Largest")] : [LT("Số lớn nhất", "Largest"), LT("Số thứ hai", "Second"), LT("Số thứ ba", "Third"), LT("Số bé nhất", "Smallest")];
    nums.length === 3 && (names = asc ? [LT("Số bé nhất", "Smallest"), LT("Số ở giữa", "Middle"), LT("Số lớn nhất", "Largest")] : [LT("Số lớn nhất", "Largest"), LT("Số ở giữa", "Middle"), LT("Số bé nhất", "Smallest")]);
    let cs = s.map(fmt).join(asc ? " < " : " > ");
    return QQ({
     q: LT((ctx || "") + "Xếp các số **" + nums.map(fmt).join("; ") + "** theo thứ tự từ **" + (asc ? "bé đến lớn" : "lớn đến bé") + "**.", (ctx || "") + "Put the numbers **" + nums.map(fmt).join("; ") + "** in order from **" + (asc ? "smallest to largest" : "largest to smallest") + "**."),
     parts: s.map((v, i) => num(names[i], v)),
     steps: [st(LT("So sánh các số: số có nhiều chữ số hơn thì lớn hơn; cùng số chữ số thì so từng hàng từ trái sang phải.", "Compare the numbers: the number with more digits is greater; if they have the same number of digits, compare place by place from left to right.")), st(LT("Tìm số " + (asc ? "bé nhất" : "lớn nhất") + " trước, rồi lần lượt các số còn lại.", "Find the " + (asc ? "smallest" : "largest") + " number first, then the rest one by one.")), st(LT("Thứ tự " + (asc ? "từ bé đến lớn" : "từ lớn đến bé") + ": " + cs, "Order from " + (asc ? "smallest to largest" : "largest to smallest") + ": " + cs), s[s.length - 1])],
     tip: asc ? LT("Tìm số bé nhất trước, rồi đến số bé nhì...", "Find the smallest number first, then the second smallest...") : LT("Tìm số lớn nhất trước, rồi đến số lớn nhì...", "Find the largest number first, then the second largest..."),
     diag: (vals, q) => {
      let e = q.parts.map((_, i) => V(vals, i)),
       a = q.parts.map(p => p.ans);
      return e.every((x, i) => x === a[a.length - 1 - i]) && !e.every((x, i) => x === a[i]) ? {
       kind: "nguoc",
       msg: LT("Con xếp ngược thứ tự rồi. Đọc lại đề: từ " + (asc ? "bé đến lớn" : "lớn đến bé") + ".", "You put them in the opposite order. Read the problem again: from " + (asc ? "smallest to largest" : "largest to smallest") + ".")
      } : null
     }
    })
   };

  function digStr(sa, pos, d) {
   return sa.slice(0, pos) + d + sa.slice(pos + 1)
  }
  var CMP_GENS = {
   diffLen(r, la) {
    let lb = la + r.pick([-1, 1, -2, 2]);
    lb < 3 && (lb = la + 1);
    let a = +genDigits(r, la),
     b = +genDigits(r, lb);
    return cmpMakeQ(a, b)
   },
   sameLen(r, n, pmin, pmax) {
    let p = rd(r, pmin, pmax),
     pre = genDigits(r, p),
     d1 = rd(r, p ? 0 : 1, 9),
     d2 = rd(r, p ? 0 : 1, 9);
    for (; d2 === d1;) d2 = rd(r, p ? 0 : 1, 9);
    let a = +(pre + d1 + genDigits(r, n - p - 1, 0)).slice(0, n),
     b = +(pre + d2 + genDigits(r, n - p - 1, 0)).slice(0, n);
    return cmpMakeQ(a, r.chance(.15) ? a : b)
   },
   pick3(r, nd, big) {
    let nums = distinctNums(r, 3, () => +genDigits(r, nd)),
     v = big ? Math.max.apply(null, nums) : Math.min.apply(null, nums),
     s = nums.slice().sort((x, y) => big ? y - x : x - y);
    return QQ({
     q: LT("Trong các số **" + nums.map(fmt).join("; ") + "**, số nào " + (big ? "**lớn nhất**" : "**bé nhất**") + "?", "Among the numbers **" + nums.map(fmt).join("; ") + "**, which one is the " + (big ? "**largest**" : "**smallest**") + "?"),
     parts: [chp(nums.map(fmt), fmt(v))],
     steps: [st(LT("So sánh từng cặp số: số có nhiều chữ số hơn thì lớn hơn; cùng số chữ số thì so từng hàng từ trái sang phải.", "Compare the numbers two at a time: the number with more digits is greater; if they have the same number of digits, compare place by place from left to right.")), st(LT("Sắp xếp " + (big ? "từ lớn đến bé" : "từ bé đến lớn") + ": " + s.map(fmt).join(big ? " > " : " < ") + ". Số " + (big ? "lớn nhất" : "bé nhất") + " là " + fmt(v) + ".", "Arrange them " + (big ? "from largest to smallest" : "from smallest to largest") + ": " + s.map(fmt).join(big ? " > " : " < ") + ". The " + (big ? "largest" : "smallest") + " number is " + fmt(v) + "."))],
     tip: LT("So số chữ số trước, rồi so từng hàng từ trái sang phải.", "Compare the number of digits first, then compare place by place from left to right.")
    })
   }
  };
  LESSON({
   id: "cmpnum",
   reg: "so",
   title: LT("So sánh các số", "Comparing Numbers"),
   emoji: "⚖️",
   blurb: LT("So sánh, xếp thứ tự các số nhiều chữ số", "Compare and order numbers with many digits"),
   links: ["place"],
   rule: {
    h: LT("Quy tắc", "Rules"),
    items: [LT("Số có **nhiều chữ số hơn** thì **lớn hơn**.", "A number with **more digits** is **greater**."), LT("Hai số **cùng số chữ số**: so từng hàng **từ trái sang phải**; gặp hàng đầu tiên có chữ số khác nhau, chữ số nào lớn hơn thì số đó lớn hơn. Mọi hàng đều giống nhau thì hai số **bằng nhau**.", "Two numbers with the **same number of digits**: compare place by place **from left to right**. At the first place where the digits are different, the number with the bigger digit is greater. If every place is the same, the two numbers are **equal**."), LT("Trên tia số, số **bé** ở bên **trái**, số **lớn** ở bên **phải**.", "On a number line, the **smaller** number is on the **left** and the **greater** number is on the **right**.")]
   },
   figs: {
    a: () => FB.cmpx(45678, 123456, [{
     note: LT("Đếm số chữ số của mỗi số", "Count the digits in each number")
    }, {
     hi: [0],
     note: LT("5 chữ số  và  6 chữ số", "5 digits  and  6 digits"),
     note2: LT("Số 123 456 có nhiều chữ số hơn", "123,456 has more digits")
    }, {
     hi: [0],
     sign: "<",
     note: LT("45 678 < 123 456", "45,678 < 123,456")
    }]),
    b: () => FB.cmpx(7281, 7259, [{
     note: LT("Cùng 4 chữ số: so từ trái sang phải", "Both 4 digits: left to right")
    }, {
     eq: [0, 1],
     note: LT("7 = 7  và  2 = 2", "7 = 7  and  2 = 2"),
     note2: LT("Giống nhau, so tiếp hàng sau", "Same, so check the next place")
    }, {
     eq: [0, 1],
     hi: [2],
     sign: ">",
     note: LT("Hàng chục: 8 > 5", "Tens place: 8 > 5"),
     note2: LT("Vậy 7 281 > 7 259", "So 7,281 > 7,259")
    }]),
    c: () => FB.nline({
     min: 0,
     max: 4000,
     tick: 500,
     big: 2,
     h: 192,
     noteY: 172
    }, [{
     labels: [0, 1000, 2000, 3000, 4000].map(v => ({
      v,
      t: fmt(v),
      s: 14,
      c: "dark"
     })),
     marks: [{
      v: 3480,
      t: LT("3 480", "3,480"),
      c: "pink",
      s: 15
     }, {
      v: 1250,
      t: LT("1 250", "1,250"),
      c: "orange",
      s: 15
     }, {
      v: 2075,
      t: LT("2 075", "2,075"),
      c: "blue",
      s: 15
     }],
     note: LT("Số nào bé nhất? Số nào lớn nhất?", "Smallest? Largest?")
    }, {
     labels: [0, 1000, 2000, 3000, 4000].map(v => ({
      v,
      t: fmt(v),
      s: 14,
      c: "dark"
     })),
     marks: [{
      v: 3480,
      t: LT("3 480", "3,480"),
      c: "pink",
      s: 15
     }, {
      v: 1250,
      t: LT("1 250", "1,250"),
      c: "orange",
      s: 15
     }, {
      v: 2075,
      t: LT("2 075", "2,075"),
      c: "blue",
      s: 15
     }],
     note: LT("1 250 < 2 075 < 3 480", "1,250 < 2,075 < 3,480")
    }]),
    d: () => FB.nline({
     min: 452000,
     max: 453000,
     tick: 100,
     big: 5,
     h: 192,
     noteY: 172,
     x0: 62,
     x1: 298
    }, [{
     labels: [],
     marks: [{
      v: 452300,
      t: LT("452 300", "452,300"),
      c: "orange",
      s: 17
     }],
     note: LT("Số tròn nghìn gần nhất ở hai bên?", "Round thousands on each side?")
    }, {
     labels: [{
      v: 452000,
      t: LT("452 000", "452,000"),
      s: 16
     }, {
      v: 453000,
      t: LT("453 000", "453,000"),
      s: 16
     }],
     marks: [{
      v: 452300,
      t: LT("452 300", "452,300"),
      c: "orange",
      s: 17
     }],
     note: LT("452 000 < 452 300 < 453 000", "452,000 < 452,300 < 453,000")
    }])
   },
   teach: [{
    key: "a",
    f: 0,
    say: LT("Muốn so sánh **45 678** và **123 456**, ta đếm xem mỗi số có bao nhiêu **chữ số** trước.", "To compare **45,678** and **123,456**, we first count how many **digits** each number has.")
   }, {
    key: "a",
    f: 2,
    say: LT("45 678 có **5** chữ số, 123 456 có **6** chữ số. Số nào có **nhiều chữ số hơn** thì **lớn hơn**. Vậy 45 678 **<** 123 456.\nCùng làm: **9 876** và **10 234**, số nào lớn hơn?", "45,678 has **5** digits and 123,456 has **6** digits. The number with **more digits** is **greater**. So 45,678 **<** 123,456.\nLet's try one: **9,876** and **10,234**. Which number is greater?"),
    ask: {
     opts: [LT("9 876", "9,876"), LT("10 234", "10,234")],
     ans: LT("10 234", "10,234"),
     good: LT("Đúng! 10 234 có 5 chữ số, nhiều hơn 4 chữ số của 9 876.", "Correct! 10,234 has 5 digits, which is more than the 4 digits of 9,876.")
    }
   }, {
    key: "b",
    f: 0,
    say: LT("Hai số **7 281** và **7 259** cùng có 4 chữ số. Ta so từng hàng **từ trái sang phải**, bắt đầu từ hàng nghìn.", "The numbers **7,281** and **7,259** both have 4 digits. We compare place by place **from left to right**, starting with the thousands place.")
   }, {
    key: "b",
    f: 1,
    say: LT("Hàng nghìn: 7 = 7. Hàng trăm: 2 = 2. Hai hàng này **giống nhau**, ta so tiếp hàng sau.", "Thousands place: 7 = 7. Hundreds place: 2 = 2. These two places are the **same**, so we compare the next place.")
   }, {
    key: "b",
    f: 2,
    say: LT("Hàng chục: **8 > 5**. Gặp chữ số khác nhau đầu tiên rồi nên dừng lại: 7 281 **>** 7 259.\nCùng làm: **5 346** và **5 382** giống nhau đến hàng trăm, hàng chục là 4 và 8. Số nào lớn hơn?", "Tens place: **8 > 5**. We found the first different digits, so we stop: 7,281 **>** 7,259.\nLet's try one: **5,346** and **5,382** are the same up to the hundreds place, and the tens digits are 4 and 8. Which number is greater?"),
    ask: {
     opts: [LT("5 346", "5,346"), LT("5 382", "5,382")],
     ans: LT("5 382", "5,382"),
     good: LT("Đúng! 8 chục lớn hơn 4 chục nên 5 382 > 5 346.", "Correct! 8 tens is more than 4 tens, so 5,382 > 5,346.")
    }
   }, {
    key: "c",
    f: 1,
    say: LT("Xếp **1 250; 2 075; 3 480** từ bé đến lớn: trên tia số, số **bé ở bên trái**, số **lớn ở bên phải**. Đọc từ trái sang phải: **1 250 < 2 075 < 3 480**.", "Let's put **1,250; 2,075; 3,480** in order from smallest to largest. On the number line, the **smaller number is on the left** and the **greater number is on the right**. Reading from left to right: **1,250 < 2,075 < 3,480**.")
   }, {
    key: "d",
    f: 0,
    say: LT("Số **tròn nghìn liền trước** và **liền sau** của **452 300**: là hai số tròn nghìn gần nó nhất, một số bé hơn và một số lớn hơn.", "The round thousand **just below** and **just above** **452,300** are the two round thousands closest to it, one smaller and one greater.")
   }, {
    key: "d",
    f: 1,
    say: LT("452 300 nằm giữa **452 000** và **453 000**. Vậy số tròn nghìn liền trước là 452 000, liền sau là 453 000.", "452,300 is between **452,000** and **453,000**. So the round thousand just below is 452,000, and the one just above is 453,000.")
   }],
   gen(tier, r) {
    if (tier === 1) {
     let k = rd(r, 0, 3);
     return k === 0 ? CMP_GENS.diffLen(r, rd(r, 3, 5)) : k === 1 ? CMP_GENS.sameLen(r, rd(r, 4, 5), 0, 1) : CMP_GENS.pick3(r, rd(r, 4, 5), k === 2)
    }
    if (tier === 2) {
     let k = rd(r, 0, 4);
     if (k === 0) return CMP_GENS.sameLen(r, rd(r, 6, 7), 2, 4);
     if (k === 1) {
      let a = rd(r, 1, 9),
       b = rd(r, 1, 9),
       c = rd(r, 1, 9),
       A = a * 1e6 + b * 1e5 + c * 1e3,
       sg = r.pick([">", "<", "="]),
       B = sg === "=" ? A : sg === ">" ? A - r.pick([1e3, 1e4, 1e5]) * rd(r, 1, 2) : A + r.pick([1e3, 1e4, 1e5]) * rd(r, 1, 2);
      return B < 1e6 && (B = A + 1e4, sg = "<"), QQ({
       q: LT("Điền dấu >, <, = vào chỗ chấm: **" + fmt(a * 1e6) + " + " + fmt(b * 1e5) + " + " + fmt(c * 1e3) + " … " + fmt(B) + "**", "Fill in the blank with >, <, or =: **" + fmt(a * 1e6) + " + " + fmt(b * 1e5) + " + " + fmt(c * 1e3) + " … " + fmt(B) + "**"),
       parts: [chp(cmpOpts(), cmpS(A, B))],
       steps: [st(LT("Viết tổng thành một số: " + fmt(a * 1e6) + " + " + fmt(b * 1e5) + " + " + fmt(c * 1e3) + " = " + fmt(A), "Write the sum as one number: " + fmt(a * 1e6) + " + " + fmt(b * 1e5) + " + " + fmt(c * 1e3) + " = " + fmt(A)), A), st(LT("So sánh " + fmt(A) + " với " + fmt(B) + ": so từng hàng từ trái sang phải.", "Compare " + fmt(A) + " with " + fmt(B) + ": compare place by place from left to right.")), st(fmt(A) + " " + cmpS(A, B) + " " + fmt(B) + ".")],
       tip: LT("Tính tổng trước để được một số, rồi mới so sánh.", "Work out the sum first to get one number, then compare.")
      })
     }
     if (k === 2) {
      let nd = rd(r, 4, 6),
       pre = genDigits(r, 2),
       nums = distinctNums(r, 3, () => +(pre + genDigits(r, nd - 2, 0)));
      return ordQ(r, nums, r.chance(.5))
     }
     if (k === 3) {
      let u = r.pick([100, 1000]),
       n = rd(r, 20000, 899999);
      n % u === 0 && n++, n % u === 0 && n++;
      let lo = Math.floor(n / u) * u,
       hi = lo + u,
       nm = LT(u === 1000 ? "nghìn" : "trăm", u === 1000 ? "thousand" : "hundred");
      return QQ({
       q: LT("Tìm số tròn " + nm + " **liền trước** và **liền sau** của số **" + fmt(n) + "** (số tròn " + nm + " gần nó nhất, một số bé hơn và một số lớn hơn).", "Find the round " + nm + " **just below** and **just above** the number **" + fmt(n) + "** (the nearest round " + nm + "s, one smaller and one greater)."),
       parts: [num(LT("Liền trước", "Just below"), lo), num(LT("Liền sau", "Just above"), hi)],
       steps: [st(LT("Số tròn " + nm + " có tận cùng là " + (u === 1000 ? "000" : "00") + ". Số liền trước: giữ nguyên các hàng cao, các hàng thấp hơn đổi thành 0.", "A round " + nm + " number ends in " + (u === 1000 ? "000" : "00") + ". For the number just below: keep the higher places the same and change the lower places to 0.")), st(LT("Liền trước: " + fmt(lo) + ". Liền sau hơn liền trước " + fmt(u) + ": " + fmt(lo) + " + " + fmt(u) + " = " + fmt(hi), "Just below: " + fmt(lo) + ". The number just above is " + fmt(u) + " more: " + fmt(lo) + " + " + fmt(u) + " = " + fmt(hi)), hi)],
       tip: LT("Số " + fmt(n) + " nằm giữa hai số tròn " + nm + " liên tiếp.", "The number " + fmt(n) + " is between two round " + nm + "s in a row.")
      })
     }
     let nums = distinctNums(r, 4, () => +(genDigits(r, 3) + genDigits(r, 3, 0))),
      big = r.chance(.5),
      v = big ? Math.max.apply(null, nums) : Math.min.apply(null, nums);
     return QQ({
      q: LT("Trong các số **" + nums.map(fmt).join("; ") + "**, số nào " + (big ? "**lớn nhất**" : "**bé nhất**") + "?", "Among the numbers **" + nums.map(fmt).join("; ") + "**, which one is the " + (big ? "**largest**" : "**smallest**") + "?"),
      parts: [chp(nums.map(fmt), fmt(v))],
      steps: [st(LT("Các số đều có sáu chữ số, so từng hàng từ trái sang phải.", "All the numbers have six digits, so compare place by place from left to right.")), st(LT("Loại dần các số có chữ số ở hàng cao " + (big ? "bé" : "lớn") + " hơn. Số " + (big ? "lớn nhất" : "bé nhất") + " là " + fmt(v) + ".", "Rule out the numbers that have a " + (big ? "smaller" : "larger") + " digit in a higher place. The " + (big ? "largest" : "smallest") + " number is " + fmt(v) + "."))],
      tip: LT("So hàng trăm nghìn trước. Bằng nhau thì so tiếp hàng chục nghìn...", "Compare the hundred thousands place first. If they are equal, compare the ten-thousands place next...")
     })
    }
    let k = rd(r, 0, 3);
    if (k === 0) {
     let pre = genDigits(r, 3),
      nums = distinctNums(r, 4, () => +(pre + genDigits(r, rd(r, 5, 6), 0)).slice(0, 6));
     return ordQ(r, nums, r.chance(.5))
    }
    if (k === 1) {
     let pre3 = rd(r, 100, 999),
      nums = distinctNums(r, 4, () => pre3 * 100 + rd(r, 0, 99)),
      vs = nums.slice(),
      mx = Math.max.apply(null, vs),
      mn = Math.min.apply(null, vs),
      L = ["A", "B", "C", "D"],
      noun = r.pick([
       [LT("Trường", "School"), LT("học sinh", "students")],
       [LT("Xã", "Village"), LT("người", "people")]
      ]),
      nms = L.map(x => noun[0] + " " + x),
      lst = nms.map((x, i) => LT(x + " có " + fmt(nums[i]) + " " + noun[1], x + " has " + fmt(nums[i]) + " " + noun[1])).join("; ");
     return QQ({
      q: LT(lst + ". Hỏi " + noun[0].toLowerCase() + " nào có số " + noun[1] + " **nhiều nhất**, " + noun[0].toLowerCase() + " nào **ít nhất**?", lst + ". Which " + noun[0].toLowerCase() + " has the **most** " + noun[1] + ", and which " + noun[0].toLowerCase() + " has the **fewest**?"),
      parts: [chp(nms, nms[nums.indexOf(mx)], LT("Nhiều nhất", "Most")), chp(nms, nms[nums.indexOf(mn)], LT("Ít nhất", "Fewest"))],
      steps: [st(LT("Các số đều có 5 chữ số nên so từng hàng từ trái sang phải.", "All the numbers have 5 digits, so compare place by place from left to right.")), st(LT("Sắp xếp từ bé đến lớn: " + nums.slice().sort((a, b) => a - b).map(fmt).join(" < ") + ". Nhiều nhất: " + nms[nums.indexOf(mx)] + " (" + fmt(mx) + "); ít nhất: " + nms[nums.indexOf(mn)] + " (" + fmt(mn) + ").", "Arrange from smallest to largest: " + nums.slice().sort((a, b) => a - b).map(fmt).join(" < ") + ". Most: " + nms[nums.indexOf(mx)] + " (" + fmt(mx) + "); fewest: " + nms[nums.indexOf(mn)] + " (" + fmt(mn) + ")."))],
      tip: LT("Xếp các số theo thứ tự rồi chọn số lớn nhất và bé nhất.", "Put the numbers in order, then pick the largest and the smallest.")
     })
    }
    if (k === 2) {
     let A = rd(r, 20000, 60000),
      w = rd(r, 4, 11);
     A % 1000 === 0 && A++;
     let B = A + w * 1000 + rd(r, 1, 900);
     B % 1000 === 0 && B++;
     let cnt = Math.floor(B / 1000) - Math.floor(A / 1000);
     return QQ({
      q: LT("Có bao nhiêu số tròn nghìn lớn hơn **" + fmt(A) + "** và bé hơn **" + fmt(B) + "**?", "How many round thousands are greater than **" + fmt(A) + "** and less than **" + fmt(B) + "**?"),
      parts: [num("", cnt, LT("số", "numbers"))],
      steps: [st(LT("Số tròn nghìn đầu tiên lớn hơn " + fmt(A) + " là " + fmt((Math.floor(A / 1000) + 1) * 1000) + ".", "The first round thousand greater than " + fmt(A) + " is " + fmt((Math.floor(A / 1000) + 1) * 1000) + ".")), st(LT("Số tròn nghìn lớn nhất bé hơn " + fmt(B) + " là " + fmt(Math.floor(B / 1000) * 1000) + ".", "The largest round thousand less than " + fmt(B) + " is " + fmt(Math.floor(B / 1000) * 1000) + ".")), st(LT("Các số đó là " + fmt((Math.floor(A / 1000) + 1) * 1000) + "; " + fmt((Math.floor(A / 1000) + 2) * 1000) + "; ... ; " + fmt(Math.floor(B / 1000) * 1000) + ", mỗi số hơn số trước 1 000. Có " + (Math.floor(B / 1000) - Math.floor(A / 1000)) + " số.", "Those numbers are " + fmt((Math.floor(A / 1000) + 1) * 1000) + "; " + fmt((Math.floor(A / 1000) + 2) * 1000) + "; ... ; " + fmt(Math.floor(B / 1000) * 1000) + ", and each one is 1,000 more than the one before. There are " + (Math.floor(B / 1000) - Math.floor(A / 1000)) + " numbers."), cnt)],
      tip: LT("Liệt kê các số tròn nghìn nằm giữa hai số đã cho rồi đếm.", "List the round thousands between the two given numbers, then count them.")
     })
    }
    let n = rd(r, 5, 6),
     pos = rd(r, 1, n - 2),
     lt = r.chance(.6),
     T, P, ans;
    for (let g = 0; g < 400; g++) {
     T = genDigits(r, n);
     let pf = T.slice(0, pos);
     P = pf + genDigits(r, n - pos, 0);
     let valid = [];
     for (let d = 0; d <= 9; d++) {
      let c = digStr(P, pos, d);
      (lt ? +c < +T : +c > +T) && valid.push(d)
     }
     if (valid.length >= 2 && valid.length <= 8) {
      ans = lt ? Math.max.apply(null, valid) : Math.min.apply(null, valid);
      break
     }
    }
    let pat = digStr(P, pos, "?"),
     fv = d => fmt(digStr(P, pos, d));
    return QQ({
     q: LT(SO_TT + "Tìm chữ số " + (lt ? "**lớn nhất**" : "**bé nhất**") + " thay cho dấu **?** để: **" + fmtS(pat) + " " + (lt ? "<" : ">") + " " + fmt(T) + "**", SO_TT + "Find the " + (lt ? "**largest**" : "**smallest**") + " digit to replace the **?** so that: **" + fmtS(pat) + " " + (lt ? "<" : ">") + " " + fmt(T) + "**"),
     parts: [num(LT("Chữ số", "Digit"), ans)],
     steps: [st(LT("Các chữ số đứng trước dấu ? giống hệt số " + fmt(T) + ", nên phải so tiếp đến hàng " + HANG[n - 1 - pos] + " có dấu ?.", "The digits before the ? are exactly the same as in " + fmt(T) + ", so we have to keep comparing until the " + HANG[n - 1 - pos] + " place, where the ? is.")), st(LT("Chữ số ở hàng " + HANG[n - 1 - pos] + " của số " + fmt(T) + " là " + T[pos] + ". Chữ số ? " + (lt ? "bé hơn " : "lớn hơn ") + T[pos] + " thì chắc chắn " + (lt ? "bé hơn" : "lớn hơn") + "; chữ số ? bằng " + T[pos] + " thì phải so tiếp các hàng sau.", "The digit in the " + HANG[n - 1 - pos] + " place of " + fmt(T) + " is " + T[pos] + ". If the ? is " + (lt ? "less than " : "greater than ") + T[pos] + ", the number is definitely " + (lt ? "less" : "greater") + "; if the ? equals " + T[pos] + ", we have to compare the places after it.")), st(LT("Thử các chữ số: số " + fv(ans) + " " + (lt ? "<" : ">") + " " + fmt(T) + " đúng, còn số " + fv(lt ? ans + 1 : ans - 1) + " thì sai. Chữ số cần tìm là " + ans + ".", "Try the digits: " + fv(ans) + " " + (lt ? "<" : ">") + " " + fmt(T) + " is true, but " + fv(lt ? ans + 1 : ans - 1) + " is false. The digit we need is " + ans + "."), ans)],
     tip: LT("Thử các chữ số từ 0 đến 9 ở vị trí dấu ?, xem chữ số nào làm phép so sánh đúng.", "Try the digits from 0 to 9 in the spot of the ? and see which digit makes the comparison true.")
    })
   }
  });

  /* ---------- x10 ---------- */
  var X10 = {
   stepDiag: (mid, ans) => (vals, q) => DG.step([mid])(vals, q) || X10.zdiag(ans)(vals, q),
   zdiag: ans => (vals, q) => {
    let e = V(vals, 0);
    if (!isFinite(e) || e <= 0 || e === ans) return null;
    return isP10(e / ans) || isP10(ans / e) ? {
     kind: "so0",
     msg: LT("Con kiểm tra lại số chữ số 0 nhé: 10 có 1 chữ số 0, 100 có 2 chữ số 0, 1 000 có 3 chữ số 0. Nhân thì thêm 0, chia thì bỏ bớt 0.", "Check the number of zeros again: 10 has 1 zero, 100 has 2 zeros, and 1,000 has 3 zeros. Multiplying adds zeros, and dividing removes zeros.")
    } : null
   },
   mulQ(n, m, rev) {
    let k = String(m).length - 1,
     res = n * m;
    return QQ({
     q: LT("Tính nhẩm: **" + (rev ? fmt(m) + " × " + fmt(n) : fmt(n) + " × " + fmt(m)) + "**", "Mental math: **" + (rev ? fmt(m) + " × " + fmt(n) : fmt(n) + " × " + fmt(m)) + "**"),
     parts: [num("", res)],
     steps: [st(LT("Nhân với " + fmt(m) + " ta viết thêm " + k + " chữ số 0 vào bên phải số " + fmt(n) + ".", "To multiply by " + fmt(m) + ", we write " + k + (k === 1 ? " zero" : " zeros") + " to the right of " + fmt(n) + ".")), st(fmt(n) + " × " + fmt(m) + " = " + fmt(res), res)],
     tip: LT(fmt(m) + " có " + k + " chữ số 0, nên thêm " + k + " chữ số 0 vào bên phải.", fmt(m) + " has " + k + (k === 1 ? " zero" : " zeros") + ", so add " + k + (k === 1 ? " zero" : " zeros") + " to the right."),
     diag: X10.zdiag(res),
     hintFig: {
      fb: FB.x10(n, k, "mul"),
      f: 0
     }
    })
   },
   divQ(n, m) {
    let k = String(m).length - 1,
     res = n / m;
    return QQ({
     q: LT("Tính nhẩm: **" + fmt(n) + " : " + fmt(m) + "**", "Mental math: **" + fmt(n) + " ÷ " + fmt(m) + "**"),
     parts: [num("", res)],
     steps: [st(LT("Chia cho " + fmt(m) + " ta bỏ bớt " + k + " chữ số 0 ở bên phải số " + fmt(n) + ".", "To divide by " + fmt(m) + ", we remove " + k + (k === 1 ? " zero" : " zeros") + " from the right of " + fmt(n) + ".")), st(LT(fmt(n) + " : " + fmt(m) + " = " + fmt(res), fmt(n) + " ÷ " + fmt(m) + " = " + fmt(res)), res)],
     tip: LT(fmt(m) + " có " + k + " chữ số 0, nên bỏ bớt " + k + " chữ số 0 ở bên phải.", fmt(m) + " has " + k + (k === 1 ? " zero" : " zeros") + ", so remove " + k + (k === 1 ? " zero" : " zeros") + " from the right."),
     diag: X10.zdiag(res),
     hintFig: {
      fb: FB.x10(n, k, "div"),
      f: 0
     }
    })
   },
   CTX: [
    [LT("hộp", "box"), LT("cái kẹo", "candies"), LT("cái kẹo", "candies"), LT("hộp", "boxes")],
    [LT("túi", "bag"), LT("viên bi", "marbles"), LT("viên bi", "marbles"), LT("túi", "bags")],
    [LT("thùng", "crate"), LT("chai nước", "bottles of water"), LT("chai nước", "bottles of water"), LT("thùng", "crates")],
    [LT("bó", "bunch"), LT("bông hoa", "flowers"), LT("bông hoa", "flowers"), LT("bó", "bunches")],
    [LT("hộp", "box"), LT("chiếc bút", "pens"), LT("chiếc bút", "pens"), LT("hộp", "boxes")],
    [LT("giỏ", "basket"), LT("quả cam", "oranges"), LT("quả cam", "oranges"), LT("giỏ", "baskets")]
   ],
   M: r => r.pick([10, 100, 1000])
  };
  LESSON({
   id: "x10",
   reg: "so",
   title: LT("Nhân, chia với 10, 100, 1 000", "Multiplying and Dividing by 10, 100, 1,000"),
   short: LT("Nhân, chia với 10, 100, 1 000", "× and ÷ by 10, 100, 1,000"),
   emoji: "🔟",
   blurb: LT("Nhẩm nhanh: thêm hoặc bỏ bớt chữ số 0", "Quick mental math: add or remove zeros"),
   links: ["mul", "div"],
   rule: {
    h: LT("Quy tắc", "Rules"),
    items: [LT("Nhân một số với **10, 100, 1 000** ta viết thêm vào bên phải số đó **một, hai, ba chữ số 0**.", "To multiply a number by **10, 100, 1,000**, we write **one, two, or three zeros** to the right of that number."), LT("Chia số tròn chục, tròn trăm, tròn nghìn cho **10, 100, 1 000** ta **bỏ bớt một, hai, ba chữ số 0** ở bên phải số đó.", "To divide a round number of tens, hundreds, or thousands by **10, 100, 1,000**, we **remove one, two, or three zeros** from the right of that number.")]
   },
   figs: {
    a: () => FB.x10(35, 1, "mul"),
    b: () => FB.x10(47, 2, "mul"),
    d: () => FB.x10(5400, 2, "div"),
    r: () => FB.x10rule()
   },
   teach: [{
    key: "a",
    f: 0,
    say: LT("Tính **35 × 10**. Khi nhân một số với **10**, ta chỉ cần viết thêm **một chữ số 0** vào bên phải số đó.", "Let's find **35 × 10**. When we multiply a number by **10**, we just write **one zero** to the right of that number.")
   }, {
    key: "a",
    f: 1,
    say: LT("35 viết thêm một chữ số 0 thành **350**. Vậy **35 × 10 = 350**. Mỗi chữ số dời sang trái một hàng nên số gấp lên 10 lần.", "35 with one zero written after it becomes **350**. So **35 × 10 = 350**. Each digit moves one place to the left, so the number becomes 10 times as big.")
   }, {
    key: "b",
    f: 0,
    say: LT("Nhân với **100** thì viết thêm **hai chữ số 0**. Ví dụ **47 × 100**.", "To multiply by **100**, we write **two zeros**. For example, **47 × 100**.")
   }, {
    key: "b",
    f: 2,
    say: LT("47 thêm hai chữ số 0 thành **4 700**. Còn nhân với **1 000** thì thêm **ba chữ số 0**.\nCùng làm: **24 × 1 000** bằng bao nhiêu?", "47 with two zeros becomes **4,700**. And to multiply by **1,000**, we add **three zeros**.\nLet's try one: what is **24 × 1,000**?"),
    ask: {
     opts: [LT("2 400", "2,400"), LT("24 000", "24,000"), LT("240 000", "240,000")],
     ans: LT("24 000", "24,000"),
     good: LT("Đúng! Thêm ba chữ số 0: 24 000.", "Correct! Add three zeros: 24,000.")
    }
   }, {
    key: "d",
    f: 0,
    say: LT("Chia thì làm ngược lại. Số tròn chục, tròn trăm, tròn nghìn chia cho 10, 100, 1 000 thì **bỏ bớt** chữ số 0 ở bên phải. Ví dụ **5 400 : 100**.", "Division works the other way around. When a round number of tens, hundreds, or thousands is divided by 10, 100, or 1,000, we **remove** zeros from the right. For example, **5,400 ÷ 100**.")
   }, {
    key: "d",
    f: 2,
    say: LT("100 có hai chữ số 0 nên bỏ hai chữ số 0 của 5 400. Được **5 400 : 100 = 54**.", "100 has two zeros, so we remove two zeros from 5,400. We get **5,400 ÷ 100 = 54**.")
   }, {
    key: "d",
    f: 2,
    say: LT("Cùng làm: **8 000 : 1 000** bằng bao nhiêu?", "Let's try one: what is **8,000 ÷ 1,000**?"),
    ask: {
     opts: ["8", "80", "800"],
     ans: "8",
     good: LT("Đúng! Bỏ ba chữ số 0 của 8 000 còn 8.", "Correct! Remove the three zeros from 8,000 and 8 is left.")
    }
   }, {
    key: "r",
    f: 0,
    say: LT("Mẹo nhớ: nhìn xem 10, 100, 1 000 có mấy chữ số 0. **Nhân** thì **thêm** bấy nhiêu chữ số 0, **chia** thì **bỏ bớt** bấy nhiêu chữ số 0.", "Memory trick: look at how many zeros 10, 100, and 1,000 have. **Multiplying** **adds** that many zeros, and **dividing** **removes** that many zeros.")
   }],
   gen(tier, r) {
    if (tier === 1) {
     let m = X10.M(r);
     if (r.chance(.5)) {
      let n = m === 10 && r.chance(.4) ? rd(r, 100, 999) : rd(r, 2, 99);
      return X10.mulQ(n, m, r.chance(.2))
     }
     let b = m === 10 && r.chance(.4) ? rd(r, 100, 999) : rd(r, 2, 99);
     for (; b % 10 === 0;) b = rd(r, 2, 99);
     return X10.divQ(b * m, m)
    }
    if (tier === 2) {
     let k = rd(r, 0, 4),
      m = X10.M(r);
     if (k === 0) return X10.mulQ(m === 1000 ? rd(r, 12, 99) : rd(r, 100, m === 100 ? 999 : 9999), m, r.chance(.2));
     if (k === 1) {
      let b = m === 1000 ? rd(r, 12, 99) : rd(r, 12, 999);
      return X10.divQ(b * m * (m < 1000 && r.chance(.5) ? 10 : 1), m)
     }
     if (k === 2) {
      let c = r.pick(X10.CTX),
       a = rd(r, 12, 99),
       d = r.pick([10, 100, 1000]),
       n = rd(r, 3, 99);
      if (r.chance(.5)) return QQ({
       q: LT("Mỗi " + c[0] + " có **" + fmt(d) + "** " + c[2] + ". Hỏi **" + n + " " + c[0] + "** có tất cả bao nhiêu " + c[2] + "?", "Each " + c[0] + " has **" + fmt(d) + "** " + c[2] + ". How many " + c[2] + " are in **" + n + " " + c[3] + "** in all?"),
       parts: [num("", n * d, c[2])],
       steps: [st(LT("Muốn biết tất cả, ta lấy số " + c[2] + " ở mỗi " + c[0] + " nhân với số " + c[0] + ".", "To find the total, we multiply the number of " + c[2] + " in each " + c[0] + " by the number of " + c[3] + ".")), st(n + " × " + fmt(d) + " = " + fmt(n * d) + " (" + c[2] + ")", n * d)],
       tip: LT("Phép nhân: " + n + " × " + fmt(d) + ".", "Multiplication: " + n + " × " + fmt(d) + "."),
       diag: X10.zdiag(n * d)
      });
      let q2 = rd(r, 12, 99);
      return QQ({
       q: LT("Có **" + fmt(q2 * d) + " " + c[2] + "** xếp đều vào **" + fmt(d) + " " + c[0] + "**. Hỏi mỗi " + c[0] + " có bao nhiêu " + c[2] + "?", "There are **" + fmt(q2 * d) + " " + c[2] + "** packed equally into **" + fmt(d) + " " + c[3] + "**. How many " + c[2] + " are in each " + c[0] + "?"),
       parts: [num("", q2, c[2])],
       steps: [st(LT("Chia đều nên ta lấy tổng số " + c[2] + " chia cho số " + c[0] + ".", "Since they are shared equally, we divide the total number of " + c[2] + " by the number of " + c[3] + ".")), st(LT(fmt(q2 * d) + " : " + fmt(d) + " = " + q2 + " (" + c[2] + ")", fmt(q2 * d) + " ÷ " + fmt(d) + " = " + q2 + " (" + c[2] + ")"), q2)],
       tip: LT("Phép chia: " + fmt(q2 * d) + " : " + fmt(d) + ".", "Division: " + fmt(q2 * d) + " ÷ " + fmt(d) + "."),
       diag: X10.zdiag(q2)
      })
     }
     if (k === 3) {
      let md = X10.M(r),
       b = rd(r, 2, 99);
      if (r.chance(.5)) return QQ({
       q: LT("Điền số thích hợp vào chỗ chấm: **" + fmt(b) + " × … = " + fmt(b * md) + "**", "Fill in the blank with the right number: **" + fmt(b) + " × … = " + fmt(b * md) + "**"),
       parts: [num("", md)],
       steps: [st(LT("Muốn tìm thừa số chưa biết, ta lấy tích chia cho thừa số đã biết.", "To find an unknown factor, we divide the product by the known factor.")), st(LT(fmt(b * md) + " : " + fmt(b) + " = " + fmt(md) + " (số " + fmt(b * md) + " hơn " + fmt(b) + " thêm " + (String(md).length - 1) + " chữ số 0)", fmt(b * md) + " ÷ " + fmt(b) + " = " + fmt(md) + " (" + fmt(b * md) + " has " + (String(md).length - 1) + (String(md).length === 2 ? " more zero" : " more zeros") + " than " + fmt(b) + ")"), md)],
       tip: LT("So sánh " + fmt(b) + " với " + fmt(b * md) + ": phải thêm mấy chữ số 0?", "Compare " + fmt(b) + " with " + fmt(b * md) + ": how many zeros do we need to add?")
      });
      let c = rd(r, 2, 99);
      return QQ({
       q: LT("Điền số thích hợp vào chỗ chấm: **" + fmt(c * md) + " : … = " + fmt(c) + "**", "Fill in the blank with the right number: **" + fmt(c * md) + " ÷ … = " + fmt(c) + "**"),
       parts: [num("", md)],
       steps: [st(LT("Muốn tìm số chia, ta lấy số bị chia chia cho thương.", "To find an unknown divisor, we divide the dividend by the quotient.")), st(LT(fmt(c * md) + " : " + fmt(c) + " = " + fmt(md) + " (từ " + fmt(c * md) + " bỏ bớt " + (String(md).length - 1) + " chữ số 0 được " + fmt(c) + ")", fmt(c * md) + " ÷ " + fmt(c) + " = " + fmt(md) + " (remove " + (String(md).length - 1) + (String(md).length === 2 ? " zero" : " zeros") + " from " + fmt(c * md) + " to get " + fmt(c) + ")"), md)],
       tip: LT("So sánh " + fmt(c * md) + " với " + fmt(c) + ": phải bỏ bớt mấy chữ số 0?", "Compare " + fmt(c * md) + " with " + fmt(c) + ": how many zeros do we need to remove?")
      })
     }
     return r.chance(.5) ? X10.mulQ(rd(r, 1000, 9999), 10, 0) : X10.divQ(rd(r, 11, 99) * 100 * 10, 100)
    }
    let k = r.pick([1, 1, 2, 2, 3, 3, 4, 0]);
    if (k === 0) {
     let md = X10.M(r),
      b = rd(r, 12, 999);
     for (; b % 10 === 0;) b = rd(r, 12, 999);
     let mulf = r.chance(.5),
      t = mulf ? b * md : b,
      txt = mulf ? "? × " + fmt(md) + " = " + fmt(b * md) : LT("? : " + fmt(md) + " = " + fmt(b), "? ÷ " + fmt(md) + " = " + fmt(b)),
      ans = mulf ? b : b * md;
     return QQ({
      q: LT("Tìm số chưa biết **?** biết rằng **" + txt + "**", "Find the unknown number **?** given that **" + txt + "**"),
      parts: [num(LT("Số cần tìm", "Unknown number"), ans)],
      steps: [st(mulf ? LT("Muốn tìm thừa số chưa biết, ta lấy tích chia cho thừa số đã biết.", "To find an unknown factor, we divide the product by the known factor.") : LT("Muốn tìm số bị chia, ta lấy thương nhân với số chia.", "To find the dividend, we multiply the quotient by the divisor.")), st(mulf ? LT(fmt(b * md) + " : " + fmt(md) + " = " + fmt(b), fmt(b * md) + " ÷ " + fmt(md) + " = " + fmt(b)) : fmt(b) + " × " + fmt(md) + " = " + fmt(b * md), ans)],
      tip: mulf ? LT("Phép tính ngược của nhân là chia.", "The opposite of multiplying is dividing.") : LT("Phép tính ngược của chia là nhân.", "The opposite of dividing is multiplying."),
      diag: X10.zdiag(ans)
     })
    }
    if (k === 1) {
     let p = rd(r, 2, 9) * 500 + rd(r, 0, 1) * 1000,
      cx = r.pick([[LT("quyển vở", "notebook"), LT("quyển vở", "notebooks")], [LT("chiếc bút", "pen"), LT("chiếc bút", "pens")], [LT("gói bánh", "pack of cookies"), LT("gói bánh", "packs of cookies")]]),
      c = cx[0],
      cp = cx[1],
      n = r.pick([10, 100]),
      total = p * n,
      pay = Math.ceil((total + 1) / 100000) * 100000 + r.pick([0, 50000, 100000]);
     return QQ({
      q: LT("Mỗi " + c + " giá **" + fmt(p) + " đồng**. Cô Hà mua **" + n + " " + c + "** và đưa người bán **" + fmt(pay) + " đồng**. Hỏi cô Hà được trả lại bao nhiêu tiền?", "Each " + c + " costs **" + fmt(p) + " dong**. Ms. Hà buys **" + n + " " + cp + "** and gives the seller **" + fmt(pay) + " dong**. How much change does Ms. Hà get back?"),
      parts: [num("", pay - total, LT("đồng", "dong"))],
      steps: [st(LT("Số tiền mua " + n + " " + c + ": " + fmt(p) + " × " + n + " = " + fmt(total) + " (đồng)", "Cost of " + n + " " + cp + ": " + fmt(p) + " × " + n + " = " + fmt(total) + " (dong)"), total), st(LT("Số tiền được trả lại: " + fmt(pay) + " − " + fmt(total) + " = " + fmt(pay - total) + " (đồng)", "Change: " + fmt(pay) + " − " + fmt(total) + " = " + fmt(pay - total) + " (dong)"), pay - total)],
      tip: LT("Tìm số tiền mua hàng trước, rồi lấy số tiền đưa trừ đi.", "Find the cost of the items first, then subtract it from the money given."),
      diag: X10.stepDiag(total, pay - total)
     })
    }
    if (k === 2) {
     let a = r.pick([10, 100]),
      b = r.pick([10, 100]),
      n = rd(r, 2, 9),
      cs = r.pick([
       [LT("gói bánh", "packs of cookies"), LT("hộp", "box"), LT("thùng", "crate"), LT("hộp", "boxes"), LT("thùng", "crates")],
       [LT("viên kẹo", "candies"), LT("túi", "bag"), LT("thùng", "crate"), LT("túi", "bags"), LT("thùng", "crates")],
       [LT("chiếc bút", "pens"), LT("hộp", "box"), LT("hòm", "chest"), LT("hộp", "boxes"), LT("hòm", "chests")]
      ]);
     return QQ({
      q: LT("Mỗi " + cs[1] + " có **" + a + " " + cs[0] + "**, mỗi " + cs[2] + " có **" + b + " " + cs[1] + "**. Hỏi **" + n + " " + cs[2] + "** có tất cả bao nhiêu " + cs[0] + "?", "Each " + cs[1] + " has **" + a + " " + cs[0] + "**, and each " + cs[2] + " has **" + b + " " + cs[3] + "**. How many " + cs[0] + " are in **" + n + " " + cs[4] + "** in all?"),
      parts: [num("", n * a * b, cs[0])],
      steps: [st(LT("Một " + cs[2] + " có: " + a + " × " + b + " = " + fmt(a * b) + " (" + cs[0] + ")", "One " + cs[2] + " has: " + a + " × " + b + " = " + fmt(a * b) + " (" + cs[0] + ")"), a * b), st(LT(n + " " + cs[2] + " có: " + n + " × " + fmt(a * b) + " = " + fmt(n * a * b) + " (" + cs[0] + ")", n + " " + cs[4] + " have: " + n + " × " + fmt(a * b) + " = " + fmt(n * a * b) + " (" + cs[0] + ")"), n * a * b)],
      tip: LT("Tìm số " + cs[0] + " trong một " + cs[2] + " trước.", "Find the number of " + cs[0] + " in one " + cs[2] + " first."),
      diag: X10.stepDiag(a * b, n * a * b)
     })
    }
    if (k === 3) {
     let each = rd(r, 12, 99),
      d = r.pick([100, 1000]),
      take = d === 100 ? 10 : r.pick([10, 100]);
     return QQ({
      q: LT("Có **" + fmt(each * d) + " viên bi** xếp đều vào **" + fmt(d) + " túi**. Hỏi **" + take + " túi** có bao nhiêu viên bi?", "There are **" + fmt(each * d) + " marbles** packed equally into **" + fmt(d) + " bags**. How many marbles are in **" + take + " bags**?"),
      parts: [num("", each * take, LT("viên bi", "marbles"))],
      steps: [st(LT("Mỗi túi có: " + fmt(each * d) + " : " + fmt(d) + " = " + each + " (viên bi)", "Each bag has: " + fmt(each * d) + " ÷ " + fmt(d) + " = " + each + " (marbles)"), each), st(LT(take + " túi có: " + each + " × " + take + " = " + fmt(each * take) + " (viên bi)", take + " bags have: " + each + " × " + take + " = " + fmt(each * take) + " (marbles)"), each * take)],
      tip: LT("Tìm số viên bi trong một túi trước.", "Find the number of marbles in one bag first."),
      diag: X10.stepDiag(each, each * take)
     })
    }
    let b = rd(r, 12, 99),
     pr = r.pick([[100, 10], [1000, 10], [1000, 100]]),
     mu = pr[0],
     dv = pr[1],
     ans = b * mu / dv;
    return QQ({
     q: LT("Tính nhẩm: **" + fmt(b) + " × " + fmt(mu) + " : " + fmt(dv) + "**", "Mental math: **" + fmt(b) + " × " + fmt(mu) + " ÷ " + fmt(dv) + "**"),
     parts: [num("", ans)],
     steps: [st(LT("Tính từ trái sang phải. Nhân trước: " + fmt(b) + " × " + fmt(mu) + " = " + fmt(b * mu), "Work from left to right. Multiply first: " + fmt(b) + " × " + fmt(mu) + " = " + fmt(b * mu)), b * mu), st(LT("Rồi chia: " + fmt(b * mu) + " : " + fmt(dv) + " = " + fmt(ans), "Then divide: " + fmt(b * mu) + " ÷ " + fmt(dv) + " = " + fmt(ans)), ans)],
     tip: LT("Tính từ trái sang phải: nhân trước, chia sau.", "Work from left to right: multiply first, divide after."),
     diag: X10.stepDiag(b * mu, ans)
    })
   }
  });
  var REGIONS = [{
    id: "so",
    name: "Đảo Số & Phép tính",
    emoji: "🔢",
    col: "--b-soft",
    hd: "#BFDDFF",
    hdG: "#E3D7FF"
   }, {
    id: "toan",
    name: "Rừng Bài toán có lời văn",
    emoji: "🌳",
    col: "--g-soft",
    hd: "#CDF2E4",
    hdG: "#CDF2E4"
   }, {
    id: "ps",
    name: "Vịnh Phân số",
    emoji: "🍕",
    col: "--p-soft",
    hd: "#FFC2D1",
    hdG: "#FFC9E5"
   }, {
    id: "hinh",
    name: "Núi Hình & Đo lường",
    emoji: "📐",
    col: "--y-soft",
    hd: "#FFF0A8",
    hdG: "#FFE3C2"
   }],
   ORDER = ["place", "cmpnum", "round", "addsub", "mul", "quick", "div", "x10", "avg", "unit", "sumdiff", "trees", "chick", "frac", "fracdiv", "fracprop", "simplify", "fraccmp", "fraddsub", "fracmul", "fracof", "angle", "protract", "lines", "hbh", "mass", "area", "time", "chart", "datalist", "freq"].filter(id => LESSONS.some(l => l.id === id));
  LESSONS.sort((a, b) => ORDER.indexOf(a.id) - ORDER.indexOf(b.id));
  (function() {
   let ids = LESSONS.map(l => l.id),
    bad = [];
   if (ORDER.forEach(id => {
     ids.indexOf(id) < 0 && bad.push('ORDER có "' + id + '" nhưng chưa có lessons/' + id + ".js")
    }), LESSONS.forEach(l => {
     ORDER.indexOf(l.id) < 0 && bad.push('bài "' + l.id + '" chưa có trong ORDER'), REGIONS.some(r => r.id === l.reg) || bad.push('bài "' + l.id + '": vùng "' + l.reg + '" không tồn tại'), (l.links || []).forEach(k => {
      ids.indexOf(k) < 0 && bad.push('bài "' + l.id + '" liên kết tới "' + k + '" không tồn tại')
     }), Object.keys(l.figs || {}).length || bad.push('bài "' + l.id + '" không có hình')
    }), bad.length) throw new Error(`Chương trình không nhất quán:
- ` + bad.join(`
- `))
  })();
  var ITEMS = [{
    img: "coin",
    name: LT("Đồng xu vàng", "Gold coin")
   }, {
    img: "coin-blue",
    name: LT("Đồng xu sao xanh", "Blue star coin")
   }, {
    img: "ruby",
    name: LT("Hồng ngọc", "Ruby")
   }, {
    img: "diamond",
    name: LT("Kim cương", "Diamond")
   }, {
    img: "trophy",
    name: LT("Cúp vàng", "Gold cup")
   }, {
    img: "medal",
    name: LT("Huy chương", "Medal")
   }, {
    img: "chest",
    name: LT("Rương báu", "Treasure chest")
   }, {
    img: "crown",
    name: LT("Vương miện", "Crown")
   }, {
    img: "key",
    name: LT("Chìa khoá vàng", "Golden key")
   }, {
    img: "wand",
    name: LT("Đũa thần", "Magic Wand")
   }, {
    img: "book",
    name: LT("Sách phép", "Spellbook")
   }, {
    img: "scroll",
    name: LT("Cuộn giấy", "Scroll")
   }, {
    img: "hourglass",
    name: LT("Đồng hồ cát", "Hourglass")
   }, {
    img: "clover",
    name: LT("Cỏ bốn lá", "Four-Leaf Clover")
   }, {
    img: "flower",
    name: LT("Bông hoa hồng", "Rose")
   }, {
    img: "moon",
    name: LT("Trăng khuyết", "Crescent Moon")
   }, {
    img: "heart",
    name: LT("Trái tim đỏ", "Red Heart")
   }, {
    img: "potion",
    name: LT("Bình thuốc phép", "Magic Potion")
   }, {
    img: "bag",
    name: LT("Ba lô thám hiểm", "Explorer Backpack")
   }, {
    img: "rocket",
    name: LT("Tên lửa", "Rocket")
   }, {
    img: "compass",
    name: LT("La bàn", "Compass")
   }, {
    img: "puzzle",
    name: LT("Mảnh ghép", "Puzzle Piece")
   }, {
    img: "badge",
    name: LT("Huy hiệu ngôi sao", "Star Badge")
   }, {
    img: "bell",
    name: LT("Chuông vàng", "Golden Bell")
   }],
   STARS_PER_ITEM = CONFIG.starsPerItem;
  
;(function(){/* cond.js */
/* Bài "cond": Viết số theo điều kiện */
var T = function(x, y, vi, en, o) { return TH.t(x, y, LT(vi, en), o); };
var S15 = { s: 15 };
function digs(x, y, arr, o) {
  o = o || {};
  var w = o.w || 50, h = o.h || 52, g = o.gap == null ? 8 : o.gap, s = '';
  arr.forEach(function(d, i) {
    var f = (o.fills && o.fills[i]) || 'white', xx = x + i * (w + g);
    s += TH.r(xx, y, w, h, f, { rx: 10, dash: d === '?' ? '5 4' : null }) + TH.t(xx + w / 2, y + h / 2 + (o.s || 26) * .35, d, { s: o.s || 26 });
  });
  return s;
}
function panel(y, h, fill, head) {
  return TH.r(10, y, 340, h, fill, { rx: 14 }) + (head ? TH.t(24, y + 26, head, { s: 17, a: 'start' }) : '');
}
var D = function(n) { return String(n).split('').map(Number); };
var sum = function(a) { return a.reduce(function(x, y) { return x + y; }, 0); };
var rng = function(a, b, f) { var o = []; for (var i = a; i <= b; i++) if (!f || f(i)) o.push(i); return o; };
var distinct = function(n) { var d = D(n); return new Set(d).size === d.length; };
var dsum = function(n) { return sum(D(n)); };
var listS = function(a) { return a.map(fmt).join("; "); };
var cardsS = function(a) { return a.join("; "); };
var minOf = function(a) { return Math.min.apply(null, a); };
var maxOf = function(a) { return Math.max.apply(null, a); };
function smallestFrom(d) {
  var a = d.slice().sort(function(x, y) { return x - y; });
  if (a[0] === 0) { var k = a.findIndex(function(v) { return v > 0; }); if (k < 0) return null; var t = a[0]; a[0] = a[k]; a[k] = t; }
  return +a.join("");
}
function largestFrom(d) {
  var a = d.slice().sort(function(x, y) { return y - x; });
  if (a[0] === 0) return null;
  return +a.join("");
}
function bestWithLast(d, last, mode) {
  var a = d.slice(), i = a.indexOf(last);
  if (i < 0) return null;
  a.splice(i, 1);
  var v = mode === "min" ? smallestFrom(a) : largestFrom(a);
  return v == null ? null : v * 10 + last;
}
function cands(d, par, mode) {
  var seen = {}, out = [];
  d.forEach(function(x) {
    if (x % 2 !== par || seen[x]) return;
    seen[x] = 1;
    var v = bestWithLast(d, x, mode);
    if (v != null) out.push({ last: x, v: v });
  });
  return out;
}
var NAMES3 = ["An", "Bình", "Lan", "Hà", "Minh", "Nam", "Mai", "Hùng", "Linh", "Khoa"];
var ordS = function(n) { return n; };
var PLACE4 = [LT("hàng nghìn", "thousands"), LT("hàng trăm", "hundreds"), LT("hàng chục", "tens"), LT("hàng đơn vị", "ones")];
var parVi = function(p) { return p ? "lẻ" : "chẵn"; };
var parEn = function(p) { return p ? "odd" : "even"; };
function pickCards(r, withZero) {
  var d, g = 0;
  do {
    d = r.shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4);
    g++;
  } while ((withZero ? d.indexOf(0) < 0 : false) && g < 100);
  return d;
}
function listSteps(list, vi, en) {
  return st(LT(vi + ": " + listS(list), en + ": " + listS(list)), list.length);
}

/* ---- Lý thuyết hình ---- */
function figA() {
  return [
    TH.svg(170,
      T(180, 24, "4 tấm thẻ chữ số", "4 digit cards", { s: 17 }) +
      digs(48, 40, ["4", "0", "7", "2"], { w: 54, h: 58, gap: 16, s: 30, fills: ["sky", "sky", "sky", "sky"] }) +
      T(180, 132, "Lập số có 4 chữ số,", "Make a 4-digit number,", { s: 16 }) +
      T(180, 154, "mỗi thẻ dùng đúng 1 lần", "using each card exactly once", { s: 16 })),
    TH.svg(205,
      T(10, 44, "Lớn nhất:", "Largest:", { s: 16, a: "start" }) +
      digs(120, 20, ["7", "4", "2", "0"], { w: 44, h: 44, gap: 6, s: 24, fills: ["orange", "sun", "sun", "sun"] }) +
      T(217, 82, "chữ số to đứng trước", "big digits first", { s: 15 }) +
      T(10, 134, "Bé nhất:", "Smallest:", { s: 16, a: "start" }) +
      digs(120, 110, ["2", "0", "4", "7"], { w: 44, h: 44, gap: 6, s: 24, fills: ["sky", "mint", "mint", "mint"] }) +
      T(217, 172, "bé trước, số đầu không là 0", "small first, first digit not 0", { s: 15 }) +
      T(217, 194, "(0 xếp thứ hai)", "(0 goes second)", { s: 15 })),
    TH.svg(222,
      T(180, 20, "Số chẵn bé nhất", "Smallest even number", { s: 17 }) +
      T(8, 62, "tận cùng 0", "ends in 0", { s: 15, a: "start" }) + digs(100, 38, ["2", "4", "7", "0"], { w: 36, h: 40, gap: 4, s: 22, fills: ["white", "white", "white", "sky"] }) + T(352, 64, "2 470", "2,470", { s: 17, a: "end" }) +
      T(8, 112, "tận cùng 2", "ends in 2", { s: 15, a: "start" }) + digs(100, 88, ["4", "0", "7", "2"], { w: 36, h: 40, gap: 4, s: 22, fills: ["white", "white", "white", "sky"] }) + T(352, 114, "4 072", "4,072", { s: 17, a: "end" }) +
      T(8, 162, "tận cùng 4", "ends in 4", { s: 15, a: "start" }) + digs(100, 138, ["2", "0", "7", "4"], { w: 36, h: 40, gap: 4, s: 22, fills: ["white", "white", "white", "orange"] }) + T(352, 164, "2 074", "2,074", { s: 17, a: "end", c: "orange" }) +
      T(180, 206, "Bé nhất: 2 074", "Smallest: 2,074", { s: 17, c: "orange" }))
  ];
}
function figB() {
  return [
    TH.svg(190,
      T(180, 20, "Bé nhất, 3 chữ số, tổng chữ số 12", "Smallest 3-digit, digit sum 12", { s: 16 }) +
      T(70, 46, "Trăm", "Hundreds", S15) + T(180, 46, "Chục", "Tens", S15) + T(290, 46, "Đơn vị", "Ones", S15) +
      digs(35, 54, ["1", "2", "9"], { w: 70, h: 56, gap: 40, s: 30, fills: ["sky", "orange", "mint"] }) +
      T(70, 136, "bé nhất,", "smallest,", S15) + T(70, 156, "không là 0", "not 0", S15) +
      T(180, 136, "12 − 1 − 9", "12 − 1 − 9", S15) + T(180, 156, "= 2", "= 2", S15) +
      T(290, 136, "to nhất:", "biggest:", S15) + T(290, 156, "dồn 9 sang phải", "push 9 right", S15) +
      T(180, 182, "1 + 2 + 9 = 12", "1 + 2 + 9 = 12", { s: 17, c: "orange" })),
    TH.svg(170,
      T(180, 20, "Bé nhất, 4 chữ số, tổng chữ số 10", "Smallest 4-digit, digit sum 10", { s: 16 }) +
      digs(68, 34, ["1", "0", "0", "9"], { w: 50, h: 50, gap: 8, s: 28, fills: ["sky", "mint", "mint", "orange"] }) +
      T(180, 114, "Hàng cao bé nhất, dồn 9 về hàng đơn vị", "Smallest high places, push 9 to the ones", { s: 15 }) +
      T(180, 140, "1 + 0 + 0 + 9 = 10", "1 + 0 + 0 + 9 = 10", { s: 18, c: "orange" }))
  ];
}
function figC() {
  var t = ["16", "25", "34", "43", "52", "61", "70"], s = '';
  t.forEach(function(v, i) {
    var x = i < 4 ? 20 + i * 80 : 60 + (i - 4) * 80, y = i < 4 ? 40 : 100;
    s += TH.box(x, y, 70, 44, v, i === 6 ? "orange" : "sky", { s: 22 });
  });
  return [
    TH.svg(190,
      T(180, 22, "Số có hai chữ số, tổng chữ số bằng 7", "2-digit numbers with digit sum 7", { s: 16 }) + s +
      T(180, 176, "Hàng chục 1, 2, 3, … : tăng dần, đủ 7 số", "Tens 1, 2, 3, …: in order, 7 numbers", { s: 15 })),
    TH.svg(215,
      panel(8, 90, "rose", LT("Sai", "Wrong")) +
      digs(32, 40, ["16", "25", "34", "43", "52", "61"], { w: 46, h: 34, gap: 5, s: 17 }) +
      T(180, 88, "Quên 70 (chữ số 0 ở hàng đơn vị)", "Missed 70 (0 in the ones place)", { s: 15 }) +
      panel(108, 100, "mint", LT("Đúng", "Right")) +
      digs(22, 140, ["16", "25", "34", "43", "52", "61", "70"], { w: 40, h: 34, gap: 6, s: 16, fills: ["white", "white", "white", "white", "white", "white", "orange"] }) +
      T(180, 194, "Có 7 số, kiểm tra từng số: 7 = 7", "7 numbers, each checked: 7 = 7", { s: 15 }))
  ];
}

LESSON({
  id: "cond", reg: "so", emoji: "🔢", optional: true, adv: true,
  title: LT("Viết số theo điều kiện", "Writing Numbers by Rules"),
  blurb: LT("Viết và đếm các số thoả mãn điều kiện về chữ số", "Write and count numbers that fit rules about their digits"),
  links: ["place"],
  rule: {
    h: LT("Ghi nhớ", "Remember"),
    items: [
      LT("**Lớn nhất**: chữ số to xếp trước. **Bé nhất**: chữ số bé xếp trước, nhưng chữ số đầu tiên **không là 0**.", "**Largest**: biggest digits first. **Smallest**: smallest digits first, but the first digit is **not 0**."),
      LT("Số **chẵn** tận cùng 0, 2, 4, 6, 8; số **lẻ** tận cùng 1, 3, 5, 7, 9. Chỉ nhìn **chữ số cuối**.", "**Even** numbers end in 0, 2, 4, 6, 8; **odd** numbers end in 1, 3, 5, 7, 9. Just look at the **last digit**."),
      LT("Biết **tổng chữ số**: số bé nhất thì dồn chữ số 9 về bên phải; số lớn nhất thì dồn 9 về bên trái.", "With a given **digit sum**: for the smallest number push 9s to the right; for the largest push 9s to the left."),
      LT("Muốn đếm: **liệt kê có thứ tự** để không sót, không trùng.", "To count: **list in order** so none is missed or repeated.")
    ]
  },
  figs: {
    a: function() { return RAWFIG(figA()); },
    b: function() { return RAWFIG(figB()); },
    c: function() { return RAWFIG(figC()); }
  },
  teach: [
    { key: "a", f: 0, say: LT("Cùng làm ví dụ: có 4 tấm thẻ **4, 0, 7, 2**. Ta lập các số có 4 chữ số, mỗi thẻ dùng đúng một lần.", "Let us work an example: we have 4 cards **4, 0, 7, 2**. We make 4-digit numbers, using each card exactly once.") },
    { key: "a", f: 1, say: LT("**Lớn nhất**: chữ số to xếp trước: **7 420**. **Bé nhất**: bé xếp trước là 0 2 4 7, nhưng 0 không đứng đầu nên đổi chỗ: **2 047**.", "**Largest**: biggest digits first: **7,420**. **Smallest**: small first would be 0 2 4 7, but 0 cannot be first, so swap: **2,047**.") },
    { key: "a", f: 2, say: LT("Số **chẵn** bé nhất: chữ số cuối phải chẵn (0, 2 hoặc 4). Với mỗi cách, xếp các thẻ còn lại bé trước. Số nào bé nhất trong ba số này?", "The smallest **even** number: the last digit must be even (0, 2 or 4). For each, put the other cards smallest first. Which of the three is smallest?"),
      ask: { opts: [fmt(2074), fmt(2470), fmt(2047)], ans: fmt(2074), good: LT("Đúng! 2 047 tận cùng 7 là số lẻ, nên không được chọn.", "Right! 2,047 ends in 7, so it is odd and not allowed.") } },
    { key: "b", f: 0, say: LT("Bây giờ là **tổng chữ số**. Tìm số bé nhất có 3 chữ số mà tổng chữ số là 12: hàng trăm bé nhất là **1**, hàng đơn vị lấy to nhất là **9**, hàng chục là 12 − 1 − 9 = **2**. Số cần tìm là **129**.", "Now **digit sum**. The smallest 3-digit number with digit sum 12: hundreds is the smallest, **1**; ones is the biggest, **9**; tens is 12 − 1 − 9 = **2**. The number is **129**.") },
    { key: "b", f: 1, say: LT("Tương tự, số bé nhất có 4 chữ số và tổng chữ số 10 là **1 009**. Thử nhé: số bé nhất có 4 chữ số, tổng chữ số là 11?", "In the same way, the smallest 4-digit number with digit sum 10 is **1,009**. Try: the smallest 4-digit number with digit sum 11?"),
      ask: { opts: [fmt(1019), fmt(1109), fmt(1190)], ans: fmt(1019), good: LT("Đúng! 1 + 0 + 1 + 9 = 11 và 1 019 bé nhất.", "Right! 1 + 0 + 1 + 9 = 11 and 1,019 is the smallest.") } },
    { key: "c", f: 0, say: LT("**Đếm** các số có hai chữ số mà tổng chữ số bằng 7: ta **liệt kê có thứ tự** theo hàng chục 1, 2, 3, …: 16, 25, 34, 43, 52, 61, 70. Có **7 số**.", "**Counting** the 2-digit numbers with digit sum 7: **list in order** by the tens digit 1, 2, 3, …: 16, 25, 34, 43, 52, 61, 70. There are **7 numbers**.") },
    { key: "c", f: 1, say: LT("**Cẩn thận!** Đừng quên số **70**: chữ số 0 được phép ở hàng đơn vị. Liệt kê xong hãy kiểm tra lại từng số đã thoả điều kiện.", "**Careful!** Do not forget **70**: 0 is allowed in the ones place. After listing, check that each number fits the rule.") }
  ],
  gen: function(tier, r) { return GEN_COND(tier, r); }
});

function GEN_COND(tier, r) {
  var forms = tier === 1 ? [f1a, f1b, f1c, f1d, f1e, f1f] : tier === 2 ? [f2a, f2b, f2c, f2d, f2e, f2f] : [f3a, f3b, f3c, f3d, f3e, f3f];
  return r.pick(forms)(r);
}

/* ---------- MỨC 1 ---------- */
function f1a(r) {
  var d = pickCards(r, r.chance(.6)), big = r.chance(.5);
  d = r.shuffle(d);
  var L = largestFrom(d), S = smallestFrom(d), ans = big ? L : S;
  var rev = d.slice().sort(function(x, y) { return y - x; }), asc = d.slice().sort(function(x, y) { return x - y; });
  return QQ({
    q: LT("Có 4 tấm thẻ ghi các chữ số **" + cardsS(d) + "**. Dùng cả 4 thẻ, lập **số " + (big ? "lớn nhất" : "bé nhất") + "** có 4 chữ số.", "There are 4 cards with the digits **" + cardsS(d) + "**. Using all 4 cards, make the **" + (big ? "largest" : "smallest") + "** 4-digit number."),
    parts: [num(LT("Số " + (big ? "lớn nhất" : "bé nhất"), (big ? "Largest" : "Smallest") + " number"), ans)],
    steps: big ?
      [st(LT("Xếp các chữ số từ lớn đến bé: " + cardsS(rev), "Arrange the digits from biggest to smallest: " + cardsS(rev))), st(LT("Số lớn nhất là " + fmt(L), "The largest number is " + fmt(L)), L)] :
      [st(LT("Xếp các chữ số từ bé đến lớn: " + cardsS(asc) + (asc[0] === 0 ? " (chữ số 0 không đứng đầu nên đổi chỗ với chữ số khác 0 bé nhất)" : ""), "Arrange the digits from smallest to biggest: " + cardsS(asc) + (asc[0] === 0 ? " (0 cannot be first, so swap it with the smallest non-zero digit)" : ""))), st(LT("Số bé nhất là " + fmt(S), "The smallest number is " + fmt(S)), S)],
    tip: big ? LT("Chữ số to nhất đứng ở hàng cao nhất.", "Put the biggest digit in the highest place.") : LT("Chữ số bé nhất xếp trước, nhưng số 0 không được đứng đầu.", "Small digits go first, but 0 cannot be first.")
  });
}
function f1b(r) {
  var n = r.int(3, 5), big = r.chance(.5);
  var lo = Math.pow(10, n - 1), hi = Math.pow(10, n) - 1;
  var all = rng(lo, hi, distinct), ans = big ? all[all.length - 1] : all[0];
  return QQ({
    q: LT("Tìm số " + (big ? "lớn nhất" : "bé nhất") + " có **" + n + " chữ số khác nhau**.", "Find the " + (big ? "largest" : "smallest") + " number with **" + n + " different digits**."),
    parts: [num("", ans)],
    steps: big ?
      [st(LT("Mỗi hàng chọn chữ số lớn nhất chưa dùng: " + D(ans).join("; "), "In each place use the biggest unused digit: " + D(ans).join("; "))), st(LT("Số cần tìm: " + fmt(ans), "The number: " + fmt(ans)), ans)] :
      [st(LT("Hàng cao nhất không là 0 nên bé nhất là 1; các hàng sau lần lượt là chữ số bé nhất chưa dùng: " + D(ans).join("; "), "The first place is not 0, so it is 1; each next place takes the smallest unused digit: " + D(ans).join("; "))), st(LT("Số cần tìm: " + fmt(ans), "The number: " + fmt(ans)), ans)],
    tip: big ? LT("Các chữ số khác nhau: dùng 9, 8, 7, … lần lượt.", "The digits must differ: use 9, 8, 7, … in turn.") : LT("Hàng đầu là 1, rồi đến 0, 2, 3, …", "First place is 1, then 0, 2, 3, …")
  });
}
function f1c(r) {
  var par = r.int(0, 1), opts = [], g = 0, ans;
  while (opts.length < 3 && g++ < 200) {
    var v = r.int(1000, 99999);
    if (opts.some(function(x) { return x % 10 === v % 10 || x === v; })) continue;
    if (opts.length === 0 && v % 2 !== par) continue;
    if (opts.length > 0 && v % 2 === par) continue;
    opts.push(v);
  }
  if (opts.length < 3) opts = par ? [5236, 4818, 6204] : [5236, 4817, 6203];
  ans = opts[0];
  var shuf = r.shuffle(opts).map(fmt);
  return QQ({
    q: LT("Trong các số sau, số nào là số **" + parVi(par) + "**?", "Which of these numbers is **" + parEn(par) + "**?"),
    parts: [chp(shuf, fmt(ans))],
    steps: [st(LT("Số " + parVi(par) + " có chữ số tận cùng là " + (par ? "1, 3, 5, 7, 9" : "0, 2, 4, 6, 8"), (par ? "Odd" : "Even") + " numbers end in " + (par ? "1, 3, 5, 7, 9" : "0, 2, 4, 6, 8"))), st(LT("Số " + fmt(ans) + " tận cùng là " + (ans % 10) + " nên là số " + parVi(par), fmt(ans) + " ends in " + (ans % 10) + ", so it is " + parEn(par)))],
    tip: LT("Chỉ cần nhìn chữ số cuối cùng.", "Just look at the last digit.")
  });
}
function f1d(r) {
  var S = r.int(3, 16), big = r.chance(.5);
  var all = rng(10, 99, function(n) { return dsum(n) === S; }), ans = big ? all[all.length - 1] : all[0];
  var a = D(ans);
  return QQ({
    q: LT("Tìm số " + (big ? "lớn nhất" : "bé nhất") + " có **hai chữ số** mà **tổng hai chữ số bằng " + S + "**.", "Find the " + (big ? "largest" : "smallest") + " **2-digit** number whose **digits add up to " + S + "**."),
    parts: [num("", ans)],
    steps: big ?
      [st(LT("Chữ số hàng chục lớn nhất có thể: " + a[0] + " (hàng chục không quá 9)", "The tens digit as big as possible: " + a[0] + " (at most 9)")), st(LT("Hàng đơn vị: " + S + " − " + a[0] + " = " + a[1] + ". Số cần tìm: " + ans, "Ones digit: " + S + " − " + a[0] + " = " + a[1] + ". The number: " + ans), ans)] :
      [st(LT("Hàng chục bé nhất có thể: " + a[0] + " (hàng đơn vị lớn nhất là 9 nên hàng chục cần ít nhất " + Math.max(1, S - 9) + ")", "Tens digit as small as possible: " + a[0] + " (the ones digit is at most 9, so tens must be at least " + Math.max(1, S - 9) + ")")), st(LT("Hàng đơn vị: " + S + " − " + a[0] + " = " + a[1] + ". Số cần tìm: " + ans, "Ones digit: " + S + " − " + a[0] + " = " + a[1] + ". The number: " + ans), ans)],
    tip: big ? LT("Cho hàng chục thật lớn, phần còn lại cho hàng đơn vị.", "Make the tens digit big, the rest goes to the ones digit.") : LT("Cho hàng đơn vị thật lớn, phần còn lại cho hàng chục.", "Make the ones digit big, the rest goes to the tens digit.")
  });
}
function f1e(r) {
  var k = r.int(0, 3), a = r.int(1, 9), b = r.int(0, 9), par = r.int(0, 1), q, qe, ans, lst, why, whyE;
  if (k === 0) {
    lst = rng(10, 99, function(n) { return Math.floor(n / 10) === a; });
    q = "chữ số hàng chục là " + a; qe = "the tens digit is " + a;
    why = "Hàng chục là " + a + ", hàng đơn vị là 0, 1, 2, …, 9"; whyE = "The tens digit is " + a + ", the ones digit is 0, 1, 2, …, 9";
  } else if (k === 1) {
    lst = rng(10, 99, function(n) { return n % 10 === b; });
    q = "chữ số hàng đơn vị là " + b; qe = "the ones digit is " + b;
    why = "Hàng đơn vị là " + b + ", hàng chục là 1, 2, …, 9"; whyE = "The ones digit is " + b + ", the tens digit is 1, 2, …, 9";
  } else if (k === 2) {
    lst = rng(10, 99, function(n) { return Math.floor(n / 10) === a && n % 2 === par; });
    q = "chữ số hàng chục là " + a + " và là số " + parVi(par); qe = "the tens digit is " + a + " and the number is " + parEn(par);
    why = "Hàng chục là " + a + ", hàng đơn vị là " + (par ? "1, 3, 5, 7, 9" : "0, 2, 4, 6, 8"); whyE = "The tens digit is " + a + ", the ones digit is " + (par ? "1, 3, 5, 7, 9" : "0, 2, 4, 6, 8");
  } else {
    var c = r.int(1, 9);
    lst = rng(10, 99, function(n) { return Math.floor(n / 10) >= c && n % 10 === b; });
    q = "chữ số hàng đơn vị là " + b + " và chữ số hàng chục không bé hơn " + c; qe = "the ones digit is " + b + " and the tens digit is at least " + c;
    why = "Hàng chục là " + c + ", " + (c + 1) + ", …, 9; hàng đơn vị là " + b; whyE = "The tens digit is " + c + ", " + (c + 1) + ", …, 9; the ones digit is " + b;
  }
  ans = lst.length;
  return QQ({
    q: LT("Có bao nhiêu số có **hai chữ số** mà " + q + "?", "How many **2-digit** numbers are there where " + qe + "?"),
    parts: [num("", ans, LT("số", "numbers"))],
    steps: [st(LT(why, whyE)), listSteps(lst, "Các số đó", "These numbers"), st(LT("Có tất cả " + ans + " số", "There are " + ans + " numbers in all"), ans)],
    tip: LT("Liệt kê theo thứ tự để không sót số nào.", "List them in order so none is missed.")
  });
}
function f1f(r) {
  var n = r.int(2, 4), par = r.int(0, 1), big = r.chance(.5);
  var all = rng(Math.pow(10, n - 1), Math.pow(10, n) - 1, function(x) { return x % 2 === par; }), ans = big ? all[all.length - 1] : all[0];
  return QQ({
    q: LT("Viết số " + parVi(par) + " " + (big ? "lớn nhất" : "bé nhất") + " có **" + n + " chữ số**.", "Write the " + (big ? "largest" : "smallest") + " " + parEn(par) + " number with **" + n + " digits**."),
    parts: [num("", ans)],
    steps: [st(LT("Số " + parVi(par) + " tận cùng bằng " + (par ? "1, 3, 5, 7, 9" : "0, 2, 4, 6, 8"), (par ? "Odd" : "Even") + " numbers end in " + (par ? "1, 3, 5, 7, 9" : "0, 2, 4, 6, 8"))), st(LT("Các chữ số trước tận cùng " + (big ? "đều là 9" : "bé nhất (hàng đầu là 1, còn lại là 0)") + "; tận cùng " + (ans % 10) + ". Số cần tìm: " + fmt(ans), "The digits before the last are " + (big ? "all 9" : "as small as possible (first is 1, the rest 0)") + "; the last digit is " + (ans % 10) + ". The number: " + fmt(ans)), ans)],
    tip: LT("Chọn chữ số cuối đúng loại, các chữ số còn lại cho to nhất hoặc bé nhất.", "Pick a last digit of the right kind, then make the other digits as big or as small as you can.")
  });
}

/* ---------- MỨC 2 ---------- */
function f2a(r) {
  var d, g = 0, par = r.int(0, 1), big = r.chance(.5), cs;
  do {
    d = r.shuffle(pickCards(r, r.chance(.5)));
    cs = cands(d, par, big ? "max" : "min");
    g++;
  } while ((cs.length < 2 || d.every(function(x) { return x % 2 === par; })) && g < 200);
  if (cs.length < 1) { d = [3, 0, 8, 5]; cs = cands(d, par, big ? "max" : "min"); }
  var vals = cs.map(function(c) { return c.v; }), ans = big ? maxOf(vals) : minOf(vals);
  var pd = d.filter(function(x) { return x % 2 === par; });
  return QQ({
    q: LT("Dùng cả 4 tấm thẻ **" + cardsS(d) + "**, lập số **" + parVi(par) + " " + (big ? "lớn nhất" : "bé nhất") + "** có 4 chữ số.", "Using all 4 cards **" + cardsS(d) + "**, make the **" + (big ? "largest" : "smallest") + " " + parEn(par) + "** 4-digit number."),
    parts: [num("", ans)],
    steps: [
      st(LT("Số " + parVi(par) + " thì chữ số cuối là " + parVi(par) + ". Các thẻ " + parVi(par) + ": " + cardsS(pd), "An " + parEn(par) + " number needs an " + parEn(par) + " last digit. The " + parEn(par) + " cards: " + cardsS(pd))),
      st(LT("Với mỗi chữ số cuối, xếp các thẻ còn lại " + (big ? "lớn trước" : "bé trước (0 không đứng đầu)") + ": " + listS(vals), "For each last digit, put the other cards " + (big ? "biggest first" : "smallest first (0 not first)") + ": " + listS(vals))),
      st(LT("Chọn số " + (big ? "lớn nhất" : "bé nhất") + ": " + fmt(ans), "Choose the " + (big ? "largest" : "smallest") + ": " + fmt(ans)), ans)],
    tip: LT("Chọn chữ số cuối trước, rồi xếp các chữ số còn lại.", "Choose the last digit first, then arrange the rest.")
  });
}
function f2b(r) {
  var n = r.int(3, 4), big = r.chance(.5), S = r.int(n === 3 ? 10 : 12, n === 3 ? 25 : 32);
  var all = rng(Math.pow(10, n - 1), Math.pow(10, n) - 1, function(x) { return dsum(x) === S; }), ans = big ? all[all.length - 1] : all[0], a = D(ans);
  var nines = a.filter(function(x) { return x === 9; }).length;
  return QQ({
    q: LT("Tìm số " + (big ? "lớn nhất" : "bé nhất") + " có **" + n + " chữ số** mà **tổng các chữ số bằng " + S + "**.", "Find the " + (big ? "largest" : "smallest") + " **" + n + "-digit** number whose **digits add up to " + S + "**."),
    parts: [num("", ans)],
    steps: big ?
      [st(LT("Cho các hàng cao nhất là 9 càng nhiều càng tốt: " + nines + " chữ số 9, tổng " + 9 * nines, "Make the highest places 9 as far as possible: " + nines + " nines, total " + 9 * nines)), st(LT("Chữ số còn lại: " + S + " − " + 9 * nines + " = " + (S - 9 * nines) + (n - nines > 1 ? "; các hàng còn lại xếp: " + a.slice(nines).join("; ") : ""), "The remaining digit: " + S + " − " + 9 * nines + " = " + (S - 9 * nines) + (n - nines > 1 ? "; the other places: " + a.slice(nines).join("; ") : ""))), st(LT("Số cần tìm: " + fmt(ans), "The number: " + fmt(ans)), ans)] :
      [st(LT("Dồn chữ số 9 về bên phải: " + nines + " chữ số 9, tổng " + 9 * nines, "Push 9s to the right: " + nines + " nines, total " + 9 * nines)), st(LT("Hàng bên trái: " + S + " − " + 9 * nines + " = " + (S - 9 * nines) + (n - nines > 1 ? "; hàng đầu ≥ 1 nên các hàng còn lại là: " + a.slice(0, n - nines).join("; ") : ""), "Left places: " + S + " − " + 9 * nines + " = " + (S - 9 * nines) + (n - nines > 1 ? "; the first place is at least 1, so the others are: " + a.slice(0, n - nines).join("; ") : ""))), st(LT("Số cần tìm: " + fmt(ans), "The number: " + fmt(ans)), ans)],
    tip: big ? LT("Số lớn nhất: đặt chữ số 9 ở các hàng cao.", "For the largest, put 9s in the high places.") : LT("Số bé nhất: đặt chữ số 9 ở các hàng thấp.", "For the smallest, put 9s in the low places.")
  });
}
function f2c(r) {
  var n = r.int(3, 4), par = r.int(0, 1), big = r.chance(.5);
  var all = rng(Math.pow(10, n - 1), Math.pow(10, n) - 1, function(x) { return distinct(x) && x % 2 === par; }), ans = big ? all[all.length - 1] : all[0], a = D(ans);
  return QQ({
    q: LT("Tìm số " + parVi(par) + " " + (big ? "lớn nhất" : "bé nhất") + " có **" + n + " chữ số khác nhau**.", "Find the " + (big ? "largest" : "smallest") + " " + parEn(par) + " number with **" + n + " different digits**."),
    parts: [num("", ans)],
    steps: [
      st(LT("Chữ số cuối phải là số " + parVi(par) + " và khác các chữ số còn lại", "The last digit must be " + parEn(par) + " and different from the other digits")),
      st(LT("Các chữ số đầu " + (big ? "lớn nhất có thể" : "bé nhất có thể") + ": " + a.slice(0, n - 1).join("; ") + "; chữ số cuối: " + a[n - 1], "The leading digits as " + (big ? "big" : "small") + " as possible: " + a.slice(0, n - 1).join("; ") + "; last digit: " + a[n - 1])),
      st(LT("Số cần tìm: " + fmt(ans), "The number: " + fmt(ans)), ans)],
    tip: LT("Chọn chữ số cuối đúng loại, nhưng đừng trùng chữ số đã dùng.", "Choose a last digit of the right kind, but not one already used.")
  });
}
function f2d(r) {
  var k = r.int(0, 3), lst, q, qe;
  if (k === 0) { var S = r.int(5, 12); lst = rng(10, 99, function(n) { return dsum(n) === S; }); q = "tổng hai chữ số bằng " + S; qe = "the two digits add up to " + S; }
  else if (k === 1) { var d = r.int(3, 7); lst = rng(10, 99, function(n) { return Math.floor(n / 10) - n % 10 === d; }); q = "chữ số hàng chục hơn chữ số hàng đơn vị " + d + " đơn vị"; qe = "the tens digit is " + d + " more than the ones digit"; }
  else if (k === 2) { lst = rng(10, 99, function(n) { var o = n % 10; return o > 0 && Math.floor(n / 10) === 2 * o; }); q = "chữ số hàng chục gấp đôi chữ số hàng đơn vị"; qe = "the tens digit is twice the ones digit"; }
  else { var m = r.int(2, 5); lst = rng(10, 99, function(n) { return n % 10 === Math.floor(n / 10) + m; }); q = "chữ số hàng đơn vị hơn chữ số hàng chục " + m + " đơn vị"; qe = "the ones digit is " + m + " more than the tens digit"; }
  return QQ({
    q: LT("Có bao nhiêu số có **hai chữ số** mà " + q + "?", "How many **2-digit** numbers are there where " + qe + "?"),
    parts: [num("", lst.length, LT("số", "numbers"))],
    steps: [st(LT("Xét lần lượt hàng chục 1, 2, 3, …, 9 và tìm chữ số hàng đơn vị phù hợp (từ 0 đến 9)", "Try the tens digit 1, 2, 3, …, 9 in turn and find a matching ones digit (0 to 9)")), listSteps(lst, "Các số thoả mãn", "Numbers that fit"), st(LT("Có " + lst.length + " số", "There are " + lst.length + " numbers"), lst.length)],
    tip: LT("Liệt kê theo hàng chục tăng dần.", "List them with the tens digit going up.")
  });
}
function f2e(r) {
  var k = r.int(0, 3), ans, q, qe, why, whyE;
  if (k === 0) { var par = r.int(0, 1); ans = rng(100, 999, function(n) { return n % 2 === par; }).length; q = "Có bao nhiêu số " + parVi(par) + " có **ba chữ số**?"; qe = "How many " + parEn(par) + " numbers have **3 digits**?"; why = "Có 900 số có ba chữ số (từ 100 đến 999), cứ hai số liền nhau thì có một số chẵn, một số lẻ: 900 : 2 = 450"; whyE = "There are 900 three-digit numbers (100 to 999); of every two in a row, one is even and one is odd: 900 ÷ 2 = 450"; }
  else if (k === 1) { var b = r.int(0, 9); ans = rng(100, 999, function(n) { return n % 10 === b; }).length; q = "Có bao nhiêu số có **ba chữ số** và có chữ số tận cùng là " + b + "?"; qe = "How many **3-digit** numbers end in the digit " + b + "?"; why = "Có 900 số có ba chữ số; cứ mỗi chục có đúng một số tận cùng là " + b + ". Có 900 : 10 = 90 chục như vậy"; whyE = "There are 900 three-digit numbers; each group of ten has exactly one ending in " + b + ". There are 900 ÷ 10 = 90 such groups"; }
  else if (k === 2) { var a = r.int(1, 9), p = r.int(0, 1); ans = rng(100, 999, function(n) { return Math.floor(n / 100) === a && n % 2 === p; }).length; q = "Có bao nhiêu số " + parVi(p) + " có ba chữ số mà chữ số hàng trăm là " + a + "?"; qe = "How many " + parEn(p) + " 3-digit numbers have the hundreds digit " + a + "?"; why = "Các số từ " + a * 100 + " đến " + (a * 100 + 99) + " có 100 số; một nửa là số " + parVi(p) + ": 100 : 2 = 50"; whyE = "The numbers from " + a * 100 + " to " + (a * 100 + 99) + " are 100 numbers; half are " + parEn(p) + ": 100 ÷ 2 = 50"; }
  else { var tt = r.int(0, 9), aa = r.int(1, 9); ans = rng(100, 999, function(n) { return Math.floor(n / 100) === aa && Math.floor(n / 10) % 10 === tt; }).length; q = "Có bao nhiêu số có **ba chữ số** mà chữ số hàng trăm là " + aa + " và chữ số hàng chục là " + tt + "?"; qe = "How many **3-digit** numbers have hundreds digit " + aa + " and tens digit " + tt + "?"; why = "Chỉ còn chữ số hàng đơn vị tự do: 0, 1, 2, …, 9"; whyE = "Only the ones digit is free: 0, 1, 2, …, 9"; }
  return QQ({
    q: LT(q, qe), parts: [num("", ans, LT("số", "numbers"))],
    steps: [st(LT(why, whyE)), st(LT("Có " + ans + " số", "There are " + ans + " numbers"), ans)],
    tip: LT("Đếm theo nhóm thay vì liệt kê từng số.", "Count in groups instead of listing every number.")
  });
}
function f2f(r) {
  var par = r.int(0, 1), up = r.chance(.5), N = r.int(1000, 9990), ans;
  if (up) { ans = N + 1; while (ans % 2 !== par) ans++; } else { ans = N - 1; while (ans % 2 !== par) ans--; }
  return QQ({
    q: LT("Tìm số " + parVi(par) + " " + (up ? "bé nhất lớn hơn " : "lớn nhất bé hơn ") + "**" + fmt(N) + "**.", "Find the " + (up ? "smallest " + parEn(par) + " number greater than " : "largest " + parEn(par) + " number less than ") + "**" + fmt(N) + "**."),
    parts: [num("", ans)],
    steps: [st(LT("Số " + (up ? "liền sau " : "liền trước ") + fmt(N) + " là " + fmt(up ? N + 1 : N - 1), "The number right " + (up ? "after " : "before ") + fmt(N) + " is " + fmt(up ? N + 1 : N - 1)), up ? N + 1 : N - 1), st(LT("Chữ số tận cùng " + (ans % 10) + (par ? " là số lẻ" : " là số chẵn") + (ans === (up ? N + 1 : N - 1) ? ", đúng yêu cầu" : ", chưa đúng nên " + (up ? "tăng" : "giảm") + " thêm 1") + ": " + fmt(ans), "The last digit " + (ans % 10) + (par ? " is odd" : " is even") + (ans === (up ? N + 1 : N - 1) ? ", as required" : ", not right yet, so " + (up ? "add" : "subtract") + " 1 more") + ": " + fmt(ans)), ans)],
    tip: LT("Số chẵn và số lẻ xuất hiện xen kẽ.", "Even and odd numbers take turns.")
  });
}

/* ---------- MỨC 3 ---------- */
function f3a(r) {
  var par = r.int(0, 1), S, all, g = 0, nm = r.pick(NAMES3);
  do { S = r.int(8, 22); all = rng(100, 999, function(n) { return distinct(n) && n % 2 === par && dsum(n) === S; }); g++; } while (!all.length && g < 100);
  var ans = all[0], a = D(ans);
  return QQ({
    q: LT("Mật khẩu két sắt của " + nm + " là số có **3 chữ số khác nhau**, là số **" + parVi(par) + "**, có **tổng các chữ số bằng " + S + "**. Biết đó là số **bé nhất** thoả mãn. Tìm mật khẩu.", nm + "'s safe password is a number with **3 different digits**, it is **" + parEn(par) + "**, and its **digits add up to " + S + "**. It is the **smallest** such number. Find the password."),
    parts: [num(LT("Mật khẩu", "Password"), ans)],
    steps: [
      st(LT("Hàng trăm bé nhất có thể (khác 0): " + a[0], "Hundreds digit as small as possible (not 0): " + a[0])),
      st(LT("Hàng chục bé nhất có thể: " + a[1] + "; hàng đơn vị: " + S + " − " + a[0] + " − " + a[1] + " = " + a[2], "Tens digit as small as possible: " + a[1] + "; ones digit: " + S + " − " + a[0] + " − " + a[1] + " = " + a[2])),
      st(LT("Kiểm tra: " + a[2] + " là số " + parVi(par) + ", ba chữ số khác nhau, tổng " + S + ". Mật khẩu: " + ans, "Check: " + a[2] + " is " + parEn(par) + ", the three digits differ, sum " + S + ". Password: " + ans), ans)],
    tip: LT("Kiểm tra lại từng điều kiện: khác nhau, chẵn hoặc lẻ, tổng chữ số.", "Check each rule: different digits, even or odd, digit sum.")
  });
}
function f3b(r) {
  var S, all, g = 0, nm = r.pick(NAMES3);
  do { S = r.int(14, 30); all = rng(1000, 9999, function(n) { return distinct(n) && dsum(n) === S; }); g++; } while (!all.length && g < 100);
  var ans = all[all.length - 1], a = D(ans);
  return QQ({
    q: LT("Tấm vé của " + nm + " ghi **số lớn nhất** có **4 chữ số khác nhau** mà **tổng các chữ số bằng " + S + "**. Hỏi số ghi trên vé là số nào?", nm + "'s ticket shows the **largest** number with **4 different digits** whose **digits add up to " + S + "**. Which number is on the ticket?"),
    parts: [num(LT("Số trên vé", "Number on the ticket"), ans)],
    steps: [
      st(LT("Hàng nghìn lớn nhất có thể: " + a[0] + "; hàng trăm lớn nhất có thể: " + a[1], "Thousands as big as possible: " + a[0] + "; hundreds as big as possible: " + a[1])),
      st(LT("Hai chữ số còn lại có tổng " + S + " − " + a[0] + " − " + a[1] + " = " + (a[2] + a[3]) + "; hàng chục lớn nhất có thể (khác các chữ số đã dùng): " + a[2], "The other two digits add up to " + S + " − " + a[0] + " − " + a[1] + " = " + (a[2] + a[3]) + "; tens as big as possible (not used before): " + a[2]), a[2] + a[3]),
      st(LT("Hàng đơn vị: " + (a[2] + a[3]) + " − " + a[2] + " = " + a[3] + ". Số trên vé: " + fmt(ans), "Ones digit: " + (a[2] + a[3]) + " − " + a[2] + " = " + a[3] + ". The number on the ticket: " + fmt(ans)), ans)],
    tip: LT("Chọn từng hàng từ trái sang phải, nhớ các chữ số phải khác nhau.", "Choose each place from left to right; remember the digits must differ.")
  });
}
function f3c(r) {
  var k = r.int(0, 2), lst, q, qe, nmn;
  if (k === 0) { var S = r.int(5, 8); lst = rng(10, 99, function(n) { return dsum(n) === S && n % 2 === 0; }); q = "số có **hai chữ số**, **tổng hai chữ số bằng " + S + "** và là số **chẵn**"; qe = "**2-digit** numbers whose **digits add up to " + S + "** and which are **even**"; }
  else if (k === 1) { var s3 = r.int(3, 4); lst = rng(100, 999, function(n) { return dsum(n) === s3; }); q = "số có **ba chữ số** mà **tổng các chữ số bằng " + s3 + "**"; qe = "**3-digit** numbers whose **digits add up to " + s3 + "**"; }
  else { var d = r.int(1, 3), o = r.int(0, 1); lst = rng(10, 99, function(n) { return Math.floor(n / 10) - n % 10 === d && n % 2 === o; }); q = "số có **hai chữ số**, chữ số hàng chục hơn chữ số hàng đơn vị **" + d + "** và là số **" + parVi(o) + "**"; qe = "**2-digit** numbers where the tens digit is **" + d + "** more than the ones digit and which are **" + parEn(o) + "**"; }
  if (lst.length < 2) return f3c(r);
  return QQ({
    q: LT("Viết tất cả các " + q + ". Hỏi: có bao nhiêu số như vậy, số lớn nhất là số nào, số bé nhất là số nào?", "Write all the " + qe + ". How many such numbers are there, which is the largest, and which is the smallest?"),
    parts: [num(LT("Có bao nhiêu số", "How many numbers"), lst.length, LT("số", "numbers")), num(LT("Số lớn nhất", "Largest"), lst[lst.length - 1]), num(LT("Số bé nhất", "Smallest"), lst[0])],
    steps: [st(LT("Liệt kê theo thứ tự tăng dần của chữ số hàng cao nhất, kiểm tra từng điều kiện", "List them with the highest digit going up, checking every rule")), listSteps(lst, "Các số thoả mãn", "Numbers that fit"), st(LT("Có " + lst.length + " số; lớn nhất: " + lst[lst.length - 1] + "; bé nhất: " + lst[0], "There are " + lst.length + " numbers; largest: " + lst[lst.length - 1] + "; smallest: " + lst[0]), lst.length)],
    tip: LT("Liệt kê có thứ tự thì dễ thấy số lớn nhất và bé nhất ở hai đầu.", "In an ordered list the largest and smallest are at the two ends.")
  });
}
function f3d(r) {
  var d = pickCards(r, r.chance(.7)), nm = r.pick(NAMES3);
  d = r.shuffle(d);
  var L = largestFrom(d), S = smallestFrom(d);
  return QQ({
    q: LT(nm + " có 4 tấm thẻ ghi các chữ số **" + cardsS(d) + "**. " + nm + " dùng cả 4 thẻ để lập số lớn nhất và số bé nhất có 4 chữ số. Hỏi **hiệu** của hai số đó là bao nhiêu?", nm + " has 4 cards with the digits **" + cardsS(d) + "**. " + nm + " uses all 4 cards to make the largest and the smallest 4-digit numbers. What is the **difference** between these two numbers?"),
    parts: [num(LT("Hiệu", "Difference"), L - S)],
    steps: [st(LT("Số lớn nhất: " + fmt(L), "Largest number: " + fmt(L)), L), st(LT("Số bé nhất (0 không đứng đầu): " + fmt(S), "Smallest number (0 not first): " + fmt(S)), S), st(LT("Hiệu: " + fmt(L) + " − " + fmt(S) + " = " + fmt(L - S), "Difference: " + fmt(L) + " − " + fmt(S) + " = " + fmt(L - S)), L - S)],
    tip: LT("Lập hai số trước, rồi mới trừ.", "Make the two numbers first, then subtract.")
  });
}
function f3e(r) {
  var n = r.int(3, 4), lo = Math.pow(10, n - 1), hi = Math.pow(10, n) - 1, sub = r.chance(.5);
  var ev = rng(lo, hi, function(x) { return distinct(x) && x % 2 === 0; }), od = rng(lo, hi, function(x) { return distinct(x) && x % 2 === 1; });
  var maxE = ev[ev.length - 1], minO = od[0], maxO = od[od.length - 1], minE = ev[0];
  var useA = r.chance(.5), A = useA ? maxE : maxO, B = useA ? minO : minE, na = useA ? ["chẵn lớn nhất", "even largest"] : ["lẻ lớn nhất", "odd largest"], nb = useA ? ["lẻ bé nhất", "odd smallest"] : ["chẵn bé nhất", "even smallest"];
  var ans = sub ? A - B : A + B;
  return QQ({
    q: LT("Tìm " + (sub ? "hiệu" : "tổng") + " của số " + na[0] + " và số " + nb[0] + " có **" + n + " chữ số khác nhau**.", "Find the " + (sub ? "difference" : "sum") + " of the " + na[1] + " and the " + nb[1] + " numbers with **" + n + " different digits**."),
    parts: [num("", ans)],
    steps: [st(LT("Số " + na[0] + " có " + n + " chữ số khác nhau: " + fmt(A), "The " + na[1] + " number with " + n + " different digits: " + fmt(A)), A), st(LT("Số " + nb[0] + " có " + n + " chữ số khác nhau: " + fmt(B), "The " + nb[1] + " number with " + n + " different digits: " + fmt(B)), B), st(LT((sub ? "Hiệu: " : "Tổng: ") + fmt(A) + (sub ? " − " : " + ") + fmt(B) + " = " + fmt(ans), (sub ? "Difference: " : "Sum: ") + fmt(A) + (sub ? " − " : " + ") + fmt(B) + " = " + fmt(ans)), ans)],
    tip: LT("Tìm từng số theo điều kiện rồi mới cộng hoặc trừ.", "Find each number by its rules first, then add or subtract.")
  });
}
function f3f(r) {
  var a = r.int(1, 9), p2 = r.int(0, 1), nm = r.pick(NAMES3), tk = r.int(0, 2), k = r.int(3, 7), p1 = r.int(0, 1);
  var tf, tv, tve, tn, tc;
  if (tk === 0) { tf = function(t) { return t % 2 === p1; }; tv = "là số " + parVi(p1); tve = "is " + parEn(p1); tn = 5; tc = (p1 ? "1, 3, 5, 7, 9" : "0, 2, 4, 6, 8"); }
  else if (tk === 1) { tf = function(t) { return t > k; }; tv = "lớn hơn " + k; tve = "is greater than " + k; tn = 9 - k; tc = (k + 1) + ", …, 9"; }
  else { tf = function(t) { return t < k; }; tv = "bé hơn " + k; tve = "is less than " + k; tn = k; tc = "0, 1, …, " + (k - 1); }
  var lst = rng(100, 999, function(n) { return Math.floor(n / 100) === a && tf(Math.floor(n / 10) % 10) && n % 2 === p2; });
  var ans = lst.length;
  return QQ({
    q: LT(nm + " muốn đặt số nhà có **3 chữ số**: chữ số hàng trăm là **" + a + "**, chữ số hàng chục " + tv + ", chữ số hàng đơn vị là số **" + parVi(p2) + "**. Hỏi " + nm + " có thể đặt được bao nhiêu số nhà khác nhau?", nm + " wants a house number with **3 digits**: the hundreds digit is **" + a + "**, the tens digit " + tve + ", the ones digit is **" + parEn(p2) + "**. How many different house numbers can " + nm + " choose?"),
    parts: [num("", ans, LT("số", "numbers"))],
    steps: [st(LT("Hàng trăm chỉ có 1 cách: " + a, "The hundreds digit has only 1 choice: " + a), 1), st(LT("Hàng chục " + tv + ": " + tn + " cách (" + tc + "); hàng đơn vị là số " + parVi(p2) + ": 5 cách (" + (p2 ? "1, 3, 5, 7, 9" : "0, 2, 4, 6, 8") + ")", "The tens digit " + tve + ": " + tn + " choices (" + tc + "); the ones digit is " + parEn(p2) + ": 5 choices (" + (p2 ? "1, 3, 5, 7, 9" : "0, 2, 4, 6, 8") + ")"), tn), st(LT("Mỗi cách ở hàng chục ghép với 5 cách ở hàng đơn vị: " + tn + " × 5 = " + ans, "Each tens choice pairs with 5 ones choices: " + tn + " × 5 = " + ans), ans)],
    tip: LT("Mỗi hàng có mấy cách chọn? Nhân các số cách lại.", "How many choices does each place have? Multiply them.")
  });
}

})();

;(function(){/* count.js */
/* Bài mới: Lập số và quy tắc đếm (id "count") */
var T = function (x, y, vi, en, o) { return TH.t(x, y, LT(vi, en), o) };
var WAYS = LT("cách", "ways"), NUMS = LT("số", "numbers");

/* ----- hình dạy ----- */
function menuGrid(withTotal) {
 var dishes = [LT("Cơm", "Rice"), LT("Phở", "Noodle"), LT("Bún", "Vermicelli")],
  drinks = [LT("Trà", "Tea"), LT("Cam", "Juice")],
  cols = ["sky", "mint", "rose"], s = "", i, j;
 for (j = 0; j < 2; j++) s += TH.box(118 + j * 118, 12, 108, 34, drinks[j], "yellow", { s: 16 });
 for (i = 0; i < 3; i++) {
  s += TH.box(10, 58 + i * 44, 92, 36, dishes[i], cols[i], { s: 16 });
  for (j = 0; j < 2; j++) s += TH.box(118 + j * 118, 58 + i * 44, 108, 36, dishes[i] + " + " + drinks[j], "white", { s: 15 });
 }
 return s + (withTotal ? T(180, 212, "3 × 2 = 6 cách", "3 × 2 = 6 ways", { s: 22, c: "orange" }) : "");
}
function menuFig() {
 var dishes = [LT("Cơm", "Rice"), LT("Phở", "Noodle"), LT("Bún", "Vermicelli")],
  drinks = [LT("Trà", "Tea"), LT("Cam", "Juice")], cols = ["sky", "mint", "rose"], s = "", i;
 s += T(180, 22, "3 món chính", "3 main dishes", { s: 17 });
 for (i = 0; i < 3; i++) s += TH.box(14 + i * 114, 32, 104, 42, dishes[i], cols[i], { s: 17 });
 s += T(180, 112, "2 đồ uống", "2 drinks", { s: 17 });
 for (i = 0; i < 2; i++) s += TH.box(72 + i * 118, 122, 104, 42, drinks[i], "yellow", { s: 17 });
 return TH.svg(215, s + T(180, 200, "Chọn 1 món VÀ 1 đồ uống", "Pick 1 dish AND 1 drink", { s: 18, c: "orange" }));
}
function slotFig(h, title, hdr, boxes, foot, extra) {
 var s = T(180, 22, title[0], title[1], { s: 17 }), n = boxes.length, w = 330 / n - 8, i;
 for (i = 0; i < n; i++) {
  s += T(14 + i * (w + 8) + w / 2, 56, hdr[i][0], hdr[i][1], { s: 15 });
  s += TH.box(14 + i * (w + 8), 66, w, 46, LT(boxes[i][0], boxes[i][1]), boxes[i][2], { s: 18 });
 }
 return TH.svg(h, s + (extra || "") + T(180, h - 16, foot[0], foot[1], { s: 21, c: "orange" }));
}
function numList(y, arr) {
 var s = "", n = arr.length, w = 48, g = 6, x0 = 180 - (n * w + (n - 1) * g) / 2, i;
 for (i = 0; i < n; i++) s += TH.box(x0 + i * (w + g), y, w, 36, arr[i], "sun", { s: 19 });
 return s;
}
function orFig() {
 var s = T(180, 20, "Từ A đến B: đi xe buýt HOẶC tàu", "From A to B: bus OR train", { s: 16 }), i;
 for (i = 0; i < 2; i++) s += TH.box(20 + i * 78, 34, 70, 36, LT("Buýt ", "Bus ") + (i + 1), "sky", { s: 15 });
 for (i = 0; i < 3; i++) s += TH.box(190 + i * 54 - 8 + (i ? 0 : 0), 34, 50, 36, LT("Tàu ", "Rail ") + (i + 1), "rose", { s: 14 });
 s += T(180, 106, "Chọn một trong hai: 2 + 3 = 5 cách", "Pick one of the two: 2 + 3 = 5 ways", { s: 18, c: "orange" });
 s += TH.r(20, 126, 150, 62, "mint", { rx: 12 }) + T(95, 150, "VÀ (lần lượt)", "AND (one after another)", { s: 15 }) + T(95, 176, "nhân ×", "multiply ×", { s: 20, c: "orange" });
 s += TH.r(190, 126, 150, 62, "yellow", { rx: 12 }) + T(265, 150, "HOẶC (chọn một)", "OR (pick one)", { s: 15 }) + T(265, 176, "cộng +", "add +", { s: 20, c: "red" });
 return TH.svg(205, s);
}

LESSON({
 id: "count", reg: "toan", emoji: "🔢", optional: true, adv: true,
 title: LT("Lập số và quy tắc đếm", "Making Numbers and Counting Rules"),
 blurb: LT("Đếm cách chọn, cách ghép và lập số từ các chữ số", "Counting choices, pairings and numbers made from digits"),
 links: ["mul"],
 rule: {
  h: LT("Ghi nhớ", "Remember"),
  items: [
   LT("Làm việc này **VÀ** việc kia (lần lượt) thì **nhân** số cách: a × b.", "Doing one task **AND** another (one after the other): **multiply** the numbers of ways: a × b."),
   LT("Chọn việc này **HOẶC** việc kia (chỉ một) thì **cộng** số cách: a + b.", "Choosing one task **OR** another (only one): **add** the numbers of ways: a + b."),
   LT("Lập số: chữ số đầu **không là 0**; nếu các chữ số phải **khác nhau** thì mỗi hàng sau **bớt đi** số đã dùng.", "Making numbers: the first digit is **not 0**; if the digits must be **different**, each later place has **one fewer** choice.")
  ]
 },
 figs: {
  a: () => RAWFIG([menuFig(), TH.svg(215, menuGrid(false)), TH.svg(232, menuGrid(true))]),
  b: () => RAWFIG([
   slotFig(236, ["Các chữ số: 2, 5, 7 (được lặp)", "Digits: 2, 5, 7 (repeats allowed)"], [["Chục", "Tens"], ["Đơn vị", "Ones"]], [["3 cách", "3 ways", "sky"], ["3 cách", "3 ways", "mint"]], ["3 × 3 = 9 số", "3 × 3 = 9 numbers"], numList(128, ["22", "25", "27", "52", "55"]) + T(180, 186, "… và 57, 72, 75, 77", "… and 57, 72, 75, 77", { s: 15 })),
   slotFig(236, ["Các chữ số: 2, 5, 7 (khác nhau)", "Digits: 2, 5, 7 (all different)"], [["Chục", "Tens"], ["Đơn vị", "Ones"]], [["3 cách", "3 ways", "sky"], ["2 cách", "2 ways", "mint"]], ["3 × 2 = 6 số", "3 × 2 = 6 numbers"], numList(128, ["25", "27", "52", "57", "72", "75"]) + T(180, 186, "Đủ cả 6 số", "All 6 numbers", { s: 15 })),
   slotFig(236, ["Các chữ số: 0, 5, 7 (khác nhau)", "Digits: 0, 5, 7 (all different)"], [["Chục", "Tens"], ["Đơn vị", "Ones"]], [["2 cách", "2 ways", "orange"], ["2 cách", "2 ways", "mint"]], ["2 × 2 = 4 số", "2 × 2 = 4 numbers"], numList(128, ["50", "57", "70", "75"]) + T(180, 186, "Chục không được là 0", "The tens digit cannot be 0", { s: 15, c: "red" }))
  ]),
  c: () => RAWFIG([orFig()])
 },
 teach: [
  { key: "a", f: 0, say: LT("Quán có **3 món chính** và **2 đồ uống**. Bé chọn **một món VÀ một đồ uống**. Hỏi có bao nhiêu cách chọn?", "A cafe has **3 main dishes** and **2 drinks**. You pick **one dish AND one drink**. How many ways are there to choose?") },
  { key: "a", f: 1, say: LT("Ghép từng món với từng đồ uống ta được bảng này. Mỗi món ghép được với **2** đồ uống, có 3 món.", "Pair each dish with each drink and we get this table. Each dish goes with **2** drinks, and there are 3 dishes.") },
  { key: "a", f: 2, say: LT("Có **6** bộ khác nhau: làm việc này VÀ việc kia nên **nhân**: 3 × 2 = **6**. Nếu quán có thêm một đồ uống nữa (3 đồ uống) thì có mấy cách?", "There are **6** different combos. We do one task AND another, so we **multiply**: 3 × 2 = **6**. If the cafe adds one more drink (3 drinks), how many ways are there?"), ask: { opts: ["6", "8", "9"], ans: "9", good: LT("Đúng rồi! 3 × 3 = 9 cách.", "Right! 3 × 3 = 9 ways.") } },
  { key: "b", f: 0, say: LT("Lập số **2 chữ số** từ các chữ số 2, 5, 7, được **dùng lại**. Hàng chục có 3 cách chọn, hàng đơn vị cũng 3 cách: 3 × 3 = **9 số**.", "Make **2-digit** numbers from the digits 2, 5, 7, and digits **may repeat**. The tens place has 3 choices and so does the ones place: 3 × 3 = **9 numbers**.") },
  { key: "b", f: 1, say: LT("Nếu các chữ số phải **khác nhau**: hàng chục có 3 cách, hàng đơn vị chỉ còn **2 cách** vì một chữ số đã dùng ở hàng chục. 3 × 2 = **6 số**.", "If the digits must be **different**: the tens place has 3 choices, but the ones place has only **2** because one digit is already used in the tens place. 3 × 2 = **6 numbers**.") },
  { key: "b", f: 2, say: LT("Có chữ số **0** thì hàng chục **không được là 0**: chỉ có 2 cách. Hàng đơn vị còn 2 cách: 2 × 2 = **4 số**. Với các chữ số 0, 1, 2, 3 (khác nhau), lập được mấy số có 2 chữ số?", "When the digit **0** is there, the tens place **cannot be 0**: only 2 choices. The ones place has 2 choices left: 2 × 2 = **4 numbers**. With the digits 0, 1, 2, 3 (all different), how many 2-digit numbers can you make?"), ask: { opts: ["6", "9", "12"], ans: "9", good: LT("Đúng! Hàng chục 3 cách (bỏ 0), hàng đơn vị 3 cách: 3 × 3 = 9 số.", "Right! The tens place has 3 choices (not 0), the ones place has 3: 3 × 3 = 9 numbers.") } },
  { key: "c", f: 0, say: LT("Khi chỉ chọn **một** trong hai cách (xe buýt **HOẶC** tàu) thì **cộng**: 2 + 3 = **5 cách**. Nhớ: **VÀ thì nhân, HOẶC thì cộng.**", "When you pick only **one** of two kinds of ways (bus **OR** train) you **add**: 2 + 3 = **5 ways**. Remember: **AND means multiply, OR means add.**") }
 ],
 gen(tier, r) {
  var dl = function (a) { return a.join(", ") };
  var sortn = function (a) { return a.slice().sort(function (x, y) { return x - y }) };
  var nz = function (k) { return sortn(r.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, k)) };
  var withZero = function (k) { return [0].concat(nz(k - 1)) };
  /* đếm vét cạn các số có len chữ số từ tập digs */
  var brute = function (digs, len, distinct, pred) {
   var cnt = 0, lo = Math.pow(10, len - 1), hi = Math.pow(10, len), v, s, ok, i;
   for (v = lo; v < hi; v++) {
    s = String(v).split("").map(Number); ok = true;
    for (i = 0; i < len; i++) if (digs.indexOf(s[i]) < 0) ok = false;
    if (ok && distinct) for (i = 0; i < len; i++) if (s.indexOf(s[i]) !== i) ok = false;
    if (ok && pred && !pred(v, s)) ok = false;
    if (ok) cnt++;
   }
   return cnt;
  };
  var q;

  if (tier === 1) {
   var t = r.pick([0, 1, 2, 3, 4]);
   if (t === 0) {
    var a = rd(r, 2, 5), b = rd(r, 2, 6), sc = r.pick([
     [LT("Mai có **" + a + " cái áo** và **" + b + " cái quần**. Mỗi lần Mai mặc **một áo với một quần**. Hỏi Mai có bao nhiêu cách mặc khác nhau?", "Mai has **" + a + " shirts** and **" + b + " pairs of pants**. Each time she wears **one shirt with one pair of pants**. How many different outfits can she make?"), LT("áo", "shirt"), LT("quần", "pants"), LT("cách mặc", "outfits")],
     [LT("Cửa hàng bán **" + a + " loại bánh** và **" + b + " loại nước**. Bạn Nam mua **một bánh và một nước**. Hỏi Nam có bao nhiêu cách chọn?", "A shop sells **" + a + " kinds of cake** and **" + b + " kinds of drink**. Nam buys **one cake and one drink**. How many ways can Nam choose?"), LT("bánh", "cake"), LT("nước", "drink"), LT("cách chọn", "ways")],
     [LT("Lớp có **" + a + " bạn nam** và **" + b + " bạn nữ** xung phong. Cô chọn **một bạn nam và một bạn nữ** để múa đôi. Hỏi có bao nhiêu cách chọn?", "A class has **" + a + " boys** and **" + b + " girls** volunteering. The teacher picks **one boy and one girl** for a pair dance. How many ways can she choose?"), LT("bạn nam", "boy"), LT("bạn nữ", "girl"), LT("cách chọn", "ways")]
    ]);
    q = QQ({
     q: sc[0], parts: [num("", a * b, WAYS)],
     steps: [st(LT("Mỗi " + sc[1] + " ghép được với " + b + " " + sc[2] + ", có " + a + " " + sc[1] + ".", "Each " + sc[1] + " can be paired with " + b + " " + sc[2] + ", and there are " + a + " " + sc[1] + ".")), st(LT("Chọn việc này VÀ việc kia nên nhân: " + a + " × " + b + " = " + a * b + " (cách)", "One choice AND another, so multiply: " + a + " × " + b + " = " + a * b + " (ways)"), a * b)],
     tip: LT("Làm cả hai việc, lần lượt: nhân số cách.", "Doing both tasks one after the other: multiply the numbers of ways.")
    });
   } else if (t === 1) {
    var k = rd(r, 3, 6), d = nz(k);
    q = QQ({
     q: LT("Từ các chữ số **" + dl(d) + "**, lập được bao nhiêu số có **2 chữ số** (các chữ số được lặp lại)?", "From the digits **" + dl(d) + "**, how many **2-digit** numbers can be made (digits may repeat)?"),
     parts: [num("", k * k, NUMS)],
     steps: [st(LT("Hàng chục: " + k + " cách chọn. Hàng đơn vị: " + k + " cách chọn (được lặp).", "Tens place: " + k + " choices. Ones place: " + k + " choices (repeats allowed).")), st(LT(k + " × " + k + " = " + k * k + " (số)", k + " × " + k + " = " + k * k + " (numbers)"), k * k)],
     tip: LT("Mỗi hàng đều chọn được tất cả các chữ số.", "Every place can use all the digits.")
    });
   } else if (t === 2) {
    var k2 = rd(r, 3, 6), d2 = nz(k2);
    q = QQ({
     q: LT("Từ các chữ số **" + dl(d2) + "**, lập được bao nhiêu số có **2 chữ số khác nhau**?", "From the digits **" + dl(d2) + "**, how many **2-digit numbers with different digits** can be made?"),
     parts: [num("", k2 * (k2 - 1), NUMS)],
     steps: [st(LT("Hàng chục: " + k2 + " cách chọn.", "Tens place: " + k2 + " choices.")), st(LT("Hàng đơn vị: bỏ chữ số đã dùng, còn " + (k2 - 1) + " cách.", "Ones place: leave out the digit already used, so " + (k2 - 1) + " choices.")), st(LT(k2 + " × " + (k2 - 1) + " = " + k2 * (k2 - 1) + " (số)", k2 + " × " + (k2 - 1) + " = " + k2 * (k2 - 1) + " (numbers)"), k2 * (k2 - 1))],
     tip: LT("Chữ số đã dùng ở hàng chục thì hàng đơn vị không dùng nữa.", "A digit used in the tens place cannot be used again in the ones place.")
    });
   } else if (t === 3) {
    var a3 = rd(r, 2, 9), b3 = rd(r, 2, 9), sc3 = r.pick([
     [LT("Từ A đến B có thể đi bằng **xe buýt** (" + a3 + " tuyến) **hoặc bằng tàu hoả** (" + b3 + " tuyến). Hỏi có bao nhiêu cách đi từ A đến B?", "To go from A to B you can take a **bus** (" + a3 + " routes) **or a train** (" + b3 + " routes). How many ways are there to go from A to B?"), LT("cách đi", "ways")],
     [LT("Bạn Lan muốn chọn **một món quà**: **hoặc một cái bút** (có " + a3 + " loại) **hoặc một quyển vở** (có " + b3 + " loại). Hỏi Lan có bao nhiêu cách chọn?", "Lan wants to pick **one gift**: **either a pen** (" + a3 + " kinds) **or a notebook** (" + b3 + " kinds). How many ways can Lan choose?"), LT("cách chọn", "ways")]
    ]);
    q = QQ({
     q: sc3[0], parts: [num("", a3 + b3, sc3[1])],
     steps: [st(LT("Chỉ chọn **một** trong hai nhóm, nên ta cộng số cách.", "Only **one** of the two groups is used, so we add the numbers of ways.")), st(LT(a3 + " + " + b3 + " = " + (a3 + b3) + " (cách)", a3 + " + " + b3 + " = " + (a3 + b3) + " (ways)"), a3 + b3)],
     tip: LT("Chọn việc này HOẶC việc kia thì cộng.", "Picking this OR that: add.")
    });
   } else {
    var a4 = rd(r, 2, 6), b4 = rd(r, 2, 6);
    q = QQ({
     q: LT("Từ nhà An đến chợ có **" + a4 + " con đường**, từ chợ đến trường có **" + b4 + " con đường**. An đi từ nhà đến trường **qua chợ**. Hỏi có bao nhiêu cách đi?", "From An's house to the market there are **" + a4 + " roads**, and from the market to school there are **" + b4 + " roads**. An goes from home to school **through the market**. How many ways can An go?"),
     parts: [num("", a4 * b4, WAYS)],
     steps: [st(LT("Đi hết đoạn nhà – chợ VÀ đoạn chợ – trường nên nhân.", "An travels the home-market part AND the market-school part, so we multiply.")), st(LT(a4 + " × " + b4 + " = " + a4 * b4 + " (cách)", a4 + " × " + b4 + " = " + a4 * b4 + " (ways)"), a4 * b4)],
     tip: LT("Mỗi đường nhà – chợ ghép với từng đường chợ – trường.", "Each home-market road can be joined with every market-school road.")
    });
   }
   return q;
  }

  if (tier === 2) {
   var t2 = r.pick([0, 1, 2, 3, 4, 5]);
   if (t2 === 0) {
    var k = rd(r, 4, 6), d = nz(k), v = k * (k - 1) * (k - 2);
    return QQ({
     q: LT("Từ các chữ số **" + dl(d) + "**, lập được bao nhiêu số có **3 chữ số khác nhau**?", "From the digits **" + dl(d) + "**, how many **3-digit numbers with different digits** can be made?"),
     parts: [num("", v, NUMS)],
     steps: [st(LT("Hàng trăm: " + k + " cách. Hàng chục: còn " + (k - 1) + " cách. Hàng đơn vị: còn " + (k - 2) + " cách.", "Hundreds: " + k + " choices. Tens: " + (k - 1) + " left. Ones: " + (k - 2) + " left.")), st(LT(k + " × " + (k - 1) + " × " + (k - 2) + " = " + v + " (số)", k + " × " + (k - 1) + " × " + (k - 2) + " = " + v + " (numbers)"), v)],
     tip: LT("Mỗi hàng sau bớt đi một chữ số đã dùng.", "Each later place has one fewer digit available.")
    });
   }
   if (t2 === 1) {
    var k1 = rd(r, 4, 5), d1 = withZero(k1), v1 = (k1 - 1) * (k1 - 1) * (k1 - 2);
    return QQ({
     q: LT("Từ các chữ số **" + dl(d1) + "**, lập được bao nhiêu số có **3 chữ số khác nhau**?", "From the digits **" + dl(d1) + "**, how many **3-digit numbers with different digits** can be made?"),
     parts: [num("", v1, NUMS)],
     steps: [st(LT("Hàng trăm **không được là 0**: " + (k1 - 1) + " cách.", "The hundreds digit **cannot be 0**: " + (k1 - 1) + " choices.")), st(LT("Hàng chục: còn " + (k1 - 1) + " chữ số (kể cả 0). Hàng đơn vị: còn " + (k1 - 2) + " cách.", "Tens: " + (k1 - 1) + " digits left (0 included). Ones: " + (k1 - 2) + " choices left.")), st(LT((k1 - 1) + " × " + (k1 - 1) + " × " + (k1 - 2) + " = " + v1 + " (số)", (k1 - 1) + " × " + (k1 - 1) + " × " + (k1 - 2) + " = " + v1 + " (numbers)"), v1)],
     tip: LT("Có chữ số 0: chữ số đầu tiên không được là 0.", "With a 0 in the list, the first digit cannot be 0.")
    });
   }
   if (t2 === 2) {
    var k3 = rd(r, 3, 5), d3 = withZero(k3), v3 = (k3 - 1) * k3;
    return QQ({
     q: LT("Từ các chữ số **" + dl(d3) + "**, lập được bao nhiêu số có **2 chữ số** (các chữ số được lặp lại)?", "From the digits **" + dl(d3) + "**, how many **2-digit** numbers can be made (digits may repeat)?"),
     parts: [num("", v3, NUMS)],
     steps: [st(LT("Hàng chục không được là 0: " + (k3 - 1) + " cách.", "The tens digit cannot be 0: " + (k3 - 1) + " choices.")), st(LT("Hàng đơn vị: được dùng cả " + k3 + " chữ số (được lặp): " + k3 + " cách.", "Ones: all " + k3 + " digits can be used (repeats allowed): " + k3 + " choices.")), st(LT((k3 - 1) + " × " + k3 + " = " + v3 + " (số)", (k3 - 1) + " × " + k3 + " = " + v3 + " (numbers)"), v3)],
     tip: LT("Chữ số 0 không đứng đầu, nhưng được đứng ở hàng đơn vị.", "0 cannot come first, but it can be in the ones place.")
    });
   }
   if (t2 === 3) {
    var a = rd(r, 2, 4), b = rd(r, 2, 4), c = rd(r, 2, 4);
    return QQ({
     q: LT("Bạn Nam có **" + a + " cái mũ**, **" + b + " cái áo** và **" + c + " cái quần**. Mỗi lần Nam mặc **một mũ, một áo và một quần**. Hỏi Nam có bao nhiêu cách mặc?", "Nam has **" + a + " hats**, **" + b + " shirts** and **" + c + " pairs of pants**. Each time he wears **one hat, one shirt and one pair of pants**. How many different outfits can he make?"),
     parts: [num("", a * b * c, WAYS)],
     steps: [st(LT("Chọn mũ VÀ áo VÀ quần nên nhân cả ba số cách.", "Hat AND shirt AND pants, so we multiply all three numbers of ways.")), st(LT(a + " × " + b + " × " + c + " = " + a * b * c + " (cách)", a + " × " + b + " × " + c + " = " + a * b * c + " (ways)"), a * b * c)],
     tip: LT("Ba việc làm lần lượt: nhân ba số.", "Three tasks one after another: multiply three numbers.")
    });
   }
   if (t2 === 4) {
    var x = rd(r, 3, 9), y = rd(r, 3, 9), both = r.chance(.5);
    return QQ({
     q: both ? LT("Đội văn nghệ có **" + x + " bạn nam** và **" + y + " bạn nữ**. Cô chọn **một bạn nam và một bạn nữ** làm đôi dẫn chương trình. Hỏi có bao nhiêu cách chọn?", "The arts team has **" + x + " boys** and **" + y + " girls**. The teacher chooses **one boy and one girl** as the host pair. How many ways can she choose?") : LT("Đội văn nghệ có **" + x + " bạn nam** và **" + y + " bạn nữ**. Cô chọn **một bạn** (nam **hoặc** nữ) làm đội trưởng. Hỏi có bao nhiêu cách chọn?", "The arts team has **" + x + " boys** and **" + y + " girls**. The teacher chooses **one person** (a boy **or** a girl) as team captain. How many ways can she choose?"),
     parts: [num("", both ? x * y : x + y, WAYS)],
     steps: both ? [st(LT("Chọn nam VÀ chọn nữ nên nhân.", "Pick a boy AND a girl, so multiply.")), st(LT(x + " × " + y + " = " + x * y + " (cách)", x + " × " + y + " = " + x * y + " (ways)"), x * y)] : [st(LT("Chỉ chọn một bạn, nam HOẶC nữ nên cộng.", "Only one person, a boy OR a girl, so add.")), st(LT(x + " + " + y + " = " + (x + y) + " (cách)", x + " + " + y + " = " + (x + y) + " (ways)"), x + y)],
     tip: both ? LT("Chọn cả hai bạn: nhân.", "Choosing both people: multiply.") : LT("Chỉ chọn một bạn: cộng.", "Choosing only one person: add.")
    });
   }
   var dg = r.shuffle(withZero(4)).slice(), big = r.chance(.5), srt = sortn(dg), res, how;
   if (big) { res = Number(srt.slice().reverse().join("")); how = LT("Muốn số lớn nhất, xếp các chữ số từ lớn đến bé: " + srt.slice().reverse().join(" ") + ".", "For the largest number, put the digits in order from biggest to smallest: " + srt.slice().reverse().join(" ") + ".") }
   else { var rest = srt.slice(1); res = Number(srt[1] + "" + srt[0] + rest.slice(1).join("")); how = LT("Muốn số bé nhất, chữ số đầu là chữ số bé nhất khác 0 (là " + srt[1] + "), rồi xếp các chữ số còn lại từ bé đến lớn: " + srt[1] + " " + srt[0] + " " + srt[2] + " " + srt[3] + ".", "For the smallest number, the first digit is the smallest digit that is not 0 (which is " + srt[1] + "), then the rest go from smallest to biggest: " + srt[1] + " " + srt[0] + " " + srt[2] + " " + srt[3] + ".") }
   return QQ({
    q: LT("Dùng cả bốn chữ số **" + dg.join(", ") + "** (mỗi chữ số dùng đúng một lần), lập số có 4 chữ số **" + (big ? "lớn nhất" : "bé nhất") + "**.", "Use all four digits **" + dg.join(", ") + "** (each digit exactly once) to make the **" + (big ? "largest" : "smallest") + "** 4-digit number."),
    parts: [num("", res)],
    steps: [st(how), st(LT("Số cần tìm là " + fmt(res) + ".", "The number is " + fmt(res) + "."), res)],
    tip: big ? LT("Chữ số lớn nhất đứng ở hàng cao nhất.", "The biggest digit goes in the highest place.") : LT("Chữ số 0 không được đứng đầu.", "The digit 0 cannot come first.")
   });
  }

  /* tier 3 */
  var t3 = r.pick([0, 1, 2, 3, 4, 5]);
  if (t3 === 0) {
   var k = rd(r, 4, 5), d = withZero(k), all = (k - 1) * (k - 1) * (k - 2), ev = brute(d, 3, true, function (v) { return v % 2 === 0 }),
    enz = d.filter(function (z) { return z > 0 && z % 2 === 0 }).length, z0 = (k - 1) * (k - 2), z1 = enz * (k - 2) * (k - 2);
   if (z0 + z1 !== ev) throw new Error("count mismatch");
   if (enz === 0) return byId("count").gen(3, r);
   return QQ({
    q: LT("Từ các chữ số **" + dl(d) + "**, lập các số có **3 chữ số khác nhau**. Hỏi (a) có tất cả bao nhiêu số? (b) Trong đó có bao nhiêu **số chẵn**?", "From the digits **" + dl(d) + "**, make **3-digit numbers with different digits**. How many are there (a) in all? (b) How many of them are **even**?"),
    parts: [num(LT("(a) Tất cả", "(a) In all"), all, NUMS), num(LT("(b) Số chẵn", "(b) Even"), ev, NUMS)],
    steps: [st(LT("(a) Hàng trăm " + (k - 1) + " cách (bỏ 0), hàng chục " + (k - 1) + " cách, hàng đơn vị " + (k - 2) + " cách: " + (k - 1) + " × " + (k - 1) + " × " + (k - 2) + " = " + all + " (số)", "(a) Hundreds: " + (k - 1) + " (not 0), tens: " + (k - 1) + ", ones: " + (k - 2) + ": " + (k - 1) + " × " + (k - 1) + " × " + (k - 2) + " = " + all + " (numbers)"), all),
     st(LT("(b) Tận cùng là 0: hàng trăm " + (k - 1) + " cách, hàng chục " + (k - 2) + " cách: " + (k - 1) + " × " + (k - 2) + " = " + z0 + " (số)", "(b) Ending in 0: hundreds " + (k - 1) + " choices, tens " + (k - 2) + " choices: " + (k - 1) + " × " + (k - 2) + " = " + z0 + " (numbers)"), z0),
     st(LT("Tận cùng là chữ số chẵn khác 0 (có " + enz + " chữ số): hàng trăm " + (k - 2) + " cách (bỏ 0 và chữ số đã dùng), hàng chục " + (k - 2) + " cách: " + enz + " × " + (k - 2) + " × " + (k - 2) + " = " + z1 + " (số)", "Ending in a nonzero even digit (" + enz + " of them): hundreds " + (k - 2) + " choices (not 0 and not the used digit), tens " + (k - 2) + " choices: " + enz + " × " + (k - 2) + " × " + (k - 2) + " = " + z1 + " (numbers)"), z1),
     st(LT("Số chẵn: " + z0 + " + " + z1 + " = " + ev + " (số)", "Even numbers: " + z0 + " + " + z1 + " = " + ev + " (numbers)"), ev)],
    tip: LT("Số chẵn: xét riêng chữ số tận cùng là 0 và là chữ số chẵn khác 0.", "For even numbers, treat last digit 0 and last digit even-but-not-0 separately.")
   });
  }
  if (t3 === 1) {
   if (r.chance(.5)) {
    var a = rd(r, 2, 5), b = rd(r, 2, 4), c = rd(r, 2, 6);
    return QQ({
     q: LT("Sáng nay Lan muốn ăn sáng: **hoặc** ăn **một bánh mì và một ly sữa** (có " + a + " loại bánh mì, " + b + " loại sữa), **hoặc** ăn **một tô phở** (có " + c + " loại phở). Hỏi Lan có bao nhiêu cách chọn bữa sáng?", "This morning Lan wants breakfast: **either** **one bread and one glass of milk** (" + a + " kinds of bread, " + b + " kinds of milk), **or** **one bowl of noodle soup** (" + c + " kinds). How many ways can Lan choose her breakfast?"),
     parts: [num("", a * b + c, WAYS)],
     steps: [st(LT("Bánh mì VÀ sữa: " + a + " × " + b + " = " + a * b + " (cách)", "Bread AND milk: " + a + " × " + b + " = " + a * b + " (ways)"), a * b), st(LT("Chọn kiểu 1 HOẶC kiểu 2 nên cộng: " + a * b + " + " + c + " = " + (a * b + c) + " (cách)", "Type 1 OR type 2, so add: " + a * b + " + " + c + " = " + (a * b + c) + " (ways)"), a * b + c)],
     tip: LT("Tính riêng từng kiểu bữa sáng rồi cộng lại.", "Count each kind of breakfast separately, then add.")
    });
   }
   var a = rd(r, 2, 5), b = rd(r, 2, 5), c = rd(r, 2, 6);
   return QQ({
    q: LT("Từ A đến C có thể đi **qua B** (từ A đến B có " + a + " đường, từ B đến C có " + b + " đường) **hoặc đi thẳng** (có " + c + " đường thẳng từ A đến C). Hỏi có bao nhiêu cách đi từ A đến C?", "From A to C you can go **through B** (" + a + " roads from A to B, " + b + " roads from B to C) **or go directly** (" + c + " direct roads from A to C). How many ways are there to go from A to C?"),
    parts: [num("", a * b + c, WAYS)],
    steps: [st(LT("Đi qua B: " + a + " × " + b + " = " + a * b + " (cách)", "Through B: " + a + " × " + b + " = " + a * b + " (ways)"), a * b), st(LT("Đi qua B HOẶC đi thẳng nên cộng: " + a * b + " + " + c + " = " + (a * b + c) + " (cách)", "Through B OR directly, so add: " + a * b + " + " + c + " = " + (a * b + c) + " (ways)"), a * b + c)],
    tip: LT("Tính riêng đường qua B, rồi cộng với đường thẳng.", "Count the routes through B first, then add the direct ones.")
   });
  }
  if (t3 === 2) {
   var n = rd(r, 3, 8);
   return QQ({
    q: LT("Từ nhà đến trường có **" + n + " con đường**. Hôm nay An đi học bằng một đường và **về nhà bằng một đường khác** với đường đã đi. Hỏi An có bao nhiêu cách đi và về?", "There are **" + n + " roads** from home to school. Today An goes to school on one road and **comes home on a different road** from the one he took. How many ways can An go and come back?"),
    parts: [num("", n * (n - 1), WAYS)],
    steps: [st(LT("Đường đi: " + n + " cách.", "Going: " + n + " choices.")), st(LT("Đường về: bỏ đường đã đi, còn " + (n - 1) + " cách.", "Coming back: leave out the road already used, " + (n - 1) + " choices.")), st(LT(n + " × " + (n - 1) + " = " + n * (n - 1) + " (cách)", n + " × " + (n - 1) + " = " + n * (n - 1) + " (ways)"), n * (n - 1))],
    tip: LT("Đường về không được trùng đường đi.", "The way back cannot be the road already taken.")
   });
  }
  if (t3 === 3) {
   var n2 = rd(r, 4, 12), p = n2 * (n2 - 1), hs = r.chance(.5);
   return QQ({
    q: hs ? LT("**" + n2 + " bạn** gặp nhau, **hai bạn bất kì** bắt tay nhau đúng một lần. Hỏi có tất cả bao nhiêu cái bắt tay?", "**" + n2 + " friends** meet, and **every two friends** shake hands exactly once. How many handshakes are there in all?") : LT("**" + n2 + " đội bóng** thi đấu vòng tròn: **hai đội bất kì** đấu với nhau đúng một trận. Hỏi có tất cả bao nhiêu trận đấu?", "**" + n2 + " football teams** play in a league: **every two teams** play each other exactly once. How many matches are there in all?"),
    parts: [num("", p / 2, hs ? LT("cái", "handshakes") : LT("trận", "matches"))],
    steps: [st(LT("Mỗi " + (hs ? "bạn bắt tay với " : "đội đấu với ") + (n2 - 1) + " " + (hs ? "bạn" : "đội") + " khác: " + n2 + " × " + (n2 - 1) + " = " + p, "Each " + (hs ? "friend shakes hands with " : "team plays ") + (n2 - 1) + " other " + (hs ? "friends" : "teams") + ": " + n2 + " × " + (n2 - 1) + " = " + p), p), st(LT("Mỗi " + (hs ? "cái bắt tay" : "trận") + " bị đếm 2 lần nên chia 2: " + p + " : 2 = " + p / 2, "Each " + (hs ? "handshake" : "match") + " was counted twice, so divide by 2: " + p + " ÷ 2 = " + p / 2), p / 2)],
    tip: LT("Mỗi cặp bị đếm hai lần: A với B và B với A.", "Each pair is counted twice: A with B and B with A.")
   });
  }
  if (t3 === 4) {
   var opts = r.shuffle([
    { n: 5, vi: "là số lẻ", en: "is an odd number" },
    { n: 5, vi: "là số chẵn", en: "is an even number" },
    { n: 10, vi: "là chữ số bất kì", en: "can be any digit" },
    { n: 4, vi: "lớn hơn 5", en: "is greater than 5" },
    { n: 3, vi: "bé hơn 3", en: "is less than 3" }
   ]).slice(0, 3), pl = [["hàng trăm", "hundreds"], ["hàng chục", "tens"], ["hàng đơn vị", "ones"]], prod = opts[0].n * opts[1].n * opts[2].n;
   var viq = "Một ổ khoá có **mật khẩu gồm 3 chữ số** (chữ số 0 được dùng, các chữ số có thể giống nhau). Biết: ", enq = "A lock has a **password of 3 digits** (0 can be used and digits may repeat). We know: ", i;
   for (i = 0; i < 3; i++) { viq += "chữ số " + pl[i][0] + " " + opts[i].vi + (i < 2 ? "; " : ". "); enq += "the " + pl[i][1] + " digit " + opts[i].en + (i < 2 ? "; " : ". "); }
   return QQ({
    q: LT(viq + "Hỏi có bao nhiêu mật khẩu như vậy?", enq + "How many such passwords are there?"),
    parts: [num("", prod, LT("mật khẩu", "passwords"))],
    steps: [st(LT("Số cách chọn từng hàng (trăm, chục, đơn vị): " + opts[0].n + ", " + opts[1].n + ", " + opts[2].n + " cách.", "Choices for each place (hundreds, tens, ones): " + opts[0].n + ", " + opts[1].n + ", " + opts[2].n + ".")), st(LT(opts[0].n + " × " + opts[1].n + " × " + opts[2].n + " = " + prod + " (mật khẩu)", opts[0].n + " × " + opts[1].n + " × " + opts[2].n + " = " + prod + " (passwords)"), prod)],
    tip: LT("Đếm xem mỗi hàng có mấy chữ số thoả điều kiện rồi nhân.", "Count how many digits fit each place, then multiply.")
   });
  }
  var k5 = rd(r, 5, 7), d5 = nz(k5), tt = r.pick(d5.slice(0, k5 - 2)), hcount = d5.filter(function (z) { return z > tt }).length,
   v5 = hcount * (k5 - 1) * (k5 - 2);
  if (brute(d5, 3, true, function (v) { return Math.floor(v / 100) > tt }) !== v5) throw new Error("count5");
  return QQ({
   q: LT("Từ các chữ số **" + dl(d5) + "**, lập các số có **3 chữ số khác nhau** mà **chữ số hàng trăm lớn hơn " + tt + "**. Hỏi lập được bao nhiêu số như vậy?", "From the digits **" + dl(d5) + "**, make **3-digit numbers with different digits** where the **hundreds digit is greater than " + tt + "**. How many such numbers are there?"),
   parts: [num("", v5, NUMS)],
   steps: [st(LT("Hàng trăm chọn trong các chữ số lớn hơn " + tt + ": " + dl(d5.filter(function (z) { return z > tt })) + " (" + hcount + " cách).", "The hundreds digit comes from the digits greater than " + tt + ": " + dl(d5.filter(function (z) { return z > tt })) + " (" + hcount + " choices)."), hcount), st(LT("Hàng chục: còn " + (k5 - 1) + " cách. Hàng đơn vị: còn " + (k5 - 2) + " cách.", "Tens: " + (k5 - 1) + " left. Ones: " + (k5 - 2) + " left.")), st(LT(hcount + " × " + (k5 - 1) + " × " + (k5 - 2) + " = " + v5 + " (số)", hcount + " × " + (k5 - 1) + " × " + (k5 - 2) + " = " + v5 + " (numbers)"), v5)],
   tip: LT("Chọn hàng trăm trước (theo điều kiện), rồi đến hàng chục và hàng đơn vị.", "Choose the hundreds digit first (it has the condition), then the tens and ones.")
  });
 }
});

})();

;(function(){/* digits.js */
/* Bài mới: Đếm chữ số (đánh số trang) */
(function () {
  const T = (x, y, vi, en, o) => TH.t(x, y, LT(vi, en), o);
  /* tổng số chữ số để viết các số từ 1 đến n */
  const dg = n => { let s = 0; for (let i = 1; i <= n; i++) s += String(i).length; return s; };
  const F = fmt;
  const nm = r => r.pick([["Lan", "Lan"], ["Minh", "Minh"], ["Hoa", "Hoa"], ["Nam", "Nam"], ["Mai", "Mai"], ["Tú", "Tú"]]);

  function grpRows(rows, extra) {
    let s = "";
    rows.forEach((rw, i) => {
      const y = 14 + i * 56;
      s += TH.box(10, y, 135, 44, rw[0], rw[1], { s: 19, dash: rw[4] });
      s += TH.arr(150, y + 22, 180, y + 22, {});
      s += T(188, y + 29, rw[2], rw[3], { s: 17, a: "start" });
    });
    return s + (extra || "");
  }
  const F0 = () => TH.svg(190, grpRows([
    ["1 → 9", "sky", "mỗi số: 1 chữ số", "each: 1 digit"],
    ["10 → 99", "mint", "mỗi số: 2 chữ số", "each: 2 digits"],
    ["100 → 120", "rose", "mỗi số: 3 chữ số", "each: 3 digits"]]));
  const F1 = () => TH.svg(190, grpRows([
    ["1 → 9", "sky", "9 × 1 = 9", "9 × 1 = 9"],
    ["10 → 99", "mint", "90 × 2 = 180", "90 × 2 = 180"],
    ["100 → 120", "white", "? chữ số", "? digits", "6 5"]]));
  const F2 = () => {
    let s = "";
    ["100", "101", "102", "…", "120"].forEach((v, i) => { s += TH.box(10 + i * 70, 24, 60, 40, v, i === 3 ? "white" : "rose", { s: 19 }); });
    s += TH.brace(10, 350, 72, null);
    s += T(180, 124, "120 − 100 + 1 = 21 số", "120 − 100 + 1 = 21 numbers", { s: 20 });
    s += T(180, 158, "21 × 3 = 63 chữ số", "21 × 3 = 63 digits", { s: 20 });
    return TH.svg(176, s);
  };
  const F3 = () => TH.svg(236, grpRows([
    ["1 → 9", "sky", "9 × 1 = 9", "9 × 1 = 9"],
    ["10 → 99", "mint", "90 × 2 = 180", "90 × 2 = 180"],
    ["100 → 120", "rose", "21 × 3 = 63", "21 × 3 = 63"]],
    TH.box(30, 184, 300, 42, LT("9 + 180 + 63 = 252 chữ số", "9 + 180 + 63 = 252 digits"), "mint", { s: 18, sw: 3 })));
  const F4 = () => {
    let s = T(110, 22, "trang 1–99", "pages 1–99", { s: 15 }) + T(310, 22, "còn lại", "left", { s: 15 });
    s += TH.tape(10, 32, 340, 46, [{ u: 189, f: "sky", t: "189" }, { u: 111, f: "rose", t: "?" }]);
    s += TH.brace(10, 350, 84, "300");
    s += T(180, 150, "Đã dùng 300 chữ số", "300 digits were used", { s: 18 });
    return TH.svg(168, s);
  };
  const F5 = () => {
    let s = T(180, 30, "300 − 189 = 111 chữ số", "300 − 189 = 111 digits", { s: 18 });
    s += T(180, 62, "111 : 3 = 37 trang (từ trang 100)", "111 ÷ 3 = 37 pages (from page 100)", { s: 17 });
    s += TH.box(50, 84, 260, 44, LT("99 + 37 = 136 trang", "99 + 37 = 136 pages"), "mint", { s: 20, sw: 3 });
    return TH.svg(145, s);
  };

  /* ---------- sinh đề ---------- */
  const sp = (vi, en) => LT(vi, en);

  function pagesTo(n) { /* tổng chữ số trang 1..n, kèm các bước */
    const tot = dg(n);
    if (n <= 9) return { tot, steps: [st(sp(n + " × 1 = " + n, n + " × 1 = " + n), tot)] };
    if (n <= 99) {
      return { tot, steps: [
        st(sp("Trang 1 → 9: 9 số, mỗi số 1 chữ số: 9 × 1 = 9", "Pages 1 → 9: 9 numbers, 1 digit each: 9 × 1 = 9"), 9),
        st(sp("Trang 10 → " + n + ": " + n + " − 10 + 1 = " + (n - 9) + " số, mỗi số 2 chữ số: " + (n - 9) + " × 2 = " + 2 * (n - 9), "Pages 10 → " + n + ": " + n + " − 10 + 1 = " + (n - 9) + " numbers, 2 digits each: " + (n - 9) + " × 2 = " + 2 * (n - 9)), 2 * (n - 9)),
        st(sp("Tổng: 9 + " + 2 * (n - 9) + " = " + tot, "Total: 9 + " + 2 * (n - 9) + " = " + tot), tot)] };
    }
    const k = n - 99;
    return { tot, steps: [
      st(sp("Trang 1 → 9: 9 × 1 = 9; trang 10 → 99: 90 × 2 = 180", "Pages 1 → 9: 9 × 1 = 9; pages 10 → 99: 90 × 2 = 180"), 189),
      st(sp("Trang 100 → " + n + ": " + n + " − 100 + 1 = " + k + " số, mỗi số 3 chữ số: " + k + " × 3 = " + 3 * k, "Pages 100 → " + n + ": " + n + " − 100 + 1 = " + k + " numbers, 3 digits each: " + k + " × 3 = " + 3 * k), 3 * k),
      st(sp("Tổng: 189 + " + 3 * k + " = " + F(tot), "Total: 189 + " + 3 * k + " = " + F(tot)), tot)] };
  }
  const tipGroups = () => sp("Chia các trang thành nhóm 1, 2, 3 chữ số rồi tính từng nhóm.", "Split the pages into 1-, 2- and 3-digit groups and work out each group.");

  const MULTS = {
    2: [["chẵn", "even numbers", 10, 98, 2], ["lẻ", "odd numbers", 11, 99, 2], ["chia hết cho 5", "numbers divisible by 5", 10, 95, 5], ["chia hết cho 10", "numbers divisible by 10", 10, 90, 10], ["chia hết cho 4", "numbers divisible by 4", 12, 96, 4]],
    3: [["chẵn", "even numbers", 100, 998, 2], ["lẻ", "odd numbers", 101, 999, 2], ["chia hết cho 5", "numbers divisible by 5", 100, 995, 5], ["chia hết cho 10", "numbers divisible by 10", 100, 990, 10], ["chia hết cho 4", "numbers divisible by 4", 100, 996, 4]]
  };

  function seqDigits(r, tier) {
    const g = tier === 2 ? r.pick([2, 3]) : 3, m = r.pick(MULTS[g]);
    const cnt = (m[3] - m[2]) / m[4] + 1, tot = cnt * g;
    const isOdd = m[1] === "odd numbers";
    return QQ({
      q: sp("Viết liền nhau tất cả các số " + m[0] + " có " + g + " chữ số. Hỏi phải viết bao nhiêu chữ số?", "Write down all the " + g + "-digit " + m[1] + ". How many digits do you have to write?"),
      parts: [num(sp("Số chữ số", "Digits"), tot, sp("chữ số", "digits"))],
      steps: [
        st(sp("Các số " + m[0] + " có " + g + " chữ số: " + m[2] + ", " + (m[2] + m[4]) + ", …, " + m[3] + " (cách đều " + m[4] + ")", "The " + g + "-digit " + m[1] + ": " + m[2] + ", " + (m[2] + m[4]) + ", …, " + m[3] + " (step " + m[4] + ")")),
        st(sp("Số các số: (" + m[3] + " − " + m[2] + ") : " + m[4] + " + 1 = " + cnt, "How many numbers: (" + m[3] + " − " + m[2] + ") ÷ " + m[4] + " + 1 = " + cnt), cnt),
        st(sp("Số chữ số: " + cnt + " × " + g + " = " + F(tot), "Digits: " + cnt + " × " + g + " = " + F(tot)), tot)],
      tip: sp("Đếm có bao nhiêu số trước (nhớ + 1), rồi nhân với số chữ số của mỗi số.", "First count how many numbers there are (remember + 1), then multiply by the digits in each number.")
    });
  }

  function nthDigit(r) {
    let N, base, g, rr, q, m, digit, number, pos;
    for (let t = 0; t < 80; t++) {
      N = r.pick([0, 1]) ? rd(r, 15, 188) : rd(r, 192, 600);
      g = N <= 189 ? 2 : 3;
      base = g === 2 ? 9 : 189;
      rr = N - base; q = Math.floor(rr / g); m = rr % g;
      if (m === 0) { number = (g === 2 ? 9 : 99) + q; pos = g; } else { number = (g === 2 ? 10 : 100) + q; pos = m; }
      digit = +String(number)[pos - 1];
      if (digit !== 0) break;
    }
    const grp = g === 2 ? sp("2 chữ số", "2-digit") : sp("3 chữ số", "3-digit");
    return QQ({
      q: TT3 + sp("Viết liền các số tự nhiên từ 1 trở đi: **123456789101112…** Hỏi chữ số thứ **" + N + "** là chữ số nào?", "Write the natural numbers one after another starting from 1: **123456789101112…** Which digit is in position **" + N + "**?"),
      parts: [num(sp("Chữ số thứ " + N, "Digit number " + N), digit)],
      steps: [
        st(sp("Các số " + (g === 2 ? "1 chữ số (1 → 9)" : "1 và 2 chữ số (1 → 99)") + " dùng hết " + base + " chữ số. Còn lại: " + N + " − " + base + " = " + rr, (g === 2 ? "The 1-digit numbers (1 → 9)" : "The 1- and 2-digit numbers (1 → 99)") + " use " + base + " digits. Left: " + N + " − " + base + " = " + rr), rr),
        st(sp(rr + " : " + g + " = " + q + " (dư " + m + ")", rr + " ÷ " + g + " = " + q + " (remainder " + m + ")")),
        st(m === 0
          ? sp("Dư 0 nên chữ số cần tìm là chữ số cuối của số " + grp + " thứ " + q + ", tức số " + number, "Remainder 0, so the digit is the last digit of the " + q + "th " + grp + " number, which is " + number)
          : sp("Dư " + m + " nên chữ số cần tìm là chữ số thứ " + m + " của số " + grp + " thứ " + (q + 1) + ", tức số " + number, "Remainder " + m + ", so the digit is digit number " + m + " of the " + (q + 1) + "th " + grp + " number, which is " + number)),
        st(sp("Chữ số đó là " + digit, "That digit is " + digit), digit)],
      tip: sp("Trừ đi số chữ số của các nhóm đầu, rồi chia cho số chữ số của mỗi số trong nhóm.", "Subtract the digits used by the earlier groups, then divide by the digits per number in the group.")
    });
  }
  const TT3 = "";

  LESSON({
    id: "digits", reg: "toan", emoji: "📖", optional: true, adv: true,
    title: LT("Đếm chữ số (đánh số trang)", "Counting digits (page numbers)"),
    blurb: LT("Đánh số trang sách cần bao nhiêu chữ số?", "How many digits does it take to number a book?"),
    links: ["place"],
    rule: {
      h: LT("Ghi nhớ", "Remember"),
      items: [
        LT("Chia các số thành nhóm: **1 chữ số** (1–9), **2 chữ số** (10–99), **3 chữ số** (100–999).", "Split the numbers into groups: **1-digit** (1–9), **2-digit** (10–99), **3-digit** (100–999)."),
        LT("Số các số từ a đến b là **b − a + 1**.", "The count of numbers from a to b is **b − a + 1**."),
        LT("Mỗi nhóm: **số các số × số chữ số của mỗi số**, rồi cộng các nhóm lại.", "For each group: **how many numbers × digits in each number**, then add the groups.")
      ]
    },
    figs: { a: () => RAWFIG([F0, F1, F2, F3, F4, F5]) },
    teach: [
      { key: "a", f: 0, say: LT("Một quyển sách dày **120 trang**. Ta chia số trang thành 3 nhóm: trang 1–9 (1 chữ số), trang 10–99 (2 chữ số), trang 100–120 (3 chữ số).", "A book has **120 pages**. Split the page numbers into 3 groups: pages 1–9 (1 digit), pages 10–99 (2 digits), pages 100–120 (3 digits).") },
      { key: "a", f: 1, say: LT("Nhóm 1 chữ số có 9 số: 9 × 1 = **9** chữ số. Nhóm 2 chữ số có 99 − 10 + 1 = 90 số: 90 × 2 = **180** chữ số.", "The 1-digit group has 9 numbers: 9 × 1 = **9** digits. The 2-digit group has 99 − 10 + 1 = 90 numbers: 90 × 2 = **180** digits.") },
      { key: "a", f: 2, say: LT("Nhóm 3 chữ số, từ 100 đến 120, có 120 − 100 + 1 = **21 số** (nhớ cộng 1!). Vậy dùng 21 × 3 = **63** chữ số.", "The 3-digit group, from 100 to 120, has 120 − 100 + 1 = **21 numbers** (remember the +1!). So it uses 21 × 3 = **63** digits.") },
      { key: "a", f: 3, say: LT("Cùng làm: cộng ba nhóm lại 9 + 180 + 63 = ?", "Let's try: add the three groups, 9 + 180 + 63 = ?"), ask: { opts: ["242", "252", "262"], ans: "252", good: LT("Đúng rồi! Cần 252 chữ số.", "Right! It takes 252 digits.") } },
      { key: "a", f: 4, say: LT("Bài ngược: đánh số trang một quyển sách hết **300 chữ số**. Trang 1–99 đã dùng 189 chữ số. Phần còn lại là 300 − 189 = 111 chữ số.", "Backwards: numbering a book used **300 digits**. Pages 1–99 used 189 digits. What is left is 300 − 189 = 111 digits.") },
      { key: "a", f: 5, say: LT("Từ trang 100, mỗi trang dùng 3 chữ số. Cùng làm: 111 : 3 = ? trang nữa.", "From page 100 on, each page uses 3 digits. Let's try: 111 ÷ 3 = ? more pages."), ask: { opts: ["36", "37", "38"], ans: "37", good: LT("Đúng! Sách có 99 + 37 = 136 trang.", "Right! The book has 99 + 37 = 136 pages.") } }
    ],
    gen(tier, r) {
      if (tier === 1) {
        const k = r.pick([0, 1, 2, 3, 4]);
        if (k === 0) {
          const n = rd(r, 12, 99), p = pagesTo(n);
          return QQ({ q: sp("Một quyển sách dày **" + n + " trang**. Hỏi đánh số trang từ 1 đến " + n + " cần bao nhiêu chữ số?", "A book has **" + n + " pages**. How many digits are needed to number the pages from 1 to " + n + "?"), parts: [num(sp("Số chữ số", "Digits"), p.tot, sp("chữ số", "digits"))], steps: p.steps, tip: tipGroups() });
        }
        if (k === 1) {
          const a = rd(r, 100, 400), b = a + rd(r, 10, 60);
          return QQ({ q: sp("Từ **" + a + "** đến **" + b + "** có bao nhiêu số tự nhiên?", "How many natural numbers are there from **" + a + "** to **" + b + "**?"), parts: [num(sp("Số các số", "Count"), b - a + 1, sp("số", "numbers"))], steps: [st(sp(b + " − " + a + " + 1 = " + (b - a + 1), b + " − " + a + " + 1 = " + (b - a + 1)), b - a + 1)], tip: sp("Lấy số cuối trừ số đầu rồi cộng thêm 1.", "Subtract the first from the last, then add 1.") });
        }
        if (k === 2) {
          const a = rd(r, 10, 70), b = a + rd(r, 8, 25), c = b - a + 1;
          return QQ({ q: sp("Viết liền các số từ **" + a + "** đến **" + b + "**. Hỏi phải viết bao nhiêu chữ số?", "Write the numbers from **" + a + "** to **" + b + "** one after another. How many digits do you write?"), parts: [num(sp("Số chữ số", "Digits"), 2 * c, sp("chữ số", "digits"))], steps: [st(sp("Số các số: " + b + " − " + a + " + 1 = " + c, "How many numbers: " + b + " − " + a + " + 1 = " + c), c), st(sp("Mỗi số có 2 chữ số: " + c + " × 2 = " + 2 * c, "Each number has 2 digits: " + c + " × 2 = " + 2 * c), 2 * c)], tip: sp("Đếm số các số trước, rồi nhân với 2.", "Count the numbers first, then multiply by 2.") });
        }
        if (k === 3) {
          const a = rd(r, 100, 800), b = a + rd(r, 6, 30), c = b - a + 1;
          return QQ({ q: sp("Để đánh số trang từ trang **" + a + "** đến trang **" + b + "** cần bao nhiêu chữ số?", "How many digits are needed to number the pages from page **" + a + "** to page **" + b + "**?"), parts: [num(sp("Số chữ số", "Digits"), 3 * c, sp("chữ số", "digits"))], steps: [st(sp("Số trang: " + b + " − " + a + " + 1 = " + c, "Number of pages: " + b + " − " + a + " + 1 = " + c), c), st(sp("Mỗi trang có số 3 chữ số: " + c + " × 3 = " + 3 * c, "Each page number has 3 digits: " + c + " × 3 = " + 3 * c), 3 * c)], tip: sp("Số trang × 3 chữ số.", "Number of pages × 3 digits.") });
        }
        const n = rd(r, 103, 160);
        return QQ({ q: sp("Một quyển sách dày **" + n + " trang**. Có bao nhiêu trang được đánh số bằng số có 3 chữ số?", "A book has **" + n + " pages**. How many pages are numbered with a 3-digit number?"), parts: [num(sp("Số trang", "Pages"), n - 99, sp("trang", "pages"))], steps: [st(sp("Số có 3 chữ số bắt đầu từ trang 100 đến trang " + n, "3-digit numbers run from page 100 to page " + n)), st(sp(n + " − 100 + 1 = " + (n - 99), n + " − 100 + 1 = " + (n - 99)), n - 99)], tip: sp("Đếm các trang từ 100 đến trang cuối (nhớ + 1).", "Count the pages from 100 to the last page (remember + 1).") });
      }
      if (tier === 2) {
        const k = r.pick([0, 1, 2, 3, 4]);
        if (k === 0) {
          const n = rd(r, 101, 380), p = pagesTo(n);
          return QQ({ q: sp("Một quyển sách dày **" + n + " trang**. Hỏi đánh số trang từ 1 đến " + n + " cần bao nhiêu chữ số?", "A book has **" + n + " pages**. How many digits are needed to number the pages from 1 to " + n + "?"), parts: [num(sp("Số chữ số", "Digits"), p.tot, sp("chữ số", "digits"))], steps: p.steps, tip: tipGroups() });
        }
        if (k === 1) {
          const a = rd(r, 50, 94), b = rd(r, 104, 160), c2 = 99 - a + 1, c3 = b - 99, tot = 2 * c2 + 3 * c3;
          return QQ({ q: sp("Một cuốn tập san chỉ in các trang từ **" + a + "** đến **" + b + "**. Hỏi cần bao nhiêu chữ số để đánh số các trang đó?", "A magazine only prints pages **" + a + "** to **" + b + "**. How many digits are needed to number those pages?"), parts: [num(sp("Số chữ số", "Digits"), tot, sp("chữ số", "digits"))], steps: [
            st(sp("Trang " + a + " → 99: 99 − " + a + " + 1 = " + c2 + " số, mỗi số 2 chữ số: " + c2 + " × 2 = " + 2 * c2, "Pages " + a + " → 99: 99 − " + a + " + 1 = " + c2 + " numbers, 2 digits each: " + c2 + " × 2 = " + 2 * c2), 2 * c2),
            st(sp("Trang 100 → " + b + ": " + b + " − 100 + 1 = " + c3 + " số, mỗi số 3 chữ số: " + c3 + " × 3 = " + 3 * c3, "Pages 100 → " + b + ": " + b + " − 100 + 1 = " + c3 + " numbers, 3 digits each: " + c3 + " × 3 = " + 3 * c3), 3 * c3),
            st(sp("Tổng: " + 2 * c2 + " + " + 3 * c3 + " = " + tot, "Total: " + 2 * c2 + " + " + 3 * c3 + " = " + tot), tot)], tip: sp("Tách thành nhóm 2 chữ số và nhóm 3 chữ số.", "Split into a 2-digit group and a 3-digit group.") });
        }
        if (k === 2) {
          const n = rd(r, 20, 95), D = dg(n), who = nm(r);
          return QQ({ q: sp(who[0] + " đánh số trang một quyển sách (từ trang 1) hết **" + D + " chữ số**. Biết sách dày dưới 100 trang. Hỏi sách có bao nhiêu trang?", who[1] + " numbered the pages of a book (from page 1) using **" + D + " digits**. The book has fewer than 100 pages. How many pages does it have?"), parts: [num(sp("Số trang", "Pages"), n, sp("trang", "pages"))], steps: [
            st(sp("Trang 1 → 9 dùng 9 chữ số. Còn lại: " + D + " − 9 = " + (D - 9) + " chữ số", "Pages 1 → 9 use 9 digits. Left: " + D + " − 9 = " + (D - 9) + " digits"), D - 9),
            st(sp("Mỗi trang từ 10 có 2 chữ số: " + (D - 9) + " : 2 = " + (n - 9) + " trang", "Each page from 10 has 2 digits: " + (D - 9) + " ÷ 2 = " + (n - 9) + " pages"), n - 9),
            st(sp("Số trang: 9 + " + (n - 9) + " = " + n, "Number of pages: 9 + " + (n - 9) + " = " + n), n)], tip: sp("Trừ 9 chữ số của các trang 1–9 rồi chia cho 2.", "Subtract the 9 digits of pages 1–9, then divide by 2.") });
        }
        if (k === 3) {
          const n = rd(r, 110, 320), c = n - 99, tot = dg(n);
          return QQ({ q: sp("Một quyển sách dày **" + n + " trang**. Hỏi: có bao nhiêu trang đánh số bằng số có 3 chữ số, và đánh số cả quyển cần bao nhiêu chữ số?", "A book has **" + n + " pages**. How many pages have a 3-digit page number, and how many digits are needed to number the whole book?"), parts: [num(sp("Số trang có 3 chữ số", "Pages with 3 digits"), c, sp("trang", "pages")), num(sp("Tổng số chữ số", "Total digits"), tot, sp("chữ số", "digits"))], steps: [
            st(sp("Trang 100 → " + n + ": " + n + " − 100 + 1 = " + c + " trang", "Pages 100 → " + n + ": " + n + " − 100 + 1 = " + c + " pages"), c),
            st(sp("Trang 1 → 99 dùng 9 + 90 × 2 = 189 chữ số", "Pages 1 → 99 use 9 + 90 × 2 = 189 digits"), 189),
            st(sp("Các trang 3 chữ số dùng " + c + " × 3 = " + 3 * c + " chữ số", "The 3-digit pages use " + c + " × 3 = " + 3 * c + " digits"), 3 * c),
            st(sp("Tổng: 189 + " + 3 * c + " = " + F(tot), "Total: 189 + " + 3 * c + " = " + F(tot)), tot)], tip: tipGroups() });
        }
        return seqDigits(r, 2);
      }
      /* tier 3 */
      const k = r.pick([0, 1, 2, 3, 4, 5]);
      if (k === 0) {
        const n = rd(r, 130, 420), D = dg(n), who = nm(r), c = n - 99;
        return QQ({ q: sp("Cô thư viện dán số thứ tự lên một chồng sách (từ số 1) và dùng hết **" + F(D) + " chữ số**. Hỏi cô đã dán số cho bao nhiêu quyển sách?", "A librarian sticks numbers on a pile of books (starting from 1) and uses **" + F(D) + " digits**. How many books did she number?"), parts: [num(sp("Số quyển sách", "Books"), n, sp("quyển", "books"))], steps: [
          st(sp("Số 1 → 99 dùng 9 + 90 × 2 = 189 chữ số", "Numbers 1 → 99 use 9 + 90 × 2 = 189 digits"), 189),
          st(sp("Số có 3 chữ số dùng: " + F(D) + " − 189 = " + (D - 189) + " chữ số", "The 3-digit numbers use: " + F(D) + " − 189 = " + (D - 189) + " digits"), D - 189),
          st(sp("Số các số có 3 chữ số: " + (D - 189) + " : 3 = " + c, "How many 3-digit numbers: " + (D - 189) + " ÷ 3 = " + c), c),
          st(sp("Số quyển sách: 99 + " + c + " = " + n, "Number of books: 99 + " + c + " = " + n), n)], tip: sp("Trừ phần đã dùng cho số 1 → 99, rồi chia cho 3.", "Subtract what numbers 1 → 99 used, then divide by 3.") });
      }
      if (k === 1) {
        const n = rd(r, 180, 300), a = rd(r, 30, 80), b = rd(r, 100, 130), who = nm(r);
        const tot = dg(n), c2 = 99 - a + 1, c3 = b - 99, rem = 2 * c2 + 3 * c3;
        return QQ({ q: sp("Quyển truyện của " + who[0] + " dày **" + n + " trang**. Bạn xé đi các trang từ trang **" + a + "** đến trang **" + b + "**. Hỏi các trang bị xé đã dùng bao nhiêu chữ số để đánh số, và các trang còn lại dùng bao nhiêu chữ số?", who[1] + "'s storybook has **" + n + " pages**. " + who[1] + " tears out the pages from page **" + a + "** to page **" + b + "**. How many digits were used to number the torn-out pages, and how many digits are used for the remaining pages?"),
          parts: [num(sp("Các trang bị xé", "Torn-out pages"), rem, sp("chữ số", "digits")), num(sp("Các trang còn lại", "Remaining pages"), tot - rem, sp("chữ số", "digits"))], steps: [
            st(sp("Trang " + a + " → 99: " + c2 + " số × 2 = " + 2 * c2 + " chữ số", "Pages " + a + " → 99: " + c2 + " numbers × 2 = " + 2 * c2 + " digits"), 2 * c2),
            st(sp("Trang 100 → " + b + ": " + c3 + " số × 3 = " + 3 * c3 + " chữ số. Các trang bị xé: " + 2 * c2 + " + " + 3 * c3 + " = " + rem, "Pages 100 → " + b + ": " + c3 + " numbers × 3 = " + 3 * c3 + " digits. Torn-out pages: " + 2 * c2 + " + " + 3 * c3 + " = " + rem), rem),
            st(sp("Cả quyển: 189 + " + (n - 99) + " × 3 = " + F(tot) + " chữ số", "Whole book: 189 + " + (n - 99) + " × 3 = " + F(tot) + " digits"), tot),
            st(sp("Các trang còn lại: " + F(tot) + " − " + rem + " = " + F(tot - rem), "Remaining pages: " + F(tot) + " − " + rem + " = " + F(tot - rem)), tot - rem)], tip: sp("Tính số chữ số của cả quyển rồi trừ đi phần bị xé.", "Find the digits of the whole book, then subtract the torn-out part.") });
      }
      if (k === 2) {
        const n = rd(r, 100, 300), s = r.pick([2, 3, 4, 5]), tot = dg(n), who = nm(r);
        return QQ({ q: sp("Bác thợ in viết tay số trang cho một quyển sách dày **" + n + " trang**. Mỗi chữ số bác viết mất **" + s + " giây**. Hỏi bác viết xong tất cả số trang mất bao nhiêu giây?", "A printer writes the page numbers of a **" + n + "-page** book by hand. Each digit takes **" + s + " seconds**. How many seconds does it take to write all the page numbers?"), parts: [num(sp("Thời gian", "Time"), tot * s, sp("giây", "seconds"))], steps: pagesTo(n).steps.concat([st(sp("Thời gian: " + F(tot) + " × " + s + " = " + F(tot * s) + " (giây)", "Time: " + F(tot) + " × " + s + " = " + F(tot * s) + " (seconds)"), tot * s)]), tip: sp("Tìm tổng số chữ số trước, rồi nhân với thời gian của mỗi chữ số.", "Find the total digits first, then multiply by the time for each digit.") });
      }
      if (k === 3) {
        const n1 = rd(r, 40, 99), n2 = rd(r, 120, 260), d1 = dg(n1), d2 = dg(n2), c = n2 - 99;
        return QQ({ q: sp("Quyển sách Toán dày **" + n1 + " trang**, quyển sách Văn dày **" + n2 + " trang**. Hỏi đánh số trang cả hai quyển cần tất cả bao nhiêu chữ số, và quyển Văn dùng nhiều hơn quyển Toán bao nhiêu chữ số?", "The Math book has **" + n1 + " pages** and the Literature book has **" + n2 + " pages**. How many digits are needed to number the pages of both books, and how many more digits does the Literature book use than the Math book?"),
          parts: [num(sp("Cả hai quyển", "Both books"), d1 + d2, sp("chữ số", "digits")), num(sp("Quyển Văn nhiều hơn", "Literature uses more by"), d2 - d1, sp("chữ số", "digits"))], steps: [
            st(sp("Quyển Toán: 9 + (" + n1 + " − 9) × 2 = " + d1 + " chữ số", "Math book: 9 + (" + n1 + " − 9) × 2 = " + d1 + " digits"), d1),
            st(sp("Quyển Văn: 189 + " + c + " × 3 = " + d2 + " chữ số", "Literature book: 189 + " + c + " × 3 = " + d2 + " digits"), d2),
            st(sp("Cả hai: " + d1 + " + " + d2 + " = " + (d1 + d2), "Both: " + d1 + " + " + d2 + " = " + (d1 + d2)), d1 + d2),
            st(sp("Hơn kém: " + d2 + " − " + d1 + " = " + (d2 - d1), "Difference: " + d2 + " − " + d1 + " = " + (d2 - d1)), d2 - d1)], tip: sp("Tính riêng từng quyển (chia nhóm chữ số), rồi cộng và trừ.", "Work out each book separately (split into digit groups), then add and subtract.") });
      }
      if (k === 4) return nthDigit(r);
      return seqDigits(r, 3);
    }
  });
})();

})();

;(function(){/* divis.js */
/* Bài: Dấu hiệu chia hết (divis) */
const dvDs = n => String(n).split("").reduce((a, c) => a + (+c), 0);
const dvGrp = s => String(s).replace(/\B(?=(.{3})+$)/g, NB);
const dvYN = () => [LT("Có", "Yes"), LT("Không", "No")];
const dvLcm = (a, b) => a * b / gcd(a, b);
const dvTry = (r, lo, hi, pred, used) => {
 let n, g = 0;
 do { n = rd(r, lo, hi); g++; } while ((!pred(n) || (used && used.indexOf(n) >= 0)) && g < 3000);
 return n;
};
const dvJoin = a => a.map(x => fmt(x)).join("; ");
/* một bước giải thích n có/không chia hết cho k */
const dvWhy = (n, k) => {
 const ok = n % k === 0, s = String(n);
 if (k === 2 || k === 5) {
  const d = n % 10;
  return st(LT("Số " + fmt(n) + " có chữ số tận cùng là " + d + ", nên " + (ok ? "chia hết" : "không chia hết") + " cho " + k + ".",
   fmt(n) + " ends in " + d + ", so it is " + (ok ? "" : "not ") + "divisible by " + k + "."), d);
 }
 const sum = dvDs(n), ex = s.split("").join(" + ");
 return st(LT("Tổng các chữ số: " + ex + " = " + sum + ". " + sum + (sum % k === 0 ? " chia hết" : " không chia hết") + " cho " + k + " nên " + fmt(n) + (ok ? " chia hết" : " không chia hết") + " cho " + k + ".",
  "Digit sum: " + ex + " = " + sum + ". " + sum + " is " + (sum % k === 0 ? "" : "not ") + "divisible by " + k + ", so " + fmt(n) + " is " + (ok ? "" : "not ") + "divisible by " + k + "."), sum);
};
const dvRuleTip = k => k === 2 ? LT("Nhìn chữ số tận cùng: 0, 2, 4, 6, 8.", "Look at the last digit: 0, 2, 4, 6, 8.")
 : k === 5 ? LT("Nhìn chữ số tận cùng: 0 hoặc 5.", "Look at the last digit: 0 or 5.")
 : LT("Cộng các chữ số, xem tổng có chia hết cho " + k + " không.", "Add the digits and check whether the sum is divisible by " + k + ".");

/* hình */
const dvDigits = (str, y, fills, o) => {
 o = o || {};
 const n = str.length, w = 48, g = 6, h = o.h || 50, x0 = (360 - (n * w + (n - 1) * g)) / 2;
 let s = "";
 for (let i = 0; i < n; i++) s += TH.box(x0 + i * (w + g), y, w, h, str[i], fills[i] || "sky", { s: 26 });
 return { s, x0, w, g, h };
};
const dvTwo = (x, y, w, h, l1, l2, fill) => TH.r(x, y, w, h, fill, {}) + TH.t(x + w / 2, y + h / 2 - 4, l1, { s: 17 }) + TH.t(x + w / 2, y + h / 2 + 17, l2, { s: 16 });

LESSON({
 id: "divis", reg: "so", emoji: "🔍", optional: true, adv: true,
 title: LT("Dấu hiệu chia hết", "Divisibility Rules"),
 blurb: LT("Nhìn chữ số để biết có chia hết cho 2, 3, 5, 9", "Use the digits to tell if a number is divisible by 2, 3, 5 or 9"),
 links: ["div"],
 rule: {
  h: LT("Ghi nhớ", "Remember"),
  items: [
   LT("Chia hết cho **2**: tận cùng là 0, 2, 4, 6, 8. Chia hết cho **5**: tận cùng là 0 hoặc 5.", "Divisible by **2**: the last digit is 0, 2, 4, 6 or 8. Divisible by **5**: the last digit is 0 or 5."),
   LT("Chia hết cho **3** (hoặc **9**): **tổng các chữ số** chia hết cho 3 (hoặc 9).", "Divisible by **3** (or **9**): the **sum of the digits** is divisible by 3 (or 9)."),
   LT("Số chia hết cho 9 thì chia hết cho 3, nhưng **ngược lại không đúng**.", "A number divisible by 9 is divisible by 3, but **not the other way round**."),
   LT("Chia hết cho cả 2 và 5 thì tận cùng là **0**.", "Divisible by both 2 and 5 means the last digit is **0**.")
  ]
 },
 figs: {
  a: () => RAWFIG([
   () => {
    const d = dvDigits("7830", 40, ["sky", "sky", "sky", "yellow"]);
    return TH.svg(190, TH.t(180, 24, LT("Số 7 830", "The number 7,830"), { s: 17 }) + d.s +
     TH.arr(d.x0 + 3 * (d.w + d.g) + 24, 96, d.x0 + 3 * (d.w + d.g) + 24, 118, {}) +
     TH.t(d.x0 + 3 * (d.w + d.g) + 24 - 10, 146, LT("chữ số tận cùng là 0", "the last digit is 0"), { s: 16, a: "end" }));
   },
   () => {
    const d = dvDigits("7830", 14, ["sky", "sky", "sky", "yellow"]);
    return TH.svg(190, d.s +
     TH.arr(d.x0 + 3 * (d.w + d.g) + 24, 68, d.x0 + 3 * (d.w + d.g) + 24, 88, {}) +
     TH.t(d.x0 + 3 * (d.w + d.g) + 24, 108, LT("tận cùng là 0", "last digit is 0"), { s: 16, c: "#7a4a00" }) +
     dvTwo(10, 118, 165, 56, LT("Chia hết", "Divisible"), LT("cho 2", "by 2"), "mint") +
     dvTwo(185, 118, 165, 56, LT("Chia hết", "Divisible"), LT("cho 5", "by 5"), "mint"));
   }
  ]),
  b: () => RAWFIG([
   () => {
    const d = dvDigits("5382", 36, ["sky", "mint", "rose", "sun"]);
    return TH.svg(130, TH.t(180, 24, LT("Số 5 382: cộng các chữ số", "5,382: add the digits"), { s: 17 }) + d.s +
     TH.t(180, 112, LT("5 + 3 + 8 + 2 = ?", "5 + 3 + 8 + 2 = ?"), { s: 20 }));
   },
   () => {
    const d = dvDigits("5382", 14, ["sky", "mint", "rose", "sun"]);
    return TH.svg(150, d.s + TH.arr(180, 68, 180, 88, {}) + TH.box(40, 92, 280, 46, "5 + 3 + 8 + 2 = 18", "sun", { s: 22 }));
   },
   () => {
    const d = dvDigits("5382", 10, ["sky", "mint", "rose", "sun"]);
    return TH.svg(232, d.s + TH.arr(180, 64, 180, 80, {}) + TH.box(60, 82, 240, 42, "= 18", "sun", { s: 22 }) +
     TH.arr(110, 128, 90, 146, {}) + TH.arr(250, 128, 270, 146, {}) +
     dvTwo(8, 148, 172, 72, "18 : 3 = 6", LT("chia hết cho 3", "divisible by 3"), "mint") +
     dvTwo(184, 148, 168, 72, "18 : 9 = 2", LT("chia hết cho 9", "divisible by 9"), "mint"));
   }
  ]),
  c: () => RAWFIG([
   () => {
    const d = dvDigits("47x2", 12, ["sky", "mint", "yellow", "rose"]);
    return TH.svg(200, d.s + TH.t(180, 98, LT("Muốn 47x2 chia hết cho 9:", "For 47x2 to be divisible by 9:"), { s: 16 }) +
     TH.box(40, 112, 280, 44, "4 + 7 + x + 2 = 13 + x", "sun", { s: 21 }) +
     TH.t(180, 186, LT("13 + x phải chia hết cho 9", "13 + x must be divisible by 9"), { s: 17 }));
   },
   () => {
    const d = dvDigits("4752", 12, ["sky", "mint", "yellow", "rose"]);
    return TH.svg(200, d.s + TH.t(180, 98, LT("13 + 5 = 18, mà 18 chia hết cho 9", "13 + 5 = 18, and 18 is divisible by 9"), { s: 16 }) +
     TH.box(40, 112, 280, 44, "x = 5", "mint", { s: 24 }) +
     TH.t(180, 186, LT("Thử: 4 752 : 9 = 528", "Check: 4,752 ÷ 9 = 528"), { s: 17 }));
   }
  ])
 },
 teach: [
  { key: "a", f: 0, say: LT("Xét số **" + fmt(7830) + "**. Muốn biết nó có chia hết cho 2 hoặc 5 không, con **chỉ nhìn chữ số tận cùng** (bên phải nhất): ở đây là 0.",
    "Look at **" + fmt(7830) + "**. To check divisibility by 2 or 5, **look only at the last digit** (far right): here it is 0.") },
  { key: "a", f: 1, say: LT("Tận cùng là 0 nên " + fmt(7830) + " chia hết cho **cả 2 và 5**. Thử lại: 7 830 : 5 = 1 566 và 7 830 : 2 = 3 915. Đúng!",
    "The last digit is 0, so " + fmt(7830) + " is divisible by **both 2 and 5**. Check: 7,830 ÷ 5 = 1,566 and 7,830 ÷ 2 = 3,915. Correct!"),
   ask: { q: LT("Số nào dưới đây chia hết cho cả 2 và 5?", "Which number is divisible by both 2 and 5?"), opts: [fmt(2465), fmt(3480), fmt(5462)], ans: fmt(3480), good: LT("Đúng rồi! 3 480 tận cùng là 0.", "Right! 3,480 ends in 0.") } },
  { key: "b", f: 0, say: LT("Với 3 và 9, con **cộng các chữ số**. Xét số **" + fmt(5382) + "**.", "For 3 and 9, **add up the digits**. Look at **" + fmt(5382) + "**.") },
  { key: "b", f: 1, say: LT("5 + 3 + 8 + 2 = **18**. Bây giờ ta xem 18 có chia hết cho 3 và 9 không.", "5 + 3 + 8 + 2 = **18**. Now we check whether 18 is divisible by 3 and by 9.") },
  { key: "b", f: 2, say: LT("18 : 3 = 6 và 18 : 9 = 2, nên " + fmt(5382) + " chia hết cho **cả 3 và 9**. Thử lại: 5 382 : 9 = 598.",
    "18 ÷ 3 = 6 and 18 ÷ 9 = 2, so " + fmt(5382) + " is divisible by **both 3 and 9**. Check: 5,382 ÷ 9 = 598."),
   ask: { q: LT("Số nào dưới đây chia hết cho cả 3 và 9?", "Which number is divisible by both 3 and 9?"), opts: [fmt(3462), fmt(2574), fmt(1235)], ans: fmt(2574), good: LT("Đúng! 2 + 5 + 7 + 4 = 18 chia hết cho 9. (3 462 có tổng 15, chỉ chia hết cho 3.)", "Right! 2 + 5 + 7 + 4 = 18 is divisible by 9. (3,462 has digit sum 15, so only 3.)") } },
  { key: "c", f: 0, say: LT("Tìm chữ số x để **47x2** chia hết cho 9. Tổng các chữ số là 4 + 7 + x + 2 = 13 + x, và tổng này phải chia hết cho 9.",
    "Find the digit x so that **47x2** is divisible by 9. The digit sum is 4 + 7 + x + 2 = 13 + x, and it must be divisible by 9.") },
  { key: "c", f: 1, say: LT("13 cộng thêm 5 thì được 18, chia hết cho 9. Vậy **x = 5**. Số đó là 4 752, thử: 4 752 : 9 = 528.",
    "13 plus 5 makes 18, which is divisible by 9. So **x = 5**. The number is 4,752; check: 4,752 ÷ 9 = 528.") }
 ],
 gen(tier, r) {
  /* ============ MỨC DỄ ============ */
  if (tier === 1) {
   const f = r.int(0, 4);
   if (f === 0) {
    const k = r.pick([2, 5, 3]), hi = r.chance(0.5) ? 999 : 9999;
    const good = dvTry(r, 100, hi, n => n % k === 0), b1 = dvTry(r, 100, hi, n => n % k !== 0, [good]), b2 = dvTry(r, 100, hi, n => n % k !== 0, [good, b1]);
    const opts = r.shuffle([good, b1, b2]).map(fmt);
    return QQ({
     q: LT("Số nào dưới đây **chia hết cho " + k + "**?", "Which number below is **divisible by " + k + "**?"),
     parts: [chp(opts, fmt(good))],
     steps: [dvWhy(good, k), st(LT("Hai số còn lại không thoả dấu hiệu chia hết cho " + k + ".", "The other two numbers do not pass the test for " + k + "."), good)],
     tip: dvRuleTip(k)
    });
   }
   if (f === 1) {
    const k = r.pick([2, 5, 3, 9]), want = r.chance(0.5);
    const m = want ? dvTry(r, 100, 9999, x => x % k === 0) : dvTry(r, 100, 9999, x => x % k !== 0);
    const yn = dvYN();
    return QQ({
     q: LT("Số **" + fmt(m) + "** có chia hết cho " + k + " không?", "Is **" + fmt(m) + "** divisible by " + k + "?"),
     parts: [chp(yn, want ? yn[0] : yn[1])],
     steps: [dvWhy(m, k)],
     tip: dvRuleTip(k)
    });
   }
   if (f === 2) {
    const k = r.pick([2, 5, 3]);
    let nums, c, g = 0;
    do {
     nums = [];
     while (nums.length < 5) { const n = rd(r, 100, 999); if (nums.indexOf(n) < 0) nums.push(n); }
     c = nums.filter(n => n % k === 0).length; g++;
    } while ((c < 1 || c > 3) && g < 200);
    const good = nums.filter(n => n % k === 0);
    return QQ({
     q: LT("Trong các số **" + dvJoin(nums) + "**, có bao nhiêu số chia hết cho " + k + "?", "Among the numbers **" + dvJoin(nums) + "**, how many are divisible by " + k + "?"),
     parts: [num(LT("Số các số", "How many"), c, LT("số", "numbers"))],
     steps: [st(LT("Kiểm tra từng số theo dấu hiệu chia hết cho " + k + ". " + dvRuleTip(k), "Check each number with the test for " + k + ". " + dvRuleTip(k)), k),
      st(LT("Các số chia hết cho " + k + ": " + dvJoin(good) + ".", "Numbers divisible by " + k + ": " + dvJoin(good) + "."), c),
      st(LT("Có tất cả " + c + " số.", "Count: " + c + "."), c)],
     tip: dvRuleTip(k)
    });
   }
   if (f === 3) {
    const k = r.pick([3, 9]), n = rd(r, 1000, 9999), sum = dvDs(n), yn = dvYN();
    return QQ({
     q: LT("Tính tổng các chữ số của số **" + fmt(n) + "**, rồi cho biết số đó có chia hết cho " + k + " không.", "Find the sum of the digits of **" + fmt(n) + "**, then say whether the number is divisible by " + k + "."),
     parts: [num(LT("Tổng các chữ số", "Digit sum"), sum), chp(yn, n % k === 0 ? yn[0] : yn[1], LT("Chia hết cho " + k + "?", "Divisible by " + k + "?"))],
     steps: [st(LT("Tổng các chữ số: " + String(n).split("").join(" + ") + " = " + sum, "Digit sum: " + String(n).split("").join(" + ") + " = " + sum), sum),
      st(LT(sum + (sum % k === 0 ? " chia hết" : " không chia hết") + " cho " + k + " nên " + fmt(n) + (n % k === 0 ? " chia hết" : " không chia hết") + " cho " + k + ".", sum + " is " + (sum % k === 0 ? "" : "not ") + "divisible by " + k + ", so " + fmt(n) + " is " + (n % k === 0 ? "" : "not ") + "divisible by " + k + "."), sum)],
     tip: LT("Cộng từng chữ số lại với nhau.", "Add the digits one by one.")
    });
   }
   /* f === 4 */
   const k = r.pick([2, 3, 5]), p = rd(r, 10, 99), ds = [];
   for (let d = 0; d <= 9; d++) if ((p * 10 + d) % k === 0) ds.push(d);
   const ans = Math.max.apply(null, ds);
   return QQ({
    q: LT("Điền chữ số **lớn nhất** vào ô trống để số **" + p + "□** chia hết cho " + k + ".", "Write the **largest** digit in the box so that **" + p + "□** is divisible by " + k + "."),
    parts: [num(LT("Chữ số ở ô trống", "Digit in the box"), ans)],
    steps: [st(dvRuleTip(k).replace(/$/, ""), k),
     st(LT("Các chữ số điền được: " + ds.join("; "), "Digits that work: " + ds.join("; ")), ds.length),
     st(LT("Chữ số lớn nhất là " + ans, "The largest digit is " + ans), ans)],
    tip: dvRuleTip(k)
   });
  }
  /* ============ MỨC VỪA ============ */
  if (tier === 2) {
   const f = r.int(0, 5);
   if (f === 0) {
    const pr = r.pick([[2, 5], [2, 3], [3, 5], [2, 9], [5, 9]]), L = dvLcm(pr[0], pr[1]);
    const good = L * rd(r, Math.ceil(100 / L), Math.floor(9999 / L));
    const used = [good], bad = [];
    while (bad.length < 3) { const n = dvTry(r, 100, 9999, x => !(x % pr[0] === 0 && x % pr[1] === 0), used); used.push(n); bad.push(n); }
    const opts = r.shuffle([good].concat(bad)).map(fmt);
    return QQ({
     q: LT("Số nào dưới đây chia hết cho **cả " + pr[0] + " và " + pr[1] + "**?", "Which number below is divisible by **both " + pr[0] + " and " + pr[1] + "**?"),
     parts: [chp(opts, fmt(good))],
     steps: [dvWhy(good, pr[0]), dvWhy(good, pr[1]), st(LT("Các số còn lại không thoả cả hai dấu hiệu.", "The other numbers fail at least one of the two tests."), good)],
     tip: LT("Số đó phải thoả dấu hiệu của cả hai số, kiểm tra từng dấu hiệu.", "The number must pass both tests, so check them one at a time.")
    });
   }
   if (f === 1) {
    const len = r.pick([3, 4]), p = rd(r, 0, len - 1), dg = [];
    let rest, g = 0;
    do {
     for (let i = 0; i < len; i++) dg[i] = (i === 0 ? rd(r, 1, 9) : rd(r, 0, 9));
     rest = 0; for (let i = 0; i < len; i++) if (i !== p) rest += dg[i];
     g++;
    } while (rest % 9 === 0 && g < 100);
    const x = (9 - rest % 9) % 9, shown = dg.map((d, i) => i === p ? "□" : d).join(""), target = rest + x;
    const exp = dg.filter((d, i) => i !== p).join(" + ");
    return QQ({
     q: LT("Tìm chữ số thích hợp ở ô trống để số **" + dvGrp(shown) + "** chia hết cho 9.", "Find the digit for the box so that **" + dvGrp(shown) + "** is divisible by 9."),
     parts: [num(LT("Chữ số ở ô trống", "Digit in the box"), x)],
     steps: [st(LT("Tổng các chữ số đã biết: " + exp + " = " + rest, "Sum of the known digits: " + exp + " = " + rest), rest),
      st(LT("Tổng cả ô trống phải chia hết cho 9. Số gần nhất lớn hơn " + rest + " mà chia hết cho 9 là " + target, "With the box, the sum must be divisible by 9. The next multiple of 9 after " + rest + " is " + target), target),
      st(LT("Ô trống: " + target + " − " + rest + " = " + x, "The box: " + target + " − " + rest + " = " + x), x)],
     tip: LT("Cộng các chữ số đã biết, xem còn thiếu bao nhiêu để được số chia hết cho 9.", "Add the known digits and see how much is missing to reach a multiple of 9.")
    });
   }
   if (f === 2) {
    const len = r.pick([3, 4]), p = rd(r, 0, len - 1), dg = [], big = r.chance(0.5);
    let rest = 0, cand, g = 0;
    do {
     for (let i = 0; i < len; i++) dg[i] = (i === 0 ? rd(r, 1, 9) : rd(r, 0, 9));
     rest = 0; for (let i = 0; i < len; i++) if (i !== p) rest += dg[i];
     cand = []; for (let d = (p === 0 ? 1 : 0); d <= 9; d++) if ((rest + d) % 3 === 0) cand.push(d);
     g++;
    } while (cand.length < 2 && g < 100);
    const ans = big ? Math.max.apply(null, cand) : Math.min.apply(null, cand), shown = dg.map((d, i) => i === p ? "□" : d).join("");
    return QQ({
     q: LT("Điền chữ số **" + (big ? "lớn nhất" : "bé nhất") + "** vào ô trống để số **" + dvGrp(shown) + "** chia hết cho 3.", "Write the **" + (big ? "largest" : "smallest") + "** digit in the box so that **" + dvGrp(shown) + "** is divisible by 3."),
     parts: [num(LT("Chữ số ở ô trống", "Digit in the box"), ans)],
     steps: [st(LT("Tổng các chữ số đã biết: " + dg.filter((d, i) => i !== p).join(" + ") + " = " + rest, "Sum of the known digits: " + dg.filter((d, i) => i !== p).join(" + ") + " = " + rest), rest),
      st(LT("Tổng với ô trống phải chia hết cho 3, nên ô trống có thể là: " + cand.join("; "), "The sum with the box must be divisible by 3, so the box can be: " + cand.join("; ")), cand.length),
      st(LT("Chữ số " + (big ? "lớn nhất" : "bé nhất") + " là " + ans, "The " + (big ? "largest" : "smallest") + " digit is " + ans), ans)],
     tip: LT("Tìm tất cả chữ số làm tổng chia hết cho 3 rồi chọn.", "Find every digit that makes the sum divisible by 3, then choose.")
    });
   }
   if (f === 3) {
    const k = r.pick([5, 9, 3]), a = rd(r, 20, 300), b = a + rd(r, 40, 90);
    const first = Math.ceil(a / k) * k, last = Math.floor(b / k) * k, c = (last - first) / k + 1;
    return QQ({
     q: LT("Có bao nhiêu số chia hết cho " + k + " trong các số từ **" + a + "** đến **" + b + "**?", "How many numbers from **" + a + "** to **" + b + "** are divisible by " + k + "?"),
     parts: [num(LT("Số các số", "How many"), c, LT("số", "numbers"))],
     steps: [st(LT("Số đầu tiên chia hết cho " + k + " (từ " + a + " trở đi) là " + first, "The first number from " + a + " that is divisible by " + k + " is " + first), first),
      st(LT("Số cuối cùng chia hết cho " + k + " (không vượt quá " + b + ") là " + last, "The last number up to " + b + " that is divisible by " + k + " is " + last), last),
      st(LT("Các số cách nhau " + k + " đơn vị: (" + last + " − " + first + ") : " + k + " + 1 = " + c, "They are " + k + " apart: (" + last + " − " + first + ") ÷ " + k + " + 1 = " + c), c)],
     tip: LT("Tìm số chia hết đầu tiên và cuối cùng, rồi đếm các số cách đều nhau.", "Find the first and last ones, then count the evenly spaced numbers.")
    });
   }
   if (f === 4) {
    const pr = r.pick([[2, 5], [2, 3], [3, 5], [2, 9], [5, 9]]), L = dvLcm(pr[0], pr[1]), len = r.pick([3, 4]), big = r.chance(0.5);
    const lo = Math.pow(10, len - 1), hi = lo * 10 - 1;
    const ans = big ? Math.floor(hi / L) * L : Math.ceil(lo / L) * L;
    return QQ({
     q: LT("Tìm số **" + (big ? "lớn nhất" : "bé nhất") + "** có **" + (len === 3 ? "ba" : "bốn") + " chữ số** chia hết cho cả " + pr[0] + " và " + pr[1] + ".", "Find the **" + (big ? "largest" : "smallest") + " " + (len === 3 ? "3-digit" : "4-digit") + " number** divisible by both " + pr[0] + " and " + pr[1] + "."),
     parts: [num(LT("Số cần tìm", "The number"), ans)],
     steps: [st(LT("Số " + (big ? "lớn nhất" : "bé nhất") + " có " + (len === 3 ? "ba" : "bốn") + " chữ số là " + fmt(big ? hi : lo) + ". Ta thử từ số này " + (big ? "lùi dần" : "tăng dần") + ".", "The " + (big ? "largest" : "smallest") + " " + (len === 3 ? "3-digit" : "4-digit") + " number is " + fmt(big ? hi : lo) + ". Try it and then " + (big ? "go down" : "go up") + "."), big ? hi : lo),
      st(LT("Số cần tìm phải thoả dấu hiệu của cả " + pr[0] + " và " + pr[1] + ".", "The number must pass the tests for both " + pr[0] + " and " + pr[1] + "."), L),
      dvWhy(ans, pr[0]), dvWhy(ans, pr[1])],
     tip: LT("Thử các số từ " + (big ? "lớn" : "bé") + " nhất, kiểm tra cả hai dấu hiệu.", "Start from the " + (big ? "largest" : "smallest") + " and check both tests.")
    });
   }
   /* f === 5 */
   const k = r.pick([3, 9]);
   let n, rem, g = 0;
   do { n = rd(r, 1000, 9999); rem = dvDs(n) % k; g++; } while (rem === 0 && g < 100);
   const sum = dvDs(n);
   return QQ({
    q: LT("Số **" + fmt(n) + "** chia cho " + k + " dư bao nhiêu? (Gợi ý: dùng tổng các chữ số.)", "What is the remainder when **" + fmt(n) + "** is divided by " + k + "? (Hint: use the digit sum.)"),
    parts: [num(LT("Số dư", "Remainder"), rem)],
    steps: [st(LT("Tổng các chữ số: " + String(n).split("").join(" + ") + " = " + sum, "Digit sum: " + String(n).split("").join(" + ") + " = " + sum), sum),
     st(LT("Số đó chia cho " + k + " dư bằng số dư của tổng các chữ số: " + sum + " : " + k + " dư " + rem, "The number leaves the same remainder as its digit sum: " + sum + " ÷ " + k + " leaves " + rem), rem)],
    tip: LT("Chia tổng các chữ số cho " + k + " và xem số dư.", "Divide the digit sum by " + k + " and look at the remainder.")
   });
  }
  /* ============ MỨC KHÓ ============ */
  const f = r.int(0, 5);
  if (f === 0) {
   let a, b;
   do { a = rd(r, 1, 9); b = rd(r, 0, 9); } while ((a + b) % 9 === 0);
   const x = (9 - (a + b) % 9) % 9, y = 0, shown = a + "x" + b + "y";
   return QQ({
    q: LT("Bạn Lan viết số **" + dvGrp(shown) + "**, trong đó x và y là hai chữ số. Biết số này chia hết cho **cả 2, 5 và 9**. Tìm x và y.", "Lan wrote the number **" + dvGrp(shown) + "**, where x and y are digits. The number is divisible by **2, 5 and 9**. Find x and y."),
    parts: [num("y", y), num("x", x)],
    steps: [st(LT("Chia hết cho cả 2 và 5 nên tận cùng là 0, vậy y = 0.", "Divisible by both 2 and 5, so it ends in 0, hence y = 0."), 0),
     st(LT("Tổng các chữ số đã biết: " + a + " + " + b + " + 0 = " + (a + b), "Sum of the known digits: " + a + " + " + b + " + 0 = " + (a + b)), a + b),
     st(LT("Tổng " + (a + b) + " + x phải chia hết cho 9, nên " + (a + b) + " + x = " + (a + b + x), "The sum " + (a + b) + " + x must be divisible by 9, so " + (a + b) + " + x = " + (a + b + x)), a + b + x),
     st(LT("Vậy x = " + x + ", y = 0. Số đó là " + fmt(a * 1000 + x * 100 + b * 10), "So x = " + x + ", y = 0. The number is " + fmt(a * 1000 + x * 100 + b * 10)), x)],
    tip: LT("Tìm y trước nhờ dấu hiệu chia hết cho 2 và 5, rồi mới tìm x.", "Find y first from the tests for 2 and 5, then find x.")
   });
  }
  if (f === 1) {
   const dg = [1, 0, 0, 0];
   let rest, g = 0, n;
   do {
    dg[0] = rd(r, 1, 9); dg[1] = rd(r, 0, 9); dg[2] = rd(r, 0, 9); dg[3] = rd(r, 0, 9);
    rest = dg[0] + dg[2] + dg[3]; g++;
   } while (rest % 9 === 0 && g < 100);
   const x = (9 - rest % 9) % 9; n = dg[0] * 1000 + x * 100 + dg[2] * 10 + dg[3];
   const shown = dg[0] + "□" + dg[2] + dg[3];
   return QQ({
    q: LT("Khối lớp 4 của một trường có **" + dvGrp(shown) + "** học sinh (chữ số ở ô □ bị mờ). Biết khi xếp thành các hàng, mỗi hàng 9 em thì **không thừa em nào**. Hỏi khối có bao nhiêu học sinh và xếp được bao nhiêu hàng?",
     "Grade 4 at a school has **" + dvGrp(shown) + "** pupils (the digit in the box is smudged). When they line up with 9 in each row, **nobody is left over**. How many pupils are there, and how many rows can be made?"),
    parts: [num(LT("Số học sinh", "Pupils"), n, LT("học sinh", "pupils")), num(LT("Số hàng", "Rows"), n / 9, LT("hàng", "rows"))],
    steps: [st(LT("Không thừa em nào nên số học sinh chia hết cho 9.", "Nobody left over, so the number of pupils is divisible by 9."), 9),
     st(LT("Tổng các chữ số đã biết: " + dg[0] + " + " + dg[2] + " + " + dg[3] + " = " + rest + ". Ô trống phải là " + x + " để tổng bằng " + (rest + x), "Sum of the known digits: " + dg[0] + " + " + dg[2] + " + " + dg[3] + " = " + rest + ". The box must be " + x + " to make the sum " + (rest + x)), x),
     st(LT("Số học sinh là " + fmt(n), "The number of pupils is " + fmt(n)), n),
     st(LT("Số hàng: " + fmt(n) + " : 9 = " + (n / 9), "Rows: " + fmt(n) + " ÷ 9 = " + (n / 9)), n / 9)],
    tip: LT("Không thừa em nào nghĩa là chia hết cho 9.", "Nobody left over means divisible by 9.")
   });
  }
  if (f === 2) {
   const cond = r.pick([[2, LT("chia hết cho 2", "divisible by 2")], [5, LT("chia hết cho 5", "divisible by 5")], [10, LT("chia hết cho cả 2 và 5", "divisible by both 2 and 5")]]);
   let ds, list, g = 0;
   do {
    ds = r.shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3);
    list = [];
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) for (let k2 = 0; k2 < 3; k2++) {
     if (i === j || j === k2 || i === k2) continue;
     const n = ds[i] * 100 + ds[j] * 10 + ds[k2];
     if (ds[i] === 0) continue;
     if (cond[0] === 10 ? n % 10 === 0 : n % cond[0] === 0) list.push(n);
    }
    g++;
   } while ((list.length < 1 || list.length > 4) && g < 300);
   list.sort((p, q) => p - q);
   const dd = ds.slice().sort((p, q) => p - q);
   return QQ({
    q: LT("Từ ba chữ số **" + dd.join("; ") + "**, lập các số có ba chữ số, mỗi chữ số dùng một lần và đứng đầu không là 0. Có bao nhiêu số " + cond[1] + "?", "Using the three digits **" + dd.join("; ") + "** once each (no leading 0), make 3-digit numbers. How many are " + (cond[0] === 10 ? "divisible by both 2 and 5" : "divisible by " + cond[0]) + "?"),
    parts: [num(LT("Số các số", "How many"), list.length, LT("số", "numbers"))],
    steps: [st(cond[0] === 2 ? LT("Chia hết cho 2 thì chữ số tận cùng là 0, 2, 4, 6 hoặc 8.", "Divisible by 2 means the last digit is 0, 2, 4, 6 or 8.") : cond[0] === 5 ? LT("Chia hết cho 5 thì chữ số tận cùng là 0 hoặc 5.", "Divisible by 5 means the last digit is 0 or 5.") : LT("Chia hết cho cả 2 và 5 thì chữ số tận cùng là 0.", "Divisible by both 2 and 5 means the last digit is 0."), cond[0]),
     st(LT("Chọn chữ số tận cùng phù hợp, hai chữ số còn lại đổi chỗ cho nhau (số 0 không đứng đầu).", "Choose a suitable last digit and swap the other two (0 cannot be first)."), list.length),
     st(LT("Các số lập được: " + list.map(fmt).join("; "), "The numbers: " + list.map(fmt).join("; ")), list.length),
     st(LT("Có tất cả " + list.length + " số.", "Count: " + list.length + "."), list.length)],
    tip: LT("Chọn chữ số tận cùng trước, rồi xếp hai chữ số còn lại.", "Choose the last digit first, then arrange the other two.")
   });
  }
  if (f === 3) {
   const pr = r.pick([[5, 9], [2, 9], [2, 3], [3, 5], [2, 5]]), big = r.chance(0.5), cands = [];
   for (let n = 100; n <= 999; n++) {
    const s = String(n);
    if (s[0] === s[1] || s[1] === s[2] || s[0] === s[2]) continue;
    if (n % pr[0] === 0 && n % pr[1] === 0) cands.push(n);
   }
   const ans = big ? cands[cands.length - 1] : cands[0];
   const allM = [], L = dvLcm(pr[0], pr[1]);
   for (let n = big ? Math.floor(999 / L) * L : Math.ceil(100 / L) * L; ; n += big ? -L : L) { allM.push(n); if (n === ans) break; }
   const tried = allM.slice(0, 5), shownT = tried.map(n => n === ans ? "**" + n + "**" : n + " (" + LT("loại", "no") + ")").join("; ");
   return QQ({
    q: LT("Tìm số **" + (big ? "lớn nhất" : "bé nhất") + "** có ba chữ số **khác nhau** và chia hết cho cả " + pr[0] + " và " + pr[1] + ".", "Find the **" + (big ? "largest" : "smallest") + "** 3-digit number with **different digits** that is divisible by both " + pr[0] + " and " + pr[1] + "."),
    parts: [num(LT("Số cần tìm", "The number"), ans)],
    steps: [st(LT("Số phải thoả dấu hiệu chia hết cho " + pr[0] + " và cho " + pr[1] + ".", "The number must pass the tests for " + pr[0] + " and " + pr[1] + "."), L),
     st(LT("Liệt kê các số thoả cả hai dấu hiệu, xét từ " + (big ? "999 trở xuống" : "100 trở lên") + ": " + shownT, "List the numbers passing both tests, starting from " + (big ? "999 and going down" : "100 and going up") + ": " + shownT), ans),
     st(LT("Bỏ các số có hai chữ số giống nhau, số đầu tiên còn lại là " + ans, "Skip numbers that repeat a digit; the first one left is " + ans), ans)],
    tip: LT("Liệt kê các số chia hết theo thứ tự rồi loại số có chữ số lặp lại.", "List the divisible numbers in order and drop those with a repeated digit.")
   });
  }
  if (f === 4) {
   const k = r.pick([9, 3]), add = r.chance(0.5), nm = r.pick(["Mai", "Nam", "Lan", "Hùng", "Linh"]);
   let n, rem, g = 0;
   do { n = rd(r, 1000, 9999); rem = n % k; g++; } while (rem === 0 && g < 100);
   const ans = add ? k - rem : rem, sum = dvDs(n);
   return QQ({
    q: add ? LT(nm + " có **" + fmt(n) + "** viên bi và muốn chia đều cho " + k + " bạn. Hỏi " + nm + " phải mua thêm **ít nhất** bao nhiêu viên bi nữa để chia đều không thừa viên nào?", nm + " has **" + fmt(n) + "** marbles and wants to share them equally among " + k + " friends. What is the **least** number of marbles " + nm + " must buy so there are none left over?")
     : LT(nm + " có **" + fmt(n) + "** viên bi và muốn chia đều cho " + k + " bạn. Hỏi " + nm + " phải cho đi (hoặc bớt ra) **ít nhất** bao nhiêu viên bi để chia đều không thừa viên nào?", nm + " has **" + fmt(n) + "** marbles and wants to share them equally among " + k + " friends. What is the **least** number of marbles " + nm + " must put aside so there are none left over?"),
    parts: [num(LT("Số viên bi", "Marbles"), ans, LT("viên", "marbles"))],
    steps: [st(LT("Tổng các chữ số của " + fmt(n) + " là " + sum, "The digit sum of " + fmt(n) + " is " + sum), sum),
     st(LT(sum + " chia " + k + " dư " + rem + " nên " + fmt(n) + " chia " + k + " dư " + rem, sum + " ÷ " + k + " leaves " + rem + ", so " + fmt(n) + " ÷ " + k + " leaves " + rem), rem),
     add ? st(LT("Cần thêm " + k + " − " + rem + " = " + ans + " viên để được số chia hết cho " + k, "Add " + k + " − " + rem + " = " + ans + " to reach a multiple of " + k), ans)
      : st(LT("Bớt đi " + rem + " viên thì còn số chia hết cho " + k, "Take away " + rem + " to leave a multiple of " + k), ans)],
    tip: LT("Tìm số dư khi chia cho " + k + " bằng tổng các chữ số.", "Find the remainder on dividing by " + k + " using the digit sum.")
   });
  }
  /* f === 5: số có hai chữ số */
  const even = r.chance(0.5);
  const s = even ? rd(r, 2, 9) : rd(r, 7, 14);
  const ans = even ? s * 10 : (s - 5) * 10 + 5;
  return QQ({
   q: LT("Tìm số có hai chữ số, chia hết cho 5, có tổng hai chữ số bằng **" + s + "** và là số **" + (even ? "chẵn" : "lẻ") + "**.", "Find the 2-digit number that is divisible by 5, whose digits add up to **" + s + "**, and that is **" + (even ? "even" : "odd") + "**."),
   parts: [num(LT("Số cần tìm", "The number"), ans)],
   steps: [st(even ? LT("Chia hết cho 5 và là số chẵn nên chữ số tận cùng là 0.", "Divisible by 5 and even, so the last digit is 0.") : LT("Chia hết cho 5 và là số lẻ nên chữ số tận cùng là 5.", "Divisible by 5 and odd, so the last digit is 5."), even ? 0 : 5),
    st(LT("Chữ số hàng chục: " + s + " − " + (even ? 0 : 5) + " = " + (even ? s : s - 5), "Tens digit: " + s + " − " + (even ? 0 : 5) + " = " + (even ? s : s - 5)), even ? s : s - 5),
    st(LT("Số cần tìm là " + ans, "The number is " + ans), ans)],
   tip: LT("Tìm chữ số hàng đơn vị trước.", "Find the units digit first.")
  });
 }
});

})();

;(function(){/* findx.js */
/* Bài học mới: Tìm x – quan hệ giữa các thành phần (findx) */
{
  const dv = s => String(s).replace(/ : /g, " ÷ ");
  const LL = (vi, en) => LT(vi, dv(en));
  const F = n => fmt(n);
  const T = (x, y, vi, en, o) => TH.t(x, y, LT(vi, en), o);
  const eqBold = e => LL("Tìm x, biết: **" + e + "**", "Find x, given: **" + e + "**");
  const chkS = (e, v) => st(LL("Thử lại: " + e + " (đúng)", "Check: " + e + " (correct)"), v);
  const X = () => LT("x", "x");
  // tạo câu hỏi "Tìm x" chuẩn: e = biểu thức, x = đáp án, steps = mảng st, tip
  const mk = (e, x, steps, tip, unit) => QQ({
    q: eqBold(e),
    parts: [num("x", x)],
    steps: steps,
    tip: tip
  });

  /* ---------- Mức 1: một phép tính ---------- */
  const t1 = {
    addX(r) { // x + a = b  /  a + x = b
      const a = r.int(5, 60), x = r.int(3, 60), b = a + x, sw = r.int(0, 1);
      const e = sw ? a + " + x = " + b : "x + " + a + " = " + b;
      return mk(e, x, [
        st(LL("x là số hạng chưa biết: x = tổng − số hạng đã biết = " + b + " − " + a + " = " + x, "x is the unknown addend: x = sum − known addend = " + b + " − " + a + " = " + x), x),
        chkS(sw ? a + " + " + x + " = " + b : x + " + " + a + " = " + b, b)
      ], LL("Số hạng chưa biết bằng tổng trừ đi số hạng kia.", "The unknown addend is the sum minus the other addend."));
    },
    subBig(r) { // x - a = b
      const a = r.int(5, 50), b = r.int(5, 60), x = a + b;
      return mk("x − " + a + " = " + b, x, [
        st(LL("x là số bị trừ: x = hiệu + số trừ = " + b + " + " + a + " = " + x, "x is the whole (minuend): x = difference + part taken = " + b + " + " + a + " = " + x), x),
        chkS(x + " − " + a + " = " + b, b)
      ], LL("Số bị trừ bằng hiệu cộng số trừ.", "The minuend is the difference plus the subtrahend."));
    },
    subSmall(r) { // a - x = b
      const x = r.int(5, 50), b = r.int(5, 50), a = x + b;
      return mk(a + " − x = " + b, x, [
        st(LL("x là số trừ: x = số bị trừ − hiệu = " + a + " − " + b + " = " + x, "x is the part taken away: x = whole − difference = " + a + " − " + b + " = " + x), x),
        chkS(a + " − " + x + " = " + b, b)
      ], LL("Số trừ bằng số bị trừ trừ đi hiệu.", "The subtrahend is the minuend minus the difference."));
    },
    mulX(r) { // x × a = b / a × x = b
      const a = r.int(2, 9), x = r.int(2, 12), b = a * x, sw = r.int(0, 1);
      const e = sw ? a + " × x = " + b : "x × " + a + " = " + b;
      return mk(e, x, [
        st(LL("x là thừa số chưa biết: x = tích : thừa số kia = " + b + " : " + a + " = " + x, "x is the unknown factor: x = product ÷ other factor = " + b + " : " + a + " = " + x), x),
        chkS(sw ? a + " × " + x + " = " + b : x + " × " + a + " = " + b, b)
      ], LL("Thừa số chưa biết bằng tích chia cho thừa số kia.", "The unknown factor is the product divided by the other factor."));
    },
    divX(r) { // x : a = b  / a : x = b
      const a = r.int(2, 9), b = r.int(2, 9), t = r.int(0, 1);
      if (t) { // x : a = b
        const x = a * b;
        return mk("x : " + a + " = " + b, x, [
          st(LL("x là số bị chia: x = thương × số chia = " + b + " × " + a + " = " + x, "x is the dividend: x = quotient × divisor = " + b + " × " + a + " = " + x), x),
          chkS(x + " : " + a + " = " + b, b)
        ], LL("Số bị chia bằng thương nhân số chia.", "The dividend is the quotient times the divisor."));
      }
      const A = a * b;
      return mk(A + " : x = " + b, a, [
        st(LL("x là số chia: x = số bị chia : thương = " + A + " : " + b + " = " + a, "x is the divisor: x = dividend : quotient = " + A + " : " + b + " = " + a), a),
        chkS(A + " : " + a + " = " + b, b)
      ], LL("Số chia bằng số bị chia chia cho thương.", "The divisor is the dividend divided by the quotient."));
    },
    pickX(r) { // chọn giá trị đúng của x
      const k = r.int(0, 2);
      let e, x, s;
      if (k === 0) { const a = r.int(8, 40); x = r.int(6, 40); e = "x + " + a + " = " + (a + x); s = a + " + " + x + " = " + (a + x); }
      else if (k === 1) { const a = r.int(3, 9); x = r.int(3, 12); e = "x × " + a + " = " + (a * x); s = x + " × " + a + " = " + (a * x); }
      else { const b = r.int(5, 30); x = r.int(10, 50); e = "x − " + b + " = " + (x - b); s = x + " − " + b + " = " + (x - b); }
      const wrong = new Set();
      while (wrong.size < 2) { const w = x + r.pick([-10, -3, -2, -1, 1, 2, 3, 10]); if (w > 0 && w !== x) wrong.add(w); }
      const opts = r.shuffle([String(x)].concat([...wrong].map(String)));
      return QQ({
        q: LL("Số nào dưới đây là giá trị của x trong **" + e + "**?", "Which of these numbers is the value of x in **" + e + "**?"),
        parts: [chp(opts, String(x), "x")],
        steps: [st(LL("Thay thử x = " + x + ": " + s + " (đúng)", "Try x = " + x + ": " + s + " (correct)"), x),
          st(LL("Vậy x = " + x, "So x = " + x), x)],
        tip: LL("Thay từng số vào biểu thức rồi xem vế trái có bằng vế phải không.", "Put each number into the equation and see if both sides are equal.")
      });
    }
  };

  /* ---------- Mức 2: số lớn hơn, biểu thức hai phép tính ---------- */
  const t2 = {
    bigAddSub(r) {
      const k = r.int(0, 2);
      if (k === 0) { const a = r.int(120, 4800), x = r.int(150, 4800), b = a + x, sw = r.int(0, 1);
        return mk(sw ? F(a) + " + x = " + F(b) : "x + " + F(a) + " = " + F(b), x, [
          st(LL("x = " + F(b) + " − " + F(a) + " = " + F(x), "x = " + F(b) + " − " + F(a) + " = " + F(x)), x),
          chkS(F(x) + " + " + F(a) + " = " + F(b), b)], LL("Tổng trừ số hạng đã biết.", "Sum minus the known addend.")); }
      if (k === 1) { const a = r.int(120, 4800), b = r.int(150, 4800), x = a + b;
        return mk("x − " + F(a) + " = " + F(b), x, [
          st(LL("x = " + F(b) + " + " + F(a) + " = " + F(x), "x = " + F(b) + " + " + F(a) + " = " + F(x)), x),
          chkS(F(x) + " − " + F(a) + " = " + F(b), b)], LL("Số bị trừ = hiệu + số trừ.", "Minuend = difference + subtrahend.")); }
      const x = r.int(150, 4800), b = r.int(150, 4800), a = x + b;
      return mk(F(a) + " − x = " + F(b), x, [
        st(LL("x = " + F(a) + " − " + F(b) + " = " + F(x), "x = " + F(a) + " − " + F(b) + " = " + F(x)), x),
        chkS(F(a) + " − " + F(x) + " = " + F(b), b)], LL("Số trừ = số bị trừ − hiệu.", "Subtrahend = minuend − difference."));
    },
    bigMulDiv(r) {
      const k = r.int(0, 2);
      if (k === 0) { const a = r.int(6, 30), x = r.int(11, 60), b = a * x;
        return mk("x × " + a + " = " + F(b), x, [
          st(LL("x = " + F(b) + " : " + a + " = " + x, "x = " + F(b) + " : " + a + " = " + x), x),
          chkS(x + " × " + a + " = " + F(b), b)], LL("Thừa số chưa biết = tích : thừa số kia.", "Unknown factor = product ÷ other factor.")); }
      if (k === 1) { const a = r.int(4, 20), b = r.int(12, 60), x = a * b;
        return mk("x : " + a + " = " + b, x, [
          st(LL("x = " + b + " × " + a + " = " + F(x), "x = " + b + " × " + a + " = " + F(x)), x),
          chkS(F(x) + " : " + a + " = " + b, b)], LL("Số bị chia = thương × số chia.", "Dividend = quotient × divisor.")); }
      const b = r.int(3, 15), x = r.int(4, 30), a = b * x;
      return mk(a + " : x = " + b, x, [
        st(LL("x = " + a + " : " + b + " = " + x, "x = " + a + " : " + b + " = " + x), x),
        chkS(a + " : " + x + " = " + b, b)], LL("Số chia = số bị chia : thương.", "Divisor = dividend ÷ quotient."));
    },
    addMulBlock(r) { // x + a × b = c  /  x − a : b = c
      if (r.int(0, 1)) { const a = r.int(3, 12), b = r.int(3, 12), x = r.int(10, 200), c = x + a * b;
        return mk("x + " + a + " × " + b + " = " + c, x, [
          st(LL("Tính trước: " + a + " × " + b + " = " + a * b, "Do this first: " + a + " × " + b + " = " + a * b), a * b),
          st(LL("x + " + a * b + " = " + c, "x + " + a * b + " = " + c), c),
          st(LL("x = " + c + " − " + a * b + " = " + x, "x = " + c + " − " + a * b + " = " + x), x),
          chkS(x + " + " + a + " × " + b + " = " + c, c)], LL("Phép nhân làm trước rồi mới tìm x.", "Do the multiplication first, then find x.")); }
      const q = r.int(3, 12), b = r.int(3, 12), a = q * b, c = r.int(20, 300), x = c + q;
      return mk("x − " + a + " : " + b + " = " + c, x, [
        st(LL("Tính trước: " + a + " : " + b + " = " + q, "Do this first: " + a + " : " + b + " = " + q), q),
        st(LL("x − " + q + " = " + c + " nên x = " + c + " + " + q + " = " + x, "x − " + q + " = " + c + ", so x = " + c + " + " + q + " = " + x), x),
        chkS(x + " − " + a + " : " + b + " = " + c, c)], LL("Phép chia làm trước, rồi tìm x.", "Do the division first, then find x."));
    },
    divBlock(r) { // a + d : x = c
      const q = r.int(2, 9), x = r.int(2, 9), d = q * x, a = r.int(10, 80), c = a + q;
      return mk(a + " + " + d + " : x = " + c, x, [
        st(LL("Coi " + d + " : x là một khối: " + d + " : x = " + c + " − " + a + " = " + q, "Treat " + d + " : x as one block: " + d + " : x = " + c + " − " + a + " = " + q), q),
        st(LL("x = " + d + " : " + q + " = " + x, "x = " + d + " : " + q + " = " + x), x),
        chkS(a + " + " + d + " : " + x + " = " + c, c)], LL("Coi phép chia là một khối, tìm khối đó trước.", "Treat the division as one block and find that block first."));
    },
    paren(r) { // (x + a) × b = c  / (x − a) : b = c
      if (r.int(0, 1)) { const a = r.int(3, 30), b = r.int(2, 9), s = r.int(5, 40), x = s - a < 1 ? s + a : s, c = (x + a) * b;
        return mk("(x + " + a + ") × " + b + " = " + c, x, [
          st(LL("x + " + a + " = " + c + " : " + b + " = " + (x + a), "x + " + a + " = " + c + " : " + b + " = " + (x + a)), x + a),
          st(LL("x = " + (x + a) + " − " + a + " = " + x, "x = " + (x + a) + " − " + a + " = " + x), x),
          chkS("(" + x + " + " + a + ") × " + b + " = " + c, c)], LL("Coi (x + số) là một thừa số chưa biết.", "Treat (x + number) as an unknown factor.")); }
      const a = r.int(3, 30), b = r.int(2, 9), q = r.int(3, 25), x = q * b + a, c = q;
      return mk("(x − " + a + ") : " + b + " = " + c, x, [
        st(LL("x − " + a + " = " + c + " × " + b + " = " + c * b, "x − " + a + " = " + c + " × " + b + " = " + c * b), c * b),
        st(LL("x = " + c * b + " + " + a + " = " + x, "x = " + c * b + " + " + a + " = " + x), x),
        chkS("(" + x + " − " + a + ") : " + b + " = " + c, c)], LL("Coi (x − số) là số bị chia chưa biết.", "Treat (x − number) as an unknown dividend."));
    },
    pickX(r) { return t1.pickX(r); }
  };

  /* ---------- Mức 3: bài toán có lời văn, nhiều bước ---------- */
  const t3 = {
    before(r) { // x − a = b, rồi thêm c
      const a = r.int(12, 60), b = r.int(15, 90), c = r.int(10, 50), x = a + b, y = b + c;
      const nm = r.pick([["Mai", "Mai"], ["Hà", "Hà"], ["Nam", "Nam"], ["Lan", "Lan"]]);
      const it = r.pick([["quyển vở", "notebooks"], ["viên bi", "marbles"], ["cái kẹo", "candies"], ["quả cam", "oranges"]]);
      return QQ({
        q: LL(nm[0] + " có một số " + it[0] + ". Sau khi cho bạn " + a + " " + it[0] + " thì " + nm[0] + " còn " + b + " " + it[0] + ". Hỏi lúc đầu " + nm[0] + " có bao nhiêu " + it[0] + "? Nếu sau đó " + nm[0] + " được cho thêm " + c + " " + it[0] + " thì cuối cùng có bao nhiêu?",
          nm[1] + " has some " + it[1] + ". After giving " + a + " to a friend, " + nm[1] + " has " + b + " left. How many did " + nm[1] + " have at first (call it x)? If " + nm[1] + " is then given " + c + " more, how many does " + nm[1] + " have in the end?"),
        parts: [num(LT("Lúc đầu (x)", "At first (x)"), x, LT(it[0], it[1])), num(LT("Cuối cùng", "In the end"), y, LT(it[0], it[1]))],
        steps: [st(LL("Gọi số lúc đầu là x: x − " + a + " = " + b, "Let x be the number at first: x − " + a + " = " + b), b),
          st(LL("x = " + b + " + " + a + " = " + x, "x = " + b + " + " + a + " = " + x), x),
          st(LL("Cuối cùng: " + b + " + " + c + " = " + y + " (cũng bằng " + x + " − " + a + " + " + c + ")", "In the end: " + b + " + " + c + " = " + y), y)],
        tip: LL("Lúc đầu trừ đi số đã cho thì ra số còn lại, nên làm phép tính ngược lại.", "At first minus what was given away equals what is left, so do the opposite operation.")
      });
    },
    boxes(r) { // x × m + c = T
      const m = r.int(6, 15), x = r.int(5, 30), c = r.int(3, 20), T2 = x * m + c;
      return QQ({
        q: LL("Cô giáo xếp bút vào các hộp, mỗi hộp " + m + " cây bút và còn lẻ " + c + " cây bút chưa xếp. Cô có tất cả " + T2 + " cây bút. Gọi x là số hộp: x × " + m + " + " + c + " = " + T2 + ". Tìm x.",
          "A teacher packs pens into boxes, " + m + " pens per box, with " + c + " loose pens left over. She has " + T2 + " pens in all. Let x be the number of boxes: x × " + m + " + " + c + " = " + T2 + ". Find x."),
        parts: [num(LT("Số hộp (x)", "Boxes (x)"), x, LT("hộp", "boxes"))],
        steps: [st(LL("Số bút đã xếp vào hộp: " + T2 + " − " + c + " = " + x * m, "Pens packed in boxes: " + T2 + " − " + c + " = " + x * m), x * m),
          st(LL("x × " + m + " = " + x * m + " nên x = " + x * m + " : " + m + " = " + x, "x × " + m + " = " + x * m + ", so x = " + x * m + " : " + m + " = " + x), x),
          chkS(x + " × " + m + " + " + c + " = " + T2, T2)],
        tip: LL("Bỏ số bút lẻ đi trước, rồi tìm số hộp.", "Take away the loose pens first, then find the number of boxes.")
      });
    },
    groups(r) { // x : a = b, rồi chia lại
      const a2 = r.int(2, 6); let a = r.int(3, 9); if (a === a2) a = a2 + 1;
      const b = a2 * r.int(2, 4), x = a * b, x2 = x / a2;
      return QQ({
        q: LL("Một số học sinh được chia đều thành " + a + " nhóm, mỗi nhóm " + b + " em. Gọi x là số học sinh: x : " + a + " = " + b + ". Tìm x. Nếu chia số học sinh đó thành " + a2 + " nhóm bằng nhau thì mỗi nhóm có bao nhiêu em?",
          "Some students are split equally into " + a + " groups of " + b + ". Let x be the number of students: x : " + a + " = " + b + ". Find x. If those students are split into " + a2 + " equal groups instead, how many are in each group?"),
        parts: [num(LT("Số học sinh (x)", "Students (x)"), x, LT("em", "students")), num(LT("Mỗi nhóm mới", "Each new group"), x2, LT("em", "students"))],
        steps: [st(LL("x là số bị chia: x = " + b + " × " + a + " = " + x, "x is the dividend: x = " + b + " × " + a + " = " + x), x),
          st(LL("Chia thành " + a2 + " nhóm: " + x + " : " + a2 + " = " + x2 + " (em)", "Into " + a2 + " groups: " + x + " : " + a2 + " = " + x2 + " (students)"), x2)],
        tip: LL("Số bị chia bằng thương nhân số chia.", "The dividend is the quotient times the divisor.")
      });
    },
    paren(r) { // (x + a) × b = c, hỏi x và x + a
      const a = r.int(5, 40), b = r.int(2, 9), x = r.int(8, 60), s = x + a, c = s * b;
      return QQ({
        q: LL("Tìm x, biết: **(x + " + a + ") × " + b + " = " + c + "**. Cho biết giá trị của biểu thức trong ngoặc (x + " + a + ") và giá trị của x.",
          "Find x, given: **(x + " + a + ") × " + b + " = " + c + "**. Give the value of the bracket (x + " + a + ") and the value of x."),
        parts: [num(LT("x + " + a, "x + " + a), s), num("x", x)],
        steps: [st(LL("x + " + a + " là thừa số chưa biết: " + c + " : " + b + " = " + s, "x + " + a + " is the unknown factor: " + c + " : " + b + " = " + s), s),
          st(LL("x = " + s + " − " + a + " = " + x, "x = " + s + " − " + a + " = " + x), x),
          chkS("(" + x + " + " + a + ") × " + b + " = " + c, c)],
        tip: LL("Coi biểu thức trong ngoặc là một thừa số chưa biết.", "Treat the bracket as one unknown factor.")
      });
    },
    subDiv(r) { // a − x : b = c
      const b = r.int(3, 9), q = r.int(3, 15), c = r.int(10, 80), a = c + q, x = q * b;
      return mk(a + " − x : " + b + " = " + c, x, [
        st(LL("x : " + b + " là số trừ: x : " + b + " = " + a + " − " + c + " = " + q, "x : " + b + " is the part taken away: x : " + b + " = " + a + " − " + c + " = " + q), q),
        st(LL("x là số bị chia: x = " + q + " × " + b + " = " + x, "x is the dividend: x = " + q + " × " + b + " = " + x), x),
        chkS(a + " − " + x + " : " + b + " = " + c, c)], LL("Coi x : " + b + " là một khối: số trừ chưa biết.", "Treat x : " + b + " as one block: the unknown part taken away."));
    },
    mulSub(r) { // a × x − b = c
      const a = r.int(3, 12), x = r.int(5, 30), b = r.int(5, 40), c = a * x - b;
      return mk(a + " × x − " + b + " = " + c, x, [
        st(LL(a + " × x là số bị trừ: " + a + " × x = " + c + " + " + b + " = " + (c + b), a + " × x is the minuend: " + a + " × x = " + c + " + " + b + " = " + (c + b)), c + b),
        st(LL("x = " + (c + b) + " : " + a + " = " + x, "x = " + (c + b) + " : " + a + " = " + x), x),
        chkS(a + " × " + x + " − " + b + " = " + c, c)], LL("Coi " + a + " × x là một khối: số bị trừ.", "Treat " + a + " × x as one block: the minuend."));
    },
    numWord(r) { // một số cộng với k lần của m thì = c
      const k = r.int(2, 6), m = r.int(5, 25), x = r.int(10, 120), c = x + k * m;
      return QQ({
        q: LL("Một số cộng với " + k + " lần của " + m + " thì được " + c + ". Gọi số đó là x: x + " + k + " × " + m + " = " + c + ". Tìm x, rồi tìm số gấp 3 lần x.",
          "A number plus " + k + " times " + m + " gives " + c + ". Let the number be x: x + " + k + " × " + m + " = " + c + ". Find x, then find 3 times x."),
        parts: [num("x", x), num(LT("Gấp 3 lần x", "3 times x"), 3 * x)],
        steps: [st(LL(k + " lần của " + m + ": " + k + " × " + m + " = " + k * m, k + " times " + m + ": " + k + " × " + m + " = " + k * m), k * m),
          st(LL("x = " + c + " − " + k * m + " = " + x, "x = " + c + " − " + k * m + " = " + x), x),
          st(LL("Gấp 3 lần x: " + x + " × 3 = " + 3 * x, "3 times x: " + x + " × 3 = " + 3 * x), 3 * x)],
        tip: LL("Tính phép nhân trước, còn lại là số hạng chưa biết.", "Do the multiplication first; what remains is an unknown addend.")
      });
    }
  };

  const T_ = (a, r) => r.pick(Object.keys(a).map(k => a[k]))(r);
  LESSON({
    id: "findx", reg: "so", emoji: "🔎", optional: true, adv: true,
    title: LT("Tìm x – quan hệ giữa các thành phần", "Finding x – how the parts relate"),
    blurb: LT("Tìm số chưa biết x bằng phép tính ngược lại", "Find the unknown x with the opposite operation"),
    links: ["addsub", "mul"],
    rule: {
      h: LT("Ghi nhớ", "Remember"),
      items: [
        LT("**Số hạng** chưa biết = tổng − số hạng kia. **Số bị trừ** = hiệu + số trừ. **Số trừ** = số bị trừ − hiệu.", "Unknown **addend** = sum − other addend. **Minuend** = difference + subtrahend. **Subtrahend** = minuend − difference."),
        LT("**Thừa số** chưa biết = tích : thừa số kia. **Số bị chia** = thương × số chia. **Số chia** = số bị chia : thương.", "Unknown **factor** = product ÷ other factor. **Dividend** = quotient × divisor. **Divisor** = dividend ÷ quotient."),
        LT("Gặp biểu thức hai phép tính: coi một phép tính là **một khối**, tìm khối trước rồi tìm x.", "With two operations: treat one operation as **one block**, find the block first, then find x."),
        LT("Luôn **thử lại** bằng cách thay x vào đề bài.", "Always **check** by putting x back into the problem.")
      ]
    },
    figs: {
      a: () => RAWFIG([
        () => {
          let s = T(100, 34, "đã có", "already have", { s: 15 }) + T(262, 34, "túi bí ẩn", "mystery bag", { s: 15 });
          s += TH.tape(10, 44, 340, 50, [{ u: 9, f: "sky", t: "9" }, { u: 6, f: "yellow", t: "x" }]);
          s += TH.brace(10, 350, 102, null);
          s += T(180, 148, "tất cả: 15", "all together: 15", { s: 18 });
          s += T(180, 176, "9 + x = 15", "9 + x = 15", { s: 20 });
          return TH.svg(195, s);
        },
        () => {
          let s = T(100, 34, "đã có", "already have", { s: 15 }) + T(262, 34, "túi bí ẩn", "mystery bag", { s: 15 });
          s += TH.tape(10, 44, 340, 50, [{ u: 9, f: "sky", t: "9" }, { u: 6, f: "mint", t: "6" }]);
          s += TH.brace(10, 350, 102, null);
          s += T(180, 148, "tất cả: 15", "all together: 15", { s: 18 });
          s += T(180, 178, "x = 15 − 9 = 6", "x = 15 − 9 = 6", { s: 20 });
          return TH.svg(195, s);
        }
      ]),
      b: () => RAWFIG([
        () => {
          let s = T(180, 28, "ban đầu: x", "at first: x", { s: 16 });
          s += TH.tape(10, 38, 340, 40, [{ u: 1, f: "yellow", t: "x" }]);
          s += T(180, 108, "bớt 8, còn 14", "take away 8, 14 left", { s: 16 });
          s += TH.tape(10, 118, 340, 40, [{ u: 8, f: "rose", t: "8", dash: "5 4" }, { u: 14, f: "mint", t: "14" }]);
          s += T(180, 192, "x − 8 = 14   →   x = 14 + 8 = 22", "x − 8 = 14   →   x = 14 + 8 = 22", { s: 17 });
          return TH.svg(215, s);
        },
        () => {
          let s = T(180, 28, "ban đầu: 30", "at first: 30", { s: 16 });
          s += TH.tape(10, 38, 340, 40, [{ u: 1, f: "sky", t: "30" }]);
          s += T(180, 108, "bớt x, còn 12", "take away x, 12 left", { s: 16 });
          s += TH.tape(10, 118, 340, 40, [{ u: 18, f: "yellow", t: "x" }, { u: 12, f: "mint", t: "12" }]);
          s += T(180, 192, "30 − x = 12   →   x = 30 − 12 = 18", "30 − x = 12   →   x = 30 − 12 = 18", { s: 17 });
          return TH.svg(215, s);
        }
      ]),
      c: () => RAWFIG([
        () => {
          let s = "";
          const rs = [["x × 6 = 48", "x = 48 : 6 = 8", "x × 6 = 48", "x = 48 ÷ 6 = 8"], ["x : 6 = 8", "x = 8 × 6 = 48", "x ÷ 6 = 8", "x = 8 × 6 = 48"], ["48 : x = 6", "x = 48 : 6 = 8", "48 ÷ x = 6", "x = 48 ÷ 6 = 8"]];
          for (let i = 0; i < 3; i++) {
            const y = 14 + i * 58;
            s += TH.box(10, y, 135, 42, LT(rs[i][0], rs[i][2]), "sun", { s: 18 });
            s += TH.arr(150, y + 21, 195, y + 21, {});
            s += TH.box(200, y, 150, 42, LT(rs[i][1], rs[i][3]), "mint", { s: 16 });
          }
          return TH.svg(195, s);
        }
      ]),
      d: () => RAWFIG([
        () => {
          let s = TH.box(10, 40, 50, 44, "40", "sky", { s: 20 }) + T(76, 72, "+", "+", { s: 22 });
          s += TH.box(92, 40, 104, 44, LT("36 : x", "36 ÷ x"), "orange", { s: 20 }) + T(212, 72, "=", "=", { s: 22 }) + TH.box(228, 40, 50, 44, "49", "mint", { s: 20 });
          s += TH.brace(92, 196, 92, null);
          s += T(144, 138, "một khối chưa biết", "one unknown block", { s: 15 });
          s += T(180, 176, "36 : x = 49 − 40 = 9", "36 ÷ x = 49 − 40 = 9", { s: 19 });
          return TH.svg(195, s);
        },
        () => {
          let s = TH.box(80, 12, 200, 42, LT("36 : x = 9", "36 ÷ x = 9"), "sun", { s: 19 }) + TH.arr(180, 58, 180, 82, {});
          s += TH.box(80, 86, 200, 42, LT("x = 36 : 9 = 4", "x = 36 ÷ 9 = 4"), "mint", { s: 19 }) + TH.arr(180, 132, 180, 156, {});
          s += TH.box(50, 160, 260, 42, LT("40 + 36 : 4 = 49", "40 + 36 ÷ 4 = 49"), "rose", { s: 19 });
          s += T(180, 228, "Thử lại: đúng rồi!", "Check: it works!", { s: 17 });
          return TH.svg(245, s);
        }
      ])
    },
    teach: [
      { key: "a", f: 0, say: LT("Cùng làm: Nam có 9 viên bi, bạn cho thêm một túi bi bí ẩn. Giờ Nam có 15 viên. Gọi số bi trong túi là **x**: 9 + x = 15.", "Let's work it out: Nam has 9 marbles and a friend gives him a mystery bag. Now he has 15. Call the number in the bag **x**: 9 + x = 15.") },
      { key: "a", f: 1, say: LT("x là số hạng chưa biết nên lấy **tổng trừ số hạng kia**: x = 15 − 9 = **6**. Thử lại: 9 + 6 = 15. Đúng!", "x is the unknown addend, so take the **sum minus the other addend**: x = 15 − 9 = **6**. Check: 9 + 6 = 15. Correct!") },
      { key: "b", f: 0, say: LT("Bớt đi 8 thì còn 14: x − 8 = 14. x là số bị trừ nên **cộng** lại: x = 14 + 8 = 22.", "Take away 8 and 14 is left: x − 8 = 14. x is the minuend, so **add** back: x = 14 + 8 = 22."),
        ask: { q: LT("Tìm x: x − 15 = 20", "Find x: x − 15 = 20"), opts: ["5", "35", "300"], ans: "35", good: LT("Đúng! x − 15 = 20 thì x = 20 + 15 = 35.", "Right! x − 15 = 20 so x = 20 + 15 = 35.") } },
      { key: "b", f: 1, say: LT("Còn 30 − x = 12: x là số trừ nên ta **trừ**: x = 30 − 12 = **18**. Phải nhìn xem x đứng ở vị trí nào!", "Now 30 − x = 12: x is the part taken away, so we **subtract**: x = 30 − 12 = **18**. Always look at where x sits!") },
      { key: "c", f: 0, say: LT("Nhân chia cũng vậy, cứ làm phép tính **ngược lại**: thừa số = tích : thừa số kia; số bị chia = thương × số chia; số chia = số bị chia : thương.", "Multiplying and dividing work the same way: do the **opposite** operation: factor = product ÷ other factor; dividend = quotient × divisor; divisor = dividend ÷ quotient.") },
      { key: "d", f: 0, say: LT("Khó hơn: 40 + 36 : x = 49. Coi [[36 : x]] là **một khối** (số hạng chưa biết): 36 : x = 49 − 40 = 9.", "Harder: 40 + 36 ÷ x = 49. Treat [[36 ÷ x]] as **one block** (the unknown addend): 36 ÷ x = 49 − 40 = 9.") },
      { key: "d", f: 1, say: LT("Số chia chưa biết: x = 36 : 9 = 4. Thử lại: 40 + 36 : 4 = 40 + 9 = 49. Đúng!", "Unknown divisor: x = 36 ÷ 9 = 4. Check: 40 + 36 ÷ 4 = 40 + 9 = 49. Correct!"),
        ask: { q: LT("Tìm x: x + 24 : 6 = 10", "Find x: x + 24 ÷ 6 = 10"), opts: ["4", "6", "10"], ans: "6", good: LT("Đúng! 24 : 6 = 4, x = 10 − 4 = 6.", "Right! 24 ÷ 6 = 4, x = 10 − 4 = 6.") } }
    ].map(s => s.ask ? Object.assign({}, s, { ask: s.ask }) : s),
    gen(tier, r) {
      if (tier === 1) return T_(t1, r);
      if (tier === 2) return T_(t2, r);
      return T_(t3, r);
    }
  });
}

})();

;(function(){/* seq.js */
/* Bài học: Dãy số cách đều (seq) */
const T_ = (x, y, vi, en, o) => TH.t(x, y, LT(vi, en), o);
const ORG = "#D9480F";
const FILLS = ["sky", "mint", "sun", "rose", "lilac", "sky", "mint"];
const F = fmt;
const ls = arr => arr.map(v => F(v)).join("; ");
const mk = (a, d, n) => Array.from({ length: n }, (_, i) => a + i * d);
const jumpRow = (vals, y, o) => {
  o = o || {};
  let n = vals.length, w = o.w || 44, h = o.h || 40, x0 = 10, span = 340, gap = n > 1 ? (span - n * w) / (n - 1) : 0, s = "";
  vals.forEach((v, i) => {
    let x = x0 + i * (w + gap);
    s += TH.box(x, y, w, h, v, (o.fills && o.fills[i]) || "sky", { s: o.s || 20 });
    if (o.jump && i < n - 1) {
      let c1 = x + w / 2, c2 = x + w + gap + w / 2, m = (c1 + c2) / 2;
      s += TH.path("M" + c1 + " " + y + " Q" + m + " " + (y - 32) + " " + c2 + " " + y, "none", { sw: 2.5, stroke: ORG });
      s += TH.poly(c2 + "," + (y - 1) + " " + (c2 - 9) + "," + (y - 8) + " " + (c2 - 2) + "," + (y - 11), ORG, { stroke: ORG, sw: 1 });
      s += TH.t(m, y - 24, o.jump, { s: 15, c: ORG });
    }
  });
  return s;
};
const cx = (n, i, w) => 10 + i * (w + (340 - n * w) / (n - 1)) + w / 2;

LESSON({
  id: "seq", reg: "toan", emoji: "🪜", optional: true, adv: true,
  title: LT("Dãy số cách đều", "Equally Spaced Sequences"),
  blurb: LT("Tìm số hạng, đếm số số hạng và tính tổng của dãy cách đều", "Find terms, count terms and add up an equally spaced list"),
  links: ["addsub", "mul"],
  rule: {
    h: LT("Ghi nhớ", "Remember"),
    items: [
      LT("Dãy cách đều: mỗi số hơn (hoặc kém) số liền trước một lượng **bằng nhau** (gọi là bước).", "Equally spaced list: each number is the **same amount** more (or less) than the one before (called the step)."),
      LT("Số thứ n = số đầu + (n − 1) × bước.", "The nth number = first number + (n − 1) × step."),
      LT("Số số hạng = (số cuối − số đầu) : bước + 1.", "Number of terms = (last − first) ÷ step + 1."),
      LT("Tổng = (số đầu + số cuối) × số số hạng : 2.", "Sum = (first + last) × number of terms ÷ 2.")
    ]
  },
  figs: {
    a: () => RAWFIG([
      () => {
        let s = jumpRow([3, 7, 11, 15, 19], 90, { w: 52, h: 44, s: 22, jump: "+4", fills: FILLS });
        s += T_(180, 180, "7 − 3 = 4     11 − 7 = 4", "7 − 3 = 4     11 − 7 = 4", { s: 18 });
        return TH.svg(205, s);
      },
      () => {
        let s = jumpRow([3, 7, 11, 15, 19, "?"], 80, { w: 44, jump: "+4", fills: ["sky", "sky", "sky", "sky", "sky", "yellow"] });
        s += T_(180, 160, "Số sau = số trước + 4", "Next = previous + 4", { s: 18 });
        return TH.svg(190, s);
      },
      () => {
        let s = jumpRow([3, 7, 11, 15, 19], 50, { w: 52, h: 44, s: 22, fills: FILLS });
        const ids = [["thứ 1", "1st"], ["thứ 2", "2nd"], ["thứ 3", "3rd"], ["thứ 4", "4th"], ["thứ 5", "5th"]];
        for (let i = 0; i < 5; i++) s += T_(cx(5, i, 52), 118, ids[i][0], ids[i][1], { s: 15 });
        s += TH.brace(36, 324, 134, null);
        s += T_(180, 184, "4 lần nhảy +4: 3 + 4 × 4 = 19", "4 jumps of +4: 3 + 4 × 4 = 19", { s: 17 });
        return TH.svg(205, s);
      },
      () => {
        let s = "";
        s += T_(36, 40, "đầu", "first", { s: 15 }) + T_(116, 40, "nhảy", "jumps", { s: 15 }) + T_(196, 40, "bước", "step", { s: 15 }) + T_(300, 40, "số thứ 20", "20th term", { s: 15 });
        s += TH.box(10, 50, 52, 44, "3", "sky", { s: 22 }) + TH.t(76, 82, "+", { s: 24 });
        s += TH.box(90, 50, 52, 44, "19", "sun", { s: 22 }) + TH.t(156, 82, "×", { s: 24 });
        s += TH.box(170, 50, 52, 44, "4", "rose", { s: 22 }) + TH.t(238, 82, "=", { s: 24 });
        s += TH.box(252, 50, 98, 44, "79", "mint", { s: 24 });
        s += TH.arr(116, 130, 116, 100, { c: ORG });
        s += T_(116, 152, "19 = 20 − 1", "19 = 20 − 1", { s: 17 });
        s += T_(180, 186, "số thứ n = đầu + (n − 1) × bước", "nth = first + (n − 1) × step", { s: 15 });
        return TH.svg(205, s);
      },
      () => {
        let s = "", xs = [50, 140, 230, 320], i;
        s += TH.r(50, 78, 270, 10, "gray", { rx: 3, sw: 2 }) + TH.r(50, 108, 270, 10, "gray", { rx: 3, sw: 2 });
        for (i = 0; i < 4; i++) {
          s += TH.r(xs[i] - 9, 58, 18, 90, "orange", { rx: 5 });
          s += TH.c(xs[i], 36, 16, "pink") + TH.t(xs[i], 43, i + 1, { s: 18 });
        }
        for (i = 0; i < 3; i++) s += TH.c(xs[i] + 45, 98, 14, "yellow") + TH.t(xs[i] + 45, 104, i + 1, { s: 16 });
        s += T_(180, 178, "3; 7; 11; …; 59: khoảng = (59 − 3) : 4 = 14", "3; 7; 11; …; 59: gaps = (59 − 3) ÷ 4 = 14", { s: 15 });
        s += T_(180, 206, "Số số hạng = 14 + 1 = 15", "Terms = 14 + 1 = 15", { s: 18 });
        return TH.svg(225, s);
      },
      () => {
        let vals = [3, 7, 11, 15, 19, 23], s = jumpRow(vals, 20, { w: 44, fills: FILLS }), pairs = [[0, 5, 74], [1, 4, 52], [2, 3, 30]];
        pairs.forEach(p => {
          let x1 = cx(6, p[0], 44), x2 = cx(6, p[1], 44), m = (x1 + x2) / 2;
          s += TH.path("M" + x1 + " 62 Q" + x1 + " " + (62 + p[2]) + " " + m + " " + (62 + p[2]) + " Q" + x2 + " " + (62 + p[2]) + " " + x2 + " 62", "none", { sw: 2.5, stroke: ORG });
          s += '<rect x="' + (m - 15) + '" y="' + (62 + p[2] - 11) + '" width="30" height="22" rx="6" fill="#fff"/>' + TH.t(m, 62 + p[2] + 6, "26", { s: 17, c: ORG });
        });
        s += T_(180, 176, "3 cặp, mỗi cặp 26", "3 pairs of 26 each", { s: 16 });
        s += T_(180, 200, "3 × 26 = 78", "3 × 26 = 78", { s: 20 });
        return TH.svg(215, s);
      }
    ])
  },
  teach: [
    { key: "a", f: 0, say: LT("Xét dãy 3; 7; 11; 15; 19. Lấy **số sau trừ số trước**: 7 − 3 = 4, 11 − 7 = 4… lần nào cũng bằng 4. Vậy đây là dãy số cách đều, **bước** là 4.", "Look at the list 3; 7; 11; 15; 19. Take the **next number minus the one before**: 7 − 3 = 4, 11 − 7 = 4… always 4. So this is an equally spaced list with **step** 4.") },
    { key: "a", f: 1, say: LT("Muốn viết tiếp, ta cộng thêm bước. Số tiếp theo sau 19 là gì?", "To continue, add the step. What number comes after 19?"),
      ask: { opts: ["22", "23", "24"], ans: "23", good: LT("Đúng rồi! 19 + 4 = 23.", "Right! 19 + 4 = 23.") } },
    { key: "a", f: 2, say: LT("Số thứ 5 là 19. Từ số thứ 1 đến số thứ 5 có **4 lần nhảy** (ít hơn thứ tự 1), mỗi lần +4: 3 + 4 × 4 = 19.", "The 5th number is 19. From the 1st to the 5th there are **4 jumps** (one less than the position), each +4: 3 + 4 × 4 = 19.") },
    { key: "a", f: 3, say: LT("Số thứ 20 của dãy là bao nhiêu? Nhảy 20 − 1 = 19 lần, mỗi lần +4: 3 + 19 × 4 = ?", "What is the 20th number? Make 20 − 1 = 19 jumps of +4: 3 + 19 × 4 = ?"),
      ask: { opts: ["75", "79", "83"], ans: "79", good: LT("Đúng! 19 × 4 = 76, cộng 3 được 79.", "Right! 19 × 4 = 76, plus 3 is 79.") } },
    { key: "a", f: 4, say: LT("Dãy 3; 7; 11; …; 59 có bao nhiêu số? Đếm như cọc hàng rào: **khoảng** (59 − 3) : 4 = 14, rồi **cộng 1** được 15 số.", "How many numbers are in 3; 7; 11; …; 59? Count like fence posts: **gaps** (59 − 3) ÷ 4 = 14, then **add 1** to get 15 numbers.") },
    { key: "a", f: 5, say: LT("Tính 3 + 7 + 11 + 15 + 19 + 23: ghép số đầu với số cuối, mỗi cặp được 26. Có 6 : 2 = 3 cặp nên tổng là 3 × 26 = 78.", "Add 3 + 7 + 11 + 15 + 19 + 23: pair the first with the last, each pair makes 26. There are 6 ÷ 2 = 3 pairs, so the sum is 3 × 26 = 78.") }
  ],
  gen(tier, r) {
    const a1 = rd(r, 1, 20), d1 = rd(r, 2, 9);
    if (tier === 1) {
      let k = r.int(0, 4);
      if (k === 0) {
        let a = a1, d = d1, v = mk(a, d, 6);
        return QQ({
          q: LT("Viết tiếp số thích hợp vào dãy cách đều: **" + ls(v.slice(0, 5)) + "; ?**", "Fill in the next number of this equally spaced list: **" + ls(v.slice(0, 5)) + "; ?**"),
          parts: [num(LT("Số tiếp theo", "Next number"), v[5])],
          steps: [st(LT("Bước nhảy: " + F(v[1]) + " − " + F(v[0]) + " = " + d, "Step: " + F(v[1]) + " − " + F(v[0]) + " = " + d), d), st(LT("Số tiếp theo: " + F(v[4]) + " + " + d + " = " + F(v[5]), "Next number: " + F(v[4]) + " + " + d + " = " + F(v[5])), v[5])],
          tip: LT("Lấy số sau trừ số trước để tìm bước.", "Take the next number minus the one before to find the step.")
        });
      }
      if (k === 1) {
        let a = a1, d = d1, v = mk(a, d, 6), m = r.int(2, 4), sh = v.map((x, i) => i === m ? "?" : F(x));
        return QQ({
          q: LT("Tìm số còn thiếu trong dãy cách đều: **" + sh.join("; ") + "**", "Find the missing number in this equally spaced list: **" + sh.join("; ") + "**"),
          parts: [num(LT("Số còn thiếu", "Missing number"), v[m])],
          steps: [st(LT("Bước nhảy: " + F(v[1]) + " − " + F(v[0]) + " = " + d, "Step: " + F(v[1]) + " − " + F(v[0]) + " = " + d), d), st(LT("Số còn thiếu: " + F(v[m - 1]) + " + " + d + " = " + F(v[m]), "Missing number: " + F(v[m - 1]) + " + " + d + " = " + F(v[m])), v[m])],
          tip: LT("Tìm bước ở hai số đầu rồi cộng vào số đứng trước chỗ trống.", "Find the step from the first two numbers, then add it to the number before the gap.")
        });
      }
      if (k === 2) {
        let a = a1, d = d1, l = a + 3 * d;
        return QQ({
          q: LT("Dãy số cách đều có số thứ nhất là **" + a + "** và số thứ tư là **" + l + "**. Mỗi số hơn số đứng trước nó bao nhiêu?", "An equally spaced list has 1st number **" + a + "** and 4th number **" + l + "**. How much more is each number than the one before it?"),
          parts: [num(LT("Bước", "Step"), d)],
          steps: [st(LT("Từ số thứ 1 đến số thứ 4 có 3 lần nhảy: " + l + " − " + a + " = " + 3 * d, "From the 1st to the 4th there are 3 jumps: " + l + " − " + a + " = " + 3 * d), 3 * d), st(LT("Mỗi lần nhảy: " + 3 * d + " : 3 = " + d, "Each jump: " + 3 * d + " ÷ 3 = " + d), d)],
          tip: LT("Từ số thứ 1 đến số thứ 4 có mấy lần nhảy?", "How many jumps are there from the 1st to the 4th number?")
        });
      }
      if (k === 3) {
        let a = a1, d = d1, n = rd(r, 5, 10), v = mk(a, d, n), l = v[n - 1];
        return QQ({
          q: LT("Dãy **" + ls(v.slice(0, 3)) + "; …; " + F(l) + "** (cách đều) có bao nhiêu số?", "How many numbers are in the equally spaced list **" + ls(v.slice(0, 3)) + "; …; " + F(l) + "**?"),
          parts: [num(LT("Số số hạng", "Number of terms"), n, LT("số", "numbers"))],
          steps: [st(LT("Số khoảng: (" + F(l) + " − " + a + ") : " + d + " = " + (n - 1), "Gaps: (" + F(l) + " − " + a + ") ÷ " + d + " = " + (n - 1)), n - 1), st(LT("Số số hạng: " + (n - 1) + " + 1 = " + n, "Terms: " + (n - 1) + " + 1 = " + n), n)],
          tip: LT("Đếm khoảng cách trước, rồi cộng thêm 1 như đếm cọc hàng rào.", "Count the gaps first, then add 1 like counting fence posts.")
        });
      }
      let a = a1, d = d1, n = rd(r, 6, 9), v = mk(a, d, n);
      return QQ({
        q: LT("Tìm số thứ **" + n + "** của dãy cách đều: **" + ls(v.slice(0, 4)) + "; …**", "Find the **" + n + "th** number of the equally spaced list: **" + ls(v.slice(0, 4)) + "; …**"),
        parts: [num(LT("Số thứ " + n, "Term " + n), v[n - 1])],
        steps: [st(LT("Số lần nhảy: " + n + " − 1 = " + (n - 1), "Number of jumps: " + n + " − 1 = " + (n - 1)), n - 1), st(LT("Số thứ " + n + ": " + a + " + " + (n - 1) + " × " + d + " = " + F(v[n - 1]), "Term " + n + ": " + a + " + " + (n - 1) + " × " + d + " = " + F(v[n - 1])), v[n - 1])],
        tip: LT("Số lần nhảy ít hơn thứ tự 1.", "The number of jumps is one less than the position.")
      });
    }
    if (tier === 2) {
      let k = r.int(0, 4), a = rd(r, 1, 30), d = rd(r, 2, 12);
      if (k === 0) {
        let n = rd(r, 10, 40), v = mk(a, d, 3), ans = a + (n - 1) * d;
        return QQ({
          q: LT("Tìm số thứ **" + n + "** của dãy cách đều: **" + ls(v) + "; …**", "Find the **" + n + "th** number of the equally spaced list: **" + ls(v) + "; …**"),
          parts: [num(LT("Số thứ " + n, "Term " + n), ans)],
          steps: [st(LT("Bước: " + F(v[1]) + " − " + F(v[0]) + " = " + d, "Step: " + F(v[1]) + " − " + F(v[0]) + " = " + d), d), st(LT("Số lần nhảy: " + n + " − 1 = " + (n - 1), "Jumps: " + n + " − 1 = " + (n - 1)), n - 1), st(LT("Số thứ " + n + ": " + a + " + " + (n - 1) + " × " + d + " = " + F(ans), "Term " + n + ": " + a + " + " + (n - 1) + " × " + d + " = " + F(ans)), ans)],
          tip: LT("Số thứ n = số đầu + (n − 1) × bước.", "nth number = first + (n − 1) × step.")
        });
      }
      if (k === 1) {
        let n = rd(r, 12, 60), v = mk(a, d, n), l = v[n - 1];
        return QQ({
          q: LT("Dãy cách đều **" + ls(v.slice(0, 3)) + "; …; " + F(l) + "** có bao nhiêu số hạng?", "How many terms does the equally spaced list **" + ls(v.slice(0, 3)) + "; …; " + F(l) + "** have?"),
          parts: [num(LT("Số số hạng", "Number of terms"), n, LT("số", "terms"))],
          steps: [st(LT("Bước: " + d, "Step: " + d), d), st(LT("Số khoảng: (" + F(l) + " − " + a + ") : " + d + " = " + (n - 1), "Gaps: (" + F(l) + " − " + a + ") ÷ " + d + " = " + (n - 1)), n - 1), st(LT("Số số hạng: " + (n - 1) + " + 1 = " + n, "Terms: " + (n - 1) + " + 1 = " + n), n)],
          tip: LT("Số số hạng = số khoảng + 1.", "Number of terms = gaps + 1.")
        });
      }
      if (k === 2) {
        let n = rd(r, 10, 30), v = mk(a, d, 4), x = a + (n - 1) * d, o = [x];
        let cands = [x - 1, x + 1, x + 2, x - 2, x + d + 1, x - d - 1].filter(z => z > a && (z - a) % d !== 0);
        cands = r.shuffle(cands);
        o.push(cands[0], cands[1]);
        if (new Set(o).size < 3) return byId("seq").gen(2, r);
        let opts = r.shuffle(o.map(String));
        return QQ({
          q: LT("Số nào sau đây thuộc dãy cách đều **" + ls(v) + "; …**?", "Which of these numbers is in the equally spaced list **" + ls(v) + "; …**?"),
          parts: [chp(opts, String(x), LT("Chọn số thuộc dãy", "Pick the number in the list"))],
          steps: [st(LT("Bước: " + d + ". Số thuộc dãy thì (số đó − " + a + ") chia hết cho " + d, "Step: " + d + ". A number in the list has (number − " + a + ") divisible by " + d), d), st(LT(x + " − " + a + " = " + (x - a) + ", chia hết cho " + d + " được " + (x - a) / d, x + " − " + a + " = " + (x - a) + ", divisible by " + d + ": " + (x - a) / d), (x - a) / d)],
          tip: LT("Số đó trừ số đầu phải chia hết cho bước.", "The number minus the first number must be divisible by the step.")
        });
      }
      if (k === 3) {
        let n = rd(r, 8, 40), v = mk(a, d, 3), x = a + (n - 1) * d;
        return QQ({
          q: LT("Trong dãy cách đều **" + ls(v) + "; …**, số **" + F(x) + "** là số thứ mấy?", "In the equally spaced list **" + ls(v) + "; …**, which position is the number **" + F(x) + "** in?"),
          parts: [num(LT("Số thứ", "Position"), n)],
          steps: [st(LT("Bước: " + d, "Step: " + d), d), st(LT("Số lần nhảy: (" + F(x) + " − " + a + ") : " + d + " = " + (n - 1), "Jumps: (" + F(x) + " − " + a + ") ÷ " + d + " = " + (n - 1)), n - 1), st(LT("Thứ tự: " + (n - 1) + " + 1 = " + n, "Position: " + (n - 1) + " + 1 = " + n), n)],
          tip: LT("Tìm số lần nhảy trước, rồi cộng thêm 1.", "Find the number of jumps first, then add 1.")
        });
      }
      if (r.int(0, 1)) {
        let n = 2 * rd(r, 10, 50), ans = n * (n + 1) / 2;
        return QQ({
          q: LT("Tính nhanh: **1 + 2 + 3 + … + " + n + "**", "Work it out quickly: **1 + 2 + 3 + … + " + n + "**"),
          parts: [num(LT("Tổng", "Sum"), ans)],
          steps: [st(LT("Ghép đầu với cuối: 1 + " + n + " = " + (n + 1), "Pair first with last: 1 + " + n + " = " + (n + 1)), n + 1), st(LT("Số cặp: " + n + " : 2 = " + n / 2, "Pairs: " + n + " ÷ 2 = " + n / 2), n / 2), st(LT("Tổng: " + (n + 1) + " × " + n / 2 + " = " + F(ans), "Sum: " + (n + 1) + " × " + n / 2 + " = " + F(ans)), ans)],
          tip: LT("Ghép số đầu với số cuối, mỗi cặp có tổng bằng nhau.", "Pair the first with the last; every pair has the same sum.")
        });
      }
      let n = 2 * rd(r, 3, 10), v = mk(a, d, n), l = v[n - 1], sum = (a + l) * n / 2;
      return QQ({
        q: LT("Tính tổng: **" + ls(v.slice(0, 3)).replace(/; /g, " + ") + " + … + " + F(l) + "** (dãy cách đều, có " + n + " số hạng).", "Find the sum: **" + ls(v.slice(0, 3)).replace(/; /g, " + ") + " + … + " + F(l) + "** (equally spaced, " + n + " terms)."),
        parts: [num(LT("Tổng", "Sum"), sum)],
        steps: [st(LT("Mỗi cặp (đầu + cuối): " + a + " + " + F(l) + " = " + F(a + l), "Each pair (first + last): " + a + " + " + F(l) + " = " + F(a + l)), a + l), st(LT("Số cặp: " + n + " : 2 = " + n / 2, "Pairs: " + n + " ÷ 2 = " + n / 2), n / 2), st(LT("Tổng: " + F(a + l) + " × " + n / 2 + " = " + F(sum), "Sum: " + F(a + l) + " × " + n / 2 + " = " + F(sum)), sum)],
        tip: LT("Tổng = (số đầu + số cuối) × số số hạng : 2.", "Sum = (first + last) × number of terms ÷ 2.")
      });
    }
    /* tier 3 */
    let k = r.int(0, 6);
    if (k === 0) {
      let d = rd(r, 2, 9), g = rd(r, 8, 40), L = d * g, c = rd(r, 2, 9), trees = g + 1;
      return QQ({
        q: LT("Người ta trồng cây thành một hàng dọc con đường dài **" + F(L) + " m**, cây đầu ở đầu đường, cây cuối ở cuối đường, hai cây liên tiếp cách nhau **" + d + " m**. Hỏi trồng bao nhiêu cây? Mỗi cây giá **" + c + " nghìn đồng**, hỏi tổng tiền mua cây?", "Trees are planted in a row along a road **" + F(L) + " m** long, one at each end, with **" + d + " m** between neighbouring trees. How many trees are planted? Each tree costs **" + c + " thousand dong**; how much do all the trees cost?"),
        parts: [num(LT("Số cây", "Trees"), trees, LT("cây", "trees")), num(LT("Tiền mua cây", "Cost"), trees * c, LT("nghìn đồng", "thousand dong"))],
        steps: [st(LT("Số khoảng cách: " + F(L) + " : " + d + " = " + g, "Gaps: " + F(L) + " ÷ " + d + " = " + g), g), st(LT("Số cây: " + g + " + 1 = " + trees, "Trees: " + g + " + 1 = " + trees), trees), st(LT("Tiền: " + trees + " × " + c + " = " + trees * c + " (nghìn đồng)", "Cost: " + trees + " × " + c + " = " + trees * c + " (thousand dong)"), trees * c)],
        tip: LT("Trồng ở cả hai đầu thì số cây nhiều hơn số khoảng 1.", "With a tree at both ends, there is one more tree than gaps.")
      });
    }
    if (k === 1) {
      let a = rd(r, 10, 30), d = rd(r, 2, 6), n = 2 * rd(r, 4, 10), l = a + (n - 1) * d, tot = (a + l) * n / 2;
      return QQ({
        q: LT("Một rạp hát có **" + n + " hàng ghế**. Hàng đầu có **" + a + " ghế**, mỗi hàng sau nhiều hơn hàng trước **" + d + " ghế**. Hỏi hàng cuối có bao nhiêu ghế? Cả rạp có bao nhiêu ghế?", "A theatre has **" + n + " rows** of seats. The first row has **" + a + " seats** and each row has **" + d + " more seats** than the row before. How many seats are in the last row? How many seats are there in all?"),
        parts: [num(LT("Hàng cuối", "Last row"), l, LT("ghế", "seats")), num(LT("Cả rạp", "Whole theatre"), tot, LT("ghế", "seats"))],
        steps: [st(LT("Hàng cuối: " + a + " + " + (n - 1) + " × " + d + " = " + l, "Last row: " + a + " + " + (n - 1) + " × " + d + " = " + l), l), st(LT("Mỗi cặp (đầu + cuối): " + a + " + " + l + " = " + (a + l) + "; có " + n + " : 2 = " + n / 2 + " cặp", "Each pair (first + last): " + a + " + " + l + " = " + (a + l) + "; there are " + n + " ÷ 2 = " + n / 2 + " pairs"), a + l), st(LT("Cả rạp: " + (a + l) + " × " + n / 2 + " = " + tot + " (ghế)", "Whole theatre: " + (a + l) + " × " + n / 2 + " = " + tot + " (seats)"), tot)],
        tip: LT("Tìm hàng cuối trước, rồi ghép hàng đầu với hàng cuối.", "Find the last row first, then pair the first row with the last.")
      });
    }
    if (k === 2) {
      let nm = r.pick(["Lan", "Mai", "Nam", "Hùng"]), a = rd(r, 5, 15), d = rd(r, 2, 5), n = rd(r, 8, 30), x = a + (n - 1) * d, tot = n % 2 ? (a + x) * ((n - 1) / 2) + (a + x) / 2 : (a + x) * n / 2;
      if ((a + x) * n % 2) return byId("seq").gen(3, r);
      tot = (a + x) * n / 2;
      return QQ({
        q: LT(nm + " đọc truyện: ngày đầu đọc **" + a + " trang**, mỗi ngày sau đọc nhiều hơn ngày trước **" + d + " trang**. Đến ngày nào " + nm + " đọc đúng **" + x + " trang**? Tính đến hết ngày đó, " + nm + " đã đọc tất cả bao nhiêu trang?", nm + " reads a storybook: on day 1 they read **" + a + " pages**, and each day after they read **" + d + " pages more** than the day before. On which day do they read exactly **" + x + " pages**? Up to the end of that day, how many pages have they read in all?"),
        parts: [num(LT("Ngày thứ", "Day number"), n), num(LT("Tổng số trang", "Total pages"), tot, LT("trang", "pages"))],
        steps: [st(LT("Số lần tăng: (" + x + " − " + a + ") : " + d + " = " + (n - 1), "Increases: (" + x + " − " + a + ") ÷ " + d + " = " + (n - 1)), n - 1), st(LT("Ngày thứ: " + (n - 1) + " + 1 = " + n, "Day number: " + (n - 1) + " + 1 = " + n), n), st(LT("Tổng: (" + a + " + " + x + ") × " + n + " : 2 = " + F(tot) + " (trang)", "Total: (" + a + " + " + x + ") × " + n + " ÷ 2 = " + F(tot) + " (pages)"), tot)],
        tip: LT("Tìm số ngày như tìm số số hạng, rồi tính tổng bằng cách ghép cặp.", "Find the number of days like the number of terms, then add by pairing.")
      });
    }
    if (k === 3) {
      let L = 2 * rd(r, 20, 50) + 1, odd = (L - 1) / 2 + 1, ev = (L + 1) / 2, tot = odd + ev;
      return QQ({
        q: LT("Các nhà ở một bên phố được đánh số lẻ liên tiếp **1; 3; 5; …; " + L + "**. Các nhà ở bên kia phố được đánh số chẵn liên tiếp **2; 4; 6; …; " + (L + 1) + "**. Hỏi mỗi bên có bao nhiêu nhà? Cả phố có bao nhiêu nhà?", "Houses on one side of a street are numbered with consecutive odd numbers **1; 3; 5; …; " + L + "**. Houses on the other side are numbered with consecutive even numbers **2; 4; 6; …; " + (L + 1) + "**. How many houses are on the odd side? How many on the whole street?"),
        parts: [num(LT("Bên số lẻ", "Odd side"), odd, LT("nhà", "houses")), num(LT("Cả phố", "Whole street"), tot, LT("nhà", "houses"))],
        steps: [st(LT("Bên số lẻ: (" + L + " − 1) : 2 + 1 = " + odd, "Odd side: (" + L + " − 1) ÷ 2 + 1 = " + odd), odd), st(LT("Bên số chẵn: (" + (L + 1) + " − 2) : 2 + 1 = " + ev, "Even side: (" + (L + 1) + " − 2) ÷ 2 + 1 = " + ev), ev), st(LT("Cả phố: " + odd + " + " + ev + " = " + tot, "Whole street: " + odd + " + " + ev + " = " + tot), tot)],
        tip: LT("Mỗi bên là một dãy cách đều bước 2. Đếm khoảng rồi cộng 1.", "Each side is an equally spaced list with step 2. Count the gaps, then add 1.")
      });
    }
    if (k === 4) {
      let p = rd(r, 3, 6), q = p + rd(r, 3, 6), d = rd(r, 2, 9), a = rd(r, 1, 15), tp = a + (p - 1) * d, tq = a + (q - 1) * d;
      return QQ({
        q: LT("Một dãy số cách đều có số thứ **" + p + "** là **" + tp + "** và số thứ **" + q + "** là **" + tq + "**. Tìm bước và số đầu tiên của dãy.", "An equally spaced list has its **" + p + "th** number equal to **" + tp + "** and its **" + q + "th** number equal to **" + tq + "**. Find the step and the first number."),
        parts: [num(LT("Bước", "Step"), d), num(LT("Số đầu tiên", "First number"), a)],
        steps: [st(LT("Từ số thứ " + p + " đến số thứ " + q + " có " + (q - p) + " lần nhảy: " + tq + " − " + tp + " = " + (tq - tp), "From the " + p + "th to the " + q + "th there are " + (q - p) + " jumps: " + tq + " − " + tp + " = " + (tq - tp)), tq - tp), st(LT("Bước: " + (tq - tp) + " : " + (q - p) + " = " + d, "Step: " + (tq - tp) + " ÷ " + (q - p) + " = " + d), d), st(LT("Số đầu: " + tp + " − " + (p - 1) + " × " + d + " = " + a, "First number: " + tp + " − " + (p - 1) + " × " + d + " = " + a), a)],
        tip: LT("Tìm bước từ hiệu của hai số đã cho, rồi lùi về số thứ nhất.", "Find the step from the difference of the two given numbers, then step back to the first number.")
      });
    }
    if (k === 5) {
      let m = rd(r, 3, 9), A, B, lo, hi, cnt;
      if (r.int(0, 1)) { A = 10; B = 99; } else { A = rd(r, 20, 80); B = rd(r, 150, 400); }
      lo = Math.ceil(A / m) * m; hi = Math.floor(B / m) * m; cnt = (hi - lo) / m + 1;
      let what = A === 10 && B === 99;
      return QQ({
        q: LT(what ? "Có bao nhiêu số có hai chữ số chia hết cho **" + m + "**?" : "Từ **" + A + "** đến **" + B + "** có bao nhiêu số chia hết cho **" + m + "**?", what ? "How many two-digit numbers are divisible by **" + m + "**?" : "How many numbers from **" + A + "** to **" + B + "** are divisible by **" + m + "**?"),
        parts: [num(LT("Số lượng", "How many"), cnt, LT("số", "numbers"))],
        steps: [st(LT("Số đầu tiên chia hết cho " + m + ": " + lo + "; số cuối cùng: " + hi, "First multiple of " + m + ": " + lo + "; last multiple: " + hi), lo), st(LT("Các số này cách đều " + m + ". Số khoảng: (" + hi + " − " + lo + ") : " + m + " = " + (cnt - 1), "These numbers are " + m + " apart. Gaps: (" + hi + " − " + lo + ") ÷ " + m + " = " + (cnt - 1)), cnt - 1), st(LT("Số số hạng: " + (cnt - 1) + " + 1 = " + cnt, "Terms: " + (cnt - 1) + " + 1 = " + cnt), cnt)],
        tip: LT("Các số chia hết cho " + m + " tạo thành dãy cách đều. Tìm số đầu và số cuối của dãy.", "Numbers divisible by " + m + " form an equally spaced list. Find its first and last numbers.")
      });
    }
    let a = rd(r, 2, 12), d = rd(r, 2, 8), n = rd(r, 12, 40), l = a + (n - 1) * d, sum = (a + l) * n / 2;
    if ((a + l) * n % 2) return byId("seq").gen(3, r);
    return QQ({
      q: LT("Cho dãy cách đều **" + a + "; " + (a + d) + "; " + (a + 2 * d) + "; …; " + F(l) + "**. Dãy có bao nhiêu số hạng? Tổng tất cả các số hạng là bao nhiêu?", "Take the equally spaced list **" + a + "; " + (a + d) + "; " + (a + 2 * d) + "; …; " + F(l) + "**. How many terms does it have? What is the sum of all the terms?"),
      parts: [num(LT("Số số hạng", "Terms"), n, LT("số", "terms")), num(LT("Tổng", "Sum"), sum)],
      steps: [st(LT("Số khoảng: (" + F(l) + " − " + a + ") : " + d + " = " + (n - 1), "Gaps: (" + F(l) + " − " + a + ") ÷ " + d + " = " + (n - 1)), n - 1), st(LT("Số số hạng: " + (n - 1) + " + 1 = " + n, "Terms: " + (n - 1) + " + 1 = " + n), n), st(LT("Tổng: (" + a + " + " + F(l) + ") × " + n + " : 2 = " + F(sum), "Sum: (" + a + " + " + F(l) + ") × " + n + " ÷ 2 = " + F(sum)), sum)],
      tip: LT("Đếm số số hạng trước, rồi dùng cách ghép cặp đầu – cuối.", "Count the terms first, then pair the first with the last.")
    });
  }
});

})();

;(function(){/* struct.js */
(function () {
  const T = (x, y, vi, en, o) => TH.t(x, y, LT(vi, en), o);

  /* Hình dạy: viết thêm chữ số 4 vào bên phải số n, số mới hơn số cũ 355 (n = 39) */
  function tapeFig(step) {
    const u = 29, x0 = 20;
    let s = '', i;
    s += T(180, 24, 'Viết thêm chữ số 4 vào bên phải số n', 'Write the digit 4 after the number n', { s: 16 });
    s += T(180, 46, 'Số mới hơn số cũ 355', 'The new number is 355 more than the old one', { s: 15 });
    s += T(x0, 76, 'Số cũ', 'Old number', { s: 15, a: 'start' });
    s += TH.r(x0, 84, u, 34, 'sky', { rx: 4 }) + TH.t(x0 + u / 2, 107, 'n', { s: 17 });
    if (step >= 1) s += T(x0, 146, 'Số mới (n bị đẩy sang trái một hàng)', 'New number (n moves one place left)', { s: 15, a: 'start' });
    for (i = 0; step >= 1 && i < 10; i++) {
      const hl = step >= 2 && i > 0;
      s += TH.r(x0 + i * u, 154, u, 34, hl ? 'orange' : 'sky', { rx: 4 }) + TH.t(x0 + i * u + u / 2, 177, 'n', { s: 17 });
    }
    if (step >= 1) s += TH.r(x0 + 10 * u, 154, 30, 34, 'rose', { rx: 4 }) + TH.t(x0 + 10 * u + 15, 177, '4', { s: 17 });
    if (step === 1) s += TH.brace(x0, x0 + 10 * u + 30, 190, null) + T(180, 228, 'số mới = n × 10 + 4', 'new number = n × 10 + 4', { s: 17 });
    if (step === 2) s += TH.brace(x0 + u, x0 + 10 * u + 30, 190, null) + T(190, 228, '9 × n + 4 = 355', '9 × n + 4 = 355', { s: 18 });
    if (step === 3) s += T(180, 214, '9 × n = 355 − 4 = 351', '9 × n = 355 − 4 = 351', { s: 17 }) + T(180, 240, 'n = 351 : 9 = ?', 'n = 351 ÷ 9 = ?', { s: 19, c: '#D9480F' });
    return TH.svg(step === 0 ? 135 : 250, s);
  }
  function checkFig() {
    let s = T(180, 24, 'Thử lại với n = 39', 'Check with n = 39', { s: 17 });
    const d = (cx, str, fills) => str.split('').map((ch, i) => TH.box(cx - str.length * 22 + i * 44, 40, 40, 40, ch, fills[i], { s: 22, rx: 6 })).join('');
    s += T(60, 100, 'số cũ', 'old', { s: 15 }) + d(60, '39', ['sky', 'sky']);
    s += T(260, 100, 'số mới', 'new', { s: 15 }) + d(262, '394', ['sky', 'sky', 'rose']);
    s += T(180, 140, '394 − 39 = 355', '394 − 39 = 355', { s: 20 });
    s += T(180, 170, 'Đúng như đề bài!', 'Just as the problem says!', { s: 17, c: '#1B8A4B' });
    return TH.svg(190, s);
  }
  function swapFig() {
    let s = T(180, 22, 'Đổi chỗ hai chữ số', 'Swap the two digits', { s: 16 });
    s += TH.box(60, 38, 40, 40, '9', 'pink', { s: 22, rx: 6 }) + TH.box(104, 38, 40, 40, '3', 'mint', { s: 22, rx: 6 });
    s += TH.box(216, 38, 40, 40, '3', 'mint', { s: 22, rx: 6 }) + TH.box(260, 38, 40, 40, '9', 'pink', { s: 22, rx: 6 });
    s += TH.arr(152, 58, 208, 58, {});
    s += T(180, 118, '93 − 39 = 54', '93 − 39 = 54', { s: 20 });
    s += T(180, 150, '54 = 9 × 6 và 9 − 3 = 6', '54 = 9 × 6 and 9 − 3 = 6', { s: 17 });
    s += T(180, 180, 'Hiệu hai số luôn chia hết cho 9!', 'The difference is always a multiple of 9!', { s: 16 });
    return TH.svg(200, s);
  }

  /* tiện ích sinh đề */
  const P3 = ['trăm', 'chục', 'đơn vị'], P3e = ['hundreds', 'tens', 'ones'];
  const nm = r => r.pick(['An', 'Bình', 'Chi', 'Dũng', 'Hà', 'Lan', 'Minh', 'Nam']);
  const F = n => fmt(n);

  function t1(r) {
    const k = rd(r, 0, 5);
    if (k === 0) {
      const a = rd(r, 1, 9), b = rd(r, 0, 9), c = rd(r, 0, 9), v = a * 100 + b * 10 + c;
      return QQ({
        q: LT('Số gồm **' + a + ' trăm, ' + b + ' chục và ' + c + ' đơn vị** là số nào?', 'Which number is made of **' + a + (a === 1 ? ' hundred, ' : ' hundreds, ') + b + (b === 1 ? ' ten' : ' tens') + ' and ' + c + (c === 1 ? ' one' : ' ones') + '**?'),
        parts: [num(LT('Số đó', 'The number'), v)],
        steps: [st(LT(a + ' trăm = ' + a * 100 + '; ' + b + ' chục = ' + b * 10 + '; ' + c + ' đơn vị = ' + c, a + ' hundreds = ' + a * 100 + '; ' + b + ' tens = ' + b * 10 + '; ' + c + ' ones = ' + c), a * 100 + b * 10 + c),
          st(LT('Số đó là ' + a * 100 + ' + ' + b * 10 + ' + ' + c + ' = ' + v, 'The number is ' + a * 100 + ' + ' + b * 10 + ' + ' + c + ' = ' + v), v)],
        tip: LT('Mỗi chữ số đứng ở hàng nào thì mang giá trị của hàng đó.', 'Each digit is worth the value of its place.')
      });
    }
    if (k === 1) {
      const a = rd(r, 1, 9), b = rd(r, 1, 9), c = rd(r, 1, 9), p = rd(r, 0, 2), d = [a, b, c][p], m = [100, 10, 1][p], n = a * 100 + b * 10 + c;
      return QQ({
        q: LT('Chữ số ở **hàng ' + P3[p] + '** của số **' + n + '** có giá trị bao nhiêu?', 'What is the value of the digit in the **' + P3e[p] + ' place** of **' + n + '**?'),
        parts: [num(LT('Giá trị', 'Value'), d * m)],
        steps: [st(LT('Chữ số ở hàng ' + P3[p] + ' là ' + d, 'The digit in the ' + P3e[p] + ' place is ' + d), d),
          st(LT(d + ' × ' + m + ' = ' + d * m, d + ' × ' + m + ' = ' + d * m), d * m)],
        tip: LT('Lấy chữ số nhân với giá trị của hàng (100, 10 hoặc 1).', 'Multiply the digit by the value of its place (100, 10 or 1).')
      });
    }
    if (k === 2 || k === 3) {
      const n = rd(r, 10, 99), d = rd(r, 1, 9), left = k === 2, v = left ? d * 100 + n : n * 10 + d;
      return QQ({
        q: LT('Viết thêm chữ số **' + d + '** vào bên ' + (left ? 'trái' : 'phải') + ' số **' + n + '**. Số mới là bao nhiêu?', 'Write the digit **' + d + '** on the ' + (left ? 'left' : 'right') + ' of **' + n + '**. What is the new number?'),
        parts: [num(LT('Số mới', 'New number'), v)],
        steps: left
          ? [st(LT('Chữ số ' + d + ' đứng ở hàng trăm nên là ' + d * 100, 'The digit ' + d + ' is in the hundreds place, so it is worth ' + d * 100), d * 100), st(LT(d * 100 + ' + ' + n + ' = ' + v, d * 100 + ' + ' + n + ' = ' + v), v)]
          : [st(LT('Số ' + n + ' dịch sang trái một hàng: ' + n + ' × 10 = ' + n * 10, n + ' moves one place left: ' + n + ' × 10 = ' + n * 10), n * 10), st(LT(n * 10 + ' + ' + d + ' = ' + v, n * 10 + ' + ' + d + ' = ' + v), v)],
        tip: left ? LT('Chữ số mới đứng ở hàng trăm.', 'The new digit lands in the hundreds place.') : LT('Số cũ gấp lên 10 lần, rồi cộng chữ số mới.', 'The old number becomes 10 times bigger; then add the new digit.')
      });
    }
    if (k === 4) {
      const a = rd(r, 1, 4), v = 12 * a;
      return QQ({
        q: LT('Số có hai chữ số có chữ số hàng chục là **' + a + '**, chữ số hàng đơn vị **gấp đôi** chữ số hàng chục. Đó là số nào?', 'A two-digit number has **' + a + '** in the tens place, and the digit in the ones place is **twice** the tens digit. Which number is it?'),
        parts: [num(LT('Số đó', 'The number'), v)],
        steps: [st(LT('Chữ số hàng đơn vị: ' + a + ' × 2 = ' + 2 * a, 'Ones digit: ' + a + ' × 2 = ' + 2 * a), 2 * a), st(LT('Số đó: ' + a * 10 + ' + ' + 2 * a + ' = ' + v, 'The number: ' + a * 10 + ' + ' + 2 * a + ' = ' + v), v)],
        tip: LT('Tìm chữ số hàng đơn vị trước.', 'Find the ones digit first.')
      });
    }
    const ds = r.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3), big = r.pick([true, false]), srt = ds.slice().sort((x, y) => big ? y - x : x - y), v = srt[0] * 100 + srt[1] * 10 + srt[2];
    return QQ({
      q: LT('Dùng ba chữ số **' + ds.join('; ') + '**, mỗi chữ số một lần, viết số có ba chữ số **' + (big ? 'lớn' : 'bé') + ' nhất**.', 'Use the three digits **' + ds.join('; ') + '**, each once, to write the **' + (big ? 'largest' : 'smallest') + '** three-digit number.'),
      parts: [num(LT('Số đó', 'The number'), v)],
      steps: [st(LT(big ? 'Chữ số lớn nhất đặt ở hàng trăm, rồi đến hàng chục, hàng đơn vị theo thứ tự giảm dần.' : 'Chữ số bé nhất đặt ở hàng trăm, rồi đến hàng chục, hàng đơn vị theo thứ tự tăng dần.', big ? 'Put the biggest digit in the hundreds place, then the tens and ones in decreasing order.' : 'Put the smallest digit in the hundreds place, then the tens and ones in increasing order.'), srt[0]),
        st(LT('Số đó là ' + v, 'The number is ' + v), v)],
      tip: LT('Hàng càng cao thì chữ số đặt ở đó càng quan trọng.', 'The higher the place, the more the digit there matters.')
    });
  }

  function t2(r) {
    const k = rd(r, 0, 4);
    if (k === 0) {
      const n = rd(r, 12, 99), d = rd(r, 1, 9), v = 9 * n + d;
      return QQ({
        q: LT('Viết thêm chữ số **' + d + '** vào bên phải số **' + n + '** được số mới. Số mới hơn số cũ bao nhiêu đơn vị?', 'Write the digit **' + d + '** after **' + n + '** to get a new number. How much bigger is the new number than the old one?'),
        parts: [num(LT('Hơn', 'More by'), v)],
        steps: [st(LT('Số mới: ' + n + ' × 10 + ' + d + ' = ' + (10 * n + d), 'New number: ' + n + ' × 10 + ' + d + ' = ' + (10 * n + d)), 10 * n + d), st(LT('Hơn: ' + (10 * n + d) + ' − ' + n + ' = ' + v, 'Difference: ' + (10 * n + d) + ' − ' + n + ' = ' + v), v)],
        tip: LT('Số mới gồm 10 lần số cũ và chữ số thêm vào.', 'The new number is 10 times the old one plus the added digit.')
      });
    }
    if (k === 1) {
      const A = rd(r, 5, 99), c = rd(r, 1, 9), D = 9 * A + c, n = 10 * A + c;
      return QQ({
        q: LT('Xoá chữ số **' + c + '** ở cuối một số thì số đó giảm đi **' + D + '** đơn vị. Tìm số đó.', 'Cross out the last digit **' + c + '** of a number and the number drops by **' + D + '**. Find the number.'),
        parts: [num(LT('Số đó', 'The number'), n)],
        steps: [st(LT('Gọi số còn lại là A. Số cũ = 10 × A + ' + c + '. Chênh lệch: 9 × A + ' + c + ' = ' + D, 'Call what is left A. Old number = 10 × A + ' + c + '. Difference: 9 × A + ' + c + ' = ' + D), D),
          st(LT('9 × A = ' + D + ' − ' + c + ' = ' + (D - c) + '; A = ' + A, '9 × A = ' + D + ' − ' + c + ' = ' + (D - c) + '; A = ' + A), A),
          st(LT('Số cũ: ' + A + ' × 10 + ' + c + ' = ' + n, 'Old number: ' + A + ' × 10 + ' + c + ' = ' + n), n)],
        tip: LT('Số cũ gồm 10 phần A và chữ số bị xoá; hiệu là 9 phần A và chữ số đó.', 'The old number is 10 parts of A plus the crossed digit; the difference is 9 parts of A plus that digit.')
      });
    }
    if (k === 2) {
      let a, b;
      do { a = rd(r, 2, 9); b = rd(r, 1, 8); } while (a <= b);
      const S = a + b, D = 9 * (a - b), v = 10 * a + b;
      return QQ({
        q: LT('Số có hai chữ số có tổng hai chữ số là **' + S + '**. Đổi chỗ hai chữ số thì được số nhỏ hơn, kém số đầu **' + D + '** đơn vị. Tìm số đầu.', 'A two-digit number has digits adding up to **' + S + '**. Swapping the digits gives a smaller number, **' + D + '** less than the first. Find the first number.'),
        parts: [num(LT('Số đầu', 'First number'), v)],
        steps: [st(LT('ab − ba = 9 × (a − b) nên a − b = ' + D + ' : 9 = ' + (a - b), 'ab − ba = 9 × (a − b), so a − b = ' + D + ' ÷ 9 = ' + (a - b)), a - b),
          st(LT('Chữ số hàng chục: (' + S + ' + ' + (a - b) + ') : 2 = ' + a, 'Tens digit: (' + S + ' + ' + (a - b) + ') ÷ 2 = ' + a), a),
          st(LT('Chữ số hàng đơn vị: ' + S + ' − ' + a + ' = ' + b + '. Số đầu là ' + v, 'Ones digit: ' + S + ' − ' + a + ' = ' + b + '. The first number is ' + v), v)],
        tip: LT('Hiệu của hai số đổi chỗ bằng 9 lần hiệu hai chữ số.', 'The difference of the two swapped numbers is 9 times the difference of the digits.')
      });
    }
    if (k === 3) {
      const a = rd(r, 2, 9), three = r.pick([false, true]);
      if (!three) {
        const D = 9 * a;
        return QQ({
          q: LT('Số có hai chữ số **giống nhau** hơn tổng hai chữ số của nó **' + D + '** đơn vị. Tìm số đó.', 'A two-digit number with **two equal digits** is **' + D + '** more than the sum of its digits. Find the number.'),
          parts: [num(LT('Số đó', 'The number'), 11 * a)],
          steps: [st(LT('aa − (a + a) = a × 11 − a × 2 = a × 9', 'aa − (a + a) = a × 11 − a × 2 = a × 9'), 9),
            st(LT('a = ' + D + ' : 9 = ' + a, 'a = ' + D + ' ÷ 9 = ' + a), a), st(LT('Số đó là ' + 11 * a, 'The number is ' + 11 * a), 11 * a)],
          tip: LT('Viết aa = a × 11 rồi so với a + a.', 'Write aa = a × 11 and compare with a + a.')
        });
      }
      const D = 108 * a;
      return QQ({
        q: LT('Số có ba chữ số **giống nhau** hơn tổng ba chữ số của nó **' + D + '** đơn vị. Tìm số đó.', 'A three-digit number with **three equal digits** is **' + D + '** more than the sum of its digits. Find the number.'),
        parts: [num(LT('Số đó', 'The number'), 111 * a)],
        steps: [st(LT('aaa − 3 × a = a × 111 − a × 3 = a × 108', 'aaa − 3 × a = a × 111 − a × 3 = a × 108'), 108),
          st(LT('a = ' + D + ' : 108 = ' + a, 'a = ' + D + ' ÷ 108 = ' + a), a), st(LT('Số đó là ' + 111 * a, 'The number is ' + 111 * a), 111 * a)],
        tip: LT('aaa = a × 111, còn tổng ba chữ số là a × 3.', 'aaa = a × 111, and the sum of the digits is a × 3.')
      });
    }
    const S = rd(r, 10, 26), big = r.pick([true, false]);
    let best = -1;
    for (let n = 100; n < 1000; n++) {
      if (((n / 100) | 0) + (((n / 10) | 0) % 10) + (n % 10) !== S) continue;
      if (best < 0 || (big ? n > best : n < best)) best = n;
    }
    const h = (best / 100) | 0, te = ((best / 10) | 0) % 10, o = best % 10;
    return QQ({
      q: LT('Tìm số có ba chữ số **' + (big ? 'lớn' : 'bé') + ' nhất** mà tổng ba chữ số bằng **' + S + '**.', 'Find the **' + (big ? 'largest' : 'smallest') + '** three-digit number whose digits add up to **' + S + '**.'),
      parts: [num(LT('Số đó', 'The number'), best)],
      steps: big
        ? [st(LT('Chữ số hàng trăm lớn nhất có thể: ' + h, 'Biggest possible hundreds digit: ' + h), h), st(LT('Rồi chữ số hàng chục lớn nhất có thể: ' + te + '; hàng đơn vị: ' + o, 'Then the biggest possible tens digit: ' + te + '; ones digit: ' + o), te), st(LT('Số đó là ' + best, 'The number is ' + best), best)]
        : [st(LT('Chữ số hàng trăm bé nhất có thể: ' + h, 'Smallest possible hundreds digit: ' + h), h), st(LT('Rồi chữ số hàng chục bé nhất có thể: ' + te + '; hàng đơn vị: ' + o, 'Then the smallest possible tens digit: ' + te + '; ones digit: ' + o), te), st(LT('Số đó là ' + best, 'The number is ' + best), best)],
      tip: big ? LT('Đặt chữ số lớn nhất (9) vào hàng cao trước.', 'Put the biggest digit (9) in the highest place first.') : LT('Dồn phần lớn tổng vào hàng đơn vị và hàng chục.', 'Push most of the sum into the ones and tens places.')
    });
  }

  /* kho cặp (n, d, k): viết thêm d vào đầu n thì được k lần n */
  const LEFT = [];
  for (let n = 10; n <= 99; n++) for (let d = 1; d <= 9; d++) if ((100 * d + n) % n === 0) LEFT.push([n, d, (100 * d + n) / n]);

  function t3(r) {
    const k = rd(r, 0, 5), who = nm(r);
    if (k === 0) {
      const c = r.pick(LEFT), n = c[0], d = c[1], m = c[2];
      return QQ({
        q: LT(who + ' viết thêm chữ số **' + d + '** vào bên trái một số có hai chữ số thì được số mới **gấp ' + m + ' lần** số cũ. Tìm số cũ.', who + ' writes the digit **' + d + '** in front of a two-digit number and gets a new number **' + m + ' times** the old one. Find the old number.'),
        parts: [num(LT('Số cũ', 'Old number'), n)],
        steps: [st(LT('Số mới = ' + d * 100 + ' + số cũ = ' + m + ' lần số cũ', 'New number = ' + d * 100 + ' + old number = ' + m + ' times the old number'), d * 100),
          st(LT(d * 100 + ' bằng ' + m + ' − 1 = ' + (m - 1) + ' lần số cũ', d * 100 + ' equals ' + m + ' − 1 = ' + (m - 1) + ' times the old number'), m - 1),
          st(LT('Số cũ: ' + d * 100 + ' : ' + (m - 1) + ' = ' + n, 'Old number: ' + d * 100 + ' ÷ ' + (m - 1) + ' = ' + n), n)],
        tip: LT('Vẽ sơ đồ: số mới hơn số cũ đúng ' + d * 100 + ' đơn vị.', 'Draw a diagram: the new number is exactly ' + d * 100 + ' more than the old one.')
      });
    }
    if (k === 1) {
      const n = rd(r, 12, 350), d = rd(r, 1, 9), more = r.pick([true, false]), nv = 10 * n + d;
      const D = more ? 9 * n + d : 11 * n + d;
      return QQ({
        q: more
          ? LT(who + ' viết thêm chữ số **' + d + '** vào bên phải một số, số mới hơn số cũ **' + F(D) + '** đơn vị. Tìm số cũ và số mới.', who + ' writes the digit **' + d + '** after a number; the new number is **' + F(D) + '** more than the old one. Find the old and the new numbers.')
          : LT(who + ' viết thêm chữ số **' + d + '** vào bên phải một số. Tổng của số mới và số cũ là **' + F(D) + '**. Tìm số cũ và số mới.', who + ' writes the digit **' + d + '** after a number. The sum of the new number and the old one is **' + F(D) + '**. Find the old and the new numbers.'),
        parts: [num(LT('Số cũ', 'Old number'), n), num(LT('Số mới', 'New number'), nv)],
        steps: more
          ? [st(LT('Số mới = 10 × số cũ + ' + d + ', nên chênh lệch = 9 × số cũ + ' + d, 'New = 10 × old + ' + d + ', so the difference = 9 × old + ' + d), D),
            st(LT('Số cũ: (' + F(D) + ' − ' + d + ') : 9 = ' + n, 'Old number: (' + F(D) + ' − ' + d + ') ÷ 9 = ' + n), n), st(LT('Số mới: ' + n + ' × 10 + ' + d + ' = ' + F(nv), 'New number: ' + n + ' × 10 + ' + d + ' = ' + F(nv)), nv)]
          : [st(LT('Số mới = 10 × số cũ + ' + d + ', nên tổng = 11 × số cũ + ' + d, 'New = 10 × old + ' + d + ', so the sum = 11 × old + ' + d), D),
            st(LT('Số cũ: (' + F(D) + ' − ' + d + ') : 11 = ' + n, 'Old number: (' + F(D) + ' − ' + d + ') ÷ 11 = ' + n), n), st(LT('Số mới: ' + n + ' × 10 + ' + d + ' = ' + F(nv), 'New number: ' + n + ' × 10 + ' + d + ' = ' + F(nv)), nv)],
        tip: LT('Gọi số cũ là một phần; số mới gồm 10 phần và chữ số thêm vào.', 'Call the old number one part; the new number is 10 parts plus the added digit.')
      });
    }
    if (k === 2) {
      let a, b;
      do { a = rd(r, 2, 9); b = rd(r, 1, 8); } while (a <= b);
      const s = a + b, df = a - b, v = 10 * a + b, w = 10 * b + a;
      return QQ({
        q: LT('Hai số có hai chữ số được viết bằng cùng hai chữ số nhưng **đổi chỗ**. Tổng hai số là **' + 11 * s + '**, hiệu hai số là **' + 9 * df + '**. Tìm hai số.', 'Two two-digit numbers use the same two digits, **swapped**. Their sum is **' + 11 * s + '** and their difference is **' + 9 * df + '**. Find the two numbers.'),
        parts: [num(LT('Số lớn', 'Larger number'), v), num(LT('Số bé', 'Smaller number'), w)],
        steps: [st(LT('ab + ba = 11 × (a + b) nên a + b = ' + 11 * s + ' : 11 = ' + s, 'ab + ba = 11 × (a + b), so a + b = ' + 11 * s + ' ÷ 11 = ' + s), s),
          st(LT('ab − ba = 9 × (a − b) nên a − b = ' + 9 * df + ' : 9 = ' + df, 'ab − ba = 9 × (a − b), so a − b = ' + 9 * df + ' ÷ 9 = ' + df), df),
          st(LT('Chữ số hàng chục của số lớn: (' + s + ' + ' + df + ') : 2 = ' + a + '; chữ số kia: ' + b, 'Tens digit of the larger number: (' + s + ' + ' + df + ') ÷ 2 = ' + a + '; the other digit: ' + b), a),
          st(LT('Hai số là ' + v + ' và ' + w, 'The two numbers are ' + v + ' and ' + w), v)],
        tip: LT('Tổng hai số đổi chỗ chia hết cho 11, hiệu chia hết cho 9.', 'The sum of two swapped numbers is a multiple of 11; the difference is a multiple of 9.')
      });
    }
    if (k === 3) {
      const a = rd(r, 1, 9), b = rd(r, 1, 9), m = 9 * a + b, D = 10 * m;
      return QQ({
        q: LT('Xoá chữ số hàng chục (là chữ số **' + b + '**) của một số có ba chữ số thì số đó giảm đi **' + D + '** đơn vị. Tìm chữ số hàng trăm của số đó.', 'Cross out the tens digit (it is **' + b + '**) of a three-digit number and the number drops by **' + D + '**. Find the hundreds digit of the number.'),
        parts: [num(LT('Chữ số hàng trăm', 'Hundreds digit'), a)],
        steps: [st(LT('abc − ac = (a × 100 + b × 10 + c) − (a × 10 + c) = a × 90 + b × 10', 'abc − ac = (a × 100 + b × 10 + c) − (a × 10 + c) = a × 90 + b × 10'), D),
          st(LT('Chia cho 10: a × 9 + b = ' + D + ' : 10 = ' + m, 'Divide by 10: a × 9 + b = ' + D + ' ÷ 10 = ' + m), m),
          st(LT('a × 9 = ' + m + ' − ' + b + ' = ' + (m - b) + '; a = ' + a, 'a × 9 = ' + m + ' − ' + b + ' = ' + (m - b) + '; a = ' + a), a)],
        tip: LT('Chữ số c bị trừ đi chính nó, chỉ còn a và b.', 'The digit c cancels itself out, leaving only a and b.')
      });
    }
    if (k === 4) {
      const ds = r.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3), s = ds[0] + ds[1] + ds[2];
      return QQ({
        q: LT(who + ' dùng ba chữ số **' + ds.join('; ') + '** lập tất cả các số có ba chữ số, mỗi số dùng đủ cả ba chữ số. Hỏi lập được bao nhiêu số và tổng các số đó là bao nhiêu?', who + ' uses the three digits **' + ds.join('; ') + '** to make every three-digit number that uses all three digits. How many numbers are there, and what is their sum?'),
        parts: [num(LT('Số các số', 'How many'), 6, LT('số', 'numbers')), num(LT('Tổng', 'Sum'), 222 * s)],
        steps: [st(LT('Hàng trăm có 3 cách chọn, hàng chục 2 cách, hàng đơn vị 1 cách: 3 × 2 × 1 = 6 (số)', 'Hundreds: 3 choices, tens: 2 choices, ones: 1 choice: 3 × 2 × 1 = 6 (numbers)'), 6),
          st(LT('Mỗi chữ số xuất hiện 2 lần ở mỗi hàng, nên tổng = 2 × (' + ds.join(' + ') + ') × 111', 'Each digit appears 2 times in each place, so the sum = 2 × (' + ds.join(' + ') + ') × 111'), 2 * s),
          st(LT('Tổng: ' + 2 * s + ' × 111 = ' + F(222 * s), 'Sum: ' + 2 * s + ' × 111 = ' + F(222 * s)), 222 * s)],
        tip: LT('Xem mỗi chữ số xuất hiện mấy lần ở hàng trăm, hàng chục, hàng đơn vị.', 'See how many times each digit shows up in the hundreds, tens and ones places.')
      });
    }
    const a = rd(r, 2, 9), plus = r.pick([true, false]), D = plus ? 122 * a : 100 * a;
    return QQ({
      q: plus
        ? LT('Tổng của một số có ba chữ số **giống nhau** và một số có hai chữ số **giống nhau** (cùng chữ số đó) là **' + F(D) + '**. Tìm số có ba chữ số.', 'The sum of a three-digit number with **three equal digits** and a two-digit number with **two equal digits** (the same digit) is **' + F(D) + '**. Find the three-digit number.')
        : LT('Hiệu của một số có ba chữ số **giống nhau** và một số có hai chữ số **giống nhau** (cùng chữ số đó) là **' + D + '**. Tìm số có ba chữ số.', 'The difference of a three-digit number with **three equal digits** and a two-digit number with **two equal digits** (the same digit) is **' + D + '**. Find the three-digit number.'),
      parts: [num(LT('Số có ba chữ số', 'Three-digit number'), 111 * a)],
      steps: plus
        ? [st(LT('aaa + aa = a × 111 + a × 11 = a × 122', 'aaa + aa = a × 111 + a × 11 = a × 122'), 122), st(LT('a = ' + F(D) + ' : 122 = ' + a, 'a = ' + F(D) + ' ÷ 122 = ' + a), a), st(LT('Số đó là ' + 111 * a, 'The number is ' + 111 * a), 111 * a)]
        : [st(LT('aaa − aa = a × 111 − a × 11 = a × 100', 'aaa − aa = a × 111 − a × 11 = a × 100'), 100), st(LT('a = ' + D + ' : 100 = ' + a, 'a = ' + D + ' ÷ 100 = ' + a), a), st(LT('Số đó là ' + 111 * a, 'The number is ' + 111 * a), 111 * a)],
      tip: LT('aa = a × 11 và aaa = a × 111.', 'aa = a × 11 and aaa = a × 111.')
    });
  }

  LESSON({
    id: 'struct', reg: 'so', emoji: '🔢', optional: true, adv: true,
    title: LT('Cấu tạo số', 'Structure of numbers'),
    blurb: LT('Chữ số ở hàng nào mang giá trị hàng đó: abc = a × 100 + b × 10 + c', 'A digit is worth its place: abc = a × 100 + b × 10 + c'),
    links: ['place'],
    rule: {
      h: LT('Ghi nhớ', 'Remember'),
      items: [
        LT('Số **abc** = a × 100 + b × 10 + c; số **ab** = a × 10 + b. Chữ cái là một chữ số.', 'The number **abc** = a × 100 + b × 10 + c; **ab** = a × 10 + b. Each letter is one digit.'),
        LT('Viết thêm chữ số vào **bên phải**: số cũ gấp 10 lần rồi cộng chữ số đó. Vào **bên trái**: cộng thêm chữ số × 10, 100…', 'Write a digit on the **right**: the old number becomes 10 times bigger, plus the digit. On the **left**: add digit × 10, 100…'),
        LT('aa = a × 11; aaa = a × 111; ab − ba = 9 × (a − b); ab + ba = 11 × (a + b).', 'aa = a × 11; aaa = a × 111; ab − ba = 9 × (a − b); ab + ba = 11 × (a + b).')
      ]
    },
    figs: {
      a: () => RAWFIG([() => tapeFig(0), () => tapeFig(1), () => tapeFig(2), () => tapeFig(3), () => checkFig()]),
      b: () => RAWFIG([() => swapFig()])
    },
    teach: [
      { key: 'a', f: 0, say: LT('Cùng làm: viết thêm chữ số 4 vào **bên phải** một số n, số mới hơn số cũ **355**. Tìm n.', 'Let us solve one: write the digit 4 on the **right** of a number n, and the new number is **355** more than the old one. Find n.') },
      { key: 'a', f: 1, say: LT('Số n bị đẩy sang trái một hàng nên gấp 10 lần. Số mới = **n × 10 + 4**: gồm 10 phần n và thêm 4.', 'The number n moves one place left, so it becomes 10 times bigger. New number = **n × 10 + 4**: 10 parts of n, plus 4.') },
      { key: 'a', f: 2, say: LT('Bớt đi số cũ (1 phần n), số mới còn hơn số cũ: **9 phần n và 4**. Vậy 9 × n + 4 = 355. Hỏi: 9 × n = 355 − 4 = ?', 'Take away the old number (1 part n). The difference is **9 parts of n and 4**. So 9 × n + 4 = 355. Your turn: 9 × n = 355 − 4 = ?'),
        ask: { opts: ['351', '359', '355'], ans: '351', good: LT('Đúng! 9 × n = 351.', 'Right! 9 × n = 351.') } },
      { key: 'a', f: 3, say: LT('Giờ 9 phần n bằng 351. Hỏi: n = 351 : 9 = ?', 'Now 9 parts of n equal 351. Your turn: n = 351 ÷ 9 = ?'),
        ask: { opts: ['37', '39', '41'], ans: '39', good: LT('Đúng! n = 39: số cũ là 39, số mới là 394.', 'Right! n = 39: the old number is 39 and the new one is 394.') } },
      { key: 'a', f: 4, say: LT('Luôn **thử lại**: 394 − 39 = 355. Đúng như đề bài!', 'Always **check**: 394 − 39 = 355. Just as the problem says!') },
      { key: 'b', f: 0, say: LT('Mẹo khác: **đổi chỗ** hai chữ số thì hiệu hai số luôn bằng 9 × (hiệu hai chữ số). Ví dụ 93 − 39 = 54 = 9 × 6, mà 9 − 3 = 6.', 'Another trick: when you **swap** two digits, the difference of the numbers is always 9 × (the difference of the digits). For example 93 − 39 = 54 = 9 × 6, and 9 − 3 = 6.') }
    ],
    gen(tier, r) {
      return tier === 1 ? t1(r) : tier === 2 ? t2(r) : t3(r);
    }
  });
})();

})();

  var Store = (function() {
   let PK = "toan4pl_prof",
    K0 = "toan4pl_v1",
    keyOf = id => id === "p0" ? K0 : K0 + "_" + id,
    base = () => ({
     v: CONFIG.schema,
     name: "",
     stars: 0,
     streak: {
      last: "",
      n: 0
     },
     L: {},
     set: {
      sound: !0,
      voice: !1,
      penOnly: !0,
      mode: "tap",
      reduceMotion: !1,
      unlockAll: !1,
      theme: "boy"
     },
     stat: {
      q: 0,
      ok: 0
     },
     mist: {},
     err: {},
     twin: {
      n: 0,
      ok: 0
     },
     daily: {
      date: "",
      rev: 0,
      nw: 0,
      ch: 0,
      got: 0
     },
     boss: {},
     bonus: 0
    }),
    MIGRATIONS = {
     1: x => (x.set = x.set || {}, x.set.reduceMotion == null && (x.set.reduceMotion = !1), x.set.unlockAll == null && (x.set.unlockAll = !1), x),
     2: x => (x.set = x.set || {}, x.set.theme !== "boy" && x.set.theme !== "girl" && (x.set.theme = "boy"), x),
     /* 3 → 4: gỡ chức năng AI; xoá khoá API còn sót trong dữ liệu cũ */
     3: x => (x.set && delete x.set.aiKey, x)
    };

   /* ghi lỗi lưu trữ vào nhật ký của khu phụ huynh (T4.logErr); mỗi loại chỉ ghi 1 lần/phiên để không làm đầy 50 dòng.
      Nếu tính năng phụ huynh chưa nạp (lỗi xảy ra lúc khởi động) thì để vào hàng chờ window.__logQ, nó sẽ lấy ra sau. */
   var _slogSeen = {};
   function slog(m) {
    try {
     if (_slogSeen[m.split(":")[0]]) return;
     _slogSeen[m.split(":")[0]] = 1;
     if (window.T4 && window.T4.logErr) window.T4.logErr(m); else (window.__logQ = window.__logQ || []).push(m)
    } catch {}
   }

   function migrate(x) {
    let v = +x.v || 1;
    for (; v < CONFIG.schema;) {
     let f = MIGRATIONS[v];
     if (f) try {
      x = f(x) || x
     } catch (e) { slog("nâng cấp dữ liệu lỗi: từ v" + v + " " + (e && e.name)) }
     v++, x.v = v
    }
    return x
   }

   function load(id) {
    let x = null, raw = null;
    try {
     raw = localStorage.getItem(keyOf(id));
     raw && (x = JSON.parse(raw))
    } catch (e) {
     slog("bản lưu hỏng, đã giữ lại bản gốc: " + (e && e.name));
     /* bản lưu hỏng: GIỮ NGUYÊN để cứu (không ghi đè) */
     try { localStorage.setItem("toan4pl_hong_" + keyOf(id), raw) } catch {}
    }
    (typeof x != "object" || Array.isArray(x)) && (x = null);
    if (x && x.set && "aiKey" in x.set) { delete x.set.aiKey; try { localStorage.setItem(keyOf(id), JSON.stringify(x)) } catch {} }
    return x = Object.assign(base(), x || {}), x.set = Object.assign(base().set, x.set || {}), (!x.L || typeof x.L != "object") && (x.L = {}), migrate(x)
   }
   let meta = null;
   try {
    meta = JSON.parse(localStorage.getItem(PK) || "null")
   } catch {}(!meta || !Array.isArray(meta.list) || !meta.list.length) && (meta = {
    cur: "p0",
    list: [{
     id: "p0"
    }]
   }), meta.list.some(p => p.id === meta.cur) || (meta.cur = meta.list[0].id);
   let d = load(meta.cur);

   function saveMeta() {
    try {
     localStorage.setItem(PK, JSON.stringify(meta))
    } catch (e) { slog("không lưu được danh sách hồ sơ: " + (e && e.name)) }
   }

   function save() {
    try {
     localStorage.setItem(keyOf(meta.cur), JSON.stringify(d))
    } catch (e) { slog("không lưu được tiến độ (bộ nhớ đầy hoặc bị chặn): " + (e && e.name)) }
    autoBackup()
   }

   /* Tự sao lưu mỗi ngày, giữ 3 bản gần nhất (toan4pl_bak0..2). Xem/khôi phục trong Khu vực phụ huynh. */
   function clean(x) { x = JSON.parse(JSON.stringify(x)); x.set && delete x.set.aiKey; return x }   /* không bao giờ để khoá lọt vào bản sao lưu */
   function dump() {
    return {
     app: "toan4pl", v: 3, at: new Date().toISOString(), cur: meta.cur,
     profiles: meta.list.map(p => ({ id: p.id, data: clean(p.id === meta.cur ? d : load(p.id)) }))
    }
   }
   function autoBackup() {
    try {
     let t = todayStr(), m = JSON.parse(localStorage.getItem("toan4pl_bakm") || "{}");
     if (m.last === t) return;
     let n = ((+m.n || 0) + 1) % 3;
     localStorage.setItem("toan4pl_bak" + n, JSON.stringify(dump()));
     localStorage.setItem("toan4pl_bakm", JSON.stringify({ last: t, n: n }))
    } catch (e) { slog("sao lưu tự động thất bại: " + (e && e.name)) }
   }
   function backups() {
    let out = [];
    for (let i = 0; i < 3; i++) try {
     let o = JSON.parse(localStorage.getItem("toan4pl_bak" + i) || "null");
     o && o.at && out.push({ slot: i, at: o.at, names: o.profiles.map(p => p.data && p.data.name || "").filter(Boolean), stars: o.profiles.reduce((a, p) => a + (+(p.data && p.data.stars) || 0), 0) })
    } catch {}
    return out.sort((a, b) => b.at < a.at ? -1 : 1)
   }
   function restoreBackup(slot) {
    let o = JSON.parse(localStorage.getItem("toan4pl_bak" + slot) || "null");
    if (!o) throw new Error(LT("Không có bản sao lưu này", "No such backup"));
    importAll(o)
   }

   function lesson(id) {
    d.L[id] || (d.L[id] = {
     taught: 0,
     coach: 0,
     best: [0, 0, 0, 0],
     pass: [0, 0, 0, 0],
     quick: 0,
     last: 0,
     theory: 0
    });
    let o = d.L[id];
    for (; o.best.length < 4;) o.best.push(0);
    for (; o.pass.length < 4;) o.pass.push(0);
    o.theory == null && (o.theory = 0);
    return o.quick == null && (o.quick = 0), o.last == null && (o.last = 0), o
   }

   function touchStreak() {
    let t = todayStr();
    if (d.streak.last === t) return;
    let dn = s => { let a = String(s).split("-").map(Number); return Math.round(Date.UTC(a[0], a[1] - 1, a[2]) / 864e5) },
     gap = d.streak.last ? dn(t) - dn(d.streak.last) : 99,
     wk = Math.floor((dn(t) + 3) / 7);
    if (gap === 1) d.streak.n += 1;
    else if (gap === 2 && d.streak.n > 0 && d.streak.freeze !== wk) d.streak.n += 1, d.streak.freeze = wk;   /* "đóng băng": nghỉ 1 ngày/tuần không mất chuỗi */
    else d.streak.n = 1;
    d.streak.last = t, save()
   }

   function reset() {
    let keep = d.set;
    d = Object.assign(base(), {
     name: d.name
    }), d.set = keep, save()
   }

   function profiles() {
    return meta.list.map(p => ({
     id: p.id,
     name: (p.id === meta.cur ? d : load(p.id)).name || LT("(chưa đặt tên)", "(no name yet)"),
     cur: p.id === meta.cur
    }))
   }

   function switchTo(id) {
    meta.list.some(p => p.id === id) && (save(), meta.cur = id, saveMeta(), d = load(id))
   }

   function addProfile() {
    let set = Object.assign({}, d.set),
     id = "p" + Date.now().toString(36);
    return save(), meta.list.push({
     id
    }), meta.cur = id, saveMeta(), d = base(), d.set = set, save(), id
   }

   function removeProfile(id) {
    if (meta.list.length < 2) return !1;
    meta.list = meta.list.filter(p => p.id !== id);
    try {
     localStorage.removeItem(keyOf(id))
    } catch {}
    return meta.cur === id && (meta.cur = meta.list[0].id, d = load(meta.cur)), saveMeta(), !0
   }

   function exportAll() {
    return save(), dump()
   }

   function importAll(o) {
    o && Array.isArray(o.profiles) && o.profiles.forEach(p => { p && p.data && p.data.set && delete p.data.set.aiKey });
    if (!o || o.app !== "toan4pl" || !Array.isArray(o.profiles) || !o.profiles.length || o.profiles.some(p => !p || typeof p.data != "object")) throw new Error(LT("Mã sao lưu không hợp lệ", "Invalid backup code"));
    let list = o.profiles.map((p, i) => ({
     id: /^p[0-9a-z]{0,12}$/.test(String(p.id)) ? String(p.id) : "p" + i
    }));
    meta.list.forEach(p => {
     try {
      localStorage.removeItem(keyOf(p.id))
     } catch {}
    }), o.profiles.forEach((p, i) => {
     try {
      localStorage.setItem(keyOf(list[i].id), JSON.stringify(p.data))
     } catch {}
    }), meta = {
     cur: list.some(p => p.id === o.cur) ? o.cur : list[0].id,
     list
    }, saveMeta(), d = load(meta.cur)
   }
   let PFX = "T4PL1:";

   function code() {
    return PFX + btoa(unescape(encodeURIComponent(JSON.stringify(exportAll()))))
   }

   function fromCode(c) {
    if (c = String(c || "").replace(/\s+/g, ""), c.indexOf(PFX) !== 0) throw new Error(LT("Mã sao lưu không đúng định dạng", "Backup code has the wrong format"));
    importAll(JSON.parse(decodeURIComponent(escape(atob(c.slice(PFX.length))))))
   }
   return {
    migrate,
    get d() {
     return d
    },
    set d(v) {
     d = v
    },
    save,
    lesson,
    touchStreak,
    reset,
    profiles,
    switchTo,
    addProfile,
    removeProfile,
    exportAll,
    importAll,
    backups,
    restoreBackup,
    code,
    fromCode
   }
  })();
  var Sfx = (function() {
   let ctx = null,
    master = null,
    noise = null,
    pen = null;

   function init() {
    if (ctx) {
     ctx.state === "suspended" && ctx.resume();
     return
    }
    try {
     let AC = window.AudioContext || window.webkitAudioContext;
     if (!AC) return;
     ctx = new AC, master = ctx.createGain(), master.gain.value = .55, master.connect(ctx.destination);
     let len = ctx.sampleRate,
      buf = ctx.createBuffer(1, len, ctx.sampleRate),
      ch = buf.getChannelData(0);
     for (let i = 0; i < len; i++) ch[i] = Math.random() * 2 - 1;
     noise = buf
    } catch {
     ctx = null
    }
   }
   let on = () => ctx && Store.d.set.sound;

   function tone(f, t0, dur, type, vol, f2) {
    if (!on()) return;
    let t = ctx.currentTime + t0,
     o = ctx.createOscillator(),
     g = ctx.createGain();
    o.type = type || "sine", o.frequency.setValueAtTime(f, t), f2 && o.frequency.exponentialRampToValueAtTime(f2, t + dur), g.gain.setValueAtTime(0, t), g.gain.linearRampToValueAtTime(vol || .25, t + .012), g.gain.exponentialRampToValueAtTime(8e-4, t + dur), o.connect(g), g.connect(master), o.start(t), o.stop(t + dur + .05)
   }

   function burst(t0, dur, freq, vol, q) {
    if (!on() || !noise) return;
    let t = ctx.currentTime + t0,
     s = ctx.createBufferSource(),
     f = ctx.createBiquadFilter(),
     g = ctx.createGain();
    s.buffer = noise, f.type = "bandpass", f.frequency.value = freq, f.Q.value = q || 1, g.gain.setValueAtTime(vol, t), g.gain.exponentialRampToValueAtTime(8e-4, t + dur), s.connect(f), f.connect(g), g.connect(master), s.start(t), s.stop(t + dur + .02)
   }
   return {
    init,
    tap() {
     tone(760, 0, .06, "triangle", .18)
    },
    pop() {
     tone(420, 0, .09, "sine", .22, 820)
    },
    next() {
     burst(0, .14, 1800, .12, .8)
    },
    ok() {
     [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * .085, .22, "sine", .26))
    },
    bad() {
     tone(300, 0, .22, "triangle", .22, 230), tone(240, .18, .3, "triangle", .2, 170)
    },
    star(i) {
     tone(880 + i * 220, 0, .35, "sine", .22), tone(1320 + i * 330, .06, .3, "triangle", .12)
    },
    win() {
     [523.25, 523.25, 659.25, 783.99, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * .11, .28, "square", .12)), tone(1046.5, .8, .7, "sine", .22)
    },
    lock() {
     tone(180, 0, .12, "square", .12)
    },
    penStart() {
     if (!on() || !noise || pen) return;
     let s = ctx.createBufferSource(),
      f = ctx.createBiquadFilter(),
      g = ctx.createGain();
     s.buffer = noise, s.loop = !0, f.type = "bandpass", f.frequency.value = 2600, f.Q.value = .7, g.gain.value = 0, s.connect(f), f.connect(g), g.connect(master), s.start(), pen = {
      s,
      g,
      f
     }
    },
    penMove(speed, erase) {
     if (!pen) return;
     let v = Math.min(.09, .01 + speed * .012);
     pen.g.gain.setTargetAtTime(v, ctx.currentTime, .02), pen.f.frequency.setTargetAtTime(erase ? 1100 : 2200 + Math.min(1800, speed * 160), ctx.currentTime, .03)
    },
    penStop() {
     if (!pen) return;
     let p = pen;
     pen = null;
     try {
      p.g.gain.setTargetAtTime(0, ctx.currentTime, .03), setTimeout(() => {
       try {
        p.s.stop()
       } catch {}
      }, 120)
     } catch {}
    },
    get ready() {
     return !!ctx
    }
   }
  })();

  function viVoice() {
   try {
    let v = speechSynthesis.getVoices();
    return {
     n: v.length,
     vi: window.LANG === "en" ? (v.find(x => /^en[-_]US/i.test(x.lang) && /(samantha|aria|jenny|zira|female|google us english|allison|ava|joanna|kendra|salli)/i.test(x.name)) || v.find(x => /^en[-_]US/i.test(x.lang)) || v.find(x => /^en/i.test(x.lang)) || null) : (v.find(x => /^vi/i.test(x.lang)) || null)
    }
   } catch {
    return {
     n: 0,
     vi: null
    }
   }
  }
  var voiceWarned = !1,
   notify = () => {};

  function setNotifier(fn) {
   notify = fn
  }

  function say_(t, manual) {
   if (!window.speechSynthesis) return manual && notify(LT("Máy này không hỗ trợ đọc to", "This device can't read aloud")), !1;
   try {
    speechSynthesis.cancel();
    let u = new SpeechSynthesisUtterance(plain(t)),
     vv = viVoice();
    return u.lang = window.LANG === "en" ? "en-US" : "vi-VN", u.rate = window.LANG === "en" ? .92 : .9, vv.vi && (u.voice = vv.vi), manual && vv.n > 0 && !vv.vi && !voiceWarned && (voiceWarned = !0, notify(LT("Máy chưa có giọng đọc tiếng Việt. Phụ huynh vào Cài đặt điện thoại › Chuyển văn bản thành giọng nói để tải giọng Việt.", "This device doesn't have a voice for reading aloud yet. A parent can open the phone's Settings › Text-to-speech to download one."))), speechSynthesis.speak(u), !0
   } catch {
    return !1
   }
  }

  function speak(t) {
   if (window.VO && window.VO.say(t)) return;
   Store.d.set.voice && say_(t, !1)
  }

  function speakNow(t) {
   if (window.VO && window.VO.say(t)) return !0;
   return say_(t, !0)
  }
  var MODES = [{
    id: "boy",
    label: LT("Bé Nam", "Boy"),
    icon: "🧭",
    desc: LT("Khám phá · thám hiểm", "Discover · Explore"),
    owl: LT("Cú Tí xanh", "Blue Tee the Owl")
   }, {
    id: "girl",
    label: LT("Bé Nữ", "Girl"),
    icon: "🌷",
    desc: LT("Kỳ diệu · tỏa sáng", "Magical · Shine bright"),
    owl: LT("Cú Tí hồng", "Pink Tee the Owl")
   }],
   MOOD_FILE = {
    happy: "happy",
    cheer: "cheer",
    think: "think",
    sad: "think",
    wink: "good",
    good: "good",
    read: "read",
    wow: "wow",
    sleep: "sleep",
    teach: "teach"
   };

  function assetUrl(path) {
   let m = typeof window < "u" && window.__ASSETS;
   return m && m[path] || path
  }
  var mascotPath = (mode, mood) => "assets/" + mode + "/mascots/" + (MOOD_FILE[mood] || "happy") + ".webp",
   worldPath = (mode, id) => "assets/" + mode + "/worlds/" + id + ".webp",
   lessonPath = id => "assets/lessons/" + id + ".webp",
   rewardPath = name => "assets/rewards/" + name + ".webp";
  var THEME_COLOR = {
    boy: "#CFE9FF",
    girl: "#FFE1F1"
   },
   themeMode = () => Store.d && Store.d.set && Store.d.set.theme === "girl" ? "girl" : "boy";

  function applyTheme() {
   let m = themeMode();
   document.documentElement.dataset.theme = m;
   let meta = document.querySelector("meta[name=theme-color]");
   meta && meta.setAttribute("content", THEME_COLOR[m])
  }

  function setTheme(mode) {
   MODES.some(m => m.id === mode) && (Store.d.set.theme = mode, Store.save(), applyTheme())
  }
  window.iconFb = function(el) {
   el.onerror = null;
   var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="4" y="4" width="92" height="92" rx="24" fill="#FFF4D6"/><text x="50" y="68" font-size="54" text-anchor="middle">' + (el.getAttribute("data-emo") || "") + '</text></svg>';
   el.src = "data:image/svg+xml," + encodeURIComponent(svg);
  };
  var img = (cls, src, alt) => '<img class="' + cls + '" src="' + assetUrl(src) + '" alt="' + alt + '" decoding="async">',
   worldArt = id => img("scene scene-art", worldPath(themeMode(), id), ""),
   pathScenery = id => img("path-scenery", worldPath(themeMode(), id), ""),
   worldBanner = (name, cls) => img("banner-img" + (cls ? " " + cls : ""), worldPath(themeMode(), name), ""),
   lessonIcon = (l, size) => img("lesson-art" + (size ? " " + size : ""), lessonPath(l.id), "").replace("<img ", '<img data-emo="' + esc(l.emoji || "📘") + '" onerror="iconFb(this)" '),
   rewardIcon = (it, cls) => img("reward-art" + (cls ? " " + cls : ""), rewardPath(it.img), ""),
   regionColor = rg => themeMode() === "girl" && rg.hdG || rg.hd;

  function modeSwitch(kind) {
   let cur = themeMode(),
    btn = m => '<button type="button" class="mode-choice' + (cur === m.id ? " selected" : "") + '" data-act="modePick" data-mode="' + m.id + '" aria-pressed="' + (cur === m.id) + '">' + img("mode-owl", mascotPath(m.id, "happy"), "") + '<span class="mode-txt"><b>' + m.icon + " " + esc(m.label) + "</b>" + (kind === "full" ? "<small>" + esc(m.desc) + "</small>" : "") + '</span><span class="choice-ind">' + (cur === m.id ? "✓" : "") + "</span></button>";
   return '<section class="mode-panel ' + kind + '">' + (kind === "full" ? worldBanner("overview", "mode-banner") : "") + LT('<div class="mode-title"><strong>🎨 Thế giới phiêu lưu của bé</strong><span>Đổi bất cứ lúc nào</span></div><div class="mode-options">', '<div class="mode-title"><strong>🎨 Your Adventure World</strong><span>Change anytime</span></div><div class="mode-options">') + MODES.map(btn).join("") + "</div>" + (kind === "full" ? LT("<p>Hai chế độ học cùng 31 bài Toán lớp 4. Sao, tiến độ và các phần thưởng không mất khi đổi giao diện.</p>", "<p>Both modes cover the same 31 Grade 4 math lessons. Your stars, progress, and rewards are kept when you switch looks.</p>") : "") + "</section>"
  }

  function syncModeSwitch(root) {
   let cur = themeMode();
   root.querySelectorAll(".mode-choice").forEach(x => {
    let sel = x.dataset.mode === cur;
    x.classList.toggle("selected", sel), x.setAttribute("aria-pressed", String(sel)), x.querySelector(".choice-ind").textContent = sel ? "✓" : ""
   })
  }
  var app = $("#app"),
   UI = {
    stack: [{
     n: "home"
    }],
    prac: null,
    teach: null,
    reg: null
   },
   SC = {},
   starSvg = (on, cls) => '<svg viewBox="0 0 24 24" class="' + (cls || "") + '"><path d="M12 2.6l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.6l1.2-6.5L2.5 9.5l6.6-.9z" fill="' + (on ? "url(#gStar)" : "#EDE7D8") + '" stroke="#1F2A44" stroke-width="1.8" stroke-linejoin="round"/>' + (on ? '<path d="M9 6.2l1.6-2.3" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".85"/>' : "") + "</svg>",
   PRAISE = [LT("Giỏi quá!", "Great job!"), LT("Chính xác!", "Exactly right!"), LT("Tuyệt vời!", "Awesome!"), LT("Con làm rất tốt!", "You did really well!"), LT("Đúng rồi, siêu quá!", "That's right, super!")],
   TRYAGAIN = [LT("Gần đúng rồi, thử lại nhé!", "Close! Try again!"), LT("Chưa đúng, con kiểm tra lại từng bước nhé.", "Not quite. Check each step again."), LT("Đừng lo, thử lại một lần nữa nào!", "Don't worry, try one more time!")],
   pickR = a => a[Math.floor(Math.random() * a.length)];

  function go(n, p) {
   UI.stack.push({
    n,
    p
   }), render()
  }

  function replace(n, p) {
   UI.stack[UI.stack.length - 1] = {
    n,
    p
   }, render()
  }

  function back() {
   UI.stack.length > 1 && (UI.stack.pop(), render())
  }

  function render() {
   window.VO && window.VO.stop();
   window.ONRENDER && window.ONRENDER();
   applyTheme();
   let s = UI.stack[UI.stack.length - 1];
   UI.teach && s.n !== "teach" && (UI.teach = null), SC[s.n](s.p || {}), window.scrollTo(0, 0)
  }

  function toast(m) {
   let t = document.createElement("div");
   t.className = "toast", t.textContent = m, document.body.appendChild(t), setTimeout(() => t.remove(), 2300), window.VO && window.VO.say(m)
  }

  function sheet(html, bind) {
   let bg = document.createElement("div");
   bg.className = "sheet-bg", bg.innerHTML = '<div class="sheet">' + html + "</div>", document.body.appendChild(bg);
   let close = () => bg.remove();
   return bg.addEventListener("click", e => {
    e.target === bg && close()
   }), bind && bind(bg, close), close
  }

  function ask(msg, yes, label, no) {
   sheet('<h2 class="disp" style="font-size:1.4rem">' + rich(msg) + '</h2><div class="row"><button class="btn grow" data-k="n">' + (no || LT("Thôi", "Cancel")) + '</button><button class="btn pri grow" data-k="y">' + (label || LT("Đồng ý", "OK")) + "</button></div>", (bg, close) => {
    $("[data-k=n]", bg).onclick = close, $("[data-k=y]", bg).onclick = () => {
     close(), yes()
    }
   })
  }
  var ICON = {
    pen: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20l1-4L17 4l3 3L8 19z"/><path d="M14 7l3 3"/></svg>',
    eraser: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 20h12M5 13l8-8a2 2 0 013 0l3 3a2 2 0 010 3l-8 8H9l-4-4z"/></svg>',
    undo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 7L4 12l5 5"/><path d="M4 12h10a6 6 0 010 12" transform="translate(0,-5)"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg>',
    hand: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 13V5a1.5 1.5 0 013 0v6M11 11V3.5a1.5 1.5 0 013 0V11M14 11V5a1.5 1.5 0 013 0v8M8 13l-1.5-2a1.5 1.5 0 00-2.4 1.8L8 19a5 5 0 004 2h2a5 5 0 005-5v-3"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>'
   },
   Ink = {
    open(o) {
     let root = document.createElement("div");
     root.className = "inkwrap", root.innerHTML = '<div class="inkhead"><div class="row"><button class="ibtn" data-a="x" aria-label="' + LT("Đóng", "Close") + '">' + ICON.close + '</button><button class="ibtn" data-a="undo" aria-label="' + LT("Hoàn tác", "Undo") + '">' + ICON.undo + '</button><button class="ibtn" data-a="clear" aria-label="' + LT("Xoá hết", "Clear all") + '">' + ICON.trash + '</button><div class="grow muted" style="font-size:.8rem;line-height:1.15;font-weight:800" data-r="hint"></div><button class="btn grn sm" data-a="done">' + LT("Nộp bài ✓", "Submit ✓") + '</button></div><div class="inkq" data-r="q"></div></div><div class="paper" data-r="paper"><div class="sheetpaper" data-r="sheet"><canvas></canvas></div></div><div class="inktools"><button class="ibtn on" data-t="pen" aria-label="' + LT("Bút", "Pen") + '">' + ICON.pen + '</button><button class="ibtn" data-t="eraser" aria-label="' + LT("Tẩy", "Eraser") + '">' + ICON.eraser + '</button><button class="ibtn" data-t="scroll" aria-label="' + LT("Cuộn giấy", "Scroll paper") + '">' + ICON.hand + '</button><span class="sep"></span>' + ["#1F2A44", "#E5484D", "#2F6FDE", "#2E9E5B"].map((c, i) => '<button class="swatch' + (i === 0 ? " on" : "") + '" data-c="' + c + '" style="background:' + c + '" aria-label="' + LT("Màu", "Color") + '"></button>').join("") + "</div>", document.body.appendChild(root);
     let q = $("[data-r=q]", root),
      sheet2 = $("[data-r=sheet]", root),
      cv = $("canvas", root),
      ctx = cv.getContext("2d");
     q.innerHTML = o.qHtml, q.addEventListener("click", () => q.classList.toggle("open"));
     let H = 1700,
      dpr = Math.min(2, window.devicePixelRatio || 1),
      W = 0,
      strokes = o.strokes || [],
      tool = "pen",
      color = "#1F2A44",
      penSeen = !1,
      cur = null,
      activeId = null,
      last = null;

     function size() {
      W = sheet2.clientWidth, sheet2.style.height = H + "px", cv.width = Math.round(W * dpr), cv.height = Math.round(H * dpr), redraw()
     }

     function seg(s, i) {
      let p = s.pts,
       a = p[i - 1],
       b = p[i];
      if (ctx.save(), ctx.scale(dpr, dpr), ctx.lineCap = "round", ctx.lineJoin = "round", ctx.globalCompositeOperation = s.erase ? "destination-out" : "source-over", ctx.strokeStyle = s.erase ? "#000" : s.c, ctx.lineWidth = s.erase ? s.w * 5 : s.w * (.55 + (b[2] || .5) * .9), ctx.beginPath(), i >= 2) {
       let z = p[i - 2],
        m1 = [(z[0] + a[0]) / 2, (z[1] + a[1]) / 2],
        m2 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
       ctx.moveTo(m1[0], m1[1]), ctx.quadraticCurveTo(a[0], a[1], m2[0], m2[1])
      } else ctx.moveTo(a[0], a[1]), ctx.lineTo(b[0], b[1]);
      ctx.stroke(), ctx.restore()
     }

     function dot(s) {
      let p = s.pts[0];
      ctx.save(), ctx.scale(dpr, dpr), ctx.globalCompositeOperation = s.erase ? "destination-out" : "source-over", ctx.fillStyle = s.erase ? "#000" : s.c, ctx.beginPath(), ctx.arc(p[0], p[1], s.erase ? s.w * 2.5 : s.w * .6, 0, 7), ctx.fill(), ctx.restore()
     }

     function redraw() {
      ctx.clearRect(0, 0, cv.width, cv.height), strokes.forEach(s => {
       s.pts.length === 1 && dot(s);
       for (let i = 1; i < s.pts.length; i++) seg(s, i)
      })
     }

     function pt(e) {
      let r = cv.getBoundingClientRect();
      return [(e.clientX - r.left) * (W / r.width), (e.clientY - r.top) * (H / r.height), e.pointerType === "pen" && e.pressure > 0 ? e.pressure : .5]
     }

     function allowed(e) {
      return tool === "scroll" ? !1 : e.pointerType === "pen" ? (penSeen = !0, !0) : !(e.pointerType === "touch" && penSeen && Store.d.set.penOnly)
     }

     function updHint() {
      $("[data-r=hint]", root).textContent = tool === "scroll" ? LT("Kéo để cuộn giấy", "Drag to scroll the paper") : penSeen && Store.d.set.penOnly ? LT("Đã nhận bút: ngón tay không viết", "Pen detected: fingers won't draw") : LT("Viết bằng ngón tay hoặc bút", "Write with your finger or a pen")
     }
     cv.addEventListener("pointerdown", e => {
      if (Sfx.init(), e.pointerType === "pen" && (penSeen = !0), updHint(), !(!allowed(e) || activeId != null)) {
       activeId = e.pointerId;
       try {
        cv.setPointerCapture(e.pointerId)
       } catch {}
       cur = {
        c: color,
        w: tool === "eraser" ? 6 : 3.2,
        erase: tool === "eraser",
        pts: [pt(e)]
       }, strokes.push(cur), dot(cur), last = {
        x: e.clientX,
        y: e.clientY,
        t: performance.now()
       }, Sfx.penStart(), e.preventDefault()
      }
     }), cv.addEventListener("pointermove", e => {
      if (!cur || e.pointerId !== activeId) return;
      let list = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
      (list.length ? list : [e]).forEach(ev => {
       let p = pt(ev),
        l = cur.pts[cur.pts.length - 1];
       Math.abs(p[0] - l[0]) + Math.abs(p[1] - l[1]) < .8 || (cur.pts.push(p), seg(cur, cur.pts.length - 1))
      });
      let now = performance.now(),
       dx = e.clientX - last.x,
       dy = e.clientY - last.y,
       v = Math.sqrt(dx * dx + dy * dy) / Math.max(8, now - last.t);
      last = {
       x: e.clientX,
       y: e.clientY,
       t: now
      }, Sfx.penMove(v * 4, cur.erase), e.preventDefault()
     });
     let end = e => {
      e.pointerId === activeId && (activeId = null, cur = null, Sfx.penStop())
     };
     cv.addEventListener("pointerup", end), cv.addEventListener("pointercancel", end), cv.addEventListener("lostpointercapture", end), cv.style.touchAction = "none", $$("[data-t]", root).forEach(b => b.addEventListener("click", () => {
      tool = b.dataset.t, $$("[data-t]", root).forEach(x => x.classList.toggle("on", x === b)), cv.style.touchAction = tool === "scroll" ? "pan-y" : "none", tool !== "eraser" && $$(".swatch", root).forEach(x => x.classList.toggle("on", x.dataset.c === color)), Sfx.tap(), updHint()
     })), $$(".swatch", root).forEach(b => b.addEventListener("click", () => {
      color = b.dataset.c, tool !== "pen" && (tool = "pen", $$("[data-t]", root).forEach(x => x.classList.toggle("on", x.dataset.t === "pen")), cv.style.touchAction = "none"), $$(".swatch", root).forEach(x => x.classList.toggle("on", x === b)), Sfx.tap()
     }));

     function snapshot() {
      if (!strokes.filter(s => !s.erase).length) return null;
      let x0 = 1e9,
       y0 = 1e9,
       x1 = -1e9,
       y1 = -1e9;
      strokes.forEach(s => {
       s.erase || s.pts.forEach(p => {
        x0 = Math.min(x0, p[0]), y0 = Math.min(y0, p[1]), x1 = Math.max(x1, p[0]), y1 = Math.max(y1, p[1])
       })
      });
      let pad = 16;
      x0 = Math.max(0, x0 - pad), y0 = Math.max(0, y0 - pad), x1 = Math.min(W, x1 + pad), y1 = Math.min(H, y1 + pad);
      let w = Math.max(40, x1 - x0),
       h = Math.max(40, y1 - y0),
       sc = Math.min(1, 900 / w, 1400 / h) * dpr,
       t = document.createElement("canvas");
      t.width = Math.round(w * sc), t.height = Math.round(h * sc);
      let c = t.getContext("2d");
      c.fillStyle = "#fff", c.fillRect(0, 0, t.width, t.height), c.drawImage(cv, x0 * dpr, y0 * dpr, w * dpr, h * dpr, 0, 0, t.width, t.height);
      try {
       return t.toDataURL("image/jpeg", .82)
      } catch {
       return null
      }
     }

     function close() {
      Sfx.penStop(), root.remove(), Ink.cur = null
     }
     return root.addEventListener("click", e => {
      let a = e.target.closest("[data-a]");
      if (!a) return;
      let k = a.dataset.a;
      if (Sfx.tap(), k === "undo") strokes.pop(), redraw();
      else if (k === "clear") strokes.length && ask(LT("Xoá hết bài đã viết?", "Erase everything you wrote?"), () => {
       strokes.length = 0, redraw()
      }, LT("Xoá hết", "Erase all"));
      else if (k === "x") {
       let keep = strokes.length;
       close(), o.onCancel && o.onCancel(keep ? strokes : null)
      } else if (k === "done") {
       let img2 = snapshot();
       close(), o.onDone(img2, strokes)
      }
     }), Ink.cur = {
      close: () => {
       let keep = strokes.length;
       close(), o.onCancel && o.onCancel(keep ? strokes : null)
      }
     }, requestAnimationFrame(() => {
      size(), updHint()
     }), window.addEventListener("resize", size), root
    }

   };
  var HANGN = [LT("đơn vị", "ones"), LT("chục", "tens"), LT("trăm", "hundreds"), LT("nghìn", "thousands"), LT("chục nghìn", "ten thousands"), LT("trăm nghìn", "hundred thousands"), LT("triệu", "millions"), LT("chục triệu", "ten millions")],
   Work = {
    cur: null,
    shell(title, qHtml, body) {
     let root = document.createElement("div");
     return root.className = "inkwrap workwrap", root.innerHTML = '<div class="inkhead"><div class="row"><button class="ibtn" data-w="x" aria-label="' + LT("Đóng", "Close") + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" style="width:26px;height:26px"><path d="M6 6l12 12M18 6L6 18"/></svg></button><div class="grow"><b class="disp" style="font-size:1.3rem">' + title + "</b></div>" + body.head + '</div><div class="inkq">' + qHtml + '</div></div><div class="paper" style="padding:12px 14px calc(14px + var(--sab))" data-r="body">' + body.main + "</div>", document.body.appendChild(root), root
    },
    close() {
     Work.cur && (Work.cur.remove(), Work.cur = null)
    },
    col(q, cb) {
     /* v8: ô nhớ ở trên để bé tự điền (không có ô ở hàng đơn vị), có hướng dẫn nhớ (cộng, nhân) và mượn – trả (trừ) */
     let w = q.work,
      a = w.a,
      b = w.b,
      op = w.op === "×" ? "×" : w.op === "+" ? "+" : "-",
      fb = op === "×" ? FB.mul1(a, b) : FB.col(a, b, op),
      res = fb.res,
      n = Math.max(String(a).length, op === "×" ? 1 : String(b).length, String(res).length),
      A = String(a).padStart(n, " "),
      B = (op === "×" ? String(b) : String(b)).padStart(n, " "),
      R = String(res).padStart(n, " "),
      cells = Array(n).fill(""),
      carry = Array(n).fill(""),
      mark = Array(n).fill(""),
      need = Array(n).fill(0),
      blink = -1,
      help = !1,
      sel = { r: "r", i: n - 1 },
      LBL = op === "-" ? LT("Mượn", "Borrow") : LT("Nhớ", "Carry"),
      hn = i => HANGN[n - 1 - i] || "",
      HN2 = [LT("ĐV", "1s"), LT("C", "10s"), LT("T", "100s"), LT("N", "1K"), LT("CN", "10K"), LT("TN", "100K"), LT("Tr", "1M")];
     for (let i = n - 1; i > 0; i--) { let f = fb.info[i]; f && f.cout > 0 && (need[i - 1] = f.cout) }
     let cellHtml = (k, i, val, cls) => '<button class="cell ' + cls + (sel.r === k && sel.i === i ? " sel" : "") + (k === "c" && blink === i ? " blink" : "") + (mark[i] && k === "r" ? " " + mark[i] : "") + '" data-k="' + k + '" data-i="' + i + '" aria-label="' + LT((k === "r" ? "Kết quả" : "Ô " + LBL.toLowerCase()) + " hàng " + hn(i), (k === "r" ? "Result" : LBL.toLowerCase() + " box") + " in the " + hn(i) + " place") + '">' + val + "</button>",
      body = {
       head: '<button class="btn sm" data-w="help" style="background:var(--b-soft)">' + LT("❓ Cách điền", "❓ How to fill in") + '</button><button class="btn grn sm" data-w="check">' + LT("Kiểm tra ✓", "Check ✓") + '</button>',
       main: '<div class="wk" data-r="wk"></div><div data-r="help"></div><div class="fb info" data-r="msg" style="margin:10px 0"></div><div class="pad" data-r="pad">' + ["7", "8", "9", "del", "4", "5", "6", "nx", "1", "2", "3", "0"].map(k => k === "del" ? '<button class="del" data-w="key" data-k="del">⌫</button>' : k === "nx" ? '<button data-w="key" data-k="nx">←</button>' : '<button data-w="key" data-k="' + k + '">' + k + "</button>").join("") + "</div>"
      },
      root = Work.shell(LT("Đặt tính", "Column Method"), rich(q.q), body);
     Work.cur = root;
     let wk = $("[data-r=wk]", root),
      msg = $("[data-r=msg]", root),
      hb = $("[data-r=help]", root);
     let curCol = () => { for (let i = n - 1; i >= 0; i--) if (cells[i] === "" && R[i] !== " ") return i; return -1 };
     function draw() {
      let cc = curCol(),
       h = '<div class="grid" style="grid-template-columns:52px repeat(' + n + ',minmax(0,1fr))"><span class="wlbl">' + LBL + "</span>";
      for (let i = 0; i < n; i++) h += i === n - 1 ? '<span class="nocar" title="' + LT("Hàng đơn vị không có " + LBL.toLowerCase(), "The ones place has no " + LBL.toLowerCase() + " box") + '"></span>' : cellHtml("c", i, carry[i], "small");
      h += "<span></span>";
      for (let i = 0; i < n; i++) h += '<span class="dg' + (i === cc ? " cur" : "") + '">' + (A[i] === " " ? "" : A[i]) + "</span>";
      h += '<span class="dg op">' + (op === "-" ? "−" : op) + "</span>";
      for (let i = 0; i < n; i++) h += '<span class="dg' + (i === cc ? " cur" : "") + '">' + (B[i] === " " ? "" : B[i]) + "</span>";
      h += '<span class="hl" style="grid-column:1/-1"></span><span></span>';
      for (let i = 0; i < n; i++) h += cellHtml("r", i, cells[i], "");
      h += "<span></span>";
      for (let i = 0; i < n; i++) h += '<span class="hname' + (i === cc ? " cur" : "") + '">' + (HN2[n - 1 - i] || "") + "</span>";
      wk.innerHTML = h + "</div>"
     }
     /* lời nhắc cho hàng đang làm – không nói ra đáp số */
     function prompt(i) {
      let f = fb.info[i];
      if (!f) return "";
      let H = LT("<b>Hàng " + hn(i) + ":</b> ", "<b>The " + hn(i) + " place:</b> "), nxt = i > 0 ? hn(i - 1) : "";
      if (A[i] === " " && (op === "×" || B[i] === " ")) return H + LT("không còn chữ số nào để tính, chỉ còn số nhớ " + f.cin + " → viết " + f.cin + " xuống hàng kết quả.", "there are no digits left to work with, only the carried " + f.cin + " → write " + f.cin + " in the result row.");
      if (op === "+") return H + LT(f.da + " + " + f.db + (f.cin ? " rồi thêm " + f.cin + " (đã nhớ)" : "") + " = ? Được từ 10 trở lên thì viết chữ số hàng đơn vị, <b>nhớ 1</b> vào ô Nhớ của hàng " + nxt + ".", f.da + " + " + f.db + (f.cin ? " plus " + f.cin + " (carried)" : "") + " = ? If you get 10 or more, write the ones digit and <b>carry 1</b> to the Carry box of the " + nxt + " place.");
      if (op === "×") return H + LT(f.da + " × " + b + (f.cin ? " rồi thêm " + f.cin + " (đã nhớ)" : "") + " = ? Được từ 10 trở lên thì viết chữ số hàng đơn vị, <b>nhớ số chục</b> vào ô Nhớ của hàng " + nxt + ".", f.da + " × " + b + (f.cin ? " plus " + f.cin + " (carried)" : "") + " = ? If you get 10 or more, write the ones digit and <b>carry the tens digit</b> to the Carry box of the " + nxt + " place.");
      let s = H;
      f.cin && (s += LT("Trước hết <b>trả 1</b> đã mượn: số trừ " + f.db + " thêm 1 bằng " + f.t + ". ", "First <b>pay back the 1</b> you borrowed: the bottom number " + f.db + " plus 1 is " + f.t + ". "));
      return f.da < f.t ? s + LT(f.da + " không trừ được " + f.t + " → <b>mượn 1 " + nxt + "</b> (bằng 10 " + hn(i) + ") thành " + f.cur + ", rồi tính " + f.cur + " − " + f.t + " = ?", "you can't subtract " + f.t + " from " + f.da + " → <b>borrow 1 from the " + nxt + " place</b> (worth 10 " + hn(i) + ") to make " + f.cur + ", then work out " + f.cur + " − " + f.t + " = ?") : s + LT("Tính " + f.da + " − " + f.t + " = ?", "Work out " + f.da + " − " + f.t + " = ?")
     }
     function after(i) {
      let f = fb.info[i];
      if (A[i] === " " && (op === "×" || B[i] === " ")) return LT("Đúng! Viết số nhớ " + f.cin + " xuống.", "Correct! Write the carried " + f.cin + " down.");
      if (op === "+") return LT("Đúng! " + f.da + " + " + f.db + (f.cin ? " + " + f.cin : "") + " = " + f.v + (f.cout ? ". Viết " + f.dr + ", <b>nhớ 1</b>: ghi <b>1</b> vào ô Nhớ đang nhấp nháy (hàng " + hn(i - 1) + ")." : "."), "Correct! " + f.da + " + " + f.db + (f.cin ? " + " + f.cin : "") + " = " + f.v + (f.cout ? ". Write " + f.dr + ", <b>carry 1</b>: put <b>1</b> in the blinking Carry box (" + hn(i - 1) + " place)." : "."));
      if (op === "×") return LT("Đúng! " + f.da + " × " + b + (f.cin ? " + " + f.cin : "") + " = " + f.v + (f.cout && i > 0 ? ". Viết " + f.dr + ", <b>nhớ " + f.cout + "</b>: ghi <b>" + f.cout + "</b> vào ô Nhớ đang nhấp nháy." : "."), "Correct! " + f.da + " × " + b + (f.cin ? " + " + f.cin : "") + " = " + f.v + (f.cout && i > 0 ? ". Write " + f.dr + ", <b>carry " + f.cout + "</b>: put <b>" + f.cout + "</b> in the blinking Carry box." : "."));
      return LT("Đúng! " + f.cur + " − " + f.t + " = " + f.v + "." + (f.cout ? " Vì đã <b>mượn 1</b> nên phải <b>trả</b>: ghi <b>1</b> vào ô Mượn đang nhấp nháy (hàng " + hn(i - 1) + "). Sang hàng đó nhớ thêm 1 vào số trừ." : ""), "Correct! " + f.cur + " − " + f.t + " = " + f.v + "." + (f.cout ? " Since you <b>borrowed 1</b>, you must <b>pay it back</b>: put <b>1</b> in the blinking Borrow box (" + hn(i - 1) + " place). In that place, add 1 to the bottom number." : ""))
     }
     function say(html, cls) { msg.className = "fb " + (cls || "info"), msg.innerHTML = html }
     let voDone = {}, vo = (t, once) => { if (!window.VO || op === "×") return; if (once) { if (voDone[t]) return; voDone[t] = 1 } window.VO.say(t) };
     function nextPrompt() {
      let cc = curCol();
      if (cc >= 0) { let f = fb.info[cc]; f && (op === "+" && f.v >= 10 ? vo(LT("Được từ mười trở lên thì viết chữ số hàng đơn vị, nhớ một vào ô Nhớ của hàng bên trái.", "If you get ten or more, write the ones digit and carry one to the Carry box of the place on the left."), 1) : op === "-" && f.da < f.t && vo(LT("Số trên bé hơn số dưới thì mượn một chục, thành mười mấy rồi trừ.", "If the top number is smaller than the bottom number, borrow one ten to make a teen number, then subtract."), 1)) }
      cc >= 0 ? (sel = { r: "r", i: cc }, say("👉 " + prompt(cc))) : (say(LT("Con điền xong rồi. Bấm <b>Kiểm tra ✓</b> nhé.", "You filled in everything. Tap <b>Check ✓</b>."), "ok"), vo(LT("Con điền xong rồi. Bấm nút Kiểm tra nhé.", "You filled in everything. Tap the Check button."), 1))
     }
     function helpHtml() {
      return help ? '<div class="card flat whelp">' + (op === "-" ? LT('<b>Phép trừ: mượn 1 thì trả 1</b><ol><li>Tính từ <b>hàng đơn vị</b> (bên phải).</li><li>Số trên bé hơn số dưới: <b>mượn 1 ở hàng bên trái</b> (thêm 10 vào hàng này) rồi trừ. Ví dụ hàng đơn vị 1 − 5 không được → mượn 1 chục, 11 − 5 = 6, viết 6.</li><li>Đã mượn thì phải trả: ghi <b>1</b> vào <b>ô Mượn</b> phía trên hàng bên trái.</li><li>Sang hàng đó: <b>thêm 1 vào số trừ</b> rồi mới trừ. Ví dụ số trừ 6 thêm 1 bằng 7.</li></ol><div class="muted">Sách giáo khoa nói: “lấy 11 trừ 5 bằng 6, viết 6 nhớ 1; 6 thêm 1 bằng 7…”</div>', '<b>Subtraction: borrow 1, pay back 1</b><ol><li>Start at the <b>ones place</b> (on the right).</li><li>If the top number is smaller than the bottom number, <b>borrow 1 from the place on the left</b> (add 10 to this place), then subtract. Example: in the ones place 1 − 5 does not work → borrow 1 ten, 11 − 5 = 6, write 6.</li><li>If you borrowed, you must pay it back: write <b>1</b> in the <b>Borrow box</b> above the place on the left.</li><li>In that place: <b>add 1 to the bottom number</b> first, then subtract. Example: the bottom number 6 plus 1 is 7.</li></ol><div class="muted">The textbook says: “11 minus 5 equals 6, write 6 and carry 1; 6 plus 1 equals 7…”</div>') : LT('<b>Phép ' + (op === "×" ? "nhân" : "cộng") + ': nhớ sang hàng bên trái</b><ol><li>Tính từ <b>hàng đơn vị</b> (bên phải).</li><li>Kết quả một hàng được từ 10 trở lên: <b>viết chữ số hàng đơn vị</b> ở hàng đó. Ví dụ 6 + 9 = 15 → viết 5.</li><li>Ghi số chục (' + (op === "×" ? "1, 2, 3…" : "thường là 1") + ') vào <b>ô Nhớ</b> phía trên hàng bên trái.</li><li>Tính hàng bên trái xong thì <b>cộng thêm</b> số ở ô Nhớ.</li></ol>', '<b>' + (op === "×" ? "Multiplication" : "Addition") + ': carry to the place on the left</b><ol><li>Start at the <b>ones place</b> (on the right).</li><li>If a place adds up to 10 or more: <b>write the ones digit</b> in that place. Example: 6 + 9 = 15 → write 5.</li><li>Write the tens digit (' + (op === "×" ? "1, 2, 3…" : "usually 1") + ') in the <b>Carry box</b> above the place on the left.</li><li>When you work on the place on the left, <b>add</b> the number in the Carry box.</li></ol>')) + LT('<div class="muted">Hàng đơn vị không có ô nhỏ vì không có hàng nào ở bên phải nó.</div></div>', '<div class="muted">The ones place has no small box because there is no place to its right.</div></div>') : ""
     }
     vo(op === "-" ? LT("Hàng đơn vị không có ô mượn. Con tính từ phải sang trái nhé.", "The ones place has no Borrow box. Work from right to left.") : LT("Hàng đơn vị không có ô nhớ. Con tính từ phải sang trái nhé.", "The ones place has no Carry box. Work from right to left."), 1);
     draw(), nextPrompt();
     function typeKey2(k) {
      if (k === "del") { sel.r === "r" ? (cells[sel.i] = "", mark[sel.i] = "") : carry[sel.i] = "", draw(), nextPrompt(); return }
      if (k === "nx") { sel.i > 0 && sel.i--, draw(); return }
      if (sel.r === "c") {
       carry[sel.i] = k;
       let want = need[sel.i];
       if (want && +k === want) { blink = -1, Sfx.pop(), draw(), nextPrompt(); return }
       want ? say(LT("Ô này cần ghi số " + (op === "-" ? "đã mượn" : "nhớ") + " từ hàng bên phải. Con xem lại nhé: " + (op === "-" ? "mượn 1 thì ghi 1." : "số chục của kết quả hàng bên phải."), "This box needs the amount you " + (op === "-" ? "borrowed" : "carried") + " from the place on the right. Take another look: " + (op === "-" ? "if you borrowed 1, write 1." : "it is the tens digit of the result on the right.")), "no") : say(LT("Hàng bên phải không cần " + (op === "-" ? "mượn" : "nhớ") + ", nên ô này để trống nhé.", "The place on the right doesn't need a " + (op === "-" ? "borrow" : "carry") + ", so leave this box empty."), "no");
       draw();
       return
      }
      let i = sel.i;
      cells[i] = k, mark[i] = "";
      let right = R[i] !== " " && k === R[i];
      if (right) {
       mark[i] = "ok", Sfx.pop();
       if (i > 0 && need[i - 1] && carry[i - 1] === "") { blink = i - 1, sel = { r: "c", i: i - 1 }, draw(), say(after(i), "ok"), vo(op === "-" ? LT("Vì đã mượn một nên phải trả: ghi một vào ô Mượn đang nhấp nháy, sang hàng bên trái cộng thêm một vào số trừ.", "Since you borrowed one, you must pay it back: write one in the blinking Borrow box, and in the place on the left add one to the bottom number.") : LT("Đúng rồi! Viết chữ số hàng đơn vị, ghi số nhớ vào ô đang nhấp nháy.", "That's right! Write the ones digit, and put the carried number in the blinking box.")); return }
       draw(), nextPrompt(), msg.innerHTML = after(i) + "<br>" + msg.innerHTML;
       return
      }
      mark[i] = "no", Sfx.bad && Sfx.bad(), draw();
      let miss = i < n - 1 && need[i] && carry[i] === "";
      vo(miss ? (op === "-" ? LT("Con quên trả một đã mượn. Ô Mượn phía trên còn trống.", "You forgot to pay back the one you borrowed. The Borrow box above is still empty.") : LT("Con quên số nhớ ở ô phía trên.", "You forgot the carried number in the box above.")) : LT("Chưa đúng. Con xem lại hàng này nhé.", "Not quite. Take another look at this place."));
      say(LT("Chưa đúng ở hàng " + hn(i) + ". " + (miss ? "Con quên " + (op === "-" ? "<b>trả 1</b> đã mượn (ô Mượn phía trên còn trống)." : "<b>số nhớ</b> ở ô phía trên.") + " " : ""), "Not quite in the " + hn(i) + " place. " + (miss ? "You forgot " + (op === "-" ? "to <b>pay back the 1</b> you borrowed (the Borrow box above is still empty)." : "the <b>carried number</b> in the box above.") + " " : "")) + "👉 " + prompt(i), "no")
     }
     return root.addEventListener("click", e => {
      let t = e.target.closest("[data-w],.cell");
      if (!t) return;
      if (Sfx.init(), t.classList.contains("cell")) {
       sel = { r: t.dataset.k, i: +t.dataset.i }, Sfx.tap(), draw();
       return
      }
      let k = t.dataset.w;
      if (k === "x") { Work.close(); return }
      if (k === "help") { help = !help, hb.innerHTML = helpHtml(), Sfx.tap(); return }
      if (k === "key") { Sfx.tap(), typeKey2(t.dataset.k); return }
      if (k === "check") {
       let first = cells.findIndex(x => x !== "");
       if (first < 0 || cells.slice(first).some(x => x === "")) {
        say(LT("Con điền đủ các ô kết quả (từ chữ số đầu tiên đến hàng đơn vị) nhé.", "Fill in every result box (from the first digit down to the ones place).")), Sfx.lock();
        return
       }
       let val = cells.slice(first).join("");
       for (let i = 0; i < n; i++) mark[i] = cells[i] === (R[i] === " " ? "" : R[i]) ? "ok" : "no";
       let r = cb(val);
       if (r.done) { Work.close(); return }
       draw();
       let wrongI = -1;
       for (let i = n - 1; i >= 0; i--) if (mark[i] === "no") { wrongI = i; break }
       say(LT("<b>Chưa đúng.</b> ", "<b>Not quite.</b> ") + (r.msg ? esc(r.msg) + "<br>" : "") + (wrongI >= 0 ? "👉 " + prompt(wrongI) : ""), "no")
      }
     }), root
    },
    bars(q, done) {
     let w = q.work,
      S = w.S,
      D = w.D,
      a = w.a,
      b = w.b,
      labs = w.labs,
      scenes = SDscenes(S, D, b, labs),
      fb = FB.segs(scenes, {
       bottom: 44
      }),
      uniq = (ans, c) => {
       let s = [ans];
       c.forEach(x => {
        x > 0 && s.indexOf(x) < 0 && s.length < 3 && s.push(x)
       });
       let k2 = 1;
       for (; s.length < 3;) s.indexOf(ans + k2) < 0 && s.push(ans + k2), k2++;
       return Sfx && mkRng(S * 7 + D).shuffle(s)
      },
      steps = [{
       p: LT("Trước tiên, hãy xem **tổng** của hai số. Tổng là bao nhiêu?", "First, look at the **sum** of the two numbers. What is the sum?"),
       opts: uniq(S, [D, S + D, a]),
       ans: S,
       f: 1,
       tip: LT("Tổng là số của cả hai gộp lại.", "The sum is both numbers put together."),
       good: LT("Đúng! Ngoặc đỏ là tổng.", "Correct! The red bracket is the sum.")
      }, {
       p: LT("Số lớn hơn số bé bao nhiêu? Đó là **hiệu**.", "How much bigger is the larger number than the smaller one? That is the **difference**."),
       opts: uniq(D, [S, b, a]),
       ans: D,
       f: 2,
       tip: LT('Đọc lại đề: hiệu là phần "lớn hơn" (hoặc phải thêm vào cho bằng nhau).', 'Read the problem again: the difference is the "extra" part (or what you must add to make them equal).'),
       good: LT("Đúng! Đoạn màu cam là phần hơn của số lớn.", "Correct! The orange piece is how much more the larger number has.")
      }, {
       p: LT("**Cắt bỏ khúc hiệu** đi. Hai đoạn còn lại thế nào?", "**Cut off the difference piece.** How do the two remaining bars compare?"),
       opts: [LT("Bằng nhau", "Equal"), LT("Đoạn Lớn vẫn dài hơn", "The larger bar is still longer")],
       ans: LT("Bằng nhau", "Equal"),
       f: 3,
       tip: LT("Đoạn màu cam chính là chỗ hơn nhau.", "The orange piece is exactly where they differ."),
       good: LT("Đúng! Hai đoạn bằng nhau.", "Correct! The two bars are equal.")
      }, {
       p: LT("Cắt khúc hiệu rồi, **tổng hai đoạn bằng nhau** là bao nhiêu?", "With the difference piece cut off, what is the **total of the two equal bars**?"),
       opts: uniq(S - D, [S + D, S, a]),
       ans: S - D,
       f: 3,
       tip: LT("Lấy tổng trừ đi khúc hiệu.", "Take the sum minus the difference piece."),
       good: LT("Đúng! Tổng bớt đi khúc hiệu.", "Correct! The sum minus the difference piece.")
      }, {
       p: LT("Mỗi đoạn bằng nhau là bao nhiêu? (đó chính là **số bé**)", "How long is each equal bar? (That is the **smaller number**.)"),
       opts: uniq(b, [S - D, a, S - D]),
       ans: b,
       f: 4,
       tip: LT("Chia tổng hai đoạn bằng nhau cho 2.", "Divide the total of the two equal bars by 2."),
       good: LT("Đúng! Số bé là " + b + ". Số lớn = số bé + hiệu.", "Correct! The smaller number is " + b + ". Larger number = smaller number + difference.")
      }],
      k = 0,
      body = {
       head: "",
       main: '<div class="fig" data-r="fig"></div><div class="card flat" data-r="pr" style="margin-top:12px"></div>'
      },
      root = Work.shell(LT("Vẽ sơ đồ", "Draw the Diagram"), rich(q.q), body);
     Work.cur = root;
     let svg = mkSvg(fb.vb, "");
     $("[data-r=fig]", root).appendChild(svg), paint(svg, fb.frames[0]);
     let pr = $("[data-r=pr]", root);

     function show(msg) {
      if (k >= steps.length) {
       pr.innerHTML = LT('<div class="fb ok"><b>Con đã dựng xong sơ đồ!</b> Số bé = ' + b + '. Số lớn = số bé + hiệu. Giờ con nhập đáp án nhé.</div><button class="btn pri block" data-w="end" style="margin-top:10px">Nhập đáp án ▶</button>', '<div class="fb ok"><b>You built the diagram!</b> The smaller number = ' + b + '. Larger number = smaller number + difference. Now enter your answer.</div><button class="btn pri block" data-w="end" style="margin-top:10px">Enter answer ▶</button>');
       return
      }
      let s = steps[k];
      pr.innerHTML = (msg ? '<div class="fb ' + msg[0] + '" style="margin-bottom:10px">' + msg[1] + "</div>" : "") + '<div style="font-size:1.2rem;font-weight:800;margin-bottom:10px">' + (k + 1) + "/" + steps.length + ". " + rich(s.p) + '</div><div class="opts">' + s.opts.map(o => '<button class="opt" data-w="o" data-o="' + o + '">' + (typeof o == "number" ? fmt(o) : o) + "</button>").join("") + "</div>"
     }
     return show(), root.addEventListener("click", e => {
      let t = e.target.closest("[data-w]");
      if (!t) return;
      Sfx.init();
      let kk = t.dataset.w;
      if (kk === "x") {
       Work.close();
       return
      }
      if (kk === "end") {
       Work.close(), done();
       return
      }
      if (kk === "o") {
       let s = steps[k];
       if ((typeof s.ans == "number" ? +t.dataset.o : t.dataset.o) === s.ans) {
        Sfx.ok(), paint(svg, fb.frames[s.f]);
        let g = s.good;
        k++, show(["ok", g])
       } else Sfx.bad(), q.st.diagErr = (q.st.diagErr || 0) + 1, show(["no", LT("Chưa đúng. 💡 ", "Not quite. 💡 ") + s.tip])
      }
     }), root
    },
    guided(title, q, fb, steps, done) {
     let k = 0,
      val = "",
      body = {
       head: "",
       main: '<div class="fig noanim" data-r="fig"></div><div class="card flat" data-r="pr" style="margin-top:10px"></div><div class="pad" data-r="pad" style="margin-top:10px">' + ["7", "8", "9", "del", "4", "5", "6", "0", "1", "2", "3"].map(k2 => k2 === "del" ? '<button class="del" data-w="key" data-k="del">⌫</button>' : '<button data-w="key" data-k="' + k2 + '">' + k2 + "</button>").join("") + '<button class="go" data-w="ok" style="grid-column:span 1;font-size:1.2rem">OK</button></div>'
      },
      root = Work.shell(title, rich(q.q), body);
     Work.cur = root;
     let svg = mkSvg(fb.vb, "");
     $("[data-r=fig]", root).appendChild(svg), paint(svg, fb.frames[0], !0);
     let pr = $("[data-r=pr]", root),
      pad = $("[data-r=pad]", root);

     function show(msg) {
      if (k >= steps.length) {
       pad.style.display = "none", pr.innerHTML = LT('<div class="fb ok"><b>Con đặt tính xong rồi!</b></div><button class="btn pri block" data-w="end" style="margin-top:10px">Điền đáp án và kiểm tra ▶</button>', '<div class="fb ok"><b>You set up the problem!</b></div><button class="btn pri block" data-w="end" style="margin-top:10px">Fill in the answer and check ▶</button>');
       return
      }
      let s = steps[k];
      pr.innerHTML = (msg ? '<div class="fb ' + msg[0] + '" style="margin-bottom:8px">' + msg[1] + "</div>" : "") + '<div style="font-size:1.15rem;font-weight:800;margin-bottom:8px">' + LT("Bước ", "Step ") + (k + 1) + "/" + steps.length + ". " + rich(s.p) + '</div><div class="field act" style="max-width:none" data-r="v">' + (val ? esc(fmt(val)) : '<span class="ph">?</span>') + "</div>"
     }
     return show(), root.addEventListener("click", e => {
      let t = e.target.closest("[data-w]");
      if (!t) return;
      Sfx.init();
      let w = t.dataset.w;
      if (w === "x") {
       Work.close();
       return
      }
      if (w === "end") {
       Work.close(), done();
       return
      }
      if (w === "key") {
       Sfx.tap(), t.dataset.k === "del" ? val = val.slice(0, -1) : val.length < 8 && (val += t.dataset.k), $("[data-r=v]", root).innerHTML = val ? esc(fmt(val)) : '<span class="ph">?</span>';
       return
      }
      if (w === "ok") {
       if (!val) {
        Sfx.lock();
        return
       }
       let s = steps[k],
        e2 = +val;
       e2 === s.ans || s.alt != null && e2 === s.alt ? (Sfx.ok(), s.f != null && paint(svg, fb.frames[s.f]), k++, val = "", show(["ok", e2 === s.ans ? LT("Đúng! ", "Correct! ") + (s.good || "") : s.altMsg || ""])) : (Sfx.bad(), q.st.diagErr = (q.st.diagErr || 0) + 1, val = "", show(["no", LT("Chưa đúng. ", "Not quite. ") + (s.why ? s.why(e2) : "")]))
      }
     }), root
    },
    div(q, cb) {
     let w = q.work,
      n = w.n,
      d = w.d,
      fb = FB.div(n, d),
      steps = [];
     return fb.st.forEach((s, i) => {
      steps.push({
       p: s.cur < d ? LT("Lấy **" + s.cur + " : " + d + "** được mấy? (" + s.cur + " bé hơn " + d + " nên chưa chia được, thương là 0)", "What is **" + s.cur + " ÷ " + d + "**? (" + s.cur + " is smaller than " + d + ", so it doesn't go in yet. The quotient is 0)") : LT("Lấy **" + s.cur + " : " + d + "** được mấy? (thử nhân " + d + " với 1, 2, 3...)", "What is **" + s.cur + " ÷ " + d + "**? (try multiplying " + d + " by 1, 2, 3...)"),
       ans: s.q,
       why: e => e * d > s.cur ? LT(e + " × " + d + " = " + e * d + ", lớn hơn " + s.cur + " rồi. Thử số bé hơn.", e + " × " + d + " = " + e * d + ", which is bigger than " + s.cur + ". Try a smaller number.") : s.cur - e * d >= d ? LT(e + " × " + d + " = " + e * d + "; " + s.cur + " − " + e * d + " = " + (s.cur - e * d) + " vẫn ≥ " + d + ". Thử số lớn hơn.", e + " × " + d + " = " + e * d + "; " + s.cur + " − " + e * d + " = " + (s.cur - e * d) + ", which is still ≥ " + d + ". Try a bigger number.") : LT("Thử lại nhé.", "Try again."),
       good: LT("Viết " + s.q + " vào thương.", "Write " + s.q + " in the quotient.")
      }), steps.push({
       p: LT(s.q + " × " + d + " = " + s.prod + ". Lấy **" + s.cur + " − " + s.prod + "** = ?", s.q + " × " + d + " = " + s.prod + ". Now work out **" + s.cur + " − " + s.prod + "** = ?"),
       ans: s.rem,
       f: i + 1,
       why: e => LT("Trừ cẩn thận: " + s.cur + " − " + s.prod + ".", "Subtract carefully: " + s.cur + " − " + s.prod + "."),
       good: i + 1 < fb.st.length ? LT("Hạ chữ số tiếp theo xuống.", "Bring down the next digit.") : s.rem ? LT("Số dư là " + s.rem + " (bé hơn " + d + ").", "The remainder is " + s.rem + " (less than " + d + ").") : LT("Phép chia hết.", "It divides evenly.")
      })
     }), Work.guided(LT("Đặt tính chia", "Long Division"), q, fb, steps, () => cb(fb.q, fb.r))
    },
    mul2(q, cb) {
     let w = q.work,
      a = w.a,
      m = w.m,
      fb = FB.mul2(a, m),
      t = m % 10,
      u = Math.floor(m / 10),
      noCarry = x => +String(a).split("").map(c => +c * x % 10).join(""),
      steps = [{
       p: LT("Tích riêng thứ nhất: **" + a + " × " + t + "** = ?", "First partial product: **" + a + " × " + t + "** = ?"),
       ans: fb.p1,
       f: 1,
       why: e => e === noCarry(t) ? LT("Con quên cộng số nhớ khi nhân.", "You forgot to add the carry when multiplying.") : LT("Nhân " + t + " với từng chữ số, từ phải sang trái, nhớ khi quá 10.", "Multiply " + t + " by each digit, from right to left, and carry when you pass 10."),
       good: LT("Viết thẳng cột với hàng đơn vị.", "Line it up with the ones place.")
      }, {
       p: LT("Tích riêng thứ hai: **" + a + " × " + u + "** = ?", "Second partial product: **" + a + " × " + u + "** = ?"),
       ans: fb.p2,
       alt: fb.p2 * 10,
       altMsg: LT("Đúng giá trị (vì " + u + " là " + u + " chục). Khi đặt tính ta chỉ viết " + fb.p2 + " và lùi sang trái một cột. ", "Right value (because " + u + " means " + u + " tens). When we set it up in columns, we just write " + fb.p2 + " and shift it one column to the left. "),
       f: 2,
       why: e => e === noCarry(u) ? LT("Con quên cộng số nhớ khi nhân.", "You forgot to add the carry when multiplying.") : LT("Nhân " + u + " với từng chữ số của " + a + ".", "Multiply " + u + " by each digit of " + a + "."),
       good: LT("Viết lùi sang trái một cột.", "Shift it one column to the left.")
      }, {
       p: LT("Cộng hai tích riêng: **" + fmt(fb.p1) + " + " + fmt(fb.p2 * 10) + "** = ?", "Add the two partial products: **" + fmt(fb.p1) + " + " + fmt(fb.p2 * 10) + "** = ?"),
       ans: fb.res,
       f: 3,
       why: e => e === fb.p1 + fb.p2 ? LT("Tích riêng thứ hai phải lùi sang trái một cột (tức là " + fmt(fb.p2 * 10) + ").", "The second partial product must shift one column to the left (that is " + fmt(fb.p2 * 10) + ").") : LT("Cộng cẩn thận, nhớ khi quá 10.", "Add carefully and carry when you pass 10."),
       good: ""
      }];
     return Work.guided(LT("Đặt tính nhân", "Long Multiplication"), q, fb, steps, () => cb(fb.res))
    }
   };
  var lessonPassed = (id, t) => Store.lesson(id).pass[t - 1] > 0;

  function unlocked(l) {
   return Store.d.set.unlockAll || l.links.every(id => lessonPassed(id, 1))
  }

  function lessonDone(l) {
   let s = Store.lesson(l.id);
   return s.pass[0] && s.pass[1] && s.pass[2]
  }

  function nextLesson() {
   return LESSONS.find(l => !l.optional && unlocked(l) && !lessonDone(l)) || null
  }

  function totalStars() {
   let n = Store.d.bonus || 0;
   return LESSONS.forEach(l => Store.lesson(l.id).best.forEach(b => n += b)), Object.keys(Store.d.boss || {}).forEach(k => n += Store.d.boss[k]), n
  }

  function itemCount() {
   let t = totalStars();
   return t <= 0 ? 0 : Math.min(ITEMS.length, 1 + Math.floor((t - 1) / STARS_PER_ITEM))
  }

  function daily() {
   let d = Store.d.daily;
   return (!d || d.date !== todayStr()) && (d = Store.d.daily = {
    date: todayStr(),
    rev: 0,
    nw: 0,
    ch: 0,
    got: 0
   }, Store.save()), d
  }

  function dailyCheck() {
   let d = daily();
   return d.rev && d.nw && d.ch && !d.got ? (d.got = 1, Store.d.bonus = (Store.d.bonus || 0) + CONFIG.dailyBonusStars, Store.save(), !0) : !1
  }

  function bossOpen(rg) {
   return Store.d.set.unlockAll || LESSONS.filter(l => l.reg === rg && !l.optional).every(l => lessonPassed(l.id, 1))
  }

  function tierOpen(l, t) {
   if (Store.d.set.unlockAll) return !0;
   let s = Store.lesson(l.id);
   return t === 1 ? s.quick > 0 || s.pass[0] > 0 : s.pass[t - 2] > 0
  }

  function mascot(mood, cls) {
   let mode = themeMode();
   return '<img class="mascot mascot-img m-' + esc(mood) + (cls ? " " + cls : "") + '" alt="' + MODES.find(m => m.id === mode).owl + '" draggable="false" src="' + assetUrl(mascotPath(mode, mood)) + '">'
  }

  function topbar(title, sub, o) {
   return o = o || {}, '<div class="top">' + (o.logo ? '<span class="logo">' + mascot("happy") + "</span>" : "") + (o.back ? '<button class="ibtn" data-act="back" aria-label="' + LT("Quay lại", "Back") + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg></button>' : "") + '<div class="ttl">' + (sub ? "<small>" + esc(sub) + "</small>" : "") + "<b>" + esc(title) + "</b></div>" + (o.right || "") + "</div>"
  }
  var pills = () => '<span class="pill">' + starSvg(!0).replace("<svg", '<svg width="22" height="22"') + totalStars() + '</span><span class="pill">🔥 ' + Store.d.streak.n + "</span>";

  function navbar(cur) {
   if (window.NAVBAR) return window.NAVBAR(cur);
   return '<nav class="bar"><div class="in">' + [
    ["home", LT("Học", "Learn"), '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"><path d="M3 11l9-8 9 8v9a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z"/></svg>'],
    ["stats", LT("Thành tích", "Achievements"), '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/></svg>'],
    ["settings", LT("Cài đặt", "Settings"), '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="12" cy="12" r="3.2"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/></svg>']
   ].map(x => '<button class="' + (x[0] === cur ? "on" : "") + '" data-act="tab" data-t="' + x[0] + '"><span class="ni">' + x[2] + "</span>" + x[1] + "</button>").join("") + "</div></nav>"
  }

  function applyMotion() {
   document.documentElement.classList.toggle("calm", !!Store.d.set.reduceMotion)
  }

  function regionPath(rg, ls, nx) {
   let items = ls.map(l => ({
    l
   }));
   items.push({
    boss: !0
   });
   let xs = [72, 180, 288, 180],
    gap = 150,
    y0 = 74,
    H = items.length * gap,
    DEC = {
     so: ["🐚", "⭐", "🌴", "🐠", "🦀", "🐙"],
     toan: ["🌲", "🍄", "🦋", "🌼", "🐿️", "🌳"],
     ps: ["🍰", "🍓", "🧁", "🍒", "🍩", "🍕"],
     hinh: ["⛰️", "☁️", "🪁", "🏔️", "🎈", "🌈"]
    } [rg.id] || [],
    dxs = [300, 52, 56, 300],
    pts = items.map((_, i) => [xs[i % 4], y0 + i * gap]),
    d = "M" + pts[0][0] + " " + pts[0][1];
   for (let i = 1; i < pts.length; i++) {
    let a = pts[i - 1],
     b = pts[i],
     my = (a[1] + b[1]) / 2;
    d += " C" + a[0] + " " + my + " " + b[0] + " " + my + " " + b[0] + " " + b[1]
   }
   let h = '<div class="path" style="height:' + H + 'px">' + pathScenery(rg.id) + '<svg viewBox="0 0 360 ' + H + '" preserveAspectRatio="none" aria-hidden="true"><path d="' + d + '" fill="none" stroke="#fff" stroke-width="12" stroke-opacity=".7" stroke-linecap="round" vector-effect="non-scaling-stroke"/><path d="' + d + '" fill="none" stroke="#E0A458" stroke-width="6" stroke-dasharray="1 15" stroke-linecap="round" vector-effect="non-scaling-stroke"/></svg>';
   for (let i = 0; i < pts.length - 1; i++) {
    let my = (pts[i][1] + pts[i + 1][1]) / 2;
    h += '<span class="dec" style="left:' + (dxs[i % 4] / 360 * 100).toFixed(1) + "%;top:" + (my - 22) + "px;animation-delay:" + i * .7 + 's">' + DEC[i % DEC.length] + "</span>"
   }
   return items.forEach((it, i) => {
    let x = pts[i][0],
     y = pts[i][1],
     st2 = "left:" + (x / 360 * 100).toFixed(2) + "%;top:" + (y - 40) + "px";
    if (it.boss) {
     let open = bossOpen(rg.id),
      b = Store.d.boss[rg.id] || 0;
     h += '<button class="node ' + (open ? b ? "" : "cur" : "lock") + '" data-act="boss" data-id="' + rg.id + '" style="' + st2 + '"><span class="c" style="' + (open ? "background-color:#FF9EA2" : "") + '"><span style="font-size:2rem;line-height:1">' + (open ? "🐲" : "🔒") + '</span></span><span class="nm">' + LT("Bài trùm", "Boss Level") + '</span><span class="st">' + [0, 1, 2].map(k => starSvg(k < b)).join("") + "</span></button>";
     return
    }
    let l = it.l,
     un = unlocked(l),
     ps = Store.lesson(l.id).pass.filter(Boolean).length,
     cur = nx === l;
    h += '<button class="node ' + (un ? cur ? "cur" : "" : "lock") + '" data-act="lesson" data-id="' + l.id + '" style="' + st2 + '">' + (cur ? '<span class="owl" style="' + (x > 180 ? "left:-26px" : "right:-26px") + '">' + mascot("happy") + '</span><span class="go">' + LT("Học tiếp ▶", "Continue ▶") + '</span>' : "") + '<span class="c" style="background-color:' + regionColor(rg) + '"><span class="ico">' + lessonIcon(l) + "</span>" + (un ? "" : '<i class="lk">🔒</i>') + (ps === 3 ? '<i class="ck2">✓</i>' : "") + '</span><span class="nm">' + esc(l.short || l.title) + '</span><span class="st">' + [0, 1, 2].map(k => starSvg(k < ps)).join("") + "</span></button>"
   }), h + "</div>"
  }

  function missionStrip(nx) {
   let d = daily(),
    n = (d.rev ? 1 : 0) + (d.nw ? 1 : 0) + (d.ch ? 1 : 0),
    it = (ok, txt, act) => '<div class="it"><span class="ck' + (ok ? " on" : "") + '">' + (ok ? "✓" : "") + '</span><span class="grow">' + txt + "</span>" + (ok ? "" : '<button class="btn sm" data-act="' + act[0] + '"' + (act[1] ? ' data-id="' + act[1] + '"' : "") + ">" + LT("Đi ▶", "Go ▶") + "</button>") + "</div>",
    chal = LESSONS.find(l => Store.lesson(l.id).pass[1] && !Store.lesson(l.id).pass[2]);
   return '<details class="mission mstrip"><summary><span class="dots3">' + [d.rev, d.nw, d.ch].map(ok => '<i class="' + (ok ? "on" : "") + '">' + (ok ? "✓" : "") + "</i>").join("") + "</span><b>" + (d.got ? LT("Xong nhiệm vụ hôm nay! 🎉", "Today's missions are done! 🎉") : LT("Nhiệm vụ hôm nay", "Today's Missions")) + '</b><span class="cnt">' + n + '/3</span></summary><div class="mbody">' + it(d.rev, LT("Ôn lại bài cũ (4 câu)", "Review old lessons (4 questions)"), ["review"]) + it(d.nw, nx ? LT("Học bài mới: " + esc(nx.title), "Learn a new lesson: " + esc(nx.title)) : LT("Học bài mới", "Learn a new lesson"), nx ? ["lesson", nx.id] : ["review"]) + it(d.ch, LT("Thử thách mức Khó", "Hard level challenge"), chal ? ["prac2", chal.id] : ["review"]) + '<div class="muted" style="font-size:.9rem;margin-top:6px">' + LT("Xong cả 3 việc: thưởng thêm 2 ⭐", "Finish all 3 tasks: earn 2 extra ⭐") + '</div></div></details>'
  }

  function ctaCard(nx) {
   let d = daily(),
    started = LESSONS.some(l => Store.lesson(l.id).taught);
   return '<section class="cta"><div class="cm">' + mascot(d.got ? "cheer" : "happy") + '</div><div class="ct"><small>' + (nx ? started ? LT("Bài đang học", "Lesson in progress") : LT("Bắt đầu nào", "Let's get started") : LT("Con giỏi quá!", "You're amazing!")) + '</small><b class="disp">' + (nx ? esc(nx.title) : LT("Đã học hết các bài", "All lessons completed")) + "</b></div>" + (nx ? '<button class="btn pri block" data-act="lesson" data-id="' + nx.id + '">▶ ' + (started ? LT("Học tiếp", "Continue") : LT("Bắt đầu", "Start")) + "</button>" : '<button class="btn pri block" data-act="review">' + LT("▶ Ôn tập", "▶ Review") + '</button>') + "</section>"
  }

  function regionTabs(cur) {
   return '<nav class="rtabs" aria-label="' + LT("Chọn vùng", "Choose a region") + '">' + REGIONS.map(rg => {
    let ls = LESSONS.filter(l => l.reg === rg.id);
    return '<button class="' + (rg.id === cur ? "on" : "") + '" data-act="reg" data-id="' + rg.id + '" aria-pressed="' + (rg.id === cur) + '"><span>' + rg.emoji + "</span><small>" + ls.filter(lessonDone).length + "/" + ls.length + "</small></button>"
   }).join("") + "</nav>"
  }
  SC.home = function() {
   let nx = nextLesson(),
    name = Store.d.name || LT("bạn nhỏ", "friend"),
    has = id => LESSONS.some(l => l.reg === id),
    cur = [UI.reg, nx && nx.reg].find(id => id && has(id)) || REGIONS.find(r => has(r.id)).id,
    rg = REGIONS.find(r => r.id === cur),
    ls = LESSONS.filter(l => l.reg === cur),
    h = topbar(LT("Toán 4 Phiêu Lưu", "Math 4 Adventure"), LT("Xin chào " + name, "Hello, " + name), {
     right: pills(),
     logo: 1
    }) + "<main>";
   h += ctaCard(nx) + missionStrip(nx) + regionTabs(cur), h += '<section class="reg" style="--tint:var(' + rg.col + ')"><div>' + worldArt(rg.id) + '</div><header style="--hdc:' + regionColor(rg) + '"><span style="font-size:1.8rem">' + rg.emoji + '</span><h2 class="disp">' + rg.name + "</h2><small>" + ls.filter(lessonDone).length + "/" + ls.length + "</small></header>" + regionPath(rg, ls, nx) + "</section>", h += '<p class="muted" style="text-align:center;font-size:.9rem">' + LT("Phiên bản " + CONFIG.version + " · " + LESSONS.length + " bài học · " + CONFIG.curriculumNote, "Version " + CONFIG.version + " · " + LESSONS.length + " lessons · " + CONFIG.curriculumNote) + "</p></main>" + navbar("home"), app.innerHTML = h
  };
  SC.lesson = function(p) {
   let l = byId(p.id),
    s = Store.lesson(l.id),
    rg = REGIONS.find(r => r.id === l.reg),
    h = topbar(l.title, rg.name, {
     back: !0,
     right: pills()
    }) + "<main>";
   h += '<section class="card" style="background:' + regionColor(rg) + '"><div class="row">' + lessonIcon(l, "lg") + '<div><h2 class="disp">' + esc(l.title) + "</h2><div>" + esc(l.blurb) + "</div></div></div></section>";
   let more = "",
    need = l.links.map(byId),
    opens = LESSONS.filter(x => x.links.indexOf(l.id) >= 0);
   (need.length || opens.length) && (more += '<div class="muted" style="font-weight:800;margin-bottom:6px">' + LT("Liên kết kiến thức", "Related Topics") + '</div><div class="chips">', need.forEach(x => more += '<button class="chip" data-act="lesson" data-id="' + x.id + '" style="background:var(--b-soft)">' + LT("⬅ Cần: ", "⬅ Needs: ") + lessonIcon(x, "sm") + " " + esc(x.title) + "</button>"), opens.forEach(x => more += '<button class="chip" data-act="lesson" data-id="' + x.id + '" style="background:var(--g-soft)">' + LT("Mở ra: ", "Unlocks: ") + lessonIcon(x, "sm") + " " + esc(x.title) + " ➡</button>"), more += "</div>");
   let hasTh = !!(window.LY_THUYET && window.LY_THUYET[l.id]),
    hasAdv = advCount(l.id) > 0,
    tiersL = hasAdv ? [1, 2, 3, 4] : [1, 2, 3],
    qOpen = s.taught || Store.d.set.unlockAll,
    nextT = s.taught ? s.quick || s.pass[0] ? tiersL.map(t => [t, s.pass[t - 1]]).find(x => !x[1] && tierOpen(l, x[0])) : ["q"] : null,
    cta = "";
   cta = !s.taught && hasTh && !s.theory ? '<button class="btn pri block lcta" data-act="theory" data-id="' + l.id + '">' + LT("▶ Học lý thuyết", "▶ Learn the Idea") + '</button>' : !s.taught ? '<button class="btn pri block lcta" data-act="teach" data-id="' + l.id + '">' + LT("▶ Học cách làm", "▶ Learn How") + '</button>' : nextT && nextT[0] === "q" ? '<button class="btn pri block lcta" data-act="prac" data-id="' + l.id + '" data-t="0">' + LT("▶ Thử nhanh", "▶ Quick Try") + '</button>' : nextT ? '<button class="btn pri block lcta" data-act="prac" data-id="' + l.id + '" data-t="' + nextT[0] + '">' + (nextT[0] === 4 ? LT("▶ Ôn nâng cao", "▶ Advanced Review") : LT("▶ Luyện tập: ", "▶ Practice: ") + TIERS[nextT[0]].name) + "</button>" : "";
   let n = 0;
   h += cta, h += '<div class="steps">', hasTh && (h += '<button class="stp" data-act="theory" data-id="' + l.id + '"><span class="n" style="background:#D9C8FF">' + ++n + '</span><span class="grow"><b>' + LT("Học lý thuyết", "Learn the Idea") + '</b><small>' + LT("Hiểu bài bằng hình vẽ và ví dụ dễ", "Understand it with pictures and easy examples") + (s.theory ? LT(" · đã học ✓", " · learned ✓") : "") + '</small></span></button>'), h += '<button class="stp" data-act="teach" data-id="' + l.id + '"><span class="n" style="background:var(--yellow)">' + ++n + '</span><span class="grow"><b>' + LT("Học cách làm", "Learn How") + '</b><small>' + LT("Xem, cùng làm từng bước", "Watch and do it step by step together") + (s.taught ? LT(" · đã học ✓", " · learned ✓") : "") + '</small></span></button><button class="stp ' + (qOpen ? "" : "lock") + '" data-act="prac" data-id="' + l.id + '" data-t="0"><span class="n" style="background:var(--b-soft)">' + (qOpen ? ++n : (++n, "🔒")) + '</span><span class="grow"><b>' + LT("Thử nhanh", "Quick Try") + '</b><small>' + LT("1 câu tự làm", "1 question to try on your own") + (s.quick || s.pass[0] ? LT(" · đã qua ✓", " · passed ✓") : qOpen ? "" : LT(" · học cách làm trước", " · learn how first")) + "</small></span></button>", tiersL.forEach(t => {
    let T = TIERS[t],
     open = tierOpen(l, t),
     b = s.best[t - 1] || 0,
     adv = t === 4;
    ++n, h += '<button class="stp ' + (open ? "" : "lock") + '" data-act="prac" data-id="' + l.id + '" data-t="' + t + '"><span class="n ' + T.tag + '"' + (adv ? ' style="background:#B79CFF"' : "") + ">" + (open ? n : "🔒") + '</span><span class="grow"><b>' + (adv ? LT("Ôn nâng cao", "Advanced Review") : LT("Luyện tập: ", "Practice: ") + T.name) + "</b><small>" + LT(T.count + " câu · ", T.count + " questions · ") + T.desc + (open ? "" : adv ? LT(" · qua mức Khó để mở", " · pass the Hard level to unlock") : LT(" · làm xong mức trước để mở", " · finish the previous level to unlock")) + '</small></span><span class="st" style="display:flex">' + [0, 1, 2].map(i => starSvg(i < b).replace("<svg", '<svg width="22" height="22"')).join("") + "</span></button>"
   }), h += knownBtn(l, s) + "</div>", l.rule && (more += '<section class="rule"><h3 class="disp">' + esc(l.rule.h) + "</h3><ul>" + l.rule.items.map(i => "<li>" + rich(i) + "</li>").join("") + "</ul></section>"), more && (h += '<details class="more"><summary>' + LT("📚 Xem thêm: ghi nhớ và bài liên quan", "📚 See more: key points and related lessons") + '</summary>' + more + "</details>"), app.innerHTML = h + "</main>"
  };
  var Angle = {
   build(theta, opts) {
    opts = opts || {};
    let Ox = 180,
     Oy = 176,
     R = 150,
     els = [],
     pt = (deg, r) => [Ox + r * Math.cos(deg * Math.PI / 180), Oy - r * Math.sin(deg * Math.PI / 180)];
    els.push(E.path("half", "M" + (Ox - R) + " " + Oy + " A" + R + " " + R + " 0 0 1 " + (Ox + R) + " " + Oy + " Z", "#F4F8FF", "ink", {
     sw: 2.5
    }));
    for (let d = 0; d <= 180; d += 10) {
     let a = pt(d, R),
      b = pt(d, R - (d % 30 === 0 ? 16 : 9));
     if (els.push(E.line("t" + d, a[0], a[1], b[0], b[1], "ink", {
       sw: d % 30 === 0 ? 2.5 : 1.5
      })), d % 30 === 0 && d > 0 && d < 180) {
      let l = pt(d, R - 32);
      els.push(E.text("tl" + d, l[0], l[1] + 6, String(d), 15, "dark"))
     }
    }
    if (els.push(E.line("base", Ox, Oy, Ox + R, Oy, "blue", {
      sw: 6
     })), opts.fixed != null) {
     let f = pt(opts.fixed, R);
     els.push(E.line("fix", Ox, Oy, f[0], f[1], "blue", {
      sw: 6
     }))
    }
    let e = pt(theta, R - 4),
     a1 = pt(0, 48),
     a2 = pt(theta, 48),
     large = theta > 180 ? 1 : 0;
    els.push(E.path("arc", "M" + a1[0] + " " + a1[1] + " A48 48 0 " + large + " 0 " + a2[0].toFixed(1) + " " + a2[1].toFixed(1), "none", "pink", {
     sw: 5
    })), els.push(E.line("ray", Ox, Oy, e[0], e[1], "orange", {
     sw: 7
    })), els.push(E.circ("o", Ox, Oy, 7, "ink")), els.push(E.circ("hd", e[0], e[1], 13, "yellow", {
     sw: 3
    })), els.push(E.text("deg", 14, 36, Math.round(theta) + "°", 32, "red", {
     anchor: "start"
    }));
    let cls = Angle.cls(theta);
    return els.push(E.text("cls", 180, Oy + 30, cls, 22, "ink")), els
   },
   cls(t) {
    return t = Math.round(t), t === 90 ? LT("Góc vuông", "Right angle") : t === 180 ? LT("Góc bẹt", "Straight angle") : t < 90 ? t === 0 ? LT("Chưa có góc", "No angle yet") : LT("Góc nhọn", "Acute angle") : LT("Góc tù", "Obtuse angle")
   },
   mount(box, state) {
    let svg = mkSvg([360, 214], "");
    box.appendChild(svg), box.classList.add("noanim");
    let draw = () => paint(svg, Angle.build(state.theta, state), !0);
    draw();
    let drag = !1,
     ang = ev => {
      let r = svg.getBoundingClientRect(),
       sx = 360 / r.width,
       x = (ev.clientX - r.left) * sx,
       y = (ev.clientY - r.top) * sx,
       d = Math.atan2(176 - y, x - 180) * 180 / Math.PI;
      return d < 0 && (d = x < 180 ? 180 : 0), d = Math.max(0, Math.min(180, d)), state.snap ? Math.round(d / state.snap) * state.snap : Math.round(d)
     },
     move = ev => {
      if (!drag) return;
      let t = ang(ev);
      if (t !== state.theta) {
       let was = Angle.cls(state.theta);
       state.theta = t, draw(), Angle.cls(t) !== was && Sfx.pop(), state.onChange && state.onChange(t)
      }
      ev.preventDefault()
     };
    return svg.addEventListener("pointerdown", ev => {
     drag = !0;
     try {
      svg.setPointerCapture(ev.pointerId)
     } catch {}
     Sfx.init(), move(ev)
    }), svg.addEventListener("pointermove", move), svg.addEventListener("pointerup", () => {
     drag = !1
    }), svg.addEventListener("pointercancel", () => {
     drag = !1
    }), {
     set(t) {
      state.theta = t, draw()
     },
     get: () => state.theta
    }
   }
  };
  function thLesson(l0) {
   if (l0._th) return l0._th;
   let d = window.LY_THUYET[l0.id],
    figs = {},
    teach = d.pages.map((pg, i) => {
     let k = "p" + i;
     return figs[k] = () => RAWFIG([() => typeof pg.svg === "function" ? pg.svg() : pg.svg]), {
      key: k,
      f: 0,
      say: pg.say,
      ask: pg.ask
     }
    });
   return l0._th = {
    id: l0.id,
    title: l0.title,
    teach,
    figs,
    rule: d.memo ? {
     h: LT("Mẹo nhớ", "Remember"),
     items: [d.memo]
    } : null
   }
  }
  SC.teach = function(p) {
   let l0 = byId(p.id),
    l = p.th ? thLesson(l0) : l0;
   UI.teach = {
    l,
    th: !!p.th,
    i: 0,
    fig: null,
    key: null,
    inst: null,
    ok: {}
   }, app.innerHTML = topbar(p.th ? LT("Lý thuyết: " + l.title, "Idea: " + l.title) : LT("Học: " + l.title, "Learn: " + l.title), LT("Bài học", "Lesson"), {
    back: !0,
    right: '<button class="ibtn" data-act="say" aria-label="' + LT("Đọc to", "Read aloud") + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 9a4 4 0 010 6M18.5 6.5a8 8 0 010 11"/></svg></button>'
   }) + '<main class="two tteach"><div class="fig" id="figbox"></div><div class="say"><div id="mas">' + mascot("think") + '</div><div class="bub" id="bub"></div></div><div class="dots" id="tdots" style="flex:none"></div><div id="task"></div><div class="row"><button class="btn grow" data-act="tprev" id="tprev">' + LT("◀ Trước", "◀ Back") + '</button><button class="btn pri grow" data-act="tnext" id="tnext">' + LT("Tiếp ▶", "Next ▶") + '</button></div><div id="tend"></div></main>', teachShow()
  };

  function teachShow() {
   let T = UI.teach,
    l = T.l,
    st2 = l.teach[T.i],
    box = $("#figbox");
   if (!box) return;
   if (T.key !== st2.key) {
    box.innerHTML = "", box.classList.remove("noanim"), T.key = st2.key;
    let f = l.figs[st2.key]();
    f.angle ? (T.inst = Angle.mount(box, {
     theta: st2.theta != null ? st2.theta : f.start,
     snap: 1
    }), T.angle = !0) : (T.angle = !1, f.raw ? (T.fig = f, T.svg = null, box.innerHTML = f.frames[st2.f || 0]()) : (T.svg = mkSvg(f.vb, ""), box.appendChild(T.svg), T.fig = f, paint(T.svg, f.frames[st2.f || 0])))
   } else if (T.angle) {
    if (st2.theta != null) {
     let a = T.inst.get(),
      b = st2.theta,
      t0 = performance.now();
     a !== b && Sfx.pop();
     let tick = n => {
      let k = Math.min(1, (n - t0) / 600),
       e = 1 - Math.pow(1 - k, 3);
      T.inst.set(Math.round(a + (b - a) * e)), k < 1 && requestAnimationFrame(tick)
     };
     requestAnimationFrame(tick)
    }
   } else T.fig.raw ? (box.innerHTML = T.fig.frames[st2.f || 0](), Sfx.next()) : (paint(T.svg, T.fig.frames[st2.f || 0]), Sfx.next());
   let asked = st2.ask && !T.ok[T.i];
   $("#bub").innerHTML = rich(st2.say) + (st2.ask && T.ok[T.i] ? '<br><b style="color:var(--ok)">✅ ' + rich(st2.ask.good) + "</b>" : ""), $("#bub").classList.remove("pop"), $("#bub").offsetWidth, $("#bub").classList.add("pop"), $("#mas").innerHTML = mascot(asked ? "think" : "teach"), $("#tdots").innerHTML = l.teach.map((s, i) => '<i class="' + (i < T.i ? "ok" : i === T.i ? "cur" : "") + '"></i>').join(""), $("#tprev").disabled = T.i === 0;
   let last = T.i === l.teach.length - 1;
   $("#tnext").style.display = last ? "none" : "", $("#tnext").disabled = !!asked, $("#task").innerHTML = asked ? '<div class="card flat" style="background:var(--y-soft)"><b class="disp" style="font-size:1.1rem">✋ ' + LT("Cùng làm", "Let\'s do it together") + '</b>' + (function (a, say) { var q = a.q || ""; if (!q) { var t = String(say || ""), re = /(Cùng làm[^:]{0,12}|Let'?s [^:]{0,24}|Let us [^:]{0,20}):\s*/gi, m, last = -1; while ((m = re.exec(t))) last = re.lastIndex; if (last >= 0) q = t.slice(last); else { var ln = t.split(/\n/).pop(), m2 = ln.match(/^\s*(Thử xem|Thử|Hỏi nhanh|Try it|Try|Quick question)\s*:\s*(.+)$/i); if (m2) q = m2[2]; else { var ss = ln.split(/(?<=[.!?])\s+/).filter(function (x) { return /\?\s*$/.test(x) }); q = ss.length ? ss[ss.length - 1] : "" } } } return q ? '<div class="tq" style="margin-top:8px;padding:8px 12px;background:#fff;border:2px dashed var(--ink,#1F2A44);border-radius:12px;font-weight:800;font-size:1.15rem;line-height:1.35">❓ ' + rich(q) + '</div>' : "" })(st2.ask, st2.say) + '<div class="opts" style="margin-top:8px">' + st2.ask.opts.map(o => '<button class="opt" data-act="tans" data-o="' + esc(o).replace(/"/g, "&quot;") + '">' + rich(o) + "</button>").join("") + '</div><div id="tfb" style="margin-top:8px;font-weight:800"></div></div>' : "";
   let end = $("#tend");
   if (last) {
    let s = Store.lesson(l.id);
    T.th ? s.theory || (s.theory = 1, Store.save()) : s.taught || (s.taught = 1, Store.save()), end.innerHTML = (l.rule ? '<section class="rule"><h3 class="disp">' + esc(l.rule.h) + "</h3><ul>" + l.rule.items.map(i => "<li>" + rich(i) + "</li>").join("") + "</ul></section>" : "") + '<div class="row" style="margin-top:12px"><button class="btn grow" data-act="tagain">' + LT("↺ Xem lại", "↺ Watch again") + '</button>' + (T.th ? '<button class="btn grn grow" data-act="teach" data-id="' + l.id + '">' + LT("Học cách làm ▶", "Learn How ▶") + '</button>' : '<button class="btn grn grow" data-act="prac" data-id="' + l.id + '" data-t="0">' + LT("Thử nhanh ▶", "Quick Try ▶") + '</button>') + '</div>'
   } else end.innerHTML = "";
   speak(st2.say)
  }

  function newQ(q) {
   return q.st = {
    vals: q.parts.map(() => ({
     v: "",
     n: "",
     d: "",
     f: "n"
    })),
    act: 0,
    tries: 0,
    hint: 0,
    hf: !1,
    done: !1,
    fb: "",
    fbc: "",
    fbm: "think",
    img: null,
    strokes: null,
    res: null,
    diagErr: 0,
    lastDiag: ""
   }, q
  }

  function begin(cfg, l, qs) {
   Store.touchStreak(), qs.forEach(newQ), UI.prac = {
    l,
    t: cfg.n,
    cfg,
    qs,
    i: 0
   }, UI.stack = UI.stack.filter(s => s.n !== "prac" && s.n !== "result"), go("prac")
  }

  function startPrac(id, t) {
   let l = byId(id);
   if (t > 0 && !tierOpen(l, t)) {
    Sfx.lock(), toast(LT("Làm xong bước trước để mở mức này nhé", "Finish the previous step to unlock this level"));
    return
   }
   if (t === 0 && !(Store.lesson(id).taught || Store.d.set.unlockAll)) {
    Sfx.lock(), toast(LT("Con học cách làm trước nhé", "Learn how to do it first"));
    return
   }
   let cfg = TIERS[t],
    qs = makeSet(l, t || 1, Date.now() % 1000003).slice(0, cfg.count);
   begin(cfg, l, qs)
  }

  var KNOWN = {n: 3, name: LT("Bé đã biết", "I Know This"), tag: "t3", count: 3, need: 3, desc: LT("3 câu khó tự nhập số, đúng ngay lần đầu", "3 hard typed-answer questions, all right on the first try"), known: !0, maxDay: 3};
  function knownLeft(id) {
   let k = (Store.d.known = Store.d.known || {})[id], day = new Date().toDateString();
   return !k || k.day !== day ? KNOWN.maxDay : Math.max(0, KNOWN.maxDay - k.n)
  }
  function knownBtn(l, s) {
   if (l.optional && 0) return "";
   let done = s.known || s.pass[2] > 0 && s.pass[1] > 0 && s.pass[0] > 0;
   if (done) return "";
   let left = knownLeft(l.id);
   return '<button class="stp known ' + (left ? "" : "lock") + '" data-act="known" data-id="' + l.id + '"><span class="n" style="background:var(--g-soft)">✋</span><span class="grow"><b>' + LT("Bé đã biết", "I Know This") + '</b><small>' + (left ? LT("Làm đúng cả 3 câu khó (tự nhập số) ngay lần đầu để qua bài luôn", "Get all 3 hard typed-answer questions right on the first try to pass right away") : LT("Hôm nay hết lượt thử, mai thử lại nhé", "No tries left today. Try again tomorrow!")) + "</small></span></button>"
  }
  function startKnown(id) {
   let l = byId(id);
   if (!knownLeft(id)) {
    Sfx.lock(), toast(LT("Hôm nay con đã thử 3 lần rồi, học bài này hoặc mai thử lại nhé", "You've already tried 3 times today. Study this lesson or try again tomorrow."));
    return
   }
   /* v9: ưu tiên câu tự nhập số (không trắc nghiệm) để không qua bài nhờ đoán */
   let seed = Date.now() % 1000003,
    pool = makeSet(l, 3, seed).concat(makeSet(l, 3, seed + 7), makeSet(l, 3, seed + 19), makeSet(l, 2, seed + 13)),
    typed = pool.filter(q => q.parts.every(p => p.kind !== "choice")),
    qs = typed.concat(pool.filter(q => typed.indexOf(q) < 0)).filter((q, i, a) => a.findIndex(x => x.q === q.q) === i).slice(0, 3);
   begin(KNOWN, l, qs)
  }

  function startBoss(rid) {
   if (!bossOpen(rid)) {
    Sfx.lock(), toast(LT("Qua mức Dễ của mọi bài trong vùng để gặp trùm nhé", "Pass the Easy level of every lesson in this region to meet the boss."));
    return
   }
   let ls = LESSONS.filter(l => l.reg === rid && !l.optional),
    r = mkRng(Date.now() % 2147483647),
    qs = [],
    bt = [2, 2, 2, 3, 3];
   ls = r.shuffle(ls);
   for (let i = 0; i < CONFIG.boss.count; i++) {
    let l = ls[i % ls.length],
     q, g = 0, tt = bt[i] || 2;
    do q = l.gen(tt, r), g++; while (qs.some(x => x.q === q.q) && g < 20);
    q.lesson = l.id, q.tier = tt, qs.push(q)
   }
   begin(CONFIG.boss, {
    id: "boss_" + rid,
    title: window.BOSSNAME ? window.BOSSNAME(rid) : LT("Bài trùm", "Boss Level"),
    links: [],
    boss: rid
   }, qs)
  }

  function startReview() {
   let el = LESSONS.filter(l => Store.lesson(l.id).pass[0]);
   if (!el.length) {
    Sfx.lock(), toast(LT("Con làm xong một bài trước thì mới có bài để ôn nhé", "Finish a lesson first, then you'll have something to review."));
    return
   }
   let now = Date.now(),
    sc = l => (Store.d.mist[l.id] || 0) * 3 + Math.min(30, (now - Store.lesson(l.id).last) / 864e5),
    order = el.slice().sort((a, b) => sc(b) - sc(a)),
    r = mkRng(now % 2147483647),
    qs = [];
   for (let i = 0; i < CONFIG.review.count; i++) {
    let l = order[i % order.length],
     s = Store.lesson(l.id),
     q, g = 0;
    do q = l.gen(s.pass[1] ? 2 : 1, r), g++; while (qs.some(x => x.q === q.q) && g < 20);
    q.lesson = l.id, q.tier = s.pass[1] ? 2 : 1, qs.push(q)
   }
   begin(CONFIG.review, {
    id: "review",
    title: LT("Ôn tập", "Review"),
    links: [],
    review: !0
   }, qs)
  }
  var curQ = () => UI.prac.qs[UI.prac.i];
  SC.prac = function() {
   let q = curQ(),
    cfg = UI.prac.cfg,
    base = q.bonus ? q.of : q,
    h = '<div class="top"><button class="ibtn" data-act="leave" aria-label="' + LT("Thoát", "Exit") + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button><div class="dots">' + UI.prac.qs.filter(x => !x.bonus).map(x => '<i class="' + (x.w >= 1 || x.w > 0 ? "ok" : x.w === 0 ? "no" : x === base ? "cur" : "") + '"></i>').join("") + '</div><button class="ibtn" data-act="sayq" aria-label="' + LT("Đọc đề", "Read the question") + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 9a4 4 0 010 6M18.5 6.5a8 8 0 010 11"/></svg></button><span class="tag ' + cfg.tag + '">' + (q.bonus ? LT("Tương tự", "Similar") : cfg.name) + '</span></div><main class="two tprac">';
   if (h += '<div class="q">' + rich(q.q) + "</div>", q.fig && (h += '<div class="fig noanim" id="qfig"></div>'), h += '<div id="ans"></div></main>', app.innerHTML = h, q.fig) {
    let svg = mkSvg(q.fig.fb.vb, "");
    q.fig.fb.raw ? $("#qfig").innerHTML = q.fig.fb.frames[q.fig.f || 0]() : ($("#qfig").appendChild(svg), paint(svg, q.fig.fb.frames[q.fig.f], !0))
   }
   ansRender(), UI.prac.cfg.exam && window.EXAMTOP && window.EXAMTOP(), speak(q.q)
  };

  function fieldHtml(q, pi) {
   let p = q.parts[pi],
    s = q.st,
    v = s.vals[pi],
    ok = s.res && s.res[pi],
    cls = s.res ? ok ? " ok" : " no" : "";
   return p.kind === "choice" ? '<div class="part" style="flex-direction:column;align-items:stretch">' + (p.lab ? '<span class="lab">' + rich(p.lab) + "</span>" : "") + '<div class="opts">' + p.opts.map(o => '<button class="opt' + (v.v === o ? s.res ? ok ? " ok" : " no" : " sel" : "") + '" data-act="opt" data-p="' + pi + '" data-o="' + esc(o).replace(/"/g, "&quot;") + '">' + rich(o) + "</button>").join("") + "</div></div>" : p.kind === "frac" ? '<div class="part">' + (p.lab ? '<span class="lab">' + rich(p.lab) + "</span>" : "") + '<div class="field fr2' + cls + '"><div class="sub' + (s.act === pi && v.f === "n" && !s.done ? " act" : "") + '" data-act="pick" data-p="' + pi + '" data-f="n">' + (v.n || '<span class="ph">' + LT("tử", "num") + '</span>') + '</div><div class="bar"></div><div class="sub' + (s.act === pi && v.f === "d" && !s.done ? " act" : "") + '" data-act="pick" data-p="' + pi + '" data-f="d">' + (v.d || '<span class="ph">' + LT("mẫu", "den") + '</span>') + "</div></div></div>" : '<div class="part">' + (p.lab ? '<span class="lab">' + rich(p.lab) + "</span>" : "") + '<div class="field' + cls + (s.act === pi && !s.done ? " act" : "") + '" data-act="pick" data-p="' + pi + '">' + (v.v ? esc(fmt(v.v)) : '<span class="ph">?</span>') + "</div>" + (p.unit ? '<span class="unit">' + esc(p.unit) + "</span>" : "") + "</div>"
  }

  function ansRender() {
   let q = curQ(),
    s = q.st,
    box = $("#ans");
   if (!box) return;
   let needPad = q.parts.some(p => p.kind !== "choice"),
    h = "";
   if (s.img && (h += '<div class="card flat"><div class="muted" style="font-weight:800;margin-bottom:6px">' + LT("Bài làm của con", "Your work") + '</div><img class="snap" src="' + s.img + '" alt="' + LT("Bài làm của con", "Your work") + '"></div>'), s.hf && q.hintFig && (h += '<div class="fig noanim" id="hfig"></div>'), h += '<div class="parts">' + q.parts.map((_, i) => fieldHtml(q, i)).join("") + "</div>", s.fb && (h += '<div class="fb ' + s.fbc + ' fbm">' + mascot(s.fbm || "think") + "<div>" + s.fb + "</div></div>"), s.done) {
    if (UI.prac.cfg.exam) h += window.EXAMNAV ? window.EXAMNAV() : "";
    else {
    let wrong = s.res && s.res.some(x => !x);
    /* v9: sai 2 lần thì cách giải mẫu được gập lại, khuyến khích "Làm lại cùng Cú" trước */
    s.img ? h += compareHtml(q) : wrong && !q.bonus && !s.redone && byId(q.lesson) ? h += '<details class="v9-sol"><summary>📖 ' + LT("Xem cách giải mẫu", "See the sample solution") + "</summary>" + solHtml(q) + "</details>" : h += solHtml(q);
    /* v9: sai 2 lần → "Làm lại cùng Cú" rồi bắt buộc 1 câu tương tự (không bấm thẳng sang câu tiếp) */
    wrong && !q.bonus && byId(q.lesson) ? h += (s.redone ? "" : '<button class="btn pri block" data-act="redo">' + LT("✍️ Làm lại cùng Cú", "✍️ Redo it with Owl") + '</button>') + '<button class="btn ' + (s.redone ? "pri" : "blu") + ' block" data-act="twin">' + LT("🔁 Làm câu tương tự ▶", "🔁 Try a similar question ▶") + '</button>' : h += '<button class="btn pri block" data-act="next">' + (UI.prac.i === UI.prac.qs.length - 1 ? LT("Xem kết quả ▶", "See results ▶") : LT("Câu tiếp ▶", "Next question ▶")) + "</button>";
    let lk = byId(q.lesson),
     rv = lk && lk.links[0];
    wrong && rv && (h += '<button class="btn sm block" data-act="lesson" data-id="' + rv + '">' + LT("📖 Ôn lại: ", "📖 Review: ") + esc(byId(rv).title) + "</button>")
    }
   } else {
    let wk = q.work ? '<button class="btn sm grow" data-act="work" style="background:var(--g-soft)">' + (q.work.type === "bars" ? LT("📐 Vẽ sơ đồ", "📐 Draw diagram") : LT("🧮 Đặt tính", "🧮 Column method")) + "</button>" : "";
    h += '<div class="row"><button class="btn sm grow" data-act="ink" style="background:var(--b-soft)">✏️ ' + (s.img ? LT("Viết lại", "Rewrite") : LT("Nháp", "Scratch work")) + "</button>" + (window.InkNum && q.parts.some(p => p.kind !== "choice") ? '<button class="btn sm grow" data-act="inknum" style="background:#EDE4FF">' + LT("🔢 Viết số", "🔢 Write numbers") + '</button>' : "") + wk + (UI.prac.cfg.exam ? "" : '<button class="btn sm grow" data-act="hint" style="background:var(--y-soft)">' + LT("💡 Gợi ý", "💡 Hint") + (s.hint ? " " + Math.min(s.hint, 3) + "/3" : "") + "</button>") + "</div>", needPad ? h += '<div class="pad">' + ["7", "8", "9", "del", "4", "5", "6", "nx", "1", "2", "3", "0"].map(k => k === "del" ? '<button class="del" data-act="key" data-k="del" aria-label="' + LT("Xoá", "Delete") + '">⌫</button>' : k === "nx" ? '<button data-act="key" data-k="nx" aria-label="' + LT("Ô tiếp theo", "Next box") + '" style="font-size:1.05rem">' + LT("Ô sau", "Next") + '</button>' : '<button data-act="key" data-k="' + k + '">' + k + "</button>").join("") + '<button class="go" data-act="check" style="grid-column:span 4">' + LT("Kiểm tra", "Check") + '</button></div>' : h += '<button class="btn grn block" data-act="check">' + LT("Kiểm tra", "Check") + '</button>'
   }
   if (box.innerHTML = h, s.hf && q.hintFig) {
    let hf = $("#hfig");
    if (hf) {
     let svg = mkSvg(q.hintFig.fb.vb, "");
     hf.appendChild(svg), paint(svg, q.hintFig.fb.frames[q.hintFig.f], !!s.hfShown), s.hfShown = !0
    }
   }
  }

  function solHtml(q) {
   let h = '<div class="sol"><b>' + LT("Cách giải", "Solution") + '</b>' + q.steps.map((s, i) => '<div class="ln">' + (i + 1) + ". " + rich(s.t) + "</div>").join("");
   return h += '<div class="ln ans">' + LT("Đáp số: ", "Answer: ") + q.parts.map(p => (p.lab ? rich(p.lab) + " = " : "") + rich(ansText(p))).join(" · ") + "</div></div>", h
  }

  function maskStep(x) {
   if (x.v == null) return rich(x.t);
   let cands = [fmt(x.v), String(x.v)];
   for (let c of cands) {
    let e = c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
     re = new RegExp("(?<![\\d\\w])(?<!\\d[\\u00a0\\u202f ,.])(" + e + ")(?!\\d)(?![\\u00a0\\u202f ,.]\\d)(?!.*" + e + ")"),
     m = x.t.match(re);
    if (m) {
     let i = m.index;
     return rich(x.t.slice(0, i) + "▢" + x.t.slice(i + m[1].length))
    }
   }
   return rich(x.t)
  }

  function compareHtml(q) {
   let s = q.st,
    h = '<div class="card flat"><h2 class="disp" style="font-size:1.25rem;margin-bottom:6px">' + LT("So sánh với cách giải mẫu", "Compare with the sample solution") + '</h2><div class="muted" style="margin-bottom:8px">' + (q.steps.some(x => x.v != null) ? LT("Nhìn bài của con ở trên. Ô ▢ là kết quả của bước đó: con ghi số mình tính được, máy sẽ báo khớp hay chưa.", "Look at your work above. The ▢ box is the result of that step: enter the number you got, and the app will tell you whether it matches.") : LT("Nhìn bài của con ở trên và so với từng bước của cách giải mẫu.", "Look at your work above and compare it with each step of the sample solution.")) + '</div><div class="parts">';
   return q.steps.forEach((x, i) => {
    h += '<div class="stepchk" data-i="' + i + '"><div class="ln">' + (i + 1) + ". " + (s.res && s.res.every(Boolean) || x.v == null ? maskStepOrFull(x) : maskStep(x)) + "</div>" + (x.v != null ? '<label class="muted" style="font-size:.9rem">' + LT("Con tính được:", "You got:") + '</label><input class="mini" inputmode="numeric" data-sv="' + i + '" aria-label="' + LT("Số con tính được ở bước " + (i + 1), "Number you got in step " + (i + 1)) + '"><span class="sres" style="font-weight:800"></span>' : "") + "</div>"
   }), h += '<div class="sol" style="margin-top:10px"><div class="ln ans">' + LT("Đáp số: ", "Answer: ") + q.parts.map(p => (p.lab ? rich(p.lab) + " = " : "") + rich(ansText(p))).join(" · ") + "</div></div></div>", h + "</div>"
  }

  function maskStepOrFull(x) {
   return x.v == null ? rich(x.t) : maskStep(x)
  }

  function typeKey(k) {
   let q = curQ(),
    s = q.st;
   if (s.done) return;
   let pi = s.act;
   if (q.parts[pi].kind === "choice") {
    let nx = q.parts.findIndex(p2 => p2.kind !== "choice");
    if (nx < 0) return;
    pi = s.act = nx
   }
   let p = q.parts[pi],
    v = s.vals[pi];
   if (k === "nx") {
    if (p.kind === "frac" && v.f === "n") {
     v.f = "d";
     return
    }
    let j = pi + 1;
    for (; j < q.parts.length && q.parts[j].kind === "choice";) j++;
    j < q.parts.length && (s.act = j, q.parts[j].kind === "frac" && (s.vals[j].f = "n"));
    return
   }
   let field = p.kind === "frac" ? v.f === "n" ? "n" : "d" : "v";
   k === "del" ? v[field] = v[field].slice(0, -1) : v[field].length < 9 && (v[field] += k)
  }

  function submit() {
   let q = curQ(),
    s = q.st;
   for (let i = 0; i < q.parts.length; i++) {
    let p = q.parts[i],
     v = s.vals[i];
    if (p.kind === "choice" && !v.v) {
     toast(LT("Chọn một đáp án nhé", "Pick an answer"));
     return
    }
    if (p.kind === "frac" && (!v.n || !v.d)) {
     toast(LT("Điền cả tử số và mẫu số nhé", "Fill in both the numerator and the denominator"));
     return
    }
    if (p.kind === "num" && !v.v) {
     toast(LT("Nhập đáp án vào ô nhé", "Type your answer in the box"));
     return
    }
   }
   let res = q.parts.map((p, i) => {
     let v = s.vals[i];
     return checkPart(p, p.kind === "frac" ? {
      n: v.n,
      d: v.d
     } : v.v)
    }),
    ok = res.every(Boolean);
   if (UI.prac.cfg.exam) {
    s.xres = res, s.done = !0, q.w = ok ? 1 : 0, s.fb = LT("<b>✓ Đã ghi bài làm.</b> Con có thể làm câu khác.", "<b>✓ Your work is saved.</b> You can work on another question."), s.fbc = "info", s.fbm = "happy", Sfx.tap(), Store.save(), ansRender(), window.EXAMTOP && window.EXAMTOP();
    return
   }
   if (q.bonus || Store.d.stat.q++, s.lastDiag = "", ok) s.res = res, s.done = !0, q.hinted = s.hint > 0, q.bonus || (Store.d.stat.ok += 1), q.w = s.tries === 0 ? CONFIG.score.firstTry : CONFIG.score.secondTry, q.bonus ? (Store.d.twin.n++, Store.d.twin.ok++) : s.tries === 0 && Store.d.mist[q.lesson] > 0 && Store.d.mist[q.lesson]--, s.fb = "<b>" + (q.bonus ? LT("Con đã hiểu dạng này rồi! 🎉", "You've got this kind of problem now! 🎉") : pickR(PRAISE)) + "</b>" + (s.tries && !q.bonus ? LT(" (làm lại lần 2)", " (second try)") : "") + (q.parts.some((p, i) => p.kind === "frac" && !p.exact && s.vals[i] && gcd(+s.vals[i].n, +s.vals[i].d) > 1) ? "<br>💡 " + LT("Phân số này còn rút gọn được. Nhớ rút gọn đến phân số tối giản nhé!", "This fraction can still be simplified. Remember to reduce it to lowest terms!") : ""), s.fbc = "ok", s.fbm = "cheer", Sfx.ok(), Store.save();
   else {
    s.tries++, Sfx.bad();
    let dg = null;
    if (q.diag) try {
     dg = q.diag(s.vals, q)
    } catch {
     dg = null
    }
    dg && (s.lastDiag = dg.msg, s.errLogged || (s.errLogged = 1, Store.d.err[dg.kind] = (Store.d.err[dg.kind] || 0) + 1));
    let dgh = dg ? "<br>🔎 " + esc(dg.msg) : "";
    if (s.tries >= 2) s.res = res, s.done = !0, q.w = 0, q.bonus ? Store.d.twin.n++ : Store.d.mist[q.lesson] = (Store.d.mist[q.lesson] || 0) + 1, s.fb = LT("<b>Chưa đúng rồi.</b>", "<b>That's not right.</b>") + dgh + sdCheck(q) + (q.bonus ? LT("<br>Không sao, xem cách giải mẫu rồi mình đi tiếp nhé.", "<br>That's okay. Let's look at the sample solution and keep going.") : LT("<br>Không sao! Bấm <b>Làm lại cùng Cú</b> để làm từng bước nhé.", "<br>That's okay! Tap <b>Redo it with Owl</b> to go step by step.")), s.fbc = "no", s.fbm = "think", Store.save();
    else {
     s.fb = "<b>" + (dg ? LT("Chưa đúng, thử lại nhé!", "Not quite, try again!") : tryMsg(q, res)) + "</b>" + dgh + sdCheck(q) + (!dg && q.tip ? "<br>💡 " + rich(q.tip) : ""), s.fbc = "no", s.fbm = "think", q.parts.forEach((p, i) => {
      if (!res[i]) {
       let v = s.vals[i];
       v.v = "", v.n = "", v.d = "", v.f = "n"
      }
     });
     let first = res.findIndex(x => !x);
     s.act = first < 0 ? 0 : first
    }
   }
   ansRender(), ok && setTimeout(() => sparkAt("#ans .fb.ok .mascot"), 40), window.VO && !UI.prac.cfg.exam && window.VO.fb(s.fb, ok, s.tries)
  }

  /* v9: chỉ nói "gần đúng" khi đáp án thật sự gần (sai lệch ≤ 10% hoặc ≤ 2) */
  function tryMsg(q, res) {
   let close = q.parts.every((p, i) => res[i] || p.kind === "num" && (v => v !== "" && Math.abs(+v - +p.ans) <= Math.max(2, Math.abs(+p.ans) * .1))(normNum(q.st.vals[i].v)));
   return close ? TRYAGAIN[0] : pickR(TRYAGAIN.slice(1))
  }
  /* v9: bài tổng – hiệu: thử lại bằng chính hai số con nhập */
  function sdCheck(q) {
   let w = q.work;
   if (!w || w.type !== "bars" || q.parts.length < 2) return "";
   let a = normNum(q.st.vals[0].v), b = normNum(q.st.vals[1].v);
   if (a === "" || b === "") return "";
   let x = +a, y = +b;
   if (x + y !== w.S) return "<br>🧮 " + LT("Thử lại bằng số của con: " + fmt(x) + " + " + fmt(y) + " = <b>" + fmt(x + y) + "</b>, nhưng đề nói tổng là <b>" + fmt(w.S) + "</b>.", "Check with your numbers: " + fmt(x) + " + " + fmt(y) + " = <b>" + fmt(x + y) + "</b>, but the sum should be <b>" + fmt(w.S) + "</b>.");
   if (Math.abs(x - y) !== w.D) return "<br>🧮 " + LT("Thử lại: " + fmt(Math.max(x, y)) + " − " + fmt(Math.min(x, y)) + " = <b>" + fmt(Math.abs(x - y)) + "</b>, nhưng hiệu phải là <b>" + fmt(w.D) + "</b>.", "Check: " + fmt(Math.max(x, y)) + " − " + fmt(Math.min(x, y)) + " = <b>" + fmt(Math.abs(x - y)) + "</b>, but the difference should be <b>" + fmt(w.D) + "</b>.");
   return ""
  }

  function sparkAt(sel) {
   let e = document.querySelector(sel);
   if (!e) return;
   let r = e.getBoundingClientRect(),
    cx = r.left + r.width / 2,
    cy = r.top + r.height / 2,
    em = ["⭐", "✨", "🌟", "💫"];
   for (let i = 0; i < 10; i++) {
    let s = document.createElement("span");
    s.className = "spk", s.textContent = em[i % 4];
    let a = i / 10 * 6.283 + Math.random() * .5,
     d = 50 + Math.random() * 60;
    s.style.cssText = "left:" + cx + "px;top:" + cy + "px;--dx:" + Math.round(Math.cos(a) * d) + "px;--dy:" + Math.round(Math.sin(a) * d - 30) + "px;animation-delay:" + i * .02 + "s", document.body.appendChild(s), setTimeout(() => s.remove(), 1100)
   }
  }

  function openInk() {
   let q = curQ(),
    s = q.st;
   setTimeout(() => window.__inkSwitch && window.__inkSwitch(), 0), Ink.open({
    qHtml: rich(q.q),
    strokes: s.strokes || [],
    onDone: (img2, strokes) => {
     s.img = img2, s.strokes = strokes, s.fb = img2 ? LT("<b>Bài làm đã lưu.</b> Giờ nhập đáp án rồi bấm <b>Kiểm tra</b> để máy so với cách giải mẫu.", "<b>Your work is saved.</b> Now enter your answer and tap <b>Check</b> so the app can compare it with the sample solution.") : "", s.fbc = "info", s.fbm = "happy", ansRender()
    },
    onCancel: strokes => {
     s.strokes = strokes
    }
   })
  }
  window.__inkSwitch = function() {
   let row = document.querySelector(".inkwrap .inkhead .row");
   if (!row || !window.InkNum || row.querySelector(".inksw")) return;
   let q = curQ();
   if (!q.parts.some(p => p.kind !== "choice")) return;
   let b = document.createElement("button");
   b.className = "btn sm inksw", b.textContent = LT("🔢 Viết số", "🔢 Write numbers"), b.onclick = () => { Ink.cur && Ink.cur.close(), ACT.inknum() }, row.appendChild(b)
  };

  function nextQ() {
   UI.prac.i < UI.prac.qs.length - 1 ? (UI.prac.i++, replace("prac")) : finishPrac()
  }

  function finishPrac() {
   if (UI.prac.cfg.exam && window.EXAMFINISH) return window.EXAMFINISH(UI.prac);
   let cfg = UI.prac.cfg,
    real = UI.prac.qs.filter(q => !q.bonus),
    tot = real.reduce((a, q) => a + (q.w || 0), 0),
    ok = real.filter(q => q.w >= 1).length,
    pass = tot >= cfg.need,
    stars = tot >= cfg.count ? 3 : pass ? 2 : tot >= Math.max(.5, cfg.need - 1) ? 1 : 0,
    before = itemCount(),
    d = daily(),
    l = UI.prac.l,
    now = Date.now(),
    kind = "lesson";
   if (real.forEach(q => {
     q.lesson && byId(q.lesson) && (Store.lesson(q.lesson).last = now)
    }), l.boss) {
    kind = "boss";
    let old = Store.d.boss[l.boss] || 0;
    stars > old && (Store.d.boss[l.boss] = stars), pass && (d.ch = 1)
   } else if (l.review) kind = "review", pass && (d.rev = 1);
   else if (cfg.known) {
    kind = "known";
    let ls = Store.lesson(l.id), kk = (Store.d.known = Store.d.known || {})[l.id], day0 = new Date().toDateString();
    kk && kk.day === day0 ? kk.n++ : Store.d.known[l.id] = {day: day0, n: 1};
    pass && (ls.taught = 1, ls.quick = 1, ls.pass = [1, 1, 1], ls.known = 1, ls.best[0] = Math.max(ls.best[0], 2), ls.best[1] = Math.max(ls.best[1], 2), ls.best[2] = Math.max(ls.best[2], 2))
   } else {
    let ls = Store.lesson(l.id);
    if (UI.prac.t === 0) kind = "quick", pass && !ls.quick && (ls.quick = 1, d.nw = 1);
    else {
     let old = ls.best[UI.prac.t - 1];
     stars > old && (ls.best[UI.prac.t - 1] = stars), pass && (UI.prac.t === 1 && !ls.pass[0] && (d.nw = 1), ls.pass[UI.prac.t - 1] = 1, UI.prac.t === 3 && (d.ch = 1))
    }
   }
   let got = dailyCheck();
   Store.d.stars = totalStars(), Store.save();
   let after = itemCount(),
    items = ITEMS.slice(before, after);
   replace("result", {
    l,
    t: UI.prac.t,
    kind,
    cfg,
    tot,
    ok,
    pass,
    stars,
    count: cfg.count,
    items,
    got
   })
  }
  SC.result = function(r) {
   let l = r.l,
    nx = nextLesson(),
    h = '<div class="top"><div class="ttl"><small>' + esc(l.title) + " · " + r.cfg.name + '</small><b>' + LT("Kết quả", "Results") + '</b></div></div><main><section class="card resc" style="text-align:center"><div class="rays"></div><div class="big-stars">' + [0, 1, 2].map(i => starSvg(i < r.stars, i < r.stars ? "pop" : "").replace("<svg", '<svg style="animation-delay:' + i * .25 + 's"')).join("") + '</div><h2 class="disp" style="margin-top:10px">' + (r.stars === 3 ? LT("Hoàn hảo!", "Perfect!") : r.pass ? LT("Con đã vượt qua!", "You passed!") : gapMsg(r)) + '</h2><p style="font-size:1.2rem;margin:6px 0">' + LT("Đúng <b>" + r.ok + "/" + r.count + "</b> câu ngay lần đầu", "<b>" + r.ok + "/" + r.count + "</b> correct on the first try") + (r.tot % 1 ? LT(" · tổng điểm " + r.tot, " · total score " + r.tot) : "") + '</p><div style="width:110px;margin:0 auto">' + mascot(r.stars === 3 ? "wow" : r.pass ? "cheer" : "think") + "</div></section>";
   if (r.got && (h += LT('<div class="fb ok">🎉 Xong cả 3 nhiệm vụ hôm nay! Thưởng thêm 2 ⭐</div>', '<div class="fb ok">🎉 All 3 of today\'s missions are done! Bonus 2 ⭐</div>')), h += '<div class="parts">', r.kind === "quick") r.pass ? h += '<button class="btn pri block" data-act="prac" data-id="' + l.id + '" data-t="1">' + LT("Luyện mức Dễ ▶", "Practice Easy level ▶") + '</button>' : h += '<button class="btn blu block" data-act="teach" data-id="' + l.id + '">' + LT("📖 Xem lại cách làm", "📖 Review how to do it") + '</button><button class="btn block" data-act="prac" data-id="' + l.id + '" data-t="0">' + LT("Thử câu khác", "Try another question") + '</button>';
   else if (r.kind === "known") {
    let nx2 = nextLesson();
    r.pass ? (h += LT('<div class="fb ok">✋ Con đã biết rồi! Bài này được mở khoá hết. Cú sẽ hỏi lại sau 3 ngày cho chắc nhé.</div>', '<div class="fb ok">✋ You already know this! This lesson is fully unlocked.</div>'), nx2 && nx2 !== l && (h += '<button class="btn pri block" data-act="lesson" data-id="' + nx2.id + '">' + LT("Bài tiếp theo: ", "Next lesson: ") + esc(nx2.title) + " ▶</button>")) : h += LT('<div class="fb">Chưa sao! Mình cùng học bài này nhé.</div>', '<div class="fb">No worries! Let\'s learn this lesson together.</div>') + '<button class="btn pri block" data-act="teach" data-id="' + l.id + '">' + LT("📖 Học cách làm", "📖 Learn how") + '</button>' + (knownLeft(l.id) ? '<button class="btn block" data-act="known" data-id="' + l.id + '">' + LT('✋ Thử "Bé đã biết" lại', '✋ Try "I Know This" again') + '</button>' : '')
   }
   else if (r.kind === "lesson") {
    let nextT = r.t < 3 ? r.t + 1 : r.t === 3 && advCount(l.id) ? 4 : null;
    r.pass && nextT && (h += '<button class="btn pri block" data-act="prac" data-id="' + l.id + '" data-t="' + nextT + '">' + LT("Thử mức ", "Try level ") + TIERS[nextT].name + " ▶</button>"), r.pass && (!nextT || nextT === 4) && nx && nx !== l && (h += '<button class="btn pri block" data-act="lesson" data-id="' + nx.id + '">' + LT("Bài tiếp theo: ", "Next lesson: ") + esc(nx.title) + " ▶</button>"), r.pass || (h += '<button class="btn blu block" data-act="teach" data-id="' + l.id + '">' + LT("📖 Xem lại cách làm", "📖 Review how to do it") + '</button>'), h += '<button class="btn block" data-act="prac" data-id="' + l.id + '" data-t="' + r.t + '">' + LT("↺ Làm bộ đề mới", "↺ New set of questions") + '</button>'
   } else r.kind === "boss" ? h += '<button class="btn block" data-act="boss" data-id="' + l.boss + '">' + LT("↺ Gặp trùm lần nữa", "↺ Face the boss again") + '</button>' : h += '<button class="btn block" data-act="review">' + LT("↺ Ôn thêm bộ khác", "↺ Review another set") + '</button>';
   h += '<button class="btn block" data-act="homeBtn">' + LT("🏠 Về phòng nhân vật", "🏠 Back to the character room") + '</button></div></main>', app.innerHTML = h, window.VO && window.VO.result(r), r.pass ? (Sfx.win(), confetti()) : Sfx.bad(), r.stars > 0 && [0, 1, 2].forEach(i => i < r.stars && setTimeout(() => Sfx.star(i), 300 + i * 250))
  };

  function confetti() {
   let c = document.createElement("canvas");
   c.className = "confetti", document.body.appendChild(c);
   let w = c.width = innerWidth,
    h = c.height = innerHeight,
    x = c.getContext("2d"),
    cols = ["#FFD23F", "#FF8A3D", "#5CC98B", "#4DA3FF", "#FF6F91", "#A78BFA"],
    ps = [];
   for (let i = 0; i < (Store.d.set.reduceMotion ? 36 : 130); i++) {
    let side = i % 3;
    ps.push({
     x: side === 0 ? -10 : side === 1 ? w + 10 : Math.random() * w,
     y: side === 2 ? -20 - Math.random() * h * .4 : h * .55 + Math.random() * h * .2,
     vx: side === 0 ? 3 + Math.random() * 7 : side === 1 ? -3 - Math.random() * 7 : (Math.random() - .5) * 3,
     vy: side === 2 ? 2 + Math.random() * 4 : -8 - Math.random() * 9,
     g: .22,
     r: 6 + Math.random() * 8,
     c: cols[i % 6],
     a: Math.random() * 6,
     va: (Math.random() - .5) * .35,
     t: i % 4
    })
   }
   let t0 = performance.now();
   (function f(n) {
    x.clearRect(0, 0, w, h), ps.forEach(p => {
     if (p.vy += p.g, p.vy > 6 && (p.vy = 6), p.vx *= .992, p.x += p.vx, p.y += p.vy, p.a += p.va, x.save(), x.translate(p.x, p.y), x.rotate(p.a), x.fillStyle = p.c, p.t === 0) x.beginPath(), x.arc(0, 0, p.r / 2, 0, 6.3), x.fill();
     else if (p.t === 1) {
      x.beginPath();
      for (let k = 0; k < 10; k++) {
       let rr = k % 2 ? p.r * .4 : p.r * .95,
        an = k * Math.PI / 5;
       x.lineTo(Math.cos(an) * rr, Math.sin(an) * rr)
      }
      x.closePath(), x.fill()
     } else x.fillRect(-p.r / 2, -p.r / 3, p.r, p.r * .6);
     x.restore()
    }), n - t0 < 3400 ? requestAnimationFrame(f) : c.remove()
   })(t0)
  }

  function gapMsg(r) {
   let gap = Math.round((r.cfg.need - r.tot) * 2) / 2, gs = String(gap).replace(".", LT(",", "."));
   return r.tot > 0 && gap <= 1 ? LT("Con làm được rồi, chỉ thiếu " + (gap <= .5 ? "nửa điểm" : gs + " điểm") + " nữa thôi!", "You're so close, just " + (gap <= .5 ? "half a point" : gap === 1 ? "1 point" : gap + " points") + " to go!") : r.tot > 0 ? LT("Cố lên, mình luyện thêm nhé! Con còn thiếu " + gs + " điểm.", "Keep going, you're learning! You need " + gap + " more points.") : LT("Mình thử lại từ từ nhé!", "Let's try again, nice and slow!")
  }
  SC.stats = function() {
   let d = Store.d,
    acc = d.stat.q ? Math.round(d.stat.ok / d.stat.q * 100) : 0,
    got = itemCount(),
    ts = totalStars(),
    nextAt = got >= ITEMS.length ? 0 : got === 0 ? 1 : got * STARS_PER_ITEM + 1,
    mis = Object.keys(d.mist).filter(k => byId(k) && d.mist[k] > 0).sort((a, b) => d.mist[b] - d.mist[a]).slice(0, 4),
    errs = Object.keys(d.err || {}).filter(k => KIND_NAME[k]).sort((a, b) => d.err[b] - d.err[a]),
    h = topbar(LT("Thành tích", "Achievements"), LT("Hành trình của con", "Your journey"), {
     right: pills()
    }) + '<main><section class="card"><div class="row wrap" style="justify-content:space-around;text-align:center"><div><div class="disp" style="font-size:2.2rem">' + totalStars() + '</div>' + LT('⭐ sao', '⭐ stars') + '</div><div><div class="disp" style="font-size:2.2rem">' + d.streak.n + '</div>' + LT('🔥 ngày liên tiếp', '🔥 day streak') + '</div><div><div class="disp" style="font-size:2.2rem">' + acc + "%</div>" + LT("✅ làm đúng", "✅ correct") + "</div></div></section>";
   h += '<section class="card flat"><h2 class="disp" style="margin-bottom:4px">' + LT('Bộ sưu tập sao', 'Star collection') + '</h2><div class="muted" style="margin-bottom:8px">' + LT('Ngôi sao đầu tiên mở món quà đầu tiên, sau đó cứ ' + STARS_PER_ITEM + " ⭐ thêm một món (" + got + "/" + ITEMS.length + ")" + (nextAt ? ". Còn " + (nextAt - ts) + " ⭐ nữa là có món mới" : "") + '.', 'Your first star unlocks your first gift, then every ' + STARS_PER_ITEM + ' more ⭐ unlocks another (' + got + '/' + ITEMS.length + ')' + (nextAt ? '. Just ' + (nextAt - ts) + ' more ⭐ to unlock a new item' : '') + '.') + '</div><div class="coll">' + ITEMS.map((it, i) => '<div class="ci c' + i % 6 + " " + (i < got ? "" : "lock") + '"><b>' + rewardIcon(it) + "</b>" + (i < got ? esc(it.name) : "???") + "</div>").join("") + "</div></section>", h += '<section class="card flat"><h2 class="disp" style="margin-bottom:8px">' + LT('Các bài đã học', 'Lessons you finished') + '</h2><table class="t"><tbody>' + LESSONS.map(l => {
    let s = Store.lesson(l.id);
    return '<tr><td class="ti">' + lessonIcon(l, "sm") + "</td><td><b>" + esc(l.title) + "</b></td><td>" + [0, 1, 2].map(i => '<span class="tag t' + (i + 1) + '" style="padding:0 8px">' + (s.pass[i] ? s.best[i] + "★" : "–") + "</span>").join(" ") + "</td></tr>"
   }).join("") + "</tbody></table></section>", mis.length && (h += '<section class="card flat"><h2 class="disp" style="margin-bottom:8px">' + LT('Nên ôn lại', 'Time to review') + '</h2><div class="chips">' + mis.map(k => '<button class="chip" data-act="lesson" data-id="' + k + '">' + lessonIcon(byId(k), "sm") + " " + esc(byId(k).title) + LT(" · sai " + d.mist[k], " · missed " + d.mist[k]) + "</button>").join("") + "</div></section>"), h += '<section class="card flat"><h2 class="disp" style="margin-bottom:4px">' + LT('Dành cho phụ huynh', 'For parents') + '</h2><div class="muted" style="margin-bottom:8px">' + LT('Những kiểu sai bé hay mắc (máy nhận ra từ đáp án bé nhập):', 'Mistakes your child often makes (found from the answers they typed):') + '</div>' + (errs.length ? '<table class="t"><tbody>' + errs.map(k => "<tr><td><b>" + esc(KIND_NAME[k]) + '</b></td><td style="text-align:right">' + d.err[k] + LT(" lần", d.err[k] === 1 ? " time" : " times") + "</td></tr>").join("") + "</tbody></table>" : LT("<div>Chưa ghi nhận kiểu sai nào.</div>", "<div>No mistake patterns recorded yet.</div>")) + '<div class="muted" style="margin-top:8px">' + LT('Câu tương tự sau khi sai: làm đúng ' + d.twin.ok + "/" + d.twin.n + " câu.", 'Similar questions after a mistake: ' + d.twin.ok + '/' + d.twin.n + ' correct.') + "</div></section>", app.innerHTML = h + "</main>" + navbar("stats")
  };
  SC.settings = function() {
   let s = Store.d.set,
    sw = (k, lab, sub) => '<label class="sw"><input type="checkbox" data-set="' + k + '"' + (s[k] ? " checked" : "") + "><span><b>" + lab + "</b>" + (sub ? '<br><small class="muted">' + sub + "</small>" : "") + "</span></label>",
    ps = Store.profiles();
   app.innerHTML = topbar(LT("Cài đặt", "Settings"), LT("Dành cho bé và phụ huynh", "For kids and parents")) + "<main>" + modeSwitch("full") + '<section class="card flat"><h2 class="disp" style="font-size:1.25rem;margin-bottom:8px">' + LT('Hồ sơ của bé', 'Child profiles') + '</h2><div class="chips" style="margin-bottom:10px">' + ps.map(p => '<button class="chip' + (p.cur ? " on" : "") + '" data-act="prof" data-id="' + p.id + '">' + (p.cur ? "✓ " : "") + esc(p.name) + "</button>").join("") + '<button class="chip" data-act="profAdd" style="background:var(--g-soft)">' + LT('+ Thêm bé', '+ Add child') + '</button></div><label class="muted" style="font-weight:800">' + LT('Tên của bé đang học', 'Name of the child who is learning') + '</label><input class="txt" id="nm" value="' + esc(Store.d.name) + '" placeholder="' + LT('Tên bé', "Child's name") + '" maxlength="20">' + (ps.length > 1 ? '<button class="btn sm block" data-act="profDel" style="margin-top:10px;background:var(--p-soft)">' + LT('Xoá hồ sơ này', 'Delete this profile') + '</button>' : "") + '<p class="muted" style="font-size:.9rem;margin:8px 0 0">' + LT('Mỗi bé có sao, tiến độ và hồ sơ lỗi riêng.', 'Each child has their own stars, progress, and mistake history.') + '</p></section><section class="card flat"><h2 class="disp" style="font-size:1.25rem;margin-bottom:4px">' + LT('Sao lưu tiến độ', 'Back up progress') + '</h2><p class="muted" style="font-size:.9rem;margin:0 0 10px">' + LT('Tiến độ chỉ lưu trong máy. Gỡ app hoặc xoá dữ liệu là mất. Hãy sao lưu định kỳ (gồm mọi hồ sơ bé).', 'Progress is saved only on this device. If you delete the app or clear its data, it is lost. Back up regularly (this includes every child\'s profile).') + '</p><div class="parts"><button class="btn sm block" data-act="bkCode">' + LT('📋 Lấy mã sao lưu', '📋 Get backup code') + '</button><button class="btn sm block" data-act="bkFile">' + LT('⬇️ Tải file sao lưu', '⬇️ Download backup file') + '</button><button class="btn sm block" data-act="bkRestore" style="background:var(--y-soft)">' + LT('⬆️ Khôi phục từ mã hoặc file', '⬆️ Restore from code or file') + '</button></div></section><section class="card flat">' + sw("sound", LT("Hiệu ứng âm thanh", "Sound effects"), LT("Tiếng bút, đúng/sai, thưởng sao", "Pen sounds, right or wrong, star rewards")) + sw("reduceMotion", LT("Giảm hiệu ứng chuyển động", "Reduce motion"), LT("Tắt mây trôi, nhấp nháy, giảm pháo giấy. Nên bật nếu máy bị giật.", "Turns off drifting clouds and flashing, and reduces confetti. Turn this on if the device is laggy.")) + sw("voice", LT("Đọc to đề và lời hướng dẫn", "Read questions and hints aloud"), LT("Dùng giọng đọc tiếng Việt của điện thoại (nếu có). Mỗi câu hỏi cũng có nút loa để bé tự nghe lại.", "Uses your device's built-in voice (if available). Each question also has a speaker button to listen again.")) + sw("penOnly", LT("Khi dùng bút cảm ứng, bỏ qua ngón tay", "When using a stylus, ignore finger touches"), LT("Tránh lòng bàn tay chạm vào màn hình khi viết", "Keeps your palm from touching the screen while writing")) + sw("unlockAll", LT("Mở khoá tất cả bài (phụ huynh)", "Unlock all lessons (parents)"), LT("Bỏ qua thứ tự học, để xem hết nội dung", "Skip the lesson order to see all the content")) + '</section><section class="card flat"><button class="btn block" data-act="reset" style="background:var(--p-soft)">' + LT('Xoá toàn bộ tiến độ', 'Delete all progress') + '</button></section></main>' + navbar("settings")
  };

  function askName() {
   if (window.ASKNAME) return window.ASKNAME();
   sheet('<div class="welcome-art">' + worldBanner("splash") + mascot("cheer") + '</div><h2 class="disp" style="font-size:1.6rem;text-align:center">' + LT('Chào con! Mình là Cú Tí', 'Hi there! I\'m Tee the Owl') + '</h2>' + modeSwitch("compact") + '<p style="margin:0;text-align:center">' + LT('Con tên là gì nhỉ?', 'What\'s your name?') + '</p><input class="txt" id="nm0" placeholder="' + LT('Tên của con', "Your name") + '"  maxlength="20" autocomplete="off"><button class="btn pri block" id="nm0b">' + LT('Bắt đầu phiêu lưu ▶', 'Start the adventure ▶') + '</button>', (bg, close) => {
    $("#nm0b", bg).onclick = () => {
     Sfx.init(), Sfx.ok(), Store.d.name = ($("#nm0", bg).value || "").trim() || LT("bạn nhỏ", "friend"), Store.save(), close(), render()
    }
   })
  }
  var ACT = {
   back,
   tab(el) {
    Sfx.tap(), UI.stack = [{
     n: el.dataset.t
    }], render()
   },
   homeBtn() {
    UI.stack = [{
     n: "home"
    }], render()
   },
   lesson(el) {
    let l = byId(el.dataset.id);
    if (!unlocked(l)) {
     Sfx.lock();
     let n = l.links.map(byId).find(x => !lessonPassed(x.id, 1));
     toast(LT("Hãy làm xong bài “" + (n ? n.title : "trước") + "” (mức Dễ) để mở bài này", "Finish " + (n ? "“" + n.title + "”" : "the earlier lesson") + " (Easy level) to unlock this lesson"));
     return
    }
    Sfx.tap(), UI.stack = UI.stack.filter(s => s.n !== "prac" && s.n !== "result"), UI.stack[UI.stack.length - 1].n === "lesson" ? replace("lesson", {
     id: l.id
    }) : go("lesson", {
     id: l.id
    })
   },
   theory(el) {
    Sfx.tap(), UI.stack = UI.stack.filter(s => s.n !== "prac" && s.n !== "result"), go("teach", {
     id: el.dataset.id,
     th: 1
    })
   },
   teach(el) {
    Sfx.tap(), UI.stack = UI.stack.filter(s => s.n !== "prac" && s.n !== "result"), go("teach", {
     id: el.dataset.id
    })
   },
   prac(el) {
    Sfx.tap(), startPrac(el.dataset.id, +el.dataset.t)
   },
   known(el) {
    Sfx.tap(), startKnown(el.dataset.id)
   },
   prac2(el) {
    Sfx.tap(), startPrac(el.dataset.id, 3)
   },
   boss(el) {
    Sfx.tap(), startBoss(el.dataset.id)
   },
   review() {
    Sfx.tap(), startReview()
   },
   tnext() {
    UI.teach && UI.teach.i < UI.teach.l.teach.length - 1 && (UI.teach.i++, teachShow())
   },
   tprev() {
    UI.teach && UI.teach.i > 0 && (UI.teach.i--, teachShow())
   },
   tagain() {
    UI.teach.i = 0, teachShow(), window.scrollTo(0, 0)
   },
   tans(el) {
    let st2 = UI.teach.l.teach[UI.teach.i];
    if (el.dataset.o === st2.ask.ans) Sfx.ok(), UI.teach.ok[UI.teach.i] = 1, teachShow();
    else {
     Sfx.bad();
     let f = $("#tfb");
     f && (f.innerHTML = LT("Chưa đúng, con nhìn hình rồi thử lại nhé.", "Not quite. Look at the picture and try again.")), el.classList.add("shake"), setTimeout(() => el.classList.remove("shake"), 400)
    }
   },
   say() {
    UI.teach && speakNow(UI.teach.l.teach[UI.teach.i].say)
   },
   sayq() {
    speakNow(curQ().q)
   },
   leave() {
    ask(UI.prac && UI.prac.cfg.exam ? LT("Rời phòng thi? Bài thi này sẽ không được tính.", "Leave the exam room? This exam will not be counted.") : LT("Thoát bài luyện tập? Kết quả bộ đề này sẽ không được lưu.", "Quit practice? The results of this set won't be saved."), () => {
     UI.stack = UI.stack.filter(s => s.n !== "prac"), UI.prac = null, render()
    }, LT("Thoát", "Leave"), LT("Ở lại", "Stay"))
   },
   pick(el) {
    let q = curQ();
    if (q.st.done) return;
    let pi = +el.dataset.p;
    q.st.act = pi, el.dataset.f && (q.st.vals[pi].f = el.dataset.f), Sfx.tap(), ansRender()
   },
   opt(el) {
    let q = curQ();
    q.st.done || (q.st.vals[+el.dataset.p].v = el.dataset.o, Sfx.pop(), ansRender())
   },
   key(el) {
    Sfx.tap(), typeKey(el.dataset.k), ansRender()
   },
   check() {
    submit()
   },
   hint() {
    /* v9: gợi ý 3 tầng — 1 đọc đề · 2 hình/mẹo · 3 bước đầu có ô trống (không lộ đáp số) */
    let q = curQ(),
     s = q.st,
     arr = [],
     nums = (String(q.q).match(/\*\*([^*]+)\*\*/g) || []).map(x => x.replace(/\*\*/g, "")).slice(0, 4),
     asks = q.parts.map(p => p.lab).filter(Boolean),
     tipShown = s.tries > 0 && !s.lastDiag && q.tip,
     st0 = q.steps[0], st1 = q.steps[1];
    arr.push({t: (nums.length ? LT("Đề cho: **", "Given: **") + nums.join("**, **") + "**. " : LT("Đọc kĩ đề, gạch chân các số. ", "Read carefully and underline the numbers. ")) + (asks.length ? LT("Đề hỏi: ", "It asks for: ") + asks.join(", ") + "." : LT("Đề hỏi gì? Con tìm câu hỏi ở cuối đề.", "What does it ask? Look for the question at the end."))});
    let used0 = !1;
    q.hintFig ? arr.push({fig: 1, t: q.tip && !tipShown ? q.tip : LT("Nhìn hình này nhé.", "Look at this picture.")}) : q.tip && !tipShown ? arr.push({t: q.tip}) : st0 ? (used0 = !0, arr.push({h: LT("Bắt đầu từ bước 1: ", "Start with step 1: ") + maskStep(st0)})) : arr.push({t: LT("Con thử viết ra nháp từng bước nhé.", "Try writing each step on scratch paper.")});
    st0 && !used0 ? arr.push({h: LT("Làm bước 1 (điền ô trống): ", "Do step 1 (fill the blank): ") + maskStep(st0)}) : st1 && q.steps.length > 2 ? arr.push({h: LT("Bước 2 (điền ô trống): ", "Step 2 (fill the blank): ") + maskStep(st1)}) : arr.push({t: LT("Con làm tiếp bước còn lại, rồi thử lại kết quả nhé.", "Finish the last step, then check your answer.")});
    s.hint = Math.min(3, s.hint + 1);
    let i = s.hint - 1;
    (arr[i].fig || s.hf) && (s.hf = !0), s.fb = LT("<b>💡 Gợi ý " + (i + 1) + "/3:</b> ", "<b>💡 Hint " + (i + 1) + "/3:</b> ") + (arr[i].h || rich(arr[i].t)), s.fbc = "info", s.fbm = "think", Sfx.pop(), ansRender()
   },
   ink() {
    Sfx.tap(), openInk()
   },
   work() {
    let q = curQ(),
     s = q.st;
    Sfx.tap(), q.work.type === "col" ? Work.col(q, val => (s.vals[0].v = val, s.act = 0, submit(), {
     done: s.done,
     msg: s.lastDiag
    })) : q.work.type === "div" ? Work.div(q, (qt, rm) => {
     s.vals[0].v = String(qt), q.parts.length > 1 && (s.vals[1].v = String(rm)), s.act = 0, submit()
    }) : q.work.type === "mul2" ? Work.mul2(q, res => {
     s.vals[0].v = String(res), s.act = 0, submit()
    }) : Work.bars(q, () => {
     s.fb = LT("<b>Sơ đồ xong rồi!</b> Giờ con tính và nhập đáp án nhé.", "<b>Diagram done!</b> Now work it out and type your answer."), s.fbc = "ok", s.fbm = "cheer", ansRender()
    })
   },
   twin() {
    let q = curQ(),
     l = byId(q.lesson);
    if (!l) return;
    Sfx.tap();
    let nq, g = 0,
     r = mkRng(Date.now() % 2147483647);
    do nq = q.adv ? (a => a[r.int(0, a.length - 1)])(makeAdv(l, Date.now() % 1000003 + g * 31)) : l.gen(q.tier || 1, r), g++; while (nq.q === q.q && JSON.stringify(nq.parts) === JSON.stringify(q.parts) && g < 30);
    nq.lesson = l.id, nq.tier = q.tier, nq.bonus = !0, nq.of = q.of || q, newQ(nq), UI.prac.qs.splice(UI.prac.i + 1, 0, nq), UI.prac.i++, replace("prac"), toast(LT("Câu tương tự: làm đúng nghĩa là con đã hiểu!", "A similar question: getting it right means you understand!"))
   },
   next() {
    Sfx.next(), nextQ()
   },
   modePick(el) {
    let before = themeMode();
    if (setTheme(el.dataset.mode), themeMode() === before) return;
    Sfx.tap(), render(), document.querySelectorAll(".sheet-bg").forEach(syncModeSwitch);
    let owl = document.querySelector(".sheet-bg .mascot-img");
    owl && (owl.src = assetUrl(mascotPath(themeMode(), "cheer")))
   },
   reg(el) {
    UI.reg = el.dataset.id, Sfx.tap(), render()
   },
   reset() {
    ask(LT("Xoá hết sao và tiến độ của **" + esc(Store.d.name || "bé") + "**? Không khôi phục được (trừ khi đã sao lưu).", "Delete all stars and progress for **" + esc(Store.d.name || "this child") + "**? This can't be undone (unless you made a backup)."), () => {
     Store.reset(), toast(LT("Đã xoá", "Deleted")), UI.stack = [{
      n: "home"
     }], render()
    }, LT("Xoá hết", "Delete all"))
   },
   prof(el) {
    el.classList.contains("on") || (Sfx.tap(), Store.switchTo(el.dataset.id), toast(LT("Đã chuyển sang " + (Store.d.name || "hồ sơ mới"), "Switched to " + (Store.d.name || "new profile"))), render())
   },
   profAdd() {
    Sfx.tap(), Store.addProfile(), UI.stack = [{
     n: "home"
    }], render(), askName()
   },
   profDel() {
    ask(LT("Xoá hồ sơ của **" + esc(Store.d.name || "bé") + "**? Toàn bộ sao và tiến độ của hồ sơ này sẽ mất.", "Delete the profile of **" + esc(Store.d.name || "this child") + "**? All stars and progress in this profile will be lost."), () => {
     Store.removeProfile(Store.profiles().find(p => p.cur).id), toast(LT("Đã xoá hồ sơ", "Profile deleted")), render()
    }, LT("Xoá", "Delete"))
   },
   bkCode() {
    let c = "";
    try {
     c = Store.code()
    } catch {
     toast(LT("Không tạo được mã", "Couldn't create the code"));
     return
    }
    sheet('<h2 class="disp" style="font-size:1.35rem">' + LT('Mã sao lưu', 'Backup code') + '</h2><p class="muted" style="margin:0">' + LT('Sao chép đoạn mã này, gửi vào Zalo/email của phụ huynh để giữ. Khi cần, dán lại ở mục Khôi phục.', 'Copy this code and send it to a parent\'s email or messaging app to keep it. When you need it, paste it back in Restore.') + '</p><textarea class="txt" id="bkc" readonly rows="5" style="font-size:.75rem;word-break:break-all">' + esc(c) + '</textarea><button class="btn pri block" id="bkcp">' + LT('Sao chép', 'Copy') + '</button>', (bg, close) => {
     let ta = $("#bkc", bg);
     ta.focus(), ta.select(), $("#bkcp", bg).onclick = () => {
      ta.select();
      let ok = !1;
      try {
       ok = document.execCommand("copy")
      } catch {}
      navigator.clipboard && navigator.clipboard.writeText ? navigator.clipboard.writeText(c).then(() => toast(LT("Đã sao chép mã", "Code copied")), () => toast(ok ? LT("Đã sao chép mã", "Code copied") : LT("Hãy nhấn giữ vào ô mã để sao chép", "Press and hold the code box to copy it"))) : toast(ok ? LT("Đã sao chép mã", "Code copied") : LT("Hãy nhấn giữ vào ô mã để sao chép", "Press and hold the code box to copy it"))
     }
    })
   },
   bkFile() {
    try {
     let blob = new Blob([JSON.stringify(Store.exportAll())], {
       type: "application/json"
      }),
      a = document.createElement("a");
     a.href = URL.createObjectURL(blob), a.download = "toan4-sao-luu-" + todayStr() + ".json", document.body.appendChild(a), a.click(), setTimeout(() => {
      URL.revokeObjectURL(a.href), a.remove()
     }, 1500), toast(LT('Đã tạo file sao lưu. Nếu máy không tải được, dùng "Lấy mã sao lưu".', 'Backup file created. If your device can\'t download it, use "Get backup code".'))
    } catch {
     toast(LT("Máy không tải file được, hãy dùng mã sao lưu", "Your device can't download the file, so please use the backup code"))
    }
   },
   bkRestore() {
    sheet('<h2 class="disp" style="font-size:1.35rem">' + LT('Khôi phục tiến độ', 'Restore progress') + '</h2><p class="muted" style="margin:0">' + LT('Dán mã sao lưu (bắt đầu bằng T4PL1:) hoặc chọn file .json đã tải. <b>Mọi hồ sơ hiện tại sẽ được thay bằng bản sao lưu.</b>', 'Paste the backup code (starts with T4PL1:) or choose the .json file you downloaded. <b>All current profiles will be replaced by the backup.</b>') + '</p><textarea class="txt" id="rsc" rows="4" placeholder="' + LT('Dán mã vào đây', 'Paste the code here') + '" style="font-size:.8rem"></textarea><input type="file" id="rsf" accept=".json,application/json,text/plain" style="font-size:.9rem"><button class="btn pri block" id="rsb">' + LT('Khôi phục', 'Restore') + '</button>', (bg, close) => {
     let done = () => {
       close(), toast(LT("Đã khôi phục", "Restored")), UI.stack = [{
        n: "home"
       }], render()
      },
      fail = e => toast(e && e.message || LT("Mã hoặc file không hợp lệ", "The code or file isn't valid"));
     $("#rsf", bg).onchange = ev => {
      let f = ev.target.files[0];
      if (!f) return;
      let rd2 = new FileReader;
      rd2.onload = () => {
       try {
        Store.importAll(JSON.parse(rd2.result)), done()
       } catch (e) {
        fail(e)
       }
      }, rd2.readAsText(f)
     }, $("#rsb", bg).onclick = () => {
      let v = $("#rsc", bg).value.trim();
      if (!v) {
       toast(LT("Dán mã vào ô trước nhé", "Paste the code into the box first"));
       return
      }
      try {
       v.charAt(0) === "{" ? Store.importAll(JSON.parse(v)) : Store.fromCode(v), done()
      } catch (e) {
       fail(e)
      }
     }
    })
   }
  };
  document.addEventListener("click", e => {
   let el = e.target.closest("[data-act]");
   if (!el) return;
   Sfx.init();
   let f = ACT[el.dataset.act];
   f && f(el)
  });
  document.addEventListener("input", e => {
   let t = e.target;
   if (t.id === "nm") Store.d.name = t.value.trim(), Store.save();
   
   else if (t.dataset && t.dataset.sv != null && UI.prac) {
    let q = curQ(),
     i = +t.dataset.sv,
     row = t.closest(".stepchk"),
     res = $(".sres", row),
     want = q.steps[i].v,
     got = +normNum(t.value);
    if (!t.value) {
     row.classList.remove("ok", "no"), res.textContent = "";
     return
    }
    got === want ? (row.classList.add("ok"), row.classList.remove("no"), res.textContent = LT("✓ khớp", "✓ match"), $(".ln", row).innerHTML = i + 1 + ". " + rich(q.steps[i].t), Sfx.pop()) : (row.classList.add("no"), row.classList.remove("ok"), res.textContent = LT("✗ chưa khớp", "✗ no match"))
   }
  });
  document.addEventListener("change", e => {
   let k = e.target.dataset && e.target.dataset.set;
   k && (Store.d.set[k] = e.target.checked, Store.save(), Sfx.tap(), k === "voice" && e.target.checked && speakNow(LT("Xin chào, mình là Cú Tí", "Hello, I'm Tee the Owl")), k === "reduceMotion" && applyMotion())
  });
  Object.assign(globalThis, {
   KIND_NAME,
   finishPrac, begin, curQ, ask, makeSet, ansRender, mkRng, checkPart, ansText, fmt, startPrac, nextQ, newQ,
   SC, mascot, topbar, pills, starSvg, img, assetUrl, themeMode, setTheme, applyTheme, totalStars, lessonDone, unlocked, nextLesson, lessonPassed, bossOpen, tierOpen, REGIONS, ITEMS, ORDER, MODES, esc, rich, toast, Sfx, back, ctaCard, missionStrip, mascotPath, rewardPath, lessonIcon, speak, daily, CONFIG, TIERS,
   Store,
   FB,
   LESSONS,
   byId,
   go,
   render,
   replace,
   sheet,
   curQ,
   nextQ,
   startPrac,
   startBoss,
   startReview,
   confetti,
   ACT,
   Work,
   Ink,
   UI
  });
  for (let k of ["stack", "prac", "teach"]) Object.defineProperty(globalThis, k, {
   get: () => UI[k],
   set: v => {
    UI[k] = v
   },
   configurable: !0
  });
  document.body.insertAdjacentHTML("afterbegin", '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><linearGradient id="gStar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE680"/><stop offset="1" stop-color="#FFB000"/></linearGradient></defs></svg><div class="bgfx" aria-hidden="true"><i class="b1"></i><i class="b2"></i><i class="b3"></i></div>');
  window.onAndroidBack = function() {
   if (Work.cur) return Work.close(), !0;
   if (Ink.cur) return Ink.cur.close(), !0;
   let gf = $(".gift");
   if (gf) { let ok = gf.querySelector("[data-g=ok]"); return ok ? ok.click() : gf.remove(), !0 }
   let sh = $(".sheet-bg");
   if (sh) return sh.remove(), !0;
   let s = UI.stack[UI.stack.length - 1];
   return s.n === "prac" ? (ACT.leave(), !0) : s.n === "result" ? (UI.stack = [{
    n: "home"
   }], render(), !0) : UI.stack.length > 1 ? (back(), !0) : !1
  };
  document.addEventListener("visibilitychange", () => {
   if (document.hidden) {
    try {
     speechSynthesis.cancel()
    } catch {}
    Sfx.penStop()
   }
  });
  var booted = !1;

  function boot() {
   booted || (booted = !0, setNotifier(toast), applyMotion(), render(), Store.d.name || window.ASKNAME || askName())
  }
  document.addEventListener("DOMContentLoaded", boot);
  document.readyState !== "loading" && boot();
 })();
