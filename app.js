
const equipmentCatalog=[
['treadmill','Esteira'],['leg_extension','Cadeira extensora'],['leg_curl','Cadeira flexora'],
['ms8000','Estação Uplift MS-8000'],['dumbbells','Halteres'],['mat','Colchonete'],
['pilates_ball','Bola de Pilates'],['bench','Banco ajustável'],['barbell','Barra e suporte'],
['plates','Anilhas'],['pullup_bar','Barra fixa'],['ankle_weights','Pesos de areia'],
['jump_rope','Corda'],['step','Degrau 20 cm'],['ab_roller','Rolo abdominal']];

const substitutions={
"Supino na MS-8000":[
{name:"Supino com halteres no banco",muscle:"Peito • tríceps • ombro anterior",need:["dumbbells","bench"],level:"Equivalente",target:"3 × 10–12",desc:"Banco plano, escápulas apoiadas e pés firmes. Desça com controle."},
{name:"Flexão inclinada no banco",muscle:"Peito • tríceps",need:["bench"],level:"Mais fácil",target:"3 × 8–12",desc:"Mãos no banco e corpo alinhado. Desça controlando."}],
"Voador / Peck deck":[
{name:"Crucifixo com halteres",muscle:"Peitoral",need:["dumbbells","bench"],level:"Equivalente",target:"2 × 12–15",desc:"Abra os braços com leve flexão dos cotovelos e feche controlando."}],
"Desenvolvimento com halteres sentado":[
{name:"Desenvolvimento unilateral sentado",muscle:"Ombros",need:["dumbbells","bench"],level:"Equivalente",target:"2 × 10/lado",desc:"Um braço por vez, tronco estável."}],
"Elevação lateral com halteres":[
{name:"Elevação lateral sentado",muscle:"Deltoide lateral",need:["dumbbells","bench"],level:"Equivalente",target:"2 × 12–15",desc:"Sentado para reduzir balanço do tronco."}],
"Tríceps na corda – polia alta":[
{name:"Tríceps francês com halter",muscle:"Tríceps",need:["dumbbells","bench"],level:"Equivalente",target:"2 × 10–12",desc:"Halter acima da cabeça; mova apenas os antebraços."}],
"Puxada alta à frente – MS-8000":[
{name:"Pullover com halter no banco",muscle:"Dorsais • peitoral",need:["dumbbells","bench"],level:"Mais fácil",target:"3 × 10–12",desc:"Leve o halter atrás da cabeça sem perder o controle da lombar."},
{name:"Barra fixa assistida",muscle:"Dorsais • bíceps",need:["pullup_bar","step"],level:"Avançado",target:"3 × 5–8",desc:"Use o degrau para assistência parcial."}],
"Remada baixa – MS-8000":[
{name:"Remada unilateral com halter",muscle:"Costas • bíceps",need:["dumbbells","bench"],level:"Equivalente",target:"3 × 10–12/lado",desc:"Apoie mão e joelho no banco e puxe o halter em direção ao quadril."}],
"Face pull na corda":[
{name:"Crucifixo inverso inclinado",muscle:"Deltoide posterior • trapézio",need:["dumbbells","bench"],level:"Equivalente",target:"2 × 12–15",desc:"Peito apoiado no banco inclinado e braços abrindo para os lados."}],
"Rosca Scott – MS-8000":[
{name:"Rosca alternada com halteres",muscle:"Bíceps",need:["dumbbells"],level:"Equivalente",target:"2 × 10–12",desc:"Cotovelos junto ao corpo e sem balançar."}],
"Rosca martelo com halteres":[
{name:"Rosca martelo sentado",muscle:"Bíceps • braquial",need:["dumbbells","bench"],level:"Equivalente",target:"2 × 10–12",desc:"Sentado, palmas voltadas uma para a outra."}],
"Agachamento Goblet":[
{name:"Agachamento para o banco",muscle:"Quadríceps • glúteos",need:["bench"],level:"Mais fácil",target:"3 × 10–12",desc:"Use o banco como referência de profundidade."}],
"Cadeira extensora":[
{name:"Step-up no degrau",muscle:"Quadríceps • glúteos",need:["step"],level:"Equivalente",target:"2 × 10/lado",desc:"Apoie todo o pé e suba controlando o joelho."}],
"Cadeira flexora":[
{name:"Flexão de joelhos com bola",muscle:"Posteriores de coxa",need:["pilates_ball","mat"],level:"Equivalente",target:"3 × 10–12",desc:"Calcanhares na bola, quadril elevado; puxe a bola em direção ao corpo."}],
"Terra romeno com halteres":[
{name:"Ponte de glúteos",muscle:"Glúteos • posteriores",need:["mat"],level:"Mais fácil",target:"2 × 12–15",desc:"Eleve o quadril contraindo glúteos."}],
"Step-up no degrau":[
{name:"Afundo estático",muscle:"Quadríceps • glúteos",need:["mat"],level:"Equivalente",target:"2 × 8/lado",desc:"Pés fixos e descida vertical controlada."}],
"Panturrilha em pé":[
{name:"Panturrilha sentado com halteres",muscle:"Panturrilhas",need:["bench","dumbbells"],level:"Equivalente",target:"3 × 12–15",desc:"Halteres sobre as coxas; eleve os calcanhares."}],
"Prancha nos antebraços":[
{name:"Prancha inclinada no banco",muscle:"Core",need:["bench"],level:"Mais fácil",target:"2 × 20–30 s",desc:"Antebraços apoiados no banco e corpo alinhado."}],
"Bird-dog":[
{name:"Dead bug",muscle:"Core",need:["mat"],level:"Equivalente",target:"2 × 8/lado",desc:"Lombar apoiada e movimentos lentos."}],
"Dead bug":[
{name:"Bird-dog",muscle:"Core • estabilidade",need:["mat"],level:"Equivalente",target:"2 × 8/lado",desc:"Quatro apoios, estenda braço e perna opostos."}]
};

