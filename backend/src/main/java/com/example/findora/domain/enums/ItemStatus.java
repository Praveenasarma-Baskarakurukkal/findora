package com.example.findora.domain.enums;

/**
 * Enum for Item Status
 * PENDING - Item is awaiting processing
 * MATCHED - Item has been matched with a lost report
 * RETURNED - Item has been returned to the owner
 * STORED - Item is in storage
 */
public enum ItemStatus {
    PENDING,
    MATCHED,
    RETURNED,
    STORED
}
