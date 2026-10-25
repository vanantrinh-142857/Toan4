/* ============================================================
   MẸO TÍNH NHẨM – nhân và chia với số có hai chữ số (Toán 4 Phiêu Lưu)
   Thêm vào cuối lý thuyết "Phép nhân" (mul) và "Phép chia" (div).
   Sửa chữ bằng Notepad, lưu UTF-8. Mỗi trang: hình (svg) + lời Cú (say) + câu hỏi (ask).
   ============================================================ */
(function(){
var LTH=window.LY_THUYET; if(!LTH||!LTH.mul||!LTH.div) return;
var T=function(x,y,vi,en,o){return TH.t(x,y,LT(vi,en),o)};
var S=function(h,s){return TH.svg(h,s)};
var A=function(qv,qe,opts,ai,gv,ge){var o=opts.map(function(p){return LT(p[0],p[1])});return {q:LT(qv,qe),opts:o,ans:o[ai],good:LT(gv,ge)}};
var N=function(a,b){return [a,b||a]};
var tag=function(vi,en){return TH.r(60,4,240,28,'#1F2A44',{rx:14,sw:0})+TH.t(180,23,LT(vi,en),{s:15,c:'#FFD23F'})};
/* hàng: ô trái -> mũi tên -> ô phải */
var flow=function(y,a,b,fa,fb,lab){return TH.box(14,y,150,44,a,fa||'sky',{s:17})+TH.arr(168,y+22,192,y+22,{w:3})+TH.box(196,y,150,44,b,fb||'mint',{s:17})+(lab?TH.t(180,y-4,lab,{s:13,c:'orange'}):'')};
/* bảng chọn mẹo */
var cheat=function(rows){var s='';rows.forEach(function(r,i){var y=40+i*44;s+=TH.r(10,y,340,38,i%2?'white':'#F4F8FF',{rx:10,sw:1.5})+TH.t(22,y+25,LT(r[0],r[1]),{s:14,a:'start',c:'blue'})+TH.t(338,y+25,LT(r[2],r[3]),{s:14,a:'end'})});return s};

/* ================= PHÉP NHÂN: 8 trang mẹo ================= */
var mulTips=[
{svg:function(){return S(176,tag('Mẹo 1 · Tách số','Tip 1 · Split it')+
  T(180,60,'24 × 13 = 24 × (10 + 3)','24 × 13 = 24 × (10 + 3)',{s:19})+
  TH.box(14,76,196,52,'24 × 10 = 240','sky',{s:18})+TH.box(216,76,130,52,'24 × 3 = 72','mint',{s:17})+
  TH.brace(14,346,134,'240 + 72 = 312',{c:'orange'}))},
 say:LT('Mẹo 1 – **Tách số**: nhân với số có hai chữ số thì tách nó thành **chục** và **đơn vị**. 24 × 13 = 24 × 10 + 24 × 3 = 240 + 72 = **312**. Thử nhé: 15 × 12 = 150 + 30 = ?','Tip 1 – **Split it**: to multiply by a 2-digit number, split it into **tens** and **ones**. 24 × 13 = 24 × 10 + 24 × 3 = 240 + 72 = **312**. Try it: 15 × 12 = 150 + 30 = ?'),
 ask:A('15 × 12 = ?','15 × 12 = ?',[N('180'),N('165'),N('170')],0,'Đúng! 150 + 30 = 180.','Right! 150 + 30 = 180.')},

{svg:function(){var s=tag('Mẹo 2 · Nhân với 11','Tip 2 · Times 11');
  s+=TH.box(96,44,52,52,'3','sky',{s:28})+TH.box(212,44,52,52,'5','sky',{s:28});
  s+=TH.arr(122,100,104,138,{w:2.5})+TH.arr(238,100,256,138,{w:2.5})+TH.arr(140,100,172,138,{w:2.5,c:'orange'})+TH.arr(220,100,188,138,{w:2.5,c:'orange'});
  s+=T(180,82,'3 + 5','3 + 5',{s:15,c:'orange'});
  s+=TH.box(76,142,56,56,'3','sky',{s:28})+TH.box(152,142,56,56,'8','sun',{s:28,sw:3.5})+TH.box(228,142,56,56,'5','sky',{s:28});
  s+=T(180,232,'35 × 11 = 385','35 × 11 = 385',{s:21,c:'green'});
  return S(246,s)},
 say:LT('Mẹo 2 – **Nhân với 11**: "tách – cộng – chèn". 35 × 11: tách 3 và 5 ra hai bên, cộng 3 + 5 = 8 rồi **chèn vào giữa**: **385**. Con thử: 42 × 11 = ?','Tip 2 – **Times 11**: "split, add, slot in". 35 × 11: move 3 and 5 apart, add 3 + 5 = 8 and **slot it in the middle**: **385**. Your turn: 42 × 11 = ?'),
 ask:A('42 × 11 = ?','42 × 11 = ?',[N('426'),N('462'),N('4 620','4,620')],1,'Giỏi! 4 + 2 = 6, chèn vào giữa: 462.','Great! 4 + 2 = 6 in the middle: 462.')},

{svg:function(){var s=tag('Mẹo 2 · Khi tổng ≥ 10','Tip 2 · When the sum ≥ 10');
  s+=TH.box(60,46,56,52,'7','sky',{s:26})+TH.box(152,46,56,52,'15','rose',{s:24})+TH.box(244,46,56,52,'8','sky',{s:26});

  s+=TH.arr(180,98,180,140,{w:2.5,c:'orange'})+TH.path('M164 74 Q120 120 96 140','none',{stroke:'red',sw:2.5,dash:'5 4'})+T(110,104,'+1','+1',{s:16,c:'red'});
  s+=TH.box(60,144,56,52,'8','sun',{s:26,sw:3.5})+TH.box(152,144,56,52,'5','sun',{s:26})+TH.box(244,144,56,52,'8','sky',{s:26});
  s+=T(180,224,'7 + 8 = 15: viết 5, nhớ 1','7 + 8 = 15: write 5, carry 1',{s:15,c:'orange'});
  s+=T(180,254,'78 × 11 = 858','78 × 11 = 858',{s:21,c:'green'});
  return S(266,s)},
 say:LT('Nếu tổng **từ 10 trở lên** thì sao? 78 × 11: 7 + 8 = 15. Viết **5** vào giữa, **nhớ 1** cộng vào chữ số bên trái: 7 + 1 = 8. Kết quả **858**. Thử: 67 × 11 = ?','What if the sum is **10 or more**? 78 × 11: 7 + 8 = 15. Write **5** in the middle and **carry 1** to the left digit: 7 + 1 = 8. The answer is **858**. Try: 67 × 11 = ?'),
 ask:A('67 × 11 = ?','67 × 11 = ?',[N('6 137','6,137'),N('637'),N('737')],2,'Đúng! 6 + 7 = 13, viết 3, nhớ 1: 737.','Right! 6 + 7 = 13, write 3, carry 1: 737.')},

{svg:function(){var s=tag('Mẹo 3 · Làm tròn số chục','Tip 3 · Round to tens');
  s+=TH.nline(30,330,58,17,23,1,{marks:[{v:19,c:'blue',t:'19'},{v:20,c:'orange',t:'20'},{v:21,c:'blue',t:'21'}]});
  s+=TH.box(12,100,336,46,'23 × 19 = 23 × 20 − 23','sky',{s:17})+T(180,166,'= 460 − 23 = 437','= 460 − 23 = 437',{s:17,c:'green'});
  s+=TH.box(12,180,336,46,'23 × 21 = 23 × 20 + 23','mint',{s:17})+T(180,246,'= 460 + 23 = 483','= 460 + 23 = 483',{s:17,c:'green'});
  return S(258,s)},
 say:LT('Mẹo 3 – **Làm tròn số chục**: 19 gần 20. Nhân với 20 cho dễ rồi **bớt đi một lần**: 23 × 19 = 460 − 23 = **437**. Gặp 21 thì **thêm một lần**: 23 × 21 = 460 + 23 = 483. Thử: 15 × 19 = ?','Tip 3 – **Round to tens**: 19 is close to 20. Multiply by 20 (easy!) then **take one away**: 23 × 19 = 460 − 23 = **437**. With 21, **add one more**: 23 × 21 = 460 + 23 = 483. Try: 15 × 19 = ?'),
 ask:A('15 × 19 = ?','15 × 19 = ?',[N('300'),N('285'),N('315')],1,'Đúng! 300 − 15 = 285.','Right! 300 − 15 = 285.')},

{svg:function(){var s=tag('Mẹo 4 · Nhân với 25, 50','Tip 4 · Times 25, 50');
  for(var i=0;i<4;i++)s+=TH.box(28+i*58,44,52,40,'25','sun',{s:16});s+=T(290,70,'= 100','= 100',{s:19,c:'orange'});
  s+=flow(118,'36 × 25','3 600 : 4','sky','sun',LT('× 100 rồi : 4','× 100 then : 4'))+T(180,186,'= 900','= 900',{s:20,c:'green'});
  s+=flow(214,'46 × 50','4 600 : 2','sky','mint',LT('× 100 rồi : 2','× 100 then : 2'))+T(180,282,'= 2 300','= 2,300',{s:20,c:'green'});
  return S(294,s)},
 say:LT('Mẹo 4 – **Nhân với 25, 50**: 4 lần 25 là 100, nên **nhân 25 = nhân 100 rồi chia 4**. 36 × 25 = 3 600 : 4 = **900**. **Nhân 50 = nhân 100 rồi chia 2**: 46 × 50 = 2 300. Thử: 48 × 25 = ?','Tip 4 – **Times 25, 50**: 4 × 25 = 100, so **× 25 = × 100 then ÷ 4**. 36 × 25 = 3,600 ÷ 4 = **900**. **× 50 = × 100 then ÷ 2**: 46 × 50 = 2,300. Try: 48 × 25 = ?'),
 ask:A('48 × 25 = ?','48 × 25 = ?',[N('1 200','1,200'),N('1 000','1,000'),N('12 000','12,000')],0,'Đúng! 4 800 : 4 = 1 200.','Right! 4,800 ÷ 4 = 1,200.')},

{svg:function(){var s=tag('Mẹo 5 · Gấp đôi – chia đôi','Tip 5 · Halve and double');
  s+=TH.box(70,46,90,50,'16','sky',{s:24})+T(180,79,'×','×',{s:24})+TH.box(200,46,90,50,'35','rose',{s:24});
  s+=TH.arr(115,100,115,140,{w:3,c:'blue'})+T(84,126,': 2',': 2',{s:16,c:'blue'})+TH.arr(245,100,245,140,{w:3,c:'red'})+T(278,126,'× 2','× 2',{s:16,c:'red'});
  s+=TH.box(70,144,90,50,'8','sky',{s:24})+T(180,177,'×','×',{s:24})+TH.box(200,144,90,50,'70','rose',{s:24});
  s+=T(180,228,'16 × 35 = 8 × 70 = 560','16 × 35 = 8 × 70 = 560',{s:19,c:'green'});
  return S(242,s)},
 say:LT('Mẹo 5 – **Gấp đôi – chia đôi**: một thừa số **chia đôi**, thừa số kia **gấp đôi**, tích **không đổi**. 16 × 35 = 8 × 70 = **560**. Rất hợp khi có số tận cùng là **5**. Thử: 18 × 15 = ?','Tip 5 – **Halve and double**: **halve** one factor and **double** the other; the product **stays the same**. 16 × 35 = 8 × 70 = **560**. Great when a number ends in **5**. Try: 18 × 15 = ?'),
 ask:A('18 × 15 = ?','18 × 15 = ?',[N('180'),N('300'),N('270')],2,'Đúng! 9 × 30 = 270.','Right! 9 × 30 = 270.')},

{svg:function(){var s=tag('Mẹo nâng cao','Bonus trick');
  s+=T(180,62,'23 × 27','23 × 27',{s:24});
  s+=T(180,86,'cùng chữ số chục · 3 + 7 = 10','same tens digit · 3 + 7 = 10',{s:14,c:'orange'});
  s+=TH.box(30,100,140,48,'2 × 3 = 6','sky',{s:18})+TH.box(190,100,140,48,'3 × 7 = 21','mint',{s:18});
  s+=T(100,166,'chục × (chục + 1)','tens × (tens + 1)',{s:12,c:'#5a6480',b:false})+T(260,166,'đơn vị × đơn vị','ones × ones',{s:12,c:'#5a6480',b:false});
  s+=TH.note(80,178,200,44,LT('6 | 21 → 621','6 | 21 → 621'),{s:21});
  s+=T(180,250,'35 × 35 → 12 | 25 → 1 225','35 × 35 → 12 | 25 → 1,225',{s:16,c:'green'});
  s+=T(180,274,'41 × 49 → 20 | 09 → 2 009','41 × 49 → 20 | 09 → 2,009',{s:16,c:'green'});
  return S(288,s)},
 say:LT('**Mẹo nâng cao**: hai số có **cùng chữ số hàng chục**, hai chữ số hàng đơn vị **cộng lại bằng 10**. 23 × 27: lấy 2 × 3 = 6 (số chục nhân số liền sau nó), rồi 3 × 7 = 21 viết tiếp: **621**. Phần sau luôn viết **đủ 2 chữ số** (09). Thử: 45 × 45 = ?','**Bonus trick**: two numbers with the **same tens digit** whose ones digits **add up to 10**. 23 × 27: 2 × 3 = 6 (tens digit times the next number), then 3 × 7 = 21 written after it: **621**. Always write the second part with **2 digits** (09). Try: 45 × 45 = ?'),
 ask:A('45 × 45 = ?','45 × 45 = ?',[N('2 025','2,025'),N('1 625','1,625'),N('2 045','2,045')],0,'Tuyệt! 4 × 5 = 20, 5 × 5 = 25: 2 025.','Awesome! 4 × 5 = 20, 5 × 5 = 25: 2,025.')},

{svg:function(){return S(272,tag('Chọn mẹo nào?','Which tip?')+cheat([
  ['× 11','× 11','tách – cộng – chèn','split, add, slot in'],
  ['× 19, 21, 29, 31…','× 19, 21, 29, 31…','làm tròn, bớt / thêm','round, then − / +'],
  ['× 25, × 50','× 25, × 50','× 100 rồi : 4 / : 2','× 100 then : 4 / : 2'],
  ['có số tận cùng 5','a number ends in 5','gấp đôi – chia đôi','halve and double'],
  ['còn lại','anything else','tách chục + đơn vị','split tens + ones']]))},
 say:LT('Gặp phép nhân, con **nhìn số trước** rồi chọn mẹo. Không có mẹo nào hợp thì dùng **Mẹo 1 – tách số**, lúc nào cũng làm được! Phép **44 × 25** nên dùng mẹo nào?','Before multiplying, **look at the numbers** and pick a tip. If none fits, use **Tip 1 – split it**; it always works! Which tip suits **44 × 25**?'),
 ask:A('44 × 25 nên dùng mẹo nào?','Which tip for 44 × 25?',[['× 100 rồi : 4','× 100 then ÷ 4'],['Làm tròn số chục','Round to tens'],['Gấp đôi – chia đôi','Halve and double']],0,'Đúng! 4 400 : 4 = 1 100.','Right! 4,400 ÷ 4 = 1,100.')}
];

/* ================= PHÉP CHIA: 7 trang mẹo ================= */
var divTips=[
{svg:function(){var s=tag('Mẹo 1 · Cùng bỏ số 0','Tip 1 · Drop the zeros');
  s+=T(180,72,'84Ø : 2Ø','84Ø ÷ 2Ø',{s:30});
  s+=TH.l(146,60,164,44,{c:'red',w:3})+TH.l(218,60,236,44,{c:'red',w:3});
  s+=TH.box(70,90,220,48,'84 : 2 = 42','mint',{s:22});
  s+=T(180,170,'4 500 : 50 = 450 : 5 = 90','4,500 ÷ 50 = 450 ÷ 5 = 90',{s:17,c:'green'});
  s+=T(180,198,'bỏ cùng số chữ số 0 ở cả hai','drop the same number of zeros from both',{s:13,c:'#5a6480',b:false});
  return S(212,s)},
 say:LT('Mẹo 1 – **Cùng bỏ số 0**: số bị chia và số chia **cùng tận cùng bằng 0** thì xoá **cùng số** chữ số 0 ở cả hai. 840 : 20 = 84 : 2 = **42**. 4 500 : 50 = 450 : 5 = 90. Thử: 960 : 30 = ?','Tip 1 – **Drop the zeros**: if both numbers **end in 0**, cross out the **same number** of zeros from each. 840 ÷ 20 = 84 ÷ 2 = **42**. 4,500 ÷ 50 = 450 ÷ 5 = 90. Try: 960 ÷ 30 = ?'),
 ask:A('960 : 30 = ?','960 ÷ 30 = ?',[N('320'),N('32'),N('3')],1,'Đúng! 96 : 3 = 32.','Right! 96 ÷ 3 = 32.')},

{svg:function(){var s=tag('Mẹo 2 · Chia cho 25, 50','Tip 2 · Divide by 25, 50');
  s+=flow(54,'700 : 25','700 × 4 : 100','sky','sun',LT(': 25 = × 4 rồi : 100',': 25 = × 4 then : 100'))+T(180,124,'= 2 800 : 100 = 28','= 2,800 ÷ 100 = 28',{s:18,c:'green'});
  s+=flow(156,'650 : 50','650 × 2 : 100','sky','mint',LT(': 50 = × 2 rồi : 100',': 50 = × 2 then : 100'))+T(180,226,'= 1 300 : 100 = 13','= 1,300 ÷ 100 = 13',{s:18,c:'green'});
  return S(240,s)},
 say:LT('Mẹo 2 – **Chia cho 25, 50**: 100 gồm 4 lần 25, nên **chia 25 = nhân 4 rồi chia 100**. 700 : 25 = 2 800 : 100 = **28**. **Chia 50 = nhân 2 rồi chia 100**: 650 : 50 = 13. Thử: 900 : 25 = ?','Tip 2 – **Divide by 25, 50**: 100 is 4 lots of 25, so **÷ 25 = × 4 then ÷ 100**. 700 ÷ 25 = 2,800 ÷ 100 = **28**. **÷ 50 = × 2 then ÷ 100**: 650 ÷ 50 = 13. Try: 900 ÷ 25 = ?'),
 ask:A('900 : 25 = ?','900 ÷ 25 = ?',[N('9'),N('360'),N('36')],2,'Đúng! 3 600 : 100 = 36.','Right! 3,600 ÷ 100 = 36.')},

{svg:function(){var s=tag('Mẹo 3 · Chia dần','Tip 3 · Divide in steps');
  s+=T(180,62,'432 : 12   (12 = 4 × 3)','432 ÷ 12   (12 = 4 × 3)',{s:18});
  s+=TH.box(14,78,96,44,'432','sky',{s:20})+TH.arr(112,100,140,100,{w:3})+T(126,92,': 4',': 4',{s:13,c:'orange'})+TH.box(142,78,90,44,'108','sun',{s:20})+TH.arr(234,100,262,100,{w:3})+T(248,92,': 3',': 3',{s:13,c:'orange'})+TH.box(264,78,82,44,'36','mint',{s:20});
  s+=T(180,152,': 16 = chia đôi 4 lần',': 16 = halve 4 times',{s:15,c:'blue'});
  var v=['336','168','84','42','21'];for(var i=0;i<5;i++){s+=TH.box(10+i*70,164,58,40,v[i],i===4?'mint':'white',{s:17});if(i<4)s+=TH.arr(70+i*70,184,78+i*70,184,{w:2.5,h:7})}
  return S(218,s)},
 say:LT('Mẹo 3 – **Chia dần**: tách số chia thành **tích hai số nhỏ**. 12 = 4 × 3, nên 432 : 12 = 432 : 4 : 3 = 108 : 3 = **36**. Chia cho 16 thì **chia đôi 4 lần**: 336 → 168 → 84 → 42 → 21. Thử: 360 : 15 = ? (15 = 3 × 5)','Tip 3 – **Divide in steps**: break the divisor into **two small factors**. 12 = 4 × 3, so 432 ÷ 12 = 432 ÷ 4 ÷ 3 = 108 ÷ 3 = **36**. To divide by 16, **halve 4 times**: 336 → 168 → 84 → 42 → 21. Try: 360 ÷ 15 = ? (15 = 3 × 5)'),
 ask:A('360 : 15 = ?','360 ÷ 15 = ?',[N('24'),N('36'),N('20')],0,'Đúng! 360 : 3 = 120, 120 : 5 = 24.','Right! 360 ÷ 3 = 120, 120 ÷ 5 = 24.')},

{svg:function(){var s=tag('Mẹo 4 · Tách số bị chia','Tip 4 · Split the dividend');
  s+=T(180,62,'312 : 12','312 ÷ 12',{s:22});
  s+=TH.box(30,78,180,46,'240 : 12 = 20','sky',{s:17})+TH.box(216,78,114,46,'72 : 12 = 6','mint',{s:16});
  s+=T(120,146,'(số tròn chục × 12)','(a round 12-times number)',{s:12,c:'#5a6480',b:false});
  s+=TH.note(70,156,220,42,LT('20 + 6 = 26','20 + 6 = 26'),{s:20});
  s+=T(180,228,'714 : 14 = (700 + 14) : 14 = 51','714 ÷ 14 = (700 + 14) ÷ 14 = 51',{s:15,c:'green'});
  return S(242,s)},
 say:LT('Mẹo 4 – **Tách số bị chia** thành các phần **chia hết** cho số chia. 312 = 240 + 72; 240 : 12 = 20 và 72 : 12 = 6. Vậy 312 : 12 = **26**. 714 : 14 = (700 + 14) : 14 = 50 + 1 = 51. Thử: 1 326 : 13 = ?','Tip 4 – **Split the dividend** into parts that the divisor **goes into exactly**. 312 = 240 + 72; 240 ÷ 12 = 20 and 72 ÷ 12 = 6. So 312 ÷ 12 = **26**. 714 ÷ 14 = (700 + 14) ÷ 14 = 50 + 1 = 51. Try: 1,326 ÷ 13 = ?'),
 ask:A('1 326 : 13 = ?','1,326 ÷ 13 = ?',[N('120'),N('102'),N('112')],1,'Đúng! (1 300 + 26) : 13 = 100 + 2.','Right! (1,300 + 26) ÷ 13 = 100 + 2.')},

{svg:function(){var s=tag('Mẹo 5 · Gấp đôi cả hai','Tip 5 · Double both');
  s+=TH.box(70,44,220,46,'270 : 45','sky',{s:22});
  s+=TH.arr(180,94,180,122,{w:3,c:'red'})+T(232,114,'cả hai × 2','both × 2',{s:14,c:'red'});
  s+=TH.box(70,126,220,46,'540 : 90','rose',{s:22});
  s+=TH.arr(180,176,180,204,{w:3,c:'orange'})+T(232,196,'bỏ số 0','drop a 0',{s:14,c:'orange'});
  s+=TH.box(70,208,220,46,'54 : 9 = 6','mint',{s:22});
  return S(266,s)},
 say:LT('Mẹo 5 – **Gấp đôi cả hai**: nhân số bị chia và số chia với **cùng một số** thì thương **không đổi**. Số chia tận cùng là 5 thì gấp đôi cả hai để được số tròn chục: 270 : 45 = 540 : 90 = 54 : 9 = **6**. Thử: 315 : 45 = ?','Tip 5 – **Double both**: multiply both numbers by the **same number** and the answer **does not change**. If the divisor ends in 5, double both to get a round number: 270 ÷ 45 = 540 ÷ 90 = 54 ÷ 9 = **6**. Try: 315 ÷ 45 = ?'),
 ask:A('315 : 45 = ?','315 ÷ 45 = ?',[N('6'),N('9'),N('7')],2,'Đúng! 630 : 90 = 63 : 9 = 7.','Right! 630 ÷ 90 = 63 ÷ 9 = 7.')},

{svg:function(){var s=tag('Mẹo 6 · Ước lượng, thử lại','Tip 6 · Estimate, then check');
  s+=T(180,62,'1 596 : 38 = ?','1,596 ÷ 38 = ?',{s:20});
  s+=TH.box(30,76,300,44,'≈ 1 600 : 40 = 40','sun',{s:18});
  s+=T(180,140,'thử 42:','try 42:',{s:14,c:'#5a6480',b:false});
  s+=TH.box(30,150,300,44,'42 × 38 = 1 596  ✓','mint',{s:18});
  s+=TH.note(30,206,300,40,LT('thương × số chia = số bị chia','quotient × divisor = dividend'),{s:15});
  return S(256,s)},
 say:LT('Mẹo 6 – **Ước lượng rồi thử lại**: làm tròn số chia thành số tròn chục để đoán thương: 1 596 : 38 ≈ 1 600 : 40 = 40. Rồi **nhân ngược lại** để kiểm tra: 42 × 38 = 1 596, đúng rồi! Nhẩm xong luôn thử lại nhé. 26 × 12 = ?','Tip 6 – **Estimate, then check**: round the divisor to tens to guess: 1,596 ÷ 38 ≈ 1,600 ÷ 40 = 40. Then **multiply back** to check: 42 × 38 = 1,596. Correct! Always check after mental math. 26 × 12 = ?'),
 ask:A('Thử lại 312 : 12 = 26: 26 × 12 = ?','Check 312 ÷ 12 = 26: 26 × 12 = ?',[N('302'),N('312'),N('322')],1,'Đúng! Bằng số bị chia, phép chia đúng.','Right! It matches the dividend, so the division is correct.')},

{svg:function(){return S(316,tag('Chọn mẹo nào?','Which tip?')+cheat([
  ['cùng có 0 ở cuối','both end in 0','bỏ số 0 cùng nhau','drop the zeros'],
  [': 25, : 50',': 25, : 50','× 4 / × 2 rồi : 100','× 4 / × 2 then : 100'],
  [': 12, 15, 16, 24…',': 12, 15, 16, 24…','chia dần','divide in steps'],
  ['số bị chia dễ tách','easy-to-split dividend','tách số bị chia','split the dividend'],
  ['số chia tận cùng 5','divisor ends in 5','gấp đôi cả hai','double both'],
  ['mọi phép chia','every division','ước lượng, thử lại','estimate, check']]))},
 say:LT('Gặp phép chia, con **nhìn số chia trước** rồi chọn mẹo. Nhẩm xong luôn **thử lại bằng phép nhân**. Phép **1 200 : 25** nên dùng mẹo nào?','Before dividing, **look at the divisor** and pick a tip. Always **check with multiplication** afterwards. Which tip suits **1,200 ÷ 25**?'),
 ask:A('1 200 : 25 nên dùng mẹo nào?','Which tip for 1,200 ÷ 25?',[['Tách số bị chia','Split the dividend'],['× 4 rồi : 100','× 4 then ÷ 100'],['Chia dần','Divide in steps']],1,'Đúng! 4 800 : 100 = 48.','Right! 4,800 ÷ 100 = 48.')}
];

window.MEO_NHAM={mulAt:LTH.mul.pages.length,divAt:LTH.div.pages.length};
LTH.mul.pages=LTH.mul.pages.concat(mulTips);
LTH.div.pages=LTH.div.pages.concat(divTips);
})();
