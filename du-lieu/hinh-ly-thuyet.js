/* Thư viện vẽ hình minh hoạ lý thuyết (SVG chuỗi). Dùng: TH.svg(180, TH.t(180,40,"Xin chào")+TH.dots(5,40,100,{color:TH.C.blue})) */
(function(){
var C={ink:'#1F2A44',yellow:'#FFD23F',orange:'#FF8A3D',green:'#5CC98B',blue:'#4DA3FF',pink:'#FF6F91',purple:'#A78BFA',teal:'#2EC4B6',sky:'#BFDDFF',mint:'#BFEBD3',rose:'#FFC2D1',sun:'#FFF0A8',gray:'#EDE7D8',white:'#FFFFFF',red:'#E5484D',lilac:'#E3D7FF'};
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
function col(c){return C[c]||c||'none'}
var TH={C:C,esc:esc};
/* khung hình: rộng 360, cao h */
TH.svg=function(h,inner){return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 '+h+'" role="img" font-family="inherit">'+inner+'</svg>'};
/* chữ. o: s=cỡ(mặc định 18) c=màu a=start|middle|end b=đậm */
TH.t=function(x,y,txt,o){o=o||{};return '<text x="'+x+'" y="'+y+'" font-size="'+(o.s||18)+'" fill="'+col(o.c||'ink')+'" text-anchor="'+(o.a||'middle')+'" font-weight="'+(o.b===false?500:800)+'"'+(o.rot?' transform="rotate('+o.rot+' '+x+' '+y+')"':'')+'>'+esc(window.LANG==='en'?String(txt).replace(/ : /g,' ÷ '):txt)+'</text>'};
TH.r=function(x,y,w,h,fill,o){o=o||{};return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+(o.rx==null?8:o.rx)+'" fill="'+col(fill)+'" stroke="'+col(o.stroke||'ink')+'" stroke-width="'+(o.sw==null?2.5:o.sw)+'"'+(o.dash?' stroke-dasharray="'+o.dash+'"':'')+(o.op!=null?' opacity="'+o.op+'"':'')+'/>'};
TH.c=function(cx,cy,r,fill,o){o=o||{};return '<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="'+col(fill)+'" stroke="'+col(o.stroke||'ink')+'" stroke-width="'+(o.sw==null?2.5:o.sw)+'"'+(o.op!=null?' opacity="'+o.op+'"':'')+'/>'};
TH.l=function(x1,y1,x2,y2,o){o=o||{};return '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="'+col(o.c||'ink')+'" stroke-width="'+(o.w||2.5)+'" stroke-linecap="round"'+(o.dash?' stroke-dasharray="'+o.dash+'"':'')+'/>'};
TH.poly=function(pts,fill,o){o=o||{};return '<polygon points="'+pts+'" fill="'+col(fill)+'" stroke="'+col(o.stroke||'ink')+'" stroke-width="'+(o.sw==null?2.5:o.sw)+'" stroke-linejoin="round"'+(o.op!=null?' opacity="'+o.op+'"':'')+'/>'};
TH.path=function(d,fill,o){o=o||{};return '<path d="'+d+'" fill="'+col(fill)+'" stroke="'+col(o.stroke||'ink')+'" stroke-width="'+(o.sw==null?2.5:o.sw)+'" stroke-linecap="round" stroke-linejoin="round"'+(o.dash?' stroke-dasharray="'+o.dash+'"':'')+'/>'};
/* mũi tên từ (x1,y1) đến (x2,y2) */
TH.arr=function(x1,y1,x2,y2,o){o=o||{};var c=col(o.c||'ink'),a=Math.atan2(y2-y1,x2-x1),h=o.h||10,p1=[x2-h*Math.cos(a-.45),y2-h*Math.sin(a-.45)],p2=[x2-h*Math.cos(a+.45),y2-h*Math.sin(a+.45)];return TH.l(x1,y1,x2,y2,{c:o.c,w:o.w,dash:o.dash})+'<polygon points="'+x2+','+y2+' '+p1.join(',')+' '+p2.join(',')+'" fill="'+c+'"/>'};
/* ô chữ nhật có chữ ở giữa */
TH.box=function(x,y,w,h,txt,fill,o){o=o||{};return TH.r(x,y,w,h,fill,o)+TH.t(x+w/2,y+h/2+(o.s||18)*.35,txt,{s:o.s,c:o.tc})};
/* n chấm tròn xếp hàng (perRow chấm mỗi hàng) bắt đầu tại (x,y) là tâm chấm đầu */
TH.dots=function(n,x,y,o){o=o||{};var r=o.r||9,g=o.gap||(r*2+5),pr=o.perRow||n,s='';for(var i=0;i<n;i++){s+=TH.c(x+(i%pr)*g,y+Math.floor(i/pr)*g,r,o.color||'blue',{sw:o.sw==null?2:o.sw})}return s};
/* thanh sơ đồ đoạn thẳng: parts=[{u:độ dài tương đối, f:màu, t:chữ trong ô}] */
TH.tape=function(x,y,w,h,parts,o){o=o||{};var tot=parts.reduce(function(a,p){return a+p.u},0),cx=x,s='';parts.forEach(function(p){var pw=w*p.u/tot;s+=TH.r(cx,y,pw,h,p.f||'sky',{rx:o.rx==null?4:o.rx,dash:p.dash});if(p.t!=null)s+=TH.t(cx+pw/2,y+h/2+6,p.t,{s:o.s||17});cx+=pw});return s};
/* dấu ngoặc nhọn phía dưới đoạn [x1,x2] tại y, kèm nhãn */
TH.brace=function(x1,x2,y,label,o){o=o||{};var m=(x1+x2)/2;return TH.path('M'+x1+' '+y+' Q'+x1+' '+(y+9)+' '+(x1+10)+' '+(y+9)+' L'+(m-8)+' '+(y+9)+' Q'+m+' '+(y+9)+' '+m+' '+(y+16)+' Q'+m+' '+(y+9)+' '+(m+8)+' '+(y+9)+' L'+(x2-10)+' '+(y+9)+' Q'+x2+' '+(y+9)+' '+x2+' '+y,'none',{sw:2.5,stroke:o.c})+(label!=null?TH.t(m,y+38,label,{s:o.s||17,c:o.tc}):'')};
/* tia số từ x0 đến x1 tại y; vạch từ giá trị min..max bước step; marks=[{v,t,c}] đánh dấu */
TH.nline=function(x0,x1,y,min,max,step,o){o=o||{};var s=TH.arr(x0-8,y,x1+8,y,{w:3}),k=(x1-x0)/(max-min);for(var v=min;v<=max+1e-9;v+=step){var x=x0+(v-min)*k;s+=TH.l(x,y-7,x,y+7,{w:2.5});if(!o.nolabel)s+=TH.t(x,y+28,(o.fmt?o.fmt(v):v),{s:o.s||15})}(o.marks||[]).forEach(function(m){var x=x0+(m.v-min)*k;s+=TH.c(x,y,8,m.c||'orange');if(m.t!=null)s+=TH.t(x,y-16,m.t,{s:o.s||16,c:m.c||'ink'})});return s};
/* hình tròn chia n phần, tô k phần (hình quạt), tâm (cx,cy) bán kính r */
TH.pie=function(cx,cy,r,n,k,o){o=o||{};var s=TH.c(cx,cy,r,o.bg||'white');for(var i=0;i<n;i++){var a0=-Math.PI/2+i*2*Math.PI/n,a1=-Math.PI/2+(i+1)*2*Math.PI/n;if(i<k){var d='M'+cx+' '+cy+' L'+(cx+r*Math.cos(a0)).toFixed(2)+' '+(cy+r*Math.sin(a0)).toFixed(2)+' A'+r+' '+r+' 0 '+((a1-a0)>Math.PI?1:0)+' 1 '+(cx+r*Math.cos(a1)).toFixed(2)+' '+(cy+r*Math.sin(a1)).toFixed(2)+' Z';s+=TH.path(d,o.fill||'orange',{sw:2})}}if(n>1)for(var j=0;j<n;j++){var a=-Math.PI/2+j*2*Math.PI/n;s+=TH.l(cx,cy,cx+r*Math.cos(a),cy+r*Math.sin(a),{w:2})}return s+TH.c(cx,cy,r,'none')};
/* thanh chia n phần bằng nhau, tô k phần */
TH.fbar=function(x,y,w,h,n,k,o){o=o||{};var s='',pw=w/n;for(var i=0;i<n;i++)s+=TH.r(x+i*pw,y,pw,h,i<k?(o.fill||'orange'):'white',{rx:0,sw:2});return s+TH.r(x,y,w,h,'none',{rx:3,sw:3})};
/* phân số n/d xếp dọc tại (x,y) (y là đường gạch ngang) */
TH.frac=function(x,y,n,d,o){o=o||{};var s=o.s||20,w=Math.max(String(n).length,String(d).length)*s*.62+10;return TH.t(x,y-6,n,{s:s,c:o.c})+TH.l(x-w/2,y,x+w/2,y,{c:o.c,w:2.5})+TH.t(x,y+s,d,{s:s,c:o.c})};
/* ô lưới a×b ô vuông cạnh u tại (x,y) */
TH.grid=function(x,y,a,b,u,o){o=o||{};var s='';for(var i=0;i<a;i++)for(var j=0;j<b;j++)s+=TH.r(x+j*u,y+i*u,u,u,(o.fillFn&&o.fillFn(i,j))||'white',{rx:0,sw:1.8});return s};
/* bong bóng lời nói/ghi chú */
TH.note=function(x,y,w,h,txt,o){o=o||{};return TH.r(x,y,w,h,o.fill||'sun',{rx:12})+TH.t(x+w/2,y+h/2+(o.s||17)*.35,txt,{s:o.s||17})};
window.TH=TH;
})();
