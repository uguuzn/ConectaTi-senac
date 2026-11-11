import React from "react";
import { Redirect, Tabs } from "expo-router";
import { useApp } from "../../src/State";
import { COLORS } from "../../src/ui";

export default function TabsLayout() {
  const { session, booting } = useApp();
  if (booting) return null;
  if (!session) return <Redirect href="/" />;
  return (
    <Tabs screenOptions={{
      headerShown: true,
      headerTitle: "ConectaTI",
      headerTitleStyle: { color: COLORS.blue, fontWeight: "800" },
      headerStyle: { backgroundColor: COLORS.white },
      tabBarActiveTintColor: COLORS.orange,
      tabBarInactiveTintColor: COLORS.muted,
      tabBarStyle: { height: 62, paddingBottom: 8, paddingTop: 6 },
      tabBarLabelStyle: { fontSize: 10, fontWeight: "700" },
    }}>
      <Tabs.Screen name="index" options={{ title: "Início", tabBarLabel: "Início" }} />
      <Tabs.Screen name="tickets" options={{ title: "Chamados", tabBarLabel: "Chamados" }} />
      <Tabs.Screen name="chat" options={{ title: "Chat SLA", tabBarLabel: "Chat SLA" }} />
      <Tabs.Screen name="rooms" options={{ title: "Salas", tabBarLabel: "Salas" }} />
      <Tabs.Screen name="profile" options={{ title: "Perfil", tabBarLabel: "Perfil" }} />
    </Tabs>
  );
}
