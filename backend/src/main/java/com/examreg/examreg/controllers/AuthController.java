package com.examreg.examreg.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.examreg.examreg.dto.request.ChangePasswordFirstimeRequest;
import com.examreg.examreg.dto.request.RefreshTokenRequest;
import com.examreg.examreg.dto.request.ResetPasswordRequest;
import com.examreg.examreg.dto.request.UserLoginRequest;
import com.examreg.examreg.dto.response.AdminReponse;
import com.examreg.examreg.dto.response.ApiResponse;
import com.examreg.examreg.dto.response.AuthResponse;
import com.examreg.examreg.security.user.AppUserDetails;
import com.examreg.examreg.service.IAuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/auth")
public class AuthController {

  private final IAuthService authService;

  
  @PostMapping("/login")
  public ResponseEntity<ApiResponse<AuthResponse<?>>> login(@RequestBody @Valid UserLoginRequest request) {
    AuthResponse<?> authResponse = authService.login(request);
    return ResponseEntity.ok(ApiResponse.success("Login successful", authResponse));
  }

  @PostMapping("/refresh")
  public ResponseEntity<ApiResponse<AuthResponse<AdminReponse>>> refreshToken(@RequestBody RefreshTokenRequest request) {
    AuthResponse<AdminReponse> authResponse = authService.refreshAccessToken(request.getRefreshToken());
    return ResponseEntity.ok(ApiResponse.success("Refresh token successful", authResponse));
  }

  @PostMapping("/change-password-first-time")
  public ResponseEntity<ApiResponse<?>> changePasswordFirstTime(
    @AuthenticationPrincipal AppUserDetails studentDetails,
    @RequestBody @Valid ChangePasswordFirstimeRequest request
  ) {
    authService.changePasswordFirstTime(studentDetails.getId(), request);
    return ResponseEntity.ok(ApiResponse.success("Password changed successfully"));
  }

  @PostMapping("/logout")
  public ResponseEntity<ApiResponse<?>> logout(@RequestHeader("Authorization") String authHeader) {
    String token = authHeader.substring(7);
    authService.logout(token);
    return ResponseEntity.ok(ApiResponse.success("Logout successful"));
  }

  @PostMapping("/forgot-password")
  public ResponseEntity<ApiResponse<?>> forgotPassword(@RequestParam String email) {
    authService.sendResetPasswordLink(email);
    return ResponseEntity.ok(ApiResponse.success("Reset link has been sent!"));
  }

  //forgot password
  @PostMapping("/reset-password")
  public ResponseEntity<ApiResponse<?>> changePassword(@RequestBody ResetPasswordRequest request) {
    authService.updatePassword(request.getToken(), request.getNewPassword());
    return ResponseEntity.ok(ApiResponse.success("Password has been updated successfully"));
  }
}
