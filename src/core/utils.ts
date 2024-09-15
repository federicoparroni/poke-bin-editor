function isLittleEndian() {
  const a8 = new Uint8Array(4);
  const a32 = new Uint32Array(a8.buffer)
  a32[0] = 0xFFAA3311;
  return a8[0] !== 0xff;
}

export const IS_LITTLE_ENDIAN = isLittleEndian();
console.log("little endian", IS_LITTLE_ENDIAN);

export interface BytesSelection {
  start: number
  end: number
}

export function isInSelection(value: number, selection?: BytesSelection): boolean {
  return selection ? isBetween(value, selection.start, selection.end) : false;
}

function isBetween(value: number, start: number, end: number): boolean {
  return start <= value && value < end;
}

export function toHex(arg: number | string, prefix = true): string {
  if (typeof arg === "string") return arg;
  const hexv = arg.toString(16).padStart(2, "0");
  return prefix ? `0x${hexv}` : hexv;
}
