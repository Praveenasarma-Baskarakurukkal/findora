# Lost and Found Management System - Database Schema

## Overview
This document describes the normalized MySQL database schema for the Lost and Found Management System.

## Entity-Relationship Diagram

```
┌──────────────────────────┐
│        USERS             │
├──────────────────────────┤
│ id (PK)                  │
│ username                 │
│ email                    │
│ password                 │
│ full_name                │
│ role                     │
│ student_or_staff_id      │
│ nic_number               │
│ profile_picture          │
│ is_verified              │
│ is_suspended             │
│ is_banned                │
│ created_at               │
│ updated_at               │
└──────────────────────────┘
         │  1
         │
      ┌──┴─────────────────────────────────────────┐
      │                                            │
      │                                            │
   1  │                                            │  1
┌─────┴──────────────────┐         ┌──────────────┴──────┐
│      REPORTS           │         │     CLAIMS          │
├───────────────────────┤         ├────────────────────┤
│ id (PK)               │         │ id (PK)            │
│ report_type (LOST/FOUND)        │ claimer_id (FK)    │
│ reported_by_id (FK)   │    1    │ report_id (FK)     │
│ remarks               ├─────────┤ status             │
│ match_score           │         │ claim_description  │
│ matched_with         │         │ proof_of_ownership │
│ created_at            │         │ created_at         │
│ updated_at            │         │ updated_at         │
└─────────────────────────┘         └────────────────────┘
         │  1
         │
         │ ∞
┌────────┴──────────────────┐
│       ITEMS               │
├──────────────────────────┤
│ id (PK)                  │
│ name                     │
│ category                 │
│ description              │
│ location                 │
│ date                     │
│ time                     │
│ image_url                │
│ status                   │
│ color                    │
│ brand                    │
│ serial_number            │
│ additional_features      │
│ report_id (FK)           │
│ created_at               │
│ updated_at               │
└──────────────────────────┘

   User 1 ──→ ∞ Notifications
   User 1 ──→ ∞ Messages (as sender)
   User 1 ──→ ∞ Messages (as recipient)
   User 1 ──→ ∞ SecurityTransactions

┌────────────────────────────┐
│    NOTIFICATIONS           │
├────────────────────────────┤
│ id (PK)                    │
│ user_id (FK)               │
│ type                       │
│ message                    │
│ is_read                    │
│ related_report_id          │
│ related_claim_id           │
│ created_at                 │
└────────────────────────────┘

┌────────────────────────────┐
│      MESSAGES              │
├────────────────────────────┤
│ id (PK)                    │
│ sender_id (FK)             │
│ recipient_id (FK)          │
│ content                    │
│ is_read                    │
│ related_report_id          │
│ related_claim_id           │
│ created_at                 │
└────────────────────────────┘

┌────────────────────────────┐
│ SECURITY_TRANSACTIONS      │
├────────────────────────────┤
│ id (PK)                    │
│ item_id (FK)               │
│ security_officer_id (FK)   │
│ transaction_type           │
│ notes                      │
│ location                   │
│ storage_location           │
│ created_at                 │
└────────────────────────────┘
```

## Table Descriptions

### USERS
Stores user information with role-based access control.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique user identifier |
| username | VARCHAR(50) | NOT NULL, UNIQUE | Unique username for login |
| email | VARCHAR(100) | UNIQUE | User email address |
| full_name | VARCHAR(100) | | User's full name |
| password | VARCHAR(255) | NOT NULL | Encrypted password |
| role | ENUM('ADMIN','SECURITY','STUDENT','STAFF') | NOT NULL | User role |
| student_or_staff_id | VARCHAR(50) | | Student/Staff ID number |
| nic_number | VARCHAR(50) | | National ID number |
| profile_picture | VARCHAR(255) | | Profile picture URL |
| is_verified | BOOLEAN | DEFAULT FALSE | Email verification status |
| is_suspended | BOOLEAN | DEFAULT FALSE | Account suspension status |
| is_banned | BOOLEAN | DEFAULT FALSE | Account ban status |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE | Record update timestamp |

**Indexes:**
- PRIMARY KEY (id)
- UNIQUE KEY (username)
- UNIQUE KEY (email)

---

### REPORTS
Records of lost and found item reports.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique report identifier |
| report_type | ENUM('LOST','FOUND') | NOT NULL | Type of report |
| reported_by_id | BIGINT | NOT NULL, FK → users.id | ID of user who reported |
| remarks | TEXT | | Additional remarks about the report |
| match_score | DOUBLE | | Similarity score with another report (0.0-1.0) |
| matched_with | BIGINT | | ID of matched report if any |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Report creation timestamp |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE | Report update timestamp |

**Indexes:**
- PRIMARY KEY (id)
- FOREIGN KEY (reported_by_id)
- INDEX (report_type)
- INDEX (created_at)

---

### ITEMS
Physical items reported as lost or found.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique item identifier |
| name | VARCHAR(100) | NOT NULL | Name/title of item |
| category | ENUM('NIC','STUDENT_ID','BANK_CARD','PURSE','OTHER') | NOT NULL | Category of item |
| description | TEXT | | Detailed description |
| location | VARCHAR(255) | NOT NULL | Location where found/lost |
| date | DATE | NOT NULL | Date of incident |
| time | TIME | | Time of incident |
| image_url | VARCHAR(255) | | URL to item image |
| status | ENUM('PENDING','MATCHED','RETURNED','STORED') | DEFAULT 'PENDING' | Current item status |
| color | VARCHAR(50) | | Item color |
| brand | VARCHAR(100) | | Item brand/manufacturer |
| serial_number | VARCHAR(100) | | Serial or ID number |
| additional_features | TEXT | | Additional identifying features |
| report_id | BIGINT | NOT NULL, FK → reports.id | Associated report |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE | Record update timestamp |

