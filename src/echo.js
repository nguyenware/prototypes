/* =====================================================
   ECHO — haunted houses where the same evening repeats
   Houses are data: rooms, doors, floors, stairs, people.
   Route points are [time, x, y] in house units (0..1); 'tp' jumps (stairs).
   ===================================================== */
const HOUSES=[
  {name:'Cottage',twist:'Four rooms, four people. Learn the routines.',par:2,max:6,spawn:[0.5,0.5],floors:[[0,1]],stairs:[],
   rooms:[{n:'Bedroom',x:0,y:0,w:0.5,h:0.5,c:'#1f2239'},{n:'Bathroom',x:0.5,y:0,w:0.5,h:0.5,c:'#1a2a34'},{n:'Kitchen',x:0,y:0.5,w:0.5,h:0.5,c:'#2a2320'},{n:'Living room',x:0.5,y:0.5,w:0.5,h:0.5,c:'#241f30'}],
   doors:[[0.5,0.25,'v'],[0.5,0.75,'v'],[0.25,0.5,'h'],[0.75,0.5,'h']],
   people:[
    {n:'Kid',route:[[0,0.12,0.15],[3,0.12,0.15],[4.2,0.5,0.25],[5.6,0.84,0.18],[8,0.84,0.18]]},
    {n:'Dad',route:[[0,0.82,0.66],[1.5,0.75,0.5],[3,0.75,0.3],[5,0.62,0.35],[6.5,0.75,0.5],[8,0.82,0.66]]},
    {n:'Grandma',route:[[0,0.3,0.34],[4,0.3,0.34],[5,0.25,0.5],[6.5,0.3,0.7],[8,0.32,0.68]]},
    {n:'Mom',route:[[0,0.15,0.82],[2.5,0.15,0.82],[3.5,0.5,0.75],[5,0.85,0.86],[8,0.85,0.86]]}]},
  {name:'Duplex',twist:'Six rooms, five people, and a kid who sprints from the nursery to the living room and back.',par:3,max:6,spawn:[0.5,0.5],floors:[[0,1]],stairs:[],
   rooms:[{n:'Bedroom',x:0,y:0,w:0.5,h:0.334,c:'#1f2239'},{n:'Nursery',x:0.5,y:0,w:0.5,h:0.334,c:'#262037'},{n:'Bathroom',x:0,y:0.334,w:0.5,h:0.333,c:'#1a2a34'},{n:'Hall',x:0.5,y:0.334,w:0.5,h:0.333,c:'#1d2030'},{n:'Kitchen',x:0,y:0.667,w:0.5,h:0.333,c:'#2a2320'},{n:'Living room',x:0.5,y:0.667,w:0.5,h:0.333,c:'#241f30'}],
   doors:[[0.5,0.167,'v'],[0.5,0.5,'v'],[0.5,0.833,'v'],[0.25,0.334,'h'],[0.75,0.334,'h'],[0.25,0.667,'h'],[0.75,0.667,'h']],
   people:[
    {n:'Kid',kind:'runner',route:[[0,0.82,0.12],[1.5,0.82,0.12],[2.1,0.75,0.334],[2.6,0.75,0.5],[3.1,0.75,0.667],[3.8,0.86,0.86],[4.6,0.75,0.667],[5.1,0.75,0.5],[5.6,0.75,0.334],[6.3,0.82,0.12],[8,0.82,0.12]]},
    {n:'Mom',route:[[0,0.15,0.8],[3,0.15,0.8],[4,0.25,0.667],[5,0.18,0.5],[8,0.15,0.46]]},
    {n:'Dad',route:[[0,0.8,0.9],[2,0.8,0.9],[3,0.5,0.833],[4.5,0.25,0.88],[8,0.25,0.88]]},
    {n:'Grandma',route:[[0,0.15,0.12],[5,0.15,0.12],[6,0.25,0.334],[7,0.3,0.42],[8,0.3,0.42]]},
    {n:'Teen',route:[[0,0.62,0.45],[4,0.62,0.45],[4.6,0.75,0.334],[6,0.62,0.2],[8,0.62,0.2]]}]},
  {name:'Farmhouse',twist:'Grandpa is brave. Scare him with two different ghosts in the same night.',par:3,max:6,spawn:[0.6,0.5],floors:[[0,1]],stairs:[],
   rooms:[{n:'Bedroom',x:0,y:0,w:0.5,h:0.35,c:'#1f2239'},{n:'Loft',x:0.5,y:0,w:0.5,h:0.35,c:'#262037'},{n:'Parlor',x:0,y:0.35,w:0.6,h:0.3,c:'#2a2030'},{n:'Mudroom',x:0.6,y:0.35,w:0.4,h:0.3,c:'#252a26'},{n:'Kitchen',x:0,y:0.65,w:1,h:0.35,c:'#2a2320'}],
   doors:[[0.5,0.175,'v'],[0.3,0.35,'h'],[0.8,0.35,'h'],[0.6,0.5,'v'],[0.3,0.65,'h'],[0.8,0.65,'h']],
   people:[
    {n:'Grandpa',kind:'brave',route:[[0,0.2,0.5],[4,0.25,0.52],[8,0.2,0.5]]},
    {n:'Mom',route:[[0,0.15,0.85],[3,0.15,0.85],[5,0.5,0.86],[8,0.85,0.86]]},
    {n:'Dad',route:[[0,0.82,0.45],[2,0.82,0.45],[3,0.8,0.65],[4,0.9,0.85],[6,0.8,0.65],[8,0.82,0.48]]},
    {n:'Girl',route:[[0,0.15,0.15],[2,0.15,0.15],[3,0.5,0.175],[4.5,0.8,0.15],[6,0.8,0.15],[7,0.8,0.35],[8,0.8,0.42]]},
    {n:'Boy',kind:'runner',route:[[0,0.75,0.2],[0.8,0.8,0.35],[1.4,0.7,0.5],[1.8,0.6,0.5],[2.4,0.4,0.5],[3,0.3,0.65],[3.6,0.3,0.85],[4.2,0.3,0.65],[4.8,0.4,0.5],[5.4,0.6,0.5],[5.8,0.7,0.5],[6.4,0.8,0.35],[7.2,0.75,0.2],[8,0.75,0.2]]}]},
  {name:'Townhouse',twist:'Two floors. Your ghost can only change floors on the stairs.',par:3,max:6,spawn:[0.3,0.78],floors:[[0,0.46],[0.54,1]],stairs:[[[0.88,0.41],[0.88,0.6]]],
   rooms:[{n:'Bedroom',x:0,y:0,w:0.5,h:0.46,c:'#1f2239'},{n:'Bathroom',x:0.5,y:0,w:0.5,h:0.23,c:'#1a2a34'},{n:'Study',x:0.5,y:0.23,w:0.5,h:0.23,c:'#262037'},{n:'Living room',x:0,y:0.54,w:0.6,h:0.46,c:'#241f30'},{n:'Kitchen',x:0.6,y:0.54,w:0.4,h:0.46,c:'#2a2320'}],
   doors:[[0.5,0.115,'v'],[0.5,0.345,'v'],[0.75,0.23,'h'],[0.6,0.77,'v']],
   people:[
    {n:'Mom',route:[[0,0.75,0.82],[2,0.75,0.82],[2.8,0.88,0.6],[2.85,0.88,0.41,'tp'],[3.8,0.7,0.35],[8,0.7,0.35]]},
    {n:'Dad',route:[[0,0.2,0.86],[4,0.35,0.86],[8,0.2,0.86]]},
    {n:'Kid',route:[[0,0.15,0.1],[4,0.15,0.1],[5,0.5,0.115],[6,0.78,0.1],[8,0.78,0.1]]},
    {n:'Teen',route:[[0,0.75,0.3],[1,0.75,0.3],[1.8,0.88,0.41],[1.85,0.88,0.6,'tp'],[3,0.75,0.85],[4,0.65,0.77],[4.3,0.6,0.77],[5.5,0.4,0.65],[8,0.4,0.65]]},
    {n:'Aunt',route:[[0,0.65,0.12],[3,0.65,0.12],[3.6,0.75,0.23],[4.5,0.62,0.4],[5.2,0.5,0.345],[6.3,0.3,0.35],[8,0.3,0.35]]}]}
];
const Echo={
  meta:{title:'Echo',tag:'Haunt the whole house in one night.',second:'Night',rules:[
    'The same evening repeats. The family follows the exact same routine every night.',
    'Drag to float your ghost through walls. Swoop through a person to scare them.',
    'Each night your past self replays as an echo and scares people too. Scare everyone in one night. Touch your own echo and the night ends in a paradox.']},
  LOOP:8, STEP:1/60, GRACE:0.8, hi:null,
  prog(){if(!this._prog)this._prog=store.get('proto.echo.prog',{unlocked:0,stars:{}});return this._prog},
  saveProg(){store.set('proto.echo.prog',this._prog)},
  rect(){const top=54,bot=34,side=10,aw=this.w-side*2,ah=this.h-top-bot;let hw=aw,hh=ah;if(hh>hw*1.45)hh=hw*1.45;if(hw>hh*1.3)hw=hh*1.3;this.hx=(this.w-hw)/2;this.hy=top+(ah-hh)/2;this.hw=hw;this.hh=hh;this.r=Math.max(9,Math.min(hw,hh)*0.035);this.speed=Math.min(hw,hh)*0.24},
  P(x,y){return{x:this.hx+x*this.hw,y:this.hy+y*this.hh}},
  floorOfY(py){const ny=(py-this.hy)/this.hh;let best=0,bd=1e9;this.H.floors.forEach((f,i)=>{const d=ny<f[0]?f[0]-ny:ny>f[1]?ny-f[1]:0;if(d<bd){bd=d;best=i}});return best},
  resize(w,h){const ow=this.hw,ox=this.hx,oy=this.hy,oh=this.hh;this.w=w;this.h=h;this.rect();
    if(ow&&this.p){const m=q=>({x:this.hx+(q.x-ox)/ow*this.hw,y:this.hy+(q.y-oy)/oh*this.hh});this.p=m(this.p);this.tg=m(this.tg);this.echoes.forEach(e=>{e.path=e.path.map(m)});this.rec=this.rec.map(m);this.trail=this.trail.map(m);if(this.lockPt)this.lockPt=m(this.lockPt)}},
  reset(w,h){this.w=w;this.h=h;if(this.hi==null)this.hi=Math.min(this.prog().unlocked,HOUSES.length-1);this.H=HOUSES[this.hi];this.rect();
    this.echoes=[];this.night=1;this.maxNights=this.H.max;this.parts=[];this.pops=[];this.keys={};this.last=null;this.reviveUsed=false;this.hitEcho=null;this.startNight()},
  startNight(){this.t=0;this.acc=0;this.rec=[];this.trail=[];const sp=this.P(this.H.spawn[0],this.H.spawn[1]);this.p={x:sp.x,y:sp.y};this.tg={x:sp.x,y:sp.y};this.floor=this.floorOfY(sp.y);this.lockPt=null;
    this.res=this.H.people.map(R=>({R,scared:false,hits:[],st:0,x:null,y:null}));this.scaredCount=0;this.posRes()},
  routeAt(route,t){for(let i=1;i<route.length;i++){const a=route[i-1],b=route[i];if(t<=b[0]){const k=(b[3]==='tp'||b[0]===a[0])?0:(t-a[0])/(b[0]-a[0]);return this.P(a[1]+(b[1]-a[1])*k,a[2]+(b[2]-a[2])*k)}}const l=route[route.length-1];return this.P(l[1],l[2])},
  posRes(){for(const r of this.res){if(r.scared)continue;const q=this.routeAt(r.R.route,this.t);r.x=q.x;r.y=q.y}},
  clampTg(){const m=this.r,f=this.H.floors[this.floor];this.tg.x=Math.min(this.hx+this.hw-m,Math.max(this.hx+m,this.tg.x));this.tg.y=Math.min(this.hy+f[1]*this.hh-m,Math.max(this.hy+f[0]*this.hh+m,this.tg.y))},
  down(x,y){this.last={x,y}},
  move(x,y){if(!this.last)return;this.tg.x+=(x-this.last.x)*1.2;this.tg.y+=(y-this.last.y)*1.2;this.last={x,y};this.clampTg()},
  up(){this.last=null},
  key(k,on){this.keys[k]=on},
  update(dt,live){stepParts(this.parts,dt);stepPops(this.pops,dt);for(const r of this.res)if(r.scared)r.st+=dt;if(!live)return;
    const k=this.keys,sp=this.speed*dt*5.6;if(k.ArrowLeft||k.a)this.tg.x=this.p.x-sp;if(k.ArrowRight||k.d)this.tg.x=this.p.x+sp;if(k.ArrowUp||k.w)this.tg.y=this.p.y-sp;if(k.ArrowDown||k.s)this.tg.y=this.p.y+sp;this.clampTg();
    this.acc+=dt;while(this.acc>=this.STEP){this.acc-=this.STEP;this.tick();if(state!=='play')return}},
  contact(r,src){if(r.scared||r.hits.includes(src))return;r.hits.push(src);const brave=r.R.kind==='brave',by=src!=='p';
    if(brave&&r.hits.length<2){pop(this.pops,r.x,r.y-this.r*1.8,r.R.n+' is shaken 1/2','#ffb35c');Snd.tone(500,0.12,'triangle',0.05);buzz(8);return}
    r.scared=true;r.st=0;this.scaredCount++;burst(this.parts,r.x,r.y,'#ffe27a',14,170,2.5);
    pop(this.pops,r.x,r.y-this.r*1.8,(by?'Echo scared ':'Boo! ')+r.R.n,by?C.ghost:'#ffe27a');Snd.tone(900+this.scaredCount*120,0.12,'sine',0.06);Snd.tone(1400+this.scaredCount*120,0.1,'sine',0.04,0.05);buzz(14);
    if(this.scaredCount>=this.res.length){for(let i=0;i<6;i++)Snd.tone(note(8+i),0.25,'triangle',0.06,0.15+i*0.07);winRound('The whole '+this.H.name.toLowerCase()+' was screaming on night '+this.night+'.')}},
  tick(){const S=this.STEP;
    const dx=this.tg.x-this.p.x,dy=this.tg.y-this.p.y,dd=Math.hypot(dx,dy),mx=this.speed*S;if(dd>mx){this.p.x+=dx/dd*mx;this.p.y+=dy/dd*mx}else{this.p.x=this.tg.x;this.p.y=this.tg.y}
    // stairs
    if(this.lockPt&&dist(this.p,this.lockPt)>this.r*2.4)this.lockPt=null;
    if(!this.lockPt)for(const pair of this.H.stairs){for(let s=0;s<2;s++){const a=this.P(pair[s][0],pair[s][1]);if(this.floorOfY(a.y)===this.floor&&dist(this.p,a)<this.r*1.3){const b=this.P(pair[1-s][0],pair[1-s][1]);this.p={x:b.x,y:b.y};this.tg={x:b.x,y:b.y};this.floor=this.floorOfY(b.y);this.lockPt={x:b.x,y:b.y};this.last=null;burst(this.parts,b.x,b.y,C.echo,10,120,2);Snd.tone(note(9),0.12,'sine',0.05);Snd.tone(note(12),0.12,'sine',0.04,0.06);break}}if(this.lockPt)break}
    this.rec.push({x:this.p.x,y:this.p.y});this.trail.push({x:this.p.x,y:this.p.y});if(this.trail.length>22)this.trail.shift();
    this.t+=S;this.posRes();const idx=this.rec.length-1,hit=this.r*1.75,live=this.t>this.GRACE,reach=this.r*1.8;
    this.echoes.forEach(e=>{const q=e.path[Math.min(idx,e.path.length-1)];e.x=q.x;e.y=q.y;e.idx=Math.min(idx,e.path.length-1)});
    for(const r of this.res){if(r.scared)continue;
      if(dist(this.p,r)<reach)this.contact(r,'p');if(state!=='play')return;
      this.echoes.forEach((e,i)=>{if(!r.scared&&Math.hypot(e.x-r.x,e.y-r.y)<reach)this.contact(r,i)});if(state!=='play')return}
    if(live)for(const e of this.echoes){if(Math.hypot(e.x-this.p.x,e.y-this.p.y)<hit){this.hitEcho=e;burst(this.parts,this.p.x,this.p.y,C.ghost,26,240,3);burst(this.parts,this.p.x,this.p.y,C.echo,18,200);Snd.noise(0.35,0.08,500,0.6);Snd.lose();buzz([40,40,80]);track('echo.paradox',{house:this.level(),night:this.night});gameOver('You touched your own echo. Paradox.','paradox');return}}
    if(this.t>=this.LOOP)this.endNight()},
  endNight(){track('echo.night_end',{house:this.level(),night:this.night,scared:this.scaredCount});this.echoes.push({path:this.rec,x:null,y:null,idx:0});this.night++;
    if(this.night>this.maxNights){this.night=this.maxNights;Snd.lose();buzz([40,40,80]);gameOver('Dawn broke with '+this.scaredCount+' of '+this.res.length+' scared.','dawn');return}
    Snd.tone(note(0),0.4,'sine',0.06);Snd.tone(note(2),0.4,'sine',0.04,0.03);this.startNight();pop(this.pops,this.w/2,this.hy+this.hh/2,'Night '+this.night,C.fg)},
  revive(){this.reviveUsed=true;track('echo.revive',{house:this.level(),kind:this.hitEcho?'erase_echo':'more_nights'});if(this.hitEcho){this.echoes=this.echoes.filter(e=>e!==this.hitEcho);this.hitEcho=null;this.startNight();pop(this.pops,this.w/2,this.hy+this.hh/2,'Echo erased. Night '+this.night+' again',C.fg)}else{this.maxNights+=2;this.night++;this.startNight();pop(this.pops,this.w/2,this.hy+this.hh/2,'Two more nights',C.fg)}},
  hud(){return[this.scaredCount+'/'+this.res.length,this.night+'/'+this.maxNights,'Scared','Night']},
  level(){return'house-'+(this.hi+1)},
  result(){return won?this.starsFor():this.scaredCount},
  starsFor(){const p=this.H.par;return this.night<=p?3:this.night===p+1?2:1},
  customCard(kind){const st=n=>'★'.repeat(n)+'☆'.repeat(3-n),pg=this.prog(),HS=this.H,i=this.hi;
    if(kind==='ready'){const chips=HOUSES.map((h,j)=>{const lock=j>pg.unlocked,s=pg.stars[j]||0;return'<button class="chip'+(j===i?' on':'')+'" data-h="'+j+'"'+(lock?' disabled':'')+'><span>'+(j+1)+'. '+h.name+'</span><small>'+(lock?'Locked':s?st(s):'New')+'</small></button>'}).join('');
      card.innerHTML='<p class="eyebrow">House '+(i+1)+' of '+HOUSES.length+'</p><h1>'+HS.name+'</h1><p class="tag">'+HS.twist+'</p><div class="chips">'+chips+'</div><ul class="rules">'+this.meta.rules.map(r=>'<li>'+r+'</li>').join('')+'</ul><p class="best">'+HS.people.length+' people · '+HS.max+' nights until dawn · three stars in '+HS.par+' nights or fewer.</p><div class="actions"><button class="btn primary" id="go">Haunt the '+HS.name.toLowerCase()+'</button></div>';
      $('#go').addEventListener('click',start);card.querySelectorAll('.chip').forEach(c=>c.addEventListener('click',()=>{this.hi=+c.dataset.h;this.reset(W,H);showCard('ready')}));return}
    if(won){const s=this.starsFor();pg.stars[i]=Math.max(pg.stars[i]||0,s);pg.unlocked=Math.max(pg.unlocked,Math.min(i+1,HOUSES.length-1));this.saveProg();const nx=HOUSES[i+1];
      card.innerHTML='<p class="eyebrow">'+HS.name+' haunted</p><h1 class="score">'+st(s)+'</h1><p class="tag">'+cause+'</p>'+(nx?'<p class="best"><b>Next: '+nx.name+'.</b> '+nx.twist+'</p>':'<p class="best">That is every house in this prototype.</p>')+'<div class="actions"><button class="btn" id="again">Replay</button>'+(nx?'<button class="btn primary" id="next">Next house</button>':'')+'</div>';
      $('#again').addEventListener('click',start);const n=$('#next');if(n)n.addEventListener('click',()=>{this.hi=i+1;this.reset(W,H);showCard('ready')});return}
    card.innerHTML='<p class="eyebrow">Night over</p><h1 class="score">'+this.scaredCount+'/'+this.res.length+'</h1><p class="tag">'+cause+'</p><div class="actions">'+(this.reviveUsed?'':'<button class="btn" id="rv">'+(this.hitEcho?'Erase that echo':'Two more nights')+'</button>')+'<button class="btn primary" id="again">Start over</button></div><p class="fine">'+(this.reviveUsed?'Houses list is on the start card.':(this.hitEcho?'Erase that echo':'Two more nights')+' stands in for a rewarded ad. One per house.')+'</p>';
    $('#again').addEventListener('click',start);const rv=$('#rv');if(rv)rv.addEventListener('click',()=>adPlaceholder(rv,'Ad playing…',()=>{this.revive();state='play';hideCard()}))},
  drawPath(path,a0,a1){const jump=this.hw*0.2;ctx.beginPath();for(let i=a0;i<=a1;i++){const q=path[i];if(i===a0||Math.hypot(q.x-path[i-1].x,q.y-path[i-1].y)>jump)ctx.moveTo(q.x,q.y);else ctx.lineTo(q.x,q.y)}ctx.stroke()},
  draw(){const H=this.H,hx=this.hx,hy=this.hy,hw=this.hw,hh=this.hh,r=this.r;
    // floor gap band
    if(H.floors.length>1){const a=this.P(0,H.floors[0][1]),b=this.P(1,H.floors[1][0]);ctx.fillStyle='#0f1220';ctx.fillRect(a.x,a.y,b.x-a.x,b.y-a.y);ctx.fillStyle='rgba(236,239,247,.35)';ctx.font=F(600,9,'b');ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('UPSTAIRS ▲   ▼ DOWNSTAIRS',(a.x+b.x)/2-hw*0.08,(a.y+b.y)/2)}
    ctx.lineWidth=3;ctx.strokeStyle='#59607e';
    for(const R of H.rooms){const a=this.P(R.x,R.y);ctx.fillStyle=R.c;ctx.fillRect(a.x,a.y,R.w*hw,R.h*hh);ctx.strokeRect(a.x,a.y,R.w*hw,R.h*hh);ctx.fillStyle='rgba(236,239,247,.32)';ctx.font=F(600,10,'b');ctx.textAlign='left';ctx.textBaseline='top';ctx.fillText(R.n.toUpperCase(),a.x+9,a.y+8)}
    ctx.strokeStyle='#2c2a40';ctx.lineWidth=6;ctx.lineCap='butt';ctx.beginPath();const dl=Math.min(hw,hh)*0.05;
    for(const d of H.doors){const c=this.P(d[0],d[1]);if(d[2]==='v'){ctx.moveTo(c.x,c.y-dl);ctx.lineTo(c.x,c.y+dl)}else{ctx.moveTo(c.x-dl,c.y);ctx.lineTo(c.x+dl,c.y)}}ctx.stroke();
    // stairs
    for(const pair of H.stairs)for(const q of pair){const c=this.P(q[0],q[1]),s=r*1.2;ctx.fillStyle='#3a3f5c';ctx.fillRect(c.x-s,c.y-s,s*2,s*2);ctx.strokeStyle='#8890b0';ctx.lineWidth=1.5;ctx.beginPath();for(let k=1;k<4;k++){ctx.moveTo(c.x-s,c.y-s+k*s/2);ctx.lineTo(c.x+s,c.y-s+k*s/2)}ctx.stroke()}
    // spawn
    const sp=this.P(H.spawn[0],H.spawn[1]);ctx.strokeStyle='rgba(165,150,255,.35)';ctx.lineWidth=1.5;ctx.setLineDash([3,4]);ctx.beginPath();ctx.arc(sp.x,sp.y,r*1.6,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);
    // residents
    for(const q of this.res){if(q.x==null)continue;const jit=q.scared&&!RM?Math.sin(q.st*70)*2:0,brave=q.R.kind==='brave',rr=r*(q.R.kind==='runner'?0.66:brave?0.95:0.78);
      ctx.fillStyle='rgba(255,214,90,.14)';ctx.beginPath();ctx.arc(q.x+jit,q.y,r*2.1,0,Math.PI*2);ctx.fill();
      ctx.fillStyle=q.scared?'#fff4c2':'#ffd65a';ctx.beginPath();ctx.arc(q.x+jit,q.y,rr,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#8a6a10';ctx.lineWidth=1.5;ctx.stroke();
      if(brave&&!q.scared){ctx.strokeStyle='#ffb35c';ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(q.x,q.y,rr+4,-Math.PI/2,-Math.PI/2+Math.PI*2*(q.hits.length?0.5:1));ctx.stroke();if(!q.hits.length){ctx.fillStyle='#ffb35c';ctx.font=F(700,10,'d');ctx.textAlign='center';ctx.textBaseline='bottom';ctx.fillText('×2',q.x,q.y-rr-6)}}
      if(q.scared){ctx.fillStyle='#fff4c2';ctx.font=F(700,14,'d');ctx.textAlign='center';ctx.textBaseline='bottom';ctx.fillText('!',q.x+jit,q.y-r)}}
    // echoes
    const fade=this.t<this.GRACE?0.3:1;
    for(const e of this.echoes){if(e.x==null)continue;ctx.strokeStyle=C.ghost;ctx.lineWidth=2;ctx.globalAlpha=0.25*fade;this.drawPath(e.path,Math.max(0,e.idx-30),e.idx);ctx.globalAlpha=0.5*fade;ctx.fillStyle=C.ghost;this.ghostShape(e.x,e.y,r);ctx.fill();ctx.globalAlpha=1}
    // player ghost
    ctx.strokeStyle='rgba(220,248,255,.35)';ctx.lineWidth=r*0.7;ctx.lineCap='round';ctx.lineJoin='round';if(this.trail.length>1)this.drawPath(this.trail,0,this.trail.length-1);
    if(state!=='dying'&&state!=='over'){ctx.save();ctx.shadowColor=C.echo;ctx.shadowBlur=18;ctx.fillStyle='#e6fbff';this.ghostShape(this.p.x,this.p.y,r);ctx.fill();ctx.restore();ctx.fillStyle=C.ink;ctx.beginPath();ctx.arc(this.p.x-r*0.3,this.p.y-r*0.15,r*0.14,0,Math.PI*2);ctx.arc(this.p.x+r*0.3,this.p.y-r*0.15,r*0.14,0,Math.PI*2);ctx.fill()}
    drawParts(this.parts);drawPops(this.pops);
    const bw=this.w-28,k=Math.min(1,this.t/this.LOOP);ctx.fillStyle=C.line;rrect(14,this.h-12,bw,4,2);ctx.fill();ctx.fillStyle=C.ghost;rrect(14,this.h-12,bw*k,4,2);ctx.fill();
    const mins=Math.floor(k*240),hr=8+Math.floor(mins/60),mm=String(mins%60).padStart(2,'0');ctx.fillStyle=C.muted;ctx.font=F(600,10,'b');ctx.textAlign='right';ctx.textBaseline='alphabetic';ctx.fillText(hr+':'+mm+' PM',this.w-14,this.h-17)},
  ghostShape(x,y,r){ctx.beginPath();ctx.arc(x,y-r*0.15,r,Math.PI,0);const b=y+r*0.85;ctx.lineTo(x+r,b);for(let i=0;i<4;i++){const x1=x+r-(i+0.5)*(r/2),x2=x+r-(i+1)*(r/2);ctx.quadraticCurveTo(x1,b-(i%2?-r*0.25:r*0.25),x2,b)}ctx.closePath()}
};

const GAME=Echo;
