package br.com.senac.conectati.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Metadados da documentação OpenAPI (CT11).
 *
 * O esquema de segurança "bearerAuth" indica ao Swagger UI como enviar o
 * token emitido por POST /auth/login (header Authorization: Bearer <token>),
 * permitindo testar endpoints protegidos direto pela documentação.
 */
@Configuration
public class OpenApiConfig {

    private static final String ESQUEMA_SEGURANCA = "bearerAuth";

    @Bean
    public OpenAPI conectatiOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Conecta TI — API de Chamados")
                        .description("API REST do sistema de gestão e acompanhamento de chamados de TI do SENAC-DF. "
                                + "Autenticação: POST /auth/login retorna um token Bearer válido por 12 horas; "
                                + "clique em Authorize para usá-lo nos endpoints protegidos.")
                        .version("1.0.0"))
                .components(new Components().addSecuritySchemes(ESQUEMA_SEGURANCA,
                        new SecurityScheme()
                                .name(ESQUEMA_SEGURANCA)
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("opaque")
                                .description("Token emitido por POST /auth/login")))
                .addSecurityItem(new SecurityRequirement().addList(ESQUEMA_SEGURANCA));
    }
}
