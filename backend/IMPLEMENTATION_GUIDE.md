# Lost and Found Management System - Implementation Guide

## Overview
This guide explains the complete database schema and JPA entity implementation for the Lost and Found Management System.

## Project Structure

```
backend/
├── src/main/java/com/example/findora/
│   ├── auth/
│   │   ├── model/
│   │   │   ├── User.java (Updated with relationships)
│   │   │   └── Role.java (Enum)
│   │   └── repository/
│   │       └── UserRepository.java
│   └── domain/
│       ├── entity/
│       │   ├── Item.java
│       │   ├── Report.java
│       │   ├── Claim.java
│       │   ├── Notification.java
│       │   ├── Message.java
│       │   └── SecurityTransaction.java
│       ├── enums/
│       │   ├── ReportType.java
│       │   ├── ItemCategory.java
│       │   ├── ItemStatus.java
│       │   ├── ClaimStatus.java
│       │   ├── TransactionType.java
│       │   └── NotificationType.java
│       └── repository/
│           ├── ItemRepository.java
│           ├── ReportRepository.java
│           ├── ClaimRepository.java
│           ├── NotificationRepository.java
│           ├── MessageRepository.java
│           └── SecurityTransactionRepository.java
├── schema.sql (MySQL initialization script)
└── SCHEMA_DESIGN.md (Database design documentation)
```

## Entity Classes

### 1. User Entity
**Location**: `com.example.findora.auth.model.User`

**Purpose**: Stores user information with role-based access control.

**Key Features**:
- Multiple roles: ADMIN, SECURITY, STUDENT, STAFF
- Account verification and suspension flags
- One-to-many relationships with Reports, Claims, Notifications, Messages, and SecurityTransactions
- Timestamps for audit trail

**Usage Example**:
```java
User student = new User();
student.setUsername("john_doe");
student.setEmail("john@university.edu");
student.setPassword(encodedPassword);
student.setRole(Role.STUDENT);
student.setFullName("John Doe");
student.setStudentOrStaffId("STU123456");
```

---

### 2. Report Entity
**Location**: `com.example.findora.domain.entity.Report`

**Purpose**: Represents a lost or found item report.

**Key Features**:
- Two types: LOST or FOUND
- Links to reporting user and related items
- Supports multiple claims
- Match score tracking for similar items
- Audit timestamps

**Fields**:
| Field | Type | Description |
|-------|------|-------------|
| id | Long | Primary key |
| reportType | ReportType | LOST or FOUND |
| reportedBy | User | User who created the report |
| items | List<Item> | Items in this report |
| claims | List<Claim> | Claims for this report |
| remarks | String | Additional details |
| matchScore | Double | Similarity score (0.0-1.0) |
| matchedWith | Long | ID of matched report |

**Usage Example**:
```java
Report lostReport = new Report();
lostReport.setReportType(ReportType.LOST);
lostReport.setReportedBy(user);
lostReport.setRemarks("Lost near library");
```

---

### 3. Item Entity
**Location**: `com.example.findora.domain.entity.Item`

**Purpose**: Represents a physical item that is lost or found.

**Key Features**:
- Detailed item information (name, category, description, location, date/time)
- Optional image storage
- Color, brand, serial number tracking
- Item status tracking (PENDING, MATCHED, RETURNED, STORED)
- Audit timestamps

**Categories**:
- NIC (National ID Card)
- STUDENT_ID (Student ID Card)
- BANK_CARD (Bank Cards)
- PURSE (Wallets/Purses)
- OTHER

**Status Values**:
- PENDING: Awaiting action
- MATCHED: Found a matching claim
- RETURNED: Returned to owner
- STORED: In security storage

**Usage Example**:
```java
Item item = new Item();
item.setName("Red Wallet");
item.setCategory(ItemCategory.PURSE);
item.setDescription("Red leather wallet with university logo");
item.setLocation("Commons Area");
item.setDate(LocalDate.now());
item.setTime(LocalTime.of(14, 30));
item.setStatus(ItemStatus.PENDING);
item.setReport(report);
```

---

### 4. Claim Entity
**Location**: `com.example.findora.domain.entity.Claim`

**Purpose**: Represents a user's claim for a found item.

**Key Features**:
- Links claimer to a specific report
- Status tracking through approval process
- Proof of ownership documentation
- Rejection reason tracking
- Audit timestamps

