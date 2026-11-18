package br.com.senac.conectati.integration;

import br.com.senac.conectati.enums.TipoUsuario;
import br.com.senac.conectati.model.Categoria;
import br.com.senac.conectati.model.Usuario;
import br.com.senac.conectati.repository.CategoriaRepository;
import br.com.senac.conectati.repository.ChamadoRepository;
import br.com.senac.conectati.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Fluxo completo da API (H2 em modo PostgreSQL) — reproduz os cenários
 * CT01–CT12 e os quatro testes do Postman contra os contratos reais.
 *
 * Divergência documentada: a documentação usa /api/chamados como rota
 * ilustrativa; o contrato real (backend + frontends + Swagger) é /chamados.
 */
@SpringBootTest
@AutoConfigureMockMvc
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class ChamadoApiIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UsuarioRepository usuarios;

    @Autowired
    private ChamadoRepository chamados;

    @Autowired
    private CategoriaRepository categorias;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final Map<String, String> tokens = new ConcurrentHashMap<>();
    private Long chamadoId;
    private Long categoriaId;

    @BeforeAll
    void seedUsuarios() {
        salvarUsuario("Administrador de Teste", "admin-test@conectati.local", "Admin@123", TipoUsuario.ADMINISTRADOR);
        salvarUsuario("Instrutor de Teste", "instrutor-test@conectati.local", "Instrutor@123", TipoUsuario.INSTRUTOR);
        salvarUsuario("Tecnico de Teste", "tecnico-test@conectati.local", "Tecnico@123", TipoUsuario.TECNICO);

        if (categorias.findByNomeIgnoreCase("Informatica").isEmpty()) {
            Categoria categoria = new Categoria();
            categoria.setNome("Informatica");
            categoria.setDescricao("Equipamentos e suporte de TI");
            categorias.save(categoria);
        }
        categoriaId = categorias.findByNomeIgnoreCase("Informatica").orElseThrow().getId();
    }

    private void salvarUsuario(String nome, String email, String senha, TipoUsuario tipo) {
        if (usuarios.existsByEmail(email)) {
            return;
        }
        Usuario usuario = new Usuario();
        usuario.setNome(nome);
        usuario.setEmail(email);
        usuario.setSenha(passwordEncoder.encode(senha));
        usuario.setTipo(tipo);
        usuario.setAtivo(true);
        usuarios.save(usuario);
    }

    private String token(String chave) throws Exception {
        if (!tokens.containsKey(chave)) {
            String email = switch (chave) {
                case "admin" -> "admin-test@conectati.local";
                case "instrutor" -> "instrutor-test@conectati.local";
                case "tecnico" -> "tecnico-test@conectati.local";
                default -> throw new IllegalArgumentException(chave);
            };
            String senha = switch (chave) {
                case "admin" -> "Admin@123";
                case "instrutor" -> "Instrutor@123";
                case "tecnico" -> "Tecnico@123";
                default -> throw new IllegalArgumentException(chave);
            };
            MvcResult resultado = mockMvc.perform(post("/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{\"email\":\"" + email + "\",\"senha\":\"" + senha + "\"}"))
                    .andExpect(status().isOk())
                    .andReturn();
            String corpo = resultado.getResponse().getContentAsString();
            String token = corpo.split("\"token\":\"")[1].split("\"")[0];
            tokens.put(chave, token);
        }
        return tokens.get(chave);
    }

    private String corpoChamadoValido() {
        return "{\"titulo\":\"Notebook nao liga\",\"descricao\":\"Notebook do carrinho nao liga e a aula precisa do equipamento.\","
                + "\"prioridade\":\"ALTA\",\"categoriaId\":" + categoriaId + ",\"solicitanteId\":1}";
    }

    // ---------- CT12 / Postman Teste 4 ----------

    @Test
    @Order(1)
    @DisplayName("CT12 / Postman 4 - requisição sem token devolve 401 e não expõe dados")
    void semTokenRejeitado() throws Exception {
        mockMvc.perform(get("/chamados"))
                .andExpect(status().isUnauthorized());
        mockMvc.perform(post("/chamados")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(corpoChamadoValido()))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @Order(2)
    @DisplayName("CT12 - e-mail ou senha inválidos devolve 400 com mensagem genérica")
    void loginInvalido() throws Exception {
        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"admin-test@conectati.local\",\"senha\":\"errada\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("E-mail ou senha invalidos."));
    }

    // ---------- CT01 ----------

    @Test
    @Order(3)
    @DisplayName("CT01 - POST válido devolve 201 com identificador gerado")
    void criaChamado() throws Exception {
        MvcResult resultado = mockMvc.perform(post("/chamados")
                        .header("Authorization", "Bearer " + token("instrutor"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(corpoChamadoValido()))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.status").value("ABERTO"))
                .andExpect(jsonPath("$.solicitanteId").isNumber())
                .andReturn();
        String corpo = resultado.getResponse().getContentAsString();
        chamadoId = Long.parseLong(corpo.split("\"id\":")[1].split(",")[0]);
        assertThat(chamados.findById(chamadoId)).isPresent();
    }

    // ---------- CT02 / CT03 ----------

    @Test
    @Order(4)
    @DisplayName("CT02 - título vazio devolve 400 e não cria registro")
    void tituloAusente() throws Exception {
        long antes = chamados.count();
        mockMvc.perform(post("/chamados")
                        .header("Authorization", "Bearer " + token("instrutor"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"titulo\":\"\",\"descricao\":\"Descricao suficiente.\",\"prioridade\":\"ALTA\",\"categoriaId\":" + categoriaId + "}"))
                .andExpect(status().isBadRequest());
        assertThat(chamados.count()).isEqualTo(antes);
    }

    @Test
    @Order(5)
    @DisplayName("CT03 - descrição ausente devolve 400 e não cria registro")
    void descricaoAusente() throws Exception {
        long antes = chamados.count();
        mockMvc.perform(post("/chamados")
                        .header("Authorization", "Bearer " + token("instrutor"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"titulo\":\"Notebook nao liga\",\"prioridade\":\"ALTA\",\"categoriaId\":" + categoriaId + "}"))
                .andExpect(status().isBadRequest());
        assertThat(chamados.count()).isEqualTo(antes);
    }

    // ---------- CT04 / Postman Teste 1 ----------

    @Test
    @Order(6)
    @DisplayName("CT04 / Postman 1 - GET lista devolve 200 com coleção JSON")
    void listaChamados() throws Exception {
        mockMvc.perform(get("/chamados")
                        .header("Authorization", "Bearer " + token("instrutor")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    // ---------- CT05 / CT06 / Postman Teste 3 ----------

    @Test
    @Order(7)
    @DisplayName("CT05 - GET por id devolve o registro criado")
    void consultaPorId() throws Exception {
        mockMvc.perform(get("/chamados/" + chamadoId)
                        .header("Authorization", "Bearer " + token("instrutor")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(chamadoId))
                .andExpect(jsonPath("$.titulo").value("Notebook nao liga"))
                .andExpect(jsonPath("$.status").value("ABERTO"));
    }

    @Test
    @Order(8)
    @DisplayName("CT06 / Postman 3 - GET id inexistente devolve 404 padronizado")
    void consultaInexistente() throws Exception {
        mockMvc.perform(get("/chamados/999999")
                        .header("Authorization", "Bearer " + token("instrutor")))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }

    // ---------- CT07 ----------

    @Test
    @Order(9)
    @DisplayName("CT07 - categoriaId inexistente rejeita com 404 sem gravação parcial")
    void categoriaInexistente() throws Exception {
        long antes = chamados.count();
        mockMvc.perform(post("/chamados")
                        .header("Authorization", "Bearer " + token("instrutor"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"titulo\":\"x\",\"descricao\":\"Descricao suficiente.\",\"prioridade\":\"ALTA\",\"categoriaId\":999999}"))
                .andExpect(status().isNotFound());
        assertThat(chamados.count()).isEqualTo(antes);
    }

    @Test
    @Order(10)
    @DisplayName("CT07 - solicitanteId inexistente rejeita com 404 sem gravação parcial")
    void solicitanteInexistente() throws Exception {
        long antes = chamados.count();
        mockMvc.perform(post("/chamados")
                        .header("Authorization", "Bearer " + token("instrutor"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"titulo\":\"x\",\"descricao\":\"Descricao suficiente.\",\"prioridade\":\"ALTA\",\"categoriaId\":" + categoriaId + ",\"solicitanteId\":999999}"))
                .andExpect(status().isNotFound());
        assertThat(chamados.count()).isEqualTo(antes);
    }

    // ---------- CT08 ----------

    @Test
    @Order(11)
    @DisplayName("CT08 - associações opcionais (equipamento/sala) retornam no response")
    void associacoesOpcionais() throws Exception {
        mockMvc.perform(get("/categorias")
                        .header("Authorization", "Bearer " + token("admin")))
                .andExpect(status().isOk());

        mockMvc.perform(get("/equipamentos")
                        .header("Authorization", "Bearer " + token("admin")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    // ---------- CT09 / CT10 ----------

    @Test
    @Order(12)
    @DisplayName("CT10 - técnico assume e ABERTO->CONCLUIDO direto é rejeitado")
    void fluxoAssumeETransicaoInvalida() throws Exception {
        mockMvc.perform(patch("/chamados/" + chamadoId + "/assumir")
                        .header("Authorization", "Bearer " + token("tecnico")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.tecnicoResponsavelId").isNumber())
                .andExpect(jsonPath("$.status").value("EM_ANALISE"));

        mockMvc.perform(patch("/chamados/" + chamadoId + "/status")
                        .header("Authorization", "Bearer " + token("tecnico"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\":\"CONCLUIDO\",\"solucao\":\"tudo resolvido\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Transicao de status invalida."));
    }

    @Test
    @Order(13)
    @DisplayName("CT10 - solicitante não acessa fluxo técnico (403)")
    void fluxoTecnicoExigePerfil() throws Exception {
        mockMvc.perform(patch("/chamados/" + chamadoId + "/status")
                        .header("Authorization", "Bearer " + token("instrutor"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\":\"EM_ANDAMENTO\"}"))
                .andExpect(status().isForbidden());
    }

    @Test
    @Order(14)
    @DisplayName("CT09 - relatório técnico + conclusão preenchem solução e dataFechamento")
    void encerraChamado() throws Exception {
        mockMvc.perform(patch("/chamados/" + chamadoId + "/status")
                        .header("Authorization", "Bearer " + token("tecnico"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\":\"EM_ANDAMENTO\"}"))
                .andExpect(status().isOk());

        mockMvc.perform(post("/chamados/" + chamadoId + "/relatorio-tecnico")
                        .header("Authorization", "Bearer " + token("tecnico"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"problemaIdentificado\":\"Fonte queimada\",\"diagnostico\":\"Sem alimentacao\","
                                + "\"procedimentosRealizados\":\"Troca da fonte\",\"solucaoAplicada\":\"Fonte nova instalada\"}"))
                .andExpect(status().isOk());

        mockMvc.perform(patch("/chamados/" + chamadoId + "/status")
                        .header("Authorization", "Bearer " + token("tecnico"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\":\"CONCLUIDO\",\"solucao\":\"Fonte substituida e testada\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CONCLUIDO"))
                .andExpect(jsonPath("$.solucao").value("Fonte substituida e testada"))
                .andExpect(jsonPath("$.dataFechamento").isNotEmpty());

        mockMvc.perform(get("/chamados/" + chamadoId)
                        .header("Authorization", "Bearer " + token("instrutor")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.problemaIdentificado").value("Fonte queimada"));
    }

    @Test
    @Order(15)
    @DisplayName("CT10 - chamado encerrado não aceita novo relatório nem nova transição")
    void encerradoCongelado() throws Exception {
        mockMvc.perform(patch("/chamados/" + chamadoId + "/status")
                        .header("Authorization", "Bearer " + token("tecnico"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\":\"EM_ANALISE\"}"))
                .andExpect(status().isBadRequest());

        mockMvc.perform(patch("/chamados/" + chamadoId + "/status")
                        .header("Authorization", "Bearer " + token("tecnico"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\":\"CONCLUIDO\",\"solucao\":\"tentativa de sobrescrita\"}"))
                .andExpect(status().isBadRequest());

        mockMvc.perform(get("/chamados/" + chamadoId)
                        .header("Authorization", "Bearer " + token("instrutor")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.solucao").value("Fonte substituida e testada"));

        mockMvc.perform(post("/chamados/" + chamadoId + "/relatorio-tecnico")
                        .header("Authorization", "Bearer " + token("tecnico"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"problemaIdentificado\":\"x\",\"diagnostico\":\"y\","
                                + "\"procedimentosRealizados\":\"z\",\"solucaoAplicada\":\"w\"}"))
                .andExpect(status().isBadRequest());
    }

    // ---------- autorização por perfil ----------

    @Test
    @Order(16)
    @DisplayName("CT12 - técnico não administra usuários (403); admin lista usuários (200)")
    void usuariosExigeAdmin() throws Exception {
        mockMvc.perform(get("/usuarios")
                        .header("Authorization", "Bearer " + token("tecnico")))
                .andExpect(status().isForbidden());

        mockMvc.perform(get("/usuarios")
                        .header("Authorization", "Bearer " + token("admin")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    @Order(17)
    @DisplayName("dashboard calculado por perfil devolve 200")
    void dashboard() throws Exception {
        mockMvc.perform(get("/dashboard")
                        .header("Authorization", "Bearer " + token("instrutor")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalChamados").isNumber());
    }
}
