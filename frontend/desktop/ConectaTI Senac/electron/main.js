// ============================================================
// CONECTATI SENAC - PROCESSO PRINCIPAL DO ELECTRON
// ------------------------------------------------------------
// Serve o app web por um servidor HTTP local na porta 5500 (ou
// 3000 como fallback). Isso é NECESSÁRIO porque o backend
// (https://conectati-api.onrender.com) só libera CORS para as
// origens http://localhost:5500 e http://localhost:3000.
// Se o app fosse aberto via file://, o Origin seria "null" e o
// backend devolveria 403 ("Invalid CORS request").
// ============================================================
const { app, BrowserWindow, shell } = require('electron');
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const ROOT = path.join(__dirname, '..'); // raiz do projeto

// Portas cujo Origin o backend aceita (nesta ordem de preferência)
const PORTAS_CANDIDATAS = [5500, 3000];

const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.js':   'text/javascript; charset=utf-8',
    '.css':  'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png':  'image/png',
    '.jpg':  'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif':  'image/gif',
    '.svg':  'image/svg+xml',
    '.ico':  'image/x-icon',
    '.webp': 'image/webp',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.map':  'application/json'
};

function servirArquivo(req, res) {
    // Resolve o caminho pedido dentro de ROOT
    let reqPath = decodeURIComponent(url.parse(req.url).pathname);
    if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

    const filePath = path.join(ROOT, reqPath);

    // Evita path traversal fora da pasta do app
    if (!filePath.startsWith(ROOT)) {
        res.writeHead(403);
        res.end('403 Forbidden');
        return;
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('404 Not Found: ' + reqPath);
            return;
        }
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, {
            'Content-Type': MIME[ext] || 'application/octet-stream',
            'Cache-Control': 'no-cache'
        });
        res.end(data);
    });
}

function iniciarServidor() {
    return new Promise((resolve) => {
        const server = http.createServer(servirArquivo);
        // Tenta cada porta até achar uma livre
        let i = 0;
        const tentar = () => {
            if (i >= PORTAS_CANDIDATAS.length) {
                // Nenhuma das portas liberadas estava livre
                resolve(null);
                return;
            }
            const porta = PORTAS_CANDIDATAS[i++];
            server.once('error', () => tentar());
            server.listen(porta, '127.0.0.1', () => {
                resolve(`http://127.0.0.1:${porta}`);
            });
        };
        tentar();
    });
}

let janelaPrincipal = null;

async function criarJanela() {
    const appUrl = await iniciarServidor();
    if (!appUrl) {
        // Fallback: abre direto via file:// (o login vai falhar por CORS,
        // mas ao menos o usuário vê o que houve)
        console.error('Não foi possível iniciar o servidor nas portas 5500/3000.');
    }

    janelaPrincipal = new BrowserWindow({
        width: 1280,
        height: 800,
        minWidth: 1024,
        minHeight: 600,
        title: 'ConectaTI Senac',
        icon: path.join(ROOT, 'assets', 'icon.png'),
        backgroundColor: '#0F0E17',
        autoHideMenuBar: true,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: true,
            // Sem preload: o app é 100% web (só usa fetch + localStorage)
        }
    });

    // Links externos (ex.: senac.br) abrem no navegador do sistema,
    // não dentro da janela do app
    janelaPrincipal.webContents.setWindowOpenHandler(({ url: u }) => {
        if (u.startsWith('http://') || u.startsWith('https://')) {
            shell.openExternal(u);
            return { action: 'deny' };
        }
        return { action: 'allow' };
    });

    if (appUrl) {
        janelaPrincipal.loadURL(appUrl + '/index.html');
    } else {
        janelaPrincipal.loadFile(path.join(ROOT, 'index.html'));
    }
}

app.whenReady().then(criarJanela);

app.on('window-all-closed', () => {
    // No macOS é comum manter o app ativo até fechar explicitamente
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) criarJanela();
});
