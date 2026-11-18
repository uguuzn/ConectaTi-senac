package br.com.senac.conectati.controller;

import br.com.senac.conectati.enums.TipoUsuario;
import br.com.senac.conectati.model.Categoria;
import br.com.senac.conectati.model.Usuario;
import br.com.senac.conectati.repository.CategoriaRepository;
import br.com.senac.conectati.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Camada HTTP com contexto real (Spring Security + GlobalExceptionHandler):
 * CT02/CT03 (validação), CT06 (404) e CT12 (401/403).
 *
 * Em Spring Boot 4 / Security 7 o slice @WebMvcTest não expõe o bean
 * HttpSecurity necessário para a SecurityFilterChain customizada; a forma
 * suportada é o contexto completo com MockMvc.
 */
@SpringBootTest
@AutoConfigureMockMvc
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class ChamadoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UsuarioRepository usuarios;

    @Autowired
    private CategoriaRepository categorias;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final Map<String, String> tokens = new ConcurrentHashMap<>();

    @BeforeAll
    void seed() {
        salvarUsuario("Administrador de Teste", "admin-test@conectati.local", "Admin@123", TipoUsuario.ADMINISTRADOR);
        salvarUsuario("Instrutor de Teste", "instrutor-test@conectati.local", "Instrutor@123", TipoUsuario.INSTRUTOR);
        salvarUsuario("Tecnico de Teste", "tecnico-test@conectati.local", "Tecnico@123", TipoUsuario.TECNICO);
        if (categorias.findByNomeIgnoreCase("Informatica").isEmpty()) {
            Categoria categoria = new Categoria();
            categoria.setNome("Informatica");
            categorias.save(categoria);
        }
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
            tokens.put(chave, resultado.getResponse().getContentAsString()
                    .split("\"token\":\"")[1].split("\"")[0]);
        }
        return tokens.get(chave);
    }

    @Test
    @DisplayName("CT01/CT04 - POST válido devolve 201 e GET por id devolve 200")
    void postValidoEGet() throws Exception {
        MvcResult criado = mockMvc.perform(post("/chamados")
                        .header("Authorization", "Bearer " + token("instrutor"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"titulo\":\"Notebook nao liga\",\"descricao\":\"Descricao suficiente\",\"prioridade\":\"ALTA\",\"categoriaId\":"
                                + categorias.findByNomeIgnoreCase("Informatica").orElseThrow().getId() + "}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.status").value("ABERTO"))
                .andReturn();
        long id = Long.parseLong(criado.getResponse().getContentAsString().split("\"id\":")[1].split(",")[0]);

        mockMvc.perform(get("/chamados/" + id)
                        .header("Authorization", "Bearer " + token("instrutor")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.titulo").value("Notebook nao liga"));
    }

    @Test
    @DisplayName("CT02 - título ausente devolve 400 com mensagem de validação")
    void tituloAusente() throws Exception {
        mockMvc.perform(post("/chamados")
                        .header("Authorization", "Bearer " + token("instrutor"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"descricao\":\"Descricao suficiente\",\"prioridade\":\"ALTA\",\"categoriaId\":"
                                + categorias.findByNomeIgnoreCase("Informatica").orElseThrow().getId() + "}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("O titulo e obrigatorio."));
    }

    @Test
    @DisplayName("CT03 - descrição ausente devolve 400")
    void descricaoAusente() throws Exception {
        mockMvc.perform(post("/chamados")
                        .header("Authorization", "Bearer " + token("instrutor"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"titulo\":\"Notebook nao liga\",\"prioridade\":\"ALTA\",\"categoriaId\":"
                                + categorias.findByNomeIgnoreCase("Informatica").orElseThrow().getId() + "}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("A descricao e obrigatoria."));
    }

    @Test
    @DisplayName("CT12 - POST /chamados sem token devolve 401")
    void semTokenRejeitado() throws Exception {
        mockMvc.perform(post("/chamados")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"titulo\":\"x\",\"descricao\":\"y\",\"prioridade\":\"ALTA\",\"categoriaId\":1}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("CT12 - PATCH /chamados/{id}/status sem perfil técnico devolve 403")
    void statusExigeTecnico() throws Exception {
        mockMvc.perform(patch("/chamados/100/status")
                        .header("Authorization", "Bearer " + token("instrutor"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\":\"EM_ANALISE\"}"))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("CT06 - id inexistente devolve 404 padronizado")
    void recursoInexistente() throws Exception {
        mockMvc.perform(get("/chamados/999999")
                        .header("Authorization", "Bearer " + token("instrutor")))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value("Chamado nao encontrado."));
    }

    @Test
    @DisplayName("corpo JSON malformado devolve 400 (e não 500)")
    void corpoMalformado() throws Exception {
        mockMvc.perform(post("/chamados")
                        .header("Authorization", "Bearer " + token("instrutor"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{titulo sem aspas}"))
                .andExpect(status().isBadRequest());
    }
}
