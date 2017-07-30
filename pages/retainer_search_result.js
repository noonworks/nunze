//
// Message listener
//
window.addEventListener('message', function(msg) {
  if (msg.source != window.parent) return;
  // split method name
  const cln = msg.data.indexOf(':');
  if (cln < 0) return;
  const method = msg.data.substring(0, cln);
  const data = msg.data.substring(cln + 1, msg.data.length);
  if (method == 'Nunze_SHOW_RESULT') {
    showResult(data);
  }
}, false);

//
// Show result
//
function showResult(data_s) {
  const data = JSON.parse(data_s);
  console.log(data);
  // retainer data not found
  if (data.result.load_datetime.length == 0) {
    document.getElementById('found').style = "display:none;";
    return;
  }
  document.getElementById('retainer_data_not_found').style = "display:none;";
  document.getElementById('search_word').innerText = data.result.word;
  document.getElementById('load_datetime').innerText = data.result.load_datetime;
  if (data.result.number == 0) return; // not found
  document.getElementById('item_not_found').style = "display:none;";
  let tree = new InspireTree({
    data: toInspireTreeJson(data)
  });
  new InspireTreeDOM(tree, {
    target: '.tree'
  });
}
function summarizeItems(stacks) {
  const ret = {
    name: '',
    total: { nq: 0, hq: 0, cl: 0 },
    character_ids: []
  };
  if (stacks.length == 0) return ret;
  ret.name = stacks[0].name;
  for (let i = 0; i < stacks.length; i++) {
    const stk = stacks[i];
    const c_id = stk.character_id;
    const r_id = stk.retainer_id;
    if (ret.character_ids.indexOf(c_id) < 0) {
      ret.character_ids.push(c_id);
      ret[c_id] = {
        total: { nq: 0, hq: 0, cl: 0 },
        retainer_ids: []
      };
    }
    if (ret[c_id].retainer_ids.indexOf(r_id) < 0) {
      ret[c_id].retainer_ids.push(r_id);
      ret[c_id][r_id] = {
        total: { nq: 0, hq: 0, cl: 0 }
      };
    }
    const qwl = stk.HQ ? 'hq' : (stk.collectable ? 'cl' : 'nq');
    ret.total[qwl] += stk.number;
    ret[c_id].total[qwl] += stk.number;
    ret[c_id][r_id].total[qwl] += stk.number;
  }
  return ret;
}
function buildCountSummary(counts, totalCounts) {
  if (! totalCounts) totalCounts = counts;
  const cnts = ['' + counts.nq];
  if (totalCounts.hq > 0) cnts.push('[HQ] ' + counts.hq);
  if (totalCounts.cl > 0) cnts.push('[蒐集品] ' + counts.cl);
  if (cnts.length > 1) cnts[0] = '[NQ] ' + cnts[0];
  return ' ( ' + cnts.join(' / ') + ' )';
}
function shortenWorld(world) {
  if (!world || world.length == 0) return '';
  return ' (' + world.slice(0, 8) + ')';
}
function shortenName(name, world) {
  return name.replace(/^(.+ [A-Z]).+$/, '$1.') + shortenWorld(world);
}
function toInspireTreeNode(summary, data) {
  const node = {
    text: summary.name + buildCountSummary(summary.total),
    children: []
  }
  for (let ci = 0; ci < summary.character_ids.length; ci++) {
    const c_id = summary.character_ids[ci];
    const chara = data.characters[c_id];
    if (! chara) continue;
    const chara_node = {
      text: shortenName(chara.name, chara.world) + buildCountSummary(summary[c_id].total, summary.total),
      children: []
    }
    for (let ri = 0; ri < summary[c_id].retainer_ids.length; ri++) {
      const r_id = summary[c_id].retainer_ids[ri];
      const retainer = data.characters[c_id].retainers[r_id];
      const ret_node = {
        text: retainer.name + shortenWorld(retainer.world) +
          buildCountSummary(summary[c_id][r_id].total, summary.total)
      }
      chara_node.children.push(ret_node);
    }
    node.children.push(chara_node);
  }
  return node;
}

const RESULT_LABELS = ['strict', 'fuzzy_match', 'part', 'fuzzy_part'];
function toInspireTreeJson(data) {
  const ret = [];
  for (let i = 0; i < data.result.strict.length; i++) {
    const sm = summarizeItems(data.result.strict[i]);
    ret.push(toInspireTreeNode(sm, data));
  }
  if (data.result.number == data.result.strict.length) return ret;
  const fuzzies = {
    text: '' + data.result.number + '件の候補',
    children: []
  }
  for (let i = 0; i < RESULT_LABELS.length; i++) {
    const items = data.result[RESULT_LABELS[i]];
    for (let j = 0; j < items.length; j++) {
      const sm = summarizeItems(items[j]);
      fuzzies.children.push(toInspireTreeNode(sm, data));
    }
  }
  ret.push(fuzzies);
  return ret;
}
