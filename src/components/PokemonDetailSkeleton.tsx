import { useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

function SkeletonBlock({ style }: { style?: object }) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.7, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return <Animated.View style={[styles.skeleton, style, animatedStyle]} />;
}

export default function PokemonDetailSkeleton() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.imageWrapper}>
        <SkeletonBlock style={styles.skeletonName} />
        <SkeletonBlock style={styles.skeletonImage} />
      </View>

      <View style={styles.skeletonInfoRow}>
        <SkeletonBlock style={styles.skeletonInfoCard} />
        <SkeletonBlock style={styles.skeletonInfoCard} />
      </View>

      <View style={styles.skeletonTypesRow}>
        <SkeletonBlock style={styles.skeletonTypeBadge} />
        <SkeletonBlock style={styles.skeletonTypeBadge} />
      </View>

      <SkeletonBlock style={styles.skeletonSectionTitle} />

      <View style={styles.skeletonStatsSection}>
        {Array.from({ length: 6 }).map((_, i) => (
          <View key={i} style={styles.skeletonStatRow}>
            <SkeletonBlock style={styles.skeletonStatLabel} />
            <SkeletonBlock style={styles.skeletonStatBar} />
          </View>
        ))}
      </View>

      <SkeletonBlock style={styles.skeletonSectionTitle} />

      <View style={styles.skeletonAbilitiesSection}>
        <SkeletonBlock style={styles.skeletonAbilityPill} />
        <SkeletonBlock style={styles.skeletonAbilityPill} />
        <SkeletonBlock style={styles.skeletonAbilityPill} />
      </View>

      <SkeletonBlock style={styles.skeletonButton} />
    </ScrollView>
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
  skeleton: {
    backgroundColor: "#e5e7eb",
    borderRadius: 8,
  },
  imageWrapper: {
    alignItems: "center",
    paddingVertical: 55,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    backgroundColor: "#f3f4f6",
  },
  skeletonName: {
    width: 140,
    height: 24,
    borderRadius: 6,
    marginBottom: 24,
  },
  skeletonImage: {
    width: 200,
    height: 200,
    borderRadius: 16,
  },
  skeletonInfoRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginTop: 24,
    paddingHorizontal: 16,
    width: "80%",
    alignSelf: "center",
  },
  skeletonInfoCard: {
    flex: 1,
    height: 64,
    borderRadius: 12,
  },
  skeletonTypesRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginTop: 42,
  },
  skeletonTypeBadge: {
    width: 70,
    height: 28,
    borderRadius: 20,
  },
  skeletonSectionTitle: {
    width: 120,
    height: 20,
    borderRadius: 6,
    marginTop: 28,
    marginBottom: 12,
    marginHorizontal: 16,
  },
  skeletonStatsSection: {
    paddingHorizontal: 16,
    gap: 12,
  },
  skeletonStatRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  skeletonStatLabel: {
    width: 64,
    height: 14,
    borderRadius: 4,
  },
  skeletonStatBar: {
    flex: 1,
    height: 14,
    borderRadius: 4,
  },
  skeletonAbilitiesSection: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 8,
  },
  skeletonAbilityPill: {
    width: 80,
    height: 28,
    borderRadius: 20,
  },
  skeletonButton: {
    marginHorizontal: 16,
    marginTop: 24,
    height: 48,
    borderRadius: 12,
  },
});
