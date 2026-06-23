export type PokemonType = {
  slot: number;
  type: {
    name: string;
  };
};

export type PokemonStat = {
  base_stat: number;
  stat: {
    name: string;
  };
};

export type PokemonAbility = {
  ability: {
    name: string;
  };
  is_hidden: boolean;
};

export type PokemonDetailResponse = {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  types: PokemonType[];
  stats: PokemonStat[];
  abilities: PokemonAbility[];
  sprites: {
    other: {
      "official-artwork": {
        front_default: string | null;
      };
    };
  };
};
