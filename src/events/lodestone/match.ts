import { fuzzyName } from './fuzzy';
import { InventoryData, InventoryItem } from './inventory/data';
import {
  MatchResult,
  RESULT_KEYS,
  MergeResult,
  MatchedItem,
} from './matchTypes';

interface HitResult {
  strict: MatchedItem[];
  part: MatchedItem[];
  fuzzyMatch: MatchedItem[];
  fuzzyPart: MatchedItem[];
  loadDateTimes: number[];
}

type MatchFunc = (
  name: string,
  item: InventoryItem,
  characterId: string,
  retainerId: string,
  ret: HitResult
) => MatchedItem | null;

//
// Strip spaces
//
function stripItemName(name: string): string {
  return (
    name
      .replace(/[\r\n]/gm, '')
      // eslint-disable-next-line no-irregular-whitespace
      .replace(/^[ 　\t]+/, '')
      // eslint-disable-next-line no-irregular-whitespace
      .replace(/[ 　\t]+$/, '')
  );
}

//
// Fuzzy match function
//
function fuzzyMatch(
  name: string,
  item: InventoryItem,
  characterId: string,
  retainerId: string,
  ret: HitResult
): MatchedItem | null {
  const fuzzyItem = fuzzyName(item.name);
  const r: MatchedItem = {
    ...item,
    matchLevel: 0,
    characterId,
    retainerId,
  };
  if (fuzzyItem === name) {
    r.matchLevel = 100;
    ret.fuzzyMatch.push(r);
    return r;
  } else if (fuzzyItem.indexOf(name) >= 0) {
    r.matchLevel = Math.floor((name.length * 100) / fuzzyItem.length);
    ret.fuzzyPart.push(r);
    return r;
  }
  return null;
}

//
// Strict match function
//
function strictMatch(
  name: string,
  item: InventoryItem,
  characterId: string,
  retainerId: string,
  ret: HitResult
): MatchedItem | null {
  const r: MatchedItem = {
    ...item,
    matchLevel: 0,
    retainerId,
    characterId,
  };
  if (item.name === name) {
    r.matchLevel = 100;
    ret.strict.push(r);
    return r;
  } else if (item.name.indexOf(name) >= 0) {
    r.matchLevel = Math.floor((name.length * 100) / item.name.length);
    ret.part.push(r);
    return r;
  }
  return null;
}

//
// Search Functions
//
function doMatch(
  name: string,
  inventories: InventoryData[],
  expire: number,
  func: MatchFunc,
  ret: HitResult
): void {
  if (name.length == 0) return;
  const expireDt = new Date().getTime() - expire;
  ret.loadDateTimes = [];
  for (let i = 0; i < inventories.length; i++) {
    if (inventories[i].loadDateTime < expireDt) continue;
    const cId = inventories[i].characterId;
    const rId = inventories[i].retainerId;
    ret.loadDateTimes.push(inventories[i].loadDateTime);
    for (let j = 0; j < inventories[i].items.length; j++) {
      func(name, inventories[i].items[j], cId, rId, ret);
    }
  }
}

function yyyymmddhhmm(dtMsec: number): string {
  const dt = new Date(dtMsec);
  return (
    '' +
    dt.getFullYear() +
    '/' +
    ('0' + (dt.getMonth() + 1)).slice(-2) +
    '/' +
    ('0' + dt.getDate()).slice(-2) +
    ' ' +
    ('0' + dt.getHours()).slice(-2) +
    ':' +
    ('0' + dt.getMinutes()).slice(-2)
  );
}

function sortItemInSameName(a: MatchedItem, b: MatchedItem): number {
  // sort by NQ/HQ
  if (a.HQ != b.HQ) {
    return b.HQ ? -1 : 1;
  }
  // sort by collectable
  if (a.collectable != b.collectable) {
    return b.collectable ? -1 : 1;
  }
  // sort by characterId
  if (a.characterId !== b.characterId) {
    if (!a.characterId || !b.characterId) return 0;
    return a.characterId < b.characterId ? -1 : 1;
  }
  // sort by retainerId
  if (a.retainerId != b.retainerId) {
    if (!a.retainerId || !b.retainerId) return 0;
    return a.retainerId < b.retainerId ? -1 : 1;
  }
  // sort by item index
  if (typeof a.itemIndex !== 'number' || typeof b.itemIndex !== 'number')
    return 0;
  if (a.itemIndex < b.itemIndex) return -1;
  if (a.itemIndex > b.itemIndex) return 1;
  return 0;
}

