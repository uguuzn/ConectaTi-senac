import { useEffect, useState } from 'react';
import { api } from '../api';
import type { Cliente } from '../types';

export default function ClientesPage() {
  const [lista, setLista] = useState<Cliente[]>([]);
  const [form, setForm] = useState({ nome: '', cpf: '', cnh: '', telefone: '', email: '' });

  async function carregar() { setLista(await api.listarClientes()); }
  useEffect(() => { carregar(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await api.criarCliente(form);
    setForm({ nome: '', cpf: '', cnh: '', telefone: '', email: '' });
    carregar();
  }

  return (
    <div className="page">
      <div className="page-head">
        <h1>Clientes</h1>
        <p>Cadastro de locatários.</p>
      </div>
      <div className="card">
        <form className="grid-form" onSubmit={handleSubmit}>
          <input placeholder="Nome" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} required />
          <input placeholder="CPF" value={form.cpf} onChange={e => setForm({ ...form, cpf: e.target.value })} required />
          <input placeholder="CNH" value={form.cnh} onChange={e => setForm({ ...form, cnh: e.target.value })} required />
          <input placeholder="Telefone" value={form.telefone} onChange={e => setForm({ ...form, telefone: e.target.value })} />
          <input type="email" placeholder="E-mail" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <button type="submit" className="btn-primary">Adicionar</button>
        </form>
      </div>
      <div className="card">
        <table className="data-table">
          <thead><tr><th>Nome</th><th>CPF</th><th>CNH</th><th>Telefone</th></tr></thead>
          <tbody>
            {lista.map(c => (
              <tr key={c.id}><td>{c.nome}</td><td>{c.cpf}</td><td>{c.cnh}</td><td>{c.telefone}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
