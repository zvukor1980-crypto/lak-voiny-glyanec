'use strict';
/* ===== Лаковые воины: Глянец ===== */
const COIN_SVG="data:image/svg+xml,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><defs><radialGradient id="g" cx="35%" cy="30%"><stop offset="0" stop-color="#fff3b0"/><stop offset=".55" stop-color="#f0b830"/><stop offset="1" stop-color="#9a6410"/></radialGradient></defs><circle cx="20" cy="20" r="18" fill="url(#g)" stroke="#6a400a" stroke-width="2.5"/><path d="M10 26 L11.5 14 L16 19 L20 11 L24 19 L28.5 14 L30 26 Z" fill="#7a4a08"/><rect x="10" y="26" width="20" height="3" rx="1" fill="#7a4a08"/></svg>');
const CI=`<img class="ic-coin" src="${COIN_SVG}">`;
const ERAS=[
 {n:'Каменный век',u:['Дубинщица','Метательница копий','Наездница раптора'],bg:1,proj:'spear'},
 {n:'Ферма',u:['Фермерша с вилами','Лучница','Всадница с пикой'],bg:1,proj:'arrow'},
 {n:'Спарта',u:['Спартанка','Лучница Спарты','Конница Спарты'],bg:1,proj:'arrow'},
 {n:'Ренессанс',u:['Фехтовальщица','Мушкетёрша','Канонирша'],bg:1,proj:'bullet'},
 {n:'Современность',u:['Штурмовица','Стрелок','Байкерша'],bg:2,proj:'bullet'},
 {n:'Космос',u:['Звёздный клинок','Бластерщица','Ховер-байкерша'],bg:3,proj:'laser'}];
const ERA_MULT=[1,2.6,6.5,16,40,100];
const UTYPE=[
 {hp:32,dmg:7,range:20,spd:30,cd:1.0,cost:6,h:1},
 {hp:20,dmg:6,range:115,spd:28,cd:1.35,cost:10,h:1,ranged:1},
 {hp:120,dmg:15,range:26,spd:42,cd:1.15,cost:22,h:1.2}];
const HEROES=[
 {n:'Царица амазонок',role:'Ближний бой, бьёт по площади',hp:9,dmg:3.2,range:28,spd:30,cd:1.05,splash:45,gem:0},
 {n:'Королева ночи',role:'Тёмная магия издалека',hp:5,dmg:2.6,range:135,spd:27,cd:1.2,splash:34,ranged:1,proj:'magic',gem:300},
 {n:'Валькирия',role:'Быстрые и частые удары',hp:7,dmg:2.6,range:24,spd:48,cd:.55,gem:600},
 {n:'Императрица',role:'Аура лечит союзниц',hp:12,dmg:2.4,range:26,spd:28,cd:1.0,aura:1,gem:1200}];
const HERO_COST=35;
const EQUIP=[{n:'Оружие',i:'🗡️',d:'+10% урона героини'},{n:'Лаковая броня',i:'🛡️',d:'+10% здоровья героини'},{n:'Украшение',i:'💍',d:'+5% монет за битву'}];
const SKILLS=[
 {id:'meteor',n:'Метеорит',i:'☄️',d:'Огненный дождь по врагам',c:''},
 {id:'freeze',n:'Заморозка',i:'❄️',d:'Враги замирают на 4 сек',c:'c1'},
 {id:'rage',n:'Ярость',i:'🔥',d:'Союзницы сильнее и быстрее 7 сек',c:'c2'},
 {id:'shield',n:'Щит',i:'🛡️',d:'База неуязвима, урон по союзницам −50%',c:'c3'},
 {id:'heal',n:'Исцеление',i:'💚',d:'Лечит союзниц и базу',c:'c4'}];
const SKILL_COST=[0,200,400,700,1000];
const RAR=['Обычная','Редкая','Эпическая','Легендарная','Ультимативная'];
const RAR_P=[55,27,12,5,1];
const CARDS=[
 {n:'Сытный паёк',i:'🥩',r:0,st:'food',v:.05,d:'еда'},
 {n:'Крепкие стены',i:'🏰',r:0,st:'base',v:.06,d:'здоровье базы'},
 {n:'Острые клинки',i:'⚔️',r:0,st:'melee',v:.06,d:'урон ближних'},
 {n:'Меткий глаз',i:'🏹',r:0,st:'ranged',v:.06,d:'урон стрелков'},
 {n:'Лаковая броня',i:'🛡️',r:1,st:'uhp',v:.05,d:'здоровье воительниц'},
 {n:'Блестящая казна',i:'💰',r:1,st:'coin',v:.08,d:'монеты'},
 {n:'Ранний подъём',i:'⏰',r:1,st:'start',v:3,d:'стартовая еда',flat:1},
 {n:'Боевой галоп',i:'🐎',r:2,st:'heavy',v:.08,d:'урон всадниц'},
 {n:'Пламя небес',i:'☄️',r:2,st:'skill',v:.15,d:'сила умений'},
 {n:'Лёгкая поступь',i:'👠',r:2,st:'speed',v:.04,d:'скорость'},
 {n:'Сердце царицы',i:'❤️',r:3,st:'hero',v:.12,d:'сила героини'},
 {n:'Глянцевый блеск',i:'✨',r:3,st:'uhp',v:.09,d:'здоровье воительниц'},
 {n:'Золотая эпоха',i:'👑',r:3,st:'coin',v:.15,d:'монеты'},
 {n:'Корона Глянца',i:'💄',r:4,st:'all',v:.10,d:'весь урон'},
 {n:'Вечный лак',i:'💎',r:4,st:'food',v:.12,d:'еда'}];
const POTIONS=[{id:'food',n:'Зелье еды',i:'🧪',d:'+50% еды в битве'},{id:'hp',n:'Зелье крепости',i:'❤️‍🔥',d:'+50% здоровья базы'},{id:'coin',n:'Зелье богатства',i:'💰',d:'×2 монет за битву'},{id:'rage',n:'Зелье ярости',i:'⚗️',d:'+25% урона воительниц'}];
const TASKS=[{t:'win',n:'Победи в битвах',g:3,gm:60},{t:'spawn',n:'Призови воительниц',g:40,gm:50},{t:'kill',n:'Победи врагинь',g:60,gm:60},{t:'skill',n:'Используй умения',g:5,gm:50},{t:'spin',n:'Покрути колесо',g:3,gm:40},{t:'cards',n:'Открой карты',g:5,gm:50},{t:'upg',n:'Купи улучшения',g:5,gm:40}];
const FUND=[3,5,8,10,15,20,30,40,50,75];

/* ===== save ===== */
const KEY='lvg_glyanec_v1';
function defSave(){return{coins:50,gems:300,era:0,tl:0,battle:1,best:1,foodL:0,hpL:0,unl:[1,0,0],sk:{meteor:1},skEq:['meteor'],cards:{},heroes:{0:{lv:1,eq:[0,0,0]}},hero:0,
 x2:0,spd2:0,noads:1,potions:{food:0,hp:0,coin:0,rage:0},potUse:{},passXp:0,passPrem:0,passC:{},fundC:{},dung:1,stats:{win:0,spawn:0,kill:0,skill:0,spin:0,cards:0,upg:0},tasks:null,speed:1,snd:1,evoTotal:0,wins:0}}
let S;try{S=Object.assign(defSave(),JSON.parse(localStorage.getItem(KEY)||'{}'))}catch(e){S=defSave()}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
if(!S.tasks)newTasks();
function newTasks(){const pool=TASKS.slice().sort(()=>Math.random()-.5).slice(0,4);S.tasks=pool.map(t=>({t:t.t,b:S.stats[t.t]||0,c:0}))}

/* ===== helpers ===== */
const $=s=>document.querySelector(s);
const SUF=['','K','M','B','T','AA','AB','AC','AD','AE'];
function fmt(n){n=Math.floor(n);if(n<1000)return ''+n;let i=0;while(n>=1000&&i<SUF.length-1){n/=1000;i++}return (n<10?n.toFixed(1):n<100?n.toFixed(1):Math.floor(n))+SUF[i]}
function em(){return ERA_MULT[S.era]*Math.pow(1.6,S.tl)}
function cb(st){let s=0;for(const k in S.cards){const c=CARDS[k],o=S.cards[k];if(c&&o.lv>0&&(c.st===st))s+=c.v*o.lv}return s}
function toast(t){const T=$('#toasts');while(T.children.length>1)T.firstChild.remove();const d=document.createElement('div');d.className='toast';d.innerHTML=t;$('#toasts').appendChild(d);setTimeout(()=>d.remove(),2300)}
function addCoins(n){S.coins+=Math.round(n)}
function rnd(a,b){return a+Math.random()*(b-a)}

/* ===== audio ===== */
let AC=null,MG=null;
function au(){if(!AC){try{AC=new (window.AudioContext||window.webkitAudioContext)();MG=AC.createGain();MG.gain.value=.5;MG.connect(AC.destination)}catch(e){}}if(AC&&AC.state==='suspended')AC.resume();return AC}
function tone(f,d,type='sine',v=.3,f2=null,delay=0){if(!S.snd||!AC)return;const t=AC.currentTime+delay,o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(MG);o.start(t);o.stop(t+d+.02)}
let NB=null;
function noise(d,v=.3,fq=1200,delay=0){if(!S.snd||!AC)return;if(!NB){NB=AC.createBuffer(1,AC.sampleRate,AC.sampleRate);const a=NB.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=Math.random()*2-1}const t=AC.currentTime+delay,s=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain();s.buffer=NB;f.type='bandpass';f.frequency.value=fq;g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);s.connect(f);f.connect(g);g.connect(MG);s.start(t);s.stop(t+d)}
let lastHit=0;
const SFX={
 tap(){tone(660,.06,'triangle',.15)},
 spawn(){tone(420,.08,'square',.08,620);tone(880,.1,'triangle',.08,null,.04)},
 hit(){const n=performance.now();if(n-lastHit<45)return;lastHit=n;noise(.07,.18,1800+Math.random()*900)},
 shoot(){const n=performance.now();if(n-lastHit<40)return;lastHit=n;noise(.09,.1,3500);tone(900,.06,'sawtooth',.03,300)},
 boom(){noise(.6,.5,300);tone(120,.5,'sine',.4,40)},
 coin(){tone(1320,.07,'square',.05);tone(1760,.1,'square',.05,null,.06)},
 win(){[523,659,784,1047].forEach((f,i)=>tone(f,.25,'triangle',.2,null,i*.12))},
 lose(){[392,330,262,196].forEach((f,i)=>tone(f,.3,'sawtooth',.08,null,i*.15))},
 freeze(){tone(2000,.6,'sine',.12,400);noise(.5,.15,6000)},
 heal(){[600,800,1000].forEach((f,i)=>tone(f,.2,'sine',.12,null,i*.07))},
 rage(){tone(110,.5,'sawtooth',.2,220);noise(.3,.2,800)},
 evo(){[262,330,392,523,659,784,1047].forEach((f,i)=>tone(f,.35,'triangle',.18,null,i*.09))},
 card(){tone(500,.12,'triangle',.12,1200)},
 tick(){tone(1500,.02,'square',.05)}};