function sortItemByMatchLevel(a: MatchedItem[], b: MatchedItem[]): number {
  // DESC
  if (
    typeof a[0].matchLevel === 'number' &&
    typeof b[0].matchLevel === 'number'
  ) {
    if (a[0].matchLevel < b[0].matchLevel) return 1;
    if (a[0].matchLevel > b[0].matchLevel) return -1;
  }
  if (a[0].name < b[0].name) return -1;
  if (a[0].name > b[0].name) return 1;
  return 0;
}

interface MergeItemResult {
  result: MatchedItem[][];
  names: string[];
}

//
// Merge item data
//  ret.result = [ [item1_a, item1_b, ...], [item2_a, item2_b, ...], ... ];
//  ret.names  = [ itemName_1, itemName_2, ... ];
function mergeItemsData(
  items: MatchedItem[],
  exceptNames: string[]
): MergeItemResult {
  const ret: { [key: string]: MatchedItem[] } = {};
  const itemNames: string[] = [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (exceptNames.indexOf(items[i].name) >= 0) continue;
    const nameKey = ('0' + item.matchLevel).slice(-3) + '_' + item.name;
    if (nameKey in ret) {
      ret[nameKey].push(item);
    } else {
      ret[nameKey] = [item];
      itemNames.push(item.name);
    }
  }
  const keys = Object.keys(ret);
  const retSorted: MatchedItem[][] = [];
  for (let i = 0; i < keys.length; i++) {
    ret[keys[i]].sort(sortItemInSameName); // sort in same item
    retSorted.push(ret[keys[i]]);
  }
  retSorted.sort(sortItemByMatchLevel); // sort by match level
  return { result: retSorted, names: itemNames };
}

function mergeSearchResult(hit: HitResult): MergeResult {
  const ret: MergeResult = {
    loadDateTime: '',
    count: 0,
    strict: [],
    part: [],
    fuzzyMatch: [],
    fuzzyPart: [],
  };
  // merge load date time data
  hit.loadDateTimes.sort();
  if (hit.loadDateTimes.length > 1) {
    const st = hit.loadDateTimes[0];
    const ed = hit.loadDateTimes[hit.loadDateTimes.length - 1];
    if (ed - st < 3 * 60 * 1000) ret.loadDateTime = yyyymmddhhmm(ed);
    else ret.loadDateTime = yyyymmddhhmm(st) + '～' + yyyymmddhhmm(ed);
  } else if (hit.loadDateTimes.length == 1)
    ret.loadDateTime = yyyymmddhhmm(hit.loadDateTimes[0]);
  // merge item data
  const exceptNames: string[] = [];
  for (let ki = 0; ki < RESULT_KEYS.length; ki++) {
    const retKey = RESULT_KEYS[ki];
    const r = mergeItemsData(hit[retKey], exceptNames);
    ret[retKey] = r.result;
    Array.prototype.push.apply(exceptNames, r.names);
    ret.count += r.result.length;
  }
  return ret;
}

export function match(
  itemName: string,
  inventories: InventoryData[],
  opt: {
    fuzzy: boolean;
    part: boolean;
    strictAndPart: boolean;
    strictAndFuzzy: boolean;
    expire: number;
  }
): MatchResult {
  const name = stripItemName(itemName);
  const hit = {
    strict: [],
    part: [],
    fuzzyMatch: [],
    fuzzyPart: [],
    loadDateTimes: [],
  } as HitResult;
  doMatch(name, inventories, opt.expire, strictMatch, hit);
  if (opt.fuzzy)
    doMatch(fuzzyName(name), inventories, opt.expire, fuzzyMatch, hit);
  // Pickup items
  if (!opt.part) {
    hit.part = [];
    hit.fuzzyPart = [];
  }
  if (!opt.fuzzy) {
    hit.fuzzyMatch = [];
    hit.fuzzyPart = [];
  }
  if (!opt.strictAndPart) {
    if (hit.strict.length > 0) hit.part = [];
    if (hit.fuzzyMatch.length > 0) hit.fuzzyPart = [];
  }
  if (!opt.strictAndFuzzy && hit.strict.length > 0) {
    hit.fuzzyMatch = [];
    hit.fuzzyPart = [];
  }
  const ret = mergeSearchResult(hit);
  return { ...ret, word: itemName };
}
