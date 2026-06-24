import { STAT_LABELS } from "@/constants/pokemon";
import { useFavorites } from "@/hooks/useFavorites";
import { fetchPokemonDetail } from "@/lib/pokeapi";
import { TYPE_COLORS } from "@/themes/colors";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, Button, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function PokemonDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorites();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["pokemon", id],
    queryFn: () => fetchPokemonDetail(Number(id)),
  });

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error?.message ?? "Failed to load Pokemon"}</Text>
        <Button title="Retry" onPress={() => refetch()} />
      </View>
    );
  }

  const types = data.types.map((t) => t.type.name);
  const primaryColor = TYPE_COLORS[types[0]] ?? "#999";
  const favorite = isFavorite(data.id);

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container} contentContainerStyle={styles.content}>
      <View>
        <View style={[styles.imageWrapper, { backgroundColor: primaryColor + "90" }]}>
          <View style={styles.topRow}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }} >
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={28} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.id}>#{String(data.id).padStart(4, "0")}</Text>
            </View>

            <TouchableOpacity onPress={() => toggleFavorite({ id: data.id, name: data.name })}>
              <Ionicons name={favorite ? "heart" : "heart-outline"} size={28} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text style={styles.name}>{data.name}</Text>
          <Image
            source={{ uri: data.sprites.other["official-artwork"].front_default ?? undefined }}
            style={styles.image}
          />
        </View>


        <View style={styles.infoRow}>
          <InfoCard label="Height" value={`${data.height / 10} m`} />
          <InfoCard label="Weight" value={`${data.weight / 10} kg`} />
        </View>
      </View>

      <View style={styles.typesRow}>
        {types.map((type) => (
          <View key={type} style={[styles.typeBadge, { backgroundColor: TYPE_COLORS[type] ?? "#999" }]}>
            <Text style={styles.typeText}>{type}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Base Stats</Text>
      <View style={styles.statsSection}>
        {data.stats.map((stat) => (
          <StatRow key={stat.stat.name} label={STAT_LABELS[stat.stat.name] ?? stat.stat.name} value={stat.base_stat} color={primaryColor} />
        ))}
      </View>

      <Text style={styles.sectionTitle}>Abilities</Text>
      <View style={styles.abilitiesSection}>

        {data.abilities.filter((a) => !a.is_hidden).map((a) => a.ability.name).map((ability) => (
          <Text style={styles.abilityText} key={ability}>{ability}</Text>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.fancyButton, { backgroundColor: primaryColor }]}
        onPress={() => router.push(`/(tabs)/(pokedex)/stats-modal?id=${id}`)}
      >
        <Text style={styles.fancyButtonText}>Advanced Stats</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoCard}>
      <Text style={styles.infoValue}>{value}</Text>
      <Text style={styles.infoLabel}>{label}</Text>
    </View>
  );
}

function StatRow({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>{label}</Text>
      <View style={styles.statBarBg}>
        <View style={[styles.statBarFill, { width: `${Math.min(value, 100)}%`, backgroundColor: color }]} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    paddingBottom: 40,
  },
  imageWrapper: {
    alignItems: "center",
    paddingVertical: 55,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  image: {
    width: 240,
    height: 240,
  },
  id: {
    fontSize: 16,
    fontWeight: "400",
    color: "#fff",
    shadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
    // textAlign: "right",
    // position: "absolute",
    // top: 20,
    // right: 20,
    // width: '30%'
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // marginBottom: 8,
    width: "100%",
    // backgroundColor: "#ef4444",
    paddingHorizontal: 16,
  },
  name: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    textTransform: "capitalize",
    color: "#fff",
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  typesRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginTop: 42,
    marginBottom: 0,
  },
  typeBadge: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 20,
  },
  typeText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "center",
    gap: 16,
    marginTop: 24,
    paddingHorizontal: 16,
    position: 'absolute',
    bottom: -28,
    width: '80%',
  },
  abilityText: {
    alignItems: "center",
    fontSize: 12,
    fontWeight: "600",
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    textTransform: "capitalize",
  },
  infoCard: {
    flex: 1,
    gap: 2,
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: "#999",
    fontWeight: "600",
  },
  infoValue: {
    fontSize: 20,
    fontWeight: "700",
    textTransform: "capitalize",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 28,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  abilitiesSection: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 8,
  },
  statsSection: {
    paddingHorizontal: 16,
    gap: 8,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statLabel: {
    width: 64,
    fontSize: 13,
    fontWeight: "600",
    color: "#555",
  },
  statBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
    overflow: "hidden",
  },
  statBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  statValue: {
    width: 32,
    textAlign: "right",
    fontSize: 13,
    fontWeight: "700",
  },
  fancyButton: {
    marginHorizontal: 16,
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  fancyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  errorText: {
    color: "#dc2626",
    fontSize: 16,
    marginBottom: 12,
  },
});
