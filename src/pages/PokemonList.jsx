import { useEffect, useState } from "react";
import { typeColors } from "./pokemonTypeColors";
import { useNavigate } from "react-router-dom";

export default function PokemonList() {
  const [pokemonIndex, setPokemonIndex] = useState([]); 
  const [pokemonDetails, setPokemonDetails] = useState({}); 
  const [visibleCount, setVisibleCount] = useState(20); 
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchIndex = async () => {
      try {
        const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0");
        const data = await res.json();
        setPokemonIndex(data.results); 
      } catch (err) {
        console.error("Error fetching Pokémon index:", err);
      }
    };
    fetchIndex();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
        !loading
      ) {
        loadMore();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, visibleCount, pokemonIndex]);

  const loadMore = () => {
    if (loading) return;
    setLoading(true);

    setTimeout(() => {
      setVisibleCount((prev) => prev + 20);
      setLoading(false);
    }, 300);
  };

  const fetchDetails = async (name, url) => {
    if (pokemonDetails[name]) return pokemonDetails[name];
    try {
      const res = await fetch(url);
      const data = await res.json();
      setPokemonDetails((prev) => ({ ...prev, [name]: data }));
      return data;
    } catch (err) {
      console.error("Error fetching Pokémon details:", err);
    }
  };

  const filteredPokemons = pokemonIndex.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const visiblePokemons = filteredPokemons.slice(0, visibleCount);

  return (
    <div className="min-h-screen w-screen bg-slate-100 flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Pokémon List</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search Pokémon..."
        className="mb-6 p-2 border rounded-lg w-80"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setVisibleCount(20); 
        }}
      />

      {/* Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full max-w-6xl bg-white p-4 rounded-2xl shadow-md min-h-[600px] items-start justify-center">
        {visiblePokemons.map((pokemon) => {
          const details = pokemonDetails[pokemon.name];

          if (!details && !loading) {
            fetchDetails(pokemon.name, pokemon.url);
          }

          if (!details) {
            return (
              <div
                key={pokemon.name}
                className="flex-shrink-0 m-4 relative overflow-hidden rounded-lg max-w-xs shadow-lg bg-gray-200 animate-pulse h-48"
              >
                <p className="text-center mt-16">Loading {pokemon.name}...</p>
              </div>
            );
          }

          const mainType = details.types[0].type.name;
          const bgColor = typeColors[mainType] || "#6366f1";

          return (
            <button
              key={details.id}
              onClick={() => navigate(`/pokemon/${details.name}`)} 
              className="flex-shrink-0 m-4 relative overflow-hidden rounded-lg max-w-xs shadow-lg text-left transition transform hover:scale-105 focus:outline-none"
              style={{ backgroundColor: bgColor }}
            >
              <svg
                className="absolute bottom-0 left-0 mb-8"
                viewBox="0 0 375 283"
                fill="none"
                style={{ transform: "scale(1.5)", opacity: 0.1 }}
              >
                <rect
                  x="159.52"
                  y="175"
                  width="152"
                  height="152"
                  rx="8"
                  transform="rotate(-45 159.52 175)"
                  fill="white"
                />
                <rect
                  y="107.48"
                  width="152"
                  height="152"
                  rx="8"
                  transform="rotate(-45 0 107.48)"
                  fill="white"
                />
              </svg>

              {/* Image */}
              <div className="relative pt-10 px-10 flex items-center justify-center">
                <div
                  className="block absolute w-48 h-48 bottom-0 left-0 -mb-24 ml-3"
                  style={{
                    background: "radial-gradient(black, transparent 60%)",
                    transform: "rotate3d(0, 0, 1, 20deg) scale3d(1, 0.6, 1)",
                    opacity: 0.2,
                  }}
                ></div>
                <img
                  className="relative w-32"
                  src={details.sprites.front_default}
                  alt={details.name}
                />
              </div>

              {/* Info */}
              <div className="relative text-white px-6 pb-6 mt-6">
                <span className="block opacity-75 -mb-1">
                  {details.types.map((t) => t.type.name).join(", ")}
                </span>
                <div className="flex justify-between items-center">
                  <span className="block font-semibold text-xl capitalize">
                    {details.name}
                  </span>
                  <span
                    className="block bg-white rounded-full text-xs font-bold px-3 py-2 leading-none flex items-center"
                    style={{ color: bgColor }}
                  >
                    #{details.id}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {loading && (
        <p className="mt-6 text-gray-600 font-medium">Loading more Pokémon...</p>
      )}
    </div>
  );
}
