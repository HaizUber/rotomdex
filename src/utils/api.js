export const fetchPokemon = async (name) => {
  const res = await fetch(`/api/pokemon?name=${name}`);
  
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
};
