// https://bulbapedia.bulbagarden.net/wiki/Pok%C3%A9mon_data_structure_(Generation_III)
export const POKEMON_DATA_SIZE = 100;
export const POKEMON_SUBSTRUCTURE_SIZE = 12;

export const OFFSETS = {
  pid: 0x00,
  otid: 0x04,
  nickname: 0x08,
  language: 0x12,
  flags: 0x13,
  otname: 0x14,
  marking: 0x1B,
  checksum: 0x1C,
  unused: 0x1E,
  data: 0x20,
  status: 0x50,
  level: 0x54,
  mailId: 0x55,
  currentHP: 0x56,
  totalHP: 0x58,
  attack: 0x5A,
  defense: 0x5C,
  speed: 0x5E,
  spAttack: 0x60,
  spDefense: 0x62,
}

export interface PokemonData {
  raw: ArrayBuffer
  decrypted: ArrayBuffer

  pid: number
  otid: number
  nickname: string
  language: number
  flags: number[]
  otname: string
  marking: number[]
  checksum: number
  // unused: ???
  data: PokemonSubstructure[]
  status: number
  level: number
  mailId: number
  currentHP: number
  totalHP: number
  attack: number
  defense: number
  speed: number
  spAttack: number
  spDefense: number
}

// https://bulbapedia.bulbagarden.net/wiki/Pok%C3%A9mon_data_substructures_(Generation_III)
export interface PokemonSubstructure {
  id: "G" | "A" | "E" | "M"
}
export interface PokemonSubstructureG extends PokemonSubstructure {
  species: number
  itemHeld: number
  experience: number
  ppBonuses: number
  friendship: number
  // unused: ??? 
}

// https://bulbapedia.bulbagarden.net/wiki/Character_encoding_(Generation_III)
export const WESTERN_CHARACTER_SET = [
// 0    1    2    3    4    5    6    7    8    9    A    B    C    D    E    F
  "", "À", "Á", "Â", "Ç", "È", "É", "Ê", "Ë", "Ì", " ", "Î", "Ï", "Ò", "Ó", "Ô",
  "Œ", "Ù", "Ú", "Û", "Ñ", "ß", "à", "á", " ", "ç", "è", "é", "ê", "ë", "ì", " ",
  "î", "ï", "ò", "ó", "ô", "œ", "ù", "ú", "û", "ñ", "º", "ª", "ᵉʳ", "&", "+", " ",
  " ", " ", " ", " ", "Lv", "=", ";", " ", " ", " ", " ", " ", " ", " ", " ", " ",
  " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ",
  "▯", "¿", "¡", "PK", "MN", "PO", "Ké", "BL", "OC", "K", "Í", "%", "(", ")", " ", " ",
  " ", " ", " ", " ", " ", " ", " ", " ", "â", " ", " ", " ", " ", " ", " ", "í",
  " ", " ", " ", " ", " ", " ", " ", " ", " ", "↑", "↓", "←", "→", "*", "*", "*",
  "*", "*", "*", "*", "ᵉ", "<", ">", " ", " ", " ", " ", " ", " ", " ", " ", " ",
  " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ",
  "ʳᵉ", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "!", "?", ".", "-", "･",
  "‥", "“", "”", "‘",	"'", "♂", "♀", "$",	",", "×", "/", "A", "B", "C", "D", "E",
  "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U",
  "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k",
  "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "►",
  ":", "Ä", "Ö", "Ü", "ä", "ö", "ü", "\\", "\\", "\\", "", "", "", "", "\n", "",
// 0    1    2    3    4    5    6    7     8     9    A   B   C   D    E    F
];
