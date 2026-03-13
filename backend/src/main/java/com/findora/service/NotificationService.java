package com.findora.service;

import java.util.List;
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
import com.findora.model.Notification;
import com.findora.repository.NotificationRepository;

@Service
@Transactional
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Transactional(readOnly = true)
    public PaginatedResponse<java.util.Map<String, Object>> getNotifications(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Notification> notifPage = notificationRepository.findByUserId(userId, pageable);

        List<java.util.Map<String, Object>> dtos = notifPage.getContent().stream()
            .map(this::toMap)
            .collect(Collectors.toList());

        return new PaginatedResponse<>(dtos, page, size,
            notifPage.getTotalPages(), (int) notifPage.getTotalElements());
    }

    @Transactional(readOnly = true)
    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    public void markAsRead(Long notificationId, Long userId) {
        Notification notif = notificationRepository.findById(notificationId)
            .orElseThrow(() -> new RuntimeException("Notification not found"));
        if (!notif.getUserId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }
        notif.setIsRead(true);
        notificationRepository.save(notif);
    }

    public void markAllAsRead(Long userId) {
        Pageable all = PageRequest.of(0, Integer.MAX_VALUE);
        Page<Notification> notifs = notificationRepository.findByUserId(userId, all);
        notifs.getContent().forEach(n -> n.setIsRead(true));
        notificationRepository.saveAll(notifs.getContent());
        log.info("Marked all notifications read for user {}", userId);
    }

    public void deleteNotification(Long notificationId, Long userId) {
        Notification notif = notificationRepository.findById(notificationId)
            .orElseThrow(() -> new RuntimeException("Notification not found"));
        if (!notif.getUserId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }
        notificationRepository.delete(notif);
    }

    private java.util.Map<String, Object> toMap(Notification n) {
        java.util.LinkedHashMap<String, Object> map = new java.util.LinkedHashMap<>();
        map.put("id", n.getId());
        map.put("user_id", n.getUserId());
        map.put("type", n.getType() != null ? n.getType().toString().toLowerCase() : null);
        map.put("title", n.getTitle());
        map.put("message", n.getMessage());
        map.put("is_read", n.getIsRead());
        map.put("related_id", n.getRelatedId());
        map.put("created_at", n.getCreatedAt() != null ? n.getCreatedAt().toString() : null);
        return map;
    }
}
