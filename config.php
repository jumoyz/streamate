<?php
/**
 * Configuration file for Streamate API
 * This file contains database connection settings, API keys for payment gateways,
 * and other environment-specific configurations.                                           
 */
// Load environment if available
if (file_exists(__DIR__ . '/vendor/autoload.php')) {
    require_once __DIR__ . '/vendor/autoload.php';
}

// Default: assume not on Heroku
$DB_HOST = '';
$DB_USER = '';
$DB_PASS = '';
$DB_NAME = '';

// Check if running on Heroku or JawsDB or if JAWSDB_URL is set (Heroku environment)
if (getenv('JAWSDB_URL')) {
    // Parse the JawsDB URL
    $url = parse_url(getenv("JAWSDB_URL"));

    $DB_HOST = $url["host"];
    $DB_USER = $url["user"];
    $DB_PASS = $url["pass"];
    $DB_NAME = ltrim($url["path"], '/');
} else {
    // Check if Dotenv is available and load .env file
    if (class_exists('Dotenv\Dotenv')) {
        $dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
        $dotenv->load();
        
        // Database Configuration - uses .env values with fallbacks
        $DB_HOST = $_ENV['DB_HOST'] ?? 'localhost';
        $DB_NAME = $_ENV['DB_NAME'] ?? 'streamate';
        $DB_USER = $_ENV['DB_USER'] ?? 'root';
        $DB_PASS = $_ENV['DB_PASS'] ?? '';
    } else {
        // Fallback to default values if .env is not available
        die("Dotenv not available and JAWSDB_URL not set.");
    }
}

// Define constants for use in api.php
define('DB_HOST', $DB_HOST);
define('DB_USER', $DB_USER);
define('DB_PASS', $DB_PASS);
define('DB_NAME', $DB_NAME);

// Now use the variables to connect
$conn = new mysqli($DB_HOST, $DB_USER, $DB_PASS, $DB_NAME);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Stripe API configuration
define('STRIPE_API_KEY', $_ENV['STRIPE_API_KEY'] ?? '');
define('STRIPE_PUBLISHABLE_KEY', $_ENV['STRIPE_PUBLISHABLE_KEY'] ?? '');

// MonCash API configuration
define('MONCASH_CLIENT_ID', $_ENV['MONCASH_CLIENT_ID'] ?? '');
define('MONCASH_CLIENT_SECRET', $_ENV['MONCASH_CLIENT_SECRET'] ?? '');

// NatCash API configuration
define('NATCASH_API_KEY', $_ENV['NATCASH_API_KEY'] ?? '');