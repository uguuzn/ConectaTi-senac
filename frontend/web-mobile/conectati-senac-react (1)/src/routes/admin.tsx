import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { chamadosService, equipamentosService, usuariosService, type Chamado, type Equipamento, type Usuario } from "@/services/conectati";
import { getUsuario } from "@/services/session";

export const Route = createFileRoute("/admin")({ component: AdminPage });

function AdminPage() {
  const nav = useNavigate();
  const [dados, setDados] = useState<{ chamados: Chamado[]; equipamentos: Equipamento[]; usuarios: Usuario[] } | null>(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (getUsuario()?.tipo !== "ADMINISTRADOR") {
      nav({ to: "/login" });
      return;
    }
    Promise.all([chamadosService.listar(), equipamentosService.listar(), usuariosService.listar()])
      .then(([chamados, equipamentos, usuarios]) => setDados({ chamados, equipamentos, usuarios }))
      .catch(error => setErro(error.message));
  }, [nav]);

  if (!dados && !erro) return <main className="content"><p className="muted">Carregando administracao...</p></main>;

  const abertos = dados?.chamados.filter(item => item.status === "ABERTO").length || 0;
  return <main className="content admin-desktop"><header className="topbar"><div><h1>Administracao</h1><p className="muted">Visao de gerenciamento para computador.</p></div><Link to="/home" className="btn btn-outline">Abrir area web</Link></header>{erro && <p className="alerta erro">{erro}</p>}<section className="cards-grid">{[[dados?.usuarios.length || 0, "Usuarios"], [dados?.chamados.length || 0, "Chamados"], [abertos, "Chamados abertos"], [dados?.equipamentos.length || 0, "Equipamentos"]].map(([valor, rotulo]) => <div key={String(rotulo)} className="card kpi reveal visible"><div><b>{valor}</b><small>{rotulo}</small></div></div>)}</section><section className="charts"><div className="card reveal visible"><h3>Atalhos administrativos</h3><div className="actions-row"><Link className="btn btn-primary" to="/usuarios">Gerenciar usuarios</Link><Link className="btn btn-outline" to="/chamados">Todos os chamados</Link><Link className="btn btn-outline" to="/equipamentos">Equipamentos</Link><Link className="btn btn-outline" to="/relatorios">Indicadores</Link></div></div><div className="card reveal visible"><h3>Chamados recentes</h3><div className="table-wrap"><table className="tabela"><thead><tr><th>#</th><th>Titulo</th><th>Status</th><th>Solicitante</th></tr></thead><tbody>{dados?.chamados.slice(0, 6).map(item => <tr key={item.id}><td>#{item.id}</td><td>{item.titulo}</td><td>{item.status}</td><td>{item.solicitanteNome || "-"}</td></tr>)}</tbody></table></div></div></section></main>;
}
