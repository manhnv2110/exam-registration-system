package com.examreg.examreg.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.examreg.examreg.dto.request.AddStudentRequest;
import com.examreg.examreg.dto.request.ChangePasswordRequest;
import com.examreg.examreg.dto.response.StudentResponse;
import com.examreg.examreg.exceptions.BadRequestException;
import com.examreg.examreg.exceptions.ResourceNotFoundException;
import com.examreg.examreg.mapper.StudentMapper;
import com.examreg.examreg.models.Student;
import com.examreg.examreg.repository.ExamRegistrationRepository;
import com.examreg.examreg.repository.ResetTokenRepository;
import com.examreg.examreg.repository.StudentRepository;
import com.examreg.examreg.repository.StudentSubjectStatusRepository;
import com.examreg.examreg.service.IStudentService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StudentService implements IStudentService{
  
  private final StudentRepository studentRepository;
  private final PasswordEncoder passwordEncoder;
  private final StudentMapper studentMapper;
  private final ExamRegistrationRepository examRegistrationRepository;
  private final StudentSubjectStatusRepository studentSubjectStatusRepository;
  private final ResetTokenRepository resetTokenRepository;

  @Override
  public Student getStudentById(Long id) {
    return studentRepository.findById(id)
      .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
  }

  @Override
  public Student getStudentByStudentCode(String studentCode) {
    return studentRepository.findByStudentCode(studentCode)
      .orElseThrow(() -> new ResourceNotFoundException("Student not found with code: " + studentCode));
  }

  @Override
  public void changePassword(Long studentId, ChangePasswordRequest request) {
    Student student = getStudentById(studentId);
    if (!passwordEncoder.matches(request.getCurrentPassword(), student.getPassword())) {
      throw new BadRequestException("Current password is incorrect");
    }
    student.setPassword(passwordEncoder.encode(request.getNewPassword()));
    studentRepository.save(student);
  }
  
  @Override
  @CacheEvict(value = "students", allEntries = true)
  public void addStudent(AddStudentRequest request) {
    if (studentRepository.existsByStudentCode(request.getCode())) {
      throw new BadRequestException("Đã tồn tại học sinh với mã sinh viên: " + request.getCode());
    }
    String defaultPassword = request.getEmail().substring(0, request.getEmail().indexOf("@"));

    Student student = new Student();
    student.setStudentCode(request.getCode());
    student.setFullname(request.getName());
    student.setGender(request.getGender());
    student.setDob(request.getDob());
    student.setClassName(request.getClassName());
    student.setPhone(request.getPhone());
    student.setMajor(request.getMajor());
    student.setFaculty(request.getFaculty());
    student.setEmail(request.getEmail());
    student.setPassword(passwordEncoder.encode(defaultPassword));
    student.setFirstLogin(true);

    studentRepository.save(student);
  }

  @Override
  @Cacheable(value = "students")
  public List<StudentResponse> getAllStudents() {
    List<Student> students = studentRepository.findAll();
    return students.stream().map(studentMapper::buildStudentReponse).collect(Collectors.toList());
  }

  @Override
  @Transactional
  @Caching(evict = {
    @CacheEvict(value = "students", allEntries = true),
    @CacheEvict(value = "studentsCondition", allEntries = true)
  })
  public StudentResponse updateStudent(Long id, AddStudentRequest request) {
    Student student = studentRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Student not found with id: " + id));
    student.setStudentCode(request.getCode());
    student.setFullname(request.getName());
    student.setGender(request.getGender());
    student.setDob(request.getDob());
    student.setClassName(request.getClassName());
    student.setPhone(request.getPhone());
    student.setMajor(request.getMajor());
    student.setFaculty(request.getFaculty());
    student.setEmail(request.getEmail());

    Student updatedStudent = studentRepository.save(student);
    return studentMapper.buildStudentReponse(updatedStudent);
  }

  @Override
  @Caching(evict = {
    @CacheEvict(value = "students", allEntries = true),
    @CacheEvict(value = "studentsCondition", allEntries = true)
  })
  public void deleteStudent(Long id) {
    Student student = studentRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
    
    resetTokenRepository.deleteByStudent_Id(id);
    studentSubjectStatusRepository.deleteByStudent_Id(id);
    examRegistrationRepository.deleteByStudent_Id(id);
    studentRepository.delete(student);
  }
}
