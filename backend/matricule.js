import { get } from './db.js';


// Le numéro d'ordre est propre à chaque wilaya (compte tous les adhérents de la wilaya).
const PREFIX = 'AGN19';

export async function nextNumOrdre(wilaya_code) {
  const row = await get(
    'SELECT MAX(num_ordre) AS maxNum FROM adherents WHERE wilaya_code = ?',
    [wilaya_code]
  );
  return (row && row.maxNum ? row.maxNum : 0) + 1;
}

export function buildMatricule({ wilaya_code, num_ordre, type_code, annee }) {
  const ordre = String(num_ordre).padStart(3, '0');
  return `${PREFIX}${wilaya_code}${ordre}${type_code}${annee}`;
}

export async function generateMatricule({ wilaya_code, type_code, annee }) {
  const num_ordre = await nextNumOrdre(wilaya_code);
  const matricule = buildMatricule({ wilaya_code, num_ordre, type_code, annee });
  return { matricule, num_ordre };
}
