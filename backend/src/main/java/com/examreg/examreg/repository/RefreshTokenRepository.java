package com.examreg.examreg.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.examreg.examreg.models.RefreshToken;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
  Optional<RefreshToken> findByToken(String token);

  Optional<RefreshToken> findByAdminId(Long adminId);

  boolean existsByToken(String token);

  @Modifying
  @Query("DELETE FROM RefreshToken rt WHERE rt.admin.id = :adminId")
  void deleteByAdminId(Long adminId);
}
