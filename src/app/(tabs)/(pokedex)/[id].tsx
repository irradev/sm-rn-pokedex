import PokemonDetailContent from "@/components/PokemonDetailContent";
import PokemonDetailSkeleton from "@/components/PokemonDetailSkeleton";
import { fetchPokemonDetail } from "@/lib/pokeapi";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";

export default function PokemonDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["pokemon", id],
    queryFn: () => fetchPokemonDetail(Number(id)),
  });

  if (isLoading) {
    return <PokemonDetailSkeleton />;
  }

  if (isError || !data) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error?.message ?? "Failed to load Pokemon"}</Text>
        <Button title="Retry" onPress={() => refetch()} />
      </View>
    );
  }

  return <PokemonDetailContent data={data} onBack={() => router.back()} />;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    color: "#dc2626",
    fontSize: 16,
    marginBottom: 12,
  },
});
