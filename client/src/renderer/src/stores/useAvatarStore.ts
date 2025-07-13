import { defineStore } from 'pinia';
import { createAvatar } from '@dicebear/core';
import { bigEarsNeutral } from '@dicebear/collection';

const colors = [
  "b6e3f4", "c0aede", "d1d4f9", "ffd5dc", "ffdfbf", "c2f5b5", "f7f7b6", "f7c6b6", "e0bb95", "f1c27d", "ffdbac", "d1a17b", "a87554", "6f4e37", "f5e6da", "f7cac9", "b5ead7", "ffb7b2", "b28dff", "f7b267", "f4845f", "f27059", "b8b8ff", "b5ead7", "c7ceea"
];

// function getLocalStorage(key: string, defaultValue: string = ''): string {
//   if (typeof window !== 'undefined') {
//     return localStorage.getItem(key) || defaultValue;
//   }
//   return defaultValue;
// }

function setLocalStorage(key: string, value: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, value);
  }
}

function getOrCreateAvatar(): string {
  if (typeof window !== 'undefined') {
    let avatar = localStorage.getItem('avatar');
    if (!avatar) {
      avatar = createAvatar(bigEarsNeutral, {
        radius: 25,
        seed: Math.random().toString(36).substring(2, 15),
        backgroundColor: colors,
      }).toDataUri();
      localStorage.setItem('avatar', avatar);
    }
    return avatar;
  }
  return '';
}

export const useAvatarStore = defineStore('avatar', {
  state: () => ({
    avatar: getOrCreateAvatar(),
  }),
  actions: {
    get(): string {
      return this.avatar;
    },
    set(newAvatar: string): void {
      this.avatar = newAvatar;
      setLocalStorage('avatar', newAvatar);
    },
    clear(): void {
      this.avatar = '';
      setLocalStorage('avatar', '');
    },
  },
});