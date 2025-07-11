import { createApp } from 'vue';
import { createPinia } from 'pinia';

// FontAwesome setup
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheckCircle, faCircleInfo, faTriangleExclamation, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
library.add(faCheckCircle, faCircleInfo, faTriangleExclamation, faCircleXmark);

import './utils/logger.js';

declare global {
  interface Window {
    functions: unknown;
    progressAPI: {
      onProgress: (callback: (amount: string, name: string) => void) => void;
      onProgressActive: (callback: (state: boolean) => void) => void;
      onProgressLoading: (callback: () => void) => void;
    }
    api: {
      function: (...args: any[]) => Promise<any>
    }
  }
}

import App from './App.vue';
import { router } from './router';
import './assets/style.css';

function startApp() {
  const app = createApp(App);
  app.use(createPinia()).use(router);
  app.component('FontAwesomeIcon', FontAwesomeIcon);
  app.mount('#app');

  // Example usage of the new bridge:
  // (You can remove this or adapt as needed)

}

function waitForElectronAndStart() {
  if (window.electron) {
    startApp();
  } else {
    // Poll every 50ms for up to 2 seconds
    let waited = 0;
    const interval = setInterval(() => {
      if (window.electron) {
        clearInterval(interval);
        startApp();
      } else if ((waited += 50) >= 2000) {
        clearInterval(interval);
        console.error('Electron preload not detected after 2 seconds.');
        window.alert('Failed to initialize the application. Please ensure you are running it in an Electron environment.');
      }
    }, 50);
  }
}

document.addEventListener('DOMContentLoaded', waitForElectronAndStart);

