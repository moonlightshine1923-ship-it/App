import jwt from 'jsonwebtoken';

export const JWT_SECRET = process.env.OPA_SECRET || 'opa-secret-key-change-in-production';

export function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '12h' }
  );
}

export function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Authentification requise.' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Session expirée ou invalide.' });
  }
}

// roles autorisés ; vide = tous les utilisateurs authentifiés
export function authorize(...roles) {
  return (req, res, next) => {
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Accès refusé pour votre rôle." });
    }
    next();
  };
}
