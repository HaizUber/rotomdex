import { useEffect } from "react";
import { motion } from "framer-motion";
import { typeColors } from "./pokemonTypeColors";


export default function ItemDetails({ item, onClose }) {
  // item: full item details object from the PokéAPI
  if (!item) return null;

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    // prevent background scroll while modal open
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  const sprite = (item.sprites?.default || item.sprites?.default) ?? null;
  const cost = Number.isFinite(item.cost) ? item.cost : "—";
  const category = item.category?.name || "general";
  const attributes = (item.attributes || []).map((a) => a.name);
  const desc =
    item.effect_entries?.find((e) => e.language?.name === "en")?.short_effect ||
    item.flavor_text_entries?.find((f) => f.language?.name === "en")?.text ||
    "";

  const accent = typeColors[category] || "#64748b";

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => {
        // close when clicking backdrop
        if (e.target === e.currentTarget) onClose?.();
      }}
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      {/* backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.18 }}
        aria-hidden
      />

      {/* card */}
      <motion.div
        className="relative z-10 w-[min(92%,720px)] bg-white/95 rounded-2xl shadow-2xl p-6"
        initial={{ scale: 0.92, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 30 }}
        role="dialog"
        aria-modal="true"
        aria-label={`${item.name} details`}
      >
        {/* close */}
        <button
          onClick={() => onClose?.()}
          className="absolute top-3 right-3 rounded-full p-2 bg-blue-100 text-blue-800 transition-colors"
          title="Close"
        >
          ✕
        </button>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div
            className="flex-shrink-0 rounded-lg p-3"
            style={{
              background: `linear-gradient(180deg, ${accent}22 0%, ${accent}11 100%)`,
            }}
          >
            {sprite ? (
              <img src={sprite} alt={item.name} className="w-32 h-32 object-contain" />
            ) : (
              <div className="w-32 h-32 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                No image
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h2
              className="text-2xl font-bold capitalize mb-1"
              style={{ color: accent }}
            >
              {item.name}
            </h2>

            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="text-sm text-gray-600">Category</span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border" >
                {category}
              </span>

              <span className="text-sm  text-gray-600">Cost</span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border">
                {cost}₽
              </span>
            </div>

            {attributes.length > 0 && (
              <div className="mb-3">
                <div className="text-sm text-gray-600 mb-1">Attributes</div>
                <div className="flex flex-wrap gap-2">
                  {attributes.map((a) => (
                    <span
                      key={a}
                      className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-800 font-medium capitalize border"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {desc && (
              <p className="text-sm text-gray-700 leading-relaxed">
                {desc}
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

