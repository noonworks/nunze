import {
  GetSelectionMessage,
  GetSelectionResponse,
} from './messages/GetSelection';
import {
  CopySelectionMessage,
  CopySelectionResponse,
} from './messages/CopySelection';
import { GetOptionResponse, GetOptionMessage } from './messages/GetOption';
import { LoadInventoryMessage } from './messages/LoadInventory';
import {
  ResetOptionMessage,
  ResetOptionResponse,
} from './messages/ResetOption';
import {
  DeleteLodestoneDataMessage,
  DeleteLodestoneDataResponse,
} from './messages/DeleteLodestoneData';
import { SaveOptionDataMessage } from './messages/SaveOptionData';
import { SaveInventoriesMessage } from './messages/SaveInventories';
import { SaveCharactersMessage } from './messages/SaveCharacters';
import { StartRetainerCrawlersMessage } from './messages/StartRetainerCrawler';
import { SaveFreeCompanyMessage } from './messages/SaveFreeCompany';
import {
  UpdateSearchMenuMessage,
  UpdateSearchMenuResponse,
} from './messages/UpdateSearchMenu';
import { ShowInventorySearchResultMessage } from './messages/ShowInventorySearchResult';

type Messages =
  | GetOptionMessage
  | SaveOptionDataMessage
  | ResetOptionMessage
  | DeleteLodestoneDataMessage
  | GetSelectionMessage
  | CopySelectionMessage
  | LoadInventoryMessage
  | SaveInventoriesMessage
  | SaveCharactersMessage
  | StartRetainerCrawlersMessage
  | SaveFreeCompanyMessage
  | UpdateSearchMenuMessage
  | ShowInventorySearchResultMessage;

type Responses =
  | GetOptionResponse
  | ResetOptionResponse
  | DeleteLodestoneDataResponse
  | GetSelectionResponse
  | CopySelectionResponse
  | UpdateSearchMenuResponse;

export type MessageCallBack = (response: Responses) => void;

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
