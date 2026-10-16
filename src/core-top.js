"use strict";
/* Shared prototype core. Concatenated as: core-top.js, <game>.js, core-shell.js, inside one IIFE.
   The game file defines GAME (its object) before the shell runs. */
const $=s=>document.querySelector(s);
const cv=$('#cv'), stage=$('#stage'), card=$('#card');
let ctx=cv.getContext('2d'), W=1, H=1;
const css=getComputedStyle(document.documentElement);
const C={};['ink','panel','raise','line','fg','muted','echo','ghost','lasso','flock','fuse','bad'].forEach(k=>C[k]=css.getPropertyValue('--'+k).trim());
const FONT_D='Unbounded, "Arial Black", system-ui, sans-serif';
const FONT_B='Figtree, system-ui, -apple-system, "Segoe UI", sans-serif';

/* ---------- storage, settings, accessibility ---------- */
const store={get(k,d){try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const TEXT_SCALES=[1,1.25,1.5];
let TS=TEXT_SCALES.includes(store.get('proto.textScale',1))?store.get('proto.textScale',1):1;
// Canvas text: scaled with the Large text setting, never under 12px.
function F(weight,px,fam){return weight+' '+Math.round(Math.max(12,px)*TS)+'px '+(fam==='d'?FONT_D:FONT_B)}
const rmQuery=window.matchMedia?window.matchMedia('(prefers-reduced-motion: reduce)'):null;
let RM=!!(rmQuery&&rmQuery.matches);
if(rmQuery&&rmQuery.addEventListener)rmQuery.addEventListener('change',e=>{RM=e.matches});

/* ---------- playtest hub (optional: the game runs the same without it) ---------- */
const HUB=!!window.Playtest;
function track(name,props){try{window.Playtest?.event(name,props||{})}catch(e){}}

/* ---------- helpers ---------- */
const rand=(a,b)=>a+Math.random()*(b-a);
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
function buzz(p){try{if(navigator.vibrate)navigator.vibrate(p)}catch(e){}}
function burst(arr,x,y,color,n,spd,size){if(RM)return;n=n||14;spd=spd||160;size=size||3;for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,s=spd*(0.3+Math.random()*0.7);arr.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:0,max:0.35+Math.random()*0.45,color,size:size*(0.6+Math.random()*0.8)})}}
function stepParts(arr,dt){for(let i=arr.length-1;i>=0;i--){const p=arr[i];p.life+=dt;if(p.life>=p.max){arr.splice(i,1);continue}p.x+=p.vx*dt;p.y+=p.vy*dt;const k=Math.pow(0.12,dt);p.vx*=k;p.vy*=k}}
function drawParts(arr){for(const p of arr){const k=1-p.life/p.max;ctx.globalAlpha=k;ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x,p.y,p.size*k+0.4,0,Math.PI*2);ctx.fill()}ctx.globalAlpha=1}
function pop(arr,x,y,text,color){arr.push({x,y,text,color,t:0})}
function stepPops(arr,dt){for(let i=arr.length-1;i>=0;i--){arr[i].t+=dt;if(arr[i].t>0.9)arr.splice(i,1)}}
function drawPops(arr){ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=F(700,13,'d');for(const p of arr){ctx.globalAlpha=Math.max(0,1-p.t/0.9);ctx.fillStyle=p.color;ctx.fillText(p.text,p.x,p.y-(RM?0:p.t*34))}ctx.globalAlpha=1}
function segInt(a,b,c,d){const r1=b.x-a.x,r2=b.y-a.y,s1=d.x-c.x,s2=d.y-c.y,den=r1*s2-r2*s1;if(Math.abs(den)<1e-9)return null;const t=((c.x-a.x)*s2-(c.y-a.y)*s1)/den,u=((c.x-a.x)*r2-(c.y-a.y)*r1)/den;if(t>=0&&t<=1&&u>=0&&u<=1)return{x:a.x+t*r1,y:a.y+t*r2};return null}
function pip(poly,x,y){let inside=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const a=poly[i],b=poly[j];if(((a.y>y)!==(b.y>y))&&(x<(b.x-a.x)*(y-a.y)/(b.y-a.y)+a.x))inside=!inside}return inside}
function rrect(x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()}
function dotGrid(gap,color){ctx.fillStyle=color;for(let y=gap/2;y<H;y+=gap)for(let x=gap/2;x<W;x+=gap){ctx.fillRect(x,y,1.5,1.5)}}

