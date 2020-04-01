import { loadBaggageItems } from './lodestone/loadBaggageItems';
import { InventoryData } from '../events/lodestone/inventory/data';
import { loadMetadata } from './lodestone/loadMetadata';
import { initMenu } from './lodestone/menu';
import { failAlert } from './lodestone/util';
import { sendSaveInventoriesRequest, sendGetOptionRequest } from './requests';
import { EventToContentMessage } from '../messages/EventToContentMessages';

//
// Load retainer inventory
//
const REGEX_BAGGAGE = /character\/([0-9a-z]+)\/retainer\/([0-9a-z]+)\/baggage/;
function loadInventory(): Promise<InventoryData> {
  return new Promise<InventoryData>((resolve, reject) => {
    const m = window.location.href.match(REGEX_BAGGAGE);
    if (!m) {
      reject();
      return;
    }
    loadBaggageItems()
      .then((items) => {
        resolve({
          characterId: m[1],
          retainerId: m[2],
          loadDateTime: new Date().getTime(),
          items,
        });
      })
      .catch(reject);
  });
}

function onMessage(message: EventToContentMessage): boolean {
  if (message.method === 'Nunze_LoadInventory') {
    loadInventory()
      .then((inv) => {
        sendSaveInventoriesRequest([inv], true)
          .then(() => {
            alert('[Nunze]リテイナー所持品情報を保存しました。');
          })
          .catch(() => {
            failAlert('リテイナー所持品情報の保存');
          });
      })
      .catch(() => {
        failAlert('リテイナー所持品情報の取得');
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
