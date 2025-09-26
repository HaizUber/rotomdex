import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ItemsList() {
  // index of all items (names + urls)
  const [itemIndex, setItemIndex] = useState([]);
  // cache of fetched item details by name
  const [itemDetails, setItemDetails] = useState({});
  // how many cards are visible
  const [visibleCount, setVisibleCount] = useState(24);
  const [loading, setLoading] = useState(false); // used for initial + load more
  const [error, setError] = useState("");

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

  const visibleItems = itemIndex.slice(0, visibleCount);

  return (
    <div
      className="min-h-screen w-screen flex flex-col items-center p-4"
      style={{
        backgroundImage:
          "url('https://wallpapers.com/images/featured-full/pokemon-landscape-yf5odhgkds0n53yl.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="w-full flex flex-col items-center mb-8">
        <h1
          className="text-4xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-400 to-blue-600 drop-shadow-lg"
          style={{ textShadow: "2px 2px 8px rgba(0,0,0,0.25)", letterSpacing: "2px" }}
        >
          Items
        </h1>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full max-w-6xl bg-white p-4 rounded-2xl shadow-md min-h-[600px] items-start justify-center">
        {visibleItems.map((item) => {
          const details = itemDetails[item.name];

          if (!details) {
            // kick off detail fetch lazily
            fetchDetails(item.name, item.url);
            return (
              <motion.div
                key={item.name}
                className="flex-shrink-0 m-4 relative overflow-hidden rounded-lg max-w-xs shadow-lg bg-gray-200 h-48"
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
            <motion.div
              key={details.name}
              className="flex-shrink-0 m-4 relative overflow-hidden rounded-lg max-w-xs shadow-lg text-left bg-gradient-to-br from-slate-50 to-blue-50 border border-blue-100"
              whileHover={{ scale: 1.07, boxShadow: "0px 8px 24px rgba(0,0,0,0.18)" }}
              whileTap={{ scale: 0.97 }}
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
            </motion.div>
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
    </div>
  );
}

