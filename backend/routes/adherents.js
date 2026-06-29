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
  let tObj = null;
  if (a.type_code === 'AD') {
    const isGold = (a.niveau && a.niveau.toLowerCase().includes('gold'));
    tObj = TYPES.find((t) => t.code === (isGold ? 'AD_gold' : 'AD_simple'));
  } else {
    tObj = TYPES.find((t) => t.realCode === a.type_code || t.code === a.type_code);
  }
  return {
    ...a,
    wilaya_nom: wilayaNom(a.wilaya_code),
    wilaya_nom_ar: wilayaNomAr(a.wilaya_code),
    type_libelle: tObj ? tObj.libelle : a.type_code,
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

router.get('/preview/matricule', authenticate, authorize('admin', 'president', 'saisie'), async (req, res) => {
  try {
    const { wilaya_code, type_code, annee } = req.query;
    const generated = await generateMatricule({
      wilaya_code: wilaya_code || '16',
      type_code: type_code || 'AD',
      annee: annee ? parseInt(annee, 10) : new Date().getFullYear()
    });
    res.json({ matricule: generated.matricule, num_ordre: generated.num_ordre });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

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
    if (type) {
      if (type === 'AD_simple') {
        sql += " AND type_code = 'AD' AND (niveau = 'Adhérent Simple' OR niveau IS NULL OR niveau = '')";
      } else if (type === 'AD_gold') {
        sql += " AND type_code = 'AD' AND (niveau = 'Adhérent Gold' OR niveau = 'Adhérent gold')";
      } else {
        sql += ' AND type_code = ?';
        params.push(type);
      }
    }
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
    const description = b.description ? b.description.trim() : '';

    const result = await run(
      `INSERT INTO adherents (matricule, nom, prenom, nom_ar, prenom_ar, telephone, nin, doc_type, doc_numero, photo, wilaya_code, type_code, niveau, num_ordre, annee, date_adhesion, description)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [matricule, b.nom.trim(), b.prenom.trim(), b.nom_ar.trim(), b.prenom_ar.trim(), b.telephone.trim(), b.nin.trim(), b.doc_type || 'CNI', b.doc_numero ? b.doc_numero.trim() : '',
        photo, b.wilaya_code, b.type_code, b.niveau || 'National', num_ordre, annee, b.date_adhesion, description]
    );

    const targetId = result?.insertId || result?.id || result;
    let created = null;
    
    if (targetId) {
      created = await get('SELECT * FROM adherents WHERE id = ?', [targetId]);
    }

    if (!created) {
      created = { 
        id: targetId, matricule, nom: b.nom, prenom: b.prenom, nom_ar: b.nom_ar, prenom_ar: b.prenom_ar,
        telephone: b.telephone, nin: b.nin, doc_type: b.doc_type, doc_numero: b.doc_numero, photo,
        wilaya_code: b.wilaya_code, type_code: b.type_code, niveau: b.niveau, num_ordre, annee, date_adhesion: b.date_adhesion,
        description: description
      };
    }

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
    const description = b.description !== undefined ? b.description.trim() : a.description;

    let matricule = a.matricule;
    let num_ordre = a.num_ordre;
    
    if (!matricule || b.wilaya_code !== a.wilaya_code || b.type_code !== a.type_code || annee !== a.annee) {
      const gen = await generateMatricule({ wilaya_code: b.wilaya_code, type_code: b.type_code, annee });
      matricule = gen.matricule; 
      num_ordre = gen.num_ordre;
    }

    await run(
      `UPDATE adherents SET matricule=?, nom=?, prenom=?, nom_ar=?, prenom_ar=?, telephone=?, nin=?, doc_type=?, doc_numero=?, photo=?,
       wilaya_code=?, type_code=?, niveau=?, num_ordre=?, annee=?, date_adhesion=?, description=? WHERE id=?`,
      [matricule, b.nom.trim(), b.prenom.trim(), b.nom_ar.trim(), b.prenom_ar.trim(), b.telephone.trim(), b.nin.trim(), b.doc_type || 'CNI', b.doc_numero ? b.doc_numero.trim() : '',
        photo, b.wilaya_code, b.type_code, b.niveau || 'National', num_ordre, annee, b.date_adhesion, description, a.id]
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

router.get('/:id/dossier', authenticate, authorize('admin', 'president', 'saisie'), async (req, res) => {
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

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(renderDossierHTML(a, ad, info));
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
  const typeAr   = info.qualiteAr || getTypeAr(a.type_code);

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
  @import url('https://fonts.googleapis.com/css2?family=Almarai:wght@700;800&family=Cairo:wght@600;700;900&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Mirza:wght@700&family=Cairo:wght@600;700;900&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Adobe+Arabic&family=Cairo:wght@600;700;900&family=Oswald:wght@700&display=swap');
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
    position: absolute; 
    z-index: 5;
    font-family: "Adobe Arabic", "Traditional Arabic", "Simplified Arabic", "Mirza", sans-serif;
    font-weight: 900 !important; 
    color: #000000 !important;   
    font-size: 3.5mm !important; 
    direction: rtl; 
    text-align: right;
    white-space: nowrap;
    line-height: 1;
}
  
  .t-nom    { right:14.45%; top:39.85%; font-size:2.6mm; }
  .t-prenom { right:13.70%; top:46.60%; font-size:2.6mm; }
  .t-type   { right:13.78%; top:54.05%; font-size:2.8mm; font-weight:900; color:#232323; }

 .t-mat {
    position: absolute; 
    z-index: 5;
    right: 25.20%; 
    top: 70.65%;
    font-family: 'Oswald', 'Arial Narrow', sans-serif ;
    font-size: 2.6mm ; 
    font-weight: 700 ;
    color: #1a1a1a ;
    letter-spacing: -0.4px;
    white-space: nowrap;
    line-height: 1;
    display: inline-block;
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
    background: transparent ;
    background-color: transparent ;
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

function renderDossierHTML(a, ad, info) {
  const nomPrenomFr = `${esc(a.prenom)} ${esc(a.nom)}`;
  const nomPrenomAr = `${esc(a.prenom_ar || a.prenom)} ${esc(a.nom_ar || a.nom)}`;
  const telephone = esc(a.telephone || '');
  const description = esc(a.description || ''); // Récupération et sécurisation de la description
  const matricule = esc(a.matricule || ad?.matricule || '');
  const wilayaFr = esc(ad.wilaya_nom || '');
  const wilayaAr = esc(ad.wilaya_nom_ar || ad.wilaya_nom || '');
  const dateAdhFr = formatDateAdhesion(a.date_adhesion);
  const typeMembreFr = esc(ad.type_libelle || '');
  const idNum = esc(a.doc_numero || a.nin || '');
  const rcNum = esc(a.doc_type === 'RC' ? a.doc_numero : '');
  
  let expFr = '----/--/--';
  if (a.date_adhesion) {
    const s = (a.date_adhesion instanceof Date) ? a.date_adhesion.toISOString() : String(a.date_adhesion);
    if (s.length >= 10) {
      const yr = parseInt(s.slice(0, 4), 10);
      if (!isNaN(yr)) {
        expFr = `${yr + 1}${s.slice(4, 10)}`.replace(/-/g, '/');
      }
    }
  }
  
  const todayFr = new Date().toISOString().slice(0, 10);

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8" />
<title>Dossier — ${matricule}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cairo:wght@600;700&family=Segoe+UI:wght@600;700&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { background: #555; font-family: 'Segoe UI', Arial, sans-serif; color: #111; }
  
  .toolbar { text-align: center; padding: 15px; background: #333; color: #fff; position: sticky; top: 0; z-index: 1000; box-shadow: 0 2px 10px rgba(0,0,0,0.5); }
  .toolbar button { background: #c39b2e; color: #fff; border: none; padding: 10px 20px; border-radius: 5px; font-weight: 700; cursor: pointer; margin: 0 5px; font-size: 15px; }
  .toolbar button:hover { opacity: 0.9; }

  .dossier { display: flex; flex-direction: column; align-items: center; gap: 25px; padding: 25px 0; }
  
  @page { size: A4; margin: 0; }
  
  .page {
    width: 210mm;
    height: 297mm;
    position: relative;
    background-color: #fff;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    box-shadow: 0 5px 25px rgba(0,0,0,0.3);
    overflow: hidden;
  }
  
  .p1 { background-image: url('/assets/dossier/page1.png'); }
  .p2 { background-image: url('/assets/dossier/page2.png'); }
  .p3 { background-image: url('/assets/dossier/page3.png'); }

  input[type="text"], input[type="date"], input[type="email"] {
    position: absolute;
    background: rgba(195, 155, 46, 0.14);
    border: 1px dashed rgba(195, 155, 46, 0.7);
    font-family: 'Segoe UI', Arial, sans-serif;
    font-size: 15px;
    font-weight: 700;
    color: #1a1a1a;
    padding: 2px 8px;
    border-radius: 4px;
    z-index: 10;
  }
  input[type="text"]:focus, input[type="date"]:focus, input[type="email"]:focus {
    background: #fff;
    border: 2px solid #c39b2e;
    outline: none;
    box-shadow: 0 0 8px rgba(195,155,46,0.4);
    z-index: 20;
  }
  
  .chk {
    position: absolute;
    width: 18px;
    height: 18px;
    accent-color: #c39b2e;
    cursor: pointer;
    z-index: 10;
  }

  .rtl input[type="text"], .rtl input[type="date"] {
    font-family: 'Cairo', 'Amiri', sans-serif;
    direction: rtl;
    text-align: right;
    font-size: 16px;
  }
  .ltr-f { direction: ltr !important; text-align: left !important; font-family: 'Segoe UI', sans-serif !important; }

  @media print {
    body { background: #fff !important; }
    .toolbar { display: none !important; }
    .dossier { gap: 0; padding: 0; display: block; }
    .page { box-shadow: none; margin: 0; page-break-after: always; break-after: page; }
    input[type="text"], input[type="date"], input[type="email"] {
      background: transparent !important;
      border: none !important;
      box-shadow: none !important;
      padding: 0 4px !important;
      color: #000 !important;
    }
  }
</style>
</head>
<body>
  <div class="toolbar">
    <button onclick="window.print()">🖨️ Imprimer / Enregistrer en PDF</button>
    <button onclick="window.close()" style="background: #666">Fermer</button>
  </div>

  <div class="dossier">
    <div class="page p1">
      <input type="text" style="left:21%; top:16.5%; width:75%; height:2.2%" value="${nomPrenomFr}" />
      <input type="text" style="left:29%; top:19.6%; width:67%; height:2.2%"  />
      <input type="text" style="left:13%; top:22.7%; width:83%; height:2.2%"  />
      <input type="text" style="left:15.5%; top:25.8%; width:31%; height:2.2%" value="${telephone}" />
      
      <input type="text" style="left:57%; top:25.8%; width:41%; height:2.2%" value="${description}" title="Description" />
      
      <input type="checkbox" class="chk" style="left:25.3%; top:30.2%" title="Chèque" />
      <input type="text" style="left:40.5%; top:29.8%; width:14.5%; height:2.0%"  />
      <input type="checkbox" class="chk" style="left:56.5%; top:30.2%" title="Virement" />
      <input type="checkbox" class="chk" style="left:82.5%; top:30.2%" title="Espèce" />

      <input type="text" style="left:20%; top:37.6%; width:35%; height:2.2%" />
      <input type="date" style="left:79.5%; top:37.6%; width:14%; height:2.2%" />
      <input type="text" style="left:14.7%; top:40.7%; width:27%; height:2.2%" value="${esc(a.niveau || '')}" />
      <input type="text" style="left:71%; top:40.7%; width:26%; height:2.2%" value="${rcNum}"  />

      <input type="checkbox" class="chk" style="left:5.2%; top:47.8%" title="SPA" />
      <input type="checkbox" class="chk" style="left:5.2%; top:50.1%" title="SARL" />
      <input type="checkbox" class="chk" style="left:5.2%; top:52.4%" title="EURL" />
      <input type="checkbox" class="chk" style="left:5.2%; top:54.7%" title="GPT" />
      <input type="checkbox" class="chk" style="left:21.3%; top:47.8%" title="Personne Physique" checked />

      <input type="checkbox" class="chk" style="left:38.5%; top:47.8%" title="Commerce" />
      <input type="checkbox" class="chk" style="left:38.5%; top:50.1%" title="Industrie" />
      <input type="checkbox" class="chk" style="left:38.5%; top:52.4%" title="Agriculture" />
      <input type="checkbox" class="chk" style="left:38.5%; top:54.7%" title="Energie" />
      <input type="checkbox" class="chk" style="left:58.4%; top:47.8%" title="Informatique" />
      <input type="checkbox" class="chk" style="left:58.4%; top:50.1%" title="Services" />
      <input type="checkbox" class="chk" style="left:58.4%; top:52.4%" title="Construction" />

      <input type="checkbox" class="chk" style="left:83.9%; top:47.8%" title="Public" />
      <input type="checkbox" class="chk" style="left:83.9%; top:50.1%" title="Privé" checked />
      <input type="checkbox" class="chk" style="left:83.9%; top:52.4%" title="Mixte" />

      <input type="text" style="left:24.5%; top:76.8%; width:31%; height:2.2%" value="${matricule}" />
      <input type="text" style="left:22.5%; top:79.8%; width:33%; height:2.2%" value="${dateAdhFr}" />
      <input type="text" style="left:22.5%; top:82.8%; width:33%; height:2.2%" value="${typeMembreFr}" />
      <input type="text" style="left:69%; top:76.8%; width:27%; height:2.2%" value="${wilayaFr}" />
      <input type="text" style="left:69%; top:79.8%; width:27%; height:2.2%" value="${expFr}" />
      <input type="text" style="left:69%; top:82.8%; width:27%; height:2.2%"  />
    </div>

    <div class="page p2 rtl">
      <input type="text" style="left:9%; top:36.8%; width:59%; height:2.2%" value="${nomPrenomAr}" />
      <input type="text" style="left:55%; top:40.5%; width:24%; height:2.2%"  />
      <input type="text" class="ltr-f" style="left:9%; top:40.5%; width:24%; height:2.2%" value="${idNum}" />
      <input type="text" style="left:68%; top:43.9%; width:16%; height:2.2%" />
      <input type="text" style="left:33%; top:43.9%; width:17%; height:2.2%" />
      <input type="text" style="left:9%; top:43.9%; width:17%; height:2.2%" value="${wilayaAr}" />
      <input type="text" style="left:9%; top:46.8%; width:36%; height:2.2%" />
      <input type="text" style="left:9%; top:50.5%; width:61%; height:2.2%" />

      <input type="text" class="ltr-f" style="left:10%; top:61.2%; width:18%; height:2.2%" value="${todayFr}" />

      <input type="checkbox" class="chk" style="left:91.5%; top:81.2%" />
      <input type="checkbox" class="chk" style="left:91.5%; top:83.1%" />
      <input type="checkbox" class="chk" style="left:91.5%; top:85.0%" />
      <input type="checkbox" class="chk" style="left:91.5%; top:87.0%" />
      <input type="checkbox" class="chk" style="left:91.5%; top:88.9%" />
      <input type="checkbox" class="chk" style="left:91.5%; top:91.0%" />
    </div>

    <div class="page p3 rtl">
      <input type="text" style="left:10%; top:25.3%; width:59%; height:2.2%" value="${nomPrenomAr}" />
      <input type="text" style="left:56%; top:28.8%; width:24%; height:2.2%"  />
      <input type="text" class="ltr-f" style="left:10%; top:28.8%; width:24%; height:2.2%" value="${idNum}" />
      <input type="text" style="left:68%; top:32.3%; width:17%; height:2.2%"  />
      <input type="text" style="left:33%; top:32.3%; width:18%; height:2.2%"  />
      <input type="text" style="left:10%; top:32.3%; width:17%; height:2.2%" value="${wilayaAr}" />
      <input type="text" style="left:10%; top:35.8%; width:36%; height:2.2%"  />
      <input type="text" style="left:10%; top:38.5%; width:61%; height:2.2%"  />
 

      <input type="text" class="ltr-f" style="left:66%; top:74.5%; width:18%; height:2.2%" value="${todayFr}" />
    </div>
  </div>
</body>
</html>`;
}

export default router;