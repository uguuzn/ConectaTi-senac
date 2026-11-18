# ConectaTI Senac — Conectar o Desktop ao Backend & Instalar Dependências

Este guia explica **como o app desktop se conecta ao backend** e **como baixar
as dependências** para rodar e gerar o instalador.

---

## 1. Como a conexão funciona hoje (já está pronta)

O frontend **já fala com o backend** — não precisa escrever nada novo. Toda a
comunicação está em `js/api.js`:

```
Browser (fetch)  →  https://conectati-api.onrender.com  →  (API REST)
                     endpoints: /auth/login, /usuarios, ...
```

- O `login.html` chama `ConectaTIAPI.login(email, senha)` → `POST /auth/login`.
- O token recebido é salvo em `localStorage` (`sessaoConectaTI`) e enviado
  automaticamente nas próximas requisições no header `Authorization`.
- O `baseUrl` está definido em `js/api.js`:
  ```js
  const baseUrl = 'https://conectati-api.onrender.com';
  ```

> Para apontar para outro backend (ex.: um local), basta trocar essa linha.

---

## 2. Por que abrir direto no `file://` NÃO conecta (CORS)

O backend tem uma **lista de origens permitidas** (CORS). Testado em
`/auth/login`, ele só aceita estas origens:

| Origem | Resultado |
|---|---|
| `http://localhost:5500` | ✅ liberado |
| `http://localhost:3000` | ✅ liberado |
| `http://127.0.0.1:5500` / `http://127.0.0.1:3000` | ✅ liberado |
| `http://localhost` (sem porta) | ❌ 403 Invalid CORS request |
| `http://localhost:8080`, `:5000`, `:1234` | ❌ 403 |
| `file://` (abrir o HTML direto no navegador) | ❌ 403 |
| `Origin: null` | ❌ 403 |

**Conclusão:** o app precisa rodar a partir de `http://localhost:5500` (ou
`:3000`). O Electron abaixo já faz isso automaticamente.

---

## 3. Pré-requisitos (baixar as dependências)

1. **Node.js 18 ou superior** — baixe em https://nodejs.org/ (instale a versão
   LTS). O `npm` vem junto.
   - Verifique: `node -v`  e  `npm -v`.

2. **(Opcional, só para gerar instalador .exe no Windows)** nada extra além do
   Node; o `electron-builder` cuida de tudo.

> Não é necessário instalar o Electron manualmente — ele entra como dependência
> do projeto no passo seguinte.

---

## 4. Rodar como WEB local (mais rápido para testar)

Se você só quer testar no navegador, sirva a pasta pela porta 5500:

**Opção A — VS Code (Live Server):**
- Instale a extensão *Live Server*, clique direito em `index.html` →
  *Open with Live Server*. (Ele usa a porta 5500 por padrão — exatamente a que
  o backend libera.)

**Opção B — Python (sem instalar nada extra):**
```bash
cd "ConectaTI Senac"
python -m http.server 5500
```
Depois abra `http://localhost:5500/`.

**Opção C — Node (npx serve):**
```bash
npx serve -l 5500
```

---

## 5. Rodar como DESKTOP (Electron)

Na pasta do projeto (`ConectaTI Senac/`):

```bash
# 1) baixa as dependências (electron + electron-builder) — só na 1ª vez
npm install

# 2) abre o app como janela de desktop
npm start
```

O que o `npm start` faz: o Electron sobe um servidor HTTP local na porta
`5500` (ou `3000` se a 5500 estiver ocupada) e abre a janela do app carregando
`http://localhost:5500/index.html`. Assim o `Origin` bate com o que o backend
aceita e o login funciona normalmente. Tudo isso está em `electron/main.js`.

---

## 6. Gerar o instalador (.exe / AppImage / .dmg)

```bash
npm run dist          # gera o instalador para o SO atual
npm run dist:win      # Windows (.exe via NSIS)
npm run dist:linux    # Linux (AppImage + .deb)
npm run dist:mac      # macOS (.dmg)
```

Os instaladores saem na pasta `dist/`.

> Dica: para gerar `.exe` no Linux/Mac você precisaria do Docker/Wine; o
> ideal é rodar `npm run dist:win` dentro de um Windows.

---

## 7. Estrutura de arquivos (o que foi adicionado)

```
ConectaTI Senac/
├── package.json          # dependências e config do electron-builder
├── electron/
│   └── main.js           # processo principal: servidor local + janela
├── assets/
│   ├── logo-senac.png    # logo usada nas telas
│   └── icon.png          # ícone 512x512 do app (gerado da logo)
├── css/  js/  *.html     # o app web (inalterado nesta parte)
└── GUIA-DESKTOP.md       # este guia
```

---

## 8. Problemas comuns

| Sintoma | Causa / Solução |
|---|---|
| **403 "Invalid CORS request"** no login | O app não está rodando em `localhost:5500`/`:3000`. Use o `npm start` (Electron) ou sirva na porta certa (seção 4). |
| **"Não foi possível conectar à API..."** | O backend (Render **free tier**) pode estar "dormindo". Demora até ~60s para acordar na 1ª requisição. Reenvie o login depois de esperar. |
| **Login 400 / credenciais inválidas** | O backend respondeu (CORS ok) — o e-mail/senha estão errados. |
| **Porta 5500 ocupada** | O Electron cai automaticamente para a 3000. Se ambas estiverem ocupadas, feche o programa que as usa ou troque. |
| **Tela em branco no Electron** | Abra o DevTools (Ctrl+Shift+I) e veja o Console; normalmente é caminho de asset errado. |
| **Token expirado / acesso negado** | Faça logout (botão *Sair*) e login novamente para renovar a sessão no `localStorage`. |

---

## 9. Resumo dos comandos

```bash
cd "ConectaTI Senac"
npm install        # baixa electron + electron-builder
npm start          # abre o desktop
npm run dist       # gera o instalador
```
