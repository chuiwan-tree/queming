// 雀鸣：每格存"今年唱新歌的鸟占几成"。浏览器和 node 都能用。
// 每格属于一个过冬地（MAP 里的字母）。A 是山西边；A 的鸟有 q 这么多去跟 B 一起过冬。
(function(root){
const MAPS={
 '直':[
 'AAAAAABBBBBBCCCCCDDDDDDEEEEEEE',
 'AAAAAABBBBBBCCCCCDDDDDDEEEEEEE',
 'AAAAAABBBBBBCCCCCDDDDDDEEEEEEE',
 'AAAAAABBBBBBCCCCCDDDDDDEEEEEEE',
 'AAAAAABBBBBBCCCCCDDDDDDEEEEEEE',
 'AAAAAABBBBBBCCCCCDDDDDDEEEEEEE',
 'AAAAAABBBBBBCCCCCDDDDDDEEEEEEE',
 'AAAAAABBBBBBCCCCCDDDDDDEEEEEEE',
 'AAAAAABBBBBBCCCCCDDDDDDEEEEEEE',
 'AAAAAABBBBBBCCCCCDDDDDDEEEEEEE',
 'AAAAAABBBBBBCCCCCDDDDDDEEEEEEE',
 'AAAAAABBBBBBCCCCCDDDDDDEEEEEEE'],
 '真':Array.from({length:12},()=>'AAAAAA'+'BBBBBBBBBBBBBBBB'+'EEEEEEEE'),
 '弯':[
 'AAAAAABBBBBBBBBCCCCCCCEEEEEEEE',
 'AAAAAABBBBBBBBCCCCCCCCEEEEEEEE',
 'AAAAAABBBBBBBCCCCCCCCCEEEEEEEE',
 'AAAAAABBBBBBCCCCCCCCCDEEEEEEEE',
 'AAAAAABBBBBBCCCCCCCCDDDEEEEEEE',
 'AAAAAABBBBBBCCCCCCCDDDDDEEEEEE',
 'AAAAAABBBBBBBCCCCDDDDDDDEEEEEE',
 'AAAAAABBBBBBBBCCDDDDDDDDDEEEEE',
 'AAAAAABBBBBBBBBDDDDDDDDDDEEEEE',
 'AAAAAABBBBBBBBBDDDDDDDDDDDEEEE',
 'AAAAAABBBBBBBBBBDDDDDDDDDDEEEE',
 'AAAAAABBBBBBBBBBDDDDDDDDDDDEEE']
};
const W=30,H=12,ROCK=6;
let MAP=MAPS['直'];
const KEYS='ABCDE', NB=KEYS.length;
function reg(x,y){return KEYS.indexOf(MAP[y][x]);}
function useMap(name){MAP=MAPS[name];api.MAP=MAP;}
const P0={w:0.32,c:1.6,a:1,surv:0.5,q:0.4,leak:0.05};
function fresh(){const f=[];for(let y=0;y<H;y++){const r=[];for(let x=0;x<W;x++)r.push(x<ROCK?1:0);f.push(r);}return f;}
function pools(f,P){
  const s=new Array(NB).fill(0),n=new Array(NB).fill(0);
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const b=reg(x,y),v=f[y][x];
    if(b===0){s[0]+=v*(1-P.q);n[0]+=1-P.q;s[1]+=v*P.q;n[1]+=P.q;}else{s[b]+=v;n[b]+=1;}}
  return s.map((v,i)=>n[i]?v/n[i]:0);
}
function step(f,P){
  const pm=pools(f,P),out=[];
  for(let y=0;y<H;y++){const r=[];for(let x=0;x<W;x++){
    let tot=2,acc=2*f[y][x];
    for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const xx=x+dx,yy=y+dy;
      if(xx>=0&&xx<W&&yy>=0&&yy<H){const wt=((x<ROCK)!==(xx<ROCK))?P.leak:1;acc+=wt*f[yy][xx];tot+=wt;}}
    const loc=acc/tot,b=reg(x,y);
    const wp=b===0?pm[0]*(1-P.q)+pm[1]*P.q:pm[b];
    const h=(1-P.w)*loc+P.w*wp;
    const X=Math.pow(h,P.c)*(1+P.a),Z=Math.pow(1-h,P.c);
    const p=X+Z>0?X/(X+Z):0;
    r.push(P.surv*f[y][x]+(1-P.surv)*p);
  }out.push(r);}
  return out;
}
function blow(f,bx,by){for(let y=by-1;y<=by+1;y++)for(let x=bx-1;x<=bx+1;x++)if(x>=0&&x<W&&y>=0&&y<H)f[y][x]=Math.max(f[y][x],0.95);}
function colmean(f,x){let s=0;for(let y=0;y<H;y++)s+=f[y][x];return s/H;}
const api={W,H,ROCK,NB,KEYS,MAPS,MAP,useMap,P0,reg,fresh,pools,step,blow,colmean};
if(typeof module!=='undefined')module.exports=api;else root.Que=api;
})(this);
