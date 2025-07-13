import { defineStore } from 'pinia';

const alertTypes = {
  error: {
    icon: 'circle-xmark',
    title: 'Error',
    description: 'An error has occurred.',
  },
  success: {
    icon: 'check-circle',
    title: 'Success',
    description: 'Operation completed successfully.',
  },
  info: {
    icon: 'circle-info',
    title: 'Info',
    description: 'Here is some information.',
  },
  warning: {
    icon: 'triangle-exclamation',
    title: 'Warning',
    description: 'Please be careful.',
  },
};

export const useAlerts = defineStore('alerts', {
  state: () => ({
    type: '',
    visible: false,
    icon: '',
    title: '',
    description: '',
  }),
  actions: {
    show(type: string = 'info', options?: { title?: string; icon?: string; description?: string }) {
      const alert = alertTypes[type] || alertTypes.info;
      this.type = type;
      this.icon = options?.icon || alert.icon;
      this.title = options?.title || alert.title;
      this.description = options?.description || alert.description;
      this.visible = true;
    },
    showError(options?: { title?: string; icon?: string; description?: string }) {
      this.show('error', options);
    },
    showSuccess(options?: { title?: string; icon?: string; description?: string }) {
      this.show('success', options);
    },
    showInfo(options?: { title?: string; icon?: string; description?: string }) {
      this.show('info', options);
    },
    showWarning(options?: { title?: string; icon?: string; description?: string }) {
      this.show('warning', options);
    },
    hide() {
      this.visible = false;
      this.type = '';
      this.icon = '';
      this.title = '';
      this.description = '';
    },
  },
});
