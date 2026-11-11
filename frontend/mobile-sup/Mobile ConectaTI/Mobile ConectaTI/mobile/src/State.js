import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import * as SecureStore from "expo-secure-store";
import * as FileSystem from "expo-file-system/legacy";

const AppContext = createContext(null);
const SERVER_KEY = "conectati.server";
const TOKEN_KEY = "conectati.token";
const DEFAULT_SERVER = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

async function requestAt(serverUrl, path, options = {}) {
  const { method = "GET", body, headers = {}, token, csrf, raw = false } = options;
  const requestHeaders = { ...headers };
  if (token) requestHeaders.Authorization = `Bearer ${token}`;
  if (csrf && method !== "GET") requestHeaders["X-CSRF-Token"] = csrf;
  if (body !== undefined && !raw) requestHeaders["Content-Type"] = "application/json";
  let response;
  try {
    response = await fetch(`${serverUrl.replace(/\/+$/, "")}${path}`, {
      method,
      headers: requestHeaders,
      body: body === undefined ? undefined : raw ? body : JSON.stringify(body),
    });
  } catch {
    throw new Error(`Não foi possível conectar a ${serverUrl}. Confira o endereço e se o servidor está acessível na rede.`);
  }
  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error("O servidor retornou uma resposta inválida.");
  }
  if (!response.ok) throw new Error(data.error || "Não foi possível concluir a operação.");
  return data;
}

