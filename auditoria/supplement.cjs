const fs = require("fs"),
  path = require("path"),
  http = require("http");
const { chromium } = require("playwright");
const root = path.resolve(__dirname, ".."),
  base = path.join(root, "frontend", "desktop-admin", "ConectaTI Senac"),
  pages = fs
    .readdirSync(base)
    .filter((f) => f.endsWith(".html"))
    .sort(),
  results = [];
const chromeCandidates =
  process.platform === "win32"
    ? [
        path.join(process.env.ProgramFiles || "C:/Program Files", "Google/Chrome/Application/chrome.exe"),
        path.join(process.env["ProgramFiles(x86)"] || "C:/Program Files (x86)", "Google/Chrome/Application/chrome.exe"),
        path.join(process.env.LOCALAPPDATA || "", "Google/Chrome/Application/chrome.exe"),
      ]
    : process.platform === "darwin"
      ? ["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"]
      : ["/usr/bin/google-chrome", "/usr/bin/chromium", "/usr/bin/chromium-browser"];
const chromePath =
  process.env.CHROME_PATH ||
  (fs.existsSync(chromium.executablePath())
    ? chromium.executablePath()
    : chromeCandidates.find(fs.existsSync));
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "application/javascript",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};
const server = http.createServer((q, s) => {
  const p = path.resolve(
    base,
    "." + decodeURIComponent(new URL(q.url, "http://localhost").pathname),
  );
  if (p !== base && !p.startsWith(base + path.sep)) {
    s.writeHead(403).end();
    return;
  }
  fs.stat(p, (e, st) => {
    if (e || !st.isFile()) {
      s.writeHead(404).end();
      return;
    }
    s.writeHead(200, {
      "content-type": mime[path.extname(p)] || "application/octet-stream",
    });
    fs.createReadStream(p).pipe(s);
  });
});
(async () => {
  await new Promise((r) => server.listen(4178, "127.0.0.1", r));
  const browser = await chromium.launch({
    headless: true,
    ...(chromePath ? { executablePath: chromePath } : {}),
    args: ["--no-sandbox"],
  });
  for (const file of pages) {
    const row = { page: file };
    for (const width of [390, 1440]) {
      const ctx = await browser.newContext({
          viewport: { width, height: width === 390 ? 844 : 900 },
        }),
        p = await ctx.newPage();
      try {
        await p.goto(`http://127.0.0.1:4178/${file}`, {
          waitUntil: "load",
          timeout: 10000,
        });
        await p.addScriptTag({
          path: path.join(__dirname, "node_modules", "axe-core", "axe.min.js"),
        });
        const a = await p.evaluate(async () =>
          axe.run(document, {
            runOnly: {
              type: "tag",
              values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"],
            },
          }),
        );
        row[width] = {
          violations: a.violations.map((v) => ({
            id: v.id,
            impact: v.impact,
            help: v.help,
            count: v.nodes.length,
            targets: v.nodes.slice(0, 5).map((n) => n.target),
          })),
          passes: a.passes.length,
        };
      } catch (e) {
        row[width] = { error: e.message };
      }
      await ctx.close();
    }
    results.push(row);
    fs.writeFileSync(
      path.join(__dirname, "axe-resultados.json"),
      JSON.stringify(results, null, 2),
    );
    console.log("axe", file);
  }
  await browser.close();
  try {
    const lm = await import("lighthouse");
    const lh = lm.default || lm;
    const audits = [];
    for (const [name, width, height, formFactor] of [
      ["mobile", 390, 844, "mobile"],
      ["desktop", 1440, 900, "desktop"],
    ]) {
      try {
        const report = await lh("http://127.0.0.1:4178/login.html", {
          logLevel: "error",
          output: "json",
          onlyCategories: [
            "performance",
            "accessibility",
            "best-practices",
            "seo",
          ],
          chromePath: chromePath || undefined,
          chromeFlags: ["--headless", "--no-sandbox"],
          settings: {
            formFactor,
            screenEmulation: {
              mobile: formFactor === "mobile",
              width,
              height,
              deviceScaleFactor: 1,
              disabled: false,
            },
          },
        });
        const l = report.lhr;
        audits.push({
          device: name,
          scores: Object.fromEntries(
            Object.entries(l.categories).map(([k, v]) => [
              k,
              v.score === null ? null : Math.round(v.score * 100),
            ]),
          ),
          url: l.finalDisplayedUrl,
        });
      } catch (e) {
        audits.push({ device: name, error: e.message });
      }
    }
    fs.writeFileSync(
      path.join(__dirname, "lighthouse-resultados.json"),
      JSON.stringify(audits, null, 2),
    );
  } catch (e) {
    fs.writeFileSync(
      path.join(__dirname, "lighthouse-resultados.json"),
      JSON.stringify([{ error: e.message }], null, 2),
    );
  }
  await new Promise((r) => server.close(r));
})().catch((e) => {
  console.error(e);
  server.close();
  process.exitCode = 1;
});
