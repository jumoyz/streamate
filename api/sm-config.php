<?php
/**
 * Configuration file for Streamate API
 * This file contains database connection settings, API keys for payment gateways,
 * and other environment-specific configurations.                                           
 */
// Set environment: 'production' or 'development'
define('APP_ENV', getenv('APP_ENV') ?: 'development');

if (APP_ENV === 'production') {
    // Production settings
    define('DB_HOST', 'prod-db-host');
    define('DB_NAME', 'u521388514_streamate');
    define('DB_USER', 'jumoyzgmailcom');
    define('DB_PASS', 'Oyeh@2024#2025?');

    define('STRIPE_API_KEY', 'prod_stripe_api_key');
    define('STRIPE_PUBLISHABLE_KEY', 'prod_stripe_publishable_key');

    define('MONCASH_CLIENT_ID', 'prod_moncash_client_id');
    define('MONCASH_CLIENT_SECRET', 'prod_moncash_client_secret');

    define('NATCASH_API_KEY', 'prod_natcash_api_key');
} else {
    // Development/local settings
    define('DB_HOST', 'localhost');
    define('DB_NAME', 'streamate');
    define('DB_USER', 'root');
    define('DB_PASS', '');

    define('STRIPE_API_KEY', 'your_stripe_api_key');
    define('STRIPE_PUBLISHABLE_KEY', 'your_stripe_publishable_key');

    define('MONCASH_CLIENT_ID', 'your_moncash_client_id');
    define('MONCASH_CLIENT_SECRET', 'your_moncash_client_secret');

    define('NATCASH_API_KEY', 'your_natcash_api_key');
}