**Indexes:**
- PRIMARY KEY (id)
- FOREIGN KEY (report_id)
- INDEX (status)
- INDEX (category)
- INDEX (location)

---

### CLAIMS
User claims for found items.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique claim identifier |
| claimer_id | BIGINT | NOT NULL, FK → users.id | ID of user claiming the item |
| report_id | BIGINT | NOT NULL, FK → reports.id | Associated report |
| status | ENUM('PENDING','APPROVED','REJECTED','COMPLETED') | DEFAULT 'PENDING' | Claim status |
| claim_description | TEXT | | Description of claim |
| proof_of_ownership | VARCHAR(255) | | Description of proof |
| proof_url | VARCHAR(255) | | URL to proof document/image |
| rejection_reason | TEXT | | Reason for rejection if rejected |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE | Record update timestamp |

**Indexes:**
- PRIMARY KEY (id)
- FOREIGN KEY (claimer_id)
- FOREIGN KEY (report_id)
- INDEX (status)

---

### NOTIFICATIONS
Notifications sent to users.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique notification identifier |
| user_id | BIGINT | NOT NULL, FK → users.id | ID of recipient user |
| type | ENUM('MATCH','CLAIM','CLAIM_APPROVED','CLAIM_REJECTED','ITEM_AVAILABLE') | NOT NULL | Notification type |
| message | TEXT | | Notification message |
| is_read | BOOLEAN | DEFAULT FALSE | Read status |
| related_report_id | BIGINT | | Related report ID if applicable |
| related_claim_id | BIGINT | | Related claim ID if applicable |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |

**Indexes:**
- PRIMARY KEY (id)
- FOREIGN KEY (user_id)
- INDEX (is_read)
- INDEX (created_at)

---

### MESSAGES
Direct messages between users.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique message identifier |
| sender_id | BIGINT | NOT NULL, FK → users.id | ID of message sender |
| recipient_id | BIGINT | NOT NULL, FK → users.id | ID of message recipient |
| content | TEXT | NOT NULL | Message content |
| is_read | BOOLEAN | DEFAULT FALSE | Read status |
| related_report_id | BIGINT | | Related report ID if applicable |
| related_claim_id | BIGINT | | Related claim ID if applicable |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |

**Indexes:**
- PRIMARY KEY (id)
- FOREIGN KEY (sender_id)
- FOREIGN KEY (recipient_id)
- INDEX (is_read)
- COMPOSITE KEY (sender_id, recipient_id, created_at)

---

### SECURITY_TRANSACTIONS
Records of security officer actions on items.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique transaction identifier |
| item_id | BIGINT | NOT NULL, FK → items.id | Associated item |
| security_officer_id | BIGINT | NOT NULL, FK → users.id | ID of security officer |
| transaction_type | ENUM('RECEIVED','RELEASED') | NOT NULL | Type of transaction |
| notes | TEXT | | Additional notes |
| location | VARCHAR(255) | | Physical location involved |
| storage_location | VARCHAR(255) | | Storage location for received items |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Transaction timestamp |

**Indexes:**
- PRIMARY KEY (id)
- FOREIGN KEY (item_id)
- FOREIGN KEY (security_officer_id)
- INDEX (transaction_type)
- INDEX (created_at)

---

## Relationships

### One-to-Many Relationships
1. **User → Reports**: One user can create many reports
   - Foreign Key: reports.reported_by_id → users.id
   
2. **User → Claims**: One user can submit many claims
   - Foreign Key: claims.claimer_id → users.id
   
3. **User → Notifications**: One user receives many notifications
   - Foreign Key: notifications.user_id → users.id
   
4. **User → Messages (Sent)**: One user sends many messages
   - Foreign Key: messages.sender_id → users.id
   
5. **User → Messages (Received)**: One user receives many messages
   - Foreign Key: messages.recipient_id → users.id
   
6. **User → SecurityTransactions**: One security officer handles many transactions
   - Foreign Key: security_transactions.security_officer_id → users.id
   
7. **Report → Items**: One report contains one item (but designed for multiple)
   - Foreign Key: items.report_id → reports.id
   
8. **Report → Claims**: One report can have multiple claims
   - Foreign Key: claims.report_id → reports.id

---

## Key Design Decisions

1. **Enum Fields**: Used MySQL ENUM for predefined values (role, report_type, status) for better performance and data integrity.

2. **Timestamps**: All tables include `created_at` and `updated_at` timestamps (except Notifications which only has created_at).

3. **Cascading Deletes**: Foreign keys use CASCADE delete for related entities to maintain referential integrity.

4. **Indexing**: Commonly queried columns are indexed for performance optimization.

5. **Composite Foreign Keys**: Messages table uses composite indexing on sender_id and recipient_id for efficient conversation queries.

6. **Match Score**: Reports table stores match score and matched_with ID for tracking similar lost/found items.

7. **Proof Storage**: Claims table stores both proof description and URL for flexible proof submission.

---

## Naming Conventions

- Tables: CamelCase (e.g., SecurityTransactions)
- Columns: snake_case (e.g., reported_by_id)
- Foreign Keys: Follow pattern `{table_name}_id`
- Enums: UPPERCASE (e.g., PENDING, APPROVED)

---

## Capacity Planning

- **Users**: Can handle millions of users
- **Reports**: Scalable to handle high volume of reports
- **Items**: One report can have multiple items
- **Claims**: Multiple claims per report for popular lost items
- **Notifications**: Indexed by user for fast retrieval
- **Messages**: Composite indexing for efficient conversation retrieval

---

## Data Integrity

- All foreign keys are enforced
- NOT NULL constraints prevent invalid data
- UNIQUE constraints on username and email
- Enum constraints ensure only valid values
- Timestamps track all changes

