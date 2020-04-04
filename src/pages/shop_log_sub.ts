import { SubToMainMessages, MainToSubMessages } from './shopLog/messages';
import { splitData } from './shopLog/common';
import {
  GetShopLogsMessage,
  isGetShopLogsResponse,
} from '../messages/messages/GetShopLogsMessage';
import { _sendMessage, MessageCallBack } from '../messages';

//
// send message to parent window
//
function sendParent(request: SubToMainMessages): void {
  window.parent.postMessage(request.method + ':' + request.data, '*');
}

//
// Initialized
//
document.addEventListener('DOMContentLoaded', () => {
  sendParent({ method: 'Nunze_SL_SUB_LOADED', data: '' });
});

//
// send message to background script
//
const sendToEvent: (
  message: GetShopLogsMessage,
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
      case 'Nunze_SL_FIRST_LOAD':
        sendToEvent({ method: 'Nunze_getShopLogs' }, (response) => {
          if (!response || !isGetShopLogsResponse(response)) return;
          sendParent({
            method: 'Nunze_SL_SUB_FIRST_LOADED',
            data: JSON.stringify(response.items),
          });
        });
        break;
    }
    return true;
  },
  false
);
