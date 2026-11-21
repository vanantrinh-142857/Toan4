//# features/v92-real-problems.js — Bài toán thực tế và hình học theo chuỗi (v9.2)
//# Tự chứa trong một hàm bọc — chạy độc lập, không cần build.
/* ===== features/v92-real-problems.js =====
   Dữ liệu: du-lieu/bai-thuc-te.js (window.BAI_THUC_TE). Module làm 3 việc:
   1. Bài có "tier": trộn vào luyện tập mức Dễ/Vừa/Khó của đúng bài học (khoảng 3 câu trong 10).
   2. Bài có "rank" (adv): thêm vào ngân hàng Nâng cao của bài học (window.NANG_CAO).
   3. Thêm 2 chuyên đề trên Bản đồ: "Toán thực tế" (làm 5 bài theo nhóm) và "Hình học thực tế" (làm cả chuỗi Dễ → Vừa → Khó). */
(function () {
  "use strict";
  var G = window, D = G.BAI_THUC_TE, T = G.T4.T, SC = G.SC, esc = G.esc;
  if (!D || !D.items) return;
  var P_MIX = 0.3;
  var L = function () { return G.LANG === "en" ? "en" : "vi"; };
  var I = function () { return G.LANG === "en" ? 1 : 0; };
  var byItem = {}; D.items.forEach(function (b) { byItem[b.id] = b; });

  /* Đổi một bài trong dữ liệu thành câu hỏi của app (giống advQ trong core) */
  function toQ(b, tier) {
    var lg = L();
    var parts = b.parts.map(function (p) {
      var lab = p.lab ? p.lab[lg] : "";
      if (p.kind === "frac") return { lab: lab, ans: [p.ans[0], p.ans[1]], kind: "frac" };
      if (p.kind === "choice") { var o = p.opts[lg]; return { lab: lab, ans: o[p.ans], opts: o.slice(), kind: "choice" }; }
      return { lab: lab, ans: p.ans, unit: p.unit ? p.unit[lg] : "", kind: "num" };
    });
    return { q: b.q[lg], parts: parts, steps: (b.steps || []).map(function (s) { return { t: s[lg], v: null }; }), tip: b.tip ? b.tip[lg] : "", lesson: b.lesson, tier: tier || b.tier || 3, real: b.id };
  }

  /* 1. Trộn vào luyện tập theo bài và mức */
  var mix = {};
  D.items.forEach(function (b) { if (b.adv) return; var k = b.lesson + "|" + b.tier; (mix[k] = mix[k] || []).push(b); });
  var lessonIds = {}; Object.keys(mix).forEach(function (k) { lessonIds[k.split("|")[0]] = 1; });
  Object.keys(lessonIds).forEach(function (id) {
    var l = G.byId(id); if (!l) return;
    var old = l.gen;
    l.gen = function (tier, r) {
      var bank = mix[id + "|" + tier];
      if (bank && r.chance(P_MIX)) return toQ(r.pick(bank), tier);
      return old.call(l, tier, r);
    };
  });

  /* 2. Ngân hàng Nâng cao */
  var NC = G.NANG_CAO = G.NANG_CAO || {};
  D.items.forEach(function (b) {
    if (!b.adv) return;
    (NC[b.lesson] = NC[b.lesson] || []).push({ id: "tt-" + b.id, lesson: b.lesson, rank: b.rank, q: b.q, parts: b.parts, steps: b.steps, tip: b.tip, src: "Bài toán thực tế " + b.id });
  });

  /* 3. Hai chuyên đề riêng */
  var CD = G.CHUYEN_DE = G.CHUYEN_DE || [];
  var nReal = D.items.filter(function (b) { return b.group !== "H"; }).length, nGeo = D.chains.length;
  CD.push({ id: "thucte", icon: "🌏", rieng: 1, ten: ["Toán thực tế", "Real-life maths"], dang: ["Lịch sử – văn hóa · Khoa học · Kỹ thuật · Đời sống · Bản đồ, số liệu · Nâng cao", "History and culture · Science · Engineering · Everyday life · Maps and data · Challenge"], bai: [] });
  CD.push({ id: "hinhtt", icon: "📐", rieng: 1, ten: ["Hình học thực tế", "Geometry in real life"], dang: ["Mỗi chuỗi 3 bài cùng một tình huống: bài Vừa dùng lại bài Dễ, bài Khó dùng lại bài Vừa", "Each chain has 3 problems about one situation: Medium builds on Easy, Hard builds on Medium"], bai: [] });

  var prevMap = SC.map;
  SC.map = function () {
    var r = prevMap.apply(this, arguments);
    var a = document.querySelector('.cdrow[data-id="thucte"] small'), b = document.querySelector('.cdrow[data-id="hinhtt"] small');
    a && (a.textContent = T(nReal + " bài toán thực tế", nReal + " real-life problems"));
    b && (b.textContent = T(nGeo + " chuỗi · " + nGeo * 3 + " bài", nGeo + " chains · " + nGeo * 3 + " problems"));
    return r;
  };

  var tierName = function (k) { return [T("Dễ", "Easy"), T("Vừa", "Medium"), T("Khó", "Hard")][k - 1] || T("Khó", "Hard"); };
  var tierColor = ["#B8F0D2", "#FFE08A", "#FFC2D1"];
  var prevTopic = SC.topic;
  SC.topic = function (p) {
    if (!p || (p.id !== "thucte" && p.id !== "hinhtt")) return prevTopic.apply(this, arguments);
    var geo = p.id === "hinhtt", t = CD.filter(function (x) { return x.id === p.id; })[0];
    var h = G.topbar(t.icon + " " + t.ten[I()], T("Chuyên đề nâng cao", "Advanced topic"), { back: 1 }) + '<main class="cdpage">' +
      '<section class="card flat cdintro"><p class="muted" style="margin:0">' + esc(t.dang[I()]) + "</p></section>";
    if (geo) {
      D.chains.forEach(function (c, i) {
        h += '<section class="card flat cdcard"><h3>' + T("Chuỗi ", "Chain ") + (i + 1) + " · " + esc(c.ten[L()]) + '</h3><div class="cdsteps">';
        c.bai.forEach(function (id, k) {
          var b = byItem[id];
          h += '<div class="stp" style="cursor:default"><span class="n" style="background:' + tierColor[k] + '">' + (k + 1) + '</span><span class="grow"><b>' + tierName(k + 1) + "</b><small>" + esc(b.q[L()]) + "</small></span></div>";
        });
        h += '<button class="btn pri block" data-act="ttrun" data-k="c' + i + '" style="margin-top:8px">' + T("Làm cả chuỗi 3 bài", "Do all 3 in order") + "</button></div></section>";
      });
    } else {
      D.groups.forEach(function (g) {
        var n = D.items.filter(function (b) { return b.group === g.id; }).length;
        h += '<button class="lrow cdrow" data-act="ttrun" data-k="g' + g.id + '"><span class="bn">' + g.icon + '</span><span class="tx"><b>' + esc(g.ten[L()]) + '</b><small class="st9">' + T(n + " bài · mỗi lượt 5 bài", n + " problems · 5 per round") + '</small></span><span class="go">▶</span></button>';
      });
    }
    (G.app || document.getElementById("app")).innerHTML = h + "</main>";
  };

  G.ACT.ttrun = function (el) {
    var k = el.dataset.k, list, title;
    G.Sfx && G.Sfx.tap && G.Sfx.tap();
    if (k.charAt(0) === "c") {
      var c = D.chains[+k.slice(1)];
      list = c.bai.map(function (id, i) { return toQ(byItem[id], i + 1); });
      title = c.ten[L()];
    } else {
      var gid = k.slice(1), g = D.groups.filter(function (x) { return x.id === gid; })[0];
      var pool = D.items.filter(function (b) { return b.group === gid; }), r = G.mkRng(Date.now() % 2147483647);
      list = r.shuffle(pool.slice()).slice(0, 5).map(function (b) { return toQ(b, b.tier || 3); }).sort(function (a, b) { return a.tier - b.tier; });
      title = g.ten[L()];
    }
    var cfg = { n: 2, name: T("Toán thực tế", "Real-life maths"), tag: "t2", count: list.length, need: Math.max(1, Math.ceil(list.length * 0.6)) };
    G.begin(cfg, { id: "thucte", title: title, links: [], review: !0 }, list);
  };

  G.T4.realProblems = { toQ: toQ, data: D };
})();
