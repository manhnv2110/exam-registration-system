package com.examreg.examreg.service.impl;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.examreg.examreg.dto.request.ChangePasswordFirstimeRequest;
import com.examreg.examreg.dto.request.UserLoginRequest;
import com.examreg.examreg.dto.response.AdminReponse;
import com.examreg.examreg.dto.response.AuthResponse;
import com.examreg.examreg.dto.response.StudentResponse;
import com.examreg.examreg.exceptions.BadRequestException;
import com.examreg.examreg.exceptions.ResourceNotFoundException;
import com.examreg.examreg.mapper.AdminMapper;
import com.examreg.examreg.mapper.StudentMapper;
import com.examreg.examreg.models.Admin;
import com.examreg.examreg.models.PasswordResetToken;
import com.examreg.examreg.models.RefreshToken;
import com.examreg.examreg.models.Student;
import com.examreg.examreg.repository.AdminRepository;
import com.examreg.examreg.repository.ResetTokenRepository;
import com.examreg.examreg.repository.StudentRepository;
import com.examreg.examreg.security.jwt.JwtUtils;
import com.examreg.examreg.security.user.AppUserDetails;
import com.examreg.examreg.service.IAuthService;
import com.examreg.examreg.service.IBlacklistService;
import com.examreg.examreg.service.IEmailService;
import com.examreg.examreg.service.IRefreshTokenService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService implements IAuthService {

  private final AuthenticationManager authenticationManager;
  private final JwtUtils jwtUtils;
  private final StudentRepository studentRepository;
  private final AdminRepository adminRepositoty;
  private final StudentMapper studentMapper;
  private final AdminMapper adminMapper;
  private final PasswordEncoder passwordEncoder;
  private final IBlacklistService blacklistService;
  private final ResetTokenRepository resetTokenRepository;
  private final IEmailService emailService;
  private final IRefreshTokenService refreshTokenService;

  @Value("${frontend.url}")
  private String frontendUrl;

  @Override
  public AuthResponse<?> login(UserLoginRequest request) {
    Authentication authentication = authenticationManager
      .authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
    SecurityContextHolder.getContext().setAuthentication(authentication);
    AppUserDetails userDetails = (AppUserDetails) authentication.getPrincipal();
    String role = userDetails.getAuthority().getAuthority();

    String token = jwtUtils.generateTokenForUser(authentication);
    if ("ROLE_STUDENT".equals(role)) {
      Student student = studentRepository.findById(userDetails.getId())
        .orElseThrow(() -> new ResourceNotFoundException("Student not found: " + userDetails.getId()));
        if (student.getLoginLockedUntil() != null && 
          LocalDateTime.now().isBefore(student.getLoginLockedUntil())
        ) {
          long minutes = Duration
            .between(LocalDateTime.now(), student.getLoginLockedUntil())
            .toMinutes();
          
          throw new RuntimeException(String.format("Bạn phải đợi %d phút nữa mới được đăng nhập lại", minutes));
        }
        if (student.getLoginLockedUntil() != null && 
          LocalDateTime.now().isAfter(student.getLoginLockedUntil())
        ) {
          student.setLoginLockedUntil(null);
          studentRepository.save(student);
        }
      StudentResponse studentResponse = studentMapper.buildStudentReponse(student);
      return AuthResponse.<StudentResponse>builder()
        .token(token)
        .user(studentResponse)
        .build();
    } else if ("ROLE_ADMIN".equals(role)) {
      Admin admin = adminRepositoty.findById(userDetails.getId())
        .orElseThrow(() -> new ResourceNotFoundException("Admin not found: " + userDetails.getId()));
      String refreshToken = refreshTokenService.createRefreshToken(admin.getId()).getToken();
      AdminReponse adminReponse = adminMapper.buildAdminReponse(admin);
      return AuthResponse.<AdminReponse>builder()
        .token(token)
        .refreshToken(refreshToken)
        .user(adminReponse)
        .build();
    } else {
      throw new IllegalStateException("Unknown role: " + role);
    }
  }

  @Override
  public AuthResponse<AdminReponse> refreshAccessToken(String refreshTokenValue) {
    RefreshToken rt = refreshTokenService.verifyRefreshToken(refreshTokenValue);
    Admin admin = rt.getAdmin();
    AppUserDetails userDetails = AppUserDetails.buildUserDetails(admin);
    String newAccessToken = jwtUtils.generateTokenFromUserDetails(userDetails);
    AdminReponse adminReponse = adminMapper.buildAdminReponse(admin);
    return AuthResponse.<AdminReponse>builder()
      .token(newAccessToken)
      .refreshToken(refreshTokenValue)
      .user(adminReponse)
      .build();
  }

  @Override
  public void changePasswordFirstTime(Long studentId, ChangePasswordFirstimeRequest request) {

    Student student = studentRepository.findById(studentId)
      .orElseThrow(() -> new ResourceNotFoundException("Student not found: " + studentId));
    
    if (student.isFirstLogin()) {
      student.setPassword(passwordEncoder.encode(request.getPassword()));
      student.setFirstLogin(false);
      studentRepository.save(student);
    } else {
      throw new IllegalStateException("Password change not allowed: user has already logged in before");
    }
    
  }

  @Override
  public void logout(String token) {
    String jti = jwtUtils.getJtiFromToken(token);
    Date expirationDate = jwtUtils.getExpirationTimeFromToken(token);

    long remainingMs = expirationDate.getTime() - System.currentTimeMillis();

    if (remainingMs > 0) {
      blacklistService.addToBlacklist(jti, remainingMs);
    }

    AppUserDetails userDetails = (AppUserDetails)SecurityContextHolder
      .getContext()
      .getAuthentication()
      .getPrincipal();

    if ("ROLE_ADMIN".equals(userDetails.getAuthority().getAuthority())) {
      refreshTokenService.deleteByAdminId(userDetails.getId());
    }
    
    if ("ROLE_STUDENT".equals(userDetails.getAuthority().getAuthority())) {
      Student student= studentRepository.findById(userDetails.getId())
        .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
      
      student.setLoginLockedUntil(LocalDateTime.now().plusMinutes(20));
      studentRepository.save(student);
    }
  }

  @Override
  public void sendResetPasswordLink(String email) {
    Student student = studentRepository.findByEmail(email)
      .orElse(null);
    Admin admin = adminRepositoty.findByEmail(email)
      .orElse(null);
    if (student == null && admin == null) {
      throw new BadRequestException("Email không tồn tại");
    }
    String token = UUID.randomUUID().toString();
    String hashedToken = passwordEncoder.encode(token);
    PasswordResetToken entity = PasswordResetToken.builder()
      .student(student)
      .admin(admin)
      .token(hashedToken)
      .expiryDate(LocalDateTime.now().plusMinutes(15))
      .build();
    resetTokenRepository.save(entity);
    String[] frontendUrls = frontendUrl.split(",");
    String emailContent = buildEmailContent(frontendUrls, token);
    emailService.send(email, "ExamReg: Reset your password", emailContent);
  }

  private String buildEmailContent(String[] frontendUrls, String token) {
  StringBuilder links = new StringBuilder();

  for (String url : frontendUrls) {
    String link = url.trim() + "/login?token=" + token;
    links.append("""
      <p>
        <a href="%s" target="_self">%s</a>
      </p>
    """.formatted(link, link));
  }

  return """
    <h2>Reset your password</h2>
    <p>Chọn đường dẫn dưới đây để đổi mật khẩu:</p>
    %s
  """.formatted(links.toString());
}


  @Override
  public void updatePassword(String token, String newPassword) {
    PasswordResetToken resetToken = resetTokenRepository.findAll()
      .stream()
      .filter(t -> passwordEncoder.matches(token, t.getToken()))
      .findFirst()
      .orElseThrow(() -> new BadRequestException("Invalid reset token"));
    if (resetToken.getStudent() != null) {
      Student student = resetToken.getStudent();
      student.setPassword(passwordEncoder.encode(newPassword));
      studentRepository.save(student);
    } else {
      Admin admin = resetToken.getAdmin();
      admin.setPassword(passwordEncoder.encode(newPassword));
      adminRepositoty.save(admin);
    }
    resetTokenRepository.delete(resetToken);
  }
  
}
