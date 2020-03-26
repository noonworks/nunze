import { Version2 } from '../events/option/version2';
import { OptionMessages, OptionRequests } from './messages';

//
// load error
//
let loadErrorBox: HTMLElement | null = null;
document.addEventListener('DOMContentLoaded', () => {
  loadErrorBox = document.getElementById('load-error');
});
export function setLoadError(enable: boolean): void {
  if (!loadErrorBox) return;
  loadErrorBox.style.display = enable ? 'block' : 'none';
}

//
// Get sub window
//
export let subWindow: Window | null = null;
document.addEventListener('DOMContentLoaded', () => {
  const iframe = document.getElementById(
    'subWindow'
  ) as HTMLIFrameElement | null;
  if (iframe) subWindow = iframe.contentWindow;
});

//
// Split method and data
//
export function splitData(message: string): OptionMessages {
  const cln = message.indexOf(':');
  if (cln < 0) return { method: 'Nunze_Invalid' };
  const method = message.substring(0, cln);
  switch (method) {
    case 'Nunze_OPTIONS_SUB_LOADED':
    case 'Nunze_OPTIONS_FIRST_LOAD':
    case 'Nunze_LODESTONE_DATA_DELETED':
    case 'Nunze_OPTIONS_SUB_SAVED':
      return { method };
    case 'Nunze_OPTIONS_SUB_FIRST_LOADED':
    case 'Nunze_OPTIONS_SUB_RESET':
      return { method, data: message.substring(cln + 1, message.length) };
    default:
      return { method: 'Nunze_Invalid' };
  }
}

//
// post message
//
export function postOptionMessage(
  win: Window | null,
  request: OptionRequests
): void {
  if (!win) return;
  win.postMessage(request.method + ':' + request.data, '*');
}

//
// Data save request
//
export function sendSaveOptionDataRequest(data: Version2): void {
  if (!subWindow) return;
  // showLoader(true);
  console.log(JSON.stringify(data));
  postOptionMessage(subWindow, {
    method: 'Nunze_OPTIONS_SAVE_OPTION_DATA',
    data: JSON.stringify(data),
  });
}

//
// throttle save method
//
export const autoSave = ((): ((data: Version2) => void) => {
  let _saveData: Version2 | null = null;
  setInterval(() => {
    if (_saveData !== null) {
      sendSaveOptionDataRequest(_saveData);
      _saveData = null;
    }
  }, 1000);
  return (data: Version2): void => {
    _saveData = data;
  };
})();
