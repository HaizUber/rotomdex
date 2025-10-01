import { useEffect, useState } from "react";
import { typeColors } from "./pokemonTypeColors";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import listbg1 from "/src/assets/BgImages/listbg1.jpg";

export default function PokemonList() {
  const [pokemonIndex, setPokemonIndex] = useState([]); 
  const [filteredIndex, setFilteredIndex] = useState([]);
  const [pokemonDetails, setPokemonDetails] = useState({});
  const [visibleCount, setVisibleCount] = useState(20);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedGeneration, setSelectedGeneration] = useState("");
  const generationApiIds = {
    "Generation I": 1,
    "Generation II": 2,
    "Generation III": 3,
    "Generation IV": 4,
    "Generation V": 5,
    "Generation VI": 6,
    "Generation VII": 7,
    "Generation VIII": 8,
    "Generation IX": 9,
  };
  const navigate = useNavigate();

  const generations = {
    "Generation I": { start: 1, end: 151 },
    "Generation II": { start: 152, end: 251 },
    "Generation III": { start: 252, end: 386 },
    "Generation IV": { start: 387, end: 493 },
    "Generation V": { start: 494, end: 649 },
    "Generation VI": { start: 650, end: 721 },
    "Generation VII": { start: 722, end: 809 },
    "Generation VIII": { start: 810, end: 905 },
    "Generation IX": { start: 906, end: 1010 },
  };
  
    const getGeneration = (id) => {
      for (const [genName, range] of Object.entries(generations)) {
        if (id >= range.start && id <= range.end) {
          return genName;
        }
      }
      return "Unknown Generation";
    };

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
    const fetchFilteredIndex = async () => {
      let filtered = pokemonIndex;
      // Generation filter
      if (selectedGeneration) {
        try {
          const genId = generationApiIds[selectedGeneration];
          const res = await fetch(`https://pokeapi.co/api/v2/generation/${genId}`);
          const data = await res.json();
          filtered = data.pokemon_species.map((p) => ({
            name: p.name,
            url: `https://pokeapi.co/api/v2/pokemon/${p.name}`,
          }));
        } catch (err) {
          console.error("Error fetching generation:", err);
        }
      }
      // Type filter
      if (selectedType) {
        try {
          const res = await fetch(`https://pokeapi.co/api/v2/type/${selectedType}`);
          const data = await res.json();
          const typeFiltered = data.pokemon.map((p) => ({
            name: p.pokemon.name,
            url: p.pokemon.url,
          }));
          if (selectedGeneration) {
            const typeSet = new Set(typeFiltered.map((p) => p.name));
            filtered = filtered.filter((p) => typeSet.has(p.name));
          } else {
            filtered = typeFiltered;
          }
        } catch (err) {
          console.error("Error fetching type:", err);
        }
      }
      // Search filter
      if (search) {
        filtered = filtered.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
      }
      setFilteredIndex(filtered);
      setVisibleCount(20);
    };
    if (pokemonIndex.length > 0) {
      fetchFilteredIndex();
    }
  }, [pokemonIndex, selectedType, selectedGeneration, search]);

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
  }, [loading, visibleCount, filteredIndex]);

  const loadMore = () => {
    if (loading) return;
    setLoading(true);
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + 20, filteredIndex.length));
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

  const visiblePokemons = filteredIndex.slice(0, visibleCount);

  useEffect(() => {
    // initial load fetch
    if (filteredIndex.length > 0 && visibleCount === 0) {
      setVisibleCount(20);
    }
  }, [filteredIndex, visibleCount]);

  return (
    <div
      className="min-h-screen w-screen flex flex-col items-center p-4"
      style={{
        backgroundImage: `url(${listbg1})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="w-full flex flex-col items-center mb-8">
        <div className=" p-6 rounded-2xl  w-full max-w-6xl mb-6">
          <h1
            className="text-5xl font-bold mb-6 text-white text-center"
            style={{
              textShadow: "0px 4px 12px rgba(255, 255, 255, 0.6)",
              letterSpacing: "1px",
            }}
          >
            Pokémon Explorer
          </h1>

          {/* Search Bar and Filters */}
          <div className="flex flex-wrap gap-4 justify-center items-center">
            <input
              type="text"
              placeholder="Search Pokémon..."
              className="p-3 border-2 border-white-400 rounded-xl w-full max-w-md bg-white/10 backdrop-blur-xs focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg transition-all duration-200 shadow-md text-white placeholder-gray-300"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setVisibleCount(20);
              }}
            />

            {/* Type Filter */}
            <select
              className="p-3 border-2 border-white-400 rounded-xl bg-white/10 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg shadow-md text-white placeholder-gray-300"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="">Filter by Type</option>
              {Object.keys(typeColors).map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>

            {/* Generation Filter */}
            <select
              className="p-3 border-2 border-white-400 rounded-xl bg-white/10 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg shadow-md text-white placeholder-gray-300"
              value={selectedGeneration}
              onChange={(e) => setSelectedGeneration(e.target.value)}
            >
              <option value="">Filter by Generation</option>
              {Object.keys(generations).map((gen) => (
                <option key={gen} value={gen}>
                  {gen}
                </option>
              ))}
            </select>
              {/* Clear All Filters Button */}
              <button
                className="p-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold shadow-md transition-all duration-200"
                onClick={() => {
                  setSearch("");
                  setSelectedType("");
                  setSelectedGeneration("");
                  setVisibleCount(20);
                }}
                type="button"
              >
                Clear All Filters
              </button>
          </div>
        </div>
      </div>

{/* Cards */}
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full max-w-6xl bg-white/5 backdrop-blur-xs p-4 rounded-2xl shadow-md min-h-[600px] items-start justify-center">
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
          
            const generationName = getGeneration(details.id);

          return (
            <motion.button
              key={details.id}
              onClick={() => navigate(`/pokemon/${details.name}`)}
              className="flex-shrink-0 m-4 relative overflow-hidden rounded-lg max-w-xs shadow-lg text-left focus:outline-none"
              style={{ backgroundColor: bgColor }}
              whileHover={{ scale: 1.07, boxShadow: "0px 8px 24px rgba(0,0,0,0.18)" }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 80 }}
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
                  <span className="block text-xs opacity-80 mb-1">
                    {generationName}
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