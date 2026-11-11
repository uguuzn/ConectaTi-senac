import React, { useState } from "react";
import { Alert, Text, View } from "react-native";
import { router } from "expo-router";
import { useApp } from "../../src/State";
import {
  Button, Card, COLORS, Field, initials, ModalForm, Page, SelectField, Title, UNITS, PRESENCES,
} from "../../src/ui";

const EMPTY_USER = { name: "", email: "", position: "Técnico de Suporte de TI", unit: UNITS[0], password: "" };

export default function ProfileScreen() {
  const { session, request, setSession, users, setUsers, logout } = useApp();
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({ name: "", email: "", position: "", unit: UNITS[0] });
  const [password, setPassword] = useState({ current: "", next: "", confirm: "" });
  const [newUser, setNewUser] = useState(EMPTY_USER);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [savingUser, setSavingUser] = useState(false);
  const [showNewUser, setShowNewUser] = useState(false);

  async function saveProfile() {
    setSavingProfile(true);
    try {
      const data = await request("/api/profile", {
        method: "PATCH",
        body: { name: profile.name, email: profile.email, position: profile.position, unit: profile.unit },
      });
      setSession(data.user);
      setEditing(false);
      Alert.alert("Perfil atualizado", "As alterações foram salvas.");
    } catch (error) {
      Alert.alert("Não foi possível salvar o perfil", error.message);
    } finally {
      setSavingProfile(false);
    }
  }

  async function updatePassword() {
    if (password.next !== password.confirm) {
      Alert.alert("Senhas diferentes", "A confirmação da nova senha não confere.");
      return;
    }
    setSavingPassword(true);
    try {
      await request("/api/password", {
        method: "PATCH",
        body: { currentPassword: password.current, newPassword: password.next },
      });
      setPassword({ current: "", next: "", confirm: "" });
      Alert.alert("Senha atualizada", "Sua senha foi alterada.");
    } catch (error) {
      Alert.alert("Não foi possível atualizar a senha", error.message);
    } finally {
      setSavingPassword(false);
    }
  }

  async function createTechnician() {
    setSavingUser(true);
    try {
      const data = await request("/api/users", {
        method: "POST",
        body: newUser,
      });
      setUsers((current) => [...current, { ...data.user, ativo: true }].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR")));
      setNewUser(EMPTY_USER);
      setShowNewUser(false);
      Alert.alert("Conta criada", `A conta de ${data.user.nome} foi criada.`);
    } catch (error) {
      Alert.alert("Não foi possível criar a conta", error.message);
    } finally {
      setSavingUser(false);
    }
  }

  async function changePresence(presence) {
    try {
      await request("/api/presence", { method: "PATCH", body: { presence } });
      setSession((current) => ({ ...current, presence }));
    } catch (error) {
      Alert.alert("Não foi possível atualizar o status", error.message);
    }
  }

  async function signOut() {
    try {
      await logout();
      router.replace("/");
    } catch (error) {
      Alert.alert("Sessão encerrada neste aparelho", `O servidor não confirmou o encerramento: ${error.message}`);
      router.replace("/");
    }
  }

  return (
    <Page>
      <Title title="Perfil" subtitle="Seus dados e configurações da conta" />
      <Card style={{ alignItems: "center", paddingVertical: 20 }}>
        <View style={{ width: 68, height: 68, borderRadius: 18, backgroundColor: COLORS.blue, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ color: COLORS.white, fontSize: 22, fontWeight: "800" }}>{initials(session?.nome)}</Text>
        </View>
        <Text style={{ color: COLORS.ink, fontSize: 19, fontWeight: "800", marginTop: 6 }}>{session?.nome}</Text>
        <Text style={{ color: COLORS.muted }}>{session?.cargo}</Text>
        <Text style={{ color: COLORS.blue }}>{session?.email}</Text>
        <Text style={{ color: COLORS.muted, fontSize: 12, textAlign: "center" }}>{session?.unidade}</Text>
        <SelectField label="Status de presença" value={session?.presence || "Online"} options={PRESENCES} onChange={changePresence} />
      </Card>

      <Card>
        <Text style={{ color: COLORS.ink, fontWeight: "800", fontSize: 16 }}>Dados do perfil</Text>
        {editing ? (
          <>
            <Field label="Nome" value={profile.name} onChangeText={(name) => setProfile({ ...profile, name })} />
            <Field label="E-mail" value={profile.email} onChangeText={(email) => setProfile({ ...profile, email })} keyboardType="email-address" autoCapitalize="none" />
            <Field label="Cargo" value={profile.position} onChangeText={(position) => setProfile({ ...profile, position })} />
            <SelectField label="Unidade" value={profile.unit} options={UNITS} onChange={(unit) => setProfile({ ...profile, unit })} />
            <Button title={savingProfile ? "Salvando..." : "Salvar perfil"} onPress={saveProfile} disabled={savingProfile} />
            <Button title="Cancelar" variant="secondary" onPress={() => setEditing(false)} disabled={savingProfile} />
          </>
        ) : (
          <>
            <Text style={{ color: COLORS.muted, fontSize: 13 }}>Mantenha seus dados atualizados para facilitar a identificação nos chamados.</Text>
            <Button title="Editar perfil" variant="secondary" onPress={() => {
              setProfile({
                name: session.nome,
                email: session.email,
                position: session.cargo,
                unit: session.unidade,
              });
              setEditing(true);
            }} />
          </>
        )}
      </Card>

      <Card>
        <Text style={{ color: COLORS.ink, fontWeight: "800", fontSize: 16 }}>Segurança da conta</Text>
        <Text style={{ color: COLORS.muted, fontSize: 12 }}>Use uma senha exclusiva com pelo menos 12 caracteres.</Text>
        <Field label="Senha atual" value={password.current} onChangeText={(current) => setPassword({ ...password, current })} secureTextEntry autoComplete="current-password" />
        <Field label="Nova senha" value={password.next} onChangeText={(next) => setPassword({ ...password, next })} secureTextEntry autoComplete="new-password" />
        <Field label="Confirmar nova senha" value={password.confirm} onChangeText={(confirm) => setPassword({ ...password, confirm })} secureTextEntry autoComplete="new-password" />
        <Button title={savingPassword ? "Atualizando..." : "Atualizar senha"} onPress={updatePassword} disabled={savingPassword || !password.current || password.next.length < 12 || !password.confirm} />
      </Card>

      {session?.role === "admin" ? (
        <Card>
          <Text style={{ color: COLORS.ink, fontWeight: "800", fontSize: 16 }}>Contas de técnicos ({users.length})</Text>
          <Button title="Adicionar técnico" onPress={() => setShowNewUser(true)} />
          {users.map((user) => (
            <View key={user.id} style={{ borderTopWidth: 1, borderTopColor: COLORS.line, paddingTop: 9 }}>
              <Text style={{ color: COLORS.ink, fontWeight: "700" }}>{user.nome}{user.role === "admin" ? " · Admin" : ""}</Text>
              <Text style={{ color: COLORS.muted, fontSize: 12 }}>{user.email}</Text>
              <Text style={{ color: COLORS.muted, fontSize: 12 }}>{user.unidade}</Text>
            </View>
          ))}
        </Card>
      ) : null}
      <Button title="Sair da conta" variant="danger" onPress={signOut} />

      <UserCreationForm
        visible={showNewUser}
        user={newUser}
        setUser={setNewUser}
        saving={savingUser}
        onClose={() => setShowNewUser(false)}
        onSave={createTechnician}
      />
    </Page>
  );
}

function UserCreationForm({ visible, user, setUser, saving, onClose, onSave }) {
  return (
    <ModalForm visible={visible} title="Cadastrar técnico" onClose={onClose}>
      <Field label="Nome completo" value={user.name} onChangeText={(name) => setUser({ ...user, name })} />
      <Field label="E-mail institucional" value={user.email} onChangeText={(email) => setUser({ ...user, email })} keyboardType="email-address" autoCapitalize="none" placeholder="nome@df.senac.br" />
      <Field label="Cargo" value={user.position} onChangeText={(position) => setUser({ ...user, position })} />
      <SelectField label="Unidade" value={user.unit} options={UNITS} onChange={(unit) => setUser({ ...user, unit })} />
      <Field label="Senha inicial (mínimo 12 caracteres)" value={user.password} onChangeText={(password) => setUser({ ...user, password })} secureTextEntry autoComplete="new-password" />
      <Button title={saving ? "Criando conta..." : "Criar conta"} onPress={onSave} disabled={saving || !user.name || !user.email || user.password.length < 12} />
    </ModalForm>
  );
}
