package com.examreg.examreg.mapper;

import org.springframework.stereotype.Component;

import com.examreg.examreg.dto.response.ExamResponse;
import com.examreg.examreg.models.Exam;

@Component
public class ExamMapper {
    public ExamResponse buildExamResponse(Exam exam) {
        return ExamResponse.builder()
            .id(exam.getId())
            .examName(exam.getExamName())
            .startDate(exam.getStartDate())
            .endDate(exam.getEndDate())
            .examSatus(exam.getExamStatus())
            .description(exam.getDescription())
            .isOpen(exam.isOpen())
            .totalSubjects(0)
            .totalSessions(0)
            .totalRegistrations(0)
            .build();
    }
}