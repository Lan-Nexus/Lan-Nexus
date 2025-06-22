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
  }
}

import App from './App.vue';
import { router } from './router';
import './assets/style.css';


const app = createApp(App);
app.use(createPinia()).use(router);
app.component('FontAwesomeIcon', FontAwesomeIcon);
app.mount('#app');

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
