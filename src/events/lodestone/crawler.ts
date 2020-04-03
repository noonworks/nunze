import { Inventory } from './inventory/Inventory';
import { InventoryData } from './inventory/data';
import { CharacterStorageDataData } from './character/data';
import { loadInventoryRequest, loadShopRequest } from '../requests';
import { LogData } from './log/data';
import { LogStore } from './log/log';

interface CrawlQueue {
  characterId: string;
  retainerId: string;
  target: 'baggage' | 'shop';
}

let _crawlQueue: CrawlQueue[] = [];
type WaitTabFunction = (tab?: chrome.tabs.Tab) => void;
type sendTabRequestFunction = (tabId: number) => void;

function createWaitTabFunction(
  onComplete: sendTabRequestFunction
): WaitTabFunction {
  const func = (tab?: chrome.tabs.Tab): void => {
    if (!tab || typeof tab.id !== 'number') return;
    const tabId = tab.id;
    if (tab.status == 'complete') {
      onComplete(tabId);
    } else {
      setTimeout(() => {
        chrome.tabs.get(tabId, func);
      }, 200);
    }
  };
  return func;
}

function goNextRetainer(tabId: number | undefined): void {
  if (typeof tabId !== 'number') return;
  const url =
    'http://jp.finalfantasyxiv.com/lodestone/character/' +
    _crawlQueue[0].characterId +
    '/retainer/' +
    _crawlQueue[0].retainerId;
  if (_crawlQueue[0].target === 'shop') {
    chrome.tabs.update(tabId, { url }, createWaitTabFunction(loadShopRequest));
  } else {
    chrome.tabs.update(
      tabId,
      { url: url + '/baggage/' },
      createWaitTabFunction(loadInventoryRequest)
    );
  }
}

export function startRetainerCrawler(
  character: CharacterStorageDataData,
  tab: chrome.tabs.Tab | undefined
): void {
  _crawlQueue = [];
  const retainerIds = Object.keys(character.retainers);
  for (let i = 0; i < retainerIds.length; i++) {
    _crawlQueue.push({
      characterId: character.id,
      retainerId: retainerIds[i],
      target: 'shop',
    });
    _crawlQueue.push({
      characterId: character.id,
      retainerId: retainerIds[i],
      target: 'baggage',
    });
  }
  if (!_crawlQueue || _crawlQueue.length == 0) return;
  if (!tab || typeof tab.id !== 'number') return;
  goNextRetainer(tab.id);
}

const REGEX_BAGGAGE = /character\/([0-9a-z]+)\/retainer\/([0-9a-z]+)/;
function isValidUrl(
  url: string,
  characterId: string,
  retainerId: string
): boolean {
  const m = url.match(REGEX_BAGGAGE);
  if (!m) return false;
  if (characterId !== m[1]) return false;
  return retainerId.indexOf(m[2]) === 0;
}

type CrawlResult = 'fail' | 'completed' | 'next';
export function saveInventoriesInCrawling(
  inventories: InventoryData[],
  tab: chrome.tabs.Tab | undefined
): CrawlResult {
  const inv = inventories[0];
  if (!tab || !tab.url || !isValidUrl(tab.url, inv.characterId, inv.retainerId))
    return 'fail';
  try {
    Inventory.instance().save(inventories);
  } catch (e) {
    console.log(e);
    return 'fail';
  }
  _crawlQueue.shift();
  if (!_crawlQueue || _crawlQueue.length == 0) return 'completed';
  goNextRetainer(tab.id);
  return 'next';
}

export function saveLogsInCrawling(items: LogData[]): boolean {
  try {
    LogStore.instance().save(items);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}
