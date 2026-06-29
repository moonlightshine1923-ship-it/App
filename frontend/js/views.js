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
  function fmtDate(d) {
    if (!d) return '—';
    const str = String(d);
    if (str.includes('T')) {
      const dateObj = new Date(d);
      if (!isNaN(dateObj)) {
        const yr = dateObj.getFullYear();
        const mo = String(dateObj.getMonth() + 1).padStart(2, '0');
        const da = String(dateObj.getDate()).padStart(2, '0');
        return `${yr}-${mo}-${da}`;
      }
    }
    return str.slice(0, 10);
  }

  /* ============ DASHBOARD PROFESSIONNEL ============ */

  async function dashboard() {
    const c = container();
    c.innerHTML = '<div class="muted">Chargement du tableau de bord…</div>';

    const s = await API.stats();
    const a = s.adherents;
    const now = new Date();
    const heure = now.getHours();
    const salutation = heure < 12 ? 'Bonjour' : heure < 18 ? 'Bon après-midi' : 'Bonsoir';
    const roleLabel = ROLE === 'president' ? 'Président' : 'Administrateur';

    // Calcul taux de croissance (simulation si pas fourni par l'API)
    const tauxTraitement = s.demandes.tauxTraitement || 0;
    const tauxUrgence = s.demandes.parStatut
      ? (s.demandes.parStatut.find(d => d.statut === 'Urgente')?.c || 0)
      : 0;

    c.innerHTML = `
      <style>
        .dash-header {
          display:flex;align-items:center;justify-content:space-between;
          margin-bottom:28px;padding-bottom:20px;
          border-bottom:1px solid var(--border, #e2e8f0);
        }
        .dash-header h2 { font-size:22px; font-weight:700; color:var(--text); margin:0 0 4px; }
        .dash-header .sub { font-size:13px; color:var(--muted, #94a3b8); }
        .dash-header .role-badge {
          display:inline-flex;align-items:center;gap:6px;
          background:var(--gold, #c8a44e);color:#fff;
          padding:5px 14px;border-radius:20px;font-size:12px;font-weight:600;
          letter-spacing:.3px;text-transform:uppercase;
        }
        .kpi-row {
          display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));
          gap:16px;margin-bottom:28px;
        }
        .kpi {
          background:var(--card, #fff);border:1px solid var(--border, #e2e8f0);
          border-radius:12px;padding:20px;position:relative;overflow:hidden;
          transition:box-shadow .2s;
        }
        .kpi:hover { box-shadow:0 4px 20px rgba(0,0,0,.07); }
        .kpi-accent {
          position:absolute;left:0;top:0;bottom:0;width:4px;border-radius:4px 0 0 4px;
        }
        .kpi .kpi-ico {
          width:40px;height:40px;border-radius:10px;
          display:flex;align-items:center;justify-content:center;
          font-size:18px;margin-bottom:12px;
        }
        .kpi .kpi-val { font-size:28px;font-weight:800;color:var(--text);line-height:1; }
        .kpi .kpi-lbl { font-size:12px;color:var(--muted, #94a3b8);margin-top:6px;font-weight:500;letter-spacing:.2px; }
        .kpi .kpi-sub { font-size:11px;color:var(--muted, #94a3b8);margin-top:4px; }

        .dash-grid { display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:28px; }
        .dash-grid-3 { display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px;margin-bottom:28px; }
        .dash-panel {
          background:var(--card, #fff);border:1px solid var(--border, #e2e8f0);
          border-radius:12px;overflow:hidden;
        }
        .dash-panel-head {
          display:flex;align-items:center;justify-content:space-between;
          padding:16px 20px;border-bottom:1px solid var(--border, #e2e8f0);
        }
        .dash-panel-head h3 { font-size:14px;font-weight:700;color:var(--text);margin:0; }
        .dash-panel-body { padding:20px; }

        .quick-actions { display:grid;grid-template-columns:1fr 1fr;gap:10px; }
        .qa-btn {
          display:flex;align-items:center;gap:12px;
          padding:14px 16px;border-radius:10px;border:1px solid var(--border, #e2e8f0);
          background:var(--card, #fff);cursor:pointer;transition:all .15s;
          font-size:13px;font-weight:600;color:var(--text);
        }
        .qa-btn:hover { border-color:var(--gold, #c8a44e);background:rgba(200,164,78,.04); }
        .qa-btn .qa-ico {
          width:38px;height:38px;border-radius:9px;
          display:flex;align-items:center;justify-content:center;font-size:16px;
          flex-shrink:0;
        }

        .mini-table { width:100%;border-collapse:collapse; }
        .mini-table th {
          text-align:left;font-size:11px;font-weight:600;color:var(--muted, #94a3b8);
          padding:8px 10px;border-bottom:1px solid var(--border, #e2e8f0);
          text-transform:uppercase;letter-spacing:.4px;
        }
        .mini-table td { padding:10px;font-size:13px;color:var(--text);border-bottom:1px solid var(--border, #e2e8f0); }
        .mini-table tr:last-child td { border-bottom:none; }

        .progress-bar-wrap {
          height:8px;background:var(--border, #e2e8f0);border-radius:4px;overflow:hidden;
        }
        .progress-bar-fill {
          height:100%;border-radius:4px;transition:width .6s ease;
        }
        .metric-row { display:flex;align-items:center;justify-content:space-between;padding:10px 0; }
        .metric-row + .metric-row { border-top:1px solid var(--border, #e2e8f0); }
        .metric-label { font-size:13px;color:var(--text); }
        .metric-val { font-size:14px;font-weight:700;color:var(--text); }
        .metric-bar { flex:1;margin:0 16px;max-width:200px; }

        .alert-banner {
          display:flex;align-items:center;gap:12px;
          padding:14px 18px;border-radius:10px;margin-bottom:20px;
          font-size:13px;font-weight:500;
        }
        .alert-banner.alert-warn { background:#fef3c7;color:#92400e;border:1px solid #fcd34d; }
        .alert-banner.alert-info { background:#dbeafe;color:#1e40af;border:1px solid #93c5fd; }
        .alert-banner.alert-ok { background:#d1fae5;color:#065f46;border:1px solid #6ee7b7; }

        @media (max-width:900px) {
          .dash-grid, .dash-grid-3 { grid-template-columns:1fr; }
          .kpi-row { grid-template-columns:1fr 1fr; }
        }
        @media (max-width:560px) {
          .kpi-row { grid-template-columns:1fr; }
          .quick-actions { grid-template-columns:1fr; }
        }
      </style>

      <!-- EN-TÊTE -->
      <div class="dash-header">
        <div>
          <h2>${salutation}, ${esc(roleLabel)}</h2>
          <div class="sub">${now.toLocaleDateString('fr-FR', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}</div>
        </div>
        <div class="role-badge">⬥ ${esc(roleLabel)}</div>
      </div>

      <!-- ALERTE SI DEMANDES URGENTES -->
      ${tauxUrgence > 0 ? `
        <div class="alert-banner alert-warn">
          <span style="font-size:18px">⚠️</span>
          <span><b>${tauxUrgence} demande${tauxUrgence > 1 ? 's' : ''} urgente${tauxUrgence > 1 ? 's' : ''}</b> nécessite${tauxUrgence === 1 ? '' : 'nt'} votre attention immédiate.</span>
          <button class="btn btn-dark btn-sm" style="margin-left:auto" onclick="Views.demandesList()">Traiter →</button>
        </div>` : ''}

      <!-- KPI PRINCIPAUX -->
      <div class="kpi-row">
        ${kpiCard('total', '👥', s.totalAdherents, 'Total adhérents', `${s.nouveauxMois} nouveau${s.nouveauxMois > 1 ? 'x' : ''} ce mois`, '#3b82f6')}
        ${kpiCard('ad', '▣', a.AD, 'Adhérents (AD)', `dont ${a.gold} Gold`, '#6366f1')}
        ${kpiCard('ma', '⬡', a.MA, 'Membres Actifs (MA)', `${a.MA ? ((a.MA/s.totalAdherents)*100).toFixed(1) : 0}% du total`, '#0891b2')}
        ${kpiCard('cr', '◆', a.CR, 'Conseillers (CR)', `${a.CR ? ((a.CR/s.totalAdherents)*100).toFixed(1) : 0}% du total`, '#7c3aed')}
        ${kpiCard('ouvertes', '📨', s.demandes.ouvertes, 'Demandes ouvertes', 'En attente de traitement', '#f59e0b')}
        ${kpiCard('cloturees', '✓', s.demandes.cloturees, 'Demandes clôturées', `Taux : ${tauxTraitement}%`, '#10b981')}
      </div>

      <!-- RANGÉE : RÉPARTITION + TRAITEMENT DEMANDES -->
      <div class="dash-grid">
        <div class="dash-panel">
          <div class="dash-panel-head"><h3>▣ Répartition par type</h3></div>
          <div class="dash-panel-body">
            ${Charts.donut([
              { label: 'Adhérent (AD)', value: a.AD },
              { label: 'Membre Actif (MA)', value: a.MA },
              { label: 'Conseiller (CR)', value: a.CR },
            ])}
            <div style="margin-top:14px">
              ${metricBar('Adhérent', a.AD, s.totalAdherents, '#6366f1')}
              ${metricBar('Membre Actif', a.MA, s.totalAdherents, '#0891b2')}
              ${metricBar('Conseiller', a.CR, s.totalAdherents, '#7c3aed')}
            </div>
          </div>
        </div>

        <div class="dash-panel">
          <div class="dash-panel-head"><h3>📨 Traitement des demandes</h3></div>
          <div class="dash-panel-body">
            ${Charts.donut(s.demandes.parStatut.map((d) => ({ label: d.statut, value: d.c })))}
            <div style="margin-top:14px">
              <div class="metric-row">
                <span class="metric-label">Taux de traitement</span>
                <div class="metric-bar">
                  <div class="progress-bar-wrap">
                    <div class="progress-bar-fill" style="width:${tauxTraitement}%;background:#10b981"></div>
                  </div>
                </div>
                <span class="metric-val" style="color:#10b981">${tauxTraitement}%</span>
              </div>
              <div class="metric-row">
                <span class="metric-label">Demandes en attente</span>
                <div class="metric-bar">
                  <div class="progress-bar-wrap">
                    <div class="progress-bar-fill" style="width:${s.totalAdherents ? (s.demandes.ouvertes/(s.demandes.ouvertes+s.demandes.cloturees||1))*100 : 0}%;background:#f59e0b"></div>
                  </div>
                </div>
                <span class="metric-val" style="color:#f59e0b">${s.demandes.ouvertes}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- RANGÉE : WILAYAS + ACTIONS RAPIDES -->
      <div class="dash-grid">
        <div class="dash-panel">
          <div class="dash-panel-head"><h3>🗺️ Répartition par wilaya (top 10)</h3></div>
          <div class="dash-panel-body">
            ${s.parWilaya.length ? Charts.bars(s.parWilaya.slice(0, 10).map((w) => ({ label: w.nom, value: w.count }))) : UI.emptyState('🗺️', 'Aucune donnée.')}
          </div>
        </div>

        <div class="dash-panel">
          <div class="dash-panel-head"><h3>⚡ Actions rapides</h3></div>
          <div class="dash-panel-body">
            <div class="quick-actions">
              <button class="qa-btn" id="qaAddAdh">
                <div class="qa-ico" style="background:rgba(99,102,241,.1);color:#6366f1">➕</div>
                <div><div>Nouvel adhérent</div><div style="font-size:11px;color:var(--muted, #94a3b8);font-weight:400">Enregistrer un adhérent</div></div>
              </button>
              <button class="qa-btn" id="qaDemandes">
                <div class="qa-ico" style="background:rgba(245,158,11,.1);color:#f59e0b">📨</div>
                <div><div>Traiter les demandes</div><div style="font-size:11px;color:var(--muted, #94a3b8);font-weight:400">${s.demandes.ouvertes} en attente</div></div>
              </button>
              <button class="qa-btn" id="qaDocuments">
                <div class="qa-ico" style="background:rgba(16,185,129,.1);color:#10b981">📁</div>
                <div><div>Documents</div><div style="font-size:11px;color:var(--muted, #94a3b8);font-weight:400">Gestion documentaire</div></div>
              </button>
              <button class="qa-btn" id="qaComptes">
                <div class="qa-ico" style="background:rgba(124,58,237,.1);color:#7c3aed">👥</div>
                <div><div>Comptes</div><div style="font-size:11px;color:var(--muted, #94a3b8);font-weight:400">Gestion des utilisateurs</div></div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- RANGÉE : STATS WILAYAS TABLEAU + RÉSUMÉ -->
      <div class="dash-grid">
        <div class="dash-panel">
          <div class="dash-panel-head"><h3>📊 Détail par wilaya</h3></div>
          <div class="dash-panel-body" style="padding:0">
            <div style="max-height:300px;overflow-y:auto">
              <table class="mini-table">
                <thead><tr><th>Wilaya</th><th>Adhérents</th><th>Part</th></tr></thead>
                <tbody>
                  ${s.parWilaya.slice(0, 15).map(w => `
                    <tr>
                      <td style="font-weight:600">${esc(w.nom)}</td>
                      <td><span class="mono">${w.count}</span></td>
                      <td>
                        <div style="display:flex;align-items:center;gap:8px">
                          <div class="progress-bar-wrap" style="flex:1;max-width:80px">
                            <div class="progress-bar-fill" style="width:${s.totalAdherents ? (w.count/s.totalAdherents*100) : 0}%;background:#3b82f6"></div>
                          </div>
                          <span style="font-size:11px;color:var(--muted, #94a3b8)">${s.totalAdherents ? (w.count/s.totalAdherents*100).toFixed(1) : 0}%</span>
                        </div>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="dash-panel">
          <div class="dash-panel-head"><h3>📋 Résumé exécutif</h3></div>
          <div class="dash-panel-body">
            <div class="metric-row">
              <span class="metric-label">Total adhérents actifs</span>
              <span class="metric-val">${s.totalAdherents}</span>
            </div>
            <div class="metric-row">
              <span class="metric-label">Adhérents Gold</span>
              <span class="metric-val" style="color:#c8a44e">${a.gold || 0}</span>
            </div>
            <div class="metric-row">
              <span class="metric-label">Nouveaux ce mois</span>
              <span class="metric-val" style="color:#3b82f6">${s.nouveauxMois}</span>
            </div>
            <div class="metric-row">
              <span class="metric-label">Demandes en cours</span>
              <span class="metric-val" style="color:#f59e0b">${s.demandes.ouvertes}</span>
            </div>
            <div class="metric-row">
              <span class="metric-label">Demandes clôturées</span>
              <span class="metric-val" style="color:#10b981">${s.demandes.cloturees}</span>
            </div>
            <div class="metric-row">
              <span class="metric-label">Taux de traitement</span>
              <span class="metric-val" style="color:${tauxTraitement >= 75 ? '#10b981' : tauxTraitement >= 50 ? '#f59e0b' : '#ef4444'}">${tauxTraitement}%</span>
            </div>
            <div class="metric-row">
              <span class="metric-label">Wilayas représentées</span>
              <span class="metric-val">${s.parWilaya.length}</span>
            </div>
          </div>
        </div>
      </div>
    `;

    // Bind quick actions
    $('#qaAddAdh').onclick = () => adherentForm(null, adherentsList);
    $('#qaDemandes').onclick = () => demandesList();
    $('#qaDocuments').onclick = () => documentsList();
    $('#qaComptes').onclick = () => comptesList();
  }

  function kpiCard(id, ico, val, lbl, sub, color) {
    return `
      <div class="kpi" id="kpi-${id}">
        <div class="kpi-accent" style="background:${color}"></div>
        <div class="kpi-ico" style="background:${color}15;color:${color}">${ico}</div>
        <div class="kpi-val">${val}</div>
        <div class="kpi-lbl">${esc(lbl)}</div>
        <div class="kpi-sub">${esc(sub)}</div>
      </div>`;
  }

  function metricBar(label, value, total, color) {
    const pct = total ? (value / total * 100).toFixed(1) : 0;
    return `
      <div class="metric-row">
        <span class="metric-label">${esc(label)}</span>
        <div class="metric-bar">
          <div class="progress-bar-wrap">
            <div class="progress-bar-fill" style="width:${pct}%;background:${color}"></div>
          </div>
        </div>
        <span class="metric-val" style="color:${color}">${value} <small style="font-weight:400;color:var(--muted, #94a3b8);font-size:11px">(${pct}%)</small></span>
      </div>`;
  }
/* ============ LISTE ADHÉRENTS ============ */
/* ============ ADHÉRENTS ============ */

  async function adherentsList() {
    const c = container();
    c.innerHTML = `
      <div class="toolbar" style="flex-wrap: wrap; gap: 10px;">
        <input type="search" id="adhSearch" placeholder="Rechercher (nom, matricule, NIN, document, téléphone)…" />
        <select id="adhWilaya"><option value="">Toutes wilayas</option>${REF.wilayas.map((w) => `<option value="${w.code}">${w.code} — ${esc(w.nom)}</option>`).join('')}</select>
        <select id="adhType"><option value="">Tous types</option>${REF.types.map((t) => `<option value="${t.code}">${esc(t.libelle)}</option>`).join('')}</select>
        <button class="btn btn-dark" id="refreshAdhBtn" title="Rafraîchir">⟳ Rafraîchir</button>
        <button class="btn btn-gold" id="addAdhBtn">+ Nouvel adhérent</button>
        <button class="btn btn-danger" id="bulkDeleteAdhBtn" style="display: none;">✕ Supprimer la sélection (<span id="bulkAdhCount">0</span>)</button>
      </div>
      <div id="adhTable"><div class="muted">Chargement…</div></div>`;

    async function load() {
      const params = {};
      const q = $('#adhSearch').value.trim(); if (q) params.q = q;
      const w = $('#adhWilaya').value; if (w) params.wilaya = w;
      const t = $('#adhType').value; if (t) params.type = t;
      renderAdhTable(await API.adherents(params));
      updateBulkButton(); // Réinitialise l'état du bouton après chargement
    }

    // Gestion du bouton de suppression en masse
    function updateBulkButton() {
      const checkedBoxes = document.querySelectorAll('.adh-checkbox:checked');
      const bulkBtn = $('#bulkDeleteAdhBtn');
      const bulkCount = $('#bulkAdhCount');
      
      if (checkedBoxes.length > 0) {
        bulkCount.textContent = checkedBoxes.length;
        bulkBtn.style.display = 'inline-block';
      } else {
        bulkBtn.style.display = 'none';
      }
    }

    // Clic sur la suppression groupée
    $('#bulkDeleteAdhBtn').onclick = () => {
      const checkedBoxes = document.querySelectorAll('.adh-checkbox:checked');
      const idsToDelete = Array.from(checkedBoxes).map(cb => cb.value);

      confirm(`Supprimer définitivement ces ${idsToDelete.length} adhérents ?`, async () => {
        try {
          // Supprime tous les adhérents sélectionnés en parallèle
          await Promise.all(idsToDelete.map(id => API.deleteAdherent(id)));
          toast(`${idsToDelete.length} adhérents supprimés avec succès.`);
          load();
        } catch (err) {
          toast('Erreur lors de la suppression groupée : ' + err.message, 'error');
        }
      });
    };

    // Écouteur global sur le conteneur pour mettre à jour le compteur en temps réel
    c.addEventListener('change', (e) => {
      if (e.target.classList.contains('adh-checkbox') || e.target.id === 'selectAllAdh') {
        updateBulkButton();
      }
    });

    let timer;
    $('#adhSearch').oninput = () => { clearTimeout(timer); timer = setTimeout(load, 280); };
    $('#adhWilaya').onchange = load;
    $('#adhType').onchange = load;
    $('#refreshAdhBtn').onclick = () => { load(); toast('Liste actualisée.'); };
    $('#addAdhBtn').onclick = () => { id: adherentForm(null, load) };
    load();
  }


  function renderAdhTable(list) {
  const t = $('#adhTable');
  if (!list.length) { t.innerHTML = UI.emptyState('👤', 'Aucun adhérent trouvé.'); return; }
  
  t.innerHTML = `<div class="table-wrap"><table class="data">
    <thead><tr>
      <th width="40"><input type="checkbox" id="selectAllAdh" /></th>
      <th>Matricule</th><th>Nom & Prénom</th><th>Téléphone</th><th>Wilaya</th><th>Type</th><th>Adhésion</th><th></th>
    </tr></thead><tbody>
    ${list.map((a) => `<tr>
      <td><input type="checkbox" class="adh-checkbox" value="${a.id}" /></td>
      <td>
        <span class="mono" style="font-weight:bold; color:var(--gold); font-size: 13px;">
          ${esc(a.matricule || '—')}
        </span>
      </td>
      <td class="cell-strong">${esc(a.prenom)} ${esc(a.nom)}</td>
      <td>${esc(a.telephone || '—')}</td>
      <td>${esc(a.wilaya_nom)}</td>
      <td>${UI.typeTag(a.type_libelle)}</td>
      <td class="muted">${esc(fmtDate(a.date_adhesion))}</td>
      <td><div class="row-actions">
        <button class="btn btn-dark btn-sm" data-view="${a.id}">Voir</button>
        <button class="btn btn-dark btn-sm" data-edit="${a.id}">✎</button>
        <button class="btn btn-danger btn-sm" data-del="${a.id}">✕</button>
      </div></td>
    </tr>`).join('')}
    </tbody></table></div>`;

  // --- LOGIQUE DE SÉLECTION & SUPPRESSION GROUPÉE ---
  const selectAll = $('#selectAllAdh');
  const checkboxes = t.querySelectorAll('.adh-checkbox');
  const bulkBtn = $('#bulkDeleteAdhBtn'); // Le bouton qui est dans ta toolbar
  const countSpan = $('#bulkAdhCount');

  function updateBulkBtn() {
    const checkedCount = t.querySelectorAll('.adh-checkbox:checked').length;
    countSpan.textContent = checkedCount;
    bulkBtn.style.display = checkedCount > 0 ? 'inline-block' : 'none';
    selectAll.checked = checkedCount === checkboxes.length && checkboxes.length > 0;
  }

  selectAll.onchange = () => {
    checkboxes.forEach(cb => cb.checked = selectAll.checked);
    updateBulkBtn();
  };

  checkboxes.forEach(cb => cb.onchange = updateBulkBtn);

  // Action du bouton de suppression groupée
  bulkBtn.onclick = () => {
    const ids = Array.from(t.querySelectorAll('.adh-checkbox:checked')).map(cb => cb.value);
    confirm(`Supprimer définitivement les ${ids.length} adhérents sélectionnés ?`, async () => {
      toast('Suppression en cours...', 'info');
      // Assure-toi que API.deleteGroupedAdherents est bien défini dans ton fichier api.js
      await API.deleteGroupedAdherents(ids); 
      toast('Adhérents supprimés.');
      adherentsList(); // Recharge la liste
    });
  };

  // --- AUTRES ACTIONS ---
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
    const currTypeCode = adh?.type_code || 'AD';
    const currNiveau = adh?.niveau || 'Adhérent Simple';

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
          <div class="field">
            <label>Type d'adhérent *</label>
            <select id="fTypeSelect" required>
              <option value="Adhérent Simple" data-code="AD" ${currTypeCode === 'AD' && !currNiveau.toLowerCase().includes('gold') ? 'selected' : ''}>Adhérent simple (AD)</option>
              <option value="Adhérent Gold" data-code="AD" ${currTypeCode === 'AD' && currNiveau.toLowerCase().includes('gold') ? 'selected' : ''}>Adhérent gold (AD)</option>
              <option value="Membre Actif" data-code="MA" ${currTypeCode === 'MA' ? 'selected' : ''}>Membre Actif (MA)</option>
              <option value="Conseiller" data-code="CR" ${currTypeCode === 'CR' ? 'selected' : ''}>Conseiller (CR)</option>
            </select>
            <input type="hidden" name="type_code" id="fTypeCode" value="${esc(currTypeCode)}" />
            <input type="hidden" name="niveau" id="fNiveau" value="${esc(currNiveau)}" />
          </div>
          <div class="field"><label>Date d'adhésion *</label><input type="date" name="date_adhesion" id="fDate" value="${esc(adh ? fmtDate(adh.date_adhesion) : today)}" required /></div>
          <div class="field"><label>Année (auto)</label><input id="fAnnee" value="${adh?.annee || new Date(today).getFullYear()}" disabled /></div>
          <div class="field"><label>Photo</label><input type="file" name="photo" accept="image/*" /></div>
          <div class="field full"><label>Description / Notes</label><textarea name="description" rows="3" placeholder="Informations complémentaires, observations…" style="resize:vertical">${esc(adh?.description || '')}</textarea></div>
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
      const w = $('#fWilaya').value, t = $('#fTypeCode').value;
      const an = $('#fDate').value ? new Date($('#fDate').value).getFullYear() : new Date().getFullYear();
      $('#fAnnee').value = an;
      try {
        const r = await API.previewMatricule(w, t, an);
        if (r && r.matricule) {
          $('#matPreview').textContent = r.matricule + (isEdit ? '  (recalculé si modifié)' : '');
        }
      } catch {}
    }
    $('#fDocType').onchange = updateDocHint;
    $('#fWilaya').onchange = refreshMatricule;
    $('#fTypeSelect').onchange = () => {
      const opt = $('#fTypeSelect').options[$('#fTypeSelect').selectedIndex];
      $('#fTypeCode').value = opt.dataset.code;
      $('#fNiveau').value = opt.value;
      refreshMatricule();
    };
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
        ${detailItem('Nom (Français)', a.nom || '—')}
        ${detailItem('Prénom (Français)', a.prenom || '—')}
        ${detailItem('Nom (Arabe)', a.nom_ar || '—')}
        ${detailItem('Prénom (Arabe)', a.prenom_ar || '—')}
        ${detailItem('Téléphone', a.telephone || '—')}
        ${detailItem('NIN', a.nin || '—')}
        ${detailItem(a.doc_type_libelle, a.doc_numero || '—')}
        ${detailItem('Wilaya', a.wilaya_nom)}
        ${detailItem("Date d'adhésion", fmtDate(a.date_adhesion))}
        ${detailItem('Année', a.annee)}
      </div>
      ${a.description ? `<div class="panel" style="margin-top:14px">
        <div class="panel-head"><h3>📝 Description / Notes</h3></div>
        <div style="line-height:1.6;white-space:pre-wrap">${esc(a.description)}</div>
      </div>` : ''}
      <div class="modal-foot">
        <button class="btn btn-ghost" id="dDossier">📄 Dossier à remplir</button>
        <button class="btn btn-ghost" id="dCarte">📇 Carte (recto/verso)</button>
        <button class="btn btn-dark" id="dEdit">✎ Modifier</button>
        <button class="btn btn-gold" id="dClose">Fermer</button>
      </div>`, true);

    if (a.photo) API.fileUrl(a.photo).then((url) => { $('#detailPhoto').innerHTML = `<img src="${url}" class="profile-photo" />`; }).catch(() => {});
    $('#dClose').onclick = closeModal;
    $('#dDossier').onclick = () => downloadDossier(a.id);
    $('#dCarte').onclick = () => downloadCarte(a.id, a.matricule);
    $('#dEdit').onclick = () => adherentForm(a, () => { closeModal(); adherentsList(); });
  }

  function detailItem(lbl, val) {
    return `<div class="detail-item"><div class="d-lbl">${esc(lbl)}</div><div class="d-val">${esc(val)}</div></div>`;
  }

  function downloadDossier(id) {
    try {
      const win = window.open('/api/adherents/' + id + '/dossier?token=' + API.getToken(), '_blank');
      if (!win) toast('Autorisez les pop-ups pour afficher le dossier.', 'error');
    } catch { toast('Impossible d\'ouvrir le dossier.', 'error'); }
  }

  function downloadCarte(id, matricule) {
    try {
      const win = window.open('/api/adherents/' + id + '/carte?token=' + API.getToken(), '_blank');
      if (!win) toast('Autorisez les pop-ups pour afficher la carte.', 'error');
    } catch { toast('Impossible d\'ouvrir la carte.', 'error'); }
  }

