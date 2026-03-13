package com.findora.service;

import java.time.LocalDateTime;
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
import com.findora.model.Claim;
import com.findora.model.Item;
import com.findora.model.Notification;
import com.findora.model.Report;
import com.findora.model.SecurityTransaction;
import com.findora.model.User;
import com.findora.repository.ClaimRepository;
import com.findora.repository.ItemRepository;
import com.findora.repository.NotificationRepository;
import com.findora.repository.ReportRepository;
import com.findora.repository.SecurityTransactionRepository;
import com.findora.repository.UserRepository;

@Service
@Transactional
public class AdminService {

    private final UserRepository userRepository;
    private final ItemRepository itemRepository;
    private final ClaimRepository claimRepository;
    private final ReportRepository reportRepository;
    private final SecurityTransactionRepository transactionRepository;
    private final NotificationRepository notificationRepository;

    public AdminService(UserRepository userRepository, ItemRepository itemRepository,
                        ClaimRepository claimRepository, ReportRepository reportRepository,
                        SecurityTransactionRepository transactionRepository,
                        NotificationRepository notificationRepository) {
        this.userRepository = userRepository;
        this.itemRepository = itemRepository;
        this.claimRepository = claimRepository;
        this.reportRepository = reportRepository;
        this.transactionRepository = transactionRepository;
        this.notificationRepository = notificationRepository;
    }

    @Transactional(readOnly = true)
    public PaginatedResponse<Map<String, Object>> getUsers(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<User> userPage = userRepository.findAll(pageable);
        List<Map<String, Object>> dtos = userPage.getContent().stream()
            .map(this::userToMap).collect(Collectors.toList());
        return new PaginatedResponse<>(dtos, page, size,
            userPage.getTotalPages(), (int) userPage.getTotalElements());
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getPendingApprovals() {
        return userRepository.findAll().stream()
            .filter(u -> !u.getIsApproved())
            .map(this::userToMap)
            .collect(Collectors.toList());
    }

    public void approveUser(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        user.setIsApproved(true);
        userRepository.save(user);

        // Notify user
        Notification notif = new Notification();
        notif.setUserId(userId);
        notif.setType(Notification.NotificationType.APPROVAL);
        notif.setTitle("Account Approved");
        notif.setMessage("Your account has been approved by an administrator.");
        notif.setIsRead(false);
        notificationRepository.save(notif);
    }

    public void banUser(Long userId, boolean banned) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        user.setIsBanned(banned);
        userRepository.save(user);
    }

    public void suspendUser(Long userId, boolean suspended) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        user.setIsSuspended(suspended);
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public PaginatedResponse<Map<String, Object>> getReports(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Report> reportPage = reportRepository.findAll(pageable);
        List<Map<String, Object>> dtos = reportPage.getContent().stream()
            .map(this::reportToMap).collect(Collectors.toList());
        return new PaginatedResponse<>(dtos, page, size,
            reportPage.getTotalPages(), (int) reportPage.getTotalElements());
    }

