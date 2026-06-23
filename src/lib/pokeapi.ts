import { PokemonListResponse } from "@/types/pokemon-list.response";

const BASE_URL = "https://pokeapi.co/api/v2";

export async function fetchPokemonList(offset: number, limit = 30): Promise<PokemonListResponse> {
  const res = await fetch(`${BASE_URL}/pokemon?offset=${offset}&limit=${limit}`);
  return res.json();
}
