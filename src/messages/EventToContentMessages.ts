import { CopySelectionMessage } from './messages/CopySelection';
import { GetSelectionMessage } from './messages/GetSelection';
import { LoadInventoryMessage } from './messages/LoadInventory';

type MenuToContentMessages = CopySelectionMessage | GetSelectionMessage;

export type EventToContentMessage =
  | MenuToContentMessages
  | LoadInventoryMessage;
