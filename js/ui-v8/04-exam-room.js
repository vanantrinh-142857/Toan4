//# Phòng thi từng vùng và Bài thi tổng hợp (tạo đề, chấm, chứng nhận)
//# Tự chứa trong một hàm bọc — chạy độc lập, không cần build.


/* ===== Toán 4 Phiêu Lưu – Phòng thi từng vùng + Bài thi tổng hợp ===== */
(function () {
  var G = globalThis, Store = G.Store, UI = G.UI, SC = G.SC, ACT = G.ACT, LESSONS = G.LESSONS;
  var esc = G.esc, rich = G.rich;
  var ZONES = ["so", "toan", "ps", "hinh"];
  var PASS = 8;
  var V8 = function () { return G.V8 || {}; };
  var T = function (k, d) { return V8().T ? V8().T(k, d) : d; };
  function D() { if (!Store.d.exam || typeof Store.d.exam !== "object") Store.d.exam = {}; return Store.d.exam; }
  function zoneName(id) { return id === "tong" ? LT("Bài thi tổng hợp", "Comprehensive Exam") : T("vung:" + id + ":ten", (G.REGIONS.find(function (r) { return r.id === id; }) || {}).name || id); }
  function lessonsOf(rid) { return LESSONS.filter(function (l) { return l.reg === rid && !l.optional; }); }
  function open(id) {
    if (Store.d.set.unlockAll) return true;
    if (id === "tong") return ZONES.every(function (z) { var e = D()[z]; return e && e.best >= PASS; });
    return lessonsOf(id).every(function (l) { return Store.lesson(l.id).pass[1] > 0; });
  }
  function lockText(id) {
    if (id === "tong") return LT("Đạt từ " + PASS + " điểm ở cả 4 phòng thi để mở", "Score at least " + PASS + " points in all 4 exam rooms to unlock");
    var miss = lessonsOf(id).filter(function (l) { return !(Store.lesson(l.id).pass[1] > 0); });
    return LT("Qua mức Vừa của mọi bài trong vùng để mở (còn " + miss.length + " bài)", "Pass the Medium level of every lesson in this region to unlock (" + miss.length + (miss.length === 1 ? " lesson" : " lessons") + " left)");
  }
  function medal(score, id) { return score >= 10 ? (id === "tong" ? "💎" : "🥇") : score >= 9 ? "🥈" : score >= PASS ? "🥉" : ""; }
  function medalName(score, id) { return score >= 10 ? (id === "tong" ? LT("Huy chương Kim cương", "Diamond Medal") : LT("Huy chương Vàng", "Gold Medal")) : score >= 9 ? LT("Huy chương Bạc", "Silver Medal") : score >= PASS ? LT("Huy chương Đồng", "Bronze Medal") : ""; }
  function fmtScore(x) { return String(Math.round(x * 2) / 2).replace(".", LT(",", ".")); }
  var rng = function () { return G.mkRng((Date.now() ^ (Math.random() * 1e9)) >>> 0); };

  /* ---------- tạo đề ---------- */
  function genQ(l, t, r, seen, want) {
    var q = null;
    for (var g = 0; g < (want ? 150 : 40); g++) {
      var c = l.gen(t, r);
      if (/⭐/.test(c.q)) continue;
      if (want === "choice" && !c.parts.every(function (p) { return p.kind === "choice"; })) continue;
      if (want === "write" && c.parts.every(function (p) { return p.kind === "choice"; })) continue;
      var key = c.q + JSON.stringify(c.parts);
      if (seen[key]) continue;
      q = c; seen[key] = 1; break;
    }
    if (!q) { q = l.gen(t, r); if (/⭐/.test(q.q)) q = l.gen(Math.max(1, t - 1), r); }
    q.lesson = l.id; q.tier = t; return q;
  }
  var CC = {};
  function canChoice(l) {
    if (CC[l.id] != null) return CC[l.id];
    var r = G.mkRng(12345), n = 0;
    for (var t = 1; t <= 2; t++) for (var k = 0; k < 40; k++) { var q = l.gen(t, r); if (!/⭐/.test(q.q) && q.parts.every(function (p) { return p.kind === "choice"; })) n++; }
    return (CC[l.id] = n >= 8);
  }
  var CW = {};
  function canWrite(l, t) {
    var k = l.id + ":" + t;
    if (CW[k] != null) return CW[k];
    var r = G.mkRng(54321), n = 0;
    for (var i = 0; i < 40; i++) { var q = l.gen(t, r); if (!/⭐/.test(q.q) && q.parts.some(function (p) { return p.kind !== "choice"; })) n++; }
    return (CW[k] = n >= 12);
  }
  function build(id) {
    var r = rng(), seen = {}, qs = [];
    if (id !== "tong") {
      var ls = r.shuffle(lessonsOf(id)), tiers = [1, 1, 1, 1, 2, 2, 2, 2, 3, 3];
      tiers.forEach(function (t, i) { qs.push(genQ(ls[i % ls.length], t, r, seen)); });
      return qs;
    }
    var isC = function (q) { return q.parts.every(function (p) { return p.kind === "choice"; }); };
    /* Phần 1: chia đều theo vùng (vùng nào có bài trắc nghiệm), xoay vòng bài trong vùng */
    var zc = r.shuffle(ZONES.filter(function (z) { return lessonsOf(z).some(function (l) { return !l.optional && canChoice(l); }); })), pool = {};
    zc.forEach(function (z) { pool[z] = r.shuffle(lessonsOf(z).filter(function (l) { return !l.optional && canChoice(l); })); });
    for (var j = 0, ci = {}; qs.length < 8 && j < 80; j++) {
      var z = zc[j % zc.length]; ci[z] = (ci[z] || 0);
      var q = genQ(pool[z][ci[z]++ % pool[z].length], qs.length < 5 ? 1 : 2, r, seen, "choice");
      if (isC(q) || j >= 70) { q.part = 1; qs.push(q); }
    }
    /* Phần 2: mỗi vùng 3 câu (Dễ, Vừa, Khó), chỉ lấy bài thật sự có ô tự làm ở mức đó */
    ZONES.forEach(function (z) {
      var zl = r.shuffle(lessonsOf(z).filter(function (l) { return !l.optional; })), used = {};
      [1, 2, 3].forEach(function (t, k) {
        var cand = zl.filter(function (l) { return canWrite(l, t) && !used[l.id]; });
        if (!cand.length) cand = zl.filter(function (l) { return canWrite(l, t); });
        var l = (cand.length ? cand : zl)[0]; used[l.id] = 1;
        var q2 = genQ(l, t, r, seen, "write"); q2.part = 2; qs.push(q2);
      });
    });
    return qs;
  }
  function limitOf(id, qs) {
    if (id === "tong") return (G.TIMER ? G.TIMER.examMin() : 40) * 60;
    var sum = qs.reduce(function (a, q) { return a + (G.TIMER ? G.TIMER.secOf(q.lesson, q.tier) : 90); }, 0);
    return Math.max(600, Math.min(1200, Math.round(sum * 0.8 / 60) * 60));
  }
  function start(id) {
    if (!open(id)) { G.Sfx.lock(); G.toast(lockText(id)); return; }
    var qs = build(id), cfg = { n: 2, name: id === "tong" ? LT("Thi tổng hợp", "Comprehensive Exam") : LT("Phòng thi", "Exam Room"), tag: "t3", count: qs.length, need: Math.ceil(qs.length * PASS / 10), exam: true, examId: id, limit: limitOf(id, qs) };
    G.begin(cfg, { id: "exam_" + id, title: id === "tong" ? LT("Bài thi tổng hợp", "Comprehensive Exam") : LT("Phòng thi: " + zoneName(id), "Exam Room: " + zoneName(id)), examId: id }, qs);
  }
  function intro(id) {
    var ok = open(id), e = D()[id], n = id === "tong" ? 20 : 10;
    var mins = id === "tong" ? (G.TIMER ? G.TIMER.examMin() : 40) : "10–20";
    G.sheet('<div class="xintro"><div style="font-size:3rem">' + (id === "tong" ? "🏆" : "📝") + '</div><h2 class="disp">' + esc(id === "tong" ? LT("Bài thi tổng hợp", "Comprehensive Exam") : LT("Phòng thi: " + zoneName(id), "Exam Room: " + zoneName(id))) + "</h2>" +
      LT('<ul class="xrules"><li><b>' + n + " câu</b>" + (id === "tong" ? " (Phần 1: 8 câu trắc nghiệm · Phần 2: 12 câu tự làm)" : " của mọi bài trong vùng") + "</li><li>⏱ Làm trong <b>" + mins + " phút</b>. Hết giờ tự nộp bài.</li><li>Không có Gợi ý. Mỗi câu chỉ làm <b>một lần</b>.</li><li>Được dùng bảng nháp, viết tay và đặt tính.</li><li>Chạm số câu ở trên cùng để chuyển câu.</li><li>Đạt từ <b>" + PASS + " điểm</b> (thang 10) là qua" + (id === "tong" ? " và nhận <b>phần thưởng lớn</b> + Giấy khen!" : " và nhận huy chương.") + "</li></ul>", '<ul class="xrules"><li><b>' + n + " questions</b>" + (id === "tong" ? " (Part 1: 8 multiple-choice · Part 2: 12 write-in)" : " from every lesson in the region") + "</li><li>⏱ You have <b>" + mins + " minutes</b>. Your exam is turned in automatically when time is up.</li><li>No Hints. You get <b>one try</b> per question.</li><li>You can use scratch paper, handwriting, and written calculations.</li><li>Tap the question numbers at the top to switch questions.</li><li>Score at least <b>" + PASS + " points</b> (out of 10) to pass" + (id === "tong" ? " and earn a <b>big reward</b> + a Certificate!" : " and earn a medal.") + "</li></ul>") +
      (e ? LT('<div class="muted" style="margin:6px 0">Điểm cao nhất: <b>' + fmtScore(e.best) + "</b> " + medal(e.best, id) + " · đã thi " + e.tries + " lần</div>", '<div class="muted" style="margin:6px 0">Best score: <b>' + fmtScore(e.best) + "</b> " + medal(e.best, id) + " · taken " + e.tries + (e.tries === 1 ? " time" : " times") + "</div>") : "") +
      (ok ? LT('<button class="btn pri block" id="xgo">Bắt đầu thi ▶</button>', '<button class="btn pri block" id="xgo">Start Exam ▶</button>') : '<div class="fb">🔒 ' + esc(lockText(id)) + "</div>") + LT('<button class="btn block" id="xno" style="margin-top:8px">Để sau</button></div>', '<button class="btn block" id="xno" style="margin-top:8px">Maybe later</button></div>'), function (bg, close) {
      bg.querySelector("#xno").onclick = close;
      var b = bg.querySelector("#xgo");
      b && (b.onclick = function () { close(); G.Sfx.tap(); start(id); });
    });
  }

  /* ---------- trong lúc thi ---------- */
  function P() { return UI.prac; }
  function answered(q) { return q.st && q.st.done; }
  window.EXAMTOP = function () {
    var p = P(); if (!p || !p.cfg.exam) return;
    var top = document.querySelector(".top"); if (!top) return;
    var dots = top.querySelector(".dots"); dots && (dots.style.display = "none");
    var tag = top.querySelector(".tag"); tag && (tag.style.display = "none");
    var nav = document.getElementById("xnav");
    if (!nav) { nav = document.createElement("div"); nav.id = "xnav"; nav.className = "xnav"; top.parentNode.insertBefore(nav, top.nextSibling); }
    var q = p.qs[p.i];
    nav.innerHTML = (q.part ? LT('<span class="xpart">Phần ' + q.part + (q.part === 1 ? " · Trắc nghiệm" : " · Tự làm") + "</span>", '<span class="xpart">Part ' + q.part + (q.part === 1 ? " · Multiple choice" : " · Write-in") + "</span>") : "") + '<div class="xdots">' + p.qs.map(function (x, i) { return '<button class="' + (i === p.i ? "cur" : answered(x) ? "done" : "") + '" data-act="xjump" data-i="' + i + '">' + (i + 1) + "</button>"; }).join("") + "</div>";
    var cur = nav.querySelector(".cur"); cur && cur.scrollIntoView && cur.scrollIntoView({ inline: "center", block: "nearest" });
    if (!document.getElementById("xsub")) {
      var b = document.createElement("button"); b.id = "xsub"; b.className = "btn sm xsub"; b.setAttribute("data-act", "xsubmit"); b.textContent = LT("📤 Nộp", "📤 Submit");
      top.appendChild(b);
    }
  };
  window.EXAMNAV = function () {
    var p = P(), left = p.qs.filter(function (q) { return !answered(q); }).length;
    return left ? LT('<div class="muted" style="text-align:center;margin:6px 0">Còn <b>' + left + "</b> câu chưa làm</div>", '<div class="muted" style="text-align:center;margin:6px 0"><b>' + left + "</b> " + (left === 1 ? "question" : "questions") + " left to answer</div>") + LT('<button class="btn pri block" data-act="xnext">Câu tiếp ▶</button>', '<button class="btn pri block" data-act="xnext">Next Question ▶</button>')
      : LT('<div class="fb ok">Con đã làm hết ' + p.qs.length + ' câu! Kiểm tra lại nếu muốn, rồi nộp bài nhé.</div><button class="btn pri block" data-act="xsubmit">📤 Nộp bài</button>', '<div class="fb ok">You answered all ' + p.qs.length + ' questions! Check your answers if you like, then turn in your exam.</div><button class="btn pri block" data-act="xsubmit">📤 Turn In Exam</button>');
  };
  ACT.xjump = function (el) { var p = P(); if (!p) return; G.Sfx.tap(); p.i = +el.dataset.i; G.replace("prac"); };
  ACT.xnext = function () {
    var p = P(); if (!p) return;
    for (var k = 1; k <= p.qs.length; k++) { var j = (p.i + k) % p.qs.length; if (!answered(p.qs[j])) { p.i = j; G.Sfx.tap(); G.replace("prac"); return; } }
    ACT.xsubmit();
  };
  ACT.xsubmit = function () {
    var p = P(); if (!p) return;
    var left = p.qs.filter(function (q) { return !answered(q); }).length;
    G.ask(left ? LT("Còn " + left + " câu chưa làm. Con có chắc muốn nộp bài?", left + (left === 1 ? " question is" : " questions are") + " still unanswered. Are you sure you want to turn in your exam?") : LT("Nộp bài thi bây giờ nhé?", "Turn in your exam now?"), function () { G.finishPrac(); }, LT("Nộp bài", "Turn In"), LT("Làm tiếp", "Keep Going"));
  };

  /* ---------- chấm điểm ---------- */
  window.EXAMFINISH = function (p) {
    if (p._xdone) return; p._xdone = 1;
    var id = p.cfg.examId, n = p.qs.length, ok = p.qs.filter(function (q) { return q.w >= 1; }).length;
    var score = Math.round(ok / n * 10 * 2) / 2;
    G.TIMER && p._tm && G.TIMER.record(p);
    var used = p._tm ? Math.round(p._tm.used / 1000) : 0;
    var e = D()[id] || { best: 0, tries: 0 };
    var isNew = score > e.best;
    e.tries++; e.last = score; e.best = Math.max(e.best, score); e.at = Date.now(); if (isNew) e.bestUsed = used;
    D()[id] = e; Store.d.stars = G.totalStars(); Store.save();
    G.replace("examres", { id: id, score: score, ok: ok, n: n, used: used, limit: p.cfg.limit, isNew: isNew });
  };
  SC.examres = function (r) {
    var p = P(), id = r.id, pass = r.score >= PASS, md = medal(r.score, id);
    var weak = {}; p.qs.forEach(function (q) { if (!(q.w >= 1) && q.lesson) weak[q.lesson] = (weak[q.lesson] || 0) + 1; });
    var h = '<div class="top"><div class="ttl"><small>' + esc(id === "tong" ? LT("Bài thi tổng hợp", "Comprehensive Exam") : LT("Phòng thi: " + zoneName(id), "Exam Room: " + zoneName(id))) + LT('</small><b>Kết quả bài thi</b></div></div><main>', '</small><b>Exam Results</b></div></div><main>') +
      '<section class="card resc xres" style="text-align:center"><div class="rays"></div><div class="xscore">' + fmtScore(r.score) + LT('<small>/10 điểm</small></div>', '<small>/10 points</small></div>') +
      (md ? '<div class="xmedal">' + md + '</div><h2 class="disp">' + medalName(r.score, id) + "!</h2>" : LT('<h2 class="disp">Chưa đạt rồi – cố lên!</h2>', '<h2 class="disp">Not there yet – keep going!</h2>')) +
      LT('<p style="font-size:1.1rem;margin:6px 0">Đúng <b>' + r.ok + "/" + r.n + "</b> câu · ⏱ ", '<p style="font-size:1.1rem;margin:6px 0">Correct: <b>' + r.ok + "/" + r.n + "</b> questions · ⏱ ") + (G.TIMER ? G.TIMER.fmt(r.used) : r.used + "s") + " / " + (G.TIMER ? G.TIMER.fmt(r.limit) : "") + "</p>" +
      (r.isNew && r.score > 0 ? LT('<div class="muted">🎉 Điểm cao nhất mới!</div>', '<div class="muted">🎉 New best score!</div>') : "") + "</section>";
    if (id === "tong" && pass) h += LT('<button class="btn pri block" data-act="xcert">📜 Nhận Giấy khen</button>', '<button class="btn pri block" data-act="xcert">📜 Get Certificate</button>');
    var wk = Object.keys(weak);
    if (wk.length) h += LT('<section class="card flat"><h3 class="disp" style="font-size:1.1rem">Bài cần ôn thêm</h3><div class="chips">', '<section class="card flat"><h3 class="disp" style="font-size:1.1rem">Lessons to review</h3><div class="chips">') + wk.map(function (k) { var l = G.byId(k); return '<button class="chip" data-act="lesson" data-id="' + k + '">📖 ' + esc(l.title) + LT(" (" + weak[k] + " câu)</button>", " (" + weak[k] + (weak[k] === 1 ? " question" : " questions") + ")</button>"); }).join("") + "</div></section>";
    h += LT('<section class="card flat"><h3 class="disp" style="font-size:1.1rem;margin-bottom:6px">Xem lại bài thi</h3>', '<section class="card flat"><h3 class="disp" style="font-size:1.1rem;margin-bottom:6px">Review your exam</h3>') + p.qs.map(function (q, i) {
      var good = q.w >= 1, s = q.st || {}, mine = (s.vals || []).map(function (v, k) { var pp = q.parts[k]; return pp.kind === "frac" ? (v.n || "?") + "/" + (v.d || "?") : (v.v || "–"); }).join("; ");
      return '<details class="xrev ' + (good ? "ok" : "no") + '"><summary><span class="xn">' + (i + 1) + "</span>" + (good ? "✅" : answered(q) ? "❌" : "⬜") + " " + rich(q.q.replace(/\n/g, " ")).slice(0, 400) + "</summary>" +
        LT('<div class="xbody"><div>Con trả lời: <b>' + esc(answered(q) ? mine : "chưa làm") + "</b></div><div>Đáp án đúng: <b>", '<div class="xbody"><div>Your answer: <b>' + esc(answered(q) ? mine : "not answered") + "</b></div><div>Correct answer: <b>") + q.parts.map(function (pp) { return rich(G.ansText(pp)); }).join("; ") + "</b></div>" +
        (q.steps && q.steps.length ? '<ol class="xsteps">' + q.steps.map(function (st) { return "<li>" + rich(st.t) + "</li>"; }).join("") + "</ol>" : "") + "</div></details>";
    }).join("") + "</section>";
    h += LT('<div class="parts"><button class="btn block" data-act="xagain" data-id="' + id + '">↺ Thi lại (đề mới)</button><button class="btn block" data-act="homeBtn">🏠 Về phòng nhân vật</button></div></main>', '<div class="parts"><button class="btn block" data-act="xagain" data-id="' + id + '">↺ Retake (new exam)</button><button class="btn block" data-act="homeBtn">🏠 Back to the Characters\' Room</button></div></main>');
    app.innerHTML = h;
    if (pass) { try { G.Sfx.win(); } catch (e) {} } else { try { G.Sfx.bad(); } catch (e) {} }
    window.VO && window.VO.seq(r.score >= 10 ? [LT("Hoàn hảo!", "Perfect!"), LT("Con kiên trì quá, cô khen con!", "You were so persistent, I'm proud of you!")] : pass ? [LT("Con đã vượt qua!", "You passed!"), LT("Con làm rất tốt!", "You did great!")] : r.score >= 6 ? [LT("Con làm được rồi, chỉ thiếu một chút nữa thôi!", "You almost had it, just a little bit more!"), LT("Mỗi ngày một chút, con sẽ giỏi dần lên!", "A little every day, and you will keep getting better!")] : [LT("Sai cũng không sao, mình học từ chỗ sai mà.", "It's okay to make mistakes, we learn from them."), LT("Mình thử lại từ từ nhé!", "Let's try again, nice and slow!")]);
    var rs = V8().newOnes ? V8().newOnes() : [];
    rs.length && setTimeout(function () { V8().showGifts(rs, V8().finaleCheck); }, 1600);
  };
  ACT.xagain = function (el) { G.Sfx.tap(); UI.stack = [{ n: "home" }]; G.render(); intro(el.dataset.id); };
  ACT.xstart = function (el) { G.Sfx.tap(); intro(el.dataset.id); };

  /* ---------- Giấy khen ---------- */
  function cert() {
    var e = D().tong || { best: 0 }, name = Store.d.name || LT("Bé", "Champ"), c = document.createElement("canvas"), W = 1600, H = 1130;
    c.width = W; c.height = H;
    var x = c.getContext("2d"), girl = G.themeMode() === "girl";
    var g = x.createLinearGradient(0, 0, W, H); g.addColorStop(0, girl ? "#FFE6F2" : "#E3F1FF"); g.addColorStop(1, "#FFF6D8");
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    x.strokeStyle = "#D4A017"; x.lineWidth = 26; x.strokeRect(40, 40, W - 80, H - 80);
    x.strokeStyle = girl ? "#E06AA5" : "#3A7BD5"; x.lineWidth = 6; x.strokeRect(80, 80, W - 160, H - 160);
    x.textAlign = "center"; x.fillStyle = "#B03A2E"; x.font = "bold 120px Georgia, serif"; x.fillText(LT("GIẤY KHEN", "CERTIFICATE"), W / 2, 260);
    x.fillStyle = "#1F2A44"; x.font = "44px sans-serif"; x.fillText(LT("Toán 4 Phiêu Lưu chúc mừng", "Toán 4 Phiêu Lưu congratulates"), W / 2, 360);
    x.fillStyle = girl ? "#C2185B" : "#1565C0"; x.font = "bold 110px Georgia, serif"; x.fillText(name, W / 2, 500);
    x.fillStyle = "#1F2A44"; x.font = "46px sans-serif";
    x.fillText(LT("đã hoàn thành xuất sắc Bài thi tổng hợp Toán lớp 4", "has excellently completed the Grade 4 Math Comprehensive Exam"), W / 2, 600);
    x.font = "bold 64px sans-serif"; x.fillStyle = "#B03A2E"; x.fillText(LT("Điểm: " + fmtScore(e.best) + "/10   " + medal(e.best, "tong"), "Score: " + fmtScore(e.best) + "/10   " + medal(e.best, "tong")), W / 2, 720);
    var d = new Date(e.at || Date.now());
    x.fillStyle = "#1F2A44"; x.font = "40px sans-serif"; x.fillText(LT("Ngày " + d.getDate() + " tháng " + (d.getMonth() + 1) + " năm " + d.getFullYear(), d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })), W / 2, 830);
    x.font = "italic 38px Georgia, serif"; x.fillText(girl ? LT("Cú Mi và Luna", "Mimi the Owl and Luna") : LT("Cú Tí và đội thám hiểm", "Tee the Owl and the explorer team"), W / 2, 950);
    x.font = "120px sans-serif"; x.fillText("⭐", 260, 1000); x.fillText("⭐", W - 260, 1000);
    return c.toDataURL("image/png");
  }
  ACT.xcert = function () {
    var url = cert(), nm = "Giay-khen-" + (Store.d.name || "be").replace(/\s+/g, "-") + ".png";
    G.sheet('<div style="text-align:center"><img src="' + url + '" style="width:100%;border-radius:12px;box-shadow:0 4px 14px rgba(0,0,0,.2)" alt="' + LT("Giấy khen", "Certificate") + '"><a class="btn pri block" style="margin-top:10px;text-decoration:none" download="' + esc(nm) + '" href="' + url + '">⬇ ' + LT("Tải Giấy khen", "Download Certificate") + '</a><button class="btn block" id="cx" style="margin-top:8px">' + LT("Đóng", "Close") + '</button></div>', function (bg, close) { bg.querySelector("#cx").onclick = close; });
  };

  /* ---------- lối vào: vùng, bản đồ, thành tích ---------- */
  function card(id) {
    var ok = open(id), e = D()[id];
    return '<button class="xcard' + (ok ? "" : " lk") + (id === "tong" ? " big" : "") + '" data-act="xstart" data-id="' + id + '"><span class="xi">' + (id === "tong" ? "🏆" : "📝") + '</span><span class="xt"><b>' + esc(id === "tong" ? LT("Bài thi tổng hợp", "Comprehensive Exam") : LT("Phòng thi " + zoneName(id), "Exam Room " + zoneName(id))) + "</b><small>" +
      (e ? LT("Cao nhất: " + fmtScore(e.best) + " điểm " + medal(e.best, id), "Best: " + fmtScore(e.best) + " points " + medal(e.best, id)) : ok ? (id === "tong" ? LT("20 câu · 40 phút · phần thưởng lớn!", "20 questions · 40 minutes · big reward!") : LT("10 câu · thi như thật", "10 questions · just like a real exam")) : "🔒 " + esc(lockText(id))) + "</small></span></button>";
  }
  var oz = SC.zone;
  SC.zone = function (p) {
    oz(p);
    var host = app.querySelector("main") || app.querySelector(".v8in") || app;
    var d = document.createElement("div"); d.className = "xwrap"; d.innerHTML = card(p.id);
    var nav = host.querySelector(".bar4"); nav ? host.insertBefore(d, nav) : host.appendChild(d);
  };
  var om = SC.map;
  SC.map = function (p) {
    om(p);
    var host = app.querySelector(".v8in") || app.querySelector("main") || app;
    var d = document.createElement("div"); d.className = "xwrap xmap"; d.innerHTML = card("tong");
    var hd = host.querySelector(".wtop"); hd && hd.nextSibling ? host.insertBefore(d, hd.nextSibling) : host.insertBefore(d, host.firstChild);
  };
  var os = SC.stats;
  SC.stats = function (p) {
    os(p);
    var main = app.querySelector("main"); if (!main) return;
    var sec = document.createElement("section"); sec.className = "card flat";
    sec.innerHTML = LT('<h2 class="disp" style="font-size:1.2rem;margin-bottom:6px">🏅 Huy chương phòng thi</h2><div class="xmedals">', '<h2 class="disp" style="font-size:1.2rem;margin-bottom:6px">🏅 Exam Room Medals</h2><div class="xmedals">') + ZONES.concat(["tong"]).map(function (z) {
      var e = D()[z]; return '<div class="' + (e && e.best >= PASS ? "" : "lk") + '"><span>' + (e && e.best >= PASS ? medal(e.best, z) : "🔒") + "</span><b>" + esc(z === "tong" ? LT("Tổng hợp", "Overall") : zoneName(z)) + "</b><small>" + LT((e ? fmtScore(e.best) + " điểm" : "chưa thi"), (e ? fmtScore(e.best) + " points" : "not taken yet")) + "</small></div>";
    }).join("") + "</div>";
    main.insertBefore(sec, main.children[1] || null);
  };
  G.EXAM = { start: start, intro: intro, open: open, cert: cert, build: build };
})();