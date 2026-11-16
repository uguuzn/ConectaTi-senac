import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/conectati/AppLayout";
import { TURMAS_DEFAULT, type Turma, type Solicitacao } from "@/lib/conectati/data";
import { getSalas, getSolicitacoes, setSolicitacoes, getUsuarios, slug, toast, uid } from "@/lib/conectati/store";
import { getUsuario } from "@/services/session";

export const Route = createFileRoute("/minhas-turmas")({
  head: () => ({ meta: [{ title: "ConectaTI Senac — Minhas turmas" }, { name: "description", content: "Turmas do instrutor e solicitações de sala." }] }),
  component: () => <AppShell active="minhas-turmas"><Turmas /></AppShell>,
});

function Turmas() {
  const turmas = TURMAS_DEFAULT;
  const [modalTurma, setModalTurma] = useState<Turma | null>(null);
  const [minhas, setMinhas] = useState<Solicitacao[]>([]);
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [sala, setSala] = useState("");
  const [obs, setObs] = useState("");
  const email = getUsuario()?.email.toLowerCase() || "";
  const salas = typeof window !== "undefined" ? getSalas() : [];

  const refresh = () => setMinhas(getSolicitacoes().filter(s => s.instrutorEmail === email).slice().reverse());
  useEffect(refresh, [email]);

  const abrir = (t: Turma) => {
    setModalTurma(t);
    const hoje = new Date();
    setData(hoje.toISOString().slice(0, 10));
    setHora(t.horario.slice(0, 5));
    setSala(salas[0]?.nome || "");
    setObs("");
  };

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalTurma) return;
    const nova: Solicitacao = {
      id: uid("sol"),
      n: String(Math.floor(Math.random() * 900) + 100),
      instrutorEmail: email,
      instrutorNome: getUsuarios().find(u => u.email.toLowerCase() === email)?.nome || "Instrutor",
      turma: modalTurma.turma,
      salaPreferida: sala, data, hora, obs,
      status: "Pendente", salaAtribuida: null,
    };
    const arr = getSolicitacoes(); arr.push(nova); setSolicitacoes(arr);
    toast("Solicitação enviada.");
    setModalTurma(null); refresh();
  };

  return (
    <main className="content">
      <header className="topbar">
        <div>
          <h1>Minhas turmas</h1>
          <p className="muted">Visualize suas turmas e solicite uma sala para a aula.</p>
        </div>
      </header>

      <section className="cards-grid">
        {turmas.map((t, i) => (
          <div key={t.id} className="card turma-card reveal visible" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="turma-head">
              <h3>{t.turma}</h3>
              <span className="badge-mini">{t.alunos} alunos</span>
            </div>
            <p className="muted">{t.curso}</p>
            <div className="turma-info">
              <span><b>Horário:</b> {t.horario}</span>
              <span><b>Dias:</b> {t.dias}</span>
            </div>
            <button className="btn btn-primary btn-block" onClick={() => abrir(t)}>Solicitar sala</button>
          </div>
        ))}
      </section>

      <section className="card reveal visible" style={{ marginTop: 24 }}>
        <h3>Minhas solicitações de sala</h3>
        <div className="table-wrap">
          <table className="tabela">
            <thead><tr><th>Nº</th><th>Turma</th><th>Sala preferida</th><th>Data</th><th>Horário</th><th>Status</th><th>Sala atribuída</th></tr></thead>
            <tbody>
              {minhas.map(s => (
                <tr key={s.id}>
                  <td><b>#{s.n}</b></td>
                  <td>{s.turma}</td>
                  <td>{s.salaPreferida}</td>
                  <td>{s.data}</td>
                  <td>{s.hora}</td>
                  <td><span className={`status ${slug(s.status)}`}>{s.status}</span></td>
                  <td>{s.salaAtribuida || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {minhas.length === 0 && <p className="muted center">Você ainda não fez solicitações.</p>}
      </section>

      {modalTurma && (
        <div className="modal">
          <div className="modal-card reveal visible">
            <h3>Solicitar sala — {modalTurma.turma}</h3>
            <form className="form" onSubmit={enviar}>
              <label>Data <input type="date" value={data} onChange={e => setData(e.target.value)} required /></label>
              <label>Horário <input type="time" value={hora} onChange={e => setHora(e.target.value)} required /></label>
              <label>Sala preferida
                <select value={sala} onChange={e => setSala(e.target.value)}>
                  {salas.map(s => <option key={s.nome} value={s.nome}>{s.nome} ({s.tipo})</option>)}
                </select>
              </label>
              <label>Observação
                <textarea rows={3} value={obs} onChange={e => setObs(e.target.value)} placeholder="Ex.: preciso de projetor..." />
              </label>
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setModalTurma(null)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Enviar solicitação</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
