# RodaViva — Locadora de Veículos

Projeto de manutenção — **nível avançado**. Frota, categorias, clientes, seguros, locações,
multas e manutenção de veículos.

## Tecnologias
- Backend: Java + Spring Boot (porta 8087)
- Banco de dados: PostgreSQL (via Docker, porta 5439)
- Frontend: React + TypeScript + Vite (porta 5179)

## Como rodar

1. **Subir o banco de dados** (dentro desta pasta)
   ```
   docker compose up -d
   ```

2. **Rodar o backend**
   ```
   cd backend
   ./mvnw spring-boot:run
   ```
   No Windows, use `mvnw.cmd spring-boot:run` em vez de `./mvnw spring-boot:run`.

   Não precisa ter o Maven instalado — o `mvnw`/`mvnw.cmd` baixa o Maven sozinho dentro
   da pasta `backend/.mvn` na primeira execução (só precisa de internet e do Java instalado).
   Isso funciona mesmo sem permissão de administrador na máquina.

   As tabelas são criadas automaticamente e populadas com dados de exemplo — categorias,
   veículos (um deles já em manutenção), clientes, seguros e uma locação já ativa.

3. **Rodar o frontend** (em outro terminal)
   ```
   cd frontend
   npm install
   npm run dev
   ```

4. Acesse **http://localhost:5179** no navegador.

## As 7 telas

Locações, Veículos, Categorias, Clientes, Seguros, Multas e Manutenção — tudo acessível pelo menu
lateral.

## O que fazer

Use o sistema como a recepção de uma locadora usaria:

- Cadastre uma categoria, um veículo, um cliente e um seguro
- Alugue um veículo, escolhendo um seguro — confira se o valor estimado mostrado no formulário
  bate com o valor final salvo na locação
- Tente alugar o **Toyota Corolla** (já tem uma locação ativa) em datas que se sobrepõem à locação
  existente
- Tente alugar o **BMW X5** (já está em manutenção)
- Finalize uma locação e veja se o veículo volta a aparecer como disponível
- Experimente colocar uma data de devolução prevista **antes** da data de início
- Veja como a tela de Veículos mostra (ou não mostra) o status de cada carro

Qualquer resultado que não fizer sentido é candidato a chamado. Registre no Painel de Manutenção,
resolva, versione no Git seguindo o guia "Do chamado ao Pull Request", e mova o card para
"Incremento Entregue".
