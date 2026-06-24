import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

const STORAGE_KEY = "pokedex-favorites";

export type FavoritePokemon = {
  id: number;
  name: string;
};

type FavoritesContextValue = {
  favorites: FavoritePokemon[];
  loaded: boolean;
  loadError: string | null;
  isFavorite: (id: number) => boolean;
  toggleFavorite: (pokemon: FavoritePokemon) => Promise<void>;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoritePokemon[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((json) => {
        if (json) {
          setFavorites(JSON.parse(json));
        }
        setLoaded(true);
      })
      .catch((e) => {
        setLoadError(e instanceof Error ? e.message : "Failed to load favorites");
        setLoaded(true);
      });
  }, []);

  const persist = useCallback(async (next: FavoritePokemon[]) => {
    setFavorites(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const isFavorite = useCallback(
    (id: number) => favorites.some((f) => f.id === id),
    [favorites],
  );

  const toggleFavorite = useCallback(
    async (pokemon: FavoritePokemon) => {
      const exists = favorites.some((f) => f.id === pokemon.id);
      if (exists) {
        await persist(favorites.filter((f) => f.id !== pokemon.id));
      } else {
        await persist([...favorites, pokemon]);
      }
    },
    [favorites, persist],
  );

  const value = useMemo(
    () => ({ favorites, loaded, loadError, isFavorite, toggleFavorite }),
    [favorites, loaded, loadError, isFavorite, toggleFavorite],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return ctx;
}
