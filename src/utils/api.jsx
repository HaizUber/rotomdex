const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchPokemon = async (name) => {
  const res = await fetch(`${API_BASE_URL}/pokemon/${name.toLowerCase()}`);

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
};
