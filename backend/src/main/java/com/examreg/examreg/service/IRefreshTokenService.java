package com.examreg.examreg.service;

import java.util.Optional;

import com.examreg.examreg.models.RefreshToken;

public interface IRefreshTokenService {
  
  public RefreshToken createRefreshToken(Long adminId);

  public RefreshToken verifyRefreshToken(String token);

  public Optional<RefreshToken> getByToken(String token);

  public void revokeToken(String token);

  public void deleteByAdminId(Long adminId);

}
