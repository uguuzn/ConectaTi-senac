import { useEffect, useState } from 'react';
import { api } from '../api';
import type { Categoria } from '../types';

export default function CategoriasPage() {
  const [lista, setLista] = useState<Categoria[]>([]);
  const [form, setForm] = useState({ nome: '', valorDiaria: '' });

  async function carregar() { setLista(await api.listarCategorias()); }
  useEffect(() => { carregar(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await api.criarCategoria({ nome: form.nome, valorDiaria: Number(form.valorDiaria) });
    setForm({ nome: '', valorDiaria: '' });
    carregar();
  }

  function fmt(v: number) { return 'R$ ' + v.toFixed(2).replace('.', ','); }

  return (
    <div className="page">
      <div className="page-head">
        <h1>Categorias</h1>
        <p>Classes de veículos e o valor da diária de cada uma.</p>
      </div>
      <div className="card">
        <form className="grid-form" onSubmit={handleSubmit}>
          <input placeholder="Nome (ex: SUV)" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} required />
          <input type="number" step="0.01" placeholder="Valor da diária (R$)" value={form.valorDiaria}
            onChange={e => setForm({ ...form, valorDiaria: e.target.value })} required />
          <button type="submit" className="btn-primary">Adicionar</button>
        </form>
      </div>
      <div className="card">
        <table className="data-table">
          <thead><tr><th>Nome</th><th>Diária</th></tr></thead>
          <tbody>
            {lista.map(c => <tr key={c.id}><td>{c.nome}</td><td>{fmt(c.valorDiaria)}</td></tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );
}
