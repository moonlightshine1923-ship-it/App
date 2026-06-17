import mysql from 'mysql2/promise';
import { CONFIG } from './config.js';

// ===== Configuration MySQL (compatible XAMPP / phpMyAdmin) =====
// Valeurs issues de backend/config.js (modifiable) ou des variables d'environnement.
const config = {
  host: CONFIG.db.host,
  port: CONFIG.db.port,
  user: CONFIG.db.user,
  password: CONFIG.db.password,
  database: CONFIG.db.name,
  waitForConnections: true,
  connectionLimit: 10,
  charset: 'utf8mb4',
};

let pool;

export async function connect() {
  const root = await mysql.createConnection({
    host: config.host, port: config.port, user: config.user, password: config.password,
  });
  await root.query(
    `CREATE DATABASE IF NOT EXISTS \`${config.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  );
  await root.end();
  pool = mysql.createPool(config);
  return pool;
}

export function getPool() {
  if (!pool) throw new Error('Base de données non initialisée. Appelez connect() avant.');
  return pool;
}

export async function query(sql, params = []) {
  const [rows] = await getPool().execute(sql, params);
  return rows;
}
// Pour les requêtes ne supportant pas les paramètres préparés (SHOW, DDL…)
export async function raw(sql) {
  const [rows] = await getPool().query(sql);
  return rows;
}
export async function get(sql, params = []) {
  const rows = await query(sql, params);
  return rows[0] || null;
}
export async function run(sql, params = []) {
  const [result] = await getPool().execute(sql, params);
  return result;
}

async function hasColumn(table, col) {
  const r = await raw(`SHOW COLUMNS FROM \`${table}\` LIKE '${col}'`);
  return r.length > 0;
}

