import { useEffect, useState } from 'react';
import { api } from '../api';
import type { Multa, Locacao } from '../types';

export default function MultasPage() {
  const [multas, setMultas] = useState<Multa[]>([]);
  const [locacoes, setLocacoes] = useState<Locacao[]>([]);
  const [form, setForm] = useState({ locacaoId: '', motivo: '', valor: '' });

  async function carregar() {
    setMultas(await api.listarMultas());
    setLocacoes(await api.listarLocacoes());
  }
  useEffect(() => { carregar(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await api.criarMulta({ locacaoId: Number(form.locacaoId), motivo: form.motivo, valor: Number(form.valor) });
    setForm({ locacaoId: '', motivo: '', valor: '' });
    carregar();
  }

  function fmt(v: number) { return 'R$ ' + v.toFixed(2).replace('.', ','); }

  return (
    <div className="page">
      <div className="page-head">
        <h1>Multas</h1>
        <p>Penalidades aplicadas em locações (atraso, avarias, etc).</p>
      </div>
      <div className="card">
        <form className="grid-form" onSubmit={handleSubmit}>
          <select value={form.locacaoId} onChange={e => setForm({ ...form, locacaoId: e.target.value })} required>
            <option value="">Locação</option>
            {locacoes.map(l => (
              <option key={l.id} value={l.id}>#{l.id} — {l.cliente?.nome} ({l.veiculo?.placa})</option>
            ))}
          </select>
          <input placeholder="Motivo" value={form.motivo} onChange={e => setForm({ ...form, motivo: e.target.value })} required />
          <input type="number" step="0.01" placeholder="Valor (R$)" value={form.valor} onChange={e => setForm({ ...form, valor: e.target.value })} required />
          <button type="submit" className="btn-primary">Registrar</button>
        </form>
      </div>
      <div className="card">
        <table className="data-table">
          <thead><tr><th>Cliente</th><th>Veículo</th><th>Motivo</th><th>Valor</th></tr></thead>
          <tbody>
            {multas.map(m => (
              <tr key={m.id}>
                <td>{m.locacao?.cliente?.nome}</td>
                <td>{m.locacao?.veiculo?.placa}</td>
                <td>{m.motivo}</td>
                <td>{fmt(m.valor)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
