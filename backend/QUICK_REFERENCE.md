# Lost and Found Management System - Quick Reference Guide

## ✅ Completed Tasks

### 1. Database Schema Design ✓
- Normalized MySQL schema with 7 main tables
- Proper relationships with foreign keys
- Indexing for performance optimization
- Cascade delete for referential integrity
- Enum fields for data integrity

### 2. Entity Classes Created ✓
- **User** (Updated) - `com.example.findora.auth.model.User`
- **Report** - `com.example.findora.domain.entity.Report`
- **Item** - `com.example.findora.domain.entity.Item`
- **Claim** - `com.example.findora.domain.entity.Claim`
- **Notification** - `com.example.findora.domain.entity.Notification`
- **Message** - `com.example.findora.domain.entity.Message`
- **SecurityTransaction** - `com.example.findora.domain.entity.SecurityTransaction`

### 3. Enum Classes Created ✓
- **ReportType** - LOST, FOUND
- **ItemCategory** - NIC, STUDENT_ID, BANK_CARD, PURSE, OTHER
- **ItemStatus** - PENDING, MATCHED, RETURNED, STORED
- **ClaimStatus** - PENDING, APPROVED, REJECTED, COMPLETED
- **TransactionType** - RECEIVED, RELEASED
- **NotificationType** - MATCH, CLAIM, CLAIM_APPROVED, CLAIM_REJECTED, ITEM_AVAILABLE

### 4. Repository Classes Created ✓
- **ItemRepository** - Item data access
- **ReportRepository** - Report data access
- **ClaimRepository** - Claim data access
- **NotificationRepository** - Notification data access
- **MessageRepository** - Message data access
- **SecurityTransactionRepository** - Transaction data access

### 5. Documentation Created ✓
- **SCHEMA_DESIGN.md** - Complete database schema documentation
- **IMPLEMENTATION_GUIDE.md** - Detailed implementation guide with examples
- **schema.sql** - SQL script to initialize database

---

## 📁 File Structure

```
backend/
├── src/main/java/com/example/findora/
│   ├── auth/
│   │   ├── model/
│   │   │   ├── User.java (UPDATED with relationships)
│   │   │   └── Role.java
│   │   └── repository/
│   │       └── UserRepository.java
│   └── domain/
│       ├── entity/
│       │   ├── Item.java (NEW)
│       │   ├── Report.java (NEW)
│       │   ├── Claim.java (NEW)
│       │   ├── Notification.java (NEW)
│       │   ├── Message.java (NEW)
│       │   └── SecurityTransaction.java (NEW)
│       ├── enums/
│       │   ├── ReportType.java (NEW)
│       │   ├── ItemCategory.java (NEW)
│       │   ├── ItemStatus.java (NEW)
│       │   ├── ClaimStatus.java (NEW)
│       │   ├── TransactionType.java (NEW)
│       │   └── NotificationType.java (NEW)
│       └── repository/
│           ├── ItemRepository.java (NEW)
│           ├── ReportRepository.java (NEW)
│           ├── ClaimRepository.java (NEW)
│           ├── NotificationRepository.java (NEW)
│           ├── MessageRepository.java (NEW)
│           └── SecurityTransactionRepository.java (NEW)
├── schema.sql (NEW)
├── SCHEMA_DESIGN.md (NEW)
└── IMPLEMENTATION_GUIDE.md (NEW)
```

---

## 🗄️ Database Tables

| Table | Purpose | Key Relationships |
|-------|---------|-------------------|
| **users** | Store user information | Parent for all other tables |
| **reports** | Lost/Found reports | Parent of Items and Claims |
| **items** | Actual items lost/found | Child of Reports |
| **claims** | User claims for items | Links Users to Reports |
| **notifications** | User notifications | Links Users to events |
| **messages** | Direct messaging | Links Users to Users |
| **security_transactions** | Item receipt/release | Links Users to Items |

---

## 🔑 Key Relationships

