window.LY_THUYET = window.LY_THUYET || {};

/* theory_t1.js */
window.LY_THUYET = window.LY_THUYET || {};
(function(){
var C=TH.C;
var T=function(x,y,vi,en,o){return TH.t(x,y,LT(vi,en),o)};
var gs=function(n,sep){return String(n).replace(/\B(?=(\d{3})+(?!\d))/g,sep)};
var G=function(n){return LT(gs(n,' '),gs(n,','))};
var P=function(n){return [gs(n,' '),gs(n,',')]};
var A=function(qv,qe,opts,ai,gv,ge){var o=opts.map(function(p){return LT(p[0],p[1])});return {q:LT(qv,qe),opts:o,ans:o[ai],good:LT(gv,ge)}};
var GREY='#5a6480';
/* hàng ô chữ số */
var row=function(s,x,y,w,h,fills,fs){var r='';for(var i=0;i<s.length;i++){r+=TH.box(x+i*w,y,w-4,h,s[i],(fills&&fills[i])||'white',{s:fs||24})}return r};
var cross=function(cx,cy){return TH.l(cx-9,cy-9,cx+9,cy+9,{c:'red',w:4})+TH.l(cx-9,cy+9,cx+9,cy-9,{c:'red',w:4})};
var tick=function(cx,cy){return TH.path('M'+(cx-10)+' '+cy+' L'+(cx-2)+' '+(cy+9)+' L'+(cx+11)+' '+(cy-10),'none',{stroke:'green',sw:5})};
var panel=function(y,h,ok,vi1,en1,vi2,en2){var cy=y+h/2;return TH.r(12,y,336,h,ok?'mint':'rose',{rx:14})+(ok?tick(36,cy):cross(36,cy))+T(204,cy-6,vi1,en1,{s:18})+T(204,cy+20,vi2,en2,{s:16,b:false})};
/* phép tính dọc 4 cột */
var HD=function(){return [LT('nghìn','1,000s'),LT('trăm','100s'),LT('chục','10s'),LT('đơn vị','1s')]};
var colfig=function(o){var s='',hd=HD(),cx=function(i){return 85+i*70};
 for(var i=0;i<4;i++){s+=TH.r(52+i*70,6,66,184,o.act===i?'sun':'#F4F8FF',{rx:10,sw:o.act===i?3:1.5});s+=TH.t(cx(i),28,hd[i],{s:15,b:false,c:GREY});
  if(o.carry&&o.carry[i])s+=TH.t(cx(i),62,o.carry[i],{s:20,c:'orange'});
  if(o.adj&&o.adj[i])s+=TH.t(cx(i),62,o.adj[i],{s:20,c:'orange'});
  var t=o.top[i];if(t&&t!==' ')s+=TH.t(cx(i),102,t,{s:30});
  if(o.strike&&o.strike.indexOf(i)>=0)s+=TH.l(cx(i)-13,99,cx(i)+13,78,{c:'red',w:3});
  var b=o.bot[i];if(b&&b!==' ')s+=TH.t(cx(i),138,b,{s:30});
  var r=o.res&&o.res[i];if(r)s+=TH.t(cx(i),184,r,{s:30,c:'teal'})}
 s+=TH.t(26,138,o.op,{s:30})+TH.l(40,150,334,150,{w:3.5});
 var f=o.foot,h=f.length*22+12;s+=TH.r(14,198,332,h,'lilac',{rx:12});
 f.forEach(function(l,i){s+=TH.t(180,198+6+(i+1)*22-5,l[0]?LT(l[0],l[1]):l,{s:16})});
 return TH.svg(198+h+6,s)};
/* nhân hai chữ số */
var mul2=function(o){var s='',cx=function(i){return 102+i*64},rows={top:34,bot:64,p1:102,p2:132,res:172};
 for(var i=0;i<4;i++)s+=TH.r(72+i*64,4,60,180,'#F4F8FF',{rx:10,sw:1.5});
 if(o.zero)s+=TH.r(cx(3)-22,rows.p2-26,44,34,'yellow',{rx:8,sw:2});
 var put=function(str,y,col){for(var i=0;i<4;i++){var d=str[i];if(d&&d!==' ')s+=TH.t(cx(i),y,d,{s:27,c:col})}};
 put(' 236',rows.top);put('  24',rows.bot);
 s+=TH.t(30,rows.bot,'×',{s:28})+TH.l(40,76,334,76,{w:3.5});
 if(o.p1){put(' 944',rows.p1,'blue');s+=TH.t(36,rows.p1,'× 4',{s:16,c:'blue'})}
 if(o.p2){put('4720',rows.p2,'pink');s+=TH.t(36,rows.p2,'× 20',{s:16,c:'pink'})}
 if(o.res){s+=TH.l(40,144,334,144,{w:3.5});put('5664',rows.res,'teal');s+=T(36,rows.res,'tổng','sum',{s:16,c:'teal'})}
 var f=o.foot,h=f.length*22+12;s+=TH.r(14,190,332,h,'lilac',{rx:12});
 f.forEach(function(l,i){s+=TH.t(180,190+6+(i+1)*22-5,LT(l[0],l[1]),{s:16})});
 return TH.svg(190+h+6,s)};

Object.assign(window.LY_THUYET,{

/* ================= PLACE ================= */
place:{memo:LT('Đủ 10 thì lên hàng. 3 hàng một lớp. Hàng trống thì viết 0.','Ten makes the next place. 3 places make a period. An empty place gets a 0.'),pages:[
{svg:function(){var s='';
  var rowf=function(y,fill,shape,vi,en){var r='';for(var i=0;i<10;i++){var x=20+i*20;r+=shape==='c'?TH.c(x+8,y,8,fill,{sw:2}):TH.r(x,y-13,16,26,fill,{rx:4,sw:2})}
   return r+TH.t(232,y+7,'=',{s:22})+TH.box(248,y-20,104,40,LT(vi,en),'sun',{s:16})};
  s+=rowf(40,'yellow','c','1 chục','1 ten')+rowf(100,'orange','r','1 trăm','1 hundred')+rowf(160,'pink','r','1 nghìn','1 thousand');
  s+=T(180,208,'10 cái nhỏ gộp thành 1 cái to hơn','10 small ones make 1 bigger one',{s:16,b:false});
  return TH.svg(222,s)},
 say:LT('Con gói kẹo nhé: **10 viên** thành **1 chục**. **10 chục** thành **1 trăm**. **10 trăm** thành **1 nghìn**. Cứ đủ 10 là lên một bậc!','Let us pack candy: **10 pieces** make **1 ten**. **10 tens** make **1 hundred**. **10 hundreds** make **1 thousand**. Every 10 moves up one step!')},
{svg:function(){var s='',names=[['trăm','hundreds'],['chục','tens'],['đơn vị','ones']],cols=['rose','sun','sky'],vals=['300','20','1'];
  for(var i=0;i<3;i++){var x=30+i*104;s+=T(x+48,32,names[i][0],names[i][1],{s:16,c:GREY,b:false})+TH.box(x,44,96,56,'321'[i],cols[i],{s:34})+TH.arr(x+48,104,x+48,122,{w:2.5})+TH.box(x,126,96,36,vals[i],'white',{s:22})}
  s+=TH.t(180,196,'321 = 300 + 20 + 1',{s:20});
  return TH.svg(214,s)},
 say:LT('Mỗi chữ số đứng ở một **hàng**. Số **321** có 3 trăm, 2 chục và 1 đơn vị. Giá trị của chữ số phụ thuộc vào hàng nó đứng. Ví dụ chữ số 2 ở hàng chục có giá trị 20.','Each digit sits in a **place**. The number **321** has 3 hundreds, 2 tens and 1 one. A digit\'s value depends on its place. For example, the digit 2 in the tens place is worth 20.')},
{svg:function(){var s='',d='4506321',xs=[24,80,120,160,216,256,296],fl=['rose','sun','sun','sun','sky','sky','sky'];
  for(var i=0;i<7;i++)s+=TH.box(xs[i],36,38,46,d[i],fl[i],{s:26});
  s+=TH.brace(24,62,94,LT('lớp triệu','millions'),{c:'pink',tc:'ink'});
  s+=TH.brace(80,198,94,LT('lớp nghìn','thousands'),{c:'orange'});
  s+=TH.brace(216,334,94,LT('lớp đơn vị','ones'),{c:'blue'});
  s+=TH.note(40,158,280,42,LT('3 hàng = 1 lớp','3 places = 1 period'),{s:19});
  return TH.svg(214,s)},
 say:LT('Số lớn có nhiều hàng. Cứ **3 hàng** ta gom thành một **lớp**: lớp đơn vị, lớp nghìn, lớp triệu. Đọc từ trái sang phải, hết lớp nào thì đọc tên lớp đó.','Big numbers have many places. We group every **3 places** into one **period**: ones, thousands, millions. Read left to right, saying the period name after each group.')},
{svg:function(){var s='';
  s+=TH.box(24,24,60,56,'5','sun',{s:30})+TH.box(92,24,60,56,'0','sun',{s:30})+TH.box(160,24,60,56,'6','sun',{s:30})+TH.box(240,24,96,56,LT('nghìn','thousand'),'orange',{s:20});
  s+=T(54,104,'500 000','500,000',{s:15,b:false,c:GREY})+T(122,104,'0','0',{s:15,b:false,c:GREY})+T(190,104,'6 000','6,000',{s:15,b:false,c:GREY});
  s+=TH.arr(180,116,180,142,{w:3})+TH.r(20,146,320,44,'mint',{rx:12})+T(180,175,'năm trăm linh sáu nghìn','five hundred six thousand',{s:19});
  return TH.svg(206,s)},
 say:LT('Nhìn lớp nghìn **506**. Con đọc như số có ba chữ số: năm trăm linh sáu. Rồi nói thêm tên lớp: **nghìn**.','Look at the thousands period **506**. Read it like a 3-digit number: five hundred six. Then say the period name: **thousand**.')},
{svg:function(){var s='';
  s+=TH.box(10,22,40,50,'4','rose',{s:28})+T(86,54,'triệu','million',{s:18})+TH.box(122,22,70,50,'506','sun',{s:28})+T(240,54,'nghìn','thousand',{s:18})+TH.box(284,22,66,50,'321','sky',{s:28});
  s+=TH.arr(180,84,180,100,{w:2.5});
  s+=TH.r(40,104,280,34,'rose',{rx:12})+T(180,127,'bốn triệu','four million',{s:18});
  s+=TH.r(40,144,280,34,'sun',{rx:12})+T(180,167,'năm trăm linh sáu nghìn','five hundred six thousand',{s:18});
  s+=TH.r(40,184,280,34,'sky',{rx:12})+T(180,207,'ba trăm hai mươi mốt','three hundred twenty-one',{s:18});
  return TH.svg(232,s)},
 say:LT('Đọc cả số **4 506 321**: đọc từng lớp từ trái sang phải. Lớp triệu và lớp nghìn đọc kèm tên lớp. Lớp đơn vị thì chỉ đọc số.','Reading the whole number **4,506,321**: read each period from left to right. Say the name after the millions and thousands groups. The ones group is just read as a number.'),
 ask:A('Lớp nghìn của số 4 506 321 là số nào?','Which group is the thousands period of 4,506,321?',[P(506),P(4506),P(321)],0,'Đúng rồi!','Right!')},
{svg:function(){var s='',d='4506321';
  for(var i=0;i<7;i++){var f=i===3?'orange':(i===2?'lilac':'white');s+=TH.box(26+i*44,30,40,46,d[i],f,{s:26})}
  s+=TH.arr(26+3*44+20,80,26+3*44+20,100,{w:2.5,c:'orange'});
  s+=TH.c(34,128,9,'orange')+TH.r(50,108,290,40,'sun',{rx:12})+T(195,135,'6 × 1 000 = 6 000','6 × 1,000 = 6,000',{s:19});
  s+=TH.c(34,176,9,'lilac')+TH.r(50,156,290,40,'lilac',{rx:12})+T(195,183,'0 × 10 000 = 0','0 × 10,000 = 0',{s:19});
  return TH.svg(214,s)},
 say:LT('Giá trị của chữ số = chữ số × giá trị của hàng. Chữ số **6** ở hàng nghìn nên là **6 000**. Chữ số **0** ở hàng chục nghìn thì giá trị là **0**.','The value of a digit = the digit × the value of its place. The digit **6** is in the thousands place, so it is worth **6,000**. The digit **0** in the ten-thousands place is worth **0**.'),
 ask:A('Chữ số 5 trong số 4 506 321 có giá trị là bao nhiêu?','What is the value of the digit 5 in 4,506,321?',[P(500000),P(50000),P(5000)],0,'Chính xác!','Exactly!')},
{svg:function(){var s='';
  s+=T(180,26,'Hai nghìn không trăm linh năm','Two thousand five',{s:18});
  s+=row('205',20,48,36,50,['rose','rose','rose'],26)+cross(72,73+4).replace(/stroke="#E5484D"/g,'stroke="#E5484D"');
  s+=row('2005',186,48,38,50,['mint','yellow','yellow','mint'],26);
  s+=T(74,126,'Sai','Wrong',{s:18,c:'red'})+T(262,126,'Đúng','Right',{s:18,c:'green'});
  s+=T(262,150,'2 005','2,005',{s:18,c:GREY,b:false});
  s+=TH.arr(224,172,224,152,{w:0.1}).replace(/.*/,'');
  s+=TH.note(40,166,280,40,LT('Hàng trống thì viết số 0','Empty place? Write 0'),{s:19});
  return TH.svg(220,s)},
 say:LT('Cẩn thận với số **0**! "Hai nghìn không trăm linh năm" viết là **2 005**. Hàng trăm và hàng chục trống nên phải viết 0 để giữ chỗ.','Careful with **0**! "Two thousand five" is written **2,005**. The hundreds and tens places are empty, so we write 0 to hold the place.'),
 ask:A('Bốn nghìn không trăm ba mươi viết là:','Four thousand thirty is written:',[P(4030),P(4300),P(430)],0,'Giỏi lắm!','Great job!')}
]},

/* ================= CMPNUM ================= */
cmpnum:{memo:LT('Đếm chữ số trước, rồi so từ trái sang phải.','Count the digits first, then compare left to right.'),pages:[
{svg:function(){var s='';
  s+=T(44,76,'An','An',{s:20})+row('99',100,50,50,44,['sky','sky'],26)+T(250,78,'99 hình','99 stickers',{s:16,a:'start',b:false});
  s+=T(44,146,'Bo','Bo',{s:20})+row('100',100,120,50,44,['rose','rose','rose'],26)+T(260,148,'100 hình','100 stickers',{s:16,a:'start',b:false});
  s+=TH.note(40,184,280,40,LT('Ai có nhiều hơn?','Who has more?'),{s:19});
  return TH.svg(238,s)},
 say:LT('An có 99 hình dán, Bo có 100 hình dán. Ai có nhiều hơn? Là **Bo**! Vì sao nhỉ? Hãy nhìn xem mỗi số có mấy chữ số.','An has 99 stickers and Bo has 100. Who has more? **Bo**! Why? Look at how many digits each number has.')},
{svg:function(){var s='';
  s+=row('45678',24,34,36,44,['sky','sky','sky','sky','sky'],22)+T(212,64,'5 chữ số','5 digits',{s:16,a:'start'});
  s+=row('123456',24,94,36,44,['rose','rose','rose','rose','rose','rose'],22)+T(248,124,'6 chữ số','6 digits',{s:16,a:'start'});
  s+=TH.note(10,160,340,40,LT('123 456 nhiều chữ số hơn: lớn hơn','123,456 has more digits: bigger'),{s:16});
  return TH.svg(214,s)},
 say:LT('Số nào có **nhiều chữ số hơn** thì **lớn hơn**. 123 456 có 6 chữ số, 45 678 chỉ có 5 chữ số, nên 123 456 lớn hơn.','The number with **more digits** is **greater**. 123,456 has 6 digits and 45,678 has only 5, so 123,456 is greater.'),
 ask:A('Số nào lớn hơn: 2 345 678 hay 987 654?','Which is greater: 2,345,678 or 987,654?',[P(2345678),P(987654)],0,'Đúng rồi!','Right!')},
{svg:function(){var s='';
  s+=TH.arr(50,24,300,24,{w:3,c:'blue'})+T(180,20,'','',{})+T(176,48,'so từ trái sang phải','compare left to right',{s:16,b:false});
  var a='7281',b='7259';
  for(var i=0;i<4;i++){var f=i<2?'mint':'white';s+=TH.box(52+i*62,66,58,46,a[i],f,{s:26,dash:i>1?'5 4':null})+TH.box(52+i*62,146,58,46,b[i],f,{s:26,dash:i>1?'5 4':null})}
  s+=T(81,138,'=','=',{s:24,c:'green'})+T(143,138,'=','=',{s:24,c:'green'})+T(205,138,'?','?',{s:24,c:GREY})+T(267,138,'?','?',{s:24,c:GREY});
  return TH.svg(210,s)},
 say:LT('Hai số **cùng số chữ số**: so từng hàng, **từ trái sang phải**. 7 281 và 7 259: hàng nghìn 7 = 7, hàng trăm 2 = 2. Giống nhau thì so tiếp hàng bên phải.','Two numbers with the **same number of digits**: compare place by place, **left to right**. 7,281 and 7,259: thousands 7 = 7, hundreds 2 = 2. Same? Check the next place.')},
{svg:function(){var s='',a='7281',b='7259';
  for(var i=0;i<4;i++){var f=i===2?'orange':(i<2?'mint':'white');s+=TH.box(52+i*62,40,58,46,a[i],f,{s:26})+TH.box(52+i*62,110,58,46,b[i],f,{s:26})}
  s+=T(205,104,'>','>',{s:26,c:'orange'})+TH.arr(205,18,205,36,{w:3,c:'orange'});
  s+=TH.note(40,170,280,40,LT('Hàng chục: 8 > 5, nên 7 281 > 7 259','Tens: 8 > 5, so 7,281 > 7,259'),{s:16});
  return TH.svg(224,s)},
 say:LT('Hàng chục: **8 > 5**. Gặp chữ số khác nhau đầu tiên là dừng lại, không cần xét tiếp! Vậy **7 281 > 7 259**.','Tens place: **8 > 5**. Stop at the first digits that differ, no need to check more! So **7,281 > 7,259**.'),
 ask:A('So sánh 6 450 ... 6 405','Compare 6,450 ... 6,405',[['>','>'],['<','<'],['=','=']],0,'Đúng rồi!','Right!')},
{svg:function(){var s='';
  s+=T(62,92,'45 678','45,678',{s:21})+T(298,92,'123 456','123,456',{s:21});
  s+=TH.poly('128,92 190,58 190,126',C.green)+TH.c(176,82,5,'white',{sw:2});
  s+=TH.arr(150,150,230,150,{w:3,c:'orange'})+T(180,176,'há miệng về phía số lớn','mouth opens toward the bigger number',{s:15,b:false});
  s+=T(55,214,'< bé hơn','< less than',{s:16})+T(180,214,'> lớn hơn','> greater than',{s:16})+T(305,214,'= bằng','= equal',{s:16});
  return TH.svg(232,s)},
 say:LT('Dấu **<** là bé hơn, **>** là lớn hơn, **=** là bằng nhau. Mẹo: dấu giống miệng cá sấu, luôn **há về phía số lớn**.','The sign **<** means less than, **>** means greater than, **=** means equal. Trick: the sign is like a crocodile mouth that always **opens toward the bigger number**.')},
{svg:function(){var s='',x=[20,135,250],n=['5 304','53 040','5 340'],f=['sky','rose','mint'];
  s+=T(180,18,'Ban đầu','Start',{s:15,b:false,c:GREY});
  var top=[0,1,2],low=[0,2,1];
  top.forEach(function(k,i){s+=TH.box(x[i],26,90,44,G(parseInt(n[k].replace(' ',''))),f[k],{s:19})});
  s+=TH.arr(65,72,65,116,{w:2.5})+TH.arr(180,72,295,116,{w:2.5})+TH.arr(295,72,180,116,{w:2.5});
  low.forEach(function(k,i){s+=TH.box(x[i],122,90,44,G(parseInt(n[k].replace(' ',''))),f[k],{s:19})});
  s+=T(112,152,'<','<',{s:24,c:'orange'})+T(227,152,'<','<',{s:24,c:'orange'});
  s+=T(180,196,'Từ bé đến lớn','Smallest to biggest',{s:16,b:false,c:GREY});
  return TH.svg(210,s)},
 say:LT('Xếp 5 304, 53 040, 5 340 từ bé đến lớn. 53 040 có 5 chữ số nên lớn nhất. Còn 5 304 và 5 340: hàng chục 0 < 4 nên 5 304 bé hơn.','Order 5,304, 53,040 and 5,340 from least to greatest. 53,040 has 5 digits, so it is the greatest. For 5,304 and 5,340: tens 0 < 4, so 5,304 is less.')},
{svg:function(){var s='';
  s+=panel(12,84,false,'9 > 1 nên 9 876 > 12 000','9 > 1, so 9,876 > 12,000','Sai! Chưa đếm chữ số','Wrong! Digits not counted');
  s+=panel(106,84,true,'4 chữ số < 5 chữ số','4 digits < 5 digits','9 876 < 12 000','9,876 < 12,000');
  s+=T(180,214,'Đếm chữ số trước!','Count the digits first!',{s:17});
  return TH.svg(226,s)},
 say:LT('Cẩn thận! Đừng chỉ nhìn chữ số đầu tiên. 9 876 có 4 chữ số, 12 000 có 5 chữ số, nên 12 000 lớn hơn. **Đếm chữ số trước.**','Careful! Do not just look at the first digit. 9,876 has 4 digits and 12,000 has 5, so 12,000 is greater. **Count the digits first.**'),
 ask:A('Số nào lớn hơn: 98 765 hay 100 000?','Which is greater: 98,765 or 100,000?',[P(98765),P(100000)],1,'Giỏi lắm!','Great job!')}
]},

/* ================= ROUND ================= */
round:{memo:LT('Bé hơn 5 thì xuống, từ 5 thì lên, các hàng sau thành 0.','Less than 5, round down. 5 or more, round up. Fill the rest with 0.'),pages:[
{svg:function(){var s='';
  s+=TH.poly('20,40 150,40 180,75 150,110 20,110',C.sun)+TH.c(40,75,6,'white',{sw:2})+T(108,69,'372 000','372,000',{s:22})+T(108,95,'đồng','dong',{s:16,b:false});
  s+=TH.arr(186,75,206,75,{w:3})+TH.r(210,34,138,82,'mint',{rx:16})+T(279,62,'khoảng','about',{s:16,b:false})+T(279,92,'400 000','400,000',{s:22});
  s+=TH.note(30,140,300,44,LT('Nói số gần đúng cho dễ nhớ','A close number is easier to say'),{s:17});
  return TH.svg(200,s)},
 say:LT('Mẹ nhìn thẻ giá **372 000 đồng** và nói: "Khoảng **400 000 đồng**". Nói số gần đúng cho dễ nhớ như vậy gọi là **làm tròn số**.','Mom looks at the price tag, **372,000 dong**, and says: "About **400,000 dong**". Giving a close, easy number like this is called **rounding**.')},
{svg:function(){var s='',k=240/100000,X=function(v){return 60+(v-300000)*k};
  s+=TH.nline(60,300,72,300000,400000,50000,{fmt:function(v){return G(v)},s:15,marks:[{v:372000,t:G(372000),c:'orange',s:16}]});
  s+=TH.tape(X(300000),124,X(372000)-X(300000),34,[{u:1,f:'rose',t:'72 000'}]).replace('72 000',LT('72 000','72,000'));
  s+=TH.tape(X(372000),124,X(400000)-X(372000),34,[{u:1,f:'mint',t:'28 000'}]).replace('28 000',LT('28 000','28,000'));
  s+=T(180,186,'Gần 400 000 hơn','Closer to 400,000',{s:18});
  return TH.svg(206,s)},
 say:LT('372 000 nằm giữa 300 000 và 400 000. Cách 400 000 chỉ 28 000, còn cách 300 000 tới 72 000. Nó gần **400 000** hơn nên làm tròn thành 400 000.','372,000 sits between 300,000 and 400,000. It is only 28,000 from 400,000 but 72,000 from 300,000. It is closer to **400,000**, so it rounds to 400,000.')},
{svg:function(){var s='';
  s+=TH.nline(60,300,70,300000,400000,50000,{fmt:function(v){return G(v)},s:15,marks:[{v:328000,t:G(328000),c:'pink'},{v:372000,t:G(372000),c:'orange'}]});
  s+=TH.tape(60,116,120,40,[{u:1,f:'rose',t:LT('về 300 000','to 300,000')}],{s:16})+TH.tape(180,116,120,40,[{u:1,f:'mint',t:LT('về 400 000','to 400,000')}],{s:16});
  s+=TH.note(50,176,260,36,LT('350 000 là điểm giữa','350,000 is the halfway point'),{s:17});
  return TH.svg(226,s)},
 say:LT('Điểm giữa là **350 000**. Số nằm trước điểm giữa thì về **300 000**. Số từ điểm giữa trở đi thì về **400 000**.','The halfway point is **350,000**. A number before it goes back to **300,000**. A number at the halfway point or after it goes up to **400,000**.')},
{svg:function(){var s='',d='462815',f=['green','orange','white','white','white','white'];
  s+=T(30,28,'hàng trăm nghìn','hundred-thousands',{s:15,a:'start',b:false,c:GREY});
  for(var i=0;i<6;i++)s+=TH.box(30+i*50,40,46,52,d[i],f[i],{s:28});
  s+=TH.arr(53,34,53,38,{w:0.1}).replace(/.*/,'');
  s+=TH.arr(103,150,103,100,{w:3,c:'orange'})+T(103,176,'nhìn chữ số bên phải','look at the digit next to it',{s:16});
  return TH.svg(196,s)},
 say:LT('Làm tròn **462 815** đến hàng trăm nghìn. Chữ số hàng trăm nghìn là **4**. Rồi nhìn chữ số **ngay bên phải** nó: đó là **6**.','Round **462,815** to the hundred-thousands place. The digit in that place is **4**. Now look at the digit **right next to it** on the right: it is **6**.')},
{svg:function(){var s='',d='462815',e='500000';
  for(var i=0;i<6;i++)s+=TH.box(30+i*50,24,46,46,d[i],i===0?'green':(i===1?'orange':'white'),{s:26});
  s+=TH.arr(180,76,180,110,{w:3})+TH.r(70,82,0,0,'none')+T(250,100,'6 từ 5 trở lên: lên','6 ≥ 5: up',{s:18,c:'orange'});
  for(var j=0;j<6;j++)s+=TH.box(30+j*50,118,46,46,e[j],j===0?'green':'gray',{s:26});
  s+=T(180,192,'4 thành 5, các hàng sau thành 0','4 becomes 5, the rest become 0',{s:16,b:false});
  return TH.svg(206,s)},
 say:LT('6 là **từ 5 trở lên** nên làm tròn **lên**: 4 thành 5. Các chữ số sau đó đều thành 0. Vậy 462 815 ≈ **500 000**.','6 is **5 or more**, so we round **up**: 4 becomes 5. All the digits after it become 0. So 462,815 ≈ **500,000**.'),
 ask:A('Làm tròn 681 000 đến hàng trăm nghìn:','Round 681,000 to the hundred-thousands place:',[P(600000),P(700000)],1,'Đúng rồi!','Right!')},
{svg:function(){var s='';
  var one=function(y,d,e,fill,capv,cape){var r='';for(var i=0;i<6;i++)r+=TH.box(14+i*36,y,34,40,d[i],i===0?'green':(i===1?'orange':'white'),{s:22});
   r+=TH.arr(236,y+20,262,y+20,{w:3})+T(346,y+27,e,e,{s:19,a:'end'}).replace(/>([^<]*)</,'>'+LT(gs(e,' '),gs(e,','))+'<');
   return r+T(180,y+64,capv,cape,{s:16,b:false})};
  s+=one(14,'237400','200000',null,'3 bé hơn 5: xuống','3 is less than 5: down');
  s+=one(112,'350000','400000',null,'đúng 5 cũng lên','exactly 5 also goes up');
  return TH.svg(206,s)},
 say:LT('Chữ số bên phải **bé hơn 5** (0, 1, 2, 3, 4) thì làm tròn **xuống**: 237 400 ≈ 200 000. Từ 5 đến 9 thì **lên**, đúng 5 cũng lên: 350 000 ≈ 400 000.','If the next digit is **less than 5** (0, 1, 2, 3, 4), round **down**: 237,400 ≈ 200,000. From 5 to 9, round **up**, and exactly 5 goes up too: 350,000 ≈ 400,000.')},
{svg:function(){var s='';
  s+=panel(12,84,false,'462 815 ≈ 500 815','462,815 ≈ 500,815','Sai! Các hàng sau phải là 0','Wrong! The rest must be 0');
  s+=panel(106,84,true,'462 815 ≈ 500 000','462,815 ≈ 500,000','Đúng! Sau hàng làm tròn đều là 0','Right! All zeros after the place');
  return TH.svg(206,s)},
 say:LT('Cẩn thận! Sau khi làm tròn, mọi chữ số bên phải hàng làm tròn đều thành **0**. Đừng viết 500 815 hay chỉ 500 nhé.','Careful! After rounding, every digit to the right of the rounding place becomes **0**. Do not write 500,815 or just 500.'),
 ask:A('Làm tròn 1 249 999 đến hàng trăm nghìn:','Round 1,249,999 to the hundred-thousands place:',[P(1200000),P(1300000),P(1000000)],0,'Giỏi lắm!','Great job!')}
]},

/* ================= ADDSUB ================= */
addsub:{memo:LT('Thẳng cột, tính từ phải sang trái. Đủ 10 thì nhớ 1. Trừ thiếu thì mượn 1 chục.','Line up, go right to left. Reach 10? Carry 1. Too small? Borrow 1 ten.'),pages:[
{svg:function(){var s='';
  s+=TH.dots(6,40,40,{color:'blue',perRow:3,gap:22})+T(116,56,'+','+',{s:26})+TH.dots(9,160,40,{color:'orange',perRow:5,gap:22})+T(300,56,'= 15','= 15',{s:22});
  s+=TH.arr(180,98,180,122,{w:3});
  s+=TH.r(20,128,136,62,'sun',{rx:14,dash:'6 4'})+TH.dots(10,44,148,{color:'yellow',perRow:5,gap:22})+T(190,166,'+','+',{s:26})+TH.dots(5,220,158,{color:'orange',perRow:5,gap:22});
  s+=T(88,214,'1 chục','1 ten',{s:16})+T(270,214,'5 đơn vị','5 ones',{s:16});
  return TH.svg(228,s)},
 say:LT('Con có 6 bi xanh và 9 bi cam. 6 + 9 = 15. Gom 10 viên thành **1 chục**, còn **5** viên lẻ. Đó chính là **nhớ** trong phép cộng!','You have 6 blue and 9 orange marbles. 6 + 9 = 15. Bundle 10 into **1 ten**, leaving **5** ones. That is exactly what **carrying** means!')},
{svg:function(){return colfig({top:'4786',bot:'2539',op:'+',foot:[[ 'Thẳng cột: đơn vị với đơn vị', 'Line up: ones under ones']]})},
 say:LT('Để tính **4 786 + 2 539**, viết số này dưới số kia, **thẳng cột**: đơn vị dưới đơn vị, chục dưới chục… Rồi tính từ **phải sang trái**.','To work out **4,786 + 2,539**, write one number under the other, **lined up**: ones under ones, tens under tens… Then work **from right to left**.'),
 ask:A('Ta bắt đầu tính từ hàng nào?','Which place do we start with?',[['hàng đơn vị (bên phải)','ones place (right)'],['hàng nghìn (bên trái)','thousands place (left)']],0,'Đúng rồi!','Right!')},
{svg:function(){return colfig({top:'4786',bot:'2539',op:'+',act:3,res:['','','','5'],carry:{2:'1'},foot:[['6 + 9 = 15: viết 5, nhớ 1','6 + 9 = 15: write 5, carry 1']]})},
 say:LT('Hàng đơn vị: 6 + 9 = 15. Đủ 10 rồi! Viết **5**, và **nhớ 1** sang hàng chục (1 chục vừa gom được).','Ones place: 6 + 9 = 15. That makes a ten! Write **5** and **carry 1** to the tens place (the ten we just bundled).')},
{svg:function(){return colfig({top:'4786',bot:'2539',op:'+',act:2,res:['','','2','5'],carry:{2:'1',1:'1'},foot:[['8 + 3 + 1 (nhớ) = 12','8 + 3 + 1 (carried) = 12'],['viết 2, nhớ 1','write 2, carry 1']]})},
 say:LT('Hàng chục: 8 + 3 = 11, cộng thêm **1 nhớ** là 12. Viết **2**, nhớ **1** sang hàng trăm.','Tens place: 8 + 3 = 11, plus the **1 carried** makes 12. Write **2** and carry **1** to the hundreds.')},
{svg:function(){return colfig({top:'4786',bot:'2539',op:'+',res:['7','3','2','5'],carry:{2:'1',1:'1',0:'1'},foot:[['7 + 5 + 1 = 13; 4 + 2 + 1 = 7','7 + 5 + 1 = 13; 4 + 2 + 1 = 7'],['4 786 + 2 539 = 7 325','4,786 + 2,539 = 7,325']]})},
 say:LT('Hàng trăm: 7 + 5 + 1 = 13, viết **3**, nhớ 1. Hàng nghìn: 4 + 2 + 1 = 7. Vậy **4 786 + 2 539 = 7 325**.','Hundreds: 7 + 5 + 1 = 13, write **3**, carry 1. Thousands: 4 + 2 + 1 = 7. So **4,786 + 2,539 = 7,325**.')},
{svg:function(){return colfig({top:'7325',bot:'2539',op:'−',act:3,strike:[3,2],adj:{3:'15',2:'1'},res:['','','','6'],foot:[['5 không trừ được 9: mượn 1 chục','5 is too small for 9: borrow 1 ten'],['15 − 9 = 6 (hàng chục còn 1)','15 − 9 = 6 (tens place left with 1)']]})},
 say:LT('Trừ thì ngược lại: **7 325 − 2 539**. Hàng đơn vị: 5 không trừ được 9, nên **mượn 1 chục**: 15 − 9 = 6. Hàng chục: 1 không trừ được 3, mượn 1 trăm: 11 − 3 = 8. Cứ mượn tiếp như vậy ở các hàng sau, được **4 786**. Thử lại bằng phép cộng nhé!','Subtraction is the opposite: **7,325 − 2,539**. Ones: 5 is too small for 9, so **borrow 1 ten**: 15 − 9 = 6. Tens: 1 is too small for 3, so borrow 1 hundred: 11 − 3 = 8. Keep borrowing the same way to get **4,786**. Check it with addition!')},
{svg:function(){var s='',p=function(ox,ok){var r='';
   r+=T(ox+80,30,ok?'Nhớ 1':'Quên nhớ',ok?'Carry the 1':'Forgot to carry',{s:17,c:ok?'green':'red'});
   if(ok)r+=TH.t(ox+55,66,'1',{s:22,c:'orange'});
   r+=TH.t(ox+55,98,'4',{s:28})+TH.t(ox+90,98,'6',{s:28})+TH.t(ox+25,128,'+',{s:28})+TH.t(ox+55,128,'3',{s:28})+TH.t(ox+90,128,'8',{s:28})+TH.l(ox+20,140,ox+110,140,{w:3.5});
   r+=TH.t(ox+55,174,ok?'8':'7',{s:28,c:ok?'green':'red'})+TH.t(ox+90,174,'4',{s:28,c:ok?'green':'red'});return r};
  s+=TH.r(8,6,170,196,'rose',{rx:14})+p(2,false)+TH.r(182,6,170,196,'mint',{rx:14})+p(176,true);
  return TH.svg(210,s)},
 say:LT('Cẩn thận! Đừng quên cộng **số nhớ**. 46 + 38: quên nhớ thì ra 74 (sai), nhớ 1 thì ra **84** (đúng).','Careful! Never forget to add the **carried number**. 46 + 38: forgetting the carry gives 74 (wrong), carrying 1 gives **84** (right).'),
 ask:A('538 + 247: hàng đơn vị 8 + 7 = 15, nhớ 1. Hàng chục: 3 + 4 + 1 = ?','538 + 247: ones 8 + 7 = 15, carry 1. Tens: 3 + 4 + 1 = ?',[['7','7'],['8','8'],['9','9']],1,'Đúng rồi!','Right!')}
]},

/* ================= MUL ================= */
mul:{memo:LT('Nhân từng chữ số, từ phải sang trái. Nhân hàng chục thì viết lùi một cột (hoặc thêm số 0 ở cuối).','Multiply digit by digit, right to left. For the tens digit, shift one column (or add a 0 at the end).'),pages:[
{svg:function(){var s='';
  for(var i=0;i<3;i++){var y=14+i*50;s+=T(32,y+26,'Hộp '+(i+1),'Box '+(i+1),{s:15,b:false,c:GREY})+TH.r(64,y,206,40,'sun',{rx:10})+TH.box(72,y+4,100,32,'100','rose',{s:17})+TH.box(176,y+4,40,32,'20','yellow',{s:17})+TH.box(220,y+4,40,32,'4','sky',{s:17})+T(310,y+27,'= 124','= 124',{s:20})}
  s+=TH.note(30,172,300,40,LT('124 + 124 + 124 = 3 × 124','124 + 124 + 124 = 3 × 124'),{s:19});
  return TH.svg(226,s)},
 say:LT('Mỗi hộp có 124 viên bi, có 3 hộp. Cộng 124 + 124 + 124, viết gọn là **3 × 124**. Phép nhân là cộng nhiều lần những số **bằng nhau**.','Each box has 124 marbles, and there are 3 boxes. Add 124 + 124 + 124, or write it shorter as **3 × 124**. Multiplication is adding **equal** groups many times.')},
{svg:function(){var s='',xs=[64,180,296],t=['100','20','4'],f=['rose','yellow','sky'],r=['300','60','12'];
  for(var i=0;i<3;i++){s+=TH.box(xs[i]-46,12,92,36,t[i],f[i],{s:19})+TH.arr(xs[i],52,xs[i],84,{w:2.5})+T(xs[i]+26,74,'× 3','× 3',{s:16,a:'start'})+TH.box(xs[i]-46,88,92,40,r[i],f[i],{s:22})}
  s+=TH.brace(18,342,136,LT('300 + 60 + 12 = 372','300 + 60 + 12 = 372'),{c:'orange'});
  return TH.svg(194,s)},
 say:LT('Tách 124 = 100 + 20 + 4, rồi nhân từng phần với 3: được 300, 60 và 12. Cộng lại: **372** viên bi.','Split 124 = 100 + 20 + 4, then multiply each part by 3: 300, 60 and 12. Add them up: **372** marbles.')},
{svg:function(){return colfig({top:'1234',bot:'   3',op:'×',act:3,res:['','','','2'],carry:{2:'1'},foot:[['4 × 3 = 12: viết 2, nhớ 1','4 × 3 = 12: write 2, carry 1']]})},
 say:LT('Nhân dọc làm gọn việc đó. **1 234 × 3**: nhân 3 với từng chữ số, từ phải sang trái. Hàng đơn vị: 4 × 3 = 12, viết **2**, nhớ **1**.','Column multiplication makes it neat. **1,234 × 3**: multiply 3 by each digit, right to left. Ones: 4 × 3 = 12, write **2**, carry **1**.'),
 ask:A('Hàng chục: 3 × 3 = 9, thêm 1 nhớ là mấy?','Tens: 3 × 3 = 9, plus the 1 carried is?',[['10','10'],['9','9'],['12','12']],0,'Đúng rồi!','Right!')},
{svg:function(){return colfig({top:'1234',bot:'   3',op:'×',res:['3','7','0','2'],carry:{2:'1',1:'1'},foot:[['9 + 1 = 10; 2 × 3 + 1 = 7; 1 × 3 = 3','9 + 1 = 10; 2 × 3 + 1 = 7; 1 × 3 = 3'],['1 234 × 3 = 3 702','1,234 × 3 = 3,702']]})},
 say:LT('Hàng chục: 9 + 1 = 10, viết **0**, nhớ 1. Hàng trăm: 2 × 3 + 1 = 7. Hàng nghìn: 1 × 3 = 3. Vậy **1 234 × 3 = 3 702**.','Tens: 9 + 1 = 10, write **0**, carry 1. Hundreds: 2 × 3 + 1 = 7. Thousands: 1 × 3 = 3. So **1,234 × 3 = 3,702**.')},
{svg:function(){return mul2({p1:true,p2:true,zero:true,foot:[['236 × 4 = 944','236 × 4 = 944'],['236 × 20: nhân 2 rồi thêm số 0 = 4 720','236 × 20: multiply by 2, add a 0 = 4,720']]})},
 say:LT('Nhân với số có hai chữ số: **236 × 24**. Tách 24 = 20 + 4. Nhân với **4** được 944. Nhân với **20**: nhân 2 rồi viết thêm **số 0** ở cuối, được 4 720.','Multiplying by a 2-digit number: **236 × 24**. Split 24 = 20 + 4. Times **4** gives 944. Times **20**: multiply by 2, then write a **0** at the end, giving 4,720.')},
{svg:function(){return mul2({p1:true,p2:true,res:true,foot:[['944 + 4 720 = 5 664','944 + 4,720 = 5,664'],['236 × 24 = 5 664','236 × 24 = 5,664']]})},
 say:LT('Cộng hai tích riêng lại: 944 + 4 720 = 5 664. Vậy **236 × 24 = 5 664**. Ước lượng cho chắc: làm tròn 236 thành 240 và 24 thành 20, rồi nhân xem có gần 5 664 không nhé!','Add the two partial products: 944 + 4,720 = 5,664. So **236 × 24 = 5,664**. Check by estimating: round 236 to 240 and 24 to 20, then multiply. Is it close to 5,664?'),
 ask:A('Ước lượng: 240 × 20 = ?','Estimate: 240 × 20 = ?',[P(4800),P(480),P(48000)],0,'Đúng rồi!','Right!')},
{svg:function(){var s='';
  s+=panel(12,84,false,'944 + 472 = 1 416','944 + 472 = 1,416','Sai! Quên số 0','Wrong! Forgot the 0');
  s+=panel(106,84,true,'944 + 4 720 = 5 664','944 + 4,720 = 5,664','Đúng! Số 0 giữ chỗ','Right! The 0 holds the place');
  return TH.svg(204,s)},
 say:LT('Cẩn thận! Khi nhân với chữ số hàng chục, đừng quên số **0** ở cuối (hoặc lùi một cột). 944 + 472 là **sai**; 944 + 4 720 mới đúng.','Careful! When you multiply by the tens digit, do not forget the **0** at the end (or shift one column). 944 + 472 is **wrong**; 944 + 4,720 is right.'),
 ask:A('35 × 20 = ?','35 × 20 = ?',[['70','70'],['700','700']],1,'Giỏi lắm!','Great job!')}
]}
});
})();


/* theory_t2.js */
window.LY_THUYET = window.LY_THUYET || {};
(function(){
var C=TH.C,T=TH.t,S=TH.svg;
function dd(n,x,y,c,o){o=o||{};o.color=c;o.r=o.r||10;o.gap=o.gap||25;return TH.dots(n,x,y,o)}
function ex(x,y,parts,s){return '<text x="'+x+'" y="'+y+'" font-size="'+(s||22)+'" font-weight="800" text-anchor="middle" fill="#1F2A44">'+parts.map(function(p){if(typeof p==='string')p=[p];return '<tspan'+(p[1]?' fill="'+(C[p[1]]||p[1])+'"':'')+'>'+TH.esc(p[0])+'</tspan>'}).join('')+'</text>'}
function pan(x,y,h,ok,head,lines,s){var r=TH.r(x,y,165,h,ok?'mint':'rose',{rx:14})+T(x+82,y+28,head,{s:18,c:ok?'teal':'red'});lines.forEach(function(l,i){r+=ex(x+82,y+64+i*30,typeof l==='string'?[l]:l,s||18)});return r}
function flow(rows,labs){var f=['sky','sun','mint'],s='';rows.forEach(function(r,i){s+=TH.box(50,15+i*80,260,44,r,f[i],{s:19})});labs.forEach(function(l,i){s+=TH.arr(180,62+i*80,180,92+i*80,{w:3})+T(205,83+i*80,l,{s:18,a:'start',c:'red'})});return S(235,s)}
/* long division stages */
function ld(st,h){var f={s:26},s='';
s+=T(70,40,'7',f)+T(100,40,'5',f)+T(130,40,'6',f)+TH.l(150,16,150,90)+TH.l(150,50,290,50)+T(190,40,'3',f);
s+=T(170,82,'2',{s:26,c:st==1?'red':'ink'});
s+=T(70,74,'6',f)+TH.l(55,82,85,82,{w:2.5})+T(70,106,'1',f);
if(st>=2){s+=T(200,82,'5',{s:26,c:st==2?'red':'ink'})+TH.arr(100,52,100,86,{c:'orange',dash:'4 4',w:2.5})+T(100,106,'5',{s:26,c:'orange'})+T(70,140,'1',f)+T(100,140,'5',f)+TH.l(55,148,115,148,{w:2.5})+T(100,172,'0',f)}
if(st>=3){s+=T(230,82,'2',{s:26,c:'red'})+TH.arr(130,52,130,152,{c:'orange',dash:'4 4',w:2.5})+T(130,172,'6',{s:26,c:'orange'})+T(130,206,'6',f)+TH.l(115,214,145,214,{w:2.5})+T(130,238,'0',f)}
return S(h,s)}
var N7=LT('Mi','Mi');
Object.assign(window.LY_THUYET,{
quick:{memo:LT('Tìm số tròn chục, tròn trăm để ghép cặp!','Look for round numbers to pair up!'),pages:[
{svg:()=>S(180,dd(3,30,40,'blue')+T(110,48,'+',{s:24})+dd(5,135,40,'orange')+T(300,48,'= 8',{s:22})+dd(5,30,95,'orange')+T(160,103,'+',{s:24})+dd(3,190,95,'blue')+T(300,103,'= 8',{s:22})+T(180,160,'3 + 5 = 5 + 3',{s:24})),
 say:LT('Con thử 3 + 5 và 5 + 3: đều bằng 8! Khi cộng (hoặc nhân), **đổi chỗ** các số thì kết quả **không đổi**. Đó là tính chất **giao hoán**.','Try 3 + 5 and 5 + 3: both make 8! When you add (or multiply), **swapping** the numbers does **not** change the answer. This is the **commutative** property.')},
{svg:()=>S(205,TH.tape(20,25,320,40,[{u:25,f:'sky',t:'25'},{u:37,f:'sun',t:'37'},{u:75,f:'mint',t:'75'}])+TH.arr(60,70,60,98,{w:3})+T(78,90,LT('đổi chỗ','swap'),{s:15,a:'start',c:'red'})+TH.tape(20,105,320,40,[{u:25,f:'sky',t:'25'},{u:75,f:'mint',t:'75'},{u:37,f:'sun',t:'37'}])+TH.brace(20,253.6,148,LT('25 + 75 = 100','25 + 75 = 100'),{c:'orange'})),
 say:LT('Tính nhanh **25 + 37 + 75**. Đừng cộng từ trái sang phải! Cú Mi tìm hai số ghép lại thành **số tròn trăm**. Đó là hai số nào?','Let\'s do **25 + 37 + 75** the quick way. Don\'t just go left to right! Mi the owl looks for two numbers that make a **round hundred**. Which two?'),
 ask:{opts:[LT('25 và 75','25 and 75'),LT('25 và 37','25 and 37'),LT('37 và 75','37 and 75')],ans:LT('25 và 75','25 and 75'),good:LT('Đúng! 25 + 75 = 100, tròn trăm.','Right! 25 + 75 = 100, a round hundred.')}},
{svg:()=>S(205,ex(180,38,['25 + 37 + 75'])+ex(180,80,['= 37 + ',['(25 + 75)','red']])+ex(180,122,['= 37 + 100'])+TH.r(120,138,120,48,'sun',{rx:12})+T(180,171,'= 137',{s:26})),
 say:LT('Đổi chỗ rồi **nhóm** 25 với 75 bằng ngoặc: 25 + 37 + 75 = 37 + (25 + 75) = 37 + 100 = **137**. Gọi là tính chất **kết hợp**. Nhẩm nhanh hơn nhiều!','Swap, then **group** 25 and 75 with brackets: 25 + 37 + 75 = 37 + (25 + 75) = 37 + 100 = **137**. This is the **associative** property. Much faster in your head!')},
{svg:()=>S(205,T(40,60,LT('3 hàng','3 rows'),{s:15})+T(90+42,28,'4',{s:20,c:'blue'})+T(228,28,'2',{s:20,c:'orange'})+[0,1,2].map(function(i){return dd(4,90,56+i*28,'blue',{r:10,gap:28})+dd(2,214,56+i*28,'orange',{r:10,gap:28})}).join('')+T(110,170,'3 × 4 = 12',{s:18})+T(250,170,'3 × 2 = 6',{s:18})+T(180,198,'3 × (4 + 2) = 12 + 6 = 18',{s:19})),
 say:LT('**3 × (4 + 2)** là 3 hàng, mỗi hàng 4 chấm xanh và 2 chấm cam. Đếm theo màu: 3 × 4 và 3 × 2. Vậy **3 × (4 + 2) = 3 × 4 + 3 × 2**. Đây là **nhân một số với một tổng**: 3 × (4 + 2) = 3 × 4 + 3 × 2.','**3 × (4 + 2)** is 3 rows, each with 4 blue dots and 2 orange dots. Count by color: 3 × 4 and 3 × 2. So **3 × (4 + 2) = 3 × 4 + 3 × 2**. This is the **distributive** property.')},
{svg:()=>S(215,TH.r(60,40,140,70,'sky')+T(130,82,'36 × 7',{s:19})+TH.r(200,40,60,70,'sun')+T(230,82,'36 × 3',{s:15})+T(36,82,'36',{s:20})+T(130,28,'7',{s:19,c:'blue'})+T(230,28,'3',{s:19,c:'orange'})+TH.brace(60,260,114,'7 + 3 = 10')+T(180,198,'36 × 7 + 36 × 3 = 36 × 10 = 360',{s:17})),
 say:LT('Đi ngược lại cũng được! **36 × 7 + 36 × 3** có chung thừa số 36. Ghép hai hình chữ nhật lại thành 36 × (…) = 36 × 10 = **360**. Trong ngoặc là gì?','It works backward too! **36 × 7 + 36 × 3** share the factor 36. Join the two rectangles: 36 × (…) = 36 × 10 = **360**. What goes in the brackets?'),
 ask:{opts:[LT('7 + 3','7 + 3'),LT('7 × 3','7 × 3'),LT('36 + 3','36 + 3')],ans:LT('7 + 3','7 + 3'),good:LT('Đúng! 36 × (7 + 3) = 36 × 10.','Right! 36 × (7 + 3) = 36 × 10.')}},
{svg:()=>S(205,pan(10,10,135,false,LT('Sai','Wrong'),['5 + 4 × 3','= 9 × 3','= 27'],19)+pan(185,10,135,true,LT('Đúng','Right'),[['5 + ',['4 × 3','red']],'= 5 + 12','= 17'],19)+T(180,185,LT('Nhân trước, cộng sau!','Multiply first, add later!'),{s:19})),
 say:LT('Cẩn thận thứ tự! Trong **5 + 4 × 3**, phép **nhân làm trước**, phép cộng làm sau. Kết quả là bao nhiêu?','Careful with the order! In **5 + 4 × 3**, **multiplication comes first**, then addition. What is the result?'),
 ask:{opts:[LT('17','17'),LT('27','27')],ans:LT('17','17'),good:LT('Đúng! 4 × 3 = 12 trước, rồi 5 + 12 = 17.','Right! 4 × 3 = 12 first, then 5 + 12 = 17.')}},
{svg:()=>S(200,T(70,22,'a',{s:20})+T(180,22,'b',{s:20})+T(290,22,'c',{s:20})+TH.c(70,58,22,'sky')+T(70,66,'5',{s:22})+TH.c(180,58,22,'sun')+T(180,66,'4',{s:22})+TH.c(290,58,22,'mint')+T(290,66,'3',{s:22})+T(180,118,'a + b × c',{s:24})+ex(180,158,['= 5 + 4 × 3 = 5 + 12 = 17'],20)),
 say:LT('**Biểu thức chứa chữ**: chữ đứng thay cho số. Với a = 5, b = 4, c = 3 thì a + b × c = 5 + 4 × 3 = 5 + 12 = **17**. Thay chữ bằng số rồi tính.','**Expressions with letters**: a letter stands for a number. With a = 5, b = 4, c = 3, a + b × c = 5 + 4 × 3 = 5 + 12 = **17**. Replace the letters with numbers, then calculate.')}
]},
div:{memo:LT('Chia – nhân – trừ – hạ, rồi lặp lại!','Divide, multiply, subtract, bring down, repeat!'),pages:[
{svg:()=>S(175,[65,180,295].map(function(x,i){return TH.c(x,65,38,'white')+TH.dots(4,x-10,55,{perRow:2,r:7,gap:20,color:['blue','orange','pink'][i]})+T(x,130,LT('bạn '+(i+1),'friend '+(i+1)),{s:15})}).join('')+T(180,162,'12 : 3 = 4',{s:22})),
 say:LT('**Chia đều** là chia thành các phần bằng nhau. 12 cái kẹo chia đều cho 3 bạn: mỗi bạn được **4 cái**. Ta viết **12 : 3 = 4**.','**Sharing equally** means making equal parts. Share 12 candies equally among 3 friends: each gets **4**. We write **12 ÷ 3 = 4**.')},
{svg:()=>S(150,T(10,40,LT('Trăm','Hundreds'),{s:15,a:'start'})+T(10,80,LT('Chục','Tens'),{s:15,a:'start'})+T(10,120,LT('Đơn vị','Ones'),{s:15,a:'start'})+[0,1,2,3,4,5,6].map(function(i){return TH.r(110+i*28,22,22,22,'sky',{rx:4,sw:2})}).join('')+[0,1,2,3,4].map(function(i){return TH.r(110+i*28,62,22,22,'sun',{rx:4,sw:2})}).join('')+dd(6,121,120,'mint',{r:10,gap:28})+T(335,40,'7',{s:20})+T(335,80,'5',{s:20})+T(335,120,'6',{s:20})),
 say:LT('Số lớn thì sao? Chia **756 : 3**. Số 756 gồm 7 trăm, 5 chục và 6 đơn vị. Ta chia dần từng hàng, chia cho 3 bạn. Ta bắt đầu chia từ hàng nào?','What about big numbers? Let\'s divide **756 ÷ 3**. The number 756 has 7 hundreds, 5 tens and 6 ones. We share one place at a time among 3 friends. Which place do we start with?'),
 ask:{opts:[LT('Hàng trăm','Hundreds'),LT('Hàng đơn vị','Ones')],ans:LT('Hàng trăm','Hundreds'),good:LT('Đúng! Ta chia từ hàng lớn nhất, bên trái.','Right! We start from the biggest place, on the left.')}},
{svg:()=>ld(1,125),
 say:LT('7 trăm chia cho 3 bạn: **7 : 3 = 2**, viết 2. **Nhân**: 2 × 3 = 6. **Trừ**: 7 − 6 = 1 (còn thừa 1 trăm).','Share 7 hundreds among 3: **7 ÷ 3 = 2**, write 2. **Multiply**: 2 × 3 = 6. **Subtract**: 7 − 6 = 1 (1 hundred is left).')},
{svg:()=>ld(2,185),
 say:LT('**Hạ** chữ số 5 xuống, được 15. Chia tiếp: 15 : 3 = ? Rồi nhân lại và trừ đi: 15 − 15 = 0.','**Bring down** the 5 to make 15. Divide again: 15 ÷ 3 = ? Then multiply back and subtract: 15 − 15 = 0.'),
 ask:{opts:[LT('4','4'),LT('5','5'),LT('6','6')],ans:LT('5','5'),good:LT('Đúng! 5 × 3 = 15, vừa đủ.','Right! 5 × 3 = 15, exactly.')}},
{svg:()=>ld(3,252),
 say:LT('Hạ 6 xuống. 6 : 3 = 2, nhân 2 × 3 = 6, trừ 6 − 6 = 0. Hết số để hạ. Vậy **756 : 3 = 252**. Nhớ 4 việc: chia – nhân – trừ – hạ!','Bring down the 6. 6 ÷ 3 = 2, multiply 2 × 3 = 6, subtract 6 − 6 = 0. Nothing left to bring down. So **756 ÷ 3 = 252**. Remember 4 jobs: divide, multiply, subtract, bring down!')},
{svg:()=>S(235,TH.box(20,15,150,44,'38 ≈ 40','sky',{s:20})+TH.box(190,15,150,44,'159 ≈ 160','sun',{s:20})+TH.arr(180,64,180,86,{w:3})+TH.box(80,90,200,44,'160 : 40 = 4','mint',{s:21})+TH.arr(180,138,180,158,{w:3})+T(180,185,LT('Thử: 4 × 38 = 152','Check: 4 × 38 = 152'),{s:19})+T(180,213,LT('152 không quá 159','152 does not go over 159'),{s:17})),
 say:LT('Chia cho số có hai chữ số: **1 596 : 38**. Lấy 159 (vì 15 < 38). **Ước lượng** bằng số tròn: 160 : 40 = 4. Thử 5 × 38 = 190, lớn hơn 159, nên không chọn 5. Hỏi nhanh: chọn số nào thì được?','Dividing by two digits: **1,596 ÷ 38**. Take 159 (because 15 < 38). **Estimate** with round numbers: 160 ÷ 40 = 4. Try 5 × 38 = 190, more than 159, so we cannot pick 5. Quick question: which number can we pick?'),
 ask:{opts:[LT('4 (vì 4 × 38 = 152)','4 (because 4 × 38 = 152)'),LT('5 (vì 5 × 38 = 190)','5 (because 5 × 38 = 190)')],ans:LT('4 (vì 4 × 38 = 152)','4 (because 4 × 38 = 152)'),good:LT('Đúng! 152 không quá 159, nên chọn 4.','Right! 152 is not over 159, so we pick 4.')}},
{svg:()=>S(200,[0,1,2].map(function(i){return TH.r(22+i*110,28,100,36,'white',{rx:10})+TH.dots(5,38+i*110,46,{r:8,gap:18,color:['blue','orange','pink'][i]})}).join('')+dd(2,40,100,'green',{r:9,gap:24})+T(80,106,LT('dư 2','left over 2'),{s:17,a:'start',c:'red'})+T(180,152,LT('17 : 5 = 3 (dư 2)','17 ÷ 5 = 3 (remainder 2)'),{s:20})+T(180,184,LT('Số dư bé hơn số chia: 2 < 5','Remainder < divisor: 2 < 5'),{s:17})),
 say:LT('Có khi chia không hết. 17 cái kẹo xếp vào hộp 5 cái: được **3 hộp**, **dư 2** cái. Số dư luôn **bé hơn số chia** (2 < 5), nếu không thì còn chia tiếp được. Chia cho 5, số dư có thể là 6 không?','Sometimes it doesn\'t divide evenly. 17 candies into boxes of 5: **3 boxes** and **2 left over**. The remainder is always **smaller than the divisor** (2 < 5), or we could keep dividing. When dividing by 5, can the remainder be 6?'),
 ask:{opts:[LT('Không, phải bé hơn 5','No, it must be less than 5'),LT('Có','Yes')],ans:LT('Không, phải bé hơn 5','No, it must be less than 5'),good:LT('Đúng! Dư 6 thì còn chia được thêm một nhóm 5.','Right! With 6 left, we could still make another group of 5.')}}
]},
x10:{memo:LT('Đếm số 0: nhân thì thêm, chia thì bỏ!','Count the zeros: multiply adds, divide removes!'),pages:[
{svg:()=>S(150,[0,1,2].map(function(i){return TH.r(15+i*115,20,100,62,'sun',{rx:10})+TH.dots(10,29+i*115,40,{perRow:5,r:7,gap:19,color:'orange'})}).join('')+T(180,125,'3 × 10 = 10 + 10 + 10 = 30',{s:20})),
 say:LT('1 bó có **10** que tính. 3 bó có bao nhiêu que? 10 + 10 + 10 = 30, tức là **3 × 10 = 30**. Nhân với 10 là gấp số đó lên 10 lần.','1 bundle has **10** sticks. How many sticks in 3 bundles? 10 + 10 + 10 = 30, so **3 × 10 = 30**. Multiplying by 10 makes that number 10 times bigger.')},
{svg:()=>S(215,T(90,24,LT('Trăm','Hundreds'),{s:15})+T(180,24,LT('Chục','Tens'),{s:15})+T(270,24,LT('Đơn vị','Ones'),{s:15})+TH.box(50,32,80,48,'','white')+TH.box(140,32,80,48,'3','sky',{s:26})+TH.box(230,32,80,48,'5','sky',{s:26})+TH.arr(170,84,115,118,{c:'red'})+TH.arr(260,84,205,118,{c:'red'})+T(262,108,LT('dời sang trái','shift left'),{s:15,a:'start',c:'red'})+TH.box(50,122,80,48,'3','mint',{s:26})+TH.box(140,122,80,48,'5','mint',{s:26})+TH.box(230,122,80,48,'0','sun',{s:26})+T(180,203,'35 × 10 = 350',{s:22})),
 say:LT('35 có 3 chục, 5 đơn vị. Nhân 10: **mỗi chữ số dời sang trái một hàng**. Hàng đơn vị bị trống, ta điền **0** giữ chỗ. Vậy 35 × 10 = **350**.','35 has 3 tens and 5 ones. Times 10: **every digit moves one place to the left**. The empty ones place gets a **0** to hold it. So 35 × 10 = **350**.')},
{svg:()=>S(175,[1,2,3].map(function(k,i){var y=22+i*50,z='';for(var j=0;j<k;j++)z+=TH.c(165+j*30,y+20,13,'orange')+T(165+j*30,y+26,'0',{s:17});var r=['470','4 700','47 000'];return T(45,y+28,'× '+['10','100',LT('1 000','1,000')][i],{s:18})+TH.box(80,y,50,40,'47','sky',{s:21})+z+T(255,y+28,'= '+[LT('470','470'),LT('4 700','4,700'),LT('47 000','47,000')][i],{s:19,a:'start'})}).join('')),
 say:LT('Nhân với **100** thì dời **hai hàng**, thêm **hai chữ số 0**. Nhân với **1 000** thì thêm **ba chữ số 0**. Cùng làm: 36 × 100 = ?','Times **100** shifts **two places**: add **two zeros**. Times **1,000**: add **three zeros**. Try it: 36 × 100 = ?'),
 ask:{opts:[LT('360','360'),LT('3 600','3,600'),LT('36 000','36,000')],ans:LT('3 600','3,600'),good:LT('Đúng! Thêm hai chữ số 0.','Right! Add two zeros.')}},
{svg:()=>S(225,TH.box(50,32,50,52,'5','sky',{s:26})+TH.box(105,32,50,52,'4','sky',{s:26})+TH.box(160,32,50,52,'0','rose',{s:26,sw:2})+TH.box(215,32,50,52,'0','rose',{s:26})+TH.l(165,38,205,78,{c:'red',w:3})+TH.l(220,38,260,78,{c:'red',w:3})+TH.arr(180,92,180,128,{w:3})+T(200,116,LT('bỏ 2 chữ số 0','remove 2 zeros'),{s:16,a:'start',c:'red'})+TH.box(105,134,50,52,'5','mint',{s:26})+TH.box(160,134,50,52,'4','mint',{s:26})+T(180,214,LT('5 400 : 100 = 54','5,400 ÷ 100 = 54'),{s:21})),
 say:LT('Chia thì làm ngược lại. **5 400 : 100**: 100 có hai chữ số 0, nên **bỏ hai chữ số 0** ở bên phải 5 400. Được **54**. Mỗi chữ số dời sang phải 2 hàng.','Division goes the other way. **5,400 ÷ 100**: 100 has two zeros, so **remove two zeros** from the right of 5,400. We get **54**. Every digit moves 2 places to the right.')},
{svg:()=>S(185,TH.box(20,30,80,50,'35','sky',{s:24})+TH.box(260,30,80,50,LT('350','350'),'mint',{s:24})+TH.arr(110,45,250,45,{w:3})+T(180,35,'× 10',{s:18,c:'red'})+TH.arr(250,68,110,68,{w:3,c:'orange'})+T(180,98,'÷ 10',{s:18,c:'orange'})+T(180,135,LT('nhân: thêm số 0','multiply: add zeros'),{s:18})+T(180,165,LT('chia: bỏ số 0','divide: remove zeros'),{s:18})),
 say:LT('Mẹo nhớ: đếm số 0 của 10, 100, 1 000. **Nhân** thì **thêm** bấy nhiêu số 0, **chia** thì **bỏ** bấy nhiêu số 0. Cùng làm: 8 000 : 1 000 = ?','Memory trick: count the zeros in 10, 100, 1,000. **Multiply**: **add** that many zeros. **Divide**: **remove** that many zeros. Try it: 8,000 ÷ 1,000 = ?'),
 ask:{opts:[LT('8','8'),LT('80','80'),LT('800','800')],ans:LT('8','8'),good:LT('Đúng! Bỏ ba chữ số 0 còn 8.','Right! Remove three zeros and 8 is left.')}},
{svg:()=>S(205,pan(10,10,135,false,LT('Sai','Wrong'),['6 × 100',[['= 60','red']],[LT('mới 1 số 0','only 1 zero')]],19)+pan(185,10,135,true,LT('Đúng','Right'),['6 × 100','= 600',LT('đủ 2 số 0','2 zeros')],19)+T(180,185,LT('100 có mấy số 0 thì thêm bấy nhiêu!','Add as many zeros as 100 has!'),{s:16})),
 say:LT('Cẩn thận! 6 × 100 phải thêm **hai** chữ số 0, ra **600**. Chỉ thêm một chữ số 0 thì ra 60, đó là 6 × 10. Cùng làm: 7 × 1 000 = ?','Careful! 6 × 100 needs **two** zeros: **600**. With only one zero you get 60, which is 6 × 10. Try it: 7 × 1,000 = ?'),
 ask:{opts:[LT('700','700'),LT('7 000','7,000'),LT('70 000','70,000')],ans:LT('7 000','7,000'),good:LT('Đúng! 1 000 có ba chữ số 0.','Right! 1,000 has three zeros.')}}
]},
avg:{memo:LT('Cộng hết lại, rồi chia đều!','Add it all up, then share equally!'),pages:[
{svg:()=>S(205,TH.l(30,163,330,163,{w:3})+[[70,6,'An'],[180,2,'Bình'],[290,4,'Chi']].map(function(a){return TH.dots(a[1],a[0],150-(a[1]-1)*21,{perRow:1,r:9,gap:21,color:'orange'})+T(a[0],186,a[2]+': '+a[1],{s:17})}).join('')),
 say:LT('An có 6 quả cam, Bình có 2 quả, Chi có 4 quả. An có nhiều, Bình có ít. Nếu cả ba bạn chia đều thì mỗi bạn được mấy quả?','An has 6 oranges, Bình has 2, and Chi has 4. An has a lot, Bình has few. If all three share equally, how many does each get?')},
{svg:()=>S(205,TH.l(30,163,330,163,{w:3})+TH.l(30,75,330,75,{c:'red',dash:'6 5',w:2.5})+T(340,70,'4',{s:18,c:'red',a:'end'})+TH.dots(4,70,150-63,{perRow:1,r:9,gap:21,color:'orange'})+TH.c(70,45,9,'rose')+TH.c(70,66,9,'rose')+TH.dots(2,180,129,{perRow:1,r:9,gap:21,color:'orange'})+TH.c(180,87,9,'rose',{op:.7})+TH.c(180,108,9,'rose',{op:.7})+TH.dots(4,290,87,{perRow:1,r:9,gap:21,color:'orange'}).replace(/^/,'')+TH.arr(92,52,158,90,{c:'red',w:3})+T(130,36,LT('chuyển 2','move 2'),{s:16,c:'red'})+T(70,186,'An: 4',{s:17})+T(180,186,LT('Bình: 4','Bình: 4'),{s:17})+T(290,186,'Chi: 4',{s:17})),
 say:LT('An chuyển 2 quả sang cho Bình. Giờ ai cũng có **4 quả**: bằng nhau rồi! Số 4 gọi là **số trung bình cộng** của 6, 2 và 4.','An moves 2 oranges to Bình. Now everyone has **4**: all equal! The number 4 is called the **average** (mean) of 6, 2 and 4.')},
{svg:()=>S(200,TH.tape(20,25,320,44,[{u:6,f:'sun',t:'6'},{u:2,f:'sky',t:'2'},{u:4,f:'mint',t:'4'}])+TH.brace(20,340,73,'6 + 2 + 4 = ?')+TH.arr(180,120,180,146,{w:3})+T(180,180,'? : 3 = ?',{s:24})),
 say:LT('Không cần chuyển từng quả! Ta gộp tất cả lại rồi chia đều cho 3 bạn. Trước hết, gộp ba bạn lại nhé.','No need to move every orange! We put them all together, then share equally among 3 friends. First, put the three friends together.'),
 ask:{q:LT('6 + 2 + 4 = ?','6 + 2 + 4 = ?'),opts:[LT('10','10'),LT('12','12'),LT('14','14')],ans:LT('12','12'),good:LT('Đúng! Tổng là 12 quả.','Right! The sum is 12 oranges.')}},
{svg:()=>S(180,TH.tape(20,25,320,44,[{u:1,f:'sky',t:'8'},{u:1,f:'sun',t:'5'},{u:1,f:'mint',t:'6'},{u:1,f:'rose',t:'9'}])+TH.brace(20,340,73,'8 + 5 + 6 + 9 = 28')+T(180,160,'28 : 4 = 7',{s:24})),
 say:LT('**Trung bình cộng = tổng : số các số hạng**. Ví dụ điểm 4 bài kiểm tra: 8; 5; 6; 9. Tổng là 28. Có mấy số thì ta chia 28 cho mấy?','**Average = sum ÷ how many numbers**. Example: scores on 4 tests: 8; 5; 6; 9. The sum is 28. We divide 28 by how many?'),
 ask:{opts:[LT('3','3'),LT('4','4'),LT('28','28')],ans:LT('4','4'),good:LT('Đúng! 4 bài thì chia cho 4, được 7.','Right! 4 tests, so divide by 4. The average is 7.')}},
{svg:()=>S(140,[0,1,2].map(function(i){return TH.r(20+i*115,15,90,44,'sun',{rx:10})+dd(4,35+i*115,37,'orange',{r:8,gap:20})}).join('')+TH.brace(20,340,62,'4 × 3 = 12')),
 say:LT('Đi ngược lại thì sao? Nếu **trung bình** mỗi bạn là 4 quả và có 3 bạn thì cả nhóm có **4 × 3 = 12** quả. Biết trung bình thì **nhân** để tìm tổng.','What about going backward? If the **average** is 4 oranges per friend and there are 3 friends, together they have **4 × 3 = 12**. If you know the average, **multiply** to find the sum.')},
{svg:()=>S(190,TH.tape(20,25,320,44,[{u:38,f:'sky',t:'38'},{u:44,f:'sun',t:'44'},{u:41,f:'mint',t:'41'},{u:37,f:'rose',t:'?',dash:'6 4'}])+TH.brace(20,340,73,'40 × 4 = 160')+T(180,172,'? = 160 − (38 + 44 + 41) = 37',{s:18})),
 say:LT('Trung bình cộng của 4 số là 40. Ba số đầu là 38; 44; 41. Tìm số thứ tư. Trước hết tìm **tổng** của cả 4 số: 40 × 4 = ?','The average of 4 numbers is 40. The first three are 38; 44; 41. Find the fourth. First find the **sum** of all 4 numbers: 40 × 4 = ?'),
 ask:{opts:[LT('160','160'),LT('44','44'),LT('100','100')],ans:LT('160','160'),good:LT('Đúng! Rồi trừ ba số đã biết: 160 − 123 = 37.','Right! Then subtract the three known numbers: 160 − 123 = 37.')}},
{svg:()=>S(240,pan(10,8,100,false,LT('Sai','Wrong'),['6 + 2 + 4 = 12',LT('chưa chia!','not divided!')])+pan(185,8,100,true,LT('Đúng','Right'),['12 : 3 = 4',LT('đã chia đều','shared equally')])+T(180,142,LT('4 nằm giữa 2 và 6','4 is between 2 and 6'),{s:17})+TH.nline(40,320,195,0,8,1,{marks:[{v:2,c:'blue',t:'2'},{v:4,c:'orange',t:'4'},{v:6,c:'blue',t:'6'}]})),
 say:LT('Lỗi hay gặp: **quên chia**. Mẹo kiểm tra: số trung bình luôn **nằm giữa** số bé nhất và số lớn nhất. Vậy trung bình cộng của 3; 9; 6 có thể là số nào?','Common mistake: **forgetting to divide**. A check: the average always lies **between** the smallest and the largest number. So what could the average of 3; 9; 6 be?'),
 ask:{opts:[LT('6','6'),LT('18','18'),LT('2','2')],ans:LT('6','6'),good:LT('Đúng! 18 : 3 = 6, nằm giữa 3 và 9.','Right! 18 ÷ 3 = 6, between 3 and 9.')}}
]},
unit:{memo:LT('Tìm MỘT phần trước, rồi mới tìm nhiều phần!','Find ONE part first, then many parts!'),pages:[
{svg:()=>S(150,[0,1,2,3].map(function(i){return TH.box(20+i*80,25,70,50,'?','sky',{s:24})}).join('')+TH.brace(20,330,78,LT('tất cả 24 cái bút','24 pens in all'))),
 say:LT('Bài toán: **4 hộp bút** như nhau có tất cả **24 cái** bút. Hỏi **7 hộp** như thế có bao nhiêu cái? Chưa làm ngay được! Ta cần biết **1 hộp** có mấy cái bút.','Problem: **4 identical boxes of pens** hold **24 pens** in all. How many pens in **7 such boxes**? We can\'t tell yet! First we need to know how many pens are in **1 box**.')},
{svg:()=>S(165,[0,1,2,3].map(function(i){return TH.r(20+i*80,20,70,60,i==0?'sun':'sky')+TH.dots(6,33+i*80,40,{perRow:3,r:6,gap:16,color:'orange'})}).join('')+T(180,118,LT('1 hộp: 24 : 4 = 6 cái','1 box: 24 ÷ 4 = 6 pens'),{s:20})),
 say:LT('Bước 1 – **rút về đơn vị**: tìm **một hộp**. Chia đều 24 cái bút cho 4 hộp: 24 : 4 = **6** cái. Mỗi hộp có 6 cái bút.','Step 1 – **find the unit value**: find **one box**. Share 24 pens equally among 4 boxes: 24 ÷ 4 = **6** pens. Each box has 6 pens.')},
{svg:()=>S(150,[0,1,2,3,4,5,6].map(function(i){return TH.box(14+i*47,20,41,44,'6','sun',{s:19,rx:6})}).join('')+TH.brace(14,330,68,'6 × 7 = ?')),
 say:LT('Bước 2: biết 1 hộp có 6 cái bút, thì 7 hộp có 6 × 7 = ? cái bút.','Step 2: if 1 box has 6 pens, then 7 boxes have 6 × 7 = ? pens.'),
 ask:{opts:[LT('36','36'),LT('42','42'),LT('48','48')],ans:LT('42','42'),good:LT('Đúng! 6 × 7 = 42.','Right! 6 × 7 = 42.')}},
{svg:()=>flow([LT('4 hộp: 24 cái','4 boxes: 24 pens'),LT('1 hộp: 6 cái','1 box: 6 pens'),LT('7 hộp: 42 cái','7 boxes: 42 pens')],[LT('chia 4','÷ 4'),LT('nhân 7','× 7')]),
 say:LT('Nhớ sơ đồ ba tầng: **4 hộp → 1 hộp → 7 hộp**. Xuống tầng giữa bằng phép **chia**, lên tầng cuối bằng phép **nhân**. Tầng giữa (một phần) là cầu nối.','Remember the three-level chart: **4 boxes → 1 box → 7 boxes**. Go down to the middle with **division**, then up to the last level with **multiplication**. The middle level (one part) is the bridge.')},
{svg:()=>flow([LT('4 bao: 108 kg','4 bags: 108 kg'),LT('1 bao: 27 kg','1 bag: 27 kg'),LT('? bao: 162 kg','? bags: 162 kg')],[LT('chia 4','÷ 4'),LT('?','?')]),
 say:LT('**Dạng 2**: 4 bao gạo như nhau chứa **108 kg**. Hỏi 162 kg gạo đóng được mấy bao như thế? Bước 1 vẫn là rút về đơn vị: 108 : 4 = **27** kg mỗi bao.','**Type 2**: 4 identical bags hold **108 kg** of rice. How many such bags can 162 kg fill? Step 1 is still the unit value: 108 ÷ 4 = **27** kg per bag.')},
{svg:()=>S(150,TH.tape(15,25,330,44,[1,1,1,1,1,1].map(function(){return {u:1,f:'mint',t:'27'}}))+TH.brace(15,345,73,LT('162 kg','162 kg'))+T(180,142,LT('Mấy phần 27 kg?','How many parts of 27 kg?'),{s:17})),
 say:LT('Bước 2 lần này là **phép chia**: mỗi bao 27 kg, có 162 kg thì chia thành các phần 27 kg. 162 : 27 = ?','This time Step 2 is **division**: each bag holds 27 kg, so split 162 kg into parts of 27 kg. 162 ÷ 27 = ?'),
 ask:{opts:[LT('5','5'),LT('6','6'),LT('7','7')],ans:LT('6','6'),good:LT('Đúng! 6 bao, vì 27 × 6 = 162.','Right! 6 bags, because 27 × 6 = 162.')}},
{svg:()=>S(205,pan(10,8,135,false,LT('Sai','Wrong'),['24 × 7 = 168',LT('bỏ qua 1 hộp','skipped 1 box')])+pan(185,8,135,true,LT('Đúng','Right'),['24 : 4 = 6','6 × 7 = 42'])+T(180,185,LT('7 hộp chưa gấp đôi 4 hộp','7 boxes is less than double 4 boxes'),{s:16})),
 say:LT('Đừng nhảy cóc! Nhiều bạn lấy luôn 24 × 7 = 168, sai vì bỏ qua bước tìm **một hộp**. 7 hộp chưa gấp đôi 4 hộp, nên số bút phải ít hơn 48, không thể là 168. Bước đầu tiên của bài này là gì?','Don\'t skip ahead! Many kids do 24 × 7 = 168, which is wrong because they skip finding **one box**. 7 boxes is less than double 4 boxes, so there must be fewer than 48 pens, not 168. What is the first step?'),
 ask:{opts:[LT('Tìm số bút của 1 hộp','Find the pens in 1 box'),LT('Nhân 24 với 7','Multiply 24 by 7')],ans:LT('Tìm số bút của 1 hộp','Find the pens in 1 box'),good:LT('Đúng! Luôn rút về một phần trước.','Right! Always find one part first.')}}
]}
});
})();


/* theory_t3.js */
window.LY_THUYET = window.LY_THUYET || {};
(function(){
var K=TH.C, GR='#1E9E5A', BR='#B5835A', OR='#E8590C', TE='#0B8F83';
function T(x,y,vi,en,o){return TH.t(x,y,LT(vi,en),o)}
function bar(x,y,w,h,fill,t,o){o=o||{};return TH.r(x,y,w,h,fill,{rx:4,dash:o.dash,op:o.op})+(t!=null?TH.t(x+w/2,y+h/2+6,t,{s:o.s||19,c:o.c}):'')}
function segl(x,y,w,h,fill,t,o){o=o||{};var ym=y+h/2,cut=!!o.dash,c=cut?'#8C96A8':(fill==='yellow'?OR:'#1E3A8A');return TH.l(x,ym,x+w,ym,{c:c,w:fill==='yellow'?3.4:2.8,dash:cut?'6 5':null})+TH.l(x,ym-8,x,ym+8,{c:c,w:2.6})+TH.l(x+w,ym-8,x+w,ym+8,{c:c,w:2.6})+(t!=null&&t!==''?TH.t(x+w/2,ym-10,t,{s:o.s||18,c:fill==='yellow'?OR:(o.c||'#1E3A8A')}):'')}
function rb(x,y1,y2,label,c){var m=(y1+y2)/2;c=c||K.red;return TH.path('M'+x+' '+y1+' Q'+(x+12)+' '+y1+' '+(x+12)+' '+(y1+12)+' L'+(x+12)+' '+(m-9)+' Q'+(x+12)+' '+m+' '+(x+22)+' '+m+' Q'+(x+12)+' '+m+' '+(x+12)+' '+(m+9)+' L'+(x+12)+' '+(y2-12)+' Q'+(x+12)+' '+y2+' '+x+' '+y2,'none',{stroke:c})+TH.t(x+42,m+7,label,{s:20,c:c})}
function tree(x,gy,s,num){s=s||1;return '<g transform="translate('+x+' '+gy+') scale('+s+')">'+TH.r(-4,-22,8,22,BR,{rx:1,sw:2})+TH.c(0,-36,17,'green')+(num!=null?TH.t(0,-30,num,{s:16}):'')+'</g>'}
function ghost(x,gy,s,c){s=s||1;return '<g transform="translate('+x+' '+gy+') scale('+s+')"><circle cx="0" cy="-36" r="17" fill="none" stroke="'+(c||K.ink)+'" stroke-width="2.5" stroke-dasharray="4 4"/></g>'}
function ground(y,x1,x2){return TH.r(x1==null?16:x1,y,(x2==null?344:x2)-(x1==null?16:x1),12,'gray',{rx:4,sw:2})}
function chick(x,y,s){s=s||1;return '<g transform="translate('+x+' '+y+') scale('+s+')">'+TH.l(-5,13,-5,27,{w:2.5})+TH.l(5,13,5,27,{w:2.5})+TH.c(0,0,15,'yellow',{sw:2.5})+TH.poly('13,-3 23,2 13,6','orange',{sw:2})+TH.c(5,-5,2.5,'ink',{sw:0})+'</g>'}
function rabbit(x,y,s){s=s||1;return '<g transform="translate('+x+' '+y+') scale('+s+')">'+TH.r(-10,-35,8,24,'rose',{rx:4,sw:2})+TH.r(3,-35,8,24,'rose',{rx:4,sw:2})+TH.l(-11,13,-11,25,{w:2.5})+TH.l(-4,14,-4,25,{w:2.5})+TH.l(4,14,4,25,{w:2.5})+TH.l(11,13,11,25,{w:2.5})+TH.c(0,0,15,'rose',{sw:2.5})+TH.c(-5,-3,2.5,'ink',{sw:0})+TH.c(5,-3,2.5,'ink',{sw:0})+'</g>'}
function sectors(cx,cy,r,n,fills){var s='';if(n===1){s+=TH.c(cx,cy,r,fills[0]||'white',{sw:2.5});return s}for(var i=0;i<n;i++){var a0=-Math.PI/2+i*2*Math.PI/n,a1=-Math.PI/2+(i+1)*2*Math.PI/n;var d='M'+cx+' '+cy+' L'+(cx+r*Math.cos(a0)).toFixed(2)+' '+(cy+r*Math.sin(a0)).toFixed(2)+' A'+r+' '+r+' 0 0 1 '+(cx+r*Math.cos(a1)).toFixed(2)+' '+(cy+r*Math.sin(a1)).toFixed(2)+' Z';s+=TH.path(d,fills[i]||'white',{sw:2.5})}return s}
function fl(n,k,c,rest){var a=[];for(var i=0;i<n;i++)a.push(i<k?c:(rest||'white'));return a}
function bigfrac(x,y,n,d,s,cn,cd){s=s||40;var w=Math.max(String(n).length,String(d).length)*s*.62+14;return TH.t(x,y-8,n,{s:s,c:cn})+TH.l(x-w/2,y,x+w/2,y,{w:3})+TH.t(x,y+s-4,d,{s:s,c:cd})}

Object.assign(window.LY_THUYET,{

sumdiff:{memo:LT('Bớt hiệu – chia hai – ra số bé!','Subtract the difference, split in two, get the smaller number!'),pages:[
{svg:()=>TH.svg(195,TH.note(60,10,240,36,LT('20 nhãn dán cả hai bạn','20 stickers together'),{fill:'sun'})+TH.c(90,95,34,'sky')+TH.t(90,106,'?',{s:32})+TH.c(270,95,34,'rose')+TH.t(270,106,'?',{s:32})+T(90,152,'Nam','Nam',{s:18})+T(270,152,'Mai','Mai',{s:18})+T(180,184,'Mai có nhiều hơn Nam 6 cái','Mai has 6 more than Nam',{s:17,c:K.red})),
 say:LT('Nam và Mai có tất cả **20** cái nhãn dán. Mai có nhiều hơn Nam **6** cái. Mỗi bạn có mấy cái? Mình chưa biết, nên vẽ hình giúp con nhé!','Nam and Mai have **20** stickers in all. Mai has **6** more than Nam. How many does each one have? We do not know yet, so let us draw a picture!')},
{svg:()=>TH.svg(205,T(180,32,'Mỗi bạn là một đoạn thẳng','Each friend is a line segment',{s:17})+T(32,86,'Nam','Nam',{s:16})+T(32,146,'Mai','Mai',{s:16})+segl(62,60,112,40,'sky','?')+segl(62,120,112,40,'rose','?')+segl(174,120,96,40,'yellow','6')+T(222,113,'nhiều hơn 6','6 more',{s:15,c:K.red})+rb(282,60,160,'20')+T(180,192,'Đoạn Mai = đoạn Nam + 6','Mai\'s bar = Nam\'s bar + 6',{s:16})),
 say:LT('Vẽ mỗi bạn là một **đoạn thẳng**. Đoạn của Mai dài hơn đoạn của Nam đúng một khúc **6**. Cả hai đoạn cộng lại là **20**.','Draw each friend as a **bar**. Mai\'s bar is longer than Nam\'s bar by exactly a piece of **6**. Both bars together make **20**.')},
{svg:()=>TH.svg(205,T(180,32,'Bớt khúc 6 đi!','Take away the 6!',{s:18,c:K.red})+T(32,86,'Nam','Nam',{s:16})+T(32,146,'Mai','Mai',{s:16})+segl(62,60,112,40,'sky','?')+segl(62,120,112,40,'rose','?')+segl(174,120,96,40,'white','',{dash:'6 5',op:.6})+TH.l(190,128,254,152,{c:'red',w:4})+TH.l(254,128,190,152,{c:'red',w:4})+rb(282,60,160,'?')+T(180,192,'Bây giờ hai đoạn bằng nhau','Now the two segments are equal',{s:16})),
 say:LT('Mi bảo: "Bớt khúc 6 của Mai đi!" Bây giờ hai đoạn **bằng nhau**. Sau khi bớt, tổng của hai đoạn còn bao nhiêu?','Mi the owl says: "Take away Mai\'s extra 6!" Now the two bars are **equal**. After we take it away, how much do the two bars make together?'),
 ask:{opts:['14','26','20'],ans:'14',good:LT('Đúng! 20 − 6 = 14.','Right! 20 − 6 = 14.')}},
{svg:()=>TH.svg(225,T(180,34,'2 đoạn bằng nhau','2 equal segments',{s:18})+T(32,86,'Nam','Nam',{s:16})+T(32,146,'Mai','Mai',{s:16})+segl(62,60,112,40,'sky','7')+segl(62,120,112,40,'rose','7')+rb(186,60,160,'14')+T(180,190,'20 − 6 = 14','20 − 6 = 14',{s:20})+T(180,216,'14 : 2 = 7','14 ÷ 2 = 7',{s:20,c:OR})),
 say:LT('Tổng còn **14** nằm trong **2 đoạn bằng nhau**. Một đoạn là 14 : 2 = **7**. Đó chính là số nhãn dán của Nam!','The remaining **14** is shared by **2 equal bars**. One bar is 14 ÷ 2 = **7**. That is exactly Nam\'s number of stickers!')},
{svg:()=>TH.svg(215,T(32,56,'Nam','Nam',{s:16})+T(32,116,'Mai','Mai',{s:16})+segl(62,30,112,40,'sky','7')+segl(62,90,112,40,'rose','7')+segl(174,90,96,40,'yellow','6')+rb(282,30,130,'20')+T(180,170,'Mai: 7 + 6 = ?','Mai: 7 + 6 = ?',{s:22})+T(180,200,'Thử lại: cộng hai số xem có 20 không','Check: do the two numbers make 20?',{s:16})),
 say:LT('Nam có 7 cái. Mai có nhiều hơn Nam 6 cái. Vậy Mai có bao nhiêu cái? Rồi thử lại: cộng hai số xem có đủ 20 không.','Nam has 7. Mai has 6 more than Nam. So how many does Mai have? Then check: do the two numbers add up to 20?'),
 ask:{opts:['13','14','1'],ans:'13',good:LT('Đúng! Mai: 7 + 6 = 13. Thử lại: 13 + 7 = 20.','Right! Mai: 7 + 6 = 13. Check: 13 + 7 = 20.')}},
{svg:()=>TH.svg(235,T(180,22,'Sai: chia 20 cho 2 ngay','Wrong: split 20 by 2 right away',{s:16,c:K.red})+segl(62,36,100,26,'sky','10',{s:17})+segl(62,70,100,26,'rose','10',{s:17})+T(262,62,'Nhưng Mai hơn','But Mai has',{s:15,c:K.red})+T(262,82,'Nam 6 cái cơ mà!','6 more!',{s:15,c:K.red})+T(180,134,'Đúng: bớt 6 rồi mới chia 2','Right: take away 6, then split',{s:16,c:GR})+segl(62,150,100,26,'sky','7',{s:17})+segl(62,184,100,26,'rose','7',{s:17})+segl(162,184,86,26,'yellow','6',{s:17})),
 say:LT('Cẩn thận! Đừng lấy 20 : 2 = 10 ngay. Hai bạn **không bằng nhau**, Mai hơn 6. Phải **bớt 6 trước**, rồi mới chia 2. Thử nhé: tổng 10, hiệu 2, số bé là mấy?','Careful! Do not just do 20 ÷ 2 = 10. The friends are **not equal**: Mai has 6 more. **Take away the 6 first**, then split in two. Try: sum 10, difference 2. What is the smaller number?'),
 ask:{opts:['4','5','6'],ans:'4',good:LT('Đúng! (10 − 2) : 2 = 4. Số lớn là 4 + 2 = 6.','Right! (10 − 2) ÷ 2 = 4. The larger number is 4 + 2 = 6.')}},
{svg:()=>TH.svg(205,TH.box(20,18,320,52,LT('Số bé = (Tổng − Hiệu) : 2','Smaller = (Sum − Difference) ÷ 2'),'sky',{s:18})+TH.arr(180,74,180,106,{w:3})+TH.box(20,110,320,52,LT('Số lớn = Số bé + Hiệu','Larger = Smaller + Difference'),'rose',{s:18})+T(180,190,'Ví dụ: (20 − 6) : 2 = 7; 7 + 6 = 13','Example: (20 − 6) ÷ 2 = 7; 7 + 6 = 13',{s:15})),
 say:LT('Nhớ nhé: **bớt hiệu, chia hai** là ra **số bé**. Muốn có số lớn thì lấy số bé cộng với hiệu.','Remember: **take away the difference, split in two** to get the **smaller number**. For the larger number, add the difference back.')}
]},

trees:{memo:LT('Hai đầu đều trồng: số cây = số khoảng + 1','Trees at both ends: trees = gaps + 1'),pages:[
{svg:()=>TH.svg(175,ground(116)+tree(40,116,1.1)+tree(320,116,1.1)+TH.arr(54,150,306,150,{w:2.5})+TH.arr(306,150,54,150,{w:2.5})+T(180,142,'20 m','20 m',{s:17})+TH.t(180,86,'?',{s:42,c:K.red})+T(180,26,'Hai đầu đường đều có cây','Trees at both ends of the path',{s:16})+T(180,170,'cứ 5 m trồng một cây','one tree every 5 m',{s:15})),
 say:LT('Trường muốn trồng cây dọc lối đi dài **20 m**. Hai đầu lối đi đều có cây, cứ **5 m** trồng một cây. Cần bao nhiêu cây? Con đoán thử xem!','The school wants to plant trees along a **20 m** path. There are trees at both ends, and one tree every **5 m**. How many trees are needed? Take a guess!')},
{svg:()=>TH.svg(225,ground(100)+tree(80,100,1,1)+tree(180,100,1,2)+tree(280,100,1,3)+TH.path('M80 124 Q130 160 180 124','none',{stroke:K.orange})+TH.path('M180 124 Q230 160 280 124','none',{stroke:K.orange})+T(130,168,'khoảng 1','gap 1',{s:15,c:OR})+T(230,168,'khoảng 2','gap 2',{s:15,c:OR})+T(180,208,'3 cây, nhưng chỉ 2 khoảng','3 trees, but only 2 gaps',{s:17})),
 say:LT('**Khoảng** là đoạn đường giữa hai cây liền nhau. Con nhìn nhé: 3 cây nhưng chỉ có 2 khoảng. Hai đầu đều có cây thì cây **nhiều hơn khoảng 1**.','A **gap** is the stretch of path between two neighboring trees. Look: 3 trees but only 2 gaps. When both ends have a tree, there is **1 more tree than gaps**.')},
{svg:()=>TH.svg(200,T(180,32,'Lối đi 20 m chia thành các khoảng 5 m','The 20 m path split into 5 m gaps',{s:16})+TH.tape(30,50,300,44,[{u:1,f:'sun',t:'5 m'},{u:1,f:'mint',t:'5 m'},{u:1,f:'sun',t:'5 m'},{u:1,f:'mint',t:'5 m'}],{s:16})+TH.brace(30,330,100,'20 m')+T(180,176,'20 : 5 = 4 (khoảng)','20 ÷ 5 = 4 (gaps)',{s:21,c:OR})),
 say:LT('Bước 1: đếm **khoảng**. Lối đi dài 20 m, mỗi khoảng 5 m, nên số khoảng là 20 : 5 = **4** (khoảng).','Step 1: count the **gaps**. The path is 20 m long and each gap is 5 m, so the number of gaps is 20 ÷ 5 = **4** (gaps).')},
{svg:()=>TH.svg(225,ground(110,16,344)+tree(40,110,1,1)+tree(110,110,1,2)+tree(180,110,1,3)+tree(250,110,1,4)+tree(320,110,1,5)+TH.path('M40 134 Q75 156 110 134','none',{stroke:K.orange})+TH.path('M110 134 Q145 156 180 134','none',{stroke:K.orange})+TH.path('M180 134 Q215 156 250 134','none',{stroke:K.orange})+TH.path('M250 134 Q285 156 320 134','none',{stroke:K.orange})+T(180,185,'4 khoảng + 1 = ? cây','4 gaps + 1 = ? trees',{s:21,c:OR})+T(180,212,'(cộng thêm cây ở đầu còn lại)','(add the tree at the other end)',{s:15})),
 say:LT('Bước 2: đếm **cây**. Có 4 khoảng, mà hai đầu đều có cây nên phải **cộng thêm 1**. Vậy cần mấy cây?','Step 2: count the **trees**. There are 4 gaps, and both ends have a tree, so we **add 1**. So how many trees do we need?'),
 ask:{q:LT('Có 4 khoảng, hai đầu đều có cây. Cần mấy cây?','There are 4 gaps and a tree at both ends. How many trees are needed?'),opts:['5','4','6'],ans:'5',good:LT('Đúng! 20 : 5 = 4 khoảng, 4 + 1 = 5 cây.','Right! 20 ÷ 5 = 4 gaps, 4 + 1 = 5 trees.')}},
{svg:()=>TH.svg(205,T(180,18,'Chỉ trồng 1 đầu: 4 cây','Only one end: 4 trees',{s:16,c:OR})+ground(80)+tree(40,80,.8)+tree(110,80,.8)+tree(180,80,.8)+tree(250,80,.8)+ghost(320,80,.8)+T(180,116,'Không trồng 2 đầu: 3 cây','No trees at either end: 3 trees',{s:16,c:OR})+ground(180)+ghost(40,180,.8)+tree(110,180,.8)+tree(180,180,.8)+tree(250,180,.8)+ghost(320,180,.8)),
 say:LT('Nếu **chỉ trồng một đầu**, bớt 1 cây: số cây = số khoảng = 4. Nếu **cả hai đầu không trồng**, bớt 2 cây: số cây = số khoảng − 1 = 3. Vòng tròn nét đứt là chỗ không có cây.','If you plant at **only one end**, take away 1 tree: trees = gaps = 4. If **neither end** has a tree, take away 2: trees = gaps − 1 = 3. The dashed circles are places with no tree.')},
{svg:()=>{var s=TH.c(180,100,48,'sky')+T(180,106,'hồ','pond',{s:18}),i,a,pts=[];for(i=0;i<6;i++){a=-Math.PI/2+i*Math.PI/3;pts.push([180+82*Math.cos(a),100+82*Math.sin(a)])}var ln='';for(i=0;i<6;i++){ln+=TH.l(pts[i][0],pts[i][1],pts[(i+1)%6][0],pts[(i+1)%6][1],{c:'orange',w:4})}var tr='';for(i=0;i<6;i++){tr+=TH.c(pts[i][0],pts[i][1],15,'green')+TH.t(pts[i][0],pts[i][1]+6,i+1,{s:16})}return TH.svg(235,ln+s+tr+T(180,224,'6 cây, 6 khoảng','6 trees, 6 gaps',{s:17,c:OR}))},
 say:LT('Trồng cây **quanh hồ** thì đường là một vòng kín: cây cuối nối lại với cây đầu, nên **số cây = số khoảng**. Quanh hồ có 8 khoảng thì có bao nhiêu cây?','When trees go **around a pond**, the path is a closed loop: the last tree joins up with the first one, so **trees = gaps**. If a pond has 8 gaps, how many trees are there?'),
 ask:{opts:['8','9','7'],ans:'8',good:LT('Đúng! Đường khép kín: số cây = số khoảng.','Right! Closed loop: trees = gaps.')}},
{svg:()=>TH.svg(215,T(180,20,'Sai: 20 : 5 = 4 cây','Wrong: 20 ÷ 5 = 4 trees',{s:16,c:K.red})+ground(84)+tree(40,84,.7)+tree(110,84,.7)+tree(180,84,.7)+tree(250,84,.7)+ghost(320,84,.7,K.red)+T(320,44,'?','?',{s:16,c:K.red})+T(180,128,'Đúng: 20 : 5 = 4, rồi 4 + 1 = 5 cây','Right: 20 ÷ 5 = 4, then 4 + 1 = 5 trees',{s:16,c:GR})+ground(190)+tree(40,190,.7)+tree(110,190,.7)+tree(180,190,.7)+tree(250,190,.7)+tree(320,190,.7)),
 say:LT('Cẩn thận! Nhiều bạn quên **cộng thêm 1** nên bỏ sót cây ở đầu cuối. Thử nhé: lối đi dài 30 m, hai đầu có cây, cứ 5 m một cây. Cần mấy cây?','Careful! Many kids forget to **add 1** and miss the tree at the last end. Try it: a path is 30 m long, trees at both ends, one tree every 5 m. How many trees?'),
 ask:{opts:['7','6','5'],ans:'7',good:LT('Đúng! 30 : 5 = 6 khoảng, 6 + 1 = 7 cây.','Right! 30 ÷ 5 = 6 gaps, 6 + 1 = 7 trees.')}}
]},

chick:{memo:LT('Giả sử cả đàn là gà, rồi đổi dần sang thỏ!','Pretend they are all chickens, then swap some for rabbits!'),pages:[
{svg:()=>{var s=T(180,28,'Trong chuồng có gà và thỏ','Chickens and rabbits in a pen',{s:17}),i;for(i=0;i<6;i++){s+=TH.c(45+54*i,72,21,'gray')+TH.t(45+54*i,80,'?',{s:22})}return TH.svg(185,s+TH.note(20,115,150,40,LT('6 con','6 animals'),{fill:'sky',s:19})+TH.note(190,115,150,40,LT('16 chân','16 legs'),{fill:'rose',s:19})+T(180,178,'Mỗi loại bao nhiêu con?','How many of each?',{s:16}))},
 say:LT('Trong chuồng có gà và thỏ, tất cả **6 con** và **16 chân**. Con không nhìn thấy từng con, chỉ đếm được đầu và chân. Mỗi loại có mấy con?','A pen has chickens and rabbits: **6 animals** and **16 legs** in all. We cannot see each animal, we only counted heads and legs. How many of each kind are there?')},
{svg:()=>TH.svg(190,chick(95,80,2)+rabbit(265,84,2)+T(95,165,'Gà: 2 chân','Chicken: 2 legs',{s:17})+T(265,165,'Thỏ: 4 chân','Rabbit: 4 legs',{s:17})),
 say:LT('Gà có **2 chân**, thỏ có **4 chân**. Thỏ nhiều hơn gà 2 chân. Nếu cả 6 con đều là gà thì có bao nhiêu chân?','A chicken has **2 legs** and a rabbit has **4 legs**. A rabbit has 2 more legs than a chicken. If all 6 animals were chickens, how many legs would there be?'),
 ask:{opts:['12','6','24'],ans:'12',good:LT('Đúng! 6 × 2 = 12 chân.','Right! 6 × 2 = 12 legs.')}},
{svg:()=>{var s=T(180,24,'Giả sử cả 6 con đều là gà','Suppose all 6 are chickens',{s:17}),i;for(i=0;i<6;i++)s+=chick(45+54*i,70,1);return TH.svg(185,s+T(180,125,'6 × 2 = 12 chân','6 × 2 = 12 legs',{s:23})+T(180,160,'Nhưng đề bài cho 16 chân!','But the problem says 16 legs!',{s:17,c:K.red}))},
 say:LT('Mi bảo: "Ta **giả sử tạm** cả 6 con là gà." Khi đó có 6 × 2 = **12** chân. Nhưng đề bài cho 16 chân, vậy là **thiếu** rồi!','Mi the owl says: "Let us **suppose** all 6 are chickens." Then there are 6 × 2 = **12** legs. But the problem says 16 legs, so we are **missing** some!')},
{svg:()=>{var s='',i;for(i=0;i<16;i++)s+=i<12?TH.c(40+20*i,66,8,'blue',{sw:2}):'<circle cx="'+(40+20*i)+'" cy="66" r="8" fill="none" stroke="#E5484D" stroke-width="2.5" stroke-dasharray="3 3"/>';return TH.svg(185,T(180,28,'Mỗi chấm là 1 chân','Each dot is 1 leg',{s:16})+s+TH.brace(30,270,84,'12',{})+TH.brace(274,350,84,LT('thiếu 4','missing 4'),{c:'#E5484D',tc:'#E5484D'})+T(180,172,'16 − 12 = 4 (chân)','16 − 12 = 4 (legs)',{s:22,c:OR}))},
 say:LT('Đề bài cho 16 chân, giả sử chỉ có 12 chân. Số chân còn **thiếu** là 16 − 12 = **4** (chân). Ta cần thêm chân bằng cách đổi gà thành thỏ.','The problem says 16 legs, and our guess gives 12. The number of **missing** legs is 16 − 12 = **4** (legs). We add legs by swapping chickens for rabbits.')},
{svg:()=>TH.svg(205,T(180,36,'đổi 1 con','swap 1',{s:17})+chick(80,90,1.6)+TH.arr(135,90,225,90,{w:3.5})+T(180,118,'+2 chân','+2 legs',{s:21,c:K.red})+rabbit(280,94,1.6)+T(80,162,'2 chân','2 legs',{s:17})+T(280,162,'4 chân','4 legs',{s:17})+T(180,196,'4 − 2 = 2: mỗi lần đổi thêm 2 chân','4 − 2 = 2: each swap adds 2 legs',{s:15})),
 say:LT('Đổi **1 gà thành 1 thỏ**: số con vẫn thế, nhưng chân tăng 4 − 2 = **2**. Ta thiếu 4 chân, mỗi lần đổi thêm 2 chân. Vậy phải đổi mấy lần, tức là có mấy con thỏ?','Swap **1 chicken for 1 rabbit**: the number of animals stays the same, but legs go up by 4 − 2 = **2**. We are missing 4 legs and each swap adds 2. How many swaps, that is, how many rabbits?'),
 ask:{opts:['2','4','1'],ans:'2',good:LT('Đúng! 4 : 2 = 2 (con thỏ).','Right! 4 ÷ 2 = 2 (rabbits).')}},
{svg:()=>{var s='',i;for(i=0;i<6;i++)s+=i<4?chick(45+54*i,60,1):rabbit(45+54*i,64,1);return TH.svg(205,s+TH.brace(22,230,100,LT('4 gà','4 chickens'),{})+TH.brace(236,338,100,LT('2 thỏ','2 rabbits'),{c:'#E5484D',tc:'#E5484D'})+T(180,192,'Thử lại: 4 × 2 + 2 × 4 = 16','Check: 4 × 2 + 2 × 4 = 16',{s:19}))},
 say:LT('Có **2 con thỏ**. Số gà là 6 − 2 = **4** (con). Thử lại: 4 × 2 + 2 × 4 = 8 + 8 = 16 chân. Đúng rồi!','There are **2 rabbits**. The number of chickens is 6 − 2 = **4**. Check: 4 × 2 + 2 × 4 = 8 + 8 = 16 legs. Correct!')},
{svg:()=>{var s='',i;for(i=0;i<6;i++)s+=i<2?chick(45+54*i,72,1):rabbit(45+54*i,76,1);return TH.svg(200,T(180,20,'Sai: thiếu 4 chân nên có 4 con thỏ?','Wrong: 4 legs missing, so 4 rabbits?',{s:15,c:K.red})+s+T(180,128,'2 × 2 + 4 × 4 = 20 chân: thừa rồi!','2 × 2 + 4 × 4 = 20 legs: too many!',{s:16,c:K.red})+T(180,160,'Đúng: mỗi thỏ chỉ thêm 2 chân,','Right: each rabbit adds only 2 legs,',{s:16,c:GR})+T(180,184,'nên 4 : 2 = 2 con thỏ','so 4 ÷ 2 = 2 rabbits',{s:16,c:GR}))},
 say:LT('Cẩn thận! Thiếu 4 chân **không phải** có 4 con thỏ. Mỗi lần đổi chỉ thêm 2 chân, nên phải **chia cho 2**. Số chân thiếu : 2 = số thỏ.','Careful! Missing 4 legs does **not** mean 4 rabbits. Each swap adds only 2 legs, so we must **divide by 2**. Missing legs ÷ 2 = number of rabbits.')}
]},

frac:{memo:LT('Mẫu số: chia mấy phần. Tử số: tô mấy phần.','Denominator: how many parts. Numerator: how many colored.'),pages:[
{svg:()=>TH.svg(190,sectors(100,95,72,4,['orange','yellow','yellow','yellow'])+T(268,62,'Chia 4 miếng','Cut in 4 equal',{s:17})+T(268,86,'bằng nhau','slices',{s:17})+T(278,134,'Con ăn 1 miếng','I eat 1 slice',{s:17,c:K.red})+TH.arr(208,128,178,102,{w:2.5,c:'red'})),
 say:LT('Một cái bánh pizza chia thành **4 miếng bằng nhau**. Con ăn **1 miếng**. Con đã ăn một phần của cái bánh, và ta có cách viết phần đó bằng một con số đặc biệt: **phân số**.','A pizza is cut into **4 equal slices**. You eat **1 slice**. You ate a part of the pizza, and there is a special way to write that part: a **fraction**.')},
{svg:()=>TH.svg(180,T(95,38,'Đúng','Right',{s:19,c:GR})+T(265,38,'Sai','Wrong',{s:19,c:K.red})+TH.fbar(20,55,150,50,4,0)+TH.r(190,55,150,50,'white',{rx:3,sw:3})+TH.l(215,55,215,105,{w:2.5})+TH.l(300,55,300,105,{w:2.5})+TH.l(318,55,318,105,{w:2.5})+T(95,135,'4 phần','4 equal',{s:16})+T(95,155,'bằng nhau','parts',{s:16})+T(265,135,'Các phần','Parts are',{s:16})+T(265,155,'không bằng nhau','not equal',{s:16})),
 say:LT('Muốn nói phân số, trước hết các phần phải **bằng nhau** như hai miếng pizza cùng cỡ. Hình bên phải chia các phần to nhỏ khác nhau nên **không** tính được.','To talk about fractions, the parts must be **equal**, like pizza slices of the same size. The picture on the right has parts of different sizes, so it does **not** work.')},
{svg:()=>{var s=sectors(105,100,70,4,['white','white','white','white']),i,a;for(i=0;i<4;i++){a=-Math.PI/2+(i+.5)*Math.PI/2;s+=TH.t(105+40*Math.cos(a),100+40*Math.sin(a)+6,i+1,{s:18})}return TH.svg(210,s+TH.t(270,92,'?',{s:40,c:'#9AA3B5'})+TH.l(240,102,300,102,{w:3})+TH.t(270,146,'4',{s:40,c:K.red})+T(270,182,'mẫu số','denominator',{s:18,c:K.red})+T(270,202,'= số phần chia','= number of parts',{s:15,c:K.red}))},
 say:LT('Đếm xem hình chia thành mấy phần bằng nhau: 4 phần. Số 4 viết **dưới** gạch ngang và gọi là **mẫu số**.','Count how many equal parts the shape is cut into: 4 parts. We write 4 **below** the line and call it the **denominator**.')},
{svg:()=>TH.svg(205,sectors(70,95,52,4,['pink','pink','pink','white'])+TH.t(155,82,'3',{s:40,c:OR})+TH.l(127,94,183,94,{w:3})+TH.t(155,134,'4',{s:40,c:K.red})+TH.arr(212,70,192,70,{w:2.5})+T(220,76,'tử số','numerator',{s:17,c:OR,a:'start'})+TH.arr(212,122,192,122,{w:2.5})+T(220,128,'mẫu số','denominator',{s:17,c:K.red,a:'start'})+T(180,182,'đọc là: ba phần tư','read: three fourths',{s:20})),
 say:LT('Tô màu **3 phần**: số 3 viết **trên** gạch ngang, gọi là **tử số**. Ta được phân số {3/4}, đọc là **ba phần tư**. Tử số là số phần được tô màu!','Color in **3 parts**: write 3 **above** the line and call it the **numerator**. We get the fraction {3/4}, read as **three fourths**. The numerator is the number of colored parts!')},
{svg:()=>TH.svg(190,sectors(110,95,72,5,fl(5,2,'teal'))+T(268,90,'Phân số nào?','Which fraction?',{s:20})+T(268,122,'?','?',{s:34,c:K.red})),
 say:LT('Đến lượt con! Hình chia thành 5 phần bằng nhau và tô màu 2 phần. Phân số chỉ phần tô màu là gì? Nhớ: tử số ở trên, mẫu số ở dưới.','Your turn! The shape is cut into 5 equal parts and 2 are colored. Which fraction shows the colored part? Remember: numerator on top, denominator below.'),
 ask:{opts:['2/5','5/2','3/5'],ans:'2/5',good:LT('Đúng! Tô 2 trong 5 phần: {2/5}.','Right! 2 of 5 parts colored: {2/5}.')}},
{svg:()=>TH.svg(215,TH.fbar(60,24,240,40,5,2,{fill:'pink'})+TH.frac(30,50,2,5,{s:20})+TH.t(180,106,'<',{s:34,c:K.red})+TH.fbar(60,118,240,40,5,4,{fill:'pink'})+TH.frac(30,144,4,5,{s:20})+T(180,190,'Cùng mẫu số, phần tô nhiều hơn','Same denominator: more colored',{s:16})+T(180,210,'thì phân số lớn hơn','parts means a bigger fraction',{s:16})),
 say:LT('So sánh hai phân số **cùng mẫu số**: mẫu số giống nhau nên các phần to bằng nhau. Tô nhiều phần hơn thì lớn hơn. Vì 2 < 4 nên {2/5} < {4/5}.','Compare two fractions with the **same denominator**: the parts are the same size. More colored parts means bigger. Since 2 < 4, {2/5} < {4/5}.')},
{svg:()=>TH.svg(225,TH.fbar(60,24,240,40,2,1,{fill:'orange'})+TH.frac(30,50,1,2,{s:20})+TH.t(180,106,'>',{s:34,c:K.red})+TH.fbar(60,118,240,40,8,1,{fill:'orange'})+TH.frac(30,144,1,8,{s:20})+T(180,190,'Chia thành càng nhiều phần','More parts means each part',{s:16})+T(180,210,'thì mỗi phần càng nhỏ','is smaller',{s:16})),
 say:LT('Cẩn thận! Mẫu số lớn **không** có nghĩa là phân số lớn. Ví dụ {1/2} lớn hơn {1/8}. Cùng tử số 1, chia thành càng nhiều phần thì mỗi phần càng nhỏ. Vậy {1/3} và {1/6}, phân số nào lớn hơn?','Careful! A bigger denominator does **not** mean a bigger fraction. For example, {1/2} is bigger than {1/8}. With the same numerator 1, the more parts you cut, the smaller each part is. So which is bigger, {1/3} or {1/6}?'),
 ask:{opts:['1/3','1/6'],ans:'1/3',good:LT('Đúng! {1/3} lớn hơn {1/6}, vì chia 3 phần thì mỗi phần to hơn.','Right! {1/3} is bigger than {1/6}, because cutting into 3 parts makes bigger parts.')}}
]},

fracdiv:{memo:LT('Số bị chia ở trên, số chia ở dưới: a : b = a/b','Dividend on top, divisor below: a ÷ b = a/b'),pages:[
{svg:()=>{var s=T(180,28,'6 cái kẹo chia đều cho 3 bạn','6 candies shared equally by 3 friends',{s:16}),i,k;for(k=0;k<3;k++){var x=65+115*k;s+=TH.r(x-40,46,80,56,'sky',{rx:10});for(i=0;i<2;i++)s+=TH.c(x-14+28*i,74,11,'orange')}return TH.svg(190,s+T(180,142,'6 : 3 = 2','6 ÷ 3 = 2',{s:26})+T(180,176,'Mỗi bạn được 2 cái kẹo','Each friend gets 2 candies',{s:17}))},
 say:LT('Chia 6 cái kẹo cho 3 bạn: 6 : 3 = **2**. Phép chia này chia hết nên ra một số tròn. Nhưng nếu **không chia hết** thì sao? Hãy xem tiếp nhé!','Share 6 candies among 3 friends: 6 ÷ 3 = **2**. This division works out evenly, so we get a whole number. But what if it **does not** divide evenly? Let us see!')},
{svg:()=>TH.svg(190,sectors(85,98,58,4,['orange','yellow','yellow','yellow'])+T(268,52,'1 cái bánh','1 cake',{s:17})+T(268,76,'chia đều 4 bạn','shared by 4 friends',{s:16})+T(240,150,'1 : 4 =','1 ÷ 4 =',{s:24,a:'end'})+TH.frac(285,144,1,4,{s:28})),
 say:LT('Chỉ có **1 cái bánh** mà chia đều cho **4 bạn**. Mỗi bạn được **1 phần trong 4 phần bằng nhau**, tức là {1/4} cái bánh. Vậy 1 : 4 = {1/4}.','There is only **1 cake** to share equally among **4 friends**. Each friend gets **1 of 4 equal parts**, that is {1/4} of the cake. So 1 ÷ 4 = {1/4}.')},
{svg:()=>TH.svg(205,sectors(95,90,56,3,fl(3,0,'yellow','yellow'))+sectors(265,90,56,3,fl(3,0,'yellow','yellow'))+T(180,98,'+','+',{s:26})+T(180,185,'Mỗi cái bánh cắt thành 3 phần bằng nhau','Cut each cake into 3 equal parts',{s:16})),
 say:LT('Bây giờ có **2 cái bánh** chia đều cho **3 bạn**. Con cắt **mỗi cái bánh thành 3 phần bằng nhau**, vì có 3 bạn. Mi bảo: chia bánh xong sẽ có tất cả 6 miếng nhỏ.','Now there are **2 cakes** to share equally among **3 friends**. Cut **each cake into 3 equal parts**, because there are 3 friends. Mi says: after cutting we have 6 small pieces in all.')},
{svg:()=>{var cols=['orange','teal','pink'],s='';var f=function(cx){return sectors(cx,85,52,3,cols)};s+=f(95)+f(265)+T(180,92,'+','+',{s:26});var i;for(i=0;i<3;i++){s+=TH.c(55+110*i,170,9,cols[i])+TH.t(72+110*i,176,['Mai','Nam','Lan'][i],{s:17,a:'start'})}return TH.svg(215,s+T(180,205,'Mỗi bạn lấy 1 miếng ở mỗi bánh','Each takes 1 piece from each cake',{s:16}))},
 say:LT('Mỗi bạn lấy **1 miếng ở mỗi cái bánh**, nên mỗi bạn được **2 miếng**. Mỗi miếng là 1 trong 3 phần của một cái bánh. Vậy mỗi bạn được 2 phần trong 3 phần: {2/3} cái bánh.','Each friend takes **1 piece from each cake**, so each gets **2 pieces**. Each piece is 1 of 3 parts of a cake. So each friend gets 2 of 3 parts: {2/3} of a cake.')},
{svg:()=>TH.svg(215,TH.t(62,96,'2',{s:44,c:OR})+TH.t(102,96,':',{s:44})+TH.t(142,96,'3',{s:44,c:TE})+TH.t(190,96,'=',{s:44})+TH.t(262,86,'2',{s:44,c:OR})+TH.l(234,98,290,98,{w:3.5})+TH.t(262,138,'3',{s:44,c:TE})+T(180,176,'số bị chia → tử số','dividend → numerator',{s:17,c:OR})+T(180,200,'số chia → mẫu số','divisor → denominator',{s:17,c:TE})),
 say:LT('Quy tắc: thương của phép chia số tự nhiên cho số tự nhiên (khác 0) viết được thành **phân số**. **Số bị chia** là **tử số**, **số chia** là **mẫu số**: 2 : 3 = {2/3}.','The rule: the answer to dividing a whole number by a whole number (not 0) can be written as a **fraction**. The **dividend** is the **numerator**, the **divisor** is the **denominator**: 2 ÷ 3 = {2/3}.')},
{svg:()=>{var s=T(180,26,'3 cái bánh chia cho 5 bạn','3 cakes shared by 5 friends',{s:16}),i;for(i=0;i<3;i++)s+=sectors(65+115*i,86,42,5,fl(5,0,'yellow','yellow'));return TH.svg(185,s+T(180,168,'3 : 5 = ?','3 ÷ 5 = ?',{s:28,c:K.red}))},
 say:LT('Thử nhé! Có 3 cái bánh chia đều cho 5 bạn. Số bị chia là 3, số chia là 5. Vậy 3 : 5 bằng phân số nào?','Try it! There are 3 cakes shared equally by 5 friends. The dividend is 3 and the divisor is 5. So which fraction is 3 ÷ 5?'),
 ask:{opts:['3/5','5/3'],ans:'3/5',good:LT('Đúng! 3 : 5 = {3/5}.','Right! 3 ÷ 5 = {3/5}.')}},
{svg:()=>TH.svg(200,sectors(70,88,50,3,fl(3,3,'pink'))+sectors(180,88,50,3,fl(3,2,'pink'))+TH.t(285,82,'5',{s:38,c:OR})+TH.l(262,94,308,94,{w:3.5})+TH.t(285,132,'3',{s:38,c:TE})+T(180,178,'Lớn hơn 1 cái bánh!','More than 1 whole cake!',{s:18,c:K.red})),
 say:LT('Cẩn thận! Nếu số bị chia **lớn hơn** số chia thì phân số **lớn hơn 1**. Ví dụ 5 : 3 = {5/3}: mỗi bạn được 1 cái bánh và thêm 2 phần. Vậy 7 : 4 = ?','Careful! If the dividend is **bigger** than the divisor, the fraction is **more than 1**. For example 5 ÷ 3 = {5/3}: each friend gets 1 whole cake and 2 more parts. So 7 ÷ 4 = ?'),
 ask:{opts:['7/4','4/7'],ans:'7/4',good:LT('Đúng! 7 : 4 = {7/4}.','Right! 7 ÷ 4 = {7/4}.')}}
]}

});
})();


/* theory_t4.js */
window.LY_THUYET = window.LY_THUYET || {};
(function () {
  var T = TH, C = TH.C;
  var S = function (h, inner) { return function () { return T.svg(h, inner()); }; };
  var N = function (s) { return LT(s, s); };
  var cap = function (y, vi, en, s, c) { return T.t(180, y, LT(vi, en), { s: s || 17, c: c }); };
  /* thanh n ô, fn(i) trả về màu ô (hoặc null = trắng) */
  function cells(x, y, w, h, n, fn) {
    var s = '', pw = w / n;
    for (var i = 0; i < n; i++) s += T.r(x + i * pw, y, pw, h, fn(i) || 'white', { rx: 0, sw: 2 });
    return s + T.r(x, y, w, h, 'none', { rx: 3, sw: 3 });
  }
  /* phân số (x,y) -> phân số, 2 mũi tên có nhãn op */
  function trans(y, n1, d1, n2, d2, op, s) {
    s = s || 36;
    var yt = y - 6 - s * 0.33, yb = y + s * 0.67;
    return T.frac(80, y, n1, d1, { s: s }) + T.frac(280, y, n2, d2, { s: s }) +
      T.arr(125, yt, 235, yt, { c: 'orange' }) + T.arr(125, yb, 235, yb, { c: 'orange' }) +
      T.t(180, yt - 8, op, { s: 20, c: 'orange' }) + T.t(180, yb + 26, op, { s: 20, c: 'orange' }) +
      T.t(180, y + 11, '=', { s: 28 });
  }
  /* khung SAI / ĐÚNG hai cột */
  function sd() {
    return T.l(180, 8, 180, 140, { c: 'gray', w: 3, dash: '6 6' }) +
      T.t(90, 28, LT('SAI', 'WRONG'), { s: 20, c: 'red' }) + T.t(270, 28, LT('ĐÚNG', 'RIGHT'), { s: 20, c: 'green' });
  }
  var op = function (x, y, ch, s) { return T.t(x, y, ch, { s: s || 24 }); };

  Object.assign(window.LY_THUYET, {

    /* ============ 1. TÍNH CHẤT CƠ BẢN ============ */
    fracprop: {
      memo: LT('Nhân hay chia, đều làm cả tử và mẫu với cùng một số.', 'Multiply or divide: do the same to the top and the bottom.'),
      pages: [
        { svg: S(190, function () {
            return T.pie(110, 80, 62, 3, 2, { fill: 'orange' }) + T.frac(250, 85, 2, 3, { s: 38 }) +
              cap(176, 'Bánh cắt 3 phần, ăn 2 phần', 'Pizza cut in 3, ate 2'); }),
          say: LT('Cú Mi có một cái bánh pizza cắt làm 3 phần bằng nhau. Mi ăn 2 phần, tức là ăn {2/3} cái bánh.',
                  'Mi the owl has a pizza cut into 3 equal slices. Mi eats 2 slices, so Mi eats {2/3} of the pizza.') },
        { svg: S(215, function () {
            return T.pie(80, 72, 54, 3, 2, { fill: 'orange' }) + T.pie(280, 72, 54, 6, 4, { fill: 'orange' }) +
              T.t(180, 85, '=', { s: 42 }) + T.frac(80, 158, 2, 3, { s: 24 }) + T.frac(280, 158, 4, 6, { s: 24 }) +
              cap(208, 'Cắt đôi mỗi phần: bánh vẫn y nguyên', 'Cut each slice in half: same pizza', 16); }),
          say: LT('Mi cắt đôi mỗi miếng bánh. Giờ có 6 miếng và Mi ăn 4 miếng. Lượng bánh Mi ăn **vẫn y nguyên**! Vậy {2/3} = {4/6}.',
                  'Mi cuts every slice in half. Now there are 6 slices and Mi eats 4. Mi still eats the **same amount**! So {2/3} = {4/6}.') },
        { svg: S(200, function () {
            return cells(70, 15, 260, 34, 3, function (i) { return i < 2 ? 'pink' : null; }) + T.frac(35, 32, 2, 3, { s: 18 }) +
              cells(70, 65, 260, 34, 6, function (i) { return i < 4 ? 'orange' : null; }) + T.frac(35, 82, 4, 6, { s: 18 }) +
              cells(70, 115, 260, 34, 12, function (i) { return i < 8 ? 'teal' : null; }) + T.frac(35, 132, 8, 12, { s: 18 }) +
              cap(185, 'Phần tô màu dài bằng nhau', 'The shaded part is the same length'); }),
          say: LT('Cắt nhỏ thêm nữa: {2/3} = {4/6} = {8/12}. Phần tô màu **dài bằng nhau**, nên các phân số này **bằng nhau**. Chúng chỉ viết khác nhau thôi.',
                  'Cut even smaller: {2/3} = {4/6} = {8/12}. The shaded part is **exactly as long**, so these fractions are **equal**. They are just written differently.') },
        { svg: S(205, function () {
            return trans(85, 2, 3, 8, 12, '× 4', 40) + cap(192, 'Nhân cả tử và mẫu với cùng một số', 'Multiply top and bottom by the same number', 16); }),
          say: LT('Cách nhanh: **nhân cả tử số và mẫu số với cùng một số** (khác 0) thì được phân số bằng nó.\nThử xem: {3/5} = ?/10',
                  'Quick way: **multiply the top and the bottom by the same number** (not 0) and the fraction stays equal.\nTry it: {3/5} = ?/10'),
          ask: { opts: [N('6'), N('3'), N('8')], ans: N('6'), good: LT('Đúng rồi! 5 × 2 = 10 nên 3 × 2 = 6.', 'Right! 5 × 2 = 10, so 3 × 2 = 6.') } },
        { svg: S(190, function () {
            return trans(75, 6, 9, 2, 3, '÷ 3', 40) + cap(180, 'Chia cả tử và mẫu cho cùng một số', 'Divide top and bottom by the same number', 16); }),
          say: LT('Cũng được **chia** cả tử số và mẫu số cho cùng một số, miễn là cả hai **chia hết**. {6/9}: chia cả hai cho 3 được {2/3}. Phân số mới gọn hơn mà vẫn bằng!',
                  'You can also **divide** the top and the bottom by the same number, as long as both divide **evenly**. {6/9}: divide both by 3 and you get {2/3}. Simpler, but still equal!') },
        { svg: S(200, function () {
            return sd() +
              cells(20, 50, 140, 24, 3, function (i) { return i < 2 ? 'orange' : null; }) +
              cells(20, 84, 140, 24, 4, function (i) { return i < 3 ? 'pink' : null; }) +
              cells(200, 50, 140, 24, 3, function (i) { return i < 2 ? 'green' : null; }) +
              cells(200, 84, 140, 24, 6, function (i) { return i < 4 ? 'green' : null; }) +
              T.t(90, 134, '2/3 → 3/4', { s: 18 }) + T.t(270, 134, '2/3 → 4/6', { s: 18 }) +
              T.t(90, 165, LT('Cộng thêm 1: khác nhau!', 'Adding 1: not equal!'), { s: 15, c: 'red' }) +
              T.t(270, 165, LT('Nhân 2: bằng nhau', 'Times 2: equal'), { s: 15, c: 'green' }) +
              T.t(90, 186, '(+1)', { s: 15, c: 'red' }) + T.t(270, 186, '(× 2)', { s: 15, c: 'green' }); }),
          say: LT('**Cẩn thận!** Chỉ được **nhân** hoặc **chia** cả tử và mẫu. Nếu **cộng** thêm 1 vào cả hai thì phân số bị đổi: {2/3} khác {3/4}.',
                  '**Careful!** Only **multiply** or **divide** the top and the bottom. If you **add** 1 to both, the fraction changes: {2/3} is not {3/4}.') },
        { svg: S(160, function () {
            return cells(70, 20, 260, 34, 5, function (i) { return i < 3 ? 'purple' : null; }) + T.frac(35, 37, 3, 5, { s: 18 }) +
              T.note(30, 80, 300, 44, LT('Nhân hay chia: CẢ tử VÀ mẫu', 'Multiply or divide: top AND bottom'), { s: 16 }) +
              T.t(180, 150, '?', { s: 20 }); }),
          say: LT('Ghi nhớ: nhân hay chia đều làm với **cả hai số** và **cùng một số**.\nHỏi nhanh: phân số nào bằng {3/5}?',
                  'Remember: multiply or divide **both numbers** by the **same number**.\nQuick question: which fraction equals {3/5}?'),
          ask: { opts: [N('6/10'), N('6/8'), N('4/6')], ans: N('6/10'), good: LT('Đúng! {3/5} nhân cả hai với 2 được {6/10}.', 'Yes! {3/5}: multiply both by 2 to get {6/10}.') } }
      ]
    },

    /* ============ 2. RÚT GỌN ============ */
    simplify: {
      memo: LT('Chia cả tử và mẫu cho cùng một số, đến khi hết chia được.', 'Divide the top and bottom by the same number until you cannot anymore.'),
      pages: [
        { svg: S(170, function () {
            return cells(70, 22, 260, 34, 8, function (i) { return i < 4 ? 'orange' : null; }) + T.frac(35, 39, 4, 8, { s: 18 }) +
              cells(70, 78, 260, 34, 2, function (i) { return i < 1 ? 'orange' : null; }) + T.frac(35, 95, 1, 2, { s: 18 }) +
              cap(155, '4/8 = 1/2: viết gọn hơn mà bằng nhau', '4/8 = 1/2: simpler but equal', 16); }),
          say: LT('Cú Mi ăn 4 miếng trong cái bánh cắt 8 miếng, tức {4/8}. Nói "một nửa" ({1/2}) gọn hơn mà **bằng nhau**. Làm gọn như vậy gọi là **rút gọn**.',
                  'Mi eats 4 slices of a cake cut into 8, that is {4/8}. Saying "one half" ({1/2}) is simpler and **equal**. Making it simpler is called **simplifying**.') },
        { svg: S(210, function () {
            return trans(65, 8, 12, 2, 3, '÷ 4', 36) +
              cells(30, 140, 140, 26, 12, function (i) { return i < 8 ? 'orange' : null; }) +
              cells(190, 140, 140, 26, 3, function (i) { return i < 2 ? 'orange' : null; }) +
              cap(196, 'Phần tô màu vẫn như nhau', 'Same shaded part', 16); }),
          say: LT('**Rút gọn** là **chia** cả tử số và mẫu số cho cùng một số (chia hết). Ví dụ {8/12}: chia cả hai cho 4 được {2/3}. Hai phân số **bằng nhau**.',
                  '**Simplifying** means **dividing** the top and the bottom by the same number (evenly). Example {8/12}: divide both by 4 and get {2/3}. They are **equal**.') },
        { svg: S(215, function () {
            return T.frac(180, 52, 12, 18, { s: 48 }) +
              T.arr(150, 112, 95, 132, { c: 'orange' }) + T.arr(210, 112, 265, 132, { c: 'orange' }) +
              T.note(20, 138, 150, 40, LT('12 : 2 = 6', '12 ÷ 2 = 6'), { fill: 'mint', s: 20 }) +
              T.note(190, 138, 150, 40, LT('18 : 2 = 9', '18 ÷ 2 = 9'), { fill: 'rose', s: 20 }) +
              cap(204, 'Cả hai đều là số chẵn', 'Both are even numbers'); }),
          say: LT('Rút gọn {12/18}. Cả 12 và 18 đều là số chẵn nên cùng **chia hết cho 2**. 12 : 2 = 6 và 18 : 2 = 9. Ta được {6/9}.',
                  'Simplify {12/18}. Both 12 and 18 are even, so both are **divisible by 2**. 12 ÷ 2 = 6 and 18 ÷ 2 = 9. We get {6/9}.') },
        { svg: S(205, function () {
            return trans(65, 6, 9, 2, 3, '÷ 3', 36) +
              T.note(30, 150, 300, 42, LT('Tối giản: không rút gọn được nữa', 'Simplest form: cannot go further'), { fill: 'mint', s: 16 }); }),
          say: LT('Tiếp {6/9}: cả hai chia hết cho 3, được {2/3}. 2 và 3 **không cùng chia hết** cho số nào (ngoài 1), nên {2/3} là **phân số tối giản**.\nHỏi nhanh: {10/25} rút gọn thành?',
                  'Next {6/9}: both divide by 3, giving {2/3}. 2 and 3 are **not both divisible** by any number (except 1), so {2/3} is in **simplest form**.\nQuick question: {10/25} simplifies to?'),
          ask: { q: LT('{10/25} rút gọn thành?', '{10/25} simplifies to?'), opts: [N('2/5'), N('5/10'), N('1/5')], ans: N('2/5'), good: LT('Đúng! Chia cả hai cho 5: {10/25} = {2/5}.', 'Right! Divide both by 5: {10/25} = {2/5}.') } },
        { svg: S(185, function () {
            return T.t(180, 26, LT('Dấu hiệu chia hết', 'Divisibility tricks'), { s: 19 }) +
              T.note(20, 40, 320, 38, LT('Cho 2: số tận cùng chẵn', 'By 2: last digit is even'), { fill: 'sky', s: 16 }) +
              T.note(20, 86, 320, 38, LT('Cho 5: tận cùng là 0 hoặc 5', 'By 5: last digit is 0 or 5'), { fill: 'mint', s: 16 }) +
              T.note(20, 132, 320, 38, LT('Cho 3: tổng các chữ số chia hết cho 3', 'By 3: digit sum is a multiple of 3'), { fill: 'rose', s: 15 }); }),
          say: LT('Mẹo tìm số để chia: dùng **dấu hiệu chia hết**. Muốn nhanh hơn, chia luôn cho số lớn nhất: {12/18} chia cả hai cho 6 được ngay {2/3}.',
                  'Tip for finding the divisor: use the **divisibility tricks**. To go faster, divide by the biggest number: {12/18} divided by 6 on both gives {2/3} right away.') },
        { svg: S(205, function () {
            return sd() +
              T.frac(40, 85, 12, 18, { s: 24 }) + T.arr(75, 78, 108, 78, { c: 'orange' }) + T.t(92, 68, '÷ 3', { s: 15, c: 'orange' }) + T.frac(140, 85, 4, 18, { s: 24, c: 'red' }) +
              T.frac(220, 85, 12, 18, { s: 24 }) + T.arr(255, 78, 288, 78, { c: 'orange' }) + T.t(272, 68, '÷ 6', { s: 15, c: 'orange' }) + T.frac(320, 85, 2, 3, { s: 24, c: 'green' }) +
              T.t(90, 135, LT('Chỉ chia tử, quên mẫu', 'Only the top!'), { s: 15, c: 'red' }) +
              T.t(270, 135, LT('Chia cả tử và mẫu', 'Top and bottom'), { s: 15, c: 'green' }) +
              T.note(20, 155, 320, 40, LT('Nhớ rút gọn đến khi tối giản!', 'Keep going until it is simplest!'), { s: 16 }); }),
          say: LT('**Cẩn thận!** Phải chia **cả tử lẫn mẫu**, và rút gọn đến khi tối giản.\nHỏi nhanh: phân số nào đã **tối giản**?',
                  '**Careful!** Divide **both** the top and the bottom, and keep going until it is simplest.\nQuick question: which fraction is already in **simplest form**?'),
          ask: { opts: [N('4/6'), N('3/8'), N('5/10')], ans: N('3/8'), good: LT('Đúng! 3 và 8 không có số chung nào ngoài 1.', 'Right! 3 and 8 share nothing except 1.') } }
      ]
    },

    /* ============ 3. QUY ĐỒNG, SO SÁNH ============ */
    fraccmp: {
      memo: LT('Quy đồng cho cùng mẫu số, rồi tử số nào lớn hơn thì phân số đó lớn hơn.', 'Make the bottoms the same, then the bigger top is the bigger fraction.'),
      pages: [
        { svg: S(165, function () {
            return cells(70, 18, 260, 34, 3, function (i) { return i < 2 ? 'pink' : null; }) + T.frac(35, 35, 2, 3, { s: 18 }) +
              cells(70, 72, 260, 34, 4, function (i) { return i < 3 ? 'blue' : null; }) + T.frac(35, 89, 3, 4, { s: 18 }) +
              cap(145, 'Miếng to nhỏ khác nhau, khó so sánh', 'Different sized pieces: hard to compare', 16); }),
          say: LT('Hai cái bánh bằng nhau: Mi ăn {2/3} cái, bạn Bi ăn {3/4} cái. Ai ăn nhiều hơn? Miếng bánh của hai bạn **to nhỏ khác nhau** nên khó so sánh.',
                  'Two equal cakes: Mi eats {2/3} of one, Bi eats {3/4} of the other. Who ate more? The pieces are **different sizes**, so it is hard to tell.') },
        { svg: S(170, function () {
            return cells(60, 20, 200, 34, 12, function (i) { return i < 8 ? 'pink' : null; }) +
              T.l(60 + 200 / 3, 20, 60 + 200 / 3, 54, { w: 5 }) + T.l(60 + 400 / 3, 20, 60 + 400 / 3, 54, { w: 5 }) +
              T.frac(30, 37, 2, 3, { s: 18 }) + T.t(280, 44, '=', { s: 22 }) + T.frac(318, 37, 8, 12, { s: 18 }) +
              cells(60, 75, 200, 34, 12, function (i) { return i < 9 ? 'blue' : null; }) +
              T.l(60 + 50, 75, 60 + 50, 109, { w: 5 }) + T.l(60 + 100, 75, 60 + 100, 109, { w: 5 }) + T.l(60 + 150, 75, 60 + 150, 109, { w: 5 }) +
              T.frac(30, 92, 3, 4, { s: 18 }) + T.t(280, 99, '=', { s: 22 }) + T.frac(318, 92, 9, 12, { s: 18 }) +
              cap(150, 'Cắt thành 12 miếng nhỏ bằng nhau', 'Cut into 12 equal small pieces', 16); }),
          say: LT('Muốn so sánh dễ, ta cắt cho các miếng **bằng nhau**: cả hai cùng cắt thành 12 miếng. Khi đó {2/3} = {8/12} và {3/4} = {9/12}. Việc này gọi là **quy đồng mẫu số**.',
                  'To compare easily, cut so the pieces are **equal**: both into 12 pieces. Then {2/3} = {8/12} and {3/4} = {9/12}. This is called finding a **common denominator**.') },
        { svg: S(215, function () {
            return trans(60, 2, 3, 8, 12, '× 4', 28) + trans(165, 3, 4, 9, 12, '× 3', 28); }),
          say: LT('Cách làm: mẫu số chung là **12** (3 × 4). {2/3}: nhân cả tử và mẫu với 4 được {8/12}. {3/4}: nhân với 3 được {9/12}.',
                  'How to: the common denominator is **12** (3 × 4). {2/3}: multiply top and bottom by 4 to get {8/12}. {3/4}: multiply by 3 to get {9/12}.') },
        { svg: S(195, function () {
            return cells(70, 22, 260, 34, 12, function (i) { return i < 8 ? 'pink' : null; }) + T.frac(35, 39, 8, 12, { s: 18 }) +
              cells(70, 78, 260, 34, 12, function (i) { return i < 9 ? 'blue' : null; }) + T.frac(35, 95, 9, 12, { s: 18 }) +
              T.t(180, 148, '8 < 9', { s: 30, c: 'orange' }) +
              cap(180, 'Cùng 12 phần: 9 phần nhiều hơn 8 phần', 'Same 12 parts: 9 is more than 8', 16); }),
          say: LT('Cùng mẫu số thì **tử số lớn hơn → phân số lớn hơn**. 8 < 9 nên {2/3} < {3/4}. Vậy bạn Bi ăn nhiều hơn!',
                  'With the same denominator, the **bigger top means the bigger fraction**. 8 < 9, so {2/3} < {3/4}. Bi ate more!') },
        { svg: S(180, function () {
            return trans(60, 5, 6, 10, 12, '× 2', 30) +
              T.note(40, 135, 280, 38, LT('Chỉ cần đổi một phân số!', 'Only one fraction to change!'), { fill: 'mint', s: 17 }); }),
          say: LT('Nếu mẫu số này **chia hết** cho mẫu số kia, lấy luôn mẫu lớn làm mẫu chung: 12 chia hết cho 6 nên {5/6} = {10/12}.\nHỏi nhanh: {3/4} và {7/12}, số nào lớn hơn?',
                  'If one denominator **divides evenly** into the other, use the bigger one: 12 is a multiple of 6, so {5/6} = {10/12}.\nQuick question: {3/4} or {7/12}, which is bigger?'),
          ask: { q: LT('{3/4} và {7/12}, số nào lớn hơn?', '{3/4} or {7/12}, which is bigger?'), opts: [N('3/4'), N('7/12')], ans: N('3/4'), good: LT('Đúng! {3/4} = {9/12} > {7/12}.', 'Right! {3/4} = {9/12} > {7/12}.') } },
        { svg: S(200, function () {
            return T.pie(90, 70, 50, 3, 1, { fill: 'orange' }) + T.pie(270, 70, 50, 5, 1, { fill: 'orange' }) +
              T.t(180, 82, '>', { s: 40 }) + T.frac(90, 150, 1, 3, { s: 24 }) + T.frac(270, 150, 1, 5, { s: 24 }) +
              cap(192, 'Chia ít phần hơn thì mỗi phần to hơn', 'Fewer parts means bigger parts', 16); }),
          say: LT('**Cẩn thận!** Tử số bằng nhau thì **mẫu số nhỏ hơn → phân số lớn hơn**: bánh chia ít phần thì mỗi miếng to hơn. {1/3} > {1/5}.\nHỏi nhanh: {1/4} hay {1/8} lớn hơn?',
                  '**Careful!** Same top: the **smaller bottom is the bigger fraction**, because fewer slices are bigger. {1/3} > {1/5}.\nQuick question: {1/4} or {1/8}, which is bigger?'),
          ask: { opts: [N('1/4'), N('1/8')], ans: N('1/4'), good: LT('Đúng! Chia 4 phần thì mỗi phần to hơn chia 8 phần.', 'Right! 4 parts are bigger than 8 parts.') } }
      ]
    },

    /* ============ 4. CỘNG, TRỪ PHÂN SỐ ============ */
    fraddsub: {
      memo: LT('Cùng mẫu: cộng (trừ) tử, giữ mẫu. Khác mẫu: quy đồng trước!', 'Same bottom: add (subtract) tops, keep the bottom. Different bottoms: make them the same first!'),
      pages: [
        { svg: S(178, function () {
            return cells(30, 35, 300, 40, 8, function (i) { return i < 3 ? 'pink' : i < 5 ? 'blue' : null; }) +
              T.brace(30, 142.5, 80, '3/8') + T.brace(142.5, 217.5, 80, '2/8') +
              cap(163, 'Mi ăn 3 miếng, Bi ăn 2 miếng', 'Mi ate 3 pieces, Bi ate 2'); }),
          say: LT('Bánh cắt 8 miếng bằng nhau. Cú Mi ăn {3/8} cái, bạn Bi ăn {2/8} cái. Cả hai ăn bao nhiêu? Các miếng **cùng cỡ** nên ta đếm luôn số miếng.',
                  'The cake is cut into 8 equal pieces. Mi eats {3/8}, Bi eats {2/8}. How much did they eat together? The pieces are the **same size**, so we just count pieces.') },
        { svg: S(205, function () {
            return T.frac(50, 60, 3, 8, { s: 34, c: 'pink' }) + op(92, 66, '+', 30) + T.frac(134, 60, 2, 8, { s: 34, c: 'blue' }) +
              op(176, 66, '=', 30) + T.frac(218, 60, 5, 8, { s: 34, c: 'purple' }) +
              cells(30, 120, 300, 36, 8, function (i) { return i < 3 ? 'pink' : i < 5 ? 'blue' : null; }) +
              cap(190, 'Phần là "một phần tám": mẫu 8 giữ nguyên', 'The pieces are "eighths": the 8 stays', 16); }),
          say: LT('Cùng mẫu số: **cộng hai tử số, giữ nguyên mẫu số**. 3 miếng + 2 miếng = 5 miếng, nên {3/8} + {2/8} = {5/8}.\nHỏi nhanh: {2/7} + {3/7} = ?',
                  'Same denominator: **add the tops, keep the bottom**. 3 pieces + 2 pieces = 5 pieces, so {3/8} + {2/8} = {5/8}.\nQuick question: {2/7} + {3/7} = ?'),
          ask: { opts: [N('5/7'), N('5/14'), N('6/7')], ans: N('5/7'), good: LT('Đúng! 2 + 3 = 5, mẫu số 7 giữ nguyên.', 'Right! 2 + 3 = 5, and the 7 stays.') } },
        { svg: S(190, function () {
            var x1 = 30 + 3 * 37.5, x2 = 30 + 5 * 37.5, s = cells(30, 25, 300, 40, 8, function (i) { return i < 5 ? 'orange' : null; });
            s += T.l(x1 + 6, 31, x2 - 6, 59, { w: 3.5, c: 'red' }) + T.l(x1 + 6, 59, x2 - 6, 31, { w: 3.5, c: 'red' });
            return s + T.t(160, 90, LT('Cho bạn 2 miếng', 'Give away 2 pieces'), { s: 16, c: 'red' }) +
              T.frac(50, 135, 5, 8, { s: 30 }) + op(92, 141, '−', 30) + T.frac(134, 135, 2, 8, { s: 30, c: 'red' }) + op(176, 141, '=', 30) + T.frac(218, 135, 3, 8, { s: 30, c: 'green' }); }),
          say: LT('Trừ cũng vậy: **trừ hai tử số, giữ nguyên mẫu số**. Còn {5/8} cái bánh, cho bạn 2 miếng thì còn {5/8} − {2/8} = {3/8} cái.',
                  'Subtracting works the same way: **subtract the tops, keep the bottom**. {5/8} of a cake is left; give away 2 pieces and {5/8} − {2/8} = {3/8} is left.') },
        { svg: S(185, function () {
            return cells(70, 20, 260, 34, 2, function (i) { return i < 1 ? 'pink' : null; }) + T.frac(35, 37, 1, 2, { s: 18 }) +
              op(20, 78, '+', 22) +
              cells(70, 90, 260, 34, 4, function (i) { return i < 1 ? 'blue' : null; }) + T.frac(35, 107, 1, 4, { s: 18 }) +
              cap(160, 'Miếng to, miếng nhỏ: chưa cộng ngay được', 'Big piece, small piece: cannot add yet', 16); }),
          say: LT('Giờ cộng {1/2} cái bánh với {1/4} cái bánh. Hai miếng **to nhỏ khác nhau** (khác mẫu số) nên chưa đếm chung được. Ta phải đổi cho cùng cỡ miếng.',
                  'Now add {1/2} of a cake and {1/4} of a cake. The pieces are **different sizes** (different denominators), so we cannot count them together yet. First make them the same size.') },
        { svg: S(170, function () {
            return trans(55, 1, 2, 2, 4, '× 2', 30) +
              cells(30, 125, 300, 34, 4, function (i) { return i < 2 ? 'pink' : null; }); }),
          say: LT('Quy đồng: {1/2} nhân cả tử và mẫu với 2 được {2/4}. Giờ cả hai đều là miếng "một phần tư", cùng cỡ với {1/4}.',
                  'Common denominator: {1/2}, multiply top and bottom by 2, becomes {2/4}. Now both are "quarters", the same size as {1/4}.') },
        { svg: S(205, function () {
            return T.frac(50, 60, 2, 4, { s: 34, c: 'pink' }) + op(92, 66, '+', 30) + T.frac(134, 60, 1, 4, { s: 34, c: 'blue' }) +
              op(176, 66, '=', 30) + T.frac(218, 60, 3, 4, { s: 34, c: 'purple' }) +
              cells(30, 120, 300, 40, 4, function (i) { return i < 2 ? 'pink' : i < 3 ? 'blue' : null; }) +
              cap(192, '1/2 + 1/4 = 3/4', '1/2 + 1/4 = 3/4', 20); }),
          say: LT('Giờ cùng mẫu số: {2/4} + {1/4} = {3/4}. Vậy {1/2} + {1/4} = {3/4}. Nhớ nhé: **quy đồng trước, cộng sau**!',
                  'Same denominator now: {2/4} + {1/4} = {3/4}. So {1/2} + {1/4} = {3/4}. Remember: **common denominator first, add after**!') },
        { svg: S(205, function () {
            return sd() +
              T.frac(28, 85, 1, 2, { s: 22 }) + op(56, 88, '+', 20) + T.frac(86, 85, 1, 3, { s: 22 }) + op(116, 88, '=', 20) + T.frac(146, 85, 2, 5, { s: 22, c: 'red' }) +
              T.frac(208, 85, 3, 6, { s: 22 }) + op(238, 88, '+', 20) + T.frac(268, 85, 2, 6, { s: 22 }) + op(298, 88, '=', 20) + T.frac(328, 85, 5, 6, { s: 22, c: 'green' }) +
              T.t(90, 135, LT('Cộng cả mẫu: sai!', 'Adding bottoms: wrong!'), { s: 15, c: 'red' }) +
              T.t(270, 135, LT('Quy đồng rồi cộng', 'Same bottom first'), { s: 15, c: 'green' }) +
              T.note(15, 155, 330, 40, LT('2/5 nhỏ hơn 1/2: cộng thêm mà lại bé đi!', '2/5 is less than 1/2: it got smaller!'), { s: 15 }); }),
          say: LT('**Cẩn thận!** Không được cộng cả mẫu số! {1/2} + {1/3} không bằng {2/5}. Phải quy đồng: {3/6} + {2/6} = {5/6}. Kết quả rút gọn được thì nhớ rút gọn.',
                  '**Careful!** Never add the bottoms! {1/2} + {1/3} is not {2/5}. Use a common denominator: {3/6} + {2/6} = {5/6}. Simplify the answer if you can.') },
        { svg: S(165, function () {
            return cells(70, 20, 260, 34, 3, function (i) { return i < 1 ? 'pink' : null; }) + T.frac(35, 37, 1, 3, { s: 18 }) +
              op(20, 80, '+', 22) +
              cells(70, 90, 260, 34, 6, function (i) { return i < 1 ? 'blue' : null; }) + T.frac(35, 107, 1, 6, { s: 18 }) +
              T.t(180, 156, LT('Gợi ý: mẫu số chung là 6', 'Hint: common denominator is 6'), { s: 16 }); }),
          say: LT('Thử sức: {1/3} + {1/6} = ? Gợi ý: quy đồng về mẫu số 6, cộng xong nhớ rút gọn kết quả.',
                  'Your turn: {1/3} + {1/6} = ? Hint: use denominator 6, and simplify the answer at the end.'),
          ask: { opts: [N('1/2'), N('2/9'), N('1/9')], ans: N('1/2'), good: LT('Đúng! {2/6} + {1/6} = {3/6} = {1/2}.', 'Right! {2/6} + {1/6} = {3/6} = {1/2}.') } }
      ]
    },

    /* ============ 5. NHÂN, CHIA PHÂN SỐ ============ */
    fracmul: {
      memo: LT('Nhân: tử nhân tử, mẫu nhân mẫu. Chia: nhân với phân số thứ hai đảo ngược.', 'Multiply: top × top, bottom × bottom. Divide: multiply by the flipped second fraction.'),
      pages: [
        { svg: S(195, function () {
            return cells(30, 20, 300, 42, 3, function (i) { return i < 1 ? 'sky' : null; }) + T.t(80, 85, '1/3', { s: 18 }) +
              T.arr(180, 92, 180, 106, { c: 'orange' }) +
              cells(30, 112, 300, 42, 6, function (i) { return i === 0 ? 'orange' : i === 1 ? 'sky' : null; }) +
              T.l(130, 112, 130, 154, { w: 5 }) + T.l(230, 112, 230, 154, { w: 5 }) +
              cap(182, 'Một nửa của 1/3 là 1/6', 'Half of 1/3 is 1/6'); }),
          say: LT('Mi còn {1/3} cái bánh và ăn **một nửa** phần đó. Cắt đôi miếng {1/3}, cả bánh có 6 miếng, Mi ăn 1 miếng: {1/2} của {1/3} là {1/6}. Đó là phép **nhân**: {1/2} × {1/3} = {1/6}.',
                  'Mi has {1/3} of a cake left and eats **half** of it. Cut that piece in two: the whole cake has 6 pieces and Mi eats 1: half of {1/3} is {1/6}. That is **multiplying**: {1/2} × {1/3} = {1/6}.') },
        { svg: S(180, function () {
            return T.grid(20, 20, 3, 4, 44, { fillFn: function (i, j) { return j < 3 ? 'sky' : 'white'; } }) +
              T.frac(278, 70, 3, 4, { s: 34, c: 'blue' }) + T.t(278, 120, LT('Tô 3 cột', 'Shade 3'), { s: 16 }) + T.t(278, 140, LT('trong 4 cột', 'of 4 columns'), { s: 16 }); }),
          say: LT('Lấy một tấm bìa chia thành 4 cột, 3 hàng, tức là 12 ô. Tô màu {3/4} tấm bìa: tô 3 cột (màu xanh).',
                  'Take a board with 4 columns and 3 rows, so 12 cells. Shade {3/4} of it: shade 3 columns (blue).') },
        { svg: S(180, function () {
            return T.grid(20, 20, 3, 4, 44, { fillFn: function (i, j) { return (i < 2 && j < 3) ? 'orange' : j < 3 ? 'sky' : i < 2 ? 'rose' : 'white'; } }) +
              T.t(278, 55, LT('Ô cam:', 'Orange:'), { s: 17 }) + T.t(278, 82, LT('6 trên 12 ô', '6 of 12 cells'), { s: 16 }) + T.frac(278, 135, 6, 12, { s: 28, c: 'orange' }); }),
          say: LT('Giờ tô {2/3} chiều cao: 2 hàng trong 3 hàng (màu hồng). Phần **hai màu chồng nhau** (màu cam) có 6 ô trong 12 ô. Vậy {2/3} của {3/4} là {6/12}.',
                  'Now shade {2/3} of the height: 2 of 3 rows (pink). The part where **both colors overlap** (orange) is 6 of 12 cells. So {2/3} of {3/4} is {6/12}.') },
        { svg: S(195, function () {
            return T.t(180, 24, LT('Tử nhân tử, mẫu nhân mẫu', 'Top × top, bottom × bottom'), { s: 17, c: 'orange' }) +
              T.frac(50, 75, 2, 3, { s: 34 }) + op(95, 80, '×', 30) + T.frac(140, 75, 3, 4, { s: 34 }) + op(190, 80, '=', 30) + T.frac(265, 75, '2 × 3', '3 × 4', { s: 26 }) +
              op(60, 160, '=', 30) + T.frac(110, 155, 6, 12, { s: 30 }) + op(170, 160, '=', 30) + T.frac(220, 155, 1, 2, { s: 30, c: 'green' }); }),
          say: LT('Nhân phân số: **tử nhân tử, mẫu nhân mẫu**. Kết quả rút gọn được thì rút gọn: {6/12} = {1/2}.\nHỏi nhanh: {3/5} × {2/7} = ?',
                  'Multiplying fractions: **top × top, bottom × bottom**. Simplify if you can: {6/12} = {1/2}.\nQuick question: {3/5} × {2/7} = ?'),
          ask: { opts: [N('6/35'), N('5/12'), N('6/12')], ans: N('6/35'), good: LT('Đúng! 3 × 2 = 6 và 5 × 7 = 35.', 'Right! 3 × 2 = 6 and 5 × 7 = 35.') } },
        { svg: S(190, function () {
            return cells(30, 30, 300, 44, 4, function (i) { return i < 2 ? 'pink' : null; }) +
              T.t(67, 58, '1/4', { s: 17 }) + T.t(142, 58, '1/4', { s: 17 }) +
              T.brace(30, 180, 78, LT('1/2 có 2 miếng 1/4', '1/2 holds two 1/4 pieces'), { s: 17 }) +
              T.t(180, 180, LT('1/2 : 1/4 = 2', '1/2 ÷ 1/4 = 2'), { s: 24 }); }),
          say: LT('Chia nghĩa là hỏi: "có bao nhiêu phần?" Trong {1/2} cái bánh có mấy miếng {1/4}? Có **2 miếng**. Vậy {1/2} : {1/4} = 2.',
                  'Dividing asks: "how many fit?" How many {1/4} pieces are in {1/2} of a cake? **2 pieces**. So {1/2} ÷ {1/4} = 2.') },
        { svg: S(190, function () {
            return T.frac(60, 60, 3, 4, { s: 30 }) + op(110, 66, LT(':', '÷'), 28) + T.frac(160, 60, 2, 5, { s: 30 }) +
              T.arr(160, 95, 160, 112, { c: 'orange' }) + T.t(240, 108, LT('đảo ngược', 'flip it'), { s: 17, c: 'orange' }) +
              op(20, 150, '=', 28) + T.frac(60, 145, 3, 4, { s: 30 }) + op(110, 150, '×', 28) + T.frac(160, 145, 5, 2, { s: 30, c: 'orange' }) +
              op(210, 150, '=', 28) + T.frac(265, 145, 15, 8, { s: 30, c: 'green' }); }),
          say: LT('Chia phân số: giữ phân số thứ nhất, **nhân với phân số thứ hai đảo ngược** (đổi chỗ tử và mẫu). {3/4} : {2/5} = {3/4} × {5/2} = {15/8}.\nHỏi nhanh: đảo ngược của {3/7} là?',
                  'Dividing: keep the first fraction and **multiply by the second one flipped** (swap top and bottom). {3/4} ÷ {2/5} = {3/4} × {5/2} = {15/8}.\nQuick question: the flip of {3/7} is?'),
          ask: { q: LT('Đảo ngược của {3/7} là?', 'The flip of {3/7} is?'), opts: [N('7/3'), N('3/7'), N('7/7')], ans: N('7/3'), good: LT('Đúng! Đổi chỗ tử và mẫu: {3/7} thành {7/3}.', 'Right! Swap top and bottom: {3/7} becomes {7/3}.') } },
        { svg: S(150, function () {
            return sd() +
              T.frac(40, 85, 4, 3, { s: 24, c: 'red' }) + op(80, 88, '×', 22) + T.frac(120, 85, 2, 5, { s: 24 }) +
              T.frac(220, 85, 3, 4, { s: 24 }) + op(250, 88, '×', 22) + T.frac(285, 85, 5, 2, { s: 24, c: 'green' }) +
              T.t(90, 130, LT('Đảo nhầm số đầu', 'Flipped the first one'), { s: 15, c: 'red' }) +
              T.t(270, 130, LT('Chỉ đảo số thứ hai', 'Flip only the second'), { s: 15, c: 'green' }) ; }),
          say: LT('**Cẩn thận!** Chỉ đảo ngược **phân số thứ hai** (đứng sau dấu chia). Còn phép nhân thì **không đảo** gì cả. Làm xong nhớ rút gọn.',
                  '**Careful!** Only flip the **second fraction** (the one after the divide sign). When multiplying, **never flip** anything. Simplify at the end.') }
      ]
    },

    /* ============ 6. TÌM PHÂN SỐ CỦA MỘT SỐ ============ */
    fracof: {
      memo: LT('Mẫu chia, tử nhân.', 'Divide by the bottom, multiply by the top.'),
      pages: [
        { svg: S(190, function () {
            var s = '', xs = [45, 155, 265], k, d;
            for (k = 0; k < 3; k++) s += T.r(xs[k] - 17, 28, 57, 57, k === 0 ? 'sun' : 'white', { dash: '5 4', rx: 14 });
            for (k = 0; k < 3; k++) s += T.dots(4, xs[k], 45, { perRow: 2, color: k === 0 ? 'orange' : 'blue', r: 10, gap: 23 });
            return s + T.t(73, 112, '1/3', { s: 19, c: 'orange' }) +
              cap(142, '12 viên kẹo chia 3 phần bằng nhau', '12 candies in 3 equal groups') +
              cap(172, '1 phần = 12 : 3 = 4 viên', '1 group = 12 ÷ 3 = 4 candies'); }),
          say: LT('Cú Mi có 12 viên kẹo, chia đều thành 3 phần. Mi lấy **1 phần**, tức là {1/3} số kẹo. Mỗi phần có 12 : 3 = 4 viên. Vậy {1/3} của 12 là 4.',
                  'Mi has 12 candies, shared into 3 equal groups. Mi takes **1 group**, that is {1/3} of the candies. Each group has 12 ÷ 3 = 4. So {1/3} of 12 is 4.') },
        { svg: S(215, function () {
            var s = '', k;
            for (k = 0; k < 4; k++) s += T.r(12 + k * 86, 38, 78, 46, k < 3 ? 'sun' : 'white', { dash: '5 4', rx: 12 });
            for (k = 0; k < 4; k++) s += T.dots(3, 28 + k * 86, 61, { color: k < 3 ? 'orange' : 'blue' });
            return s + T.brace(12, 256, 92, LT('lấy 3 phần', 'take 3 groups'), { s: 17 }) +
              cap(172, '12 : 4 = 3 viên mỗi phần', '12 ÷ 4 = 3 candies per group') +
              cap(200, 'Lấy 3 phần: 3 × 3 = 9 viên', 'Take 3 groups: 3 × 3 = 9'); }),
          say: LT('Tìm {3/4} của 12: chia 12 viên thành **4 phần** bằng nhau (mẫu số 4), mỗi phần 3 viên. Rồi **lấy 3 phần** (tử số 3): 3 × 3 = 9 viên.',
                  'Find {3/4} of 12: split 12 candies into **4 equal groups** (bottom 4), 3 in each. Then **take 3 groups** (top 3): 3 × 3 = 9 candies.') },
        { svg: S(185, function () {
            return T.t(180, 26, LT('3/4 của 12', '3/4 of 12'), { s: 19 }) +
              T.box(20, 55, 70, 54, '12', 'sky', { s: 26 }) + T.box(145, 55, 70, 54, '3', 'mint', { s: 26 }) + T.box(270, 55, 70, 54, '9', 'orange', { s: 26 }) +
              T.arr(95, 82, 140, 82, { c: 'orange' }) + T.t(118, 70, LT(': 4', '÷ 4'), { s: 20, c: 'orange' }) +
              T.arr(220, 82, 265, 82, { c: 'orange' }) + T.t(243, 70, '× 3', { s: 20, c: 'orange' }) +
              T.note(40, 130, 280, 40, LT('Mẫu chia, tử nhân', 'Divide by bottom, times top'), { s: 18 }); }),
          say: LT('Gom lại thành quy tắc: muốn tìm {3/4} của 12, ta **chia 12 cho mẫu số 4**, rồi **nhân với tử số 3**. 12 : 4 × 3 = 9.',
                  'The rule: to find {3/4} of 12, **divide 12 by the bottom 4**, then **multiply by the top 3**. 12 ÷ 4 × 3 = 9.') },
        { svg: S(180, function () {
            return T.t(180, 24, LT('35 cái tem', '35 stamps'), { s: 17 }) +
              T.tape(15, 36, 330, 44, [1, 2, 3, 4, 5, 6, 7].map(function (i) { return { u: 1, f: i <= 3 ? 'orange' : 'sky', t: '5' }; })) +
              T.brace(15, 15 + 330 * 3 / 7, 84, '3 × 5 = 15') +
              cap(168, '35 : 7 = 5 tem mỗi phần', '35 ÷ 7 = 5 stamps per part'); }),
          say: LT('Thử với {3/7} của 35 cái tem: chia 7 phần, mỗi phần 35 : 7 = 5 tem; lấy 3 phần: 5 × 3 = 15 tem.\nHỏi nhanh: {2/5} của 20 là bao nhiêu?',
                  'Try {3/7} of 35 stamps: 7 parts, each 35 ÷ 7 = 5 stamps; take 3 parts: 5 × 3 = 15 stamps.\nQuick question: what is {2/5} of 20?'),
          ask: { opts: [N('8'), N('4'), N('50')], ans: N('8'), good: LT('Đúng! 20 : 5 = 4, rồi 4 × 2 = 8.', 'Right! 20 ÷ 5 = 4, then 4 × 2 = 8.') } },
        { svg: S(190, function () {
            return T.t(80, 28, LT('đã lấy', 'taken'), { s: 16, c: 'orange' }) + T.t(250, 28, LT('còn lại', 'left'), { s: 16 }) +
              T.tape(15, 38, 330, 44, [1, 2, 3, 4, 5, 6, 7].map(function (i) { return { u: 1, f: i <= 3 ? 'orange' : 'sky', t: '5' }; })) +
              T.brace(15 + 330 * 3 / 7, 345, 86, '4 × 5 = 20') +
              cap(176, '35 − 15 = 20', '35 − 15 = 20', 20); }),
          say: LT('Còn lại bao nhiêu tem? **Cách 1**: lấy cả trừ phần đã lấy: 35 − 15 = 20. **Cách 2**: phần còn lại là {4/7}, mà 35 : 7 × 4 = 20. Hai cách cho kết quả như nhau.',
                  'How many stamps are left? **Way 1**: whole minus the part taken: 35 − 15 = 20. **Way 2**: the rest is {4/7}, and 35 ÷ 7 × 4 = 20. Both ways agree.') },
        { svg: S(215, function () {
            return sd() +
              T.t(90, 62, LT('3/4 của 12', '3/4 of 12'), { s: 16 }) +
              T.t(90, 92, LT('12 : 3 × 4', '12 ÷ 3 × 4'), { s: 20 }) + T.t(90, 122, '= 16', { s: 22, c: 'red' }) +
              T.t(270, 62, LT('3/4 của 12', '3/4 of 12'), { s: 16 }) +
              T.t(270, 92, LT('12 : 4 × 3', '12 ÷ 4 × 3'), { s: 20 }) + T.t(270, 122, '= 9', { s: 22, c: 'green' }) +
              T.r(15, 148, 330, 58, 'sun', { rx: 12 }) +
              T.t(180, 172, LT('Phân số bé hơn 1: kết quả', 'A fraction under 1: the result'), { s: 15 }) +
              T.t(180, 194, LT('phải bé hơn số ban đầu!', 'must be smaller than the number!'), { s: 15 }); }),
          say: LT('**Cẩn thận!** Chia cho **mẫu số**, nhân với **tử số**, đừng đảo lại. Mẹo kiểm tra: phân số bé hơn 1 thì kết quả phải **bé hơn** số ban đầu.\nHỏi nhanh: {1/5} của 40 là?',
                  '**Careful!** Divide by the **bottom**, multiply by the **top**, not the other way round. Check: a fraction less than 1 gives an answer **smaller** than the number.\nQuick question: {1/5} of 40 is?'),
          ask: { opts: [N('8'), N('200'), N('5')], ans: N('8'), good: LT('Đúng! 40 : 5 = 8, rồi 8 × 1 = 8.', 'Right! 40 ÷ 5 = 8, then 8 × 1 = 8.') } }
      ]
    }
  });
})();


/* theory_t5.js */
(function(){
var D=Math.PI/180;
function P(cx,cy,deg,r){return [+(cx+r*Math.cos(deg*D)).toFixed(1),+(cy-r*Math.sin(deg*D)).toFixed(1)]}
function ray(cx,cy,a,len,c,w,dash){var p=P(cx,cy,a,len);return TH.l(cx,cy,p[0],p[1],{c:c||'ink',w:w||5,dash:dash})}
function wedge(cx,cy,r,a1,a2,fill){var p1=P(cx,cy,a1,r),p2=P(cx,cy,a2,r);return TH.path('M'+cx+' '+cy+' L'+p1.join(' ')+' A'+r+' '+r+' 0 '+((a2-a1)>180?1:0)+' 0 '+p2.join(' ')+' Z',fill,{sw:0})}
function arc(cx,cy,r,a1,a2,c){var p1=P(cx,cy,a1,r),p2=P(cx,cy,a2,r);return TH.path('M'+p1.join(' ')+' A'+r+' '+r+' 0 '+((a2-a1)>180?1:0)+' 0 '+p2.join(' '),'none',{sw:2.5,stroke:c})}
function tp(cx,cy,a,r,txt,o){var p=P(cx,cy,a,r);return TH.t(p[0],p[1]+6,txt,o)}
/* dấu góc vuông giữa hướng a và a+90 */
function rmark(cx,cy,a,s,fill){var u=P(0,0,a,s),v=P(0,0,a+90,s);var p1=[cx+u[0],cy+u[1]],p2=[cx+u[0]+v[0],cy+u[1]+v[1]],p3=[cx+v[0],cy+v[1]];return TH.poly([[cx,cy],p1,p2,p3].join(' '),fill||'sun',{sw:2})}
function dot(x,y,c){return TH.c(x,y,6,c||'red',{sw:2})}
var DIM='#7A8499',HI='#D9480F';
/* thước đo góc: nửa hình tròn tâm (cx,cy) bán kính R; hi='outer'|'inner' */
function protr(cx,cy,R,hi){
  var s=TH.path('M'+(cx-R)+' '+cy+' A'+R+' '+R+' 0 0 1 '+(cx+R)+' '+cy+' Z','sky',{sw:3});
  for(var t=0;t<=180;t+=10){var a=P(cx,cy,t,R),b=P(cx,cy,t,R-(t%30==0?15:8));s+=TH.l(a[0],a[1],b[0],b[1],{w:1.8})}
  for(var t=0;t<=180;t+=30){var tt=Math.min(170,Math.max(10,t));
    s+=tp(cx,cy,tt,R-28,t,{s:15,c:hi==='outer'?HI:DIM,b:hi==='outer'});
    s+=tp(cx,cy,tt,R-54,180-t,{s:15,c:hi==='inner'?HI:DIM,b:hi==='inner'})}
  return s+TH.l(cx-R-6,cy,cx+R+6,cy,{w:2.5})+dot(cx,cy,'red')}
function ladder(units,mul){ /* 4 khối từ lớn đến bé, mũi tên nhân ở trên, chia ở dưới */
  var s='',cols=['pink','orange','yellow','green'],bw=58,gap=34,x0=13,i;
  for(i=0;i<4;i++)s+=TH.box(x0+i*(bw+gap),65,bw,50,units[i],cols[i],{s:19});
  for(i=0;i<3;i++){var c1=x0+i*(bw+gap)+bw/2,c2=c1+bw+gap;
    s+=TH.arr(c1+8,52,c2-8,52,{c:'blue',w:3})+TH.t((c1+c2)/2,38,'×'+mul,{s:16,c:'blue'});
    s+=TH.arr(c2-8,132,c1+8,132,{c:'purple',w:3})+TH.t((c1+c2)/2,158,'÷'+mul,{s:16,c:'purple'})}
  return s}
function kgbag(x,y,w,h,txt,fill){return TH.poly((x+w*.3)+','+(y+2)+' '+(x+w/2)+','+(y-14)+' '+(x+w*.7)+','+(y+2),fill,{sw:2.5})+TH.r(x,y,w,h,fill,{rx:14})+(txt?TH.t(x+w/2,y+h/2+5,txt,{s:15}):'')}
function sidearr(x1,y1,x2,y2,n,c){ /* n mũi tên nhỏ chỉ hướng song song ở giữa cạnh */
  var mx=(x1+x2)/2,my=(y1+y2)/2,dx=x2-x1,dy=y2-y1,L=Math.sqrt(dx*dx+dy*dy);dx/=L;dy/=L;var s='';
  for(var i=0;i<n;i++){var o=(i-(n-1)/2)*20;s+=TH.arr(mx+dx*(o-11),my+dy*(o-11),mx+dx*(o+11),my+dy*(o+11),{c:c||'pink',w:4.5,h:11})}return s}
function tick(x1,y1,x2,y2,n){var mx=(x1+x2)/2,my=(y1+y2)/2,dx=x2-x1,dy=y2-y1,L=Math.sqrt(dx*dx+dy*dy);dx/=L;dy/=L;var s='';
  for(var i=0;i<n;i++){var o=(i-(n-1)/2)*7,px=mx+dx*o,py=my+dy*o;s+=TH.l(px-dy*9,py+dx*9,px+dy*9,py-dx*9,{w:3,c:'red'})}return s}
function n3(v,en){return en?String(v).replace(/\B(?=(\d{3})+(?!\d))/g,','):String(v).replace(/\B(?=(\d{3})+(?!\d))/g,' ')}
function N(v){return LT(n3(v,false),n3(v,true))}
function NU(v,u){return LT(n3(v,false)+' '+u,n3(v,true)+' '+u)}

window.LY_THUYET=window.LY_THUYET||{};
Object.assign(window.LY_THUYET,{
/* ================= GÓC ================= */
angle:{memo:LT('Nhọn bé hơn 90°, vuông đúng 90°, tù lớn hơn 90°, bẹt bằng 180°.','Acute is under 90°, right is exactly 90°, obtuse is over 90°, straight is 180°.'),pages:[
 {svg:()=>{var hx=70,hy=160,p=P(hx,hy,40,150),q=P(hx,hy,75,150);
   return TH.svg(205,TH.l(hx,hy,300,hy,{c:'blue',w:7})+TH.l(hx,hy,q[0],q[1],{c:'orange',w:4,dash:'7 7'})+wedge(hx,hy,60,0,40,'sun')+arc(hx,hy,60,0,40)+TH.l(hx,hy,p[0],p[1],{c:'orange',w:7})+dot(hx,hy,'red')
   +TH.t(190,192,LT('Khung cửa','Door frame'),{s:16,c:'blue'})+TH.t(p[0]+10,p[1]-6,LT('Cánh cửa','Door'),{s:16,c:HI,a:'start'})+TH.t(q[0]+14,q[1]+22,LT('Mở rộng hơn','Opened wider'),{s:15,c:DIM,a:'start'}))},
  say:LT('Con mở cửa ra một chút. **Cánh cửa** và **khung cửa** tạo thành một **góc**. Cửa mở càng rộng thì góc càng [[lớn]].','Open a door a little. The **door** and the **door frame** make an **angle**. The wider the door opens, the [[bigger]] the angle gets.')},
 {svg:()=>{var vx=70,vy=165,b=P(vx,vy,50,160);
   return TH.svg(215,wedge(vx,vy,70,0,50,'sun')+TH.l(vx,vy,300,vy,{c:'blue',w:6})+TH.l(vx,vy,b[0],b[1],{c:'orange',w:6})+arc(vx,vy,70,0,50)+dot(vx,vy,'red')
   +TH.t(vx,vy+30,LT('Đỉnh O','Vertex O'),{s:16,c:'red'})+TH.t(255,vy-12,LT('Cạnh','Side'),{s:16,c:'blue'})+TH.t(b[0]+12,b[1]+8,LT('Cạnh','Side'),{s:16,c:HI,a:'start'})
   +tp(vx,vy,25,100,'?°',{s:20}))},
  say:LT('Góc có **một đỉnh** (chỗ hai cạnh gặp nhau) và **hai cạnh**. Độ mở của góc được đo bằng **độ**, viết là **°**.','An angle has **one vertex** (where the two sides meet) and **two sides**. How wide it opens is measured in **degrees**, written **°**.')},
 {svg:()=>TH.svg(205,TH.r(40,25,130,140,'sky',{rx:6})+TH.l(60,55,150,55,{w:2,c:'blue'})+TH.l(60,80,150,80,{w:2,c:'blue'})+TH.l(60,105,150,105,{w:2,c:'blue'})+rmark(40,165,0,26,'sun').replace('points="40,165 66,165 66,139 40,139"','points="40,165 66,165 66,139 40,139"')
   +TH.t(105,192,LT('Góc quyển vở','Notebook corner'),{s:15})
   +wedge(240,165,70,0,90,'sun')+TH.l(240,165,330,165,{c:'blue',w:6})+TH.l(240,165,240,75,{c:'orange',w:6})+rmark(240,165,90,18,'yellow')+TH.t(285,192,LT('Góc vuông','Right angle'),{s:16})),
  say:LT('Góc ở **góc quyển vở** là góc [[vuông]]. Con gặp góc vuông ở bàn, bảng, cửa sổ…\nCon đoán xem góc vuông bằng bao nhiêu độ nhé!','The corner of a **notebook** is a [[right]] angle. You see right angles on desks, boards and windows.\nCan you guess how many degrees a right angle is?'),
  ask:{q:LT('Góc vuông bằng bao nhiêu độ?','How many degrees is a right angle?'),opts:[LT('90°','90°'),LT('45°','45°'),LT('180°','180°')],ans:LT('90°','90°'),good:LT('Đúng rồi! Góc vuông là 90°.','Right! A right angle is 90°.')}},
 {svg:()=>{var s='';[[40,30],[205,60]].forEach(function(a){var x=a[0],y=170,t=a[1];
     s+=TH.l(x,y,x,y-115,{c:DIM,w:3,dash:'6 6'})+wedge(x,y,50,0,t,'sky')+TH.l(x,y,x+120,y,{c:'blue',w:6})+ray(x,y,t,120,'orange',6)+arc(x,y,50,0,t)+dot(x,y,'red')+tp(x,y,t/2,76,t+'°',{s:20})});
   return TH.svg(205,s+TH.t(180,24,LT('Góc nhọn: bé hơn góc vuông','Acute: smaller than a right angle'),{s:16})+TH.t(95,198,LT('nét đứt = 90°','dashes = 90°'),{s:15,c:DIM}))},
  say:LT('Góc **mở hẹp hơn** góc vuông là góc [[nhọn]]. Góc nhọn **bé hơn 90°**, như 30° hay 60°. Nhọn như mũi bút chì!','An angle that is **narrower** than a right angle is an [[acute]] angle. It is **less than 90°**, like 30° or 60°. Sharp like a pencil tip!')},
 {svg:()=>{var cx=170,cy=170;
   return TH.svg(205,TH.l(cx,cy,cx,cy-125,{c:DIM,w:3,dash:'6 6'})+wedge(cx,cy,55,0,120,'rose')+TH.l(cx,cy,cx+130,cy,{c:'blue',w:6})+ray(cx,cy,120,125,'orange',6)+arc(cx,cy,55,0,120)+dot(cx,cy,'red')
   +tp(cx,cy,60,85,'120°',{s:20})+TH.t(300,60,LT('Góc tù','Obtuse'),{s:18,c:HI})+TH.t(300,84,LT('(lớn hơn 90°)','(more than 90°)'),{s:15,c:DIM}))},
  say:LT('Góc **mở rộng hơn** góc vuông là góc [[tù]]. Góc tù **lớn hơn 90°** nhưng **bé hơn 180°**, như 120°.','An angle that is **wider** than a right angle is an [[obtuse]] angle. It is **more than 90°** but **less than 180°**, like 120°.')},
 {svg:()=>{var cx=180,cy=95,s=wedge(cx,cy,48,0,180,'mint')+TH.l(cx-130,cy,cx+130,cy,{c:'blue',w:6})+arc(cx,cy,48,0,180)+dot(cx,cy)+TH.t(cx,cy-62,LT('Góc bẹt 180°','Straight angle 180°'),{s:17})
   var y=140,k=300/180;
   s+=TH.r(30,y,90*k,34,'sky',{rx:0})+TH.r(30+90*k,y,90*k,34,'rose',{rx:0})+TH.t(30+45*k,y+23,LT('nhọn','acute'),{s:16})+TH.t(30+135*k,y+23,LT('tù','obtuse'),{s:16});
   s+=TH.t(30,y+58,'0°',{s:15})+TH.t(30+90*k,y+58,LT('90° vuông','90° right'),{s:15})+TH.t(330,y+58,'180°',{s:15});
   return TH.svg(215,s)},
  say:LT('Mở hết cỡ, hai cạnh thành một đường thẳng: góc [[bẹt]], bằng **180°**. Từ nhỏ đến lớn: nhọn, vuông (90°), tù, bẹt.','Open it all the way and the two sides make a straight line: a [[straight]] angle, **180°**. From small to big: acute, right (90°), obtuse, straight.')},
 {svg:()=>{var s='',a=[[25,40,140,'A'],[215,70,75,'B']];a.forEach(function(g){var x=g[0],y=165,t=g[1],L=g[2];
     s+=wedge(x,y,40,0,t,'sun')+TH.l(x,y,x+Math.max(L,90)+20,y,{c:'blue',w:6})+ray(x,y,t,L,'orange',6)+arc(x,y,40,0,t)+dot(x,y,'red')+tp(x,y,t/2,64,t+'°',{s:18})+TH.t(x+60,y+30,LT('Góc '+g[3],'Angle '+g[3]),{s:17})});
   return TH.svg(205,s)},
  say:LT('Cẩn thận! Góc lớn hay bé là do **độ mở**, không phải do cạnh dài hay ngắn. Góc B cạnh ngắn nhưng mở rộng hơn.\nGóc nào lớn hơn?','Careful! An angle is big or small because of how **wide it opens**, not how long its sides are. Angle B has short sides but opens wider.\nWhich angle is bigger?'),
  ask:{opts:[LT('Góc A (40°)','Angle A (40°)'),LT('Góc B (70°)','Angle B (70°)')],ans:LT('Góc B (70°)','Angle B (70°)'),good:LT('Đúng! 70° lớn hơn 40°, dù cạnh B ngắn hơn.','Right! 70° is more than 40°, even though B has shorter sides.')}}
]},

/* ================= ĐO GÓC ================= */
protract:{memo:LT('Tâm trùng đỉnh, cạnh trùng vạch 0, đọc hàng số có số 0 ở cạnh đó.','Center on the vertex, one side on the 0 mark, read the row that starts with 0 on that side.'),pages:[
 {svg:()=>{var s=TH.r(15,70,140,40,'sun',{rx:4}),i;for(i=0;i<=14;i++)s+=TH.l(15+i*10,70,15+i*10,70+(i%5==0?18:10),{w:2});
   s+=TH.t(85,138,LT('Thước kẻ','Ruler'),{s:18})+TH.t(85,162,LT('đo độ dài','measures length'),{s:15,c:DIM});
   var cx=265,cy=120,R=65;s+=TH.path('M'+(cx-R)+' '+cy+' A'+R+' '+R+' 0 0 1 '+(cx+R)+' '+cy+' Z','sky',{sw:3});for(i=0;i<=180;i+=30){var a=P(cx,cy,i,R),b=P(cx,cy,i,R-12);s+=TH.l(a[0],a[1],b[0],b[1],{w:2})}
   s+=TH.l(cx-R-4,cy,cx+R+4,cy,{w:2.5})+dot(cx,cy)+TH.t(cx,cy+30,LT('Thước đo góc','Protractor'),{s:18})+TH.t(cx,cy+54,LT('đo độ mở','measures angles'),{s:15,c:DIM});
   return TH.svg(190,s)},
  say:LT('Thước kẻ đo **độ dài**. Muốn đo một **góc** mở rộng bao nhiêu, con dùng **thước đo góc** hình nửa hình tròn.','A ruler measures **length**. To find how wide an **angle** opens, we use a half-circle **protractor**.')},
 {svg:()=>{var cx=180,cy=205;return TH.svg(245,protr(cx,cy,150)+TH.t(cx,cy+30,LT('Tâm','Center'),{s:16,c:'red'})+TH.t(cx,cy-52,LT('Hai hàng số','Two rows'),{s:15})+TH.t(cx,cy-34,LT('0 đến 180','of 0 to 180'),{s:15}))},
  say:LT('Thước có một **tâm** (chấm đỏ) ở giữa cạnh thẳng và **vạch 0** ở hai đầu. Có **hai hàng số**: một hàng đếm từ bên phải, một hàng đếm từ bên trái.','The protractor has a **center** (red dot) in the middle of its straight edge and a **0 mark** at each end. It has **two rows of numbers**: one counts from the right, one from the left.')},
 {svg:()=>{var cx=170,cy=200,b=P(cx,cy,50,175);
   return TH.svg(245,protr(cx,cy,130)+TH.l(cx,cy,cx+170,cy,{c:'blue',w:6})+TH.l(cx,cy,b[0],b[1],{c:'orange',w:6})+dot(cx,cy)+TH.t(cx+172,cy+22,'A',{s:18,c:'blue'})+TH.t(b[0]+4,b[1]-8,'B',{s:18,c:HI})+TH.t(cx-18,cy+22,'O',{s:18,c:'red'})+TH.t(cx,cy+40,LT('Tâm trùng đỉnh O','Center on vertex O'),{s:16,c:'red'}))},
  say:LT('**Bước 1:** đặt **tâm thước** trùng **đỉnh O** của góc.\n**Bước 2:** xoay thước để cạnh OA nằm đúng trên **vạch 0**.','**Step 1:** put the **center** of the protractor on the **vertex O**.\n**Step 2:** turn it so side OA lies exactly on the **0 mark**.')},
 {svg:()=>{var cx=170,cy=200,R=130,b=P(cx,cy,50,140),c=P(cx,cy,50,R),d=P(cx,cy,50,R+30);
   return TH.svg(245,protr(cx,cy,R,'outer')+TH.l(cx,cy,cx+170,cy,{c:'blue',w:6})+TH.l(cx,cy,b[0],b[1],{c:'orange',w:6})+dot(cx,cy)+TH.c(c[0],c[1],6,'yellow')+TH.c(d[0],d[1],21,'yellow')+TH.t(d[0],d[1]+6,'50°',{s:17}))},
  say:LT('**Bước 3:** nhìn cạnh OB đi qua vạch nào trên thước. Ở đây OB đi qua một vạch trên hàng số bắt đầu từ 0 ở bên phải. Góc này đo được bao nhiêu độ?','**Step 3:** look at which mark side OB crosses. Here OB crosses a mark on the row that starts at 0 on the right. How many degrees is this angle?'),
  ask:{opts:[LT('50°','50°'),LT('130°','130°')],ans:LT('50°','50°'),good:LT('Đúng! Cạnh OA nằm bên phải nên đọc hàng số bắt đầu 0 ở bên phải.','Right! Side OA is on the right, so we read the row that starts at 0 on the right.')}},
 {svg:()=>{var cx=170,cy=200,R=130,b=P(cx,cy,140,140),c=P(cx,cy,140,R),d=P(cx,cy,140,R+30);
   return TH.svg(245,protr(cx,cy,R,'inner')+TH.l(cx-165,cy,cx,cy,{c:'blue',w:6})+TH.l(cx,cy,b[0],b[1],{c:'orange',w:6})+dot(cx,cy)+TH.c(c[0],c[1],6,'yellow')+TH.c(d[0],d[1],21,'yellow')+TH.t(d[0],d[1]+6,'40°',{s:17})+TH.t(cx+95,cy+28,LT('hàng này','this row'),{s:15,c:HI}))},
  say:LT('**Cẩn thận!** Bây giờ cạnh OA nằm bên **trái**, nên con đọc hàng số có **0 ở bên trái**. OB chỉ **40°**, không phải 140°.','**Careful!** Now side OA is on the **left**, so read the row with **0 on the left**. OB shows **40°**, not 140°.')},
 {svg:()=>{var vx=70,vy=170,b=P(vx,vy,50,150);
   return TH.svg(215,wedge(vx,vy,60,0,50,'sun')+TH.l(vx,vy,250,vy,{c:'blue',w:6})+TH.l(vx,vy,b[0],b[1],{c:'orange',w:6})+arc(vx,vy,60,0,50)+dot(vx,vy)
   +TH.t(vx-4,vy+26,'O',{s:19,c:'red'})+TH.t(262,vy+6,'A',{s:19,c:'blue',a:'start'})+TH.t(b[0]+4,b[1]-8,'B',{s:19,c:HI})+TH.t(270,70,LT('Góc AOB','Angle AOB'),{s:19})+TH.t(270,102,'góc AOB = 50°',{s:21}))},
  say:LT('Ta gọi tên góc bằng ba chữ cái, **chữ đỉnh O ở giữa**: góc **AOB**. Viết: góc AOB = 50°, nghĩa là góc AOB đo được 50 độ.','We name an angle with three letters, with the **vertex O in the middle**: angle **AOB**. We write angle AOB = 50°, which means it measures 50 degrees.')},
 {svg:()=>{var vx=55,vy=170,b=P(vx,vy,50,150),d=P(vx,vy,90,130);
   return TH.svg(215,wedge(vx,vy,60,0,50,'sky')+TH.l(vx,vy,vx,vy-130,{c:DIM,w:3,dash:'6 6'})+TH.l(vx,vy,vx+190,vy,{c:'blue',w:6})+TH.l(vx,vy,b[0],b[1],{c:'orange',w:6})+rmark(vx,vy,0,14,'yellow')+dot(vx,vy)
   +TH.note(235,35,115,38,LT('40° hợp lý','40° fits'),{fill:'mint',s:16})+TH.note(235,95,115,38,LT('140° quá lớn','140° too big'),{fill:'rose',s:16}))},
  say:LT('Mẹo kiểm tra: góc **nhọn** phải **bé hơn 90°** (bé hơn góc vuông nét đứt). Con đọc được 40 và 140 cho một góc nhọn thì số nào đúng?','Checking trick: an **acute** angle must be **less than 90°** (smaller than the dashed right angle). If an acute angle gives 40 and 140, which one is right?'),
  ask:{opts:[LT('40°','40°'),LT('140°','140°')],ans:LT('40°','40°'),good:LT('Đúng! Góc nhọn thì bé hơn 90°.','Right! An acute angle is less than 90°.')}}
]},

/* ================= VUÔNG GÓC, SONG SONG ================= */
lines:{memo:LT('Vuông góc: cắt nhau tạo 4 góc vuông. Song song: không bao giờ gặp nhau.','Perpendicular: cross and make 4 right angles. Parallel: never meet.'),pages:[
 {svg:()=>{var s=TH.r(10,85,160,34,'gray')+TH.r(76,20,34,150,'gray')+TH.r(77,86,32,32,'gray',{sw:0})+TH.l(10,102,76,102,{c:'white',w:3,dash:'8 6'})+TH.l(110,102,170,102,{c:'white',w:3,dash:'8 6'})+TH.l(93,20,93,85,{c:'white',w:3,dash:'8 6'})+TH.l(93,119,93,170,{c:'white',w:3,dash:'8 6'});
   s+=TH.t(90,198,LT('Ngã tư','Crossroads'),{s:17});
   s+=TH.l(190,70,350,70,{w:4,c:'blue'})+TH.l(190,130,350,130,{w:4,c:'blue'});for(var x=200;x<=340;x+=20)s+=TH.l(x,62,x,138,{w:6,c:'#B08968'});
   s+=TH.t(270,198,LT('Đường ray','Railway'),{s:17});return TH.svg(215,s)},
  say:LT('Ngã tư có hai con đường **cắt nhau**. Đường ray xe lửa thì hai thanh ray **chạy cạnh nhau mãi, không bao giờ gặp nhau**.','A crossroads has two roads that **cross**. Railway tracks have two rails that **run side by side and never meet**.')},
 {svg:()=>{var c=[180,105],s='',u=P(0,0,20,125),v=P(0,0,110,85);
   s+=TH.l(c[0]-u[0],c[1]-u[1],c[0]+u[0],c[1]+u[1],{c:'blue',w:5})+TH.l(c[0]-v[0],c[1]-v[1],c[0]+v[0],c[1]+v[1],{c:'orange',w:5});
   [20,110,200,290].forEach(function(a){s+=rmark(c[0],c[1],a,17,'sun')});
   s+=TH.t(c[0]+u[0]+8,c[1]+u[1]-8,'a',{s:20,c:'blue'})+TH.t(c[0]+v[0]+14,c[1]+v[1]+6,'b',{s:20,c:HI})+TH.t(180,205,'a vuông góc b',{s:22});return TH.svg(220,s)},
  say:LT('Hai đường thẳng **cắt nhau tạo thành 4 góc vuông** thì gọi là **vuông góc** với nhau. Ô vuông nhỏ là dấu góc vuông.\nCó mấy góc vuông?','Two lines that **cross and make 4 right angles** are **perpendicular**. The little squares mark right angles.\nHow many right angles are there?'),
  ask:{opts:[LT('2','2'),LT('4','4'),LT('3','3')],ans:LT('4','4'),good:LT('Đúng! Có 4 góc vuông.','Right! There are 4 right angles.')}},
 {svg:()=>{var c=[180,125],s='',u=P(0,0,20,130),v=P(0,0,110,90),t1=[c[0]+130*Math.cos(20*D),c[1]-130*Math.sin(20*D)],t2=P(c[0],c[1],110,90);
   s+=TH.l(c[0]-u[0],c[1]-u[1],c[0]+u[0],c[1]+u[1],{c:'blue',w:4})+TH.l(c[0]-v[0],c[1]-v[1],c[0]+v[0],c[1]+v[1],{c:'orange',w:4});
   s+=TH.poly([c.join(','),t1.join(','),t2.join(',')].join(' '),'mint',{sw:3})+rmark(c[0],c[1],20,18,'sun');
   s+=TH.t(210,75,LT('Ê ke','Set square'),{s:17})+TH.t(180,205,LT('Khít góc vuông!','A perfect fit!'),{s:17,c:'#1C8A55'});return TH.svg(220,s)},
  say:LT('Muốn kiểm tra có vuông góc không, con dùng **ê ke**. Đặt góc vuông của ê ke vào chỗ hai đường cắt nhau. Nếu **khít** thì hai đường **vuông góc**.','To check if lines are perpendicular, use a **set square**. Put its right-angle corner where the lines cross. If it **fits exactly**, the lines are **perpendicular**.')},
 {svg:()=>{var s='',d=[0.966,-0.259],a1=[30,160],a2=[291,90],b1=[14.5,102],b2=[275.5,32];
   s+=TH.arr(a1[0],a1[1],a2[0],a2[1],{c:'blue',w:4})+TH.arr(a2[0],a2[1],a1[0],a1[1],{c:'blue',w:4})+TH.arr(b1[0],b1[1],b2[0],b2[1],{c:'orange',w:4})+TH.arr(b2[0],b2[1],b1[0],b1[1],{c:'orange',w:4});
   s+=TH.arr(88,144.5,72.5,86.5,{c:'green',w:3.5,h:8})+TH.arr(72.5,86.5,88,144.5,{c:'green',w:3.5,h:8})+TH.arr(223,108,207.5,50,{c:'green',w:3.5,h:8})+TH.arr(207.5,50,223,108,{c:'green',w:3.5,h:8});
   s+=TH.t(310,92,'a',{s:20,c:'blue'})+TH.t(300,36,'b',{s:20,c:HI})+TH.t(180,198,LT('Luôn cách đều nhau','Always the same distance apart'),{s:16,c:'#1C8A55'});return TH.svg(215,s)},
  say:LT('Hai đường thẳng **song song** thì **luôn cách đều nhau**. Dù kéo dài mãi về hai phía, chúng **không bao giờ cắt nhau**.','**Parallel** lines are **always the same distance apart**. Even if you extend them forever in both directions, they **never cross**.')},
 {svg:()=>{var s=TH.r(80,30,200,100,'sky')+rmark(80,30,270,16,'sun');
   var ch=function(x,y,h){return TH.path(h?'M'+x+' '+(y-9)+' L'+(x+9)+' '+y+' L'+x+' '+(y+9):'M'+(x-9)+' '+y+' L'+x+' '+(y+9)+' L'+(x+9)+' '+y,'none',{sw:3,stroke:'pink'})};
   s+=ch(176,30,1)+ch(176,130,1)+ch(80,74)+ch(80,86)+ch(280,74)+ch(280,86);
   s+=TH.t(64,28,'A',{s:19})+TH.t(298,28,'B',{s:19})+TH.t(298,152,'C',{s:19})+TH.t(64,152,'D',{s:19})+TH.t(180,185,'AB song song DC',{s:20})+TH.t(180,213,'AD vuông góc AB',{s:20});return TH.svg(225,s)},
  say:LT('Hình chữ nhật có cả hai loại: hai cạnh **đối diện** thì **song song** (dấu mũi tên), hai cạnh **kề nhau** thì **vuông góc** (ô vuông nhỏ).','A rectangle has both kinds: **opposite** sides are **parallel** (arrow marks), and sides **next to each other** are **perpendicular** (little square).')},
 {svg:()=>{var s=TH.l(30,60,150,76,{c:'blue',w:5})+TH.l(30,150,150,120,{c:'orange',w:5})+TH.l(150,76,265,91.3,{c:'blue',w:3,dash:'7 7'})+TH.l(150,120,265,91.3,{c:'orange',w:3,dash:'7 7'})+TH.c(265,91.3,8,'red')+TH.t(265,62,LT('Chúng gặp nhau ở đây!','They meet here!'),{s:15,c:'red'})+TH.t(18,60,'a',{s:18,c:'blue'})+TH.t(18,155,'b',{s:18,c:HI});return TH.svg(185,s)},
  say:LT('Cẩn thận! Hai đoạn này nhìn như chưa cắt nhau, nhưng **kéo dài ra thì cắt nhau**. Vậy chúng **không** song song.\nHai đường kéo dài mà cắt nhau thì có song song không?','Careful! These two pieces look like they do not cross, but **when we extend them, they cross**. So they are **not** parallel.\nIf two extended lines cross, are they parallel?'),
  ask:{opts:[LT('Có','Yes'),LT('Không','No')],ans:LT('Không','No'),good:LT('Đúng! Song song là không bao giờ cắt nhau.','Right! Parallel lines never cross.')}}
]},

/* ================= HÌNH BÌNH HÀNH, HÌNH THOI ================= */
hbh:{memo:LT('Bình hành: cạnh đối song song và bằng nhau. Thoi: cả 4 cạnh bằng nhau.','Parallelogram: opposite sides parallel and equal. Rhombus: all 4 sides equal.'),pages:[
 {svg:()=>TH.svg(190,TH.r(30,70,100,70,'sky')+TH.arr(140,105,168,105,{c:'orange',w:4})+TH.t(154,92,LT('đẩy','push'),{s:15,c:HI})+TH.poly('205,70 305,70 275,140 175,140','mint')+TH.t(80,168,LT('Hình chữ nhật','Rectangle'),{s:16})+TH.t(240,168,LT('Hình bình hành','Parallelogram'),{s:16})),
  say:LT('Con thử **đẩy nghiêng** một hình chữ nhật như đẩy cái khung cửa sổ. Ta được một hình mới: **hình bình hành**.','Try **pushing** a rectangle **sideways**, like a window frame. You get a new shape: a **parallelogram**.')},
 {svg:()=>{var A=[110,50],B=[290,50],C=[250,150],D=[70,150];
   return TH.svg(228,TH.poly([A,B,C,D].join(' '),'mint')+sidearr(A[0],A[1],B[0],B[1],1)+sidearr(D[0],D[1],C[0],C[1],1)+sidearr(A[0],A[1],D[0],D[1],2,'purple')+sidearr(B[0],B[1],C[0],C[1],2,'purple')
   +TH.t(98,40,'A',{s:19})+TH.t(302,40,'B',{s:19})+TH.t(262,170,'C',{s:19})+TH.t(58,170,'D',{s:19})+TH.t(180,205,'AB song song DC     AD song song BC',{s:17}))},
  say:LT('**Hình bình hành** ABCD có **hai cặp cạnh đối diện song song**: AB song song DC, và AD song song BC. Các mũi tên cùng kiểu chỉ cạnh song song.','**Parallelogram** ABCD has **two pairs of parallel opposite sides**: AB is parallel to DC, and AD is parallel to BC. Matching arrows mark parallel sides.')},
 {svg:()=>{var A=[125,40],B=[305,40],C=[260,151],D=[80,151];
   return TH.svg(195,TH.poly([A,B,C,D].join(' '),'sun',{sw:2})+TH.l(A[0],A[1],B[0],B[1],{c:'orange',w:7})+TH.l(D[0],D[1],C[0],C[1],{c:'orange',w:7})+TH.l(A[0],A[1],D[0],D[1],{c:'green',w:7})+TH.l(B[0],B[1],C[0],C[1],{c:'green',w:7})
   +TH.t(215,28,'6 cm',{s:17,c:HI})+TH.t(170,178,'6 cm',{s:17,c:HI})+TH.t(84,92,'4 cm',{s:17,c:'#1C8A55',a:'end'})+TH.t(295,102,'4 cm',{s:17,c:'#1C8A55',a:'start'}))},
  say:LT('Hai cạnh đối diện của hình bình hành còn **bằng nhau** nữa: hai cạnh dài cùng 6 cm, hai cạnh ngắn cùng 4 cm.','Opposite sides of a parallelogram are also **equal**: both long sides are 6 cm, both short sides are 4 cm.')},
 {svg:()=>{var T=[180,30],R=[290,100],B=[180,170],L=[70,100];
   return TH.svg(228,TH.poly([T,R,B,L].join(' '),'rose')+tick(T[0],T[1],R[0],R[1],1)+tick(R[0],R[1],B[0],B[1],1)+tick(B[0],B[1],L[0],L[1],1)+tick(L[0],L[1],T[0],T[1],1)
   +TH.t(180,22,'A',{s:19})+TH.t(304,106,'B',{s:19,a:'start'})+TH.t(180,194,'C',{s:19})+TH.t(56,106,'D',{s:19,a:'end'})+TH.t(180,106,LT('4 cạnh bằng nhau','4 equal sides'),{s:15}).replace('font-weight="800"','font-weight="800"')+TH.t(180,222,LT('Mỗi gạch nhỏ = bằng nhau','Same marks = equal'),{s:15,c:DIM}))},
  say:LT('**Hình thoi** cũng có hai cặp cạnh đối diện song song, nhưng nó đặc biệt hơn: **cả 4 cạnh đều bằng nhau**. Giống viên gạch lát hình thoi!','A **rhombus** also has two pairs of parallel opposite sides, but it is more special: **all 4 sides are equal**. Like a diamond-shaped floor tile!')},
 {svg:()=>{var A=[100,28],B=[220,28],C=[196,104],D=[76,104],s='';
   s+=TH.poly([A,B,C,D].join(' '),'mint',{sw:2})+TH.t(160,22,'6',{s:17,c:HI})+TH.t(70,70,'4',{s:17,c:'#1C8A55',a:'end'})+TH.t(244,70,'(6 + 4) × 2',{s:19,a:'start'}).replace('x="244"','x="236"')+TH.t(236,98,'= 20 cm',{s:19,a:'start'});
   s+=TH.tape(30,135,300,34,[{u:6,f:'sun',t:'6'},{u:4,f:'mint',t:'4'},{u:6,f:'sun',t:'6'},{u:4,f:'mint',t:'4'}])+TH.brace(30,330,175,'20 cm');return TH.svg(235,s)},
  say:LT('**Chu vi** là độ dài đi vòng quanh hình. Hình bình hành: lấy cạnh dài cộng cạnh ngắn rồi **nhân 2**: (6 + 4) × 2 = 20 cm.\nCạnh 8 cm và 3 cm thì chu vi?','The **perimeter** is the distance around a shape. For a parallelogram, add the long and short sides, then **multiply by 2**: (6 + 4) × 2 = 20 cm.\nSides 8 cm and 3 cm give a perimeter of?'),
  ask:{opts:[LT('22 cm','22 cm'),LT('11 cm','11 cm'),LT('24 cm','24 cm')],ans:LT('22 cm','22 cm'),good:LT('Đúng! (8 + 3) × 2 = 22 cm.','Right! (8 + 3) × 2 = 22 cm.')}},
 {svg:()=>{var T=[110,25],R=[190,70],B=[110,115],L=[30,70],s='';
   s+=TH.poly([T,R,B,L].join(' '),'rose')+tick(T[0],T[1],R[0],R[1],1)+tick(R[0],R[1],B[0],B[1],1)+tick(B[0],B[1],L[0],L[1],1)+tick(L[0],L[1],T[0],T[1],1)+TH.t(168,38,'5 cm',{s:16,c:HI,a:'start'})+TH.t(222,62,'5 × 4',{s:20,a:'start'}).replace('x="222"','x="236"')+TH.t(236,92,'= 20 cm',{s:20,a:'start'});
   s+=TH.tape(30,140,300,34,[{u:1,f:'sun',t:'5'},{u:1,f:'mint',t:'5'},{u:1,f:'sun',t:'5'},{u:1,f:'mint',t:'5'}])+TH.brace(30,330,180,'20 cm');return TH.svg(240,s)},
  say:LT('Hình thoi có **4 cạnh bằng nhau** nên không cần cộng từng cạnh: chu vi = cạnh × 4. Cạnh 5 cm thì 5 × 4 = 20 cm.\nCạnh 7 cm thì chu vi?','A rhombus has **4 equal sides**, so we do not add them one by one: perimeter = side × 4. A 5 cm side gives 5 × 4 = 20 cm.\nA 7 cm side gives a perimeter of?'),
  ask:{opts:[LT('28 cm','28 cm'),LT('14 cm','14 cm'),LT('21 cm','21 cm')],ans:LT('28 cm','28 cm'),good:LT('Đúng! 7 × 4 = 28 cm.','Right! 7 × 4 = 28 cm.')}},
 {svg:()=>{var K=[[90,25],[145,80],[90,170],[35,80]],R=[[270,25],[335,95],[270,165],[205,95]],s='';
   s+=TH.poly(K.join(' '),'gray')+tick(K[0][0],K[0][1],K[1][0],K[1][1],1)+tick(K[3][0],K[3][1],K[0][0],K[0][1],1)+tick(K[1][0],K[1][1],K[2][0],K[2][1],2)+tick(K[2][0],K[2][1],K[3][0],K[3][1],2);
   s+=TH.poly(R.join(' '),'rose')+tick(R[0][0],R[0][1],R[1][0],R[1][1],1)+tick(R[1][0],R[1][1],R[2][0],R[2][1],1)+tick(R[2][0],R[2][1],R[3][0],R[3][1],1)+tick(R[3][0],R[3][1],R[0][0],R[0][1],1);
   s+=TH.t(90,196,LT('Không phải hình thoi','Not a rhombus'),{s:16,c:'red'})+TH.t(270,196,LT('Hình thoi','Rhombus'),{s:16,c:'#1C8A55'});return TH.svg(215,s)},
  say:LT('Cẩn thận! Hình bên trái có các cạnh **không bằng nhau** (gạch khác nhau), nên **không** phải hình thoi.\nCó phải hình bình hành nào cũng có 4 cạnh bằng nhau không?','Careful! The left shape has sides that are **not equal** (different marks), so it is **not** a rhombus.\nDoes every parallelogram have 4 equal sides?'),
  ask:{opts:[LT('Đúng','Yes'),LT('Sai','No')],ans:LT('Sai','No'),good:LT('Đúng! Chỉ hình thoi mới có cả 4 cạnh bằng nhau.','Right! Only a rhombus has all 4 sides equal.')}}
]},

/* ================= YẾN, TẠ, TẤN ================= */
mass:{memo:LT('Mỗi bậc gấp 10 lần: yến 10 kg, tạ 100 kg, tấn 1 000 kg.','Each step is 10 times: yến 10 kg, tạ 100 kg, ton 1,000 kg.'),pages:[
 {svg:()=>{var s=kgbag(40,105,50,55,LT('gạo','rice'),'sun')+kgbag(125,88,80,72,LT('gạo','rice'),'sun')+TH.r(235,100,70,50,'sky')+TH.poly('305,112 330,112 342,130 342,150 305,150','blue',{sw:2.5})+TH.c(255,152,11,'gray')+TH.c(325,152,11,'gray')+TH.t(65,185,'1 kg',{s:17})+TH.t(165,185,'10 kg',{s:17})+TH.t(290,185,NU(1000,'kg'),{s:17});return TH.svg(205,s)},
  say:LT('Gói gạo nhỏ nặng **1 ki-lô-gam**. Bao gạo to nặng 10 kg. Xe tải chở được cả nghìn ki-lô-gam! Vật càng nặng, ta càng cần **đơn vị lớn hơn kg**.','A small bag of rice weighs **1 kilogram**. A big sack weighs 10 kg. A truck can carry 1,000 kg or more! The heavier something is, the **bigger unit than kg** we need.')},
 {svg:()=>{var s='',i;for(i=0;i<10;i++)s+=kgbag(20+(i%5)*40,45+Math.floor(i/5)*50,34,30,'','sun');
   s+=TH.arr(228,85,258,85,{c:'blue',w:4})+kgbag(272,50,70,70,'1 yến','mint')+TH.t(110,150,LT('10 bao, mỗi bao 1 kg','10 bags, 1 kg each'),{s:15,c:DIM})+TH.t(180,182,'10 kg = 1 yến',{s:21});return TH.svg(200,s)},
  say:LT('Gom **10 kg** lại thành một bó, ta gọi là **1 yến**. Vậy **1 yến = 10 kg**.','Put **10 kg** together into one bundle and we call it **1 yến**. So **1 yến = 10 kg**.')},
 {svg:()=>{var s='',i;for(i=0;i<10;i++)s+=kgbag(15+(i%5)*45,50+Math.floor(i/5)*50,38,32,'','mint');
   s+=TH.arr(248,95,268,95,{c:'blue',w:4})+kgbag(278,55,64,75,'1 tạ','sky')+TH.t(120,152,LT('mỗi bao 1 yến (10 kg)','each bag 1 yến (10 kg)'),{s:15,c:DIM})+TH.t(180,185,'1 tạ = 10 yến = 100 kg',{s:20});return TH.svg(205,s)},
  say:LT('**10 yến** gom lại thành **1 tạ**. Một yến là 10 kg, mười yến là 100 kg. Vậy **1 tạ = 10 yến = 100 kg**.','**10 yến** together make **1 tạ**. One yến is 10 kg, so ten yến is 100 kg. So **1 tạ = 10 yến = 100 kg**.')},
 {svg:()=>{var s='',i;for(i=0;i<10;i++)s+=TH.box(15+i*31,40,28,40,'tạ','teal',{s:15,rx:4}).replace(/stroke-width="2.5"/,'stroke-width="2"');
   s+=TH.brace(15,325,92,LT('1 tấn = 10 tạ','1 ton = 10 tạ'))+TH.t(180,170,LT('10 tạ = 100 yến','10 tạ = 100 yến'),{s:19})+TH.t(180,198,'= '+N(1000)+' kg',{s:19});return TH.svg(215,s)},
  say:LT('Còn nặng hơn nữa thì dùng **tấn**. **10 tạ** gom lại thành **1 tấn**. Vậy **1 tấn = 10 tạ = 100 yến = 1 000 kg**.','For even heavier things we use the **ton**. **10 tạ** together make **1 ton**. So **1 ton = 10 tạ = 100 yến = 1,000 kg**.')},
 {svg:()=>TH.svg(175,ladder([LT('tấn','ton'),'tạ','yến','kg'],10)),
  say:LT('Xếp từ lớn đến bé: **tấn, tạ, yến, kg**. Mỗi bậc gấp **10 lần** bậc kế bên. Đi xuống (sang đơn vị bé) thì **nhân 10**, đi lên thì **chia 10**.','From big to small: **ton, tạ, yến, kg**. Each step is **10 times** the next one. Going down (to a smaller unit) we **multiply by 10**; going up we **divide by 10**.')},
 {svg:()=>{var s='';[[15,'3 tạ'],[135,'30 yến'],[255,'300 kg']].forEach(function(b,i){s+=TH.box(b[0],85,90,50,b[1],['pink','orange','green'][i],{s:20})});
   s+=TH.arr(108,110,132,110,{c:'blue',w:3.5})+TH.arr(228,110,252,110,{c:'blue',w:3.5})+TH.t(120,78,'×10',{s:16,c:'blue'})+TH.t(240,78,'×10',{s:16,c:'blue'})+TH.note(30,160,300,40,LT('Sang đơn vị bé hơn: nhân','To a smaller unit: multiply'),{fill:'mint',s:17});return TH.svg(215,s)},
  say:LT('Đổi **3 tạ** ra kg: tạ sang yến nhân 10 được 30 yến, yến sang kg nhân 10 được 300 kg. Vậy 3 tạ = 300 kg.\n5 yến bằng bao nhiêu kg?','Change **3 tạ** to kg: tạ to yến, times 10 gives 30 yến; yến to kg, times 10 gives 300 kg. So 3 tạ = 300 kg.\nHow many kg is 5 yến?'),
  ask:{opts:[LT('50 kg','50 kg'),LT('500 kg','500 kg'),LT('15 kg','15 kg')],ans:LT('50 kg','50 kg'),good:LT('Đúng! 5 × 10 = 50 kg.','Right! 5 × 10 = 50 kg.')}},
 {svg:()=>TH.svg(225,TH.box(20,8,320,40,'2 tạ  ?  150 kg','rose',{s:20})+TH.t(180,72,LT('Khác đơn vị, chưa so sánh được','Different units, cannot compare yet'),{s:15,c:'red'})+TH.box(20,88,320,40,'200 kg  ?  150 kg','sun',{s:20})+TH.t(180,152,LT('Đổi cùng đơn vị: kg','Same unit now: kg'),{s:15,c:DIM})+TH.box(20,165,320,42,'200 kg > 150 kg','mint',{s:21})),
  say:LT('Cẩn thận! Muốn so sánh hai khối lượng, phải đổi về **cùng một đơn vị** rồi mới so. 2 tạ = 200 kg, nên 2 tạ **lớn hơn** 150 kg.\nKhối lượng nào lớn hơn?','Careful! To compare two masses, change them to **the same unit** first. 2 tạ = 200 kg, so 2 tạ is **more than** 150 kg.\nWhich mass is bigger: 3 yến or 25 kg?'),
  ask:{opts:[LT('3 yến','3 yến'),LT('25 kg','25 kg')],ans:LT('3 yến','3 yến'),good:LT('Đúng! 3 yến = 30 kg, lớn hơn 25 kg.','Right! 3 yến = 30 kg, which is more than 25 kg.')}}
]},

/* ================= DIỆN TÍCH: dm2, m2, mm2 ================= */
area:{memo:LT('Hai đơn vị diện tích liền nhau hơn kém nhau 100 lần.','Two neighboring area units differ by 100 times.'),pages:[
 {svg:()=>TH.svg(200,TH.grid(20,25,4,6,36,{fillFn:function(i,j){return (i+j)%2?'sky':'mint'}})+TH.t(128,192,LT('24 viên gạch','24 tiles'),{s:16})+TH.t(300,95,'6 × 4',{s:22})+TH.t(300,125,'= 24',{s:22})),
  say:LT('Lát nền nhà bằng gạch hình vuông. Nền rộng bao nhiêu thì đếm xem **bao nhiêu ô vuông**. Số ô vuông chính là **diện tích**.','Tiling a floor with square tiles: to see how big the floor is, count **how many squares** fit. That number of squares is the **area**.')},
 {svg:()=>TH.svg(215,TH.r(115,40,130,130,'sun')+TH.arr(115,26,245,26,{w:3})+TH.arr(245,26,115,26,{w:3})+TH.t(180,18,'1 dm',{s:16})+TH.t(260,112,'1 dm',{s:16,a:'start'})+TH.t(180,112,'1 dm²',{s:26})+TH.t(180,200,'1 dm = 10 cm',{s:19})),
  say:LT('Hình vuông có cạnh **1 đề-xi-mét** có diện tích là **1 dm²** (đọc là một đề-xi-mét vuông). Nhớ 1 dm = 10 cm.','A square with a side of **1 decimeter** has an area of **1 dm²** (one square decimeter). Remember 1 dm = 10 cm.')},
 {svg:()=>TH.svg(235,TH.grid(110,30,10,10,14,{fillFn:function(i,j){return i==0?'orange':'white'}})+TH.t(104,105,LT('10 hàng','10 rows'),{s:15,a:'end'})+TH.t(258,44,'10 cm²',{s:15,a:'start',c:HI})+TH.t(180,196,'10 × 10 = 100',{s:20})+TH.t(180,224,'1 dm² = 100 cm²',{s:21})),
  say:LT('Chia cạnh 1 dm thành 10 cm: mỗi hàng có 10 ô 1 cm², có 10 hàng. Vậy **1 dm² = 100 cm²**.','Split the 1 dm side into 10 cm: each row has 10 squares of 1 cm², and there are 10 rows. So **1 dm² = 100 cm²**.')},
 {svg:()=>TH.svg(245,TH.t(180,18,'1 m = 10 dm',{s:17})+TH.grid(110,30,10,10,14,{fillFn:function(i,j){return (i+j)%2?'sky':'mint'}})+TH.t(180,205,LT('Mỗi ô là 1 dm²','Each square is 1 dm²'),{s:17})+TH.t(180,233,'1 m² = 100 dm²',{s:21})),
  say:LT('Hình vuông cạnh **1 mét** (10 dm) có diện tích **1 m²**. Nó chứa 10 hàng, mỗi hàng 10 ô 1 dm². Vậy **1 m² = 100 dm²**.','A square with a side of **1 meter** (10 dm) has an area of **1 m²**. It holds 10 rows with 10 squares of 1 dm² each. So **1 m² = 100 dm²**.')},
 {svg:()=>{var s=TH.t(110,20,'1 cm',{s:16})+TH.grid(40,30,10,10,14,{fillFn:function(i,j){return (i==3&&j==7)?'yellow':'white'}})+TH.arr(186,79,226,88,{c:'blue',w:3.5})+TH.r(232,58,70,70,'yellow')+TH.t(267,99,'1 mm²',{s:17})+TH.t(180,205,'1 cm² = 100 mm²',{s:21});return TH.svg(225,s)},
  say:LT('Hình vuông cạnh **1 cm** chia thành 10 hàng × 10 ô nhỏ xíu. Mỗi ô nhỏ có cạnh **1 mm**, diện tích **1 mm²**. Vậy **1 cm² = 100 mm²**.','A square with a side of **1 cm** splits into 10 rows × 10 tiny squares. Each tiny square has a side of **1 mm** and an area of **1 mm²**. So **1 cm² = 100 mm²**.')},
 {svg:()=>TH.svg(245,ladder(['m²','dm²','cm²','mm²'],100)+TH.note(40,185,280,40,LT('3 dm² = 3 × 100 = 300 cm²','3 dm² = 3 × 100 = 300 cm²'),{fill:'mint',s:18})),
  say:LT('Hai đơn vị diện tích liền nhau hơn kém nhau **100 lần**. Đi xuống thì **nhân 100**, đi lên thì **chia 100**. Ví dụ: 3 dm² = 300 cm².','Two neighboring area units differ by **100 times**. Going down we **multiply by 100**; going up we **divide by 100**. For example: 3 dm² = 300 cm².')},
 {svg:()=>{var s=TH.t(80,22,LT('Độ dài','Length'),{s:17,c:'blue'})+TH.t(270,22,LT('Diện tích','Area'),{s:17,c:HI})+TH.grid(20,75,1,10,12,{fillFn:function(){return 'sky'}})+TH.t(80,115,'1 m = 10 dm',{s:16})+TH.t(80,150,'×10',{s:24,c:'blue'})
   +TH.grid(210,45,10,10,12,{fillFn:function(i,j){return (i+j)%2?'rose':'white'}})+TH.t(270,190,'1 m² = 100 dm²',{s:16})+TH.t(270,218,'×100',{s:24,c:HI});return TH.svg(230,s)},
  say:LT('Cẩn thận! **Độ dài** thì 1 m = **10** dm. Nhưng **diện tích** thì 1 m² = **100** dm². Đừng nhầm 10 với 100!\n2 m² bằng bao nhiêu dm²?','Careful! For **length**, 1 m = **10** dm. But for **area**, 1 m² = **100** dm². Do not mix up 10 and 100!\nHow many dm² is 2 m²?'),
  ask:{opts:[NU(200,'dm²'),NU(20,'dm²'),NU(2000,'dm²')],ans:NU(200,'dm²'),good:LT('Đúng! 2 × 100 = 200 dm².','Right! 2 × 100 = 200 dm².')}}
]}
});
})();


/* theory_t6.js */
window.LY_THUYET = window.LY_THUYET || {};
(function(){
var C=TH.C;
var n=function(s){return LT(s,s)};
var nf=function(k){var s=String(k);return LT(s.replace(/\B(?=(\d{3})+(?!\d))/g,' '),s.replace(/\B(?=(\d{3})+(?!\d))/g,','))};
var T=function(x,y,vi,en,o){return TH.t(x,y,LT(vi,en),o)};
var S15={s:15};
/* hàng ô chữ số: arr là mảng chuỗi; fills là mảng màu */
function digs(x,y,arr,o){o=o||{};var w=o.w||50,h=o.h||52,g=o.gap==null?8:o.gap,s='';arr.forEach(function(d,i){var f=(o.fills&&o.fills[i])||'white';var xx=x+i*(w+g);s+=TH.r(xx,y,w,h,f,{rx:10,dash:d==='?'?'5 4':null})+TH.t(xx+w/2,y+h/2+(o.s||26)*.35,d,{s:o.s||26})});return s}
/* biểu đồ cột */
function bars(o){var s='',nn=o.vals.length,slot=o.W/nn,bw=slot*.6,x0=o.x0,y0=o.y0,ph=o.ph,max=o.max,v,i;
 for(v=0;v<=max;v+=o.step){var y=y0-v*ph;if(v>0)s+=TH.l(x0,y,x0+o.W,y,{c:'#D9D2BD',w:1.5,dash:'5 5'});s+=TH.t(x0-9,y+5,String(v),{s:15,a:'end',b:false})}
 if(o.minor)for(v=o.minor;v<=max;v+=o.minor){if(v%o.step)s+=TH.l(x0-5,y0-v*ph,x0,y0-v*ph,{w:2})}
 for(i=0;i<nn;i++){var x=x0+i*slot+(slot-bw)/2,h=o.vals[i]*ph,f=(o.hl&&o.hl[i])||'blue';s+=TH.r(x,y0-h,bw,h,f,{rx:3});if(o.showVal)s+=TH.t(x+bw/2,y0-h-7,String(o.vals[i]),{s:16});if(o.labs)s+=TH.t(x+bw/2,y0+22,o.labs[i],{s:15})}
 s+=TH.l(x0,y0,x0,y0-max*ph-6,{c:o.axY||'ink',w:3.5})+TH.l(x0,y0,x0+o.W,y0,{c:o.axX||'ink',w:3.5});return s}
function days(){return [LT('Thứ 2','Mon'),LT('Thứ 3','Tue'),LT('Thứ 4','Wed'),LT('Thứ 5','Thu')]}
/* kiểm đếm */
function tally(x,y,k,c){var s='',g=Math.floor(k/5),r=k%5,i,j,gx;for(i=0;i<g;i++){gx=x+i*46;for(j=0;j<4;j++)s+=TH.l(gx+j*9,y-15,gx+j*9,y+15,{w:3,c:c});s+=TH.l(gx-6,y+11,gx+33,y-11,{w:3,c:c})}
 gx=x+g*46;for(j=0;j<r;j++)s+=TH.l(gx+j*9,y-15,gx+j*9,y+15,{w:3,c:c});return s}
function coin(cx,cy,r,txt,f,sz){return TH.c(cx,cy,r,f)+TH.c(cx,cy,r-6,'none',{sw:1.5})+TH.t(cx,cy+(sz||26)*.35,txt,{s:sz||26})}
function pts(a,dx,dy){return a.map(function(p){return (p[0]+dx)+','+(p[1]+dy)}).join(' ')}
var SHIRT=[[0,10],[14,0],[22,6],[34,6],[42,0],[56,10],[48,24],[42,20],[42,56],[14,56],[14,20],[8,24]];
var PANTS=[[0,0],[46,0],[50,54],[31,54],[23,20],[15,54],[-4,54]];
function shirt(x,y,f){return TH.poly(pts(SHIRT,x,y),f)}
function pants(x,y,f){return TH.poly(pts(PANTS,x,y),f)}
function clock(cx,cy,r){var s=TH.c(cx,cy,r,'white',{sw:3.5}),i;for(i=0;i<12;i++){var a=i*Math.PI/6,l=i%3===0?10:6;s+=TH.l(cx+(r-4)*Math.sin(a),cy-(r-4)*Math.cos(a),cx+(r-4-l)*Math.sin(a),cy-(r-4-l)*Math.cos(a),{w:i%3===0?3:2})}
 s+=TH.t(cx,cy-r+30,'12',{s:16})+TH.t(cx+r-24,cy+6,'3',{s:16})+TH.t(cx,cy+r-16,'6',{s:16})+TH.t(cx-r+24,cy+6,'9',{s:16});return s}
function panel(y,h,fill,head){return TH.r(10,y,340,h,fill,{rx:14})+(head?TH.t(24,y+26,head,{s:17,a:'start'}):'')}

Object.assign(window.LY_THUYET,{

/* ---------------- GIÂY, THẾ KỈ ---------------- */
time:{ memo:LT('Giây – phút: nhân hoặc chia 60. Thế kỉ: bỏ hai chữ số cuối, cộng 1 (năm tròn trăm thì không cộng).','Seconds and minutes: multiply or divide by 60. Century: drop the last two digits, add 1 (round hundreds: do not add).'),
pages:[
{ svg:()=>TH.svg(190,clock(95,95,72)+TH.path('M95 40 A55 55 0 1 1 94 40','none',{sw:4,stroke:'orange'})+TH.poly('95,30 107,44 83,44','orange',{sw:2})+TH.l(95,95,95,48,{c:'red',w:4})+TH.c(95,95,5,'ink')+T(262,70,'Kim giây','The second hand',{s:16})+T(262,96,'chạy 1 vòng','goes around once',{s:16})+T(262,128,'= 60 giây','= 60 seconds',{s:18,c:'orange'})),
  say:LT('Con nhìn đồng hồ: **kim giây** chạy hết một vòng là **60 giây**. Một vòng ấy cũng là **1 phút**.','Look at a clock: the **second hand** goes once around in **60 seconds**. That one trip is also **1 minute**.') },
{ svg:()=>TH.svg(235,TH.box(20,12,150,44,LT('1 giờ','1 hour'),'sky')+TH.arr(95,58,95,92,{c:'orange',w:3.5})+T(115,82,'× 60','× 60',{a:'start',c:'orange'})+TH.box(20,96,150,44,LT('60 phút','60 minutes'),'mint')+TH.arr(95,142,95,176,{c:'orange',w:3.5})+T(115,166,'× 60','× 60',{a:'start',c:'orange'})+TH.box(20,180,150,44,LT('3 600 giây','3,600 seconds'),'rose',{s:17})+T(265,40,'lớn hơn','bigger',{s:16})+T(265,62,'đơn vị','unit',{s:16})+T(265,205,'60 × 60','60 × 60',{s:18,c:'orange'})),
  say:LT('Mỗi bậc hơn nhau **60 lần**: 1 giờ = 60 phút, 1 phút = 60 giây. Đi xuống (sang đơn vị bé hơn) thì **nhân 60**.','Each step is **60 times** the next: 1 hour = 60 minutes, 1 minute = 60 seconds. Going down to a smaller unit means **multiply by 60**.') },
{ svg:()=>TH.svg(182,T(180,20,'3 phút','3 minutes',{s:18})+TH.tape(20,30,320,38,[{u:1,f:'sky',t:LT('1 phút','1 min')},{u:1,f:'sky',t:LT('1 phút','1 min')},{u:1,f:'sky',t:LT('1 phút','1 min')}])+TH.tape(20,76,320,38,[{u:1,f:'mint',t:LT('60 giây','60 sec')},{u:1,f:'mint',t:LT('60 giây','60 sec')},{u:1,f:'mint',t:LT('60 giây','60 sec')}])+TH.brace(20,340,124,LT('3 × 60 = 180 giây','3 × 60 = 180 seconds'),{s:18,tc:'orange'})),
  say:LT('Ví dụ: **3 phút** = ? giây. Mỗi phút có 60 giây, có 3 phút nên lấy **3 × 60 = 180**. Vậy 3 phút = **180 giây**.','Example: **3 minutes** = ? seconds. Each minute has 60 seconds and there are 3 minutes, so **3 × 60 = 180**. So 3 minutes = **180 seconds**.') },
{ svg:()=>TH.svg(182,T(180,20,'120 giây','120 seconds',{s:18})+TH.tape(20,30,320,38,[{u:1,f:'mint',t:LT('60 giây','60 sec')},{u:1,f:'mint',t:LT('60 giây','60 sec')}])+TH.tape(20,76,320,38,[{u:1,f:'sky',t:LT('1 phút','1 min')},{u:1,f:'sky',t:LT('1 phút','1 min')}])+TH.brace(20,340,124,LT('120 : 60 = 2 phút','120 ÷ 60 = 2 minutes'),{s:18,tc:'orange'})),
  say:LT('Đi ngược lại: **120 giây** = ? phút. Cứ 60 giây gộp thành 1 phút, nên **chia 60**: 120 : 60 = 2. Con thử nhé: 180 giây = ? phút.','The other way: **120 seconds** = ? minutes. Every 60 seconds make 1 minute, so **divide by 60**: 120 ÷ 60 = 2. Try it: 180 seconds = ? minutes.'),
  ask:{opts:[n('3'),n('18'),n('120')],ans:n('3'),good:LT('Đúng rồi! 180 : 60 = 3 phút.','Right! 180 ÷ 60 = 3 minutes.')} },
{ svg:()=>TH.svg(198,T(180,18,'Mỗi thế kỉ = 100 năm','Each century = 100 years',{s:17})+T(73,50,'1 – 100','1 – 100',S15)+T(180,50,'101 – 200','101 – 200',S15)+T(287,50,'201 – 300','201 – 300',S15)+TH.tape(20,60,320,44,[{u:1,f:'sun',t:LT('thế kỉ I','century I')},{u:1,f:'mint',t:LT('thế kỉ II','century II')},{u:1,f:'sky',t:LT('thế kỉ III','century III')}],{s:16})+TH.brace(20,126,112,LT('100 năm','100 years'),{s:17})+T(180,186,'Thế kỉ viết bằng số La Mã','Centuries use Roman numerals',{s:16})),
  say:LT('Thời gian dài hơn thì dùng **thế kỉ**. **1 thế kỉ = 100 năm**. Năm 1 đến năm 100 là thế kỉ I, năm 101 đến 200 là thế kỉ II, cứ thế tiếp tục.','For long times we use **centuries**. **1 century = 100 years**. Years 1 to 100 are century I, years 101 to 200 are century II, and so on.') },
{ svg:()=>TH.svg(175,T(180,20,'Bác Hồ sinh năm 1890','Uncle Ho was born in 1890',{s:17})+TH.box(60,32,100,46,'18','sky',{s:28})+TH.box(170,32,100,46,'90','gray',{s:28})+TH.l(176,62,264,48,{c:'red',w:3})+TH.arr(110,80,110,106,{c:'orange',w:3.5})+T(220,102,'bỏ đi','drop it',{s:16})+TH.box(25,110,170,44,'18 + 1 = 19','sun',{s:20})+TH.arr(198,132,226,132,{c:'orange',w:3.5})+TH.box(230,110,105,44,'XIX','orange',{s:24})),
  say:LT('Muốn biết năm **1890** thuộc thế kỉ nào: **bỏ hai chữ số cuối** (còn 18), rồi **cộng 1** được 19. Vậy là **thế kỉ XIX**. Thử nhé: năm 2025 thuộc thế kỉ nào?','To find the century of the year **1890**: **drop the last two digits** (18 is left), then **add 1** to get 19. So it is the **19th century, XIX**. Try: which century is the year 2025?'),
  ask:{opts:[n('XX'),n('XXI'),n('XIX')],ans:n('XXI'),good:LT('Đúng! 20 + 1 = 21, thế kỉ XXI.','Right! 20 + 1 = 21, century XXI.')} },
{ svg:()=>TH.svg(190,TH.r(10,10,165,168,'rose',{rx:14})+TH.r(185,10,165,168,'mint',{rx:14})+T(92,38,'Sai','Wrong',{s:18,c:'red'})+T(267,38,'Đúng','Right',{s:18,c:'green'})+TH.t(92,76,'1900',{s:26})+TH.t(267,76,'1900',{s:26})+T(92,108,'19 + 1 = 20','19 + 1 = 20',{s:17})+T(92,134,'thế kỉ XX','century XX',{s:17,c:'red'})+T(267,108,'1801 – 1900','1801 – 1900',{s:17})+T(267,134,'thế kỉ XIX','century XIX',{s:17,c:'green'})),
  say:LT('**Cẩn thận!** Năm tròn trăm là **năm cuối** của thế kỉ, nên **không cộng 1**: 1900 thuộc thế kỉ XIX, 2000 thuộc thế kỉ XX. Còn 2001 mới sang thế kỉ XXI.','**Careful!** A round hundred is the **last year** of a century, so **do not add 1**: 1900 is in century XIX and 2000 is in century XX. Only 2001 starts century XXI.') }
]},

/* ---------------- BIỂU ĐỒ CỘT ---------------- */
chart:{ memo:LT('Đọc tên biểu đồ, rồi trục ngang, trục dọc, cuối cùng nhìn đỉnh cột.','Read the title, then the horizontal axis, the vertical axis, and last look at the top of each bar.'),
pages:[
{ svg:()=>TH.svg(215,T(180,20,'Số trang Mai đọc trong 4 ngày','Pages Mai read in 4 days',{s:17})+bars({x0:50,y0:185,W:290,ph:3.4,max:40,step:100,vals:[20,35,15,30],labs:days(),hl:{1:'orange'}})+T(300,70,'cột cao','tall bar',{s:15,c:'orange'})),
  say:LT('Mai đọc truyện 4 ngày. Thay vì đọc một dãy số, ta vẽ mỗi ngày thành **một cột**. **Cột càng cao** thì Mai đọc **càng nhiều** trang.','Mai read a book for 4 days. Instead of a list of numbers, we draw each day as **one bar**. The **taller the bar**, the **more pages** Mai read.') },
{ svg:()=>TH.svg(218,bars({x0:44,y0:185,W:180,ph:4,max:40,step:10,vals:[20,35,15,30],labs:[LT('T2','Mon'),LT('T3','Tue'),LT('T4','Wed'),LT('T5','Thu')],axY:'orange',axX:'blue'})+TH.r(238,34,14,14,'orange',{rx:3,sw:2})+T(260,46,'Trục dọc','Vertical',{s:15,a:'start'})+T(260,66,'số trang','= pages',{s:15,a:'start'})+TH.r(238,92,14,14,'blue',{rx:3,sw:2})+T(260,104,'Trục ngang','Horizontal',{s:15,a:'start'})+T(260,124,'các ngày','= days',{s:15,a:'start'})+TH.r(238,150,14,14,'sky',{rx:3,sw:2})+T(260,162,'Cột','Bar',{s:15,a:'start'})+T(260,182,'mỗi ngày','one day',{s:15,a:'start'})),
  say:LT('Biểu đồ có hai đường chính. **Trục dọc** (màu cam) ghi **số trang**. **Trục ngang** (màu xanh) ghi **tên các ngày**. Mỗi ngày có một cột.','A bar chart has two main lines. The **vertical axis** (orange) shows the **number of pages**. The **horizontal axis** (blue) shows the **days**. Each day has one bar.') },
{ svg:()=>TH.svg(218,bars({x0:50,y0:190,W:290,ph:4,max:40,step:5,vals:[20,35,15,30],labs:days(),hl:{1:'orange'}})+TH.l(50,50,196,50,{c:'orange',w:3,dash:'6 5'})+TH.c(50,50,6,'orange')+TH.box(215,18,128,34,LT('T3: 35 trang','Tue: 35 pages'),'sun',{s:16,rx:10})),
  say:LT('Muốn biết Thứ Ba đọc mấy trang: nhìn **đỉnh cột**, kẻ ngang sang **trục dọc**. Đỉnh cột chạm vạch **35**. Vậy Thứ Ba Mai đọc **35 trang**.','To find the pages on Tuesday: look at the **top of the bar** and slide across to the **vertical axis**. The top touches the mark **35**. So Mai read **35 pages** on Tuesday.') },
{ svg:()=>TH.svg(218,bars({x0:50,y0:190,W:290,ph:4,max:40,step:10,minor:5,vals:[30,25,15],labs:[LT('Cam','Orange'),LT('Táo','Apple'),LT('Lê','Pear')],hl:{1:'orange'}})+TH.l(50,90,170,90,{c:'orange',w:3,dash:'6 5'})+TH.c(50,90,6,'orange')+TH.t(18,95,'25',{s:17,c:'orange',a:'middle'})+T(255,40,'Số quả mỗi loại','Fruit of each kind',{s:15})),
  say:LT('Có khi đỉnh cột **nằm giữa hai vạch**. Ở đây mỗi vạch lớn hơn nhau 10, vạch nhỏ ở giữa là 5. Cột Táo nằm giữa 20 và 30 nên là **25**. Cột Lê cao bao nhiêu?','Sometimes the top of a bar is **between two marks**. Here the big marks are 10 apart and the small mark in the middle is 5. The Apple bar is between 20 and 30, so it is **25**. How tall is the Pear bar?'),
  ask:{opts:[n('10'),n('15'),n('20')],ans:n('15'),good:LT('Đúng! Lê nằm giữa 10 và 20, là 15 quả.','Right! Pear is between 10 and 20, so 15.')} },
{ svg:()=>TH.svg(218,T(250,14,'cao nhất − thấp nhất','tallest − shortest',{s:15})+T(250,34,'35 − 15 = 20','35 − 15 = 20',{s:18,c:'orange'})+bars({x0:50,y0:190,W:290,ph:3.8,max:40,step:10,vals:[20,35,15,30],labs:days(),hl:{1:'orange',2:'sky'},showVal:true})),
  say:LT('Nhìn các cột, con so sánh được ngay: cao nhất là Thứ Ba (35), thấp nhất là Thứ Tư (15). Hơn kém nhau **35 − 15 = 20** trang. Thứ Năm đọc hơn Thứ Tư bao nhiêu trang?','Looking at the bars you can compare at once: tallest is Tuesday (35), shortest is Wednesday (15). They differ by **35 − 15 = 20** pages. How many more pages on Thursday than Wednesday?'),
  ask:{opts:[n('15'),n('45'),n('5')],ans:n('15'),good:LT('Đúng! 30 − 15 = 15 trang.','Right! 30 − 15 = 15 pages.')} },
{ svg:()=>TH.svg(205,T(180,22,'Cùng độ cao, số khác nhau!','Same height, different numbers!',{s:17,c:'red'})+bars({x0:42,y0:140,W:110,ph:8,max:10,step:5,vals:[10],labs:[LT('Lớp A','Class A')],showVal:true,hl:{0:'orange'}})+bars({x0:222,y0:140,W:110,ph:.8,max:100,step:50,vals:[100],labs:[LT('Lớp B','Class B')],showVal:true,hl:{0:'orange'}})+T(97,185,'mỗi vạch: 5','step: 5',{s:15})+T(277,185,'mỗi vạch: 50','step: 50',{s:15})),
  say:LT('**Cẩn thận!** Hai cột cao bằng nhau nhưng thang chia khác nhau nên số liệu **khác nhau**: một bên 10, một bên 100. Luôn nhìn **các con số trên trục dọc** trước khi đọc.','**Careful!** Two bars can be equally tall but have different scales, so the numbers are **different**: 10 on one side, 100 on the other. Always check the **numbers on the vertical axis** first.') }
]},

/* ---------------- DÃY SỐ LIỆU ---------------- */
datalist:{ memo:LT('Đếm đủ từng số, kể cả số lặp lại; xếp từ bé đến lớn thì dễ so sánh.','Count every number, even repeats; sorting from least to greatest makes comparing easy.'),
pages:[
{ svg:()=>{var nm=['An','Bình','Lan','Hà','Minh','Nam'],v=[5,8,6,5,9,7],s=T(180,22,'Số cuốn sách mỗi bạn đọc','Books each student read',{s:17}),i;for(i=0;i<6;i++){var x=28+i*52;s+=TH.c(x+22,62,18,['rose','sky','sun','mint','lilac','gray'][i])+TH.t(x+22,98,nm[i],{s:15})+TH.box(x,110,44,44,String(v[i]),'white',{s:22})}return TH.svg(168,s)},
  say:LT('Cô giáo hỏi 6 bạn đã đọc mấy cuốn sách. Mỗi bạn nói một số: An 5, Bình 8, Lan 6, Hà 5, Minh 9, Nam 7. Cô ghi lại hết thành một **bảng**.','The teacher asked 6 students how many books they read. Each one gave a number: An 5, Bình 8, Lan 6, Hà 5, Minh 9, Nam 7. She wrote them all in a **table**.') },
{ svg:()=>TH.svg(165,T(180,24,'Dãy số liệu','Data sequence',{s:18})+digs(28,38,['5','8','6','5','9','7'],{w:44,h:44,gap:8,s:22,fills:['sky','sky','sky','sky','sky','sky']})+TH.brace(28,332,92,LT('6 số liệu','6 data values'),{s:18,tc:'orange'})),
  say:LT('Viết các số thành một hàng: **5; 8; 6; 5; 9; 7**. Ta gọi đó là **dãy số liệu**. Mỗi số là **một số liệu**. Đếm được **6 số liệu**.','Write the numbers in a row: **5; 8; 6; 5; 9; 7**. This is a **data sequence**. Each number is **one data value**. We count **6 data values**.') },
{ svg:()=>TH.svg(168,digs(28,26,['5','8','6','5','9','7'],{w:44,h:44,gap:8,s:22,fills:['sky','white','white','sky','orange','white']})+TH.arr(258,134,258,82,{c:'orange'})+T(258,154,'lớn nhất','greatest',{s:15,c:'orange'})+TH.arr(50,112,50,82,{c:'blue'})+T(50,134,'bé nhất','least',{s:15,c:'blue'})+TH.arr(206,112,206,82,{c:'blue'})+T(206,134,'bé nhất','least',{s:15,c:'blue'})),
  say:LT('Muốn tìm số **lớn nhất** hay **bé nhất**, ta so sánh tất cả các số trong dãy. Con thử nhé: số nào lớn nhất trong **5; 8; 6; 5; 9; 7**?','To find the **greatest** or the **least** number, compare all numbers in the sequence. Try: which number is the greatest in **5; 8; 6; 5; 9; 7**?'),
  ask:{opts:[n('5'),n('9'),n('8')],ans:n('9'),good:LT('Đúng! 9 lớn nhất, 5 bé nhất.','Right! 9 is greatest, 5 is least.')} },
{ svg:()=>TH.svg(172,digs(28,18,['5','8','6','5','9','7'],{w:44,h:44,gap:8,s:22,fills:['white','white','white','white','white','white']})+TH.arr(180,68,180,106,{c:'orange',w:3.5})+T(200,92,'xếp từ bé đến lớn','least to greatest',{s:15,a:'start'})+digs(28,112,['5','5','6','7','8','9'],{w:44,h:44,gap:8,s:22,fills:['sky','sky','mint','mint','mint','orange']})),
  say:LT('Xếp từ **bé đến lớn**: **5; 5; 6; 7; 8; 9**. Số 5 xuất hiện **hai lần** nên ta viết **cả hai**. Xếp rồi, tìm số bé nhất và lớn nhất ở hai đầu rất dễ.','Sort from **least to greatest**: **5; 5; 6; 7; 8; 9**. The number 5 appears **twice**, so we write **both**. Once sorted, the least and greatest sit at the two ends.') },
{ svg:()=>TH.svg(150,digs(28,14,['5','5','6','7','8','9'],{w:44,h:44,gap:8,s:22,fills:['sky','sky','mint','mint','mint','orange']})+T(180,92,'9 − 5 = 4','9 − 5 = 4',{s:19,c:'orange'})+T(180,126,'5 + 8 + 6 + 5 + 9 + 7 = 40','5 + 8 + 6 + 5 + 9 + 7 = 40',{s:17})),
  say:LT('Hơn kém: lớn nhất − bé nhất = 9 − 5 = **4**. **Tổng** các số liệu là 40. Con thử: có bao nhiêu bạn đọc **nhiều hơn 6 cuốn** (các số 5; 5; 6; 7; 8; 9)?','Difference: greatest − least = 9 − 5 = **4**. The **sum** of the values is 40. Try: how many students read **more than 6 books** (the numbers 5; 5; 6; 7; 8; 9)?'),
  ask:{opts:[n('2'),n('3'),n('4')],ans:n('3'),good:LT('Đúng! Đó là 7, 8 và 9: có 3 bạn.','Right! They are 7, 8 and 9: 3 students.')} },
{ svg:()=>TH.svg(190,panel(8,82,'rose',LT('Sai','Wrong')).replace(/>$/,'>')+digs(110,16,['5','8','6','9','7'],{w:34,h:34,gap:6,s:18,fills:['white','white','white','white','white']})+T(180,78,'Bỏ sót số 5 thứ hai: đếm được 5','Skipped the second 5: counted 5',{s:15})+panel(100,82,'mint',LT('Đúng','Right'))+digs(110,108,['5','8','6','5','9','7'],{w:34,h:34,gap:6,s:18,fills:['white','white','white','white','white','white']})+T(180,170,'Đếm đủ cả hai số 5: 6 số liệu','Counted both 5s: 6 values',{s:15})),
  say:LT('**Cẩn thận!** Có số xuất hiện nhiều lần (như số 5) thì **mỗi lần là một số liệu**. Đừng bỏ sót: dãy này có **6** số liệu, không phải 5.','**Careful!** If a number shows up many times (like 5), **each time is one data value**. Do not skip: this sequence has **6** values, not 5.') }
]},

/* ---------------- SỐ LẦN XUẤT HIỆN ---------------- */
freq:{ memo:LT('Mỗi lần một vạch, đủ 5 vạch thì gạch chéo; cộng các số lần phải bằng số lần làm.','One mark each time, cross the 5th mark; the counts must add up to the number of tries.'),
pages:[
{ svg:()=>TH.svg(180,T(180,22,'Tung đồng xu','Flip a coin',{s:18})+coin(100,80,42,LT('N','H'),'sun',34)+coin(260,80,42,LT('S','T'),'sky',34)+T(100,150,'Mặt ngửa (N)','Heads (H)',{s:17})+T(260,150,'Mặt sấp (S)','Tails (T)',{s:17})),
  say:LT('Khi tung một đồng xu, có thể ra **mặt ngửa** (N) hoặc **mặt sấp** (S). Mỗi lần tung là một **kết quả**. Ta sẽ đếm xem mỗi mặt ra bao nhiêu lần.','When you flip a coin, it can land **heads** (H) or **tails** (T). Each flip gives one **result**. We will count how many times each side shows up.') },
{ svg:()=>{var r=LT('N','H'),t=LT('S','T'),a=['N','S','N','N','S','N','S','N','N','N'],s=T(180,22,'Tung 10 lần','10 flips',{s:18}),i;for(i=0;i<10;i++){var cx=29+i*34;s+=TH.t(cx,52,String(i+1),{s:15,c:'#6B7390',b:false})+TH.c(cx,80,15,a[i]==='N'?'sun':'sky')+TH.t(cx,86,a[i]==='N'?r:t,{s:16})}return TH.svg(150,s+T(180,132,'Nhiều quá, dễ đếm nhầm!','Too many to count safely!',{s:17,c:'red'}))},
  say:LT('Tung 10 lần, ta được: N, S, N, N, S, N, S, N, N, N. Nhìn cả hàng dài như vậy rất dễ **đếm nhầm**. Cần một cách ghi gọn hơn!','After 10 flips we get: H, T, H, H, T, H, T, H, H, H. A long row like this is easy to **miscount**. We need a neater way to record!') },
{ svg:()=>TH.svg(185,T(180,20,'4 lần tung đầu','First 4 flips',{s:16})+coin(120,52,0.1,'','white',1).replace(/.*/,'')+[['N','sun'],['S','sky'],['N','sun'],['N','sun']].map(function(c,i){return TH.c(105+i*50,52,16,c[1])+TH.t(105+i*50,58,c[0]==='N'?LT('N','H'):LT('S','T'),{s:16})}).join('')+TH.r(10,86,340,92,'white',{rx:12})+T(24,122,'Mặt ngửa','Heads',{s:17,a:'start'})+tally(190,117,3,'orange')+T(24,160,'Mặt sấp','Tails',{s:17,a:'start'})+tally(190,155,1,'blue')),
  say:LT('Cách ghi gọn là **kiểm đếm**: mỗi lần mặt nào xuất hiện, ta ghi **một vạch** vào hàng của mặt đó. 4 lần đầu: ngửa 3 vạch, sấp 1 vạch.','A neat way is **tallying**: each time a side shows up, we draw **one mark** in that side\'s row. After the first 4 flips: 3 marks for heads, 1 for tails.') },
{ svg:()=>TH.svg(190,tally(30,50,4,'ink')+T(60,92,'4 vạch','4 marks',{s:16})+TH.arr(125,50,155,50,{c:'orange',w:3.5})+T(140,36,'+ 1','+ 1',{s:16,c:'orange'})+tally(180,50,5,'orange')+T(210,92,'1 nhóm 5','1 group of 5',{s:16,c:'orange'})+T(180,126,'8 lần xuất hiện','8 times',{s:16})+tally(100,160,8,'ink')+T(262,166,'5 + 3 = 8','5 + 3 = 8',{s:17,c:'orange'})),
  say:LT('Khi đến **vạch thứ 5**, ta **gạch chéo** qua 4 vạch trước để thành **một nhóm 5**. Nhìn nhóm nào cũng biết ngay là 5. Ví dụ: 1 nhóm và 3 vạch lẻ là 5 + 3 = **8**.','At the **5th mark**, we **cross** the 4 marks before it to make **a group of 5**. Each group is quickly seen as 5. Example: 1 group and 3 single marks is 5 + 3 = **8**.') },
{ svg:()=>TH.svg(180,TH.r(10,14,340,100,'white',{rx:12})+T(24,56,'Mặt ngửa','Heads',{s:17,a:'start'})+tally(130,50,7,'orange')+T(335,56,'= 7','= 7',{s:19,a:'end'})+T(24,96,'Mặt sấp','Tails',{s:17,a:'start'})+tally(130,90,3,'blue')+T(335,96,'= 3','= 3',{s:19,a:'end'})+T(180,146,'7 + 3 = 10 lần tung','7 + 3 = 10 flips',{s:18,c:'orange'})),
  say:LT('Bảng kiểm đếm 10 lần tung: ngửa **7** lần, sấp **3** lần. Cộng lại 7 + 3 = 10, đúng bằng số lần tung. Mặt ngửa ra nhiều hơn mặt sấp bao nhiêu lần?','The tally of 10 flips: heads **7** times, tails **3** times. Adding gives 7 + 3 = 10, the number of flips. How many more times did heads show up than tails?'),
  ask:{opts:[n('4'),n('10'),n('3')],ans:n('4'),good:LT('Đúng! 7 − 3 = 4 lần.','Right! 7 − 3 = 4 times.')} },
{ svg:()=>TH.svg(190,panel(8,82,'rose',LT('Sai','Wrong'))+T(180,56,'7 + 2 = 9','7 + 2 = 9',{s:20})+T(180,80,'Mà đã tung 10 lần: thiếu 1!','But we flipped 10 times: one missing!',{s:15})+panel(100,82,'mint',LT('Đúng','Right'))+T(180,148,'7 + 3 = 10','7 + 3 = 10',{s:20})+T(180,172,'Khớp số lần tung: yên tâm','It matches the flips: good',{s:15})),
  say:LT('**Cẩn thận!** Kiểm đếm xong, hãy **cộng các số lần** lại. Tổng phải **bằng số lần đã làm**. Nếu thiếu hoặc thừa thì đếm lại từ đầu.','**Careful!** After tallying, **add the counts**. The total must **equal the number of tries**. If it is too small or too big, count again from the start.') }
]},

/* ---------------- VIẾT SỐ THEO ĐIỀU KIỆN ---------------- */
cond:{ memo:LT('Số lớn: chữ số to đứng trước. Số bé: chữ số bé đứng trước, nhưng số đầu không được là 0.','Biggest number: big digits first. Smallest: small digits first, but the first digit cannot be 0.'),
pages:[
{ svg:()=>TH.svg(190,T(180,22,'Luật chơi của số bí mật','Rules for the secret number',{s:17})+T(105,52,'Trăm','Hundreds',S15).replace('x="105"','x="'+(54+32)+'"')+T(180,52,'Chục','Tens',S15)+T(268,52,'Đơn vị','Ones',S15)+digs(54,60,['?','?','?'],{w:64,h:58,gap:22,s:30})+TH.r(5,142,110,36,'sun',{rx:18})+T(60,166,'khác nhau','all different',S15)+TH.r(125,142,110,36,'mint',{rx:18})+T(180,166,'số lẻ','odd',S15)+TH.r(245,142,110,36,'rose',{rx:18})+T(300,166,'nhỏ nhất','smallest',S15)),
  say:LT('Số bí mật có **luật chơi** như thế này: gồm 3 chữ số, các chữ số **khác nhau**, là **số lẻ**, và phải **nhỏ nhất** có thể. Mình sẽ cùng tìm từng chữ số.','The secret number has **rules**: it has 3 digits, all digits are **different**, it is an **odd number**, and it must be the **smallest** possible. Let us find it digit by digit.') },
{ svg:()=>TH.svg(200,T(10,58,'Lớn nhất:','Largest:',{s:16,a:'start'})+digs(120,30,['9','8','7','6'],{w:44,h:46,gap:6,s:24,fills:['orange','sun','sun','sun']})+T(217,98,'chữ số to đứng trước','big digits first',{s:15})+T(10,148,'Bé nhất:','Smallest:',{s:16,a:'start'})+digs(120,120,['1','0','2','3'],{w:44,h:46,gap:6,s:24,fills:['sky','mint','mint','mint']})+T(217,188,'số đầu không là 0','first digit not 0',{s:15})),
  say:LT('**Số lớn nhất** có 4 chữ số khác nhau: xếp chữ số **to nhất** vào hàng cao nhất: 9 876. **Số bé nhất**: chữ số bé xếp trước, nhưng hàng đầu **không được là 0** nên là 1 023.','The **largest** 4-digit number with different digits: put the **biggest** digits in the highest places: 9876. The **smallest**: small digits first, but the first place **cannot be 0**, so it is 1023.') },
{ svg:()=>TH.svg(225,T(10,52,'Chẵn','Even',{s:17,a:'start',c:'blue'})+digs(110,30,['0','2','4','6','8'],{w:40,h:38,gap:6,s:20,fills:['sky','sky','sky','sky','sky']})+T(10,112,'Lẻ','Odd',{s:17,a:'start',c:'pink'})+digs(110,90,['1','3','5','7','9'],{w:40,h:38,gap:6,s:20,fills:['rose','rose','rose','rose','rose']})+digs(20,150,['7','3','5','1'],{w:36,h:44,gap:5,s:22,fills:['white','white','white','orange']})+TH.arr(212,172,186,172,{c:'orange',w:3.5})+T(260,166,'Chỉ nhìn chữ số','Only look at the',S15)+T(260,188,'cuối cùng!','last digit!',S15)),
  say:LT('Số **chẵn** tận cùng là 0, 2, 4, 6, 8. Số **lẻ** tận cùng là 1, 3, 5, 7, 9. Chỉ cần nhìn **chữ số cuối**. Số nào là số lẻ: 2 590, 4 806 hay 6 137?','**Even** numbers end in 0, 2, 4, 6, 8. **Odd** numbers end in 1, 3, 5, 7, 9. Just look at the **last digit**. Which is odd: 2,590, 4,806 or 6,137?'),
  ask:{opts:[nf(2590),nf(4806),nf(6137)],ans:nf(6137),good:LT('Đúng! 6 137 tận cùng là 7, là số lẻ.','Right! 6,137 ends in 7, so it is odd.')} },
{ svg:()=>TH.svg(185,T(180,20,'Lẻ bé nhất, 3 chữ số khác nhau','Smallest odd, 3 different digits',{s:16})+T(70,48,'Trăm','Hundreds',S15)+T(180,48,'Chục','Tens',S15)+T(290,48,'Đơn vị','Ones',S15)+digs(35,56,['1','0','?'],{w:70,h:56,gap:40,s:30,fills:['sky','sky','white']})+T(70,136,'bé nhất,','smallest,',S15)+T(70,156,'không là 0','not 0',S15)+T(180,136,'bé nhất','smallest',S15)+T(180,156,'còn lại: 0','left: 0',S15)+T(290,136,'phải là số','must be',S15,{c:'red'})+T(290,156,'lẻ!','odd!',{s:15,c:'red'})),
  say:LT('Hàng trăm: chữ số bé nhất nhưng **không là 0**, nên là **1**. Hàng chục: chữ số bé nhất còn lại là **0**. Còn hàng đơn vị thì phải là **số lẻ**.','Hundreds: the smallest digit that is **not 0** is **1**. Tens: the smallest digit left is **0**. The ones place must be an **odd** digit.') },
{ svg:()=>TH.svg(225,digs(105,12,['1','0','3'],{w:50,h:48,gap:8,s:26,fills:['sky','sky','orange']})+T(180,92,'Chữ số lẻ để chọn:','Odd digits to pick from:',{s:16})+digs(50,104,['1','3','5','7','9'],{w:44,h:44,gap:8,s:22,fills:['gray','orange','white','white','white']})+TH.l(50,126,94,126,{c:'red',w:3})+T(72,172,'đã dùng','used',{s:15,c:'red'})+T(124,172,'chọn!','pick!',{s:15,c:'orange'})+T(180,212,'Số cần tìm: 103','The number: 103',{s:20,c:'orange'})),
  say:LT('Chữ số lẻ bé nhất là 1 nhưng **1 đã dùng rồi**, nên chọn **3**. Số cần tìm là **103**. Thử nhé: số **chẵn** bé nhất có 3 chữ số khác nhau là số nào?','The smallest odd digit is 1 but **1 is already used**, so we pick **3**. The number is **103**. Try: what is the smallest **even** 3-digit number with different digits?'),
  ask:{opts:[n('100'),n('102'),n('120')],ans:n('102'),good:LT('Đúng! 100 có hai chữ số 0 giống nhau; 102 là bé nhất.','Right! 100 repeats 0; 102 is the smallest.')} },
{ svg:()=>TH.svg(190,T(180,20,'Số bé nhất có tổng chữ số là 30','Smallest number with digit sum 30',{s:16})+digs(68,34,['3','9','9','9'],{w:50,h:50,gap:8,s:28,fills:['orange','sky','sky','sky']})+TH.brace(126,292,90,LT('9 + 9 + 9 = 27','9 + 9 + 9 = 27'),{s:17})+T(180,164,'30 − 27 = 3','30 − 27 = 3',{s:19,c:'orange'})+T(180,186,'','',{s:1})),
  say:LT('Mỗi chữ số nhiều nhất là 9, ba chữ số cộng tối đa 27, chưa đủ 30. Nên cần **4 chữ số**: dồn 9 về bên phải, bên trái còn 30 − 27 = **3**. Số là **3 999**. Thử: tổng chữ số 20, số bé nhất?','A digit is at most 9, so 3 digits add to at most 27, not enough for 30. We need **4 digits**: push 9s to the right and the left digit is 30 − 27 = **3**. The number is **3999**. Try: digit sum 20, smallest number?'),
  ask:{opts:[n('299'),n('389'),n('992')],ans:n('299'),good:LT('Đúng! 2 + 9 + 9 = 20 và 299 bé nhất.','Right! 2 + 9 + 9 = 20 and 299 is the smallest.')} },
{ svg:()=>TH.svg(190,panel(8,82,'rose',LT('Sai','Wrong'))+digs(110,16,['0','1','2','3'],{w:40,h:36,gap:6,s:20})+T(180,76,'0 đứng đầu: chỉ còn 3 chữ số!','0 first: only 3 digits left!',{s:15})+panel(100,82,'mint',LT('Đúng','Right'))+digs(110,108,['1','0','2','3'],{w:40,h:36,gap:6,s:20,fills:['sky','white','white','white']})+T(180,168,'1 023: đủ 4 chữ số, khác nhau','1023: 4 digits, all different',{s:15})),
  say:LT('**Cẩn thận!** Số bé nhất có 4 chữ số khác nhau không phải 0 123 vì **chữ số 0 không đứng đầu**. Đáp án là **1 023**. Làm xong hãy kiểm tra lại **từng điều kiện**.','**Careful!** The smallest 4-digit number with different digits is not 0123 because **0 cannot come first**. The answer is **1023**. Afterwards, check **every rule** again.') }
]},

/* ---------------- LẬP SỐ VÀ QUY TẮC ĐẾM ---------------- */
count:{ memo:LT('VÀ thì nhân, HOẶC thì cộng; số đầu không là 0; đã dùng rồi thì bớt đi.','AND means multiply, OR means add; the first digit is not 0; a used digit is not available again.'),
pages:[
{ svg:()=>TH.svg(150,shirt(30,24,'rose')+shirt(105,24,'sky')+T(90,112,'2 áo','2 shirts',{s:17})+pants(200,24,'green')+pants(255,24,'yellow')+pants(310,24,'lilac')+T(260,112,'3 quần','3 pants',{s:17})),
  say:LT('Mai có **2 cái áo** và **3 cái quần**. Mai mặc **một áo với một quần**. Hỏi Mai có bao nhiêu **cách** mặc khác nhau?','Mai has **2 shirts** and **3 pairs of pants**. She wears **one shirt with one pair of pants**. How many different **ways** can she dress?') },
{ svg:()=>{var sh=['rose','sky'],pn=['green','yellow','lilac'],s='',i,j;for(j=0;j<3;j++)s+=pants(55+j*80+6,2,pn[j]).replace(/.*/,'')+TH.c(105+j*80,26,10,pn[j]);for(i=0;i<2;i++){s+=TH.c(40,80+i*74,10,sh[i]);for(j=0;j<3;j++){var x=70+j*80,y=48+i*74;s+=TH.r(x,y,70,64,'white',{rx:8})+TH.r(x+8,y+7,54,24,sh[i],{rx:6,sw:2})+TH.r(x+8,y+34,54,24,pn[j],{rx:6,sw:2})}}return TH.svg(225,s+T(180,214,'2 × 3 = 6 cách','2 × 3 = 6 ways',{s:20,c:'orange'}))},
  say:LT('Ghép từng áo với từng quần, ta được bảng này: **6 bộ** khác nhau. Mỗi áo ghép được với 3 quần, có 2 áo, nên làm phép nhân: **2 × 3 = 6**.','Pair each shirt with each pair of pants and we get this table: **6 different outfits**. Each shirt goes with 3 pants and there are 2 shirts, so we **multiply**: **2 × 3 = 6**.') },
{ svg:()=>TH.svg(195,T(180,20,'Các chữ số: 1, 2, 3','Digits: 1, 2, 3',{s:17})+T(100,68,'Chục','Tens',S15)+T(260,68,'Đơn vị','Ones',S15)+TH.box(45,76,110,52,LT('3 cách','3 ways'),'sky',{s:20})+T(180,110,'×','×',{s:26,c:'orange'})+TH.box(205,76,110,52,LT('3 cách','3 ways'),'mint',{s:20})+T(180,172,'3 × 3 = 9 số','3 × 3 = 9 numbers',{s:22,c:'orange'})),
  say:LT('Lập số có **2 chữ số** từ các chữ số 1, 2, 3 (được dùng lại). Hàng chục có 3 cách chọn, hàng đơn vị cũng 3 cách: 3 × 3 = **9 số**. Con thử với các chữ số 4, 5, 6, 7 (được lặp): có bao nhiêu số 2 chữ số?','Make **2-digit** numbers from the digits 1, 2, 3 (digits may repeat). The tens place has 3 choices and the ones place also 3: 3 × 3 = **9 numbers**. Try digits 4, 5, 6, 7 (repeats allowed): how many 2-digit numbers?'),
  ask:{opts:[n('8'),n('12'),n('16')],ans:n('16'),good:LT('Đúng! 4 × 4 = 16 số.','Right! 4 × 4 = 16 numbers.')} },
{ svg:()=>TH.svg(215,T(100,22,'Chục','Tens',S15)+T(260,22,'Đơn vị','Ones',S15)+TH.box(45,30,110,46,LT('3 cách','3 ways'),'sky',{s:20})+T(180,62,'×','×',{s:24,c:'orange'})+TH.box(205,30,110,46,LT('2 cách','2 ways'),'mint',{s:20})+T(260,98,'(bỏ số đã dùng)','(not the one used)',S15)+['12','13','21','23','31','32'].map(function(v,i){return TH.box(16+i*56,116,48,36,v,'sun',{s:19})}).join('')+T(180,196,'3 × 2 = 6 số','3 × 2 = 6 numbers',{s:22,c:'orange'})),
  say:LT('Nếu các chữ số phải **khác nhau**: hàng chục có 3 cách, nhưng hàng đơn vị chỉ còn **2 cách** vì một chữ số đã dùng ở hàng chục. 3 × 2 = **6 số**: 12, 13, 21, 23, 31, 32.','If the digits must be **different**: the tens place has 3 choices, but the ones place has only **2** because one digit is used in the tens. 3 × 2 = **6 numbers**: 12, 13, 21, 23, 31, 32.') },
{ svg:()=>TH.svg(200,T(180,20,'Các chữ số: 0, 3, 8, 9','Digits: 0, 3, 8, 9',{s:17})+T(57,52,'Nghìn','Thousands',S15)+T(139,52,'Trăm','Hundreds',S15)+T(221,52,'Chục','Tens',S15)+T(303,52,'Đơn vị','Ones',S15)+digs(19,60,[LT('3 cách','3 ways'),LT('3 cách','3 ways'),LT('2 cách','2 ways'),LT('1 cách','1 way')],{w:76,h:46,gap:6,s:17,fills:['orange','sky','sky','sky']})+T(57,128,'bỏ số 0','not 0',S15,{c:'red'})+T(139,128,'3 còn lại','3 left',S15)+T(221,128,'2 còn lại','2 left',S15)+T(303,128,'1 còn lại','1 left',S15)+T(180,176,'3 × 3 × 2 × 1 = 18','3 × 3 × 2 × 1 = 18',{s:22,c:'orange'})),
  say:LT('Lập số **4 chữ số khác nhau** từ các chữ số 0, 3, 8, 9. Hàng nghìn **không được là 0** nên có 3 cách. Hàng trăm: còn 3 chữ số (kể cả 0). Rồi 2 cách, 1 cách: 3 × 3 × 2 × 1 = **18 số**. Con thử nhé: với các chữ số 0, 1, 2, lập số 3 chữ số khác nhau được mấy số?','Make **4-digit numbers with different digits** from the digits 0, 3, 8, 9. The thousands place **cannot be 0**, so 3 choices. Hundreds: 3 digits left (0 included). Then 2, then 1: 3 × 3 × 2 × 1 = **18 numbers**. Your turn: with the digits 0, 1, 2, how many 3-digit numbers with different digits?'),
  ask:{opts:[n('3'),n('4'),n('6')],ans:n('4'),good:LT('Đúng! 102, 120, 201, 210: có 4 số.','Right! 102, 120, 201, 210: 4 numbers.')} },
{ svg:()=>{var p='M'+70+' 100 Q180 ',s='';[0,45].forEach(function(c){s+=TH.path('M68 100 Q180 '+c+' 292 100','none',{sw:3.5,stroke:'blue'})});[150,195,240].forEach(function(c){s+=TH.path('M68 100 Q180 '+c+' 292 100','none',{sw:3.5,stroke:'orange'})});return TH.svg(250,s+TH.c(50,100,20,'sun')+TH.t(50,107,'A',{s:20})+TH.c(310,100,20,'mint')+TH.t(310,107,'B',{s:20})+T(180,32,'Xe buýt: 2 đường','Bus: 2 routes',{s:16,c:'blue'})+T(180,198,'Tàu hoả: 3 đường','Train: 3 routes',{s:16,c:'orange'})+T(180,238,'2 + 3 = 5 cách','2 + 3 = 5 ways',{s:20,c:'orange'}))},
  say:LT('Đi từ A đến B **bằng xe buýt hoặc bằng tàu**: chọn **một** trong hai. Có 2 đường xe buýt, 3 đường tàu nên **cộng**: 2 + 3 = **5 cách**. Chọn 1 món: 4 cái bút hoặc 3 quyển vở. Có mấy cách?','Going from A to B **by bus or by train**: you pick **one** of the two. There are 2 bus routes and 3 train routes, so **add**: 2 + 3 = **5 ways**. Pick 1 item: 4 pens or 3 notebooks. How many ways?'),
  ask:{opts:[n('7'),n('12'),n('1')],ans:n('7'),good:LT('Đúng! Chọn một món: 4 + 3 = 7 cách.','Right! Choosing one item: 4 + 3 = 7 ways.')} },
{ svg:()=>TH.svg(200,panel(10,84,'sky',null)+T(24,44,'Việc 1 VÀ việc 2','Task 1 AND task 2',{s:18,a:'start'})+T(24,72,'làm cả hai, lần lượt','do both, one after another',{s:15,a:'start',b:false})+TH.r(220,26,118,52,'orange',{rx:26})+T(279,60,'nhân ×','multiply ×',{s:19})+panel(106,84,'mint',null)+T(24,140,'Việc 1 HOẶC việc 2','Task 1 OR task 2',{s:18,a:'start'})+T(24,168,'chỉ chọn một trong hai','pick only one of them',{s:15,a:'start',b:false})+TH.r(220,122,118,52,'yellow',{rx:26})+T(279,156,'cộng +','add +',{s:19})),
  say:LT('Mẹo nhớ: làm việc này **VÀ** việc kia thì **nhân**. Chọn việc này **HOẶC** việc kia thì **cộng**. Gặp bài đếm, con hỏi mình: là VÀ hay HOẶC?','A trick: doing one task **AND** another means **multiply**. Choosing one task **OR** another means **add**. In a counting problem, ask yourself: AND or OR?') }
]}

});
})();


/* theory_t7.js */
window.LY_THUYET = window.LY_THUYET || {};
(function () {
  var T = function (x, y, vi, en, o) { return TH.t(x, y, LT(vi, en), o); };
  var ORG = '#D9480F';
  var FILLS = ['sky', 'mint', 'sun', 'rose', 'lilac'];
  /* hàng ô số, jump = mảng nhãn cung nhảy (chuỗi) */
  function row(vals, y, o) {
    o = o || {};
    var n = vals.length, w = o.w || 44, h = o.h || 40, x0 = o.x0 == null ? 10 : o.x0, span = o.span || 340;
    var gap = n > 1 ? (span - n * w) / (n - 1) : 0, s = '';
    vals.forEach(function (v, i) {
      var x = x0 + i * (w + gap);
      var fill = (o.fills && o.fills[i]) || o.fill || 'sky';
      s += TH.box(x, y, w, h, v, fill, { s: o.s || 18 });
      if (o.jump && i < n - 1) {
        var c1 = x + w / 2, c2 = x + w + gap + w / 2, m = (c1 + c2) / 2;
        s += TH.path('M' + c1 + ' ' + y + ' Q' + m + ' ' + (y - 32) + ' ' + c2 + ' ' + y, 'none', { sw: 2.5, stroke: ORG });
        s += TH.poly(c2 + ',' + (y - 1) + ' ' + (c2 - 9) + ',' + (y - 8) + ' ' + (c2 - 2) + ',' + (y - 11), ORG, { stroke: ORG, sw: 1 });
        s += TH.t(m, y - 24, o.jump, { s: 15, c: ORG });
      }
    });
    return s;
  }
  /* so sánh Sai / Đúng. wl, rl: mảng [vi,en] */
  function cmp(h, wl, rl) {
    var s = TH.r(5, 8, 170, h - 16, 'rose', { rx: 14 }) + TH.r(185, 8, 170, h - 16, 'mint', { rx: 14 });
    s += T(90, 38, 'Sai', 'Wrong', { s: 20, c: 'red' }) + T(270, 38, 'Đúng', 'Right', { s: 20, c: '#1B8A4B' });
    wl.forEach(function (l, i) { s += T(90, 72 + i * 27, l[0], l[1], { s: 15 }); });
    rl.forEach(function (l, i) { s += T(270, 72 + i * 27, l[0], l[1], { s: 15 }); });
    return s;
  }
  function A(q, opts, ai, good) {
    return {
      q: LT(q[0], q[1]),
      opts: opts.map(function (o) { return LT(o[0], o[1]); }),
      ans: LT(opts[ai][0], opts[ai][1]),
      good: LT(good[0], good[1])
    };
  }
  function N(x) { return [x, x]; }
  /* ô chữ số */
  function digs(cx, y, str, fill, w, h, s) {
    w = w || 30; h = h || 38;
    var n = str.length, tot = n * w + (n - 1) * 4, x = cx - tot / 2, out = '';
    for (var i = 0; i < n; i++) out += TH.box(x + i * (w + 4), y, w, h, str[i], (typeof fill === 'object' ? fill[i] : fill), { s: s || 22, rx: 6 });
    return out;
  }
  /* hai dòng chữ trong hộp */
  function two(x, y, w, h, a, b, fill) {
    return TH.r(x, y, w, h, fill, { rx: 12 }) + T(x + w / 2, y + h / 2 - 3, a[0], a[1], { s: 15 }) + T(x + w / 2, y + h / 2 + 17, b[0], b[1], { s: 15 });
  }

  Object.assign(window.LY_THUYET, {

    /* ================= DÃY SỐ CÁCH ĐỀU ================= */
    seq: {
      memo: LT('Số lần nhảy = thứ tự − 1. Số số hạng = số khoảng + 1.', 'Jumps = position − 1. Number of terms = gaps + 1.'),
      pages: [
        { /* 1 cầu thang */
          svg: function () {
            var vals = [2, 5, 8, 11, 14], s = '';
            for (var i = 0; i < 5; i++) {
              var hg = 34 + i * 26, top = 200 - hg, x = 20 + i * 64;
              s += TH.r(x, top, 64, hg, FILLS[i], { rx: 4 });
              s += TH.t(x + 32, top + 28, vals[i], { s: 24 });
              if (i < 4) {
                var t2 = 200 - (34 + (i + 1) * 26);
                s += TH.arr(x + 32, top - 8, x + 96 - 6, t2 - 8, { c: ORG, w: 2.5 });
                s += TH.t(x + 66, t2 - 20, '+3', { s: 16, c: ORG });
              }
            }
            return TH.svg(215, s);
          },
          say: LT('Cầu thang có các bậc đánh số 2, 5, 8, 11, 14. Mỗi bậc cao hơn bậc trước đúng 3. Dãy số mà mỗi số hơn số trước một lượng **bằng nhau** gọi là [[dãy số cách đều]].',
            'A staircase has steps numbered 2, 5, 8, 11, 14. Each step is exactly 3 higher than the one before. A list where each number grows by the **same amount** is called an [[equally spaced sequence]].')
        },
        { /* 2 tìm quy luật */
          svg: function () {
            var s = row([4, 9, 14, 19, 24, '?'], 80, { w: 44, fills: ['sky', 'sky', 'sky', 'sky', 'sky', 'yellow'], jump: '+5' });
            s += T(180, 160, '9 − 4 = 5     14 − 9 = 5', '9 − 4 = 5     14 − 9 = 5', { s: 18 });
            s += T(180, 192, 'số sau trừ số trước', 'next number minus the one before', { s: 15 });
            return TH.svg(210, s);
          },
          say: LT('Muốn tìm quy luật, con lấy **số sau trừ số trước**. Ở đây lần nào cũng được 5, nên dãy cứ cộng thêm 5. Số tiếp theo là gì?',
            'To find the rule, take the **next number minus the one before**. Here it is always 5, so the list adds 5 each time. What comes next?'),
          ask: A(['Số thay cho dấu ? là…', 'The number for ? is…'], [N('28'), N('29'), N('30')], 1, ['Đúng rồi! 24 + 5 = 29.', 'Right! 24 + 5 = 29.'])
        },
        { /* 3 số thứ 4 */
          svg: function () {
            var s = row([2, 5, 8, 11], 60, { w: 56, h: 44, s: 22, jump: '+3', fills: ['sky', 'mint', 'sun', 'rose'] });
            var xs = [38, 132.7, 227.3, 322], idx = [['thứ 1', '1st'], ['thứ 2', '2nd'], ['thứ 3', '3rd'], ['thứ 4', '4th']];
            for (var i = 0; i < 4; i++) s += T(xs[i], 126, idx[i][0], idx[i][1], { s: 15 });
            s += TH.brace(38, 322, 138, null);
            s += T(180, 176, '3 lần nhảy: từ số thứ 1 đến số thứ 4', '3 jumps: from the 1st to the 4th', { s: 15 });
            return TH.svg(195, s);
          },
          say: LT('Số thứ 4 là 11. Từ số thứ 1 đến số thứ 4 con nhảy **3 lần**, mỗi lần +3. Vậy số thứ 4 = 2 + 3 × 3 = 11. Số lần nhảy luôn **ít hơn thứ tự 1**.',
            'The 4th number is 11. From the 1st to the 4th you make **3 jumps** of +3. So the 4th = 2 + 3 × 3 = 11. The number of jumps is always **one less than the position**.')
        },
        { /* 4 công thức số thứ 10 */
          svg: function () {
            var s = '';
            s += T(36, 40, 'đầu', 'first', { s: 15 }) + T(116, 40, 'nhảy', 'jumps', { s: 15 }) + T(196, 40, 'bước', 'step', { s: 15 }) + T(300, 40, 'số thứ 10', '10th term', { s: 15 });
            s += TH.box(10, 50, 52, 44, '2', 'sky', { s: 22 }) + T(76, 82, '+', '+', { s: 24 });
            s += TH.box(90, 50, 52, 44, '9', 'sun', { s: 22 }) + T(156, 82, '×', '×', { s: 24 });
            s += TH.box(170, 50, 52, 44, '3', 'rose', { s: 22 }) + T(238, 82, '=', '=', { s: 24 });
            s += TH.box(252, 50, 98, 44, '29', 'mint', { s: 24 });
            s += TH.arr(116, 130, 116, 100, { c: ORG });
            s += T(116, 152, '9 = 10 − 1', '9 = 10 − 1', { s: 17 });
            s += T(116, 176, 'dãy 2; 5; 8; 11; …', 'list 2; 5; 8; 11; …', { s: 15 });
            return TH.svg(195, s);
          },
          say: LT('Muốn tìm số thứ 10: số đầu là 2, nhảy **9 lần** (10 − 1), mỗi lần +3. Số thứ 10 = 2 + 9 × 3 = 29.\nCông thức: số thứ n = số đầu + (n − 1) × bước.',
            'To find the 10th number: start at 2, make **9 jumps** (10 − 1) of +3. 10th = 2 + 9 × 3 = 29.\nRule: the nth number = first + (n − 1) × step.')
        },
        { /* 5 cọc hàng rào */
          svg: function () {
            var s = '', xs = [50, 140, 230, 320], i;
            s += TH.r(50, 78, 270, 10, 'gray', { rx: 3, sw: 2 }) + TH.r(50, 108, 270, 10, 'gray', { rx: 3, sw: 2 });
            for (i = 0; i < 4; i++) {
              s += TH.r(xs[i] - 9, 58, 18, 90, 'orange', { rx: 5 });
              s += TH.c(xs[i], 36, 16, 'pink') + TH.t(xs[i], 43, i + 1, { s: 18 });
            }
            for (i = 0; i < 3; i++) s += TH.c(xs[i] + 45, 98, 14, 'yellow') + TH.t(xs[i] + 45, 104, i + 1, { s: 16 });
            s += T(180, 178, '4 cọc = 3 khoảng + 1', '4 posts = 3 gaps + 1', { s: 18 });
            s += T(180, 208, 'Số số hạng = (cuối − đầu) : bước + 1', 'Terms = (last − first) ÷ step + 1', { s: 15 });
            return TH.svg(225, s);
          },
          say: LT('Dãy 5; 10; 15; …; 50 có bao nhiêu số? Giống đếm cọc hàng rào: đếm **khoảng** trước rồi **cộng thêm 1**. Khoảng: (50 − 5) : 5 = 9. Số số hạng: 9 + 1 = 10.',
            'How many numbers are in 5; 10; 15; …; 50? Count like fence posts: count the **gaps**, then **add 1**. Gaps: (50 − 5) ÷ 5 = 9. Terms: 9 + 1 = 10.')
        },
        { /* 6 tổng */
          svg: function () {
            var s = row([1, 2, 3, 4, 5], 36, { w: 50, fill: 'sky' }) + row([10, 9, 8, 7, 6], 116, { w: 50, fill: 'rose' });
            for (var i = 0; i < 5; i++) {
              var cx = 10 + i * (50 + 22.5) + 25;
              s += TH.l(cx, 78, cx, 114, { w: 2, dash: '4 4' });
              s += T(cx + 16, 102, '11', '11', { s: 15, c: ORG });
            }
            s += T(180, 192, '5 cặp × 11 = 55', '5 pairs × 11 = 55', { s: 20 });
            return TH.svg(210, s);
          },
          say: LT('Tính 1 + 2 + … + 10: ghép số đầu với số cuối, mỗi cặp được 11. Có 10 : 2 = 5 cặp nên tổng là 5 × 11 = 55.\nTổng = (đầu + cuối) × số số hạng : 2.',
            'Add 1 + 2 + … + 10: pair the first with the last, each pair makes 11. There are 10 ÷ 2 = 5 pairs, so the sum is 5 × 11 = 55.\nSum = (first + last) × number of terms ÷ 2.'),
          ask: A(['1 + 2 + 3 + 4 + 5 + 6 = ?', '1 + 2 + 3 + 4 + 5 + 6 = ?'], [N('21'), N('18'), N('42')], 0, ['Đúng! 3 cặp, mỗi cặp 7: 3 × 7 = 21.', 'Right! 3 pairs of 7: 3 × 7 = 21.'])
        },
        { /* 7 cẩn thận */
          svg: function () {
            return TH.svg(170, cmp(170,
              [['Từ 3 đến 30, bước 3', 'From 3 to 30, step 3'], ['(30 − 3) : 3 = 9', '(30 − 3) ÷ 3 = 9'], ['9 số? Thiếu số đầu!', '9 terms? Forgot one!']],
              [['(30 − 3) : 3 = 9', '(30 − 3) ÷ 3 = 9'], ['9 khoảng, thêm 1:', '9 gaps, add 1:'], ['9 + 1 = 10 số', '9 + 1 = 10 terms']]));
          },
          say: LT('Cẩn thận! Số khoảng cách chưa phải là số số hạng. Nhớ **cộng thêm 1**, giống 4 cọc chỉ có 3 khoảng.',
            'Careful! The number of gaps is not the number of terms. Remember to **add 1**, just like 4 posts have only 3 gaps.'),
          ask: A(['Dãy 2; 4; 6; …; 20 có mấy số?', 'How many numbers are in 2; 4; 6; …; 20?'], [N('9'), N('10'), N('11')], 1, ['Đúng! (20 − 2) : 2 + 1 = 10.', 'Right! (20 − 2) ÷ 2 + 1 = 10.'])
        }
      ]
    },

    /* ================= ĐẾM CHỮ SỐ ================= */
    digits: {
      memo: LT('Chia nhóm 1, 2, 3 chữ số → đếm số số → nhân → cộng.', 'Split into 1, 2, 3-digit groups → count numbers → multiply → add.'),
      pages: [
        { /* 1 số trang */
          svg: function () {
            var s = '', xs = [10, 130, 250], ns = ['7', '23', '145'], fl = ['sky', 'mint', 'rose'], lb = [['1 chữ số', '1 digit'], ['2 chữ số', '2 digits'], ['3 chữ số', '3 digits']];
            for (var i = 0; i < 3; i++) {
              s += TH.r(xs[i], 28, 100, 100, fl[i], { rx: 10 });
              s += T(xs[i] + 50, 52, 'trang', 'page', { s: 15 });
              s += digs(xs[i] + 50, 66, ns[i], 'white', 26, 38, 22);
              s += T(xs[i] + 50, 156, lb[i][0], lb[i][1], { s: 16 });
            }
            return TH.svg(172, s);
          },
          say: LT('Khi đánh số trang, người ta viết từng **chữ số**. Trang 7 cần 1 chữ số, trang 23 cần 2, trang 145 cần 3. Số càng dài thì càng tốn nhiều chữ số.',
            'To number the pages of a book, we write **digits** one by one. Page 7 needs 1 digit, page 23 needs 2, page 145 needs 3. The longer the number, the more digits it uses.')
        },
        { /* 2 nhóm */
          svg: function () {
            var s = '', rs = [['1 → 9', 'sky', 'mỗi số: 1 chữ số', 'each: 1 digit'], ['10 → 99', 'mint', 'mỗi số: 2 chữ số', 'each: 2 digits'], ['100 → 999', 'rose', 'mỗi số: 3 chữ số', 'each: 3 digits']];
            for (var i = 0; i < 3; i++) {
              var y = 24 + i * 62;
              s += TH.box(10, y, 135, 44, rs[i][0], rs[i][1], { s: 20 });
              s += TH.arr(150, y + 22, 185, y + 22, {});
              s += T(192, y + 28, rs[i][2], rs[i][3], { s: 16, a: 'start' });
            }
            return TH.svg(215, s);
          },
          say: LT('Ta chia các số thành **nhóm** theo độ dài: số có 1 chữ số (1–9), có 2 chữ số (10–99), có 3 chữ số (100–999). Cùng nhóm thì mỗi số tốn số chữ số bằng nhau.',
            'We split the numbers into **groups** by length: 1-digit numbers (1–9), 2-digit numbers (10–99), 3-digit numbers (100–999). In one group every number uses the same count of digits.')
        },
        { /* 3 đếm số số */
          svg: function () {
            var s = row([3, 4, 5, 6, 7], 30, { w: 48, fill: 'sky' });
            s += TH.brace(10, 350, 80, null);
            s += T(180, 124, '7 − 3 + 1 = 5 số', '7 − 3 + 1 = 5 numbers', { s: 20 });
            s += T(180, 168, '10 → 99:  99 − 10 + 1 = 90 số', '10 → 99:  99 − 10 + 1 = 90 numbers', { s: 16 });
            return TH.svg(190, s);
          },
          say: LT('Có bao nhiêu số từ 3 đến 7? Là 7 − 3 + 1 = 5 số (nhớ **cộng thêm 1**!). Tương tự từ 10 đến 99 có 99 − 10 + 1 = 90 số.',
            'How many numbers from 3 to 7? 7 − 3 + 1 = 5 numbers (remember to **add 1**!). In the same way, from 10 to 99 there are 99 − 10 + 1 = 90 numbers.')
        },
        { /* 4 ví dụ 238 trang */
          svg: function () {
            var s = '', rs = [['1 → 9', 'sky', '9 × 1 = 9'], ['10 → 99', 'mint', '90 × 2 = 180'], ['100 → 238', 'rose', '139 × 3 = 417']];
            for (var i = 0; i < 3; i++) {
              var y = 14 + i * 50;
              s += TH.box(10, y, 130, 40, rs[i][0], rs[i][1], { s: 18 });
              s += TH.arr(145, y + 20, 170, y + 20, {});
              s += TH.t(180, y + 27, rs[i][2], { s: 19, a: 'start' });
            }
            s += TH.box(30, 168, 300, 44, LT('9 + 180 + 417 = 606 chữ số', '9 + 180 + 417 = 606 digits'), 'mint', { s: 18, sw: 3 });
            return TH.svg(228, s);
          },
          say: LT('Sách dày 238 trang. Nhóm 1 chữ số: 9 số, dùng 9 chữ số. Nhóm 2 chữ số: 90 số, dùng 180. Nhóm 3 chữ số: từ 100 đến 238 có 238 − 100 + 1 = 139 số, dùng 417. Cộng lại: 606 chữ số.',
            'A book has 238 pages. 1-digit group: 9 numbers, 9 digits. 2-digit group: 90 numbers, 180 digits. 3-digit group: from 100 to 238 there are 238 − 100 + 1 = 139 numbers, 417 digits. Total: 606 digits.')
        },
        { /* 5 hỏi 99 trang */
          svg: function () {
            var s = TH.tape(10, 36, 340, 50, [{ u: 1, f: 'sky', t: '9 × 1' }, { u: 2.5, f: 'mint', t: '90 × 2' }]);
            s += T(180, 22, 'trang 1–9 và trang 10–99', 'pages 1–9 and pages 10–99', { s: 15 });
            s += TH.brace(10, 350, 92, null);
            s += T(180, 142, '? chữ số', '? digits', { s: 22 });
            return TH.svg(165, s);
          },
          say: LT('Thử sức: quyển sách dày 99 trang. Cần bao nhiêu chữ số? Sách chỉ có nhóm 1 chữ số và nhóm 2 chữ số, **không có** nhóm 3 chữ số.',
            'Your turn: a book has 99 pages. How many digits are needed? The book has only the 1-digit and 2-digit groups, **no** 3-digit group.'),
          ask: A(['Cần bao nhiêu chữ số?', 'How many digits are needed?'], [N('189'), N('198'), N('99')], 0, ['Đúng! 9 + 90 × 2 = 189.', 'Right! 9 + 90 × 2 = 189.'])
        },
        { /* 6 ngược: biết số chữ số */
          svg: function () {
            var s = TH.tape(10, 30, 340, 46, [{ u: 189, f: 'sky', t: '189' }, { u: 45, f: 'rose', t: '45' }]);
            s += T(125, 22, 'trang 1–99', 'pages 1–99', { s: 15 });
            s += T(320, 22, 'còn lại', 'left', { s: 15 });
            s += TH.brace(10, 350, 82, '234');
            s += T(180, 150, '234 − 189 = 45 chữ số', '234 − 189 = 45 digits', { s: 17 });
            s += T(180, 176, '45 : 3 = 15 trang (từ trang 100)', '45 ÷ 3 = 15 pages (from page 100)', { s: 17 });
            s += TH.box(60, 190, 240, 40, LT('99 + 15 = 114 trang', '99 + 15 = 114 pages'), 'mint', { s: 18 });
            return TH.svg(245, s);
          },
          say: LT('Ngược lại: dùng 234 chữ số thì sách có mấy trang? Trang 1–99 đã dùng 189 chữ số. Còn 234 − 189 = 45 chữ số, mỗi trang 3 chữ số nên được 45 : 3 = 15 trang nữa. Tổng 99 + 15 = 114 trang.',
            'Backwards: if 234 digits were used, how many pages? Pages 1–99 used 189 digits. 234 − 189 = 45 digits are left, 3 per page, so 45 ÷ 3 = 15 more pages. Total 99 + 15 = 114 pages.')
        },
        { /* 7 cẩn thận */
          svg: function () {
            return TH.svg(170, cmp(170,
              [['Từ 10 đến 99', 'From 10 to 99'], ['99 − 10 = 89 số', '99 − 10 = 89 numbers'], ['thiếu số 10!', 'forgot number 10!']],
              [['Từ 10 đến 99', 'From 10 to 99'], ['99 − 10 + 1 = 90', '99 − 10 + 1 = 90'], ['đủ 90 số', 'all 90 numbers']]));
          },
          say: LT('Cẩn thận! Đếm số số từ 10 đến 99 là 99 − 10 **+ 1** = 90, đừng quên +1. Rồi nhớ nhân với số chữ số của nhóm đó.',
            'Careful! The count from 10 to 99 is 99 − 10 **+ 1** = 90, so never forget the +1. Then multiply by the number of digits of that group.'),
          ask: A(['Từ 100 đến 120 có bao nhiêu số?', 'How many numbers from 100 to 120?'], [N('20'), N('21'), N('22')], 1, ['Đúng! 120 − 100 + 1 = 21.', 'Right! 120 − 100 + 1 = 21.'])
        }
      ]
    },

    /* ================= TÌM x ================= */
    findx: {
      memo: LT('Tìm x thì làm phép tính ngược lại, rồi thử lại.', 'To find x, do the opposite operation, then check.'),
      pages: [
        { /* 1 túi kẹo bí ẩn */
          svg: function () {
            var s = T(100, 36, 'có sẵn', 'already have', { s: 15 }) + T(262, 36, 'túi kẹo bí ẩn', 'mystery bag', { s: 15 });
            s += TH.tape(10, 46, 340, 50, [{ u: 5, f: 'sky', t: '5' }, { u: 3, f: 'yellow', t: 'x' }]);
            s += TH.brace(10, 350, 104, null);
            s += T(180, 150, 'tất cả: 8', 'all together: 8', { s: 18 });
            s += T(180, 178, '5 + x = 8   →   x = 8 − 5 = 3', '5 + x = 8   →   x = 8 − 5 = 3', { s: 18 });
            return TH.svg(195, s);
          },
          say: LT('Con có 5 viên kẹo, mẹ cho thêm một túi kẹo bí ẩn. Giờ có 8 viên. Chữ **x** là số viên trong túi, một **số chưa biết**. Con tính: x = 8 − 5 = 3.',
            'You have 5 candies and Mom gives you a mystery bag. Now you have 8. The letter **x** is the number in the bag, an **unknown number**. So x = 8 − 5 = 3.')
        },
        { /* 2 phép cộng */
          svg: function () {
            var s = T(100, 36, 'x', 'x', { s: 18 }) + T(262, 36, 'số đã biết', 'known', { s: 15 });
            s += TH.tape(10, 46, 340, 50, [{ u: 5, f: 'yellow', t: 'x' }, { u: 3, f: 'sky', t: '12' }]);
            s += TH.brace(10, 350, 104, '40');
            s += T(180, 168, 'Số hạng chưa biết', 'Unknown addend', { s: 16 });
            s += T(180, 192, '= tổng − số hạng đã biết', '= sum − known addend', { s: 16 });
            return TH.svg(210, s);
          },
          say: LT('Tổng = số hạng + số hạng. Thiếu một số hạng thì lấy **tổng trừ số hạng kia**.\nVí dụ x + 12 = 40 thì x = 40 − 12 = 28.',
            'Sum = addend + addend. If one addend is missing, take the **sum minus the other addend**.\nExample: x + 12 = 40, so x = 40 − 12 = 28.')
        },
        { /* 3 phép trừ */
          svg: function () {
            var s = '';
            s += TH.box(10, 14, 130, 40, 'x − 7 = 5', 'sun', { s: 18 }) + TH.arr(145, 34, 200, 34, {}) + TH.box(205, 14, 145, 40, 'x = 5 + 7 = 12', 'mint', { s: 16 });
            s += T(180, 80, 'Số bị trừ = hiệu + số trừ', 'Minuend = difference + subtrahend', { s: 16 });
            s += TH.box(10, 108, 130, 40, '12 − x = 5', 'sun', { s: 18 }) + TH.arr(145, 128, 200, 128, {}) + TH.box(205, 108, 145, 40, 'x = 12 − 5 = 7', 'mint', { s: 16 });
            s += T(180, 174, 'Số trừ = số bị trừ − hiệu', 'Subtrahend = minuend − difference', { s: 16 });
            return TH.svg(195, s);
          },
          say: LT('Phép trừ có hai kiểu. x − 7 = 5: x là số bị trừ, ta **cộng** lại: x = 5 + 7 = 12. 12 − x = 5: x là số trừ, ta **trừ**: x = 12 − 5 = 7.',
            'Subtraction has two kinds. x − 7 = 5: x is the minuend (the number we start with), so we **add** back: x = 5 + 7 = 12. 12 − x = 5: x is the subtrahend (the number taken away), so we **subtract**: x = 12 − 5 = 7.'),
          ask: A(['x − 9 = 6. Vậy x = ?', 'x − 9 = 6. So x = ?'], [N('3'), N('15'), N('54')], 1, ['Đúng! x = 6 + 9 = 15.', 'Right! x = 6 + 9 = 15.'])
        },
        { /* 4 nhân chia */
          svg: function () {
            var s = '', rs = [['x × 4 = 20', 'x = 20 : 4 = 5', 'x = 20 ÷ 4 = 5'], ['x : 4 = 5', 'x = 5 × 4 = 20', 'x = 5 × 4 = 20'], ['20 : x = 4', 'x = 20 : 4 = 5', 'x = 20 ÷ 4 = 5']];
            var rsEn = ['x × 4 = 20', 'x ÷ 4 = 5', '20 ÷ x = 4'];
            for (var i = 0; i < 3; i++) {
              var y = 14 + i * 58;
              s += TH.box(10, y, 135, 42, LT(rs[i][0], rsEn[i]), 'sun', { s: 18 });
              s += TH.arr(150, y + 21, 195, y + 21, {});
              s += TH.box(200, y, 150, 42, LT(rs[i][1], rs[i][2]), 'mint', { s: 16 });
            }
            return TH.svg(195, s);
          },
          say: LT('Thừa số chưa biết = tích : thừa số kia. Số bị chia chưa biết = thương × số chia. Số chia chưa biết = số bị chia : thương. Cứ làm phép tính **ngược lại**!',
            'Unknown factor = product ÷ other factor. Unknown dividend = quotient × divisor. Unknown divisor = dividend ÷ quotient. Always do the **opposite** operation!')
        },
        { /* 5 biểu thức: khối */
          svg: function () {
            var s = TH.box(10, 40, 50, 44, '50', 'sky', { s: 20 }) + T(76, 72, '+', '+', { s: 22 });
            s += TH.box(92, 40, 104, 44, LT('24 : x', '24 ÷ x'), 'orange', { s: 20 }) + T(212, 72, '=', '=', { s: 22 }) + TH.box(228, 40, 50, 44, '56', 'mint', { s: 20 });
            s += TH.brace(92, 196, 92, null);
            s += T(144, 138, 'số hạng chưa biết', 'unknown addend', { s: 15 });
            s += T(180, 176, '24 : x = 56 − 50 = 6', '24 ÷ x = 56 − 50 = 6', { s: 19 });
            return TH.svg(195, s);
          },
          say: LT('Khó hơn: 50 + 24 : x = 56. Con coi [[24 : x]] là **một khối**. Khối này là số hạng chưa biết, nên 24 : x = 56 − 50 = 6.',
            'Harder: 50 + 24 ÷ x = 56. Treat [[24 ÷ x]] as **one block**. This block is the unknown addend, so 24 ÷ x = 56 − 50 = 6.')
        },
        { /* 6 giải xong + thử lại */
          svg: function () {
            var s = TH.box(80, 12, 200, 42, LT('24 : x = 6', '24 ÷ x = 6'), 'sun', { s: 19 }) + TH.arr(180, 58, 180, 82, {});
            s += TH.box(80, 86, 200, 42, LT('x = 24 : 6 = 4', 'x = 24 ÷ 6 = 4'), 'mint', { s: 19 }) + TH.arr(180, 132, 180, 156, {});
            s += TH.box(50, 160, 260, 42, LT('50 + 24 : 4 = 56', '50 + 24 ÷ 4 = 56'), 'rose', { s: 19 });
            s += T(180, 228, 'Thử lại: đúng rồi!', 'Check: it works!', { s: 17 });
            return TH.svg(245, s);
          },
          say: LT('Số chia chưa biết: x = 24 : 6 = 4. Luôn **thử lại**: thay x = 4 vào, 50 + 24 : 4 = 50 + 6 = 56. Đúng!',
            'Unknown divisor: x = 24 ÷ 6 = 4. Always **check**: put x = 4 back, 50 + 24 ÷ 4 = 50 + 6 = 56. Correct!'),
          ask: A(['x + 18 : 3 = 11. Vậy x = ?', 'x + 18 ÷ 3 = 11. So x = ?'], [N('5'), N('6'), N('11')], 0, ['Đúng! 18 : 3 = 6, x = 11 − 6 = 5.', 'Right! 18 ÷ 3 = 6, x = 11 − 6 = 5.'])
        },
        { /* 7 cẩn thận */
          svg: function () {
            return TH.svg(175, cmp(175,
              [['x − 140 : 35 = 270', 'x − 140 ÷ 35 = 270'], ['làm trừ trước:', 'subtract first:'], ['(x − 140) : 35', '(x − 140) ÷ 35']],
              [['140 : 35 = 4', '140 ÷ 35 = 4'], ['x − 4 = 270', 'x − 4 = 270'], ['x = 270 + 4 = 274', 'x = 270 + 4 = 274']]));
          },
          say: LT('Cẩn thận thứ tự: phép **chia, nhân làm trước**, cộng trừ làm sau. Ở đây 140 : 35 = 4 làm trước, rồi mới tìm x.',
            'Mind the order: **divide and multiply first**, add and subtract after. Here 140 ÷ 35 = 4 comes first, and then we find x.')
        }
      ]
    },

    /* ================= CẤU TẠO SỐ ================= */
    struct: {
      memo: LT('Chữ số ở hàng nào thì mang giá trị của hàng đó: abc = a × 100 + b × 10 + c.', 'A digit takes the value of its place: abc = a × 100 + b × 10 + c.'),
      pages: [
        { /* 1 khối */
          svg: function () {
            var s = '', i;
            s += T(60, 24, 'trăm', 'hundreds', { s: 16 }) + T(180, 24, 'chục', 'tens', { s: 16 }) + T(300, 24, 'đơn vị', 'ones', { s: 16 });
            for (i = 0; i < 3; i++) s += TH.r(14 + i * 32, 38, 28, 28, 'pink', { rx: 4, sw: 2 });
            for (i = 0; i < 4; i++) s += TH.r(147 + i * 18, 34, 12, 36, 'sky', { rx: 3, sw: 2 });
            for (i = 0; i < 5; i++) s += TH.c(258 + i * 20, 52, 8, 'mint', { sw: 2 });
            s += TH.box(38, 92, 44, 44, '3', 'pink', { s: 26 }) + TH.box(158, 92, 44, 44, '4', 'sky', { s: 26 }) + TH.box(278, 92, 44, 44, '5', 'mint', { s: 26 });
            s += TH.t(60, 80, '↓', { s: 16 }) + TH.t(180, 80, '↓', { s: 16 }) + TH.t(300, 80, '↓', { s: 16 });
            s += T(180, 178, '345 = 300 + 40 + 5', '345 = 300 + 40 + 5', { s: 20 });
            return TH.svg(195, s);
          },
          say: LT('Số 345 gồm 3 trăm, 4 chục và 5 đơn vị. Mỗi chữ số có một **vị trí**, và vị trí quyết định giá trị: 3 ở hàng trăm là 300, 4 ở hàng chục là 40.',
            'The number 345 is 3 hundreds, 4 tens and 5 ones. Each digit has a **place**, and the place decides its value: the 3 in the hundreds place is 300, the 4 in the tens place is 40.')
        },
        { /* 2 abc */
          svg: function () {
            var s = TH.box(20, 14, 70, 46, 'a', 'pink', { s: 26 }) + TH.box(145, 14, 70, 46, 'b', 'sky', { s: 26 }) + TH.box(270, 14, 70, 46, 'c', 'mint', { s: 26 });
            s += TH.arr(55, 64, 55, 92, {}) + TH.arr(180, 64, 180, 92, {}) + TH.arr(305, 64, 305, 92, {});
            s += TH.box(10, 96, 90, 38, 'a × 100', 'pink', { s: 17 }) + TH.box(135, 96, 90, 38, 'b × 10', 'sky', { s: 17 }) + TH.box(260, 96, 90, 38, 'c', 'mint', { s: 17 });
            s += T(180, 176, 'abc = a × 100 + b × 10 + c', 'abc = a × 100 + b × 10 + c', { s: 17 });
            return TH.svg(195, s);
          },
          say: LT('Chữ cái a, b, c là **một chữ số** chưa biết. Số abc có a trăm, b chục, c đơn vị, nên abc = a × 100 + b × 10 + c.\nVí dụ: 345 = 3 × 100 + 4 × 10 + 5.',
            'The letters a, b, c each stand for **one unknown digit**. The number abc has a hundreds, b tens, c ones, so abc = a × 100 + b × 10 + c.\nExample: 345 = 3 × 100 + 4 × 10 + 5.')
        },
        { /* 3 thêm chữ số */
          svg: function () {
            var s = T(180, 22, 'Viết thêm 2 vào đầu số 47', 'Write 2 in front of 47', { s: 16 });
            s += digs(70, 32, '247', ['orange', 'sky', 'sky'], 40, 40, 22) + T(150, 60, '247 = 200 + 47', '247 = 200 + 47', { s: 18, a: 'start' });
            s += T(180, 108, 'Viết thêm 2 vào cuối số 47', 'Write 2 after 47', { s: 16 });
            s += digs(70, 118, '472', ['sky', 'sky', 'orange'], 40, 40, 22) + T(150, 146, '472 = 47 × 10 + 2', '472 = 47 × 10 + 2', { s: 18, a: 'start' });
            return TH.svg(175, s);
          },
          say: LT('Viết thêm chữ số 2 vào **đầu** số 47 thì được 247 = 200 + 47. Viết thêm 2 vào **cuối** thì được 472 = 47 × 10 + 2: số cũ bị đẩy sang trái một hàng nên gấp 10 lần.',
            'Write a 2 at the **front** of 47 and you get 247 = 200 + 47. Write a 2 at the **end** and you get 472 = 47 × 10 + 2: the old number moves one place left, so it becomes 10 times bigger.')
        },
        { /* 4 xoá chữ số cuối */
          svg: function () {
            var u = 340 / 10.8, parts = [], i;
            for (i = 0; i < 10; i++) parts.push({ u: 1, f: 'sky', t: 'A' });
            parts.push({ u: 0.8, f: 'rose', t: '5' });
            var s = T(180, 22, 'Xoá chữ số 5: còn lại A', 'Remove the 5: A is left', { s: 15 });
            s += TH.r(10, 30, u, 36, 'sky', { rx: 4 }) + TH.t(10 + u / 2, 55, 'A', { s: 17 });
            s += T(180, 98, 'Số cũ = 10 × A + 5', 'Old number = 10 × A + 5', { s: 15 });
            s += TH.tape(10, 108, 340, 40, parts, { s: 16 });
            s += TH.brace(10 + u, 350, 154, null);
            s += T(196, 200, 'chênh nhau = 9 × A + 5', 'difference = 9 × A + 5', { s: 16 });
            return TH.svg(220, s);
          },
          say: LT('Xoá chữ số 5 ở cuối thì số giảm 77. Gọi số còn lại là A, số cũ gồm 10 phần A và 5. Chênh nhau 9 × A + 5 = 77, nên 9 × A = 72, A = 8. Số cũ là 85.',
            'Cross out the last digit 5 and the number drops by 77. Call what is left A; the old number is 10 parts of A and 5. The difference is 9 × A + 5 = 77, so 9 × A = 72, A = 8. The old number is 85.')
        },
        { /* 5 chữ số giống nhau */
          svg: function () {
            var s = '';
            s += digs(52, 16, 'aa', 'pink', 38, 40, 22) + T(120, 44, 'aa = a × 11', 'aa = a × 11', { s: 20, a: 'start' });
            s += digs(70, 72, 'aaa', 'pink', 38, 40, 22) + T(150, 100, 'aaa = a × 111', 'aaa = a × 111', { s: 20, a: 'start' });
            s += digs(52, 128, '44', 'sky', 38, 40, 22) + T(120, 156, '44 = 4 × 11', '44 = 4 × 11', { s: 20, a: 'start' });
            s += T(180, 206, 'vì 10 × a + a = 11 × a', 'because 10 × a + a = 11 × a', { s: 15 });
            return TH.svg(225, s);
          },
          say: LT('Số có các chữ số giống nhau: aa = a × 10 + a = a × 11. Tương tự aaa = a × 111. Nhờ vậy aa × b và bb × a đều bằng 11 × a × b: **bằng nhau**!',
            'A number with repeated digits: aa = a × 10 + a = a × 11. In the same way aaa = a × 111. So aa × b and bb × a both equal 11 × a × b: they are **equal**!'),
          ask: A(['Số 66 bằng…', 'The number 66 equals…'], [['6 × 11', '6 × 11'], ['6 × 6', '6 × 6'], ['6 + 6', '6 + 6']], 0, ['Đúng! 66 = 6 × 11.', 'Right! 66 = 6 × 11.'])
        },
        { /* 6 cẩn thận */
          svg: function () {
            return TH.svg(170, cmp(170,
              [['ab = a × b', 'ab = a × b'], ['23 = 2 × 3 = 6', '23 = 2 × 3 = 6'], ['sai rồi!', 'not true!']],
              [['ab = a × 10 + b', 'ab = a × 10 + b'], ['23 = 2 × 10 + 3', '23 = 2 × 10 + 3'], ['= 20 + 3 = 23', '= 20 + 3 = 23']]));
          },
          say: LT('Cẩn thận! ab là **số có hai chữ số** (a chục, b đơn vị), không phải a nhân b. Muốn nhân thì phải viết dấu ×. Và 23 khác 32 vì vị trí khác nhau.',
            'Careful! ab is a **two-digit number** (a tens, b ones), not a times b. To multiply you must write the × sign. Also 23 is not 32, because the places are different.'),
          ask: A(['Số ab với a = 4, b = 7 là…', 'The number ab with a = 4, b = 7 is…'], [N('47'), N('28'), N('11')], 0, ['Đúng! 4 × 10 + 7 = 47.', 'Right! 4 × 10 + 7 = 47.'])
        }
      ]
    },

    /* ================= DẤU HIỆU CHIA HẾT ================= */
    divis: {
      memo: LT('2 và 5: nhìn chữ số cuối. 3 và 9: cộng các chữ số.', 'For 2 and 5, look at the last digit. For 3 and 9, add up the digits.'),
      pages: [
        { /* 1 chia kẹo */
          svg: function () {
            var s = '', pc = [[40, 90, 140], [220, 270, 320]], k, i, cx;
            s += T(90, 24, '12 viên kẹo, 3 đĩa', '12 candies, 3 plates', { s: 15 }) + T(270, 24, '13 viên kẹo, 3 đĩa', '13 candies, 3 plates', { s: 15 });
            for (k = 0; k < 2; k++) for (i = 0; i < 3; i++) {
              cx = pc[k][i];
              s += TH.c(cx, 68, 24, 'white', { sw: 2.5 });
              s += TH.c(cx - 7, 61, 5, 'orange', { sw: 1.5 }) + TH.c(cx + 7, 61, 5, 'orange', { sw: 1.5 }) + TH.c(cx - 7, 75, 5, 'orange', { sw: 1.5 }) + TH.c(cx + 7, 75, 5, 'orange', { sw: 1.5 });
            }
            s += TH.c(270, 118, 8, 'red', { sw: 1.5 });
            s += T(90, 152, 'chia hết, không dư', 'shares evenly', { s: 16, c: '#1B8A4B' }) + T(270, 152, 'dư 1 viên', '1 left over', { s: 16, c: 'red' });
            return TH.svg(168, s);
          },
          say: LT('Chia 12 viên kẹo cho 3 đĩa: mỗi đĩa 4 viên, không dư. Ta nói 12 [[chia hết]] cho 3. Chia 13 viên thì dư 1 viên, nên 13 không chia hết cho 3.',
            'Share 12 candies onto 3 plates: 4 on each, none left. We say 12 is [[divisible]] by 3. With 13 candies, 1 is left over, so 13 is not divisible by 3.')
        },
        { /* 2 dấu hiệu 2 và 5 */
          svg: function () {
            var s = T(180, 22, 'Chia hết cho 2 khi tận cùng là:', 'Divisible by 2 if the last digit is:', { s: 15 });
            s += row([0, 2, 4, 6, 8], 32, { w: 48, fill: 'sky', s: 22 });
            s += T(180, 112, 'Chia hết cho 5 khi tận cùng là:', 'Divisible by 5 if the last digit is:', { s: 15 });
            s += row([0, 5], 122, { w: 48, x0: 108, span: 144, fill: 'rose', s: 22 });
            return TH.svg(185, s);
          },
          say: LT('Muốn biết một số có chia hết cho 2 hay 5 không, **chỉ nhìn chữ số tận cùng** (chữ số bên phải nhất). Tận cùng 0, 2, 4, 6, 8 thì chia hết cho 2. Tận cùng 0 hoặc 5 thì chia hết cho 5.',
            'To test divisibility by 2 or 5, **look only at the last digit** (the one on the far right). Last digit 0, 2, 4, 6, 8 means divisible by 2. Last digit 0 or 5 means divisible by 5.'),
          ask: A(['Số nào chia hết cho 5?', 'Which number is divisible by 5?'], [N('3462'), N('7805'), N('5051')], 1, ['Đúng! 7805 tận cùng là 5.', 'Right! 7805 ends in 5.'])
        },
        { /* 3 dấu hiệu 3 và 9 */
          svg: function () {
            var s = digs(180, 10, '456', ['sky', 'mint', 'rose'], 44, 44, 24);
            s += TH.arr(180, 58, 180, 80, {});
            s += TH.box(50, 84, 260, 40, '4 + 5 + 6 = 15', 'sun', { s: 20 });
            s += TH.arr(120, 128, 90, 150, {}) + TH.arr(240, 128, 270, 150, {});
            s += two(5, 154, 170, 60, ['Chia hết', 'Divisible'], ['cho 3', 'by 3'], 'mint');
            s += two(185, 154, 170, 60, ['Không chia hết', 'Not divisible'], ['cho 9', 'by 9'], 'rose');
            return TH.svg(228, s);
          },
          say: LT('Với 3 và 9, con **cộng các chữ số** lại. 456 có 4 + 5 + 6 = 15. Tổng chia hết cho 3 thì số chia hết cho 3 (15 : 3 = 5). Tổng chia hết cho 9 thì số chia hết cho 9. 15 không chia hết cho 9, nên 456 cũng không chia hết cho 9.',
            'For 3 and 9, **add the digits**. 456 gives 4 + 5 + 6 = 15. If the sum is divisible by 3, so is the number (15 ÷ 3 = 5). If the sum is divisible by 9, so is the number. 15 is not divisible by 9, so 456 is not either.')
        },
        { /* 4 vì sao */
          svg: function () {
            var s = T(180, 24, '234 = 2 × 100 + 3 × 10 + 4', '234 = 2 × 100 + 3 × 10 + 4', { s: 17 });
            s += T(180, 56, '= 2 × (99 + 1) + 3 × (9 + 1) + 4', '= 2 × (99 + 1) + 3 × (9 + 1) + 4', { s: 17 });
            s += TH.box(10, 80, 190, 44, '2 × 99 + 3 × 9', 'mint', { s: 19 }) + T(214, 110, '+', '+', { s: 22 }) + TH.box(228, 80, 122, 44, '2 + 3 + 4', 'orange', { s: 19 });
            s += T(105, 150, 'chia hết cho 9', 'divisible by 9', { s: 16 }) + T(289, 150, 'tổng chữ số', 'digit sum', { s: 16 });
            return TH.svg(170, s);
          },
          say: LT('Vì sao? 10 = 9 + 1 và 100 = 99 + 1. Nên 234 = (2 × 99 + 3 × 9) + (2 + 3 + 4). Phần đầu luôn chia hết cho 9. Nên chỉ cần xem tổng các chữ số 2 + 3 + 4 có chia hết cho 9 không. (99 và 9 cũng chia hết cho 3, nên với 3 làm y như vậy.)',
            'Why? 10 = 9 + 1 and 100 = 99 + 1. So 234 = (2 × 99 + 3 × 9) + (2 + 3 + 4). The first part is always divisible by 9. So we only need to check whether the digit sum 2 + 3 + 4 is divisible by 9. (99 and 9 are also divisible by 3, so the rule for 3 works the same way.)')
        },
        { /* 5 tìm chữ số */
          svg: function () {
            var s = digs(180, 10, '52x', ['sky', 'mint', 'yellow'], 44, 44, 24);
            s += T(180, 94, '5 + 2 + x chia hết cho 9', '5 + 2 + x is divisible by 9', { s: 17 });
            s += T(180, 124, '5 + 2 = 7, còn thiếu 2 để thành 9', '5 + 2 = 7, we need 2 more to reach 9', { s: 15 });
            s += TH.box(70, 142, 220, 44, '522 : 9 = 58', 'mint', { s: 20 });
            return TH.svg(205, s);
          },
          say: LT('Tìm chữ số x để số 52x (x là chữ số hàng đơn vị) chia hết cho 9. Tổng các chữ số 5 + 2 + x phải chia hết cho 9. Vì 5 + 2 = 7 nên x = 2 (7 + 2 = 9). Thử: 522 : 9 = 58. Đúng!',
            'Find the digit x so that the number 52x (x is the ones digit) is divisible by 9. The digit sum 5 + 2 + x must be divisible by 9. Since 5 + 2 = 7, x = 2 (7 + 2 = 9). Check: 522 ÷ 9 = 58. Correct!')
        },
        { /* 6 cẩn thận */
          svg: function () {
            return TH.svg(170, cmp(170,
              [['12 chia hết cho 3', '12 splits by 3,'], ['nên cũng cho 9?', 'so by 9 too?'], ['sai rồi!', 'not true!']],
              [['1 + 2 = 3', '1 + 2 = 3'], ['3 chưa đủ 9, nên', '3 is less than 9, so'], ['12 chia 9 dư 3', '12 ÷ 9 leaves 3']]));
          },
          say: LT('Cẩn thận! Số chia hết cho 9 thì chia hết cho 3, nhưng **ngược lại không đúng**: 12 chia hết cho 3 mà không chia hết cho 9. Số chia hết cho cả 2 và 5 thì tận cùng là 0.',
            'Careful! A number divisible by 9 is divisible by 3, but **not the other way round**: 12 is divisible by 3 but not by 9. A number divisible by both 2 and 5 ends in 0.'),
          ask: A(['Số nào chia hết cho cả 2 và 5?', 'Which number is divisible by both 2 and 5?'], [N('25'), N('40'), N('52')], 1, ['Đúng! 40 tận cùng là 0.', 'Right! 40 ends in 0.'])
        }
      ]
    }
  });
})();

