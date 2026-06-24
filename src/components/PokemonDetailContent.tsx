import { STAT_LABELS } from "@/constants/pokemon";
import { useFavorites } from "@/hooks/useFavorites";
import { TYPE_COLORS } from "@/themes/colors";
import type { PokemonDetailResponse } from "@/types/pokemon-detail.response";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, FadeInDown, LinearTransition, ZoomIn, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from "react-native-reanimated";

type Props = {
  data: PokemonDetailResponse;
  isOpensFromFavorite?: boolean;
  onBack?: () => void;
};

export default function PokemonDetailContent({ data, onBack, isOpensFromFavorite }: Props) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const types = data.types.map((t) => t.type.name);
  const primaryColor = TYPE_COLORS[types[0]] ?? "#999";
  const favorite = isFavorite(data.id);

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scrollY.value * 0.3 }],
  }));

  const maxStat = Math.max(...data.stats.map((s) => s.base_stat), 100);
  const totalStats = data.stats.reduce((sum, s) => sum + s.base_stat, 0);
  const hiddenAbility = data.abilities.find((a) => a.is_hidden);

  return (
    <Animated.ScrollView
      showsVerticalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.content}
      onScroll={scrollHandler}
      scrollEventThrottle={16}
    >
      <Animated.View entering={FadeIn.duration(400)} style={headerStyle}>
        <View style={[styles.imageWrapper, {
          backgroundColor: primaryColor + "90",
        },
        isOpensFromFavorite ? { paddingTop: 18 } : null
        ]}>
          <View style={styles.topRow}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }} >
              {onBack && (
                <TouchableOpacity onPress={onBack}>
                  {
                    isOpensFromFavorite
                      ? <Ionicons name="close" size={28} color="#fff" />
                      : <Ionicons name="arrow-back" size={28} color="#fff" />
                  }
                </TouchableOpacity>
              )}
              <Text style={styles.id}>#{String(data.id).padStart(4, "0")}</Text>
            </View>

            <TouchableOpacity onPress={() => toggleFavorite({ id: data.id, name: data.name })}>
              <Ionicons name={favorite ? "heart" : "heart-outline"} size={28} color="#fff" />
            </TouchableOpacity>
          </View>

          <Animated.Text entering={FadeIn.delay(150).duration(300)} style={styles.name}>{data.name}</Animated.Text>
          <Animated.Image
            entering={ZoomIn.delay(300).duration(500).springify()}
            source={{ uri: data.sprites.other["official-artwork"].front_default ?? undefined }}
            style={styles.image}
          />
        </View>

        <Animated.View entering={FadeInDown.delay(200).duration(350)} style={styles.infoRow}>
          <InfoCard label="Height" value={`${data.height / 10} m`} />
          <InfoCard label="Weight" value={`${data.weight / 10} kg`} />
        </Animated.View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(350).duration(350)} style={styles.typesRow}>
        {types.map((type) => (
          <Animated.View key={type} entering={FadeIn.delay(400).duration(300)} style={[styles.typeBadge, { backgroundColor: TYPE_COLORS[type] ?? "#999" }]}>
            <Text style={styles.typeText}>{type}</Text>
          </Animated.View>
        ))}
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(500).duration(350)}>
        <View style={styles.wrapperStats}>
          <Text style={styles.sectionTitle}>Base Stats</Text>
          <View style={styles.statsSection}>
            {data.stats.map((stat, i) => (
              <Animated.View key={stat.stat.name} entering={FadeInDown.delay(550 + i * 50).duration(250)}>
                <StatRow label={STAT_LABELS[stat.stat.name] ?? stat.stat.name} value={stat.base_stat} color={primaryColor} />
              </Animated.View>
            ))}
          </View>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(800).duration(350)}>
        <Text style={styles.sectionTitle}>Abilities</Text>
        <View style={styles.abilitiesSection}>
          {data.abilities.filter((a) => !a.is_hidden).map((a) => a.ability.name).map((ability) => (
            <Animated.View key={ability} entering={FadeIn.delay(850).duration(300)} style={styles.abilityText}>
              <Text style={styles.abilityInnerText}>{ability}</Text>
            </Animated.View>
          ))}
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(950).duration(350)}>
        <TouchableOpacity
          style={[styles.fancyButton, { backgroundColor: primaryColor }]}
          onPress={() => setShowAdvanced((v) => !v)}
        >
          <Ionicons name={showAdvanced ? "chevron-up" : "chevron-down"} size={18} color="#fff" />
          <Text style={styles.fancyButtonText}>Advanced Stats</Text>
        </TouchableOpacity>
      </Animated.View>

      {showAdvanced && (
        <Animated.View entering={FadeInDown.duration(400)} layout={LinearTransition.springify()}>
          <View style={[styles.advancedHeader, { backgroundColor: primaryColor + "15" }]}>
            <Text style={[styles.advancedHeaderTitle, { color: primaryColor }]}>Detailed Stats</Text>
          </View>

          <View style={styles.advancedGrid}>
            {data.stats.map((stat) => {
              const pct = (stat.base_stat / maxStat) * 100;
              return (
                <View key={stat.stat.name} style={styles.advancedStatCard}>
                  <Text style={[styles.advancedStatValue, { color: primaryColor }]}>{stat.base_stat}</Text>
                  <Text style={styles.advancedStatLabel}>{STAT_LABELS[stat.stat.name] ?? stat.stat.name}</Text>
                  <View style={styles.advancedStatBar}>
                    <View style={[styles.advancedStatFill, { width: `${pct}%`, backgroundColor: primaryColor + "60" }]} />
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
        </Animated.View>
      )}
    </Animated.ScrollView>
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

function MetricBox({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metricBox}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
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
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
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
    position: "absolute",
    bottom: -28,
    width: "80%",
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
  wrapperStats: {
    marginTop: 14,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 14,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  abilitiesSection: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 8,
  },
  abilityText: {
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
  },
  abilityInnerText: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginHorizontal: 16,
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  fancyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  advancedHeader: {
    padding: 24,
    alignItems: "center",
    marginTop: 24,
  },
  advancedHeaderTitle: {
    fontSize: 22,
    fontWeight: "800",
  },
  advancedGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 16,
    gap: 12,
  },
  advancedStatCard: {
    width: "30%",
    flexGrow: 1,
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 12,
  },
  advancedStatValue: {
    fontSize: 24,
    fontWeight: "800",
  },
  advancedStatLabel: {
    fontSize: 11,
    color: "#888",
    fontWeight: "600",
    marginTop: 2,
  },
  advancedStatBar: {
    width: "100%",
    height: 4,
    backgroundColor: "#e5e7eb",
    borderRadius: 2,
    marginTop: 8,
    overflow: "hidden",
  },
  advancedStatFill: {
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
