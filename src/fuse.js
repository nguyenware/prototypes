/* =====================================================
   FUSE — rotate tiles ahead of the flame
   ===================================================== */
const NN=1,EE=2,SS=4,WW=8;
const DIRS={1:[0,-1],2:[1,0],4:[0,1],8:[-1,0]};
const opp=d=>((d<<2)|(d>>2))&15;
const rotm=m=>((m<<1)&15)|(m>>3);
const Fuse={
  meta:{title:'Fuse',tag:'Keep the flame alive.',second:'Flames',rules:[
    'A flame burns along the fuse. Tap a tile to turn it a quarter turn.',
    'Line up the tile ahead before the flame reaches it. The outline goes orange when it connects.',
    'T-junctions split the flame and multiply your score. When every flame fizzles, the run ends.']},
  COLS:6,
  layout(){const s=Math.floor(Math.min((this.w-12)/this.COLS,(this.h-70)/this.rows));this.s=s;this.ox=Math.floor((this.w-s*this.COLS)/2);this.oy=Math.floor(52+(this.h-64-s*this.rows)/2)},
  resize(w,h){this.w=w;this.h=h;if(this.rows)this.layout()},
  reset(w,h){this.w=w;this.h=h;const s0=(w-12)/this.COLS;this.rows=Math.max(6,Math.min(10,Math.floor((h-70)/s0)));this.layout();
    this.grid=[];for(let i=0;i<this.COLS*this.rows;i++)this.grid.push(this.newTile());
    this.flames=[];this.t=0;this.score=0;this.burned=0;this.parts=[];this.pops=[];this.wait=2.2;
    const c=Math.floor(this.COLS/2),r=this.rows-1,st=this.tile(c,r);st.m=5;st.kind='straight';st.drop=0;
    const up=this.tile(c,r-1);if(up){up.m=5;up.kind='straight'}
    this.flames=this.enter(c,r,SS,0)},
  tile(c,r){return(c<0||r<0||c>=this.COLS||r>=this.rows)?null:this.grid[r*this.COLS+c]},
  newTile(){const x=Math.random();let m,kind;if(x<0.38){kind='straight';m=5}else if(x<0.84){kind='corner';m=3}else if(x<0.96){kind='tee';m=7}else{kind='cross';m=15}
    const n=Math.floor(Math.random()*4);for(let i=0;i<n;i++)m=rotm(m);return{m,kind,ang:0,ash:false,ashT:0,drop:1,active:0,seed:Math.random()}},
  enter(c,r,entry,p){const t=this.tile(c,r);const exits=t.kind==='cross'?[opp(entry)]:[1,2,4,8].filter(d=>(t.m&d)&&d!==entry);
    if(exits.length>1){track('fuse.split',{flames:this.flames.length+exits.length-1});pop(this.pops,this.ox+(c+0.5)*this.s,this.oy+r*this.s,'Split ×'+(this.flames.length+exits.length-1),C.lasso);Snd.tone(note(9),0.2,'triangle',0.06);Snd.tone(note(11),0.2,'triangle',0.05,0.06);buzz(20)}
    return exits.map(ex=>{t.active++;return{c,r,entry,exit:ex,p:Math.max(0,p)}})},
  sidePt(c,r,d){const s=this.s,cx=this.ox+(c+0.5)*s,cy=this.oy+(r+0.5)*s,v=DIRS[d];return{x:cx+v[0]*s/2,y:cy+v[1]*s/2}},
  fpos(f){const s=this.s,cx=this.ox+(f.c+0.5)*s,cy=this.oy+(f.r+0.5)*s,a=this.sidePt(f.c,f.r,f.entry),b=this.sidePt(f.c,f.r,f.exit);
    if(f.p<0.5){const k=f.p*2;return{x:a.x+(cx-a.x)*k,y:a.y+(cy-a.y)*k}}const k=(f.p-0.5)*2;return{x:cx+(b.x-cx)*k,y:cy+(b.y-cy)*k}},
  down(x,y){const c=Math.floor((x-this.ox)/this.s),r=Math.floor((y-this.oy)/this.s),t=this.tile(c,r);if(!t)return;
    if(t.ash)return;if(t.active>0){Snd.noise(0.06,0.04,900);return}
    t.m=rotm(t.m);t.ang=90;Snd.tone(note(7+(c+r)%5),0.06,'square',0.025);buzz(8)},
  move(){},up(){},
  update(dt,live){stepParts(this.parts,dt);stepPops(this.pops,dt);
    for(let i=0;i<this.grid.length;i++){const t=this.grid[i];t.ang=Math.max(0,t.ang-dt*900);t.drop=RM?0:Math.max(0,t.drop-dt*4);if(t.ash){t.ashT+=dt;if(t.ashT>0.9&&t.active<=0)this.grid[i]=this.newTile()}}
    if(!live)return;if(this.wait>0){this.wait-=dt;return}this.t+=dt;
    const tt=Math.max(0.55,1.45-this.t*0.009),next=[];
    for(const f of this.flames){f.p+=dt/tt;const fp=this.fpos(f);if(!RM&&Math.random()<0.6)this.parts.push({x:fp.x,y:fp.y,vx:rand(-30,30),vy:rand(-70,-20),life:0,max:rand(0.25,0.5),color:Math.random()<0.5?C.fuse:C.lasso,size:rand(1.5,3)});
      if(f.p<1){next.push(f);continue}
      const tile=this.tile(f.c,f.r);tile.active--;if(tile.active<=0){tile.ash=true;tile.ashT=0;this.burned++;this.score+=this.flames.length;Snd.noise(0.08,0.035,2400,2)}
      const v=DIRS[f.exit],nc=f.c+v[0],nr=f.r+v[1],nt=this.tile(nc,nr),ent=opp(f.exit);
      if(nt&&!nt.ash&&(nt.m&ent)){next.push.apply(next,this.enter(nc,nr,ent,f.p-1))}
      else{const e=this.sidePt(f.c,f.r,f.exit);burst(this.parts,e.x,e.y,C.muted,14,120,2.5);Snd.noise(0.25,0.06,700,0.7);buzz(25);pop(this.pops,e.x,e.y-10,'Fizzled',C.muted)}}
    this.flames=next;
    if(!next.length){Snd.lose();buzz([40,40,80]);gameOver('Every flame fizzled after '+this.burned+' tiles.','fizzle')}},
  revive(){let best=null,bd=1e9;const cc=(this.COLS-1)/2,rc=(this.rows-1)/2;
    for(let r=0;r<this.rows;r++)for(let c=0;c<this.COLS;c++){const t=this.tile(c,r);if(t.active>0)continue;const d=Math.hypot(c-cc,r-rc);if(d<bd){bd=d;best={c,r}}}
    const t=this.tile(best.c,best.r);t.m=15;t.kind='cross';t.ash=false;t.drop=1;t.ang=0;this.flames=this.enter(best.c,best.r,SS,0);this.wait=1.2;
    const up=this.tile(best.c,best.r-1);if(up&&up.active===0&&!up.ash){up.m=5;up.kind='straight';up.ang=90}
    pop(this.pops,this.ox+(best.c+0.5)*this.s,this.oy+best.r*this.s,'Relit',C.fuse)},
  level(){return'endless'},
  result(){return this.score},
  hud(){return[this.score,this.flames.length]},
  draw(){const s=this.s,rope='#7a6550',ropeW=Math.max(4,s*0.11);
    for(let r=0;r<this.rows;r++)for(let c=0;c<this.COLS;c++){const t=this.tile(c,r),x=this.ox+c*s,y=this.oy+r*s,cx=x+s/2,cy=y+s/2-t.drop*s*0.5;
      ctx.save();ctx.globalAlpha=1-t.drop;ctx.translate(cx,cy);ctx.rotate(-t.ang*Math.PI/180);
      rrect(-s/2+2,-s/2+2,s-4,s-4,Math.max(6,s*0.14));ctx.fillStyle=t.ash?'#14161f':C.raise;ctx.fill();
      if(t.ash){const k=Math.max(0,1-t.ashT/0.9);ctx.fillStyle=C.fuse;for(let i=0;i<5;i++){const a=(t.seed*97+i*2.3)%6.28,d=(t.seed*31+i*0.17)%0.35;ctx.globalAlpha=(1-t.drop)*k*0.8;ctx.fillRect(Math.cos(a)*s*d,Math.sin(a)*s*d,2,2)}}
      else{ctx.strokeStyle=rope;ctx.lineWidth=ropeW;ctx.lineCap='round';ctx.beginPath();[1,2,4,8].forEach(d=>{if(t.m&d){const v=DIRS[d];ctx.moveTo(0,0);ctx.lineTo(v[0]*s/2,v[1]*s/2)}});ctx.stroke();
        if(t.kind!=='straight'&&t.kind!=='cross'){ctx.fillStyle=rope;ctx.beginPath();ctx.arc(0,0,ropeW*0.9,0,Math.PI*2);ctx.fill()}
        if(t.kind==='tee'){ctx.fillStyle=C.lasso;ctx.beginPath();ctx.arc(0,0,ropeW*0.45,0,Math.PI*2);ctx.fill()}}
      ctx.restore()}
    // next-tile hint
    for(const f of this.flames){const v=DIRS[f.exit],nc=f.c+v[0],nr=f.r+v[1],nt=this.tile(nc,nr);if(!nt)continue;const ok=!nt.ash&&(nt.m&opp(f.exit));
      ctx.strokeStyle=ok?C.fuse:C.bad;ctx.globalAlpha=ok?0.7:RM?0.75:0.45+0.3*Math.sin(performance.now()/120);ctx.lineWidth=2;rrect(this.ox+nc*s+3,this.oy+nr*s+3,s-6,s-6,Math.max(6,s*0.13));ctx.stroke();ctx.globalAlpha=1}
    // burned path + flame heads
    for(const f of this.flames){const a=this.sidePt(f.c,f.r,f.entry),p=this.fpos(f),cx=this.ox+(f.c+0.5)*s,cy=this.oy+(f.r+0.5)*s;
      ctx.save();ctx.strokeStyle=C.fuse;ctx.shadowColor=C.fuse;ctx.shadowBlur=12;ctx.lineWidth=ropeW;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(a.x,a.y);if(f.p>0.5)ctx.lineTo(cx,cy);ctx.lineTo(p.x,p.y);ctx.stroke();ctx.restore();
      const g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,ropeW*2.6);g.addColorStop(0,'#fff6d6');g.addColorStop(0.35,C.lasso);g.addColorStop(1,'rgba(255,122,61,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(p.x,p.y,ropeW*2.6,0,Math.PI*2);ctx.fill()}
    drawParts(this.parts);drawPops(this.pops);
    if(this.wait>0&&state==='play'){ctx.fillStyle=C.fg;ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=F(700,15,'d');ctx.fillText('Lighting in '+this.wait.toFixed(1),this.w/2,this.oy-16>40?this.oy-16:this.h-24)}}
};

const GAME=Fuse;
