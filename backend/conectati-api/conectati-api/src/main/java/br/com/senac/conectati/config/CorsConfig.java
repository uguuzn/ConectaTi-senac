package br.com.senac.conectati.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;
import jakarta.annotation.PostConstruct;

/**
 * Configuração global de CORS.
 * Permite que aplicações front-end consumam a API.
 */
@Configuration
public class CorsConfig {

    @Value("${app.cors.allowed-origins}")
    private String allowedOrigins;

    @PostConstruct
    void validarOrigens() {
        if (allowedOrigins == null || allowedOrigins.isBlank()
                || Arrays.stream(allowedOrigins.split(",")).map(String::trim)
                        .anyMatch(origin -> origin.isEmpty() || origin.contains("*"))) {
            throw new IllegalStateException("APP_CORS_ALLOWED_ORIGINS deve conter origens explícitas, sem curinga.");
        }
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {

            @Override
            public void addCorsMappings(CorsRegistry registry) {

                registry.addMapping("/**")
                        .allowedOrigins(Arrays.stream(allowedOrigins.split(","))
                                .map(String::trim)
                                .filter(origin -> !origin.isEmpty())
                                .toArray(String[]::new))
                        .allowedMethods(
                                "GET",
                                "POST",
                                "PUT",
                                "DELETE",
                                "PATCH",
                                "OPTIONS"
                        )
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}
