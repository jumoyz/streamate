/**
 * API Request
 * @param {*} endpoint 
 * @param {*} method 
 * @param {*} data 
 * @param {*} params 
 * @returns 
 */
// API Base URL
const API_BASE_URL = 'api.php';
// API Helper Functions
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
/**
 * Auth functions
 * @param {*} email 
 * @param {*} password 
 * @returns 
 */
// Auth functions
async function loginUser(email, password) {
    return await apiRequest('login', 'POST', { email, password });
}

async function registerUser(name, email, password) {
    return await apiRequest('signup', 'POST', { name, email, password });
}

/**
 * Data fetching functions
 * @param {*} userId 
 * @returns 
 */
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
async function loadNewsAndTips() {
    try {
        // Load recommendations
        const recResponse = await apiRequest('get_recommendations', 'GET', null, { user_id: currentUser.id });
        renderRecommendations(recResponse.data || []);
        
        // Load tips
        const tipsResponse = await apiRequest('get_tips');
        renderTips(tipsResponse.data || []);
        
        // Load news
        const newsResponse = await apiRequest('get_news');
        renderNews(newsResponse.data || []);
        
        // Load FAQs
        const faqResponse = await apiRequest('get_faqs');
        renderFAQs(faqResponse.data || []);
    } catch (error) {
        console.error('Error loading news and tips:', error);
        showError('newstipsView', 'Failed to load news and tips. Please try again later.');
    }
}

