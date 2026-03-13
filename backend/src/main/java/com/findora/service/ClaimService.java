package com.findora.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.findora.dto.PaginatedResponse;
import com.findora.model.Claim;
import com.findora.model.Item;
import com.findora.model.Notification;
import com.findora.model.User;
import com.findora.repository.ClaimRepository;
import com.findora.repository.ItemRepository;
import com.findora.repository.NotificationRepository;
import com.findora.repository.UserRepository;

@Service
@Transactional
public class ClaimService {

    private final ClaimRepository claimRepository;
    private final ItemRepository itemRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;
    private static final Logger log = LoggerFactory.getLogger(ClaimService.class);
    private static final Random RANDOM = new Random();

    public ClaimService(ClaimRepository claimRepository, ItemRepository itemRepository,
                        UserRepository userRepository, NotificationRepository notificationRepository) {
        this.claimRepository = claimRepository;
        this.itemRepository = itemRepository;
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
    }

    public Map<String, Object> createClaim(Long itemId, Long claimerId) {
        Item item = itemRepository.findById(itemId)
            .orElseThrow(() -> new RuntimeException("Item not found"));

        // Only found items can be claimed
        if (item.getType() == null || !item.getType().toString().equalsIgnoreCase("FOUND")) {
            throw new RuntimeException("Only found items can be claimed");
        }

        // Check if already claimed by this user
        List<Claim> existing = claimRepository.findByItemId(itemId);
        boolean alreadyClaimed = existing.stream()
            .anyMatch(c -> c.getClaimerId().equals(claimerId)
                && c.getStatus() == Claim.ClaimStatus.PENDING);
        if (alreadyClaimed) {
            throw new RuntimeException("You have already submitted a claim for this item");
        }

        User claimer = userRepository.findById(claimerId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        String otp = String.format("%06d", RANDOM.nextInt(1000000));

        Claim claim = new Claim();
        claim.setItemId(itemId);
        claim.setClaimerId(claimerId);
        claim.setOtp(otp);
        claim.setOtpExpiry(LocalDateTime.now().plusHours(24));
        claim.setStatus(Claim.ClaimStatus.PENDING);

        Claim saved = claimRepository.save(claim);

        // Notify claimer with OTP
        Notification notification = new Notification();
        notification.setUserId(claimerId);
        notification.setType(Notification.NotificationType.CLAIM);
        notification.setTitle("Claim Submitted");
        notification.setMessage("Your claim for '" + item.getItemName()
            + "' has been submitted. Show OTP " + otp + " to the security officer to collect your item.");
        notification.setIsRead(false);
        notification.setRelatedId(saved.getId());
        notificationRepository.save(notification);

        log.info("Claim created for item {} by user {}", itemId, claimerId);

        return convertToMap(saved, item, claimer);
    }

    @Transactional(readOnly = true)
    public PaginatedResponse<Map<String, Object>> getMyClaims(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "claimedAt"));
        Page<Claim> claimPage = claimRepository.findByClaimerId(userId, pageable);

        List<Map<String, Object>> dtos = claimPage.getContent().stream()
            .map(c -> {
                Item item = itemRepository.findById(c.getItemId()).orElse(null);
                User claimer = userRepository.findById(c.getClaimerId()).orElse(null);
                return convertToMap(c, item, claimer);
            })
            .collect(Collectors.toList());

        return new PaginatedResponse<>(dtos, page, size,
            claimPage.getTotalPages(), (int) claimPage.getTotalElements());
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getClaimById(Long claimId, Long userId) {
        Claim claim = claimRepository.findByIdAndClaimerId(claimId, userId)
            .orElseThrow(() -> new RuntimeException("Claim not found or access denied"));

        Item item = itemRepository.findById(claim.getItemId()).orElse(null);
        User claimer = userRepository.findById(claim.getClaimerId()).orElse(null);
        return convertToMap(claim, item, claimer);
    }

    @Transactional(readOnly = true)
    public PaginatedResponse<Map<String, Object>> getPendingClaims(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "claimedAt"));
        Page<Claim> claimPage = claimRepository.findByStatus(Claim.ClaimStatus.PENDING, pageable);

        List<Map<String, Object>> dtos = claimPage.getContent().stream()
            .map(c -> {
                Item item = itemRepository.findById(c.getItemId()).orElse(null);
                User claimer = userRepository.findById(c.getClaimerId()).orElse(null);
                return convertToMap(c, item, claimer);
            })
            .collect(Collectors.toList());

        return new PaginatedResponse<>(dtos, page, size,
            claimPage.getTotalPages(), (int) claimPage.getTotalElements());
    }

    private Map<String, Object> convertToMap(Claim claim, Item item, User claimer) {
        java.util.LinkedHashMap<String, Object> map = new java.util.LinkedHashMap<>();
        map.put("id", claim.getId());
        map.put("item_id", claim.getItemId());
        map.put("claimer_id", claim.getClaimerId());
        map.put("otp", claim.getOtp());
        map.put("otp_expiry", claim.getOtpExpiry() != null
            ? claim.getOtpExpiry().toString() : null);
        map.put("status", claim.getStatus() != null
            ? claim.getStatus().toString().toLowerCase() : null);
        map.put("notes", claim.getNotes());
        map.put("claimed_at", claim.getClaimedAt() != null
            ? claim.getClaimedAt().toString() : null);
        map.put("collected_at", claim.getCollectedAt() != null
            ? claim.getCollectedAt().toString() : null);

        if (item != null) {
            map.put("item_name", item.getItemName());
            map.put("image_url", item.getImageUrl());
            map.put("item_type", item.getType() != null ? item.getType().toString().toLowerCase() : null);
        }

        if (claimer != null) {
            map.put("claimer_name", claimer.getFullName());
            map.put("claimer_username", claimer.getUsername());
        }

        return map;
    }
}
