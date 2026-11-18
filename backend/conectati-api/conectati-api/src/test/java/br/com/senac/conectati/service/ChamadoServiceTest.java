package br.com.senac.conectati.service;

import br.com.senac.conectati.dto.request.ChamadoRequest;
import br.com.senac.conectati.dto.request.RelatorioTecnicoRequest;
import br.com.senac.conectati.dto.request.StatusChamadoRequest;
import br.com.senac.conectati.dto.response.ChamadoResponse;
import br.com.senac.conectati.enums.Prioridade;
import br.com.senac.conectati.enums.StatusChamado;
import br.com.senac.conectati.enums.TipoUsuario;
import br.com.senac.conectati.exception.BusinessException;
import br.com.senac.conectati.exception.ResourceNotFoundException;
import br.com.senac.conectati.mapper.ChamadoMapper;
import br.com.senac.conectati.model.Categoria;
import br.com.senac.conectati.model.Chamado;
import br.com.senac.conectati.model.Equipamento;
import br.com.senac.conectati.model.Sala;
import br.com.senac.conectati.model.Usuario;
import br.com.senac.conectati.repository.CategoriaRepository;
import br.com.senac.conectati.repository.ChamadoRepository;
import br.com.senac.conectati.repository.EquipamentoRepository;
import br.com.senac.conectati.repository.SalaRepository;
import br.com.senac.conectati.repository.UsuarioRepository;
import br.com.senac.conectati.security.UsuarioAutenticadoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * CT01 a CT10 no nível de serviço — regras de negócio, permissões,
 * transições de status e validação de referências (Mockito puro).
 */
@ExtendWith(MockitoExtension.class)
class ChamadoServiceTest {

    @Mock
    private ChamadoRepository repository;
    @Mock
    private UsuarioRepository usuarioRepository;
    @Mock
    private CategoriaRepository categoriaRepository;
    @Mock
    private EquipamentoRepository equipamentoRepository;
    @Mock
    private SalaRepository salaRepository;
    @Mock
    private UsuarioAutenticadoService autenticadoService;

    @InjectMocks
    private ChamadoService service;

    private Usuario instrutor;
    private Usuario tecnico;
    private Usuario admin;
    private Categoria categoria;
    private ChamadoRequest requestValido;

    @BeforeEach
    void preparar() {
        instrutor = usuario(1L, TipoUsuario.INSTRUTOR);
        tecnico = usuario(2L, TipoUsuario.TECNICO);
        admin = usuario(3L, TipoUsuario.ADMINISTRADOR);
        categoria = new Categoria();
        categoria.setId(10L);
        categoria.setNome("Informatica");
        requestValido = chamadoRequest();
    }

    private Usuario usuario(Long id, TipoUsuario tipo) {
        Usuario usuario = new Usuario();
        usuario.setId(id);
        usuario.setNome("Usuario " + id);
        usuario.setEmail("u" + id + "@conectati.local");
        usuario.setTipo(tipo);
        usuario.setAtivo(true);
        return usuario;
    }

    private ChamadoRequest chamadoRequest() {
        ChamadoRequest request = new ChamadoRequest();
        request.setTitulo("Notebook nao liga");
        request.setDescricao("Notebook do carrinho 1 nao liga e a aula precisa do equipamento.");
        request.setPrioridade(Prioridade.ALTA);
        request.setCategoriaId(10L);
        return request;
    }

    private Chamado chamadoSalvo() {
        Chamado chamado = ChamadoMapper.toEntity(requestValido);
        chamado.setId(100L);
        chamado.setStatus(StatusChamado.ABERTO);
        chamado.setSolicitante(instrutor);
        chamado.setCategoria(categoria);
        return chamado;
    }

    // ---------- CT01 ----------

    @Nested
    @DisplayName("CT01 - Criar chamado válido")
    class CriarChamado {

