package com.findora.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.findora.model.User;
import com.findora.repository.UserRepository;

/**
 * DataInitializer - Seeds default users on first startup.
 * Creates admin, security officer, student, and staff demo accounts
 * only if they do not already exist.
 *
 * CREDENTIALS (change in production):
 *   admin    / admin123
 *   security1/ security123
 *   student1 / student123
 *   staff1   / staff123
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedUser("admin",     "admin@findora.lk",    "admin123",    "System Admin",    "Admin001", User.UserRole.ADMIN);
        seedUser("security1", "security@findora.lk", "security123", "Security Officer","SEC001",   User.UserRole.SECURITY);
        seedUser("student1",  "student@findora.lk",  "student123",  "Demo Student",    "STU001",   User.UserRole.STUDENT);
        seedUser("staff1",    "staff@findora.lk",    "staff123",    "Demo Staff",      "STA001",   User.UserRole.STAFF);
        log.info("DataInitializer completed. Default accounts ready.");
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
