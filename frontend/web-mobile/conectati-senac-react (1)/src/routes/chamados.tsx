import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/conectati/AppLayout";
import { chamadosService, type Chamado } from "@/services/conectati";
import { getUsuario } from "@/services/session";
import { getPermissoes } from "@/lib/conectati/permissions";
import { slug } from "@/lib/conectati/store";

export const Route = createFileRoute("/chamados")({ component: () => <AppShell active="chamados"><Chamados /></AppShell> });

function Chamados() {
  const [items, setItems] = useState<Chamado[]>([]);
  const [busca, setBusca] = useState("");
  const [erro, setErro] = useState("");
  const perm = getPermissoes();
  const usuario = getUsuario();

  useEffect(() => {
    chamadosService.listar().then(setItems).catch(error => setErro(error.message));
  }, []);

  const filtrados = useMemo(() => items.filter(item =>
    (perm?.verChamados !== "proprios" || item.solicitanteId === usuario?.id)
    && (!busca || `${item.titulo} ${item.solicitanteNome} ${item.categoriaNome}`.toLowerCase().includes(busca.toLowerCase()))
  ), [items, busca, perm?.verChamados, usuario?.id]);

  return <main className="content"><header className="topbar"><div><h1>Chamados</h1><p className="muted">Solicitacoes registradas na API.</p></div>{perm?.novoChamado && <Link to="/novo-chamado" className="btn btn-primary">+ Novo chamado</Link>}</header><section className="filters card reveal visible"><input placeholder="Buscar chamado..." value={busca} onChange={event => setBusca(event.target.value)} /></section>{erro && <p className="alerta erro">{erro}</p>}<section className="card reveal visible"><div className="table-wrap"><table className="tabela"><thead><tr><th>#</th><th>Titulo</th><th>Solicitante</th><th>Categoria</th><th>Sala</th><th>Prioridade</th><th>Status</th><th>Data</th></tr></thead><tbody>{filtrados.map(item => <tr key={item.id}><td><b>#{item.id}</b></td><td>{item.titulo}</td><td>{item.solicitanteNome || "-"}</td><td>{item.categoriaNome || "-"}</td><td>{item.salaNome || "-"}</td><td><span className={`prioridade ${slug(item.prioridade)}`}>{item.prioridade}</span></td><td><span className={`status ${slug(item.status)}`}>{item.status}</span></td><td>{new Date(item.dataCriacao).toLocaleDateString("pt-BR")}</td></tr>)}</tbody></table></div>{!erro && !filtrados.length && <p className="muted center">Nenhum chamado encontrado.</p>}</section></main>;
}
