import { OptionStorage } from '../option/storage';
import { Inventory } from './inventory/Inventory';
import { match, MatchResult } from './match';
import { Version2 } from '../option/version2';

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
  console.log(itemName, tabId);
  const result = doSearchInventory(itemName);
  console.log(result);
  // const characters = result.number > 0 ? _getCharacters().data : {};
  // const url = chrome.runtime.getURL('pages/retainer_search_result.html');
  // chrome.tabs.sendMessage(tab_id, {
  //   method: 'Nunze_showInventorySearchResult',
  //   result: result,
  //   url: url,
  //   characters: characters,
  // });
}
