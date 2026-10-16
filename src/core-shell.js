/* ---------- shell: one game per page ---------- */
const cur=GAME, name=GAME_ID;
let state='ready',won=false,reviveUsed=false,cause='',causeCode='',dieT=0,newBest=false,lastT=0,reviving=null,pausedFrom=null,runStart=0,playMs=0,surveyAsked=false;
function gameOver(why,code){if(state!=='play')return;state='dying';cause=why;causeCode=code||'lost';won=false;dieT=RM?0.3:0.8}
function winRound(why){if(state!=='play')return;state='dying';cause=why;causeCode='';won=true;dieT=RM?0.3:0.9}
function result(){return cur.result?cur.result():cur.hud()[0]}
function finish(){state='over';syncPause();
  const level=cur.level?cur.level():'endless',dur=Math.round(performance.now()-runStart);
  if(won)hubEvent('level_complete',{level,score:Number(result())||0,duration_ms:dur});else hubEvent('level_fail',{level,cause:causeCode});
  if(!cur.customCard){const best=store.get('proto.'+name+'.best',0),sc=Number(result())||0;newBest=sc>best&&sc>0;if(newBest)store.set('proto.'+name+'.best',sc)}
  showCard('over');
  // The hub's survey, at a natural break, once the tester has played a few minutes.
  if(HUB&&!surveyAsked&&playMs>=180000){surveyAsked=true;setTimeout(()=>{if(state==='over')window.Playtest?.survey()},1200)}}
function hubEvent(n,p){track(n,p)}

function fit(){const r=cv.getBoundingClientRect(),d=Math.min(window.devicePixelRatio||1,2);cv.width=Math.max(1,Math.round(r.width*d));cv.height=Math.max(1,Math.round(r.height*d));ctx=cv.getContext('2d');ctx.setTransform(d,0,0,d,0,0);W=r.width;H=r.height;if(cur.w!=null)cur.resize(W,H)}

function start(){if(reviving){clearInterval(reviving);reviving=null}Snd.ensure();cur.reset(W,H);state='play';won=false;reviveUsed=false;runStart=performance.now();hideCard();syncPause();
  hubEvent('level_start',{level:cur.level?cur.level():'endless'})}

function showCard(kind){card.hidden=false;stage.classList.add('dim');if(cur.customCard){cur.customCard(kind);focusCard();return}const m=cur.meta,best=store.get('proto.'+name+'.best',0);
  if(kind==='ready'){card.innerHTML='<p class="eyebrow">Prototype</p><h1>'+m.title+'</h1><p class="tag">'+m.tag+'</p><ul class="rules">'+m.rules.map(r=>'<li>'+r+'</li>').join('')+'</ul><div class="actions"><button class="btn primary" id="play">Play '+m.title+'</button></div>'+(best?'<p class="best">Your best <b>'+best+'</b></p>':'');
    $('#play').addEventListener('click',start)}
  else{const sc=result();
    card.innerHTML='<p class="eyebrow">Run over</p><h1 class="score">'+sc+'</h1><p class="tag">'+cause+'</p><p class="best">'+(newBest?'<b>New best.</b> ':'Best <b>'+store.get('proto.'+name+'.best',0)+'</b>')+'</p><div class="actions">'+(reviveUsed?'':'<button class="btn" id="revive">Revive</button>')+'<button class="btn primary" id="again">Play again</button></div><p class="fine">Revive stands in for a rewarded ad: one per run, and it never touches your score.</p>';
    $('#again').addEventListener('click',start);const rv=$('#revive');if(rv)rv.addEventListener('click',()=>doRevive(rv))}
  focusCard()}
function focusCard(){const b=card.querySelector('.btn.primary');if(b)try{b.focus({preventScroll:true})}catch(e){}}
function hideCard(){card.hidden=true;stage.classList.remove('dim')}
function adPlaceholder(btn,label,done){Snd.ensure();card.querySelectorAll('button').forEach(b=>b.disabled=true);let n=2;btn.textContent=label+' '+n;
  reviving=setInterval(()=>{n--;if(n>0){btn.textContent=label+' '+n;return}clearInterval(reviving);reviving=null;done();syncPause();Snd.tone(note(5),0.2,'triangle',0.06);Snd.tone(note(7),0.2,'triangle',0.05,0.08)},1000)}
function doRevive(btn){adPlaceholder(btn,'Ad playing…',()=>{reviveUsed=true;track(name+'.revive',{level:cur.level?cur.level():'endless'});cur.revive();state='play';hideCard()})}

