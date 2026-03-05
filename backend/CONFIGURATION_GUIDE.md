# Lost and Found Management System - Configuration Guide

## Database Configuration

### 1. MySQL Installation and Setup

#### Windows
```bash
# Download from https://dev.mysql.com/downloads/mysql/
# Or use Chocolatey
choco install mysql

# Start MySQL service
net start MySQL80

# Connect to MySQL
mysql -u root -p
```

#### macOS
```bash
# Using Homebrew
brew install mysql

# Start MySQL service
brew services start mysql

# Connect to MySQL
mysql -u root
```

#### Linux (Ubuntu/Debian)
```bash
# Install MySQL
sudo apt-get install mysql-server

# Start MySQL service
sudo systemctl start mysql

# Connect to MySQL
sudo mysql -u root -p
```

### 2. Create Database and User

```sql
-- Connect to MySQL
mysql -u root -p

-- Create database
CREATE DATABASE findora CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create application user
CREATE USER 'findora_user'@'localhost' IDENTIFIED BY 'your_secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON findora.* TO 'findora_user'@'localhost';
FLUSH PRIVILEGES;

-- Verify
SHOW GRANTS FOR 'findora_user'@'localhost';
```

### 3. Initialize Database Schema

#### Option A: Using SQL Script (Recommended)
```bash
# Navigate to backend directory
cd backend

# Execute the schema script
mysql -u findora_user -p findora < schema.sql

# Verify tables were created
mysql -u findora_user -p findora -e "SHOW TABLES;"
```

#### Option B: Using Spring Boot (Development)
Set in `application-dev.properties`:
```properties
spring.jpa.hibernate.ddl-auto=create-drop
```

#### Option C: Using Flyway (Production)
```bash
# Add Flyway dependency to pom.xml
# Place schema files in src/main/resources/db/migration/
# Spring will automatically run migrations
```

---

## Spring Boot Configuration

### 1. Update application.properties

Create or update `src/main/resources/application.properties`:

```properties
# ==============================================================
# Spring Application
# ==============================================================
spring.application.name=findora
server.port=8080
server.servlet.context-path=/api

# ==============================================================
# Database Configuration
# ==============================================================
spring.datasource.url=jdbc:mysql://localhost:3306/findora?useSSL=false&serverTimezone=Asia/Colombo&allowPublicKeyRetrieval=true&autoReconnect=true
spring.datasource.username=findora_user
spring.datasource.password=your_secure_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# Connection Pool Configuration
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.idle-timeout=600000
spring.datasource.hikari.max-lifetime=1800000

# ==============================================================
# JPA & Hibernate Configuration
# ==============================================================
spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.use_sql_comments=true

# Hibernate Optimization
spring.jpa.properties.hibernate.jdbc.batch_size=20
spring.jpa.properties.hibernate.order_inserts=true
spring.jpa.properties.hibernate.order_updates=true
spring.jpa.properties.hibernate.jdbc.fetch_size=50

# Logging
spring.jpa.properties.hibernate.generate_statistics=false
logging.level.org.hibernate=INFO
logging.level.org.hibernate.type.descriptor.sql.BasicBinder=TRACE

# ==============================================================
# Logging Configuration
# ==============================================================
logging.level.root=INFO
logging.level.com.example.findora=DEBUG
logging.level.org.springframework.web=DEBUG
logging.level.org.springframework.security=DEBUG
logging.pattern.console=%d{yyyy-MM-dd HH:mm:ss} - %msg%n
logging.file.name=logs/findora.log
logging.file.max-size=10MB
logging.file.max-history=30

# ==============================================================
# Security Configuration
# ==============================================================
security.jwt.secret=your-secret-key-change-this-in-production-with-at-least-32-characters
security.jwt.expiration=86400000
security.jwt.refresh-expiration=604800000

# ==============================================================
# Mail Configuration (for notifications)
# ==============================================================
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true

# ==============================================================
# Application Specific Configuration
# ==============================================================
app.name=Lost and Found Management System
app.version=1.0.0
app.timezone=Asia/Colombo

# File Upload
app.upload.dir=/uploads
app.upload.max-size=5242880

# ==============================================================
# Development/Production Profile
# ==============================================================
# Uncomment for production
# spring.profiles.active=prod
```

