/**
 * storage.js - LocalStorage abstraction layer
 */
const KEYS = {
  USERS:'autolab_users', BARANG:'autolab_barang', PENYIMPANAN:'autolab_penyimpanan',
  TITIPAN:'autolab_titipan', RIWAYAT:'autolab_riwayat', NOTIFIKASI:'autolab_notifikasi',
  LAPORAN:'autolab_laporan', SESSION:'autolab_session', SETTINGS:'autolab_settings',
};
const Storage = {
  get(k){try{return JSON.parse(localStorage.getItem(k))||[];}catch{return[];}},
  getOne(k){try{return JSON.parse(localStorage.getItem(k));}catch{return null;}},
  set(k,d){localStorage.setItem(k,JSON.stringify(d));},
  remove(k){localStorage.removeItem(k);},
  getUsers(){return this.get(KEYS.USERS);},
  saveUsers(d){this.set(KEYS.USERS,d);},
  getUserById(id){return this.getUsers().find(u=>u.id===id);},
  getUserByUsername(u){return this.getUsers().find(x=>x.username===u);},
  addUser(u){const list=this.getUsers();u.id='USR-'+Date.now();u.createdAt=new Date().toISOString();u.active=true;list.push(u);this.saveUsers(list);return u;},
  updateUser(id,d){const list=this.getUsers();const i=list.findIndex(u=>u.id===id);if(i>-1){list[i]={...list[i],...d};this.saveUsers(list);return list[i];}return null;},
  deleteUser(id){this.saveUsers(this.getUsers().filter(u=>u.id!==id));},
  getBarang(){return this.get(KEYS.BARANG);},
  saveBarang(d){this.set(KEYS.BARANG,d);},
  getBarangById(id){return this.getBarang().find(b=>b.id===id);},
  addBarang(b){const list=this.getBarang();b.id='BRG-'+Date.now();b.kodeBarang=b.kodeBarang||'KD-'+Math.random().toString(36).substr(2,6).toUpperCase();b.tanggalInput=new Date().toISOString();list.push(b);this.saveBarang(list);return b;},
  updateBarang(id,d){const list=this.getBarang();const i=list.findIndex(b=>b.id===id);if(i>-1){list[i]={...list[i],...d};this.saveBarang(list);return list[i];}return null;},
  deleteBarang(id){this.saveBarang(this.getBarang().filter(b=>b.id!==id));},
  getPenyimpanan(){return this.get(KEYS.PENYIMPANAN);},
  savePenyimpanan(d){this.set(KEYS.PENYIMPANAN,d);},
  addPenyimpanan(item){const list=this.getPenyimpanan();item.id='PSP-'+Date.now();item.status=item.status||'Pending';item.tanggalMasuk=item.tanggalMasuk||new Date().toISOString();list.push(item);this.savePenyimpanan(list);return item;},
  updatePenyimpanan(id,d){const list=this.getPenyimpanan();const i=list.findIndex(p=>p.id===id);if(i>-1){list[i]={...list[i],...d};this.savePenyimpanan(list);return list[i];}return null;},
  deletePenyimpanan(id){this.savePenyimpanan(this.getPenyimpanan().filter(p=>p.id!==id));},
  getTitipan(){return this.get(KEYS.TITIPAN);},
  saveTitipan(d){this.set(KEYS.TITIPAN,d);},
  getTitipanByUser(uid){return this.getTitipan().filter(t=>t.userId===uid);},
  addTitipan(item){const list=this.getTitipan();item.id='TTF-'+Date.now();item.status='Pending';item.tanggalTitip=new Date().toISOString();list.push(item);this.saveTitipan(list);return item;},
  updateTitipan(id,d){const list=this.getTitipan();const i=list.findIndex(t=>t.id===id);if(i>-1){list[i]={...list[i],...d};this.saveTitipan(list);return list[i];}return null;},
  deleteTitipan(id){this.saveTitipan(this.getTitipan().filter(t=>t.id!==id));},
  getRiwayat(){return this.get(KEYS.RIWAYAT);},
  addRiwayat(aktivitas,user){const list=this.getRiwayat();const now=new Date();list.unshift({id:'LOG-'+Date.now(),aktivitas,user:user||'System',tanggal:now.toLocaleDateString('id-ID'),waktu:now.toLocaleTimeString('id-ID'),timestamp:now.toISOString()});if(list.length>500)list.splice(500);this.set(KEYS.RIWAYAT,list);},
  deleteRiwayat(id){this.set(KEYS.RIWAYAT,this.getRiwayat().filter(r=>r.id!==id));},
  clearRiwayat(){this.set(KEYS.RIWAYAT,[]);},
  getNotifikasi(uid){const all=this.get(KEYS.NOTIFIKASI);return uid?all.filter(n=>n.userId===uid||n.userId==='all'):all;},
  addNotifikasi(msg,uid,type='info'){const list=this.get(KEYS.NOTIFIKASI);list.unshift({id:'NTF-'+Date.now(),pesan:msg,userId:uid,type,dibaca:false,waktu:new Date().toISOString()});this.set(KEYS.NOTIFIKASI,list);},
  updateNotifikasi(id,d){const list=this.get(KEYS.NOTIFIKASI);const i=list.findIndex(n=>n.id===id);if(i>-1){list[i]={...list[i],...d};this.set(KEYS.NOTIFIKASI,list);}},
  deleteNotifikasi(id){this.set(KEYS.NOTIFIKASI,this.get(KEYS.NOTIFIKASI).filter(n=>n.id!==id));},
  clearNotifikasi(uid){this.set(KEYS.NOTIFIKASI,this.get(KEYS.NOTIFIKASI).filter(n=>n.userId!==uid));},
  getLaporan(){return this.get(KEYS.LAPORAN);},
  addLaporan(l){const list=this.getLaporan();l.id='LPR-'+Date.now();l.createdAt=new Date().toISOString();list.unshift(l);this.set(KEYS.LAPORAN,list);return l;},
  updateLaporan(id,d){const list=this.getLaporan();const i=list.findIndex(l=>l.id===id);if(i>-1){list[i]={...list[i],...d};this.set(KEYS.LAPORAN,list);return list[i];}return null;},
  deleteLaporan(id){this.set(KEYS.LAPORAN,this.getLaporan().filter(l=>l.id!==id));},
  getSession(){return this.getOne(KEYS.SESSION);},
  setSession(u){this.set(KEYS.SESSION,u);},
  clearSession(){this.remove(KEYS.SESSION);},
  getSettings(){return this.getOne(KEYS.SETTINGS)||{};},
  saveSettings(d){this.set(KEYS.SETTINGS,d);},
};
function seedDefaults(){
  if(Storage.getUsers().length===0){
    Storage.addUser({nama:'Administrator',username:'admin',password:btoa('admin123'),role:'admin',nomorHP:'081234567890',email:'admin@autolab.id',foto:'',active:true});
    Storage.addUser({nama:'Tamu Demo',username:'tamu',password:btoa('tamu123'),role:'tamu',nomorHP:'089876543210',email:'tamu@autolab.id',foto:'',active:true});
  }
}
seedDefaults();
