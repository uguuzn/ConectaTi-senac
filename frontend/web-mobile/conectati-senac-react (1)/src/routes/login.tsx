import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { authService } from "@/services/conectati";
import { setSession } from "@/services/session";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [alerta, setAlerta] = useState<{ tipo: "erro" | "sucesso"; msg: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email || !senha) { setAlerta({ tipo: "erro", msg: "Informe e-mail e senha para continuar." }); return; }
    setLoading(true);
    try {
      const session = await authService.login(email, senha);
      const { usuario } = session;
      setSession(session);
      setAlerta({ tipo: "sucesso", msg: `Bem-vindo(a), ${usuario.nome}.` });
      nav({ to: usuario.tipo === "ADMINISTRADOR" ? "/admin" : "/chamados" });
    } catch (error) { setAlerta({ tipo: "erro", msg: error instanceof Error ? error.message : "Não foi possível entrar." }); }
    finally { setLoading(false); }
  };
  return <div className="auth"><div className="bg-orbs"><span className="orb orb-1" /><span className="orb orb-2" /><span className="orb orb-3" /></div><div className="auth-card reveal visible"><div className="brand center"><img src="/assets/logo-senac.png" alt="Logo Senac" className="logo" /><span className="brand-name">ConectaTI <b>Senac</b></span></div><h2>Acesse sua conta</h2><p className="muted">Use as credenciais cadastradas na plataforma.</p><form className="form" onSubmit={onSubmit} noValidate><label>E-mail<input type="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="seu@senacdf.com.br" /></label><label>Senha<input type="password" value={senha} onChange={event => setSenha(event.target.value)} placeholder="••••••••" /></label>{alerta && <div className={`alerta ${alerta.tipo}`}>{alerta.msg}</div>}<button disabled={loading} type="submit" className="btn btn-primary btn-block">{loading ? "Entrando..." : "Entrar"}</button><Link to="/home" className="link center">Voltar para o início</Link></form></div></div>;
}
