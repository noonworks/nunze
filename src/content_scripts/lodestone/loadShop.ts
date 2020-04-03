export interface LogItem {
  name: string;
  HQ: boolean;
  num: number;
  price: number;
  customer: string;
  dateTime: number;
}

export interface ShopItem {
  name: string;
  HQ: boolean;
  num: number;
  price: number;
  total: number;
}

export interface ShopItems {
  shopItems: ShopItem[];
  shopLogs: LogItem[];
}

// eslint-disable-next-line no-irregular-whitespace
const STRIP_REGEX = /^[ 　\t\r\n]*(.*)[ 　\t\r\n]*$/;
function strip(str: string | null | undefined): string {
  if (!str) return '';
  const m = str.match(STRIP_REGEX);
  if (!m) return '';
  return m[1];
}

function toInt(str: string): number {
  const s = str.replace(/,/g, '');
  const i = parseInt(s, 10);
  if (isNaN(i)) return -1;
  return i;
}

// eslint-disable-next-line no-irregular-whitespace
const NUMBER_REGEX = /(.*)\(([0-9]+)\)/;
const HQ_REGEX = /^([^]+)(?)$/;
function getNames(
  itemP: HTMLElement
): { name: string; num: number; HQ: boolean } | null {
  const item = strip(itemP.textContent);
  const m = item.match(NUMBER_REGEX);
  if (!m) return null;
  const num = toInt(m[2]);
  if (num < 0) return null;
  const m2 = m[1].match(HQ_REGEX);
  if (!m2) return null;
  const HQ = m2[2].length > 0;
  return { name: m2[1], num, HQ };
}

function getLogDateTime(div: HTMLElement): number {
  const span = div.querySelector('span');
  if (!span) return -1;
  const e = span.dataset.epoch;
  if (!e) return -1;
  const ei = toInt(e);
  if (ei < 0) return -1;
  return ei * 1000;
}

function getLogItem(li: HTMLElement): LogItem | null {
  const itemP = li.querySelector('p.item-list__name');
  if (!itemP) return null;
  const names = getNames(itemP as HTMLElement);
  if (!names) return null;
  const div = li.querySelectorAll('div.item-list__item');
  if (div.length !== 4) return null;
  const priceStr = strip(div[1].textContent);
  const price = toInt(priceStr);
  if (price < 0) return null;
  const customer = strip(div[2].textContent);
  const dateTime = getLogDateTime(div[3] as HTMLElement);
  if (customer.length === 0 || dateTime < 0) return null;
  return { ...names, price, customer, dateTime };
}

function getShopItemName(
  div: HTMLElement
): { name: string; HQ: boolean } | null {
  const a = div.querySelector('div.item-list__name a');
  if (!a) return null;
  const name = strip(a.textContent);
  const m = name.match(HQ_REGEX);
  if (!m) return null;
  return { name: m[1], HQ: m[2].length > 0 };
}

function getShopItem(li: HTMLElement): ShopItem | null {
  const div = li.querySelectorAll('div.item-list__item');
  if (div.length !== 4) return null;
  const itemName = getShopItemName(div[0] as HTMLElement);
  if (!itemName) return null;
  const priceStr = strip(div[1].textContent);
  const price = toInt(priceStr);
  const numStr = strip(div[2].textContent);
  const num = toInt(numStr);
  const totalStr = strip(div[1].textContent);
  const total = toInt(totalStr);
  if (price < 0 || num < 0 || total < 0) return null;
  return { ...itemName, price, num, total };
}

function loadLog(div: HTMLElement): LogItem[] {
  const lists = div.querySelectorAll('ul.item-list--footer li.item-list__list');
  const ret: LogItem[] = [];
  for (let i = 0; i < lists.length; i++) {
    const item = getLogItem(lists[i] as HTMLElement);
    if (item) ret.push(item);
  }
  return ret;
}

function loadList(div: HTMLElement): ShopItem[] {
  const lists = div.querySelectorAll('ul.item-list--footer li.item-list__list');
  const ret: ShopItem[] = [];
  for (let i = 0; i < lists.length; i++) {
    const item = getShopItem(lists[i] as HTMLElement);
    if (item) ret.push(item);
  }
  return ret;
}

export function loadShopItems(): ShopItems {
  const ret: ShopItems = { shopItems: [], shopLogs: [] };
  const div = document.querySelectorAll('div.retainer__content');
  for (let i = 0; i < div.length; i++) {
    const name = div[i].getAttribute('name');
    if (!name || name.length === 0) continue;
    if (name === 'tab__market-logs')
      ret.shopLogs = loadLog(div[i] as HTMLElement);
    if (name === 'tab__market-list')
      ret.shopItems = loadList(div[i] as HTMLElement);
  }
  return ret;
}
