package com.examreg.examreg.service.impl;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.examreg.examreg.dto.ReportStatsDTO;
import com.examreg.examreg.enums.EligibilityStatus;
import com.examreg.examreg.exceptions.ResourceNotFoundException;
import com.examreg.examreg.models.Exam;
import com.examreg.examreg.repository.ExamRepository;
import com.examreg.examreg.repository.StudentSubjectStatusRepository;
import com.examreg.examreg.repository.ExamRegistrationRepository;
import com.examreg.examreg.service.IReportService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ReportService implements IReportService {

        private final ExamRepository examRepository;
        private final StudentSubjectStatusRepository studentSubjectStatusRepository;
        private final ExamRegistrationRepository examRegistrationRepository;

    @Override
    public ReportStatsDTO getReportStatsByExam(Long examId) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found with id: " + examId));

        // Count students by eligibility status for this exam
        Long eligibleCount = studentSubjectStatusRepository.countBySubject_ExamIdAndStatus(examId, EligibilityStatus.ELIGIBLE);
        Long ineligibleCount = studentSubjectStatusRepository.countBySubject_ExamIdAndStatus(examId, EligibilityStatus.INELIGIBLE);
        Long totalCount = eligibleCount + ineligibleCount;

        // Count students who finished registration for this exam
        Long finishedRegistrationCount = examRegistrationRepository.countByExamSession_ExamId(examId);
        
        // Count subjects for this exam
        Long subjectCount = (long) exam.getSubjects().size();
        
        // Count exam sessions for this exam
        Long examSessionCount = exam.getSubjects().stream()
                .mapToLong(subject -> subject.getExamSessions().size())
                .sum();

        return ReportStatsDTO.builder()
                .examId(exam.getId())
                .examName(exam.getExamName())
                .totalStudents(totalCount)
                .eligibleStudents(eligibleCount)
                .ineligibleStudents(ineligibleCount)
                .finishedRegistrationCount(finishedRegistrationCount)
                .totalSubjects(subjectCount)
                .totalExamSessions(examSessionCount)
                .build();
    }
}
