import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { UNIDADES } from "../api";

interface PropsLogin {
  onEntrar: (nome: string, unidade: string) => void;
}

/** Tela de login do app mobile: unidade, usuário e senha. */
export function LoginScreen({ onEntrar }: PropsLogin) {
  const [unidade, setUnidade] = useState<string>("Taguatinga");
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [entrando, setEntrando] = useState(false);

  function entrar() {
    if (usuario.trim().length < 2) {
      alert("Informe seu usuário.");
      return;
    }
    if (senha.length < 4) {
      alert("A senha deve ter pelo menos 4 caracteres.");
      return;
    }
    setEntrando(true);
    // Validação local de credenciais (o backend web usa a mesma regra).
    setTimeout(() => {
      setEntrando(false);
      onEntrar(usuario.trim(), unidade);
    }, 700);
  }

  return (
    <KeyboardAvoidingView
      style={estilos.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={estilos.flex}
        contentContainerStyle={estilos.conteudo}
        keyboardShouldPersistTaps="handled"
      >
        <View style={estilos.logo}>
          <Text style={estilos.logoTexto}>
            Conecta<Text style={{ color: "#e69532" }}>TI</Text>
          </Text>
          <Text style={estilos.logoSub}>Senac · Suporte TI</Text>
        </View>

        <View style={estilos.cartao}>
          <Text style={estilos.rotulo}>Unidade</Text>
          <View style={estilos.grupoUnidades}>
            {UNIDADES.map((u) => (
              <Pressable
                key={u}
                onPress={() => setUnidade(u)}
                style={[
                  estilos.chip,
                  unidade === u && estilos.chipAtivo,
                ]}
              >
                <Text
                  style={[
                    estilos.chipTexto,
                    unidade === u && estilos.chipTextoAtivo,
                  ]}
                >
                  {u}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={estilos.rotulo}>Usuário</Text>
          <TextInput
            style={estilos.campo}
            placeholder="ex.: suporte.taguatinga"
            placeholderTextColor="#94a3b8"
            autoCapitalize="none"
            autoCorrect={false}
            value={usuario}
            onChangeText={setUsuario}
            maxLength={60}
          />

          <Text style={estilos.rotulo}>Senha</Text>
          <TextInput
            style={estilos.campo}
            placeholder="Sua senha"
            placeholderTextColor="#94a3b8"
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
            maxLength={60}
          />

          <Pressable
            style={[estilos.botaoEntrar, entrando && { opacity: 0.7 }]}
            onPress={entrar}
            disabled={entrando}
          >
            {entrando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={estilos.botaoEntrarTexto}>Entrar</Text>
            )}
          </Pressable>

          <Text style={estilos.nota}>
            Acesso exclusivo do Suporte TI · unidades Senac DF
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  flex: { flex: 1 },
  conteudo: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#ecf0f4",
  },
  logo: { alignItems: "center", marginBottom: 28 },
  logoTexto: {
    fontSize: 40,
    fontWeight: "800",
    color: "#2e63b4",
    letterSpacing: -1,
  },
  logoSub: { fontSize: 15, fontWeight: "600", color: "#2f5996", marginTop: 4 },
  cartao: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 20,
    shadowColor: "#0f172a",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  rotulo: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 6,
    marginTop: 14,
  },
  campo: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 46,
    fontSize: 15,
    color: "#0f172a",
  },
  grupoUnidades: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  chip: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    backgroundColor: "#f8fafc",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 4,
  },
  chipAtivo: { backgroundColor: "#2e70c0", borderColor: "#2e70c0" },
  chipTexto: { fontSize: 13, color: "#334155" },
  chipTextoAtivo: { color: "#fff", fontWeight: "700" },
  botaoEntrar: {
    marginTop: 22,
    backgroundColor: "#2e70c0",
    borderRadius: 14,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  botaoEntrarTexto: { color: "#fff", fontSize: 16, fontWeight: "800" },
  nota: {
    marginTop: 14,
    textAlign: "center",
    fontSize: 12,
    color: "#94a3b8",
  },
});
