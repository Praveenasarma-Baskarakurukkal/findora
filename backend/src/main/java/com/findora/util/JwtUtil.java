package com.findora.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * JWT (JSON Web Token) utility class for token generation and validation.
 * 
 * Handles:
 * - Token generation using HS256 algorithm
 * - Token validation and claim extraction
 * - Username extraction from tokens
 * 
 * Configuration:
 * - JWT secret key read from 'jwt.secret' property
 * - Token expiration time read from 'jwt.expiration' property (in milliseconds)
 */
@Component
public class JwtUtil {

    @Value("${jwt.secret:your-secret-key-change-this-in-production}")
    private String secret;

    @Value("${jwt.expiration:86400000}")
    private long expiration; // in milliseconds (default: 24 hours)

    /**
     * Generate a JWT token for the given username.
     *
     * @param username the username to include in the token
     * @return JWT token string
     */
    public String generateToken(String username) {
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, username);
    }

    /**
     * Generate a JWT token with additional claims.
     *
     * @param claims additional claims to include in the token
     * @param username the username to include in the token
     * @return JWT token string
     */
    public String generateToken(Map<String, Object> claims, String username) {
        return createToken(claims, username);
    }

    /**
     * Extract username from JWT token.
     *
     * @param token JWT token string
     * @return username from the token
     */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Extract expiration date from JWT token.
     *
     * @param token JWT token string
     * @return expiration date of the token
     */
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * Generic method to extract a specific claim from JWT token.
     *
     * @param token JWT token string
     * @param claimsResolver function to extract the desired claim
     * @param <T> the type of the claim
     * @return the extracted claim value
     */
    public <T> T extractClaim(String token, java.util.function.Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Validate JWT token.
     *
     * @param token JWT token string
     * @param username username to validate against
     * @return true if token is valid and not expired, false otherwise
     */
    public Boolean validateToken(String token, String username) {
        final String tokenUsername = extractUsername(token);
        return (tokenUsername.equals(username) && !isTokenExpired(token));
    }

    /**
     * Validate JWT token format and signature (without username check).
     *
     * @param token JWT token string
     * @return true if token is valid and not expired, false otherwise
     */
    public Boolean validateToken(String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(secret.getBytes());
            Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token);
            return !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Create JWT token with claims and subject (username).
     *
     * @param claims map of claims to include in the token
     * @param subject the subject (username) of the token
     * @return JWT token string
     */
    private String createToken(Map<String, Object> claims, String subject) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);
        SecretKey key = Keys.hmacShaKeyFor(secret.getBytes());

        return Jwts.builder()
                .claims(claims)
                .subject(subject)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(key)
                .compact();
    }

    /**
     * Extract all claims from JWT token.
     *
     * @param token JWT token string
     * @return all claims from the token
     */
    private Claims extractAllClaims(String token) {
        SecretKey key = Keys.hmacShaKeyFor(secret.getBytes());
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * Check if JWT token is expired.
     *
     * @param token JWT token string
     * @return true if token is expired, false otherwise
     */
    private Boolean isTokenExpired(String token) {
        try {
            final Date expiration = extractExpiration(token);
            return expiration.before(new Date());
        } catch (Exception e) {
            return true;
        }
    }

    /**
     * Get the configured expiration time in milliseconds.
     *
     * @return expiration time in milliseconds
     */
    public long getExpiration() {
        return expiration;
    }

    /**
     * Get the configured secret key.
     *
     * @return secret key
     */
    public String getSecret() {
        return secret;
    }
}
