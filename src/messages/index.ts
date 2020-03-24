import { UpdateSearchMenuMessage } from './UpdateSearchMenu';
import { GetSelectionMessage, GetSelectionResponse } from './GetSelection';
import { CopySelectionMessage, CopySelectionResponse } from './CopySelection';
import { ShowInventorySearchResultMessage } from './ShowInventorySearchResult';
import { ErrorResponse } from './Error';

export type Messages =
  | UpdateSearchMenuMessage
  | GetSelectionMessage
  | CopySelectionMessage
  | ShowInventorySearchResultMessage;

export type MessageCallBack = (response: string) => void;

export type Responses =
  | ErrorResponse
  | GetSelectionResponse
  | CopySelectionResponse;
export type ResponseSenders = (message: Responses) => void;

export function sendMessage(
  message: Messages,
  callback?: MessageCallBack
): void {
  chrome.runtime.sendMessage(message, callback);
}
