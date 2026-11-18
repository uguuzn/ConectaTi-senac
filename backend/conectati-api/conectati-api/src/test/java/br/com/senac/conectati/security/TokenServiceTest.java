package br.com.senac.conectati.security;

import br.com.senac.conectati.enums.TipoUsuario;
import br.com.senac.conectati.model.Usuario;
import br.com.senac.conectati.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.test.util.ReflectionTestUtils;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HexFormat;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

/**
 * CT12 (nível de token) — assinatura, expiração e usuário ativo.
 * O TokenService usa HMAC-SHA256 sobre "id:expiracao:nonce" em Base64url.
 */
@ExtendWith(MockitoExtension.class)
class TokenServiceTest {

    private static final String SEGREDO = "test-secret-with-at-least-32-bytes-long";

    @Mock
    private UsuarioRepository usuarioRepository;

    private TokenService service;

    @BeforeEach
    void preparar() {
        service = new TokenService(usuarioRepository);
        ReflectionTestUtils.setField(service, "tokenSecret", SEGREDO);
        service.validarConfiguracao();
    }

    private Usuario usuario(Long id, boolean ativo) {
        Usuario usuario = new Usuario();
        usuario.setId(id);
        usuario.setNome("Usuario " + id);
        usuario.setTipo(TipoUsuario.INSTRUTOR);
        usuario.setAtivo(ativo);
        return usuario;
    }

    @Test
    @DisplayName("token emitido é aceito e autentica o usuário com sua ROLE")
    void emiteEValidaToken() {
        Usuario usuario = usuario(1L, true);
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));

        String token = service.emitirToken(usuario);
        Optional<Authentication> autenticacao = service.autenticar(token);

        assertThat(autenticacao).isPresent();
        assertThat(autenticacao.get().getPrincipal()).isEqualTo(usuario);
        assertThat(autenticacao.get().getAuthorities())
                .anyMatch(a -> a.getAuthority().equals("ROLE_INSTRUTOR"));
    }

    @Test
    @DisplayName("token expirado é rejeitado")
    void rejeitaTokenExpirado() {
        String payload = "1:" + (System.currentTimeMillis() / 1000 - 3600) + ":" + HexFormat.of().formatHex(new byte[16]);
        String encoded = Base64.getUrlEncoder().withoutPadding().encodeToString(payload.getBytes(StandardCharsets.UTF_8));
        String token = encoded + "." + assinar(encoded);

        assertThat(service.autenticar(token)).isEmpty();
    }

    @Test
    @DisplayName("token com assinatura inválida é rejeitado")
    void rejeitaAssinaturaInvalida() {
        String tokenValido = service.emitirToken(usuario(1L, true));
        String payloadCorrompido = tokenValido.split("\\.")[0];
        String tokenFalso = payloadCorrompido + "."
                + Base64.getUrlEncoder().withoutPadding().encodeToString(new byte[32]);

        assertThat(service.autenticar(tokenFalso)).isEmpty();
    }

    @Test
    @DisplayName("token alterado no payload (id trocado) é rejeitado")
    void rejeitaPayloadAlterado() {
        Usuario usuario = usuario(1L, true);
        String token = service.emitirToken(usuario);
        String assinatura = token.split("\\.")[1];

        String payloadFalso = Base64.getUrlEncoder().withoutPadding()
                .encodeToString(("999:" + (System.currentTimeMillis() / 1000 + 3600) + ":"
                        + HexFormat.of().formatHex(new byte[16])).getBytes(StandardCharsets.UTF_8));

        assertThat(service.autenticar(payloadFalso + "." + assinatura)).isEmpty();
    }

    @Test
    @DisplayName("token de usuário inativo é rejeitado")
    void rejeitaUsuarioInativo() {
        Usuario usuario = usuario(1L, false);
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));

        String token = service.emitirToken(usuario);

        assertThat(service.autenticar(token)).isEmpty();
    }

    @Test
    @DisplayName("token malformado é rejeitado sem exceção")
    void rejeitaTokenMalformado() {
        assertThat(service.autenticar(null)).isEmpty();
        assertThat(service.autenticar("")).isEmpty();
        assertThat(service.autenticar("abc")).isEmpty();
        assertThat(service.autenticar("abc.def.ghi")).isEmpty();
    }

    @Test
    @DisplayName("segredo com menos de 32 bytes impede a inicialização")
    void rejeitaSegredoCurto() {
        TokenService fraco = new TokenService(usuarioRepository);
        ReflectionTestUtils.setField(fraco, "tokenSecret", "curto");
        assertThatThrownBy(fraco::validarConfiguracao)
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("32");
    }

    private String assinar(String payload) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(SEGREDO.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(
                    mac.doFinal(payload.getBytes(StandardCharsets.US_ASCII)));
        } catch (Exception exception) {
            throw new IllegalStateException(exception);
        }
    }
}
