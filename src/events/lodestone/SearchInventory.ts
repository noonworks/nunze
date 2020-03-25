import { OptionStorage } from '../option/storage';

// function doSearchInventory(itemname: string) {
//   // Search options
//   const opt = OptionStorage.instance().load();
//   const fuzzy = opt.data.lodestone.fuzzy;
//   const part = opt.data.lodestone.part;
//   const strictAndPart = opt.data.lodestone.strictAndPart;
//   const strictAndFuzzy = opt.data.lodestone.strictAndFuzzy;
//   const expire = opt.data.lodestone.expireDate * 24 * 60 * 60 * 1000;
//   // Get inventory data
//   const inventories = _getInventories();
//   // Search in inventories
//   const hit = { strict: [], part: [], fuzzy_match: [], fuzzy_part: [] };
//   const name = _stripItemName(itemname);
//   _doSearchInventory(name, inventories, expire, _strictMatch, hit);
//   if (fuzzy) {
//     _doSearchInventory(_fuzzyName(name), inventories, expire, _fuzzyMatch, hit);
//   }
//   // Pickup items
//   if (!part) {
//     hit.part = [];
//     hit.fuzzy_part = [];
//   }
//   if (!fuzzy) {
//     hit.fuzzy_match = [];
//     hit.fuzzy_part = [];
//   }
//   if (!strictAndPart) {
//     if (hit.strict.length > 0) hit.part = [];
//     if (hit.fuzzy_match.length > 0) hit.fuzzy_part = [];
//   }
//   if (!strictAndFuzzy && hit.strict.length > 0) {
//     hit.fuzzy_match = [];
//     hit.fuzzy_part = [];
//   }
//   const ret = _mergeSearchResult(hit);
//   ret.word = itemname;
//   return ret;
// }

export function searchInventory(itemname: string, tabId: number): void {
  console.log(itemname, tabId);
  // const result = doSearchInventory(itemname);
  // const characters = result.number > 0 ? _getCharacters().data : {};
  // const url = chrome.runtime.getURL('pages/retainer_search_result.html');
  // chrome.tabs.sendMessage(tab_id, {
  //   method: 'Nunze_showInventorySearchResult',
  //   result: result,
  //   url: url,
  //   characters: characters,
  // });
}
