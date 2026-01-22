package com.examreg.examreg.service;

import com.examreg.examreg.dto.request.ChangePasswordFirstimeRequest;
import com.examreg.examreg.dto.request.UserLoginRequest;
import com.examreg.examreg.dto.response.AdminReponse;
import com.examreg.examreg.dto.response.AuthResponse;

public interface IAuthService {

  public AuthResponse<?> login(UserLoginRequest request);

  public AuthResponse<AdminReponse> refreshAccessToken(String refreshTokenValue);

  public void changePasswordFirstTime(Long studentId, ChangePasswordFirstimeRequest request);

  public void logout(String token);

  public void sendResetPasswordLink(String email);

  public void updatePassword(String token, String newPassword);
}
