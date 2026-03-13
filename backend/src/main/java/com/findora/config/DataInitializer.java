package com.findora.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.findora.model.User;
import com.findora.repository.UserRepository;

/**
 * DataInitializer - Seeds default users on first startup.
 * Demo users are created only when seeding is enabled and passwords are
 * provided via environment-backed properties.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final boolean seedUsersEnabled;
    private final String adminPassword;
    private final String securityPassword;
    private final String studentPassword;
    private final String staffPassword;

    public DataInitializer(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            @Value("${app.seed.users.enabled:false}") boolean seedUsersEnabled,
            @Value("${app.seed.admin-password:}") String adminPassword,
            @Value("${app.seed.security-password:}") String securityPassword,
            @Value("${app.seed.student-password:}") String studentPassword,
            @Value("${app.seed.staff-password:}") String staffPassword) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.seedUsersEnabled = seedUsersEnabled;
        this.adminPassword = adminPassword;
        this.securityPassword = securityPassword;
        this.studentPassword = studentPassword;
        this.staffPassword = staffPassword;
    }

    @Override
    public void run(String... args) {
        if (!seedUsersEnabled) {
            log.info("Demo user seeding is disabled.");
            return;
        }

        if (isBlank(adminPassword) || isBlank(securityPassword) || isBlank(studentPassword) || isBlank(staffPassword)) {
            log.warn("Demo user seeding skipped because one or more seed passwords are missing.");
            return;
        }

        seedUser("admin",     "admin@findora.lk",    adminPassword,    "System Admin",     "Admin001", User.UserRole.ADMIN);
        seedUser("security1", "security@findora.lk", securityPassword, "Security Officer", "SEC001",   User.UserRole.SECURITY);
        seedUser("student1",  "student@findora.lk",  studentPassword,  "Demo Student",     "STU001",   User.UserRole.STUDENT);
        seedUser("staff1",    "staff@findora.lk",    staffPassword,    "Demo Staff",       "STA001",   User.UserRole.STAFF);
        log.info("DataInitializer completed. Demo accounts ready.");
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private void seedUser(String username, String email, String rawPassword,
                          String fullName, String phone, User.UserRole role) {
        if (userRepository.existsByUsername(username)) {
            return; // Already exists, skip
        }
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(rawPassword));
        user.setFullName(fullName);
        user.setPhone(phone);
        user.setRole(role);
        user.setIsVerified(true);
        user.setIsApproved(true);
        user.setIsBanned(false);
        user.setIsSuspended(false);
        userRepository.save(user);
        log.info("Seeded user: {} [{}]", username, role);
    }
}
