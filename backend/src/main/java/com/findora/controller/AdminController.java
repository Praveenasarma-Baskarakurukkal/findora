package com.findora.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.findora.dto.PaginatedResponse;
import com.findora.service.AdminService;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/users")
    public ResponseEntity<?> getUsers(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "20") Integer size) {
        try {
            PaginatedResponse<Map<String, Object>> result = adminService.getUsers(page, size);
            return ResponseEntity.ok(Map.of(
                "users", result.getContent(),
                "totalElements", result.getTotalElements(),
                "totalPages", result.getTotalPages()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Server error"));
        }
    }

    @GetMapping("/pending-approvals")
    public ResponseEntity<?> getPendingApprovals(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "20") Integer size) {
        try {
            List<Map<String, Object>> approvals = adminService.getPendingApprovals();
            return ResponseEntity.ok(Map.of("approvals", approvals));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Server error"));
        }
    }

    @PutMapping("/approve-user/{id}")
    public ResponseEntity<?> approveUser(@PathVariable Long id) {
        try {
            adminService.approveUser(id);
            return ResponseEntity.ok(Map.of("success", true, "message", "User approved"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PutMapping("/ban-user/{id}")
    public ResponseEntity<?> banUser(@PathVariable Long id,
                                      @RequestBody Map<String, Object> body) {
        try {
            boolean banned = Boolean.parseBoolean(body.getOrDefault("banned", "true").toString());
            adminService.banUser(id, banned);
            return ResponseEntity.ok(Map.of("success", true,
                "message", banned ? "User banned" : "User unbanned"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PutMapping("/suspend-user/{id}")
    public ResponseEntity<?> suspendUser(@PathVariable Long id,
                                          @RequestBody Map<String, Object> body) {
        try {
            boolean suspended = Boolean.parseBoolean(body.getOrDefault("suspended", "true").toString());
            adminService.suspendUser(id, suspended);
            return ResponseEntity.ok(Map.of("success", true,
                "message", suspended ? "User suspended" : "Suspension lifted"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @GetMapping("/reports")
    public ResponseEntity<?> getReports(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "20") Integer size) {
        try {
            PaginatedResponse<Map<String, Object>> result = adminService.getReports(page, size);
            return ResponseEntity.ok(Map.of(
                "reports", result.getContent(),
                "totalElements", result.getTotalElements(),
                "totalPages", result.getTotalPages()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Server error"));
        }
    }

    @PutMapping("/reports/{id}")
    public ResponseEntity<?> updateReport(@PathVariable Long id,
                                           @RequestBody Map<String, String> body) {
        try {
            adminService.updateReport(id, body.get("status"), body.get("admin_notes"));
            return ResponseEntity.ok(Map.of("success", true));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getAdminStats() {
        try {
            Map<String, Object> stats = adminService.getStats();
            return ResponseEntity.ok(Map.of("stats", stats));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Server error"));
        }
    }

    @GetMapping("/items")
    public ResponseEntity<?> getAllItems(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "20") Integer size) {
        try {
            PaginatedResponse<Map<String, Object>> result = adminService.getAllItems(page, size);
            return ResponseEntity.ok(Map.of(
                "items", result.getContent(),
                "totalElements", result.getTotalElements(),
                "totalPages", result.getTotalPages()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Server error"));
        }
    }

    @GetMapping("/transactions")
    public ResponseEntity<?> getAllTransactions(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "20") Integer size) {
        try {
            PaginatedResponse<Map<String, Object>> result = adminService.getAllTransactions(page, size);
            return ResponseEntity.ok(Map.of(
                "transactions", result.getContent(),
                "totalElements", result.getTotalElements(),
                "totalPages", result.getTotalPages()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Server error"));
        }
    }
}

