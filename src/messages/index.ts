import {
  UpdateSearchMenuMessage,
  UpdateSearchMenuResponse,
} from './UpdateSearchMenu';
import { GetSelectionMessage, GetSelectionResponse } from './GetSelection';
import { CopySelectionMessage, CopySelectionResponse } from './CopySelection';
import { ShowInventorySearchResultMessage } from './ShowInventorySearchResult';
import { ErrorResponse } from './Error';

export type Messages =
  | UpdateSearchMenuMessage
  | GetSelectionMessage
  | CopySelectionMessage
  | ShowInventorySearchResultMessage;

export type Responses =
  | ErrorResponse
  | UpdateSearchMenuResponse
  | GetSelectionResponse
  | CopySelectionResponse;

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
