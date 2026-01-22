package com.examreg.examreg.service;

public interface IBlacklistService {
  
  public void addToBlacklist(String jti, Long expirationTimeMs);

  public boolean isBlacklisted(String jti);

  public Long getBlacklistSize();
}
