/**
 * utils.js - Utility helpers
 */
const Utils = {
  formatDate(iso){if(!iso)return'-';return new Date(iso).toLocaleDateString('id-ID',{day:'2-digit',month:'short',year:'numeric'});},
  formatDateTime(iso){if(!iso)return'-';return new Date(iso).toLocaleString('id-ID');},
  encodePass(p){return btoa(p);},
  decodePass(p){try{return atob(p);}catch{return p;}},
  isEmail(v){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);},
  isPhone(v){return /^[0-9+\-\s]{8,15}$/.test(v);},
  sanitize(str){const d=document.createElement('div');d.textContent=str;return d.innerHTML;},
  debounce(fn,ms=300){let t;return(...args)=>{clearTimeout(t);t=setTimeout(()=>fn(...args),ms);};},
  truncate(str,n=40){return str&&str.length>n?str.slice(0,n)+'…':str;},
  statusBadge(status){
    const map={'Disimpan':'badge-success','Pending':'badge-warning','Diambil':'badge-info','Terlambat':'badge-danger','Aktif':'badge-success','Nonaktif':'badge-danger','admin':'badge-primary','tamu':'badge-secondary'};
    return `<span class="badge ${map[status]||'badge-secondary'}">${status}</span>`;
  },
  kondisiBadge(k){
    const map={'Baik':'badge-success','Rusak Ringan':'badge-warning','Rusak Berat':'badge-danger','Perlu Servis':'badge-warning'};
    return `<span class="badge ${map[k]||'badge-secondary'}">${k||'-'}</span>`;
  },
  paginate(arr,page,perPage=10){const start=(page-1)*perPage;return{data:arr.slice(start,start+perPage),total:arr.length,totalPages:Math.ceil(arr.length/perPage),page,perPage};},
  sortArr(arr,key,dir='asc'){return[...arr].sort((a,b)=>{const va=a[key]||'',vb=b[key]||'';if(va<vb)return dir==='asc'?-1:1;if(va>vb)return dir==='asc'?1:-1;return 0;});},
  fileToBase64(file){return new Promise((res,rej)=>{const r=new FileReader();r.onload=e=>res(e.target.result);r.onerror=rej;r.readAsDataURL(file);});},
  exportCSV(data,filename='export.csv'){if(!data.length)return;const headers=Object.keys(data[0]);const rows=data.map(r=>headers.map(h=>`"${(r[h]||'').toString().replace(/"/g,'""')}"`).join(','));const csv=[headers.join(','),...rows].join('\n');const blob=new Blob([csv],{type:'text/csv'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=filename;a.click();},
  printSection(html,title='AutoLab Report'){const w=window.open('','_blank');w.document.write(`<!DOCTYPE html><html><head><title>${title}</title><style>body{font-family:sans-serif;padding:20px;color:#15281f}table{width:100%;border-collapse:collapse}th,td{border:1px solid #e0ebe6;padding:8px;text-align:left}th{background:#4a628b;color:#fff}@media print{}</style></head><body><h2 style="color:#4a628b">${title}</h2>${html}</body></html>`);w.document.close();w.print();},
  generateQR(text,size=128){return`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`;},
  getCurrentUser(){return Storage.getSession();},
  requireAuth(role=null){const user=Storage.getSession();if(!user){window.location.href='login.html';return null;}if(role&&user.role!==role){window.location.href=user.role==='admin'?'admin-dashboard.html':'tamu-dashboard.html';return null;}return user;},
  logout(){const user=Storage.getSession();if(user)Storage.addRiwayat(`Logout: ${user.nama}`,user.nama);Storage.clearSession();window.location.href='login.html';},
};
