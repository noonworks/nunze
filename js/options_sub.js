'use strict';
//
// Message Listener
//
window.addEventListener('message', function(msg) {
  if (msg.source != window.parent) return;
  // split method name
  const cln = msg.data.indexOf(':');
  if (cln < 0) return;
  const method = msg.data.substring(0, cln);
  const data = msg.data.substring(cln + 1, msg.data.length);
  // run method
  switch (method) {
  case 'Nunze_OPTIONS_FIRSTLOAD':
    getOptions();
    break;
  case 'Nunze_OPTIONS_SAVE_OPTION_DATA':
    saveOptionData(data);
    break;
  case 'Nunze_OPTIONS_RESET':
    resetOptions();
    break;
  case 'NUNZE_DELETE_LOADSTONE_DATA':
    deleteLoadstoneData();
    break;
  }
}, false);

//
// Send delete Loadstone data request to background script.
//
function deleteLoadstoneData() {
  chrome.runtime.sendMessage({
    'method': 'Nunze_deleteLoadstoneData',
  }, function(response){
    window.parent.postMessage('Nunze_LOADSTONE_DATA_DELETED:', '*');
  });
}

//
// Send get option request to background script.
//
function getOptions() {
  chrome.runtime.sendMessage({
    'method': 'Nunze_getOption',
  }, function(response){
    window.parent.postMessage('Nunze_OPTIONS_SUB_FIRSTLOADED:' + JSON.stringify(response.opt), '*');
  });
}

//
// Send save option request to background script.
//
function saveOptionData(opt_data_str) {
  const opt_data = JSON.parse(opt_data_str);
  chrome.runtime.sendMessage({
    'method': 'Nunze_saveOptionData',
    'opt_data': opt_data
  }, function(response){
    window.parent.postMessage('Nunze_OPTIONS_SUB_SAVED:', '*');
  });
}

//
// Send reset option request to background script.
//
function resetOptions() {
  chrome.runtime.sendMessage({
    'method': 'Nunze_resetOption'
  }, function(response){
    window.parent.postMessage('Nunze_OPTIONS_SUB_RESETED:' + JSON.stringify(response.opt), '*');
  });
}

//
// Initialized
//
document.addEventListener('DOMContentLoaded', function(){
  window.parent.postMessage('Nunze_OPTIONS_SUB_LOADED:', '*');
});
