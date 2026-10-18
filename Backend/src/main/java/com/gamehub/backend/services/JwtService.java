package com.gamehub.backend.services;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.gamehub.backend.entity.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;


@Service 
public class JwtService {
    private final SecretKey key;
    private final long expirationMs;

    public JwtService(@Value("${jwt.secret}")String secret,
                      @Value("${jwt.expiration-ms}")long expirationMs){
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMs = expirationMs;
    }

    public String generateToken(User user){
        Date now = new Date();
        String token = Jwts.builder()
                           .subject(String.valueOf(user.getId()))
                           .claim("username", user.getUsername())
                           .issuedAt(now)
                           .expiration(new Date(now.getTime() + expirationMs))
                           .signWith(key)
                           .compact();

        return token;
    }

    public Claims parseToken(String token){
        Claims claims = Jwts.parser()
                            .verifyWith(key)
                            .build()
                            .parseSignedClaims(token)
                            .getPayload();
        return claims;
    }
}
