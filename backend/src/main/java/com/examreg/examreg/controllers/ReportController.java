package com.examreg.examreg.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.examreg.examreg.dto.ReportStatsDTO;
import com.examreg.examreg.dto.response.ApiResponse;
import com.examreg.examreg.service.IReportService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
public class ReportController {

    private final IReportService reportService;

    @GetMapping("/exam/{examId}")
    public ResponseEntity<ApiResponse<ReportStatsDTO>> getReportStatsByExam(@PathVariable Long examId) {
        ReportStatsDTO stats = reportService.getReportStatsByExam(examId);
        ApiResponse<ReportStatsDTO> response = ApiResponse.<ReportStatsDTO>builder()
                .message("Report statistics retrieved successfully")
                .data(stats)
                .build();
        return ResponseEntity.ok(response);
    }
}
