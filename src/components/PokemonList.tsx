import { useState } from 'react'
import { parsePokemonData } from '../core/core';
import PokemonEditor from './PokemonEditor';

interface PokemonListProps {
  pokemonsData: ArrayBuffer[]
}

function PokemonList(props: PokemonListProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>();

  const pokemons = props.pokemonsData.map(data => parsePokemonData(data));

  return (
    <div>
      <div className='flex-row gap'>
        {pokemons?.map((pokemon, index) => (
          <div
            key={index}
            className={`pokemon ${selectedIndex === index ? 'selected' : ''}`}
            style={{ display: "flex", flexDirection: "column" }}
            onClick={() => setSelectedIndex(index)}
          >
            {pokemon ?
              <>
                <p>{pokemon.nickname}</p>
              </>
              :
              <p>BAD EGG: checksum mismatch</p>
            }
          </div>
        ))}
      </div>

      {(selectedIndex !== undefined || pokemons.length === 1) &&
        <div>
          <PokemonEditor pokemon={pokemons[selectedIndex ?? 0]!} />
        </div>
      }
    </div>
  )
}

export default PokemonList
