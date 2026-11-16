/* =========================================================
 ConectaTI Senac — JavaScript
 ========================================================= */

/* ============ Dados simulados ============ */
const CHAMADOS = [
 {n:"001",solicitante:"Rayssa Paiva",perfil:"Instrutor",categoria:"Notebook",sala:"Lab 02",prioridade:"Alta",status:"Em atendimento",data:"03/07/2026"},
 {n:"002",solicitante:"Carla Mendes",perfil:"Coordenação",categoria:"Projetor",sala:"Sala 12",prioridade:"Média",status:"Aberto",data:"03/07/2026"},
 {n:"003",solicitante:"João Suporte",perfil:"Suporte TI",categoria:"Internet/Rede",sala:"Lab 01",prioridade:"Urgente",status:"Resolvido",data:"02/07/2026"},
 {n:"004",solicitante:"Ana Souza",perfil:"Instrutor",categoria:"Impressora",sala:"Secretaria",prioridade:"Baixa",status:"Aguardando",data:"02/07/2026"},
 {n:"005",solicitante:"Paulo Lima",perfil:"Instrutor",categoria:"Software",sala:"Lab 03",prioridade:"Média",status:"Em atendimento",data:"01/07/2026"},
 {n:"006",solicitante:"Fernanda Reis",perfil:"Coordenação",categoria:"Notebook",sala:"Sala 08",prioridade:"Alta",status:"Atrasado",data:"30/06/2026"},
 {n:"007",solicitante:"Ricardo Alves",perfil:"Instrutor",categoria:"Internet/Rede",sala:"Lab 02",prioridade:"Urgente",status:"Aberto",data:"03/07/2026"},
 {n:"008",solicitante:"Mariana Costa",perfil:"Instrutor",categoria:"Projetor",sala:"Sala 15",prioridade:"Média",status:"Resolvido",data:"29/06/2026"},
];

const EQUIPAMENTOS = [
 {nome:"Notebook Dell 01",tipo:"Notebook",patr:"2024001",status:"Disponível",loc:"Sala TI"},
 {nome:"Notebook Dell 02",tipo:"Notebook",patr:"2024002",status:"Reservado",loc:"Lab 02"},
 {nome:"Notebook Lenovo 03",tipo:"Notebook",patr:"2024003",status:"Em uso",loc:"Lab 01"},
 {nome:"Projetor Epson 01",tipo:"Projetor",patr:"2024010",status:"Em manutenção",loc:"Sala TI"},
 {nome:"Projetor BenQ 02",tipo:"Projetor",patr:"2024011",status:"Disponível",loc:"Sala TI"},
 {nome:"Cabo HDMI 01",tipo:"Cabo",patr:"2024020",status:"Disponível",loc:"Sala TI"},
 {nome:"Cabo HDMI 02",tipo:"Cabo",patr:"2024021",status:"Em uso",loc:"Lab 02"},
 {nome:"Impressora HP 01",tipo:"Impressora",patr:"2024030",status:"Em uso",loc:"Secretaria"},
 {nome:"Mouse Logitech 01",tipo:"Mouse",patr:"2024040",status:"Disponível",loc:"Sala TI"},
 {nome:"Teclado Multilaser 01",tipo:"Teclado",patr:"2024050",status:"Danificado",loc:"Sala TI"},
 {nome:"Roteador TP-Link 01",tipo:"Rede",patr:"2024060",status:"Em uso",loc:"Sala TI"},
 {nome:"Carregador Dell 02",tipo:"Carregador",patr:"2024070",status:"Disponível",loc:"Sala TI"},
];

/* Turmas por instrutor (email → turmas) */
const TURMAS_POR_INSTRUTOR = {
 "_default": [
  {id:"t1", curso:"Técnico em Desenvolvimento de Sistemas", turma:"TDS Manhã", horario:"08:00 - 12:00", dias:"Seg / Qua / Sex", alunos:28},
  {id:"t2", curso:"Informática Básica",                     turma:"INF-B Noite", horario:"19:00 - 22:00", dias:"Ter / Qui",        alunos:22},
  {id:"t3", curso:"Design Gráfico",                         turma:"DG Tarde",   horario:"14:00 - 17:00", dias:"Seg à Sex",        alunos:18},
 ]
};

