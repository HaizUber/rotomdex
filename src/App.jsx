import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import PokemonList from "./pages/PokemonList";
import PokemonDetails from "./pages/PokemonDetails";
import ItemsList from "./pages/ItemsList";
import PillNav from "./blocks/Components/PillNav/PillNav";
import logo from "./assets/Images/Logo/rotom2.png"; 

function App() {
  const { pathname } = useLocation();
  const navClass = pathname === "/" ? "custom-nav centered" : "custom-nav";
  return (
    <>
      <div>
        <PillNav
        logo={logo}
        logoAlt="RotomDex"
        items={[
          { label: 'Home', href: '/' },
          { label: 'Pokemons', href: '/pokemons' },
          { label: 'Items', href: '/items' },
        ]}
        activeHref="/"
        className={navClass}
        ease="power2.easeOut"
        baseColor="#f0f0f0ff"
        pillColor="#e45b43ff"
        hoveredPillTextColor="#3da2ddff"
        pillTextColor="#424242ff"
      />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pokemons" element={<PokemonList />} />
          <Route path="/items" element={<ItemsList />} />
          <Route path="/pokemon/:name" element={<PokemonDetails />} />
        </Routes>
      </div>
    </>
  );
}

export default App;