**Status Values**:
- PENDING: Awaiting review
- APPROVED: Claim accepted
- REJECTED: Claim denied
- COMPLETED: Item given to claimer

**Usage Example**:
```java
Claim claim = new Claim();
claim.setClaimer(claimingUser);
claim.setReport(foundReport);
claim.setStatus(ClaimStatus.PENDING);
claim.setClaimDescription("I lost my wallet with my ID and bank cards");
claim.setProofOfOwnership("Serial number and card details match");
```

---

### 5. Notification Entity
**Location**: `com.example.findora.domain.entity.Notification`

**Purpose**: Sends notifications to users for various events.

**Key Features**:
- Multiple notification types
- Read/unread tracking
- Links to related reports or claims
- Automatic timestamp

**Notification Types**:
- MATCH: Similar items found
- CLAIM: Someone claimed the user's item
- CLAIM_APPROVED: User's claim was approved
- CLAIM_REJECTED: User's claim was rejected
- ITEM_AVAILABLE: Item ready for pickup

**Usage Example**:
```java
Notification notification = new Notification();
notification.setRecipient(user);
notification.setType(NotificationType.MATCH);
notification.setMessage("A match was found for your lost item!");
notification.setRelatedReportId(reportId);
notification.setIsRead(false);
```

---

### 6. Message Entity
**Location**: `com.example.findora.domain.entity.Message`

**Purpose**: Direct messaging between users.

**Key Features**:
- Bidirectional messaging (sender/recipient)
- Read status tracking
- Links to related reports or claims for context
- Conversation retrieval support

**Usage Example**:
```java
Message message = new Message();
message.setSender(user1);
message.setRecipient(user2);
message.setContent("Is my wallet still in storage?");
message.setRelatedReportId(reportId);
message.setIsRead(false);
```

---

### 7. SecurityTransaction Entity
**Location**: `com.example.findora.domain.entity.SecurityTransaction`

**Purpose**: Records security officer actions on items.

**Key Features**:
- Tracks physical receipt and release of items
- Links security officer to specific item actions
- Storage location tracking
- Notes for additional information

**Transaction Types**:
- RECEIVED: Item received by security
- RELEASED: Item released to claimant

**Usage Example**:
```java
SecurityTransaction transaction = new SecurityTransaction();
transaction.setItem(item);
transaction.setSecurityOfficer(securityOfficer);
transaction.setTransactionType(TransactionType.RECEIVED);
transaction.setLocation("Commons Area");
transaction.setStorageLocation("Storage Box A-5");
transaction.setNotes("Item received and catalogued");
```

---

## Enumeration Classes

### 1. ReportType (com.example.findora.domain.enums.ReportType)
```java
public enum ReportType {
    LOST,    // User reports a lost item
    FOUND    // User reports a found item
}
```

### 2. ItemCategory (com.example.findora.domain.enums.ItemCategory)
```java
public enum ItemCategory {
    NIC,           // National ID Card
    STUDENT_ID,    // Student ID Card
    BANK_CARD,     // Bank Cards
    PURSE,         // Wallets/Purses
    OTHER          // Other items
}
```

### 3. ItemStatus (com.example.findora.domain.enums.ItemStatus)
```java
public enum ItemStatus {
    PENDING,   // Awaiting processing
    MATCHED,   // Matched with a claim
    RETURNED,  // Returned to owner
    STORED     // In security storage
}
```

### 4. ClaimStatus (com.example.findora.domain.enums.ClaimStatus)
```java
public enum ClaimStatus {
    PENDING,    // Pending review
    APPROVED,   // Approved
    REJECTED,   // Rejected
    COMPLETED   // Item released
}
```

### 5. TransactionType (com.example.findora.domain.enums.TransactionType)
```java
public enum TransactionType {
    RECEIVED,  // Item received by security
    RELEASED   // Item released by security
}
```

### 6. NotificationType (com.example.findora.domain.enums.NotificationType)
```java
public enum NotificationType {
    MATCH,            // Item match found
    CLAIM,            // New claim on item
    CLAIM_APPROVED,   // Claim approved
    CLAIM_REJECTED,   // Claim rejected
    ITEM_AVAILABLE    // Item ready for pickup
}
```

---

## Repository Classes

### ItemRepository
**Methods**:
- `findByStatus(ItemStatus status)` - Find all items by status
- `findByLocation(String location)` - Find items by location
- `findByDateBetween(LocalDate startDate, LocalDate endDate)` - Find items in date range
- `findByReportId(Long reportId)` - Find items for a report
- `findPendingItems()` - Get pending items sorted by creation

