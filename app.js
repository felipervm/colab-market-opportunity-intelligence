const defaultWeights = {product_fit:25,public_evidence:25,potential_impact:20,sales_accessibility:15,testability:15};
const labels = {product_fit:'Product fit',public_evidence:'Public evidence',potential_impact:'Potential impact',sales_accessibility:'Sales accessibility',testability:'Testability'};
const scenarios = {baseline:defaultWeights,evidence:{product_fit:15,public_evidence:45,potential_impact:15,sales_accessibility:10,testability:15},speed:{product_fit:15,public_evidence:10,potential_impact:15,sales_accessibility:25,testability:35}};
let records = [], weights = {...defaultWeights};
const $ = id => document.getElementById(id);
const totalWeight = () => Object.values(weights).reduce((a,b)=>a+b,0);
const score = record => totalWeight() ? Object.keys(weights).reduce((sum,key)=>sum+Number(record[key])*weights[key],0)/totalWeight() : null;
const fmt = number => number.toFixed(2);
function update() {
 const total = totalWeight();
 for (const key of Object.keys(weights)) {
  const effective = total ? (100*weights[key]/total).toFixed(0)+'%' : '—';
  $('label-'+key).textContent = weights[key]+' pts · '+effective;
  $('weight-'+key).setAttribute('aria-valuetext',weights[key]+' weight points; effective share '+effective);
 }
 $('weight-total').textContent = total ? 'Total: '+total+' weight points. Effective shares shown above; rounded shares may not sum to 100%.' : 'Select at least one nonzero weight to calculate a ranking.';
 const list = $('ranklist'); list.replaceChildren();
 if (!records.length || !total) {
  list.textContent = !records.length ? 'Loading model…' : 'No ranking: all five weights are zero.';
  $('interpret').textContent = 'A ranking needs at least one weighted criterion.';
  $('sensitivity').textContent = 'No meaningful comparison until a criterion has weight.';return;
 }
 const ranked = [...records].sort((a,b)=>score(b)-score(a));
 ranked.forEach((record,index)=>{
  const row=document.createElement('div');row.className='rankrow';
  const tied=ranked.filter(r=>Math.abs(score(r)-score(record))<1e-9).length>1;
  const place=ranked.findIndex(r=>Math.abs(score(r)-score(record))<1e-9)+1;
  const position=document.createElement('span');position.textContent=String(place).padStart(2,'0');
  const description=document.createElement('div');const name=document.createElement('strong');name.textContent=record.segment+(tied?' · tied':'');
  const info=document.createElement('small');info.textContent=record.observable_public_signals;description.append(name,info);
  const track=document.createElement('div');track.className='bar';const fill=document.createElement('div');fill.className='fill';fill.style.width=score(record)/5*100+'%';track.append(fill);
  const value=document.createElement('b');value.textContent=fmt(score(record));value.setAttribute('aria-label',fmt(score(record))+' out of 5');row.append(position,description,track,value);list.append(row);
 });
 const top=ranked[0], leaders=ranked.filter(r=>Math.abs(score(r)-score(top))<1e-9), gap=score(top)-score(ranked[1]);
 $('sensitivity').textContent = leaders.length>1 ? 'The leading score is tied. These assumptions do not identify a unique first choice.' : 'Lead over second place: '+fmt(gap)+'/5. '+(gap<0.15?'A small lead: modest assumption changes can reverse the order.':'This is a model margin, not statistical confidence.');
 $('interpret').textContent = leaders.length>1 ? 'Under these assumptions, '+leaders.map(r=>r.segment).join(' and ')+' share the top score. Use discovery evidence to distinguish them before choosing a lane.' : 'Under these assumptions, '+top.segment+' ranks first ('+fmt(score(top))+'/5). Treat it as a discovery lead. Validate the buyer, repeated pain, sales cycle and implementation scope with the team before allocating GTM resources.';
}
function setScenario(name){weights={...scenarios[name]};for(const key of Object.keys(weights))$('weight-'+key).value=weights[key];document.querySelectorAll('[data-scenario]').forEach(button=>{const chosen=button.dataset.scenario===name;button.classList.toggle('chosen',chosen);button.setAttribute('aria-pressed',String(chosen));});update();}
for(const key of Object.keys(weights)){
 const row=document.createElement('div');row.className='slider-item';const label=document.createElement('label');label.htmlFor='weight-'+key;
 const text=document.createElement('span');text.textContent=labels[key];const value=document.createElement('span');value.id='label-'+key;label.append(text,value);
 const input=document.createElement('input');Object.assign(input,{type:'range',id:'weight-'+key,min:0,max:100,value:weights[key]});
 input.addEventListener('input',()=>{weights[key]=Number(input.value);document.querySelectorAll('[data-scenario]').forEach(button=>{button.classList.remove('chosen');button.setAttribute('aria-pressed','false');});update();});row.append(label,input);$('sliders').append(row);
}
document.querySelectorAll('[data-scenario]').forEach(button=>button.addEventListener('click',()=>setScenario(button.dataset.scenario)));
$('reset').addEventListener('click',()=>setScenario('baseline'));
function parseLine(line){const cells=[];let cell='',quoted=false;for(let i=0;i<line.length;i++){const char=line[i];if(char==='"'){if(quoted&&line[i+1]==='"'){cell+='"';i++;}else quoted=!quoted;}else if(char===','&&!quoted){cells.push(cell);cell='';}else cell+=char;}cells.push(cell);return cells;}
fetch('data/opportunity_assumptions.csv?v=20261019-colab-v2').then(response=>{if(!response.ok)throw Error('CSV unavailable');return response.text();}).then(text=>{
 const lines=text.trim().split(/\r?\n/),header=parseLine(lines.shift());records=lines.filter(Boolean).map(line=>{const values=parseLine(line);return Object.fromEntries(header.map((key,i)=>[key,values[i]||'']));});
 for(const record of records){const row=document.createElement('tr');const name=document.createElement('td');const link=document.createElement('a');link.textContent=record.segment;link.href=record.source;link.target='_blank';link.rel='noopener';name.append(link);row.append(name);for(const key of Object.keys(weights)){const cell=document.createElement('td');cell.textContent=record[key];row.append(cell);}$('input-rows').append(row);}
 update();
}).catch(()=>{$('ranklist').textContent='The model could not load. Download the assumptions CSV below.';$('interpret').textContent='No ranking available.';$('sensitivity').textContent='Data unavailable; no recommendation calculated.';$('input-rows').textContent='Inputs unavailable.';});
