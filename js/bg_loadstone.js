'use strict';
//
// Loadstone functions
//
let startRetainerCrawler; // Crawl retainer pages
let saveInventories; // Add or update (with loop)
let saveInventoriesInCrawling; // Add or update (with loop) in crawling
let saveCharacters; // Add or update (with loop)
let saveFreeCompany; // Add or update
let deleteInventories; // Delete all inventory data
let deleteCharacters; // Delete all characters data
let searchInventory;
(function(){
  //
  // Delete data
  //
  deleteCharacters = function() { characters_storage.remove(); };
  deleteInventories = function() { inventry_storages.removeAll(); };
  
  //
  // Crawl retainers
  //
  let _crawlQueue = [];
  startRetainerCrawler = function(chara, tab) {
    _crawlQueue = [];
    const retainer_ids = Object.keys(chara.retainers);
    for (let i = 0; i < retainer_ids.length; i++) {
      _crawlQueue.push({ chara_id: chara.id, retainer_id: retainer_ids[i] });
    }
    if (!_crawlQueue || _crawlQueue.length == 0) return;
    _goNextRetainer(tab.id);
  };
  function _goNextRetainer(tab_id) {
    const url = 'http://jp.finalfantasyxiv.com/lodestone/character/' +
      _crawlQueue[0].chara_id + '/retainer/' + _crawlQueue[0].retainer_id + '/baggage/';
    chrome.tabs.update(tab_id, { url: url }, _waitTabToCrawl);
  }
  function _waitTabToCrawl(tab) {
    if (tab.status == 'complete') {
     // console.log('TAB UPDATED');
      chrome.tabs.sendMessage(tab.id, { method: 'Nunze_LoadInventory' });
    } else {
     // console.log('TAB LOADING', tab.status);
      setTimeout(function(){
        chrome.tabs.get(tab.id, _waitTabToCrawl);
      }, 200);
    }
  }
  saveInventoriesInCrawling = function(invs, tab) {
    if (! _checkUrl(tab.url, invs[0].character_id, invs[0].retainer_id)) return 'fail';
    try {
      saveInventories(invs);
    } catch (e) {
      //console.log(e);
      return 'fail';
    }
    _crawlQueue.shift();
    if (!_crawlQueue || _crawlQueue.length == 0) return 'completed';
    _goNextRetainer(tab.id);
    return 'next';
  };
  const REGX_BAGGAGE = /character\/([0-9a-z]+)\/retainer\/([0-9a-z]+)\/baggage/;
  function _checkUrl(url, chara_id, retainer_id) {
    const m = url.match(REGX_BAGGAGE);
    if (! m) return false;
    return (chara_id == m[1] && retainer_id == m[2]);
  }
  //
  // Get/Save Inventories
  //
  function _getInventories(reload) {
    const invs = inventry_storages.loadAll(reload);
    const ret = [];
    for (let i = 0; i < invs.length; i++) {
      ret.push(invs[i].data);
    }
    return ret;
  }
  saveInventories = function(inventories) {
    for (let i = 0; i < inventories.length; i++) {
      if (! inventories[i].character_id || inventories[i].character_id.length == 0 ||
          ! inventories[i].retainer_id || inventories[i].retainer_id.length == 0) continue;
      const subKey = inventories[i].character_id + '_' + inventories[i].retainer_id;
      const inv = inventry_storages.load(subKey);
      inv.data = inventories[i];
      inventry_storages.save(subKey, inv);
    }
  }
  //
  // Get/Save Characters
  //
  function _getCharacters(reload) {
    return characters_storage.load(reload);
  }
  saveCharacters = function(characters) {
    const chardata = _getCharacters();
    const char_ids = Object.keys(chardata.data);
    for (var i = 0; i < characters.length; i++) {
      if (char_ids.indexOf(characters[i].id) >= 0) {
        const attrs = Object.keys(characters[i]);
        chardata.data[characters[i].id].id = characters[i].id;
        if (attrs.indexOf('name') >= 0)
          chardata.data[characters[i].id].name = characters[i].name;
        if (attrs.indexOf('world') >= 0)
          chardata.data[characters[i].id].world = characters[i].world;
        if (attrs.indexOf('load_datetime') >= 0)
          chardata.data[characters[i].id].load_datetime = characters[i].load_datetime;
        if (attrs.indexOf('retainers') >= 0)
          chardata.data[characters[i].id].retainers = characters[i].retainers;
      } else {
        chardata.data[characters[i].id] = characters[i];
      }
    }
    return characters_storage.save(chardata);
  };
  //
  // Save FreeCompany
  const _CHARAID_FC = 'FREECOMPANY';
  saveFreeCompany = function(fc) {
    const chardata = _getCharacters();
    const char_ids = Object.keys(chardata.data);
    if (char_ids.indexOf(_CHARAID_FC) < 0) {
      chardata.data[_CHARAID_FC] = {
        id: _CHARAID_FC,
        name: 'フリーカンパニー',
        load_datetime: (new Date()).getTime(),
        retainers: {}
      };
    }
    if (Object.keys(fc).indexOf('load_datetime') >= 0)
      chardata.data[_CHARAID_FC].load_datetime = fc.load_datetime;
    chardata.data[_CHARAID_FC].retainers[fc.id] = { id: fc.id, name: fc.name, world: fc.world };
    return characters_storage.save(chardata);
  }
  //
  //
  // Search Inventory Function
  //
  searchInventory = function(itemname, tab_id) {
    const result = _searchInventory(itemname);
    //console.log('[SEARCHRESULT]', result);
    const characters = (result.number > 0) ? _getCharacters().data : {};
    const url = chrome.runtime.getURL('pages/retainer_search_result.html');
    //console.log('[SEARCHRESULT_URL]', url);
    chrome.tabs.sendMessage(tab_id, {
      method: 'Nunze_showInventorySearchResult',
      result: result,
      url: url,
      characters: characters
    }, function(response){});
  };
  function _searchInventory(itemname) {
    // Search options
    const opt = getOption();
    const fuzzy = opt.data.loadstone.fuzzy;
    const part = opt.data.loadstone.part;
    const strictAndPart = opt.data.loadstone.strictAndPart;
    const strictAndFuzzy = opt.data.loadstone.strictAndFuzzy;
    const expire = opt.data.loadstone.expireDate * 24 * 60 * 60 * 1000;
    //console.log('[EXPIRE]', expire);
    // Get inventory data
    const inventories = _getInventories();
    // Search in inventories
    const hit = { strict: [], part: [], fuzzy_match: [], fuzzy_part: [] };
    const name = _stripItemName(itemname);
    _doSearchInventory(name, inventories, expire, _strictMatch, hit);
    if (fuzzy) {
      _doSearchInventory(_fuzzyName(name), inventories, expire, _fuzzyMatch, hit);
    }
    // Pickup items
    if (! part) { hit.part = []; hit.fuzzy_part = []; }
    if (! fuzzy) { hit.fuzzy_match = []; hit.fuzzy_part = []; }
    if (! strictAndPart) {
      if (hit.strict.length > 0) hit.part = [];
      if (hit.fuzzy_match.length > 0) hit.fuzzy_part = [];
    }
    if ((! strictAndFuzzy) && hit.strict.length > 0) {
      hit.fuzzy_match = [];
      hit.fuzzy_part = [];
    }
    const ret = _mergeSearchResult(hit);
    ret.word = itemname;
    return ret;
  };
  // Merge search result
  const _RESULT_KEYS = ['strict', 'fuzzy_match', 'part', 'fuzzy_part'];
  function _yyyymmddhhmm(dt_msec) {
    const dt = new Date(dt_msec);
    return '' + dt.getFullYear() + '/' + ('0' + (dt.getMonth() + 1)).slice(-2) + '/' +
      ('0' + dt.getDate()).slice(-2) + ' ' + ('0' + dt.getHours()).slice(-2) + ':' +
      ('0' + dt.getMinutes()).slice(-2);
  }
  function _mergeSearchResult(hit) {
    const ret = {};
    const except_names = [];
    // merge load datetime data
    ret.load_datetime = '';
    hit.load_datetimes.sort();
    if (hit.load_datetimes.length > 1) {
      const st = hit.load_datetimes[0];
      const ed = hit.load_datetimes[hit.load_datetimes.length - 1];
      if (ed - st < 3 * 60 * 1000) {
        ret.load_datetime = _yyyymmddhhmm(ed);
      } else {
        ret.load_datetime = _yyyymmddhhmm(st) + '～' + _yyyymmddhhmm(ed);
      }
    } else if (hit.load_datetimes.length == 1) {
      ret.load_datetime = _yyyymmddhhmm(hit.load_datetimes[0]);
    }
    // merge item data
    ret.number = 0;
    for (let ki = 0; ki < _RESULT_KEYS.length; ki++) {
      const ret_key = _RESULT_KEYS[ki];
      const r = _mergeItemsData(hit[ret_key], except_names);
      ret[ret_key] = r.result;
      Array.prototype.push.apply(except_names, r.names);
      ret.number += r.result.length;
    }
    return ret;
  }
  // Merge item data
  //  ret.result = [ [item1_a, item1_b, ...], [item2_a, item2_b, ...], ... ];
  //  ret.names  = [ itemname_1, itemname_2, ... ];
  function _mergeItemsData(items, except_names) {
    const ret = {};
    const item_names = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (except_names.indexOf(items[i].name) >= 0) continue;
      const name_key = ('0' + item.match_level).slice(-3) + '_' + item.name;
      if (name_key in ret) {
        ret[name_key].push(item);
      } else {
        ret[name_key] = [item];
        item_names.push(item.name);
      }
    }
    const keys = Object.keys(ret);
    const ret_sorted = [];
    for (let i = 0; i < keys.length; i++) {
      ret[keys[i]].sort(_sortItemInSameName); // sort in same item
      ret_sorted.push(ret[keys[i]]);
    }
    ret_sorted.sort(_sortItemByMatchLevel); // sort by match level
    return { result: ret_sorted, names: item_names };
  }
  // Item sort functions
  function _sortItemByMatchLevel(a, b) { // DESC
    if (a[0].match_level < b[0].match_level) return 1;
    if (a[0].match_level > b[0].match_level) return -1;
    if (a[0].name < b[0].name) return -1;
    if (a[0].name > b[0].name) return 1;
    return 0;
  }
  function _sortItemInSameName(a, b) {
    // sort by NQ/HQ
    if (a.HQ != b.HQ) {
      return b.HQ ? -1 : 1;
    }
    // sort by collectable
    if (a.collectable != b.collectable) {
      return b.collectable ? -1 : 1;
    }
    // sort by character_id
    if (a.character_id != b.character_id) {
      return (a.character_id < b.character_id) ? -1 : 1;
    }
    // sort by retainer_id
    if (a.retainer_id != b.retainer_id) {
      return (a.retainer_id < b.retainer_id) ? -1 : 1;
    }
    // sort by item index
    if (a.item_index < b.item_index) return -1;
    if (a.item_index > b.item_index) return 1;
    return 0;
  }
  // Convert to Fuzzy name
  function _fuzzyName(name) {
    // 使用されない（と思われる）記号の削除（/\^$*+?.|[]{};"'%&=~@`,_!#）
    name = name.replace(/[\/\\\^\$\*\+\?\.\|\[\]\{\}\;\"\'\%\&\=\~\@\`\,\_\!\#]/g, '');
    // 「：」「:」「・」「･」スペース、タブを無視
    name = name.replace(/[：:・･ 　\t]/g, '');
    // 括弧を全角に統一
    name = name.replace(/\(/g, '（').replace(/\)/g, '）');
    // カナを統一
    return fuzzyKana(name);
  }
  // Strip spaces
  function _stripItemName(name) {
    return name.replace(/[\r\n]/gm, '').replace(/^[ 　\t]+/, '').replace(/[ 　\t]+$/, '');
  }
  // Search Functions
  function _doSearchInventory(name, inventories, expire, func, ret) {
    if (name.length == 0) return;
    const expire_dt = (new Date()).getTime() - expire;
    ret.load_datetimes = [];
    for (let i = 0; i < inventories.length; i++) {
      if (inventories[i].load_datetime < expire_dt) continue;
      ret.load_datetimes.push(inventories[i].load_datetime);
      for (let j = 0; j < inventories[i].items.length; j++) {
        const r = func(name, inventories[i].items[j], ret);
        if (r != null) { // JOIN data if found
          inventories[i].items[j].character_id = inventories[i].character_id;
          inventories[i].items[j].retainer_id = inventories[i].retainer_id;
          inventories[i].items[j].item_index = j;
        }
      }
    }
  }
  // Strict match function
  function _strictMatch(name, item, ret) {
    if (item.name === name) {
      item.match_level = 100;
      ret.strict.push(item);
      return item;
    } else if (item.name.indexOf(name) >= 0) {
      item.match_level = Math.floor(name.length * 100 / item.name.length);
      ret.part.push(item);
      return item;
    }
    return null;
  }
  // Fuzzy match function
  function _fuzzyMatch(name, item, ret) {
    const fuzzy_item = _fuzzyName(item.name);
    if (fuzzy_item === name) {
      item.match_level = 100;
      ret.fuzzy_match.push(item);
      return item;
    } else if (fuzzy_item.indexOf(name) >= 0) {
      item.match_level = Math.floor(name.length * 100 / fuzzy_item.length);
      ret.fuzzy_part.push(item);
      return item;
    }
    return null;
  }
  //
  // Fuzzy search functions
  //
  const fuzzyKana = (function() {
    const hz_map = {
        'ｶﾞ': 'ガ', 'ｷﾞ': 'ギ', 'ｸﾞ': 'グ', 'ｹﾞ': 'ゲ', 'ｺﾞ': 'ゴ',
        'ｻﾞ': 'ザ', 'ｼﾞ': 'ジ', 'ｽﾞ': 'ズ', 'ｾﾞ': 'ゼ', 'ｿﾞ': 'ゾ',
        'ﾀﾞ': 'ダ', 'ﾁﾞ': 'ヂ', 'ﾂﾞ': 'ヅ', 'ﾃﾞ': 'デ', 'ﾄﾞ': 'ド',
        'ﾊﾞ': 'バ', 'ﾋﾞ': 'ビ', 'ﾌﾞ': 'ブ', 'ﾍﾞ': 'ベ', 'ﾎﾞ': 'ボ',
        'ﾊﾟ': 'パ', 'ﾋﾟ': 'ピ', 'ﾌﾟ': 'プ', 'ﾍﾟ': 'ペ', 'ﾎﾟ': 'ポ',
        'ｳﾞ': 'ヴ',
        'ｱ': 'ア', 'ｲ': 'イ', 'ｳ': 'ウ', 'ｴ': 'エ', 'ｵ': 'オ',
        'ｶ': 'カ', 'ｷ': 'キ', 'ｸ': 'ク', 'ｹ': 'ケ', 'ｺ': 'コ',
        'ｻ': 'サ', 'ｼ': 'シ', 'ｽ': 'ス', 'ｾ': 'セ', 'ｿ': 'ソ',
        'ﾀ': 'タ', 'ﾁ': 'チ', 'ﾂ': 'ツ', 'ﾃ': 'テ', 'ﾄ': 'ト',
        'ﾅ': 'ナ', 'ﾆ': 'ニ', 'ﾇ': 'ヌ', 'ﾈ': 'ネ', 'ﾉ': 'ノ',
        'ﾊ': 'ハ', 'ﾋ': 'ヒ', 'ﾌ': 'フ', 'ﾍ': 'ヘ', 'ﾎ': 'ホ',
        'ﾏ': 'マ', 'ﾐ': 'ミ', 'ﾑ': 'ム', 'ﾒ': 'メ', 'ﾓ': 'モ',
        'ﾔ': 'ヤ', 'ﾕ': 'ユ', 'ﾖ': 'ヨ',
        'ﾗ': 'ラ', 'ﾘ': 'リ', 'ﾙ': 'ル', 'ﾚ': 'レ', 'ﾛ': 'ロ',
        'ﾜ': 'ワ', 'ｦ': 'ヲ', 'ﾝ': 'ン',
        'ｧ': 'ァ', 'ｨ': 'ィ', 'ｩ': 'ゥ', 'ｪ': 'ェ', 'ｫ': 'ォ',
        'ｯ': 'ッ', 'ｬ': 'ャ', 'ｭ': 'ュ', 'ｮ': 'ョ',
        '-': 'ー'
    };
    const hz_exp = new RegExp('(' + Object.keys(hz_map).join('|') + ')', 'g');
    const fuzzy_kana_map = {
        'ガ': 'カ', 'ギ': 'キ', 'グ': 'ク', 'ゲ': 'ケ', 'ゴ': 'コ',
        'ザ': 'サ', 'ジ': 'シ', 'ズ': 'ス', 'ゼ': 'セ', 'ゾ': 'ソ',
        'ダ': 'タ', 'ヂ': 'チ', 'ヅ': 'ツ', 'デ': 'テ', 'ド': 'ト',
        'バ': 'ハ', 'ビ': 'ヒ', 'ブ': 'フ', 'ベ': 'ヘ', 'ボ': 'ホ',
        'パ': 'ハ', 'ピ': 'ヒ', 'プ': 'フ', 'ペ': 'ヘ', 'ポ': 'ホ',
        'ヴ': 'ウ'
    };
    const fuzzy_kana_exp = new RegExp('(' + Object.keys(fuzzy_kana_map).join('|') + ')', 'g');
    const hyphens_exp = /[-－―‐]/g;
    const yo_exp = /[ァィゥェォャュョ]/g;
    return function(str) {
      // 半角を全角に変換（おかしな濁点と半濁点は削除）
      // 濁音と半濁音を清音に変換
      // マイナス、ダッシュ、ハイフンを「ー」に変換
      // 拗音を削除
      // カタカナをひらがなに変換
      return str.replace(hz_exp, function(m) { return hz_map[m]; })
                .replace(/ﾞ/g, '').replace(/ﾟ/g, '')
                .replace(fuzzy_kana_exp, function(m) { return fuzzy_kana_map[m]; })
                .replace(hyphens_exp, 'ー')
                .replace(yo_exp, '')
                .replace(/[ァ-ヴ]/g, function(s) {
                  return String.fromCharCode(s.charCodeAt(0) - 0x60);
                });
    }
  })();
  //
  // Default data
  //
  const DEFAULT_INVENTORIES = {
    version: 1,
    data: { /*
      character_id: character-id,
      retainer_id: retainer-id,
      load_datetime: dt,
      items: [
        { name: 'ItemName', number: 99, HQ: true, collectable: false }, ...
      ] */
    }
  };
  const DEFAULT_CHARACTERS = {
    version: 1,
    data: { /*
      character-id: {
        id: character-id,
        name: 'Chara Name',
        world: 'World-name',
        load_datetime: dt,
        retainers: {
          retainers-id: { id: retainers-id, name: 'RetainerName' }, ...
        }
      }, ... */
    }
  };
  // Do not cache Inventories data because it will be large.
  const inventry_storages = new StorageCollection('nunze_ls_inventories', MigratableLocalStorage, DEFAULT_INVENTORIES);
  const characters_storage = new CacheLocalStorage('nunze_ls_characters', DEFAULT_CHARACTERS);
})();