    public void updateReport(Long reportId, String status, String adminNotes) {
        Report report = reportRepository.findById(reportId)
            .orElseThrow(() -> new RuntimeException("Report not found"));
        if (status != null && !status.isBlank()) {
            report.setStatus(Report.ReportStatus.valueOf(status.toUpperCase()));
        }
        if (adminNotes != null) {
            report.setAdminNotes(adminNotes);
        }
        if (report.getStatus() == Report.ReportStatus.RESOLVED) {
            report.setResolvedAt(LocalDateTime.now());
        }
        reportRepository.save(report);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getStats() {
        long totalUsers = userRepository.count();
        long pendingApprovals = userRepository.findAll().stream()
            .filter(u -> !u.getIsApproved()).count();

        long lostItems = itemRepository.findAll().stream()
            .filter(i -> i.getType() != null && i.getType().toString().equalsIgnoreCase("LOST")).count();
        long foundItems = itemRepository.findAll().stream()
            .filter(i -> i.getType() != null && i.getType().toString().equalsIgnoreCase("FOUND")).count();
        long claimedItems = itemRepository.findAll().stream()
            .filter(i -> i.getStatus() != null && i.getStatus().toString().equalsIgnoreCase("CLAIMED")).count();

        long pendingReports = reportRepository.findAll().stream()
            .filter(r -> r.getStatus() == Report.ReportStatus.PENDING).count();

        long txReceived = transactionRepository.findAll().stream()
            .filter(t -> t.getTransactionType() == SecurityTransaction.TransactionType.RECEIVE).count();
        long txReleased = transactionRepository.findAll().stream()
            .filter(t -> t.getTransactionType() == SecurityTransaction.TransactionType.RELEASE).count();

        Map<String, Object> users = new LinkedHashMap<>();
        users.put("total", totalUsers);
        users.put("pending", pendingApprovals);

        Map<String, Object> items = new LinkedHashMap<>();
        items.put("lost", lostItems);
        items.put("found", foundItems);
        items.put("claimed", claimedItems);

        Map<String, Object> transactions = new LinkedHashMap<>();
        transactions.put("received", txReceived);
        transactions.put("released", txReleased);

        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("users", users);
        stats.put("items", items);
        stats.put("pendingReports", pendingReports);
        stats.put("pendingApprovals", pendingApprovals);
        stats.put("transactions", transactions);

        return stats;
    }

    @Transactional(readOnly = true)
    public PaginatedResponse<Map<String, Object>> getAllItems(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Item> itemPage = itemRepository.findAll(pageable);
        List<Map<String, Object>> dtos = itemPage.getContent().stream()
            .map(this::itemToMap).collect(Collectors.toList());
        return new PaginatedResponse<>(dtos, page, size,
            itemPage.getTotalPages(), (int) itemPage.getTotalElements());
    }

    @Transactional(readOnly = true)
    public PaginatedResponse<Map<String, Object>> getAllTransactions(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "transactionDate"));
        Page<SecurityTransaction> txPage = transactionRepository.findAll(pageable);
        List<Map<String, Object>> dtos = txPage.getContent().stream()
            .map(this::txToMap).collect(Collectors.toList());
        return new PaginatedResponse<>(dtos, page, size,
            txPage.getTotalPages(), (int) txPage.getTotalElements());
    }

    private Map<String, Object> userToMap(User u) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", u.getId());
        m.put("username", u.getUsername());
        m.put("full_name", u.getFullName());
        m.put("email", u.getEmail());
        m.put("role", u.getRole() != null ? u.getRole().toString().toLowerCase() : null);
        m.put("is_verified", u.getIsVerified());
        m.put("is_approved", u.getIsApproved());
        m.put("is_banned", u.getIsBanned());
        m.put("is_suspended", u.getIsSuspended());
        m.put("created_at", u.getCreatedAt() != null ? u.getCreatedAt().toString() : null);
        return m;
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
        m.put("resolved_at", r.getResolvedAt() != null ? r.getResolvedAt().toString() : null);
        return m;
    }

    private Map<String, Object> itemToMap(Item i) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", i.getId());
        m.put("item_name", i.getItemName());
        m.put("type", i.getType() != null ? i.getType().toString().toLowerCase() : null);
        m.put("category", i.getCategory() != null ? i.getCategory().toString() : null);
        m.put("status", i.getStatus() != null ? i.getStatus().toString().toLowerCase() : null);
        m.put("location", i.getLocation());
        m.put("image_url", i.getImageUrl());
        m.put("user_id", i.getUserId());
        m.put("created_at", i.getCreatedAt() != null ? i.getCreatedAt().toString() : null);
        return m;
    }

    private Map<String, Object> txToMap(SecurityTransaction tx) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", tx.getId());
        m.put("security_officer_id", tx.getSecurityOfficerId());
        m.put("item_id", tx.getItemId());
        m.put("claim_id", tx.getClaimId());
        m.put("transaction_type", tx.getTransactionType() != null
            ? tx.getTransactionType().toString().toLowerCase() : null);
        m.put("received_from", tx.getReceivedFrom());
        m.put("released_to", tx.getReleasedTo());
        m.put("notes", tx.getNotes());
        m.put("transaction_date", tx.getTransactionDate() != null
            ? tx.getTransactionDate().toString() : null);
        return m;
    }
}
