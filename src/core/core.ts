import { OFFSETS, PokemonData, WESTERN_CHARACTER_SET } from "../models/PokemonData";

function isLittleEndian() {
  const a8 = new Uint8Array(4);
  const a32 = new Uint32Array(a8.buffer)
  a32[0] = 0xFFAA3311;
  return a8[0] !== 0xff;
}

const IS_LITTLE_ENDIAN = isLittleEndian();
console.log("little endian", IS_LITTLE_ENDIAN);

export function toHex(arg: number | string): string {
  if (typeof arg === "string") return arg;
  return "0x" + arg.toString(16).padStart(2, "0");
}

function read_u8_little_endian(memory: ArrayBuffer, b: number): number {
  const dv = new DataView(memory, b, 1);
  return dv.getUint8(0);
}

function read_u16_little_endian(memory: ArrayBuffer, b: number): number {
  const dv = new DataView(memory, b, 2);
  return dv.getUint16(0, IS_LITTLE_ENDIAN);
}

function read_u32_little_endian(memory: ArrayBuffer, b: number): number {
  const dv = new DataView(memory, b, 4);
  return dv.getUint32(0, IS_LITTLE_ENDIAN);
}

function read_string_little_endian(memory: ArrayBuffer, b: number, size: number, charSet = WESTERN_CHARACTER_SET): string {
  const u8Array = new Uint8Array(memory.slice(b, b + size));
  const out: string[] = [];
  let i = 0;
  while (i < size) {
    if (u8Array[i] === 0xFF) break;

    out.push(charSet[u8Array[i]]);
    i++;
  }
  return out.join("");
}

/**
 * The checksum for the 48-byte data section of this structure.
 * It is computed by adding all of the unencrypted values of that section one word at a time.
 * If the computed sum and the stored checksum do not match, the Pokémon is interpreted as a Bad Egg.
 * @param memory 
 * @returns checksum as 16-bit number
 */
function checksum(memory: ArrayBuffer): number {
  const u16Array = new Uint16Array(memory.slice(OFFSETS.data, OFFSETS.status));
  return u16Array.reduce((prev, curr) => (prev + curr) & 0xFFFF, 0);
}

function CryptArray3(ekm: ArrayBuffer, seed: number): ArrayBuffer {
  const sourceArray = new Uint32Array(ekm);

  const destBuffer = new ArrayBuffer(ekm.byteLength);
  const destArray = new Uint32Array(destBuffer);

  let index = 0;
  for (let source32 of sourceArray) {
    destArray[index] = source32;
    const offset = index * 4;
    if (OFFSETS.data <= offset && offset < OFFSETS.status) {
      destArray[index] ^= seed;
    }
    index += 1;
  }

  return destArray.buffer;
}

// # def ShuffleArray3(data: bytes, result: bytes, sv: int) -> bytearray:
// #     result = bytearray(len(data))
// #     index = sv * 4
// #     data[:SIZE_3HEADER].CopyTo(result[..SIZE_3HEADER]);
// #     data[SIZE_3STORED:].CopyTo(result[SIZE_3STORED..]);
// #     for (int block = 3; block >= 0; block--) {
// #         var dest = result.Slice(SIZE_3HEADER + (SIZE_3BLOCK * block), SIZE_3BLOCK);
// #         int ofs = BlockPosition[index + block];
// #         var src = data.Slice(SIZE_3HEADER + (SIZE_3BLOCK * ofs), SIZE_3BLOCK);
// #         src.CopyTo(dest);
// #     }

function decryptArray3(ekm: ArrayBuffer): ArrayBuffer {
  const PID = read_u32_little_endian(ekm, 0);
  const OID = read_u32_little_endian(ekm, 4);
  const seed = PID ^ OID;
  const res = CryptArray3(ekm, seed);
  // return ShuffleArray3(res, PID % 24)
  return res
}

export function parsePokemonData(data: ArrayBuffer): PokemonData | null {
  const storedChecksum = read_u16_little_endian(data, OFFSETS.checksum);

  let computedChecksum = checksum(data);
  console.log('computed checksum', toHex(computedChecksum));

  const decryptedData = storedChecksum !== computedChecksum ? decryptArray3(data) : data;
  computedChecksum = checksum(decryptedData);
  console.log('checksum after decryption', toHex(computedChecksum));

  if (storedChecksum !== computedChecksum) {
    console.error(`Checksum mismatch with the stored at offset ${toHex(OFFSETS.checksum)}`, toHex(storedChecksum));
    return null;
  } else {
    console.log("Checksum OK", toHex(computedChecksum));
  }

  const pokemon: PokemonData = {
    raw: data,
    decrypted: decryptedData,

    pid: read_u32_little_endian(decryptedData, OFFSETS.pid),
    otid: read_u32_little_endian(decryptedData, OFFSETS.otid),
    nickname: read_string_little_endian(decryptedData, OFFSETS.nickname, 10),
    language: read_u8_little_endian(decryptedData, OFFSETS.language),
    flags: [],
    otname: read_string_little_endian(decryptedData, OFFSETS.otname, 7),
    marking: [],
    checksum: read_u16_little_endian(decryptedData, OFFSETS.checksum),
    unused: null,
    data: [],
    status: read_u32_little_endian(decryptedData, OFFSETS.status),
    level: read_u8_little_endian(decryptedData, OFFSETS.level),
    mailId: read_u8_little_endian(decryptedData, OFFSETS.mailId),
    currentHP: read_u16_little_endian(decryptedData, OFFSETS.currentHP),
    totalHP: read_u16_little_endian(decryptedData, OFFSETS.totalHP),
    attack: read_u16_little_endian(decryptedData, OFFSETS.attack),
    defense: read_u16_little_endian(decryptedData, OFFSETS.defense),
    speed: read_u16_little_endian(decryptedData, OFFSETS.speed),
    spAttack: read_u16_little_endian(decryptedData, OFFSETS.spAttack),
    spDefense: read_u16_little_endian(decryptedData, OFFSETS.spAttack),
  }
  console.log("stored checksum", toHex(pokemon.checksum));
  return pokemon;
}