import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { get, query, run } from '../db.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { uploadPhoto } from '../middleware/upload.js';
import { generateMatricule, buildMatricule, nextNumOrdre } from '../matricule.js';
import { wilayaNom, wilayaNomAr, docTypeLibelle, carteInfo, TYPES, NIVEAUX, DOC_TYPES } from '../data/wilayas.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CARTE_DIR = path.join(__dirname, '..', '..', 'frontend', 'assets', 'carte');
const MODELS_DIR = path.join(CARTE_DIR, 'models');

function getDynamicDataUri(fileName) {
  try {
    const filePath = path.join(MODELS_DIR, fileName);
    if (fs.existsSync(filePath)) {
      return 'data:image/png;base64,' + fs.readFileSync(filePath).toString('base64');
    }
  } catch (e) {
    console.error("Erreur lecture fichier modèle :", fileName, e);
  }
  return '';
}

const router = express.Router();

function enrich(a) {
  if (!a) return a;
  const type = TYPES.find((t) => t.code === a.type_code);
  return {
    ...a,
    wilaya_nom: wilayaNom(a.wilaya_code),
    wilaya_nom_ar: wilayaNomAr(a.wilaya_code),
    type_libelle: type ? type.libelle : a.type_code,
    doc_type_libelle: docTypeLibelle(a.doc_type),
  };
}

function validate(b, { partial = false } = {}) {
  const errors = [];
  const req = (v) => v !== undefined && v !== null && String(v).trim() !== '';

  if (!partial || b.nom !== undefined) if (!req(b.nom)) errors.push('Le nom est obligatoire.');
  if (!partial || b.prenom !== undefined) if (!req(b.prenom)) errors.push('Le prénom est obligatoire.');
  if (!partial || b.nom_ar !== undefined) if (!req(b.nom_ar)) errors.push('Le nom en arabe est obligatoire.');
  if (!partial || b.prenom_ar !== undefined) if (!req(b.prenom_ar)) errors.push('Le prénom en arabe est obligatoire.');

  if (!partial || b.telephone !== undefined) {
    if (!req(b.telephone)) errors.push('Le téléphone est obligatoire.');
  }
  if (!partial || b.nin !== undefined) {
    if (!req(b.nin)) errors.push('Le NIN est obligatoire.');
  }
  if (!partial || b.wilaya_code !== undefined) if (!req(b.wilaya_code)) errors.push('La wilaya est obligatoire.');
  if (!partial || b.type_code !== undefined) if (!req(b.type_code)) errors.push("Le type d'adhérent est obligatoire.");
  if (!partial || b.date_adhesion !== undefined) if (!req(b.date_adhesion)) errors.push("La date d'adhésion est obligatoire.");

  return errors;
}

async function checkUnique(b, excludeId = null) {
  const conflicts = [];
  const checks = [
    ['nin', b.nin, 'Ce NIN'],
    ['telephone', b.telephone, 'Ce téléphone']
  ];
  for (const [col, val, label] of checks) {
    if (!val) continue;
    let sql = `SELECT id FROM adherents WHERE ${col} = ?`;
    const params = [val];
    if (excludeId) { sql += ' AND id <> ?'; params.push(excludeId); }
    const row = await get(sql, params);
    if (row) conflicts.push(`${label} est déjà utilisé.`);
  }
  return conflicts;
}

async function assureMatricules() {
  try {
    const rows = await query('SELECT * FROM adherents WHERE matricule IS NULL OR matricule = ""');
    for (const a of rows) {
      const annee = a.date_adhesion ? new Date(a.date_adhesion).getFullYear() : new Date().getFullYear();
      const w = a.wilaya_code || '16';
      const t = a.type_code || 'AD';
      const { matricule, num_ordre } = await generateMatricule({ wilaya_code: w, type_code: t, annee });
      await run('UPDATE adherents SET matricule=?, num_ordre=?, annee=? WHERE id=?', [matricule, num_ordre, annee, a.id]);
    }
  } catch (err) { console.error(err); }
}

