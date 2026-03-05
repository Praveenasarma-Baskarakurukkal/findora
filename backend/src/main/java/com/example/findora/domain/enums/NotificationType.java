package com.example.findora.domain.enums;

/**
 * Enum for Notification Types
 * MATCH - A match has been found for reported items
 * CLAIM - A claim has been submitted for user's item
 * CLAIM_APPROVED - A claim has been approved
 * CLAIM_REJECTED - A claim has been rejected
 * ITEM_AVAILABLE - An item is available for pickup
 */
public enum NotificationType {
    MATCH,
    CLAIM,
    CLAIM_APPROVED,
    CLAIM_REJECTED,
    ITEM_AVAILABLE
}
