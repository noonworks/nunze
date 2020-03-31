import { InventoryItem } from './inventory/data';

export interface MatchedItem extends InventoryItem {
  characterId: string;
  retainerId: string;
  itemIndex?: number;
  matchLevel: number;
}

export const RESULT_KEYS = [
  'strict',
  'fuzzyMatch',
  'part',
  'fuzzyPart',
] as const;

export interface MergeResult {
  loadDateTime: string;
  count: number;
  strict: MatchedItem[][];
  part: MatchedItem[][];
  fuzzyMatch: MatchedItem[][];
  fuzzyPart: MatchedItem[][];
}

export interface MatchResult extends MergeResult {
  word: string;
}
