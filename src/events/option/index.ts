import { Version2 } from './version2';

// Default options value
export const DEFAULT_OPTIONS: Version2 = {
  version: 2,
  data: {
    lodestone: {
      use: true,
      expireDate: 10,
      part: true,
      strictAndPart: false,
      fuzzy: true,
      strictAndFuzzy: false,
    },
    search: {
      sites: [
        {
          use: true,
          name: '公式DB',
          url:
            'http://jp.finalfantasyxiv.com/lodestone/playguide/db/search/?q=<WORD>',
        },
        {
          use: true,
          name: 'ERIONES',
          url: 'https://eriones.com/search?i=<WORD>',
        },
        {
          use: true,
          name: 'FF14俺tools：レシピ検索',
          url: 'https://ffxiv.rs.exdreams.net/?q=<WORD>',
        },
        {
          use: true,
          name: '猫はお腹がすいた',
          url: 'http://ff14angler.com/?search=<WORD>',
        },
        {
          use: true,
          name: 'Google',
          url: 'https://www.google.co.jp/search?q=FFXIV+<WORD>',
        },
      ],
    },
    mouseover: {
      use: false,
      historyMax: 50,
    },
  },
};
