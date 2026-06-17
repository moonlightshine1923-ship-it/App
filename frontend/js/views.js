// ===== Vues de l'application (Admin & Président : mêmes droits) =====
const Views = (() => {
  const { $, esc, toast, openModal, closeModal, confirm } = UI;
  let REF = null;
  let ROLE = 'admin';

  function setRef(r) { REF = r; }
  function setRole(r) { ROLE = r; }
  function container() { return $('#viewContainer'); }

  function wilayaOptions(sel) {
    return REF.wilayas.map((w) => `<option value="${w.code}" ${w.code === sel ? 'selected' : ''}>${w.code} — ${esc(w.nom)}</option>`).join('');
  }
  function typeOptions(sel) {
    return REF.types.map((t) => `<option value="${t.code}" ${t.code === sel ? 'selected' : ''}>${esc(t.libelle)} (${t.code})</option>`).join('');
  }
  function docTypeOptions(sel) {
    return REF.docTypes.map((d) => `<option value="${d.code}" ${d.code === sel ? 'selected' : ''} data-min="${d.min}" data-max="${d.max}">${esc(d.libelle)}</option>`).join('');
  }
  function niveauOptions(sel) {
    return REF.niveaux.map((n) => `<option ${n === sel ? 'selected' : ''}>${esc(n)}</option>`).join('');
  }
  function fmtDate(d) { return d ? String(d).slice(0, 10) : '—'; }

  /* ============ DASHBOARD (Admin & Président) ============ */
  async function dashboard() {
    const c = container();
    c.innerHTML = '<div class="muted">Chargement du tableau de bord…</div>';
    const s = await API.stats();
    const a = s.adherents;
    c.innerHTML = `
      <div class="stat-grid">
        ${statCard('👥', s.totalAdherents, 'Total adhérents')}
        ${statCard('★', a.gold, 'Adhérents Gold')}
        ${statCard('🤝', a.MA, 'Membres Actifs')}
        ${statCard('🎓', a.CR, 'Conseillers')}
        ${statCard('📨', s.demandes.ouvertes, 'Demandes ouvertes')}
        ${statCard('✅', s.demandes.cloturees, 'Demandes clôturées')}
        ${statCard('🆕', s.nouveauxMois, 'Nouveaux ce mois')}
        ${statCard('📊', s.demandes.tauxTraitement + '%', 'Taux de traitement')}
      </div>
      <div class="grid-2">
        <div class="panel">
          <div class="panel-head"><h3>Répartition par type</h3></div>
          ${Charts.donut([
            { label: 'Adhérent (AD)', value: a.AD },
            { label: 'Membre Actif (MA)', value: a.MA },
            { label: 'Conseiller (CR)', value: a.CR },
          ])}
        </div>
        <div class="panel">
          <div class="panel-head"><h3>Traitement des demandes</h3></div>
          ${Charts.donut(s.demandes.parStatut.map((d) => ({ label: d.statut, value: d.c })))}
        </div>
      </div>
      <div class="panel">
        <div class="panel-head"><h3>Répartition par wilaya (top 10)</h3></div>
        ${s.parWilaya.length ? Charts.bars(s.parWilaya.slice(0, 10).map((w) => ({ label: w.nom, value: w.count }))) : UI.emptyState('🗺️', 'Aucune donnée.')}
      </div>`;
  }

  function statCard(ico, val, lbl) {
    return `<div class="stat-card"><div class="stat-ico">${ico}</div>
      <div class="stat-val">${val}</div><div class="stat-lbl">${esc(lbl)}</div></div>`;
  }

  /* ============ LISTE ADHÉRENTS ============ */
  async function adherentsList() {
    const c = container();
    c.innerHTML = `
      <div class="toolbar">
        <input type="search" id="adhSearch" placeholder="Rechercher (nom, matricule, NIN, document, téléphone)…" />
        <select id="adhWilaya"><option value="">Toutes wilayas</option>${REF.wilayas.map((w) => `<option value="${w.code}">${w.code} — ${esc(w.nom)}</option>`).join('')}</select>
        <select id="adhType"><option value="">Tous types</option>${REF.types.map((t) => `<option value="${t.code}">${esc(t.libelle)}</option>`).join('')}</select>
        <button class="btn btn-dark" id="refreshAdhBtn" title="Rafraîchir">⟳ Rafraîchir</button>
        <button class="btn btn-gold" id="addAdhBtn">+ Nouvel adhérent</button>
      </div>
      <div id="adhTable"><div class="muted">Chargement…</div></div>`;

    async function load() {
      const params = {};
      const q = $('#adhSearch').value.trim(); if (q) params.q = q;
      const w = $('#adhWilaya').value; if (w) params.wilaya = w;
      const t = $('#adhType').value; if (t) params.type = t;
      renderAdhTable(await API.adherents(params));
    }
    let timer;
    $('#adhSearch').oninput = () => { clearTimeout(timer); timer = setTimeout(load, 280); };
    $('#adhWilaya').onchange = load;
    $('#adhType').onchange = load;
    $('#refreshAdhBtn').onclick = () => { load(); toast('Liste actualisée.'); };
    $('#addAdhBtn').onclick = () => adherentForm(null, load);
    load();
  }

  function renderAdhTable(list) {
    const t = $('#adhTable');
    if (!list.length) { t.innerHTML = UI.emptyState('👤', 'Aucun adhérent trouvé.'); return; }
    t.innerHTML = `<div class="table-wrap"><table class="data">
      <thead><tr>
        <th>Matricule</th><th>Nom & Prénom</th><th>Téléphone</th><th>Wilaya</th><th>Type</th><th>Niveau</th><th>Adhésion</th><th></th>
      </tr></thead><tbody>
      ${list.map((a) => `<tr>
        <td><span class="mono">${esc(a.matricule)}</span></td>
        <td class="cell-strong">${esc(a.prenom)} ${esc(a.nom)}</td>
        <td>${esc(a.telephone || '—')}</td>
        <td>${esc(a.wilaya_nom)}</td>
        <td>${UI.typeTag(a.type_libelle)}</td>
        <td>${UI.niveauTag(a.niveau)}</td>
        <td class="muted">${esc(fmtDate(a.date_adhesion))}</td>
        <td><div class="row-actions">
          <button class="btn btn-dark btn-sm" data-view="${a.id}">Voir</button>
          <button class="btn btn-dark btn-sm" data-edit="${a.id}">✎</button>
          <button class="btn btn-danger btn-sm" data-del="${a.id}">✕</button>
        </div></td>
      </tr>`).join('')}
      </tbody></table></div>`;

    t.querySelectorAll('[data-view]').forEach((b) => b.onclick = () => adherentDetail(b.dataset.view));
    t.querySelectorAll('[data-edit]').forEach((b) => b.onclick = async () => {
      adherentForm(await API.adherent(b.dataset.edit), adherentsList);
    });
    t.querySelectorAll('[data-del]').forEach((b) => b.onclick = () => {
      confirm('Supprimer définitivement cet adhérent ?', async () => {
        await API.deleteAdherent(b.dataset.del); toast('Adhérent supprimé.'); adherentsList();
      });
    });
  }

  /* ----- Formulaire adhérent ----- */
  function adherentForm(adh, onDone) {
    const isEdit = !!adh;
    const today = new Date().toISOString().slice(0, 10);
    openModal(isEdit ? "Modifier l'adhérent" : 'Nouvel adhérent', `
      <form id="adhForm">
        <div class="form-grid">
          <div class="field"><label>Nom *</label><input name="nom" value="${esc(adh?.nom || '')}" required /></div>
          <div class="field"><label>Prénom *</label><input name="prenom" value="${esc(adh?.prenom || '')}" required /></div>
          <div class="field"><label>الاسم العائلي (Nom en arabe) *</label><input name="nom_ar" dir="rtl" value="${esc(adh?.nom_ar || '')}" required /></div>
          <div class="field"><label>الاسم الشخصي (Prénom en arabe) *</label><input name="prenom_ar" dir="rtl" value="${esc(adh?.prenom_ar || '')}" required /></div>
          <div class="field"><label>Téléphone *</label><input name="telephone" value="${esc(adh?.telephone || '')}" required placeholder="05XXXXXXXX" /></div>
          <div class="field"><label>NIN * (18 chiffres)</label><input name="nin" value="${esc(adh?.nin || '')}" required maxlength="18" pattern="[0-9]{18}" placeholder="18 chiffres" /></div>
          <div class="field"><label>Type de document *</label><select name="doc_type" id="fDocType" required>${docTypeOptions(adh?.doc_type || 'RC')}</select></div>
          <div class="field"><label>Numéro du document *</label><input name="doc_numero" id="fDocNum" value="${esc(adh?.doc_numero || '')}" required />
            <small class="muted" id="docHint"></small></div>
          <div class="field"><label>Wilaya *</label><select name="wilaya_code" id="fWilaya" required>${wilayaOptions(adh?.wilaya_code || '16')}</select></div>
          <div class="field"><label>Type d'adhérent *</label><select name="type_code" id="fType" required>${typeOptions(adh?.type_code || 'AD')}</select></div>
          <div class="field"><label>Niveau d'adhésion *</label><select name="niveau" required>${niveauOptions(adh?.niveau || 'Adhérent Simple')}</select></div>
          <div class="field"><label>Date d'adhésion *</label><input type="date" name="date_adhesion" id="fDate" value="${esc(adh ? fmtDate(adh.date_adhesion) : today)}" required /></div>
          <div class="field"><label>Année (auto)</label><input id="fAnnee" value="${adh?.annee || new Date(today).getFullYear()}" disabled /></div>
          <div class="field"><label>Photo</label><input type="file" name="photo" accept="image/*" /></div>
        </div>
        <div class="field full" style="margin-top:6px">
          <label>Matricule (généré automatiquement)</label>
          <div class="matricule-preview" id="matPreview">${esc(adh?.matricule || '…')}</div>
        </div>
        <div class="form-error" id="adhFormErr"></div>
        <div class="modal-foot">
          <button type="button" class="btn btn-ghost" id="adhCancel">Annuler</button>
          <button type="submit" class="btn btn-gold">${isEdit ? 'Enregistrer' : "Créer l'adhérent"}</button>
        </div>
      </form>`, true);

    function updateDocHint() {
      const sel = $('#fDocType');
      const opt = sel.options[sel.selectedIndex];
      const min = +opt.dataset.min, max = +opt.dataset.max;
      const input = $('#fDocNum');
      input.maxLength = max;
      $('#docHint').textContent = (min === max)
        ? `Exactement ${min} caractères.`
        : `Entre ${min} et ${max} caractères.`;
    }
    async function refreshMatricule() {
      const w = $('#fWilaya').value, t = $('#fType').value;
      const an = $('#fDate').value ? new Date($('#fDate').value).getFullYear() : new Date().getFullYear();
      $('#fAnnee').value = an;
      try {
        const r = await API.previewMatricule(w, t, an);
        $('#matPreview').textContent = r.matricule + (isEdit ? '  (recalculé si modifié)' : '');
      } catch {}
    }
    $('#fDocType').onchange = updateDocHint;
    $('#fWilaya').onchange = refreshMatricule;
    $('#fType').onchange = refreshMatricule;
    $('#fDate').onchange = refreshMatricule;
    updateDocHint();
    if (!isEdit) refreshMatricule();

    $('#adhCancel').onclick = closeModal;
    $('#adhForm').onsubmit = async (e) => {
      e.preventDefault();
      $('#adhFormErr').textContent = '';
      const fd = new FormData(e.target);
      try {
        if (isEdit) { await API.updateAdherent(adh.id, fd); toast('Adhérent mis à jour.'); }
        else { const r = await API.createAdherent(fd); toast('Adhérent créé : ' + r.adherent.matricule); }
        closeModal();
        onDone && onDone();
      } catch (err) { $('#adhFormErr').textContent = err.message; }
    };
  }

  /* ----- Détail adhérent ----- */
  async function adherentDetail(id) {
    const a = await API.adherent(id);
    openModal('Fiche adhérent', `
      <div class="profile-head">
        <div id="detailPhoto"><div class="profile-photo-ph">${UI.initials(a.prenom, a.nom)}</div></div>
        <div>
          <h3 style="font-size:20px;color:var(--text)">${esc(a.prenom)} ${esc(a.nom)}</h3>
          ${(a.prenom_ar || a.nom_ar) ? `<div dir="rtl" style="font-size:16px;color:var(--text);margin-top:2px">${esc(a.prenom_ar || '')} ${esc(a.nom_ar || '')}</div>` : ''}
          <div class="mono" style="margin:6px 0">${esc(a.matricule)}</div>
          ${UI.typeTag(a.type_libelle)} ${UI.niveauTag(a.niveau)}
        </div>
      </div>
      <div class="detail-grid">
        ${detailItem('Nom (arabe)', a.nom_ar || '—')}
        ${detailItem('Prénom (arabe)', a.prenom_ar || '—')}
        ${detailItem('Téléphone', a.telephone || '—')}
        ${detailItem('NIN', a.nin || '—')}
        ${detailItem(a.doc_type_libelle, a.doc_numero || '—')}
        ${detailItem('Wilaya', a.wilaya_nom)}
        ${detailItem("Date d'adhésion", fmtDate(a.date_adhesion))}
        ${detailItem('Année', a.annee)}
      </div>
      <div class="modal-foot">
        <button class="btn btn-ghost" id="dCarte">📇 Carte (recto/verso)</button>
        <button class="btn btn-dark" id="dEdit">✎ Modifier</button>
        <button class="btn btn-gold" id="dClose">Fermer</button>
      </div>`, true);

    if (a.photo) API.fileUrl(a.photo).then((url) => { $('#detailPhoto').innerHTML = `<img src="${url}" class="profile-photo" />`; }).catch(() => {});
    $('#dClose').onclick = closeModal;
    $('#dCarte').onclick = () => downloadCarte(a.id, a.matricule);
    $('#dEdit').onclick = () => adherentForm(a, () => { closeModal(); adherentsList(); });
  }

  function detailItem(lbl, val) {
    return `<div class="detail-item"><div class="d-lbl">${esc(lbl)}</div><div class="d-val">${esc(val)}</div></div>`;
  }

  async function downloadCarte(id, matricule) {
    try {
      const res = await fetch('/api/adherents/' + id + '/carte', { headers: { Authorization: 'Bearer ' + API.getToken() } });
      if (!res.ok) throw new Error('Erreur');
      const html = await res.text();
      const win = window.open('', '_blank');
      if (!win) { toast('Autorisez les pop-ups pour afficher la carte.', 'error'); return; }
      win.document.open(); win.document.write(html); win.document.close();
      toast('Carte générée (Imprimer / Enregistrer en PDF dans le nouvel onglet).');
    } catch { toast('Impossible de générer la carte.', 'error'); }
  }

  /* ============ DEMANDES (déposées depuis le site web) ============ */
  // Accès réservé : Président & Administrateur.
  async function demandesList() {
    const c = container();
    if (!['admin', 'president'].includes(ROLE)) {
      c.innerHTML = UI.emptyState('🔒', 'Accès réservé au Président et à l’Administrateur.');
      return;
    }
    const types = (REF.typesDemande || []);
    c.innerHTML = `
      <div class="toolbar">
        <input type="search" id="demSearch" placeholder="Rechercher (objet, numéro, nom, matricule, email)…" />
        <select id="demStatut"><option value="">Tous statuts</option>${REF.statutsDemande.map((s) => `<option>${esc(s)}</option>`).join('')}</select>
        <select id="demPriorite"><option value="">Toutes priorités</option>${REF.priorites.map((p) => `<option>${esc(p)}</option>`).join('')}</select>
        <select id="demWilaya"><option value="">Toutes wilayas</option>${REF.wilayas.map((w) => `<option value="${w.code}">${w.code} — ${esc(w.nom)}</option>`).join('')}</select>
        <select id="demType"><option value="">Tous types</option>${types.map((t) => `<option>${esc(t)}</option>`).join('')}</select>
        <button class="btn btn-dark" id="refreshDemBtn" title="Rafraîchir">⟳ Rafraîchir</button>
      </div>
      <div id="demTable"><div class="muted">Chargement…</div></div>`;

    async function load() {
      const params = {};
      const q = $('#demSearch').value.trim(); if (q) params.q = q;
      const s = $('#demStatut').value; if (s) params.statut = s;
      const p = $('#demPriorite').value; if (p) params.priorite = p;
      const w = $('#demWilaya').value; if (w) params.wilaya = w;
      const t = $('#demType').value; if (t) params.type_demande = t;
      renderDemTable(await API.demandes(params));
    }
    let timer;
    $('#demSearch').oninput = () => { clearTimeout(timer); timer = setTimeout(load, 280); };
    $('#demStatut').onchange = load;
    $('#demPriorite').onchange = load;
    $('#demWilaya').onchange = load;
    $('#demType').onchange = load;
    $('#refreshDemBtn').onclick = () => { load(); toast('Liste actualisée.'); };
    load();
  }

  function renderDemTable(list) {
    const t = $('#demTable');
    if (!list.length) { t.innerHTML = UI.emptyState('📨', 'Aucune demande.'); return; }
    t.innerHTML = `<div class="table-wrap"><table class="data">
      <thead><tr>
        <th>Numéro</th><th>Nom</th><th>Prénom</th><th>Wilaya</th><th>Type de demande</th>
        <th>Date de création</th><th>Statut</th><th></th>
      </tr></thead><tbody>
      ${list.map((d) => `<tr>
        <td><span class="mono">${esc(d.numero)}</span></td>
        <td class="cell-strong">${esc(d.nom)}</td>
        <td>${esc(d.prenom)}</td>
        <td>${esc(d.wilaya_nom || d.wilaya_code || '—')}</td>
        <td>${esc(d.type_demande || d.objet || '—')}</td>
        <td class="muted">${esc((d.created_at || '').slice(0, 10))}</td>
        <td>${UI.statutTag(d.statut)}</td>
        <td><div class="row-actions">
          <button class="btn btn-dark btn-sm" data-view="${d.id}">Traiter</button>
          <button class="btn btn-danger btn-sm" data-del="${d.id}">✕</button>
        </div></td>
      </tr>`).join('')}
      </tbody></table></div>`;

    t.querySelectorAll('[data-view]').forEach((b) => b.onclick = () => demandeDetail(b.dataset.view));
    t.querySelectorAll('[data-del]').forEach((b) => b.onclick = () => {
      confirm('Supprimer cette demande ?', async () => {
        await API.deleteDemande(b.dataset.del); toast('Demande supprimée.'); demandesList();
      });
    });
  }

  async function demandeDetail(id) {
    const d = await API.demande(id);
    const piecesHtml = d.pieces && d.pieces.length
      ? d.pieces.map((p) => `<button class="btn btn-dark btn-sm" data-file="${esc(p.filename)}">📎 ${esc(p.original_name || 'Pièce')}</button>`).join(' ')
      : '<span class="muted">Aucune pièce jointe.</span>';

    openModal('Demande ' + d.numero, `
      <div class="detail-grid" style="margin-bottom:18px">
        ${detailItem('Numéro', d.numero)}
        ${detailItem('Nom', d.nom)}
        ${detailItem('Prénom', d.prenom)}
        ${detailItem('Wilaya', d.wilaya_nom || d.wilaya_code || '—')}
        ${detailItem('Type de demande', d.type_demande || '—')}
        ${detailItem('Email', d.email || '—')}
        ${detailItem('Téléphone', d.telephone || '—')}
        ${detailItem('Matricule', d.matricule || '—')}
        ${detailItem('Priorité', d.priorite)}
        ${detailItem('Statut', d.statut)}
        ${detailItem('Date de création', (d.created_at || '').slice(0, 16))}
      </div>
      <div class="detail-item full"><div class="d-lbl">Objet</div><div class="d-val">${esc(d.objet)}</div></div>
      <div class="detail-item" style="margin-top:12px"><div class="d-lbl">Description</div>
        <div class="d-val" style="line-height:1.6">${esc(d.description || '—')}</div></div>
      <div style="margin-top:14px"><div class="d-lbl" style="margin-bottom:8px">Pièces jointes</div>${piecesHtml}</div>
      ${d.reponse ? `<div class="panel" style="margin-top:16px;background:rgba(76,175,114,0.08)">
        <div class="d-lbl">Réponse</div><div class="d-val" style="margin-top:6px">${esc(d.reponse)}</div></div>` : ''}
      <div class="panel" style="margin-top:18px">
        <div class="panel-head"><h3>Traitement</h3></div>
        <div class="form-grid">
          <div class="field"><label>Statut</label><select id="dStatut">${REF.statutsDemande.map((s) => `<option ${s === d.statut ? 'selected' : ''}>${esc(s)}</option>`).join('')}</select></div>
          <div class="field"><label>Priorité</label><select id="dPriorite">${REF.priorites.map((p) => `<option ${p === d.priorite ? 'selected' : ''}>${esc(p)}</option>`).join('')}</select></div>
          <div class="field full"><label>Affecter à</label><input id="dAffecte" value="${esc(d.affecte_a || '')}" placeholder="Service / responsable" /></div>
          <div class="field full"><label>Réponse</label><textarea id="dReponse" placeholder="Réponse au demandeur…">${esc(d.reponse || '')}</textarea></div>
        </div>
        <div style="text-align:right;margin-top:10px"><button class="btn btn-gold" id="demSave">Enregistrer le traitement</button></div>
      </div>
      <div class="modal-foot">
        ${d.statut !== 'Clôturée' ? '<button class="btn btn-dark" id="demCloturer">Clôturer</button>' : ''}
        <button class="btn btn-gold" id="demClose">Fermer</button>
      </div>`, true);

    document.querySelectorAll('[data-file]').forEach((b) => b.onclick = async () => {
      try { window.open(await API.fileUrl(b.dataset.file), '_blank'); } catch { toast('Fichier indisponible.', 'error'); }
    });
    $('#demClose').onclick = closeModal;
    if ($('#demCloturer')) $('#demCloturer').onclick = async () => {
      await API.cloturerDemande(d.id); toast('Demande clôturée.'); closeModal(); demandesList();
    };
    $('#demSave').onclick = async () => {
      await API.updateDemande(d.id, {
        statut: $('#dStatut').value, priorite: $('#dPriorite').value,
        affecte_a: $('#dAffecte').value, reponse: $('#dReponse').value,
      });
      toast('Demande mise à jour.'); closeModal(); demandesList();
    };
  }

  /* ============ DOCUMENTS ============ */
  async function documentsList() {
    const c = container();
    c.innerHTML = `
      <div class="toolbar">
        <h3 style="flex:1;color:var(--text)">Gestion documentaire</h3>
        <button class="btn btn-gold" id="addDocBtn">+ Ajouter un document</button>
      </div>
      <div id="docTable"><div class="muted">Chargement…</div></div>`;
    async function load() {
      const [docs, adhs] = await Promise.all([API.documents(), API.adherents()]);
      const adhMap = {}; adhs.forEach((a) => adhMap[a.id] = `${a.prenom} ${a.nom} (${a.matricule})`);
      const t = $('#docTable');
      if (!docs.length) { t.innerHTML = UI.emptyState('📁', 'Aucun document.'); return; }
      t.innerHTML = `<div class="table-wrap"><table class="data">
        <thead><tr><th>Titre</th><th>Fichier</th><th>Adhérent associé</th><th>Ajouté le</th><th></th></tr></thead>
        <tbody>${docs.map((d) => `<tr>
          <td class="cell-strong">${esc(d.titre)}</td>
          <td class="muted">${esc(d.original_name || '')}</td>
          <td>${d.adherent_id ? esc(adhMap[d.adherent_id] || '#' + d.adherent_id) : '<span class="muted">— Général —</span>'}</td>
          <td class="muted">${esc((d.created_at || '').slice(0, 10))}</td>
          <td><div class="row-actions">
            <button class="btn btn-dark btn-sm" data-file="${esc(d.filename)}">Ouvrir</button>
            <button class="btn btn-danger btn-sm" data-del="${d.id}">✕</button>
          </div></td>
        </tr>`).join('')}</tbody></table></div>`;
      t.querySelectorAll('[data-file]').forEach((b) => b.onclick = async () => {
        try { window.open(await API.fileUrl(b.dataset.file), '_blank'); } catch { toast('Indisponible.', 'error'); }
      });
      t.querySelectorAll('[data-del]').forEach((b) => b.onclick = () => confirm('Supprimer ce document ?', async () => {
        await API.deleteDocument(b.dataset.del); toast('Document supprimé.'); load();
      }));
    }
    $('#addDocBtn').onclick = async () => {
      const adhs = await API.adherents();
      openModal('Ajouter un document', `
        <form id="docForm">
          <div class="field"><label>Titre</label><input name="titre" placeholder="Nom du document" /></div>
          <div class="field"><label>Associer à un adhérent (optionnel)</label>
            <select name="adherent_id"><option value="">— Document général —</option>
              ${adhs.map((a) => `<option value="${a.id}">${esc(a.prenom)} ${esc(a.nom)} — ${esc(a.matricule)}</option>`).join('')}</select></div>
          <div class="field"><label>Fichier *</label><input type="file" name="fichier" required /></div>
          <div class="form-error" id="docErr"></div>
          <div class="modal-foot"><button type="button" class="btn btn-ghost" id="docCancel">Annuler</button>
          <button type="submit" class="btn btn-gold">Téléverser</button></div>
        </form>`);
      $('#docCancel').onclick = closeModal;
      $('#docForm').onsubmit = async (e) => {
        e.preventDefault();
        try { await API.createDocument(new FormData(e.target)); toast('Document ajouté.'); closeModal(); load(); }
        catch (err) { $('#docErr').textContent = err.message; }
      };
    };
    load();
  }

  /* ============ PARAMÈTRES ============ */
  function parametres() {
    const c = container();
    c.innerHTML = `
      <div class="panel" style="max-width:520px">
        <div class="panel-head"><h3>Changer mon mot de passe</h3></div>
        <form id="pwForm">
          <div class="field"><label>Mot de passe actuel</label><input type="password" name="current" required /></div>
          <div class="field"><label>Nouveau mot de passe</label><input type="password" name="next" required minlength="6" /></div>
          <div class="form-error" id="pwErr"></div>
          <button type="submit" class="btn btn-gold">Mettre à jour</button>
        </form>
      </div>
      <div class="panel" style="max-width:680px">
        <div class="panel-head">
          <h3>Sauvegarde de la base de données</h3>
          <button class="btn btn-gold" id="backupBtn">💾 Sauvegarder maintenant</button>
        </div>
        <p class="muted" style="margin-bottom:14px">Sauvegarde automatique <b>chaque jeudi à 16h00</b>. Chaque sauvegarde crée un fichier
          « <b>Sauvegarde bdd opa - DATE</b> » dans le dossier <b>backups/</b> du serveur. Vous pouvez aussi les télécharger ci-dessous.</p>
        <div id="backupMsg" class="muted" style="margin-bottom:12px"></div>
        <div id="backupList"><div class="muted">Chargement des sauvegardes…</div></div>
      </div>`;
    $('#pwForm').onsubmit = async (e) => {
      e.preventDefault();
      const f = e.target;
      try { await API.changePassword(f.current.value, f.next.value); toast('Mot de passe modifié.'); f.reset(); }
      catch (err) { $('#pwErr').textContent = err.message; }
    };

    async function loadBackups() {
      try {
        const list = await API.listBackups();
        const el = $('#backupList');
        if (!list.length) { el.innerHTML = UI.emptyState('💾', 'Aucune sauvegarde pour le moment.'); return; }
        el.innerHTML = `<div class="table-wrap"><table class="data">
          <thead><tr><th>Fichier</th><th>Date</th><th>Taille</th><th></th></tr></thead>
          <tbody>${list.map((b) => `<tr>
            <td class="cell-strong">${esc(b.name)}</td>
            <td class="muted">${new Date(b.date).toLocaleString('fr-FR')}</td>
            <td class="muted">${(b.size / 1024).toFixed(1)} Ko</td>
            <td><button class="btn btn-dark btn-sm" data-dl="${esc(b.name)}">⬇ Télécharger</button></td>
          </tr>`).join('')}</tbody></table></div>`;
        el.querySelectorAll('[data-dl]').forEach((btn) => btn.onclick = async () => {
          try { await API.downloadBackup(btn.dataset.dl); toast('Téléchargement lancé.'); }
          catch (err) { toast(err.message, 'error'); }
        });
      } catch (err) { $('#backupList').innerHTML = `<p class="form-error">${esc(err.message)}</p>`; }
    }

    $('#backupBtn').onclick = async () => {
      $('#backupMsg').textContent = 'Sauvegarde en cours…';
      try {
        const r = await API.backup();
        $('#backupMsg').textContent = '✅ Sauvegarde créée : ' + r.file;
        toast('Sauvegarde effectuée.');
        loadBackups();
      } catch (err) { $('#backupMsg').textContent = '⚠️ ' + err.message; toast('Échec de la sauvegarde.', 'error'); }
    };

    loadBackups();
  }

  /* ============ AGENT DE SAISIE : ajout d'adhérent uniquement ============ */
  function saisieAjout() {
    const c = container();
    c.innerHTML = `
      <div class="panel" style="max-width:560px;text-align:center">
        <div class="panel-head" style="justify-content:center"><h3>Ajouter un adhérent</h3></div>
        <p class="muted" style="margin-bottom:18px">Cliquez ci-dessous pour enregistrer un nouvel adhérent.
          Vous n'avez pas accès à la liste des adhérents ni aux demandes.</p>
        <button class="btn btn-gold" id="saisieBtn" style="font-size:15px;padding:13px 26px">➕ Nouvel adhérent</button>
        <div id="saisieRecap" style="margin-top:20px"></div>
      </div>`;
    $('#saisieBtn').onclick = () => adherentForm(null, () => {
      $('#saisieRecap').innerHTML = `<div class="muted" style="color:var(--green,#2f9e5e)">✅ Adhérent enregistré avec succès.</div>`;
      setTimeout(() => { $('#saisieRecap').innerHTML = ''; }, 4000);
    });
  }

  /* ============ COMPTES UTILISATEURS (admin & président) ============ */
  async function comptesList() {
    const c = container();
    c.innerHTML = `
      <div class="toolbar">
        <h3 style="flex:1;color:var(--text)">Comptes utilisateurs</h3>
        <button class="btn btn-gold" id="addUserBtn">+ Nouveau compte</button>
      </div>
      <p class="muted" style="margin:-6px 0 16px">Créez un <b>agent de saisie</b> : il pourra uniquement ajouter des adhérents, sans accès à la liste ni aux demandes.</p>
      <div id="usersTable"><div class="muted">Chargement…</div></div>`;
    async function load() {
      const users = await API.users();
      const t = $('#usersTable');
      const roleLabel = { admin: 'Administrateur', president: 'Président', saisie: 'Agent de saisie' };
      // Protection : le compte Président est INTOUCHABLE depuis cet écran.
      // Aucun bouton n'est rendu pour le Président — ni mot de passe,
      // ni suppression, ni changement de rôle.
      t.innerHTML = `<div class="table-wrap"><table class="data">
        <thead><tr><th>Email</th><th>Rôle</th><th>Créé le</th><th></th></tr></thead>
        <tbody>${users.map((u) => {
          const isPresident = u.role === 'president';
          const actions = isPresident
            ? `<span class="tag tag-gold" title="Le compte Président est protégé : il ne peut être ni modifié, ni réinitialisé, ni supprimé par l'administrateur.">🔒 Compte protégé</span>`
            : `<div class="row-actions">
                <button class="btn btn-dark btn-sm" data-pwd="${u.id}" data-email="${esc(u.email)}">🔑 Mot de passe</button>
                <button class="btn btn-danger btn-sm" data-del="${u.id}">✕</button>
              </div>`;
          return `<tr>
            <td class="cell-strong">${esc(u.email)}</td>
            <td>${esc(roleLabel[u.role] || u.role)}</td>
            <td class="muted">${esc((u.created_at || '').slice(0,10))}</td>
            <td>${actions}</td>
          </tr>`;
        }).join('')}</tbody></table></div>`;
      t.querySelectorAll('[data-del]').forEach((b) => b.onclick = () => confirm('Supprimer ce compte ?', async () => {
        try { await API.deleteUser(b.dataset.del); toast('Compte supprimé.'); load(); }
        catch (e) { toast(e.message, 'error'); }
      }));
      t.querySelectorAll('[data-pwd]').forEach((b) => b.onclick = () => {
        openModal('Réinitialiser le mot de passe', `
          <p class="muted" style="margin-bottom:12px">${esc(b.dataset.email)}</p>
          <form id="pwdForm">
            <div class="field"><label>Nouveau mot de passe</label><input type="text" name="password" required minlength="6" /></div>
            <div class="form-error" id="pwdErr"></div>
            <div class="modal-foot"><button type="button" class="btn btn-ghost" id="pwdCancel">Annuler</button>
            <button type="submit" class="btn btn-gold">Enregistrer</button></div>
          </form>`);
        $('#pwdCancel').onclick = closeModal;
        $('#pwdForm').onsubmit = async (e) => {
          e.preventDefault();
          try { await API.resetUserPassword(b.dataset.pwd, e.target.password.value); toast('Mot de passe mis à jour.'); closeModal(); }
          catch (err) { $('#pwdErr').textContent = err.message; }
        };
      });
    }
    $('#addUserBtn').onclick = () => {
      // Seul le Président peut créer un nouveau compte « Président ».
      const presidentOption = (ROLE === 'president')
        ? `<option value="president">Président (accès complet)</option>` : '';
      openModal('Nouveau compte', `
        <form id="userForm">
          <div class="field"><label>Email *</label><input type="email" name="email" required placeholder="agent@opa.dz" /></div>
          <div class="field"><label>Mot de passe *</label><input type="text" name="password" required minlength="6" placeholder="6 caractères min." /></div>
          <div class="field"><label>Rôle *</label>
            <select name="role">
              <option value="saisie">Agent de saisie (ajout d'adhérents uniquement)</option>
              ${presidentOption}
              <option value="admin">Administrateur (accès complet)</option>
            </select></div>
          <div class="form-error" id="userErr"></div>
          <div class="modal-foot"><button type="button" class="btn btn-ghost" id="userCancel">Annuler</button>
          <button type="submit" class="btn btn-gold">Créer le compte</button></div>
        </form>`);
      $('#userCancel').onclick = closeModal;
      $('#userForm').onsubmit = async (e) => {
        e.preventDefault();
        const f = e.target;
        try {
          await API.createUser({ email: f.email.value, password: f.password.value, role: f.role.value });
          toast('Compte créé.'); closeModal(); load();
        } catch (err) { $('#userErr').textContent = err.message; }
      };
    };
    load();
  }

  return { setRef, setRole, dashboard, adherentsList, demandesList, documentsList, parametres, saisieAjout, comptesList };
})();
