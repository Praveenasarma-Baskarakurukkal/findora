-- ============================================================
-- Findora Database Schema
-- MySQL 8.0+
-- Run once: mysql -u root -p findora_db < schema.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS findora_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE findora_db;

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id           BIGINT       AUTO_INCREMENT PRIMARY KEY,
    username     VARCHAR(50)  NOT NULL UNIQUE,
    email        VARCHAR(100) NOT NULL UNIQUE,
    password     VARCHAR(255) NOT NULL,
    full_name    VARCHAR(100) NOT NULL,
    role         VARCHAR(20)  NOT NULL DEFAULT 'student',
    phone        VARCHAR(20),
    is_verified  TINYINT(1)   NOT NULL DEFAULT 0,
    is_approved  TINYINT(1)   NOT NULL DEFAULT 1,
    is_banned    TINYINT(1)   NOT NULL DEFAULT 0,
    is_suspended TINYINT(1)   NOT NULL DEFAULT 0,
    verification_otp VARCHAR(6),
    reset_otp    VARCHAR(6),
    otp_expiry   DATETIME,
    created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email    (email),
    INDEX idx_users_username (username),
    INDEX idx_users_role     (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- ITEMS
-- ============================================================
CREATE TABLE IF NOT EXISTS items (
    id          BIGINT        AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT        NOT NULL,
    type        VARCHAR(10)   NOT NULL COMMENT 'lost | found',
    category    VARCHAR(30)   NOT NULL,
    item_name   VARCHAR(200)  NOT NULL,
    description TEXT,
    location    VARCHAR(200)  NOT NULL,
    date        DATE,
    time        TIME,
    image_url   VARCHAR(500),
    status      VARCHAR(20)   NOT NULL DEFAULT 'active',
    created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_items_user_id  (user_id),
    INDEX idx_items_type     (type),
    INDEX idx_items_status   (status),
    INDEX idx_items_cat_date (category, created_at),
    CONSTRAINT fk_items_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- CLAIMS
-- ============================================================
CREATE TABLE IF NOT EXISTS claims (
    id                  BIGINT     AUTO_INCREMENT PRIMARY KEY,
    item_id             BIGINT     NOT NULL,
    claimer_id          BIGINT     NOT NULL,
    otp                 VARCHAR(6) NOT NULL,
    otp_expiry          DATETIME   NOT NULL,
    status              VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    security_officer_id BIGINT,
    notes               TEXT,
    claimed_at          DATETIME   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    collected_at        DATETIME,
    INDEX idx_claims_item_id    (item_id),
    INDEX idx_claims_claimer_id (claimer_id),
    INDEX idx_claims_status     (status),
    CONSTRAINT fk_claims_item    FOREIGN KEY (item_id)             REFERENCES items(id) ON DELETE CASCADE,
    CONSTRAINT fk_claims_claimer FOREIGN KEY (claimer_id)          REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_claims_officer FOREIGN KEY (security_officer_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
    id         BIGINT       AUTO_INCREMENT PRIMARY KEY,
    user_id    BIGINT       NOT NULL,
    type       VARCHAR(20)  NOT NULL,
    title      VARCHAR(200) NOT NULL,
    message    TEXT         NOT NULL,
    is_read    TINYINT(1)   NOT NULL DEFAULT 0,
    related_id BIGINT,
    created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_notifications_user_id (user_id),
    INDEX idx_notifications_is_read (is_read),
    CONSTRAINT fk_notif_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- POST REPORTS
-- ============================================================
CREATE TABLE IF NOT EXISTS post_reports (
    id          BIGINT       AUTO_INCREMENT PRIMARY KEY,
    reporter_id BIGINT       NOT NULL,
    item_id     BIGINT       NOT NULL,
    reason      TEXT         NOT NULL,
    status      VARCHAR(20)  NOT NULL DEFAULT 'PENDING',
    admin_notes TEXT,
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolved_at DATETIME,
    INDEX idx_reports_status   (status),
    INDEX idx_reports_reporter (reporter_id),
    CONSTRAINT fk_report_reporter FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_report_item     FOREIGN KEY (item_id)     REFERENCES items(id)  ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- MATCHES
-- ============================================================
CREATE TABLE IF NOT EXISTS matches (
    id            BIGINT         AUTO_INCREMENT PRIMARY KEY,
    lost_item_id  BIGINT         NOT NULL,
    found_item_id BIGINT         NOT NULL,
    match_score   DECIMAL(5,2)   NOT NULL DEFAULT 0.00,
    match_type    VARCHAR(30)    NOT NULL,
    is_notified   TINYINT(1)     NOT NULL DEFAULT 0,
    created_at    DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_match_lost  FOREIGN KEY (lost_item_id)  REFERENCES items(id) ON DELETE CASCADE,
    CONSTRAINT fk_match_found FOREIGN KEY (found_item_id) REFERENCES items(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- SECURITY TRANSACTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS security_transactions (
    id                  BIGINT      AUTO_INCREMENT PRIMARY KEY,
    security_officer_id BIGINT      NOT NULL,
    item_id             BIGINT      NOT NULL,
    claim_id            BIGINT,
    transaction_type    VARCHAR(10) NOT NULL COMMENT 'RECEIVE | RELEASE',
    received_from       VARCHAR(100),
    released_to         VARCHAR(100),
    notes               TEXT,
    transaction_date    DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_security_officer  (security_officer_id),
    INDEX idx_transaction_type  (transaction_type),
    INDEX idx_transaction_date  (transaction_date),
    CONSTRAINT fk_tx_officer FOREIGN KEY (security_officer_id) REFERENCES users(id),
    CONSTRAINT fk_tx_item    FOREIGN KEY (item_id)             REFERENCES items(id),
    CONSTRAINT fk_tx_claim   FOREIGN KEY (claim_id)            REFERENCES claims(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
