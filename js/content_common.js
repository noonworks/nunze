(function(){
  'use strict';
  const WIDTH_IFRAME = 360;
  const HEIGHT_IFRAME = 200;
  //
  // Message and Event listeners
  //
  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.method === 'Nunze_getSelection') {
      sendResponse({ selection: _selectedWord });
    } else if (message.method === 'Nunze_showInventorySearchResult') {
      _showSearchInventoryResult(message.result, message.characters, message.url);
      // console.log('[ONMESSAGE Nunze_showInventorySearchResult]', message);
      sendResponse({});
    } else if (message.method === 'Nunze_copySelection') {
      if (_selectedWord.length > 0) {
        _copyText(_selectedWord);
        sendResponse({ copied: _selectedWord });
      } else {
        sendResponse({ copied: null });
      }
    } else {
      sendResponse({});
    }
  });
  function _onMouseUp(e) {
    _changeSelectionWord(window.getSelection().toString());
    _lastPosXY= [e.pageX, e.pageY];
    if (_showingSearchInventoryResult) {
      hidePopup();
      _showingSearchInventoryResult = false;
    }
  }
  function _onMouseMove(e) {
    _throttleHoverLink(e); // get hovered link message if there are no selection
    _debounceHoverWord(e); // get hovered text and popup item
  }
  window.addEventListener('mouseup', _onMouseUp);
  window.addEventListener('mousemove', _onMouseMove);
  window.addEventListener('mousewheel', _onMouseMove);
  
  //
  // Feature-1. Get link text
  //
  const THROTTLE_HOVERLINK_TIME = 500;
  let _throttleHoverLinkTimer = 0;
  function _throttleHoverLink(e) {
    if (new Date().getTime() - _throttleHoverLinkTimer <= THROTTLE_HOVERLINK_TIME) return;
    // console.log('_throttleHoverLink');
    if (e.target && e.target.tagName && e.target.tagName.toLowerCase() == 'a') {
      if (window.getSelection().toString().length == 0) {
        // console.log(' - _changeSelectionWord', e.target.innerText);
        _changeSelectionWord(e.target.innerText);
      }
    }
    _throttleHoverLinkTimer = new Date().getTime();
  }
  
  //
  // Feature-2. Search Inventory Result
  //
  let _showingSearchInventoryResult = false;
  function _showSearchInventoryResult(result, characters, url) {
    _showingSearchInventoryResult = true;
    const f = popup(null, null, WIDTH_IFRAME, HEIGHT_IFRAME);
    const msg_opt = { result: result, characters: characters };
    f.src = url;
    f.onload = function() {
      f.contentWindow.postMessage('Nunze_SHOW_RESULT:' + JSON.stringify(msg_opt), '*');
    };
  }
  
  //
  // Feature-3. Hover word
  //
  let _popedWord = '';
  const DEBOUNCE_HOVERWORD_TIME = 1500;
  let _debounceHoverWordTimer = null;
  function _debounceHoverWord(e) {
    clearTimeout(_debounceHoverWordTimer);
    _debounceHoverWordTimer = setTimeout(function() {
      _popupWord(e);
    }, DEBOUNCE_HOVERWORD_TIME);
  }
  let _pickedText = { text: '', pos: 0 };
  let _detectedWord = '';
  function _popupWord(e) {
    if (window.getSelection().toString().length != 0) return _hidePopupWord();
    const picked = _pickupHoverText(e.clientX, e.clientY);
    if (picked.text.length == 0) return _hidePopupWord();
    let words = []
    if (picked.text == _pickedText.text && picked.pos == _pickedText.pos) {
      if (_detectedWord.length == 0) return _hidePopupWord();
      words = [_detectedWord];
    } else {
      _pickedText = picked;
      words = _pickupItemNames(picked.text, picked.pos);
      if (words.length == 0) {
        _detectedWord = '';
        return _hidePopupWord();
      }
    }
    console.log(words);
    chrome.runtime.sendMessage({
      'method': 'Nunze_searchWordsInHistory',
      'words': words
    }, function(response){
      const info = response.result; // { word: '', data: {} }
      if (info.word.length == 0) {
        _detectedWord = '';
        return _hidePopupWord();
      }
      _doPopupWord(info.word, info.data, e);
    });
  }
  function _hidePopupWord() {
    if (_popedWord.length == 0) return;
    console.log('[HIDE POPUP]', _popedWord);
    hidePopup();
    _popedWord = '';
  }
  function _doPopupWord(word, data, e) {
    if (_popedWord == word) return;
    console.log('[POPUP]', word);
    // TODO: SHOW WORD DETECTION RESULT
    //popup(null, e.pageX, e.pageY);
    _popedWord = word;
  }
  // ひらがな         0x3041 - 0x309F
  // カタカナ         0x30A1 - 0x30FA
  // ｶﾀｶﾅ             0xFF71 - 0xFF9F
  // CJK統合漢字      0x4E00 - 0x9FCF
  // CJK統合漢字拡張A 0x3400 - 0x4DBF
  // CJK統合漢字拡張B 0x20000 - 0x2A6DF
  // CJK互換漢字      0xF900 - 0xFADF
  // CJK互換漢字補助  0x2F800 - 0x2FA1F
  const _MARK_EXP = /^[・：･:]*(.*?)[・：･:]*$/;
  const _BAR_ONLY_EXP = /^[-ー]+$/;
  const _ALPHA_NUM_EXP = /^[0-9A-Za-z０-９Ａ-Ｚａ-ｚ]$/;
  const _KATAKANA_EXP = /^[\u30A1-\u30FAー\uFF61-\uFF9F\-]$/;
  const _KATAKANA_MARK_EXP = /^[\u30A1-\u30FAー\uFF61-\uFF9F\-・：･:]$/;
  const _KATAKANA_MARK_ALPHANUM_EXP = /^[\u30A1-\u30FAー\uFF61-\uFF9F\-・：･:0-9A-Za-z０-９Ａ-Ｚａ-ｚ]$/;
  const _KANJI_EXP = /^[\u4E00-\u9FCF\u3400-\u4DBF\u20000-\u2A6DF\uF900-\uFADF\u2F800-\u2FA1F]$/;
  const _KANJI_MARK_EXP = /^[\u4E00-\u9FCF\u3400-\u4DBF\u20000-\u2A6DF\uF900-\uFADF\u2F800-\u2FA1F・：･:]$/;
  const _KANJI_MARK_ALPHANUM_EXP = /^[\u4E00-\u9FCF\u3400-\u4DBF\u20000-\u2A6DF\uF900-\uFADF\u2F800-\u2FA1F・：･:0-9A-Za-z０-９Ａ-Ｚａ-ｚ]$/;
  // pickup names
  function _katakana(c) { return _KATAKANA_EXP.test(c); }
  function _katakana_mark(c) { return _KATAKANA_MARK_EXP.test(c); }
  function _katakana_mark_alpha_num(c) { return _KATAKANA_MARK_ALPHANUM_EXP.test(c); }
  function _kanji(c) { return _KANJI_EXP.test(c) && ! _ALPHA_NUM_EXP.test(c); }
  function _kanji_mark(c) { return _KANJI_MARK_EXP.test(c) && ! _ALPHA_NUM_EXP.test(c); }
  function _kanji_mark_alpha_num(c) { return _KANJI_MARK_ALPHANUM_EXP.test(c); }
  function _pickupItemNames(text, pos) {
    const arr = [];
    // (01) 「カタカナ」
    arr.push(_doPick(text, pos, _katakana).text);
    // (02) 「カタカナ」「・･：:」
    arr.push(_doPick(text, pos, _katakana_mark).text);
    // (03) 「カタカナ」「・･：:」「英数字」
    arr.push(_doPick(text, pos, _katakana_mark_alpha_num).text);
    // (04) 「漢字」
    arr.push(_doPick(text, pos, _kanji).text);
    // (05) 「漢字」「・･：:」
    arr.push(_doPick(text, pos, _kanji_mark).text);
    // (06) 「漢字」「・･：:」「英数字」
    arr.push(_doPick(text, pos, _kanji_mark_alpha_num).text);
    // * アイテム名DBなどがあれば精度が上がるが……
    // * リテイナーデータ内で検索する？（DBとして保持）
    // * 公式DBにAjaxリクエストする？（負荷……）
    const words = [];
    for (let i = 0; i < arr.length; i++) {
      const s = arr[i].replace(_MARK_EXP, '$1'); // strip marks on start and end
      if (s.length == 0) continue;
      if (_BAR_ONLY_EXP.test(s)) continue; // bar only
      if (s.length > 20) continue; // too long
      if (words.indexOf(s) >= 0) continue;
      words.push(s);
    }
    return words;
  }
  function _doPick(str, pos, func) {
    const ret = { start: pos, end: pos, text: '', pos: -1 };
    if (! func(str.charAt(pos))) return ret;
    while (ret.start > 0) {
      ret.start--;
      if (! func(str.charAt(ret.start))) {
        ret.start++;
        break;
      }
    }
    while (ret.end < str.length - 1) {
      ret.end++;
      if (! func(str.charAt(ret.end))) {
        ret.end--;
        break;
      }
    }
    ret.text = str.substring(ret.start, ret.end + 1);
    ret.pos = pos - ret.start;
    return ret;
  }
  // 使用されない（と思われる）記号（TABCRLF/\^$*+?.|[]{};"'%&=~@`,_!#。、！？）
  const _EXCEPT_EXP = /[^\t\r\n\/\\\^\$\*\+\?\.\|\[\]\{\}\;\"\'\%\&\=\~\@\`\,\_\!\#。、！？]/;
  function _expectCharaFunc(c) {
    return _EXCEPT_EXP.test(c);
  }
  // pickup text
  const _pickupHoverText_err_ret = { text: '', pos: 0 };
  function _pickupHoverText(x, y) {
    const range = document.caretRangeFromPoint(x, y);
    if (! range) return _pickupHoverText_err_ret;
    const textNode = range.startContainer;
    if (! textNode || textNode.nodeType != 3) return _pickupHoverText_err_ret;
    const pickinfo = _doPick(textNode.nodeValue, range.startOffset, _expectCharaFunc);
    return { text: pickinfo.text, pos: pickinfo.pos };
  }
  
  //
  // Common-A. Popup box
  //
  let _lastPosXY = [0, 0];
  const _POPUP_ID = 'Nunze_popup_box';
  let _popup_iframe = null;
  let _popup_iframe_doc = null;
  function popup(x, y, w, h) {
    if (! x) x = _lastPosXY[0];
    if (w && x + w > document.body.clientWidth) x = document.body.clientWidth - w - 10;
    if (! y) y = _lastPosXY[1];
    if (x < 0) x = 0;
    if (y < 0) y = 0;
    const width = w ? 'width:' + w + 'px;' : '';
    const height = h ? 'height:' + h + 'px;' : '';
    if (! _popup_iframe) {
      _popup_iframe = document.createElement('iframe');
      _popup_iframe.id = _POPUP_ID;
      document.body.appendChild(_popup_iframe);
    }
    _popup_iframe.style = 'position:absolute;z-index:2147483647;' +
      'left:' + x + 'px;top:' + y + 'px;' + width + height;
    return _popup_iframe;
  }
  function hidePopup() {
    if (_popup_iframe)
      _popup_iframe.style = 'display:none;';
  }
  
  //
  // Common-B. Selection changed (change menu title)
  //
  let _selectedWord = '';
  function _changeSelectionWord(word) {
    if (word.length == 0) return;
    _selectedWord = word;
    // console.log('SELECT', _selectedWord);
    chrome.runtime.sendMessage({
      'method': 'Nunze_updateSearchMenu',
      'name': _selectedWord
    }, function(response){});
  }
  
  //
  // Common-C. Copy Text
  //
  const _copyTextArea = document.createElement('textarea');
  _copyTextArea.style.cssText = 'position:absolute;top:0;left:-100%';
  _copyTextArea.setAttribute('tabindex', '-1');
  document.body.appendChild(_copyTextArea);
  function _copyText(str) {
    _copyTextArea.value = str;
    _copyTextArea.select();
    document.execCommand('copy');
  }
})();
