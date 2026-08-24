package com.senac.locadora.repository;

import com.senac.locadora.model.Locacao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LocacaoRepository extends JpaRepository<Locacao, Long> {
    List<Locacao> findAllByVeiculoIdAndStatus(Long veiculoId, String status);
    List<Locacao> findAllByClienteId(Long clienteId);
}
