package com.examreg.examreg.dto.response;

import java.io.Serializable;

import com.examreg.examreg.enums.EligibilityStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class SubjectStatusResponse implements Serializable {

  private static final long serialVersionUID = 1L;

  private Long id;
  private EligibilityStatus status;
  private SubjectResponse subject;
  private boolean registered; //dung cho page home
  private Long examId;
}