function renderRecommendations(recommendations) {
    const container = document.getElementById('recommendationsContainer');
    
    if (recommendations.length === 0) {
        container.innerHTML = `
            <div class="alert alert-info">
                We don't have any personalized recommendations for you yet. Check back later!
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <div class="row g-4">
            ${recommendations.map(rec => `
                <div class="col-md-4">
                    <div class="card h-100">
                        <div class="card-body">
                            <h5 class="card-title">${rec.title}</h5>
                            <p class="card-text">${rec.description}</p>
                            ${rec.action_url ? `
                                <a href="${rec.action_url}" class="btn btn-sm btn-primary">${rec.action_text || 'Learn More'}</a>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderTips(tips) {
    const container = document.getElementById('tipsList');
    
    if (tips.length === 0) {
        container.innerHTML = `
            <div class="col-12">
                <div class="alert alert-info">
                    No tips available at the moment. Check back later!
                </div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = tips.map(tip => `
        <div class="col-md-6 col-lg-4">
            <div class="card h-100">
                <div class="card-body">
                    <div class="d-flex align-items-start">
                        <div class="flex-shrink-0 bg-light p-2 rounded me-3">
                            <i class="fas fa-${tip.icon || 'lightbulb'} text-${tip.color || 'warning'}"></i>
                        </div>
                        <div>
                            <h5 class="card-title mb-1">${tip.title}</h5>
                            <p class="card-text small">${tip.content}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function renderNews(newsItems) {
    const container = document.getElementById('newsList');
    
    if (newsItems.length === 0) {
        container.innerHTML = `
            <div class="alert alert-info">
                No news or announcements at the moment.
            </div>
        `;
        return;
    }
    
    container.innerHTML = newsItems.map(news => `
        <a href="#readNewsModal" class="list-group-item list-group-item-action">
            <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">${news.title}</h5>
                <small class="text-muted">${new Date(news.published_at).toLocaleDateString()}</small>
            </div>
            <p class="mb-1">${news.excerpt}</p>
            <small class="text-muted">Click to read more</small>
        </a>
    `).join('');
}

function renderFAQs(faqs) {
    const container = document.getElementById('faqAccordion');
    
    if (faqs.length === 0) {
        container.innerHTML = `
            <div class="alert alert-info">
                No FAQs available at the moment.
            </div>
        `;
        return;
    }
    
    container.innerHTML = faqs.map((faq, index) => `
        <div class="accordion-item">
            <h2 class="accordion-header" id="faqHeading${index}">
                <button class="accordion-button ${index === 0 ? '' : 'collapsed'}" type="button" data-bs-toggle="collapse" 
                    data-bs-target="#faqCollapse${index}" aria-expanded="${index === 0 ? 'true' : 'false'}" 
                    aria-controls="faqCollapse${index}">
                    ${faq.question}
                </button>
            </h2>
            <div id="faqCollapse${index}" class="accordion-collapse collapse ${index === 0 ? 'show' : ''}" 
                aria-labelledby="faqHeading${index}" data-bs-parent="#faqAccordion">
                <div class="accordion-body">
                    ${faq.answer}
                    ${faq.related_link ? `<a href="${faq.related_link}" class="small">Learn more</a>` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

// Support functions
async function handleFeedbackSubmit(e) {
    e.preventDefault();
    
    const form = document.getElementById('feedbackForm');
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    
    try {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';
        
        const feedbackData = {
            name: document.getElementById('feedbackFirstName').value,
            email: document.getElementById('feedbackEmail').value,
            subject: document.getElementById('feedbackSubject').value,
            message: document.getElementById('feedbackMessage').value,
            user_id: currentUser?.id || null
        };
        
        const response = await apiRequest('submit_feedback', 'POST', feedbackData);
        
        if (response.success) {
            alert('Thank you for your feedback! We will get back to you soon.');
            form.reset();
            
            // Log activity
            await apiRequest('log_activity', 'POST', {
                user_id: currentUser?.id,
                activity_type: 'feedback_submitted',
                description: `User submitted feedback: ${feedbackData.subject}`
            });
        } else {
            throw new Error(response.message || 'Failed to submit feedback');
        }
    } catch (error) {
        console.error('Feedback submission error:', error);
        alert('Failed to submit feedback. Please try again.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }
}

// Notification functions
async function fetchNotifications(limit = 10, unreadOnly = false) {
    try {
        const response = await apiRequest('get_notifications', 'GET', null, {
            user_id: currentUser.id,
            limit: limit,
            unread_only: unreadOnly
        });
        
        console.log('Notifications API response:', response);

        if (response.success) {
            return response.data;
        } else {
            console.error('Failed to fetch notifications:', response.message);
            return [];
        }
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return [];
    }
}

async function markNotificationAsRead(notificationId) {
    try {
        await apiRequest('mark_notification_read', 'POST', {
            notification_id: notificationId
        });
    } catch (error) {
        console.error('Error marking notification as read:', error);
    }
}

async function renderNotifications() {
    const notifications = await fetchNotifications();
    const notificationsContainer = document.getElementById('notificationsList');

    if (notifications.length === 0) {
        notificationsContainer.innerHTML = `
            <div class="list-group-item text-center py-4 text-muted">
                No notifications yet
            </div>
        `;
        return;
    }

    notificationsContainer.innerHTML = notifications.map(notification => `
        <a href="#" class="list-group-item list-group-item-action ${notification.is_read ? '' : 'list-group-item-primary'}" 
           data-notification-id="${notification.id}" onclick="handleNotificationClick(event, ${notification.id})">
            <div class="d-flex w-100 justify-content-between">
                <h6 class="mb-1">${notification.title}</h6>
                <small class="text-muted">${formatNotificationDate(notification.created_at)}</small>
            </div>
            <p class="mb-1">${notification.message}</p>
            ${notification.is_read ? '' : '<small class="text-primary">New</small>'}
        </a>
    `).join('');
    
    // Update the count after rendering
    unreadNotificationCount = notifications.filter(n => !n.is_read).length;
    updateNotificationBadge();
}

function formatNotificationDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
        return 'Just now';
    } else if (diffInHours < 24) {
        return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
}

async function handleNotificationClick(event, notificationId) {
    event.preventDefault();
    
    // Only mark as read if it was unread
    const notificationItem = event.currentTarget;
    if (notificationItem.classList.contains('list-group-item-primary')) {
        await markNotificationAsRead(notificationId);
        
        // Update UI immediately
        notificationItem.classList.remove('list-group-item-primary');
        
        // Update count
        unreadNotificationCount = Math.max(0, unreadNotificationCount - 1);
        updateNotificationBadge();
    }
    
    // Handle notification action
    const notification = await getNotificationById(notificationId);
    handleNotificationAction(notification);
}

async function getNotificationById(notificationId) {
    try {
        const response = await apiRequest('get_notifications', 'GET', null, {
            user_id: currentUser.id,
            limit: 1,
            notification_id: notificationId
        });
        
        return response.success && response.data.length > 0 ? response.data[0] : null;
    } catch (error) {
        console.error('Error fetching notification:', error);
        return null;
    }
}

function handleNotificationAction(notification) {
    if (!notification) return;

    switch (notification.related_entity_type) {
        case 'subscription':
            navigateTo('subscriptions');
            break;
        case 'profile':
            navigateTo('profiles');
            break;
        case 'payment':
            navigateTo('subscriptions');
            break;
        default:
            // Show notification details in a modal or alert
            alert(`${notification.title}\n\n${notification.message}`);
    }
}

// Admin functions
async function getAdminUsers() {
    return await apiRequest('admin_get_users');
}

async function getAdminSubscriptions() {
    return await apiRequest('admin_get_subscriptions');
}

async function getAdminProfiles() {
    return await apiRequest('admin_get_profiles');
}

async function getAdminPayments() {
    return await apiRequest('admin_get_payments');
}

async function assignProfile(profileId, userId) {
    return await apiRequest('admin_assign_profile', 'POST', {
        profile_id: profileId,
        user_id: userId
    });
}

async function revokeProfile(profileId) {
    return await apiRequest('admin_revoke_profile', 'POST', {
        profile_id: profileId
    });
}

async function getAdminStreamingAccounts() {
    return await apiRequest('admin_get_streaming_accounts');
}

async function addAdminStreamingAccount(data) {
    return await apiRequest('admin_add_streaming_account', 'POST', data);
}

async function editAdminStreamingAccount(data) {
    return await apiRequest('admin_edit_streaming_account', 'POST', data);
}

async function deleteAdminStreamingAccount(accountId) {
    const formData = new FormData();
    formData.append('account_id', accountId);

    const response = await fetch('api.php?action=admin_delete_streaming_account', {
        method: 'POST',
        body: formData
    });

    return await response.json();
}

async function getAdminServices() {
    return await apiRequest('admin_get_services');
}

async function getAdminPlans() {
    return await apiRequest('admin_get_plans');
}

async function getAdminActivityLogs(){
    return await apiRequest('admin_get_activity_logs');
}

async function getAdminReports(){
    return await apiRequest('admin_get_reports');
}

async function getAdminSettings(){
    return await apiRequest('admin_get_settings');
}


// App state
let currentUser = null;
let isAdmin = false;
let currentView = "home";
let selectedPlan = null;
let selectedPaymentMethod = null;

// DOM Elements
const splashScreen = document.getElementById('splashScreen');
const authViews = document.getElementById('authViews');
const appViews = document.getElementById('appViews');
const userApp = document.getElementById('userApp');
const adminApp = document.getElementById('adminApp');
const appContent = document.getElementById('appContent');
const userName = document.getElementById('userName');
const activeSubscriptions = document.getElementById('activeSubscriptions');
const subscriptionsTable = document.getElementById('subscriptionsTable');
const netflixProfiles = document.getElementById('netflixProfiles');
const disneyProfiles = document.getElementById('disneyProfiles');
const selectedPlanInfo = document.getElementById('selectedPlanInfo');
const orderSummary = document.getElementById('orderSummary');
const confirmationDetails = document.getElementById('confirmationDetails');
const usersTable = document.getElementById('usersTable');
const adminSubscriptionsTable = document.getElementById('adminSubscriptionsTable');
const adminStreamingAccountsTable = document.getElementById('adminStreamingAccountsTable');
const adminServicesTable = document.getElementById('adminServicesTable');
const adminPlansTable = document.getElementById('adminPlansTable');
const adminActivityLogsTable = document.getElementById('adminActivityLogsTable');
const adminReportsTable = document.getElementById('adminReportsTable');
const adminSettingsTable = document.getElementById('adminSettingsTable');
const profilesTable = document.getElementById('profilesTable');
const paymentsTable = document.getElementById('paymentsTable');
const newsTipsContainer = document.getElementById('newsTipsContainer');
const newsList = document.getElementById('newsList');
const faqAccordion = document.getElementById('faqAccordion');


// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Simulate splash screen delay
    setTimeout(() => {
        splashScreen.style.display = 'none';
        checkAuthStatus();
    }, 2000);

    // Event listeners for auth views
    document.getElementById('showSignup')?.addEventListener('click', showSignup);
    document.getElementById('showLogin')?.addEventListener('click', showLogin);
    document.getElementById('loginForm')?.addEventListener('submit', handleLogin);
    document.getElementById('signupForm')?.addEventListener('submit', handleSignup);

    // Event listeners for navigation
    document.querySelectorAll('[data-view]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            navigateTo(this.getAttribute('data-view'));
        });
    });

    // Event listeners for service cards
    document.querySelectorAll('[data-service]').forEach(card => {
        card.addEventListener('click', function() {
            navigateTo('plans');
        });
    });

    // Event listeners for plan selection
    document.querySelectorAll('[data-plan]').forEach(btn => {
        btn.addEventListener('click', function() {
            selectPlan(this.getAttribute('data-plan'));
        });
    });

    // Event listeners for payment methods
    document.querySelectorAll('.payment-method').forEach(method => {
        method.addEventListener('click', function() {
            selectPaymentMethod(this.getAttribute('data-method'));
        });
    });

    // Event listener for payment confirmation
    document.getElementById('confirmPayment')?.addEventListener('click', confirmPayment);

    // Event listeners for profile form
    document.getElementById('profileForm')?.addEventListener('submit', handleProfileUpdate);
    document.getElementById('passwordForm')?.addEventListener('submit', handlePasswordChange);

    // Event listener for Feedback and News
    document.getElementById('feedbackForm')?.addEventListener('submit', handleFeedbackSubmit);
    document.getElementById('refreshNews')?.addEventListener('click', loadNewsAndTips);

    // Event listeners for logout
    document.getElementById('logoutBtn')?.addEventListener('click', logout);
    document.getElementById('adminLogoutBtn')?.addEventListener('click', logout);

    document.getElementById('adminStreamingAccounts')?.addEventListener('click', loadAdminStreamingAccounts);
    document.getElementById('adminServices')?.addEventListener('click', loadAdminServices);
    document.getElementById('adminPlans')?.addEventListener('click', loadAdminPlans);
    document.getElementById('adminActivityLogs')?.addEventListener('click', loadAdminActivityLogs);
    document.getElementById('adminReports')?.addEventListener('click', loadAdminReports);
    document.getElementById('adminSettings')

    // Initialize charts if on admin dashboard
    if (document.getElementById('revenueChart')) {
        initCharts();
    }

     if (currentUser) {
        startNotificationPolling();
    }
});

// Show login view
function showLogin() {
    document.getElementById('loginView').style.display = 'block';
    document.getElementById('signupView').style.display = 'none';
}

// Show signup view
function showSignup() {
    document.getElementById('loginView').style.display = 'none';
    document.getElementById('signupView').style.display = 'block';
}

// Handle login
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        alert('Please enter both email and password');
        return;
    }

    try {
        const response = await loginUser(email, password);
        
        if (response.success) {
            currentUser = {
                id: response.user.id,
                name: response.user.name,
                email: response.user.email,
                phone: response.user.phone || '',
                is_admin: response.user.is_admin || false
            };
            
            // Store user in localStorage
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            authViews.style.display = 'none';
            appViews.style.display = 'block';
            
            if (currentUser.is_admin) {
                userApp.style.display = 'none';
                adminApp.style.display = 'block';
                isAdmin = true;
                await loadAdminData();
            } else {
                userApp.style.display = 'block';
                adminApp.style.display = 'none';
                isAdmin = false;
                await loadUserData();
            }
            
            navigateTo('home');
        } else {
            alert(response.message || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed. Please try again.');
    }
}

// Handle signup
async function handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    if (!name || !email || !password) {
        alert('Please fill all fields');
        return;
    }

    try {
        const response = await registerUser(name, email, password);
        
        if (response.success) {
            alert('Account created successfully! Please login.');
            showLogin();
            document.getElementById('loginEmail').value = email;
            document.getElementById('loginPassword').value = password;
        } else {
            alert(response.message || 'Registration failed');
        }
    } catch (error) {
        console.error('Signup error:', error);
        alert('Registration failed. Please try again.');
    }
}

// Check authentication status
function checkAuthStatus() {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
        currentUser = JSON.parse(userData);
        authViews.style.display = 'none';
        appViews.style.display = 'block';
        
        if (currentUser.is_admin) {
            userApp.style.display = 'none';
            adminApp.style.display = 'block';
            isAdmin = true;
            loadAdminData();
        } else {
            userApp.style.display = 'block';
            adminApp.style.display = 'none';
            isAdmin = false;
            loadUserData();
        }
        
        navigateTo('home');
    } else {
        authViews.style.display = 'block';
        appViews.style.display = 'none';
        showLogin();
    }
}

// Logout
function logout() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    isAdmin = false;
    authViews.style.display = 'block';
    appViews.style.display = 'none';
    showLogin();
}

