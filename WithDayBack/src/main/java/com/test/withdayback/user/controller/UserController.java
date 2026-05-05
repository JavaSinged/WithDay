package com.test.withdayback.user.controller;

import com.test.withdayback.user.dto.SignupRequestDTO;
import com.test.withdayback.user.vo.User;
import com.test.withdayback.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map; //

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping(value = "/signup", consumes = {"multipart/form-data"})
    public ResponseEntity<String> signup(
            @RequestPart("signupData") SignupRequestDTO signupRequest,
            @RequestPart(value = "profileImage", required = false) MultipartFile profileImage) {
        String result = userService.signup(signupRequest, profileImage);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user) {

        // 💡 서비스에서 넘어온 보따리(Map) 받기
        Map<String, Object> loginResult = userService.login(user.getEmail(), user.getPassword());

        if (loginResult != null) {
            return ResponseEntity.ok(loginResult); // 프론트로 JSON 형태로 날아감!
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("이메일 또는 비밀번호가 틀렸습니다.");
        }
    }
}