
// admin.js - owner panel (reads same localStorage key 'rifa_data_v1')
document.addEventListener('DOMContentLoaded', ()=>{
  const TOTAL = 120;
  const KEY = 'rifa_data_v1';
  const grid = document.getElementById('grid');
  const soldCountEl = document.getElementById('soldCount');
  const detailBox = document.getElementById('detailBox');
  const modal = document.getElementById('modal');
  const mId = document.getElementById('mId');
  const mNome = document.getElementById('mNome');
  const mTel = document.getElementById('mTel');
  const mEmail = document.getElementById('mEmail');
  const mNasc = document.getElementById('mNasc');
  const mCidade = document.getElementById('mCidade');
  const mPais = document.getElementById('mPais');
  const mFeedback = document.getElementById('mFeedback');
  const mCompArea = document.getElementById('mCompArea');

  function loadData(){ return JSON.parse(localStorage.getItem(KEY) || '{}'); }
  function saveData(d){ localStorage.setItem(KEY, JSON.stringify(d)); }

  function renderGrid(){
    const tickets = loadData();
    grid.innerHTML='';
    let sold = 0;
    for(let i=1;i<=TOTAL;i++){
      const d = document.createElement('div');
      d.className = 'ticket';
      d.innerText = i;
      if(tickets[String(i)]){ d.classList.add('sold'); sold++; }
      grid.appendChild(d);
    }
    soldCountEl.innerText = sold;
  }

  function openModal(id){
    const db = loadData();
    const data = db[String(id)] || null;
    mId.innerText = id;
    mNome.value = data?data.nome||'':'';
    mTel.value = data?data.telephone||'':'';
    mEmail.value = data?data.email||'':'';
    mNasc.value = data?data.nasc||'':'';
    mCidade.value = data?data.cidade||'':'';
    mPais.value = data?data.pais||'':'';
    mFeedback.value = data?data.feedback||'':'';
    mCompArea.innerHTML='';
    if(data && data.comp){ const img = document.createElement('img'); img.src = data.comp; img.style.maxWidth='220px'; mCompArea.appendChild(img); const a=document.createElement('a'); a.href=data.comp; a.target='_blank'; a.innerText='Abrir comprovativo'; a.style.display='block'; mCompArea.appendChild(a); }
    modal.style.display='flex';
    detailBox.innerHTML = 'Bilhete '+id+' — '+(data?('Vendido a '+(data.nome||'--')):'Disponível');
  }

  grid.addEventListener('click', (e)=>{ const t=e.target; if(t && t.classList.contains('ticket')){ const id=parseInt(t.innerText,10); openModal(id); } });

  document.getElementById('mClose').addEventListener('click', ()=>{ modal.style.display='none'; });
  document.getElementById('mSave').addEventListener('click', ()=>{
    const id = parseInt(mId.innerText,10);
    const db = loadData();
    db[String(id)] = { nome: mNome.value, telephone: mTel.value, email: mEmail.value, nasc: mNasc.value, cidade: mCidade.value, pais: mPais.value, feedback: mFeedback.value, preco:20, boughtAt: new Date().toISOString() };
    saveData(db);
    alert('Guardado');
    renderGrid();
    modal.style.display='none';
  });

  document.getElementById('mDelete').addEventListener('click', ()=>{
    const id = parseInt(mId.innerText,10);
    if(!confirm('Eliminar compra deste bilhete?')) return;
    const db = loadData();
    delete db[String(id)];
    saveData(db);
    alert('Eliminado'); renderGrid(); modal.style.display='none';
  });

  document.getElementById('exportCsvBtn').addEventListener('click', ()=>{
    const db = loadData();
    const rows = [['bilhete','nome','telefone','email','nasc','cidade','pais','preco']];
    for(let i=1;i<=TOTAL;i++){ const d=db[String(i)]||{}; rows.push([i,d.nome||'',d.telephone||'',d.email||'',d.nasc||'',d.cidade||'',d.pais||'',d.preco||'']); }
    const csv = rows.map(r=>r.map(c=>'"'+String(c).replace(/"/g,'""')+'"').join(',')).join('\\n');
    const a=document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv],{type:'text/csv'})); a.download='rifa_export.csv'; a.click();
  });

  document.getElementById('exportJsonBtn').addEventListener('click', ()=>{
    const db = loadData(); const a=document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(db,null,2)],{type:'application/json'})); a.download='rifa_export.json'; a.click();
  });

  document.getElementById('drawBtn').addEventListener('click', ()=>{
    const db = loadData(); const keys = Object.keys(db); if(keys.length !== TOTAL) return alert('Só é possível sortear quando todos os bilhetes estiverem vendidos.'); const ids = keys.map(k=>parseInt(k,10)); const winner = ids[Math.floor(Math.random()*ids.length)]; // save winner
    const history = JSON.parse(localStorage.getItem('rifa_history_v1')||'[]'); history.unshift({id:winner,at:new Date().toISOString(),buyer: db[String(winner)]||null}); localStorage.setItem('rifa_history_v1', JSON.stringify(history)); alert('Vencedor: '+winner); renderGrid(); renderHistory();
  });

  document.getElementById('resetBtn').addEventListener('click', ()=>{
    const db = loadData(); const keys = Object.keys(db); if(keys.length !== TOTAL) return alert('Só é possível reiniciar quando todos os bilhetes estiverem vendidos.'); if(!confirm('Reiniciar todos os dados?')) return; localStorage.removeItem(KEY); localStorage.removeItem('rifa_history_v1'); alert('Dados reiniciados'); renderGrid(); renderHistory();
  });

  function renderHistory(){
    const history = JSON.parse(localStorage.getItem('rifa_history_v1')||'[]');
    const el = document.getElementById('history'); el.innerHTML='';
    history.forEach(h=>{ const div=document.createElement('div'); const name = h.buyer && h.buyer.nome ? h.buyer.nome : 'N/A'; div.innerHTML = '<strong>#'+h.id+'</strong> — '+name+' — '+(new Date(h.at)).toLocaleString(); el.appendChild(div); });
  }

  // update when storage changes
  window.addEventListener('storage', (e)=>{ if(e.key === KEY || e.key === 'rifa_history_v1') { renderGrid(); renderHistory(); } });

  renderGrid(); renderHistory();
});
