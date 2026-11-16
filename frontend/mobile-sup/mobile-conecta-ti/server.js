const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const os = require("node:os");
const { DatabaseSync } = require("node:sqlite");

const ROOT = __dirname;
const DEFAULT_DATA_DIR = process.env.LOCALAPPDATA
  ? path.join(process.env.LOCALAPPDATA, "ConectaTI", "data")
  : path.join(os.homedir(), ".conectati", "data");
const DATA_DIR = process.env.DATA_DIR || DEFAULT_DATA_DIR;
const UPLOAD_DIR = path.join(DATA_DIR, "uploads");
const DB_PATH = process.env.DB_PATH || path.join(DATA_DIR, "conectati.sqlite");
const PORT = Number(process.env.PORT || 3000);
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const UNITS = [
  "Senac 903 Sul (Faculdade Senac DF)",
  "Senac Jessé Freire (SCS)",
  "Senac Taguatinga",
  "Senac Ceilândia",
  "Senac Gama",
  "Senac Sobradinho",
  "Senac Santa Maria",
  "Senac Guará",
];
const CATEGORIES = ["Hardware", "Rede", "Multimídia", "Software"];
const URGENCIES = ["critica", "alta", "media", "baixa"];
const TICKET_STATUSES = ["aberto", "em_atendimento", "fechado"];
const COMPUTER_STATUSES = ["ok", "atendimento", "inoperante"];
const UPLOAD_TYPES = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".pdf": "application/pdf",
  ".txt": "text/plain",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".xls": "application/vnd.ms-excel",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
};
const loginAttempts = new Map();

fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(UPLOAD_DIR, { recursive: true });
const db = new DatabaseSync(DB_PATH);
function transaction(callback) {
  db.exec("BEGIN IMMEDIATE");
  try {
    const result = callback();
    db.exec("COMMIT");
    return result;
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL COLLATE NOCASE UNIQUE,
    position TEXT NOT NULL,
    unit TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'technician')),
    password_salt TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    active INTEGER NOT NULL DEFAULT 1,
    presence TEXT NOT NULL DEFAULT 'Online',
    created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS sessions (
    token_hash TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    csrf_token TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    public_id TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    room TEXT NOT NULL,
    requester TEXT NOT NULL,
    requester_role TEXT NOT NULL,
    urgency TEXT NOT NULL,
    status TEXT NOT NULL,
    sla_due_at TEXT NOT NULL,
    assignee_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    resolved_at TEXT,
    is_demo INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ticket_id INTEGER NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    sender_name TEXT NOT NULL,
    sender_role TEXT NOT NULL,
    text TEXT NOT NULL,
    attachment_id TEXT,
    attachment_name TEXT,
    created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS rooms (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
  );
  CREATE TABLE IF NOT EXISTS computers (
    id TEXT NOT NULL,
    room_id TEXT NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    cpu TEXT NOT NULL,
    ram TEXT NOT NULL,
    ssd TEXT NOT NULL,
    status TEXT NOT NULL,
    history_json TEXT NOT NULL DEFAULT '[]',
    PRIMARY KEY (room_id, id)
  );
  CREATE TABLE IF NOT EXISTS attachments (
    id TEXT PRIMARY KEY,
    ticket_id INTEGER NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    stored_name TEXT NOT NULL,
    original_name TEXT NOT NULL,
    content_type TEXT NOT NULL,
    size INTEGER NOT NULL,
    created_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
  CREATE INDEX IF NOT EXISTS idx_messages_ticket ON messages(ticket_id, id);
`);

function nowIso() {
  return new Date().toISOString();
}

function hashPassword(password, salt) {
  return crypto.scryptSync(password, salt, 64).toString("hex");
}

function validatePassword(password) {
  if (typeof password !== "string" || password.length < 12 || password.length > 200) {
    throw new HttpError(400, "A senha deve conter entre 12 e 200 caracteres.");
  }
}

function publicUser(user) {
  return {
    id: user.id,
    nome: user.name,
    email: user.email,
    cargo: user.position,
    unidade: user.unit,
    role: user.role,
    presence: user.presence || "Online",
  };
}

function createUser({ name, email, position, unit, password, role = "technician" }) {
  const cleanName = String(name || "").trim();
  const cleanEmail = String(email || "").trim().toLowerCase();
  const cleanPosition = String(position || "").trim();
  if (cleanName.length < 2 || cleanName.length > 100) throw new HttpError(400, "Informe um nome válido.");
  if (!/^[^\s@]+@(df\.senac\.br|senac\.br)$/i.test(cleanEmail)) {
    throw new HttpError(400, "Use um e-mail @df.senac.br ou @senac.br.");
  }
  if (!UNITS.includes(unit)) throw new HttpError(400, "Selecione uma unidade válida.");
  if (role !== "admin" && role !== "technician") throw new HttpError(400, "Perfil de acesso inválido.");
  validatePassword(password);
  const salt = crypto.randomBytes(16).toString("hex");
  const user = {
    id: crypto.randomUUID(),
    name: cleanName,
    email: cleanEmail,
    position: cleanPosition || "Técnico de Suporte de TI",
    unit,
    role,
    password_salt: salt,
    password_hash: hashPassword(password, salt),
    created_at: nowIso(),
  };
  try {
    db.prepare(`INSERT INTO users (id, name, email, position, unit, role, password_salt, password_hash, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
      user.id, user.name, user.email, user.position, user.unit, user.role, user.password_salt, user.password_hash, user.created_at
    );
  } catch (error) {
    if (String(error.message).includes("UNIQUE")) throw new HttpError(409, "Já existe uma conta com este e-mail.");
    throw error;
  }
  return publicUser(user);
}

