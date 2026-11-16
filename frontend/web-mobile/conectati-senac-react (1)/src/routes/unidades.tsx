import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/conectati/AppLayout";
import { getUnidades, setUnidades, toast, uid } from "@/lib/conectati/store";
import type { Unidade } from "@/lib/conectati/data";

export const Route = createFileRoute("/unidades")({
  head: () => ({ meta: [{ title: "ConectaTI Senac — Unidades" }, { name: "description", content: "Cadastre e gerencie as unidades Senac." }] }),
  component: () => <AppShell active="unidades"><Uns /></AppShell>,
});

function Uns() {
  const [arr, setArr] = useState<Unidade[]>([]);
  const [editing, setEditing] = useState<Unidade | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ nome: "", cidade: "", salas: 10 });

  const refresh = () => setArr(getUnidades());
  useEffect(refresh, []);

  const abrir = (u?: Unidade) => {
    if (u) { setEditing(u); setForm({ nome: u.nome, cidade: u.cidade, salas: u.salas }); }
    else { setEditing(null); setForm({ nome: "", cidade: "", salas: 10 }); }
    setOpen(true);
  };

  const salvar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome) { toast("Informe o nome."); return; }
    const list = getUnidades();
    if (editing) { const u = list.find(x => x.id === editing.id); if (u) Object.assign(u, form); }
    else { list.push({ id: uid("un"), ...form }); }
    setUnidades(list);
    toast(editing ? "Unidade atualizada." : "Unidade criada.");
    setOpen(false); refresh();
  };

  const excluir = (id: string) => {
    if (!confirm("Excluir esta unidade?")) return;
    setUnidades(getUnidades().filter(x => x.id !== id));
    toast("Unidade excluída."); refresh();
  };

  return (
    <main className="content">
      <header className="topbar">
        <div>
          <h1>Gestão de unidades</h1>
          <p className="muted">Cadastre e gerencie as unidades Senac.</p>
        </div>
        <button className="btn btn-primary" onClick={() => abrir()}>+ Nova unidade</button>
      </header>
      <section className="card reveal visible">
        <div className="table-wrap">
          <table className="tabela">
            <thead><tr><th>Nome</th><th>Cidade / DF</th><th>Salas cadastradas</th><th>Ações</th></tr></thead>
            <tbody>
              {arr.map(u => (
                <tr key={u.id}>
                  <td><b>{u.nome}</b></td>
                  <td>{u.cidade}</td>
                  <td>{u.salas}</td>
                  <td>
                    <button className="btn btn-sm btn-ghost" onClick={() => abrir(u)}>Editar</button>
                    <button className="btn btn-sm btn-ghost" onClick={() => excluir(u.id)}>Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      {open && (
        <div className="modal">
          <div className="modal-card reveal visible">
            <h3>{editing ? "Editar unidade" : "Nova unidade"}</h3>
            <form className="form" onSubmit={salvar}>
              <label>Nome <input value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} placeholder="Ex.: Senac Taguatinga Sul" required /></label>
              <label>Cidade / DF <input value={form.cidade} onChange={e => setForm({ ...form, cidade: e.target.value })} placeholder="Ex.: Taguatinga/DF" required /></label>
              <label>Salas cadastradas <input type="number" min={0} value={form.salas} onChange={e => setForm({ ...form, salas: parseInt(e.target.value, 10) || 0 })} /></label>
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setOpen(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
