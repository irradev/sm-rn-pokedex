import PokemonDetailContent from "@/components/PokemonDetailContent";
import PokemonDetailSkeleton from "@/components/PokemonDetailSkeleton";
import { fetchPokemonDetail } from "@/lib/pokeapi";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Button, Pressable, StyleSheet, Text, View } from "react-native";

export default function PokemonDetailModal() {
  const { id, isFavorite } = useLocalSearchParams<{ id: string, isFavorite: string }>();
  const router = useRouter();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["pokemon", id],
    queryFn: () => fetchPokemonDetail(Number(id)),
  });

  const dismiss = () => router.back();

  return (
    <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={dismiss} />
      <View style={styles.container}>
        {isLoading ? (
          <PokemonDetailSkeleton />
        ) : isError || !data ? (
          <View style={styles.center}>
            <Text style={styles.errorText}>{error?.message ?? "Failed to load Pokemon"}</Text>
            <Button title="Retry" onPress={() => refetch()} />
          </View>
        ) : (
          <PokemonDetailContent 
            data={data}
            onBack={dismiss} 
            isOpensFromFavorite={isFavorite === "true"}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.27)",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  container: {
    width: "90%",
    height: "80%",
    backgroundColor: "#fff",
    borderRadius: 24,
    overflow: "hidden",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  errorText: {
    color: "#dc2626",
    fontSize: 16,
    marginBottom: 12,
  },
});
