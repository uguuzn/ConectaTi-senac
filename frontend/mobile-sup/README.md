# ConectaTI Senac — App Mobile (React Native + Expo)

Cliente mobile do sistema ConectaTI, desenvolvido em **React Native** com o **Expo**.
Consome as mesmas APIs do sistema web (`/api/chamados` e `/api/avaliacoes`).

## Telas

- **Login** — seleção de unidade (Senac DF), usuário e senha (perfil Suporte TI).
- **Chamados** — lista com busca, filtros por status, pull-to-refresh, ações do
  Suporte TI (iniciar atendimento / fechar chamado) e formulário de novo chamado.

## Como executar

```bash
# 1. Rode o servidor web do ConectaTI (raiz do projeto)
bun run dev   # ou: npm run dev

# 2. Em outro terminal, entre na pasta mobile e instale as dependências
cd mobile
npm install

# 3. Aponte para o IP do seu computador (necessário para celular físico)
#    Edite mobile/src/api.ts:
#      export const API_URL = "http://SEU_IP_LOCAL:3000";

# 4. Inicie o Expo
npx expo start
```

Escaneie o QR Code exibido com o app **Expo Go** (Android/iOS) ou pressione
`a` para emulador Android / `i` para simulador iOS.

## Publicar no TestFlight (iOS)

O convite do TestFlight (link/código) é gerado pela **Apple** no App Store
Connect depois que o build do app é enviado. Passos:

1. **Conta Apple Developer** (US$ 99/ano) em developer.apple.com e criar o
   App ID `br.senac.conectati.mobile` (ou aceite o que o EAS registrar).
2. No App Store Connect, crie o app "ConectaTI Senac" (bundle
   `br.senac.conectati.mobile`, SKU `conectati-senac`).
3. **Ajuste a API**: em `src/api.ts`, troque `API_URL` pelo endereço
   **público e HTTPS** do backend (localhost não funciona nos iPhones
   dos testadores).
4. Gere e envie o build (não precisa de Mac):

   ```bash
   npm install -g eas-cli
   eas login                       # conta Apple/Expo
   eas init                        # vincula o projeto (preenche projectId)
   eas build --platform ios --profile production
   eas submit --platform ios --latest
   ```

5. No App Store Connect → **TestFlight**, preencha as informações de teste,
   espere a análise da Apple (beta) e ative o **Public Link** (ou convide
   testadores por e-mail). O código do link, ex. `CNCTTI`, é gerado
   automaticamente — compartilhe com os testadores.
6. A cada nova versão: aumente `buildNumber` em `app.json` (ou use
   `autoIncrement`, já ativo em `eas.json`) e repita `eas build` + `eas submit`.

## Estrutura

```
mobile/
├── App.tsx                    # raiz: alterna Login ⇄ Chamados
├── app.json                   # configuração Expo (iOS: br.senac.conectati.mobile)
├── eas.json                   # perfis de build EAS (development/preview/production)
├── assets/
│   ├── icon.png               # ícone 1024×1024 (App Store/TestFlight)
│   ├── adaptive-icon.png      # ícone adaptativo Android
│   ├── splash-icon.png        # splash (fundo azul)
│   └── favicon.png
└── src/
    ├── api.ts                 # tipos + acesso à API (API_URL configurável)
    └── screens/
        ├── LoginScreen.tsx    # unidade + usuário + senha
        └── ChamadosScreen.tsx # lista, filtros, novo chamado, ações do suporte
```
