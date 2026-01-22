package com.examreg.examreg.service;

import java.util.List;

import com.examreg.examreg.dto.response.ExamRegistrationResponse;
import com.examreg.examreg.dto.response.StudentRegistrationDetailResponse;
import com.examreg.examreg.dto.response.StudentRegistrationResponse;
import com.examreg.examreg.models.ExamRegistration;

public interface IExamRegistrationService {

  public boolean existsByStudentIdAndExamSessionId(Long studentId, Long examSessionId);

  public boolean existsByStudentIdAndExamSession_SubjectId_ExamId(Long studentId, Long subjectId, Long examId);

  public int getRegisteredCount(Long examSessionId);

  public List<ExamRegistration> getExamRegistrationsByStudentId(Long studentId, Long examId);

  public List<ExamRegistrationResponse> getExamRegistrationResponses(Long studentId, Long examId);

  public void deleteExamRegistration(Long examRegistrationId, Long studentId);

  public void saveExamRegistration(ExamRegistration examRegistration);

  List<StudentRegistrationResponse> getStudentsByExamSession(Long examSessionId);

  List<StudentRegistrationDetailResponse> getStudentRegistrationDetails(Long studentId);
}
