import { OptionStorage } from '../option/storage';
import { Inventory } from './inventory/Inventory';
import { match, MatchResult } from './match';
import { Version2 } from '../option/version2';
import { CharacterStore } from './character/character';
import { sendShowInventorySearchResult } from '../requests';

function doSearchInventory(itemName: string): MatchResult {
  // Search options
  const opt = OptionStorage.instance().load() as Version2;
  const matchOpt = {
    fuzzy: opt.data.lodestone.fuzzy,
    part: opt.data.lodestone.part,
    strictAndPart: opt.data.lodestone.strictAndPart,
    strictAndFuzzy: opt.data.lodestone.strictAndFuzzy,
    expire: opt.data.lodestone.expireDate * 24 * 60 * 60 * 1000,
  };
  // Get inventory data
  const inventories = Inventory.instance().loadAll();
  return match(itemName, inventories, matchOpt);
}

export function searchInventory(itemName: string, tabId: number): void {
  const result = doSearchInventory(itemName);
  console.log(result);
  const characters =
    result.count > 0 ? CharacterStore.instance().load().data : {};
  const url = chrome.runtime.getURL('pages/retainer_search_result.html');
  sendShowInventorySearchResult(tabId, { result, url, characters });
}
