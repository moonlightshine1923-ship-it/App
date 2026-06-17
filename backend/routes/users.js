import express from 'express';
import bcrypt from 'bcryptjs';
import { get, query, run } from '../db.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Rôles gérables depuis l'interface
const ROLES = ['admin', 'president', 'saisie'];

/**
 * Protection du compte Président.
 *
 * Le compte Président ne peut être ni modifié, ni supprimé, ni réinitialisé
 * par un Administrateur. Le Président lui-même peut uniquement changer son
 * propre mot de passe via la route /api/auth/change-password.
 *
 * Cette fonction vérifie si l'opération vise un compte Président et bloque
 * tout accès qui ne proviendrait pas du Président sur son propre compte.
 */
async function assertNotPresidentTarget(req, res, { allowSelf = false } = {}) {
  const target = await get('SELECT id, email, role FROM users WHERE id = ?', [req.params.id]);
  if (!target) {
    res.status(404).json({ error: 'Compte introuvable.' });
    return null;
  }
  if (target.role === 'president') {
    // Seul le Président peut intervenir sur son propre compte (et seulement si allowSelf=true)
    if (!(allowSelf && req.user.role === 'president' && req.user.id === target.id)) {
      res.status(403).json({
        error: "Le compte Président est protégé : seul le Président peut modifier ses informations.",
      });
      return null;
    }
  }
  return target;
}

// Liste des comptes (admin & président)
router.get('/', authenticate, authorize('admin', 'president'), async (req, res) => {
  try {
    const rows = await query('SELECT id, email, role, created_at FROM users ORDER BY id');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Création d'un compte (admin & président) — ex. un agent de saisie
router.post('/', authenticate, authorize('admin', 'president'), async (req, res) => {
  try {
    const { email, password, role } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Email et mot de passe requis.' });
    if (!ROLES.includes(role)) return res.status(400).json({ error: 'Rôle invalide.' });
    if (String(password).length < 6) return res.status(400).json({ error: 'Mot de passe : 6 caractères minimum.' });

    // Protection : un administrateur ne peut pas créer un nouveau compte Président
    // (il ne doit pas pouvoir contourner la protection en doublonnant le rôle).
    if (role === 'president' && req.user.role !== 'president') {
      return res.status(403).json({
        error: "Seul le Président peut créer un nouveau compte Président.",
      });
    }

    const exists = await get('SELECT id FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (exists) return res.status(409).json({ error: 'Cet email est déjà utilisé.' });
    const hash = bcrypt.hashSync(password, 10);
    const r = await run('INSERT INTO users (email, password_hash, role) VALUES (?,?,?)',
      [email.toLowerCase().trim(), hash, role]);
    res.status(201).json({ id: r.insertId, email: email.toLowerCase().trim(), role });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Modification du rôle d'un compte (admin & président). Le rôle du Président
// ne peut jamais être changé via cette route.
router.patch('/:id/role', authenticate, authorize('admin', 'president'), async (req, res) => {
  try {
    const target = await assertNotPresidentTarget(req, res);
    if (!target) return;
    const { role } = req.body || {};
    if (!ROLES.includes(role)) return res.status(400).json({ error: 'Rôle invalide.' });
    if (role === 'president' && req.user.role !== 'president') {
      return res.status(403).json({ error: "Seul le Président peut attribuer le rôle Président." });
    }
    await run('UPDATE users SET role = ? WHERE id = ?', [role, target.id]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Réinitialiser le mot de passe d'un compte (admin & président).
// Le mot de passe du Président ne peut JAMAIS être réinitialisé par cette route :
// seul le Président peut changer son propre mot de passe via /api/auth/change-password.
router.patch('/:id/password', authenticate, authorize('admin', 'president'), async (req, res) => {
  try {
    const target = await assertNotPresidentTarget(req, res);
    if (!target) return;
    const { password } = req.body || {};
    if (!password || String(password).length < 6) return res.status(400).json({ error: 'Mot de passe : 6 caractères minimum.' });
    await run('UPDATE users SET password_hash = ? WHERE id = ?', [bcrypt.hashSync(password, 10), target.id]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Suppression d'un compte (admin & président). Le compte Président est protégé
// et ne peut jamais être supprimé.
router.delete('/:id', authenticate, authorize('admin', 'president'), async (req, res) => {
  try {
    const target = await assertNotPresidentTarget(req, res);
    if (!target) return;
    if (parseInt(req.params.id, 10) === req.user.id) {
      return res.status(400).json({ error: 'Vous ne pouvez pas supprimer votre propre compte.' });
    }
    const r = await run('DELETE FROM users WHERE id = ?', [target.id]);
    if (!r.affectedRows) return res.status(404).json({ error: 'Compte introuvable.' });
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

export default router;
