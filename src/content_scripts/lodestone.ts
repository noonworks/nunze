import { loadBaggageItems } from './lodestone/loadBaggageItems';
import { InventoryData } from '../events/lodestone/inventory/data';
import { loadMetadata } from './lodestone/loadMetadata';
import { initMenu } from './lodestone/menu';
import { failAlert } from './lodestone/util';
import { sendSaveInventoriesRequest, sendGetOptionRequest } from './requests';

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
    sendSaveInventoriesRequest([inv], true)
      .then(() => {
        alert('[Nunze]リテイナー所持品情報を保存しました。');
      })
      .catch(() => {
        failAlert('リテイナー所持品情報の保存');
      });
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
  sendGetOptionRequest().then((response) => {
    if (response.opt.data.lodestone.use) doInit();
  });
}

init();
