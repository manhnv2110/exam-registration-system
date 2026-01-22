package com.examreg.examreg.service.impl;

import java.io.InputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.examreg.examreg.dto.request.AddStudentRequest;
import com.examreg.examreg.dto.request.AddStudentSubjectStatusRequest;
import com.examreg.examreg.enums.EligibilityStatus;
import com.examreg.examreg.enums.Gender;
import com.examreg.examreg.service.IExamService;
import com.examreg.examreg.service.IImportLogService;
import com.examreg.examreg.service.IStudentService;
import com.examreg.examreg.service.IStudentSubjectStatusService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ImportLogService implements IImportLogService {

  private final IStudentService studentService;
  private final IStudentSubjectStatusService statusService;
  private final IExamService examService;

  // @Override
  // @Async("fileStudentExecutor")
  // public CompletableFuture<String> importStudentsFile(MultipartFile file) {
  //   try {
  //     List<AddStudentRequest> studentRequests = excelToStudentRequest(file.getInputStream());
  //     for (AddStudentRequest student : studentRequests) {
  //       studentService.addStudent(student);
  //     }
  //   } catch (Exception e) {
  //     throw new RuntimeException("Không thể đọc file excel " + file.getOriginalFilename() + ": " + e.getMessage(), e);
  //   }
  //   return CompletableFuture.completedFuture("DONE");
  // }

  @Override
  public void importStudents(MultipartFile file) {
    try {
      List<AddStudentRequest> studentRequests = excelToStudentRequest(file.getInputStream());
      for (AddStudentRequest student : studentRequests) {
        studentService.addStudent(student);
      }
    } catch (Exception e) {
      throw new RuntimeException("Không thể đọc file excel " + file.getOriginalFilename() + ": " + e.getMessage(), e);
    }
  }

  private List<AddStudentRequest> excelToStudentRequest(InputStream is) {
    try (Workbook workbook = new XSSFWorkbook(is)) {
      Sheet sheet = workbook.getSheet("student");
      if (sheet == null) {
        throw new RuntimeException("Sheet 'student' không tồn tại");
      }
      List<AddStudentRequest> studentRequests = new ArrayList<>();
      for (Row row : sheet) {
        if (row.getRowNum() == 0 || row == null || row.getCell(0) == null)
          continue;
        if ("STT".equalsIgnoreCase(row.getCell(0).toString().trim()))
          continue;

        try {
          Gender gender = row
            .getCell(7)
            .getStringCellValue()
            .equalsIgnoreCase("Nam") ? Gender.MALE : Gender.FEMALE;
          
          DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
          LocalDate dob = LocalDate.parse(row.getCell(8).getStringCellValue(), formatter);

          AddStudentRequest student = AddStudentRequest.builder()
            .code(row.getCell(1).getStringCellValue())
            .name(row.getCell(2).getStringCellValue())
            .email(row.getCell(3).getStringCellValue())
            .className(row.getCell(4).getStringCellValue())
            .major(row.getCell(5).getStringCellValue())
            .faculty(row.getCell(6).getStringCellValue())
            .gender(gender)
            .dob(dob)
            .phone(row.getCell(9).getStringCellValue())
            .build();
          
          studentRequests.add(student);
        } catch (Exception e) {
          throw new RuntimeException("Lỗi đọc dữ liệu tại dòng " + row.getRowNum() + " " + e.getMessage());
        }
      }
      return studentRequests;
    } catch (Exception e) {
      throw new RuntimeException("Không thể parse workbook hoặc sheet từ file Excel" + e.getMessage());
    }
  }

  @Override
  @CacheEvict(value = "studentsCondition", allEntries = true)
  public void importEligibleStudentsForSubject(MultipartFile file, Long examId) {
    try {
      List<AddStudentSubjectStatusRequest> statusRequests = excelToSssRequest(file.getInputStream(), examId);
      for (AddStudentSubjectStatusRequest sssRequest : statusRequests) {
        statusService.addStudentSubjectStatus(sssRequest);
      }
    } catch (Exception e) {
      throw new RuntimeException("Không thể đọc file excel " + file.getOriginalFilename() + ": " + e.getMessage(), e);
    }
  }
  
  private List<AddStudentSubjectStatusRequest> excelToSssRequest(InputStream is, Long examId) {
    try (Workbook workbook = new XSSFWorkbook(is)) {
      if (workbook.getNumberOfSheets() == 0) {
        throw new RuntimeException("File Excel không có sheet nào");
      }

      List<AddStudentSubjectStatusRequest> sssRequests = new ArrayList<>();

      for (int i = 0; i < workbook.getNumberOfSheets(); i++) {
        Sheet sheet = workbook.getSheetAt(i);
        String sheetName = workbook.getSheetName(i);
        if (sheet == null || sheetName == null || sheetName.isBlank()) {
          continue;
        }

        for (Row row : sheet) {
          if (row.getRowNum() == 0 || row == null || row.getCell(0) == null)
            continue;
          if ("STT".equalsIgnoreCase(row.getCell(0).toString().trim()) || row.getRowNum() < 4)
            continue;
          
          try {
            EligibilityStatus status = row
              .getCell(3)
              .getStringCellValue()
              .equalsIgnoreCase("Đủ điều kiện") ? EligibilityStatus.ELIGIBLE : EligibilityStatus.INELIGIBLE;
            
            Cell cell = row.getCell(4);
            String reason = null;
            if (cell != null && cell.getCellType() != CellType.BLANK) {
              reason = cell.toString().trim();
            }

            AddStudentSubjectStatusRequest ssStatus = AddStudentSubjectStatusRequest.builder()
              .studentCode(row.getCell(1).getStringCellValue())
              .subjectCode(sheetName)
              .status(status)
              .examId(examId)
              .reason(reason)
              .build();
            
            sssRequests.add(ssStatus);
          } catch (Exception e) {
            throw new RuntimeException("Lỗi đọc dữ liệu tại sheet " + sheetName + " dòng " + row.getRowNum() + " " + e.getMessage());
          }
        }
      }
      return sssRequests;
    } catch (Exception e) {
      throw new RuntimeException("Không thể parse workbook hoặc sheet từ file Excel" + e.getMessage());
    }
  }
}