let exerciseOverrides=load('exerciseOverrides',{}),currentSubIndex=null;
function selectedEquipment(){return load('equipment',equipmentCatalog.map(x=>x[0]))}
function renderEquipment(){
 const selected=new Set(selectedEquipment());
 $('equipmentGrid').innerHTML=equipmentCatalog.map(([id,label])=>`<label class="equipitem"><input type="checkbox" ${selected.has(id)?'checked':''} onchange="toggleEquipment('${id}',this.checked)"> ${label}</label>`).join('');
}
function toggleEquipment(id,on){let s=new Set(selectedEquipment());on?s.add(id):s.delete(id);store('equipment',[...s])}
function compatible(a){const h=new Set(selectedEquipment());return (a.need||[]).every(x=>h.has(x))}
function openSubModal(idx){
 currentSubIndex=idx;const day=$('day').value,base=workouts[day][idx],cur=exerciseOverrides[day]?.[idx]||base;
 $('subCurrent').textContent=cur.name;
 const opts=[{...base,level:'Original',need:[]},...(substitutions[base.name]||[])];
 $('subOptions').innerHTML=opts.map((a,i)=>{const ok=i===0||compatible(a);return `<div class="altcard"><div class="exhead"><div><b>${a.name}</b><div class="accent">${a.muscle}</div></div><span class="tag">${a.level}</span></div><p>${a.desc}</p><div class="muted">Meta: ${a.target}</div><button class="${ok?'primary':''}" ${ok?'':'disabled'} onclick="applySubstitution(${idx},${i})">${ok?'Usar este exercício':'Equipamento não marcado'}</button></div>`}).join('');
 $('subModal').classList.remove('hide');
}
function closeSubModal(){$('subModal').classList.add('hide')}
function applySubstitution(idx,opt){
 const day=$('day').value,base=workouts[day][idx];
 if(!exerciseOverrides[day])exerciseOverrides[day]={};
 if(opt===0)delete exerciseOverrides[day][idx]; else exerciseOverrides[day][idx]={...base,...substitutions[base.name][opt-1],video:base.video};
 store('exerciseOverrides',exerciseOverrides);closeSubModal();buildWorkout();
}


