import { apiRequest } from './api.js';
import { renderRecommendations, renderTips, renderNews, renderFAQs } from './ui.js';

export async function loadNewsAndTips(currentUser) {
    try {
        const recResponse = await apiRequest('get_recommendations', 'GET', null, { user_id: currentUser.id });
        renderRecommendations(recResponse.data || []);
        const tipsResponse = await apiRequest('get_tips');
        renderTips(tipsResponse.data || []);
        const newsResponse = await apiRequest('get_news');
        renderNews(newsResponse.data || []);
        const faqResponse = await apiRequest('get_faqs');
        renderFAQs(faqResponse.data || []);
    } catch (error) {
        console.error('Error loading news and tips:', error);
        // Optionally call showError from ui.js
    }
}