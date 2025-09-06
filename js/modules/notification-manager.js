// Notification Manager - Easy upload and removal system
class NotificationManager {
    constructor() {
        this.notificationsData = null;
        this.lastChecked = localStorage.getItem('lastNotificationCheck') || '2025-01-01T00:00:00Z';
    }

    async loadNotifications() {
        try {
            const response = await fetch('./data/notifications.json');
            this.notificationsData = await response.json();
            return this.notificationsData;
        } catch (error) {
            console.error('Error loading notifications:', error);
            return null;
        }
    }

    // Check if there are new notifications since last visit
    hasNewNotifications() {
        if (!this.notificationsData) return false;
        
        const lastCheck = new Date(this.lastChecked);
        return this.notificationsData.notifications.some(notification => {
            const notificationDate = new Date(notification.timestamp);
            return notificationDate > lastCheck && !notification.isRead;
        });
    }

    // Mark notifications as checked (hide red dot)
    markAsChecked() {
        this.lastChecked = new Date().toISOString();
        localStorage.setItem('lastNotificationCheck', this.lastChecked);
    }

    // Get unread notifications count
    getUnreadCount() {
        if (!this.notificationsData) return 0;
        return this.notificationsData.notifications.filter(n => !n.isRead).length;
    }

    // Get all notifications sorted by timestamp (newest first)
    getAllNotifications() {
        if (!this.notificationsData) return [];
        return this.notificationsData.notifications.sort((a, b) => 
            new Date(b.timestamp) - new Date(a.timestamp)
        );
    }

    // Format timestamp for display
    formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        
        if (minutes < 60) {
            return `${minutes} minutes ago`;
        } else if (hours < 24) {
            return `${hours} hours ago`;
        } else {
            return `${days} days ago`;
        }
    }

    // Render notifications on the notifications page
    renderNotifications(container) {
        if (!this.notificationsData || !container) return;

        const notifications = this.getAllNotifications();
        
        if (notifications.length === 0) {
            container.innerHTML = `
                <div class="notifications-empty" data-aos="fade-up">
                    <i class="fas fa-bell-slash"></i>
                    <h3>No notifications</h3>
                    <p>You're all caught up! Check back later for updates.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = '';

        notifications.forEach((notification, index) => {
            const notificationElement = this.createNotificationElement(notification, index);
            container.appendChild(notificationElement);
        });
    }

    createNotificationElement(notification, index) {
        const div = document.createElement('div');
        div.className = `notification-item ${!notification.isRead ? 'unread' : ''}`;
        div.setAttribute('data-aos', 'fade-up');
        div.setAttribute('data-aos-delay', (index * 1 ).toString());
        div.setAttribute('data-notification-id', notification.id);

        div.innerHTML = `
            <div class="notification-icon">
                <i class="${notification.icon}"></i>
            </div>
            <div class="notification-content">
                <h3>${notification.title}</h3>
                <p>${notification.message}</p>
                <span class="notification-time">${this.formatTimestamp(notification.timestamp)}</span>
            </div>
        `;

        return div;
    }

    // Mark single notification as read
    markAsRead(notificationId) {
        if (!this.notificationsData) return;
        
        const notification = this.notificationsData.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.isRead = true;
            
            // Update UI
            const element = document.querySelector(`[data-notification-id="${notificationId}"]`);
            if (element) {
                element.classList.remove('unread');
                const actionsDiv = element.querySelector('.notification-actions');
                if (actionsDiv) {
                    actionsDiv.remove();
                }
            }
            
            // Save to localStorage (in a real app, you'd save to backend)
            this.saveNotifications();
        }
    }

    // Mark all notifications as read
    markAllAsRead() {
        if (!this.notificationsData) return;
        
        this.notificationsData.notifications.forEach(notification => {
            notification.isRead = true;
        });
        
        // Update UI
        document.querySelectorAll('.notification-item.unread').forEach(item => {
            item.classList.remove('unread');
        });
        document.querySelectorAll('.mark-read-btn').forEach(btn => {
            btn.style.display = 'none';
        });
        
        this.saveNotifications();
    }

    // Clear all notifications
    clearAll() {
        if (!this.notificationsData) return;
        
        this.notificationsData.notifications = [];
        
        const container = document.querySelector('.notifications-container');
        if (container) {
            container.innerHTML = `
                <div class="notifications-empty" data-aos="fade-up">
                    <i class="fas fa-bell-slash"></i>
                    <h3>No notifications</h3>
                    <p>You're all caught up! Check back later for updates.</p>
                </div>
            `;
        }
        
        this.saveNotifications();
    }

    // Save notifications to localStorage (in a real app, you'd use backend API)
    saveNotifications() {
        if (this.notificationsData) {
            localStorage.setItem('notifications', JSON.stringify(this.notificationsData));
        }
    }

    // Load notifications from localStorage if available
    loadFromLocalStorage() {
        const saved = localStorage.getItem('notifications');
        if (saved) {
            this.notificationsData = JSON.parse(saved);
        }
    }

    // Easy function to add new notification (for admin use)
    addNotification(title, message, type = 'info', icon = 'fas fa-info-circle') {
        if (!this.notificationsData) {
            this.notificationsData = { notifications: [], lastUpdated: new Date().toISOString() };
        }
        
        const newNotification = {
            id: `notification-${Date.now()}`,
            title: title,
            message: message,
            icon: icon,
            timestamp: new Date().toISOString(),
            isRead: false,
            type: type
        };
        
        this.notificationsData.notifications.unshift(newNotification);
        this.notificationsData.lastUpdated = new Date().toISOString();
        
        this.saveNotifications();
        
        // Show red dot indicator
        if (typeof window.showNewNotification === 'function') {
            window.showNewNotification();
        }
        
        console.log('🔔 New notification added:', title);
        return newNotification;
    }
}

// Global instance
window.notificationManager = new NotificationManager();

// Easy functions for adding notifications
window.addWorkshopNotification = function(title, message, link) {
    const messageWithLink = link ? `${message} <a href="${link}" class="notification-link">Learn more</a>` : message;
    return window.notificationManager.addNotification(title, messageWithLink, 'workshop', 'fas fa-tools');
};

window.addEventNotification = function(title, message, link) {
    const messageWithLink = link ? `${message} <a href="${link}" class="notification-link">View event</a>` : message;
    return window.notificationManager.addNotification(title, messageWithLink, 'event', 'fas fa-calendar-alt');
};

window.addAnnouncementNotification = function(title, message, link) {
    const messageWithLink = link ? `${message} <a href="${link}" class="notification-link">Read more</a>` : message;
    return window.notificationManager.addNotification(title, messageWithLink, 'announcement', 'fas fa-bullhorn');
};

// Export for use in other files
window.NotificationManager = NotificationManager;
