import { Contexts, MenuItemOption, MenuItem } from './MenuItem';
import { Master } from '../../master';
import { NunzeOptionBase } from '../option/option';
import { Site } from '../option/version1';
import { Menu } from './Menu';
import { OptionStorage } from '../option/storage';

const ROOT_NODE_ID = 'nunze-root';
const STR_CONTEXTS = ['selection', 'link'] as Contexts[];

const DEFAULT_MENU: { [key: string]: MenuItemOption } = {
  root: {
    id: ROOT_NODE_ID,
    title: 'Nunze',
  },
  recipeSeparator: {
    id: 'RS-separator',
    type: 'separator',
    parentId: ROOT_NODE_ID,
    documentUrlPatterns: Master.ERIONES_URL_PATTERNS,
  },
  FindSeparator: {
    id: 'FD-separator',
    type: 'separator',
    parentId: ROOT_NODE_ID,
    contexts: STR_CONTEXTS,
  },
  ClipboardSeparator: {
    id: 'CP-separator',
    type: 'separator',
    parentId: ROOT_NODE_ID,
    contexts: STR_CONTEXTS,
  },
  SearchSeparator: {
    id: 'SC-separator',
    type: 'separator',
    parentId: ROOT_NODE_ID,
    contexts: STR_CONTEXTS,
  },
  OpenLodestone: {
    id: 'OP-lodestone',
    title: 'LodeStoneを開く',
    parentId: ROOT_NODE_ID,
  },
  OpenOption: {
    id: 'OP-options',
    title: '設定...',
    parentId: ROOT_NODE_ID,
  },
  OpenShopLog: {
    id: 'OP-shopLog',
    title: '販売履歴...',
    parentId: ROOT_NODE_ID,
  },
};

type MenuItemTuple = [string, MenuItem];
type MenuItemKV = { [key: string]: MenuItem };
const DEFAULT_MENU_ITEMS = Object.keys(DEFAULT_MENU)
  .map((key): MenuItemTuple => [key, new MenuItem(DEFAULT_MENU[key])])
  .reduce((prev, cur): MenuItemKV => {
    prev[cur[0]] = cur[1];
    return prev;
  }, {} as MenuItemKV);

function minifyName(name: string): string {
  if (name.length <= 10) return name;
  return name.substring(0, 8) + ' ...';
}

interface IndexedSite extends Site {
  index: number;
}

function getValidSites(sites: Site[]): IndexedSite[] {
  const ret: IndexedSite[] = [];
  for (let i = 0; i < sites.length; i++) {
    if (sites[i].use && sites[i].name.length > 0 && sites[i].url.length > 0)
      ret.push({ ...sites[i], index: i });
  }
  return ret;
}
export interface MenuOption {
  searchWord: string;
}

function buildNodes(
  opt: NunzeOptionBase,
  additionalOpt?: MenuOption
): MenuItem[] {
  const nodes = [DEFAULT_MENU_ITEMS.root];
  let searchWord = 'アイテム';
  if (additionalOpt && additionalOpt.searchWord)
    searchWord = '[' + minifyName(additionalOpt.searchWord) + ']';
  // Find from Retainer
  if (opt.data.lodestone.use) {
    nodes.push(
      new MenuItem({
        id: 'FD-item',
        title: '倉庫の' + searchWord + 'を検索',
        contexts: DEFAULT_MENU.FindSeparator.contexts,
        parentId: DEFAULT_MENU.root.id,
      })
    );
    nodes.push(DEFAULT_MENU_ITEMS.FindSeparator);
  }
  // Copy link text
  if (document.queryCommandSupported('copy')) {
    nodes.push(
      new MenuItem({
        id: 'CP-word',
        title: searchWord + 'をクリップボードにコピー',
        contexts: DEFAULT_MENU.ClipboardSeparator.contexts,
        parentId: DEFAULT_MENU.root.id,
      })
    );
    nodes.push(DEFAULT_MENU_ITEMS.ClipboardSeparator);
  }
  // Search sites
  const sites = getValidSites(opt.data.search.sites);
  for (let i = 0; i < sites.length; i++) {
    nodes.push(
      new MenuItem({
        id: 'SC-' + sites[i].index + '-' + sites[i].name,
        title: sites[i].name + 'で' + searchWord + 'を検索',
        contexts: STR_CONTEXTS,
        parentId: DEFAULT_MENU.root.id,
      })
    );
  }
  if (sites.length > 0) nodes.push(DEFAULT_MENU_ITEMS.SearchSeparator);
  // Open lodestone
  if (opt.data.lodestone.use) nodes.push(DEFAULT_MENU_ITEMS.OpenLodestone);
  // Open shop log
  if (opt.data.lodestone.use) nodes.push(DEFAULT_MENU_ITEMS.OpenShopLog);
  // Open options
  nodes.push(DEFAULT_MENU_ITEMS.OpenOption);
  return nodes;
}

export class NunzeMenu {
  static ins: NunzeMenu;

  static instance(): NunzeMenu {
    if (!this.ins) this.ins = new NunzeMenu();
    return this.ins;
  }

  private menu: Menu;
  private constructor() {
    this.menu = new Menu(buildNodes(OptionStorage.instance().load()));
  }

  // Update search menu
  private menuSearchCache = '';
  public updateSearchWord(name: string): void {
    if (name == this.menuSearchCache) return;
    this.menu.refresh(
      buildNodes(OptionStorage.instance().load(), { searchWord: name })
    );
    this.menuSearchCache = name;
  }

  // Refresh Menu
  public refresh(): void {
    this.menu.refresh(
      buildNodes(OptionStorage.instance().load(), {
        searchWord: this.menuSearchCache,
      })
    );
  }
}
