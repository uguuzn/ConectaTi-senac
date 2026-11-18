package br.com.senac.conectati.service;

import br.com.senac.conectati.dto.request.ChamadoRequest;
import br.com.senac.conectati.dto.request.RelatorioTecnicoRequest;
import br.com.senac.conectati.dto.request.StatusChamadoRequest;
import br.com.senac.conectati.dto.response.ChamadoResponse;
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
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.EnumSet;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ChamadoService {

    private final ChamadoRepository repository;
    private final UsuarioRepository usuarioRepository;
    private final CategoriaRepository categoriaRepository;
    private final EquipamentoRepository equipamentoRepository;
    private final SalaRepository salaRepository;
    private final UsuarioAutenticadoService autenticadoService;

    @Transactional
    public ChamadoResponse salvar(ChamadoRequest request) {
        Usuario usuario = autenticadoService.atual();
        if (usuario.getTipo() == TipoUsuario.TECNICO) {
            throw new AccessDeniedException("Tecnico nao cria chamado como solicitante.");
        }

        Chamado chamado = ChamadoMapper.toEntity(request);
        chamado.setStatus(StatusChamado.ABERTO);
        chamado.setSolicitante(usuario);
        chamado.setTecnicoResponsavel(null);
        validarReferenciasInformadas(request);
        preencherRelacionamentosEditaveis(chamado, request);
        return ChamadoMapper.toResponse(repository.save(chamado));
    }

    public List<ChamadoResponse> listar() {
        Usuario usuario = autenticadoService.atual();
        // Consulta já filtrada no banco (com fetch join via @EntityGraph),
        // evitando carregar todos os chamados e acessar relações LAZY por linha.
        List<Chamado> chamados = switch (usuario.getTipo()) {
            case ADMINISTRADOR -> repository.findAllComRelacionamentos();
            case TECNICO -> repository.listarFilaDoTecnico(usuario.getId());
            case INSTRUTOR, COORDENADOR -> repository.listarPorSolicitante(usuario.getId());
        };
        return chamados.stream()
                .map(ChamadoMapper::toResponse)
                .toList();
    }

    public ChamadoResponse buscarPorId(Long id) {
        Chamado chamado = obter(id);
        exigirVisualizacao(autenticadoService.atual(), chamado);
        return ChamadoMapper.toResponse(chamado);
    }

    @Transactional
    public ChamadoResponse atualizar(Long id, ChamadoRequest request) {
        Usuario usuario = autenticadoService.atual();
        Chamado chamado = obter(id);
        exigirVisualizacao(usuario, chamado);

        if (usuario.getTipo() != TipoUsuario.ADMINISTRADOR && !chamado.getSolicitante().getId().equals(usuario.getId())) {
            throw new AccessDeniedException("Somente o solicitante ou administrador pode editar dados de abertura.");
        }
        if (chamado.getStatus() != StatusChamado.ABERTO) {
            throw new BusinessException("Chamado em atendimento nao pode ter dados de abertura alterados.");
        }
        if (request.getTecnicoResponsavelId() != null) {
            throw new BusinessException("Tecnico responsavel deve ser definido pelo fluxo de atendimento.");
        }

        ChamadoMapper.updateEntity(chamado, request);
        preencherRelacionamentosEditaveis(chamado, request);
        return ChamadoMapper.toResponse(repository.save(chamado));
    }

    @Transactional
    public void deletar(Long id) {
        autenticadoService.exigirCargo(TipoUsuario.ADMINISTRADOR);
        repository.delete(obter(id));
    }

    @Transactional
    public ChamadoResponse assumir(Long id) {
        Usuario tecnico = autenticadoService.atual();
        exigirTecnicoAtivo(tecnico);
        Chamado chamado = obter(id);
        if (chamado.getStatus() == StatusChamado.CONCLUIDO || chamado.getStatus() == StatusChamado.CANCELADO) {
            throw new BusinessException("Chamado encerrado nao pode ser assumido.");
        }
        if (chamado.getTecnicoResponsavel() != null && !chamado.getTecnicoResponsavel().getId().equals(tecnico.getId())) {
            throw new BusinessException("Chamado ja possui outro tecnico responsavel.");
        }
        chamado.setTecnicoResponsavel(tecnico);
        if (chamado.getStatus() == StatusChamado.ABERTO) {
            chamado.setStatus(StatusChamado.EM_ANALISE);
        }
        return ChamadoMapper.toResponse(repository.save(chamado));
    }

    @Transactional
    public ChamadoResponse atualizarStatus(Long id, StatusChamadoRequest request) {
        Usuario tecnico = autenticadoService.atual();
        exigirTecnicoAtivo(tecnico);
        Chamado chamado = obter(id);
        exigirTecnicoResponsavel(chamado, tecnico);

        StatusChamado novoStatus = request.getStatus();
        validarTransicao(chamado.getStatus(), novoStatus);
        if (chamado.getStatus() == novoStatus) {
            return ChamadoMapper.toResponse(chamado);
        }

        if (novoStatus == StatusChamado.CONCLUIDO) {
            if (temTexto(request.getSolucao())) {
                chamado.setSolucao(request.getSolucao().trim());
            }
            validarConclusao(chamado);
            chamado.setDataFechamento(LocalDateTime.now());
        } else if (novoStatus == StatusChamado.CANCELADO) {
            if (!temTexto(request.getJustificativaCancelamento())) {
                throw new BusinessException("Chamado cancelado deve possuir justificativa.");
            }
            chamado.setJustificativaCancelamento(request.getJustificativaCancelamento().trim());
            chamado.setDataFechamento(LocalDateTime.now());
        } else {
            chamado.setDataFechamento(null);
        }

        chamado.setStatus(novoStatus);
        return ChamadoMapper.toResponse(repository.save(chamado));
    }

    @Transactional
    public ChamadoResponse registrarRelatorioTecnico(Long id, RelatorioTecnicoRequest request) {
        Usuario tecnico = autenticadoService.atual();
        exigirTecnicoAtivo(tecnico);
        Chamado chamado = obter(id);
        exigirTecnicoResponsavel(chamado, tecnico);
        if (chamado.getStatus() == StatusChamado.CONCLUIDO || chamado.getStatus() == StatusChamado.CANCELADO) {
            throw new BusinessException("Chamado encerrado nao pode receber relatorio tecnico.");
        }

        chamado.setProblemaIdentificado(request.getProblemaIdentificado().trim());
        chamado.setDiagnostico(request.getDiagnostico().trim());
        chamado.setProcedimentosRealizados(request.getProcedimentosRealizados().trim());
        chamado.setSolucao(request.getSolucaoAplicada().trim());
        chamado.setObservacoesRelatorio(temTexto(request.getObservacoes()) ? request.getObservacoes().trim() : null);
        chamado.setDataAtendimento(LocalDateTime.now());
        return ChamadoMapper.toResponse(repository.save(chamado));
    }

    public Chamado obterComPermissao(Long id) {
        Chamado chamado = obter(id);
        exigirVisualizacao(autenticadoService.atual(), chamado);
        return chamado;
    }

    private void preencherRelacionamentosEditaveis(Chamado chamado, ChamadoRequest request) {
        chamado.setCategoria(obterCategoria(request.getCategoriaId()));
        chamado.setEquipamento(request.getEquipamentoId() == null ? null : obterEquipamento(request.getEquipamentoId()));
        chamado.setSala(request.getSalaId() == null ? null : obterSala(request.getSalaId()));
    }

    /**
     * CT07 — referências inválidas rejeitadas de forma controlada:
     * se o cliente informar solicitanteId ou tecnicoResponsavelId, o
     * identificador precisa existir (404 padronizado). O solicitante
     * efetivo continua sendo o usuário autenticado e o técnico é definido
     * apenas pelo fluxo de atendimento (PATCH /chamados/{id}/assumir).
     */
    private void validarReferenciasInformadas(ChamadoRequest request) {
        if (request.getSolicitanteId() != null) {
            usuarioRepository.findById(request.getSolicitanteId())
                    .orElseThrow(() -> new ResourceNotFoundException("Solicitante nao encontrado."));
        }
        if (request.getTecnicoResponsavelId() != null) {
            usuarioRepository.findById(request.getTecnicoResponsavelId())
                    .orElseThrow(() -> new ResourceNotFoundException("Tecnico responsavel nao encontrado."));
        }
    }

    private boolean podeVisualizar(Usuario usuario, Chamado chamado) {
        return switch (usuario.getTipo()) {
            case ADMINISTRADOR -> true;
            case TECNICO -> chamado.getTecnicoResponsavel() == null
                    || chamado.getTecnicoResponsavel().getId().equals(usuario.getId());
            case INSTRUTOR, COORDENADOR -> chamado.getSolicitante().getId().equals(usuario.getId());
        };
    }

    private void exigirVisualizacao(Usuario usuario, Chamado chamado) {
        if (!podeVisualizar(usuario, chamado)) {
            throw new AccessDeniedException("Usuario nao possui acesso a este chamado.");
        }
    }

    private void exigirTecnicoResponsavel(Chamado chamado, Usuario tecnico) {
        if (chamado.getTecnicoResponsavel() == null) {
            throw new BusinessException("Chamado ainda nao possui tecnico responsavel.");
        }
        if (!chamado.getTecnicoResponsavel().getId().equals(tecnico.getId())) {
            throw new AccessDeniedException("Somente o tecnico responsavel pode executar esta acao.");
        }
    }

    private void exigirTecnicoAtivo(Usuario usuario) {
        if (usuario.getTipo() != TipoUsuario.TECNICO || !Boolean.TRUE.equals(usuario.getAtivo())) {
            throw new AccessDeniedException("Apenas tecnico ativo pode executar esta acao.");
        }
    }

    private void validarTransicao(StatusChamado atual, StatusChamado novo) {
        if (EnumSet.of(StatusChamado.CONCLUIDO, StatusChamado.CANCELADO).contains(atual)) {
            throw new BusinessException("Chamado encerrado nao permite alteracao de status.");
        }
        if (atual == novo) {
            return;
        }

        boolean permitido = switch (atual) {
            case ABERTO -> novo == StatusChamado.EM_ANALISE || novo == StatusChamado.CANCELADO;
            case EM_ANALISE -> novo == StatusChamado.EM_ANDAMENTO || novo == StatusChamado.CANCELADO;
            case EM_ANDAMENTO -> novo == StatusChamado.CONCLUIDO || novo == StatusChamado.CANCELADO;
            case CONCLUIDO, CANCELADO -> false;
        };
        if (!permitido) {
            throw new BusinessException("Transicao de status invalida.");
        }
    }

    private void validarConclusao(Chamado chamado) {
        if (!temTexto(chamado.getSolucao())) {
            throw new BusinessException("Chamado concluido deve possuir solucao.");
        }
        if (!temTexto(chamado.getProblemaIdentificado())
                || !temTexto(chamado.getDiagnostico())
                || !temTexto(chamado.getProcedimentosRealizados())
                || chamado.getDataAtendimento() == null) {
            throw new BusinessException("Chamado concluido deve possuir relatorio tecnico completo.");
        }
    }

    private boolean temTexto(String valor) {
        return valor != null && !valor.isBlank();
    }

    private Chamado obter(Long id) {
        return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Chamado nao encontrado."));
    }

    private Categoria obterCategoria(Long id) {
        return categoriaRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Categoria nao encontrada."));
    }

    private Equipamento obterEquipamento(Long id) {
        return equipamentoRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Equipamento nao encontrado."));
    }

    private Sala obterSala(Long id) {
        return salaRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Sala nao encontrada."));
    }

    @SuppressWarnings("unused")
    private Usuario obterUsuario(Long id, String recurso) {
        return usuarioRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException(recurso + " nao encontrado."));
    }
}
