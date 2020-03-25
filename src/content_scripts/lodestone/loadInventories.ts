import { LodestoneMetadata } from './loadMetadata';
import { sendMessage } from '../../messages';
import { failAlert } from './util';
import { isSaveCharactersResponse } from '../../messages/SaveCharacters';

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
  sendMessage(
    {
      method: 'Nunze_saveCharacters',
      characters: [character],
    },
    (response) => {
      if (
        !response ||
        !isSaveCharactersResponse(response) ||
        !response.succeed
      ) {
        failAlert('キャラクター情報の保存');
        return;
      }
      sendMessage({
        method: 'Nunze_startRetainerCrawler',
        character: character,
      });
    }
  );
}
