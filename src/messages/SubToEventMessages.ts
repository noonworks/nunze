import { GetOptionMessage } from './messages/GetOption';
import { SaveOptionDataMessage } from './messages/SaveOptionData';
import { ResetOptionMessage } from './messages/ResetOption';
import { DeleteLodestoneDataMessage } from './messages/DeleteLodestoneData';

export type SubToEventMessages =
  | GetOptionMessage
  | SaveOptionDataMessage
  | ResetOptionMessage
  | DeleteLodestoneDataMessage;
