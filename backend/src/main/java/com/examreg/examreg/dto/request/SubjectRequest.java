package com.examreg.examreg.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubjectRequest {
  private String subjectCode;
  private String name;
  private int creditHour;
  private int duration;
}
