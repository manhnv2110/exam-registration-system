package com.examreg.examreg.service;

public interface IEmailService {
  
  public void send(String to, String subject, String content);
}
