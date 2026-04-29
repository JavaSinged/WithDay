package com.test.withdayback.config;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Base64;
import java.util.Date;

@Component
@RequiredArgsConstructor // UserDetailsService 주입을 위해 추가
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String secretKey;

    private final long tokenValidTime = 24 * 60 * 60 * 1000L; // 24시간
    private final UserDetailsService userDetailsService; // 추가: DB 사용자 조회를 위함
    private Key key;

    @PostConstruct
    protected void init() {
        // 보안을 위해 키를 Base64로 인코딩하여 Key 객체 생성
        byte[] keyBytes = Base64.getEncoder().encode(secretKey.getBytes());
        this.key = Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * 1. JWT 토큰 생성
     */
    public String createToken(String username) {
        Claims claims = Jwts.claims().setSubject(username); // JWT payload 에 저장되는 정보단위
        Date now = new Date();
        Date validity = new Date(now.getTime() + tokenValidTime);

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(validity)
                .signWith(key, SignatureAlgorithm.HS256) // HS256 알고리즘 사용
                .compact();
    }

    /**
     * 2. JWT 토큰에서 인증 정보 조회 (핵심 추가 파트)
     */
    public Authentication getAuthentication(String token) {
        // 토큰에서 username 추출
        String username = this.getUsername(token);

        // Spring Security의 UserDetails 로드
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);

        // 인증 객체 생성 (비밀번호는 보안상 빈 문자열로 둠)
        return new UsernamePasswordAuthenticationToken(userDetails, "", userDetails.getAuthorities());
    }

    /**
     * 3. 토큰에서 회원 정보 추출
     */
    public String getUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    /**
     * 4. 토큰의 유효성 + 만료일자 확인
     */
    public boolean validateToken(String token) {
        try {
            Jws<Claims> claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            return !claims.getBody().getExpiration().before(new Date());
        } catch (SecurityException | MalformedJwtException e) {
            // 잘못된 JWT 서명일 때
        } catch (ExpiredJwtException e) {
            // 만료된 토큰일 때
        } catch (UnsupportedJwtException e) {
            // 지원되지 않는 토큰일 때
        } catch (IllegalArgumentException e) {
            // 토큰이 비어있을 때
        }
        return false;
    }
}