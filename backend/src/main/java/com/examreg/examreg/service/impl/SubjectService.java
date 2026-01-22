package com.examreg.examreg.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.examreg.examreg.dto.request.SubjectRequest;
import com.examreg.examreg.dto.response.SubjectResponse;
import com.examreg.examreg.exceptions.ResourceNotFoundException;
import com.examreg.examreg.mapper.SubjectMapper;
import com.examreg.examreg.models.Exam;
import com.examreg.examreg.models.Subject;
import com.examreg.examreg.repository.ExamRegistrationRepository;
import com.examreg.examreg.repository.ExamSessionRepository;
import com.examreg.examreg.repository.StudentSubjectStatusRepository;
import com.examreg.examreg.repository.SubjectRepository;
import com.examreg.examreg.service.ISubjectService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SubjectService implements ISubjectService {

  private final SubjectRepository subjectRepository;
  private final SubjectMapper subjectMapper;
  private final ExamRegistrationRepository examRegistrationRepository;
  private final ExamSessionRepository examSessionRepository;
  private final StudentSubjectStatusRepository studentSubjectStatusRepository;

  @Override
  public Subject getSubjectById(Long subjectId) {
    return subjectRepository.findById(subjectId)
      .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + subjectId));
  }

  @Override
  public Subject getSubjectBySubjectCode(String subjectCode) {
    return subjectRepository.findBySubjectCode(subjectCode)
      .orElseThrow(() -> new ResourceNotFoundException("Subject not found: " + subjectCode));
  }

  @Override
  @Transactional
  @CacheEvict(value = "subjects", allEntries = true)
  public SubjectResponse createSubject(SubjectRequest subjectDTO) {
    Subject subject = new Subject();
    subject.setSubjectCode(subjectDTO.getSubjectCode());
    subject.setName(subjectDTO.getName());
    subject.setCreditHour(subjectDTO.getCreditHour());
    subject.setDuration(subjectDTO.getDuration());

    Subject savedSubject = subjectRepository.save(subject);
    return subjectMapper.buildSubjectResponse(savedSubject);
  }

  @Override
  @Transactional
  @Caching(evict = {
    @CacheEvict(value = "subjects", allEntries = true),
    @CacheEvict(value = "subjectsOfExam", allEntries = true)
  })
  public SubjectResponse updateSubject(Long id, SubjectRequest subjectDTO) {
    Subject subject = subjectRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + id));

    subject.setSubjectCode(subjectDTO.getSubjectCode());
    subject.setName(subjectDTO.getName());
    subject.setCreditHour(subjectDTO.getCreditHour());
    subject.setDuration(subjectDTO.getDuration());

    Subject updatedSubject = subjectRepository.save(subject);
    return subjectMapper.buildSubjectResponse(updatedSubject);
  }

  @Override
  @Transactional
  @Caching(evict = {
    @CacheEvict(value = "subjects", allEntries = true),
    @CacheEvict(value = "subjectsOfExam", allEntries = true)
  })
  public void deleteSubject(Long id) {
    Subject subject = subjectRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + id));
    for (Exam exam : subject.getExams()) {
        exam.getSubjects().remove(subject);
    }
    examRegistrationRepository.deleteBySubjectId(id);
    examSessionRepository.deleteBySubjectId(id);
    studentSubjectStatusRepository.deleteBySubject_Id(id);
    subject.getExams().clear();
    subjectRepository.delete(subject);
  }

  @Override
  @Cacheable("subjects")
  public List<SubjectResponse> getAllSubjects() {
    return subjectRepository.findAll().stream()
        .map(subjectMapper::buildSubjectResponse)
        .collect(Collectors.toList());
  }
}
