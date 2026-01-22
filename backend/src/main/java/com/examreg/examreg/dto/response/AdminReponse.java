package com.examreg.examreg.dto.response;

import com.examreg.examreg.enums.Role;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class AdminReponse {
  private Long id;
  private String email;
  private Role role;
}
