import App from './app.vue';
import {
  splitData,
  subWindow,
  postOptionMessage,
  setLoadError,
} from './common';

document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.$mount('#app');
});

function update(data: string): void {
  setLoadError(false);
  try {
    const opt = JSON.parse(data);
    // if (vm == null) {
    //   createVue(opt);
    // } else {
    //   vm.data = opt.data;
    //   vm.$forceUpdate();
    // }
  } catch (e) {
    console.log(e);
    setLoadError(true);
  }
}

function hideLoader(): void {
  // TODO
}

//
// Message Listener
//
window.addEventListener(
  'message',
  (message) => {
    if (!subWindow || message.source !== subWindow) return;
    const msg = splitData(message.data);
    switch (msg.method) {
      case 'Nunze_OPTIONS_SUB_LOADED':
        // on sub window loaded
        postOptionMessage(subWindow, {
          method: 'Nunze_OPTIONS_FIRST_LOAD',
          data: '',
        });
        break;
      case 'Nunze_OPTIONS_SUB_FIRST_LOADED':
        // on completed first-load
        update(msg.data);
        hideLoader();
        break;
      case 'Nunze_LODESTONE_DATA_DELETED':
        // on loadstone data deleted
        alert('削除しました。');
        break;
      case 'Nunze_OPTIONS_SUB_SAVED':
        // on data saved
        hideLoader();
        break;
      case 'Nunze_OPTIONS_SUB_RESET':
        // on data reset
        update(msg.data);
        hideLoader();
        break;
    }
    return true;
  },
  false
);
