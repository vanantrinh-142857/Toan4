//# Giao diện v8: Phòng nhân vật, mặc đồ, cốt truyện, đường đến món quà (đọc bảng du-lieu/phan-thuong, nhan-vat, cot-truyen)
//# Tự chứa trong một hàm bọc — chạy độc lập, không cần build.
/* ===== Toán 4 Phiêu Lưu v8 – lớp giao diện: Phòng nhân vật, mặc đồ, cốt truyện, đường đến món quà =====
   Dữ liệu sửa được bằng Notepad nằm trong thư mục du-lieu (phan-thuong.js, nhan-vat.js, cot-truyen.js).
   Phần kiến thức (bài học, câu hỏi, chấm điểm) nằm ở script phía trên. */
(function () {
  "use strict";
  var G = globalThis, Store = G.Store, SC = G.SC, UI = G.UI, ACT = G.ACT, LESSONS = G.LESSONS;
  var esc = G.esc, starSvg = G.starSvg, themeMode = G.themeMode;
  var app = document.getElementById("app");
  var IMG = function (p) { return p ? "anh/" + p : ""; };
  var VOS = {}, voOnce = function (k, fn) { if (!window.VO || VOS[k]) return; VOS[k] = 1; fn(window.VO); };
  var MODE = { trai: "boy", gai: "girl" };
  var ZONES = ["so", "toan", "ps", "hinh"];
  var SLOT_NAME = { dau: LT("Đội đầu", "Hat"), lung: LT("Đeo lưng", "Backpack"), tay: LT("Cầm tay", "Gadget"), nguoi: LT("Bộ đồ", "Outfit"), ke: LT("Kệ trưng bày", "Trophy shelf"), thucung: LT("Thú cưng", "Pet"), anhdd: LT("Ảnh đại diện", "Profile picture"), nhanvat: LT("Nhân vật", "Hero"), luna: LT("Đồ của Luna", "Luna's item") };
  var TIER_NAME = { 1: LT("Dễ", "Easy"), 2: LT("Vừa", "Medium"), 3: LT("Khó", "Hard") };

  /* ---------- Đọc 3 bảng Notepad ---------- */
  function table(txt) {
    return String(txt || "").split(/\r?\n/).map(function (l) { return l.trim(); })
      .filter(function (l) { return l && l.charAt(0) !== "#"; })
      .map(function (l) { return l.split("|").map(function (c) { return c.trim(); }); });
  }
  var RW = [];
  table(window.BANG_PHAN_THUONG).forEach(function (c) {
    if (c.length < 6 || !c[0]) return;
    var w = (c[1] || "").toLowerCase(), ms = w === "ca2" ? ["boy", "girl"] : [MODE[w]];
    ms.forEach(function (m) { m && RW.push({ id: c[0], mode: m, slot: (c[2] || "").toLowerCase(), name: c[3] || c[0], img: c[4] || "", cond: (c[5] || "cosan").toLowerCase(), msg: c[6] || "" }); });
  });
  var tri = function (s) { var a = String(s || "").split(",").map(Number); return a.length === 3 && a.every(isFinite) ? a : null; };
  var CH = {};
  table(window.BANG_NHAN_VAT).forEach(function (c) {
    var m = MODE[(c[1] || "").toLowerCase()];
    if (m) CH[m + ":" + c[0]] = { dau: tri(c[2]), lung: tri(c[3]), tay: tri(c[4]), main: /x/i.test(c[5] || "") };
  });
  var ST = {};
  table(window.BANG_COT_TRUYEN).forEach(function (c) {
    var m = MODE[(c[1] || "").toLowerCase()];
    if (m) ST[m + ":" + c[0]] = c.slice(2).join(" | ");
  });
  if (window.LANG === "en") {
    String(window.BANG_TIENG_ANH || "").split(/\r?\n/).forEach(function (l) {
      l = l.trim(); if (!l || l.charAt(0) === "#") return;
      var c = l.split("|").map(function (x) { return x.trim(); }), m = MODE[(c[2] || "").toLowerCase()];
      if (!m) return;
      if (c[0] === "ph") RW.forEach(function (r) { if (r.id === c[1] && r.mode === m) { if (c[3]) r.name = c[3]; r.msg = c[4] || ""; } });
      else if (c[0] === "ct") ST[m + ":" + c[1]] = c.slice(3).join(" | ");
    });
  }
  var DEF = { "ten-the-gioi": { boy: LT("Thế giới Khám Phá", "Discovery World"), girl: LT("Thế giới Kỳ Diệu", "Wonder World") }, cu: { boy: LT("Cú Tí", "Tee the Owl"), girl: LT("Cú Mi", "Mimi the Owl") }, phong: { boy: LT("Phòng nhân vật", "Hero Room"), girl: LT("Phòng nhân vật", "Hero Room") } };
  function T(key, def, m) {
    m = m || themeMode();
    var v = ST[m + ":" + key];
    if (v == null) v = DEF[key] ? DEF[key][m] : (def || "");
    return String(v).replace(/\{ten\}/g, Store.d.name || LT("con", "friend"));
  }

  /* ---------- Ảnh thiếu: hiện "Sắp có" ---------- */
  window.V8miss = function (el) {
    if (el.dataset.fb) { el.onerror = null; el.src = el.dataset.fb; return; }
    var s = document.createElement("span");
    s.className = "sapco " + (el.className || "");
    s.textContent = LT("Sắp có", "Coming soon");
    el.replaceWith(s);
  };
  window.V8hide = function (el) { el.remove(); };
  var pic = function (src, cls, extra) { return '<img class="' + (cls || "") + '" src="' + esc(src) + '" alt="" draggable="false" onerror="V8miss(this)"' + (extra || "") + ">"; };

  /* ---------- Dữ liệu lưu của bé ---------- */
  function V() {
    var d = Store.d;
    if (!d.v8 || typeof d.v8 !== "object") d.v8 = {};
    ["boy", "girl"].forEach(function (m) {
      var o = d.v8[m] = d.v8[m] || {}, first = function (slot) { var r = RW.find(function (x) { return x.mode === m && x.slot === slot && x.cond === "cosan"; }); return r ? r.id : ""; };
      if (!o.nhanvat || !findR(o.nhanvat, m)) o.nhanvat = first("nhanvat");
      if (!o.anhdd || !findR(o.anhdd, m)) o.anhdd = first("anhdd");
      if (o.thucung === undefined || (o.thucung && !findR(o.thucung, m))) o.thucung = first("thucung");
      ["dau", "lung", "tay", "nguoi"].forEach(function (s) { if (o[s] === undefined || (o[s] && !findR(o[s], m))) o[s] = ""; });
      o.seen = Array.isArray(o.seen) ? o.seen : [];
      o.picked = o.picked || 0; o.story = o.story || 0; o.fin = o.fin || 0;
    });
    return d.v8;
  }
  function findR(id, m) { m = m || themeMode(); return RW.find(function (r) { return r.mode === m && r.id === id; }); }
  var cur = function () { return V()[themeMode()]; };
  var list = function (slot, m) { m = m || themeMode(); return RW.filter(function (r) { return r.mode === m && (!slot || r.slot === slot); }); };
  var byId = function (id) { return LESSONS.find(function (l) { return l.id === id; }); };

  function owned(r) {
    var c = r.cond.split(":");
    if (c[0] === "cosan" || !c[0]) return true;
    if (c[0] === "bai") return byId(c[1]) ? G.lessonPassed(c[1], { de: 1, vua: 2, kho: 3 }[c[2] || "de"] || 1) : false;
    if (c[0] === "trum") return (Store.d.boss && Store.d.boss[c[1]] > 0);
    if (c[0] === "sao") return G.totalStars() >= (+c[1] || 0);
    if (c[0] === "thi") { var e = (Store.d.exam || {})[c[1]]; return !!e && e.best >= (+c[2] || 8); }
    return false;
  }
  function condText(r) {
    var c = r.cond.split(":");
    if (c[0] === "bai") { var l = byId(c[1]); return LT("Qua mức " + (TIER_NAME[{ de: 1, vua: 2, kho: 3 }[c[2] || "de"] || 1]) + " bài “" + (l ? l.title : c[1]) + "”", "Pass the " + (TIER_NAME[{ de: 1, vua: 2, kho: 3 }[c[2] || "de"] || 1]) + " level of “" + (l ? l.title : c[1]) + "”"); }
    if (c[0] === "trum") return LT("Thắng " + T("vung:" + c[1] + ":trum", "bài trùm") + " (" + T("vung:" + c[1] + ":ten") + ")", "Beat the " + T("vung:" + c[1] + ":trum", "boss challenge") + " (" + T("vung:" + c[1] + ":ten") + ")");
    if (c[0] === "sao") return LT("Có đủ " + c[1] + " ⭐", "Have " + c[1] + " ⭐");
    if (c[0] === "thi") return LT("Đạt từ " + (+c[2] || 8) + " điểm " + (c[1] === "tong" ? "Bài thi tổng hợp" : "Phòng thi " + T("vung:" + c[1] + ":ten")), "Score at least " + (+c[2] || 8) + " points on " + (c[1] === "tong" ? "the Comprehensive Exam" : "the " + T("vung:" + c[1] + ":ten") + " Exam Room")); 
    return LT("Có sẵn", "Available from the start");
  }
  function rewardOf(cond) { return list().find(function (r) { return r.cond === cond || r.cond === cond + ":de"; }); }
  function newOnes() { var o = cur(); return list().filter(function (r) { return r.cond !== "cosan" && owned(r) && o.seen.indexOf(r.id) < 0; }); }
  function markSeen(rs) { var o = cur(); rs.forEach(function (r) { o.seen.indexOf(r.id) < 0 && o.seen.push(r.id); }); Store.save(); }
  /* v9.0.2: với ảnh trọn bộ, Tí chỉ mang MỘT món mỗi lúc */
  function oneAcc(o, s) { if (themeMode() === "boy" && G.TU_DO_TI && /^(dau|lung|tay)$/.test(s) && o[s]) ["dau", "lung", "tay"].forEach(function (x) { if (x !== s) o[x] = ""; }); }
  G.ACT.v9pose = function () { var o = cur(); o.pose = (o.pose || 0) + 1; Store.save(); G.Sfx && G.Sfx.pop && G.Sfx.pop(); G.render(); };
  function equip(r) {
    var o = cur(), s = r.slot;
    if (s === "dau" || s === "lung" || s === "tay" || s === "nguoi") o[s] = o[s] === r.id ? "" : r.id;
    else if (s === "nhanvat" || s === "anhdd" || s === "thucung") o[s] = r.id;
    oneAcc(o, s);
    Store.save();
  }
  var avSrc = function () { var r = findR(cur().anhdd); return r ? IMG(r.img) : (themeMode() === "girl" ? IMG("luna/luna-dai-dien.webp") : ""); };
  var star = '<svg width="22" height="22" viewBox="0 0 24 24"><path d="M12 2.6l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.6l1.2-6.5L2.5 9.5l6.6-.9z" fill="url(#gStar)" stroke="#B07800" stroke-width="1.6"/></svg>';
  var owlImg = function (mood) { return G.assetUrl(G.mascotPath(themeMode(), mood || "happy")); };

  /* ---------- Vị trí mặc đồ (có thể ghi đè bằng công cụ căn chỉnh) ---------- */
  var CK = "toan4pl_canh_v9", CAL = {};   /* v9.0.2: ảnh Tí mới → bỏ số căn chỉnh của ảnh cũ */
  try { CAL = JSON.parse(localStorage.getItem(CK) || "{}") || {}; } catch (e) { CAL = {}; }
  function anchor(m, ch, slot) {
    var k = m + ":" + ch + ":" + slot;
    if (CAL[k]) return CAL[k];
    var c = CH[m + ":" + ch];
    return c && c[slot] ? c[slot] : ({ dau: [50, 8, 80], lung: [50, 46, 130], tay: [85, 60, 32] })[slot];
  }
  function saveCal() { try { localStorage.setItem(CK, JSON.stringify(CAL)); } catch (e) {} }

  /* v9.0.2: ảnh Tí và đồ dùng KHUNG CHUNG: mọi lớp đồ là ảnh cả khung (rộng 300% thân, cao 140%), neo 50,50,300.
     Bộ đồ nào có đầu khác cỡ thì ghi vị trí riêng ở đây [trái %, trên %, rộng %] (tính từ ảnh). */
  var OUTFIT_FIT = {"boy:bophg": {dau: [47.5, 44.7, 250.7], tay: [59.9, 48.4, 250.7], lung: [47.5, 44.7, 250.7]}};
  /* ---------- Vẽ nhân vật mặc đồ theo lớp ---------- */
  function figure(o, m, opt) {
    m = m || themeMode(); opt = opt || {};
    var ch = findR(o.nhanvat, m);
    if (!ch) return "";
    /* v9.0.2: thế giới bé trai – Tí dùng ẢNH TRỌN BỘ (du-lieu/tu-do-ti.js), không ghép lớp */
    var TD = G.TU_DO_TI;
    if (m === "boy" && ch.id === "ti" && TD) {
      var on = opt.only, ow = function (id) { var r = id && findR(id, m); return r && (on && on.id === id || owned(r)) ? id : ""; };
      var outId = on && on.slot === "nguoi" ? on.id : ow(o.nguoi);
      var acc = on && /^(dau|lung|tay)$/.test(on.slot) ? on.id : (ow(o.dau) || ow(o.lung) || ow(o.tay));
      var set = TD[outId] || TD[""], arr = (acc && (set[acc] || TD[""][acc])) || set[""] || TD[""][""];
      return '<div class="v8fig v9look' + (opt.cls ? " " + opt.cls : "") + '"><img class="body" data-act="v9pose" src="' + esc(IMG(arr[(o.pose || 0) % arr.length])) +
        '" data-fb="' + esc(IMG(ch.img)) + '" alt="' + esc(ch.name) + '" draggable="false" onerror="V8miss(this)"></div>';
    }
    var info = CH[m + ":" + ch.id] || {}, body = IMG(ch.img), base = body;
    var out = findR(o.nguoi, m);
    if (info.main && out && owned(out)) body = IMG(out.img);
    var layer = function (slot, z) {
      var r = opt.only && opt.only.slot === slot ? opt.only : findR(o[slot], m);
      if (!r || (!opt.only && !owned(r))) return "";
      /* v9.0.2: bộ đồ có cỡ đầu khác ảnh Tí nền → dùng vị trí riêng (OUTFIT_FIT) */
      var fit = info.main && out && owned(out) && OUTFIT_FIT[m + ":" + out.id];
      var a = fit && fit[slot] && !CAL[m + ":" + ch.id + ":" + slot] ? fit[slot] : anchor(m, ch.id, slot);
      return '<img class="ly ly-' + slot + '" data-slot="' + slot + '" src="' + esc(IMG(r.img)) + '" alt="" draggable="false" onerror="V8hide(this)" style="left:' + a[0] + "%;top:" + a[1] + "%;width:" + a[2] + "%;z-index:" + z + '">';
    };
    return '<div class="v8fig' + (opt.cls ? " " + opt.cls : "") + '">' + layer("lung", 1) +
      '<img class="body" src="' + esc(body) + '" data-fb="' + esc(base) + '" alt="' + esc(ch.name) + '" draggable="false" onerror="V8miss(this)">' +
      layer("dau", 3) + layer("tay", 4) + "</div>";
  }

  /* ---------- Tên vùng, tên trùm theo thế giới ---------- */
  function syncNames() {
    G.REGIONS.forEach(function (rg) { rg.name = T("vung:" + rg.id + ":ten", rg.name); });
    G.MODES[0].owl = T("cu", "", "boy"); G.MODES[1].owl = T("cu", "", "girl");
    G.MODES[0].label = T("ten-the-gioi", "", "boy"); G.MODES[1].label = T("ten-the-gioi", "", "girl");
  }
  window.ONRENDER = function () { syncNames(); document.title = LT("Toán 4 Phiêu Lưu · " + T("ten-the-gioi"), "Grade 4 Math Adventure · " + T("ten-the-gioi")); };
  window.BOSSNAME = function (rid) { return LT("Trùm: " + T("vung:" + rid + ":trum", "Bài trùm"), "Boss: " + T("vung:" + rid + ":trum", "Boss Challenge")); };

  /* ---------- Thanh điều hướng: Phòng | Bản đồ | Thành tích | Cài đặt ---------- */
  window.NAVBAR = function (c) {
    var it = [["home", LT("Phòng", "Room"), avSrc(), "av"], ["map", LT("Bản đồ", "Map"), IMG("ui/nut-ban-do.webp"), ""], ["stats", LT("Thành tích", "Awards"), IMG("do/cup-vang.webp"), ""], ["settings", LT("Cài đặt", "Settings"), IMG("ui/cai-dat.webp"), ""]];
    return '<nav class="bar4" aria-label="' + LT('Điều hướng', 'Navigation') + '"><div class="in">' + it.map(function (x) {
      return '<button class="' + (x[0] === c ? "on " : "") + x[3] + '" data-act="tab" data-t="' + x[0] + '"><img src="' + esc(x[2]) + '" alt="" onerror="V8hide(this)">' + x[1] + "</button>";
    }).join("") + "</div></nav>";
  };
  function head(title, o) {
    o = o || {};
    return '<header class="wtop">' + (o.back ? '<button class="ib" data-act="back" aria-label="' + LT('Quay lại', 'Back') + '">‹</button>' : '<span class="av"><img src="' + esc(avSrc()) + '" alt="" onerror="V8hide(this)"></span>') +
      '<div class="tt"><b>' + esc(title) + "</b>" + (o.sub ? "<small>" + esc(o.sub) + "</small>" : "") + '</div>' +
      '<button class="tool" data-act="v8lang" aria-label="Language / Ngôn ngữ">🌐 ' + (window.LANG === "en" ? "VI" : "EN") + "</button>" +
      (o.world ? '<button class="tool" data-act="v8splash" aria-label="' + LT("Đổi thế giới", "Switch world") + '">🌍</button>' : "") +
      '<span class="star">' + star + G.totalStars() + "</span></header>";
  }

  /* ---------- Gợi ý món tiếp theo ---------- */
  function nextTarget() {
    var order = G.ORDER || LESSONS.map(function (l) { return l.id; });
    for (var i = 0; i < order.length; i++) {
      var l = byId(order[i]);
      if (!l || l.optional || !G.unlocked(l) || G.lessonPassed(l.id, 1)) continue;
      var r = rewardOf("bai:" + l.id);
      return { r: r, l: l };
    }
    for (var k = 0; k < ZONES.length; k++) {
      var z = ZONES[k];
      if (G.bossOpen(z) && !(Store.d.boss[z] > 0)) return { r: rewardOf("trum:" + z), boss: z };
    }
    return null;
  }

  /* ---------- Màn chào ---------- */
  SC.splash = function () {
    var v = V();
    app.innerHTML = '<div class="v8full"><div class="v8bg" style="background-image:url(' + IMG("nen/man-chao.webp") + ')"></div>' +
      '<button class="v8btnimg sp-gear" data-act="v8set" aria-label="' + LT('Cài đặt', 'Settings') + '"><img src="' + IMG("ui/cai-dat.webp") + '" alt=""></button>' +
      '<button class="sp-lang" data-act="v8lang" aria-label="Language / Ngôn ngữ">🌐 ' + (window.LANG === "en" ? "Tiếng Việt" : "English") + '</button>' +
      '<div class="v8in v8center"><img class="sp-logo" src="' + IMG("ui/logo.webp") + '" alt="' + LT('Toán 4 Phiêu Lưu', 'Grade 4 Math Adventure') + '"><img class="sp-slogan" src="' + IMG("ui/khau-hieu.webp") + '" alt="">' +
      '<img class="sp-owls" src="' + IMG("ui/hai-chu-cu.webp") + '" alt=""><div class="sp-row">' +
      '<button class="v8btnimg" data-act="v8world" data-mode="boy"><img src="' + IMG("ui/nut-the-gioi-trai.webp") + '" alt="' + esc(T("ten-the-gioi", "", "boy")) + '"></button>' +
      '<button class="v8btnimg" data-act="v8world" data-mode="girl"><img src="' + IMG("ui/nut-the-gioi-gai.webp") + '" alt="' + esc(T("ten-the-gioi", "", "girl")) + '"></button></div>' +
      '<div class="sp-hint">' + (v.boy.picked || v.girl.picked ? LT("Chạm vào thế giới để vào phòng nhân vật", "Tap a world to enter your hero room") : LT("Chạm vào một thế giới để bắt đầu", "Tap a world to begin")) + "</div></div></div>";
  };

  /* ---------- Chọn nhân vật đồng hành ---------- */
  SC.pick = function (p) {
    var m = p.mode || themeMode();
    if (themeMode() !== m) { G.setTheme(m); syncNames(); }
    var o = V()[m], avs = m === "girl" ? [{ id: "luna", name: "Luna", img: "luna/luna-dai-dien.webp" }] : list("anhdd", m).filter(function (r) { return r.cond === "cosan"; });
    app.innerHTML = '<div class="v8full"><div class="v8bg" style="background-image:url(' + IMG("nen/man-chao.webp") + ");" + (m === "girl" ? "filter:hue-rotate(290deg) saturate(1.1)" : "") + '"></div><div class="v8in">' +
      '<button class="v8btnimg sp-gear" data-act="v8splash" aria-label="' + LT('Quay lại', 'Back') + '" style="left:12px;right:auto;width:52px"><img src="' + IMG("ui/mui-ten-trai.webp") + '" alt=""></button>' +
      '<img class="pk-sign" src="' + IMG("ui/bien-chon-nhan-vat.webp") + '" alt="' + LT('Chọn nhân vật đồng hành', 'Choose your companion') + '">' +
      '<div class="pk-tabs"><button class="v8btnimg ' + (m === "boy" ? "on" : "") + '" data-act="v8pick" data-mode="boy"><img src="' + IMG("ui/tab-trai.webp") + '" alt=""></button>' +
      '<button class="v8btnimg ' + (m === "girl" ? "on" : "") + '" data-act="v8pick" data-mode="girl"><img src="' + IMG("ui/tab-gai.webp") + '" alt=""></button></div>' +
      '<div class="pk-cards"><button class="v8btnimg pk-card ' + (m === "boy" ? "on" : "off") + '" data-act="v8pick" data-mode="boy"><img src="' + IMG("ui/the-trai.webp") + '" alt=""></button>' +
      '<button class="v8btnimg pk-card ' + (m === "girl" ? "on" : "off") + '" data-act="v8pick" data-mode="girl"><img src="' + IMG("ui/the-gai.webp") + '" alt=""></button></div>' +
      '<div class="pk-box"><h3>' + LT('Tuỳ chỉnh nhân vật', 'Customize your hero') + '</h3><div class="avgrid">' + avs.map(function (r) {
        return '<button class="' + (o.anhdd === r.id || m === "girl" ? "on" : "") + '" data-act="v8av" data-id="' + r.id + '" aria-label="' + esc(r.name) + '">' + pic(IMG(r.img)) + "</button>";
      }).join("") + "</div>" +
      '<label class="pk-name">' + LT('Tên của con', 'Your name') + '<input class="txt" id="v8nm" maxlength="20" autocomplete="off" placeholder="' + LT('Ví dụ: Bin', 'For example: Bin') + '" value="' + esc(Store.d.name || "") + '"></label>' +
      '<button class="btn pri block" data-act="v8start">' + LT('Bắt đầu phiêu lưu ▶', 'Start the adventure ▶') + '</button></div></div></div>';
  };

  /* ---------- Truyện mở đầu (3 khung) ---------- */
  SC.story = function (p) {
    var i = p.i || 0, fr = ["mo1", "mo2", "mo3"], arts = [IMG("ui/hai-chu-cu.webp"), IMG(themeMode() === "girl" ? "nen/ban-do-gai.webp" : "nen/ban-do-trai.webp"), owlImg("teach")];
    app.innerHTML = '<div class="v8full"><div class="v8bg" style="background-image:url(' + IMG("nen/man-chao.webp") + ')"></div><div class="v8in v8center">' +
      '<div class="comic"><div class="cart' + (i === 1 ? " map" : "") + '" style="background-image:url(' + arts[i] + ')"></div><div class="ctx"><span class="cno">' + (i + 1) + "/3</span>" + esc(T(fr[i])) + "</div></div>" +
      '<div class="rm-act" style="width:100%;max-width:460px"><button class="btn sm" data-act="v8storyskip">' + LT('Bỏ qua', 'Skip') + '</button><button class="btn pri" data-act="v8story" data-i="' + (i + 1) + '">' + (i < 2 ? LT("Tiếp ▶", "Next ▶") : LT("Vào " + esc(T("phong")) + " ▶", "Go to " + esc(T("phong")) + " ▶")) + "</button></div></div></div>";
    try { (window.VO && window.VO.story(fr[i])) || G.speak(T(fr[i])); } catch (e) {}
  };

  /* ---------- PHÒNG NHÂN VẬT (màn chính) – 8.4: nhân vật luôn vừa màn hình, tủ đồ bấm mới mở, kéo thả đồ lên người ---------- */
  var CABS = [
    ["nv", LT("Nhân vật", "Heroes"), "🧒", ["nhanvat", "anhdd"]],
    ["dau", LT("Mũ", "Hats"), "🎩", ["dau"]],
    ["nguoi", LT("Bộ đồ", "Outfits"), "👕", ["nguoi"]],
    ["lung", LT("Đeo lưng", "Backpacks"), "🎒", ["lung"]],
    ["tay", LT("Cầm tay", "Gadgets"), "🪄", ["tay"]],
    ["thucung", LT("Thú cưng", "Pets"), "🐾", ["thucung"]],
    ["ke", LT("Kệ", "Trophies"), "🏆", ["ke"]]
  ];
  var TABS = CABS;
  function wear(r) {
    var o = cur(), s = r.slot;
    if (s === "dau" || s === "lung" || s === "tay" || s === "nguoi" || s === "nhanvat" || s === "anhdd" || s === "thucung") { o[s] = r.id; oneAcc(o, s); Store.save(); }
  }
  /* dùng 1 món: "tap" = chạm (mặc / cởi), "drop" = kéo thả lên nhân vật (luôn mặc) */
  function useItem(r, how) {
    if (!r) return false;
    if (!owned(r)) { G.Sfx.tap(); pathSheet(r); return false; }
    if (r.slot === "ke") { G.toast(LT("🏆 " + r.name + " đang được trưng bày trên kệ", "🏆 " + r.name + " is on display on the shelf")); return false; }
    if (r.slot === "nguoi" && !(CH[themeMode() + ":" + cur().nhanvat] || {}).main) { G.toast(LT("Bộ đồ này chỉ mặc được cho nhân vật chính", "This outfit only fits the main hero")); return false; }
    G.Sfx.pop();
    if (how === "drop") wear(r); else equip(r);
    return true;
  }
  function roomRefresh() {
    var st = document.querySelector(".rx-strip");
    UI.roomScroll = st ? st.scrollLeft : 0;
    G.replace("home");
  }
  function itemCard(r, o, nw) {
    var own = owned(r), on = o[r.slot] === r.id;
    return '<button class="rx-it' + (own ? "" : " lk") + (on ? " on" : "") + (own && nw.indexOf(r.id) >= 0 ? " nw" : "") + '" data-act="v8eq" data-id="' + r.id + '"' + (own && r.slot !== "ke" ? ' data-drag="1"' : "") + ">" +
      pic(IMG(r.img)) + "<span>" + esc(r.name) + "</span></button>";
  }
  function cabinetsHtml(open, nw, m) {
    return '<div class="rx-cabs">' + CABS.map(function (c) {
      var n = RW.filter(function (r) { return r.mode === m && c[3].indexOf(r.slot) >= 0 && nw.indexOf(r.id) >= 0; }).length;
      return '<button class="cab' + (open === c[0] ? " on" : "") + '" data-act="v8cab" data-c="' + c[0] + '" aria-label="' + esc(c[1]) + '"><span class="dr">' + c[2] + "</span><b>" + esc(c[1]) + "</b>" + (n ? '<i class="dot">' + n + "</i>" : "") + "</button>";
    }).join("") + "</div>";
  }
  function drawerHtml(cab, o, nw, m) {
    var h = '<div class="rx-drawer"><div class="rx-dh"><b>' + cab[2] + " " + esc(cab[1]) + "</b><span>" +
      (cab[0] === "ke" ? LT("Quà lớn con đã giành được", "Big prizes you have won") : LT("Kéo món đồ lên nhân vật hoặc chạm để mặc", "Drag an item onto your hero, or tap to wear")) + '</span><button class="x" data-act="v8cab" data-c="' + cab[0] + '" aria-label="' + LT("Đóng tủ", "Close") + '">✕</button></div><div class="rx-strip">';
    cab[3].forEach(function (slot, gi) {
      var Ls = list(slot);
      if (!Ls.length) return;
      if (gi) h += '<i class="sep"></i>';
      if (slot === "dau" || slot === "lung" || slot === "tay" || slot === "nguoi") h += '<button class="rx-it off' + (o[slot] ? "" : " on") + '" data-act="v8off" data-slot="' + slot + '"><span class="ico">🚫</span><span>' + LT("Cởi ra", "Take off") + "</span></button>";
      Ls.forEach(function (r) { h += itemCard(r, o, nw); });
    });
    return h + "</div></div>";
  }
  SC.home = function () {
    if (themeMode() === "girl") return homeGirl();
    var m = themeMode(), o = cur(), open = UI.roomCab || "", cab = CABS.find(function (c) { return c[0] === open; });
    var ch = findR(o.nhanvat), pet = findR(o.thucung), nx = nextTarget();
    var nw = newOnes().map(function (r) { return r.id; });
    var ke = list("ke").filter(owned);
    var h = '<div class="v8full rx"><div class="v8in">' + head(T("phong"), { sub: (Store.d.name ? Store.d.name + " · " : "") + T("ten-the-gioi"), world: 1 }) + hintHtml(nx);
    h += '<div class="rm-stage" id="rxStage" style="background-image:url(' + IMG(m === "girl" ? "nen/phong-gai.webp" : "nen/phong-trai.webp") + ')"><span class="rm-name">' + esc(ch ? ch.name : "") + "</span>" +
      '<button class="rm-arw l" data-act="v8arw" data-d="-1" aria-label="' + LT("Nhân vật trước", "Previous hero") + '"><img src="' + IMG("ui/mui-ten-trai.webp") + '" alt=""></button>' +
      '<button class="rm-arw r" data-act="v8arw" data-d="1" aria-label="' + LT("Nhân vật sau", "Next hero") + '"><img src="' + IMG("ui/mui-ten-phai.webp") + '" alt=""></button>' +
      figure(o) + (pet ? pic(IMG(pet.img), "rm-pet") : "") +
      (ke.length ? '<div class="shelf">' + ke.map(function (r) { return '<span title="' + esc(r.name) + '">' + pic(IMG(r.img)) + "</span>"; }).join("") + "</div>" : "") +
      cabinetsHtml(open, nw, m) + "</div>";
    if (cab) h += drawerHtml(cab, o, nw, m);
    h += "</div></div>" + window.NAVBAR("home");
    app.innerHTML = h;
    var st = app.querySelector(".rx-strip");
    st && (st.scrollLeft = UI.roomScroll || 0);
    UI.roomScroll = 0;
    if (cab) {
      var seenNow = newOnes().filter(function (r) { return cab[3].indexOf(r.slot) >= 0; });
      seenNow.length && markSeen(seenNow);
    }
    voOnce("rxhint", function (V) { /* không đọc gì thêm */ });
  };

  /* ---------- Kéo thả đồ từ tủ lên nhân vật ---------- */
  (function () {
    var D = null, ignoreUntil = 0;
    function stageOf() { return document.getElementById("rxStage"); }
    function overStage(e) {
      var s = stageOf(); if (!s) return false;
      var r = s.getBoundingClientRect();
      return e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    }
    document.addEventListener("pointerdown", function (e) {
      var b = e.target.closest && e.target.closest(".rx-it[data-drag]");
      if (!b || (e.pointerType === "mouse" && e.button !== 0)) return;
      D = { id: b.dataset.id, x: e.clientX, y: e.clientY, pid: e.pointerId, b: b, moved: false, touch: e.pointerType !== "mouse" };
    }, true);
    document.addEventListener("pointermove", function (e) {
      if (!D || D.pid !== e.pointerId) return;
      var dx = e.clientX - D.x, dy = e.clientY - D.y;
      if (!D.moved) {
        var go = D.touch ? (dy < -10 && Math.abs(dy) > Math.abs(dx) * 0.7) : Math.hypot(dx, dy) > 6;
        if (!go) return;
        D.moved = true;
        var im = D.b.querySelector("img");
        D.ghost = document.createElement("img");
        D.ghost.className = "rx-ghost"; D.ghost.draggable = false;
        D.ghost.src = im ? im.src : "";
        document.body.appendChild(D.ghost);
        D.b.classList.add("drag");
        try { D.b.setPointerCapture(e.pointerId); } catch (er) {}
      }
      D.ghost.style.left = e.clientX + "px"; D.ghost.style.top = e.clientY + "px";
      var s = stageOf(); s && s.classList.toggle("over", overStage(e));
      e.preventDefault();
    }, true);
    function end(e, cancel) {
      if (!D || D.pid !== e.pointerId) return;
      var d = D; D = null;
      if (!d.moved) return;
      ignoreUntil = Date.now() + 400;
      d.ghost && d.ghost.remove();
      d.b.classList.remove("drag");
      var s = stageOf(); s && s.classList.remove("over");
      if (cancel) return;
      if (overStage(e)) { if (useItem(findR(d.id), "drop")) roomRefresh(); }
      else G.toast(LT("Thả món đồ lên nhân vật nhé", "Drop the item onto your hero"));
    }
    document.addEventListener("pointerup", function (e) { end(e, false); }, true);
    document.addEventListener("pointercancel", function (e) { end(e, true); }, true);
    document.addEventListener("click", function (e) { if (Date.now() < ignoreUntil && e.target.closest && e.target.closest(".rx-it")) { e.stopPropagation(); e.preventDefault(); } }, true);
    document.addEventListener("dragstart", function (e) { if (e.target.closest && e.target.closest(".rx-it")) e.preventDefault(); });
  })();

  /* ---------- PHÒNG LUNA (bé gái) ---------- */
  function hintHtml(nx) {
    if (nx) {
      var line = nx.l ? T("bai:" + nx.l.id, LT("{qua} đang chờ con ở bài “" + nx.l.title + "”!", "{qua} is waiting for you in “" + nx.l.title + "”!")) : T("vung:" + nx.boss + ":trumloi", LT("Thử thách trùm đang chờ con!", "The boss challenge is waiting for you!"));
      return '<div class="hint"><img src="' + owlImg("cheer") + '" alt=""><div class="htx"><b>' + esc(T("cu")) + ":</b> " + esc(line.replace(/\{qua\}/g, nx.r ? nx.r.name : LT("Món quà", "The gift"))) + "</div>" +
        (nx.r ? '<span class="hrw">' + pic(IMG(nx.r.img)) + "</span>" : "") + '<button class="btn pri sm" data-act="' + (nx.boss ? "v8boss" : "v8go") + '" data-id="' + (nx.boss || nx.l.id) + '">' + LT('Đi lấy ▶', 'Go get it ▶') + '</button></div>';
    }
    return '<div class="hint"><img src="' + owlImg("wow") + '" alt=""><div class="htx"><b>' + esc(T("cu")) + LT(":</b> Con đã lấy hết quà chính rồi! Thử mức Khó hoặc Toán vui để giỏi hơn nữa nhé.</div></div>", ":</b> You've collected all the main gifts! Try the Hard level or Fun Math to get even better.</div></div>");
  }
  function lunaOwned() { return list("luna").filter(owned).map(function (r) { return r.id; }); }
  function homeGirl() {
    var nx = nextTarget(), all = list("luna");
    var h = '<div class="v8full rx"><div class="v8in">' + head(T("phong"), { sub: (Store.d.name ? Store.d.name + " · " : "") + T("ten-the-gioi") + " · " + all.filter(owned).length + "/" + all.length + LT(" món", " items"), world: 1 }) + hintHtml(nx) +
      '<div class="lunabox"><iframe id="lunaF" title="' + LT("Phòng thay đồ của Luna", "Luna's dress-up room") + '" src="luna/phong-luna.html?lang=' + window.LANG + '"></iframe></div></div></div>' + window.NAVBAR("home");
    app.innerHTML = h;
    markSeen(newOnes());
    voOnce("luna-hello", function (V) { setTimeout(function () { V.say(LT("Hôm nay mình mặc gì nhỉ?", "What should I wear today?")); }, 600); });
    lunaQuiet = Date.now() + 4000;
  }
  var lunaQuiet = 0, lunaLast = 0;
  window.addEventListener("message", function (e) {
    var d = e.data;
    if (!d || !d.toan4) return;
    var f = document.getElementById("lunaF");
    if (!f || e.source !== f.contentWindow) return;
    var o = cur();
    if (d.toan4 === "ready") {
      var wear = o.lunaWear || null; o.lunaWear = null;
      if (!o.lunaState) o.lunaState = { dress: "approved-7", bow: "bow-denim", necklace: "necklace-denim", earring: "earring-denim" };
      f.contentWindow.postMessage({ toan4: "init", owned: lunaOwned(), state: o.lunaState || null, wear: wear }, "*");
    } else if (d.toan4 === "state") { o.lunaState = d.v; Store.save(); if (window.VO && Date.now() > lunaQuiet && Date.now() - lunaLast > 9000) { lunaLast = Date.now(); window.VO.say("Mình thích bộ đồ bé chọn!"); } }
    else if (d.toan4 === "locked") { var r = findR(d.id); window.VO && window.VO.say("Món này đang khoá. Học bài để nhận nhé!"); r && pathSheet(r); }
  });

  /* ---------- Đường đến món quà ---------- */
  function pathFor(r) {
    var c = r.cond.split(":"), steps = [], seen = {};
    var need = function (id) {
      if (seen[id]) return; seen[id] = 1;
      var l = byId(id); if (!l) return;
      if (!Store.d.set.unlockAll) l.links.forEach(function (k) { if (!G.lessonPassed(k, 1)) need(k); });
      steps.push({ l: l, t: 1 });
    };
    if (c[0] === "bai") {
      var t = { de: 1, vua: 2, kho: 3 }[c[2] || "de"] || 1, l = byId(c[1]);
      if (!l) return [];
      if (!G.lessonPassed(l.id, 1)) need(l.id);
      if (t > 1) steps.push({ l: l, t: t });
      else if (!steps.length) steps.push({ l: l, t: 1 });
    } else if (c[0] === "trum") {
      LESSONS.filter(function (l) { return l.reg === c[1] && !l.optional && !G.lessonPassed(l.id, 1); }).forEach(function (l) { need(l.id); });
      steps.push({ boss: c[1] });
    } else if (c[0] === "sao") steps.push({ sao: +c[1] });
    else if (c[0] === "thi") steps.push({ exam: c[1], min: +c[2] || 8 });
    return steps;
  }
  function pathSheet(r) {
    var steps = pathFor(r), first = steps[0];
    var stepHtml = steps.map(function (s, i) {
      var t = s.l ? (s.t > 1 ? LT("Mức " + TIER_NAME[s.t] + ": ", TIER_NAME[s.t] + " level: ") : "") + s.l.title : s.boss ? T("vung:" + s.boss + ":trum", LT("Bài trùm", "Boss Challenge")) : s.exam ? LT((s.exam === "tong" ? "Bài thi tổng hợp" : "Phòng thi " + T("vung:" + s.exam + ":ten")) + ": đạt từ " + s.min + " điểm", (s.exam === "tong" ? "Comprehensive Exam" : T("vung:" + s.exam + ":ten") + " Exam Room") + ": score at least " + s.min + " points") : LT("Thu đủ " + s.sao + " ⭐ (con đang có " + G.totalStars() + ")", "Collect " + s.sao + " ⭐ (you have " + G.totalStars() + ")");
      return '<li class="' + (i === 0 ? "now" : "") + '"><span class="n">' + (i + 1) + "</span>" + esc(t) + "</li>";
    }).join("") + '<li class="pgift"><span class="n">🎁</span>' + esc(r.name) + "</li>";
    var line = r.cond.indexOf("bai:") === 0 ? T("bai:" + r.cond.split(":")[1], "") : r.cond.indexOf("trum:") === 0 ? T("vung:" + r.cond.split(":")[1] + ":trumloi", "") : "";
    G.sheet('<div class="path"><div class="prw">' + pic(IMG(r.img)) + '</div><h2 class="disp">' + esc(r.name) + '</h2><div class="pcond">🔒 ' + esc(condText(r)) + "</div>" +
      (line ? '<div class="story"><img src="' + owlImg("teach") + '" alt=""><p><b>' + esc(T("cu")) + ":</b> " + esc(line.replace(/\{qua\}/g, r.name)) + "</p></div>" : "") +
      (steps.length > 1 ? '<div class="muted" style="font-weight:800">' + LT('Đường đến món quà:', 'Path to the gift:') + '</div>' : "") + '<ol class="psteps">' + stepHtml + "</ol>" +
      (first && !first.sao ? '<button class="btn pri block" id="pgo">' + (first.exam ? LT("📝 Vào phòng thi", "📝 Enter the exam room") : first.boss ? LT("⚔️ Gặp trùm ngay", "⚔️ Face the boss now") : steps.length > 1 ? LT("▶ Học bài “" + esc(first.l.title) + "” trước", "▶ Study “" + esc(first.l.title) + "” first") : LT("▶ Đi học ngay", "▶ Start learning now")) + "</button>" : "") +
      '<button class="btn block" id="pno" style="margin-top:8px">' + LT('Để sau', 'Maybe later') + '</button></div>', function (bg, close) {
      bg.querySelector("#pno").onclick = close;
      var b = bg.querySelector("#pgo");
      b && (b.onclick = function () {
        close(); UI.v8target = r.id;
        if (first.exam) { G.Sfx.tap(); G.EXAM && G.EXAM.intro(first.exam); return; }
        if (first.boss) { G.Sfx.tap(); window.VO && window.VO.say("Gặp trùm ngay."); G.startBoss(first.boss); return; }
        UI.reg = first.l.reg; UI.stack = [{ n: "home" }]; G.go("lesson", { id: first.l.id });
      });
    });
  }

  /* ---------- Bản đồ phiêu lưu ---------- */
  var POS = { boy: { so: [3, 22, 9, 7], toan: [53, 33, 100, 25], ps: [3, 57, 0, 50], hinh: [53, 71, 100, 63] }, girl: { so: [3, 24, 0, 11], toan: [53, 36, 100, 22], ps: [3, 62, 0, 52], hinh: [53, 73, 100, 63] } };
  SC.map = function () {
    var m = themeMode(), mapImg = IMG(m === "girl" ? "nen/ban-do-gai.webp" : "nen/ban-do-trai.webp");
    var h = '<div class="v8full"><div class="v8in">' + head(T("ten-the-gioi"), { sub: LT("Cùng " + T("cu") + " đi qua 4 vùng đất", "Journey with " + T("cu") + " through 4 lands") }) + '<div class="wmap"><img src="' + mapImg + '" alt="">';
    ZONES.forEach(function (id, i) {
      var p = POS[m][id], ls = LESSONS.filter(function (l) { return l.reg === id && !l.optional; }),
        ps = ls.filter(function (l) { return G.lessonPassed(l.id, 1); }).length, won = Store.d.boss[id] > 0;
      h += '<button class="zbtn' + (won ? " done" : "") + '" style="left:' + p[0] + "%;top:" + p[1] + '%" data-act="v8zone" data-id="' + id + '"><span class="no">' + (won ? "✓" : i + 1) + '</span><span style="flex:1;min-width:0"><b>' + esc(T("vung:" + id + ":ten")) +
        "</b><small>" + ps + "/" + ls.length + LT(" bài" + (won ? " · đã thắng trùm" : ""), (ls.length === 1 ? " lesson" : " lessons") + (won ? " · boss beaten" : "")) + '</small><span class="pg"><i style="width:' + Math.round(ps / Math.max(1, ls.length) * 100) + '%"></i></span></span></button>';
    });
    h += "</div>" + G.missionStrip(G.nextLesson()) + '<p class="muted" style="text-align:center;font-size:.85rem">' + LT('Phiên bản ' + G.CONFIG.version + " · " + LESSONS.length + " bài học · " + G.CONFIG.curriculumNote, 'Version ' + G.CONFIG.version + " · " + LESSONS.length + " lessons · " + G.CONFIG.curriculumNote) + "</p></div></div>" + window.NAVBAR("map");
    app.innerHTML = h;
  };
  SC.zone = function (p) {
    var m = themeMode(), id = p.id, P = POS[m][id], nx = G.nextLesson(), mapImg = IMG(m === "girl" ? "nen/ban-do-gai.webp" : "nen/ban-do-trai.webp");
    var ls = LESSONS.filter(function (l) { return l.reg === id; });
    var stars = function (n) { return '<span class="st">' + [0, 1, 2].map(function (k) { return starSvg(k < n); }).join("") + "</span>"; };
    var rwBox = function (r) { return r ? '<span class="rw ' + (owned(r) ? "ok" : "lk") + '" title="' + esc(r.name) + '">' + pic(IMG(r.img)) + "</span>" : ""; };
    var h = '<div class="v8full"><div class="v8in"><div class="zhead"><div class="art" style="background-image:url(' + mapImg + ");background-position:" + P[2] + "% " + P[3] + '%"></div>' +
      '<button class="back" data-act="back" aria-label="' + LT('Quay lại', 'Back') + '">‹</button><div class="ttl"><b>' + esc(T("vung:" + id + ":ten")) + "</b><small>" + esc(T("vung:" + id + ":phu")) + "</small></div></div>" +
      '<div class="story"><img src="' + owlImg("teach") + '" alt=""><p><b>' + esc(T("cu")) + ":</b> " + esc(T("vung:" + id + ":vao")) + "</p></div>";
    var k = 0;
    ls.forEach(function (l) {
      var un = G.unlocked(l), pc = Store.lesson(l.id).pass.filter(Boolean).length;
      h += '<button class="lrow' + (un ? "" : " lock") + (l.optional ? " opt" : "") + '" data-act="lesson" data-id="' + l.id + '"><span class="bn">' + (l.adv ? LT("Nâng cao", "Advanced") : l.optional ? LT("Toán vui", "Fun Math") : LT("Bài " + (++k), "Lesson " + k)) + '</span><span class="tx"><b>' + esc(l.title) + "</b>" + stars(pc) + "</span>" +
        rwBox(rewardOf("bai:" + l.id)) + '<span class="go">' + (un ? (pc === 3 ? "✓" : "▶") : "🔒") + "</span></button>";
    });
    var open = G.bossOpen(id), b = Store.d.boss[id] || 0;
    h += '<button class="lrow boss' + (open ? "" : " lock") + '" data-act="v8boss" data-id="' + id + '"><span class="bn">' + LT('Trùm', 'Boss') + '</span><span class="tx"><b>' + esc(T("vung:" + id + ":trum", LT("Thử thách trùm", "Boss Challenge"))) + "</b>" + stars(b) + "</span>" +
      rwBox(rewardOf("trum:" + id)) + '<span class="go">' + (open ? "⚔️" : "🔒") + "</span></button>";
    h += "</div></div>" + window.NAVBAR("map");
    app.innerHTML = h;
  };

  /* ---------- Thẻ câu chuyện trên màn bài học ---------- */
  var origLessonSC = SC.lesson;
  var origZone = SC.zone;
  SC.zone = function (p) { origZone(p); voOnce("vao:" + p.id + themeMode(), function (V) { V.story("vung:" + p.id + ":vao"); }); };
  SC.lesson = function (p) {
    origLessonSC(p);
    var r = rewardOf("bai:" + p.id), line = T("bai:" + p.id, "");
    if (!r && !line) return;
    var main = app.querySelector("main");
    if (!main) return;
    var d = document.createElement("div");
    d.className = "lstory";
    d.innerHTML = '<img class="o" src="' + owlImg("cheer") + '" alt=""><div class="lst">' + (line ? "<b>" + esc(T("cu")) + ":</b> " + esc(line.replace(/\{qua\}/g, r ? r.name : "")) : "") +
      (r ? '<div class="lsq">' + LT('🎁 Qua mức Dễ nhận: <b>', '🎁 Pass the Easy level to get: <b>') + esc(r.name) + "</b>" + (owned(r) ? LT(" ✓ đã có", " ✓ owned") : "") + "</div>" : "") + "</div>" + (r ? '<span class="hrw">' + pic(IMG(r.img)) + "</span>" : "");
    main.insertBefore(d, main.firstChild);
    line && voOnce("bai:" + p.id + themeMode(), function (V) { V.story("bai:" + p.id); });
  };

  /* ---------- Huy hiệu mức Khó trong Thành tích ---------- */
  var origStats = SC.stats;
  SC.stats = function () {
    origStats();
    var main = app.querySelector("main");
    if (!main) return;
    var got = LESSONS.filter(function (l) { return G.lessonPassed(l.id, 3); });
    var d = document.createElement("section");
    d.className = "card flat";
    d.innerHTML = '<h2 class="disp" style="margin-bottom:4px">' + LT('Huy hiệu mức Khó', 'Hard level badges') + '</h2><div class="muted" style="margin-bottom:8px">' + LT('Qua mức Khó của bài nào thì nhận huy hiệu bài đó (' + got.length + "/" + LESSONS.length + ').', 'Pass the Hard level of a lesson to earn the badge for that lesson (' + got.length + "/" + LESSONS.length + ').') + '</div><div class="badges">' +
      LESSONS.map(function (l) { var ok = got.indexOf(l) >= 0; return '<div class="bdg' + (ok ? "" : " lk") + '"><img src="' + G.assetUrl("assets/rewards/medal.webp") + '" alt=""><span>' + esc(l.short || l.title) + "</span></div>"; }).join("") + "</div>";
    main.insertBefore(d, main.children[1] || null);
  };

  /* ---------- Cài đặt: thêm nút đổi thế giới và căn chỉnh ---------- */
  var origSet = SC.settings;
  SC.settings = function () {
    origSet();
    var main = app.querySelector("main");
    if (!main) return;
    var d = document.createElement("section");
    d.className = "card flat";
    var lg = document.createElement("section");
    lg.className = "card flat";
    lg.innerHTML = '<h2 class="disp" style="font-size:1.25rem;margin-bottom:8px">🌐 Ngôn ngữ / Language</h2><div class="parts" style="display:flex;gap:8px">' +
      '<button class="btn sm grow' + (window.LANG === "vi" ? " pri" : "") + '" data-act="v8setlang" data-l="vi">🇻🇳 Tiếng Việt</button>' +
      '<button class="btn sm grow' + (window.LANG === "en" ? " pri" : "") + '" data-act="v8setlang" data-l="en">🇺🇸 English</button></div>';
    main.insertBefore(lg, main.children[1] || null);
    d.innerHTML = '<h2 class="disp" style="font-size:1.25rem;margin-bottom:8px">' + LT('Nhân vật và phần thưởng', 'Heroes and rewards') + '</h2><div class="parts"><button class="btn sm block" data-act="v8splash">' + LT('🌍 Đổi thế giới / chọn lại nhân vật', '🌍 Switch world / pick a hero again') + '</button>' + (themeMode() === "girl" || G.TU_DO_TI ? "" : '<button class="btn sm block" data-act="v8align">' + LT('🧩 Căn chỉnh đồ trên nhân vật (phụ huynh)', '🧩 Adjust outfit position on hero (parents)') + '</button>') + '<button class="btn sm block" data-act="v8story" data-i="0">' + LT('📖 Xem lại truyện mở đầu', '📖 Watch the opening story again') + '</button><button class="btn sm block" data-act="v8rec">' + (Store.d.set.rec === false ? LT("🔇 Giọng thu âm: đang TẮT (bấm để bật)", "🔇 Recorded voice: OFF (tap to turn on)") : LT("🔊 Giọng thu âm: đang BẬT (bấm để tắt)", "🔊 Recorded voice: ON (tap to turn off)")) + '</button></div>';
    main.insertBefore(d, main.children[1] || null);
  };

  /* ---------- Công cụ căn chỉnh đồ (phụ huynh) ---------- */
  SC.align = function () {
    var m = themeMode(), A = UI.al = UI.al || {};
    var chars = list("nhanvat"); A.ch = A.ch && findR(A.ch) ? A.ch : cur().nhanvat;
    A.slot = A.slot || "dau";
    var items = list(A.slot); A.it = A.it && items.some(function (r) { return r.id === A.it; }) ? A.it : (items[0] && items[0].id);
    var a = anchor(m, A.ch, A.slot), it = findR(A.it);
    var o = { nhanvat: A.ch }; o[A.slot] = A.it;
    var line = A.ch + " | " + (m === "girl" ? "gai" : "trai") + " | " + ["dau", "lung", "tay"].map(function (s) { return anchor(m, A.ch, s).join(","); }).join(" | ") + " | " + ((CH[m + ":" + A.ch] || {}).main ? "x" : "");
    app.innerHTML = '<div class="v8full"><div class="v8in">' + head(LT("Căn chỉnh đồ", "Adjust outfit"), { back: 1, sub: LT("Kéo món đồ vào đúng chỗ", "Drag the item to the right spot") }) +
      '<div class="al-row"><select id="alc">' + chars.map(function (r) { return '<option value="' + r.id + '"' + (r.id === A.ch ? " selected" : "") + ">" + esc(r.name) + "</option>"; }).join("") + "</select>" +
      '<select id="als">' + ["dau", "lung", "tay"].map(function (s) { return '<option value="' + s + '"' + (s === A.slot ? " selected" : "") + ">" + SLOT_NAME[s] + "</option>"; }).join("") + "</select>" +
      '<select id="ali">' + items.map(function (r) { return '<option value="' + r.id + '"' + (r.id === A.it ? " selected" : "") + ">" + esc(r.name) + "</option>"; }).join("") + "</select></div>" +
      '<div class="rm-stage al-stage" id="alst" style="background-image:url(' + IMG(m === "girl" ? "nen/phong-gai.webp" : "nen/phong-trai.webp") + ')">' + figure(o, m, { only: it ? { slot: A.slot, img: it.img, id: it.id } : null, cls: "al" }) + "</div>" +
      '<label class="al-size">' + LT('Độ rộng: ', 'Width: ') + '<input type="range" id="alw" min="10" max="200" value="' + a[2] + '"> <b id="alwv">' + a[2] + "%</b></label>" +
      '<div class="card flat"><div class="muted">' + LT('Dòng cho file <b>du-lieu/nhan-vat.js</b> (chép đè dòng có mã <b>' + esc(A.ch) + "</b>):", 'Line for file <b>du-lieu/nhan-vat.js</b> (replace the line with code <b>' + esc(A.ch) + "</b>):") + "</div><textarea class=\"txt\" id=\"alline\" rows=\"2\" readonly style=\"font-family:monospace;font-size:.85rem\">" + esc(line) + '</textarea></div>' +
      '<div class="rm-act"><button class="btn sm" id="alreset">' + LT('↺ Về theo file', '↺ Reset to file') + '</button><button class="btn sm" id="alcopy">' + LT('📋 Chép dòng', '📋 Copy line') + '</button><button class="btn sm pri" data-act="back">' + LT('Xong', 'Done') + '</button></div>' +
      '<p class="muted" style="font-size:.85rem">' + LT('Vị trí đã kéo được lưu ngay trên máy này. Muốn dùng cho mọi máy (và bản đóng gói) thì chép dòng trên vào file nhan-vat.js.', 'The position you dragged is saved right on this device. To use it on every device (and the packaged app), copy the line above into the file nhan-vat.js.') + '</p></div></div>';
    var st = document.getElementById("alst"), fig = st.querySelector(".v8fig"), ly = fig && fig.querySelector(".ly");
    var setA = function (v) { CAL[m + ":" + A.ch + ":" + A.slot] = v; saveCal(); };
    document.getElementById("alc").onchange = function (e) { A.ch = e.target.value; SC.align(); };
    document.getElementById("als").onchange = function (e) { A.slot = e.target.value; A.it = null; SC.align(); };
    document.getElementById("ali").onchange = function (e) { A.it = e.target.value; SC.align(); };
    document.getElementById("alw").oninput = function (e) { var v = a.slice(); v[2] = +e.target.value; a = v; setA(v); ly && (ly.style.width = v[2] + "%"); document.getElementById("alwv").textContent = v[2] + "%"; };
    document.getElementById("alw").onchange = function () { SC.align(); };
    document.getElementById("alreset").onclick = function () { delete CAL[m + ":" + A.ch + ":" + A.slot]; saveCal(); SC.align(); };
    document.getElementById("alcopy").onclick = function () { var ta = document.getElementById("alline"); ta.select(); try { document.execCommand("copy"); G.toast(LT("Đã chép dòng", "Line copied")); } catch (e) {} };
    if (ly && fig) {
      var drag = null;
      ly.addEventListener("pointerdown", function (e) { drag = { x: e.clientX, y: e.clientY, a: a.slice() }; ly.setPointerCapture(e.pointerId); e.preventDefault(); });
      ly.addEventListener("pointermove", function (e) {
        if (!drag) return;
        var rc = fig.getBoundingClientRect(), v = drag.a.slice();
        v[0] = Math.round((drag.a[0] + (e.clientX - drag.x) / rc.width * 100) * 10) / 10;
        v[1] = Math.round((drag.a[1] + (e.clientY - drag.y) / rc.height * 100) * 10) / 10;
        ly.style.left = v[0] + "%"; ly.style.top = v[1] + "%"; a = v;
      });
      var end = function () { if (!drag) return; drag = null; setA(a); SC.align(); };
      ly.addEventListener("pointerup", end); ly.addEventListener("pointercancel", end);
    }
  };

  /* ---------- Nhận quà ---------- */
  function showGifts(rs, done) {
    if (!rs.length) { done && done(); return; }
    var r = rs[0], rest = rs.slice(1);
    var bg = document.createElement("div");
    bg.className = "gift";
    bg.innerHTML = '<button class="gclose" data-g="ok" aria-label="' + LT('Đóng', 'Close') + '">✕</button><div class="gbox" style="background-image:url(' + IMG("nen/nhan-qua.webp") + ')">' + (rs.length > 1 ? '<span class="gcount">+' + rs.length + "</span>" : "") +
      '<div class="gin"><img class="gt" src="' + IMG("ui/chu-nhan-qua.webp") + '" alt="' + LT('Nhận quà!', 'Get your gift!') + '"><div class="gstage"><img class="gchest" src="' + IMG("ui/ruong.webp") + '" alt="">' + pic(IMG(r.img), "gitem") + "</div>" +
      '<div class="gmsg">' + LT('Con đã mở khoá<b>', 'You unlocked<b>') + esc(r.name) + "</b>" + esc(r.msg || LT(SLOT_NAME[r.slot] + " đã được cất vào " + T("phong"), SLOT_NAME[r.slot] + " was put away in " + T("phong"))) + "</div>" +
      '<div class="gbtns"><button class="v8btnimg" data-g="ok"><img src="' + IMG("ui/nut-tuyet-voi.webp") + '" alt="' + LT('Tuyệt vời!', 'Awesome!') + '"></button>' +
      (r.slot === "ke" ? "" : '<button class="glink" data-g="room">' + (r.slot === "luna" ? LT("👗 Mặc thử cho Luna ngay", "👗 Try it on Luna now") : "👕 " + (r.slot === "anhdd" ? LT("Dùng làm ảnh đại diện", "Use as profile picture") : r.slot === "thucung" ? LT("Cho đi cùng ngay", "Take along now") : r.slot === "nhanvat" ? LT("Chọn bạn này ngay", "Choose this friend now") : LT("Mặc thử ngay", "Try it on now"))) + "</button>") + "</div></div></div>";
    document.body.appendChild(bg);
    markSeen([r]);
    try { G.Sfx.win(); } catch (e) {}
    try { window.VO && (r.msg && window.VO.say(r.msg) || window.VO.say("Con vừa mở khóa một món quà mới!")); } catch (e) {}
    var onKey = function (e) {
      if (!bg.isConnected) { document.removeEventListener("keydown", onKey); return; }
      if (e.key === "Escape") { var k = bg.querySelector("[data-g=ok]"); k && k.click(); }
    };
    document.addEventListener("keydown", onKey);
    bg.addEventListener("click", function (e) {
      var b = e.target.closest("[data-g]");
      if (!b) { if (e.target !== bg) return; b = bg.querySelector("[data-g=ok]"); }   /* bấm ra ngoài khung = Tuyệt vời! */
      bg.remove();
      if (b.dataset.g === "room") {
        if (r.slot === "nguoi") { var mainCh = list("nhanvat").find(function (c) { return (CH[themeMode() + ":" + c.id] || {}).main; }); mainCh && (cur().nhanvat = mainCh.id); }
        if (r.slot === "luna") cur().lunaWear = r.id; else { cur()[r.slot] = ""; equip(r); }
        UI.roomTab = (TABS.find(function (t) { return t[2].indexOf(r.slot) >= 0; }) || TABS[0])[0];
        markSeen(rest); UI.stack = [{ n: "home" }]; G.render(); finaleCheck(); return;
      }
      showGifts(rest, done);
    });
  }
  function finaleCheck() {
    var o = cur();
    if (o.fin || !ZONES.every(function (z) { return Store.d.boss[z] > 0; })) return;
    o.fin = 1; Store.save();
    G.sheet('<div style="text-align:center"><img src="' + IMG("ui/hai-chu-cu.webp") + '" style="width:70%" alt=""><h2 class="disp" style="font-size:1.6rem">' + LT('Hoàn thành hành trình!', 'Journey complete!') + '</h2><p style="font-size:1.08rem;line-height:1.5">' + esc(T("ket")) + '</p><button class="btn pri block" id="fin0">' + LT('Tuyệt vời!', 'Awesome!') + '</button></div>', function (bg, close) { bg.querySelector("#fin0").onclick = close; window.VO && window.VO.story("ket"); });
    try { G.confetti(); } catch (e) {}
  }
  var origResult = SC.result;
  SC.result = function (r) {
    origResult(r);
    var rs = newOnes();
    if (rs.length) {
      var p = document.createElement("div");
      p.className = "fb ok";
      p.innerHTML = LT("🎁 Con vừa mở khoá " + rs.length + " món quà cho " + esc(T("phong")) + "!", "🎁 You just unlocked " + rs.length + (rs.length === 1 ? " gift" : " gifts") + " for " + esc(T("phong")) + "!");
      var parts = app.querySelector("main .parts");
      parts && parts.parentNode.insertBefore(p, parts);
      setTimeout(function () { showGifts(rs, finaleCheck); }, 1300);
    } else setTimeout(finaleCheck, 900);
  };

  /* ---------- Hỏi tên (khi thêm hồ sơ bé) ---------- */
  window.ASKNAME = function () {
    G.sheet('<div style="text-align:center"><img src="' + owlImg("cheer") + '" style="width:110px" alt=""><h2 class="disp" style="font-size:1.4rem;margin:4px 0">' + LT('Chào bạn mới!', 'Hello, new friend!') + '</h2><p style="margin:0 0 8px">' + LT('Con tên là gì nhỉ?', 'What\'s your name?') + '</p><input class="txt" id="nm0" maxlength="20" autocomplete="off" placeholder="' + LT('Tên của con', "Your name") + '" ><button class="btn pri block" id="nm0b" style="margin-top:10px">' + LT('Tiếp tục ▶', 'Continue ▶') + '</button></div>', function (bg, close) {
      bg.querySelector("#nm0b").onclick = function () {
        Store.d.name = (bg.querySelector("#nm0").value || "").trim() || LT("bạn nhỏ", "friend"); Store.save(); close();
        UI.stack = [{ n: "splash" }]; G.render();
      };
    });
  };

  /* ---------- Nút bấm ---------- */
  function enterRoom() {
    var o = cur();
    if (!o.story) { UI.stack = [{ n: "story", p: { i: 0 } }]; G.render(); return; }
    UI.stack = [{ n: "home" }]; G.render();
  }
  Object.assign(ACT, {
    v8world: function (el) { var m = el.dataset.mode; G.Sfx.tap(); G.setTheme(m); syncNames(); V()[m].picked ? enterRoom() : G.go("pick", { mode: m }); },
    v8pick: function (el) { G.Sfx.tap(); G.replace("pick", { mode: el.dataset.mode }); },
    v8av: function (el) { G.Sfx.pop(); var nm = document.getElementById("v8nm"); nm && (Store.d.name = nm.value.trim()); themeMode() !== "girl" && (cur().anhdd = el.dataset.id); Store.save(); G.replace("pick", { mode: themeMode() }); },
    v8start: function () {
      var nm = document.getElementById("v8nm"), v = nm ? nm.value.trim() : "";
      if (!v && !Store.d.name) { G.toast(LT("Con nhập tên của mình nhé", "Please type your name")); nm && nm.focus(); return; }
      v && (Store.d.name = v);
      G.Sfx.init(); G.Sfx.ok();
      var o = cur(); o.picked = 1;
      list().forEach(function (r) { r.cond !== "cosan" && owned(r) && o.seen.indexOf(r.id) < 0 && o.seen.push(r.id); });
      Store.save(); enterRoom();
    },
    v8story: function (el) {
      var i = +el.dataset.i;
      if (i >= 3) { cur().story = 1; Store.save(); UI.stack = [{ n: "home" }]; G.render(); return; }
      G.Sfx.tap(); UI.stack = [{ n: "story", p: { i: i } }]; G.render();
    },
    v8storyskip: function () { cur().story = 1; Store.save(); UI.stack = [{ n: "home" }]; G.render(); },
    v8splash: function () { G.Sfx.tap(); UI.stack = [{ n: "splash" }]; G.render(); },
    v8set: function () { G.Sfx.tap(); G.go("settings"); },
    v8rec: function () { Store.d.set.rec = Store.d.set.rec === false; Store.save(); G.Sfx.tap(); G.replace("settings"); Store.d.set.rec !== false && window.VO && window.VO.say("Tuyệt vời!"); },
    v8align: function () { G.Sfx.tap(); G.go("align"); },
    v8zone: function (el) { G.Sfx.tap(); UI.reg = el.dataset.id; G.go("zone", { id: el.dataset.id }); },
    v8tab: function (el) { G.Sfx.tap(); UI.roomCab = el.dataset.t; G.replace("home"); },
    v8cab: function (el) { G.Sfx.tap(); UI.roomCab = UI.roomCab === el.dataset.c ? "" : el.dataset.c; UI.roomScroll = 0; G.replace("home"); },
    v8off: function (el) { G.Sfx.tap(); cur()[el.dataset.slot] = ""; Store.save(); roomRefresh(); },
    v8setlang: function (e) { var l = e && e.dataset ? e.dataset.l : null; if (l && l !== window.LANG) { G.Sfx.tap(); window.setLang(l); } },
    v8lang: function () { G.Sfx.tap(); window.setLang(window.LANG === "en" ? "vi" : "en"); },
    v8go: function (el) { var l = byId(el.dataset.id); var r = rewardOf("bai:" + el.dataset.id); r && !owned(r) ? pathSheet(r) : (G.Sfx.tap(), UI.stack = [{ n: "home" }], G.go("lesson", { id: l.id })); },
    v8boss: function (el) {
      var id = el.dataset.id;
      if (!G.bossOpen(id)) { var r = rewardOf("trum:" + id); r ? pathSheet(r) : G.toast(LT("Qua mức Dễ của mọi bài trong vùng để gặp trùm nhé", "Pass the Easy level of every lesson in this region to meet the boss")); return; }
      G.Sfx.tap();
      G.sheet('<div style="text-align:center"><div style="font-size:3rem">⚔️</div><h2 class="disp">' + esc(T("vung:" + id + ":trum", LT("Bài trùm", "Boss Challenge"))) + '</h2><p style="font-size:1.05rem">' + esc(T("vung:" + id + ":trumloi", "")) + '</p><button class="btn pri block" id="bgo">' + LT('Nhận lời thách đấu ▶', 'Accept the challenge ▶') + '</button></div>', function (bg, close) {
        bg.querySelector("#bgo").onclick = function () { close(); G.startBoss(id); };
        window.VO && window.VO.story("vung:" + id + ":trumloi");
      });
    },
    v8eq: function (el) {
      var r = findR(el.dataset.id);
      if (r && useItem(r, "tap")) roomRefresh();
    },
    v8arw: function (el) {
      var d = +el.dataset.d, L = list("nhanvat").filter(owned), o = cur();
      if (L.length < 2) { G.toast(LT("Làm thêm bài để có bạn đồng hành mới nhé!", "Do more lessons to unlock new companions!")); return; }
      var i = L.findIndex(function (r) { return r.id === o.nhanvat; });
      o.nhanvat = L[(i + d + L.length) % L.length].id; Store.save(); G.Sfx.tap(); G.replace("home");
    }
  });
  var origLesson = ACT.lesson;
  ACT.lesson = function (el) { var l = byId(el.dataset.id); l && (UI.reg = l.reg); origLesson(el); };

  /* ---------- Khởi động ---------- */
  V(); syncNames();
  var v = V();
  UI.stack = v[themeMode()].picked ? [{ n: v[themeMode()].story ? "home" : "story", p: { i: 0 } }] : [{ n: "splash" }];
  G.V8 = { RW: RW, CH: CH, ST: ST, owned: owned, newOnes: newOnes, showGifts: showGifts, pathFor: pathFor, nextTarget: nextTarget };
  G.V8 = Object.assign(G.V8 || {}, { newOnes: newOnes, showGifts: showGifts, finaleCheck: finaleCheck, owned: owned, condText: condText, T: T, IMG: IMG, list: list, pathSheet: pathSheet, owlImg: owlImg, findR: findR });
})();