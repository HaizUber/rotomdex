import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function PokemonDetails() {
  const { name } = useParams(); 
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        const data = await res.json();
        setPokemon(data);
      } catch (err) {
        console.error("Error fetching Pokémon:", err);
      }
    };
    fetchPokemon();
  }, [name]);

  if (!pokemon) {
    return <p className="text-center mt-10 text-gray-600">Loading {name}...</p>;
  }

  return (
    <div className="min-h-screen w-screen bg-slate-100 flex flex-col items-center p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        ← Back
      </button>

      <div className="bg-white shadow-md rounded-xl p-6 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold capitalize mb-4">{pokemon.name}</h1>
        <img
          src={pokemon.sprites.front_default}
          alt={pokemon.name}
          className="mx-auto w-40 mb-4"
        />
        <p className="text-gray-700">ID: #{pokemon.id}</p>
        <p className="text-gray-700">
          Types: {pokemon.types.map((t) => t.type.name).join(", ")}
        </p>
      </div>
    </div>
  );
}
