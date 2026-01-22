package com.examreg.examreg.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.examreg.examreg.models.ExamSession;

import jakarta.persistence.LockModeType;
import org.springframework.data.repository.query.Param;

public interface ExamSessionRepository extends JpaRepository<ExamSession, Long> {

  List<ExamSession> findAllBySubjectIdIn(List<Long> subjectIds);
  int countByExamId(Long examId);

  @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query("SELECT e FROM ExamSession e WHERE e.id = :id")
  ExamSession findByIdForUpdate(Long id);

  List<ExamSession> findBySubjectIdAndExamId(Long subjectId, Long examId);
  
  @Modifying
  @Query(value = "DELETE FROM exam_session WHERE exam_id = :examId", nativeQuery = true)
  void deleteByExamId(@Param("examId") Long examId);

  @Modifying
  @Query(value = """
      DELETE FROM exam_session
      WHERE exam_id = :examId
        AND subject_id = :subjectId
  """, nativeQuery = true)
  void deleteByExamIdAndSubjectId(@Param("examId") Long examId,
                                 @Param("subjectId") Long subjectId);
  @Modifying
  @Query(value = "DELETE FROM exam_session WHERE subject_id = :subjectId", nativeQuery = true)
  void deleteBySubjectId(@Param("subjectId") Long subjectId);                               
}
