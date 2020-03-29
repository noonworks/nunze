import { Version2 } from '../events/option/version2';
import {
  MainToSubMessages,
  SubToMainMessages,
  InvalidMessage,
} from './messages';

//
// Vue instance
//
export interface AppInterface extends Vue {
  startLoading(): void;
  startSaving(): void;
  hideSpinner(): void;
  showLoadError(): void;
  hideLoadError(): void;
  updateData(opt: Version2): void;
}
let vm: AppInterface | null = null;
export function mountVue(app: AppInterface): void {
  vm = app;
  vm.$mount('#app');
}
export function updateData(opt: Version2): void {
  if (vm) vm.updateData(opt);
}

//
// toggle loader
//
export function hideSpinner(): void {
  if (vm) vm.hideSpinner();
}
export function startLoading(): void {
  if (vm) vm.startLoading();
}
export function startSaving(): void {
  if (vm) vm.startSaving();
}

//
// load error
//
export function showLoadError(): void {
  if (vm) vm.showLoadError();
}
export function hideLoadError(): void {
  if (vm) vm.hideLoadError();
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
export function splitData(
  message: string
): MainToSubMessages | SubToMainMessages | InvalidMessage {
  const cln = message.indexOf(':');
  if (cln < 0) return { method: 'Nunze_Invalid', data: '' };
  const method = message.substring(0, cln);
  switch (method) {
    case 'Nunze_OPTIONS_SUB_LOADED':
    case 'Nunze_OPTIONS_FIRST_LOAD':
    case 'Nunze_LODESTONE_DATA_DELETED':
    case 'Nunze_OPTIONS_SUB_SAVED':
    case 'NUNZE_DELETE_LODESTONE_DATA':
      return { method, data: '' };
    case 'Nunze_OPTIONS_SUB_FIRST_LOADED':
    case 'Nunze_OPTIONS_SUB_RESET':
    case 'Nunze_OPTIONS_RESET':
    case 'Nunze_OPTIONS_SAVE_OPTION_DATA':
      return {
        method,
        data: message.substring(cln + 1, message.length),
      };
    default:
      return { method: 'Nunze_Invalid', data: '' };
  }
}

//
// send message to sub window
//
export function sendToSub(request: MainToSubMessages): void {
  if (!subWindow) return;
  subWindow.postMessage(request.method + ':' + request.data, '*');
}

//
// Data save request
//
export function sendSaveOptionDataRequest(data: Version2): void {
  if (!subWindow) return;
  startSaving();
  sendToSub({
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

//
// Reset data
//
export function reset(): void {
  if (!window.confirm('設定を初期化します。よろしいですか？')) return;
  hideSpinner();
  sendToSub({ method: 'Nunze_OPTIONS_RESET', data: '' });
}

//
// Delete lodestone data
//
export function deleteLodestone(): void {
  if (
    !window.confirm(
      'LodeStoneから読み取った情報を削除します。よろしいですか？\n' +
        '（削除しても再度読み取ることができます。）'
    )
  )
    return;
  sendToSub({ method: 'NUNZE_DELETE_LODESTONE_DATA', data: '' });
}
