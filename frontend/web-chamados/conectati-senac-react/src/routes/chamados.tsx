import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/conectati/AppLayout";
import { chamadosService, type Chamado } from "@/services/conectati";
import { getUsuario } from "@/services/session";
import { getPermissoes } from "@/lib/conectati/permissions";
import { slug } from "@/lib/conectati/store";

export const Route = createFileRoute("/chamados")({
  component: () => (
    <AppShell active="chamados">
      <Chamados />
    </AppShell>
  ),
});

function Chamados() {
  const [items, setItems] = useState<Chamado[]>([]);
  const [busca, setBusca] = useState("");
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [ocupado, setOcupado] = useState<number | null>(null);
  const [relatorioId, setRelatorioId] = useState<number | null>(null);
  const [relatorio, setRelatorio] = useState({
    problemaIdentificado: "",
    diagnostico: "",
    procedimentosRealizados: "",
    solucaoAplicada: "",
    observacoes: "",
  });
  const perm = getPermissoes();
  const usuario = getUsuario();
  const suporte = perm?.acoes === true;

  const recarregar = async () => setItems(await chamadosService.listar());

  const executarAcao = async (
    item: Chamado,
    acao: "assumir" | "iniciar" | "concluir" | "cancelar",
  ) => {
    setErro("");
    setMensagem("");
    setOcupado(item.id);
    try {
      if (acao === "assumir") await chamadosService.assumir(item.id);
      if (acao === "iniciar")
        await chamadosService.alterarStatus(item.id, { status: "EM_ANDAMENTO" });
      if (acao === "concluir")
        await chamadosService.alterarStatus(item.id, {
          status: "CONCLUIDO",
          solucao: item.solucao,
        });
      if (acao === "cancelar") {
        const justificativaCancelamento = window
          .prompt("Informe a justificativa do cancelamento:")
          ?.trim();
        if (!justificativaCancelamento) return;
        await chamadosService.alterarStatus(item.id, {
          status: "CANCELADO",
          justificativaCancelamento,
        });
      }
      await recarregar();
      setMensagem(`Chamado #${item.id} atualizado.`);
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Não foi possível atualizar o chamado.");
    } finally {
      setOcupado(null);
    }
  };

  const salvarRelatorio = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (relatorioId === null) return;
    setErro("");
    setMensagem("");
    setOcupado(relatorioId);
    try {
      await chamadosService.registrarRelatorio(relatorioId, relatorio);
      await recarregar();
      setMensagem(`Relatório técnico do chamado #${relatorioId} salvo.`);
      setRelatorioId(null);
      setRelatorio({
        problemaIdentificado: "",
        diagnostico: "",
        procedimentosRealizados: "",
        solucaoAplicada: "",
        observacoes: "",
      });
    } catch (error) {
      setErro(
        error instanceof Error ? error.message : "Não foi possível salvar o relatório técnico.",
      );
    } finally {
      setOcupado(null);
    }
  };

  useEffect(() => {
    chamadosService
      .listar()
      .then(setItems)
      .catch((error) => setErro(error.message));
  }, []);

  const filtrados = useMemo(
    () =>
      items.filter(
        (item) =>
          (perm?.verChamados !== "proprios" || item.solicitanteId === usuario?.id) &&
          (!busca ||
            `${item.titulo} ${item.solicitanteNome} ${item.categoriaNome}`
              .toLowerCase()
              .includes(busca.toLowerCase())),
      ),
    [items, busca, perm?.verChamados, usuario?.id],
  );

  return (
    <main className="content">
      <header className="topbar">
        <div>
          <h1>Chamados</h1>
          <p className="muted">Solicitacoes registradas na API.</p>
        </div>
        {perm?.novoChamado && (
          <Link to="/novo-chamado" className="btn btn-primary">
            + Novo chamado
          </Link>
        )}
      </header>
      {suporte && (
        <section className="support-intro card">
          <h2>Central de suporte</h2>
          <p className="muted">
            Assuma chamados, registre o atendimento e acompanhe sua fila pelo celular.
          </p>
        </section>
      )}
      <section className="filters card reveal visible">
        <input
          placeholder="Buscar chamado..."
          value={busca}
          onChange={(event) => setBusca(event.target.value)}
        />
      </section>
      {erro && <p className="alerta erro">{erro}</p>}
      {mensagem && (
        <p className="alerta sucesso" role="status">
          {mensagem}
        </p>
      )}
      {suporte ? (
        <section className="support-queue" aria-label="Fila de chamados de suporte">
          {filtrados.map((item) => {
            const meuChamado = item.tecnicoResponsavelId === usuario?.id;
            const terminal = item.status === "CONCLUIDO" || item.status === "CANCELADO";
            const temRelatorio = Boolean(
              item.problemaIdentificado &&
              item.diagnostico &&
              item.procedimentosRealizados &&
              item.solucao,
            );
            return (
              <article className="support-ticket card" key={item.id}>
                <div className="support-ticket-heading">
                  <div>
                    <span className="muted">Chamado #{item.id}</span>
                    <h2>{item.titulo}</h2>
                  </div>
                  <span className={`status ${slug(item.status)}`}>
                    {item.status.replaceAll("_", " ")}
                  </span>
                </div>
                <p>{item.descricao}</p>
                <dl className="support-ticket-facts">
                  <div>
                    <dt>Solicitante</dt>
                    <dd>{item.solicitanteNome || "—"}</dd>
                  </div>
                  <div>
                    <dt>Categoria</dt>
                    <dd>{item.categoriaNome || "—"}</dd>
                  </div>
                  <div>
                    <dt>Prioridade</dt>
                    <dd>{item.prioridade}</dd>
                  </div>
                  <div>
                    <dt>Responsável</dt>
                    <dd>{item.tecnicoResponsavelNome || "Fila aberta"}</dd>
                  </div>
                </dl>
                {!terminal && (
                  <div className="support-actions">
                    {!item.tecnicoResponsavelId && (
                      <button
                        className="btn btn-primary"
                        disabled={ocupado === item.id}
                        onClick={() => executarAcao(item, "assumir")}
                      >
                        Assumir chamado
                      </button>
                    )}
                    {meuChamado && item.status === "EM_ANALISE" && (
                      <button
                        className="btn btn-primary"
                        disabled={ocupado === item.id}
                        onClick={() => executarAcao(item, "iniciar")}
                      >
                        Iniciar atendimento
                      </button>
                    )}
                    {meuChamado && item.status !== "ABERTO" && (
                      <button
                        className="btn btn-outline"
                        onClick={() => setRelatorioId(relatorioId === item.id ? null : item.id)}
                      >
                        Registrar atendimento
                      </button>
                    )}
                    {meuChamado && item.status === "EM_ANDAMENTO" && temRelatorio && (
                      <button
                        className="btn btn-primary"
                        disabled={ocupado === item.id}
                        onClick={() => executarAcao(item, "concluir")}
                      >
                        Concluir chamado
                      </button>
                    )}
                    {meuChamado && (
                      <button
                        className="btn btn-ghost"
                        disabled={ocupado === item.id}
                        onClick={() => executarAcao(item, "cancelar")}
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                )}
                {meuChamado && !temRelatorio && item.status !== "ABERTO" && (
                  <p className="muted support-hint">
                    Para concluir, registre os dados do atendimento.
                  </p>
                )}
                {relatorioId === item.id && (
                  <form className="support-report" onSubmit={salvarRelatorio}>
                    <h3>Relatório técnico</h3>
                    <label>
                      Problema identificado
                      <input
                        required
                        value={relatorio.problemaIdentificado}
                        onChange={(event) =>
                          setRelatorio({ ...relatorio, problemaIdentificado: event.target.value })
                        }
                      />
                    </label>
                    <label>
                      Diagnóstico
                      <textarea
                        required
                        rows={3}
                        value={relatorio.diagnostico}
                        onChange={(event) =>
                          setRelatorio({ ...relatorio, diagnostico: event.target.value })
                        }
                      />
                    </label>
                    <label>
                      Procedimentos realizados
                      <textarea
                        required
                        rows={3}
                        value={relatorio.procedimentosRealizados}
                        onChange={(event) =>
                          setRelatorio({
                            ...relatorio,
                            procedimentosRealizados: event.target.value,
                          })
                        }
                      />
                    </label>
                    <label>
                      Solução aplicada
                      <textarea
                        required
                        rows={3}
                        value={relatorio.solucaoAplicada}
                        onChange={(event) =>
                          setRelatorio({ ...relatorio, solucaoAplicada: event.target.value })
                        }
                      />
                    </label>
                    <label>
                      Observações (opcional)
                      <textarea
                        rows={2}
                        value={relatorio.observacoes}
                        onChange={(event) =>
                          setRelatorio({ ...relatorio, observacoes: event.target.value })
                        }
                      />
                    </label>
                    <button className="btn btn-primary" disabled={ocupado === item.id}>
                      {ocupado === item.id ? "Salvando…" : "Salvar relatório"}
                    </button>
                  </form>
                )}
              </article>
            );
          })}
          {!erro && !filtrados.length && (
            <p className="muted center card">Nenhum chamado na fila.</p>
          )}
        </section>
      ) : (
        <section className="card reveal visible">
          <div className="table-wrap">
            <table className="tabela">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Titulo</th>
                  <th>Solicitante</th>
                  <th>Categoria</th>
                  <th>Sala</th>
                  <th>Prioridade</th>
                  <th>Status</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <b>#{item.id}</b>
                    </td>
                    <td>{item.titulo}</td>
                    <td>{item.solicitanteNome || "-"}</td>
                    <td>{item.categoriaNome || "-"}</td>
                    <td>{item.salaNome || "-"}</td>
                    <td>
                      <span className={`prioridade ${slug(item.prioridade)}`}>
                        {item.prioridade}
                      </span>
                    </td>
                    <td>
                      <span className={`status ${slug(item.status)}`}>{item.status}</span>
                    </td>
                    <td>{new Date(item.dataCriacao).toLocaleDateString("pt-BR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!erro && !filtrados.length && <p className="muted center">Nenhum chamado encontrado.</p>}
        </section>
      )}
    </main>
  );
}
