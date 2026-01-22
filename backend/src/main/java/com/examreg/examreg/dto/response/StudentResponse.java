package com.examreg.examreg.dto.response;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.examreg.examreg.enums.Gender;
import com.examreg.examreg.enums.Role;
import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class StudentResponse implements Serializable {

  private static final long serialVersionUID = 1L;

  private Long id;
  private String email;
  private String studentCode;
  private String fullname;
  private Gender gender;
  private String className;
  private String major;
  private String faculty;
  private Role role;
  @JsonFormat(pattern = "dd/MM/yyyy")
  private LocalDate dob;
  private String phone;
  private boolean firstLogin;
  private LocalDateTime loginLockedUntil;
}
