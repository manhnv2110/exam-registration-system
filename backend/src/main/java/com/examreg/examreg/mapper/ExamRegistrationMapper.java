package com.examreg.examreg.mapper;

import org.springframework.stereotype.Component;

import com.examreg.examreg.dto.response.ExamRegistrationResponse;
import com.examreg.examreg.dto.response.ExamSessionResponseForStudent;
import com.examreg.examreg.dto.response.StudentRegistrationDetailResponse;
import com.examreg.examreg.dto.response.StudentRegistrationResponse;
import com.examreg.examreg.models.ExamRegistration;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ExamRegistrationMapper {

  private final ExamSessionMapperForStudent examSessionMapper;

  public ExamRegistrationResponse buildExamRegistrationResponse(ExamRegistration examRegistration) {

    ExamSessionResponseForStudent examSessionResponse = examSessionMapper
      .buildExamSessionResponse(examRegistration.getExamSession());

    return ExamRegistrationResponse.builder()
      .id(examRegistration.getId())
      .studentId(examRegistration.getStudent().getId())
      .registeredAt(examRegistration.getRegisteredAt())
      .examSession(examSessionResponse)
      .build();
  }

  public StudentRegistrationResponse toStudentRegistrationResponse(ExamRegistration examRegistration) {
    if (examRegistration == null || examRegistration.getStudent() == null) {
      return null;
    }

    return StudentRegistrationResponse.builder()
      .id(examRegistration.getId())
      .studentCode(examRegistration.getStudent().getStudentCode())
      .fullName(examRegistration.getStudent().getFullname())
      .email(examRegistration.getStudent().getEmail())
      .phone(examRegistration.getStudent().getPhone())
      .registeredAt(examRegistration.getRegisteredAt())
      .build();
  }

  public StudentRegistrationDetailResponse toStudentRegistrationDetailResponse(ExamRegistration examRegistration) {
    if (examRegistration == null) {
      return null;
    }
    return StudentRegistrationDetailResponse.builder()
      .registrationId(examRegistration.getId())
      .subjectId(examRegistration.getExamSession().getSubject().getId())
      .subjectName(examRegistration.getExamSession().getSubject().getName())
      .subjectCode(examRegistration.getExamSession().getSubject().getSubjectCode())
      .examSessionId(examRegistration.getExamSession().getId())
      .examSessionDate(examRegistration.getExamSession().getDate())
      .examSessionTime(examRegistration.getExamSession().getStartTime())
      .room(examRegistration.getExamSession().getRoom().getName())
      .location(examRegistration.getExamSession().getRoom().getLocation().getName())
      .build();
  }
}
