package com.examreg.examreg.mapper;

import org.springframework.stereotype.Component;

import com.examreg.examreg.dto.response.ConditionResponse;
import com.examreg.examreg.models.Student;
import com.examreg.examreg.models.StudentSubjectStatus;

@Component
public class ConditionMapper {
  public ConditionResponse buildConditionResponse(StudentSubjectStatus ssStatus) {
    Student student = ssStatus.getStudent();
    return ConditionResponse.builder()
      .studentId(student.getId())
      .studentCode(student.getStudentCode())
      .fullname(student.getFullname())
      .status(ssStatus.getStatus())
      .reason(ssStatus.getReason())
      .subjectId(ssStatus.getSubject().getId())
      .examId(ssStatus.getExam().getId())
      .build();
  }
}
