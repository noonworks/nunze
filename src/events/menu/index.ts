import { NunzeMenu } from './NunzeMenu';
import { searchWithSite } from './SearchWithSite';
import { searchInventory } from './SearchInventory';
import { sendMessageToTab } from '../../messages';

function onMenuClick(
  info: chrome.contextMenus.OnClickData,
  tab?: chrome.tabs.Tab
): void {
  switch (info.menuItemId) {
    case 'FD-item':
      if (tab) searchInventory(tab);
      return;
    case 'CP-word':
      if (!tab || typeof tab.id !== 'number') return;
      sendMessageToTab(tab.id, { method: 'Nunze_copySelection' });
      return;
    case 'OP-lodestone':
      chrome.tabs.create({
        url: 'http://jp.finalfantasyxiv.com/lodestone/',
      });
      return;
    case 'OP-options':
      chrome.tabs.create({ url: 'options.html' });
      return;
  }
  const v = info.menuItemId.split('-');
  // SC-X-XXX (Search with site)
  if (v[0] === 'SC') {
    const idx = parseInt(v[1], 10);
    if (isNaN(idx) || !tab) return;
    searchWithSite(tab, idx);
  }
}

function createMenu(): void {
  NunzeMenu.instance();
}

export function init(): void {
  console.log('Nunze menu init');
  chrome.contextMenus.onClicked.addListener(onMenuClick);
  chrome.runtime.onInstalled.addListener(createMenu);
  chrome.runtime.onStartup.addListener(createMenu);
}
