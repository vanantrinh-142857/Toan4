//# Phát giọng thu âm: tra bảng du-lieu/am-thanh*.js theo nội dung câu, tự đọc bằng giọng máy nếu thiếu file
//# Tự chứa trong một hàm bọc — chạy độc lập, không cần build.


/* ===== Toán 4 Phiêu Lưu – phát giọng thu âm (bảng du-lieu/am-thanh.js) ===== */
(function () {
  var G = globalThis, Store = G.Store;
  var PAIRS = [["òa","oà"],["óa","oá"],["ỏa","oả"],["õa","oã"],["ọa","oạ"],["òe","oè"],["óe","oé"],["ủy","uỷ"],["úy","uý"],["ùy","uỳ"],["ụy","uỵ"],["kì","kỳ"],["kĩ","kỹ"]];
  function norm(s) {
    s = String(s || "").normalize("NFC").toLowerCase().replace(/<[^>]*>/g, " ").replace(/\{ten\}|\{qua\}/g, " ");
    PAIRS.forEach(function (p) { s = s.split(p[0]).join(p[1]); });
    return s.replace(/\*\*/g, "").replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim();
  }
  var MAP = {}, TXT = {};   /* TXT: file → câu chữ, để đọc bằng giọng máy nếu file lỗi */
  /* Bản Anh: dòng "file | câu tiếng Anh | câu tiếng Việt tương ứng (tuỳ chọn)" trong du-lieu/am-thanh-en.js */
  var EN = window.LANG === "en";
  String((EN ? window.BANG_AM_THANH_EN : window.BANG_AM_THANH) || "").split(/\r?\n/).forEach(function (l) {
    l = l.trim(); if (!l || l.charAt(0) === "#" || l.indexOf("|") < 0) return;
    var c = l.split("|"), files = c[0].split(";").map(function (x) { return x.trim(); }).filter(Boolean), key = (c[1] || "").trim();
    if (!files.length || !key) return;
    var put = function (k) { MAP[k.charAt(0) === "@" ? k.toLowerCase() : norm(k)] = files; };
    if (key.charAt(0) !== "@") files.forEach(function (f) { TXT[f] = TXT[f] || key; });
    put(key);
    if (EN && c[2] && c[2].trim()) put(c[2].trim());
  });
  /* Bảng bổ sung (giọng bài giảng tiếng Việt): chỉ thêm câu chưa có ở bảng chính */
  if (!EN) String(window.BANG_AM_THANH_2 || "").split(/\r?\n/).forEach(function (l) {
    l = l.trim(); if (!l || l.charAt(0) === "#" || l.indexOf("|") < 0) return;
    var c = l.split("|"), f = c[0].trim(), k = (c[1] || "").trim(); if (!f || !k) return;
    var key = norm(k); if (!key) return;
    TXT[f] = TXT[f] || k;
    if (!MAP[key]) MAP[key] = [f]; else if (MAP[key].__ex !== 1 && MAP[key].indexOf(f) < 0 && MAP[key].__b2) MAP[key].push(f);
    if (MAP[key].length === 1 && MAP[key][0] === f) MAP[key].__b2 = 1;
  });
  var cur = null, queue = [], onceSet = {};
  var on = function () { return !Store.d.set || Store.d.set.rec !== false; };
  function stop() { queue = []; if (cur) { try { cur.pause(); } catch (e) {} cur = null; } }
  function next() {
    if (!queue.length) { cur = null; return; }
    var f = queue.shift();
    try { window.speechSynthesis && speechSynthesis.cancel(); } catch (e) {}
    var a = new Audio("am-thanh/" + f);
    a.volume = Store.d.set && Store.d.set.recVol != null ? Store.d.set.recVol : 1;
    a.onended = function () { if (cur === a) next(); };
    /* file hỏng / không có: đọc câu đó bằng giọng máy (nếu bật Đọc to) rồi sang câu sau */
    a.onerror = function () { if (cur !== a) return; fallback(f); next(); };
    cur = a;
    var p = a.play(); p && p.catch && p.catch(function () { if (cur === a) next(); });
  }
  function fallback(f) {
    try {
      var tx = TXT[f]; if (!tx || !window.speechSynthesis || !(Store.d.set && Store.d.set.voice)) return;
      var u = new SpeechSynthesisUtterance(tx.replace(/\*\*/g, "").replace(/<[^>]*>/g, " "));
      u.lang = EN ? "en-US" : "vi-VN"; speechSynthesis.speak(u);
    } catch (e) {}
  }
  function find(k) { return k ? MAP[k.charAt(0) === "@" ? k.toLowerCase() : norm(k)] : null; }
  function pick(fs) { return fs[Math.floor(Math.random() * fs.length)]; }
  var VO = {
    norm: norm, map: MAP,
    has: function (t) { return !!find(t); },
    stop: stop,
    /* phát 1 câu (ngắt câu đang phát); trả về true nếu có file */
    say: function (t) { if (!on()) return false; var f = find(t); if (!f) return false; stop(); queue = [pick(f)]; next(); return true; },
    /* phát nối tiếp nhiều câu (bỏ qua câu chưa có file) */
    seq: function (ts) { if (!on()) return false; var fs = ts.map(find).filter(Boolean).map(pick); if (!fs.length) return false; stop(); queue = fs; next(); return true; },
    /* thêm vào cuối hàng chờ */
    add: function (t) { if (!on()) return false; var f = find(t); if (!f) return false; queue.push(pick(f)); if (!cur) next(); return true; },
    story: function (key, mode) { mode = mode || (G.themeMode && G.themeMode() === "girl" ? "gai" : "trai"); return VO.say("@truyen:" + key + ":" + mode); },
    once: function (id, t) { if (onceSet[id]) return false; onceSet[id] = 1; return VO.say(t); },
    resetOnce: function () { onceSet = {}; }
  };
  /* --- phản hồi khi làm bài --- */
  var streakOk = 0, streakNo = 0, t0 = Date.now(), restSaid = 0;
  VO.fb = function (html, ok, tries) {
    var m = /<b>(.*?)<\/b>/.exec(html || ""), t = m ? m[1] : "";
    if (ok) {
      streakNo = 0; streakOk++;
      if (tries > 0) return VO.say(Math.random() < .5 ? "Con kiên trì quá, cô khen con!" : "Con làm lại là đúng rồi đó!");
      if (streakOk > 0 && streakOk % 4 === 0) return VO.seq([t, "Con đang làm rất tốt, cố lên nào!"]);
      if (!restSaid && Date.now() - t0 > 25 * 60 * 1000) { restSaid = 1; return VO.seq([t, "Nghỉ một chút rồi mình làm tiếp nhé!"]); }
      return VO.say(t);
    }
    streakOk = 0; streakNo++;
    if (/Chưa đúng rồi\.|That's not right\./.test(t)) return VO.say("Sai cũng không sao, mình học từ chỗ sai mà.");
    if (streakNo >= 3 && streakNo % 3 === 0) return VO.say("Đừng lo, thử lại một lần nữa nào!");
    return VO.say(t) || VO.say("Chưa đúng, thử lại nhé!");
  };
  VO.result = function (r) {
    var L = [];
    if (r.kind === "known") L = r.pass ? ["Con đã biết rồi.", "Bài này được mở khóa hết."] : ["Chưa sao! Mình cùng học bài này nhé."];
    else if (r.kind === "exam") L = [];
    else {
      L.push(r.stars === 3 ? "Hoàn hảo!" : r.pass ? "Con đã vượt qua!" : r.tot > 0 && (!r.cfg || r.cfg.need - r.tot <= 1) ? "Con làm được rồi, chỉ thiếu một chút nữa thôi!" : "Mình thử lại từ từ nhé!");
      if (!r.pass) L.push("Mỗi ngày một chút, con sẽ giỏi dần lên!");
    }
    if (r.got) L.push("Con xong cả ba nhiệm vụ hôm nay rồi.", "Thưởng thêm hai ngôi sao nhé!");
    L.length && VO.seq(L);
  };
  window.VO = VO;
})();