import { STAT_LABELS } from "@/constants/pokemon";
import { fetchPokemonDetail } from "@/lib/pokeapi";
import { TYPE_COLORS } from "@/themes/colors";
import { useQuery } from "@tanstack/react-query";
import { useGlobalSearchParams } from "expo-router";
import { ActivityIndicator, Button, ScrollView, StyleSheet, Text, View } from "react-native";

export default function StatsModal() {
  const { id } = useGlobalSearchParams<{ id: string }>();

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

  const primaryColor = TYPE_COLORS[data.types[0]?.type.name] ?? "#999";
  const maxStat = Math.max(...data.stats.map((s) => s.base_stat), 100);
  const totalStats = data.stats.reduce((sum, s) => sum + s.base_stat, 0);
  const hiddenAbility = data.abilities.find((a) => a.is_hidden);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={[styles.header, { backgroundColor: primaryColor + "15" }]}>
        <Text style={[styles.headerTitle, { color: primaryColor }]}>Advanced Stats</Text>
        <Text style={styles.headerSubtitle}>{data.name}</Text>
      </View>

      <View style={styles.grid}>
        {data.stats.map((stat) => {
          const pct = (stat.base_stat / maxStat) * 100;
          return (
            <View key={stat.stat.name} style={styles.statCard}>
              <Text style={[styles.statCardValue, { color: primaryColor }]}>{stat.base_stat}</Text>
              <Text style={styles.statCardLabel}>{STAT_LABELS[stat.stat.name] ?? stat.stat.name}</Text>
              <View style={styles.statCardBar}>
                <View style={[styles.statCardFill, { width: `${pct}%`, backgroundColor: primaryColor + "60" }]} />
              </View>
            </View>
          );
        })}
      </View>

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={[styles.totalValue, { color: primaryColor }]}>{totalStats}</Text>
      </View>

      <View style={styles.metricsSection}>
        <MetricBox label="Base Experience" value={`${data.base_experience}`} />
        <MetricBox label="Height" value={`${data.height / 10} m`} />
        <MetricBox label="Weight" value={`${data.weight / 10} kg`} />
      </View>

      {hiddenAbility && (
        <View style={styles.hiddenSection}>
          <Text style={styles.hiddenLabel}>Hidden Ability</Text>
          <View style={[styles.hiddenBadge, { backgroundColor: primaryColor + "20" }]}>
            <Text style={[styles.hiddenText, { color: primaryColor }]}>{hiddenAbility.ability.name}</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

function MetricBox({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metricBox}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    paddingBottom: 40,
  },
  header: {
    padding: 24,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
  },
  headerSubtitle: {
    fontSize: 15,
    color: "#666",
    textTransform: "capitalize",
    marginTop: 4,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 16,
    gap: 12,
  },
  statCard: {
    width: "30%",
    flexGrow: 1,
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 12,
  },
  statCardValue: {
    fontSize: 24,
    fontWeight: "800",
  },
  statCardLabel: {
    fontSize: 11,
    color: "#888",
    fontWeight: "600",
    marginTop: 2,
  },
  statCardBar: {
    width: "100%",
    height: 4,
    backgroundColor: "#e5e7eb",
    borderRadius: 2,
    marginTop: 8,
    overflow: "hidden",
  },
  statCardFill: {
    height: "100%",
    borderRadius: 2,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 28,
    paddingVertical: 12,
    backgroundColor: "#f5f5f5",
    marginHorizontal: 16,
    borderRadius: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "800",
  },
  metricsSection: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginTop: 20,
    paddingHorizontal: 16,
  },
  metricBox: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 12,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#333",
  },
  metricLabel: {
    fontSize: 11,
    color: "#888",
    fontWeight: "600",
    marginTop: 4,
    textAlign: "center",
  },
  hiddenSection: {
    alignItems: "center",
    marginTop: 24,
  },
  hiddenLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#666",
    marginBottom: 8,
  },
  hiddenBadge: {
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 20,
  },
  hiddenText: {
    fontSize: 14,
    fontWeight: "700",
    textTransform: "capitalize",
  },
});
