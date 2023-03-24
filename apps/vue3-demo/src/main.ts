import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { vueErrorHandlePlugin } from '@/utils';
import router from '@/router';
import 'promise.allsettled';
import './assets/styles/index.less';

import App from './App.vue';

const render = () => {
  const app = createApp(App);

  app.use(createPinia());
  app.use(router);

  vueErrorHandlePlugin(app);

  app.mount('#app');
};

render();
