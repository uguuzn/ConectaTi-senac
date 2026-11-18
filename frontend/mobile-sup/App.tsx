import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet } from "react-native";
import { LoginScreen } from "./src/screens/LoginScreen";
import { ChamadosScreen } from "./src/screens/ChamadosScreen";

/**
 * ConectaTI Senac — app mobile (React Native + Expo).
 * Cliente do mesmo backend do sistema web: /api/chamados e /api/avaliacoes.
 */
export default function App() {
  const [sessao, setSessao] = useState<{ nome: string; unidade: string } | null>(
    null,
  );

  return (
    <SafeAreaView style={estilos.flex}>
      <StatusBar style="dark" />
      {sessao ? (
        <ChamadosScreen nome={sessao.nome} onSair={() => setSessao(null)} />
      ) : (
        <LoginScreen onEntrar={(nome, unidade) => setSessao({ nome, unidade })} />
      )}
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "#ecf0f4" },
});