export function AppProvider({ children }) {
  const [serverUrl, setServerUrl] = useState(DEFAULT_SERVER);
  const [token, setToken] = useState(null);
  const [csrf, setCsrf] = useState("");
  const [session, setSession] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [booting, setBooting] = useState(true);
  const [serviceError, setServiceError] = useState("");

  const request = useCallback((path, options = {}) => requestAt(serverUrl, path, {
    ...options,
    token: options.token ?? token,
    csrf: options.csrf ?? csrf,
  }), [serverUrl, token, csrf]);

  const loadData = useCallback(async (nextToken = token, nextCsrf = csrf, user = session, baseUrl = serverUrl) => {
    const api = (path) => requestAt(baseUrl, path, { token: nextToken, csrf: nextCsrf });
    const [ticketData, roomData, userData] = await Promise.all([
      api("/api/tickets"),
      api("/api/rooms"),
      user?.role === "admin" ? api("/api/users") : Promise.resolve({ users: [] }),
    ]);
    setTickets(ticketData.tickets);
    setRooms(roomData.rooms);
    setUsers(userData.users);
    setServiceError("");
  }, [serverUrl, token, csrf, session]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [savedServer, savedToken] = await Promise.all([
          SecureStore.getItemAsync(SERVER_KEY),
          SecureStore.getItemAsync(TOKEN_KEY),
        ]);
        if (!active) return;
        const nextServer = savedServer || DEFAULT_SERVER;
        setServerUrl(nextServer);
        if (savedToken) {
          setToken(savedToken);
          const data = await requestAt(nextServer, "/api/session", { token: savedToken });
          if (!active) return;
          if (data.user) {
            setCsrf(data.csrf || "");
            setSession(data.user);
            const api = (path) => requestAt(nextServer, path, { token: savedToken, csrf: data.csrf || "" });
            const [ticketData, roomData, userData] = await Promise.all([
              api("/api/tickets"),
              api("/api/rooms"),
              data.user.role === "admin" ? api("/api/users") : Promise.resolve({ users: [] }),
            ]);
            if (!active) return;
            setTickets(ticketData.tickets);
            setRooms(roomData.rooms);
            setUsers(userData.users);
          } else {
            await SecureStore.deleteItemAsync(TOKEN_KEY);
            setToken(null);
          }
        }
      } catch (error) {
        if (active) setServiceError(error.message);
      } finally {
        if (active) setBooting(false);
      }
    })();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!session) return undefined;
    const timer = setInterval(() => {
      loadData().catch((error) => setServiceError(error.message));
    }, 30000);
    return () => clearInterval(timer);
  }, [session, loadData]);

  const login = useCallback(async (url, email, password) => {
    let parsed;
    try {
      parsed = new URL(url.trim());
    } catch {
      throw new Error("Informe um endereço válido, como http://192.168.1.20:3000.");
    }
    if (!["http:", "https:"].includes(parsed.protocol) || parsed.pathname !== "/" || parsed.search || parsed.hash) {
      throw new Error("Informe apenas o endereço do servidor, incluindo http:// ou https://.");
    }
    const normalized = parsed.origin;
    await SecureStore.setItemAsync(SERVER_KEY, normalized);
    setServerUrl(normalized);
    const data = await requestAt(normalized, "/api/login", {
      method: "POST",
      headers: { "X-ConectaTI-Client": "mobile" },
      body: { email: email.trim(), password },
    });
    if (!data.token) throw new Error("O servidor não retornou uma sessão móvel válida. Atualize o backend.");
    await SecureStore.setItemAsync(TOKEN_KEY, data.token);
    setToken(data.token);
    setCsrf(data.csrf);
    setSession(data.user);
    try {
      await loadData(data.token, data.csrf, data.user, normalized);
    } catch (error) {
      setServiceError(error.message);
    }
    return data.user;
  }, [loadData]);

  const logout = useCallback(async () => {
    let error;
    try {
      await request("/api/logout", { method: "POST" });
    } catch (caught) {
      error = caught;
    } finally {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      setToken(null);
      setCsrf("");
      setSession(null);
      setTickets([]);
      setRooms([]);
      setUsers([]);
    }
    if (error) throw error;
  }, [request]);

  const uploadAttachment = useCallback(async (ticketId, asset) => {
    const response = await FileSystem.uploadAsync(
      `${serverUrl.replace(/\/+$/, "")}/api/tickets/${encodeURIComponent(ticketId)}/attachments`,
      asset.uri,
      {
        httpMethod: "POST",
        uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
        headers: {
          Authorization: `Bearer ${token}`,
          "X-CSRF-Token": csrf,
          "Content-Type": "application/octet-stream",
          "X-File-Name": encodeURIComponent(asset.name),
        },
      },
    );
    let data;
    try {
      data = JSON.parse(response.body);
    } catch {
      throw new Error("O servidor retornou uma resposta inválida.");
    }
    if (response.status < 200 || response.status >= 300) {
      throw new Error(data.error || "Não foi possível enviar o anexo.");
    }
    setTickets(data.tickets);
  }, [serverUrl, token, csrf]);

  const downloadAttachment = useCallback(async (attachmentId, fileName) => {
    const safeName = fileName.replace(/[^\p{L}\p{N}._-]/gu, "_").slice(0, 120) || "anexo";
    const destination = `${FileSystem.cacheDirectory}${Date.now()}-${safeName}`;
    const result = await FileSystem.downloadAsync(
      `${serverUrl.replace(/\/+$/, "")}/api/attachments/${encodeURIComponent(attachmentId)}`,
      destination,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    if (result.status !== 200) {
      await FileSystem.deleteAsync(result.uri, { idempotent: true });
      throw new Error("Não foi possível baixar o anexo. Verifique sua sessão e tente novamente.");
    }
    return result.uri;
  }, [serverUrl, token]);

  const value = useMemo(() => ({
    serverUrl, session, csrf, tickets, rooms, users, booting, serviceError,
    setSession, setTickets, setRooms, setUsers, setServiceError,
    request, login, logout, loadData, uploadAttachment, downloadAttachment,
  }), [serverUrl, session, csrf, tickets, rooms, users, booting, serviceError, request, login, logout, loadData, uploadAttachment, downloadAttachment]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const value = useContext(AppContext);
  if (!value) throw new Error("useApp deve ser usado dentro de AppProvider.");
  return value;
}
