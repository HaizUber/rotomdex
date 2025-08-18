import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getPokemonByName = async (name) => {
  const url = `${API_BASE_URL}/pokemon/${name.toLowerCase()}`;
  const response = await axios.get(url);
  return response.data;
};
