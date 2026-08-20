-- ============================================
--  Sauvegarde de la base de données OPA
--  Base : opa_db
--  Date : 06/08/2026 16:00:00
-- ============================================

SET FOREIGN_KEY_CHECKS=0;
SET NAMES utf8mb4;

CREATE DATABASE IF NOT EXISTS `opa_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `opa_db`;

-- --------------------------------------------
-- Table : adherents
-- --------------------------------------------
DROP TABLE IF EXISTS `adherents`;
CREATE TABLE `adherents` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `matricule` varchar(40) DEFAULT NULL,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `nom_ar` varchar(100) DEFAULT NULL,
  `prenom_ar` varchar(100) DEFAULT NULL,
  `telephone` varchar(30) DEFAULT NULL,
  `nin` varchar(18) DEFAULT NULL,
  `doc_type` varchar(2) DEFAULT 'RC',
  `doc_numero` varchar(20) DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `wilaya_code` varchar(5) NOT NULL DEFAULT '16',
  `type_code` varchar(2) NOT NULL DEFAULT 'AD',
  `niveau` varchar(40) DEFAULT 'Adhérent Simple',
  `num_ordre` int(11) DEFAULT 0,
  `annee` int(11) DEFAULT 0,
  `date_adhesion` date DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `description` text DEFAULT NULL,
  `fichier_final` varchar(255) DEFAULT NULL,
  `dossier_pdf` varchar(255) DEFAULT NULL,
  `paiement_mode` text DEFAULT NULL,
  `paiement_banque` text DEFAULT NULL,
  `paiement_ref` text DEFAULT NULL,
  `bureau_code` varchar(3) DEFAULT NULL,
  `bureau_badge_type` varchar(100) DEFAULT NULL,
  `etoiles` tinyint(4) DEFAULT 0,
  `carte_remise` tinyint(1) DEFAULT 0,
  `top_month_rank` int(11) DEFAULT NULL,
  `top_year_rank` int(11) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `whatsapp` varchar(30) DEFAULT NULL,
  `viber` varchar(30) DEFAULT NULL,
  `adresse_personnelle` text DEFAULT NULL,
  `date_naissance` date DEFAULT NULL,
  `doc_numero_2` varchar(20) DEFAULT NULL,
  `nom_soc` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `matricule` (`matricule`),
  UNIQUE KEY `telephone` (`telephone`),
  UNIQUE KEY `nin` (`nin`),
  UNIQUE KEY `doc_numero` (`doc_numero`),
  UNIQUE KEY `uq_adh_nin` (`nin`),
  UNIQUE KEY `uq_adh_tel` (`telephone`),
  UNIQUE KEY `uq_adh_doc` (`doc_numero`)
) ENGINE=InnoDB AUTO_INCREMENT=107 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `adherents` (`id`, `matricule`, `nom`, `prenom`, `nom_ar`, `prenom_ar`, `telephone`, `nin`, `doc_type`, `doc_numero`, `photo`, `wilaya_code`, `type_code`, `niveau`, `num_ordre`, `annee`, `date_adhesion`, `created_at`, `description`, `fichier_final`, `dossier_pdf`, `paiement_mode`, `paiement_banque`, `paiement_ref`, `bureau_code`, `bureau_badge_type`, `etoiles`, `carte_remise`, `top_month_rank`, `top_year_rank`, `email`, `whatsapp`, `viber`, `adresse_personnelle`, `date_naissance`, `doc_numero_2`, `nom_soc`) VALUES
(92, 'AGN1904001MA2026', 'Khaldi', 'Mourad', '', '', NULL, NULL, 'RC', NULL, NULL, '04', 'MA', 'Membre Actif', 1, 2026, NULL, '2026-07-20 16:15:30', '', NULL, NULL, 'non_assujetti', NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, ''),
(93, 'AGN1916002MA2026', 'Mansouri', 'lamia', '', '', NULL, NULL, 'RC', NULL, NULL, '16', 'MA', 'Membre Actif', 2, 2026, NULL, '2026-07-20 16:15:45', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, ''),
(94, 'AGN1916001AD2026', 'Benali', 'abd erahmane', '', '', NULL, NULL, 'RC', NULL, NULL, '16', 'AD', 'Adhérent Simple', 1, 2026, NULL, '2026-07-20 16:16:00', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, ''),
(95, 'AGN1916001CR2026', 'abc', 'dfg', '', '', NULL, NULL, 'RC', NULL, NULL, '16', 'CR', 'Conseiller', 1, 2026, NULL, '2026-07-20 16:16:13', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, ''),
(96, 'AGN1905002CR2026', 'wew', 'faew', '', '', NULL, NULL, 'RC', NULL, NULL, '05', 'CR', 'Conseiller', 2, 2026, NULL, '2026-07-20 16:16:25', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, ''),
(97, 'AGN1916002AD2026', 'test', 'test', '', '', NULL, NULL, 'RC', NULL, NULL, '16', 'AD', 'Adhérent Simple', 2, 2026, NULL, '2026-07-21 16:05:48', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'abcd'),
(98, 'AGN1916003AD2026', 'aaaaaa', 'aaa', '', '', NULL, NULL, 'RC', NULL, NULL, '16', 'AD', 'Adhérent Gold', 3, 2026, NULL, '2026-07-21 16:22:35', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'qqq'),
(99, 'AGN1916003MA2026', 'sssssss', 'ssss', '', '', NULL, NULL, 'RC', NULL, NULL, '16', 'MA', 'Membre Actif', 3, 2026, NULL, '2026-07-21 16:23:26', '', NULL, NULL, 'non_assujetti', NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'qqqq'),
(100, 'AGN1916003CR2026', 'gsdfg', 'tgggg', '', '', NULL, NULL, 'RC', NULL, NULL, '16', 'CR', 'Conseiller', 3, 2026, NULL, '2026-07-21 16:24:08', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'sdfgws'),
(101, 'AGN1916004AD2026', 'sidi said', 'saida', '', '', NULL, NULL, 'RC', NULL, NULL, '16', 'AD', 'Adhérent Simple', 4, 2026, NULL, '2026-07-22 15:30:28', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, '2026-07-24', NULL, 'qqqq'),
(102, 'AGN1916005AD2026', 'sidi said', 'Mourad', 'خالدي', 'سعيدة', 'telephone', '123456789098765433', 'RC', '345678903452', NULL, '16', 'AD', 'Adhérent Gold', 5, 2026, '2026-08-06', '2026-07-22 16:02:22', 'description', NULL, NULL, 'espece', NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, 'email@email.com', 'whatsapp', 'viber', 'adresse', '2026-08-06', '0008244B99', 'nonsociete'),
(103, 'AGN1916006AD2026', 'test', 'test', 'لامية', 'أمينة', NULL, NULL, 'RC', NULL, NULL, '16', 'AD', 'Adhérent Simple', 6, 2026, '2026-08-06', '2026-08-06 09:58:31', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, ''),
(105, 'AGN1916SUPBE2026', 'test', 'test', 'خالدي', 'سعيدة', NULL, NULL, 'RC', NULL, NULL, '16', 'BE', 'Bureau exécutif', 0, 2026, NULL, '2026-08-06 10:16:17', '', NULL, NULL, NULL, NULL, NULL, 'SUP', 'رئيس لجنة البيئة', 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '');

-- --------------------------------------------
-- Table : audit_logs
-- --------------------------------------------
DROP TABLE IF EXISTS `audit_logs`;
CREATE TABLE `audit_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `user_email` varchar(150) DEFAULT NULL,
  `action_type` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `target_id` varchar(50) DEFAULT NULL,
  `target_type` varchar(50) DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_audit_user` (`user_id`),
  CONSTRAINT `fk_audit_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=171 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `audit_logs` (`id`, `user_id`, `user_email`, `action_type`, `description`, `target_id`, `target_type`, `ip_address`, `created_at`) VALUES
