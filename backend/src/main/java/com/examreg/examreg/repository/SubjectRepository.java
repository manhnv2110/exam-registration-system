package com.examreg.examreg.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.examreg.examreg.models.Subject;

public interface SubjectRepository extends JpaRepository<Subject, Long> {

  Optional<Subject> findBySubjectCode(String subjectCode);

  @Query("SELECT s FROM Subject s JOIN s.exams e WHERE e.id = :examId")
  List<Subject> findByExamId(Long examId);
}
