import { sendMessageToTab } from '../../messages';
import { Inventory } from './inventory/Inventory';
import { InventoryData } from './inventory/data';
import { CharacterStorageDataData } from './character/data';

interface CrawlQueue {
  characterId: string;
  retainerId: string;
}

let _crawlQueue: CrawlQueue[] = [];

function waitTabToCrawl(tab?: chrome.tabs.Tab): void {
  if (!tab || typeof tab.id !== 'number') return;
  const tabId = tab.id;
  if (tab.status == 'complete') {
    sendMessageToTab(tabId, { method: 'Nunze_LoadInventory' });
  } else {
    setTimeout(function () {
      chrome.tabs.get(tabId, waitTabToCrawl);
    }, 200);
  }
}

function goNextRetainer(tabId: number | undefined): void {
  if (typeof tabId !== 'number') return;
  const url =
    'http://jp.finalfantasyxiv.com/lodestone/character/' +
    _crawlQueue[0].characterId +
    '/retainer/' +
    _crawlQueue[0].retainerId +
    '/baggage/';
  chrome.tabs.update(tabId, { url: url }, waitTabToCrawl);
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
    });
  }
  if (!_crawlQueue || _crawlQueue.length == 0) return;
  if (!tab || typeof tab.id !== 'number') return;
  goNextRetainer(tab.id);
}

const REGEX_BAGGAGE = /character\/([0-9a-z]+)\/retainer\/([0-9a-z]+)\/baggage/;
function isValidUrl(
  url: string,
  characterId: string,
  retainerId: string
): boolean {
  const m = url.match(REGEX_BAGGAGE);
  if (!m) return false;
  return characterId == m[1] && retainerId == m[2];
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
