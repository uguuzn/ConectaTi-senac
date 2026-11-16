import React, { useMemo } from "react";
import { Alert, Text, View } from "react-native";
import { router } from "expo-router";
import { useApp } from "../../src/State";
import { Button, Card, COLORS, Notice, Page, Title } from "../../src/ui";

const urgencyLabel = { critica: "Crítica", alta: "Alta", media: "Média", baixa: "Baixa" };

export default function HomeScreen() {
  const { session, tickets, request, setTickets, setSession, serviceError } = useApp();
  const stats = useMemo(() => ({
    open: tickets.filter((ticket) => ticket.status === "aberto" && !ticket.assignee).length,
    mine: tickets.filter((ticket) => ticket.status === "em_atendimento" && ticket.assignee === session?.nome).length,
    critical: tickets.filter((ticket) => ticket.status !== "fechado" && (ticket.urgency === "critica" || ticket.slaMin <= 30)).length,
    resolved: tickets.filter((ticket) => ticket.status === "fechado" && ticket.resolvedToday).length,
  }), [tickets, session?.nome]);
  const priority = useMemo(() => {
    const rank = { critica: 0, alta: 1, media: 2, baixa: 3 };
    return tickets.filter((ticket) => ticket.status !== "fechado")
      .slice().sort((a, b) => rank[a.urgency] - rank[b.urgency] || a.slaMin - b.slaMin).slice(0, 3);
  }, [tickets]);

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

  return (
    <Page>
      <Text style={{ color: COLORS.blue, fontWeight: "700" }}>Bom plantão, {session?.nome?.split(" ")[0]}</Text>
      <Title title="Painel do técnico" subtitle={session?.unidade} />
      {serviceError ? <Notice tone="error">{serviceError}</Notice> : null}
      <Notice>Chamados e inventário identificados como demonstração são dados ilustrativos. Valide-os antes do uso operacional.</Notice>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
        {[["Abertos", stats.open], ["Em atendimento", stats.mine], ["SLA crítico", stats.critical], ["Resolvidos hoje", stats.resolved]].map(([label, value]) => (
          <Card key={label} style={{ width: "48%", minHeight: 92, justifyContent: "center" }}>
            <Text style={{ color: COLORS.muted, fontSize: 12, fontWeight: "600" }}>{label}</Text>
            <Text style={{ color: COLORS.blue, fontSize: 28, fontWeight: "800" }}>{value}</Text>
          </Card>
        ))}
      </View>
      <Button title="Registrar novo chamado" onPress={() => router.push("/(tabs)/tickets")} />
      <Title title="Fila prioritária" />
      {priority.length ? priority.map((ticket) => (
        <Card key={ticket.id}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 10 }}>
            <Text style={{ color: COLORS.blue, fontWeight: "800" }}>{ticket.id}</Text>
            <Text style={{ color: ticket.urgency === "critica" ? COLORS.red : COLORS.orange, fontWeight: "700" }}>{urgencyLabel[ticket.urgency] || ticket.urgency}</Text>
          </View>
          <Text style={{ color: COLORS.ink, fontSize: 15, fontWeight: "700" }}>{ticket.title}</Text>
          <Text style={{ color: COLORS.muted, fontSize: 12 }}>{ticket.room} · SLA {ticket.slaMin} min</Text>
          {ticket.demo ? <Text style={{ color: "#8A5700", fontSize: 11, fontWeight: "700" }}>Registro de demonstração</Text> : null}
          <Button title="Abrir atendimento" onPress={() => router.push({ pathname: "/(tabs)/chat", params: { ticketId: ticket.id } })} />
          {ticket.assignee !== session?.nome ? <Button title="Assumir chamado" variant="secondary" onPress={() => assume(ticket.id)} /> : null}
        </Card>
      )) : <Card><Text style={{ color: COLORS.muted }}>Não há chamados abertos.</Text></Card>}
    </Page>
  );
}