// Navigate to different views
function navigateTo(view) {
    currentView = view;
    
    // Hide all views
    document.querySelectorAll('#appContent > div, #adminContent > div').forEach(div => {
        div.style.display = 'none';
    });
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Activate the correct nav link
    document.querySelectorAll(`[data-view="${view}"]`).forEach(link => {
        link.classList.add('active');
    });
    
    // Show the selected view
    const viewElement = document.getElementById(`${view}View`);
    if (viewElement) {
        viewElement.style.display = 'block';
    }
    
    // Load data if needed
    if (isAdmin) {
        if (view === 'adminDashboard') loadAdminDashboard();
        if (view === 'adminUsers') loadAdminUsers();
        if (view === 'adminSubscriptions') loadAdminSubscriptions();
        if (view === 'adminProfiles') loadAdminProfiles();
        if (view === 'adminNewsTips') loadAdminNewsTips();
        if (view === 'adminNotifications') renderAdminNotifications();
        if (view === 'adminNotificationsReminders') loadAdminNotificationsReminders();
        if (view === 'adminPayments') loadAdminPayments();
        if (view === 'adminFeedbacksMessages') loadAdminFeedbacksMessages();
        if (view === 'adminStreamingAccounts') loadAdminStreamingAccounts();
        if (view === 'adminActivityLogs') loadAdminActivityLogs();
        if (view === 'adminReports') loadAdminReports();
        if (view === 'adminSettings') loadAdminSettings();
    } else {
        if (view === 'home') loadHome();
        if (view === 'subscriptions') loadSubscriptions();
        if (view === 'profiles') loadProfiles();
        if (view === 'newstips') loadNewsAndTips();
        if (view === 'notifications') renderNotifications();
        if (view === 'support') loadSupport();
    }
}

