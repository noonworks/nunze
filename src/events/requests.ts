import { OptionStorage } from './option/storage';
import { searchInventory as doSearchInventory } from './lodestone/SearchInventory';
import { _sendMessageToTab, MessageCallBack } from '../messages';
import { isGetSelectionResponse } from '../messages/messages/GetSelection';
import { EventToContentMessage } from '../messages/EventToContentMessages';
import { InventorySearchResult } from '../messages/messages/ShowInventorySearchResult';

//
// send message to content script
//
const sendToContent: (
  tabId: number,
  message: EventToContentMessage,
  callback?: MessageCallBack
) => void = _sendMessageToTab;

//
// send copy request to content script
//
export function sendCopyRequest(tabId: number): void {
  sendToContent(tabId, { method: 'Nunze_copySelection' });
}

//
// Search with site
//
export function sendSearchWithSiteRequest(
  tab: chrome.tabs.Tab,
  siteIndex: number
): void {
  const opt = OptionStorage.instance().load();
  if (opt.data.search.sites.length <= siteIndex) return;
  if (typeof tab.id !== 'number') return;
  sendToContent(tab.id, { method: 'Nunze_getSelection' }, (response): void => {
    if (!response || !isGetSelectionResponse(response)) return;
    const str = response.selection;
    if (!str || str.length == 0) return;
    chrome.tabs.create({
      url: opt.data.search.sites[siteIndex].url.replace(
        /<WORD>/g,
        encodeURIComponent(str)
      ),
    });
  });
}

//
// Search in Inventory
//
export function sendSearchInventoryRequest(tab: chrome.tabs.Tab): void {
  const opt = OptionStorage.instance().load();
  if (!opt.data.lodestone.use) return;
  if (typeof tab.id !== 'number') return;
  sendToContent(tab.id, { method: 'Nunze_getSelection' }, (response): void => {
    if (!response || !isGetSelectionResponse(response)) return;
    const str = response.selection;
    if (!str || str.length == 0 || !tab || typeof tab.id !== 'number') return;
    doSearchInventory(str, tab.id);
  });
}

//
// load inventory on page
//
export function loadInventoryRequest(tabId: number): void {
  sendToContent(tabId, { method: 'Nunze_LoadInventory' });
}

//
//
//
export function sendShowInventorySearchResult(
  tabId: number,
  data: InventorySearchResult
): void {
  sendToContent(tabId, {
    method: 'Nunze_showInventorySearchResult',
    ...data,
  });
}
