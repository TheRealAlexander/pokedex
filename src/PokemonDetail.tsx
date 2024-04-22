import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface Stat {
  base_stat: number;
  stat: {
    name: string;
  };
}

interface Ability {
  ability: {
    name: string;
  };
}

interface Type {
  type: {
    name: string;
  };
}

interface PokemonData {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: Type[];
  stats: Stat[];
  abilities: Ability[];
}

const PokemonDetail: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const [pokemon, setPokemon] = useState<PokemonData | null>(null);

  useEffect(() => {
    axios
      .get(`https://pokeapi.co/api/v2/pokemon/${name}`)
      .then((response) => setPokemon(response.data));
  }, [name]);

  if (!pokemon) return <p>Loading...</p>;

  return (
    <div className="pokemon-detail-container">
      <h1>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h1>
      <img
        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
        alt={pokemon.name}
        className="pokemon-image"
      />

      <div className="pokemon-info">
        <p>
          <strong>Height:</strong> {pokemon.height}
        </p>
        <p>
          <strong>Weight:</strong> {pokemon.weight}
        </p>
        <p>
          <strong>Types:</strong>{" "}
          {pokemon.types.map((t) => t.type.name).join(", ")}
        </p>

        <h2>Stats</h2>
        <ul>
          {pokemon.stats.map((s) => (
            <li key={s.stat.name}>
              <strong>{s.stat.name}:</strong> {s.base_stat}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PokemonDetail;
