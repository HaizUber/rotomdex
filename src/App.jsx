import { useState } from 'react'
import './App.css'

import { fetchPokemon } from "./utils/api";

export default function App() {
  const [pokemon, setPokemon] = useState(null);

  const handleClick = async () => {
    const data = await fetchPokemon("pikachu");
    setPokemon(data);
  };

  return (
  <>
    <audio id="backgroundMusic" loop autoPlay muted>
      <source src="assets/Music/BGM.mp3" type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>

    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Welcome to RotomDex</h1>
      <button
        onClick={handleClick}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        Fetch Pikachu
      </button>
      {pokemon && (
        <div className="mt-4 text-center">
          <p className="text-lg font-medium capitalize">{pokemon.name}</p>
          <img src={pokemon.sprites.front_default} alt={pokemon.name} />
        </div>
      )}
    </div>
  </> 
  );
}