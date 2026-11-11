import React, { useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { useApp } from "../../src/State";
import { Button, Card, COLORS, ModalForm, Notice, Page, Title } from "../../src/ui";

const STATUSES = [
  { value: "ok", label: "Operacional", color: COLORS.green },
  { value: "atendimento", label: "Em atendimento", color: "#A15C00" },
  { value: "inoperante", label: "Inoperante", color: COLORS.red },
];

export default function RoomsScreen() {
  const { rooms, request, setRooms } = useApp();
  const [selection, setSelection] = useState(null);
  const [saving, setSaving] = useState(false);

  async function changeStatus(status) {
    if (!selection) return;
    setSaving(true);
    try {
      const data = await request(`/api/rooms/${encodeURIComponent(selection.room.id)}/pcs/${encodeURIComponent(selection.pc.id)}`, {
        method: "PATCH",
        body: { status },
      });
      setRooms(data.rooms);
      setSelection(null);
    } catch (error) {
      Alert.alert("Não foi possível atualizar o equipamento", error.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Page>
      <Title title="Mapa e ronda" subtitle="Toque em um computador para consultar ou atualizar o status." />
      <Notice>O inventário inicial é ilustrativo. Confirme computadores, especificações e salas com a unidade antes de usar como registro operacional.</Notice>
      {rooms.map((room) => {
        const working = room.pcs.filter((pc) => pc.status === "ok").length;
        const percentage = room.pcs.length ? Math.round((working / room.pcs.length) * 100) : 0;
        return (
          <Card key={room.id}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 8 }}>
              <Text style={{ color: COLORS.ink, fontWeight: "800", flex: 1 }}>{room.name}</Text>
              <Text style={{ color: percentage >= 90 ? COLORS.green : COLORS.orange, fontWeight: "800" }}>{percentage}%</Text>
            </View>
            <Text style={{ color: COLORS.muted, fontSize: 12 }}>{working}/{room.pcs.length} máquinas operacionais</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 7 }}>
              {room.pcs.map((pc) => {
                const color = STATUSES.find((status) => status.value === pc.status)?.color || COLORS.muted;
                return (
                  <Pressable key={pc.id} onPress={() => setSelection({ room, pc })} style={{ width: "31%", borderRadius: 10, borderWidth: 1, borderColor: COLORS.line, backgroundColor: COLORS.white, padding: 10 }}>
                    <Text style={{ color: COLORS.blue, fontWeight: "800", fontSize: 12 }}>{pc.id}</Text>
                    <Text style={{ color, fontSize: 10, fontWeight: "700", marginTop: 4 }}>{STATUSES.find((status) => status.value === pc.status)?.label}</Text>
                  </Pressable>
                );
              })}
            </View>
          </Card>
        );
      })}
      <ModalForm visible={Boolean(selection)} title={selection ? `${selection.pc.id} · ${selection.room.name}` : "Equipamento"} onClose={() => setSelection(null)}>
        {selection ? (
          <>
            <Text style={{ color: COLORS.ink, fontWeight: "700" }}>{selection.pc.cpu}</Text>
            <Text style={{ color: COLORS.muted }}>RAM: {selection.pc.ram} · SSD: {selection.pc.ssd}</Text>
            <Text style={{ color: COLORS.blue, fontWeight: "800", marginTop: 6 }}>Histórico</Text>
            {(selection.pc.history || []).map((item, index) => <Text key={index} style={{ color: COLORS.muted, fontSize: 12 }}>{item}</Text>)}
            <Text style={{ color: COLORS.ink, fontWeight: "800", marginTop: 8 }}>Atualizar status</Text>
            {STATUSES.map((status) => <Button key={status.value} title={status.label} variant="secondary" onPress={() => changeStatus(status.value)} disabled={saving} />)}
          </>
        ) : null}
      </ModalForm>
    </Page>
  );
}
