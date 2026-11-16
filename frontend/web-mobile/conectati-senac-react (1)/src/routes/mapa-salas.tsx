import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/conectati/AppLayout";
import { getSalas, setSalas, getSolicitacoes, setSolicitacoes, getUsuarios, slug, toast } from "@/lib/conectati/store";
import type { Sala, Solicitacao } from "@/lib/conectati/data";

export const Route = createFileRoute("/mapa-salas")({
  head: () => ({ meta: [{ title: "ConectaTI Senac — Mapa de salas" }, { name: "description", content: "Controle das chaves de salas e auditórios." }] }),
  component: () => <AppShell active="mapa-salas"><MapaPage /></AppShell>,
});

function MapaPage() {
  const [salas, setSalasSt] = useState<Sala[]>([]);
  const [pend, setPend] = useState<Solicitacao[]>([]);
  const [modal, setModal] = useState<{ sala: string; solicitacaoId?: string; respId?: string; motivo?: string } | null>(null);
  const [respId, setRespId] = useState("");
  const [motivo, setMotivo] = useState("");

  const refresh = () => {
    setSalasSt(getSalas());
    setPend(getSolicitacoes().filter(s => s.status === "Pendente"));
  };
  useEffect(refresh, []);

  const usuarios = typeof window !== "undefined" ? getUsuarios().filter(u => u.perfil === "Instrutor" || u.perfil === "Coordenação") : [];

  const abrirModal = (sala: string, opts?: { solicitacaoId?: string; respId?: string; motivo?: string }) => {
    setModal({ sala, ...opts });
    setRespId(opts?.respId || usuarios[0]?.id || "");
    setMotivo(opts?.motivo || "");
  };

  const entregarChave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modal) return;
    const resp = getUsuarios().find(u => u.id === respId);
    if (!resp) return;
    const arr = getSalas();
    const idx = arr.findIndex(x => x.nome === modal.sala);
    if (idx < 0) return;
    arr[idx].chave = { responsavelId: resp.id, responsavelNome: resp.nome, perfil: resp.perfil, motivo, desde: new Date().toISOString() };
    setSalas(arr);
    if (modal.solicitacaoId) {
      const sols = getSolicitacoes();
      const s = sols.find(x => x.id === modal.solicitacaoId);
      if (s) { s.status = "Atribuída"; s.salaAtribuida = modal.sala; setSolicitacoes(sols); }
    }
    toast(`Chave da ${modal.sala} entregue a ${resp.nome}.`);
    setModal(null);
    refresh();
  };

  const devolver = (nome: string) => {
    const arr = getSalas();
    const idx = arr.findIndex(x => x.nome === nome);
    if (idx < 0) return;
    arr[idx].chave = null;
    setSalas(arr);
    toast(`Chave da ${nome} devolvida.`);
    refresh();
  };

  const negar = (id: string) => {
    const arr = getSolicitacoes();
    const s = arr.find(x => x.id === id); if (!s) return;
    s.status = "Negada"; setSolicitacoes(arr);
    toast("Solicitação negada."); refresh();
  };

  const livres = salas.filter(s => !s.chave).length;
  const chaves = salas.length - livres;

  return (
    <main className="content">
      <header className="topbar">
        <div>
          <h1>Mapa de salas</h1>
          <p className="muted">Controle das chaves de salas e auditórios da unidade.</p>
        </div>
      </header>

      <section className="cards-grid kpi-small">
        <div className="card kpi reveal visible"><span className="kpi-icon" style={{ background: "var(--grad-green)" }} /><div><b>{livres}</b><small>Salas livres</small></div></div>
        <div className="card kpi reveal visible"><span className="kpi-icon" style={{ background: "var(--grad-yellow)" }} /><div><b>{chaves}</b><small>Chaves em uso</small></div></div>
        <div className="card kpi reveal visible"><span className="kpi-icon" style={{ background: "var(--grad-orange)" }} /><div><b>{pend.length}</b><small>Solicitações pendentes</small></div></div>
        <div className="card kpi reveal visible"><span className="kpi-icon" style={{ background: "var(--grad-blue)" }} /><div><b>{salas.length}</b><small>Salas cadastradas</small></div></div>
      </section>

      <section className="card reveal visible" style={{ marginTop: 20 }}>
        <h3>Mapa das salas</h3>
        <div className="mapa-grid">
          {salas.map(s => {
            const emUso = !!s.chave;
            return (
              <div key={s.nome} className={`sala-cell ${emUso ? "ocupada" : "livre"} ${slug(s.tipo)}`}>
                <div className="sala-topo"><b>{s.nome}</b><span className="badge-mini">{s.tipo}</span></div>
                <div className="sala-status">
                  {emUso ? (
                    <>
                      <span className="status em-atendimento">Chave com {s.chave!.responsavelNome}</span>
                      <small className="muted">{s.chave!.motivo || ""}</small>
                    </>
                  ) : <span className="status resolvido">Chave disponível</span>}
                </div>
                <div className="sala-actions">
                  {emUso
                    ? <button className="btn btn-sm btn-ghost" onClick={() => devolver(s.nome)}>Devolver chave</button>
                    : <button className="btn btn-sm btn-primary" onClick={() => abrirModal(s.nome)}>Atribuir chave</button>}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="card reveal visible" style={{ marginTop: 20 }}>
        <h3>Solicitações de sala pendentes</h3>
        <div className="table-wrap">
          <table className="tabela">
            <thead><tr><th>Nº</th><th>Instrutor</th><th>Turma</th><th>Sala preferida</th><th>Data</th><th>Horário</th><th>Ações</th></tr></thead>
            <tbody>
              {pend.map(s => {
                const inst = getUsuarios().find(u => u.email.toLowerCase() === s.instrutorEmail);
                return (
                  <tr key={s.id}>
                    <td><b>#{s.n}</b></td>
                    <td>{s.instrutorNome}</td>
                    <td>{s.turma}</td>
                    <td>{s.salaPreferida}</td>
                    <td>{s.data}</td>
                    <td>{s.hora}</td>
                    <td>
                      <button className="btn btn-sm btn-primary" onClick={() => abrirModal(s.salaPreferida, { solicitacaoId: s.id, respId: inst?.id, motivo: `${s.turma} — ${s.data} ${s.hora}` })}>Atribuir chave</button>
                      <button className="btn btn-sm btn-ghost" onClick={() => negar(s.id)}>Negar</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {pend.length === 0 && <p className="muted center">Nenhuma solicitação pendente.</p>}
      </section>

      {modal && (
        <div className="modal">
          <div className="modal-card reveal visible">
            <h3>Atribuir chave — {modal.sala}</h3>
            <form className="form" onSubmit={entregarChave}>
              <label>Responsável (Instrutor / Coordenador)
                <select value={respId} onChange={e => setRespId(e.target.value)}>
                  {usuarios.map(u => <option key={u.id} value={u.id}>{u.nome} — {u.perfil}</option>)}
                </select>
              </label>
              <label>Turma / Motivo
                <input value={motivo} onChange={e => setMotivo(e.target.value)} placeholder="Ex.: Turma TDS Manhã / Reunião" />
              </label>
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setModal(null)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Entregar chave</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
