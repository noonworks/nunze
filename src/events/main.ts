import { init as initMenu } from './menu/index';
import { NunzeMenu } from './menu/NunzeMenu';
import { OptionStorage } from './option/storage';
import {
  startRetainerCrawler,
  saveInventoriesInCrawling,
} from './lodestone/crawler';
import { CharacterStore } from './lodestone/character/character';
import { Inventory } from './lodestone/inventory/Inventory';
import {
  ContentToEventMessage,
  ContentToEventResponse,
} from '../messages/ContentToEventMessage';

type ResponseSenders = (response: ContentToEventResponse) => void;
function onMessage(
  message: ContentToEventMessage,
  sender: chrome.runtime.MessageSender,
  sendResponse: ResponseSenders
): boolean {
  switch (message.method) {
    //
    // Context Menu methods
    //
    case 'Nunze_updateSearchMenu':
      NunzeMenu.instance().updateSearchWord(message.name);
      sendResponse({ method: 'Nunze_updateSearchMenu', succeed: true });
      break;
    //
    // Crawler
    //
    case 'Nunze_startRetainerCrawler':
      startRetainerCrawler(message.character, sender.tab);
      break;
    //
    // Character and Inventory Data methods
    //
    case 'Nunze_saveCharacters':
      CharacterStore.instance().saveCharacters(message.characters);
      sendResponse({ method: 'Nunze_saveCharacters', succeed: true });
      break;
    case 'Nunze_saveInventories':
      if (message.inCrawling) {
        const ret = saveInventoriesInCrawling(message.inventories, sender.tab);
        sendResponse({ method: 'Nunze_saveInventories', status: ret });
      } else {
        Inventory.instance().save(message.inventories);
        sendResponse({ method: 'Nunze_saveInventories', status: 'completed' });
      }
      break;
    //
    // FC data methods
    //
    case 'Nunze_saveFreeCompany':
      CharacterStore.instance().saveFreeCompany(message.fc);
      sendResponse({ method: 'Nunze_saveFreeCompany', succeed: true });
      break;
    //
    // Option Data methods
    //
    case 'Nunze_getOption':
      sendResponse({
        method: 'Nunze_getOption',
        opt: OptionStorage.instance().load(),
      });
      break;
    case 'Nunze_saveOptionData':
      OptionStorage.instance().save(message.data);
      sendResponse({ method: 'Nunze_saveOptionData', succeed: true });
      break;
  }
  return true;
}
// chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
//   switch (message.method) {
//     // Character and Inventory Data methods
// case 'Nunze_deleteLoadstoneData':
//   deleteInventories();
//   deleteCharacters();
//   sendResponse({ method: 'Nunze_deleteLoadstoneData', succeed: true });
//   break;
//     // Option Data methods
//     case 'Nunze_resetOption':
//       sendResponse({ opt: resetOption() });
//       break;
//   }
// });

function init(): void {
  console.log('Nunze script events loaded.');
  chrome.runtime.onMessage.addListener(onMessage);
  initMenu();
}

init();