### 2. Create application-dev.properties (Development)

Create `src/main/resources/application-dev.properties`:

```properties
# Development-specific configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
logging.level.root=DEBUG
logging.level.org.springframework.web=DEBUG
```

### 3. Create application-prod.properties (Production)

Create `src/main/resources/application-prod.properties`:

```properties
# Production-specific configuration
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
logging.level.root=WARN
logging.level.com.example.findora=INFO

# Enable security features
security.jwt.secret=${JWT_SECRET:change-me}
spring.datasource.url=${DB_URL:jdbc:mysql://localhost:3306/findora}
spring.datasource.username=${DB_USERNAME:findora_user}
spring.datasource.password=${DB_PASSWORD:password}
```

### 4. Update pom.xml (if needed)

Ensure these dependencies are present:

```xml
<dependencies>
    <!-- Spring Boot Starters -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
    
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-mail</artifactId>
    </dependency>
    
    <!-- Database -->
    <dependency>
        <groupId>com.mysql</groupId>
        <artifactId>mysql-connector-j</artifactId>
        <scope>runtime</scope>
    </dependency>
    
    <!-- Lombok -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>
    
    <!-- JWT (for authentication) -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.12.3</version>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-impl</artifactId>
        <version>0.12.3</version>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-jackson</artifactId>
        <version>0.12.3</version>
        <scope>runtime</scope>
    </dependency>
    
    <!-- Development Tools -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-devtools</artifactId>
        <scope>runtime</scope>
        <optional>true</optional>
    </dependency>
    
    <!-- Testing -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

---

## Environment Variables Setup

### Windows (System Variables)

```batch
# Set system environment variables
setx DB_URL "jdbc:mysql://localhost:3306/findora"
setx DB_USERNAME "findora_user"
setx DB_PASSWORD "your_password"
setx JWT_SECRET "your-secret-key-min-32-chars"
```

### Linux/macOS (.env file or export)

```bash
# Create .env file or add to ~/.bashrc or ~/.zshrc
export DB_URL="jdbc:mysql://localhost:3306/findora"
export DB_USERNAME="findora_user"
export DB_PASSWORD="your_password"
export JWT_SECRET="your-secret-key-min-32-chars"

# Apply changes
source ~/.bashrc  # or source ~/.zshrc for macOS
```

---

## Running the Application

### Development Mode

```bash
# Navigate to backend directory
cd backend

# Build the project
mvn clean install

# Run with Maven
mvn spring-boot:run

# Or run JAR file
java -jar target/findora-0.0.1-SNAPSHOT.jar
```

### Development with IDE

**IntelliJ IDEA**:
1. Open project in IntelliJ
2. File → Project Structure → SDK (Select Java 17+)
3. Right-click on project → Run/Debug
4. Select FindoraApplication main class
5. Click Run

**Eclipse**:
1. File → Import → Existing Maven Projects
2. Right-click project → Run As → Spring Boot App

**VS Code**:
```bash
# Install Extension Pack for Java
# Then use the Run & Debug tab to launch the application
```

### Docker (Optional)

Create `Dockerfile`:
```dockerfile
FROM openjdk:17-jdk-slim
COPY target/findora-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
```

Build and run:
```bash
mvn clean package
docker build -t findora:latest .
docker run -p 8080:8080 findora:latest
```

---

## Verifying Installation

### Check Database Connection

```bash
# Test MySQL connection
mysql -u findora_user -p findora -e "SELECT VERSION();"
```

### Health Check API

After starting the application:

```bash
# Check application health
curl http://localhost:8080/api/actuator/health

