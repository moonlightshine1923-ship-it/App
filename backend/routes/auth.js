import express from 'express';
import bcrypt from 'bcryptjs';
import { get, run } from '../db.js';
import { signToken, authenticate } from '../middleware/auth.js';

const router = express.Router();

// Connexion réservée à l'administrateur et au président (pas d'espace adhérent).
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Email et mot de passe requis.' });

    const user = await get('SELECT * FROM users WHERE email = ?', [String(email).toLowerCase().trim()]);
    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      return res.status(401).json({ error: 'Identifiants incorrects.' });
    }
    const token = signToken(user);
    res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await get('SELECT id, email, role FROM users WHERE id = ?', [req.user.id]);
    if (!user) return res.status(404).json({ error: 'Utilisateur introuvable.' });
    res.json({ user });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/change-password', authenticate, async (req, res) => {
  try {
    const { current, next } = req.body || {};
    if (!current || !next) return res.status(400).json({ error: 'Champs requis.' });
    const user = await get('SELECT * FROM users WHERE id = ?', [req.user.id]);
    if (!bcrypt.compareSync(current, user.password_hash)) {
      return res.status(400).json({ error: 'Mot de passe actuel incorrect.' });
    }
    const hash = bcrypt.hashSync(next, 10);
    await run('UPDATE users SET password_hash = ? WHERE id = ?', [hash, user.id]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

export default router;
