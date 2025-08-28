import { Routes, Route, Link } from "react-router-dom";
import PokemonList from "./pages/PokemonList";
import PokemonDetails from "./pages/PokemonDetails";

function App() {
  return (
    <>
      <audio id="backgroundMusic" loop autoPlay muted>
        <source src="assets/Music/BGM.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      <div>
        <nav style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
          <Link to="/" style={{ marginRight: "1rem" }}>Home</Link>
          <Link to="/pokemons">Pokémon List</Link>
        </nav>

        <Routes>
          <Route path="/" element={<h1>Welcome to my App</h1>} />
          <Route path="/pokemons" element={<PokemonList />} />
          <Route path="/pokemon/:name" element={<PokemonDetails />} />
        </Routes>
      </div>
    </>
  );
}

export default App;