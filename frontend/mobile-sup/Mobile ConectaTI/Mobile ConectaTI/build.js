const fs = require("node:fs");
const path = require("node:path");
const babel = require("@babel/core");

const root = __dirname;
const outputDir = path.join(root, "public");
const source = fs.readFileSync(path.join(root, "index.html"), "utf8");
const scriptPattern = /<script type="text\/babel">([\s\S]*?)<\/script>/;
const match = source.match(scriptPattern);

if (!match) throw new Error("Não foi possível localizar o código JSX do aplicativo.");

const compiled = babel.transformSync(match[1], {
  presets: ["@babel/preset-react"],
  sourceType: "script",
  compact: true,
});
if (!compiled?.code) throw new Error("A compilação do aplicativo não produziu JavaScript.");

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(path.join(outputDir, "app.js"), compiled.code);
fs.writeFileSync(path.join(outputDir, "index.html"), source.replace(scriptPattern, '<script defer src="/assets/app.js"></script>'));
