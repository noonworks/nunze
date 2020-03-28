import { GetOptionMessage } from '../messages/messages/GetOption';
import { SaveInventoriesMessage } from '../messages/messages/SaveInventories';
import { SaveCharactersMessage } from './messages/SaveCharacters';
import { StartRetainerCrawlersMessage } from './messages/StartRetainerCrawler';
import { SaveFreeCompanyMessage } from './messages/SaveFreeCompany';
import { UpdateSearchMenuMessage } from './messages/UpdateSearchMenu';

type LodestoneToEventMessages =
  | GetOptionMessage
  | SaveInventoriesMessage
  | SaveCharactersMessage
  | StartRetainerCrawlersMessage
  | SaveFreeCompanyMessage;

type GlobalToEventMessages = UpdateSearchMenuMessage;

export type ContentToEventMessage =
  | LodestoneToEventMessages
  | GlobalToEventMessages;
