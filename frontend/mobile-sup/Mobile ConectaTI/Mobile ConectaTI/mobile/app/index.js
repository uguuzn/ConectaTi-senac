import React, { useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Text, View } from "react-native";
import { Redirect } from "expo-router";
import { useApp } from "../src/State";
import { BrandHeader, Button, Card, COLORS, ErrorText, Field, Notice, Page, Title } from "../src/ui";

export default function LoginScreen() {
  const { booting, session, serverUrl, serviceError } = useApp();
  if (session) return <Redirect href="/(tabs)" />;
  if (booting) {
    return <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.background, gap: 12 }}>
      <ActivityIndicator size="large" color={COLORS.blue} />
      <Text style={{ color: COLORS.muted }}>Conectando ao ConectaTI...</Text>
    </View>;
  }
  return <LoginForm key={serverUrl} serverUrl={serverUrl} serviceError={serviceError} />;
}

function LoginForm({ serverUrl, serviceError }) {
  const { login } = useApp();
  const [server, setServer] = useState(serverUrl);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    setError("");
    setSubmitting(true);
    try {
      await login(server, email, password);
    } catch (caught) {
      setError(caught.message || "Não foi possível entrar.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Page>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <BrandHeader />
        <Title title="Acessar sua conta" subtitle="Entre com as credenciais fornecidas pelo administrador." />
        <Card>
          <Field label="Endereço do servidor" value={server || serverUrl} onChangeText={setServer} placeholder="http://192.168.1.20:3000" keyboardType="url" autoCapitalize="none" />
          <Text style={{ color: COLORS.muted, fontSize: 12, lineHeight: 18 }}>
            No celular, use o IP do computador servidor e conecte-se à mesma rede Wi-Fi. &quot;localhost&quot; só funciona no próprio computador.
          </Text>
          {serviceError ? <Notice>{serviceError}</Notice> : null}
          <Field label="E-mail institucional" value={email} onChangeText={setEmail} placeholder="nome@df.senac.br" keyboardType="email-address" autoCapitalize="none" autoComplete="email" />
          <Field label="Senha do ConectaTI" value={password} onChangeText={setPassword} placeholder="Sua senha" secureTextEntry autoComplete="password" />
          <ErrorText>{error}</ErrorText>
          <Button title={submitting ? "Entrando..." : "Entrar"} onPress={submit} disabled={submitting || !email || !password} />
          <Text style={{ color: COLORS.muted, fontSize: 12, lineHeight: 18 }}>
            O acesso usa a conta própria do ConectaTI; o SSO institucional não está integrado.
          </Text>
        </Card>
        <Notice>
          Não transmita senhas reais por HTTP em uma rede compartilhada. Para produção, configure HTTPS com a equipe de infraestrutura.
        </Notice>
      </KeyboardAvoidingView>
    </Page>
  );
}
