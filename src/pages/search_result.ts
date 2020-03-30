import { showResult } from './showResult';

//
// Message listener
//
window.addEventListener(
  'message',
  (msg) => {
    if (msg.source != window.parent) return true;
    // split method name
    const cln = msg.data.indexOf(':');
    if (cln < 0) return;
    const method = msg.data.substring(0, cln);
    const data = msg.data.substring(cln + 1, msg.data.length);
    if (method == 'Nunze_SHOW_RESULT') showResult(data);
    return true;
  },
  false
);
