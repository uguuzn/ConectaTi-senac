package com.senac.locadora.controller;

import com.senac.locadora.model.Locacao;
import com.senac.locadora.model.Multa;
import com.senac.locadora.repository.LocacaoRepository;
import com.senac.locadora.repository.MultaRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/multas")
public class MultaController {

    private final MultaRepository multaRepository;
    private final LocacaoRepository locacaoRepository;

    public MultaController(MultaRepository multaRepository, LocacaoRepository locacaoRepository) {
        this.multaRepository = multaRepository;
        this.locacaoRepository = locacaoRepository;
    }

    @GetMapping
    public List<Multa> listar() {
        return multaRepository.findAll();
    }

    @PostMapping
    public Multa criar(@RequestBody MultaRequest req) {
        Locacao locacao = locacaoRepository.findById(req.locacaoId)
                .orElseThrow(() -> new RuntimeException("Locação não encontrada"));

        Multa multa = new Multa();
        multa.setLocacao(locacao);
        multa.setMotivo(req.motivo);
        multa.setValor(req.valor);

        return multaRepository.save(multa);
    }
}
