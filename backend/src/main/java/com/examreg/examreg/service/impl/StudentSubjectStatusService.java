package com.examreg.examreg.service.impl;

import java.util.List;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.examreg.examreg.dto.request.AddStudentSubjectStatusRequest;
import com.examreg.examreg.dto.response.ConditionResponse;
import com.examreg.examreg.dto.response.SubjectStatusResponse;
import com.examreg.examreg.mapper.ConditionMapper;
import com.examreg.examreg.mapper.SubjectStatusMapper;
import com.examreg.examreg.models.Exam;
import com.examreg.examreg.models.Student;
import com.examreg.examreg.models.StudentSubjectStatus;
import com.examreg.examreg.models.Subject;
import com.examreg.examreg.repository.StudentSubjectStatusRepository;
import com.examreg.examreg.service.IExamService;
import com.examreg.examreg.service.IStudentService;
import com.examreg.examreg.service.IStudentSubjectStatusService;
import com.examreg.examreg.service.ISubjectService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StudentSubjectStatusService implements IStudentSubjectStatusService {
  
  private final StudentSubjectStatusRepository statusRepository;
  private final SubjectStatusMapper statusMapper;
  private final ConditionMapper conditionMapper;
  private final IStudentService studentService;
  private final ISubjectService subjectService;
  private final IExamService examService;

  @Override
  public List<StudentSubjectStatus> getStudentSubjectStatusByStudentIdAndExamId(Long studentId, Long examId) {
    return statusRepository.findAllByStudent_IdAndExam_Id(studentId, examId);
  }

  @Override
  public List<SubjectStatusResponse> getSubjectStatusResponseByStudentIdAndExamId(Long studentId, Long examId) {
    return statusRepository.findAllByStudent_IdAndExam_Id(studentId, examId)
      .stream()
      .map(statusMapper::buildSubjectStatusReponse)
      .toList();
  }

  @Override
  public void addStudentSubjectStatus(AddStudentSubjectStatusRequest request) {
    Student student = studentService.getStudentByStudentCode(request.getStudentCode());
    Subject subject = subjectService.getSubjectBySubjectCode(request.getSubjectCode());
    Exam exam = examService.getExamById(request.getExamId());
    
    // Check if record exists, update it instead of throwing error
    StudentSubjectStatus ssStatus = statusRepository.findByStudentAndSubjectAndExam(student, subject, exam)
      .orElse(StudentSubjectStatus.builder()
        .student(student)
        .subject(subject)
        .exam(exam)
        .build());
    
    // Update status and reason
    ssStatus.setStatus(request.getStatus());
    ssStatus.setReason(request.getReason());
    
    statusRepository.save(ssStatus);
  }

  @Override
  @Cacheable(value = "studentsCondition", key = "#examId + '_' + #subjectId")
  public List<ConditionResponse> getStudentsCondition(Long examId, Long subjectId) {
    List<StudentSubjectStatus> ssStatus = statusRepository.findByExam_IdAndSubject_Id(examId, subjectId);
    return ssStatus.stream()
      .map(conditionMapper::buildConditionResponse)
      .toList();
  }
}
