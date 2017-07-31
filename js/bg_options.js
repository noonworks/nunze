'use strict';
//
// Option data
//
let getOption;
let saveOptionData;
let resetOption;
(function(){
  // Get options (whole options, includes master or metadata)
  getOption = function(reload) {
    return option_storage.load(reload);
  };
  // Save option data (only option data, without master or metadata)
  saveOptionData = function(opt_data) {
    const opt = option_storage.load();
    opt.data = opt_data;
    option_storage.save(opt);
  }
  // Reset option
  resetOption = function() {
    return option_storage.reset();
  };
  // Default options value
  const DEFAULT_OPTIONS = {
    version: 1,
    data: {
      loadstone: {
        use: true,
        expireDate: 10,
        part: true,
        strictAndPart: false,
        fuzzy: true,
        strictAndFuzzy: false
      },
      recipestack: {
        use: false
      },
      search: {
        sites: [
          { use: true, name: '公式DB', url: 'http://jp.finalfantasyxiv.com/lodestone/playguide/db/search/?q=<WORD>' },
          { use: true, name: 'ERIONES', url: 'https://eriones.com/search?i=<WORD>' },
          { use: true, name: '猫はお腹がすいた', url: 'http://ff14angler.com/?search=<WORD>' },
          { use: true, name: 'Google', url: 'https://www.google.co.jp/search?q=FFXIV+<WORD>' }
        ]
      },
      mouseover: {
        use: false,
        historyMax: 50
      },
      other: {
        jenlynizer: {
          use: false,
          name: 'ジェンリンス',
          id: 'jenlyns',
          url: 'https://pbs.twimg.com/media/C--GAqDVoAAiVsY.jpg'
        }
      }
    },
    master: {
      ERIONES_URL_PATTERNS: [
        'https://eriones.com/*'
      ]
    }
  };
  const option_storage = new OptionsStorage('nunze_option', DEFAULT_OPTIONS);
})();
