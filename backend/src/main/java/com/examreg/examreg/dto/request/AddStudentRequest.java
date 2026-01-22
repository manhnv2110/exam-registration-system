package com.examreg.examreg.dto.request;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

import com.examreg.examreg.enums.Gender;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class AddStudentRequest {
    @NotBlank(message = "Student code is required")
    private String code;

    @NotBlank(message = "Student name is required")
    private String name;

    @NotNull(message = "Gender is required")
    private Gender gender;

    @NotNull(message = "Date of birth is required")
    private LocalDate dob;

    @NotBlank(message = "Class is required")
    private String className;

    @NotBlank(message = "Phone number is required")
    private String phone;

    @NotBlank(message = "Major is required")
    private String major;

    @NotBlank(message = "faculty is required")
    private String faculty;

    @NotBlank(message = "email is required")
    private String email;
}
