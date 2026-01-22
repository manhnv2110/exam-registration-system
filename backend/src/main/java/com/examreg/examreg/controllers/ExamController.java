package com.examreg.examreg.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.examreg.examreg.dto.request.ExamRequest;
import com.examreg.examreg.dto.response.ApiResponse;
import com.examreg.examreg.dto.response.ExamResponse;
import com.examreg.examreg.dto.response.SubjectResponse;
import com.examreg.examreg.service.IExamService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/exams")
public class ExamController {
    private final IExamService examService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/add")
    public ResponseEntity<ApiResponse<ExamResponse>> createExam(
            @RequestBody @Valid ExamRequest request) {

        ExamResponse response = examService.createExam(request);

        return ResponseEntity.ok(
                ApiResponse.success("Exam created successfully", response)
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ExamResponse>>> getAllExams() {
        List<ExamResponse> exams = examService.getAllExams();
        
        return ResponseEntity.ok(
                ApiResponse.success("Exams retrieved successfully", exams)
        );
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ExamResponse>> updateExam(
            @PathVariable Long id,
            @RequestBody @Valid ExamRequest request) {
        
        ExamResponse response = examService.updateExam(id, request);
        
        return ResponseEntity.ok(
                ApiResponse.success("Exam updated successfully", response)
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteExam(@PathVariable Long id) {
        examService.deleteExam(id);
        
        return ResponseEntity.ok(
                ApiResponse.success("Exam deleted successfully", null)
        );
    }

    @PutMapping("/{id}/close")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ExamResponse>> closeExam(@PathVariable Long id) {
        ExamResponse response = examService.closeExam(id);
        
        return ResponseEntity.ok(
                ApiResponse.success("Exam closed successfully", response)
        );
    }

    @PutMapping("/{id}/open")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ExamResponse>> openExam(@PathVariable Long id) {
        ExamResponse response = examService.openExam(id);
        
        return ResponseEntity.ok(
                ApiResponse.success("Exam opened successfully", response)
        );
    }

    @GetMapping("/is-open")
    public ResponseEntity<ApiResponse<ExamResponse>> getExamIsOpen() {
        ExamResponse response = examService.getExamIsOpen();
        return ResponseEntity.ok(
                ApiResponse.success("Get Exam open successfully", response)
        );
    }

    @PostMapping("/{examId}/subjects")
    public ResponseEntity<ApiResponse<?>> addSubjectsToExam(
        @PathVariable Long examId,
        @RequestBody List<Long> subjectIds
    ) {
        examService.addSubjectsToExam(examId, subjectIds);
        return ResponseEntity.ok(ApiResponse.success("Add subjects to exam successful"));
    }

    @GetMapping("/{examId}/subjects")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<List<SubjectResponse>>> getSubjectsOfExam(
        @PathVariable Long examId
    ) {
        List<SubjectResponse> subjects = examService.getSubjectsOfExam(examId);
        return ResponseEntity.ok(ApiResponse.success("Subjects retrieved successfully", subjects));
    }

    @DeleteMapping("/{examId}/subjects/{subjectId}")
    public ResponseEntity<ApiResponse<Void>> deleteSubject(
        @PathVariable Long examId,
        @PathVariable Long subjectId
    ) {
        examService.deleteSubject(examId, subjectId);
        return ResponseEntity.ok(ApiResponse.success("Delete subject successfully", null));
    }
}
