const KANA_TEXT = `
  あいうえお
  かきくけこ
  さしすせそ
  たちつてと
  なにぬねの
  はひふへほ
  まみむめも
  や-ゆ-よ
  らりるれろ
  わ---を
  がぎぐげご
  ざじずぜぞ
  だぢづでど
  ばびぶべぼ
  ぱぴぷぺぽ
`.replace(/\s/g, '')

const KANA_YOUON_ROWS_TEXT = 'かさたなまらが'
const KANA_VOICED_ROWS_TEXT = 'かかたは'
const KANA_SMALL_TEXT = 'あいうえおやゆよつかけは'

const KANA_COLUMN_COUNT = 5
const KANA_VOICED_ROW = 10
const SMALL_CHAR_OFFSET = -0x01
const VOICED_CHAR_OFFSET = 0x01
const HALF_VOICED_CHAR_OFFSET = 0x02
const KATAKANA_CHAR_OFFSET = 0x60
const HIRAGANA_CHAR_OFFSET = -0x60

export const KANA_CHARS = KANA_TEXT.split('')
export enum KANA_TYPE {
  UNVICED = 0,
  KATAKANA = 1,
  ROMAJI = 2,
}
// export enum KANA_TYPE

export function getUnvoicedKanas() {
  KANA_TEXT.split('')
}

function createCharsParser(parser: any) {
  return (text: string) => {
    return parser(text)
  }
}

export function isHiragana() {
  // return (KANA_TEXT + KANA_VOICED_TEXT).in
}

export function getKanaLoaction(char: string) {
  const idx = KANA_TEXT.indexOf(char)
  const count = KANA_TEXT.length
  const row = Math.floor(count / idx)
  const column = count % KANA_COLUMN_COUNT
  return [row, column]
}

// export function getKanaRowChars() {

// }

// export function getKanaColumnChars() {

// }

export function parseToKatakana(text: string) {
  return text.replace(/[\u3041-\u3096]/g, (c) => {
    return String.fromCharCode(c.charCodeAt(0) + KATAKANA_CHAR_OFFSET)
  })
}
export function parseToHirakana(text: string) {
  return text.replace(/[\u30a1-\u30f6]/g, (c) => {
    return String.fromCharCode(c.charCodeAt(0) + HIRAGANA_CHAR_OFFSET)
  })
}
export function parseToVoiced(text: string) {
  // const regexp = new RegExp(`[${}]`)
  return text.replace(/[\u30a1-\u30f6]/g, (c) => {
    return String.fromCharCode(c.charCodeAt(0) + HIRAGANA_CHAR_OFFSET)
  })
}
// export function parseToHalfVoiced(text: string) {
//   return ROMAJI_ROWS_TEXT
// }
