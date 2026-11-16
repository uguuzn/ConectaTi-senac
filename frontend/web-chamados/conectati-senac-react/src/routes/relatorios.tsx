import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/conectati/AppLayout";
import { chamadosService, type Chamado } from "@/services/conectati";

export const Route = createFileRoute("/relatorios")({
  head: () => ({
    meta: [
      { title: "ConectaTI Senac — Relatórios" },
      { name: "description", content: "Indicadores e exportações da unidade." },
    ],
  }),
  component: () => (
    <AppShell active="relatorios">
      <Relatorios />
    </AppShell>
  ),
});

type Grupo = { nome: string; total: number };
const cores = [
  "var(--grad-red)",
  "var(--grad-orange)",
  "var(--grad-yellow)",
  "var(--grad-blue)",
  "var(--grad-teal)",
];

function agrupar(items: Chamado[], campo: (item: Chamado) => string | undefined): Grupo[] {
  const contagem = new Map<string, number>();
  for (const item of items) {
    const nome = campo(item)?.trim();
    if (nome) contagem.set(nome, (contagem.get(nome) || 0) + 1);
  }
  return [...contagem]
    .map(([nome, total]) => ({ nome, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);
}

function Relatorios() {
  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [mes, setMes] = useState(() => new Date().toISOString().slice(0, 7));
  const [categoria, setCategoria] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro("");
    try {
      setChamados(await chamadosService.listar());
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Não foi possível carregar os relatórios.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  const categorias = useMemo(
    () =>
      [
        ...new Set(
          chamados
            .map((item) => item.categoriaNome)
            .filter((nome): nome is string => Boolean(nome)),
        ),
      ].sort(),
    [chamados],
  );
  const filtrados = useMemo(
    () =>
      chamados.filter((item) => {
        const data = new Date(item.dataCriacao);
        const mesItem = Number.isNaN(data.getTime())
          ? ""
          : `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}`;
        return (!mes || mesItem === mes) && (!categoria || item.categoriaNome === categoria);
      }),
    [chamados, mes, categoria],
  );
  const salas = useMemo(() => agrupar(filtrados, (item) => item.salaNome), [filtrados]);
  const equipamentos = useMemo(
    () => agrupar(filtrados, (item) => item.equipamentoNome),
    [filtrados],
  );
  const abertos = filtrados.filter((item) =>
    ["ABERTO", "EM_ANALISE", "EM_ANDAMENTO"].includes(item.status),
  ).length;
  const resolvidos = filtrados.filter((item) => item.status === "CONCLUIDO").length;
  const comEquipamento = filtrados.filter((item) => Boolean(item.equipamentoNome)).length;

  const barras = (items: Grupo[]) =>
    items.length ? (
      items.map((item, index) => (
        <div key={item.nome} className="bar-row">
          <span>{item.nome}</span>
          <div className="bar">
            <i
              style={
                {
                  "--w": `${Math.max(8, (item.total / items[0].total) * 100)}%`,
                  background: cores[index % cores.length],
                } as React.CSSProperties
              }
            />
          </div>
          <b>{item.total}</b>
        </div>
      ))
    ) : (
      <p className="muted">Sem dados para os filtros selecionados.</p>
    );

  return (
    <main className="content">
      <header className="topbar">
        <div>
          <h1>Relatórios</h1>
          <p className="muted">Indicadores calculados a partir dos chamados da API.</p>
        </div>
        <div className="actions-row">
          <button className="btn btn-outline" onClick={() => void carregar()} disabled={carregando}>
            {carregando ? "Atualizando..." : "Atualizar relatório"}
          </button>
          <button
            className="btn btn-primary"
            onClick={() => window.print()}
            disabled={carregando || Boolean(erro)}
          >
            Exportar PDF
          </button>
        </div>
      </header>
      <section className="filters card" aria-label="Filtros do relatório">
        <label>
          Mês
          <input type="month" value={mes} onChange={(event) => setMes(event.target.value)} />
        </label>
        <label>
          Categoria
          <select value={categoria} onChange={(event) => setCategoria(event.target.value)}>
            <option value="">Todas as categorias</option>
            {categorias.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </section>
      {erro && (
        <p role="alert" className="alerta erro">
          {erro}
        </p>
      )}
      <section className="cards-grid">
        {[
          [filtrados.length, "Chamados no período"],
          [resolvidos, "Resolvidos"],
          [abertos, "Pendentes"],
          [comEquipamento, "Com equipamento"],
        ].map(([numero, titulo]) => (
          <div className="card kpi reveal visible" key={String(titulo)}>
            <div>
              <b>{carregando ? "—" : numero}</b>
              <small>{titulo}</small>
            </div>
          </div>
        ))}
      </section>
      <section className="charts">
        <div className="card reveal visible">
          <h3>Salas com mais chamados</h3>
          <div className="bars">{barras(salas)}</div>
        </div>
        <div className="card reveal visible">
          <h3>Equipamentos com mais chamados</h3>
          <div className="bars">{barras(equipamentos)}</div>
        </div>
      </section>
      {!carregando && !erro && filtrados.length === 0 && (
        <p className="muted center">Nenhum chamado encontrado para esse período e categoria.</p>
      )}
    </main>
  );
}
