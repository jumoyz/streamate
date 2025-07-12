/**
 * Notifications Module
 * Handles all notification-related functionality
 */
import { apiRequest } from './api.js';
import { formatNotificationDate } from './utils.js';

let unreadNotificationCount = 0;

export async function fetchNotifications(userId, limit = 10, unreadOnly = false) {
    // ...move your fetchNotifications code here, pass userId as param...
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

export async function markNotificationAsRead(notificationId) {
    // ...move your markNotificationAsRead code here...
        try {
        await apiRequest('mark_notification_read', 'POST', {
            notification_id: notificationId
        });
    } catch (error) {
        console.error('Error marking notification as read:', error);
    }
}

export async function renderNotifications() {
    // ...move your renderNotifications code here...
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

export async function getNotificationById(notificationId) {
    // ...move your getNotificationById code here...
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

export function handleNotificationAction(notification) {
    // ...move your handleNotificationAction code here...
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

export {
    fetchNotifications,
    unreadNotificationCount
    // ... other exports
};