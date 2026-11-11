package br.com.senac.conectati.config;

import br.com.senac.conectati.enums.TipoUsuario;
import br.com.senac.conectati.model.Categoria;
import br.com.senac.conectati.model.Equipamento;
import br.com.senac.conectati.model.Laboratorio;
import br.com.senac.conectati.model.Sala;
import br.com.senac.conectati.model.Usuario;
import br.com.senac.conectati.repository.CategoriaRepository;
import br.com.senac.conectati.repository.EquipamentoRepository;
import br.com.senac.conectati.repository.LaboratorioRepository;
import br.com.senac.conectati.repository.SalaRepository;
import br.com.senac.conectati.repository.UsuarioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@ConditionalOnProperty(name = "app.demo-data.enabled", havingValue = "true")
public class DemoDataInitializer {

    private static final Logger log = LoggerFactory.getLogger(DemoDataInitializer.class);

    @Bean
    ApplicationRunner seedDemoData(
            UsuarioRepository usuarios,
            CategoriaRepository categorias,
            LaboratorioRepository laboratorios,
            SalaRepository salas,
            EquipamentoRepository equipamentos,
            JdbcTemplate jdbcTemplate,
            PasswordEncoder passwordEncoder) {
        return args -> {
            log.info(">>> [seedDemoData] Iniciando migrarEnumsLegados");
            migrarEnumsLegados(jdbcTemplate);
            log.info(">>> [seedDemoData] Terminou migrarEnumsLegados");

            log.info(">>> [seedDemoData] Criando usuarios demo");
            criarUsuarioDemo(usuarios, passwordEncoder, "Administrador", "admin@conectati.local", "Admin@123", TipoUsuario.ADMINISTRADOR);
            criarUsuarioDemo(usuarios, passwordEncoder, "Instrutor de Demonstracao", "instrutor@conectati.local", "Instrutor@123", TipoUsuario.INSTRUTOR);
            criarUsuarioDemo(usuarios, passwordEncoder, "Tecnico de Demonstracao", "tecnico@conectati.local", "Tecnico@123", TipoUsuario.TECNICO);
            criarUsuarioDemo(usuarios, passwordEncoder, "Coordenador de Demonstracao", "coordenador@conectati.local", "Coordenador@123", TipoUsuario.COORDENADOR);
            log.info(">>> [seedDemoData] Terminou criacao de usuarios");

            log.info(">>> [seedDemoData] Verificando categoria");
            Categoria categoria = categorias.findByNomeIgnoreCase("Informatica").orElseGet(() -> {
                Categoria item = new Categoria();
                item.setNome("Informatica");
                item.setDescricao("Equipamentos e suporte de TI");
                return categorias.save(item);
            });

            log.info(">>> [seedDemoData] Verificando laboratorio");
            Laboratorio laboratorio = laboratorios.findByNomeIgnoreCase("Laboratorio de Informatica").orElseGet(() -> {
                Laboratorio item = new Laboratorio();
                item.setNome("Laboratorio de Informatica");
                item.setLocalizacao("Bloco A");
                item.setCapacidade(30);
                return laboratorios.save(item);
            });

            log.info(">>> [seedDemoData] Verificando sala");
            Sala sala = salas.findByNomeIgnoreCase("Laboratorio 01").orElseGet(() -> {
                Sala item = new Sala();
                item.setNome("Laboratorio 01");
                item.setCapacidade(30);
                item.setLaboratorio(laboratorio);
                return salas.save(item);
            });

            log.info(">>> [seedDemoData] Verificando equipamento");
            if (!equipamentos.existsByPatrimonio("SENAC-001")) {
                Equipamento equipamento = new Equipamento();
                equipamento.setNome("Notebook de suporte");
                equipamento.setPatrimonio("SENAC-001");
                equipamento.setTipo("Notebook");
                equipamento.setFabricante("Dell");
                equipamento.setModelo("Latitude");
                equipamento.setSala(sala);
                equipamento.setCategoria(categoria);
                equipamentos.save(equipamento);
            }

            log.info(">>> [seedDemoData] Finalizado com sucesso");
        };
    }

    private void criarUsuarioDemo(UsuarioRepository usuarios, PasswordEncoder passwordEncoder, String nome, String email, String senha, TipoUsuario tipo) {
        if (!usuarios.existsByEmail(email)) {
            Usuario usuario = new Usuario();
            usuario.setNome(nome);
            usuario.setEmail(email);
            usuario.setSenha(passwordEncoder.encode(senha));
            usuario.setTipo(tipo);
            usuario.setAtivo(true);
            usuarios.save(usuario);
        }
    }

    private void migrarEnumsLegados(JdbcTemplate jdbcTemplate) {
        jdbcTemplate.setQueryTimeout(10);
        jdbcTemplate.update("update usuarios set tipo = 'ADMINISTRADOR' where tipo = 'ADMIN'");
        jdbcTemplate.update("update usuarios set tipo = 'INSTRUTOR' where tipo in ('PROFESSOR', 'ALUNO')");
        jdbcTemplate.update("update chamados set status = 'CONCLUIDO' where status = 'FINALIZADO'");
    }
}
