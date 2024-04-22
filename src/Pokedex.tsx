import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Pokemon {
  name: string;
  url: string;
  type: string;
}

const pokemonTypeColors = {
  normal: '#E0E0E0',
  fire: '#FFC1C1',
  water: '#C1D4FF',
  electric: '#FFFA85',
  grass: '#C1FFC1',
  ice: '#C1EFFF',
  fighting: '#F9C1C1',
  poison: '#D7C1FF',
  ground: '#EFD4C1',
  flying: '#D4D7FF',
  psychic: '#FFC1EA',
  bug: '#D4FFC1',
  rock: '#D7D7D7',
  ghost: '#C1C7FF',
  dragon: '#C1BFFF',
  dark: '#C1C1C1',
  steel: '#D7D7D7',
  fairy: '#FFC1E6',
};

const Pokedex: React.FC = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [next, setNext] = useState<string | null>(null);
  const [previous, setPrevious] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([]);

  useEffect(() => {
    fetchPokemons('https://pokeapi.co/api/v2/pokemon?limit=999');
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = pokemons.filter((pokemon) =>
        pokemon.name.toLowerCase().startsWith(searchTerm.toLowerCase())
      );
      setFilteredPokemon(filtered);
    } else {
      setFilteredPokemon(pokemons);
    }
  }, [searchTerm, pokemons]);

  const fetchPokemons = async (url: string) => {
    const response = await axios.get(url);
    const pokemonData = await Promise.all(
      response.data.results.map(async (pokemon: any) => {
        const pokemonResponse = await axios.get(pokemon.url);
        return {
          name: pokemon.name,
          url: pokemon.url,
          type: pokemonResponse.data.types[0].type.name,
        };
      })
    );
    setPokemons(pokemonData);
    setNext(response.data.next);
    setPrevious(response.data.previous);
  };

  const getPokemonId = (pokemonUrl: string) => {
    const parts = pokemonUrl.split('/');
    return parts[parts.length - 2];
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="pokedex-container">
      <h1>Pokédex</h1>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Search Pokémon..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {/* Pokémon Grid */}
      <div className="pokemon-grid">
        {filteredPokemon.map((pokemon) => {
          const id = getPokemonId(pokemon.url);
          const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
          const pokemonColor = pokemonTypeColors[pokemon.type as keyof typeof pokemonTypeColors];

          return (
            <div key={pokemon.name} className="pokemon-card" style={{ backgroundColor: pokemonColor }}>
              <Link to={`/pokemon/${pokemon.name}`}>
                <img src={imageUrl} alt={pokemon.name} />
                <p>#{id} {pokemon.name}</p>
              </Link>
            </div>
          );
        })}
      </div>

  {/* Pagination */}
  <div className="pagination">
  {previous && (
    <button className="navigation-buttons" onClick={() => fetchPokemons(previous)}>Previous</button>
  )}
  {next && <button className="navigation-buttons" onClick={() => fetchPokemons(next)}>Next</button>}
</div>
    </div>
  );
};

export default Pokedex;


export {};
