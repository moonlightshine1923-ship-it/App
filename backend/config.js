// ============================================================
//  CONFIGURATION OPA — à éditer selon votre environnement
// ============================================================
// Astuce : les variables d'environnement (process.env...) ont la priorité.
// Sinon, modifiez directement les valeurs ci-dessous.

export const CONFIG = {
  // ---------- Base de données MySQL (XAMPP) ----------
  db: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    name: process.env.DB_NAME || 'opa_db',
  },

  // ---------- Envoi des emails (demandes -> direction) ----------
  mail: {
    // Mettre à true pour activer l'envoi réel des emails.
    enabled: true,

    // Adresse qui RECEVRA les demandes (boîte de la direction).
    // ⬇️ REMPLACEZ par la vraie adresse de la direction.
    directionEmail: process.env.OPA_DIRECTION_EMAIL || 'direction.opa@exemple.com',

    // Compte Gmail utilisé pour ENVOYER les emails.
    // 1) Activez la "validation en 2 étapes" sur le compte Google.
    // 2) Créez un "mot de passe d'application" (16 caractères) :
    //    https://myaccount.google.com/apppasswords
    // 3) Collez l'adresse Gmail et ce mot de passe ci-dessous.
    gmailUser: process.env.SMTP_USER || 'votre.compte@gmail.com',
    gmailAppPassword: process.env.SMTP_PASS || 'xxxx xxxx xxxx xxxx',
  },

  // ---------- Sauvegarde automatique ----------
  backup: {
    // Jour de la semaine : 0=dimanche, 1=lundi ... 4=jeudi ... 6=samedi
    dayOfWeek: 4,   // Jeudi
    hour: 16,       // 16h
    minute: 0,
    keep: 30,       // nombre de sauvegardes à conserver
  },
};