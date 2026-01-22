package com.examreg.examreg.exceptions;

import java.util.Date;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.examreg.examreg.dto.response.ErrorResponse;

import jakarta.servlet.http.HttpServletRequest;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(RuntimeException.class)
  public ResponseEntity<ErrorResponse> handleRuntimeException(RuntimeException e, HttpServletRequest request) {
    ErrorResponse error = ErrorResponse.builder()
        .timestamp(new Date(System.currentTimeMillis()))
        .status(HttpStatus.BAD_REQUEST.value())
        .path(request.getRequestURI())
        .error("Runtime error")
        .message(e.getMessage())
        .build();
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
  }

  @ExceptionHandler(UsernameNotFoundException.class)
  public ResponseEntity<ErrorResponse> handleUsernameNotFoundException(UsernameNotFoundException e, HttpServletRequest request) {
    ErrorResponse error = ErrorResponse.builder()
        .timestamp(new Date(System.currentTimeMillis()))
        .status(HttpStatus.NOT_FOUND.value())
        .path(request.getRequestURI())
        .error("User not found")
        .message(e.getMessage())
        .build();
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
  }

  @ExceptionHandler(BadRequestException.class)
  public ResponseEntity<ErrorResponse> handleBadRequestException(BadRequestException e, HttpServletRequest request) {
    ErrorResponse error = ErrorResponse.builder()
        .timestamp(new Date(System.currentTimeMillis()))
        .status(HttpStatus.BAD_REQUEST.value())
        .path(request.getRequestURI())
        .error("Bad request")
        .message(e.getMessage())
        .build();
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
  }

  @ExceptionHandler(ResourceNotFoundException.class)
  public ResponseEntity<ErrorResponse> handleResourceNotFoundException(ResourceNotFoundException e, HttpServletRequest request) {
    ErrorResponse error = ErrorResponse.builder()
        .timestamp(new Date(System.currentTimeMillis()))
        .status(HttpStatus.NOT_FOUND.value())
        .path(request.getRequestURI())
        .error("Not found")
        .message(e.getMessage())
        .build();
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
  }

  @ExceptionHandler(IllegalStateException.class)
  public ResponseEntity<ErrorResponse> handleIllegalStateException(IllegalStateException e, HttpServletRequest request) {
    ErrorResponse error = ErrorResponse.builder()
        .timestamp(new Date(System.currentTimeMillis()))
        .status(HttpStatus.BAD_REQUEST.value())
        .path(request.getRequestURI())
        .error("Bad request")
        .message(e.getMessage())
        .build();
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ErrorResponse> handleValidationException(MethodArgumentNotValidException e,
      HttpServletRequest request) {
    String message = e.getBindingResult().getFieldErrors().stream()
        .map(fieldError -> fieldError.getField() + ": " + fieldError.getDefaultMessage())
        .collect(Collectors.joining(", "));
    ErrorResponse error = ErrorResponse.builder()
        .timestamp(new Date(System.currentTimeMillis()))
        .status(HttpStatus.BAD_REQUEST.value())
        .path(request.getRequestURI())
        .error("Validation error")
        .message(message)
        .build();
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
  }

  @ExceptionHandler(BadCredentialsException.class)
  public ResponseEntity<ErrorResponse> handleBadCredentailsException(BadCredentialsException e,
      HttpServletRequest request) {
    ErrorResponse error = ErrorResponse.builder()
        .timestamp(new Date(System.currentTimeMillis()))
        .status(HttpStatus.UNAUTHORIZED.value())
        .path(request.getRequestURI())
        .error("Unauthorized")
        .message("Tài khoản hoặc mật khẩu không đúng")
        .build();
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
  }

  @ExceptionHandler(RegistrationClosedException.class)
  public ResponseEntity<ErrorResponse> handleRegistrationClosedException(RegistrationClosedException e, 
      HttpServletRequest request) {
    ErrorResponse error = ErrorResponse.builder()
        .timestamp(new Date(System.currentTimeMillis()))
        .status(HttpStatus.UNAUTHORIZED.value())
        .path(request.getRequestURI())
        .error("Conflict")
        .message(e.getMessage())
        .build();
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
  }
}
