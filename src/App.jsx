import { Routes, Route, Link } from "react-router-dom";
import PokemonList from "./pages/PokemonList";
import PokemonDetails from "./pages/PokemonDetails";

function App() {
  return (
<<<<<<< HEAD
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
=======
    <div>
      <nav style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
        <Link to="/" style={{ marginRight: "1rem" }}>Home</Link>
        <Link to="/pokemons">Pokémon List</Link>
      </nav>

      <Routes>
        <Route path="/" element={<h1>Welcome to my App</h1>} />
        <Route path="/pokemons" element={<PokemonList />} />
         <Route path="/pokemon/:name" element={<PokemonDetails />}/>
      </Routes>
>>>>>>> 75a564ba5640e7f4870b355d157756ce580ce924
    </div>
  </> 
  );
}

export default App;
