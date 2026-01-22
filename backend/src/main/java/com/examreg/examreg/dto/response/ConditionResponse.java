package com.examreg.examreg.dto.response;

import java.io.Serializable;

import com.examreg.examreg.enums.EligibilityStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class ConditionResponse implements Serializable {

  private static final long serialVersionUID = 1L;

  private Long studentId;
  private String studentCode;
  private String fullname;
  private EligibilityStatus status;
  private String reason;
  private Long subjectId;
  private Long examId;
}
