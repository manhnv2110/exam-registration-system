package com.examreg.examreg.mapper;

import java.util.List;

import org.springframework.stereotype.Component;

import com.examreg.examreg.dto.response.ExamSessionResponseForAdmin;
import com.examreg.examreg.enums.ExamSessionStatus;
import com.examreg.examreg.models.ExamSession;
import com.examreg.examreg.models.StudentSubjectStatus;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ExamSessionMapperForAdmin {

  private final SubjectStatusMapper statusMapper;

  public ExamSessionResponseForAdmin buildExamSessionResponse(ExamSession examSession) {
    return ExamSessionResponseForAdmin.builder()
      .id(examSession.getId())
      .date(examSession.getDate())
      .capacity(examSession.getCapacity())
      .startTime(examSession.getStartTime())
      .registeredCount(examSession.getRegisteredCount())
      .isFull(examSession.isFull())
      .subjectId(examSession.getSubject().getId())
      .subjectCode(examSession.getSubject().getSubjectCode())
      .subjectName(examSession.getSubject().getName())
      .roomId(examSession.getRoom().getId())
      .roomName(examSession.getRoom().getName())
      .locationId(examSession.getRoom().getLocation().getId())
      .locationName(examSession.getRoom().getLocation().getName())
      .examId(examSession.getExam().getId())
      .examName(examSession.getExam().getExamName())
      .build();
  }

  public ExamSessionResponseForAdmin buildExamSessionResponse(
    ExamSession examSession, 
    int registeredCount, 
    ExamSessionStatus status
  ) {
    ExamSessionResponseForAdmin response = buildExamSessionResponse(examSession);
    response.setRegisteredCount(registeredCount);
    response.setStatus(status);
    return response;
  }

  public List<ExamSessionResponseForAdmin> buildExamSessionResponsesList(List<ExamSession> examSessions) {
    return examSessions.stream().map(this::buildExamSessionResponse).toList();
  }

  public ExamSessionResponseForAdmin buildExamSessionResponse(ExamSession examSession, StudentSubjectStatus ssStatus) {
    ExamSessionResponseForAdmin response = buildExamSessionResponse(examSession);
    response.setSubjectStatus(statusMapper.buildSubjectStatusReponse(ssStatus));
    return response;
  }
}
