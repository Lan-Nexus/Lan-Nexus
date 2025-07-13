import { defineStore } from 'pinia';

function getLocalStorage(key: string, defaultValue: string = ''): string {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key) || defaultValue;
  }
  return defaultValue;
}

function setLocalStorage(key: string, value: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, value);
  }
}

function getOrCreateClientId(): string {
  if (typeof window !== 'undefined') {
    let clientId = localStorage.getItem('clientId');
    if (!clientId) {
      clientId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
      localStorage.setItem('clientId', clientId);
    }
    return clientId;
  }
  return '';
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    username: getLocalStorage('username'),
    seatNumber: getLocalStorage('seatNumber'),
    clientId: getOrCreateClientId()
  }),
  getters: {
    getUsername: (state) => state.username,
    getSeatNumber: (state) => state.seatNumber,
    getClientId: (state) => state.clientId
  },
  actions: {
    setUsername(username: string) {
      this.username = username;
      setLocalStorage('username', username);
    },
    setSeatNumber(seatNumber: string) {
      this.seatNumber = seatNumber;
      setLocalStorage('seatNumber', seatNumber);
    },
    setClientId(clientId: string) {
      this.clientId = clientId;
      setLocalStorage('clientId', clientId);
    }
  }
});
