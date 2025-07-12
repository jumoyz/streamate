/**
 * Admin Functions Module
 * Contains all admin-specific functionality
 */
import { renderAdminUsers, renderAdminSubscriptions, renderAdminProfiles, renderAdminPayments, showError } from './ui.js';
import {
    apiRequest,
    getUserSubscriptions,
    getUserProfiles,
    getUser,
    getAllUsers,
    getAllSubscriptions,
    getAllProfiles,
    getAllPayments,
    assignProfileToUser,
    revokeProfileFromUser
} from './api.js';

import { getCurrentUser } from './auth.js';

async function getAdminUsers() {
    return await apiRequest('admin_get_users');
}

async function getAdminSubscriptions() {
    return await apiRequest('admin_get_subscriptions');
}

async function loadAdminDashboard() {
    try {
        const [users, subs, payments] = await Promise.all([
            getAdminUsers(),
            getAdminSubscriptions(),
            apiRequest('admin_get_payments')
        ]);
        
        renderDashboardStats({
            totalUsers: users.data.length,
            activeSubs: subs.data.filter(s => s.status === 'active').length,
            monthlyRevenue: payments.data.reduce((sum, p) => sum + p.amount, 0)
        });
    } catch (error) {
        console.error('Error loading admin dashboard:', error);
    }
}
/**
 * Loads the admin dashboard data (users, subscriptions, profiles, payments).
 * Requires the current user to be an admin.
 * @returns {Promise<void>}
 */
export async function loadAdminDashboard() {
    const user = getCurrentUser();
    if (!user || !user.is_admin) {
        showError('Admin access required');
        return;
    }
    await loadAdminUsers();
    await loadAdminSubscriptions();
    await loadAdminProfiles();
    await loadAdminPayments();
}

/**
 * Loads all users and renders them in the admin view.
 * @returns {Promise<void>}
 */
export async function loadAdminUsers() {
    const result = await getAllUsers();
    if (result.success) {
        renderAdminUsers(result.data);
    } else {
        showError(result.message || 'Failed to load users');
    }
}

/**
 * Loads all subscriptions and renders them in the admin view.
 * @returns {Promise<void>}
 */
export async function loadAdminSubscriptions() {
    const result = await getAllSubscriptions();
    if (result.success) {
        renderAdminSubscriptions(result.data);
    } else {
        showError(result.message || 'Failed to load subscriptions');
    }
}

/**
 * Loads all profiles and renders them in the admin view.
 * @returns {Promise<void>}
 */
export async function loadAdminProfiles() {
    const result = await getAllProfiles();
    if (result.success) {
        renderAdminProfiles(result.data);
    } else {
        showError(result.message || 'Failed to load profiles');
    }
}

/**
 * Loads all payments and renders them in the admin view.
 * @returns {Promise<void>}
 */
export async function loadAdminPayments() {
    const result = await getAllPayments();
    if (result.success) {
        renderAdminPayments(result.data);
    } else {
        showError(result.message || 'Failed to load payments');
    }
}

/**
 * Assigns a profile to a user.
 * @param {string|number} userId
 * @param {string|number} profileId
 * @returns {Promise<object>} API response object
 */
/*
export async function handleAssignProfile(userId, profileId) {
    const result = await assignProfileToUser(userId, profileId);
    return result;
}  */
export async function handleAssignProfile(userId, profileId) {
    if (!userId || !profileId) {
        return { success: false, message: 'User ID and Profile ID are required' };
    }
    return await assignProfileToUser(userId, profileId);
}

/**
 * Revokes a profile from a user.
 * @param {string|number} userId - The ID of the user.
 * @param {string|number} profileId - The ID of the profile to revoke.
 * @returns {Promise<object>} API response object
 */
/*
export async function handleRevokeProfile(userId, profileId) {
    const result = await revokeProfileFromUser(userId, profileId);
    return result;
} */
export async function handleRevokeProfile(userId, profileId) {
    return await revokeProfileFromUser(userId, profileId);
}

// UI rendering helpers (placeholders)
/**
 * Renders the list of admin users.
 * @param {Array} users - Array of user objects.
 */
function renderAdminUsers(users) {
    // Implement DOM rendering logic for admin users
    // Example: updateAdminUserList(users);
}

/**
 * Renders the list of admin subscriptions.
 * @param {Array} subscriptions - Array of subscription objects.
 */
function renderAdminSubscriptions(subscriptions) {
    // Implement DOM rendering logic for admin subscriptions
    // Example: updateAdminSubscriptionList(subscriptions);
}

/**
 * Renders the list of admin profiles.
 * @param {Array} profiles - Array of profile objects.
 */
function renderAdminProfiles(profiles) {
    // Implement DOM rendering logic for admin profiles
    // Example: updateAdminProfileList(profiles);
}

/**
 * Renders the list of admin payments.
 * @param {Array} payments - Array of payment objects.
 */
function renderAdminPayments(payments) {
    // Implement DOM rendering logic for admin payments
    // Example: updateAdminPaymentList(payments);
}

/**
 * Displays an error message in the admin view.
 * @param {string} message - The error message to display.
 */
function showError(message) {
    // Implement error display logic
    // Example: showToast(message, 'error');
}

export {
    getAdminUsers,
    getAdminSubscriptions,
    loadAdminDashboard
    // ... other exports
};