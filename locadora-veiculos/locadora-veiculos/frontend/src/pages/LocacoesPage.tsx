import { useEffect, useState } from 'react';
import { api } from '../api';
import type { Veiculo, Cliente, Seguro, Locacao } from '../types';

function diasEntre(inicio: string, fim: string): number {
  const d1 = new Date(inicio);
  const d2 = new Date(fim);
  const diff = Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}

export default function LocacoesPage() {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [seguros, setSeguros] = useState<Seguro[]>([]);
  const [locacoes, setLocacoes] = useState<Locacao[]>([]);

  const [form, setForm] = useState({ veiculoId: '', clienteId: '', seguroId: '', dataInicio: '', dataFimPrevista: '' });
  const [preview, setPreview] = useState(0);
  const [dataDevolucao, setDataDevolucao] = useState<Record<number, string>>({});

  async function carregar() {
    setVeiculos(await api.listarVeiculos());
    setClientes(await api.listarClientes());
    setSeguros(await api.listarSeguros());
    setLocacoes(await api.listarLocacoes());
  }
  useEffect(() => { carregar(); }, []);

  useEffect(() => {
    const veiculo = veiculos.find(v => v.id === Number(form.veiculoId));
    if (!veiculo || !form.dataInicio || !form.dataFimPrevista) {
      setPreview(0);
      return;
    }
    const dias = diasEntre(form.dataInicio, form.dataFimPrevista);
    setPreview(veiculo.categoria.valorDiaria * dias);
  }, [form.veiculoId, form.dataInicio, form.dataFimPrevista]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // CORREÇÃO DO BUG: Validação de intervalo de datas
    if (new Date(form.dataFimPrevista) < new Date(form.dataInicio)) {
      alert('Erro: A data final da locação não pode ser anterior à data de início!');
      return;
    }

    const locacao = await api.criarLocacao({
      veiculoId: Number(form.veiculoId),
      clienteId: Number(form.clienteId),
      seguroId: form.seguroId ? Number(form.seguroId) : null,
      dataInicio: form.dataInicio,
      dataFimPrevista: form.dataFimPrevista,
    });
    setForm({ veiculoId: '', clienteId: '', seguroId: '', dataInicio: '', dataFimPrevista: '' });
    setPreview(0);
    carregar();
    return locacao;
  }

  async function handleFinalizar(id: number) {
    const data = dataDevolucao[id];
    if (!data) return;
    await api.finalizarLocacao(id, data);
    carregar();
  }

  function fmt(v: number) { return 'R$ ' + v.toFixed(2).replace('.', ','); }

  return (
    <div className="page">
      <div className="page-head">
        <h1>Locações</h1>
        <p>Nova locação e histórico de aluguéis.</p>
      </div>

      <div className="card">
        <h2>Nova locação</h2>
        <form className="grid-form" onSubmit={handleSubmit}>
          <select value={form.veiculoId} onChange={e => setForm({ ...form, veiculoId: e.target.value })} required>
            <option value="">Veículo</option>
            {veiculos.map(v => (
              <option key={v.id} value={v.id}>{v.modelo} — {v.placa} ({v.status})</option>
            ))}
          </select>
          <select value={form.clienteId} onChange={e => setForm({ ...form, clienteId: e.target.value })} required>
            <option value="">Cliente</option>
            {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>
          <select value={form.seguroId} onChange={e => setForm({ ...form, seguroId: e.target.value })}>
            <option value="">Sem seguro</option>
            {seguros.map(s => <option key={s.id} value={s.id}>{s.nome} (+{fmt(s.valorDiaria)}/dia)</option>)}
          </select>

          {/* Campo Data Início */}
          <input 
            type="date" 
            value={form.dataInicio} 
            onChange={e => setForm({ ...form, dataInicio: e.target.value })} 
            required 
          />

          {/* Campo Data Fim com 'min' para travar datas anteriores */}
          <input 
            type="date" 
            value={form.dataFimPrevista} 
            min={form.dataInicio} 
            onChange={e => setForm({ ...form, dataFimPrevista: e.target.value })} 
            required 
          />

          <button type="submit" className="btn-primary">Alugar</button>
        </form>
        {preview > 0 && (
          <div className="preview-box">Valor estimado: <strong>{fmt(preview)}</strong></div>
        )}
      </div>

      <div className="card">
        <table className="data-table">
          <thead><tr><th>Veículo</th><th>Cliente</th><th>Período</th><th>Seguro</th><th>Total</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {locacoes.map(l => (
              <tr key={l.id}>
                <td>{l.veiculo?.modelo} ({l.veiculo?.placa})</td>
                <td>{l.cliente?.nome}</td>
                <td>{l.dataInicio} → {l.dataFimPrevista}</td>
                <td>{l.seguro ? l.seguro.nome : '—'}</td>
                <td>{fmt(l.valorTotal)}</td>
                <td><span className={'tag ' + (l.status === 'ATIVA' ? 'tag-active' : 'tag-muted')}>{l.status}</span></td>
                <td className="col-actions">
                  {l.status === 'ATIVA' && (
                    <div className="inline-form">
                      <input 
                        type="date" 
                        value={dataDevolucao[l.id] || ''}
                        min={l.dataInicio}
                        onChange={e => setDataDevolucao({ ...dataDevolucao, [l.id]: e.target.value })} 
                      />
                      <button className="btn-secondary" onClick={() => handleFinalizar(l.id)}>Finalizar</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}