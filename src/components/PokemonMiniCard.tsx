import { fetchPokemonDetail } from "@/lib/pokeapi";
import { TYPE_COLORS } from "@/themes/colors";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  id: number;
  name: string;
  onPress: () => void;
};

export default function PokemonMiniCard({ id, name, onPress }: Props) {
  const [color, setColor] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    fetchPokemonDetail(id)
      .then((res) => {
        if (!mounted) return;
        const primaryType = res.types[0].type.name;
        setColor(TYPE_COLORS[primaryType] ?? "#999");
      })
      .catch(() => {
        if (mounted) setColor("#999");
      });
    return () => { mounted = false; };
  }, [id]);

  const displayId = String(id).padStart(4, "0");
  const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
  const bgColor = color ? color + "20" : "#f3f4f6";
  const textColor = color ?? "#999";

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: bgColor }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {color ? (
        <Image source={{ uri: spriteUrl }} style={styles.sprite} />
      ) : (
        <View style={styles.skeleton}>
          <ActivityIndicator size="small" color="#999" />
        </View>
      )}
      <Text style={[styles.name, { color: textColor }]} numberOfLines={1}>
        {name}
      </Text>
      <Text style={[styles.id, { color: textColor }]}>#{displayId}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 12,
    margin: 6,
  },
  sprite: {
    width: 94,
    height: 94,
  },
  skeleton: {
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontSize: 15,
    fontWeight: "700",
    textTransform: "capitalize",
    marginTop: 8,
  },
  id: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 2,
    opacity: 0.7,
  },
});
