package com.examreg.examreg.exceptions;

public class RegistrationClosedException extends RuntimeException {
  public RegistrationClosedException(String message) {
    super(message);
  }
}
