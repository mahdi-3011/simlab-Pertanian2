/**
 * script.js - Shared app logic: sidebar, topbar, notifications
 */

function initApp(activeNav, pageTitle, requiredRole=null) {
  const user = Utils.requireAuth(requiredRole);
  if (!user) return null;
  renderSidebar(user, activeNav);
  renderTopbar(user, pageTitle);
  return user;
}

/* ===== SIDEBAR ===== */
function renderSidebar(user, activeNav) {
  const isAdmin = user.role === 'admin';
  const unread = Storage.getNotifikasi(user.id).filter(n => !n.dibaca).length;
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;

  const adminNav = `
    <div class="nav-section">Manajemen</div>
    <div class="nav-item ${activeNav==='barang'?'active':''}" onclick="nav('barang.html')"><span class="nav-icon">📦</span> Data Barang</div>
    <div class="nav-item ${activeNav==='penyimpanan'?'active':''}" onclick="nav('penyimpanan.html')"><span class="nav-icon">🗄️</span> Penyimpanan</div>
    <div class="nav-section">Administrasi</div>
    <div class="nav-item ${activeNav==='users'?'active':''}" onclick="nav('users.html')"><span class="nav-icon">👥</span> Data User</div>
    <div class="nav-item ${activeNav==='laporan'?'active':''}" onclick="nav('laporan.html')"><span class="nav-icon">📊</span> Laporan</div>
    <div class="nav-item ${activeNav==='riwayat'?'active':''}" onclick="nav('riwayat.html')"><span class="nav-icon">📋</span> Riwayat Log</div>`;

  const tamuNav = `
    <div class="nav-section">Menu Saya</div>
    <div class="nav-item ${activeNav==='titip'?'active':''}" onclick="nav('titip.html')"><span class="nav-icon">📤</span> Titip Barang</div>`;

  sidebar.innerHTML = `
    <div class="sidebar-logo">
      <img src="favicon.png" alt="Logo SimLAB" class="logo-img">
      <div class="logo-text">
        <div class="brand">SimLAB</div>
        <div class="sub">Lab Pertanian</div>
      </div>
    </div>
    <div class="sidebar-user">
      <div class="user-avatar">${user.foto?`<img src="${user.foto}">`:(user.nama||'?').charAt(0).toUpperCase()}</div>
      <div class="user-info">
        <div class="user-name">${Utils.truncate(user.nama,20)}</div>
        <div class="user-role">${user.role}</div>
      </div>
    </div>
    <nav class="sidebar-nav">
      <div class="nav-item ${activeNav==='dashboard'?'active':''}" onclick="nav('${isAdmin?'admin':'tamu'}-dashboard.html')"><span class="nav-icon">🏠</span> Dashboard</div>
      ${isAdmin ? adminNav : tamuNav}
      <div class="nav-section">Akun</div>
      <div class="nav-item ${activeNav==='profil'?'active':''}" onclick="nav('profil.html')"><span class="nav-icon">👤</span> Profil Saya</div>
      <div class="nav-item ${activeNav==='notifikasi'?'active':''}" onclick="nav('notifikasi.html')">
        <span class="nav-icon">🔔</span> Notifikasi
        ${unread>0?`<span class="nav-badge">${unread}</span>`:''}
      </div>
    </nav>
    <div class="sidebar-footer">
      <button class="btn-logout" onclick="Utils.logout()">🚪 Keluar</button>
    </div>`;
}

function nav(href) { window.location.href = href; }

/* ===== TOPBAR ===== */
function renderTopbar(user, pageTitle) {
  const topbar = document.getElementById('topbar');
  if (!topbar) return;
  const unread = Storage.getNotifikasi(user.id).filter(n => !n.dibaca).length;
  topbar.innerHTML = `
    <div class="topbar-left">
      <button class="hamburger" onclick="toggleSidebar()">☰</button>
      <span class="page-title">${pageTitle}</span>
    </div>
    <div class="topbar-right" style="position:relative">
      <button class="topbar-btn" onclick="toggleNotifDropdown()" title="Notifikasi">
        🔔 ${unread>0?`<span class="notif-badge">${unread}</span>`:''}
      </button>
      <div id="notif-dropdown" class="notif-dropdown"></div>
      <button class="topbar-btn" onclick="nav('profil.html')" title="Profil">
        ${user.foto?`<img src="${user.foto}" style="width:28px;height:28px;border-radius:50%;object-fit:cover">`:(user.nama||'?').charAt(0).toUpperCase()}
      </button>
    </div>`;
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebar-overlay').classList.toggle('active');
}

function toggleNotifDropdown() {
  const user = Storage.getSession();
  const dd = document.getElementById('notif-dropdown');
  dd.classList.toggle('active');
  if (dd.classList.contains('active')) {
    const notifs = Storage.getNotifikasi(user.id).slice(0, 10);
    let html = `<div class="notif-header"><b>Notifikasi</b><button class="btn btn-sm btn-ghost" onclick="clearAllNotif()">Bersihkan</button></div><div class="notif-list">`;
    if (!notifs.length) html += `<div style="padding:20px;text-align:center;color:var(--text-muted);font-size:13px">Tidak ada notifikasi</div>`;
    notifs.forEach(n => {
      html += `<div class="notif-item ${n.dibaca?'':'unread'}" onclick="readNotif('${n.id}')">
        <div class="notif-dot" style="${n.dibaca?'opacity:.3':''}"></div>
        <div><div class="notif-text">${n.pesan}</div><div class="notif-time">${Utils.formatDateTime(n.waktu)}</div></div>
      </div>`;
    });
    html += `</div><div class="notif-footer"><a onclick="nav('notifikasi.html')" style="cursor:pointer;color:var(--accent)">Lihat Semua</a></div>`;
    dd.innerHTML = html;
  }
}
function readNotif(id) { Storage.updateNotifikasi(id,{dibaca:true}); toggleNotifDropdown(); toggleNotifDropdown(); }
function clearAllNotif() {
  const user = Storage.getSession();
  Storage.clearNotifikasi(user.id);
  document.getElementById('notif-dropdown').classList.remove('active');
  Toast.success('Notifikasi dibersihkan');
}
document.addEventListener('click', e => {
  const dd = document.getElementById('notif-dropdown');
  if (dd && dd.classList.contains('active')) {
    const btn = e.target.closest('[onclick*="toggleNotifDropdown"]');
    if (!btn && !dd.contains(e.target)) dd.classList.remove('active');
  }
  if (e.target.id === 'sidebar-overlay') toggleSidebar();
});
