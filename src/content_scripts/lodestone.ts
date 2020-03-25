// content script for lodestone pages.

import { sendMessage, Messages } from '../messages';
import { isGetOptionResponse } from '../messages/GetOption';
import { loadBaggageItems } from './lodestone/loadBaggageItems';
import { InventoryData } from '../events/lodestone/inventory/data';
import { isSaveInventoriesResponse } from '../messages/SaveInventories';
import { loadMetadata } from './lodestone/loadMetadata';
import { initMenu } from './lodestone/menu';
import { failAlert } from './lodestone/util';

//
// Load retainer inventory
//
const REGEX_BAGGAGE = /character\/([0-9a-z]+)\/retainer\/([0-9a-z]+)\/baggage/;
function loadInventory(): InventoryData | null {
  const m = window.location.href.match(REGEX_BAGGAGE);
  if (!m) return null;
  return {
    characterId: m[1],
    retainerId: m[2],
    loadDateTime: new Date().getTime(),
    items: loadBaggageItems(),
  };
}

function onMessage(message: Messages): boolean {
  if (message.method === 'Nunze_LoadInventory') {
    const inv = loadInventory();
    if (!inv) {
      failAlert('リテイナー所持品情報の取得');
      return true;
    }
    sendMessage(
      {
        method: 'Nunze_saveInventories',
        inventories: [inv],
        inCrawling: true,
      },
      (response) => {
        if (
          !response ||
          !isSaveInventoriesResponse(response) ||
          response.status == 'fail'
        ) {
          failAlert('リテイナー所持品情報の保存');
        } else if (response.status == 'completed') {
          alert('[Nunze]リテイナー所持品情報を保存しました。');
        }
      }
    );
  }
  return true;
}

function doInit(): void {
  console.log('Nunze script lodestone enabled.');
  chrome.runtime.onMessage.addListener(onMessage);
  initMenu(loadMetadata());
}

function init(): void {
  console.log('Nunze script lodestone loaded.');
  sendMessage({ method: 'Nunze_getOption' }, (response) => {
    if (!response || !isGetOptionResponse(response)) return;
    if (response.opt.data.lodestone.use) doInit();
  });
}

init();
