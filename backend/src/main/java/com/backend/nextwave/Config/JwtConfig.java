package com.backend.nextwave.Config;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtConfig {

    private static final String SECRET_KEY_STRING = "manishpatidarmanishpatidarimaidhfaohfaishdfahsdfhsdfhsdjsdfhkjasdhflkjshfdlakjshdflkjhdsalkfjhdlskjfhaldskjfhl";
    private final Key SECRET_KEY = Keys.hmacShaKeyFor(SECRET_KEY_STRING.getBytes());


    public String generateToken(String username) {

        return Jwts.builder().setSubject(username).
                setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 300 * 5000))
                .signWith(SECRET_KEY)
                .compact();
    }

    public boolean validateToken(String token, String email) {
        try {
            Jwts.parserBuilder().setSigningKey(SECRET_KEY).build().parseClaimsJws(token);
            return email.equals(extractEmail(token));
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return false;
        }

    }

    public String extractEmail(String token) {
        Claims claims = extractClaims(token);
        return claims.getSubject();
    }

    public Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

}