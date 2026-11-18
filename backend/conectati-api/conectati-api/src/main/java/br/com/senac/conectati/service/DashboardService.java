package br.com.senac.conectati.service;

import br.com.senac.conectati.dto.response.DashboardResponse;
import br.com.senac.conectati.enums.StatusChamado;
import br.com.senac.conectati.enums.TipoUsuario;
import br.com.senac.conectati.model.Usuario;
import br.com.senac.conectati.repository.ChamadoRepository;
import br.com.senac.conectati.repository.EquipamentoRepository;
import br.com.senac.conectati.repository.UsuarioRepository;
import br.com.senac.conectati.security.UsuarioAutenticadoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private final ChamadoRepository chamadoRepository;
    private final UsuarioRepository usuarioRepository;
    private final EquipamentoRepository equipamentoRepository;
    private final UsuarioAutenticadoService autenticadoService;

    public DashboardResponse obterDashboard() {
        Usuario usuario = autenticadoService.atual();
        DashboardResponse response = new DashboardResponse();
        response.setCargo(usuario.getTipo());

        switch (usuario.getTipo()) {
            case ADMINISTRADOR -> preencherAdministrador(response);
            case TECNICO -> preencherTecnico(response, usuario);
            case INSTRUTOR, COORDENADOR -> preencherSolicitante(response, usuario);
        }

        return response;
    }

    private void preencherAdministrador(DashboardResponse response) {
        response.setTotalChamados(chamadoRepository.count());
        for (StatusChamado status : StatusChamado.values()) {
            response.getChamadosPorStatus().put(status, chamadoRepository.countByStatus(status));
        }
        for (TipoUsuario tipo : TipoUsuario.values()) {
            // Contagem no banco; antes carregava todos os usuários para somar em memória.
            response.getUsuariosPorCargo().put(tipo, usuarioRepository.countByTipo(tipo));
        }
        response.setTotalEquipamentos(equipamentoRepository.count());
    }

    private void preencherTecnico(DashboardResponse response, Usuario tecnico) {
        response.setTotalChamados(chamadoRepository.countByTecnicoResponsavel(tecnico));
        for (StatusChamado status : StatusChamado.values()) {
            response.getChamadosPorStatus().put(status, chamadoRepository.countByTecnicoResponsavelAndStatus(tecnico, status));
        }
        response.setTotalEquipamentos(equipamentoRepository.count());
    }

    private void preencherSolicitante(DashboardResponse response, Usuario solicitante) {
        response.setTotalChamados(chamadoRepository.countBySolicitante(solicitante));
        for (StatusChamado status : StatusChamado.values()) {
            response.getChamadosPorStatus().put(status, chamadoRepository.countBySolicitanteAndStatus(solicitante, status));
        }
        if (solicitante.getTipo() == TipoUsuario.COORDENADOR) {
            response.setTotalEquipamentos(equipamentoRepository.count());
        }
    }
}
