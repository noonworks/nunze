import { OptionStorage } from '../option/storage';
import { sendMessageToTab } from '../../messages';
import { isGetSelectionResponse } from '../../messages/GetSelection';
import { searchInventory as doSearchInventory } from '../lodestone/SearchInventory';

//
// Search in Inventory
//
export function searchInventory(tab: chrome.tabs.Tab): void {
  const opt = OptionStorage.instance().load();
  if (!opt.data.lodestone.use) return;
  if (typeof tab.id !== 'number') return;
  sendMessageToTab(
    tab.id,
    { method: 'Nunze_getSelection' },
    (response): void => {
      if (!response || !isGetSelectionResponse(response)) return;
      const str = response.selection;
      if (!str || str.length == 0 || !tab || typeof tab.id !== 'number') return;
      doSearchInventory(str, tab.id);
    }
  );
}
