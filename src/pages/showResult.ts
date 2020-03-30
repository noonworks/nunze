import {
  MatchResult,
  RESULT_KEYS,
  MatchedItem,
} from '../events/lodestone/match';
import { CharacterStorageDataData } from '../events/lodestone/character/data';
import InspireTree, { NodeConfig } from 'inspire-tree';
import InspireTreeDOM from 'inspire-tree-dom';

interface ResultData {
  result: MatchResult;
  characters: { [key: string]: CharacterStorageDataData };
}

interface ItemCount {
  nq: number;
  hq: number;
  cl: number;
}

interface Summary {
  name: string;
  total: ItemCount;
  characterIds: string[];
  characters: {
    [key: string]: {
      total: ItemCount;
      retainerIds: string[];
      retainers: {
        [key: string]: {
          total: ItemCount;
        };
      };
    };
  };
}

function summarizeItems(stacks: MatchedItem[]): Summary {
  const ret: Summary = {
    name: '',
    total: { nq: 0, hq: 0, cl: 0 },
    characterIds: [],
    characters: {},
  };
  if (stacks.length == 0) return ret;
  ret.name = stacks[0].name;
  for (let i = 0; i < stacks.length; i++) {
    const stk = stacks[i];
    const cId = stk.characterId;
    const rId = stk.retainerId;
    if (!cId || !rId) continue;
    if (ret.characterIds.indexOf(cId) < 0) {
      ret.characterIds.push(cId);
      ret.characters[cId] = {
        total: { nq: 0, hq: 0, cl: 0 },
        retainerIds: [],
        retainers: {},
      };
    }
    if (ret.characters[cId].retainerIds.indexOf(rId) < 0) {
      ret.characters[cId].retainerIds.push(rId);
      ret.characters[cId].retainers[rId] = {
        total: { nq: 0, hq: 0, cl: 0 },
      };
    }
    const qwl = stk.HQ ? 'hq' : stk.collectable ? 'cl' : 'nq';
    ret.total[qwl] += stk.number;
    ret.characters[cId].total[qwl] += stk.number;
    ret.characters[cId].retainers[rId].total[qwl] += stk.number;
  }
  return ret;
}

function shortenWorld(world: string | undefined): string {
  if (!world || world.length == 0) return '';
  return ' (' + world.slice(0, 8) + ')';
}

function shortenName(name: string, world: string | undefined): string {
  return name.replace(/^(.+ [A-Z]).+$/, '$1.') + shortenWorld(world);
}

function buildCountSummary(counts: ItemCount, totalCounts?: ItemCount): string {
  if (!totalCounts) totalCounts = counts;
  const cnt = ['' + counts.nq];
  if (totalCounts.hq > 0) cnt.push('[HQ] ' + counts.hq);
  if (totalCounts.cl > 0) cnt.push('[蒐集品] ' + counts.cl);
  if (cnt.length > 1) cnt[0] = '[NQ] ' + cnt[0];
  return ' ( ' + cnt.join(' / ') + ' )';
}

function toInspireTreeNode(summary: Summary, data: ResultData): NodeConfig {
  const node: NodeConfig = {
    text: summary.name + buildCountSummary(summary.total),
    children: [],
  };
  for (let ci = 0; ci < summary.characterIds.length; ci++) {
    const cId = summary.characterIds[ci];
    const character = data.characters[cId];
    if (!character) continue;
    const characterNode: NodeConfig = {
      text:
        shortenName(character.name, character.world) +
        buildCountSummary(summary.characters[cId].total, summary.total),
      children: [],
    };
    for (let ri = 0; ri < summary.characters[cId].retainerIds.length; ri++) {
      const rId = summary.characters[cId].retainerIds[ri];
      const retainer = character.retainers[rId];
      const world = character.world;
      const retNode: NodeConfig = {
        text:
          retainer.name +
          shortenWorld(world) +
          buildCountSummary(
            summary.characters[cId].retainers[rId].total,
            summary.total
          ),
        children: [],
      };
      if (!Array.isArray(characterNode.children)) characterNode.children = [];
      characterNode.children.push(retNode);
    }
    if (!Array.isArray(node.children)) node.children = [];
    node.children.push(characterNode);
  }
  return node;
}

function toInspireTreeJson(data: ResultData): NodeConfig[] {
  const ret: NodeConfig[] = [];
  for (let i = 0; i < data.result.strict.length; i++) {
    const sm = summarizeItems(data.result.strict[i]);
    ret.push(toInspireTreeNode(sm, data));
  }
  if (data.result.count == data.result.strict.length) return ret;
  const fuzzyItems: NodeConfig = {
    text: '' + data.result.count + '件の候補',
    children: [],
  };
  for (let i = 0; i < RESULT_KEYS.length; i++) {
    const items = data.result[RESULT_KEYS[i]];
    for (let j = 0; j < items.length; j++) {
      const sm = summarizeItems(items[j]);
      if (!Array.isArray(fuzzyItems.children)) fuzzyItems.children = [];
      fuzzyItems.children.push(toInspireTreeNode(sm, data));
    }
  }
  ret.push(fuzzyItems);
  return ret;
}

//
//
//
export function showResult(str: string): void {
  const data = JSON.parse(str) as ResultData;
  // retainer data not found
  if (data.result.loadDateTime.length == 0) {
    const found = document.getElementById('found');
    if (found) found.style.display = 'none';
    return;
  }
  const dnf = document.getElementById('retainer_data_not_found');
  if (dnf) dnf.style.display = 'none';
  const sw = document.getElementById('search_word');
  if (sw) sw.innerText = data.result.word;
  const ld = document.getElementById('load_date_time');
  if (ld) ld.innerText = data.result.loadDateTime;
  const target = document.getElementById('result_tree');
  if (!target) return;
  if (data.result.count == 0) return;
  const inf = document.getElementById('item_not_found');
  if (inf) inf.style.display = 'none';
  const nodes = toInspireTreeJson(data);
  const tree = new InspireTree({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: nodes as any,
  });
  new InspireTreeDOM(tree, { target });
}