function initializeSeedData() {
  if (db.prepare("SELECT COUNT(*) AS count FROM tickets").get().count === 0) {
    const seed = [
      ["INC-2026-0891", "Projetor sem imagem no auditório", "Multimídia", "Auditório Principal", "Ana Beatriz Lima", "Docente", "critica", "aberto", 18, "O projetor liga, mas não exibe imagem do notebook da bancada.", "08:12"],
      ["INC-2026-0894", "Queda de rede no Lab 03", "Rede", "Lab de Informática 03", "Carlos Mendes", "Coordenador", "critica", "aberto", 26, "Metade das máquinas sem internet desde a abertura.", "08:40"],
      ["INC-2026-0877", "PC-07 não inicia o Windows", "Hardware", "Lab de Informática 01", "Juliana Rocha", "Monitora", "alta", "em_atendimento", 54, "Tela preta após o logo. Alunos sem máquina.", "07:55"],
      ["INC-2026-0862", "Impressora da secretaria offline", "Hardware", "Secretaria", "Paulo Henrique", "Administrativo", "media", "aberto", 140, "Fila travada e status offline no painel.", "Ontem"],
      ["INC-2026-0851", "LibreOffice não abre planilhas", "Software", "Lab de Informática 02", "Marina Costa", "Docente", "baixa", "aberto", 220, "Erro ao abrir .xlsx em três computadores.", "Ontem"],
      ["INC-2026-0840", "Fonte do PC-12 substituída", "Hardware", "Lab de Informática 04", "Rafael Souza", "Docente", "alta", "fechado", 0, "Substituição de fonte de alimentação efetuada.", "07:20"],
      ["INC-2026-0833", "Wi-Fi do auditório restabelecido", "Rede", "Auditório Principal", "Equipe de Eventos", "Operação", "media", "fechado", 0, "Access point reiniciado e SSID validado.", "07:05"],
    ];
    const insertTicket = db.prepare(`INSERT INTO tickets
      (public_id, title, category, room, requester, requester_role, urgency, status, sla_due_at, created_at, is_demo)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`);
    const insertMessage = db.prepare(`INSERT INTO messages
      (ticket_id, sender_name, sender_role, text, created_at) VALUES (?, ?, 'Solicitante', ?, ?)`);
    const insert = () => transaction(() => {
      for (const row of seed) {
        const [publicId, title, category, room, requester, requesterRole, urgency, status, slaMin, text] = row;
        const createdAt = nowIso();
        const dueAt = status === "fechado" ? createdAt : new Date(Date.now() + slaMin * 60_000).toISOString();
        const result = insertTicket.run(publicId, title, category, room, requester, requesterRole, urgency, status, dueAt, createdAt);
        insertMessage.run(Number(result.lastInsertRowid), requester, text, createdAt);
      }
    });
    insert();
  }

  if (db.prepare("SELECT COUNT(*) AS count FROM rooms").get().count === 0) {
    const names = ["Lab de Informática 01", "Lab de Informática 02", "Lab de Informática 03", "Lab de Informática 04", "Auditório Principal", "Sala Multimídia"];
    const insertRoom = db.prepare("INSERT INTO rooms (id, name) VALUES (?, ?)");
    const insertPc = db.prepare("INSERT INTO computers (id, room_id, cpu, ram, ssd, status, history_json) VALUES (?, ?, ?, ?, ?, ?, ?)");
    const seed = () => transaction(() => {
      names.forEach((name, i) => {
        const roomId = `sala-${i + 1}`;
        const count = name.includes("Auditório") ? 8 : name.includes("Multimídia") ? 12 : 24;
        insertRoom.run(roomId, name);
        for (let n = 1; n <= count; n += 1) {
          const status = n % 13 === 0 ? "inoperante" : n % 8 === 0 ? "atendimento" : "ok";
          const history = ["Preventiva em ago/2026", n % 2 ? "Troca de periférico em mai/2026" : "Formatação em mar/2026"];
          insertPc.run(`PC-${String(n).padStart(2, "0")}`, roomId, n % 3 === 0 ? "Intel Core i5-12400" : "Intel Core i7-12700", n % 5 === 0 ? "8 GB DDR4" : "16 GB DDR4", n % 4 === 0 ? "256 GB NVMe" : "512 GB NVMe", status, JSON.stringify(history));
        }
      });
    });
    seed();
  }
}

