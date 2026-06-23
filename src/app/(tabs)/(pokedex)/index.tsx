import { useState } from "react";
import { fetchPokemonList } from "@/lib/pokeapi";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { ActivityIndicator, Button, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const LIMIT = 30;

export default function PokedexScreen() {
  const router = useRouter();
  const [pageError, setPageError] = useState<string | null>(null);

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

  const pokemon = data?.pages.flatMap((page) => page.results) ?? [];

  const handleLoadMore = async () => {
    setPageError(null);
    try {
      await fetchNextPage();
    } catch (e) {
      setPageError(e instanceof Error ? e.message : "Failed to load more");
    }
  };

  return (
    <FlatList
      data={pokemon}
      keyExtractor={(item) => item.name}
      contentContainerStyle={styles.list}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) handleLoadMore();
      }}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isFetchingNextPage ? (
          <ActivityIndicator style={styles.footer} />
        ) : pageError ? (
          <View style={styles.footerError}>
            <Text style={styles.errorText}>{pageError}</Text>
            <Button title="Retry" onPress={handleLoadMore} />
          </View>
        ) : null
      }
      renderItem={({ item }) => {
        const id = item.url.split("/").filter(Boolean).at(-1);
        const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
        return (
          <TouchableOpacity
            style={styles.item}
            onPress={() => router.push(`/(tabs)/(pokedex)/${id}`)}
          >
            <Image source={{ uri: spriteUrl }} style={{ width: 50, height: 50 }} />
            <Text style={styles.itemText}>{item.name}</Text>
          </TouchableOpacity>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
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
  list: {
    padding: 16,
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
  footer: {
    padding: 16,
  },
  footerError: {
    alignItems: "center",
    gap: 8,
    padding: 16,
  },
});
