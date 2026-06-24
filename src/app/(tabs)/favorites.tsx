import { useFavorites } from "@/hooks/useFavorites";
import { useRouter } from "expo-router";
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function FavoritesScreen() {
  const router = useRouter();
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
      contentContainerStyle={favorites.length === 0 ? styles.emptyList : styles.list}
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
      renderItem={({ item }) => {
        const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${item.id}.png`;
        return (
          <TouchableOpacity
            style={styles.item}
            onPress={() => router.push(`/(tabs)/(pokedex)/${item.id}`)}
          >
            <Image source={{ uri: spriteUrl }} style={styles.sprite} />
            <Text style={styles.itemText}>#{String(item.id).padStart(4, "0")} - {item.name}</Text>
          </TouchableOpacity>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  list: {
    padding: 16,
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
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  sprite: {
    width: 50,
    height: 50,
  },
  itemText: {
    fontSize: 16,
    textTransform: "capitalize",
  },
  errorText: {
    color: "#dc2626",
    fontSize: 16,
  },
});