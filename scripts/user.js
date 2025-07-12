/**
 * User Functions Module
 * Contains user profile and subscription management
 */
import {
    apiRequest,
    getUserSubscriptions,
    getUserProfiles,
    createSubscription,
    updateUserProfile,
    changePassword
} from './api.js';
import { renderSubscriptions, renderProfiles, showError } from './ui.js';

import { getCurrentUser } from './auth.js';

/**
 * Loads user dashboard data (subscriptions and profiles).
 * @returns {Promise<void>}
 */
export async function loadUserData() {
    const user = getCurrentUser();
    if (!user) return;

    await loadSubscriptions(user.id);
    await loadProfiles(user.id);
}

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

async function loadHome() {
    try {
        const response = await getUserSubscriptions(currentUser.id);
        renderSubscriptions(response.data);
    } catch (error) {
        console.error('Error loading home data:', error);
    }
}

/**
 * Loads subscriptions for a user and renders them.
 * @param {string|number} userId
 * @returns {Promise<void>}
 */
/*
export async function loadSubscriptions(userId) {
    const result = await getUserSubscriptions(userId);
    if (result.success) {
        renderSubscriptions(result.data);
    } else {
        showError(result.message || 'Failed to load subscriptions');
    }
} */
export async function loadSubscriptions(userId) {
    if (!userId) {
        showError('User ID is required to load subscriptions');
        return;
    }
    const result = await getUserSubscriptions(userId);
    if (result.success) {
        renderSubscriptions(result.data);
    } else {
        showError(result.message || 'Failed to load subscriptions');
    }
}

/**
 * Loads profiles for a user and renders them.
 * @param {string|number} userId
 * @returns {Promise<void>}
 */
/*
export async function loadProfiles(userId) {
    const result = await getUserProfiles(userId);
    if (result.success) {
        renderProfiles(result.data);
    } else {
        showError(result.message || 'Failed to load profiles');
    }
} */
export async function loadProfiles(userId) {
    if (!userId) {
        showError('User ID is required to load profiles');
        return;
    }
    const result = await getUserProfiles(userId);
    if (result.success) {
        renderProfiles(result.data);
    } else {
        showError(result.message || 'Failed to load profiles');
    }
}

/**
 * Creates a new subscription for the current user.
 * @param {string|number} planId
 * @param {string} paymentMethod
 * @param {string} transactionId
 * @returns {Promise<object>} API response object
 */
/*
export async function handleCreateSubscription(planId, paymentMethod, transactionId) {
    const user = getCurrentUser();
    if (!user) return { success: false, message: 'User not authenticated' };
    return await createSubscription(user.id, planId, paymentMethod, transactionId);
}  */
export async function handleCreateSubscription(planId, paymentMethod, transactionId) {
    const user = getCurrentUser();
    if (!user) return { success: false, message: 'User not authenticated' };
    if (!planId || !paymentMethod || !transactionId) {
        return { success: false, message: 'All subscription details are required' };
    }
    return await createSubscription(user.id, planId, paymentMethod, transactionId);
}

/**
 * Updates the current user's profile.
 * @param {object} profileData
 * @returns {Promise<object>} API response object
 */
/*
export async function handleProfileUpdate(profileData) {
    const user = getCurrentUser();
    if (!user) return { success: false, message: 'User not authenticated' };
    return await updateUserProfile(user.id, profileData);
}  */
export async function handleProfileUpdate(profileData) {
    const user = getCurrentUser();
    if (!user) return { success: false, message: 'User not authenticated' };
    if (!profileData || typeof profileData !== 'object') {
        return { success: false, message: 'Profile data is required' };
    }
    return await updateUserProfile(user.id, profileData);
}

/**
 * Changes the current user's password.
 * @param {string} currentPassword
 * @param {string} newPassword
 * @returns {Promise<object>} API response object
 */
/*
export async function handleChangePassword(currentPassword, newPassword) {
    const user = getCurrentUser();
    if (!user) return { success: false, message: 'User not authenticated' };
    return await changePassword(user.id, currentPassword, newPassword);
} */
export async function handleChangePassword(currentPassword, newPassword) {
    const user = getCurrentUser();
    if (!user) return { success: false, message: 'User not authenticated' };
    if (!currentPassword || !newPassword) {
        return { success: false, message: 'Both current and new passwords are required' };
    }
    return await changePassword(user.id, currentPassword, newPassword);
}

// UI rendering helpers (placeholders)
function renderSubscriptions(subscriptions) {
    // Implement DOM rendering logic for subscriptions
    // Example: updateSubscriptionList(subscriptions);
}

function renderProfiles(profiles) {
    // Implement DOM rendering logic for profiles
    // Example: updateProfileList(profiles);
}

function showError(message) {
    // Implement error display logic
    // Example: showToast(message, 'error');
}

export {
    loadUserData,
    loadHome
    // ... other exports
};