package br.com.senac.conectati.repository;

import br.com.senac.conectati.enums.StatusChamado;
import br.com.senac.conectati.model.Chamado;
import br.com.senac.conectati.model.Usuario;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChamadoRepository extends JpaRepository<Chamado, Long> {

    List<Chamado> findByStatus(StatusChamado status);

    List<Chamado> findBySolicitante(Usuario solicitante);

    List<Chamado> findByTecnicoResponsavel(Usuario tecnicoResponsavel);

    List<Chamado> findByCategoriaId(Long categoriaId);

    List<Chamado> findByEquipamentoId(Long equipamentoId);

    List<Chamado> findBySalaId(Long salaId);

    long countByStatus(StatusChamado status);

    long countBySolicitante(Usuario solicitante);

    long countBySolicitanteAndStatus(Usuario solicitante, StatusChamado status);

    long countByTecnicoResponsavel(Usuario tecnicoResponsavel);

    long countByTecnicoResponsavelAndStatus(Usuario tecnicoResponsavel, StatusChamado status);

    /*
     * Consultas usadas pela listagem (/chamados): filtradas por perfil no
     * banco e com os relacionamentos carregados em uma única query
     * (fetch join via @EntityGraph), evitando N+1 nas relações LAZY.
     */
    @EntityGraph(attributePaths = {"solicitante", "tecnicoResponsavel", "categoria", "equipamento", "sala"})
    @Query("select c from Chamado c order by c.id desc")
    List<Chamado> findAllComRelacionamentos();

    @EntityGraph(attributePaths = {"solicitante", "tecnicoResponsavel", "categoria", "equipamento", "sala"})
    @Query("select c from Chamado c where c.solicitante.id = :solicitanteId order by c.id desc")
    List<Chamado> listarPorSolicitante(@Param("solicitanteId") Long solicitanteId);

    @EntityGraph(attributePaths = {"solicitante", "tecnicoResponsavel", "categoria", "equipamento", "sala"})
    @Query("select c from Chamado c where c.tecnicoResponsavel.id = :tecnicoId or c.tecnicoResponsavel is null order by c.id desc")
    List<Chamado> listarFilaDoTecnico(@Param("tecnicoId") Long tecnicoId);

}
