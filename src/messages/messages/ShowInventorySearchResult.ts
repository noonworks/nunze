import { CharacterStorageDataData } from '../../events/lodestone/character/data';
import { MatchResult } from '../../events/lodestone/matchTypes';

export interface InventorySearchResult {
  result: MatchResult;
  url: string;
  characters: { [key: string]: CharacterStorageDataData };
}

export interface ShowInventorySearchResultMessage
  extends InventorySearchResult {
  method: 'Nunze_showInventorySearchResult';
}