const workouts = {"A": [{"name": "Aquecimento – Esteira", "muscle": "Cardiorrespiratório", "target": "8 min", "desc": "Ritmo confortável; aumente gradualmente.", "video": "https://www.youtube.com/results?search_query=caminhada+esteira+postura+correta+shorts"}, {"name": "Supino na MS-8000", "muscle": "Peito • tríceps • deltoide anterior", "target": "3 × 10–12", "desc": "Escápulas apoiadas, pés firmes. Empurre sem travar os cotovelos e retorne controlando.", "video": "https://www.youtube.com/watch?v=fbupGf-T4KM"}, {"name": "Voador / Peck deck", "muscle": "Peitoral", "target": "2 × 12–15", "desc": "Peito aberto e costas apoiadas. Feche sem bater as alavancas; retorne devagar.", "video": "https://www.youtube.com/results?search_query=voador+peck+deck+execucao+correta+shorts"}, {"name": "Desenvolvimento com halteres sentado", "muscle": "Ombros", "target": "2 × 10–12", "desc": "Banco quase vertical, abdômen firme. Empurre acima da cabeça sem arquear a lombar.", "video": "https://www.youtube.com/watch?v=xuFLpWMPLUg"}, {"name": "Elevação lateral com halteres", "muscle": "Deltoide lateral", "target": "2 × 12–15", "desc": "Eleve até a linha dos ombros sem encolher os ombros nem balançar o tronco.", "video": "https://www.youtube.com/results?search_query=elevacao+lateral+halteres+execucao+correta+shorts"}, {"name": "Tríceps na corda – polia alta", "muscle": "Tríceps", "target": "2 × 10–12", "desc": "Cotovelos junto ao corpo. Estenda sem movimentar o ombro; retorne devagar.", "video": "https://www.youtube.com/results?search_query=triceps+corda+execucao+correta+shorts"}, {"name": "Prancha nos antebraços", "muscle": "Core", "target": "2 × 20–30 s", "desc": "Mantenha cabeça, tronco e pernas alinhados. Pare antes de perder a postura.", "video": "https://www.youtube.com/results?search_query=prancha+abdominal+execucao+correta+shorts"}, {"name": "Desaquecimento – Esteira", "muscle": "Recuperação", "target": "5 min", "desc": "Caminhada leve, reduzindo o ritmo gradualmente.", "video": "https://www.youtube.com/results?search_query=caminhada+esteira+postura+correta+shorts"}], "B": [{"name": "Aquecimento – Esteira", "muscle": "Cardiorrespiratório", "target": "8 min", "desc": "Ritmo confortável e progressivo.", "video": "https://www.youtube.com/results?search_query=caminhada+esteira+postura+correta+shorts"}, {"name": "Puxada alta à frente – MS-8000", "muscle": "Dorsais • bíceps", "target": "3 × 10–12", "desc": "Peito alto. Puxe a barra à parte superior do peito; não puxe atrás da cabeça.", "video": "https://www.youtube.com/watch?v=G7ZAG9GMIik"}, {"name": "Remada baixa – MS-8000", "muscle": "Costas • romboides • bíceps", "target": "3 × 10–12", "desc": "Coluna neutra. Puxe em direção ao abdômen sem balançar o tronco.", "video": "https://www.youtube.com/results?search_query=remada+baixa+polia+execucao+correta+shorts"}, {"name": "Face pull na corda", "muscle": "Deltoide posterior • trapézio", "target": "2 × 12–15", "desc": "Puxe a corda em direção à face, abrindo as mãos e mantendo os ombros baixos.", "video": "https://www.youtube.com/results?search_query=face+pull+execucao+correta+shorts"}, {"name": "Rosca Scott – MS-8000", "muscle": "Bíceps", "target": "2 × 10–12", "desc": "Braços apoiados no banco. Flexione os cotovelos sem tirar os braços do apoio.", "video": "https://www.youtube.com/results?search_query=rosca+scott+execucao+correta+shorts"}, {"name": "Rosca martelo com halteres", "muscle": "Bíceps • braquial • antebraço", "target": "2 × 10–12", "desc": "Palmas voltadas uma para a outra, cotovelos junto ao tronco, sem balanço.", "video": "https://www.youtube.com/results?search_query=rosca+martelo+halteres+execucao+correta+shorts"}, {"name": "Bird-dog", "muscle": "Core • estabilidade lombar", "target": "2 × 8/lado", "desc": "Estenda braço e perna opostos mantendo quadril nivelado e lombar neutra.", "video": "https://www.youtube.com/results?search_query=bird+dog+execucao+correta+shorts"}, {"name": "Desaquecimento – Esteira", "muscle": "Recuperação", "target": "5 min", "desc": "Caminhada leve.", "video": "https://www.youtube.com/results?search_query=caminhada+esteira+postura+correta+shorts"}], "C": [{"name": "Aquecimento – Esteira", "muscle": "Cardiorrespiratório", "target": "8 min", "desc": "Comece leve e aumente discretamente o ritmo.", "video": "https://www.youtube.com/results?search_query=caminhada+esteira+postura+correta+shorts"}, {"name": "Agachamento Goblet", "muscle": "Quadríceps • glúteos • core", "target": "3 × 10–12", "desc": "Halter junto ao peito. Joelhos acompanham a direção dos pés; coluna neutra.", "video": "https://www.youtube.com/results?search_query=agachamento+goblet+execucao+correta+shorts"}, {"name": "Cadeira extensora", "muscle": "Quadríceps", "target": "2 × 12–15", "desc": "Alinhe o joelho ao eixo. Estenda sem tranco e retorne controlando.", "video": "https://www.youtube.com/results?search_query=cadeira+extensora+execucao+correta+shorts"}, {"name": "Cadeira flexora", "muscle": "Posteriores de coxa", "target": "3 × 10–12", "desc": "Flexione sem levantar o quadril e retorne devagar.", "video": "https://www.youtube.com/results?search_query=cadeira+flexora+execucao+correta+shorts"}, {"name": "Terra romeno com halteres", "muscle": "Posteriores • glúteos", "target": "2 × 10–12", "desc": "Quadril para trás, joelhos levemente flexionados e coluna neutra.", "video": "https://www.youtube.com/watch?v=3YmW6SEkat0"}, {"name": "Step-up no degrau", "muscle": "Quadríceps • glúteos • equilíbrio", "target": "2 × 8–10/lado", "desc": "Apoie todo o pé no degrau. Suba empurrando pelo pé que está em cima.", "video": "https://www.youtube.com/results?search_query=step+up+degrau+execucao+correta+shorts"}, {"name": "Panturrilha em pé", "muscle": "Panturrilhas", "target": "3 × 12–15", "desc": "Eleve os calcanhares, pause no alto e desça lentamente.", "video": "https://www.youtube.com/results?search_query=panturrilha+em+pe+execucao+correta+shorts"}, {"name": "Dead bug", "muscle": "Core", "target": "2 × 8/lado", "desc": "Mantenha a lombar apoiada enquanto estende braço e perna opostos.", "video": "https://www.youtube.com/results?search_query=dead+bug+execucao+correta+shorts"}, {"name": "Desaquecimento – Esteira", "muscle": "Recuperação", "target": "5 min", "desc": "Caminhada leve.", "video": "https://www.youtube.com/results?search_query=caminhada+esteira+postura+correta+shorts"}]};
let activeSession=null, startTs=null, timerId=null, hrDevice=null, hrChar=null, hrSamples=[], currentHR=null, restTimer=null, restRemaining=0;

