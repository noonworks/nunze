import {
  CopySelectionMessage,
  CopySelectionResponse,
} from './messages/CopySelection';
import {
  GetSelectionMessage,
  GetSelectionResponse,
} from './messages/GetSelection';
import { LoadInventoryMessage } from './messages/LoadInventory';

type MenuToContentMessages = CopySelectionMessage | GetSelectionMessage;
type MenuToContentResponses = CopySelectionResponse | GetSelectionResponse;

export type EventToContentMessage =
  | MenuToContentMessages
  | LoadInventoryMessage;

export type EventToContentResponse = MenuToContentResponses;
