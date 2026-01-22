package com.examreg.examreg.service;

import com.examreg.examreg.dto.ReportStatsDTO;

public interface IReportService {
    ReportStatsDTO getReportStatsByExam(Long examId);
}
