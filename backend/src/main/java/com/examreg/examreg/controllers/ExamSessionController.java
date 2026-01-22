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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.examreg.examreg.dto.request.CreateExamSessionRequest;
import com.examreg.examreg.dto.request.UpdateExamSessionRequest;
import com.examreg.examreg.dto.response.ApiResponse;
import com.examreg.examreg.dto.response.ExamSessionResponseForAdmin;
import com.examreg.examreg.dto.response.ExamSessionResponseForStudent;
import com.examreg.examreg.security.user.AppUserDetails;
import com.examreg.examreg.service.IExamSessionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/exam-sessions")
public class ExamSessionController {
  
  private final IExamSessionService examSessionService;

  @GetMapping("/exam/{examId}")
  @PreAuthorize("hasRole('STUDENT')")
  public ResponseEntity<ApiResponse<List<ExamSessionResponseForStudent>>> getAllExamSessions(
    @AuthenticationPrincipal AppUserDetails studenDetails,
    @PathVariable Long examId
  ) {
    List<ExamSessionResponseForStudent> response = examSessionService.getExamSessionResponses(studenDetails.getId(), examId);
    return ResponseEntity.ok(ApiResponse
      .success("Get examsessions successful",
      response));
  }

  @GetMapping("/by-subject/{subjectId}/by-exam/{examId}")
  @PreAuthorize("hasRole('STUDENT')")
  public ResponseEntity<ApiResponse<List<ExamSessionResponseForStudent>>> getExamSessionsBySubjectId(
    @AuthenticationPrincipal AppUserDetails studenDetails,
    @PathVariable Long subjectId,
    @PathVariable Long examId
  ) {
    List<ExamSessionResponseForStudent> response = examSessionService
      .getExamSessionResponsesBySubjectId(studenDetails.getId(), subjectId, examId);
    return ResponseEntity.ok(ApiResponse
      .success("Get examsessions by subject successful",
      response));
  }

  @PostMapping("/{examSessionId}/register")
  @PreAuthorize("hasRole('STUDENT')")
  public ResponseEntity<ApiResponse<?>> registerExamSession(
    @AuthenticationPrincipal AppUserDetails studentDetails,
    @PathVariable Long examSessionId
  ) {
    examSessionService.registerExamSession(examSessionId, studentDetails.getId());
    return ResponseEntity.ok(ApiResponse.success("Registered successfully"));
  }

  @PreAuthorize("hasRole('ADMIN')")
  @PostMapping("/create")
  public ResponseEntity<ApiResponse<ExamSessionResponseForAdmin>> createExamSession(
    @RequestBody @Valid CreateExamSessionRequest request
  ) {
    ExamSessionResponseForAdmin response = examSessionService.createExamSession(request);
    return ResponseEntity.ok(ApiResponse.success("Exam session created successfully", response));
  }

  @PreAuthorize("hasRole('ADMIN')")
  @GetMapping
  public ResponseEntity<ApiResponse<List<ExamSessionResponseForAdmin>>> getExamSessionsBySubjectAndExam(
    @RequestParam Long subjectId,
    @RequestParam Long examId
  ) {
    List<ExamSessionResponseForAdmin> sessions = examSessionService.getExamSessionsBySubjectAndExam(subjectId, examId);
    return ResponseEntity.ok(ApiResponse.success("Get exam sessions successfully", sessions));
  }  

  @PreAuthorize("hasRole('ADMIN')")
  @PutMapping("/{id}")
  public ResponseEntity<ApiResponse<ExamSessionResponseForAdmin>> updateExamSession(
    @PathVariable Long id,
    @RequestBody @Valid UpdateExamSessionRequest request) {
      ExamSessionResponseForAdmin response = examSessionService.updateExamSession(id, request);
      return ResponseEntity.ok(ApiResponse.success("Exam Session updated sucessfully",response));
  }

  @DeleteMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<ApiResponse<Void>> deleteExamSession(@PathVariable Long id) {
      examSessionService.deleteExamSession(id);
      return ResponseEntity.ok(
              ApiResponse.success("Exam session deleted successfully", null)
      );
  }

}
