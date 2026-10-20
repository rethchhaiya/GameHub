package com.gamehub.backend.controllers;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.gamehub.backend.exception.EmailAlreadyExistsException;
import com.gamehub.backend.exception.GameAlreadyInLibraryException;
import com.gamehub.backend.exception.InvalidCredentialsException;
import com.gamehub.backend.exception.ResourceNotFoundException;

@RestControllerAdvice 
public class GlobalExceptionHandler {

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity <Map<String, String>> handleEmailAlreadyExists(
        EmailAlreadyExistsException exception){

            return ResponseEntity.status(HttpStatus.CONFLICT)
                                 .body(Map.of("message", exception.getMessage()));
        }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity <Map<String, Object>> handleValidationErrors(MethodArgumentNotValidException exception){
        Map<String, String> errors = new HashMap<>();

        exception.getBindingResult().getFieldErrors().forEach(error -> {
            errors.put(error.getField(), error.getDefaultMessage());
        });

        Map<String, Object> response = new HashMap<>();
        
        response.put("message", "ValidationFailed");
        response.put("error", errors);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity <Map<String, String>> handleInvalidCredentials(InvalidCredentialsException exception){

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                             .body(Map.of("message", exception.getMessage())); 
    }

    @ExceptionHandler(GameAlreadyInLibraryException.class)
    public ResponseEntity <Map<String, String>> handleGameAlreadyInLibrary(GameAlreadyInLibraryException exception){
        return ResponseEntity.status(HttpStatus.CONFLICT)
                             .body(Map.of("message", exception.getMessage()));
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity <Map<String, String>> handleResourceNotFound(ResourceNotFoundException exception){
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                             .body(Map.of("message", exception.getMessage()));
    } 

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity <Map<String, String>> handleIllegalArgument(IllegalArgumentException exception){
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body(Map.of("message", exception.getMessage()));
    }
}
