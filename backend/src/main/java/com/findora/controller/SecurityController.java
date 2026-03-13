package com.findora.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.findora.dto.PaginatedResponse;
import com.findora.repository.UserRepository;
import com.findora.service.ClaimService;
import com.findora.service.SecurityService;

@RestController
@RequestMapping("/api/security")
public class SecurityController {

    private final SecurityService securityService;
    private final ClaimService claimService;
    private final UserRepository userRepository;

    public SecurityController(SecurityService securityService, ClaimService claimService,
                               UserRepository userRepository) {
        this.securityService = securityService;
        this.claimService = claimService;
        this.userRepository = userRepository;
    }

    @PostMapping("/verify-claim")
    public ResponseEntity<?> verifyClaim(@RequestBody Map<String, String> body) {
        try {
            Long claimId = Long.valueOf(body.get("claim_id"));
            String otp = body.get("otp");
            Long officerId = getCurrentUserId();
            Map<String, Object> result = securityService.verifyClaim(claimId, otp, officerId);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PostMapping("/receive-item")
    public ResponseEntity<?> receiveItem(@RequestBody Map<String, Object> body) {
        try {
            Long itemId = Long.valueOf(body.get("item_id").toString());
            String receivedFrom = body.getOrDefault("received_from", "").toString();
            String notes = body.getOrDefault("notes", "").toString();
            Long officerId = getCurrentUserId();
            Map<String, Object> result = securityService.receiveItem(itemId, receivedFrom, notes, officerId);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @GetMapping("/transactions")
    public ResponseEntity<?> getTransactions(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        try {
            Long officerId = getCurrentUserId();
            PaginatedResponse<Map<String, Object>> result =
                securityService.getTransactions(officerId, page, size);
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

    @GetMapping("/stats")
    public ResponseEntity<?> getSecurityStats() {
        try {
            Long officerId = getCurrentUserId();
            Map<String, Object> stats = securityService.getStats(officerId);
            return ResponseEntity.ok(Map.of("stats", stats));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Server error"));
        }
    }

    @GetMapping("/pending-claims")
    public ResponseEntity<?> getPendingClaims(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "20") Integer size) {
        try {
            PaginatedResponse<Map<String, Object>> result = claimService.getPendingClaims(page, size);
            return ResponseEntity.ok(Map.of(
                "claims", result.getContent(),
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

