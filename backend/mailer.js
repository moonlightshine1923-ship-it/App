import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';
import { CONFIG } from './config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS = path.join(__dirname, '..', 'uploads');

export const DIRECTION_EMAIL = CONFIG.mail.directionEmail;

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  // Service Gmail (host/port gérés automatiquement par nodemailer)
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: CONFIG.mail.gmailUser,
      pass: (CONFIG.mail.gmailAppPassword || '').replace(/\s+/g, ''), // tolère les espaces
    },
  });
  return transporter;
}

// Vérifie au démarrage que la configuration mail est correcte.
export async function verifyMailer() {
  if (!CONFIG.mail.enabled) {
    console.log('  ✉️  Envoi d\'emails désactivé (config.mail.enabled = false).');
    return false;
  }
  if (!CONFIG.mail.gmailUser || CONFIG.mail.gmailUser.includes('votre.compte') ||
      !CONFIG.mail.gmailAppPassword || CONFIG.mail.gmailAppPassword.includes('xxxx')) {
    console.warn('  ⚠️  Email NON configuré : renseignez gmailUser / gmailAppPassword dans backend/config.js');
    return false;
  }
  try {
    await getTransporter().verify();
    console.log(`  ✉️  Email prêt (Gmail: ${CONFIG.mail.gmailUser} → ${DIRECTION_EMAIL})`);
    return true;
  } catch (e) {
    console.warn('  ⚠️  Connexion Gmail échouée :', e.message);
    return false;
  }
}

export async function sendDemandeEmail(demande, pieces = []) {
  if (!CONFIG.mail.enabled) {
    console.log(`  [MAIL DÉSACTIVÉ] Demande ${demande.numero} non envoyée.`);
    return { sent: false, reason: 'disabled' };
  }

  const subject = `Nouvelle demande ${demande.numero} — ${demande.nom} ${demande.prenom}`;
  const text =
    `Nouvelle demande reçue depuis le site web OPA.\n\n` +
    `Numéro    : ${demande.numero}\n` +
    `Nom       : ${demande.nom}\n` +
    `Prénom    : ${demande.prenom}\n` +
    `Matricule : ${demande.matricule || '—'}\n` +
    `Objet     : ${demande.objet}\n` +
    `Priorité  : ${demande.priorite}\n` +
    `Statut    : ${demande.statut}\n\n` +
    `Description :\n${demande.description || '(aucune)'}\n`;

  const html =
    `<h2 style="color:#c39b2e;margin:0 0 12px">Nouvelle demande — ${demande.numero}</h2>
     <table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">
       <tr><td style="padding:4px 12px 4px 0;color:#888">Nom</td><td><b>${demande.nom} ${demande.prenom}</b></td></tr>
       <tr><td style="padding:4px 12px 4px 0;color:#888">Matricule</td><td>${demande.matricule || '—'}</td></tr>
       <tr><td style="padding:4px 12px 4px 0;color:#888">Objet</td><td>${demande.objet}</td></tr>
       <tr><td style="padding:4px 12px 4px 0;color:#888">Priorité</td><td>${demande.priorite}</td></tr>
       <tr><td style="padding:4px 12px 4px 0;color:#888">Statut</td><td>${demande.statut}</td></tr>
     </table>
     <p style="font-family:Arial,sans-serif;font-size:14px;white-space:pre-wrap;margin-top:14px">${(demande.description || '(aucune description)')}</p>`;

  const attachments = pieces.map((p) => ({
    filename: p.original_name || path.basename(p.filename),
    path: path.join(UPLOADS, p.filename),
  }));

  await getTransporter().sendMail({
    from: `"OPA - Demandes" <${CONFIG.mail.gmailUser}>`,
    to: DIRECTION_EMAIL,
    replyTo: CONFIG.mail.gmailUser,
    subject,
    text,
    html,
    attachments,
  });
  return { sent: true };
}
