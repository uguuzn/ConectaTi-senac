import { useEffect, useState } from 'react';
import { api } from '../api';
import type { Manutencao, Veiculo } from '../types';

export default function ManutencaoPage() {
  const [manutencoes, setManutencoes] = useState<Manutencao[]>([]);
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [form, setForm] = useState({ veiculoId: '', descricao: '', dataInicio: '', custo: '' });

  // Pega a data atual no formato YYYY-MM-DD para travar o input de data no futuro
  const hoje = new Date().toISOString().split('T')[0];

  async function carregar() {
    setManutencoes(await api.listarManutencoes());
    setVeiculos(await api.listarVeiculos());
  }
  useEffect(() => { carregar(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const custoNum = Number(form.custo);

    // 1. Validação de Custo Negativo ou Zerado
    if (custoNum <= 0) {
      alert('Erro: O custo da manutenção deve ser um valor maior que R$ 0,00!');
      return;
    }

    // 2. Validação de Data Futura
    if (form.dataInicio > hoje) {
      alert('Erro: A data de início da manutenção não pode ser uma data futura!');
      return;
    }

    await api.criarManutencao({
      veiculoId: Number(form.veiculoId), 
      descricao: form.descricao, 
      dataInicio: form.dataInicio, 
      custo: custoNum,
    });
    
    setForm({ veiculoId: '', descricao: '', dataInicio: '', custo: '' });
    carregar();
  }

  async function handleConcluir(id: number) {
    await api.concluirManutencao(id);
    carregar();
  }

  function fmt(v: number) { return 'R$ ' + v.toFixed(2).replace('.', ','); }

  return (
    <div className="page">
      <div className="page-head">
        <h1>Manutenção</h1>
        <p>Registros de manutenção da frota.</p>
      </div>
      <div className="card">
        <form className="grid-form" onSubmit={handleSubmit}>
          <select value={form.veiculoId} onChange={e => setForm({ ...form, veiculoId: e.target.value })} required>
            <option value="">Veículo</option>
            {veiculos.map(v => <option key={v.id} value={v.id}>{v.modelo} — {v.placa}</option>)}
          </select>
          <input 
            placeholder="Descrição do serviço" 
            value={form.descricao} 
            onChange={e => setForm({ ...form, descricao: e.target.value })} 
            required 
          />
          <input 
            type="date" 
            max={hoje} 
            value={form.dataInicio} 
            onChange={e => setForm({ ...form, dataInicio: e.target.value })} 
            required 
          />
          <input 
            type="number" 
            step="0.01" 
            min="0.01" 
            placeholder="Custo (R$)" 
            value={form.custo} 
            onChange={e => setForm({ ...form, custo: e.target.value })} 
            required 
          />
          <button type="submit" className="btn-primary">Registrar</button>
        </form>
      </div>
      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Veículo</th>
              <th>Descrição</th>
              <th>Início</th>
              <th>Fim</th>
              <th>Custo</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {manutencoes.map(m => (
              <tr key={m.id}>
                <td>{m.veiculo?.placa}</td>
                <td>{m.descricao}</td>
                <td>{m.dataInicio}</td>
                <td>{m.dataFim || '—'}</td>
                <td>{fmt(m.custo)}</td>
                <td className="col-actions">
                  {!m.dataFim && <button className="link-action" onClick={() => handleConcluir(m.id)}>Concluir</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}