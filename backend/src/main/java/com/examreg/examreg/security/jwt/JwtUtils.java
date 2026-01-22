package com.examreg.examreg.security.jwt;

import java.util.Date;
import java.util.UUID;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import com.examreg.examreg.security.user.AppUserDetails;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtils {
  
  @Value("${auth.token.jwtSecret}")
  private String jwtSecret;

  @Value("${auth.token.expirationInMils}")
  private int expirationTime;

  public String generateTokenForUser(Authentication authentication) {
    AppUserDetails userPrincipal = (AppUserDetails) authentication.getPrincipal();
    String role = userPrincipal.getAuthority().toString();
    return Jwts.builder()
      .subject(userPrincipal.getEmail())
      .claim("id", userPrincipal.getId())
      .claim("role", role)
      .id(UUID.randomUUID().toString())
      .issuedAt(new Date())
      .expiration(new Date(System.currentTimeMillis() + expirationTime))
      .signWith(key(), Jwts.SIG.HS256)
      .compact();
  }

  public String generateTokenFromUserDetails(AppUserDetails userDetails) {
    return Jwts.builder()
      .subject(userDetails.getEmail())
      .claim("id", userDetails.getId())
      .claim("role", userDetails.getAuthority().getAuthority())
      .id(UUID.randomUUID().toString())
      .issuedAt(new Date())
      .expiration(new Date(System.currentTimeMillis() + expirationTime))
      .signWith(key(), Jwts.SIG.HS256)
      .compact();
  }

  private SecretKey key() {
    return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
  }

  public String getEmailFromToken(String token) {
    return Jwts.parser()
      .verifyWith(key())
      .build()
      .parseSignedClaims(token)
      .getPayload()
      .getSubject();
  }

  public boolean validatedToken(String token) {
    try {
      Jwts.parser().verifyWith(key()).build().parseSignedClaims(token);
      return true;
    } catch (JwtException | IllegalArgumentException e) {
      return false;
    }
  }

  public String getJtiFromToken(String token) {
    Claims claims = Jwts.parser()
      .verifyWith(key())
      .build()
      .parseSignedClaims(token)
      .getPayload();
    return claims.getId();
  }

  public Date getExpirationTimeFromToken(String token) {
    Claims claims = Jwts.parser()
      .verifyWith(key())
      .build()
      .parseSignedClaims(token)
      .getPayload();
    return claims.getExpiration();
  }
}
