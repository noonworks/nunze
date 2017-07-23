'use strict';
//
// Context Menu
//
let updateSearchMenu;
let updateAddStackMenu;
let refreshMenu;
(function() {
  let context_menu = null;
  //
  // Menu click handler
  //
  function _onMenuClick(info, tab) {
    //console.log('clicked', info.menuItemId);
    switch (info.menuItemId) {
    case 'RS-add':
      // RS is not implemented now.
      return;
    case 'FD-item':
      _menuSearchInventory(tab);
      return;
    case 'CP-word':
      _copyWord(tab);
      return;
    case 'RS-open':
      // RS is not implemented now.
      return;
    case 'OP-loadstone':
      chrome.tabs.create({ url: 'options.html' });
      return;
    case 'OP-options':
      chrome.tabs.create({ url: 'options.html' });
      return;
    }
    const v = info.menuItemId.split('-');
    // SC-X-XXX (Search with site)
    if (v[0] === 'SC') {
      const idx = parseInt(v[1], 10);
      if (isNaN(idx)) return;
      _searchWithSite(tab, idx);
    }
  };
  chrome.contextMenus.onClicked.addListener(_onMenuClick);
  //
  // Copy to Clipboard
  //
  function _copyWord(tab) {
    chrome.tabs.sendMessage(tab.id, { method: 'Nunze_getSelection' }, function(response){
      if (! response) return;
      const str = response.selection;
      if (! str || str.length == 0) return;
      copy2ClipBoard(str);
    });
  }
  //
  // Search in Inventory
  //
  function _menuSearchInventory(tab) {
    const opt = getOption();
    if (!opt.data.loadstone.use) return;
    chrome.tabs.sendMessage(tab.id, { method: 'Nunze_getSelection' }, function(response){
      if (! response) return;
      const str = response.selection;
      if (! str || str.length == 0) return;
      searchInventory(str, tab.id);
    });
  }
  //
  // Search Site function
  //
  function _searchWithSite(tab, idx) {
    const opt = getOption();
    if (opt.data.search.sites.length <= idx) return;
    chrome.tabs.sendMessage(tab.id, { method: 'Nunze_getSelection' }, function(response){
      if (! response) return;
      const str = response.selection;
      if (! str || str.length == 0) return;
      chrome.tabs.create({
        url: opt.data.search.sites[idx].url.replace(/\<WORD\>/g, encodeURIComponent(str))
      });
    });
  }
  //
  // Create Menu
  //
  function _createMenu() {
    console.log('_createMenu');
    context_menu = new MenuWrapper(getOption());
  }
  chrome.runtime.onInstalled.addListener(_createMenu);
  chrome.runtime.onStartup.addListener(_createMenu);
  //
  // Update Menu
  //
  // Update search menu
  let menu_search_cache = '';
  updateSearchMenu = function(name) {
    if (name == menu_search_cache) return;
    console.log('==> updateSearchMenu', name);
    context_menu.refresh(getOption(), { search_word: name });
    menu_search_cache = name;
  }
  // Update addstack menu
  let menu_addstack_cache = '';
  updateAddStackMenu = function(name) {
    if (name == menu_addstack_cache) return;
    console.log('==> updateAddStackMenu', name);
    context_menu.refresh(getOption(), { addstack_word: name });
    menu_addstack_cache = name;
  }
  //
  // Refresh Menu
  //
  refreshMenu = function() {
    console.log('refreshMenu');
    context_menu.refresh(getOption(), {
      search_word: menu_search_cache,
      addstack_word: menu_addstack_cache
    });
  }
  //
  // Menu Wrapper Classes
  //
  const ALL_CONTEXTS = ['page', 'frame', 'selection', 'link', 'editable', 'image', 'video', 'audio'];
  const STR_CONTEXTS = ['selection', 'link'];
  const ROOT_NODE_ID = 'nunze-root';
  class MenuItemWrapper {
    constructor(opt) {
      this.title = opt.title;
      this.id = opt.id;
      this.contexts = opt.contexts || ALL_CONTEXTS;
      this.type = opt.type;
      this.parentId = opt.parentId;
      this.documentUrlPatterns = opt.documentUrlPatterns;
    }
    _menuOption() {
      const m_opt = {
        id: this.id,
        contexts: this.contexts
      }
      if (this.title) m_opt.title = this.title;
      if (this.type) m_opt.type = this.type;
      if (this.parentId) m_opt.parentId = this.parentId;
      if (this.documentUrlPatterns) m_opt.documentUrlPatterns = this.documentUrlPatterns;
      return m_opt;
    }
    create() {
      chrome.contextMenus.create(this._menuOption());
    }
    remove() {
      chrome.contextMenus.remove(this.id);
    }
    updateTitle(title) {
      if (this.title == title) return;
      this.title = title;
      chrome.contextMenus.update(this.id, { title: this.title });
    }
  }
  class MenuWrapper {
    constructor(opt) {
      // Root node
      this.root = new MenuItemWrapper({ title: 'Nunze', id: ROOT_NODE_ID });
      // Recipi Stack
      this.rs_s = new MenuItemWrapper({
        type: 'separator',
        id: 'RS-separator',
        documentUrlPatterns: opt.master.ERIONES_URL_PATTERNS,
        parentId: this.root.id
      });
      // Find from Retainer
      this.fd_s = new MenuItemWrapper({
        type: 'separator',
        id: 'FD-separator',
        contexts: STR_CONTEXTS,
        parentId: this.root.id
      });
      // Clipboard separator
      this.cp_s = new MenuItemWrapper({
        type: 'separator',
        id: 'CP-separator',
        contexts: STR_CONTEXTS,
        parentId: this.root.id
      });
      // Search Sites separator
      this.sc_s = new MenuItemWrapper({
        type: 'separator',
        id: 'SC-separator',
        contexts: STR_CONTEXTS,
        parentId: this.root.id
      });
      // Open stack
      this.rs_o = new MenuItemWrapper({
        title: 'レシピスタックを開く',
        id: 'RS-open',
        parentId: this.root.id
      });
      // Open loadstone
      this.op_ls = new MenuItemWrapper({
        title: 'LoadStoneを開く',
        id: 'OP-loadstone',
        parentId: this.root.id
      });
      // Open options
      this.op_opt = new MenuItemWrapper({
        title: '設定...',
        id: 'OP-options',
        parentId: this.root.id
      });
      // wrote nodes (now empty)
      this.nodes = [];
      this.refresh(opt);
    }
    refresh(opt, additional_opt) {
      console.log('MenuWrapper refresh ===');
      const newnodes = this._buildNodes(opt, additional_opt);
      let i = 0;
      while (i < this.nodes.length && i < newnodes.length) {
        // Remove node if IDs are different.
        if (this.nodes[i].id != newnodes[i].id) {
          console.log('-- remove', i);
          this.nodes[i].remove();
          this.nodes.splice(i, 1);
          continue;
        }
        // Update title
        if (this.nodes[i].title != newnodes[i].title) {
          console.log('-- updateTitle', i, this.nodes[i].title, '->', newnodes[i].title);
          this.nodes[i].updateTitle(newnodes[i].title);
        }
        i++;
      }
      const over_cnt = this.nodes.length - newnodes.length;
      console.log('-- over_cnt', over_cnt);
      // Remove nodes
      for (let i = over_cnt; i > 0; i--) {
        console.log('-- remove', this.nodes.length - 1);
        this.nodes[this.nodes.length - 1].remove();
        this.nodes.pop();
      }
      // Insert nodes
      console.log('-- add_from = newnodes.length + over_cnt', newnodes.length + over_cnt);
      for (let i = newnodes.length + over_cnt; i < newnodes.length; i++) {
        console.log('-- create', i, newnodes[i].title);
        newnodes[i].create();
        this.nodes.push(newnodes[i]);
      }
      console.log('=== MenuWrapper refresh');
    }
    _buildNodes(opt, additional_opt) {
      const nodes = [this.root];
      let search_word = 'アイテム';
      if (additional_opt && additional_opt.search_word)
        search_word = '[' + this._minifyName(additional_opt.search_word) + ']';
      let addstack_word = 'アイテム';
      if (additional_opt && additional_opt.addstack_word)
        addstack_word = '[' + this._minifyName(additional_opt.addstack_word) + ']';
      // Recipi Stack
      if (opt.data.recipestack.use) {
        nodes.push(new MenuItemWrapper({
          title: addstack_word + 'をスタックに追加',
          id: 'RS-add',
          documentUrlPatterns: this.rs_s.documentUrlPatterns,
          parentId: this.root.id
        }));
        nodes.push(this.rs_s);
      }
      // Find from Retainer
      if (opt.data.loadstone.use) {
        nodes.push(new MenuItemWrapper({
          title: '倉庫の' + search_word + 'を検索',
          id: 'FD-item',
          contexts: this.fd_s.contexts,
          parentId: this.root.id
        }));
        nodes.push(this.fd_s);
      }
      // Copy link text
      nodes.push(new MenuItemWrapper({
        title: search_word + 'をクリップボードにコピー',
        id: 'CP-word',
        contexts: this.cp_s.contexts,
        parentId: this.root.id
      }));
      nodes.push(this.cp_s);
      // Search sites
      const sites = this._getValidSites(opt.data.search.sites);
      for (var i = 0; i < sites.length; i++) {
        nodes.push(new MenuItemWrapper({
          title: sites[i].name + 'で' + search_word + 'を検索',
          id: 'SC-' + sites[i].index + '-' + sites[i].name,
          contexts: STR_CONTEXTS,
          parentId: this.root.id
        }));
      }
      if (sites.length > 0) nodes.push(this.sc_s);
      // Open stack
      if (opt.data.recipestack.use) nodes.push(this.rs_o);
      // Open loadstone
      if (opt.data.loadstone.use) nodes.push(this.op_ls);
      // Open options
      nodes.push(this.op_opt);
      return nodes;
    }
    _minifyName(name) {
      if (name.length <= 10) return name;
      return name.substring(0, 8) + ' ...';
    }
    _getValidSites(sites) {
      const ret = [];
      for (var i = 0; i < sites.length; i++) {
        if (sites[i].use && sites[i].name.length > 0 && sites[i].url.length > 0)
          ret.push({ name: sites[i].name, url: sites[i].url, index: i });
      };
      return ret;
    }
  }
})();
