package com.test.withdayback.user.service;

import com.test.withdayback.config.JwtTokenProvider;
import com.test.withdayback.user.dao.UserDao;
import com.test.withdayback.user.dto.LoginRequest;
import com.test.withdayback.user.dto.LoginResponse;
import com.test.withdayback.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserDao userDao;
    private final BCryptPasswordEncoder passwordEncoder; // SecurityConfig에서 등록한 빈
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        // 1. 아이디로 사용자 조회 (요청하신 부분)
        User user = userDao.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        // 디버깅용 로그 추가
        System.out.println("입력된 비밀번호: " + request.getPassword());
        System.out.println("DB에 저장된 비밀번호: " + user.getPassword());

        // 2. 비밀번호 일치 여부 확인
        // rawPassword(입력값)와 encodedPassword(DB값)를 비교해야 합니다.
        if (!passwordEncoder.matches(request.getPassword().trim(), user.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        // 3. 로그인 성공 시 JWT 토큰 생성
        String token = jwtTokenProvider.createToken(user.getUsername());

        // 4. 프론트로 보낼 응답 객체 생성 (사용자 이름 등 포함)
        return new LoginResponse(token, user.getUsername(), user.getName());
    }
}