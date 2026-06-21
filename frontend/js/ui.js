// ===== Helpers UI =====
const UI = (() => {
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  function esc(s) {
    if (s === null || s === undefined) return '';
    return String(s).replace(/[&<>"']/g, (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function toast(msg, type = 'success') {
    const t = $('#toast');
    t.textContent = msg;
    t.className = 'toast ' + type;
    setTimeout(() => t.classList.add('hidden'), 3200);
  }

  function openModal(title, html, large = false) {
    $('#modalTitle').textContent = title;
    $('#modalBody').innerHTML = html;
    $('#modal .modal').classList.toggle('modal-lg', large);
    $('#modal').classList.remove('hidden');
  }
  function closeModal() {
    $('#modal').classList.add('hidden');
    $('#modalBody').innerHTML = '';
  }

  function confirm(message, onYes) {
    openModal('Confirmation', `
      <p style="color:var(--text-dim);font-size:14.5px;line-height:1.6">${esc(message)}</p>
      <div class="modal-foot">
        <button class="btn btn-ghost" id="cfNo">Annuler</button>
        <button class="btn btn-danger" id="cfYes">Confirmer</button>
      </div>`);
    $('#cfNo').onclick = closeModal;
    $('#cfYes').onclick = () => { closeModal(); onYes(); };
  }

  function statutTag(s) {
    const map = {
      'Actif': 'tag-actif', 'En attente': 'tag-attente', 'Suspendu': 'tag-suspendu', 'Inactif': 'tag-inactif',
      'Nouvelle': 'tag-nouvelle', 'En cours': 'tag-encours', 'Résolue': 'tag-resolue', 'Clôturée': 'tag-cloturee',
    };
    return `<span class="tag ${map[s] || 'tag-normale'}">${esc(s)}</span>`;
  }
  function prioriteTag(p) {
    const map = { 'Basse': 'tag-basse', 'Normale': 'tag-normale', 'Haute': 'tag-haute', 'Urgente': 'tag-urgente' };
    return `<span class="tag ${map[p] || 'tag-normale'}">${esc(p)}</span>`;
  }
  function niveauTag(n) {
    if (!n || n === 'Adhérent Simple' || n === 'Adhérent simple') return `<span class="muted">Carte Simple</span>`;
    return `<span class="tag tag-gold">★ Carte Gold</span>`;
  }
  function typeTag(libelle) { return `<span class="tag tag-type">${esc(libelle)}</span>`; }

  function initials(prenom, nom) {
    return ((prenom || '')[0] || '') + ((nom || '')[0] || '');
  }

  function emptyState(icon, text) {
    return `<div class="empty"><div class="empty-ico">${icon}</div><p>${esc(text)}</p></div>`;
  }

  return { $, $$, esc, toast, openModal, closeModal, confirm, statutTag, prioriteTag, niveauTag, typeTag, initials, emptyState };
})();
