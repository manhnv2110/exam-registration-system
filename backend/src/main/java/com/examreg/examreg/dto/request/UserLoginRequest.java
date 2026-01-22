package com.examreg.examreg.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class UserLoginRequest {

  @NotBlank(message = "email must be not blank")
  private String email;

  @NotBlank(message = "password must be not blank")
  private String password;
}
