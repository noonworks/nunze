import { ContentToEventMessage } from '../messages/ContentToEventMessage';
import { MessageCallBack, _sendMessage } from '../messages';
import { isSaveInventoriesResponse } from '../messages/messages/SaveInventories';
import { InventoryData } from '../events/lodestone/inventory/data';
import {
  isGetOptionResponse,
  GetOptionResponse,
} from '../messages/messages/GetOption';
import { CharacterStorageDataData } from '../events/lodestone/character/data';
import { isSaveCharactersResponse } from '../messages/messages/SaveCharacters';
import {
  isSaveFreeCompanyResponse,
  SavedFC,
} from '../messages/messages/SaveFreeCompany';
import { isSaveLogsResponse } from '../messages/messages/SaveLogsMessage';
import { LogData } from '../events/lodestone/log/data';

//
// send message to event script
//
const sendToEvent: (
  message: ContentToEventMessage,
  callback?: MessageCallBack
) => void = _sendMessage;

//
//
//
export function sendUpdateSearchMenu(name: string): void {
  sendToEvent({ method: 'Nunze_updateSearchMenu', name });
}

//
//
//
export function sendSaveFreeCompanyRequest(fc: SavedFC): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    sendToEvent({ method: 'Nunze_saveFreeCompany', fc }, (response) => {
      if (
        !response ||
        !isSaveFreeCompanyResponse(response) ||
        !response.succeed
      )
        reject();
      else resolve();
    });
  });
}

//
//
//
export function sendStartRetainerCrawlerRequest(
  character: CharacterStorageDataData
): void {
  sendToEvent({ method: 'Nunze_startRetainerCrawler', character });
}

//
//
//
export function sendSaveCharactersRequest(
  characters: CharacterStorageDataData[]
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    sendToEvent({ method: 'Nunze_saveCharacters', characters }, (response) => {
      if (
        !response ||
        !isSaveCharactersResponse(response) ||
        !response.succeed
      ) {
        reject();
      } else resolve();
    });
  });
}

//
// send save inventories request
//
export function sendSaveInventoriesRequest(
  inventories: InventoryData[],
  inCrawling: boolean
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    sendToEvent(
      {
        method: 'Nunze_saveInventories',
        inventories,
        inCrawling,
      },
      (response) => {
        if (
          !response ||
          !isSaveInventoriesResponse(response) ||
          response.status == 'fail'
        ) {
          reject();
        } else if (response.status == 'completed') {
          resolve();
        }
      }
    );
  });
}

//
// send save log items request
//
export function sendSaveLogsRequest(items: LogData[]): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    sendToEvent({ method: 'Nunze_saveLogs', items }, (response) => {
      if (!response || !isSaveLogsResponse(response) || !response.succeed) {
        reject();
      } else resolve();
    });
  });
}

//
// send get option request
//
export function sendGetOptionRequest(): Promise<GetOptionResponse> {
  return new Promise<GetOptionResponse>((resolve, reject) => {
    sendToEvent({ method: 'Nunze_getOption' }, (response) => {
      if (!response || !isGetOptionResponse(response)) reject();
      else resolve(response);
    });
  });
}
