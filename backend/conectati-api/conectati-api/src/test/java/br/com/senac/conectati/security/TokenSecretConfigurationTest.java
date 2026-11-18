package br.com.senac.conectati.security;

import br.com.senac.conectati.repository.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.runner.ApplicationContextRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;

class TokenSecretConfigurationTest {

    private static final String SEGREDO_VALIDO = "segredo-de-teste-com-mais-de-trinta-e-dois-bytes";
    private static final String SEGREDO_PUBLICO =
            "local-development-only-change-before-deploy-32chars-minimum";

    private final ApplicationContextRunner contextRunner = new ApplicationContextRunner()
            .withUserConfiguration(TokenConfiguration.class);

    @Test
    void contextoIniciaComSegredoValido() {
        contextRunner.withPropertyValues("app.auth.token-secret=" + SEGREDO_VALIDO)
                .run(context -> assertThat(context).hasNotFailed());
    }

    @Test
    void contextoFalhaSemSegredo() {
        contextRunner.run(context -> assertThat(context)
                .hasFailed()
                .getFailure()
                .hasStackTraceContaining("APP_AUTH_TOKEN_SECRET"));
    }

    @Test
    void contextoFalhaComSegredoCurto() {
        contextRunner.withPropertyValues("app.auth.token-secret=curto")
                .run(context -> assertThat(context)
                        .hasFailed()
                        .getFailure()
                        .hasStackTraceContaining("pelo menos 32 bytes"));
    }

    @Test
    void contextoFalhaComSegredoPublicoConhecido() {
        contextRunner.withPropertyValues("app.auth.token-secret=" + SEGREDO_PUBLICO)
                .run(context -> assertThat(context)
                        .hasFailed()
                        .getFailure()
                        .hasStackTraceContaining("segredo público de desenvolvimento"));
    }

    @Configuration(proxyBeanMethods = false)
    @Import(TokenService.class)
    static class TokenConfiguration {
        @Bean
        UsuarioRepository usuarioRepository() {
            return mock(UsuarioRepository.class);
        }
    }
}
