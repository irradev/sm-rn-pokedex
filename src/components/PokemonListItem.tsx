import { Ionicons } from "@react-native-vector-icons/ionicons";
import { Image, StyleSheet, Text, TouchableOpacity } from "react-native";

type PokemonListItemProps = {
  id: number;
  name: string;
  onPress: () => void;
  favorite?: boolean;
  padId?: boolean;
};

export default function PokemonListItem({ id, name, onPress, favorite, padId }: PokemonListItemProps) {
  const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
  const displayId = padId ? String(id).padStart(4, "0") : String(id);

  return (
    <TouchableOpacity
      style={[styles.item, favorite ? styles.itemFavorite : null]}
      onPress={onPress}
    >
      <Image source={{ uri: spriteUrl }} style={styles.sprite} />
      <Text style={styles.itemText}>#{displayId} - {name}</Text>
      {favorite && <Ionicons name="star" size={18} color="#f59e0b" />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
    flex: 1,
  },
  itemFavorite: {
    backgroundColor: "#fef3c7",
    borderWidth: 1,
    borderColor: "#f59e0b",
    borderBottomWidth: 1,
    borderBottomColor: "#f59e0b",
    borderRadius: 8,
    marginVertical: 4,
  },
});
