import { Routes, Route, Link } from "react-router-dom";
import PokemonList from "./pages/PokemonList";
import PokemonDetails from "./pages/PokemonDetails";
import ItemsList from "./pages/ItemsList";

function App() {
  return (
    <>
      <div>
        <nav style={{ padding: "1rem", borderBottom: "1px solid #ccc", marginRight: "1rem" }}>
          <Link to="/" style={{ marginRight: "1rem" }}>Home</Link>
          <Link to="/pokemons" style={{ marginRight: "1rem" }}>Pokémon List</Link>
          <Link to="/items">Items</Link>
        </nav>

        <Routes>
          <Route path="/" element={<h1>RotomDex</h1>} />
          <Route path="/pokemons" element={<PokemonList />} />
          <Route path="/items" element={<ItemsList />} />
          <Route path="/pokemon/:name" element={<PokemonDetails />} />
        </Routes>
      </div>
    </>
  );
}

export default App;