// ===== Création des tables =====
export async function initSchema() {
  // --- Adhérents ---
  await query(`
    CREATE TABLE IF NOT EXISTS adherents (
      id INT AUTO_INCREMENT PRIMARY KEY,
      matricule VARCHAR(40) UNIQUE,
      nom VARCHAR(100) NOT NULL,
      prenom VARCHAR(100) NOT NULL,
      nom_ar VARCHAR(100),
      prenom_ar VARCHAR(100),
      telephone VARCHAR(30) UNIQUE,
      nin VARCHAR(18) UNIQUE,
      doc_type VARCHAR(2) DEFAULT 'RC',
      doc_numero VARCHAR(20) UNIQUE,
      photo VARCHAR(255),
      wilaya_code VARCHAR(5) NOT NULL DEFAULT '16',
      type_code VARCHAR(2) NOT NULL DEFAULT 'AD',
      niveau VARCHAR(40) DEFAULT 'Adhérent Simple',
      num_ordre INT DEFAULT 0,
      annee INT DEFAULT 0,
      date_adhesion DATE DEFAULT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // --- Comptes (admin & président uniquement — les adhérents ne se connectent pas) ---
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(150) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(20) NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // --- Demandes (déposées depuis le site web public) ---
  await query(`
    CREATE TABLE IF NOT EXISTS demandes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      numero VARCHAR(30) UNIQUE NOT NULL,
      nom VARCHAR(100) NOT NULL,
      prenom VARCHAR(100) NOT NULL,
      email VARCHAR(150),
      telephone VARCHAR(30),
      wilaya_code VARCHAR(5),
      type_demande VARCHAR(80),
      matricule VARCHAR(40),
      objet VARCHAR(200) NOT NULL,
      description TEXT,
      priorite VARCHAR(20) NOT NULL DEFAULT 'Normale',
      statut VARCHAR(20) NOT NULL DEFAULT 'En attente',
      affecte_a VARCHAR(150),
      reponse TEXT,
      source VARCHAR(20) DEFAULT 'site',
      adherent_id INT DEFAULT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS demande_pieces (
      id INT AUTO_INCREMENT PRIMARY KEY,
      demande_id INT NOT NULL,
      filename VARCHAR(255) NOT NULL,
      original_name VARCHAR(255),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_piece_dem FOREIGN KEY (demande_id) REFERENCES demandes(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS documents (
      id INT AUTO_INCREMENT PRIMARY KEY,
      adherent_id INT,
      titre VARCHAR(200) NOT NULL,
      filename VARCHAR(255) NOT NULL,
      original_name VARCHAR(255),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_doc_adherent FOREIGN KEY (adherent_id) REFERENCES adherents(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await ensureMigrations();
}

// Migrations pour les bases déjà existantes (mise à jour de version)
async function ensureMigrations() {
  // Adhérents : supprimer ancien statut, migrer rc -> doc_type/doc_numero
  try {
    const cols = await query("SHOW COLUMNS FROM adherents LIKE 'statut'");
    if (cols.length) await query('ALTER TABLE adherents DROP COLUMN statut');
  } catch {}
  try {
    if (!(await hasColumn('adherents', 'doc_type'))) {
      await query("ALTER TABLE adherents ADD COLUMN doc_type VARCHAR(2) DEFAULT 'RC'");
    }
    if (!(await hasColumn('adherents', 'doc_numero'))) {
      await query('ALTER TABLE adherents ADD COLUMN doc_numero VARCHAR(20)');
      if (await hasColumn('adherents', 'rc')) {
        await query("UPDATE adherents SET doc_numero = rc, doc_type = 'RC' WHERE rc IS NOT NULL AND (doc_numero IS NULL OR doc_numero = '')");
      }
    }
  } catch (e) { console.warn('  Migration doc_type/doc_numero :', e.message); }

  // Adhérents : ajout des champs nom/prénom en arabe (non destructif)
  try {
    if (!(await hasColumn('adherents', 'nom_ar'))) await query('ALTER TABLE adherents ADD COLUMN nom_ar VARCHAR(100) AFTER prenom');
    if (!(await hasColumn('adherents', 'prenom_ar'))) await query('ALTER TABLE adherents ADD COLUMN prenom_ar VARCHAR(100) AFTER nom_ar');
  } catch (e) { console.warn('  Migration nom_ar/prenom_ar :', e.message); }

  // Demandes : passage du modèle "lié à un adhérent" vers "déposée depuis le site"
  try { await query('ALTER TABLE demandes DROP FOREIGN KEY fk_dem_adherent'); } catch {}
  for (const [col, ddl] of [
    ['nom', "ADD COLUMN nom VARCHAR(100) NOT NULL DEFAULT ''"],
    ['prenom', "ADD COLUMN prenom VARCHAR(100) NOT NULL DEFAULT ''"],
    ['email', 'ADD COLUMN email VARCHAR(150)'],
    ['telephone', 'ADD COLUMN telephone VARCHAR(30)'],
    ['wilaya_code', 'ADD COLUMN wilaya_code VARCHAR(5)'],
    ['type_demande', 'ADD COLUMN type_demande VARCHAR(80)'],
    ['matricule', 'ADD COLUMN matricule VARCHAR(40)'],
    ['objet', "ADD COLUMN objet VARCHAR(200) NOT NULL DEFAULT 'Demande'"],
    ['source', "ADD COLUMN source VARCHAR(20) DEFAULT 'site'"],
  ]) {
    try { if (!(await hasColumn('demandes', col))) await query(`ALTER TABLE demandes ${ddl}`); } catch {}
  }
  try { await query('ALTER TABLE demandes MODIFY adherent_id INT NULL'); } catch {}

  // Index uniques (ignorés s'ils existent déjà ou si données en double)
  for (const [name, col] of [['uq_adh_nin', 'nin'], ['uq_adh_tel', 'telephone'], ['uq_adh_doc', 'doc_numero']]) {
    try { await query(`ALTER TABLE adherents ADD UNIQUE KEY ${name} (${col})`); } catch {}
  }
}

export default { connect, getPool, query, get, run, initSchema };