        @Test
        @DisplayName("instrutor autenticado cria chamado com status ABERTO e ele mesmo como solicitante")
        void criaChamadoValido() {
            when(autenticadoService.atual()).thenReturn(instrutor);
            when(categoriaRepository.findById(10L)).thenReturn(Optional.of(categoria));
            when(repository.save(any(Chamado.class))).thenAnswer(inv -> {
                Chamado salvo = inv.getArgument(0);
                salvo.setId(100L);
                return salvo;
            });

            ChamadoResponse resposta = service.salvar(requestValido);

            ArgumentCaptor<Chamado> captor = ArgumentCaptor.forClass(Chamado.class);
            verify(repository).save(captor.capture());
            Chamado salvo = captor.getValue();
            assertThat(salvo.getStatus()).isEqualTo(StatusChamado.ABERTO);
            assertThat(salvo.getSolicitante().getId()).isEqualTo(1L);
            assertThat(salvo.getTecnicoResponsavel()).isNull();
            assertThat(resposta.getId()).isEqualTo(100L);
            assertThat(resposta.getStatus()).isEqualTo(StatusChamado.ABERTO);
        }

        @Test
        @DisplayName("tecnico nao pode criar chamado como solicitante (403)")
        void tecnicoNaoCria() {
            when(autenticadoService.atual()).thenReturn(tecnico);

            assertThatThrownBy(() -> service.salvar(requestValido))
                    .isInstanceOf(AccessDeniedException.class);

            verify(repository, never()).save(any());
        }

        @Test
        @DisplayName("CT08 - equipamento e sala opcionais sao associados quando informados")
        void associaOpcionais() {
            Sala sala = new Sala();
            sala.setId(20L);
            Equipamento equipamento = new Equipamento();
            equipamento.setId(30L);
            when(autenticadoService.atual()).thenReturn(instrutor);
            when(categoriaRepository.findById(10L)).thenReturn(Optional.of(categoria));
            when(salaRepository.findById(20L)).thenReturn(Optional.of(sala));
            when(equipamentoRepository.findById(30L)).thenReturn(Optional.of(equipamento));
            when(repository.save(any(Chamado.class))).thenAnswer(inv -> inv.getArgument(0));

            requestValido.setSalaId(20L);
            requestValido.setEquipamentoId(30L);
            service.salvar(requestValido);

            ArgumentCaptor<Chamado> captor = ArgumentCaptor.forClass(Chamado.class);
            verify(repository).save(captor.capture());
            assertThat(captor.getValue().getSala().getId()).isEqualTo(20L);
            assertThat(captor.getValue().getEquipamento().getId()).isEqualTo(30L);
        }
    }

    // ---------- CT07 ----------

    @Nested
    @DisplayName("CT07 - Referências inválidas rejeitadas sem gravação parcial")
    class ReferenciasInvalidas {

        @Test
        @DisplayName("categoriaId inexistente rejeita com 404 e nao grava")
        void categoriaInexistente() {
            when(autenticadoService.atual()).thenReturn(instrutor);
            when(categoriaRepository.findById(999L)).thenReturn(Optional.empty());

            requestValido.setCategoriaId(999L);
            assertThatThrownBy(() -> service.salvar(requestValido))
                    .isInstanceOf(ResourceNotFoundException.class);

            verify(repository, never()).save(any());
        }

        @Test
        @DisplayName("solicitanteId inexistente informado rejeita com 404")
        void solicitanteInexistente() {
            when(autenticadoService.atual()).thenReturn(instrutor);
            when(usuarioRepository.findById(999L)).thenReturn(Optional.empty());

            requestValido.setSolicitanteId(999L);
            assertThatThrownBy(() -> service.salvar(requestValido))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("Solicitante");

            verify(repository, never()).save(any());
        }

        @Test
        @DisplayName("tecnicoResponsavelId inexistente informado rejeita com 404")
        void tecnicoInexistente() {
            when(autenticadoService.atual()).thenReturn(instrutor);
            when(usuarioRepository.findById(999L)).thenReturn(Optional.empty());

            requestValido.setTecnicoResponsavelId(999L);
            assertThatThrownBy(() -> service.salvar(requestValido))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("Tecnico");

            verify(repository, never()).save(any());
        }
    }

    // ---------- CT04 / CT05 / CT06 ----------

