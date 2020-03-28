import { OptionStorage } from '../option/storage';
import { searchInventory as doSearchInventory } from '../lodestone/SearchInventory';
import { MenuToContentMessages } from '../../messages/MenuToContentMessages';
import { _sendMessageToTab, MessageCallBack } from '../../messages';
import { isGetSelectionResponse } from '../../messages/messages/GetSelection';

//
// send message to parent window
//
const sendToContent: (
  tabId: number,
  message: MenuToContentMessages,
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
