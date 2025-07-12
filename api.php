<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

require_once 'config.php';

$action = $_GET['action'] ?? '';
$response = ['success' => false, 'message' => ''];

try {
    //$pdo = new PDO("mysql:host=".DB_HOST.";dbname=".DB_NAME, DB_USER, DB_PASS);
    //$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo = new PDO("mysql:host=".DB_HOST.";dbname=".DB_NAME, DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    switch ($action) {
        // User endpoints
        case 'login':
            $data = json_decode(file_get_contents('php://input'), true);
            $email = $data['email'] ?? '';
            $password = $data['password'] ?? '';

            $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
            $stmt->execute([$email]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user && password_verify($password, $user['password'])) {
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
            $data = json_decode(file_get_contents('php://input'), true);
            $name = $data['name'] ?? '';
            $email = $data['email'] ?? '';
            $password = $data['password'] ?? '';

            // Check if email exists
            $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
            $stmt->execute([$email]);
            
            if ($stmt->fetch()) {
                $response['message'] = 'Email already exists';
            } else {
                $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
                $stmt = $pdo->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
                $stmt->execute([$name, $email, $hashedPassword]);
                
                $response = [
                    'success' => true,
                    'message' => 'User registered successfully'
                ];
            }
            break;

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
            $subscriptions = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            $response = [
                'success' => true,
                'data' => $subscriptions
            ];
            break;

        case 'get_profiles':
            $userId = $_GET['user_id'] ?? 0;
            
            $stmt = $pdo->prepare("
                SELECT p.*, s.name as service_name 
                FROM profiles p
                JOIN services s ON p.service_id = s.id
                WHERE p.user_id = ?
            ");
            $stmt->execute([$userId]);
            $profiles = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            $response = [
                'success' => true,
                'data' => $profiles
            ];
            break;

        case 'create_profile':
            $data = json_decode(file_get_contents('php://input'), true);
            $userId = $data['user_id'] ?? 0;
            $serviceId = $data['service_id'] ?? 0;
            $profileName = $data['profile_name'] ?? '';
            
            $stmt = $pdo->prepare("INSERT INTO profiles (user_id, service_id, profile_name) VALUES (?, ?, ?)");
            $stmt->execute([$userId, $serviceId, $profileName]);
            
            $response = [
                'success' => true,
                'message' => 'Profile created successfully'
            ];
            break;

        case 'request_profile':
            $data = json_decode(file_get_contents('php://input'), true);
            $userId = $data['user_id'] ?? 0;
            $serviceId = $data['service_id'] ?? 0;
            $profileName = $data['profile_name'] ?? '';
            $reason = $data['reason'] ?? '';
            
            $stmt = $pdo->prepare("INSERT INTO profile_requests (user_id, service_id, profile_name, reason) VALUES (?, ?, ?, ?)");
            $stmt->execute([$userId, $serviceId, $profileName, $reason]);
            
            $response = [
                'success' => true,
                'message' => 'Profile request submitted successfully'
            ];
            break;

        case 'delete_profile':
            $profileId = $_POST['profile_id'] ?? 0;
            $stmt = $pdo->prepare("DELETE FROM profiles WHERE id = ?");
            $stmt->execute([$profileId]);
            $response = [
                'success' => true,
                'message' => 'Profile deleted successfully'
            ];
            break;

        case 'create_subscription':
            $data = json_decode(file_get_contents('php://input'), true);
            $userId = $data['user_id'] ?? 0;
            $planId = $data['plan_id'] ?? 0;
            $paymentMethod = $data['payment_method'] ?? '';
            $transactionId = $data['transaction_id'] ?? '';
            
            // Start transaction
            $pdo->beginTransaction();
            
            try {
                // Create payment record
                $stmt = $pdo->prepare("
                    INSERT INTO payments (user_id, plan_id, amount, payment_method, transaction_id, status)
                    SELECT ?, id, price, ?, ?, 'completed' FROM plans WHERE id = ?
                ");
                $stmt->execute([$userId, $paymentMethod, $transactionId, $planId]);
                $paymentId = $pdo->lastInsertId();
                
                // Create subscription
                $startDate = date('Y-m-d');
                $endDate = date('Y-m-d', strtotime('+1 month'));
                
                $stmt = $pdo->prepare("
                    INSERT INTO subscriptions (user_id, plan_id, payment_id, start_date, end_date, status)
                    VALUES (?, ?, ?, ?, ?, 'active')
                ");
                $stmt->execute([$userId, $planId, $paymentId, $startDate, $endDate]);
                
                $pdo->commit();
                
                $response = [
                    'success' => true,
                    'message' => 'Subscription created successfully'
                ];
            } catch (Exception $e) {
                $pdo->rollBack();
                $response['message'] = 'Failed to create subscription: ' . $e->getMessage();
            }
            break;

        case 'cancel_subscription':
            $subscriptionId = $_POST['subscription_id'] ?? 0;
            $stmt = $pdo->prepare("UPDATE subscriptions SET status = 'canceled' WHERE id = ?");
            $stmt->execute([$subscriptionId]);
            $response = [
                'success' => true,
                'message' => 'Subscription canceled successfully'
            ];
            break;
        
        // Notifications
        case 'get_unread_count':
            $userId = $_GET['user_id'] ?? 0;
                
            $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = FALSE");
            $stmt->execute([$userId]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
                
            $response = [
                'success' => true,
                'count' => $result['count'] ?? 0
            ];
            break;

        case 'get_notifications':
                $userId = $_GET['user_id'] ?? 0;
                $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
                $unreadOnly = $_GET['unread_only'] ?? false;

                $query = "SELECT * FROM notifications WHERE user_id = ?";
                $params = [$userId];

                if ($unreadOnly) {
                    $query .= " AND is_read = FALSE";
                }

                //$query .= " ORDER BY created_at DESC LIMIT ?";
                //$params[] = $limit;
                $query .= " ORDER BY created_at DESC LIMIT " . intval($limit);

                $stmt = $pdo->prepare($query);
                $stmt->execute($params);
                
                $response = [
                    'success' => true,
                    'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)
                ];
            break;

        case 'mark_notification_read':
                $notificationId = $_POST['notification_id'] ?? 0;
                
                $stmt = $pdo->prepare("UPDATE notifications SET is_read = TRUE WHERE id = ?");
                $stmt->execute([$notificationId]);
                
                $response = [
                    'success' => true,
                    'message' => 'Notification marked as read'
                ];
            break;

        case 'mark_all_notifications_read':
                $userId = $_POST['user_id'] ?? 0;
                
                $stmt = $pdo->prepare("UPDATE notifications SET is_read = TRUE WHERE user_id = ? AND is_read = FALSE");
                $stmt->execute([$userId]);
                
                $response = [
                    'success' => true,
                    'message' => 'All notifications marked as read'
                ];
            break;

        // Recommendations, Tips, News, FAQs, Feedback
        case 'get_recommendations':
                $userId = $_GET['user_id'] ?? 0;
                
                // In a real app, you would generate personalized recommendations
                $stmt = $pdo->prepare("
                    SELECT p.name as plan_name, s.name as service_name 
                    FROM subscriptions sub
                    JOIN plans p ON sub.plan_id = p.id
                    JOIN services s ON p.service_id = s.id
                    WHERE sub.user_id = ? AND sub.status = 'active'
                ");
                $stmt->execute([$userId]);
                $subscriptions = $stmt->fetchAll(PDO::FETCH_ASSOC);
                
                // Generate some basic recommendations
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
                
                $response = [
                    'success' => true,
                    'data' => $recommendations
                ];
                break;

            case 'get_tips':
                $stmt = $pdo->query("
                    SELECT * FROM news 
                    WHERE type = 'tip' AND published_at IS NOT NULL AND published_at <= NOW()
                    ORDER BY published_at DESC LIMIT 6
                ");
                $response = [
                    'success' => true,
                    'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)
                ];
                break;

            case 'get_news':
                $stmt = $pdo->query("
                    SELECT * FROM news 
                    WHERE type IN ('news', 'announcement') AND published_at IS NOT NULL AND published_at <= NOW()
                    ORDER BY published_at DESC LIMIT 5
                ");
                $response = [
                    'success' => true,
                    'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)
                ];
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
                $data = json_decode(file_get_contents('php://input'), true);
                
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
                
                $response = [
                    'success' => true,
                    'message' => 'Feedback submitted successfully'
                ];
                break;

            case 'renew_subscription':
                $data = json_decode(file_get_contents('php://input'), true);
                $subscriptionId = $data['subscription_id'] ?? 0;
                $paymentMethod = $data['payment_method'] ?? '';
                $transactionId = $data['transaction_id'] ?? '';

                // Start transaction
                $pdo->beginTransaction();

                try {
                    // Get subscription details
                    $stmt = $pdo->prepare("SELECT user_id, plan_id FROM subscriptions WHERE id = ?");
                    $stmt->execute([$subscriptionId]);
                    $subscription = $stmt->fetch(PDO::FETCH_ASSOC);

                    if (!$subscription) {
                        throw new Exception('Subscription not found');
                    }

                    // Create payment record
                    $stmt = $pdo->prepare("
                        INSERT INTO payments (user_id, plan_id, amount, payment_method, transaction_id, status)
                        SELECT ?, id, price, ?, ?, 'completed' FROM plans WHERE id = ?
                    ");
                    $stmt->execute([$subscription['user_id'], $paymentMethod, $transactionId, $subscription['plan_id']]);
                    $paymentId = $pdo->lastInsertId();

                    // Update subscription end date
                    $stmt = $pdo->prepare("UPDATE subscriptions SET end_date = DATE_ADD(end_date, INTERVAL 1 MONTH), payment_id = ? WHERE id = ?");
                    $stmt->execute([$paymentId, $subscriptionId]);

                    $pdo->commit();

                    $response = [
                        'success' => true,
                        'message' => 'Subscription renewed successfully'
                    ];
                } catch (Exception $e) {
                    $pdo->rollBack();
                    throw new Exception('Failed to renew subscription: ' . $e->getMessage());
                }
                break;

            case 'cancel_subscription':
                $data = json_decode(file_get_contents('php://input'), true);
                $subscriptionId = $data['subscription_id'] ?? 0;

                // Check if subscription exists
                $stmt = $pdo->prepare("SELECT id FROM subscriptions WHERE id = ?");
                $stmt->execute([$subscriptionId]);

                if (!$stmt->fetch()) {
                    $response['message'] = 'Subscription not found';
                } else {
                    $stmt = $pdo->prepare("UPDATE subscriptions SET status = 'cancelled' WHERE id = ?");
                    $stmt->execute([$subscriptionId]);

                    $response = [
                        'success' => true,
                        'message' => 'Subscription cancelled successfully'
                    ];
                }
                break;

            case 'request_profile': 
                $data = json_decode(file_get_contents('php://input'), true);
                $userId = $data['user_id'] ?? 0;
                $serviceId = $data['service_id'] ?? 0;
                $name = $data['name'] ?? '';

                // Check if user exists
                $stmt = $pdo->prepare("SELECT id FROM users WHERE id = ?");
                $stmt->execute([$userId]);

                if (!$stmt->fetch()) {
                    $response['message'] = 'User not found';
                } else {
                    // Create profile request
                    $stmt = $pdo->prepare("INSERT INTO profile_requests (user_id, service_id, name) VALUES (?, ?, ?)");
                    $stmt->execute([$userId, $serviceId, $name]);

                    $response = [
                        'success' => true,
                        'message' => 'Profile request submitted successfully'
                    ];
                }
                break;

            case 'get_news_item':
                $newsId = $_GET['news_id'] ?? 0;
                $stmt = $pdo->prepare("SELECT * FROM news WHERE id = ? AND (published_at IS NULL OR published_at <= NOW())");
                $stmt->execute([$newsId]);
                $news = $stmt->fetch(PDO::FETCH_ASSOC);
                if ($news) {
                    $response = [
                        'success' => true,
                        'data' => $news
                    ];
                } else {
                    $response['message'] = 'News item not found or not published yet';
                }
                break;

            case 'update_profile':
            case 'change_password':

            $data = json_decode(file_get_contents('php://input'), true);
            $userId = $data['user_id'] ?? 0;

            // Check if user exists
            $stmt = $pdo->prepare("SELECT id FROM users WHERE id = ?");
            $stmt->execute([$userId]);

            if (!$stmt->fetch()) {
                $response['message'] = 'User not found';
            } else {
                // Update profile or change password
                if ($action === 'update_profile') {
                    $name = $data['name'] ?? '';
                    $email = $data['email'] ?? '';

                    $stmt = $pdo->prepare("UPDATE users SET name = ?, email = ? WHERE id = ?");
                    $stmt->execute([$name, $email, $userId]);

                    $response = [
                        'success' => true,
                        'message' => 'Profile updated successfully'
                    ];
                } elseif ($action === 'change_password') {
                    $password = $data['password'] ?? '';

                    $stmt = $pdo->prepare("UPDATE users SET password = ? WHERE id = ?");
                    $stmt->execute([$password, $userId]);

                    $response = [
                        'success' => true,
                        'message' => 'Password changed successfully'
                    ];
                }
            }

        // Admin endpoints
                case 'admin_dashboard_stats':
            // Total revenue
            $stmt = $pdo->query("SELECT IFNULL(SUM(amount),0) as total FROM payments WHERE status = 'completed'");
            $totalRevenue = $stmt->fetchColumn();

            // Active users
            $stmt = $pdo->query("SELECT COUNT(*) FROM users WHERE is_active = 1");
            $activeUsers = $stmt->fetchColumn();

            // Active subscriptions
            $stmt = $pdo->query("SELECT COUNT(*) FROM subscriptions WHERE status = 'active'");
            $subscriptions = $stmt->fetchColumn();

            // Renewals due (subscriptions expiring in next 7 days)
            $stmt = $pdo->query("SELECT COUNT(*) FROM subscriptions WHERE status = 'active' AND end_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)");
            $renewalsDue = $stmt->fetchColumn();

            $response = [
                'success' => true,
                'totalRevenue' => "G" . number_format($totalRevenue, 0),
                'activeUsers' => (int)$activeUsers,
                'subscriptions' => (int)$subscriptions,
                'renewalsDue' => (int)$renewalsDue
            ];
            break;

        case 'admin_dashboard_charts':
            // Revenue over last 12 months
            $stmt = $pdo->query("
                SELECT DATE_FORMAT(created_at, '%Y-%m') as month, SUM(amount) as total
                FROM payments
                WHERE status = 'completed'
                GROUP BY month
                ORDER BY month DESC
                LIMIT 12
            ");
            $revenueRows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $revenueRows = array_reverse($revenueRows); // chronological order

            $revenueLabels = [];
            $revenueData = [];
            foreach ($revenueRows as $row) {
                $revenueLabels[] = $row['month'];
                $revenueData[] = (float)$row['total'];
            }

            // Service Distribution (active subscriptions per service)
            $stmt = $pdo->query("
                SELECT sv.name, COUNT(s.id) as count
                FROM subscriptions s
                JOIN plans p ON s.plan_id = p.id
                JOIN services sv ON p.service_id = sv.id
                WHERE s.status = 'active'
                GROUP BY sv.name
            ");
            $serviceRows = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $serviceLabels = [];
            $serviceData = [];
            foreach ($serviceRows as $row) {
                $serviceLabels[] = $row['name'];
                $serviceData[] = (int)$row['count'];
            }

            $response = [
                'success' => true,
                'revenue' => [
                    'labels' => $revenueLabels,
                    'datasets' => [[
                        'label' => 'Revenue',
                        'data' => $revenueData,
                        'backgroundColor' => 'rgba(54, 162, 235, 0.2)',
                        'borderColor' => 'rgba(54, 162, 235, 1)',
                        'fill' => true,
                        'tension' => 0.4
                    ]]
                ],
                'serviceDistribution' => [
                    'labels' => $serviceLabels,
                    'datasets' => [[
                        'label' => 'Active Subscriptions',
                        'data' => $serviceData,
                        'backgroundColor' => [
                            '#36a2eb', '#ff6384', '#ffcd56', '#4bc0c0', '#9966ff', '#ff9f40'
                        ]
                    ]]
                ]
            ];
            break;

        case 'admin_dashboard_activity':
            // Recent activity logs (last 15)
            $stmt = $pdo->query("
                SELECT a.*, u.name as user, u.avatar_url
                FROM activity_logs a
                LEFT JOIN users u ON a.user_id = u.id
                ORDER BY a.created_at DESC
                LIMIT 15
            ");
            $logs = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $activity = [];
            foreach ($logs as $log) {
                $activity[] = [
                    'user' => $log['user'] ?? 'System',
                    'avatar' => $log['avatar_url'] ?? '',
                    'action' => $log['activity_type'],
                    'service' => $log['description'],
                    'time' => date('M d, H:i', strtotime($log['created_at']))
                ];
            }

            $response = [
                'success' => true,
                'data' => $activity
            ];
            break;

        case 'admin_get_users':
            $stmt = $pdo->query("SELECT id, name, email, created_at, is_active FROM users");
            $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            $response = [
                'success' => true,
                'data' => $users
            ];
            break;     

        case 'admin_get_subscriptions':
            $stmt = $pdo->query("
                SELECT s.*, u.name as user_name, p.name as plan_name, sv.name as service_name 
                FROM subscriptions s
                JOIN users u ON s.user_id = u.id
                JOIN plans p ON s.plan_id = p.id
                JOIN services sv ON p.service_id = sv.id
            ");
            $subscriptions = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            $response = [
                'success' => true,
                'data' => $subscriptions
            ];
            break;

        case 'admin_get_profiles':
            $stmt = $pdo->query("
                SELECT p.*, s.name as service_name, u.name as user_name 
                FROM profiles p
                LEFT JOIN services s ON p.service_id = s.id
                LEFT JOIN users u ON p.user_id = u.id
            ");
            $profiles = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            $response = [
                'success' => true,
                'data' => $profiles
            ];
            break;

        case 'admin_assign_profile':
            $data = json_decode(file_get_contents('php://input'), true);
            $profileId = $data['profile_id'] ?? 0;
            $userId = $data['user_id'] ?? 0;
            
            $stmt = $pdo->prepare("UPDATE profiles SET user_id = ? WHERE id = ?");
            $stmt->execute([$userId, $profileId]);
            
            $response = [
                'success' => true,
                'message' => 'Profile assigned successfully'
            ];
            break;

        case 'admin_revoke_profile':
            $data = json_decode(file_get_contents('php://input'), true);
            $profileId = $data['profile_id'] ?? 0;

            // Check if profile exists
            $stmt = $pdo->prepare("SELECT id FROM profiles WHERE id = ?");
            $stmt->execute([$profileId]);

            if (!$stmt->fetch()) {
                $response['message'] = 'Profile not found';
            } else {
                $stmt = $pdo->prepare("UPDATE profiles SET user_id = NULL WHERE id = ?");
                $stmt->execute([$profileId]);

                $response = [
                    'success' => true,
                    'message' => 'Profile revoked successfully'
                ];
            }
            break;

        case 'admin_add_profile':
            $data = json_decode(file_get_contents('php://input'), true);
            $userId = $data['user_id'] ?? 0;
            $serviceId = $data['service_id'] ?? 0;
            $name = $data['name'] ?? '';

            // Check if user exists
            $stmt = $pdo->prepare("SELECT id FROM users WHERE id = ?");
            $stmt->execute([$userId]);
            
            if (!$stmt->fetch()) {
                $response['message'] = 'User not found';
            } else {
                $stmt = $pdo->prepare("INSERT INTO profiles (user_id, service_id, name) VALUES (?, ?, ?)");
                $stmt->execute([$userId, $serviceId, $name]);
                
                $response = [
                    'success' => true,
                    'message' => 'Profile created successfully'
                ];
            }
            break;        
        
        case 'log_activity':
                $data = json_decode(file_get_contents('php://input'), true);
                
                $stmt = $pdo->prepare("
                    INSERT INTO activity_logs (user_id, activity_type, description, ip_address, user_agent)
                    VALUES (?, ?, ?, ?, ?)
                ");
                $stmt->execute([
                    $data['user_id'],
                    $data['activity_type'],
                    $data['description'],
                    $_SERVER['REMOTE_ADDR'],
                    $_SERVER['HTTP_USER_AGENT'] ?? ''
                ]);
                
                $response = ['success' => true];
            break;
            
        case 'admin_add_user':
            $data = json_decode(file_get_contents('php://input'), true);
            $name = $data['name'] ?? '';
            $email = $data['email'] ?? '';
            $password = $data['password'] ?? '';
            $isAdmin = isset($data['is_admin']) ? (bool)$data['is_admin'] : false;

            // Check if email exists
            $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
            $stmt->execute([$email]);
            
            if ($stmt->fetch()) {
                $response['message'] = 'Email already exists';
            } else {
                $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
                $stmt = $pdo->prepare("INSERT INTO users (name, email, password, is_admin) VALUES (?, ?, ?, ?)");
                $stmt->execute([$name, $email, $hashedPassword, $isAdmin]);
                
                $response = [
                    'success' => true,
                    'message' => 'User added successfully'
                ];
            }
            break;  
            
        case 'admin_edit_user':
            $data = json_decode(file_get_contents('php://input'), true);
            $userId = $data['id'] ?? 0;
            $name = $data['name'] ?? '';
            $email = $data['email'] ?? '';
            $isAdmin = isset($data['is_admin']) ? (bool)$data['is_admin'] : false;

            $stmt = $pdo->prepare("UPDATE users SET name = ?, email = ?, is_admin = ? WHERE id = ?");
            $stmt->execute([$name, $email, $isAdmin, $userId]);

            $response = [
                'success' => true,
                'message' => 'User updated successfully'
            ];
            break;

        case 'admin_delete_user':
            $userId = $_POST['user_id'] ?? 0;

            // Check if user exists
            $stmt = $pdo->prepare("SELECT id FROM users WHERE id = ?");
            $stmt->execute([$userId]);
            
            if (!$stmt->fetch()) {
                $response['message'] = 'User not found';
            } else {
                $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
                $stmt->execute([$userId]);
                
                $response = [
                    'success' => true,
                    'message' => 'User deleted successfully'
                ];
            }
            break;

        case 'admin_add_subscription':
            $data = json_decode(file_get_contents('php://input'), true);
            $userId = $data['user_id'] ?? 0;
            $planId = $data['plan_id'] ?? 0;
            $startDate = date('Y-m-d');
            $endDate = date('Y-m-d', strtotime('+1 month'));

            // Check if user exists
            $stmt = $pdo->prepare("SELECT id FROM users WHERE id = ?");
            $stmt->execute([$userId]);
            
            if (!$stmt->fetch()) {
                $response['message'] = 'User not found';
            } else {
                // Create subscription
                $stmt = $pdo->prepare("
                    INSERT INTO subscriptions (user_id, plan_id, start_date, end_date, status)
                    VALUES (?, ?, ?, ?, 'active')
                ");
                $stmt->execute([$userId, $planId, $startDate, $endDate]);
                
                $response = [
                    'success' => true,
                    'message' => 'Subscription created successfully'
                ];
            }
            break;

        case 'admin_cancel_subscription':
            $data = json_decode(file_get_contents('php://input'), true);
            $subscriptionId = $data['subscription_id'] ?? 0;

            // Check if subscription exists
            $stmt = $pdo->prepare("SELECT id FROM subscriptions WHERE id = ?");
            $stmt->execute([$subscriptionId]);
            
            if (!$stmt->fetch()) {
                $response['message'] = 'Subscription not found';
            } else {
                $stmt = $pdo->prepare("UPDATE subscriptions SET status = 'cancelled' WHERE id = ?");
                $stmt->execute([$subscriptionId]);
                
                $response = [
                    'success' => true,
                    'message' => 'Subscription cancelled successfully'
                ];
            }
            break;
        
        case 'admin_get_user_subscriptions':
            $userId = $_POST['user_id'] ?? 0;

            // Check if user exists
            $stmt = $pdo->prepare("SELECT id FROM users WHERE id = ?");
            $stmt->execute([$userId]);

            if (!$stmt->fetch()) {
                $response['message'] = 'User not found';
            } else {
                $stmt = $pdo->prepare("
                    SELECT s.* FROM subscriptions s
                    JOIN users u ON s.user_id = u.id
                    WHERE u.id = ?
                ");
                $stmt->execute([$userId]);
                $subscriptions = $stmt->fetchAll(PDO::FETCH_ASSOC);

                $response = [
                    'success' => true,
                    'data' => $subscriptions
                ];
            }
            break; 
        
        case 'admin_update_subscription_status':
            $data = json_decode(file_get_contents('php://input'), true);
            $subscriptionId = $data['subscription_id'] ?? 0;
            $status = $data['status'] ?? '';

            $validStatuses = ['active', 'cancelled', 'expired'];
            if (!in_array($status, $validStatuses)) {
                $response['message'] = 'Invalid status';
            } else {
                $stmt = $pdo->prepare("UPDATE subscriptions SET status = ? WHERE id = ?");
                $stmt->execute([$status, $subscriptionId]);

                $response = [
                    'success' => true,
                    'message' => 'Subscription status updated successfully'
                ];
            }
            break;

        case 'admin_update_subscription':
            $data = json_decode(file_get_contents('php://input'), true);
            $subscriptionId = $data['subscription_id'] ?? 0;
            $endDate = $data['end_date'] ?? '';
            $status = $data['status'] ?? '';

            // Validate status
            $validStatuses = ['active', 'expired', 'pending', 'cancelled'];
            if (!in_array($status, $validStatuses)) {
                $response['message'] = 'Invalid status';
                break;
            }

            // Check if subscription exists
            $stmt = $pdo->prepare("SELECT id FROM subscriptions WHERE id = ?");
            $stmt->execute([$subscriptionId]);
            if (!$stmt->fetch()) {
                $response['message'] = 'Subscription not found';
            } else {
                $stmt = $pdo->prepare("UPDATE subscriptions SET end_date = ?, status = ? WHERE id = ?");
                $stmt->execute([$endDate, $status, $subscriptionId]);
                $response = [
                    'success' => true,
                    'message' => 'Subscription updated successfully'
                ];
            }
            break;

        case 'admin_send_renewal_reminders':
            $data = json_decode(file_get_contents('php://input'), true);
            $customMessage = $data['message'] ?? '';

            // Find all users with subscriptions expiring in the next 7 days and not cancelled
            $stmt = $pdo->prepare("
                SELECT s.id as subscription_id, s.user_id, u.name, u.email, s.end_date
                FROM subscriptions s
                JOIN users u ON s.user_id = u.id
                WHERE s.status = 'active'
                AND s.end_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)
            ");
            $stmt->execute();
            $expiringSubs = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $reminderCount = 0;
            foreach ($expiringSubs as $sub) {
                // Compose the reminder message
                $title = "Subscription Renewal Reminder";
                $message = "Dear {$sub['name']}, your subscription will expire on {$sub['end_date']}.";
                if ($customMessage) {
                    $message .= " " . $customMessage;
                }
                $type = 'reminder';
                $isRead = 0;
                $relatedEntityType = 'subscription';
                $relatedEntityId = $sub['subscription_id'];

                // Insert notification for the user
                $stmtNotif = $pdo->prepare("
                    INSERT INTO notifications 
                        (user_id, title, message, type, is_read, related_entity_type, related_entity_id, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
                ");
                $stmtNotif->execute([
                    $sub['user_id'],
                    $title,
                    $message,
                    $type,
                    $isRead,
                    $relatedEntityType,
                    $relatedEntityId
                ]);
                $reminderCount++;
            }

            $response = [
                'success' => true,
                'message' => "Renewal reminders sent to {$reminderCount} user(s)."
            ];
            break;

        case 'admin_get_payments':
            $stmt = $pdo->query("
                SELECT p.*, u.name as user_name, pl.name as plan_name, sv.name as service_name 
                FROM payments p
                JOIN users u ON p.user_id = u.id
                JOIN plans pl ON p.plan_id = pl.id
                JOIN services sv ON pl.service_id = sv.id
                ORDER BY p.created_at DESC
            ");
            $payments = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            $response = [
                'success' => true,
                'data' => $payments
            ];
            break;

        case 'admin_get_reports':
            $stmt = $pdo->query("
                SELECT r.*, u.name as user_name 
                FROM reports r
                JOIN users u ON r.user_id = u.id
                ORDER BY r.created_at DESC
            ");
            $reports = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            $response = [
                'success' => true,
                'data' => $reports
            ];
            break;

        case 'admin_get_news':
            $stmt = $pdo->query("
                SELECT * FROM news 
                WHERE type IN ('news', 'announcement') AND published_at IS NOT NULL AND published_at <= NOW()
                ORDER BY published_at DESC
            ");
            $news = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            $response = [
                'success' => true,
                'data' => $news
            ];
            break;

        case 'admin_add_news':
            $data = json_decode(file_get_contents('php://input'), true);
            $title = $data['title'] ?? '';
            $content = $data['content'] ?? '';
            $type = $data['type'] ?? 'news';
            $publishedAt = date('Y-m-d H:i:s');

            $stmt = $pdo->prepare("INSERT INTO news (title, content, type, published_at) VALUES (?, ?, ?, ?)");
            $stmt->execute([$title, $content, $type, $publishedAt]);
            
            $response = [
                'success' => true,
                'message' => 'News item added successfully'
            ];
            break;

        case 'admin_delete_news':
            $newsId = $_POST['news_id'] ?? 0;

            // Check if news item exists
            $stmt = $pdo->prepare("SELECT id FROM news WHERE id = ?");
            $stmt->execute([$newsId]);
            
            if (!$stmt->fetch()) {
                $response['message'] = 'News item not found';
            } else {
                $stmt = $pdo->prepare("DELETE FROM news WHERE id = ?");
                $stmt->execute([$newsId]);
                
                $response = [
                    'success' => true,
                    'message' => 'News item deleted successfully'
                ];
            }
            break;
            
        case 'admin_get_feedbacks':
            $stmt = $pdo->query("
                SELECT f.*, u.name as user_name 
                FROM feedbacks f
                JOIN users u ON f.user_id = u.id
                ORDER BY f.created_at DESC
            ");
            $feedbacks = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $response = [
                'success' => true,
                'data' => $feedbacks
            ];
            break;

        case 'admin_respond_feedback':
            $data = json_decode(file_get_contents('php://input'), true);
            $feedbackId = $data['feedback_id'] ?? 0;
            $responseMessage = $data['message'] ?? '';

            $stmt = $pdo->prepare("UPDATE feedbacks SET response = ? WHERE id = ?");
            $stmt->execute([$responseMessage, $feedbackId]);

            $response = [
                'success' => true,
                'message' => 'Feedback response recorded successfully'
            ];
            break;

        case 'admin_get_all_notifications':
            $stmt = $pdo->query("
                SELECT n.*, u.name as user_name 
                FROM notifications n
                JOIN users u ON n.user_id = u.id
                ORDER BY n.created_at DESC
            ");
            $notifications = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $response = [
                'success' => true,
                'data' => $notifications
            ];
            break;

        case 'admin_send_notification':
            $data = json_decode(file_get_contents('php://input'), true);
            $userId = $data['user_id'] ?? 0;
            $message = $data['message'] ?? '';

            $stmt = $pdo->prepare("INSERT INTO notifications (user_id, message) VALUES (?, ?)");
            $stmt->execute([$userId, $message]);

            $response = [
                'success' => true,
                'message' => 'Notification sent successfully'
            ];
            break;

        case 'admin_get_services':
            $stmt = $pdo->query("SELECT * FROM services");
            $services = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            $response = [
                'success' => true,
                'data' => $services
            ];
            break;

        case 'admin_add_service':
            $data = json_decode(file_get_contents('php://input'), true);
            $name = $data['name'] ?? '';
            $description = $data['description'] ?? '';

            $stmt = $pdo->prepare("INSERT INTO services (name, description) VALUES (?, ?)");
            $stmt->execute([$name, $description]);

            $response = [
                'success' => true,
                'message' => 'Service added successfully'
            ];
            break; 

        case 'admin_delete_service':
            $serviceId = $_POST['service_id'] ?? 0;

            // Check if service exists
            $stmt = $pdo->prepare("SELECT id FROM services WHERE id = ?");
            $stmt->execute([$serviceId]);

            if (!$stmt->fetch()) {
                $response['message'] = 'Service not found';
            } else {
                $stmt = $pdo->prepare("DELETE FROM services WHERE id = ?");
                $stmt->execute([$serviceId]);

                $response = [
                    'success' => true,
                    'message' => 'Service deleted successfully'
                ];
            }
            break;

        case 'admin_edit_service':
            $data = json_decode(file_get_contents('php://input'), true);
            $serviceId = $data['id'] ?? 0;
            $name = $data['name'] ?? '';
            $description = $data['description'] ?? '';

            $stmt = $pdo->prepare("UPDATE services SET name = ?, description = ? WHERE id = ?");
            $stmt->execute([$name, $description, $serviceId]);

            $response = [
                'success' => true,
                'message' => 'Service updated successfully'
            ];
            break;

        case 'admin_get_plans':
            $stmt = $pdo->query("SELECT * FROM plans");
            $plans = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $response = [
                'success' => true,
                'data' => $plans
            ];
            break;
        case 'admin_add_plan':
            $data = json_decode(file_get_contents('php://input'), true);
            $name = $data['name'] ?? '';
            $price = $data['price'] ?? 0.0;
            $serviceId = $data['service_id'] ?? 0;

            $stmt = $pdo->prepare("INSERT INTO plans (name, price, service_id) VALUES (?, ?, ?)");
            $stmt->execute([$name, $price, $serviceId]);

            $response = [
                'success' => true,
                'message' => 'Plan added successfully'
            ];
            break;
        case 'admin_delete_plan':
            $planId = $_POST['plan_id'] ?? 0;

            // Check if plan exists
            $stmt = $pdo->prepare("SELECT id FROM plans WHERE id = ?");
            $stmt->execute([$planId]);

            if (!$stmt->fetch()) {
                $response['message'] = 'Plan not found';
            } else {
                $stmt = $pdo->prepare("DELETE FROM plans WHERE id = ?");
                $stmt->execute([$planId]);

                $response = [
                    'success' => true,
                    'message' => 'Plan deleted successfully'
                ];
            }
            break;

        case 'admin_edit_plan':
            $data = json_decode(file_get_contents('php://input'), true);
            $planId = $data['id'] ?? 0;
            $name = $data['name'] ?? '';
            $price = $data['price'] ?? 0.0;
            $serviceId = $data['service_id'] ?? 0;

            $stmt = $pdo->prepare("UPDATE plans SET name = ?, price = ?, service_id = ? WHERE id = ?");
            $stmt->execute([$name, $price, $serviceId, $planId]);

            $response = [
                'success' => true,
                'message' => 'Plan updated successfully'
            ];
            break;
        
        case 'admin_get_streaming_accounts':
            $stmt = $pdo->query("SELECT * FROM streaming_accounts ORDER BY service_name ASC");
            $accounts = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            $response = [
                'success' => true,
                'data' => $accounts
            ];
            break;
 
        case 'admin_add_streaming_account':
            $data = json_decode(file_get_contents('php://input'), true);
            $serviceName = $data['service_name'] ?? '';
            $accountName = $data['account_name'] ?? '';
            $email = $data['email'] ?? '';
            $plan = $data['plan'] ?? '';
            $profileCount = $data['profile_count'] ?? 0;
            $extraMembers = $data['extra_members'] ?? 0;
            $cost = $data['cost'] ?? 0.0;
            $startDate = date('Y-m-d H:i:s');
            $renewDate = date('Y-m-d H:i:s');
            $status = 'active';

            $stmt = $pdo->prepare("
                INSERT INTO streaming_accounts 
                    (service_name, account_name, email, plan, profile_count, extra_members, cost, start_date, renew_date, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $serviceName,
                $accountName,
                $email,
                $plan,
                $profileCount,
                $extraMembers,
                $cost,
                $startDate,
                $renewDate,
                $status
            ]);

            $response = [
                'success' => true,
                'message' => 'Streaming account added successfully'
            ];
            break;
        
        case 'admin_delete_streaming_account':
            $accountId = $_POST['account_id'] ?? 0;

            // Check if account exists
            $stmt = $pdo->prepare("SELECT id FROM streaming_accounts WHERE id = ?");
            $stmt->execute([$accountId]);

            if (!$stmt->fetch()) {
                $response['message'] = 'Account not found';
            } else {
                $stmt = $pdo->prepare("DELETE FROM streaming_accounts WHERE id = ?");
                $stmt->execute([$accountId]);

                $response = [
                    'success' => true,
                    'message' => 'Streaming account deleted successfully'
                ];
            }
            break;

        case 'admin_edit_streaming_account':
            $data = json_decode(file_get_contents('php://input'), true);
            $accountId = $data['id'] ?? 0;
            $serviceName = $data['service_name'] ?? '';
            $accountName = $data['account_name'] ?? '';
            $email = $data['email'] ?? '';
            $plan = $data['plan'] ?? '';
            $profileCount = $data['profile_count'] ?? 0;
            $extraMembers = $data['extra_members'] ?? 0;
            $cost = $data['cost'] ?? 0.0;
            $startDate = $data['start_date'] ?? date('Y-m-d H:i:s');
            $renewDate = $data['renew_date'] ?? date('Y-m-d H:i:s');
            $status = $data['status'] ?? 'active';

            $stmt = $pdo->prepare("
                UPDATE streaming_accounts 
                SET service_name = ?, account_name = ?, email = ?, plan = ?, profile_count = ?, 
                    extra_members = ?, cost = ?, start_date = ?, renew_date = ?, status = ?
                WHERE id = ?
            ");
            $stmt->execute([
                $serviceName,
                $accountName,
                $email,
                $plan,
                $profileCount,
                $extraMembers,
                $cost,
                $startDate,
                $renewDate,
                $status,
                $accountId
            ]); 
            $response = [
                'success' => true,
                'message' => 'Streaming account updated successfully'
            ];
            break;

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