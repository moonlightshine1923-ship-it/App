-- ============================================
--  Sauvegarde de la base de données OPA
--  Base : opa_db
--  Date : 05/08/2026 11:02:26
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
) ENGINE=InnoDB AUTO_INCREMENT=103 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `adherents` (`id`, `matricule`, `nom`, `prenom`, `nom_ar`, `prenom_ar`, `telephone`, `nin`, `doc_type`, `doc_numero`, `photo`, `wilaya_code`, `type_code`, `niveau`, `num_ordre`, `annee`, `date_adhesion`, `created_at`, `description`, `fichier_final`, `dossier_pdf`, `paiement_mode`, `paiement_banque`, `paiement_ref`, `bureau_code`, `bureau_badge_type`, `etoiles`, `carte_remise`, `top_month_rank`, `top_year_rank`, `email`, `whatsapp`, `viber`, `adresse_personnelle`, `date_naissance`, `doc_numero_2`, `nom_soc`) VALUES
(85, 'AGN1915ABCBE2026', 'sidi said', 'abd erahmane', 'سيدي سعيد', 'عبد الرحمان', '0770456112', '200456789017345633', 'RC', '345678983466', 'photos/1782814839842-251509760.jpg', '15', 'BE', 'Bureau exécutif', 0, 2026, '2026-06-30', '2026-06-30 11:20:39', '', NULL, NULL, NULL, NULL, NULL, 'ABC', 'الاسم', 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, ''),
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
(102, 'AGN1916005AD2026', 'sidi said', 'Mourad', '', '', NULL, NULL, 'RC', '345678903452', NULL, '16', 'AD', 'Adhérent Simple', 5, 2026, NULL, '2026-07-22 16:02:22', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'wwwwwww');

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
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
(55, 1, 'admin@opa.dz', 'LOGIN', 'Connexion de l''utilisateur admin@opa.dz', NULL, NULL, '::1', '2026-08-05 11:02:26');

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
