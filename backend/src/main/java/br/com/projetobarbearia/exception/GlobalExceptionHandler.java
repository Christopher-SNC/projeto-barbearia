package br.com.projetobarbearia.exception;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

        @ExceptionHandler(IllegalArgumentException.class)
        public ResponseEntity<Map<String, String>> tratarIllegalArgumentException(
                        IllegalArgumentException exception) {

                Map<String, String> resposta = Map.of(
                                "erro",
                                exception.getMessage());

                return ResponseEntity
                                .status(HttpStatus.BAD_REQUEST)
                                .body(resposta);
        }

        @ExceptionHandler(AuthenticationException.class)
        public ResponseEntity<Map<String, String>> tratarAuthenticationException(
                        AuthenticationException exception) {

                Map<String, String> resposta = Map.of(
                                "erro",
                                "E-mail ou senha inválidos.");

                return ResponseEntity
                                .status(HttpStatus.UNAUTHORIZED)
                                .body(resposta);
        }

        @ExceptionHandler(AccessDeniedException.class)
        public ResponseEntity<Map<String, String>> tratarAccessDeniedException(
                        AccessDeniedException exception) {

                Map<String, String> resposta = Map.of(
                                "erro",
                                "Acesso negado.");

                return ResponseEntity
                                .status(HttpStatus.FORBIDDEN)
                                .body(resposta);
        }
}