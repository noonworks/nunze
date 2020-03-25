import { LodestoneMetadata } from './loadMetadata';
import { loadFCChest } from './loadFCChest';
import { loadInventories } from './loadInventories';

function buildRetainerUrl(
  meta: LodestoneMetadata,
  retainer?: { id: string }
): string {
  return (
    'http://jp.finalfantasyxiv.com/lodestone/character/' +
    meta.character.id +
    '/retainer/' +
    (retainer ? retainer.id : '')
  );
}

//
// Add Nunze button
//
function createNunzeMenu(
  title: string,
  hrefOrOnclick: string | (() => void)
): HTMLAnchorElement {
  const nunzeA = document.createElement('a');
  nunzeA.innerText = '[Nunze] ' + title;
  if (typeof hrefOrOnclick == 'function') {
    nunzeA.addEventListener('click', hrefOrOnclick, false);
    nunzeA.href = '#';
  } else {
    nunzeA.href = hrefOrOnclick;
  }
  return nunzeA;
}

//
// Init menu button
//
const REGEX_RETAINER = /character\/([0-9a-z]+)\/retainer/;
export function initMenu(meta: LodestoneMetadata): void {
  const charBox = document.querySelector('div.head-my-character__box');
  if (!charBox) return;
  const uls = charBox.querySelectorAll('ul.my-menu__colmun');
  const nunzeLi = document.createElement('li');
  uls[1].appendChild(nunzeLi);
  // add retainer menu
  if (REGEX_RETAINER.test(window.location.href)) {
    nunzeLi.appendChild(
      createNunzeMenu('リテイナー情報読み取り', () => {
        loadInventories(meta);
      })
    );
  } else {
    nunzeLi.appendChild(
      createNunzeMenu('リテイナーページへ', buildRetainerUrl(meta))
    );
  }
  // add FC menu
  if (meta.fc.chestUrl.length > 0) {
    if (
      window.location.href
        .toLowerCase()
        .indexOf(meta.fc.chestUrl.toLowerCase()) === 0
    ) {
      nunzeLi.appendChild(
        createNunzeMenu('FCチェスト情報読み取り', () => {
          loadFCChest(meta);
        })
      );
    } else {
      nunzeLi.appendChild(
        createNunzeMenu('FCチェストページへ', meta.fc.chestUrl)
      );
    }
  }
}