```
User (1) ──→ (∞) Reports
User (1) ──→ (∞) Claims
User (1) ──→ (∞) Notifications
User (1) ──→ (∞) Messages (as sender)
User (1) ──→ (∞) Messages (as recipient)
User (1) ──→ (∞) SecurityTransactions

Report (1) ──→ (∞) Items
Report (1) ──→ (∞) Claims

Item (1) ──→ (∞) SecurityTransactions
```

---

## 🚀 Getting Started

### 1. Database Setup

**Option A: Automatic (Development)**
```properties
# application.properties
spring.jpa.hibernate.ddl-auto=create-drop
```

**Option B: Manual (Production)**
```bash
mysql -u root -p
CREATE DATABASE findora;
USE findora;
SOURCE schem a.sql;
```

### 2. Dependencies Already in pom.xml
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
</dependency>
```

### 3. Configuration (application.properties)
```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/findora
spring.datasource.username=root
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate
spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.jdbc.batch_size=20
spring.jpa.properties.hibernate.order_inserts=true
spring.jpa.properties.hibernate.order_updates=true
```

---

## 💡 Usage Examples

### Creating a Report
```java
@Service
public class ReportService {
    @Autowired private ReportRepository reportRepository;
    @Autowired private ItemRepository itemRepository;
    
    @Transactional
    public Report createLostReport(CreateReportRequest request, User user) {
        Report report = new Report();
        report.setReportType(ReportType.LOST);
        report.setReportedBy(user);
        report.setRemarks(request.getRemarks());
        
        Item item = new Item();
        item.setName(request.getItemName());
        item.setCategory(ItemCategory.valueOf(request.getCategory()));
        item.setLocation(request.getLocation());
        item.setDate(request.getDate());
        item.setReport(report);
        
        report.getItems().add(item);
        return reportRepository.save(report);
    }
}
```

### Finding Matches
```java
@Service
public class MatchingService {
    @Autowired private ReportRepository reportRepository;
    
    public List<Report> findPotentialMatches(Long reportId, Double threshold) {
        Report report = reportRepository.findById(reportId).orElseThrow();
        List<Report> oppositeType = reportRepository.findByReportType(
            report.getReportType() == ReportType.LOST ? ReportType.FOUND : ReportType.LOST
        );
        
        return oppositeType.stream()
            .filter(r -> calculateSimilarity(report, r) >= threshold)
            .collect(Collectors.toList());
    }
}
```

### Processing Claims
```java
@Service
public class ClaimService {
    @Autowired private ClaimRepository claimRepository;
    @Autowired private NotificationRepository notificationRepository;
    
