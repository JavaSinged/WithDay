package com.test.withdayback.user.service;

import com.test.withdayback.user.dao.EmailVerificationDao;
import com.test.withdayback.user.dao.UserAgreementDao;
import com.test.withdayback.user.dao.UserDao;
import com.test.withdayback.user.dto.SignupRequest;
import com.test.withdayback.user.entity.EmailVerification;
import com.test.withdayback.user.entity.User;
import com.test.withdayback.user.entity.UserAgreement;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails; // 추가
import org.springframework.security.core.userdetails.UserDetailsService; // 추가
import org.springframework.security.core.userdetails.UsernameNotFoundException; // 추가
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService { // 인터페이스 구현 추가

    private final UserDao userDao;
    private final UserAgreementDao agreementDao;
    private final BCryptPasswordEncoder passwordEncoder;
    private final EmailVerificationDao verificationDao;

    /**
     * [시큐리티 필수 메서드] 토큰의 username으로 DB 유저 조회
     */
    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userDao.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + username));

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getUsername())
                .password(user.getPassword() != null ? user.getPassword() : "")
                .authorities(user.getRole() != null ? user.getRole() : "ROLE_USER")
                .build();
    }

    /**
     * 로컬 회원가입
     */
    @Transactional
    public void registerUser(SignupRequest request) {
        System.out.println("회원가입 요청 비번: " + request.getPassword());

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .gender(User.Gender.valueOf(request.getGender().toUpperCase()))
                .birthDate(LocalDate.parse(request.getBirthDate()))
                .role("ROLE_USER") // 기본 권한 설정
                .build();

        userDao.save(user);

        UserAgreement agreement = UserAgreement.builder()
                .user(user)
                .termsAgreed(request.isTermsAgreed())
                .privacyAgreed(request.isPrivacyAgreed())
                .infoAgreed(request.isInfoAgreed())
                .marketingAgreed(request.isMarketingAgreed())
                .build();

        agreementDao.save(agreement);
    }

    @Transactional(readOnly = true)
    public boolean isUsernameAvailable(String username) {
        return !userDao.existsByUsername(username);
    }

    @Transactional(readOnly = true)
    public boolean isEmailAvailable(String email) {
        return !userDao.existsByEmail(email);
    }

    @Transactional
    public void saveEmailVerification(String email, String code) {
        EmailVerification verification = EmailVerification.builder()
                .email(email)
                .code(code)
                .expiryDate(LocalDateTime.now().plusMinutes(5))
                .build();
        verificationDao.save(verification);
    }

    @Transactional
    public boolean verifyEmailCode(String email, String code) {
        EmailVerification verification = verificationDao.findById(email).orElse(null);
        if (verification == null || verification.getExpiryDate().isBefore(LocalDateTime.now())) {
            return false;
        }
        boolean isMatched = verification.getCode().equals(code);
        if (isMatched) {
            verificationDao.delete(verification);
        }
        return isMatched;
    }
}