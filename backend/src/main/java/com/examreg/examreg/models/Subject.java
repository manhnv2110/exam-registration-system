package com.examreg.examreg.models;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import lombok.Data;

@Data
@Entity
public class Subject {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String subjectCode;

  private String name;

  private int creditHour;

  private int duration;

  @ManyToMany(mappedBy = "subjects")
  private List<Exam> exams;

  @OneToMany(mappedBy = "subject")
  private List<StudentSubjectStatus> studentSubjects;

  @OneToMany(mappedBy = "subject")
  private List<ExamSession> examSessions;
}