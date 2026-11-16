import { SALAS_BASE, USUARIOS_BASE, UNIDADES_BASE, type Sala, type Usuario, type Unidade, type Solicitacao } from "./data";

function readStore<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) as T : fallback; }
  catch { return fallback; }
}
function writeStore<T>(key: string, val: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(val));
}
function ensureSeed<T>(key: string, seed: T): T {
  if (typeof window === "undefined") return seed;
  if (!localStorage.getItem(key)) writeStore(key, seed);
  return readStore(key, seed);
}

export const uid = (p: string) => p + "_" + Math.random().toString(36).slice(2, 8);
export const slug = (s: string) =>
  (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-");

export const getSalas = () => ensureSeed<Sala[]>("conectati_salas", SALAS_BASE);
export const setSalas = (v: Sala[]) => writeStore("conectati_salas", v);
export const getUsuarios = () => ensureSeed<Usuario[]>("conectati_usuarios", USUARIOS_BASE);
export const setUsuarios = (v: Usuario[]) => writeStore("conectati_usuarios", v);
export const getUnidades = () => ensureSeed<Unidade[]>("conectati_unidades", UNIDADES_BASE);
export const setUnidades = (v: Unidade[]) => writeStore("conectati_unidades", v);
export const getSolicitacoes = () => ensureSeed<Solicitacao[]>("conectati_solicitacoes", []);
export const setSolicitacoes = (v: Solicitacao[]) => writeStore("conectati_solicitacoes", v);

let toastTimer: ReturnType<typeof setTimeout> | undefined;
export function toast(msg: string) {
  if (typeof document === "undefined") return;
  let t = document.getElementById("toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "toast";
    t.className = "toast";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.remove("hidden");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t?.classList.add("hidden"), 3000);
}

export function dataHojeBR() {
  return new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });
}