/* ============ DEMANDES ============ */

  async function demandesList() {
    const c = container();
    if (!['admin', 'president'].includes(ROLE)) {
      c.innerHTML = UI.emptyState('🔒', 'Accès réservé au Président et à l\'Administrateur.');
      return;
    }
    const types = (REF.typesDemande || []);
    c.innerHTML = `
      <div class="toolbar" style="flex-wrap: wrap; gap: 10px;">
        <input type="search" id="demSearch" placeholder="Rechercher (objet, numéro, nom, matricule, email)…" />
        <select id="demStatut"><option value="">Tous statuts</option>${REF.statutsDemande.map((s) => `<option>${esc(s)}</option>`).join('')}</select>
        <select id="demPriorite"><option value="">Toutes priorités</option>${REF.priorites.map((p) => `<option>${esc(p)}</option>`).join('')}</select>
        <select id="demWilaya"><option value="">Toutes wilayas</option>${REF.wilayas.map((w) => `<option value="${w.code}">${w.code} — ${esc(w.nom)}</option>`).join('')}</select>
        <select id="demType"><option value="">Tous types</option>${types.map((t) => `<option>${esc(t)}</option>`).join('')}</select>
        <button class="btn btn-dark" id="refreshDemBtn" title="Rafraîchir">⟳ Rafraîchir</button>
        <button class="btn btn-danger" id="bulkDeleteDemBtn" style="display: none;">✕ Supprimer la sélection (<span id="bulkCount">0</span>)</button>
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
      updateBulkButton(); // Réinitialise le bouton après chargement
    }

    // Gestion du bouton de suppression en masse
    function updateBulkButton() {
      const checkedBoxes = document.querySelectorAll('.dem-checkbox:checked');
      const bulkBtn = $('#bulkDeleteDemBtn');
      const bulkCount = $('#bulkCount');
      
      if (checkedBoxes.length > 0) {
        bulkCount.textContent = checkedBoxes.length;
        bulkBtn.style.display = 'inline-block';
      } else {
        bulkBtn.style.display = 'none';
      }
    }

    // Clic sur le bouton de suppression en masse
    $('#bulkDeleteDemBtn').onclick = () => {
      const checkedBoxes = document.querySelectorAll('.dem-checkbox:checked');
      const idsToDelete = Array.from(checkedBoxes).map(cb => cb.value);

      confirm(`Supprimer ces ${idsToDelete.length} demandes définitivement ?`, async () => {
        try {
          // Boucle asynchrone pour tout supprimer
          await Promise.all(idsToDelete.map(id => API.deleteDemande(id)));
          toast(`${idsToDelete.length} demandes supprimées avec succès.`);
          load();
        } catch (err) {
          toast('Erreur lors de la suppression groupée : ' + err.message, 'error');
        }
      });
    };

    // Exposer updateBulkButton globalement ou l'attacher aux événements dans renderDemTable
    c.addEventListener('change', (e) => {
      if (e.target.classList.contains('dem-checkbox') || e.target.id === 'selectAllDem') {
        updateBulkButton();
      }
    });

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
        <th width="40"><input type="checkbox" id="selectAllDem" /></th>
        <th>Numéro</th><th>Nom</th><th>Prénom</th><th>Wilaya</th>
        <th>Date & Heure de création</th><th>Statut</th><th></th>
      </tr></thead><tbody>
      ${list.map((d) => `<tr>
        <td><input type="checkbox" class="dem-checkbox" value="${d.id}" /></td>
        
        <td>
        <span class="mono" style="font-weight:bold; color:var(--gold); font-size: 13px;">
          ${esc(d.numero || '—')}
        </span>
      </td>
        <td class="cell-strong">${esc(d.nom)}</td>
        <td>${esc(d.prenom)}</td>
        <td>${esc(d.wilaya_nom || d.wilaya_code || '—')}</td>
        <td class="muted">${esc((d.created_at || '').replace('T', ' ').slice(0, 16))}</td>
        <td>${UI.statutTag(d.statut)}</td>
        <td><div class="row-actions">
          <button class="btn btn-dark btn-sm" data-view="${d.id}">Traiter</button>
          <button class="btn btn-danger btn-sm" data-del="${d.id}">✕</button>
        </div></td>
      </tr>`).join('')}
      </tbody></table></div>`;

    // Logique Tout Sélectionner / Tout Désélectionner
    const selectAll = $('#selectAllDem');
    const checkboxes = t.querySelectorAll('.dem-checkbox');

    selectAll.onchange = () => {
      checkboxes.forEach(cb => cb.checked = selectAll.checked);
    };

    t.querySelectorAll('[data-view]').forEach((b) => b.onclick = () => demandeDetail(b.dataset.view));
    t.querySelectorAll('[data-del]').forEach((b) => b.onclick = () => {
      confirm('Supprimer cette demande ?', async () => {
        await API.deleteDemande(b.dataset.del); toast('Demande supprimée.'); demandesList();
      });
    });
  }
  /* ----- Détail Demande ----- */
  async function demandeDetail(id) {
    const d = await API.demande(id);
    const piecesHtml = d.pieces && d.pieces.length
      ? d.pieces.map((p) => `<button class="btn btn-dark btn-sm" data-file="${esc(p.filename)}">📎 ${esc(p.original_name || 'Pièce')}</button>`).join(' ')
      : '<span class="muted">Aucune pièce jointe.</span>';

    openModal('Demande ' + d.numero, `
      <div class="detail-grid" style="margin-bottom:18px">
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
      
      <div class="panel" style="margin-top:18px">
        <div class="panel-head"><h3>Traitement</h3></div>
        <div class="form-grid">
          <div class="field"><label>Statut</label><select id="dStatut">${REF.statutsDemande.map((s) => `<option ${s === d.statut ? 'selected' : ''}>${esc(s)}</option>`).join('')}</select></div>
          <div class="field"><label>Priorité</label><select id="dPriorite">${REF.priorites.map((p) => `<option ${p === d.priorite ? 'selected' : ''}>${esc(p)}</option>`).join('')}</select></div>
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
    
    if ($('#demCloturer')) {
      $('#demCloturer').onclick = async () => {
        await API.cloturerDemande(d.id); 
        toast('Demande clôturée.'); 
        closeModal(); 
        demandesList();
      };
    }

    $('#demSave').onclick = async () => {
      try {
        await API.updateDemande(d.id, {
          statut: $('#dStatut').value, 
          priorite: $('#dPriorite').value
        });
        toast('Demande mise à jour avec succès.'); 
        closeModal(); 
        demandesList();
      } catch (err) {
        toast('Erreur lors de la mise à jour : ' + err.message, 'error');
      }
    };
  }

/* ============ GESTION DOCUMENTAIRE (SUPPRESSION PAR ADHERENT_ID) ============ */
async function documentsList() {
  const c = container();
  c.innerHTML = `
    <div class="toolbar" style="flex-wrap: wrap; gap: 10px; align-items: center;">
      <input type="search" id="docSearch" placeholder="Rechercher (nom, prénom, matricule)…" />
      <select id="docWilaya">
        <option value="">Toutes wilayas</option>
        ${REF.wilayas.map((w) => `<option value="${w.code}">${w.code} — ${esc(w.nom)}</option>`).join('')}
      </select>
      <button class="btn btn-dark" id="refreshDocsBtn" title="Rafraîchir">⟳</button>
      
      <button class="btn btn-danger" id="deleteBulkBtn" style="display: none; margin-left: auto;">
        ✕ Supprimer la sélection (<span id="selectedCount">0</span>)
      </button>
    </div>
    <div id="docTable"><div class="muted">Chargement de la liste des adhérents…</div></div>`;

  let currentFilteredList = [];

  async function load() {
    try {
      const liste = await API.adherentsStatut();
      renderDocTable(liste);
    } catch (err) {
      $('#docTable').innerHTML = `<div class="error">Erreur : ${err.message}</div>`;
    }
  }

  function renderDocTable(liste) {
    const t = $('#docTable');
    if (!liste.length) { t.innerHTML = UI.emptyState('👥', 'Aucun adhérent trouvé.'); return; }

    const searchQuery = $('#docSearch').value.toLowerCase().trim();
    const selectedWilaya = $('#docWilaya').value;

    currentFilteredList = liste.filter(a => {
      const matchSearch = `${a.matricule || ''} ${a.nom || ''} ${a.prenom || ''}`.toLowerCase().includes(searchQuery);
      const matchWilaya = !selectedWilaya || a.wilaya_code === selectedWilaya;
      return matchSearch && matchWilaya;
    });

    t.innerHTML = `
      <div class="table-wrap">
        <table class="data">
          <thead>
            <tr>
              <th width="40" style="text-align:center;">
                <input type="checkbox" id="selectAllDocs" />
              </th>
              <th>Matricule</th>
              <th>Nom & Prénom</th>
              <th>Dernière fusion</th>
              <th width="200" style="text-align:right;">Fichier complet</th>
            </tr>
          </thead>
          <tbody>
            ${currentFilteredList.map((a) => {
              const hasFile = !!a.filename;
              const dateAffichage = a.updated_at ? esc(a.updated_at.slice(0, 10)) : '—';
              
              return `
                <tr>
                  <td style="text-align:center;">
                    <input type="checkbox" class="doc-checkbox" value="${a.adherent_id}" ${!hasFile ? 'disabled style="opacity:0.3;"' : ''} />
                  </td>
                  <td><span class="mono" style="font-weight:bold; color:var(--gold);">${esc(a.matricule || '—')}</span></td>
                  <td class="cell-strong">${esc(a.prenom)} ${esc(a.nom)}</td>
                  <td class="muted">${hasFile ? dateAffichage : '—'}</td>
                  <td>
                    <div class="row-actions" style="justify-content: flex-end; gap:8px;">
                      <input type="file" id="fileInput-${a.adherent_id}" style="display:none;" accept=".pdf" multiple />
                      
                      <button class="btn btn-dark btn-sm" onclick="document.getElementById('fileInput-${a.adherent_id}').click()">
                        📎 Fusionner
                      </button>
                      
                      <button class="btn btn-gold btn-sm" data-file="${esc(a.filename || '')}" ${!hasFile ? 'disabled style="opacity:0.5;"' : ''}>
                        👁 Ouvrir
                      </button>
                    </div>
                  </td>
                </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>`;

    const selectAllCheckbox = $('#selectAllDocs');
    const checkboxes = t.querySelectorAll('.doc-checkbox:not([disabled])');
    const bulkBtn = $('#deleteBulkBtn');
    const countSpan = $('#selectedCount');

    function updateBulkButtonVisibility() {
      const checkedBoxes = t.querySelectorAll('.doc-checkbox:checked');
      countSpan.textContent = checkedBoxes.length;
      bulkBtn.style.display = checkedBoxes.length > 0 ? 'inline-block' : 'none';
    }

    if (selectAllCheckbox) {
      selectAllCheckbox.onchange = () => {
        checkboxes.forEach(cb => cb.checked = selectAllCheckbox.checked);
        updateBulkButtonVisibility();
      };
    }

    checkboxes.forEach(cb => {
      cb.onchange = () => {
        const allChecked = t.querySelectorAll('.doc-checkbox:not([disabled]):checked').length === checkboxes.length;
        if (selectAllCheckbox) selectAllCheckbox.checked = allChecked;
        updateBulkButtonVisibility();
      };
    });

    // --- EVENEMENT : SUPPRESSION GROUPÉE SIMPLIFIÉE & SÉCURISÉE ---
    bulkBtn.onclick = () => {
      const checkedBoxes = t.querySelectorAll('.doc-checkbox:checked');
      const idsToDelete = Array.from(checkedBoxes).map(cb => cb.value);
      
      if (!idsToDelete.length) return;

      confirm(`Détacher et supprimer définitivement les fichiers fusionnés pour ces ${idsToDelete.length} adhérent(s) ?`, async () => {
        try {
          toast('Suppression en cours...', 'info');
          
          // L'appel à l'API va lever une exception automatiquement si le serveur renvoie un code 500 ou 400
          await API.deleteGroupedDocuments(idsToDelete);
          
          // Si on arrive ici, c'est que la requête s'est déroulée sans erreur (Statut 200/204)
          toast('Dossiers supprimés avec succès.');
          load(); // Recharge le tableau immédiatement
          
        } catch (err) {
          // Affiche l'erreur réelle renvoyée par Express si ça échoue
          toast(`Échec de la suppression : ${err.message}`, 'error');
        }
      });
    };

    // --- EVENEMENT : FUSION ---
    currentFilteredList.forEach(a => {
      const input = document.getElementById(`fileInput-${a.adherent_id}`);
      if (input) {
        input.onchange = async () => {
          if (!input.files.length) return;
          const formData = new FormData();
          for (let i = 0; i < input.files.length; i++) {
            formData.append('fichiers', input.files[i]);
          }
          toast(`Fusion en cours...`, 'info');
          try {
            await API.fusionnerDossier(a.adherent_id, formData);
            toast('Documents fusionnés avec succès !');
            load();
          } catch (err) {
            toast(err.message, 'error');
          }
        };
      }
    });

    // --- EVENEMENT : OUVRIR ---
    t.querySelectorAll('[data-file]').forEach((b) => b.onclick = async () => {
      const relPath = b.dataset.file;
      if (!relPath) return;
      try { 
        const cleanPath = relPath.replace(/^uploads\//, '');
        window.open(await API.fileUrl(cleanPath), '_blank'); 
      } catch { 
        toast('Fichier introuvable.', 'error'); 
      }
    });
  }

  let timer;
  $('#docSearch').oninput = () => { clearTimeout(timer); timer = setTimeout(load, 280); };
  $('#docWilaya').onchange = load;
  $('#refreshDocsBtn').onclick = () => { load(); toast('Liste actualisée.'); };

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

  /* ============ AGENT DE SAISIE ============ */
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

  /* ============ COMPTES UTILISATEURS ============ */
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
