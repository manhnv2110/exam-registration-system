package com.examreg.examreg.dto.request;

import com.examreg.examreg.enums.EligibilityStatus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class AddStudentSubjectStatusRequest {

  @NotBlank(message = "studentCode must be not blank")
  private String studentCode;

  @NotBlank(message = "subjectCode must be not blank")
  private String subjectCode;

  @NotNull(message = "status must be not null")
  private EligibilityStatus status;

  @NotNull(message = "examId must be not null")
  private Long examId;

  private String reason;
}