// Load user data
async function loadUserData() {
    try {
        userName.textContent = currentUser.name;
        document.getElementById('profileImage').src = currentUser.avatar || 'https://via.placeholder.com/150';
        
        // Split name into first and last if available
        const nameParts = currentUser.name.split(' ');
        document.getElementById('firstName').value = nameParts[0] || '';
        document.getElementById('lastName').value = nameParts.slice(1).join(' ') || '';
        document.getElementById('profileEmail').value = currentUser.email;
        document.getElementById('profilePhone').value = currentUser.phone || '';
        
        await loadHome();
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

// Handle profile update
async function handleProfileUpdate(e) {
    e.preventDefault();
    
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const phone = document.getElementById('profilePhone').value;
    
    const profileData = {
        name: `${firstName} ${lastName}`.trim(),
        phone: phone
    };
    
    try {
        const response = await updateUserProfile(currentUser.id, profileData);
        
        if (response.success) {
            alert('Profile updated successfully');
            currentUser.name = profileData.name;
            currentUser.phone = profileData.phone;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            userName.textContent = currentUser.name;
        } else {
            alert(response.message || 'Failed to update profile');
        }
    } catch (error) {
        console.error('Profile update error:', error);
        alert('Failed to update profile');
    }
}

// Handle password change
async function handlePasswordChange(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;
    
    if (newPassword !== confirmNewPassword) {
        alert('New passwords do not match');
        return;
    }
    
    try {
        const response = await changePassword(currentUser.id, currentPassword, newPassword);
        
        if (response.success) {
            alert('Password changed successfully');
            document.getElementById('passwordForm').reset();
        } else {
            alert(response.message || 'Failed to change password');
        }
    } catch (error) {
        console.error('Password change error:', error);
        alert('Failed to change password');
    }
}

// App deep link data per service
const serviceAppLinks = {
    "Netflix": {
        uri: "nflx://",
        fallback: "https://www.netflix.com"
    },
    "Disney+": {
        uri: "disneyplus://",
        fallback: "https://www.disneyplus.com"
    },
    "Prime Video": {
        uri: "primevideo://",
        fallback: "https://www.primevideo.com"
    },
    "Spotify": {
        uri: "spotify://",
        fallback: "https://open.spotify.com"
    },
    "YouTube": {
        uri: "vnd.youtube://",
        fallback: "https://www.youtube.com"
    },
    "HBO Max": {
        uri: "hbomax://",
        fallback: "https://www.hbomax.com"
    }
};

function getMobilePlatform() {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    if (/android/i.test(ua)) return "Android";
    if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) return "iOS";
    return "Other";
}

function openAppWithFallback(uri, fallbackUrl) {
    const now = Date.now();
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = uri;
    document.body.appendChild(iframe);

    setTimeout(() => {
        if (Date.now() - now < 1500) {
            alert("It looks like the app is not installed. Redirecting to website...");
            window.location.href = fallbackUrl;
        }
    }, 1200);
}

// Load home view with Open App button
async function loadHome() {
    try {
        const response = await getUserSubscriptions(currentUser.id);

        if (response.success) {
            activeSubscriptions.innerHTML = '';

            if (response.data.length === 0) {
                activeSubscriptions.innerHTML = `
                    <div class="col-12">
                        <div class="alert alert-info">
                            You don't have any active subscriptions yet. Browse our services to get started!
                        </div>
                    </div>
                `;
            } else {
                response.data.forEach(sub => {
                    const renewalDate = new Date(sub.end_date).toLocaleDateString();
                    const service = sub.service_name;
                    const app = serviceAppLinks[service];

                    let openAppBtn = '';
                    if (app) {
                        if (getMobilePlatform() === "Other") {
                            openAppBtn = `
                                <a href="${app.fallback}" target="_blank" class="btn btn-sm btn-outline-secondary">
                                    Open on Web
                                </a>
                            `;
                        } else {
                            openAppBtn = `
                                <button class="btn btn-sm btn-outline-success" onclick="openAppWithFallback('${app.uri}', '${app.fallback}')">
                                    Open App
                                </button>
                            `;
                        }
                    }

                    activeSubscriptions.innerHTML += `
                        <div class="col-md-4">
                            <div class="card mb-4">
                                <div class="card-body">
                                    <div class="d-flex justify-content-between align-items-start">
                                        <div>
                                            <h5>${sub.service_name}</h5>
                                            <p class="mb-1">${sub.plan_name}</p>
                                            <p class="text-muted small">Renews on ${renewalDate}</p>
                                        </div>
                                        <span class="badge bg-success">Active</span>
                                    </div>
                                    <div class="mt-3 d-flex gap-2">
                                        <button class="btn btn-sm btn-outline-primary" data-view="subscriptions">Manage</button>
                                        ${openAppBtn}
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                });
            }

            document.querySelectorAll('#activeSubscriptions .btn[data-view]').forEach(btn => {
                btn.addEventListener('click', function() {
                    navigateTo(this.getAttribute('data-view'));
                });
            });
        } else {
            console.error('Failed to load subscriptions:', response.message);
            activeSubscriptions.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-danger">
                        Failed to load subscriptions. Please try again later.
                    </div>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading home data:', error);
        activeSubscriptions.innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger">
                    Error loading data. Please try again.
                </div>
            </div>
        `;
    }
} 
/*
// Load home view
async function loadHome() {
    try {
        const response = await getUserSubscriptions(currentUser.id);
        
        if (response.success) {
            activeSubscriptions.innerHTML = '';
            
            if (response.data.length === 0) {
                activeSubscriptions.innerHTML = `
                    <div class="col-12">
                        <div class="alert alert-info">
                            You don't have any active subscriptions yet. Browse our services to get started!
                        </div>
                    </div>
                `;
            } else {
                response.data.forEach(sub => {
                    const renewalDate = new Date(sub.end_date).toLocaleDateString();
                    
                    activeSubscriptions.innerHTML += `
                        <div class="col-md-4">
                            <div class="card mb-4">
                                <div class="card-body">
                                    <div class="d-flex justify-content-between align-items-start">
                                        <div>
                                            <h5>${sub.service_name}</h5>
                                            <p class="mb-1">${sub.plan_name}</p>
                                            <p class="text-muted small">Renews on ${renewalDate}</p>
                                        </div>
                                        <span class="badge bg-success">Active</span>
                                    </div>
                                    <div class="mt-3">
                                        <button class="btn btn-sm btn-outline-primary" data-view="subscriptions">Manage</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                });
            }
            
            // Add event listeners to manage buttons
            document.querySelectorAll('#activeSubscriptions .btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    navigateTo(this.getAttribute('data-view'));
                });
            });
        } else {
            console.error('Failed to load subscriptions:', response.message);
            activeSubscriptions.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-danger">
                        Failed to load subscriptions. Please try again later.
                    </div>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading home data:', error);
        activeSubscriptions.innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger">
                    Error loading data. Please try again.
                </div>
            </div>
        `;
    }
}
*/
// Load subscriptions view
async function loadSubscriptions() {
    try {
        const response = await getUserSubscriptions(currentUser.id);
        
        if (response.success) {
            subscriptionsTable.innerHTML = '';
            
            if (response.data.length === 0) {
                subscriptionsTable.innerHTML = `
                    <tr>
                        <td colspan="6" class="text-center py-4">
                            You don't have any subscriptions yet.
                        </td>
                    </tr>
                `;
            } else {
                response.data.forEach(sub => {
                    const renewalDate = new Date(sub.end_date).toLocaleDateString();
                    let statusBadge;
                    
                    if (sub.status === 'active') {
                        statusBadge = '<span class="badge bg-success">Active</span>';
                    } else if (sub.status === 'expired') {
                        statusBadge = '<span class="badge bg-danger">Expired</span>';
                    } else {
                        statusBadge = '<span class="badge bg-warning text-dark">Pending</span>';
                    }
                    
                    subscriptionsTable.innerHTML += `
                        <tr>
                            <td>${sub.service_name}</td>
                            <td>${sub.plan_name}</td>
                            <td>G${sub.price}</td>
                            <td>${renewalDate}</td>
                            <td>${statusBadge}</td>
                            <td>
                                <button class="btn btn-sm btn-outline-primary">Renew</button>
                                <button class="btn btn-sm btn-outline-danger">Cancel</button>
                            </td>
                        </tr>
                    `;
                });

                // Event listeners for Renew and Cancel buttons
                subscriptionsTable.querySelectorAll('.btn-renew').forEach((btn, idx) => {
                    btn.addEventListener('click', async () => {
                        const sub = response.data[idx];
                        // Example renew logic: redirect to payment view with selected plan
                        selectedPlan = sub.plan_name.toLowerCase().includes('vip') ? 'vip'
                            : sub.plan_name.toLowerCase().includes('premium') ? 'premium'
                            : 'basic';
                        // Optionally, set selectedPlanInfo/orderSummary here
                        navigateTo('payment');
                    });
                });

                subscriptionsTable.querySelectorAll('.btn-cancel').forEach((btn, idx) => {
                    btn.addEventListener('click', async () => {
                        const sub = response.data[idx];
                        if (confirm(`Are you sure you want to cancel your ${sub.service_name} subscription?`)) {
                            // Example cancel logic: call cancel_subscription API
                            const cancelResponse = await apiRequest('cancel_subscription', 'POST', {
                                subscription_id: sub.id,
                                user_id: currentUser.id
                            });
                            if (cancelResponse.success) {
                                alert('Subscription cancelled.');
                                loadSubscriptions();
                            } else {
                                alert('Failed to cancel subscription: ' + (cancelResponse.message || 'Unknown error'));
                            }
                        }
                    });
                });
            }
        } else {
            console.error('Failed to load subscriptions:', response.message);
            subscriptionsTable.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-4 text-danger">
                        Failed to load subscriptions. Please try again later.
                    </td>
                </tr>
            `;
        }
    } catch (error) {
        console.error('Error loading subscriptions:', error);
        subscriptionsTable.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-4 text-danger">
                    Error loading subscriptions. Please try again.
                </td>
            </tr>
        `;
    }
}

// Load profiles view
async function loadProfiles() {
    try {
        const response = await getUserProfiles(currentUser.id);
        
        if (response.success) {
            netflixProfiles.innerHTML = '';
            disneyProfiles.innerHTML = '';
            
            if (response.data.length === 0) {
                document.getElementById('profilesView').querySelector('.card-body').innerHTML = `
                    <div class="alert alert-info">
                        You don't have any profiles assigned yet. Request a profile for your subscriptions.
                    </div>
                `;
            } else {
                response.data.forEach(profile => {
                    const profileCard = `
                        <div class="col-md-4 mb-4">
                            <div class="card">
                                <div class="card-body text-center">
                                    <img src="${profile.avatar || 'https://via.placeholder.com/80'}" class="profile-avatar mb-3">
                                    <h5>${profile.name}</h5>
                                    <p class="mb-1">PIN: ${profile.credentials}</p>
                                    <p class="text-muted small">${profile.service_name}</p>
                                    <button class="btn btn-sm btn-outline-primary">Manage</button>
                                </div>
                            </div>
                        </div>
                    `;
                    
                    if (profile.service_name === 'Netflix') {
                        netflixProfiles.innerHTML += profileCard;
                    } else if (profile.service_name === 'Disney+') {
                        disneyProfiles.innerHTML += profileCard;
                    }
                });
            }
        } else {
            console.error('Failed to load profiles:', response.message);
            document.getElementById('profilesView').querySelector('.card-body').innerHTML = `
                <div class="alert alert-danger">
                    Failed to load profiles. Please try again later.
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading profiles:', error);
        document.getElementById('profilesView').querySelector('.card-body').innerHTML = `
            <div class="alert alert-danger">
                Error loading profiles. Please try again.
            </div>
        `;
    }

    // Event listener for profile request form
    const profileRequestForm = document.getElementById('profileRequestForm');
    if (profileRequestForm) {
        profileRequestForm.onsubmit = async function (e) {
            e.preventDefault();

            const service = document.getElementById('profileService').value;
            const profileName = document.getElementById('profileName').value;
            const avatarInput = document.getElementById('profileAvatar');
            let avatarBase64 = null;

            // Convert avatar file to base64 if provided
            if (avatarInput.files && avatarInput.files[0]) {
                const file = avatarInput.files[0];
                avatarBase64 = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
            }

            // Map service name to service_id if needed
            const serviceMap = {
                'netflix': 1,
                'disney': 2,
                'prime': 3,
                'spotify': 4
            };

            const serviceId = serviceMap[service];

            const requestData = {
                user_id: currentUser.id,
                service_id: serviceId,
                profile_name: profileName,
                avatar: avatarBase64
            };

            try {
                const response = await apiRequest('request_profile', 'POST', requestData);
                if (response.success) {
                    alert('Profile request submitted successfully!');
                    profileRequestForm.reset();
                    loadProfiles();
                } else {
                    alert(response.message || 'Failed to submit profile request.');
                }
            } catch (error) {
                console.error('Profile request error:', error);
                alert('Failed to submit profile request. Please try again.');
            }
        };
    }
}

// Select a subscription plan
function selectPlan(plan) {
    selectedPlan = plan;
    
    let planDetails;
    if (plan === 'basic') {
        planDetails = {
            name: 'Basic Plan',
            price: 'G500.00/month',
            features: [
                '1 Streaming Service',
                'Standard Quality',
                '1 Profile',
                'No Premium Content'
            ]
        };
    } else if (plan === 'vip') {
        planDetails = {
            name: 'VIP Plan',
            price: 'G750.00/month',
            features: [
                '1 Streaming Service',
                'HD Quality',
                '1 Extra Member slot',
                '3 Profiles',
                'Premium Content'
            ]
        };
    } else {
        planDetails = {
            name: 'Premium Bundle',
            price: 'G1500.00/month',
            features: [
                'All Streaming Services',
                '4K Quality',
                '5 Profiles',
                'All Premium Content'
            ]
        };
    }
    
    // Update selected plan info
    selectedPlanInfo.innerHTML = `
        <h5>${planDetails.name}</h5>
        <h3 class="my-3">${planDetails.price}</h3>
        <ul class="list-unstyled">
            ${planDetails.features.map(feat => `<li class="mb-2"><i class="fas fa-check text-success me-2"></i> ${feat}</li>`).join('')}
        </ul>
    `;
    
    // Update order summary
    orderSummary.innerHTML = `
        <div class="d-flex justify-content-between mb-2">
            <span>Plan:</span>
            <span>${planDetails.name}</span>
        </div>
        <div class="d-flex justify-content-between mb-2">
            <span>Price:</span>
            <span>${planDetails.price}</span>
        </div>
        <hr>
        <div class="d-flex justify-content-between fw-bold">
            <span>Total:</span>
            <span>${planDetails.price}</span>
        </div>
    `;
    
    navigateTo('payment');
}

// Select payment method
function selectPaymentMethod(method) {
    selectedPaymentMethod = method;
    
    // Remove active class from all methods
    document.querySelectorAll('.payment-method').forEach(m => {
        m.classList.remove('active');
    });
    
    // Add active class to selected method
    document.querySelector(`.payment-method[data-method="${method}"]`).classList.add('active');
    
    // Show appropriate form
    document.getElementById('stripeForm').style.display = 'none';
    document.getElementById('mobilePaymentForm').style.display = 'none';
    
    if (method === 'stripe' || method === 'paypal') {
        document.getElementById('stripeForm').style.display = 'block';
    } else {
        document.getElementById('mobilePaymentForm').style.display = 'block';
    }
}

// Confirm payment
async function confirmPayment() {
    if (!selectedPaymentMethod) {
        alert('Please select a payment method');
        return;
    }
    
    if (!selectedPlan) {
        alert('No plan selected');
        return;
    }

    // In a real app, you would process payment with Stripe/MonCash/etc first
    // For this example, we'll simulate a successful payment
    const transactionId = 'PMT-' + Math.floor(1000 + Math.random() * 9000);
    
    try {
        // Map our demo plan names to actual plan IDs from database
        const planMap = {
            'basic': 1,    // Basic Netflix plan
            'vip': 6,      // VIP Package
            'premium': 7   // Premium Package
        };
        
        const planId = planMap[selectedPlan];
        if (!planId) {
            throw new Error('Invalid plan selected');
        }
        
        const response = await createSubscription(
            currentUser.id,
            planId,
            selectedPaymentMethod,
            transactionId
        );
        
        if (response.success) {
            // Show confirmation
            const planDetails = {
                'basic': { name: 'Basic Plan', price: 'G500.00' },
                'vip': { name: 'VIP Plan', price: 'G750.00' },
                'premium': { name: 'Premium Bundle', price: 'G1500.00' }
            };
            
            confirmationDetails.innerHTML = `
                <div class="mb-3">
                    <strong>Plan:</strong> ${planDetails[selectedPlan].name}
                </div>
                <div class="mb-3">
                    <strong>Amount Paid:</strong> ${planDetails[selectedPlan].price}
                </div>
                <div class="mb-3">
                    <strong>Payment Method:</strong> ${selectedPaymentMethod.charAt(0).toUpperCase() + selectedPaymentMethod.slice(1)}
                </div>
                <div class="mb-3">
                    <strong>Transaction ID:</strong> ${transactionId}
                </div>
                <div class="mb-3">
                    <strong>Date:</strong> ${new Date().toLocaleDateString()}
                </div>
            `;
            
            navigateTo('confirmation');
        } else {
            alert('Payment failed: ' + (response.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Payment error:', error);
        alert('Payment failed. Please try again.');
    }
}

// Notification Count
let unreadNotificationCount = 0;

async function updateUnreadNotificationCount() {
    try {
        const response = await apiRequest('get_unread_count', 'GET', null, {
            user_id: currentUser?.id || 0
        });
        
        if (response.success) {
            unreadNotificationCount = response.count;
            updateNotificationBadge();
        }
    } catch (error) {
        console.error('Error fetching unread count:', error);
    }
}

function updateNotificationBadge() {
    const badge = document.querySelector('.notification-badge');
    if (!badge) return;
    
    if (unreadNotificationCount > 0) {
        badge.textContent = unreadNotificationCount > 9 ? '9+' : unreadNotificationCount.toString();
        badge.style.display = 'flex';
    } else {
        badge.style.display = 'none';
    }
}

// Call this periodically to keep count updated
function startNotificationPolling() {
    updateUnreadNotificationCount();
    // Update every 2 minutes
    setInterval(updateUnreadNotificationCount, 120000);
}

// Notifications
let currentNotificationPage = 1;
const notificationsPerPage = 10;

async function refreshNotifications() {
    currentNotificationPage = 1;
    await renderNotifications();
}

async function loadMoreNotifications() {
    currentNotificationPage++;
    const additionalNotifications = await fetchNotifications(
        notificationsPerPage * currentNotificationPage
    );
    
    if (additionalNotifications.length > 0) {
        const notificationsContainer = document.getElementById('notificationsList');
        additionalNotifications.forEach(notification => {
            notificationsContainer.innerHTML += `
                <a href="#" class="list-group-item list-group-item-action ${notification.is_read ? '' : 'list-group-item-primary'}" 
                   data-notification-id="${notification.id}" onclick="handleNotificationClick(event, ${notification.id})">
                    <div class="d-flex w-100 justify-content-between">
                        <h6 class="mb-1">${notification.title}</h6>
                        <small class="text-muted">${formatNotificationDate(notification.created_at)}</small>
                    </div>
                    <p class="mb-1">${notification.message}</p>
                </a>
            `;
        });
    } else {
        alert('No more notifications to load');
        currentNotificationPage--;
    }
}

async function markAllAsRead() {
    try {
        const response = await apiRequest('mark_all_notifications_read', 'POST', {
            user_id: currentUser.id
        });
        
        if (response.success) {
            // Update all notifications UI
            document.querySelectorAll('#notificationsList .list-group-item-primary')
                .forEach(item => item.classList.remove('list-group-item-primary'));
                
            // Update count
            unreadNotificationCount = 0;
            updateNotificationBadge();
        }
    } catch (error) {
        console.error('Error marking all as read:', error);
    }
}

// Load admin data 
async function loadAdminData() {
    await loadAdminDashboard();
}

// Fetch and render admin dashboard data
async function loadAdminDashboard() {
    try {
        // 1. Fetch stats
        const statsRes = await fetch('api.php?action=admin_dashboard_stats');
        const stats = await statsRes.json();

        document.querySelector('.stats-card.revenue .card-title').textContent = stats.totalRevenue;
        document.querySelector('.stats-card.users .card-title').textContent = stats.activeUsers;
        document.querySelector('.stats-card.subscriptions .card-title').textContent = stats.subscriptions;
        document.querySelector('.stats-card:not(.revenue):not(.users):not(.subscriptions) .card-title').textContent = stats.renewalsDue;

        // 2. Fetch chart data
        const chartsRes = await fetch('api.php?action=admin_dashboard_charts');
        const charts = await chartsRes.json();

        // Add near the top, before any chart usage:
        window.revenueChart = null;
        window.serviceChart = null;

        // Revenue Chart
        if (window.revenueChart && typeof window.revenueChart.destroy === 'function') {
            window.revenueChart.destroy();
        }
        const revenueCtx = document.getElementById('revenueChart').getContext('2d');
        window.revenueChart = new Chart(revenueCtx, {
            type: 'line',
            data: charts.revenue,
            options: { responsive: true }
        });

        // Service Distribution Chart
        if (window.serviceChart && typeof window.serviceChart.destroy === 'function') {
            window.serviceChart.destroy();
        }
        const serviceCtx = document.getElementById('serviceChart').getContext('2d');
        window.serviceChart = new Chart(serviceCtx, {
            type: 'doughnut',
            data: charts.serviceDistribution,
            options: { responsive: true }
        });

        // 3. Fetch recent activity
        const activityRes = await fetch('api.php?action=admin_dashboard_activity');
        const activity = await activityRes.json();

        const tbody = document.getElementById('adminRecentActivity');
        tbody.innerHTML = '';
        if ((activity.data || []).length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center text-muted">No recent activity found.</td>
                </tr>
            `;
        } else {
            activity.data.forEach(item => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>
                        <div class="d-flex align-items-center">
                            <img src="${item.avatar || 'https://via.placeholder.com/40'}" class="user-avatar me-2">
                            <span>${item.user}</span>
                        </div>
                    </td>
                    <td>${item.action}</td>
                    <td>${item.service}</td>
                    <td>${item.time}</td>
                `;
                tbody.appendChild(tr);
            });
        }
    } catch (err) {
        console.error('Failed to load admin dashboard:', err);
    }
}
/*
// Load admin dashboard
async function loadAdminDashboard() {
    const [users, subs, payments] = await Promise.all([
        apiRequest('admin_get_users'),
        apiRequest('admin_get_subscriptions'),
        apiRequest('admin_get_payments')
    ]);
    // Initialize charts
    initCharts();
    
    try {
        // You would typically fetch dashboard stats from API
        // For now we'll use the existing chart data
        renderDashboardStats({
        totalUsers: users.data.length,
        activeSubs: subs.data.filter(s => s.status === 'active').length,
        monthlyRevenue: payments.data.reduce((sum, p) => sum + p.amount, 0)
    });
    } catch (error) {
        console.error('Error loading admin dashboard:', error);
    }
} */
/*
async function loadAdminDashboard() {
    const [users, subs, payments] = await Promise.all([
        apiRequest('admin_get_users'),
        apiRequest('admin_get_subscriptions'),
        apiRequest('admin_get_payments')
    ]);
    
    // Render real data to charts and stats
    renderDashboardStats({
        totalUsers: users.data.length,
        activeSubs: subs.data.filter(s => s.status === 'active').length,
        monthlyRevenue: payments.data.reduce((sum, p) => sum + p.amount, 0)
    });
}
*/
// Load admin users
async function loadAdminUsers() {
    try {
        const response = await getAdminUsers();
        
        if (response.success) {
            usersTable.innerHTML = '';
            
            if (response.data.length === 0) {
                usersTable.innerHTML = `
                    <tr>
                        <td colspan="6" class="text-center py-4">
                            No users found.
                        </td>
                    </tr>
                `;
            } else {
                response.data.forEach(user => {
                    const joinDate = new Date(user.created_at).toLocaleDateString();
                    const statusBadge = user.is_active 
                        ? '<span class="badge bg-success">Active</span>'
                        : '<span class="badge bg-secondary">Inactive</span>';
                    
                    usersTable.innerHTML += `
                        <tr data-id="${user.id}">
                            <td>
                                <div class="d-flex align-items-center">
                                    <img src="https://via.placeholder.com/40" class="user-avatar me-2">
                                    <span>${user.name}</span>
                                </div>
                            </td>
                            <td>${user.email}</td>
                            <td>VIP</td>
                            <td>${statusBadge}</td>
                            <td>${joinDate}</td>
                            <td>
                                <button class="btn btn-sm btn-outline-primary data-bs-toggle="modal" data-bs-target="#editUserModal">Edit</button>
                                <button class="btn btn-sm btn-outline-danger">Delete</button>
                            </td>
                        </tr>
                    `;
                });

                // Add event listeners to Edit and Delete buttons
                document.querySelectorAll('.btn-outline-primary').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const row = this.closest('tr');
                        const userId = row.dataset.id;
                        showEditUserModal(userId);
                    });
                });

                document.querySelectorAll('.btn-outline-danger').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const row = this.closest('tr');
                        const userId = row.dataset.id;
                        deleteUser(userId);
                    });
                });
            }
        } else {
            console.error('Failed to load users:', response.message);
            usersTable.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-4 text-danger">
                        Failed to load users. Please try again later.
                    </td>
                </tr>
            `;
        }
    } catch (error) {
        console.error('Error loading admin users:', error);
        usersTable.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-4 text-danger">
                    Error loading users. Please try again.
                </td>
            </tr>
        `;
    }
}

// Load admin subscriptions
async function loadAdminSubscriptions() {
    try {
        const response = await getAdminSubscriptions();
        
        if (response.success) {
            adminSubscriptionsTable.innerHTML = '';
            
            if (response.data.length === 0) {
                adminSubscriptionsTable.innerHTML = `
                    <tr>
                        <td colspan="7" class="text-center py-4">
                            No subscriptions found.
                        </td>
                    </tr>
                `;
            } else {
                response.data.forEach(sub => {
                    const renewalDate = new Date(sub.end_date).toLocaleDateString();
                    let statusBadge;
                    
                    if (sub.status === 'active') {
                        statusBadge = '<span class="badge bg-success">Active</span>';
                    } else if (sub.status === 'expired') {
                        statusBadge = '<span class="badge bg-danger">Expired</span>';
                    } else {
                        statusBadge = '<span class="badge bg-warning text-dark">Pending</span>';
                    }
                    
                    adminSubscriptionsTable.innerHTML += `
                        <tr>
                            <td>${sub.user_name}</td>
                            <td>${sub.service_name}</td>
                            <td>${sub.plan_name}</td>
                            <td>${new Date(sub.start_date).toLocaleDateString()}</td>
                            <td>${renewalDate}</td>
                            <td>${statusBadge}</td>
                            <td>
                                <button class="btn btn-sm btn-outline-primary">Edit</button>
                                <button class="btn btn-sm btn-outline-danger">Cancel</button>
                            </td>
                        </tr>
                    `;
                });

                // Add event listeners to Edit and Cancel buttons
                // After rendering adminSubscriptionsTable rows
                adminSubscriptionsTable.querySelectorAll('.btn-outline-primary').forEach((btn, idx) => {
                    btn.addEventListener('click', async () => {
                        // Edit logic: Prompt admin to update subscription end date and status
                        const sub = response.data[idx];
                        const newEndDate = prompt('Enter new end date (YYYY-MM-DD):', sub.end_date.slice(0, 10));
                        if (!newEndDate) return;

                        const newStatus = prompt('Enter new status (active, expired, pending):', sub.status);
                        if (!newStatus) return;

                        const updateResponse = await apiRequest('admin_update_subscription', 'POST', {
                            subscription_id: sub.id,
                            end_date: newEndDate,
                            status: newStatus
                        });

                        if (updateResponse.success) {
                            alert('Subscription updated successfully.');
                            loadAdminSubscriptions();
                        } else {
                            alert('Failed to update subscription: ' + (updateResponse.message || 'Unknown error'));
                        }
                    });
                });

                adminSubscriptionsTable.querySelectorAll('.btn-outline-danger').forEach((btn, idx) => {
                    btn.addEventListener('click', async () => {
                        // Cancel logic: Confirm and call cancel API
                        const sub = response.data[idx];
                        if (confirm('Cancel this subscription?')) {
                            const cancelResponse = await apiRequest('admin_cancel_subscription', 'POST', {
                                subscription_id: sub.id
                            });
                            if (cancelResponse.success) {
                                alert('Subscription cancelled.');
                                loadAdminSubscriptions();
                            } else {
                                alert('Failed to cancel subscription: ' + (cancelResponse.message || 'Unknown error'));
                            }
                        }
                    });
                });
            }
        } else {
            console.error('Failed to load subscriptions:', response.message);
            adminSubscriptionsTable.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center py-4 text-danger">
                        Failed to load subscriptions. Please try again later.
                    </td>
                </tr>
            `;
        }
    } catch (error) {
        console.error('Error loading admin subscriptions:', error);
        adminSubscriptionsTable.innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-4 text-danger">
                    Error loading subscriptions. Please try again.
                </td>
            </tr>
        `;
    }
}

// Load admin profiles
async function loadAdminProfiles() {
    try {
        const response = await getAdminProfiles();
        
        if (response.success) {
            profilesTable.innerHTML = '';
            
            if (response.data.length === 0) {
                profilesTable.innerHTML = `
                    <tr>
                        <td colspan="5" class="text-center py-4">
                            No profiles found.
                        </td>
                    </tr>
                `;
            } else {
                response.data.forEach(profile => {
                    const statusBadge = profile.user_id 
                        ? '<span class="badge bg-success">Assigned</span>'
                        : '<span class="badge bg-primary">Available</span>';
                    
                    profilesTable.innerHTML += `
                        <tr>
                            <td>${profile.name}</td>
                            <td>${profile.service_name}</td>
                            <td>${profile.user_name || 'Not assigned'}</td>
                            <td>${statusBadge}</td>
                            <td>
                                <button class="btn btn-sm btn-outline-primary" data-profile-id="${profile.id}">Assign</button>
                                <button class="btn btn-sm btn-outline-danger" data-revoke-id="${profile.id}">Revoke</button>
                            </td>
                        </tr>
                    `;
                });
                
                // Add event listeners to assign buttons
                document.querySelectorAll('[data-profile-id]').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const profileId = this.getAttribute('data-profile-id');
                        assignProfileToUser(profileId);
                    });
                });
                
                // Add event listeners to revoke buttons
                document.querySelectorAll('[data-revoke-id]').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const profileId = this.getAttribute('data-revoke-id');
                        revokeProfileFromUser(profileId);
                    });
                });
            }
        } else {
            console.error('Failed to load profiles:', response.message);
            profilesTable.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center py-4 text-danger">
                        Failed to load profiles. Please try again later.
                    </td>
                </tr>
            `;
        }
    } catch (error) {
        console.error('Error loading admin profiles:', error);
        profilesTable.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-4 text-danger">
                    Error loading profiles. Please try again.
                </td>
            </tr>
        `;
    }
}

// Assign profile to user
async function assignProfileToUser(profileId) {
    // In a real app, you would get user ID from a selection modal
    const userId = prompt("Enter user ID to assign this profile to:");
    
    if (!userId) return;
    
    try {
        const response = await assignProfile(profileId, userId);
        
        if (response.success) {
            alert('Profile assigned successfully');
            loadAdminProfiles(); // Refresh the list
        } else {
            alert('Failed to assign profile: ' + (response.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error assigning profile:', error);
        alert('Failed to assign profile');
    }
}

// Revoke profile from user
async function revokeProfileFromUser(profileId) {
    if (!confirm('Are you sure you want to revoke this profile?')) return;
    
    try {
        const response = await revokeProfile(profileId);
        
        if (response.success) {
            alert('Profile revoked successfully');
            loadAdminProfiles(); // Refresh the list
        } else {
            alert('Failed to revoke profile: ' + (response.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error revoking profile:', error);
        alert('Failed to revoke profile');
    }
}

// Load admin payments
async function loadAdminPayments() {
    try {
        const response = await getAdminPayments();
        
        if (response.success) {
            paymentsTable.innerHTML = '';
            
            if (response.data.length === 0) {
                paymentsTable.innerHTML = `
                    <tr>
                        <td colspan="6" class="text-center py-4">
                            No payments found.
                        </td>
                    </tr>
                `;
            } else {
                response.data.forEach(payment => {
                    const paymentDate = new Date(payment.created_at).toLocaleDateString();
                    let statusBadge;
                    
                    if (payment.status === 'completed') {
                        statusBadge = '<span class="badge bg-success">Completed</span>';
                    } else if (payment.status === 'failed') {
                        statusBadge = '<span class="badge bg-danger">Failed</span>';
                    } else {
                        statusBadge = '<span class="badge bg-warning text-dark">Pending</span>';
                    }
                    
                    paymentsTable.innerHTML += `
                        <tr>
                            <td>${payment.transaction_id}</td>
                            <td>${payment.user_name}</td>
                            <td>G${payment.amount}</td>
                            <td>${payment.payment_method}</td>
                            <td>${paymentDate}</td>
                            <td>${statusBadge}</td>
                        </tr>
                    `;
                });
            }
        } else {
            console.error('Failed to load payments:', response.message);
            paymentsTable.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-4 text-danger">
                        Failed to load payments. Please try again later.
                    </td>
                </tr>
            `;
        }
    } catch (error) {
        console.error('Error loading admin payments:', error);
        paymentsTable.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-4 text-danger">
                    Error loading payments. Please try again.
                </td>
            </tr>
        `;
    }
}

// Load admin Streaming Accounts
async function loadStreamingAccounts() {
    try {
        const response = await getAdminStreamingAccounts();

        if (response.success) {
            const streamingAccountsList = document.getElementById('streamingAccountsList');
            streamingAccountsList.innerHTML = '';

            if (response.data.length === 0) {
                streamingAccountsList.innerHTML = `
                <tr>
                    <td colspan="10" class="text-center">
                        No accounts found.
                    </td>
                </tr>`;
                return;
            }

            response.data.forEach(account => {
                streamingAccountsList.innerHTML += `
                    <tr data-id="${account.id}">
                        <td>${account.service_name}</td>
                        <td>${account.account_name}</td>
                        <td>${account.email}</td>
                        <td>${account.plan}</td>
                        <td>${account.profile_count}</td>
                        <td>${account.extra_members}</td>
                        <td>$${account.cost}</td>
                        <td>${new Date(account.start_date).toLocaleDateString()}</td>
                        <td>${new Date(account.renew_date).toLocaleDateString()}</td>
                        <td>${account.status}</td>
                        <td>
                            <button class="btn btn-sm btn-primary edit-btn">Edit</button>
                            <button class="btn btn-sm btn-danger delete-btn">Delete</button>
                        </td>
                    </tr>
                `;
            });
        } else {
            document.getElementById('streamingAccountsList').innerHTML = `
                <tr>
                    <td colspan="10" class="text-center text-danger">
                    Error loading streaming accounts.</td>
                </tr>`;
        }
    } catch (error) {
        console.error('Error loading streaming accounts:', error);
        document.getElementById('streamingAccountsList').innerHTML = `
            <tr>
                <td colspan="10" class="text-center text-danger">
                Error loading streaming accounts.</td>
            </tr>`;
    }
}

// Load admin services
async function loadAdminServices() {
    try {
        const response = await getAdminServices();
        const servicesTable = document.getElementById('servicesTable');

        if (response.success) {
            servicesTable.innerHTML = '';

            if (response.data.length === 0) {
                servicesTable.innerHTML = `
                    <tr>
                        <td colspan="5" class="text-center py-4">
                            No services found.
                        </td>
                    </tr>
                `;
            } else {
                response.data.forEach(service => {
                    servicesTable.innerHTML += `
                        <tr>
                            <td>${service.logo}</td>
                            <td>${service.name}</td>
                            <td>${service.description}</td>
                            <td>
                                <button class="btn btn-sm btn-outline-primary" data-bs-toggle="modal" data-bs-target="#editServiceModal" data-service-id="${service.id}">Edit</button>
                                <button class="btn btn-sm btn-outline-danger" data-service-id="${service.id}">Delete</button>
                            </td>
                        </tr>
                    `;
                });
            }
        } else {
            console.error('Failed to load services:', response.message);
            servicesTable.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-4 text-danger">
                        Failed to load services. Please try again later.
                    </td>
                </tr>
            `;
        }
    } catch (error) {
        console.error('Error loading admin services:', error);
        servicesTable.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-4 text-danger">
                    Error loading services. Please try again.
                </td>
            </tr>
        `;
    }
}      

// Load admin plans
async function loadAdminPlans() {
    try {
        const response = await getAdminPlans();
        
        if (response.success) {
            plansTable.innerHTML = '';

            if (response.data.length === 0) {
                plansTable.innerHTML = `
                    <tr>
                        <td colspan="5" class="text-center py-4">
                            No plans found.
                        </td>
                    </tr>
                `;
            } else {
                response.data.forEach(plan => {
                    plansTable.innerHTML += `
                        <tr>
                            <td>${plan.name}</td>
                            <td>${plan.description}</td>
                            <td>$${plan.price}</td>
                            <td>$${plan.duration_days}</td>
                            <td>$${plan.max_prifles}</td>
                            <td>
                                <button class="btn btn-sm btn-outline-primary" data-bs-toggle="modal" data-bs-target="#editPlanModal" data-plan-id="${plan.id}">Edit</button>
                                <button class="btn btn-sm btn-outline-danger" data-plan-id="${plan.id}">Delete</button>
                            </td>
                        </tr>
                    `;
                });
            }
        } else {
            console.error('Failed to load plans:', response.message);
            plansTable.innerHTML = `    
                <tr>
                    <td colspan="6" class="text-center py-4 text-danger">
                        Failed to load plans. Please try again later.
                    </td>
                </tr>
            `;
        }
    } catch (error) {
        console.error('Error loading admin plans:', error);
        plansTable.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-4 text-danger">
                    Error loading plans. Please try again.
                </td>
            </tr>
        `;
    }
}     
            
        
// Load admin reports
async function loadAdminReports() {
    // Initialize report chart
    initReportChart();
}

// Initialize charts
function initCharts() {
    if (window.revenueChart && typeof window.revenueChart.destroy === 'function') {
        window.revenueChart.destroy();
    }
    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart').getContext('2d');
    window.revenueChart = new Chart(revenueCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
            datasets: [{
                label: 'Monthly Revenue',
                data: [1200, 1900, 1500, 2000, 2200, 2500, 2800, 3000, 3200, 3500, 3800],
                borderColor: '#6c5ce7',
                backgroundColor: 'rgba(108, 92, 231, 0.1)',
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    if (window.serviceChart && typeof window.serviceChart.destroy === 'function') {
        window.serviceChart.destroy();
    }
    // Service Distribution Chart
    const serviceCtx = document.getElementById('serviceChart').getContext('2d');
    window.serviceChart = new Chart(serviceCtx, { // <-- FIXED HERE
        type: 'doughnut',
        data: {
            labels: ['Netflix', 'Disney+', 'Prime Video', 'Spotify'],
            datasets: [{
                data: [45, 25, 15, 15],
                backgroundColor: [
                    '#e50914',
                    '#113ccf',
                    '#00a8e1',
                    '#1db954'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                }
            }
        }
    });
}

// Initialize report chart
function initReportChart() {
    const reportCtx = document.getElementById('reportChart').getContext('2d');
    new Chart(reportCtx, {
        type: 'bar',
        data: {
            labels: ['Netflix', 'Disney+', 'Prime Video', 'Spotify', 'VIP Package'],
            datasets: [{
                label: 'Revenue by Service',
                data: [4500, 2500, 1500, 1500, 3500],
                backgroundColor: [
                    'rgba(229, 9, 20, 0.7)',
                    'rgba(17, 60, 207, 0.7)',
                    'rgba(0, 168, 225, 0.7)',
                    'rgba(29, 185, 84, 0.7)',
                    'rgba(108, 92, 231, 0.7)'
                ],
                borderColor: [
                    'rgba(229, 9, 20, 1)',
                    'rgba(17, 60, 207, 1)',
                    'rgba(0, 168, 225, 1)',
                    'rgba(29, 185, 84, 1)',
                    'rgba(108, 92, 231, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Load Admin Settings
async function loadAdminSettings() {
    try {
        const response = await getAdminSettings();
        
        if (response.success) {
            const settings = response.data;
            document.getElementById('siteName').value = settings.site_name || '';
            document.getElementById('siteUrl').value = settings.site_url || '';
            document.getElementById('adminEmail').value = settings.admin_email || '';
            document.getElementById('currency').value = settings.currency || 'USD';
            document.getElementById('timezone').value = settings.timezone || 'UTC';
        } else {
            console.error('Failed to load settings:', response.message);
        }
    } catch (error) {
        console.error('Error loading admin settings:', error);
    }
}

/**
 * Admin Operations
 * Add, Edit, Delete, and Cancel Users, Subscriptions, Profiles, Payments, 
 * News, Notifications, Messages, Streaming Accounts, Services, Plans, Reports and Settings
 */
// Add User Modal
document.addEventListener('DOMContentLoaded', function () {
    // Add User Modal logic
    const addUserModal = document.getElementById('addUserModal');
    if (!addUserModal) return;

    const addUserForm = addUserModal.querySelector('#addUserForm');
    const addUserBtn = addUserModal.querySelector('.btn-primary');

    addUserBtn.addEventListener('click', async function () {
        // Get form values
        const name = addUserForm.querySelector('input[type="text"]').value.trim();
        const email = addUserForm.querySelector('input[type="email"]').value.trim();
        const password = addUserForm.querySelector('input[type="password"]').value;
        const role = addUserForm.querySelector('select').value;

        // Basic validation
        if (!name || !email || !password || !role) {
            alert('Please fill in all fields.');
            return;
        }

        addUserBtn.disabled = true;
        addUserBtn.textContent = 'Adding...';

        try {
            const response = await apiRequest('admin_add_user', 'POST', {
                name,
                email,
                password,
                role
            });

            if (response.success) {
                alert('User added successfully!');
                addUserForm.reset();
                // Optionally close the modal
                const modalInstance = bootstrap.Modal.getInstance(addUserModal);
                if (modalInstance) modalInstance.hide();
                // Optionally reload users table
                if (typeof loadAdminUsers === 'function') loadAdminUsers();
            } else {
                alert(response.message || 'Failed to add user.');
            }
        } catch (error) {
            alert('Error adding user. Please try again.');
        } finally {
            addUserBtn.disabled = false;
            addUserBtn.textContent = 'Add User';
        }
    });
});

// Show Edit User Modal
function showEditUserModal(userId) {
    const modal = new bootstrap.Modal(document.getElementById('editUserModal'));
    const form = document.getElementById('editUserForm');
    const userRow = document.querySelector(`tr[data-id="${userId}"]`);                      
    document.getElementById('editUserId').value = userId;
    document.getElementById('editUserName').value = userRow.querySelector('td:nth-child(1) span').textContent;
    document.getElementById('editUserEmail').value = userRow.querySelector('td:nth-child(2)').textContent;
    document.getElementById('editUserRole').value = userRow.querySelector('td:nth-child(3)').textContent.toLowerCase();
    modal.show();
}

// Handle Edit User Form Submit
document.getElementById('editUserForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const userId = document.getElementById('editUserId').value;
    const name = document.getElementById('editUserName').value;
    const email = document.getElementById('editUserEmail').value;
    const role = document.getElementById('editUserRole').value;

    const response = await apiRequest('admin_update_user', 'POST', {
        user_id: userId,
        name,
        email,
        is_admin: role === 'admin'
    });

    if (response.success) {
        alert('User updated successfully!');
        loadAdminUsers();
        bootstrap.Modal.getInstance(document.getElementById('editUserModal')).hide();
    } else {
        alert(response.message || 'Failed to update user.');
    }
});

// Delete User
async function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        const response = await apiRequest('admin_delete_user', 'POST', { user_id: userId });
        if (response.success) {
            alert('User deleted successfully!');
            loadAdminUsers();
        } else {
            alert(response.message || 'Failed to delete user.');
        }
    }
}

// User actions
usersTable.addEventListener('click', async (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    
    const userId = btn.closest('tr').dataset.id;
    
    if (btn.classList.contains('btn-edit')) {
        showEditUserModal(userId);
    } else if (btn.classList.contains('btn-delete')) {
        if (confirm('Delete this user?')) {
            await apiRequest('admin_delete_user', 'POST', { user_id: userId });
            loadAdminUsers();
        }
    }
});

// Admin: Send Renewal Reminders logic
document.addEventListener('DOMContentLoaded', function () {
    // Find the Send Reminders button in the modal footer
    const sendRemindersModal = document.getElementById('sendRemindersModal');
    if (!sendRemindersModal) return;

    const sendBtn = sendRemindersModal.querySelector('.btn-primary');
    const messageTextarea = sendRemindersModal.querySelector('textarea');

    sendBtn.addEventListener('click', async function () {
        sendBtn.disabled = true;
        sendBtn.textContent = 'Sending...';

        const customMessage = messageTextarea.value.trim();

        try {
            const response = await apiRequest('admin_send_renewal_reminders', 'POST', {
                message: customMessage
            });

            if (response.success) {
                alert('Renewal reminders sent successfully!');
                // Optionally close the modal
                const modalInstance = bootstrap.Modal.getInstance(sendRemindersModal);
                if (modalInstance) modalInstance.hide();
            } else {
                alert(response.message || 'Failed to send reminders.');
            }
        } catch (error) {
            alert('Error sending reminders. Please try again.');
        } finally {
            sendBtn.disabled = false;
            sendBtn.textContent = 'Send Reminders';
        }
    });
});

// Admin Add Subscription Modal
document.addEventListener('DOMContentLoaded', function () {
    const addSubscriptionModal = document.getElementById('addSubscriptionModal');
    if (!addSubscriptionModal) return;

    const addSubscriptionForm = addSubscriptionModal.querySelector('#addSubscriptionForm');
    const addSubscriptionBtn = addSubscriptionModal.querySelector('.btn-primary');

    addSubscriptionBtn.addEventListener('click', async function () {
        addSubscriptionBtn.disabled = true;
        addSubscriptionBtn.textContent = 'Adding...';

        // Load modal data from API when shown
        const usersResponse = await apiRequest('admin_get_users', 'GET');
        const servicesResponse = await apiRequest('admin_get_services', 'GET');
        const plansResponse = await apiRequest('admin_get_plans', 'GET');

        if (!usersResponse.success || !servicesResponse.success || !plansResponse.success) {
            alert('Error loading modal data. Please try again.');
            return;
        }
        // Populate user select
        const userSelect = addSubscriptionForm.querySelector('select[name="user_id"]');
        const serviceSelect = addSubscriptionForm.querySelector('select[name="service_id"]');
        const planSelect = addSubscriptionForm.querySelector('select[name="plan_id"]');

        const userId = userSelect.value;
        const serviceId = serviceSelect.value;
        const planId = planSelect.value;

        try {
            const response = await apiRequest('admin_add_subscription', 'POST', {
                user_id: userId,
                service_id: serviceId,
                plan_id: planId
            });

            if (response.success) {
                alert('Subscription added successfully!');
                addSubscriptionForm.reset();
                // Optionally close the modal
                const modalInstance = bootstrap.Modal.getInstance(addSubscriptionModal);
                if (modalInstance) modalInstance.hide();
            } else {
                alert(response.message || 'Failed to add subscription.');
            }
        } catch (error) {
            alert('Error adding subscription. Please try again.');
        } finally {
            addSubscriptionBtn.disabled = false;
            addSubscriptionBtn.textContent = 'Add Subscription';
        }
    });
}); 

// Admin add profiles modal
const addProfileModal = document.getElementById('addProfileModal');
const addProfileForm = document.getElementById('addProfileForm');

addProfileForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(addProfileForm).entries());

    try {
        const response = await addAdminProfile(data);
        if (response.success) {
            alert('Profile added successfully!');
            addProfileForm.reset();
            bootstrap.Modal.getInstance(addProfileModal).hide();
            loadAdminProfiles(); // Refresh the list
        } else {
            alert('Failed to add profile: ' + response.message);
        }
    } catch (error) {
        console.error('Error adding profile:', error);
        alert('Failed to add profile. Please try again.');
    }
});

// Add new streaming account
const addStreamingAccountForm = document.getElementById('addStreamingAccountForm');

addStreamingAccountForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(addStreamingAccountForm).entries());
    data.profile_count = parseInt(data.profile_count);
    data.extra_members = parseInt(data.extra_members);
    data.cost = parseFloat(data.cost);

    const response = await addAdminStreamingAccount(data);

    if (response.success) {
        alert('Account added!');
        addStreamingAccountForm.reset();
        bootstrap.Modal.getInstance(document.getElementById('addStreamingAccountModal')).hide();
        loadStreamingAccounts();
    } else {
        alert('Failed to add account: ' + response.message);
    }
});

// Open edit modal with data
function openEditModal(account) {
  const form = document.getElementById("editStreamingAccountForm");

  for (const key in account) {
    if (form[key]) form[key].value = account[key];
  }

  const modal = new bootstrap.Modal(document.getElementById('editStreamingAccountModal'));
  modal.show();
}

// Edit existing account
function handleEditStreamingAccount(e) {
    const row = e.target.closest('tr');
    const id = row.dataset.id;

    const modal = new bootstrap.Modal(document.getElementById('editStreamingAccountModal'));
    const form = document.getElementById('editStreamingAccountForm');

    form.account_id.value = id;
    form.service_name.value = row.children[0].innerText;
    form.account_name.value = row.children[1].innerText;
    form.email.value = row.children[2].innerText;
    form.plan.value = row.children[3].innerText;
    form.profile_count.value = row.children[4].innerText;
    form.extra_members.value = row.children[5].innerText;
    form.cost.value = row.children[6].innerText.replace('$', '');
    form.start_date.value = formatDateForInput(row.children[7].innerText);
    form.renew_date.value = formatDateForInput(row.children[8].innerText);
    form.status.value = row.children[9].innerText;

    modal.show();
}

document.getElementById('editStreamingAccountForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(this).entries());
    data.id = parseInt(data.account_id);
    data.profile_count = parseInt(data.profile_count);
    data.extra_members = parseInt(data.extra_members);
    data.cost = parseFloat(data.cost);

    const response = await editAdminStreamingAccount(data);
    if (response.success) {
        alert('Account updated!');
        bootstrap.Modal.getInstance(document.getElementById('editStreamingAccountModal')).hide();
        loadStreamingAccounts();
    } else {
        alert('Failed to update: ' + response.message);
    }
});

// Delete Streaming Account
async function handleDeleteStreamingAccount(e) {
    const row = e.target.closest('tr');
    const id = row.dataset.id;

    if (!confirm('Are you sure you want to delete this account?')) return;

    const response = await deleteAdminStreamingAccount(id);
    if (response.success) {
        alert('Account deleted!');
        loadStreamingAccounts();
    } else {
        alert('Failed to delete: ' + response.message);
    }
}

// Service Worker Registration for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').then(registration => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }).catch(err => {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
} else {
    console.log('ServiceWorker is not supported in this browser.');
}