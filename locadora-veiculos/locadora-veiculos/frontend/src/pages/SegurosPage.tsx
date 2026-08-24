import { useEffect, useState } from 'react';
import { api } from '../api';
import type { Seguro } from '../types';

export default function SegurosPage() {
  const [lista, setLista] = useState<Seguro[]>([]);
  const [form, setForm] = useState({ nome: '', valorDiaria: '' });

  async function carregar() { setLista(await api.listarSeguros()); }
  useEffect(() => { carregar(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await api.criarSeguro({ nome: form.nome, valorDiaria: Number(form.valorDiaria) });
    setForm({ nome: '', valorDiaria: '' });
    carregar();
  }

  function fmt(v: number) { return 'R$ ' + v.toFixed(2).replace('.', ','); }

  return (
    <div className="page">
      <div className="page-head">
        <h1>Seguros</h1>
        <p>Opções de seguro oferecidas na locação.</p>
      </div>
      <div className="card">
        <form className="grid-form" onSubmit={handleSubmit}>
          <input placeholder="Nome (ex: Completo)" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} required />
          <input type="number" step="0.01" placeholder="Valor por dia (R$)" value={form.valorDiaria}
            onChange={e => setForm({ ...form, valorDiaria: e.target.value })} required />
          <button type="submit" className="btn-primary">Adicionar</button>
        </form>
      </div>
      <div className="card">
        <table className="data-table">
          <thead><tr><th>Nome</th><th>Valor/dia</th></tr></thead>
          <tbody>
            {lista.map(s => <tr key={s.id}><td>{s.nome}</td><td>{fmt(s.valorDiaria)}</td></tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );
}