const $=id=>document.getElementById(id);
const store=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const load=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch(e){return d}};

function nav(id){
  document.querySelectorAll('main section').forEach(s=>s.classList.add('hide'));
  $(id).classList.remove('hide');
  document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('active',b.dataset.tab===id));
  if(id==='history') renderHistory();
  if(id==='progress') renderProgress();
}

function buildWorkout(){
  const day=$('day').value, phase=$('phase').value, host=$('workoutList'); host.innerHTML='';
  workouts[day].forEach((baseE,idx)=>{ const e=(exerciseOverrides[day]&&exerciseOverrides[day][idx])?exerciseOverrides[day][idx]:baseE;
    const card=document.createElement('article'); card.className='card exercise';
    let setCount=(e.target.match(/^(\d+)/)||[])[1]; setCount=setCount?+setCount:0;
    if(phase==='1' && setCount>2) setCount=2;
    card.innerHTML=`<div class="exhead"><div><h3>${idx+1}. ${e.name}</h3><div class="accent">${e.muscle} • ${e.target}</div></div>
    <a class="iconbtn" target="_blank" href="${e.video}" aria-label="Vídeo">▶</a></div>
    <p>${e.desc}</p><button class="subbtn" onclick="openSubModal(${idx})">⇄ Substituir exercício</button>
    ${setCount?`<div class="sets">${Array.from({length:setCount},(_,s)=>`
      <div class="setrow">
      <b>S${s+1}</b>
      <input inputmode="decimal" type="number" step="0.5" placeholder="kg" data-ex="${idx}" data-set="${s}" data-k="kg">
      <input inputmode="numeric" type="number" placeholder="reps" data-ex="${idx}" data-set="${s}" data-k="reps">
      <input inputmode="decimal" type="number" min="1" max="10" step="0.5" placeholder="RPE" data-ex="${idx}" data-set="${s}" data-k="rpe">
      <button class="done" onclick="completeSet(this,${idx},${s})">✓</button></div>`).join('')}</div>`:
      `<label>Tempo realizado <input type="number" placeholder="min/seg conforme exercício" data-ex="${idx}" data-set="0" data-k="time"></label>`}
    `;
    host.appendChild(card);
  });
}

