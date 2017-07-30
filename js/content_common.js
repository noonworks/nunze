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
