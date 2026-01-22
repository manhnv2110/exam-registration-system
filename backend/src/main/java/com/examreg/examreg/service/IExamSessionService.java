package com.examreg.examreg.service;

import java.util.List;

import com.examreg.examreg.dto.response.ExamSessionResponseForAdmin;
import com.examreg.examreg.dto.response.ExamSessionResponseForStudent;
import com.examreg.examreg.dto.response.SubjectStatusResponse;
import com.examreg.examreg.dto.request.CreateExamSessionRequest;
import com.examreg.examreg.dto.request.UpdateExamSessionRequest;

public interface IExamSessionService {
  public List<ExamSessionResponseForStudent> getExamSessionResponses(Long studentId, Long examId);

  public List<ExamSessionResponseForStudent> getExamSessionResponsesBySubjectId(Long studentId, Long subjectId, Long examId);

  public void registerExamSession(Long examSessionId, Long studentId);

  public List<SubjectStatusResponse> getStatusRegisterResponses(Long studentId, Long examId);

  ExamSessionResponseForAdmin createExamSession(CreateExamSessionRequest request);

  List<ExamSessionResponseForAdmin> getExamSessionsBySubjectAndExam(Long subjectId, Long examId);

  ExamSessionResponseForAdmin updateExamSession(Long id, UpdateExamSessionRequest request);

  void deleteExamSession(Long id);
}
