/* ============================================================
   CCS ORGHUB — SHARED UTILITIES
   ============================================================ */

/* ---------- INIT SUPABASE ---------- */
function initSupabase() {
  if (window.SUPABASE_URL && window.SUPABASE_ANON_KEY && typeof supabase !== 'undefined') {
    try {
      window.supabaseClient = supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
      console.log('✅ Supabase initialized.');
    } catch (e) {
      console.warn('❌ Supabase init failed:', e);
    }
  } else {
    console.log('⚠️ Supabase config missing.');
  }
}

/* ---------- AUTH GUARD ---------- */
async function guardAuth() {
  if (!window.supabaseClient) return true;
  try {
    const { data: { session } } = await window.supabaseClient.auth.getSession();
    if (!session) {
      window.location.replace('index.html');
      return false;
    }
    return true;
  } catch (e) {
    window.location.replace('index.html');
    return false;
  }
}

/* ---------- BUILD SIDEBAR ---------- */
function buildSidebar(activePage, role = 'admin') {
  const adminLinks = {
    Main: [
      { key: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard', href: 'dashboard.html' },
      { key: 'students', label: 'Students', icon: 'users', href: 'students.html' },
      { key: 'organizations', label: 'Organizations', icon: 'building-2', href: 'organizations.html' },
    ],
    Operations: [
      { key: 'events', label: 'Events', icon: 'calendar-days', href: 'events.html' },
      { key: 'attendance', label: 'Attendance', icon: 'clipboard-check', href: 'attendance.html' },
      { key: 'membership', label: 'Membership', icon: 'user-check', href: 'membership.html' },
      { key: 'announcements', label: 'Announcements', icon: 'megaphone', href: 'announcements.html' },
    ],
    Finance: [
      { key: 'fees', label: 'Fees', icon: 'receipt', href: 'fees.html' },
      { key: 'fines', label: 'Fines', icon: 'alert-circle', href: 'fines.html' },
      { key: 'payments', label: 'Payments', icon: 'credit-card', href: 'payments.html' },
    ],
    Clearance: [
      { key: 'clearance', label: 'Approvals', icon: 'shield-check', href: 'clearance.html', badge: '3' },
      { key: 'clearance-tracking', label: 'Tracking', icon: 'list-checks', href: 'clearance-tracking.html' },
    ],
    Reports: [
      { key: 'reports', label: 'All Reports', icon: 'bar-chart-3', href: 'reports.html' },
    ],
  };

  const studentLinks = {
    Main: [
      { key: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard', href: 'student-dashboard.html' },
      { key: 'profile', label: 'My Profile', icon: 'user', href: 'student-profile.html' },
    ],
    Organizations: [
      { key: 'organizations', label: 'Browse Organizations', icon: 'building-2', href: 'student-organizations.html' },
      { key: 'memberships', label: 'My Memberships', icon: 'user-check', href: 'student-memberships.html' },
    ],
    Activities: [
      { key: 'attendance', label: 'My Attendance', icon: 'calendar-check-2', href: 'student-attendance.html' },
      { key: 'announcements', label: 'Announcements', icon: 'megaphone', href: 'student-announcements.html' },
      { key: 'events', label: 'Events', icon: 'calendar-days', href: 'student-events.html' },
    ],
    Finance: [
      { key: 'fees', label: 'My Fees', icon: 'receipt', href: 'student-fees.html' },
      { key: 'fines', label: 'My Fines', icon: 'alert-circle', href: 'student-fines.html' },
      { key: 'payments', label: 'Payment History', icon: 'credit-card', href: 'student-payments.html' },
    ],
    Clearance: [
      { key: 'clearance', label: 'Clearance Status', icon: 'shield-check', href: 'student-clearance.html' },
      { key: 'clearance-request', label: 'Request Clearance', icon: 'file-plus', href: 'student-clearance-request.html' },
    ],
  };

  const links = role === 'student' ? studentLinks : adminLinks;
  const portalLabel = role === 'student' ? 'Student Portal' : 'Admin Portal';
  const logoIcon = role === 'student' ? 'graduation-cap' : 'layers';

  let navHTML = '';
  for (const [section, items] of Object.entries(links)) {
    navHTML += `<div><div class="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-purple-300/60">${section}</div><div class="space-y-1">`;
    items.forEach(item => {
      const isActive = item.key === activePage;
      const activeClass = isActive ? 'nav-item-active' : 'text-purple-200/80 hover:bg-purple-500/15 hover:text-white';
      const iconColor = isActive ? '' : 'text-purple-400';
      const badge = item.badge ? `<span class="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full">${item.badge}</span>` : '';
      const justify = badge ? 'justify-between' : '';

      navHTML += `
        <a href="${item.href}" class="nav-item w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl transition-all text-sm font-medium group ${activeClass} ${justify}">
          <div class="flex items-center space-x-3">
            <i data-lucide="${item.icon}" class="w-4 h-4 ${iconColor} group-hover:scale-110 transition-transform"></i>
            <span>${item.label}</span>
          </div>
          ${badge}
        </a>`;
    });
    navHTML += `</div></div>`;
  }

  return `
    <aside id="main-sidebar" class="glass-sidebar w-64 fixed top-0 bottom-0 left-0 z-50 flex flex-col transition-transform duration-300 -translate-x-full lg:translate-x-0">
      <div class="p-5 border-b border-purple-500/20 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="p-2.5 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-800 text-white shadow-lg shadow-purple-600/30 border border-purple-400/40">
            <i data-lucide="${logoIcon}" class="w-6 h-6"></i>
          </div>
          <div>
            <h2 class="font-extrabold text-base tracking-wide text-white flex items-center gap-1.5">
              CCS OrgHub
              <span class="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            </h2>
            <p class="text-[11px] font-semibold text-purple-300/80 uppercase tracking-widest mt-0.5">${portalLabel}</p>
          </div>
        </div>
        <button onclick="toggleMobileSidebar()" class="lg:hidden text-purple-300 hover:text-white p-1">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <nav class="flex-1 overflow-y-auto px-3 py-4 space-y-6" id="sidebar-nav-container">
        ${navHTML}
      </nav>

      <div class="p-3 border-t border-purple-500/20">
        <button onclick="logout()" class="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-red-300 hover:bg-red-500/20 hover:text-red-100 transition-all text-sm font-medium">
          <i data-lucide="log-out" class="w-4 h-4 text-red-400"></i><span>Logout</span>
        </button>
      </div>
    </aside>`;
}

/* ---------- BUILD TOPBAR ---------- */
function buildTopbar(title, subtitle) {
  return `
    <header class="glass-topbar sticky top-0 z-30 px-4 md:px-8 py-3.5 flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <button onclick="toggleMobileSidebar()" class="p-2 rounded-xl bg-purple-900/50 text-purple-200 border border-purple-500/30 lg:hidden">
          <i data-lucide="menu" class="w-5 h-5"></i>
        </button>
        <div>
          <h1 class="text-xl font-bold text-white tracking-tight">${title}</h1>
          <p class="text-xs text-purple-300/70 hidden sm:block">${subtitle}</p>
        </div>
      </div>
      <div class="flex items-center space-x-3">
        <button onclick="openNotificationsModal && openNotificationsModal()" class="relative p-2.5 rounded-xl bg-purple-900/40 border border-purple-500/30 text-purple-200 hover:text-white hover:bg-purple-800/50 transition-all">
          <i data-lucide="bell" class="w-4 h-4 text-purple-300"></i>
          <span class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
          <span class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400"></span>
        </button>
        <div class="flex items-center space-x-2.5 pl-2 border-l border-purple-500/20">
          <div id="userAvatar" class="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-purple-400 border border-purple-300/40 flex items-center justify-center font-bold text-sm text-white">A</div>
          <div class="hidden sm:block text-left">
            <div id="userName" class="text-xs font-bold text-white leading-tight">Admin User</div>
            <div class="text-[10px] text-purple-300/80 font-medium">CCS Faculty Admin</div>
          </div>
        </div>
      </div>
    </header>`;
}

/* ---------- BUILD BACKGROUND ---------- */
function buildBackground() {
  return `
    <div class="orb w-96 h-96 bg-purple-700/25 top-0 left-10 animate-pulse"></div>
    <div class="orb w-[30rem] h-[30rem] bg-purple-900/40 bottom-0 right-10"></div>
    <div class="orb w-80 h-80 bg-fuchsia-600/15 top-1/2 left-1/3"></div>
    <div id="sidebar-overlay" onclick="toggleMobileSidebar()" class="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden hidden transition-opacity"></div>`;
}

/* ---------- MOBILE SIDEBAR ---------- */
function toggleMobileSidebar() {
  const overlay = document.getElementById('sidebar-overlay');
  const sidebar = document.getElementById('main-sidebar');
  if (overlay) overlay.classList.toggle('hidden');
  if (sidebar) sidebar.classList.toggle('-translate-x-full');
}

/* ---------- LOGOUT ---------- */
function logout() {
  const modal = document.getElementById('modal-logout');
  if (modal) modal.classList.remove('opacity-0', 'pointer-events-none');
}

async function confirmLogout() {
  const modal = document.getElementById('modal-logout');
  if (modal) modal.classList.add('opacity-0', 'pointer-events-none');

  showToast('Signing Out...', 'Please wait...');

  try {
    if (window.supabaseClient) await window.supabaseClient.auth.signOut();
  } catch (err) { console.error(err); }

  try {
    sessionStorage.clear();
    localStorage.removeItem('supabase.auth.token');
    document.cookie.split(';').forEach(c => {
      const n = c.split('=')[0].trim();
      if (n.includes('sb-') || n.includes('supabase')) {
        document.cookie = `${n}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      }
    });
  } catch (e) {}

  setTimeout(() => window.location.replace('index.html'), 700);
}

/* ---------- TOAST ---------- */
function showToast(title, message) {
  const c = document.getElementById('toast-container');
  if (!c) return;
  const t = document.createElement('div');
  t.className = 'pointer-events-auto flex items-center space-x-3 p-4 rounded-2xl glass-card shadow-2xl border border-purple-400/50 text-white transform translate-y-4 opacity-0 transition-all duration-300 min-w-[280px]';
  t.innerHTML = `
    <div class="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-400/30">
      <i data-lucide="check-circle-2" class="w-5 h-5"></i>
    </div>
    <div>
      <h4 class="font-bold text-xs text-white">${title}</h4>
      <p class="text-[11px] text-purple-200/80 mt-0.5">${message}</p>
    </div>`;
  c.appendChild(t);
  if (window.lucide) lucide.createIcons();
  setTimeout(() => t.classList.remove('translate-y-4', 'opacity-0'), 10);
  setTimeout(() => {
    t.classList.add('translate-y-4', 'opacity-0');
    setTimeout(() => t.remove(), 300);
  }, 3500);
}

/* ---------- LOGOUT MODAL ---------- */
function buildLogoutModal() {
  return `
    <div id="modal-logout" class="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 opacity-0 pointer-events-none transition-opacity duration-300">
      <div class="glass-card w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-red-400/40 space-y-5 relative text-center">
        <div class="w-14 h-14 mx-auto rounded-full bg-red-500/20 border border-red-400/40 flex items-center justify-center text-red-300">
          <i data-lucide="log-out" class="w-7 h-7"></i>
        </div>
        <div>
          <h3 class="text-lg font-bold text-white">Sign Out?</h3>
          <p class="text-xs text-purple-300/70 mt-1">You'll be returned to the login page.</p>
        </div>
        <div class="flex justify-center gap-3 pt-2">
          <button onclick="document.getElementById('modal-logout').classList.add('opacity-0','pointer-events-none')" class="px-5 py-2.5 rounded-xl bg-purple-950/80 text-purple-200 border border-purple-500/40 text-xs font-bold">Cancel</button>
          <button onclick="confirmLogout()" class="px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-400 text-white text-xs font-bold shadow-lg shadow-red-500/30">Yes, Log Out</button>
        </div>
      </div>
    </div>`;
}

/* ---------- LOAD USER PROFILE ---------- */
async function loadUserProfile() {
  let profile = { first_name: 'Admin', role: 'Faculty Admin' };
  if (window.supabaseClient) {
    try {
      const { data: { user } } = await window.supabaseClient.auth.getUser();
      if (user) {
        const { data } = await window.supabaseClient.from('profiles').select('*').eq('id', user.id).single();
        if (data) profile = data;
      }
    } catch (e) {}
  }
  const name = profile.first_name || 'Admin';
  const nameEl = document.getElementById('userName');
  const avEl = document.getElementById('userAvatar');
  if (nameEl) nameEl.textContent = `${name} User`;
  if (avEl) avEl.textContent = (name[0] || 'A').toUpperCase();
  return profile;
}