(1, 2, 'president@opa.dz', 'PRINT_CARTE', 'Génération/Impression de la carte d''adhérent pour zarhouni ahmed (Matricule: AGN1916007AD2026)', '86', 'adherent', '::1', '2026-07-14 09:20:22'),
(2, 2, 'president@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour zarhouni ahmed (Matricule: AGN1916007AD2026)', '86', 'adherent', '::1', '2026-07-14 09:20:30'),
(3, 2, 'president@opa.dz', 'EDIT_USER_PASSWORD', 'Réinitialisation du mot de passe de l''utilisateur admin@opa.dz', '1', 'user', '::1', '2026-07-14 09:20:55'),
(4, 1, 'admin@opa.dz', 'LOGIN', 'Connexion de l''utilisateur admin@opa.dz', NULL, NULL, '::1', '2026-07-14 09:39:13'),
(5, 1, 'admin@opa.dz', 'EDIT_ADHERENT', 'Mise à jour de l''adhérent Amina ouzia (Matricule: AGN1915003CR2026)', '84', 'adherent', '::1', '2026-07-14 09:39:51'),
(6, 2, 'president@opa.dz', 'LOGIN', 'Connexion de l''utilisateur president@opa.dz', NULL, NULL, '::1', '2026-07-14 09:39:56'),
(7, 2, 'president@opa.dz', 'LOGIN', 'Connexion de l''utilisateur president@opa.dz', NULL, NULL, '::1', '2026-07-14 09:53:55'),
(8, 1, 'admin@opa.dz', 'LOGIN', 'Connexion de l''utilisateur admin@opa.dz', NULL, NULL, '::1', '2026-07-14 10:57:23'),
(9, 1, 'admin@opa.dz', 'EDIT_USER_PASSWORD', 'Réinitialisation du mot de passe de l''utilisateur agent2@opa.dz', '9', 'user', '::1', '2026-07-14 10:57:37'),
(10, 9, 'agent2@opa.dz', 'LOGIN', 'Connexion de l''utilisateur agent2@opa.dz', NULL, NULL, '::1', '2026-07-14 10:57:55'),
(11, 9, 'agent2@opa.dz', 'LOGIN', 'Connexion de l''utilisateur agent2@opa.dz', NULL, NULL, '::1', '2026-07-14 11:01:47'),
(12, 1, 'admin@opa.dz', 'LOGIN', 'Connexion de l''utilisateur admin@opa.dz', NULL, NULL, '::1', '2026-07-14 11:06:41'),
(13, 9, 'agent2@opa.dz', 'LOGIN', 'Connexion de l''utilisateur agent2@opa.dz', NULL, NULL, '::1', '2026-07-14 11:06:50'),
(14, 9, 'agent2@opa.dz', 'LOGIN', 'Connexion de l''utilisateur agent2@opa.dz', NULL, NULL, '::1', '2026-07-14 11:17:47'),
(15, 9, 'agent2@opa.dz', 'LOGIN', 'Connexion de l''utilisateur agent2@opa.dz', NULL, NULL, '::1', '2026-07-14 11:17:48'),
(16, 9, 'agent2@opa.dz', 'LOGIN', 'Connexion de l''utilisateur agent2@opa.dz', NULL, NULL, '::1', '2026-07-14 11:19:09'),
(17, 9, 'agent2@opa.dz', 'LOGIN', 'Connexion de l''utilisateur agent2@opa.dz', NULL, NULL, '::1', '2026-07-14 11:19:09'),
(18, 9, 'agent2@opa.dz', 'LOGIN', 'Connexion de l''utilisateur agent2@opa.dz', NULL, NULL, '::1', '2026-07-14 11:50:36'),
(19, 9, 'agent2@opa.dz', 'LOGIN', 'Connexion de l''utilisateur agent2@opa.dz', NULL, NULL, '::1', '2026-07-14 12:57:56'),
(20, 2, 'president@opa.dz', 'LOGIN', 'Connexion de l''utilisateur president@opa.dz', NULL, NULL, '::1', '2026-07-14 13:00:13'),
(21, 2, 'president@opa.dz', 'BACKUP_CREATE', 'Création d''une sauvegarde manuelle de la base de données : Sauvegarde bdd opa - 2026-07-14_13h36.sql', NULL, 'backup', '::1', '2026-07-14 13:36:26'),
(22, 2, 'president@opa.dz', 'LOGIN', 'Connexion de l''utilisateur president@opa.dz', NULL, NULL, '::1', '2026-07-20 15:08:03'),
(23, 2, 'president@opa.dz', 'CREATE_ADHERENT', 'Création de l''adhérent Amina ouzia (Matricule: AGN1916008AD2026)', '87', 'adherent', '::1', '2026-07-20 15:36:17'),
(24, 2, 'president@opa.dz', 'DELETE_ADHERENT', 'Suppression de l''adhérent Amina ouzia (Matricule: AGN1916008AD2026)', '87', 'adherent', '::1', '2026-07-20 16:08:05'),
(25, 2, 'president@opa.dz', 'DELETE_ADHERENT', 'Suppression de l''adhérent Amina ouzia (Matricule: AGN1915003CR2026)', '84', 'adherent', '::1', '2026-07-20 16:08:05'),
(26, 2, 'president@opa.dz', 'DELETE_ADHERENT', 'Suppression de l''adhérent saida boukhedouma (Matricule: AGN1916003AD2026)', '79', 'adherent', '::1', '2026-07-20 16:08:05'),
(27, 2, 'president@opa.dz', 'DELETE_ADHERENT', 'Suppression de l''adhérent saida Khaldi (Matricule: AGN1913003AD2026)', '83', 'adherent', '::1', '2026-07-20 16:08:05'),
(28, 2, 'president@opa.dz', 'DELETE_ADHERENT', 'Suppression de l''adhérent Amina Benali (Matricule: AGN1916005MA2026)', '82', 'adherent', '::1', '2026-07-20 16:08:05'),
(29, 2, 'president@opa.dz', 'DELETE_ADHERENT', 'Suppression de l''adhérent Mourad Mansouri (Matricule: AGN1916006AD2025)', '80', 'adherent', '::1', '2026-07-20 16:08:05'),
(30, 2, 'president@opa.dz', 'DELETE_ADHERENT', 'Suppression de l''adhérent zarhouni ahmed (Matricule: AGN1916007AD2026)', '86', 'adherent', '::1', '2026-07-20 16:08:05'),
(31, 2, 'president@opa.dz', 'DELETE_ADHERENT', 'Suppression de l''adhérent lamia ouzia (Matricule: AGN1916002MA2026)', '75', 'adherent', '::1', '2026-07-20 16:08:05'),
(32, 2, 'president@opa.dz', 'CREATE_ADHERENT', 'Création de l''adhérent saida Khaldi (Matricule: AGN1916001CR2026)', '88', 'adherent', '::1', '2026-07-20 16:08:17'),
(33, 2, 'president@opa.dz', 'CREATE_ADHERENT', 'Création de l''adhérent Mourad Mansouri (Matricule: AGN1916002AD2026)', '89', 'adherent', '::1', '2026-07-20 16:08:32'),
(34, 2, 'president@opa.dz', 'CREATE_ADHERENT', 'Création de l''adhérent lamia Mansouri (Matricule: AGN1913001CR2026)', '90', 'adherent', '::1', '2026-07-20 16:08:49'),
(35, 2, 'president@opa.dz', 'CREATE_ADHERENT', 'Création de l''adhérent Mourad boukhedouma (Matricule: AGN1916003CR2026)', '91', 'adherent', '::1', '2026-07-20 16:09:15'),
(36, 2, 'president@opa.dz', 'DELETE_ADHERENT', 'Suppression de l''adhérent Mourad boukhedouma (Matricule: AGN1916003CR2026)', '91', 'adherent', '::1', '2026-07-20 16:11:38'),
(37, 2, 'president@opa.dz', 'DELETE_ADHERENT', 'Suppression de l''adhérent saida Khaldi (Matricule: AGN1916001CR2026)', '88', 'adherent', '::1', '2026-07-20 16:11:38'),
(38, 2, 'president@opa.dz', 'DELETE_ADHERENT', 'Suppression de l''adhérent lamia Mansouri (Matricule: AGN1913001CR2026)', '90', 'adherent', '::1', '2026-07-20 16:11:38'),
(39, 2, 'president@opa.dz', 'DELETE_ADHERENT', 'Suppression de l''adhérent Mourad Mansouri (Matricule: AGN1916002AD2026)', '89', 'adherent', '::1', '2026-07-20 16:11:38'),
(40, 2, 'president@opa.dz', 'CREATE_ADHERENT', 'Création de l''adhérent Mourad Khaldi (Matricule: AGN1904001MA2026)', '92', 'adherent', '::1', '2026-07-20 16:15:30'),
(41, 2, 'president@opa.dz', 'CREATE_ADHERENT', 'Création de l''adhérent lamia Mansouri (Matricule: AGN1916002MA2026)', '93', 'adherent', '::1', '2026-07-20 16:15:45'),
(42, 2, 'president@opa.dz', 'CREATE_ADHERENT', 'Création de l''adhérent abd erahmane Benali (Matricule: AGN1916001AD2026)', '94', 'adherent', '::1', '2026-07-20 16:16:00'),
(43, 2, 'president@opa.dz', 'CREATE_ADHERENT', 'Création de l''adhérent dfg abc (Matricule: AGN1916001CR2026)', '95', 'adherent', '::1', '2026-07-20 16:16:13'),
(44, 2, 'president@opa.dz', 'CREATE_ADHERENT', 'Création de l''adhérent faew wew (Matricule: AGN1905002CR2026)', '96', 'adherent', '::1', '2026-07-20 16:16:25'),
(45, 1, 'admin@opa.dz', 'LOGIN', 'Connexion de l''utilisateur admin@opa.dz', NULL, NULL, '::1', '2026-07-21 14:34:18'),
(46, 1, 'admin@opa.dz', 'CREATE_ADHERENT', 'Création de l''adhérent test test (Matricule: AGN1916002AD2026)', '97', 'adherent', '::1', '2026-07-21 16:05:48'),
(47, 1, 'admin@opa.dz', 'CREATE_ADHERENT', 'Création de l''adhérent aaa aaaaaa (Matricule: AGN1916003AD2026)', '98', 'adherent', '::1', '2026-07-21 16:22:35'),
(48, 1, 'admin@opa.dz', 'CREATE_ADHERENT', 'Création de l''adhérent ssss sssssss (Matricule: AGN1916003MA2026)', '99', 'adherent', '::1', '2026-07-21 16:23:26'),
(49, 1, 'admin@opa.dz', 'CREATE_ADHERENT', 'Création de l''adhérent tgggg gsdfg (Matricule: AGN1916003CR2026)', '100', 'adherent', '::1', '2026-07-21 16:24:08'),
(50, 1, 'admin@opa.dz', 'LOGIN', 'Connexion de l''utilisateur admin@opa.dz', NULL, NULL, '::1', '2026-07-22 15:17:30'),
(51, 1, 'admin@opa.dz', 'CREATE_ADHERENT', 'Création de l''adhérent saida sidi said (Matricule: AGN1916004AD2026)', '101', 'adherent', '::1', '2026-07-22 15:30:28'),
(52, 1, 'admin@opa.dz', 'CREATE_ADHERENT', 'Création de l''adhérent Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-07-22 16:02:22'),
(53, 1, 'admin@opa.dz', 'LOGIN', 'Connexion de l''utilisateur admin@opa.dz', NULL, NULL, '::1', '2026-07-26 09:38:41'),
(54, 1, 'admin@opa.dz', 'EDIT_DEMANDE', 'Modification de la demande DEM-20260726-K9VUNW (Nouveau statut: En attente)', '20', 'demande', '::1', '2026-07-26 10:02:13'),
(55, 1, 'admin@opa.dz', 'LOGIN', 'Connexion de l''utilisateur admin@opa.dz', NULL, NULL, '::1', '2026-08-05 11:02:26'),
(56, 1, 'admin@opa.dz', 'BACKUP_CREATE', 'Création d''une sauvegarde manuelle : Sauvegarde bdd opa - 2026-08-05_11h02.sql', NULL, 'backup', '::1', '2026-08-05 11:02:26'),
(57, 1, 'admin@opa.dz', 'BACKUP_DOWNLOAD', 'Téléchargement de la sauvegarde : Sauvegarde bdd opa - 2026-08-05_11h02.sql', NULL, 'backup', '::1', '2026-08-05 11:02:26'),
(58, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-05 15:38:43'),
(59, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-05 15:43:13'),
(60, 1, 'admin@opa.dz', 'EDIT_ADHERENT', 'Mise à jour de l''adhérent Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-05 15:43:53'),
(61, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-05 15:44:32'),
(62, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-05 15:48:30'),
(63, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-05 15:49:59'),
(64, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-05 15:51:35'),
(65, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-05 15:51:59'),
(66, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-05 15:55:51'),
(67, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-05 15:56:06'),
(68, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-05 15:56:22'),
(69, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-05 15:57:05'),
(70, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-05 15:57:28'),
(71, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-05 15:57:47'),
(72, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-05 15:57:59'),
(73, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-05 15:58:17'),
(74, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-05 15:58:34'),
(75, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-05 15:58:53'),
(76, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-05 15:59:11'),
(77, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-05 15:59:50'),
(78, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-05 16:00:03'),
(79, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-05 16:01:22'),
(80, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-05 16:02:47'),
(81, 1, 'admin@opa.dz', 'EDIT_ADHERENT', 'Mise à jour de l''adhérent Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-05 16:04:02'),
(82, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-05 16:04:10'),
(83, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-05 16:04:34'),
(84, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-05 16:06:46'),
(85, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-05 16:12:20'),
(86, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-05 16:13:03'),
(87, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-05 16:13:30'),
(88, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-05 16:13:44'),
(89, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-05 16:13:53'),
(90, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-05 16:14:06'),
(91, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-05 16:14:16'),
(92, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-05 16:14:27'),
(93, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-05 16:14:48'),
(94, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-05 16:15:03'),
(95, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-05 16:15:21'),
(96, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-05 16:15:31'),
(97, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-05 16:15:59'),
(98, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-05 16:16:13'),
(99, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-05 16:16:21'),
(100, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-05 16:16:30'),
(101, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-05 16:16:39'),
(102, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-05 16:17:11'),
(103, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-05 16:17:22'),
(104, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-05 16:17:32'),
(105, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-05 16:17:49'),
(106, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-05 16:18:12'),
(107, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-05 16:18:51'),
(108, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-05 16:19:03'),
(109, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-05 16:19:20'),
(110, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-05 16:19:42'),
(111, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-05 16:19:53'),
(112, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-05 16:21:36'),
(113, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-05 16:24:00'),
(114, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-05 16:24:08'),
(115, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-05 16:25:16'),
(116, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-05 16:25:52'),
(117, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-05 16:26:15'),
(118, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-05 16:26:37'),
(119, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-05 16:27:05'),
(120, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-05 16:27:20'),
(121, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-05 16:27:36'),
(122, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-05 16:27:54'),
(123, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-05 16:28:04'),
(124, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-05 16:28:34'),
(125, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-05 16:29:04'),
(126, 1, 'admin@opa.dz', 'LOGIN', 'Connexion de l''utilisateur admin@opa.dz', NULL, NULL, '::1', '2026-08-06 08:32:45'),
(127, 1, 'admin@opa.dz', 'EDIT_ADHERENT', 'Mise à jour de l''adhérent Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-06 08:34:05'),
(128, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-06 08:34:10'),
(129, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-06 08:39:06'),
(130, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-06 08:40:09'),
(131, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-06 08:41:13'),
(132, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-06 08:41:49'),
(133, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-06 08:42:08'),
(134, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-06 08:42:10'),
(135, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-06 08:42:33'),
(136, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-06 08:42:58'),
(137, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-06 08:43:12'),
(138, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-06 08:43:28'),
(139, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-06 08:44:05'),
(140, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-06 08:44:17'),
(141, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-06 08:44:27'),
(142, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-06 08:45:07'),
(143, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-06 09:21:29'),
(144, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-06 09:25:01'),
(145, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-06 09:25:05'),
(146, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-06 09:25:49'),
(147, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-06 09:26:23'),
(148, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-06 09:27:28'),
(149, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-06 09:27:47'),
(150, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-06 09:28:04'),
(151, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-06 09:28:16'),
(152, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-06 09:28:35'),
(153, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-06 09:29:05'),
(154, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-06 09:29:15'),
(155, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-06 09:29:36'),
(156, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour Mourad sidi said (Matricule: AGN1916005AD2026)', '102', 'adherent', '::1', '2026-08-06 09:29:59'),
(157, 1, 'admin@opa.dz', 'CREATE_ADHERENT', 'Création de l''adhérent test test (Matricule: AGN1916006AD2026)', '103', 'adherent', '::1', '2026-08-06 09:58:31'),
(158, 1, 'admin@opa.dz', 'PRINT_DOSSIER', 'Génération/Impression du dossier d''adhérent pour test test (Matricule: AGN1916006AD2026)', '103', 'adherent', '::1', '2026-08-06 09:58:43'),
(159, 1, 'admin@opa.dz', 'CREATE_ADHERENT', 'Création de l''adhérent test test (Matricule: AGN1916SUPBE2026)', '104', 'adherent', '::1', '2026-08-06 10:15:28'),
(160, 1, 'admin@opa.dz', 'DELETE_ADHERENT', 'Suppression de l''adhérent abd erahmane sidi said (Matricule: AGN1915ABCBE2026)', '85', 'adherent', '::1', '2026-08-06 10:15:31'),
(161, 1, 'admin@opa.dz', 'DELETE_ADHERENT', 'Suppression de l''adhérent test test (Matricule: AGN1916SUPBE2026)', '104', 'adherent', '::1', '2026-08-06 10:15:35'),
(162, 1, 'admin@opa.dz', 'CREATE_ADHERENT', 'Création de l''adhérent test test (Matricule: AGN1916SUPBE2026)', '105', 'adherent', '::1', '2026-08-06 10:16:17'),
(163, 1, 'admin@opa.dz', 'CREATE_ADHERENT', 'Création de l''adhérent Amina test (Matricule: AGN1916007AD2026)', '106', 'adherent', '::1', '2026-08-06 10:19:05'),
(164, 1, 'admin@opa.dz', 'DELETE_ADHERENT', 'Suppression de l''adhérent Amina test (Matricule: AGN1916007AD2026)', '106', 'adherent', '::1', '2026-08-06 10:19:10'),
(165, 1, 'admin@opa.dz', 'PRINT_CARTE', 'Génération/Impression de la carte d''adhérent pour test test (Matricule: AGN1916006AD2026)', '103', 'adherent', '::1', '2026-08-06 14:15:06'),
(166, 1, 'admin@opa.dz', 'PRINT_CARTE', 'Génération/Impression de la carte d''adhérent pour test test (Matricule: AGN1916006AD2026)', '103', 'adherent', '::1', '2026-08-06 14:25:16'),
(167, 1, 'admin@opa.dz', 'LOGIN', 'Connexion de l''utilisateur admin@opa.dz', NULL, NULL, '::1', '2026-08-06 14:26:45'),
(168, 1, 'admin@opa.dz', 'BACKUP_CREATE', 'Création d''une sauvegarde manuelle : Sauvegarde bdd opa - 2026-08-06_14h26.sql', NULL, 'backup', '::1', '2026-08-06 14:26:45'),
(169, 1, 'admin@opa.dz', 'BACKUP_DOWNLOAD', 'Téléchargement de la sauvegarde : Sauvegarde bdd opa - 2026-08-06_14h26.sql', NULL, 'backup', '::1', '2026-08-06 14:26:45'),
(170, 1, 'admin@opa.dz', 'PRINT_CARTE', 'Génération/Impression de la carte d''adhérent pour test test (Matricule: AGN1916006AD2026)', '103', 'adherent', '::1', '2026-08-06 14:26:52');

-- --------------------------------------------
-- Table : blacklist
-- --------------------------------------------
DROP TABLE IF EXISTS `blacklist`;
CREATE TABLE `blacklist` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `adherent_id` int(11) DEFAULT NULL,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `matricule` varchar(40) DEFAULT NULL,
  `telephone` varchar(30) DEFAULT NULL,
  `nin` varchar(18) DEFAULT NULL,
  `wilaya_code` varchar(5) DEFAULT NULL,
  `motif` text DEFAULT NULL,
  `niveau_risque` enum('faible','moyen','élevé','critique') DEFAULT 'moyen',
  `date_blacklist` date DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_blacklist_adherent` (`adherent_id`),
  KEY `fk_blacklist_user` (`created_by`),
  KEY `idx_blacklist_matricule` (`matricule`),
  KEY `idx_blacklist_nom` (`nom`,`prenom`),
  CONSTRAINT `fk_blacklist_adherent` FOREIGN KEY (`adherent_id`) REFERENCES `adherents` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_blacklist_user` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `blacklist` (`id`, `adherent_id`, `nom`, `prenom`, `matricule`, `telephone`, `nin`, `wilaya_code`, `motif`, `niveau_risque`, `date_blacklist`, `created_by`, `created_at`, `updated_at`) VALUES
(3, NULL, 'ahmed', 'zarhouni', NULL, NULL, NULL, NULL, NULL, 'moyen', '2026-07-09', 1, '2026-07-09 09:08:42', '2026-07-09 09:08:42');

-- --------------------------------------------
-- Table : demande_pieces
-- --------------------------------------------
DROP TABLE IF EXISTS `demande_pieces`;
CREATE TABLE `demande_pieces` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `demande_id` int(11) NOT NULL,
  `filename` varchar(255) NOT NULL,
  `original_name` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_piece_dem` (`demande_id`),
  CONSTRAINT `fk_piece_dem` FOREIGN KEY (`demande_id`) REFERENCES `demandes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------
-- Table : demandes
-- --------------------------------------------
DROP TABLE IF EXISTS `demandes`;
CREATE TABLE `demandes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `numero` varchar(30) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `matricule` varchar(40) DEFAULT NULL,
  `objet` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `priorite` varchar(20) NOT NULL DEFAULT 'Normale',
  `statut` varchar(20) NOT NULL DEFAULT 'En attente',
  `affecte_a` varchar(150) DEFAULT NULL,
  `reponse` text DEFAULT NULL,
  `source` varchar(20) DEFAULT 'site',
  `adherent_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp(),
  `email` varchar(150) DEFAULT NULL,
  `telephone` varchar(30) DEFAULT NULL,
  `wilaya_code` varchar(5) DEFAULT NULL,
  `type_demande` varchar(80) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `numero` (`numero`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------
-- Table : demandes_site
-- --------------------------------------------
DROP TABLE IF EXISTS `demandes_site`;
CREATE TABLE `demandes_site` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `nom` varchar(120) NOT NULL,
  `prenom` varchar(120) NOT NULL,
  `matricule` varchar(80) DEFAULT NULL,
  `wilaya` varchar(120) NOT NULL,
  `titre_demande` varchar(255) NOT NULL,
  `priorite` varchar(50) DEFAULT NULL,
  `date_creation` timestamp NOT NULL DEFAULT current_timestamp(),
  `numero` varchar(30) DEFAULT NULL,
  `statut` varchar(20) NOT NULL DEFAULT 'En attente',
  `reponse` text DEFAULT NULL,
  `source` varchar(20) DEFAULT 'site',
  `num_tel` varchar(20) DEFAULT NULL,
  `affecte_a` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_demandes_site_date_creation` (`date_creation`),
  KEY `idx_demandes_site_matricule` (`matricule`),
  KEY `idx_demandes_site_wilaya` (`wilaya`),
  KEY `idx_demandes_site_priorite` (`priorite`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `demandes_site` (`id`, `nom`, `prenom`, `matricule`, `wilaya`, `titre_demande`, `priorite`, `date_creation`, `numero`, `statut`, `reponse`, `source`, `num_tel`, `affecte_a`) VALUES
(4, 'Khaldi', 'Amina', NULL, '10 - Bouira', 'الانخراط', 'Normale', '2026-06-21 14:45:44', 'DEM-2026-0002', 'En attente', NULL, 'site', NULL, NULL),
(6, 'qqqq', 'qqqqqqqq', NULL, '10 - Bouira', 'qqqqqqqq', 'Normale', '2026-06-23 11:37:23', 'DEM-2026-0003', 'En attente', NULL, 'site', NULL, NULL),
(7, 'boukhedouma', 'saida', NULL, '10 - Bouira', 'qqqqqqqq', 'Normale', '2026-06-23 11:39:36', 'DEM-2026-0004', 'Résolue', NULL, 'site', NULL, NULL),
(13, 'lamia', 'lam', NULL, '15 - Tizi Ouzou', 'Demande de contact', 'Normale', '2026-06-24 16:40:14', 'DEM-2026-0004', 'En attente', NULL, 'site', '0553456789', NULL),
(17, 'Benali', 'Amina', NULL, '15 - Tizi Ouzou', 'Réclamation', 'Normale', '2026-07-20 10:59:37', 'DEM-20260720-GV8QVH', 'Nouveau', '', 'site', '0553456789', NULL),
(18, 'ouzia', 'lamia', NULL, '17 - Djelfa', 'Demande de contact', 'Normale', '2026-07-20 11:02:13', 'DEM-20260720-KO0C3T', 'Nouveau', '', 'site', '0553456789', NULL),
(19, 'test', 'test', NULL, '14 - Tiaret', 'Demande de contact', 'Normale', '2026-07-26 09:38:06', 'DEM-20260726-0IA48F', 'Nouveau', '', 'site', '0553456789', NULL),
(20, 'test', 'test', NULL, '15 - Tizi Ouzou', 'Réclamation', 'Haute', '2026-07-26 09:56:32', 'DEM-20260726-K9VUNW', 'En attente', '', 'site', '0553456789', '');

-- --------------------------------------------
-- Table : demandes_site_pieces
-- --------------------------------------------
DROP TABLE IF EXISTS `demandes_site_pieces`;
CREATE TABLE `demandes_site_pieces` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `demande_id` int(11) NOT NULL,
  `filename` varchar(255) NOT NULL,
  `original_name` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_demande_site_id` (`demande_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `demandes_site_pieces` (`id`, `demande_id`, `filename`, `original_name`, `created_at`) VALUES
(1, 7, 'documents/1782211176567-747419740.png', 'default_square.png', '2026-06-23 11:39:36');

-- --------------------------------------------
-- Table : documents
-- --------------------------------------------
DROP TABLE IF EXISTS `documents`;
CREATE TABLE `documents` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `adherent_id` int(11) DEFAULT NULL,
  `titre` varchar(200) NOT NULL,
  `filename` varchar(255) NOT NULL,
  `original_name` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_adherent_doc` (`adherent_id`),
  CONSTRAINT `fk_doc_adherent` FOREIGN KEY (`adherent_id`) REFERENCES `adherents` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_documents_adherents` FOREIGN KEY (`adherent_id`) REFERENCES `adherents` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------
-- Table : pages
-- --------------------------------------------
DROP TABLE IF EXISTS `pages`;
CREATE TABLE `pages` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `slug` varchar(160) NOT NULL,
  `nom_page` varchar(255) NOT NULL,
  `date_creation` timestamp NOT NULL DEFAULT current_timestamp(),
  `date_modification` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_pages_slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=158 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `pages` (`id`, `slug`, `nom_page`, `date_creation`, `date_modification`) VALUES
(1, 'index', 'Accueil', '2026-06-15 10:32:49', '2026-06-15 10:32:49'),
(2, 'actualites', 'Actualités', '2026-06-15 10:32:49', '2026-06-15 10:32:49'),
(3, 'albums', 'Albums', '2026-06-15 10:32:49', '2026-06-15 10:32:49'),
(4, 'article-1', 'Article 1', '2026-06-15 10:32:49', '2026-06-15 10:32:49'),
(5, 'article-2', 'Article 2', '2026-06-15 10:32:49', '2026-06-15 10:32:49'),
(6, 'article-3', 'Article 3', '2026-06-15 10:32:49', '2026-06-15 10:32:49'),
(7, 'article-4', 'Article 4', '2026-06-15 10:32:49', '2026-06-15 10:32:49'),
(8, 'article-5', 'Article 5', '2026-06-15 10:32:49', '2026-06-15 10:32:49'),
(9, 'article-6', 'Article 6', '2026-06-15 10:32:49', '2026-06-15 10:32:49'),
(10, 'article-7', 'Article 7', '2026-06-15 10:32:49', '2026-06-15 10:32:49'),
(11, 'b2b', 'B2B', '2026-06-15 10:32:49', '2026-06-15 10:32:49'),
(12, 'conference', 'Conférence', '2026-06-15 10:32:49', '2026-06-15 10:32:49'),
(13, 'contribution-opa', 'Contribution OPA', '2026-06-15 10:32:49', '2026-06-15 10:32:49'),
(14, 'loi-et-reglement', 'Loi et règlement', '2026-06-15 10:32:49', '2026-06-15 10:32:49'),
(15, 'mot-president', 'Mot du président', '2026-06-15 10:32:49', '2026-06-15 10:32:49'),
(16, 'seminaire', 'Séminaire', '2026-06-15 10:32:49', '2026-06-15 10:32:49'),
(17, 'startup', 'Startup', '2026-06-15 10:32:49', '2026-06-15 10:32:49'),
(18, 'statut', 'Statut', '2026-06-15 10:32:49', '2026-06-15 10:32:49'),
(19, 'demandes', 'Demandes', '2026-06-15 10:32:49', '2026-06-15 10:32:49'),
(20, 'devenir-membre', 'Devenir membre', '2026-06-15 10:32:49', '2026-06-15 10:32:49'),
(21, 'organisation-opa', 'Organisation OPA', '2026-06-15 10:32:49', '2026-06-15 10:32:49'),
(64, 'navbar', 'Navbar', '2026-06-15 10:53:24', '2026-06-15 10:53:24'),
(65, 'footer', 'Footer', '2026-06-15 10:53:24', '2026-06-15 10:53:24');

-- --------------------------------------------
-- Table : users
-- --------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` varchar(20) NOT NULL,
  `permissions` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `users` (`id`, `email`, `password_hash`, `role`, `permissions`, `created_at`) VALUES
(1, 'admin@opa.dz', '$2b$10$M5S37W5KZ4nM2i79dXpJCulnqc4jgYFpBXwdAc3QUsC9oDrpsPofm', 'admin', NULL, '2026-06-03 10:41:14'),
(2, 'president@opa.dz', '$2b$10$uCEO/CNxiDj.pC6Ko1DCKexVodLYtG8XDLtfTmeWokWg7Po6WWi4C', 'president', NULL, '2026-06-03 10:41:14'),
(9, 'agent2@opa.dz', '$2b$10$W/2F3c6GbaBPbi0MnmsgNu.p3FQZVLegV4UTOX26TEwxkfSwNuupS', 'saisie', '["adherents_add"]', '2026-07-12 15:09:14');

SET FOREIGN_KEY_CHECKS=1;
