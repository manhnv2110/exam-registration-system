package com.examreg.examreg.dto.response;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalTime;

import com.examreg.examreg.enums.ExamSessionStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class ExamSessionResponseForAdmin implements Serializable {

  private static final long serialVersionUID = 1L;

  private Long id;
  private LocalDate date;
  private LocalTime startTime;
  private int capacity;
  private boolean isFull;
  private int registeredCount;
  private Long subjectId;
  private String subjectCode;
  private String subjectName;
  private Long roomId;
  private String roomName;
  private Long locationId;
  private String locationName;
  private Long examId;
  private String examName;
  private SubjectStatusResponse subjectStatus;
  private ExamSessionStatus status;
}
