import {
  MainToSubMessages,
  SubToMainMessages,
  InvalidMessage,
} from './messages';

export interface RowRetainer {
  retainer: { id: string; name: string };
  character: { id: string; name: string; world: string };
}

export interface RowItem {
  id: number;
  retainer: RowRetainer;
  name: string;
  num: number;
  total: number;
  customer: string;
  dateTime: number;
}

export interface RowApp extends Vue {
  rows: RowItem[];
}

//
// Vue instance
//
let vm: RowApp | null = null;
export function mountVue(app: RowApp): void {
  vm = app;
  vm.$mount('#app');
}
export function updateRowItems(items: RowItem[]): void {
  if (vm) vm.rows = items;
}

//
// Get sub window
//
export let subWindow: Window | null = null;
export function initSubWindow(): void {
  const iframe = document.getElementById(
    'subWindow'
  ) as HTMLIFrameElement | null;
  if (iframe) subWindow = iframe.contentWindow;
}

//
// send message to sub window
//
export function sendToSub(request: MainToSubMessages): void {
  if (!subWindow) return;
  subWindow.postMessage(request.method + ':' + request.data, '*');
}

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
    case 'Nunze_SL_FIRST_LOAD':
    case 'Nunze_SL_SUB_LOADED':
      return { method, data: '' };
    case 'Nunze_SL_SUB_FIRST_LOADED':
      return {
        method,
        data: message.substring(cln + 1, message.length),
      };
    default:
      return { method: 'Nunze_Invalid', data: '' };
  }
}
