import { getKanaLoaction } from './chars'

const ROMAJI_ROWS_TEXT = 'kstnhmyrwgzdbp'
const ROMAJI_COLUMNS_TEXT = 'aiueo'
const ROMAJI_ALIASES = {
  si: 'shi',
  ti: 'chi',
  tu: 'tsu',
  hu: 'fu',
  zi: 'ji',
  di: 'ji',
  du: 'zu',
}

export function parseToRomaji(text: string) {
  return text
    .split('')
    .map((char) => {
      const [row, column] = getKanaLoaction(char)
      const romaji = ROMAJI_ROWS_TEXT[row - 1] + ROMAJI_COLUMNS_TEXT[column]
      return ROMAJI_ALIASES[romaji] || romaji
    })
    .join('')
}
