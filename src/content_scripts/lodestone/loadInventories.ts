import { LodestoneMetadata } from './loadMetadata';
import { failAlert } from './util';
import {
  sendSaveCharactersRequest,
  sendStartRetainerCrawlerRequest,
} from '../requests';

interface Retainer {
  id: string;
  name: string;
}

const REGEX_RETAINERS = /.*\/retainer\/([0-9a-zA-Z]+).*/;
function getRetainers(): { [key: string]: Retainer } {
  const rHeader = document.querySelector('.retainer__data');
  const ret: { [key: string]: Retainer } = {};
  if (!rHeader) return ret;
  const retainers = rHeader.querySelectorAll('li');
  retainers.forEach((e) => {
    const a = e.getElementsByTagName('a');
    if (a.length !== 1) return;
    const id = a[0].href.replace(REGEX_RETAINERS, '$1');
    ret[id] = { name: a[0].innerText, id: id };
  });
  return ret;
}

export function loadInventories(meta: LodestoneMetadata): void {
  const ans = window.confirm(
    '[Nunze]リテイナー情報を読み取るため、自動でページが遷移します。\n' +
      'よろしいですか？'
  );
  if (!ans) return;
  // save character data
  const character = {
    ...meta.character,
    retainers: getRetainers(),
    loadDateTime: new Date().getTime(),
  };
  sendSaveCharactersRequest([character])
    .then(() => {
      sendStartRetainerCrawlerRequest(character);
    })
    .catch(() => {
      failAlert('キャラクター情報の保存');
    });
}
