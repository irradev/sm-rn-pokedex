import { useFavorites } from "@/hooks/useFavorites";
import { fetchPokemonByName, fetchPokemonList } from "@/lib/pokeapi";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { ActivityIndicator, Button, FlatList, Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const LIMIT = 30;

export default function PokedexScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isFavorite } = useFavorites();
  const [pageError, setPageError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const { data, isLoading, isError, error, fetchNextPage, isFetchingNextPage, hasNextPage, refetch } = useInfiniteQuery({
    queryKey: ["pokemon-list"],
    queryFn: ({ pageParam }) => fetchPokemonList(pageParam, LIMIT),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (!lastPage.next) return undefined;
      const url = new URL(lastPage.next);
      return Number(url.searchParams.get("offset"));
    },
  });

  const pokemon = data?.pages.flatMap((page) => page.results) ?? [];
  const isSearching = search.trim().length > 0;

  const localFiltered = useMemo(() => {
    if (!isSearching) return [];
    const q = search.toLowerCase();
    return pokemon.filter((p) => p.name.toLowerCase().includes(q));
  }, [search, pokemon, isSearching]);

  const hasLocalResults = localFiltered.length > 0;

  const { data: directResult, isLoading: isDirectLoading, error: directError } = useQuery({
    queryKey: ["pokemon-direct-search", search.toLowerCase()],
    queryFn: () => fetchPokemonByName(search.toLowerCase()),
    enabled: isSearching && !hasLocalResults,
    retry: false,
    staleTime: Infinity,
  });

  const directSearchItems = useMemo(() => {
    if (!directResult) return [];
    return [{ name: directResult.name, url: `https://pokeapi.co/api/v2/pokemon/${directResult.id}/` }];
  }, [directResult]);

  const displayPokemon = isSearching
    ? (hasLocalResults ? localFiltered : directSearchItems)
    : pokemon;

  const isSearchLoading = isSearching && !hasLocalResults && isDirectLoading;
  const searchErrorMessage = isSearching && !hasLocalResults ? (directError?.message ?? null) : null;

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error?.message ?? "Failed to load Pokemon"}</Text>
        <Button title="Retry" onPress={() => refetch()} />
      </View>
    );
  }

  const handleLoadMore = async () => {
    setPageError(null);
    try {
      await fetchNextPage();
    } catch (e) {
      setPageError(e instanceof Error ? e.message : "Failed to load more");
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingBottom: insets.bottom }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 100}
    >
      <FlatList
        data={displayPokemon}
        keyExtractor={(item) => item.name}
        contentContainerStyle={styles.list}
        style={styles.listContainer}
        onEndReached={() => {
          if (!isSearching && hasNextPage && !isFetchingNextPage) handleLoadMore();
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isSearching ? null :
            isFetchingNextPage ? (
              <ActivityIndicator style={styles.footer} />
            ) : pageError ? (
              <View style={styles.footerError}>
                <Text style={styles.errorText}>{pageError}</Text>
                <Button title="Retry" onPress={handleLoadMore} />
              </View>
            ) : null
        }
        ListEmptyComponent={
          isSearching ? (
            isSearchLoading ? (
              <View style={styles.emptyContainer}>
                <ActivityIndicator />
              </View>
            ) : searchErrorMessage ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>{searchErrorMessage}</Text>
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No Pokemon found</Text>
              </View>
            )
          ) : null
        }
        renderItem={({ item }) => {
          const id = Number(item.url.split("/").filter(Boolean).at(-1));
          const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
          const favorite = isFavorite(id);
          return (
            <TouchableOpacity
              style={[
                  styles.item,
                  favorite ? styles.itemFavorite : null,
              ]}
              onPress={() => router.push(`/(tabs)/(pokedex)/${id}`)}
            >
              <Image source={{ uri: spriteUrl }} style={{ width: 50, height: 50 }} />
              <Text style={styles.itemText}>#{id} - {item.name}</Text>
              {favorite && <Ionicons name="star" size={18} color="#f59e0b" />}
            </TouchableOpacity>
          );
        }}
      />
      {searchErrorMessage && (
        <View style={styles.searchError}>
          <Text style={styles.errorText}>{searchErrorMessage}</Text>
        </View>
      )}
      <TextInput
        style={styles.searchInput}
        placeholder="Search Pokemon..."
        value={search}
        onChangeText={setSearch}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  errorText: {
    color: "#dc2626",
    fontSize: 16,
  },
  emptyContainer: {
    padding: 32,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#6b7280",
  },
  listContainer: {
    flex: 1,
  },
  list: {
    padding: 16,
    paddingBottom: 0,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  itemText: {
    fontSize: 16,
    textTransform: "capitalize",
  },
  itemFavorite: {
    backgroundColor: "#fef3c7",
    borderWidth: 1,
    borderColor: "#f59e0b",
    borderBottomWidth: 1,
    borderBottomColor: "#f59e0b",
    borderRadius: 8,
  },
  footer: {
    padding: 16,
  },
  footerError: {
    alignItems: "center",
    gap: 8,
    padding: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    margin: 16,
    marginBottom: 0,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  searchError: {
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
});