**Usage**:
```java
List<Item> pendingItems = itemRepository.findPendingItems();
List<Item> foundInLibrary = itemRepository.findByLocation("Library");
```

---

### ReportRepository
**Methods**:
- `findByReportType(ReportType reportType)` - Find by report type
- `findByReportedById(Long userId)` - Find user's reports
- `findByUserIdAndReportType(Long userId, ReportType reportType)` - Specific reports
- `findByDateRange(LocalDateTime start, LocalDateTime end)` - Date range search
- `findMatchedReports()` - Find matched reports

**Usage**:
```java
List<Report> lostReports = reportRepository.findByReportType(ReportType.LOST);
List<Report> userReports = reportRepository.findByReportedById(userId);
```

---

### ClaimRepository
**Methods**:
- `findByClaimerId(Long claimerId)` - Find user's claims
- `findByReportId(Long reportId)` - Find claims for a report
- `findByStatus(ClaimStatus status)` - Find claims by status
- `findByClaimerIdAndStatus(Long claimerId, ClaimStatus status)` - Specific claims
- `findByReportIdAndStatus(Long reportId, ClaimStatus status)` - Report claim status

**Usage**:
```java
List<Claim> pendingClaims = claimRepository.findByStatus(ClaimStatus.PENDING);
List<Claim> userClaims = claimRepository.findByClaimerId(userId);
```

---

### NotificationRepository
**Methods**:
- `findByRecipientId(Long recipientId)` - Get user's notifications
- `findByRecipientIdAndIsRead(Long recipientId, boolean isRead)` - Filter by read status
- `findByType(NotificationType type)` - Find by type
- `findUserNotificationsSortedByDate(Long userId)` - Sorted notifications
- `countUnreadNotifications(Long userId)` - Count unread

**Usage**:
```java
long unreadCount = notificationRepository.countUnreadNotifications(userId);
List<Notification> unread = notificationRepository.findByRecipientIdAndIsRead(userId, false);
```

---

### MessageRepository
**Methods**:
- `findBySenderId(Long senderId)` - Messages sent by user
- `findByRecipientId(Long recipientId)` - Messages received by user
- `findConversation(Long senderId, Long recipientId)` - Two-way conversation
- `findUnreadMessagesForUser(Long recipientId)` - Unread messages

**Usage**:
```java
List<Message> conversation = messageRepository.findConversation(userId1, userId2);
List<Message> unread = messageRepository.findUnreadMessagesForUser(userId);
```

---

### SecurityTransactionRepository
**Methods**:
- `findByItemId(Long itemId)` - Transactions for an item
- `findBySecurityOfficerId(Long officerId)` - Officer's transactions
- `findByTransactionType(TransactionType type)` - Find by type
- `findTransactionsBySecurityOfficer(Long officerId)` - Officer's sorted transactions
- `findItemTransactionHistory(Long itemId)` - Item history sorted

**Usage**:
```java
List<SecurityTransaction> history = securityTransactionRepository.findItemTransactionHistory(itemId);
List<SecurityTransaction> releases = securityTransactionRepository.findByTransactionType(TransactionType.RELEASED);
```

---

## Key Design Patterns

### 1. Cascading Relationships
All one-to-many relationships use `cascade = CascadeType.ALL, orphanRemoval = true` to ensure:
- Deleting a parent automatically deletes children
- No orphaned records remain

### 2. Audit Timestamps
All entities have:
- `@CreationTimestamp` for `createdAt`
- `@UpdateTimestamp` for `updatedAt`

This tracks when records are created and modified.

### 3. Enumerated Types
All status/type fields use `@Enumerated(EnumType.STRING)` for:
- Data integrity
- Performance optimization
- Easy querying

### 4. Lazy Loading
Relationships use default JPA lazy loading to prevent N+1 query problems.

### 5. Query Optimization
Custom repository methods use `@Query` annotations for:
- Complex queries
- Performance optimization
- Better SQL control

---

## Usage Workflow Examples

### Example 1: Creating a Lost Report

