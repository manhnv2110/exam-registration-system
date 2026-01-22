package com.examreg.examreg.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.examreg.examreg.models.Exam;

public interface ExamRepository extends JpaRepository<Exam, Long> {

  Optional<Exam> findByExamCode(String examCode);

  Exam findByIsOpenTrue();

  @Modifying
  @Query(value = "DELETE FROM exam_subject WHERE exam_id = :examId", nativeQuery = true)
  void deleteExamSubjects(@Param("examId") Long examId);

  @Modifying
  @Query(value = "DELETE FROM exam_subject WHERE exam_id = :examId AND subject_id = :subjectId", nativeQuery = true)
  void deleteExamSubject(@Param("examId") Long examId, @Param("subjectId") Long subjectId);

  
  List<Exam> findAllByIsOpenTrue();

}
