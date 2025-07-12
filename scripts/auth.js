/**
 * Authentication Module
 * Handles user authentication, registration, and session management
 */
import { apiRequest, loginUser, registerUser } from './api.js';

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

// Check authentication status
export function isAuthenticated() {
    return !!localStorage.getItem('user');
}

// Get current user from localStorage
export function getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}
/*
// Handle login form submission
export async function handleLogin(email, password) {
    const result = await loginUser(email, password);
    if (result.success && result.user) {
        localStorage.setItem('user', JSON.stringify(result.user));
    }
    return result;
}
*/
export async function handleLogin(email, password) {
    try {
        const result = await loginUser(email, password);
        if (result.success && result.user) {
            // Only store necessary user info
            localStorage.setItem('user', JSON.stringify({
                id: result.user.id,
                name: result.user.name,
                email: result.user.email,
                token: result.user.token // if available
            }));
        }
        return result;
    } catch (error) {
        return { success: false, message: error.message || 'Login failed' };
    }
}
/*
// Handle signup form submission
export async function handleSignup(name, email, password) {
    const result = await registerUser(name, email, password);
    // Optionally auto-login after signup
    if (result.success) {
        const loginResult = await loginUser(email, password);
        if (loginResult.success && loginResult.user) {
            localStorage.setItem('user', JSON.stringify(loginResult.user));
        }
    }
    return result;
}
*/
/**
 * Handle signup form submission.
 * Registers the user and optionally logs them in.
 * @param {string} name
 * @param {string} email
 * @param {string} password
 * @returns {Promise<object>} API response object
 */
export async function handleSignup(name, email, password) {
    try {
        const result = await registerUser(name, email, password);
        // Optionally auto-login after signup
        if (result.success) {
            const loginResult = await loginUser(email, password);
            if (loginResult.success && loginResult.user) {
                // Only store necessary user info
                localStorage.setItem('user', JSON.stringify({
                    id: loginResult.user.id,
                    name: loginResult.user.name,
                    email: loginResult.user.email,
                    token: loginResult.user.token // if available
                }));
            }
        }
        return result;
    } catch (error) {
        return { success: false, message: error.message || 'Signup failed' };
    }
}

/*
// Logout user
export function logout() {
    localStorage.removeItem('user');
} */
/**
 * Logs out the current user by removing user data from localStorage.
 */
export function logout() {
    localStorage.removeItem('user');
}

// Show login view (UI logic placeholder)
export function showLogin() {
    document.getElementById('loginView').style.display = 'block';
    document.getElementById('signupView').style.display = 'none';
    document.getElementById('dashboardView').style.display = 'none';
}

// Show signup view (UI logic placeholder)
export function showSignup() {
    document.getElementById('loginView').style.display = 'none';
    document.getElementById('signupView').style.display = 'block';
    document.getElementById('dashboardView').style.display = 'none';
}


// ... other auth functions

export {
    showLogin,
    showSignup,
    checkAuthStatus
    // ... other exports
};