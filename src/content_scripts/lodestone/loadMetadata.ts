const REGEX_STRIP = /^[\t\s\r\n]*(.*?)[\t\s\r\n]*$/;

//
// Load Character
//
interface Character {
  id: string;
  name: string;
  world: string;
  fcName: string;
}
const REGEX_CHARACTER = /character\/([0-9a-z]+)/;
function getCharacter(charBox: Element | null): Character {
  const ret: Character = { id: '', name: '', world: '', fcName: '' };
  if (!charBox) charBox = document.querySelector('div.head-my-character__box');
  if (!charBox) return ret;
  const li = charBox.querySelector('ul.my-menu__colmun li');
  if (!li) return ret;
  const a = li.querySelectorAll('a')[1];
  if (!a) return ret;
  const m = a.href.match(REGEX_CHARACTER);
  if (!m) return ret;
  const name = charBox.querySelector('span.head-my-character__name');
  const fc = charBox.querySelector('span.head-my-character__fc_name');
  const world = charBox.querySelector('span.head-my-character__worldstatus');
  if (!name || !world) return ret;
  ret.id = m[1].replace(REGEX_STRIP, '$1');
  ret.name = (name as HTMLElement).innerText.replace(REGEX_STRIP, '$1');
  ret.world = (world as HTMLElement).innerText.replace(REGEX_STRIP, '$1');
  if (fc) ret.fcName = (fc as HTMLElement).innerText.replace(REGEX_STRIP, '$1');
  return ret;
}

//
// Load FC url
//
function getFCChestUrl(charBoxUls: NodeListOf<Element> | undefined): string {
  if (!charBoxUls)
    charBoxUls = document.querySelectorAll(
      'div.head-my-character__box ul.my-menu__colmun'
    );
  for (let i = 0; i < charBoxUls.length; i++) {
    const liA = charBoxUls[i].querySelectorAll('li a');
    for (let j = 0; j < liA.length; j++) {
      if ((liA[j] as HTMLElement).innerText.indexOf('フリーカンパニー') === 0) {
        const href = (liA[j] as HTMLLinkElement).href;
        if (href[href.length - 1] == '/') return href + 'chest/';
        else return href + '/chest/';
      }
    }
  }
  return '';
}

export interface LodestoneMetadata {
  character: {
    id: string;
    name: string;
    world: string;
  };
  fc: {
    id: string;
    name: string;
    chestUrl: string;
  };
}

const REGEX_FC_CHEST = /freecompany\/([0-9a-z]+)\/chest/;

export function loadMetadata(): LodestoneMetadata {
  const charBox = document.querySelector('div.head-my-character__box');
  const character = getCharacter(charBox);
  const uls = charBox?.querySelectorAll('ul.my-menu__colmun');
  const fcUrl = getFCChestUrl(uls);
  const m = fcUrl.match(REGEX_FC_CHEST);
  const fcId = m ? m[1] : '';
  return {
    character: {
      id: character.id,
      name: character.name,
      world: character.world,
    },
    fc: {
      id: fcId,
      name: character.fcName,
      chestUrl: fcUrl,
    },
  };
}
