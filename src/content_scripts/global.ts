import { sendUpdateSearchMenu } from './requests';
import {
  EventToContentMessage,
  EventToContentResponse,
} from '../messages/EventToContentMessages';
import { CharacterStorageDataData } from '../events/lodestone/character/data';
import { MatchResult } from '../events/lodestone/matchTypes';

function copyText(str: string): void {
  const textarea = document.createElement('textarea');
  textarea.style.cssText = 'position:absolute;top:0;left:-100%';
  document.body.appendChild(textarea);
  textarea.value = str;
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

//
// Popup box
//
interface PopupOption {
  x?: number;
  y?: number;
  w?: number;
  h?: number;
}

const _POPUP_ID = 'Nunze_popup_box';
let _popupIframe: HTMLIFrameElement | null = null;
let _lastPosX = 0;
let _lastPosY = 0;

function popup(opt: PopupOption): HTMLIFrameElement {
  let x = typeof opt.x === 'number' ? opt.x : _lastPosX;
  if (opt.w && x + opt.w > document.body.clientWidth)
    x = document.body.clientWidth - opt.w - 10;
  let y = typeof opt.y === 'number' ? opt.y : _lastPosY;
  if (x < 0) x = 0;
  if (y < 0) y = 0;
  if (!_popupIframe) {
    _popupIframe = document.createElement('iframe');
    _popupIframe.id = _POPUP_ID;
    document.body.appendChild(_popupIframe);
  }
  _popupIframe.style.position = 'absolute';
  _popupIframe.style.zIndex = '2147483647';
  _popupIframe.style.left = `${x}px`;
  _popupIframe.style.top = `${y}px`;
  _popupIframe.style.width = opt.w ? `${opt.w}px` : '';
  _popupIframe.style.height = opt.h ? '' + `${opt.h}px` : '';
  _popupIframe.style.display = '';
  return _popupIframe;
}

function hidePopup(): void {
  if (_popupIframe) _popupIframe.style.display = 'none';
}

//
// On Selection changed (change menu title)
//
let _selectedWord = '';
function changeSelectionWord(word: string): void {
  if (word.length == 0) return;
  _selectedWord = word;
  sendUpdateSearchMenu(_selectedWord);
}

//
/// Get selected text
//
function getSelection(): string | null {
  const s = window.getSelection();
  if (!s) return null;
  return s.toString();
}

function getTagText(target: HTMLElement): string {
  if (target.tagName && target.tagName.toLowerCase() == 'a')
    return target.innerText;
  const style = getComputedStyle(target, 'hover');
  const cursor = style.cursor.toLowerCase();
  if (cursor === 'pointer') {
    const str = target.innerText;
    if (str && str.length <= 20) return str;
  }
  return '';
}

//
// Get link text
//
const THROTTLE_HOVER_TIME = 100;
let _throttleHoverLinkTimer = 0;
function throttleHoverLink(ev: MouseEvent | Event): void {
  if (new Date().getTime() - _throttleHoverLinkTimer <= THROTTLE_HOVER_TIME)
    return;
  if (!ev.target) return;
  const selection = getSelection();
  if (selection && selection.length > 0) return;
  const str = getTagText(ev.target as HTMLElement);
  if (str.length === 0) return;
  changeSelectionWord(str);
  _throttleHoverLinkTimer = new Date().getTime();
}

//
// Search Inventory Result
//
const WIDTH_IFRAME = 360;
const HEIGHT_IFRAME = 200;
let _showingSearchInventoryResult = false;
function showSearchInventoryResult(
  result: MatchResult,
  characters: { [key: string]: CharacterStorageDataData },
  url: string
): void {
  _showingSearchInventoryResult = true;
  const f = popup({ w: WIDTH_IFRAME, h: HEIGHT_IFRAME });
  const msgOpt = { result, characters };
  f.src = url;
  f.onload = (): void => {
    if (!f.contentWindow) return;
    f.contentWindow.postMessage(
      'Nunze_SHOW_RESULT:' + JSON.stringify(msgOpt),
      '*'
    );
  };
}

//
// On message or events
//
type ResponseSenders = (response: EventToContentResponse) => void;
function onMessage(
  message: EventToContentMessage,
  _: chrome.runtime.MessageSender,
  sendResponse: ResponseSenders
): boolean {
  switch (message.method) {
    case 'Nunze_getSelection':
      sendResponse({
        method: 'Nunze_getSelection',
        selection: _selectedWord,
      });
      break;
    case 'Nunze_copySelection':
      if (_selectedWord.length > 0) {
        copyText(_selectedWord);
        sendResponse({ method: 'Nunze_copySelection', copied: _selectedWord });
      } else sendResponse({ method: 'Nunze_copySelection' });
      break;
    case 'Nunze_showInventorySearchResult':
      showSearchInventoryResult(
        message.result,
        message.characters,
        message.url
      );
      break;
    default:
      break;
  }
  return true;
}

function onMouseUp(ev: MouseEvent): void {
  const str = getSelection() || '';
  changeSelectionWord(str);
  _lastPosX = ev.pageX;
  _lastPosY = ev.pageY;
  if (_showingSearchInventoryResult) {
    hidePopup();
    _showingSearchInventoryResult = false;
  }
}

function onMouseMove(ev: MouseEvent | Event): void {
  throttleHoverLink(ev); // get hovered link message if there are no selection
}

function init(): void {
  console.log('Nunze script global loaded.');
  window.addEventListener('mouseup', onMouseUp);
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mousewheel', onMouseMove);
  chrome.runtime.onMessage.addListener(onMessage);
}

init();
