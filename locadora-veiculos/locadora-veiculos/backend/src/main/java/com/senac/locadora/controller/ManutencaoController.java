package com.senac.locadora.controller;

import com.senac.locadora.model.Manutencao;
import com.senac.locadora.model.Veiculo;
import com.senac.locadora.repository.ManutencaoRepository;
import com.senac.locadora.repository.VeiculoRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/manutencoes")
public class ManutencaoController {

    private final ManutencaoRepository manutencaoRepository;
    private final VeiculoRepository veiculoRepository;

    public ManutencaoController(ManutencaoRepository manutencaoRepository, VeiculoRepository veiculoRepository) {
        this.manutencaoRepository = manutencaoRepository;
        this.veiculoRepository = veiculoRepository;
    }

    @GetMapping
    public List<Manutencao> listar() {
        return manutencaoRepository.findAll();
    }

    // Registra uma manutenção e coloca o veículo em status MANUTENCAO.
    @PostMapping
    public Manutencao criar(@RequestBody ManutencaoRequest req) {
        Veiculo veiculo = veiculoRepository.findById(req.veiculoId)
                .orElseThrow(() -> new RuntimeException("Veículo não encontrado"));

        Manutencao manutencao = new Manutencao();
        manutencao.setVeiculo(veiculo);
        manutencao.setDescricao(req.descricao);
        manutencao.setDataInicio(req.dataInicio);
        manutencao.setCusto(req.custo);

        veiculo.setStatus("MANUTENCAO");
        veiculoRepository.save(veiculo);

        return manutencaoRepository.save(manutencao);
    }

    // Encerra a manutenção e devolve o veículo para DISPONIVEL.
    @PatchMapping("/{id}/concluir")
    public Manutencao concluir(@PathVariable Long id) {
        Manutencao manutencao = manutencaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Manutenção não encontrada"));

        manutencao.setDataFim(LocalDate.now());

        Veiculo veiculo = manutencao.getVeiculo();
        veiculo.setStatus("DISPONIVEL");
        veiculoRepository.save(veiculo);

        return manutencaoRepository.save(manutencao);
    }
}
