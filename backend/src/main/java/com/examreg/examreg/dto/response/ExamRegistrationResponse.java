package com.examreg.examreg.dto.response;

import java.io.Serializable;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class ExamRegistrationResponse implements Serializable {

  private static final long serialVersionUID = 1L;

  private Long id;
  private Long studentId;
  private LocalDateTime registeredAt;
  private ExamSessionResponseForStudent examSession;
}
