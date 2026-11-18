package br.com.senac.conectati.config;

import br.com.senac.conectati.security.BearerTokenAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final BearerTokenAuthenticationFilter bearerTokenAuthenticationFilter;

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/auth/**", "/swagger-ui/**", "/v3/api-docs/**").permitAll()
                        .requestMatchers("/actuator/health", "/actuator/health/**").permitAll()
                        // O dispatch de erro do Spring MVC reexecuta a cadeia de
                        // segurança; sem este permitAll, o 403/404 original seria
                        // sobrescrito por 401 (contexto anônimo no /error).
                        .requestMatchers("/error").permitAll()
                        .requestMatchers("/", "/index.html", "/assets/**", "/js/**", "/css/**").permitAll()
                        .requestMatchers("/usuarios/**").hasRole("ADMINISTRADOR")
                        .requestMatchers("/chamados/*/status", "/chamados/*/assumir", "/chamados/*/relatorio-tecnico").hasRole("TECNICO")
                        .requestMatchers("/chamados/**").hasAnyRole("ADMINISTRADOR", "INSTRUTOR", "COORDENADOR", "TECNICO")
                        .requestMatchers(HttpMethod.GET, "/equipamentos/**").hasAnyRole("ADMINISTRADOR", "COORDENADOR", "TECNICO")
                        .requestMatchers("/equipamentos/**").hasRole("ADMINISTRADOR")
                        .requestMatchers(HttpMethod.GET, "/categorias/**", "/salas/**", "/laboratorios/**").authenticated()
                        .requestMatchers("/categorias/**", "/salas/**", "/laboratorios/**").hasRole("ADMINISTRADOR")
                        .requestMatchers("/chat/**").hasAnyRole("INSTRUTOR", "COORDENADOR", "TECNICO")
                        .requestMatchers("/dashboard/**").authenticated()
                        .anyRequest().authenticated())
                .addFilterBefore(
                        bearerTokenAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class)
                // Política CT12: requisição sem credencial válida responde 401
                // (não autenticado); acesso autenticado sem permissão segue 403.
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)))
                .formLogin(form -> form.disable())
                .httpBasic(basic -> basic.disable())
                .build();
    }
}
