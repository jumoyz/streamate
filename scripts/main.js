/**
 * Core Application Module
 * Main application initialization and routing
 * Handles DOM ready events and core functionality
 */
import { checkAuthStatus, handleLogin, handleSignup, logout } from './auth.js';
import { navigateTo } from './utils.js';
import { loadNewsAndTips } from './news.js';
import { renderNotifications } from './notifications.js';
import { handleViewMessage, sendMessageBtn, sendBulkMessageBtn, sendReplyBtn } from './messages.js';

// ...import other needed functions...


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
const profilesTable = document.getElementById('profilesTable');
const paymentsTable = document.getElementById('paymentsTable');

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.getElementById('splashScreen').style.display = 'none';
        checkAuthStatus();
    }, 2000);

    // Auth event listeners
    document.getElementById('showSignup')?.addEventListener('click', showSignup);
    document.getElementById('showLogin')?.addEventListener('click', showLogin);
    document.getElementById('loginForm')?.addEventListener('submit', handleLogin);
    document.getElementById('signupForm')?.addEventListener('submit', handleSignup);
    document.getElementById('logoutBtn')?.addEventListener('click', logout);

    // Event listeners for navigation
    document.querySelectorAll('[data-view]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            navigateTo(this.getAttribute('data-view'));
        });
    });

    
    // Event listeners for user app (add more as needed)

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

    // Initialize charts if on admin dashboard
    if (document.getElementById('revenueChart')) {
        initCharts();
    }

     if (currentUser) {
        startNotificationPolling();
    }
    
    // Navigation, news, notifications, etc.
    document.getElementById('refreshNews')?.addEventListener('click', loadNewsAndTips);
    document.getElementById('renderNotifications')?.addEventListener('click', renderNotifications);
   
    document.getElementById('viewMessage')?.addEventListener('click', handleViewMessage);
    document.getElementById('sendMessageBtn')?.addEventListener('submit', sendMessageBtn);
    document.getElementById('sendBulkMessageBtn')?.addEventListener('submit', sendBulkMessageBtn);
    document.getElementById('sendReplyBtn')?.addEventListener('submit', sendReplyBtn);



    // Load initial data
    // ...add more event listeners as needed...

     // Service Worker Registration for PWA
    
});