package br.com.senac.conectati.repository;

import br.com.senac.conectati.enums.Prioridade;
import br.com.senac.conectati.enums.StatusChamado;
import br.com.senac.conectati.enums.TipoUsuario;
import br.com.senac.conectati.model.Categoria;
import br.com.senac.conectati.model.Chamado;
import br.com.senac.conectati.model.Usuario;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.dao.DataIntegrityViolationException;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * CT01/CT07/CT08 no nível de persistência (H2 em modo PostgreSQL):
 * consultas derivadas com @EntityGraph, chaves estrangeiras,
 * unicidade de e-mail e integridade referencial.
 */
@DataJpaTest
class ChamadoRepositoryIntegrationTest {

    @Autowired
    private ChamadoRepository chamados;

    @Autowired
    private UsuarioRepository usuarios;

    @Autowired
    private CategoriaRepository categorias;

    private Usuario instrutor;
    private Usuario tecnico;
    private Categoria categoria;
    private Long chamadoId;

    @BeforeEach
    void preparar() {
        instrutor = salvarUsuario(1L, TipoUsuario.INSTRUTOR);
        tecnico = salvarUsuario(2L, TipoUsuario.TECNICO);
        categoria = new Categoria();
        categoria.setNome("Informatica");
        categorias.save(categoria);
        chamadoId = salvarChamado("Notebook nao liga", instrutor).getId();
    }

    private Usuario salvarUsuario(long id, TipoUsuario tipo) {
        Usuario usuario = new Usuario();
        usuario.setNome("Usuario " + id);
        usuario.setEmail("u" + id + "@conectati.local");
        usuario.setSenha(passwordFixa());
        usuario.setTipo(tipo);
        usuario.setAtivo(true);
        return usuarios.save(usuario);
    }

    private String passwordFixa() {
        // hash fixo para não depender de PasswordEncoder no slice de dados
        return "$2a$10$abcdefghijklmnopqrstuv012345678901234567890123456789012";
    }

    private Chamado salvarChamado(String titulo, Usuario solicitante) {
        Chamado chamado = new Chamado();
        chamado.setTitulo(titulo);
        chamado.setDescricao("Descricao do problema relatado pelo solicitante.");
        chamado.setPrioridade(Prioridade.ALTA);
        chamado.setStatus(StatusChamado.ABERTO);
        chamado.setSolicitante(solicitante);
        chamado.setCategoria(categoria);
        return chamados.save(chamado);
    }

    @Test
    @DisplayName("CT01 - chamado persiste com id gerado, datas automáticas e FKs")
    void persisteChamado() {
        Chamado salvo = chamados.findById(chamadoId).orElseThrow();

        assertThat(salvo.getId()).isNotNull();
        assertThat(salvo.getDataCriacao()).isNotNull();
        assertThat(salvo.getSolicitante().getId()).isEqualTo(instrutor.getId());
        assertThat(salvo.getCategoria().getId()).isEqualTo(categoria.getId());
    }

    @Test
    @DisplayName("CT08 - consulta por solicitante carrega relacionamentos em uma query")
    void consultaComRelacionamentos() {
        List<Chamado> lista = chamados.listarPorSolicitante(instrutor.getId());

        assertThat(lista).hasSize(1);
        assertThat(lista.get(0).getSolicitante().getNome()).isEqualTo(instrutor.getNome());
    }

    @Test
    @DisplayName("CT04 - técnico recebe chamados sem responsável ou do próprio técnico")
    void filaDoTecnico() {
        List<Chamado> fila = chamados.listarFilaDoTecnico(tecnico.getId());

        assertThat(fila).hasSize(1);
        assertThat(fila.get(0).getTecnicoResponsavel()).isNull();
    }

    @Test
    @DisplayName("CT07 - chamado sem categoria é rejeitado por FK obrigatória")
    void exigeCategoria() {
        Chamado semCategoria = new Chamado();
        semCategoria.setTitulo("Sem categoria");
        semCategoria.setDescricao("Descricao do problema relatado pelo solicitante.");
        semCategoria.setPrioridade(Prioridade.MEDIA);
        semCategoria.setStatus(StatusChamado.ABERTO);
        semCategoria.setSolicitante(instrutor);

        assertThatThrownBy(() -> chamados.saveAndFlush(semCategoria))
                .isInstanceOf(DataIntegrityViolationException.class);
    }

    @Test
    @DisplayName("CT07 - chamado sem solicitante é rejeitado por FK obrigatória")
    void exigeSolicitante() {
        Chamado semSolicitante = new Chamado();
        semSolicitante.setTitulo("Sem solicitante");
        semSolicitante.setDescricao("Descricao do problema relatado pelo solicitante.");
        semSolicitante.setPrioridade(Prioridade.MEDIA);
        semSolicitante.setStatus(StatusChamado.ABERTO);
        semSolicitante.setCategoria(categoria);

        assertThatThrownBy(() -> chamados.saveAndFlush(semSolicitante))
                .isInstanceOf(DataIntegrityViolationException.class);
    }

    @Test
    @DisplayName("CT02 - título obrigatório no banco (nullable = false)")
    void exigeTitulo() {
        Chamado semTitulo = new Chamado();
        semTitulo.setDescricao("Descricao do problema relatado pelo solicitante.");
        semTitulo.setPrioridade(Prioridade.MEDIA);
        semTitulo.setStatus(StatusChamado.ABERTO);
        semTitulo.setSolicitante(instrutor);
        semTitulo.setCategoria(categoria);

        assertThatThrownBy(() -> chamados.saveAndFlush(semTitulo))
                .isInstanceOf(DataIntegrityViolationException.class);
    }

    @Test
    @DisplayName("unicidade de e-mail de usuário é aplicada pelo banco")
    void emailUnico() {
        Usuario duplicado = new Usuario();
        duplicado.setNome("Duplicado");
        duplicado.setEmail(instrutor.getEmail());
        duplicado.setSenha(passwordFixa());
        duplicado.setTipo(TipoUsuario.INSTRUTOR);
        duplicado.setAtivo(true);

        assertThatThrownBy(() -> usuarios.saveAndFlush(duplicado))
                .isInstanceOf(DataIntegrityViolationException.class);
    }

    @Test
    @DisplayName("dashboard - contagens por status e solicitante conferem")
    void contagens() {
        assertThat(chamados.countByStatus(StatusChamado.ABERTO)).isEqualTo(1);
        assertThat(chamados.countBySolicitante(instrutor)).isEqualTo(1);
        assertThat(chamados.countBySolicitanteAndStatus(instrutor, StatusChamado.ABERTO)).isEqualTo(1);
    }
}