initializeSeedData();

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function json(res, status, value) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify(value));
}

function readBody(req, limit = 1024 * 1024) {
  return new Promise((resolve, reject) => {
    let size = 0;
    let tooLarge = false;
    const chunks = [];
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > limit) {
        if (!tooLarge) reject(new HttpError(413, "O arquivo enviado excede o limite permitido."));
        tooLarge = true;
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => {
      if (!tooLarge) resolve(Buffer.concat(chunks));
    });
    req.on("error", reject);
  });
}

async function readJson(req) {
  const buffer = await readBody(req);
  try {
    return JSON.parse(buffer.toString("utf8"));
  } catch {
    throw new HttpError(400, "Corpo da requisição inválido.");
  }
}

function getCookies(req) {
  return Object.fromEntries((req.headers.cookie || "").split(";").map((part) => {
    const index = part.indexOf("=");
    return index < 0 ? ["", ""] : [part.slice(0, index).trim(), part.slice(index + 1).trim()];
  }).filter(([key]) => key));
}

function sessionFor(req) {
  const bearer = /^Bearer ([^\s]+)$/i.exec(req.headers.authorization || "");
  const token = bearer ? bearer[1] : getCookies(req).conectati_session;
  if (!token) throw new HttpError(401, "Sessão expirada. Entre novamente.");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const row = db.prepare(`SELECT s.token_hash, s.csrf_token, s.expires_at, u.*
    FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = ?`).get(tokenHash);
  if (!row || row.active !== 1 || Date.parse(row.expires_at) <= Date.now()) {
    db.prepare("DELETE FROM sessions WHERE token_hash = ?").run(tokenHash);
    throw new HttpError(401, "Sessão expirada. Entre novamente.");
  }
  return { tokenHash, csrf: row.csrf_token, user: publicUser(row) };
}

function checkRequestOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return;
  let parsed;
  try {
    parsed = new URL(origin);
  } catch {
    throw new HttpError(403, "Origem da requisição inválida.");
  }
  if (parsed.host !== req.headers.host) throw new HttpError(403, "Origem da requisição não autorizada.");
}

function requireCsrf(req, auth) {
  checkRequestOrigin(req);
  const supplied = req.headers["x-csrf-token"] || "";
  const expected = auth.csrf;
  const suppliedBuffer = Buffer.from(supplied);
  const expectedBuffer = Buffer.from(expected);
  if (suppliedBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(suppliedBuffer, expectedBuffer)) {
    throw new HttpError(403, "Token de segurança inválido. Atualize a página e tente novamente.");
  }
}

function requireAdmin(auth) {
  if (auth.user.role !== "admin") throw new HttpError(403, "Ação permitida somente para administradores.");
}

