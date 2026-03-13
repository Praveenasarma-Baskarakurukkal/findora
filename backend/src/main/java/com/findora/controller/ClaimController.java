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

@RestController
@RequestMapping("/api/claims")
public class ClaimController {

    private final ClaimService claimService;
    private final UserRepository userRepository;

    public ClaimController(ClaimService claimService, UserRepository userRepository) {
        this.claimService = claimService;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<?> createClaim(@RequestBody Map<String, Object> body) {
        try {
            Long itemId = Long.valueOf(body.get("item_id").toString());
            Long userId = getCurrentUserId();
            Map<String, Object> claim = claimService.createClaim(itemId, userId);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("success", true, "claim", claim));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyClaims(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        try {
            Long userId = getCurrentUserId();
            PaginatedResponse<Map<String, Object>> result = claimService.getMyClaims(userId, page, size);
            return ResponseEntity.ok(Map.of(
                "claims", result.getContent(),
                "totalElements", result.getTotalElements(),
                "totalPages", result.getTotalPages()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Server error"));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getClaimById(@PathVariable Long id) {
        try {
            Long userId = getCurrentUserId();
            Map<String, Object> claim = claimService.getClaimById(id, userId);
            return ResponseEntity.ok(Map.of("success", true, "claim", claim));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @GetMapping("/pending")
    public ResponseEntity<?> getPendingClaims(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        try {
            PaginatedResponse<Map<String, Object>> result = claimService.getPendingClaims(page, size);
            return ResponseEntity.ok(Map.of(
                "claims", result.getContent(),
                "totalElements", result.getTotalElements(),
                "totalPages", result.getTotalPages()
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

