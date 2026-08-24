import { useEffect, useState } from 'react';
import { api } from '../api';
import type { Veiculo, Categoria } from '../types';

export default function VeiculosPage() {
  const [lista, setLista] = useState<Veiculo[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [form, setForm] = useState({ placa: '', modelo: '', ano: '', categoriaId: '' });

  async function carregar() {
    setLista(await api.listarVeiculos());
    setCategorias(await api.listarCategorias());
  }

  useEffect(() => { carregar(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const placaNormalizada = form.placa.trim().toUpperCase();

    // 1. Validação de Placa Duplicada
    const placaExiste = lista.some(v => v.placa.trim().toUpperCase() === placaNormalizada);
    if (placaExiste) {
      alert(`Erro: A placa ${placaNormalizada} já está cadastrada em outro veículo da frota!`);
      return;
    }

    // 2. Validação de formato da placa (3 letras + 4 números OU padrão Mercosul)
    const regexPlaca = /^[A-Z]{3}[0-9]{4}$|^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;
    if (!regexPlaca.test(placaNormalizada)) {
      alert('Erro: Informe uma placa válida no padrão tradicional (ex: ABC1234) ou Mercosul (ex: ABC1D23)!');
      return;
    }

    // 3. Validação do ano do veículo
    const anoNum = Number(form.ano);
    const anoAtual = new Date().getFullYear();
    if (anoNum < 1900 || anoNum > anoAtual + 1) {
      alert(`Erro: Informe um ano válido entre 1900 e ${anoAtual + 1}!`);
      return;
    }

    await api.criarVeiculo({
      placa: placaNormalizada, modelo: form.modelo, ano: anoNum, categoriaId: Number(form.categoriaId),
    });
    setForm({ placa: '', modelo: '', ano: '', categoriaId: '' });
    carregar();
  }

  // Função auxiliar para aplicar as tags e estilos corretamente
  function renderStatusTag(status: string) {
    let tagClass = 'tag-muted';
    let textoExibicao = status;

    if (status === 'DISPONIVEL' || status === 'DISPONÍVEL') {
      tagClass = 'tag-active';
      textoExibicao = 'DISPONÍVEL';
    } else if (status === 'ALUGADO') {
      tagClass = 'tag-dark';
      textoExibicao = 'ALUGADO';
    } else if (status === 'MANUTENCAO' || status === 'MANUTENÇÃO') {
      tagClass = 'tag-warning';
      textoExibicao = 'MANUTENÇÃO';
    }
    
    return <span className={`tag ${tagClass}`}>{textoExibicao}</span>;
  }

  return (
    <div className="page">
      <div className="page-head">
        <h1>Veículos</h1>
        <p>Frota da locadora.</p>
      </div>
      <div className="card">
        <form className="grid-form" onSubmit={handleSubmit}>
          <input 
            placeholder="Placa (ex: ABC1D23)" 
            maxLength={7}
            value={form.placa} 
            onChange={e => setForm({ ...form, placa: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '') })} 
            required 
          />
          <input 
            placeholder="Modelo" 
            value={form.modelo} 
            onChange={e => setForm({ ...form, modelo: e.target.value })} 
            required 
          />
          <input 
            type="number" 
            placeholder="Ano" 
            min={1900}
            max={new Date().getFullYear() + 1}
            value={form.ano} 
            onChange={e => setForm({ ...form, ano: e.target.value })} 
            required 
          />
          <select value={form.categoriaId} onChange={e => setForm({ ...form, categoriaId: e.target.value })} required>
            <option value="">Categoria</option>
            {categorias.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>
          <button type="submit" className="btn-primary">Adicionar</button>
        </form>
      </div>
      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Placa</th>
              <th>Modelo</th>
              <th>Ano</th>
              <th>Categoria</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {lista.map(v => (
              <tr key={v.id}>
                <td>{v.placa}</td>
                <td>{v.modelo}</td>
                <td>{v.ano}</td>
                <td>{v.categoria?.nome}</td>
                <td>{renderStatusTag(v.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}