/* ---------- sound (A minor pentatonic, synthesized) ---------- */
const SCALE=[220,261.63,293.66,329.63,392];
const note=i=>SCALE[((i%5)+5)%5]*Math.pow(2,Math.floor(i/5));
const Snd={ctx:null,on:store.get('proto.sound',true),master:null,nb:null,
  ensure(){try{if(!this.ctx){const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;this.ctx=new AC();this.master=this.ctx.createGain();this.master.gain.value=0.7;this.master.connect(this.ctx.destination)}if(this.ctx.state==='suspended')this.ctx.resume()}catch(e){}},
  tone(f,d,type,g,when){if(!this.on||!this.ctx)return;d=d||0.18;g=g||0.07;const t=this.ctx.currentTime+(when||0);const o=this.ctx.createOscillator(),a=this.ctx.createGain();o.type=type||'triangle';o.frequency.value=f;a.gain.setValueAtTime(0.0001,t);a.gain.exponentialRampToValueAtTime(g,t+0.012);a.gain.exponentialRampToValueAtTime(0.0001,t+d);o.connect(a).connect(this.master);o.start(t);o.stop(t+d+0.05)},
  noise(d,g,f,q){if(!this.on||!this.ctx)return;const c=this.ctx;if(!this.nb){const len=Math.floor(c.sampleRate*0.5);this.nb=c.createBuffer(1,len,c.sampleRate);const a=this.nb.getChannelData(0);for(let i=0;i<len;i++)a[i]=Math.random()*2-1}const s=c.createBufferSource();s.buffer=this.nb;const bp=c.createBiquadFilter();bp.type='bandpass';bp.frequency.value=f||1500;bp.Q.value=q||1;const a=c.createGain();const t=c.currentTime;a.gain.setValueAtTime(g||0.05,t);a.gain.exponentialRampToValueAtTime(0.0001,t+(d||0.12));s.connect(bp).connect(a).connect(this.master);s.start(t);s.stop(t+(d||0.12)+0.02)},
  bleat(f){if(!this.on||!this.ctx)return;const c=this.ctx,t=c.currentTime,o=c.createOscillator(),l=c.createOscillator(),lg=c.createGain(),lp=c.createBiquadFilter(),a=c.createGain();o.type='sawtooth';o.frequency.setValueAtTime(f,t);o.frequency.linearRampToValueAtTime(f*0.86,t+0.42);l.frequency.value=9;lg.gain.value=f*0.06;l.connect(lg).connect(o.frequency);lp.type='lowpass';lp.frequency.value=1500;a.gain.setValueAtTime(0.0001,t);a.gain.exponentialRampToValueAtTime(0.06,t+0.04);a.gain.exponentialRampToValueAtTime(0.0001,t+0.45);o.connect(lp).connect(a).connect(this.master);o.start(t);l.start(t);o.stop(t+0.5);l.stop(t+0.5)},
  howl(){if(!this.on||!this.ctx)return;const c=this.ctx,t=c.currentTime,o=c.createOscillator(),a=c.createGain();o.type='sine';o.frequency.setValueAtTime(320,t);o.frequency.linearRampToValueAtTime(560,t+0.35);o.frequency.linearRampToValueAtTime(400,t+1.0);a.gain.setValueAtTime(0.0001,t);a.gain.exponentialRampToValueAtTime(0.05,t+0.15);a.gain.exponentialRampToValueAtTime(0.0001,t+1.05);o.connect(a).connect(this.master);o.start(t);o.stop(t+1.1)},
  woof(){this.tone(210,0.08,'square',0.035);this.tone(150,0.1,'square',0.03,0.07);this.noise(0.1,0.04,700,1)},
  lose(){[7,5,3,0].forEach((n,i)=>this.tone(note(n),0.3,'triangle',0.07,i*0.11))}
};
