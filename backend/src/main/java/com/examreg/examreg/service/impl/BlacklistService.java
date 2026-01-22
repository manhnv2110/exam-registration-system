package com.examreg.examreg.service.impl;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import org.springframework.stereotype.Service;

import com.examreg.examreg.service.IBlacklistService;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;

@Service
public class BlacklistService implements IBlacklistService {

  // In-memory blacklist với expiration time
  private final ConcurrentHashMap<String, Long> blacklist = new ConcurrentHashMap<>();
  private ScheduledExecutorService scheduler;
  
  @PostConstruct
  public void init() {
    // Cleanup expired tokens mỗi 5 phút
    scheduler = Executors.newSingleThreadScheduledExecutor();
    scheduler.scheduleAtFixedRate(this::cleanupExpiredTokens, 5, 5, TimeUnit.MINUTES);
  }
  
  @PreDestroy
  public void destroy() {
    if (scheduler != null) {
      scheduler.shutdown();
    }
  }
  
  @Override
  public void addToBlacklist(String jti, Long expirationTimeMs) {
    long expiryTime = System.currentTimeMillis() + expirationTimeMs;
    blacklist.put(jti, expiryTime);
  }

  @Override
  public boolean isBlacklisted(String jti) {
    Long expiryTime = blacklist.get(jti);
    if (expiryTime == null) {
      return false;
    }
    // Kiểm tra token đã hết hạn chưa
    if (System.currentTimeMillis() > expiryTime) {
      blacklist.remove(jti);
      return false;
    }
    return true;
  }

  @Override
  public Long getBlacklistSize() {
    return (long) blacklist.size();
  }
  
  private void cleanupExpiredTokens() {
    long now = System.currentTimeMillis();
    blacklist.entrySet().removeIf(entry -> entry.getValue() < now);
  }
}
