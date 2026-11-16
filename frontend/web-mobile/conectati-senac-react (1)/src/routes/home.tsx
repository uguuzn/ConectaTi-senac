import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { dataHojeBR } from "@/lib/conectati/store";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "ConectaTI Senac — Início" },
      { name: "description", content: "Plataforma interna do Senac Taguatinga para chamados, salas e equipamentos." },
      { property: "og:title", content: "ConectaTI Senac" },
      { property: "og:description", content: "Chamados, suporte técnico e gestão de equipamentos." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Home,
});

function Counter({ to }: { to: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const t0 = performance.now(); const dur = 1400;
    let raf = 0;
    const step = (now: number) => {
      const p = Math.min((now - t0) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setN(Math.round(to * e));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return <b>{n}</b>;
}

function Home() {
  const [hoje, setHoje] = useState("");
  useEffect(() => setHoje(dataHojeBR()), []);
  return (
    <div className="landing">
      <div className="bg-orbs"><span className="orb orb-1" /><span className="orb orb-2" /><span className="orb orb-3" /></div>
      <header className="landing-header">
        <div className="brand">
          <img src="/assets/logo-senac.png" alt="Logo Senac" className="logo" />
          <span className="brand-name">ConectaTI <b>Senac</b></span>
        </div>
        <nav className="landing-nav">
          <Link to="/login" className="btn btn-ghost">Entrar</Link>
        </nav>
      </header>
      <main className="hero">
        <div className="hero-content reveal visible">
          <span className="badge">Senac Taguatinga · Plataforma Interna</span>
          <h1 className="hero-title"><span className="gradient-text">Conecta</span>TI Senac</h1>
          <p className="hero-subtitle">Sistema de Chamados, Suporte Técnico e Gestão de Equipamentos</p>
          <p className="hero-desc">Conectando instrutores, suporte técnico, coordenação e administração em uma única plataforma inteligente.</p>
          <div className="hero-actions">
            <Link to="/login" className="btn btn-primary">Acessar sistema</Link>
            <Link to="/dashboard" className="btn btn-outline">Ver dashboard</Link>
          </div>
          <div className="hero-stats">
            <div className="stat"><Counter to={24} /><span>Chamados abertos</span></div>
            <div className="stat"><Counter to={18} /><span>Notebooks disponíveis</span></div>
            <div className="stat"><Counter to={96} /><span>% satisfação</span></div>
          </div>
        </div>
        <div className="hero-visual reveal visible">
          <div className="floating-card card-a"><span className="dot dot-green" /><div><b>#003 · Resolvido</b><small>Internet · Lab 01</small></div></div>
          <div className="floating-card card-b"><span className="dot dot-yellow" /><div><b>#001 · Em atendimento</b><small>Notebook · Lab 02</small></div></div>
          <div className="floating-card card-c"><span className="dot dot-blue" /><div><b>#002 · Aberto</b><small>Projetor · Sala 12</small></div></div>
          <div className="hero-glow" />
        </div>
      </main>
      <section className="features">
        <div className="feature reveal visible"><h3>Chamados</h3><p>Abra e acompanhe solicitações de suporte técnico com histórico completo.</p></div>
        <div className="feature reveal visible"><h3>Equipamentos</h3><p>Reserve notebooks e controle o patrimônio de TI em tempo real.</p></div>
        <div className="feature reveal visible"><h3>Indicadores</h3><p>Dashboards visuais para coordenação e administração acompanharem tudo.</p></div>
        <div className="feature reveal visible"><h3>Perfis</h3><p>Instrutor, Suporte TI, Coordenação e Administrador — permissões dedicadas.</p></div>
      </section>
      <footer className="landing-footer">
        <span>© 2026 ConectaTI Senac · Unidade Taguatinga</span>
        <span>{hoje}</span>
      </footer>
    </div>
  );
}
