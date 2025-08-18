import { Routes, Route, Link } from "react-router-dom";
import PokemonList from "./pages/PokemonList";

function App() {
  return (
    <div>
      <nav style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
        <Link to="/" style={{ marginRight: "1rem" }}>Home</Link>
        <Link to="/pokemons">Pokémon List</Link>
      </nav>

      <Routes>
        <Route path="/" element={<h1>Welcome to my App</h1>} />
        <Route path="/pokemons" element={<PokemonList />} />
      </Routes>
    </div>
  //anon
  );
}

export default App;
