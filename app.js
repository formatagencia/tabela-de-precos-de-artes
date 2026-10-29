const money = new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL',minimumFractionDigits:0});
const categories=[...new Set(SERVICES.map(s=>s.category))];
let activeCategory='Todos', activePackage='Feed';
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

function renderPackages(){
  const prefix=activePackage==='Feed + story'?'Feed + story (mesma criação)':activePackage;
  const rows=SERVICES.filter(s=>s.name.startsWith(prefix+' —'));
  $('#package-grid').innerHTML=rows.map((s,i)=>`<article class="package-card ${i===1?'featured':''}"><p>${s.quantity===1?'Avulso':`Pacote de ${s.quantity}`}</p><h3>${s.quantity} ${s.unit}${s.quantity>1?'s':''}</h3><strong>${money.format(s.total)}</strong><span>${money.format(s.unitPrice)} por ${s.unit}</span></article>`).join('');
  $('#package-note').hidden=activePackage!=='Feed + story';
}
function renderFilters(){
  $('#filters').innerHTML=['Todos',...categories].map(c=>`<button type="button" class="chip ${c===activeCategory?'active':''}" aria-pressed="${c===activeCategory}" data-category="${esc(c)}">${esc(c)}</button>`).join('');
}
function renderServices(){
  const query=$('#search').value.trim().toLocaleLowerCase('pt-BR');
  const rows=SERVICES.filter(s=>(activeCategory==='Todos'||s.category===activeCategory)&&s.name.toLocaleLowerCase('pt-BR').includes(query));
  const groups=categories.map(category=>[category,rows.filter(s=>s.category===category)]).filter(([,items])=>items.length);
  $('#services').innerHTML=groups.map(([category,items])=>`<section class="service-group"><h3>${esc(category)}</h3><div class="service-list">${items.map(s=>`<article class="service"><div class="service-main"><h4>${esc(s.name)}</h4>${s.rule?`<p>${esc(s.rule)}</p>`:''}</div><div class="service-meta"><span>${esc(s.unit)}</span><strong>${money.format(s.total)}</strong>${s.quantity>1?`<small>${money.format(s.unitPrice)} por ${esc(s.unit)}</small>`:''}</div></article>`).join('')}</div></section>`).join('');
  $('#result-count').textContent=`${rows.length} ${rows.length===1?'serviço':'serviços'}`;
  $('#empty').hidden=rows.length>0;
}
function updateCalc(){
  const cover=Number($('#carousel-tier').value), count=Math.max(1,Math.floor(Number($('#slide-count').value)||1));
  $('#slide-count').value=count; const extras=count-1, extrasTotal=extras*30, total=cover+extrasTotal;
  $('#carousel-result').innerHTML=`<span>Valor da capa <b>${money.format(cover)}</b></span><span>${extras} ${extras===1?'slide adicional':'slides adicionais'} × ${money.format(30)} <b>${money.format(extrasTotal)}</b></span><strong>Total do carrossel <b>${money.format(total)}</b></strong>`;
}
document.addEventListener('click',e=>{
  const tab=e.target.closest('.tab'); if(tab){activePackage=tab.dataset.package; document.querySelectorAll('.tab').forEach(b=>{b.classList.toggle('active',b===tab);b.setAttribute('aria-selected',b===tab)});renderPackages();}
  const chip=e.target.closest('.chip'); if(chip){activeCategory=chip.dataset.category;renderFilters();renderServices();}
});
$('#search').addEventListener('input',renderServices); $('#carousel-tier').addEventListener('change',updateCalc); $('#slide-count').addEventListener('input',updateCalc);
$('#clear').addEventListener('click',()=>{activeCategory='Todos';$('#search').value='';renderFilters();renderServices();$('#search').focus();});
renderPackages();renderFilters();renderServices();updateCalc();
