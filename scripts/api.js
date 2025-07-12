/**
 * API Communication Module
 * Handles all API requests and response processing
 * Centralizes API endpoint management and error handling
 */
// API Helper Functions
const API_BASE_URL = 'api.php';

async function apiRequest(endpoint, method = 'GET', data = null, params = {}) {
    let url = `${API_BASE_URL}?action=${endpoint}`;
    
    // Add query parameters if GET request
    if (method === 'GET' && params) {
        const queryParams = new URLSearchParams(params);
        url += `&${queryParams.toString()}`;
    }

    const options = {
        method,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    if (data && method !== 'GET') {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('API request failed:', error);
        return { success: false, message: 'Network error' };
    }
}

// Auth functions
async function loginUser(email, password) {
    return await apiRequest('login', 'POST', { email, password });
}

async function registerUser(name, email, password) {
    return await apiRequest('signup', 'POST', { name, email, password });
}

// Data fetching functions
async function getUserSubscriptions(userId) {
    return await apiRequest('get_subscriptions', 'GET', null, { user_id: userId });
}

async function getUserProfiles(userId) {
    return await apiRequest('get_profiles', 'GET', null, { user_id: userId });
}

async function createSubscription(userId, planId, paymentMethod, transactionId) {
    return await apiRequest('create_subscription', 'POST', {
        user_id: userId,
        plan_id: planId,
        payment_method: paymentMethod,
        transaction_id: transactionId
    });
}

async function updateUserProfile(userId, profileData) {
    return await apiRequest('update_profile', 'POST', {
        user_id: userId,
        ...profileData
    });
}

async function changePassword(userId, currentPassword, newPassword) {
    return await apiRequest('change_password', 'POST', {
        user_id: userId,
        current_password: currentPassword,
        new_password: newPassword
    });
}

// News & Tips functions
async function getRecommendations(userId) {
    return await apiRequest('get_recommendations', 'GET', null, { user_id: userId });
}

async function getTips() {
    return await apiRequest('get_tips', 'GET');
}

async function getNews() {
    return await apiRequest('get_news', 'GET');
}

async function getFAQs() {
    return await apiRequest('get_faqs', 'GET');
}

async function submitFeedback(userId, name, email, subject, message) {
    return await apiRequest('submit_feedback', 'POST', {
        user_id: userId,
        name,
        email,
        subject,
        message
    });
}

// Notification functions
async function getUnreadNotificationCount(userId) {
    return await apiRequest('get_unread_count', 'GET', null, { user_id: userId });
}

async function getNotifications(userId, limit = 10) {
    return await apiRequest('get_notifications', 'GET', null, { user_id: userId, limit });
}

async function markNotificationRead(notificationId) {
    return await apiRequest('mark_notification_read', 'POST', { notification_id: notificationId });
}

// ... (other API functions)

export {
    apiRequest,
    loginUser,
    registerUser,
    getUserSubscriptions,
    getUserProfiles,
    createSubscription,
    updateUserProfile,
    changePassword,
    getRecommendations,
    getTips,
    getNews,
    getFAQs,
    submitFeedback,
    getUnreadNotificationCount,
    getNotifications,
    markNotificationRead
    // Add other exports as needed
    // ... other exports
};