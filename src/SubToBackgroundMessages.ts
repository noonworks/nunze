import { GetOptionMessage } from './messages/GetOption';
import { SaveOptionDataMessage } from './messages/SaveOptionData';
import { ResetOptionMessage } from './messages/ResetOption';
import { DeleteLoadstoneDataMessage } from './messages/DeleteLoadstoneData';

export type SubToBackgroundMessages =
  | GetOptionMessage
  | SaveOptionDataMessage
  | ResetOptionMessage
  | DeleteLoadstoneDataMessage;
