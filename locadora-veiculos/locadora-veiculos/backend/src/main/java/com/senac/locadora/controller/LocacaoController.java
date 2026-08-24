package com.senac.locadora.controller;

import com.senac.locadora.model.*;
import com.senac.locadora.repository.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locacoes")
public class LocacaoController {

    private final LocacaoRepository locacaoRepository;
    private final VeiculoRepository veiculoRepository;
    private final ClienteRepository clienteRepository;
    private final SeguroRepository seguroRepository;

    public LocacaoController(LocacaoRepository locacaoRepository, VeiculoRepository veiculoRepository,
                              ClienteRepository clienteRepository, SeguroRepository seguroRepository) {
        this.locacaoRepository = locacaoRepository;
        this.veiculoRepository = veiculoRepository;
        this.clienteRepository = clienteRepository;
        this.seguroRepository = seguroRepository;
    }

    @GetMapping
    public List<Locacao> listar() {
        return locacaoRepository.findAll();
    }

    // Cria uma nova locação.
    // OBS: não verifica se o veículo já tem outra locação ATIVA com datas sobrepostas,
    // nem se o veículo está em status MANUTENCAO — em ambos os casos, deveria bloquear.
    @PostMapping
    public Locacao criar(@RequestBody LocacaoRequest req) {
        Veiculo veiculo = veiculoRepository.findById(req.veiculoId)
                .orElseThrow(() -> new RuntimeException("Veículo não encontrado"));
        Cliente cliente = clienteRepository.findById(req.clienteId)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

        Locacao locacao = new Locacao();
        locacao.setVeiculo(veiculo);
        locacao.setCliente(cliente);
        locacao.setDataInicio(req.dataInicio);
        locacao.setDataFimPrevista(req.dataFimPrevista);
        locacao.setStatus("ATIVA");

        double valorTotal;
        // OBS: deveria multiplicar o valor da diária pela quantidade de dias da locação,
        // mas sempre calcula como se fosse 1 dia só.
        valorTotal = veiculo.getCategoria().getValorDiaria();

        if (req.seguroId != null) {
            Seguro seguro = seguroRepository.findById(req.seguroId).orElse(null);
            locacao.setSeguro(seguro);
            // OBS: o valor do seguro é buscado e associado à locação, mas nunca é somado
            // ao valorTotal calculado abaixo.
        }

        locacao.setValorTotal(valorTotal);

        veiculo.setStatus("ALUGADO");
        veiculoRepository.save(veiculo);

        return locacaoRepository.save(locacao);
    }

    // Finaliza (devolve) uma locação.
    // OBS: não atualiza o status do veículo de volta para DISPONIVEL — o veículo fica
    // marcado como ALUGADO para sempre, mesmo depois de devolvido.
    @PatchMapping("/{id}/finalizar")
    public Locacao finalizar(@PathVariable Long id, @RequestBody FinalizarRequest req) {
        Locacao locacao = locacaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Locação não encontrada"));

        locacao.setDataFimReal(req.dataFimReal);
        locacao.setStatus("FINALIZADA");

        return locacaoRepository.save(locacao);
    }

    public static class FinalizarRequest {
        public java.time.LocalDate dataFimReal;
    }
}
