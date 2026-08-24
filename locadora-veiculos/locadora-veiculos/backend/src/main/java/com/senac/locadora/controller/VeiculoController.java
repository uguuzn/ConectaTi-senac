package com.senac.locadora.controller;

import com.senac.locadora.model.Categoria;
import com.senac.locadora.model.Veiculo;
import com.senac.locadora.repository.CategoriaRepository;
import com.senac.locadora.repository.VeiculoRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/veiculos")
public class VeiculoController {

    private final VeiculoRepository veiculoRepository;
    private final CategoriaRepository categoriaRepository;

    public VeiculoController(VeiculoRepository veiculoRepository, CategoriaRepository categoriaRepository) {
        this.veiculoRepository = veiculoRepository;
        this.categoriaRepository = categoriaRepository;
    }

    @GetMapping
    public List<Veiculo> listar() {
        return veiculoRepository.findAll();
    }

    @PostMapping
    public Veiculo criar(@RequestBody VeiculoRequest req) {
        // Validação: Verifica se a placa já existe no banco de dados
        if (veiculoRepository.findByPlaca(req.placa).isPresent()) {
            throw new RuntimeException("Erro: Já existe um veículo cadastrado com a placa " + req.placa);
        }

        Categoria categoria = categoriaRepository.findById(req.categoriaId)
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada"));

        Veiculo veiculo = new Veiculo();
        veiculo.setPlaca(req.placa);
        veiculo.setModelo(req.modelo);
        veiculo.setAno(req.ano);
        veiculo.setCategoria(categoria);
        veiculo.setStatus("DISPONIVEL");

        return veiculoRepository.save(veiculo);
    }
}