router.get('/', authenticate, authorize('admin', 'president'), async (req, res) => {
  try {
    await assureMatricules();
    const { q, wilaya, type } = req.query;
    let sql = 'SELECT * FROM adherents WHERE 1=1';
    const params = [];
    if (q) {
      sql += ' AND (nom LIKE ? OR prenom LIKE ? OR matricule LIKE ? OR telephone LIKE ?)';
      const like = `%${q}%`;
      params.push(like, like, like, like);
    }
    if (wilaya) { sql += ' AND wilaya_code = ?'; params.push(wilaya); }
    if (type) { sql += ' AND type_code = ?'; params.push(type); }
    sql += ' ORDER BY created_at DESC';
    const rows = await query(sql, params);
    res.json(rows.map(enrich));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/:id', authenticate, authorize('admin', 'president'), async (req, res) => {
  try {
    const a = await get('SELECT * FROM adherents WHERE id = ?', [req.params.id]);
    if (!a) return res.status(404).json({ error: 'Adhérent introuvable.' });
    res.json(enrich(a));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ROUTE CORRIGÉE ICI : SÉCURISATION DU RETOUR DU MATRICULE
router.post('/', authenticate, authorize('admin', 'president', 'saisie'), uploadPhoto.single('photo'), async (req, res) => {
  try {
    const b = req.body;
    const errors = validate(b);
    if (errors.length) return res.status(400).json({ error: errors.join(' ') });
    const conflicts = await checkUnique(b);
    if (conflicts.length) return res.status(409).json({ error: conflicts.join(' ') });

    const annee = new Date(b.date_adhesion).getFullYear();
    const generated = await generateMatricule({
      wilaya_code: b.wilaya_code, 
      type_code: b.type_code, 
      annee: annee,
    });
    
    const matricule = generated.matricule;
    const num_ordre = generated.num_ordre;
    const photo = req.file ? `photos/${req.file.filename}` : null;

    const result = await run(
      `INSERT INTO adherents (matricule, nom, prenom, nom_ar, prenom_ar, telephone, nin, doc_type, doc_numero, photo, wilaya_code, type_code, niveau, num_ordre, annee, date_adhesion)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [matricule, b.nom.trim(), b.prenom.trim(), b.nom_ar.trim(), b.prenom_ar.trim(), b.telephone.trim(), b.nin.trim(), b.doc_type || 'CNI', b.doc_numero ? b.doc_numero.trim() : '',
        photo, b.wilaya_code, b.type_code, b.niveau || 'National', num_ordre, annee, b.date_adhesion]
    );

    // Sécurité de récupération de l'ID inséré (selon les structures de db.js)
    const targetId = result?.insertId || result?.id || result;
    let created = null;
    
    if (targetId) {
      created = await get('SELECT * FROM adherents WHERE id = ?', [targetId]);
    }

    // Si la base de données n'a pas pu être lue immédiatement, on crée l'objet manuellement pour le front
    if (!created) {
      created = { 
        id: targetId, matricule, nom: b.nom, prenom: b.prenom, nom_ar: b.nom_ar, prenom_ar: b.prenom_ar,
        telephone: b.telephone, nin: b.nin, doc_type: b.doc_type, doc_numero: b.doc_numero, photo,
        wilaya_code: b.wilaya_code, type_code: b.type_code, niveau: b.niveau, num_ordre, annee, date_adhesion: b.date_adhesion
      };
    }

    // On enrichit et on force la présence du matricule généré tout frais
    const finalAdherent = enrich(created);
    finalAdherent.matricule = matricule; 

    res.status(201).json({ adherent: finalAdherent });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id', authenticate, authorize('admin', 'president'), uploadPhoto.single('photo'), async (req, res) => {
  try {
    const a = await get('SELECT * FROM adherents WHERE id = ?', [req.params.id]);
    if (!a) return res.status(404).json({ error: 'Adhérent introuvable.' });
    const b = req.body;
    const errors = validate(b);
    if (errors.length) return res.status(400).json({ error: errors.join(' ') });

    const photo = req.file ? `photos/${req.file.filename}` : a.photo;
    const annee = new Date(b.date_adhesion).getFullYear();

    let matricule = a.matricule;
    let num_ordre = a.num_ordre;
    
    if (!matricule || b.wilaya_code !== a.wilaya_code || b.type_code !== a.type_code || annee !== a.annee) {
      const gen = await generateMatricule({ wilaya_code: b.wilaya_code, type_code: b.type_code, annee });
      matricule = gen.matricule; 
      num_ordre = gen.num_ordre;
    }

    await run(
      `UPDATE adherents SET matricule=?, nom=?, prenom=?, nom_ar=?, prenom_ar=?, telephone=?, nin=?, doc_type=?, doc_numero=?, photo=?,
       wilaya_code=?, type_code=?, niveau=?, num_ordre=?, annee=?, date_adhesion=? WHERE id=?`,
      [matricule, b.nom.trim(), b.prenom.trim(), b.nom_ar.trim(), b.prenom_ar.trim(), b.telephone.trim(), b.nin.trim(), b.doc_type || 'CNI', b.doc_numero ? b.doc_numero.trim() : '',
        photo, b.wilaya_code, b.type_code, b.niveau || 'National', num_ordre, annee, b.date_adhesion, a.id]
    );
    const upd = await get('SELECT * FROM adherents WHERE id = ?', [a.id]);
    if (upd) upd.matricule = matricule;
    res.json({ adherent: enrich(upd) });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', authenticate, authorize('admin', 'president'), async (req, res) => {
  try {
    await run('DELETE FROM adherents WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/:id/carte', authenticate, authorize('admin', 'president'), async (req, res) => {
  try {
    let a = await get('SELECT * FROM adherents WHERE id = ?', [req.params.id]);
    if (!a) return res.status(404).json({ error: 'Adhérent introuvable.' });
    
    if (!a.matricule || a.matricule === "") {
      const annee = a.date_adhesion ? new Date(a.date_adhesion).getFullYear() : new Date().getFullYear();
      const gen = await generateMatricule({ wilaya_code: a.wilaya_code || '16', type_code: a.type_code || 'AD', annee });
      a.matricule = gen.matricule;
      a.num_ordre = gen.num_ordre;
      a.annee = annee;
      await run('UPDATE adherents SET matricule=?, num_ordre=?, annee=? WHERE id=?', [gen.matricule, gen.num_ordre, annee, a.id]);
    }

    const ad = enrich(a);
    const info = carteInfo(a);

    let photoDataUri = '';
    if (a.photo) {
      const photoPath = path.join(__dirname, '..', '..', 'uploads', a.photo);
      if (fs.existsSync(photoPath)) {
        try {
          const ext = (path.extname(photoPath).slice(1) || 'png').toLowerCase();
          photoDataUri = `data:image/${ext === 'jpg' ? 'jpeg' : ext};base64,` + fs.readFileSync(photoPath).toString('base64');
        } catch {}
      }
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(renderCarteHTML(a, ad, info, photoDataUri));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function formatDateAdhesion(d) {
  if (!d) return '----/--/--';
  const s = (d instanceof Date) ? d.toISOString() : String(d);
  return s.slice(0, 10).replace(/-/g, '/');
}

function getTypeAr(code) {
  if (!code) return 'منخرط';
  const c = String(code).toUpperCase();
  if (c === 'ACTIF' || c === 'EFF') return 'عضو فعال';
  if (c === 'CONSULTANT' || c === 'CON') return 'مستشار';
  return 'منخرط'; 
}

function renderCarteHTML(a, ad, info, photoDataUri) {
  const modeletype = String(info.modele || '').toLowerCase();
  const qualiteText = String(info.qualiteAr || '');
  const isGold = (modeletype === 'gold' || qualiteText.includes('مسؤول'));
  
  const modelP1 = isGold ? getDynamicDataUri('gold_p1.png')   : getDynamicDataUri('simple_p1.png');
  const modelP2 = isGold ? getDynamicDataUri('gold_p2.png')   : getDynamicDataUri('simple_p2.png');
  
  let cachetUri = '';
  try {
    const cp = path.join(CARTE_DIR, 'cachet.png');
    if (fs.existsSync(cp)) cachetUri = 'data:image/png;base64,' + fs.readFileSync(cp).toString('base64');
  } catch {}

  const nomAr    = a.nom_ar    || a.nom    || '';
  const prenomAr = a.prenom_ar || a.prenom || '';
  const typeAr   = getTypeAr(a.type_code);

  const matricule = a.matricule || ad.matricule || '';
  const dateAdh = formatDateAdhesion(a.date_adhesion);

  const photoBlock = photoDataUri
    ? `<img class="photo" src="${photoDataUri}" alt="photo" />`
    : `<div class="photo photo-empty">${esc(((a.prenom || '')[0] || '') + ((a.nom || '')[0] || ''))}</div>`;

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8" />
<title>Carte ${esc(matricule)}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@700&family=Cairo:wght@600;700;900&display=swap');

  :root { --cw: 85.6mm; --ch: 54mm; }
  @page { size: 85.6mm 54mm; margin: 0; }
  
  html, body { background: transparent !important; margin: 0; padding: 0; }
  body { background:#555; font-family: 'Cairo', sans-serif; }
  
  * { box-sizing: border-box; margin: 0; padding: 0;
      -webkit-print-color-adjust: exact; print-color-adjust: exact; }

  .toolbar { text-align:center; padding:15px; direction:ltr; position:relative; z-index:20; }
  .toolbar button { background:#c39b2e; color:#fff; border:none; padding:10px 20px; border-radius:5px; font-weight:700; cursor:pointer; margin:0 5px; }

  .cards { display:flex; flex-wrap:wrap; gap:20px; justify-content:center; padding-bottom:30px; background:transparent; }
  .card { width:var(--cw); height:var(--ch); position:relative; background:transparent !important; overflow:hidden; box-shadow:0 5px 15px rgba(0,0,0,.3); }
  .bg { position:absolute; inset:0; width:100%; height:100%; object-fit:fill; z-index:1; pointer-events:none; }

  .photo-wrap {
    position:absolute;
    left:1.23%; top:33.50%;
    width:25.86%; height:48.20%;
    z-index:3;
  }
  .photo { width:100%; height:100%; object-fit:cover; display:block; }
  .photo-empty { display:flex; align-items:center; justify-content:center; color:#fff; font-size:6mm; background:#9a7b22; }

  .cachet {
    position:absolute;
    left:14.50%; top:51.00%;
    width:20.13%; height:31.53%;
    z-index:4;
    pointer-events:none;
  }

  .txt {
    position:absolute; z-index:5;
    color:#232323; font-weight: 900;
    font-family: 'Cairo', 'Amiri', serif;
    direction:rtl; text-align:right;
    white-space:nowrap;
    line-height:1;
  }
  
  .t-nom    { right:13.30%; top:40.85%; font-size:2.6mm; }
  .t-prenom { right:13.78%; top:48.30%; font-size:2.6mm; }
  .t-type   { right:13.78%; top:55.55%; font-size:2.8mm; font-weight:900; color:#232323; }

  .t-mat {
    position:absolute; z-index:5;
    right:25.20%; top:69.30%;
    font-size:2.6mm; font-weight: 2000; color:#1a1a1a;
    text-align:right;
    font-family: "Arial Black", "Impact", "Arial", sans-serif;
    white-space:nowrap;
  }

  .v-date {
    position:absolute; z-index:5;
    left:50.77%; top:22.47%;
    width:19.75%;
    display:flex; align-items:center; justify-content:center;
    color:#222222; font-weight:900;
    font-family: 'Cairo', 'Amiri', serif;
    font-size:2.8mm; line-height:1;
    direction:ltr; white-space:nowrap;
  }

  @media print {
    html, body { background:transparent !important; }
    .toolbar { display:none !important; }
    .cards { display:block; gap:0; padding:0; margin:0; }
    .card { box-shadow:none; margin:0; page-break-after:always; break-after:page; background:transparent !important; }
    .card:last-child { page-break-after:auto; break-after:auto; }
  }
</style>
</head>
<body>
  <div class="toolbar">
    <button onclick="window.print()">🖨️ Imprimer la carte</button>
    <button onclick="window.close()" style="background:#666">Fermer</button>
  </div>

  <div class="cards">
    <div class="card recto">
      <img class="bg" src="${modelP1}" alt="Recto" />
      <div class="photo-wrap">${photoBlock}</div>
      ${cachetUri ? `<img class="cachet" src="${cachetUri}" alt="Cachet" />` : ''}
      <div class="txt t-nom">${esc(nomAr)}</div>
      <div class="txt t-prenom">${esc(prenomAr)}</div>
      <div class="txt t-type">${esc(typeAr)}</div>
      <div class="t-mat">${esc(matricule)}</div>
    </div>

    <div class="card verso">
      <img class="bg" src="${modelP2}" alt="Verso" />
      <div class="v-date">${esc(dateAdh)}</div>
    </div>
  </div>
</body>
</html>`;
}

export default router;