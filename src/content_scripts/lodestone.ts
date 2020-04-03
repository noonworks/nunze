import { loadBaggageItems } from './lodestone/loadBaggageItems';
import { loadMetadata } from './lodestone/loadMetadata';
import { initMenu } from './lodestone/menu';
import { failAlert } from './lodestone/util';
import { sendSaveInventoriesRequest, sendGetOptionRequest } from './requests';
import { EventToContentMessage } from '../messages/EventToContentMessages';
import { loadShopItems } from './lodestone/loadShop';

//
// Load retainer inventory
//
const REGEX_BAGGAGE = /character\/([0-9a-z]+)\/retainer\/([0-9a-z]+)\/baggage/;
function loadInventory(): void {
  const reject = (): void => {
    failAlert('リテイナー所持品情報の取得');
  };
  const m = window.location.href.match(REGEX_BAGGAGE);
  if (!m) {
    reject();
    return;
  }
  loadBaggageItems()
    .then((items) => {
      sendSaveInventoriesRequest(
        [
          {
            characterId: m[1],
            retainerId: m[2],
            loadDateTime: new Date().getTime(),
            items,
          },
        ],
        true
      )
        .then(() => {
          alert('[Nunze]リテイナー所持品情報を保存しました。');
        })
        .catch(reject);
    })
    .catch(reject);
}

//
// Load retainer shop data
//
const REGEX_SHOP = /character\/([0-9a-z]+)\/retainer\/([0-9a-z]+)/;
function loadShop(): void {
  const reject = (): void => {
    failAlert('リテイナー販売品情報の取得');
  };
  const m = window.location.href.match(REGEX_SHOP);
  if (!m) {
    reject();
    return;
  }
  const shop = loadShopItems();
  sendSaveInventoriesRequest(
    [
      {
        characterId: m[1],
        retainerId: m[2] + '_shop',
        loadDateTime: new Date().getTime(),
        items: shop.shopItems.map((i) => {
          return {
            name: i.name,
            number: i.num,
            HQ: i.HQ,
            collectable: false,
          };
        }),
      },
    ],
    true
  )
    .then(() => {
      alert('[Nunze]リテイナー販売品情報を保存しました。');
    })
    .catch(reject);
}

function onMessage(message: EventToContentMessage): boolean {
  switch (message.method) {
    case 'Nunze_LoadInventory':
      loadInventory();
      break;
    case 'Nunze_LoadShop':
      loadShop();
      break;
    default:
      break;
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
