import { get } from './db.js';

/* ═══════════════════════════════════════════════════════════════════
   NUMÉROTATION DES MATRICULES
   ─────────────────────────
   Format : AGN19 + Wilaya(2) + N°(3) + TYPE + Année(4)

   CR  → compteur NATIONAL (que les CR)
   MA  → compteur NATIONAL (que les MA)
   AD  → compteur par WILAYA (Gold + Simple ensemble, pas les MA/CR)
   BE  → pas de num_ordre (code bureau à la place)

   Exemples :
   CR Tizi 001, CR Alger 002              (national)
   MA Tizi 001, MA Alger 002              (national)
   AD Gold Alger 001, AD Simple Alger 002 (par wilaya, Gold+Simple ensemble)
   AD Gold Tizi 001, AD Simple Tizi 002   (par wilaya, Gold+Simple ensemble)
   ═══════════════════════════════════════════════════════════════════ */

const PREFIX = 'AGN19';

function cleanWilaya(code) {
  return String(code || '16').padStart(2, '0').slice(-2);
}

function cleanBureauCode(code) {
  return String(code || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 3);
}

/* ── CR : compteur NATIONAL (que les CR) ── */
async function nextNumOrdreCR() {
  const row = await get(
    "SELECT COUNT(*) AS cnt FROM adherents WHERE type_code = 'CR'"
  );
  return (row && row.cnt ? row.cnt : 0) + 1;
}

/* ── MA : compteur NATIONAL (que les MA) ── */
async function nextNumOrdreMA() {
  const row = await get(
    "SELECT COUNT(*) AS cnt FROM adherents WHERE type_code = 'MA'"
  );
  return (row && row.cnt ? row.cnt : 0) + 1;
}

/* ── AD : compteur par WILAYA (Gold + Simple ensemble) ── */
async function nextNumOrdreAD(wilaya_code) {
  const row = await get(
    "SELECT COUNT(*) AS cnt FROM adherents WHERE wilaya_code = ? AND (type_code = 'AD' OR type_code IS NULL)",
    [wilaya_code]
  );
  return (row && row.cnt ? row.cnt : 0) + 1;
}

export function buildMatricule({ wilaya_code, num_ordre, type_code, annee, bureau_code }) {
  const wilaya = cleanWilaya(wilaya_code);
  const year = String(annee || new Date().getFullYear()).slice(-4);

  if (String(type_code || '').toUpperCase() === 'BE') {
    const bureau = cleanBureauCode(bureau_code).padEnd(3, 'X');
    return `${PREFIX}${wilaya}${bureau}BE${year}`;
  }

  const ordre = String(num_ordre || 0).padStart(3, '0');
  return `${PREFIX}${wilaya}${ordre}${String(type_code || 'AD').toUpperCase()}${year}`;
}

export async function generateMatricule({ wilaya_code, type_code, annee, bureau_code }) {
  const normalizedType = String(type_code || 'AD').toUpperCase();

  // BE : pas de num_ordre
  if (normalizedType === 'BE') {
    const matricule = buildMatricule({ wilaya_code, type_code: 'BE', annee, bureau_code });
    return { matricule, num_ordre: 0 };
  }

  // MA : compteur NATIONAL
  if (normalizedType === 'MA') {
    const num_ordre = await nextNumOrdreMA();
    return { matricule: buildMatricule({ wilaya_code, num_ordre, type_code: 'MA', annee }), num_ordre };
  }

  // CR : compteur NATIONAL
  if (normalizedType === 'CR') {
    const num_ordre = await nextNumOrdreCR();
    return { matricule: buildMatricule({ wilaya_code, num_ordre, type_code: 'CR', annee }), num_ordre };
  }

  // AD (Gold + Simple) : compteur par wilaya
  const num_ordre = await nextNumOrdreAD(wilaya_code);
  return { matricule: buildMatricule({ wilaya_code, num_ordre, type_code: 'AD', annee }), num_ordre };
}

export async function nextNumOrdre(wilaya_code, type_code) {
  const t = String(type_code || 'AD').toUpperCase();
  if (t === 'MA') return nextNumOrdreMA();
  if (t === 'CR') return nextNumOrdreCR();
  return nextNumOrdreAD(wilaya_code);
}