    @Nested
    @DisplayName("CT04/CT05/CT06 - Listar e consultar com controle de acesso")
    class ListarEConsultar {

        @Test
        @DisplayName("CT04 - tecnico recebe apenas chamados sem responsavel ou dele")
        void tecnicoListaSubconjunto() {
            Chamado semResponsavel = chamadoSalvo();
            Chamado doTecnico = chamadoSalvo();
            doTecnico.setTecnicoResponsavel(tecnico);

            when(autenticadoService.atual()).thenReturn(tecnico);
            when(repository.listarFilaDoTecnico(2L))
                    .thenReturn(List.of(semResponsavel, doTecnico));

            List<ChamadoResponse> resposta = service.listar();

            assertThat(resposta).hasSize(2);
            verify(repository, never()).findAll();
        }

        @Test
        @DisplayName("CT04 - solicitante lista apenas os proprios chamados")
        void solicitanteListaProprios() {
            when(autenticadoService.atual()).thenReturn(instrutor);
            when(repository.listarPorSolicitante(1L)).thenReturn(List.of(chamadoSalvo()));

            assertThat(service.listar()).hasSize(1);
            verify(repository).listarPorSolicitante(1L);
        }

        @Test
        @DisplayName("CT05 - consulta por id devolve o registro correto")
        void consultaPorId() {
            Chamado chamado = chamadoSalvo();
            when(autenticadoService.atual()).thenReturn(instrutor);
            when(repository.findById(100L)).thenReturn(Optional.of(chamado));

            ChamadoResponse resposta = service.buscarPorId(100L);

            assertThat(resposta.getId()).isEqualTo(100L);
            assertThat(resposta.getTitulo()).isEqualTo("Notebook nao liga");
        }

        @Test
        @DisplayName("CT06 - id inexistente devolve 404 padronizado")
        void consultaInexistente() {
            when(repository.findById(999999L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> service.buscarPorId(999999L))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("Chamado");
        }

        @Test
        @DisplayName("CT05 - solicitante nao consulta chamado de outro usuario (403)")
        void consultaDeOutroBloqueada() {
            Chamado alheio = chamadoSalvo();
            alheio.setSolicitante(usuario(9L, TipoUsuario.COORDENADOR));
            when(autenticadoService.atual()).thenReturn(instrutor);
            when(repository.findById(100L)).thenReturn(Optional.of(alheio));

            assertThatThrownBy(() -> service.buscarPorId(100L))
                    .isInstanceOf(AccessDeniedException.class);
        }
    }

    // ---------- CT09 / CT10 ----------

    @Nested
    @DisplayName("CT09/CT10 - Encerramento e transições de status")
    class TransicoesDeStatus {

        private Chamado chamadoEmAnalise() {
            Chamado chamado = chamadoSalvo();
            chamado.setTecnicoResponsavel(tecnico);
            chamado.setStatus(StatusChamado.EM_ANALISE);
            return chamado;
        }

        private StatusChamadoRequest statusRequest(StatusChamado status) {
            StatusChamadoRequest request = new StatusChamadoRequest();
            request.setStatus(status);
            return request;
        }

        @Test
        @DisplayName("repetir status de chamado aberto é aceito sem alterar data de fechamento")
        void mesmoStatusAbertoPermaneceIdempotente() {
            Chamado chamado = chamadoSalvo();
            chamado.setTecnicoResponsavel(tecnico);
            LocalDateTime fechamento = LocalDateTime.now().minusDays(1);
            chamado.setDataFechamento(fechamento);
            when(autenticadoService.atual()).thenReturn(tecnico);
            when(repository.findById(100L)).thenReturn(Optional.of(chamado));

            ChamadoResponse resposta = service.atualizarStatus(100L, statusRequest(StatusChamado.ABERTO));

            assertThat(resposta.getStatus()).isEqualTo(StatusChamado.ABERTO);
            assertThat(chamado.getDataFechamento()).isEqualTo(fechamento);
            verify(repository, never()).save(any());
        }

