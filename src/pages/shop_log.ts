import { mountVue } from './shopLog/common';
import App from './shopLog/app.vue';

document.addEventListener('DOMContentLoaded', () => {
  mountVue(new App());
});
