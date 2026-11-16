const readline = require("node:readline/promises");
const { stdin, stdout } = require("node:process");
const { createUser, db, UNITS } = require("./server");

function readHidden(prompt) {
  return new Promise((resolve, reject) => {
    if (!stdin.isTTY || typeof stdin.setRawMode !== "function") {
      reject(new Error("Execute este comando em um terminal interativo para informar a senha com segurança."));
      return;
    }

    stdout.write(prompt);
    let value = "";
    stdin.setRawMode(true);
    stdin.resume();
    const onData = (chunk) => {
      for (const char of chunk.toString("utf8")) {
        if (char === "\u0003") {
          cleanup();
          reject(new Error("Operação cancelada."));
          return;
        }
        if (char === "\r" || char === "\n") {
          cleanup();
          stdout.write("\n");
          resolve(value);
          return;
        }
        if (char === "\u007f" || char === "\b") {
          value = value.slice(0, -1);
        } else if (char >= " ") {
          value += char;
        }
      }
    };
    const cleanup = () => {
      stdin.off("data", onData);
      stdin.setRawMode(false);
    };
    stdin.on("data", onData);
  });
}

async function main() {
  const prompt = readline.createInterface({ input: stdin, output: stdout });
  try {
    const name = await prompt.question("Nome do administrador: ");
    const email = await prompt.question("E-mail institucional: ");
    const unitAnswer = await prompt.question(`Unidade (1-${UNITS.length}, padrão 1): `);
    const unitIndex = unitAnswer.trim() ? Number(unitAnswer) - 1 : 0;
    if (!Number.isInteger(unitIndex) || unitIndex < 0 || unitIndex >= UNITS.length) {
      throw new Error("Unidade inválida.");
    }
    prompt.close();

    const password = await readHidden("Senha (mínimo 12 caracteres, não será exibida): ");
    const confirm = await readHidden("Confirme a senha: ");
    if (password !== confirm) throw new Error("As senhas não conferem.");

    const user = createUser({
      name,
      email,
      unit: UNITS[unitIndex],
      position: "Administrador do sistema",
      password,
      role: "admin",
    });
    console.log(`Administrador ${user.email} criado.`);
  } finally {
    prompt.close();
    db.close();
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
