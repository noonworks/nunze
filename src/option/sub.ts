import { splitData } from './common';
import { sendMessage as _sendMessage, MessageCallBack } from '../messages';
import { isGetOptionResponse } from '../messages/GetOption';
import { isResetOptionResponse } from '../messages/ResetOption';
import { SubToMainMessages, MainToSubMessages } from './messages';
import { SubToBackgroundMessages } from '../SubToBackgroundMessages';

//
// send message to parent window
//
function sendParent(request: SubToMainMessages): void {
  window.parent.postMessage(request.method + ':' + request.data, '*');
}

//
// send message to background script
//
const sendBackground: (
  message: SubToBackgroundMessages,
  callback?: MessageCallBack
) => void = _sendMessage;

//
// Message Listener
//
window.addEventListener(
  'message',
  (message) => {
    if (!message || message.source !== window.parent) return;
    const msg = splitData(message.data) as MainToSubMessages;
    switch (msg.method) {
      case 'Nunze_OPTIONS_FIRST_LOAD':
        sendBackground({ method: 'Nunze_getOption' }, (response) => {
          if (!response || !isGetOptionResponse(response)) return;
          sendParent({
            method: 'Nunze_OPTIONS_SUB_FIRST_LOADED',
            data: JSON.stringify(response.opt),
          });
        });
        break;
      case 'Nunze_OPTIONS_SAVE_OPTION_DATA':
        try {
          const opt = JSON.parse(msg.data);
          sendBackground({ method: 'Nunze_saveOptionData', data: opt }, () => {
            sendParent({ method: 'Nunze_OPTIONS_SUB_SAVED', data: '' });
          });
        } catch (error) {
          console.log(error);
        }
        break;
      case 'Nunze_OPTIONS_RESET':
        sendBackground({ method: 'Nunze_resetOption' }, (response) => {
          if (!response || !isResetOptionResponse(response)) return;
          sendParent({
            method: 'Nunze_OPTIONS_SUB_RESET',
            data: JSON.stringify(response.opt),
          });
        });
        break;
      case 'NUNZE_DELETE_LODESTONE_DATA':
        sendBackground({ method: 'Nunze_deleteLoadstoneData' }, () => {
          sendParent({ method: 'Nunze_LODESTONE_DATA_DELETED', data: '' });
        });
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
  sendParent({ method: 'Nunze_OPTIONS_SUB_LOADED', data: '' });
});
