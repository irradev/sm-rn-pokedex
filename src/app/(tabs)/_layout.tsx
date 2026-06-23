import { Ionicons } from '@react-native-vector-icons/ionicons';
import { Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#e91e63",
        tabBarInactiveTintColor: "#6b7280",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: "#e5e7eb"
        },
        headerStyle: {
          backgroundColor: "#ef4444",
        },
        headerTitleStyle: {
          color: "#fff",
        },
        headerTintColor: "#fff",
      }}
    >
      <Tabs.Screen
        name="(pokedex)"
        options={{
          title: "Pokedex",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" color={color} size={size} />
          )
        }}
      />
      <Tabs.Screen 
        name="favorites"
        options={{
          title: "Favorites",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" color={color} size={size} />
          )
        }}
      />
    </Tabs>

  );
}
