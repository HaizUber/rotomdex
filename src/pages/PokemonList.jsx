import { useEffect, useState } from "react";
import { typeColors } from "./pokemonTypeColors";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

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
        <div
        className="min-h-screen w-screen flex flex-col items-center p-4"
        style={{
          backgroundImage: "url('https://wallpapers.com/images/featured-full/pokemon-landscape-yf5odhgkds0n53yl.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
        >
        <div className="w-full flex flex-col items-center mb-8">
          <h1
            className="text-4xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-400 to-blue-600 drop-shadow-lg"
            style={{
              textShadow: "2px 2px 8px rgba(0,0,0,0.25)",
              letterSpacing: "2px",
            }}
          >
            Pokémon List
          </h1>
        <input
          type="text"
          placeholder="Search Pokémon..."
          className="mb-6 p-3 border-2 border-blue-400 rounded-xl w-80 bg-white/80 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-yellow-400 text-lg transition-all duration-200 shadow-md text-black"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setVisibleCount(20);
          }}
        />
          </div>

      {/* Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full max-w-6xl bg-white p-4 rounded-2xl shadow-md min-h-[600px] items-start justify-center">
        {visiblePokemons.map((pokemon) => {
          const details = pokemonDetails[pokemon.name];

          if (!details && !loading) {
            fetchDetails(pokemon.name, pokemon.url);
          }

          if (!details) {
            return (
              <motion.div
                key={pokemon.name}
                className="flex-shrink-0 m-4 relative overflow-hidden rounded-lg max-w-xs shadow-lg bg-gray-200 h-48"
                initial={{ opacity: 0.5, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
              >
                <motion.p
                  className="text-center mt-16"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                >
                  Loading {pokemon.name}...
                </motion.p>
              </motion.div>
            );
          }

          const mainType = details.types[0].type.name;
          const bgColor = typeColors[mainType] || "#6366f1";
          
          return (
            <motion.button
              key={details.id}
              onClick={() => navigate(`/pokemon/${details.name}`)}
              className="flex-shrink-0 m-4 relative overflow-hidden rounded-lg max-w-xs shadow-lg text-left focus:outline-none"
              style={{ backgroundColor: bgColor }}
              whileHover={{ scale: 1.07, boxShadow: "0px 8px 24px rgba(0,0,0,0.18)" }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 12 }}
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
            </motion.button>
          );
        })}
      </div>

      {loading && (
        <p className="mt-6 text-gray-600 font-medium">Loading more Pokémon...</p>
      )}
    </div>
  );
}