/* ---------- pause: our menu, or the hub opening feedback or a survey ---------- */
function pause(fromHub){if(state!=='play')return;state='paused';pausedFrom=fromHub?'hub':'menu';cur.up&&cur.up();if(fromHub){syncPause();return}
  card.hidden=false;stage.classList.add('dim');
  card.innerHTML='<p class="eyebrow">Paused</p><h1>'+cur.meta.title+'</h1><div class="actions"><button class="btn" id="quit">Quit to menu</button><button class="btn primary" id="resume">Resume</button></div>';
  $('#resume').addEventListener('click',resume);$('#quit').addEventListener('click',quitRun);focusCard();syncPause()}
function resume(){if(state!=='paused')return;state='play';pausedFrom=null;hideCard();syncPause()}
function quitRun(){hubEvent('quit',{level:cur.level?cur.level():'endless'});state='ready';pausedFrom=null;cur.reset(W,H);showCard('ready');syncPause()}
window.Playtest?.on('pause',()=>pause(true));
window.Playtest?.on('resume',()=>{if(pausedFrom==='hub')resume()});
document.addEventListener('visibilitychange',()=>{if(document.hidden)pause(false)});

let lastHud='';
function hud(){const h=cur.hud(),s=h.join('|');if(s!==lastHud){lastHud=s;$('#v1').textContent=h[0];$('#v2').textContent=h[1];$('#k1').textContent=h[2]||'Score';$('#k2').textContent=h[3]||cur.meta.second}}

function frame(t){const dt=Math.min(0.05,lastT?(t-lastT)/1000:0);lastT=t;
  if(state==='play')playMs+=dt*1000;
  cur.update(dt,state==='play');if(state==='dying'){dieT-=dt;if(dieT<=0)finish()}
  ctx.clearRect(0,0,W,H);cur.draw();hud();
  requestAnimationFrame(frame)}

/* ---------- input ---------- */
function pt(e){const r=cv.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}}
cv.addEventListener('pointerdown',e=>{if(state!=='play')return;e.preventDefault();try{cv.setPointerCapture(e.pointerId)}catch(_){}const p=pt(e);cur.down(p.x,p.y)});
cv.addEventListener('pointermove',e=>{if(state!=='play')return;const p=pt(e);if(e.buttons||e.pointerType==='touch')cur.move(p.x,p.y)});
['pointerup','pointercancel'].forEach(ev=>cv.addEventListener(ev,()=>{if(state==='play')cur.up()}));
const MOVE_KEYS=['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','w','a','s','d'];
window.addEventListener('keydown',e=>{if(e.key==='Escape'){if(state==='play')pause(false);else if(state==='paused'&&pausedFrom==='menu')resume();return}if(cur.key&&state==='play'&&MOVE_KEYS.includes(e.key)){cur.key(e.key,true);e.preventDefault()}});
window.addEventListener('keyup',e=>{if(cur.key)cur.key(e.key,false)});

/* ---------- header controls ---------- */
const pb=$('#pause');function syncPause(){pb.hidden=!(state==='play')}
pb.addEventListener('click',()=>pause(false));
const sb=$('#sound');function syncSound(){sb.setAttribute('aria-pressed',String(Snd.on));sb.textContent=Snd.on?'Sound on':'Sound off'}
sb.addEventListener('click',()=>{Snd.on=!Snd.on;store.set('proto.sound',Snd.on);if(Snd.on)Snd.ensure();syncSound()});syncSound();
const tb=$('#textsize'),TS_LABEL={1:'Normal',1.25:'Large',1.5:'Larger'},TS_SHORT={1:'Text M',1.25:'Text L',1.5:'Text XL'};
function syncText(){document.documentElement.style.fontSize=(100*TS)+'%';tb.textContent=TS_SHORT[TS];tb.setAttribute('aria-label','Text size: '+TS_LABEL[TS]+'. Tap to change.')}
tb.addEventListener('click',()=>{TS=TEXT_SCALES[(TEXT_SCALES.indexOf(TS)+1)%TEXT_SCALES.length];store.set('proto.textScale',TS);syncText();requestAnimationFrame(fit)});syncText();

if(HUB)document.body.classList.add('hub');
window.Playtest?.setScreenshot(()=>cv.toDataURL('image/png'));
window.addEventListener('resize',fit);
fit();cur.reset(W,H);showCard('ready');syncPause();
requestAnimationFrame(frame);
window.Playtest?.ready();
