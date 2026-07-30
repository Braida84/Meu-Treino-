// Meu Treino Pro v5.3 — arquitetura dinâmica de treinos
(function(){
 const ENGINE_VERSION='5.3';
 function ls(k,d){try{return JSON.parse(localStorage.getItem(k))??d}catch(e){return d}}
 function save(k,v){localStorage.setItem(k,JSON.stringify(v))}
 function availableIds(){try{return new Set(getEquipmentCatalog().filter(e=>e.available!==false).map(e=>e.id))}catch(e){return new Set()}}
 function importedLibrary(){const x=ls('importedExerciseLibraryV52',[]);return Array.isArray(x)?x:[]}
 function normalizeExercise(e,source='base'){
  return {name:String(e.name||'Exercício'),muscle:String(e.muscle||'A definir'),equipment:Array.isArray(e.equipment)?e.equipment:[],group:String(e.group||'custom'),target:String(e.target||'2 × 10–12'),level:String(e.level||'Adaptação'),desc:String(e.desc||''),video:e.video||('https://www.youtube.com/results?search_query='+encodeURIComponent(String(e.name||'exercicio')+' execução correta')),_source:source};
 }
 function exercisePool(){
  const have=availableIds();
  const imported=importedLibrary().map(e=>normalizeExercise(e,'imported')).filter(e=>e.equipment.every(id=>have.has(id)));
  const base=(typeof v51ExerciseLibrary!=='undefined'?v51ExerciseLibrary:[]).map(e=>normalizeExercise(e,'base')).filter(e=>e.equipment.every(id=>have.has(id)));
  const seen=new Set(), all=[];
  [...imported,...base].forEach(e=>{const key=e.name.toLowerCase();if(!seen.has(key)){seen.add(key);all.push(e)}});
  return all;
 }
 function take(pool,group,n){return pool.filter(e=>e.group===group).slice(0,n)}
 function generate(){
  const pool=exercisePool();
  const cardio=take(pool,'cardio',1), core=take(pool,'core',2);
  const A=[...cardio,...take(pool,'push',5),...(core[0]?[core[0]]:[])];
  const B=[...cardio,...take(pool,'pull',5),...(core[1]?[core[1]]:core[0]?[core[0]]:[])];
  const C=[...cardio,...take(pool,'legs',6),...(core[0]?[core[0]]:[])];
  const data={version:ENGINE_VERSION,generatedAt:new Date().toISOString(),A,B,C};
  save('activeWorkoutsV53',data);save('generatedWorkoutsV5',{A,B,C});return data;
 }
 function current(){const d=ls('activeWorkoutsV53',null);return d&&d.version===ENGINE_VERSION?d:generate()}
 function summary(data){return `A: ${data.A.length} • B: ${data.B.length} • C: ${data.C.length}`}
 window.recalculateWorkouts=function(silent=false){
  const data=generate();
  if(typeof renderGeneratedNotice==='function')renderGeneratedNotice();
  if(typeof buildWorkout==='function')buildWorkout();
  const imp=exercisePool().filter(e=>e._source==='imported').length;
  if(!silent)alert(`Treinos atualizados com os equipamentos disponíveis. ${summary(data)}. ${imp} exercício(s) importado(s) disponível(is).`);
  return data;
 };
 function selectedDayExercises(){const day=document.getElementById('day')?.value||'A';return current()[day]||[]}
 window.buildWorkout=function(){
  const day=document.getElementById('day')?.value||'A',phase=document.getElementById('phase')?.value||'2',host=document.getElementById('workoutList');if(!host)return;host.innerHTML='';
  const list=current()[day]||[];
  if(!list.length){host.innerHTML='<div class="card notice"><b>Nenhum treino compatível.</b><p class="muted">Ative ou importe equipamentos e toque em Recalcular treinos.</p></div>';return}
  list.forEach((e,idx)=>{
   const card=document.createElement('article');card.className='card exercise';let setCount=(e.target.match(/^(\d+)/)||[])[1];setCount=setCount?+setCount:0;if(phase==='1'&&setCount>2)setCount=2;
   card.innerHTML=`<div class="exhead"><div><h3>${idx+1}. ${e.name}</h3><div class="accent">${e.muscle} • ${e.target}</div></div><a class="iconbtn" target="_blank" rel="noopener" href="${e.video||('https://www.youtube.com/results?search_query='+encodeURIComponent(e.name+' execução correta'))}">▶</a></div><p>${e.desc||''}</p>${setCount?`<div class="sets">${Array.from({length:setCount},(_,s)=>`<div class="setrow"><b>S${s+1}</b><input inputmode="decimal" type="number" step="0.5" placeholder="kg" data-ex="${idx}" data-set="${s}" data-k="kg"><input inputmode="numeric" type="number" placeholder="reps" data-ex="${idx}" data-set="${s}" data-k="reps"><input inputmode="decimal" type="number" min="1" max="10" step="0.5" placeholder="RPE" data-ex="${idx}" data-set="${s}" data-k="rpe"><button class="done" onclick="completeSet(this,${idx},${s})">✓</button></div>`).join('')}</div>`:`<label>Tempo realizado <input type="number" placeholder="min/seg" data-ex="${idx}" data-set="0" data-k="time"></label>`}`;
   host.appendChild(card);
  });
  const box=document.getElementById('generatedNotice');if(box){box.classList.remove('hide');box.innerHTML=`<b>Treino ativo recalculado pelos equipamentos</b><div class="muted">${summary(current())}. Equipamentos excluídos/desativados não entram no próximo cálculo.</div>`}
 };
 window.completeSet=function(btn,ex,setn){
  if(!activeSession)startSession();const e=selectedDayExercises()[ex];if(!e)return;const row=btn.closest('.setrow'),kg=+(row.querySelector('[data-k=kg]').value||0),reps=+(row.querySelector('[data-k=reps]').value||0),rpe=+(row.querySelector('[data-k=rpe]').value||0);
  const rec={exercise:e.name,exIndex:ex,set:setn+1,kg,reps,rpe,ts:new Date().toISOString(),hr:currentHR};activeSession.sets=activeSession.sets.filter(x=>!(x.exIndex===ex&&x.set===setn+1));activeSession.sets.push(rec);btn.classList.add('ok');btn.textContent='✓';startRest(75);
 };
 const oldToggle=window.toggleEquipment;window.toggleEquipment=function(id,on){oldToggle(id,on);recalculateWorkouts(true)};
 const oldDelete=window.deleteEquipment;window.deleteEquipment=function(id){const before=getEquipmentCatalog().length;oldDelete(id);if(getEquipmentCatalog().length!==before)recalculateWorkouts(true)};
 const oldRestore=window.restoreDefaultEquipment;window.restoreDefaultEquipment=function(){const before=JSON.stringify(getEquipmentCatalog());oldRestore();if(JSON.stringify(getEquipmentCatalog())!==before)recalculateWorkouts(true)};
 const oldSave=window.saveEquipment;window.saveEquipment=function(){oldSave();recalculateWorkouts(true)};
 document.addEventListener('DOMContentLoaded',()=>{
  const day=document.getElementById('day');if(day)day.addEventListener('change',buildWorkout);const phase=document.getElementById('phase');if(phase)phase.addEventListener('change',buildWorkout);
  recalculateWorkouts(true);
  setTimeout(()=>{const btn=[...document.querySelectorAll('button')].find(b=>b.textContent.includes('Recalcular treinos'));if(btn)btn.onclick=()=>recalculateWorkouts(false)},0);
 });
 // equipment-import.js é carregado antes deste arquivo; ao importar, recalcula automaticamente.
 if(typeof window.importEquipmentFile==='function'){
  const oldImport=window.importEquipmentFile;window.importEquipmentFile=async function(ev){await oldImport(ev);recalculateWorkouts(true)};
 }
})();