    @Transactional
    public void approveClaim(Long claimId) {
        Claim claim = claimRepository.findById(claimId).orElseThrow();
        claim.setStatus(ClaimStatus.APPROVED);
        claimRepository.save(claim);
        
        // Send notification
        Notification notification = new Notification();
        notification.setRecipient(claim.getClaimer());
        notification.setType(NotificationType.CLAIM_APPROVED);
        notification.setMessage("Your claim has been approved!");
        notificationRepository.save(notification);
    }
}
```

---

## 📊 Entity Field Summary

### User
- Basic Info: id, username, email, password, fullName
- Verification: isVerified, isSuspended, isBanned
- Identity: studentOrStaffId, nicNumber
- Role: role → Role enum
- Media: profilePicture
- Collections: reports, claims, notifications, sentMessages, receivedMessages, securityTransactions
- Timestamps: createdAt, updatedAt

### Report
- Identification: id, reportType → ReportType enum
- User: reportedBy → User
- Details: remarks
- Matching: matchScore, matchedWith
- Collections: items, claims
- Timestamps: createdAt, updatedAt

### Item
- Basic Info: id, name, category → ItemCategory enum
- Location: location, date, time
- Description: description, color, brand, serialNumber, additionalFeatures
- Status: status → ItemStatus enum
- Media: imageUrl
- Foreign Key: report → Report
- Timestamps: createdAt, updatedAt

### Claim
- Identification: id, claimer → User, report → Report
- Status: status → ClaimStatus enum
- Evidence: claimDescription, proofOfOwnership, proofUrl
- Rejection: rejectionReason
- Timestamps: createdAt, updatedAt

### Notification
- Identification: id, recipient → User
- Content: type → NotificationType enum, message
- Status: isRead
- Context: relatedReportId, relatedClaimId
- Timestamps: createdAt

### Message
- Identification: id, sender → User, recipient → User
- Content: content
- Status: isRead
- Context: relatedReportId, relatedClaimId
- Timestamps: createdAt

### SecurityTransaction
- Identification: id, item → Item, securityOfficer → User
- Action: transactionType → TransactionType enum
- Details: notes, location, storageLocation
- Timestamps: createdAt

---

## 🔍 Query Examples

### Finding User's Reports
```java
List<Report> userReports = reportRepository.findByReportedById(userId);
```

### Finding Pending Items
```java
List<Item> pending = itemRepository.findPendingItems();
```

### Finding User's Claims
```java
List<Claim> claims = claimRepository.findByClaimerId(userId);
List<Claim> approved = claimRepository.findByClaimerIdAndStatus(userId, ClaimStatus.APPROVED);
```

### Finding Unread Notifications
```java
long unread = notificationRepository.countUnreadNotifications(userId);
List<Notification> notifications = notificationRepository.findByRecipientIdAndIsRead(userId, false);
```

### Finding Conversation
```java
List<Message> conversation = messageRepository.findConversation(userId1, userId2);
```

### Finding Item Transaction History
```java
List<SecurityTransaction> history = securityTransactionRepository.findItemTransactionHistory(itemId);
```

---

## ✨ Best Practices Implemented

1. ✅ **Entity Relationships** - Proper JPA annotations with cascade options
2. ✅ **Timestamps** - Automatic createdAt and updatedAt using Hibernate annotations
3. ✅ **Enums** - Type-safe status and category fields using @Enumerated
4. ✅ **Foreign Keys** - All relationships properly defined with @ManyToOne and @OneToMany
5. ✅ **Repositories** - Custom query methods for common operations
6. ✅ **Indexing** - Optimized database queries with strategic indexes
7. ✅ **Lombok** - Reduced boilerplate with @Getter, @Setter, @AllArgsConstructor
8. ✅ **Documentation** - Comprehensive guides with examples
9. ✅ **Normalization** - Third normal form database design
10. ✅ **Referential Integrity** - Foreign keys with cascade delete

---

## 🐛 Common Tasks

### Add a New Report Type
1. Add to `ReportType.java` enum
2. Update SQL: `ALTER TABLE reports MODIFY report_type ENUM(...);`
3. No entity changes needed

### Add Item Category
1. Add to `ItemCategory.java` enum
2. Update SQL: `ALTER TABLE items MODIFY category ENUM(...);`
3. No entity changes needed

### Add New Fields to User
1. Add field to `User.java`
2. Add to `users` table
3. Create migration script

### Query by New Field
1. Add method to Repository
2. Use `@Query` annotation for complex queries
3. Test with `@DataJpaTest`

---

## 📚 Documentation Files

1. **SCHEMA_DESIGN.md** - Complete database schema with ERD
2. **IMPLEMENTATION_GUIDE.md** - Detailed entity documentation and examples
3. **schema.sql** - SQL initialization script
4. **This file** - Quick reference guide

---

## 🎯 Next Steps

1. ✅ Review the generated entities and repositories
2. ✅ Set up MySQL database using schema.sql
3. ✅ Configure application.properties with database details
4. ✅ Create Service classes for business logic
5. ✅ Create DTOs for API requests/responses
6. ✅ Create REST Controllers for endpoints
7. ✅ Add validation annotations (@NotNull, @Size, etc.)
8. ✅ Implement Spring Security for authorization
9. ✅ Add error handling and logging
10. ✅ Write unit and integration tests

---

## 📞 Support

For detailed information, refer to:
- Entity documentation: IMPLEMENTATION_GUIDE.md
- Database schema: SCHEMA_DESIGN.md
- SQL script: schema.sql

---

