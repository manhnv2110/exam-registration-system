package com.examreg.examreg.service.impl;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.examreg.examreg.exceptions.BadRequestException;
import com.examreg.examreg.exceptions.ResourceNotFoundException;
import com.examreg.examreg.models.Admin;
import com.examreg.examreg.models.RefreshToken;
import com.examreg.examreg.repository.AdminRepository;
import com.examreg.examreg.repository.RefreshTokenRepository;
import com.examreg.examreg.service.IRefreshTokenService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RefreshTokenService implements IRefreshTokenService {

  @Value("${auth.refresh-token.expirationInMils}")
  private Long refreshTokenExpiration;

  private final RefreshTokenRepository refreshTokenRepository;
  private final AdminRepository adminRepository;

  @Override
  @Transactional
  public RefreshToken createRefreshToken(Long adminId) {
    Admin admin = adminRepository.findById(adminId)
      .orElseThrow(() -> new ResourceNotFoundException("Admin không tồn tại: " + adminId));
    
    refreshTokenRepository.deleteByAdminId(adminId);

    RefreshToken refreshToken = RefreshToken.builder()
      .admin(admin)
      .token(UUID.randomUUID().toString())
      .expiryDate(Instant.now().plusMillis(refreshTokenExpiration))
      .revoked(false)
      .createdAt(Instant.now())
      .build();
    
    return refreshTokenRepository.save(refreshToken);
  }

  @Override
  public RefreshToken verifyRefreshToken(String token) {
    RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
      .orElseThrow(() -> new ResourceNotFoundException("Refresh token không hợp lệ hoặc không tồn tại"));
    
    if (refreshToken.getRevoked()) {
      throw new BadRequestException("Refresh token đã bị thu hồi");
    } else if (refreshToken.getExpiryDate().isBefore(Instant.now())) {
      refreshTokenRepository.delete(refreshToken);
      throw new BadRequestException("Refresh token đã hết hạn. Vui lòng đăng nhập lại");
    }
    return refreshToken;
  }

  @Override
  public void revokeToken(String token) {
    refreshTokenRepository.findByToken(token).ifPresent(rt -> {
      rt.setRevoked(true);
      refreshTokenRepository.save(rt);
    });
  }

  @Override
  public Optional<RefreshToken> getByToken(String token) {
    return refreshTokenRepository.findByToken(token);
  }

  @Override
  @Transactional
  public void deleteByAdminId(Long adminId) {
    refreshTokenRepository.deleteByAdminId(adminId);
  }
  
}
