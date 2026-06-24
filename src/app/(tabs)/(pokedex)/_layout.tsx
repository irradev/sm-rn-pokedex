import { Stack } from "expo-router";

export default function PokedexLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#ef4444" },
        headerTintColor: "#fff",
        headerTitleStyle: { color: "#fff" },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Pokedex" }} />
      <Stack.Screen name="[id]" options={{ title: "Pokemon Details", headerShown: false }} />
      <Stack.Screen name="stats-modal" 
        options={{ 
          title: "Stats", 
          presentation: "formSheet",
          headerShown: false,
          sheetAllowedDetents: [0.71, 1],
          sheetGrabberVisible: false,
          sheetCornerRadius: 24
        }}
      />
    </Stack>
  );
}
