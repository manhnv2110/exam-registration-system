package com.examreg.examreg.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportStatsDTO {
    private Long examId;
    private String examName;
    private Long totalStudents;
    private Long eligibleStudents;
    private Long ineligibleStudents;
    private Long finishedRegistrationCount;
    private Long totalSubjects;
    private Long totalExamSessions;
}
