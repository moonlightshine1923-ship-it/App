import express from 'express';
import { get, query, run } from '../db.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { uploadDoc } from '../middleware/upload.js';
import { STATUTS_DEMANDE, PRIORITES, TYPES_DEMANDE, WILAYAS, wilayaNom } from '../data/wilayas.js';
import { sendDemandeEmail } from '../mailer.js';

const router = express.Router();

async function numeroDemande() {
  const year = new Date().getFullYear();
  const row = await get("SELECT COUNT(*) AS c FROM demandes WHERE numero LIKE ?", [`DEM-${year}-%`]);
  const n = String((row.c || 0) + 1).padStart(4, '0');
  return `DEM-${year}-${n}`;
}

function enrichDemande(d) {
  if (!d) return d;
  return {
    ...d,
    wilaya_nom: d.wilaya_code ? wilayaNom(d.wilaya_code) : null,
  };
}

async function enrich(d) {
  if (!d) return d;
  const pieces = await query('SELECT * FROM demande_pieces WHERE demande_id = ?', [d.id]);
  return { ...enrichDemande(d), pieces };
}

// ===== Dépôt PUBLIC depuis le site web (sans authentification) =====
// Formulaire : nom, prénom, wilaya, type_demande, email, téléphone, matricule, objet,
// description, priorité, fichiers.
router.post('/public', uploadDoc.array('pieces', 5), async (req, res) => {
  try {
    const b = req.body;
    if (!b.nom || !b.prenom || !b.objet) {
      return res.status(400).json({ error: 'Nom, prénom et objet sont obligatoires.' });
    }
    const priorite = PRIORITES.includes(b.priorite) ? b.priorite : 'Normale';
    const wilaya_code = (b.wilaya_code && WILAYAS.find((w) => w.code === b.wilaya_code)) ? b.wilaya_code : null;
    const type_demande = (b.type_demande && TYPES_DEMANDE.includes(b.type_demande)) ? b.type_demande : null;
    const numero = await numeroDemande();

    // Tente d'associer à un adhérent connu via le matricule
    let adherent_id = null;
    if (b.matricule) {
      const adh = await get('SELECT id FROM adherents WHERE matricule = ?', [b.matricule.trim()]);
      if (adh) adherent_id = adh.id;
    }

    const result = await run(
      `INSERT INTO demandes (numero, nom, prenom, email, telephone, wilaya_code, type_demande,
          matricule, objet, description, priorite, statut, source, adherent_id)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        numero,
        b.nom.trim(),
        b.prenom.trim(),
        b.email ? b.email.trim() : null,
        b.telephone ? b.telephone.trim() : null,
        wilaya_code,
        type_demande,
        b.matricule ? b.matricule.trim() : null,
        b.objet.trim(),
        b.description || null,
        priorite,
        'En attente',
        'site',
        adherent_id,
      ]
    );
    const demandeId = result.insertId;

    const pieces = [];
    if (req.files && req.files.length) {
      for (const f of req.files) {
        await run('INSERT INTO demande_pieces (demande_id, filename, original_name) VALUES (?,?,?)',
          [demandeId, `documents/${f.filename}`, f.originalname]);
        pieces.push({ filename: `documents/${f.filename}`, original_name: f.originalname });
      }
    }

    const demande = await get('SELECT * FROM demandes WHERE id = ?', [demandeId]);
    let emailSent = true;
    try {
      const r = await sendDemandeEmail(demande, pieces);
      emailSent = !!(r && r.sent);
    } catch (mailErr) {
      emailSent = false;
      console.warn('  ⚠️ Envoi email demande échoué :', mailErr.message);
    }
    res.status(201).json({ ok: true, numero, emailSent });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ===== Consultation / gestion (admin & président uniquement) =====
router.get('/', authenticate, authorize('admin', 'president'), async (req, res) => {
  try {
    const { statut, priorite, wilaya, type_demande, q } = req.query;
    let sql = 'SELECT * FROM demandes WHERE 1=1';
    const params = [];
    if (statut) { sql += ' AND statut = ?'; params.push(statut); }
    if (priorite) { sql += ' AND priorite = ?'; params.push(priorite); }
    if (wilaya) { sql += ' AND wilaya_code = ?'; params.push(wilaya); }
    if (type_demande) { sql += ' AND type_demande = ?'; params.push(type_demande); }
    if (q) {
      sql += ' AND (objet LIKE ? OR numero LIKE ? OR nom LIKE ? OR prenom LIKE ? OR matricule LIKE ? OR email LIKE ?)';
      const l = `%${q}%`; params.push(l, l, l, l, l, l);
    }
    sql += ' ORDER BY created_at DESC';
    const rows = await query(sql, params);
    const list = [];
    for (const d of rows) list.push(await enrich(d));
    res.json(list);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/:id', authenticate, authorize('admin', 'president'), async (req, res) => {
  try {
    const d = await get('SELECT * FROM demandes WHERE id = ?', [req.params.id]);
    if (!d) return res.status(404).json({ error: 'Demande introuvable.' });
    res.json(await enrich(d));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Mise à jour (statut, priorité, affectation, réponse)
router.patch('/:id', authenticate, authorize('admin', 'president'), async (req, res) => {
  try {
    const d = await get('SELECT * FROM demandes WHERE id = ?', [req.params.id]);
    if (!d) return res.status(404).json({ error: 'Demande introuvable.' });
    const b = req.body;
    if (b.statut && !STATUTS_DEMANDE.includes(b.statut)) return res.status(400).json({ error: 'Statut invalide.' });
    await run(
      "UPDATE demandes SET statut=?, affecte_a=?, reponse=?, priorite=?, updated_at=NOW() WHERE id=?",
      [b.statut ?? d.statut, b.affecte_a ?? d.affecte_a, b.reponse ?? d.reponse,
        (b.priorite && PRIORITES.includes(b.priorite)) ? b.priorite : d.priorite, d.id]
    );
    res.json(await enrich(await get('SELECT * FROM demandes WHERE id = ?', [d.id])));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.patch('/:id/cloturer', authenticate, authorize('admin', 'president'), async (req, res) => {
  try {
    const r = await run("UPDATE demandes SET statut='Clôturée', updated_at=NOW() WHERE id=?", [req.params.id]);
    if (!r.affectedRows) return res.status(404).json({ error: 'Demande introuvable.' });
    res.json(await enrich(await get('SELECT * FROM demandes WHERE id = ?', [req.params.id])));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', authenticate, authorize('admin', 'president'), async (req, res) => {
  try {
    const r = await run('DELETE FROM demandes WHERE id = ?', [req.params.id]);
    if (!r.affectedRows) return res.status(404).json({ error: 'Demande introuvable.' });
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

export default router;
