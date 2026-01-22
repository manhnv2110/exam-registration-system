package com.examreg.examreg.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.examreg.examreg.dto.response.ApiResponse;
import com.examreg.examreg.dto.response.ExamRegistrationResponse;
import com.examreg.examreg.dto.response.StudentRegistrationDetailResponse;
import com.examreg.examreg.dto.response.StudentRegistrationResponse;
import com.examreg.examreg.security.user.AppUserDetails;
import com.examreg.examreg.service.IExamRegistrationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/exam-registration")
public class ExamRegistrationController {
  
  private final IExamRegistrationService examRegistrationService;

  @GetMapping("/exam/{examId}")
  public ResponseEntity<ApiResponse<List<ExamRegistrationResponse>>> getAllExamRegistrations(
    @AuthenticationPrincipal AppUserDetails studenDetails,
    @PathVariable Long examId
  ) {
    List<ExamRegistrationResponse> response = examRegistrationService
      .getExamRegistrationResponses(studenDetails.getId(), examId);
    return ResponseEntity.ok(ApiResponse
      .success("Get exam registration successful",
      response));
  }

  @DeleteMapping("/{examRegistrationId}")
  public ResponseEntity<ApiResponse<?>> deleteExamRegistration(
    @AuthenticationPrincipal AppUserDetails studentDetails,
    @PathVariable Long examRegistrationId
  ) {
    examRegistrationService.deleteExamRegistration(examRegistrationId, studentDetails.getId());
    return ResponseEntity.ok(ApiResponse.success("Exam registration cancelled successfully"));
  }

  @GetMapping("/exam-session/{examSessionId}/students")
  public ResponseEntity<ApiResponse<List<StudentRegistrationResponse>>> getStudentsByExamSession(
    @PathVariable Long examSessionId
  ) {
    List<StudentRegistrationResponse> students = examRegistrationService.getStudentsByExamSession(examSessionId);
    return ResponseEntity.ok(ApiResponse.success("Get students by exam session successfully", students));
  }

  @GetMapping("/student/{studentId}")
  public ResponseEntity<ApiResponse<List<StudentRegistrationDetailResponse>>> getRegistrationsByStudentId(
    @PathVariable Long studentId
  ) {
    List<StudentRegistrationDetailResponse> registrations = examRegistrationService.getStudentRegistrationDetails(studentId);
    return ResponseEntity.ok(ApiResponse.success("Get student registrations successfully", registrations));
  }
}
