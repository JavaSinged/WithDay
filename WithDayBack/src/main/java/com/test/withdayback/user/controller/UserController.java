package com.test.withdayback.user.controller;

import com.test.withdayback.user.dao.UserDao;
import com.test.withdayback.user.dto.SignupRequest;
import com.test.withdayback.user.service.EmailService;
import com.test.withdayback.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

//@CrossOrigin("*")
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final EmailService emailService;
    private final UserDao userDao; // 주입 추가

    /**
     * 1. 로컬 회원가입
     */
    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody SignupRequest request) {
        userService.registerUser(request);
        return ResponseEntity.ok("회원가입 성공!");
    }

    /**
     * 2. 아이디 중복 체크
     */
    @GetMapping("/check-id")
    public ResponseEntity<Map<String, Boolean>> checkUsername(@RequestParam String username) {
        boolean isAvailable = userService.isUsernameAvailable(username);
        return ResponseEntity.ok(Map.of("isDuplicated", !isAvailable));
    }

    /**
     * 3. 이메일 중복 체크 및 인증번호 발송
     */
    @GetMapping("/check-email")
    public ResponseEntity<?> checkEmail(@RequestParam String email) {
        boolean isAvailable = userService.isEmailAvailable(email);

        if (!isAvailable) {
            return ResponseEntity.ok(Map.of("isDuplicated", true));
        }

        try {
            String code = emailService.generateVerificationCode();
            emailService.sendEmail(email, code);
            userService.saveEmailVerification(email, code);

            return ResponseEntity.ok(Map.of(
                    "isDuplicated", false,
                    "message", "인증번호가 발송되었습니다."
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("message", "이메일 발송 중 오류가 발생했습니다."));
        }
    }

    /**
     * 4. 이메일 인증번호 확인
     */
    @PostMapping("/verify-code")
    public ResponseEntity<?> verifyCode(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String code = request.get("code");

        boolean isValid = userService.verifyEmailCode(email, code);

        if (isValid) {
            return ResponseEntity.ok(Map.of("success", true, "message", "인증되었습니다."));
        } else {
            return ResponseEntity.status(400).body(Map.of("success", false, "message", "번호가 틀렸거나 만료되었습니다."));
        }
    }

    /**
     * 5. 내 정보 조회 (로그인 상태 확인용)
     * 이 API는 Header에 Authorization: Bearer [토큰]이 있어야 작동합니다.
     */
    @GetMapping("/me")
    public ResponseEntity<?> getMyInfo(Authentication authentication) {
        // 1. 시큐리티 컨텍스트에서 인증 정보가 없는 경우 처리
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("로그인이 필요합니다.");
        }

        // 2. 인증 객체에서 username 추출
        String username = authentication.getName();

        // 3. DB에서 유저 조회 및 반환
        return userDao.findByUsername(username)
                .map(user -> ResponseEntity.ok(Map.of(
                        "username", user.getUsername(),
                        "name", user.getName(),
                        "email", user.getEmail(),
                        "role", user.getRole()
                )))
                .orElseGet(() -> ResponseEntity.status(404).body(Map.of("message", "유저를 찾을 수 없습니다.")));
    }
}