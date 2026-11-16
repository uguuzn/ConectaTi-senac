import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/conectati/AppLayout";
import { categoriasService, chamadosService, salasService, type Categoria, type Sala } from "@/services/conectati";

export const Route = createFileRoute("/novo-chamado")({ component: () => <AppShell active="novo-chamado"><NovoChamado /></AppShell> });

function NovoChamado() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [salas, setSalas] = useState<Sala[]>([]);
  const [form, setForm] = useState({ titulo: "", descricao: "", prioridade: "MEDIA", categoriaId: "", salaId: "" });
  const [alerta, setAlerta] = useState("");

  useEffect(() => {
    categoriasService.listar().then(setCategorias).catch(error => setAlerta(error.message));
    salasService.listar().then(setSalas).catch(error => setAlerta(error.message));
  }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const chamado = await chamadosService.criar({
        titulo: form.titulo,
        descricao: form.descricao,
        prioridade: form.prioridade,
        categoriaId: Number(form.categoriaId),
        ...(form.salaId ? { salaId: Number(form.salaId) } : {}),
      });
      setAlerta(`Chamado #${chamado.id} criado com sucesso.`);
      setForm({ titulo: "", descricao: "", prioridade: "MEDIA", categoriaId: "", salaId: "" });
    } catch (error) {
      setAlerta(error instanceof Error ? error.message : "Nao foi possivel registrar o chamado.");
    }
  };

  return <main className="content"><header className="topbar"><div><h1>Abrir novo chamado</h1><p className="muted">Descreva sua solicitacao.</p></div></header><section className="card reveal visible"><form className="form form-grid" onSubmit={submit}><label>Titulo<input required value={form.titulo} onChange={event => setForm({ ...form, titulo: event.target.value })} /></label><label>Prioridade<select value={form.prioridade} onChange={event => setForm({ ...form, prioridade: event.target.value })}><option value="BAIXA">Baixa</option><option value="MEDIA">Media</option><option value="ALTA">Alta</option><option value="URGENTE">Urgente</option></select></label><label>Categoria<select required value={form.categoriaId} onChange={event => setForm({ ...form, categoriaId: event.target.value })}><option value="">Selecione</option>{categorias.map(item => <option key={item.id} value={item.id}>{item.nome}</option>)}</select></label><label>Sala (opcional)<select value={form.salaId} onChange={event => setForm({ ...form, salaId: event.target.value })}><option value="">Nao informar</option>{salas.map(item => <option key={item.id} value={item.id}>{item.nome}</option>)}</select></label><label className="full">Descricao<textarea required rows={5} value={form.descricao} onChange={event => setForm({ ...form, descricao: event.target.value })} /></label>{alerta && <div className="alerta sucesso full">{alerta}</div>}<div className="full actions-row"><button className="btn btn-primary">Enviar chamado</button></div></form></section></main>;
}
