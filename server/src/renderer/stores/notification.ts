import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export type NotificationType = {
    type: 'info' | 'success' | 'warning' | 'error',
    message: string,
}

export const useNotificationStore = defineStore('Notification', {
    state: () => ({
        notifications: [] as NotificationType[],
    }),

    getters: {
        allNotifications: (state) => state.notifications,
        hasNotifications: (state) => state.notifications.length > 0,
        drawNotifications: (state) => {
            setTimeout(() => {
                state.notifications.shift();
            }, 5000);

            return state.notifications[0];
        }
    },

    actions: {
        addNotification(type: 'info' | 'success' | 'warning' | 'error', message: string) {
            this.notifications.push({ type, message });
        },

        clearNotifications() {
            this.notifications = [];
        },
    },
});
