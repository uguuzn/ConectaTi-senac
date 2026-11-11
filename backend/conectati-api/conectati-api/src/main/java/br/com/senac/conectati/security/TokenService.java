package br.com.senac.conectati.security;

import br.com.senac.conectati.model.Usuario;
import br.com.senac.conectati.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import jakarta.annotation.PostConstruct;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;
import java.util.HexFormat;
import java.util.List;
import java.util.Optional;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

@Service
@RequiredArgsConstructor
public class TokenService {

    private final UsuarioRepository usuarioRepository;
    private final SecureRandom secureRandom = new SecureRandom();
    private static final long TOKEN_LIFETIME_SECONDS = 12 * 60 * 60;

    @Value("${app.auth.token-secret}")
    private String tokenSecret;

    @PostConstruct
    void validarConfiguracao() {
        if (tokenSecret == null || tokenSecret.getBytes(StandardCharsets.UTF_8).length < 32) {
            throw new IllegalStateException("APP_AUTH_TOKEN_SECRET deve ter pelo menos 32 bytes.");
        }
    }

    public String emitirToken(Usuario usuario) {
        byte[] nonce = new byte[16];
        secureRandom.nextBytes(nonce);
        long expiry = System.currentTimeMillis() / 1000 + TOKEN_LIFETIME_SECONDS;
        String payload = usuario.getId() + ":" + expiry + ":" + HexFormat.of().formatHex(nonce);
        String encodedPayload = Base64.getUrlEncoder().withoutPadding()
                .encodeToString(payload.getBytes(StandardCharsets.UTF_8));
        return encodedPayload + "." + assinar(encodedPayload);
    }

    public Optional<Authentication> autenticar(String token) {
        Long usuarioId = validarToken(token);
        if (usuarioId == null) {
            return Optional.empty();
        }

        return usuarioRepository.findById(usuarioId)
                .filter(usuario -> Boolean.TRUE.equals(usuario.getAtivo()))
                .map(usuario -> new UsernamePasswordAuthenticationToken(
                        usuario,
                        null,
                        List.of(new SimpleGrantedAuthority("ROLE_" + usuario.getTipo().name()))
                ));
    }

    private Long validarToken(String token) {
        if (token == null || token.isBlank()) return null;
        String[] partes = token.split("\\.", -1);
        if (partes.length != 2 || !MessageDigest.isEqual(
                partes[1].getBytes(StandardCharsets.US_ASCII),
                assinar(partes[0]).getBytes(StandardCharsets.US_ASCII))) return null;
        try {
            String payload = new String(Base64.getUrlDecoder().decode(partes[0]), StandardCharsets.UTF_8);
            String[] campos = payload.split(":", -1);
            if (campos.length != 3 || campos[2].length() != 32) return null;
            long expiry = Long.parseLong(campos[1]);
            if (expiry <= System.currentTimeMillis() / 1000) return null;
            return Long.parseLong(campos[0]);
        } catch (IllegalArgumentException exception) {
            return null;
        }
    }

    private String assinar(String payload) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(tokenSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(
                    mac.doFinal(payload.getBytes(StandardCharsets.US_ASCII)));
        } catch (java.security.GeneralSecurityException exception) {
            throw new IllegalStateException("Não foi possível assinar o token de sessão.", exception);
        }
    }
}
