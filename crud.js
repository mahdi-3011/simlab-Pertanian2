/**
 * crud.js - Reusable UI: Toast, Modal, Confirm, Pagination, AutoSave, Validator, Undo
 */

/* ===== TOAST ===== */
const Toast = {
  show(msg,type='success',duration=3000){
    let c=document.getElementById('toast-container');
    if(!c){c=document.createElement('div');c.id='toast-container';document.body.appendChild(c);}
    const icons={success:'✅',error:'❌',warning:'⚠️',info:'ℹ️'};
    const t=document.createElement('div');
    t.className=`toast toast-${type}`;
    t.innerHTML=`<span class="toast-icon">${icons[type]||'ℹ️'}</span><span class="toast-msg">${msg}</span><button class="toast-close" onclick="this.parentElement.remove()">×</button>`;
    c.appendChild(t);
    setTimeout(()=>t.classList.add('show'),10);
    setTimeout(()=>{t.classList.remove('show');setTimeout(()=>t.remove(),400);},duration);
  },
  success(m){this.show(m,'success');},
  error(m){this.show(m,'error');},
  warning(m){this.show(m,'warning');},
  info(m){this.show(m,'info');},
};

/* ===== CONFIRM ===== */
function showConfirm({title='Konfirmasi',message='Yakin?',confirmText='Ya, Hapus',cancelText='Batal',type='danger',onConfirm}){
  let o=document.getElementById('confirm-overlay');if(o)o.remove();
  o=document.createElement('div');o.id='confirm-overlay';o.className='modal-overlay active';
  const icons={danger:'🗑️',warning:'⚠️',info:'ℹ️',success:'✅'};
  o.innerHTML=`<div class="confirm-box"><div class="confirm-icon">${icons[type]||'⚠️'}</div><h3 class="confirm-title">${title}</h3><p class="confirm-msg">${message}</p><div class="confirm-actions"><button class="btn btn-ghost" id="confirm-cancel">${cancelText}</button><button class="btn btn-${type}" id="confirm-ok">${confirmText}</button></div></div>`;
  document.body.appendChild(o);
  document.getElementById('confirm-cancel').onclick=()=>o.remove();
  document.getElementById('confirm-ok').onclick=()=>{o.remove();if(onConfirm)onConfirm();};
  o.onclick=e=>{if(e.target===o)o.remove();};
}

/* ===== MODAL ===== */
const Modal={
  open(id){const m=document.getElementById(id);if(m){m.classList.add('active');document.body.style.overflow='hidden';}},
  close(id){const m=document.getElementById(id);if(m){m.classList.remove('active');document.body.style.overflow='';}},
  closeAll(){document.querySelectorAll('.modal-overlay.active').forEach(m=>m.classList.remove('active'));document.body.style.overflow='';},
};
document.addEventListener('click',e=>{
  if(e.target.classList.contains('modal-overlay'))Modal.closeAll();
  if(e.target.classList.contains('modal-close')){const m=e.target.closest('.modal-overlay');if(m){m.classList.remove('active');document.body.style.overflow='';}}
});

/* ===== PAGINATION ===== */
function renderPagination(containerId,total,totalPages,currentPage,onPage){
  const c=document.getElementById(containerId);if(!c)return;
  if(totalPages<=1){c.innerHTML='';return;}
  let html=`<div class="pagination">`;
  html+=`<button class="page-btn" ${currentPage===1?'disabled':''} onclick="(${onPage})(${currentPage-1})">‹</button>`;
  for(let i=1;i<=totalPages;i++){
    if(i===1||i===totalPages||Math.abs(i-currentPage)<=2)html+=`<button class="page-btn ${i===currentPage?'active':''}" onclick="(${onPage})(${i})">${i}</button>`;
    else if(Math.abs(i-currentPage)===3)html+=`<span class="page-dots">…</span>`;
  }
  html+=`<button class="page-btn" ${currentPage===totalPages?'disabled':''} onclick="(${onPage})(${currentPage+1})">›</button>`;
  html+=`<span class="page-info">${total} data</span></div>`;
  c.innerHTML=html;
}

/* ===== AUTO SAVE ===== */
const AutoSave={
  save(formId){const form=document.getElementById(formId);if(!form)return;const data={};form.querySelectorAll('input,select,textarea').forEach(el=>{if(el.name&&el.type!=='password'&&el.type!=='file')data[el.name]=el.value;});localStorage.setItem('autosave_'+formId,JSON.stringify(data));},
  restore(formId){const saved=localStorage.getItem('autosave_'+formId);if(!saved)return;const data=JSON.parse(saved);const form=document.getElementById(formId);if(!form)return;Object.entries(data).forEach(([k,v])=>{const el=form.querySelector(`[name="${k}"]`);if(el)el.value=v;});},
  clear(formId){localStorage.removeItem('autosave_'+formId);},
};

/* ===== VALIDATOR ===== */
const Validator={
  validate(formId,rules){
    const form=document.getElementById(formId);let valid=true;
    form.querySelectorAll('.field-error').forEach(e=>e.remove());
    form.querySelectorAll('.input-error').forEach(e=>e.classList.remove('input-error'));
    Object.entries(rules).forEach(([name,rule])=>{
      const el=form.querySelector(`[name="${name}"]`);if(!el)return;
      let err='';const v=el.value.trim();
      if(rule.required&&!v)err=(rule.label||name)+' wajib diisi.';
      else if(rule.email&&v&&!Utils.isEmail(v))err='Format email tidak valid.';
      else if(rule.phone&&v&&!Utils.isPhone(v))err='Format nomor HP tidak valid.';
      else if(rule.min&&v.length<rule.min)err=`Minimal ${rule.min} karakter.`;
      else if(rule.match){const other=form.querySelector(`[name="${rule.match}"]`);if(other&&v!==other.value)err='Password tidak cocok.';}
      if(err){valid=false;el.classList.add('input-error');const span=document.createElement('span');span.className='field-error';span.textContent=err;el.parentNode.appendChild(span);}
    });
    return valid;
  },
};

/* ===== UNDO ===== */
const UndoStack={
  push(label,restoreFn){
    let bar=document.getElementById('undo-bar');if(bar)bar.remove();
    bar=document.createElement('div');bar.id='undo-bar';
    bar.innerHTML=`<span>${label}</span><button id="undo-btn">Undo</button><button id="undo-dismiss">×</button>`;
    document.body.appendChild(bar);
    const tid=setTimeout(()=>bar.remove(),6000);
    document.getElementById('undo-btn').onclick=()=>{clearTimeout(tid);bar.remove();restoreFn();};
    document.getElementById('undo-dismiss').onclick=()=>{clearTimeout(tid);bar.remove();};
    setTimeout(()=>bar.classList.add('show'),10);
  },
};
