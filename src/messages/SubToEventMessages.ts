import { GetOptionMessage } from './messages/GetOption';
import { SaveOptionDataMessage } from './messages/SaveOptionData';
import {
  ResetOptionMessage,
  ResetOptionResponse,
} from './messages/ResetOption';
import {
  DeleteLodestoneDataMessage,
  DeleteLodestoneDataResponse,
} from './messages/DeleteLodestoneData';

export type SubToEventMessages =
  | GetOptionMessage
  | SaveOptionDataMessage
  | ResetOptionMessage
  | DeleteLodestoneDataMessage;

export type SubToEventResponses =
  | ResetOptionResponse
  | DeleteLodestoneDataResponse;