        @Test
        @DisplayName("CT09 - conclusão com solução preenche dataFechamento")
        void conclusaoValida() {
            Chamado chamado = chamadoEmAnalise();
            chamado.setStatus(StatusChamado.EM_ANDAMENTO);
            chamado.setProblemaIdentificado("Fonte queimada");
            chamado.setDiagnostico("Alimentacao sem resposta");
            chamado.setProcedimentosRealizados("Troca da fonte");
            chamado.setDataAtendimento(LocalDateTime.now().minusHours(1));
            when(autenticadoService.atual()).thenReturn(tecnico);
            when(repository.findById(100L)).thenReturn(Optional.of(chamado));
            when(repository.save(any(Chamado.class))).thenAnswer(inv -> inv.getArgument(0));

            StatusChamadoRequest pedido = statusRequest(StatusChamado.CONCLUIDO);
            pedido.setSolucao("Fonte substituida");
            ChamadoResponse resposta = service.atualizarStatus(100L, pedido);

            assertThat(resposta.getStatus()).isEqualTo(StatusChamado.CONCLUIDO);
            assertThat(resposta.getSolucao()).isEqualTo("Fonte substituida");
            assertThat(resposta.getDataFechamento()).isNotNull();
        }

        @Test
        @DisplayName("CT09 - conclusão sem solução rejeitada")
        void conclusaoSemSolucao() {
            Chamado chamado = chamadoEmAnalise();
            chamado.setStatus(StatusChamado.EM_ANDAMENTO);
            chamado.setProblemaIdentificado("Fonte queimada");
            chamado.setDiagnostico("Alimentacao sem resposta");
            chamado.setProcedimentosRealizados("Troca da fonte");
            chamado.setDataAtendimento(LocalDateTime.now().minusHours(1));
            when(autenticadoService.atual()).thenReturn(tecnico);
            when(repository.findById(100L)).thenReturn(Optional.of(chamado));

            assertThatThrownBy(() -> service.atualizarStatus(100L, statusRequest(StatusChamado.CONCLUIDO)))
                    .isInstanceOf(BusinessException.class)
                    .hasMessageContaining("solucao");
        }

        @Test
        @DisplayName("CT09 - conclusão exige relatório técnico completo")
        void conclusaoSemRelatorio() {
            Chamado chamado = chamadoEmAnalise();
            chamado.setStatus(StatusChamado.EM_ANDAMENTO);
            when(autenticadoService.atual()).thenReturn(tecnico);
            when(repository.findById(100L)).thenReturn(Optional.of(chamado));

            StatusChamadoRequest pedido = statusRequest(StatusChamado.CONCLUIDO);
            pedido.setSolucao("Fonte substituida");
            assertThatThrownBy(() -> service.atualizarStatus(100L, pedido))
                    .isInstanceOf(BusinessException.class)
                    .hasMessageContaining("relatorio");
        }

        @Test
        @DisplayName("CT10 - ABERTO para CONCLUIDO direto é rejeitado")
        void transicaoInvalidaDireta() {
            Chamado chamado = chamadoSalvo();
            chamado.setTecnicoResponsavel(tecnico);
            when(autenticadoService.atual()).thenReturn(tecnico);
            when(repository.findById(100L)).thenReturn(Optional.of(chamado));

            StatusChamadoRequest pedido = statusRequest(StatusChamado.CONCLUIDO);
            pedido.setSolucao("qualquer");
            assertThatThrownBy(() -> service.atualizarStatus(100L, pedido))
                    .isInstanceOf(BusinessException.class)
                    .hasMessageContaining("Transicao");

            verify(repository, never()).save(any());
        }

        @Test
        @DisplayName("CT10 - chamado encerrado não muda de status e não fica inconsistente")
        void encerradoNaoMuda() {
            Chamado chamado = chamadoEmAnalise();
            chamado.setStatus(StatusChamado.CONCLUIDO);
            chamado.setDataFechamento(LocalDateTime.now().minusDays(1));
            when(autenticadoService.atual()).thenReturn(tecnico);
            when(repository.findById(100L)).thenReturn(Optional.of(chamado));

            assertThatThrownBy(() -> service.atualizarStatus(100L, statusRequest(StatusChamado.ABERTO)))
                    .isInstanceOf(BusinessException.class)
                    .hasMessageContaining("encerrado");

            assertThat(chamado.getStatus()).isEqualTo(StatusChamado.CONCLUIDO);
            assertThat(chamado.getDataFechamento()).isNotNull();
        }

