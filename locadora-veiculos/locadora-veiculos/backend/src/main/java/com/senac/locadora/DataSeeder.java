package com.senac.locadora;

import com.senac.locadora.model.*;
import com.senac.locadora.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DataSeeder implements CommandLineRunner {

    private final CategoriaRepository categoriaRepository;
    private final VeiculoRepository veiculoRepository;
    private final ClienteRepository clienteRepository;
    private final SeguroRepository seguroRepository;
    private final LocacaoRepository locacaoRepository;
    private final ManutencaoRepository manutencaoRepository;

    public DataSeeder(CategoriaRepository categoriaRepository, VeiculoRepository veiculoRepository,
                       ClienteRepository clienteRepository, SeguroRepository seguroRepository,
                       LocacaoRepository locacaoRepository, ManutencaoRepository manutencaoRepository) {
        this.categoriaRepository = categoriaRepository;
        this.veiculoRepository = veiculoRepository;
        this.clienteRepository = clienteRepository;
        this.seguroRepository = seguroRepository;
        this.locacaoRepository = locacaoRepository;
        this.manutencaoRepository = manutencaoRepository;
    }

    @Override
    public void run(String... args) {
        if (categoriaRepository.count() > 0) return;

        Categoria economico = categoriaRepository.save(new Categoria(null, "Econômico", 120.0));
        Categoria sedan = categoriaRepository.save(new Categoria(null, "Sedan", 180.0));
        Categoria suv = categoriaRepository.save(new Categoria(null, "SUV", 250.0));
        Categoria luxo = categoriaRepository.save(new Categoria(null, "Luxo", 450.0));

        Veiculo onix = veiculoRepository.save(new Veiculo(null, "ABC1234", "Chevrolet Onix", 2023, economico, "DISPONIVEL"));
        Veiculo corolla = veiculoRepository.save(new Veiculo(null, "DEF5678", "Toyota Corolla", 2022, sedan, "ALUGADO"));
        veiculoRepository.save(new Veiculo(null, "GHI9012", "Jeep Compass", 2023, suv, "DISPONIVEL"));
        Veiculo bmw = veiculoRepository.save(new Veiculo(null, "JKL3456", "BMW X5", 2021, luxo, "MANUTENCAO"));

        Cliente joao = clienteRepository.save(new Cliente(null, "João Pedro Alves", "111.222.333-44",
                "12345678900", "(61) 99111-2233", "joao.alves@email.com"));
        clienteRepository.save(new Cliente(null, "Camila Torres", "222.333.444-55",
                "23456789011", "(61) 99222-3344", "camila.torres@email.com"));
        clienteRepository.save(new Cliente(null, "Rafael Nunes", "333.444.555-66",
                "34567890122", "(61) 99333-4455", "rafael.nunes@email.com"));

        seguroRepository.save(new Seguro(null, "Básico", 30.0));
        seguroRepository.save(new Seguro(null, "Completo", 60.0));

        // Locação já ativa no Corolla — use isso pra testar o conflito de datas
        // (tente criar outra locação pro mesmo veículo com datas sobrepostas a essa).
        Locacao locacaoAtiva = new Locacao();
        locacaoAtiva.setVeiculo(corolla);
        locacaoAtiva.setCliente(joao);
        locacaoAtiva.setDataInicio(LocalDate.now());
        locacaoAtiva.setDataFimPrevista(LocalDate.now().plusDays(5));
        locacaoAtiva.setStatus("ATIVA");
        locacaoAtiva.setValorTotal(180.0 * 5);
        locacaoRepository.save(locacaoAtiva);

        // Manutenção em aberto no BMW X5 — condizente com o status MANUTENCAO do veículo.
        Manutencao manutencao = new Manutencao();
        manutencao.setVeiculo(bmw);
        manutencao.setDescricao("Revisão dos freios e troca de óleo");
        manutencao.setDataInicio(LocalDate.now().minusDays(2));
        manutencao.setCusto(850.0);
        manutencaoRepository.save(manutencao);
    }
}
