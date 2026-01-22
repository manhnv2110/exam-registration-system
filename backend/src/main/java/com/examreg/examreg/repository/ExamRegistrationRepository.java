package com.examreg.examreg.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.examreg.examreg.models.ExamRegistration;

public interface ExamRegistrationRepository extends JpaRepository<ExamRegistration, Long> {

  int countByExamSessionId(Long examSessionId);

  List<ExamRegistration> findByStudentId(Long studentId);

  boolean existsByStudentIdAndExamSessionId(Long studentId, Long examSessionId);

  boolean existsByIdAndStudentId(Long examRegistrationId, Long studentId);

  List<ExamRegistration> findByStudentIdAndExamSession_ExamId(Long studentId, Long examId);

  boolean existsByStudentIdAndExamSession_SubjectIdAndExamSession_ExamId(Long studentId, Long subjectId, Long examId);

  List<ExamRegistration> findByExamSessionId(Long examSessionId);

  long countByExamSession_ExamId(Long examId);

  @Query("SELECT er FROM ExamRegistration er " +
        "JOIN FETCH er.student s " +
        "WHERE er.examSession.id = :examSessionId " +
        "ORDER BY er.registeredAt ASC")
  List<ExamRegistration> findByExamSessionIdWithStudent(@Param("examSessionId") Long examSessionId);

  @Query("SELECT er FROM ExamRegistration er " +
         "JOIN FETCH er.examSession es " +
         "JOIN FETCH es.subject s " +
         "WHERE er.student.id = :studentId " +
         "ORDER BY es.date ASC, es.startTime ASC")
  List<ExamRegistration> findAllByStudentIdWithDetails(@Param("studentId") Long studentId);
  void deleteByExamSessionId(Long examSessionId);
  
  @Modifying
  @Query(value = """
      DELETE er FROM exam_registration er
      JOIN exam_session es ON er.exam_session_id = es.id
      WHERE es.exam_id = :examId
  """, nativeQuery = true)
  void deleteByExamId(@Param("examId") Long examId);

  @Modifying
  @Query(value = """
      DELETE er
      FROM exam_registration er
      JOIN exam_session es ON er.exam_session_id = es.id
      WHERE es.exam_id = :examId
        AND es.subject_id = :subjectId
  """, nativeQuery = true)
  void deleteByExamIdAndSubjectId(@Param("examId") Long examId,
                                @Param("subjectId") Long subjectId);

  @Modifying
  @Transactional
  void deleteByStudent_Id(Long studentId);
  
  @Modifying
  @Query(value = """
      DELETE er
      FROM exam_registration er
      JOIN exam_session es ON er.exam_session_id = es.id
      WHERE es.subject_id = :subjectId
  """, nativeQuery = true)
  void deleteBySubjectId(@Param("subjectId") Long subjectId);
  
}
