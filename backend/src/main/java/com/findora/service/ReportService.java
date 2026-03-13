package com.findora.service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.findora.dto.PaginatedResponse;
import com.findora.model.Report;
import com.findora.repository.ReportRepository;

@Service
@Transactional
public class ReportService {

    private final ReportRepository reportRepository;

    public ReportService(ReportRepository reportRepository) {
        this.reportRepository = reportRepository;
    }

    public Map<String, Object> createReport(Long itemId, Long reporterId, String reason) {
        Report report = new Report();
        report.setItemId(itemId);
        report.setReporterId(reporterId);
        report.setReason(reason);
        report.setStatus(Report.ReportStatus.PENDING);
        Report saved = reportRepository.save(report);
        return reportToMap(saved);
    }

    @Transactional(readOnly = true)
    public PaginatedResponse<Map<String, Object>> getMyReports(Long reporterId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Report> reportPage = reportRepository.findByReporterId(reporterId, pageable);
        List<Map<String, Object>> dtos = reportPage.getContent().stream()
            .map(this::reportToMap).collect(Collectors.toList());
        return new PaginatedResponse<>(dtos, page, size,
            reportPage.getTotalPages(), (int) reportPage.getTotalElements());
    }

    private Map<String, Object> reportToMap(Report r) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", r.getId());
        m.put("reporter_id", r.getReporterId());
        m.put("item_id", r.getItemId());
        m.put("reason", r.getReason());
        m.put("status", r.getStatus() != null ? r.getStatus().toString().toLowerCase() : null);
        m.put("admin_notes", r.getAdminNotes());
        m.put("created_at", r.getCreatedAt() != null ? r.getCreatedAt().toString() : null);
        return m;
    }
}
