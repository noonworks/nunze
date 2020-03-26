import { splitData, postOptionMessage } from './common';
import { sendMessage } from '../messages';
import { isGetOptionResponse } from '../messages/GetOption';
import { isResetOptionResponse } from '../messages/ResetOption';

//
// Send get option request to background script.
//
function getOptions(): void {
  sendMessage({ method: 'Nunze_getOption' }, (response) => {
    if (!response || !isGetOptionResponse(response)) return;
    postOptionMessage(window.parent, {
      method: 'Nunze_OPTIONS_SUB_FIRST_LOADED',
      data: JSON.stringify(response.opt),
    });
  });
}

//
// Send save option request to background script.
//
function saveOptionData(data: string): void {
  try {
    const opt = JSON.parse(data);
    sendMessage(
      {
        method: 'Nunze_saveOptionData',
        data: opt,
      },
      () => {
        postOptionMessage(window.parent, {
          method: 'Nunze_OPTIONS_SUB_SAVED',
          data: '',
        });
      }
    );
  } catch (error) {
    console.log(error);
  }
}

//
// Send reset option request to background script.
//
function resetOptions(): void {
  sendMessage({ method: 'Nunze_resetOption' }, (response) => {
    if (!response || !isResetOptionResponse(response)) return;
    postOptionMessage(window.parent, {
      method: 'Nunze_OPTIONS_SUB_RESET',
      data: JSON.stringify(response.opt),
    });
  });
}

//
// Send delete Lodestone data request to background script.
//
function deleteLoadstoneData(): void {
  sendMessage({ method: 'Nunze_deleteLoadstoneData' }, () => {
    postOptionMessage(window.parent, {
      method: 'Nunze_LODESTONE_DATA_DELETED',
      data: '',
    });
  });
}

//
// Message Listener
//
window.addEventListener(
  'message',
  (message) => {
    if (!message || message.source !== window.parent) return;
    const msg = splitData(message.data);
    switch (msg.method) {
      case 'Nunze_OPTIONS_FIRST_LOAD':
        getOptions();
        break;
      case 'Nunze_OPTIONS_SAVE_OPTION_DATA':
        saveOptionData(msg.data);
        break;
      case 'Nunze_OPTIONS_RESET':
        resetOptions();
        break;
      case 'NUNZE_DELETE_LODESTONE_DATA':
        deleteLoadstoneData();
        break;
    }
    return true;
  },
  false
);

//
// Initialized
//
document.addEventListener('DOMContentLoaded', () => {
  postOptionMessage(window.parent, {
    method: 'Nunze_OPTIONS_SUB_LOADED',
    data: '',
  });
});