function ticketRows() {
  const rows = db.prepare(`SELECT t.*, u.name AS assignee_name
    FROM tickets t LEFT JOIN users u ON u.id = t.assignee_id ORDER BY t.id DESC`).all();
  const messages = db.prepare(`SELECT m.*, u.name AS current_user_name FROM messages m
    LEFT JOIN users u ON u.id = m.user_id ORDER BY m.id`).all();
  const byTicket = new Map();
  for (const message of messages) {
    if (!byTicket.has(message.ticket_id)) byTicket.set(message.ticket_id, []);
    byTicket.get(message.ticket_id).push({
      who: message.sender_name || message.current_user_name || "Suporte",
      role: message.sender_role,
      text: message.text,
      time: new Date(message.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      attachmentId: message.attachment_id,
      attachmentName: message.attachment_name,
    });
  }
  return rows.map((row) => ({
    id: row.public_id,
    title: row.title,
    category: row.category,
    room: row.room,
    requester: row.requester,
    role: row.requester_role,
    urgency: row.urgency,
    status: row.status,
    slaMin: row.status === "fechado" ? 0 : Math.max(0, Math.ceil((Date.parse(row.sla_due_at) - Date.now()) / 60_000)),
    assignee: row.assignee_name,
    assigneeId: row.assignee_id,
    resolvedToday: row.resolved_at ? new Date(row.resolved_at).toDateString() === new Date().toDateString() : false,
    demo: row.is_demo === 1,
    messages: byTicket.get(row.id) || [],
  }));
}

function insertMessage(ticketId, user, text, attachmentId = null, attachmentName = null) {
  db.prepare(`INSERT INTO messages (ticket_id, user_id, sender_name, sender_role, text, attachment_id, attachment_name, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(ticketId, user.id, user.nome, "Suporte", text, attachmentId, attachmentName, nowIso());
}

function findTicket(publicId) {
  const ticket = db.prepare("SELECT * FROM tickets WHERE public_id = ?").get(publicId);
  if (!ticket) throw new HttpError(404, "Chamado não encontrado.");
  return ticket;
}

function mappedRooms() {
  return db.prepare("SELECT id, name FROM rooms ORDER BY name").all().map((room) => ({
    id: room.id,
    name: room.name,
    pcs: db.prepare("SELECT id, cpu, ram, ssd, status, history_json FROM computers WHERE room_id = ? ORDER BY id").all(room.id).map((pc) => ({
      id: pc.id,
      cpu: pc.cpu,
      ram: pc.ram,
      ssd: pc.ssd,
      status: pc.status,
      history: JSON.parse(pc.history_json),
    })),
  }));
}

function sessionCookie(token, maxAge) {
  const secure = process.env.COOKIE_SECURE === "true" ? "; Secure" : "";
  return `conectati_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`;
}

async function handleApi(req, res, url) {
  const method = req.method;
  const pathname = url.pathname;
  checkRequestOrigin(req);

  if (method === "POST" && pathname === "/api/login") {
    const body = await readJson(req);
    const email = String(body.email || "").trim().toLowerCase();
    const password = typeof body.password === "string" ? body.password : "";
    if (db.prepare("SELECT COUNT(*) AS count FROM users").get().count === 0) {
      throw new HttpError(503, "Ainda não há contas cadastradas. Execute npm.cmd run create-admin no computador servidor para criar o primeiro administrador.");
    }
    const clientIp = req.socket.remoteAddress || "unknown";
    const attempt = loginAttempts.get(clientIp);
    if (attempt?.blockedUntil > Date.now()) throw new HttpError(429, "Muitas tentativas. Aguarde 15 minutos e tente novamente.");
    const row = db.prepare("SELECT * FROM users WHERE email = ? AND active = 1").get(email);
    const salt = row ? row.password_salt : "conectati-invalid-user-salt";
    const expected = row ? row.password_hash : hashPassword("invalid-password", salt);
    const actual = hashPassword(password.length <= 200 ? password : "", salt);
    const expectedBuffer = Buffer.from(expected, "hex");
    const actualBuffer = Buffer.from(actual, "hex");
    if (!row || expectedBuffer.length !== actualBuffer.length || !crypto.timingSafeEqual(expectedBuffer, actualBuffer)) {
      const failures = (attempt?.failures || 0) + 1;
      loginAttempts.set(clientIp, {
        failures,
        blockedUntil: failures >= 5 ? Date.now() + 15 * 60_000 : 0,
      });
      throw new HttpError(401, "E-mail ou senha incorretos.");
    }
    loginAttempts.delete(clientIp);
    const token = crypto.randomBytes(32).toString("base64url");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const csrf = crypto.randomBytes(32).toString("base64url");
    const expires = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString();
    db.prepare("INSERT INTO sessions (token_hash, user_id, csrf_token, expires_at, created_at) VALUES (?, ?, ?, ?, ?)")
      .run(tokenHash, row.id, csrf, expires, nowIso());
    const mobileClient = req.headers["x-conectati-client"] === "mobile";
    if (!mobileClient) res.setHeader("Set-Cookie", sessionCookie(token, 8 * 60 * 60));
    return json(res, 200, { user: publicUser(row), csrf, ...(mobileClient ? { token } : {}) });
  }

  if (method === "GET" && pathname === "/api/session") {
    try {
      const auth = sessionFor(req);
      return json(res, 200, { user: auth.user, csrf: auth.csrf });
    } catch (error) {
      if (error instanceof HttpError && error.status === 401) return json(res, 200, { user: null, csrf: null });
      throw error;
    }
  }

  const auth = sessionFor(req);
  if (method !== "GET") requireCsrf(req, auth);

  if (method === "POST" && pathname === "/api/logout") {
    db.prepare("DELETE FROM sessions WHERE token_hash = ?").run(auth.tokenHash);
    res.setHeader("Set-Cookie", sessionCookie("", 0));
    return json(res, 200, { ok: true });
  }

  if (method === "PATCH" && pathname === "/api/profile") {
    const body = await readJson(req);
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const position = String(body.position || "").trim();
    const unit = String(body.unit || "");
    if (name.length < 2 || name.length > 100) throw new HttpError(400, "Informe um nome válido.");
    if (!/^[^\s@]+@(df\.senac\.br|senac\.br)$/i.test(email)) throw new HttpError(400, "Use um e-mail institucional válido.");
    if (position.length > 100 || !UNITS.includes(unit)) throw new HttpError(400, "Confira cargo e unidade.");
    try {
      db.prepare("UPDATE users SET name = ?, email = ?, position = ?, unit = ? WHERE id = ?")
        .run(name, email, position || "Técnico de Suporte de TI", unit, auth.user.id);
    } catch (error) {
      if (String(error.message).includes("UNIQUE")) throw new HttpError(409, "Já existe uma conta com este e-mail.");
      throw error;
    }
    const updated = db.prepare("SELECT * FROM users WHERE id = ?").get(auth.user.id);
    return json(res, 200, { user: publicUser(updated) });
  }

  if (method === "PATCH" && pathname === "/api/password") {
    const body = await readJson(req);
    const currentPassword = typeof body.currentPassword === "string" ? body.currentPassword : "";
    const newPassword = typeof body.newPassword === "string" ? body.newPassword : "";
    validatePassword(newPassword);
    const user = db.prepare("SELECT password_salt, password_hash FROM users WHERE id = ?").get(auth.user.id);
    const actual = hashPassword(currentPassword, user.password_salt);
    const expected = Buffer.from(user.password_hash, "hex");
    const supplied = Buffer.from(actual, "hex");
    if (expected.length !== supplied.length || !crypto.timingSafeEqual(expected, supplied)) {
      throw new HttpError(400, "A senha atual está incorreta.");
    }
    const salt = crypto.randomBytes(16).toString("hex");
    db.prepare("UPDATE users SET password_salt = ?, password_hash = ? WHERE id = ?")
      .run(salt, hashPassword(newPassword, salt), auth.user.id);
    db.prepare("DELETE FROM sessions WHERE user_id = ? AND token_hash != ?").run(auth.user.id, auth.tokenHash);
    return json(res, 200, { ok: true });
  }

  if (method === "PATCH" && pathname === "/api/presence") {
    const body = await readJson(req);
    const presence = String(body.presence || "");
    if (!["Online", "Em Atendimento", "Ausente"].includes(presence)) throw new HttpError(400, "Status de presença inválido.");
    db.prepare("UPDATE users SET presence = ? WHERE id = ?").run(presence, auth.user.id);
    return json(res, 200, { presence });
  }

  if (method === "GET" && pathname === "/api/tickets") return json(res, 200, { tickets: ticketRows() });

  if (method === "POST" && pathname === "/api/tickets") {
    const body = await readJson(req);
    const title = String(body.title || "").trim();
    const category = String(body.category || "");
    const room = String(body.room || "").trim();
    const requester = String(body.requester || "").trim();
    const requesterRole = String(body.role || "Solicitante").trim();
    const urgency = String(body.urgency || "");
    if (title.length < 3 || title.length > 160) throw new HttpError(400, "O título deve conter entre 3 e 160 caracteres.");
    if (!CATEGORIES.includes(category) || !URGENCIES.includes(urgency)) throw new HttpError(400, "Categoria ou urgência inválida.");
    if (!room || room.length > 100 || requester.length < 2 || requester.length > 100 || requesterRole.length > 60) {
      throw new HttpError(400, "Confira sala, solicitante e cargo.");
    }
    const slaMinutes = { critica: 30, alta: 90, media: 180, baixa: 360 }[urgency];
    const createdAt = nowIso();
    const insert = db.prepare(`INSERT INTO tickets (public_id, title, category, room, requester, requester_role, urgency, status, sla_due_at, created_at)
      VALUES ('pending', ?, ?, ?, ?, ?, ?, 'aberto', ?, ?)`);
    const createTicketTransaction = () => transaction(() => {
      const result = insert.run(title, category, room, requester, requesterRole || "Solicitante", urgency, new Date(Date.now() + slaMinutes * 60_000).toISOString(), createdAt);
      const ticketId = Number(result.lastInsertRowid);
      const publicId = `INC-${new Date().getFullYear()}-${String(900 + ticketId).padStart(4, "0")}`;
      db.prepare("UPDATE tickets SET public_id = ? WHERE id = ?").run(publicId, ticketId);
      db.prepare(`INSERT INTO messages (ticket_id, sender_name, sender_role, text, created_at)
        VALUES (?, ?, 'Solicitante', ?, ?)`).run(ticketId, requester, "Ordem de serviço aberta pelo técnico de campo.", createdAt);
      return publicId;
    });
    const id = createTicketTransaction();
    return json(res, 201, { ticket: ticketRows().find((ticket) => ticket.id === id) });
  }

  if (method === "GET" && pathname === "/api/rooms") return json(res, 200, { rooms: mappedRooms() });

  if (method === "GET" && pathname === "/api/users") {
    requireAdmin(auth);
    const users = db.prepare("SELECT id, name, email, position, unit, role, active FROM users ORDER BY name").all()
      .map((user) => ({ id: user.id, nome: user.name, email: user.email, cargo: user.position, unidade: user.unit, role: user.role, ativo: user.active === 1 }));
    return json(res, 200, { users });
  }

  if (method === "POST" && pathname === "/api/users") {
    requireAdmin(auth);
    const body = await readJson(req);
    const user = createUser({ name: body.name, email: body.email, position: body.position, unit: body.unit, password: body.password });
    return json(res, 201, { user });
  }

  if (method === "POST" && pathname === "/api/users/logout-others") {
    db.prepare("DELETE FROM sessions WHERE user_id = ? AND token_hash != ?").run(auth.user.id, auth.tokenHash);
    return json(res, 200, { ok: true });
  }

  const ticketAction = pathname.match(/^\/api\/tickets\/([^/]+)\/(assume|messages|resolve|attachments)$/);
  if (ticketAction) {
    const publicId = decodeURIComponent(ticketAction[1]);
    const action = ticketAction[2];
    const ticket = findTicket(publicId);
    if (method === "POST" && action === "assume") {
      if (ticket.status === "fechado") throw new HttpError(409, "Chamados encerrados não podem ser assumidos.");
      if (ticket.assignee_id && ticket.assignee_id !== auth.user.id) throw new HttpError(409, "Este chamado já está atribuído a outro técnico.");
      if (ticket.assignee_id !== auth.user.id) {
        const assumeTransaction = () => transaction(() => {
          db.prepare("UPDATE tickets SET status = 'em_atendimento', assignee_id = ? WHERE id = ?").run(auth.user.id, ticket.id);
          insertMessage(ticket.id, auth.user, "Chamado assumido. Iniciando atendimento.");
        });
        assumeTransaction();
      }
      return json(res, 200, { tickets: ticketRows() });
    }
    if (method === "POST" && action === "messages") {
      if (ticket.status === "fechado") throw new HttpError(409, "Não é possível enviar mensagens em um chamado encerrado.");
      if (ticket.assignee_id && ticket.assignee_id !== auth.user.id) throw new HttpError(403, "Somente o técnico responsável pode responder.");
      const body = await readJson(req);
      const text = String(body.text || "").trim();
      if (!text || text.length > 3000) throw new HttpError(400, "A mensagem deve conter entre 1 e 3000 caracteres.");
      insertMessage(ticket.id, auth.user, text);
      return json(res, 200, { tickets: ticketRows() });
    }
    if (method === "POST" && action === "resolve") {
      if (ticket.status === "fechado") throw new HttpError(409, "Este chamado já foi encerrado.");
      if (ticket.assignee_id && ticket.assignee_id !== auth.user.id) throw new HttpError(403, "Somente o técnico responsável pode encerrar.");
      const body = await readJson(req);
      const note = String(body.note || "").trim();
      if (!note || note.length > 3000) throw new HttpError(400, "Informe uma nota técnica de até 3000 caracteres.");
      const resolveTransaction = () => transaction(() => {
        db.prepare("UPDATE tickets SET status = 'fechado', sla_due_at = ?, resolved_at = ?, assignee_id = COALESCE(assignee_id, ?) WHERE id = ?")
          .run(nowIso(), nowIso(), auth.user.id, ticket.id);
        insertMessage(ticket.id, auth.user, `Resolvido: ${note}`);
      });
      resolveTransaction();
      return json(res, 200, { tickets: ticketRows() });
    }
    if (method === "POST" && action === "attachments") {
      if (ticket.status === "fechado") throw new HttpError(409, "Não é possível anexar arquivos a um chamado encerrado.");
      if (ticket.assignee_id && ticket.assignee_id !== auth.user.id) throw new HttpError(403, "Somente o técnico responsável pode anexar arquivos.");
      const bytes = await readBody(req, MAX_UPLOAD_BYTES);
      if (!bytes.length) throw new HttpError(400, "Selecione um arquivo antes de enviar.");
      const encodedName = req.headers["x-file-name"];
      let originalName;
      try {
        originalName = decodeURIComponent(String(encodedName || ""));
      } catch {
        throw new HttpError(400, "Nome do arquivo inválido.");
      }
      originalName = path.basename(originalName).replace(/[^\p{L}\p{N}._ -]/gu, "_").slice(0, 120);
      const extension = path.extname(originalName).toLowerCase();
      const contentType = UPLOAD_TYPES[extension];
      if (!contentType) throw new HttpError(415, "Formato não permitido. Envie imagem, PDF, texto ou documento Office.");
      const id = crypto.randomUUID();
      const storedName = `${id}${extension}`;
      fs.writeFileSync(path.join(UPLOAD_DIR, storedName), bytes, { flag: "wx" });
      try {
        const saveAttachmentTransaction = () => transaction(() => {
          db.prepare("INSERT INTO attachments (id, ticket_id, stored_name, original_name, content_type, size, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)")
            .run(id, ticket.id, storedName, originalName, contentType, bytes.length, nowIso());
          insertMessage(ticket.id, auth.user, `Arquivo anexado: ${originalName}`, id, originalName);
        });
        saveAttachmentTransaction();
      } catch (error) {
        fs.rmSync(path.join(UPLOAD_DIR, storedName), { force: true });
        throw error;
      }
      return json(res, 201, { tickets: ticketRows() });
    }
  }

  const pcAction = pathname.match(/^\/api\/rooms\/([^/]+)\/pcs\/([^/]+)$/);
  if (method === "PATCH" && pcAction) {
    const roomId = decodeURIComponent(pcAction[1]);
    const pcId = decodeURIComponent(pcAction[2]);
    const body = await readJson(req);
    const status = String(body.status || "");
    if (!COMPUTER_STATUSES.includes(status)) throw new HttpError(400, "Status de equipamento inválido.");
    const pc = db.prepare("SELECT * FROM computers WHERE room_id = ? AND id = ?").get(roomId, pcId);
    if (!pc) throw new HttpError(404, "Equipamento não encontrado.");
    if (status !== pc.status) {
      const history = JSON.parse(pc.history_json);
      history.unshift(`Status alterado para ${{ ok: "Operacional", atendimento: "Em atendimento", inoperante: "Inoperante" }[status]} em ${new Date().toLocaleString("pt-BR")}`);
      db.prepare("UPDATE computers SET status = ?, history_json = ? WHERE room_id = ? AND id = ?")
        .run(status, JSON.stringify(history.slice(0, 50)), roomId, pcId);
    }
    return json(res, 200, { rooms: mappedRooms() });
  }

  const attachmentMatch = pathname.match(/^\/api\/attachments\/([a-f0-9-]+)$/i);
  if (method === "GET" && attachmentMatch) {
    const attachment = db.prepare("SELECT * FROM attachments WHERE id = ?").get(attachmentMatch[1]);
    if (!attachment) throw new HttpError(404, "Anexo não encontrado.");
    const filePath = path.join(UPLOAD_DIR, attachment.stored_name);
    if (!fs.existsSync(filePath)) throw new HttpError(404, "O arquivo não está disponível no servidor.");
    const safeName = encodeURIComponent(attachment.original_name);
    res.writeHead(200, {
      "Content-Type": "application/octet-stream",
      "Content-Length": attachment.size,
      "Content-Disposition": `attachment; filename*=UTF-8''${safeName}`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    });
    return fs.createReadStream(filePath).pipe(res);
  }

  throw new HttpError(404, "Recurso não encontrado.");
}

function sendFile(req, res, pathname) {
  const allowed = {
    "/": [path.join(ROOT, "public", "index.html"), "text/html; charset=utf-8"],
    "/index.html": [path.join(ROOT, "public", "index.html"), "text/html; charset=utf-8"],
    "/assets/app.js": [path.join(ROOT, "public", "app.js"), "text/javascript; charset=utf-8"],
    "/assets/styles.css": [path.join(ROOT, "public", "styles.css"), "text/css; charset=utf-8"],
    "/vendor/react.production.min.js": [path.join(ROOT, "node_modules", "react", "umd", "react.production.min.js"), "text/javascript; charset=utf-8"],
    "/vendor/react-dom.production.min.js": [path.join(ROOT, "node_modules", "react-dom", "umd", "react-dom.production.min.js"), "text/javascript; charset=utf-8"],
    "/senac-logo.png": [path.join(ROOT, "senac-logo.png"), "image/png"],
  };
  const resource = allowed[pathname];
  if (!resource) throw new HttpError(404, "Página não encontrada.");
  const [filePath, contentType] = resource;
  if (!fs.existsSync(filePath)) throw new HttpError(404, "Arquivo da aplicação não encontrado.");
  res.writeHead(200, {
    "Content-Type": contentType,
    "Cache-Control": "no-cache",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "same-origin",
    "X-Frame-Options": "DENY",
  });
  fs.createReadStream(filePath).pipe(res);
}

const server = http.createServer(async (req, res) => {
  try {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "same-origin");
    res.setHeader("X-Frame-Options", "DENY");
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    if (url.pathname.startsWith("/api/")) {
      await handleApi(req, res, url);
      return;
    }
    if (req.method !== "GET" && req.method !== "HEAD") throw new HttpError(405, "Método não permitido.");
    sendFile(req, res, url.pathname);
  } catch (error) {
    if (res.headersSent) {
      res.destroy(error);
      return;
    }
    const status = error instanceof HttpError ? error.status : 500;
    if (status === 500) console.error("Erro interno:", error);
    json(res, status, { error: status === 500 ? "Erro interno do servidor." : error.message });
  }
});

server.requestTimeout = 30_000;

if (require.main === module) {
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`ConectaTI disponível em http://localhost:${PORT}`);
    console.log("O servidor aceita conexões da rede local. Configure HTTPS antes de transmitir credenciais.");
    if (db.prepare("SELECT COUNT(*) AS count FROM users").get().count === 0) {
      console.log("Nenhuma conta existe. Crie o primeiro administrador com: npm run create-admin");
    }
  });
}

module.exports = { createUser, db, server, UNITS };
