-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jul 06, 2025 at 10:32 PM
-- Server version: 8.3.0
-- PHP Version: 8.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `streamate`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_logs`
--

DROP TABLE IF EXISTS `activity_logs`;
CREATE TABLE IF NOT EXISTS `activity_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `activity_type` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text,
  `metadata` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `activity_logs`
--

INSERT INTO `activity_logs` (`id`, `user_id`, `activity_type`, `description`, `ip_address`, `user_agent`, `metadata`, `created_at`) VALUES
(1, 1, 'login', 'User logged in from web', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', NULL, '2023-11-30 14:15:22'),
(2, 1, 'subscription_update', 'User upgraded to VIP plan', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', '{\"plan_id\": 6, \"old_plan\": 1}', '2023-11-28 19:30:45'),
(3, 2, 'payment', 'Payment processed via Stripe', '203.0.113.42', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)', '{\"amount\": 9.99, \"method\": \"stripe\"}', '2023-11-27 16:47:10'),
(4, NULL, 'page_view', 'Guest viewed pricing page', '198.51.100.75', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', '{\"page\": \"/pricing\"}', '2023-11-29 21:20:33'),
(5, 3, 'profile_update', 'User changed profile picture', '172.104.89.12', 'Mozilla/5.0 (Android 12; Mobile)', NULL, '2023-11-26 15:05:18'),
(6, 4, 'support_ticket', 'User submitted feedback', '203.0.113.89', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', '{\"ticket_id\": 42}', '2023-11-25 18:22:07'),
(7, 1, 'logout', 'User logged out', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', NULL, '2023-11-30 15:45:00'),
(8, 2, 'feedback_submitted', 'User submitted feedback: General Feedback', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', NULL, '2025-06-26 20:36:08');

-- --------------------------------------------------------

--
-- Table structure for table `feedbacks`
--

DROP TABLE IF EXISTS `feedbacks`;
CREATE TABLE IF NOT EXISTS `feedbacks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `subject` varchar(100) NOT NULL,
  `message` text NOT NULL,
  `status` enum('new','in_progress','resolved','closed') DEFAULT 'new',
  `response` text,
  `admin_id` int DEFAULT NULL,
  `response_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `admin_id` (`admin_id`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `feedbacks`
--

INSERT INTO `feedbacks` (`id`, `user_id`, `name`, `email`, `subject`, `message`, `status`, `response`, `admin_id`, `response_at`, `created_at`) VALUES
(1, 1, 'John Doe', 'john@example.com', 'Feature Request', 'Can you add a dark mode option? It would help with night-time browsing.', 'resolved', 'Dark mode has been added to our development roadmap!', 5, '2023-11-28 15:30:00', '2023-11-25 19:15:00'),
(2, 3, 'Robert Johnson', 'robert@example.com', 'Bug Report', 'The profile switcher is not working on Safari browser', 'in_progress', 'We are investigating this issue with our development team', 5, '2023-11-29 14:45:00', '2023-11-28 23:22:00'),
(3, NULL, 'Sarah Miller', 'sarah@gmail.com', 'General Feedback', 'Love the app! The interface is very intuitive.', 'closed', 'Thank you for your kind words!', 5, '2023-11-20 16:10:00', '2023-11-20 03:05:00'),
(4, 2, 'Jane Smith', 'jane@example.com', 'Account Help', 'I can\'t access my Disney+ profile, getting an error message', 'resolved', 'This has been fixed. Please try again now.', 5, '2023-11-27 20:20:00', '2023-11-27 15:45:00'),
(5, 4, 'Michael Brown', 'michael@example.com', 'Billing Issue', 'I was charged twice this month for my subscription', 'new', NULL, NULL, NULL, '2023-11-30 13:30:00'),
(6, 1, 'John Doe', 'john@example.com', 'Feature Request', 'Would be great to have a family plan option', 'new', NULL, NULL, NULL, '2023-11-29 22:12:00'),
(7, 2, 'Mona Saintil', 'monasaintil3016@gmail.com', 'General Feedback', 'Test', 'new', NULL, NULL, NULL, '2025-06-26 20:35:59');

-- --------------------------------------------------------

--
-- Table structure for table `news`
--

DROP TABLE IF EXISTS `news`;
CREATE TABLE IF NOT EXISTS `news` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(250) NOT NULL,
  `slug` varchar(250) NOT NULL,
  `content` text NOT NULL,
  `excerpt` text,
  `author_id` int NOT NULL,
  `type` enum('news','tip','announcement','update') NOT NULL,
  `is_featured` tinyint(1) DEFAULT '0',
  `image_url` varchar(250) DEFAULT NULL,
  `published_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `author_id` (`author_id`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `news`
--

INSERT INTO `news` (`id`, `title`, `slug`, `content`, `excerpt`, `author_id`, `type`, `is_featured`, `image_url`, `published_at`, `created_at`, `updated_at`) VALUES
(1, 'New Netflix Profiles Available', 'new-netflix-profiles', 'We now offer additional Netflix profiles for all premium subscribers...', 'More profile options added to Netflix subscriptions', 5, 'announcement', 1, '/images/news/netflix-profiles.jpg', '2023-11-28 05:00:00', '2023-11-25 15:00:00', '2025-06-25 18:17:36'),
(2, '5 Tips to Get the Most From Your Subscriptions', 'subscription-tips', 'Here are 5 expert tips to maximize your streaming experience...', 'Learn how to get the best value from your subscriptions', 5, 'tip', 0, '/images/news/tips.jpg', '2023-11-25 05:00:00', '2023-11-20 19:30:00', '2025-06-25 18:17:36'),
(3, 'Holiday Special: 20% Off VIP Plan', 'holiday-special', 'Celebrate the holidays with 20% off our VIP plan for 3 months...', 'Limited time holiday discount available', 5, '', 1, '/images/news/holiday-special.jpg', '2023-11-20 05:00:00', '2023-11-15 14:15:00', '2025-06-25 18:17:36'),
(4, 'How to Share Profiles Safely', 'profile-sharing-tips', 'Learn best practices for sharing your streaming profiles with family...', 'Tips for secure profile sharing', 5, 'tip', 0, '/images/news/sharing-tips.jpg', '2023-11-15 05:00:00', '2023-11-10 21:45:00', '2025-06-25 18:17:36'),
(5, 'Maintenance Scheduled for Prime Video', 'prime-video-maintenance', 'Prime Video will be unavailable on Dec 5 from 2AM-4AM for maintenance...', 'Scheduled downtime for service improvements', 5, 'update', 0, '/images/news/maintenance.jpg', '2023-11-29 05:00:00', '2023-11-28 16:20:00', '2025-06-25 18:17:36'),
(6, 'New Disney+ Content Added', 'disney-new-content', 'Check out the latest Disney+ content added this month including...', 'Fresh content now available on Disney+', 5, 'news', 1, '/images/news/disney-content.jpg', '2023-11-22 05:00:00', '2023-11-18 18:10:00', '2025-06-25 18:17:36'),
(7, 'Spotify Family Plan Guide', 'spotify-family-guide', 'Everything you need to know about setting up and managing your...', 'Complete guide to Spotify family plans', 5, 'tip', 0, '/images/news/spotify-guide.jpg', '2023-11-18 05:00:00', '2023-11-15 13:30:00', '2025-06-25 18:17:36');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `type` enum('info','warning','alert','promotion') NOT NULL DEFAULT 'info',
  `is_read` tinyint(1) DEFAULT '0',
  `related_entity_type` varchar(50) DEFAULT NULL,
  `related_entity_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `title`, `message`, `type`, `is_read`, `related_entity_type`, `related_entity_id`, `created_at`) VALUES
(1, 1, 'Subscription Renewal', 'Your Netflix subscription will renew in 3 days', 'warning', 0, 'subscription', 1, '2023-11-25 14:15:00'),
(2, 1, 'New Feature Available', 'Profile switching is now available for all plans', 'info', 1, 'feature', NULL, '2023-11-20 19:30:00'),
(3, 2, 'Payment Received', 'Your payment of $9.99 has been processed', 'info', 0, 'payment', 2, '2023-11-27 16:45:00'),
(4, 3, 'Special Offer', 'Get 20% off your next 3 months with code VIP20', 'promotion', 0, 'promotion', 5, '2023-11-28 21:20:00'),
(5, 4, 'Account Security', 'New login detected from a new device', 'alert', 1, 'security', NULL, '2023-11-25 03:10:00'),
(6, 1, 'Profile Assigned', 'You have been assigned a new Disney+ profile', 'info', 0, 'profile', 3, '2023-11-26 15:05:00'),
(7, 3, 'Service Update', 'Prime Video will be unavailable for maintenance on Dec 5', 'warning', 0, 'service', 3, '2023-11-29 13:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
CREATE TABLE IF NOT EXISTS `payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `plan_id` int NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_method` varchar(50) NOT NULL,
  `transaction_id` varchar(100) NOT NULL,
  `status` enum('pending','completed','failed') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `plan_id` (`plan_id`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `user_id`, `plan_id`, `amount`, `payment_method`, `transaction_id`, `status`, `created_at`) VALUES
(1, 2, 1, 500.00, 'moncash', 'PMT-6815', 'completed', '2025-06-24 20:39:42'),
(4, 3, 1, 500.00, 'moncash', 'PMT-1613', 'completed', '2025-06-25 15:20:34'),
(5, 2, 7, 24.99, 'moncash', 'PMT-6797', 'completed', '2025-06-26 20:39:15'),
(6, 2, 6, 14.99, 'moncash', 'PMT-1669', 'completed', '2025-06-26 20:39:58'),
(7, 2, 6, 14.99, 'moncash', 'PMT-5048', 'completed', '2025-06-26 20:40:15'),
(8, 5, 1, 500.00, 'moncash', 'PMT-4949', 'completed', '2025-07-02 00:59:20');

-- --------------------------------------------------------

--
-- Table structure for table `plans`
--

DROP TABLE IF EXISTS `plans`;
CREATE TABLE IF NOT EXISTS `plans` (
  `id` int NOT NULL AUTO_INCREMENT,
  `service_id` int NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL,
  `duration_days` int NOT NULL,
  `max_profiles` int NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `service_id` (`service_id`)
) ENGINE=MyISAM AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `plans`
--

INSERT INTO `plans` (`id`, `service_id`, `name`, `description`, `price`, `duration_days`, `max_profiles`, `is_active`) VALUES
(1, 1, 'Basic', 'Standard Netflix plan', 500.00, 30, 4, 1),
(2, 1, 'Premium', 'Premium Netflix plan with 4K', 750.00, 30, 2, 1),
(3, 2, 'Standard', 'Disney+ standard plan', 7.99, 30, 2, 1),
(4, 3, 'Prime', 'Amazon Prime Video', 12.99, 30, 3, 1),
(5, 4, 'Individual', 'Spotify individual plan', 9.99, 30, 1, 1),
(6, 4, 'Family', 'Spotify family plan', 14.99, 30, 6, 1),
(7, 0, 'VIP Package', 'Netflix, Disney+, and Spotify', 1500.00, 30, 3, 1),
(8, 0, 'Premium Package', 'All services included', 34.99, 30, 5, 1);

-- --------------------------------------------------------

--
-- Table structure for table `profiles`
--

DROP TABLE IF EXISTS `profiles`;
CREATE TABLE IF NOT EXISTS `profiles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `service_id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `name` varchar(50) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `credentials` text,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `service_id` (`service_id`),
  KEY `user_id` (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `profiles`
--

INSERT INTO `profiles` (`id`, `service_id`, `user_id`, `name`, `avatar`, `credentials`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 2, 'Mona S. Moise', NULL, '1984', 'active', '2025-06-25 19:34:43', '2025-06-25 19:34:43');

-- --------------------------------------------------------

--
-- Table structure for table `profile_requests`
--

DROP TABLE IF EXISTS `profile_requests`;
CREATE TABLE IF NOT EXISTS `profile_requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `service_id` int NOT NULL,
  `profile_name` varchar(100) NOT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `avatar` text,
  `status` varchar(20) DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `service_id` (`service_id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `profile_requests`
--

INSERT INTO `profile_requests` (`id`, `user_id`, `service_id`, `profile_name`, `reason`, `avatar`, `status`, `created_at`, `updated_at`) VALUES
(1, 2, 1, 'Marlo Saintil', '', NULL, 'pending', '2025-06-30 20:39:54', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
CREATE TABLE IF NOT EXISTS `services` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` text,
  `logo` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`id`, `name`, `description`, `logo`) VALUES
(1, 'Netflix', 'Stream movies and TV shows', NULL),
(2, 'Disney+', 'Disney, Pixar, Marvel, Star Wars, and more', NULL),
(3, 'Prime Video', 'Amazon Prime Video streaming service', NULL),
(4, 'Spotify', 'Music streaming service', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

DROP TABLE IF EXISTS `settings`;
CREATE TABLE IF NOT EXISTS `settings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `site_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'StreaMate',
  `site_url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'https://streamate.com',
  `admin_email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'admin@streamate.com',
  `support_email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'support@streamate.com',
  `timezone` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'America/Port-au-Prince',
  `default_currency` varchar(3) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'HTG',
  `site_description` text COLLATE utf8mb4_unicode_ci,
  `site_logo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `maintenance_mode` tinyint(1) NOT NULL DEFAULT '0',
  `payment_gateway` enum('stripe','paypal','local') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'local',
  `payout_percentage` decimal(5,2) NOT NULL DEFAULT '70.00',
  `min_payout` decimal(10,2) NOT NULL DEFAULT '50.00',
  `payout_schedule` enum('weekly','biweekly','monthly') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'biweekly',
  `stripe_key` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `stripe_secret` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bank_details` text COLLATE utf8mb4_unicode_ci,
  `default_quality` enum('360p','480p','720p','1080p') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '720p',
  `max_streams` int NOT NULL DEFAULT '3',
  `stream_server` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'rtmp://stream.streamate.com/live',
  `allow_recording` tinyint(1) NOT NULL DEFAULT '1',
  `auto_archive` tinyint(1) NOT NULL DEFAULT '1',
  `archive_retention` int NOT NULL DEFAULT '30',
  `force_https` tinyint(1) NOT NULL DEFAULT '1',
  `two_factor_auth` tinyint(1) NOT NULL DEFAULT '0',
  `password_policy` enum('low','medium','high') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'medium',
  `login_attempts` int NOT NULL DEFAULT '5',
  `lockout_duration` int NOT NULL DEFAULT '30',
  `allowed_ips` text COLLATE utf8mb4_unicode_ci,
  `email_notifications` tinyint(1) NOT NULL DEFAULT '1',
  `smtp_host` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `smtp_port` int DEFAULT NULL,
  `smtp_encryption` enum('tls','ssl','none') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'tls',
  `smtp_username` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `smtp_password` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `push_notifications` tinyint(1) NOT NULL DEFAULT '1',
  `firebase_key` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notify_new_user` tinyint(1) NOT NULL DEFAULT '1',
  `notify_new_stream` tinyint(1) NOT NULL DEFAULT '1',
  `notify_payment` tinyint(1) NOT NULL DEFAULT '1',
  `maintenance_message` text COLLATE utf8mb4_unicode_ci,
  `maintenance_ips` text COLLATE utf8mb4_unicode_ci,
  `maintenance_bg` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `updated_by` (`updated_by`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`id`, `site_name`, `site_url`, `admin_email`, `support_email`, `timezone`, `default_currency`, `site_description`, `site_logo`, `maintenance_mode`, `payment_gateway`, `payout_percentage`, `min_payout`, `payout_schedule`, `stripe_key`, `stripe_secret`, `bank_details`, `default_quality`, `max_streams`, `stream_server`, `allow_recording`, `auto_archive`, `archive_retention`, `force_https`, `two_factor_auth`, `password_policy`, `login_attempts`, `lockout_duration`, `allowed_ips`, `email_notifications`, `smtp_host`, `smtp_port`, `smtp_encryption`, `smtp_username`, `smtp_password`, `push_notifications`, `firebase_key`, `notify_new_user`, `notify_new_stream`, `notify_payment`, `maintenance_message`, `maintenance_ips`, `maintenance_bg`, `created_at`, `updated_at`, `updated_by`) VALUES
(1, 'StreaMate', 'https://streamate.com', 'admin@streamate.com', 'support@streamate.com', 'America/Port-au-Prince', 'HTG', 'The premier streaming platform for Haitian content creators', NULL, 0, 'local', 70.00, 50.00, 'biweekly', NULL, NULL, NULL, '720p', 3, 'rtmp://stream.streamate.com/live', 1, 1, 30, 1, 0, 'medium', 5, 30, NULL, 1, NULL, NULL, 'tls', NULL, NULL, 1, NULL, 1, 1, 1, NULL, NULL, NULL, '2025-07-04 15:36:25', '2025-07-04 15:36:25', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `social_logins`
--

DROP TABLE IF EXISTS `social_logins`;
CREATE TABLE IF NOT EXISTS `social_logins` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `provider` varchar(20) NOT NULL,
  `social_id` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `provider_social_id` (`provider`,`social_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `subscriptions`
--

DROP TABLE IF EXISTS `subscriptions`;
CREATE TABLE IF NOT EXISTS `subscriptions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `plan_id` int NOT NULL,
  `payment_id` int DEFAULT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `status` enum('active','expired','cancelled') DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `plan_id` (`plan_id`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `subscriptions`
--

INSERT INTO `subscriptions` (`id`, `user_id`, `plan_id`, `payment_id`, `start_date`, `end_date`, `status`, `created_at`, `updated_at`) VALUES
(1, 2, 1, 1, '2025-06-24', '2025-07-23', 'cancelled', '2025-06-24 20:37:47', '2025-06-30 20:22:03'),
(2, 2, 1, 2, '2025-06-24', '2025-07-24', 'active', '2025-06-24 20:43:25', '2025-06-24 20:43:25'),
(3, 2, 6, 3, '2025-06-24', '2025-07-24', 'cancelled', '2025-06-24 20:48:42', '2025-06-30 20:22:18'),
(4, 3, 1, 4, '2025-06-25', '2025-07-31', 'active', '2025-06-25 15:20:34', '2025-07-03 00:37:47'),
(5, 2, 7, 5, '2025-06-26', '2025-07-26', 'active', '2025-06-26 20:39:15', '2025-06-26 20:39:15'),
(6, 2, 6, 6, '2025-06-26', '2025-07-26', 'cancelled', '2025-06-26 20:39:58', '2025-07-01 18:07:43'),
(7, 2, 6, 7, '2025-06-26', '2025-07-26', 'cancelled', '2025-06-26 20:40:15', '2025-07-01 18:07:51'),
(8, 5, 1, 8, '2025-07-02', '2025-08-02', 'active', '2025-07-02 00:59:20', '2025-07-02 00:59:20');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `phone` varchar(20) DEFAULT NULL,
  `avatar_url` varchar(150) DEFAULT 'user_avatar.png',
  `email_verified` tinyint(1) DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `is_admin` tinyint(1) DEFAULT '0',
  `remember_token` varchar(64) DEFAULT NULL,
  `token_expiry` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `phone`, `avatar_url`, `email_verified`, `is_active`, `is_admin`, `remember_token`, `token_expiry`, `created_at`, `updated_at`) VALUES
(1, 'Junior MOISE', 'jumoyz@gmail.com', '$2y$10$dTAwwv0iUmSD/gqxnacY5efpyEPOAj5EdEWVQrkIciWO0JB1aOPL2', 'admin', '+50948387765', 'user_avatar.png', 0, 1, 1, NULL, NULL, '2025-06-24 18:59:59', '2025-06-26 17:14:20'),
(2, 'Mona Saintil', 'monasaintil3016@gmail.com', '$2y$10$Gfd3F0FPkOec.v65dtim9eWzaIyFJdv6VihjCOLR/xLtnxSJTw9KO', 'user', '+50946941656', 'user_avatar.png', 0, 1, 0, NULL, NULL, '2025-06-24 19:02:59', '2025-06-24 19:03:36'),
(3, 'Bianca Taina Henry', 'biancatainahenry@gmail.com', '$2y$10$c.jpDFV1FaNsLzqZjpEwoeDkWHa80Pyt.z4wWWTRVVeW23n3bQp9S', 'user', NULL, 'user_avatar.png', 0, 1, 0, NULL, NULL, '2025-06-25 14:36:57', '2025-06-25 14:36:57'),
(4, 'Windyalie JOSEME', 'josmewindyalie91@gmail.com', '$2y$10$w1qrfobNtMIAUtShncozgOjZ4L2tPANQQLRNPMz3uxG5H5qTiK16q', 'user', NULL, 'user_avatar.png', 0, 1, 0, NULL, NULL, '2025-06-25 19:27:18', '2025-06-25 19:27:18'),
(5, 'Andy Adolphe', '', '$2y$10$PcDzoL9wHfPp/6bEWnClY.tTi9mNeAjemzzis1vThDIYSY.1DIP0m', 'user', NULL, 'user_avatar.png', 0, 1, 0, NULL, NULL, '2025-07-01 20:45:23', '2025-07-04 16:22:02'),
(6, 'Ermiode MOISE', 'ermiodemoise@gmail.com', '$2y$10$Pn6aK/ckVxNeiP565MRzK.gmb84ve9ouL3InnFICctO.ETBu66qiS', 'user', NULL, 'user_avatar.png', 0, 1, 0, NULL, NULL, '2025-07-02 01:05:49', '2025-07-02 01:05:49');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `news`
--
ALTER TABLE `news` ADD FULLTEXT KEY `news_search_idx` (`title`,`content`,`excerpt`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `social_logins`
--
ALTER TABLE `social_logins`
  ADD CONSTRAINT `social_logins_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
