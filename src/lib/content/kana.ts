export type KanaScript = 'hiragana' | 'katakana';

export interface KanaCharacter {
  character: string;
  romaji: string;
  script: KanaScript;
}

const GOJUON: [string, string][] = [
  ['あ', 'a'],
  ['い', 'i'],
  ['う', 'u'],
  ['え', 'e'],
  ['お', 'o'],
  ['か', 'ka'],
  ['き', 'ki'],
  ['く', 'ku'],
  ['け', 'ke'],
  ['こ', 'ko'],
  ['さ', 'sa'],
  ['し', 'shi'],
  ['す', 'su'],
  ['せ', 'se'],
  ['そ', 'so'],
  ['た', 'ta'],
  ['ち', 'chi'],
  ['つ', 'tsu'],
  ['て', 'te'],
  ['と', 'to'],
  ['な', 'na'],
  ['に', 'ni'],
  ['ぬ', 'nu'],
  ['ね', 'ne'],
  ['の', 'no'],
  ['は', 'ha'],
  ['ひ', 'hi'],
  ['ふ', 'fu'],
  ['へ', 'he'],
  ['ほ', 'ho'],
  ['ま', 'ma'],
  ['み', 'mi'],
  ['む', 'mu'],
  ['め', 'me'],
  ['も', 'mo'],
  ['や', 'ya'],
  ['ゆ', 'yu'],
  ['よ', 'yo'],
  ['ら', 'ra'],
  ['り', 'ri'],
  ['る', 'ru'],
  ['れ', 're'],
  ['ろ', 'ro'],
  ['わ', 'wa'],
  ['を', 'wo'],
  ['ん', 'n'],
];

const DAKUTEN: [string, string][] = [
  ['が', 'ga'],
  ['ぎ', 'gi'],
  ['ぐ', 'gu'],
  ['げ', 'ge'],
  ['ご', 'go'],
  ['ざ', 'za'],
  ['じ', 'ji'],
  ['ず', 'zu'],
  ['ぜ', 'ze'],
  ['ぞ', 'zo'],
  ['だ', 'da'],
  ['ぢ', 'ji'],
  ['づ', 'zu'],
  ['で', 'de'],
  ['ど', 'do'],
  ['ば', 'ba'],
  ['び', 'bi'],
  ['ぶ', 'bu'],
  ['べ', 'be'],
  ['ぼ', 'bo'],
];

const HANDAKUTEN: [string, string][] = [
  ['ぱ', 'pa'],
  ['ぴ', 'pi'],
  ['ぷ', 'pu'],
  ['ぺ', 'pe'],
  ['ぽ', 'po'],
];

const HIRAGANA_TO_KATAKANA: Record<string, string> = Object.fromEntries(
  [...GOJUON, ...DAKUTEN, ...HANDAKUTEN].map(([hiragana]) => [
    hiragana,
    String.fromCodePoint(hiragana.codePointAt(0)! + 0x60),
  ]),
);

function buildScript(script: KanaScript): KanaCharacter[] {
  return [...GOJUON, ...DAKUTEN, ...HANDAKUTEN].map(([hiragana, romaji]) => ({
    character: script === 'hiragana' ? hiragana : HIRAGANA_TO_KATAKANA[hiragana],
    romaji,
    script,
  }));
}

export const HIRAGANA: readonly KanaCharacter[] = buildScript('hiragana');
export const KATAKANA: readonly KanaCharacter[] = buildScript('katakana');

const BY_SCRIPT: Record<KanaScript, readonly KanaCharacter[]> = {
  hiragana: HIRAGANA,
  katakana: KATAKANA,
};

export function getKanaSet(script: KanaScript): readonly KanaCharacter[] {
  return BY_SCRIPT[script];
}

export function isKanaScript(value: string): value is KanaScript {
  return value === 'hiragana' || value === 'katakana';
}

export function findKana(script: KanaScript, character: string): KanaCharacter | null {
  return BY_SCRIPT[script].find((entry) => entry.character === character) ?? null;
}
