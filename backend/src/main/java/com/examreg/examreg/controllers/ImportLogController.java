package com.examreg.examreg.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.examreg.examreg.dto.response.ApiResponse;
import com.examreg.examreg.service.IImportLogService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/import")
public class ImportLogController {
  
  private final IImportLogService importLogService;

  @PostMapping("/students")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<ApiResponse<?>> importStudentAccounts(@RequestParam MultipartFile file) {
    importLogService.importStudents(file);
    return ResponseEntity.ok(ApiResponse.success("Import student accounts successful"));
  }

  @PostMapping("/exam/{examId}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<ApiResponse<?>> importEligibleStudentsForSubject(
    @PathVariable Long examId,
    @RequestParam MultipartFile file
  ) {
    importLogService.importEligibleStudentsForSubject(file, examId);
    return ResponseEntity.ok(ApiResponse.success("Import student subject status successful"));
  }
}
