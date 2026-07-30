// Meu Treino Pro v5.2.1 — camada de treino inteligente + BLE
const v51EquipmentProfiles=[
 {patterns:['halter ajustavel','halter ajustável','dumbbell'],label:'Halter/peso livre',base:'dumbbells'},
 {patterns:['barra fixa','pullup','pull up'],label:'Barra fixa',base:'pullup_bar'},
 {patterns:['step','degrau'],label:'Step/degrau',base:'step'},
 {patterns:['bola pilates','bola de pilates','fitball'],label:'Bola de Pilates',base:'pilates_ball'},
 {patterns:['esteira','treadmill'],label:'Esteira',base:'treadmill'},
 {patterns:['corda','jump rope'],label:'Corda',base:'jump_rope'},
 {patterns:['rolo abdominal','rolete abdominal','ab roller'],label:'Rolo abdominal',base:'ab_roller'},
 {patterns:['extensora'],label:'Cadeira extensora',base:'leg_extension'},
 {patterns:['flexora'],label:'Cadeira flexora',base:'leg_curl'},
 {patterns:['polia','crossover','estacao','estação'],label:'Estação de cabos/polia',base:'ms8000'},
 {patterns:['banco ajustavel','banco ajustável','banco reto'],label:'Banco',base:'bench'},
 {patterns:['barra olimpica','barra olímpica','barra reta'],label:'Barra',base:'barbell'}
];
const v51ExerciseLibrary=[
 {name:'Supino com halteres',muscle:'Peito • tríceps',equipment:['dumbbells','bench'],group:'push',target:'3 × 10–12'},
 {name:'Crucifixo com halteres',muscle:'Peitoral',equipment:['dumbbells','bench'],group:'push',target:'2 × 12–15'},
 {name:'Desenvolvimento com halteres',muscle:'Ombros',equipment:['dumbbells','bench'],group:'push',target:'2 × 10–12'},
 {name:'Elevação lateral',muscle:'Ombros',equipment:['dumbbells'],group:'push',target:'2 × 12–15'},
 {name:'Tríceps francês',muscle:'Tríceps',equipment:['dumbbells'],group:'push',target:'2 × 10–12'},
 {name:'Remada unilateral',muscle:'Costas • bíceps',equipment:['dumbbells','bench'],group:'pull',target:'3 × 10–12/lado'},
 {name:'Pullover com halter',muscle:'Dorsais',equipment:['dumbbells','bench'],group:'pull',target:'2 × 10–12'},
 {name:'Rosca alternada',muscle:'Bíceps',equipment:['dumbbells'],group:'pull',target:'2 × 10–12'},
 {name:'Crucifixo inverso inclinado',muscle:'Deltoide posterior • trapézio',equipment:['dumbbells','bench'],group:'pull',target:'2 × 12–15'},
 {name:'Barra fixa assistida',muscle:'Costas • bíceps',equipment:['pullup_bar','step'],group:'pull',target:'3 × 5–8'},
 {name:'Agachamento Goblet',muscle:'Quadríceps • glúteos',equipment:['dumbbells'],group:'legs',target:'3 × 10–12'},
 {name:'Terra romeno com halteres',muscle:'Posteriores • glúteos',equipment:['dumbbells'],group:'legs',target:'2 × 10–12'},
 {name:'Step-up',muscle:'Quadríceps • glúteos',equipment:['step'],group:'legs',target:'2 × 8–10/lado'},
 {name:'Flexão de joelhos com bola',muscle:'Posteriores',equipment:['pilates_ball','mat'],group:'legs',target:'3 × 10–12'},
 {name:'Prancha',muscle:'Core',equipment:['mat'],group:'core',target:'2 × 20–30 s'},
 {name:'Rolo abdominal',muscle:'Core',equipment:['ab_roller','mat'],group:'core',target:'2 × 6–10'},
 {name:'Caminhada em esteira',muscle:'Cardiorrespiratório',equipment:['treadmill'],group:'cardio',target:'8–15 min'}
];
function v51Norm(s=''){return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')}
function v51Recognize(name){const n=v51Norm(name);return v51EquipmentProfiles.find(p=>p.patterns.some(x=>n.includes(v51Norm(x))))||{label:'Equipamento personalizado',base:null}}
function updateEquipmentRecognition(){
 const input=document.getElementById('eqName'),out=document.getElementById('eqRecognition'),list=document.getElementById('eqSuggestedExercises'); if(!input||!out||!list)return;
 if(!input.value.trim()){out.textContent='Digite o nome do equipamento para identificar o tipo.';list.innerHTML='';return}
 const p=v51Recognize(input.value);out.innerHTML='Reconhecido como: <strong>'+p.label+'</strong>';
 const have=new Set(typeof selectedEquipment==='function'?selectedEquipment():[]);if(p.base)have.add(p.base);
 const ex=v51ExerciseLibrary.filter(e=>p.base&&e.equipment.includes(p.base)&&e.equipment.every(x=>have.has(x))).slice(0,6);
 list.innerHTML=ex.length?ex.map(e=>'<div class="altcard"><b>'+e.name+'</b><div class="accent">'+e.muscle+'</div><div class="muted">'+e.target+'</div></div>').join(''):'<div class="muted">Nenhuma sugestão automática para este tipo ainda.</div>';
}
function v52ImportedExercises(){
 try{
  const have=new Set(typeof selectedEquipment==='function'?selectedEquipment():[]);
  const extra=JSON.parse(localStorage.getItem('importedExerciseLibraryV52')||'[]');
  return Array.isArray(extra)?extra.filter(e=>(e.equipment||[]).every(id=>have.has(id))):[];
 }catch(e){return []}
}
function v52WorkoutPool(){
 const have=new Set(typeof selectedEquipment==='function'?selectedEquipment():[]);
 const base=v51ExerciseLibrary.filter(e=>e.equipment.every(x=>have.has(x)));
 const extra=v52ImportedExercises();
 return [...base,...extra.filter(e=>!base.some(b=>b.name.toLowerCase()===String(e.name).toLowerCase()))];
}
function recalculateWorkouts(){
 const pool=v52WorkoutPool();
 const take=(g,n)=>pool.filter(e=>e.group===g).slice(0,n);
 const generated={A:[...take('cardio',1),...take('push',5),...take('core',1)],B:[...take('cardio',1),...take('pull',5),...take('core',1)],C:[...take('cardio',1),...take('legs',6),...take('core',1)]};
 localStorage.setItem('generatedWorkoutsV5',JSON.stringify(generated));renderGeneratedNotice();
 const imported=v52ImportedExercises().length;
 alert('Sugestões recalculadas com os equipamentos disponíveis. '+imported+' exercício(s) importado(s) compatível(is) considerado(s). O treino original foi preservado.');
}
function renderGeneratedNotice(){
 const box=document.getElementById('generatedNotice');if(!box)return;let data=null;try{data=JSON.parse(localStorage.getItem('generatedWorkoutsV5'))}catch(e){}if(!data){box.classList.add('hide');return}
 const day=document.getElementById('day')?.value||'A',arr=data[day]||[];box.classList.remove('hide');box.innerHTML='<b>Sugestão automática com seus equipamentos</b><div class="muted">O treino principal continua preservado.</div>'+arr.map(e=>'<div class="historyrow"><span>'+e.name+'</span><span>'+e.target+'</span></div>').join('');
}
function setHRDiag(msg){const el=document.getElementById('hrDiag');if(el)el.textContent=new Date().toLocaleTimeString('pt-BR')+' — '+msg}
async function connectHR(){
 if(!navigator.bluetooth){alert('Web Bluetooth não está disponível. Use Chrome no Android e abra o app por HTTPS.');return}
 try{
  document.getElementById('hrStatus').textContent='Abrindo seletor Bluetooth...';setHRDiag('1. Seletor BLE aberto');
  hrDevice=await navigator.bluetooth.requestDevice({acceptAllDevices:true,optionalServices:['heart_rate','battery_service']});setHRDiag('2. Dispositivo escolhido: '+(hrDevice.name||'sem nome'));
  document.getElementById('hrStatus').textContent='Conectando...';hrDevice.addEventListener('gattserverdisconnected',()=>{document.getElementById('hrStatus').textContent='Desconectada';document.getElementById('hrDot').classList.remove('on');setHRDiag('Desconectada do GATT')});
  const server=await hrDevice.gatt.connect();setHRDiag('3. GATT conectado');document.getElementById('hrStatus').textContent='Procurando serviço cardíaco...';
  let service;try{service=await server.getPrimaryService('heart_rate')}catch(e){setHRDiag('4. GATT conectado, mas serviço Heart Rate não encontrado');throw new Error('Dispositivo conectado, mas sem o serviço padrão Heart Rate 0x180D.')}
  setHRDiag('4. Serviço Heart Rate encontrado');hrChar=await service.getCharacteristic('heart_rate_measurement');setHRDiag('5. Heart Rate Measurement encontrada');await hrChar.startNotifications();setHRDiag('6. Notificações de BPM iniciadas');
  hrChar.addEventListener('characteristicvaluechanged',ev=>{const hr=parseHeartRate(ev.target.value);currentHR=hr;document.getElementById('hrNow').textContent=hr;document.getElementById('hrStatus').textContent=hrDevice.name||'Cinta conectada';document.getElementById('hrDot').classList.add('on');hrSamples.push({t:Date.now(),hr});if(hrSamples.length>7200)hrSamples.shift();updateLiveHR();setHRDiag('7. Recebendo BPM: '+hr)});
 }catch(e){document.getElementById('hrStatus').textContent='Não conectada';if(e.name==='NotFoundError'){setHRDiag('Busca cancelada ou nenhum dispositivo selecionado');return}setHRDiag('Erro: '+e.message);alert('Não foi possível conectar: '+e.message)}
}
document.addEventListener('DOMContentLoaded',()=>{
 const btn=[...document.querySelectorAll('button')].find(b=>b.getAttribute('onclick')==='connectHR()');if(btn)btn.textContent='Procurar cinta BLE';
 const hrCard=document.getElementById('hrStatus')?.closest('.card');if(hrCard&&!document.getElementById('hrDiag')){const d=document.createElement('div');d.className='recognition';d.innerHTML='<b>Diagnóstico Bluetooth</b><div class="muted" id="hrDiag">Aguardando tentativa de conexão.</div>';hrCard.appendChild(d)}
 const manager=document.getElementById('equipmentManager');if(manager){const bar=manager.previousElementSibling;if(bar&&!bar.querySelector('[data-v51-recalc]')){const b=document.createElement('button');b.dataset.v51Recalc='1';b.textContent='↻ Recalcular treinos';b.onclick=recalculateWorkouts;bar.insertBefore(b,bar.lastElementChild)}}
 const notes=document.getElementById('eqNotes');if(notes&&!document.getElementById('eqRecognition')){const r=document.createElement('div');r.className='recognition';r.innerHTML='<b>Reconhecimento inteligente</b><div class="muted" id="eqRecognition">Digite o nome do equipamento para identificar o tipo.</div><div id="eqSuggestedExercises" class="exlib"></div>';notes.closest('label').after(r)}
 document.getElementById('eqName')?.addEventListener('input',updateEquipmentRecognition);
 const wl=document.getElementById('workoutList');if(wl&&!document.getElementById('generatedNotice')){const g=document.createElement('div');g.id='generatedNotice';g.className='card hide';wl.before(g)}
 document.getElementById('day')?.addEventListener('change',renderGeneratedNotice);renderGeneratedNotice();
});