/* ===== images ===== */
const IMG={};
const silW={},silB={};
function assetList(){const a=[];for(let e=0;e<6;e++){for(let i=0;i<3;i++){a.push('u'+e+'_'+i,'e'+e+'_'+i,'p'+e+'_'+i)}a.push('b'+e,'eb'+e)}for(let i=0;i<4;i++)a.push('h'+i,'ph'+i);a.push('bg1','bg2','bg3');return a}
function loadAll(cb){const L=assetList();let n=0;L.forEach(k=>{const im=new Image();im.onload=im.onerror=()=>{n++;$('#ldfill').style.width=(n/L.length*100)+'%';if(n===L.length)cb()};im.src='assets/'+k+'.webp';IMG[k]=im})}
function sil(k,col){const im=IMG[k];if(!im||!im.width)return null;const store=col==='w'?silW:silB;if(store[k])return store[k];const h=Math.min(200,im.height),w=Math.round(im.width*h/im.height);const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');x.drawImage(im,0,0,w,h);x.globalCompositeOperation='source-in';x.fillStyle=col==='w'?'#fff':'#7fd4ff';x.fillRect(0,0,w,h);store[k]=c;return c}
const P=(e,i)=>'assets/p'+e+'_'+i+'.webp',U=(e,i)=>'assets/u'+e+'_'+i+'.webp';

/* ===== battle ===== */
let B=null;
const cv=document.getElementById('cv');const ctx=cv.getContext('2d');
let DPR=1,CW=0,CH=0,SC=1,LANE=0,BG=null,BGR={x:0,y:0,w:0,h:0};
function layoutBattle(){
 const dock=$('#dock');const dh=dock.offsetHeight||200;
 DPR=Math.min(3,window.devicePixelRatio||1);CW=window.innerWidth;CH=window.innerHeight-dh+20;
 cv.width=Math.round(CW*DPR);cv.height=Math.round(CH*DPR);cv.style.height=CH+'px';
 SC=Math.min(CW/390,CH/560);SC=Math.max(.7,Math.min(1.5,SC));
 BG=IMG['bg'+ERAS[S.era].bg];const roadC=ERAS[S.era].bg===1?.475:ERAS[S.era].bg===2?.48:.49;const s=Math.max(CW/720,CH/1280)*1.3;const ry=CH*.47;BGR={w:720*s,h:1280*s,x:(CW-720*s)/2,y:ry-1280*s*roadC};
 LANE=ry+22*SC;
 if(B){B.lx=Math.max(60*SC,CW*.17);B.rx=CW-B.lx}}
function heroStats(){const h=HEROES[S.hero],o=S.heroes[S.hero]||{lv:1,eq:[0,0,0]};const m=em()*(1+.15*(o.lv-1))*(1+cb('hero'));
 return{hp:UTYPE[0].hp*h.hp*m*(1+.1*o.eq[1])*(1+cb('uhp')),dmg:UTYPE[0].dmg*h.dmg*m*(1+.1*o.eq[0])*(1+cb('all')),range:h.range,spd:h.spd,cd:h.cd,splash:h.splash||0,ranged:h.ranged,proj:h.proj,aura:h.aura}}
function startBattle(mode){
 au();mode=mode||'main';
 const pot={};for(const k in S.potUse)if(S.potUse[k]&&S.potions[k]>0){S.potions[k]--;pot[k]=1}S.potUse={};
 const diffN=mode==='dung'?(S.battle+2+S.dung*2):S.battle;
 const diff=(1+.16*(diffN-1))*Math.pow(1.2,S.tl)*(mode==='dung'?1.25:1);
 const m=em();
 const baseHp=100*m*(1+.22*S.hpL)*(1+cb('base'))*(pot.hp?1.5:1);
 B={mode,t:0,diff,pot,units:[],proj:[],parts:[],food:6+cb('start'),foodRate:1.55*(1+.14*S.foodL)*(1+cb('food'))*(pot.food?1.5:1),
  ef:0,eRate:Math.min(5.5,1.45*(1+.08*(diffN-1)))*(mode==='dung'?1.3:1),eNext:null,eDelay:2.5,
  pb:{hp:baseHp,max:baseHp,fl:0,inv:0},eb:{hp:130*m*diff*(mode==='dung'?1.6:1),max:0,fl:0},
  collected:0,used:{},rage:0,shieldT:0,over:0,overT:0,shake:0,heroAlive:0,spawned:0,kills:0,lx:0,rx:0,diffN};
 B.eb.max=B.eb.hp;
 $('#hub').classList.add('hidden');$('#battle').classList.remove('hidden');
 renderDock();layoutBattle();renderBHud();
 lastT=performance.now();if(!rafOn){rafOn=1;requestAnimationFrame(loop)}}
function unitStats(side,type){const m=em();const u=UTYPE[type];
 if(side===0){const dm=(1+cb('all'))*(1+(type===0?cb('melee'):type===1?cb('ranged'):cb('heavy')))*(B.pot.rage?1.25:1);
  return{hp:u.hp*m*(1+cb('uhp')),dmg:u.dmg*m*dm,range:u.range,spd:u.spd*(1+cb('speed')),cd:u.cd,ranged:u.ranged,proj:ERAS[S.era].proj,splash:(S.era===3&&type===2)?30:0}}
 const d=B.diff;return{hp:u.hp*m*d,dmg:u.dmg*m*(.85+.15*d)*(d>1?Math.sqrt(d):1)*.9,range:u.range,spd:u.spd,cd:u.cd,ranged:u.ranged,proj:ERAS[S.era].proj,splash:(S.era===3&&type===2)?30:0}}
function spawn(side,type){
 let st,img;
 if(type===3){st=heroStats();img='h'+S.hero}else{st=unitStats(side,type);img=(side?'e':'u')+S.era+'_'+type}
 if(S.era===3&&type===2){st.ranged=1;st.range=150;st.proj='ball'}
 const hh=(type===3?1.22:UTYPE[type].h)*100*SC;
 const u={side,type,img,x:side?B.rx:B.lx,dy:rnd(-16,14)*SC,hp:st.hp,max:st.hp,dmg:st.dmg,range:st.range*SC,spd:st.spd*SC,cd:st.cd,at:rnd(.1,.4),ranged:st.ranged,proj:st.proj,splash:(st.splash||0)*SC,aura:st.aura,
  h:hh,ph:Math.random()*6,lunge:0,fl:0,frz:0,moving:1,dead:0,dt:0,born:B.t};
 B.units.push(u);if(type===3)B.heroAlive=1;return u}
function playerSpawn(type){
 if(!B||B.over)return;
 const cost=type===3?HERO_COST:UTYPE[type].cost;
 if(type<3&&!S.unl[type])return;
 if(type===3&&B.heroAlive)return;
 if(B.food<cost){SFX.tick();return}
 B.food-=cost;spawn(0,type);SFX.spawn();B.spawned++;S.stats.spawn++;
 for(let i=0;i<6;i++)B.parts.push({k:'spark',x:B.lx+rnd(-10,10),y:LANE-rnd(10,50)*SC,vx:rnd(20,80),vy:rnd(-60,-10),l:.5,ml:.5,c:'#ffd36a'})}
function useSkill(id){
 if(!B||B.over||B.used[id])return;B.used[id]=1;S.stats.skill++;const pw=(1+cb('skill'))*em();
 if(id==='meteor'){SFX.boom();const en=B.units.filter(u=>u.side&&!u.dead);let cx=en.length?en.reduce((a,u)=>Math.min(a,u.x),CW):B.rx-60*SC;
  for(let i=0;i<6;i++){const tx=cx+rnd(-10,120)*SC;B.proj.push({k:'meteor',x:tx-120*SC,y:-40,tx,ty:LANE+rnd(-10,10)*SC,v:520*SC,dmg:55*pw,splash:55*SC,side:0,delay:i*.14})}}
 if(id==='freeze'){SFX.freeze();B.units.forEach(u=>{if(u.side&&!u.dead)u.frz=4});for(let i=0;i<40;i++)B.parts.push({k:'snow',x:rnd(CW*.3,CW),y:rnd(LANE-120*SC,LANE+20),vx:rnd(-20,20),vy:rnd(20,60),l:1.4,ml:1.4,c:'#cfeeff'})}
 if(id==='rage'){SFX.rage();B.rage=7}
 if(id==='shield'){SFX.heal();B.shieldT=6}
 if(id==='heal'){SFX.heal();B.units.forEach(u=>{if(!u.side&&!u.dead){u.hp=u.max;for(let i=0;i<3;i++)B.parts.push({k:'heal',x:u.x+rnd(-10,10),y:LANE+u.dy-rnd(10,u.h),vx:0,vy:-40,l:.9,ml:.9})}});B.pb.hp=Math.min(B.pb.max,B.pb.hp+B.pb.max*.25)}
 renderDock()}
function dmgUnit(t,d,src){
 if(t.dead)return;
 if(!t.side&&B.shieldT>0)d*=.5;
 t.hp-=d;t.fl=.12;
 if(Math.random()<.5)B.parts.push({k:'txt',x:t.x+rnd(-8,8),y:LANE+t.dy-t.h*.9,vx:0,vy:-45,l:.7,ml:.7,t:fmt(d),c:t.side?'#ffe08a':'#ff7070'});
 for(let i=0;i<3;i++)B.parts.push({k:'spark',x:t.x,y:LANE+t.dy-t.h*.5,vx:rnd(-90,90),vy:rnd(-110,-20),l:.35,ml:.35,c:t.side?'#ffb0f0':'#ffdd88'});
 if(t.hp<=0){t.dead=1;t.dt=0;if(t.type===3&&!t.side)B.heroAlive=0;
  if(t.side){B.kills++;S.stats.kill++;const c=Math.max(1,Math.round((2+.4*B.diffN)*em()*(t.type===2?3:t.type===1?1.5:1)*coinMult()));B.collected+=c;
   B.parts.push({k:'coin',x:t.x,y:LANE+t.dy-t.h*.6,vx:0,vy:0,l:.9,ml:.9,v:c});SFX.coin()}}}
function coinMult(){return(1+cb('coin'))*(S.x2?2:1)*(B&&B.pot.coin?2:1)*(1+.05*((S.heroes[S.hero]||{eq:[0,0,0]}).eq[2]||0))}
function dmgBase(side,d){const b=side?B.eb:B.pb;if(!side&&b.inv>0)return;if(!side&&B.shieldT>0)return;b.hp-=d;b.fl=.15;B.shake=Math.max(B.shake,.12);
 const x=side?B.rx+20*SC:B.lx-20*SC;for(let i=0;i<4;i++)B.parts.push({k:'spark',x:x+rnd(-15,15),y:LANE-rnd(20,90)*SC,vx:rnd(-80,80),vy:rnd(-100,-10),l:.4,ml:.4,c:'#ffcc66'});
 if(b.hp<=0){b.hp=0;endBattle(side===1)}}
function attack(u,t,isBase){
 const dm=u.dmg*(u.side===0&&B.rage>0?1.6:1);
 if(u.ranged){B.proj.push({k:u.proj||'arrow',x:u.x+(u.side?-14:14)*SC,y:LANE+u.dy-u.h*.62,t,base:isBase,side:u.side,dmg:dm,v:(u.proj==='ball'?300:u.proj==='spear'?330:520)*SC,splash:u.splash,arc:u.proj==='spear'||u.proj==='arrow'||u.proj==='ball'});SFX.shoot()}
 else{u.lunge=1;SFX.hit();if(isBase)dmgBase(u.side?0:1,dm);else{dmgUnit(t,dm,u);if(u.splash){B.units.forEach(o=>{if(o!==t&&o.side!==u.side&&!o.dead&&Math.abs(o.x-t.x)<u.splash)dmgUnit(o,dm*.5,u)})}}}
 if(u.aura){B.units.forEach(o=>{if(!o.dead&&o.side===u.side&&Math.abs(o.x-u.x)<90*SC){o.hp=Math.min(o.max,o.hp+o.max*.06)}});B.parts.push({k:'heal',x:u.x,y:LANE+u.dy-u.h,vx:0,vy:-30,l:.8,ml:.8})}}
function enemyAI(dt){
 if(B.eDelay>0){B.eDelay-=dt;return}
 B.ef+=B.eRate*dt;
 if(B.eNext===null){const r=Math.random();const hv=B.diffN>=3?.18:0;const rg=B.diffN>=2?.32:0;B.eNext=r<hv?2:r<hv+rg?1:0}
 const c=UTYPE[B.eNext].cost;if(B.ef>=c){B.ef-=c;spawn(1,B.eNext);B.eNext=null}}
function step(dt){
 B.t+=dt;
 if(B.over){B.overT+=dt;updParts(dt);updProj(dt);return}
 B.food+=B.foodRate*dt;B.food=Math.min(B.food,999);
 if(B.rage>0)B.rage-=dt;if(B.shieldT>0)B.shieldT-=dt;
 enemyAI(dt);
 const L=B.units;
 for(const u of L){
  if(u.dead){u.dt+=dt;continue}
  u.fl=Math.max(0,u.fl-dt);u.lunge=Math.max(0,u.lunge-dt*5);
  if(u.frz>0){u.frz-=dt;continue}
  const dir=u.side?-1:1;let best=null,bd=1e9;
  for(const o of L){if(o.dead||o.side===u.side)continue;const d=(o.x-u.x)*dir;if(d>-12*SC&&d<bd){bd=d;best=o}}
  const baseX=u.side?B.lx:B.rx;const bdist=(baseX-u.x)*dir;
  u.at-=dt*(u.side===0&&B.rage>0?1.4:1);
  if(best&&bd<=u.range){u.moving=0;if(u.at<=0){u.at=u.cd;attack(u,best,0)}}
  else if(bdist<=Math.max(u.range,8*SC)){u.moving=0;if(u.at<=0){u.at=u.cd;attack(u,null,1)}}
  else{u.moving=1;u.x+=dir*u.spd*dt*(u.side===0&&B.rage>0?1.4:1);if(u.at<0)u.at=0}}
 B.units=L.filter(u=>!u.dead||u.dt<.7);
 updProj(dt);updParts(dt);
 B.pb.fl=Math.max(0,B.pb.fl-dt);B.eb.fl=Math.max(0,B.eb.fl-dt);B.shake=Math.max(0,B.shake-dt)}
function updProj(dt){
 for(const p of B.proj){
  if(p.delay>0){p.delay-=dt;continue}
  if(p.k==='meteor'){const dx=p.tx-p.x,dy=p.ty-p.y,d=Math.hypot(dx,dy),s=p.v*dt;
   if(d<=s){p.done=1;boomAt(p.tx,p.ty,p.splash,p.dmg,0)}else{p.x+=dx/d*s;p.y+=dy/d*s;if(Math.random()<.8)B.parts.push({k:'smoke',x:p.x,y:p.y,vx:rnd(-10,10),vy:rnd(-10,10),l:.5,ml:.5,r:8*SC})}continue}
  let tx,ty;if(p.base||!p.t||p.t.dead){if(!p.base&&p.t&&p.t.dead){p.base=0;tx=p.t.x;ty=LANE+p.t.dy-p.t.h*.5}else{tx=p.side?B.lx-10*SC:B.rx+10*SC;ty=LANE-40*SC}}else{tx=p.t.x;ty=LANE+p.t.dy-p.t.h*.5}
  if(p.sx===undefined){p.sx=p.x;p.sy=p.y;p.prog=0;p.tot=Math.max(10,Math.abs(tx-p.x))}
  const dx=tx-p.x,dy=ty-p.y,d=Math.hypot(dx,dy),s=p.v*dt;
  p.prog+=s;
  if(d<=s+2){p.done=1;
   if(p.base)dmgBase(p.side?0:1,p.dmg);else if(p.t&&!p.t.dead)dmgUnit(p.t,p.dmg);
   if(p.splash)boomAt(tx,ty,p.splash,p.dmg*.6,p.side);else SFX.hit()}
  else{p.x+=dx/d*s;p.y+=dy/d*s;p.ang=Math.atan2(dy,dx)}}
 B.proj=B.proj.filter(p=>!p.done)}
function boomAt(x,y,r,dmg,side){SFX.boom();B.shake=.25;
 for(let i=0;i<16;i++){const a=Math.random()*6.28,s=rnd(40,180)*SC;B.parts.push({k:'fire',x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-60,l:.6,ml:.6,r:rnd(4,9)*SC})}
 B.parts.push({k:'ring',x,y,l:.4,ml:.4,r})
 B.units.forEach(u=>{if(!u.dead&&u.side!==side&&Math.abs(u.x-x)<r)dmgUnit(u,dmg)})}
function updParts(dt){for(const p of B.parts){p.l-=dt;if(p.k==='coin'){const tx=40,ty=40,k=1-p.l/p.ml;p.x+=(tx-p.x)*k*.12;p.y+=(ty-p.y)*k*.12}else{p.x+=(p.vx||0)*dt;p.y+=(p.vy||0)*dt;if(p.k==='spark'||p.k==='fire')p.vy+=260*dt}}
 B.parts=B.parts.filter(p=>p.l>0);if(B.parts.length>400)B.parts.splice(0,B.parts.length-400)}

/* ===== render ===== */
function drawBase(side){
 const b=side?B.eb:B.pb;const k=(side?'eb':'b')+S.era;const im=IMG[k];if(!im||!im.width)return;
 const h=150*SC,w=im.width/im.height*h;const cx=side?B.rx+w*.22:B.lx-w*.22;const y=LANE+30*SC;
 let sx=0;if(b.fl>0)sx=Math.sin(B.t*80)*3;
 ctx.save();ctx.globalAlpha=b.hp<=0?Math.max(0,1-B.overT):1;
 ctx.drawImage(im,cx-w/2+sx,y-h,w,h);
 if(b.fl>0){ctx.globalAlpha=b.fl*3;ctx.globalCompositeOperation='lighter';ctx.drawImage(im,cx-w/2+sx,y-h,w,h);ctx.globalCompositeOperation='source-over'}
 ctx.restore();
 if(!side&&B.shieldT>0){ctx.save();ctx.globalAlpha=.35+.15*Math.sin(B.t*8);ctx.fillStyle='#7fd4ff';ctx.beginPath();ctx.ellipse(cx,y-h*.45,w*.62,h*.62,0,0,7);ctx.fill();ctx.restore()}
 // hp bar
 const bw=64*SC,bx=Math.max(4,Math.min(CW-bw-4,cx-bw/2)),by=y-h-20*SC;
 ctx.fillStyle='#000a';rr(bx-2,by-2,bw+4,11*SC+4,5);ctx.fill();
 ctx.fillStyle='#4a0a0a';rr(bx,by,bw,11*SC,4);ctx.fill();
 ctx.fillStyle=side?'#ff2a3a':'#ff3a3a';rr(bx,by,bw*Math.max(0,b.hp/b.max),11*SC,4);ctx.fill();
 ctx.font=`${Math.round(16*SC)}px Russo,Impact,sans-serif`;ctx.textAlign='center';ctx.lineWidth=3.5;ctx.strokeStyle='#000';ctx.fillStyle='#fff';
 const t=fmt(Math.ceil(b.hp));ctx.strokeText(t,bx+bw/2,by-5);ctx.fillText(t,bx+bw/2,by-5)}
function rr(x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()}
function drawUnit(u){
 const im=IMG[u.img];if(!im||!im.width)return;
 const h=u.h,w=im.width/im.height*h,dir=u.side?-1:1;
 const bob=u.moving&&!u.frz?Math.abs(Math.sin(B.t*9+u.ph))*3.5*SC:Math.sin(B.t*2.5+u.ph)*1*SC;
 const lg=u.lunge>0?Math.sin(u.lunge*Math.PI)*10*SC*dir:0;
 const born=Math.min(1,(B.t-u.born)*5);
 let x=u.x+lg,y=LANE+u.dy;
 ctx.save();
 if(u.dead){ctx.globalAlpha=Math.max(0,1-u.dt/.7)}
 // shadow
 ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(x,y,w*.32,6*SC,0,0,7);ctx.fill();ctx.strokeStyle=u.side?'rgba(200,60,255,.8)':'rgba(255,200,80,.85)';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x,y,Math.min(w*.3,26*SC),5*SC,0,0,7);ctx.stroke();
 ctx.translate(x,y-bob);
 let rot=u.moving?Math.sin(B.t*9+u.ph)*.03:0;if(u.lunge>0)rot+=Math.sin(u.lunge*Math.PI)*.12*dir;if(u.dead)rot=dir*-u.dt*1.6;
 ctx.rotate(rot);ctx.scale(born,born);
 ctx.drawImage(im,-w/2,-h,w,h);
 if(u.fl>0){const s=sil(u.img,'w');if(s){ctx.globalAlpha=Math.min(1,u.fl*7)*.75;ctx.drawImage(s,-w/2,-h,w,h)}}
 if(u.frz>0){const s=sil(u.img,'b');if(s){ctx.globalAlpha=.5;ctx.drawImage(s,-w/2,-h,w,h)}}
 if(!u.side&&B.rage>0){ctx.globalAlpha=.25+.15*Math.sin(B.t*12);ctx.globalCompositeOperation='lighter';const s=sil(u.img,'w');if(s){ctx.filter&&0;ctx.drawImage(s,-w/2,-h,w,h)}ctx.globalCompositeOperation='source-over'}
 ctx.restore();
 if(!u.dead&&u.hp<u.max){const bw=30*SC;ctx.fillStyle='#000b';ctx.fillRect(u.x-bw/2-1,y-h-9*SC-1,bw+2,5*SC+2);ctx.fillStyle=u.side?'#e04aff':'#3aff5a';ctx.fillRect(u.x-bw/2,y-h-9*SC,bw*u.hp/u.max,5*SC)}
 if(u.type===3&&!u.dead){ctx.font=`${Math.round(14*SC)}px sans-serif`;ctx.textAlign='center';ctx.fillText('👑',u.x,y-h-12*SC)}}
