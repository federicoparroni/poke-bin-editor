import { useCallback, useState } from 'react'
import pokeballIcon from '/pokeball.svg'
import './App.css'
import { POKEMON_DATA_SIZE } from './models/PokemonData';
import PokemonList from './components/PokemonList';

function App() {
  const [data, setData] = useState<ArrayBuffer[] | undefined>();
  const [errorMsg, setErrorMsg] = useState<string | undefined>();

  const onFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    if(event.target.files) {
      const file = event.target.files[0];
      const data = await file.arrayBuffer();
      
      if(data.byteLength % POKEMON_DATA_SIZE !== 0) {
        setErrorMsg(`Invalid file size: must be a multiple of ${POKEMON_DATA_SIZE} bytes`);
        return;
      }
      setErrorMsg(undefined);

      const pokemons: ArrayBuffer[] = [];
      for (let index = 0; index < data.byteLength; index += POKEMON_DATA_SIZE) {
        pokemons.push(data.slice(index, index + POKEMON_DATA_SIZE));
      }

      setData(pokemons);
    }
  }, [])

  return (
    <>
      <div>
        <img src={pokeballIcon} className="logo" alt="Vite logo" />
      </div>
      <h1>Pokèmon Gen 3 binary editor</h1>
      <a href="https://bulbapedia.bulbagarden.net/wiki/Pok%C3%A9mon_data_structure_(Generation_III)">
        https://bulbapedia.bulbagarden.net/wiki/Pok%C3%A9mon_data_structure_(Generation_III)
      </a>
      <div className="card">
        <input type='file' onChange={onFileUpload} />

        {/* <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button> */}
        {!errorMsg && !data && <p>Upload a binary file (100 bytes per pokemon)</p>}
        {errorMsg && <p className="error">{errorMsg}</p>}

      </div>
      <div className='card'>
        {data && <PokemonList pokemonsData={data} />}
      </div>
    </>
  )
}

export default App