function startSession(){
  if(activeSession) return;
  activeSession={id:crypto.randomUUID?crypto.randomUUID():Date.now().toString(), day:$('day').value, phase:$('phase').value, date:new Date().toISOString(), sets:[], notes:'', duration:0, hr:{avg:null,max:null,min:null,samples:[]}};
  startTs=Date.now(); hrSamples=[]; $('startBtn').disabled=true; $('finishBtn').disabled=false;
  timerId=setInterval(()=>{const s=Math.floor((Date.now()-startTs)/1000);$('sessionTime').textContent=fmt(s)},1000);
  $('sessionStatus').textContent='Treino em andamento';
}

function completeSet(btn,ex,setn){
  if(!activeSession) startSession();
  const row=btn.closest('.setrow'), kg=+(row.querySelector('[data-k=kg]').value||0), reps=+(row.querySelector('[data-k=reps]').value||0), rpe=+(row.querySelector('[data-k=rpe]').value||0);
  const rec={exercise:((exerciseOverrides[activeSession.day]&&exerciseOverrides[activeSession.day][ex])?exerciseOverrides[activeSession.day][ex]:workouts[activeSession.day][ex]).name, exIndex:ex,set:setn+1,kg,reps,rpe,ts:new Date().toISOString(),hr:currentHR};
  activeSession.sets=activeSession.sets.filter(x=>!(x.exIndex===ex&&x.set===setn+1)); activeSession.sets.push(rec);
  btn.classList.add('ok'); btn.textContent='✓';
  startRest(75);
}

