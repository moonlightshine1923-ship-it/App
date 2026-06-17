// ===== Contrôleur principal =====
(() => {
  const { $, $$, esc } = UI;
  let CURRENT = null; // { user }

  const ROLE_LABEL = { admin: 'Administrateur', president: 'Président', saisie: 'Agent de saisie' };

  // Menu complet (admin & président : mêmes fonctionnalités)
  const MENU_FULL = [
    { id: 'dashboard', label: 'Tableau de bord', icon: '📊', title: 'Tableau de bord', render: () => Views.dashboard() },
    { id: 'adherents', label: 'Adhérents', icon: '👥', title: 'Gestion des adhérents', render: () => Views.adherentsList() },
    { id: 'demandes', label: 'Demandes', icon: '📨', title: 'Demandes (site web)', render: () => Views.demandesList() },
    { id: 'documents', label: 'Documents', icon: '📁', title: 'Gestion documentaire', render: () => Views.documentsList() },
    { id: 'comptes', label: 'Comptes', icon: '🔑', title: 'Comptes utilisateurs', render: () => Views.comptesList() },
    { id: 'parametres', label: 'Paramètres', icon: '⚙️', title: 'Paramètres', render: () => Views.parametres() },
  ];

  // Menu restreint pour l'agent de saisie : uniquement ajouter un adhérent
  const MENU_SAISIE = [
    { id: 'ajout', label: 'Ajouter un adhérent', icon: '➕', title: 'Ajouter un adhérent', render: () => Views.saisieAjout() },
    { id: 'parametres', label: 'Paramètres', icon: '⚙️', title: 'Paramètres', render: () => Views.parametres() },
  ];

  let MENU = MENU_FULL;

  function buildNav() {
    const nav = $('#navMenu');
    nav.innerHTML = MENU.map((m) => `
      <div class="nav-item" data-id="${m.id}">
        <span class="nav-ico">${m.icon}</span><span>${esc(m.label)}</span>
      </div>`).join('');
    nav.querySelectorAll('.nav-item').forEach((el) => el.onclick = () => navigate(el.dataset.id));
  }

  async function navigate(id) {
    const menu = MENU.find((m) => m.id === id) || MENU[0];
    $$('.nav-item').forEach((el) => el.classList.toggle('active', el.dataset.id === menu.id));
    $('#pageTitle').textContent = menu.title;
    $('#sidebar').classList.remove('open');
    try {
      await menu.render();
    } catch (err) {
      $('#viewContainer').innerHTML = `<div class="empty"><div class="empty-ico">⚠️</div><p>${esc(err.message)}</p></div>`;
    }
  }

  async function enterApp(session) {
    CURRENT = session;
    const role = session.user.role;
    const ref = await API.reference();
    Views.setRef(ref);
    Views.setRole(role);

    MENU = (role === 'saisie') ? MENU_SAISIE : MENU_FULL;

    const name = role === 'admin' ? 'Administrateur OPA' : (role === 'president' ? 'Président OPA' : 'Agent de saisie');
    $('#userName').textContent = name;
    $('#userRole').textContent = ROLE_LABEL[role] || role;
    $('#userAvatar').textContent = (name[0] || 'U').toUpperCase();
    $('#topRole').textContent = ROLE_LABEL[role] || role;

    buildNav();
    $('#loginScreen').classList.add('hidden');
    $('#app').classList.remove('hidden');
    navigate(MENU[0].id);
  }

  function showLogin() {
    $('#app').classList.add('hidden');
    $('#loginScreen').classList.remove('hidden');
  }

  $('#loginForm').onsubmit = async (e) => {
    e.preventDefault();
    $('#loginError').textContent = '';
    const email = $('#loginEmail').value.trim();
    const pwd = $('#loginPassword').value;
    try {
      const res = await API.login(email, pwd);
      API.setToken(res.token);
      await enterApp({ user: res.user });
    } catch (err) {
      $('#loginError').textContent = err.message;
    }
  };

  // Afficher / masquer le mot de passe
  const togglePwd = $('#togglePassword');
  if (togglePwd) togglePwd.onclick = () => {
    const input = $('#loginPassword');
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    togglePwd.querySelector('.eye-open').style.display = show ? 'none' : '';
    togglePwd.querySelector('.eye-closed').style.display = show ? '' : 'none';
    togglePwd.title = show ? 'Masquer le mot de passe' : 'Afficher le mot de passe';
    input.focus();
  };

  $('#logoutBtn').onclick = () => { API.clearToken(); CURRENT = null; showLogin(); };

  $('#modalClose').onclick = UI.closeModal;
  $('#modal').onclick = (e) => { if (e.target.id === 'modal') UI.closeModal(); };
  $('#menuToggle').onclick = () => $('#sidebar').classList.toggle('open');

  (async () => {
    const token = API.getToken();
    if (!token) { showLogin(); return; }
    try {
      const session = await API.me();
      await enterApp({ user: session.user });
    } catch {
      API.clearToken();
      showLogin();
    }
  })();
})();
