package com.examreg.examreg.models;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.examreg.examreg.enums.Gender;
import com.examreg.examreg.enums.Role;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
@Entity
public class Student extends User{

  public Student() {
    this.setRole(Role.STUDENT);
  }

  @Column(nullable = false)
  private String studentCode;

  @Column(nullable = false)
  private String fullname;

  @Enumerated(EnumType.STRING)
  private Gender gender;

  private String className;
  
  private String phone;

  private String major;

  private LocalDate dob;

  private String faculty;

  private boolean firstLogin = true;

  private LocalDateTime loginLockedUntil;

  @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<RegistrationSession> registrationSessions;

  @OneToMany(mappedBy = "student")
  private List<StudentSubjectStatus> studentSubjects;

  @OneToMany(mappedBy = "student")
  private List<ExamRegistration> examRegistrations;
}
