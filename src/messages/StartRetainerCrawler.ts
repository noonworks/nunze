import { SavedCharacter } from './SaveCharacters';

export interface StartRetainerCrawlersMessage {
  method: 'Nunze_startRetainerCrawler';
  character: SavedCharacter;
}
