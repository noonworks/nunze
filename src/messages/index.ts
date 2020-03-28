import {
  UpdateSearchMenuMessage,
  UpdateSearchMenuResponse,
} from './messages/UpdateSearchMenu';
import {
  GetSelectionMessage,
  GetSelectionResponse,
} from './messages/GetSelection';
import {
  CopySelectionMessage,
  CopySelectionResponse,
} from './messages/CopySelection';
import { ShowInventorySearchResultMessage } from './messages/ShowInventorySearchResult';
import { GetOptionResponse, GetOptionMessage } from './messages/GetOption';
import {
  SaveInventoriesResponse,
  SaveInventoriesMessage,
} from './messages/SaveInventories';
import {
  SaveCharactersResponse,
  SaveCharactersMessage,
} from './messages/SaveCharacters';
import {
  SaveFreeCompanyResponse,
  SaveFreeCompanyMessage,
} from './messages/SaveFreeCompany';
import { ErrorResponse } from './messages/Error';
import { LoadInventoryMessage } from './messages/LoadInventory';
import { StartRetainerCrawlersMessage } from './messages/StartRetainerCrawler';
import { ResetOptionMessage } from './messages/ResetOption';
import { DeleteLodestoneDataMessage } from './messages/DeleteLodestoneData';
import { SaveOptionDataMessage } from './messages/SaveOptionData';

type Messages =
  | UpdateSearchMenuMessage
  | GetSelectionMessage
  | CopySelectionMessage
  | ShowInventorySearchResultMessage
  | GetOptionMessage
  | LoadInventoryMessage
  | SaveInventoriesMessage
  | SaveCharactersMessage
  | StartRetainerCrawlersMessage
  | SaveFreeCompanyMessage
  | SaveOptionDataMessage
  | ResetOptionMessage
  | DeleteLodestoneDataMessage;

type Responses =
  | ErrorResponse
  | UpdateSearchMenuResponse
  | GetSelectionResponse
  | CopySelectionResponse
  | GetOptionResponse
  | SaveInventoriesResponse
  | SaveCharactersResponse
  | SaveFreeCompanyResponse;

type MessageCallBack = (response: Responses) => void;

export function _sendMessage(
  message: Messages,
  callback?: MessageCallBack
): void {
  chrome.runtime.sendMessage(message, callback);
}

export function _sendMessageToTab(
  tabId: number,
  message: Messages,
  callback?: MessageCallBack
): void {
  chrome.tabs.sendMessage(tabId, message, callback);
}
