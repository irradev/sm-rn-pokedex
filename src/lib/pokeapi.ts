import { PokemonListResponse } from "@/types/pokemon-list.response";
import { PokemonDetailResponse } from "@/types/pokemon-detail.response";

const BASE_URL = "https://pokeapi.co/api/v2";

export async function fetchPokemonList(offset: number, limit = 30): Promise<PokemonListResponse> {
  const res = await fetch(`${BASE_URL}/pokemon?offset=${offset}&limit=${limit}`);
  return res.json();
}

export async function fetchPokemonDetail(id: number): Promise<PokemonDetailResponse> {
  const res = await fetch(`${BASE_URL}/pokemon/${id}`);
  return res.json();
}

export async function fetchPokemonByName(name: string): Promise<PokemonDetailResponse> {
  const res = await fetch(`${BASE_URL}/pokemon/${name}`);
  if (!res.ok) throw new Error(`Pokemon "${name}" not found`);
  return res.json();
}
