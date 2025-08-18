import { getPokemonByName } from "../services/pokeapi.js";

export default async function handler(req, res) {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ error: "Name parameter is required" });
  }

  try {
    const data = await getPokemonByName(name);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(404).json({ error: "Pokémon not found" });
  }
}
