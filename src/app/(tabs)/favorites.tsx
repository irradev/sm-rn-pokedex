import PokemonMiniCard from "@/components/PokemonMiniCard";
import { useFavorites } from "@/hooks/useFavorites";
import { router } from "expo-router";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";

export default function FavoritesScreen() {
  const { favorites, loaded, loadError } = useFavorites();

  if (!loaded) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <FlatList
      data={favorites}
      keyExtractor={(item) => String(item.id)}
      numColumns={2}
      contentContainerStyle={favorites.length === 0 ? styles.emptyList : styles.grid}
      columnWrapperStyle={favorites.length === 0 ? undefined : styles.row}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          {loadError ? (
            <Text style={styles.errorText}>{loadError}</Text>
          ) : (
            <>
              <Text style={styles.emptyTitle}>No favorites yet</Text>
              <Text style={styles.emptySubtitle}>Tap the heart on a Pokemon to add it here</Text>
            </>
          )}
        </View>
      }
      renderItem={({ item }) => (
        <PokemonMiniCard
          id={item.id}
          name={item.name}
          onPress={() => router.navigate(`/pokemon-detail-modal?id=${item.id}&isFavorite=true`)}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  grid: {
    padding: 8,
  },
  row: {
    gap: 0,
  },
  emptyList: {
    flex: 1,
    justifyContent: "center",
  },
  emptyContainer: {
    alignItems: "center",
    gap: 8,
    padding: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#6b7280",
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
  },
  errorText: {
    color: "#dc2626",
    fontSize: 16,
  },
});
