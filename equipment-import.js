// Meu Treino Pro v5.2 — importador de equipamentos gerados externamente
function normalizeEquipmentPackage(raw){
  const items=Array.isArray(raw)?raw:(Array.isArray(raw.equipments)?raw.equipments:[raw]);
  return items.map((e,i)=>{
    if(!e||typeof e!=='object'||!String(e.name||'').trim()) throw new Error(`Equipamento ${i+1} sem nome.`);
    return {
      id:String(e.id||slugId(e.name)),name:String(e.name).trim(),category:String(e.category||'Outro'),notes:String(e.notes||e.description||''),available:e.available!==false,system:false,imported:true,
      capabilities:Array.isArray(e.capabilities)?e.capabilities:[],exercises:Array.isArray(e.exercises)?e.exercises:[],substitutions:e.substitutions&&typeof e.substitutions==='object'?e.substitutions:{}
    };
  });
}
function mergeImportedExercise(ex,equipmentId){
  if(typeof ex==='string') return {name:ex,muscle:'A definir',equipment:[equipmentId],group:'custom',target:'2 × 10–12',level:'Adaptação'};
  return {name:String(ex.name||'Exercício'),muscle:String(ex.muscle||'A definir'),equipment:Array.isArray(ex.equipment)&&ex.equipment.length?ex.equipment:[equipmentId],group:String(ex.group||'custom'),target:String(ex.target||'2 × 10–12'),level:String(ex.level||'Adaptação'),desc:String(ex.desc||'')};
}
function installEquipmentPackage(raw){
  const incoming=normalizeEquipmentPackage(raw);let catalog=getEquipmentCatalog();let lib=load('importedExerciseLibraryV52',[]);let importedSubs=load('importedSubstitutionsV52',{});
  incoming.forEach(e=>{
    const idx=catalog.findIndex(x=>x.id===e.id||x.name.toLowerCase()===e.name.toLowerCase());
    const record={id:e.id,name:e.name,category:e.category,notes:e.notes,available:e.available,system:false,imported:true,capabilities:e.capabilities};
    if(idx>=0) catalog[idx]={...catalog[idx],...record,id:catalog[idx].id}; else catalog.push(record);
    e.exercises.forEach(x=>{const ex=mergeImportedExercise(x,record.id);const j=lib.findIndex(y=>y.name.toLowerCase()===ex.name.toLowerCase());if(j>=0)lib[j]={...lib[j],...ex};else lib.push(ex)});
    Object.entries(e.substitutions).forEach(([base,alts])=>{if(!Array.isArray(importedSubs[base]))importedSubs[base]=[];(Array.isArray(alts)?alts:[alts]).forEach(a=>{const alt=typeof a==='string'?{name:a,muscle:'A definir',need:[record.id],level:'Importado',target:'2 × 10–12',desc:''}:{...a,need:Array.isArray(a.need)&&a.need.length?a.need:[record.id],level:a.level||'Importado'};if(!importedSubs[base].some(z=>z.name===alt.name))importedSubs[base].push(alt)})});
  });
  saveEquipmentCatalog(catalog);store('importedExerciseLibraryV52',lib);store('importedSubstitutionsV52',importedSubs);applyImportedSubstitutions();renderEquipmentManager();return incoming.length;
}
function applyImportedSubstitutions(){const extra=load('importedSubstitutionsV52',{});Object.entries(extra).forEach(([base,alts])=>{if(!substitutions[base])substitutions[base]=[];alts.forEach(a=>{if(!substitutions[base].some(x=>x.name===a.name))substitutions[base].push(a)})})}
async function importEquipmentFile(event){
  const input=event.target,file=input.files&&input.files[0],status=$('equipmentImportStatus');if(!file)return;
  try{const raw=JSON.parse(await file.text());const count=installEquipmentPackage(raw);if(status)status.textContent=`✓ ${count} equipamento(s) importado(s). Exercícios e substituições compatíveis foram adicionados.`;alert(`${count} equipamento(s) importado(s) com sucesso.`)}catch(err){if(status)status.textContent='Erro: '+err.message;alert('Arquivo de equipamento inválido: '+err.message)}finally{input.value=''}
}
function importedExercisesAvailable(){const have=new Set(selectedEquipment());return load('importedExerciseLibraryV52',[]).filter(ex=>(ex.equipment||[]).every(id=>have.has(id)))}
// Acrescenta exercícios importados às sugestões automáticas, sem alterar os treinos originais.
if(typeof availableExercisePool==='function'){const _pool=availableExercisePool;availableExercisePool=function(){const base=_pool();const extra=importedExercisesAvailable();return [...base,...extra.filter(e=>!base.some(b=>b.name===e.name))]}}
applyImportedSubstitutions();
