import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/conectati/AppLayout";
import { chamadosService, equipamentosService, type Chamado, type Equipamento } from "@/services/conectati";
import { getUsuario } from "@/services/session";

export const Route = createFileRoute("/dashboard")({ component: () => <AppShell active="dashboard"><Dashboard /></AppShell> });

function Dashboard() {
  const [dados, setDados] = useState<{ chamados: Chamado[]; equipamentos: Equipamento[] } | null>(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const usuario = getUsuario();
    const equipamentosPromise = usuario?.tipo === "INSTRUTOR" ? Promise.resolve([] as Equipamento[]) : equipamentosService.listar();
    Promise.all([chamadosService.listar(), equipamentosPromise])
      .then(([chamados, equipamentos]) => setDados({ chamados, equipamentos }))
      .catch(error => setErro(error.message));
  }, []);

  const cards = dados ? [
    [dados.chamados.length, "Chamados"],
    [dados.chamados.filter(item => item.status === "ABERTO").length, "Abertos"],
    [dados.chamados.filter(item => item.status === "CONCLUIDO").length, "Concluidos"],
    [dados.equipamentos.length, "Equipamentos"],
  ] : [];

  return <main className="content"><header className="topbar"><div><h1>Dashboard</h1><p className="muted">Indicadores calculados a partir dos dados da API.</p></div><Link to="/chamados" className="btn btn-primary">Ver chamados</Link></header>{erro && <p className="alerta erro">{erro}</p>}<section className="cards-grid">{cards.map(([numero, titulo]) => <div className="card kpi reveal visible" key={String(titulo)}><div><b>{numero}</b><small>{titulo}</small></div></div>)}</section></main>;
}
