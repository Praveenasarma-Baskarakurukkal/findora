package com.findora.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.findora.dto.PaginatedResponse;
import com.findora.repository.UserRepository;
import com.findora.service.ReportService;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;
    private final UserRepository userRepository;

    public ReportController(ReportService reportService, UserRepository userRepository) {
        this.reportService = reportService;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<?> createReport(@RequestBody Map<String, Object> body) {
        try {
            Long itemId = Long.valueOf(body.get("item_id").toString());
            String reason = body.getOrDefault("reason", "").toString();
            Long reporterId = getCurrentUserId();
            Map<String, Object> report = reportService.createReport(itemId, reporterId, reason);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("success", true, "report", report));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyReports(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        try {
            Long userId = getCurrentUserId();
            PaginatedResponse<Map<String, Object>> result = reportService.getMyReports(userId, page, size);
            return ResponseEntity.ok(Map.of(
                "reports", result.getContent(),
                "totalElements", result.getTotalElements()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Server error"));
        }
    }

    private Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        return userRepository.findByUsername(username)
            .map(u -> u.getId())
            .orElseThrow(() -> new IllegalStateException("User not found"));
    }
}

