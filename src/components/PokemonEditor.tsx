import { useCallback, useMemo, useRef, useState } from 'react'
import { PokemonData } from '../models/PokemonData';
import HexEditor from "react-hex-editor";
import oneDarkPro from 'react-hex-editor/themes/oneDarkPro';
import PokemonRecords from './PokemonRecords';
import HexViewer from './HexViewer/HexViewer';
import { BytesSelection } from '../core/utils';

interface PokemonEditorProps {
  pokemon: PokemonData
}

const customTheme = { colorBackgroundInactiveSelection: "#5dadfc" };

function PokemonEditor({ pokemon }: PokemonEditorProps) {
  // `data` contains the bytes to show. It can also be `Uint8Array`!
  const data = useMemo(() => new Uint8Array(pokemon.raw), [pokemon]);
  const dataDecrypted = useMemo(() => new Uint8Array(pokemon.decrypted), [pokemon]);

  const [selection, setSelection] = useState<BytesSelection | undefined>(undefined);

  // If `data` is large, you probably want it to be mutable rather than cloning it over and over.
  // `nonce` can be used to update the editor when `data` is reference that does not change.
  const [nonce, setNonce] = useState(0);
  const [darkTheme, setDarkTheme] = useState(false);

  // The callback facilitates updates to the source data.
  const handleSetValue = useCallback(
    (offset: number, value: number) => {
      data[offset] = value;
      setNonce((v) => v + 1);
    },
    [data]
  );

  const hexEditorRef = useRef<typeof HexEditor>(null);

  return (
    <div className='flex-row flex-center gap'>
      <PokemonRecords
        pokemon={pokemon}
        onRecordClick={(offset, size) => {
          console.debug(offset, size);
          hexEditorRef.current?.setSelectionRange(offset, offset + size, null, false);
          setSelection({
            start: offset,
            end: offset + size,
          });
        }}
      />
      <div className='flex-col gap'>
        {/* <button onClick={() => setDarkTheme(!darkTheme)}>Toggle theme</button> */}

        <HexViewer
          buffer={pokemon.decrypted}
          uppercase
          selection={selection}
          onSelectionChange={setSelection}
        />

        <HexEditor
          ref={hexEditorRef}
          columns={0x10}
          rows={0x10}
          showAscii={false}
          showRowLabels={true}
          showColumnLabels={true}
          readOnly
          data={dataDecrypted}
          nonce={nonce}
          onSetValue={handleSetValue}
          theme={darkTheme ? { hexEditor: oneDarkPro } : { hexEditor: customTheme }}
        />
      </div>
    </div>
  );
}

export default PokemonEditor
