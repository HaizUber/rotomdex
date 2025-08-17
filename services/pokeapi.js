import axios from "axios";

export const getPokemonByName = async (name) => {
  const url = `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`;
  const response = await axios.get(url);
  return response.data;
};
