import React, { useMemo, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import * as Sharing from "expo-sharing";
import { useApp } from "../../src/State";
import { Button, Card, COLORS, Field, ModalForm, Page, Title } from "../../src/ui";

export default function ChatScreen() {
  const { ticketId } = useLocalSearchParams();
  const { session, tickets, request, setTickets, setSession, uploadAttachment, downloadAttachment } = useApp();
  const [draft, setDraft] = useState("");
  const [note, setNote] = useState("");
  const [resolveOpen, setResolveOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const selected = useMemo(() => tickets.find((ticket) => ticket.id === ticketId), [tickets, ticketId]);
  const assigned = tickets.filter((ticket) => ticket.assignee === session?.nome && ticket.status !== "fechado");

  async function assume(id) {
    try {
      const data = await request(`/api/tickets/${encodeURIComponent(id)}/assume`, { method: "POST" });
      setTickets(data.tickets);
      await request("/api/presence", { method: "PATCH", body: { presence: "Em Atendimento" } });
      setSession((current) => ({ ...current, presence: "Em Atendimento" }));
    } catch (error) {
      Alert.alert("Não foi possível assumir o chamado", error.message);
    }
  }

  async function sendMessage() {
    const text = draft.trim();
    if (!text || !selected || busy) return;
    setBusy(true);
    try {
      const data = await request(`/api/tickets/${encodeURIComponent(selected.id)}/messages`, {
        method: "POST",
        body: { text },
      });
      setTickets(data.tickets);
      setDraft("");
    } catch (error) {
      Alert.alert("Mensagem não enviada", error.message);
    } finally {
      setBusy(false);
    }
  }

  async function pickAttachment() {
    if (!selected) return;
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf", "text/plain", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
        copyToCacheDirectory: true,
      });
      if (result.canceled) return;
      const asset = result.assets[0];
      if ((asset.size || 0) > 10 * 1024 * 1024) {
        Alert.alert("Arquivo muito grande", "O tamanho máximo do anexo é 10 MB.");
        return;
      }
      setBusy(true);
      await uploadAttachment(selected.id, asset);
      Alert.alert("Anexo enviado", "O arquivo foi vinculado ao chamado.");
    } catch (error) {
      Alert.alert("Não foi possível enviar o anexo", error.message);
    } finally {
      setBusy(false);
    }
  }

  async function openAttachment(message) {
    try {
      const uri = await downloadAttachment(message.attachmentId, message.attachmentName || "anexo");
      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert("Anexo baixado", `O arquivo está temporariamente disponível em ${uri}`);
        return;
      }
      await Sharing.shareAsync(uri, { dialogTitle: message.attachmentName || "Abrir anexo" });
    } catch (error) {
      Alert.alert("Não foi possível abrir o anexo", error.message);
    }
  }

  async function resolveTicket() {
    if (!selected || !note.trim()) return;
    setBusy(true);
    try {
      const data = await request(`/api/tickets/${encodeURIComponent(selected.id)}/resolve`, {
        method: "POST",
        body: { note: note.trim() },
      });
      setTickets(data.tickets);
      setNote("");
      setResolveOpen(false);
    } catch (error) {
      Alert.alert("Não foi possível encerrar o chamado", error.message);
    } finally {
      setBusy(false);
    }
  }

  if (!selected) {
    return (
      <Page>
        <Title title="Chat SLA" subtitle="Conversas dos chamados em atendimento" />
        {assigned.length === 0 ? <Card><Text style={{ color: COLORS.muted }}>Assuma um chamado para iniciar um atendimento pelo chat.</Text></Card> : null}
        {assigned.map((ticket) => (
          <Pressable key={ticket.id} onPress={() => router.setParams({ ticketId: ticket.id })}>
            <Card>
              <Text style={{ color: COLORS.blue, fontWeight: "800" }}>{ticket.id}</Text>
              <Text style={{ color: COLORS.ink, fontWeight: "700" }}>{ticket.title}</Text>
              <Text style={{ color: COLORS.muted, fontSize: 12 }}>{ticket.room} · {ticket.messages?.length || 0} mensagem(ns)</Text>
            </Card>
          </Pressable>
        ))}
        <Title title="Chamados pendentes" />
        {tickets.filter((ticket) => ticket.status === "aberto").slice(0, 8).map((ticket) => (
          <Card key={ticket.id}>
            <Text style={{ color: COLORS.blue, fontWeight: "800" }}>{ticket.id} · SLA {ticket.slaMin} min</Text>
            <Text style={{ color: COLORS.ink, fontWeight: "700" }}>{ticket.title}</Text>
            <Button title="Assumir e abrir chat" onPress={async () => {
              await assume(ticket.id);
              router.setParams({ ticketId: ticket.id });
            }} />
          </Card>
        ))}
      </Page>
    );
  }

  return (
    <Page scroll={false}>
      <View style={{ flex: 1, gap: 10 }}>
        <View style={{ gap: 4 }}>
          <Pressable onPress={() => router.setParams({ ticketId: "" })}><Text style={{ color: COLORS.blue, fontWeight: "700" }}>Voltar à lista</Text></Pressable>
          <Text style={{ color: COLORS.blue, fontWeight: "800", fontSize: 18 }}>{selected.id} · SLA {selected.slaMin} min</Text>
          <Text style={{ color: COLORS.ink, fontWeight: "700" }}>{selected.title}</Text>
          <Text style={{ color: COLORS.muted, fontSize: 12 }}>{selected.requester} · {selected.room}</Text>
        </View>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ gap: 9, paddingBottom: 8 }} keyboardShouldPersistTaps="handled">
          {(selected.messages || []).map((message, index) => {
            const own = message.who === session?.nome;
            return (
              <View key={`${message.time}-${index}`} style={{ alignSelf: own ? "flex-end" : "flex-start", maxWidth: "88%", backgroundColor: own ? "#E3EFFB" : COLORS.white, borderRadius: 14, padding: 11, borderWidth: 1, borderColor: COLORS.line }}>
                <Text style={{ color: COLORS.blue, fontSize: 11, fontWeight: "800" }}>{message.who} · {message.time}</Text>
                <Text style={{ color: COLORS.ink, marginTop: 4 }}>{message.text}</Text>
                {message.attachmentId ? <Pressable onPress={() => openAttachment(message)}><Text style={{ color: COLORS.blue, fontWeight: "700", marginTop: 6 }}>Abrir: {message.attachmentName}</Text></Pressable> : null}
              </View>
            );
          })}
          {selected.status === "fechado" ? <Text style={{ color: COLORS.green, textAlign: "center", fontWeight: "700" }}>Chamado encerrado</Text> : null}
        </ScrollView>
        {selected.status !== "fechado" && selected.assignee !== session?.nome
          ? <Button title="Assumir chamado" onPress={() => assume(selected.id)} />
          : null}
        {selected.status !== "fechado" ? (
          <>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
              <Field label="Mensagem" value={draft} onChangeText={setDraft} placeholder="Digite uma atualização" multiline />
              <View style={{ flexDirection: "row", gap: 8 }}>
                <Button title="Enviar" onPress={sendMessage} disabled={busy || !draft.trim()} style={{ flex: 1 }} />
                <Button title="Anexar arquivo" variant="secondary" onPress={pickAttachment} disabled={busy} style={{ flex: 1 }} />
              </View>
            </KeyboardAvoidingView>
            {selected.assignee === session?.nome
              ? <Button title="Encerrar com nota técnica" variant="secondary" onPress={() => setResolveOpen(true)} />
              : null}
          </>
        ) : null}
      </View>
      <ModalForm visible={resolveOpen} title="Nota de solução técnica" onClose={() => setResolveOpen(false)}>
        <Text style={{ color: COLORS.muted, fontSize: 13 }}>Informe o que foi feito para resolver este chamado.</Text>
        <Field label="Nota técnica" value={note} onChangeText={setNote} placeholder="Descreva a solução" multiline />
        <Button title={busy ? "Salvando..." : "Salvar e encerrar"} onPress={resolveTicket} disabled={busy || !note.trim()} />
      </ModalForm>
    </Page>
  );
}
