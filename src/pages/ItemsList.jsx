import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import bg from "../assets/Images/Backgrounds/itemlistbg2.jpg";
import ItemDetails from "./ItemDetails";

export default function ItemsList() {
  // index of all items (names + urls)
  const [itemIndex, setItemIndex] = useState([]);
  // cache of fetched item details by name
  const [itemDetails, setItemDetails] = useState({});
  // how many cards are visible
  const [visibleCount, setVisibleCount] = useState(24);
  const [loading, setLoading] = useState(false); // used for initial + load more
  const [error, setError] = useState("");

  //search
  const [searchTerm, setSearchTerm] = useState("");
  // reset visible count when searching
  useEffect(() => {
    setVisibleCount(24);
  }, [searchTerm]);

  // fetch the full items index once
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    fetch("https://pokeapi.co/api/v2/item?limit=100000&offset=0", {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setItemIndex(data.results || []))
      .catch((err) => {
        if (err.name !== "AbortError") setError(err.message);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  //selected item for details view
  const [selectedItem, setSelectedItem] = useState(null);
  const handleCloseDetails = () => setSelectedItem(null);

  //Fetch details
  const fetchItemDetails = async (name, url) => {
    let details = itemDetails[name];
    if (!details) {
      details = await fetchDetails(name, url);
    }
    if (details) {
      setSelectedItem(details);
    }
  };

  // infinite scroll listener
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
  }, [loading, visibleCount, itemIndex]);

  const loadMore = () => {
    if (loading) return;
    setLoading(true);
    // small delay for UX consistency
    setTimeout(() => {
      setVisibleCount((prev) => prev + 20);
      setLoading(false);
    }, 300);
  };

  const fetchDetails = async (name, detailsUrl) => {
    if (itemDetails[name]) return itemDetails[name];
    try {
      const res = await fetch(detailsUrl);
      const data = await res.json();
      setItemDetails((prev) => ({ ...prev, [name]: data }));
      return data;
    } catch {
      // ignore
    }
  };

  // apply search filter (case-insensitive)
  const filteredIndex = (searchTerm || "").trim()
    ? itemIndex.filter((it) => it.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : itemIndex;

  const visibleItems = filteredIndex.slice(0, visibleCount);

  return (
    <div
      className="min-h-screen w-screen flex flex-col items-center p-4 pt-20"
      style={{
        backgroundImage:
          `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="w-full flex flex-col items-center mb-8">
        <h1
          className="pt-10 text-5xl font-bold mb-6 text-white text-center"
          style={{ textShadow: "2px 2px 8px rgba(0,0,0,0.25)", letterSpacing: "2px" }}
        >
          Items
        </h1>
        <div className="w-full max-w-6xl mb-6">
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search items..."
            className="p-3 border-2 border-white-400 rounded-xl w-full max-w-md bg-white/5 backdrop-blur-xs focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg transition-all duration-200 shadow-md text-white placeholder-gray-600"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full max-w-6xl bg-white/5 backdrop-blur-xs p-4 rounded-2xl shadow-md min-h-[600px] items-start justify-center">
        {visibleItems.map((item) => {
          const details = itemDetails[item.name];

          if (!details) {
            fetchDetails(item.name, item.url);
            return (
              <motion.div
                key ={item.name}
                onClick={() => fetchItemDetails(item.name, item.url)}
                whileHover={{ scale: 1.03, boxShadow: "0px 6px 20px rgba(0,0,0,0.15)" }}
                whileTap={{ scale: 0.97 }}
                className="flex-shrink-0 m-4 relative overflow-hidden rounded-lg max-w-xs shadow-lg bg-gray-200 h-48"
                initial={{ opacity: 0.5, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
                
              >
                <motion.p
                  className="text-center mt-16"
                >
                  Loading {item.name}...
                </motion.p>
              </motion.div>
            );
          }

          const sprite = details.sprites?.default;
          const cost = details.cost;
          const category = details.category?.name;

          return (

            <motion.button
              key={details.name}
              onClick={() => fetchItemDetails(details.name, item.url)}
              className="flex-shrink-0 m-4 relative overflow-hidden rounded-lg max-w-xs shadow-lg text-left bg-gradient-to-br from-slate-50 to-blue-50 border border-blue-100"
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
                style={{ transform: "scale(1.5)", opacity: 0.08 }}
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

              <div className="relative pt-10 px-10 flex items-center justify-center">
                <div
                  className="block absolute w-48 h-48 bottom-0 left-0 -mb-24 ml-3"
                  style={{
                    background: "radial-gradient(black, transparent 60%)",
                    transform: "rotate3d(0, 0, 1, 20deg) scale3d(1, 0.6, 1)",
                    opacity: 0.16,
                  }}
                />
                {sprite ? (
                  <img className="relative w-20 h-20 object-contain" src={sprite} alt={details.name} />
                ) : (
                  <div className="relative w-20 h-20 bg-gray-200 rounded" />
                )}
              </div>

              <div className="relative text-gray-800 px-6 pb-6 mt-6">
                <span className="block opacity-75 -mb-1 capitalize">
                  {category || "general"}
                </span>
                <div className="flex justify-between items-center">
                  <span className="block font-semibold text-xl capitalize">
                    {details.name}
                  </span>
                  <span className="block bg-white rounded-full text-xs font-bold px-3 py-2 leading-none flex items-center text-blue-600 border border-blue-200">
                    {Number.isFinite(cost) ? `${cost}₽` : "—"}
                  </span>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {loading && (
        <p className="mt-6 text-gray-700 font-medium bg-white/70 px-3 py-1 rounded">
          Loading items...
        </p>
      )}
      {error && (
        <p className="mt-4 text-red-600 font-semibold bg-white/80 px-3 py-1 rounded">
          Error: {error}
        </p>
      )}
      {selectedItem && (
        <ItemDetails item={selectedItem} onClose={handleCloseDetails} />
      )}
    </div>
  );
}

