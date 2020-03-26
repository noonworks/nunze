import {
  UpdateSearchMenuMessage,
  UpdateSearchMenuResponse,
} from './UpdateSearchMenu';
import { GetSelectionMessage, GetSelectionResponse } from './GetSelection';
import { CopySelectionMessage, CopySelectionResponse } from './CopySelection';
import { ShowInventorySearchResultMessage } from './ShowInventorySearchResult';
import { ErrorResponse } from './Error';
import { GetOptionMessage, GetOptionResponse } from './GetOption';
import { LoadInventoryMessage } from './LoadInventory';
import {
  SaveInventoriesMessage,
  SaveInventoriesResponse,
} from './SaveInventories';
import {
  SaveCharactersMessage,
  SaveCharactersResponse,
} from './SaveCharacters';
import { StartRetainerCrawlersMessage } from './StartRetainerCrawler';
import {
  SaveFreeCompanyMessage,
  SaveFreeCompanyResponse,
} from './SaveFreeCompany';
import { SaveOptionDataMessage } from './SaveOptionData';
import { ResetOptionMessage } from './ResetOption';
import { DeleteLoadstoneDataMessage } from './DeleteLoadstoneData';

export type Messages =
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
  | DeleteLoadstoneDataMessage;

export type Responses =
  | ErrorResponse
  | UpdateSearchMenuResponse
  | GetSelectionResponse
  | CopySelectionResponse
  | GetOptionResponse
  | SaveInventoriesResponse
  | SaveCharactersResponse
  | SaveFreeCompanyResponse;

export type MessageCallBack = (response: Responses) => void;
export type ResponseSenders = (message: Responses) => void;

export function sendMessage(
  message: Messages,
  callback?: MessageCallBack
): void {
  chrome.runtime.sendMessage(message, callback);
}

export function sendMessageToTab(
  tabId: number,
  message: Messages,
  callback?: MessageCallBack
): void {
  chrome.tabs.sendMessage(tabId, message, callback);
}