const SALAS_BASE = [
 {nome:"Sala 01", tipo:"Sala"},      {nome:"Sala 02", tipo:"Sala"},
 {nome:"Sala 03", tipo:"Sala"},      {nome:"Sala 04", tipo:"Sala"},
 {nome:"Sala 05", tipo:"Sala"},      {nome:"Sala 08", tipo:"Sala"},
 {nome:"Sala 12", tipo:"Sala"},      {nome:"Sala 15", tipo:"Sala"},
 {nome:"Lab 01",  tipo:"Laboratório"},
 {nome:"Lab 02",  tipo:"Laboratório"},
 {nome:"Lab 03",  tipo:"Laboratório"},
 {nome:"Auditório", tipo:"Auditório"},
];

const USUARIOS_BASE = [
 {id:"u1", nome:"Rayssa Paiva",     email:"rayssa@senacdf.com.br",   perfil:"Instrutor",     unidade:"Senac Taguatinga Sul - Taguatinga/DF"},
 {id:"u2", nome:"Carla Mendes",     email:"carla@senacdf.com.br",    perfil:"Coordenação",   unidade:"Senac Taguatinga Sul - Taguatinga/DF"},
 {id:"u3", nome:"Paulo Lima",       email:"paulo@senacdf.com.br",    perfil:"Instrutor",     unidade:"Senac Taguatinga Sul - Taguatinga/DF"},
 {id:"u4", nome:"Ana Coordenação",  email:"ana.coord@senacdf.com.br",perfil:"Coordenação",   unidade:"Senac Taguatinga Sul - Taguatinga/DF"},
 {id:"u5", nome:"João Suporte",     email:"joao.ti@senacdf.com.br",  perfil:"Suporte TI",    unidade:"Senac Taguatinga Sul - Taguatinga/DF"},
 {id:"u6", nome:"Mariana Admin",    email:"admin@senacdf.com.br",    perfil:"Administrador", unidade:"Senac Taguatinga Sul - Taguatinga/DF"},
];

const UNIDADES_BASE = [
 {id:"un1", nome:"Senac Taguatinga Sul",  cidade:"Taguatinga/DF", salas:12},
 {id:"un2", nome:"Senac Plano Piloto",    cidade:"Brasília/DF",   salas:20},
 {id:"un3", nome:"Senac Ceilândia",       cidade:"Ceilândia/DF",  salas:14},
];

/* ============ Utilitários ============ */
function dataHojeBR(){
 const d = new Date();
 return d.toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'long',year:'numeric'});
}
function slug(s){
 return (s||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/\s+/g,"-");
}
function toast(msg){
 let t = document.getElementById("toast");
 if(!t){ t = document.createElement("div"); t.id="toast"; t.className="toast"; document.body.appendChild(t); }
 t.textContent = msg;
 t.classList.remove("hidden");
 clearTimeout(t._to);
 t._to = setTimeout(()=>t.classList.add("hidden"),3000);
}
function uid(prefix){ return prefix+"_"+Math.random().toString(36).slice(2,8); }
function readStore(key, fallback){
 try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch(e){ return fallback; }
}
function writeStore(key, val){ localStorage.setItem(key, JSON.stringify(val)); }
function ensureSeed(key, seed){
 if(!localStorage.getItem(key)) writeStore(key, seed);
 return readStore(key, seed);
}

/* ============ Reveal on scroll ============ */
function setupReveal(){
 const els = document.querySelectorAll(".reveal");
 const obs = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add("visible"); obs.unobserve(e.target); } });
 },{threshold:.12});
 els.forEach(el=>obs.observe(el));
}