```java
// 1. Create report
Report lostReport = new Report();
lostReport.setReportType(ReportType.LOST);
lostReport.setReportedBy(user);
lostReport.setRemarks("Lost near Commons");

// 2. Create item
Item item = new Item();
item.setName("Blue Backpack");
item.setCategory(ItemCategory.OTHER);
item.setLocation("Commons Area");
item.setDate(LocalDate.now());
item.setReport(lostReport);

// 3. Add item to report
lostReport.getItems().add(item);

// 4. Save (cascade will save item too)
reportRepository.save(lostReport);
```

### Example 2: Processing a Claim

```java
// 1. Create claim
Claim claim = new Claim();
claim.setClaimer(findingUser);
claim.setReport(foundReport);
claim.setStatus(ClaimStatus.PENDING);
claim.setProofOfOwnership("Serial number matches");

// 2. Save claim
claimRepository.save(claim);

// 3. Send notification
Notification notification = new Notification();
notification.setRecipient(foundItemReporter);
notification.setType(NotificationType.CLAIM);
notification.setMessage("Someone claimed your found item");
notification.setRelatedClaimId(claim.getId());
notificationRepository.save(notification);

// 4. Approve claim
claim.setStatus(ClaimStatus.APPROVED);
claimRepository.save(claim);
```

### Example 3: Security Transaction

```java
// 1. Find item and security officer
Item item = itemRepository.findById(itemId).orElseThrow();
User securityOfficer = userRepository.findById(officerId).orElseThrow();

// 2. Create transaction
SecurityTransaction transaction = new SecurityTransaction();
transaction.setItem(item);
transaction.setSecurityOfficer(securityOfficer);
transaction.setTransactionType(TransactionType.RECEIVED);
transaction.setStorageLocation("Storage Box A-5");

// 3. Update item status
item.setStatus(ItemStatus.STORED);

// 4. Save both
securityTransactionRepository.save(transaction);
itemRepository.save(item);
```

---

## Database Setup

### Option 1: Automatic Schema Generation (Development)
```properties
# In application.properties
spring.jpa.hibernate.ddl-auto=create-drop
```

### Option 2: Manual Script Execution (Production)
```bash
mysql -u root -p findora_db < schema.sql
```

### Option 3: Flyway/Liquibase Migration
Place `schema.sql` content in migration scripts and use Flyway/Liquibase for version control.

---

## Performance Considerations

### Indexing
- All foreign keys are indexed
- Commonly queried columns (status, date, location) are indexed
- Composite indexes on frequently joined columns

### Pagination
Use Spring Data's `PagingAndSortingRepository` for large result sets:
```java
Page<Report> reports = reportRepository.findAll(
    PageRequest.of(0, 20, Sort.by("createdAt").descending())
);
```

### Query Optimization
Use custom repository queries to avoid N+1 problems:
```java
@Query("""
    SELECT r FROM Report r 
    LEFT JOIN FETCH r.items 
    WHERE r.reportedBy.id = :userId
""")
List<Report> findUserReportsWithItems(@Param("userId") Long userId);
```

---

## Future Enhancements

1. **Soft Delete**: Add `isDeleted` flag for logical deletion
2. **Audit Logging**: Track who modified what and when
3. **Match Algorithm**: Implement AI-based matching for items
4. **Image Processing**: Add image comparison for items
5. **Notifications Service**: Automated notification triggers
6. **File Storage**: Integration with S3/Cloud storage
7. **Search Service**: Elasticsearch for advanced search

---

## Best Practices

1. ✅ Always use repositories for data access
2. ✅ Use `@Transactional` for multi-entity operations
3. ✅ Validate inputs before saving
4. ✅ Use DTOs for API responses (don't expose entities)
5. ✅ Handle exceptions gracefully
6. ✅ Use Spring Security for access control
7. ✅ Log important operations
8. ✅ Test repositories with `@DataJpaTest`
9. ✅ Use constructor injection over field injection
10. ✅ Keep business logic in services, not controllers

---

## Troubleshooting

### Common Issues

**Issue**: `LazyInitializationException` when accessing relationships
**Solution**: Use `@Transactional` or fetch eagerly:
```java
@Query("SELECT r FROM Report r LEFT JOIN FETCH r.items")
List<Report> findAllWithItems();
```

**Issue**: Circular references in JSON serialization
**Solution**: Use `@JsonIgnore` or DTOs:
```java
@OneToMany(mappedBy = "report")
@JsonIgnore
private List<Item> items;
```

**Issue**: Cascading deletes removing too much data
**Solution**: Use `orphanRemoval = false` or handle manually

---

