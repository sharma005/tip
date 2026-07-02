/* ═══════════════════════════════════════════════════════════════════
   TIP — App Core
   Routing, theme management, global state, toast notifications
   ═══════════════════════════════════════════════════════════════════ */

const App = {
  currentView: 'feed',
  views: ['feed', 'admin', 'adversaries', 'huntlab', 'darkweb'],

  /* ── Admin Auth ── */
  ADMIN_USER: 'admin',
  // SHA-256 hash of the admin password — change this before any real use.
  // Generate a new one: node -e "console.log(require('crypto').createHash('sha256').update('yourpassword').digest('hex'))"
  ADMIN_HASH: '53f5c7c3aa01671b06d72f7c15526202755e02f06eb93a6a5783f05726e1d3cc',
  SESSION_TIMEOUT: 5 * 60 * 1000, // 5 minutes in ms
  _sessionTimer: null,

  isAdminAuthenticated() {
    return sessionStorage.getItem('tip-admin-auth') === 'true';
  },

  // Reset the inactivity timer on any user activity
  _resetSessionTimer() {
    if (this._sessionTimer) clearTimeout(this._sessionTimer);
    if (!this.isAdminAuthenticated()) return;
    this._sessionTimer = setTimeout(() => {
      this.adminLogout();
      this.toast('Session expired due to inactivity (5 min)', 'warning');
    }, this.SESSION_TIMEOUT);
  },

  // Start listening for user activity
  _initSessionWatchdog() {
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    const reset = () => this._resetSessionTimer();
    events.forEach(evt => document.addEventListener(evt, reset, { passive: true }));
    this._resetSessionTimer();
  },

  async hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  },

  async adminLogin() {
    const username = document.getElementById('adminUsername').value.trim();
    const password = document.getElementById('adminPassword').value;
    const errorEl = document.getElementById('adminLoginError');

    if (!username || !password) {
      errorEl.textContent = 'Please enter both username and password.';
      errorEl.style.display = 'block';
      return;
    }

    const hash = await this.hashPassword(password);

    if (username === this.ADMIN_USER && hash === this.ADMIN_HASH) {
      sessionStorage.setItem('tip-admin-auth', 'true');
      this.closeModal('adminLoginModal');
      errorEl.style.display = 'none';
      document.getElementById('adminUsername').value = '';
      document.getElementById('adminPassword').value = '';
      this.toast('Admin access granted', 'success');
      this.updateAdminNavState();
      document.body.classList.add('admin-mode');
      this._resetSessionTimer();
      // Navigate to admin
      window.location.hash = 'admin';
    } else {
      errorEl.textContent = 'Invalid username or password.';
      errorEl.style.display = 'block';
      // Shake animation
      const modal = document.querySelector('#adminLoginModal .modal');
      modal.classList.add('shake');
      setTimeout(() => modal.classList.remove('shake'), 500);
    }
  },

  adminLogout() {
    sessionStorage.removeItem('tip-admin-auth');
    if (this._sessionTimer) { clearTimeout(this._sessionTimer); this._sessionTimer = null; }
    this.toast('Logged out of Admin Panel', 'info');
    this.updateAdminNavState();
    document.body.classList.remove('admin-mode');
    window.location.hash = 'feed';
  },

  updateAdminNavState() {
    const lockIcon = document.getElementById('adminLockIcon');
    if (lockIcon) {
      lockIcon.style.display = this.isAdminAuthenticated() ? 'none' : 'inline';
    }
  },

  init() {
    DataManager.init();
    this.initTheme();
    this.initRouting();
    this.initMobileMenu();
    this.bindGlobalEvents();
    this.renderSidebar();
    this.updateAdminNavState();
    // Restore admin mode if session is active
    if (this.isAdminAuthenticated()) {
      document.body.classList.add('admin-mode');
    }
    this._initSessionWatchdog();
    this.navigate(window.location.hash.slice(1) || 'feed');
  },

  /* ── Theme ── */
  initTheme() {
    const saved = localStorage.getItem('tip-theme');
    const preferred = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    const theme = saved || preferred;
    this.setTheme(theme);

    document.querySelectorAll('.theme-toggle button').forEach(btn => {
      btn.addEventListener('click', () => this.setTheme(btn.dataset.theme));
    });
  },

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('tip-theme', theme);
    document.querySelectorAll('.theme-toggle button').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === theme);
    });
  },

  /* ── Routing ── */
  initRouting() {
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.slice(1) || 'feed';
      this.navigate(hash);
    });
  },

  navigate(view) {
    // Handle sub-routes like adversaries/detail/adv-1
    const parts = view.split('/');
    const mainView = parts[0];

    if (!this.views.includes(mainView)) {
      this.navigate('feed');
      return;
    }

    // Gate admin view behind authentication
    if (mainView === 'admin' && !this.isAdminAuthenticated()) {
      this.openModal('adminLoginModal');
      // Focus username field
      setTimeout(() => document.getElementById('adminUsername')?.focus(), 100);
      return;
    }

    this.currentView = mainView;

    // Update nav active state
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.dataset.view === mainView);
    });

    // Show/hide views
    document.querySelectorAll('.view').forEach(v => {
      v.classList.toggle('active', v.id === 'view-' + mainView);
    });

    // Trigger view-specific render
    switch (mainView) {
      case 'feed':
        FeedView.render(parts.slice(1));
        break;
      case 'admin':
        AdminView.render();
        break;
      case 'adversaries':
        AdversaryView.render(parts.slice(1));
        break;
      case 'huntlab':
        HuntLabView.render(parts.slice(1));
        break;
      case 'darkweb':
        DarkWebView.render(parts.slice(1));
        break;
    }

    // Update sidebar categories
    this.renderSidebarCategories();

    // Scroll main content to top
    const main = document.querySelector('.main-content');
    if (main) main.scrollTop = 0;

    // Close mobile sidebar
    document.getElementById('sidebar').classList.remove('open');
  },

  /* ── Mobile Menu ── */
  initMobileMenu() {
    const btn = document.getElementById('menuBtn');
    if (btn) {
      btn.addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('open');
      });
    }
  },

  /* ── Global Events ── */
  bindGlobalEvents() {
    // Nav links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const view = link.dataset.view;
        window.location.hash = view;
      });
    });

    // Close modals on overlay click
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-overlay')) {
        this.closeModal(e.target.id);
      }
    });

    // Escape key closes modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(m => {
          this.closeModal(m.id);
        });
      }
    });
  },

  /* ── Sidebar ── */
  renderSidebar() {
    this.renderSidebarCategories();
    this.updateSidebarMeta();
    this.updatePendingBadge();
  },

  renderSidebarCategories() {
    const container = document.getElementById('catFilters');
    if (!container) return;

    const counts = DataManager.getCategoryCounts();
    const total = DataManager.getPublishedItems().length;
    const activeCat = FeedView ? FeedView.activeCat : 'all';

    let html = `<div class="cat-filter ${activeCat === 'all' ? 'active' : ''}" data-cat="all">
      <span class="cat-dot" style="background:var(--text-muted)"></span>
      All advisories
      <span class="cat-count">${total}</span>
    </div>`;

    Object.entries(TIP_DATA.categories).forEach(([key, cat]) => {
      html += `<div class="cat-filter ${activeCat === key ? 'active' : ''}" data-cat="${key}">
        <span class="cat-dot" style="background:var(--cat-${cat.color})"></span>
        ${cat.label}
        <span class="cat-count">${counts[key] || 0}</span>
      </div>`;
    });

    container.innerHTML = html;

    // Bind clicks
    container.querySelectorAll('.cat-filter').forEach(el => {
      el.addEventListener('click', () => {
        if (this.currentView !== 'feed') {
          window.location.hash = 'feed';
        }
        FeedView.activeCat = el.dataset.cat;
        FeedView.render();
        this.renderSidebarCategories();
      });
    });
  },

  updateSidebarMeta() {
    const meta = DataManager.getMeta();
    // Intl's short timeZoneName renders Asia/Kolkata as "GMT+5:30", not "IST" —
    // format without it and append the literal label to match the UTC style before it.
    const dateStr = new Date(meta.lastFetch).toLocaleString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
      timeZone: 'Asia/Kolkata'
    }) + ' IST';
    const builtEl = document.getElementById('sidebarUpdated');
    if (builtEl) builtEl.textContent = dateStr;
    const totalEl = document.getElementById('sidebarTotal');
    if (totalEl) totalEl.textContent = meta.totalPublished;
  },

  updatePendingBadge() {
    const badge = document.getElementById('pendingBadge');
    if (!badge) return;
    const count = DataManager.getPendingItems().length;
    badge.textContent = count;
    badge.style.display = count > 0 ? 'inline' : 'none';
  },

  /* ── Modals ── */
  openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  },

  closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  },

  /* ── Toast Notifications ── */
  toast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${icons[type]}</span>
      <span class="toast-message">${message}</span>
      <span class="toast-close" onclick="this.parentElement.remove()">×</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'toastOut 0.3s ease forwards';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  },

  /* ── Utility ── */
  formatDate(dateStr) {
    return new Date(dateStr + 'T00:00:00Z').toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: '2-digit', timeZone: 'UTC'
    });
  },

  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  // Only allow http(s) links through to href attributes — blocks javascript:/data:/vbscript:
  // URIs from source fields that may originate from AI-curated/web-sourced content.
  safeUrl(url) {
    if (typeof url !== 'string' || !/^https?:\/\//i.test(url.trim())) return '#';
    return url.trim();
  },

  timeAgo(dateStr) {
    const now = new Date();
    const then = new Date(dateStr);
    const diff = Math.floor((now - then) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
    if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
    if (diff < 604800) return Math.floor(diff / 86400) + 'd ago';
    return App.formatDate(dateStr.split('T')[0]);
  }
};

// Boot
document.addEventListener('DOMContentLoaded', () => App.init());
