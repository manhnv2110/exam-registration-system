package com.examreg.examreg.mapper;

import java.util.List;

import org.springframework.stereotype.Component;

import com.examreg.examreg.dto.response.ExamSessionResponseForStudent;
import com.examreg.examreg.enums.ExamSessionStatus;
import com.examreg.examreg.models.ExamSession;
import com.examreg.examreg.models.StudentSubjectStatus;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ExamSessionMapperForStudent {

  private final RoomMapper roomMapper;
  private final SubjectStatusMapper statusMapper;

  public ExamSessionResponseForStudent buildExamSessionResponse(ExamSession examSession) {
    return ExamSessionResponseForStudent.builder()
      .id(examSession.getId())
      .date(examSession.getDate())
      .capacity(examSession.getCapacity())
      .startTime(examSession.getStartTime())
      .room(roomMapper.buildRoomResponse(examSession.getRoom()))
      .build();
  }

  public ExamSessionResponseForStudent buildExamSessionResponse(
    ExamSession examSession, 
    int registeredCount, 
    ExamSessionStatus status
  ) {
    ExamSessionResponseForStudent response = buildExamSessionResponse(examSession);
    response.setRegisteredCount(registeredCount);
    response.setStatus(status);
    return response;
  }

  public List<ExamSessionResponseForStudent> buildExamSessionResponsesList(List<ExamSession> examSessions) {
    return examSessions.stream().map(this::buildExamSessionResponse).toList();
  }

  public ExamSessionResponseForStudent buildExamSessionResponse(ExamSession examSession, StudentSubjectStatus ssStatus) {
    ExamSessionResponseForStudent response = buildExamSessionResponse(examSession);
    response.setSubjectStatus(statusMapper.buildSubjectStatusReponse(ssStatus));
    return response;
  }
}