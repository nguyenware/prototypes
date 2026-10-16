/* =====================================================
   LASSO — sheepdog herding, played in short days
   ===================================================== */
const WOOL=['#f4f1ea','#2a292f','#8a6845'],RIM=['#d3ccbc','#55525e','#694c30'],FACE=['#3b3530','#121116','#4a3522'];
const DOGPAL={dark:'#17161b',light:'#f2efe6'},WOLFPAL={dark:'#5b5e69',light:'#a9acb6',eye:'#ffcf5c'};
const Lasso={
  meta:{title:'Lasso',tag:'Herd the flock, then rope one color.',second:'Penned',rules:[
    'Your finger is the sheepdog. Sheep run from it.',
    'Draw a loop of rope around sheep of one color to pen them. Crossing your own rope closes it.',
    'Pen enough sheep before sunset. Roping mixed colors pens nothing and lets 3 more in. If the field overflows, the day is lost.']},
  CAP:34,
  DAYS:[
    {goal:10,len:70,iv:1.9,start:10,tw:[],twist:null},
    {goal:14,len:75,iv:1.7,start:11,tw:['ram'],twist:'Rams arrive. They barely move away from the dog.'},
    {goal:18,len:80,iv:1.55,start:12,tw:['ram','lamb'],twist:'Lambs join the flock. They bolt when the dog gets close.'},
    {goal:20,len:80,iv:1.5,start:12,tw:['ram','lamb','mud'],twist:'Mud puddles. Muddy sheep turn brown until the dog shakes them clean.'},
    {goal:22,len:85,iv:1.45,start:12,tw:['ram','lamb','mud','wolf'],twist:'A wolf prowls the edges and scatters the flock. Chase it off with the dog.'},
    {goal:24,len:90,iv:1.4,start:12,tw:['ram','lamb','mud','wolf','dusk'],twist:'Dusk. The light fades and dark sheep hide outside the dog’s glow.'}],
  cfg(d){if(d<=6)return this.DAYS[d-1];const k=d-6;return{goal:24+3*k,len:90,iv:Math.max(0.9,1.4-0.06*k),start:12,tw:['ram','lamb','mud','wolf','dusk'],twist:'Remix day. Every twist at once, and the sheep come faster.'}},
  loadProgress(){this.unlocked=store.get('proto.lasso.day',1);this.stars=store.get('proto.lasso.stars',{});this.day=this.unlocked},
  resize(w,h){this.w=w;this.h=h;const m=Math.min(w,h);this.mr=Math.max(9,m*0.026);this.closeR=Math.max(34,m*0.075);this.flee=m*0.22;this.makeGrass();if(this.dog){this.dog.x=Math.min(w-20,this.dog.x);this.dog.y=Math.min(h-30,this.dog.y)}},
  makeGrass(){const n=Math.min(900,Math.floor(this.w*this.h/900));this.grass=[];for(let i=0;i<n;i++)this.grass.push({x:Math.random()*this.w,y:Math.random()*this.h,l:rand(3,7),k:rand(-0.5,0.5),d:Math.random()<0.5});
    this.patches=[];for(let i=0;i<9;i++)this.patches.push({x:Math.random()*this.w,y:Math.random()*this.h,r:rand(40,110)})},
  has(t){return this.cf.tw.includes(t)},
  reset(w,h){this.resize(w,h);if(this.unlocked==null)this.loadProgress();const cf=this.cf=this.cfg(this.day);
    this.motes=[];this.t=0;this.len=cf.len;this.left=cf.len;this.spawnAcc=0;this.score=0;this.penned=0;this.path=null;this.lock=false;this.ptr=null;this.parts=[];this.pops=[];this.cinches=[];this.fails=[];this.rescued=false;
    this.dog={x:w*0.5,y:h-56,a:-Math.PI/2,run:0};this.wolf=null;this.wolfT=12;
    this.puddles=[];if(this.has('mud'))for(let i=0;i<3;i++){const rx=this.mr*rand(2.6,3.6);this.puddles.push({x:rand(w*0.15,w*0.85),y:rand(100,h-100),rx,ry:rx*0.6})}
    for(let i=0;i<cf.start;i++)this.spawn(true,'ewe')},
  pickKind(){const x=Math.random();if(this.has('lamb')&&x<0.2)return'lamb';if(this.has('ram')&&x>0.85)return'ram';return'ewe'},
  rad(m){return this.mr*(m.kind==='ram'?1.18:m.kind==='lamb'?0.72:1)},
  key(m){return m.mud?2:m.c},
  spawn(inside,kind){const c=Math.random()<0.5?0:1,m=this.mr*2;kind=kind||this.pickKind();let x,y,vx=0,vy=0;
    if(inside){x=rand(m,this.w-m);y=rand(60,this.h-m-70)}else{const s=Math.floor(Math.random()*3),v=70;
      if(s===0){x=rand(m,this.w-m);y=56;vy=v}else if(s===1){x=this.w-m;y=rand(60,this.h*0.7);vx=-v}else{x=m;y=rand(60,this.h*0.7);vx=v}}
    this.motes.push({x,y,vx,vy,c,kind,age:0,ph:Math.random()*6.28,a:Math.random()*6.28,mud:false,cleanT:0})},
  down(x,y){if(!this.ptr)Snd.woof();this.ptr={x,y};this.path=[{x,y}];this.lock=false},
  move(x,y){this.ptr={x,y};if(!this.path||this.lock)return;const L=this.path[this.path.length-1];if(Math.hypot(x-L.x,y-L.y)<5)return;const P={x,y},n=this.path.length;
    for(let i=0;i<n-3;i++){const X=segInt(this.path[i],this.path[i+1],L,P);if(X){this.close([X].concat(this.path.slice(i+1)));this.path=null;this.lock=true;return}}
    if(n<700)this.path.push(P)},
  up(){if(this.path&&this.path.length>8){const a=this.path[0],b=this.path[this.path.length-1];if(dist(a,b)<this.closeR)this.close(this.path.slice());else this.fails.push({poly:this.path.slice(),t:0,color:'#d8b77f',open:true})}this.path=null;this.lock=false;this.ptr=null},
  close(poly){if(state!=='play')return;const inside=this.motes.filter(m=>pip(poly,m.x,m.y));let cx=0,cy=0;poly.forEach(p=>{cx+=p.x;cy+=p.y});cx/=poly.length;cy/=poly.length;
    if(!inside.length){this.fails.push({poly,t:0,color:'#d8b77f'});return}
    const cols=new Set(inside.map(m=>this.key(m)));
    if(cols.size===1){const n=inside.length,pts=n*n*10,c=this.key(inside[0]);track('lasso.pen',{day:this.level(),size:n,color:['white','black','muddy'][c]});this.score+=pts;this.penned+=n;
      this.motes=this.motes.filter(m=>!inside.includes(m));inside.forEach(m=>burst(this.parts,m.x,m.y,WOOL[c],7,120,3));
      this.cinches.push({poly,cx,cy,t:0,color:WOOL[c]});pop(this.pops,cx,cy,['White','Black','Muddy'][c]+' ×'+n+'  +'+pts,'#fff7df');
      Snd.bleat(c===1?380:c===2?330:520);for(let i=0;i<Math.min(n,8);i++)Snd.tone(note(5+i),0.16,'triangle',0.05,0.08+i*0.05);buzz(10+n*4);
      if(this.penned>=this.cf.goal){for(let i=0;i<6;i++)Snd.tone(note(10+i),0.25,'triangle',0.06,0.3+i*0.07);winRound('Penned '+this.penned+' with '+Math.ceil(this.left)+'s of daylight left.')}}
    else{track('lasso.mixed_pen',{day:this.level(),size:inside.length});this.fails.push({poly,t:0,color:C.bad});for(let i=0;i<3;i++)this.spawn(false);pop(this.pops,cx,cy,'Mixed flock. +3 sheep','#fff7df');Snd.bleat(300);Snd.noise(0.2,0.06,400,0.8);buzz([30,40,30])}},
  spawnWolf(){const left=Math.random()<0.5;this.wolf={x:left?-30:this.w+30,y:rand(this.h*0.3,this.h*0.7),a:left?0:Math.PI,state:'prowl',t:0,run:0};Snd.howl();pop(this.pops,left?60:this.w-60,this.wolf.y-30,'Wolf!',C.bad)},
  updateWolf(dt){const wf=this.wolf,d=this.dog;wf.t+=dt;let vx=0,vy=0;
    if(wf.state==='prowl'){let cx=this.w/2,cy=this.h/2;if(this.motes.length){cx=0;cy=0;this.motes.forEach(m=>{cx+=m.x;cy+=m.y});cx/=this.motes.length;cy/=this.motes.length}
      const dx=cx-wf.x,dy=cy-wf.y,dd=Math.hypot(dx,dy)||1,sp=dd>30?80:30;vx=dx/dd*sp+Math.sin(wf.t*3)*30;vy=dy/dd*sp+Math.cos(wf.t*2.3)*30;
      if(this.ptr&&dist(d,wf)<this.mr*4.5){wf.state='flee';wf.chased=true;this.score+=20;track('lasso.wolf_chased',{day:this.level()});pop(this.pops,wf.x,wf.y-20,'Chased off +20','#fff7df');Snd.tone(760,0.06,'square',0.04);Snd.tone(980,0.08,'square',0.035,0.07);buzz(15)}
      else if(wf.t>9){wf.state='flee'}}
    if(wf.state==='flee'){let dx=wf.x-d.x,dy=wf.y-d.y;if(!wf.chased){dx=wf.x<this.w/2?-1:1;dy=0}const dd=Math.hypot(dx,dy)||1;vx=dx/dd*300;vy=dy/dd*300;
      if(wf.x<-60||wf.x>this.w+60||wf.y<-60||wf.y>this.h+60){this.wolf=null;return}}
    wf.x+=vx*dt;wf.y+=vy*dt;if(Math.hypot(vx,vy)>5)wf.a=Math.atan2(vy,vx);wf.run+=Math.hypot(vx,vy)*dt*0.15},
  update(dt,live){stepParts(this.parts,dt);stepPops(this.pops,dt);
    for(const a of [this.cinches,this.fails])for(let i=a.length-1;i>=0;i--){a[i].t+=dt;if(a[i].t>0.5)a.splice(i,1)}
    const d=this.dog;if(this.ptr){const ox=d.x,oy=d.y,k=Math.min(1,dt*14);d.x+=(this.ptr.x-d.x)*k;d.y+=(this.ptr.y-d.y)*k;const mv=Math.hypot(d.x-ox,d.y-oy);if(mv>0.5)d.a=Math.atan2(d.y-oy,d.x-ox);d.run+=mv*0.15}
    if(!live)return;this.t+=dt;this.left=this.len-this.t;
    this.spawnAcc+=dt;const iv=this.cf.iv*(1-0.25*Math.min(1,this.t/this.len));while(this.spawnAcc>=iv){this.spawnAcc-=iv;this.spawn(false)}
    if(this.has('wolf')){if(!this.wolf){this.wolfT-=dt;if(this.wolfT<=0){this.spawnWolf();this.wolfT=18}}else this.updateWolf(dt)}
    const ms=this.motes,R=this.ptr?this.flee:this.flee*0.45,damp=Math.pow(0.35,dt),wf=this.wolf&&this.wolf.state==='prowl'?this.wolf:null,WR=this.flee*1.15;
    for(const m of ms){m.age+=dt;const ram=m.kind==='ram',lamb=m.kind==='lamb';m.vx+=(Math.random()-0.5)*(lamb?170:100)*dt;m.vy+=(Math.random()-0.5)*(lamb?170:100)*dt;
      const dx=m.x-d.x,dy=m.y-d.y,dd=Math.hypot(dx,dy);if(dd<R&&dd>0.1){const f=(1-dd/R)*1000*dt*(ram?0.3:lamb?1.4:1);m.vx+=dx/dd*f;m.vy+=dy/dd*f}
      if(wf){const ex=m.x-wf.x,ey=m.y-wf.y,ed=Math.hypot(ex,ey);if(ed<WR&&ed>0.1){const f=(1-ed/WR)*1300*dt*(ram?0.6:1);m.vx+=ex/ed*f;m.vy+=ey/ed*f}}
      if(m.cleanT>0)m.cleanT-=dt;
      if(m.mud&&dd<this.mr*2.4){m.mud=false;m.cleanT=1.2;burst(this.parts,m.x,m.y,WOOL[2],9,140,2.5);Snd.noise(0.1,0.04,1300,1.5)}
      else if(!m.mud&&m.cleanT<=0){for(const p of this.puddles){const qx=(m.x-p.x)/p.rx,qy=(m.y-p.y)/p.ry;if(qx*qx+qy*qy<1){m.mud=true;Snd.noise(0.07,0.025,250,1);break}}}}
    for(let i=0;i<ms.length;i++)for(let j=i+1;j<ms.length;j++){const a=ms[i],b=ms[j],dx=b.x-a.x,dy=b.y-a.y,dd=Math.hypot(dx,dy),min=(this.rad(a)+this.rad(b))*1.05;if(dd<min&&dd>0.01){const k=(min-dd)/2/dd;a.x-=dx*k;a.y-=dy*k;b.x+=dx*k;b.y+=dy*k}}
    for(const m of ms){const r=this.rad(m),cap=m.kind==='lamb'?260:m.kind==='ram'?120:190;m.vx*=damp;m.vy*=damp;const sp=Math.hypot(m.vx,m.vy);if(sp>cap){m.vx*=cap/sp;m.vy*=cap/sp}
      if(sp>14){const ta=Math.atan2(m.vy,m.vx);let df=ta-m.a;df=Math.atan2(Math.sin(df),Math.cos(df));m.a+=df*Math.min(1,dt*8)}
      m.x+=m.vx*dt;m.y+=m.vy*dt;
      if(m.x<r){m.x=r;m.vx=Math.abs(m.vx)}if(m.x>this.w-r){m.x=this.w-r;m.vx=-Math.abs(m.vx)}if(m.y<48+r){m.y=48+r;m.vy=Math.abs(m.vy)}if(m.y>this.h-r-30){m.y=this.h-r-30;m.vy=-Math.abs(m.vy)}}
    if(ms.length>this.CAP){Snd.lose();buzz([40,40,80]);ms.forEach(m=>burst(this.parts,m.x,m.y,WOOL[this.key(m)],3,120));gameOver('The field overflowed at '+this.CAP+' sheep.','overflow');return}
    if(this.left<=0){this.left=0;Snd.lose();buzz([40,40,80]);gameOver('The sun set with '+this.penned+' of '+this.cf.goal+' penned.','sunset')}},
  rescue(){this.rescued=true;track('lasso.revive',{day:this.level()});this.len+=20;this.left=this.len-this.t;const n=Math.floor(this.motes.length*0.35);for(let i=0;i<n;i++){const k=Math.floor(Math.random()*this.motes.length);const m=this.motes.splice(k,1)[0];burst(this.parts,m.x,m.y,WOOL[this.key(m)],5,120)}this.ptr=null;this.path=null;this.wolf=null;pop(this.pops,this.w/2,this.h/2,'+20s daylight','#fff7df')},
  hud(){return[this.day,this.penned+'/'+this.cf.goal,'Day','Penned']},
  level(){return'day-'+this.day},
  result(){return this.score},
  starsFor(){const f=this.left/this.len;return f>=0.4?3:f>=0.2?2:1},
  customCard(kind){const d=this.day,cf=this.cfg(d),total=Object.values(this.stars).reduce((a,b)=>a+b,0),st=n=>'★'.repeat(n)+'☆'.repeat(3-n);
    if(kind==='ready'){
      card.innerHTML='<p class="eyebrow">Day '+d+(total?' · '+total+' ★ earned':'')+'</p><h1>Lasso</h1><p class="tag">'+(cf.twist||this.meta.tag)+'</p><ul class="rules">'+this.meta.rules.map(r=>'<li>'+r+'</li>').join('')+'</ul><p class="best">Goal: pen <b>'+cf.goal+'</b> sheep in <b>'+cf.len+'s</b> of daylight.'+(this.stars[d]?' Best: '+st(this.stars[d]):'')+'</p><div class="actions">'+(d>1?'<button class="btn" id="d1">Day 1</button>':'')+'<button class="btn primary" id="go">Start Day '+d+'</button></div>';
      $('#go').addEventListener('click',start);const d1=$('#d1');if(d1)d1.addEventListener('click',()=>{this.day=1;this.reset(W,H);showCard('ready')});return}
    if(won){const s=this.starsFor();this.stars[d]=Math.max(this.stars[d]||0,s);this.unlocked=Math.max(this.unlocked,d+1);store.set('proto.lasso.stars',this.stars);store.set('proto.lasso.day',this.unlocked);
      const nx=this.cfg(d+1),adDue=d+1>=4&&(d+1)%2===0;
      card.innerHTML='<p class="eyebrow">Day '+d+' complete</p><h1 class="score">'+st(s)+'</h1><p class="tag">'+cause+' '+this.score+' points.</p><p class="best"><b>Day '+(d+1)+':</b> '+(nx.twist||'More sheep, less daylight.')+'</p><div class="actions"><button class="btn" id="replay">Replay</button><button class="btn primary" id="next">Start Day '+(d+1)+'</button></div><p class="fine">Stars come from daylight left: 40% or more for three.'+(adDue?' An ad break (placeholder) plays before the next day.':'')+'</p>';
      $('#replay').addEventListener('click',start);$('#next').addEventListener('click',()=>{this.day=d+1;if(adDue)this.adBreak();else start()});return}
    card.innerHTML='<p class="eyebrow">Day '+d+' lost</p><h1 class="score">'+this.penned+'/'+this.cf.goal+'</h1><p class="tag">'+cause+'</p><div class="actions">'+(this.rescued?'':'<button class="btn" id="rescue">More daylight</button>')+'<button class="btn primary" id="retry">Retry Day '+d+'</button></div><p class="fine">More daylight stands in for a rewarded ad: 20 more seconds and a thinner field. Once per day.</p>';
    $('#retry').addEventListener('click',start);const rb=$('#rescue');if(rb)rb.addEventListener('click',()=>adPlaceholder(rb,'Ad playing…',()=>{this.rescue();state='play';hideCard()}))},
  adBreak(){card.innerHTML='<p class="eyebrow">Ad break</p><h1>Placeholder</h1><p class="tag">An interstitial ad would play here.</p><p class="best">Day '+this.day+' starts in <b id="adn">2</b></p>';let n=2;
    reviving=setInterval(()=>{n--;if(n>0){const e=$('#adn');if(e)e.textContent=n;return}clearInterval(reviving);reviving=null;start()},1000)},
  drawSheep(m){const r=this.rad(m),c=this.key(m),bob=Math.sin(m.age*12+m.ph)*Math.min(1,Math.hypot(m.vx,m.vy)/80)*r*0.06,sc=Math.min(1,m.age*4);
    ctx.save();ctx.translate(m.x,m.y+bob);ctx.rotate(m.a);ctx.scale(sc,sc);
    ctx.fillStyle='rgba(10,30,8,.28)';ctx.beginPath();ctx.ellipse(r*0.12,r*0.22,r*1.05,r*0.8,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=FACE[c];ctx.beginPath();ctx.ellipse(r*0.9,-r*0.36,r*0.2,r*0.12,-0.6,0,Math.PI*2);ctx.ellipse(r*0.9,r*0.36,r*0.2,r*0.12,0.6,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=WOOL[c];ctx.strokeStyle=RIM[c];ctx.lineWidth=1.2;ctx.beginPath();for(let k=0;k<7;k++){const a=k/7*Math.PI*2;ctx.moveTo(Math.cos(a)*r*0.5+r*0.5,Math.sin(a)*r*0.42);ctx.arc(Math.cos(a)*r*0.5,Math.sin(a)*r*0.42,r*0.5,0,Math.PI*2)}ctx.fill();ctx.stroke();
    ctx.beginPath();ctx.arc(-r*0.05,0,r*0.62,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=FACE[c];ctx.beginPath();ctx.ellipse(r*0.9,0,r*0.36,r*0.27,0,0,Math.PI*2);ctx.fill();
    if(m.kind==='ram'){ctx.strokeStyle='#caa46a';ctx.lineWidth=r*0.16;ctx.lineCap='round';ctx.beginPath();ctx.arc(r*0.72,-r*0.3,r*0.22,Math.PI*0.2,Math.PI*1.5);ctx.stroke();ctx.beginPath();ctx.arc(r*0.72,r*0.3,r*0.22,-Math.PI*1.5,-Math.PI*0.2);ctx.stroke()}
    ctx.restore()},
  drawCanid(d,s,pal){const wag=Math.sin(d.run*0.8+performance.now()/90)*0.5;
    ctx.save();ctx.translate(d.x,d.y);ctx.rotate(d.a);
    ctx.fillStyle='rgba(10,30,8,.3)';ctx.beginPath();ctx.ellipse(s*0.1,s*0.25,s*1.3,s*0.6,0,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle=pal.dark;ctx.lineWidth=s*0.26;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-s*0.9,0);ctx.quadraticCurveTo(-s*1.4,wag*s*0.6,-s*1.75,wag*s);ctx.stroke();
    ctx.strokeStyle=pal.light;ctx.lineWidth=s*0.2;ctx.beginPath();ctx.moveTo(-s*1.62,wag*s*0.9);ctx.lineTo(-s*1.78,wag*s*1.02);ctx.stroke();
    ctx.fillStyle=pal.dark;ctx.beginPath();ctx.ellipse(-s*0.1,0,s*1.0,s*0.52,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=pal.light;ctx.beginPath();ctx.ellipse(s*0.55,0,s*0.38,s*0.46,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=pal.dark;ctx.beginPath();ctx.arc(s*0.95,0,s*0.42,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.moveTo(s*0.8,-s*0.3);ctx.lineTo(s*0.62,-s*0.66);ctx.lineTo(s*1.0,-s*0.4);ctx.moveTo(s*0.8,s*0.3);ctx.lineTo(s*0.62,s*0.66);ctx.lineTo(s*1.0,s*0.4);ctx.fill();
    ctx.fillStyle=pal.light;ctx.beginPath();ctx.ellipse(s*1.15,0,s*0.3,s*0.1,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#17161b';ctx.beginPath();ctx.arc(s*1.42,0,s*0.08,0,Math.PI*2);ctx.fill();
    if(pal.eye){ctx.fillStyle=pal.eye;ctx.beginPath();ctx.arc(s*1.05,-s*0.17,s*0.07,0,Math.PI*2);ctx.arc(s*1.05,s*0.17,s*0.07,0,Math.PI*2);ctx.fill()}
    ctx.restore()},
  drawRope(pts,closeIt,alpha){ctx.globalAlpha=alpha==null?1:alpha;ctx.lineCap='round';ctx.lineJoin='round';const line=()=>{ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));if(closeIt)ctx.closePath();ctx.stroke()};
    ctx.strokeStyle='#d8b77f';ctx.lineWidth=4;line();ctx.strokeStyle='#8f6e43';ctx.lineWidth=1.6;ctx.setLineDash([3,5]);line();ctx.setLineDash([]);ctx.globalAlpha=1},
  draw(){const prog=Math.min(1,this.t/this.len);ctx.fillStyle='#4a7838';ctx.fillRect(0,0,this.w,this.h);
    ctx.fillStyle='rgba(36,70,28,.35)';for(const p of this.patches){ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill()}
    ctx.lineWidth=1.3;ctx.lineCap='round';ctx.strokeStyle='#5f9147';ctx.beginPath();for(const g of this.grass)if(!g.d){ctx.moveTo(g.x,g.y);ctx.lineTo(g.x+g.k*g.l,g.y-g.l)}ctx.stroke();
    ctx.strokeStyle='#3c6530';ctx.beginPath();for(const g of this.grass)if(g.d){ctx.moveTo(g.x,g.y);ctx.lineTo(g.x+g.k*g.l,g.y-g.l)}ctx.stroke();
    for(const p of this.puddles){ctx.fillStyle='#5a4128';ctx.beginPath();ctx.ellipse(p.x,p.y,p.rx,p.ry,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='rgba(140,110,70,.45)';ctx.beginPath();ctx.ellipse(p.x-p.rx*0.2,p.y-p.ry*0.25,p.rx*0.45,p.ry*0.3,0,0,Math.PI*2);ctx.fill()}
    if(prog>0){ctx.fillStyle='rgba(255,120,40,'+(0.16*prog)+')';ctx.fillRect(0,0,this.w,this.h)}
    for(const c of this.cinches){const k=Math.min(1,c.t/0.35),s=1-k*0.9,pts=c.poly.map(p=>({x:c.cx+(p.x-c.cx)*s,y:c.cy+(p.y-c.cy)*s}));ctx.globalAlpha=0.3*(1-k);ctx.fillStyle=c.color;ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();ctx.fill();this.drawRope(pts,true,1-k)}
    const sorted=this.motes.slice().sort((a,b)=>a.y-b.y);for(const m of sorted)this.drawSheep(m);
    if(this.wolf)this.drawCanid(this.wolf,this.mr*1.55,WOLFPAL);
    if(this.has('dusk')){const k=0.25+0.55*prog,d=this.dog,g=ctx.createRadialGradient(d.x,d.y,this.flee*0.35,d.x,d.y,this.flee*1.3);g.addColorStop(0,'rgba(8,12,28,0)');g.addColorStop(1,'rgba(8,12,28,'+k+')');ctx.fillStyle=g;ctx.fillRect(0,0,this.w,this.h)}
    for(const f of this.fails){const k=f.t/0.5,sh=f.open||RM?0:Math.sin(f.t*60)*4*(1-k);const pts=f.poly.map(p=>({x:p.x+sh,y:p.y}));if(f.color===C.bad){ctx.globalAlpha=0.8*(1-k);ctx.strokeStyle=C.bad;ctx.lineWidth=4;ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();ctx.stroke();ctx.globalAlpha=1}else this.drawRope(pts,!f.open,0.7*(1-k))}
    if(this.path&&this.path.length>1){const a=this.path[0];if(this.path.length>8){ctx.strokeStyle='#f4e7c8';ctx.globalAlpha=0.45;ctx.setLineDash([3,5]);ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(a.x,a.y,this.closeR,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1}this.drawRope(this.path,false,1)}
    if(this.ptr){ctx.strokeStyle='#f4e7c8';ctx.globalAlpha=0.16;ctx.lineWidth=1;ctx.beginPath();ctx.arc(this.dog.x,this.dog.y,this.flee,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1}
    this.drawCanid(this.dog,this.mr*1.3,DOGPAL);drawParts(this.parts);drawPops(this.pops);
    // daylight + field meters
    const bw=this.w-28,day=Math.max(0,this.left/this.len),fill=Math.min(1,this.motes.length/this.CAP);
    ctx.font=F(600,10,'b');ctx.textAlign='left';ctx.textBaseline='alphabetic';
    ctx.fillStyle='rgba(0,0,0,.3)';rrect(14,this.h-24,bw,4,2);ctx.fill();rrect(14,this.h-11,bw,4,2);ctx.fill();
    ctx.fillStyle=fill>0.8?C.bad:'#f4f1ea';rrect(14,this.h-24,bw*fill,4,2);ctx.fill();
    ctx.fillStyle=day<0.2?C.bad:C.lasso;rrect(14,this.h-11,bw*day,4,2);ctx.fill();
    ctx.fillStyle='rgba(255,247,223,.8)';ctx.textAlign='right';ctx.fillText('FIELD '+this.motes.length+'/'+this.CAP,this.w-14,this.h-28);ctx.fillText('DAYLIGHT '+Math.ceil(this.left)+'s',this.w-14,this.h-15)}
};

const GAME=Lasso;
