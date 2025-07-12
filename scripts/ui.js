/**
 * UI Rendering Module
 * Contains all functions responsible for rendering UI components
 * Separates view logic from business logic
 */

export async function renderRecommendations(recommendations) {
    // ...move your renderRecommendations code here...
    // Load recommendations
        const recResponse = await apiRequest('get_recommendations', 'GET', null, { user_id: currentUser.id });
        renderRecommendations(recResponse.data || []);
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

export async function renderTips(tips) {
    // ...move your renderTips code here...
    const tipsResponse = await apiRequest('get_tips');
        renderTips(tipsResponse.data || []);
}

export async function renderNews(newsItems) {
    // ...move your renderNews code here...
    // Load news
        const newsResponse = await apiRequest('get_news');
        renderNews(newsResponse.data || []);
}

export async function renderFAQs(faqs) {
    // ...move your renderFAQs code here...
    const faqResponse = await apiRequest('get_faqs');
        renderFAQs(faqResponse.data || []);
}

/**
 * Renders the list of admin users.
 * @param {Array} users - Array of user objects.
 */
export function renderAdminUsers(users) {
    // Implement DOM rendering logic for admin users
    // Example: updateAdminUserList(users);
}

/**
 * Renders the list of admin subscriptions.
 * @param {Array} subscriptions - Array of subscription objects.
 */
export function renderAdminSubscriptions(subscriptions) {
    // Implement DOM rendering logic for admin subscriptions
    // Example: updateAdminSubscriptionList(subscriptions);
}

/**
 * Renders the list of admin profiles.
 * @param {Array} profiles - Array of profile objects.
 */
export function renderAdminProfiles(profiles) {
    // Implement DOM rendering logic for admin profiles
    // Example: updateAdminProfileList(profiles);
}

/**
 * Renders the list of admin payments.
 * @param {Array} payments - Array of payment objects.
 */
export function renderAdminPayments(payments) {
    // Implement DOM rendering logic for admin payments
    // Example: updateAdminPaymentList(payments);
}

/**
 * Displays an error message in the specified view.
 * @param {string} viewId - The ID of the container element.
 * @param {string} message - The error message to display.
 */
export function showError(viewId, message) {
    const container = document.getElementById(viewId);
    if (container) {
        container.innerHTML = `<div class="alert alert-danger">${message}</div>`;
    }
}

export {
    renderRecommendations,
    renderTips,
    renderNews,
    renderFAQs
    // ... other exports
};