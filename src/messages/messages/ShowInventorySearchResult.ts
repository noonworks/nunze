import { MatchResult } from '../../events/lodestone/match';
import { CharacterStorageDataData } from '../../events/lodestone/character/data';

export interface InventorySearchResult {
  result: MatchResult;
  url: string;
  characters: { [key: string]: CharacterStorageDataData };
}

export interface ShowInventorySearchResultMessage
  extends InventorySearchResult {
  method: 'Nunze_showInventorySearchResult';
}
