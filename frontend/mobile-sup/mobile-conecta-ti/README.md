# ConectaTI Senac DF

Aplicativo de helpdesk nativo para Android e iOS, feito em React Native com Expo, conectado à API Node.js e ao banco SQLite do servidor. O projeto também mantém o cliente web. Chamados, conversas, contas e rondas ficam persistidos no computador servidor e podem ser acessados pelos clientes da rede.

## Requisitos

- Node.js 24 ou superior.
- Um servidor interno com armazenamento persistente.
- Acesso à rede para os técnicos.
- Expo Go para testar o aplicativo em um celular, ou um ambiente Android/iOS configurado para compilar o app.

## Iniciar o servidor

Abra um PowerShell na pasta do projeto:

```powershell
npm.cmd install
npm.cmd run create-admin
npm.cmd start
```

O administrador inicial é criado uma única vez. A senha é digitada sem aparecer no terminal e deve ter pelo menos 12 caracteres. O administrador pode cadastrar técnicos pelo app. Mantenha o servidor executando; por padrão ele escuta na porta `3000`.

## Executar o aplicativo React Native

Em outro terminal, na pasta do projeto:

```powershell
npm.cmd --prefix mobile start
```

Instale o **Expo Go** no celular e leia o QR code mostrado pelo Expo. O celular e o computador servidor devem estar na mesma rede. Na tela de login do app, informe o endereço de rede do servidor, por exemplo `http://192.168.1.20:3000`; `localhost` só funciona quando o app roda no próprio computador. Para um emulador Android, use o endereço da máquina hospedeira acessível pelo emulador.

Para iniciar diretamente em um emulador Android com o ambiente nativo configurado, use `npm.cmd --prefix mobile run android`. O projeto Expo fica em [mobile/](./mobile/).

As sessões móveis usam token Bearer armazenado pelo SecureStore do dispositivo; as sessões web continuam usando cookies HTTP-only. As dependências móveis são instaladas separadamente dentro de `mobile/`.

Para o cliente web, abra `http://localhost:3000` no computador servidor ou `http://NOME-OU-IP-DO-SERVIDOR:3000` em outro dispositivo. O firewall do Windows precisa permitir o tráfego na porta configurada (`PORT`, padrão `3000`). O comando `npm.cmd start` compila a interface web antes de iniciar a API.

## Dados e cópias de segurança

O banco e os anexos são gravados fora da pasta do projeto (no Windows, em `%LOCALAPPDATA%\ConectaTI\data`), evitando que o SQLite fique dentro de uma pasta sincronizada como OneDrive. Guarde cópias de segurança consistentes dessa pasta com o serviço parado. Para mudar a pasta de dados, defina `DATA_DIR` antes de iniciar o servidor. `DB_PATH` pode apontar o banco para um arquivo específico.

## Segurança e limitações de implantação

- O acesso usa contas próprias do ConectaTI, senhas derivadas com scrypt e sessões HTTP-only. O domínio de e-mail é validado, mas isso **não** autentica a identidade institucional do Senac.
- O login institucional/SSO não está integrado. Essa integração exige os endpoints, metadados e credenciais técnicas oficiais do provedor de identidade.
- O servidor incluído atende HTTP. Não transmita senhas reais por uma rede compartilhada sem HTTPS. Para produção, coloque-o atrás de um proxy TLS aprovado pela equipe de infraestrutura e defina `COOKIE_SECURE=true`.
- O app móvel aceita HTTP para testes em rede interna. Para uso operacional, use HTTPS aprovado pela equipe de infraestrutura; em HTTP, as credenciais e os tokens podem ser interceptados na rede.
- O SQLite é apropriado para uma instância do serviço em um servidor com disco local persistente. Não coloque o arquivo SQLite em uma pasta de rede compartilhada e não execute várias instâncias apontando para o mesmo banco.
- Os chamados iniciais e o inventário de salas são dados de demonstração. Confirme e substitua-os pelos dados reais da unidade antes do uso operacional.
- Anexos: imagens, PDF, texto e arquivos Office até 10 MB.