        @Test
        @DisplayName("CT10 - CONCLUIDO para CONCLUIDO rejeitado sem alterar fechamento ou solução")
        void concluidoMesmoStatusRejeitado() {
            Chamado chamado = chamadoEmAnalise();
            LocalDateTime fechamento = LocalDateTime.now().minusDays(2);
            chamado.setStatus(StatusChamado.CONCLUIDO);
            chamado.setDataFechamento(fechamento);
            chamado.setSolucao("solução registrada");
            when(autenticadoService.atual()).thenReturn(tecnico);
            when(repository.findById(100L)).thenReturn(Optional.of(chamado));

            StatusChamadoRequest pedido = statusRequest(StatusChamado.CONCLUIDO);
            pedido.setSolucao("tentativa de sobrescrita");
            assertThatThrownBy(() -> service.atualizarStatus(100L, pedido))
                    .isInstanceOf(BusinessException.class).hasMessageContaining("encerrado");
            assertThat(chamado.getDataFechamento()).isEqualTo(fechamento);
            assertThat(chamado.getSolucao()).isEqualTo("solução registrada");
            verify(repository, never()).save(any());
        }

        @Test
        @DisplayName("CT10 - CANCELADO para CANCELADO rejeitado sem alterar fechamento ou solução")
        void canceladoMesmoStatusRejeitado() {
            Chamado chamado = chamadoEmAnalise();
            LocalDateTime fechamento = LocalDateTime.now().minusDays(2);
            chamado.setStatus(StatusChamado.CANCELADO);
            chamado.setDataFechamento(fechamento);
            chamado.setSolucao("solução anterior");
            when(autenticadoService.atual()).thenReturn(tecnico);
            when(repository.findById(100L)).thenReturn(Optional.of(chamado));

            StatusChamadoRequest pedido = statusRequest(StatusChamado.CANCELADO);
            pedido.setJustificativaCancelamento("tentativa de sobrescrita");
            assertThatThrownBy(() -> service.atualizarStatus(100L, pedido))
                    .isInstanceOf(BusinessException.class).hasMessageContaining("encerrado");
            assertThat(chamado.getDataFechamento()).isEqualTo(fechamento);
            assertThat(chamado.getSolucao()).isEqualTo("solução anterior");
            verify(repository, never()).save(any());
        }

        @Test
        @DisplayName("CT10 - cancelamento exige justificativa")
        void cancelamentoExigeJustificativa() {
            Chamado chamado = chamadoEmAnalise();
            when(autenticadoService.atual()).thenReturn(tecnico);
            when(repository.findById(100L)).thenReturn(Optional.of(chamado));

            assertThatThrownBy(() -> service.atualizarStatus(100L, statusRequest(StatusChamado.CANCELADO)))
                    .isInstanceOf(BusinessException.class)
                    .hasMessageContaining("justificativa");
        }

        @Test
        @DisplayName("somente o tecnico responsavel altera o status (outro tecnico -> 403)")
        void outroTecnicoBloqueado() {
            Chamado chamado = chamadoEmAnalise();
            when(autenticadoService.atual()).thenReturn(usuario(9L, TipoUsuario.TECNICO));
            when(repository.findById(100L)).thenReturn(Optional.of(chamado));

            assertThatThrownBy(() -> service.atualizarStatus(100L, statusRequest(StatusChamado.EM_ANDAMENTO)))
                    .isInstanceOf(AccessDeniedException.class);
        }

        @Test
        @DisplayName("assumir define responsavel e move ABERTO para EM_ANALISE")
        void assumirChamado() {
            Chamado chamado = chamadoSalvo();
            when(autenticadoService.atual()).thenReturn(tecnico);
            when(repository.findById(100L)).thenReturn(Optional.of(chamado));
            when(repository.save(any(Chamado.class))).thenAnswer(inv -> inv.getArgument(0));

            ChamadoResponse resposta = service.assumir(100L);

            assertThat(resposta.getTecnicoResponsavelId()).isEqualTo(2L);
            assertThat(resposta.getStatus()).isEqualTo(StatusChamado.EM_ANALISE);
        }

