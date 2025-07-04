<?php
/**
 * API for Subscription Management System
 * This API handles user authentication, subscription management, profile management, and more.
 */
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

require_once 'config.php';

$action = $_GET['action'] ?? '';
$response = ['success' => false, 'message' => ''];

function getJsonInput() {
    return json_decode(file_get_contents('php://input'), true) ?? [];
}

function validateInput($fields, $data) {
    foreach ($fields as $field) {
        if (!isset($data[$field]) || $data[$field] === '') {
            return false;
        }
    }
    return true;
}

try {
    $pdo = new PDO("mysql:host=".DB_HOST.";dbname=".DB_NAME, DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    switch ($action) {
        // User Authentication
        case 'login':
            $data = getJsonInput();
            if (!validateInput(['email', 'password'], $data)) {
                $response['message'] = 'Email and password required';
                break;
            }
            $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
            $stmt->execute([$data['email']]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($user && password_verify($data['password'], $user['password'])) {
                $response = [
                    'success' => true,
                    'user' => [
                        'id' => $user['id'],
                        'name' => $user['name'],
                        'email' => $user['email'],
                        'is_admin' => (bool)$user['is_admin']
                    ]
                ];
            } else {
                $response['message'] = 'Invalid email or password';
            }
            break;

        case 'signup':
            $data = getJsonInput();
            if (!validateInput(['name', 'email', 'password'], $data)) {
                $response['message'] = 'Name, email, and password required';
                break;
            }
            $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
            $stmt->execute([$data['email']]);
            if ($stmt->fetch()) {
                $response['message'] = 'Email already exists';
            } else {
                $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);
                $stmt = $pdo->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
                $stmt->execute([$data['name'], $data['email'], $hashedPassword]);
                $response = ['success' => true, 'message' => 'User registered successfully'];
            }
            break;

        // Subscription Endpoints
        case 'get_subscriptions':
            $userId = $_GET['user_id'] ?? 0;
            $stmt = $pdo->prepare("
                SELECT s.*, p.name as plan_name, p.price, sv.name as service_name 
                FROM subscriptions s
                JOIN plans p ON s.plan_id = p.id
                JOIN services sv ON p.service_id = sv.id
                WHERE s.user_id = ? AND s.status = 'active'
            ");
            $stmt->execute([$userId]);
            $response = ['success' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)];
            break;

        case 'create_subscription':
            $data = getJsonInput();
            if (!validateInput(['user_id', 'plan_id', 'payment_method', 'transaction_id'], $data)) {
                $response['message'] = 'Missing required fields';
                break;
            }
            $pdo->beginTransaction();
            try {
                $stmt = $pdo->prepare("
                    INSERT INTO payments (user_id, plan_id, amount, payment_method, transaction_id, status)
                    SELECT ?, id, price, ?, ?, 'completed' FROM plans WHERE id = ?
                ");
                $stmt->execute([$data['user_id'], $data['payment_method'], $data['transaction_id'], $data['plan_id']]);
                $paymentId = $pdo->lastInsertId();
                $startDate = date('Y-m-d');
                $endDate = date('Y-m-d', strtotime('+1 month'));
                $stmt = $pdo->prepare("
                    INSERT INTO subscriptions (user_id, plan_id, payment_id, start_date, end_date, status)
                    VALUES (?, ?, ?, ?, ?, 'active')
                ");
                $stmt->execute([$data['user_id'], $data['plan_id'], $paymentId, $startDate, $endDate]);
                $pdo->commit();
                $response = ['success' => true, 'message' => 'Subscription created successfully'];
            } catch (Exception $e) {
                $pdo->rollBack();
                $response['message'] = 'Failed to create subscription: ' . $e->getMessage();
            }
            break;

        case 'cancel_subscription':
            $data = getJsonInput();
            $subscriptionId = $data['subscription_id'] ?? ($_POST['subscription_id'] ?? 0);
            $stmt = $pdo->prepare("UPDATE subscriptions SET status = 'cancelled' WHERE id = ?");
            $stmt->execute([$subscriptionId]);
            $response = ['success' => true, 'message' => 'Subscription cancelled successfully'];
            break;

        // Profile Endpoints
        case 'get_profiles':
            $userId = $_GET['user_id'] ?? 0;
            $stmt = $pdo->prepare("
                SELECT p.*, s.name as service_name 
                FROM profiles p
                JOIN services s ON p.service_id = s.id
                WHERE p.user_id = ?
            ");
            $stmt->execute([$userId]);
            $response = ['success' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)];
            break;

        case 'create_profile':
            $data = getJsonInput();
            if (!validateInput(['user_id', 'service_id', 'profile_name'], $data)) {
                $response['message'] = 'Missing required fields';
                break;
            }
            $stmt = $pdo->prepare("INSERT INTO profiles (user_id, service_id, profile_name) VALUES (?, ?, ?)");
            $stmt->execute([$data['user_id'], $data['service_id'], $data['profile_name']]);
            $response = ['success' => true, 'message' => 'Profile created successfully'];
            break;

        case 'delete_profile':
            $profileId = $_POST['profile_id'] ?? 0;
            $stmt = $pdo->prepare("DELETE FROM profiles WHERE id = ?");
            $stmt->execute([$profileId]);
            $response = ['success' => true, 'message' => 'Profile deleted successfully'];
            break;

        // Notification Endpoints
        case 'get_unread_count':
            $userId = $_GET['user_id'] ?? 0;
            $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = FALSE");
            $stmt->execute([$userId]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            $response = ['success' => true, 'count' => $result['count'] ?? 0];
            break;

        case 'get_notifications':
            $userId = $_GET['user_id'] ?? 0;
            $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
            $query = "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT " . intval($limit);
            $stmt = $pdo->prepare($query);
            $stmt->execute([$userId]);
            $response = ['success' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)];
            break;

        case 'mark_notification_read':
            $notificationId = $_POST['notification_id'] ?? 0;
            $stmt = $pdo->prepare("UPDATE notifications SET is_read = TRUE WHERE id = ?");
            $stmt->execute([$notificationId]);
            $response = ['success' => true, 'message' => 'Notification marked as read'];
            break;

        // Recommendations, Tips, News, FAQs, Feedback
        case 'get_recommendations':
            $userId = $_GET['user_id'] ?? 0;
            $stmt = $pdo->prepare("
                SELECT p.name as plan_name, s.name as service_name 
                FROM subscriptions sub
                JOIN plans p ON sub.plan_id = p.id
                JOIN services s ON p.service_id = s.id
                WHERE sub.user_id = ? AND sub.status = 'active'
            ");
            $stmt->execute([$userId]);
            $subscriptions = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $recommendations = [];
            if (count($subscriptions) > 0) {
                $recommendations[] = [
                    'title' => 'Upgrade to VIP',
                    'description' => 'Save 20% by upgrading to our VIP package',
                    'action_url' => '#plans',
                    'action_text' => 'View Plans'
                ];
                $recommendations[] = [
                    'title' => 'Try Disney+',
                    'description' => 'Based on your Netflix usage, you might enjoy Disney+',
                    'action_url' => '#services',
                    'action_text' => 'Browse Services'
                ];
            }
            $response = ['success' => true, 'data' => $recommendations];
            break;

        case 'get_tips':
            $stmt = $pdo->query("
                SELECT * FROM news 
                WHERE type = 'tip' AND published_at IS NOT NULL AND published_at <= NOW()
                ORDER BY published_at DESC LIMIT 6
            ");
            $response = ['success' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)];
            break;

        case 'get_news':
            $stmt = $pdo->query("
                SELECT * FROM news 
                WHERE type IN ('news', 'announcement') AND published_at IS NOT NULL AND published_at <= NOW()
                ORDER BY published_at DESC LIMIT 5
            ");
            $response = ['success' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)];
            break;

        case 'get_faqs':
            $response = [
                'success' => true,
                'data' => [
                    [
                        'question' => 'How do I change my subscription plan?',
                        'answer' => 'You can upgrade or downgrade your plan at any time from the Subscriptions page.',
                        'related_link' => '#subscriptions'
                    ],
                    [
                        'question' => 'When will I be billed for my subscription?',
                        'answer' => 'Subscriptions are billed on the same date each month that you originally signed up.',
                        'related_link' => '#subscriptions'
                    ],
                    [
                        'question' => 'How many devices can stream simultaneously?',
                        'answer' => 'This depends on your plan. Basic plans allow 1 stream, VIP allows 3, and Premium allows 5.',
                        'related_link' => '#plans'
                    ]
                ]
            ];
            break;

        case 'submit_feedback':
            $data = getJsonInput();
            if (!validateInput(['user_id', 'name', 'email', 'subject', 'message'], $data)) {
                $response['message'] = 'Missing required fields';
                break;
            }
            $stmt = $pdo->prepare("
                INSERT INTO feedbacks (user_id, name, email, subject, message)
                VALUES (?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $data['user_id'],
                $data['name'],
                $data['email'],
                $data['subject'],
                $data['message']
            ]);
            $response = ['success' => true, 'message' => 'Feedback submitted successfully'];
            break;

        // Admin endpoints and other cases...
        // ...existing code for admin endpoints...
        default:
            $response['message'] = 'Invalid action';
    }
} catch (PDOException $e) {
    $response['message'] = 'Database error: ' . $e->getMessage();
} catch (Exception $e) {
    $response['message'] = 'Error: ' . $e->getMessage();
}

echo json_encode($response);
?>