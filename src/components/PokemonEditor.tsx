import { useCallback, useMemo, useRef, useState } from 'react'
import { OFFSETS, PokemonData } from '../models/PokemonData';
import HexEditor from "react-hex-editor";
import oneDarkPro from 'react-hex-editor/themes/oneDarkPro';

interface PokemonEditorProps {
  pokemon: PokemonData
}

function PokemonEditor({pokemon}: PokemonEditorProps) {
  // `data` contains the bytes to show. It can also be `Uint8Array`!
  const data = useMemo(() => new Uint8Array(pokemon.raw), [pokemon]);
  const dataDecrypted = useMemo(() => new Uint8Array(pokemon.decrypted), [pokemon]);

  // If `data` is large, you probably want it to be mutable rather than cloning it over and over.
  // `nonce` can be used to update the editor when `data` is reference that does not change.
  const [nonce, setNonce] = useState(0);
  
  // The callback facilitates updates to the source data.
  const handleSetValue = useCallback(
    (offset: number, value: number) => {
      data[offset] = value;
      setNonce((v) => v + 1);
    },
    [data]
  );

  const hexEditorRef = useRef<typeof HexEditor>(null);

  const [darkTheme, setDarkTheme] = useState(false);

  return (
    <div style={{display: "flex", flexDirection: "column", gap: "1rem"}}>
      {/* <button onClick={() => setDarkTheme(!darkTheme)}>Toggle theme</button> */}
      <button onClick={() => hexEditorRef.current?.setSelectionRange(OFFSETS.checksum, OFFSETS.checksum + 2, null, true)}>Select checksum</button>
    <HexEditor
      ref={hexEditorRef}
      columns={0x10}
      rows={0x10}
      showAscii={true}
      showRowLabels={true}
      showColumnLabels={true}
      data={data}
      nonce={nonce}
      onSetValue={handleSetValue}
      theme={darkTheme ? { hexEditor: oneDarkPro } : undefined}
    />
    <HexEditor
      columns={0x10}
      rows={0x10}
      showAscii={true}
      showRowLabels={true}
      showColumnLabels={true}
      data={dataDecrypted}
      nonce={nonce}
      // onSetValue={handleSetValueDecrypted}
      theme={darkTheme ? { hexEditor: oneDarkPro } : undefined}
    />
    </div>
  );
}

export default PokemonEditor
