package com.examreg.examreg.mapper;

import org.springframework.stereotype.Component;

import com.examreg.examreg.dto.response.AdminReponse;
import com.examreg.examreg.models.Admin;

@Component
public class AdminMapper {
  public AdminReponse buildAdminReponse(Admin admin) {
    return AdminReponse.builder()
      .id(admin.getId())
      .email(admin.getEmail())
      .role(admin.getRole())
      .build();
  }
}
