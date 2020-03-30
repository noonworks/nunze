import {
  CopySelectionMessage,
  CopySelectionResponse,
} from './messages/CopySelection';
import {
  GetSelectionMessage,
  GetSelectionResponse,
} from './messages/GetSelection';
import { LoadInventoryMessage } from './messages/LoadInventory';
import { ShowInventorySearchResultMessage } from './messages/ShowInventorySearchResult';

type MenuToContentMessages = CopySelectionMessage | GetSelectionMessage;
type MenuToContentResponses = CopySelectionResponse | GetSelectionResponse;

export type EventToContentMessage =
  | MenuToContentMessages
  | LoadInventoryMessage
  | ShowInventorySearchResultMessage;

export type EventToContentResponse = MenuToContentResponses;
