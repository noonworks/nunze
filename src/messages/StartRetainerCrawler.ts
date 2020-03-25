import { CharacterStorageDataData } from '../events/lodestone/character/data';

export interface StartRetainerCrawlersMessage {
  method: 'Nunze_startRetainerCrawler';
  character: CharacterStorageDataData;
}
