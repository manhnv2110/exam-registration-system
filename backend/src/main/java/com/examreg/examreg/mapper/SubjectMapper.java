package com.examreg.examreg.mapper;

import org.springframework.stereotype.Component;

import com.examreg.examreg.dto.response.SubjectResponse;
import com.examreg.examreg.models.Subject;

@Component
public class SubjectMapper {
  
  public SubjectResponse buildSubjectResponse(Subject subject) {
    return SubjectResponse.builder()
      .id(subject.getId())
      .name(subject.getName())
      .subjectCode(subject.getSubjectCode())
      .creditHour(subject.getCreditHour())
      .duration(subject.getDuration())
      .build();
  }
}
