package com.examreg.examreg.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.examreg.examreg.dto.request.SubjectRequest;
import com.examreg.examreg.dto.response.ApiResponse;
import com.examreg.examreg.dto.response.SubjectResponse;
import com.examreg.examreg.mapper.SubjectMapper;
import com.examreg.examreg.service.ISubjectService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("${api.prefix}/subjects")
@RequiredArgsConstructor
public class SubjectController {

  private final ISubjectService subjectService;
  private final SubjectMapper subjectMapper;

  @PostMapping
  public ResponseEntity<ApiResponse<SubjectResponse>> createSubject(@RequestBody SubjectRequest subjectDTO) {
    SubjectResponse createdSubject = subjectService.createSubject(subjectDTO);
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(ApiResponse.success("Subject created successfully", createdSubject));
  }

  @PutMapping("/{id}")
  public ResponseEntity<ApiResponse<SubjectResponse>> updateSubject(
      @PathVariable Long id,
      @RequestBody SubjectRequest subjectDTO) {
    SubjectResponse updatedSubject = subjectService.updateSubject(id, subjectDTO);
    return ResponseEntity.ok(ApiResponse.success("Subject updated successfully", updatedSubject));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<ApiResponse<Void>> deleteSubject(@PathVariable Long id) {
    subjectService.deleteSubject(id);
    return ResponseEntity.ok(ApiResponse.success("Subject deleted successfully", null));
  }

  @GetMapping("/{id}")
  public ResponseEntity<ApiResponse<SubjectResponse>> getSubjectById(@PathVariable Long id) {
    SubjectResponse subject = subjectMapper.buildSubjectResponse(subjectService.getSubjectById(id));
    return ResponseEntity.ok(ApiResponse.success("Subject retrieved successfully", subject));
  }

  @GetMapping
  public ResponseEntity<ApiResponse<List<SubjectResponse>>> getAllSubjects() {
    List<SubjectResponse> subjects = subjectService.getAllSubjects();
    return ResponseEntity.ok(ApiResponse.success("Subjects retrieved successfully", subjects));
  }
}
