import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { getPermissoes, getPerfil, type MenuKey } from "@/lib/conectati/permissions";
import { clearSession } from "@/services/session";

const items: { key: MenuKey; label: string; to: string }[] = [
  { key: "home", label: "Inicio", to: "/home" },
  { key: "dashboard", label: "Dashboard", to: "/dashboard" },
  { key: "chamados", label: "Chamados", to: "/chamados" },
  { key: "novo-chamado", label: "Novo chamado", to: "/novo-chamado" },
  { key: "equipamentos", label: "Equipamentos", to: "/equipamentos" },
  { key: "usuarios", label: "Usuarios", to: "/usuarios" },
  { key: "relatorios", label: "Relatorios", to: "/relatorios" },
];

export function AppShell({ active, children }: { active: MenuKey; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [perfil, setPerfil] = useState("");
  const [cor, setCor] = useState("#2b8cff");
  const [menu, setMenu] = useState<MenuKey[]>([]);
  const nav = useNavigate();

  useEffect(() => {
    const permissao = getPermissoes();
    if (!permissao) {
      nav({ to: "/login" });
      return;
    }
    if (!permissao.menu.includes(active)) {
      nav({ to: getPerfil() === "ADMINISTRADOR" ? "/admin" : "/chamados" });
      return;
    }
    setPerfil(getPerfil());
    setCor(permissao.cor);
    setMenu(permissao.menu);
    setReady(true);
  }, [active, nav]);

  if (!ready) return null;

  return (
    <>
      <div className="app">
        <aside className={`sidebar ${open ? "open" : ""}`}>
          <div className="brand">
            <img src="/assets/logo-senac.png" alt="Logo Senac" className="logo" />
            <span className="brand-name">Conecta<b>TI</b></span>
            <div style={{ marginTop: 10, padding: "6px 10px", borderRadius: 999, fontSize: ".72rem", fontWeight: 700, color: "#fff", background: cor, textAlign: "center" }}>
              {perfil}
            </div>
          </div>
          <nav>
            {items.filter((item) => menu.includes(item.key)).map((item) => (
              <Link key={item.key} to={item.to} className={active === item.key ? "active" : ""} onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
            {perfil === "ADMINISTRADOR" && <Link to="/admin">Administracao</Link>}
            <a href="#" className="logout" onClick={(event) => { event.preventDefault(); clearSession(); nav({ to: "/login" }); }}>
              Sair
            </a>
          </nav>
        </aside>
        <div className="app-main">{children}</div>
      </div>
      <button className="menu-toggle-floating" onClick={() => setOpen((value) => !value)} aria-label="Abrir ou fechar menu">☰</button>
    </>
  );
}
