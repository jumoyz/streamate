<?php
/**
 * Configuration file for Streamate API
 * This file contains database connection settings, API keys for payment gateways,
 * and other environment-specific configurations.                                           
 */
// If you're using Composer, require the autoloader.
require_once __DIR__ . '/vendor/autoload.php';

// Load environment variables from .env file
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Database Configuration - uses .env values with fallbacks
define('DB_HOST', $_ENV['DB_HOST'] ?? 'localhost');
define('DB_NAME', $_ENV['DB_NAME'] ?? 'streamate');
define('DB_USER', $_ENV['DB_USER'] ?? 'root');
define('DB_PASS', $_ENV['DB_PASS'] ?? '');

// Stripe API configuration
define('STRIPE_API_KEY', $_ENV['STRIPE_API_KEY'] ?? '');
define('STRIPE_PUBLISHABLE_KEY', $_ENV['STRIPE_PUBLISHABLE_KEY'] ?? '');

// MonCash API configuration
define('MONCASH_CLIENT_ID', $_ENV['MONCASH_CLIENT_ID'] ?? '');
define('MONCASH_CLIENT_SECRET', $_ENV['MONCASH_CLIENT_SECRET'] ?? '');

// NatCash API configuration
define('NATCASH_API_KEY', $_ENV['NATCASH_API_KEY'] ?? '');