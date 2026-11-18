package br.com.senac.conectati.service;

import br.com.senac.conectati.dto.request.UsuarioRequest;
import br.com.senac.conectati.dto.response.UsuarioResponse;
import br.com.senac.conectati.enums.TipoUsuario;
import br.com.senac.conectati.exception.BusinessException;
import br.com.senac.conectati.exception.ResourceNotFoundException;
import br.com.senac.conectati.model.Usuario;
import br.com.senac.conectati.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * CT12 (credenciais) e regras de cadastro de usuários — senhas sempre
 * com hash BCrypt, e-mail único e exclusão lógica (soft delete).
 */
@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository repository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UsuarioService service;

    private UsuarioRequest request;

    @BeforeEach
    void preparar() {
        request = new UsuarioRequest();
        request.setNome("Novo Usuario");
        request.setEmail("novo@conectati.local");
        request.setSenha("Senha@123");
        request.setTipo(TipoUsuario.INSTRUTOR);
        request.setAtivo(true);
    }

    @Test
    @DisplayName("cadastro grava senha com hash BCrypt, nunca em texto puro")
    void gravaHashBcrypt() {
        when(repository.findByEmail("novo@conectati.local")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("Senha@123")).thenReturn("$2a$10$hashgerado");
        when(repository.save(any(Usuario.class))).thenAnswer(inv -> inv.getArgument(0));

        service.salvar(request);

        ArgumentCaptor<Usuario> captor = ArgumentCaptor.forClass(Usuario.class);
        verify(repository).save(captor.capture());
        assertThat(captor.getValue().getSenha()).isEqualTo("$2a$10$hashgerado");
        assertThat(captor.getValue().getSenha()).isNotEqualTo("Senha@123");
    }

    @Test
    @DisplayName("cadastro sem senha é rejeitado")
    void senhaObrigatoria() {
        request.setSenha(" ");
        assertThatThrownBy(() -> service.salvar(request))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("senha");
        verify(repository, never()).save(any());
    }

    @Test
    @DisplayName("e-mail já cadastrado é rejeitado")
    void emailDuplicado() {
        Usuario existente = new Usuario();
        existente.setId(9L);
        existente.setEmail("novo@conectati.local");
        when(repository.findByEmail("novo@conectati.local")).thenReturn(Optional.of(existente));

        assertThatThrownBy(() -> service.salvar(request))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("e-mail");
        verify(repository, never()).save(any());
    }

    @Test
    @DisplayName("atualização troca senha apenas quando informada")
    void atualizaSenhaOpcional() {
        Usuario existente = new Usuario();
        existente.setId(1L);
        existente.setNome("Antigo");
        existente.setEmail("novo@conectati.local");
        existente.setSenha("hash-antigo");
        existente.setTipo(TipoUsuario.INSTRUTOR);
        existente.setAtivo(true);
        when(repository.findById(1L)).thenReturn(Optional.of(existente));
        when(repository.findByEmail("novo@conectati.local")).thenReturn(Optional.of(existente));
        when(repository.save(any(Usuario.class))).thenAnswer(inv -> inv.getArgument(0));

        UsuarioRequest semSenha = new UsuarioRequest();
        semSenha.setNome("Atualizado");
        semSenha.setEmail("novo@conectati.local");
        semSenha.setTipo(TipoUsuario.INSTRUTOR);
        semSenha.setAtivo(true);
        semSenha.setSenha(null);

        UsuarioResponse resposta = service.atualizar(1L, semSenha);

        assertThat(resposta.getNome()).isEqualTo("Atualizado");
        assertThat(existente.getSenha()).isEqualTo("hash-antigo");
        verify(passwordEncoder, never()).encode(any());
    }

    @Test
    @DisplayName("exclusão é lógica: usuário fica inativo e não é apagado")
    void exclusaoLogica() {
        Usuario existente = new Usuario();
        existente.setId(1L);
        existente.setAtivo(true);
        when(repository.findById(1L)).thenReturn(Optional.of(existente));
        when(repository.save(any(Usuario.class))).thenAnswer(inv -> inv.getArgument(0));

        service.deletar(1L);

        ArgumentCaptor<Usuario> captor = ArgumentCaptor.forClass(Usuario.class);
        verify(repository).save(captor.capture());
        assertThat(captor.getValue().getAtivo()).isFalse();
        verify(repository, never()).delete(any());
    }

    @Test
    @DisplayName("id inexistente devolve 404")
    void idInexistente() {
        when(repository.findById(999L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> service.buscarPorId(999L))
                .isInstanceOf(ResourceNotFoundException.class);
    }
}
