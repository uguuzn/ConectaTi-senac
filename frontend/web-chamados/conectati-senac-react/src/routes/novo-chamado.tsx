import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/conectati/AppLayout";
import {
  categoriasService,
  chamadosService,
  salasService,
  type Categoria,
  type Sala,
} from "@/services/conectati";

export const Route = createFileRoute("/novo-chamado")({
  component: () => (
    <AppShell active="novo-chamado">
      <NovoChamado />
    </AppShell>
  ),
});

type Feedback = { kind: "success" | "error"; text: string };
const emptyForm = { titulo: "", descricao: "", prioridade: "MEDIA", categoriaId: "", salaId: "" };

function NovoChamado() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [salas, setSalas] = useState<Sala[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([categoriasService.listar(), salasService.listar()])
      .then(([itemsCategorias, itemsSalas]) => {
        if (!active) return;
        setCategorias(itemsCategorias);
        setSalas(itemsSalas);
      })
      .catch((error) => {
        if (active)
          setFeedback({
            kind: "error",
            text:
              error instanceof Error
                ? error.message
                : "Não foi possível carregar categorias e salas.",
          });
      });
    return () => {
      active = false;
    };
  }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFeedback(null);
    setSubmitting(true);
    try {
      const chamado = await chamadosService.criar({
        titulo: form.titulo.trim(),
        descricao: form.descricao.trim(),
        prioridade: form.prioridade,
        categoriaId: Number(form.categoriaId),
        ...(form.salaId ? { salaId: Number(form.salaId) } : {}),
      });
      setFeedback({ kind: "success", text: `Chamado #${chamado.id} criado com sucesso.` });
      setForm(emptyForm);
    } catch (error) {
      setFeedback({
        kind: "error",
        text: error instanceof Error ? error.message : "Não foi possível registrar o chamado.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="content">
      <header className="topbar">
        <div>
          <h1>Abrir novo chamado</h1>
          <p className="muted">Descreva sua solicitação.</p>
        </div>
      </header>
      <section className="card reveal visible">
        <form className="form form-grid" onSubmit={submit}>
          <label>
            Título
            <input
              required
              maxLength={150}
              value={form.titulo}
              onChange={(event) => setForm({ ...form, titulo: event.target.value })}
            />
          </label>
          <label>
            Prioridade
            <select
              value={form.prioridade}
              onChange={(event) => setForm({ ...form, prioridade: event.target.value })}
            >
              <option value="BAIXA">Baixa</option>
              <option value="MEDIA">Média</option>
              <option value="ALTA">Alta</option>
              <option value="URGENTE">Urgente</option>
            </select>
          </label>
          <label>
            Categoria
            <select
              required
              value={form.categoriaId}
              onChange={(event) => setForm({ ...form, categoriaId: event.target.value })}
            >
              <option value="">Selecione</option>
              {categorias.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nome}
                </option>
              ))}
            </select>
          </label>
          <label>
            Sala (opcional)
            <select
              value={form.salaId}
              onChange={(event) => setForm({ ...form, salaId: event.target.value })}
            >
              <option value="">Não informar</option>
              {salas.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nome}
                </option>
              ))}
            </select>
          </label>
          <label className="full">
            Descrição
            <textarea
              required
              maxLength={5000}
              rows={5}
              value={form.descricao}
              onChange={(event) => setForm({ ...form, descricao: event.target.value })}
            />
          </label>
          {feedback && (
            <div
              role="status"
              aria-live="polite"
              className={`alerta ${feedback.kind === "success" ? "sucesso" : "erro"} full`}
            >
              {feedback.text}
            </div>
          )}
          <div className="full actions-row">
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Enviando..." : "Enviar chamado"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
