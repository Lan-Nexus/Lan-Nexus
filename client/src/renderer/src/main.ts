import { createApp } from 'vue';
import { createPinia } from 'pinia';

import './utils/logger.js';

declare global {
  interface Window {
    functions: unknown;
  }
}

import App from './App.vue';
import { router } from './router';
import './assets/style.css';

createApp(App).use(createPinia()).use(router).mount('#app');

window.functions = new Proxy(
  {},
  {
    get: function (_target, prop) {
      return (args) => {
        return new Promise((resolve, reject) => {
          window.electron.ipcRenderer.send('function', {
            functionName: prop,
            args: args,
          });

          window.electron.ipcRenderer.once('function-reply', (_event, arg) => {
            resolve(arg);
          });

          window.electron.ipcRenderer.once('function-error', (_event, arg) => {
            reject(arg);
          });
        });
      };
    },
  }
);