function finishSession(){
  if(!activeSession) return;
  clearInterval(timerId);
  activeSession.duration=Math.round((Date.now()-startTs)/1000);
  activeSession.notes=$('sessionNotes').value;
  if(hrSamples.length){
    const vals=hrSamples.map(x=>x.hr);
    activeSession.hr={avg:Math.round(vals.reduce((a,b)=>a+b,0)/vals.length),max:Math.max(...vals),min:Math.min(...vals),samples:hrSamples};
  }
  const hist=load('sessions',[]); hist.push(activeSession); store('sessions',hist);
  activeSession=null; $('startBtn').disabled=false;$('finishBtn').disabled=true;$('sessionStatus').textContent='Treino salvo';
  renderDashboard(); alert('Treino salvo com sucesso.');
}

function fmt(s){let m=Math.floor(s/60),ss=s%60;return `${String(m).padStart(2,'0')}:${String(ss).padStart(2,'0')}`}
function startRest(sec=75){
  clearInterval(restTimer); restRemaining=sec; $('restBox').classList.remove('hide'); $('restTime').textContent=fmt(restRemaining);
  restTimer=setInterval(()=>{restRemaining--; $('restTime').textContent=fmt(Math.max(0,restRemaining)); if(restRemaining<=0){clearInterval(restTimer);navigator.vibrate?.([150,80,150]);}},1000);
}
function addRest(x){restRemaining+=x;$('restTime').textContent=fmt(restRemaining)}

function parseHeartRate(value){
  const flags=value.getUint8(0), is16=flags&1;
  return is16?value.getUint16(1,true):value.getUint8(1);
}
async function connectHR(){
  if(!navigator.bluetooth){alert('Web Bluetooth não está disponível neste navegador. Use Chrome no Android e abra o app por HTTPS.');return}
  try{
    $('hrStatus').textContent='Procurando...';
    hrDevice=await navigator.bluetooth.requestDevice({filters:[{services:['heart_rate']}],optionalServices:['battery_service']});
    hrDevice.addEventListener('gattserverdisconnected',()=>{$('hrStatus').textContent='Desconectada';$('hrDot').classList.remove('on')});
    const server=await hrDevice.gatt.connect(), service=await server.getPrimaryService('heart_rate');
    hrChar=await service.getCharacteristic('heart_rate_measurement');
    await hrChar.startNotifications();
    hrChar.addEventListener('characteristicvaluechanged',ev=>{
      const hr=parseHeartRate(ev.target.value); currentHR=hr; $('hrNow').textContent=hr; $('hrStatus').textContent=hrDevice.name||'XOSS X2'; $('hrDot').classList.add('on');
      const sample={t:Date.now(),hr}; hrSamples.push(sample); if(hrSamples.length>7200)hrSamples.shift();
      updateLiveHR();
    });
  }catch(e){ $('hrStatus').textContent='Não conectada'; if(e.name!=='NotFoundError') alert('Não foi possível conectar: '+e.message); }
}
function updateLiveHR(){
  if(!hrSamples.length)return; const vals=hrSamples.map(x=>x.hr);
  $('hrAvg').textContent=Math.round(vals.reduce((a,b)=>a+b,0)/vals.length);
  $('hrMax').textContent=Math.max(...vals);
}
function disconnectHR(){try{hrDevice?.gatt?.disconnect()}catch(e){}}

