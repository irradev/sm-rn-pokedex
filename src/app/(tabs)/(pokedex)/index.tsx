import { Button, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";

export default function PokedexScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text>Pokedex</Text>
      <Button title="Go to Pokemon #25" onPress={() => router.push("/(tabs)/(pokedex)/25")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
