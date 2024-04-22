import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Pokemon {
  name: string;
  url: string;
  type: string;
}

interface PokemonResult {
  name: string;
  url: string;
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
    fetchPokemons('https://pokeapi.co/api/v2/pokemon?limit=15');
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = pokemons.filter((pokemon) =>
        pokemon.name.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
        getPokemonId(pokemon.url) === searchTerm
      );
      setFilteredPokemon(filtered);
    } else {
      setFilteredPokemon(pokemons);
    }
  }, [searchTerm, pokemons]);

  const fetchPokemons = async (url: string) => {
    const response = await axios.get(url);
    const pokemonData = await Promise.all(
      response.data.results.map(async (pokemon: PokemonResult) => {
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

const handleSearchChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
  setSearchTerm(event.target.value);
  if (event.target.value.trim() !== '') {
    if (isNaN(Number(event.target.value))) {
      let offset = 0;
      let found = false;
      while (!found) {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=15`);
        const matchingPokemons = response.data.results.filter((pokemon: PokemonResult) => pokemon.name.includes(event.target.value));
        if (matchingPokemons.length > 0) {
          fetchPokemons(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=15`);
          found = true;
        } else if (response.data.next) {
          offset += 15;
        } else {
          break;
        }
      }
    } else {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${event.target.value}`);
      if (response.data) {
        setPokemons([{
          name: response.data.name,
          url: `https://pokeapi.co/api/v2/pokemon/${event.target.value}/`,
          type: response.data.types[0].type.name,
        }]);
      }
    }
  } else {
    fetchPokemons('https://pokeapi.co/api/v2/pokemon?limit=15');
  }
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
        {previous && !searchTerm && (
          <button className="navigation-buttons" onClick={() => fetchPokemons(previous)}>Previous</button>
        )}
        {next && !searchTerm && <button className="navigation-buttons" onClick={() => fetchPokemons(next)}>Next</button>}
      </div>
    </div>
  );
};

export default Pokedex;

export {};
