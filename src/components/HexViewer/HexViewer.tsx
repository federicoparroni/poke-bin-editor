import { useMemo } from 'react'
import { BytesSelection, isInSelection, toHex } from '../../core/utils';
import './HexViewer.css';

const HEXVALUES = [
  "00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "0A", "0B", "0C", "0D", "0E", "0F"
];

interface HexViewerProps {
  buffer: ArrayBuffer
  uppercase?: boolean
  selection?: BytesSelection
  onSelectionChange?: (selection?: BytesSelection) => void
}

function HexViewer({ buffer, uppercase, selection, onSelectionChange }: HexViewerProps) {
  const data = useMemo(() => {
    const dwordsCount = Math.ceil(buffer.byteLength / 16);
    const dwordsArray: number[][] = [];
    for (let i = 0; i < dwordsCount; i++) {
      dwordsArray.push(Array.from(new Uint8Array(buffer.slice(i * 16, (i + 1) * 16))));
    }
    return dwordsArray;
  }, [buffer]);

  return (
    <table className={'hex-viewer' + (uppercase ? ' uppercase' : '')}>
      <thead>
        <tr>
          <th></th>
          {HEXVALUES.map(hexv =>
            <th key={hexv}>{hexv}</th>
          )}
        </tr>
      </thead>
      <tbody>
        {data.map((dword, dwordIndex) => (
          <tr key={dwordIndex}>
            <th>{toHex(dwordIndex * 16, false)}</th>
            {dword.map((byte, i) => (
              <td
                key={i}
                className={isInSelection(dwordIndex * 16 + i, selection) ? 'selected' : undefined}
                onMouseUp={() => onSelectionChange?.(undefined)}
              >
                {toHex(byte, false)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default HexViewer
