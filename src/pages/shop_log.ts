import {
  mountVue,
  initSubWindow,
  subWindow,
  splitData,
  sendToSub,
  RowItem,
  updateRowItems,
} from './shopLog/common';
import App from './shopLog/app.vue';
import { SubToMainMessages } from './shopLog/messages';

document.addEventListener('DOMContentLoaded', () => {
  initSubWindow();
  mountVue(new App());
});

function update(data: string): void {
  try {
    const items: RowItem[] = JSON.parse(data);
    updateRowItems(items);
  } catch (e) {
    console.log(e);
  }
}

//
// Message Listener
//
window.addEventListener(
  'message',
  (message) => {
    if (!subWindow || message.source !== subWindow) return;
    const msg = splitData(message.data) as SubToMainMessages;
    switch (msg.method) {
      case 'Nunze_SL_SUB_LOADED':
        sendToSub({ method: 'Nunze_SL_FIRST_LOAD', data: '' });
        break;
      case 'Nunze_SL_SUB_FIRST_LOADED':
        update(msg.data);
        break;
    }
    return true;
  },
  false
);
