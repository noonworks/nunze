function initialize_nunze_loadstone_content_script() {
  'use strict';
  //
  // Message listeners
  //
  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.method === 'Nunze_LoadInventory') {
      const inv = loadInventory();
      if (! inv) {
        failAlert('リテイナー所持品情報の取得');
        return;
      }
      chrome.runtime.sendMessage({
        'method': 'Nunze_saveInventories',
        'inventories': [inv],
        'inCrawling': true
      }, function(response){
        if (! response || ! response.status || response.status == 'fail') {
          failAlert('リテイナー所持品情報の保存');
        } else if (response.status == 'completed') {
          alert('[Nunze]リテイナー所持品情報を保存しました。');
        }
      });
    } else {
      sendResponse({});
    }
  });
  function failAlert(what) {
    alert('[Nunze]' + what + 'に失敗しました。\n' +
      'ページを更新して再度試してみてください。');
  }
  //
  // Load data
  //
  const REGX_BAGGAGE = /character\/([0-9a-z]+)\/retainer\/([0-9a-z]+)\/baggage/;
  // load FC chest
  function loadFCChest() {
    const fc = getMyFC();
    if (!fc) {
      failAlert('FCチェスト情報の読み取り');
      return;
    }
    const dt = (new Date()).getTime();
    fc.load_datetime = dt;
    const inv = {
      character_id: 'FREECOMPANY',
      retainer_id: fc.id,
      load_datetime: dt,
      items: getItems()
    };
    // FC情報の保存
    chrome.runtime.sendMessage({
      'method': 'Nunze_saveFreeCompany',
      'fc': fc
    }, function(response){
      if (! response || ! response.succeed) {
        failAlert('FC情報の保存');
        return;
      }
      // FCチェスト情報の保存
      chrome.runtime.sendMessage({
        'method': 'Nunze_saveInventories',
        'inventories': [inv],
        'inCrawling': false
      }, function(response){
        if (! response || ! response.succeed) {
          failAlert('FCチェスト情報の保存');
          return;
        }
        alert('[Nunze]FCチェスト情報を保存しました。');
      });
    });
  }
  // load retainer inventory
  function loadInventory(){
    const m = window.location.href.match(REGX_BAGGAGE);
    if (!m) return null;
    return {
      character_id: m[1],
      retainer_id: m[2],
      load_datetime: (new Date()).getTime(),
      items: getItems()
    };
  }
  function loadInventories() {
    const ans = window.confirm('[Nunze]リテイナー情報を読み取るため、自動でページが遷移します。\n' +
      'よろしいですか？');
    if (! ans) return;
    // save character data
    const chara = getCharacter();
    if (! chara) {
      failAlert('キャラクター情報の保存');
      return;
    }
    chara.retainers = getRetainers();
    chara.load_datetime = (new Date()).getTime();
    chrome.runtime.sendMessage({
      'method': 'Nunze_saveCharacters',
      'characters': [chara]
    }, function(response){
      if (! response || ! response.succeed) {
        failAlert('キャラクター情報の保存');
        return;
      }
      chrome.runtime.sendMessage({
        'method': 'Nunze_startRetainerCrawler',
        'character': chara
      });
    });
  }
  //
  // Load data (parse pages)
  //
  const REGX_CHARACTER = /character\/([0-9a-z]+)/;
  const REGX_RETAINER = /character\/([0-9a-z]+)\/retainer/;
  const REGX_RETAINERS = /.*\/retainer\/([0-9a-zA-Z]+).*/;
  const REGX_STRIP = /^[\t\s\r\n]*(.*?)[\t\s\r\n]*$/;
  const REGX_FCCHEST = /freecompany\/([0-9a-z]+)\/chest/;
  const forEach = Array.prototype.forEach;
  function buildRetainerUrl(chara, retainer) {
    return 'http://jp.finalfantasyxiv.com/lodestone/character/' +
      chara.id + '/retainer/' + (retainer ? retainer.id : '');
  }
  // Load FC
  function getMyFC() {
    const m = window.location.href.match(REGX_FCCHEST);
    const fcp = document.querySelector('div.entry__freecompany__box p.entry__freecompany__name');
    const chara = getCharacter();
    if (!m || !fcp || !chara) return null;
    const fc = { id: m[1], name: fcp.innerText, world: chara.world };
    if (fc.name.length > 6) {
      const fc_s_ps = document.querySelectorAll('div.entry__freecompany__box p.entry__freecompany__gc');
      if (fc_s_ps.length >= 2)
        fc.name = fc_s_ps[1].innerText.replace(REGX_STRIP, '$1');
    }
    return fc;
  }
  // Load Character
  function getCharacter(charabox) {
    if (! charabox) charabox = document.querySelector('div.head-my-character__box');
    if (! charabox) return null;
    const li = charabox.querySelector('ul.my-menu__colmun li');
    if (! li) return null;
    const a = li.querySelectorAll('a')[1];
    if (! a) return null;
    const m = a.href.match(REGX_CHARACTER);
    if (! m) return null;
    const name = charabox.querySelector('span.head-my-character__name');
    const world = charabox.querySelector('span.head-my-character__worldstatus');
    return {
      id: m[1],
      name: name ? name.innerText.replace(REGX_STRIP, '$1') : '',
      world: world ? world.innerText.replace(REGX_STRIP, '$1') : ''
    };
  }
  // Load retainers
  function getRetainers() {
    const rheader = document.querySelector('.retainer__data');
    if (!rheader) return [];
    const retainers = rheader.querySelectorAll('li');
    const ret = {};
    forEach.call(retainers, function(e){
      const a = e.getElementsByTagName('a');
      if (a.length != 1) return;
      const id = a[0].href.replace(REGX_RETAINERS, '$1');
      ret[id] = { name:  a[0].innerText, id: id };
    });
    return ret;
  }
  // Load items
  function getItems() {
    const items = [];
    // items
    const baggage = document.querySelectorAll('li.item-list__list');
    forEach.call(baggage, function(e){
      const name_h4 = e.getElementsByTagName('h4');
      if (name_h4.length != 1) return;
      const link = name_h4[0].getElementsByTagName('a');
      if (link.length <= 1) return;
      const num = e.getElementsByClassName('item-list__number');
      if (num.length != 1) return;
      const i = parseInt(num[0].innerText, 10);
      if (isNaN(i)) return;
      const icon = e.getElementsByClassName('ic_item_quality');
      let isHq = false;
      let isCol = false;
      if (icon.length >= 1) {
        const u = new URL(link[0].href, window.location.href);
        if (u.search.indexOf('hq=1') >= 0) {
          isHq = true;
        } else {
          isCol = true;
        }
      }
      items.push({
        name: link[0].innerText,
        number: i,
        HQ: isHq,
        collectable: isCol
      });
    });
    // crystals
    const crystal_table = document.querySelector('div.table__crystal table');
    if (! crystal_table) return items;
    const kinds_th = crystal_table.querySelectorAll('thead th span');
    const kinds = [];
    for (let i = 0; i < kinds_th.length; i++) {
      const name = kinds_th[i].getAttribute('data-tooltip');
      if (name.length > 0) kinds.push(name);
    }
    if (kinds.length < 3) return items;
    const lines = crystal_table.querySelectorAll('tbody tr');
    for (let i = 0; i < lines.length; i++) {
      const elm = _getElementName(lines[i].querySelector('th span'));
      if (elm.length == 0) continue;
      const tds = lines[i].querySelectorAll('td a');
      if (tds.length != kinds.length) continue;
      for (let j = 0; j < tds.length; j++) {
        // console.log(elm + kinds[j]);
        const num = _getCrystalNumber(tds[j]);
        if (num <= 0) continue;
        items.push({
          name: elm + kinds[j],
          number: num,
          HQ: false,
          collectable: false
        });
      }
    }
    return items;
  }
  const _ELEMENT_NAME = {
    '火': 'ファイア', '氷': 'アイス', '風': 'ウィンド', '土': 'アース', '雷': 'ライトニング', '水': 'ウォーター'
  };
  function _getCrystalNumber(node) {
    const num_s = node.innerText.replace(/[ \t\r\n]/g, '');
    if (num_s.length == 0) return 0;
    const num_i = parseInt(num_s, 10);
    if (isNaN(num_i)) return 0;
    return num_i;
  }
  function _getElementName(node) {
    if (! node) return '';
    const elm = node.getAttribute('data-tooltip');
    if (_ELEMENT_NAME[elm]) return _ELEMENT_NAME[elm];
    return '';
  }
  // get FC url
  function getFCChestUrl(charabox_uls) {
    if (! charabox_uls)
      charabox_uls = document.querySelectorAll('div.head-my-character__box ul.my-menu__colmun');
    for (let i = 0; i < charabox_uls.length; i++) {
      const li_a = charabox_uls[i].querySelectorAll('li a');
      for (let j = 0; j < li_a.length; j++) {
        if (li_a[j].innerText.indexOf('フリーカンパニー') == 0) {
          if (li_a[j].href[li_a[j].href.length - 1] == '/')
            return li_a[j].href + 'chest/';
          else
            return li_a[j].href + '/chest/';
        }
      }
    }
    return '';
  }
  //
  // Add Nunze button
  //
  function _createNunzeMenu(title, href_or_onclick) {
    const nunzea = document.createElement('a');
    nunzea.innerText = '[Nunze] ' + title;
    if (typeof(href_or_onclick) == 'function') {
      nunzea.addEventListener('click', href_or_onclick, false);
      nunzea.href = '#';
    } else {
      nunzea.href = href_or_onclick;
    }
    return nunzea;
  }
  function initialize() {
    const charabox = document.querySelector('div.head-my-character__box');
    if (! charabox) return;
    const chara = getCharacter(charabox);
    if (! chara) return;
    const uls = charabox.querySelectorAll('ul.my-menu__colmun');
    const nunzeli = document.createElement('li');
    uls[1].appendChild(nunzeli);
    // add retainer menu
    if (REGX_RETAINER.test(window.location.href)) {
      nunzeli.appendChild(_createNunzeMenu('リテイナー情報読み取り', loadInventories));
    } else {
      nunzeli.appendChild(_createNunzeMenu('リテイナーページへ', buildRetainerUrl(chara)));
    }
    // add FC menu
    const fc_url = getFCChestUrl(uls);
    if (fc_url.length > 0) {
      if (window.location.href.toLowerCase().indexOf(fc_url.toLowerCase()) == 0) {
        nunzeli.appendChild(_createNunzeMenu('FCチェスト情報読み取り', loadFCChest));
      } else {
        nunzeli.appendChild(_createNunzeMenu('FCチェストページへ', fc_url));
      }
    }
  }
  initialize();
}

(function(){
  'use strict';
  //
  // Use Loadstone feature?
  //
  chrome.runtime.sendMessage({
    'method': 'Nunze_getOption',
  }, function(response){
    if (response.opt.data.loadstone.use)
      initialize_nunze_loadstone_content_script();
  });
})();
