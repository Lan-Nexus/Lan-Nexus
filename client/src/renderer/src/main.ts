import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import {router} from './router'
import './assets/style.css'

createApp(App)
  .use(createPinia())
  .use(router)
  .mount('#app')


window.functions = new Proxy(
  {},
  {
    get: function (target, prop, receiver) {
      return (args) => {
        return new Promise((resolve, reject) => {
          window.electron.ipcRenderer.send('function', {
            functionName: prop,
            args: args,
          });

          window.electron.ipcRenderer.once(
            'function-reply',
            (event, arg) => {
              resolve(arg);
            }
          );

          window.electron.ipcRenderer.once(
            'function-error',
            (event, arg) => {
              reject(arg);
            }
          );
        });
      };
    },
  }
);

