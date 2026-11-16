import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/conectati/AppLayout";
import { usuariosService, type TipoUsuario, type Usuario } from "@/services/conectati";

export const Route = createFileRoute("/usuarios")({ component: () => <AppShell active="usuarios"><Usuarios /></AppShell> });

function Usuarios() {
  const [items, setItems] = useState<Usuario[]>([]);
  const [erro, setErro] = useState("");
  const [form, setForm] = useState({ nome: "", email: "", senha: "", tipo: "INSTRUTOR" as TipoUsuario });
  const [open, setOpen] = useState(false);
  const carregar = () => usuariosService.listar().then(setItems).catch(error => setErro(error.message));

  useEffect(() => { void carregar(); }, []);

  const salvar = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await usuariosService.criar({ ...form, telefone: "", ativo: true });
      setOpen(false);
      setForm({ nome: "", email: "", senha: "", tipo: "INSTRUTOR" });
      carregar();
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Nao foi possivel criar o usuario.");
    }
  };

  const remover = async (id: number) => {
    if (!confirm("Desativar este usuario?")) return;
    try {
      await usuariosService.remover(id);
      carregar();
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Nao foi possivel desativar.");
    }
  };

  return <main className="content"><header className="topbar"><div><h1>Gestao de usuarios</h1><p className="muted">Dados fornecidos pela API.</p></div><button className="btn btn-primary" onClick={() => setOpen(true)}>+ Novo usuario</button></header>{erro && <p className="alerta erro">{erro}</p>}<section className="card reveal visible"><div className="table-wrap"><table className="tabela"><thead><tr><th>Nome</th><th>E-mail</th><th>Cargo</th><th>Ativo</th><th /></tr></thead><tbody>{items.map(item => <tr key={item.id}><td>{item.nome}</td><td>{item.email}</td><td>{item.tipo}</td><td>{item.ativo ? "Sim" : "Nao"}</td><td><button className="btn btn-sm btn-ghost" onClick={() => remover(item.id)}>Desativar</button></td></tr>)}</tbody></table></div></section>{open && <div className="modal"><div className="modal-card reveal visible"><h3>Novo usuario</h3><form className="form" onSubmit={salvar}><label>Nome<input required value={form.nome} onChange={event => setForm({ ...form, nome: event.target.value })} /></label><label>E-mail<input required type="email" value={form.email} onChange={event => setForm({ ...form, email: event.target.value })} /></label><label>Senha<input required minLength={6} type="password" value={form.senha} onChange={event => setForm({ ...form, senha: event.target.value })} /></label><label>Cargo<select value={form.tipo} onChange={event => setForm({ ...form, tipo: event.target.value as TipoUsuario })}><option value="ADMINISTRADOR">Administrador</option><option value="INSTRUTOR">Instrutor</option><option value="TECNICO">Tecnico</option><option value="COORDENADOR">Coordenador</option></select></label><div className="modal-actions"><button type="button" className="btn btn-ghost" onClick={() => setOpen(false)}>Cancelar</button><button className="btn btn-primary">Salvar</button></div></form></div></div>}</main>;
}