function drawProj(p){
 if(p.delay>0)return;ctx.save();ctx.translate(p.x,p.y);
 if(p.k==='meteor'){const g=ctx.createRadialGradient(0,0,0,0,0,16*SC);g.addColorStop(0,'#fff6c0');g.addColorStop(.4,'#ff9a20');g.addColorStop(1,'rgba(255,40,0,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,16*SC,0,7);ctx.fill()}
 else{let a=p.ang||0;let lift=0;if(p.arc&&p.tot){const k=Math.min(1,p.prog/p.tot);lift=-Math.sin(k*Math.PI)*p.tot*.18;ctx.translate(0,lift);a+=(k<.5?-1:1)*.35*(p.side?-1:1)}
  ctx.rotate(a);
  if(p.k==='arrow'){ctx.strokeStyle='#5a3a1a';ctx.lineWidth=2*SC;ctx.beginPath();ctx.moveTo(-12*SC,0);ctx.lineTo(10*SC,0);ctx.stroke();ctx.fillStyle='#ddd';ctx.beginPath();ctx.moveTo(12*SC,0);ctx.lineTo(7*SC,-3*SC);ctx.lineTo(7*SC,3*SC);ctx.fill()}
  else if(p.k==='spear'){ctx.strokeStyle='#8a5a2a';ctx.lineWidth=2.5*SC;ctx.beginPath();ctx.moveTo(-16*SC,0);ctx.lineTo(12*SC,0);ctx.stroke();ctx.fillStyle='#999';ctx.beginPath();ctx.moveTo(17*SC,0);ctx.lineTo(10*SC,-4*SC);ctx.lineTo(10*SC,4*SC);ctx.fill()}
  else if(p.k==='bullet'){ctx.fillStyle='#ffe9a0';ctx.shadowColor='#ffb020';ctx.shadowBlur=8;ctx.fillRect(-8*SC,-1.5*SC,14*SC,3*SC)}
  else if(p.k==='laser'){ctx.fillStyle=p.side?'#ff5aff':'#5affff';ctx.shadowColor=ctx.fillStyle;ctx.shadowBlur=10;ctx.fillRect(-14*SC,-2*SC,24*SC,4*SC)}
  else if(p.k==='ball'){ctx.fillStyle='#222';ctx.beginPath();ctx.arc(0,0,5*SC,0,7);ctx.fill()}
  else if(p.k==='magic'){const g=ctx.createRadialGradient(0,0,0,0,0,10*SC);g.addColorStop(0,'#fff');g.addColorStop(.4,'#c060ff');g.addColorStop(1,'rgba(120,0,255,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,10*SC,0,7);ctx.fill()}}
 ctx.restore()}
function drawParts(){
 for(const p of B.parts){const a=Math.max(0,p.l/p.ml);ctx.globalAlpha=a;
  if(p.k==='spark'){ctx.fillStyle=p.c;ctx.fillRect(p.x-2,p.y-2,4,4)}
  else if(p.k==='fire'){ctx.fillStyle=a>.5?'#ffd060':'#ff5020';ctx.beginPath();ctx.arc(p.x,p.y,p.r*a+1,0,7);ctx.fill()}
  else if(p.k==='smoke'){ctx.fillStyle='rgba(80,60,50,.5)';ctx.beginPath();ctx.arc(p.x,p.y,p.r*(1.5-a),0,7);ctx.fill()}
  else if(p.k==='ring'){ctx.strokeStyle='#ffcc66';ctx.lineWidth=4*a;ctx.beginPath();ctx.ellipse(p.x,p.y,p.r*(1.2-a),p.r*(1.2-a)*.4,0,0,7);ctx.stroke()}
  else if(p.k==='snow'){ctx.fillStyle=p.c;ctx.beginPath();ctx.arc(p.x,p.y,2.5,0,7);ctx.fill()}
  else if(p.k==='heal'){ctx.fillStyle='#5aff7a';ctx.font=`${Math.round(14*SC)}px sans-serif`;ctx.textAlign='center';ctx.fillText('✚',p.x,p.y)}
  else if(p.k==='txt'){ctx.font=`${Math.round(13*SC)}px Russo,Impact,sans-serif`;ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='#000';ctx.strokeText(p.t,p.x,p.y);ctx.fillStyle=p.c;ctx.fillText(p.t,p.x,p.y)}
  else if(p.k==='coin'){const im=COINIMG;if(im.width)ctx.drawImage(im,p.x-9,p.y-9,18,18)}}
 ctx.globalAlpha=1}
const COINIMG=new Image();COINIMG.src=COIN_SVG;
function render(){
 ctx.setTransform(DPR,0,0,DPR,0,0);
 let sx=0,sy=0;if(B.shake>0){sx=rnd(-4,4)*B.shake*8;sy=rnd(-3,3)*B.shake*8}
 ctx.translate(sx,sy);
 if(BG&&BG.width)ctx.drawImage(BG,BGR.x-6,BGR.y-6,BGR.w+12,BGR.h+12);else{ctx.fillStyle='#2a4a1a';ctx.fillRect(0,0,CW,CH)}
 drawBase(0);drawBase(1);
 const us=B.units.slice().sort((a,b)=>a.dy-b.dy);for(const u of us)drawUnit(u);
 for(const p of B.proj)drawProj(p);
 drawParts();
 if(B.rage>0){ctx.fillStyle=`rgba(255,60,20,${.06+.04*Math.sin(B.t*10)})`;ctx.fillRect(-10,-10,CW+20,CH+20)}
 // vignette edge at dock
 const g=ctx.createLinearGradient(0,CH-60,0,CH);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.6)');ctx.fillStyle=g;ctx.fillRect(-10,CH-60,CW+20,70)}
let lastT=0,rafOn=0,hudT=0;
function loop(now){
 if(!B){rafOn=0;return}
 let dt=Math.min(.05,(now-lastT)/1000);lastT=now;
 const sp=B.paused?0:S.speed;let tot=dt*sp;while(tot>0){const d=Math.min(1/60,tot);step(d);tot-=d}
 render();hudT+=dt;if(hudT>.1){hudT=0;updHud()}
 if(B&&B.over&&B.overT>1.4&&!B.shown){B.shown=1;showResult()}
 requestAnimationFrame(loop)}
function endBattle(win){if(B.over)return;B.over=win?1:2;B.overT=0;
 const bx=win?B.rx:B.lx;for(let i=0;i<30;i++){const a=Math.random()*6.28,s=rnd(40,200)*SC;B.parts.push({k:'fire',x:bx,y:LANE-50*SC,vx:Math.cos(a)*s,vy:Math.sin(a)*s-80,l:1,ml:1,r:rnd(5,11)*SC})}
 SFX.boom();setTimeout(()=>win?SFX.win():SFX.lose(),400)}
function showResult(){
 const win=B.over===1;let bonus=0,gems=0;
 if(win){bonus=Math.round(15*em()*(1+.25*B.diffN)*coinMult());if(B.mode==='dung')gems=40+20*S.dung}
 const total=B.collected+bonus;B.res={total,gems,win};
 addCoins(total);S.gems+=gems;S.passXp+=win?60:25;
 if(win){S.stats.win++;S.wins++;if(B.mode==='dung'){S.dung++}else{S.battle++;S.best=Math.max(S.best,S.battle)}}
 save();
 modal(`<div class="res-big"><div class="rt" style="color:${win?'#ffd36a':'#ff5a5a'}">${win?'ПОБЕДА!':'ПОРАЖЕНИЕ'}</div>
 <div class="note">${win?(B.mode==='dung'?'Этаж подземелья пройден!':'Вражеская база разрушена!'):'База пала… Улучши воительниц и попробуй снова!'}</div>
 <div class="reward"><div>${CI} ${fmt(total)}</div>${gems?`<div>💎 ${gems}</div>`:''}<div>🎖 +${win?60:25}</div></div>
 <div class="mcol"><button class="btn gold big" data-act="dbl">Удвоить награду <small>бесплатно, без рекламы</small></button>
 <button class="btn big" data-act="${win?'again':'again'}">${win?'Следующая битва':'Ещё раз'}</button>
 <button class="btn blue w" data-act="tohub">В меню</button></div></div>`,1)}
function exitBattle(){B=null;$('#battle').classList.add('hidden');$('#hub').classList.remove('hidden');closeModal();renderHub()}

/* ===== battle HUD ===== */
function renderBHud(){
 $('#bhud').innerHTML=`<div class="top"><div class="res"><img class="ic" src="${COIN_SVG}"><span id="hc">${fmt(S.coins)}</span></div>
 <div class="bt">${B.mode==='dung'?'Подземелье '+S.dung:'Битва '+S.battle}<small>${ERAS[S.era].n}${S.tl?' · Линия '+(S.tl+1):''}</small></div>
 <button class="pbtn" data-act="pause">❚❚</button></div>
 <div class="coinbox">Собрано монет<b><img class="ic-coin" src="${COIN_SVG}"><span id="hcol">0</span></b></div>`}
function renderDock(){
 const cards=[0,1,2].map(i=>`<div class="ucb ${S.unl[i]?'':'lockd'}" data-spawn="${i}"><img src="${P(S.era,i)}"><div class="fillm"></div><div class="cost">🥩 ${UTYPE[i].cost}</div>${S.unl[i]?'':'<div class="tag">🔒</div>'}</div>`).join('')
  +`<div class="ucb hero" data-spawn="3"><img src="assets/ph${S.hero}.webp"><div class="fillm"></div><div class="cost">🥩 ${HERO_COST}</div><div class="tag">👑</div></div>`;
 const sks=S.skEq.slice(0,3).map(id=>{const s=SKILLS.find(x=>x.id===id);return`<button class="sk ${s.c} ${B&&B.used[id]?'used':''}" data-skill="${id}"><b>${s.i}</b>${s.n}</button>`}).join('');
 $('#dock').innerHTML=`<div class="drow"><div class="food"><div class="fi">🥩</div><div class="fv" id="fv">0</div><div class="fr">${(B?B.foodRate:0).toFixed(1)}/с</div></div>${cards}</div>
 <div class="drow2">${sks}<button class="spd" data-act="speed">×${S.speed}</button></div>`}
let lastHud={};
function updHud(){if(!B)return;const f=Math.floor(B.food);const fv=$('#fv');if(fv&&lastHud.f!==f){fv.textContent=f;lastHud.f=f}
 const hc=$('#hcol');if(hc&&lastHud.c!==B.collected){hc.textContent=fmt(B.collected);lastHud.c=B.collected}
 document.querySelectorAll('.ucb').forEach(el=>{const i=+el.dataset.spawn;const cost=i===3?HERO_COST:UTYPE[i].cost;const ok=(i===3||S.unl[i])&&B.food>=cost&&!(i===3&&B.heroAlive);el.classList.toggle('off',!ok);
  const fm=el.querySelector('.fillm');const k=i===3&&B.heroAlive?1:Math.max(0,1-B.food/cost);fm.style.height=(ok?0:k*100)+'%'})}

/* ===== hub ===== */
let TAB='battle';
const TABS=[['upg','⬆️','Улучшения'],['evo','🧬','Эволюция'],['battle','⚔️','Битва'],['cards','🃏','Карты'],['heroes','👑','Героини'],['shop','🛍️','Магазин']];
function renderHub(){
 $('#topbar').innerHTML=`<div class="res"><img class="ic" src="${COIN_SVG}">${fmt(S.coins)}</div><div class="res"><span class="ic" style="font-size:19px;text-align:center">💎</span>${fmt(S.gems)}</div><div class="tb-sp"></div>
 <button class="tbtn" data-act="wheel">🎡</button><button class="tbtn" data-act="tasks">📋${tasksReady()?'<i class="dot"></i>':''}</button><button class="tbtn" data-act="pass">🎖️</button><button class="tbtn" data-act="settings">⚙️</button>`;
 $('#tabs').innerHTML=TABS.map(t=>`<button class="tab ${TAB===t[0]?'on':''}" data-tab="${t[0]}"><b>${t[1]}</b>${t[2]}</button>`).join('');
 const c=$('#content');const st=c.scrollTop;c.innerHTML=({upg:vUpg,evo:vEvo,battle:vBattle,cards:vCards,heroes:vHeroes,shop:vShop})[TAB]();c.scrollTop=st;
 $('#hub').style.backgroundImage=`url(assets/bg${ERAS[S.era].bg}.webp)`}
const foodCost=()=>Math.round(8*em()*Math.pow(1.32,S.foodL)),hpCost=()=>Math.round(30*em()*Math.pow(1.32,S.hpL)),unlCost=i=>Math.round([0,150,320][i]*em()),evoCost=()=>Math.round(700*em()*(S.era===5?2:1));
function costBtn(c,act,arg,cls=''){return`<button class="btn ${cls||(S.coins>=c?'blue':'gray')}" data-act="${act}" data-arg="${arg??''}">${CI} ${fmt(c)}</button>`}
function vUpg(){
 const uc=[0,1,2].map(i=>`<div class="ucard ${S.unl[i]?'':'lock'}"><div class="pt"><img src="${P(S.era,i)}"><div class="tag">🥩 ${UTYPE[i].cost}</div></div><div class="nm">${ERAS[S.era].u[i]}</div>${S.unl[i]?'<div class="free">✔ Открыта</div>':costBtn(unlCost(i),'unl',i)}</div>`).join('');
 const sk=SKILLS.map((s,i)=>{const own=S.sk[s.id];const eq=S.skEq.includes(s.id);return`<div class="urow"><div class="ui">${s.i}</div><div class="ut"><b>${s.n}</b><span>${s.d}</span></div>${own?`<button class="btn ${eq?'red':'gray'}" data-act="skeq" data-arg="${s.id}">${eq?'В бою ✔':'Взять'}</button>`:costBtn(Math.round(SKILL_COST[i]*em()),'skbuy',s.id)}</div>`}).join('');
 return`<h2 class="ttl">Улучшения</h2><div class="panel"><h3>Воительницы · ${ERAS[S.era].n}</h3><div class="ucards">${uc}</div></div>
 <div class="panel"><div class="urow"><div class="ui">🥩</div><div class="ut"><b>Производство еды</b><span>${(1.55*(1+.14*S.foodL)*(1+cb('food'))).toFixed(2)}/с · ур. ${S.foodL+1}</span></div>${costBtn(foodCost(),'ufood')}</div>
 <div class="urow"><div class="ui">🏰</div><div class="ut"><b>Здоровье базы</b><span>${fmt(100*em()*(1+.22*S.hpL)*(1+cb('base')))} · ур. ${S.hpL+1}</span></div>${costBtn(hpCost(),'uhp')}</div></div>
 <div class="panel"><h3>Умения в бою (до 3)</h3>${sk}</div>`}
function vEvo(){
 const last=S.era===5;const ne=last?0:S.era+1;
 return`<h2 class="ttl">Эволюция</h2><div class="panel"><div class="evo"><div class="fr"><img src="${U(S.era,0)}"><div class="en">${ERAS[S.era].n}</div></div><div class="ar">➜</div>
 <div class="fr" style="border-color:${last?'#ff4d6a':'#e8be5a'}"><img src="${U(ne,0)}"><div class="en">${last?'Линия '+(S.tl+2)+': '+ERAS[0].n:ERAS[ne].n}</div></div></div>
 <div class="eras">${ERAS.map((e,i)=>`<i class="${i<=S.era?'on':''}"></i>`).join('')}</div>
 <div class="note">${last?'Ты прошла все эпохи! <b>Путешествие во времени</b> откроет новую линию времени: враги сильнее в 1.2 раза, награды больше.':'Эволюция откроет новых воительниц и базу следующей эпохи!<br>Улучшения и номер битвы начнутся заново — как в оригинале.'}</div>
 <button class="btn blue big" data-act="evolve">${last?'ПУТЕШЕСТВИЕ ВО ВРЕМЕНИ':'ЭВОЛЮЦИЯ'} <small>${CI} ${fmt(evoCost())}</small></button></div>
 <div class="panel"><h3>Эпохи линии времени ${S.tl+1}</h3>${ERAS.map((e,i)=>`<div class="urow" style="${i===S.era?'border-color:#ff4d4d':''}"><div class="ui" style="padding:0;overflow:hidden"><img src="${P(i,0)}" style="width:100%;${i>S.era?'filter:grayscale(1) brightness(.4)':''}"></div><div class="ut"><b>${e.n}</b><span>${e.u.join(' · ')}</span></div>${i<S.era?'✅':i===S.era?'⚔️':'🔒'}</div>`).join('')}</div>`}
function vBattle(){
 const pots=POTIONS.map(p=>`<button class="chip ${S.potUse[p.id]?'on':''}" data-act="pot" data-arg="${p.id}"><b>${p.i}</b><span>${p.n}<br><small style="color:#c9b08a">${p.d} · есть: ${S.potions[p.id]||0}</small></span></button>`).join('');
 return`<div class="hero-stage" style="background-image:url(assets/bg${ERAS[S.era].bg}.webp)"><div class="lbl"><b>Битва ${S.battle}</b><span>${ERAS[S.era].n} · Линия времени ${S.tl+1}${S.tl?' (сложность ×'+Math.pow(1.2,S.tl).toFixed(2)+')':''}</span></div>
 <img src="${U(S.era,1)}" style="left:4%;height:66%"><img src="${U(S.era,0)}" style="left:28%"><img src="assets/h${S.hero}.webp" style="left:54%;height:80%"><img src="${U(S.era,2)}" style="right:-6%;height:62%"></div>
 <button class="btn red big" data-act="fight">⚔️ В БОЙ!</button>
 <div class="panel" style="margin-top:12px"><h3>Зелья на следующую битву</h3><div class="chips">${pots}</div><div class="note" style="margin-bottom:0">Зелья бесплатно в Магазине</div></div>
 <div class="panel"><div class="urow" style="margin:0"><div class="ui">🕳️</div><div class="ut"><b>Подземелье · этаж ${S.dung}</b><span>Сильные врагини, награда 💎 ${40+20*S.dung}</span></div><button class="btn" data-act="dung">Войти</button></div></div>
 <div class="panel"><h3>Рекорд</h3><div class="stat"><span>Лучшая битва</span><b>${S.best}</b></div><div class="stat"><span>Всего побед</span><b>${S.wins}</b></div><div class="stat"><span>Эволюций</span><b>${S.evoTotal}</b></div></div>`}
function cardNeed(lv){return lv+1}
function vCards(){
 const grid=CARDS.map((c,i)=>{const o=S.cards[i];if(!o)return`<div class="gc r${c.r} no"><div class="ci">${c.i}</div><div class="cn">${c.n}</div><div class="cl rt${c.r}">${RAR[c.r]}</div></div>`;
  const need=cardNeed(o.lv);return`<div class="gc r${c.r}"><div class="ci">${c.i}</div><div class="cn">${c.n}</div><div class="cl">ур. ${o.lv} · +${c.flat?c.v*o.lv:Math.round(c.v*o.lv*100)+'%'} ${c.d}</div><div class="cb"><i style="width:${Math.min(100,o.n/need*100)}%"></i></div><div class="cl">${o.n}/${need}</div>${o.n>=need?`<button class="btn up" data-act="cup" data-arg="${i}">Улучшить</button>`:''}</div>`}).join('');
 return`<h2 class="ttl">Карты</h2><div class="panel"><h3>Открыть карты · у тебя 💎 ${fmt(S.gems)}</h3><div class="gacha"><button class="btn blue" data-act="gacha" data-arg="1">×1<small>💎 100</small></button><button class="btn blue" data-act="gacha" data-arg="10">×10<small>💎 900</small></button><button class="btn gold" data-act="gacha" data-arg="50">×50<small>💎 4000</small></button></div>
 <div class="note" style="margin-bottom:0">${RAR.map((r,i)=>`<span class="rt${i}">${r} ${RAR_P[i]}%</span>`).join(' · ')}</div></div>
 <div class="row sp" style="margin-bottom:8px"><span class="note" style="margin:0">Повторы улучшают карту</span><button class="btn" style="min-height:40px;font-size:13px" data-act="cupall">Улучшить все</button></div><div class="cgrid">${grid}</div>`}
const eqCost=l=>Math.round(60*em()*Math.pow(1.45,l)),hlvCost=l=>Math.round(100*em()*Math.pow(1.4,l-1));
function vHeroes(){
 const list=HEROES.map((h,i)=>`<button class="hl ${S.hero===i?'sel':''} ${S.heroes[i]?'':'lock'}" data-act="hsel" data-arg="${i}"><img src="assets/ph${i}.webp">${S.heroes[i]?'':'<div class="lk">🔒</div>'}</button>`).join('');
 const h=HEROES[S.hero],o=S.heroes[S.hero],st=heroStats();
 const eq=EQUIP.map((e,i)=>`<div class="urow"><div class="ui">${e.i}</div><div class="ut"><b>${e.n} · ур. ${o.eq[i]}</b><span>${e.d}</span></div>${costBtn(eqCost(o.eq[i]),'eq',i)}</div>`).join('');
 return`<h2 class="ttl">Героини</h2><div class="hlist">${list}</div>
 <div class="panel"><div class="hdet"><div class="hf"><img src="assets/h${S.hero}.webp"></div><div class="hs"><h3 style="margin:0 0 4px;font-family:Russo;font-weight:400;color:var(--gold2)">${h.n}</h3><div class="note" style="text-align:left;margin:0 0 6px">${h.role}</div>
 <div class="stat"><span>Уровень</span><b>${o.lv}</b></div><div class="stat"><span>Здоровье</span><b>${fmt(st.hp)}</b></div><div class="stat"><span>Урон</span><b>${fmt(st.dmg)}</b></div><div class="stat"><span>Цена в бою</span><b>🥩 ${HERO_COST}</b></div>
 <div style="margin-top:8px">${costBtn(hlvCost(o.lv),'hlv')}</div><div class="note" style="margin:4px 0 0;text-align:left">Повысить уровень</div></div></div></div>
 <div class="panel"><h3>Снаряжение</h3>${eq}</div>
 ${HEROES.map((x,i)=>S.heroes[i]?'':`<div class="offer"><img src="assets/ph${i}.webp"><div class="ot"><b>${x.n}</b><span>${x.role}</span></div><button class="btn" data-act="hbuy" data-arg="${i}">💎 ${x.gem}</button></div>`).join('')}`}
function shopItem(ic,n,v,act,arg,btn='БЕСПЛАТНО'){return`<div class="si"><div class="sic">${ic}</div><div class="sn">${n}</div><div class="sv">${v}</div><button class="btn" data-act="${act}" data-arg="${arg??''}">${btn}</button></div>`}
function vShop(){const m=em();
 return`<h2 class="ttl">Магазин</h2>
 <div class="banner"><img src="${U(S.era,0)}"><div class="bt">Всё бесплатно!</div><div class="bd">Любой товар — 0 ₽. Бери сколько хочешь, без таймеров и рекламы.</div><button class="btn gold" data-act="buy" data-arg="mega">Забрать мега-набор</button></div>
 <h3 class="f" style="color:var(--gold);margin:6px 2px 8px;font-weight:400">🔥 Спецпредложения</h3>
 <div class="offer"><img src="assets/ph1.webp"><div class="ot"><b>Ночь Глянца <span class="badge">СОБЫТИЕ</span></b><span>💎 1500 + ${fmt(5000*m)} монет + 10 карт</span></div><button class="btn" data-act="buy" data-arg="event">0 ₽</button></div>
 <div class="offer"><img src="${P(S.era,2)}"><div class="ot"><b>Набор торговца</b><span>${fmt(3000*m)} монет, 💎 500, 4 зелья, 5 карт</span></div><button class="btn" data-act="buy" data-arg="merchant">0 ₽</button></div>
 <div class="offer"><img src="assets/ph0.webp"><div class="ot"><b>Набор новичка</b><span>💎 800, Королева ночи, ${fmt(2000*m)} монет</span></div><button class="btn" data-act="buy" data-arg="starter">0 ₽</button></div>
 <div class="offer"><img src="assets/ph2.webp"><div class="ot"><b>Пропуск сезона <span class="badge">ПРЕМИУМ</span></b><span>30 уровней наград — всё можно забрать сразу</span></div><button class="btn gold" data-act="pass">Открыть</button></div>
 <div class="offer"><img src="assets/ph3.webp"><div class="ot"><b>Фонд воина</b><span>Кристаллы за пройденные битвы</span></div><button class="btn gold" data-act="fund">Открыть</button></div>
 <h3 class="f" style="color:var(--gold);margin:14px 2px 8px;font-weight:400">⭐ Навсегда</h3><div class="sgrid">
 ${shopItem('✖️2','Монеты ×2 навсегда',S.x2?'✔ Активно':'навсегда','buy','x2',S.x2?'Ещё раз':'БЕСПЛАТНО')}
 ${shopItem('⏩','Ускорение ×3',S.spd2?'✔ Активно':'скорость битвы ×3','buy','spd',S.spd2?'Ещё раз':'БЕСПЛАТНО')}
 ${shopItem('🚫','Без рекламы','✔ Всегда','buy','noads','Забрать')}</div>
 <h3 class="f" style="color:var(--gold);margin:14px 2px 8px;font-weight:400">💎 Кристаллы</h3><div class="sgrid">
 ${shopItem('💎','Горсть кристаллов','500','buy','g1')}${shopItem('💰','Мешок кристаллов','3 000','buy','g2')}${shopItem('🏆','Сундук кристаллов','15 000','buy','g3')}</div>
 <h3 class="f" style="color:var(--gold);margin:14px 2px 8px;font-weight:400">👑 Монеты</h3><div class="sgrid">
 ${shopItem('🪙','Кошель монет',fmt(1000*m),'buy','c1')}${shopItem('💰','Сундук монет',fmt(6000*m),'buy','c2')}${shopItem('🏦','Гора монет',fmt(30000*m),'buy','c3')}</div>
 <h3 class="f" style="color:var(--gold);margin:14px 2px 8px;font-weight:400">🎁 Награды (вместо рекламы)</h3><div class="sgrid">
 ${shopItem('🎬','Бонус монет',fmt(800*m),'buy','ad1','Забрать')}${shopItem('🎬','Бонус кристаллов','150','buy','ad2','Забрать')}${shopItem('🎬','Бесплатная карта','×1','buy','ad3','Забрать')}
 ${shopItem('🎬','Бесплатное зелье','случайное','buy','ad4','Забрать')}${shopItem('🎬','Крутка колеса','×1','wheel','','Крутить')}${shopItem('🎬','Удвоить монеты',fmt(S.coins),'buy','ad6','Забрать')}</div>
 <h3 class="f" style="color:var(--gold);margin:14px 2px 8px;font-weight:400">🧪 Зелья</h3><div class="sgrid">
 ${POTIONS.map(p=>shopItem(p.i,p.n,p.d,'buy','p_'+p.id)).join('')}${shopItem('🧴','Набор всех зелий','×3 каждого','buy','pall')}</div>
 <h3 class="f" style="color:var(--gold);margin:14px 2px 8px;font-weight:400">🃏 Сундуки карт</h3><div class="sgrid">
 ${shopItem('📦','Обычный сундук','5 карт','buy','ch1')}${shopItem('🎁','Эпический сундук','15 карт, эпик+','buy','ch2')}${shopItem('👑','Легендарный сундук','10 карт, легенд.+','buy','ch3')}</div>`}

/* ===== modals ===== */
function modal(html,noClose){const m=$('#modal');m.innerHTML=`<div class="mbox">${noClose?'':'<button class="xbtn" style="position:absolute;right:10px;top:10px;z-index:3" data-act="close">✕</button>'}${html}</div>`;m.classList.remove('hidden')}
function closeModal(){$('#modal').classList.add('hidden');$('#modal').innerHTML=''}
const WHEEL=[{t:'Монеты',i:'🪙',c:'#8a1018',f:()=>{const v=Math.round(500*em());addCoins(v);return CI+' '+fmt(v)}},{t:'💎 100',i:'💎',c:'#1a1a1a',f:()=>{S.gems+=100;return'💎 100'}},{t:'Карта',i:'🃏',c:'#8a1018',f:()=>{const r=rollCards(1);return'Карта: '+CARDS[r[0]].n}},{t:'Зелье',i:'🧪',c:'#1a1a1a',f:()=>{const p=POTIONS[Math.floor(Math.random()*4)];S.potions[p.id]++;return p.i+' '+p.n}},
 {t:'Монеты ×4',i:'💰',c:'#8a1018',f:()=>{const v=Math.round(2000*em());addCoins(v);return CI+' '+fmt(v)}},{t:'💎 500',i:'💎',c:'#1a1a1a',f:()=>{S.gems+=500;return'💎 500'}},{t:'3 карты',i:'🎴',c:'#8a1018',f:()=>{rollCards(3);return'3 карты!'}},{t:'ДЖЕКПОТ',i:'👑',c:'#b8801a',f:()=>{S.gems+=2000;const v=Math.round(10000*em());addCoins(v);return'ДЖЕКПОТ! 💎 2000 + '+CI+' '+fmt(v)}}];
let wheelRot=0,spinning=0;
function openWheel(){const n=WHEEL.length,a=360/n;
 const grad=WHEEL.map((w,i)=>`${w.c} ${i*a}deg ${(i+1)*a}deg`).join(',');
 const labels=WHEEL.map((w,i)=>`<div style="position:absolute;left:50%;top:50%;transform:rotate(${i*a+a/2}deg) translateY(-104px) translateX(-50%);transform-origin:0 0;text-align:center;font-size:11px;color:#ffe7a3;font-family:Russo;width:70px"><div style="font-size:24px">${w.i}</div>${w.t}</div>`).join('');
 modal(`<div class="mh"><b>Колесо фортуны</b></div><div class="wheelw"><div class="wptr"></div><div id="wheel" style="background:conic-gradient(${grad});transform:rotate(${wheelRot}deg)">${labels}</div><div class="whub"></div></div>
 <div class="note" id="wres">Крути сколько угодно — бесплатно!</div><button class="btn gold big" data-act="spin">КРУТИТЬ</button>`)}
function spin(){if(spinning)return;spinning=1;S.stats.spin++;const n=WHEEL.length,a=360/n;const k=Math.floor(Math.random()*n);
 wheelRot+=360*5+(360-(k*a+a/2))-(wheelRot%360);const w=$('#wheel');w.style.transform=`rotate(${wheelRot}deg)`;
 let t=0;const iv=setInterval(()=>{SFX.tick();if(++t>20)clearInterval(iv)},140);
 setTimeout(()=>{spinning=0;const r=WHEEL[k].f();SFX.coin();const e=$('#wres');if(e)e.innerHTML='Выпало: <b style="color:#ffe7a3">'+r+'</b>';save();renderHub()},3300)}
function rollCards(n,minR=0){const out=[];for(let j=0;j<n;j++){let x=Math.random()*100,r=0;for(;r<4;r++){if(x<RAR_P[r])break;x-=RAR_P[r]}r=Math.max(r,minR);const pool=CARDS.map((c,i)=>i).filter(i=>CARDS[i].r===r);const id=pool[Math.floor(Math.random()*pool.length)];
 if(!S.cards[id])S.cards[id]={n:0,lv:1};else S.cards[id].n++;out.push(id)}S.stats.cards+=n;return out}
function showReveal(ids,title){const cols=ids.length>=10?5:ids.length>3?4:ids.length;SFX.card();
 modal(`<div class="mh"><b>${title||'Новые карты'}</b></div><div class="rv" style="grid-template-columns:repeat(${cols},1fr)">${ids.map((id,i)=>{const c=CARDS[id];return`<div class="rvc r${c.r}" style="animation-delay:${Math.min(i,30)*.05}s"><div class="ci">${c.i}</div><div class="cn">${c.n}</div><div class="cn rt${c.r}">${RAR[c.r]}</div></div>`}).join('')}</div>
 <div class="mcol"><button class="btn big" data-act="close">Отлично!</button></div>`)}
function tasksReady(){return S.tasks.some((t,i)=>!t.c&&(S.stats[t.t]-t.b)>=TASKS.find(x=>x.t===t.t).g)}
function openTasks(){modal(`<div class="mh"><b>Задания</b></div>${S.tasks.map((t,i)=>{const d=TASKS.find(x=>x.t===t.t);const p=Math.min(d.g,S.stats[t.t]-t.b);return`<div class="urow"><div class="ui">${t.c?'✅':'🎯'}</div><div class="ut"><b>${d.n}</b><span>${p}/${d.g} · награда 💎 ${d.gm} + 🎖 40</span><div class="cb" style="height:6px;background:#000;border-radius:3px;margin-top:4px;overflow:hidden"><i style="display:block;height:100%;width:${p/d.g*100}%;background:#7dff8a"></i></div></div>${t.c?'<span class="free">Получено</span>':`<button class="btn ${p>=d.g?'':'gray'}" data-act="tclaim" data-arg="${i}">${p>=d.g?'Забрать':'В пути'}</button>`}</div>`}).join('')}
 <div class="mcol"><button class="btn blue w" data-act="tnew">Новые задания (бесплатно)</button></div>`)}
function passReward(i,prem){const m=em();if(!prem){if(i%5===4)return{g:150,t:'💎 150'};return{c:Math.round(300*(i+1)*m),t:CI+' '+fmt(300*(i+1)*m)}}
 if(i%3===2)return{cards:3,t:'🃏 ×3'};if(i%3===1)return{pot:1,t:'🧪 зелье'};return{g:200+20*i,t:'💎 '+(200+20*i)}}
function giveR(r){if(r.g)S.gems+=r.g;if(r.c)addCoins(r.c);if(r.cards)rollCards(r.cards);if(r.pot){const p=POTIONS[Math.floor(Math.random()*4)];S.potions[p.id]++}}
function openPass(){const lv=Math.floor(S.passXp/100);let rows='';for(let i=0;i<30;i++){const f=passReward(i,0),p=passReward(i,1);const cf=S.passC['f'+i],cp=S.passC['p'+i];
 rows+=`<div class="pt-row"><div class="pt-cell ${cf?'done':''}">${f.t}${cf?'<span class="free" style="margin-left:auto">✔</span>':`<button class="btn" data-act="pclaim" data-arg="f${i}">Взять</button>`}</div><div class="pt-n">${i+1}</div>
 <div class="pt-cell prem ${cp?'done':''}">${p.t}${cp?'<span class="free" style="margin-left:auto">✔</span>':`<button class="btn gold" data-act="pclaim" data-arg="p${i}">Взять</button>`}</div></div>`}
 modal(`<div class="mh"><b>Пропуск сезона</b></div><div class="note" style="margin-top:0">Опыт сезона: 🎖 ${S.passXp} (ур. ${Math.min(30,lv)}) · Премиум: ${S.passPrem?'<b style="color:#7dff8a">активен</b>':'выкл'}</div>
 <div class="row" style="margin-bottom:10px"><button class="btn gold" style="flex:1" data-act="pprem">${S.passPrem?'Премиум ✔':'Премиум — 0 ₽'}</button><button class="btn" style="flex:1" data-act="pall">Забрать всё</button></div>
 <div class="row sp f" style="font-size:13px;color:var(--gold);margin-bottom:6px"><span>Бесплатно</span><span>Премиум</span></div><div class="ptrack">${rows}</div>
 <div class="mcol"><button class="btn blue w" data-act="preset">Начать сезон заново</button></div>`)}
function openFund(){modal(`<div class="mh"><b>Фонд воина</b></div><div class="note" style="margin-top:0">Награды за пройденные битвы. Всё бесплатно — можно забрать сразу.</div>${FUND.map((b,i)=>{const c=S.fundC[i];return`<div class="urow"><div class="ui">${S.best>=b?'⚔️':'🔒'}</div><div class="ut"><b>Битва ${b}</b><span>💎 ${100*(i+1)} + ${CI} ${fmt(1000*(i+1)*em())}</span></div>${c?'<span class="free">✔ Получено</span>':`<button class="btn" data-act="fclaim" data-arg="${i}">Взять</button>`}</div>`}).join('')}
 <div class="mcol"><button class="btn gold w" data-act="fall">Забрать всё</button><button class="btn blue w" data-act="freset">Обновить фонд</button></div>`)}
function openSettings(){modal(`<div class="mh"><b>Настройки</b></div><div class="urow"><div class="ui">🔊</div><div class="ut"><b>Звук</b></div><button class="btn ${S.snd?'':'gray'}" data-act="snd">${S.snd?'Вкл':'Выкл'}</button></div>
 <div class="note">Лаковые воины: Глянец · всё в игре бесплатно, без рекламы и таймеров. Прогресс сохраняется на этом устройстве.</div>
 <div class="mcol"><button class="btn red w" data-act="reset">Сбросить прогресс</button></div>`)}
function openPause(){modal(`<div class="mh"><b>Пауза</b></div><div class="mcol"><button class="btn big" data-act="close">Продолжить</button><button class="btn red w" data-act="surrender">Выйти из битвы</button></div>`);B.paused=1}

/* ===== actions ===== */
function need(c){if(S.coins>=c){S.coins-=c;return 1}toast('Не хватает монет — загляни в Магазин, там всё бесплатно!');return 0}
function buy(id){const m=em();let msg='';
 const P4=()=>POTIONS.forEach(p=>S.potions[p.id]++);
 switch(id){
  case'mega':S.gems+=5000;addCoins(20000*m);P4();rollCards(10);msg='Мега-набор: 💎 5000, '+CI+' '+fmt(20000*m)+', зелья, 10 карт';break;
  case'event':S.gems+=1500;addCoins(5000*m);showReveal(rollCards(10),'Ночь Глянца!');msg='💎 1500 + '+CI+' '+fmt(5000*m);break;
  case'merchant':addCoins(3000*m);S.gems+=500;P4();rollCards(5);msg='Набор торговца получен!';break;
  case'starter':S.gems+=800;addCoins(2000*m);if(!S.heroes[1])S.heroes[1]={lv:1,eq:[0,0,0]};msg='Набор новичка: Королева ночи с тобой!';break;
  case'x2':S.x2=1;addCoins(500*m);msg='Монеты ×2 навсегда — активно!';break;
  case'spd':S.spd2=1;msg='Ускорение ×3 доступно в бою!';break;
  case'noads':S.noads=1;msg='Рекламы нет и не будет 😉';break;
  case'g1':S.gems+=500;msg='💎 +500';break;case'g2':S.gems+=3000;msg='💎 +3000';break;case'g3':S.gems+=15000;msg='💎 +15000';break;
  case'c1':addCoins(1000*m);msg=CI+' +'+fmt(1000*m);break;case'c2':addCoins(6000*m);msg=CI+' +'+fmt(6000*m);break;case'c3':addCoins(30000*m);msg=CI+' +'+fmt(30000*m);break;
  case'ad1':addCoins(800*m);msg=CI+' +'+fmt(800*m);break;case'ad2':S.gems+=150;msg='💎 +150';break;
  case'ad3':{const r=rollCards(1);msg='Карта: '+CARDS[r[0]].n;break}
  case'ad4':{const p=POTIONS[Math.floor(Math.random()*4)];S.potions[p.id]++;msg=p.i+' '+p.n;break}
  case'ad6':{const v=Math.max(100,S.coins);addCoins(v);msg='Монеты удвоены: +'+fmt(v);break}
  case'pall':POTIONS.forEach(p=>S.potions[p.id]+=3);msg='Все зелья ×3';break;
  case'ch1':showReveal(rollCards(5),'Обычный сундук');break;case'ch2':showReveal(rollCards(15,2),'Эпический сундук');break;case'ch3':showReveal(rollCards(10,3),'Легендарный сундук');break;
  default:if(id.startsWith('p_')){S.potions[id.slice(2)]++;const p=POTIONS.find(x=>x.id===id.slice(2));msg=p.i+' '+p.n+' +1'}}
 SFX.coin();if(msg)toast(msg);save();renderHub()}
function act(a,arg,el){
 switch(a){
 case'close':closeModal();if(B)B.paused=0;return;
 case'fight':startBattle('main');return;case'dung':startBattle('dung');return;
 case'pause':openPause();return;
 case'surrender':B=null;exitBattle();return;
 case'speed':{const L=S.spd2?[1,1.5,2,3]:[1,1.5,2];S.speed=L[(L.indexOf(S.speed)+1)%L.length]||1;save();el.textContent='×'+S.speed;return}
 case'again':{const mode=B.mode;closeModal();B=null;startBattle(mode);return}
 case'dbl':{if(B&&B.res&&!B.res.dbl){B.res.dbl=1;addCoins(B.res.total);S.gems+=B.res.gems;save();toast('Награда удвоена: '+CI+' +'+fmt(B.res.total));el.textContent='Удвоено ✔';el.classList.add('gray')}return}
 case'tohub':exitBattle();return;
 case'wheel':openWheel();return;case'spin':spin();return;
 case'tasks':openTasks();return;
 case'tclaim':{const t=S.tasks[arg],d=TASKS.find(x=>x.t===t.t);if(!t.c&&S.stats[t.t]-t.b>=d.g){t.c=1;S.gems+=d.gm;S.passXp+=40;SFX.coin();toast('💎 +'+d.gm);save();openTasks();renderHub()}else toast('Задание ещё не выполнено');return}
 case'tnew':newTasks();save();openTasks();return;
 case'pass':openPass();return;
 case'pprem':S.passPrem=1;save();openPass();toast('Премиум-пропуск активирован бесплатно!');return;
 case'pclaim':{if(arg[0]==='p'&&!S.passPrem){S.passPrem=1}const i=+arg.slice(1);giveR(passReward(i,arg[0]==='p'));S.passC[arg]=1;SFX.coin();save();openPass();renderHub();return}
 case'pall':{S.passPrem=1;for(let i=0;i<30;i++){['f','p'].forEach(k=>{if(!S.passC[k+i]){giveR(passReward(i,k==='p'));S.passC[k+i]=1}})}SFX.win();toast('Все награды пропуска получены!');save();openPass();renderHub();return}
 case'preset':S.passC={};save();openPass();return;
 case'fund':openFund();return;
 case'fclaim':{const i=+arg;S.gems+=100*(i+1);addCoins(1000*(i+1)*em());S.fundC[i]=1;SFX.coin();save();openFund();renderHub();return}
 case'fall':FUND.forEach((b,i)=>{if(!S.fundC[i]){S.gems+=100*(i+1);addCoins(1000*(i+1)*em());S.fundC[i]=1}});SFX.win();save();openFund();renderHub();return;
 case'freset':S.fundC={};save();openFund();return;
 case'settings':openSettings();return;
 case'snd':S.snd=S.snd?0:1;save();openSettings();return;
 case'reset':modal(`<div class="mh"><b>Сбросить всё?</b></div><div class="note">Весь прогресс будет удалён.</div><div class="mcol"><button class="btn red w" data-act="reset2">Да, сбросить</button><button class="btn w" data-act="close">Отмена</button></div>`);return;
 case'reset2':S=defSave();newTasks();save();closeModal();TAB='battle';renderHub();return;
 case'buy':buy(arg);return;
 case'unl':if(need(unlCost(+arg))){S.unl[+arg]=1;S.stats.upg++;SFX.evo();toast(ERAS[S.era].u[+arg]+' в отряде!')}break;
 case'ufood':if(need(foodCost())){S.foodL++;S.stats.upg++;SFX.coin()}break;
 case'uhp':if(need(hpCost())){S.hpL++;S.stats.upg++;SFX.coin()}break;
 case'skbuy':{const i=SKILLS.findIndex(s=>s.id===arg);if(need(Math.round(SKILL_COST[i]*em()))){S.sk[arg]=1;if(S.skEq.length<3)S.skEq.push(arg);S.stats.upg++;SFX.coin()}break}
 case'skeq':{const i=S.skEq.indexOf(arg);if(i>=0)S.skEq.splice(i,1);else{if(S.skEq.length>=3)S.skEq.shift();S.skEq.push(arg)}break}
 case'evolve':if(need(evoCost())){if(S.era===5){S.tl++;S.era=0}else S.era++;S.foodL=0;S.hpL=0;S.unl=[1,0,0];S.battle=1;S.evoTotal++;SFX.evo();save();renderHub();
  modal(`<div class="res-big"><div class="rt" style="color:#ffd36a;font-size:30px">${S.era===0?'НОВАЯ ЛИНИЯ ВРЕМЕНИ!':'ЭВОЛЮЦИЯ!'}</div><div class="note">Новая эпоха: <b style="color:#ffe7a3">${ERAS[S.era].n}</b></div>
  <div class="evo" style="height:220px">${[0,1,2].map(i=>`<div class="fr" style="aspect-ratio:auto;height:100%"><img src="${U(S.era,i)}"><div class="en" style="font-size:11px">${ERAS[S.era].u[i]}</div></div>`).join('')}</div><div class="mcol"><button class="btn big" data-act="close">Вперёд!</button></div></div>`);return}break;
 case'pot':if(!(S.potions[arg]>0)){toast('Нет зелья — возьми бесплатно в Магазине');return}S.potUse[arg]=!S.potUse[arg];break;
 case'gacha':{const n=+arg,c={1:100,10:900,50:4000}[n];if(S.gems<c){toast('Не хватает 💎 — в Магазине бесплатно!');return}S.gems-=c;const r=rollCards(n);save();renderHub();showReveal(r);return}
 case'cup':{const o=S.cards[arg];if(o&&o.n>=cardNeed(o.lv)){o.n-=cardNeed(o.lv);o.lv++;SFX.evo()}break}
 case'cupall':{let k=0;for(const id in S.cards){const o=S.cards[id];while(o.n>=cardNeed(o.lv)){o.n-=cardNeed(o.lv);o.lv++;k++}}toast(k?'Улучшено карт: '+k:'Нечего улучшать');if(k)SFX.evo();break}
 case'hsel':if(S.heroes[+arg]){S.hero=+arg}else{TAB='heroes';S.hero=S.hero;toast('Открой героиню за 💎 ниже')}break;
 case'hbuy':{const i=+arg;if(S.gems>=HEROES[i].gem){S.gems-=HEROES[i].gem;S.heroes[i]={lv:1,eq:[0,0,0]};S.hero=i;SFX.evo();toast(HEROES[i].n+' с тобой!')}else toast('Не хватает 💎 — в Магазине бесплатно!');break}
 case'hlv':{const o=S.heroes[S.hero];if(need(hlvCost(o.lv))){o.lv++;SFX.coin()}break}
 case'eq':{const o=S.heroes[S.hero];if(need(eqCost(o.eq[+arg]))){o.eq[+arg]++;SFX.coin()}break}
 }
 save();renderHub()}
document.addEventListener('click',e=>{au();const t=e.target.closest('[data-act]');if(t){SFX.tap();act(t.dataset.act,t.dataset.arg,t);return}
 const tb=e.target.closest('[data-tab]');if(tb){SFX.tap();TAB=tb.dataset.tab;$('#content').scrollTop=0;renderHub();$('#content').scrollTop=0}});
document.getElementById('dock').addEventListener('pointerdown',e=>{au();const sp=e.target.closest('[data-spawn]');if(sp){e.preventDefault();playerSpawn(+sp.dataset.spawn);updHud();return}
 const sk=e.target.closest('[data-skill]');if(sk){e.preventDefault();useSkill(sk.dataset.skill)}});
document.addEventListener('gesturestart',e=>e.preventDefault());
document.addEventListener('dblclick',e=>e.preventDefault());
window.addEventListener('resize',()=>{if(B)layoutBattle()});
document.addEventListener('visibilitychange',()=>{if(document.hidden){save();if(B&&!B.over&&!B.paused)openPause()}});
loadAll(()=>{$('#loading').classList.add('hidden');$('#hub').classList.remove('hidden');renderHub()});
if('serviceWorker' in navigator&&location.protocol!=='file:')navigator.serviceWorker.register('sw.js').catch(()=>{});
window.__S=()=>S;window.__B=()=>B;
