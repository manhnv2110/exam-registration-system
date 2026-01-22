package com.examreg.examreg.service;

import java.util.concurrent.CompletableFuture;

import org.springframework.web.multipart.MultipartFile;

public interface IImportLogService {

  // CompletableFuture<String> importStudentsFile(MultipartFile file);
  
  void importStudents(MultipartFile file);

  void importEligibleStudentsForSubject(MultipartFile file, Long examId);
}
