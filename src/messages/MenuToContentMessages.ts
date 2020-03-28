import { CopySelectionMessage } from './messages/CopySelection';
import { GetSelectionMessage } from './messages/GetSelection';

export type MenuToContentMessages = CopySelectionMessage | GetSelectionMessage;