# Expected response:
# {"status":"UP"}
```

### Verify Tables

```bash
mysql -u findora_user -p findora -e "SHOW TABLES;"

# Should show:
# claims
# items
# messages
# notifications
# reports
# security_transactions
# users
```

---

## Troubleshooting

### Issue: Connection timeout
**Solution**:
```properties
# Add to application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/findora?autoReconnect=true&useUnicode=true&useSSL=false&serverTimezone=UTC
```

### Issue: Timezone error
**Solution**:
```bash
# MySQL Server Time Zone Configuration
mysql> SET GLOBAL time_zone = 'Asia/Colombo';
mysql> SELECT @@global.time_zone, @@session.time_zone;
```

### Issue: "No suitable driver found"
**Solution**:
```xml
<!-- Ensure in pom.xml -->
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
</dependency>
```

### Issue: Hibernate DDL Auto error
**Solution**:
- Use `validate` in production (schema must already exist)
- Use `update` in development
- Use `create-drop` for testing only

### Issue: Port already in use
**Solution**:
```properties
# Change port in application.properties
server.port=8081
```

### Issue: Out of Memory
**Solution**:
```bash
# Increase heap size
java -Xmx1024m -Xms512m -jar target/findora-0.0.1-SNAPSHOT.jar
```

---

## Performance Optimization

### Database Connection Pooling

```properties
# HikariCP Configuration (Default in Spring Boot)
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.idle-timeout=600000
spring.datasource.hikari.connection-timeout=20000
```

### Query Optimization

```properties
# Batch insert/update
spring.jpa.properties.hibernate.jdbc.batch_size=20
spring.jpa.properties.hibernate.order_inserts=true
spring.jpa.properties.hibernate.order_updates=true

# Fetch size
spring.jpa.properties.hibernate.jdbc.fetch_size=50
```

### Caching

```properties
# Spring Cache Configuration
spring.cache.type=simple
# Or: spring.cache.type=redis (for distributed caching)
```

---

## Security Checklist

- [ ] Change JWT secret to a secure 32+ character value
- [ ] Use HTTPS in production (configure application-prod.properties)
- [ ] Set secure database password
- [ ] Create non-root database user with limited privileges
- [ ] Enable CORS only for trusted frontend URLs
- [ ] Use environment variables for sensitive data
- [ ] Implement rate limiting
- [ ] Enable SQL logging only in development
- [ ] Regularly update dependencies
- [ ] Use prepared statements (JPA does this automatically)

---

## Deployment Checklist

### Pre-Deployment
- [ ] All errors resolved
- [ ] All tests passing
- [ ] Database schema validated
- [ ] Environment variables configured
- [ ] Security review completed
- [ ] Performance testing completed

### Deployment
- [ ] Create production database backup
- [ ] Run database migrations
- [ ] Deploy application
- [ ] Verify logs
- [ ] Run health checks
- [ ] Monitor performance

### Post-Deployment
- [ ] Monitor error logs
- [ ] Check database queries
- [ ] Verify notifications working
- [ ] Test with real data
- [ ] Document deployment

---

## Useful Commands

```bash
# Build without running tests
mvn clean package -DskipTests

# Run specific test
mvn test -Dtest=UserRepositoryTest

# Generate dependency tree
mvn dependency:tree

# Check for security vulnerabilities
mvn dependency-check:check

# Format code
mvn spotless:apply

# Generate javadoc
mvn javadoc:javadoc
```

---

## Next Steps

1. ✅ Configure database connection
2. ✅ Configure application properties
3. ✅ Run database schema script
4. ✅ Start Spring Boot application
5. ✅ Verify health checks
6. ✅ Create REST controllers
7. ✅ Implement business logic services
8. ✅ Add authentication/authorization
9. ✅ Write unit tests
10. ✅ Deploy to production

---

