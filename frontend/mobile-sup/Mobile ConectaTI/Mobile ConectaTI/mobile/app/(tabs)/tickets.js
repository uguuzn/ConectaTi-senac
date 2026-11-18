import React, { useMemo, useState } from "react";
import { Alert, Text, View } from "react-native";
import { router } from "expo-router";
import { useApp } from "../../src/State";
import {
  Button, Card, Chip, COLORS, CATEGORIES, Field, ModalForm, Page, SelectField, Title,
} from "../../src/ui";

const STATUS_FILTERS = ["Todos", "Meus atendimentos", "Pendentes", "Fechados"];
const URGENCY_FILTERS = ["Todas", "Críticas", "Alta", "Média", "Baixa"];
const urgencyLabels = { critica: "Crítica", alta: "Alta", media: "Média", baixa: "Baixa" };
const urgencyValues = { "Críticas": "critica", Alta: "alta", Média: "media", Baixa: "baixa" };

export default function TicketsScreen() {
  const { session, tickets, request, setTickets, setSession } = useApp();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [urgencyFilter, setUrgencyFilter] = useState("Todas");
  const [createOpen, setCreateOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState({
    title: "", category: "Hardware", room: "", requester: "", role: "Docente", urgency: "media",
  });

  const filtered = useMemo(() => tickets.filter((ticket) => {
    const text = query.trim().toLocaleLowerCase("pt-BR");
    if (text && ![ticket.id, ticket.title, ticket.requester, ticket.room, ticket.category]
      .some((value) => String(value || "").toLocaleLowerCase("pt-BR").includes(text))) return false;
    if (statusFilter === "Meus atendimentos" && !(ticket.assignee === session?.nome && ticket.status === "em_atendimento")) return false;
    if (statusFilter === "Pendentes" && ticket.status !== "aberto") return false;
    if (statusFilter === "Fechados" && ticket.status !== "fechado") return false;
    const urgency = urgencyValues[urgencyFilter];
    return !urgency || ticket.urgency === urgency;
  }), [tickets, query, statusFilter, urgencyFilter, session?.nome]);

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

  async function createTicket() {
    if (!draft.title.trim() || !draft.requester.trim()) {
      Alert.alert("Dados incompletos", "Preencha o título e o nome do solicitante.");
      return;
    }
    setSaving(true);
    try {
      const data = await request("/api/tickets", { method: "POST", body: draft });
      setTickets((current) => [data.ticket, ...current.filter((item) => item.id !== data.ticket.id)]);
      setDraft({ title: "", category: "Hardware", room: "", requester: "", role: "Docente", urgency: "media" });
      setCreateOpen(false);
      Alert.alert("Chamado registrado", `O chamado ${data.ticket.id} foi salvo.`);
    } catch (error) {
      Alert.alert("Não foi possível registrar", error.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Page>
      <Title title="Fila de TI" subtitle={`${filtered.length} chamado(s)`} />
      <Button title="Novo chamado" onPress={() => setCreateOpen(true)} />
      <Field label="Buscar" value={query} onChangeText={setQuery} placeholder="Chamado, solicitante ou sala" />
      <View style={{ gap: 8 }}>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 7 }}>
          {STATUS_FILTERS.map((item) => <Chip key={item} title={item} active={item === statusFilter} onPress={() => setStatusFilter(item)} />)}
        </View>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 7 }}>
          {URGENCY_FILTERS.map((item) => <Chip key={item} title={item} active={item === urgencyFilter} tone="orange" onPress={() => setUrgencyFilter(item)} />)}
        </View>
      </View>
      {filtered.length === 0 ? <Card><Text style={{ color: COLORS.muted }}>Nenhum chamado encontrado para esses filtros.</Text></Card> : null}
      {filtered.map((ticket) => (
        <Card key={ticket.id}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 8 }}>
            <Text style={{ color: COLORS.blue, fontWeight: "800" }}>{ticket.id}</Text>
            <Text style={{ color: ticket.status === "fechado" ? COLORS.green : COLORS.orange, fontSize: 12, fontWeight: "700" }}>
              {ticket.status === "fechado" ? "Encerrado" : urgencyLabels[ticket.urgency]}
            </Text>
          </View>
          <Text style={{ color: COLORS.ink, fontWeight: "700", fontSize: 15 }}>{ticket.title}</Text>
          <Text style={{ color: COLORS.muted, fontSize: 12 }}>{ticket.category} · {ticket.room || "Sala não informada"}</Text>
          <Text style={{ color: COLORS.muted, fontSize: 12 }}>{ticket.requester} · {ticket.role}</Text>
          <Text style={{ color: ticket.slaMin <= 0 && ticket.status !== "fechado" ? COLORS.red : COLORS.muted, fontSize: 12 }}>
            {ticket.status === "fechado" ? "Chamado encerrado" : ticket.slaMin <= 0 ? "SLA vencido" : `SLA ${ticket.slaMin} min`}
            {" · "}{ticket.assignee || "Sem técnico"}
          </Text>
          {ticket.demo ? <Text style={{ color: "#8A5700", fontSize: 11, fontWeight: "700" }}>Registro de demonstração</Text> : null}
          {ticket.status !== "fechado" && ticket.assignee !== session?.nome
            ? <Button title="Assumir atendimento" variant="secondary" onPress={() => assume(ticket.id)} />
            : null}
          <Button title="Abrir chat" onPress={() => router.push({ pathname: "/(tabs)/chat", params: { ticketId: ticket.id } })} />
        </Card>
      ))}
      <ModalForm visible={createOpen} title="Nova ordem de serviço" onClose={() => setCreateOpen(false)}>
        <Field label="Título" value={draft.title} onChangeText={(title) => setDraft({ ...draft, title })} placeholder="Descreva o problema" />
        <SelectField label="Categoria" value={draft.category} options={CATEGORIES} onChange={(category) => setDraft({ ...draft, category })} />
        <Field label="Sala" value={draft.room} onChangeText={(room) => setDraft({ ...draft, room })} placeholder="Sala ou local" />
        <Field label="Solicitante" value={draft.requester} onChangeText={(requester) => setDraft({ ...draft, requester })} placeholder="Nome do solicitante" />
        <Field label="Cargo" value={draft.role} onChangeText={(role) => setDraft({ ...draft, role })} />
        <SelectField label="Urgência" value={draft.urgency} options={[
          { value: "critica", label: "Crítica" }, { value: "alta", label: "Alta" },
          { value: "media", label: "Média" }, { value: "baixa", label: "Baixa" },
        ]} onChange={(urgency) => setDraft({ ...draft, urgency })} />
        <Button title={saving ? "Registrando..." : "Registrar chamado"} onPress={createTicket} disabled={saving} />
      </ModalForm>
    </Page>
  );
}
