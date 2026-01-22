package com.examreg.examreg.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ChangePasswordRequest {

  @NotBlank(message = "currentPassword must be not blank")
  private String currentPassword;

  @NotBlank(message = "newPassword must be not blank")
  @Size(min = 8, message = "Password must be at least 8 characters")
  private String newPassword;
}
