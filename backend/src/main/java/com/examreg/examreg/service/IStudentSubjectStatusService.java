package com.examreg.examreg.service;

import java.util.List;

import com.examreg.examreg.dto.request.AddStudentSubjectStatusRequest;
import com.examreg.examreg.dto.response.ConditionResponse;
import com.examreg.examreg.dto.response.SubjectStatusResponse;
import com.examreg.examreg.models.StudentSubjectStatus;

public interface IStudentSubjectStatusService {
  public List<StudentSubjectStatus> getStudentSubjectStatusByStudentIdAndExamId(Long studentId, Long examId);

  public List<SubjectStatusResponse> getSubjectStatusResponseByStudentIdAndExamId(Long studentId, Long examId);

  public void addStudentSubjectStatus(AddStudentSubjectStatusRequest request);

  public List<ConditionResponse> getStudentsCondition(Long examId, Long subjectId);
}
