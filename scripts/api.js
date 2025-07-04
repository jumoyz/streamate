// API Helper Functions
export async function apiRequest(endpoint, method = 'GET', data = null, params = {}) {
    let url = `api.php?action=${endpoint}`;
    
    // Add query parameters if GET request
    if (method === 'GET' && params && Object.keys(params).length > 0) {
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
        const json = await response.json();
        if (!response.ok) {
            //throw new Error(`HTTP error! status: ${response.status}`);
            throw new Error(json.message || `HTTP error! status: ${response.status}`);
        }
        //return await response.json();
        return json;
    } catch (error) {
        console.error('API request failed:', error);
        //return { success: false, message: 'Network error' };
        throw error; // Let the caller handle the error
    }
}

// Auth functions
export async function loginUser(email, password) {
    return await apiRequest('login', 'POST', { email, password });
}

export async function registerUser(name, email, password) {
    return await apiRequest('signup', 'POST', { name, email, password });
}

// Data fetching functions
export async function getUserSubscriptions(userId) {
    return await apiRequest('get_subscriptions', 'GET', null, { user_id: userId });
}

export async function getUserProfiles(userId) {
    return await apiRequest('get_profiles', 'GET', null, { user_id: userId });
}

export async function createSubscription(userId, planId, paymentMethod, transactionId) {
    return await apiRequest('create_subscription', 'POST', {
        user_id: userId,
        plan_id: planId,
        payment_method: paymentMethod,
        transaction_id: transactionId
    });
}

export async function updateUserProfile(userId, profileData) {
    return await apiRequest('update_profile', 'POST', {
        user_id: userId,
        ...profileData
    });
}

export async function changePassword(userId, currentPassword, newPassword) {
    return await apiRequest('change_password', 'POST', {
        user_id: userId,
        current_password: currentPassword,
        new_password: newPassword
    });
}

// News & Tips functions
export async function getRecommendations(userId) {
    return await apiRequest('get_recommendations', 'GET', null, { user_id: userId });
}

export async function getTips() {
    return await apiRequest('get_tips', 'GET');
}

export async function getNews() {
    return await apiRequest('get_news', 'GET');
}

export async function getFAQs() {
    return await apiRequest('get_faqs', 'GET');
}

export async function submitFeedback(userId, name, email, subject, message) {
    return await apiRequest('submit_feedback', 'POST', {
        user_id: userId,
        name,
        email,
        subject,
        message
    });
}

// Notification functions
export async function getUnreadNotificationCount(userId) {
    return await apiRequest('get_unread_count', 'GET', null, { user_id: userId });
}

export async function getNotifications(userId, limit = 10) {
    return await apiRequest('get_notifications', 'GET', null, { user_id: userId, limit });
}

export async function markNotificationRead(notificationId) {
    return await apiRequest('mark_notification_read', 'POST', { notification_id: notificationId });
}