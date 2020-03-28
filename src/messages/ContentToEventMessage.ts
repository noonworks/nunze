import {
  GetOptionMessage,
  GetOptionResponse,
} from '../messages/messages/GetOption';
import {
  SaveInventoriesMessage,
  SaveInventoriesResponse,
} from '../messages/messages/SaveInventories';
import {
  SaveCharactersMessage,
  SaveCharactersResponse,
} from './messages/SaveCharacters';
import { StartRetainerCrawlersMessage } from './messages/StartRetainerCrawler';
import {
  SaveFreeCompanyMessage,
  SaveFreeCompanyResponse,
} from './messages/SaveFreeCompany';
import {
  UpdateSearchMenuMessage,
  UpdateSearchMenuResponse,
} from './messages/UpdateSearchMenu';
import {
  SaveOptionDataMessage,
  SaveOptionDataResponse,
} from './messages/SaveOptionData';

type LodestoneToEventMessages =
  | GetOptionMessage
  | SaveInventoriesMessage
  | SaveCharactersMessage
  | StartRetainerCrawlersMessage
  | SaveFreeCompanyMessage;

type LodestoneToEventResponses =
  | GetOptionResponse
  | SaveInventoriesResponse
  | SaveCharactersResponse
  | SaveFreeCompanyResponse;

type GlobalToEventMessages = UpdateSearchMenuMessage | SaveOptionDataMessage;
type GlobalToEventResponses = UpdateSearchMenuResponse | SaveOptionDataResponse;

export type ContentToEventMessage =
  | LodestoneToEventMessages
  | GlobalToEventMessages;

export type ContentToEventResponse =
  | LodestoneToEventResponses
  | GlobalToEventResponses;
