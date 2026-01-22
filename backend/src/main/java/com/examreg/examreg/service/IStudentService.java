package com.examreg.examreg.service;
import java.util.List;

import com.examreg.examreg.dto.request.AddStudentRequest;
import com.examreg.examreg.dto.request.ChangePasswordRequest;
import com.examreg.examreg.dto.response.StudentResponse;
import com.examreg.examreg.models.Student;

public interface IStudentService {

  public Student getStudentById(Long id);

  public Student getStudentByStudentCode(String studentCode);

  public void changePassword(Long studentId, ChangePasswordRequest request);

  public void addStudent(AddStudentRequest request);

  public List<StudentResponse> getAllStudents();

  public StudentResponse updateStudent(Long id, AddStudentRequest request);

  public void deleteStudent(Long id);
}
