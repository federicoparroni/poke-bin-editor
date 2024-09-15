import { useCallback, useState } from 'react'
import { OFFSETS, PokemonAttributes, PokemonData, SIZES } from '../models/PokemonData';
import { toHex } from '../core/utils';

interface PokemonRecordsProps {
  pokemon: PokemonData
  onRecordClick?: (offset: number, size: number) => void
}

const attributesToShow: PokemonAttributes[] = [
  "pid",
  "otid",
  "nickname",
  "language",
  "flags",
  "otname",
  // "marking",
  "checksum",
  // "data",
  "status",
  "level",
  "mailId",
  "currentHP",
  "totalHP",
  "attack",
  "defense",
  "speed",
  "spAttack",
  "spDefense",
];

function PokemonRecords({ pokemon, onRecordClick }: PokemonRecordsProps) {
  const [showHex, setShowHex] = useState(false);

  const handleClick = useCallback((attribute: PokemonAttributes) => {
    onRecordClick?.(OFFSETS[attribute], SIZES[attribute]);
  }, [pokemon]);

  return (
    <div className='flex-col gap'>
      <table>
        <thead>
          <tr>
            <th>Attr</th>
            <th>
              Value &nbsp;
              <a className='pointer' onClick={() => setShowHex(prev => !prev)}>
                {showHex ? "HEX" : "DEC"}
              </a>
            </th>
          </tr>
        </thead>
        <tbody>
          {attributesToShow.map(attribute =>
            <tr key={attribute}>
              <td className='pointer' onClick={() => handleClick(attribute)}>{attribute}</td>
              <td>
                <input
                  type="text"
                  value={showHex ? toHex(pokemon[attribute]) : pokemon[attribute]}
                  readOnly
                />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default PokemonRecords