function renderDashboard(){
 const a=load('sessions',[]), last=a[a.length-1];
 $('dashSessions').textContent=a.length;
 $('dashMinutes').textContent=Math.round(a.reduce((s,x)=>s+(x.duration||0),0)/60);
 $('dashLast').textContent=last?new Date(last.date).toLocaleDateString('pt-BR'):'—';
}
function renderHistory(){
 const a=load('sessions',[]).slice().reverse(), host=$('historyList');
 host.innerHTML=a.length?a.map(s=>`<article class="card"><div class="exhead"><div><b>${new Date(s.date).toLocaleDateString('pt-BR')} • Treino ${s.day}</b><div class="muted">${fmt(s.duration||0)} • ${s.sets.length} séries</div></div><div class="accent">${s.hr?.avg?`♥ ${s.hr.avg} méd / ${s.hr.max} máx`:''}</div></div><details><summary>Detalhes</summary>${s.sets.map(x=>`<div class="historyrow"><span>${x.exercise} S${x.set}</span><span>${x.kg||'—'} kg • ${x.reps||'—'} reps • RPE ${x.rpe||'—'}${x.hr?' • ♥ '+x.hr:''}</span></div>`).join('')}<p>${s.notes||''}</p></details></article>`).join(''):'<p class="muted">Nenhum treino salvo.</p>';
}
function renderProgress(){
 const a=load('sessions',[]), sets=a.flatMap(s=>s.sets.map(x=>({...x,date:s.date})));
 const best={}; sets.forEach(x=>{if(!best[x.exercise]||x.kg>best[x.exercise].kg||(x.kg===best[x.exercise].kg&&x.reps>best[x.exercise].reps))best[x.exercise]=x});
 $('prList').innerHTML=Object.keys(best).length?Object.entries(best).map(([k,v])=>`<div class="historyrow"><span>${k}</span><b>${v.kg} kg × ${v.reps}</b></div>`).join(''):'<p class="muted">Registre treinos para gerar recordes.</p>';
 drawSessionChart(a); drawHRChart(a[a.length-1]);
}
function drawLine(canvas, pts, valueKey){
 const c=$(canvas),ctx=c.getContext('2d'),W=c.width,H=c.height;ctx.clearRect(0,0,W,H);
 if(!pts||pts.length<1){ctx.fillStyle='#aeb7c4';ctx.font='18px system-ui';ctx.fillText('Sem dados suficientes',24,45);return}
 const vals=pts.map(x=>x[valueKey]), min=Math.min(...vals),max=Math.max(...vals),pad=35,range=Math.max(1,max-min);
 ctx.strokeStyle='#303744';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(pad,15);ctx.lineTo(pad,H-pad);ctx.lineTo(W-10,H-pad);ctx.stroke();
 ctx.strokeStyle='#59d185';ctx.lineWidth=3;ctx.beginPath();
 pts.forEach((p,i)=>{const x=pad+(i/(Math.max(1,pts.length-1)))*(W-pad-15),y=15+(1-(p[valueKey]-min)/range)*(H-pad-20); i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.stroke();
}
function drawSessionChart(a){drawLine('durationChart',a.map(x=>({v:Math.round((x.duration||0)/60)})),'v')}
function drawHRChart(s){if(!s?.hr?.samples?.length) return drawLine('hrChart',[],'hr'); const sm=s.hr.samples.filter((_,i)=>i%Math.max(1,Math.floor(s.hr.samples.length/150))===0);drawLine('hrChart',sm,'hr')}

function exportData(){
 const blob=new Blob([JSON.stringify({version:2,exportedAt:new Date().toISOString(),sessions:load('sessions',[]) },null,2)],{type:'application/json'});
 const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='meu-treino-backup-'+new Date().toISOString().slice(0,10)+'.json';a.click();URL.revokeObjectURL(a.href);
}
function importData(ev){
 const f=ev.target.files[0]; if(!f)return; const r=new FileReader();r.onload=()=>{try{const d=JSON.parse(r.result);if(!Array.isArray(d.sessions))throw 0;store('sessions',d.sessions);renderDashboard();alert('Backup importado.')}catch(e){alert('Arquivo de backup inválido.')}};r.readAsText(f);
}

document.addEventListener('DOMContentLoaded',()=>{
 document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>nav(b.dataset.tab));
 $('day').onchange=buildWorkout;$('phase').onchange=buildWorkout; buildWorkout();renderDashboard();renderEquipment();
 if('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(console.error);
});
