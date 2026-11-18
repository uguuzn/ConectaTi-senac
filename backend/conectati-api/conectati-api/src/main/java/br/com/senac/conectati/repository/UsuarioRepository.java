package br.com.senac.conectati.repository;

import br.com.senac.conectati.enums.TipoUsuario;
import br.com.senac.conectati.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByEmail(String email);

    boolean existsByEmail(String email);

    List<Usuario> findByTipo(TipoUsuario tipo);

    long countByTipo(TipoUsuario tipo);

    List<Usuario> findByNomeContainingIgnoreCase(String nome);

}