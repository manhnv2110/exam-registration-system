package com.examreg.examreg.dto.response;
import java.io.Serializable;
import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class ExamResponse implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;
    private String examName;
    private LocalDate startDate;
    private LocalDate endDate;
    private String description;
    private String examSatus;
    private boolean isOpen;
    private int totalSubjects;
    private int totalSessions;
    private int totalRegistrations;
}