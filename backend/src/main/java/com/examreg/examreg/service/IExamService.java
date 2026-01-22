package com.examreg.examreg.service;
import com.examreg.examreg.dto.request.ExamRequest;
import com.examreg.examreg.dto.response.ExamResponse;
import com.examreg.examreg.dto.response.SubjectResponse;
import com.examreg.examreg.models.Exam;

import java.util.List;

public interface IExamService {
    ExamResponse createExam(ExamRequest request);

    List<ExamResponse> getAllExams();

    ExamResponse updateExam(Long id, ExamRequest request);

    void deleteExam(Long id);

    ExamResponse closeExam(Long id);

    ExamResponse openExam(Long id);

    Exam getExamById(Long id);

    Exam getExamByExamCode(String examCode);

    ExamResponse getExamIsOpen();

    void addSubjectsToExam(Long examId, List<Long> subjectIds);

    List<SubjectResponse> getSubjectsOfExam(Long examId);

    void deleteSubject(Long examId, Long subjectId);
}