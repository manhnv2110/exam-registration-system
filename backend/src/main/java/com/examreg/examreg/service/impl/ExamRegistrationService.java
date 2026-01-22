package com.examreg.examreg.service.impl;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;

import com.examreg.examreg.dto.response.ExamRegistrationResponse;
import com.examreg.examreg.dto.response.StudentRegistrationDetailResponse;
import com.examreg.examreg.dto.response.StudentRegistrationResponse;
import com.examreg.examreg.dto.response.SubjectStatusResponse;
import com.examreg.examreg.enums.ExamSessionStatus;
import com.examreg.examreg.exceptions.ResourceNotFoundException;
import com.examreg.examreg.mapper.ExamRegistrationMapper;
import com.examreg.examreg.models.ExamRegistration;
import com.examreg.examreg.repository.ExamRegistrationRepository;
import com.examreg.examreg.service.IExamRegistrationService;
import com.examreg.examreg.service.IStudentSubjectStatusService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExamRegistrationService implements IExamRegistrationService {
  
  private final ExamRegistrationRepository examRegistrationRepository;
  private final ExamRegistrationMapper examRegistrationMapper;
  private final IStudentSubjectStatusService statusService;

  @Override
  public boolean existsByStudentIdAndExamSessionId(Long studentId, Long examSessionId) {
    return examRegistrationRepository.existsByStudentIdAndExamSessionId(studentId, examSessionId);
  }

  @Override
  public boolean existsByStudentIdAndExamSession_SubjectId_ExamId(Long studentId, Long subjectId, Long examId) {
    return examRegistrationRepository
      .existsByStudentIdAndExamSession_SubjectIdAndExamSession_ExamId(studentId, subjectId, examId);
  }

  @Override
  public int getRegisteredCount(Long examSessionId) {
    return examRegistrationRepository.countByExamSessionId(examSessionId);
  }

  @Override
  public List<ExamRegistration> getExamRegistrationsByStudentId(Long studentId, Long examId) {
    return examRegistrationRepository.findByStudentIdAndExamSession_ExamId(studentId, examId);
  }

  @Override
  @Cacheable(value = "examRegistrationResponses", key = "#studentId + '_' + #examId")
  public List<ExamRegistrationResponse> getExamRegistrationResponses(Long studentId, Long examId) {
    Map<Long, SubjectStatusResponse> statusMap = statusService
      .getSubjectStatusResponseByStudentIdAndExamId(studentId, examId)
      .stream()
      .collect(Collectors.toMap(s -> s.getSubject().getId(), Function.identity()));
    List<ExamRegistration> examRegistrations = getExamRegistrationsByStudentId(studentId, examId);
    return examRegistrations
      .stream()
      .map(e -> {
        ExamRegistrationResponse response = examRegistrationMapper.buildExamRegistrationResponse(e);
        response.getExamSession().setStatus(ExamSessionStatus.REGISTERED);
        SubjectStatusResponse ssRes = statusMap.get(e.getExamSession().getSubject().getId());
        response.getExamSession().setSubjectStatus(ssRes);
        return response;
      })
      .toList();
  }

  @Override
  // @CacheEvict(value = "examRegistrationResponses", allEntries = true)
  @Caching(evict = {
    @CacheEvict(value = "examRegistrationResponses", allEntries = true),
    @CacheEvict(value = "statusRegisterResponses", allEntries = true)
  })
  public void deleteExamRegistration(Long examRegistrationId, Long studentId) {
    boolean alreadyExamRegistration = examRegistrationRepository.existsByIdAndStudentId(examRegistrationId, studentId);
    if (alreadyExamRegistration) {
      examRegistrationRepository.deleteById(examRegistrationId);
    } else {
      throw new ResourceNotFoundException("ExamRegistration not found for this student");
    }
  }

  @Override
  public void saveExamRegistration(ExamRegistration examRegistration) {
    examRegistrationRepository.save(examRegistration);
  }

  @Override
  public List<StudentRegistrationResponse> getStudentsByExamSession(Long examSessionId) {
    List<ExamRegistration> registrations = examRegistrationRepository.findByExamSessionIdWithStudent(examSessionId);

    return registrations.stream().map(examRegistrationMapper::toStudentRegistrationResponse)
    .toList();
  }

  @Override
  public List<StudentRegistrationDetailResponse> getStudentRegistrationDetails(Long studentId) {
    List<ExamRegistration> registrations = examRegistrationRepository.findAllByStudentIdWithDetails(studentId);

    return registrations.stream().map(examRegistrationMapper::toStudentRegistrationDetailResponse).toList();
  }
}