/* ============ Contador animado ============ */
function animarContadores(){
 document.querySelectorAll("[data-count]").forEach(el=>{
  const alvo = parseInt(el.dataset.count,10);
  const dur = 1400; const t0 = performance.now();
  function step(now){
   const p = Math.min((now-t0)/dur,1);
   const e = 1 - Math.pow(1-p,3);
   el.textContent = Math.round(alvo*e);
   if(p<1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
 });
}

function setupRipple(){
 document.querySelectorAll(".btn").forEach(btn=>{
  btn.addEventListener("mousemove",e=>{
   const r = btn.getBoundingClientRect();
   btn.style.setProperty("--x",`${e.clientX-r.left}px`);
   btn.style.setProperty("--y",`${e.clientY-r.top}px`);
  });
 });
}

function setupSidebar(){
 const bt = document.getElementById("menu-toggle");
 const sb = document.getElementById("sidebar");
 if(!bt || !sb) return;
 bt.addEventListener("click",()=>sb.classList.toggle("open"));
 document.addEventListener("click",e=>{
  if(window.innerWidth<=768 && !sb.contains(e.target) && e.target!==bt){
   sb.classList.remove("open");
  }
 });
}

/* ============ Perfis / Permissões ============ */
const PERMISSOES = {
 "Instrutor":     {menu:["home","chamados","novo-chamado","equipamentos"], verChamados:"proprios", acoes:false, novoChamado:true,  cor:"#2b8cff", descricao:"Solicita salas e abre chamados."},
 "Suporte TI":    {menu:["home","dashboard","chamados","equipamentos","relatorios"], verChamados:"todos", acoes:true,  novoChamado:false, cor:"#ff8a3d", descricao:"Atende chamados e gerencia equipamentos."},
 "Coordenação":   {menu:["home","dashboard","chamados","equipamentos","relatorios"], verChamados:"todos", acoes:false, novoChamado:false, cor:"#8b5cf6", descricao:"Acompanha indicadores e chamados."},
 "Administrador": {menu:["home","dashboard","equipamentos","usuarios","unidades"], verChamados:"todos", acoes:true, novoChamado:false, cor:"#16a34a", descricao:"Controle total: usuários, unidades e equipamentos."},
};
function getPerfil(){ return localStorage.getItem("conectati_perfil") || ""; }
function getPermissoes(){ return PERMISSOES[getPerfil()] || null; }

function paginaInicialPerfil(perm){
 const primeiros = ["dashboard","mapa-salas","chamados","equipamentos"];
 for(const p of primeiros){ if(perm.menu.includes(p)) return p; }
 return perm.menu.find(m=>m!=="home") || "dashboard";
}

function aplicarPerfil(){
 const perfil = getPerfil();
 const perm = getPermissoes();
 const path = (location.pathname.split("/").pop() || "home.html");
 const paginasPublicas = ["login.html","home.html",""];
 if(!perm && !paginasPublicas.includes(path)){
  location.href = "login.html"; return;
 }
 if(!perm) return;

 document.querySelectorAll(".sidebar nav a").forEach(a=>{
  const href = a.getAttribute("href")||"";
  const key = href.replace(".html","");
  if(key==="login") return;
  if(!perm.menu.includes(key)) a.style.display="none";
 });

 const pageKey = path.replace(".html","");
 if(pageKey && pageKey!=="login" && !perm.menu.includes(pageKey)){
  toast("Acesso restrito para o perfil " + perfil);
  setTimeout(()=>location.href = paginaInicialPerfil(perm) + ".html", 1200);
  return;
 }

 if(!perm.novoChamado){
  document.querySelectorAll('a[href="novo-chamado.html"].btn').forEach(b=>b.remove());
 }

 const sb = document.querySelector(".sidebar .brand");
 if(sb && !document.getElementById("perfil-badge")){
  const badge = document.createElement("div");
  badge.id = "perfil-badge";
  badge.style.cssText = `margin-top:10px;padding:6px 10px;border-radius:999px;font-size:.72rem;font-weight:700;color:#fff;background:${perm.cor};text-align:center;letter-spacing:.4px;box-shadow:0 4px 12px rgba(0,0,0,.15)`;
  badge.textContent = perfil.toUpperCase();
  sb.appendChild(badge);
 }

 const perfilAtual = document.getElementById("perfil-atual");
 if(perfilAtual && perfilAtual.parentElement){
  perfilAtual.style.color = perm.cor;
  perfilAtual.style.fontWeight = "700";
 }
}

function preencherData(){
 const el = document.getElementById("data-hoje");
 if(el) el.textContent = dataHojeBR();
 const perfil = getPerfil();
 const pEl = document.getElementById("perfil-atual");
 if(pEl && perfil) pEl.textContent = perfil;
}

/* ============ Login ============ */
function setupLogin(){
 const form = document.getElementById("form-login");
 if(!form) return;
 const alerta = document.getElementById("alerta-login");
 form.addEventListener("submit",e=>{
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value.trim();
  const perfil = document.getElementById("perfil").value;
  const unidade = document.getElementById("unidade")?.value || "";
  if(!email || !senha || !perfil || !unidade){
   alerta.className = "alerta erro";
   alerta.textContent = "Preencha todos os campos para continuar.";
   alerta.classList.remove("hidden");
   return;
  }
  const perm = PERMISSOES[perfil];
  alerta.className = "alerta sucesso";
  alerta.textContent = `Bem-vindo(a)! Entrando como ${perfil} — ${unidade}...`;
  alerta.classList.remove("hidden");
  localStorage.setItem("conectati_perfil", perfil);
  localStorage.setItem("conectati_email", email);
  localStorage.setItem("conectati_unidade", unidade);
  setTimeout(()=>{ window.location.href = paginaInicialPerfil(perm) + ".html"; }, 1000);
 });
}

/* ============ Chamados ============ */
function renderChamados(lista){
 const tbody = document.querySelector("#tabela-chamados tbody");
 const vazio = document.getElementById("vazio");
 if(!tbody) return;
 const perm = getPermissoes();
 const podeAgir = perm && perm.acoes;

 const thead = document.querySelector("#tabela-chamados thead tr");
 if(thead && !thead.dataset.perfilAplicado){
  if(podeAgir){ const th = document.createElement("th"); th.textContent = "Ações"; thead.appendChild(th); }
  thead.dataset.perfilAplicado = "1";
 }

 tbody.innerHTML = "";
 if(lista.length===0){ vazio?.classList.remove("hidden"); return; }
 vazio?.classList.add("hidden");
 lista.forEach(c=>{
  const tr = document.createElement("tr");
  tr.innerHTML = `
   <td><b>#${c.n}</b></td>
   <td>${c.solicitante}</td>
   <td>${c.perfil}</td>
   <td>${c.categoria}</td>
   <td>${c.sala}</td>
   <td><span class="prioridade ${slug(c.prioridade)}">${c.prioridade}</span></td>
   <td><span class="status ${slug(c.status)}">${c.status}</span></td>
   <td>${c.data}</td>
   ${podeAgir ? `<td>
     <button class="btn btn-sm btn-primary" data-acao="atender" data-n="${c.n}">Atender</button>
     <button class="btn btn-sm btn-ghost"   data-acao="resolver" data-n="${c.n}">Resolver</button>
   </td>` : ""}
  `;
  tbody.appendChild(tr);
 });

 if(podeAgir){
  tbody.querySelectorAll("button[data-acao]").forEach(b=>{
   b.addEventListener("click",()=>{
    const acao = b.dataset.acao === "atender" ? "em atendimento" : "resolvido";
    toast(`Chamado #${b.dataset.n} marcado como ${acao}.`);
   });
  });
 }
}
function setupChamados(){
 if(!document.getElementById("tabela-chamados")) return;
 const perm = getPermissoes();
 const perfil = getPerfil();
 const base = (perm && perm.verChamados === "proprios") ? CHAMADOS.filter(c => c.perfil === perfil) : CHAMADOS;
 renderChamados(base);
 const busca = document.getElementById("busca");
 const fs = document.getElementById("filtro-status");
 const fp = document.getElementById("filtro-prioridade");
 const fc = document.getElementById("filtro-categoria");
 function aplicar(){
  const q = busca.value.toLowerCase();
  const filtrados = base.filter(c=>{
   return (!q || c.solicitante.toLowerCase().includes(q))
    && (!fs.value || c.status===fs.value)
    && (!fp.value || c.prioridade===fp.value)
    && (!fc.value || c.categoria===fc.value);
  });
  renderChamados(filtrados);
 }
 [busca,fs,fp,fc].forEach(el=>el.addEventListener("input",aplicar));
}

/* ============ Novo chamado ============ */
function setupNovoChamado(){
 const form = document.getElementById("form-chamado");
 if(!form) return;
 const alerta = document.getElementById("alerta-chamado");
 const hoje = new Date();
 document.getElementById("data").value = hoje.toISOString().slice(0,10);
 document.getElementById("hora").value = hoje.toTimeString().slice(0,5);

 form.addEventListener("submit",e=>{
  e.preventDefault();
  const campos = ["nome","perfil-solicitante","sala","categoria","prioridade","data","hora","descricao"];
  const vazio = campos.some(id=>!document.getElementById(id).value.trim());
  if(vazio){
   alerta.className = "alerta erro full";
   alerta.textContent = "Preencha todos os campos obrigatórios.";
   alerta.classList.remove("hidden");
   return;
  }
  alerta.className = "alerta sucesso full";
  alerta.textContent = "Chamado enviado com sucesso! Nº #" + String(Math.floor(Math.random()*900)+100);
  alerta.classList.remove("hidden");
  form.reset();
  document.getElementById("data").value = hoje.toISOString().slice(0,10);
  document.getElementById("hora").value = hoje.toTimeString().slice(0,5);
  toast("Chamado registrado");
 });
}

/* ============ Equipamentos ============ */
function setupEquipamentos(){
 const wrap = document.getElementById("equipamentos");
 if(!wrap) return;
 EQUIPAMENTOS.forEach((e,i)=>{
  const card = document.createElement("div");
  card.className = `equip-card ${slug(e.status)} reveal`;
  card.style.animationDelay = (i*40)+"ms";
  card.innerHTML = `
   <h4>${e.nome}</h4>
   <p class="tipo">${e.tipo}</p>
   <p class="patr">Patrimônio ${e.patr}</p>
   <span class="status ${slug(e.status)}">${e.status}</span>
   <p class="loc">${e.loc}</p>
  `;
  wrap.appendChild(card);
 });
 setupReveal();
}

function acaoRelatorio(nome){ toast(`${nome} — ação simulada`); }

/* ============ Estado compartilhado (localStorage) ============ */
function getSalas(){
 return ensureSeed("conectati_salas", SALAS_BASE.map(s=>({...s, chave:null /* {responsavel,motivo,desde} */})));
}
function setSalas(v){ writeStore("conectati_salas", v); }

function getUsuarios(){ return ensureSeed("conectati_usuarios", USUARIOS_BASE); }
function setUsuarios(v){ writeStore("conectati_usuarios", v); }

function getUnidades(){ return ensureSeed("conectati_unidades", UNIDADES_BASE); }
function setUnidades(v){ writeStore("conectati_unidades", v); }

function getSolicitacoes(){ return ensureSeed("conectati_solicitacoes", []); }
function setSolicitacoes(v){ writeStore("conectati_solicitacoes", v); }

/* ============ Minhas Turmas (Instrutor) ============ */
function setupMinhasTurmas(){
 const grid = document.getElementById("turmas-grid");
 if(!grid) return;

 const email = (localStorage.getItem("conectati_email")||"").toLowerCase();
 const turmas = TURMAS_POR_INSTRUTOR[email] || TURMAS_POR_INSTRUTOR._default;

 grid.innerHTML = "";
 turmas.forEach((t,i)=>{
  const card = document.createElement("div");
  card.className = "card turma-card reveal";
  card.style.animationDelay = (i*60)+"ms";
  card.innerHTML = `
   <div class="turma-head">
    <h3>${t.turma}</h3>
    <span class="badge-mini">${t.alunos} alunos</span>
   </div>
   <p class="muted">${t.curso}</p>
   <div class="turma-info">
    <span><b>Horário:</b> ${t.horario}</span>
    <span><b>Dias:</b> ${t.dias}</span>
   </div>
   <button class="btn btn-primary btn-block" data-solicitar="${t.id}">Solicitar sala</button>
  `;
  grid.appendChild(card);
 });

 // Popular select de salas
 const sel = document.getElementById("s-sala");
 if(sel){
  const salas = getSalas();
  sel.innerHTML = salas.map(s=>`<option value="${s.nome}">${s.nome} (${s.tipo})</option>`).join("");
 }

 const modal = document.getElementById("modal-solicitar");
 const titulo = document.getElementById("modal-titulo");
 let turmaAtual = null;

 grid.querySelectorAll("button[data-solicitar]").forEach(btn=>{
  btn.addEventListener("click",()=>{
   turmaAtual = turmas.find(x=>x.id===btn.dataset.solicitar);
   titulo.textContent = "Solicitar sala — " + turmaAtual.turma;
   const hoje = new Date();
   document.getElementById("s-data").value = hoje.toISOString().slice(0,10);
   document.getElementById("s-hora").value = turmaAtual.horario.slice(0,5);
   modal.classList.remove("hidden");
  });
 });
 document.getElementById("s-cancelar")?.addEventListener("click",()=>modal.classList.add("hidden"));

 document.getElementById("form-solicitar")?.addEventListener("submit",e=>{
  e.preventDefault();
  if(!turmaAtual) return;
  const nova = {
   id: uid("sol"),
   n: String(Math.floor(Math.random()*900)+100),
   instrutorEmail: email,
   instrutorNome: (getUsuarios().find(u=>u.email.toLowerCase()===email)?.nome) || "Instrutor",
   turma: turmaAtual.turma,
   salaPreferida: document.getElementById("s-sala").value,
   data: document.getElementById("s-data").value,
   hora: document.getElementById("s-hora").value,
   obs: document.getElementById("s-obs").value,
   status: "Pendente",
   salaAtribuida: null,
  };
  const arr = getSolicitacoes(); arr.push(nova); setSolicitacoes(arr);
  modal.classList.add("hidden");
  toast("Solicitação enviada.");
  renderMinhasSolicitacoes();
 });

 renderMinhasSolicitacoes();
}
function renderMinhasSolicitacoes(){
 const tbody = document.querySelector("#tabela-solicitacoes tbody");
 if(!tbody) return;
 const email = (localStorage.getItem("conectati_email")||"").toLowerCase();
 const arr = getSolicitacoes().filter(s => s.instrutorEmail === email);
 const vazio = document.getElementById("sem-solic");
 tbody.innerHTML = "";
 if(arr.length===0){ vazio?.classList.remove("hidden"); return; }
 vazio?.classList.add("hidden");
 arr.slice().reverse().forEach(s=>{
  const tr = document.createElement("tr");
  tr.innerHTML = `
   <td><b>#${s.n}</b></td>
   <td>${s.turma}</td>
   <td>${s.salaPreferida}</td>
   <td>${s.data}</td>
   <td>${s.hora}</td>
   <td><span class="status ${slug(s.status)}">${s.status}</span></td>
   <td>${s.salaAtribuida || "—"}</td>
  `;
  tbody.appendChild(tr);
 });
}

/* ============ Mapa de Salas (Admin) ============ */
function setupMapaSalas(){
 const wrap = document.getElementById("mapa-salas");
 if(!wrap) return;
 renderMapa();
 renderPendentes();
 popularResponsaveis();

 const modal = document.getElementById("modal-chave");
 document.getElementById("ch-cancelar")?.addEventListener("click",()=>modal.classList.add("hidden"));
}
function popularResponsaveis(){
 const sel = document.getElementById("ch-responsavel");
 if(!sel) return;
 const alvos = getUsuarios().filter(u => u.perfil === "Instrutor" || u.perfil === "Coordenação");
 sel.innerHTML = alvos.map(u=>`<option value="${u.id}">${u.nome} — ${u.perfil}</option>`).join("");
}
function renderMapa(){
 const wrap = document.getElementById("mapa-salas");
 const salas = getSalas();
 wrap.innerHTML = "";
 let livres=0, chaves=0;
 salas.forEach(s=>{
  const emUso = !!s.chave;
  if(emUso) chaves++; else livres++;
  const cell = document.createElement("div");
  cell.className = `sala-cell ${emUso ? "ocupada" : "livre"} ${slug(s.tipo)}`;
  cell.innerHTML = `
   <div class="sala-topo">
    <b>${s.nome}</b>
    <span class="badge-mini">${s.tipo}</span>
   </div>
   <div class="sala-status">
    ${emUso
     ? `<span class="status em-atendimento">Chave com ${s.chave.responsavelNome}</span>
        <small class="muted">${s.chave.motivo || ""}</small>`
     : `<span class="status resolvido">Chave disponível</span>`}
   </div>
   <div class="sala-actions">
    ${emUso
     ? `<button class="btn btn-sm btn-ghost" data-devolver="${s.nome}">Devolver chave</button>`
     : `<button class="btn btn-sm btn-primary" data-atribuir="${s.nome}">Atribuir chave</button>`}
   </div>
  `;
  wrap.appendChild(cell);
 });

 // KPIs
 const set = (id,v)=>{ const el=document.getElementById(id); if(el) el.textContent=v; };
 set("kpi-livres", livres);
 set("kpi-chaves", chaves);
 set("kpi-total", salas.length);
 set("kpi-pendentes", getSolicitacoes().filter(x=>x.status==="Pendente").length);

 wrap.querySelectorAll("button[data-atribuir]").forEach(btn=>{
  btn.addEventListener("click",()=>abrirModalChave(btn.dataset.atribuir));
 });
 wrap.querySelectorAll("button[data-devolver]").forEach(btn=>{
  btn.addEventListener("click",()=>devolverChave(btn.dataset.devolver));
 });
}
function abrirModalChave(nomeSala, opcoes){
 const modal = document.getElementById("modal-chave");
 const titulo = document.getElementById("modal-chave-titulo");
 titulo.textContent = `Atribuir chave — ${nomeSala}`;
 document.getElementById("ch-motivo").value = opcoes?.motivo || "";
 if(opcoes?.responsavelId){
  document.getElementById("ch-responsavel").value = opcoes.responsavelId;
 }
 modal.classList.remove("hidden");
 const form = document.getElementById("form-chave");
 form.onsubmit = (e)=>{
  e.preventDefault();
  const respId = document.getElementById("ch-responsavel").value;
  const resp = getUsuarios().find(u=>u.id===respId);
  const motivo = document.getElementById("ch-motivo").value.trim();
  const salas = getSalas();
  const idx = salas.findIndex(x=>x.nome===nomeSala);
  if(idx<0) return;
  salas[idx].chave = {
   responsavelId: resp.id,
   responsavelNome: resp.nome,
   perfil: resp.perfil,
   motivo,
   desde: new Date().toISOString(),
  };
  setSalas(salas);
  if(opcoes?.solicitacaoId){
   const arr = getSolicitacoes();
   const s = arr.find(x=>x.id===opcoes.solicitacaoId);
   if(s){ s.status = "Atribuída"; s.salaAtribuida = nomeSala; setSolicitacoes(arr); }
  }
  modal.classList.add("hidden");
  toast(`Chave da ${nomeSala} entregue a ${resp.nome}.`);
  renderMapa();
  renderPendentes();
 };
}
function devolverChave(nomeSala){
 const salas = getSalas();
 const idx = salas.findIndex(x=>x.nome===nomeSala);
 if(idx<0) return;
 salas[idx].chave = null;
 setSalas(salas);
 toast(`Chave da ${nomeSala} devolvida.`);
 renderMapa();
}
function renderPendentes(){
 const tbody = document.querySelector("#tabela-pendentes tbody");
 if(!tbody) return;
 const pend = getSolicitacoes().filter(s=>s.status==="Pendente");
 const vazio = document.getElementById("sem-pendentes");
 tbody.innerHTML = "";
 if(pend.length===0){ vazio?.classList.remove("hidden"); return; }
 vazio?.classList.add("hidden");
 pend.forEach(s=>{
  const tr = document.createElement("tr");
  tr.innerHTML = `
   <td><b>#${s.n}</b></td>
   <td>${s.instrutorNome}</td>
   <td>${s.turma}</td>
   <td>${s.salaPreferida}</td>
   <td>${s.data}</td>
   <td>${s.hora}</td>
   <td>
    <button class="btn btn-sm btn-primary" data-aprovar="${s.id}">Atribuir chave</button>
    <button class="btn btn-sm btn-ghost"   data-negar="${s.id}">Negar</button>
   </td>
  `;
  tbody.appendChild(tr);
 });
 tbody.querySelectorAll("button[data-aprovar]").forEach(btn=>{
  btn.addEventListener("click",()=>{
   const s = getSolicitacoes().find(x=>x.id===btn.dataset.aprovar);
   if(!s) return;
   const instrutor = getUsuarios().find(u=>u.email.toLowerCase()===s.instrutorEmail);
   abrirModalChave(s.salaPreferida, {
    solicitacaoId: s.id,
    responsavelId: instrutor?.id,
    motivo: `${s.turma} — ${s.data} ${s.hora}`,
   });
  });
 });
 tbody.querySelectorAll("button[data-negar]").forEach(btn=>{
  btn.addEventListener("click",()=>{
   const arr = getSolicitacoes();
   const s = arr.find(x=>x.id===btn.dataset.negar);
   if(!s) return;
   s.status = "Negada"; setSolicitacoes(arr);
   toast("Solicitação negada.");
   renderPendentes(); renderMapa();
  });
 });
}

/* ============ Usuários (Admin) ============ */
function setupUsuarios(){
 const tbody = document.querySelector("#tabela-usuarios tbody");
 if(!tbody) return;

 const unidadesSel = document.getElementById("u-unidade");
 function fillUnidades(){
  const unis = getUnidades();
  unidadesSel.innerHTML = unis.map(u=>`<option value="${u.nome} - ${u.cidade}">${u.nome} - ${u.cidade}</option>`).join("");
 }
 fillUnidades();

 function render(){
  const arr = getUsuarios();
  tbody.innerHTML = "";
  arr.forEach(u=>{
   const tr = document.createElement("tr");
   tr.innerHTML = `
    <td>${u.nome}</td>
    <td>${u.email}</td>
    <td><span class="prioridade ${slug(u.perfil)}">${u.perfil}</span></td>
    <td>${u.unidade}</td>
    <td>
     <button class="btn btn-sm btn-ghost" data-editar="${u.id}">Editar</button>
     <button class="btn btn-sm btn-ghost" data-excluir="${u.id}">Excluir</button>
    </td>
   `;
   tbody.appendChild(tr);
  });
  tbody.querySelectorAll("button[data-editar]").forEach(b=>b.addEventListener("click",()=>abrir(b.dataset.editar)));
  tbody.querySelectorAll("button[data-excluir]").forEach(b=>b.addEventListener("click",()=>{
   if(!confirm("Excluir este usuário?")) return;
   setUsuarios(getUsuarios().filter(x=>x.id!==b.dataset.excluir));
   toast("Usuário excluído.");
   render();
  }));
 }
 const modal = document.getElementById("modal-usuario");
 const titulo = document.getElementById("mu-titulo");
 function abrir(id){
  fillUnidades();
  if(id){
   const u = getUsuarios().find(x=>x.id===id);
   titulo.textContent = "Editar usuário";
   document.getElementById("u-id").value = u.id;
   document.getElementById("u-nome").value = u.nome;
   document.getElementById("u-email").value = u.email;
   document.getElementById("u-perfil").value = u.perfil;
   document.getElementById("u-unidade").value = u.unidade;
  } else {
   titulo.textContent = "Novo usuário";
   ["u-id","u-nome","u-email"].forEach(id=>document.getElementById(id).value="");
   document.getElementById("u-perfil").value = "Instrutor";
  }
  modal.classList.remove("hidden");
 }
 document.getElementById("btn-novo-usuario")?.addEventListener("click",()=>abrir(null));
 document.getElementById("u-cancelar")?.addEventListener("click",()=>modal.classList.add("hidden"));
 document.getElementById("form-usuario")?.addEventListener("submit",e=>{
  e.preventDefault();
  const id = document.getElementById("u-id").value;
  const dados = {
   nome: document.getElementById("u-nome").value.trim(),
   email: document.getElementById("u-email").value.trim(),
   perfil: document.getElementById("u-perfil").value,
   unidade: document.getElementById("u-unidade").value,
  };
  if(!dados.nome || !dados.email){ toast("Preencha nome e e-mail."); return; }
  const arr = getUsuarios();
  if(id){
   const u = arr.find(x=>x.id===id); Object.assign(u, dados);
  } else {
   arr.push({id: uid("u"), ...dados});
  }
  setUsuarios(arr);
  modal.classList.add("hidden");
  toast(id ? "Usuário atualizado." : "Usuário criado.");
  render();
 });
 render();
}

/* ============ Unidades (Admin) ============ */
function setupUnidades(){
 const tbody = document.querySelector("#tabela-unidades tbody");
 if(!tbody) return;
 function render(){
  const arr = getUnidades();
  tbody.innerHTML = "";
  arr.forEach(u=>{
   const tr = document.createElement("tr");
   tr.innerHTML = `
    <td><b>${u.nome}</b></td>
    <td>${u.cidade}</td>
    <td>${u.salas}</td>
    <td>
     <button class="btn btn-sm btn-ghost" data-editar="${u.id}">Editar</button>
     <button class="btn btn-sm btn-ghost" data-excluir="${u.id}">Excluir</button>
    </td>
   `;
   tbody.appendChild(tr);
  });
  tbody.querySelectorAll("button[data-editar]").forEach(b=>b.addEventListener("click",()=>abrir(b.dataset.editar)));
  tbody.querySelectorAll("button[data-excluir]").forEach(b=>b.addEventListener("click",()=>{
   if(!confirm("Excluir esta unidade?")) return;
   setUnidades(getUnidades().filter(x=>x.id!==b.dataset.excluir));
   toast("Unidade excluída.");
   render();
  }));
 }
 const modal = document.getElementById("modal-unidade");
 const titulo = document.getElementById("mun-titulo");
 function abrir(id){
  if(id){
   const u = getUnidades().find(x=>x.id===id);
   titulo.textContent = "Editar unidade";
   document.getElementById("un-id").value = u.id;
   document.getElementById("un-nome").value = u.nome;
   document.getElementById("un-cidade").value = u.cidade;
   document.getElementById("un-salas").value = u.salas;
  } else {
   titulo.textContent = "Nova unidade";
   ["un-id","un-nome","un-cidade"].forEach(id=>document.getElementById(id).value="");
   document.getElementById("un-salas").value = 10;
  }
  modal.classList.remove("hidden");
 }
 document.getElementById("btn-nova-unidade")?.addEventListener("click",()=>abrir(null));
 document.getElementById("un-cancelar")?.addEventListener("click",()=>modal.classList.add("hidden"));
 document.getElementById("form-unidade")?.addEventListener("submit",e=>{
  e.preventDefault();
  const id = document.getElementById("un-id").value;
  const dados = {
   nome: document.getElementById("un-nome").value.trim(),
   cidade: document.getElementById("un-cidade").value.trim(),
   salas: parseInt(document.getElementById("un-salas").value,10) || 0,
  };
  if(!dados.nome){ toast("Informe o nome."); return; }
  const arr = getUnidades();
  if(id){ Object.assign(arr.find(x=>x.id===id), dados); }
  else { arr.push({id: uid("un"), ...dados}); }
  setUnidades(arr);
  modal.classList.add("hidden");
  toast(id ? "Unidade atualizada." : "Unidade criada.");
  render();
 });
 render();
}

/* ============ Init ============ */
document.addEventListener("DOMContentLoaded",()=>{
 aplicarPerfil();
 preencherData();
 setupReveal();
 animarContadores();
 setupRipple();
 setupSidebar();
 setupLogin();
 setupChamados();
 setupNovoChamado();
 setupEquipamentos();
 setupMinhasTurmas();
 setupMapaSalas();
 setupUsuarios();
 setupUnidades();
});
