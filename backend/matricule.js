import { get } from './db.js';

// Le numéro d'ordre est propre à chaque wilaya (compte tous les adhérents de la wilaya).
const PREFIX = 'AGN19';

function cleanWilaya(code) {
  return String(code || '16').padStart(2, '0').slice(-2);
}

function cleanBureauCode(code) {
  return String(code || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 3);
}

export async function nextNumOrdre(wilaya_code) {
  const row = await get(
    "SELECT MAX(num_ordre) AS maxNum FROM adherents WHERE wilaya_code = ? AND (type_code IS NULL OR type_code <> 'BE')",
    [wilaya_code]
  );
  return (row && row.maxNum ? row.maxNum : 0) + 1;
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
  if (normalizedType === 'BE') {
    const matricule = buildMatricule({ wilaya_code, type_code: 'BE', annee, bureau_code });
    return { matricule, num_ordre: 0 };
  }

  const num_ordre = await nextNumOrdre(wilaya_code);
  const matricule = buildMatricule({ wilaya_code, num_ordre, type_code: normalizedType, annee });
  return { matricule, num_ordre };
}
