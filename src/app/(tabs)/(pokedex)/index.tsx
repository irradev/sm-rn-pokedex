import { fetchPokemonList } from "@/lib/pokeapi";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const LIMIT = 30;

export default function PokedexScreen() {
  const router = useRouter();

  const { data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } = useInfiniteQuery({
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

  const pokemon = data?.pages.flatMap((page) => page.results) ?? [];

  return (
    <FlatList
      data={pokemon}
      keyExtractor={(item) => item.name}
      contentContainerStyle={styles.list}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) fetchNextPage();
      }}
      onEndReachedThreshold={0.5}
      ListFooterComponent={isFetchingNextPage ? <ActivityIndicator style={styles.footer} /> : null}
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
});
