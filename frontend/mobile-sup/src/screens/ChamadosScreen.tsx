import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  atualizarChamado,
  criarChamado,
  listarChamados,
  LOCAIS,
  PRIORIDADES,
  TIPOS,
  type Chamado,
} from "../api";

const FILTROS = ["Todos", "Aberto", "Em atendimento", "Resolvido"] as const;

function corStatus(status: string): string {
  if (status === "Aberto") return "#60a5fa";
  if (status === "Em atendimento") return "#fb923c";
  if (status === "Resolvido") return "#34d399";
  return "#94a3b8";
}

interface PropsChamados {
  nome: string;
  onSair: () => void;
}

/** Lista de chamados + novo chamado (app mobile React Native). */
export function ChamadosScreen({ nome, onSair }: PropsChamados) {
  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [filtro, setFiltro] = useState<(typeof FILTROS)[number]>("Todos");
  const [busca, setBusca] = useState("");
  const [novoAberto, setNovoAberto] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(async (mostrandoSpinner: boolean) => {
    if (mostrandoSpinner) setCarregando(true);
    setErro(null);
    try {
      const { chamados: lista } = await listarChamados();
      setChamados(lista);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao carregar");
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }, []);

  useEffect(() => {
    carregar(true);
  }, [carregar]);

  const lista = chamados.filter((c) => {
    const combinaFiltro = filtro === "Todos" || c.status === filtro;
    const termo = busca.trim().toLowerCase();
    const combinaBusca =
      !termo ||
      c.tipo.toLowerCase().includes(termo) ||
      c.local.toLowerCase().includes(termo) ||
      c.descricao.toLowerCase().includes(termo) ||
      String(c.numero).includes(termo);
    return combinaFiltro && combinaBusca;
  });

  async function fecharChamado(c: Chamado) {
    try {
      await atualizarChamado(c.id, { status: "Resolvido" });
      await carregar(false);
    } catch {
      alert("Não foi possível fechar o chamado.");
    }
  }

  async function iniciarAtendimento(c: Chamado) {
    try {
      await atualizarChamado(c.id, { status: "Em atendimento" });
      await carregar(false);
    } catch {
      alert("Não foi possível iniciar o atendimento.");
    }
  }

  if (novoAberto) {
    return (
      <FormNovoChamado
        nome={nome}
        onSalvar={async (dados) => {
          try {
            await criarChamado(dados);
            setNovoAberto(false);
            await carregar(false);
          } catch (e) {
            alert(e instanceof Error ? e.message : "Erro ao abrir chamado");
          }
        }}
        onCancelar={() => setNovoAberto(false)}
      />
    );
  }

  return (
    <View style={estilos.flex}>
      <View style={estilos.topo}>
        <View>
          <Text style={estilos.titulo}>Chamados</Text>
          <Text style={estilos.subtitulo}>{chamados.length} registros · Suporte TI</Text>
        </View>
        <Pressable style={estilos.botaoSair} onPress={onSair}>
          <Text style={estilos.botaoSairTexto}>Sair</Text>
        </Pressable>
      </View>

      <View style={estilos.acoes}>
        <TextInput
          style={estilos.busca}
          placeholder="Buscar por tipo, local, nº…"
          placeholderTextColor="#94a3b8"
          value={busca}
          onChangeText={setBusca}
        />
        <Pressable
          style={estilos.botaoNovo}
          onPress={() => setNovoAberto(true)}
        >
          <Text style={estilos.botaoNovoTexto}>+ Novo</Text>
        </Pressable>
      </View>

      <View style={estilos.filtros}>
        {FILTROS.map((f) => {
          const total =
            f === "Todos"
              ? chamados.length
              : chamados.filter((c) => c.status === f).length;
          return (
            <Pressable
              key={f}
              onPress={() => setFiltro(f)}
              style={[estilos.chip, filtro === f && estilos.chipAtivo]}
            >
              <Text
                style={[
                  estilos.chipTexto,
                  filtro === f && estilos.chipTextoAtivo,
                ]}
              >
                {f} ({total})
              </Text>
            </Pressable>
          );
        })}
      </View>

      {carregando ? (
        <ActivityIndicator style={{ marginTop: 32 }} color="#2e70c0" />
      ) : erro ? (
        <View style={{ padding: 24, alignItems: "center" }}>
          <Text style={{ color: "#b91c1c", marginBottom: 12 }}>{erro}</Text>
          <Pressable style={estilos.botaoNovo} onPress={() => carregar(true)}>
            <Text style={estilos.botaoNovoTexto}>Tentar novamente</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={lista}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
          refreshControl={
            <RefreshControl
              refreshing={atualizando}
              onRefresh={() => {
                setAtualizando(true);
                carregar(false);
              }}
            />
          }
          ListEmptyComponent={
            <Text style={estilos.vazio}>Nenhum chamado encontrado.</Text>
          }
          renderItem={({ item }) => (
            <View style={estilos.cartao}>
              <View style={estilos.cartaoTopo}>
                <Text style={estilos.numero}>
                  #{String(item.numero).padStart(3, "0")}
                </Text>
                <View style={[estilos.pilula, { backgroundColor: corStatus(item.status) + "33" }]}>
                  <View
                    style={[estilos.ponto, { backgroundColor: corStatus(item.status) }]}
                  />
                  <Text style={estilos.pilulaTexto}>{item.status}</Text>
                </View>
              </View>
              <Text style={estilos.cartaoTitulo}>
                {item.tipo} · {item.local}
              </Text>
              <Text style={estilos.cartaoDescricao} numberOfLines={2}>
                {item.descricao}
              </Text>
              <Text style={estilos.cartaoMeta}>
                {item.solicitante} · prioridade {item.prioridade}
              </Text>
              <View style={estilos.acoesCartao}>
                {item.status === "Aberto" && (
                  <Pressable
                    style={estilos.botaoAcao}
                    onPress={() => iniciarAtendimento(item)}
                  >
                    <Text style={estilos.botaoAcaoTexto}>Iniciar atendimento</Text>
                  </Pressable>
                )}
                {item.status !== "Resolvido" && (
                  <Pressable
                    style={[estilos.botaoAcao, estilos.botaoAcaoPrimario]}
                    onPress={() => fecharChamado(item)}
                  >
                    <Text style={[estilos.botaoAcaoTexto, { color: "#fff" }]}>
                      Fechar chamado
                    </Text>
                  </Pressable>
                )}
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

/** Formulário de novo chamado. */
function FormNovoChamado({
  nome,
  onSalvar,
  onCancelar,
}: {
  nome: string;
  onSalvar: (dados: {
    tipo: string;
    local: string;
    descricao: string;
    prioridade: string;
    solicitante: string;
  }) => void;
  onCancelar: () => void;
}) {
  const [tipo, setTipo] = useState<string>("Notebook");
  const [local, setLocal] = useState<string>("Lab 01");
  const [prioridade, setPrioridade] = useState<string>("Média");
  const [descricao, setDescricao] = useState("");
  const [solicitante, setSolicitante] = useState(nome);

  return (
    <View style={estilos.flex}>
      <View style={estilos.topo}>
        <Text style={estilos.titulo}>Novo chamado</Text>
        <Pressable onPress={onCancelar}>
          <Text style={estilos.botaoSairTexto}>Cancelar</Text>
        </Pressable>
      </View>

      <GrupoChips rotulo="Tipo" opcoes={TIPOS} valor={tipo} onSelecionar={setTipo} />
      <GrupoChips rotulo="Local" opcoes={LOCAIS} valor={local} onSelecionar={setLocal} />
      <GrupoChips
        rotulo="Prioridade"
        opcoes={PRIORIDADES}
        valor={prioridade}
        onSelecionar={setPrioridade}
      />

      <Text style={estilos.rotulo}>Solicitante</Text>
      <TextInput
        style={estilos.campoForm}
        placeholder="Seu nome"
        placeholderTextColor="#94a3b8"
        value={solicitante}
        onChangeText={setSolicitante}
        maxLength={60}
      />

      <Text style={estilos.rotulo}>Descrição</Text>
      <TextInput
        style={[estilos.campoForm, { height: 110, textAlignVertical: "top" }]}
        placeholder="O que aconteceu, desde quando e o que já foi tentado…"
        placeholderTextColor="#94a3b8"
        value={descricao}
        onChangeText={setDescricao}
        multiline
        maxLength={1000}
      />
      <Text style={estilos.contador}>{descricao.length}/1000</Text>

      <Pressable
        style={estilos.botaoEntrar}
        onPress={() => {
          if (descricao.trim().length < 10) {
            alert("Descreva o problema com pelo menos 10 caracteres.");
            return;
          }
          if (!solicitante.trim()) {
            alert("Informe o nome do solicitante.");
            return;
          }
          onSalvar({
            tipo,
            local,
            prioridade,
            descricao: descricao.trim(),
            solicitante: solicitante.trim(),
          });
        }}
      >
        <Text style={estilos.botaoEntrarTexto}>Abrir chamado</Text>
      </Pressable>
    </View>
  );
}

function GrupoChips({
  rotulo,
  opcoes,
  valor,
  onSelecionar,
}: {
  rotulo: string;
  opcoes: readonly string[];
  valor: string;
  onSelecionar: (v: string) => void;
}) {
  return (
    <View>
      <Text style={estilos.rotulo}>{rotulo}</Text>
      <View style={estilos.filtros}>
        {opcoes.map((opcao) => (
          <Pressable
            key={opcao}
            onPress={() => onSelecionar(opcao)}
            style={[estilos.chip, valor === opcao && estilos.chipAtivo]}
          >
            <Text
              style={[
                estilos.chipTexto,
                valor === opcao && estilos.chipTextoAtivo,
              ]}
            >
              {opcao}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "#ecf0f4" },
  topo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 8,
  },
  titulo: { fontSize: 24, fontWeight: "800", color: "#0f172a" },
  subtitulo: { fontSize: 13, color: "#64748b", marginTop: 2 },
  botaoSair: {
    borderWidth: 1.5,
    borderColor: "#2e70c0",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  botaoSairTexto: { color: "#2f5996", fontWeight: "700", fontSize: 14 },
  acoes: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  busca: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 44,
    fontSize: 14,
    color: "#0f172a",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  botaoNovo: {
    backgroundColor: "#2e70c0",
    borderRadius: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  botaoNovoTexto: { color: "#fff", fontWeight: "800", fontSize: 14 },
  filtros: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    backgroundColor: "#f8fafc",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipAtivo: { backgroundColor: "#2e70c0", borderColor: "#2e70c0" },
  chipTexto: { fontSize: 13, color: "#334155" },
  chipTextoAtivo: { color: "#fff", fontWeight: "700" },
  vazio: { textAlign: "center", color: "#64748b", marginTop: 32 },
  cartao: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#0f172a",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  cartaoTopo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  numero: { fontVariant: ["tabular-nums"], color: "#64748b", fontSize: 12 },
  pilula: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  ponto: { width: 8, height: 8, borderRadius: 4 },
  pilulaTexto: { fontSize: 12, color: "#0f172a", fontWeight: "600" },
  cartaoTitulo: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
    marginTop: 8,
  },
  cartaoDescricao: { fontSize: 13, color: "#475569", marginTop: 4 },
  cartaoMeta: { fontSize: 12, color: "#94a3b8", marginTop: 6 },
  acoesCartao: { flexDirection: "row", gap: 8, marginTop: 12 },
  botaoAcao: {
    borderWidth: 1.5,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  botaoAcaoPrimario: {
    backgroundColor: "#2e70c0",
    borderColor: "#2e70c0",
  },
  botaoAcaoTexto: { fontSize: 13, fontWeight: "700", color: "#334155" },
  campoForm: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 46,
    fontSize: 15,
    color: "#0f172a",
    marginHorizontal: 16,
  },
  contador: {
    fontSize: 12,
    color: "#94a3b8",
    textAlign: "right",
    marginHorizontal: 16,
    marginTop: 4,
  },
  rotulo: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 6,
    marginTop: 14,
    marginHorizontal: 16,
  },
  botaoEntrar: {
    marginTop: 22,
    marginHorizontal: 16,
    backgroundColor: "#2e70c0",
    borderRadius: 14,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  botaoEntrarTexto: { color: "#fff", fontSize: 16, fontWeight: "800" },
});
