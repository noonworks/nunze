import { init as initMenu } from './menu/index';
import { NunzeMenu } from './menu/NunzeMenu';
import { OptionStorage } from './option/storage';
import {
  startRetainerCrawler,
  saveInventoriesInCrawling,
  saveLogsInCrawling,
} from './lodestone/crawler';
import { CharacterStore } from './lodestone/character/character';
import { Inventory } from './lodestone/inventory/Inventory';
import {
  ContentToEventMessage,
  ContentToEventResponse,
} from '../messages/ContentToEventMessage';
import {
  SubToEventMessages,
  SubToEventResponses,
} from '../messages/SubToEventMessages';
import { Version2 } from './option/version2';
import {
  ShopLogToEventMessages,
  ShopLogToEventResponses,
} from '../messages/ShopLogToEventMessages';
import { LogStore } from './lodestone/log/log';
import { RowItem } from '../pages/shopLog/common';

function makeRowItems(): RowItem[] {
  const logs = LogStore.instance().loadAll();
  const characters = CharacterStore.instance().load().data;
  const ret: RowItem[] = [];
  for (let i = 0; i < logs.length; i++) {
    const log = logs[i];
    const c = characters[log.characterId];
    const cIds = Object.keys(characters);
    const cIndex = cIds.indexOf(log.characterId);
    if (!c || cIndex < 0) continue;
    const r = c.retainers[log.retainerId];
    const retainer = { retainer: r, character: c };
    for (let j = 0; j < log.items.length; j++) {
      ret.push({
        id: cIndex * 1000 + i * 100 + j,
        retainer,
        name: log.items[j].name,
        num: log.items[j].number,
        total: log.items[j].price,
        customer: log.items[j].customer,
        dateTime: log.items[j].dateTime,
      });
    }
  }
  return ret;
}

type ResponseSenders = (
  response:
    | ContentToEventResponse
    | SubToEventResponses
    | ShopLogToEventResponses
) => void;
function onMessage(
  message: ContentToEventMessage | SubToEventMessages | ShopLogToEventMessages,
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
    case 'Nunze_saveLogs':
      sendResponse({
        method: 'Nunze_saveLogs',
        succeed: saveLogsInCrawling(message.items),
      });
      break;
    case 'Nunze_deleteLodestoneData':
      Inventory.instance().removeAll();
      CharacterStore.instance().remove();
      sendResponse({ method: 'Nunze_deleteLodestoneData', succeed: true });
      break;
    case 'Nunze_resetOption':
      sendResponse({
        method: 'Nunze_resetOption',
        opt: OptionStorage.instance().reset() as Version2,
      });
      break;
    case 'Nunze_getShopLogs':
      sendResponse({
        method: 'Nunze_getShopLogs',
        items: makeRowItems(),
      });
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

function init(): void {
  console.log('Nunze script events loaded.');
  chrome.runtime.onMessage.addListener(onMessage);
  initMenu();
}

init();
