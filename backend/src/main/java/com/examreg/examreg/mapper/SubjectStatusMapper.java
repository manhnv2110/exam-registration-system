package com.examreg.examreg.mapper;

import java.util.List;

import org.springframework.stereotype.Component;

import com.examreg.examreg.dto.response.SubjectStatusResponse;
import com.examreg.examreg.models.StudentSubjectStatus;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class SubjectStatusMapper {

  private final SubjectMapper subjectMapper;

  public SubjectStatusResponse buildSubjectStatusReponse(StudentSubjectStatus ssStatus) {
    return SubjectStatusResponse.builder()
      .id(ssStatus.getId())
      .status(ssStatus.getStatus())
      .subject(subjectMapper.buildSubjectResponse(ssStatus.getSubject()))
      .examId(ssStatus.getExam().getId())
      .build();
  } 
  
  public List<SubjectStatusResponse> buildSubjectStatusReponsesList(List<StudentSubjectStatus> ssStatus) {
    return ssStatus.stream()
      .map(this::buildSubjectStatusReponse)
      .toList();
  }
}
