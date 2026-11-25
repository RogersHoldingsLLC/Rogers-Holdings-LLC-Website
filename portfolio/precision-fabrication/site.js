'use strict';
const source={
sheet:['FF / 001','Folded sheet-metal bracket',['Part drawing and revision, if available','Material and thickness to discuss','Quantity and required delivery date','Bends, holes and finish requirements'],'Material / thickness','Drawing / revision','Bends, holes or finish','2 mm mild steel','BRK-07, rev B'],
assembly:['FF / 002','Bolted components',['Assembly drawing and component list, if available','How the assembly will be used','Connection and finish requirements to discuss','Quantity, delivery needs and open questions'],'Materials / components','Assembly drawing / revision','Use, connections or finish','Aluminum plates, steel fasteners','ASSY-12, rev A'],
prototype:['FF / 003','Enclosure and separate lid',['Sketch or model and current revision, if available','What the prototype needs to help you learn','Material preferences and undecided details','Expected quantity and target review date'],'Material preference','Sketch or model / revision','What you want to learn','Plastic; final material undecided','Enclosure sketch, rev 1']
};
const specimenCues={sheet:'Note bends, holes, and the finish you need.',assembly:'Identify what joins together and how the assembly will be used.',prototype:'Describe what you want the prototype to prove or test.'};
const q=id=>document.getElementById(id),names={sheet:'Sheet metal',assembly:'Assembly',prototype:'Prototype'},keys=['part','material','quantity','date','drawing','notes'],states={};let selected='sheet',brief='';
const page=document.body.dataset.page, url=new URL(location.href), wanted=url.searchParams.get('process');
if(Object.hasOwn(source,wanted))selected=wanted;
function getState(){return states[selected]??=( {fields:{},checks:[]} );}
function labels(){return ['Part or project',source[selected][3],'Quantity','Needed by',source[selected][4],source[selected][5]];}
function values(){return keys.map(id=>{const el=q(id);return id==='quantity'&&!el.validity.valid?'':el.value.trim();});}
function sync(){
 const valuesNow=values(),checks=[...q('check-items').querySelectorAll('input')].map(el=>el.checked);
 getState().fields=Object.fromEntries(keys.map(id=>[id,q(id).value]));getState().checks=checks;
 const open=valuesNow.map((v,i)=>v?'':labels()[i]).filter(Boolean),topics=source[selected][2].filter((_,i)=>checks[i]);
 q('ready').textContent=checks.filter(Boolean).length+' of 4 topics marked';
 q('completion').textContent=open.length?open.length+' open '+(open.length===1?'detail':'details')+' • unknowns are kept in the brief':'All 6 details entered • review before sharing';
 brief=['QUOTE BRIEF — '+names[selected],...labels().map((label,i)=>label+': '+(valuesNow[i]||'Open')),...(topics.length?['','Topics ready to discuss:',...topics.map(t=>'• '+t)]:[])].join('\n');
 const table=document.createElement('dl');table.className='draft-fields';
 for(const [i,label] of labels().entries()){
  const row=document.createElement('div'),name=document.createElement('dt'),value=document.createElement('dd');
  name.textContent=label;value.textContent=valuesNow[i]||'Open';value.classList.toggle('open-value',!valuesNow[i]);row.append(name,value);table.append(row);
 }
 const process=document.createElement('p');process.className='draft-process';process.textContent=names[selected];
 const children=[process,table];
 if(topics.length){const ttl=document.createElement('p'),list=document.createElement('ul');ttl.className='draft-process';ttl.textContent='Topics ready to discuss';topics.forEach(t=>{const item=document.createElement('li');item.textContent=t;list.append(item);});children.push(ttl,list);}
 q('draft-summary').replaceChildren(...children);
 q('quick-process').textContent=names[selected];q('quick-quantity').textContent=valuesNow[2]||'Open';
 q('brief').textContent=brief;q('copy-status').textContent='The draft stays on this page until you choose to copy it.';
 q('clear').disabled=!valuesNow.some(Boolean)&&!checks.some(Boolean)&&!q('quantity').value;
}
q('specs')?.addEventListener('input',sync);q('topics')?.addEventListener('change',sync);
function draw(){
 const [number,caption,items,material,drawing,notes,materialExample,drawingExample]=source[selected];
 const set=(id,text)=>{if(q(id))q(id).textContent=text;};
 set('shop-process',names[selected].toUpperCase());set('hero-number',number);set('hero-caption',caption);set('hero-cue',specimenCues[selected]);
 if(q('hero-specimen')){const photo={sheet:'bracket',assembly:'bolted-fixture',prototype:'enclosure'}[selected];const src='/portfolio/precision-fabrication/assets/photo-v23/'+photo+'.jpg';if(q('hero-specimen').getAttribute('src')!==src){q('reference-avif')?.setAttribute('srcset','/portfolio/precision-fabrication/assets/photo-v24/'+photo+'.avif');q('hero-specimen').src=src;}q('hero-specimen').alt='Illustrative reference: '+caption;}
 if(q('hero-sketch')){q('hero-sketch').src='/portfolio/precision-fabrication/assets/study-'+selected+'.svg';q('hero-sketch').alt='Illustrative line study: '+caption+', not to scale';}
 for(const input of document.querySelectorAll('input[name="hero-process"],input[name="process"]'))input.checked=input.value===selected;
 for(const link of document.querySelectorAll('a[data-process-link]')){
  const target=new URL(link.href);target.searchParams.set('process',selected);link.href=target.pathname+target.search+target.hash;
 }
 for(const link of document.querySelectorAll('[data-public-tracker],#open-public-tracker')){
  link.href='/portfolio/projects/customer-follow-up/#quote-process='+selected;
 }
 if(page!=='brief')return;
 set('sample-status','');set('specimen-cue',specimenCues[selected]);set('ref-number',number);set('caption',caption);
 set('material-label',material);set('drawing-label',drawing);set('notes-label',notes);
 q('material').placeholder='e.g. '+materialExample;q('drawing').placeholder='e.g. '+drawingExample;
 const draft=getState(); for(const id of keys)q(id).value=draft.fields[id]||'';
 q('check-items').replaceChildren(...items.map((t,i)=>{const label=document.createElement('label'),box=document.createElement('input');box.type='checkbox';box.checked=!!draft.checks[i];label.append(box,' '+t);return label;}));
 sync();
}
function changeProcess(e){const k=e.target.value;if(Object.hasOwn(source,k)&&k!==selected){if(page==='brief')sync();selected=k;if(page!=='home'){url.searchParams.set('process',k);history.replaceState(null,'',url.pathname+url.search+location.hash);}draw();}}
q('process')?.addEventListener('change',changeProcess);q('hero-process')?.addEventListener('change',changeProcess);
q('exhibit')?.querySelector('.hero-view').addEventListener('change',e=>{q('exhibit').dataset.view=e.target.value;});
q('clear')?.addEventListener('click',()=>{delete states[selected];draw();q('part').focus();});
function selectBrief(){q('plain-text').open=true;q('brief').focus();const range=document.createRange();range.selectNodeContents(q('brief'));const selection=getSelection();selection.removeAllRanges();selection.addRange(range);q('copy-status').textContent='Brief selected. Use your device’s Copy command.';}
q('copy')?.addEventListener('click',async()=>{try{if(!navigator.clipboard){selectBrief();return;}await navigator.clipboard.writeText(brief);q('copy-status').textContent='Brief copied. Nothing was submitted.';}catch{selectBrief();}});
const examples={sheet:['Mounting bracket','2 mm mild steel','25','', 'BRK-07 · Rev B','Deburr edges. Confirm hole spacing before cutting.'],assembly:['Bolt-on mounting jig','Aluminum plates; steel fasteners','12','','JIG-12 · Rev A','Keep fasteners reachable after assembly. Confirm mating faces.'],prototype:['Test enclosure','Plastic; final material open','3','','ENC-03 · Rev 1','Check cable clearance and whether the lid lifts without tools.']};
q('try-sample')?.addEventListener('click',()=>{
 if(keys.some(id=>q(id).value.trim()||q(id).validity.badInput)||getState().checks.some(Boolean)){q('sample-status').textContent='Your current draft was kept. Clear it first or pick another process to try a sample.';return;}
 examples[selected].forEach((value,i)=>q(keys[i]).value=value);sync();
 q('sample-status').textContent='Example details loaded. Edit or clear them any time.';
});
q('print-brief')?.addEventListener('click',()=>window.print());
function resetSample(){q('owner').textContent='Unassigned';q('action').textContent='Needs an owner before follow-up';q('assign').disabled=false;}
q('assign')?.addEventListener('click',()=>{q('owner').textContent='Sample coordinator';q('action').textContent='Ready for illustrative follow-up';q('assign').disabled=true;});q('reset')?.addEventListener('click',resetSample);
for(const id of ['copy','print-brief','assign','reset','try-sample'])if(q(id))q(id).disabled=false;
draw();
