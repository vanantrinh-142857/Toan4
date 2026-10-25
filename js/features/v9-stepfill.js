//# features/v9-stepfill.js — v9: "LÀM LẠI CÙNG CÚ" (sau 2 lần sai) và "VÍ DỤ MỜ DẦN" (sau phần Học cách làm) =====
//# Tự chứa trong một hàm bọc — chạy độc lập, không cần build.
/* Dùng chung một khung điền bước (StepFill): các bước lời giải của câu hỏi (steps: {t, v}) được che số v thành ô trống,
   bé điền lần lượt bằng bàn phím số. Bước phía sau ô đang làm được giấu hẳn để không lộ đáp số.
   Sai 2 lần ở một ô → Cú điền giúp và đi tiếp (không bị kẹt). */
(function () {
  "use strict";
  var G = window, T = G.T4.T, Store = G.Store, X = G.T4.v9;
  var esc = function (s) { return G.esc(String(s == null ? "" : s)); };
  function norm(s) { return String(s == null ? "" : s).replace(/[\s.,\u00a0\u202f]/g, ""); }
  function fv(v) { return G.fmt ? G.fmt(v) : String(v); }
  /* tách chữ của bước quanh lần xuất hiện CUỐI của số v (giống maskStep của lõi) */
  function split(t, v) {
    var cands = [fv(v), String(v)];
    for (var i = 0; i < cands.length; i++) {
      var e = cands[i].replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      var re = new RegExp("(?<![\\d\\w])(?<!\\d[\\u00a0\\u202f ,.])(" + e + ")(?!\\d)(?![\\u00a0\\u202f ,.]\\d)(?!.*" + e + ")");
      var m = String(t).match(re);
      if (m) return [t.slice(0, m.index), t.slice(m.index + m[1].length)];
    }
    return null;
  }
  function vsteps(q) {
    return (q.steps || []).map(function (x, i) { return i; }).filter(function (i) { var x = q.steps[i]; return x.v != null && typeof x.v !== "object" && split(x.t, x.v); });
  }
  function StepFill(box, steps, blanks, onDone) {
    var vals = {}, tries = {}, cur = 0, helped = 0, first = 0, busy = false;
    function render(msg, mc) {
      var stop = cur < blanks.length ? blanks[cur] : steps.length, h = '<div class="v9-steps">';
      steps.forEach(function (s, i) {
        var bi = blanks.indexOf(i), cls = "v9-st", body;
        if (i > stop) { h += '<div class="v9-st lock"><span class="k">' + (i + 1) + '</span><span class="tx">🔒 ' + T("Bước tiếp theo", "Next step") + "</span></div>"; return; }
        if (bi < 0) { body = G.rich(s.t); cls += " given"; }
        else {
          var sp = split(s.t, s.v);
          if (bi < cur) { cls += " ok"; body = G.rich(sp[0]) + '<span class="v9-blank ok">' + esc(fv(s.v)) + "</span>" + G.rich(sp[1]); }
          else { cls += " cur"; body = G.rich(sp[0]) + '<span class="v9-blank act">' + (vals[i] ? esc(vals[i]) : "&nbsp;") + "</span>" + G.rich(sp[1]); }
        }
        h += '<div class="' + cls + '"><span class="k">' + (i + 1) + '</span><span class="tx">' + body + "</span></div>";
      });
      h += '</div><div class="v9-msg ' + (mc || "") + '">' + (msg || "") + "</div>";
      if (cur < blanks.length) {
        h += '<div class="v9-pad">' + ["7", "8", "9", "del", "4", "5", "6", "0", "1", "2", "3", "ok"].map(function (k) {
          return '<button data-v9k="' + k + '" class="' + (k === "del" ? "del" : k === "ok" ? "go" : "") + '">' + (k === "del" ? "⌫" : k === "ok" ? T("Điền", "Enter") : k) + "</button>";
        }).join("") + "</div>";
      }
      box.innerHTML = h;
    }
    function check() {
      var i = blanks[cur], s = steps[i], val = vals[i] || "";
      if (!val) { G.toast(T("Con nhập số vào ô vàng nhé", "Type a number in the yellow box")); return; }
      if (norm(val) === norm(fv(s.v)) || +norm(val) === +s.v) {
        if (!tries[i]) first++;
        G.Sfx.ok && G.Sfx.ok(); cur++;
        if (cur >= blanks.length) { render("✅ " + T("Đúng hết rồi! Con tự làm được từng bước.", "All correct! You did every step yourself."), "ok"); onDone && onDone({ first: first, helped: helped, total: blanks.length }); }
        else render("✓ " + T("Đúng! Sang bước tiếp nhé.", "Correct! On to the next step."), "ok");
        return;
      }
      tries[i] = (tries[i] || 0) + 1; G.Sfx.bad && G.Sfx.bad();
      if (tries[i] >= 2) {
        helped++; vals[i] = fv(s.v); busy = true;
        render("💡 " + T("Số đúng là <b>" + esc(fv(s.v)) + "</b>. Con nhìn lại cách tính ở bước này nhé.", "The right number is <b>" + esc(fv(s.v)) + "</b>. Look again at how this step works."), "info");
        setTimeout(function () { busy = false; cur++; if (cur >= blanks.length) { render("✅ " + T("Xong rồi! Lần sau con tự làm được thôi.", "Done! You'll get it next time."), "ok"); onDone && onDone({ first: first, helped: helped, total: blanks.length }); } else render(); }, 1800);
      } else { vals[i] = ""; render(T("Chưa đúng, con tính lại bước này nhé.", "Not quite. Work this step out again."), "no"); }
    }
    box.addEventListener("click", function (e) {
      var b = e.target.closest && e.target.closest("[data-v9k]"); if (!b || busy || cur >= blanks.length) return;
      e.stopPropagation();
      var k = b.getAttribute("data-v9k"), i = blanks[cur];
      if (k === "ok") return check();
      G.Sfx.tap && G.Sfx.tap();
      if (k === "del") vals[i] = (vals[i] || "").slice(0, -1); else if ((vals[i] || "").length < 9) vals[i] = (vals[i] || "") + k;
      render();
    });
    render();
  }

  /* ---------- Làm lại cùng Cú ---------- */
  G.ACT.redo = function () {
    var q = G.curQ(), s = q.st, bl = vsteps(q);
    if (!bl.length) { s.redone = 1; G.ansRender(); G.toast(T("Con đọc kĩ cách giải mẫu rồi làm câu tương tự nhé", "Read the sample solution, then try a similar one")); return; }
    G.Sfx.tap && G.Sfx.tap();
    G.sheet('<div class="v9-redo"><div class="v9-fbx"><img src="' + X.mimg("teach") + '" alt=""><div><b>' + T("Không sao! Mình làm lại cùng nhau nhé.", "No worries! Let's redo it together.") + "</b><br>" +
      T("Con điền từng ô, " + X.owl() + " đi bên cạnh.", "Fill in each box, " + X.owl() + " is right here.") + '</div></div><div class="q v9-q">' + G.rich(q.q) + '</div><div data-r="sf"></div>' +
      '<button class="btn block" data-k="x" style="margin-top:8px">' + T("Đóng", "Close") + "</button></div>",
      function (bg, close) {
        bg.querySelector("[data-k=x]").onclick = close;
        StepFill(bg.querySelector("[data-r=sf]"), q.steps, bl, function () {
          s.redone = 1;
          setTimeout(function () { close(); G.ansRender(); G.toast(T("Giỏi lắm! Giờ làm 1 câu tương tự để chắc chắn nhé", "Great! Now one similar question to be sure")); }, 1300);
        });
      });
  };

  /* ---------- Ví dụ mờ dần ---------- */
  function startFaded(id) {
    var l = G.byId(id); if (!l) return;
    var r = G.mkRng(Date.now() % 2147483647), exs = [];
    for (var k = 0; k < 2; k++) {
      var q = null, g = 0;
      do { q = l.gen(1, r); g++; } while (g < 40 && (vsteps(q).length < 1 || exs.some(function (x) { return x.q === q.q; })));
      exs.push(q);
    }
    var step = 0;
    G.Sfx.tap && G.Sfx.tap();
    G.sheet('<div class="v9-faded"><div class="v9-chips" data-r="ch"></div><div class="v9-fbx"><img src="' + X.mimg("teach") + '" alt=""><div data-r="say"></div></div><div class="q v9-q" data-r="q"></div><div data-r="sf"></div><div data-r="end"></div>' +
      '<button class="btn block" data-k="x" style="margin-top:8px">' + T("Đóng", "Close") + "</button></div>",
      function (bg, close) {
        bg.querySelector("[data-k=x]").onclick = close;
        function show() {
          var q = exs[step], vs = vsteps(q), nb = Math.min(step + 1, vs.length), bl = vs.slice(vs.length - nb);
          bg.querySelector("[data-r=ch]").innerHTML = '<span class="ok">✓ ' + T("Ví dụ 1 · " + X.owl() + " làm", "Example 1 · " + X.owl() + "'s turn") + "</span>" +
            '<span class="' + (step === 0 ? "on" : "ok") + '">' + (step > 0 ? "✓ " : "") + T("Ví dụ 2 · Con làm 1 bước", "Example 2 · You do 1 step") + "</span>" +
            '<span class="' + (step === 1 ? "on" : "") + '">' + T("Ví dụ 3 · Con làm " + nb + " bước", "Example 3 · You do " + nb + " steps") + "</span>";
          bg.querySelector("[data-r=say]").innerHTML = vs.length ? T(X.owl() + " làm các bước đầu, <b>con làm " + (nb === 1 ? "bước cuối" : nb + " bước cuối") + "</b> nhé!", X.owl() + " does the first steps, <b>you do the last " + (nb === 1 ? "one" : nb) + "</b>!") :
            T("Bài này con xem cách giải rồi sang luyện tập nhé.", "Look at the solution, then go practise.");
          bg.querySelector("[data-r=q]").innerHTML = G.rich(q.q);
          bg.querySelector("[data-r=end]").innerHTML = "";
          var sf = bg.querySelector("[data-r=sf]"), nsf = sf.cloneNode(false); sf.parentNode.replaceChild(nsf, sf);
          StepFill(nsf, q.steps, bl, function () {
            var end = bg.querySelector("[data-r=end]");
            if (step === 0) {
              end.innerHTML = '<button class="btn pri block" data-k="n">' + T("Ví dụ 3 ▶", "Example 3 ▶") + "</button>";
              end.querySelector("[data-k=n]").onclick = function () { step = 1; show(); };
            } else {
              var s = Store.lesson(id); s.faded = 1; Store.save();
              end.innerHTML = '<div class="v9-msg ok">🎉 ' + T("Con đã tự làm được! Giờ sang luyện tập nhé.", "You did it yourself! Time to practise.") + '</div><button class="btn pri block" data-k="p">' + T("Luyện tập ▶", "Practise ▶") + "</button>";
              end.querySelector("[data-k=p]").onclick = function () { close(); var s2 = Store.lesson(id); G.startPrac(id, s2.quick || s2.pass[0] ? 1 : 0); };
            }
          });
        }
        show();
      });
  }
  G.T4.v9.startFaded = startFaded;
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-v9f]"); if (!b) return;
    e.preventDefault(); e.stopPropagation(); startFaded(b.getAttribute("data-v9f"));
  }, true);

  /* nút ở cuối phần "Học cách làm" */
  var q2 = false;
  new MutationObserver(function () {
    if (q2) return; q2 = true;
    Promise.resolve().then(function () {
      q2 = false;
      var U = G.UI && G.UI.teach, end = document.getElementById("tend");
      if (!U || U.th || !end || !end.innerHTML || end.querySelector("[data-v9f]")) return;
      var id = U.l && U.l.id; if (!id) return;
      end.insertAdjacentHTML("afterbegin", '<button class="btn pri block v9-fbtn" data-v9f="' + esc(id) + '">✍️ ' + T("Con tự làm: ví dụ 2 và 3", "Your turn: examples 2 and 3") + "</button>");
    });
  }).observe(document.getElementById("app") || document.body, { childList: true, subtree: true });

  /* hàng "Tự làm theo ví dụ" trong chặng Học của trang bài */
  var prevLesson = G.SC.lesson;
  G.SC.lesson = function (p) {
    var r = prevLesson.apply(this, arguments);
    try {
      var id = p && p.id, body = document.querySelector(".stage .stage-b"), teach = body && body.querySelector("[data-act=teach]");
      if (id && teach && !body.querySelector("[data-v9f]")) {
        var s = Store.lesson(id);
        teach.insertAdjacentHTML("afterend", '<button class="stp" data-v9f="' + esc(id) + '"><span class="n" style="background:var(--y-soft)">' + (s.faded ? "✓" : "✍️") + '</span><span class="grow"><b>' +
          T("Tự làm theo ví dụ", "Try the examples") + "</b><small>" + T(X.owl() + " làm trước, con làm tiếp từng bước", X.owl() + " starts, you finish step by step") + '</small></span><span class="chev">▶</span></button>');
      }
    } catch (e) { }
    return r;
  };
  G.T4.v9.StepFill = StepFill; G.T4.v9.vsteps = vsteps;
})();
