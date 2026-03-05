-- Lost and Found Management System - Database Schema
-- MySQL Database Initialization Script

-- Drop existing tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS security_transactions;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS claims;
DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS reports;
DROP TABLE IF EXISTS users;

-- Create USERS table
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    full_name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'SECURITY', 'STUDENT', 'STAFF') NOT NULL,
    student_or_staff_id VARCHAR(50),
    nic_number VARCHAR(50),
    profile_picture VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE,
    is_suspended BOOLEAN DEFAULT FALSE,
    is_banned BOOLEAN DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create REPORTS table
CREATE TABLE reports (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    report_type ENUM('LOST', 'FOUND') NOT NULL,
    reported_by_id BIGINT NOT NULL,
    remarks TEXT,
    match_score DOUBLE,
    matched_with BIGINT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (reported_by_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_report_type (report_type),
    INDEX idx_reported_by_id (reported_by_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create ITEMS table
CREATE TABLE items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    category ENUM('NIC', 'STUDENT_ID', 'BANK_CARD', 'PURSE', 'OTHER') NOT NULL,
    description TEXT,
    location VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    time TIME,
    image_url VARCHAR(255),
    status ENUM('PENDING', 'MATCHED', 'RETURNED', 'STORED') DEFAULT 'PENDING',
    color VARCHAR(50),
    brand VARCHAR(100),
    serial_number VARCHAR(100),
    additional_features TEXT,
    report_id BIGINT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE,
    INDEX idx_status (status),
    INDEX idx_category (category),
    INDEX idx_location (location),
    INDEX idx_report_id (report_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create CLAIMS table
CREATE TABLE claims (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    claimer_id BIGINT NOT NULL,
    report_id BIGINT NOT NULL,
    status ENUM('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED') DEFAULT 'PENDING',
    claim_description TEXT,
    proof_of_ownership VARCHAR(255),
    proof_url VARCHAR(255),
    rejection_reason TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (claimer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE,
    INDEX idx_claimer_id (claimer_id),
    INDEX idx_report_id (report_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create NOTIFICATIONS table
CREATE TABLE notifications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    type ENUM('MATCH', 'CLAIM', 'CLAIM_APPROVED', 'CLAIM_REJECTED', 'ITEM_AVAILABLE') NOT NULL,
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    related_report_id BIGINT,
    related_claim_id BIGINT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at),
    INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create MESSAGES table
CREATE TABLE messages (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    sender_id BIGINT NOT NULL,
    recipient_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    related_report_id BIGINT,
    related_claim_id BIGINT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_sender_id (sender_id),
    INDEX idx_recipient_id (recipient_id),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at),
    COMPOSITE INDEX idx_conversation (sender_id, recipient_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create SECURITY_TRANSACTIONS table
CREATE TABLE security_transactions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    item_id BIGINT NOT NULL,
    security_officer_id BIGINT NOT NULL,
    transaction_type ENUM('RECEIVED', 'RELEASED') NOT NULL,
    notes TEXT,
    location VARCHAR(255),
    storage_location VARCHAR(255),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
    FOREIGN KEY (security_officer_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_item_id (item_id),
    INDEX idx_security_officer_id (security_officer_id),
    INDEX idx_transaction_type (transaction_type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create basic indexes for common queries
CREATE INDEX idx_users_role_created ON users(role, created_at);
CREATE INDEX idx_reports_type_date ON reports(report_type, created_at);
CREATE INDEX idx_items_status_date ON items(status, date);
CREATE INDEX idx_claims_status ON claims(status);

-- Print confirmation
SELECT 'All tables created successfully!' AS status;
