import { OptionStorage } from '../option/storage';
import { sendMessageToTab } from '../../messages';
import { isGetSelectionResponse } from '../../messages/GetSelection';

//
// Search with site
//
export function searchWithSite(tab: chrome.tabs.Tab, siteIndex: number): void {
  const opt = OptionStorage.instance().load();
  if (opt.data.search.sites.length <= siteIndex) return;
  if (typeof tab.id !== 'number') return;
  sendMessageToTab(
    tab.id,
    { method: 'Nunze_getSelection' },
    (response): void => {
      if (!response || !isGetSelectionResponse(response)) return;
      const str = response.selection;
      if (!str || str.length == 0) return;
      chrome.tabs.create({
        url: opt.data.search.sites[siteIndex].url.replace(
          /<WORD>/g,
          encodeURIComponent(str)
        ),
      });
    }
  );
}
