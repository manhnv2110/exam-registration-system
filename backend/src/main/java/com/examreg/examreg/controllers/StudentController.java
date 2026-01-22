package com.examreg.examreg.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.examreg.examreg.dto.request.AddStudentRequest;
import com.examreg.examreg.dto.request.ChangePasswordRequest;
import com.examreg.examreg.dto.response.ApiResponse;
import com.examreg.examreg.dto.response.StudentResponse;
import com.examreg.examreg.security.user.AppUserDetails;
import com.examreg.examreg.service.IStudentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/student")
public class StudentController {
  
  private final IStudentService studentService;

  @PostMapping("/change-password")
  @PreAuthorize("hasRole('STUDENT')")
  public ResponseEntity<ApiResponse<?>> changePassword(
    @AuthenticationPrincipal AppUserDetails studentDetails,
    @RequestBody @Valid ChangePasswordRequest request
  ) {
    studentService.changePassword(studentDetails.getId(), request);
    return ResponseEntity.ok(ApiResponse.success("Password changed successfully"));
  }

  @PostMapping("/add")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<ApiResponse<?>> addStudent(
    @RequestBody @Valid AddStudentRequest request
  ) {
    studentService.addStudent(request);
    return ResponseEntity.ok(
      ApiResponse.success("Student created successfully")
      );
    }

  @GetMapping("/all")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<ApiResponse<List<StudentResponse>>> getAllStuduent() {
    List<StudentResponse> students = studentService.getAllStudents();
    return ResponseEntity.ok(ApiResponse.success("Get all students successfully", students));
  }

  @PutMapping("/update/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<ApiResponse<StudentResponse>> updateStudent(
    @PathVariable Long id,
    @RequestBody  @Valid AddStudentRequest request) {
      StudentResponse response = studentService.updateStudent(id, request);

      return ResponseEntity.ok(ApiResponse.success("Student updated successfully", response));
    }

  @DeleteMapping("/delete/{id}")
  public ResponseEntity<ApiResponse<?>> deleteStudent(@PathVariable Long id) {
    studentService.deleteStudent(id);
    return ResponseEntity.ok(ApiResponse.success("Student deleted successfully"));
  }
}
