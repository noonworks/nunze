'use strict';
//
// Message listeners
//
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  switch (message.method) {
  // Character and Inventory Data methods
  case 'Nunze_deleteLoadstoneData':
    deleteInventories();
    deleteCharacters();
    sendResponse({ succeed: true });
    break;
  case 'Nunze_startRetainerCrawler':
    startRetainerCrawler(message.character, sender.tab);
    break;
  case 'Nunze_saveCharacters':
    saveCharacters(message.characters);
    sendResponse({ succeed: true });
    break;
  case 'Nunze_saveInventories':
    if (message.inCrawling) {
      const ret = saveInventoriesInCrawling(message.inventories, sender.tab);
      sendResponse({ status: ret });
    } else {
      saveInventories(message.inventories);
      sendResponse({ succeed: true });
    }
    break;
  case 'Nunze_saveFreeCompany':
    saveFreeCompany(message.fc);
    sendResponse({ succeed: true });
    break;
  // Option Data methods
  case 'Nunze_getOption':
    sendResponse({ opt: getOption() });
    break;
  case 'Nunze_resetOption':
    sendResponse({ opt: resetOption() });
    break;
  case 'Nunze_saveOptionData':
    saveOptionData(message.opt_data);
    sendResponse({ succeed: true });
    break;
  // Context Menu methods
  case 'Nunze_updateSearchMenu':
    updateSearchMenu(message.name);
    sendResponse({ succeed: true });
    break;
  case 'Nunze_updateAddStackMenu':
    updateAddStackMenu(message.name);
    sendResponse({ succeed: true });
    break;
  // Error
  default:
    sendResponse({ error: 'Method [' + message.method + '] is not found.' });
    break;
  }
});
