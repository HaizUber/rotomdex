import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { typeColors } from "./pokemonTypeColors";
import { motion, useAnimation } from "framer-motion";
import detailsbg from "../assets/Images/Backgrounds/detailsbg.jpg";

function BentoCard({ children, className, ...props }) {
  const ref = useRef(null);
  const controls = useAnimation();

  const handleMouseMove = (e) => {
    const card = ref.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    controls.start({
      x: x * 0.07,
      y: y * 0.07,
      rotateX: -y * 0.03,
      rotateY: x * 0.03,
      transition: { type: "spring", stiffness: 300, damping: 20 }
    });
  };

  const handleMouseLeave = () => {
    controls.start({
      x: 0,
      y: 0,
      rotateX: 0,
      rotateY: 0,
      transition: { type: "spring", stiffness: 200, damping: 30 }
    });
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      animate={controls}
      whileHover={{
        scale: 1.04,
        boxShadow: "0 8px 32px #6366f133",
        transition: { type: "spring", stiffness: 300, damping: 20 }
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export default function PokemonDetails() {
  const { name } = useParams();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState(null);
  const [species, setSpecies] = useState(null);
  const [evolutions, setEvolutions] = useState([]);
  const [moveSearch, setMoveSearch] = useState("");

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        const data = await res.json();
        setPokemon(data);

        if (data.cries && data.cries.latest) {
          const audio = new Audio(data.cries.latest);
          audio.volume = 0.03;
          audio.play().catch(() => {});
        }

        const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${name}`);
        const speciesData = await speciesRes.json();
        setSpecies(speciesData);

        const evoRes = await fetch(speciesData.evolution_chain.url);
        const evoData = await evoRes.json();
        const evoChain = [];
        let evo = evoData.chain;

        do {
          const evoDetails = evo['evolution_details'][0];
          evoChain.push({
            name: evo.species.name,
            min_level: evoDetails ? evoDetails.min_level : null,
            trigger: evoDetails ? evoDetails.trigger.name : null,
            item: evoDetails ? evoDetails.item : null,
          });
          evo = evo['evolves_to'][0];
        } while (evo && evo.hasOwnProperty('evolves_to'));

        const evoWithSprites = await Promise.all(
          evoChain.map(async (e) => {
            const pokeRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${e.name}`);
            const pokeData = await pokeRes.json();
            let itemSprite = null;
            if (e.item) {
              try {
                const itemRes = await fetch(`https://pokeapi.co/api/v2/item/${e.item.name}`);
                const itemData = await itemRes.json();
                itemSprite = itemData.sprites.default;
              } catch {}
            }
            return {
              ...e,
              sprite: pokeData.sprites.front_default,
              item: e.item
                ? { ...e.item, sprite: itemSprite }
                : null,
            };
          })
        );
        setEvolutions(evoWithSprites);
      } catch (err) {
        console.error("Error fetching Pokémon:", err);
      }
    };
    fetchPokemon();
  }, [name]);

  if (!pokemon || !species) {
    return (
      <motion.div
        className="min-h-screen w-screen flex flex-col items-center p-6"
        style={{
          backgroundImage: `url(${detailsbg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.p
          className="text-center text-xl text-blue-700 animate-pulse"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          Loading {name}...
        </motion.p>
      </motion.div>
    );
  }

  const flavor = species.flavor_text_entries.find(
    (entry) => entry.language.name === "en"
  )?.flavor_text.replace(/\f|\n|\r/g, " ");

  const artwork = pokemon.sprites.other["official-artwork"].front_default;

  const mainType = pokemon.types[0].type.name;
  const mainTypeColor = typeColors[mainType] || "#6366f1";

  // Bento card style
  const bentoCardClass = "bento-card bg-white/90 shadow-lg rounded-2xl p-6 border border-blue-100 flex flex-col justify-center items-center";

  const filteredMoves = pokemon.moves
    .slice()
    .sort((a, b) => a.move.name.localeCompare(b.move.name))
    .filter((move) =>
      move.move.name.toLowerCase().includes(moveSearch.toLowerCase())
    );

  const typeEffectiveness = {
    normal:    { strong: [], weak: ["fighting"] },
    fire:      { strong: ["grass", "ice", "bug", "steel"], weak: ["water", "ground", "rock"] },
    water:     { strong: ["fire", "ground", "rock"], weak: ["electric", "grass"] },
    electric:  { strong: ["water", "flying"], weak: ["ground"] },
    grass:     { strong: ["water", "ground", "rock"], weak: ["fire", "ice", "poison", "flying", "bug"] },
    ice:       { strong: ["grass", "ground", "flying", "dragon"], weak: ["fire", "fighting", "rock", "steel"] },
    fighting:  { strong: ["normal", "ice", "rock", "dark", "steel"], weak: ["flying", "psychic", "fairy"] },
    poison:    { strong: ["grass", "fairy"], weak: ["ground", "psychic"] },
    ground:    { strong: ["fire", "electric", "poison", "rock", "steel"], weak: ["water", "grass", "ice"] },
    flying:    { strong: ["grass", "fighting", "bug"], weak: ["electric", "ice", "rock"] },
    psychic:   { strong: ["fighting", "poison"], weak: ["bug", "ghost", "dark"] },
    bug:       { strong: ["grass", "psychic", "dark"], weak: ["fire", "flying", "rock"] },
    rock:      { strong: ["fire", "ice", "flying", "bug"], weak: ["water", "grass", "fighting", "ground", "steel"] },
    ghost:     { strong: ["psychic", "ghost"], weak: ["ghost", "dark"] },
    dragon:    { strong: ["dragon"], weak: ["ice", "dragon", "fairy"] },
    dark:      { strong: ["psychic", "ghost"], weak: ["fighting", "bug", "fairy"] },
    steel:     { strong: ["ice", "rock", "fairy"], weak: ["fire", "fighting", "ground"] },
    fairy:     { strong: ["fighting", "dragon", "dark"], weak: ["poison", "steel"] },
  };

  // For dual types, combine all strong/weak types and remove duplicates
  const allTypes = pokemon.types.map(t => t.type.name);
  const strongAgainst = [...new Set(allTypes.flatMap(type => typeEffectiveness[type]?.strong || []))];
  const weakAgainst = [...new Set(allTypes.flatMap(type => typeEffectiveness[type]?.weak || []))];

  return (
      <motion.div
        className="min-h-screen w-screen flex flex-col items-center p-6"
        style={{
          backgroundImage: `url(${detailsbg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
      <motion.button
        onClick={() => navigate(-1)}
        className="mb-6 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-500 text-white rounded-full shadow-lg hover:scale-105 transition-transform"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
      >
        ← Back
      </motion.button>

      {/* Bento grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl w-full">
        <BentoCard
          className={bentoCardClass + " col-span-1"}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.img
            src={artwork}
            alt={pokemon.name}
            className="mx-auto w-40 h-40 mb-2 rounded-2xl bg-gradient-to-br from-slate-100 to-blue-100 shadow-lg border-4 border-blue-200 cursor-pointer"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            onClick={() => {
              if (pokemon.cries && pokemon.cries.latest) {
                const audio = new Audio(pokemon.cries.latest);
                audio.volume = 0.03;
                audio.play().catch(() => {});
              }
            }}
            title="Play Pokémon Cry"
          />
          <motion.h1
            className="text-3xl font-extrabold capitalize mb-2 tracking-wide"
            style={{
              color: mainTypeColor,
              textShadow: "1px 2px 8px #6366f133",
            }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {pokemon.name}
          </motion.h1>
          <motion.span
            className="text-gray-500 font-mono text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            #{pokemon.id.toString().padStart(3, "0")}
          </motion.span>
        </BentoCard>

        {/* Description */}
        <BentoCard
          className={bentoCardClass + " col-span-1"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2 className="text-lg font-semibold mb-2 text-blue-800">Description</h2>
          <p className="italic text-gray-700">{flavor}</p>
        </BentoCard>

        {/* Types */}
        <BentoCard
          className={bentoCardClass + " col-span-1"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <h2 className="text-lg font-semibold mb-2 text-indigo-800">Types</h2>
          <div className="flex flex-wrap justify-center gap-2">
            {pokemon.types.map((t) => (
              <motion.span
                key={t.type.name}
                className="inline-block rounded-full px-3 py-1 font-bold shadow text-xs"
                style={{
                  backgroundColor: typeColors[t.type.name] || "#6366f1",
                  color: "#fff",
                  border: "2px solid #fff",
                  textShadow: "0 1px 4px #0002",
                }}
                whileHover={{ scale: 1.1 }}
              >
                {t.type.name}
              </motion.span>
            ))}
          </div>
        </BentoCard>

        {/* Height & Weight */}
        <BentoCard
          className={bentoCardClass + " col-span-1"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <h2 className="text-lg font-semibold mb-2 text-blue-800">Size</h2>
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="bg-blue-50 rounded-lg p-2 text-gray-700 font-semibold flex flex-col items-center">
              Height
              <div className="text-xl font-bold">{pokemon.height / 10} m</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-2 text-gray-700 font-semibold flex flex-col items-center">
              Weight
              <div className="text-xl font-bold">{pokemon.weight / 10} kg</div>
            </div>
          </div>
        </BentoCard>

        {/* Base Stats */}
        <BentoCard
          className={bentoCardClass + " col-span-2"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <h2 className="text-lg font-semibold mb-2 text-blue-800">Base Stats</h2>
          <div className="grid grid-cols-2 gap-2 w-full">
            {pokemon.stats.map((stat) => {
              const statColor = typeColors[mainType] || "#6366f1";
              const gradient = `linear-gradient(90deg, ${statColor}22 0%, ${statColor}99 100%)`;

              const statIcons = {
                hp: "💚",
                attack: "💥",
                defense: "🛡️",
                "special-attack": "✨",
                "special-defense": "🔮",
                speed: "💨",
              };
              const statKey = stat.stat.name;
              const statLabel = statKey.replace("special-", "Sp. ");
              const icon = statIcons[statKey] || "📊";

              return (
                <motion.div
                  key={statKey}
                  className="flex justify-between items-center rounded-lg px-3 py-2 font-medium"
                  style={{
                    background: gradient,
                    color: "#222",
                  }}
                  whileHover={{ scale: 1.04 }}
                >
                  <span className="capitalize flex items-center gap-2">
                    <span>{icon}</span>
                    <span>{statLabel}</span>
                  </span>
                  <span className="font-bold" style={{ color: statColor }}>{stat.base_stat}</span>
                </motion.div>
              );
            })}
          </div>
        </BentoCard>

        {/* Type Effectiveness */}
        <BentoCard
          className={bentoCardClass + " col-span-2"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.0 }}
        >
          <h2 className="text-lg font-semibold mb-2 text-indigo-800">Type Effectiveness</h2>
          <div className="flex flex-col md:flex-row gap-4 w-full justify-center items-start">
            {/* Strong Against */}
            <div className="flex-1">
              <div className="font-semibold text-green-700 mb-1">Strong Against:</div>
              <div className="flex flex-wrap gap-2">
                {strongAgainst.length > 0 ? (
                  strongAgainst.map(type => (
                    <span
                      key={type}
                      className="inline-block rounded-full px-3 py-1 text-xs font-bold"
                      style={{
                        backgroundColor: typeColors[type] || "#6366f1",
                        color: "#fff",
                        border: "1px solid #fff",
                        textShadow: "0 1px 4px #0002",
                      }}
                    >
                      {type}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 text-xs">None</span>
                )}
              </div>
            </div>
            {/* Weak Against */}
            <div className="flex-1">
              <div className="font-semibold text-red-700 mb-1">Weak Against:</div>
              <div className="flex flex-wrap gap-2">
                {weakAgainst.length > 0 ? (
                  weakAgainst.map(type => (
                    <span
                      key={type}
                      className="inline-block rounded-full px-3 py-1 text-xs font-bold"
                      style={{
                        backgroundColor: typeColors[type] || "#6366f1",
                        color: "#fff",
                        border: "1px solid #fff",
                        textShadow: "0 1px 4px #0002",
                      }}
                    >
                      {type}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 text-xs">None</span>
                )}
              </div>
            </div>
          </div>
        </BentoCard>

        {/* Moves */}
        <BentoCard
          className={bentoCardClass + " col-span-2 relative"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.0 }}
        >
          <div className="flex justify-between items-center w-full mb-2">
            <h2 className="text-lg font-semibold text-green-800">Moves</h2>
            <input
              type="text"
              placeholder="Search move..."
              value={moveSearch}
              onChange={e => setMoveSearch(e.target.value)}
              className="rounded-full px-4 py-1 bg-white/80 text-green-800 text-sm shadow focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-200 placeholder-green-400 border border-green-200"
              style={{ minWidth: 120 }}
            />
          </div>
          <div
            className="flex flex-wrap justify-center gap-2 max-h-48 overflow-y-auto"
            style={{ scrollbarWidth: "thin" }}
          >
            {filteredMoves.length > 0 ? (
              filteredMoves.map((move) => (
                <motion.span
                  key={move.move.name}
                  className="bg-green-100 text-green-800 rounded-full px-3 py-1 text-xs capitalize font-semibold shadow"
                  whileHover={{ scale: 1.1 }}
                >
                  {move.move.name}
                </motion.span>
              ))
            ) : (
              <span className="text-gray-400 italic">No moves found.</span>
            )}
          </div>
        </BentoCard>

        {/* Evolution Chain */}
        <BentoCard
          className={bentoCardClass + " col-span-2"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.1 }}
        >
          <h2 className="text-lg font-semibold mb-2 text-indigo-800">Evolution Chain</h2>
          <div>
            <h2 className="sr-only">Steps</h2>
            <ol className="grid grid-cols-1 divide-x divide-gray-100 overflow-hidden rounded-lg border border-gray-100 text-sm text-gray-500 sm:grid-cols-3">
              {evolutions.map((evo, idx) => (
                <li
                  key={evo.name}
                  className={`flex flex-col items-center justify-center gap-2 p-4 relative bg-white`}
                >
                  {idx > 0 && (
                    <span
                      className="absolute top-1/2 -left-2 hidden size-4 -translate-y-1/2 rotate-45 border border-gray-100 sm:block ltr:border-s-0 ltr:border-b-0 ltr:bg-white rtl:border-e-0 rtl:border-t-0 rtl:bg-white"
                    ></span>
                  )}
                  {idx < evolutions.length - 1 && (
                    <span
                      className="absolute top-1/2 -right-2 hidden size-4 -translate-y-1/2 rotate-45 border border-gray-100 sm:block ltr:border-s-0 ltr:border-b-0 ltr:bg-white rtl:border-e-0 rtl:border-t-0 rtl:bg-white"
                    ></span>
                  )}

                  <img
                    src={evo.sprite}
                    alt={evo.name}
                    className="w-16 h-16 rounded-full border-2 border-blue-200 bg-blue-50 cursor-pointer hover:scale-110 transition-transform"
                    onClick={() => navigate(`/pokemon/${evo.name}`)}
                    title={`Go to ${evo.name}`}
                  />
                  <p className="leading-none text-center">
                    <strong className="block font-medium capitalize text-gray-800">{evo.name}</strong>
                    {idx > 0 && (
                      <small className="mt-1 block text-xs text-blue-600">
                        {evo.min_level
                          ? `Evolves at Lv. ${evo.min_level}`
                          : evo.trigger === "use-item" && evo.item
                          ? `Use ${evo.item.name.replace(/-/g, " ")}`
                          : evo.trigger
                          ? `Trigger: ${evo.trigger.replace(/-/g, " ")}`
                          : ""}
                      </small>
                    )}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </BentoCard>
      </div>
    </motion.div>
  );
}