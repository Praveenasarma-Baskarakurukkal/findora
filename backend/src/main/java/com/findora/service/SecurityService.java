package com.findora.service;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
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
import com.findora.model.ItemStatus;
import com.findora.model.Notification;
import com.findora.model.SecurityTransaction;
import com.findora.model.User;
import com.findora.repository.ClaimRepository;
import com.findora.repository.ItemRepository;
import com.findora.repository.NotificationRepository;
import com.findora.repository.SecurityTransactionRepository;
import com.findora.repository.UserRepository;

@Service
@Transactional
public class SecurityService {

    private final ClaimRepository claimRepository;
    private final ItemRepository itemRepository;
    private final SecurityTransactionRepository transactionRepository;
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private static final Logger log = LoggerFactory.getLogger(SecurityService.class);

    public SecurityService(ClaimRepository claimRepository, ItemRepository itemRepository,
                           SecurityTransactionRepository transactionRepository,
                           NotificationRepository notificationRepository,
                           UserRepository userRepository) {
        this.claimRepository = claimRepository;
        this.itemRepository = itemRepository;
        this.transactionRepository = transactionRepository;
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    public Map<String, Object> verifyClaim(Long claimId, String otp, Long officerId) {
        Claim claim = claimRepository.findById(claimId)
            .orElseThrow(() -> new RuntimeException("Claim not found"));

        if (claim.getStatus() != Claim.ClaimStatus.PENDING) {
            throw new RuntimeException("Claim is not in PENDING status");
        }

        if (claim.getOtpExpiry() == null || LocalDateTime.now().isAfter(claim.getOtpExpiry())) {
            throw new RuntimeException("OTP has expired");
        }

        if (!claim.getOtp().equals(otp)) {
            throw new RuntimeException("Invalid OTP");
        }

        // Mark claim as collected
        claim.setStatus(Claim.ClaimStatus.COLLECTED);
        claim.setSecurityOfficerId(officerId);
        claim.setCollectedAt(LocalDateTime.now());
        claimRepository.save(claim);

        // Update item to claimed
        Item item = itemRepository.findById(claim.getItemId())
            .orElseThrow(() -> new RuntimeException("Item not found"));
        item.setStatus(ItemStatus.CLAIMED);
        itemRepository.save(item);

        // Record release transaction
        User officer = userRepository.findById(officerId).orElse(null);
        User claimer = userRepository.findById(claim.getClaimerId()).orElse(null);

        SecurityTransaction tx = new SecurityTransaction();
        tx.setSecurityOfficerId(officerId);
        tx.setItemId(item.getId());
        tx.setClaimId(claimId);
        tx.setTransactionType(SecurityTransaction.TransactionType.RELEASE);
        tx.setReleasedTo(claimer != null ? claimer.getFullName() : null);
        tx.setNotes("OTP verified and item released");
        transactionRepository.save(tx);

        // Notify claimer
        if (claimer != null) {
            Notification notif = new Notification();
            notif.setUserId(claimer.getId());
            notif.setType(Notification.NotificationType.CLAIM);
            notif.setTitle("Item Collected");
            notif.setMessage("You have successfully collected '" + item.getItemName()
                + "'. Claim verified by security officer.");
            notif.setIsRead(false);
            notif.setRelatedId(claimId);
            notificationRepository.save(notif);
        }

        log.info("Claim {} verified by officer {}", claimId, officerId);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("success", true);
        result.put("message", "Item released successfully");
        result.put("claim_id", claimId);
        result.put("item_name", item.getItemName());
        return result;
    }

    public Map<String, Object> receiveItem(Long itemId, String receivedFrom, String notes, Long officerId) {
        Item item = itemRepository.findById(itemId)
            .orElseThrow(() -> new RuntimeException("Item not found"));

        SecurityTransaction tx = new SecurityTransaction();
        tx.setSecurityOfficerId(officerId);
        tx.setItemId(itemId);
        tx.setTransactionType(SecurityTransaction.TransactionType.RECEIVE);
        tx.setReceivedFrom(receivedFrom);
        tx.setNotes(notes);
        transactionRepository.save(tx);

        log.info("Item {} received by officer {}", itemId, officerId);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("success", true);
        result.put("message", "Item receipt recorded");
        result.put("item_name", item.getItemName());
        return result;
    }

    @Transactional(readOnly = true)
    public PaginatedResponse<Map<String, Object>> getTransactions(Long officerId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "transactionDate"));
        Page<SecurityTransaction> txPage = (officerId != null)
            ? transactionRepository.findBySecurityOfficerId(officerId, pageable)
            : transactionRepository.findAll(pageable);

        List<Map<String, Object>> dtos = txPage.getContent().stream()
            .map(this::txToMap)
            .collect(Collectors.toList());

        return new PaginatedResponse<>(dtos, page, size,
            txPage.getTotalPages(), (int) txPage.getTotalElements());
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getStats(Long officerId) {
        long totalReceive = transactionRepository
            .findByTransactionType(SecurityTransaction.TransactionType.RECEIVE,
                PageRequest.of(0, Integer.MAX_VALUE))
            .getTotalElements();
        long totalRelease = transactionRepository
            .findByTransactionType(SecurityTransaction.TransactionType.RELEASE,
                PageRequest.of(0, Integer.MAX_VALUE))
            .getTotalElements();
        long pendingClaims = claimRepository
            .findByStatus(Claim.ClaimStatus.PENDING, PageRequest.of(0, 1))
            .getTotalElements();

        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("itemsReceived", totalReceive);
        stats.put("itemsReleased", totalRelease);
        stats.put("pendingClaims", pendingClaims);
        return stats;
    }

    private Map<String, Object> txToMap(SecurityTransaction tx) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", tx.getId());
        map.put("security_officer_id", tx.getSecurityOfficerId());
        map.put("item_id", tx.getItemId());
        map.put("claim_id", tx.getClaimId());
        map.put("transaction_type", tx.getTransactionType() != null
            ? tx.getTransactionType().toString().toLowerCase() : null);
        map.put("received_from", tx.getReceivedFrom());
        map.put("released_to", tx.getReleasedTo());
        map.put("notes", tx.getNotes());
        map.put("transaction_date", tx.getTransactionDate() != null
            ? tx.getTransactionDate().toString() : null);
        return map;
    }
}
