package br.com.senac.conectati.exception;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Tratamento uniforme de erros (documentação, seção 6.6):
 * códigos HTTP corretos e sem exposição de detalhes internos.
 */
class GlobalExceptionHandlerTest {

    private GlobalExceptionHandler handler;

    @BeforeEach
    void preparar() {
        handler = new GlobalExceptionHandler();
    }

    @Test
    @DisplayName("ResourceNotFoundException responde 404 com a mensagem de negócio")
    void notFound() {
        ResponseEntity<Map<String, Object>> resposta =
                handler.handleResourceNotFound(new ResourceNotFoundException("Chamado nao encontrado."));

        assertThat(resposta.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(resposta.getBody()).containsEntry("message", "Chamado nao encontrado.");
    }

    @Test
    @DisplayName("BusinessException responde 400")
    void negocio() {
        ResponseEntity<Map<String, Object>> resposta =
                handler.handleBusiness(new BusinessException("Transicao de status invalida."));

        assertThat(resposta.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(resposta.getBody()).containsEntry("status", 400);
    }

    @Test
    @DisplayName("AccessDeniedException responde 403")
    void acessoNegado() {
        ResponseEntity<Map<String, Object>> resposta =
                handler.handleAccessDenied(new AccessDeniedException("Acesso negado."));

        assertThat(resposta.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
    }

    /** Bean com propriedade legível para o BeanPropertyBindingResult. */
    private static class Formulario {
        private String titulo = "";

        public String getTitulo() {
            return titulo;
        }

        public void setTitulo(String titulo) {
            this.titulo = titulo;
        }
    }

    @Test
    @DisplayName("erro de campo responde 400 com a mensagem do campo")
    void validacaoCampo() {
        BeanPropertyBindingResult binding = new BeanPropertyBindingResult(new Formulario(), "request");
        binding.rejectValue("titulo", "blank", "O titulo e obrigatorio.");
        MethodArgumentNotValidException excecao =
                new MethodArgumentNotValidException(null, binding);

        ResponseEntity<Map<String, Object>> resposta = handler.handleValidation(excecao);

        assertThat(resposta.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(resposta.getBody()).containsEntry("message", "O titulo e obrigatorio.");
    }

    @Test
    @DisplayName("validação sem erro de campo não gera NullPointerException (400)")
    void validacaoSemCampo() {
        BeanPropertyBindingResult binding = new BeanPropertyBindingResult(new Formulario(), "request");
        binding.reject("global", "Requisição inválida.");
        MethodArgumentNotValidException excecao =
                new MethodArgumentNotValidException(null, binding);

        ResponseEntity<Map<String, Object>> resposta = handler.handleValidation(excecao);

        assertThat(resposta.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(resposta.getBody().get("message")).isNotNull();
    }

    @Test
    @DisplayName("corpo JSON malformado responde 400 com mensagem neutra")
    void corpoInlegivel() {
        ResponseEntity<Map<String, Object>> resposta =
                handler.handleCorpoInlegivel(new HttpMessageNotReadableException(
                        "detalhe interno do parser", null));

        assertThat(resposta.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(resposta.getBody()).containsEntry("message", "Corpo da requisição ausente ou malformado.");
    }

    @Test
    @DisplayName("parâmetro de rota com tipo inválido responde 400")
    void tipoInvalido() {
        MethodArgumentTypeMismatchException excecao =
                new MethodArgumentTypeMismatchException("abc", Long.class, "id", null, null);

        ResponseEntity<Map<String, Object>> resposta = handler.handleTipoInvalido(excecao);

        assertThat(resposta.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat((String) resposta.getBody().get("message")).contains("id");
    }

    @Test
    @DisplayName("exceção inesperada responde 500 sem vazar a mensagem interna")
    void erroInternoSemVazamento() {
        ResponseEntity<Map<String, Object>> resposta =
                handler.handleException(new RuntimeException("SQL: select * from usuarios; segredo"));

        assertThat(resposta.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
        String mensagem = (String) resposta.getBody().get("message");
        assertThat(mensagem).doesNotContain("SQL").doesNotContain("select").doesNotContain("segredo");
    }
}
