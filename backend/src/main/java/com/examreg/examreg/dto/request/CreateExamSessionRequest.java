
package com.examreg.examreg.dto.request;

import java.time.LocalDate;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateExamSessionRequest {
    @NotNull(message = "Exam date is required")
    private LocalDate date;

    @NotBlank(message = "Start time is required")
    private String startTime; // Format: "HH:mm"

    @NotNull(message = "Room ID is required")
    private Long roomId;

    @NotNull(message = "Subject ID is required")
    private Long subjectId;

    @NotNull(message = "Exam ID is required")
    private Long examId;

    @NotNull(message = "Capacity is required")
    @Min(value = 1, message = "Capacity must be at least 1")
    private Integer capacity;
}
