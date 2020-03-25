type StringMap = { [key: string]: string };

const HAN_MAP: StringMap = {
  ｶﾞ: 'ガ',
  ｷﾞ: 'ギ',
  ｸﾞ: 'グ',
  ｹﾞ: 'ゲ',
  ｺﾞ: 'ゴ',
  ｻﾞ: 'ザ',
  ｼﾞ: 'ジ',
  ｽﾞ: 'ズ',
  ｾﾞ: 'ゼ',
  ｿﾞ: 'ゾ',
  ﾀﾞ: 'ダ',
  ﾁﾞ: 'ヂ',
  ﾂﾞ: 'ヅ',
  ﾃﾞ: 'デ',
  ﾄﾞ: 'ド',
  ﾊﾞ: 'バ',
  ﾋﾞ: 'ビ',
  ﾌﾞ: 'ブ',
  ﾍﾞ: 'ベ',
  ﾎﾞ: 'ボ',
  ﾊﾟ: 'パ',
  ﾋﾟ: 'ピ',
  ﾌﾟ: 'プ',
  ﾍﾟ: 'ペ',
  ﾎﾟ: 'ポ',
  ｳﾞ: 'ヴ',
  ｱ: 'ア',
  ｲ: 'イ',
  ｳ: 'ウ',
  ｴ: 'エ',
  ｵ: 'オ',
  ｶ: 'カ',
  ｷ: 'キ',
  ｸ: 'ク',
  ｹ: 'ケ',
  ｺ: 'コ',
  ｻ: 'サ',
  ｼ: 'シ',
  ｽ: 'ス',
  ｾ: 'セ',
  ｿ: 'ソ',
  ﾀ: 'タ',
  ﾁ: 'チ',
  ﾂ: 'ツ',
  ﾃ: 'テ',
  ﾄ: 'ト',
  ﾅ: 'ナ',
  ﾆ: 'ニ',
  ﾇ: 'ヌ',
  ﾈ: 'ネ',
  ﾉ: 'ノ',
  ﾊ: 'ハ',
  ﾋ: 'ヒ',
  ﾌ: 'フ',
  ﾍ: 'ヘ',
  ﾎ: 'ホ',
  ﾏ: 'マ',
  ﾐ: 'ミ',
  ﾑ: 'ム',
  ﾒ: 'メ',
  ﾓ: 'モ',
  ﾔ: 'ヤ',
  ﾕ: 'ユ',
  ﾖ: 'ヨ',
  ﾗ: 'ラ',
  ﾘ: 'リ',
  ﾙ: 'ル',
  ﾚ: 'レ',
  ﾛ: 'ロ',
  ﾜ: 'ワ',
  ｦ: 'ヲ',
  ﾝ: 'ン',
  ｧ: 'ァ',
  ｨ: 'ィ',
  ｩ: 'ゥ',
  ｪ: 'ェ',
  ｫ: 'ォ',
  ｯ: 'ッ',
  ｬ: 'ャ',
  ｭ: 'ュ',
  ｮ: 'ョ',
  '-': 'ー',
};

const KANA_MAP: StringMap = {
  ガ: 'カ',
  ギ: 'キ',
  グ: 'ク',
  ゲ: 'ケ',
  ゴ: 'コ',
  ザ: 'サ',
  ジ: 'シ',
  ズ: 'ス',
  ゼ: 'セ',
  ゾ: 'ソ',
  ダ: 'タ',
  ヂ: 'チ',
  ヅ: 'ツ',
  デ: 'テ',
  ド: 'ト',
  バ: 'ハ',
  ビ: 'ヒ',
  ブ: 'フ',
  ベ: 'ヘ',
  ボ: 'ホ',
  パ: 'ハ',
  ピ: 'ヒ',
  プ: 'フ',
  ペ: 'ヘ',
  ポ: 'ホ',
  ヴ: 'ウ',
};

const HAN_EXP = new RegExp('(' + Object.keys(HAN_MAP).join('|') + ')', 'g');
const KANA_EXP = new RegExp('(' + Object.keys(KANA_MAP).join('|') + ')', 'g');
const HYPHENS_EXP = /[-－―‐]/g;
const YO_EXP = /[ァィゥェォャュョ]/g;

//
// Fuzzy search functions
//
function fuzzyKana(str: string): string {
  // 半角を全角に変換（おかしな濁点と半濁点は削除）
  // 濁音と半濁音を清音に変換
  // マイナス、ダッシュ、ハイフンを「ー」に変換
  // 拗音を削除
  // カタカナをひらがなに変換
  return str
    .replace(HAN_EXP, (m) => HAN_MAP[m] || '')
    .replace(/ﾞ/g, '')
    .replace(/ﾟ/g, '')
    .replace(KANA_EXP, (m) => KANA_MAP[m] || '')
    .replace(HYPHENS_EXP, 'ー')
    .replace(YO_EXP, '')
    .replace(/[ァ-ヴ]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0x60));
}

//
// Convert to Fuzzy name
//
export function fuzzyName(name: string): string {
  // 使用されない（と思われる）記号の削除（/\^$*+?.|[]{};"'%&=~@`,_!#）
  name = name.replace(/[/\\^$*+?.|[\]{};"'%&=~@`,_!#]/g, '');
  // 「：」「:」「・」「･」スペース、タブを無視
  // eslint-disable-next-line no-irregular-whitespace
  name = name.replace(/[：:・･ 　\t]/g, '');
  // 括弧を全角に統一
  name = name.replace(/\(/g, '（').replace(/\)/g, '）');
  // カナを統一
  return fuzzyKana(name);
}