        @Test
        @DisplayName("assumir chamado encerrado é rejeitado")
        void assumirEncerrado() {
            Chamado chamado = chamadoSalvo();
            chamado.setStatus(StatusChamado.CANCELADO);
            when(autenticadoService.atual()).thenReturn(tecnico);
            when(repository.findById(100L)).thenReturn(Optional.of(chamado));

            assertThatThrownBy(() -> service.assumir(100L))
                    .isInstanceOf(BusinessException.class)
                    .hasMessageContaining("encerrado");
        }

        @Test
        @DisplayName("relatório técnico exige técnico responsável e bloqueia chamado encerrado")
        void relatorioTecnicoRegras() {
            Chamado chamado = chamadoEmAnalise();
            when(autenticadoService.atual()).thenReturn(tecnico);
            when(repository.findById(100L)).thenReturn(Optional.of(chamado));
            when(repository.save(any(Chamado.class))).thenAnswer(inv -> inv.getArgument(0));

            RelatorioTecnicoRequest relatorio = new RelatorioTecnicoRequest();
            relatorio.setProblemaIdentificado("Fonte queimada");
            relatorio.setDiagnostico("Sem alimentacao");
            relatorio.setProcedimentosRealizados("Troca da fonte");
            relatorio.setSolucaoAplicada("Fonte nova instalada");

            service.registrarRelatorioTecnico(100L, relatorio);
            assertThat(chamado.getProblemaIdentificado()).isEqualTo("Fonte queimada");
            assertThat(chamado.getDataAtendimento()).isNotNull();

            chamado.setStatus(StatusChamado.CONCLUIDO);
            assertThatThrownBy(() -> service.registrarRelatorioTecnico(100L, relatorio))
                    .isInstanceOf(BusinessException.class)
                    .hasMessageContaining("encerrado");
        }
    }

    // ---------- edição e exclusão ----------

    @Nested
    @DisplayName("Edição de abertura e exclusão")
    class EdicaoExclusao {

        @Test
        @DisplayName("dados de abertura só mudam com chamado ABERTO")
        void edicaoSoComAberto() {
            Chamado chamado = chamadoSalvo();
            chamado.setStatus(StatusChamado.EM_ANALISE);
            when(autenticadoService.atual()).thenReturn(instrutor);
            when(repository.findById(100L)).thenReturn(Optional.of(chamado));

            assertThatThrownBy(() -> service.atualizar(100L, requestValido))
                    .isInstanceOf(BusinessException.class)
                    .hasMessageContaining("atendimento");
        }

        @Test
        @DisplayName("solicitante pode editar o proprio chamado aberto")
        void solicitanteEdita() {
            Chamado chamado = chamadoSalvo();
            when(autenticadoService.atual()).thenReturn(instrutor);
            when(repository.findById(100L)).thenReturn(Optional.of(chamado));
            when(categoriaRepository.findById(10L)).thenReturn(Optional.of(categoria));
            when(repository.save(any(Chamado.class))).thenAnswer(inv -> inv.getArgument(0));

            requestValido.setTitulo("Titulo corrigido");
            ChamadoResponse resposta = service.atualizar(100L, requestValido);

            assertThat(resposta.getTitulo()).isEqualTo("Titulo corrigido");
        }

        @Test
        @DisplayName("exclusão exige administrador (exigirCargo é consultado e negado)")
        void exclusaoSoAdmin() {
            doThrow(new AccessDeniedException("Acesso negado para este cargo."))
                    .when(autenticadoService).exigirCargo(TipoUsuario.ADMINISTRADOR);

            assertThatThrownBy(() -> service.deletar(100L))
                    .isInstanceOf(AccessDeniedException.class);
            verify(repository, never()).delete(any(Chamado.class));
        }
    }
}
