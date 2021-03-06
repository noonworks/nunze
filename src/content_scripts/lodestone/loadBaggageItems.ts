import { InventoryItem } from '../../events/lodestone/inventory/data';

const ASPECT_NAME: { [key: string]: string } = {
  火: 'ファイア',
  氷: 'アイス',
  風: 'ウィンド',
  土: 'アース',
  雷: 'ライトニング',
  水: 'ウォーター',
};

function getAspectName(node: Element | null): string {
  if (!node) return '';
  const elm = node.getAttribute('data-tooltip') || '';
  if (ASPECT_NAME[elm]) return ASPECT_NAME[elm];
  return '';
}

function getCrystalAmount(node: Element | null): number {
  if (!node) return 0;
  const numStr = (node as HTMLElement).innerText.replace(/[ \t\r\n]/g, '');
  if (numStr.length == 0) return 0;
  const num = parseInt(numStr, 10);
  if (isNaN(num)) return 0;
  return num;
}

function allLoaded(indexes: string[]): boolean {
  const notFound = indexes.filter((idx) => {
    const tab = document.querySelector('div.sys_chest_list_' + idx);
    return !tab;
  });
  return notFound.length === 0;
}

function getAllPages(): Promise<NodeListOf<Element>> {
  const tabItems = document.querySelectorAll('li.tab__chest--list');
  return new Promise<NodeListOf<Element>>((resolve, reject) => {
    const indexes: string[] = [];
    for (let i = 0; i < tabItems.length; i++) {
      const button = tabItems[i];
      const link = button.querySelector('a.sys_chest_tab');
      if (!link) continue;
      const tabIdx = (link as HTMLElement).dataset.chest_tab;
      if (!tabIdx) continue;
      indexes.push(tabIdx);
      (link as HTMLElement).click();
    }
    if (indexes.length === 0) {
      resolve(document.querySelectorAll('li.item-list__list'));
      return;
    }
    let timeout = 1500;
    const id = setInterval(() => {
      timeout -= 100;
      if (timeout <= 0) {
        clearInterval(id);
        reject();
      } else if (allLoaded(indexes)) {
        clearInterval(id);
        resolve(document.querySelectorAll('li.item-list__list'));
      }
    }, 100);
  });
}

function doLoadBaggageItems(baggages: NodeListOf<Element>): InventoryItem[] {
  const items: InventoryItem[] = [];
  for (let idx = 0; idx < baggages.length; idx++) {
    const e = baggages[idx];
    const nameH4 = e.getElementsByTagName('h4');
    if (nameH4.length !== 1) continue;
    const link = nameH4[0].getElementsByTagName('a');
    if (link.length <= 1) continue;
    const name = link[0].innerText || '';
    if (name.length === 0) continue;
    const num = e.getElementsByClassName('item-list__number');
    if (num.length !== 1) continue;
    const i = parseInt((num[0] as HTMLElement).innerText, 10);
    if (isNaN(i)) continue;
    const icon = e.getElementsByClassName('ic_item_quality');
    let HQ = false;
    let collectable = false;
    if (icon.length >= 1) {
      const u = new URL(link[0].href, window.location.href);
      if (u.search.indexOf('hq=1') >= 0) HQ = true;
      else collectable = true;
    }
    items.push({ name, number: i, HQ, collectable });
  }
  // crystals
  const crystalTable = document.querySelector('div.table__crystal table');
  if (!crystalTable) return items;
  const kindsTh = crystalTable.querySelectorAll('thead th span');
  const kinds = [];
  for (let i = 0; i < kindsTh.length; i++) {
    const name = kindsTh[i].getAttribute('data-tooltip');
    if (name && name.length > 0) kinds.push(name);
  }
  if (kinds.length < 3) return items;
  const lines = crystalTable.querySelectorAll('tbody tr');
  for (let i = 0; i < lines.length; i++) {
    const aspect = getAspectName(lines[i].querySelector('th span'));
    if (aspect.length == 0) continue;
    const tds = lines[i].querySelectorAll('td a');
    if (tds.length != kinds.length) continue;
    for (let j = 0; j < tds.length; j++) {
      const num = getCrystalAmount(tds[j]);
      if (num <= 0) continue;
      items.push({
        name: aspect + kinds[j],
        number: num,
        HQ: false,
        collectable: false,
      });
    }
  }
  return items;
}

export function loadBaggageItems(): Promise<InventoryItem[]> {
  return new Promise<InventoryItem[]>((resolve, reject) => {
    getAllPages()
      .then((baggages) => {
        resolve(doLoadBaggageItems(baggages));
      })
      .catch(reject);
  });
}
